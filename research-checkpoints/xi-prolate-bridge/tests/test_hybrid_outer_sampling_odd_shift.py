from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path
import sys
import unittest
from unittest import mock

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

import hybrid_outer_sampling_odd_shift as producer_module  # noqa: E402
import hybrid_outer_sampling_odd_shift_replay as verifier_module  # noqa: E402
from hybrid_outer_sampling_odd_shift import produce  # noqa: E402
from hybrid_outer_sampling_odd_shift_replay import ReplayError, replay  # noqa: E402


def endpoint(payload: dict[str, object], key: str, side: str) -> mp.mpf:
    raw = payload["intervals"][key]["dyadic"][side]
    with mp.workprec(max(int(raw[3]) + 32, 64)):
        return mp.mpf((raw[0], int(raw[1]), raw[2], raw[3]))


def producer_bytes(payload: dict[str, object]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")


def canonical_decimal(value: mp.mpf, digits: int) -> str:
    with mp.workdps(digits + 20):
        return mp.nstr(value, digits)


def recanonicalize_displays(payload: dict[str, object], digits: int) -> None:
    for key, item in payload["intervals"].items():
        item["decimal"] = [
            canonical_decimal(endpoint(payload, key, "lower"), digits),
            canonical_decimal(endpoint(payload, key, "upper"), digits),
        ]


class HybridOuterSamplingOddShiftTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 140

    def test_producer_and_independent_interval_replay(self):
        payload = produce("2.5", 70)
        result = replay(payload)
        self.assertEqual(
            result["status"], "HYBRID_OUTER_SAMPLING_ODD_SHIFT_REPLAY_PASS"
        )
        self.assertTrue(result["constants_independently_reconstructed"])
        self.assertTrue(result["reflected_tail_source_admission_matched"])
        self.assertTrue(result["source_dependency_inventory_rehashed"])
        self.assertTrue(result["summation_threshold_rechecked"])
        self.assertTrue(result["ceil_stability_rechecked"])
        self.assertFalse(result["producer_booleans_trusted"])
        self.assertFalse(result["zero_list_read"])
        self.assertTrue(
            all(item["overlap"] for item in result["interval_comparisons"].values())
        )
        self.assertIn(
            "an even-complement signed comparison",
            result["claim_scope"]["not_proved"],
        )
        self.assertIn(
            (
                "smallness of the normalized Ritz bound U_Z=epsilon_lambda/a^2 "
                "without separate lower control of a"
            ),
            result["claim_scope"]["not_proved"],
        )
        self.assertIn(
            "locally uniform determinant convergence",
            result["claim_scope"]["not_proved"],
        )

    def test_pi_is_materialized_at_requested_interval_precision(self):
        payload = produce("2.5", 60)
        bit_counts = [
            payload["intervals"]["pi"]["dyadic"][side][3]
            for side in ("lower", "upper")
        ]
        self.assertGreater(min(bit_counts), 180)
        self.assertGreater(
            endpoint(payload, "pi", "upper") - endpoint(payload, "pi", "lower"),
            0,
        )

    def test_replay_independent_of_ambient_precision(self):
        payload = produce("2.5", 90)
        with mp.workdps(15):
            result = replay(payload)
        self.assertEqual(
            result["status"], "HYBRID_OUTER_SAMPLING_ODD_SHIFT_REPLAY_PASS"
        )

    def test_doubled_precision_intervals_overlap(self):
        low = produce("2.5", 60)
        high = produce("2.5", 120)
        self.assertEqual(set(low["intervals"]), set(high["intervals"]))
        for key in low["intervals"]:
            lo1, hi1 = endpoint(low, key, "lower"), endpoint(low, key, "upper")
            lo2, hi2 = endpoint(high, key, "lower"), endpoint(high, key, "upper")
            self.assertLessEqual(max(lo1, lo2), min(hi1, hi2), key)
        self.assertEqual(low["integers"], high["integers"])

    def test_displayed_l2_constant_encloses_independent_value(self):
        payload = produce("3.25", 80)
        with mp.workdps(100):
            a4 = mp.sqrt(3) / mp.power(2, mp.mpf(11) / 4)
            c2 = (
                40
                * mp.power(3, -mp.mpf(1) / 4)
                * mp.exp(-(1 + mp.sqrt(3)) / 2)
                / (1 - 1 / mp.sqrt(3)) ** 2
            )
            expected = a4**2 * (mp.mpf(502299) + c2**2 / 192)
        self.assertLessEqual(endpoint(payload, "C_L2", "lower"), expected)
        self.assertGreaterEqual(endpoint(payload, "C_L2", "upper"), expected)

    def test_absorption_and_threshold_certificates_are_strict(self):
        for lambda_text in ("2", "2.5", "100"):
            with self.subTest(lambda_text=lambda_text):
                payload = produce(lambda_text, 70)
                self.assertGreater(endpoint(payload, "absorption_margin", "lower"), 0)
                self.assertGreater(endpoint(payload, "derivative_margin", "lower"), 0)
                self.assertGreaterEqual(payload["integers"]["M_lambda"], 100000)
                self.assertGreaterEqual(
                    endpoint(payload, "x_threshold_upper", "lower"),
                    payload["integers"]["M_lambda"],
                )

    def test_rejects_binary64_recursively_and_at_input(self):
        with self.assertRaises(TypeError):
            produce(2.5, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            produce("2e0", 60)
        with self.assertRaises(TypeError):
            produce("2.5", 60.0)  # type: ignore[arg-type]

        payload = produce("2.5", 60)
        payload["intervals"]["C2"]["decimal"][0] = 1.25
        with self.assertRaisesRegex(ReplayError, "binary64"):
            replay(payload)

    def test_rejects_exact_inventory_mutations(self):
        top = produce("2.5", 60)
        top["unexpected"] = False
        with self.assertRaisesRegex(ReplayError, "top-level"):
            replay(top)

        theorem = produce("2.5", 60)
        theorem["theorem"]["extra"] = "mutation"
        with self.assertRaisesRegex(ReplayError, "theorem inventory"):
            replay(theorem)

        intervals = produce("2.5", 60)
        intervals["intervals"].pop("C_L2")
        with self.assertRaisesRegex(ReplayError, "interval inventory"):
            replay(intervals)

        integers = produce("2.5", 60)
        integers["integers"]["extra"] = 1
        with self.assertRaisesRegex(ReplayError, "integer inventory"):
            replay(integers)

    def test_rejects_assumed_zeros_positivity_or_dropped_reflection(self):
        for field in (
            "zero_list_read",
            "zeros_assumed_real_globally",
            "global_Weil_positivity_assumed",
        ):
            with self.subTest(field=field):
                payload = produce("2.5", 60)
                payload["source_admissions"][field] = True
                with self.assertRaisesRegex(ReplayError, "source admission"):
                    replay(payload)

        reflected = produce("2.5", 60)
        reflected["source_admissions"]["both_reflected_tails_retained"] = False
        with self.assertRaisesRegex(ReplayError, "source admission"):
            replay(reflected)

        split = produce("2.5", 60)
        split["source_admissions"][
            "complete_sampled_series_used_before_endpoint_split"
        ] = False
        with self.assertRaisesRegex(ReplayError, "source admission"):
            replay(split)

    def test_rejects_formula_threshold_and_claim_mutations(self):
        formula = produce("2.5", 60)
        formula["locked_formulas"]["C_L2"] = "a4^2*(334866+C2^2/576)"
        with self.assertRaisesRegex(ReplayError, "locked formula"):
            replay(formula)

        threshold = produce("2.5", 60)
        threshold["integers"]["J_upper"] -= 1
        with self.assertRaisesRegex(ReplayError, "threshold integer"):
            replay(threshold)

        promoted = produce("2.5", 60)
        promoted["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        with self.assertRaisesRegex(ReplayError, "terminal-state"):
            replay(promoted)

        rh = copy.deepcopy(produce("2.5", 60))
        rh["claim_scope"]["not_proved"].remove("the Riemann hypothesis")
        with self.assertRaisesRegex(ReplayError, "claim-scope"):
            replay(rh)

    def test_rejects_source_hash_and_interval_endpoint_mutations(self):
        source = produce("2.5", 60)
        source["source_hashes"]["ZERO_SAMPLING_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(ReplayError, "source hash"):
            replay(source)

        interval = produce("2.5", 60)
        interval["intervals"]["C_L2"] = {
            "decimal": ["0.0", "0.0"],
            "dyadic": {
                "lower": [0, "0", 0, 0],
                "upper": [0, "0", 0, 0],
            },
        }
        with self.assertRaisesRegex(ReplayError, "interval nonoverlap"):
            replay(interval)

        typed = produce("2.5", 60)
        typed["intervals"]["C2"]["dyadic"]["lower"][1] = 17
        with self.assertRaisesRegex(ReplayError, "typed dyadic"):
            replay(typed)

        oversized = produce("2.5", 60)
        oversized["intervals"]["C2"]["dyadic"]["lower"][3] = 1_000_000
        with self.assertRaisesRegex(ReplayError, "typed dyadic"):
            replay(oversized)

    def test_rejects_noncanonical_decimal_and_overwide_interval(self):
        display = produce("2.5", 60)
        display["intervals"]["C_L2"]["decimal"][0] = "arbitrary-display"
        with self.assertRaisesRegex(ReplayError, "noncanonical decimal"):
            replay(display)

        wide = produce("2.5", 60)
        lower_raw = [1, "1", 1000, 1]
        upper_raw = [0, "1", 1000, 1]
        with mp.workprec(80):
            lower = mp.mpf((1, 1, 1000, 1))
            upper = mp.mpf((0, 1, 1000, 1))
        wide["intervals"]["C_L2"] = {
            "decimal": [
                canonical_decimal(lower, 60),
                canonical_decimal(upper, 60),
            ],
            "dyadic": {"lower": lower_raw, "upper": upper_raw},
        }
        with self.assertRaisesRegex(ReplayError, "too wide"):
            replay(wide)

    def test_rejects_false_precision_promotion_after_display_recanonicalization(self):
        promoted = produce("2.5", 60)
        promoted["input"]["interval_decimal_digits"] = 160
        recanonicalize_displays(promoted, 160)
        with self.assertRaisesRegex(ReplayError, "too wide"):
            replay(promoted)

    def test_rehashes_full_lock_inventory_and_checks_runtime(self):
        payload = produce("2.5", 60)
        real_sha256 = verifier_module._sha256

        def corrupted_dependency(path: Path) -> str:
            if path.name == "OUTER_OUTER_SPECTRAL_THEOREM.md":
                return "0" * 64
            return real_sha256(path)

        with mock.patch.object(
            verifier_module, "_sha256", side_effect=corrupted_dependency
        ):
            with self.assertRaisesRegex(ReplayError, "dependency hash mismatch"):
                replay(payload)

        producer_real_sha256 = producer_module._sha256

        def corrupted_producer_dependency(path: Path) -> str:
            if path.name == "OUTER_OUTER_SPECTRAL_THEOREM.md":
                return "0" * 64
            return producer_real_sha256(path)

        with mock.patch.object(
            producer_module, "_sha256", side_effect=corrupted_producer_dependency
        ):
            with self.assertRaisesRegex(ValueError, "dependency hash mismatch"):
                produce("2.5", 60)

        runtime_hash = produce("2.5", 60)
        runtime_hash["runtime_hashes"]["requirements.txt"] = "0" * 64
        with self.assertRaisesRegex(ReplayError, "runtime hash inventory"):
            replay(runtime_hash)

        with mock.patch.object(verifier_module.mp, "__version__", "0.0.0"):
            with self.assertRaisesRegex(ReplayError, "mpmath runtime mismatch"):
                replay(payload)

    def test_replay_result_binds_exact_input_bytes_precision_and_raw_intervals(self):
        payload80 = produce("2.5", 80)
        raw80 = producer_bytes(payload80)
        replay80 = replay(payload80, producer_bytes=raw80)
        self.assertEqual(
            replay80["producer_binding"]["sha256"], hashlib.sha256(raw80).hexdigest()
        )
        self.assertEqual(replay80["producer_binding"]["byte_source"], "exact artifact file bytes")
        self.assertEqual(replay80["input"], payload80["input"])
        self.assertEqual(replay80["replay_precision"]["interval_decimal_digits"], 80)
        self.assertEqual(replay80["runtime_hashes"], payload80["runtime_hashes"])
        self.assertIn("notes/OUTER_OUTER_SPECTRAL_THEOREM.md", replay80["source_hashes"])
        self.assertEqual(
            set(replay80["reconstructed_intervals"]), set(payload80["intervals"])
        )
        self.assertIn("dyadic", replay80["reconstructed_intervals"]["C_L2"])

        payload160 = produce("2.5", 160)
        replay160 = replay(payload160, producer_bytes=producer_bytes(payload160))
        self.assertNotEqual(
            json.dumps(replay80, sort_keys=True), json.dumps(replay160, sort_keys=True)
        )

        mismatched_bytes = producer_bytes(produce("3", 80))
        with self.assertRaisesRegex(ReplayError, "do not decode to replay payload"):
            replay(payload80, producer_bytes=mismatched_bytes)

    def test_rejects_shared_library_disclosure_mutation(self):
        payload = produce("2.5", 60)
        payload["arithmetic"]["shared_library_with_replay"] = False
        with self.assertRaisesRegex(ReplayError, "shared mpmath.iv"):
            replay(payload)

        version = produce("2.5", 60)
        version["arithmetic"]["library_version"] = "0.0.0"
        with self.assertRaisesRegex(ReplayError, "shared mpmath.iv"):
            replay(version)


if __name__ == "__main__":
    unittest.main()
