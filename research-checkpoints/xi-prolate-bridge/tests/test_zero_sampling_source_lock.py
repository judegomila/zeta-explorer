from __future__ import annotations

import contextlib
import copy
from decimal import Decimal
from fractions import Fraction
import json
from pathlib import Path
import sys
import tempfile
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from zero_sampling_source_lock import (  # noqa: E402
    FINITE_COVER_HEIGHT,
    HSW_T0,
    SOURCE_SPECS,
    ZeroSamplingSourceLockError,
    diagnostics,
    dyadic_sampling_term,
    finite_lower_overlap,
    frequency_filter_certificate,
    load_and_validate,
    local_zero_overlap,
    sampling_prefactors,
    validate_payload,
    vk_block_margin,
    zero_count_error,
    zero_count_main,
)
from zero_sampling_source_replay import ReplayError, replay  # noqa: E402


LOCK_PATH = ROOT / "ZERO_SAMPLING_SOURCE_LOCK.json"


class ZeroSamplingSourceLockTests(unittest.TestCase):
    def payload(self) -> dict[str, object]:
        return json.loads(LOCK_PATH.read_text(encoding="utf-8"))

    @contextlib.contextmanager
    def temporary_lock(self, payload: dict[str, object]):
        with tempfile.TemporaryDirectory() as directory:
            temporary_root = Path(directory)
            specs = list(SOURCE_SPECS.values())
            for spec in specs:
                relative = Path(spec["vendored_path"])
                destination = temporary_root / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes((ROOT / relative).read_bytes())
            lock = temporary_root / LOCK_PATH.name
            lock.write_text(json.dumps(payload), encoding="utf-8")
            yield lock

    def test_exact_source_bytes_formulas_and_scope_pass(self):
        payload = load_and_validate(LOCK_PATH, ROOT)
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        boundary = payload["admission_boundary"]
        self.assertFalse(boundary["decimal_zero_list_read"])
        self.assertFalse(boundary["hsw_database_corollary_used_for_sampling_overlap"])
        self.assertTrue(boundary["hsw_database_dependency_indirect_via_mty"])
        self.assertFalse(boundary["zeros_assumed_real_or_on_critical_line_globally"])
        self.assertFalse(boundary["finite_computations_independently_replayed"])
        self.assertFalse(boundary["outer_outer_bound_proved"])

    def test_decimal_producer_and_independent_mpmath_replay_agree(self):
        for dps in (80, 160):
            for index in (0, 34):
                with self.subTest(dps=dps, index=index):
                    independent = replay(LOCK_PATH, dps=dps, index=index, q=2)
                    with mp.workdps(dps):
                        tolerance = mp.power(10, -(dps - 8))
                        self.assertLess(
                            abs(
                                mp.mpf(independent["delta"])
                                - mp.mpf(str(vk_block_margin(3 * 2**index, dps)))
                            ),
                            tolerance,
                        )
                        self.assertLess(
                            abs(
                                mp.mpf(independent["overlap"])
                                - mp.mpf(str(local_zero_overlap(3 * 2**index, dps)))
                            ),
                            tolerance
                            * max(1, mp.mpf(independent["overlap"])),
                        )
                        self.assertLess(
                            abs(
                                mp.mpf(independent["dyadic_term"])
                                - mp.mpf(str(dyadic_sampling_term(index, 2, dps)))
                            ),
                            tolerance
                            * max(1, mp.mpf(independent["dyadic_term"])),
                        )
                    self.assertFalse(independent["producer_booleans_trusted"])
                    self.assertFalse(independent["zero_table_read"])
                    self.assertFalse(independent["zeros_assumed_real"])

    def test_piecewise_overlap_uses_one_finite_cover_then_analytic_count(self):
        self.assertEqual(FINITE_COVER_HEIGHT, 61220092002)
        finite = finite_lower_overlap(100)
        self.assertEqual(local_zero_overlap(3, 100), finite)
        self.assertEqual(local_zero_overlap(3 * 2**33, 100), finite)
        high = local_zero_overlap(3 * 2**34, 100)
        self.assertGreater(high, 0)
        self.assertLess(high, Decimal(100))
        self.assertLess(high, finite)

    def test_exact_submean_constants_are_reconstructed(self):
        self.assertGreater(frequency_filter_certificate(), Fraction(1, 10))
        self.assertEqual(
            frequency_filter_certificate(),
            Fraction(22720437289, 110075314176),
        )
        prefactors = sampling_prefactors()
        self.assertEqual(prefactors["positive_height"], Fraction(320))
        self.assertEqual(prefactors["global"], Fraction(1280))

    def test_diagnostics_are_stable_when_precision_doubles(self):
        low = diagnostics(80)
        high = diagnostics(160)
        for key in low:
            with self.subTest(key=key):
                self.assertTrue(high[key].startswith(low[key][:70]))

    def test_zero_count_plus_one_eighth_mutation_is_rejected_by_both_paths(self):
        payload = self.payload()
        payload["locked_source_formulas"]["zero_count_theorem"] = (
            "abs(N(T)-M(T)-1/8)<=R(T) for T>=T0=30610046000"
        )
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(payload, ROOT)
        with self.temporary_lock(payload) as lock:
            with self.assertRaisesRegex(ReplayError, "1/8"):
                replay(lock)

    def test_rounded_corollary_constants_cannot_replace_theorem_constants(self):
        payload = self.payload()
        payload["locked_source_formulas"]["zero_count_error"] = (
            "E(T)=0.1038*log(T)+0.2573*log(log(T))+9.3675"
        )
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(payload, ROOT)
        with self.temporary_lock(payload) as lock:
            with self.assertRaisesRegex(ReplayError, "zero-count"):
                replay(lock)

    def test_database_corollary_or_zero_list_is_rejected(self):
        database = self.payload()
        database["admission_boundary"][
            "hsw_database_corollary_used_for_sampling_overlap"
        ] = True
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(database, ROOT)
        with self.temporary_lock(database) as lock:
            with self.assertRaisesRegex(ReplayError, "claim-boundary"):
                replay(lock)

        zero_list = self.payload()
        zero_list["assumed_decimal_zeros"] = ["14.134725141"]
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(zero_list, ROOT)

    def test_global_zero_reality_assumption_is_rejected(self):
        payload = self.payload()
        payload["admission_boundary"][
            "zeros_assumed_real_or_on_critical_line_globally"
        ] = True
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(payload, ROOT)
        with self.temporary_lock(payload) as lock:
            with self.assertRaisesRegex(ReplayError, "claim-boundary"):
                replay(lock)

    def test_functional_equation_reflection_cannot_be_dropped(self):
        payload = self.payload()
        payload["locked_source_formulas"]["functional_equation_reflection"] = (
            "beta is set equal to 1/2"
        )
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(payload, ROOT)
        with self.temporary_lock(payload) as lock:
            with self.assertRaisesRegex(ReplayError, "reflection"):
                replay(lock)

    def test_block_upper_endpoint_cannot_change_from_2T_to_T(self):
        payload = self.payload()
        payload["locked_source_formulas"]["block_margin"] = (
            "delta(T)=1/(55.241*(log(T))^(2/3)*(log(log(T)))^(1/3)) for T>=3"
        )
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(payload, ROOT)
        with self.temporary_lock(payload) as lock:
            with self.assertRaisesRegex(ReplayError, "2T"):
                replay(lock)

    def test_multiplicity_cannot_be_dropped(self):
        payload = self.payload()
        payload["binding_inputs"]["global_zero_count"][
            "zeros_counted_with_multiplicity"
        ] = False
        payload["admission_boundary"]["local_count_includes_multiplicity"] = False
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(payload, ROOT)
        with self.temporary_lock(payload) as lock:
            with self.assertRaises(ReplayError):
                replay(lock)

    def test_indirect_database_dependency_disclosure_cannot_be_dropped(self):
        payload = self.payload()
        payload["admission_boundary"][
            "hsw_database_dependency_indirect_via_mty"
        ] = False
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(payload, ROOT)
        with self.temporary_lock(payload) as lock:
            with self.assertRaisesRegex(ReplayError, "dependency disclosure"):
                replay(lock)

    def test_binary64_and_boolean_numeric_inputs_are_rejected(self):
        for value in (3.0, True):
            with self.subTest(value=value):
                with self.assertRaises(TypeError):
                    vk_block_margin(value)  # type: ignore[arg-type]
                with self.assertRaises(TypeError):
                    zero_count_error(value)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            dyadic_sampling_term(0, 2, 80.0)  # type: ignore[arg-type]

        payload = self.payload()
        payload["diagnostic_cross_checks"]["delta_at_T_3_open_interval"][0] = 0.014
        with self.assertRaisesRegex(ZeroSamplingSourceLockError, "binary64"):
            validate_payload(payload, ROOT)

    def test_source_hash_and_actual_byte_mutations_are_rejected(self):
        payload = self.payload()
        payload["binding_inputs"]["vinogradov_korobov_zero_free_region"][
            "vendored_sha256"
        ] = "0" * 64
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(payload, ROOT)

        clean = self.payload()
        with self.temporary_lock(clean) as lock:
            target = lock.parent / SOURCE_SPECS[
                "vinogradov_korobov_zero_free_region"
            ]["vendored_path"]
            changed = bytearray(target.read_bytes())
            changed[-1] ^= 1
            target.write_bytes(changed)
            with self.assertRaises(ReplayError):
                replay(lock)

    def test_finite_verification_height_and_claim_scope_cannot_be_promoted(self):
        height = self.payload()
        height["binding_inputs"]["finite_height_line_verification"][
            "exact_verified_height"
        ] = "30000000000000"
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(height, ROOT)

        promotion = self.payload()
        promotion["admission_boundary"]["outer_outer_bound_proved"] = True
        promotion["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        with self.assertRaises(ZeroSamplingSourceLockError):
            validate_payload(promotion, ROOT)

    def test_main_and_error_domains_fail_closed(self):
        with self.assertRaises(ValueError):
            zero_count_main(0)
        with self.assertRaises(ValueError):
            zero_count_error(1)
        with self.assertRaises(ValueError):
            vk_block_margin(Decimal("2.999"))
        with self.assertRaises(ValueError):
            local_zero_overlap(2)
        with self.assertRaises(ValueError):
            dyadic_sampling_term(-1, 2)


if __name__ == "__main__":
    unittest.main()
