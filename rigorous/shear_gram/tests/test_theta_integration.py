"""Certificate integration and tamper tests for the optional theta audit."""

from __future__ import annotations

import copy
import json
from pathlib import Path

import pytest

import rigorous.shear_gram.theta as theta_module
from rigorous.shear_gram.certificate import (
    finalize_certificate,
    verify_certificate,
    verify_hashes,
)
from rigorous.shear_gram.certify import (
    CERTIFIED_POSITIVE_FINITE_GRAM,
    certify_spec,
    parse_case,
)
from rigorous.shear_gram.cli import main as cli_main
from rigorous.shear_gram.exact import ExactInputError
from rigorous.shear_gram.theta import ThetaCrosscheckResult


CASE_PATH = Path(__file__).resolve().parents[1] / "cases" / "smoke.json"


def _smoke_case() -> dict:
    return json.loads(CASE_PATH.read_text(encoding="utf-8"))


def _rehash(certificate: dict) -> dict:
    """Rebuild outer hashes while preserving all nested evidence verbatim."""

    payload = copy.deepcopy(certificate)
    payload.pop("hashes", None)
    payload.pop("provenance", None)
    return finalize_certificate(payload)


@pytest.fixture(scope="module")
def smoke_certificate() -> dict:
    case = _smoke_case()
    case["precision_bits"] = [128]
    return certify_spec(case)


def test_requested_smoke_case_records_complete_theta_overlap(smoke_certificate):
    theta = smoke_certificate["thetaCrosscheck"]

    assert theta["requested"] is True
    assert theta["performed"] is True
    assert theta["allNodeEvaluationsCompleted"] is True
    assert theta["allOverlaps"] is True
    assert theta["reason"] == "all-theta-and-completed-xi-enclosures-overlap"
    assert len(theta["nodeChecks"]) == len(smoke_certificate["input"]["nodes"])

    for index, check in enumerate(theta["nodeChecks"]):
        assert check["nodeIndex"] == index
        assert check["performed"] is True
        assert check["overlap"] is True
        assert check["EOverlap"] is True
        assert check["EsharpOverlap"] is True
        assert check["usedForVerdict"] is False
        assert check["finitePointwiseOnly"] is True
        assert check["rhClaim"] is False
        assert check["rhSolved"] is False
        assert check["claimComplete"] is False

    assert theta["usedForVerdict"] is False
    assert theta["finiteGramOnly"] is True
    assert theta["rhClaim"] is False
    assert theta["rhSolved"] is False
    assert theta["claimComplete"] is False


def test_scaled_K_over_a_is_positive_finite_evidence_only(smoke_certificate):
    diagnostic = smoke_certificate["thetaCrosscheck"]["scaledGramDiagnostic"]

    assert diagnostic["label"] == "EVIDENCE-ONLY-THETA-SCALED-GRAM"
    assert diagnostic["performed"] is True
    assert diagnostic["classification"]["status"] == (
        CERTIFIED_POSITIVE_FINITE_GRAM
    )
    assert diagnostic["classification"]["finiteGram"] is True
    assert diagnostic["classification"]["finiteGramOnly"] is True
    assert diagnostic["classification"]["rhClaim"] is False
    assert diagnostic["usedForVerdict"] is False
    assert diagnostic["finiteGramOnly"] is True
    assert diagnostic["rhClaim"] is False
    assert diagnostic["rhSolved"] is False
    assert diagnostic["claimComplete"] is False
    assert diagnostic["gramEnclosure"]["dimension"] == len(
        smoke_certificate["input"]["nodes"]
    )

    result = verify_certificate(smoke_certificate, recompute=False)
    assert result.valid is True


@pytest.mark.parametrize(
    ("path", "expected_reason"),
    [
        (
            ("thetaCrosscheck", "usedForVerdict"),
            "theta-crosscheck-usedForVerdict-must-be-false",
        ),
        (
            ("thetaCrosscheck", "nodeChecks", 0, "usedForVerdict"),
            "dishonest-theta-node-check",
        ),
        (
            ("thetaCrosscheck", "scaledGramDiagnostic", "usedForVerdict"),
            "theta-scaled-usedForVerdict-must-be-false",
        ),
    ],
)
def test_rehashed_used_for_verdict_tampering_is_rejected(
    smoke_certificate, path, expected_reason
):
    tampered = copy.deepcopy(smoke_certificate)
    target = tampered
    for key in path[:-1]:
        target = target[key]
    target[path[-1]] = True
    rehashed = _rehash(tampered)

    assert verify_hashes(rehashed) == (True, "hashes-valid")
    result = verify_certificate(rehashed, recompute=False)
    assert result.valid is False
    assert result.reason == expected_reason


