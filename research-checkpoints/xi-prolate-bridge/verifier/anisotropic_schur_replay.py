#!/usr/bin/env python3
"""Independent replay of the serialized anisotropic Schur formulas.

This verifier does not import the producer module and does not trust producer
pass flags.  It reconstructs the lower Schur matrices, exact point Schur
complements, and the even forced-resolvent bound from serialized raw blocks.
It shares mpmath with the producer, which is an explicit independence limit.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import mpmath as mp


def _matrix(rows: list[list[str]]) -> mp.matrix:
    return mp.matrix([[mp.mpf(value) for value in row] for row in rows])


def _vector(values: list[str]) -> mp.matrix:
    return mp.matrix([mp.mpf(value) for value in values])


def _norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(vector[i]) ** 2 for i in range(vector.rows)))


def _minimum_eigenvalue(matrix: mp.matrix) -> mp.mpf:
    values, _ = mp.eighe((matrix + matrix.H) / 2)
    return mp.re(values[0])


def _operator_norm(matrix: mp.matrix) -> mp.mpf:
    if matrix.rows == 0 or matrix.cols == 0:
        return mp.mpf("0")
    values, _ = mp.eighe(matrix.H * matrix)
    return mp.sqrt(max(mp.mpf("0"), mp.re(values[-1])))


def _inverse_square_root(matrix: mp.matrix) -> tuple[mp.mpf, mp.matrix]:
    values, vectors = mp.eighe((matrix + matrix.H) / 2)
    if values[0] <= 0:
        raise ValueError("serialized lower Schur model is not positive")
    inverse_root = (
        vectors
        * mp.diag([1 / mp.sqrt(values[i]) for i in range(values.rows)])
        * vectors.H
    )
    return mp.re(values[0]), inverse_root


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    if matrix.rows == 0 or matrix.cols == 0:
        return mp.mpf("0")
    return max(abs(matrix[i, j]) for i in range(matrix.rows) for j in range(matrix.cols))


def replay_block(block: dict[str, object], with_forcing: bool) -> dict[str, object]:
    low = _matrix(block["low_block"])
    high = _matrix(block["high_block"])
    coupling = _matrix(block["low_high_coupling"])
    g = _minimum_eigenvalue(high)
    if g <= 0:
        raise ValueError("replay rejects a nonpositive high floor")
    high_inverse = mp.inverse(high)
    lower = low - coupling.H * coupling / g
    exact = low - coupling.H * high_inverse * coupling
    report: dict[str, object] = {
        "high_floor_g": g,
        "lower_Schur_model": lower,
        "lower_Schur_floor": _minimum_eigenvalue(lower),
        "exact_point_Schur": exact,
        "exact_point_Schur_floor": _minimum_eigenvalue(exact),
        "exact_minus_lower_floor": _minimum_eigenvalue(exact - lower),
        "producer_lower_matrix_disagreement": _max_abs(
            lower - _matrix(block["matrix_schur_lower_model_low_minus_CtC_over_G"])
        ),
        "producer_lower_floor_disagreement": abs(
            _minimum_eigenvalue(lower) - mp.mpf(block["matrix_schur_lower_floor"])
        ),
        "forced_bound": None,
    }
    if not with_forcing:
        return report
    if report["lower_Schur_floor"] <= 0:
        report["forced_bound_unavailable_reason"] = (
            "reconstructed lower Schur model is nonpositive"
        )
        return report
    forcing = block["forcing_resolvent_decomposition"]
    low_forcing = _vector(forcing["low_forcing"])
    high_forcing = _vector(forcing["high_forcing"])
    d, inverse_root = _inverse_square_root(lower)
    z0 = high_inverse * high_forcing
    e = high_forcing - high * z0
    theta = _operator_norm(coupling * inverse_root) / g
    F = _norm(inverse_root * (low_forcing - coupling.H * z0)) + theta * _norm(e)
    Z = _norm(z0) + _norm(e) / g
    upper = mp.sqrt(F**2 / d + (Z + theta * F) ** 2)
    report["forced_bound"] = {
        "d": d,
        "z0": z0,
        "e": e,
        "Theta": theta,
        "F": F,
        "Z": Z,
        "T_AS": upper,
    }
    producer = forcing.get("anisotropic_matrix_Schur_bound")
    if producer is not None:
        report["forced_bound"]["producer_T_disagreement"] = abs(
            upper - mp.mpf(producer["T"])
        )
    return report


def _serialize(value: object, digits: int) -> object:
    if isinstance(value, mp.matrix):
        if value.cols == 1:
            return [mp.nstr(value[i], digits) for i in range(value.rows)]
        return [
            [mp.nstr(value[i, j], digits) for j in range(value.cols)]
            for i in range(value.rows)
        ]
    if isinstance(value, (mp.mpf, mp.mpc)):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _serialize(item, digits) for key, item in value.items()}
    return value


def replay(path: Path, dps: int) -> dict[str, object]:
    mp.mp.dps = dps
    producer = json.loads(path.read_text())
    even = replay_block(producer["shifted_even_window_decomposition"], True)
    odd = replay_block(producer["shifted_odd_window_decomposition"], False)
    return {
        "terminal_state": "P0_INVALIDATED",
        "claim_class": "FINITE_NONCERTIFIED_INDEPENDENT_ANISOTROPIC_FORMULA_REPLAY",
        "analytic_uniform_claim": False,
        "input_artifact": str(path),
        "precision_decimal_digits": dps,
        "even": _serialize(even, dps),
        "odd": _serialize(odd, dps),
        "independence_limit": "producer and verifier both use mpmath",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifact", type=Path)
    parser.add_argument("--dps", type=int, default=50)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = replay(args.artifact, args.dps)
    text = json.dumps(result, indent=2) + "\n"
    if args.output is not None:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
