#!/usr/bin/env python3
"""Signed modular h/-h pair diagnostic for one fixed center interpolant.

This worker is for structure discovery and falsification only.  It keeps the
same polynomial A fixed while h moves, so it does not silently replace the
center interpolation problem by a different one at every sample.  The exact
paired identities are checked against direct complete-theta orbit sums; no
finite result is a positivity certificate or an RH result.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
import platform
import sys
import time
from pathlib import Path
from typing import Sequence

import mpmath as mp


SCHEMA_VERSION = 1
STATUS = "signed_h_pair_diagnostic"
SOURCE_PATH = Path(__file__).resolve()
SCALE_GRID = ((1, "0.25"), (1, "1"), (1, "4"), (2, "0.25"), (2, "1"), (2, "4"))
SCALE_GRID_NAME = "beta1_beta2_c0p25_1_4"


def _load_residue_module():
    path = (
        SOURCE_PATH.parents[2]
        / "all-degree-analytic-search"
        / "src"
        / "parity_residue.py"
    )
    spec = importlib.util.spec_from_file_location("parity_residue_shared", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot import shared worker at {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module, path


RESIDUE, RESIDUE_PATH = _load_residue_module()


def progress(enabled: bool, event: str, **fields: object) -> None:
    if enabled:
        print(json.dumps({"event": event, **fields}, sort_keys=True), file=sys.stderr, flush=True)


def mp_text(value: mp.mpf, digits: int) -> str:
    return mp.nstr(value, n=max(20, digits), strip_zeros=False)


def finite_grid(values: Sequence[str]) -> tuple[tuple[int, str], ...]:
    parsed: list[tuple[int, str]] = []
    for value in values:
        try:
            beta_text, constant_text = value.split(":", 1)
            beta = int(beta_text)
            constant = mp.mpf(constant_text)
        except Exception as exc:
            raise ValueError(f"invalid --scaled-h {value!r}; expected beta:constant") from exc
        if beta not in {1, 2} or constant <= 0 or not mp.isfinite(constant):
            raise ValueError("scaled h requires beta in {1,2} and a positive finite constant")
        parsed.append((beta, constant_text))
    if len(set(parsed)) != len(parsed):
        raise ValueError("duplicate --scaled-h entries")
    return tuple(parsed)


def read_manifest(path: Path) -> tuple[dict[str, object], str]:
    raw = path.read_bytes()
    payload = json.loads(raw)
    if payload.get("status") != "exact_egf_identity":
        raise ValueError("EGF manifest does not have status exact_egf_identity")
    if payload.get("parameters") != {
        "full_polynomial_degree": 64,
        "scalar_degree": 128,
    }:
        raise ValueError("EGF manifest parameters do not match the stage-0 gate")
    checks = payload.get("checks")
    if not isinstance(checks, dict) or checks.get("all_exact_checks_passed") is not True:
        raise ValueError("EGF manifest did not pass every exact check")
    return payload, hashlib.sha256(raw).hexdigest()


def eval_poly(poly: Sequence[mp.mpf], z: mp.mpf) -> mp.mpf:
    return RESIDUE.eval_mp(poly, z)


def derivative_poly(poly: Sequence[mp.mpf]) -> list[mp.mpf]:
    return [mp.mpf(index) * poly[index] for index in range(1, len(poly))] or [mp.mpf("0")]


def orbit_rows(poly: Sequence[mp.mpf], h: mp.mpf, max_orbit: int) -> dict[str, object]:
    """Evaluate Psi_A, chi, q and named sign-split diagnostics."""

    scale = mp.pi * mp.exp(2 * h)
    prefactor = mp.exp(h / 2)
    psi_terms: list[mp.mpf] = []
    theta_terms: list[mp.mpf] = []
    weight_rows: list[tuple[mp.mpf, mp.mpf]] = []
    for index in range(1, max_orbit + 1):
        z = scale * index * index
        exponential = prefactor * mp.exp(-z)
        value = eval_poly(poly, z)
        raw_weight = exponential * z * (2 * z - 3)
        psi_terms.append(4 * raw_weight * value)
        theta_terms.append(2 * exponential)
        weight_rows.append((raw_weight, value))

    psi_a = mp.fsum(psi_terms)
    q = prefactor + mp.fsum(theta_terms)
    chi = mp.fsum(4 * prefactor * mp.exp(-scale * k * k) * scale * k * k for k in range(1, max_orbit + 1))
    q_prime = q / 2 - chi

    signed_norm = mp.fsum(weight * abs(value) ** 2 for weight, value in weight_rows)
    absolute_mass = mp.fsum(abs(weight) for weight, _ in weight_rows)
    absolute_norm = mp.fsum(abs(weight) * abs(value) ** 2 for weight, value in weight_rows)
    positive_mass = mp.fsum(max(weight, mp.mpf("0")) for weight, _ in weight_rows)
    positive_norm = mp.fsum(max(weight, mp.mpf("0")) * abs(value) ** 2 for weight, value in weight_rows)
    negative_mass = mp.fsum(max(-weight, mp.mpf("0")) for weight, _ in weight_rows)
    negative_norm = mp.fsum(max(-weight, mp.mpf("0")) * abs(value) ** 2 for weight, value in weight_rows)
    last = abs(psi_terms[-1])
    previous = abs(psi_terms[-2]) if max_orbit > 1 else mp.mpf("0")
    return {
        "psi": psi_a,
        "q": q,
        "q_prime": q_prime,
        "chi": chi,
        "psi_terms": psi_terms,
        "weight_diagnostics": {
            "all_weights_positive": negative_mass == 0,
            "signed_polynomial_square_sum": signed_norm,
            "absolute_parent_mass": absolute_mass,
            "absolute_parent_polynomial_l2": mp.sqrt(absolute_norm / absolute_mass) if absolute_mass else mp.nan,
            "positive_weight_mass": positive_mass,
            "positive_part_polynomial_l2": mp.sqrt(positive_norm / positive_mass) if positive_mass else mp.nan,
            "negative_weight_mass": negative_mass,
            "negative_part_polynomial_l2": mp.sqrt(negative_norm / negative_mass) if negative_mass else mp.mpf("0"),
        },
        "tail_diagnostic": {
            "last_orbit_abs_psi_term": last,
            "last_to_previous_abs_ratio": last / previous if previous else mp.mpf("0"),
            "rigorous_bound": False,
        },
    }


def paired_sample(
    poly: Sequence[mp.mpf], ell: mp.mpf, parity: str, h: mp.mpf, max_orbit: int
) -> dict[str, object]:
    plus = orbit_rows(poly, h, max_orbit)
    minus = orbit_rows(poly, -h, max_orbit)
    sign = mp.mpf("1") if parity == "even" else mp.mpf("-1")
    numerator = minus["psi"] - sign * plus["psi"]
    denominator = (2 * plus["q_prime"]) if parity == "even" else plus["q"]
    paired_ell = numerator / denominator
    target = denominator * ell
    scale = max(abs(numerator), abs(target), mp.mpf(10) ** (-mp.mp.dps + 20))
    identity_relative = abs(numerator - target) / scale

    contributions = [
        minus_value - sign * plus_value
        for minus_value, plus_value in zip(minus["psi_terms"], plus["psi_terms"])
    ]
    cumulative: list[mp.mpf] = []
    running = mp.mpf("0")
    for value in contributions:
        running += value
        cumulative.append(running)
    positive = mp.fsum(max(value, mp.mpf("0")) for value in contributions)
    negative = mp.fsum(max(-value, mp.mpf("0")) for value in contributions)
    total_variation = positive + negative

    f_plus = plus["psi"] - ell * plus["chi"]
    f_minus = minus["psi"] - ell * minus["chi"]
    parity_scale = max(abs(f_plus), abs(f_minus), mp.mpf(10) ** (-mp.mp.dps + 20))
    parity_residual = abs(f_minus - sign * f_plus) / parity_scale
    return {
        "h": h,
        "psi_plus": plus["psi"],
        "psi_minus": minus["psi"],
        "chi_plus": plus["chi"],
        "chi_minus": minus["chi"],
        "q": plus["q"],
        "q_prime": plus["q_prime"],
        "direct_ell": ell,
        "paired_ell": paired_ell,
        "signed_numerator": numerator,
        "signed_denominator": denominator,
        "stabilized_numerator_over_2h": numerator / (2 * h),
        "stabilized_denominator_over_2h": denominator / (2 * h),
        "paired_identity_relative_residual": identity_relative,
        "feature_plus": f_plus,
        "feature_minus": f_minus,
        "feature_parity_relative_residual": parity_residual,
        "orbit_signed_contributions": contributions,
        "orbit_cumulative_signed": cumulative,
        "positive_contribution_sum": positive,
        "negative_contribution_abs_sum": negative,
        "total_variation": total_variation,
        "total_variation_over_abs_signed_total": total_variation / abs(numerator) if numerator else mp.inf,
        "plus_weight_diagnostics": plus["weight_diagnostics"],
        "minus_weight_diagnostics": minus["weight_diagnostics"],
        "plus_tail_diagnostic": plus["tail_diagnostic"],
        "minus_tail_diagnostic": minus["tail_diagnostic"],
    }


def simpson_feature_energy(
    poly: Sequence[mp.mpf], ell: mp.mpf, upper: mp.mpf, max_orbit: int, panels: int = 16
) -> mp.mpf:
    """Composite Simpson diagnostic; deliberately not an interval bound."""

    if panels % 2:
        raise ValueError("Simpson panels must be even")
    step = upper / panels
    total = mp.mpf("0")
    for index in range(panels + 1):
        h = step * index
        values = orbit_rows(poly, h, max_orbit)
        feature = values["psi"] - ell * values["chi"]
        factor = 1 if index in {0, panels} else (4 if index % 2 else 2)
        total += factor * abs(feature) ** 2
    return step * total / 3


def center_diagnostics(
    poly: Sequence[mp.mpf], ell: mp.mpf, n: int, parity: str, max_orbit: int
) -> dict[str, object]:
    center = orbit_rows(poly, mp.mpf("0"), max_orbit)
    z_values = [mp.pi * index * index for index in range(1, max_orbit + 1)]
    weights = [z * (2 * z - 3) * mp.exp(-z) for z in z_values]
    w_total = mp.fsum(weights)
    s_total = mp.fsum(z * mp.exp(-z) for z in z_values)
    tail_weight = mp.fsum(weights[n:])
    tail_square = mp.fsum(
        weights[index] * abs(eval_poly(poly, z_values[index])) ** 2
        for index in range(n, max_orbit)
    ) / w_total
    result: dict[str, object] = {
        "W": w_total,
        "S": s_total,
        "center_q": center["q"],
        "center_chi": center["chi"],
        "polynomial_tail_l2_squared": tail_square,
    }
    if parity == "odd":
        bound = mp.sqrt(w_total * tail_weight) / s_total
        observed = abs(ell) / mp.sqrt(tail_square) if tail_square else mp.inf
        result.update(
            {
                "odd_exact_tail_bound": bound,
                "odd_observed_ratio": observed,
                "odd_observed_over_bound": observed / bound,
                "odd_identity_ell": center["psi"] / center["chi"],
            }
        )
    else:
        derivative = derivative_poly(poly)
        psi_prime = mp.mpf("0")
        for z in z_values:
            exponential = mp.exp(-z)
            p_zero = 4 * z * (2 * z - 3)
            p_zero_prime = 16 * z - 12
            a_value = eval_poly(poly, z)
            a_prime = eval_poly(derivative, z)
            psi_prime += exponential * (
                (mp.mpf("0.5") - 2 * z) * p_zero * a_value
                + 2 * z * (p_zero_prime * a_value + p_zero * a_prime)
            )
        q_second = 4 * w_total + 2 * s_total
        result.update(
            {
                "even_psi_prime_at_zero": psi_prime,
                "even_q_second_at_zero": q_second,
                "even_lhopital_ell": -psi_prime / q_second,
                "even_lhopital_relative_residual": abs(-psi_prime - ell * q_second)
                / max(abs(psi_prime), abs(ell * q_second), mp.mpf(10) ** (-mp.mp.dps + 20)),
            }
        )
    return result


def run_experiment(
    *,
    n: int,
    parity: str,
    dps: int,
    scaled_h: tuple[tuple[int, str], ...],
    egf_manifest: Path,
    max_orbit: int,
    max_seconds: float,
    progress_enabled: bool = False,
) -> dict[str, object]:
    if not 1 <= n <= 40:
        raise ValueError("n must lie in [1,40]")
    if parity not in {"even", "odd"}:
        raise ValueError("parity must be even or odd")
    if dps < 100:
        raise ValueError("dps must be at least 100")
    if not 32 <= max_orbit <= 256:
        raise ValueError("max_orbit must lie in [32,256]")
    if max_seconds <= 0:
        raise ValueError("max_seconds must be positive")

    started = time.monotonic()
    manifest, manifest_hash = read_manifest(egf_manifest)
    max_grade = 2 * n + (1 if parity == "odd" else 0)
    basis = RESIDUE.graded_basis(max_grade)
    with mp.workdps(dps):
        progress(progress_enabled, "center_interpolation", n=n, parity=parity)
        solved = RESIDUE.interpolation(n, parity, mp.mpf("0"), basis, progress_enabled)
        poly = list(solved["monomials"])
        ell = solved["ell"]
        digits_lost = max(mp.mpf("0"), mp.log10(solved["condition"]))
        retained_digits = mp.mpf(dps) - digits_lost
        if retained_digits < 100:
            raise ArithmeticError(
                f"only {mp.nstr(retained_digits, 12)} nominal digits remain after conditioning"
            )
        if time.monotonic() - started > max_seconds:
            raise TimeoutError("time guard exceeded after interpolation")

        rows: list[dict[str, object]] = []
        for beta, constant_text in scaled_h:
            h = mp.mpf(constant_text) / mp.mpf(n) ** beta
            progress(progress_enabled, "paired_sample", beta=beta, constant=constant_text)
            row = paired_sample(poly, ell, parity, h, max_orbit)
            row["beta"] = beta
            row["constant"] = constant_text
            row["local_feature_energy_0_to_h_simpson16"] = simpson_feature_energy(
                poly, ell, h, max_orbit
            )
            row["local_energy_is_rigorous"] = False
            rows.append(row)
            if time.monotonic() - started > max_seconds:
                raise TimeoutError("time guard exceeded during scaled-h grid")

        center = center_diagnostics(poly, ell, n, parity, max_orbit)
        # The identity budget is cancellation-aware: at small smoke-test N the
        # largest c/N sample probes much farther into negative h, where the
        # explicit finite orbit cutoff, rather than interpolation conditioning,
        # is the limiting error.  Production N>=8 reaches the 80-digit cap.
        correctness_digits = min(80, max(30, int(retained_digits / 3)))
        correctness_threshold = mp.mpf(10) ** (-correctness_digits)
        for row in rows:
            if row["paired_identity_relative_residual"] > correctness_threshold:
                raise ArithmeticError("direct and paired ell evaluations disagree")
            if row["feature_parity_relative_residual"] > correctness_threshold:
                raise ArithmeticError("fixed-interpolant feature parity check failed")
        if parity == "odd":
            if center["odd_observed_over_bound"] > 1 + correctness_threshold:
                raise ArithmeticError("odd-center analytic tail bound was violated")
        elif center["even_lhopital_relative_residual"] > correctness_threshold:
            raise ArithmeticError("even-center l'Hopital identity check failed")
        root_max = max(abs(row["value"]) for row in solved["root_rows"])
        root_relative = max(row["relative"] for row in solved["root_rows"])
        coefficient_text = [mp.nstr(value, n=max(30, dps - 12)) for value in solved["coefficients"]]
        coefficient_hash = hashlib.sha256(
            json.dumps(coefficient_text, separators=(",", ":")).encode("ascii")
        ).hexdigest()
        output_digits = min(80, max(30, dps - 20))

        def encode(value: object) -> object:
            if isinstance(value, mp.mpf):
                return mp_text(value, output_digits)
            if isinstance(value, dict):
                return {str(key): encode(item) for key, item in value.items()}
            if isinstance(value, (list, tuple)):
                return [encode(item) for item in value]
            return value

        return {
            "schema_version": SCHEMA_VERSION,
            "status": STATUS,
            "experiment": "fixed-center-signed-modular-h-pair",
            "parameters": {
                "n": n,
                "parity": parity,
                "dps": dps,
                "anchor_h": "0",
                "scale_grid": SCALE_GRID_NAME if scaled_h == SCALE_GRID else "custom",
                "max_orbit": max_orbit,
            },
            "center_interpolant": {
                "coefficient_sha256": coefficient_hash,
                "ell_A": encode(ell),
                "scaled_interpolation_condition_inf": encode(solved["condition"]),
                "estimated_decimal_digits_lost": encode(digits_lost),
                "nominal_digits_after_condition_loss": encode(retained_digits),
                "correctness_gate_decimal_digits": correctness_digits,
                "max_root_residual_absolute": encode(root_max),
                "max_root_residual_relative_to_cancellation_scale": encode(root_relative),
            },
            "center_diagnostics": encode(center),
            "scaled_h_diagnostics": encode(rows),
            "quadrature": {
                "orbit_cutoff": max_orbit,
                "orbit_tail_bounds_rigorous": False,
                "local_energy_rule": "composite Simpson, 16 panels",
                "local_energy_rigorous": False,
            },
            "egf_manifest": {
                "path": str(egf_manifest),
                "sha256": manifest_hash,
                "status": manifest["status"],
            },
            "provenance": {
                "source_sha256": hashlib.sha256(SOURCE_PATH.read_bytes()).hexdigest(),
                "shared_residue_source_sha256": hashlib.sha256(RESIDUE_PATH.read_bytes()).hexdigest(),
                "python": sys.version,
                "python_executable": sys.executable,
                "mpmath": mp.__version__,
                "platform": platform.platform(),
                "pid": os.getpid(),
            },
            "timing_seconds": time.monotonic() - started,
            "scope": (
                "Fixed-center signed h/-h scaling and falsification diagnostic only. "
                "Orbit cutoffs and Simpson energies are non-rigorous; finite scaling "
                "patterns cannot prove the reflected contraction or RH."
            ),
        }


def atomic_write_json(path: Path, payload: dict[str, object], max_output_bytes: int) -> None:
    encoded = (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")
    if len(encoded) > max_output_bytes:
        raise ValueError(f"output size {len(encoded)} exceeds guard {max_output_bytes}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + f".tmp.{os.getpid()}")
    try:
        with temporary.open("wb") as handle:
            handle.write(encoded)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--n", type=int, required=True)
    parser.add_argument("--parity", choices=("even", "odd"), required=True)
    parser.add_argument("--anchor-h", default="0", choices=("0",))
    parser.add_argument("--dps", type=int, required=True)
    parser.add_argument("--scaled-h", action="append", required=True)
    parser.add_argument("--egf-manifest", type=Path, required=True)
    parser.add_argument("--max-orbit", type=int, default=96)
    parser.add_argument("--max-seconds", type=float, default=600.0)
    parser.add_argument("--max-output-bytes", type=int, default=8 * 1024 * 1024)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--progress", action="store_true")
    args = parser.parse_args()
    grid = finite_grid(args.scaled_h)
    payload = run_experiment(
        n=args.n,
        parity=args.parity,
        dps=args.dps,
        scaled_h=grid,
        egf_manifest=args.egf_manifest,
        max_orbit=args.max_orbit,
        max_seconds=args.max_seconds,
        progress_enabled=args.progress,
    )
    atomic_write_json(args.output, payload, args.max_output_bytes)
    print(json.dumps({"status": payload["status"], "output": str(args.output), "parameters": payload["parameters"]}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
