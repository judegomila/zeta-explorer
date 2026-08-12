from __future__ import annotations

import ast
import copy
from fractions import Fraction
import hashlib
import json
from math import factorial
from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import effective_mixed_endpoint_jump as producer  # noqa: E402
from verifier import effective_mixed_endpoint_jump_replay as verifier  # noqa: E402


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
    signed = -mantissa if sign else mantissa
    exponent = int(exponent)
    return Fraction(signed * 2**exponent) if exponent >= 0 else Fraction(signed, 2 ** (-exponent))


def interval_bounds(value: dict[str, object]) -> tuple[Fraction, Fraction]:
    endpoints = value["dyadic"]
    assert isinstance(endpoints, dict)
    return dyadic(endpoints["lower"]), dyadic(endpoints["upper"])


def interval_inventory(value: object, path: str = "") -> dict[str, tuple[Fraction, Fraction]]:
    found: dict[str, tuple[Fraction, Fraction]] = {}
    if isinstance(value, dict):
        if set(value) == {"decimal", "dyadic"}:
            found[path] = interval_bounds(value)
        else:
            for key, child in value.items():
                child_path = f"{path}.{key}" if path else key
                found.update(interval_inventory(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            found.update(interval_inventory(child, f"{path}[{index}]"))
    return found


def zero_interval() -> dict[str, object]:
    return {
        "decimal": ["0", "0"],
        "dyadic": {"lower": [0, "0", 0, 0], "upper": [0, "0", 0, 0]},
    }


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


class EffectiveMixedEndpointJumpTests(unittest.TestCase):
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

    def test_all_four_pilots_replay_and_bind_source_bytes(self) -> None:
        expected_prime_counts = {"5": 4, "9": 12}
        expected_flags = {
            "trace_stop_constants_reconstructed",
            "mixed_bridge_gram_reconstructed_from_raw_columns",
            "residual_trace_invariant_by_two_paths",
            "endpoint_recurrence_reconstructed_with_P_minus_one_zero",
            "endpoint_vandermonde_determinants_reconstructed",
            "high_label_rho_strictly_below_half",
            "inclusive_prime_power_inventory_reconstructed",
            "odd_jump_and_common_fourier_phase_reconstructed",
            "dyadic_band_lower_reconstructed",
            "claim_boundary_retained",
        }
        for (p, dps), payload in self.runs.items():
            with self.subTest(p=p, dps=dps):
                raw = canonical_bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                reconstructed = report["reconstructed"]
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(reconstructed["dependency_count"], 18)
                self.assertEqual(reconstructed["external_source_count"], 2)
                self.assertEqual(reconstructed["prime_power_count"], expected_prime_counts[p])
                self.assertEqual(reconstructed["interval_count"], 25)
                self.assertTrue(all(reconstructed[key] for key in expected_flags))
                self.assertEqual(report["producer_binding"]["sha256"], hashlib.sha256(raw).hexdigest())
                self.assertEqual(report["producer_binding"]["canonical_bytes"], len(raw))

    def test_deterministic_and_doubled_precision_raw_intervals_are_nested(self) -> None:
        self.assertEqual(
            canonical_bytes(producer.produce("5", "80")),
            canonical_bytes(producer.produce("5", "80")),
        )
        for p in ("5", "9"):
            low = interval_inventory(self.runs[p, "80"])
            high = interval_inventory(self.runs[p, "160"])
            self.assertEqual(set(low), set(high))
            self.assertEqual(len(low), 25)
            for name in low:
                with self.subTest(p=p, interval=name):
                    self.assertLessEqual(low[name][0], high[name][0])
                    self.assertLessEqual(high[name][0], high[name][1])
                    self.assertLessEqual(high[name][1], low[name][1])

    def test_live_source_lock_and_all_eighteen_dependencies(self) -> None:
        lock_path = ROOT / producer.LOCK
        lock_hash = hashlib.sha256(lock_path.read_bytes()).hexdigest()
        self.assertEqual(lock_hash, verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(self.base["source_lock"]["sha256"], lock_hash)
        dependencies = self.base["source_lock"]["dependency_hashes"]
        self.assertEqual(len(dependencies), 18)
        self.assertEqual(set(dependencies), verifier.EXPECTED_DEPENDENCIES)
        for relative, expected in dependencies.items():
            with self.subTest(relative=relative):
                self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected)
        self.assertEqual(set(self.base["source_lock"]["external_source_hashes"]), {
            "vendor/CCM-ZST-2511.22755v1.pdf",
            "vendor/FKS-PNT-2204.02588v3.pdf",
        })

    def test_exact_trace_neumann_and_source_whitened_floor(self) -> None:
        for p_text in ("5", "9"):
            p = int(p_text)
            fixture = self.runs[p_text, "80"]["certificate"]["exact_trace_stop"]
            expected = {
                "lambda": Fraction(p, 2),
                "trace_stop_strict_upper": Fraction(1, 2 * p * p),
                "T_norm_squared_upper": Fraction(p * p, 8),
                "operator_error_squared_strict_upper": Fraction(1, 16),
                "operator_error_strict_upper": Fraction(1, 4),
                "neumann_inverse_factor": Fraction(4, 3),
                "M_mu_upper": Fraction(p),
                "B_norm_squared_upper": Fraction(p**4, 2),
                "right_inverse_norm_squared_upper": Fraction(8 * p**4, 9),
                "source_whitened_floor": Fraction(9, 8 * p**4),
                "intermediate_floor_formula_value": Fraction(9, 8 * p**4),
                "coarse_floor_formula_value": Fraction(9, 8 * p**4),
            }
            for key, expected_value in expected.items():
                with self.subTest(p=p, key=key):
                    self.assertEqual(rational(fixture[key]), expected_value)
            self.assertEqual(fixture["trace_interval_width_at_stage_s"], "2^(-s)")
            self.assertFalse(fixture["rounded_monotonicity_assumed"])
            self.assertFalse(fixture["actual_prolate_trace_schedule_executed"])

    def test_exact_bridge_congruence_and_residual_trace(self) -> None:
        d_sep = [
            [Fraction(2), Fraction(1), Fraction(0)],
            [Fraction(1), Fraction(2), Fraction(1)],
            [Fraction(0), Fraction(1), Fraction(2)],
        ]
        d_mixed = [
            [Fraction(2), Fraction(1), Fraction(1)],
            [Fraction(1), Fraction(2), Fraction(1)],
            [Fraction(1), Fraction(1), Fraction(2)],
        ]
        for p_text in ("5", "9"):
            p = int(p_text)
            fixture = self.runs[p_text, "80"]["certificate"]["exact_mixed_bridge_fixture"]
            self.assertEqual(rational_matrix(fixture["D_sep"]), d_sep)
            self.assertEqual(rational_matrix(fixture["D_mixed"]), d_mixed)
            self.assertEqual(fixture["D_mixed"], fixture["D_congruence_reconstruction"])
            self.assertEqual(rational(fixture["bridge_cross_beta_u"]), 1)
            self.assertEqual(fixture["captured_sep"], fixture["captured_mixed"])
            self.assertEqual(fixture["residual_sep"], fixture["residual_mixed"])
            residual = rational_matrix(fixture["residual_sep"])
            self.assertEqual(sum(residual[index][index] for index in range(2)), Fraction(5, 64 * p * p))
            self.assertEqual(rational(fixture["residual_trace"]), Fraction(5, 64 * p * p))
            self.assertEqual(rational(fixture["trace_stop_strict_upper"]), Fraction(1, 2 * p * p))
            self.assertEqual(rational(fixture["trace_stop_margin"]), Fraction(27, 64 * p * p))

    def test_endpoint_recurrence_domain_leading_terms_and_oracle(self) -> None:
        fixture = self.base["certificate"]["endpoint_recurrence"]
        self.assertEqual(fixture["P_minus_one"], {"index": -1, "terms": []})
        self.assertEqual(fixture["recurrence_k_values"], [1, 2, 3])
        self.assertEqual(len(fixture["polynomials"]), 5)
        for index, polynomial in enumerate(fixture["polynomials"]):
            terms = {
                (term["mu_power"], term["c_squared_power"]): rational(term["coefficient"])
                for term in polynomial["terms"]
            }
            self.assertEqual(polynomial["index"], index)
            self.assertEqual(terms[index, 0], Fraction(1, 2**index * factorial(index)))
        oracle = fixture["evaluation_oracle"]
        self.assertEqual(rational(oracle["mu"]), 17)
        self.assertEqual(rational(oracle["c_squared"]), 5)
        self.assertEqual(rational_vector(oracle["values"]), [
            Fraction(1), Fraction(6), Fraction(25, 2), Fraction(-55, 6), Fraction(-555, 8)
        ])

    def test_endpoint_vandermonde_sign_and_determinants(self) -> None:
        fixture = self.base["certificate"]["endpoint_vandermonde"]
        self.assertEqual(fixture["K"], 3)
        self.assertEqual(rational_vector(fixture["a"]), [Fraction(1), Fraction(4), Fraction(9)])
        plus = rational_matrix(fixture["V_plus"])
        minus = rational_matrix(fixture["V_minus"])
        self.assertEqual(minus, [[-entry for entry in row] for row in plus])
        self.assertEqual(rational(fixture["vandermonde_product_in_a_squared"]), 78000)
        self.assertEqual(rational(fixture["determinant_formula_plus"]), 29250)
        self.assertEqual(rational(fixture["determinant_plus"]), 29250)
        self.assertEqual(rational(fixture["determinant_minus"]), -29250)

    def test_high_label_rho_is_strictly_below_half_with_positive_margin(self) -> None:
        for p_text in ("5", "9"):
            p = int(p_text)
            fixture = self.runs[p_text, "80"]["certificate"]["high_label_rho"]
            self.assertEqual(fixture["derivative_order_k"], 2)
            self.assertEqual(fixture["twice_s_k"], 9)
            self.assertEqual(fixture["B_s"], 2048)
            expected = {
                "plus_0_mod_4": (4096 * p**4, 0),
                "minus_2_mod_4": (4096 * p**4 + 2, 2),
            }
            for family, (label, residue) in expected.items():
                row = fixture["rows"][family]
                self.assertEqual((row["label"], row["label_mod_4"]), (label, residue))
                self.assertGreater(interval_bounds(row["g_n"])[0], 0)
                rho_lo, rho_hi = interval_bounds(row["rho"])
                self.assertGreater(rho_lo, 0)
                self.assertLess(rho_hi, Fraction(1, 2))
                self.assertEqual(rational(row["rho_strict_upper"]), Fraction(1, 2))
                self.assertGreater(interval_bounds(row["half_threshold_margin"])[0], 0)
            self.assertFalse(fixture["actual_transition_scale_block_executed"])

    def test_inclusive_prime_power_inventory(self) -> None:
        expected = {
            "5": [(2, 2, 1), (3, 3, 1), (4, 2, 2), (5, 5, 1)],
            "9": [
                (2, 2, 1), (3, 3, 1), (4, 2, 2), (5, 5, 1), (7, 7, 1), (8, 2, 3),
                (9, 3, 2), (11, 11, 1), (13, 13, 1), (16, 2, 4), (17, 17, 1), (19, 19, 1),
            ],
        }
        for p in ("5", "9"):
            inventory = self.runs[p, "80"]["certificate"]["inclusive_prime_powers"]
            self.assertEqual(
                [(item["n"], item["prime_base"], item["exponent"]) for item in inventory],
                expected[p],
            )
            self.assertLessEqual(inventory[-1]["n"], int(p) ** 2 // 4)

    def test_odd_phase_jump_and_dyadic_band_formulas(self) -> None:
        expected_harmonic = sum((Fraction(1, k * k) for k in range(9, 17)), Fraction(0))
        for p in ("5", "9"):
            fixture = self.runs[p, "80"]["certificate"]["odd_jump_band"]
            self.assertEqual((fixture["prime_power_n"], fixture["prime_base"]), (2, 2))
            self.assertEqual(rational(fixture["eta"]), Fraction(1, 2))
            self.assertEqual(rational(fixture["variation_B_fixture"]), 3)
            self.assertFalse(fixture["variation_fixture_is_actual_B_bound"])
            self.assertEqual((fixture["K0"], fixture["dyadic_K"], fixture["fourier_mode_k"]), (8, 8, 9))
            self.assertEqual(fixture["minus_one_to_k_phase"], -1)
            self.assertEqual(fixture["outer_cutoff_condition"], {"M_at_least": 16})
            self.assertGreater(interval_bounds(fixture["J_lambda_n"])[0], 0)
            self.assertEqual(rational(fixture["positive_mode_harmonic_sum"]), expected_harmonic)
            energy = interval_bounds(fixture["k_squared_leading_energy"])
            law = interval_bounds(fixture["jump_law_energy"])
            self.assertLessEqual(max(energy[0], law[0]), min(energy[1], law[1]))
            sharp = interval_bounds(fixture["sharp_dyadic_band_lower"])
            coarse = interval_bounds(fixture["coarse_dyadic_band_lower"])
            self.assertGreater(coarse[0], 0)
            self.assertLess(coarse[1], sharp[0])
            jump_term = interval_bounds(fixture["jump_term_before_graph_error"])
            half_error = interval_bounds(fixture["graph_half_error_threshold"])
            self.assertLess(half_error[1], jump_term[0])
            self.assertFalse(fixture["actual_uniform_graph_error_bound_executed"])
            self.assertFalse(fixture["positive_nu_gate_established"])

    def test_claim_boundary_admissions_and_theorem_scope(self) -> None:
        boundary = self.base["claim_boundary"]
        self.assertEqual(boundary["formal_status"], "P0_INVALIDATED")
        for key in (
            "equation_5_2_proved",
            "signed_even_floor_proved",
            "signed_odd_floor_proved",
            "signed_mixed_floor_proved",
            "locally_uniform_determinant_convergence_proved",
            "asymptotic_rh_conclusion_claimed",
        ):
            self.assertFalse(boundary[key], key)
        admissions = self.base["certificate"]["source_admissions"]
        self.assertEqual(
            {key for key, value in admissions.items() if value is True},
            {"finite_computable_target_mixed_schedule_proved", "fixed_lambda_finite_jump_transfer_proved"},
        )
        logical = self.base["certificate"]["logical_theorems"]
        self.assertFalse(logical["artifact_executes_actual_prolate_trace_schedule"])
        self.assertFalse(logical["effective_mixed_floor_is_signed_floor"])
        self.assertTrue(logical["endpoint_jet_range_equivalent_at_fixed_parameter"])
        self.assertFalse(logical["effective_transition_scale_endpoint_block_proved"])
        self.assertFalse(logical["uniform_graph_error_rate_proved"])
        self.assertFalse(logical["odd_positive_nu_gate_proved"])

    def test_producer_verifier_import_independence_and_shared_library_limit(self) -> None:
        producer_source = (ROOT / "src/effective_mixed_endpoint_jump.py").read_text(encoding="utf-8")
        verifier_source = (ROOT / "verifier/effective_mixed_endpoint_jump_replay.py").read_text(encoding="utf-8")
        self.assertNotEqual(hashlib.sha256(producer_source.encode()).digest(), hashlib.sha256(verifier_source.encode()).digest())
        producer_imports, _producer_access = ast_imports_and_environment_access(producer_source)
        verifier_imports, _verifier_access = ast_imports_and_environment_access(verifier_source)
        self.assertNotIn("verifier", producer_imports)
        self.assertNotIn("effective_mixed_endpoint_jump_replay", producer_imports)
        self.assertNotIn("effective_mixed_endpoint_jump", verifier_imports)
        self.assertNotIn("src", verifier_imports)
        libraries = self.base["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertTrue(libraries["independent_formula_trees_required"])
        self.assertIn("share", libraries["independence_limitation"])

    def test_ast_has_no_environment_secret_or_zero_table_access(self) -> None:
        for relative in (
            "src/effective_mixed_endpoint_jump.py",
            "verifier/effective_mixed_endpoint_jump_replay.py",
        ):
            source = (ROOT / relative).read_text(encoding="utf-8")
            imports, access = ast_imports_and_environment_access(source)
            self.assertFalse(imports & {"os", "dotenv", "keyring"}, relative)
            self.assertFalse(access, relative)
            lowered = source.lower()
            self.assertNotIn("zetazero", lowered)
            self.assertNotIn("zero_table", lowered)

    def test_rejects_binary64_noncanonical_text_and_secret_like_values(self) -> None:
        payload = self.payload()
        payload["certificate"]["exact_trace_stop"]["lambda"] = 2.5
        self.reject(payload)

        payload = self.payload()
        payload["inputs"]["lambda_numerator"] = "05"
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["exact_trace_stop"]["lambda"]["numerator"] = "05"
        self.reject(payload)

        payload = self.payload()
        payload["inputs"]["lambda_numerator"] = "sk-abcdefghijklmno"
        self.reject(payload)

        payload = self.payload()
        payload["inputs"]["lambda_numerator"] = "OPENAI_API_KEY=not-a-real-key"
        self.reject(payload)

        for p in (5, "05", "7", "5.0"):
            with self.subTest(p=p):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, "80")  # type: ignore[arg-type]
        for dps in (80, "080", "40", "80.0"):
            with self.subTest(dps=dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce("5", dps)  # type: ignore[arg-type]

    def test_rejects_normalization_fourier_phase_and_inversion_mutations(self) -> None:
        for key, value in (
            ("source_normalization", "unit normalization"),
            ("fourier_transform", "hat(f)(t)=integral f(x)*exp(+i*t*x) dx"),
            ("inversion", "Jf(x)=f(x)"),
        ):
            payload = self.payload()
            payload["source_conventions"][key] = value
            with self.subTest(key=key):
                self.reject(payload)

        payload = self.payload()
        payload["source_conventions"]["finite_fourier_basis"] = payload["source_conventions"]["finite_fourier_basis"].replace("(-1)^k*", "")
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["odd_jump_band"]["minus_one_to_k_phase"] = 1
        self.reject(payload)

    def test_rejects_lambda_square_prime_sign_endpoint_and_omission(self) -> None:
        payload = self.payload()
        payload["source_conventions"]["complete_nonpole_multiplier"] = payload["source_conventions"]["complete_nonpole_multiplier"].replace("lambda^2", "lambda")
        self.reject(payload)

        payload = self.payload()
        payload["source_conventions"]["prime_block_sign"] = "plus"
        self.reject(payload)

        payload = self.payload()
        payload["source_conventions"]["prime_power_endpoint"] = "inclusive n<=lambda"
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["inclusive_prime_powers"].pop()
        self.reject(payload)

    def test_rejects_zero_table_global_positivity_and_cached_data_admissions(self) -> None:
        for key in (
            "decimal_zero_list_read",
            "zero_reality_assumed",
            "global_weil_positivity_assumed",
            "cached_matrix_or_eigenvector_read",
            "api_key_read",
            "environment_secret_read",
        ):
            payload = self.payload()
            payload["certificate"]["source_admissions"][key] = True
            with self.subTest(key=key):
                self.reject(payload)

        payload = self.payload()
        payload["certificate"]["checks"]["mixed_gram_congruence_exact"] = False
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["exact_mixed_bridge_fixture"]["D_sep"][0][1] = R(0)
        self.reject(payload)

    def test_rejects_bridge_cross_removal_and_recurrence_domain_mutation(self) -> None:
        payload = self.payload()
        payload["certificate"]["exact_mixed_bridge_fixture"]["bridge_cross_beta_u"] = R(0)
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["endpoint_recurrence"]["recurrence_k_values"] = [0, 1, 2]
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["endpoint_recurrence"]["P_minus_one"]["terms"] = [{
            "mu_power": 0,
            "c_squared_power": 0,
            "coefficient": R(1),
        }]
        self.reject(payload)

    def test_rejects_trace_equality_non_strict_stop_and_nonpositive_gaps(self) -> None:
        payload = self.payload()
        fixture = payload["certificate"]["exact_mixed_bridge_fixture"]
        fixture["residual_trace"] = copy.deepcopy(fixture["trace_stop_strict_upper"])
        fixture["trace_stop_margin"] = R(0)
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["exact_mixed_bridge_fixture"]["trace_stop_margin"] = R(0)
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["high_label_rho"]["rows"]["plus_0_mod_4"]["half_threshold_margin"] = zero_interval()
        self.reject(payload)

        payload = self.payload()
        payload["certificate"]["high_label_rho"]["rows"]["plus_0_mod_4"]["rho_strict_upper"] = R(0)
        self.reject(payload)

    def test_rejects_equation_determinant_signed_and_rh_claim_promotions(self) -> None:
        for key in (
            "equation_5_2_proved",
            "signed_even_floor_proved",
            "signed_odd_floor_proved",
            "signed_mixed_floor_proved",
            "locally_uniform_determinant_convergence_proved",
            "asymptotic_rh_conclusion_claimed",
        ):
            payload = self.payload()
            payload["claim_boundary"][key] = True
            with self.subTest(key=key):
                self.reject(payload)

        for key in (
            "equation_5_2_proved",
            "locally_uniform_determinant_convergence_proved",
            "effective_mixed_floor_is_signed_floor",
            "odd_positive_nu_gate_proved",
        ):
            payload = self.payload()
            payload["certificate"]["logical_theorems"][key] = True
            with self.subTest(key=key):
                self.reject(payload)

        payload = self.payload()
        payload["certificate"]["source_admissions"]["riemann_hypothesis_assumed_or_claimed"] = True
        self.reject(payload)

    def test_rejects_reversed_overwide_intervals_and_noncanonical_bytes(self) -> None:
        payload = self.payload()
        interval = payload["certificate"]["odd_jump_band"]["J_lambda_n"]
        interval["dyadic"]["lower"], interval["dyadic"]["upper"] = interval["dyadic"]["upper"], interval["dyadic"]["lower"]
        self.reject(payload)

        payload = self.payload()
        interval = payload["certificate"]["odd_jump_band"]["jump_law_energy"]
        interval["decimal"] = ["0", "1e100"]
        interval["dyadic"] = {
            "lower": [0, "0", 0, 0],
            "upper": [0, "1", 400, 1],
        }
        self.reject(payload)

        payload = self.payload()
        with self.assertRaisesRegex(verifier.ReplayError, "producer byte stream is not canonical"):
            verifier.replay(payload, producer_bytes=canonical_bytes(payload) + b" ")

    def test_rejects_source_lock_hash_and_dependency_binding_mutations(self) -> None:
        payload = self.payload()
        payload["source_lock"]["sha256"] = "0" * 64
        self.reject(payload)

        payload = self.payload()
        dependency = next(iter(payload["source_lock"]["dependency_hashes"]))
        payload["source_lock"]["dependency_hashes"][dependency] = "0" * 64
        self.reject(payload)


if __name__ == "__main__":
    unittest.main()
