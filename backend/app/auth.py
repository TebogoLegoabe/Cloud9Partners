"""Supabase JWT verification.

The frontend authenticates with Supabase (email/password) and sends the
resulting access token as `Authorization: Bearer <jwt>`. We verify it locally
with the project's JWT secret (HS256) — no network call to Supabase needed.
"""

import uuid
from functools import wraps

import jwt
from flask import current_app, g, jsonify, request

from .models import Profile


def _decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        current_app.config["SUPABASE_JWT_SECRET"],
        algorithms=["HS256"],
        audience="authenticated",
    )


def require_auth(fn):
    """Require a valid Supabase JWT. Sets g.user_id (uuid) and g.claims."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Missing bearer token"}), 401
        try:
            claims = _decode_token(header.removeprefix("Bearer "))
        except jwt.PyJWTError:
            return jsonify({"error": "Invalid or expired token"}), 401
        g.user_id = uuid.UUID(claims["sub"])
        g.claims = claims
        return fn(*args, **kwargs)

    return wrapper


def require_role(*roles: str):
    """Require the authenticated user's profile to have one of `roles`.

    Sets g.profile in addition to what require_auth sets.
    """

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
