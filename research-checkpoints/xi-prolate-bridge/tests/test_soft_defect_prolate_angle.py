from __future__ import annotations

import ast
import copy
import hashlib
import json
from pathlib import Path
import re
import sys
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import soft_defect_prolate_angle as producer  # noqa: E402
from verifier import soft_defect_prolate_angle_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


def interval_records(value: object, path: tuple[object, ...] = ()) -> dict[tuple[object, ...], object]:
    if isinstance(value, dict):
        if set(value) == {"decimal", "dyadic"}:
            return {path: value}
        result: dict[tuple[object, ...], object] = {}
        for key, child in value.items():
            result.update(interval_records(child, path + (key,)))
        return result
    if isinstance(value, list):
        result = {}
        for index, child in enumerate(value):
            result.update(interval_records(child, path + (index,)))
        return result
    return {}


class SoftDefectProlateAngleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.fake_binding = {
            "path": producer.LOCK,
            "sha256": "1" * 64,
            "schema": producer.LOCK_SCHEMA,
            "dependency_hashes": {path: "2" * 64 for path in sorted(producer.EXPECTED_DEPENDENCIES)},
        }
        cls.fake_lock = {
            "schema": producer.LOCK_SCHEMA,
            "claim_class": producer.CLAIM_CLASS,
            "terminal_state": producer.TERMINAL_STATE,
            "updated_date": producer.UPDATED_DATE,
            "external_sources": [],
            "dependencies": [],
            "locked_conventions": copy.deepcopy(producer.LOCKED_CONVENTIONS),
            "locked_formulas": copy.deepcopy(producer.LOCKED_FORMULAS),
            "claim_boundary": copy.deepcopy(producer.CLAIM_SCOPE),
            "source_admissions": copy.deepcopy(producer.SOURCE_ADMISSIONS),
        }
        cls.runs = {}
        with mock.patch.object(producer, "_validated_source_lock", return_value=cls.fake_binding):
            for p in ("5", "9"):
                for dps in ("80", "160"):
                    cls.runs[p, dps] = producer.produce(p, dps)
        cls.base80 = cls.runs["5", "80"]
        cls.base160 = cls.runs["5", "160"]

    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")

    def _payload(self) -> dict[str, object]:
        return copy.deepcopy(self.base80)

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        with mock.patch.object(
            verifier, "_validate_source_lock", return_value=(self.fake_binding, self.fake_lock)
        ):
            return verifier.replay(payload, producer_bytes=self._bytes(payload))

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    def test_all_four_deterministic_formula_runs_replay(self) -> None:
        for p in ("5", "9"):
            for dps in ("80", "160"):
                with self.subTest(p=p, dps=dps):
                    payload = self.runs[p, dps]
                    report = self._replay(payload)
                    self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                    self.assertEqual(report["reconstructed"]["transcendental_interval_count"], 24)
                    self.assertTrue(report["checks"]["formula_tree_independent"])
                    self.assertFalse(report["checks"]["producer_booleans_trusted"])
                    self.assertEqual(
                        report["producer_binding"]["sha256"],
                        hashlib.sha256(self._bytes(payload)).hexdigest(),
                    )

    def test_schema_inventory_and_shared_library_limitation(self) -> None:
        self.assertEqual(
            set(self.base80),
            {"schema", "source_lock", "inputs", "terminal_state", "source_conventions",
             "claim_boundary", "certificate", "arithmetic_libraries"},
        )
        self.assertEqual(
            set(self.base80["certificate"]),
            {"ideal_clipped_defect", "source_soft_and_leverage", "capped_odd_rank_one",
             "principal_angle_coframe", "augmented_determinant",
             "transcendental_intervals", "checks"},
        )
        report = self._replay(self._payload())
        self.assertTrue(report["arithmetic_libraries"]["shared_library_with_verifier"])
        self.assertIn("mpmath.iv", report["arithmetic_libraries"]["independence_limitation"])

    def test_all_24_intervals_nest_at_doubled_precision(self) -> None:
        for p in ("5", "9"):
            low = interval_records(self.runs[p, "80"]["certificate"])
            high = interval_records(self.runs[p, "160"]["certificate"])
            self.assertEqual(set(low), set(high))
            self.assertEqual(len(low), 24)
            for path in sorted(low, key=str):
                with self.subTest(p=p, path=path):
                    lo80, hi80 = verifier._submitted_interval(low[path], "d80", 80)
                    lo160, hi160 = verifier._submitted_interval(high[path], "d160", 160)
                    self.assertLessEqual(lo80, lo160)
                    self.assertLessEqual(hi160, hi80)

    def test_ideal_clip_sharpness_equality_and_outlier_invariance(self) -> None:
        model = self.base80["certificate"]["ideal_clipped_defect"]
        boundary = model["boundary_equality_rejected"]
        strict = model["strict_order_model"]
        reference = model["positive_outlier_reference"]
        outlier = model["positive_outlier_raised_to_500"]
        self.assertEqual(model["r_star"], 2)
        self.assertEqual(model["least_integer_strict_order"], 3)
        self.assertEqual(boundary["actual_minimum"], R(1))
        self.assertFalse(boundary["strict_target_power_test"])
        self.assertFalse(boundary["strict_pass"])
        self.assertTrue(strict["strict_target_power_test"])
        self.assertEqual(reference["clipped_defect_diagonal"], outlier["clipped_defect_diagonal"])
        self.assertEqual(reference["trace_clipped_defect_power"], outlier["trace_clipped_defect_power"])
        self.assertFalse(model["upper_bound_A_le_M_assumed"])

    def test_source_soft_leverage_and_scalar_sharpness(self) -> None:
        source = self.base80["certificate"]["source_soft_and_leverage"]
        block = source["noncommuting_soft_block"]
        leverage = source["leverage_excess_orientation"]
        scalar = source["sharp_scalar_excess_moment"]
        self.assertEqual(block["B_plus_without_pole"], [[R(2), R(1)], [R(1), R(6)]])
        self.assertNotEqual(block["commutator_Ta_Tv"], [[R(0), R(0)], [R(0), R(0)]])
        self.assertEqual(leverage["captured_excess_trace"], R(0))
        self.assertEqual(leverage["rotated_excess_trace"], R(16, 5))
        self.assertEqual(leverage["rotated_scalar_lower_bound"], R(-1, 5))
        self.assertEqual(leverage["rotated_true_minimum_on_H"], R(4, 25))
        self.assertEqual(scalar["sharp_constant"], R(1, 27))
        self.assertEqual(scalar["constant_times_x_power"], R(1))
        self.assertEqual(
            scalar["factorization_coefficients_low_to_high"],
            [R(2), R(-1), R(0), R(1, 27)],
        )
        self.assertTrue(scalar["equality_is_sharp_not_strict"])

    def test_capped_odd_identity_reserve_and_load_one_rejection(self) -> None:
        odd = self.base80["certificate"]["capped_odd_rank_one"]
        strict = odd["strict_reserve_model"]
        equality = odd["load_one_equality_rejection"]
        self.assertEqual(strict["mu0_norm_p_squared"], R(1, 2))
        self.assertEqual(strict["rho1_p_R_p"], R(3, 4))
        self.assertEqual(strict["chi"], R(0))
        self.assertEqual(strict["load_direct"], R(7, 20))
        self.assertEqual(strict["load_from_capped_identity"], R(7, 20))
        self.assertTrue(all(verifier._parse_rational(x, "minor") > 0 for x in strict["reserve_principal_minors"]))
        self.assertEqual(equality["load"], R(1))
        self.assertEqual(equality["determinant"], R(0))
        self.assertFalse(equality["strict_pass"])

    def test_principal_angle_fixture_and_mandatory_source_gram(self) -> None:
        angle = self.base80["certificate"]["principal_angle_coframe"]
        self.assertEqual(angle["s_norm_P_E_one_squared"], R(3))
        self.assertEqual(angle["factor_2lambda_over_s"], R(4, 3))
        self.assertEqual(angle["raw_E_tail_operator_norm"], R(1, 2))
        self.assertEqual(angle["raw_E_tail_determinant"], R(0))
        self.assertTrue(angle["raw_E_tail_is_positive_rank_one"])
        self.assertEqual(angle["Theta"], R(2, 3))
        self.assertEqual(angle["source_gram_B"], [[R(2), R(1)], [R(1), R(2)]])
        self.assertEqual(angle["whitened_volume_direct"], R(1, 3))
        self.assertEqual(angle["whitened_volume_from_determinants"], R(1, 3))
        self.assertEqual(angle["angle_lower_bound_one_minus_Theta_power_dimX"], R(1, 9))
        self.assertFalse(angle["matched_prolate_coframe_inferred"])

    def test_augmented_column_operations_and_odd_sign(self) -> None:
        augmented = self.base80["certificate"]["augmented_determinant"]
        two = augmented["dimension_N_2"]
        one = augmented["dimension_N_1_sign_regression"]
        self.assertEqual(two["raw_determinant"], R(16))
        self.assertEqual(two["plus_corrected_determinant"], R(8))
        self.assertEqual(two["odd_sign_factor_minus_one_power_N"], R(1))
        self.assertEqual(two["odd_corrected_determinant"], R(8))
        self.assertEqual(one["odd_sign_factor_minus_one_power_N"], R(-1))
        self.assertEqual(one["odd_corrected_scalar"], R(-5, 2))

    def test_projection_and_central_formula_boundaries(self) -> None:
        intervals = self.base80["certificate"]["transcendental_intervals"]
        projection = intervals["sqrt_projection_schedule"]
        schedule = intervals["central_outlier_schedule_diagnostic"]
        probe = intervals["central_formula_scale_probe"]
        self.assertEqual(projection["N"], 2)
        self.assertEqual(projection["C_K_safe_input_fraction_text"], "6006/1000")
        self.assertEqual(projection["C_K_safe_rational"], R(3003, 500))
        self.assertFalse(projection["signed_residual_or_coframe_transfer_claimed"])
        self.assertEqual(schedule["PNT_A_exact_decimal"], "9.22022")
        self.assertEqual(schedule["PNT_alpha_exact_decimal"], "0.8476836")
        self.assertTrue(schedule["finite_diagnostic_only"])
        self.assertFalse(schedule["positive_signed_floor_claimed"])
        self.assertTrue(probe["epsilon_strictly_below_one"])
        self.assertTrue(probe["V_L_strictly_positive"])
        self.assertTrue(probe["formula_scale_regression_only"])
        self.assertFalse(probe["finite_prolate_or_Weil_certificate"])
        self.assertFalse(probe["schedule_datum"])

    def test_equality_factor_gram_and_sign_mutations_are_rejected(self) -> None:
        mutations: list[dict[str, object]] = []
        payload = self._payload()
        payload["certificate"]["ideal_clipped_defect"]["boundary_equality_rejected"]["strict_pass"] = True
        mutations.append(payload)
        payload = self._payload()
        payload["certificate"]["capped_odd_rank_one"]["load_one_equality_rejection"]["strict_pass"] = True
        mutations.append(payload)
        payload = self._payload()
        payload["certificate"]["principal_angle_coframe"]["factor_2lambda_over_s"] = R(3, 4)
        mutations.append(payload)
        payload = self._payload()
        payload["certificate"]["principal_angle_coframe"]["source_gram_B"] = [[R(1), R(0)], [R(0), R(1)]]
        mutations.append(payload)
        payload = self._payload()
        payload["certificate"]["augmented_determinant"]["dimension_N_1_sign_regression"]["odd_sign_factor_minus_one_power_N"] = R(1)
        mutations.append(payload)
        payload = self._payload()
        payload["certificate"]["source_soft_and_leverage"]["sharp_scalar_excess_moment"]["sharp_constant"] = R(1, 28)
        mutations.append(payload)
        payload = self._payload()
        payload["certificate"]["source_soft_and_leverage"]["sharp_scalar_excess_moment"]["factorization_coefficients_low_to_high"][1] = R(-3)
        mutations.append(payload)
        for index, payload in enumerate(mutations):
            with self.subTest(index=index):
                self._reject(payload)

    def test_locked_fourier_prime_endpoint_sign_and_inversion_are_rejected(self) -> None:
        replacements = {
            "fourier_sign": "fhat(t)=integral f(x)*exp(+i*t*x)dx",
            "prime_endpoint": "prime powers n<lambda^2 only",
            "prime_sign": "m_lambda=2*theta_prime+2*sum prime terms",
            "inversion": "Fourier residue parity is inversion parity",
            "source_gram": "replace every source Gram by identity",
        }
        for key, replacement in replacements.items():
            with self.subTest(key=key):
                payload = self._payload()
                payload["source_conventions"]["locked_conventions"][key] = replacement
                self._reject(payload, "source_conventions")

    def test_every_forbidden_source_admission_and_claim_promotion_is_rejected(self) -> None:
        admissions = self.base80["claim_boundary"]["source_admissions"]
        self.assertTrue(admissions)
        self.assertFalse(any(admissions.values()))
        for key in admissions:
            with self.subTest(admission=key):
                payload = self._payload()
                payload["claim_boundary"]["source_admissions"][key] = True
                self._reject(payload)
        for key in ("RH_PROVED", "determinant_limit_claimed", "physical_coframe_claimed"):
            with self.subTest(promotion=key):
                payload = self._payload()
                payload["certificate"][key] = True
                self._reject(payload)

    def test_interval_mutations_and_untrusted_booleans_are_rejected(self) -> None:
        payload = self._payload()
        item = payload["certificate"]["transcendental_intervals"]["band_energies_delta_1"]["b_plus"]
        item["dyadic"]["lower"], item["dyadic"]["upper"] = item["dyadic"]["upper"], item["dyadic"]["lower"]
        self._reject(payload, "reversed")

        payload = self._payload()
        item = payload["certificate"]["transcendental_intervals"]["sqrt_projection_schedule"]["ell_log_lambda"]
        item["decimal"][0] = "0"
        self._reject(payload, "decimal text")

        payload = self._payload()
        payload["certificate"]["transcendental_intervals"]["central_formula_scale_probe"]["V_L_strictly_positive"] = False
        self._reject(payload)

        payload = self._payload()
        payload["certificate"]["checks"]["source_gram_retained"] = False
        self._reject(payload)

    def test_verifier_derives_strict_interval_booleans_from_endpoints(self) -> None:
        targets = verifier._interval_targets(5, 80)
        verifier._validate_interval_semantics(targets)

        bad_band = verifier._interval_targets(5, 80)
        bad_band["band_energies_delta_1"]["b_plus"] = verifier._IntervalTarget(
            verifier.mp.iv.mpf((-1, 1))
        )
        with self.assertRaisesRegex(verifier.ReplayError, "band energies"):
            verifier._validate_interval_semantics(bad_band)

        bad_probe = verifier._interval_targets(5, 80)
        bad_probe["central_formula_scale_probe"]["epsilon_L"] = verifier._IntervalTarget(
            verifier.mp.iv.mpf((1, 2))
        )
        with self.assertRaisesRegex(verifier.ReplayError, "central probe"):
            verifier._validate_interval_semantics(bad_probe)

    def test_binary64_duplicate_keys_strict_text_and_exact_byte_binding(self) -> None:
        payload = self._payload()
        payload["inputs"]["lambda_numerator_text"] = 5.0
        self._reject(payload, "binary64")
        payload = self._payload()
        payload["inputs"]["lambda_numerator_text"] = "05"
        self._reject(payload, "canonical positive integer text")
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads('{"x": 0.5}', "float fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier._strict_json_loads('{"x": 1, "x": 2}', "duplicate fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            with mock.patch.object(
                verifier, "_validate_source_lock", return_value=(self.fake_binding, self.fake_lock)
            ):
                verifier.replay(self._payload())
        with self.assertRaisesRegex(verifier.ReplayError, "do not decode exactly"):
            with mock.patch.object(
                verifier, "_validate_source_lock", return_value=(self.fake_binding, self.fake_lock)
            ):
                verifier.replay(self._payload(), producer_bytes=self._bytes(self.base160))

    def test_input_caps_precede_transcendental_reconstruction(self) -> None:
        payload = self._payload()
        payload["inputs"]["lambda_numerator_text"] = "1001"
        with mock.patch.object(verifier, "_interval_targets", side_effect=AssertionError("must not run")):
            self._reject(payload, "lambda numerator exceeds")
        payload = self._payload()
        payload["inputs"]["dps_text"] = "10001"
        with mock.patch.object(verifier, "_interval_targets", side_effect=AssertionError("must not run")):
            self._reject(payload, "dps exceeds")

    def test_verifier_imports_no_producer_and_code_reads_no_environment_or_api_key(self) -> None:
        producer_path = ROOT / "src" / "soft_defect_prolate_angle.py"
        verifier_path = ROOT / "verifier" / "soft_defect_prolate_angle_replay.py"
        verifier_source = verifier_path.read_text(encoding="utf-8")
        tree = ast.parse(verifier_source)
        imported = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.append(node.module)
        self.assertFalse(any("soft_defect_prolate_angle" in name for name in imported))
        for path in (producer_path, verifier_path):
            source = path.read_text(encoding="utf-8")
            self.assertNotRegex(source, r"\bos\.environ\b|\bgetenv\s*\(|dotenv|API_KEY")

    def test_source_lock_placeholder_fails_closed_or_final_hash_validates(self) -> None:
        if re.fullmatch(r"[0-9a-f]{64}", verifier.EXPECTED_SOURCE_LOCK_SHA256):
            binding, _ = verifier._validate_source_lock(ROOT)
            self.assertEqual(binding["sha256"], verifier.EXPECTED_SOURCE_LOCK_SHA256)
            return
        with self.assertRaisesRegex(verifier.ReplayError, "placeholder has not been pinned"):
            verifier._validate_source_lock(ROOT)


class SoftDefectRealSourceLockIntegrationTests(unittest.TestCase):
    def test_real_source_lock_hash_and_dependencies_when_finalized(self) -> None:
        lock_path = ROOT / producer.LOCK
        if (
            not lock_path.exists()
            or re.fullmatch(r"[0-9a-f]{64}", verifier.EXPECTED_SOURCE_LOCK_SHA256) is None
        ):
            self.skipTest("source lock is intentionally not finalized yet")
        binding, lock = verifier._validate_source_lock(ROOT)
        self.assertEqual(binding["sha256"], verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(set(binding["dependency_hashes"]), verifier.EXPECTED_DEPENDENCY_PATHS)
        self.assertEqual(lock["locked_conventions"], producer.LOCKED_CONVENTIONS)
        self.assertEqual(lock["locked_formulas"], producer.LOCKED_FORMULAS)
        self.assertEqual(lock["claim_boundary"], producer.CLAIM_SCOPE)
        self.assertEqual(lock["source_admissions"], producer.SOURCE_ADMISSIONS)


if __name__ == "__main__":
    unittest.main()
