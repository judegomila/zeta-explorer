#!/usr/bin/env python3
"""Regressions for the global-radical sector-mixing feature barrier."""

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
    / "GROWING_TRANSITION_GLOBAL_RADICAL_SECTOR_MIXING_FEATURE_GEOMETRY_BARRIER.md"
)
NOTE_HASH = "976f9299c4d002db3f0b73f0b4da8cc383480c8b55b7ea5ccdc219d9135fbdc4"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md":
        "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74",
    "tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py":
        "d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140",
    "notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md":
        "eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584",
    "tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py":
        "3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b",
    "notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md":
        "e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816",
    "tests/test_common_radical_leakage_gram_orientation.py":
        "d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md":
        "511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460",
    "tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py":
        "634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def signed(vector: tuple[float, float]) -> float:
    return vector[0] * vector[0] - vector[1] * vector[1]


def inner(
    left: tuple[float, float], right: tuple[float, float]
) -> float:
    return left[0] * right[0] + left[1] * right[1]


def signed_inner(
    left: tuple[float, float], right: tuple[float, float]
) -> float:
    return left[0] * right[0] - left[1] * right[1]


def s_form(left: complex, right: complex) -> complex:
    return left.conjugate() * right + right.conjugate() * left


def von_mangoldt(index: int) -> float:
    if index < 2:
        return 0.0
    for prime in range(2, index + 1):
        if any(
            prime % divisor == 0
            for divisor in range(2, math.isqrt(prime) + 1)
        ):
            continue
        power = prime
        while power < index:
            power *= prime
        if power == index:
            return math.log(prime)
    return 0.0


