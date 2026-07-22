from flask import Blueprint, g, jsonify, request

from ..auth import require_auth
from ..extensions import db
from ..models import Profile

profiles_bp = Blueprint("profiles", __name__)


@profiles_bp.post("/profiles")
@require_auth
def create_profile():
    """Create the profile row after Supabase signup (buyer by default)."""
    data = request.get_json(silent=True) or {}
    required = ["first_name", "last_name", "phone"]
    missing = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    if Profile.query.get(g.user_id) is not None:
        return jsonify({"error": "Profile already exists"}), 409

    role = data.get("role", "buyer")
    if role not in ("buyer", "sales_rep"):
        return jsonify({"error": "Invalid role"}), 400

    profile = Profile(
        id=g.user_id,
        role=role,
        first_name=data["first_name"].strip(),
        last_name=data["last_name"].strip(),
        email=g.claims.get("email", ""),
        phone=data["phone"].strip(),
    )
    db.session.add(profile)
    db.session.commit()
    return jsonify(profile.to_dict()), 201


@profiles_bp.get("/me")
@require_auth
def get_me():
    profile = Profile.query.get(g.user_id)
    if profile is None:
        return jsonify({"error": "Profile not found"}), 404
    data = profile.to_dict()
    if profile.sales_rep_profile:
        data["sales_rep_profile"] = profile.sales_rep_profile.to_dict()
    return jsonify(data)
