"""Upper-half-plane de Branges kernel and exactly mirrored Gram matrices."""

from __future__ import annotations

from collections.abc import Sequence

from flint import acb, acb_mat

from .errors import MatrixValidationError, NonFiniteError
from .xi import E_a, E_sharp_a

_I = acb(0, 1)


def _require_finite(value: acb, stage: str) -> acb:
    if not value.is_finite():
        raise NonFiniteError(stage)
    return value


def de_branges_kernel_from_values(
    w: acb,
    z: acb,
    E_w: acb,
    E_sharp_w: acb,
    E_z: acb,
    E_sharp_z: acb,
) -> acb:
    r"""Evaluate the upper-half-plane kernel from already enclosed values.

    .. math::
       K(w,z)=\frac{\overline{E(w)}E(z)-
       \overline{E^\#(w)}E^\#(z)}
       {2\pi i(\overline w-z)}.
    """

    values = (w, z, E_w, E_sharp_w, E_z, E_sharp_z)
    if not all(isinstance(value, acb) for value in values):
        raise TypeError("kernel arguments must all be flint.acb")
    for index, value in enumerate(values):
        _require_finite(value, f"kernel.input[{index}]")
    numerator = _require_finite(
        E_w.conjugate(exact=True) * E_z
        - E_sharp_w.conjugate(exact=True) * E_sharp_z,
        "kernel.numerator",
    )
    denominator = _require_finite(
        2 * acb.pi() * _I * (w.conjugate(exact=True) - z),
        "kernel.denominator",
    )
    if denominator.contains(0):
        raise NonFiniteError("kernel.denominator_contains_zero")
    return _require_finite(numerator / denominator, "kernel.result")


def de_branges_kernel(w: acb, z: acb, a: acb) -> acb:
    """Evaluate the Xi-shear de Branges kernel at ``(w,z)``."""

    E_w = E_a(w, a)
    E_sharp_w = E_sharp_a(w, a)
    E_z = E_a(z, a)
    E_sharp_z = E_sharp_a(z, a)
    return de_branges_kernel_from_values(
        w, z, E_w, E_sharp_w, E_z, E_sharp_z
    )


def build_gram(a: acb, nodes: Sequence[acb]) -> acb_mat:
    """Build a finite Gram matrix, evaluating only its upper triangle.

    Lower-triangular entries are made by ``conjugate(exact=True)``.  A diagonal
    kernel value is known analytically to be real; its real enclosure is kept
    only after checking that the computed imaginary ball contains zero.
    """

    if not isinstance(a, acb):
        raise TypeError("a must be flint.acb")
    if not a.is_finite() or not a.imag.is_zero():
        raise MatrixValidationError("a must be a finite real ball")
    node_list = list(nodes)
    if not node_list:
        raise MatrixValidationError("at least one node is required")
    if not all(isinstance(node, acb) and node.is_finite() for node in node_list):
        raise MatrixValidationError("all nodes must be finite flint.acb values")

    size = len(node_list)
    matrix = acb_mat(size, size)
    for row in range(size):
        for column in range(row, size):
            value = de_branges_kernel(node_list[row], node_list[column], a)
            if row == column:
                if not value.imag.contains(0):
                    raise MatrixValidationError(
                        f"diagonal kernel enclosure {row} does not contain a real value"
                    )
                value = acb(value.real, 0)
            matrix[row, column] = value
            if column != row:
                matrix[column, row] = value.conjugate(exact=True)
    return matrix


def is_exactly_hermitian(matrix: acb_mat) -> bool:
    """Check exact ball representation equality, not mere overlap."""

    if not isinstance(matrix, acb_mat) or matrix.nrows() != matrix.ncols():
        return False
    for row in range(matrix.nrows()):
        if not matrix[row, row].imag.is_zero():
            return False
        for column in range(row + 1, matrix.ncols()):
            if matrix[column, row] != matrix[row, column].conjugate(exact=True):
                return False
    return True
