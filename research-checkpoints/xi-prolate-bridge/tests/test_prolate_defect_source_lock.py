import copy
from fractions import Fraction
import json
from pathlib import Path
import tempfile
import unittest

from prolate_defect_source_lock import (
    C_MAP,
    CONCENTRATION_MAP,
    SOURCE_PATH,
    SourceLockError,
    fixed_label_ratio,
    load_and_validate,
    ordinary_coefficient_sqrt_pi,
    repo_d0_over_d4_limit_pi_minus_four,
    repo_d4_over_d6_limit_pi_minus_two,
    repo_d6_over_d4_limit_pi_squared,
    repo_d8_over_d6_limit_pi_squared,
    repo_ratio_limit_pi_minus_four,
    validate_payload,
)


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "PROLATE_DEFECT_SOURCE_LOCK.json"


class ProlateDefectSourceLockTests(unittest.TestCase):
    def payload(self):
        return json.loads(LOCK_PATH.read_text(encoding="utf-8"))

    def test_source_bytes_lock_and_claim_boundary_pass(self):
        payload = load_and_validate(LOCK_PATH, ROOT)
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        boundary = payload["admission_boundary"]
        self.assertTrue(boundary["qualitative_fixed_index_equivalence"])
        self.assertTrue(boundary["qualitative_eventual_ratio_and_floor"])
        self.assertIsNone(boundary["effective_threshold_c"])
        self.assertFalse(boundary["finite_formula_bound"])
        self.assertFalse(boundary["signed_weil_floor"])
        self.assertFalse(boundary["equation_5_2"])

    def test_exact_constants_are_reconstructed_without_decimal_input(self):
        self.assertEqual(ordinary_coefficient_sqrt_pi(4), Fraction(2048, 3))
        self.assertEqual(
            ordinary_coefficient_sqrt_pi(8), Fraction(524288, 315)
        )
        self.assertEqual(fixed_label_ratio(4, 8), Fraction(105, 256))
        self.assertEqual(repo_ratio_limit_pi_minus_four(), Fraction(105, 4096))

    def test_exact_even_odd_shift_scale_constants(self):
        # lambda^(-4) d_8/d_6 -> (32/7) pi^2 and
        # lambda^4 d_4/d_6 -> (15/128) pi^(-2).
        self.assertEqual(fixed_label_ratio(8, 6), Fraction(8, 7))
        self.assertEqual(repo_d8_over_d6_limit_pi_squared(), Fraction(32, 7))
        self.assertEqual(fixed_label_ratio(4, 6), Fraction(15, 32))
        self.assertEqual(repo_d4_over_d6_limit_pi_minus_two(), Fraction(15, 128))

    def test_exact_endpoint_obstruction_scale_constants(self):
        # lambda^8 d_0/d_4 -> (3/8192) pi^-4 and
        # lambda^-4 d_6/d_4 -> (128/15) pi^2.
        self.assertEqual(repo_d0_over_d4_limit_pi_minus_four(), Fraction(3, 8192))
        self.assertEqual(repo_d6_over_d4_limit_pi_squared(), Fraction(128, 15))

        # Combining (a_0/a_4)^2 -> 3/8 with the first ratio gives
        # [(a_0 e_0)/(a_4 e_4)]^2 * lambda^8 ->
        # (3/256)^2 pi^-4.
        endpoint_ratio_squared = (
            Fraction(3, 8) * repo_d0_over_d4_limit_pi_minus_four()
        )
        self.assertEqual(endpoint_ratio_squared, Fraction(3, 256) ** 2)

    def test_invalid_labels_fail_closed(self):
        for label in (-1, 2.0, "4", True):
            with self.subTest(label=label):
                with self.assertRaises(ValueError):
                    ordinary_coefficient_sqrt_pi(label)  # type: ignore[arg-type]

    def test_hash_text_mutation_is_rejected(self):
        payload = self.payload()
        payload["binding_source"]["vendored_sha256"] = "0" * 64
        with self.assertRaises(SourceLockError):
            validate_payload(payload, ROOT)

    def test_equation_page_map_mutation_is_rejected(self):
        payload = self.payload()
        payload["source_equation_map"]["generalized_concentration_defect"] = (
            "page 3032, equations (91)--(93)"
        )
        with self.assertRaises(SourceLockError):
            validate_payload(payload, ROOT)

    def test_actual_pdf_byte_mutation_is_rejected(self):
        payload = self.payload()
        source_bytes = bytearray((ROOT / SOURCE_PATH).read_bytes())
        source_bytes[-1] ^= 1
        with tempfile.TemporaryDirectory() as directory:
            temporary_root = Path(directory)
            destination = temporary_root / SOURCE_PATH
            destination.parent.mkdir(parents=True)
            destination.write_bytes(source_bytes)
            with self.assertRaises(SourceLockError):
                validate_payload(payload, temporary_root)

    def test_lambda_vs_lambda_squared_normalization_mutation_is_rejected(self):
        payload = self.payload()
        self.assertEqual(payload["convention_map"]["source_parameter"], C_MAP)
        payload["convention_map"]["source_parameter"] = "c=2*pi*lambda"
        with self.assertRaises(SourceLockError):
            validate_payload(payload, ROOT)

    def test_finite_fourier_amplitude_square_cannot_be_dropped(self):
        payload = self.payload()
        self.assertEqual(
            payload["convention_map"]["concentration_eigenvalue"],
            CONCENTRATION_MAP,
        )
        payload["convention_map"]["concentration_eigenvalue"] = (
            "d_m(lambda)=1-chi_m(lambda)=1-Lambda_m(c)"
        )
        with self.assertRaises(SourceLockError):
            validate_payload(payload, ROOT)

    def test_even_radial_index_mutation_is_rejected(self):
        payload = self.payload()
        payload["convention_map"]["even_label_map"] = (
            "ordinary_even_label_m=n corresponds to source "
            "generalized_N=-1/2, radial_index=n"
        )
        with self.assertRaises(SourceLockError):
            validate_payload(payload, ROOT)

    def test_ratio_constant_mutation_is_rejected(self):
        payload = self.payload()
        payload["locked_formulas"]["ratio_limit"] = "c^4*d_4/d_8->105/128"
        with self.assertRaises(SourceLockError):
            validate_payload(payload, ROOT)

    def test_unknown_threshold_cannot_be_promoted_to_finite_bound(self):
        payload = copy.deepcopy(self.payload())
        payload["admission_boundary"]["effective_threshold_c"] = "10"
        payload["admission_boundary"]["finite_formula_bound"] = True
        with self.assertRaises(SourceLockError):
            validate_payload(payload, ROOT)


if __name__ == "__main__":
    unittest.main()
