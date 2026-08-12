from __future__ import annotations

import ast
from copy import deepcopy
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

import checkpoint067_ritz_moment_transfer as producer  # noqa: E402


VERIFIER_MODULE = "checkpoint067_ritz_moment_transfer_replay"
VERIFIER_PATH = ROOT / "verifier" / f"{VERIFIER_MODULE}.py"
if importlib.util.find_spec(VERIFIER_MODULE) is None:
    verifier = None
else:
    import checkpoint067_ritz_moment_transfer_replay as verifier  # type: ignore[no-redef]  # noqa: E402


ARTIFACTS = ROOT / "artifacts" / "checkpoint067_ritz_moment_transfer"
ARTIFACT_NAMES = (
    "lambda2_N4_T1_dps40_producer.json",
    "lambda2_N4_T1_dps80_producer.json",
    "lambda2_N4_T1_dps40_replay.json",
    "lambda2_N4_T1_dps80_replay.json",
)


def _mp(value: object) -> mp.mpf:
    return mp.mpf(value)  # type: ignore[arg-type]


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


def _matrix(values: list[list[str]]) -> mp.matrix:
    return mp.matrix([[_mp(value) for value in row] for row in values])


def _vector(values: list[str]) -> mp.matrix:
    return mp.matrix([_mp(value) for value in values])


