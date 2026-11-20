#!/usr/bin/env python3
"""Strict regressions for the adaptive prolate Stokes transfer theorem."""

from __future__ import annotations

import ast
import hashlib
import math
import re
import shutil
import subprocess
import tempfile
import unittest
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ADAPTIVE_PROLATE_STOKES_ENDPOINT_ROW_TRANSFER_THEOREM.md"
NOTE_HASH = "0ae198d3a304960744a04c0ec095ffa6afcd4aa61599de551780efb43f89d878"

DEPENDENCIES = {
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/PROLATE_TAIL_ENVELOPE.md":
        "309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d",
    "tests/test_prolate_tail_envelope.py":
        "bb5b5ec58f6357a8defcf36b19d3a1674091518903c5438f56c17ae6eef0581e",
    "notes/SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md":
        "9324d758eca900f646eb5a6187cb5f316ece99b64ec77d7da2eb72cc7c7ff4a4",
    "tests/test_same_anchor_endpoint_rate_attack.py":
        "dd63d4a84cbd8330893c11d273648435f57ee858ebd06231e7b3ad811a5712fb",
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md":
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f",
    "tests/test_defect_relative_projection.py":
        "21b33670a9d017d363f53776ba05ca93ce3588eb049ba9dcb7e61f202bc01999",
    "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md":
        "384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c",
    "tests/test_gevrey_prolate_remainder.py":
        "93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058",
    "notes/SUBTURNING_FINITE_ORDER_NEWTON_CLOSURE_THEOREM.md":
        "b6597337ed033bf889eb31d06da669edb7a97ddc1e32a4c9c90fb5185dad7dc4",
    "tests/test_subturning_finite_order_newton_closure_theorem.py":
        "763d6a7b5d641d013d05ece675a3aaa7496bebbeb4e6111bb12878d33180f526",
    "notes/ADAPTIVE_GONEK_ENDPOINT_FILTER_SELECTION_THEOREM.md":
        "7354d464d4a3d53cb32c83b941a24aac60c5cbbf9b87c5bf56a907193459bd46",
    "tests/test_adaptive_gonek_endpoint_filter_selection_theorem.py":
        "e8e96cab5e5bd817650c0f323f248d00772802e439474b1f9d890083f8ca6396",
    "notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md":
        "aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6",
    "tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py":
        "6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6",
    "notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md":
        "2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87",
    "tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py":
        "d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def alternating_tail(values: tuple[Fraction, ...], start: int) -> Fraction:
    return sum(
        (((-1) ** k) * values[k] for k in range(start, len(values))),
        Fraction(),
    )


class AdaptiveProlateStokesTransferTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_two_sided_to_one_sided_abel_algebra(self) -> None:
        values = tuple(Fraction(3 * k + 2, (k + 2) ** 2) for k in range(13))
        full_trace = values[0] + 2 * alternating_tail(values, 1)
        for n in (1, 4, 9, 12):
            tail = alternating_tail(values, n)
            prefix = sum(
                ((-1) ** k) * values[k] for k in range(1, n)
            )
            self.assertEqual(
                2 * tail,
                full_trace - values[0] - 2 * prefix,
            )

            endpoint_tail = sum(
                ((-1) ** j) * values[n + j]
                for j in range(len(values) - n)
            )
            self.assertEqual(tail, ((-1) ** n) * endpoint_tail)

    def test_q_normalization_and_adjacent_difference(self) -> None:
        values = tuple(Fraction(2 * k + 1, (k + 3) ** 3) for k in range(15))
        # Work after multiplying r_n by sqrt(L), so no irrational enters.
        # L*r_n = L*F(a) + 2*S_n.
        length = Fraction(7, 3)
        endpoint = Fraction(5, 11)
        scaled = []
        for n in (5, 6):
            scaled.append(length * endpoint + 2 * alternating_tail(values, n))
        self.assertEqual(
            scaled[1] - scaled[0],
            -2 * ((-1) ** 5) * values[5],
        )

    def test_periodization_weight_constant(self) -> None:
        y = 0.25
        for length in (2 * math.log(2), 2.0, 5.0, 12.0):
            for index in range(401):
                x = -length / 2 + length * index / 400
                total = sum(
                    math.exp(-2 * y * abs(x + ell * length))
                    for ell in range(-80, 81)
                )
                self.assertLessEqual(total, 3.0 + 1e-12)

    def test_intermediate_gevrey_ledger(self) -> None:
        sigma = 0.2
        strip_constant = 7.0
        delta = sigma / (128 * strip_constant)
        gevrey_constant = 10.0
        for length in (80.0, 120.0, 180.0):
            lam = math.exp(length / 2)
            c_value = 2 * math.pi * lam * lam
            cutoff = 0.5 * c_value ** 0.75
            order = math.floor(delta * cutoff / math.log(cutoff + 2))
            support = 4 * order + 4
            strip_cost = strip_constant * support * math.log(support + 2)
            self.assertLess(strip_cost, sigma * cutoff / 4)
            log_gain = math.log(lam * lam / (gevrey_constant * (order + 1)))
            self.assertGreater(log_gain, length / 6)
            self.assertGreater(order, delta * cutoff / (2 * math.log(cutoff)))
            self.assertGreater(order * log_gain, delta * cutoff / 9)

    def test_error_exponents_dominate_selected_carrier(self) -> None:
        # The nearest-integer schedule is not the continuous inverse.
        for length in (6.0, 8.0, 10.0):
            lam = math.exp(length / 2)
            center = lam * length**3
            dimension = round(center + length / 8)
            self.assertLessEqual(abs(dimension - center), length / 4 + 1)
            rounded_target = 2 * math.pi * (dimension + 1) / length
            continuous_target = 2 * math.pi * (
                lam * length**2 + 1 / length
            )
            self.assertGreater(abs(rounded_target - continuous_target), 0.1)
            self.assertLessEqual(
                abs(rounded_target - 2 * math.pi * lam * length**2),
                2 * math.pi * (0.25 + 2 / length),
            )

        kappa = 1e-4
        for length in (100.0, 150.0, 200.0):
            lam = math.exp(length / 2)
            c_value = 2 * math.pi * lam * lam
            cutoff = 0.5 * c_value ** 0.75
            rounded_error = 2 * math.pi * (0.25 + 2 / length)
            target = 2 * math.pi * lam * length * length + rounded_error
            selected_log = -math.pi * target / 4 + math.pi * length ** 4 / 4
            beta = (2 / math.pi ** 2) * math.log(200 * lam * lam + 25)
            # The conservative graph-norm route can retain D_lambda^(1/4).
            defect_log = 0.25 * (
                math.log(10) - (math.floor(4 * lam * lam) - 11) / beta
            )
            self.assertLess(-kappa * cutoff - selected_log, 0)
            self.assertLess(defect_log - selected_log, 0)
            self.assertLess(target / cutoff, 0.01)

    def test_good_subset_pigeonhole_logic(self) -> None:
        z_squared = (Fraction(1), Fraction(8), Fraction(10), Fraction(14))
        multiplicity = (1, 2, 1, 1)
        q_values = (Fraction(100), Fraction(16), Fraction(60), Fraction(20))
        threshold = Fraction(7)
        total_weight = sum(
            nu * z for nu, z in zip(multiplicity, z_squared)
        )
        good_weight = sum(
            nu * z
            for nu, z in zip(multiplicity, z_squared)
            if z >= threshold
        )
        self.assertGreaterEqual(good_weight, total_weight / 2)
        ratio_bound = Fraction(4)
        selected = [
            index
            for index, (z, q) in enumerate(zip(z_squared, q_values))
            if z >= threshold and q <= ratio_bound * z
        ]
        self.assertTrue(selected)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 80)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    compiler,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    source.name,
                ],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_static_contract_and_claim_boundary(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))
            self.assertTrue(raw.endswith(b"\n"))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

        normalized = " ".join(self.text.split())
        required = (
            "Exact exterior periodization and one-sided Abel algebra",
            "midpoint values at `+/-a`",
            "controls the common mode",
            "Intermediate-order Gevrey tail",
            "split the tiny jumps explicitly",
            "graph-norm interpolation has no hidden boundary trace",
            "Selected phase-weighted far row",
            "complete exterior row, not only its part above",
            "Strengthened same-ordinate selection",
            "Relative exponent comparison and actual transfer",
            "continuous inverse identity",
            "absolute, cancellation-safe estimate",
            "exact physical actual-minus-main vectors",
            "matching lower bounds",
            "(\\eta_n^{\\rm pr})^2=O(L^{-1})\\longrightarrow0",
            "does not synchronize the selected cutoff",
            "no differentiated far endpoint tail",
            "formal state remains `P0_INVALIDATED`",
            "changes none of the standard eight files",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "the Riemann hypothesis follows",
            "P0_VALIDATED",
            "literal ceiling schedule is proved",
            "all finite gates are synchronized",
            "differentiated far endpoint Abel tail is controlled",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, normalized)

        cache_entries = [
            path
            for path in ROOT.rglob("*")
            if path.name == "__pycache__" or path.suffix in {".pyc", ".pyo"}
        ]
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main()
