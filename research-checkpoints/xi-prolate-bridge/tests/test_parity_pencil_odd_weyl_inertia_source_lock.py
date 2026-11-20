from __future__ import annotations

import copy
from fractions import Fraction
import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "PARITY_PENCIL_ODD_WEYL_INERTIA_SOURCE_LOCK.json"
VERSION = "0.46.0-parity-pencil-odd-weyl-inertia"
EXPECTED_DEPENDENCIES = {
    "PROJECTIVE_WEDGE_PAIRED_TRACE_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "P0_SOURCE_LOCK.json",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md",
    "notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md",
    "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md",
    "notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md",
    "notes/PARITY_PENCIL_TRACE_REDUCTION.md",
    "notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md",
    "notes/EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
}
EXPECTED_EXTERNALS = {
    (
        "CCM-ZST-v1",
        "arXiv:2511.22755v1",
        "vendor/CCM-ZST-2511.22755v1.pdf",
    ),
}
TRUE_STATUS_KEYS = {
    "parity_pencil_odd_weyl_inertia_source_locked",
    "positive_parity_pencil_identity_proved",
    "quotient_effective_dimension_trace_identity_proved",
    "odd_resolvent_weyl_reconstruction_proved",
    "constrained_middle_graph_obstruction_proved",
    "even_ground_odd_inertia_equivalence_proved",
    "imaginary_quotient_pair_odd_inertia_count_proved",
    "pointwise_even_ground_positivity_odd_sign_criterion_proved",
}
FALSE_STATUS_KEYS = {
    "actual_parity_pencil_effective_dimension_bound_proved",
    "actual_odd_resolvent_weyl_bound_proved",
    "actual_even_ground_imaginary_axis_positivity_proved",
    "actual_even_ground_pointwise_nonnegative_proved",
    "actual_shifted_odd_ritz_margin_proved",
    "uniform_first_paired_trace_proved",
    "finite_quotient_trace_moment_limits_proved",
    "equation_5_2_proved",
    "local_uniform_characteristic_limit_proved",
}


def _load_no_duplicate_keys(path: Path) -> dict:
    def hook(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError(f"duplicate key: {key}")
            result[key] = value
        return result

    return json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=hook)


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _det2(matrix: tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]]) -> Fraction:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def _inverse2(
    matrix: tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]],
) -> tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]]:
    determinant = _det2(matrix)
    if determinant == 0:
        raise ZeroDivisionError("singular exact matrix")
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def _matmul2(
    left: tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]],
    right: tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]],
) -> tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]]:
    return tuple(
        tuple(sum((left[i][k] * right[k][j] for k in range(2)), Fraction(0)) for j in range(2))
        for i in range(2)
    )  # type: ignore[return-value]


def _transpose2(
    matrix: tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]],
) -> tuple[tuple[Fraction, Fraction], tuple[Fraction, Fraction]]:
    return ((matrix[0][0], matrix[1][0]), (matrix[0][1], matrix[1][1]))


