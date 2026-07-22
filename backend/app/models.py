import uuid
from datetime import datetime, timezone

from sqlalchemy.dialects.postgresql import UUID

from .extensions import db


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Profile(db.Model):
    """Mirrors a Supabase auth user. `id` equals auth.users.id."""

    __tablename__ = "profiles"

    id = db.Column(UUID(as_uuid=True), primary_key=True)
    role = db.Column(db.String(20), nullable=False, default="buyer")  # buyer | sales_rep | admin
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    phone = db.Column(db.String(30), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    sales_rep_profile = db.relationship(
        "SalesRepProfile", back_populates="profile", uselist=False
    )
    requests = db.relationship("ServiceRequest", back_populates="buyer")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "role": self.role,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "created_at": self.created_at.isoformat(),
        }


class SalesRepProfile(db.Model):
    """Dealership rep profile. Created pending, approved/rejected by admin."""

    __tablename__ = "sales_rep_profiles"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("profiles.id"), nullable=False, unique=True
    )
    dealership_name = db.Column(db.String(160), nullable=False)
    location = db.Column(db.String(160), nullable=False)
    status = db.Column(
        db.String(20), nullable=False, default="pending"
    )  # pending | approved | rejected
    review_comments = db.Column(db.Text)  # admin comments on rejection
    rep_code = db.Column(db.String(12), unique=True)  # unique ID issued on approval
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    reviewed_at = db.Column(db.DateTime(timezone=True))

    profile = db.relationship("Profile", back_populates="sales_rep_profile")
    quotes = db.relationship("Quote", back_populates="sales_rep")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "profile_id": str(self.profile_id),
            "dealership_name": self.dealership_name,
            "location": self.location,
            "status": self.status,
            "review_comments": self.review_comments,
            "rep_code": self.rep_code,
            "created_at": self.created_at.isoformat(),
            "reviewed_at": self.reviewed_at.isoformat() if self.reviewed_at else None,
        }


class ServiceRequest(db.Model):
    """A buyer's consulting or quote-comparison request (the wizard output)."""

    __tablename__ = "service_requests"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = db.Column(UUID(as_uuid=True), db.ForeignKey("profiles.id"), nullable=False)
    service_type = db.Column(db.String(30), nullable=False)  # consulting | quote_comparison
    status = db.Column(
        db.String(30), nullable=False, default="pending_payment"
    )  # pending_payment | active | quoting | completed | cancelled

    # Specific vehicle (optional)
    vehicle_make = db.Column(db.String(60))
    vehicle_model = db.Column(db.String(60))
    vehicle_year = db.Column(db.String(10))
    vehicle_colour = db.Column(db.String(40))
    vehicle_variant = db.Column(db.String(120))

    # General preferences
    vehicle_type = db.Column(db.String(40))
    preferred_brands = db.Column(db.JSON, default=list)
    budget = db.Column(db.Integer, nullable=False)
    condition = db.Column(db.String(20))  # New | Demo | Either
    payment_method = db.Column(db.String(20))  # Finance | Cash
    province = db.Column(db.String(40))
    timeline = db.Column(db.String(40))
    contact_method = db.Column(db.String(20))
    notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    buyer = db.relationship("Profile", back_populates="requests")
    quotes = db.relationship("Quote", back_populates="request")
    payments = db.relationship("Payment", back_populates="request")

    ADVISORY_FEES = {"consulting": 500_00, "quote_comparison": 750_00}  # cents

    @property
    def advisory_fee_cents(self) -> int:
        return self.ADVISORY_FEES.get(self.service_type, 0)

    def to_dict(self, include_quotes: bool = False) -> dict:
        data = {
            "id": str(self.id),
            "buyer_id": str(self.buyer_id),
            "service_type": self.service_type,
            "status": self.status,
            "vehicle": {
                "make": self.vehicle_make,
                "model": self.vehicle_model,
                "year": self.vehicle_year,
                "colour": self.vehicle_colour,
                "variant": self.vehicle_variant,
            },
            "vehicle_type": self.vehicle_type,
            "preferred_brands": self.preferred_brands or [],
            "budget": self.budget,
            "condition": self.condition,
            "payment_method": self.payment_method,
            "province": self.province,
            "timeline": self.timeline,
            "contact_method": self.contact_method,
            "notes": self.notes,
            "advisory_fee_cents": self.advisory_fee_cents,
            "created_at": self.created_at.isoformat(),
        }
        if include_quotes:
            data["quotes"] = [q.to_dict() for q in self.quotes]
        return data


class Quote(db.Model):
    """A dealer quote submitted against a quote-comparison request."""

    __tablename__ = "quotes"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("service_requests.id"), nullable=False
    )
    sales_rep_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("sales_rep_profiles.id"), nullable=False
    )
    price_cents = db.Column(db.BigInteger, nullable=False)
    interest_rate = db.Column(db.Numeric(5, 2))  # % p.a. if financed
    term_months = db.Column(db.Integer)
    details = db.Column(db.Text)
    status = db.Column(db.String(20), nullable=False, default="submitted")  # submitted | accepted | declined
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    request = db.relationship("ServiceRequest", back_populates="quotes")
    sales_rep = db.relationship("SalesRepProfile", back_populates="quotes")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "request_id": str(self.request_id),
            "sales_rep_id": str(self.sales_rep_id),
            "dealership_name": self.sales_rep.dealership_name if self.sales_rep else None,
            "price_cents": self.price_cents,
            "interest_rate": float(self.interest_rate) if self.interest_rate is not None else None,
            "term_months": self.term_months,
            "details": self.details,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class Payment(db.Model):
    """Advisory-fee payment for a service request (PayFast/Yoco)."""

    __tablename__ = "payments"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = db.Column(
        UUID(as_uuid=True), db.ForeignKey("service_requests.id"), nullable=False
    )
    provider = db.Column(db.String(20), nullable=False, default="payfast")
    amount_cents = db.Column(db.BigInteger, nullable=False)
    status = db.Column(
        db.String(20), nullable=False, default="initiated"
    )  # initiated | complete | failed | cancelled
    provider_reference = db.Column(db.String(120))
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    completed_at = db.Column(db.DateTime(timezone=True))

    request = db.relationship("ServiceRequest", back_populates="payments")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "request_id": str(self.request_id),
            "provider": self.provider,
            "amount_cents": self.amount_cents,
            "status": self.status,
            "provider_reference": self.provider_reference,
            "created_at": self.created_at.isoformat(),
        }
