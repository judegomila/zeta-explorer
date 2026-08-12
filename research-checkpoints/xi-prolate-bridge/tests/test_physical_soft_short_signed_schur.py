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
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import physical_soft_short_signed_schur as producer  # noqa: E402
from verifier import physical_soft_short_signed_schur_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


class PhysicalSoftShortSignedSchurTests(unittest.TestCase):
    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=self._bytes(payload))

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    @staticmethod
    def _models() -> dict[str, object]:
        return producer.produce(5, 80)["certificate"]["exact_regressions"]

    def test_p5_p7_base_and_doubled_labels_replay_deterministically(self) -> None:
        for p, expected_n in ((5, 7), (7, 13)):
            for dps in (80, 160):
                payload = producer.produce(p, dps)
                self.assertEqual(payload, producer.produce(p, dps))
                schedule = payload["certificate"]["exact_schedule_metadata"]
                self.assertEqual(schedule["lambda"], R(p, 2))
                self.assertEqual(schedule["N"], expected_n)
                raw = self._bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                self.assertEqual(
                    report["result"],
                    "PHYSICAL_SOFT_SHORT_SIGNED_SCHUR_COMPONENT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )
                self.assertFalse(report["producer_pass_boolean_trusted"])

    def test_feature_ldl_and_inverse_are_reconstructed(self) -> None:
        model = self._models()["feature_LDL"]
        self.assertEqual(model["M_H"], [[R(2), R(1)], [R(1), R(0)]])
        self.assertEqual(model["signed_diagonal"], [[R(2), R(0)], [R(0), R(-1, 2)]])
        self.assertEqual(model["LDL_reconstruction"], model["M_H"])
        self.assertEqual(model["direct_inverse"], [[R(0), R(1)], [R(1), R(-2)]])
        self.assertTrue(model["factorization_matches"])
        self.assertTrue(model["inverse_matches"])

    def test_soft_short_is_exact_and_beats_hard_over_shorting(self) -> None:
        model = self._models()["soft_beats_hard_over_shorting"]
        self.assertEqual(model["B"], [[R(1), R(0)], [R(0), R(1)]])
        self.assertEqual(model["A0"], R(2))
        self.assertEqual(model["Z"], [[R(1, 2)]])
        self.assertEqual(model["W"], [[R(1, 2)]])
        self.assertEqual(model["Psoft"], R(3, 2))
        self.assertEqual(model["Ytilde"], [R(1, 2)])
        self.assertEqual(model["negative_soft_load"], R(1, 2))
        self.assertEqual(model["physical_schur"], R(1))
        self.assertEqual(model["direct_physical_schur"], R(1))
        self.assertEqual(model["hard_C_short"], R(0))
        self.assertEqual(model["hard_comparison_determinant"], R(-1))
        self.assertTrue(model["soft_contraction_passes"])

    def test_nonisometric_source_metric_is_retained(self) -> None:
        model = self._models()["soft_beats_hard_over_shorting"]
        self.assertEqual(model["source_A"], R(2))
        self.assertEqual(model["Delta"], R(1, 4))
        self.assertEqual(model["source_metric_base_g_A_star_A"], R(4))
        self.assertEqual(model["wrong_isometric_base_g_I"], R(1))
        self.assertEqual(model["G"], R(6))
        self.assertEqual(model["source_negative_load"], R(2))
        self.assertEqual(model["pulled_schur"], R(4))
        self.assertEqual(model["theta_soft"], R(1, 3))
        self.assertEqual(model["tau_exact"], R(2, 3))

    def test_theta_and_high_equalities_are_rejections(self) -> None:
        models = self._models()
        theta = models["theta_equality_rejection"]
        self.assertEqual(theta["theta_soft"], R(1))
        self.assertEqual(theta["physical_schur"], R(0))
        self.assertFalse(theta["soft_contraction_passes"])
        high = models["high_equality_rejection"]
        self.assertEqual(high["zeta"], R(1))
        self.assertEqual(high["high_block"], R(0))
        self.assertFalse(high["passes"])

    def test_odd_negative_pole_row_is_mandatory(self) -> None:
        model = self._models()["odd_negative_pole_required"]
        with_pole = model["with_pole"]
        without = model["without_pole_adversary"]
        self.assertEqual(with_pole["Y_feature"], [[R(0), R(1, 2)], [R(1), R(0)]])
        self.assertEqual(with_pole["delta"], R(3, 4))
        self.assertEqual(with_pole["theta_soft"], R(1))
        self.assertFalse(with_pole["soft_contraction_passes"])
        self.assertEqual(without["theta_soft"], R(0))
        self.assertTrue(without["soft_contraction_passes"])

    def test_mutated_feature_soft_short_and_metric_are_rejected(self) -> None:
        paths = (
            ("X_feature", [[R(2), R(1)]]),
            ("Psoft", R(7, 4)),
            ("Ytilde", [R(0)]),
            ("physical_schur", R(2)),
            ("source_metric_base_g_A_star_A", R(1)),
            ("theta_soft", R(1, 2)),
        )
        for key, value in paths:
            with self.subTest(key=key):
                payload = producer.produce(5, 80)
                payload["certificate"]["exact_regressions"]["soft_beats_hard_over_shorting"][key] = value
                self._reject(payload, "rebuilt regressions")

    def test_pole_omission_and_false_boundary_passes_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        pole = payload["certificate"]["exact_regressions"]["odd_negative_pole_required"]["with_pole"]
        pole["Y_feature"] = pole["Y_feature"][:1]
        self._reject(payload, "rebuilt regressions")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["theta_equality_rejection"]["soft_contraction_passes"] = True
        self._reject(payload, "rebuilt regressions")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["high_equality_rejection"]["passes"] = True
        self._reject(payload, "rebuilt regressions")

    def test_claim_boundary_and_source_admissions_are_exact(self) -> None:
        payload = producer.produce(5, 80)
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertFalse(any(payload["source_admissions"].values()))
        self.assertFalse(payload["source_admissions"]["api_key_read"])
        self.assertFalse(payload["source_admissions"]["secret_serialized"])
        self.assertIn("common unbounded schedule", " ".join(payload["claim_scope"]["not_proved"]))

        for key in ("api_key_read", "odd_negative_pole_omitted", "signed_sector_floor_claimed"):
            changed = producer.produce(5, 80)
            changed["source_admissions"][key] = True
            self._reject(changed, "source admissions")

    def test_locked_convention_and_source_hash_mutations_are_rejected(self) -> None:
        changed = producer.produce(5, 80)
        changed["locked_conventions"]["prime_sign"] = "plus sign"
        self._reject(changed, "locked conventions")

        changed = producer.produce(5, 80)
        key = next(iter(changed["source_hashes"]))
        changed["source_hashes"][key] = "0" * 64
        self._reject(changed, "source hashes")

    def test_raw_bytes_duplicate_keys_binary64_and_noncanonical_rationals_rejected(self) -> None:
        payload = producer.produce(5, 80)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)

        raw = self._bytes(payload)
        duplicate = raw.replace(b'{\n  "arithmetic":', b'{\n  "schema": "duplicate",\n  "arithmetic":', 1)
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(duplicate, "adversarial artifact")

        binary = copy.deepcopy(payload)
        binary["input"]["dps"] = 80.0
        binary_raw = self._bytes(binary)
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads(binary_raw, "adversarial artifact")

        noncanonical = producer.produce(5, 80)
        noncanonical["certificate"]["exact_schedule_metadata"]["lambda"]["numerator"] = "05"
        self._reject(noncanonical, "noncanonical")

    def test_nonexact_and_off_schedule_inputs_are_rejected(self) -> None:
        for value in (True, 5.0, 4, 3):
            with self.subTest(value=value):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(value, 80)  # type: ignore[arg-type]
        for value in (False, 80.0, 49):
            with self.subTest(dps=value):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(5, value)  # type: ignore[arg-type]

    def test_payload_contains_no_binary_floats(self) -> None:
        def visit(value: object) -> None:
            self.assertNotIsInstance(value, float)
            if isinstance(value, dict):
                for child in value.values():
                    visit(child)
            elif isinstance(value, list):
                for child in value:
                    visit(child)

        visit(producer.produce(5, 80))

    def test_source_pins_are_final_and_note_has_no_tab_damage(self) -> None:
        note = (ROOT / producer.NOTE).read_text(encoding="utf-8")
        self.assertNotIn("\t", note)
        self.assertIn("\\boxed", note)
        for value in producer.PINNED_HASHES.values():
            self.assertRegex(value, r"^[0-9a-f]{64}$")
        with mock.patch.object(
            producer,
            "PINNED_HASHES",
            {producer.NOTE: "TO_BE_FINALIZED", producer.LOCK: producer.PINNED_HASHES[producer.LOCK]},
        ):
            with self.assertRaisesRegex(ValueError, "unfinalized source hash"):
                producer._verified_source_hashes()
        with mock.patch.object(
            verifier,
            "PINNED_HASHES",
            {verifier.LOCK: verifier.PINNED_HASHES[verifier.LOCK]},
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "note and lock"):
                verifier._source_hashes()

    def test_independent_paths_do_not_import_each_other_or_read_environment(self) -> None:
        producer_tree = ast.parse((ROOT / "src/physical_soft_short_signed_schur.py").read_text())
        verifier_tree = ast.parse((ROOT / "verifier/physical_soft_short_signed_schur_replay.py").read_text())
        def imports(tree: ast.AST) -> set[str]:
            names = {
                alias.name for node in ast.walk(tree) if isinstance(node, ast.Import)
                for alias in node.names
            }
            names.update(
                node.module for node in ast.walk(tree)
                if isinstance(node, ast.ImportFrom) and node.module is not None
            )
            return names

        producer_imports = imports(producer_tree)
        verifier_imports = imports(verifier_tree)
        self.assertNotIn("physical_soft_short_signed_schur_replay", producer_imports)
        self.assertNotIn("physical_soft_short_signed_schur", verifier_imports)
        for tree in (producer_tree, verifier_tree):
            attributes = [node for node in ast.walk(tree) if isinstance(node, ast.Attribute)]
            names = [node for node in ast.walk(tree) if isinstance(node, ast.Name)]
            self.assertFalse(any(node.attr in {"getenv", "environ"} for node in attributes))
            self.assertFalse(any(node.id in {"getenv", "environ"} for node in names))


if __name__ == "__main__":
    unittest.main()