def _validate(payload: dict) -> None:
    assert payload["schema"] == "xi-prolate-parity-pencil-odd-weyl-inertia-source-lock-v1"
    assert payload["claim_class"] == (
        "PARITY_PENCIL_TRACE_ODD_RESOLVENT_WEYL_AND_EVEN_GROUND_ODD_INERTIA_REDUCTION"
    )
    assert payload["checkpoint_version"] == VERSION
    assert payload["terminal_state"] == "P0_INVALIDATED"

    dependencies = payload["dependencies"]
    assert len(dependencies) == 11
    dependency_paths = [item["path"] for item in dependencies]
    assert len(dependency_paths) == len(set(dependency_paths))
    assert set(dependency_paths) == EXPECTED_DEPENDENCIES
    for item in dependencies:
        relative = Path(item["path"])
        assert not relative.is_absolute()
        assert ".." not in relative.parts
        assert item["role"]
        assert _sha256(ROOT / relative) == item["sha256"]

    external_sources = payload["external_sources"]
    assert len(external_sources) == 1
    external_paths = [item["vendored_path"] for item in external_sources]
    assert len(external_paths) == len(set(external_paths))
    assert {
        (item["id"], item["version"], item["vendored_path"])
        for item in external_sources
    } == EXPECTED_EXTERNALS
    for item in external_sources:
        assert _sha256(ROOT / item["vendored_path"]) == item["sha256"]

    conventions = payload["locked_conventions"]
    assert conventions["fourier_transform"] == "hat(f)(z)=integral f(x)*exp(-i*z*x) dx"
    assert conventions["prime_power_endpoint"] == "inclusive n<=lambda^2"
    assert conventions["prime_block_sign"].startswith("minus,")
    assert conventions["inversion"] == "J*V_n=V_(-n), equivalently Jf(x)=f(-x)"
    assert conventions["source_normalization"] == (
        "4*hat(k_lambda^+) tends to Xi; unit-normalizing h_lambda is rejected"
    )

    formulas = payload["locked_formulas"]
    for required in (
        "source_cauchy_displacement",
        "positive_parity_pencil",
        "relative_pencil_determinant",
        "physical_trace_moments",
        "effective_dimension",
        "middle_graph",
        "odd_resolvent_vectors",
        "weyl_scalar_system",
        "middle_weyl_reconstruction",
        "ground_alignment",
        "even_ground_factorization",
        "positive_symmetrizer",
        "odd_inertia_rational_function",
        "imaginary_pair_count",
        "odd_sign_equivalence",
        "imaginary_axis_transform",
        "shifted_odd_reserve",
        "n2_imaginary_axis_countermodel",
        "middle_graph_countermodel",
    ):
        assert required in formulas

    admissions = payload["source_admissions"]
    assert admissions
    assert all(value is False for value in admissions.values())

    boundary = payload["claim_boundary"]
    assert boundary["checkpoint_version"] == VERSION
    assert boundary["formal_status"] == "P0_INVALIDATED"
    proved = "\n".join(boundary["proved"])
    for required in (
        "positive parity-pencil",
        "effective-dimension",
        "odd-resolvent Weyl reconstruction",
        "complete odd-inertia transfer",
        "imaginary quotient pairs",
        "all-imaginary-axis transform positivity",
        "conditional quantitative shifted odd Ritz reserve",
    ):
        assert required in proved
    not_proved = "\n".join(boundary["not_proved"])
    for required in (
        "uniform effective-dimension",
        "actual odd-resolvent response vectors",
        "all-imaginary-axis positivity",
        "pointwise nonnegativity",
        "strict shifted odd Ritz margin",
        "equation (5.2)",
        "locally uniform determinant convergence",
    ):
        assert required in not_proved


