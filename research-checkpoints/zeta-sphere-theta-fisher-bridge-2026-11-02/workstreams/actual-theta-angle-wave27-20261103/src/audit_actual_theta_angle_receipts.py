#!/usr/bin/env python3
"""Independent parsing and integrity audit of the finite angle receipts."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

import flint
from flint import arb


SOURCE = Path(__file__).resolve()
WORKSTREAM = SOURCE.parents[1]
CHECKPOINT = SOURCE.parents[3]
PRIMARY = WORKSTREAM / "results" / "actual_theta_angle_p384.json"
REPLAY = WORKSTREAM / "results" / "actual_theta_angle_replay_p640.json"

EXPECTED_FILES = {
    PRIMARY: "ebd863cd67d3e518a3f9910159a643e85d25b27b84ab78fecff543a62ff54115",
    REPLAY: "8682df0163748549b60f666cb5d89dec3f7ceb2eb3fc1c511626eac1deeb13e9",
}
EXPECTED_VERIFIER_SHA256 = "159bcc5b32afe6e55045e4d9ed009ef0efa481d4758eafa9a8b6c557263055e4"
EXPECTED_INPUTS = {
    "target_archive_sha256": "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536",
    "parent_archive_sha256": "7e62d06a0ba7eec5fd7a80e4e5f63a35cf87875d92d73b04314259ae596ef928",
    "endpoint_certificate_sha256": "6042e7989864e2e64f89989bb82329d2bf3af91fe848bed722496ae364335509",
}
EXPECTED_DEGREES = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
EXPECTED_SIGNS = [
    "zero", "negative", "positive", "positive", "positive",
    "positive", "positive", "positive", "indeterminate", "indeterminate",
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def classify(value: arb) -> str:
    if value > 0:
        return "positive"
    if value < 0:
        return "negative"
    if value == 0:
        return "zero"
    return "indeterminate"


def audit_receipt(path: Path, precision: int) -> tuple[dict[str, object], list[str]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    assert payload["status"] == "finite_interval_angle_diagnostic"
    assert payload["verdict"] == "PARTIAL"
    assert payload["parameters"]["precision_bits"] == precision
    assert payload["parameters"]["degrees"] == EXPECTED_DEGREES
    assert payload["provenance"]["verifier_sha256"] == EXPECTED_VERIFIER_SHA256
    for key, expected in EXPECTED_INPUTS.items():
        assert payload["provenance"][key] == expected

    recorded_integrity = payload.pop("receipt_integrity")
    canonical = json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode()
    assert hashlib.sha256(canonical).hexdigest() == recorded_integrity["payload_sha256"]
    payload["receipt_integrity"] = recorded_integrity

    degrees = [row["degree"] for row in payload["results"]]
    signs = [row["X_sign"] for row in payload["results"]]
    parsed_signs = [classify(arb(row["X"]["arb"])) for row in payload["results"]]
    assert degrees == EXPECTED_DEGREES
    assert signs == EXPECTED_SIGNS
    assert parsed_signs == signs
    conclusion = payload["strict_conclusion"]
    assert conclusion["X_strictly_positive_degrees"] == [5, 7, 9, 11, 13, 15]
    assert conclusion["X_unresolved_degrees"] == [17, 19]
    assert conclusion["X_3_strictly_negative"] is True
    return payload, signs


def main() -> int:
    for path, expected in EXPECTED_FILES.items():
        assert sha256(path) == expected
    primary, primary_signs = audit_receipt(PRIMARY, 384)
    replay, replay_signs = audit_receipt(REPLAY, 640)
    assert primary_signs == replay_signs
    assert primary["strict_conclusion"] == replay["strict_conclusion"]
    assert primary["provenance"] == replay["provenance"]
    assert primary["normalization"] == replay["normalization"]

    receipt = {
        "schema_version": "zsv.actual_theta_angle.receipt_audit.v1",
        "status": "PASS",
        "scope": "Independent receipt integrity, binding, Arb sign, and precision-replay audit",
        "runtime": {
            "python": sys.version,
            "python_flint": flint.__version__,
            "network_used": False,
            "theta_quadrature_recomputed": False,
        },
        "inputs": {
            str(path.relative_to(CHECKPOINT)): sha256(path)
            for path in EXPECTED_FILES
        },
        "checks": {
            "receipt_integrity_valid": True,
            "source_and_archive_bindings_identical": True,
            "arb_balls_reclassify_to_recorded_signs": True,
            "primary_replay_signs_identical": True,
            "strict_conclusions_identical": True,
            "common_signs": dict(zip(map(str, EXPECTED_DEGREES), EXPECTED_SIGNS)),
        },
        "qualification": (
            "Independent receipt parser and classifier; the primary and replay use the same "
            "interval implementation and this does not recompute archived theta quadrature."
        ),
        "nonclaims": [
            "Indeterminate degrees 17 and 19 are not certified negative or zero.",
            "Finite signs do not prove an all-degree angle bound, next pivot, or RH.",
        ],
        "provenance": {
            "auditor": str(SOURCE.relative_to(CHECKPOINT)),
            "auditor_sha256": sha256(SOURCE),
        },
    }
    canonical = json.dumps(receipt, sort_keys=True, separators=(",", ":")).encode()
    receipt["receipt_integrity"] = {
        "definition": "sha256 of compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    output = (
        Path(sys.argv[1]).resolve()
        if len(sys.argv) == 2
        else WORKSTREAM / "results" / "actual_theta_angle_receipt_audit.json"
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": "PASS",
        "output": str(output),
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
