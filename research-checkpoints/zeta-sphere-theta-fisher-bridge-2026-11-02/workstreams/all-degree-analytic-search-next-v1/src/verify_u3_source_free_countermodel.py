#!/usr/bin/env python3
"""Certify an explicit source-free obstruction to a uniform U3 theorem.

This does *not* test the complete-theta residuals.  It certifies, using Arb
balls and closed Gaussian moment formulae, that the positive even Schwartz
weight

    W(t) = exp(-t^2/2) + exp(-t^2/800)/100

and q(t)=t have positive Sobolev target but negative U3 projected margin.
For q=t the nominal three generators {q', tq, t^2 q'} have rank two and
reduce to {1,t^2}.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from flint import arb, ctx


ctx.prec = 256


def endpoints(value: arb, digits: int = 60) -> dict[str, str]:
    return {
        "lower": value.lower().str(digits),
        "upper": value.upper().str(digits),
        "arb": value.str(45),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    # s = c^(-1/2), c=401/800, so s=sqrt(800/401).
    s = (arb(800) / 401).sqrt()
    sqrt_pi = arb.pi().sqrt()

    # m_j = integral_R t^(2j) W(t)^2 dt = sqrt(pi) * a_j.
    a0 = arb(501) / 500 + s / 50
    a1 = arb(9) / 10 + s**3 / 100
    a2 = arb(963) / 4 + 3 * s**5 / 200
    m0, m1, m2 = (sqrt_pi * value for value in (a0, a1, a2))

    gram_det = m0 * m2 - m1**2

    # For the rank-adapted basis r=(1,t^2), y=(0,2m1).
    projected_score_energy = 4 * m0 * m1**2 / gram_det
    dimensionless_margin = projected_score_energy / m0 - 1
    auxiliary_H = (projected_score_energy - m0) / 4
    determinant_numerator = 5 * m1**2 - m0 * m2

    # J = integral_R t^2 W'(t)^2 dt = sqrt(pi) * j.
    j = arb(1503) / 2000 + 3 * s**5 / 80000
    weighted_derivative_energy = sqrt_pi * j

    # For q=t and score s_q=-W-2tW', integration by parts gives
    # ||s_q||^2-||q'W||^2 = 4J-2m0.
    target_gap = 4 * weighted_derivative_energy - 2 * m0
    sobolev_target = target_gap / (8 * arb.pi())

    # Independent exact-algebra expression used in the accompanying note.
    target_gap_normalized = (
        arb(501) / 500 - s / 25 + 3 * s**5 / 20000
    )
    assert (target_gap / sqrt_pi - target_gap_normalized).contains(0)

    assert s < 2
    assert gram_det > 0
    assert target_gap > 0
    assert sobolev_target > 0
    assert determinant_numerator < 0
    assert dimensionless_margin < 0
    assert auxiliary_H < 0

    source = Path(__file__).read_bytes()
    receipt = {
        "status": "PASS",
        "claim_scope": {
            "kind": "source-free countermodel",
            "complete_theta_test": False,
            "rh_claim": False,
            "statement": (
                "Positive even Schwartz geometry plus a positive Sobolev target "
                "does not imply nonnegative U3 projected margin."
            ),
        },
        "model": {
            "q": "t",
            "W": "exp(-t^2/2) + exp(-t^2/800)/100",
            "u3_rank_adapted_basis": ["1", "t^2"],
            "s_exact": "sqrt(800/401)",
        },
        "normalized_moments": {
            "m0_over_sqrt_pi": endpoints(a0),
            "m1_over_sqrt_pi": endpoints(a1),
            "m2_over_sqrt_pi": endpoints(a2),
            "J_over_sqrt_pi": endpoints(j),
        },
        "certified_quantities": {
            "gram_determinant": endpoints(gram_det),
            "determinant_numerator_5m1sq_minus_m0m2": endpoints(
                determinant_numerator
            ),
            "projected_score_energy": endpoints(projected_score_energy),
            "dimensionless_u3_margin": endpoints(dimensionless_margin),
            "auxiliary_H": endpoints(auxiliary_H),
            "target_gap_norm_score_sq_minus_A": endpoints(target_gap),
            "sobolev_target_S": endpoints(sobolev_target),
        },
        "proof_checks": {
            "s_lt_2": True,
            "gram_positive": True,
            "target_gap_positive": True,
            "u3_margin_negative": True,
        },
        "reproducibility": {
            "python_flint_precision_bits": ctx.prec,
            "script_sha256": hashlib.sha256(source).hexdigest(),
        },
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n")
    print(
        json.dumps(
            {
                "status": "PASS",
                "output": str(args.output),
                "target_gap_lower": target_gap.lower().str(30),
                "u3_margin_upper": dimensionless_margin.upper().str(30),
                "script_sha256": receipt["reproducibility"]["script_sha256"],
            },
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
