import json
from fractions import Fraction
from pathlib import Path


CASE_PATH = Path(__file__).resolve().parents[1] / "cases" / "smoke.json"


def _load_smoke_case():
    return json.loads(CASE_PATH.read_text(encoding="utf-8"), parse_constant=_reject_constant)


def _reject_constant(token):
    raise ValueError(f"non-finite JSON number: {token}")


def test_smoke_case_is_exact_and_strictly_upper_half_plane():
    case = _load_smoke_case()

    assert case["schemaVersion"] == "debranges-gram-case/v1"
    assert isinstance(case["id"], str) and case["id"]
    assert isinstance(case["a"], str)
    assert Fraction(case["a"]) > 0
    assert len(case["nodes"]) >= 2

    for node in case["nodes"]:
        assert set(node) == {"re", "im"}
        assert isinstance(node["re"], str)
        assert isinstance(node["im"], str)
        Fraction(node["re"])
        assert Fraction(node["im"]) > 0

    assert case["precision_bits"] == sorted(set(case["precision_bits"]))
    assert all(isinstance(bits, int) and bits >= 64 for bits in case["precision_bits"])

    crosscheck = case["theta_crosscheck"]
    assert crosscheck["enabled"] is True
    assert isinstance(crosscheck["cutoff_u"], str)
    assert Fraction(crosscheck["cutoff_u"]) > 0
    assert isinstance(crosscheck["theta_terms"], int) and crosscheck["theta_terms"] > 0


def test_smoke_case_contains_no_binary_float_inputs():
    case = _load_smoke_case()

    def walk(value):
        assert not isinstance(value, float)
        if isinstance(value, dict):
            for child in value.values():
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(case)

