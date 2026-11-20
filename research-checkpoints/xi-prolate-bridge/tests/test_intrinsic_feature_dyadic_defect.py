from __future__ import annotations

import ast
import copy
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import sys
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import intrinsic_feature_dyadic_defect as producer  # noqa: E402
from verifier import intrinsic_feature_dyadic_defect_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


def rational(value: dict[str, str] | int) -> Fraction:
    if isinstance(value, int):
        return Fraction(value)
    return Fraction(int(value["numerator"]), int(value["denominator"]))


def dyadic(raw: list[object]) -> Fraction:
    sign, mantissa_text, exponent, _bits = raw
    mantissa = int(str(mantissa_text))
    numerator = -mantissa if sign else mantissa
    exponent = int(exponent)
    return (
        Fraction(numerator * 2**exponent)
        if exponent >= 0
        else Fraction(numerator, 2 ** (-exponent))
    )


def interval_inventory(value: object, path: str = "") -> dict[str, dict[str, object]]:
    found: dict[str, dict[str, object]] = {}
    if isinstance(value, dict):
        if set(value) == {"decimal", "dyadic"}:
            found[path] = value
        else:
            for key, child in value.items():
                child_path = f"{path}.{key}" if path else key
                found.update(interval_inventory(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            found.update(interval_inventory(child, f"{path}[{index}]"))
    return found


def secret_ast_findings(source: str) -> tuple[set[str], set[str]]:
    tree = ast.parse(source)
    imported_roots: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imported_roots.update(alias.name.split(".", 1)[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imported_roots.add(node.module.split(".", 1)[0])
    names = {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)}
    attributes = {node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)}
    return imported_roots & {"os", "dotenv"}, (names | attributes) & {"environ", "getenv"}


class IntrinsicFeatureDyadicDefectTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.runs: dict[tuple[str, str], dict[str, object]] = {}
        for p in ("5", "9"):
            for dps in ("80", "160"):
                cls.runs[p, dps] = producer.produce(p, dps)
        cls.base = cls.runs["5", "80"]

    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (
            json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")

    def _payload(self) -> dict[str, object]:
        return copy.deepcopy(self.base)

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=self._bytes(payload))

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None
            else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    def test_all_four_pilot_runs_replay_and_bind_exact_bytes(self) -> None:
        expected_prime_counts = {"5": 4, "9": 12}
        for (p, dps), payload in self.runs.items():
            with self.subTest(p=p, dps=dps):
                report = self._replay(payload)
                self.assertEqual(report["schema"], verifier.REPLAY_SCHEMA)
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(self._bytes(payload)).hexdigest(),
                )
                self.assertEqual(report["reconstructed"]["exact_fixture_groups"], 6)
                self.assertEqual(report["reconstructed"]["transcendental_interval_count"], 14)
                self.assertEqual(report["reconstructed"]["source_dependency_count"], 10)
                self.assertEqual(
                    report["reconstructed"]["prime_power_count"],
                    expected_prime_counts[p],
                )
                self.assertEqual(report["reconstructed"]["dyadic_layer_count"], 5)
                self.assertTrue(report["checks"]["formula_tree_independent"])
                self.assertFalse(report["checks"]["producer_booleans_trusted"])

    def test_inventory_and_deterministic_serialization(self) -> None:
        self.assertEqual(
            set(self.base),
            {
                "schema", "source_lock", "inputs", "terminal_state",
                "source_conventions", "claim_boundary", "certificate",
                "arithmetic_libraries",
            },
        )
        self.assertEqual(
            set(self.base["certificate"]),
            {
                "gauge_minimal_tail", "corrected_sparse_identity",
                "feature_quotient", "dyadic_povm", "odd_directional_reserve",
                "inclusive_prime_powers", "transcendental_intervals", "checks",
            },
        )
        self.assertEqual(len(self.base["certificate"]["checks"]), 18)
        self.assertTrue(all(self.base["certificate"]["checks"].values()))
        self.assertEqual(
            self._bytes(producer.produce("5", "80")),
            self._bytes(producer.produce("5", "80")),
        )

    def test_live_source_lock_and_dependency_inventory(self) -> None:
        lock_path = ROOT / producer.LOCK
        lock_hash = hashlib.sha256(lock_path.read_bytes()).hexdigest()
        self.assertEqual(lock_hash, verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(self.base["source_lock"]["sha256"], lock_hash)
        lock = json.loads(lock_path.read_text(encoding="utf-8"))
        self.assertEqual(
            lock["locked_conventions"]["input_limits"],
            "producer and verifier admit only lambda_numerator in {5,9} "
            "and dps in {80,160}; exact text membership is checked before "
            "integer conversion or interval initialization",
        )
        dependency_hashes = self.base["source_lock"]["dependency_hashes"]
        self.assertEqual(set(dependency_hashes), verifier.EXPECTED_DEPENDENCY_PATHS)
        self.assertEqual(len(dependency_hashes), 10)
        for relative, expected in dependency_hashes.items():
            with self.subTest(dependency=relative):
                self.assertEqual(
                    hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected
                )

    def test_all_serialized_intervals_nest_at_doubled_precision(self) -> None:
        for p in ("5", "9"):
            low = self.runs[p, "80"]
            high = self.runs[p, "160"]
            expected_r = 3 * int(p).bit_length()
            self.assertEqual(low["inputs"]["r_exact_integer"], expected_r)
            self.assertEqual(high["inputs"]["r_exact_integer"], expected_r)
            low_intervals = interval_inventory(
                low["certificate"]["transcendental_intervals"]
            )
            high_intervals = interval_inventory(
                high["certificate"]["transcendental_intervals"]
            )
            self.assertEqual(set(low_intervals), set(high_intervals))
            self.assertEqual(len(low_intervals), 33)
            for name in low_intervals:
                with self.subTest(p=p, interval=name):
                    low_raw = low_intervals[name]["dyadic"]
                    high_raw = high_intervals[name]["dyadic"]
                    low_lo = dyadic(low_raw["lower"])
                    low_hi = dyadic(low_raw["upper"])
                    high_lo = dyadic(high_raw["lower"])
                    high_hi = dyadic(high_raw["upper"])
                    self.assertLessEqual(low_lo, high_lo)
                    self.assertLessEqual(high_hi, low_hi)
            metadata = low["certificate"]["transcendental_intervals"]
            self.assertEqual(metadata["dyadic_layer_count_J"], 5)
            self.assertEqual(
                [item["certified_min_branch"] for item in metadata["dyadic_layer_coefficients"]],
                ["2^j*tau"] * 4 + ["A_star-2^j*tau"],
            )

    def test_inclusive_prime_powers_and_endpoint_mutations(self) -> None:
        expected = {
            "5": [2, 3, 4, 5],
            "9": [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
        }
        for p in ("5", "9"):
            case = self.runs[p, "80"]["certificate"]["inclusive_prime_powers"]
            inventory = case["inventory"]
            self.assertEqual([item["n"] for item in inventory], expected[p])
            self.assertTrue(all(4 * item["n"] <= int(p) ** 2 for item in inventory))
            self.assertEqual(case["prime_block_sign"], "minus")
            self.assertFalse(case["individual_prime_blocks_absolutized_in_level_sets"])
        self.assertEqual(
            producer._prime_power_inventory(4)[-1],
            {"n": 4, "prime_base": 2, "exponent": 2},
        )

        payload = self._payload()
        del payload["certificate"]["inclusive_prime_powers"]["inventory"][2]
        self._reject(payload, "prime")
        payload = self._payload()
        payload["certificate"]["inclusive_prime_powers"]["endpoint_rule"] = "n<lambda^2"
        self._reject(payload, "prime")
        payload = self._payload()
        payload["certificate"]["inclusive_prime_powers"]["lambda_squared_numerator"] = "5"
        self._reject(payload, "prime")
        payload = self._payload()
        payload["certificate"]["inclusive_prime_powers"]["prime_block_sign"] = "plus"
        self._reject(payload, "prime")

    def test_right_inverse_gauge_changes_tail_but_not_angle(self) -> None:
        case = self.base["certificate"]["gauge_minimal_tail"]["gauge_right_inverses"]
        self.assertEqual(case["T_B_0"], [[R(1)]])
        self.assertEqual(case["T_B_1"], [[R(1)]])
        self.assertEqual(
            [rational(value) for value in case["source_tail_squared_B_0_B_1"]],
            [Fraction(0), Fraction(1)],
        )
        self.assertEqual(rational(case["alpha_squared"]), 0)
        self.assertTrue(case["same_physical_angle_different_source_tails"])
        payload = self._payload()
        payload["certificate"]["gauge_minimal_tail"]["gauge_right_inverses"][
            "source_tail_squared_B_0_B_1"
        ][1] = R(0)
        self._reject(payload, "gauge")

    def test_minimal_tail_rank_obstruction(self) -> None:
        case = self.base["certificate"]["gauge_minimal_tail"][
            "minimal_tail_rank_obstruction"
        ]
        self.assertEqual(rational(case["alpha_squared"]), 1)
        self.assertEqual(rational(case["exact_minimal_tail_squared"]), Fraction(16, 25))
        self.assertEqual(rational(case["general_theorem_lower_squared"]), Fraction(8, 25))
        self.assertEqual(rational(case["exact_over_general_lower_ratio"]), 2)
        self.assertTrue(case["target_scale_impossible_from_rank_obstruction"])
        self.assertFalse(
            self.base["certificate"]["gauge_minimal_tail"]["actual_source_tail_claimed"]
        )
        payload = self._payload()
        payload["certificate"]["gauge_minimal_tail"][
            "minimal_tail_rank_obstruction"
        ]["target_scale_impossible_from_rank_obstruction"] = False
        self._reject(payload, "gauge")

    def test_corrected_sparse_tail_identity_retains_mean_correction(self) -> None:
        case = self.base["certificate"]["corrected_sparse_identity"]
        self.assertEqual(case["selected_zero_based_indices"], [0, 2])
        self.assertEqual(rational(case["s_selected_constant_mass"]), 10)
        self.assertEqual(rational(case["constant_inner_z"]), 0)
        self.assertEqual(rational(case["raw_omitted_norm_squared"]), 1)
        self.assertEqual(rational(case["mean_correction_numerator"]), 4)
        self.assertEqual(rational(case["mean_correction"]), Fraction(2, 5))
        self.assertEqual(rational(case["corrected_tail_squared"]), Fraction(7, 5))
        self.assertTrue(case["mean_correction_retained"])
        payload = self._payload()
        payload["certificate"]["corrected_sparse_identity"]["mean_correction"] = R(0)
        self._reject(payload, "corrected.sparse")

    def test_cross_gram_least_squares_and_graph_fixture(self) -> None:
        case = self.base["certificate"]["feature_quotient"]
        self.assertEqual(rational(case["cross_gram_U_star_W"]), Fraction(3, 5))
        self.assertEqual(rational(case["least_squares_minimizer_y"]), Fraction(3, 5))
        self.assertEqual(rational(case["least_squares_residual_squared"]), Fraction(16, 25))
        self.assertEqual(rational(case["intrinsic_alpha_squared"]), Fraction(16, 25))
        self.assertEqual(case["least_squares_residual_squared"], case["schur_complement_G_minus_cross_A_dagger_cross"])
        self.assertEqual(
            [rational(value) for value in case["graph_Z"]],
            [Fraction(1), Fraction(4, 3)],
        )
        self.assertEqual(rational(case["graph_beta_squared"]), Fraction(16, 9))
        self.assertEqual(
            rational(case["graph_beta_squared_over_one_plus_beta_squared"]),
            Fraction(16, 25),
        )
        self.assertTrue(case["W_equals_y_Z"])
        self.assertFalse(case["actual_feature_angle_claimed"])
        payload = self._payload()
        payload["certificate"]["feature_quotient"]["cross_gram_U_star_W"] = R(4, 5)
        self._reject(payload, "feature.quotient")

    def test_noncommuting_dyadic_povm_majorant(self) -> None:
        case = self.base["certificate"]["dyadic_povm"][
            "noncommuting_layer_majorant"
        ]
        self.assertEqual(case["POVM_sum"], [[R(1), R(0)], [R(0), R(1)]])
        self.assertEqual(case["majorant_minus_D"], case["POVM_A_2"])
        self.assertTrue(case["majorant_minus_D_equals_A_2"])
        self.assertEqual(
            case["C_1_C_4_commutator"],
            [[R(0), R(1, 32)], [R(-1, 32), R(0)]],
        )
        self.assertTrue(case["level_operators_noncommuting"])
        self.assertEqual(case["thresholds_s_j"], [R(1), R(2), R(4)])
        self.assertEqual(case["coefficients_c_j"], [R(1), R(2), R(4)])
        payload = self._payload()
        payload["certificate"]["dyadic_povm"]["noncommuting_layer_majorant"][
            "level_operators_noncommuting"
        ] = False
        self._reject(payload, "dyadic")

    def test_spectral_open_upper_and_closed_lower_endpoint(self) -> None:
        case = self.base["certificate"]["dyadic_povm"][
            "spectral_endpoint_rank_obstruction"
        ]
        self.assertEqual(rational(case["sigma"]), Fraction(1, 2))
        self.assertEqual(rational(case["upper_intrinsic_angle_squared"]), 0)
        self.assertEqual(rational(case["high_compression_at_sigma"]), Fraction(1, 2))
        self.assertEqual(rational(case["closed_intrinsic_angle_squared"]), 1)
        self.assertEqual(case["closed_projector_rank"], 2)
        self.assertEqual(case["K_dimension"], 1)
        self.assertEqual(case["rank_excess"], 1)
        self.assertTrue(case["closed_endpoint_mandatory"])
        self.assertFalse(self.base["certificate"]["dyadic_povm"]["actual_layer_capture_claimed"])
        payload = self._payload()
        payload["certificate"]["dyadic_povm"]["spectral_endpoint_rank_obstruction"][
            "lower_projector_F_closed_sigma_1"
        ] = [[R(0), R(0)], [R(0), R(1)]]
        self._reject(payload, "dyadic")

    def test_odd_directional_good_bad_and_scalar_remainder(self) -> None:
        case = self.base["certificate"]["odd_directional_reserve"]
        good, bad = case["good_orientation"], case["bad_orientation"]
        self.assertEqual(rational(case["q"]), 3)
        self.assertEqual(rational(case["h"]), 1)
        self.assertEqual(rational(case["gamma"]), Fraction(2, 3))
        self.assertEqual(rational(good["exact_load"]), Fraction(2, 3))
        self.assertEqual(
            [rational(value) for value in good["U_0_through_4"]],
            [Fraction(2), Fraction(2, 3), Fraction(2, 3), Fraction(2, 3), Fraction(2, 3)],
        )
        self.assertTrue(good["strict_pass"])
        self.assertEqual(rational(bad["exact_load"]), 2)
        self.assertEqual([rational(value) for value in bad["U_0_through_4"]], [Fraction(2)] * 5)
        self.assertFalse(bad["strict_pass"])
        scalar = case["scalar_remainder_regression"]
        self.assertEqual(rational(scalar["exact_load"]), 1)
        self.assertEqual(rational(scalar["U_1"]), Fraction(4, 3))
        self.assertEqual(rational(scalar["U_1_minus_load"]), Fraction(1, 3))
        self.assertFalse(case["actual_odd_reserve_claimed"])
        payload = self._payload()
        payload["certificate"]["odd_directional_reserve"]["bad_orientation"][
            "strict_pass"
        ] = True
        self._reject(payload, "odd.directional")

    def test_aligned_oblique_and_transverse_positive_excess(self) -> None:
        case = self.base["certificate"]["odd_directional_reserve"][
            "aligned_excess_orientation"
        ]
        aligned, oblique, transverse = (
            case["aligned"], case["oblique"], case["transverse"]
        )
        self.assertEqual(rational(aligned["exact_load"]), Fraction(2, 3))
        self.assertTrue(aligned["strict_pass"])
        self.assertEqual(rational(oblique["pole_axis_energy"]), Fraction(32, 25))
        self.assertTrue(oblique["necessary_axis_inequality"])
        self.assertEqual(rational(oblique["exact_load"]), Fraction(86, 75))
        self.assertEqual(rational(oblique["compensated_determinant"]), Fraction(-11, 25))
        self.assertFalse(oblique["strict_pass"])
        self.assertEqual(rational(transverse["exact_load"]), 2)
        self.assertFalse(transverse["strict_pass"])
        self.assertTrue(case["axis_necessity_not_sufficient"])
        self.assertTrue(case["spectrum_without_orientation_not_sufficient"])
        payload = self._payload()
        payload["certificate"]["odd_directional_reserve"][
            "aligned_excess_orientation"
        ]["oblique"]["exact_load"] = R(2, 3)
        self._reject(payload, "odd.directional")

    def test_optimal_moment_constant_fixtures_and_mutation(self) -> None:
        odd = self.base["certificate"]["odd_directional_reserve"]
        formula = odd["optimal_constant_formula"]
        self.assertEqual(formula["C_0"], "gamma")
        self.assertIn("max_", formula["C_k"])
        self.assertIn("sqrt", formula["x_k"])
        optimal = self.base["certificate"]["transcendental_intervals"][
            "optimal_remainder_constants_gamma_two_thirds"
        ]
        previous_upper: Fraction | None = None
        for key, order in (("k_1", 1), ("k_2", 2), ("k_4", 4)):
            item = optimal[key]
            self.assertEqual(item["k"], order)
            x_lo = dyadic(item["x_k"]["dyadic"]["lower"])
            x_hi = dyadic(item["x_k"]["dyadic"]["upper"])
            c_lo = dyadic(item["C_k_gamma"]["dyadic"]["lower"])
            c_hi = dyadic(item["C_k_gamma"]["dyadic"]["upper"])
            self.assertGreater(x_lo, 0)
            self.assertLess(x_hi, Fraction(2, 3))
            self.assertGreater(c_lo, 0)
            if previous_upper is not None:
                self.assertLess(c_hi, previous_upper)
            previous_upper = c_lo

        payload = self._payload()
        payload["certificate"]["transcendental_intervals"][
            "optimal_remainder_constants_gamma_two_thirds"
        ]["k_1"]["k"] = 2
        self._reject(payload, "optimal remainder")

    def test_source_convention_formula_and_admission_mutations_rejected(self) -> None:
        conventions = self.base["source_conventions"]["locked_conventions"]
        self.assertIn("exp(-i*t*x)", conventions["fourier_sign"])
        self.assertIn("n<=lambda^2", conventions["prime_endpoint"])
        self.assertIn("x->-x", conventions["inversion"])
        self.assertIn("-2*sum_", conventions["prime_sign"])
        for section in ("locked_conventions", "locked_formulas"):
            for key in self.base["source_conventions"][section]:
                with self.subTest(section=section, key=key):
                    payload = self._payload()
                    payload["source_conventions"][section][key] = "mutated"
                    self._reject(payload, "source convention")
        for key in self.base["claim_boundary"]["source_admissions"]:
            with self.subTest(admission=key):
                payload = self._payload()
                payload["claim_boundary"]["source_admissions"][key] = True
                self._reject(payload, "claim boundary")

    def test_terminal_and_claim_promotions_rejected(self) -> None:
        payload = self._payload()
        payload["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        self._reject(payload, "terminal")
        payload = self._payload()
        payload["claim_boundary"]["claim_class"] = "PROMOTED_CLAIM"
        self._reject(payload, "claim boundary")
        payload = self._payload()
        payload["certificate"]["transcendental_intervals"][
            "strict_threshold_supplied"
        ] = True
        self._reject(payload, "interval metadata")
        payload = self._payload()
        payload["certificate"]["transcendental_intervals"][
            "actual_angle_layer_or_odd_reserve_claimed"
        ] = True
        self._reject(payload, "interval metadata")

    def test_noncanonical_inputs_and_caps_before_interval_arithmetic(self) -> None:
        for p, dps in (
            ("05", "80"), ("5.0", "80"), ("4", "80"),
            ("5", "080"), ("5", "79"), (5, "80"),
        ):
            with self.subTest(path="producer", p=p, dps=dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, dps)
        huge = "9" * 10_000
        with mock.patch.object(
            producer, "int", create=True,
            side_effect=AssertionError("integer conversion reached"),
        ) as integer_conversion:
            with self.assertRaises(ValueError):
                producer._canonical_choice_text(
                    huge, "lambda numerator", producer.CANONICAL_LAMBDA_NUMERATORS
                )
            integer_conversion.assert_not_called()
        with mock.patch.object(
            verifier, "int", create=True,
            side_effect=AssertionError("integer conversion reached"),
        ) as integer_conversion:
            for value in ("6", huge):
                with self.subTest(path="verifier-pre-int-grid", value_length=len(value)):
                    with self.assertRaises(verifier.ReplayError):
                        verifier._canonical_input(
                            value, "lambda numerator", {5, 9}
                        )
            integer_conversion.assert_not_called()
        for p, dps in ((huge, "80"), ("5", "1001")):
            with self.subTest(path="producer-cap", p_length=len(p), dps=dps):
                with mock.patch.object(
                    producer, "_interval_probes",
                    side_effect=AssertionError("interval arithmetic reached"),
                ) as probes:
                    with self.assertRaises((TypeError, ValueError)):
                        producer.produce(p, dps)
                    probes.assert_not_called()
            with self.subTest(path="verifier-cap", p_length=len(p), dps=dps):
                payload = self._payload()
                payload["inputs"]["lambda_numerator_text"] = p
                payload["inputs"]["dps_text"] = dps
                with mock.patch.object(
                    verifier, "_interval_targets",
                    side_effect=AssertionError("interval arithmetic reached"),
                ) as targets:
                    with self.assertRaisesRegex(verifier.ReplayError, r"(?i)maximum"):
                        self._replay(payload)
                    targets.assert_not_called()

    def test_runtime_mismatch_fails_before_interval_use(self) -> None:
        with (
            mock.patch.object(producer.mp, "__version__", "0.0.0"),
            mock.patch.object(
                producer, "_interval_probes",
                side_effect=AssertionError("interval arithmetic reached"),
            ) as probes,
        ):
            with self.assertRaisesRegex(RuntimeError, r"(?i)(mpmath|runtime|version)"):
                producer.produce("5", "80")
            probes.assert_not_called()
        with (
            mock.patch.object(verifier.mp, "__version__", "0.0.0"),
            mock.patch.object(
                verifier, "_interval_targets",
                side_effect=AssertionError("interval arithmetic reached"),
            ) as targets,
        ):
            with self.assertRaisesRegex(verifier.ReplayError, r"(?i)(mpmath|runtime|version)"):
                self._replay(self._payload())
            targets.assert_not_called()

    def test_strict_json_binary64_duplicates_and_byte_binding(self) -> None:
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads('{"x": 0.5}', "binary64 fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier._strict_json_loads('{"x": 1, "x": 2}', "duplicate fixture")
        payload = self._payload()
        payload["certificate"]["checks"]["prime_power_endpoint_inclusive"] = 1.0
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            self._replay(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "canonical"):
            verifier.replay(
                self.base,
                producer_bytes=self._bytes(self.base) + b" ",
            )

    def test_interval_reversal_and_excessive_width_rejected(self) -> None:
        payload = self._payload()
        interval = payload["certificate"]["transcendental_intervals"]["values"][
            "physical_length_L"
        ]
        interval["dyadic"]["lower"], interval["dyadic"]["upper"] = (
            interval["dyadic"]["upper"], interval["dyadic"]["lower"]
        )
        interval["decimal"][0], interval["decimal"][1] = (
            interval["decimal"][1], interval["decimal"][0]
        )
        self._reject(payload, "reversed")

        payload = self._payload()
        interval = payload["certificate"]["transcendental_intervals"]["values"][
            "physical_length_L"
        ]
        interval["dyadic"]["lower"] = [0, "0", 0, 0]
        interval["dyadic"]["upper"] = [0, "1", 3, 1]
        interval["decimal"] = ["0.0", "8.0"]
        self._reject(payload, "excessively wide")

    def test_live_source_lock_and_dependency_mutations_detected(self) -> None:
        with mock.patch.object(verifier, "EXPECTED_SOURCE_LOCK_SHA256", "0" * 64):
            with self.assertRaisesRegex(verifier.ReplayError, "source-lock hash"):
                self._replay(self._payload())

        original_sha256 = producer._sha256

        def mutated_dependency_hash(path: Path) -> str:
            if path.name == "DIRECT_RH_ATTACK.md":
                return "0" * 64
            return original_sha256(path)

        with (
            mock.patch.object(producer, "_sha256", side_effect=mutated_dependency_hash),
            mock.patch.object(
                producer, "_interval_probes",
                side_effect=AssertionError("interval arithmetic reached"),
            ) as probes,
        ):
            with self.assertRaisesRegex(ValueError, "dependency hash"):
                producer.produce("5", "80")
            probes.assert_not_called()

    def test_no_environment_access_import_independence_and_shared_limit(self) -> None:
        producer_path = ROOT / "src" / "intrinsic_feature_dyadic_defect.py"
        verifier_path = ROOT / "verifier" / "intrinsic_feature_dyadic_defect_replay.py"
        for path in (producer_path, verifier_path):
            with self.subTest(path=path.name):
                self.assertEqual(
                    secret_ast_findings(path.read_text(encoding="utf-8")),
                    (set(), set()),
                )
        verifier_source = verifier_path.read_text(encoding="utf-8")
        tree = ast.parse(verifier_source)
        imports = {
            alias.name
            for node in ast.walk(tree)
            if isinstance(node, ast.Import)
            for alias in node.names
        }
        imports.update(
            node.module
            for node in ast.walk(tree)
            if isinstance(node, ast.ImportFrom) and node.module
        )
        self.assertNotIn("intrinsic_feature_dyadic_defect", imports)
        libraries = self.base["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertTrue(libraries["independent_formula_trees_required"])
        self.assertIn("mpmath.iv", libraries["independence_limitation"])
        self.assertEqual(libraries, verifier.ARITHMETIC_LIBRARIES)


if __name__ == "__main__":
    unittest.main()
