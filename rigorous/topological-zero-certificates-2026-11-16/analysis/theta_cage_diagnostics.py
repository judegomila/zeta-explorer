"""Reproduce nonrigorous diagnostics for the proved absolute-moment obstruction.

Requires mpmath. Numerical outputs are not interval certificates; the proof is
in theta_cage_obstruction_and_contour_shift.md.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import mpmath as mp


def phi(u):
    # The omitted n >= 15 contribution is tiny in this diagnostic. This script
    # intentionally does not present this finite evaluation as a certified bound.
    return mp.fsum(
        (2 * mp.pi**2 * n**4 * mp.exp(9 * u)
         - 3 * mp.pi * n**2 * mp.exp(5 * u))
        * mp.exp(-mp.pi * n * n * mp.exp(4 * u))
        for n in range(1, 15)
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--precision", type=int, default=60)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    mp.mp.dps = args.precision
    moment = mp.quad(lambda u: u * u * phi(u), [0, .25, .5, 1, 1.5, 2])
    results = {
        "status": "diagnostic floating-point calculations, not interval certificates",
        "precision_decimal_digits": args.precision,
        "normalization": "H_0(z) = xi(1/2 + i*z/2)/8",
        "M2_at_zero": mp.nstr(moment, 40),
        "rows": [],
    }
    for n in (1, 10, 100, 1000):
        gamma = mp.im(mp.zetazero(n))
        s = mp.mpf("0.5") + 1j * gamma
        prefactor = s * (s - 1) / 2 * mp.power(mp.pi, -s / 2) * mp.gamma(s / 2)
        # At an exact zero, xi'(s)=prefactor*zeta'(s). At the numerical
        # approximate zero the omitted prefactor'*zeta term is negligible.
        slope = abs(prefactor * mp.diff(mp.zeta, s)) / 16
        results["rows"].append({
            "zero_index": n,
            "zeta_ordinate": mp.nstr(gamma, 30),
            "H0_abscissa": mp.nstr(2 * gamma, 30),
            "log10_H0_slope": mp.nstr(mp.log10(slope), 30),
            "log10_necessary_radius_upper_bound": mp.nstr(mp.log10(2 * slope / moment), 30),
        })
    rendered = json.dumps(results, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered)
    print(rendered, end="")


if __name__ == "__main__":
    main()
