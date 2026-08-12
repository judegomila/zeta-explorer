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

import explicit_mixed_prefix_cost as producer  # noqa: E402
from verifier import explicit_mixed_prefix_cost_replay as verifier  # noqa: E402


def canonical_bytes(payload: dict[str, object]) -> bytes:
    return (json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n").encode("utf-8")


def rational(value: dict[str, str]) -> Fraction:
    return Fraction(int(value["numerator"]), int(value["denominator"]))


def dyadic(value: list[object]) -> Fraction:
    sign, mantissa_text, exponent, _bits = value
    mantissa = int(str(mantissa_text))
    signed = -mantissa if sign else mantissa
    exponent = int(exponent)
    return Fraction(signed * 2**exponent) if exponent >= 0 else Fraction(signed, 2 ** (-exponent))


def interval_bounds(value: dict[str, object]) -> tuple[Fraction, Fraction]:
    raw = value["dyadic"]
    assert isinstance(raw, dict)
    return dyadic(raw["lower"]), dyadic(raw["upper"])


def interval_inventory(payload: dict[str, object]) -> dict[str, tuple[Fraction, Fraction]]:
    certificate = payload["certificate"]
    assert isinstance(certificate, dict)
    intervals = certificate["intervals"]
    assert isinstance(intervals, dict)
    return {key: interval_bounds(value) for key, value in intervals.items()}


def ast_environment_access(source: str) -> tuple[set[str], set[str]]:
    tree = ast.parse(source)
    imports: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.update(alias.name.split(".", 1)[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imports.add(node.module.split(".", 1)[0])
    names = {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)}
    attributes = {node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)}
    return imports & {"os", "dotenv", "keyring"}, (names | attributes) & {"environ", "getenv"}


class ExplicitMixedPrefixCostTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.runs: dict[tuple[str, str], dict[str, object]] = {}
        for lam in ("5/2", "9/2"):
            for dps in ("80", "160"):
                cls.runs[lam, dps] = producer.produce(lam, dps)
        cls.base = cls.runs["5/2", "80"]

    def payload(self) -> dict[str, object]:
        return copy.deepcopy(self.base)

    def replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=canonical_bytes(payload))

    def reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = self.assertRaisesRegex(verifier.ReplayError, pattern) if pattern else self.assertRaises(verifier.ReplayError)
        with context:
            self.replay(payload)

    def test_all_four_pilots_replay_independently(self) -> None:
        expected = {
            "5/2": {
                "N": 7,
                "d": 15,
                "even": 8,
                "odd": 7,
                "M": "458360853203570",
                "Mhat": "9817768834652961",
            },
            "9/2": {
                "N": 21,
                "d": 43,
                "even": 22,
                "odd": 21,
                "M": "2443080380248607569",
                "Mhat": "87338800052215785574",
            },
        }
        for (lam, dps), payload in self.runs.items():
            with self.subTest(lam=lam, dps=dps):
                raw = canonical_bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                reconstructed = report["reconstructed"]
                oracle = expected[lam]
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(reconstructed["N"], oracle["N"])
                self.assertEqual(reconstructed["d"], oracle["d"])
                self.assertEqual(reconstructed["inversion_even_dimension"], oracle["even"])
                self.assertEqual(reconstructed["inversion_odd_dimension"], oracle["odd"])
                self.assertEqual(reconstructed["terminal_count_M"], oracle["M"])
                self.assertEqual(reconstructed["simplified_terminal_count_Mhat"], oracle["Mhat"])
                self.assertEqual(reconstructed["interval_count"], 15)
                self.assertTrue(all(report["independent_checks"].values()))
                self.assertEqual(report["producer_binding"]["sha256"], hashlib.sha256(raw).hexdigest())

    def test_exact_target_inventory_and_rational_constants(self) -> None:
        expected = {
            "5/2": (Fraction(25, 4), 7, 15, 8, 7, 2, Fraction(282, 7), Fraction(35, 1128), Fraction(853, 7)),
            "9/2": (Fraction(81, 4), 21, 43, 22, 21, 3, Fraction(898, 7), Fraction(21, 1796), Fraction(2701, 7)),
        }
        for lam in ("5/2", "9/2"):
            exact = self.runs[lam, "80"]["certificate"]["exact"]
            square, n_value, dimension, even_d, odd_d, r_value, c_value, iota, gamma = expected[lam]
            self.assertEqual(rational(exact["lambda_squared"]), square)
            self.assertEqual(exact["N"], n_value)
            self.assertEqual(exact["d"], dimension)
            self.assertEqual(exact["inversion_even_dimension"], even_d)
            self.assertEqual(exact["inversion_odd_dimension"], odd_d)
            self.assertEqual(exact["r_lambda"], r_value)
            self.assertEqual(rational(exact["C_lambda"]), c_value)
            self.assertEqual(rational(exact["iota_lambda"]), iota)
            self.assertEqual(rational(exact["Gamma_lambda"]), gamma)
            self.assertLess(rational(exact["trace_upper"]), rational(exact["trace_stop"]))
            self.assertGreater(rational(exact["unsigned_coframe_floor"]), 0)

    def test_deterministic_and_doubled_precision_intervals_are_nested(self) -> None:
        self.assertEqual(
            canonical_bytes(producer.produce("5/2", "80")),
            canonical_bytes(producer.produce("5/2", "80")),
        )
        for lam in ("5/2", "9/2"):
            low = interval_inventory(self.runs[lam, "80"])
            high = interval_inventory(self.runs[lam, "160"])
            self.assertEqual(set(low), set(high))
            self.assertEqual(len(low), 15)
            for name in low:
                with self.subTest(lam=lam, interval=name):
                    self.assertLessEqual(low[name][0], high[name][0])
                    self.assertGreaterEqual(low[name][1], high[name][1])

    def test_interval_outputs_are_raw_positive_and_terminal_margin_is_positive(self) -> None:
        for payload in self.runs.values():
            inventory = interval_inventory(payload)
            for name, (lower, upper) in inventory.items():
                with self.subTest(name=name):
                    self.assertLessEqual(lower, upper)
            self.assertGreater(inventory["L"][0], 0)
            self.assertGreater(inventory["c"][0], 0)
            self.assertGreater(inventory["analytic_I0_lower_expression"][0], 0)
            self.assertGreater(inventory["rho"][0], 0)
            self.assertLess(inventory["rho"][1], 1)
            self.assertGreater(inventory["four_M_squared_minus_R"][0], 0)

    def test_source_and_implementation_hashes_are_live(self) -> None:
        binding = self.base["source_binding"]
        self.assertEqual(binding["formula_version"], producer.FORMULA_VERSION)
        self.assertEqual(binding["source_hashes"], dict(sorted(producer.SOURCE_HASHES.items())))
        for relative, expected in binding["source_hashes"].items():
            self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected)
        for item in binding["implementation_hashes"].values():
            self.assertEqual(hashlib.sha256((ROOT / item["path"]).read_bytes()).hexdigest(), item["sha256"])

    def test_independent_paths_and_shared_library_limitation_are_disclosed(self) -> None:
        producer_source = (ROOT / "src/explicit_mixed_prefix_cost.py").read_text(encoding="utf-8")
        verifier_source = (ROOT / "verifier/explicit_mixed_prefix_cost_replay.py").read_text(encoding="utf-8")
        self.assertNotEqual(hashlib.sha256(producer_source.encode()).digest(), hashlib.sha256(verifier_source.encode()).digest())
        self.assertNotIn("import explicit_mixed_prefix_cost", verifier_source)
        libraries = self.base["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertTrue(libraries["independent_formula_trees_required"])
        self.assertIn("share", libraries["independence_limitation"])

    def test_no_secret_environment_or_zero_table_access(self) -> None:
        for relative in (
            "src/explicit_mixed_prefix_cost.py",
            "verifier/explicit_mixed_prefix_cost_replay.py",
        ):
            source = (ROOT / relative).read_text(encoding="utf-8")
            imports, access = ast_environment_access(source)
            self.assertFalse(imports, relative)
            self.assertFalse(access, relative)
            lowered = source.lower()
            self.assertNotIn("zetazero", lowered)
            self.assertNotIn("zero_table", lowered)

    def test_producer_rejects_binary64_and_noncanonical_inputs(self) -> None:
        with self.assertRaises(TypeError):
            producer.produce(2.5, "80")
        with self.assertRaises(TypeError):
            producer.produce("2.5", "80")
        with self.assertRaises(ValueError):
            producer.produce("10/4", "80")
        with self.assertRaises(TypeError):
            producer.produce("5/2", 80)

    def test_rejects_wrong_c_and_formula_version(self) -> None:
        payload = self.payload()
        payload["source_conventions"]["prolate_parameter"] = "c=2*pi*lambda"
        self.reject(payload, "source convention")

        payload = self.payload()
        payload["formula_inventory"]["c"] = "2*pi*lambda"
        self.reject(payload, "formula inventory")

        payload = self.payload()
        payload["certificate"]["intervals"]["c"] = copy.deepcopy(
            payload["certificate"]["intervals"]["L"]
        )
        self.reject(payload, "c")

        payload = self.payload()
        payload["formula_version"] = "0.43-wrong"
        self.reject(payload, "fixed metadata")

    def test_rejects_floor_N_and_missing_parity_dimension(self) -> None:
        payload = self.payload()
        payload["inputs"]["N_rule"] = "floor(lambda^2)"
        self.reject(payload, "N rule")

        payload = self.payload()
        payload["certificate"]["exact"]["N"] = 6
        self.reject(payload, "exact formula mismatch: N")

        payload = self.payload()
        payload["certificate"]["exact"]["inversion_odd_dimension"] = 0
        self.reject(payload, "exact formula mismatch: inversion_odd_dimension")

        payload = self.payload()
        payload["source_conventions"]["target_dimension"] = "d=N+1 inversion-even only"
        self.reject(payload, "source convention")

    def test_rejects_tampered_Gamma_B_and_terminal_count(self) -> None:
        payload = self.payload()
        gamma = payload["certificate"]["exact"]["Gamma_lambda"]
        gamma["numerator"] = str(int(gamma["numerator"]) + 1)
        self.reject(payload, "Gamma_lambda")

        payload = self.payload()
        payload["certificate"]["intervals"]["B_lambda_N"] = copy.deepcopy(
            payload["certificate"]["intervals"]["c"]
        )
        self.reject(payload, "B_lambda_N")

        payload = self.payload()
        integers = payload["certificate"]["integers"]
        integers["terminal_count_M"] = str(int(integers["terminal_count_M"]) - 1)
        self.reject(payload, "terminal integer reconstruction")

    def test_rejects_low_precision_relabel_and_binary64_artifact(self) -> None:
        payload = self.payload()
        payload["inputs"]["dps"] = "160"
        self.reject(payload, "interval too wide for declared precision")

        payload = self.payload()
        payload["certificate"]["exact"]["lambda_squared"] = 6.25
        self.reject(payload, "binary64")

    def test_rejects_tampered_claims_checks_and_hashes(self) -> None:
        payload = self.payload()
        payload["claim_boundary"]["signed_physical_floor_proved"] = True
        self.reject(payload, "claim boundary")

        payload = self.payload()
        payload["certificate"]["checks"]["terminal_integer_dominates_R"] = False
        self.reject(payload, "failed check")

        payload = self.payload()
        payload["source_binding"]["source_hashes"]["requirements.txt"] = "0" * 64
        self.reject(payload, "formula/source binding")

    def test_static_artifacts_match_live_generation_and_replay(self) -> None:
        artifact_root = ROOT / "artifacts/explicit_mixed_prefix_cost"
        for lam_slug, lam in (("5_2", "5/2"), ("9_2", "9/2")):
            for dps in ("80", "160"):
                producer_path = artifact_root / f"lambda{lam_slug}_d{dps}_producer.json"
                replay_path = artifact_root / f"lambda{lam_slug}_d{dps}_replay.json"
                self.assertTrue(producer_path.is_file())
                self.assertTrue(replay_path.is_file())
                expected_producer = canonical_bytes(producer.produce(lam, dps))
                self.assertEqual(producer_path.read_bytes(), expected_producer)
                producer_payload = json.loads(expected_producer)
                expected_replay = verifier.canonical_bytes(
                    verifier.replay(producer_payload, producer_bytes=expected_producer)
                )
                self.assertEqual(replay_path.read_bytes(), expected_replay)


if __name__ == "__main__":
    unittest.main()
