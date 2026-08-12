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

import covariance_annular_odd_subsequence as producer  # noqa: E402
from verifier import covariance_annular_odd_subsequence_replay as verifier  # noqa: E402


def canonical_bytes(payload: dict[str, object]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def rational(value: dict[str, str]) -> Fraction:
    return Fraction(int(value["numerator"]), int(value["denominator"]))


def dyadic(raw: list[object]) -> Fraction:
    sign, mantissa_text, exponent, _bits = raw
    mantissa = int(str(mantissa_text))
    signed = -mantissa if sign else mantissa
    exponent = int(exponent)
    return Fraction(signed * 2**exponent) if exponent >= 0 else Fraction(signed, 2 ** (-exponent))


def interval_inventory(value: object, path: str = "") -> dict[str, tuple[Fraction, Fraction]]:
    found: dict[str, tuple[Fraction, Fraction]] = {}
    if isinstance(value, dict):
        if set(value) == {"decimal", "dyadic"}:
            dy = value["dyadic"]
            assert isinstance(dy, dict)
            found[path] = (dyadic(dy["lower"]), dyadic(dy["upper"]))
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
    return imports & {"os", "dotenv"}, (names | attrs) & {"environ", "getenv"}


class CovarianceAnnularOddSubsequenceTests(unittest.TestCase):
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
        expected = {"5": (4, 5, 2), "9": (12, 14, 2)}
        for (p, dps), payload in self.runs.items():
            with self.subTest(p=p, dps=dps):
                report = verifier.replay(payload, producer_bytes=canonical_bytes(payload))
                prime_count, central_m, central_r = expected[p]
                reconstructed = report["reconstructed"]
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(reconstructed["prime_power_count"], prime_count)
                self.assertEqual(reconstructed["central_M"], central_m)
                self.assertEqual(reconstructed["central_r"], central_r)
                self.assertEqual(reconstructed["interval_count"], 35)
                self.assertTrue(reconstructed["pole_prime_paths_overlap"])
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(canonical_bytes(payload)).hexdigest(),
                )

    def test_deterministic_and_precision_nested(self) -> None:
        self.assertEqual(canonical_bytes(producer.produce("5", "80")), canonical_bytes(producer.produce("5", "80")))
        for p in ("5", "9"):
            low = interval_inventory(self.runs[p, "80"]["certificate"])
            high = interval_inventory(self.runs[p, "160"]["certificate"])
            self.assertEqual(set(low), set(high))
            self.assertEqual(len(low), 35)
            for name in low:
                with self.subTest(p=p, interval=name):
                    self.assertLessEqual(low[name][0], high[name][0])
                    self.assertGreaterEqual(low[name][1], high[name][1])

    def test_live_source_lock_and_dependency_hashes(self) -> None:
        lock_path = ROOT / producer.LOCK
        lock_hash = hashlib.sha256(lock_path.read_bytes()).hexdigest()
        self.assertEqual(lock_hash, verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(self.base["source_lock"]["sha256"], lock_hash)
        dependencies = self.base["source_lock"]["dependency_hashes"]
        self.assertEqual(set(dependencies), verifier.EXPECTED_DEPENDENCIES)
        for relative, expected in dependencies.items():
            with self.subTest(relative=relative):
                self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected)

    def test_exact_minimum_spill_and_gray_decomposition(self) -> None:
        central = self.base["certificate"]["exact_central_fixture"]
        self.assertEqual(rational(central["minimum_spill_squared"]), Fraction(4688, 225))
        self.assertEqual(rational(central["direct_shell_squared"]), Fraction(4688, 225))
        self.assertEqual(rational(central["scalar_epsilon_over_gamma"]), Fraction(16, 9))
        soft = self.base["certificate"]["exact_soft_symbol_fixture"]
        self.assertEqual(rational(soft["A_times_chi"]), 1)
        self.assertEqual(rational(soft["gray_mass"]), Fraction(3, 4))
        self.assertEqual(rational(soft["difference_mass"]), Fraction(1, 4))
        self.assertEqual(soft["closed_projector_endpoint_fixture"]["closed_rank"], 2)

    def test_positive_interval_margins(self) -> None:
        values = interval_inventory(self.base["certificate"]["interval_formulas"]["values"])
        for name in (
            "central_H_M_upper", "gray_even_lambda_coefficient_lower",
            "gray_odd_lambda_coefficient_lower", "closed_angle_even_lower",
            "closed_angle_odd_lower", "hard_cut_layer_lambda_coefficient_lower",
            "odd_center_c0", "remaining_schur_load_threshold",
        ):
            with self.subTest(name=name):
                self.assertGreater(values[name][0], 0)

    def test_independent_paths_and_shared_library_limit_disclosed(self) -> None:
        producer_source = (ROOT / "src/covariance_annular_odd_subsequence.py").read_text(encoding="utf-8")
        verifier_source = (ROOT / "verifier/covariance_annular_odd_subsequence_replay.py").read_text(encoding="utf-8")
        self.assertIn("def _interval_formulas", producer_source)
        self.assertIn("def _independent_intervals", verifier_source)
        self.assertNotEqual(hashlib.sha256(producer_source.encode()).digest(), hashlib.sha256(verifier_source.encode()).digest())
        self.assertTrue(self.base["arithmetic_libraries"]["shared_library_with_verifier"])
        self.assertIn("share", self.base["arithmetic_libraries"]["independence_limitation"])

    def test_no_secret_or_zero_table_access(self) -> None:
        for relative in (
            "src/covariance_annular_odd_subsequence.py",
            "verifier/covariance_annular_odd_subsequence_replay.py",
        ):
            source = (ROOT / relative).read_text(encoding="utf-8")
            imports, access = secret_ast_findings(source)
            self.assertFalse(imports, relative)
            self.assertFalse(access, relative)
            lowered = source.lower()
            self.assertNotIn("zetazero", lowered)
            self.assertNotIn("zero_table", lowered)

    def test_rejects_fourier_sign_inversion_and_normalization_mutations(self) -> None:
        for key, value in (
            ("fourier_transform", "hat(f)(t)=integral f(x)*exp(+i*t*x) dx"),
            ("inversion", "Jf(x)=f(x)"),
            ("source_normalization", "unit norm"),
        ):
            payload = self.payload()
            payload["source_conventions"][key] = value
            self.reject(payload, "source convention")

    def test_rejects_prime_sign_endpoint_and_lambda_square_mutations(self) -> None:
        payload = self.payload()
        payload["source_conventions"]["combined_multiplier"] = payload["source_conventions"]["combined_multiplier"].replace("-2*sum", "+2*sum")
        self.reject(payload, "source convention")

        payload = self.payload()
        payload["source_conventions"]["prime_power_endpoint"] = "inclusive n<=lambda"
        self.reject(payload, "source convention")

        payload = self.payload()
        payload["certificate"]["inclusive_prime_powers"].pop()
        self.reject(payload, "prime-power")

    def test_rejects_hard_cut_gray_and_closed_endpoint_mutations(self) -> None:
        payload = self.payload()
        payload["source_conventions"]["exterior_defect"] = "(U+nu*L-m_lambda(t))_+"
        self.reject(payload, "source convention")

        payload = self.payload()
        payload["certificate"]["exact_soft_symbol_fixture"]["gray_mass"] = {"numerator": "0", "denominator": "1"}
        self.reject(payload, "gray")

        payload = self.payload()
        payload["certificate"]["exact_soft_symbol_fixture"]["closed_projector_endpoint_fixture"]["closed_rank"] = 1
        self.reject(payload, "closed spectral endpoint")

    def test_rejects_row_rank_and_full_schedule_promotions(self) -> None:
        payload = self.payload()
        payload["certificate"]["exact_central_fixture"]["row_rank_alone_has_no_rate"] = False
        self.reject(payload, "row rank")

        payload = self.payload()
        payload["certificate"]["logical_theorems"]["odd_limsup"] = "all sufficiently large locked lambda are favorable"
        self.reject(payload, "logical theorem")

        payload = self.payload()
        payload["certificate"]["checks"]["odd_transverse_schur_still_open"] = False
        self.reject(payload, "Boolean")

    def test_rejects_equation_target_and_asymptotic_claims(self) -> None:
        payload = self.payload()
        payload["claim_boundary"]["equation_5_2_proved"] = True
        self.reject(payload, "source-lock binding")

        payload = self.payload()
        payload["claim_boundary"]["asymptotic_rh_conclusion_claimed"] = True
        self.reject(payload, "source-lock binding")

        payload = self.payload()
        payload["claim_boundary"]["locally_uniform_determinant_convergence_proved"] = True
        self.reject(payload, "source-lock binding")

    def test_rejects_binary64_and_noncanonical_parameters(self) -> None:
        payload = self.payload()
        payload["inputs"]["annular_parameters"]["delta"] = 0.5
        self.reject(payload, "binary64")
        for p in (5, "05", "7", "5.0"):
            with self.subTest(p=p):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, "80")  # type: ignore[arg-type]
        for dps in (80, "080", "40", "80.0"):
            with self.subTest(dps=dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce("5", dps)  # type: ignore[arg-type]

    def test_rejects_nonpositive_margin_and_overwide_interval(self) -> None:
        payload = self.payload()
        zero = {
            "decimal": ["0.0", "0.0"],
            "dyadic": {"lower": [0, "0", 0, 0], "upper": [0, "0", 0, 0]},
        }
        payload["certificate"]["interval_formulas"]["values"]["odd_center_c0"] = zero
        self.reject(payload, "does not enclose|nonpositive")

        payload = self.payload()
        payload["certificate"]["interval_formulas"]["values"]["central_H_M_upper"] = {
            "decimal": ["0", "1e100"],
            "dyadic": {"lower": [0, "0", 0, 0], "upper": [0, "1", 400, 1]},
        }
        self.reject(payload, "overwide")

    def test_rejects_pole_identity_and_minimum_spill_mutations(self) -> None:
        payload = self.payload()
        payload["certificate"]["exact_central_fixture"]["minimum_spill_squared"] = {"numerator": "1", "denominator": "1"}
        self.reject(payload, "minimum-spill")

        payload = self.payload()
        payload["certificate"]["interval_formulas"]["values"]["pole_prime_path_2"] = payload["certificate"]["interval_formulas"]["values"]["odd_center_c0"]
        self.reject(payload, "does not enclose|do not overlap")

    def test_rejects_real_axis_proxy_and_nonpositive_gap_flags(self) -> None:
        for flag in (
            "decimal_zero_list_read",
            "global_weil_positivity_assumed",
            "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
            "nonpositive_complementary_gap_reported_as_pass",
            "zero_reality_assumed",
        ):
            payload = self.payload()
            payload["certificate"]["source_admissions"][flag] = True
            self.reject(payload, "source admission")

        payload = self.payload()
        payload["claim_boundary"]["numerical_diagnostics_are_theorems"] = True
        self.reject(payload, "source-lock binding")

        payload = self.payload()
        payload["claim_boundary"]["signed_odd_floor_proved"] = True
        self.reject(payload, "source-lock binding")

    def test_rejects_noncanonical_producer_bytes(self) -> None:
        payload = self.payload()
        with self.assertRaisesRegex(verifier.ReplayError, "byte stream"):
            verifier.replay(payload, producer_bytes=canonical_bytes(payload) + b" ")


if __name__ == "__main__":
    unittest.main()
