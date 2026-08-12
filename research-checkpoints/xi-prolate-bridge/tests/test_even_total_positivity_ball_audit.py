from __future__ import annotations

import re
from decimal import Decimal
from pathlib import Path
import tempfile
import unittest

from verifier import even_total_positivity_ball_audit as audit_module


ROOT = Path(__file__).resolve().parents[1]
BALL_ROOT = ROOT / "artifacts" / "p0_ball_pilots" / "lambda2_N4"


class EvenTotalPositivityBallAuditTests(unittest.TestCase):
    def audit(self, bits: int, producer: Path | None = None, verifier: Path | None = None):
        return audit_module.audit(
            producer or BALL_ROOT / f"producer_{bits}bits.txt",
            verifier or BALL_ROOT / f"verifier_{bits}bits.txt",
            lambda_text="2",
            N=4,
            precision_bits=bits,
        )

    def test_256_and_512_bit_paths_prove_opposite_order_two_signs(self) -> None:
        for bits in (256, 512):
            with self.subTest(bits=bits):
                result = self.audit(bits)
                self.assertEqual(result["status"], "BALL_ROUTE_OBSTRUCTION_PASS")
                self.assertEqual(result["terminal_state"], "P0_INVALIDATED")
                self.assertFalse(result["checks"]["producer_booleans_trusted"])
                self.assertFalse(result["checks"]["verifier_booleans_trusted"])
                self.assertTrue(
                    result["checks"]["hermitian_interval_overlap_recomputed"]
                )
                self.assertTrue(
                    result["checks"]["inversion_interval_overlap_recomputed"]
                )
                for role in ("producer", "verifier"):
                    delta = result[role]["minor_intervals"]["delta_1324"]
                    principal = result[role]["minor_intervals"]["principal_01"]
                    self.assertLess(Decimal(delta["upper"]), 0)
                    self.assertGreater(Decimal(principal["lower"]), 0)

    def test_binary64_and_wrong_locked_pilot_are_rejected(self) -> None:
        producer = BALL_ROOT / "producer_256bits.txt"
        verifier = BALL_ROOT / "verifier_256bits.txt"
        with self.assertRaisesRegex(audit_module.BallAuditError, "binary64"):
            audit_module.audit(
                producer,
                verifier,
                lambda_text=2.0,  # type: ignore[arg-type]
                N=4,
                precision_bits=256,
            )
        with self.assertRaisesRegex(audit_module.BallAuditError, "locked route-obstruction"):
            audit_module.audit(
                producer,
                verifier,
                lambda_text="3",
                N=4,
                precision_bits=256,
            )

    def test_truncated_or_nonoverlapping_raw_output_is_rejected(self) -> None:
        producer_text = (BALL_ROOT / "producer_256bits.txt").read_text(encoding="utf-8")
        verifier_text = (BALL_ROOT / "verifier_256bits.txt").read_text(encoding="utf-8")
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            producer = root / "producer.txt"
            verifier = root / "verifier.txt"
            producer.write_text(
                re.sub(r"^ENTRY 4 4 Q .*\n", "", producer_text, count=1, flags=re.MULTILINE),
                encoding="utf-8",
            )
            verifier.write_text(verifier_text, encoding="utf-8")
            with self.assertRaisesRegex(audit_module.BallAuditError, "incomplete"):
                self.audit(256, producer, verifier)

            producer.write_text(producer_text, encoding="utf-8")
            verifier.write_text(
                re.sub(
                    r"^ENTRY 0 0 Q \[[^\n]+$",
                    "ENTRY 0 0 Q [99 +/- 1e-100]",
                    verifier_text,
                    count=1,
                    flags=re.MULTILINE,
                ),
                encoding="utf-8",
            )
            with self.assertRaisesRegex(audit_module.BallAuditError, "do not overlap"):
                self.audit(256, producer, verifier)

    def test_positive_delta_mutation_is_rejected_even_when_paths_agree(self) -> None:
        producer_text = (BALL_ROOT / "producer_256bits.txt").read_text(encoding="utf-8")
        verifier_text = (BALL_ROOT / "verifier_256bits.txt").read_text(encoding="utf-8")

        def weaken_second_product(text: str) -> str:
            entries = set()
            for n, m in ((1, 4), (1, -4), (3, 2), (3, -2)):
                entries.update(((n, m), (m, n), (-n, -m), (-m, -n)))
            for n, m in sorted(entries):
                text, count = re.subn(
                    rf"^ENTRY {n} {m} Q \[[^\n]+$",
                    f"ENTRY {n} {m} Q [0.0001 +/- 1e-100]",
                    text,
                    count=1,
                    flags=re.MULTILINE,
                )
                self.assertEqual(count, 1)
            return text

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            producer = root / "producer.txt"
            verifier = root / "verifier.txt"
            producer.write_text(weaken_second_product(producer_text), encoding="utf-8")
            verifier.write_text(weaken_second_product(verifier_text), encoding="utf-8")
            with self.assertRaisesRegex(audit_module.BallAuditError, "not strictly negative"):
                self.audit(256, producer, verifier)

    def test_reflection_mutation_is_rejected_even_when_paths_agree(self) -> None:
        producer_text = (BALL_ROOT / "producer_256bits.txt").read_text(encoding="utf-8")
        verifier_text = (BALL_ROOT / "verifier_256bits.txt").read_text(encoding="utf-8")

        def break_reflection(text: str) -> str:
            for n, m in ((-1, 2), (2, -1)):
                text, count = re.subn(
                    rf"^ENTRY {n} {m} Q \[[^\n]+$",
                    f"ENTRY {n} {m} Q [0.123 +/- 1e-100]",
                    text,
                    count=1,
                    flags=re.MULTILINE,
                )
                self.assertEqual(count, 1)
            return text

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            producer = root / "producer.txt"
            verifier = root / "verifier.txt"
            producer.write_text(break_reflection(producer_text), encoding="utf-8")
            verifier.write_text(break_reflection(verifier_text), encoding="utf-8")
            with self.assertRaisesRegex(audit_module.BallAuditError, "inversion-reflected"):
                self.audit(256, producer, verifier)

    def test_printed_pass_booleans_are_not_used_as_evidence(self) -> None:
        producer_text = (BALL_ROOT / "producer_256bits.txt").read_text(encoding="utf-8")
        verifier_text = (BALL_ROOT / "verifier_256bits.txt").read_text(encoding="utf-8")
        producer_text = producer_text.replace(
            "CHECK hermitian_and_inversion_overlap=PASS",
            "CHECK hermitian_and_inversion_overlap=UNTRUSTED",
        )
        verifier_text = verifier_text.replace(
            "CHECK producer_verifier_entrywise_ball_overlap=PASS",
            "CHECK producer_verifier_entrywise_ball_overlap=UNTRUSTED",
        )
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            producer = root / "producer.txt"
            verifier = root / "verifier.txt"
            producer.write_text(producer_text, encoding="utf-8")
            verifier.write_text(verifier_text, encoding="utf-8")
            result = self.audit(256, producer, verifier)
            self.assertTrue(result["checks"]["entrywise_ball_overlap_recomputed"])


if __name__ == "__main__":
    unittest.main()
