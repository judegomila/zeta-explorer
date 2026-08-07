from __future__ import annotations

import copy
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from full_exterior_sampling_fallback import (  # noqa: E402
    EXPECTED_DEPENDENCIES,
    _serialize,
    fallback_report,
    validate_source_lock_payload,
    verify_source_lock,
)
from full_exterior_sampling_fallback_replay import (  # noqa: E402
    ReplayError,
    _parse_interval,
    replay_artifact,
)


class FullExteriorSamplingFallbackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 100
        cls.report80 = fallback_report(5, 2, 24, 80)
        cls.artifact80 = json.loads(
            json.dumps(_serialize(cls.report80, 80))
        )

    def test_source_lock_has_complete_exact_dependency_inventory(self) -> None:
        payload = verify_source_lock()
        supplied = {
            item["path"]: item["sha256"] for item in payload["dependencies"]
        }
        self.assertEqual(supplied, EXPECTED_DEPENDENCIES)
        self.assertEqual(len(supplied), 10)
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertIn(
            "the target-scale estimate C_ext*M=O(1/d_8)",
            payload["claim_boundary"]["not_proved"],
        )

    def test_source_lock_rejects_fourier_sign_and_measure_mutations(self) -> None:
        original = json.loads(
            (ROOT / "FULL_EXTERIOR_SAMPLING_SOURCE_LOCK.json").read_text()
        )
        mutations: list[dict[str, object]] = []

        payload = copy.deepcopy(original)
        payload["locked_conventions"]["angular_transform"] = (
            "F(z)=integral_R f(t)*exp(+i*z*t) dt"
        )
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["locked_conventions"]["physical_domain"] = (
            "I_lambda=[1/lambda,lambda] with measure du"
        )
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["locked_conventions"]["paired_sampling"] = (
            "sum_rho abs(F(s_rho))^2"
        )
        mutations.append(payload)

        payload = copy.deepcopy(original)
        payload["locked_formulas"]["all_index_floor"] = "d_LS=unspecified O(1)"
        mutations.append(payload)

        for index, payload in enumerate(mutations):
            with self.subTest(index=index):
                with self.assertRaises(ValueError):
                    validate_source_lock_payload(payload, ROOT)

    def test_exact_input_boundary_rejects_binary64_and_bad_domain(self) -> None:
        bad_calls = (
            (5.0, 2, 24, 80),
            (5, 2.0, 24, 80),
            (5, 2, 24.0, 80),
            (5, 2, 24, 80.0),
        )
        for arguments in bad_calls:
            with self.subTest(arguments=arguments):
                with self.assertRaises(TypeError):
                    fallback_report(*arguments)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            fallback_report(3, 2, 24, 80)
        with self.assertRaises(ValueError):
            fallback_report(5, 0, 24, 80)
        with self.assertRaises(ValueError):
            fallback_report(5, 2, -1, 80)
        with self.assertRaises(ValueError):
            fallback_report(5, 2, 24, 39)

    def test_even_arithmetic_factor_is_exactly_one_half_of_general(self) -> None:
        values = self.report80["values"]
        self.assertEqual(values["even_arithmetic_norm_squared_factor"], mp.mpf(25) / 8)
        self.assertEqual(values["general_arithmetic_norm_squared_factor"], mp.mpf(25) / 4)
        self.assertEqual(
            2 * values["even_arithmetic_norm_squared_factor"],
            values["general_arithmetic_norm_squared_factor"],
        )

    def test_lambda_two_constant_even_profile_obeys_arithmetic_bound(self) -> None:
        # f=1 on [-2,2].  The exact physical norm is
        # int_(1/2)^2 floor(2/u)^2 du = 23/6.
        physical_norm_squared = mp.mpf(23) / 6
        source_norm_squared = mp.mpf(4)
        even_bound = mp.mpf(2)
        self.assertLessEqual(
            physical_norm_squared,
            even_bound * source_norm_squared,
        )

    def test_fixed_parity_complexification_needs_no_extra_two(self) -> None:
        a = mp.mpc("1.25", "-0.75")
        b = mp.mpc("-0.5", "2.0")
        paired = abs(a + 1j * b) ** 2 + abs(mp.conj(a) + 1j * mp.conj(b)) ** 2
        expected = 2 * (abs(a) ** 2 + abs(b) ** 2)
        self.assertLess(abs(paired - expected), mp.mpf("1e-90"))
        self.assertFalse(
            self.report80["theorem_flags"]["fixed_parity_extra_factor_two_used"]
        )

    def test_source_kernel_is_quotiented_not_inverted(self) -> None:
        c = mp.matrix([[1, 0, 1]])
        B = c.H * c
        kernel = mp.matrix([-1, 0, 1])
        self.assertLess(mp.norm(B * kernel), mp.mpf("1e-90"))
        self.assertFalse(
            self.report80["theorem_flags"]["ordinary_inverse_on_source_kernel_used"]
        )
        self.assertTrue(
            self.report80["theorem_flags"]["moore_penrose_positive_quotient_used"]
        )

    def test_modewise_diagonals_cannot_replace_full_cross_term_gram(self) -> None:
        dimension = 6
        sampling = mp.matrix([[1] * dimension])
        gram = sampling.H * sampling
        self.assertTrue(all(gram[index, index] == 1 for index in range(dimension)))
        self.assertEqual(mp.eigsy(gram, eigvals_only=True)[-1], dimension)
        self.assertTrue(self.report80["theorem_flags"]["full_cross_term_gram_retained"])

    def test_two_defect_loss_identities(self) -> None:
        values = self.report80["values"]
        relative = lambda a, b: abs(a / b - 1)
        self.assertLess(
            relative(
                values["C_ext_upper"],
                values["B_abs"] * values["normalized_synthesis_M_upper"],
            ),
            mp.mpf("1e-70"),
        )
        self.assertLess(
            relative(
                values["alignment_product_upper"],
                values["C_ext_upper"]
                * values["normalized_synthesis_M_upper"],
            ),
            mp.mpf("1e-70"),
        )
        self.assertGreater(values["log10_alignment_product_upper"], 35000)
        self.assertFalse(
            self.report80["theorem_flags"][
                "target_scale_C_ext_M_O_inverse_d8_proved"
            ]
        )

    def test_precision_doubling_is_stable(self) -> None:
        report160 = fallback_report(5, 2, 24, 160)
        for key, low in self.report80["values"].items():
            with self.subTest(key=key):
                high = report160["values"][key]
                self.assertLess(abs(low / high - 1), mp.mpf("1e-70"))

    def test_independent_replay_reconstructs_every_value(self) -> None:
        replay = replay_artifact(copy.deepcopy(self.artifact80), 120)
        self.assertTrue(replay["independent_formula_assembly"])
        self.assertFalse(replay["producer_module_imported"])
        self.assertFalse(replay["producer_booleans_trusted"])
        self.assertFalse(replay["cached_matrix_or_eigenvalue_read"])
        self.assertTrue(replay["full_cross_term_gram_required"])
        self.assertTrue(replay["source_kernel_quotiented"])
        self.assertFalse(replay["target_scale_closed"])
        self.assertEqual(len(replay["reconstructed_values"]), 20)
        self.assertIn("both use mpmath", replay["arithmetic_library_limitation"])

    def test_raw_outward_intervals_have_exact_dyadic_endpoints(self) -> None:
        intervals = self.artifact80["outward_intervals"]
        self.assertEqual(set(intervals), set(self.artifact80["values"]))
        defect = _parse_interval(intervals["d_LS"], "d_LS")
        self.assertGreater(defect.lower, 0)
        self.assertLessEqual(defect.lower, defect.upper)
        endpoint = intervals["d_LS"]["lower_exact_dyadic"]
        self.assertIsInstance(endpoint["mantissa_decimal_text"], str)
        self.assertIsInstance(endpoint["binary_exponent"], int)
        self.assertNotIsInstance(endpoint["binary_exponent"], float)

    def test_replay_rejects_disjoint_or_binary64_interval_endpoints(self) -> None:
        payload = copy.deepcopy(self.artifact80)
        for side in ("lower_exact_dyadic", "upper_exact_dyadic"):
            payload["outward_intervals"]["d_LS"][side] = {
                "sign": 0,
                "mantissa_decimal_text": "1",
                "binary_exponent": 0,
            }
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

        payload = copy.deepcopy(self.artifact80)
        payload["outward_intervals"]["B_abs"]["lower_exact_dyadic"][
            "binary_exponent"
        ] = 1.0
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

    def test_replay_rejects_terminal_and_claim_promotions(self) -> None:
        payload = copy.deepcopy(self.artifact80)
        payload["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

        for key in (
            "target_scale_C_ext_M_O_inverse_d8_proved",
            "equation_5_2_proved",
            "locally_uniform_determinant_convergence_proved",
            "riemann_hypothesis_proved",
        ):
            payload = copy.deepcopy(self.artifact80)
            payload["theorem_flags"][key] = True
            with self.subTest(key=key):
                with self.assertRaises(ReplayError):
                    replay_artifact(payload, 120)

    def test_replay_rejects_binary64_exact_parameters_and_values(self) -> None:
        payload = copy.deepcopy(self.artifact80)
        payload["exact_inputs"]["lambda_numerator"] = 5.0
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

        payload = copy.deepcopy(self.artifact80)
        payload["values"]["d_LS"] = 0.0
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

    def test_replay_rejects_lost_even_factor_or_extra_parity_two(self) -> None:
        payload = copy.deepcopy(self.artifact80)
        payload["values"]["even_arithmetic_norm_squared_factor"] = payload[
            "values"
        ]["general_arithmetic_norm_squared_factor"]
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

        payload = copy.deepcopy(self.artifact80)
        payload["values"]["B_abs"] = mp.nstr(
            2 * mp.mpf(payload["values"]["B_abs"]), 80
        )
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

    def test_replay_rejects_either_missing_inverse_defect_factor(self) -> None:
        payload = copy.deepcopy(self.artifact80)
        values = payload["values"]
        one_defect_only = mp.mpf(values["B_abs"]) * (
            mp.mpf("2.5") ** 4
        ) / (4 * mp.mpf(values["d_LS"]))
        values["alignment_product_upper"] = mp.nstr(one_defect_only, 80)
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

        payload = copy.deepcopy(self.artifact80)
        payload["values"]["C_ext_upper"] = payload["values"]["B_abs"]
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

    def test_replay_rejects_formula_provenance_and_inventory_tampering(self) -> None:
        payload = copy.deepcopy(self.artifact80)
        payload["formula_contract"]["alignment_product"] = (
            "C_ext*M=O(1/d_8)"
        )
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

        payload = copy.deepcopy(self.artifact80)
        payload["provenance_sha256"][
            "src/full_exterior_sampling_fallback.py"
        ] = "0" * 64
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

        payload = copy.deepcopy(self.artifact80)
        payload["cached_matrix"] = [["1"]]
        with self.assertRaises(ReplayError):
            replay_artifact(payload, 120)

    def test_verifier_does_not_import_producer(self) -> None:
        verifier_source = (
            ROOT / "verifier/full_exterior_sampling_fallback_replay.py"
        ).read_text()
        self.assertNotIn("import full_exterior_sampling_fallback", verifier_source)
        self.assertNotIn("from full_exterior_sampling_fallback", verifier_source)

    def test_status_and_assumption_guardrails_remain_false(self) -> None:
        flags = self.report80["theorem_flags"]
        for key in (
            "real_zeta_zero_list_used",
            "global_zero_reality_assumed",
            "global_weil_positivity_assumed",
            "shifted_signed_sector_comparison_proved",
            "equation_5_2_proved",
            "locally_uniform_determinant_convergence_proved",
            "riemann_hypothesis_proved",
            "status_promoted",
        ):
            with self.subTest(key=key):
                self.assertFalse(flags[key])
        self.assertEqual(self.report80["terminal_state"], "P0_INVALIDATED")


if __name__ == "__main__":
    unittest.main()
