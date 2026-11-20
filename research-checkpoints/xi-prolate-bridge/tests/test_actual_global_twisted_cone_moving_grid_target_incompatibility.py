#!/usr/bin/env python3
"""Regressions for the moving-grid twisted-cone target incompatibility."""

from __future__ import annotations

import ast
from decimal import Decimal
from fractions import Fraction as F
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
    / "ACTUAL_GLOBAL_TWISTED_CONE_MOVING_GRID_TARGET_INCOMPATIBILITY.md"
)
NOTE_HASH = "0fb7b3d1ab5980b9cdc490933c68d9da3536a8d77a677fe96ec921445639121f"

FROZEN = {
    "notes/ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md":
        "39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329",
    "tests/test_actual_source_row_paired_gram_exclusion_selector_moment_gate.py":
        "4605cc87111476f3defeaa3e7dbf2f78e4f8b4b92ce9f3e9d2a3b2bf855d5ec3",
    "notes/ACTUAL_GROUND_FIXED_MODE_RESIDUE_SIGN_BARRIER.md":
        "3a64146e1f3836b9dd07ae55a1955e7d66cd35ad72f58d4ce116c18b16cddcce",
    "tests/test_actual_ground_fixed_mode_residue_sign_barrier.py":
        "5ea8d73b2641f6fe31e494bcd4ab0e524940bc7575d6c5b8a784e7e415201216",
    "notes/OPPOSITE_BOUNDARY_TWISTED_WEYL_SOURCE_QUOTIENT_BARRIER.md":
        "a6b21ec0048f632d67ff32f116291e011f66b5c1a168df12442cac19d33c2258",
    "tests/test_opposite_boundary_twisted_weyl_source_quotient_barrier.py":
        "5b368373194720eb8a332475c21425dace632678975127c7bbfdb94f863382d2",
    "notes/DETERMINANT_LIMIT_AUDIT.md":
        "1a77a7b6e7b9573c0f9f6656481af24962280959d867177fa232e8f2cfa006b0",
    "tests/test_determinant_bridge.py":
        "d2fee5eb81291b8dbd2bb2e229a89c52cf36704f76d0873f4cdf4e505bb2c69d",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md":
        "d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0",
}

ARTIFACTS = {
    "artifacts/xi_real_sign_13_15/xi_real_sign_producer.c":
        "1e98148b44eb11d2496a2f9fe6c0de2eddf4f4d727d1b13047755bc2f037c465",
    "artifacts/xi_real_sign_13_15/producer_256bits.txt":
        "03cef82f8adb24b6c7b35e2e97c2c9e7363ced079245a1b56be531bdd1f937a6",
    "artifacts/xi_real_sign_13_15/xi_real_sign_verifier.c":
        "6667cf135408fa1d76cef8615d3bab196872062fc60e410de11ca7baa3849334",
    "artifacts/xi_real_sign_13_15/verifier_512bits.txt":
        "02707035c10c098eecea659ac0459ef43ca550d3eaee0abf7f1bc93af520b08f",
}

BALL = re.compile(
    rb"^BALL ([A-Za-z0-9_()]+) \[([+-]?[0-9.]+(?:e[+-]?[0-9]+)?) "
    rb"\+/- ([0-9.]+(?:e[+-]?[0-9]+)?)\]$",
    re.MULTILINE,
)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def balls(raw: bytes) -> dict[str, tuple[Decimal, Decimal]]:
    result = {}
    for name, midpoint, radius in BALL.findall(raw):
        result[name.decode("ascii")] = (
            Decimal(midpoint.decode("ascii")),
            Decimal(radius.decode("ascii")),
        )
    return result


def strictly_inside(
    ball: tuple[Decimal, Decimal],
    lower: F,
    upper: F,
) -> bool:
    midpoint, radius = ball
    low = Decimal(lower.numerator) / Decimal(lower.denominator)
    high = Decimal(upper.numerator) / Decimal(upper.denominator)
    return low < midpoint - radius and midpoint + radius < high


