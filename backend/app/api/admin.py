import secrets
import uuid

from flask import Blueprint, jsonify, request

from ..auth import require_role
from ..extensions import db
from ..models import SalesRepProfile, ServiceRequest, utcnow

admin_bp = Blueprint("admin", __name__)


def _generate_rep_code() -> str:
    """Unique dealer code issued on approval, e.g. C9-4F7A2B."""
    while True:
        code = f"C9-{secrets.token_hex(3).upper()}"
        if SalesRepProfile.query.filter_by(rep_code=code).first() is None:
            return code


@admin_bp.get("/sales-reps")
@require_role("admin")
def list_sales_reps():
    status = request.args.get("status")
    query = SalesRepProfile.query
    if status:
        query = query.filter_by(status=status)
    reps = query.order_by(SalesRepProfile.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reps])


@admin_bp.post("/sales-reps/<uuid:rep_id>/approve")
@require_role("admin")
def approve_sales_rep(rep_id: uuid.UUID):
    rep = SalesRepProfile.query.get_or_404(rep_id)
    if rep.status == "approved":
        return jsonify({"error": "Already approved"}), 409
    rep.status = "approved"
    rep.rep_code = _generate_rep_code()
    rep.review_comments = None
    rep.reviewed_at = utcnow()
    db.session.commit()
    # TODO: email the rep their approval + rep_code (Supabase SMTP / Resend).
    return jsonify(rep.to_dict())


@admin_bp.post("/sales-reps/<uuid:rep_id>/reject")
@require_role("admin")
def reject_sales_rep(rep_id: uuid.UUID):
    rep = SalesRepProfile.query.get_or_404(rep_id)
    data = request.get_json(silent=True) or {}
    comments = str(data.get("comments", "")).strip()
    if not comments:
        return jsonify({"error": "comments are required when rejecting"}), 400
    rep.status = "rejected"
    rep.review_comments = comments
    rep.reviewed_at = utcnow()
    db.session.commit()
    # TODO: email the rep the rejection comments so they can resubmit.
    return jsonify(rep.to_dict())


@admin_bp.get("/requests")
@require_role("admin")
def list_all_requests():
    reqs = ServiceRequest.query.order_by(ServiceRequest.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reqs])


@admin_bp.post("/requests/<uuid:request_id>/status")
@require_role("admin")
def update_request_status(request_id: uuid.UUID):
    req = ServiceRequest.query.get_or_404(request_id)
    data = request.get_json(silent=True) or {}
    status = data.get("status")
    allowed = ("pending_payment", "active", "quoting", "completed", "cancelled")
    if status not in allowed:
        return jsonify({"error": f"status must be one of {allowed}"}), 400
    req.status = status
    db.session.commit()
    return jsonify(req.to_dict())
