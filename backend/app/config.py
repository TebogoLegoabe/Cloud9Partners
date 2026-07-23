import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-secret")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///cloud9_dev.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Supabase's pooler drops idle connections; pre-ping avoids stale ones.
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}

    SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
    SUPABASE_PUBLISHABLE_KEY = os.environ.get("SUPABASE_PUBLISHABLE_KEY", "")
    SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")

    CORS_ORIGINS = [
        o.strip()
        for o in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
        if o.strip()
    ]

    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
    OPENAI_COMPARE_MODEL = os.environ.get("OPENAI_COMPARE_MODEL", "gpt-5.6-terra")

    PAYFAST_MERCHANT_ID = os.environ.get("PAYFAST_MERCHANT_ID", "")
    PAYFAST_MERCHANT_KEY = os.environ.get("PAYFAST_MERCHANT_KEY", "")
    PAYFAST_PASSPHRASE = os.environ.get("PAYFAST_PASSPHRASE", "")
    PAYFAST_SANDBOX = os.environ.get("PAYFAST_SANDBOX", "true").lower() == "true"