def validate_producer(raw: bytes) -> None:
    required = (
        b"META schema=xi-real-sign-13-15-direct-v1",
        b"META flint_version=3.6.0",
        b"META arithmetic_library=FLINT_ARB",
        b"META precision_bits=256",
        b"FORMULA Xi(t)=one_half*s*(s-1)*pi^(-s/2)*Gamma(s/2)*zeta(s)",
        b"FORMULA s=one_half+i*t",
        b"ENCLOSURE Xi(13) (2905/1000000,2906/1000000)",
        b"CHECK Xi(13)>0=PASS",
        b"ENCLOSURE Xi(15) (-706/1000000,-705/1000000)",
        b"CHECK Xi(15)<0=PASS",
        b"CHECK all=PASS",
    )
    for token in required:
        if token not in raw:
            raise ValueError(token)
    parsed = balls(raw)
    if set(parsed) != {"Xi(13)", "Xi(15)"}:
        raise ValueError("producer ball set")
    if not strictly_inside(parsed["Xi(13)"], F(2905, 10**6), F(2906, 10**6)):
        raise ValueError("Xi(13) enclosure")
    if not strictly_inside(parsed["Xi(15)"], F(-706, 10**6), F(-705, 10**6)):
        raise ValueError("Xi(15) enclosure")


def validate_verifier(raw: bytes) -> None:
    required = (
        b"META schema=xi-real-sign-13-15-hardy-z-v1",
        b"META flint_version=3.6.0",
        b"META arithmetic_library=FLINT_ARB",
        b"META precision_bits=512",
        b"FORMULA Xi(t)=-positive_factor(t)*HardyZ(t)",
        (
            b"FORMULA positive_factor(t)=one_half*(t^2+one_quarter)"
            b"*pi^(-one_quarter)*abs(Gamma(one_quarter+i*t/2))"
        ),
        b"ENCLOSURE HardyZ(13) (-792/1000,-791/1000)",
        b"ENCLOSURE Xi_from_HardyZ(13) (2905/1000000,2906/1000000)",
        b"CHECK Xi_from_HardyZ(13)>0=PASS",
        b"ENCLOSURE HardyZ(15) (719/1000,721/1000)",
        b"ENCLOSURE Xi_from_HardyZ(15) (-706/1000000,-705/1000000)",
        b"CHECK Xi_from_HardyZ(15)<0=PASS",
        b"CHECK all=PASS",
    )
    for token in required:
        if token not in raw:
            raise ValueError(token)
    parsed = balls(raw)
    expected = {
        "HardyZ(13)",
        "positive_factor(13)",
        "Xi_from_HardyZ(13)",
        "HardyZ(15)",
        "positive_factor(15)",
        "Xi_from_HardyZ(15)",
    }
    if set(parsed) != expected:
        raise ValueError("verifier ball set")
    intervals = {
        "HardyZ(13)": (F(-792, 1000), F(-791, 1000)),
        "Xi_from_HardyZ(13)": (F(2905, 10**6), F(2906, 10**6)),
        "HardyZ(15)": (F(719, 1000), F(721, 1000)),
        "Xi_from_HardyZ(15)": (F(-706, 10**6), F(-705, 10**6)),
    }
    for name, interval in intervals.items():
        if not strictly_inside(parsed[name], *interval):
            raise ValueError(name)
    for name in ("positive_factor(13)", "positive_factor(15)"):
        midpoint, radius = parsed[name]
        if midpoint - radius <= 0:
            raise ValueError(name)


def matrix_inertia(matrix: tuple[tuple[F, ...], ...]) -> tuple[int, int]:
    size = len(matrix)
    lower = [[F(int(i == j)) for j in range(size)] for i in range(size)]
    diagonal = [F(0) for _ in range(size)]
    for i in range(size):
        diagonal[i] = matrix[i][i] - sum(
            (lower[i][k] ** 2 * diagonal[k] for k in range(i)),
            F(0),
        )
        if diagonal[i] == 0:
            raise ArithmeticError("zero pivot")
        for j in range(i + 1, size):
            numerator = matrix[j][i] - sum(
                (lower[j][k] * lower[i][k] * diagonal[k] for k in range(i)),
                F(0),
            )
            lower[j][i] = numerator / diagonal[i]
    return (
        sum(value > 0 for value in diagonal),
        sum(value < 0 for value in diagonal),
    )


