from __future__ import annotations

import ast
import copy
import json
import mpmath as mp
from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

import pnt_discrepancy_normal_form as producer  # noqa: E402
from verifier import pnt_discrepancy_normal_form_replay as verifier  # noqa: E402


class PNTDiscrepancyNormalFormTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.base = producer.produce("2", 2, 40)

    def reject(self, payload: dict[str, object], pattern: str) -> None:
        with self.assertRaisesRegex(verifier.ReplayError, pattern):
            verifier.replay(payload)

    def test_lambda_two_pilot_replays_and_preserves_signed_cancellation(self) -> None:
        report = verifier.replay(self.base)
        self.assertEqual(report["status"], "PNT_DISCREPANCY_NORMAL_FORM_REPLAY_PASS")
        self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
        self.assertFalse(report["checks"]["cached_producer_matrix_trusted"])
        self.assertFalse(report["checks"]["producer_booleans_trusted"])
        inventory = self.base["exact_prime_power_inventory"]["terms"]
        self.assertEqual(
            [(item["n"], item["prime"], item["exponent"]) for item in inventory],
            [(2, 2, 1), (3, 3, 1), (4, 2, 2)],
        )
        self.assertEqual(self.base["exact_prime_power_inventory"]["integer_cutoff"], 4)
        self.assertTrue(self.base["exact_prime_power_inventory"]["endpoint_is_integer"])
        raw_residual = self.base["raw_point_matrices"][
            "combined_residual_before_absolute_values"
        ]
        self.assertEqual(
            raw_residual,
            self.base["cancellation_diagnostic"][
                "combined_residual_before_absolute_values"
            ],
        )
        ratio = mp.mpf(
            self.base["cancellation_diagnostic"][
                "pre_cancellation_to_residual_ratio"
            ]
        )
        self.assertGreater(ratio, mp.mpf("1e30"))
        self.assertTrue(
            self.base["checks"][
                "normal_form_matches_locked_source_at_declared_point_precision"
            ]
        )
        even = self.base["cancellation_diagnostic"][
            "inversion_even_residual_before_absolute_values"
        ]
        odd = self.base["cancellation_diagnostic"][
            "inversion_odd_residual_before_absolute_values"
        ]
        self.assertEqual((len(even), len(even[0])), (3, 3))
        self.assertEqual((len(odd), len(odd[0])), (2, 2))

    def test_base_and_doubled_precision_agree_and_residual_contracts(self) -> None:
        high = producer.produce("2", 2, 80)
        high_report = verifier.replay(high)
        self.assertEqual(high_report["status"], "PNT_DISCREPANCY_NORMAL_FORM_REPLAY_PASS")
        low_residual = mp.mpf(
            self.base["cancellation_diagnostic"]["combined_residual_max_abs"]
        )
        high_residual = mp.mpf(
            high["cancellation_diagnostic"]["combined_residual_max_abs"]
        )
        self.assertLess(high_residual, low_residual * mp.mpf("1e-25"))
        low_q = self.base["raw_point_matrices"][
            "normal_form_Q_equals_cI_plus_A_tail_minus_T_D"
        ]
        high_q = high["raw_point_matrices"][
            "normal_form_Q_equals_cI_plus_A_tail_minus_T_D"
        ]
        for i in range(5):
            for j in range(5):
                self.assertLess(abs(mp.mpf(low_q[i][j]) - mp.mpf(high_q[i][j])), mp.mpf("1e-35"))

    def test_exact_W_D_and_source_normalization_fields(self) -> None:
        outputs = self.base["transcendental_point_outputs"]
        with mp.workdps(60):
            expected_W = mp.log(2) / mp.sqrt(2) + mp.log(3) / mp.sqrt(3) + mp.log(2) / 2
            self.assertLess(abs(mp.mpf(outputs["W_lambda_squared"]) - expected_W), mp.mpf("1e-38"))
            self.assertLess(
                abs(mp.mpf(outputs["D_at_2a"]) - (expected_W - 2)),
                mp.mpf("1e-38"),
            )
            c_star = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) + 4
            self.assertLess(abs(mp.mpf(outputs["c_star"]) - c_star), mp.mpf("1e-38"))
        self.assertEqual(
            self.base["locked_formulas"]["normal_form"],
            "Q_lambda=c_* I+A_tail-T_D",
        )
        self.assertIn("zero outside I", self.base["locked_conventions"]["zero_extension"])
        self.assertIn("Lebesgue", self.base["locked_conventions"]["physical_interval"])

    def test_binary64_inputs_and_json_numbers_are_rejected(self) -> None:
        for bad_lambda in (2.0, True):
            with self.subTest(lambda_value=bad_lambda):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(bad_lambda, 2, 40)  # type: ignore[arg-type]
        for bad_N in (2.0, True):
            with self.subTest(N=bad_N):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce("2", bad_N, 40)  # type: ignore[arg-type]
        for bad_dps in (40.0, True):
            with self.subTest(dps=bad_dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce("2", 2, bad_dps)  # type: ignore[arg-type]
        with self.assertRaisesRegex(verifier.ReplayError, "non-integer JSON number"):
            verifier._strict_json_loads('{"lambda":2.0}', "binary64 fixture")
        payload = copy.deepcopy(self.base)
        payload["input"]["lambda_decimal"] = 2.0
        self.reject(payload, "binary64")

    def test_omitted_endpoint_and_lambda_squared_mix_are_rejected(self) -> None:
        payload = copy.deepcopy(self.base)
        payload["exact_prime_power_inventory"]["terms"] = [
            item
            for item in payload["exact_prime_power_inventory"]["terms"]
            if item["n"] != 4
        ]
        self.reject(payload, "prime-power inventory|lambda-squared endpoint")

        payload = copy.deepcopy(self.base)
        payload["exact_prime_power_inventory"]["integer_cutoff"] = 2
        self.reject(payload, "prime-power inventory|lambda-squared endpoint")

        payload = copy.deepcopy(self.base)
        payload["exact_prime_power_inventory"]["endpoint_is_integer"] = False
        self.reject(payload, "prime-power inventory|lambda-squared endpoint")

    def test_prime_fourier_scale_and_reflection_mutations_are_rejected(self) -> None:
        mutations = [
            (
                "prime block sign",
                "prime_block_sign",
                "plus in Q=pole-archimedean+prime",
            ),
            (
                "Fourier sign",
                "fourier_basis",
                "V_n(x)=(-1)^n*L^(-1/2)*exp(-2*pi*i*n*x/L), -N<=n<=N",
            ),
            (
                "lambda versus lambda squared",
                "lambda_scale",
                "a=log(lambda), L=log(lambda), exp(L)=lambda",
            ),
            (
                "reflection",
                "inversion",
                "J is omitted before parity compression",
            ),
            (
                "endpoint",
                "prime_power_endpoint",
                "exclusive 1<n<lambda^2",
            ),
        ]
        for label, key, value in mutations:
            payload = copy.deepcopy(self.base)
            payload["locked_conventions"][key] = value
            with self.subTest(label=label):
                self.reject(payload, "locked_conventions")

        payload = copy.deepcopy(self.base)
        payload["locked_conventions"]["discrepancy_measure_sign"] = (
            "dD=sum Lambda(n)/sqrt(n)*delta_log(n)+exp(h/2)*dh"
        )
        self.reject(payload, "locked_conventions")

    def test_matrix_block_boolean_and_claim_tampering_are_rejected(self) -> None:
        payload = copy.deepcopy(self.base)
        payload["raw_point_matrices"]["source_prime_block_before_outer_minus"][0][0] = "0"
        self.reject(payload, "source_prime_block|reconstruction")

        payload = copy.deepcopy(self.base)
        payload["cancellation_diagnostic"]["combined_residual_before_absolute_values"][0][0] = "0"
        self.reject(payload, "signed residual")

        payload = copy.deepcopy(self.base)
        payload["checks"][
            "normal_form_matches_locked_source_at_declared_point_precision"
        ] = False
        self.reject(payload, "boolean")

        payload = copy.deepcopy(self.base)
        payload["claim_scope"]["proved_here"].append(
            "equation (5.2) of DIRECT_RH_ATTACK.md"
        )
        self.reject(payload, "claim_scope")

        payload = copy.deepcopy(self.base)
        payload["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        self.reject(payload, "terminal_state")

    def test_verifier_has_no_producer_or_locked_matrix_import(self) -> None:
        tree = ast.parse(
            (ROOT / "verifier" / "pnt_discrepancy_normal_form_replay.py").read_text(
                encoding="utf-8"
            )
        )
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module)
        self.assertNotIn("pnt_discrepancy_normal_form", imported)
        self.assertNotIn("weil_matrix", imported)
        self.assertIn("share mpmath", self.base["arithmetic"]["limitation"])


if __name__ == "__main__":
    unittest.main()
