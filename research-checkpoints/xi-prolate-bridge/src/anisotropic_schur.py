"""Anisotropic low/high Schur criteria and forced-resolvent diagnostics.

This module contains finite-dimensional linear algebra only.  It does not
prove any uniform prolate--Weil comparison or any assertion about RH.  Point
computations must be replaced by outward-rounded enclosures before they can be
used as finite certificates.
"""
from __future__ import annotations

import mpmath as mp


def _norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(vector[i]) ** 2 for i in range(vector.rows)))


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    if matrix.rows == 0 or matrix.cols == 0:
        return mp.mpf("0")
    return max(abs(matrix[i, j]) for i in range(matrix.rows) for j in range(matrix.cols))


def _minimum_eigenvalue(matrix: mp.matrix) -> mp.mpf:
    values, _ = mp.eighe((matrix + matrix.H) / 2)
    return mp.re(values[0])


def _inverse_square_root(matrix: mp.matrix) -> tuple[mp.matrix, mp.matrix]:
    values, vectors = mp.eighe((matrix + matrix.H) / 2)
    if values[0] <= 0:
        raise ValueError("positive model must be positive definite")
    inverse_root = (
        vectors
        * mp.diag([1 / mp.sqrt(values[i]) for i in range(values.rows)])
        * vectors.H
    )
    return values, inverse_root


def _operator_norm(matrix: mp.matrix) -> mp.mpf:
    if matrix.rows == 0 or matrix.cols == 0:
        return mp.mpf("0")
    values, _ = mp.eighe(matrix.H * matrix)
    value = mp.re(values[-1])
    if value < 0 and abs(value) <= mp.eps * 100:
        value = mp.mpf("0")
    if value < 0:
        raise ArithmeticError("negative squared singular value")
    return mp.sqrt(value)


