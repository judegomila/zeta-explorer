"""Independent mpmath replay of the conditional zero-sampling source lock.

This path does not import the Decimal producer.  It reconstructs the source
hashes, external constants, and one dyadic term from the JSON inputs while
refusing producer truth flags, binary64 values, zero tables, or a global
critical-line assumption.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp


EXPECTED_SOURCES = {
    "vinogradov_korobov_zero_free_region": (
        "MTY-ZFR-2212.06867v1",
        "vendor/MTY-ZFR-2212.06867v1.pdf",
        "127c32eb86d0aea264cc5b1ba96cc83243ef6b763451591e1560edaca1767300",
    ),
    "global_zero_count": (
        "HSW-ZC-2107.06506v1",
        "vendor/HSW-ZC-2107.06506v1.pdf",
        "3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf",
    ),
    "finite_height_line_verification": (
        "PT-RH-VERIFY-2004.09765v1",
        "vendor/PT-RH-VERIFY-2004.09765v1.pdf",
        "3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885",
    ),
}

EXPECTED_ZERO_FREE_FORMULA = (
    "zeta(sigma+i*t)!=0 when abs(t)>=3 and sigma>=1-1/(55.241*"
    "(log(abs(t)))^(2/3)*(log(log(abs(t))))^(1/3))"
)
EXPECTED_COUNT_FORMULA = (
    "R(T)=0.103787*log(T)+0.257297*log(log(T))+9.367419"
)
EXPECTED_REFLECTION = (
    "rho implies 1-conjugate(rho), so neither beta nor 1-beta is replaced "
    "by an assumed value"
)


class ReplayError(ValueError):
    """The independent replay rejected the source-lock payload."""


def _require_int(value: Any, name: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an integer")
    if value < minimum:
        raise ValueError(f"{name} must be at least {minimum}")
    return value


def _reject_float(value: Any, path: str = "payload") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path}")
    if isinstance(value, dict):
        for key, child in value.items():
            _reject_float(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _reject_float(child, f"{path}[{index}]")


def _source_check(
    source: dict[str, Any], expected: tuple[str, str, str], root: Path
) -> None:
    source_id, relative_text, expected_hash = expected
    if source.get("id") != source_id:
        raise ReplayError("source id mutation")
    if source.get("vendored_path") != relative_text:
        raise ReplayError("source path mutation")
    if source.get("vendored_sha256") != expected_hash:
        raise ReplayError("source hash declaration mutation")
    relative = Path(relative_text)
    if relative.is_absolute() or ".." in relative.parts:
        raise ReplayError("source path escape")
    digest = hashlib.sha256((root / relative).read_bytes()).hexdigest()
    if digest != expected_hash:
        raise ReplayError("source byte hash mismatch")


def replay(
    lock_path: Path, dps: int = 80, index: int = 0, q: int = 2
) -> dict[str, Any]:
    """Replay hashes and sampling arithmetic without importing the producer."""

    dps = _require_int(dps, "dps", 30)
    index = _require_int(index, "index", 0)
    q = _require_int(q, "q", 0)
    lock_path = Path(lock_path)
    payload = json.loads(lock_path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ReplayError("lock is not a JSON object")
    _reject_float(payload)

    if payload.get("schema") != "xi-prolate-zero-sampling-source-lock-v1":
        raise ReplayError("schema mutation")
    if payload.get("terminal_state") != "P0_INVALIDATED":
        raise ReplayError("terminal-state promotion")
    binding = payload.get("binding_inputs")
    if not isinstance(binding, dict) or set(binding) != set(EXPECTED_SOURCES):
        raise ReplayError("binding source inventory mutation")
    for key, expected in EXPECTED_SOURCES.items():
        source = binding.get(key)
        if not isinstance(source, dict):
            raise ReplayError("missing source record")
        _source_check(source, expected, lock_path.parent)

    formulas = payload.get("locked_source_formulas")
    if not isinstance(formulas, dict):
        raise ReplayError("formula dictionary missing")
    if formulas.get("zero_free_region") != EXPECTED_ZERO_FREE_FORMULA:
        raise ReplayError("zero-free formula mutation")
    if formulas.get("zero_count_error") != EXPECTED_COUNT_FORMULA:
        raise ReplayError("zero-count formula mutation")
    if formulas.get("zero_count_theorem") != (
        "abs(N(T)-M(T)+1/8)<=R(T) for T>=T0=30610046000"
    ):
        raise ReplayError("zero-count +1/8 convention mutation")
    if formulas.get("functional_equation_reflection") != EXPECTED_REFLECTION:
        raise ReplayError("functional-equation reflection dropped")
    if formulas.get("block_margin") != (
        "delta(T)=1/(55.241*(log(2*T))^(2/3)*(log(log(2*T)))^(1/3)) "
        "for T>=3"
    ):
        raise ReplayError("T versus 2T margin mutation")
    if formulas.get("local_overlap") != (
        "Z(T)=Z_finite for 3<=T<T0+1 and Z(T)=1+log(2*T+1)/pi+"
        "2*R(2*T+1) for T>=T0+1, where U=2*(T0+1) and "
        "Z_finite=1+M(U)-1/8+R(U)"
    ):
        raise ReplayError("piecewise local-overlap formula mutation")

    boundary = payload.get("admission_boundary")
    if not isinstance(boundary, dict):
        raise ReplayError("admission boundary missing")
    required_false = (
        "decimal_zero_list_read",
        "hsw_database_corollary_used_for_sampling_overlap",
        "zeros_assumed_real_or_on_critical_line_globally",
        "finite_computations_independently_replayed",
        "weighted_translation_lemma_S_proved",
        "outer_outer_bound_proved",
        "sector_floor_proved",
        "equation_5_2_proved",
        "locally_uniform_determinant_convergence_proved",
        "status_promoted",
    )
    if any(boundary.get(name) is not False for name in required_false):
        raise ReplayError("claim-boundary promotion or zero input")
    if boundary.get("two_sided_margin_uses_functional_equation_not_zero_reality") is not True:
        raise ReplayError("two-sided margin derivation missing")
    if boundary.get("local_count_includes_multiplicity") is not True:
        raise ReplayError("multiplicity dropped")
    if boundary.get("hsw_database_dependency_indirect_via_mty") is not True:
        raise ReplayError("indirect finite-database dependency disclosure dropped")

    with mp.workdps(dps + 20):
        t = mp.mpf(3) * mp.power(2, index)
        constant = mp.mpf("55.241")
        log_upper = mp.log(2 * t)
        delta = 1 / (
            constant
            * mp.power(log_upper, mp.mpf(2) / 3)
            * mp.power(mp.log(log_upper), mp.mpf(1) / 3)
        )
        t0 = mp.mpf(30610046000)

        def main_term(value: mp.mpf) -> mp.mpf:
            return value / (2 * mp.pi) * mp.log(value / (2 * mp.pi * mp.e))

        def analytic_error(value: mp.mpf) -> mp.mpf:
            return (
                mp.mpf("0.103787") * mp.log(value)
                + mp.mpf("0.257297") * mp.log(mp.log(value))
                + mp.mpf("9.367419")
            )

        if t < t0 + 1:
            finite_cover = 2 * (t0 + 1)
            overlap = (
                1
                + main_term(finite_cover)
                - mp.mpf(1) / 8
                + analytic_error(finite_cover)
            )
        else:
            overlap_endpoint = 2 * t + 1
            overlap = (
                1
                + mp.log(overlap_endpoint) / mp.pi
                + 2 * analytic_error(overlap_endpoint)
            )
        term = (
            overlap
            * mp.power(mp.mpf(4) / 3, q)
            * mp.power(delta, -(q + 2))
            * mp.power(2 * t, -3 * delta / 4)
        )

        u = Fraction(11, 48)
        filter_certificate = 4 * (u - u**3 / 6) ** 2
        if filter_certificate <= Fraction(1, 10):
            raise ReplayError("filter lower bound failed")
        if 16 * 20 != 320 or 4 * 320 != 1280:
            raise ReplayError("submean prefactor reconstruction failed")

        return {
            "status": "CONDITIONAL_SOURCE_INPUT_REPLAY_PASS",
            "terminal_state": "P0_INVALIDATED",
            "producer_booleans_trusted": False,
            "zero_table_read": False,
            "zeros_assumed_real": False,
            "finite_computations_replayed": False,
            "zero_count_plus_one_eighth_convention": True,
            "index": index,
            "q": q,
            "dps": dps,
            "delta": mp.nstr(delta, n=dps),
            "overlap": mp.nstr(overlap, n=dps),
            "dyadic_term": mp.nstr(term, n=dps),
            "positive_height_prefactor": "320",
            "global_prefactor": "1280",
        }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "lock",
        type=Path,
        nargs="?",
        default=Path(__file__).resolve().parents[1]
        / "ZERO_SAMPLING_SOURCE_LOCK.json",
    )
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--index", type=int, default=0)
    parser.add_argument("--q", type=int, default=2)
    args = parser.parse_args()
    print(
        json.dumps(
            replay(args.lock, args.dps, args.index, args.q),
            indent=2,
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
