#!/usr/bin/env python3
"""Finite residual--gap diagnostic for the Xi prolate--Weil project.

This legacy convenience program does not construct the Weil matrix and is not
a proof certificate.  It consumes an externally assembled Hermitian matrix
``Q`` and comparison vector ``kappa`` from an NPZ file and reports the older
full-complement residual--gap diagnostic.  The source-pinned P0 producer uses
``sector_bridge.py`` for the sharper Theorem 2 in ``DIRECT_RH_ATTACK.md``.

Required NPZ arrays:
    Q       complex Hermitian matrix of shape (n,n)
    kappa   nonzero comparison vector of shape (n,)

Optional:
    J       involution matrix used to test evenness
    delta   boundary-functional vector, with delta(v)=vdot(delta,v)
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np


def analyze(data: dict[str, np.ndarray], tolerance: float) -> dict[str, object]:
    if not np.isfinite(tolerance) or tolerance <= 0.0:
        raise ValueError("tolerance must be finite and positive")
    q_matrix = np.asarray(data["Q"], dtype=np.complex128)
    vector = np.asarray(data["kappa"], dtype=np.complex128).reshape(-1)
    if q_matrix.ndim != 2 or q_matrix.shape[0] != q_matrix.shape[1]:
        raise ValueError("Q must be square")
    if q_matrix.shape[0] != vector.size:
        raise ValueError("Q and kappa dimensions differ")
    if vector.size < 2:
        raise ValueError("diagnostic requires dimension at least two")
    hermitian_defect = float(np.linalg.norm(q_matrix - q_matrix.conj().T, 2))
    if hermitian_defect > tolerance:
        raise ValueError(f"Q is not Hermitian within tolerance: {hermitian_defect}")
    norm = float(np.linalg.norm(vector))
    if not np.isfinite(norm) or norm == 0.0:
        raise ValueError("kappa must be finite and nonzero")
    kappa = vector / norm

    rayleigh = float(np.real(np.vdot(kappa, q_matrix @ kappa)))
    residual_vector = q_matrix @ kappa - rayleigh * kappa
    residual = float(np.linalg.norm(residual_vector))

    # The null space of kappa^* is the final n-1 right singular vectors.
    # Conjugating here matters for complex comparison vectors.
    _, _, vh = np.linalg.svd(kappa.conj().reshape(1, -1), full_matrices=True)
    complement = vh[1:].conj().T
    compressed = complement.conj().T @ q_matrix @ complement
    complement_eigenvalues = np.linalg.eigvalsh(compressed)
    complement_floor = (
        float(complement_eigenvalues[0]) if complement_eigenvalues.size else float("inf")
    )
    gap = complement_floor - rayleigh
    ratio = residual / gap if gap > 0.0 else float("inf")
    full_eigenvalues, full_eigenvectors = np.linalg.eigh(q_matrix)
    ground = full_eigenvectors[:, 0]
    overlap = abs(np.vdot(kappa, ground))
    observed_distance = float(np.sqrt(max(0.0, 2.0 - 2.0 * overlap)))

    report: dict[str, object] = {
        "status": "FINITE_DIAGNOSTIC_ONLY",
        "dimension": int(kappa.size),
        "hermitian_defect_2norm": hermitian_defect,
        "rayleigh_q": rayleigh,
        "residual_r": residual,
        "complement_floor": complement_floor,
        "complement_gap_Delta": gap,
        "residual_gap_ratio": ratio if np.isfinite(ratio) else None,
        "ground_eigenvalue": float(full_eigenvalues[0]),
        "second_eigenvalue": (
            float(full_eigenvalues[1]) if full_eigenvalues.size > 1 else None
        ),
        "observed_projective_distance": observed_distance,
        "theorem_distance_bound": ratio if np.isfinite(ratio) else None,
        "complement_gap_diagnostic_pass": bool(
            np.isfinite(gap) and gap > tolerance
        ),
        "legacy_full_complement_theorem_hypotheses_diagnostic_pass": False,
        "theorem2_hypotheses_diagnostic_pass": False,
        "generic_boundary_bridge_diagnostic_pass": False,
        "rh_proved": False,
    }

    if "J" in data:
        involution = np.asarray(data["J"], dtype=np.complex128)
        if involution.shape != q_matrix.shape:
            raise ValueError("J and Q dimensions differ")
        involution_defect = float(
            np.linalg.norm(involution @ involution - np.eye(kappa.size), 2)
        )
        self_adjoint_defect = float(
            np.linalg.norm(involution - involution.conj().T, 2)
        )
        commutator_defect = float(
            np.linalg.norm(q_matrix @ involution - involution @ q_matrix, 2)
        )
        kappa_even_defect = float(np.linalg.norm(involution @ kappa - kappa))
        report["involution_defect"] = involution_defect
        report["involution_self_adjoint_defect"] = self_adjoint_defect
        report["commutator_defect"] = commutator_defect
        report["kappa_even_defect"] = kappa_even_defect
        report["legacy_full_complement_theorem_hypotheses_diagnostic_pass"] = bool(
            np.isfinite(gap)
            and gap > tolerance
            and involution_defect <= tolerance
            and self_adjoint_defect <= tolerance
            and commutator_defect <= tolerance
            and kappa_even_defect <= tolerance
        )
        # Backward-compatible alias.  It is intentionally labelled legacy
        # above and must not be confused with the sector--Ritz theorem.
        report["theorem2_hypotheses_diagnostic_pass"] = report[
            "legacy_full_complement_theorem_hypotheses_diagnostic_pass"
        ]

    if "delta" in data:
        boundary = np.asarray(data["delta"], dtype=np.complex128).reshape(-1)
        if boundary.size != kappa.size:
            raise ValueError("delta and kappa dimensions differ")
        value = abs(np.vdot(boundary, kappa))
        reserve = (
            value - float(np.linalg.norm(boundary)) * ratio
            if np.isfinite(ratio)
            else None
        )
        report["boundary_value_abs"] = float(value)
        report["boundary_reserve"] = float(reserve) if reserve is not None else None
        report["boundary_condition_pass"] = bool(
            reserve is not None and reserve > tolerance
        )
        report["generic_boundary_bridge_diagnostic_pass"] = bool(
            report["theorem2_hypotheses_diagnostic_pass"]
            and report["boundary_condition_pass"]
        )

    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="NPZ containing Q and kappa")
    parser.add_argument("--tolerance", type=float, default=1e-10)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    with np.load(args.input) as loaded:
        data = {key: loaded[key] for key in loaded.files}
    report = analyze(data, args.tolerance)
    rendered = json.dumps(report, indent=2, sort_keys=True, allow_nan=False) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")


if __name__ == "__main__":
    main()
