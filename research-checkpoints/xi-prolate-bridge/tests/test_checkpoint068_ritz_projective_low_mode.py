from __future__ import annotations

import ast
from copy import deepcopy
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

import checkpoint068_ritz_projective_low_mode as producer  # noqa: E402
import checkpoint068_ritz_projective_low_mode_replay as verifier  # noqa: E402


VERIFIER_PATH = ROOT / "verifier" / "checkpoint068_ritz_projective_low_mode_replay.py"
ARTIFACTS = ROOT / "artifacts" / "checkpoint068_ritz_projective_low_mode"
ARTIFACT_NAMES = (
    "lambda2_N4_M2_theta1_dps40_producer.json",
    "lambda2_N4_M2_theta1_dps80_producer.json",
    "lambda2_N4_M2_theta1_dps40_replay.json",
    "lambda2_N4_M2_theta1_dps80_replay.json",
)


def _mp(value: object) -> mp.mpf:
    return mp.mpf(value)  # type: ignore[arg-type]


def _matrix(values: list[list[object]]) -> mp.matrix:
    return mp.matrix([[_mp(value) for value in row] for row in values])


def _vector(values: list[object]) -> mp.matrix:
    return mp.matrix([_mp(value) for value in values])


def _norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(vector[index]) ** 2 for index in range(vector.rows)))


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    if matrix.rows == 0 or matrix.cols == 0:
        return mp.mpf(0)
    return max(
        abs(matrix[row, column])
        for row in range(matrix.rows)
        for column in range(matrix.cols)
    )


def _trace(matrix: mp.matrix) -> mp.mpf:
    return mp.fsum(matrix[index, index] for index in range(matrix.rows))


def _inverse(matrix: mp.matrix) -> mp.matrix:
    inverse = mp.matrix(matrix.rows)
    for column in range(matrix.cols):
        unit = mp.matrix(matrix.rows, 1)
        unit[column] = 1
        inverse[:, column] = mp.lu_solve(matrix, unit)
    return inverse


def _relative_defect(left: object, right: object) -> mp.mpf:
    lhs = _mp(left)
    rhs = _mp(right)
    return abs(lhs - rhs) / max(mp.mpf(1), abs(lhs), abs(rhs))


def _at(payload: dict[str, object], path: str) -> object:
    value: object = payload
    for component in path.split("."):
        if not isinstance(value, dict):
            raise AssertionError(f"non-object before {component} in {path}")
        value = value[component]
    return value


def _rehash(payload: dict[str, object], section: str) -> None:
    hashes = payload["section_sha256"]
    if not isinstance(hashes, dict):
        raise AssertionError("section hash inventory is not an object")
    hashes[section] = verifier._raw_hash(payload[section])


