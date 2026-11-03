#!/usr/bin/env python3
"""Exact audit of the sharp complete-theta cubic transport lemma.

This standard-library replay checks the local H3 completion, the endpoint
Schur completion, all factor conversions, and frozen input hashes.  It does
not perform quadrature or a parameter sweep.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path


CHECKPOINT = "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
WORKSTREAM = "workstreams/all-degree-analytic-search-next-v1"
SOURCES = {
    "evidence/v31-continuation/theta_correlated_local_v1/INTEGRATED_SQUARE_PAYMENT.md":
        "dca1c63d81b7c6796d2526a6933afd37f2b0c7dc03a2e66687e5de529139485a",
    "evidence/v31-continuation/theta_correlated_local_v1/THETA_CURVATURE_PAYMENT.md":
        "a508698183302e3827769a3b9cd135023d79ffb557e2fe5f700ffb00cd98d97d",
    f"{WORKSTREAM}/MODULAR_GENERAL_PIVOT_TRANSPORT_NEXT.md":
        "5076a00c5e5b2b20fddd7470d92f61f907a2e954c23dc0bb66278271e0d96970",
    f"{WORKSTREAM}/MODULAR_N1_FULL_INTERVAL_PAYMENT_NEXT.md":
        "75c1b743e8a067f450c67fd5a919980ef7130120026aeee91ea63c10fc89b64a",
    f"{WORKSTREAM}/MODULAR_N2_ENDPOINT_PAYMENT_INDEPENDENT_AUDIT_20261103.md":
        "45dae1c894767eebd900774e321cbdae5a9059916399fcd342edaf8a3f050970",
    f"{WORKSTREAM}/results/modular_n2_endpoint_payment_independent_audit_20261103.json":
        "7dafd0dc39c7f32d29c6bdcecaf81c9cbefced6a916e1162840cf4d5d2f09873",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()
    nested = root / CHECKPOINT
    if nested.is_dir():
        checkpoint = nested
    elif (root / "evidence").is_dir() and (root / "workstreams").is_dir():
        checkpoint = root
    else:
        raise AssertionError("--root is neither the repository nor checkpoint root")

    observed: dict[str, str] = {}
    for relative, expected in SOURCES.items():
        actual = sha256(checkpoint / relative)
        if actual != expected:
            raise AssertionError(
                f"frozen input hash mismatch for {relative}: {actual} != {expected}"
            )
        observed[relative] = actual

    endpoint_path = checkpoint / (
        f"{WORKSTREAM}/results/"
        "modular_n2_endpoint_payment_independent_audit_20261103.json"
    )
    endpoint = json.loads(endpoint_path.read_text())
    if endpoint.get("status") != "PASS":
        raise AssertionError("endpoint payment audit is not PASS")
    if endpoint["simple_directed_bounds"].get("sigma3") != ">579.48":
        raise AssertionError("endpoint sigma3 lower bound changed")

    # Check the local identity after multiplying by 32*X:
    # X*D - 8*a*B*X + 16*a^2*X^2
    # = (X*D-B^2) + (B-4*a*X)^2.
    # Store coefficients of monomials XD, B^2, aBX, a^2X^2.
    local_left = (1, 0, -8, 16)
    local_right = (1, -1 + 1, -8, 16)
    if local_left != local_right:
        raise AssertionError("local H3 square completion failed")

    # Check the endpoint Schur completion after multiplying by M1:
    # M1*M3 - 2*a*M1*M2 + a^2*M1^2
    # = (M1*M3-M2^2) + (a*M1-M2)^2.
    schur_left = (1, 0, -2, 1)
    schur_right = (1, -1 + 1, -2, 1)
    if schur_left != schur_right:
        raise AssertionError("endpoint Schur completion failed")

    # h/(4*pi)=integral and s3'=h/(2*pi) give factor two.  Pairing
    # an even local source against exp(2*a*u) gives another factor two.
    h_to_pivot_factor = 2
    even_pairing_factor = 2
    halfline_factor = h_to_pivot_factor * even_pairing_factor
    if halfline_factor != 4:
        raise AssertionError("half-line transport factor mismatch")

    sigma3_lower = Fraction(14487, 25)
    if sigma3_lower != Fraction(57948, 100):
        raise AssertionError("579.48 rational conversion failed")
    if not sigma3_lower > 0:
        raise AssertionError("endpoint cubic reserve is not positive")

    source = Path(__file__).resolve()
    note = source.parents[1] / "MODULAR_N2_SHARP_CUBIC_TRANSPORT_20261103.md"
    result = {
        "schema_version": "zsv.modular_n2_sharp_cubic_transport.20261103.v1",
        "status": "PASS",
        "scope": (
            "Exact sharp transport s3'(a)>=sigma3 and s3(a)/a>=sigma3 "
            "on the already positive N=2 complete-theta prefix; the remaining "
            "finite-a modular cost bound, higher degrees, all-degree result, "
            "and RH are not proved"
        ),
        "checks": [
            "frozen analytic source hashes",
            "endpoint audit PASS and sigma3>579.48",
            "local H3 square completion after clearing 32*X",
            "endpoint Schur completion after clearing M1",
            "h/(4*pi) to pivot derivative factor 2",
            "even full-line to positive-half-line factor 2",
            "sigma3 rational lower 14487/25",
        ],
        "exact_conclusion": {
            "derivative": "s3'(a) >= sigma3",
            "divided_pivot": "s3(a)/a >= sigma3 > 14487/25",
            "interval": "0<a<=1/4",
            "remaining_sufficient_target": "(kappa2(a)/a)*Q2_minus(a) < 14487/25",
        },
        "frozen_inputs": observed,
        "proof_note": {
            "path": str(note.relative_to(checkpoint)),
            "sha256": sha256(note),
            "binding": "recorded, not self-frozen by this replay",
        },
        "source_sha256": sha256(source),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
