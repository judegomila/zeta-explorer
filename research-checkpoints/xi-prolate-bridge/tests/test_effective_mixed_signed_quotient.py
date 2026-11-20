from __future__ import annotations

import ast
import copy
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import effective_mixed_signed_quotient as producer  # noqa: E402
from verifier import effective_mixed_signed_quotient_replay as verifier  # noqa: E402


def canonical_bytes(payload: dict[str, object]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    value = Fraction(numerator, denominator)
    return {"numerator": str(value.numerator), "denominator": str(value.denominator)}


def rational(value: dict[str, str]) -> Fraction:
    return Fraction(int(value["numerator"]), int(value["denominator"]))


def rational_vector(value: list[dict[str, str]]) -> list[Fraction]:
    return [rational(entry) for entry in value]


def rational_matrix(value: list[list[dict[str, str]]]) -> list[list[Fraction]]:
    return [rational_vector(row) for row in value]


def dyadic(raw: list[object]) -> Fraction:
    sign, mantissa_text, exponent, _bits = raw
    mantissa = int(str(mantissa_text))
    numerator = -mantissa if sign else mantissa
    exponent = int(exponent)
    return Fraction(numerator * 2**exponent) if exponent >= 0 else Fraction(numerator, 2 ** (-exponent))


def interval_bounds(value: dict[str, object]) -> tuple[Fraction, Fraction]:
    endpoints = value["dyadic"]
    assert isinstance(endpoints, dict)
    return dyadic(endpoints["lower"]), dyadic(endpoints["upper"])


def interval_inventory(value: object, path: str = "") -> dict[str, tuple[Fraction, Fraction]]:
    result: dict[str, tuple[Fraction, Fraction]] = {}
    if isinstance(value, dict):
        if set(value) == {"decimal", "dyadic"}:
            result[path] = interval_bounds(value)
        else:
            for key, item in value.items():
                child = f"{path}.{key}" if path else key
                result.update(interval_inventory(item, child))
    elif isinstance(value, list):
        for index, item in enumerate(value):
            result.update(interval_inventory(item, f"{path}[{index}]"))
    return result


def ast_imports_and_environment_access(source: str) -> tuple[set[str], set[str]]:
    tree = ast.parse(source)
    imports: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.update(alias.name.split(".", 1)[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imports.add(node.module.split(".", 1)[0])
    names = {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)}
    attrs = {node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)}
    return imports, (names | attrs) & {"environ", "getenv"}


class EffectiveMixedSignedQuotientTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.runs: dict[tuple[str, str], dict[str, object]] = {}
        for p in ("5", "9"):
            for dps in ("80", "160"):
                cls.runs[p, dps] = producer.produce(p, dps)
        cls.base = cls.runs["5", "80"]

    def payload(self) -> dict[str, object]:
        return copy.deepcopy(self.base)

    def replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=canonical_bytes(payload))

    def reject(self, payload: dict[str, object]) -> None:
        with self.assertRaises(verifier.ReplayError):
            self.replay(payload)

    def test_all_four_pilots_replay_and_bind_canonical_bytes(self) -> None:
        for (p, dps), payload in self.runs.items():
            with self.subTest(p=p, dps=dps):
                raw = canonical_bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                reconstructed = report["reconstructed"]
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(reconstructed["dependency_count"], 6)
                self.assertEqual(reconstructed["exact_rational_section_count"], 5)
                self.assertEqual(reconstructed["interval_count"], 24)
                self.assertEqual(reconstructed["node_count"], 5)
                self.assertEqual(reconstructed["whole_target_inertia"], {"positive": 2, "negative": 1, "zero": 0})
                self.assertTrue(reconstructed["unitary_spectral_determinant_inertia_identity"])
                self.assertTrue(reconstructed["prime_minus_sign_reconstructed"])
                self.assertTrue(reconstructed["bridge_cross_retained"])
                self.assertTrue(reconstructed["physical_source_pencils_distinct"])
                self.assertTrue(reconstructed["high_tail_quarter_source_comparison"])
                self.assertFalse(reconstructed["signed_floor_promoted"])
                self.assertEqual(report["producer_binding"]["sha256"], hashlib.sha256(raw).hexdigest())
                self.assertEqual(report["producer_binding"]["canonical_bytes"], len(raw))

    def test_determinism_and_doubled_precision_interval_nesting(self) -> None:
        self.assertEqual(
            canonical_bytes(producer.produce("5", "80")),
            canonical_bytes(producer.produce("5", "80")),
        )
        for p in ("5", "9"):
            low = interval_inventory(self.runs[p, "80"])
            high = interval_inventory(self.runs[p, "160"])
            self.assertEqual(set(low), set(high))
            self.assertEqual(len(low), 24)
            for key in low:
                with self.subTest(p=p, interval=key):
                    self.assertLessEqual(low[key][0], high[key][0])
                    self.assertLessEqual(high[key][0], high[key][1])
                    self.assertLessEqual(high[key][1], low[key][1])

    def test_source_bindings_and_formula_tree_independence(self) -> None:
        dependencies = self.base["source_binding"]["dependency_hashes"]
        self.assertEqual(dependencies, producer.EXPECTED_DEPENDENCY_HASHES)
        self.assertEqual(dependencies, verifier.EXPECTED_DEPENDENCY_HASHES)
        for relative, expected in dependencies.items():
            with self.subTest(relative=relative):
                self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected)

        producer_source = (ROOT / "src/effective_mixed_signed_quotient.py").read_text()
        verifier_source = (ROOT / "verifier/effective_mixed_signed_quotient_replay.py").read_text()
        producer_imports, producer_environment = ast_imports_and_environment_access(producer_source)
        verifier_imports, verifier_environment = ast_imports_and_environment_access(verifier_source)
        self.assertNotIn("verifier", producer_imports)
        self.assertNotIn("effective_mixed_signed_quotient", verifier_imports)
        self.assertFalse(producer_environment)
        self.assertFalse(verifier_environment)
        self.assertNotIn("numpy", producer_imports | verifier_imports)
        self.assertNotIn("scipy", producer_imports | verifier_imports)

    def test_exact_whole_target_unitary_characteristic_and_inertia_identity(self) -> None:
        fixture = self.base["certificate"]["whole_target_quotient"]
        self.assertEqual(rational(fixture["det_G"]), Fraction(900))
        physical_polynomial = rational_vector(fixture["physical_characteristic_polynomial_det_B_minus_zI"])
        normalized_polynomial = rational_vector(fixture["normalized_characteristic_polynomial"])
        generalized_ratio = rational_vector(fixture["generalized_ratio_polynomial"])
        generalized_numerator = rational_vector(fixture["generalized_numerator_det_pullback_minus_zG"])
        self.assertEqual(physical_polynomial, [Fraction(-15), Fraction(12), Fraction(0), Fraction(-1)])
        self.assertEqual(normalized_polynomial, physical_polynomial)
        self.assertEqual(generalized_ratio, physical_polynomial)
        self.assertEqual(generalized_numerator, [Fraction(-13500), Fraction(10800), Fraction(0), Fraction(-900)])
        self.assertEqual(rational_matrix(fixture["polar_data"]["U_star_U_minus_I"]), [[Fraction(0)] * 3 for _ in range(3)])
        self.assertEqual(rational_matrix(fixture["normalized_identity_residual"]), [[Fraction(0)] * 3 for _ in range(3)])
        for name in ("physical", "normalized", "pullback"):
            with self.subTest(name=name):
                inertia = fixture["inertia"][name]
                self.assertEqual((inertia["positive"], inertia["negative"], inertia["zero"]), (2, 1, 0))
                self.assertNotIn(Fraction(0), rational_vector(inertia["ldl_pivots"]))

    def test_physical_and_source_pencils_retain_distinct_metrics_and_bridge(self) -> None:
        fixture = self.base["certificate"]["physical_vs_source_pencil"]
        self.assertEqual(rational_matrix(fixture["D_sep"]), [
            [Fraction(2), Fraction(1), Fraction(0)],
            [Fraction(1), Fraction(2), Fraction(1)],
            [Fraction(0), Fraction(1), Fraction(2)],
        ])
        cross = fixture["cross_blocks"]
        self.assertEqual(rational_vector(cross["D_02"]), [Fraction(1), Fraction(0)])
        self.assertEqual(rational_vector(cross["R_02"]), [Fraction(1), Fraction(1)])
        self.assertEqual(rational_vector(cross["Q_02"]), [Fraction(7), Fraction(6)])
        self.assertEqual(rational_vector(cross["physical_02"]), [Fraction(14, 3), Fraction(11, 3)])
        self.assertEqual(rational_vector(cross["source_02"]), [Fraction(23, 5), Fraction(4)])
        self.assertNotEqual(
            fixture["physical_pencil_Q_minus_tau_plus_delta_R"],
            fixture["source_pencil_Q_minus_tau_R_minus_mu_D"],
        )
        self.assertEqual(self.base["conventions"]["complete_operator"], "pole+archimedean-prime")
        self.assertEqual(self.base["conventions"]["prime_coefficient"], "-1")

    def test_permanent_low_defect_generalized_rayleigh_is_only_an_upper_test(self) -> None:
        for p_text in ("5", "9"):
            fixture = self.runs[p_text, "80"]["certificate"]["permanent_low_defect_test"]
            d0, d2 = rational(fixture["d0"]), rational(fixture["d2"])
            rayleigh = rational(fixture["c2_generalized_rayleigh"])
            self.assertLessEqual(d0, rayleigh)
            self.assertLessEqual(rayleigh, d2)
            self.assertEqual(rational(fixture["short_prefix_rayleigh"]), rayleigh)
            self.assertEqual(rational(fixture["long_prefix_rayleigh"]), rayleigh)
            self.assertGreater(rational(fixture["lower_margin_rayleigh_minus_d0"]), 0)
            self.assertGreater(rational(fixture["upper_margin_d2_minus_rayleigh"]), 0)
            self.assertEqual(fixture["logical_role"], "upper_test_for_generalized_minimum_only")
            self.assertFalse(self.runs[p_text, "80"]["claim_boundary"]["defect_rayleigh_upper_test_is_lower_floor"])

    def test_high_tail_defect_comparison_has_exact_psd_certificates(self) -> None:
        for p_text in ("5", "9"):
            fixture = self.runs[p_text, "80"]["certificate"]["high_tail_defect_comparison"]
            self.assertEqual(rational(fixture["eta"]), Fraction(769, 3600))
            self.assertEqual(rational(fixture["delta"]), Fraction(1, 2))
            self.assertEqual(rational(fixture["comparison_delta_over_one_plus_eta"]), Fraction(1800, 4369))
            self.assertGreater(rational(fixture["comparison_delta_over_one_plus_eta"]), Fraction(1, 4))
            self.assertEqual(
                fixture["lower_residual_H_minus_comparison_D"],
                fixture["lower_residual_decomposition"],
            )
            for key in (
                "cauchy_principal_minors",
                "quarter_residual_principal_minors",
                "upper_residual_principal_minors",
            ):
                with self.subTest(p=p_text, certificate=key):
                    self.assertTrue(all(rational(row["determinant"]) >= 0 for row in fixture[key]))
            self.assertEqual(fixture["logical_role"], "source_metric_comparison_only")

    def test_exact_epsilon_bridge_countermodel_has_scale_collapse_not_floor(self) -> None:
        for p_text in ("5", "9"):
            p = int(p_text)
            fixture = self.runs[p_text, "80"]["certificate"]["epsilon_bridge_countermodel"]
            epsilon = Fraction(1, p * p)
            self.assertEqual(rational(fixture["epsilon"]), epsilon)
            self.assertEqual(rational_vector(fixture["four_I_minus_D_leading_minors"]), [Fraction(2), Fraction(3), Fraction(4)])
            self.assertEqual(rational_vector(fixture["H_leading_minors"]), [
                Fraction(1) + epsilon,
                2 * epsilon + epsilon**2,
                2 * epsilon * (1 + epsilon),
            ])
            self.assertEqual(rational(fixture["bridge_cross_D_pb"]), 1)
            self.assertEqual(rational(fixture["bridge_cross_H_pb"]), epsilon)
            self.assertEqual(rational(fixture["bridge_cross_H_bm"]), epsilon)
            self.assertEqual(rational(fixture["middle_coordinate_physical_rayleigh"]), 2 * epsilon)
            self.assertEqual(
                rational_matrix(fixture["source_floor_residual_Q_minus_mu_H"]),
                [[Fraction(0)] * 3 for _ in range(3)],
            )
            self.assertEqual(fixture["logical_role"], "physical_floor_upper_test_and_scale_collapse_only")
            self.assertFalse(self.runs[p_text, "80"]["claim_boundary"]["physical_floor_promoted_from_countermodel"])
        self.assertLess(
            rational(self.runs["9", "80"]["certificate"]["epsilon_bridge_countermodel"]["middle_coordinate_physical_rayleigh"]),
            rational(self.runs["5", "80"]["certificate"]["epsilon_bridge_countermodel"]["middle_coordinate_physical_rayleigh"]),
        )

    def test_actual_node_vandermonde_intervals_exclude_zero_in_real_part(self) -> None:
        for (p, dps), payload in self.runs.items():
            fixture = payload["certificate"]["actual_node_vandermonde"]
            self.assertEqual([row["k"] for row in fixture["nodes_s_k"]], ["-2", "-1", "0", "1", "2"])
            for key in (
                "rising_factorial_determinant_direct",
                "vandermonde_product",
                "jump_determinant_direct",
                "jump_determinant_formula",
            ):
                with self.subTest(p=p, dps=dps, determinant=key):
                    real = interval_bounds(fixture[key]["real"])
                    imag = interval_bounds(fixture[key]["imag"])
                    self.assertLess(real[1], 0)
                    self.assertLessEqual(imag[0], 0)
                    self.assertGreaterEqual(imag[1], 0)

    def test_checked_in_artifacts_match_live_producer_and_replay(self) -> None:
        artifact_root = ROOT / "artifacts/effective_mixed_signed_quotient"
        for (p, dps), payload in self.runs.items():
            producer_path = artifact_root / f"p{p}_d{dps}_producer.json"
            replay_path = artifact_root / f"p{p}_d{dps}_replay.json"
            with self.subTest(p=p, dps=dps, kind="producer"):
                self.assertEqual(producer_path.read_bytes(), canonical_bytes(payload))
            expected_replay = verifier.replay(payload, producer_bytes=canonical_bytes(payload))
            with self.subTest(p=p, dps=dps, kind="replay"):
                self.assertEqual(replay_path.read_bytes(), canonical_bytes(expected_replay))

    def test_rejects_binary64_and_noncanonical_rationals(self) -> None:
        payload = self.payload()
        payload["certificate"]["whole_target_quotient"]["shift_tau"] = 2.0
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["whole_target_quotient"]["shift_tau"] = {"numerator": "02", "denominator": "1"}
        self.reject(payload)

    def test_rejects_dropped_or_mutated_bridge_cross(self) -> None:
        payload = self.payload()
        fixture = payload["certificate"]["physical_vs_source_pencil"]
        fixture["D_sep"][0][1] = R(0)
        fixture["D_sep"][1][0] = R(0)
        fixture["cross_blocks"]["D_02"][0] = R(0)
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["epsilon_bridge_countermodel"]["bridge_cross_H_pb"] = R(0)
        self.reject(payload)

    def test_rejects_wrong_prime_sign_and_prime_block_reassembly(self) -> None:
        payload = self.payload()
        payload["conventions"]["complete_operator"] = "pole+archimedean+prime"
        payload["conventions"]["prime_coefficient"] = "+1"
        self.reject(payload)

        payload = self.payload()
        whole = payload["certificate"]["whole_target_quotient"]
        pole = rational_matrix(whole["physical_blocks"]["pole"])
        arch = rational_matrix(whole["physical_blocks"]["archimedean"])
        prime = rational_matrix(whole["physical_blocks"]["prime"])
        wrong = [[pole[i][j] + arch[i][j] + prime[i][j] for j in range(3)] for i in range(3)]
        whole["complete_Q"] = [[R(value.numerator, value.denominator) for value in row] for row in wrong]
        self.reject(payload)

    def test_rejects_cached_matrix_eigenvalue_or_boolean_substitution(self) -> None:
        payload = self.payload()
        payload["certificate"]["whole_target_quotient"]["normalized_from_pullback"][0][0] = R(999)
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["whole_target_quotient"]["cached_eigenvalues"] = [R(-1), R(1), R(2)]
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["trusted_checks"] = {"positive": True}
        self.reject(payload)

    def test_rejects_source_physical_shift_substitution(self) -> None:
        payload = self.payload()
        fixture = payload["certificate"]["physical_vs_source_pencil"]
        fixture["source_pencil_Q_minus_tau_R_minus_mu_D"] = copy.deepcopy(
            fixture["physical_pencil_Q_minus_tau_plus_delta_R"]
        )
        fixture["cross_blocks"]["source_02"] = copy.deepcopy(fixture["cross_blocks"]["physical_02"])
        self.reject(payload)

        payload = self.payload()
        payload["conventions"]["physical_shift_metric"] = "D=C^*C"
        payload["conventions"]["source_comparison_metric"] = "W^*W"
        self.reject(payload)

    def test_rejects_false_signed_floor_promotions(self) -> None:
        for key in (
            "signed_weil_floor_proved",
            "defect_rayleigh_upper_test_is_lower_floor",
            "high_tail_source_metric_floor_is_signed_floor",
            "physical_floor_promoted_from_countermodel",
        ):
            payload = self.payload()
            payload["claim_boundary"][key] = True
            with self.subTest(key=key):
                self.reject(payload)

        payload = self.payload()
        payload["certificate"]["permanent_low_defect_test"]["logical_role"] = "signed_floor"
        self.reject(payload)

    def test_rejects_zero_or_broad_fake_vandermonde_interval(self) -> None:
        zero = {
            "decimal": ["0.0", "0.0"],
            "dyadic": {"lower": [0, "0", 0, 0], "upper": [0, "0", 0, 0]},
        }
        payload = self.payload()
        payload["certificate"]["actual_node_vandermonde"]["vandermonde_product"]["real"] = zero
        self.reject(payload)

        payload = self.payload()
        field = payload["certificate"]["actual_node_vandermonde"]["jump_determinant_formula"]["real"]
        field["dyadic"]["lower"] = [1, "1", 1000, 1]
        field["decimal"][0] = "-1.07150860718626732094842504906e+301"
        self.reject(payload)

    def test_rejects_noncanonical_bytes_and_input_mutations(self) -> None:
        payload = self.payload()
        with self.assertRaises(verifier.ReplayError):
            verifier.replay(payload, producer_bytes=canonical_bytes(payload) + b" ")

        payload = self.payload()
        payload["inputs"]["dps"] = "81"
        self.reject(payload)

        payload = self.payload()
        payload["inputs"]["lambda_numerator"] = 5.0
        self.reject(payload)


if __name__ == "__main__":
    unittest.main()
