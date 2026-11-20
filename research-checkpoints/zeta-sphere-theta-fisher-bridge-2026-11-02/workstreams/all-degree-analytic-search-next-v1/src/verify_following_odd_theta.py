#!/usr/bin/env python3
"""Bounded replay of the actual complete-theta (N,epsilon)=(2,1) auxiliary.

The replay uses the frozen target-moment intervals after undoing their
documented geometric normalization, exact first-three-orbit incomplete-gamma
correlations, and one analytic norm tail containing every orbit n>=4.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

import flint
from flint import arb, ctx

DEFAULT_PRECISION_BITS = 300
ctx.prec = DEFAULT_PRECISION_BITS

EXPECTED_TARGET_SHA256 = "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536"
EXPECTED_TARGET_SCOPE = "Full theta normalized a=0 full moments via reflected identity"
EXPECTED_HELPER_SHA256 = "b71b09559a5ee4b1f79c0946888acf8f854f1152f482b9131500a0903558c96b"
EXPECTED_ACTUAL_REPAIR_PROOF_SHA256 = "f6b3d0d7b4322104bd68a2ad01a85039eeab40c1939c9dd9d2672a1bac9f7a06"
EXPECTED_ACTUAL_REPAIR_MANIFEST_SHA256 = "373fe7b29163a876dfe25eb1493d30747f094524798d1e20f4998f948b3446ba"
EXPECTED_FULL_SPLIT_AUDIT_SHA256 = "c0df6973d7186b53b30e0c47647fc71a3f90ce046cac1fa8c07697906a7d40a5"
DECIMAL_PADDING_SCALE = Fraction(1, 10**90)


def sha256_path(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def padded_interval_from_decimal_endpoints(helper, lower: str, upper: str) -> tuple[arb, Fraction]:
    lower_exact = Fraction(lower)
    upper_exact = Fraction(upper)
    assert lower_exact <= upper_exact
    padding = DECIMAL_PADDING_SCALE * (1 + abs(lower_exact) + abs(upper_exact))
    return helper.interval_from_endpoints(lower_exact - padding, upper_exact + padding), padding


def load_helper(path: Path):
    spec = importlib.util.spec_from_file_location("next_odd_helper", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load helper: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def scalar_payload(value: arb) -> str:
    return value.str()


def margin(moment: list[arb], a: arb, b: arb) -> dict[str, arb]:
    m0, m1, m2, m3, m4, m5, m6 = moment
    A = (
        9 * a * a * m2 + 6 * a * b * m1 + 30 * a * m3
        + b * b * m0 + 10 * b * m2 + 25 * m4
    )
    B = 6 * a * a * m2 + 6 * a * b * m1 + 26 * a * m3 + 20 * b * m2 + 20 * m4
    C = a * a * m3 + 2 * a * b * m2 + 2 * a * m4 + b * b * m1 + 2 * b * m3 + m5
    D = a * a * m4 + 2 * a * b * m3 + 2 * a * m5 + b * b * m2 + 2 * b * m4 + m6
    E = 3 * a * a * m3 + 4 * a * b * m2 + 8 * a * m4 + b * b * m1 + 6 * b * m3 + 5 * m5
    Delta = A * D - E * E
    F = (A * C + E * (A - B)) ** 2 - Delta * (A * A - B * B)
    H = F / (4 * A * Delta)
    return {"A": A, "B": B, "C": C, "D": D, "E": E, "Delta": Delta, "F": F, "H_halfline": H}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--precision-bits", type=int, default=DEFAULT_PRECISION_BITS)
    args = parser.parse_args()
    assert 256 <= args.precision_bits <= 1024
    ctx.prec = args.precision_bits
    root = args.root.resolve()
    script_path = Path(__file__).resolve()
    helper_path = root / "workstreams/all-degree-analytic-search-next-v1/src/verify_next_odd_theta.py"
    target_path = root / "evidence/v18-curated/full_split_audit/actual_total_certificate.json"
    normalization_proof_path = root / "evidence/v18-curated/core_inertia_v2/ACTUAL_REPAIR_PROOF.md"
    normalization_manifest_path = root / "evidence/v18-curated/core_inertia_v2/ACTUAL_REPAIR_FROZEN_SHA256.txt"
    full_split_audit_path = root / "evidence/v18-curated/full_split_audit/AUDIT.md"
    assert sha256_path(helper_path) == EXPECTED_HELPER_SHA256
    assert sha256_path(normalization_proof_path) == EXPECTED_ACTUAL_REPAIR_PROOF_SHA256
    assert sha256_path(normalization_manifest_path) == EXPECTED_ACTUAL_REPAIR_MANIFEST_SHA256
    assert sha256_path(full_split_audit_path) == EXPECTED_FULL_SPLIT_AUDIT_SHA256
    helper = load_helper(helper_path)

    assert sha256_path(target_path) == EXPECTED_TARGET_SHA256
    target = json.loads(target_path.read_text(encoding="utf-8"))
    assert target["scope"] == EXPECTED_TARGET_SCOPE

    polynomials = [[Fraction(0), Fraction(-3), Fraction(2)]]
    for _ in range(6):
        polynomials.append(helper.next_derivative_polynomial(polynomials[-1]))
    monomial_certificates = helper.derivative_monomial_certificates(polynomials)

    ratio_bound = (arb(5) / 4) ** 15 * (-9 * arb.pi()).exp()
    assert ratio_bound < arb(1) / 2
    moment_boxes: list[arb] = []
    orbit_rows: list[dict[str, object]] = []
    for order, polynomial in enumerate(polynomials):
        pairings: dict[str, str] = {}
        assembled = arb(0)
        for left in range(1, 4):
            for right in range(1, 4):
                entry = helper.orbit_gram(polynomial, left, right)
                pairings[f"{left},{right}"] = scalar_payload(entry)
                assembled += entry
        assert assembled > 0
        tail_norm = 2 * helper.remaining_orbit_bound(order, 4)
        radius = 2 * tail_norm * assembled.sqrt() + tail_norm * tail_norm
        complete = assembled + arb(0, radius.upper())
        assert complete > 0
        moment_boxes.append(complete)
        orbit_rows.append({
            "order": order,
            "first_three_pairings_arb": pairings,
            "assembled_first_three_norm_square_arb": scalar_payload(assembled),
            "tail_norm_n_ge_4_upper_arb": scalar_payload(tail_norm),
            "complete_halfline_norm_square_arb": scalar_payload(complete),
        })

    # The archived intervals are mu_j = 4^j M_j.  First apply the documented
    # outward serialization pad, then undo the factor exactly.
    target_moments: list[arb] = []
    target_rows: list[dict[str, object]] = []
    for index, (lower, upper) in enumerate(target["moments"][:7]):
        padded_stored, padding = padded_interval_from_decimal_endpoints(helper, lower, upper)
        corrected = padded_stored / (4 ** index)
        target_moments.append(corrected)
        target_rows.append({
            "index": index,
            "stored_mu_interval": [lower, upper],
            "serialization_padding_exact": helper.fraction_text(padding),
            "padded_stored_mu_arb": scalar_payload(padded_stored),
            "relation": f"mu_{index}=4^{index}*M_{index}",
            "corrected_M_arb": scalar_payload(corrected),
        })

    M0, M1, M2, M3, M4, M5, M6 = target_moments
    old_det = M1 * M3 - M2 * M2
    a = (M2 * M3 - M1 * M4) / old_det
    b = (M2 * M4 - M3 * M3) / old_det
    discriminant = a * a - 4 * b
    assert M1 > arb("0.36")
    assert old_det > 106
    assert a < -115 and a > -116
    assert b > 2007 and b < 2008
    assert discriminant > 5226

    actual = margin(moment_boxes, a, b)
    assert actual["A"] > 3_000_000
    assert actual["Delta"] > arb("1e15")
    assert actual["F"] > arb("9e26")
    assert actual["H_halfline"] > 68_000

    # Coefficient-free positivity already fails for a real-rooted polynomial.
    # q=t(t^2-68)(t^2-13)=t^5-81t^3+884t.
    counter = margin(moment_boxes, arb(-81), arb(884))
    assert counter["A"] > 0
    assert counter["Delta"] > 0
    assert counter["F"] < arb("-9e25")
    assert counter["H_halfline"] < -9_000

    receipt = {
        "status": "PASS",
        "scope": (
            "Actual complete-theta (N,epsilon)=(2,1) two-generator "
            "sufficient condition; no higher-rung or RH claim"
        ),
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "python_flint": flint.__version__,
            "arb_precision_bits": args.precision_bits,
            "network_used": False,
            "fixed_derivative_orders": list(range(7)),
            "exact_orbit_block": [1, 2, 3],
            "analytic_tail": "all n>=4",
        },
        "normalization": {
            "target_archive": "mu_j=4^j*M_j; residual uses corrected M_j",
            "serialized_endpoint_padding": "10^-90*(1+abs(lower)+abs(upper)), applied before division by 4^j",
            "computed_positive_moments": "n_j=||psi^(j)||^2 on h>=0",
            "spectral_positive_moments": "m_j=4*pi*n_j",
            "margin_scaling": "F[m]=(4*pi)^4 F[n], H[m]=4*pi*H[n]",
        },
        "replay": {
            "working_directory": "checkpoint root",
            "command": (
                "/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python "
                "workstreams/all-degree-analytic-search-next-v1/src/verify_following_odd_theta.py "
                f"--root . --precision-bits {args.precision_bits} --output "
                "workstreams/all-degree-analytic-search-next-v1/results/following_odd_theta_verification.json"
            ),
        },
        "derivative_polynomials_ascending": [
            [helper.fraction_text(value) for value in polynomial]
            for polynomial in polynomials
        ],
        "derivative_monomial_bounds": monomial_certificates,
        "tail_ratio_bound_arb": scalar_payload(ratio_bound),
        "tail_ratio_claim": "(5/4)^15*exp(-9*pi)<1/2",
        "complete_positive_moments": orbit_rows,
        "target_moments": target_rows,
        "actual_residual": {
            "old_block_first_diagonal_M1_arb": scalar_payload(M1),
            "old_block_det_arb": scalar_payload(old_det),
            "a_arb": scalar_payload(a),
            "b_arb": scalar_payload(b),
            "a_squared_minus_4b_arb": scalar_payload(discriminant),
            "margin": {key: scalar_payload(value) for key, value in actual.items()},
            "strict_conclusion": "H[m]=4*pi*H[n]>0, hence the exact auxiliary identity gives S_(2,1)>0",
        },
        "coefficient_free_counterexample": {
            "q": "t*(t^2-68)*(t^2-13)=t^5-81*t^3+884*t",
            "roots_are_real": True,
            "margin": {key: scalar_payload(value) for key, value in counter.items()},
            "scope": "refutes all-real-root coefficient positivity of the auxiliary, not the actual theta residual or pivot",
        },
        "hashes": {
            "source_sha256": sha256_path(script_path),
            "helper_sha256": sha256_path(helper_path),
            "target_moment_certificate_sha256": sha256_path(target_path),
            "normalization_proof_sha256": sha256_path(normalization_proof_path),
            "normalization_manifest_sha256": sha256_path(normalization_manifest_path),
            "full_split_audit_sha256": sha256_path(full_split_audit_path),
        },
    }
    canonical_payload = json.dumps(
        receipt, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode("utf-8")
    receipt["receipt_integrity"] = {
        "definition": "sha256 of canonical sorted compact JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical_payload).hexdigest(),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": "PASS",
        "output": str(args.output),
        "source_sha256": receipt["hashes"]["source_sha256"],
        "helper_sha256": receipt["hashes"]["helper_sha256"],
        "target_sha256": receipt["hashes"]["target_moment_certificate_sha256"],
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