class Checkpoint067RitzMomentTransferTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        # These are deliberately live producer calls.  They rebuild checkpoint
        # 0.64 and do not read checkpoint-0.67 matrices or eigensystems.
        cls.fresh40 = producer.produce("2", 4, "1", 40)
        cls.fresh80 = producer.produce("2", 4, "1", 80)
        cls.raw_fresh40 = (
            json.dumps(cls.fresh40, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")
        cls.raw_fresh80 = (
            json.dumps(cls.fresh80, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")

    def setUp(self) -> None:
        # Parse and recompute serialized 80-digit values independently of the
        # ambient precision left by another test or by an isolated test run.
        mp.mp.dps = 100

    def test_exact_text_inputs_and_producer_fail_closed(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce(2.0, 4, "1", 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce("2", 4, 1.0, 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", True, "1", 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "exact integer"):
            producer.produce("2", 4, "1", True)  # type: ignore[arg-type]
        with self.assertRaisesRegex(producer.Checkpoint067Error, "rational text"):
            producer.produce("2.0.0", 4, "1", 40)
        with self.assertRaisesRegex(producer.Checkpoint067Error, "locked"):
            producer.produce("4", 4, "1", 40)
        with self.assertRaisesRegex(producer.Checkpoint067Error, "40 or 80"):
            producer.produce("2", 4, "1", 60)

    @unittest.skipUnless(
        verifier is not None,
        "checkpoint 0.67 independent verifier has not been generated yet",
    )
    def test_strict_json_rejects_binary64_duplicates_and_nonfinite_text(self) -> None:
        assert verifier is not None
        verifier.strict_json_loads(self.raw_fresh40)
        with self.assertRaises(verifier.ReplayError):
            verifier.strict_json_loads('{"x":1.0}')
        with self.assertRaises(verifier.ReplayError):
            verifier.strict_json_loads('{"x":"1","x":"2"}')
        with self.assertRaises(verifier.ReplayError):
            verifier.strict_json_loads(b"\xff")
        with self.assertRaises(verifier.ReplayError):
            verifier.strict_json_loads("[]")
        for token in ("nan", "+inf", "-inf"):
            with self.subTest(token=token), self.assertRaises(verifier.ReplayError):
                verifier.strict_json_loads(json.dumps({"x": token}))
        with self.assertRaises(verifier.ReplayError):
            verifier.strict_json_loads('{"section":{"passed":true}}')

    def test_contract_source_normalization_and_dependency_hashes(self) -> None:
        payload = self.fresh80
        self.assertEqual(payload["schema"], producer.SCHEMA)
        self.assertEqual(payload["checkpoint_version"], producer.CHECKPOINT_VERSION)
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(payload["claim_class"], "FINITE_POINT_DIAGNOSTIC")
        self.assertIs(payload["analytic_uniform_claim"], False)
        self.assertIs(payload["equation_5_2_claim"], False)
        self.assertIn(
            "exp(-i*t*x)", payload["locked_conventions"]["fourier_transform"]
        )
        self.assertIn(
            "equation (3.19)", payload["locked_conventions"]["prime_block_sign"]
        )

        guard = payload["source_guard"]
        self.assertEqual(guard["prime_power_inventory"], [2, 3, 4])
        self.assertEqual(guard["expected_prime_power_inventory"], [2, 3, 4])
        self.assertIs(guard["prime_endpoint_lambda_squared_included"], True)
        self.assertGreater(_mp(guard["B_U_minimum_eigenvalue"]), 0)
        self.assertGreater(_mp(guard["odd_gap_at_U"]), 0)
        for key in (
            "cached_matrix_read",
            "cached_eigensystem_read",
            "zeta_zero_table_read",
            "global_weil_positivity_assumed",
            "binary64_parameter_used",
        ):
            self.assertIs(guard[key], False, key)

        normalization = payload["normalization_regression"]
        self.assertIs(normalization["unit_normalized_replacement_allowed"], False)
        self.assertNotEqual(
            _mp(normalization["source_limiting_Xi_transform_scalar"]),
            _mp(normalization["unit_normalized_limiting_Xi_transform_scalar"]),
        )
        self.assertNotEqual(
            _mp(normalization["unit_normalization_limiting_scalar_difference"]), 0
        )

        required = {
            "P0_SOURCE_LOCK.json",
            "P0_NORMALIZATION_AUDIT.md",
            "DIRECT_RH_ATTACK.md",
            "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
            "notes/TIME_BAND_CAUCHY_DETERMINANT_RESPONSE.md",
            "notes/SECANT_BULK_POSITIVE_DETERMINANT_RESPONSE.md",
            "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md",
            "notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
            "src/checkpoint064_reciprocal_secant.py",
            "src/checkpoint066_finite_increment_response.py",
            "src/checkpoint067_ritz_moment_transfer.py",
            "src/prolate_state.py",
            "src/weil_matrix.py",
            "verifier/checkpoint064_reciprocal_secant_replay.py",
            "verifier/checkpoint066_finite_increment_response_replay.py",
            "verifier/independent_replay.py",
            "verifier/residual_ridged_fixed_window_replay.py",
            "tests/test_checkpoint066_finite_increment_response.py",
        }
        dependencies = payload["dependency_sha256"]
        self.assertTrue(required.issubset(dependencies))
        self.assertEqual(set(dependencies), set(producer.DEPENDENCIES))
        for relative_path, expected in dependencies.items():
            with self.subTest(dependency=relative_path):
                actual = hashlib.sha256((ROOT / relative_path).read_bytes()).hexdigest()
                self.assertEqual(actual, expected)
        for section, expected in payload["section_sha256"].items():
            with self.subTest(section=section):
                self.assertEqual(producer._raw_hash(payload[section]), expected)

    def test_live_ritz_moment_geometry_and_piecewise_constants(self) -> None:
        geometry = self.fresh80["ritz_moment_geometry"]
        q = _mp(geometry["q"])
        residual_r = _mp(geometry["residual_r"])
        c_R = _mp(geometry["c_R"])
        u = _mp(geometry["two_vector_ritz_u"])
        d = _mp(geometry["d_q_minus_u"])
        expected_u = (
            q + c_R - mp.sqrt((c_R - q) ** 2 + 4 * residual_r**2)
        ) / 2
        self.assertLess(abs(u - expected_u), mp.mpf("1e-70"))
        self.assertLess(u, q)
        self.assertLess(abs(d - (q - u)), mp.mpf("1e-70"))

        two_vector = _matrix(geometry["two_vector_matrix"])
        self.assertLess(abs(two_vector[0, 0] - q), mp.mpf("1e-70"))
        self.assertLess(abs(two_vector[0, 1] - residual_r), mp.mpf("1e-70"))
        self.assertLess(abs(two_vector[1, 0] - residual_r), mp.mpf("1e-70"))
        self.assertLess(abs(two_vector[1, 1] - c_R), mp.mpf("1e-70"))
        self.assertLess(
            abs(_mp(geometry["ritz_characteristic_residual"])), mp.mpf("1e-70")
        )
        self.assertLess(
            _mp(geometry["residual_direction_norm_defect"]), mp.mpf("1e-70")
        )

        moment = _mp(geometry["ritz_moment_w_B_U_w"])
        self.assertLess(
            abs(d * moment - residual_r**2), mp.mpf("1e-70")
        )
        self.assertLess(
            abs(_mp(geometry["ritz_moment_defect_r_squared_minus_d_m"])),
            mp.mpf("1e-70"),
        )
        B_values = [_mp(value) for value in geometry["B_U_eigenvalues"]]
        self.assertGreater(min(B_values), 0)
        self.assertGreater(_mp(geometry["odd_gap_at_U"]), 0)

        rho = _mp(geometry["rho_stable_rationalized_formula"])
        expected_rho = (mp.sqrt(d**2 + 4 * residual_r**2) - d) / 2
        self.assertLess(abs(rho - expected_rho), mp.mpf("1e-70"))
        self.assertLess(abs(rho * (d + rho) - residual_r**2), mp.mpf("1e-70"))
        self.assertLess(
            abs(_mp(geometry["rho_formula_residual"])), mp.mpf("1e-70")
        )

        delta = d / residual_r
        alpha = (residual_r / d) ** 2
        root = mp.sqrt(1 + 6 * alpha)
        expected_c_squared = 1 + 4 * (2 * root - 1) / (3 * (root - 1) ** 2)
        expected_A_R = 1 + delta + delta * (1 + delta) ** 2 / 2
        expected_A_cert = (1 + delta) * (1 + 2 * delta)
        self.assertEqual(geometry["C_R_branch"], "alpha_at_least_one_half")
        self.assertEqual(geometry["A_R_branch"], "delta_at_most_one")
        self.assertLess(
            abs(_mp(geometry["C_R_squared"]) - expected_c_squared),
            mp.mpf("1e-70"),
        )
        self.assertLess(abs(_mp(geometry["A_R"]) - expected_A_R), mp.mpf("1e-70"))
        self.assertLess(
            abs(_mp(geometry["A_cert"]) - expected_A_cert), mp.mpf("1e-70")
        )
        self.assertGreaterEqual(_mp(geometry["A_cert_minus_A_R"]), 0)

    def test_ground_transfer_observation_and_fopt_pilot_gates(self) -> None:
        payload = self.fresh80
        geometry = payload["ritz_moment_geometry"]
        ground = payload["true_ground_diagnostic"]
        transfer = payload["residual_ridge_transfer"]
        rho = _mp(geometry["rho_stable_rationalized_formula"])
        residual_r = _mp(geometry["residual_r"])
        h = _mp(ground["u_minus_mu_h"])
        self.assertIs(ground["diagnostic_only"], True)
        self.assertIs(ground["used_to_construct_Ritz_constants"], False)
        self.assertGreaterEqual(h, 0)
        self.assertLessEqual(h, rho)
        self.assertLessEqual(h, residual_r)
        for field in (
            "z_eigenvector_reconstruction_defect",
            "feshbach_vector_residual_norm",
            "feshbach_scalar_residual",
            "coefficient_ground_line_residual_norm",
        ):
            self.assertLess(abs(_mp(ground[field])), mp.mpf("1e-69"), field)
        self.assertGreaterEqual(
            _mp(ground["C_R_squared_minus_z_norm_squared"]), 0
        )

        self.assertLess(
            abs(_mp(transfer["A_actual_formula_residual"])), mp.mpf("1e-69")
        )
        self.assertGreaterEqual(_mp(transfer["A_R_minus_A_actual"]), 0)
        self.assertGreaterEqual(_mp(transfer["A_cert_minus_A_actual"]), 0)
        self.assertGreaterEqual(
            _mp(transfer["theorem_Loewner_minimum_eigenvalue"]),
            -mp.mpf("1e-69"),
        )
        self.assertGreaterEqual(
            _mp(transfer["minimal_coefficient_Loewner_minimum_eigenvalue"]),
            -mp.mpf("1e-69"),
        )
        self.assertLessEqual(
            _mp(transfer["minimal_coefficient_Loewner_minimum_absolute_value"]),
            mp.mpf("1e-69"),
        )
        self.assertEqual(_mp(transfer["Loewner_defect_negative_part"]), 0)

        observations = payload["positive_observations"]
        A_R = _mp(geometry["A_R"])
        A_cert = _mp(geometry["A_cert"])
        self.assertEqual(_mp(observations["theta"]), 1)
        for label in ("time_band", "identity"):
            with self.subTest(observation=label):
                item = observations[label]
                F = _mp(item["log_increment_F"])
                H = _mp(item["soft_trace_H"])
                actual = _mp(item["actual_zKz"])
                self.assertGreater(F, 0)
                self.assertGreater(H, 0)
                self.assertLessEqual(F, H)
                self.assertLessEqual(H, F / mp.log(2))
                self.assertLessEqual(actual, A_R * H)
                self.assertLessEqual(actual, A_R * F / mp.log(2))
                self.assertLessEqual(actual, A_cert * H)
                self.assertGreaterEqual(_mp(item["K_minimum_eigenvalue"]), 0)
                self.assertLessEqual(_mp(item["K_maximum_eigenvalue"]), 1)
                self.assertGreaterEqual(_mp(item["X_minimum_eigenvalue"]), 0)
                self.assertLessEqual(_mp(item["X_maximum_eigenvalue"]), 1)

        fopt = payload["Fopt_rho"]
        self.assertEqual(fopt["strict_low_band_count"], 0)
        self.assertEqual(
            fopt["high_band_count"], len(fopt["B_U_eigenvalues"])
        )
        self.assertGreater(_mp(fopt["distance_to_nearest_d_boundary"]), 0)
        self.assertGreaterEqual(_mp(fopt["Fopt_Loewner_minimum_eigenvalue"]), 0)
        self.assertGreaterEqual(
            _mp(fopt["clean_bound_minus_Fopt_minimum_eigenvalue"]), 0
        )
        self.assertGreaterEqual(_mp(fopt["Fopt_K_T_trace_minus_actual"]), 0)
        self.assertGreaterEqual(_mp(fopt["Fopt_identity_trace_minus_actual"]), 0)
        for item in fopt["spectral_inventory"]:
            self.assertEqual(item["branch"], "high_d_to_infinity")
            self.assertLess(
                abs(_mp(item["piecewise_identity_residual"])), mp.mpf("1e-69")
            )

    def test_fresh_40_and_80_digit_producers_agree(self) -> None:
        paths = (
            "ritz_moment_geometry.q",
            "ritz_moment_geometry.residual_r",
            "ritz_moment_geometry.two_vector_ritz_u",
            "ritz_moment_geometry.d_q_minus_u",
            "ritz_moment_geometry.rho_stable_rationalized_formula",
            "ritz_moment_geometry.C_R_squared",
            "ritz_moment_geometry.A_R",
            "ritz_moment_geometry.A_cert",
            "true_ground_diagnostic.true_even_ground_mu",
            "true_ground_diagnostic.u_minus_mu_h",
            "true_ground_diagnostic.z_norm_squared",
            "residual_ridge_transfer.minimal_ridge_coefficient_A_actual_formula",
            "residual_ridge_transfer.theorem_Loewner_minimum_eigenvalue",
            "positive_observations.time_band.soft_trace_H",
            "positive_observations.time_band.log_increment_F",
            "positive_observations.time_band.actual_zKz",
            "positive_observations.identity.soft_trace_H",
            "positive_observations.identity.actual_zKz",
            "Fopt_rho.Fopt_K_T_trace",
            "Fopt_rho.Fopt_identity_trace",
        )
        for path in paths:
            with self.subTest(path=path):
                self.assertLess(
                    _relative_defect(_at(self.fresh40, path), _at(self.fresh80, path)),
                    mp.mpf("1e-30"),
                )
        self.assertEqual(
            self.fresh40["source_guard"]["prime_power_inventory"],
            self.fresh80["source_guard"]["prime_power_inventory"],
        )
        self.assertEqual(
            [item["branch"] for item in self.fresh40["Fopt_rho"]["spectral_inventory"]],
            [item["branch"] for item in self.fresh80["Fopt_rho"]["spectral_inventory"]],
        )

    def test_coefficient_one_fails_on_exact_ritz_adversary(self) -> None:
        # Q_+=[[1,2],[2,1]], kappa=e_1.  Its lower two-vector Ritz value is
        # U=-1, so d=r=B_U=2, h=0, and z=1.  The old coefficient-one
        # transfer gives 1 <= 1/2 and is therefore false even on Ritz data.
        q = mp.mpf(1)
        residual_r = mp.mpf(2)
        B_q = mp.mpf(0)
        c_R = q + B_q
        u = (q + c_R - mp.sqrt((c_R - q) ** 2 + 4 * residual_r**2)) / 2
        d = q - u
        B_U = B_q + d
        w = mp.mpf(1)
        h = mp.mpf(0)
        b = residual_r * w
        z = b / (B_U + h)
        self.assertEqual(u, -1)
        self.assertEqual(d * w * B_U * w, residual_r**2)
        self.assertEqual(z**2, 1)
        coefficient_one_rhs = residual_r / (B_U + residual_r)
        self.assertGreater(z**2, coefficient_one_rhs)

        constants = producer._ritz_constants(d, residual_r)
        self.assertEqual(constants["delta_d_over_r"], 1)
        self.assertEqual(constants["A_R"], 4)
        self.assertGreaterEqual(
            constants["A_R"] * coefficient_one_rhs, z**2
        )
        minimal_coefficient = z**2 * (B_U + residual_r) / residual_r
        self.assertEqual(minimal_coefficient, 2)

    def test_non_ritz_data_have_no_uniform_finite_ridge_coefficient(self) -> None:
        # Fix d=r=1 and c0=1/2.  This family obeys ||b||=r and
        # b*B^{-1}b=d, but not the Ritz moment inequality.  Its required
        # residual-ridge coefficient grows like c0/epsilon.
        d = mp.mpf(1)
        residual_r = mp.mpf(1)
        c0 = mp.mpf(1) / 2
        coefficients: list[mp.mpf] = []
        for epsilon_text in ("1e-2", "1e-4", "1e-6", "1e-8"):
            epsilon = mp.mpf(epsilon_text)
            B22 = (residual_r**2 - c0 * epsilon) / (d - c0)
            B = mp.diag([epsilon, B22])
            b = mp.matrix(
                [mp.sqrt(c0 * epsilon), mp.sqrt((d - c0) * B22)]
            )
            w = b / residual_r
            z = mp.lu_solve(B, b)
            norm_b_squared = (b.T * b)[0]
            feshbach_value = (b.T * mp.lu_solve(B, b))[0]
            ritz_moment_left = d * (w.T * B * w)[0]
            required_coefficient = (
                z.T * (B + residual_r * mp.eye(2)) * z
            )[0] / residual_r
            self.assertLess(abs(norm_b_squared - residual_r**2), mp.mpf("1e-70"))
            self.assertLess(abs(feshbach_value - d), mp.mpf("1e-70"))
            self.assertGreater(ritz_moment_left, residual_r**2)
            self.assertGreater(required_coefficient, c0 / epsilon)
            coefficients.append(required_coefficient)
        for previous, current in zip(coefficients, coefficients[1:]):
            self.assertGreater(current, 90 * previous)
        self.assertGreater(coefficients[-1], mp.mpf("5e7"))

    def test_delta_two_fopt_low_band_and_endpoint_are_not_double_counted(self) -> None:
        d = mp.mpf(2)
        residual_r = mp.mpf(1)
        rho = (mp.sqrt(d**2 + 4 * residual_r**2) - d) / 2
        B = mp.diag([mp.mpf(1), mp.mpf(2), mp.mpf(3)])
        K = mp.eye(3)
        z = mp.matrix(3, 1)
        data, live = producer._fopt_inventory(B, d, rho, K, z)
        inventory = data["spectral_inventory"]

        constants = producer._ritz_constants(d, residual_r)
        self.assertEqual(constants["delta_d_over_r"], 2)
        self.assertEqual(constants["alpha_r_squared_over_d_squared"], mp.mpf("0.25"))
        self.assertEqual(constants["C_R_squared"], 9)
        self.assertEqual(constants["C_R_branch"], "alpha_at_most_one_half")
        self.assertEqual(constants["A_R"], 11)
        self.assertEqual(constants["A_R_branch"], "delta_at_least_one")
        self.assertEqual(constants["A_cert"], 15)

        self.assertEqual(data["strict_low_band_count"], 1)
        self.assertEqual(data["high_band_count"], 2)
        self.assertEqual(inventory[0]["branch"], "strict_low_0_to_d")
        self.assertIs(inventory[0]["strictly_below_d"], True)
        self.assertEqual(inventory[1]["branch"], "high_d_to_infinity")
        self.assertIs(inventory[1]["strictly_below_d"], False)
        self.assertEqual(_mp(inventory[1]["distance_from_d"]), 0)
        self.assertEqual(_mp(inventory[1]["low_band_correction_weight"]), 0)
        self.assertEqual(_mp(inventory[0]["Fopt_weight"]), 2)
        self.assertEqual(_mp(inventory[1]["Fopt_weight"]), 1)
        self.assertLess(
            abs(
                _mp(inventory[2]["Fopt_weight"])
                - (d + rho) / (mp.mpf(3) + rho)
            ),
            mp.mpf("1e-70"),
        )
        for item in inventory:
            self.assertLess(
                abs(_mp(item["piecewise_identity_residual"])), mp.mpf("1e-70")
            )
        self.assertEqual(live["distance_to_boundary"], 0)
        self.assertLess(live["piecewise_residual"], mp.mpf("1e-70"))

    def test_producer_source_lock_tamper_is_rejected(self) -> None:
        changed = dict(producer.PINNED_SOURCE_SHA256)
        changed["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(producer.Checkpoint067Error, "pinned source"):
            producer.validate_pinned_source_hashes(changed)

    @unittest.skipUnless(
        verifier is not None,
        "checkpoint 0.67 independent verifier has not been generated yet",
    )
    def test_verifier_rejects_repaired_hash_tamper_and_dependency_changes(self) -> None:
        assert verifier is not None
        payload = verifier.strict_json_loads(self.raw_fresh40)
        verifier._validate_contract(payload)

        changed = deepcopy(payload)
        changed["ritz_moment_geometry"]["d_q_minus_u"] = "1"
        changed["section_sha256"]["ritz_moment_geometry"] = verifier._raw_hash(
            changed["ritz_moment_geometry"]
        )
        with self.assertRaises(verifier.ReplayError):
            verifier.replay_payload(changed)

        changed = deepcopy(payload)
        changed["normalization_regression"][
            "unit_normalized_replacement_allowed"
        ] = True
        changed["section_sha256"]["normalization_regression"] = verifier._raw_hash(
            changed["normalization_regression"]
        )
        with self.assertRaises(verifier.ReplayError):
            verifier.replay_payload(changed)

        changed = deepcopy(payload)
        changed["locked_conventions"]["fourier_transform"] = (
            "hat(f)(t)=integral f(x)*exp(+i*t*x) dx"
        )
        with self.assertRaises(verifier.ReplayError):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["source_guard"]["prime_power_inventory"] = [2, 3]
        changed["section_sha256"]["source_guard"] = verifier._raw_hash(
            changed["source_guard"]
        )
        with self.assertRaises(verifier.ReplayError):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["dependency_sha256"]["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaises(verifier.ReplayError):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["runtime"]["mpmath"] = "tampered"
        with self.assertRaises(verifier.ReplayError):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["analytic_uniform_claim"] = True
        with self.assertRaises(verifier.ReplayError):
            verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["equation_5_2_claim"] = True
        with self.assertRaises(verifier.ReplayError):
            verifier._validate_contract(changed)

        for key in ("zeta_zero_table_read", "global_weil_positivity_assumed"):
            changed = deepcopy(payload)
            changed["provenance"][key] = True
            with self.subTest(provenance=key), self.assertRaises(verifier.ReplayError):
                verifier._validate_contract(changed)

        changed = deepcopy(payload)
        changed["Fopt_rho"]["passed"] = True
        changed["section_sha256"]["Fopt_rho"] = verifier._raw_hash(
            changed["Fopt_rho"]
        )
        with self.assertRaises(verifier.ReplayError):
            verifier._validate_contract(changed)

    @unittest.skipUnless(
        verifier is not None,
        "checkpoint 0.67 independent verifier has not been generated yet",
    )
    def test_fresh_producers_replay_independently_at_40_and_80_digits(self) -> None:
        assert verifier is not None
        for raw in (self.raw_fresh40, self.raw_fresh80):
            payload = verifier.strict_json_loads(raw)
            replay = verifier.replay_payload(
                payload, hashlib.sha256(raw).hexdigest()
            )
            self.assertIs(replay["replay_agrees"], True)
            self.assertEqual(replay["terminal_state"], "P0_INVALIDATED")
            self.assertIs(replay["analytic_uniform_claim"], False)
            self.assertTrue(all(replay["independent_gates"].values()))
            self.assertIs(
                replay["producer_values_used_only_for_comparison"], True
            )

    @unittest.skipUnless(
        verifier is not None,
        "checkpoint 0.67 independent verifier has not been generated yet",
    )
    def test_verifier_import_independence_and_hygiene(self) -> None:
        assert verifier is not None
        self.assertTrue(VERIFIER_PATH.is_file())
        tree = ast.parse(VERIFIER_PATH.read_text(encoding="utf-8"))
        imported_modules: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported_modules.update(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported_modules.add(node.module)
        self.assertNotIn("checkpoint067_ritz_moment_transfer", imported_modules)
        self.assertNotIn("src.checkpoint067_ritz_moment_transfer", imported_modules)
        self.assertIn("checkpoint064_reciprocal_secant_replay", imported_modules)
        self.assertIsNot(verifier, producer)
        self.assertNotEqual(Path(verifier.__file__).resolve(), Path(producer.__file__).resolve())

    def test_stored_producer_and_replay_artifacts_equal_fresh_results(self) -> None:
        if verifier is None:
            self.skipTest("checkpoint 0.67 independent verifier has not been generated yet")
        missing = [name for name in ARTIFACT_NAMES if not (ARTIFACTS / name).is_file()]
        if missing:
            self.skipTest(
                "checkpoint 0.67 stored producer/replay artifacts not yet generated: "
                + ", ".join(missing)
            )
        assert verifier is not None
        for dps, fresh in ((40, self.fresh40), (80, self.fresh80)):
            producer_path = ARTIFACTS / f"lambda2_N4_T1_dps{dps}_producer.json"
            replay_path = ARTIFACTS / f"lambda2_N4_T1_dps{dps}_replay.json"
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
