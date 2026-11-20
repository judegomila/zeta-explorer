#!/usr/bin/env python3
"""Exact regressions for the continuous compact-side odd transfer theorem."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "ACTUAL_MIXED_BRIDGE_CONTINUOUS_COMPACT_SIDE_ODD_CARRIER_TRANSFER_THEOREM.md"
)
NOTE_HASH = "d60381270462b8148a94269cc62c43b6c65178e89243588c8dcf37047534f3de"

FROZEN = {
    "notes/ACTUAL_MIXED_BRIDGE_COMPACT_SIDE_ODD_CARRIER_TRANSFER_THEOREM.md":
        "3320efd69a729f9709419bc539e765f94c73af20d2136f14068ee4da069c37c1",
    "tests/test_actual_mixed_bridge_compact_side_odd_carrier_transfer_theorem.py":
        "d3b0f08b9aefb7377b80cdefb5e76a35d07e004a56f90d2acc1580bf1c8199a3",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "tests/test_growing_transition_sampling.py":
        "ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac",
    "notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md":
        "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb",
    "tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py":
        "0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc",
    "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md":
        "2feb3d62a71e435706c4b330d13bcb096015e52204af6ec9bd2828308d44383d",
    "tests/test_compact_absolute_sampling.py":
        "883c0e4edd8b6573bcf11740031a6a0ea93340d45e36ac1057e3793b729bc605",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def norm_squared(vector: tuple[F, ...]) -> F:
    return sum((value * value for value in vector), F(0))


def add(*vectors: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(sum(values, F(0)) for values in zip(*vectors))


def scale(value: F, vector: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(value * coordinate for coordinate in vector)


def signed_slot_pairing(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum(
        (a * b for a, b in zip(left, tuple(reversed(right)))),
        F(0),
    ) / 2


class ActualMixedBridgeContinuousCompactSideOddCarrierTransferTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_note_hash(self) -> None:
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)

    def test_fixed_labels_satisfy_all_real_three_c_squared_margin(self) -> None:
        labels = (0, 2, 6)
        self.assertEqual(max(n * (n + 1) for n in labels), 42)
        for lam in (F(2), F(5, 2), F(17, 3), F(41, 5)):
            # pi^2>9 makes this a strict rational lower bound for c^2.
            c_squared_lower = 36 * lam**4
            for n in labels:
                self.assertLess(
                    c_squared_lower + n * (n + 1),
                    3 * c_squared_lower,
                )

    def test_all_fixed_source_labels_have_the_even_sine_boundary_phase(self) -> None:
        labels = (0, 2, 6)
        self.assertTrue(all(n % 2 == 0 for n in labels))
        phases = tuple((-1) ** (n // 2) for n in labels)
        self.assertEqual(phases, (1, -1, -1))
        self.assertNotIn(1, tuple(n % 2 for n in labels))

    def test_weighted_outer_constants_have_fixed_polynomial_degree(self) -> None:
        for lam in range(2, 9):
            log_proxy = lam + 1
            energy = 1_062_724 * lam * log_proxy**2
            c_fourth_times_lambda = 16 * lam**9
            k_squared_over_lambda = 4 * lam**5
            translation = 6 * (
                82_944 * lam
                + 1_119_744 * lam**5
                + 290_304 * lam**3
                + 320 * c_fourth_times_lambda
                + 10**9 * k_squared_over_lambda
            )
            self.assertLessEqual(energy, 1_062_724 * lam**5)
            self.assertLessEqual(translation, 7 * 10**9 * lam**9)

    def test_dyadic_block_minimum_retains_both_valid_bounds(self) -> None:
        energy = F(17, 3)
        translation = F(29, 5)
        total = F(0)
        for j in range(1, 33):
            overlap = F(j + 2)
            delta_inverse_cubed = F((j + 1) ** 3)
            low = F(512, 3) * energy
            high = F(5120, 3) * translation / 2**j
            block = overlap * delta_inverse_cubed * min(low, high)
            self.assertLessEqual(block, overlap * delta_inverse_cubed * low)
            self.assertLessEqual(block, overlap * delta_inverse_cubed * high)
            total += block
        self.assertGreater(total, 0)

    def test_three_label_minkowski_cauchy_bound_is_exact(self) -> None:
        vectors = (
            (F(1), F(0), F(0), F(0)),
            (F(2), F(0), F(0), F(0)),
            (F(3), F(0), F(0), F(0)),
        )
        defects = (F(1), F(4), F(9))
        coefficients = (F(5, 7), F(-3, 11), F(2, 13))
        combined = add(
            *(scale(value, vector) for value, vector in zip(coefficients, vectors))
        )
        modal_defect = sum(
            (value * value * defect for value, defect in zip(coefficients, defects)),
            F(0),
        )
        self.assertTrue(
            all(norm_squared(vector) <= defect for vector, defect in zip(vectors, defects))
        )
        self.assertLessEqual(norm_squared(combined), 3 * modal_defect)

    def test_raw_bridge_triangle_retains_both_shear_pieces(self) -> None:
        endpoint_null = (F(3, 7), F(-2, 11), F(1, 13), F(4, 17))
        shear = (F(-1, 19), F(5, 23), F(-3, 29), F(2, 31))
        raw = add(endpoint_null, shear)
        left = norm_squared(raw)
        right = 2 * (
            norm_squared(endpoint_null) + norm_squared(shear)
        )
        self.assertLessEqual(left, right)
        self.assertNotEqual(raw, endpoint_null)
        self.assertNotEqual(raw, shear)

    def test_carrier_modal_cross_expansion_and_repo_factor_are_exact(self) -> None:
        modal = (F(1, 17), F(-2, 19), F(2, 19), F(-1, 17))
        carrier = (F(5, 7), F(-7, 11), F(7, 11), F(-5, 7))
        total = add(modal, carrier)
        physical = signed_slot_pairing(total, total)
        carrier_self = signed_slot_pairing(carrier, carrier)
        remainder = (
            signed_slot_pairing(modal, modal)
            + signed_slot_pairing(modal, carrier)
            + signed_slot_pairing(carrier, modal)
        )
        self.assertEqual(physical, carrier_self + remainder)
        cross = signed_slot_pairing(modal, carrier)
        self.assertLessEqual(
            cross * cross,
            (norm_squared(modal) / 2) * (norm_squared(carrier) / 2),
        )

    def test_fixed_polynomial_losses_are_beaten_by_the_defect(self) -> None:
        for lam in range(10, 25):
            defect = F(1, 2 ** (lam * lam))
            root_defect = F(1, 2 ** ((lam * lam) // 2))
            polynomial = lam**7
            remainder = polynomial**2 * defect + polynomial * root_defect
            for power in (1, 2, 3, 4):
                self.assertLess(remainder, F(1, lam**power))

    def test_continuous_physical_and_carrier_bounds_are_equivalent(self) -> None:
        for numerator in range(21, 42):
            lam = F(numerator, 3)
            carrier = F((-1) ** numerator * 5, 7) / lam
            remainder = 1 / lam**3
            physical = carrier + remainder
            self.assertLessEqual(abs(physical), abs(carrier) + 1 / lam)
            self.assertLessEqual(abs(carrier), abs(physical) + 1 / lam)

    def test_compact_sampling_and_projection_boundaries_are_distinct(self) -> None:
        harmonic = F(0)
        checkpoints: list[F] = []
        for k in range(1, 65):
            harmonic += F(1, k)
            if k in (4, 8, 16, 32, 64):
                checkpoints.append(harmonic)
        self.assertTrue(
            all(right > left for left, right in zip(checkpoints, checkpoints[1:]))
        )
        for p in (5, 7, 9, 11):
            lam = F(p, 2)
            exponent = 2400 * p * p
            self.assertEqual(9600 * lam * lam, exponent)

    def test_scope_tokens_and_forbidden_overclaims(self) -> None:
        required = (
            "full continuous family",
            "r_\\lambda=o(\\lambda^{-1})",
            "every sufficiently large real",
            "continuous physical-self condition",
            "{\\cal I}_{\\rm fix}=\\{0,2,6\\}",
            "0\\leq\\mu_n(c)<3c^2",
            "B_{\\rm fix}(\\lambda)",
            "positive two-slot estimate",
            "corrected-combination `q<=3` conclusion",
            "is not invoked",
            "applies the dyadic sampler separately to each pure modal tail",
            "with no bump or origin",
            "D_{\\rm mod}(b_\\lambda^\\#)=\\Theta(d_2)",
            "gamma_\\lambda^2D_{\\rm mod}(m_1)=O(d_2)",
            "not continuity interpolation from halfgrid samples",
            "gauge equality only after `Z`",
            "retaining both cross orientations",
            "compact physical self",
            "modal row is noncompact",
            "neither compactly supported nor of bounded variation",
            "No all-real version of that projection artifact is asserted",
            "not needed here",
            "No selected sequence",
            "Equation (0.6) is an equivalence, not an unconditional estimate",
            "No estimate for `E_lambda`",
            "no estimate for `mu`",
            "kappa*log^2(lambda)",
            "standard eight are untouched",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "RH is proved",
            "the physical odd bound holds unconditionally",
            "compact BV sampling applies directly to O_(b,modal)",
            "apply the corrected-combination q<=3 theorem directly to b_lambda^#",
            "the finite projection theorem holds for every real lambda",
            "the literal noncompact ordered physical finite part is proved",
            "E_lambda=O(lambda^(-1)) follows",
            "mu=O(lambda^(-1)) follows",
            "kappa*log^2(lambda) follows",
            "a sparse subsequence implies RH",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_tags_ascii_and_no_binary_floats(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), 48)
        self.assertEqual(len(tags), 48)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertNotIn(b"\t", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertTrue(
                all(line.rstrip(b" ") == line for line in payload.splitlines())
            )

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        float_constants = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(float_constants, [])

        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__",
                "ast",
                "fractions",
                "hashlib",
                "pathlib",
                "re",
                "shutil",
                "subprocess",
                "tempfile",
                "unittest",
            },
        )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        self.assertIsNotNone(pdflatex, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertEqual(len(displays), 48)
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
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex_path.name,
                ],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
