import uuid

from flask import Blueprint, g, jsonify, request

from ..auth import require_role
from ..extensions import db
from ..models import Quote, ServiceRequest

requests_bp = Blueprint("requests", __name__)

SERVICE_TYPES = ("consulting", "quote_comparison")


@requests_bp.post("/requests")
@require_role("buyer", "admin")
def create_request():
    data = request.get_json(silent=True) or {}

    service_type = data.get("service_type")
    if service_type not in SERVICE_TYPES:
        return jsonify({"error": "service_type must be consulting or quote_comparison"}), 400

    budget = data.get("budget")
    if not isinstance(budget, int) or budget <= 0:
        return jsonify({"error": "budget must be a positive integer (Rands)"}), 400

    vehicle = data.get("vehicle") or {}
    req = ServiceRequest(
        buyer_id=g.user_id,
        service_type=service_type,
        vehicle_make=vehicle.get("make"),
        vehicle_model=vehicle.get("model"),
        vehicle_year=vehicle.get("year"),
        vehicle_colour=vehicle.get("colour"),
        vehicle_variant=vehicle.get("variant"),
        vehicle_type=data.get("vehicle_type"),
        preferred_brands=data.get("preferred_brands") or [],
        budget=budget,
        condition=data.get("condition"),
        payment_method=data.get("payment_method"),
        province=data.get("province"),
        timeline=data.get("timeline"),
        contact_method=data.get("contact_method"),
        notes=data.get("notes"),
    )
    db.session.add(req)
    db.session.commit()
    return jsonify(req.to_dict()), 201


@requests_bp.get("/requests")
@require_role("buyer", "admin")
def list_requests():
    query = ServiceRequest.query
    if g.profile.role != "admin":
        query = query.filter_by(buyer_id=g.user_id)
    reqs = query.order_by(ServiceRequest.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reqs])


@requests_bp.get("/requests/<uuid:request_id>")
@require_role("buyer", "admin")
def get_request(request_id: uuid.UUID):
    req = ServiceRequest.query.get_or_404(request_id)
    if g.profile.role != "admin" and req.buyer_id != g.user_id:
        return jsonify({"error": "Not found"}), 404
    return jsonify(req.to_dict(include_quotes=True))


@requests_bp.post("/requests/<uuid:request_id>/quotes/<uuid:quote_id>/accept")
@require_role("buyer")
def accept_quote(request_id: uuid.UUID, quote_id: uuid.UUID):
    req = ServiceRequest.query.get_or_404(request_id)
    if req.buyer_id != g.user_id:
        return jsonify({"error": "Not found"}), 404
    quote = Quote.query.get_or_404(quote_id)
    if quote.request_id != req.id:
        return jsonify({"error": "Quote does not belong to this request"}), 400

    for q in req.quotes:
        q.status = "accepted" if q.id == quote.id else "declined"
    req.status = "completed"
    db.session.commit()
    return jsonify(req.to_dict(include_quotes=True))
