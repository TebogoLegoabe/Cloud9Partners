from flask import Flask, jsonify
from flask_cors import CORS

from .config import Config
from .extensions import db


def create_app(config_class: type[Config] = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(
        app,
        origins=app.config["CORS_ORIGINS"],
        supports_credentials=True,
    )

    from .api.profiles import profiles_bp
    from .api.requests import requests_bp
    from .api.sales_reps import sales_reps_bp
    from .api.admin import admin_bp
    from .api.payments import payments_bp

    app.register_blueprint(profiles_bp, url_prefix="/api")
    app.register_blueprint(requests_bp, url_prefix="/api")
    app.register_blueprint(sales_reps_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"error": "Internal server error"}), 500

    return app
