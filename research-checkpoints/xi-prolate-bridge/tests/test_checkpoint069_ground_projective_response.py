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

import checkpoint069_ground_projective_response as producer  # noqa: E402
import checkpoint069_ground_projective_response_replay as verifier  # noqa: E402


VERIFIER_PATH = ROOT / "verifier" / "checkpoint069_ground_projective_response_replay.py"
ARTIFACTS = ROOT / "artifacts" / "checkpoint069_ground_projective_response"
ARTIFACT_NAMES = (
    "lambda2_N4_M2_dps40_producer.json",
    "lambda2_N4_M2_dps80_producer.json",
    "lambda2_N4_M2_dps40_replay.json",
    "lambda2_N4_M2_dps80_replay.json",
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


class Checkpoint069GroundProjectiveResponseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        # Each call rebuilds checkpoint 0.64 and every checkpoint-0.69
        # quantity live.  No checkpoint artifact, matrix, or eigensystem is
        # read by the producer.
        cls.fresh40 = producer.produce("2", 4, 2, 40)
        cls.fresh80 = producer.produce("2", 4, 2, 80)
        cls.raw40 = (
            json.dumps(cls.fresh40, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")
        cls.raw80 = (
            json.dumps(cls.fresh80, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")

    def setUp(self) -> None:
        mp.mp.dps = 110

    def test_exact_inputs_strict_json_and_fail_closed_cutoffs(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce(2.0, 4, 2, 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 4.0, 2, 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 4, True, 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 4, 2, True)  # type: ignore[arg-type]
        with self.assertRaisesRegex(producer.Checkpoint069Error, "rational text"):
            producer.produce("2.0.0", 4, 2, 40)
        for arguments in (
            ("3", 4, 2, 40),
            ("2", 5, 2, 40),
            ("2", 4, 0, 40),
            ("2", 4, 4, 40),
            ("2", 4, 2, 60),
        ):
            with self.subTest(arguments=arguments), self.assertRaises(
                producer.Checkpoint069Error
            ):
                producer.produce(*arguments)

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

    def test_contract_dependencies_sections_hashes_and_claim_boundary(self) -> None:
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
            set(verifier.SECTION_NAMES),
            {
                "source_guard",
                "normalization_regression",
                "ritz_sign_gates",
                "exact_ground_adjugate",
                "projective_minor_response",
                "odd_source_reconstruction",
                "bordered_positive_response",
            },
        )
        self.assertEqual(set(payload["section_sha256"]), set(verifier.SECTION_NAMES))

        dependencies = payload["dependency_sha256"]
        self.assertEqual(set(dependencies), set(producer.DEPENDENCIES))
        for required in (
            "notes/SOURCE_COMPATIBLE_GROUND_PROJECTIVE_RESPONSE.md",
            "tests/test_source_compatible_ground_projective_response.py",
            "tests/test_checkpoint069_ground_projective_response.py",
            "src/checkpoint069_ground_projective_response.py",
            "verifier/checkpoint069_ground_projective_response_replay.py",
        ):
            self.assertIn(required, dependencies)
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
        joined_limitations = " ".join(payload["limitations"])
        self.assertIn("not an interval or ball enclosure", joined_limitations)
        self.assertIn("no unbounded cyclic-cap estimate", joined_limitations)
        self.assertIn("no locally uniform determinant conclusion", joined_limitations)

    def test_source_blocks_cutoff_commutators_and_normalization_regression(self) -> None:
        payload = self.fresh80
        guard = payload["source_guard"]
        self.assertEqual(guard["prime_power_inventory"], [2, 3, 4])
        self.assertEqual(guard["expected_prime_power_inventory"], [2, 3, 4])
        self.assertIs(guard["prime_endpoint_lambda_squared_included"], True)
        self.assertEqual(guard["source_prime_block_sign"], "minus")
        self.assertIn(
            "exp(-i*t*x)", payload["locked_conventions"]["fourier_transform"]
        )

        pole = _matrix(guard["pole_block"])
        arch = _matrix(guard["archimedean_unsigned_block"])
        prime = _matrix(guard["prime_unsigned_block"])
        Q = _matrix(guard["full_Q_pole_minus_archimedean_minus_prime"])
        self.assertLess(_max_abs(Q - (pole - arch - prime)), mp.mpf("1e-70"))
        self.assertLess(_max_abs(Q - Q.T), mp.mpf("1e-70"))
        J = _matrix(guard["inversion_J"])
        mode = _matrix(guard["integer_mode_operator"])
        Pi = _matrix(guard["full_ambient_Pi_M"])
        self.assertLess(_max_abs(Q * J - J * Q), mp.mpf("1e-70"))
        self.assertLess(_max_abs(Pi * Pi - Pi), mp.mpf("1e-70"))
        self.assertLess(_max_abs(mode * Pi - Pi * mode), mp.mpf("1e-70"))
        self.assertLess(_max_abs(J * Pi - Pi * J), mp.mpf("1e-70"))
        self.assertLess(_mp(guard["source_displacement_residual"]), mp.mpf("1e-70"))
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
        difference = _mp(
            normalization["unit_normalization_limiting_scalar_difference"]
        )
        self.assertNotEqual(source_scalar, unit_scalar)
        self.assertNotEqual(difference, 0)
        self.assertLess(abs(difference - (unit_scalar - source_scalar)), mp.mpf("1e-70"))

    def test_sharp_even_and_odd_ritz_sector_gates(self) -> None:
        gates = self.fresh80["ritz_sign_gates"]
        q = _mp(gates["q"])
        u = _mp(gates["two_vector_ritz_u"])
        d = _mp(gates["d_q_minus_u"])
        residual_r = _mp(gates["residual_r"])
        w = _vector(gates["residual_direction_w"])
        B_u = _matrix(gates["B_u"])
        self.assertLess(u, q)
        self.assertGreater(d, 0)
        self.assertGreater(residual_r, 0)
        self.assertLess(abs(d - (q - u)), mp.mpf("1e-70"))
        self.assertLess(
            abs(d * (w.T * B_u * w)[0] - residual_r**2), mp.mpf("1e-70")
        )
        self.assertTrue(all(_mp(value) > 0 for value in gates["B_u_eigenvalues"]))

        C_even = _matrix(gates["C_even_transverse"])
        e_F = _vector(gates["ritz_residual_e_F"])
        sharp_even = C_even - e_F * e_F.T / d
        self.assertLess(
            _max_abs(sharp_even - _matrix(gates["sharp_even_short_C_minus_eeT_over_d"])),
            mp.mpf("1e-69"),
        )
        self.assertTrue(
            all(_mp(value) > 0 for value in gates["sharp_even_short_eigenvalues"])
        )
        g_F = _vector(gates["shift_invariant_cross_g_F"])
        self.assertLess(_norm(e_F + (d / residual_r) * g_F), mp.mpf("1e-70"))

        A_u = _matrix(gates["odd_A_u_Aq_plus_dI"])
        c_q = _vector(gates["odd_c_q"])
        a_q = _mp(gates["odd_a_q"])
        odd_short = a_q + d - (c_q.T * _inverse(A_u) * c_q)[0]
        self.assertGreater(odd_short, 0)
        self.assertLess(abs(odd_short - _mp(gates["odd_schur_scalar_at_u"])), mp.mpf("1e-69"))
        self.assertTrue(all(_mp(value) > 0 for value in gates["odd_A_u_eigenvalues"]))
        self.assertTrue(
            all(_mp(value) > 0 for value in gates["odd_shifted_eigenvalues_at_u"])
        )
        self.assertLess(_mp(gates["s_q_source_identity_residual"]), mp.mpf("1e-70"))
        self.assertLess(_mp(gates["odd_block_reconstruction_defect"]), mp.mpf("1e-69"))
        odd_direct = _matrix(gates["odd_block_direct_in_y_plus_G_basis"])
        self.assertLess(
            abs(mp.det(odd_direct) - mp.det(A_u) * odd_short), mp.mpf("1e-67")
        )

    def test_true_ground_adjugate_cofactor_and_projective_minor_identities(self) -> None:
        payload = self.fresh80
        ground = payload["exact_ground_adjugate"]
        response = payload["projective_minor_response"]
        guard = payload["source_guard"]
        H = _matrix(ground["H_Q_even_minus_muI"])
        C = _matrix(ground["literal_adjugate_C"])
        x = _vector(ground["coefficient_normalized_ground_x"])
        projective = _vector(response["projective_vector_kappa_minus_x_equals_Wz"])
        kappa = x + projective
        c = _mp(ground["c_kappaT_C_kappa"])
        Pi_even = _matrix(guard["Pi_M_even"])

        self.assertGreater(_mp(ground["ground_gap"]), 0)
        self.assertGreater(c, 0)
        self.assertLess(_norm(H * x), mp.mpf("1e-69"))
        self.assertLess(abs((kappa.T * x)[0] - 1), mp.mpf("1e-69"))
        self.assertLess(_max_abs(H * C), mp.mpf("1e-68"))
        self.assertLess(_max_abs(C * H), mp.mpf("1e-68"))
        self.assertLess(_max_abs(C - c * x * x.T), mp.mpf("1e-68"))
        self.assertLess(abs(c - _mp(ground["c_det_D_ground"])), mp.mpf("1e-68"))
        self.assertLess(
            _norm(_vector(ground["x_from_cofactor_column"]) - x), mp.mpf("1e-68")
        )
        self.assertIs(ground["singular_even_inverse_used"], False)

        E = (projective.T * Pi_even * projective)[0]
        self.assertLess(abs(E - _mp(response["E_direct_projective_low_energy"])), mp.mpf("1e-69"))
        self.assertLess(abs(E - _mp(response["E_from_minor_decomposition"])), mp.mpf("1e-68"))
        self.assertLess(abs(E - _mp(response["E_from_mixed_mode_minors"])), mp.mpf("1e-68"))
        mixed_sum = mp.fsum(
            _mp(item["combined_minor_absolute_square"])
            for item in response["mixed_mode_minors"]
        )
        self.assertLess(
            abs(mixed_sum / c**2 - E),
            mp.mpf("1e-68"),
        )

        S_derivative = _mp(response["S_unbordered_singular_derivative_adjugate"])
        S_M = S_derivative / c
        self.assertLess(abs(S_M - _mp(response["ground_low_mass_xT_Pi_x"])), mp.mpf("1e-68"))
        self.assertLess(
            abs(
                S_derivative
                - _mp(response["S_unbordered_singular_derivative_column_replacement"])
            ),
            mp.mpf("1e-68"),
        )

        high = mp.eye(H.rows) - Pi_even
        y = x - kappa
        high_cross = (kappa.T * high * y)[0]
        k00 = (kappa.T * Pi_even * kappa)[0]
        self.assertLess(
            abs((S_M - k00) - (E - 2 * high_cross)), mp.mpf("1e-68")
        )
        self.assertLess(
            abs(high_cross - _mp(response["note_high_cross_kappaT_R_times_x_minus_kappa"])),
            mp.mpf("1e-68"),
        )
        wrong = _mp(response["E_from_wrong_opposite_note_high_cross_sign"])
        self.assertGreater(abs(wrong - E), mp.mpf("1e-20"))
        self.assertIs(response["wrong_opposite_note_high_cross_sign_rejected"], True)
        self.assertGreaterEqual(_mp(response["absolute_high_cross_bound_slack"]), 0)

    def test_odd_source_ground_and_cofactor_factorization(self) -> None:
        ground = self.fresh80["exact_ground_adjugate"]
        odd = self.fresh80["odd_source_reconstruction"]
        x = _vector(ground["coefficient_normalized_ground_x"])
        x_odd = _vector(odd["x_reconstructed_from_odd_resolvent"])
        self.assertTrue(all(_mp(value) > 0 for value in odd["O_ground_eigenvalues"]))
        self.assertLess(_norm(x_odd - x), mp.mpf("1e-68"))
        self.assertLess(_mp(odd["odd_transport_residual_norm"]), mp.mpf("1e-68"))
        self.assertLess(
            abs(_mp(odd["template_boundary_etaT_template"]) - 1), mp.mpf("1e-68")
        )
        self.assertLess(
            abs(_mp(odd["det_O_ground"]) - _mp(odd["boundary_cofactor_delta_adjH_e0"])),
            mp.mpf("1e-67"),
        )
        p_mu = _mp(odd["p_mu_kappaT_Phi_mu"])
        central = _mp(odd["Phi_mu_central_e0T_Phi_mu"])
        c_source = _mp(odd["det_O_ground"]) * abs(p_mu) ** 2 / central
        self.assertGreater(central, 0)
        self.assertLess(
            abs(c_source - _mp(ground["c_kappaT_C_kappa"])), mp.mpf("1e-66")
        )
        self.assertLess(_mp(odd["c_odd_factorization_residual"]), mp.mpf("1e-66"))
        self.assertIs(odd["singular_boundary_Weyl_scalar_evaluated_separately"], False)

    def test_bordered_signs_derivative_gauge_invariance_and_secant_cap(self) -> None:
        payload = self.fresh80
        response = payload["bordered_positive_response"]
        target_E = _mp(response["target_E"])
        self.assertEqual(response["gauge_count"], 2)
        self.assertEqual(
            response["gauge_order"], ["rho1_s1", "rho2_s1over2"]
        )
        vectors: list[mp.matrix] = []
        for label in response["gauge_order"]:
            gauge = response["gauges"][label]
            rho = _mp(gauge["rho"])
            s = _mp(gauge["s"])
            tau = _mp(gauge["finite_tau"])
            D0 = _mp(gauge["D_0_direct_det_L0"])
            Dt = _mp(gauge["D_tau_direct_det_Ltau"])
            N0 = _mp(gauge["N_0_direct_D0_alpha0"])
            Nt = _mp(gauge["N_tau_direct_Dtau_alphatau"])
            self.assertGreater(min(D0, Dt, N0, Nt), 0)
            self.assertLess(
                abs(-rho * mp.det(_matrix(gauge["bordered_D_matrix_t0"])) - D0),
                mp.mpf("1e-66"),
            )
            self.assertLess(
                abs(rho * mp.det(_matrix(gauge["bordered_N_matrix_t0"])) - N0),
                mp.mpf("1e-66"),
            )
            self.assertLess(
                abs(-rho * mp.det(_matrix(gauge["bordered_D_matrix_tau"])) - Dt),
                mp.mpf("1e-66"),
            )
            self.assertLess(
                abs(rho * mp.det(_matrix(gauge["bordered_N_matrix_tau"])) - Nt),
                mp.mpf("1e-66"),
            )
            alpha0 = N0 / D0
            alphat = Nt / Dt
            phi = mp.log(Dt * (D0 + s * N0) / (D0 * (Dt + s * Nt)))
            self.assertLess(abs(alpha0 - _mp(gauge["alpha_0"])), mp.mpf("1e-68"))
            self.assertLess(abs(alphat - _mp(gauge["alpha_tau"])), mp.mpf("1e-68"))
            self.assertLess(
                abs(phi - _mp(gauge["Phi_s_tau_from_bordered_DN"])), mp.mpf("1e-68")
            )
            self.assertLess(
                abs(
                    (1 + s * alpha0) * _mp(gauge["Phi_s_prime_0"]) / s
                    - target_E
                ),
                mp.mpf("1e-68"),
            )
            decrement = (1 + s * alpha0) * (1 - mp.exp(-phi)) / s
            self.assertLess(abs(decrement - (alpha0 - alphat)), mp.mpf("1e-68"))
            secant = decrement / tau
            cap = _mp(gauge["full_cap_Lambda"])
            self.assertLessEqual(secant, target_E + mp.mpf("1e-68"))
            self.assertLessEqual(target_E, (1 + tau * cap) * secant + mp.mpf("1e-68"))
            self.assertEqual(
                cap,
                max(_mp(value) for value in gauge["full_cap_eigenvalues"]),
            )
            vectors.append(_vector(gauge["L0_inverse_g"]))
        self.assertLess(_norm(vectors[0] - vectors[1]), mp.mpf("1e-68"))
        self.assertIs(
            response["rank_one_bordered_readout_source_commutator_preserved"],
            False,
        )
        self.assertIs(
            response["full_ambient_Pi_homotopy_source_commutator_preserved"],
            True,
        )
        self.assertIs(response["finite_secant_is_not_an_unbounded_rate"], True)

    def test_doubled_precision_selected_values_and_fields_are_stable(self) -> None:
        paths = (
            "ritz_sign_gates.q",
            "ritz_sign_gates.residual_r",
            "ritz_sign_gates.two_vector_ritz_u",
            "ritz_sign_gates.sharp_even_short_minimum",
            "ritz_sign_gates.odd_schur_scalar_at_u",
            "exact_ground_adjugate.true_even_ground_mu",
            "exact_ground_adjugate.c_kappaT_C_kappa",
            "projective_minor_response.E_direct_projective_low_energy",
            "projective_minor_response.S_M_normalized_unbordered_response",
            "projective_minor_response.S_M_minus_k00",
            "odd_source_reconstruction.det_O_ground",
            "odd_source_reconstruction.c_source_factorization_detO_abs_p_squared_over_central",
            "bordered_positive_response.target_E",
        )
        for path in paths:
            with self.subTest(path=path):
                self.assertLess(
                    _relative_defect(_at(self.fresh40, path), _at(self.fresh80, path)),
                    mp.mpf("1e-30"),
                )
        for label in self.fresh80["bordered_positive_response"]["gauge_order"]:
            for field in (
                "Phi_s_prime_0",
                "Phi_s_tau_from_bordered_DN",
                "full_cap_Lambda",
                "finite_alpha_secant",
            ):
                path = f"bordered_positive_response.gauges.{label}.{field}"
                self.assertLess(
                    _relative_defect(_at(self.fresh40, path), _at(self.fresh80, path)),
                    mp.mpf("1e-30"),
                )
        for section in verifier.SECTION_NAMES:
            self.assertEqual(set(self.fresh40[section]), set(self.fresh80[section]))

    def test_adversarial_hash_source_normalization_sign_and_claim_tamper(self) -> None:
        payload = verifier.strict_json_loads(self.raw40)

        changed = deepcopy(payload)
        changed["projective_minor_response"]["S_M_minus_k00"] = "0"
        with self.assertRaisesRegex(verifier.ReplayError, "section hash"):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["dependency_sha256"]["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(verifier.ReplayError, "dependency hash"):
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
        with self.assertRaises(verifier.ReplayError):
            verifier.replay_payload(changed)

        changed = deepcopy(payload)
        changed["source_guard"]["prime_power_inventory"] = [2, 3]
        changed["source_guard"]["expected_prime_power_inventory"] = [2, 3]
        _rehash(changed, "source_guard")
        with self.assertRaises(verifier.ReplayError):
            verifier.replay_payload(changed)

        for field in ("analytic_uniform_claim", "equation_5_2_claim", "rh_proof_claim"):
            changed = deepcopy(payload)
            changed[field] = True
            with self.subTest(field=field), self.assertRaisesRegex(
                verifier.ReplayError, "claim promotion"
            ):
                verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        with self.assertRaisesRegex(verifier.ReplayError, "promotion"):
            verifier._validate_contract(changed)

        changed_pins = dict(producer.PINNED_SOURCE_SHA256)
        changed_pins["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(producer.Checkpoint069Error, "pinned source"):
            producer.validate_pinned_source_hashes(changed_pins)

    def test_adversarial_coordinated_minor_border_and_sector_tamper(self) -> None:
        payload = verifier.strict_json_loads(self.raw40)
        mutations = (
            (
                "projective_minor_response",
                "E_from_wrong_opposite_note_high_cross_sign",
                "0",
            ),
            (
                "exact_ground_adjugate",
                "c_kappaT_C_kappa",
                "1",
            ),
            (
                "odd_source_reconstruction",
                "c_source_factorization_detO_abs_p_squared_over_central",
                "1",
            ),
            (
                "ritz_sign_gates",
                "sharp_even_short_minimum",
                "-1",
            ),
            (
                "ritz_sign_gates",
                "odd_schur_scalar_at_u",
                "-1",
            ),
        )
        for section, field, value in mutations:
            changed = deepcopy(payload)
            changed[section][field] = value
            _rehash(changed, section)
            with self.subTest(section=section, field=field), self.assertRaises(
                verifier.ReplayError
            ):
                verifier.replay_payload(changed)

        for label in payload["bordered_positive_response"]["gauge_order"]:
            changed = deepcopy(payload)
            gauge = changed["bordered_positive_response"]["gauges"][label]
            gauge["D_0_bordered"] = str(-_mp(gauge["D_0_bordered"]))
            _rehash(changed, "bordered_positive_response")
            with self.subTest(label=label, kind="D sign"), self.assertRaises(
                verifier.ReplayError
            ):
                verifier.replay_payload(changed)

            changed = deepcopy(payload)
            gauge = changed["bordered_positive_response"]["gauges"][label]
            gauge["full_cap_Lambda"] = "0"
            _rehash(changed, "bordered_positive_response")
            with self.subTest(label=label, kind="cap"), self.assertRaises(
                verifier.ReplayError
            ):
                verifier.replay_payload(changed)

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
        self.assertNotIn("checkpoint069_ground_projective_response", imported_modules)
        self.assertNotIn("src.checkpoint069_ground_projective_response", imported_modules)
        self.assertIn("checkpoint064_reciprocal_secant_replay", imported_modules)
        self.assertIsNot(verifier, producer)
        self.assertNotEqual(
            Path(verifier.__file__).resolve(), Path(producer.__file__).resolve()
        )

    def test_stored_producer_and_replay_artifacts_equal_fresh_results(self) -> None:
        missing = [name for name in ARTIFACT_NAMES if not (ARTIFACTS / name).is_file()]
        if missing:
            self.skipTest(
                "checkpoint 0.69 stored artifacts not yet generated: "
                + ", ".join(missing)
            )
        for dps, fresh in ((40, self.fresh40), (80, self.fresh80)):
            producer_path = ARTIFACTS / f"lambda2_N4_M2_dps{dps}_producer.json"
            replay_path = ARTIFACTS / f"lambda2_N4_M2_dps{dps}_replay.json"
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
