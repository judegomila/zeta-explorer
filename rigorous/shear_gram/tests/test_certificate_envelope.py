import copy

import pytest

from rigorous.shear_gram.certificate import (
    finalize_certificate,
    loads_json_strict,
    verify_certificate,
    verify_hashes,
)
from rigorous.shear_gram.certify import INCONCLUSIVE


def _payload():
    return {
        "schemaVersion": "debranges-gram-certificate/v1",
        "input": {
            "schemaVersion": "debranges-gram-case/v1",
            "id": "synthetic-envelope-test",
            "a": "1/8",
            "nodes": [{"re": "0", "im": "1/4"}],
            "precision_bits": [128],
            "theta_crosscheck": {"enabled": False},
        },
        "status": INCONCLUSIVE,
        "selectedPrecisionBits": 128,
        "finiteGramOnly": True,
        "rhClaim": False,
        "rhSolved": False,
        "claimComplete": False,
        "method": {"xi": "synthetic-test-formula"},
        "attempts": [],
    }


def test_finalized_envelope_hashes_and_honesty_flags_verify():
    certificate = finalize_certificate(_payload())

    assert verify_hashes(certificate) == (True, "hashes-valid")
    result = verify_certificate(certificate, recompute=False)
    assert result.valid is True
    assert result.status == INCONCLUSIVE
    assert result.as_dict()["rhClaim"] is False
    assert result.as_dict()["rhSolved"] is False
    assert result.as_dict()["claimComplete"] is False


def test_payload_tampering_is_detected_before_any_recomputation():
    certificate = finalize_certificate(_payload())
    certificate["input"]["a"] = "1/7"

    ok, reason = verify_hashes(certificate)
    assert ok is False
    assert reason == "input-hash-mismatch"
    assert verify_certificate(certificate, recompute=False).valid is False


@pytest.mark.parametrize(
    ("field", "bad_value", "expected_reason"),
    [
        ("finiteGramOnly", False, "finiteGramOnly-must-be-true"),
        ("rhClaim", True, "rhClaim-must-be-false"),
        ("rhSolved", True, "rhSolved-must-be-false"),
        ("claimComplete", True, "claimComplete-must-be-false"),
        ("status", "RH-PROVED", "unknown-status"),
    ],
)
def test_rehashed_but_dishonest_or_unknown_claim_is_still_rejected(
    field, bad_value, expected_reason
):
    payload = copy.deepcopy(_payload())
    payload[field] = bad_value
    certificate = finalize_certificate(payload)

    assert verify_hashes(certificate) == (True, "hashes-valid")
    result = verify_certificate(certificate, recompute=False)
    assert result.valid is False
    assert result.reason == expected_reason


@pytest.mark.parametrize(
    "text",
    [
        '{"a": "1/8", "a": "1/7"}',
        '{"a": NaN}',
        '{"a": Infinity}',
        '{"a": -Infinity}',
    ],
)
def test_strict_json_loader_rejects_duplicate_or_nonfinite_tokens(text):
    with pytest.raises(ValueError):
        loads_json_strict(text)
