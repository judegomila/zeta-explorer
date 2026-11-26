from flint import acb, fmpq

from rigorous.shear_gram.gram import (
    build_gram,
    de_branges_kernel_from_values,
    is_exactly_hermitian,
)


I = acb(0, 1)


def _q(numerator, denominator=1):
    return fmpq(numerator, denominator)


def _z(real_n, real_d, imag_n, imag_d):
    return acb(_q(real_n, real_d), _q(imag_n, imag_d))


def _linear_kernel(w, z, sign):
    """Kernel for E(t)=t+sign*i and E#(t)=t-sign*i."""

    E_w = w + sign * I
    E_sharp_w = w - sign * I
    E_z = z + sign * I
    E_sharp_z = z - sign * I
    return de_branges_kernel_from_values(
        w, z, E_w, E_sharp_w, E_z, E_sharp_z
    )


def test_toy_hermite_biehler_linear_function_has_positive_kernel():
    w = _z(1, 3, 1, 5)
    z = _z(-2, 5, 1, 7)
    value = _linear_kernel(w, z, sign=1)

    assert value.overlaps(acb(1) / acb.pi())
    assert value.real > 0
    assert value.imag.contains(0)


def test_reversed_toy_function_has_negative_kernel():
    w = _z(1, 3, 1, 5)
    z = _z(-2, 5, 1, 7)
    value = _linear_kernel(w, z, sign=-1)

    assert value.overlaps(-acb(1) / acb.pi())
    assert value.real < 0
    assert value.imag.contains(0)


def test_build_gram_computes_one_triangle_and_mirrors_exactly(monkeypatch):
    import rigorous.shear_gram.gram as gram_module

    calls = []

    def synthetic_kernel(w, z, a):
        calls.append((w, z, a))
        return w.conjugate(exact=True) * z + 1

    monkeypatch.setattr(gram_module, "de_branges_kernel", synthetic_kernel)
    nodes = [_z(0, 1, 1, 4), _z(1, 2, 1, 3), _z(-2, 3, 2, 5)]
    matrix = build_gram(acb(_q(1, 8)), nodes)

    assert len(calls) == len(nodes) * (len(nodes) + 1) // 2
    assert is_exactly_hermitian(matrix)
    for row in range(matrix.nrows()):
        assert matrix[row, row].imag.is_zero()
        for column in range(row + 1, matrix.ncols()):
            lower = matrix[column, row]
            mirrored = matrix[row, column].conjugate(exact=True)
            # python-flint's ball ``==`` can be false for two accessors with
            # identical printed enclosures.  Midpoint plus radius equality is
            # the stable representation-level check; overlap guards meaning.
            assert lower.overlaps(mirrored)
            assert lower.mid() == mirrored.mid()
            assert lower.rad() == mirrored.rad()
