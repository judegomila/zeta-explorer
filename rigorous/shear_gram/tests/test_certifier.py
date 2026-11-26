import copy
import json
from pathlib import Path

import pytest
from flint import acb, acb_mat, ctx

from rigorous.shear_gram.certify import (
    CERTIFIED_NEGATIVE_WITNESS,
    CERTIFIED_POSITIVE_FINITE_GRAM,
    INCONCLUSIVE,
    certify_spec,
    classify_hermitian_ball_matrix,
    parse_case,
    validate_case,
)
from rigorous.shear_gram.errors import NonFiniteError
from rigorous.shear_gram.exact import ExactInputError


CASE_PATH = Path(__file__).resolve().parents[1] / "cases" / "smoke.json"


def _smoke_case():
    return json.loads(CASE_PATH.read_text(encoding="utf-8"))


@pytest.mark.parametrize(
    ("matrix", "expected"),
    [
        (acb_mat([[2, 0], [0, 1]]), CERTIFIED_POSITIVE_FINITE_GRAM),
        (acb_mat([[-2, 0], [0, 1]]), CERTIFIED_NEGATIVE_WITNESS),
        (
            acb_mat([[acb("[0 +/- 1]"), 0], [0, 1]]),
            INCONCLUSIVE,
        ),
    ],
)
def test_classifier_has_exactly_three_honest_verdicts(matrix, expected):
    with ctx.workprec(128):
        result = classify_hermitian_ball_matrix(matrix, precision_bits=128)

    assert result.status == expected
    assert result.status in {
        CERTIFIED_POSITIVE_FINITE_GRAM,
        CERTIFIED_NEGATIVE_WITNESS,
        INCONCLUSIVE,
    }
    assert result.finiteGramOnly is True
    assert result.rhClaim is False
    assert result["finiteGramOnly"] is True
    assert result["rhClaim"] is False
    if expected == CERTIFIED_NEGATIVE_WITNESS:
        assert result.witness_index is not None


def test_classifier_verdict_is_stable_for_exact_matrix_across_precisions():
    matrix = acb_mat([[2, 1], [1, 2]])
    results = []
    for bits in (128, 256):
        with ctx.workprec(bits):
            results.append(classify_hermitian_ball_matrix(matrix, bits))

    assert [result.status for result in results] == [
        CERTIFIED_POSITIVE_FINITE_GRAM,
        CERTIFIED_POSITIVE_FINITE_GRAM,
    ]
    for low, high in zip(
        results[0].midpoint_eigenvalues,
        results[1].midpoint_eigenvalues,
    ):
        assert low.overlaps(high)


def test_classifier_fails_closed_for_wrong_type_nonhermitian_and_nonfinite():
    wrong_type = classify_hermitian_ball_matrix([[1.0]])
    nonhermitian = classify_hermitian_ball_matrix(acb_mat([[1, 1], [0, 1]]))
    nonfinite = classify_hermitian_ball_matrix(acb_mat([[acb("nan")]]))

    for result in (wrong_type, nonhermitian, nonfinite):
        assert result.status == INCONCLUSIVE
        assert result.rhClaim is False
    assert wrong_type.reason == "not-an-acb-matrix"
    assert "hermitian" in nonhermitian.reason
    assert "non-finite" in nonfinite.reason


@pytest.mark.parametrize(
    ("path", "bad_value"),
    [
        (("a",), 0.125),
        (("a",), "nan"),
        (("a",), "inf"),
        (("a",), "1/0"),
        (("a",), "0"),
        (("nodes", 0, "re"), 0.0),
        (("nodes", 0, "im"), 0.25),
        (("nodes", 0, "im"), "0"),
        (("nodes", 0, "im"), "-1/4"),
        (("theta_crosscheck", "cutoff_u"), 1.0),
    ],
)
def test_case_parser_rejects_float_corrupt_and_non_upper_half_inputs(path, bad_value):
    case = copy.deepcopy(_smoke_case())
    target = case
    for key in path[:-1]:
        target = target[key]
    target[path[-1]] = bad_value

    with pytest.raises((ExactInputError, TypeError, ValueError, ZeroDivisionError)):
        parse_case(case)


def test_case_validation_canonicalizes_exact_strings_without_floats():
    case = _smoke_case()
    case["a"] = "0.125"
    case["nodes"][0]["re"] = "0e20"
    canonical = validate_case(case)

    assert canonical["a"] == "1/8"
    assert canonical["nodes"][0]["re"] == "0"
    assert canonical["nodes"][0]["im"] == "1/4"


def test_certify_spec_preserves_honesty_and_certificate_schema(monkeypatch):
    import rigorous.shear_gram.certify as certify_module

    monkeypatch.setattr(
        certify_module,
        "build_gram",
        lambda a, nodes: acb_mat([[2, 0], [0, 1]]),
    )
    case = _smoke_case()
    case["precision_bits"] = [128]
    certificate = certify_spec(case)

    assert certificate["schemaVersion"] == "debranges-gram-certificate/v1"
    assert certificate["status"] == CERTIFIED_POSITIVE_FINITE_GRAM
    assert certificate["finiteGramOnly"] is True
    assert certificate["rhClaim"] is False
    assert certificate["attempts"][0]["finiteGramOnly"] is True
    assert certificate["attempts"][0]["rhClaim"] is False
    assert "Riemann hypothesis" in certificate["scope"]


def test_numerical_abort_can_only_return_inconclusive(monkeypatch):
    import rigorous.shear_gram.certify as certify_module

    def abort(a, nodes):
        raise NonFiniteError("synthetic-integration-abort")

    monkeypatch.setattr(certify_module, "build_gram", abort)
    case = _smoke_case()
    case["precision_bits"] = [128]
    certificate = certify_spec(case)

    assert certificate["status"] == INCONCLUSIVE
    assert certificate["rhClaim"] is False
    assert certificate["attempts"][0]["finiteGram"] is False
    assert certificate["attempts"][0]["reason"].startswith("evaluation-failed:")

