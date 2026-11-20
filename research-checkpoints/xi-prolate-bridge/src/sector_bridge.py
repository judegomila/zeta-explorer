"""Finite-dimensional sector-refined residual diagnostics.

This module contains only finite linear algebra.  Its output is diagnostic:
it does not supply any estimate along an unbounded ``(lambda, N)`` schedule.
"""
from __future__ import annotations

import mpmath as mp


def _dot(x: mp.matrix, A: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * A * y)[0]


def _norm(x: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(x[i]) ** 2 for i in range(x.rows)))


def _max_abs(A: mp.matrix) -> mp.mpf:
    if not A.rows or not A.cols:
        return mp.mpf(0)
    return max(abs(A[i, j]) for i in range(A.rows) for j in range(A.cols))


def _columns(A: mp.matrix, indices: list[int]) -> mp.matrix:
    result = mp.matrix(A.rows, len(indices))
    for j, source_j in enumerate(indices):
        for i in range(A.rows):
            result[i, j] = A[i, source_j]
    return result


def _orthogonal_complement(unit: mp.matrix) -> mp.matrix:
    """Householder basis for the orthogonal complement of a real unit vector."""
    n = unit.rows
    if n < 2:
        raise ValueError("the inversion-even sector must have dimension at least two")
    e0 = mp.matrix(n, 1)
    e0[0] = 1
    sign = 1 if unit[0] >= 0 else -1
    v = unit + sign * e0
    H = mp.eye(n) - 2 * (v * v.T) / (v.T * v)[0]
    return H[:, 1:n]


