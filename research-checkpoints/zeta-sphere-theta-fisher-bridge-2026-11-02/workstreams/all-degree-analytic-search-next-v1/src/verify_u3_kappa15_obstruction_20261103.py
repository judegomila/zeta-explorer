#!/usr/bin/env python3
"""Certified actual-theta obstruction to the fixed U3 score dictionary.

The odd degree-15 residual is reconstructed from the tightly certified old
signed moments mu_0,...,mu_14.  The new signed moment mu_15 is neither loaded
nor used.  Positive W^2 moments through n_16 are obtained from the reviewed
complete-orbit Arb engine, extended with its same analytic n>=9 tail proof.

The script evaluates both the 3-by-3 projection and the exact cleared Schur
condition

    N3 = Dnum^2 + Hnum*Snum >= 0.

For the actual residual N3 is strictly negative, so the fixed dictionary
span{q',tq,t^2q'} is not a uniform all-degree sufficient mechanism.  This is
a finite source-specific obstruction to that auxiliary, not a negative signed
pivot, an RH counterexample, or an RH proof.
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
ORDER_N = 7
PARITY = 1
KAPPA = 15
MAX_POSITIVE_MOMENT_INDEX = KAPPA + 1


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_module(path: Path):
    spec = importlib.util.spec_from_file_location("u3_positive_moment_engine", path)
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
            assert 0 <= index < len(moments)
            total += left_coefficient * right_coefficient * moments[index]
    return total


def residual(target_moments: list[arb]) -> dict[int, arb]:
    assert len(target_moments) == 2 * ORDER_N + PARITY
    old_hankel = arb_mat([
        [target_moments[row + column + PARITY] for column in range(ORDER_N)]
        for row in range(ORDER_N)
    ])
    target_column = arb_mat([
        [target_moments[row + ORDER_N + PARITY]]
        for row in range(ORDER_N)
    ])
    assert old_hankel.det() > 0
    coefficients = old_hankel.solve(-target_column)
    polynomial = {
        2 * row + PARITY: coefficients[row, 0]
        for row in range(ORDER_N)
    }
    polynomial[KAPPA] = arb(1)
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


def strict_sign(value: arb) -> str:
    if value > 0:
        return "positive"
    if value < 0:
        return "negative"
    return "unresolved"


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
    assert (
        signed_payload["receipt_integrity"]["payload_sha256"]
        == EXPECTED_SIGNED_PAYLOAD_SHA256
    )
    assert len(signed_payload["moments"]) == 15
    assert signed_payload["quadrature"]["cell_width"] == "1/1024"
    assert signed_payload["quadrature"]["cell_count"] == 3072
    assert signed_payload["quadrature"]["cauchy_q"] == "5/512"

    engine = load_module(positive_engine_path)
    ctx.prec = args.precision_bits
    engine.MAX_DERIVATIVE_ORDER = MAX_POSITIVE_MOMENT_INDEX
    positive_moments, positive_rows, envelope_rows, _ = (
        engine.complete_positive_moments()
    )
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

    q = residual(target_moments)
    q_prime = derivative(q)
    tq = times_t_power(q, 1)
    t2q_prime = times_t_power(q_prime, 2)
    q_second = derivative(q_prime)
    t2q_prime_derivative = derivative(t2q_prime)

    # This exact coefficient minor proves polynomial rank three before any
    # floating Gram calculation.  Here a=[t^13]q and b=[t^11]q.
    a = q[KAPPA - 2]
    b = q[KAPPA - 4]
    polynomial_rank_minor = 2 * (2 * KAPPA * b - (KAPPA - 2) * a * a)
    assert polynomial_rank_minor < 0 or polynomial_rank_minor > 0

    A = inner(q_prime, q_prime, positive_moments)
    B = inner(q, q_second, positive_moments)
    C = inner(q, q, positive_moments)
    D = inner(tq, tq, positive_moments)
    E = inner(q_prime, tq, positive_moments)
    F = inner(q_prime, t2q_prime, positive_moments)
    G = inner(tq, t2q_prime, positive_moments)
    T = inner(t2q_prime, t2q_prime, positive_moments)
    R = inner(q, t2q_prime_derivative, positive_moments)
    Y = C + E

    K2 = arb_mat([[A, E], [E, D]])
    y2 = arb_mat([[B], [Y]])
    K3 = arb_mat([[A, E, F], [E, D, G], [F, G, T]])
    y3 = arb_mat([[B], [Y], [R]])
    delta2 = A * D - E * E
    assert delta2 > 0
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
    repair_lhs = innovation * innovation + 4 * H2 * sigma
    assert Hnum / (4 * delta2) == H2 or (Hnum / (4 * delta2)).overlaps(H2)
    assert (H2 + gain).overlaps(H3)
    assert (N3 / (4 * delta2 * Snum)).overlaps(H3)
    assert (N3 / (delta2 * delta2)).overlaps(repair_lhs)

    bordered = arb_mat([
        [A, E, F, B],
        [E, D, G, Y],
        [F, G, T, R],
        [B, Y, R, A],
    ])
    bordered_determinant = bordered.det()
    assert K3.det() > 0
    assert K3.det().overlaps(Snum)
    assert bordered_determinant.overlaps(-N3 / delta2)

    # The decisive source-specific obstruction.
    assert H2 < 0
    assert H3 < 0
    assert N3 < 0
    assert repair_lhs < 0
    assert bordered_determinant > 0

    scalars = {
        "A": A,
        "B": B,
        "C": C,
        "D": D,
        "E": E,
        "F": F,
        "G": G,
        "T": T,
        "R": R,
        "Y=C+E": Y,
        "Delta2=AD-E^2": delta2,
        "Hnum": Hnum,
        "Snum=det(K3)": Snum,
        "Dnum": Dnum,
        "N3=Dnum^2+Hnum*Snum": N3,
        "H2": H2,
        "sigma=Snum/Delta2": sigma,
        "innovation=Dnum/Delta2": innovation,
        "gain=innovation^2/(4*sigma)": gain,
        "H3": H3,
        "repair_lhs=innovation^2+4*H2*sigma": repair_lhs,
        "bordered_determinant": bordered_determinant,
        "polynomial_rank_minor": polynomial_rank_minor,
    }

    script_path = Path(__file__).resolve()
    receipt = {
        "schema_version": "zsv.u3_kappa15_actual_obstruction.20261103.v1",
        "status": "PASS",
        "scope": (
            "Certified failure of the fixed U3=span{q',tq,t^2q'} score "
            "auxiliary at the actual complete-theta odd degree-15 residual"
        ),
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "python_flint": flint.__version__,
            "arb_precision_bits": args.precision_bits,
            "network_used": False,
            "quadrature_in_this_verifier": False,
            "finite_orbit_substitution_used": False,
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
            "signed_archive": (
                "mu_j=4^j*M_j; inherited outward decimal padding is applied "
                "before exact division"
            ),
            "signed_old_data_used": "M_0,...,M_14 only",
            "signed_new_target_absent": "M_15 is not present in the input receipt",
            "positive_moments": "n_j=||psi^(j)||^2 on h>=0 for j=0,...,16",
            "spectral_scaling": (
                "m_j=4*pi*n_j; the omitted common positive scale preserves all signs"
            ),
        },
        "positive_tail_ratio": {
            "formula": "(10/9)^(2*16+3)*exp(-19*pi)",
            "bound": engine.endpoints(generalized_tail_ratio),
            "strictly_below_one_half": True,
        },
        "target_moments": target_rows,
        "complete_positive_moments": positive_rows,
        "derivative_tail_envelopes": envelope_rows,
        "actual_residual": {
            "order_N": ORDER_N,
            "parity_epsilon": PARITY,
            "degree_kappa": KAPPA,
            "q": polynomial_record(engine, q),
            "basis": ["q_prime", "t_q", "t2_q_prime"],
            "rank_minor_degrees": [16, 14, 12],
            "rank_minor_formula": "2*(2*kappa*b-(kappa-2)*a^2), a=[t^13]q, b=[t^11]q",
            "rank_minor": engine.endpoints(polynomial_rank_minor),
            "rank_three_certified": True,
        },
        "projection": {
            "K2": matrix_record(engine, K2),
            "y2": matrix_record(engine, y2),
            "K3": matrix_record(engine, K3),
            "y3": matrix_record(engine, y3),
            "scalars": {name: engine.endpoints(value) for name, value in scalars.items()},
        },
        "exact_cleared_condition": {
            "definitions": [
                "Delta2=AD-E^2",
                "Hnum=DB^2-2*E*B*Y+A*Y^2-A*Delta2",
                "Snum=T*Delta2-(D*F^2-2*E*F*G+A*G^2)",
                "Dnum=R*Delta2-(D*F-E*G)*B-(A*G-E*F)*Y",
                "N3=Dnum^2+Hnum*Snum",
            ],
            "identities": [
                "4*H2=Hnum/Delta2",
                "sigma=Snum/Delta2",
                "innovation=Dnum/Delta2",
                "H3=N3/(4*Delta2*Snum)",
                "det([[K3,y3],[y3^T,A]])=-N3/Delta2",
            ],
            "uniform_U3_requirement": "N3>=0, equivalently innovation^2>=-4*H2*sigma",
            "actual_kappa15_result": "N3<0 strictly",
        },
        "strict_conclusion": {
            "old_signed_data_only": True,
            "polynomial_dictionary_rank_three": True,
            "K2_positive_definite": True,
            "K3_positive_definite": True,
            "baseline_H2_negative": True,
            "U3_H3_negative": True,
            "schur_repair_condition_fails": True,
            "fixed_U3_uniform_route_refuted": True,
        },
        "nonclaims": [
            "The new signed pivot M_15 is absent, so its sign is not asserted.",
            "Failure of a sufficient score auxiliary is not a counterexample to RH.",
            "A finite source-specific obstruction does not rule out adaptive or growing dictionaries.",
            "This primary verifier still requires an independent replay before audit closure.",
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
        "output": str(args.output),
        "H2_upper": engine.endpoints(H2)["upper"],
        "H3_upper": engine.endpoints(H3)["upper"],
        "N3_upper": engine.endpoints(N3)["upper"],
        "verifier_sha256": digest(script_path),
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
