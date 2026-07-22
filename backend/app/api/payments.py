"""PayFast integration for the advisory fee.

Flow:
  1. Frontend POSTs /api/payments/initiate with a request_id.
  2. We create a Payment row and return the PayFast URL + signed form fields.
  3. Frontend renders a hidden form and submits it -> buyer pays on PayFast.
  4. PayFast calls our ITN webhook (/api/payments/notify) server-to-server.
  5. We mark the payment complete and activate the service request.

Docs: https://developers.payfast.co.za/docs
"""

import hashlib
import uuid
from urllib.parse import quote_plus

from flask import Blueprint, current_app, g, jsonify, request

from ..auth import require_role
from ..extensions import db
from ..models import Payment, ServiceRequest, utcnow

payments_bp = Blueprint("payments", __name__)

PAYFAST_LIVE_URL = "https://www.payfast.co.za/eng/process"
PAYFAST_SANDBOX_URL = "https://sandbox.payfast.co.za/eng/process"


def _payfast_signature(fields: dict, passphrase: str) -> str:
    # PayFast signature: URL-encoded key=value pairs in the given field order,
    # passphrase appended last, then md5.
    parts = [f"{k}={quote_plus(str(v).strip())}" for k, v in fields.items() if str(v).strip()]
    if passphrase:
        parts.append(f"passphrase={quote_plus(passphrase)}")
    return hashlib.md5("&".join(parts).encode()).hexdigest()


@payments_bp.post("/initiate")
@require_role("buyer")
def initiate_payment():
    data = request.get_json(silent=True) or {}
    try:
        request_id = uuid.UUID(str(data.get("request_id")))
    except (ValueError, TypeError):
        return jsonify({"error": "Valid request_id is required"}), 400

    req = ServiceRequest.query.get_or_404(request_id)
    if req.buyer_id != g.user_id:
        return jsonify({"error": "Not found"}), 404
    if req.status != "pending_payment":
        return jsonify({"error": "Request is not awaiting payment"}), 400

    cfg = current_app.config
    payment = Payment(
        request_id=req.id,
        provider="payfast",
        amount_cents=req.advisory_fee_cents,
    )
    db.session.add(payment)
    db.session.commit()

    amount_rands = f"{req.advisory_fee_cents / 100:.2f}"
    service_label = (
        "Expert consulting" if req.service_type == "consulting" else "Quote comparison"
    )
    fields = {
        "merchant_id": cfg["PAYFAST_MERCHANT_ID"],
        "merchant_key": cfg["PAYFAST_MERCHANT_KEY"],
        "return_url": f"{cfg['FRONTEND_URL']}/payment/success",
        "cancel_url": f"{cfg['FRONTEND_URL']}/payment/cancelled",
        "notify_url": f"{request.url_root.rstrip('/')}/api/payments/notify",
        "name_first": g.profile.first_name,
        "email_address": g.profile.email,
        "m_payment_id": str(payment.id),
        "amount": amount_rands,
        "item_name": f"Cloud9 Partners — {service_label} advisory fee",
    }
    fields["signature"] = _payfast_signature(fields, cfg["PAYFAST_PASSPHRASE"])

    return jsonify(
        {
            "payment_id": str(payment.id),
            "process_url": PAYFAST_SANDBOX_URL if cfg["PAYFAST_SANDBOX"] else PAYFAST_LIVE_URL,
            "fields": fields,
        }
    )


@payments_bp.post("/notify")
def payfast_notify():
    """PayFast ITN webhook (server-to-server, no user auth).

    NOTE: before going live, also validate the ITN by posting it back to
    PayFast's /eng/query/validate endpoint and checking the source IP range.
    """
    data = request.form.to_dict()

    posted_signature = data.pop("signature", "")
    expected = _payfast_signature(data, current_app.config["PAYFAST_PASSPHRASE"])
    if posted_signature != expected:
        return jsonify({"error": "Invalid signature"}), 400

    try:
        payment_id = uuid.UUID(data.get("m_payment_id", ""))
    except ValueError:
        return jsonify({"error": "Unknown payment"}), 400

    payment = Payment.query.get(payment_id)
    if payment is None:
        return jsonify({"error": "Unknown payment"}), 400

    status = data.get("payment_status", "")
    if status == "COMPLETE":
        payment.status = "complete"
        payment.provider_reference = data.get("pf_payment_id")
        payment.completed_at = utcnow()
        payment.request.status = "active"
    elif status == "CANCELLED":
        payment.status = "cancelled"
    else:
        payment.status = "failed"
    db.session.commit()
    return "", 200


@payments_bp.get("/<uuid:payment_id>")
@require_role("buyer", "admin")
def get_payment(payment_id: uuid.UUID):
    payment = Payment.query.get_or_404(payment_id)
    if g.profile.role != "admin" and payment.request.buyer_id != g.user_id:
        return jsonify({"error": "Not found"}), 404
    return jsonify(payment.to_dict())
