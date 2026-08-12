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

import full_source_coframe_rank as producer  # noqa: E402
from verifier import full_source_coframe_rank_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


class FullSourceCoframeRankTests(unittest.TestCase):
    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=self._bytes(payload))

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    @staticmethod
    def _models(p: int = 5) -> dict[str, object]:
        return producer.produce(p, 80)["certificate"]["exact_regressions"]

    def test_p5_p9_base_and_doubled_precision_replay(self) -> None:
        expected_q = {5: 5, 9: 6}
        for p in (5, 9):
            for dps in (80, 160):
                with self.subTest(p=p, dps=dps):
                    payload = producer.produce(p, dps)
                    self.assertEqual(payload, producer.produce(p, dps))
                    self.assertEqual(payload["certificate"]["schedule"]["q"], expected_q[p])
                    raw = self._bytes(payload)
                    report = verifier.replay(payload, producer_bytes=raw)
                    self.assertEqual(
                        report["result"], "FULL_SOURCE_COFRAME_RANK_COMPONENT_REPLAY_PASS",
                    )
                    self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                    self.assertEqual(
                        report["producer_binding"]["sha256"], hashlib.sha256(raw).hexdigest(),
                    )
                    self.assertFalse(report["producer_pass_boolean_trusted"])

    def test_doubled_precision_transition_intervals_are_nested(self) -> None:
        for p in (5, 9):
            lower = producer.produce(p, 80)
            higher = producer.produce(p, 160)
            interval_80 = verifier._submitted_interval(
                lower["certificate"]["transition_ceiling_argument"], "dps80", 80,
            )
            interval_160 = verifier._submitted_interval(
                higher["certificate"]["transition_ceiling_argument"], "dps160", 160,
            )
            self.assertLessEqual(interval_80[0], interval_160[0])
            self.assertLessEqual(interval_160[1], interval_80[1])
            self.assertEqual(lower["certificate"]["schedule"]["q"], higher["certificate"]["schedule"]["q"])

    def test_full_source_and_non_effective_prefix_bounds(self) -> None:
        for p, full_floor, upper, prefix in (
            (5, R(2, 625), R(25, 8), R(1, 625)),
            (9, R(2, 6561), R(81, 8), R(1, 6561)),
        ):
            bounds = producer.produce(p, 80)["certificate"]["full_source_bounds"]
            self.assertEqual(bounds["mobius_elementary_upper"], R(p))
            self.assertEqual(bounds["full_source_elementary_row_floor"], full_floor)
            self.assertEqual(bounds["full_source_operator_upper"], upper)
            self.assertEqual(bounds["mixed_prefix_relative_gamma"], R(1, 2))
            self.assertEqual(bounds["mixed_prefix_non_effective_row_floor"], prefix)
            self.assertFalse(bounds["mixed_prefix_terminal_label_effective"])
            self.assertTrue(bounds["mixed_prefix_uses_both_residue_classes"])

    def test_sharp_gamma_half_psd_equality_is_accepted(self) -> None:
        sharp = self._models()["sharp_relative_floor"]
        model = sharp["model"]
        self.assertEqual(
            model["full_frame_R"],
            [[R(7, 10), R(1, 5)], [R(1, 5), R(8, 15)]],
        )
        self.assertEqual(model["source_metric"], [[R(2), R(0), R(0)], [R(0), R(3), R(0)], [R(0), R(0), R(5)]])
        self.assertEqual(model["gram_corrected_frame"], [[R(1, 2), R(0)], [R(0), R(1, 3)]])
        passed = sharp["gamma_sharp_pass"]
        self.assertEqual(passed["gamma"], R(1, 2))
        self.assertEqual(passed["difference"], [[R(3, 20), R(-1, 10)], [R(-1, 10), R(1, 15)]])
        self.assertTrue(passed["difference_is_psd"])
        self.assertTrue(passed["determinant_zero_equality"])
        self.assertTrue(passed["accepted"])

    def test_gamma_zero_and_above_half_are_rejected(self) -> None:
        sharp = self._models()["sharp_relative_floor"]
        zero = sharp["gamma_zero_rejection"]
        above = sharp["gamma_above_rejection"]
        self.assertEqual(zero["gamma"], R(0))
        self.assertTrue(zero["difference_is_psd"])
        self.assertFalse(zero["accepted"])
        self.assertEqual(above["gamma"], R(3, 5))
        self.assertFalse(above["difference_is_psd"])
        self.assertFalse(above["accepted"])

    def test_equal_count_rank_obstruction_has_exact_left_null(self) -> None:
        obstruction = self._models()["count_not_rank"]
        self.assertTrue(obstruction["columns_equal_rows"])
        self.assertFalse(obstruction["full_row_rank"])
        self.assertEqual(
            obstruction["model"]["physical_columns_W"],
            [[R(1), R(1)], [R(0), R(0)]],
        )
        self.assertEqual(obstruction["left_null_witness"], [[R(0)], [R(1)]])
        self.assertEqual(obstruction["left_null_action"], [[R(0)], [R(0)]])

    def test_coordinate_change_preserves_corrected_not_raw_frame(self) -> None:
        model = self._models()["coordinate_change"]
        self.assertEqual(model["change_determinant"], R(2, 3))
        self.assertTrue(model["corrected_frame_preserved"])
        self.assertTrue(model["raw_determinant_changed"])
        self.assertEqual(model["original"]["raw_frame_determinant"], R(1))
        self.assertEqual(model["changed"]["raw_frame_determinant"], R(4, 9))
        self.assertEqual(
            model["original"]["gram_corrected_frame"],
            model["changed"]["gram_corrected_frame"],
        )

    def test_redundant_columns_use_exact_moore_penrose_inverse(self) -> None:
        model = self._models()["redundant_columns_pseudoinverse"]
        self.assertEqual(model["source_gram_G"], [
            [R(2), R(0), R(2)],
            [R(0), R(3), R(3)],
            [R(2), R(3), R(5)],
        ])
        self.assertEqual(model["source_gram_rank"], 2)
        self.assertEqual(model["source_gram_determinant"], R(0))
        self.assertEqual(model["exact_null_witness"], [[R(-1)], [R(-1)], [R(1)]])
        self.assertEqual(model["null_action"], [[R(0)], [R(0)], [R(0)]])
        self.assertEqual(model["G_dagger"], [
            [R(7, 27), R(-5, 27), R(2, 27)],
            [R(-5, 27), R(11, 54), R(1, 54)],
            [R(2, 27), R(1, 54), R(5, 54)],
        ])
        self.assertTrue(model["penrose"]["all_four_hold"])
        self.assertTrue(all(model["penrose"]["equations"].values()))
        self.assertTrue(model["corrected_frame_equals_base"])
        self.assertFalse(model["ordinary_inverse_of_singular_gram_used"])

    def test_producer_and_replay_never_apply_ordinary_inverse_to_singular_gram(self) -> None:
        singular = producer._exact_regressions()["redundant_columns_pseudoinverse"]["source_gram_G"]
        producer_inverse = producer._inverse

        def producer_guard(matrix: object) -> object:
            self.assertNotEqual(matrix, singular)
            return producer_inverse(matrix)  # type: ignore[arg-type]

        with mock.patch.object(producer, "_inverse", side_effect=producer_guard):
            rebuilt = producer._exact_regressions()
            self.assertTrue(rebuilt["redundant_columns_pseudoinverse"]["penrose"]["all_four_hold"])

        verifier_inverse = verifier._adjugate_inverse

        def verifier_guard(matrix: object) -> object:
            self.assertNotEqual(matrix, singular)
            return verifier_inverse(matrix)  # type: ignore[arg-type]

        with mock.patch.object(verifier, "_adjugate_inverse", side_effect=verifier_guard):
            replayed = verifier._rebuild_models()
            self.assertTrue(replayed["redundant_columns_pseudoinverse"]["penrose"]["all_four_hold"])

    def test_epsilon_full_rank_has_no_uniform_floor(self) -> None:
        model = self._models()["epsilon_full_rank_no_uniform_floor"]
        self.assertTrue(model["all_cases_full_rank"])
        self.assertTrue(model["floor_decreases"])
        self.assertFalse(model["uniform_positive_floor_claimed"])
        self.assertEqual([case["exact_floor"] for case in model["cases"]], [R(1, 4), R(1, 25)])

    def test_row_and_column_gram_traps_are_both_present(self) -> None:
        traps = self._models()["row_vs_column_gram"]
        wide = traps["row_full_column_singular"]
        self.assertEqual(wide["row_gram_rank"], 2)
        self.assertEqual(wide["column_gram_rank"], 2)
        self.assertTrue(wide["row_coframe"])
        self.assertFalse(wide["column_gram_positive_definite"])
        tall = traps["column_full_row_singular"]
        self.assertEqual(tall["row_gram_rank"], 2)
        self.assertEqual(tall["column_gram_rank"], 2)
        self.assertFalse(tall["row_coframe"])
        self.assertTrue(tall["column_gram_positive_definite"])

    def test_special_prolate_gram_whitened_frame_is_below_raw(self) -> None:
        model = self._models()["special_prolate_gram"]
        self.assertEqual(model["v"], [[R(1)], [R(2)]])
        self.assertEqual(model["D_equals_I_plus_vv_star"], [[R(2), R(2)], [R(2), R(5)]])
        self.assertEqual(model["D_inverse"], [[R(5, 6), R(-1, 3)], [R(-1, 3), R(1, 3)]])
        self.assertEqual(model["whitened_frame"], [[R(1, 2), R(0)], [R(0), R(1, 3)]])
        self.assertTrue(model["whitened_below_raw"])

    def test_p5_schedule_counts_and_nullities(self) -> None:
        schedule = producer.produce(5, 80)["certificate"]["schedule"]
        self.assertEqual((schedule["m"], schedule["q"], schedule["n_star"]), (7, 5, 36))
        self.assertEqual((schedule["r_plus_buffered"], schedule["r_minus_buffered"]), (7, 8))
        self.assertEqual(schedule["matched_buffered"]["plus_count_forced_row_nullity_lower_bound"], 0)
        self.assertEqual(schedule["matched_buffered"]["minus_count_forced_row_nullity_lower_bound"], 0)
        self.assertFalse(schedule["matched_buffered"]["count_proves_row_rank"])
        self.assertEqual(schedule["triple_schedule"], {
            "N": 21,
            "plus_count_forced_row_nullity_lower_bound": 14,
            "minus_count_forced_row_nullity_lower_bound": 13,
        })

    def test_p9_exercises_q6_and_exact_counts(self) -> None:
        schedule = producer.produce(9, 80)["certificate"]["schedule"]
        self.assertEqual((schedule["m"], schedule["q"], schedule["n_star"]), (21, 6, 93))
        self.assertEqual((schedule["r_plus_buffered"], schedule["r_minus_buffered"]), (22, 22))
        self.assertEqual(schedule["triple_schedule"], {
            "N": 63,
            "plus_count_forced_row_nullity_lower_bound": 41,
            "minus_count_forced_row_nullity_lower_bound": 41,
        })

    def test_unbuffered_and_plus_anchor_boundaries(self) -> None:
        for p in (5, 9):
            schedule = producer.produce(p, 80)["certificate"]["schedule"]
            unbuffered = schedule["matched_unbuffered"]
            self.assertEqual(unbuffered["r_plus_unbuffered"], schedule["m"] - 2)
            self.assertEqual(unbuffered["r_minus_unbuffered"], schedule["m"] - 2)
            self.assertEqual(unbuffered["plus_count_forced_row_nullity_lower_bound"], 2)
            self.assertEqual(unbuffered["minus_count_forced_row_nullity_lower_bound"], 2)
            anchor = schedule["plus_anchor"]
            self.assertTrue(anchor["projected_nonzero_hypothesis_required"])
            self.assertFalse(anchor["projected_nonzero_proved"])
            self.assertEqual(anchor["deflated_row_dimension_rule_conditional_on_hypothesis"], "N")
            self.assertEqual(anchor["matched_N"], schedule["m"])

    def test_locked_exponential_schedule_remains_symbolic(self) -> None:
        for p, exponent in ((5, 60000), (9, 194400)):
            payload = producer.produce(p, 80)
            exponential = payload["certificate"]["schedule"]["locked_exponential_schedule"]
            self.assertEqual(exponential["N_symbolic"], {
                "base": 2, "exponent": exponent, "expression": "2^exponent",
            })
            self.assertTrue(exponential["plus_nullity_symbolic"]["strictly_positive"])
            self.assertTrue(exponential["minus_nullity_symbolic"]["strictly_positive"])
            self.assertFalse(exponential["decimal_expansion_serialized"])
            self.assertLess(len(self._bytes(payload)), 100000)

    def test_source_gram_identity_substitution_and_cached_matrix_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["sharp_relative_floor"]["model"]["source_metric"] = [
            [R(1), R(0), R(0)], [R(0), R(1), R(0)], [R(0), R(0), R(1)],
        ]
        self._reject(payload, "rebuilt regressions")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["sharp_relative_floor"]["model"]["full_frame_R"][0][0] = R(1)
        self._reject(payload, "rebuilt regressions")

    def test_raw_determinant_and_count_promotions_are_rejected(self) -> None:
        for key in (
            "raw_determinant_promoted_to_invariant_floor",
            "count_promoted_to_rank",
            "projected_plus_anchor_nonzero_claimed",
        ):
            payload = producer.produce(5, 80)
            payload["source_admissions"][key] = True
            with self.subTest(key=key):
                self._reject(payload, "source_admissions")

    def test_wrong_q_inversion_sign_and_interval_endpoints_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["schedule"]["q"] = 6
        self._reject(payload, "schedule")

        payload = producer.produce(5, 80)
        payload["locked_conventions"]["inversion"] = "Jg(u)=-g(u^(-1))"
        self._reject(payload, "locked_conventions")

        payload = producer.produce(5, 80)
        endpoint = payload["certificate"]["transition_ceiling_argument"]["dyadic"]["lower"]
        endpoint[0] = 1
        self._reject(payload)

    def test_gamma_boundary_mutations_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["sharp_relative_floor"]["gamma_zero_rejection"]["accepted"] = True
        self._reject(payload, "rebuilt regressions")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["sharp_relative_floor"]["gamma_sharp_pass"]["gamma"] = R(3, 5)
        self._reject(payload, "rebuilt regressions")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["sharp_relative_floor"]["gamma_above_rejection"]["accepted"] = True
        self._reject(payload, "rebuilt regressions")

    def test_redundant_pseudoinverse_mutations_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        model = payload["certificate"]["exact_regressions"]["redundant_columns_pseudoinverse"]
        model["G_dagger"][0][0] = R(1)
        self._reject(payload, "rebuilt regressions")

        payload = producer.produce(5, 80)
        model = payload["certificate"]["exact_regressions"]["redundant_columns_pseudoinverse"]
        model["penrose"]["equations"]["G_Gdagger_G_equals_G"] = False
        self._reject(payload, "rebuilt regressions")

        payload = producer.produce(5, 80)
        model = payload["certificate"]["exact_regressions"]["redundant_columns_pseudoinverse"]
        model["ordinary_inverse_of_singular_gram_used"] = True
        self._reject(payload, "rebuilt regressions")

    def test_nested_bool_integer_spoofs_are_rejected_type_strictly(self) -> None:
        cases = []

        admissions = producer.produce(5, 80)
        admissions["source_admissions"]["prescribed_buffered_physical_coframe_claimed"] = 0
        cases.append(("admissions_false_to_zero", admissions, "source_admissions"))

        theorem = producer.produce(5, 80)
        theorem["certificate"]["theorem_checks"]["gamma_zero_rejected"] = 1
        cases.append(("theorem_true_to_one", theorem, "theorem checks"))

        anchor = producer.produce(5, 80)
        anchor["certificate"]["schedule"]["plus_anchor"]["projected_nonzero_proved"] = 0
        cases.append(("anchor_false_to_zero", anchor, "schedule"))

        count_rank = producer.produce(5, 80)
        count_rank["certificate"]["schedule"]["matched_buffered"]["count_proves_row_rank"] = 0
        cases.append(("count_false_to_zero", count_rank, "schedule"))

        nullity = producer.produce(5, 80)
        nullity["certificate"]["schedule"]["matched_buffered"]["plus_count_forced_row_nullity_lower_bound"] = False
        cases.append(("nullity_zero_to_false", nullity, "schedule"))

        for label, payload, pattern in cases:
            with self.subTest(label=label):
                self._reject(payload, pattern)

        promoted = copy.deepcopy(producer.SOURCE_ADMISSIONS)
        promoted["prescribed_buffered_physical_coframe_claimed"] = 0  # type: ignore[assignment]
        with self.assertRaisesRegex(ValueError, "claim boundary"):
            producer.validate_source_admissions(promoted)

    def test_raw_bytes_duplicate_keys_binary64_and_noncanonical_rationals_rejected(self) -> None:
        payload = producer.produce(5, 80)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)

        raw = self._bytes(payload)
        duplicate = raw.replace(b'{\n  "arithmetic":', b'{\n  "schema": "duplicate",\n  "arithmetic":', 1)
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(duplicate, "adversarial artifact")

        binary = copy.deepcopy(payload)
        binary["input"]["dps"] = 80.0
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads(self._bytes(binary), "adversarial artifact")

        noncanonical = producer.produce(5, 80)
        noncanonical["certificate"]["schedule"]["lambda"]["numerator"] = "05"
        self._reject(noncanonical, "noncanonical")

    def test_nonexact_and_off_schedule_inputs_are_rejected(self) -> None:
        for value in (True, 5.0, 4, 3):
            with self.subTest(p=value):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(value, 80)  # type: ignore[arg-type]
        for value in (False, 80.0, 49):
            with self.subTest(dps=value):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(5, value)  # type: ignore[arg-type]

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

    def test_source_pins_and_every_admission_are_enforced(self) -> None:
        payload = producer.produce(5, 80)
        self.assertFalse(any(payload["source_admissions"].values()))
        self.assertIn("prescribed_buffered_physical_coframe_claimed", payload["source_admissions"])
        self.assertNotIn("physical_coframe_claimed", payload["source_admissions"])
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertIn(
            "full_source_elementary_floor_constant_reconstructed",
            payload["certificate"]["theorem_checks"],
        )
        self.assertNotIn(
            "full_source_right_inverse_floor_reconstructed",
            payload["certificate"]["theorem_checks"],
        )
        for value in producer.PINNED_HASHES.values():
            self.assertRegex(value, r"^[0-9a-f]{64}$")

        for field in producer.SOURCE_ADMISSIONS:
            changed = producer.produce(5, 80)
            changed["source_admissions"][field] = True
            with self.subTest(field=field):
                self._reject(changed, "source_admissions")

        for field in producer.SOURCE_ADMISSIONS:
            promoted = copy.deepcopy(producer.SOURCE_ADMISSIONS)
            promoted[field] = True
            with self.subTest(producer_field=field):
                with self.assertRaisesRegex(ValueError, "claim boundary"):
                    producer.validate_source_admissions(promoted)

    def test_source_pin_inventory_rejects_placeholders_and_missing_note(self) -> None:
        with mock.patch.object(
            producer,
            "PINNED_HASHES",
            {producer.NOTE: "TO_BE_FINALIZED", producer.LOCK: producer.PINNED_HASHES[producer.LOCK]},
        ):
            with self.assertRaisesRegex(ValueError, "invalid finalized source pin"):
                producer._verified_source_hashes()
        with mock.patch.object(
            verifier,
            "PINNED_HASHES",
            {verifier.LOCK: verifier.PINNED_HASHES[verifier.LOCK]},
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "exactly the note and lock"):
                verifier._source_hashes()

    def test_independent_paths_have_no_cross_import_or_environment_access(self) -> None:
        sources = {
            "producer": (ROOT / "src" / "full_source_coframe_rank.py").read_text(encoding="utf-8"),
            "verifier": (ROOT / "verifier" / "full_source_coframe_rank_replay.py").read_text(encoding="utf-8"),
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
        self.assertNotIn("full_source_coframe_rank_replay", imports["producer"])
        self.assertNotIn("full_source_coframe_rank", imports["verifier"])
        self.assertNotIn("src.full_source_coframe_rank", imports["verifier"])


if __name__ == "__main__":
    unittest.main()
