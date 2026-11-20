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

import residue_coframe_mixed_krylov as producer  # noqa: E402
from verifier import residue_coframe_mixed_krylov_replay as verifier  # noqa: E402


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


def secret_ast_findings(source: str) -> tuple[set[str], set[str]]:
    tree = ast.parse(source)
    imports: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.update(alias.name.split(".", 1)[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imports.add(node.module.split(".", 1)[0])
    names = {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)}
    attrs = {node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)}
    return imports & {"os", "dotenv", "keyring"}, (names | attrs) & {"environ", "getenv"}


class ResidueCoframeMixedKrylovTests(unittest.TestCase):
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

    def reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = self.assertRaisesRegex(verifier.ReplayError, pattern) if pattern else self.assertRaises(verifier.ReplayError)
        with context:
            self.replay(payload)

    def test_all_four_pilots_replay(self) -> None:
        expected_prime_counts = {"5": 4, "9": 12}
        for (p, dps), payload in self.runs.items():
            with self.subTest(p=p, dps=dps):
                raw = canonical_bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                reconstructed = report["reconstructed"]
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(reconstructed["dependency_count"], 24)
                self.assertEqual(reconstructed["external_source_count"], 2)
                self.assertEqual(reconstructed["prime_power_count"], expected_prime_counts[p])
                self.assertEqual(reconstructed["prime_threshold_count"], expected_prime_counts[p])
                self.assertEqual(reconstructed["interval_count"], 14)
                self.assertTrue(reconstructed["mixed_negative_witness_reconstructed"])
                self.assertTrue(reconstructed["odd_orientation_twins_reconstructed"])
                self.assertTrue(reconstructed["positive_pass_schur_gap_reconstructed"])
                self.assertTrue(reconstructed["prime_action_formula_paths_overlap"])
                self.assertEqual(reconstructed["annular_maximum_integer_rank"], 3)
                self.assertEqual(report["producer_binding"]["sha256"], hashlib.sha256(raw).hexdigest())

    def test_deterministic_and_doubled_precision_intervals_are_nested(self) -> None:
        self.assertEqual(
            canonical_bytes(producer.produce("5", "80")),
            canonical_bytes(producer.produce("5", "80")),
        )
        expected_counts = {"5": 28, "9": 44}
        for p in ("5", "9"):
            low = interval_inventory(self.runs[p, "80"]["certificate"]["interval_formulas"])
            high = interval_inventory(self.runs[p, "160"]["certificate"]["interval_formulas"])
            self.assertEqual(set(low), set(high))
            self.assertEqual(len(low), expected_counts[p])
            for name in low:
                with self.subTest(p=p, interval=name):
                    self.assertLessEqual(low[name][0], high[name][0])
                    self.assertGreaterEqual(low[name][1], high[name][1])

    def test_live_source_lock_and_all_twenty_four_dependencies(self) -> None:
        lock_path = ROOT / producer.LOCK
        lock_hash = hashlib.sha256(lock_path.read_bytes()).hexdigest()
        self.assertEqual(lock_hash, verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(self.base["source_lock"]["sha256"], lock_hash)
        dependencies = self.base["source_lock"]["dependency_hashes"]
        self.assertEqual(len(dependencies), 24)
        self.assertEqual(set(dependencies), verifier.EXPECTED_DEPENDENCIES)
        for relative, expected in dependencies.items():
            with self.subTest(relative=relative):
                self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected)
        externals = self.base["source_lock"]["external_source_hashes"]
        self.assertEqual(set(externals), {
            "vendor/CCM-ZST-2511.22755v1.pdf",
            "vendor/FKS-PNT-2204.02588v3.pdf",
        })

    def test_exact_mixed_countermodel(self) -> None:
        mixed = self.base["certificate"]["exact_mixed_countermodel"]
        self.assertEqual(rational_matrix(mixed["D_sep"]), [
            [Fraction(2), Fraction(1), Fraction(0)],
            [Fraction(1), Fraction(2), Fraction(1)],
            [Fraction(0), Fraction(1), Fraction(2)],
        ])
        self.assertEqual(rational_matrix(mixed["W_sep"]), [
            [Fraction(1), Fraction(0), Fraction(1)],
            [Fraction(0), Fraction(1), Fraction(0)],
            [Fraction(1, 2), Fraction(1, 4), Fraction(-1, 2)],
        ])
        self.assertEqual(rational_matrix(mixed["signed_pullback"]), [
            [Fraction(3, 4), Fraction(-1, 8), Fraction(5, 4)],
            [Fraction(-1, 8), Fraction(15, 16), Fraction(1, 8)],
            [Fraction(5, 4), Fraction(1, 8), Fraction(3, 4)],
        ])
        self.assertEqual(rational(mixed["coframe_lower_bound"]), Fraction(1, 16))
        self.assertEqual(rational(mixed["block_0_relative_floor"]), Fraction(3, 8))
        self.assertEqual(rational_vector(mixed["block_2_generalized_polynomial"]), [Fraction(48), Fraction(-50), Fraction(11)])
        self.assertEqual(rational(mixed["block_2_relative_floor_radical"]), Fraction(97))
        self.assertEqual(rational_vector(mixed["negative_witness"]), [Fraction(1), Fraction(0), Fraction(-1)])
        self.assertEqual(rational(mixed["negative_witness_signed_value"]), Fraction(-1))
        self.assertEqual(rational(mixed["negative_witness_source_value"]), Fraction(4))

    def test_exact_odd_orientation_and_krylov_fixture(self) -> None:
        odd = self.base["certificate"]["exact_odd_orientation_twins"]
        for key, expected in (
            ("beta", Fraction(1, 4)),
            ("mu", Fraction(3)),
            ("a", Fraction(2)),
            ("sigma", Fraction(1)),
            ("d1", Fraction(1, 4)),
            ("d2", Fraction(2)),
            ("nu_fail", Fraction(1, 4)),
            ("nu_pass", Fraction(2)),
            ("chi_fail", Fraction(4)),
            ("chi_pass", Fraction(1, 2)),
            ("schur_gap_fail", Fraction(-2)),
            ("schur_gap_pass", Fraction(3, 2)),
            ("kappa", Fraction(1, 4)),
            ("krylov_residual_norm_squared", Fraction(0)),
            ("retained_excess_load_pass", Fraction(4, 5)),
            ("retained_excess_gap_pass", Fraction(1, 5)),
        ):
            with self.subTest(key=key):
                self.assertEqual(rational(odd[key]), expected)
        self.assertEqual(rational_matrix(odd["B_fail"]), [
            [Fraction(2), Fraction(1), Fraction(0)],
            [Fraction(1), Fraction(1, 4), Fraction(0)],
            [Fraction(0), Fraction(0), Fraction(2)],
        ])
        self.assertEqual(rational_matrix(odd["B_pass"]), [
            [Fraction(2), Fraction(0), Fraction(1)],
            [Fraction(0), Fraction(1, 4), Fraction(0)],
            [Fraction(1), Fraction(0), Fraction(2)],
        ])

    def test_exact_delayed_basis_coframe_no_go_depends_on_p(self) -> None:
        for p in ("5", "9"):
            fixture = self.runs[p, "80"]["certificate"]["exact_delayed_basis_coframe_no_go"]
            integer_p = int(p)
            self.assertEqual(fixture["target_dimension"], 2)
            self.assertEqual(fixture["delay"], integer_p)
            self.assertEqual(rational(fixture["amplitude"]), Fraction(1, integer_p**2))
            self.assertEqual(fixture["before_rank"], 1)
            self.assertEqual(fixture["after_rank"], 2)
            self.assertEqual(rational(fixture["after_coframe_floor"]), Fraction(1, integer_p**4))
            self.assertEqual(rational_matrix(fixture["before_row_frame"]), [
                [Fraction(integer_p - 1), Fraction(0)],
                [Fraction(0), Fraction(0)],
            ])
            self.assertEqual(rational_matrix(fixture["after_row_frame"]), [
                [Fraction(integer_p - 1), Fraction(0)],
                [Fraction(0), Fraction(1, integer_p**4)],
            ])

    def test_prime_inventory_jumps_and_two_action_paths(self) -> None:
        expected_inventories = {
            "5": [2, 3, 4, 5],
            "9": [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
        }
        expected_members = {
            "5": ([2, 3], []),
            "9": ([2, 3, 4, 5], [2, 3]),
        }
        for p in ("5", "9"):
            certificate = self.runs[p, "80"]["certificate"]
            inventory = certificate["inclusive_prime_powers"]
            self.assertEqual([item["n"] for item in inventory], expected_inventories[p])
            thresholds = certificate["interval_formulas"]["prime_thresholds"]
            self.assertEqual(
                [(item["n"], item["prime_base"], item["exponent"]) for item in thresholds],
                [(item["n"], item["prime_base"], item["exponent"]) for item in inventory],
            )
            for item in thresholds:
                self.assertGreater(interval_bounds(item["jump"])[0], 0)
                self.assertFalse(item["reflected_partner_is_integer"])

            fixed = certificate["interval_formulas"]["fixed_prime_action"]
            self.assertEqual((fixed["y_members"], fixed["z_members"]), expected_members[p])
            translation = interval_bounds(fixed["translation_value"])
            split = interval_bounds(fixed["split_chebyshev_value"])
            self.assertLessEqual(max(translation[0], split[0]), min(translation[1], split[1]))
            self.assertEqual(
                fixed["split_chebyshev_value"],
                certificate["interval_formulas"]["values"]["fixed_prime_action_value"],
            )

    def test_annular_trace_rank_factor_and_bv_floor_are_positive(self) -> None:
        section = self.base["certificate"]["interval_formulas"]
        annular = section["annular_trace_rank"]
        self.assertEqual(rational(annular["delta"]), Fraction(1, 2))
        self.assertEqual(rational(annular["b0"]), Fraction(1))
        self.assertEqual(rational(annular["sigma0"]), Fraction(1, 20))
        self.assertGreater(interval_bounds(annular["trace_upper"])[0], 0)
        rank_lo, rank_hi = interval_bounds(annular["rank_bound"])
        self.assertEqual(rank_lo.numerator // rank_lo.denominator, 3)
        self.assertEqual(rank_hi.numerator // rank_hi.denominator, 3)
        self.assertEqual(annular["maximum_integer_rank"], 3)
        self.assertGreater(interval_bounds(section["bv_ratio_floor"]["ratio"])[0], 0)

    def test_independent_assemblies_and_shared_arithmetic_limit_are_disclosed(self) -> None:
        producer_source = (ROOT / "src/residue_coframe_mixed_krylov.py").read_text(encoding="utf-8")
        verifier_source = (ROOT / "verifier/residue_coframe_mixed_krylov_replay.py").read_text(encoding="utf-8")
        self.assertNotEqual(hashlib.sha256(producer_source.encode()).digest(), hashlib.sha256(verifier_source.encode()).digest())
        libraries = self.base["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertTrue(libraries["independent_formula_trees_required"])
        self.assertIn("share", libraries["independence_limitation"])

    def test_ast_has_no_secret_environment_or_zero_table_access(self) -> None:
        for relative in (
            "src/residue_coframe_mixed_krylov.py",
            "verifier/residue_coframe_mixed_krylov_replay.py",
        ):
            source = (ROOT / relative).read_text(encoding="utf-8")
            imports, access = secret_ast_findings(source)
            self.assertFalse(imports, relative)
            self.assertFalse(access, relative)
            lowered = source.lower()
            self.assertNotIn("zetazero", lowered)
            self.assertNotIn("zero_table", lowered)

    def test_rejects_fourier_inversion_and_source_normalization_mutations(self) -> None:
        for key, value in (
            ("fourier_transform", "hat(f)(t)=integral f(x)*exp(+i*t*x) dx"),
            ("inversion", "Jf(x)=f(x)"),
            ("source_normalization", "unit norm"),
        ):
            payload = self.payload()
            payload["source_conventions"][key] = value
            with self.subTest(key=key):
                self.reject(payload, "source convention mutation")

    def test_rejects_prime_sign_endpoint_lambda_square_and_omission_mutations(self) -> None:
        payload = self.payload()
        payload["source_conventions"]["prime_block_sign"] = "plus"
        self.reject(payload, "source convention mutation")

        payload = self.payload()
        payload["source_conventions"]["prime_power_endpoint"] = "inclusive n<=lambda"
        self.reject(payload, "source convention mutation")

        payload = self.payload()
        payload["source_conventions"]["complete_nonpole_multiplier"] = payload["source_conventions"]["complete_nonpole_multiplier"].replace("lambda^2", "lambda")
        self.reject(payload, "source convention mutation")

        payload = self.payload()
        payload["certificate"]["inclusive_prime_powers"].pop()
        self.reject(payload, "inclusive prime-power inventory mutation")

        payload = self.payload()
        payload["certificate"]["interval_formulas"]["prime_thresholds"].pop()
        self.reject(payload, "prime-threshold inventory mismatch")

    def test_rejects_exact_fixture_and_nonpositive_gap_mutations(self) -> None:
        payload = self.payload()
        payload["certificate"]["exact_mixed_countermodel"]["negative_witness_signed_value"] = R(0)
        self.reject(payload, "exact rational mutation")

        payload = self.payload()
        payload["certificate"]["exact_odd_orientation_twins"]["schur_gap_pass"] = R(0)
        self.reject(payload, "exact rational mutation")

        payload = self.payload()
        payload["certificate"]["exact_delayed_basis_coframe_no_go"]["after_coframe_floor"] = R(0)
        self.reject(payload, "exact rational mutation")

        payload = self.payload()
        payload["certificate"]["checks"]["pass_orientation_schur_gap_positive"] = False
        self.reject(payload, "producer Boolean inventory")

        payload = self.payload()
        payload["certificate"]["source_admissions"]["nonpositive_schur_gap_reported_as_pass"] = True
        self.reject(payload, "source-admission mutation")

    def test_negative_nu_product_passing_adversary_is_rejected(self) -> None:
        alpha_minus_beta = Fraction(-2)
        nu = Fraction(-1)
        b_norm_squared = Fraction(1)
        self.assertGreater(alpha_minus_beta * nu, b_norm_squared * b_norm_squared)
        self.assertFalse(verifier._three_moment_gate(alpha_minus_beta, nu, b_norm_squared))

        payload = self.payload()
        odd = payload["certificate"]["exact_odd_orientation_twins"]
        odd["a"] = R(-2)
        odd["nu_pass"] = R(-1)
        self.reject(payload, "three-moment positive-nu gate failed")

    def test_rejects_fixed_inverse_load_and_effective_schedule_promotions(self) -> None:
        payload = self.payload()
        payload["certificate"]["logical_theorems"]["fixed_positive_inverse_load_gap_required"] = True
        self.reject(payload, "logical-theorem mutation")

        payload = self.payload()
        payload["certificate"]["source_admissions"]["fixed_inverse_load_margin_claimed"] = True
        self.reject(payload, "source-admission mutation")

        payload = self.payload()
        payload["certificate"]["logical_theorems"]["mixed_prefix_effective_schedule_proved"] = True
        self.reject(payload, "logical-theorem mutation")

    def test_rejects_claim_promotions_and_real_axis_proxies(self) -> None:
        for key in (
            "equation_5_2_proved",
            "signed_even_floor_proved",
            "signed_odd_floor_proved",
            "locally_uniform_determinant_convergence_proved",
            "numerical_diagnostics_are_theorems",
            "asymptotic_rh_conclusion_claimed",
        ):
            payload = self.payload()
            payload["claim_boundary"][key] = True
            with self.subTest(key=key):
                self.reject(payload, "claim-boundary mutation")

        for key in (
            "decimal_zero_list_read",
            "global_weil_positivity_assumed",
            "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
            "zero_reality_assumed",
            "api_key_read",
            "environment_secret_read",
        ):
            payload = self.payload()
            payload["certificate"]["source_admissions"][key] = True
            with self.subTest(key=key):
                self.reject(payload, "source-admission mutation")

    def test_rejects_binary64_secret_and_noncanonical_parameters(self) -> None:
        payload = self.payload()
        payload["inputs"]["annular_parameters"]["delta"] = 0.5
        self.reject(payload, "binary64 value")

        payload = self.payload()
        payload["inputs"]["lambda_numerator"] = "sk-abcdefghijklmno"
        self.reject(payload, "secret-like value")

        for p in (5, "05", "7", "5.0"):
            with self.subTest(p=p):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, "80")  # type: ignore[arg-type]
        for dps in (80, "080", "40", "80.0"):
            with self.subTest(dps=dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce("5", dps)  # type: ignore[arg-type]

    def test_rejects_interval_path_membership_and_rank_mutations(self) -> None:
        payload = self.payload()
        interval = payload["certificate"]["interval_formulas"]["values"]["bv_ratio_floor"]
        interval["decimal"] = ["0", "1e100"]
        interval["dyadic"] = {
            "lower": [0, "0", 0, 0],
            "upper": [0, "1", 400, 1],
        }
        self.reject(payload, "overwide interval")

        payload = self.payload()
        jump = payload["certificate"]["interval_formulas"]["prime_thresholds"][0]["jump"]
        jump["dyadic"]["lower"], jump["dyadic"]["upper"] = jump["dyadic"]["upper"], jump["dyadic"]["lower"]
        self.reject(payload, "reversed interval")

        payload = self.payload()
        payload["certificate"]["interval_formulas"]["fixed_prime_action"]["y_members"].pop()
        self.reject(payload, "fixed prime-action threshold membership mutation")

        payload = self.payload()
        payload["certificate"]["interval_formulas"]["annular_trace_rank"]["maximum_integer_rank"] = 4
        self.reject(payload, "annular integer-rank fixture mutation")

    def test_rejects_source_lock_hash_dependency_and_noncanonical_bytes(self) -> None:
        payload = self.payload()
        payload["source_lock"]["sha256"] = "0" * 64
        self.reject(payload, "source-lock binding mutation")

        payload = self.payload()
        dependency = next(iter(payload["source_lock"]["dependency_hashes"]))
        payload["source_lock"]["dependency_hashes"][dependency] = "0" * 64
        self.reject(payload, "source-lock binding mutation")

        payload = self.payload()
        with self.assertRaisesRegex(verifier.ReplayError, "producer byte stream is not canonical"):
            verifier.replay(payload, producer_bytes=canonical_bytes(payload) + b" ")


if __name__ == "__main__":
    unittest.main()
