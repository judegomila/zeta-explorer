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
sys.path.insert(0, str(ROOT / "src"))

import block_quotient_action as producer  # noqa: E402
from verifier import block_quotient_action_replay as verifier  # noqa: E402


class BlockQuotientActionTests(unittest.TestCase):
    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode()

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        raw = self._bytes(payload)
        return verifier.replay(payload, producer_bytes=raw)

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern
            else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    def test_p5_p7_replay_at_base_and_doubled_precision(self) -> None:
        cases = ((5, 36, 8, 6), (7, 60, 14, 12))
        for p, n_star, modal_limit, rest_count in cases:
            low = producer.produce(p, 80)
            high = producer.produce(p, 160)
            for payload in (low, high):
                report = self._replay(payload)
                self.assertEqual(
                    report["status"],
                    "BLOCK_QUOTIENT_ACTION_COMPONENT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertTrue(report["checks"]["all_interval_pairs_overlap"])
                self.assertFalse(report["checks"]["producer_booleans_trusted"])
                exact = payload["certificate"]["exact"]
                self.assertEqual(exact["n_star"], n_star)
                self.assertEqual(exact["sampling_modal_row_limit"], modal_limit)
                self.assertEqual(exact["physical_rest_column_count"], rest_count)
                raw = self._bytes(payload)
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )
            for name in low["certificate"]["outward_intervals"]:
                a = verifier._interval(
                    low["certificate"]["outward_intervals"][name], name, 80
                )
                b = verifier._interval(
                    high["certificate"]["outward_intervals"][name], name, 160
                )
                self.assertLessEqual(a[0], b[1])
                self.assertLessEqual(b[0], a[1])

    def test_exact_regressions_reconstruct_action_and_counterexamples(self) -> None:
        payload = producer.produce(5, 80)
        regressions = payload["certificate"]["exact_regressions"]
        saturation = regressions["block_action_saturation"]
        self.assertEqual(saturation["low_Gamma"], {"numerator": "1", "denominator": "1"})
        self.assertEqual(saturation["full_Gamma"], {"numerator": "10", "denominator": "9"})
        nontrivial = regressions["nontrivial_range_action"]
        self.assertEqual(nontrivial["low_Gamma"]["numerator"], "1268")
        self.assertEqual(nontrivial["squared_sum_upper"]["numerator"], "1296")
        metric = regressions["full_metric_substitution_counterexample"]
        self.assertEqual(metric["block_diagonal_Gamma"]["numerator"], "1")
        self.assertEqual(metric["full_metric_Gamma"]["numerator"], "4")
        complement = regressions["physical_fourier_complement_counterexample"]
        self.assertEqual(complement["physical_complement_floor"]["numerator"], "-1")
        self._replay(payload)

    def test_nonexact_and_wrong_schedule_inputs_are_rejected(self) -> None:
        for p in (True, 5.0, 4, 6):
            with self.subTest(p=p):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, 80)  # type: ignore[arg-type]
        for dps in (False, 80.0, 49):
            with self.subTest(dps=dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(5, dps)  # type: ignore[arg-type]

    def test_exact_bytes_duplicate_keys_and_binary64_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        raw = self._bytes(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)
        mutated = copy.deepcopy(payload)
        mutated["input"]["lambda_numerator"] = 7
        with self.assertRaisesRegex(verifier.ReplayError, "do not decode exactly"):
            verifier.replay(mutated, producer_bytes=raw)
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(b'{"p":5,"p":7}', "bad")
        payload["input"]["lambda_numerator"] = 5.0
        self._reject(payload, "non-integer JSON number|binary64")

    def test_inventory_lambda_and_count_mutations_are_rejected(self) -> None:
        mutations = {
            "lambda_squared": {"numerator": "625", "denominator": "16"},
            "n_star": 37,
            "sampling_modal_row_limit": 9,
            "physical_rest_column_count": 8,
            "physical_rest_targets": [12, 16],
            "ground_integral_squared_lower": {"numerator": "1", "denominator": "25"},
            "arithmetic_map_norm_squared_factor": {"numerator": "625", "denominator": "32"},
            "fixed_index_limits_effective": True,
        }
        for field, value in mutations.items():
            payload = producer.produce(5, 80)
            payload["certificate"]["exact"][field] = value
            with self.subTest(field=field):
                self._reject(payload, "differs from reconstruction")

    def test_cross_terms_metric_and_complement_shortcuts_are_rejected(self) -> None:
        admission_mutations = {
            "block_diagonal_metric_used": False,
            "full_metric_substituted": True,
            "cross_block_sampling_terms_retained": False,
            "low_high_sampling_terms_retained": False,
            "squared_sum_replaced_by_maximum": True,
            "physical_complement_identified_with_fourier_high": True,
            "qualitative_limits_used_as_finite_bounds": True,
        }
        for field, value in admission_mutations.items():
            payload = producer.produce(5, 80)
            payload["source_admissions"][field] = value
            with self.subTest(field=field):
                self._reject(payload, "source_admissions")

        payload = producer.produce(5, 80)
        payload["locked_formulas"]["low_action"] = "Gamma_L<=max(C_8*M_8,C_R*M_R)"
        self._reject(payload, "locked_formulas")

        payload = producer.produce(5, 80)
        payload["locked_formulas"]["arithmetic_map"] = (
            "norm(T*f)^2<=lambda^4*norm(f)^2/2 for additive-even f"
        )
        self._reject(payload, "locked_formulas")

        payload = producer.produce(5, 80)
        payload["locked_formulas"]["transition_point"] = (
            "V0=lambda^(-1)+8*pi*lambda and abs(rho_t)^2<=V0"
        )
        self._reject(payload, "locked_formulas")

    def test_regression_results_are_reconstructed_not_trusted(self) -> None:
        paths = (
            ("block_action_saturation", "squared_sum_upper", "2"),
            ("nontrivial_range_action", "low_Gamma", "1296"),
            ("full_metric_substitution_counterexample", "full_metric_Gamma", "1"),
            ("physical_fourier_complement_counterexample", "physical_complement_floor", "1"),
            ("fixed_index_coefficient_ledger", "rho8_squared_limit", "1"),
        )
        for section, field, numerator in paths:
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_regressions"][section][field]["numerator"] = numerator
            with self.subTest(section=section, field=field):
                self._reject(payload, "exact regression reconstruction")

        payload = producer.produce(5, 80)
        payload["certificate"]["cached_quotient_matrix"] = [[1]]
        self._reject(payload, "certificate inventory")

    def test_finite_product_and_qualitative_limit_promotions_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["finite_product_serialized"] = "M_R using a guessed d_12"
        self._reject(payload, "finite rest product")

        payload = producer.produce(5, 80)
        payload["certificate"]["fixed_index_limit_classification"] = "finite_bound"
        self._reject(payload, "promoted")

        payload = producer.produce(5, 80)
        payload["claim_scope"]["proved"].append("equation (5.2) of DIRECT_RH_ATTACK.md")
        self._reject(payload, "claim_scope")

        payload = producer.produce(5, 80)
        payload["source_admissions"]["signed_weil_floor_claimed"] = True
        self._reject(payload, "source_admissions")

    def test_raw_interval_claim_status_and_source_hash_mutations_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        endpoint = payload["certificate"]["outward_intervals"]["d4_upper"]["dyadic"]["upper"]
        endpoint[3] += 1
        self._reject(payload, "bit count|canonical")

        payload = producer.produce(5, 80)
        broad = payload["certificate"]["outward_intervals"]["V0"]
        broad["dyadic"] = {
            "lower": [0, "0", 0, 0],
            "upper": [0, "25", 2, 5],
        }
        broad["decimal"] = ["0.0", "100.0"]
        self._reject(payload, "precision-tight")

        payload = producer.produce(5, 80)
        payload["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        self._reject(payload, "terminal_state")

        payload = producer.produce(5, 80)
        payload["source_hashes"][producer.NOTE] = "0" * 64
        self._reject(payload, "source hash")

        payload = producer.produce(5, 80)
        payload["arithmetic"]["precision_mode"] = "binary64"
        self._reject(payload, "arithmetic")

        payload = producer.produce(5, 80)
        payload["arithmetic"]["library"] = "mpmath.iv falsified-version"
        self._reject(payload, "arithmetic")

        payload = producer.produce(5, 80)
        with mock.patch.dict(
            verifier.PINNED_HASHES, {verifier.NOTE: "0" * 64}, clear=False
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "source byte hash"):
                self._replay(payload)

    def test_verifier_imports_neither_producer_nor_transition_helpers(self) -> None:
        source = (ROOT / "verifier/block_quotient_action_replay.py").read_text()
        tree = ast.parse(source)
        modules: list[str] = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                modules.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                modules.append(node.module)
        self.assertNotIn("block_quotient_action", modules)
        self.assertNotIn("transition_window_bound", modules)


if __name__ == "__main__":
    unittest.main()
