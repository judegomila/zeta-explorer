import pytest
from flint import acb, ctx, fmpq

from rigorous.shear_gram.errors import NonFiniteError
from rigorous.shear_gram.xi import Xi, xi_completed


def _z(real_n, real_d=1, imag_n=0, imag_d=1):
    return acb(fmpq(real_n, real_d), fmpq(imag_n, imag_d))


def test_completed_xi_functional_equation_overlaps():
    s = _z(1, 3, 2, 5)
    with ctx.workprec(192):
        left = xi_completed(s)
        right = xi_completed(1 - s)
    assert left.overlaps(right)


def test_Xi_is_even_and_respects_conjugation():
    z = _z(2, 7, 3, 11)
    with ctx.workprec(192):
        value = Xi(z)
        reflected = Xi(-z)
        conjugate_input = Xi(z.conjugate(exact=True))

    assert value.overlaps(reflected)
    assert conjugate_input.overlaps(value.conjugate(exact=True))


def test_Xi_on_real_axis_encloses_a_real_value():
    with ctx.workprec(192):
        value = Xi(_z(5, 8))
    assert value.imag.contains(0)


def test_Xi_balls_at_two_precisions_overlap():
    z = _z(7, 13, 1, 9)
    with ctx.workprec(128):
        low_precision = Xi(z)
    with ctx.workprec(256):
        high_precision = Xi(z)

    assert low_precision.is_finite()
    assert high_precision.is_finite()
    assert low_precision.overlaps(high_precision)


@pytest.mark.parametrize("bad", [acb("nan"), acb("inf")])
def test_Xi_fails_closed_on_nonfinite_input(bad):
    with pytest.raises(NonFiniteError):
        Xi(bad)


@pytest.mark.parametrize("bad", [0, 0.0, "0", complex(0)])
def test_Xi_rejects_non_ball_inputs(bad):
    with pytest.raises(TypeError):
        Xi(bad)

