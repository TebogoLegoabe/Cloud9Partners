import json

from flask import Blueprint, current_app, jsonify, request
from openai import OpenAI

from ..auth import require_role

ai_compare_bp = Blueprint("ai_compare", __name__)

COMPARISON_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "summary": {"type": "string"},
        "car_a": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "power": {"type": "string"},
                "torque": {"type": "string"},
                "drivetrain": {"type": "string"},
                "key_features": {"type": "array", "items": {"type": "string"}},
                "strengths": {"type": "array", "items": {"type": "string"}},
                "tradeoffs": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["name", "power", "torque", "drivetrain", "key_features", "strengths", "tradeoffs"],
            "additionalProperties": False,
        },
        "car_b": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "power": {"type": "string"},
                "torque": {"type": "string"},
                "drivetrain": {"type": "string"},
                "key_features": {"type": "array", "items": {"type": "string"}},
                "strengths": {"type": "array", "items": {"type": "string"}},
                "tradeoffs": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["name", "power", "torque", "drivetrain", "key_features", "strengths", "tradeoffs"],
            "additionalProperties": False,
        },
        "plain_english": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"term": {"type": "string"}, "explanation": {"type": "string"}},
                "required": ["term", "explanation"],
                "additionalProperties": False,
            },
        },
        "verdict": {"type": "string"},
        "best_for_a": {"type": "string"},
        "best_for_b": {"type": "string"},
        "important_note": {"type": "string"},
        "sources": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"label": {"type": "string"}, "url": {"type": "string"}},
                "required": ["label", "url"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["title", "summary", "car_a", "car_b", "plain_english", "verdict", "best_for_a", "best_for_b", "important_note", "sources"],
    "additionalProperties": False,
}


@ai_compare_bp.post("/compare")
@require_role("buyer", "admin")
def compare_cars():
    data = request.get_json(silent=True) or {}
    car_a = str(data.get("car_a", "")).strip()
    car_b = str(data.get("car_b", "")).strip()
    priorities = str(data.get("priorities", "")).strip()
    if len(car_a) < 3 or len(car_b) < 3:
        return jsonify({"error": "Enter two vehicles to compare"}), 400
    if max(len(car_a), len(car_b), len(priorities)) > 300:
        return jsonify({"error": "Comparison details are too long"}), 400

    api_key = current_app.config["OPENAI_API_KEY"]
    if not api_key:
        return jsonify({"error": "Car Compare AI is not configured yet"}), 503

    prompt = f"""Compare these two vehicles for a South African buyer:
Vehicle A: {car_a}
Vehicle B: {car_b}
Buyer priorities: {priorities or 'Not specified'}

Verify the exact model year, engine and trim where possible using web search. Explain power and torque in plain language, not just numbers. Compare everyday performance, safety, comfort, technology, practicality, likely efficiency, warranty/ownership considerations and important feature differences. Never invent a specification: use 'Not reliably confirmed' when sources conflict or the trim is ambiguous. Prices and specifications can vary by market and trim, so clearly flag uncertainty. The verdict must be balanced and based on the buyer's priorities, not brand preference. Prefer official manufacturer sources and reputable South African automotive sources. Return 2 to 5 source links."""

    try:
        client = OpenAI(api_key=api_key, timeout=75.0)
        response = client.responses.create(
            model=current_app.config["OPENAI_COMPARE_MODEL"],
            reasoning={"effort": "low"},
            tools=[{"type": "web_search"}],
            input=[
                {"role": "system", "content": "You are Cloud9 Car Compare AI, an independent vehicle comparison assistant. Be precise, practical and easy to understand."},
                {"role": "user", "content": prompt},
            ],
            text={
                "verbosity": "medium",
                "format": {"type": "json_schema", "name": "car_comparison", "strict": True, "schema": COMPARISON_SCHEMA},
            },
        )
        result = json.loads(response.output_text)
        result["sources"] = [
            source
            for source in result.get("sources", [])
            if str(source.get("url", "")).startswith(("https://", "http://"))
        ]
        result["model"] = current_app.config["OPENAI_COMPARE_MODEL"]
        return jsonify(result)
    except Exception:
        current_app.logger.exception("Car comparison failed")
        return jsonify({"error": "The comparison could not be completed. Please try again."}), 502
