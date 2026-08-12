#!/usr/bin/env python3
"""Regressions for the dangerous-response arithmetic Krein RH gate."""

from __future__ import annotations

import ast
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / (
    "LOWER_RITZ_DANGEROUS_RESPONSE_ARITHMETIC_KREIN_RH_GATE_THEOREM.md"
)
NOTE_HASH = "f0fd4065d6f1bafe8c119f5fcd3efe963e0da70cfe4871d3a26338f2016e2d1e"

FROZEN = {
    "notes/LOWER_RITZ_GROUND_RIDGE_FORCING_ADAPTED_DANGEROUS_RESPONSE_BARRIER.md":
        "acb5f56fb97e1ad54b95328beb555effa0e89b1569540915728b5b6959a2d122",
    "tests/test_lower_ritz_ground_ridge_forcing_adapted_dangerous_response_barrier.py":
        "b8f4f76a801bfc989086dd08d41c96006d05e7a9806635bd6a0df2bc05647049",
    "notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md":
        "0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3",
    "tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py":
        "8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b",
    "notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md":
        "eda566d5a2867d28f5218a89a48cc95c30fe74491fb11bb74b86c7fb6ed68ac6",
    "tests/test_pnt_discrepancy_normal_form.py":
        "9cf8bd06ee9e26ebdb3c56b878b1f3ba3ed54156a65f5110b7d353c017ba9c52",
    "notes/GROWING_ACTUAL_SYMBOL_BOUNDARY_GAUGE_PHASE_ANGLE_BARRIER.md":
        "de8a95d46fdaf393208124b7813637333c1e309e457473f893c3fd51b66138b1",
    "tests/test_growing_actual_symbol_boundary_gauge_phase_angle_barrier.py":
        "6307665100baacf47aeab2d2fa023287eb7f61efa52504095ba8b69f99bd5878",
    "notes/GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md":
        "0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9",
    "tests/test_growing_signed_discrepancy_centered_zero_krein_factorization_barrier.py":
        "b34f647f320e2e19b614ced03959d152895f6d91a864e4717e43accc7546f533",
    "DIRECT_RH_ATTACK.md":
        "b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def lower_two_ritz(q_value: float, forcing: np.ndarray, block: np.ndarray) -> float:
    direction = forcing / np.linalg.norm(forcing)
    moment = float(np.real(np.vdot(direction, block @ direction)))
    return float(
        np.linalg.eigvalsh(
            np.array([[q_value, np.linalg.norm(forcing)],
                      [np.linalg.norm(forcing), moment]])
        )[0]
    )


class DangerousResponseArithmeticKreinRhGateTests(unittest.TestCase):
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

    def test_ground_transform_and_discrepancy_resolvent_identity(self) -> None:
        # Q=cI+H in anchor/complement coordinates.  The scalar cannot enter b.
        c_star = -1.37
        h_operator = np.array(
            [
                [2.10, 0.17, -0.09, 0.06],
                [0.17, 4.20, 0.11, -0.07],
                [-0.09, 0.11, 5.10, 0.08],
                [0.06, -0.07, 0.08, 6.30],
            ],
            dtype=np.complex128,
        )
        q_matrix = c_star * np.eye(4) + h_operator
        q_value = float(np.real(q_matrix[0, 0]))
        forcing = q_matrix[1:, 0]
        complement = q_matrix[1:, 1:]
        ritz = lower_two_ritz(q_value, forcing, complement)
        self.assertGreater(float(np.linalg.eigvalsh(complement - ritz * np.eye(3))[0]), 0)

        ground = float(np.linalg.eigvalsh(q_matrix)[0])
        b_ground = complement - ground * np.eye(3)
        correction = np.linalg.solve(b_ground, forcing)
        coefficient_ground = np.concatenate(([1.0], -correction))
        np.testing.assert_allclose(
            q_matrix @ coefficient_ground,
            ground * coefficient_ground,
            atol=3e-14,
        )

        riesz = np.array([0.31 - 0.12j, -0.23 + 0.41j, 0.52, -0.37j])
        scale = 1.73
        anchor = scale * np.array([1.0, 0.0, 0.0, 0.0])
        source_ground = scale * coefficient_ground
        transform_defect = np.vdot(riesz, anchor - source_ground)
        response = np.vdot(riesz[1:], np.linalg.solve(b_ground, forcing))
        self.assertAlmostEqual(transform_defect, scale * response)

        # Exact weighted-discrepancy normal form after projection.
        np.testing.assert_allclose(forcing, h_operator[1:, 0], atol=2e-14)
        np.testing.assert_allclose(
            b_ground,
            (c_star - ground) * np.eye(3) + h_operator[1:, 1:],
            atol=2e-14,
        )

    def test_three_level_response_and_dangerous_mixed_minor(self) -> None:
        rng = np.random.default_rng(7719)
        raw = rng.normal(size=(7, 7))
        physical = raw.T @ raw + 3.0 * np.eye(7)
        forcing = rng.normal(size=7)
        observation = rng.normal(size=7)

        # Eliminate the last two far coordinates.
        far_pivot = physical[5:, 5:]
        far_cross = physical[5:, :5]
        far_lift = np.vstack((np.eye(5), -np.linalg.solve(far_pivot, far_cross)))
        short = far_lift.T @ physical @ far_lift
        returned_forcing = far_lift.T @ forcing
        returned_observation = far_lift.T @ observation
        far_response = observation[5:] @ np.linalg.solve(far_pivot, forcing[5:])

        # Eliminate one captured coordinate.
        captured_pivot = short[:1, :1]
        captured_cross = short[1:, :1]
        captured_lift = np.vstack(
            (-np.linalg.solve(captured_pivot, captured_cross.T), np.eye(4))
        )
        retained = captured_lift.T @ short @ captured_lift
        retained_forcing = captured_lift.T @ returned_forcing
        retained_observation = captured_lift.T @ returned_observation
        captured_response = (
            returned_observation[:1]
            @ np.linalg.solve(captured_pivot, returned_forcing[:1])
        )

        # Adjoin the exact returned forcing to one structural dangerous
        # direction.  The forcing-adapted safe row then vanishes.
        structural = np.array([1.0, 0.0, 0.0, 0.0])
        dangerous, _ = np.linalg.qr(
            np.column_stack((structural, retained_forcing))
        )
        dangerous = dangerous[:, :2]
        _, _, right = np.linalg.svd(dangerous.T, full_matrices=True)
        safe = right[2:, :].T
        basis = np.column_stack((dangerous, safe))
        blocked = basis.T @ retained @ basis
        forcing_coordinates = basis.T @ retained_forcing
        observation_coordinates = basis.T @ retained_observation
        np.testing.assert_allclose(forcing_coordinates[2:], 0.0, atol=2e-14)

        dangerous_block = blocked[:2, :2]
        coupling = blocked[2:, :2]
        safe_block = blocked[2:, 2:]
        schur = dangerous_block - coupling.T @ np.linalg.solve(
            safe_block, coupling
        )
        dangerous_forcing = forcing_coordinates[:2]
        dangerous_observation = (
            observation_coordinates[:2]
            - coupling.T @ np.linalg.solve(safe_block, observation_coordinates[2:])
        )
        dangerous_response = dangerous_observation @ np.linalg.solve(
            schur, dangerous_forcing
        )

        full_response = observation @ np.linalg.solve(physical, forcing)
        self.assertAlmostEqual(
            float(full_response),
            float(far_response + captured_response + dangerous_response),
            places=11,
        )

        adjugate = np.linalg.det(schur) * np.linalg.inv(schur)
        numerator = dangerous_observation @ adjugate @ dangerous_forcing
        mixed = np.block(
            [
                [np.zeros((1, 1)), dangerous_observation[np.newaxis, :]],
                [dangerous_forcing[:, np.newaxis], schur],
            ]
        )
        self.assertAlmostEqual(
            float(dangerous_response),
            float(numerator / np.linalg.det(schur)),
            places=12,
        )
        self.assertAlmostEqual(
            float(dangerous_response),
            float(-np.linalg.det(mixed) / np.linalg.det(schur)),
            places=12,
        )

    def test_boundary_gauge_polarization_and_returned_equation(self) -> None:
        rng = np.random.default_rng(9901)
        raw = rng.normal(size=(5, 5)) + 1j * rng.normal(size=(5, 5))
        multiplier = raw.conj().T @ raw + 2.0 * np.eye(5)
        pole = rng.normal(size=5) + 1j * rng.normal(size=5)
        even_q = multiplier + 2.0 * np.outer(pole, pole.conj())
        shift = 0.41
        v = rng.normal(size=5) + 1j * rng.normal(size=5)
        w = rng.normal(size=5) + 1j * rng.normal(size=5)

        left = np.vdot(v, (even_q - shift * np.eye(5)) @ w)
        right = (
            np.vdot(v, multiplier @ w)
            + 2.0 * np.vdot(v, pole) * np.vdot(pole, w)
            - shift * np.vdot(v, w)
        )
        self.assertAlmostEqual(left, right)

        # Anchor/complement equation is exactly the polarized gauge equation.
        q_value = float(np.real(even_q[0, 0]))
        forcing = even_q[1:, 0]
        complement = even_q[1:, 1:]
        ground = float(np.linalg.eigvalsh(even_q)[0])
        correction = np.linalg.solve(complement - ground * np.eye(4), forcing)
        test = rng.normal(size=4) + 1j * rng.normal(size=4)
        embedded_test = np.concatenate(([0.0], test))
        embedded_correction = np.concatenate(([0.0], correction))
        anchor = np.array([1.0, 0.0, 0.0, 0.0, 0.0])
        left_equation = np.vdot(
            embedded_test,
            (even_q - ground * np.eye(5)) @ embedded_correction,
        )
        right_equation = np.vdot(embedded_test, even_q @ anchor)
        self.assertAlmostEqual(left_equation, right_equation)
        self.assertGreater(q_value, ground)

    def test_centered_krein_interpolation_algebra(self) -> None:
        rng = np.random.default_rng(431)
        features = rng.normal(size=(6, 5)) + 1j * rng.normal(size=(6, 5))
        krein = np.diag([1.0, -1.0, 1.0, -1.0, 1.0, 1.0])
        q_form = features.conj().T @ krein @ features + 7.0 * np.eye(5)
        q_form = (q_form + q_form.conj().T) / 2.0
        ground = float(np.linalg.eigvalsh(q_form)[0])
        forcing = q_form[1:, 0]
        complement = q_form[1:, 1:]
        correction = np.linalg.solve(complement - ground * np.eye(4), forcing)
        coefficient_ground = np.concatenate(([1.0], -correction))

        test = rng.normal(size=5) + 1j * rng.normal(size=5)
        # Q is a finite Krein feature form; the interpolation equation is
        # simply the exact ground equation in those signed coordinates.
        feature_left = np.vdot(features @ test, krein @ (features @ coefficient_ground))
        scalar_left = 7.0 * np.vdot(test, coefficient_ground)
        self.assertAlmostEqual(
            feature_left + scalar_left,
            ground * np.vdot(test, coefficient_ground),
        )

        complement_test = np.concatenate(
            ([0.0], rng.normal(size=4) + 1j * rng.normal(size=4))
        )
        correction_embedded = np.concatenate(([0.0], correction))
        self.assertAlmostEqual(
            np.vdot(complement_test, q_form @ correction_embedded)
            - ground * np.vdot(complement_test, correction_embedded),
            np.vdot(complement_test, q_form @ np.array([1, 0, 0, 0, 0])),
        )

    def test_strict_sign_normal_forms_are_identical_infima(self) -> None:
        rng = np.random.default_rng(819)
        tail_even = np.diag([1.4, 2.0, 2.7])
        discrepancy_even = np.array(
            [[0.2, 0.03, -0.01], [0.03, 0.4, 0.02], [-0.01, 0.02, 0.5]]
        )
        tail_odd = np.diag([1.2, 1.8])
        discrepancy_odd = np.array([[0.1, -0.02], [-0.02, 0.3]])
        c_star = -0.25
        ritz = 0.17
        b_even = (c_star - ritz) * np.eye(3) + tail_even - discrepancy_even
        b_odd = (c_star - ritz) * np.eye(2) + tail_odd - discrepancy_odd
        beta_even = float(np.linalg.eigvalsh(b_even)[0])
        beta_odd = float(np.linalg.eigvalsh(b_odd)[0])
        self.assertGreater(beta_even, 0.0)
        self.assertGreater(beta_odd, 0.0)

        # A unitary change of coordinates models the boundary-gauge and
        # centered-zero feature languages without changing either infimum.
        unitary_even, _ = np.linalg.qr(
            rng.normal(size=(3, 3)) + 1j * rng.normal(size=(3, 3))
        )
        unitary_odd, _ = np.linalg.qr(
            rng.normal(size=(2, 2)) + 1j * rng.normal(size=(2, 2))
        )
        gauge_even = unitary_even.conj().T @ b_even @ unitary_even
        krein_odd = unitary_odd.conj().T @ b_odd @ unitary_odd
        self.assertAlmostEqual(float(np.linalg.eigvalsh(gauge_even)[0]), beta_even)
        self.assertAlmostEqual(float(np.linalg.eigvalsh(krein_odd)[0]), beta_odd)

    def test_scope_and_required_formulas(self) -> None:
        required = (
            r"\widehat p_{\lambda,N}(z)-\widehat f_{\lambda,N}(z)",
            r"\mathfrak R_\lambda(z)",
            r"A_{\rm tail}-T_D",
            r"P_KH_\lambda\kappa",
            r"\operatorname {adj}(B_\mu)",
            r"r_\lambda(\tau)=m_\lambda(\tau)+4\lambda\cos(L\tau)",
            r"\overline{A_v(\overline\zeta_{\mathfrak p})}",
            r"\beta_{+,u}>0",
            r"\beta_{-,u}>0",
            r"\dim\mathcal D_{\rho,h}",
            r"\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h",
            r"\neg RH\ \Longrightarrow",
            "RH-strength signed-arithmetic gate",
            "does not prove (0.4), (0.10)",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)
        self.assertIn("It proves no converse", self.text)
        self.assertNotIn("This theorem proves RH", self.text)

    def test_displayed_tex_and_static_hygiene(self) -> None:
        self.assertNotIn("\t", self.text)
        self.assertTrue(all(ord(character) < 128 for character in self.text))
        self.assertFalse(
            any(line.endswith((" ", "\t")) for line in self.text.splitlines())
        )
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for display in displays:
            self.assertNotIn("$", display)
            self.assertEqual(display.count("{"), display.count("}"))
            self.assertEqual(display.count(r"\begin"), display.count(r"\end"))

        source = Path(__file__).read_text(encoding="ascii")
        ast.parse(source)
        self.assertNotIn("\r", source)
        self.assertFalse(any(line.endswith((" ", "\t")) for line in source.splitlines()))

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
        with tempfile.TemporaryDirectory() as temporary:
            tex = Path(temporary) / "note.tex"
            tex.write_text(document, encoding="ascii")
            completed = subprocess.run(
                [pdflatex, "-halt-on-error", "-interaction=nonstopmode", tex.name],
                cwd=temporary,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                check=False,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout)


if __name__ == "__main__":
    unittest.main()
