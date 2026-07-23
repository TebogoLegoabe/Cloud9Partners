"""Supabase access-token verification for protected API routes."""

import json
import uuid
from functools import wraps
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import jwt
from flask import current_app, g, jsonify, request

from .models import Profile


def _verify_with_supabase(token: str) -> dict:
    """Validate a token against Supabase Auth without needing a legacy JWT secret."""
    base_url = current_app.config["SUPABASE_URL"].rstrip("/")
    publishable_key = current_app.config["SUPABASE_PUBLISHABLE_KEY"]
    if not base_url or not publishable_key:
        raise ValueError("Supabase authentication is not configured")

    auth_request = Request(
        f"{base_url}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {token}",
            "apikey": publishable_key,
            "Accept": "application/json",
        },
    )
    try:
        with urlopen(auth_request, timeout=8) as response:
            user = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise jwt.InvalidTokenError("Supabase rejected the token") from exc

    if not user.get("id"):
        raise jwt.InvalidTokenError("Supabase returned an invalid user")
    return {
        "sub": user["id"],
        "email": user.get("email", ""),
        "role": user.get("role", "authenticated"),
        "aud": user.get("aud", "authenticated"),
        "user_metadata": user.get("user_metadata") or {},
    }


def _decode_token(token: str) -> dict:
    secret = current_app.config["SUPABASE_JWT_SECRET"]
    if secret:
        return jwt.decode(token, secret, algorithms=["HS256"], audience="authenticated")
    return _verify_with_supabase(token)


def require_auth(fn):
    """Require a valid Supabase user token and expose its identity on ``g``."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Missing bearer token"}), 401
        try:
            claims = _decode_token(header.removeprefix("Bearer "))
            g.user_id = uuid.UUID(claims["sub"])
        except (jwt.PyJWTError, ValueError, KeyError):
            return jsonify({"error": "Invalid or expired token"}), 401
        g.claims = claims
        return fn(*args, **kwargs)

    return wrapper


def require_role(*roles: str):
    """Require the authenticated user's profile to have one of ``roles``."""

    def decorator(fn):
        @wraps(fn)
        @require_auth
        def wrapper(*args, **kwargs):
            profile = Profile.query.get(g.user_id)
            if profile is None:
                return jsonify({"error": "Profile not found"}), 403
            if profile.role not in roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            g.profile = profile
            return fn(*args, **kwargs)

        return wrapper

    return decorator
