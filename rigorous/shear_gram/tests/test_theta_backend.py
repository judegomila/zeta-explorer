"""Regression and honesty tests for the cancellation-preserving theta path."""

from __future__ import annotations

import pytest
from flint import acb, arb, ctx, fmpq

import rigorous.shear_gram.theta as theta_module
from rigorous.shear_gram.theta import (
    ThetaEvaluationError,
    ThetaInputError,
    theta_completed_xi_crosscheck,
    theta_components,
)
from rigorous.shear_gram.xi import Xi


_I = acb(0, 1)


def _q(numerator: int, denominator: int = 1) -> fmpq:
    return fmpq(numerator, denominator)


@pytest.fixture(scope="module")
def theta_at_zero():
    with ctx.workprec(128):
        return theta_components(_q(0), _q(0), _q(0), _q(2), 8)


@pytest.fixture(scope="module")
def theta_at_complex_point():
    with ctx.workprec(128):
        return theta_components(_q(1, 4), _q(1, 5), _q(0), _q(2), 8)


@pytest.fixture(scope="module")
def shifted_theta_components():
    with ctx.workprec(128):
        return theta_components(_q(1, 4), _q(1, 5), _q(1, 8), _q(2), 8)


def test_theta_normalization_at_Xi_zero(theta_at_zero):
    """The factor-eight normalization must reproduce Xi(0), not a rescale."""

    with ctx.workprec(128):
        direct = Xi(acb(0))
        expected_decimal = arb("0.497120778188314109912773739685397720")

        assert theta_at_zero.A.overlaps(direct)
        assert theta_at_zero.E.overlaps(direct)
        assert theta_at_zero.E_sharp.overlaps(direct)
        assert abs(theta_at_zero.A.real.mid() - expected_decimal) < arb("1e-35")
        assert theta_at_zero.A.imag.contains(0)
        assert theta_at_zero.B_over_a.contains(0)


def test_theta_normalization_at_nonreal_point(theta_at_complex_point):
    with ctx.workprec(128):
        z = acb(_q(1, 4), _q(1, 5))
        direct = Xi(z)
        expected_real = arb("0.496861172344809903498718065113012802")
        expected_imag = arb(
            "-0.001148040976075647594502199156372250979"
        )

        assert theta_at_complex_point.A.overlaps(direct)
        assert theta_at_complex_point.E.overlaps(direct)
        assert theta_at_complex_point.E_sharp.overlaps(direct)
        assert (
            abs(theta_at_complex_point.A.real.mid() - expected_real)
            < arb("1e-35")
        )
        assert (
            abs(theta_at_complex_point.A.imag.mid() - expected_imag)
            < arb("1e-37")
        )


def test_A_and_B_over_a_reconstruct_both_shifted_Xi_values(
    shifted_theta_components,
):
    with ctx.workprec(128):
        z = acb(_q(1, 4), _q(1, 5))
        a = acb(_q(1, 8))
        components = shifted_theta_components
        direct_E = Xi(z + _I * a)
        direct_E_sharp = Xi(z - _I * a)

        reconstructed_E = components.A - _I * a * components.B_over_a
        reconstructed_E_sharp = components.A + _I * a * components.B_over_a
        recovered_A = (components.E + components.E_sharp) / 2
        recovered_B_over_a = (components.E_sharp - components.E) / (2 * _I * a)

        assert components.E.overlaps(reconstructed_E)
        assert components.E_sharp.overlaps(reconstructed_E_sharp)
        assert components.A.overlaps(recovered_A)
        assert components.B_over_a.overlaps(recovered_B_over_a)
        assert components.E.overlaps(direct_E)
        assert components.E_sharp.overlaps(direct_E_sharp)


def test_B_over_a_remains_well_conditioned_as_a_tends_to_zero():
    """C_a=B_a/a is evaluated continuously, including exact a=0."""

    with ctx.workprec(128):
        limiting = theta_components(_q(1, 4), _q(1, 5), _q(0), _q(2), 8)
        tiny_a = theta_components(
            _q(1, 4), _q(1, 5), _q(1, 2**30), _q(2), 8
        )

        assert tiny_a.B_over_a.is_finite()
        # C_a is even and analytic in a, so the difference is O(a^2).  This
        # numerical threshold is deliberately far looser than either enclosure.
        assert abs(tiny_a.B_over_a - limiting.B_over_a) < arb("2e-22")
        assert tiny_a.B_over_a.rad() < arb("1e-35")
        assert tiny_a.B_over_a_tail.total < arb("1e-100")


