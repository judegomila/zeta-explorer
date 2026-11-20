#!/usr/bin/env python3
"""Bounded Arb check of enlarged score projections on actual theta rungs.

This verifier is deliberately diagnostic.  It reuses the independently audited
complete-theta positive-moment engine, reconstructs every residual from the
outward-padded signed archive, and evaluates only finite-dimensional projection
identities.  A positive finite-rung value is not an all-degree theorem.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

import flint
from flint import arb, arb_mat, ctx


DEFAULT_PRECISION_BITS = 720
ctx.prec = DEFAULT_PRECISION_BITS

AUDIT_SOURCE_REL = (
    "workstreams/all-degree-analytic-search-next-v1/src/"
    "audit_reverse_schur_actual_failure.py"
)
TARGET_REL = "evidence/v18-curated/full_split_audit/actual_total_certificate.json"
EXPECTED_AUDIT_SOURCE_SHA256 = (
    "5d86938507fe5bc78994cfd5658a0de745835f614534f98161083c2651a62536"
)
EXPECTED_TARGET_SHA256 = (
    "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536"
)
EXPECTED_TARGET_SCOPE = "Full theta normalized a=0 full moments via reflected identity"
MAX_RUNG = 5
MAX_ODD_RUNG = 4


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_audit_module(path: Path):
    spec = importlib.util.spec_from_file_location("bounded_positive_moment_engine", path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def derivative(polynomial: dict[int, arb]) -> dict[int, arb]:
    return {
        degree - 1: degree * coefficient
        for degree, coefficient in polynomial.items()
        if degree
    }


def times_t_power(polynomial: dict[int, arb], power: int) -> dict[int, arb]:
    return {degree + power: coefficient for degree, coefficient in polynomial.items()}


def inner(
    left: dict[int, arb], right: dict[int, arb], moments: list[arb]
) -> arb:
    total = arb(0)
    for left_degree, left_coefficient in left.items():
        for right_degree, right_coefficient in right.items():
            assert (left_degree + right_degree) % 2 == 0
            index = (left_degree + right_degree) // 2
            assert index < len(moments)
            total += left_coefficient * right_coefficient * moments[index]
    return total


def residual(
    order: int, parity: int, target_moments: list[arb]
) -> dict[int, arb]:
    assert parity in (0, 1)
    if order == 0:
        return {parity: arb(1)}
    hankel = arb_mat([
        [target_moments[row + column + parity] for column in range(order)]
        for row in range(order)
    ])
    column = arb_mat([
        [target_moments[row + order + parity]] for row in range(order)
    ])
    coefficients = hankel.solve(-column)
    result = {
        2 * row + parity: coefficients[row, 0]
        for row in range(order)
    }
    result[2 * order + parity] = arb(1)
    return result


def target_pivot(
    order: int,
    parity: int,
    polynomial: dict[int, arb],
    target_moments: list[arb],
) -> arb:
    # Orthogonality leaves <q_N,q_N>=<q_N,t^(2N+parity)>.
    return sum(
        (
            coefficient
            * target_moments[(degree + 2 * order + parity) // 2]
            for degree, coefficient in polynomial.items()
        ),
        arb(0),
    )


def projection(
    q: dict[int, arb], basis: list[dict[int, arb]], moments: list[arb]
) -> dict[str, object]:
    q_prime = derivative(q)
    gram = arb_mat([
        [inner(left, right, moments) for right in basis]
        for left in basis
    ])
    y = arb_mat([[inner(q, derivative(item), moments)] for item in basis])
    coefficients = gram.solve(y)
    projected_norm = sum(
        (y[index, 0] * coefficients[index, 0] for index in range(len(basis))),
        arb(0),
    )
    A = inner(q_prime, q_prime, moments)
    auxiliary = (projected_norm - A) / 4
    return {
        "gram": gram,
        "y": y,
        "projection_coefficients": coefficients,
        "projected_norm": projected_norm,
        "A": A,
        "H": auxiliary,
    }


def single_feature_gain(
    q: dict[int, arb],
    baseline: list[dict[int, arb]],
    feature: dict[int, arb],
    moments: list[arb],
) -> tuple[arb, arb, arb]:
    base_gram = arb_mat([
        [inner(left, right, moments) for right in baseline]
        for left in baseline
    ])
    base_y = arb_mat([[inner(q, derivative(item), moments)] for item in baseline])
    cross = arb_mat([[inner(item, feature, moments)] for item in baseline])
    feature_y = inner(q, derivative(feature), moments)
    gram_coefficients = base_gram.solve(cross)
    score_coefficients = base_gram.solve(base_y)
    schur = inner(feature, feature, moments) - sum(
        (cross[index, 0] * gram_coefficients[index, 0] for index in range(len(baseline))),
        arb(0),
    )
    innovation = feature_y - sum(
        (cross[index, 0] * score_coefficients[index, 0] for index in range(len(baseline))),
        arb(0),
    )
    gain = innovation * innovation / (4 * schur)
    return schur, innovation, gain


def interval_record(module, value: arb) -> dict[str, str]:
    return module.endpoints(value)


def matrix_record(module, matrix: arb_mat) -> list[list[dict[str, str]]]:
    return [
        [interval_record(module, matrix[row, column]) for column in range(matrix.ncols())]
        for row in range(matrix.nrows())
    ]


def polynomial_record(module, polynomial: dict[int, arb]) -> dict[str, object]:
    return {
        "degrees": sorted(polynomial),
        "coefficients": {
            str(degree): interval_record(module, polynomial[degree])
            for degree in sorted(polynomial)
        },
    }


def strict_sign(value: arb) -> str:
    if value > 0:
        return "positive"
    if value < 0:
        return "negative"
    return "unresolved"


def projection_record(module, result: dict[str, object]) -> dict[str, object]:
    return {
        "gram": matrix_record(module, result["gram"]),
        "correlation_y": matrix_record(module, result["y"]),
        "projection_coefficients": matrix_record(
            module, result["projection_coefficients"]
        ),
        "projected_norm": interval_record(module, result["projected_norm"]),
        "A": interval_record(module, result["A"]),
        "H": interval_record(module, result["H"]),
        "strict_sign_H": strict_sign(result["H"]),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--precision-bits", type=int, default=DEFAULT_PRECISION_BITS)
    args = parser.parse_args()
    assert 512 <= args.precision_bits <= 1024
    ctx.prec = args.precision_bits

    root = args.root.resolve()
    audit_path = root / AUDIT_SOURCE_REL
    target_path = root / TARGET_REL
    assert digest(audit_path) == EXPECTED_AUDIT_SOURCE_SHA256
    assert digest(target_path) == EXPECTED_TARGET_SHA256
    audit = load_audit_module(audit_path)
    # The imported module sets the global Arb precision at import time.
    ctx.prec = args.precision_bits

    target_payload = json.loads(target_path.read_text(encoding="utf-8"))
    assert target_payload["scope"] == EXPECTED_TARGET_SCOPE
    target_moments: list[arb] = []
    target_rows: list[dict[str, object]] = []
    for index, (lower, upper) in enumerate(target_payload["moments"][: 2 * MAX_RUNG + 1]):
        stored, padding = audit.padded_decimal_interval(lower, upper)
        corrected = stored / (4**index)
        target_moments.append(corrected)
        target_rows.append({
            "index": index,
            "stored_mu_interval": [lower, upper],
            "serialization_padding": audit.fraction_text(padding),
            "relation": f"mu_{index}=4^{index}*M_{index}",
            "corrected_M_interval": interval_record(audit, corrected),
        })

    positive_moments, positive_rows, envelope_rows, tail_ratio = (
        audit.complete_positive_moments()
    )
    assert len(positive_moments) == 12

    rows: list[dict[str, object]] = []
    ladder_specs = (
        ("even", 0, range(1, MAX_RUNG + 1)),
        ("odd", 1, range(0, MAX_ODD_RUNG + 1)),
    )
    for ladder_name, parity, orders in ladder_specs:
        max_order = max(orders)
        residuals = {
            order: residual(order, parity, target_moments)
            for order in range(max_order + 1)
        }
        for order in orders:
            kappa = 2 * order + parity
            q = residuals[order]
            prior = residuals[order - 1] if order else None
            q_prime = derivative(q)
            tq = times_t_power(q, 1)
            baseline_basis = [q_prime, tq]
            candidates: dict[str, dict[int, arb]] = {
                "t2_q_prime": times_t_power(q_prime, 2),
            }
            if prior is not None:
                candidates.update({
                    "prior_derivative": derivative(prior),
                    "t_prior": times_t_power(prior, 1),
                })
            candidates = {
                name: feature
                for name, feature in candidates.items()
                if feature
            }
            # At kappa=1 and 2 every listed feature is already in the
            # two-dimensional baseline span.
            if kappa <= 2:
                candidates = {}

            baseline = projection(q, baseline_basis, positive_moments)
            candidate_rows: dict[str, object] = {}
            for name, feature in candidates.items():
                enlarged = projection(
                    q, baseline_basis + [feature], positive_moments
                )
                schur, innovation, gain = single_feature_gain(
                    q, baseline_basis, feature, positive_moments
                )
                assert schur > 0
                assert enlarged["H"].overlaps(baseline["H"] + gain)
                candidate_rows[name] = {
                    "feature": polynomial_record(audit, feature),
                    "projection": projection_record(audit, enlarged),
                    "one_feature_schur_identity": {
                        "feature_schur_norm": interval_record(audit, schur),
                        "score_innovation": interval_record(audit, innovation),
                        "gain_over_baseline": interval_record(audit, gain),
                        "identity_check": "H_enlarged overlaps H_baseline+gain",
                        "identity_verified": True,
                    },
                }

            prior_pair = None
            pair_has_room = (
                (parity == 0 and order >= 3)
                or (parity == 1 and order >= 2)
            )
            if pair_has_room and prior is not None and derivative(prior):
                pair_result = projection(
                    q,
                    baseline_basis
                    + [derivative(prior), times_t_power(prior, 1)],
                    positive_moments,
                )
                prior_pair = projection_record(audit, pair_result)

            pivot = target_pivot(order, parity, q, target_moments)
            rows.append({
                "ladder": ladder_name,
                "parity_epsilon": parity,
                "order_N": order,
                "polynomial_degree": kappa,
                "kappa": kappa,
                "q_N": polynomial_record(audit, q),
                "q_N_minus_1": (
                    polynomial_record(audit, prior)
                    if prior is not None else None
                ),
                "signed_target_pivot": interval_record(audit, pivot),
                "signed_target_pivot_sign": strict_sign(pivot),
                "baseline_generators": ["q_N_prime", "t_q_N"],
                "baseline": projection_record(audit, baseline),
                "single_feature_candidates": candidate_rows,
                "prior_pair_projection": prior_pair,
            })

    rung_five = next(
        row for row in rows if row["parity_epsilon"] == 0 and row["kappa"] == 10
    )
    assert rung_five["baseline"]["strict_sign_H"] == "negative"
    assert (
        rung_five["single_feature_candidates"]["t2_q_prime"]["projection"]
        ["strict_sign_H"]
        == "positive"
    )
    assert (
        rung_five["single_feature_candidates"]["prior_derivative"]["projection"]
        ["strict_sign_H"]
        == "positive"
    )
    assert (
        rung_five["single_feature_candidates"]["t_prior"]["projection"]
        ["strict_sign_H"]
        == "positive"
    )

    script_path = Path(__file__).resolve()
    receipt = {
        "schema_version": "zsv.enlarged_score_projection.actual_rungs.v2",
        "status": "PASS",
        "scope": (
            "Bounded complete-theta finite-rung diagnostic for enlarging the "
            "two-generator score projection by one multiplication or prior-residual feature"
        ),
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "python_flint": flint.__version__,
            "arb_precision_bits": args.precision_bits,
            "network_used": False,
            "quadrature_used": False,
            "finite_orbit_substitution_used": False,
            "exact_theta_orbit_block": list(audit.EXACT_ORBITS),
            "analytic_tail": f"all theta orbits n>={audit.TAIL_START}",
            "ladders_tested": {
                "even": [2 * order for order in range(1, MAX_RUNG + 1)],
                "odd": [2 * order + 1 for order in range(MAX_ODD_RUNG + 1)],
            },
        },
        "provenance": {
            "verifier": str(script_path.relative_to(root)),
            "verifier_sha256": digest(script_path),
            "positive_moment_engine": AUDIT_SOURCE_REL,
            "positive_moment_engine_sha256": digest(audit_path),
            "target_archive": TARGET_REL,
            "target_archive_sha256": digest(target_path),
        },
        "replay": {
            "working_directory": "checkpoint root",
            "command": (
                "<arb-python> workstreams/all-degree-analytic-search-next-v1/src/"
                "verify_enlarged_score_projection.py --root . --precision-bits "
                f"{args.precision_bits} --output workstreams/all-degree-analytic-search-next-v1/"
                "results/enlarged_score_projection_actual_rungs.json"
            ),
        },
        "normalization": {
            "target_archive": (
                "mu_j=4^j*M_j; outward serialization padding is applied before division"
            ),
            "positive_moments": "n_j=||psi^(j)||^2 on h>=0",
            "spectral_scaling": (
                "m_j=4*pi*n_j; the common positive scale preserves every reported sign"
            ),
            "projection_identity": (
                "H_V=(y^T*K^(-1)*y-A)/4 with K_ij=<r_i,r_j>_W2, "
                "y_i=<q,r_i'>_W2, A=<q',q'>_W2"
            ),
        },
        "target_moments": target_rows,
        "complete_positive_moments": positive_rows,
        "derivative_tail_envelopes": envelope_rows,
        "tail_ratio_bound": interval_record(audit, tail_ratio),
        "rungs": rows,
        "strict_conclusion": {
            "kappa_10_two_generator_auxiliary_negative": True,
            "kappa_10_plus_t2_q_prime_positive": True,
            "kappa_10_plus_prior_derivative_positive": True,
            "kappa_10_plus_t_prior_positive": True,
            "one_added_generator_suffices_at_kappa_10": True,
            "actual_even_and_odd_low_ladders_checked": True,
            "all_degree_uniformity_established": False,
        },
        "nonclaims": [
            "A strict finite-rung sign does not prove an all-degree inequality or RH.",
            "The checker does not establish that any one-feature choice works uniformly.",
            "The signed target pivots are reported only to compare the finite diagnostics; they are not used in H_V.",
            "The complete-positive-moment engine is hash-bound and reused, so this is a new calculation, not an independent re-audit of that engine.",
        ],
    }
    canonical = json.dumps(
        receipt, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode()
    receipt["receipt_integrity"] = {
        "definition": "sha256 of canonical compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(json.dumps({
        "status": "PASS",
        "output": str(args.output),
        "kappa_10_baseline_H_upper": rung_five["baseline"]["H"]["upper"],
        "kappa_10_t2_q_prime_H_lower": (
            rung_five["single_feature_candidates"]["t2_q_prime"]["projection"]
            ["H"]["lower"]
        ),
        "kappa_10_prior_derivative_H_lower": (
            rung_five["single_feature_candidates"]["prior_derivative"]["projection"]
            ["H"]["lower"]
        ),
        "kappa_10_t_prior_H_lower": (
            rung_five["single_feature_candidates"]["t_prior"]["projection"]
            ["H"]["lower"]
        ),
        "source_sha256": digest(script_path),
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
