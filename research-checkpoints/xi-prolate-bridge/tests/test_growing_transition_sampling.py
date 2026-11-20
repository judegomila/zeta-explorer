from __future__ import annotations

import ast
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

import growing_transition_sampling as producer  # noqa: E402
from verifier import growing_transition_sampling_replay as verifier  # noqa: E402


class GrowingTransitionSamplingTests(unittest.TestCase):
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

    def test_singleton_and_rest_blocks_replay_at_doubled_precision(self) -> None:
        cases = ((5, 3, 36, 8), (5, 8, 36, 8), (7, 3, 60, 14), (7, 14, 60, 14))
        for p, q, n_star, rest_limit in cases:
            low = producer.produce(p, q, 80)
            high = producer.produce(p, q, 160)
            for payload in (low, high):
                report = self._replay(payload)
                self.assertEqual(
                    report["status"],
                    "GROWING_TRANSITION_SAMPLING_COMPONENT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertTrue(report["checks"]["all_interval_pairs_overlap"])
                self.assertTrue(report["checks"]["only_one_d_LS_inverse_loss"])
                self.assertFalse(report["checks"]["producer_booleans_trusted"])
                exact = payload["certificate"]["exact"]
                self.assertEqual(exact["n_star"], n_star)
                self.assertEqual(exact["rest_modal_row_limit"], rest_limit)
                self.assertEqual(exact["modal_rows"], q)
                raw = self._bytes(payload)
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )
            for name in low["certificate"]["outward_intervals"]:
                a = verifier._interval(low["certificate"]["outward_intervals"][name], name, 80)
                b = verifier._interval(high["certificate"]["outward_intervals"][name], name, 160)
                self.assertLessEqual(a[0], b[1])
                self.assertLessEqual(b[0], a[1])

    def test_q_linearity_for_outer_and_projection_coefficients(self) -> None:
        q3 = producer.produce(5, 3, 80)
        q6 = producer.produce(5, 6, 80)
        for name in ("E_q", "D_q", "X_q", "B_proj_q"):
            a = verifier._interval(q3["certificate"]["outward_intervals"][name], name, 80)
            b = verifier._interval(q6["certificate"]["outward_intervals"][name], name, 80)
            with mp.workdps(120):
                self.assertLessEqual(2 * a[0], b[1])
                self.assertLessEqual(b[0], 2 * a[1])

    def test_nonexact_or_out_of_range_inputs_are_rejected(self) -> None:
        for p in (True, 5.0, 4, 6):
            with self.subTest(p=p):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, 3, 80)  # type: ignore[arg-type]
        for q in (False, 3.0, 0, 9):
            with self.subTest(q=q):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(5, q, 80)  # type: ignore[arg-type]

    def test_exact_bytes_duplicate_keys_and_binary64_are_rejected(self) -> None:
        payload = producer.produce(5, 8, 80)
        raw = self._bytes(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)
        mutated = copy.deepcopy(payload)
        mutated["input"]["modal_rows"] = 7
        with self.assertRaisesRegex(verifier.ReplayError, "do not decode exactly"):
            verifier.replay(mutated, producer_bytes=raw)
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(b'{"q":1,"q":2}', "bad")
        payload["input"]["modal_rows"] = 8.0
        self._reject(payload, "non-integer JSON number|binary64")

    def test_projection_exponent_and_transition_inventory_are_reconstructed(self) -> None:
        mutations = {
            "n_star": 37,
            "projection_exponent_base_2": 12_000,
            "singleton_modal_rows": 2,
            "rest_modal_row_limit": 9,
            "rest_limit_below_three_halves_lambda_squared": False,
            "outer_constants_exactly_linear_in_q": False,
            "projection_constant_exactly_linear_in_q": False,
        }
        for field, value in mutations.items():
            payload = producer.produce(5, 8, 80)
            payload["certificate"]["exact"][field] = value
            with self.subTest(field=field):
                self._reject(payload, "differs from reconstruction")

    def test_origin_projection_cross_term_and_metric_shortcuts_are_rejected(self) -> None:
        for field in (
            "invisible_origin_correction_retained",
            "compact_projection_retained",
            "all_sampling_cross_terms_retained",
        ):
            payload = producer.produce(5, 8, 80)
            payload["source_admissions"][field] = False
            with self.subTest(field=field):
                self._reject(payload, "source_admissions")

        payload = producer.produce(5, 8, 80)
        payload["source_admissions"]["full_cross_block_metric_replaced_by_compressions"] = True
        self._reject(payload, "source_admissions")

    def test_infinite_series_and_minkowski_constant_cannot_be_replaced(self) -> None:
        payload = producer.produce(5, 8, 80)
        payload["certificate"]["finite_outer_bound"] = "finite numerical truncation"
        self._reject(payload, "finite outer bound")

        payload = producer.produce(5, 8, 80)
        payload["certificate"]["complete_loewner_constant"] = "C_q=max(B_out_q,B_proj_q)"
        self._reject(payload, "Loewner constant")

        payload = producer.produce(5, 8, 80)
        payload["locked_formulas"]["projection_norm"] = (
            "X_q=q*L*V_star^2/(2*pi^2*N*d_LS^2)"
        )
        self._reject(payload, "locked_formulas")

    def test_raw_interval_and_positive_exponent_reserve_are_binding(self) -> None:
        payload = producer.produce(5, 8, 80)
        endpoint = payload["certificate"]["outward_intervals"]["X_q"]["dyadic"]["upper"]
        endpoint[3] += 1
        self._reject(payload, "bit count|canonical")

        payload = producer.produce(5, 8, 80)
        reserve = payload["certificate"]["outward_intervals"]["log_N_times_d_LS"]
        reserve["dyadic"] = {"lower": [0, "0", 0, 0], "upper": [0, "0", 0, 0]}
        reserve["decimal"] = ["0.0", "0.0"]
        self._reject(payload)

    def test_claim_status_source_hash_and_arithmetic_promotions_are_rejected(self) -> None:
        payload = producer.produce(5, 8, 80)
        payload["claim_scope"]["proved"].append("equation (5.2) of DIRECT_RH_ATTACK.md")
        self._reject(payload, "claim_scope")

        payload = producer.produce(5, 8, 80)
        payload["source_admissions"]["global_weil_positivity_assumed"] = True
        self._reject(payload, "source_admissions")

        payload = producer.produce(5, 8, 80)
        payload["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        self._reject(payload, "terminal_state")

        payload = producer.produce(5, 8, 80)
        payload["source_hashes"][producer.NOTE] = "0" * 64
        self._reject(payload, "source hash")

        payload = producer.produce(5, 8, 80)
        payload["arithmetic"]["precision_mode"] = "binary64"
        self._reject(payload, "arithmetic")

        payload = producer.produce(5, 8, 80)
        with mock.patch.dict(verifier.PINNED_HASHES, {verifier.NOTE: "0" * 64}, clear=False):
            with self.assertRaisesRegex(verifier.ReplayError, "source byte hash"):
                self._replay(payload)

    def test_verifier_imports_neither_producer_nor_transition_helper(self) -> None:
        source = (ROOT / "verifier/growing_transition_sampling_replay.py").read_text()
        tree = ast.parse(source)
        modules: list[str] = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                modules.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                modules.append(node.module)
        self.assertNotIn("growing_transition_sampling", modules)
        self.assertNotIn("transition_window_bound", modules)


if __name__ == "__main__":
    unittest.main()
