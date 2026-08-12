from __future__ import annotations

import ast
import copy
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

import boundary_discrepancy_convolution as producer  # noqa: E402
from verifier import boundary_discrepancy_convolution_replay as verifier  # noqa: E402


class BoundaryDiscrepancyConvolutionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.base = producer.produce("2", 2, 80, "2")
        cls.high = producer.produce("2", 2, 160, "2")
        cls.base_replay = verifier.replay(cls.base)
        cls.high_replay = verifier.replay(cls.high)

    def reject(self, payload: dict[str, object], pattern: str) -> None:
        with self.assertRaisesRegex(verifier.ReplayError, pattern):
            verifier.replay(payload)

    @staticmethod
    def matrix(payload: dict[str, object], key: str) -> mp.matrix:
        rows = payload["raw_point_matrices"][key]  # type: ignore[index]
        return mp.matrix([[mp.mpf(value) for value in row] for row in rows])

    def test_locked_pilots_replay_at_80_and_160_digits(self) -> None:
        for payload, report, dps in (
            (self.base, self.base_replay, 80),
            (self.high, self.high_replay, 160),
        ):
            with self.subTest(dps=dps):
                self.assertEqual(
                    report["status"],
                    "BOUNDARY_DISCREPANCY_CONVOLUTION_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    payload["input"]["precision_decimal_digits"], dps
                )
                self.assertFalse(
                    report["checks"]["producer_matrices_and_booleans_trusted"]
                )
                self.assertTrue(
                    report["checks"][
                        "source_matrix_reassembled_from_source_parameters"
                    ]
                )
                self.assertTrue(
                    report["checks"][
                        "boundary_convolution_replayed_by_Fubini_tail_path"
                    ]
                )
                self.assertTrue(
                    report["checks"]["completed_xi_Laplace_identity_replayed"]
                )
                inventory = payload["exact_prime_power_inventory"]["terms"]
                self.assertEqual(
                    [
                        (item["n"], item["prime"], item["exponent"])
                        for item in inventory
                    ],
                    [(2, 2, 1), (3, 3, 1), (4, 2, 2)],
                )

    def test_doubled_precision_stability_and_residual_contraction(self) -> None:
        with mp.workdps(180):
            for section, key in (
                ("even_ground", "epsilon"),
                ("even_ground", "h_over_X"),
                ("boundary_decomposition", "C_lambda"),
                ("weak_identity", "C_plus_epsilon_minus_c_star"),
            ):
                with self.subTest(section=section, key=key):
                    low = mp.mpf(self.base[section][key])
                    high = mp.mpf(self.high[section][key])
                    self.assertLess(abs(low - high), mp.mpf("1e-70"))

            low_residual = abs(
                mp.mpf(self.base["weak_identity"]["identity_signed_residual"])
            )
            high_residual = abs(
                mp.mpf(self.high["weak_identity"]["identity_signed_residual"])
            )
            self.assertGreater(low_residual, 0)
            self.assertLess(high_residual, low_residual * mp.mpf("1e-60"))

    def test_source_blocks_boundary_decomposition_and_weak_identity(self) -> None:
        with mp.workdps(100):
            pole = self.matrix(self.base, "source_pole")
            arch = self.matrix(
                self.base, "source_archimedean_before_outer_minus"
            )
            prime = self.matrix(self.base, "source_prime_before_outer_minus")
            source = self.matrix(
                self.base, "source_Q_equals_pole_minus_arch_minus_prime"
            )
            block_error = source - (pole - arch - prime)
            self.assertLess(
                max(abs(block_error[i, j]) for i in range(5) for j in range(5)),
                mp.mpf("1e-70"),
            )

            boundary = self.base["boundary_decomposition"]
            self.assertLess(
                abs(
                    mp.mpf(boundary["F_integral"])
                    - (
                        mp.mpf(boundary["D_integral"])
                        - mp.mpf(boundary["H0_direct_integral"])
                    )
                ),
                mp.mpf("1e-70"),
            )
            weak = self.base["weak_identity"]
            self.assertLess(
                abs(
                    mp.mpf(weak["A1_matrix_pairing_over_X"])
                    - mp.mpf(weak["A1_boundary_pairing_over_X"])
                ),
                mp.mpf("1e-70"),
            )
            self.assertLess(
                abs(mp.mpf(weak["identity_signed_residual"])),
                mp.mpf("1e-70"),
            )
            self.assertTrue(self.base["reserve_window"]["strict_upper_holds"])
            self.assertTrue(self.base["reserve_window"]["equivalence_holds"])

    def test_archimedean_tail_and_laplace_samples_are_signed_checks(self) -> None:
        with mp.workdps(100):
            self.assertEqual(
                [sample["label"] for sample in self.base["archimedean_tail_samples"]],
                ["a_over_2", "a", "L"],
            )
            for sample in self.base["archimedean_tail_samples"]:
                self.assertLess(
                    abs(mp.mpf(sample["signed_residual"])), mp.mpf("1e-70")
                )
                self.assertLess(
                    abs(mp.mpf(sample["closed"]) - mp.mpf(sample["direct_tail"])),
                    mp.mpf("1e-70"),
                )
            self.assertEqual(
                [mp.mpf(sample["s"]) for sample in self.base["laplace_checks"]],
                [mp.mpf("1"), mp.mpf("1.5")],
            )
            for sample in self.base["laplace_checks"]:
                self.assertGreater(mp.mpf(sample["s"]), mp.mpf("0.5"))
                self.assertLess(
                    abs(mp.mpf(sample["signed_residual"])), mp.mpf("1e-70")
                )

    def test_binary64_parameters_and_noncanonical_json_are_rejected(self) -> None:
        for bad_lambda in (2.0, True):
            with self.subTest(lambda_value=bad_lambda):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(bad_lambda, 2, 80, "2")  # type: ignore[arg-type]
        for bad_N in (2.0, True):
            with self.subTest(N=bad_N):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce("2", bad_N, 80, "2")  # type: ignore[arg-type]
        with self.assertRaisesRegex(verifier.ReplayError, "non-integer JSON number"):
            verifier._strict_json_loads('{"lambda":2.0}', "binary64 fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads('{"lambda":"2","lambda":"2"}', "duplicate fixture")

        payload = copy.deepcopy(self.base)
        payload["input"]["lambda_decimal"] = 2.0
        self.reject(payload, "binary64")

        for bad_B in ("0", "1", "3"):
            with self.subTest(reserve_bound=bad_B):
                with self.assertRaisesRegex(ValueError, "B='2'"):
                    producer.produce("2", 2, 80, bad_B)
                payload = copy.deepcopy(self.base)
                payload["input"]["reserve_bound_B_decimal"] = bad_B
                payload["reserve_window"]["B"] = bad_B
                self.reject(payload, "reserve bound B|B='2'")

    def test_sign_reflection_scale_and_strict_window_mutations_are_rejected(self) -> None:
        mutations = (
            (
                "F=D+H0",
                "locked_formulas",
                "F",
                "F(t)=D(t)+H0(t)",
            ),
            (
                "reflection omitted",
                "locked_conventions",
                "inversion",
                "J is omitted before even compression",
            ),
            (
                "wrong reserve scale",
                "locked_formulas",
                "weak_identity",
                "C_lambda(x)+epsilon-c_star=-4*h/(lambda*X)",
            ),
            (
                "nonstrict upper window",
                "locked_formulas",
                "reserve_window",
                "h/X<=B iff c_star-epsilon-4B/sqrt(lambda)<=C_lambda(x)<=c_star-epsilon",
            ),
        )
        for label, section, key, value in mutations:
            payload = copy.deepcopy(self.base)
            payload[section][key] = value
            with self.subTest(label=label):
                self.reject(payload, section)

    def test_laplace_sample_outside_locked_half_plane_is_rejected(self) -> None:
        payload = copy.deepcopy(self.base)
        payload["laplace_checks"][0]["s"] = "0.5"
        self.reject(payload, r"laplace_checks\[0\]\.s|Laplace")

    def test_absolute_value_substitution_is_rejected(self) -> None:
        payload = copy.deepcopy(self.base)
        signed = mp.mpf(
            payload["weak_identity"]["C_plus_epsilon_minus_c_star"]
        )
        self.assertLess(signed, 0)
        payload["weak_identity"]["C_plus_epsilon_minus_c_star"] = mp.nstr(
            abs(signed), 80
        )
        self.reject(payload, "weak_identity")

        # A coherent-looking perturbation far below the old half-precision
        # threshold must still fail the 80-digit replay.
        payload = copy.deepcopy(self.base)
        for section, key in (
            ("boundary_decomposition", "C_lambda"),
            ("reserve_window", "C_lambda"),
        ):
            payload[section][key] = mp.nstr(
                mp.mpf(payload[section][key]) + mp.mpf("1e-45"), 80
            )
        self.reject(payload, "boundary_decomposition.C_lambda")

    def test_claim_promotions_and_forbidden_source_admissions_are_rejected(self) -> None:
        for key in (
            "cached_matrix_read",
            "zeta_zero_table_read",
            "global_weil_positivity_assumed",
            "asymptotic_claim_made",
            "environment_secret_read",
        ):
            payload = copy.deepcopy(self.base)
            payload["source_admissions"][key] = True
            with self.subTest(source_admission=key):
                self.reject(payload, "source_admissions")

        payload = copy.deepcopy(self.base)
        payload["claim_scope"]["proved_here"].append("the Riemann hypothesis")
        self.reject(payload, "claim_scope")

    def test_omitted_lambda_squared_prime_power_is_rejected(self) -> None:
        payload = copy.deepcopy(self.base)
        payload["exact_prime_power_inventory"]["terms"] = [
            item
            for item in payload["exact_prime_power_inventory"]["terms"]
            if item["n"] != 4
        ]
        self.reject(payload, "prime_power_inventory|prime-power inventory")

    def test_producer_and_verifier_import_graphs_remain_independent(self) -> None:
        def imports(path: Path) -> set[str]:
            tree = ast.parse(path.read_text(encoding="utf-8"))
            result: set[str] = set()
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    result.update(alias.name for alias in node.names)
                elif isinstance(node, ast.ImportFrom) and node.module:
                    result.add(node.module)
            return result

        producer_imports = imports(ROOT / "src" / "boundary_discrepancy_convolution.py")
        verifier_imports = imports(
            ROOT / "verifier" / "boundary_discrepancy_convolution_replay.py"
        )
        self.assertNotIn("verifier.boundary_discrepancy_convolution_replay", producer_imports)
        self.assertNotIn("boundary_discrepancy_convolution", verifier_imports)
        self.assertNotIn("weil_matrix", verifier_imports)
        self.assertIn("weil_matrix", producer_imports)
        self.assertTrue(self.base["arithmetic"]["shared_library_with_verifier"])
        self.assertIn("share mpmath", self.base["arithmetic"]["limitation"])


if __name__ == "__main__":
    unittest.main()
