#!/usr/bin/env python3
"""Reproduce the exact two-level Pauli-channel check.

The only third-party dependency is SymPy. Results are written beside this
script, irrespective of the caller's working directory. This checks the
example in ENERGY_MIXING_TRADEOFF.md, not an arithmetic lift construction.
"""

import json
from pathlib import Path

import sympy as sp


def check_energy_mixing():
    """Check the channel on a matrix basis and its exact sharpness identity."""
    identity = sp.eye(2)
    pauli_x = sp.Matrix([[0, 1], [1, 0]])
    pauli_y = sp.Matrix([[0, -sp.I], [sp.I, 0]])
    pauli_z = sp.diag(1, -1)
    a, b, delta = sp.symbols("a b delta", real=True)
    hamiltonian = sp.diag(a, b)
    centered = hamiltonian - sp.trace(hamiltonian) * identity / 2
    unitaries = [identity, pauli_x, pauli_y, pauli_z]
    weights = [(1 + 3 * delta) / 4] + [(1 - delta) / 4] * 3

    def hs_squared(matrix):
        return sp.expand(sp.trace(matrix.conjugate().T * matrix))

    def channel(matrix):
        return sum(
            (
                weight * unitary * matrix * unitary.conjugate().T
                for weight, unitary in zip(weights, unitaries)
            ),
            sp.zeros(2),
        )

    matrix_unit_checks = []
    for row in range(2):
        for column in range(2):
            matrix_unit = sp.zeros(2)
            matrix_unit[row, column] = 1
            target = (
                delta * matrix_unit
                + (1 - delta) * sp.trace(matrix_unit) * identity / 2
            )
            residual = (channel(matrix_unit) - target).applyfunc(sp.simplify)
            passed = residual == sp.zeros(2)
            if not passed:
                raise AssertionError(
                    f"Channel identity failed on E_{row + 1}{column + 1}: "
                    f"{residual}"
                )
            matrix_unit_checks.append(
                {"matrix_unit": f"E_{row + 1}{column + 1}", "passed": passed}
            )

    variance = sp.factor(hs_squared(centered))
    cost = sp.simplify(
        sum(
            weight * hs_squared(hamiltonian * unitary - unitary * hamiltonian)
            for weight, unitary in zip(weights, unitaries)
        )
    )
    sharpness_residual = sp.simplify(cost - 2 * (1 - delta) * variance)
    if sharpness_residual != 0:
        raise AssertionError(f"Sharpness identity failed: {sharpness_residual}")

    return {
        "status": "passed",
        "scope": "Exact two-level Pauli-channel example only",
        "sympy_version": sp.__version__,
        "parameters": {
            "a": "real",
            "b": "real",
            "delta": "real; 0 <= delta <= 1 for the channel interpretation",
        },
        "channel_identity": "T_delta(Q) = delta*Q + (1-delta)*Tr(Q)*I/2",
        "matrix_unit_checks": matrix_unit_checks,
        "energy_variance": str(variance),
        "mean_squared_commutator": str(sp.factor(cost)),
        "sharpness_identity": "mean_squared_commutator = 2*(1-delta)*energy_variance",
        "sharpness_residual": str(sharpness_residual),
        "sharpness_passed": True,
        "limitations": (
            "No numerical approximation is used. This verifies the displayed "
            "example, not the general propositions or an arithmetic lift."
        ),
    }


if __name__ == "__main__":
    results = check_energy_mixing()
    output_path = Path(__file__).resolve().parent / "ENERGY_MIXING_CHECKS.json"
    output_path.write_text(
        json.dumps(results, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(f"Exact Pauli-channel checks passed: {output_path}")