def test_explicit_tail_parts_improve_with_terms_and_cutoff():
    with ctx.workprec(96):
        baseline = theta_components(_q(1, 4), _q(1, 5), _q(1, 8), _q(1), 4)
        more_terms = theta_components(_q(1, 4), _q(1, 5), _q(1, 8), _q(1), 5)
        later_cutoff = theta_components(
            _q(1, 4), _q(1, 5), _q(1, 8), _q(3, 2), 4
        )

        assert more_terms.A_tail.omitted_n < baseline.A_tail.omitted_n
        assert (
            more_terms.B_over_a_tail.omitted_n
            < baseline.B_over_a_tail.omitted_n
        )
        assert later_cutoff.A_tail.retained_u < baseline.A_tail.retained_u
        assert (
            later_cutoff.B_over_a_tail.retained_u
            < baseline.B_over_a_tail.retained_u
        )
        # The all-u omitted-n bound does not depend on the retained-u cutoff.
        assert later_cutoff.A_tail.omitted_n.overlaps(
            baseline.A_tail.omitted_n
        )
        assert later_cutoff.B_over_a_tail.omitted_n.overlaps(
            baseline.B_over_a_tail.omitted_n
        )

        for tail in (
            baseline.A_tail,
            baseline.B_over_a_tail,
            more_terms.A_tail,
            more_terms.B_over_a_tail,
            later_cutoff.A_tail,
            later_cutoff.B_over_a_tail,
        ):
            assert tail.retained_u >= 0
            assert tail.omitted_n >= 0
            assert tail.total.overlaps(tail.retained_u + tail.omitted_n)


def test_theta_enclosures_overlap_across_precisions_and_tighten():
    arguments = (_q(1, 4), _q(1, 5), _q(1, 8), _q(1), 6)
    with ctx.workprec(96):
        low = theta_components(*arguments)
    with ctx.workprec(192):
        high = theta_components(*arguments)

        assert low.precision_bits == 96
        assert high.precision_bits == 192
        for low_value, high_value in (
            (low.A, high.A),
            (low.B_over_a, high.B_over_a),
            (low.E, high.E),
            (low.E_sharp, high.E_sharp),
        ):
            assert low_value.is_finite()
            assert high_value.is_finite()
            assert low_value.overlaps(high_value)
            assert high_value.rad() < low_value.rad()


@pytest.mark.parametrize(
    "arguments",
    [
        (0, _q(0), _q(0), _q(1), 4),
        (_q(0), 0.0, _q(0), _q(1), 4),
        (_q(0), _q(0), -1, _q(1), 4),
        (_q(0), _q(0), _q(-1, 8), _q(1), 4),
        (_q(0), _q(0), _q(0), _q(0), 4),
        (_q(0), _q(0), _q(0), _q(33), 4),
        (_q(0), _q(0), _q(0), _q(1), 0),
        (_q(0), _q(0), _q(0), _q(1), 4097),
        (_q(0), _q(0), _q(0), _q(1), True),
        (_q(0), _q(0), _q(0), _q(1), 4.0),
    ],
)
def test_theta_backend_rejects_inexact_or_out_of_bounds_inputs(arguments):
    with pytest.raises(ThetaInputError):
        theta_components(*arguments)


def test_crosscheck_converts_backend_failure_to_nonpassing_result(monkeypatch):
    def fail_closed(*_arguments, **_keywords):
        raise ThetaEvaluationError("synthetic integration failure")

    monkeypatch.setattr(theta_module, "theta_components", fail_closed)
    result = theta_completed_xi_crosscheck(
        _q(1, 4), _q(1, 5), _q(1, 8), _q(1), 6
    )

    assert result.performed is False
    assert result.overlap is False
    assert result.used_for_verdict is False
    assert result.reason == "theta-crosscheck-failed:ThetaEvaluationError"


def test_successful_crosscheck_and_records_make_no_RH_claim(
    shifted_theta_components,
):
    with ctx.workprec(128):
        crosscheck = theta_completed_xi_crosscheck(
            _q(1, 4), _q(1, 5), _q(1, 8), _q(2), 8
        )

    assert crosscheck.performed is True
    assert crosscheck.overlap is True
    assert crosscheck.E_overlap is True
    assert crosscheck.E_sharp_overlap is True
    assert crosscheck.used_for_verdict is False

    component_record = shifted_theta_components.as_record()
    crosscheck_record = crosscheck.as_record(128)
    assert component_record["finitePointwiseOnly"] is True
    assert component_record["rhClaim"] is False
    assert component_record["rhSolved"] is False
    assert crosscheck_record["finitePointwiseOnly"] is True
    assert crosscheck_record["usedForVerdict"] is False
    assert crosscheck_record["rhClaim"] is False
    assert crosscheck_record["rhSolved"] is False