class Checkpoint068RitzProjectiveLowModeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        # Both calls rebuild checkpoint 0.64 live.  No checkpoint-0.68 matrix,
        # eigensystem, artifact, or zero table is read.
        cls.fresh40 = producer.produce("2", 4, 2, "1", 40)
        cls.fresh80 = producer.produce("2", 4, 2, "1", 80)
        cls.raw40 = (
            json.dumps(cls.fresh40, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")
        cls.raw80 = (
            json.dumps(cls.fresh80, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")

    def setUp(self) -> None:
        # Producer calls restore no ambient work precision.  Every test that
        # parses the 80-digit strings therefore establishes its own context.
        mp.mp.dps = 110

    def test_exact_inputs_strict_json_and_fail_closed_cutoffs(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce(2.0, 4, 2, "1", 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce("2", 4, 2, 1.0, 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 4.0, 2, "1", 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 4, True, "1", 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 4, 2, "1", True)  # type: ignore[arg-type]
        with self.assertRaisesRegex(producer.Checkpoint068Error, "rational text"):
            producer.produce("2.0.0", 4, 2, "1", 40)
        for M in (0, 4, 5):
            with self.subTest(M=M), self.assertRaises(producer.Checkpoint068Error):
                producer.produce("2", 4, M, "1", 40)
        with self.assertRaisesRegex(producer.Checkpoint068Error, "locked"):
            producer.produce("2", 4, 2, "0", 40)
        with self.assertRaisesRegex(producer.Checkpoint068Error, "40 or 80"):
            producer.produce("2", 4, 2, "1", 60)

        verifier.strict_json_loads(self.raw40)
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier.strict_json_loads('{"lambda":2.0}')
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier.strict_json_loads('{"x":"1","x":"2"}')
        with self.assertRaisesRegex(verifier.ReplayError, "invalid"):
            verifier.strict_json_loads(b"\xff")
        with self.assertRaisesRegex(verifier.ReplayError, "root"):
            verifier.strict_json_loads("[]")
        for token in ("nan", "+inf", "-inf"):
            with self.subTest(token=token), self.assertRaises(verifier.ReplayError):
                verifier.strict_json_loads(json.dumps({"x": token}))
        with self.assertRaisesRegex(verifier.ReplayError, "cached producer boolean"):
            verifier.strict_json_loads('{"section":{"passed":true}}')

    def test_contract_dependencies_sections_and_claim_boundary(self) -> None:
        payload = self.fresh80
        self.assertEqual(set(payload), verifier.TOP_LEVEL_KEYS)
        self.assertEqual(producer.DEPENDENCIES, verifier.DEPENDENCIES)
        self.assertEqual(producer.LOCKED_CONVENTIONS, verifier.LOCKED_CONVENTIONS)
        self.assertEqual(producer.LOCKED_FORMULAS, verifier.LOCKED_FORMULAS)
        self.assertEqual(payload["schema"], producer.SCHEMA)
        self.assertEqual(payload["checkpoint_version"], producer.CHECKPOINT_VERSION)
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(payload["claim_class"], "FINITE_POINT_DIAGNOSTIC")
        self.assertIs(payload["analytic_uniform_claim"], False)
        self.assertIs(payload["equation_5_2_claim"], False)
        self.assertIs(payload["rh_proof_claim"], False)
        self.assertEqual(
            set(payload["section_sha256"]), set(verifier.SECTION_NAMES)
        )
        self.assertEqual(
            {name for name in verifier.SECTION_NAMES},
            {
                "source_guard",
                "normalization_regression",
                "ritz_ground_geometry",
                "low_mode_observation",
                "full_source_factorization",
                "compact_bridge_diagnostic",
            },
        )

        dependencies = payload["dependency_sha256"]
        self.assertEqual(set(dependencies), set(producer.DEPENDENCIES))
        for relative_path, expected in dependencies.items():
            with self.subTest(dependency=relative_path):
                actual = hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()
                self.assertEqual(actual, expected)
        for section in verifier.SECTION_NAMES:
            with self.subTest(section=section):
                self.assertEqual(
                    payload["section_sha256"][section],
                    producer._raw_hash(payload[section]),
                )
        verifier._validate_contract(verifier.strict_json_loads(self.raw80))

        for key in (
            "cached_matrix_read",
            "cached_eigensystem_read",
            "cached_artifact_read",
            "zeta_zero_table_read",
            "global_weil_positivity_assumed",
            "binary64_parameter_used",
            "asymptotic_claim_made",
            "locally_uniform_claim_made",
            "equation_5_2_claim_made",
            "rh_proof_claim_made",
        ):
            self.assertIs(payload["provenance"][key], False, key)
        self.assertTrue(
            any("not an asymptotic" in item for item in payload["limitations"])
        )
        self.assertTrue(
            any("no locally uniform" in item for item in payload["limitations"])
        )

    def test_source_blocks_prime_endpoint_fourier_sign_and_normalization(self) -> None:
        payload = self.fresh80
        guard = payload["source_guard"]
        self.assertEqual(guard["prime_power_inventory"], [2, 3, 4])
        self.assertEqual(guard["expected_prime_power_inventory"], [2, 3, 4])
        self.assertIs(guard["prime_endpoint_lambda_squared_included"], True)
        self.assertEqual(guard["source_prime_block_sign"], "minus")
        self.assertIn(
            "exp(-i*t*x)", payload["locked_conventions"]["fourier_transform"]
        )
        self.assertIn(
            "equation (3.19)",
            payload["locked_conventions"]["prime_block_sign"],
        )

        pole = _matrix(guard["pole_block"])
        arch = _matrix(guard["archimedean_unsigned_block"])
        prime = _matrix(guard["prime_unsigned_block"])
        Q = _matrix(guard["full_Q_pole_minus_archimedean_minus_prime"])
        self.assertLess(_max_abs(Q - (pole - arch - prime)), mp.mpf("1e-70"))
        self.assertLess(_mp(guard["full_Q_reconstruction_defect"]), mp.mpf("1e-70"))
        self.assertLess(_max_abs(Q - Q.T), mp.mpf("1e-70"))
        J = _matrix(guard["inversion_J"])
        self.assertLess(_max_abs(Q * J - J * Q), mp.mpf("1e-70"))
        for key in (
            "cached_matrix_read",
            "cached_eigensystem_read",
            "cached_artifact_read",
            "zeta_zero_table_read",
            "global_weil_positivity_assumed",
            "binary64_parameter_used",
        ):
            self.assertIs(guard[key], False, key)

        normalization = payload["normalization_regression"]
        self.assertIs(normalization["unit_normalized_replacement_allowed"], False)
        source_scalar = _mp(normalization["source_limiting_Xi_transform_scalar"])
        unit_scalar = _mp(
            normalization["unit_normalized_limiting_Xi_transform_scalar"]
        )
        scalar_difference = _mp(
            normalization["unit_normalization_limiting_scalar_difference"]
        )
        self.assertNotEqual(source_scalar, unit_scalar)
        self.assertNotEqual(scalar_difference, 0)
        self.assertLess(
            abs(scalar_difference - (unit_scalar - source_scalar)),
            mp.mpf("1e-70"),
        )

    def test_ritz_shifted_signs_true_ground_and_projective_identity(self) -> None:
        payload = self.fresh80
        guard = payload["source_guard"]
        geometry = payload["ritz_ground_geometry"]
        Q_even = _matrix(guard["Q_even"])
        kappa = _vector(guard["kappa_even_coordinates"])
        W = _matrix(guard["anchor_complement_W"])
        q = _mp(geometry["q"])
        b = _vector(geometry["residual_vector_b"])
        residual_r = _mp(geometry["residual_r"])
        w = _vector(geometry["residual_direction_w"])
        B_q = _matrix(geometry["B_q"])
        c_R = _mp(geometry["c_R_two_vector_lower_right_entry"])
        U = _mp(geometry["two_vector_ritz_U_equals_u"])
        d = _mp(geometry["d_q_minus_U"])
        B_U = _matrix(geometry["B_U"])

        self.assertLess(_norm(b - W.T * (Q_even * kappa - q * kappa)), mp.mpf("1e-70"))
        self.assertLess(abs(_norm(b) - residual_r), mp.mpf("1e-70"))
        self.assertLess(abs(_norm(w) - 1), mp.mpf("1e-70"))
        expected_c_R = q + (w.T * B_q * w)[0]
        expected_U = (
            q + expected_c_R
            - mp.sqrt((expected_c_R - q) ** 2 + 4 * residual_r**2)
        ) / 2
        self.assertLess(abs(c_R - expected_c_R), mp.mpf("1e-70"))
        self.assertLess(abs(U - expected_U), mp.mpf("1e-70"))
        self.assertLess(abs(d - (q - U)), mp.mpf("1e-70"))
        moment = (w.T * B_U * w)[0]
        self.assertLess(abs(d * moment - residual_r**2), mp.mpf("1e-70"))
        self.assertLess(abs(_mp(geometry["ritz_moment_residual"])), mp.mpf("1e-70"))
        self.assertTrue(all(_mp(value) > 0 for value in geometry["B_U_eigenvalues"]))
        self.assertTrue(
            all(_mp(value) > 0 for value in geometry["odd_shifted_eigenvalues_at_U"])
        )

        mu = _mp(geometry["true_even_ground_mu"])
        h = _mp(geometry["u_minus_mu_h"])
        z = _vector(geometry["ground_correction_z"])
        gamma = _mp(geometry["gamma_unit_ground_coefficient"])
        projective_scalar = _mp(
            geometry["projective_scalar_s_equals_one_over_gamma"]
        )
        coefficient_ground = kappa - W * z
        unit_ground = gamma * coefficient_ground
        stored_unit_ground = _vector(geometry["unit_ground_even"])
        self.assertGreaterEqual(h, 0)
        self.assertLessEqual(h, residual_r)
        self.assertLess(
            _norm((B_U + h * mp.eye(B_U.rows)) * z - b), mp.mpf("1e-70")
        )
        self.assertLess(_norm(unit_ground - stored_unit_ground), mp.mpf("1e-70"))
        self.assertLess(abs(gamma - 1 / mp.sqrt(1 + (z.T * z)[0])), mp.mpf("1e-70"))
        self.assertLess(
            _norm(projective_scalar * unit_ground - kappa + W * z),
            mp.mpf("1e-70"),
        )
        self.assertLess(_norm(Q_even * unit_ground - mu * unit_ground), mp.mpf("1e-69"))
        even_values = [_mp(value) for value in geometry["complete_even_eigenvalues"]]
        self.assertGreater(even_values[1] - even_values[0], 0)
        self.assertGreaterEqual(
            _mp(geometry["C_R_squared_minus_z_norm_squared"]), 0
        )

    def test_full_cutoff_parity_contractions_and_squared_response_gate(self) -> None:
        payload = self.fresh80
        guard = payload["source_guard"]
        geometry = payload["ritz_ground_geometry"]
        low = payload["low_mode_observation"]
        N = payload["inputs"]["N"]
        M = low["M"]
        Pi = _matrix(low["full_ambient_Pi_M"])
        expected = mp.diag(
            [mp.mpf(1) if abs(index) <= M else mp.mpf(0) for index in range(-N, N + 1)]
        )
        self.assertLess(_max_abs(Pi - expected), mp.mpf("1e-70"))
        self.assertLess(_max_abs(Pi * Pi - Pi), mp.mpf("1e-70"))
        mode = _matrix(guard["integer_mode_operator"])
        J = _matrix(guard["inversion_J"])
        self.assertLess(_max_abs(mode * Pi - Pi * mode), mp.mpf("1e-70"))
        self.assertLess(_max_abs(J * Pi - Pi * J), mp.mpf("1e-70"))

        even = _matrix(guard["natural_even_basis"])
        odd = _matrix(guard["natural_odd_basis"])
        Pi_even = _matrix(low["Pi_M_even"])
        Pi_odd = _matrix(low["Pi_M_odd"])
        self.assertLess(_max_abs(Pi_even - even.T * Pi * even), mp.mpf("1e-70"))
        self.assertLess(_max_abs(Pi_odd - odd.T * Pi * odd), mp.mpf("1e-70"))
        self.assertGreater(_trace(Pi_odd), 0)

        W = _matrix(guard["anchor_complement_W"])
        K = _matrix(low["K_M_WT_Pi_even_W"])
        self.assertLess(_max_abs(K - W.T * Pi_even * W), mp.mpf("1e-70"))
        for value in low["K_M_eigenvalues"]:
            self.assertGreaterEqual(_mp(value), -mp.mpf("1e-70"))
            self.assertLessEqual(_mp(value), 1 + mp.mpf("1e-70"))
        for value in low["X_r_D_inverse_half_K_D_inverse_half_eigenvalues"]:
            self.assertGreaterEqual(_mp(value), -mp.mpf("1e-70"))
            self.assertLessEqual(_mp(value), 1 + mp.mpf("1e-70"))

        z = _vector(geometry["ground_correction_z"])
        low_vector = Pi_even * W * z
        low_squared = (low_vector.T * low_vector)[0]
        zKz = (z.T * K * z)[0]
        self.assertLess(abs(low_squared - zKz), mp.mpf("1e-70"))
        self.assertLess(
            abs(low_squared - _mp(low["actual_low_squared_norm"])),
            mp.mpf("1e-70"),
        )
        self.assertLess(abs(_mp(low["low_squared_identity_residual"])), mp.mpf("1e-70"))

        theta = _mp(low["theta"])
        H = _mp(low["soft_trace_H"])
        F = _mp(low["log_increment_F"])
        A_R = _mp(geometry["A_R"])
        self.assertGreater(H, 0)
        self.assertGreater(F, 0)
        self.assertLessEqual(F / theta, H)
        self.assertLessEqual(H, F / mp.log1p(theta))
        self.assertLessEqual(low_squared, A_R * H)
        self.assertLessEqual(low_squared, A_R * F / mp.log1p(theta))
        self.assertGreaterEqual(_mp(low["Ritz_Loewner_minimum_eigenvalue"]), -mp.mpf("1e-69"))
        self.assertLess(abs(_mp(low["low_high_pythagoras_residual"])), mp.mpf("1e-70"))

    def test_full_source_factorization_at_both_endpoints_and_response(self) -> None:
        payload = self.fresh80
        guard = payload["source_guard"]
        geometry = payload["ritz_ground_geometry"]
        low = payload["low_mode_observation"]
        factor = payload["full_source_factorization"]
        self.assertIs(factor["full_ambient_homotopy_required"], True)
        self.assertIs(factor["compressed_only_homotopy_allowed"], False)
        for field in (
            "mode_Pi_commutator_defect",
            "J_Pi_commutator_defect",
            "source_displacement_preservation_defect",
        ):
            self.assertLess(abs(_mp(factor[field])), mp.mpf("1e-70"), field)

        Q_even = _matrix(guard["Q_even"])
        Q_odd = _matrix(guard["Q_odd"])
        kappa = _vector(guard["kappa_even_coordinates"])
        W = _matrix(guard["anchor_complement_W"])
        Pi_even = _matrix(low["Pi_M_even"])
        Pi_odd = _matrix(low["Pi_M_odd"])
        K = _matrix(low["K_M_WT_Pi_even_W"])
        b = _vector(geometry["residual_vector_b"])
        B_U = _matrix(geometry["B_U"])
        d = _mp(geometry["d_q_minus_U"])
        residual_r = _mp(geometry["residual_r"])
        zeta = _mp(factor["zeta_U_minus_r"])
        eta_even = _vector(factor["eta_even_boundary_vector"])
        e0_even = _vector(factor["e0_even"])
        endpoints = (factor["t_zero"], factor["t_theta_r"])
        reconstructed_cross: list[mp.matrix] = []
        reconstructed_anchor: list[mp.mpf] = []

        for endpoint in endpoints:
            label = endpoint["label"]
            with self.subTest(endpoint=label):
                t = _mp(endpoint["t"])
                A_t = Q_even - zeta * mp.eye(Q_even.rows) + t * Pi_even
                O_t = Q_odd - zeta * mp.eye(Q_odd.rows) + t * Pi_odd
                D_t = B_U + residual_r * mp.eye(B_U.rows) + t * K
                b_t = b + t * W.T * Pi_even * kappa
                a_t = d + residual_r + t * (kappa.T * Pi_even * kappa)[0]
                sigma_t = a_t - (b_t.T * _inverse(D_t) * b_t)[0]
                m_t = (eta_even.T * _inverse(A_t) * e0_even)[0]
                reconstructed_cross.append(b_t)
                reconstructed_anchor.append(a_t)
                self.assertLess(_max_abs(A_t - _matrix(endpoint["A_t_even"])), mp.mpf("1e-69"))
                self.assertLess(_max_abs(O_t - _matrix(endpoint["O_t_odd"])), mp.mpf("1e-69"))
                self.assertLess(_max_abs(D_t - _matrix(endpoint["D_t_complement"])), mp.mpf("1e-69"))
                self.assertLess(_norm(b_t - _vector(endpoint["b_t_cross"])), mp.mpf("1e-69"))
                self.assertLess(abs(a_t - _mp(endpoint["a_t_anchor"])), mp.mpf("1e-69"))
                self.assertLess(abs(sigma_t - _mp(endpoint["sigma_t"])), mp.mpf("1e-68"))
                self.assertLess(abs(m_t - _mp(endpoint["m_t"])), mp.mpf("1e-68"))

                det_A = mp.det(A_t)
                det_O = mp.det(O_t)
                det_D = mp.det(D_t)
                self.assertGreater(min(det_A, det_O, det_D, sigma_t, m_t), 0)
                scale = max(mp.mpf(1), abs(det_A), abs(det_O), abs(det_D))
                self.assertLess(abs(det_A - det_D * sigma_t), mp.mpf("1e-68") * scale)
                self.assertLess(abs(det_O - det_A * m_t), mp.mpf("1e-68") * scale)
                self.assertLess(abs(det_O - det_D * sigma_t * m_t), mp.mpf("1e-68") * scale)
                for field in (
                    "anchor_scalar_residual",
                    "cross_vector_residual_norm",
                    "anchor_matrix_reconstruction_defect",
                    "det_A_minus_det_D_sigma",
                    "det_O_minus_det_A_m",
                    "det_O_minus_det_D_sigma_m",
                ):
                    self.assertLess(abs(_mp(endpoint[field])), mp.mpf("1e-67") * scale, field)

        # The full homotopy has genuine anchor, cross, and odd-sector changes;
        # none may be silently replaced by the complement compression alone.
        self.assertGreater(_norm(reconstructed_cross[1] - reconstructed_cross[0]), mp.mpf("1e-20"))
        self.assertGreater(abs(reconstructed_anchor[1] - reconstructed_anchor[0]), mp.mpf("1e-20"))
        self.assertGreater(
            _max_abs(_matrix(endpoints[1]["O_t_odd"]) - _matrix(endpoints[0]["O_t_odd"])),
            mp.mpf("1e-20"),
        )

        first, second = endpoints
        factorized_F = (
            mp.log(_mp(second["det_O_t"]))
            - mp.log(_mp(first["det_O_t"]))
            - mp.log(_mp(second["sigma_t"]) * _mp(second["m_t"]))
            + mp.log(_mp(first["sigma_t"]) * _mp(first["m_t"]))
        )
        direct_F = _mp(factor["F_direct_complement_logdet_increment"])
        self.assertLess(abs(direct_F - _mp(low["log_increment_F"])), mp.mpf("1e-70"))
        self.assertLess(abs(direct_F - factorized_F), mp.mpf("1e-68"))
        self.assertLess(
            abs(direct_F - _mp(factor["F_from_full_source_odd_boundary_anchor_factors"])),
            mp.mpf("1e-68"),
        )
        self.assertLess(abs(_mp(factor["full_source_factorization_residual"])), mp.mpf("1e-68"))

    def test_compact_three_term_formulas_and_no_asymptotic_promotion(self) -> None:
        payload = self.fresh80
        geometry = payload["ritz_ground_geometry"]
        low = payload["low_mode_observation"]
        compact = payload["compact_bridge_diagnostic"]
        lam = Fraction(payload["inputs"]["lambda"])
        lambda_mpf = mp.mpf(lam.numerator) / lam.denominator
        L = _mp(payload["inputs"]["L"])
        eta = Fraction(payload["inputs"]["compact_strip_eta"])
        eta_mpf = mp.mpf(eta.numerator) / eta.denominator
        lambda_eta = lambda_mpf**eta_mpf
        a = _mp(compact["projected_state_norm_a"])
        e = _mp(compact["projection_error_e"])
        M = payload["inputs"]["M"]
        actual_low = mp.sqrt(_mp(low["actual_low_squared_norm"]))
        actual_high = _mp(low["actual_high_norm"])
        A_R = _mp(geometry["A_R"])
        C_R = _mp(geometry["C_R"])
        F = _mp(low["log_increment_F"])
        theta = _mp(low["theta"])

        term_1 = 4 * mp.sqrt(L) * lambda_eta * e
        term_2 = 4 * a * mp.sqrt(L) * lambda_eta * actual_low
        term_3 = 8 * mp.sqrt(2) / mp.pi * a * lambda_eta * mp.sqrt(L / M) * actual_high
        upper_2 = 4 * a * mp.sqrt(L) * lambda_eta * mp.sqrt(A_R * F / mp.log1p(theta))
        upper_3 = 8 * mp.sqrt(2) / mp.pi * a * lambda_eta * mp.sqrt(L / M) * C_R
        comparisons = {
            "term_1_projection_4_sqrtL_lambdaeta_e": term_1,
            "term_2_low_4a_sqrtL_lambdaeta_low_norm": term_2,
            "term_3_high_8sqrt2_over_pi_a_lambdaeta_sqrtL_over_M_high_norm": term_3,
            "theorem_term_2_Ritz_logdet_upper_bound": upper_2,
            "theorem_term_3_C_R_upper_bound": upper_3,
        }
        for field, expected in comparisons.items():
            with self.subTest(field=field):
                self.assertLess(abs(_mp(compact[field]) - expected), mp.mpf("1e-68"))
        self.assertLess(
            abs(_mp(compact["sum_of_three_exact_projective_split_terms"]) - (term_1 + term_2 + term_3)),
            mp.mpf("1e-68"),
        )
        self.assertLess(
            abs(_mp(compact["sum_of_three_theorem_terms"]) - (term_1 + upper_2 + upper_3)),
            mp.mpf("1e-68"),
        )
        expected_low_rate = a**2 * L * lambda_mpf ** (2 * eta_mpf) * A_R * F / mp.log1p(theta)
        self.assertLess(
            abs(_mp(compact["low_mode_rate_scalar_a2_L_lambda2eta_A_R_F_over_log1p_theta"]) - expected_low_rate),
            mp.mpf("1e-68"),
        )
        self.assertGreater(_mp(compact["cutoff_condition_slack"]), 0)
        self.assertIs(compact["finite_diagnostic_only"], True)
        self.assertIs(compact["asymptotic_pass_claim"], False)
        self.assertIs(compact["locally_uniform_claim"], False)

    def test_doubled_precision_selected_values_are_stable(self) -> None:
        paths = (
            "ritz_ground_geometry.q",
            "ritz_ground_geometry.residual_r",
            "ritz_ground_geometry.two_vector_ritz_U_equals_u",
            "ritz_ground_geometry.d_q_minus_U",
            "ritz_ground_geometry.A_R",
            "ritz_ground_geometry.C_R_squared",
            "ritz_ground_geometry.true_even_ground_mu",
            "ritz_ground_geometry.u_minus_mu_h",
            "ritz_ground_geometry.z_norm_squared",
            "low_mode_observation.actual_low_squared_norm",
            "low_mode_observation.soft_trace_H",
            "low_mode_observation.log_increment_F",
            "full_source_factorization.F_from_full_source_odd_boundary_anchor_factors",
            "compact_bridge_diagnostic.sum_of_three_exact_projective_split_terms",
            "compact_bridge_diagnostic.sum_of_three_theorem_terms",
        )
        for path in paths:
            with self.subTest(path=path):
                self.assertLess(
                    _relative_defect(_at(self.fresh40, path), _at(self.fresh80, path)),
                    mp.mpf("1e-30"),
                )
        for section in verifier.SECTION_NAMES:
            self.assertEqual(set(self.fresh40[section]), set(self.fresh80[section]))

    def test_adversarial_source_normalization_dependency_and_hash_tamper(self) -> None:
        payload = verifier.strict_json_loads(self.raw40)

        changed = deepcopy(payload)
        changed["source_guard"]["prime_power_inventory"] = [2, 3]
        changed["source_guard"]["expected_prime_power_inventory"] = [2, 3]
        _rehash(changed, "source_guard")
        with self.assertRaisesRegex(verifier.ReplayError, "prime-power"):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["source_guard"]["source_prime_block_sign"] = "plus"
        _rehash(changed, "source_guard")
        with self.assertRaisesRegex(verifier.ReplayError, "prime-block sign"):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["locked_conventions"]["fourier_transform"] = (
            "hat(f)(t)=integral f(x)*exp(+i*t*x) dx"
        )
        with self.assertRaisesRegex(verifier.ReplayError, "convention"):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["normalization_regression"]["unit_normalized_replacement_allowed"] = True
        _rehash(changed, "normalization_regression")
        with self.assertRaisesRegex(verifier.ReplayError, "unit-normalized"):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["dependency_sha256"]["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(verifier.ReplayError, "dependency hash"):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["ritz_ground_geometry"]["q"] = "0"
        with self.assertRaisesRegex(verifier.ReplayError, "section hash"):
            verifier._validate_contract(changed)

        changed_pins = dict(producer.PINNED_SOURCE_SHA256)
        changed_pins["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(producer.Checkpoint068Error, "pinned source"):
            producer.validate_pinned_source_hashes(changed_pins)

    def test_adversarial_full_homotopy_odd_cross_and_sector_sign_tamper(self) -> None:
        payload = verifier.strict_json_loads(self.raw40)

        changed = deepcopy(payload)
        changed["full_source_factorization"]["full_ambient_homotopy_required"] = False
        changed["full_source_factorization"]["compressed_only_homotopy_allowed"] = True
        _rehash(changed, "full_source_factorization")
        with self.assertRaisesRegex(verifier.ReplayError, "ambient homotopy"):
            verifier._validate_contract(changed)

        # Coordinated section-hash repair cannot legitimize dropping the odd
        # part of t*Pi_M from the theta*r endpoint.
        changed = deepcopy(payload)
        changed["full_source_factorization"]["t_theta_r"]["O_t_odd"] = deepcopy(
            changed["full_source_factorization"]["t_zero"]["O_t_odd"]
        )
        _rehash(changed, "full_source_factorization")
        with self.assertRaises(verifier.ReplayError):
            verifier.replay_payload(changed)

        # The anchor-complement cross response is likewise mandatory.
        changed = deepcopy(payload)
        changed["full_source_factorization"]["t_theta_r"]["b_t_cross"] = deepcopy(
            changed["full_source_factorization"]["t_zero"]["b_t_cross"]
        )
        _rehash(changed, "full_source_factorization")
        with self.assertRaises(verifier.ReplayError):
            verifier.replay_payload(changed)

        for field in ("B_U_eigenvalues", "odd_shifted_eigenvalues_at_U"):
            changed = deepcopy(payload)
            changed["ritz_ground_geometry"][field][0] = "-1"
            _rehash(changed, "ritz_ground_geometry")
            with self.subTest(field=field), self.assertRaises(verifier.ReplayError):
                verifier.replay_payload(changed)

    def test_adversarial_unsquared_promotion_and_theta_log_divisor(self) -> None:
        # The compact multiplier acts on ||Pi_M d||, while the determinant
        # controls its square.  Replacing the squared gate by an unsquared
        # response condition is false even for exact rational sequences.
        wrong_products: list[Fraction] = []
        actual_products: list[Fraction] = []
        for integer in (10, 100, 1000, 10000):
            weight = Fraction(integer)
            squared_bound = Fraction(1, integer**2)
            wrong_products.append(weight * squared_bound)
            actual_products.append(weight * Fraction(1, integer))
        self.assertLess(wrong_products[-1], Fraction(1, 1000))
        self.assertEqual(actual_products, [Fraction(1)] * 4)

        # F_theta alone vanishes as theta->0 for a fixed response eigenvalue,
        # while F_theta/log(1+theta) retains the observed mass.
        response_eigenvalue = mp.mpf(1) / 2
        raw: list[mp.mpf] = []
        normalized: list[mp.mpf] = []
        for exponent in (2, 4, 8, 12):
            theta = mp.mpf(10) ** (-exponent)
            F = mp.log1p(theta * response_eigenvalue)
            raw.append(F)
            normalized.append(F / mp.log1p(theta))
        self.assertLess(raw[-1], mp.mpf("1e-12"))
        self.assertLess(abs(normalized[-1] - response_eigenvalue), mp.mpf("1e-12"))
        self.assertIn("F/log(1+theta)", producer.LOCKED_FORMULAS["response_bounds"])

    def test_adversarial_cached_boolean_and_real_axis_claim_promotion(self) -> None:
        payload = verifier.strict_json_loads(self.raw40)

        changed = deepcopy(payload)
        changed["low_mode_observation"]["passed"] = True
        _rehash(changed, "low_mode_observation")
        raw = json.dumps(changed, sort_keys=True, allow_nan=False)
        with self.assertRaisesRegex(verifier.ReplayError, "cached producer boolean"):
            verifier.strict_json_loads(raw)

        changed = deepcopy(payload)
        changed["analytic_uniform_claim"] = True
        with self.assertRaisesRegex(verifier.ReplayError, "claim promotion"):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["compact_bridge_diagnostic"]["locally_uniform_claim"] = True
        changed["compact_bridge_diagnostic"]["asymptotic_pass_claim"] = True
        _rehash(changed, "compact_bridge_diagnostic")
        with self.assertRaisesRegex(verifier.ReplayError, "claim promotion"):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["equation_5_2_claim"] = True
        with self.assertRaisesRegex(verifier.ReplayError, "claim promotion"):
            verifier._validate_contract(changed)

    def test_fresh_40_and_80_producers_replay_independently(self) -> None:
        for raw in (self.raw40, self.raw80):
            payload = verifier.strict_json_loads(raw)
            replay = verifier.replay_payload(payload, hashlib.sha256(raw).hexdigest())
            self.assertIs(replay["replay_agrees"], True)
            self.assertEqual(replay["terminal_state"], "P0_INVALIDATED")
            self.assertIs(replay["analytic_uniform_claim"], False)
            self.assertIs(replay["equation_5_2_claim"], False)
            self.assertIs(replay["rh_proof_claim"], False)
            self.assertTrue(all(replay["independent_gates"].values()))
            self.assertIs(replay["producer_values_used_only_for_comparison"], True)

    def test_verifier_import_independence_and_hygiene(self) -> None:
        tree = ast.parse(VERIFIER_PATH.read_text(encoding="utf-8"))
        imported_modules: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported_modules.update(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported_modules.add(node.module)
        self.assertNotIn("checkpoint068_ritz_projective_low_mode", imported_modules)
        self.assertNotIn("src.checkpoint068_ritz_projective_low_mode", imported_modules)
        self.assertIn("checkpoint064_reciprocal_secant_replay", imported_modules)
        self.assertIsNot(verifier, producer)
        self.assertNotEqual(Path(verifier.__file__).resolve(), Path(producer.__file__).resolve())

    def test_stored_producer_and_replay_artifacts_equal_fresh_results(self) -> None:
        missing = [name for name in ARTIFACT_NAMES if not (ARTIFACTS / name).is_file()]
        if missing:
            self.skipTest(
                "checkpoint 0.68 stored artifacts not yet generated: "
                + ", ".join(missing)
            )
        for dps, fresh in ((40, self.fresh40), (80, self.fresh80)):
            producer_path = ARTIFACTS / f"lambda2_N4_M2_theta1_dps{dps}_producer.json"
            replay_path = ARTIFACTS / f"lambda2_N4_M2_theta1_dps{dps}_replay.json"
            raw = producer_path.read_bytes()
            stored_payload = verifier.strict_json_loads(raw)
            stored_replay = json.loads(replay_path.read_text(encoding="utf-8"))
            self.assertEqual(stored_payload, fresh)
            fresh_replay = verifier.replay_payload(
                deepcopy(stored_payload), hashlib.sha256(raw).hexdigest()
            )
            self.assertEqual(fresh_replay, stored_replay)
            self.assertIs(fresh_replay["replay_agrees"], True)

        sums_path = ARTIFACTS / "SHA256SUMS"
        if sums_path.is_file():
            for line in sums_path.read_text(encoding="utf-8").splitlines():
                expected, name = line.split("  ", 1)
                self.assertEqual(
                    hashlib.sha256((ARTIFACTS / name).read_bytes()).hexdigest(),
                    expected,
                )


if __name__ == "__main__":
    unittest.main()
