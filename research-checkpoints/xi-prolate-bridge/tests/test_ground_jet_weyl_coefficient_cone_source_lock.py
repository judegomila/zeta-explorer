from __future__ import annotations

import copy
from fractions import Fraction
import hashlib
import json
from math import comb, factorial
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "GROUND_JET_WEYL_COEFFICIENT_CONE_SOURCE_LOCK.json"
VERSION = "0.47.0-ground-jet-weyl-coefficient-cone"
PRIOR_VERSION = "0.46.0-parity-pencil-odd-weyl-inertia"
EXPECTED_DEPENDENCIES = {
    "PARITY_PENCIL_ODD_WEYL_INERTIA_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "P0_SOURCE_LOCK.json",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md",
    "notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md",
    "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md",
    "notes/PARITY_PENCIL_TRACE_REDUCTION.md",
    "notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md",
    "notes/EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md",
    "notes/GROUND_TRANSFORM_TILT_JET_REDUCTION.md",
    "notes/EVEN_GROUND_COEFFICIENT_CONE_AUDIT.md",
    "notes/WEYL_COLLAPSE_SHIFTED_COEFFICIENT_RESERVE.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
}
EXPECTED_EXTERNALS = {
    (
        "CCM-ZST-v1",
        "arXiv:2511.22755v1",
        "vendor/CCM-ZST-2511.22755v1.pdf",
        "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
    ),
}
REQUIRED_FORMULAS = {
    "source_cauchy_displacement",
    "ground_transform_product",
    "effective_dimension_tilt",
    "all_m_cumulants",
    "two_height_factorization",
    "two_height_exterior_bound",
    "sharp_effective_dimension_comparison",
    "projective_jet",
    "projective_wronskian",
    "jet_leverage",
    "quotient_reconstruction",
    "positive_ground_countermodel",
    "even_block_entries",
    "coefficient_response",
    "coefficient_polynomial",
    "coefficient_affine_formula",
    "coefficient_homogeneous_formula",
    "coefficient_cone_equivalence",
    "alternating_coefficient_counterexample",
    "weyl_scalar_collapse",
    "weyl_constrained_solution",
    "weyl_relative_determinant",
    "weyl_spectral_shift",
    "schur_derivative",
    "n1_weyl_obstruction",
    "pencil_radius_bound",
    "shifted_odd_reserve",
    "schur_surplus",
    "scale_invariant_reserve",
}
EXPECTED_ADMISSIONS = {
    "actual_ground_transform_log_derivative_bound_claimed",
    "actual_projective_jet_leverage_bound_claimed",
    "actual_even_ground_coefficient_cone_claimed",
    "actual_shifted_odd_coefficient_conditioning_claimed",
    "actual_middle_resolvent_bound_claimed",
    "actual_weyl_determinant_floor_claimed",
    "api_key_read",
    "binary64_parameters_used",
    "cached_matrix_or_eigenvector_read",
    "decimal_zero_list_read",
    "determinant_limit_claimed",
    "environment_secret_read",
    "equation_5_2_claimed",
    "finite_imaginary_interval_promoted_to_all_axis_sign",
    "finite_real_or_imaginary_quotient_pairs_promoted_to_determinant_limit",
    "fourier_sign_changed",
    "global_weil_positivity_assumed",
    "inversion_reflection_dropped",
    "lambda_squared_mixed_with_lambda",
    "locally_uniform_characteristic_convergence_proved",
    "nonpositive_gap_or_schur_margin_reported_as_pass",
    "prime_block_sign_changed",
    "prime_power_endpoint_omitted",
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
    "riemann_hypothesis_assumed_or_claimed",
    "secret_serialized",
    "source_normalization_changed",
    "trace_moment_limit_claimed",
    "uniform_first_trace_claimed",
    "unit_source_normalization_substituted",
    "zero_table_used",
}
TRUE_STATUS_KEYS = {
    "ground_jet_weyl_coefficient_cone_source_locked",
    "effective_dimension_ground_log_derivative_identity_proved",
    "ground_transform_all_trace_cumulant_identity_proved",
    "ground_transform_two_height_tail_identity_proved",
    "one_anchor_projective_jet_gate_proved",
    "positive_ground_trace_countermodel_proved",
    "odd_weyl_scalar_collapse_proved",
    "odd_weyl_relative_determinant_identity_proved",
    "shifted_odd_coefficient_reserve_proved",
    "even_ground_coefficient_cone_equivalence_proved",
}
FALSE_STATUS_KEYS = {
    "actual_ground_transform_log_derivative_bound_proved",
    "actual_projective_jet_leverage_bound_proved",
    "actual_even_ground_coefficient_cone_proved",
    "actual_shifted_odd_coefficient_conditioning_proved",
    "actual_middle_resolvent_bound_proved",
}
ANCHOR_DOMAIN = (
    "<kappa,xi>!=0 is required for w=xi/<kappa,xi>; it follows under "
    "B=A-U*I>0 with U>=mu but is explicit for a standalone finite pair"
)
COMPARISON_DOMAIN = (
    "K_sigma=hat(kappa)(i*sigma)!=0 is required; eventual nonvanishing follows "
    "from locally uniform projected-prolate convergence, but is explicit for a "
    "standalone finite pair"
)
WEYL_SCALAR_DOMAIN = (
    "A-s*I, Q_- -s*I, and Q_+ -s*I are invertible for the resolvent scalar "
    "collapse; the stated projective limits handle an even pole separately"
)
WEYL_DETERMINANT_DOMAIN = (
    "alpha_s requires Q_- -s*I invertible; h_s requires Q_- -s*I and Q_+ -s*I "
    "invertible; m_s requires Q_+ -s*I invertible but does not require A-s*I "
    "invertible; mathfrak_D_s is first derived when A-s*I, Q_- -s*I, and "
    "Q_+ -s*I are all invertible and extends through an even eigenvalue when "
    "A-s*I and Q_- -s*I remain invertible"
)
WEYL_SPECTRAL_DOMAIN = (
    "A-U*I>0 and Q_- -U*I>0 are required, and the logarithmic derivative and "
    "integral are used only for real s<=U"
)
SCHUR_DERIVATIVE_DOMAIN = (
    "d_s'=-||w_s||^2 is asserted for real s where A-s*I is invertible; the "
    "comparison interval s<=U is covered by A-U*I>0"
)
SHIFTED_RESERVE_DOMAIN = (
    "the all-axis sign A_x(alpha)>0, a unit representative x, "
    "epsilon<=U<lambda_min(A), g_+=lambda_min(A)-U>0, and the Schur-surplus "
    "hypotheses are separate inputs"
)
ALL_M_FORMULA = (
    "for every integer m>=1, S^q_(m;lambda,N)(sigma)=(-1)^(m-1)/(m-1)!*"
    "[(d/dt)^m log(M_N(sqrt(t)))]_(t=sigma^2)-H^phys_(m,N)(sigma), where "
    "H^phys_(m,N)=(L/(2*pi))^(2m)*sum_(n>N)(n^2+alpha^2)^(-m)"
)
POSITIVE_COUNTERMODEL_FORMULA = (
    "for N>=2, x=(3/4)e_0^++(sqrt(2)/8)e_1^+, X has diagonal "
    "(3/4,2^2,...,N^2), A_N(a)=(a^2+3/4)/(a^2+1), and "
    "9/16*I<T_-<9/4*I; only in the regime alpha->infinity and "
    "N/alpha^2->infinity does d_eff=sigma*L/4-1/2+o(1)"
)


