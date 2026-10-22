#!/usr/bin/env python3
"""Replay eight exact symbolic identities for the collision audit.

Requires SymPy. These checks concern explicit examples only. They do not
certify the theta family, prove RH, or establish a bound on Newman Lambda.
Run: python3 check_collision_identities.py
"""

import sympy as sp


def main():
    z, t, c, A, C = sp.symbols("z t c A C", real=True)
    s = t - c
    examples = {
        "two-root collision": z**2 - 2*s,
        "triple capture": z*(z**2 - 6*s),
        "even noncentral collisions": (
            z**4 - (2*A**2 + 12*s)*z**2
            + A**4 + 4*A**2*s + 12*s**2
        ),
        "positive spectral measure": sp.exp(t)*sp.cos(z) + C,
    }
    passed = 0
    for name, H in examples.items():
        heat_residual = sp.simplify(sp.diff(H, t) + sp.diff(H, z, 2))
        if heat_residual != 0:
            raise AssertionError((name, "heat equation", heat_residual))
        print(f"PASS: {name}: partial_t H + partial_z^2 H = 0")
        passed += 1
        D = sp.diff(H, z)**2 - H*sp.diff(H, z, 2)
        determinant_residual = sp.simplify(
            sp.diff(D, t) + sp.diff(D, z, 2)
            - 2*(sp.diff(H, z, 2)**2 - sp.diff(H, z)*sp.diff(H, z, 3))
        )
        if determinant_residual != 0:
            raise AssertionError((name, "determinant evolution", determinant_residual))
        print(f"PASS: {name}: determinant evolution identity")
        passed += 1
    if passed != 8:
        raise AssertionError(f"Expected 8 checks, obtained {passed}")
    print("All 8 exact symbolic checks passed. No numerical RH claim.")


if __name__ == "__main__":
    main()
