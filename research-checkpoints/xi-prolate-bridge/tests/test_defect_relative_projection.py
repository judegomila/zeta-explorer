import copy
from fractions import Fraction
import json
from pathlib import Path
import tempfile
import unittest

import mpmath as mp

from defect_relative_projection import (
    LOCKED_CLAIM_CLASS,
    LOCKED_SCHEDULE_K,
    SOURCE_GZIP_SHA256,
    SOURCE_LOCK_SHA256,
    SOURCE_TEX_SHA256,
    defect_relative_projection_bound,
    exponent_margin_interval,
    require_locked_formulas,
    require_locked_schedule_multiplier,
    serialize_bound,
    validate_source_lock_payload,
    verify_source_pin,
)
from verifier.defect_relative_projection_replay import replay_artifact


ROOT = Path(__file__).resolve().parents[1]


class DefectRelativeProjectionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bound = defect_relative_projection_bound(2, 60)
        cls.payload = serialize_bound(cls.bound)

    def replay_payload(self, payload, dps=80):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "producer.json"
            path.write_text(json.dumps(payload), encoding="utf-8")
            return replay_artifact(path, dps)

    def test_locked_schedule_and_relative_bounds(self):
        bound = self.bound
        self.assertEqual(bound.j, 2)
        self.assertEqual(bound.lambda_exact, Fraction(5, 2))
        self.assertEqual(bound.lambda_decimal, "2.5")
        self.assertEqual(bound.schedule_K, LOCKED_SCHEDULE_K)
        self.assertEqual(bound.schedule_exponent, 60000)
        with mp.workdps(100):
            self.assertGreater(bound.exponent_margin.lower(), 17)
            self.assertLess(bound.total_relative_bound.upper(), mp.mpf("1.4e-40"))
            self.assertGreater(bound.log_weight_factor.lower(), 200)
            self.assertLess(
                bound.log_weighted_relative_bound.upper(), mp.mpf("3e-38")
            )
            self.assertLess(bound.lambda2_uniform_relative_guard.upper(), 1)
            self.assertLess(bound.lambda2_uniform_log_weighted_guard.upper(), 1)

    def test_exact_K_threshold_2387_unsafe_2388_first_safe(self):
        unsafe = exponent_margin_interval(2387, 70)
        first_safe = exponent_margin_interval(2388, 70)
        with mp.workdps(100):
            self.assertLess(unsafe.upper(), 0)
            self.assertGreater(first_safe.lower(), 0)
        with self.assertRaisesRegex(ValueError, "no positive"):
            require_locked_schedule_multiplier(2387, 70)
        with self.assertRaisesRegex(ValueError, "locked value"):
            require_locked_schedule_multiplier(2388, 70)
        require_locked_schedule_multiplier(2400, 70)

    def test_binary64_and_subthreshold_schedule_inputs_are_rejected(self):
        for j in (2.0, mp.mpf(2), True):
            with self.subTest(j=repr(j)):
                with self.assertRaises(TypeError):
                    defect_relative_projection_bound(j, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            defect_relative_projection_bound(2, 60.0)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            require_locked_schedule_multiplier(2400.0, 60)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            defect_relative_projection_bound(1, 60)

    def test_formula_mutations_fail_closed(self):
        mutations = (
            {"fourier": "F_minus(f)(xi)=integral f(x)*exp(-2*pi*i*x*xi) dx"},
            {"c_map": "c=2*pi*lambda"},
            {"concentration": "Lambda_n(c)=chi_n(lambda); d_n=1-chi_n(lambda)"},
            {"log_interval": "[-2*log(lambda),2*log(lambda)]"},
            {"evenization": "K_n(t)=E(h_n)(exp(t))"},
            {"basis": "L^(-1/2)*exp(-2*pi*i*m*(t+log(lambda))/L)"},
            {"ls_thickness": "omega=R\\[-lambda,lambda]; gamma=1/2; rho=2*lambda"},
            {"ls_energy": "E=lambda^2"},
            {"ls_base": "48"},
            {"ls_exponent": "5+(160*pi/log(2))*lambda^2"},
            {"defect_lower": "6*96^(-5-(320*pi/log(2))*lambda)"},
            {"periodic_bv_tail": "sqrt(L)*TV/(pi*N)"},
            {"log_weighted_tail": "unspecified O(1)"},
            {"schedule": "lambda_j=j+1/2; N_j=2^(8*(2*j+1)^2)"},
            {"source_combination": "unit_norm_h_lambda"},
        )
        for mutation in mutations:
            with self.subTest(mutation=mutation):
                with self.assertRaises(ValueError):
                    require_locked_formulas(**mutation)

    def test_source_lock_bytes_and_all_dependency_bytes_are_hashed(self):
        pin = verify_source_pin()
        self.assertEqual(pin["source_lock_sha256"], SOURCE_LOCK_SHA256)
        self.assertEqual(pin["gzip_sha256"], SOURCE_GZIP_SHA256)
        self.assertEqual(pin["uncompressed_tex_sha256"], SOURCE_TEX_SHA256)
        self.assertEqual(len(pin["pinned_dependency_sha256"]), 3)
        lock = json.loads(
            (ROOT / "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json").read_text()
        )
        validate_source_lock_payload(lock)

    def test_source_lock_inventory_and_semantic_mutations_are_rejected(self):
        original = json.loads(
            (ROOT / "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json").read_text()
        )
        mutations = []

        payload = copy.deepcopy(original)
        payload["unexpected"] = True
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["locked_project_conventions"]["prolate_parameter"] = (
            "c=2*pi*lambda"
        )
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["locked_logvinenko_sereda_insertion"]["theorem_base"] = "48"
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["locked_diagonal_schedule"]["unsafe_integer_K_ceiling"] = 2388
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["claim_boundary"]["not_proved"].remove(
            "O-P or P-P signed-distribution correlation bounds"
        )
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["existing_pinned_dependencies"].append("ignored non-dict")
        mutations.append(payload)

        for index, payload in enumerate(mutations):
            with self.subTest(index=index):
                with self.assertRaises(ValueError):
                    validate_source_lock_payload(payload)

    def test_independent_replay_reconstructs_every_interval(self):
        report = self.replay_payload(self.payload)
        self.assertTrue(report["replay_agrees"])
        self.assertTrue(all(report["interval_overlap"].values()))
        self.assertTrue(
            report["independent_checks"]["log_weighted_relative_bound_below_one"]
        )
        self.assertIn("both use mpmath.iv", report["arithmetic_library_limitation"])

    def test_replay_rejects_binary64_formula_schedule_source_and_claim_mutations(self):
        mutations = []

        payload = copy.deepcopy(self.payload)
        payload["inputs"]["j"] = 2.0
        mutations.append((payload, TypeError))

        payload = copy.deepcopy(self.payload)
        payload["inputs"]["lambda_decimal"] = 2.5
        mutations.append((payload, TypeError))

        payload = copy.deepcopy(self.payload)
        payload["locked_formulas"]["c_map"] = "c=2*pi*lambda"
        mutations.append((payload, ValueError))

        payload = copy.deepcopy(self.payload)
        payload["exact_schedule"]["K"] = 2387
        mutations.append((payload, ValueError))

        payload = copy.deepcopy(self.payload)
        payload["exact_schedule"]["power_of_two_exponent"] = 30000
        mutations.append((payload, ValueError))

        payload = copy.deepcopy(self.payload)
        payload["source_pin"]["gzip_sha256"] = "0" * 64
        mutations.append((payload, ValueError))

        payload = copy.deepcopy(self.payload)
        payload["claims"]["signed_O_P_or_P_P_form_control"] = True
        mutations.append((payload, ValueError))

        payload = copy.deepcopy(self.payload)
        payload["outward_intervals"]["positive_exponent_margin"]["decimal"][0] = 17.0
        mutations.append((payload, TypeError))

        for index, (payload, exception) in enumerate(mutations):
            with self.subTest(index=index):
                with self.assertRaises(exception):
                    self.replay_payload(payload)

    def test_nonoverlapping_exact_dyadic_interval_cannot_pass(self):
        payload = copy.deepcopy(self.payload)
        interval = payload["outward_intervals"][
            "total_projection_over_sqrt_defect"
        ]
        interval["dyadic"] = {
            "lower": [0, "1", 0, 1],
            "upper": [0, "1", 0, 1],
        }
        interval["decimal"] = ["1.0", "1.0"]
        # mpmath renders an exact one as "1.0" at fixed significant digits.
        report = self.replay_payload(payload)
        self.assertFalse(
            report["interval_overlap"]["total_projection_over_sqrt_defect"]
        )
        self.assertFalse(report["replay_agrees"])

    def test_claim_class_and_terminal_state_remain_narrow(self):
        self.assertEqual(self.payload["claim_class"], LOCKED_CLAIM_CLASS)
        self.assertEqual(self.payload["terminal_state"], "P0_INVALIDATED")
        self.assertTrue(
            self.payload["claims"][
                "defect_relative_log_weighted_projection_for_modes_0_and_4"
            ]
        )
        self.assertFalse(self.payload["claims"]["full_residual_gap_scaling"])
        self.assertFalse(
            self.payload["claims"]["locally_uniform_determinant_convergence"]
        )


if __name__ == "__main__":
    unittest.main()
