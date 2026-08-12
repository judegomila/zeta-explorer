#!/usr/bin/env python3
"""Regressions for the growing low-prefix signed-complement gate."""

from __future__ import annotations

import ast
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_LOW_PREFIX_SIGNED_COMPLEMENT_ASSEMBLY_GATE.md"
NOTE_HASH = "1349149ab3dd5e91afdf677d208c1b9a77b67b4baccbcad1f56d3cab27ba169c"

FROZEN = {
    "notes/FIXED_TO_GROWING_TOEPLITZ_OPERATOR_NORM_GATE.md":
        "57f4a8014e280e4594221b4466212b0104d2d7c25e9e6ff81808a4eb7f14ce25",
    "tests/test_fixed_to_growing_toeplitz_operator_norm_gate.py":
        "4b2d982c5de1b28fe3bac56e412f43a6a333bf47e643cf6bd435e589271bbf31",
    "notes/GROWING_TRANSITION_ENDPOINT_NULL_COLLECTIVE_DILATION_FRAME_REDUCTION.md":
        "bbffec21c91b1e1150e36c9b2120b9255f1d0aa1bd4a1c7ec226e02db8d6abe6",
    "tests/test_growing_transition_endpoint_null_collective_dilation_frame_reduction.py":
        "eb25ab43e4f5fdeea96d89aa425ac2a9ab4f7cbdd0feaad3294e494387840f66",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "tests/test_growing_transition_equality_conductor_garding_theorem.py":
        "61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GENERIC_FIXED_INVERSION_EVEN_COMPLETE_WEIGHTED_PAIR_THEOREM.md":
        "c53a709dd1d7603ef1d2361c324a3f91f471705989ee06cd0f715fe4da4ec213",
    "tests/test_generic_fixed_inversion_even_complete_weighted_pair_theorem.py":
        "3dea227c95a0a514578229b2e07b13e4d42ab57f7c5459245c9796ce3344cbe1",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
        "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
    "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
        "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
    "notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md":
        "caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd",
    "tests/test_moving_label_carrier_coframe_defect_right_inverse_theorem.py":
        "31f8ffad0dc5a1f2b6a00a47b55238d64d9bc6550813d5b77b15c00da1757913",
    "notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md":
        "1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce",
    "tests/test_growing_low_prefix_complete_profile_fio_reduction.py":
        "ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def min_eigenvalue_2x2(a: float, b: float, d: float) -> float:
    return 0.5 * (a + d - math.hypot(a - d, 2 * b))


class GrowingLowPrefixSignedComplementAssemblyGateTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(f"`{relative}`", self.text)
            self.assertIn(f"`{expected}`", self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_positive_gram_does_not_control_signed_negative_part(self) -> None:
        for ell in (10.0, 100.0, 1000.0):
            gram = ell
            signed = -ell
            self.assertEqual(gram, ell)
            self.assertEqual(max(0.0, -signed), ell)
            self.assertFalse(max(0.0, -signed) / ell < 0.01)

    def test_alternating_hankel_is_rank_one_with_norm_m(self) -> None:
        for size in (1, 4, 17, 64):
            vector = [(-1.0) ** index for index in range(size)]
            trace = sum(value * value for value in vector)
            frobenius_squared = sum(
                (vector[j] * vector[k]) ** 2
                for j in range(size) for k in range(size)
            )
            self.assertEqual(trace, float(size))
            self.assertEqual(math.sqrt(frobenius_squared), float(size))

    def test_conditional_quartic_core_scale_tends_to_zero(self) -> None:
        # This checks only the scale obtained after a uniform Jost-symbol
        # reduction.  The note keeps the exact core inside the named gate.
        # L=2 log(lambda), c=2*pi*lambda^2, M<=C0*L.
        values = []
        for ell in (20.0, 40.0, 80.0, 160.0):
            log_scale = math.log(2 * math.pi) + ell
            log_bound = 2 * math.log(ell) - 0.25 * log_scale
            values.append(math.exp(log_bound))
        self.assertGreater(values[0], values[-1])
        self.assertLess(values[-1], 1e-10)

    def test_physical_to_isometric_normalization_locks_one_eighth(self) -> None:
        scale = 1 / (2 * math.sqrt(2))
        self.assertAlmostEqual(scale**2, 1 / 8, places=15)
        weighted_u_gram = sum(
            weight * value**2
            for weight, value in ((math.log(2), 0.5), (math.log(5), -1.75))
        )
        self.assertAlmostEqual(
            -4 * scale**2 * weighted_u_gram,
            -0.5 * weighted_u_gram,
            places=14,
        )

    def test_finite_rank_endpoint_row_can_cost_full_l(self) -> None:
        for ell in (8.0, 32.0, 128.0):
            u = math.sqrt(ell / 2)
            v = -u
            entry = 2 * u * v
            self.assertAlmostEqual(entry, -ell)
            self.assertAlmostEqual(max(0.0, -entry), ell)

    def test_boundary_evaluation_is_not_l2_bounded(self) -> None:
        for rate in (1.0, 10.0, 1000.0):
            amplitude = math.sqrt(2 * rate)
            norm_squared = amplitude**2 / (2 * rate)
            self.assertAlmostEqual(norm_squared, 1.0)
            self.assertAlmostEqual(amplitude, math.sqrt(2 * rate))

    def test_conditional_loewner_assembly(self) -> None:
        ell = 1000.0
        equality_floor = ell / 4 - math.log(ell) / 4 - 3
        losses = (4.0, 5.0, 3.0, 2.0, 1.0, 0.5)
        assembled_floor = equality_floor - sum(losses)
        self.assertGreater(assembled_floor, ell / 8)

        # A positive pole cannot lower a two-dimensional floor.
        base_a = assembled_floor
        base_d = assembled_floor + 7
        base_b = 0.0
        pole_vector = (2.0, -3.0)
        with_pole_a = base_a + 2 * pole_vector[0] ** 2
        with_pole_d = base_d + 2 * pole_vector[1] ** 2
        with_pole_b = base_b + 2 * pole_vector[0] * pole_vector[1]
        self.assertGreaterEqual(
            min_eigenvalue_2x2(with_pole_a, with_pole_b, with_pole_d),
            min(base_a, base_d) - 1e-12,
        )

    def test_claim_and_scope_tokens(self) -> None:
        required = (
            "M\\leq C_0L",
            "not concern the full transition inventory",
            "positive Gram bounds with unspecified",
            "O(sqrt(M))=o(L)",
            "useful subchannel only",
            "complete non-equality same-side fold",
            "physical-to-isometric Gram conversion is exactly `1/8`",
            "coefficient is `-4` in (Phi) coordinates",
            "`-1/2` in isometric (U) coordinates",
            "Q_X=\\mathcal W_Z(O,O)",
            "Hypothesis `OO-NEQ`",
            "outer-only complete non-equality estimate",
            "cross-label Toeplitz/Plemelj-scale",
            "regular-FIO",
            "equivalent ordered-limit route",
            "not the sole missing gate",
            "wide reflected Stieltjes/FIO gate",
            "continuous contribution to `Q_refl=-2*lambda*M`",
            "positive rank-one Gram",
            "prime-only target",
            "L^2c^{-1/4}=o(1)",
            "center phase is not a model-level",
            "required growing-label Jost symbols are not among the pinned",
            "all exact quartic and hard cores remain",
            "independently closed in this assembly",
            "Rank alone cannot",
            "O(\\lambda L^3\\epsilon^{-1})",
            "Operator-status ledger",
            "deterministic Fourier",
            "not autonomous exact blocks",
            "O(sqrt(M)*log^2(M+2))=o(L)",
            "exact `D_M^#`",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_fail_closed_language(self) -> None:
        forbidden = (
            "This proves the unconditional growing-prefix floor",
            "The quartic point gives an O(L) negative eigenvalue",
            "Equations (6.6)--(6.7) prove RF",
            "isolated quartic reflected core also has norm",
            "(5.6), (6.6), and (6.10)",
            "This proves the Riemann hypothesis",
            "applies to the full transition inventory",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

    def test_import_hygiene(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "hashlib", "math", "pathlib", "re",
                "shutil", "subprocess", "tempfile", "unittest",
            },
        )

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 25)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
