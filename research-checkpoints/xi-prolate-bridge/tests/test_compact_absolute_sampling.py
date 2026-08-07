from __future__ import annotations

import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from compact_absolute_sampling import (  # noqa: E402
    EXPECTED_DEPENDENCIES,
    compact_bv_sampling_bound,
    projection_sampling_report,
    serialize_report,
    validate_source_lock_payload,
    verify_source_lock,
)
from compact_absolute_sampling_replay import (  # noqa: E402
    ReplayError,
    replay_artifact,
)


class CompactAbsoluteSamplingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report80 = projection_sampling_report(2, 80)
        cls.payload80 = serialize_report(cls.report80, 80)

    def replay_payload(
        self, payload: dict[str, object], dps: int | None = 120
    ) -> dict[str, object]:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "producer.json"
            path.write_text(json.dumps(payload), encoding="utf-8")
            return replay_artifact(path, dps)

    def test_generic_compact_bv_bound_is_positive_zero_and_monotone(self) -> None:
        baseline = compact_bv_sampling_bound("2", "1", "1", 70)
        more_variation = compact_bv_sampling_bound("2", "1", "2", 70)
        more_energy = compact_bv_sampling_bound("2", "2", "1", 70)
        zero = compact_bv_sampling_bound("2", "0", "0", 70)
        self.assertGreater(baseline["sampling_upper"], 0)
        self.assertGreaterEqual(baseline["H"], 1)
        self.assertGreater(
            more_variation["sampling_upper"], baseline["sampling_upper"]
        )
        self.assertGreater(more_energy["sampling_upper"], baseline["sampling_upper"])
        self.assertEqual(zero["sampling_upper"], 0)
        self.assertEqual(zero["H"], 1)

    def test_exact_input_boundary_rejects_binary64_nonfinite_and_bad_domain(self) -> None:
        bad_calls = (
            (2.0, "1", "1", 60),
            ("2", 1.0, "1", 60),
            ("2", "1", 1.0, 60),
            ("2", "1", "1", 60.0),
        )
        for arguments in bad_calls:
            with self.subTest(arguments=arguments):
                with self.assertRaises(TypeError):
                    compact_bv_sampling_bound(*arguments)  # type: ignore[arg-type]
        for text in ("nan", "inf", "-inf"):
            with self.subTest(text=text):
                with self.assertRaises(ValueError):
                    compact_bv_sampling_bound(text, "1", "1", 60)
        for arguments in (("3/2", "1", "1"), ("2", "-1", "1")):
            with self.subTest(arguments=arguments):
                with self.assertRaises(ValueError):
                    compact_bv_sampling_bound(*arguments, dps=60)
        with self.assertRaises(ValueError):
            compact_bv_sampling_bound("2", "0", "1", 60)
        for j in (2.0, mp.mpf(2), True):
            with self.subTest(j=repr(j)):
                with self.assertRaises(TypeError):
                    projection_sampling_report(j, 60)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            projection_sampling_report(1, 60)

    def test_source_lock_hashes_full_dependency_set_and_claim_boundary(self) -> None:
        payload = verify_source_lock()
        supplied = {
            item["path"]: item["sha256"] for item in payload["dependencies"]
        }
        self.assertEqual(supplied, EXPECTED_DEPENDENCIES)
        self.assertEqual(len(supplied), 17)
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertIn(
            "the Riemann hypothesis", payload["claim_boundary"]["not_proved"]
        )

    def test_source_lock_formula_dependency_and_promotion_mutations_fail(self) -> None:
        original = json.loads(
            (ROOT / "COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json").read_text()
        )
        mutations: list[dict[str, object]] = []

        payload = copy.deepcopy(original)
        payload["locked_conventions"]["angular_transform"] = (
            "F(z)=integral_R f(t)*exp(+i*z*t) dt"
        )
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["locked_constants"]["generic_bound"] = "unspecified O(1)"
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["dependencies"][0]["path"] = "P0_SOURCE_LOCK.json"
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["claim_boundary"]["not_proved"].remove("the Riemann hypothesis")
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["unexpected"] = True
        mutations.append(payload)

        for index, payload in enumerate(mutations):
            with self.subTest(index=index):
                with self.assertRaises((ValueError, TypeError)):
                    validate_source_lock_payload(payload, ROOT)

    def test_locked_projection_bound_is_positive_and_tiny_at_first_point(self) -> None:
        values = self.report80["values"]
        self.assertEqual(self.report80["inputs"]["lambda_exact_fraction"], "5/2")
        self.assertEqual(self.report80["inputs"]["schedule_exponent"], 60000)
        self.assertGreater(values["exponent_margin"], 17)
        self.assertGreater(values["projection_sampling_over_d4_upper"], 0)
        self.assertLess(
            values["projection_sampling_over_d4_upper"], mp.mpf("5e-65")
        )
        self.assertGreater(values["negative_log10_relative_sampling_upper"], 64)
        self.assertEqual(self.report80["terminal_state"], "P0_INVALIDATED")
        self.assertFalse(self.report80["claims"]["equation_5_2_proved"])
        self.assertFalse(self.report80["claims"]["riemann_hypothesis_proof"])

    def test_precision_doubling_is_stable(self) -> None:
        high = projection_sampling_report(2, 160)
        for key, low_value in self.report80["values"].items():
            with self.subTest(key=key):
                high_value = high["values"][key]
                scale = max(abs(low_value), abs(high_value), mp.mpf(1))
                self.assertLess(abs(low_value - high_value) / scale, mp.mpf("1e-70"))

    def test_independent_replay_reconstructs_every_point(self) -> None:
        replay = self.replay_payload(copy.deepcopy(self.payload80))
        self.assertTrue(replay["replay_agrees"])
        self.assertTrue(replay["source_bytes_rechecked"])
        self.assertTrue(replay["transcendentals_reconstructed_from_exact_parameters"])
        self.assertFalse(replay["producer_booleans_trusted_as_evidence"])
        self.assertFalse(replay["zero_list_read"])
        self.assertFalse(replay["zeros_assumed_real_globally"])
        comparisons = replay["point_value_comparisons"]
        self.assertEqual(len(comparisons), 18)
        self.assertTrue(all(item["agrees"] for item in comparisons.values()))
        self.assertIn("share mpmath", replay["arithmetic_library_limitation"])

    def test_replay_rejects_schema_formula_schedule_provenance_and_value_tampering(
        self,
    ) -> None:
        mutations: list[dict[str, object]] = []
        for key, value in (
            ("schema", "unknown"),
            ("artifact_version", "0.16.0-unknown"),
            ("claim_class", "RH_PROOF"),
            ("terminal_state", "P0_EXACT_FORMULAS_PASS"),
        ):
            payload = copy.deepcopy(self.payload80)
            payload[key] = value
            mutations.append(payload)

        payload = copy.deepcopy(self.payload80)
        payload["formula_contract"]["generic_bound"] = "unspecified O(1)"
        mutations.append(payload)

        payload = copy.deepcopy(self.payload80)
        payload["inputs"]["schedule_K"] = 2399
        mutations.append(payload)

        payload = copy.deepcopy(self.payload80)
        payload["inputs"]["schedule_exponent"] = 59999
        mutations.append(payload)

        payload = copy.deepcopy(self.payload80)
        payload["source_lock"]["sha256"] = "0" * 64
        mutations.append(payload)

        payload = copy.deepcopy(self.payload80)
        payload["provenance_sha256"]["src/compact_absolute_sampling.py"] = "0" * 64
        mutations.append(payload)

        payload = copy.deepcopy(self.payload80)
        payload["values"]["relative_projection_jump"] = "1e-9000"
        mutations.append(payload)

        payload = copy.deepcopy(self.payload80)
        payload["values"]["exponent_margin"] = "-17"
        mutations.append(payload)

        for index, payload in enumerate(mutations):
            with self.subTest(index=index):
                with self.assertRaises(ReplayError):
                    self.replay_payload(payload)

    def test_replay_rejects_binary64_and_claim_promotions(self) -> None:
        payload = copy.deepcopy(self.payload80)
        payload["inputs"]["precision_decimal_digits"] = 80.0
        with self.assertRaises(ReplayError):
            self.replay_payload(payload)

        for claim in (
            "uniform_window_Bessel_bound",
            "reciprocal_defect_sum",
            "equation_5_2_proved",
            "locally_uniform_determinant_convergence",
            "riemann_hypothesis_proof",
        ):
            with self.subTest(claim=claim):
                payload = copy.deepcopy(self.payload80)
                payload["claims"][claim] = True
                with self.assertRaises(ReplayError):
                    self.replay_payload(payload)

    def test_replay_requires_strictly_higher_precision(self) -> None:
        with self.assertRaises(ReplayError):
            self.replay_payload(copy.deepcopy(self.payload80), 80)


if __name__ == "__main__":
    unittest.main()