def anisotropic_schur_point_bound(
    low_block: mp.matrix,
    coupling: mp.matrix,
    high_block: mp.matrix,
    low_forcing: mp.matrix | None = None,
    high_forcing: mp.matrix | None = None,
    *,
    X: mp.matrix | None = None,
    positive_model: mp.matrix | None = None,
    high_approximate_solution: mp.matrix | None = None,
    tolerance: mp.mpf | None = None,
) -> dict[str, object]:
    """Evaluate the anisotropic Schur theorem at arbitrary precision.

    With ``B=[[A,C*],[C,H]]`` and ``H>=gI``, an explicit map ``X`` gives

      E=C-HX,
      A_X=A-C*X-X*C+X*HX,
      S_0=A_X-E*E/g <= A-C*H^(-1)C.

    Thus ``S_0>0`` proves ``B>0``.  If a forcing is supplied, the function
    also evaluates the theorem's Euclidean forced-resolvent upper bound.  It
    never infers a vector-norm inequality directly from Loewner order.
    """
    if tolerance is None:
        tolerance = mp.power(10, -max(12, mp.mp.dps // 2))
    tolerance = mp.mpf(tolerance)
    if low_block.rows != low_block.cols:
        raise ValueError("low block must be square")
    if high_block.rows != high_block.cols:
        raise ValueError("high block must be square")
    low_dimension = low_block.rows
    high_dimension = high_block.rows
    if coupling.rows != high_dimension or coupling.cols != low_dimension:
        raise ValueError("coupling dimensions do not match the two blocks")
    if low_dimension == 0 or high_dimension == 0:
        raise ValueError("use the explicit empty-sector branch of the theorem")
    structural_defects = {
        "low_Hermitian": _max_abs(low_block - low_block.H),
        "high_Hermitian": _max_abs(high_block - high_block.H),
    }
    if max(structural_defects.values()) > tolerance:
        raise ValueError("block Hermitian hypotheses fail tolerance")

    g = _minimum_eigenvalue(high_block)
    if g <= 0:
        raise ValueError("high-block lower bound must be strictly positive")
    if X is None:
        X = mp.matrix(high_dimension, low_dimension)
    if X.rows != high_dimension or X.cols != low_dimension:
        raise ValueError("X has incompatible dimensions")

    error_coupling = coupling - high_block * X
    transformed_low = (
        low_block
        - coupling.H * X
        - X.H * coupling
        + X.H * high_block * X
    )
    lower_schur_model = (
        transformed_low - error_coupling.H * error_coupling / g
    )
    high_inverse = mp.inverse(high_block)
    exact_schur = low_block - coupling.H * high_inverse * coupling
    schur_domination_defect = _minimum_eigenvalue(exact_schur - lower_schur_model)
    lower_floor = _minimum_eigenvalue(lower_schur_model)
    report: dict[str, object] = {
        "high_floor_g": g,
        "X": X,
        "E": error_coupling,
        "A_X": transformed_low,
        "lower_schur_model_S0": lower_schur_model,
        "lower_schur_floor": lower_floor,
        "exact_point_schur": exact_schur,
        "exact_point_schur_floor": _minimum_eigenvalue(exact_schur),
        "exact_S_minus_S0_floor": schur_domination_defect,
        "structural_defects": structural_defects,
        "finite_point_positivity": bool(lower_floor > 0),
        "forced_bound": None,
        "claim_scope": "finite_arbitrary_precision_point_not_interval_or_uniform",
    }
    if schur_domination_defect < -tolerance:
        raise ArithmeticError("computed Schur domination S>=S0 failed")

    forcing_supplied = low_forcing is not None or high_forcing is not None
    if not forcing_supplied:
        return report
    if low_forcing is None or high_forcing is None:
        raise ValueError("both low and high forcing vectors are required")
    if low_forcing.rows != low_dimension or low_forcing.cols != 1:
        raise ValueError("low forcing has incompatible dimensions")
    if high_forcing.rows != high_dimension or high_forcing.cols != 1:
        raise ValueError("high forcing has incompatible dimensions")
    if lower_floor <= 0:
        return report

    D = lower_schur_model if positive_model is None else positive_model
    if D.rows != low_dimension or D.cols != low_dimension:
        raise ValueError("positive model has incompatible dimensions")
    if _max_abs(D - D.H) > tolerance:
        raise ValueError("positive model must be Hermitian")
    model_values, model_inverse_root = _inverse_square_root(D)
    d = mp.re(model_values[0])
    model_domination_defect = _minimum_eigenvalue(exact_schur - D)
    if model_domination_defect < -tolerance:
        raise ValueError("positive model is not below the exact Schur complement")

    if high_approximate_solution is None:
        high_approximate_solution = high_inverse * high_forcing
    if (
        high_approximate_solution.rows != high_dimension
        or high_approximate_solution.cols != 1
    ):
        raise ValueError("high approximate solution has incompatible dimensions")
    high_residual = high_forcing - high_block * high_approximate_solution
    theta = (
        _operator_norm(X * model_inverse_root)
        + _operator_norm(error_coupling * model_inverse_root) / g
    )
    forcing_energy = (
        _norm(model_inverse_root * (low_forcing - coupling.H * high_approximate_solution))
        + theta * _norm(high_residual)
    )
    high_size = _norm(high_approximate_solution) + _norm(high_residual) / g
    upper = mp.sqrt(
        forcing_energy**2 / d + (high_size + theta * forcing_energy) ** 2
    )

    block = mp.matrix(low_dimension + high_dimension)
    block[:low_dimension, :low_dimension] = low_block
    block[:low_dimension, low_dimension:] = coupling.H
    block[low_dimension:, :low_dimension] = coupling
    block[low_dimension:, low_dimension:] = high_block
    forcing = mp.matrix(low_dimension + high_dimension, 1)
    forcing[:low_dimension, 0] = low_forcing
    forcing[low_dimension:, 0] = high_forcing
    direct_solution = mp.lu_solve(block, forcing)
    direct_norm = _norm(direct_solution)
    report["forced_bound"] = {
        "D": D,
        "d": d,
        "D_below_exact_S_floor": model_domination_defect,
        "z0": high_approximate_solution,
        "e": high_residual,
        "Theta": theta,
        "F": forcing_energy,
        "Z": high_size,
        "T_AS": upper,
        "direct_point_solution_norm": direct_norm,
        "upper_minus_direct_norm": upper - direct_norm,
    }
    if upper + tolerance < direct_norm:
        raise ArithmeticError("anisotropic forced bound failed its direct point audit")
    return report
