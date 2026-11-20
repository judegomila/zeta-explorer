#!/usr/bin/env python3
"""Exploratory exponent summary for a deterministic diagonal schedule.

The fits are finite diagnostics.  In particular, a two-point log slope is
reported only as a two-point slope and is never promoted to an exponent
estimate.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import mpmath as mp

from weil_matrix import decimal_square_ceil


def _power_fit(rows: list[dict[str, object]], key: str) -> dict[str, str]:
    usable = [row for row in rows if row.get(key) is not None]
    if len(usable) < 2:
        return {"fit_rejected": "fewer than two finite positive values"}
    xs = [mp.log(mp.mpf(row["lambda"])) for row in usable]
    ys = [mp.log(mp.mpf(row[key])) for row in usable]
    local = [-(ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]) for i in range(len(xs) - 1)]
    if len(usable) < 3:
        return {
            "fit_rejected": "fewer than three points",
            "two_point_log_slope_not_an_exponent_estimate": mp.nstr(local[0], 20),
        }
    n = len(usable)
    x_mean = mp.fsum(xs) / n
    y_mean = mp.fsum(ys) / n
    sxx = mp.fsum((x - x_mean) ** 2 for x in xs)
    slope = mp.fsum((x - x_mean) * (y - y_mean) for x, y in zip(xs, ys)) / sxx
    intercept = y_mean - slope * x_mean
    residuals = [y - intercept - slope * x for x, y in zip(xs, ys)]
    standard_error = mp.sqrt(mp.fsum(value * value for value in residuals) / (n - 2) / sxx)
    return {
        "model": f"{key} approximately C*lambda^(-p)",
        "p": mp.nstr(-slope, 20),
        "ordinary_least_squares_standard_error_only": mp.nstr(standard_error, 20),
        "local_slope_min": mp.nstr(min(local), 20),
        "local_slope_max": mp.nstr(max(local), 20),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("inputs", nargs="+", type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--multiplier", type=int, default=1)
    args = parser.parse_args()
    if args.multiplier < 1:
        raise ValueError("multiplier must be positive")

    rows: list[dict[str, object]] = []
    for path in args.inputs:
        artifact = json.loads(path.read_text())
        lambda_text = artifact["inputs"]["lambda"]
        lam = mp.mpf(lambda_text)
        N = int(artifact["inputs"]["N"])
        if N != args.multiplier * decimal_square_ceil(lambda_text):
            raise ValueError("input is not on requested diagonal schedule")
        residual = artifact["residual_gap"]
        sector_pass = bool(residual.get("sector_refined_bridge_diagnostic_pass", False))
        sector_ratio = residual.get("r_over_even_ritz_gap") if sector_pass else None
        weighted_pass = bool(residual.get("resolvent_weighted_bound_diagnostic_pass", False))
        weighted_tau = residual.get("resolvent_weighted_tau") if weighted_pass else None
        weighted_chordal = (
            residual.get("resolvent_weighted_chordal_distance_bound")
            if weighted_pass
            else None
        )
        rows.append(
            {
                "lambda": mp.nstr(lam, 30),
                "N": N,
                "projection_error": artifact["projection"]["projection_error"],
                "legacy_full_complement_Delta": residual["Delta"],
                "legacy_r_over_Delta": residual["r_over_Delta"],
                "even_gap_from_q_Delta_even": residual.get("Delta_even"),
                "even_complement_floor_minus_ritz_upper_Gamma": residual.get(
                    "even_complement_floor_minus_ritz_upper"
                ),
                "odd_floor_minus_ritz_upper": residual.get("odd_floor_minus_ritz_upper"),
                "sector_refined_bridge_diagnostic_pass": sector_pass,
                "scalar_r_over_Gamma": sector_ratio,
                "resolvent_weighted_bound_diagnostic_pass": weighted_pass,
                "resolvent_weighted_tau": weighted_tau,
                "resolvent_weighted_chordal_distance_bound": weighted_chordal,
                "source": str(path),
            }
        )
    rows.sort(key=lambda row: mp.mpf(row["lambda"]))

    projection_fit = _power_fit(rows, "projection_error")
    legacy_fit = _power_fit(rows, "legacy_r_over_Delta")
    scalar_fit = _power_fit(rows, "scalar_r_over_Gamma")
    weighted_fit = _power_fit(rows, "resolvent_weighted_tau")
    weighted_chordal_fit = _power_fit(
        rows, "resolvent_weighted_chordal_distance_bound"
    )
    sector_passing = sum(bool(row["sector_refined_bridge_diagnostic_pass"]) for row in rows)
    weighted_passing = sum(bool(row["resolvent_weighted_bound_diagnostic_pass"]) for row in rows)
    result = {
        "terminal_state": "P0_INVALIDATED",
        "claim_class": "EXPLORATORY_DIAGNOSTIC",
        "schedule": f"N={args.multiplier}*ceil(lambda^2)",
        "rows": rows,
        "projection_error_power_fit": projection_fit,
        "operative_resolvent_weighted_tau_power_fit": weighted_fit,
        "operative_resolvent_weighted_chordal_power_fit": weighted_chordal_fit,
        "resolvent_weighted_passing_points": weighted_passing,
        "scalar_r_over_Gamma_power_fit": scalar_fit,
        "sector_refined_passing_points": sector_passing,
        "legacy_full_complement_ratio_power_fit": legacy_fit,
        "legacy_fit_warning": (
            "the requested legacy r/Delta fit is retained, but the global complement gap "
            "and scalar r/Gamma discard the residual spectral weighting; the operative "
            "finite eigenvector diagnostic is the resolvent-weighted chordal bound"
        ),
        "uncertainty_warning": (
            "OLS standard error excludes discretization and asymptotic model error; "
            "the local-slope range is reported; no extrapolation is authorized"
        ),
        "target_reference": "DIRECT_RH_ATTACK.md equation (5.2)",
        "analytic_uniform_claim": False,
    }
    text = json.dumps(result, indent=2, sort_keys=True) + "\n"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
