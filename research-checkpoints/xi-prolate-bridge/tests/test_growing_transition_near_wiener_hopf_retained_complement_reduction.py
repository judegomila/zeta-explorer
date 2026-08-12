#!/usr/bin/env python3
"""Regressions for the near Wiener--Hopf retained-complement reduction."""

from __future__ import annotations

import cmath
import hashlib
import math
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
    / "GROWING_TRANSITION_NEAR_WIENER_HOPF_RETAINED_COMPLEMENT_REDUCTION.md"
)
NOTE_HASH = "5a1ae6494a6ec72d74666fc381c39248b2e7880ba3d847fa59c5c20617621deb"

FROZEN = {
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md":
        "ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86",
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md":
        "1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032",
    "tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py":
        "e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_ALL_OUTWARD_HARD_TAIL_DIVISOR_REGROUPING_THEOREM.md":
        "0f3de001b13125dcb6efe5cd0d9afa5c7a897f47fc732f06aac9f63fa457f50f",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md":
        "93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
        "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def von_mangoldt_table(limit: int) -> list[float]:
    values = [0.0] * (limit + 1)
    prime = [True] * (limit + 1)
    for p_value in range(2, limit + 1):
        if not prime[p_value]:
            continue
        log_p = math.log(p_value)
        power = p_value
        while power <= limit:
            values[power] = log_p
            if power > limit // p_value:
                break
            power *= p_value
        for multiple in range(p_value * p_value, limit + 1, p_value):
            prime[multiple] = False
    return values


def transition_rows(
    conductor: float,
) -> tuple[list[tuple[float, float, float]], float]:
    upper = math.ceil(2.0 * conductor)
    mangoldt = von_mangoldt_table(upper)
    rows = [
        (
            math.log(index / conductor),
            index ** -0.5,
            mangoldt[index],
        )
        for index in range(math.floor(conductor) + 1, upper)
    ]
    return rows, math.log(conductor)


def pair_formula(
    conductor: float,
    rho: float,
    collar_length: float,
) -> float:
    rows, _ = transition_rows(conductor)
    tau = 2.0 * math.pi * conductor * rho
    total = 0.0j
    for a_m, weight_m, _ in rows:
        for a_n, weight_n, lambda_n in rows:
            difference = a_n - a_m
            overlap = max(0.0, 1.0 - abs(difference) / collar_length)
            total += (
                weight_m
                * weight_n
                * lambda_n
                * overlap
                * cmath.exp(1j * tau * difference)
            )
    return 2.0 * total.real


def cell_partition_formula(
    conductor: float,
    rho: float,
    collar_length: float,
    left_endpoint: float,
) -> float:
    """Integrate the two translated step sums cell by cell."""
    rows, _ = transition_rows(conductor)
    tau = 2.0 * math.pi * conductor * rho
    intervals = []
    endpoints = set()
    for shift, weight, lambda_value in rows:
        left = left_endpoint - shift
        right = left_endpoint + collar_length - shift
        amplitude = (
            weight
            * cmath.exp(1j * tau * shift)
            / math.sqrt(collar_length)
        )
        intervals.append((left, right, amplitude, lambda_value * amplitude))
        endpoints.add(left)
        endpoints.add(right)

    total = 0.0j
    ordered = sorted(endpoints)
    for left, right in zip(ordered, ordered[1:]):
        midpoint = 0.5 * (left + right)
        c_one = 0.0j
        c_lambda = 0.0j
        for start, stop, one_amplitude, lambda_amplitude in intervals:
            if start < midpoint < stop:
                c_one += one_amplitude
                c_lambda += lambda_amplitude
        total += (right - left) * c_one.conjugate() * c_lambda
    return 2.0 * total.real


class NearWienerHopfRetainedComplementReductionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_note_and_inputs_are_frozen(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
        if NOTE_HASH.startswith("DRAFT_"):
            self.skipTest("draft awaits final exact freeze")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_hermitian_normalization(self) -> None:
        for c_one, c_lambda in (
            (1.2 - 0.7j, -0.3 + 2.1j),
            (-2.0 + 0.5j, 1.7 - 1.1j),
        ):
            sampler = 2.0 * c_one
            discrepancy = 2.0 * (c_lambda - c_one)
            expanded = (
                0.5 * abs(sampler) ** 2
                + 0.5 * (sampler.conjugate() * discrepancy).real
            )
            regrouped = 2.0 * (c_one.conjugate() * c_lambda).real
            self.assertAlmostEqual(expanded, regrouped, places=13)

    def test_overlap_pair_formula_equals_direct_cell_integration(self) -> None:
        conductor = 13.0**2 / 4.0
        rho = 1.37
        collar_length = 0.37
        left_endpoint = 1.1
        pair = pair_formula(conductor, rho, collar_length)
        direct = cell_partition_formula(
            conductor,
            rho,
            collar_length,
            left_endpoint,
        )
        self.assertAlmostEqual(pair, direct, places=11)

    def test_locked_finite_diagnostic(self) -> None:
        conductor = 41.0**2 / 4.0
        rho = 1.8124
        log_conductor = math.log(conductor)
        expected = {
            log_conductor - math.log(2.0) - 0.25: -4.758117743365302,
            1.0: -3.586527196935248,
            0.5: -2.0355558335926336,
        }
        for collar_length, target in expected.items():
            observed = pair_formula(conductor, rho, collar_length)
            self.assertAlmostEqual(observed, target, places=9)
            self.assertLess(observed, 0.0)

    def test_full_metric_and_ambient_complement_are_literal(self) -> None:
        for token in (
            r"D_R=D_T+d_4\alpha\alpha^*+d_0bb^*",
            r"D_{\rm full}^\#=(C_{\rm tr}^\#)^*D_{\rm ext}C_{\rm tr}^\#",
            "z^*D_full^#z",
            r"D_{\rm ext}(f)=8\|\phi_f\|",
            r"R_Q=Y\ominus{\cal K}_Q",
            "ordinary ambient physical Hilbert metric",
            "not a source-metric orthogonal complement",
        ):
            self.assertIn(token, self.text)

    def test_rayleigh_factor_and_density_threshold_are_literal(self) -> None:
        for token in (
            r"{\mathfrak w_A[a]\over8\|a\|_2^2}",
            r"d>\ell+\log2",
            r"{r\over d}>C_0",
            r"C_0<{1\over\ell+\log2}",
            "one packet does not suffice",
            "negative-index density theorem",
        ):
            self.assertIn(token, self.text)

    def test_pnt_and_paley_wiener_gates_are_fail_closed(self) -> None:
        for token in (
            "Paley--Wiener resolution",
            "negative eigenvalue, with margin",
            r"|\tau|\asymp A",
            "PNT remainder without modulation is insufficient",
            "FKS-type stationary estimate",
            "operator-valued Cotlar/large-sieve",
            "not the point symbol",
        ):
            self.assertIn(token, self.text)

    def test_capture_scope_is_conditional(self) -> None:
        for token in (
            r"{\cal K}=H_+\cap\kappa^\perp",
            r"{\cal K}=Y\oplus F",
            r"F\subset {\cal K}_L^\perp\cap\operatorname {ran}P_{>R}^+",
            r"{\cal K}_Q=\operatorname {ran}V_Q",
            r"\subset {\cal K}_L\subset Y",
            r"\|P_Fx\|\leq\|P_{>R}x\|",
            r"rJ_A>Q+2",
            "costs at most one dimension",
            r"\dim {\cal K}_Q\leq Q+1",
            r"y=P_Yx=x-P_Fx",
            "Only under this anchor condition",
            "subtracting `P_Fx` alone would not",
            r"\langle y,v\rangle=\langle P_Yx,v\rangle",
            "conditional image/capture step",
            "full-source lift is admitted by closure",
            "does not state that the correction lift preserves",
            "No such conclusion is asserted",
            "leaves the complete central form untouched",
        ):
            self.assertIn(token, self.text)

    def test_diagnostic_is_not_promoted(self) -> None:
        for token in (
            "diagnostic and regression only",
            "proves no asymptotic negativity",
            "It is not evidence for the quantifier",
            "no asymptotic sign is inferred",
            "pole, Archimedean, reflected, equality, and",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        ):
            self.assertIn(token, self.text)

    def test_ascii_hygiene(self) -> None:
        NOTE.read_text(encoding="ascii")

    def test_displayed_tex_is_balanced(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertEqual(
            len(re.findall(r"\\begin\{array\}", self.text)),
            len(re.findall(r"\\end\{array\}", self.text)),
        )
        for match in re.finditer(r"\\tag\{([^}]*)\}", self.text):
            self.assertRegex(match.group(1), r"^[0-9]+\.[0-9]+[a-z]?$")
        tags = re.findall(r"\\tag\{([^}]*)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
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
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
