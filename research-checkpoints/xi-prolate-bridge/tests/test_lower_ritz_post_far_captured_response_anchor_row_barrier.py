#!/usr/bin/env python3
"""Regressions for the post-far captured response/anchor-row barrier."""

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
    / "LOWER_RITZ_POST_FAR_CAPTURED_RESPONSE_ANCHOR_ROW_BARRIER.md"
)
TEST = Path(__file__).resolve()
NOTE_HASH = "3628b3b5f6365e0fdbc441ba08503bfed1969fa64f91deb1fd88e79ce5fe5c3e"

FROZEN = {
    "notes/LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md":
        "9288ac25216781416d0bb1d0ef7d2a11f3dd09bac8e8f04195ac9b3e928229f3",
    "tests/test_lower_ritz_post_far_retained_inverse_row_theorem.py":
        "8f2aa9cb6daca472d75a890520c23dfd1b5dcb487e8454b1c12b598b61a58327",
    "notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md":
        "0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3",
    "tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py":
        "8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b",
    "notes/FIXED_ANCHOR_BV_CAUCHY_FAR_ROW_THEOREM.md":
        "59395e5d184c93e3e56c935028c5fba322a0f30476bd9db1c99585c056876c79",
    "tests/test_fixed_anchor_bv_cauchy_far_row_theorem.py":
        "905dae5ca5489665dea4bfa1309d062fbd2769a529674b6c10d380a3f3627e3e",
    "notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md":
        "1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032",
    "tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py":
        "e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa",
    "notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md":
        "c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f",
    "tests/test_growing_low_prefix_half_power_far_cross_theorem.py":
        "be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569",
    "notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md":
        "aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce",
    "tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py":
        "27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed",
    "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md":
        "b0254889d35ae41a92ee926dd116b473ee427e2762f8853903f4e80e307860ed",
    "tests/test_weak_residual_duality.py":
        "0f1f9847497b63b6b2c9e4b9f267dd8157ab71547f80b127d65cbda16af9d659",
    "notes/GROWING_ANCHOR_ROW_FULL_METRIC_TOEPLITZ_INVERSE_ENERGY_BARRIER.md":
        "b5da4b84a6c67c96220cb0fd25b3fec152e01f7ec4c357aea0bd5de986af0178",
    "tests/test_growing_anchor_row_full_metric_toeplitz_inverse_energy_barrier.py":
        "408d8bf2ccfdd116f5a0df8b17c1f0bcda2d4c227c896192f739ad4bc9255e0b",
    "notes/FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md":
        "c69d6d1a69f71548aa9291c5d261117ac913f2851df8f8fcc2f186c8bd530314",
    "tests/test_fixed_prefix_complete_signed_toeplitz_schur_theorem.py":
        "4f704f58524b9f4818db8bd1884009be9f4074fd303e2ec1cca5be5c74f70f87",
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "tests/test_growing_low_prefix_outer_floor_assembly_theorem.py":
        "634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311",
    "notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md":
        "ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86",
    "tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py":
        "bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d",
    "notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md":
        "04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83",
    "tests/test_fixed_source_block_shift_asymptotic_theorem.py":
        "433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5",
    "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md":
        "39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3",
    "tests/test_physical_leverage_shorted_schur.py":
        "4bc5d051a3793bcc85b5867180f6ea6ac084d6653229d5825af6185773985305",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def transpose(matrix: list[list[F]]) -> list[list[F]]:
    return [list(row) for row in zip(*matrix)]


def matmul(left: list[list[F]], right: list[list[F]]) -> list[list[F]]:
    return [
        [
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                F(0),
            )
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def inv2(matrix: list[list[F]]) -> list[list[F]]:
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    return [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant],
    ]


def quadratic(vector: list[F], matrix: list[list[F]]) -> F:
    column = [[value] for value in vector]
    return matmul(matmul([vector], matrix), column)[0][0]


def subtract(left: list[list[F]], right: list[list[F]]) -> list[list[F]]:
    return [
        [left[i][j] - right[i][j] for j in range(len(left[0]))]
        for i in range(len(left))
    ]


def is_psd2(matrix: list[list[F]]) -> bool:
    return (
        matrix[0][0] >= 0
        and matrix[1][1] >= 0
        and matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0] >= 0
    )


class PostFarCapturedResponseAnchorRowBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_post_far_source_coordinate_identity(self) -> None:
        d_form = [[F(5), F(1)], [F(1), F(4)]]
        cross = [[F(1), F(2)]]
        high = F(10)
        raw = [F(2), F(-1)]
        far = F(3)

        loss = [
            [cross[0][i] * cross[0][j] / high for j in range(2)]
            for i in range(2)
        ]
        short = subtract(d_form, loss)
        returned = [
            raw[i] - cross[0][i] * far / high
            for i in range(2)
        ]

        # E maps x to (x,-H^{-1}Gx).
        lift = [
            [F(1), F(0)],
            [F(0), F(1)],
            [-cross[0][0] / high, -cross[0][1] / high],
        ]
        full_form = [
            [d_form[0][0], d_form[0][1], cross[0][0]],
            [d_form[1][0], d_form[1][1], cross[0][1]],
            [cross[0][0], cross[0][1], high],
        ]
        forcing = [[raw[0]], [raw[1]], [far]]
        self.assertEqual(
            matmul(matmul(transpose(lift), full_form), lift),
            short,
        )
        returned_direct = matmul(transpose(lift), forcing)
        self.assertEqual([entry[0] for entry in returned_direct], returned)

    def test_far_return_bound_is_exact_in_model(self) -> None:
        cross = [F(1), F(2)]
        high = F(10)
        far = F(3)
        returned_loss = [entry * far / high for entry in cross]
        return_norm = sum((entry * entry for entry in returned_loss), F(0))
        ell = sum((entry * entry for entry in cross), F(0)) / high
        far_energy = far * far / high
        self.assertEqual(return_norm, F(9, 20))
        self.assertEqual(return_norm, ell * far_energy)

    def test_multiplicative_floor_and_inverse_comparison(self) -> None:
        d_form = [[F(5), F(1)], [F(1), F(4)]]
        loss = [[F(1, 10), F(1, 5)], [F(1, 5), F(2, 5)]]
        short = subtract(d_form, loss)
        alpha = F(3)
        ell = F(1, 2)
        delta = ell / alpha

        d_minus_floor = subtract(d_form, [[alpha, F(0)], [F(0), alpha]])
        scaled_d = [
            [(F(1) - delta) * entry for entry in row]
            for row in d_form
        ]
        self.assertTrue(is_psd2(d_minus_floor))
        self.assertTrue(is_psd2(subtract(short, scaled_d)))

        raw = [F(2), F(-1)]
        z = [F(3, 10), F(3, 5)]
        returned = [raw[i] - z[i] for i in range(2)]
        d_inv = inv2(d_form)
        short_inv = inv2(short)
        raw_energy = quadratic(raw, d_inv)
        z_energy = quadratic(z, d_inv)
        returned_energy = quadratic(returned, short_inv)

        self.assertLessEqual(
            returned_energy,
            F(2) * (raw_energy + z_energy) / (F(1) - delta),
        )
        self.assertLessEqual(
            raw_energy,
            F(2) * (returned_energy + z_energy),
        )

    def test_rank_one_sampling_and_mellin_response_bound(self) -> None:
        prefix = [[F(4), F(1)], [F(1), F(3)]]
        prefix_inverse = inv2(prefix)
        sampling = [[F(1), F(0)], [F(0), F(2)]]
        u_shift = F(1, 100)
        returned = [F(1, 10), F(0)]
        mellin = [F(2), F(-1)]

        # cc^* <= U Z^*Z in this exact diagonal example.
        cc_star = [
            [returned[i] * returned[j] for j in range(2)]
            for i in range(2)
        ]
        sampling_gram = matmul(transpose(sampling), sampling)
        dominated = [
            [u_shift * sampling_gram[i][j] for j in range(2)]
            for i in range(2)
        ]
        self.assertTrue(is_psd2(subtract(dominated, cc_star)))

        response = matmul(matmul([mellin], prefix_inverse), [[v] for v in returned])[0][0]
        inverse_norm_bound = F(1, 2)  # lambda_min(prefix) is greater than 2.
        euclidean_mellin = sum((v * v for v in mellin), F(0))
        euclidean_returned = sum((v * v for v in returned), F(0))
        self.assertLessEqual(
            response * response,
            inverse_norm_bound * inverse_norm_bound
            * euclidean_mellin * euclidean_returned,
        )

    def test_ridge_decreases_far_resolvents_and_preserves_floor(self) -> None:
        low = F(5)
        cross = F(2)
        high = F(3)
        raw_forcing = F(1)
        far_forcing = F(1)
        raw_mellin = F(2)
        far_mellin = F(1)

        previous_inverse = None
        previous_inverse_square = None
        for ridge in (F(0), F(1), F(4)):
            high_ridge = high + ridge
            inverse = F(1) / high_ridge
            inverse_square = inverse * inverse
            prefix = low + ridge - cross * cross * inverse
            far_return = cross * inverse * far_forcing
            returned = raw_forcing - cross * inverse * far_forcing
            returned_mellin = raw_mellin - cross * inverse * far_mellin
            response = returned_mellin * returned / prefix

            ell_ridge = cross * cross * inverse
            far_energy_ridge = far_forcing * far_forcing * inverse
            self.assertEqual(far_return * far_return, ell_ridge * far_energy_ridge)
            self.assertGreaterEqual(prefix, low - cross * cross / high)
            self.assertLessEqual(abs(response), abs(returned_mellin * returned) / prefix)
            if previous_inverse is not None:
                self.assertLessEqual(inverse, previous_inverse)
                self.assertLessEqual(inverse_square, previous_inverse_square)
            previous_inverse = inverse
            previous_inverse_square = inverse_square

    def test_projected_anchor_normalization_is_bounded(self) -> None:
        source_coefficient = F(3, 16)  # any fixed positive coefficient
        physical_norms = (F(7, 10), F(3, 4), F(4, 5))
        normalizations = [source_coefficient * value for value in physical_norms]
        self.assertTrue(all(value > 0 for value in normalizations))
        self.assertLessEqual(max(normalizations), source_coefficient)

    def test_strict_strip_power_is_negative(self) -> None:
        for eta in (F(0), F(1, 4), F(49, 100)):
            exponent = -F(1) + F(2) * eta
            self.assertLess(exponent, 0)

    def test_two_sided_endpoint_compression_is_not_one_sided(self) -> None:
        epsilon = [[F(1)], [F(1)]]
        endpoint_null = [[F(1)], [F(-1)]]
        row = [[F(1)], [F(0)]]
        end_form = [
            [F(2), F(1)],
            [F(1), F(0)],
        ]
        self.assertEqual(matmul(transpose(epsilon), endpoint_null), [[F(0)]])
        self.assertEqual(
            matmul(matmul(transpose(endpoint_null), end_form), endpoint_null),
            [[F(0)]],
        )
        one_sided = matmul(matmul(transpose(row), end_form), endpoint_null)
        self.assertEqual(one_sided, [[F(1)]])

    def test_scope_and_required_formulas(self) -> None:
        required = (
            "Every inverse below is conditional on the unproved strict branch",
            "c_Q=a_Q-z_Q",
            "\\|z_Q\\|^2\\leq\\ell_Q",
            "(1-\\delta_Q)D_Q\\preceq\\widehat P_Q",
            "\\Longleftrightarrow",
            "determinant-only conclusion",
            "m_{Q,s,z}=\\widetilde V_{Q,s}^*h_z",
            "\\sup_{s\\geq0}",
            "s=h=u-mu",
            "bb^*\\preceq U_ZG_Z",
            "\\alpha_{\\lambda,N}=\\mathfrak a_4\\|p_4\\|",
            "source-normalized captured determinant summand",
            "eta<1/2",
            "two-sided in the frozen theorem",
            "x^*E_{\\rm end}J_Q",
            "range enlargement",
            "minimal remaining statement",
            "retained inverse row and retained Mellin response remain",
            "far and retained response terms remain separate",
            "`P0_INVALIDATED`",
            "standard eight are unchanged",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        forbidden = (
            "proves the Riemann hypothesis",
            "the captured inverse energy is proved",
            "the retained response tends to zero",
            "endpoint nullity kills the one-sided anchor row",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ascii_python_and_whitespace_hygiene(self) -> None:
        ast.parse(TEST.read_text(encoding="utf-8"), filename=str(TEST))
        self.assertNotRegex(self.text, re.compile(r"(?<!\\)\$"))
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertEqual(
            self.text.count(r"\begin{aligned}"),
            self.text.count(r"\end{aligned}"),
        )
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(any(line.endswith((b" ", b"\t")) for line in payload.splitlines()))


if __name__ == "__main__":
    unittest.main()
