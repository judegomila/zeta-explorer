#!/usr/bin/env python3
"""Regressions for the Hadamard--Pick carrier RH-equivalence theorem."""

from __future__ import annotations

import cmath
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
    / "GROWING_TRANSITION_HADAMARD_PICK_CARRIER_RH_EQUIVALENCE_THEOREM.md"
)
NOTE_HASH = "092d0adefb7bafea8d931a2741299d19feef2a45ccc3d243c3543765fdf5cff7"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md":
        "41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23",
    "tests/test_growing_transition_finite_fejer_xi_wronskian_assembly_gate.py":
        "dcb9640a5294ae5c44502f983f20f9eadcdf8271dd02099b9d3887f255460aee",
    "notes/GROWING_TRANSITION_GLOBAL_RADICAL_SECTOR_MIXING_FEATURE_GEOMETRY_BARRIER.md":
        "976f9299c4d002db3f0b73f0b4da8cc383480c8b55b7ea5ccdc219d9135fbdc4",
    "tests/test_growing_transition_global_radical_sector_mixing_feature_geometry_barrier.py":
        "61837a5180eac8fe307eca05578315066c39148c9d2dea143c6b1f7628e77b4d",
    "notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md":
        "c9b4513fb0afa57a396f3c1bf7326bb94969d4c8d51a245ea66fa64c1889061e",
    "notes/TAIL_DISCREPANCY_SAFE_HERGLOTZ_AND_ACTUAL_SCHUR_OBSTRUCTION.md":
        "5efd87e2ff6bd21b498a1ff3d189fe252f4617c58da28d9650237763e3928341",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def log_derivative_from_zeros(
    value: complex, zeros: tuple[complex, ...]
) -> complex:
    return sum(1.0 / (value - zero) for zero in zeros)


def symmetric_carrier(
    s: complex,
    t: complex,
    z_s: complex,
    z_t: complex,
    zeros: tuple[complex, ...],
) -> complex:
    f_s = log_derivative_from_zeros(s, zeros)
    f_t = log_derivative_from_zeros(t, zeros)
    return 2.0 * z_s * z_t * (f_s - f_t) / (s - t)


def xi_polynomial(value: complex, roots: tuple[complex, ...]) -> complex:
    result = 1.0 + 0.0j
    for root in roots:
        result *= value - root
    return result


def xi_log_derivative(value: complex, roots: tuple[complex, ...]) -> complex:
    return sum(1.0 / (value - root) for root in roots)


def pick_value(
    z: complex, w: complex, roots: tuple[complex, ...]
) -> complex:
    m_z = -xi_log_derivative(z, roots)
    m_w = -xi_log_derivative(w, roots)
    return (m_z - m_w.conjugate()) / (z - w.conjugate())


class HadamardPickCarrierRhEquivalenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_hadamard_divided_difference_and_minus_sign(self) -> None:
        zeros = (
            0.5 + 3.0j,
            0.5 - 3.0j,
            0.5 + 5.0j,
            0.5 - 5.0j,
        )
        s = 2.2 + 0.3j
        t = 3.1 - 0.4j
        z_s = 0.7 - 0.2j
        z_t = -0.4 + 0.8j
        carrier = symmetric_carrier(s, t, z_s, z_t, zeros)
        features = sum(
            (cmath.sqrt(2.0) * z_s / (s - zero))
            * (cmath.sqrt(2.0) * z_t / (t - zero))
            for zero in zeros
        )
        self.assertAlmostEqual(carrier.real, -features.real, places=13)
        self.assertAlmostEqual(carrier.imag, -features.imag, places=13)
        self.assertGreater(abs(carrier + features.conjugate()), 1e-4)

    def test_diagonal_is_not_an_absolute_square(self) -> None:
        zeros = (0.5 + 2.0j, 0.5 - 2.0j)
        s = 1.7 + 0.1j
        z_s = 0.8 - 0.3j
        derivative = -sum(1.0 / (s - zero) ** 2 for zero in zeros)
        diagonal = 2.0 * z_s * z_s * derivative
        feature_diagonal = -sum(
            (cmath.sqrt(2.0) * z_s / (s - zero)) ** 2
            for zero in zeros
        )
        self.assertAlmostEqual(diagonal.real, feature_diagonal.real, places=13)
        self.assertAlmostEqual(diagonal.imag, feature_diagonal.imag, places=13)
        self.assertGreater(abs(diagonal.imag), 1e-3)

    def test_real_zero_pick_kernel_is_a_positive_gram(self) -> None:
        roots = (-7.0, -3.0, 3.0, 7.0)
        points = (0.4 + 0.7j, -1.2 + 1.1j, 2.0 + 0.5j)
        coefficients = (0.8 - 0.3j, -0.2 + 0.9j, 1.1 + 0.4j)
        quadratic = 0.0 + 0.0j
        for j, z in enumerate(points):
            for k, w in enumerate(points):
                quadratic += (
                    coefficients[j].conjugate()
                    * pick_value(z, w, roots)
                    * coefficients[k]
                )
        feature_square = sum(
            abs(
                sum(
                    coefficients[k] / (root - points[k].conjugate())
                    for k in range(len(points))
                )
            )
            ** 2
            for root in roots
        )
        self.assertAlmostEqual(quadratic.real, feature_square, places=12)
        self.assertAlmostEqual(quadratic.imag, 0.0, places=12)
        self.assertGreater(quadratic.real, 0.0)

    def test_critical_change_of_variables_has_positive_pick_sign(self) -> None:
        roots = (-5.0, -2.0, 2.0, 5.0)
        z = 0.3 + 0.8j
        w = -0.6 + 1.2j
        s = 0.5 + 1.0j * z
        t = 0.5 + 1.0j * w.conjugate()

        # F(1/2+i z)=i m(z) for Xi with these critical-variable roots.
        m_z = -xi_log_derivative(z, roots)
        m_bar_w = -xi_log_derivative(w.conjugate(), roots)
        f_s = 1.0j * m_z
        f_t = 1.0j * m_bar_w
        divided = (f_s - f_t) / (s - t)
        pick = pick_value(z, w, roots)
        self.assertAlmostEqual(divided.real, pick.real, places=13)
        self.assertAlmostEqual(divided.imag, pick.imag, places=13)

    def test_gamma_conjugated_wronskian_identity(self) -> None:
        roots = (-4.0, -1.5, 1.5, 4.0)
        z = 0.2 + 0.9j
        w = -0.7 + 0.6j
        xi_z = xi_polynomial(z, roots)
        xi_w = xi_polynomial(w, roots)
        xi_prime_z = xi_z * xi_log_derivative(z, roots)
        xi_prime_w = xi_w * xi_log_derivative(w, roots)
        gram = xi_z * xi_w.conjugate() * pick_value(z, w, roots)
        wronskian = -(
            xi_prime_z * xi_w.conjugate()
            - xi_z * xi_prime_w.conjugate()
        ) / (z - w.conjugate())
        self.assertAlmostEqual(gram.real, wronskian.real, places=11)
        self.assertAlmostEqual(gram.imag, wronskian.imag, places=11)

    def test_off_real_zero_breaks_pick_diagonal(self) -> None:
        alpha = 1.0 + 0.4j
        roots = (alpha, alpha.conjugate(), -alpha, -alpha.conjugate())
        # Approach the upper-half-plane pole from below while staying in C_+.
        z = alpha - 0.05j
        diagonal = pick_value(z, z, roots).real
        self.assertLess(diagonal, 0.0)
        self.assertLess((-xi_log_derivative(z, roots)).imag, 0.0)

    def test_difference_series_gains_two_zero_powers(self) -> None:
        s = 1.3 + 0.2j
        t = 2.1 - 0.4j

        def partial(limit: int) -> complex:
            zeros = tuple(
                zero
                for n in range(1, limit + 1)
                for zero in (0.5 + n * 1.0j, 0.5 - n * 1.0j)
            )
            return sum(1.0 / ((s - zero) * (t - zero)) for zero in zeros)

        reference = partial(20000)
        for limit in (200, 1000, 5000):
            error = abs(partial(limit) - reference)
            self.assertLess(error, 3.0 / limit)

    def test_scope_and_fail_closed_tokens(self) -> None:
        normalized = " ".join(self.text.split())
        for token in (
            "complex-symmetric bilinear",
            "not a positive Hermitian Gram",
            "minus sign and the absence of conjugation",
            "locally absolutely convergent",
            "gamma-conjugated carrier",
            "Pick--Herglotz function",
            "literally an RH-strength theorem",
            "one finite, source-integrated compression",
            "strictly weaker",
            "raw sampler factor",
            "finite-central-length tail",
            "does not prove RH",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, normalized)

    def test_required_exact_formulas_present(self) -> None:
        for token in (
            r"u_\rho(s)={\sqrt2 Z(s)\over s-\rho}",
            r"\mathcal K_Z(s,t)=-\sum_\rho u_\rho(s)u_\rho(t)",
            r"\sum_\rho(1+|\rho|)^{-2}<\infty",
            r"F(s)-F(t)",
            r"-(s-t)\sum_\rho{1\over(s-\rho)(t-\rho)}",
            r"{2\over g(s)g(t)}",
            r"s_z={1\over2}+iz",
            r"=\mathcal P_m(z,w)",
            r"\mathcal P_m\succeq0\hbox{ on }\mathbb C_+",
            r"{\Im m(z)\over\Im z}\geq0",
            r"v_\gamma(z)=\sqrt{k_\gamma}",
            r"P_E\widehat Q_{\rm packet}P_E",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 25)
        source = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            tex = Path(tmp) / "displays.tex"
            tex.write_text(source, encoding="utf-8")
            result = subprocess.run(
                [
                    pdflatex,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    tex.name,
                ],
                cwd=tmp,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-5000:])

    def test_display_balance_unique_tags_ascii_and_no_placeholder(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(
            all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data)
        )
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
