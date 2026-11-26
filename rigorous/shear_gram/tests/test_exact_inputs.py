from fractions import Fraction

import pytest

from rigorous.shear_gram.exact import canonical_rational, parse_rational


@pytest.mark.parametrize(
    ("text", "expected"),
    [
        ("0", "0"),
        ("-7", "-7"),
        ("3/4", "3/4"),
        ("6/8", "3/4"),
        ("-10/15", "-2/3"),
        ("0.5", "1/2"),
        ("125e-3", "1/8"),
    ],
)
def test_exact_rationals_round_trip_to_canonical_strings(text, expected):
    value = parse_rational(text)
    assert value == parse_rational(expected)
    assert canonical_rational(value) == expected
    assert parse_rational(canonical_rational(value)) == value


@pytest.mark.parametrize(
    "not_a_string",
    [0, 1, -1, 0.5, float("nan"), float("inf"), Fraction(1, 2), None, True],
)
def test_parse_rational_rejects_every_non_string_input(not_a_string):
    with pytest.raises((TypeError, ValueError)):
        parse_rational(not_a_string)


@pytest.mark.parametrize(
    "bad_text",
    ["", "nan", "NaN", "inf", "+inf", "-inf", "Infinity", "1/0", "1//2", "abc"],
)
def test_parse_rational_rejects_corrupt_nonfinite_or_inexact_text(bad_text):
    with pytest.raises((TypeError, ValueError, ZeroDivisionError)):
        parse_rational(bad_text)
