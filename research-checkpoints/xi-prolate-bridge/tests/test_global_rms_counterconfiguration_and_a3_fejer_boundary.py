from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes/GLOBAL_RMS_COUNTERCONFIGURATION_AND_A3_FEJER_BOUNDARY.md"

NOTE_HASH = "045d13e945f06d1d2f5bbd0f9d7bc3d5af5b5c4a821eb0c329a38f98c8586777"
PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}


def second_differences(values: tuple[F, ...]) -> tuple[F, ...]:
    extended = values + (F(0), F(0))
    return tuple(
        extended[index] - 2 * extended[index + 1] + extended[index + 2]
        for index in range(len(values))
    )


class GlobalRMSCounterconfigurationTests(unittest.TestCase):
    def test_frozen_note_and_protected_bytes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_fejer_second_difference_reconstruction_is_exact(self) -> None:
        # c_j=(N-j)^2 is a concrete decreasing convex null sequence.
        values = tuple(F((6 - j) ** 2) for j in range(1, 6))
        defects = second_differences(values)
        self.assertTrue(all(value >= 0 for value in defects))

        for j in range(1, len(values) + 1):
            reconstructed = sum(
                F(m + 1 - j) * defects[m - 1]
                for m in range(j, len(values) + 1)
            )
            self.assertEqual(reconstructed, values[j - 1])

        cap = sum(F(m + 1) * defects[m - 1]
                  for m in range(1, len(values) + 1))
        self.assertEqual(cap, 2 * values[0] - values[1])

    def test_squared_fejer_profiles_have_nonnegative_curvature_terms(self) -> None:
        for q in (F(7, 8), F(15, 16), F(1)):
            a = 2 - 2 * q
            r = 2 * q
            self.assertGreaterEqual(a, 0)
            self.assertGreater(r, 1)
            # These are the three coefficients in f''/f from equation (2.10).
            self.assertGreaterEqual(a * (a + 1), 0)
            self.assertGreaterEqual(2 * a * r, 0)
            self.assertGreater(r * (r - 1), 0)

    def test_worst_stable_rms_power_is_exactly_one_over_T(self) -> None:
        q = F(7, 8)
        rms_power = 4 * q - F(3, 2)
        first_coefficient_power = 2 * q
        ratio_power = first_coefficient_power - rms_power
        self.assertEqual(rms_power, F(2))
        self.assertEqual(ratio_power, F(-1, 4))
        # N=T^4 turns N^(-1/4) into T^(-1).
        self.assertEqual(4 * ratio_power, -1)

    def test_cells_are_inside_stable_intervals_and_overlap_is_bounded(self) -> None:
        ratio = F(16, 15)
        previous_crossover = F(29, 30) / ratio
        next_crossover = F(29, 30)
        self.assertEqual(previous_crossover, F(29, 32))
        self.assertGreater(previous_crossover, F(7, 8))
        self.assertLess(next_crossover, 1)

        # Three consecutive stable intervals can overlap, but four cannot.
        self.assertLessEqual(ratio**2 * F(7, 8), 1)
        self.assertGreater(ratio**3 * F(7, 8), 1)

    def test_exact_modulus_and_rms_multiplicity_factor(self) -> None:
        beta = F(3, 10)
        j = 7
        g = F(11)
        gamma_squared = F(j * j) * g * g - beta * beta
        self.assertGreater(gamma_squared, 0)
        # The construction defines gamma by this square, hence |alpha|^2=(jG)^2.
        modulus_squared = beta * beta + gamma_squared
        self.assertEqual(modulus_squared, F(j * j) * g * g)

        amplitudes = (F(2), F(3), F(6))
        # Each right-half block contains both conjugates.
        q2_squared = 2 * sum(value * value for value in amplitudes)
        self.assertEqual(q2_squared, 98)

    def test_fejer_fitting_consumes_two_log_n_over_T_bandwidth(self) -> None:
        # For n=2m and w_j=1-j/(n+1), compare j=1 with j=m.
        # exp(T*(beta_m-beta_1)) = m^2*w_m/w_1 = m*(m+1)/2.
        for m in (4, 20, 100):
            exact_ratio = F(m * (m + 1), 2)
            self.assertGreaterEqual(exact_ratio, F(m * m, 2))
            logarithmic_width = math.log(float(exact_ratio))
            self.assertGreaterEqual(logarithmic_width, 2 * math.log(m) - math.log(2))

    def test_harmonic_gain_is_only_logarithmic(self) -> None:
        for n in (8, 64, 512):
            harmonic = sum((F(1, j) for j in range(1, n + 1)), F(0))
            # If positivity forces every a_j<=M, then sum a_j/(jG)<=M H_n/G.
            coefficients = tuple(F(n + 1 - j, n) for j in range(1, n + 1))
            weighted = sum(coefficients[j - 1] / j for j in range(1, n + 1))
            self.assertLessEqual(weighted, harmonic)
            self.assertLessEqual(float(harmonic), 1 + math.log(n))

    def test_claim_boundary_is_fail_closed(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "global generic RMS no-go",
            r"{\Psi_+(L)\over Q_2(L)}=O(L^{-1})",
            "N(H)=O(H)",
            "does not defeat the sharper absolute history majorant `A_3`",
            "`M=o(A_3/T)`",
            "Noncommensurate diagonal inverse-ordinate peak lemma",
            "no actual-zeta conclusion in either direction",
            "No source lock, numerical artifact",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden_promotions = (
            "the nonattained-edge vector theorem is proved",
            "this proves RH",
            "the actual zeta zeros satisfy Theorem 4.1",
            "A_3=o(L\\Psi) follows from the generic hypotheses",
        )
        for phrase in forbidden_promotions:
            self.assertNotIn(phrase, text)

    def test_package_has_no_disallowed_control_bytes(self) -> None:
        for path in (NOTE, Path(__file__)):
            bad = [value for value in path.read_bytes()
                   if value < 32 and value not in (9, 10)]
            self.assertEqual(bad, [], str(path))

    def test_tex_tokens_survive_serialization(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"j^{\,2q-2}",
            r"N_k^{\,4q-3/2}",
            r"\max_iQ_i(L)\quad",
            r"{A_{3,\mathrm{block}}\over T M}\leq",
            r"+\pi-2\arg\alpha_{k,j}",
        )
        for token in required:
            self.assertIn(token, text)
        malformed = ("^{,", ")quad", "}leq", "+pi-", "^{\\\\,")
        for token in malformed:
            self.assertNotIn(token, text)


if __name__ == "__main__":
    unittest.main()
