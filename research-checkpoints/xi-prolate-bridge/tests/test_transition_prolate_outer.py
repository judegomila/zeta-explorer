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

import transition_prolate_outer as producer  # noqa: E402
from verifier import transition_prolate_outer_replay as verifier  # noqa: E402


class TransitionProlateOuterTests(unittest.TestCase):
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

    def test_p5_p7_and_doubled_precision_replay(self) -> None:
        expected = {5: (36, 35), 7: (60, 59)}
        for p, indices in expected.items():
            low = producer.produce(p, 80)
            high = producer.produce(p, 160)
            for payload in (low, high):
                report = self._replay(payload)
                self.assertEqual(
                    report["status"],
                    "TRANSITION_PROLATE_OUTER_COMPONENT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertTrue(report["checks"]["all_interval_pairs_overlap"])
                self.assertFalse(report["checks"]["producer_booleans_trusted"])
                self.assertEqual(
                    (payload["certificate"]["n_star"], payload["certificate"]["max_low_index"]),
                    indices,
                )
                raw = self._bytes(payload)
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )

            for name in low["certificate"]["outward_intervals"]:
                low_interval = verifier._parse_interval(
                    low["certificate"]["outward_intervals"][name], name, 80
                )
                high_interval = verifier._parse_interval(
                    high["certificate"]["outward_intervals"][name], name, 160
                )
                self.assertLessEqual(low_interval[0], high_interval[1])
                self.assertLessEqual(high_interval[0], low_interval[1])

    def test_nonexact_and_off_schedule_inputs_are_rejected(self) -> None:
        for value in (True, 5.0, 4, 6):
            with self.subTest(value=value, path="producer"):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(value, 80)  # type: ignore[arg-type]
            with self.subTest(value=value, path="verifier"):
                with self.assertRaises(verifier.ReplayError):
                    verifier.reconstruct(value, 80)  # type: ignore[arg-type]
        with self.assertRaises((TypeError, ValueError)):
            producer.produce(5, 80.0)  # type: ignore[arg-type]

    def test_exact_producer_bytes_are_required(self) -> None:
        payload = producer.produce(5, 80)
        raw = self._bytes(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)
        mutated = copy.deepcopy(payload)
        mutated["certificate"]["n_star"] += 1
        with self.assertRaisesRegex(verifier.ReplayError, "do not decode exactly"):
            verifier.replay(mutated, producer_bytes=raw)

    def test_duplicate_keys_and_binary64_are_rejected(self) -> None:
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(b'{"schema":"a","schema":"b"}', "bad")
        payload = producer.produce(5, 80)
        payload["input"]["lambda_numerator"] = 5.0
        self._reject(payload, "binary64|non-integer JSON number")

    def test_strict_transition_endpoint_and_constants_are_reconstructed(self) -> None:
        mutations = {
            "n_star": 37,
            "max_low_index": 36,
            "n_star_is_excluded": False,
            "endpoint_constant_integer": 1296,
            "sampled_series_constant": 27,
            "weighted_norm_integer": 1_062_723,
            "far_translation_integer": 999_999_999,
            "translation_collection_factor": 3,
        }
        for field, value in mutations.items():
            payload = producer.produce(5, 80)
            payload["certificate"][field] = value
            with self.subTest(field=field):
                self._reject(payload, "independent reconstruction|differs")

        payload = producer.produce(5, 80)
        payload["certificate"]["far_remainder_constants"]["derivative"] = 20
        self._reject(payload, "independent reconstruction|differs")

    def test_lambda_squared_and_noncanonical_rational_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["lambda_squared"] = copy.deepcopy(
            payload["certificate"]["lambda"]
        )
        self._reject(payload, "independent reconstruction|differs")

        payload = producer.produce(5, 80)
        payload["certificate"]["lambda"] = {
            "numerator": "10",
            "denominator": "4",
        }
        self._reject(payload, "reduced canonical")

    def test_interval_endpoint_and_mu_margin_mutations_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        endpoint = payload["certificate"]["outward_intervals"]["beta"]["dyadic"]["lower"]
        endpoint[3] += 1
        self._reject(payload, "bit count|canonical")

        payload = producer.produce(5, 80)
        margin = payload["certificate"]["outward_intervals"]["margin_below_3c_squared"]
        margin["dyadic"]["lower"] = [0, "0", 0, 0]
        margin["dyadic"]["upper"] = [0, "0", 0, 0]
        margin["decimal"] = ["0.0", "0.0"]
        self._reject(payload)

    def test_formula_domain_claim_and_status_promotions_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["locked_formulas"]["beta"] = "beta=(pi^2/2)*log(200*lambda^2+25)"
        self._reject(payload, "locked_formulas")

        payload = producer.produce(5, 80)
        payload["source_admissions"]["odd_label_harmonic_bound_claimed"] = True
        self._reject(payload, "source_admissions")

        payload = producer.produce(5, 80)
        payload["source_admissions"]["global_weil_positivity_assumed"] = True
        self._reject(payload, "source_admissions")

        payload = producer.produce(5, 80)
        payload["claim_scope"]["proved"].append("equation (5.2) of DIRECT_RH_ATTACK.md")
        self._reject(payload, "claim_scope")

        payload = producer.produce(5, 80)
        payload["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        self._reject(payload, "terminal_state")

    def test_source_hashes_and_arithmetic_disclosure_are_binding(self) -> None:
        payload = producer.produce(5, 80)
        payload["source_hashes"][producer.NOTE] = "0" * 64
        self._reject(payload, "source hash")

        payload = producer.produce(5, 80)
        payload["arithmetic"]["precision_mode"] = "binary64"
        self._reject(payload, "arithmetic")

        payload = producer.produce(5, 80)
        with mock.patch.dict(
            verifier.PINNED_HASHES, {verifier.NOTE: "0" * 64}, clear=False
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "source byte hash"):
                self._replay(payload)

    def test_verifier_imports_neither_producer_nor_transition_helper(self) -> None:
        source = (ROOT / "verifier/transition_prolate_outer_replay.py").read_text()
        tree = ast.parse(source)
        modules: list[str] = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                modules.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                modules.append(node.module)
        self.assertNotIn("transition_prolate_outer", modules)
        self.assertNotIn("transition_window_bound", modules)


if __name__ == "__main__":
    unittest.main()
