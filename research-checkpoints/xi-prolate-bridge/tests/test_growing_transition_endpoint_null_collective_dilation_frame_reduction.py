#!/usr/bin/env python3
"""Regressions for the endpoint-null collective dilation-frame reduction."""

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
    / "GROWING_TRANSITION_ENDPOINT_NULL_COLLECTIVE_DILATION_FRAME_REDUCTION.md"
)
NOTE_HASH = "bbffec21c91b1e1150e36c9b2120b9255f1d0aa1bd4a1c7ec226e02db8d6abe6"

FROZEN = {
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md":
        "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md":
        "c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md":
        "93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675",
    "notes/GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md":
        "e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3",
    "notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md":
        "0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class EndpointNullCollectiveDilationFrameReductionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_dependencies_and_note_are_frozen(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
        if NOTE_HASH.startswith("DRAFT_"):
            self.skipTest("draft note intentionally awaits final self-hash")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_log_tail_normalization(self) -> None:
        # m^(-1/2) phi(s+log m) has no leftover m factor.
        lam = 3.5
        s_value = 0.7
        m_value = 11
        h_value = 0.031 - 0.017j
        phi_shift = (
            math.sqrt(lam)
            * math.exp((s_value + math.log(m_value)) / 2)
            * h_value
            / 2
        )
        left = phi_shift / math.sqrt(m_value)
        right = math.sqrt(lam * math.exp(s_value)) * h_value / 2
        self.assertLess(abs(left - right), 1e-14)

    def test_finite_half_line_laplace_identity(self) -> None:
        # Test (3.2) on phi(t)=exp(-a t), where both sides are explicit.
        a_value = 1.7
        z_value = 0.4 + 0.3j
        for cutoff in (1, 3, 17, 100):
            left = sum(
                m ** (-a_value - 0.5) for m in range(1, cutoff + 1)
            ) / (a_value + z_value)
            right = sum(
                m ** (z_value - 0.5)
                * cmath.exp(-(a_value + z_value) * math.log(m))
                / (a_value + z_value)
                for m in range(1, cutoff + 1)
            )
            self.assertLess(abs(left - right), 2e-14)

    def test_euler_exponents_are_consistent(self) -> None:
        # With w=1/2-z, the four powers in (3.4) are forced.
        z_value = 0.21 - 0.37j
        w_value = 0.5 - z_value
        self.assertLess(abs((1 - w_value) - (z_value + 0.5)), 1e-15)
        self.assertLess(abs((-w_value) - (z_value - 0.5)), 1e-15)
        self.assertLess(abs((-w_value - 1) - (z_value - 1.5)), 1e-15)

    def test_surviving_b2_norm_constant(self) -> None:
        kappa = -2 * math.pi ** 1.5
        two_tail_norm = 2 * kappa**2 * (1 / 3) * (1 / 180)
        self.assertAlmostEqual(two_tail_norm, 2 * math.pi**3 / 135)
        self.assertGreater(two_tail_norm, 0)

    def test_fixed_packet_l1_step_costs_dimension(self) -> None:
        for dimension in (1, 2, 7, 32):
            coefficients = [1.0] * dimension
            lhs = sum(abs(value) for value in coefficients) ** 2
            rhs_energy = sum(abs(value) ** 2 for value in coefficients)
            self.assertAlmostEqual(lhs, dimension * rhs_energy)

    def test_centered_two_branch_weights_retain_lambda_shift(self) -> None:
        lam = 11.0
        local_plus = 1.7
        local_minus = 0.6
        for y_value in (-0.49, -0.2, 0.0, 0.31, 0.49):
            centered = (
                lam ** (2 * y_value) * local_plus
                + lam ** (-2 * y_value) * local_minus
            )
            branch_formula = sum(
                (
                    lam ** y_value * math.sqrt(local_plus),
                    lam ** (-y_value) * math.sqrt(local_minus),
                )[index] ** 2
                for index in range(2)
            )
            self.assertAlmostEqual(centered, branch_formula)
            self.assertLessEqual(lam ** (2 * abs(y_value)), lam)

            # The signed local exponents in (6.11) exactly restore the
            # centered lambda scale.
            plus_scaled = lam ** (2 * y_value) * lam ** (1 - 2 * y_value)
            minus_scaled = lam ** (-2 * y_value) * lam ** (1 + 2 * y_value)
            self.assertAlmostEqual(plus_scaled, lam)
            self.assertAlmostEqual(minus_scaled, lam)

            # The symmetric |y| exponent is stronger for one branch but
            # sufficient for both.
            symmetric_local = lam ** (1 - 2 * abs(y_value))
            self.assertLessEqual(lam ** (2 * y_value) * symmetric_local, lam)
            self.assertLessEqual(lam ** (-2 * y_value) * symmetric_local, lam)

    def test_translation_range_keeps_reflected_tails_disjoint(self) -> None:
        minimum_lambda = 2.5
        maximum_h = 0.5
        self.assertLess(maximum_h, 2 * math.log(minimum_lambda))
        for token in (
            "For the inherited sampling range `0<h<=1/2`",
            "All occurrences of `h` in (6.7)--(6.11) are restricted",
            "No centered full-line translation identity is asserted here",
            "for `h>=2ell`, where cross-branch overlaps can occur",
        ):
            self.assertIn(token, self.text)

    def test_operator_valued_gram_tokens_are_locked(self) -> None:
        for token in (
            "\\mathfrak K_{m,l}^{({\\rm ctr},y)}",
            "\\lambda^{2y}\\mathfrak K_{m,l}^{(y)}",
            "\\lambda^{-2y}\\mathfrak K_{m,l}^{(-y)}",
            "\\|e^{y\\,\\cdot}O\\|_2^2",
            "\\lambda^{-2y}\\|M_{-y}F\\|_2^2",
            "\\mathfrak K_{m,l}^{(\\Delta,{\\rm ctr},y)}",
            "\\|\\tau_h(e^{y\\,\\cdot}O)-e^{y\\,\\cdot}O\\|_2^2",
            "\\lambda^{-2y}\\|\\Delta_hM_{-y}F\\|_2^2",
            "\\lambda^{1-2y}P(\\lambda)\\epsilon^{-1}",
            "\\lambda^{1+2y}P(\\lambda)\\epsilon^{-1}",
            "\\ell^2(W)\\otimes V_\\lambda^\\#",
            "F_{W,y}^{\\Delta,{\\rm ctr}}(\\lambda,h)",
            "lambda^(2|y|)",
            "almost `lambda^2 P`",
            "whose constant is independent of `dim V_lambda^#`",
            "pairwise scalar modal estimates followed by (5.3)",
            "Hilbert-space Minkowski across the windows",
        ):
            self.assertIn(token, self.text)

    def test_metric_and_scope_are_fail_closed(self) -> None:
        for token in (
            "D_{\\rm full}^\\#=S_\\eta^*D_{\\rm full}S_\\eta",
            "Applying the shear only to the physical numerator",
            "sibling structured-metric attack",
            "It is not a dependency of this",
            "does not prove or refute",
            "P0_INVALIDATED",
            "No signed conclusion",
        ):
            self.assertIn(token, self.text)

    def test_bare_zeta_shortcut_is_explicitly_rejected(self) -> None:
        for token in (
            "truncated power sum",
            "Equations (3.2)--(3.4) exhibit all three pieces",
            "periodic-Bernoulli remainder",
            "uses a divergent Dirichlet series on the critical line",
            "Extending `phi` by zero does not turn (3.1)",
            "into group convolution",
            "Analytic continuation of the scalar series repairs",
            "neither omission",
        ):
            self.assertIn(token, self.text)

    def test_display_balance_and_unique_tags(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
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
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_ascii_and_no_control_bytes(self) -> None:
        data = NOTE.read_bytes()
        self.assertTrue(all(b in (9, 10, 13) or 32 <= b <= 126 for b in data))


if __name__ == "__main__":
    unittest.main()
