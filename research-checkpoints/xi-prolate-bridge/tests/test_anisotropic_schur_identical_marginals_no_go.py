from __future__ import annotations

import ast
from fractions import Fraction
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ANISOTROPIC_SCHUR_IDENTICAL_MARGINALS_NO_GO.md"

DEPENDENCIES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md":
        "39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3",
    "notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md":
        "cf847b2f73d18244158ee0238714f677c74358068a658c637a40477b3e0a38ca",
    "notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md":
        "d773afb7c38119d775f772ba91af02cf76372eaf3bfb89ccf461017fee2c8669",
}


def determinant_2x2(matrix: tuple[tuple[Fraction, Fraction], ...]) -> Fraction:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


class AnisotropicSchurIdenticalMarginalsNoGoTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.note = NOTE.read_text(encoding="utf-8")
        cls.flat_note = " ".join(cls.note.split())

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in DEPENDENCIES.items():
            with self.subTest(path=relative):
                payload = (ROOT / relative).read_bytes()
                self.assertEqual(hashlib.sha256(payload).hexdigest(), expected)

    def test_note_is_narrow_and_does_not_duplicate_central_band_result(self) -> None:
        required = (
            "do not determine the anisotropic Schur condition (7.8)",
            "already proved in Sections 2--4",
            "dependencies and context here, not new results",
            "cap-free excess sufficient route under its stated hypotheses",
            "does not promote it to a necessary condition for positivity",
            "does not say that the actual prolate--Weil source fails",
            "creates no source lock or numerical artifact",
            "changes no status or replay file",
            "The formal project state remains `P0_INVALIDATED`",
        )
        for statement in required:
            with self.subTest(statement=statement):
                self.assertIn(statement, self.flat_note)

    def test_negative_block_counterpair_is_positive_semidefinite(self) -> None:
        r0 = (
            (Fraction(3, 5), Fraction(0)),
            (Fraction(0), Fraction(3, 5)),
        )
        r1 = (
            (Fraction(3, 5), Fraction(3, 5)),
            (Fraction(3, 5), Fraction(3, 5)),
        )
        self.assertGreater(r0[0][0], 0)
        self.assertGreater(determinant_2x2(r0), 0)
        self.assertGreaterEqual(r1[0][0], 0)
        self.assertEqual(determinant_2x2(r1), 0)

    def test_identical_marginals_and_high_gate(self) -> None:
        g = Fraction(1)
        low0 = low1 = Fraction(3, 5)
        high0 = high1 = Fraction(3, 5)
        rho0 = high0
        rho1 = high1
        leverage0 = high0
        leverage1 = high1

        self.assertEqual((low0, high0, rho0, leverage0),
                         (low1, high1, rho1, leverage1))
        self.assertLess(leverage0, g)
        self.assertEqual(g - high0, Fraction(2, 5))

    def test_identical_marginals_have_opposite_anisotropic_schur_signs(self) -> None:
        g = Fraction(1)
        low = high = Fraction(3, 5)
        cross0 = Fraction(0)
        cross1 = Fraction(3, 5)
        high_floor = g - high
        schur0 = g - low - cross0**2 / high_floor
        schur1 = g - low - cross1**2 / high_floor

        self.assertEqual(schur0, Fraction(2, 5))
        self.assertEqual(schur1, Fraction(-1, 2))

    def test_full_matrices_confirm_pass_and_failure(self) -> None:
        b0 = (
            (Fraction(2, 5), Fraction(0)),
            (Fraction(0), Fraction(2, 5)),
        )
        b1 = (
            (Fraction(2, 5), Fraction(-3, 5)),
            (Fraction(-3, 5), Fraction(2, 5)),
        )
        self.assertEqual(determinant_2x2(b0), Fraction(4, 25))
        self.assertEqual(determinant_2x2(b1), Fraction(-1, 5))

    def test_scalar_sufficient_route_receives_the_same_inputs(self) -> None:
        rho = beta = Fraction(3, 5)
        eta = mu = Fraction(2, 5)
        self.assertEqual(rho * beta, Fraction(9, 25))
        self.assertEqual(eta * mu, Fraction(4, 25))
        self.assertFalse(rho * beta < eta * mu)
        self.assertIn("It rejects both, as a sufficient test may", self.note)

    def test_package_is_stdlib_only_clean_and_nonmutating(self) -> None:
        files = (NOTE, Path(__file__))
        for path in files:
            with self.subTest(path=path.name):
                payload = path.read_bytes()
                text = payload.decode("utf-8")
                self.assertNotIn(b"\x00", payload)
                self.assertNotIn(b"\r", payload)
                self.assertTrue(payload.endswith(b"\n"))
                self.assertTrue(
                    all(line.rstrip(" \t") == line for line in text.splitlines())
                )

        tree = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        imported_roots: set[str] = set()
        forbidden_calls: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported_roots.update(alias.name.split(".", 1)[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported_roots.add(node.module.split(".", 1)[0])
            elif isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
                if node.func.attr in {"write_text", "write_bytes", "unlink", "rename"}:
                    forbidden_calls.add(node.func.attr)
        self.assertLessEqual(
            imported_roots,
            {"__future__", "ast", "fractions", "hashlib", "pathlib", "unittest"},
        )
        self.assertEqual(forbidden_calls, set())


if __name__ == "__main__":
    unittest.main()
