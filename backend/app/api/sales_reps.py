import uuid

from flask import Blueprint, g, jsonify, request

from ..auth import require_role
from ..extensions import db
from ..models import Quote, SalesRepProfile, ServiceRequest

sales_reps_bp = Blueprint("sales_reps", __name__)


@sales_reps_bp.post("/sales-reps")
@require_role("sales_rep")
def register_dealership():
    """Submit (or resubmit after rejection) a dealership profile for approval."""
    data = request.get_json(silent=True) or {}
    required = ["dealership_name", "location"]
    missing = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    existing = SalesRepProfile.query.filter_by(profile_id=g.user_id).first()
    if existing is not None:
        if existing.status != "rejected":
            return jsonify({"error": "Dealership profile already submitted"}), 409
        # Resubmission after rejection goes back to pending review.
        existing.dealership_name = data["dealership_name"].strip()
        existing.location = data["location"].strip()
        existing.status = "pending"
        existing.review_comments = None
        db.session.commit()
        return jsonify(existing.to_dict())

    rep = SalesRepProfile(
        profile_id=g.user_id,
        dealership_name=data["dealership_name"].strip(),
        location=data["location"].strip(),
    )
    db.session.add(rep)
    db.session.commit()
    return jsonify(rep.to_dict()), 201


@sales_reps_bp.get("/sales-reps/open-requests")
@require_role("sales_rep")
def list_open_requests():
    """Approved reps see open quote-comparison requests to quote on."""
    rep = SalesRepProfile.query.filter_by(profile_id=g.user_id).first()
    if rep is None or rep.status != "approved":
        return jsonify({"error": "Dealership profile not approved"}), 403

    reqs = (
        ServiceRequest.query.filter_by(service_type="quote_comparison", status="active")
        .order_by(ServiceRequest.created_at.desc())
        .all()
    )
    return jsonify([r.to_dict() for r in reqs])


@sales_reps_bp.post("/sales-reps/requests/<uuid:request_id>/quotes")
@require_role("sales_rep")
def submit_quote(request_id: uuid.UUID):
    rep = SalesRepProfile.query.filter_by(profile_id=g.user_id).first()
    if rep is None or rep.status != "approved":
        return jsonify({"error": "Dealership profile not approved"}), 403

    req = ServiceRequest.query.get_or_404(request_id)
    if req.service_type != "quote_comparison" or req.status not in ("active", "quoting"):
        return jsonify({"error": "Request is not open for quotes"}), 400

    data = request.get_json(silent=True) or {}
    price_cents = data.get("price_cents")
    if not isinstance(price_cents, int) or price_cents <= 0:
        return jsonify({"error": "price_cents must be a positive integer"}), 400

    quote = Quote(
        request_id=req.id,
        sales_rep_id=rep.id,
        price_cents=price_cents,
        interest_rate=data.get("interest_rate"),
        term_months=data.get("term_months"),
        details=data.get("details"),
    )
    req.status = "quoting"
    db.session.add(quote)
    db.session.commit()
    return jsonify(quote.to_dict()), 201