class ActualGlobalTwistedConeMovingGridTargetIncompatibilityTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")
        cls.producer_output = (
            ROOT / "artifacts/xi_real_sign_13_15/producer_256bits.txt"
        ).read_bytes()
        cls.verifier_output = (
            ROOT / "artifacts/xi_real_sign_13_15/verifier_512bits.txt"
        ).read_bytes()

    def test_frozen_dependencies_artifacts_and_self_hash(self) -> None:
        for mapping in (FROZEN, ARTIFACTS):
            for relative, expected in mapping.items():
                self.assertEqual(sha256(ROOT / relative), expected, relative)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_rigorous_direct_and_hardy_z_certificates(self) -> None:
        validate_producer(self.producer_output)
        validate_verifier(self.verifier_output)

        direct = balls(self.producer_output)
        replay = balls(self.verifier_output)
        for left_name, right_name in (
            ("Xi(13)", "Xi_from_HardyZ(13)"),
            ("Xi(15)", "Xi_from_HardyZ(15)"),
        ):
            left_midpoint, _ = direct[left_name]
            right_midpoint, _ = replay[right_name]
            self.assertLess(abs(left_midpoint - right_midpoint), Decimal("2e-70"))

    def test_native_flint_reproduction_when_available(self) -> None:
        flint = Path("/opt/homebrew/opt/flint")
        gmp = Path("/opt/homebrew/opt/gmp")
        mpfr = Path("/opt/homebrew/opt/mpfr")
        compiler = shutil.which("clang")
        if compiler is None or not (flint / "include/flint/arb.h").exists():
            self.skipTest("native Homebrew FLINT/Arb is unavailable")

        prefix = [
            compiler,
            "-O2",
            "-std=c11",
            "-Wall",
            "-Wextra",
            "-Werror",
            f"-I{flint / 'include'}",
            f"-I{gmp / 'include'}",
            f"-I{mpfr / 'include'}",
        ]
        suffix = [
            f"-L{flint / 'lib'}",
            f"-L{gmp / 'lib'}",
            f"-L{mpfr / 'lib'}",
            f"-Wl,-rpath,{flint / 'lib'}",
            f"-Wl,-rpath,{gmp / 'lib'}",
            f"-Wl,-rpath,{mpfr / 'lib'}",
            "-lflint",
            "-lmpfr",
            "-lgmp",
            "-lm",
        ]
        with tempfile.TemporaryDirectory() as temporary:
            temporary_path = Path(temporary)
            cases = (
                (
                    "xi_real_sign_producer.c",
                    "producer_256bits.txt",
                    self.producer_output,
                ),
                (
                    "xi_real_sign_verifier.c",
                    "verifier_512bits.txt",
                    self.verifier_output,
                ),
            )
            for source_name, executable_name, expected in cases:
                source = ROOT / "artifacts/xi_real_sign_13_15" / source_name
                executable = temporary_path / executable_name
                compilation = subprocess.run(
                    prefix + [str(source)] + suffix + ["-o", str(executable)],
                    cwd=ROOT,
                    check=False,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                )
                self.assertEqual(compilation.returncode, 0, compilation.stdout)
                result = subprocess.run(
                    [str(executable)],
                    cwd=ROOT,
                    check=False,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                )
                self.assertEqual(result.returncode, 0, result.stdout)
                self.assertEqual(result.stdout, expected)

    def test_exact_centered_grid_sampling(self) -> None:
        coefficients = {
            -5: F(3, 7),
            -3: F(-5, 11),
            -1: F(7, 13),
            0: F(17, 19),
            2: F(-23, 29),
            4: F(31, 37),
        }
        for n, coefficient in coefficients.items():
            sample_over_sqrt_length = sum(
                (
                    F((-1) ** j) * value * F(int(j == n))
                    for j, value in coefficients.items()
                ),
                F(0),
            )
            self.assertEqual(
                sample_over_sqrt_length,
                F((-1) ** n) * coefficient,
            )

    def test_nearest_moving_indices_force_opposite_signs(self) -> None:
        required_hypothesis = (
            r"\lambda_k\longrightarrow\infty,"
            "\n"
            r" \qquad {N_k\over L_k}\longrightarrow\infty,"
        )

        def validate_scale_hypothesis(text: str) -> None:
            if required_hypothesis not in text:
                raise ValueError("moving-grid theorem requires unbounded scale")
            if r"\(L_k\to\infty\)" not in text:
                raise ValueError("missing derived unbounded grid scale")

        validate_scale_hypothesis(self.text)
        with self.assertRaises(ValueError):
            validate_scale_hypothesis(
                self.text.replace(
                    r"\lambda_k\longrightarrow\infty,",
                    "",
                    1,
                )
            )

        def target(value: float) -> float:
            return (14.0 - value) * math.exp(-value * value / 1000.0)

        for length in (100.0, 1000.0, 10000.0):
            indices = {
                x: math.floor(x * length / (2.0 * math.pi) + 0.5)
                for x in (13.0, 15.0)
            }
            samples = {}
            for x, n in indices.items():
                grid = 2.0 * math.pi * n / length
                self.assertLessEqual(abs(grid - x), math.pi / length)
                self.assertLessEqual(abs(n), abs(x) * length / (2.0 * math.pi) + 1)
                samples[x] = target(grid)
            self.assertGreater(samples[13.0], 0.0)
            self.assertLess(samples[15.0], 0.0)

    def test_opposite_sign_intervals_supply_linear_many_modes(self) -> None:
        delta = 0.1
        for length in (1000.0, 5000.0, 10000.0):
            counts = []
            for center in (13.0, 15.0):
                indices = [
                    n
                    for n in range(
                        math.floor((center - delta) * length / (2 * math.pi)) - 2,
                        math.ceil((center + delta) * length / (2 * math.pi)) + 3,
                    )
                    if center - delta
                    < 2.0 * math.pi * n / length
                    < center + delta
                ]
                counts.append(len(indices))
                self.assertGreaterEqual(
                    len(indices),
                    delta * length / math.pi - 2.0,
                )
                self.assertLessEqual(
                    max(abs(n) for n in indices),
                    (center + delta) * length / (2.0 * math.pi) + 1.0,
                )
            self.assertGreater(min(counts), 0)

    def test_cauchy_kernel_inertia_counts_weight_signs(self) -> None:
        poles = (F(1), F(2), F(3), F(4), F(5), F(6))
        nodes = (F(-1, 2), F(1, 2), F(3, 2), F(5, 2), F(7, 2), F(9, 2))
        weights = (F(2), F(3), F(-5), F(-7), F(11), F(-13))
        cauchy = tuple(
            tuple(F(1) / (pole - node) for pole in poles)
            for node in nodes
        )
        kernel = tuple(
            tuple(
                sum(
                    (
                        cauchy[i][j] * weights[j] * cauchy[k][j]
                        for j in range(len(poles))
                    ),
                    F(0),
                )
                for k in range(len(nodes))
            )
            for i in range(len(nodes))
        )
        self.assertEqual(matrix_inertia(kernel), (3, 3))

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 15)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_static_hygiene_mutations_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        protected = [self.note_bytes, test_bytes] + [
            (ROOT / relative).read_bytes() for relative in ARTIFACTS
        ]
        for raw in protected:
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("\\[\n\\[", self.text)

        producer_source = (
            ROOT / "artifacts/xi_real_sign_13_15/xi_real_sign_producer.c"
        ).read_text(encoding="ascii")
        verifier_source = (
            ROOT / "artifacts/xi_real_sign_13_15/xi_real_sign_verifier.c"
        ).read_text(encoding="ascii")
        self.assertIn("acb_dirichlet_zeta(zeta, s, prec)", producer_source)
        self.assertNotIn("acb_dirichlet_hardy_z", producer_source)
        self.assertIn("acb_dirichlet_hardy_z(z, t, NULL, NULL, 1, prec)", verifier_source)
        self.assertNotIn("acb_dirichlet_zeta(", verifier_source)
        self.assertIn("arb_is_positive(z15)", verifier_source)
        self.assertIn("arb_is_negative(xi15)", verifier_source)

        with self.assertRaises(ValueError):
            validate_producer(
                self.producer_output.replace(
                    b"CHECK Xi(15)<0=PASS",
                    b"CHECK Xi(15)<0=FAIL",
                )
            )
        with self.assertRaises(ValueError):
            validate_verifier(
                self.verifier_output.replace(
                    b"FORMULA Xi(t)=-positive_factor(t)*HardyZ(t)",
                    b"FORMULA Xi(t)=+positive_factor(t)*HardyZ(t)",
                )
            )

        normalized = " ".join(self.text.split())
        required = (
            "conditional target-incompatibility theorem",
            "at least one real zero",
            "no numerical zero isolation beyond that interval",
            "does not prove",
            "checkpoint-1.32 standard eight are unchanged",
            "No actual-arithmetic failure",
            "fixed-index Pontryagin",
            "Omega(L_k)",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        lowered = self.text.lower()
        forbidden = (
            "the actual global twisted cone is false",
            "the actual ground convergence is proved",
            "xi has exactly one zero",
            "the riemann hypothesis is proved",
            "standard eight are updated",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