def _no_duplicates(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate key: {key}")
        result[key] = value
    return result


def _load_no_duplicate_keys(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=_no_duplicates)


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _product(values) -> Fraction:
    result = Fraction(1)
    for value in values:
        result *= value
    return result


def _poly_multiply(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    result = [Fraction(0)] * (len(left) + len(right) - 1)
    for i, a in enumerate(left):
        for j, b in enumerate(right):
            result[i + j] += a * b
    return result


def _poly_from_positive_roots(roots: tuple[Fraction, ...]) -> list[Fraction]:
    coefficients = [Fraction(1)]
    for root in roots:
        coefficients = _poly_multiply(coefficients, [root, Fraction(1)])
    return coefficients


def _poly_derivative(coefficients: list[Fraction], order: int) -> list[Fraction]:
    result = coefficients[:]
    for _ in range(order):
        result = [Fraction(i) * result[i] for i in range(1, len(result))]
    return result


def _poly_evaluate(coefficients: list[Fraction], value: Fraction) -> Fraction:
    result = Fraction(0)
    for coefficient in reversed(coefficients):
        result = result * value + coefficient
    return result


def _log_derivatives(
    coefficients: list[Fraction], value: Fraction, order: int
) -> list[Fraction]:
    polynomial_value = _poly_evaluate(coefficients, value)
    derivatives = [Fraction(0)] * (order + 1)
    polynomial_derivatives = [
        _poly_evaluate(_poly_derivative(coefficients, n), value)
        for n in range(order + 1)
    ]
    for n in range(1, order + 1):
        correction = sum(
            (
                Fraction(comb(n - 1, j))
                * polynomial_derivatives[j]
                * derivatives[n - j]
                / polynomial_value
                for j in range(1, n)
            ),
            Fraction(0),
        )
        derivatives[n] = polynomial_derivatives[n] / polynomial_value - correction
    return derivatives


def _identity(size: int) -> list[list[Fraction]]:
    return [
        [Fraction(int(i == j)) for j in range(size)]
        for i in range(size)
    ]


def _transpose(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    return [list(row) for row in zip(*matrix)]


def _matmul(
    left: list[list[Fraction]], right: list[list[Fraction]]
) -> list[list[Fraction]]:
    rows = len(left)
    inner = len(right)
    columns = len(right[0])
    return [
        [
            sum((left[i][k] * right[k][j] for k in range(inner)), Fraction(0))
            for j in range(columns)
        ]
        for i in range(rows)
    ]


def _determinant(matrix: list[list[Fraction]]) -> Fraction:
    work = [row[:] for row in matrix]
    determinant = Fraction(1)
    size = len(work)
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            determinant *= -1
        pivot_value = work[column][column]
        determinant *= pivot_value
        for row in range(column + 1, size):
            multiplier = work[row][column] / pivot_value
            for j in range(column + 1, size):
                work[row][j] -= multiplier * work[column][j]
    return determinant


def _is_positive_definite(matrix: list[list[Fraction]]) -> bool:
    if matrix != _transpose(matrix):
        return False
    return all(
        _determinant([row[:size] for row in matrix[:size]]) > 0
        for size in range(1, len(matrix) + 1)
    )


def _elementary_symmetric(values: tuple[Fraction, ...], degree: int) -> Fraction:
    if degree < 0 or degree > len(values):
        return Fraction(0)
    coefficients = [Fraction(1)] + [Fraction(0)] * degree
    for value in values:
        for index in range(degree, 0, -1):
            coefficients[index] += value * coefficients[index - 1]
    return coefficients[degree]


def _validate(payload: dict) -> None:
    assert payload["schema"] == "xi-prolate-ground-jet-weyl-coefficient-cone-source-lock-v1"
    assert payload["claim_class"] == (
        "GROUND_TRANSFORM_TILT_PROJECTIVE_JET_WEYL_COLLAPSE_AND_COEFFICIENT_CONE_REDUCTION"
    )
    assert payload["checkpoint_version"] == VERSION
    assert payload["updated_date"] == "2026-08-08"
    assert payload["terminal_state"] == "P0_INVALIDATED"

    dependencies = payload["dependencies"]
    dependency_paths = [item["path"] for item in dependencies]
    assert len(dependencies) == len(EXPECTED_DEPENDENCIES) == 13
    assert len(dependency_paths) == len(set(dependency_paths))
    assert set(dependency_paths) == EXPECTED_DEPENDENCIES
    for item in dependencies:
        relative = Path(item["path"])
        assert not relative.is_absolute()
        assert ".." not in relative.parts
        assert item["role"]
        assert len(item["sha256"]) == 64
        assert _sha256(ROOT / relative) == item["sha256"]

    external_sources = payload["external_sources"]
    assert len(external_sources) == 1
    assert {
        (item["id"], item["version"], item["vendored_path"], item["sha256"])
        for item in external_sources
    } == EXPECTED_EXTERNALS
    for item in external_sources:
        assert item["use"]
        assert _sha256(ROOT / item["vendored_path"]) == item["sha256"]

    conventions = payload["locked_conventions"]
    assert conventions["physical_interval"] == (
        "[-log(lambda),log(lambda)] with L=2*log(lambda), Lebesgue measure, and zero extension"
    )
    assert conventions["source_interval"] == (
        "[-lambda,lambda] with Lebesgue measure, zero extension, and the source-limit normalization"
    )
    assert conventions["fourier_transform"] == "hat(f)(z)=integral f(x)*exp(-i*z*x) dx"
    assert conventions["frequency_measure"] == "dt/(2*pi)"
    assert conventions["prime_power_endpoint"] == "inclusive 1<k<=lambda^2"
    assert conventions["prime_block_sign"].startswith("minus,")
    assert conventions["inversion"] == "J*V_n=V_(-n), equivalently Jf(x)=f(-x)"
    assert conventions["source_normalization"] == (
        "4*hat(k_lambda^+) tends to Xi; unit-normalizing h_lambda is rejected"
    )
    assert "P0_SOURCE_LOCK.json" in conventions["archimedean_erratum"]
    assert "explicitly evenized" in conventions["prolate_evenization"]

    domains = payload["locked_domains"]
    assert set(domains) == {
        "ground_transform",
        "fixed_height",
        "two_height",
        "anchor_overlap",
        "comparison_transform",
        "jet_leverage",
        "weyl_scalar_collapse",
        "weyl_determinants",
        "weyl_spectral_shift",
        "schur_derivative",
        "coefficient_cone",
        "shifted_reserve",
    }
    assert domains["anchor_overlap"] == ANCHOR_DOMAIN
    assert domains["comparison_transform"] == COMPARISON_DOMAIN
    assert "0<sigma<1/2" in domains["fixed_height"]
    assert domains["weyl_scalar_collapse"] == WEYL_SCALAR_DOMAIN
    assert domains["weyl_determinants"] == WEYL_DETERMINANT_DOMAIN
    assert domains["weyl_spectral_shift"] == WEYL_SPECTRAL_DOMAIN
    assert domains["schur_derivative"] == SCHUR_DERIVATIVE_DOMAIN
    assert domains["shifted_reserve"] == SHIFTED_RESERVE_DOMAIN

    formulas = payload["locked_formulas"]
    assert set(formulas) == REQUIRED_FORMULAS
    assert "H_(1,N)" in formulas["effective_dimension_tilt"]
    assert formulas["all_m_cumulants"] == ALL_M_FORMULA
    assert "product_(n>N)" in formulas["two_height_factorization"]
    assert "W_sigma" in formulas["projective_wronskian"]
    assert "e_r(E)=0" in formulas["coefficient_polynomial"]
    assert "p_j>0" in formulas["coefficient_cone_equivalence"]
    assert "mathfrak_D_s=-det(A-s*I)/det(Q_- -s*I)" in formulas["weyl_relative_determinant"]
    assert "for 0<t<1" in formulas["n1_weyl_obstruction"]
    assert formulas["positive_ground_countermodel"] == POSITIVE_COUNTERMODEL_FORMULA
    assert "unit representative x" in formulas["shifted_odd_reserve"]
    assert "(chi_U/g_+)*C_x<1" in formulas["scale_invariant_reserve"]

    admissions = payload["source_admissions"]
    assert set(admissions) == EXPECTED_ADMISSIONS
    assert all(value is False for value in admissions.values())

    boundary = payload["claim_boundary"]
    assert boundary["checkpoint_version"] == VERSION
    assert boundary["formal_status"] == "P0_INVALIDATED"
    assert len(boundary["proved"]) == len(set(boundary["proved"])) == 11
    assert len(boundary["not_proved"]) == len(set(boundary["not_proved"])) == 7
    proved = "\n".join(boundary["proved"])
    for required in (
        "ground-transform logarithmic-tilt identity",
        "trace moments as ground-transform cumulants",
        "two-height ground-transform ratio",
        "one-anchor projective-jet",
        "positive-ground, uniformly odd-conditioned",
        "coefficient-cone equivalence",
        "Weyl scalar collapse",
        "scale-invariant shifted odd reserve",
    ):
        assert required in proved
    not_proved = "\n".join(boundary["not_proved"])
    for required in (
        "bounded actual arithmetic ground-transform",
        "projective-jet inverse-leverage",
        "actual arithmetic even ground",
        "shifted odd reserve",
        "relative Weyl determinant floor",
        "higher trace-moment limits",
        "equation (5.2)",
        "locally uniform determinant convergence",
        "RH conclusion",
    ):
        assert required in not_proved


class GroundJetWeylCoefficientConeSourceLockTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.lock = _load_no_duplicate_keys(LOCK_PATH)

    def test_live_lock_sources_and_status_manifests_validate(self) -> None:
        _validate(self.lock)
        prior = _load_no_duplicate_keys(
            ROOT / "PARITY_PENCIL_ODD_WEYL_INERTIA_SOURCE_LOCK.json"
        )
        self.assertEqual(prior["checkpoint_version"], PRIOR_VERSION)

        p0 = _load_no_duplicate_keys(ROOT / "P0_STATUS.json")
        project = _load_no_duplicate_keys(ROOT / "PROJECT_STATUS.json")
        handoff = _load_no_duplicate_keys(ROOT / "HANDOFF_MANIFEST.json")
        self.assertEqual(p0["artifact_version"], project["artifact_version"])
        self.assertEqual(p0["artifact_version"], handoff["artifact_version"])
        self.assertEqual(p0["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(project["overall_status"], "P0_INVALIDATED")
        self.assertEqual(handoff["terminal_state"], "P0_INVALIDATED")
        for claims in (p0["component_claims"], project, handoff["claim_status"]):
            for key in TRUE_STATUS_KEYS:
                with self.subTest(key=key, expected=True):
                    self.assertIs(claims[key], True)
            for key in FALSE_STATUS_KEYS:
                with self.subTest(key=key, expected=False):
                    self.assertIs(claims[key], False)

    def test_adversarial_source_convention_domain_and_claim_mutations_fail_closed(self) -> None:
        mutations = (
            ("fourier_transform", "hat(f)(z)=integral f(x)*exp(+i*z*x) dx"),
            ("prime_power_endpoint", "inclusive 1<k<=lambda"),
            ("prime_block_sign", "plus"),
            ("inversion", "Jf(x)=f(x)"),
            ("source_normalization", "unit norm"),
            ("frequency_measure", "dt"),
        )
        for key, value in mutations:
            with self.subTest(key=key):
                payload = copy.deepcopy(self.lock)
                payload["locked_conventions"][key] = value
                with self.assertRaises(AssertionError):
                    _validate(payload)

        for key, value in (
            ("anchor_overlap", "automatic"),
            ("comparison_transform", "K_sigma may vanish"),
            ("weyl_scalar_collapse", "no invertibility hypotheses"),
            ("weyl_determinants", "all formulas unconditional"),
            ("weyl_spectral_shift", "all real s"),
            ("schur_derivative", "including poles"),
            ("shifted_reserve", "no unit normalization needed"),
        ):
            with self.subTest(domain=key):
                payload = copy.deepcopy(self.lock)
                payload["locked_domains"][key] = value
                with self.assertRaises(AssertionError):
                    _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["dependencies"][0]["sha256"] = "0" * 64
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["dependencies"].pop()
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["external_sources"][0]["version"] = "arXiv:2511.22755v2"
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["locked_formulas"].pop("projective_wronskian")
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["locked_formulas"]["all_m_cumulants"] = payload[
            "locked_formulas"
        ]["all_m_cumulants"].replace("(L/(2*pi))^(2m)", "1")
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["locked_formulas"]["positive_ground_countermodel"] = payload[
            "locked_formulas"
        ]["positive_ground_countermodel"].replace("for N>=2", "for N>=1")
        with self.assertRaises(AssertionError):
            _validate(payload)

        for key in (
            "actual_ground_transform_log_derivative_bound_claimed",
            "actual_even_ground_coefficient_cone_claimed",
            "global_weil_positivity_assumed",
            "finite_real_or_imaginary_quotient_pairs_promoted_to_determinant_limit",
            "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
            "zero_table_used",
            "api_key_read",
        ):
            payload = copy.deepcopy(self.lock)
            payload["source_admissions"][key] = True
            with self.subTest(admission=key), self.assertRaises(AssertionError):
                _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["claim_boundary"]["not_proved"] = []
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        with self.assertRaises(AssertionError):
            _validate(payload)

        with self.assertRaises(ValueError):
            json.loads('{"duplicate": 1, "duplicate": 2}', object_pairs_hook=_no_duplicates)

    def test_finite_product_tilt_all_cumulants_and_two_height_cancellation(self) -> None:
        quotient_roots = (Fraction(1, 2), Fraction(3))
        exterior_roots = (Fraction(9), Fraction(16))
        all_roots = quotient_roots + exterior_roots
        product_polynomial = _poly_from_positive_roots(all_roots)
        alpha_squared = Fraction(4)
        log_derivatives = _log_derivatives(product_polynomial, alpha_squared, 4)

        for moment in range(1, 5):
            cumulant = (
                Fraction((-1) ** (moment - 1), factorial(moment - 1))
                * log_derivatives[moment]
            )
            exterior_tail = sum(
                (Fraction(1, (alpha_squared + root) ** moment) for root in exterior_roots),
                Fraction(0),
            )
            quotient_moment = sum(
                (Fraction(1, (alpha_squared + root) ** moment) for root in quotient_roots),
                Fraction(0),
            )
            with self.subTest(moment=moment):
                self.assertEqual(cumulant - exterior_tail, quotient_moment)

        effective_dimension = sum(
            (alpha_squared / (alpha_squared + root) for root in quotient_roots),
            Fraction(0),
        )
        exterior_tilt = sum(
            (alpha_squared / (alpha_squared + root) for root in exterior_roots),
            Fraction(0),
        )
        self.assertEqual(
            alpha_squared * log_derivatives[1] - exterior_tilt,
            effective_dimension,
        )

        gamma_squared = Fraction(1)
        quotient_ratio = _product(
            (root + gamma_squared) / (root + alpha_squared)
            for root in quotient_roots
        )
        ground_ratio = _poly_evaluate(product_polynomial, gamma_squared) / _poly_evaluate(
            product_polynomial, alpha_squared
        )
        exterior_correction = _product(
            (root + alpha_squared) / (root + gamma_squared)
            for root in exterior_roots
        )
        self.assertEqual(ground_ratio * exterior_correction, quotient_ratio)

    def test_projective_jet_wronskian_and_inverse_leverage_reserves(self) -> None:
        k_value = Fraction(5)
        k_derivative = Fraction(2)
        z_value = Fraction(3, 2)
        z_derivative = Fraction(-1, 3)
        m_value = k_value - z_value
        m_derivative = k_derivative - z_derivative
        jet_z = k_value * z_derivative - k_derivative * z_value
        wronskian = k_value * m_derivative - k_derivative * m_value

        self.assertEqual(wronskian, -jet_z)
        self.assertEqual(
            m_derivative / m_value,
            k_derivative / k_value - jet_z / (k_value * m_value),
        )

        k_scale = Fraction(3)
        m_scale = Fraction(7)
        scaled_wronskian = k_scale * m_scale * wronskian
        self.assertEqual(
            scaled_wronskian / ((k_scale * k_value) * (m_scale * m_value)),
            wronskian / (k_value * m_value),
        )

        energy = Fraction(9)
        leverage_0 = Fraction(1, 4)
        leverage_jet = Fraction(196, 81)
        eta = Fraction(1, 2)
        c_jet = Fraction(1)
        self.assertEqual(z_value**2, energy * leverage_0)
        self.assertEqual(jet_z**2, energy * leverage_jet)
        self.assertLessEqual(energy * leverage_0, eta**2 * k_value**2)
        self.assertLessEqual(energy * leverage_jet, c_jet**2 * k_value**4)
        self.assertGreaterEqual(abs(m_value), (1 - eta) * abs(k_value))

    def test_positive_ground_uniformly_conditioned_countermodel(self) -> None:
        diagonal = (Fraction(3, 4), Fraction(4), Fraction(9))
        coefficients = (Fraction(0), Fraction(-2, 13), Fraction(-1, 11))
        size = len(diagonal)
        identity = _identity(size)
        synthesis = [row[:] for row in identity]
        synthesis_inverse = [row[:] for row in identity]
        for column, coefficient in enumerate(coefficients):
            synthesis[0][column] += coefficient
            synthesis_inverse[0][column] -= coefficient
        diagonal_matrix = [
            [diagonal[i] if i == j else Fraction(0) for j in range(size)]
            for i in range(size)
        ]

        x_matrix = _matmul(_matmul(synthesis, diagonal_matrix), synthesis_inverse)
        expected_x = [
            [Fraction(3, 4), Fraction(-1, 2), Fraction(-3, 4)],
            [Fraction(0), Fraction(4), Fraction(0)],
            [Fraction(0), Fraction(0), Fraction(9)],
        ]
        self.assertEqual(x_matrix, expected_x)

        t_minus = _matmul(_transpose(synthesis_inverse), synthesis_inverse)
        k_matrix = _matmul(t_minus, x_matrix)
        self.assertEqual(k_matrix, _transpose(k_matrix))
        self.assertTrue(_is_positive_definite(t_minus))
        lower_difference = [
            [t_minus[i][j] - Fraction(9, 16) * int(i == j) for j in range(size)]
            for i in range(size)
        ]
        upper_difference = [
            [Fraction(9, 4) * int(i == j) - t_minus[i][j] for j in range(size)]
            for i in range(size)
        ]
        self.assertTrue(_is_positive_definite(lower_difference))
        self.assertTrue(_is_positive_definite(upper_difference))

        for alpha_squared in (Fraction(0), Fraction(1), Fraction(4), Fraction(25)):
            response = (alpha_squared + Fraction(3, 4)) / (alpha_squared + 1)
            self.assertGreater(response, 0)
        self.assertEqual(Fraction(3, 4) - Fraction(1, 4), Fraction(1, 2))
        self.assertEqual(Fraction(3, 4) + Fraction(1, 4), Fraction(1))

        alpha_squared = Fraction(4)
        effective_dimension = sum(
            (alpha_squared / (alpha_squared + root) for root in diagonal),
            Fraction(0),
        )
        self.assertEqual(effective_dimension, Fraction(4, Fraction(19, 4)) + Fraction(1, 2) + Fraction(4, 13))

    def test_n1_weyl_scalar_and_relative_determinant_collapse(self) -> None:
        magnitudes = []
        for numerator, complement, denominator in ((3, 4, 5), (5, 12, 13), (7, 24, 25)):
            t = Fraction(numerator, denominator)
            transverse = Fraction(complement, denominator)
            self.assertEqual(t**2 + transverse**2, 1)
            q = transverse**2
            a_compression = t**2
            residual = t * transverse
            weyl_at_ground = -a_compression
            self.assertEqual(q, 1 - t**2)
            self.assertEqual(residual**2, q * (1 - q))
            self.assertEqual(weyl_at_ground, -t**2)
            magnitudes.append(abs(weyl_at_ground))
        self.assertGreater(magnitudes[0], magnitudes[1])
        self.assertGreater(magnitudes[1], magnitudes[2])

        t = Fraction(3, 5)
        transverse = Fraction(4, 5)
        spectral_parameter = Fraction(-1)
        m_entry = t**2 + transverse**2 / 2
        h_entry = Fraction(1)
        determinant_ratio = -(
            (t**2 - spectral_parameter) / (1 - spectral_parameter)
        )
        self.assertEqual(-m_entry / h_entry, Fraction(-17, 25))
        self.assertEqual(-m_entry / h_entry, determinant_ratio)

        q = transverse**2
        coupling = t * transverse
        d_s = q - spectral_parameter - coupling**2 / (t**2 - spectral_parameter)
        self.assertEqual(d_s, 1 / m_entry)
        alpha_s = Fraction(1)
        self.assertEqual(alpha_s, ((-spectral_parameter) * (1 - spectral_parameter)) / (1 - spectral_parameter))

    def test_coefficient_formula_cone_and_alternating_counterexample(self) -> None:
        squares = (Fraction(1), Fraction(4))
        xi = (Fraction(3, 4), Fraction(1, 8), Fraction(0))
        self.assertEqual(xi[0] + 2 * xi[1] + 2 * xi[2], 1)

        coefficients = [Fraction(0)] * 3
        coefficients[2] = Fraction(1)
        for j in range(2):
            affine = _elementary_symmetric(squares, 2 - j)
            affine -= 2 * sum(
                (
                    squares[n]
                    * xi[n + 1]
                    * _elementary_symmetric(
                        tuple(value for index, value in enumerate(squares) if index != n),
                        1 - j,
                    )
                    for n in range(2)
                ),
                Fraction(0),
            )
            homogeneous = _elementary_symmetric(squares, 2 - j) * xi[0]
            homogeneous += 2 * sum(
                (
                    _elementary_symmetric(
                        tuple(value for index, value in enumerate(squares) if index != n),
                        2 - j,
                    )
                    * xi[n + 1]
                    for n in range(2)
                ),
                Fraction(0),
            )
            self.assertEqual(affine, homogeneous)
            coefficients[j] = affine

        self.assertEqual(coefficients, [Fraction(3), Fraction(19, 4), Fraction(1)])
        self.assertTrue(all(coefficient > 0 for coefficient in coefficients))
        self.assertEqual(coefficients, _poly_from_positive_roots((Fraction(3, 4), Fraction(4))))
        self.assertEqual(coefficients[0], factorial(2) ** 2 * xi[0])
        self.assertEqual(_elementary_symmetric((Fraction(1),), 2), 0)

        alternating = (Fraction(3), Fraction(-11), Fraction(10))
        self.assertEqual(alternating[0] + 2 * alternating[1] + 2 * alternating[2], 1)
        cosine = Fraction(11, 40)
        cosine_double = 2 * cosine**2 - 1
        trigonometric_value = alternating[0] + 2 * alternating[1] * cosine + 2 * alternating[2] * cosine_double
        self.assertEqual(trigonometric_value, Fraction(-801, 40))
        self.assertLess(trigonometric_value, 0)

    def test_shifted_coefficient_radius_and_scale_invariant_reserve(self) -> None:
        n_squared = Fraction(1)
        xi_0 = Fraction(2, 3)
        xi_1 = Fraction(1, 6)
        xi_norm_squared = xi_0**2 + 2 * xi_1**2
        unit_x0_squared = xi_0**2 / xi_norm_squared
        x_eigenvalue = 1 - 2 * xi_1
        m_2 = 2 * n_squared * abs(xi_1)
        radius_bound = n_squared + m_2
        self.assertEqual(xi_norm_squared, Fraction(1, 2))
        self.assertEqual(unit_x0_squared, Fraction(8, 9))
        self.assertEqual(x_eigenvalue, Fraction(2, 3))
        self.assertLessEqual(x_eigenvalue, radius_bound)

        even_gap = Fraction(27, 8)
        k_minimum = Fraction(3)
        t_minus_minimum = k_minimum / x_eigenvalue
        self.assertEqual(k_minimum, even_gap * unit_x0_squared)
        certified_odd_floor = even_gap * unit_x0_squared / radius_bound
        self.assertEqual(certified_odd_floor, Fraction(9, 4))
        self.assertGreaterEqual(t_minus_minimum, certified_odd_floor)

        comparison_gap = Fraction(2)
        schur_surplus = Fraction(1)
        ritz_lowering = Fraction(3, 4)
        coefficient_condition = radius_bound * xi_norm_squared / xi_0**2
        self.assertEqual(coefficient_condition, Fraction(3, 2))
        self.assertLessEqual(ritz_lowering, schur_surplus)
        self.assertLess((schur_surplus / comparison_gap) * coefficient_condition, 1)
        self.assertLess(schur_surplus, comparison_gap * unit_x0_squared / radius_bound)
        self.assertGreater(t_minus_minimum - ritz_lowering, 0)


if __name__ == "__main__":
    unittest.main()