def sector_refined_metrics(
    Q: mp.matrix,
    kappa: mp.matrix,
    J: mp.matrix,
    tol: mp.mpf | None = None,
) -> dict[str, object]:
    """Reconstruct the even-complement and odd-separation diagnostics.

    ``Q`` and ``J`` must be real symmetric, ``J`` must be an involution,
    ``Q`` must commute with ``J``, and the unit vector ``kappa`` must lie in
    the ``+1`` sector.  For ``b=(Q-q)kappa`` and ``w=b/||b||``, the returned
    Ritz value is the lower eigenvalue of the compression to
    ``span{kappa,w}``::

        u = (q+c-sqrt((c-q)^2+4*r^2))/2,
        c = <w,Qw>.

    Thus ``u`` is an upper bound for the lowest even-sector eigenvalue.  Put
    ``alpha`` for the even-complement floor.  The pass flag records the
    two finite sector inequalities ``alpha-u > 0`` and ``odd_floor-u > 0``.
    The first is sharper than requiring ``Delta_even=alpha-q > 0`` because
    the Ritz value satisfies ``u <= q``.

    A separate weighted pass evaluates
    ``tau=||(A-uI)^(-1)b_K||`` on the even complement.  It audits the
    spectral solve and the diagnostic inequality ``tau <= r/(alpha-u)``;
    it does not alter the sector-pass semantics and is not interval
    certified.  The associated chordal comparison-state bound is
    ``sqrt(2-2/sqrt(1+tau^2))``.
    """
    if Q.rows != Q.cols or J.rows != J.cols or Q.rows != J.rows:
        raise ValueError("Q and J must be square matrices of the same size")
    if kappa.cols != 1 or kappa.rows != Q.rows:
        raise ValueError("kappa must be a compatible column vector")
    if tol is None:
        tol = mp.power(10, -max(12, mp.mp.dps // 2))
    tol = mp.mpf(tol)
    I = mp.eye(Q.rows)
    structural_defects = {
        "Q_symmetry": _max_abs(Q - Q.T),
        "J_symmetry": _max_abs(J - J.T),
        "J_involution": _max_abs(J * J - I),
        "QJ_commutator": _max_abs(Q * J - J * Q),
        "kappa_unit": abs(_norm(kappa) - 1),
        "kappa_even": _norm(J * kappa - kappa),
    }
    bad = [name for name, defect in structural_defects.items() if defect > tol]
    if bad:
        raise ValueError("sector hypotheses fail tolerance: " + ", ".join(bad))

    j_evals, j_vecs = mp.eigsy(J)
    even_indices: list[int] = []
    odd_indices: list[int] = []
    for i in range(j_evals.rows):
        value = j_evals[i]
        if abs(value - 1) <= tol:
            even_indices.append(i)
        elif abs(value + 1) <= tol:
            odd_indices.append(i)
        else:
            raise ValueError("J has an eigenvalue outside the +/-1 tolerance")
    if len(even_indices) < 2 or not odd_indices:
        raise ValueError("both sectors and a nontrivial even complement are required")

    even_basis = _columns(j_vecs, even_indices)
    odd_basis = _columns(j_vecs, odd_indices)
    k_even = even_basis.T * kappa
    # The eigensolver can leave a tiny norm defect.  Re-normalizing coordinates
    # changes nothing in exact arithmetic and keeps the Householder basis
    # orthogonal at the working precision.
    k_even /= _norm(k_even)
    Q_even = even_basis.T * Q * even_basis
    even_complement = _orthogonal_complement(k_even)
    even_complement_compression = even_complement.T * Q_even * even_complement
    even_evals, even_evecs = mp.eigsy(even_complement_compression)
    odd_evals, _ = mp.eigsy(odd_basis.T * Q * odd_basis)

    q = _dot(kappa, Q, kappa)
    residual_vector = Q * kappa - q * kappa
    r = _norm(residual_vector)
    even_floor = even_evals[0]
    delta_even = even_floor - q
    odd_floor = odd_evals[0]

    if r == 0:
        c = None
        u = q
    else:
        w = residual_vector / r
        c = _dot(w, Q, w)
        discriminant = mp.sqrt((c - q) ** 2 + 4 * r**2)
        # Algebraically identical to the lower 2x2 eigenvalue, but stable
        # when it lies far below q and c.  The standalone verifier deliberately
        # retains the direct quadratic-form expression.
        u = min(q, c) - 2 * r**2 / (abs(c - q) + discriminant)
    odd_margin = odd_floor - u
    ratio = r / delta_even if delta_even > 0 else None
    even_ritz_gap = even_floor - u
    ritz_ratio = r / even_ritz_gap if even_ritz_gap > 0 else None

    # Resolve the actual complement forcing instead of replacing the inverse
    # by its operator norm.  If K is any orthonormal basis of the even sector
    # perpendicular to kappa, then
    #
    #   A = K^T Q K,  b_K = K^T (Q-qI)kappa,
    #   tau = ||(A-uI)^(-1)b_K||.
    #
    # Orthogonal changes of K conjugate A and rotate b_K, so tau is basis
    # invariant.  Since A-uI >= Gamma I for Gamma=alpha-u>0,
    # tau <= ||b_K||/Gamma <= r/Gamma.  These are arbitrary-precision
    # diagnostics, not interval-certified inequalities.
    residual_even_coordinates = even_basis.T * residual_vector
    resolvent_rhs = even_complement.T * residual_even_coordinates
    resolvent_rhs_norm = _norm(resolvent_rhs)
    resolvent_rhs_norm_minus_r_abs = abs(resolvent_rhs_norm - r)
    if even_ritz_gap > 0:
        # Producer path: evaluate the resolvent spectrally.  The independent
        # replay path deliberately uses a direct linear solve.
        spectral_rhs = even_evecs.T * resolvent_rhs
        spectral_solution = mp.matrix(spectral_rhs.rows, 1)
        for j in range(spectral_rhs.rows):
            spectral_solution[j] = spectral_rhs[j] / (even_evals[j] - u)
        resolvent_solution = even_evecs * spectral_solution
        resolvent_tau = _norm(resolvent_solution)
        resolvent_chordal_bound = resolvent_tau * mp.sqrt(
            2 / (mp.sqrt(1 + resolvent_tau**2)
                 * (mp.sqrt(1 + resolvent_tau**2) + 1))
        )
        resolvent_solve_residual_norm = _norm(
            (even_complement_compression
             - u * mp.eye(even_complement_compression.rows))
            * resolvent_solution - resolvent_rhs
        )
        resolvent_upper = ritz_ratio
        resolvent_signed_defect = resolvent_tau - resolvent_upper
        resolvent_defect = max(mp.mpf(0), resolvent_signed_defect)
        comparison_tolerance = tol * max(mp.mpf(1), abs(resolvent_upper))
        resolvent_comparison_pass = bool(
            resolvent_signed_defect <= comparison_tolerance
        )
    else:
        resolvent_tau = None
        resolvent_chordal_bound = None
        resolvent_solve_residual_norm = None
        resolvent_upper = None
        resolvent_signed_defect = None
        resolvent_defect = None
        resolvent_comparison_pass = False

    sector_pass = bool(even_ritz_gap > 0 and odd_margin > 0)
    rhs_audit_pass = bool(
        resolvent_rhs_norm_minus_r_abs <= tol * max(mp.mpf(1), r)
    )
    solve_audit_pass = bool(
        resolvent_solve_residual_norm is not None
        and resolvent_solve_residual_norm
        <= tol * max(mp.mpf(1), resolvent_rhs_norm)
    )
    resolvent_weighted_pass = bool(
        sector_pass and resolvent_comparison_pass
        and resolvent_tau is not None and resolvent_tau >= 0
        and rhs_audit_pass and solve_audit_pass
    )

    return {
        "q": q,
        "residual_vector": residual_vector,
        "r": r,
        "even_complement_floor": even_floor,
        "Delta_even": delta_even,
        "odd_floor": odd_floor,
        "residual_direction_rayleigh_c": c,
        "two_dimensional_ritz_upper_u": u,
        "even_complement_floor_minus_ritz_upper": even_ritz_gap,
        "odd_floor_minus_ritz_upper": odd_margin,
        "r_over_Delta_even": ratio,
        "r_over_even_ritz_gap": ritz_ratio,
        "resolvent_Gamma": even_ritz_gap,
        "resolvent_rhs_norm": resolvent_rhs_norm,
        "resolvent_rhs_norm_minus_r_abs": resolvent_rhs_norm_minus_r_abs,
        "resolvent_weighted_tau": resolvent_tau,
        "resolvent_weighted_chordal_distance_bound":
            resolvent_chordal_bound,
        "resolvent_solve_residual_norm": resolvent_solve_residual_norm,
        "resolvent_comparison_r_over_Gamma": resolvent_upper,
        "resolvent_tau_minus_r_over_Gamma": resolvent_signed_defect,
        "resolvent_tau_le_r_over_Gamma_defect": resolvent_defect,
        "resolvent_tau_le_r_over_Gamma": resolvent_comparison_pass,
        "resolvent_weighted_bound_certification":
            "finite_arbitrary_precision_diagnostic_not_interval_certified",
        "resolvent_evaluation_path":
            "spectral_decomposition_of_even_complement",
        "resolvent_weighted_bound_diagnostic_pass": resolvent_weighted_pass,
        "sector_refined_bridge_diagnostic_pass": sector_pass,
        "structural_defects": structural_defects,
    }
