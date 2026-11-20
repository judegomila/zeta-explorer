#!/usr/bin/env python3
"""Regressions for the all-outward hard-tail divisor regrouping."""

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
    / "GROWING_TRANSITION_ORDERED_PRIME_ALL_OUTWARD_HARD_TAIL_DIVISOR_REGROUPING_THEOREM.md"
)
NOTE_HASH = "0f3de001b13125dcb6efe5cd0d9afa5c7a897f47fc732f06aac9f63fa457f50f"

FROZEN = {
    "notes/GROWING_TRANSITION_ORDERED_PRIME_HARD_TAIL_PNT_GRAM_REDUCTION.md":
        "b8439dcfa6f969fd84dae8fafb5474c3e176ba14d84c7d73140fabeac042a4be",
    "tests/test_growing_transition_ordered_prime_hard_tail_pnt_gram_reduction.py":
        "1101aebef550259387eb6220cf8b2740d728c2f52ddf6349b253d6a555248cb6",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md":
        "c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc",
    "tests/test_growing_transition_ordered_prime_far_annulus_dilation_large_sieve_theorem.py":
        "1b09dd1eac6356e5a9faecbee8b400911d28577e473ee3583cfb1df349587f1b",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md":
        "93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675",
    "tests/test_growing_transition_ordered_prime_near_band_fold_large_sieve_theorem.py":
        "4d1075a2b61ef9d1cb510b2e21ac0225b94f702829b426014b8581c5ee6a72e6",
    "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md":
        "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79",
    "tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py":
        "73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def von_mangoldt(index: int) -> float:
    if index < 2:
        return 0.0
    for prime in range(2, index + 1):
        if any(prime % divisor == 0
               for divisor in range(2, math.isqrt(prime) + 1)):
            continue
        power = prime
        while power < index:
            power *= prime
        if power == index:
            return math.log(prime)
    return 0.0


def divisors(index: int) -> list[int]:
    result: list[int] = []
    for divisor in range(1, math.isqrt(index) + 1):
        if index % divisor:
            continue
        result.append(divisor)
        if divisor * divisor != index:
            result.append(index // divisor)
    return sorted(result)


class OrderedPrimeAllOutwardHardTailDivisorRegroupingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_note_and_dependencies_are_frozen(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
        if NOTE_HASH.startswith("DRAFT_"):
            self.skipTest("draft awaits final exact freeze")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_finite_fejer_divisor_grouping_is_exact(self) -> None:
        conductor = 6.25
        cutoff = 18
        support = 12

        def weight(index: int) -> float:
            return max(0.0, 1.0 - index / support)

        rows = {
            index: complex(math.sin(index), math.cos(index / 2))
            for index in range(1, support * cutoff + 1)
        }
        inward = sum(
            weight(index) * rows[index]
            for index in range(math.floor(conductor) + 1, support)
        )
        prime_map_direct = sum(
            von_mangoldt(prime_index) * weight(ell) * rows[ell * prime_index]
            for prime_index in range(math.floor(conductor) + 1, cutoff + 1)
            for ell in range(1, support)
        )

        coefficient: dict[int, float] = {}
        for prime_index in range(math.floor(conductor) + 1, cutoff + 1):
            for ell in range(1, support):
                product = ell * prime_index
                coefficient[product] = coefficient.get(product, 0.0) + (
                    von_mangoldt(prime_index) * weight(ell)
                )
        prime_map_grouped = sum(
            value * rows[product]
            for product, value in coefficient.items()
        )
        self.assertAlmostEqual(prime_map_direct.real, prime_map_grouped.real)
        self.assertAlmostEqual(prime_map_direct.imag, prime_map_grouped.imag)

        direct_upper = 0.5 * inward.conjugate() * prime_map_direct
        hermitian = direct_upper.real
        grouped_hermitian = 0.25 * (
            inward.conjugate() * prime_map_grouped
            +prime_map_grouped.conjugate() * inward
        )
        self.assertAlmostEqual(hermitian, grouped_hermitian.real)

    def test_divisor_coefficient_is_bounded_by_log(self) -> None:
        for threshold in (6.25, 20.25, 70.25):
            for index in range(math.floor(threshold) + 1, 300):
                partial = math.fsum(
                    von_mangoldt(divisor)
                    for divisor in divisors(index)
                    if divisor > threshold
                )
                complete = math.fsum(
                    von_mangoldt(divisor) for divisor in divisors(index)
                )
                self.assertLessEqual(partial, complete + 1e-14)
                self.assertAlmostEqual(complete, math.log(index), places=12)

    def test_transition_divisor_is_only_l_one(self) -> None:
        for odd_p in (5, 9, 21, 101):
            conductor = (odd_p / 2) ** 2
            for product in range(
                math.floor(conductor) + 1,
                math.ceil(2 * conductor),
            ):
                large_divisors = [
                    divisor
                    for divisor in divisors(product)
                    if divisor > conductor
                ]
                self.assertEqual(large_divisors, [product])
                coefficient = math.fsum(
                    von_mangoldt(divisor) for divisor in large_divisors
                )
                self.assertAlmostEqual(coefficient, von_mangoldt(product))

    def test_reciprocal_gauge_preserves_each_cross(self) -> None:
        for inward, outward, left, right in (
            (11, 21, 2.0 - 3.0j, -1.5 + 0.7j),
            (80, 33, -0.2 + 4.0j, 3.1 - 2.2j),
        ):
            scalar = inward / outward
            original = 2 * (left.conjugate() * right).real
            gauged = 2 * (
                (scalar * left).conjugate() * (right / scalar)
            ).real
            self.assertAlmostEqual(original, gauged)

    def test_resonance_grouping_keeps_left_fejer_weight(self) -> None:
        conductor = 6.25
        cutoff = 40
        support = 14

        def weight(index: int) -> float:
            return max(0.0, 1.0 - index / support)

        rows = {
            index: complex(math.sin(index / 3), math.cos(index / 5))
            for index in range(1, support * cutoff + 1)
        }
        direct = 0.0
        for prime_index in range(math.floor(conductor) + 1, cutoff + 1):
            for ell in range(1, support):
                product = ell * prime_index
                if product >= support:
                    continue
                direct += (
                    0.5
                    *weight(product)
                    *von_mangoldt(prime_index)
                    *weight(ell)
                    *abs(rows[product]) ** 2
                )
        grouped = 0.0
        for product in range(math.floor(conductor) + 1, support):
            p_value = math.fsum(
                von_mangoldt(divisor) * weight(product // divisor)
                for divisor in divisors(product)
                if conductor < divisor <= cutoff
            )
            grouped += 0.5 * weight(product) * p_value * abs(rows[product]) ** 2
        self.assertAlmostEqual(direct, grouped, places=13)
        self.assertGreaterEqual(grouped, 0.0)

    def test_near_frame_exponents_are_not_misread(self) -> None:
        for conductor, ell_value in ((1e8, math.log(1e8)), (1e12, math.log(1e12))):
            frame_square = ell_value**4 / math.sqrt(conductor)
            sampler_square = frame_square * conductor
            prime_square = frame_square * conductor * ell_value
            self.assertAlmostEqual(
                math.sqrt(sampler_square),
                conductor**0.25 * ell_value**2,
            )
            self.assertAlmostEqual(
                math.sqrt(prime_square),
                conductor**0.25 * ell_value**2.5,
            )
            self.assertTrue(math.isclose(
                math.sqrt(sampler_square * prime_square),
                math.sqrt(conductor) * ell_value**4.5,
                rel_tol=2e-15,
            ))

    def test_far_divisor_dyadic_norm_is_only_order_l(self) -> None:
        for ell_value in (20.0, 100.0, 500.0):
            total = math.fsum(
                2 ** (-index / 2)
                * (ell_value + index + 1) ** 1.5
                / math.sqrt(ell_value)
                for index in range(300)
            )
            self.assertLess(total, 8 * ell_value)

    def test_strict_half_threshold_is_binding(self) -> None:
        modal_count = 8
        frame_exponent = 5
        for sigma in (0.51, 0.7, 0.99):
            values = []
            for ell_value in (20_000.0, 200_000.0, 2_000_000.0):
                log_ratio = (
                    (0.5 - sigma) * ell_value
                    +(frame_exponent + 0.5 + 2 * modal_count)
                    *math.log(ell_value)
                )
                values.append(log_ratio)
            self.assertLess(values[-1], values[-2])
        endpoint_log_ratio = (
            (frame_exponent + 0.5 + 2 * modal_count) * math.log(2_000_000.0)
        )
        self.assertGreater(endpoint_log_ratio, 0.0)

    def test_finite_and_ordered_coefficients_are_locked(self) -> None:
        for token in (
            "Q^\\uparrow_{>>,F,R}={1\\over2}S_{A,F}^*P_{A,F,R}",
            "{1\\over4}\\{S_{A,F}^*P_{A,F,R}",
            "p_{A,F,R}(k)",
            "\\Lambda(n)\\omega_F(k/n)",
            "does not contain a spurious `omega_F(k)`",
            "Take `R to infinity` first",
            "then the ordered limit `F to infinity`",
            "operator-norm dominated convergence",
        ):
            self.assertIn(token, self.text)

    def test_all_l_coefficient_and_bounds_are_locked(self) -> None:
        for token in (
            "\\mathcal P_A(k)=\\sum_",
            "\\sum_{d\\mid k}\\Lambda(d)=\\log k",
            "All `l>=1` rows",
            "\\mathcal P_A(k)=\\Lambda(k)",
            "{C_mA\\log^3(2X_j)\\over LX_j}",
            "\\|P_A^{\\rm far}\\|",
            "\\leq C_mL",
            "\\|S_A^{\\rm far}\\|",
        ):
            self.assertIn(token, self.text)

    def test_raw_resonance_and_off_blocks_are_distinct(self) -> None:
        for token in (
            "Q^{\\rm raw}_{>>}",
            "Q_{{\\rm res},>>}",
            "={1\\over2}\\sum_{k>A}\\mathcal P_A(k)T_k^*T_k",
            "positive coordinate subblock",
            "O_m(L^2)=o(T_L)",
            "Q_{{\\rm off},>>}=Q^{\\rm raw}_{>>}-Q_{{\\rm res},>>}",
            "actual ordered nonresonant coordinate block",
        ):
            self.assertIn(token, self.text)

    def test_scale_and_scope_are_fail_closed(self) -> None:
        for token in (
            "A^{1/2}L^{K_0+1/2}",
            "exactly when }\\sigma>{1\\over2}",
            "fails closed at the endpoint",
            "does not assert\na Loewner sign for the complementary union",
            "makes no\nedge-union Loewner claim",
            "no complete\ncentral sign",
            "no complete central sign, determinant convergence, or RH theorem",
            "project state\nremains `P0_INVALIDATED`",
        ):
            self.assertIn(token, self.text)

    def test_no_prime_theorem_or_illegal_product_regrouping(self) -> None:
        for token in (
            "No prime-number theorem",
            "not the prohibited scalar regrouping by a product `mln`",
            "The gauged rows themselves are not divisor-regrouped",
            "uses no PNT discrepancy estimate",
            "no estimate is obtained by summing separate fixed-`l`",
        ):
            self.assertIn(token, self.text)

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            +"\n".join("\\[" + display + "\\]" for display in displays)
            +"\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ascii_balanced_displays_unique_tags_and_no_placeholder(self) -> None:
        starts = re.findall(r"(?m)^\\s*\\\[\\s*$", self.text)
        ends = re.findall(r"(?m)^\\s*\\\]\\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\\{([^}]+)\\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(
            byte in (9, 10, 13) or 32 <= byte <= 126
            for byte in data
        ))
        self.assertNotIn("AWAITING_FINAL_FREEZE", self.text)
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
