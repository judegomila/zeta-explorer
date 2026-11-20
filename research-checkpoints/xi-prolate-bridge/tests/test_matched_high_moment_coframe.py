from __future__ import annotations

import ast
import copy
import hashlib
import json
from pathlib import Path
import sys
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import matched_high_moment_coframe as producer  # noqa: E402
from verifier import matched_high_moment_coframe_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


class MatchedHighMomentCoframeTests(unittest.TestCase):
    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=self._bytes(payload))

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None
            else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    def test_p5_p9_base_and_doubled_precision_replay(self) -> None:
        expected = {5: (5, 7, 7, 8), 9: (6, 21, 22, 22)}
        for p in (5, 9):
            for dps in (80, 160):
                with self.subTest(p=p, dps=dps):
                    payload = producer.produce(p, dps)
                    self.assertEqual(payload, producer.produce(p, dps))
                    schedule = payload["certificate"]["schedule"]
                    self.assertEqual(
                        (
                            schedule["q"], schedule["N"],
                            schedule["r_plus_buffered"],
                            schedule["r_minus_buffered"],
                        ),
                        expected[p],
                    )
                    raw = self._bytes(payload)
                    report = verifier.replay(payload, producer_bytes=raw)
                    self.assertEqual(
                        report["schema"],
                        "xi-prolate-matched-high-moment-coframe-replay-v1",
                    )
                    self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                    self.assertEqual(
                        report["producer_binding"]["sha256"],
                        hashlib.sha256(raw).hexdigest(),
                    )
                    self.assertFalse(report["checks"]["producer_booleans_trusted"])
                    self.assertTrue(report["checks"]["formula_tree_independent"])

    def test_all_transcendental_intervals_nest_at_doubled_precision(self) -> None:
        paths = (
            ("certificate", "schedule", "transition_argument"),
            ("certificate", "one_sided_floor", "sqrt_five"),
            ("certificate", "one_sided_floor", "lower_bound"),
            ("certificate", "odd_pole_intervals", "ell"),
            ("certificate", "odd_pole_intervals", "L"),
            ("certificate", "odd_pole_intervals", "pole_norm_squared"),
            ("certificate", "odd_pole_intervals", "projection_tail_upper"),
            ("certificate", "odd_pole_intervals", "B_pole"),
            ("certificate", "odd_pole_intervals", "g_equals_kappa_L"),
            ("certificate", "odd_pole_intervals", "angle"),
        )
        for p in (5, 9):
            low = producer.produce(p, 80)
            high = producer.produce(p, 160)
            for path in paths:
                with self.subTest(p=p, path=".".join(path)):
                    left: object = low
                    right: object = high
                    for key in path:
                        left = left[key]  # type: ignore[index]
                        right = right[key]  # type: ignore[index]
                    lo80, hi80 = verifier._submitted_interval(left, "d80", 80)
                    lo160, hi160 = verifier._submitted_interval(right, "d160", 160)
                    self.assertLessEqual(lo80, lo160)
                    self.assertLessEqual(hi160, hi80)

    def test_source_lock_and_every_dependency_are_bound(self) -> None:
        payload = producer.produce(5, 80)
        lock = payload["source_lock"]
        self.assertEqual(lock["sha256"], verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(
            set(lock["dependency_hashes"]), verifier.EXPECTED_DEPENDENCY_PATHS
        )
        for relative, expected in lock["dependency_hashes"].items():
            self.assertEqual(
                hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected
            )

        with mock.patch.object(verifier, "EXPECTED_SOURCE_LOCK_SHA256", "0" * 64):
            self._reject(payload, "source-lock byte hash")
        with mock.patch.object(
            producer, "EXPECTED_DEPENDENCIES", {"P0_SOURCE_LOCK.json"}
        ):
            with self.assertRaisesRegex(ValueError, "dependency path inventory"):
                producer.produce(5, 80)

    def test_matched_counts_are_not_promoted_to_rank(self) -> None:
        for p in (5, 9):
            schedule = producer.produce(p, 80)["certificate"]["schedule"]
            self.assertGreaterEqual(schedule["r_plus_buffered"], schedule["N"])
            self.assertGreaterEqual(schedule["r_minus_buffered"], schedule["N"] + 1)
            self.assertFalse(schedule["buffered_count_forces_plus_row_rank"])
            self.assertFalse(schedule["buffered_count_forces_minus_row_rank"])
            self.assertEqual(schedule["unbuffered_forced_row_nullity_each_sector"], 2)

    def test_full_source_floor_is_not_transferred_to_matched_columns(self) -> None:
        for p, floor, upper in (
            (5, R(2, 625), R(25, 8)),
            (9, R(2, 6561), R(81, 8)),
        ):
            record = producer.produce(p, 80)["certificate"]["full_source"]
            self.assertEqual(record["row_floor_one_over_8_lambda_fourth"], floor)
            self.assertEqual(record["operator_upper_lambda_squared_over_2"], upper)
            self.assertTrue(record["floor_strictly_positive"])
            self.assertFalse(record["prescribed_matched_family_floor_inferred"])

    def test_source_gram_corrected_minor_floor(self) -> None:
        item = producer.produce(5, 80)["certificate"]["coframe_fixtures"]
        good = item["normalized_minor_pass"]
        self.assertEqual(good["source_gram_B"], [[R(2), R(0)], [R(0), R(8)]])
        self.assertEqual(
            good["source_gram_corrected_frame"],
            [[R(1, 2), R(0)], [R(0), R(1, 72)]],
        )
        self.assertNotEqual(good["raw_frame"], good["source_gram_corrected_frame"])
        self.assertEqual(good["normalized_minor_squared"], R(1, 144))
        self.assertEqual(good["relative_operator_upper_U"], R(1))
        self.assertEqual(good["relative_minor_gamma"], R(1, 144))
        self.assertEqual(good["actual_relative_floor"], R(1, 72))
        self.assertEqual(good["absolute_minor_floor_from_full_source"], R(1, 45000))

    def test_exact_minus_and_plus_source_grams(self) -> None:
        item = producer.produce(5, 80)["certificate"]["coframe_fixtures"]
        minus = item["minus_source_gram"]
        plus = item["plus_source_gram"]
        self.assertEqual(minus["determinant_direct"], R(49, 36))
        self.assertEqual(minus["determinant_direct"], minus["determinant_formula"])
        self.assertEqual(plus["determinant_direct"], R(539, 360))
        self.assertEqual(plus["determinant_direct"], plus["determinant_formula"])
        self.assertTrue(all(int(x["numerator"]) > 0 for x in minus["principal_minors"]))
        self.assertTrue(all(int(x["numerator"]) > 0 for x in plus["principal_minors"]))

    def test_zero_minor_and_nonpositive_floor_are_rejected(self) -> None:
        zero = producer.produce(5, 80)["certificate"]["coframe_fixtures"][
            "zero_minor_rejection"
        ]
        self.assertEqual(zero["row_rank"], 1)
        self.assertEqual(zero["normalized_minor_squared"], R(0))
        self.assertFalse(zero["passes"])

        payload = producer.produce(5, 80)
        payload["certificate"]["coframe_fixtures"]["zero_minor_rejection"][
            "passes"
        ] = True
        self._reject(payload, "coframe_fixtures")

        payload = producer.produce(5, 80)
        payload["certificate"]["coframe_fixtures"]["normalized_minor_pass"][
            "relative_minor_gamma"
        ] = R(0)
        self._reject(payload, "coframe_fixtures")

    def test_centered_moment_sharpness_and_orientation_obstruction(self) -> None:
        moments = producer.produce(5, 80)["certificate"]["centered_moment_floors"]
        bad = moments["sharp_bad"]
        good = moments["moment_twin_good"]
        positive = moments["positive_sharp"]
        self.assertEqual(bad["mean"], R(3, 2))
        self.assertEqual(good["mean"], R(3, 2))
        self.assertEqual(
            [record["C_2k"] for record in bad["moments"]],
            [R(6), R(18), R(66), R(258)],
        )
        self.assertEqual(
            [record["C_2k"] for record in bad["moments"]],
            [record["C_2k"] for record in good["moments"]],
        )
        self.assertTrue(all(record["lower_bound"] == R(-1, 2) for record in bad["moments"]))
        self.assertTrue(all(record["lower_bound"] == R(1) for record in positive["moments"]))
        obstruction = moments["same_even_moments_do_not_determine_lower_sign"]
        self.assertFalse(obstruction["positive_floor_inferred_from_shared_moments"])

    def test_moment_denominator_and_fixture_promotion_mutations_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["centered_moment_floors"]["sharp_bad"]["moments"][0][
            "complete_sign_denominator"
        ] = R(1)
        self._reject(payload, "centered_moment_floors")

        payload = producer.produce(5, 80)
        payload["claim_boundary"]["source_admissions"][
            "moment_fixture_promoted_to_physical_schedule"
        ] = True
        self._reject(payload, "claim_boundary")

    def test_one_sided_floor_reconstructed_and_cap_required(self) -> None:
        item = producer.produce(5, 80)["certificate"]["one_sided_floor"]
        self.assertEqual(item["M"], R(3))
        self.assertEqual(item["p"], 2)
        self.assertEqual(item["trace_deficit_power"], R(5))
        lo, hi = verifier._submitted_interval(item["lower_bound"], "one-sided", 80)
        self.assertGreater(lo, 0)
        self.assertLess(hi, 1)

        payload = producer.produce(5, 80)
        payload["certificate"]["one_sided_floor"]["M"] = R(2)
        self._reject(payload, "one_sided exact")

    def test_absolute_prime_moments_do_not_determine_source_sign(self) -> None:
        item = producer.produce(5, 80)["certificate"]["countermodels"][
            "absolute_prime_sign"
        ]
        self.assertEqual(item["locked_b_minus_2S"], [R(-3), R(3)])
        self.assertEqual(item["sign_flipped_b_plus_2S"], [R(13), R(7)])
        self.assertEqual(
            [record["P_2k"] for record in item["absolute_even_prime_moments"]],
            [R(17), R(257), R(4097), R(65537)],
        )
        self.assertFalse(item["prime_sign_determined_by_absolute_moments"])

    def test_continuous_injectivity_does_not_give_projected_rank(self) -> None:
        item = producer.produce(5, 80)["certificate"]["projection_rank_model"]
        self.assertEqual(item["lifted_determinant"], R(1))
        self.assertEqual(item["lifted_rank"], 3)
        self.assertEqual(item["projected_rank"], 2)
        self.assertEqual(item["right_null_witness"], [[R(1)], [R(1)], [R(-1)]])
        self.assertEqual(item["projected_witness_action"], [[R(0)], [R(0)], [R(0)]])
        self.assertNotEqual(item["lifted_witness_action"], [[R(0)], [R(0)], [R(0)]])
        self.assertFalse(item["continuous_injectivity_implies_projected_row_rank"])

    def test_odd_pole_lower_bound_and_necessary_angle_only(self) -> None:
        p5 = producer.produce(5, 80)["certificate"]["odd_pole_intervals"]
        p9 = producer.produce(9, 80)["certificate"]["odd_pole_intervals"]
        for item in (p5, p9):
            b_lo, _ = verifier._submitted_interval(item["B_pole"], "B", 80)
            angle_lo, angle_hi = verifier._submitted_interval(item["angle"], "angle", 80)
            self.assertGreater(b_lo, 0)
            self.assertGreater(angle_lo, 0)
            self.assertGreater(angle_hi, angle_lo)
            self.assertIn("necessary", item["logical_role"])
            self.assertIn("not a sufficient", item["logical_role"])
        self.assertEqual(p5["angle_classification_against_one"], "at_least_one")
        self.assertEqual(p9["angle_classification_against_one"], "strictly_below_one")

    def test_odd_pole_omission_tail_and_role_promotions_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["claim_boundary"]["source_admissions"]["odd_negative_pole_omitted"] = True
        self._reject(payload, "claim_boundary")

        payload = producer.produce(5, 80)
        payload["certificate"]["odd_pole_intervals"]["projection_tail_upper"] = payload[
            "certificate"
        ]["odd_pole_intervals"]["B_pole"]
        self._reject(payload, "projection_tail_upper")

        payload = producer.produce(5, 80)
        payload["certificate"]["odd_pole_intervals"]["logical_role"] = (
            "eta_pole below angle is a sufficient capture certificate"
        )
        self._reject(payload, "logical role")

    def test_locked_convention_mutations_are_rejected(self) -> None:
        mutations = {
            "fourier_sign": "fhat(t)=integral f(y)*exp(+i*t*y)dy",
            "prime_endpoint": "only prime powers n<lambda^2 are retained",
            "prime_sign": "m_lambda=2*theta_prime+2*S_lambda",
            "inversion": "reflection omitted",
            "matched_schedule": "N=ceil(lambda)",
            "source_normalization": "replace each source by a unit vector",
        }
        for key, value in mutations.items():
            with self.subTest(key=key):
                payload = producer.produce(5, 80)
                payload["source_conventions"]["locked_conventions"][key] = value
                self._reject(payload, "source_conventions")

    def test_unit_source_normalization_regression_is_rejected(self) -> None:
        payload = producer.produce(5, 80)
        self.assertFalse(
            payload["claim_boundary"]["source_admissions"][
                "unit_source_normalization_substituted"
            ]
        )
        payload["claim_boundary"]["source_admissions"][
            "unit_source_normalization_substituted"
        ] = True
        self._reject(payload, "claim_boundary")

    def test_all_source_admission_promotions_are_rejected(self) -> None:
        base = producer.produce(5, 80)
        admissions = base["claim_boundary"]["source_admissions"]
        self.assertTrue(admissions)
        self.assertFalse(any(admissions.values()))
        for key in admissions:
            with self.subTest(key=key):
                payload = producer.produce(5, 80)
                payload["claim_boundary"]["source_admissions"][key] = True
                self._reject(payload)

    def test_claim_and_check_bool_integer_spoofs_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["checks"]["zero_minor_rejected"] = 1
        self._reject(payload, "certificate checks")

        payload = producer.produce(5, 80)
        payload["claim_boundary"]["source_admissions"]["rh_proved"] = 0
        self._reject(payload, "claim_boundary")

        payload = producer.produce(5, 80)
        payload["certificate"]["full_source"][
            "prescribed_matched_family_floor_inferred"
        ] = 0
        self._reject(payload, "full_source")

    def test_wrong_inputs_and_binary64_parameters_are_rejected(self) -> None:
        for p in (True, 5.0, 4, 3):
            with self.subTest(p=p):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, 80)  # type: ignore[arg-type]
        for dps in (False, 80.0, 49):
            with self.subTest(dps=dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(5, dps)  # type: ignore[arg-type]

        payload = producer.produce(5, 80)
        payload["inputs"]["lambda_denominator"] = 1
        self._reject(payload, "schedule changed")

    def test_raw_duplicate_keys_binary64_and_noncanonical_rationals_rejected(self) -> None:
        payload = producer.produce(5, 80)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)

        duplicate = self._bytes(payload).replace(
            b'{\n  "arithmetic_libraries":',
            b'{\n  "schema": "duplicate",\n  "arithmetic_libraries":',
            1,
        )
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(duplicate, "adversarial")

        binary = copy.deepcopy(payload)
        binary["inputs"]["dps"] = 80.0
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads(self._bytes(binary), "adversarial")

        noncanonical = producer.produce(5, 80)
        noncanonical["certificate"]["schedule"]["lambda"]["numerator"] = "05"
        self._reject(noncanonical, "noncanonical")

    def test_interval_decimal_lie_reversal_and_excess_width_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["schedule"]["transition_argument"]["decimal"][0] = "0"
        self._reject(payload, "decimal text")

        payload = producer.produce(5, 80)
        interval = payload["certificate"]["schedule"]["transition_argument"]
        interval["dyadic"]["lower"], interval["dyadic"]["upper"] = (
            interval["dyadic"]["upper"], interval["dyadic"]["lower"]
        )
        self._reject(payload)

        payload = producer.produce(5, 80)
        interval = payload["certificate"]["one_sided_floor"]["lower_bound"]
        interval["dyadic"]["lower"] = [0, "0", 0, 0]
        interval["decimal"][0] = "0.0"
        self._reject(payload, "excessively wide")

    def test_payload_contains_no_binary_floats(self) -> None:
        def visit(value: object) -> None:
            self.assertNotIsInstance(value, float)
            if isinstance(value, dict):
                for child in value.values():
                    visit(child)
            elif isinstance(value, list):
                for child in value:
                    visit(child)

        visit(producer.produce(5, 80))

    def test_independent_paths_have_no_cross_import_or_environment_access(self) -> None:
        sources = {
            "producer": (ROOT / "src" / "matched_high_moment_coframe.py").read_text(
                encoding="utf-8"
            ),
            "verifier": (
                ROOT / "verifier" / "matched_high_moment_coframe_replay.py"
            ).read_text(encoding="utf-8"),
        }
        imports: dict[str, set[str]] = {}
        for label, source in sources.items():
            tree = ast.parse(source)
            names: set[str] = set()
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    names.update(alias.name for alias in node.names)
                elif isinstance(node, ast.ImportFrom) and node.module:
                    names.add(node.module)
                if isinstance(node, ast.Attribute):
                    self.assertNotEqual(node.attr, "environ")
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
                    self.assertNotIn(node.func.attr, {"getenv", "environ"})
            imports[label] = names
            self.assertNotIn("os", names)
        self.assertNotIn("matched_high_moment_coframe_replay", imports["producer"])
        self.assertNotIn("matched_high_moment_coframe", imports["verifier"])
        self.assertNotIn("src.matched_high_moment_coframe", imports["verifier"])


if __name__ == "__main__":
    unittest.main()
