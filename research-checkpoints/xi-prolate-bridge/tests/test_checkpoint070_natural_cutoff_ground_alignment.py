from __future__ import annotations

import ast
from copy import deepcopy
import hashlib
import json
import math
from pathlib import Path
import sys
import unittest
from unittest import mock

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

import checkpoint070_natural_cutoff_ground_alignment as producer  # noqa: E402
import checkpoint070_natural_cutoff_ground_alignment_replay as verifier  # noqa: E402


VERIFIER_PATH = (
    ROOT / "verifier" / "checkpoint070_natural_cutoff_ground_alignment_replay.py"
)
ARTIFACTS = ROOT / "artifacts" / "checkpoint070_natural_cutoff_ground_alignment"
ARTIFACT_NAMES = (
    "lambda2_N8_M2_dps40_producer.json",
    "lambda2_N8_M2_dps80_producer.json",
    "lambda2_N8_M2_dps40_replay.json",
    "lambda2_N8_M2_dps80_replay.json",
)


def _mp(value: object) -> mp.mpf:
    return mp.mpf(value)  # type: ignore[arg-type]


def _vector(values: list[object]) -> mp.matrix:
    return mp.matrix([_mp(value) for value in values])


def _matrix(values: list[list[object]]) -> mp.matrix:
    return mp.matrix([[_mp(value) for value in row] for row in values])


def _norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt(
        mp.fsum(abs(vector[index]) ** 2 for index in range(vector.rows))
    )


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    return max(
        (
            abs(matrix[row, column])
            for row in range(matrix.rows)
            for column in range(matrix.cols)
        ),
        default=mp.mpf(0),
    )


def _trace(matrix: mp.matrix) -> mp.mpf:
    return mp.fsum(
        matrix[index, index] for index in range(min(matrix.rows, matrix.cols))
    )


def _inverse(matrix: mp.matrix) -> mp.matrix:
    result = mp.matrix(matrix.rows)
    for column in range(matrix.cols):
        unit = mp.matrix(matrix.rows, 1)
        unit[column] = 1
        result[:, column] = mp.lu_solve(matrix, unit)
    return result


def _at(payload: dict[str, object], path: str) -> object:
    value: object = payload
    for component in path.split("."):
        if not isinstance(value, dict):
            raise AssertionError(f"non-object before {component} in {path}")
        value = value[component]
    return value


def _relative_defect(left: object, right: object) -> mp.mpf:
    lhs = _mp(left)
    rhs = _mp(right)
    return abs(lhs - rhs) / max(mp.mpf(1), abs(lhs), abs(rhs))


def _rehash(payload: dict[str, object], section: str) -> None:
    hashes = payload["section_sha256"]
    if not isinstance(hashes, dict):
        raise AssertionError("section hashes are not an object")
    hashes[section] = verifier._raw_hash(payload[section])


def _assert_cancellation_record(
    case: unittest.TestCase, record: dict[str, object], tolerance: mp.mpf
) -> None:
    left = _mp(record["left_norm"])
    right = _mp(record["right_norm"])
    combined = _mp(record["combined_norm"])
    cross = _mp(record["signed_cross_inner_product"])
    residual = (
        combined**2
        - left**2
        - right**2
        + 2 * cross
    )
    case.assertLess(abs(residual), tolerance)
    case.assertLess(
        abs(residual - _mp(record["squared_norm_decomposition_residual"])),
        tolerance,
    )
    triangle = left + right
    case.assertLessEqual(combined, triangle + tolerance)
    case.assertLess(
        abs(_mp(record["combined_over_triangle_ratio"]) - combined / triangle),
        tolerance,
    )
    case.assertLess(
        abs(_mp(record["triangle_loss_factor"]) - triangle / combined),
        tolerance,
    )


class Checkpoint070NaturalCutoffGroundAlignmentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        # Each call rebuilds the finite source matrix, 60-mode prolate state,
        # finite ground, and common-inverse response.  No artifact is read.
        cls.fresh40 = producer.produce("2", 8, 2, 40, 60)
        cls.fresh80 = producer.produce("2", 8, 2, 80, 60)
        cls.raw40 = (
            json.dumps(cls.fresh40, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")
        cls.raw80 = (
            json.dumps(cls.fresh80, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")

    def setUp(self) -> None:
        mp.mp.dps = 110

    def test_strict_locked_inputs_and_json_contract(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce(2.0, 8, 2, 40, 60)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 8.0, 2, 40, 60)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 8, True, 40, 60)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 8, 2, True, 60)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 8, 2, 40, True)  # type: ignore[arg-type]
        with self.assertRaises(producer.Checkpoint070Error):
            producer.produce("2.0.0", 8, 2, 40, 60)
        for arguments in (
            ("3", 8, 2, 40, 60),
            ("2", 7, 2, 40, 60),
            ("2", 8, 1, 40, 60),
            ("2", 8, 3, 40, 60),
            ("2", 8, 2, 60, 60),
            ("2", 8, 2, 40, 59),
        ):
            with self.subTest(arguments=arguments), self.assertRaises(
                producer.Checkpoint070Error
            ):
                producer.produce(*arguments)

        verifier.strict_json_loads(self.raw40)
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier.strict_json_loads('{"lambda":2.0}')
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier.strict_json_loads('{"x":"1","x":"2"}')
        with self.assertRaises(verifier.ReplayError):
            verifier.strict_json_loads(b"\xff")
        with self.assertRaises(verifier.ReplayError):
            verifier.strict_json_loads("[]")
        for token in ("nan", "+inf", "-inf"):
            with self.subTest(token=token), self.assertRaises(verifier.ReplayError):
                verifier.strict_json_loads(json.dumps({"x": token}))
        with self.assertRaisesRegex(verifier.ReplayError, "cached producer boolean"):
            verifier.strict_json_loads('{"section":{"passed":true}}')

    def test_dependencies_sections_hashes_and_claim_discipline(self) -> None:
        payload = self.fresh80
        self.assertEqual(producer.DEPENDENCIES, verifier.DEPENDENCIES)
        self.assertEqual(producer.LOCKED_CONVENTIONS, verifier.LOCKED_CONVENTIONS)
        self.assertEqual(producer.LOCKED_FORMULAS, verifier.LOCKED_FORMULAS)
        self.assertEqual(set(payload), verifier.TOP_LEVEL_KEYS)
        self.assertEqual(
            set(verifier.SECTION_NAMES),
            {
                "source_guard",
                "normalization_regression",
                "natural_cutoff_geometry",
                "ritz_ground_geometry",
                "signed_block_response",
                "adjugate_alignment",
                "finite_diagnostics",
            },
        )
        self.assertEqual(set(payload["section_sha256"]), set(verifier.SECTION_NAMES))
        self.assertEqual(payload["schema"], producer.SCHEMA)
        self.assertEqual(payload["checkpoint_version"], producer.CHECKPOINT_VERSION)
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(payload["claim_class"], "FINITE_POINT_DIAGNOSTIC")
        self.assertIs(payload["analytic_uniform_claim"], False)

        dependencies = payload["dependency_sha256"]
        self.assertEqual(set(dependencies), set(producer.DEPENDENCIES))
        for required in (
            "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md",
            "tests/test_natural_cutoff_signed_ground_alignment.py",
            "tests/test_checkpoint070_natural_cutoff_ground_alignment.py",
            "src/checkpoint070_natural_cutoff_ground_alignment.py",
            "verifier/checkpoint070_natural_cutoff_ground_alignment_replay.py",
            "notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md",
            "notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md",
            "notes/CHEBYSHEV_ERROR_REWRITE.md",
        ):
            self.assertIn(required, dependencies)
        for relative, expected in dependencies.items():
            with self.subTest(dependency=relative):
                self.assertEqual(
                    hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(),
                    expected,
                )
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
        limitations = " ".join(payload["limitations"])
        self.assertIn("not an interval or ball enclosure", limitations)
        self.assertIn("no outward tail enclosure", limitations)
        self.assertIn("not proved to decay", limitations)
        self.assertIn("no conclusion about DIRECT_RH_ATTACK equation (5.2)", limitations)

    def test_complete_source_assembly_inversion_and_natural_projector(self) -> None:
        payload = self.fresh80
        guard = payload["source_guard"]
        modes = guard["modes_minusN_to_N"]
        self.assertEqual(modes, list(range(-8, 9)))
        inventory = guard["prime_powers"]
        self.assertEqual([item["n"] for item in inventory], [2, 3, 4])
        self.assertIs(guard["prime_endpoint_lambda_squared_included"], True)
        self.assertIs(guard["source_formula_prime_sign_is_minus"], True)
        self.assertIs(guard["Fourier_sign_is_locked_positive_modes"], True)
        self.assertIs(guard["lambda_squared_not_lambda_prime_cutoff"], True)

        pole = _matrix(guard["pole_direct"])
        arch = _matrix(guard["archimedean_unsigned_direct"])
        prime = _matrix(guard["prime_unsigned_direct"])
        Q = _matrix(guard["Q_direct_equals_pole_minus_archimedean_minus_prime"])
        Q_split = _matrix(guard["Q_split_equals_pole_minus_archimedean_minus_prime"])
        A_tail = _matrix(guard["normal_form_A_tail"])
        T_D = _matrix(guard["normal_form_T_D"])
        Q_normal = _matrix(guard["Q_normal_equals_cI_plus_A_tail_minus_T_D"])
        c_star = _mp(guard["c_star"])
        tolerance = mp.mpf("1e-60")
        self.assertLess(_max_abs(Q - (pole - arch - prime)), tolerance)
        self.assertLess(_max_abs(Q - Q_split), tolerance)
        self.assertLess(
            _max_abs(Q_normal - (c_star * mp.eye(Q.rows) + A_tail - T_D)),
            tolerance,
        )
        self.assertLess(_max_abs(Q - Q_normal), mp.mpf("1e-50"))
        self.assertLess(_max_abs(Q - Q.T), tolerance)

        J = mp.matrix(Q.rows)
        mode_to_index = {mode: index for index, mode in enumerate(modes)}
        for index, mode in enumerate(modes):
            J[index, mode_to_index[-mode]] = 1
        self.assertLess(_max_abs(Q * J - J * Q), tolerance)

        geometry = payload["natural_cutoff_geometry"]
        Pi_full = _matrix(geometry["Pi_M_full_raw_modes"])
        expected_Pi = mp.matrix(Q.rows)
        for index, mode in enumerate(modes):
            if abs(mode) <= 2:
                expected_Pi[index, index] = 1
        self.assertLess(_max_abs(Pi_full - expected_Pi), tolerance)
        self.assertLess(_max_abs(Pi_full * Pi_full - Pi_full), tolerance)
        self.assertLess(_max_abs(Pi_full * J - J * Pi_full), tolerance)
        self.assertLess(_mp(geometry["Pi_mode_commutator_defect"]), tolerance)
        self.assertIs(geometry["natural_cutoff_equals_ceil_lambda"], True)
        self.assertIs(geometry["asymptotic_gevrey_threshold_certified_at_pilot"], False)

    def test_source_normalization_and_unit_substitution_regression(self) -> None:
        payload = self.fresh80
        normalization = payload["normalization_regression"]
        geometry = payload["natural_cutoff_geometry"]
        kappa_full = _vector(normalization["kappa_full_modes_minusN_to_N"])
        kappa_even = _vector(normalization["kappa_even_coordinates"])
        self.assertLess(abs(_norm(kappa_full) - 1), mp.mpf("1e-60"))
        self.assertLess(abs(_norm(kappa_even) - 1), mp.mpf("1e-60"))
        self.assertLess(_mp(normalization["zero_integral_defect"]), mp.mpf("1e-50"))
        self.assertEqual(
            _mp(normalization["source_limiting_Xi_transform_scalar"]), mp.mpf(1) / 4
        )
        source_scalar = _mp(normalization["source_limiting_Xi_transform_scalar"])
        unit_scalar = _mp(
            normalization["unit_normalized_limiting_Xi_transform_scalar"]
        )
        multiplier = _mp(normalization["unit_normalization_limit_multiplier"])
        self.assertNotEqual(source_scalar, unit_scalar)
        self.assertLess(abs(unit_scalar - source_scalar * multiplier), mp.mpf("1e-70"))
        self.assertIs(normalization["unit_normalization_rejected"], True)

        k00 = _mp(geometry["k00"])
        t_kappa = _mp(geometry["t_kappa_high_mode_norm"])
        self.assertGreater(k00, 0)
        self.assertLess(abs(k00 + t_kappa**2 - 1), mp.mpf("1e-60"))
        P_L = _matrix(geometry["P_L_anchor_transverse"])
        self.assertLess(_max_abs(P_L * P_L - P_L), mp.mpf("1e-60"))
        self.assertLess(_mp(geometry["P_L_anchor_defect"]), mp.mpf("1e-60"))
        self.assertLess(abs(_trace(P_L) - 2), mp.mpf("1e-60"))

    def test_exact_u_ritz_moment_signs_and_ground_common_solve(self) -> None:
        ground = self.fresh80["ritz_ground_geometry"]
        q = _mp(ground["q"])
        r = _mp(ground["residual_r"])
        u = _mp(ground["u_lower_two_vector_Ritz"])
        d = _mp(ground["d_q_minus_u"])
        mu = _mp(ground["mu_true_even_ground"])
        self.assertGreater(r, 0)
        self.assertGreater(d, 0)
        self.assertLessEqual(mu, u)
        self.assertLess(u, q)
        self.assertLess(abs(d - (q - u)), mp.mpf("1e-60"))
        self.assertLess(
            abs(
                _mp(ground["ritz_moment_left_d_times_wBuw"])
                - _mp(ground["ritz_moment_right_r_squared"])
            ),
            mp.mpf("1e-55"),
        )
        self.assertTrue(all(_mp(value) > 0 for value in ground["B_mu_eigenvalues"]))
        self.assertTrue(all(_mp(value) > 0 for value in ground["B_u_eigenvalues"]))
        self.assertTrue(
            all(_mp(value) > 0 for value in ground["odd_at_u_eigenvalues"])
        )
        self.assertIs(ground["even_shift_sign_strict"], True)
        self.assertIs(ground["odd_shift_sign_strict"], True)

        B_mu = _matrix(ground["B_mu"])
        inverse = _inverse(B_mu)
        z = _vector(ground["z_common_shifted_solve"])
        b = _vector(ground["residual_b_complement"])
        self.assertLess(_norm(B_mu * z - b), mp.mpf("1e-55"))
        self.assertLess(_mp(ground["x_reconstruction_defect"]), mp.mpf("1e-55"))
        self.assertLess(_mp(ground["ground_equation_defect"]), mp.mpf("1e-55"))
        self.assertLess(
            _max_abs(inverse - _matrix(self.fresh80["signed_block_response"]["common_inverse_B_mu"])),
            mp.mpf("1e-50"),
        )
        C_R_squared = _mp(ground["C_R_squared"])
        C_R = _mp(ground["C_R"])
        self.assertLess(abs(C_R**2 - C_R_squared), mp.mpf("1e-60"))
        self.assertGreaterEqual(
            _mp(ground["C_R_squared_minus_z_norm_squared"]), -mp.mpf("1e-60")
        )

    def test_common_inverse_combined_response_preserves_cancellation(self) -> None:
        response = self.fresh80["signed_block_response"]
        B_inverse = _matrix(response["common_inverse_B_mu"])
        b_A = _vector(response["b_A_tail"])
        b_T = _vector(response["b_T_D"])
        b_combined = _vector(response["b_combined_A_tail_minus_T_D"])
        b_direct = _vector(response["b_direct_from_Q"])
        self.assertLess(_norm(b_combined - (b_A - b_T)), mp.mpf("1e-55"))
        self.assertLess(_norm(b_combined - b_direct), mp.mpf("1e-50"))
        self.assertIs(response["separate_block_inverses_used"], False)

        z_A = _vector(response["z_A_tail_through_common_inverse"])
        z_T = _vector(response["z_T_D_through_common_inverse"])
        z_split = _vector(response["z_split_subtraction_A_tail_minus_T_D"])
        z_direct = _vector(response["z_combined_direct_solve"])
        self.assertLess(_norm(z_A - B_inverse * b_A), mp.mpf("1e-50"))
        self.assertLess(_norm(z_T - B_inverse * b_T), mp.mpf("1e-50"))
        self.assertLess(_norm(z_split - (z_A - z_T)), mp.mpf("1e-50"))
        self.assertLess(_norm(z_direct - B_inverse * b_combined), mp.mpf("1e-50"))
        self.assertLess(_norm(z_split - z_direct), mp.mpf("1e-50"))

        response_A = _vector(response["response_A_tail_even"])
        response_T = _vector(response["response_T_D_even"])
        response_split = _vector(
            response["response_split_subtraction_A_tail_minus_T_D_even"]
        )
        response_direct = _vector(response["response_combined_direct_even"])
        alignment = _vector(response["ground_alignment_vector_P_L_x"])
        self.assertLess(_norm(response_split - (response_A - response_T)), mp.mpf("1e-50"))
        self.assertLess(_norm(response_split - response_direct), mp.mpf("1e-50"))
        self.assertLess(_norm(alignment + response_direct), mp.mpf("1e-50"))
        self.assertLess(
            abs(
                _mp(response["alignment_energy"])
                - _mp(response["alignment_from_combined_response"])
            ),
            mp.mpf("1e-50"),
        )

        tolerance = mp.mpf("1e-48")
        for key in (
            "forcing_cancellation",
            "resolved_low_cancellation",
            "ground_action_cancellation",
        ):
            _assert_cancellation_record(self, response[key], tolerance)
        self.assertGreater(
            _mp(response["resolved_low_cancellation"]["triangle_loss_factor"]), 1
        )
        self.assertIs(response["combined_response_preserved_before_absolute_values"], True)

        action_A = _vector(response["ground_action_A_tail_P_L_A_tail_x"])
        action_T = _vector(response["ground_action_T_D_P_L_T_D_x"])
        action_split = _vector(response["ground_action_split_subtraction"])
        action_direct = _vector(response["ground_action_combined_direct"])
        action_rhs = _vector(
            response["ground_action_eigen_identity_rhs_mu_minus_cstar_P_L_x"]
        )
        self.assertLess(_norm(action_split - (action_A - action_T)), mp.mpf("1e-50"))
        self.assertLess(_norm(action_split - action_direct), mp.mpf("1e-50"))
        self.assertLess(_norm(action_direct - action_rhs), mp.mpf("1e-50"))

    def test_adjugate_wedge_and_high_cross_identities(self) -> None:
        payload = self.fresh80
        ground = payload["ritz_ground_geometry"]
        geometry = payload["natural_cutoff_geometry"]
        adj = payload["adjugate_alignment"]
        H = _matrix(adj["H_even_at_mu"])
        C = _matrix(adj["H_adjugate"])
        x = _vector(ground["x_coefficient_normalized_ground"])
        kappa = _vector(payload["normalization_regression"]["kappa_even_coordinates"])
        Pi = _matrix(geometry["Pi_M_even"])
        P_L = _matrix(geometry["P_L_anchor_transverse"])
        R = mp.eye(Pi.rows) - Pi
        c_kappa = _mp(adj["c_kappa"])
        k00 = _mp(adj["k00"])
        alignment = _mp(adj["alignment_energy"])
        self.assertGreater(c_kappa, 0)
        self.assertLess(_max_abs(H * C), mp.mpf("1e-45"))
        self.assertLess(_max_abs(C - c_kappa * x * x.T), mp.mpf("1e-45"))

        S_ratio = _trace(Pi * C) / c_kappa
        S_state = (x.T * Pi * x)[0]
        self.assertLess(abs(S_ratio - S_state), mp.mpf("1e-45"))
        self.assertLess(abs(S_ratio - _mp(adj["S_M_adjugate_ratio"])), mp.mpf("1e-45"))
        self.assertLess(
            abs(_trace(P_L * C) / c_kappa - alignment), mp.mpf("1e-45")
        )
        self.assertLess(
            abs(_mp(adj["low_wedge_ratio_by_k00"]) - alignment), mp.mpf("1e-45")
        )

        y = x - kappa
        h = ((R * kappa).T * (R * y))[0]
        E = _norm(Pi * y) ** 2
        high_alignment = abs(h) ** 2 / k00
        self.assertLess(abs(h - _mp(adj["high_cross_h"])), mp.mpf("1e-50"))
        self.assertLess(abs(E - alignment - high_alignment), mp.mpf("1e-45"))
        self.assertLess(
            abs((S_ratio - k00) - (alignment + high_alignment - 2 * h)),
            mp.mpf("1e-45"),
        )
        self.assertLessEqual(
            abs(h),
            _mp(adj["high_cross_linear_Ritz_bound"]) + mp.mpf("1e-50"),
        )
        self.assertLessEqual(
            high_alignment,
            _mp(adj["high_alignment_quadratic_Ritz_bound"]) + mp.mpf("1e-50"),
        )
        self.assertIs(adj["C_R_used_linearly_for_high_cross"], True)
        self.assertIs(adj["C_R_squared_used_for_squared_energy"], True)

    def test_doubled_precision_agreement_and_independent_live_replay(self) -> None:
        scalar_paths = (
            "normalization_regression.projected_state_norm",
            "natural_cutoff_geometry.k00",
            "natural_cutoff_geometry.t_kappa_high_mode_norm",
            "ritz_ground_geometry.q",
            "ritz_ground_geometry.residual_r",
            "ritz_ground_geometry.mu_true_even_ground",
            "ritz_ground_geometry.u_lower_two_vector_Ritz",
            "ritz_ground_geometry.delta_d_over_r",
            "signed_block_response.alignment_energy",
            "adjugate_alignment.S_M_minus_k00",
            "adjugate_alignment.high_cross_h",
        )
        for path in scalar_paths:
            with self.subTest(path=path):
                self.assertLess(
                    _relative_defect(_at(self.fresh40, path), _at(self.fresh80, path)),
                    mp.mpf("1e-25"),
                )

        for payload, raw in (
            (self.fresh40, self.raw40),
            (self.fresh80, self.raw80),
        ):
            replay = verifier.replay_payload(
                deepcopy(payload), hashlib.sha256(raw).hexdigest()
            )
            self.assertEqual(replay["terminal_state"], "P0_INVALIDATED")
            self.assertEqual(
                replay["producer_artifact_sha256"], hashlib.sha256(raw).hexdigest()
            )

    def test_contract_and_coordinated_numeric_tampering_fail_closed(self) -> None:
        base = verifier.strict_json_loads(self.raw40)
        contract_mutations: list[tuple[str, dict[str, object]]] = []

        changed = deepcopy(base)
        changed["schema"] = "wrong-schema"
        contract_mutations.append(("schema", changed))

        changed = deepcopy(base)
        changed["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        contract_mutations.append(("terminal_state", changed))

        changed = deepcopy(base)
        changed["analytic_uniform_claim"] = True
        contract_mutations.append(("analytic_uniform_claim", changed))

        changed = deepcopy(base)
        changed["provenance"]["locally_uniform_claim_made"] = True
        contract_mutations.append(("locally_uniform_provenance", changed))

        changed = deepcopy(base)
        changed["locked_formulas"]["source_normal_form"] = "Q=cI+A_tail+T_D"
        contract_mutations.append(("T_D_source_sign", changed))

        changed = deepcopy(base)
        changed["locked_formulas"]["boundary_discrepancy"] = (
            "F_align=F_boundary with the mandatory 2*exp(-t/2) drift omitted"
        )
        contract_mutations.append(("F_align_boundary_drift", changed))

        changed = deepcopy(base)
        changed["dependency_sha256"][
            "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md"
        ] = "0" * 64
        contract_mutations.append(("theorem_dependency", changed))

        changed = deepcopy(base)
        changed["section_sha256"]["signed_block_response"] = "0" * 64
        contract_mutations.append(("section_hash", changed))

        changed = deepcopy(base)
        changed["inputs"]["M"] = 3
        contract_mutations.append(("natural_cutoff_M", changed))

        changed = deepcopy(base)
        changed["finite_diagnostics"][
            "locally_uniform_determinant_convergence_claimed"
        ] = True
        _rehash(changed, "finite_diagnostics")
        contract_mutations.append(("locally_uniform_promotion", changed))

        changed = deepcopy(base)
        changed["signed_block_response"]["separate_block_inverses_used"] = True
        _rehash(changed, "signed_block_response")
        contract_mutations.append(("separate_block_inverse_flag", changed))

        changed = deepcopy(base)
        changed["normalization_regression"][
            "unit_normalized_replacement_allowed"
        ] = True
        _rehash(changed, "normalization_regression")
        contract_mutations.append(("unit_normalization_substitution", changed))

        for label, candidate in contract_mutations:
            with self.subTest(contract_mutation=label), self.assertRaises(
                verifier.ReplayError
            ):
                verifier.replay_payload(candidate)

        # The public replay is exercised below with a cached *unaltered*
        # expected section tree.  The separate live 40/80 test exercises the
        # expensive independent source reconstruction.  This patch only
        # avoids rebuilding that source tree once per adversarial mutation.
        expected = {
            name: deepcopy(base[name]) for name in verifier.SECTION_NAMES
        }
        live = {
            "gates": {"baseline_independent_reconstruction": True},
            "root_data": {},
            "paths": {},
        }
        numeric_mutations: list[tuple[str, dict[str, object]]] = []

        # Coordinated false alignment value with valid section hashes.
        changed = deepcopy(base)
        changed["signed_block_response"]["alignment_energy"] = "9"
        changed["adjugate_alignment"]["alignment_energy"] = "9"
        _rehash(changed, "signed_block_response")
        _rehash(changed, "adjugate_alignment")
        numeric_mutations.append(("alignment_energy", changed))

        # Change A_tail-T_D to A_tail+T_D in the combined forcing while
        # keeping the separate signed blocks untouched.
        changed = deepcopy(base)
        b_A = changed["signed_block_response"]["b_A_tail"]
        b_T = changed["signed_block_response"]["b_T_D"]
        changed["signed_block_response"][
            "b_combined_A_tail_minus_T_D"
        ] = [
            mp.nstr(_mp(left) + _mp(right), 40)
            for left, right in zip(b_A, b_T)
        ]
        _rehash(changed, "signed_block_response")
        numeric_mutations.append(("combined_T_D_sign", changed))

        # Substitute an identity for the serialized common B_mu inverse.
        changed = deepcopy(base)
        common_inverse = changed["signed_block_response"]["common_inverse_B_mu"]
        size = len(common_inverse)
        changed["signed_block_response"]["common_inverse_B_mu"] = [
            ["1" if row == column else "0" for column in range(size)]
            for row in range(size)
        ]
        _rehash(changed, "signed_block_response")
        numeric_mutations.append(("separate_inverse_substitution", changed))

        # Preserve every other field but use the opposite sign in the
        # high-cross identity RHS.
        changed = deepcopy(base)
        adj = changed["adjugate_alignment"]
        wrong_rhs = (
            _mp(adj["alignment_energy"])
            + _mp(adj["high_alignment_abs_h_squared_over_k00"])
            + 2 * _mp(adj["high_cross_h"])
        )
        if wrong_rhs == _mp(adj["S_minus_k00_identity_rhs"]):
            wrong_rhs += 1
        adj["S_minus_k00_identity_rhs"] = mp.nstr(wrong_rhs, 40)
        adj["S_minus_k00_identity_defect"] = mp.nstr(
            _mp(adj["S_M_minus_k00"]) - wrong_rhs, 40
        )
        _rehash(changed, "adjugate_alignment")
        numeric_mutations.append(("high_cross_sign", changed))

        # A nonpositive exact-u floor may not be promoted to a passing sign.
        changed = deepcopy(base)
        changed["ritz_ground_geometry"]["B_u_eigenvalues"][0] = "0"
        changed["ritz_ground_geometry"]["even_shift_sign_strict"] = False
        _rehash(changed, "ritz_ground_geometry")
        numeric_mutations.append(("nonpositive_even_exact_u_floor", changed))

        changed = deepcopy(base)
        changed["ritz_ground_geometry"]["odd_at_u_eigenvalues"][0] = "0"
        changed["ritz_ground_geometry"]["odd_shift_sign_strict"] = False
        _rehash(changed, "ritz_ground_geometry")
        numeric_mutations.append(("nonpositive_odd_exact_u_floor", changed))

        with mock.patch.object(
            verifier, "_reconstruct", return_value=(expected, live)
        ):
            for label, candidate in numeric_mutations:
                with self.subTest(numeric_mutation=label), self.assertRaises(
                    verifier.ReplayError
                ):
                    verifier.replay_payload(candidate)

    def test_verifier_has_no_producer_import_or_cached_artifact_dependency(self) -> None:
        source = VERIFIER_PATH.read_text(encoding="utf-8")
        tree = ast.parse(source)
        imported: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module)
        self.assertNotIn("checkpoint070_natural_cutoff_ground_alignment", imported)
        self.assertNotIn("src.checkpoint070_natural_cutoff_ground_alignment", imported)
        self.assertNotIn("import checkpoint070_natural_cutoff_ground_alignment", source)
        self.assertIn("cached_artifact_read", source)
        self.assertIn("False", source)

    def test_stored_artifacts_equal_fresh_only_after_generation(self) -> None:
        missing = [name for name in ARTIFACT_NAMES if not (ARTIFACTS / name).is_file()]
        if missing:
            self.skipTest(
                "checkpoint 0.70 stored artifacts not yet generated: "
                + ", ".join(missing)
            )
        for dps, fresh in ((40, self.fresh40), (80, self.fresh80)):
            producer_path = (
                ARTIFACTS / f"lambda2_N8_M2_dps{dps}_producer.json"
            )
            replay_path = ARTIFACTS / f"lambda2_N8_M2_dps{dps}_replay.json"
            raw = producer_path.read_bytes()
            stored = verifier.strict_json_loads(raw)
            stored_replay = json.loads(replay_path.read_text(encoding="utf-8"))
            self.assertEqual(stored, fresh)
            expected_replay = verifier.replay_payload(
                deepcopy(stored), hashlib.sha256(raw).hexdigest()
            )
            self.assertEqual(expected_replay, stored_replay)

        sums_path = ARTIFACTS / "SHA256SUMS"
        if sums_path.is_file():
            observed = {}
            for line in sums_path.read_text(encoding="ascii").splitlines():
                digest, name = line.split()
                observed[name] = digest
            for name in ARTIFACT_NAMES:
                self.assertEqual(
                    observed[name],
                    hashlib.sha256((ARTIFACTS / name).read_bytes()).hexdigest(),
                )


if __name__ == "__main__":
    unittest.main()
