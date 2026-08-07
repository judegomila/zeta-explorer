"""Exact finite source-commutator audit for boundary normalization.

This is finite linear algebra for the Cauchy-form matrices in CCM-ZST-v1,
Lemmas 5.1--5.2.  It does not certify a prolate approximation or an
unbounded sequence.
"""
from __future__ import annotations

import mpmath as mp


def _max_abs(A: mp.matrix) -> mp.mpf:
    if not A.rows or not A.cols:
        return mp.mpf(0)
    return max(abs(A[i, j]) for i in range(A.rows) for j in range(A.cols))


def _norm(v: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(v[i]) ** 2 for i in range(v.rows)))


def source_commutator_metrics(
    Q: mp.matrix,
    J: mp.matrix,
    modes: list[int],
    tol: mp.mpf | None = None,
) -> dict[str, object]:
    """Audit source equations (5.2)--(5.3) in the Fourier-mode basis.

    The odd coefficients are fixed without trusting cached source data by
    choosing ``b_0=0`` and reconstructing ``b_n=n Q_{n0}``.  The source
    matrix form then requires

    ``Q_nm=(b_n-b_m)/(n-m)`` for ``n!=m``

    and implies ``[M,Q]=|beta><eta|-|eta><beta|`` for
    ``M V_n=n V_n``.  Adding a scalar identity to ``Q`` leaves every
    reported commutator quantity unchanged.
    """
    d = len(modes)
    N = (d - 1) // 2
    if d < 3 or d % 2 != 1 or modes != list(range(-N, N + 1)):
        raise ValueError("modes must be the consecutive symmetric range -N,...,N")
    if Q.rows != d or Q.cols != d or J.rows != d or J.cols != d:
        raise ValueError("Q and J must match the mode range")
    if tol is None:
        tol = mp.power(10, -max(12, mp.mp.dps // 2))
    tol = mp.mpf(tol)

    zero_index = modes.index(0)
    beta = mp.matrix(d, 1)
    eta = mp.matrix(d, 1)
    M = mp.matrix(d)
    for i, n in enumerate(modes):
        eta[i] = 1
        M[i, i] = n
        beta[i] = 0 if n == 0 else n * Q[i, zero_index]

    cauchy_defect = mp.mpf(0)
    for i, n in enumerate(modes):
        for j, m in enumerate(modes):
            if i != j:
                expected = (beta[i] - beta[j]) / (n - m)
                cauchy_defect = max(cauchy_defect, abs(Q[i, j] - expected))

    commutator = M * Q - Q * M
    rank_two = beta * eta.T - eta * beta.T
    defects = {
        "source_cauchy_offdiagonal": cauchy_defect,
        "source_rank_two_commutator": _max_abs(commutator - rank_two),
        "source_beta_inversion_odd": _norm(J * beta + beta),
        "source_eta_inversion_even": _norm(J * eta - eta),
        "source_mode_inversion_anticommutator": _max_abs(M * J + J * M),
    }
    passed = all(value <= tol for value in defects.values())
    return {
        "beta": beta,
        "eta": eta,
        "defects": defects,
        "source_commutator_matrix_form_diagnostic_pass": passed,
        "source_boundary_proof_reference": (
            "CCM-ZST-v1 Lemma 5.1 (5.2), Lemma 5.2(ii) (5.3), "
            "post-Definition 5.3 argument, and (5.15)"
        ),
    }
