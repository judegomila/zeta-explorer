from __future__ import annotations

import ast
import copy
import hashlib
import inspect
import json
from pathlib import Path
import sys
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

import leading_prolate_oscillation as producer  # noqa: E402
from verifier import leading_prolate_oscillation_replay as verifier  # noqa: E402


class LeadingProlateOscillationTests(unittest.TestCase):
    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (
            json.dumps(payload, indent=2, sort_keys=True) + "\n"
        ).encode("utf-8")

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=self._bytes(payload))

    def _assert_replay_rejects(
        self, payload: dict[str, object], pattern: str | None = None
    ) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None
            else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    def test_exact_replay_at_p5_and_p7(self) -> None:
        expected = {
            5: {
                "packet_count": 25,
                "max_certified_index": 24,
                "plus_target_count": 5,
                "plus_last_target": 24,
                "minus_target_count": 5,
                "minus_last_target": 22,
            },
            7: {
                "packet_count": 49,
                "max_certified_index": 48,
                "plus_target_count": 11,
                "plus_last_target": 48,
                "minus_target_count": 11,
                "minus_last_target": 46,
            },
        }
        for p, fields in expected.items():
            with self.subTest(lambda_numerator=p):
                payload = producer.produce(p)
                raw = self._bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                self.assertEqual(
                    report["status"],
                    "LEADING_PROLATE_OSCILLATION_EXACT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )
                self.assertFalse(report["checks"]["producer_booleans_trusted"])
                self.assertFalse(
                    report["arithmetic"]["transcendental_arithmetic_library_used"]
                )
                self.assertEqual(
                    payload["arithmetic"]["precision_mode"],
                    "exact rational; no finite precision parameter",
                )
                self.assertFalse(
                    payload["arithmetic"]["raw_interval_or_ball_output_applicable"]
                )
                reconstructed = report["reconstructed_certificate"]
                self.assertEqual(
                    reconstructed["packet_length"],
                    {"numerator": "2", "denominator": str(p * p)},
                )
                self.assertEqual(
                    reconstructed["packet_norm_squared"],
                    {"numerator": "1", "denominator": str(p * p)},
                )
                self.assertEqual(
                    reconstructed["packet_form_difference"],
                    {"numerator": "-1", "denominator": str(p * p)},
                )
                self.assertEqual(
                    reconstructed["unit_cosine_moments"],
                    {
                        "harmonic": 2,
                        "sin_harmonic_pi": {"numerator": "0", "denominator": "1"},
                        "cos_harmonic_pi": {"numerator": "1", "denominator": "1"},
                        "pi_times_J0": {"numerator": "0", "denominator": "1"},
                        "pi_squared_times_J1": {
                            "numerator": "0",
                            "denominator": "1",
                        },
                        "pi_squared_times_J2": {
                            "numerator": "1",
                            "denominator": "2",
                        },
                    },
                )
                self.assertTrue(
                    report["checks"]["cosine_moments_algebraically_reconstructed"]
                )
                for field, value in fields.items():
                    self.assertEqual(reconstructed[field], value)

    def test_producer_and_reconstructor_reject_nonexact_or_off_schedule_p(self) -> None:
        bad_values = (True, 5.0, 4, 3)
        for value in bad_values:
            with self.subTest(value=value, path="producer"):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(value)  # type: ignore[arg-type]
            with self.subTest(value=value, path="verifier"):
                with self.assertRaises(verifier.ReplayError):
                    verifier.reconstruct_certificate(value)  # type: ignore[arg-type]

    def test_replay_rejects_bool_float_even_and_subthreshold_inputs(self) -> None:
        for value in (False, 5.0, 6, 3):
            payload = producer.produce(5)
            payload["input"]["lambda_numerator"] = value
            with self.subTest(value=value):
                self._assert_replay_rejects(payload)

    def test_exact_producer_bytes_are_mandatory_and_bound_to_payload(self) -> None:
        payload = producer.produce(5)
        raw = self._bytes(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "must be exact bytes"):
            verifier.replay(payload, producer_bytes=raw.decode("utf-8"))  # type: ignore[arg-type]

        changed_payload = copy.deepcopy(payload)
        changed_payload["certificate"]["packet_count"] = 24
        with self.assertRaisesRegex(
            verifier.ReplayError, "do not decode exactly to replay payload"
        ):
            verifier.replay(changed_payload, producer_bytes=raw)

    def test_duplicate_json_keys_are_rejected_before_replay(self) -> None:
        raw = b'{"schema":"first","schema":"second"}'
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(raw, "adversarial artifact")

    def test_noncanonical_rational_serializations_are_rejected(self) -> None:
        bad_values = (
            {"numerator": "01", "denominator": "25"},
            {"numerator": "1", "denominator": "025"},
            {"numerator": "2", "denominator": "50"},
            {"numerator": 1, "denominator": "25"},
            {"numerator": "1", "denominator": 25},
        )
        for value in bad_values:
            payload = producer.produce(5)
            payload["certificate"]["packet_norm_squared"] = value
            with self.subTest(value=value):
                self._assert_replay_rejects(payload, "canonical|rational")

    def test_packet_length_and_form_minus_sign_mutations_are_rejected(self) -> None:
        payload = producer.produce(5)
        payload["certificate"]["packet_length"] = {
            "numerator": "1",
            "denominator": "25",
        }
        self._assert_replay_rejects(payload, "independent reconstruction")

        payload = producer.produce(5)
        payload["certificate"]["packet_form_difference"] = {
            "numerator": "1",
            "denominator": "25",
        }
        self._assert_replay_rejects(payload, "independent reconstruction")

        payload = producer.produce(5)
        payload["certificate"]["unit_cosine_moments"][
            "pi_squared_times_J2"
        ] = {"numerator": "1", "denominator": "3"}
        self._assert_replay_rejects(payload, "independent reconstruction")

    def test_transition_count_and_extra_target_are_rejected(self) -> None:
        mutations = {
            "transition_count": 26,
            "max_certified_index": 25,
            "plus_last_target": 25,
            "minus_last_target": 26,
        }
        for field, value in mutations.items():
            payload = producer.produce(5)
            payload["certificate"][field] = value
            with self.subTest(field=field):
                self._assert_replay_rejects(payload, "independent reconstruction")

    def test_lambda_in_place_of_lambda_squared_is_rejected(self) -> None:
        payload = producer.produce(5)
        payload["certificate"]["lambda_squared"] = copy.deepcopy(
            payload["certificate"]["lambda"]
        )
        self._assert_replay_rejects(payload, "independent reconstruction")

    def test_source_hash_lock_formula_claim_and_status_promotions_are_rejected(
        self,
    ) -> None:
        mutations: list[tuple[str, object]] = []

        payload = producer.produce(5)
        payload["source_hashes"][producer.NOTE] = "0" * 64
        mutations.append(("source-note-hash", payload))

        payload = producer.produce(5)
        payload["source_hashes"][producer.SOURCE_LOCK] = "0" * 64
        mutations.append(("source-lock-hash", payload))

        payload = producer.produce(5)
        payload["locked_formulas"]["packet_length"] = "ell=pi/c=2/p"
        mutations.append(("locked-formula", payload))

        payload = producer.produce(5)
        payload["claim_scope"]["proved"].append(
            "equation (5.2) of DIRECT_RH_ATTACK.md"
        )
        mutations.append(("claim-promotion", payload))

        payload = producer.produce(5)
        payload["source_admissions"]["equation_5_2_claimed"] = True
        mutations.append(("admission-promotion", payload))

        payload = producer.produce(5)
        payload["arithmetic"]["precision_mode"] = "binary64"
        mutations.append(("arithmetic-promotion", payload))

        payload = producer.produce(5)
        payload["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        mutations.append(("terminal-status-promotion", payload))

        payload = producer.produce(5)
        payload["status"] = "LEADING_PROLATE_OSCILLATION_FULL_PASS"
        mutations.append(("component-status-promotion", payload))

        for label, mutated in mutations:
            with self.subTest(mutation=label):
                self._assert_replay_rejects(mutated)  # type: ignore[arg-type]

    def test_pinned_source_lock_bytes_are_rehashed(self) -> None:
        payload = producer.produce(5)
        with mock.patch.dict(
            verifier.PINNED_HASHES,
            {verifier.SOURCE_LOCK: "0" * 64},
            clear=False,
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "source byte hash mismatch"):
                self._replay(payload)

    def test_verifier_imports_no_producer_and_calls_clean_room_reconstruction(
        self,
    ) -> None:
        verifier_path = ROOT / "verifier/leading_prolate_oscillation_replay.py"
        source = verifier_path.read_text(encoding="utf-8")
        tree = ast.parse(source)
        imported_modules: list[str] = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported_modules.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module is not None:
                imported_modules.append(node.module)
        self.assertFalse(
            any(
                name == "leading_prolate_oscillation"
                or name.startswith("src.leading_prolate_oscillation")
                for name in imported_modules
            )
        )

        payload = producer.produce(5)
        original = verifier.reconstruct_certificate
        with mock.patch.object(
            verifier, "reconstruct_certificate", wraps=original
        ) as reconstruction:
            report = self._replay(payload)
        reconstruction.assert_called_once_with(5)
        self.assertEqual(
            report["reconstructed_certificate"], original(5)
        )
        self.assertIn(
            "reconstruct_certificate(p)", inspect.getsource(verifier.replay)
        )


if __name__ == "__main__":
    unittest.main()
