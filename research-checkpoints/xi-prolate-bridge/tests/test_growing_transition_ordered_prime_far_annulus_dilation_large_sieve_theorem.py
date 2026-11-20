#!/usr/bin/env python3
"""Regressions for the ordered-prime far-annulus dilation large sieve."""

from __future__ import annotations

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
    / "GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md"
)
NOTE_HASH = "c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc"

FROZEN = {
    "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md":
        "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79",
    "tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py":
        "73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def mangoldt(n_value: int) -> float:
    """Return Lambda(n) by recognizing prime powers."""
    for prime in range(2, int(math.sqrt(n_value)) + 2):
        is_prime = all(prime % divisor for divisor in range(2, int(math.sqrt(prime)) + 1))
        if not is_prime:
            continue
        power = prime
        while power < n_value:
            power *= prime
        if power == n_value:
            return math.log(prime)
    # A remaining n is a first power exactly when it is prime.
    if n_value >= 2 and all(
        n_value % divisor for divisor in range(2, int(math.sqrt(n_value)) + 1)
    ):
        return math.log(n_value)
    return 0.0


class OrderedPrimeFarAnnulusDilationLargeSieveTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_note_and_dependencies_are_frozen(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
        if NOTE_HASH.startswith("DRAFT_"):
            self.skipTest("draft note intentionally awaits final self-hash")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_scope_threshold_and_open_near_band_are_locked(self) -> None:
        for token in (
            "\\boxed{2A\\leq X<Y\\leq2X.}",
            "including `y=1`",
            "certified Pruefer carrier begins at",
            "`nu>=2lambda` exactly only for `n>=2A`",
            "regular transition band `A<n<2A`",
            "makes no claim",
            "literal boundary",
            "future near-band theorem",
            "does not infer that missing estimate",
            "project state remains `P0_INVALIDATED`",
        ):
            self.assertIn(token, self.text)

    def test_physical_white_normalization_and_exact_ode_are_locked(self) -> None:
        for token in (
            "z_\\gamma^2\\leq C{c\\over\\lambda L}",
            "w_\\gamma(t)=\\sqrt{p(t)}H_\\gamma(t)",
            "\\Omega_\\gamma^2",
            "{c\\gamma\\over p}+{\\lambda^2\\over p^2}",
            "{r_\\gamma'\\over r_\\gamma}",
            "{\\Omega_\\gamma'\\over\\Omega_\\gamma}",
            "r_\\gamma(t)\\leq {9\\over2}",
            "{\\sqrt{\\lambda/L}\\over t}",
            "retains the allowed carrier",
            "physical half-density",
        ):
            self.assertIn(token, self.text)

    def test_scaled_amplitude_power_is_exact(self) -> None:
        # a_gamma(ny/lambda)^2 is 1/(Q^2*lambda*L*y^2).
        # Multiplication by du=dy/lambda gives A/(L*X^2*y^2).
        for lam, q_value, ell_value, y_value in (
            (20.0, 2.0, 9.0, 1.0),
            (50.0, 2 * math.pi, 12.0, 1.7),
            (200.0, 15.0, 20.0, 4.0),
        ):
            conductor = lam * lam
            x_value = q_value * conductor
            modal_square = 1 / (q_value**2 * lam * ell_value * y_value**2)
            with_jacobian = modal_square / lam
            claimed = conductor / (ell_value * x_value**2 * y_value**2)
            self.assertAlmostEqual(with_jacobian, claimed, places=15)

    def test_exact_omega_and_pruefer_correction_have_claimed_scales(self) -> None:
        # Numerically audit the exact derivatives used to dominate both the
        # Omega term and the retained (Omega'/Omega) Pruefer term.
        worst_first = 0.0
        worst_second = 0.0
        for lam in (30.0, 100.0, 300.0):
            conductor = lam * lam
            c_value = 2 * math.pi * conductor
            k_value = 2 * math.pi * lam
            ell_value = math.log(conductor)
            gamma = 3 * ell_value
            for q_value in (2.0, 2 * math.pi, 20.0):
                n_value = q_value * conductor
                for y_value in (1.0, 1.5, 4.0, 20.0):
                    t_value = q_value * lam * y_value
                    p_value = t_value**2 - conductor
                    potential = c_value * gamma / p_value + conductor / p_value**2
                    omega = math.sqrt(k_value**2 + potential)
                    potential_prime = (
                        -2 * t_value * c_value * gamma / p_value**2
                        -4 * t_value * conductor / p_value**3
                    )
                    potential_second = (
                        -2 * c_value * gamma / p_value**2
                        +8 * t_value**2 * c_value * gamma / p_value**3
                        -4 * conductor / p_value**3
                        +24 * t_value**2 * conductor / p_value**4
                    )
                    omega_prime = potential_prime / (2 * omega)
                    omega_second = (
                        potential_second / (2 * omega)
                        - potential_prime**2 / (4 * omega**3)
                    )
                    log_omega_prime = omega_prime / omega
                    log_omega_second = omega_second / omega - log_omega_prime**2
                    # Maximize over the bounded sine/cosine factors in
                    # theta'=Omega+q sin(theta)cos(theta).
                    theta_first_error = omega - k_value + abs(log_omega_prime) / 2
                    theta_second_bound = (
                        abs(omega_prime)
                        + abs(log_omega_second) / 2
                        + abs(log_omega_prime)
                        * (omega + abs(log_omega_prime) / 2)
                    )
                    scale = n_value / lam
                    first_ratio = (
                        scale * theta_first_error
                        / (ell_value / (q_value * y_value**2))
                    )
                    second_ratio = (
                        scale**2 * theta_second_bound
                        / (ell_value / (q_value * y_value**3))
                    )
                    worst_first = max(worst_first, first_ratio)
                    worst_second = max(worst_second, second_ratio)
        self.assertLess(worst_first, 2.0)
        self.assertLess(worst_second, 12.0)

    def test_near_bandwidth_and_schur_row_sum(self) -> None:
        for conductor in (2_000, 10_000, 50_000):
            ell_value = math.log(conductor)
            for q_value in (2.0, 4.0, 10.0):
                x_value = int(q_value * conductor)
                width = max(1, math.ceil(8 * ell_value / q_value))
                # Dimensionless kernel after removing A/(L X^2).
                row_sum = 0.0
                for distance in range(0, x_value + 1):
                    multiplicity = 1 if distance == 0 else 2
                    if distance <= width:
                        entry = 1.0
                    else:
                        entry = 1 / distance
                    row_sum += multiplicity * entry
                self.assertLess(row_sum, 25 * math.log(2 * x_value))

    def test_synthesis_exponents_for_unit_and_discrepancy_weights(self) -> None:
        for conductor, x_value in (
            (10_000.0, 20_000.0),
            (10_000.0, 2 * math.pi * 10_000.0),
            (10_000.0, 200_000.0),
        ):
            ell_value = math.log(conductor)
            gram_norm = conductor * math.log(2 * x_value) / (
                ell_value * x_value**2
            )
            unit_square = gram_norm * x_value
            discrepancy_square = gram_norm * x_value * math.log(2 * x_value)
            self.assertAlmostEqual(
                unit_square,
                conductor * math.log(2 * x_value) / (ell_value * x_value),
            )
            self.assertAlmostEqual(
                discrepancy_square,
                conductor * math.log(2 * x_value) ** 2
                / (ell_value * x_value),
            )

    def test_elementary_mangoldt_second_moment_has_x_log_x_scale(self) -> None:
        for x_value in (200, 1_000, 5_000):
            total = math.fsum(
                (mangoldt(n_value) - 1.0) ** 2
                for n_value in range(x_value + 1, 2 * x_value + 1)
            )
            self.assertLess(total, 3.0 * x_value * math.log(2 * x_value))

    def test_dyadic_far_tail_norms_are_summable(self) -> None:
        for ell_value in (20.0, 100.0, 500.0):
            s_total = math.fsum(
                2 ** (-index / 2) * math.sqrt(1 + index / ell_value)
                for index in range(200)
            )
            r_total = math.fsum(
                2 ** (-index / 2) * (ell_value + index) / math.sqrt(ell_value)
                for index in range(200)
            )
            self.assertLess(s_total, 5.0)
            self.assertLess(r_total, 5.0 * math.sqrt(ell_value))

    def test_hermitian_rearrangement_and_completion_of_squares(self) -> None:
        for s_value, r_value in ((2.0, -5.0), (-3.0, 4.0), (0.5, 7.0)):
            direct = 0.5 * s_value**2 + 0.5 * s_value * r_value
            completed = (
                0.25 * s_value**2
                +0.25 * (s_value + r_value) ** 2
                -0.25 * r_value**2
            )
            self.assertAlmostEqual(direct, completed)
            self.assertGreaterEqual(direct + 0.25 * r_value**2, -1e-12)
        for token in (
            "{1\\over2}S_{\\geq2A}^*S_{\\geq2A}",
            "{1\\over4}\\{S_{\\geq2A}^*R_{\\geq2A}",
            "Q_{{\\rm res},1,\\geq2A}",
            "={1\\over2}\\sum_{n>2A}\\Lambda(n)T_n^*T_n",
            "Q_{1,\\geq2A}",
            "- {1\\over4}R^*R",
        ):
            # Ignore a single formatting space in the displayed completion.
            self.assertIn(token.replace("- ", "-"), self.text.replace("- ", "-"))

    def test_separate_windows_and_cross_gamma_scope_are_explicit(self) -> None:
        for token in (
            "separate inward and prime windows",
            "`U=(X,2X]` and `V=(Y,2Y]`",
            "\\|S_U^*R_V+R_V^*S_U\\|",
            "cross-cluster",
            "cross-gamma terms",
            "no diagonal-modal replacement",
            "fixed `2m` modal coordinates",
            "bounded Fejer\nweights",
        ):
            self.assertIn(token, self.text)

    def test_no_pnt_or_rh_strength_is_used_and_claim_boundary_is_fail_closed(self) -> None:
        for token in (
            "no prime-number theorem",
            "neither a classical zero-free-region remainder nor an RH-strength",
            "pointwise PNT bound followed by crude `J_1` variation does not",
            "Chebyshev's bound",
            "uses neither a\nzero-free region nor RH",
            "`l>1`",
            "complete central form",
            "no determinant or RH",
        ):
            self.assertIn(token, self.text)

    def test_far_annulus_is_polylogarithmic_against_forced_scale(self) -> None:
        modal_count = 8
        for sigma in (0.51, 0.7, 0.99):
            previous = math.inf
            for log_c in (10_000.0, 100_000.0, 1_000_000.0):
                log_l = math.log(log_c)
                log_ratio = (
                    0.5 * log_l
                    +(2 * modal_count) * math.log(log_l)
                    -sigma * log_c
                )
                self.assertLess(log_ratio, previous)
                previous = log_ratio

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 45)
        source = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            tex = Path(tmp) / "displays.tex"
            tex.write_text(source, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex.name],
                cwd=tmp,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-5000:])

    def test_display_balance_unique_tags_ascii_and_no_placeholder(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("AWAITING_FINAL_FREEZE", self.text)
        self.assertNotIn("TO_BE_FROZEN", self.text)
        self.assertNotIn(",qquad", self.text)


if __name__ == "__main__":
    unittest.main()