class ParityPencilOddWeylInertiaSourceLockTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.lock = _load_no_duplicate_keys(LOCK_PATH)

    def test_live_lock_and_exact_dependency_source_sets_validate(self) -> None:
        _validate(self.lock)

    def test_status_manifests_preserve_proved_and_open_boundary(self) -> None:
        p0 = _load_no_duplicate_keys(ROOT / "P0_STATUS.json")
        project = _load_no_duplicate_keys(ROOT / "PROJECT_STATUS.json")
        handoff = _load_no_duplicate_keys(ROOT / "HANDOFF_MANIFEST.json")
        # This historical lock remains pinned to VERSION in _validate(); the
        # three live manifests advance together at later checkpoints.
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

    def test_adversarial_convention_hash_and_claim_mutations_fail_closed(self) -> None:
        mutations = (
            ("fourier_transform", "hat(f)(z)=integral f(x)*exp(+i*z*x) dx"),
            ("prime_power_endpoint", "inclusive n<=lambda"),
            ("prime_block_sign", "plus"),
            ("inversion", "Jf(x)=f(x)"),
            ("source_normalization", "unit norm"),
        )
        for key, value in mutations:
            with self.subTest(key=key):
                payload = copy.deepcopy(self.lock)
                payload["locked_conventions"][key] = value
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
        payload["source_admissions"]["actual_shifted_odd_ritz_margin_claimed"] = True
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["claim_boundary"]["not_proved"] = []
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["claim_boundary"]["formal_status"] = "P0_DIAGNOSTIC_PASS"
        with self.assertRaises(AssertionError):
            _validate(payload)

    def test_n1_parity_pencil_relative_determinant_and_trace_fixture(self) -> None:
        # C^*T_+C=2 and T_-=3 give the single generalized root s^2=2/3.
        c_t_plus_c = Fraction(2)
        t_minus = Fraction(3)
        root_squared = c_t_plus_c / t_minus
        self.assertEqual(root_squared, Fraction(2, 3))

        t = Fraction(4)
        pencil = c_t_plus_c + t * t_minus
        relative_determinant = pencil / (t_minus * (1 + t))
        response = 1 - Fraction(1, 3) / (1 + t)
        self.assertEqual(relative_determinant, Fraction(14, 15))
        self.assertEqual(relative_determinant, response)

        pencil_trace = t_minus / pencil
        quotient_root_trace = 1 / (root_squared + t)
        response_derivative = Fraction(1, 3) / (1 + t) ** 2
        log_derivative = response_derivative / response
        self.assertEqual(pencil_trace, Fraction(3, 14))
        self.assertEqual(pencil_trace, quotient_root_trace)
        self.assertEqual(log_derivative, pencil_trace - 1 / (1 + t))
        self.assertEqual(t * pencil_trace, Fraction(6, 7))

    def test_n1_odd_inertia_sign_fixture(self) -> None:
        # xi_0+2*xi_1=1.  Then X=1-2*xi_1 and
        # A_x(alpha)=(alpha^2+X)/(alpha^2+1).
        positive_xi_1 = Fraction(1, 6)
        positive_xi_0 = 1 - 2 * positive_xi_1
        positive_x = 1 - 2 * positive_xi_1
        positive_k = Fraction(2)
        positive_t_minus = positive_k / positive_x
        self.assertEqual(positive_xi_0, Fraction(2, 3))
        self.assertEqual(positive_x, Fraction(2, 3))
        self.assertEqual(positive_t_minus, Fraction(3))
        for alpha_squared in (Fraction(0), Fraction(1), Fraction(9)):
            self.assertGreater((alpha_squared + positive_x) / (alpha_squared + 1), 0)

        negative_xi_1 = Fraction(1)
        negative_xi_0 = 1 - 2 * negative_xi_1
        negative_x = 1 - 2 * negative_xi_1
        negative_k = Fraction(2)
        negative_t_minus = negative_k / negative_x
        self.assertEqual(negative_xi_0, Fraction(-1))
        self.assertEqual(negative_x, Fraction(-1))
        self.assertEqual(negative_t_minus, Fraction(-2))
        self.assertEqual((Fraction(1) + negative_x), 0)
        self.assertLess((Fraction(0) + negative_x) / (Fraction(0) + 1), 0)
        self.assertGreater((Fraction(4) + negative_x) / (Fraction(4) + 1), 0)

    def test_n2_imaginary_axis_countermodel_polynomial_and_symmetrizer(self) -> None:
        x_matrix = (
            (Fraction(173, 3), Fraction(340, 3)),
            (Fraction(-130, 3), Fraction(-248, 3)),
        )
        symmetrizer = (
            (Fraction(269), Fraction(430)),
            (Fraction(430), Fraction(689)),
        )
        trace_x = x_matrix[0][0] + x_matrix[1][1]
        determinant_x = _det2(x_matrix)
        self.assertEqual(trace_x, Fraction(-25))
        self.assertEqual(determinant_x, Fraction(144))
        self.assertGreater(symmetrizer[0][0], 0)
        self.assertEqual(_det2(symmetrizer), Fraction(441))
        self.assertEqual(_matmul2(symmetrizer, x_matrix), _matmul2(_transpose2(x_matrix), symmetrizer))

        t_minus = _matmul2(symmetrizer, _inverse2(x_matrix))
        self.assertEqual(t_minus, _transpose2(t_minus))
        self.assertLess(t_minus[0][0], 0)
        self.assertGreater(_det2(t_minus), 0)
        self.assertEqual(_det2(t_minus), Fraction(49, 16))

        for alpha_squared, expected in (
            (Fraction(4), Fraction(3, 2)),
            (Fraction(9), Fraction(0)),
            (Fraction(10), Fraction(-3, 77)),
            (Fraction(16), Fraction(0)),
            (Fraction(20), Fraction(11, 126)),
        ):
            numerator = alpha_squared**2 + trace_x * alpha_squared + determinant_x
            denominator = (alpha_squared + 1) * (alpha_squared + 4)
            self.assertEqual(numerator, (alpha_squared - 9) * (alpha_squared - 16))
            self.assertEqual(numerator / denominator, expected)

    def test_middle_weyl_countermodel_short(self) -> None:
        epsilon = Fraction(7, 3)
        low = epsilon / 2
        middle = 5 * epsilon / 6
        coupling_squared = epsilon**2 / 12
        omega = low - coupling_squared / middle
        self.assertEqual(omega, 2 * epsilon / 5)

        # Reconstruct ||f_L-E*C^{-1}f_C||^2 without irrational arithmetic.
        f_low_squared = epsilon**2 / 6
        f_low_times_coupling_times_f_middle = -(epsilon**3) / 36
        f_middle_squared = epsilon**2 / 18
        eta_squared = (
            f_low_squared
            - 2 * f_low_times_coupling_times_f_middle / middle
            + coupling_squared * f_middle_squared / middle**2
        )
        self.assertEqual(eta_squared, 6 * epsilon**2 / 25)
        self.assertEqual(eta_squared / omega**2, Fraction(3, 2))


if __name__ == "__main__":
    unittest.main()