@pytest.mark.parametrize(
    ("field", "bad_value"),
    [
        ("performed", False),
        ("allNodeEvaluationsCompleted", False),
        ("allOverlaps", False),
    ],
)
def test_rehashed_theta_aggregate_mismatch_is_rejected(
    smoke_certificate, field, bad_value
):
    tampered = copy.deepcopy(smoke_certificate)
    tampered["thetaCrosscheck"][field] = bad_value
    rehashed = _rehash(tampered)

    assert verify_hashes(rehashed) == (True, "hashes-valid")
    result = verify_certificate(rehashed, recompute=False)
    assert result.valid is False
    assert result.reason == "theta-crosscheck-aggregate-mismatch"


def test_nested_scaled_gram_hash_tamper_survives_outer_rehash_but_is_rejected(
    smoke_certificate,
):
    tampered = copy.deepcopy(smoke_certificate)
    enclosure = tampered["thetaCrosscheck"]["scaledGramDiagnostic"][
        "gramEnclosure"
    ]
    enclosure["entries"][0][0]["real"]["ball"] = "[999 +/- 1]"
    rehashed = _rehash(tampered)

    ok, reason = verify_hashes(rehashed)
    assert ok is False
    assert reason == "theta-scaled-gram-enclosure-hash-mismatch"


def test_fully_executed_nonoverlap_is_not_mislabeled_and_blocks_scaled_gram(
    monkeypatch,
):
    original_crosscheck = theta_module.theta_completed_xi_crosscheck

    def completed_nonoverlap(*arguments, **keywords):
        # Preserve genuine, finite theta components so the only condition
        # blocking the scaled diagnostic is the completed non-overlap itself.
        original = original_crosscheck(*arguments, **keywords)
        assert original.performed is True
        assert original.components is not None
        return ThetaCrosscheckResult(
            performed=True,
            overlap=False,
            reason="synthetic-completed-nonoverlap",
            E_overlap=True,
            E_sharp_overlap=False,
            components=original.components,
            completed_E=original.completed_E,
            completed_E_sharp=original.completed_E_sharp,
            used_for_verdict=False,
        )

    monkeypatch.setattr(
        theta_module, "theta_completed_xi_crosscheck", completed_nonoverlap
    )
    case = _smoke_case()
    case["precision_bits"] = [128]
    certificate = certify_spec(case)
    theta = certificate["thetaCrosscheck"]

    assert theta["performed"] is True
    assert theta["allNodeEvaluationsCompleted"] is True
    assert theta["allOverlaps"] is False
    assert theta["reason"] == "theta-crosscheck-completed-with-nonoverlap"
    assert all(check["performed"] is True for check in theta["nodeChecks"])
    assert all(check["overlap"] is False for check in theta["nodeChecks"])

    diagnostic = theta["scaledGramDiagnostic"]
    assert diagnostic["performed"] is False
    assert diagnostic["reason"] == (
        "theta-crosscheck-nonoverlap-blocks-scaled-diagnostic"
    )
    assert diagnostic["usedForVerdict"] is False


@pytest.mark.parametrize(
    ("field", "bad_value", "message_fragment"),
    [
        ("cutoff_u", "33", "cutoff_u"),
        ("theta_terms", 4097, "theta_terms"),
    ],
)
def test_theta_parser_and_cli_reject_resource_bounds(
    tmp_path, capsys, field, bad_value, message_fragment
):
    case = _smoke_case()
    case["theta_crosscheck"][field] = bad_value

    with pytest.raises(ExactInputError):
        parse_case(case)

    case_path = tmp_path / f"bad-{field}.json"
    case_path.write_text(json.dumps(case), encoding="utf-8")
    exit_code = cli_main(["certify", str(case_path)])
    captured = capsys.readouterr()

    assert exit_code == 2
    assert "ExactInputError" in captured.err
    assert message_fragment in captured.err
    assert captured.out == ""