class GlobalRadicalSectorMixingFeatureBarrierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_pointwise_radical_and_both_gram_blocks(self) -> None:
        epsilon = 0.3
        z = (math.sqrt(epsilon / 2.0), math.sqrt(epsilon / 2.0))
        zx = (-z[0], -z[1])
        zo = z
        zk = (zx[0] + zo[0], zx[1] + zo[1])
        self.assertEqual(zk, (0.0, 0.0))

        positive = (
            (inner(zx, zx), inner(zx, zo)),
            (inner(zo, zx), inner(zo, zo)),
        )
        self.assertAlmostEqual(positive[0][0], epsilon)
        self.assertAlmostEqual(positive[0][1], -epsilon)
        self.assertAlmostEqual(positive[1][0], -epsilon)
        self.assertAlmostEqual(positive[1][1], epsilon)

        q_value = signed(z)
        signed_block = (
            (signed_inner(zx, zx), signed_inner(zx, zo)),
            (signed_inner(zo, zx), signed_inner(zo, zo)),
        )
        self.assertAlmostEqual(signed_block[0][0], q_value)
        self.assertAlmostEqual(signed_block[0][1], -q_value)
        self.assertAlmostEqual(signed_block[1][0], -q_value)
        self.assertAlmostEqual(signed_block[1][1], q_value)

    def test_cross_involution_and_difference_of_grams(self) -> None:
        for left, right in (
            (1.0 + 2.0j, -0.4 + 0.8j),
            (2.0, 2.0),
            (2.0, -2.0),
        ):
            cross = s_form(complex(left), complex(right))
            difference = 0.5 * (
                abs(left + right) ** 2 - abs(left - right) ** 2
            )
            self.assertAlmostEqual(cross.real, difference)
            self.assertAlmostEqual(cross.imag, 0.0)

    def test_ordered_prime_has_both_one_quarter_factors(self) -> None:
        weight = 7.0
        left = 0.7 - 1.2j
        right = -0.3 + 0.9j
        upper = 0.5 * weight * left.conjugate() * right
        hermitian = 0.5 * (upper + upper.conjugate())
        direct_integral = 0.25 * weight * s_form(left, right)
        self.assertAlmostEqual(hermitian.real, direct_integral.real)
        self.assertAlmostEqual(hermitian.imag, 0.0)

    def test_prime_feature_is_finite_only_with_second_cutoff(self) -> None:
        a_value = 25.0 / 4.0
        repeated_inward_norm = 2.0
        masses = []
        for prime_cutoff in (20, 100, 500):
            mass = 0.25 * repeated_inward_norm * sum(
                von_mangoldt(index)
                for index in range(math.floor(a_value) + 1, prime_cutoff + 1)
            )
            masses.append(mass)
            for index in range(math.floor(a_value) + 1, prime_cutoff + 1):
                self.assertEqual(max(2.5 / index, 1.0 / 2.5), 1.0 / 2.5)
        self.assertLess(masses[0], masses[1])
        self.assertLess(masses[1], masses[2])
        self.assertGreater(masses[2], 10.0 * masses[0])

    def test_prime_threshold_does_not_reuse_positive_gram_A(self) -> None:
        self.assertNotIn("`n>A`", self.text)
        self.assertNotIn("\\sum_{A<n", self.text)
        self.assertIn("`n>lambda^2`", self.text)
        self.assertIn("\\sum_{\\lambda^2<n\\leq R}\\Lambda(n)", self.text)

    def test_exact_continuous_twins(self) -> None:
        a_value = 1.0 / math.sqrt(2.0)
        a_one = a_value
        b_one = -a_value
        b_plus = 0.0
        local = s_form(complex(a_one), complex(b_one)).real
        self.assertAlmostEqual(local, -1.0)

        remainders: list[float] = []
        completes: list[float] = []
        for a_plus in (-a_value, a_value):
            remainder = (
                s_form(complex(a_one), complex(b_plus))
                + s_form(complex(a_plus), complex(b_one))
                + s_form(complex(a_plus), complex(b_plus))
            ).real
            complete = s_form(
                complex(a_one + a_plus), complex(b_one + b_plus)
            ).real
            self.assertAlmostEqual(complete, local + remainder)
            remainders.append(remainder)
            completes.append(complete)

        self.assertAlmostEqual(remainders[0], 1.0)
        self.assertAlmostEqual(remainders[1], -1.0)
        self.assertAlmostEqual(completes[0], 0.0)
        self.assertAlmostEqual(completes[1], -2.0)

    def test_prime_twins_and_forced_total(self) -> None:
        a_value = 1.0 / math.sqrt(2.0)
        prime_c = (
            s_form(complex(a_value), complex(a_value))
            + s_form(complex(a_value), complex(-a_value))
        ).real
        prime_p = 2.0 * s_form(
            complex(a_value), complex(a_value)
        ).real
        self.assertAlmostEqual(prime_c, 0.0)
        self.assertAlmostEqual(prime_p, 2.0)

        local = -1.0
        cont_remainders = (1.0, -1.0)
        primes = (prime_c, prime_p)
        continuous_totals = (
            local + cont_remainders[0],
            local + cont_remainders[1],
        )
        for continuous, prime, remainder in zip(
            continuous_totals, primes, cont_remainders
        ):
            self.assertAlmostEqual(continuous + prime, 0.0)
            self.assertAlmostEqual(remainder + prime, 1.0)

        primitive_magnitudes_c = (
            abs(a_value), abs(a_value), abs(a_value), abs(-a_value)
        )
        primitive_magnitudes_p = (
            abs(a_value), abs(a_value), abs(a_value), abs(a_value)
        )
        self.assertEqual(primitive_magnitudes_c, primitive_magnitudes_p)

    def test_orthogonal_sector_no_go_above_threshold(self) -> None:
        for tau, outer in ((100.0, 3.0), (20.0, 0.5), (2.0, 0.01)):
            self.assertGreater(tau, outer)
            with self.assertRaises(AssertionError):
                self.assertLessEqual(tau, outer)

        h = math.pi / 4.0
        self.assertLess(0.5 - h * 0.8, 0.0)
        self.assertGreater(0.5 - h * 0.5, 0.0)

    def test_missing_intertwiner_would_force_near_antipodality(self) -> None:
        for tau, outer in ((100.0, 1.0), (10_000.0, 4.0)):
            ratio = math.sqrt(outer / tau)
            self.assertLess(ratio, 0.11)
            local_norm = math.sqrt(tau)
            total_norm = math.sqrt(outer)
            self.assertLessEqual(total_norm / local_norm, ratio + 1e-15)

    def test_scope_and_domain_caveats_are_explicit(self) -> None:
        scope_text = " ".join(self.text.split())
        for token in (
            "pointwise at both paired zero evaluations",
            "stronger than the source-domain identity",
            "does not license separate applications",
            "decomposition by zero orbits",
            "additional finite prime cutoff",
            "genuine finite artificial Krein factorization",
            "only signed cross-form limits",
            "do not define an infinite-prime Hilbert map",
            "take `R to infinity` only in the inherited signed source/Abel form",
            "is not a radical at finite cutoff",
            "cannot be a block-orthogonal direct integral",
            "sector-resolving Krein intertwiner",
            "not a physical Fourier-sampler construction",
            "no RH statement",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, scope_text)

    def test_required_exact_formulas_present(self) -> None:
        for token in (
            "ZK=0,\\qquad ZX=-ZO",
            "\\begin{pmatrix}A&-A\\\\-A&A\\end{pmatrix}",
            "\\mathcal W_Z(X,X)&\\mathcal W_Z(X,O)",
            "J_\\times=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}",
            "Q_{{\\rm cont},M}",
            "d\\mu_{M,R}(m,n,l,u)",
            "={1\\over4}\\omega_M(m)\\Lambda(n)\\omega_M(l)",
            "Q_{p,M,R}=T_{p,M,R}^*J_{p,M,R}T_{p,M,R}",
            "\\sup_R\\|T_{p,M,R}x\\|^2=\\infty",
            "\\sum_{\\lambda^2<n\\leq R}\\Lambda(n)",
            "\\tau_L\\leq |x^*Q_{\\rm loc}x|",
            "G_\\lambda:=U_\\lambda^*U_\\lambda",
            "(R_{\\rm cont}^{C},Q_{p,{\\rm off}}^{C})=(1,0)",
            "P_E(\\widehat R_{\\rm cont}",
        ):
            self.assertIn(token, self.text)

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 35)
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

    def test_display_balance_unique_tags_ascii_and_no_stale_hash(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
