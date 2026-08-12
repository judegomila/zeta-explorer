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

import odd_nu_transverse_sign as producer  # noqa: E402
from verifier import odd_nu_transverse_sign_replay as verifier  # noqa: E402


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
    tails = certificate["interval_log_tails"]
    assert isinstance(tails, dict)
    keys = (
        "log_weighted_partial",
        "inverse_log_weighted_partial",
        "dyadic_log_band",
        "scaled_dyadic_log_band",
    )
    return {key: interval_bounds(tails[key]) for key in keys}


def environment_access(source: str) -> tuple[set[str], set[str]]:
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


class OddNuTransverseSignTests(unittest.TestCase):
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

    def test_all_four_pilots_replay_independently(self) -> None:
        for (p, dps), payload in self.runs.items():
            with self.subTest(p=p, dps=dps):
                raw = canonical_bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                reconstructed = report["reconstructed"]
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertTrue(reconstructed["exact_third_moment_identity"])
                self.assertEqual(rational(reconstructed["third_moment_nu"]), Fraction(989, 360))
                self.assertEqual(
                    [rational(value) for value in reconstructed["nested_transverse_floors"]],
                    [Fraction(7), Fraction(5), Fraction(4), Fraction(3), Fraction(2)],
                )
                self.assertTrue(reconstructed["same_jump_opposite_nu_signs"])
                self.assertTrue(reconstructed["cyclic_data_do_not_force_floor"])
                self.assertTrue(reconstructed["same_nu_opposite_inverse_load_decisions"])
                self.assertEqual(reconstructed["interval_count"], 4)
                self.assertEqual(reconstructed["finite_tail_length"], int(p) - 2)
                self.assertFalse(reconstructed["uniform_arithmetic_schedule_proved"])
                self.assertEqual(report["producer_binding"]["sha256"], hashlib.sha256(raw).hexdigest())

    def test_exact_third_moment_identity_and_hermitian_fixture(self) -> None:
        exact = self.base["certificate"]["exact_third_moment"]
        q = [[rational(entry) for entry in row] for row in exact["Q"]]
        self.assertEqual(q, [list(row) for row in zip(*q)])
        self.assertEqual(rational(exact["nu_direct"]), Fraction(989, 360))
        self.assertEqual(rational(exact["nu_direct"]), rational(exact["nu_moment_polynomial"]))
        assembled = [[rational(entry) for entry in row] for row in exact["assembled_Q"]]
        self.assertEqual(assembled, q)

    def test_nested_spaces_and_monotone_positive_floors(self) -> None:
        nested = self.base["certificate"]["nested_transverse_spaces"]
        floors = [rational(row["floor"]) for row in nested["rows"]]
        self.assertEqual(floors, [Fraction(7), Fraction(5), Fraction(4), Fraction(3), Fraction(2)])
        self.assertTrue(all(value > 0 for value in floors))
        self.assertTrue(all(right <= left for left, right in zip(floors, floors[1:])))
        self.assertEqual(rational(nested["claimed_common_floor"]), floors[-1])
        self.replay(self.payload())

    def test_three_countermodels_reconstruct_for_both_finite_tails(self) -> None:
        for p in ("5", "9"):
            fixture = self.runs[p, "80"]["certificate"]["jump_compatible_countermodels"]
            sign = fixture["sign_model"]
            invisible = fixture["invisible_floor_model"]
            inverse = fixture["inverse_load_model"]
            with self.subTest(p=p):
                self.assertGreater(rational(sign["nu_plus"]), 0)
                self.assertLess(rational(sign["nu_minus"]), 0)
                self.assertEqual(invisible["cyclic_moments_good"], invisible["cyclic_moments_bad"])
                self.assertGreater(rational(invisible["good_floor"]), 0)
                self.assertLess(rational(invisible["bad_floor"]), 0)
                self.assertEqual(rational(inverse["nu1"]), rational(inverse["nu2"]))
                self.assertLess(rational(inverse["chi1"]), rational(inverse["pole_axis_surplus"]))
                self.assertLess(rational(inverse["pole_axis_surplus"]), rational(inverse["chi2"]))

    def test_deterministic_doubled_precision_intervals_are_nested_and_positive(self) -> None:
        self.assertEqual(canonical_bytes(producer.produce("5", "80")), canonical_bytes(producer.produce("5", "80")))
        for p in ("5", "9"):
            low = interval_inventory(self.runs[p, "80"])
            high = interval_inventory(self.runs[p, "160"])
            self.assertEqual(set(low), set(high))
            for name in low:
                with self.subTest(p=p, interval=name):
                    self.assertLessEqual(low[name][0], high[name][0])
                    self.assertGreaterEqual(low[name][1], high[name][1])
                    self.assertGreater(low[name][0], 0)

    def test_source_hashes_are_live_and_bind_the_corrected_note(self) -> None:
        self.assertEqual(self.base["source_hashes"], dict(sorted(producer.EXPECTED_SOURCE_HASHES.items())))
        for relative, expected in producer.EXPECTED_SOURCE_HASHES.items():
            self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected)
        self.assertEqual(
            producer.EXPECTED_SOURCE_HASHES["notes/ODD_NU_TRANSVERSE_SIGN_ATTACK.md"],
            "828a53666436f8e6f7a71310cceacee2f79d6faf6803615b205459cb03e574fc",
        )

    def test_formula_paths_are_independent_and_shared_library_limit_is_explicit(self) -> None:
        producer_source = (ROOT / "src/odd_nu_transverse_sign.py").read_text(encoding="utf-8")
        verifier_source = (ROOT / "verifier/odd_nu_transverse_sign_replay.py").read_text(encoding="utf-8")
        self.assertNotEqual(hashlib.sha256(producer_source.encode()).digest(), hashlib.sha256(verifier_source.encode()).digest())
        self.assertNotIn("import odd_nu_transverse_sign", verifier_source)
        arithmetic = self.base["arithmetic"]
        self.assertTrue(arithmetic["shared_library_with_verifier"])
        self.assertTrue(arithmetic["independent_formula_trees_required"])
        self.assertIn("share", arithmetic["independence_limitation"])
        for source in (producer_source, verifier_source):
            imports, access = environment_access(source)
            self.assertFalse(imports)
            self.assertFalse(access)

    def test_producer_rejects_binary64_and_noncanonical_inputs(self) -> None:
        with self.assertRaises(TypeError):
            producer.produce(5.0, "80")
        with self.assertRaises(TypeError):
            producer.produce("5", 80.0)
        with self.assertRaises(TypeError):
            producer.produce("05", "80")
        with self.assertRaises(ValueError):
            producer.produce("7", "80")
        with self.assertRaises(ValueError):
            producer.produce("5", "81")

    def test_rejects_binary64_anywhere_and_noncanonical_raw_bytes(self) -> None:
        payload = self.payload()
        payload["certificate"]["exact_third_moment"]["alpha"] = 1.5
        self.reject(payload, "binary64")
        payload = self.payload()
        raw = canonical_bytes(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "canonical"):
            verifier.replay(payload, producer_bytes=raw + b" ")

    def test_rejects_wrong_fourier_pole_prime_and_endpoint_declarations(self) -> None:
        mutations = {
            "fourier_kernel": "exp(+itx)",
            "odd_pole_coefficient": "+2",
            "prime_block_coefficient": "+1",
            "prime_power_endpoint": "exclusive n<lambda^2",
        }
        for key, value in mutations.items():
            payload = self.payload()
            payload["conventions"][key] = value
            with self.subTest(key=key):
                self.reject(payload, "convention")

    def test_rejects_actual_wrong_pole_and_prime_sign_data(self) -> None:
        payload = self.payload()
        payload["certificate"]["exact_third_moment"]["odd_pole_coefficient"]["numerator"] = "2"
        self.reject(payload, "odd_pole_coefficient")

        payload = self.payload()
        payload["certificate"]["exact_third_moment"]["prime_block_coefficient"]["numerator"] = "1"
        self.reject(payload, "prime_block_coefficient")

        payload = self.payload()
        entry = payload["certificate"]["exact_third_moment"]["archimedean_block"][0][0]
        entry["numerator"] = str(int(entry["numerator"]) + 1)
        self.reject(payload, "archimedean_block")

    def test_rejects_cached_matrices_and_producer_pass_booleans(self) -> None:
        payload = self.payload()
        payload["provenance"]["cached_matrix_input_used"] = True
        self.reject(payload, "provenance")

        payload = self.payload()
        payload["provenance"]["producer_pass_booleans_used_by_verifier"] = True
        self.reject(payload, "provenance")

        payload = self.payload()
        payload["certificate"]["cached_matrix"] = []
        self.reject(payload, "certificate key inventory")

        payload = self.payload()
        payload["certificate"]["producer_pass"] = True
        self.reject(payload, "certificate key inventory")

    def test_rejects_nonpositive_or_mutated_transverse_floor(self) -> None:
        payload = self.payload()
        payload["certificate"]["nested_transverse_spaces"]["claimed_common_floor"] = {
            "numerator": "0", "denominator": "1"
        }
        self.reject(payload, "claimed floor")

        payload = self.payload()
        payload["certificate"]["nested_transverse_spaces"]["rows"][-1]["floor"] = {
            "numerator": "-1", "denominator": "1"
        }
        self.reject(payload, "floor")

    def test_rejects_substituting_nu_for_inverse_load(self) -> None:
        payload = self.payload()
        inverse = payload["certificate"]["jump_compatible_countermodels"]["inverse_load_model"]
        inverse["nu_substituted_for_inverse_load"] = True
        self.reject(payload, "substituted")

        payload = self.payload()
        inverse = payload["certificate"]["jump_compatible_countermodels"]["inverse_load_model"]
        inverse["chi1"] = copy.deepcopy(inverse["nu1"])
        self.reject(payload, "chi1")

    def test_rejects_tail_omission_and_interval_endpoint_mutations(self) -> None:
        payload = self.payload()
        payload["certificate"]["jump_compatible_countermodels"]["tail_rows"].pop()
        self.reject(payload, "tail inventory")

        payload = self.payload()
        payload["certificate"]["interval_log_tails"]["partial_end"] = 24
        self.reject(payload, "range")

        payload = self.payload()
        interval = payload["certificate"]["interval_log_tails"]["dyadic_log_band"]["dyadic"]
        interval["lower"] = copy.deepcopy(interval["upper"])
        self.reject(payload, "endpoint|interval")

        payload = self.payload()
        payload["certificate"]["interval_log_tails"]["dyadic_log_band"]["decimal"] = ["999", "1000"]
        self.reject(payload, "decimal/dyadic mismatch")

    def test_rejects_claim_escalation_source_mutation_and_secret_like_values(self) -> None:
        payload = self.payload()
        payload["claim_boundary"]["explicit_unbounded_schedule_proved"] = True
        self.reject(payload, "claim boundary")

        payload = self.payload()
        payload["source_hashes"]["requirements.txt"] = "0" * 64
        self.reject(payload, "source hash")

        payload = self.payload()
        payload["untrusted"] = "Bearer fake-token-12345678"
        self.reject(payload, "secret-like")

    def test_static_artifacts_match_live_generation_and_replay(self) -> None:
        artifact_root = ROOT / "artifacts/odd_nu_transverse_sign"
        for p in ("5", "9"):
            for dps in ("80", "160"):
                producer_path = artifact_root / f"p{p}_d{dps}_producer.json"
                replay_path = artifact_root / f"p{p}_d{dps}_replay.json"
                self.assertTrue(producer_path.is_file())
                self.assertTrue(replay_path.is_file())
                expected_producer = canonical_bytes(producer.produce(p, dps))
                self.assertEqual(producer_path.read_bytes(), expected_producer)
                payload = json.loads(expected_producer)
                expected_replay = canonical_bytes(verifier.replay(payload, producer_bytes=expected_producer))
                self.assertEqual(replay_path.read_bytes(), expected_replay)


if __name__ == "__main__":
    unittest.main()
