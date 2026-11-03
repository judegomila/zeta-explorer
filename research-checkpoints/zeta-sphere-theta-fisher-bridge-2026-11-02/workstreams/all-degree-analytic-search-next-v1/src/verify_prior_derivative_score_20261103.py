#!/usr/bin/env python3
"""Certify a recurrence-aware score repair on the available theta ladder.

For the monic residual q_(epsilon,N), replace the failed fixed third feature
t^2 q_N' by the prior same-parity derivative q_(N-1)'.  The dictionary is

    V_prior(N) = span{q_N', t q_N, q_(N-1)'}.

It uses only the old signed moments that already determine q_N and q_(N-1),
and complete positive W^2 moments.  This verifier certifies the projected
auxiliary positive on every rung covered by the frozen M_0,...,M_14 receipt:
even kappa 4,...,14 and odd kappa 3,...,15.  In particular it repairs the
actual odd kappa=15 failure of span{q',tq,t^2q'}.

This is a finite source-specific route-selection certificate, not an
all-degree theorem, a signed-pivot certificate, or an RH result.
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


DEFAULT_PRECISION_BITS = 800
ctx.prec = DEFAULT_PRECISION_BITS

SIGNED_SOURCE_REL = (
    "workstreams/all-degree-analytic-search-next-v1/src/"
    "certify_u3_kappa15_signed_moments_20261103.py"
)
SIGNED_RECEIPT_REL = (
    "workstreams/all-degree-analytic-search-next-v1/results/"
    "u3_kappa15_signed_moments_20261103.json"
)
POSITIVE_ENGINE_REL = (
    "workstreams/all-degree-analytic-search-next-v1/src/"
    "audit_reverse_schur_actual_failure.py"
)
EXPECTED_SIGNED_SOURCE_SHA256 = (
    "dc5828f6ce61a461d5a881c08d0e4034dab473f85dabd20be488dd4b5f6ff178"
)
EXPECTED_SIGNED_RECEIPT_SHA256 = (
    "94d3741b7eabecf2f0f0ccc33a2786f8a4eaae752a98e1076fe08389828b1eff"
)
EXPECTED_SIGNED_PAYLOAD_SHA256 = (
    "924c7d10d504af4e09e1754b757bf187499d09dd1b53e743865b552e87686f25"
)
EXPECTED_POSITIVE_ENGINE_SHA256 = (
    "5d86938507fe5bc78994cfd5658a0de745835f614534f98161083c2651a62536"
)
MAX_POSITIVE_MOMENT_INDEX = 16
MAX_ORDER_N = 7


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_module(path: Path):
    spec = importlib.util.spec_from_file_location("prior_score_moment_engine", path)
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


def times_t(polynomial: dict[int, arb]) -> dict[int, arb]:
    return {degree + 1: coefficient for degree, coefficient in polynomial.items()}


def inner(
    left: dict[int, arb], right: dict[int, arb], moments: list[arb]
) -> arb:
    total = arb(0)
    for left_degree, left_coefficient in left.items():
        for right_degree, right_coefficient in right.items():
            assert (left_degree + right_degree) % 2 == 0
            index = (left_degree + right_degree) // 2
            assert 0 <= index < len(moments)
            total += left_coefficient * right_coefficient * moments[index]
    return total


def residual(
    target_moments: list[arb], order_n: int, parity_epsilon: int
) -> dict[int, arb]:
    if order_n == 0:
        return {parity_epsilon: arb(1)}
    old_hankel = arb_mat([
        [
            target_moments[row + column + parity_epsilon]
            for column in range(order_n)
        ]
        for row in range(order_n)
    ])
    target_column = arb_mat([
        [target_moments[row + order_n + parity_epsilon]]
        for row in range(order_n)
    ])
    assert old_hankel.det() > 0
    coefficients = old_hankel.solve(-target_column)
    polynomial = {
        2 * row + parity_epsilon: coefficients[row, 0]
        for row in range(order_n)
    }
    polynomial[2 * order_n + parity_epsilon] = arb(1)
    return polynomial


def matrix_record(engine, matrix: arb_mat):
    return [
        [engine.endpoints(matrix[row, column]) for column in range(matrix.ncols())]
        for row in range(matrix.nrows())
    ]


def polynomial_record(engine, polynomial: dict[int, arb]):
    return {
        str(degree): engine.endpoints(polynomial[degree])
        for degree in sorted(polynomial)
    }


def certify_rung(
    engine,
    target_moments: list[arb],
    positive_moments: list[arb],
    parity_epsilon: int,
    order_n: int,
) -> dict[str, object]:
    q = residual(target_moments, order_n, parity_epsilon)
    q_prior = residual(target_moments, order_n - 1, parity_epsilon)
    q_prime = derivative(q)
    t_q = times_t(q)
    prior_prime = derivative(q_prior)
    q_second = derivative(q_prime)
    prior_second = derivative(prior_prime)

    kappa = 2 * order_n + parity_epsilon
    assert kappa >= 3
    # Distinct leading degrees prove exact rank before interval arithmetic:
    # tq has degree kappa+1, q' degree kappa-1, and q_prior' degree kappa-3.
    assert max(t_q) == kappa + 1
    assert max(q_prime) == kappa - 1
    assert max(prior_prime) == kappa - 3
    assert t_q[kappa + 1] == 1
    assert q_prime[kappa - 1] == kappa
    assert prior_prime[kappa - 3] == kappa - 2

    A = inner(q_prime, q_prime, positive_moments)
    B = inner(q, q_second, positive_moments)
    C = inner(q, q, positive_moments)
    D = inner(t_q, t_q, positive_moments)
    E = inner(q_prime, t_q, positive_moments)
    F = inner(q_prime, prior_prime, positive_moments)
    G = inner(t_q, prior_prime, positive_moments)
    T = inner(prior_prime, prior_prime, positive_moments)
    R = inner(q, prior_second, positive_moments)
    Y = C + E

    K2 = arb_mat([[A, E], [E, D]])
    y2 = arb_mat([[B], [Y]])
    K3 = arb_mat([[A, E, F], [E, D, G], [F, G, T]])
    y3 = arb_mat([[B], [Y], [R]])
    delta2 = A * D - E * E
    assert delta2 > 0
    assert K3.det() > 0

    projected2 = (y2.transpose() * K2.solve(y2))[0, 0]
    projected3 = (y3.transpose() * K3.solve(y3))[0, 0]
    H2 = (projected2 - A) / 4
    H3 = (projected3 - A) / 4

    Hnum = D * B * B - 2 * E * B * Y + A * Y * Y - A * delta2
    Snum = T * delta2 - (D * F * F - 2 * E * F * G + A * G * G)
    Dnum = R * delta2 - (D * F - E * G) * B - (A * G - E * F) * Y
    assert Snum > 0
    sigma = Snum / delta2
    innovation = Dnum / delta2
    gain = innovation * innovation / (4 * sigma)
    N3 = Dnum * Dnum + Hnum * Snum
    H3_cleared = N3 / (4 * delta2 * Snum)

    assert (Hnum / (4 * delta2)).overlaps(H2)
    assert K3.det().overlaps(Snum)
    assert (H2 + gain).overlaps(H3)
    assert H3_cleared.overlaps(H3)
    assert N3 > 0
    assert H3 > 0

    bordered = arb_mat([
        [A, E, F, B],
        [E, D, G, Y],
        [F, G, T, R],
        [B, Y, R, A],
    ])
    bordered_determinant = bordered.det()
    assert bordered_determinant.overlaps(-N3 / delta2)
    assert bordered_determinant < 0

    scalars = {
        "A": A,
        "Delta2=det(K2)": delta2,
        "Snum=det(K3)": Snum,
        "Hnum": Hnum,
        "Dnum": Dnum,
        "N3=Dnum^2+Hnum*Snum": N3,
        "H2": H2,
        "sigma=Snum/Delta2": sigma,
        "innovation=Dnum/Delta2": innovation,
        "gain=innovation^2/(4*sigma)": gain,
        "H3": H3,
        "bordered_determinant": bordered_determinant,
    }
    return {
        "parity_epsilon": parity_epsilon,
        "order_N": order_n,
        "degree_kappa": kappa,
        "old_signed_moments_needed_through": 2 * order_n + parity_epsilon - 1,
        "new_signed_target_absent": 2 * order_n + parity_epsilon,
        "q": polynomial_record(engine, q),
        "q_prior": polynomial_record(engine, q_prior),
        "basis": ["q_prime", "t_q", "q_prior_prime"],
        "rank_proof": {
            "leading_degrees": [kappa - 1, kappa + 1, kappa - 3],
            "leading_coefficients": [str(kappa), "1", str(kappa - 2)],
            "rank_three": True,
        },
        "K2": matrix_record(engine, K2),
        "y2": matrix_record(engine, y2),
        "K3": matrix_record(engine, K3),
        "y3": matrix_record(engine, y3),
        "scalars": {name: engine.endpoints(value) for name, value in scalars.items()},
        "strict_signs": {
            "K2_positive_definite": True,
            "K3_positive_definite": True,
            "cleared_N3_positive": True,
            "prior_derivative_auxiliary_positive": True,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--precision-bits", type=int, default=DEFAULT_PRECISION_BITS)
    args = parser.parse_args()
    assert 640 <= args.precision_bits <= 1024
    ctx.prec = args.precision_bits

    root = args.root.resolve()
    signed_source_path = root / SIGNED_SOURCE_REL
    signed_receipt_path = root / SIGNED_RECEIPT_REL
    positive_engine_path = root / POSITIVE_ENGINE_REL
    assert digest(signed_source_path) == EXPECTED_SIGNED_SOURCE_SHA256
    assert digest(signed_receipt_path) == EXPECTED_SIGNED_RECEIPT_SHA256
    assert digest(positive_engine_path) == EXPECTED_POSITIVE_ENGINE_SHA256

    signed_payload = json.loads(signed_receipt_path.read_text(encoding="utf-8"))
    assert signed_payload["status"] == "PASS"
    assert signed_payload["provenance"]["script_sha256"] == EXPECTED_SIGNED_SOURCE_SHA256
    assert signed_payload["receipt_integrity"]["payload_sha256"] == EXPECTED_SIGNED_PAYLOAD_SHA256
    assert len(signed_payload["moments"]) == 15

    engine = load_module(positive_engine_path)
    ctx.prec = args.precision_bits
    engine.MAX_DERIVATIVE_ORDER = MAX_POSITIVE_MOMENT_INDEX
    positive_moments, positive_rows, envelope_rows, _ = engine.complete_positive_moments()
    assert len(positive_moments) == MAX_POSITIVE_MOMENT_INDEX + 1
    generalized_tail_ratio = (
        (arb(10) / 9) ** (2 * MAX_POSITIVE_MOMENT_INDEX + 3)
        * (-19 * arb.pi()).exp()
    )
    assert generalized_tail_ratio < arb(1) / 2

    target_moments: list[arb] = []
    target_rows = []
    for index, (lower, upper) in enumerate(signed_payload["moments"]):
        stored, padding = engine.padded_decimal_interval(lower, upper)
        corrected = stored / (4**index)
        target_moments.append(corrected)
        target_rows.append({
            "index": index,
            "stored_mu_interval": [lower, upper],
            "serialization_padding": engine.fraction_text(padding),
            "relation": f"mu_{index}=4^{index}*M_{index}",
            "corrected_M_interval": engine.endpoints(corrected),
        })

    rungs = []
    for parity_epsilon, first_order in ((0, 2), (1, 1)):
        for order_n in range(first_order, MAX_ORDER_N + 1):
            rungs.append(certify_rung(
                engine,
                target_moments,
                positive_moments,
                parity_epsilon,
                order_n,
            ))
    assert len(rungs) == 13
    critical = next(row for row in rungs if row["degree_kappa"] == 15)

    script_path = Path(__file__).resolve()
    receipt = {
        "schema_version": "zsv.prior_derivative_score.20261103.v1",
        "status": "PASS",
        "scope": (
            "Finite complete-theta certificate for V_prior(N)="
            "span{q_N',t*q_N,q_(N-1)'} on the available even kappa 4..14 "
            "and odd kappa 3..15 ladders"
        ),
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "python_flint": flint.__version__,
            "arb_precision_bits": args.precision_bits,
            "network_used": False,
            "quadrature_in_this_verifier": False,
            "exact_theta_orbit_block": list(engine.EXACT_ORBITS),
            "analytic_theta_orbit_tail": f"every orbit n>={engine.TAIL_START}",
        },
        "provenance": {
            "verifier": str(script_path.relative_to(root)),
            "verifier_sha256": digest(script_path),
            "signed_moment_source": SIGNED_SOURCE_REL,
            "signed_moment_source_sha256": digest(signed_source_path),
            "signed_moment_receipt": SIGNED_RECEIPT_REL,
            "signed_moment_receipt_sha256": digest(signed_receipt_path),
            "signed_moment_payload_sha256": EXPECTED_SIGNED_PAYLOAD_SHA256,
            "positive_moment_engine": POSITIVE_ENGINE_REL,
            "positive_moment_engine_sha256": digest(positive_engine_path),
        },
        "normalization": {
            "signed_archive": "mu_j=4^j*M_j with outward padding before division",
            "signed_old_data": "M_0,...,M_14 only",
            "positive_moments": "n_j=||psi^(j)||^2 on h>=0, j=0,...,16",
            "spectral_scaling": "the omitted common m_j=4*pi*n_j factor is positive",
        },
        "positive_tail_ratio": {
            "formula": "(10/9)^35*exp(-19*pi)",
            "bound": engine.endpoints(generalized_tail_ratio),
            "strictly_below_one_half": True,
        },
        "target_moments": target_rows,
        "complete_positive_moments": positive_rows,
        "derivative_tail_envelopes": envelope_rows,
        "dictionary": {
            "formula": "V_prior(N)=span{q_N',t*q_N,q_(N-1)'}",
            "old_data_only": True,
            "rank_for_kappa_at_least_3": (
                "leading degrees kappa-1,kappa+1,kappa-3 are distinct"
            ),
            "cleared_condition": "N3=Dnum^2+Hnum*Snum>0",
            "projected_auxiliary": "H_prior=N3/(4*Delta2*Snum)>0",
        },
        "rungs": rungs,
        "critical_kappa15": {
            "H2": critical["scalars"]["H2"],
            "H_prior": critical["scalars"]["H3"],
            "gain": critical["scalars"]["gain=innovation^2/(4*sigma)"],
            "N3": critical["scalars"]["N3=Dnum^2+Hnum*Snum"],
            "new_signed_M15_absent": True,
        },
        "strict_conclusion": {
            "available_even_rungs_positive": [4, 6, 8, 10, 12, 14],
            "available_odd_rungs_positive": [3, 5, 7, 9, 11, 13, 15],
            "actual_kappa15_fixed_U3_failure_repaired": True,
            "all_degree_claim": False,
        },
        "nonclaims": [
            "Thirteen certified rungs do not prove an all-degree theorem.",
            "The new signed target at each rung is absent from its auxiliary.",
            "A positive projected auxiliary is only a sufficient finite-rung certificate.",
            "No first Xi--Laguerre theorem or RH result is claimed.",
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
    temporary = args.output.with_suffix(args.output.suffix + ".tmp")
    temporary.write_text(
        json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    temporary.replace(args.output)
    print(json.dumps({
        "status": "PASS",
        "rungs": len(rungs),
        "output": str(args.output),
        "kappa15_H_prior": critical["scalars"]["H3"],
        "verifier_sha256": digest(script_path),
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
