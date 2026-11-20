"""Finite CCM determinant identities and scale-free Mellin error bounds.

This module replays only the algebra in CCM-ZST-v1 Proposition 5.9 and
Theorem 5.10.  It does not establish a simple-even Weil ground state on an
unbounded schedule or any determinant limit.
"""
from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Sequence

import mpmath as mp


CCM_ZST_PDF = "vendor/CCM-ZST-2511.22755v1.pdf"
CCM_ZST_SHA256 = (
    "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
)


def verify_ccm_source(repo_root: Path | None = None) -> str:
    """Verify the exact PDF bytes used by the determinant replay."""
    root = Path(__file__).resolve().parents[1] if repo_root is None else Path(repo_root)
    digest = hashlib.sha256((root / CCM_ZST_PDF).read_bytes()).hexdigest()
    if digest != CCM_ZST_SHA256:
        raise ValueError("CCM-ZST-v1 source hash mismatch")
    return digest


def _positive_real(value: object, name: str) -> mp.mpf:
    if isinstance(value, float):
        raise TypeError(f"{name} must not enter through binary64")
    out = mp.mpf(value)
    if not mp.isfinite(out) or out <= 0:
        raise ValueError(f"{name} must be finite and positive")
    return out


def _validate_modes(coefficients: Sequence[object], modes: Sequence[int]) -> None:
    if len(coefficients) != len(modes) or not coefficients:
        raise ValueError("coefficients and modes must have the same nonzero length")
    if any(isinstance(n, bool) or not isinstance(n, int) for n in modes):
        raise TypeError("modes must be exact integers")
    if len(set(modes)) != len(modes):
        raise ValueError("modes must be distinct")


def boundary_value(
    coefficients: Sequence[object],
    L: object,
) -> mp.mpc:
    """Return ``delta_N(xi)=L^(-1/2) sum_j xi_j``."""
    length = _positive_real(L, "L")
    return mp.fsum(mp.mpc(c) for c in coefficients) / mp.sqrt(length)


def mellin_transform_from_modes(
    coefficients: Sequence[object],
    modes: Sequence[int],
    L: object,
    z: object,
) -> mp.mpc:
    """Evaluate source (5.25) away from its removable-mode singularities."""
    _validate_modes(coefficients, modes)
    length = _positive_real(L, "L")
    point = mp.mpc(z)
    frequencies = [2 * mp.pi * n / length for n in modes]
    if any(point == frequency for frequency in frequencies):
        # Direct integration resolves every apparent pole and also handles
        # simultaneous zero contributions from the other modes.
        total = mp.mpc(0)
        for coefficient, frequency in zip(coefficients, frequencies):
            difference = frequency - point
            if difference == 0:
                integral = length
            else:
                integral = mp.expm1(1j * difference * length) / (1j * difference)
            # lambda^(iz)=exp(iz L/2) is the centered-coordinate factor.
            total += mp.mpc(coefficient) * mp.exp(1j * point * length / 2) * integral
        return total / mp.sqrt(length)
    return (
        2
        * mp.sin(point * length / 2)
        / mp.sqrt(length)
        * mp.fsum(
            mp.mpc(coefficient) / (point - frequency)
            for coefficient, frequency in zip(coefficients, frequencies)
        )
    )


def source_regularized_determinant(
    coefficients: Sequence[object],
    modes: Sequence[int],
    L: object,
    z: object,
) -> mp.mpc:
    """Evaluate the boundary-normalized determinant in source Theorem 5.10.

    The input vector may have any nonzero scale.  Dividing by its exact
    boundary value makes the result invariant under arbitrary nonzero
    rescaling.  A zero boundary value is rejected because the source rank-one
    perturbation is then undefined.
    """
    _validate_modes(coefficients, modes)
    length = _positive_real(L, "L")
    delta = boundary_value(coefficients, length)
    if delta == 0:
        raise ValueError("source boundary normalization is zero")
    transform = mellin_transform_from_modes(coefficients, modes, length, z)
    return -1j * mp.exp(-1j * mp.mpc(z) * length / 2) * transform / delta


def determinant_rational_product(
    coefficients: Sequence[object],
    modes: Sequence[int],
    L: object,
    z: object,
) -> mp.mpc:
    """Independently evaluate source (5.27) for a generic spectral point."""
    _validate_modes(coefficients, modes)
    length = _positive_real(L, "L")
    point = mp.mpc(z)
    delta = boundary_value(coefficients, length)
    if delta == 0:
        raise ValueError("source boundary normalization is zero")
    normalized = [mp.mpc(c) / delta for c in coefficients]
    frequencies = [2 * mp.pi * n / length for n in modes]
    if any(point == frequency for frequency in frequencies):
        raise ValueError("rational replay requires a non-lattice spectral point")
    return (
        (1 - mp.exp(-1j * point * length))
        / mp.sqrt(length)
        * mp.fsum(
            coefficient / (frequency - point)
            for coefficient, frequency in zip(normalized, frequencies)
        )
    )


def mellin_l2_error_bound(
    lambda_value: object,
    eta: object,
    l2_error: object,
) -> mp.mpf:
    """Return the exact Cauchy--Schwarz bound used on a closed substrip."""
    lam = _positive_real(lambda_value, "lambda")
    if lam <= 1:
        raise ValueError("lambda must exceed one")
    if isinstance(eta, float) or isinstance(l2_error, float):
        raise TypeError("eta and l2_error must not enter through binary64")
    strip = mp.mpf(eta)
    error = mp.mpf(l2_error)
    if not mp.isfinite(strip) or strip < 0 or strip >= mp.mpf("0.5"):
        raise ValueError("eta must satisfy 0<=eta<1/2")
    if not mp.isfinite(error) or error < 0:
        raise ValueError("l2_error must be finite and nonnegative")
    return mp.sqrt(2 * mp.log(lam)) * lam**strip * error


def scaled_vector_error(
    projected_norm: object,
    projection_error: object,
    unit_vector_error: object,
) -> mp.mpf:
    """Return ``e+||p||d`` from the scale-free triangle inequality."""
    norm = _positive_real(projected_norm, "projected_norm")
    if isinstance(projection_error, float) or isinstance(unit_vector_error, float):
        raise TypeError("errors must not enter through binary64")
    projection = mp.mpf(projection_error)
    vector = mp.mpf(unit_vector_error)
    if projection < 0 or vector < 0:
        raise ValueError("errors must be nonnegative")
    return projection + norm * vector
