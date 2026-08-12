from __future__ import annotations

import copy
from decimal import Decimal, localcontext
from fractions import Fraction
import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "PROJECTED_ANCHOR_ORIGIN_JET_ONE_HEIGHT_GATE_SOURCE_LOCK.json"
VERSION = "0.49.0-projected-anchor-origin-jet-one-height-gate"
EXPECTED_SEMANTIC_SHA256 = "972b72170a533ba7aa326196d37fc7674bdc96693940a7a735d139d3da9ae06b"
EXPECTED_DEPENDENCIES = {
    "ZERO_HEIGHT_CURVATURE_COEFFICIENT_RESERVE_SOURCE_LOCK.json",
    "PROJECTED_STATE_NORM_SOURCE_LOCK.json",
    "notes/PROJECTION_RATE_THEOREM.md",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md",
    "notes/PROJECTED_ANCHOR_ORIGIN_JET_AND_ONE_HEIGHT_GATE.md",
}
EXPECTED_EXTERNAL = (
    "CCM-ZST-v1",
    "arXiv:2511.22755v1",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
)
TRUE_STATUS_KEYS = {
    "projected_anchor_origin_jet_one_height_gate_source_locked",
    "projected_anchor_origin_two_jet_convergence_proved",
    "projected_anchor_zero_height_coefficient_rate_proved",
    "fixed_height_zero_trace_product_sandwich_proved",
    "height_half_pole_leverage_reconstruction_proved",
    "origin_wronskian_exact_norm_proved",
    "zero_height_logarithmic_ground_transfer_gate_proved",
}
FALSE_STATUS_KEYS = {
    "actual_zero_height_trace_bound_proved",
    "actual_p1_over_p0_rate_proved",
    "actual_origin_projective_curvature_bound_proved",
    "actual_zero_height_relative_odd_response_rate_proved",
    "actual_zero_height_residual_gap_L5over2_rate_proved",
    "actual_zero_height_one_solve_L5over2_rate_proved",
    "actual_shifted_even_complement_sign_proved",
}
REQUIRED_FORMULAS = {
    "comparison_error",
    "origin_modes",
    "origin_functional_norm",
    "zero_tail",
    "curvature_tail",
    "weighted_fourier_tail",
    "zero_jet_bound",
    "curvature_jet_bound",
    "anchor_schedule",
    "anchor_jet_limit",
    "coefficient_curvature_identity",
    "anchor_coefficient_rate",
    "exterior_product",
    "fixed_height_product",
    "fixed_height_sandwich",
    "pole_factorization",
    "pole_leverage",
    "pole_cofactor",
    "relative_odd_response",
    "relative_response_target",
    "origin_wronskian_norm",
    "residual_gap_gate",
    "one_solve_gate",
    "orientation_sharpness",
    "normalization_rejection",
}
EXPECTED_ADMISSIONS = {
    "actual_arithmetic_coefficient_cone_claimed",
    "actual_ground_anchor_convergence_claimed",
    "actual_ground_origin_curvature_bound_claimed",
    "actual_ground_p1_over_p0_rate_claimed",
    "actual_residual_gap_L5over2_rate_claimed",
    "actual_shifted_even_complement_sign_claimed",
    "actual_one_solve_L5over2_rate_claimed",
    "api_key_read",
    "binary64_parameters_used",
    "cached_matrix_or_eigenvector_read",
    "decimal_zero_list_read",
    "determinant_limit_claimed",
    "environment_secret_read",
    "equation_5_2_claimed",
    "exterior_lattice_factor_omitted",
    "finite_diagnostic_promoted_to_asymptotic",
    "fourier_sign_changed",
    "global_weil_positivity_assumed",
    "inversion_reflection_dropped",
    "lambda_squared_mixed_with_lambda",
    "locally_uniform_characteristic_convergence_proved",
    "non_effective_O_constant_instantiated",
    "nonpositive_gap_reported_as_pass",
    "prime_block_sign_changed",
    "prime_power_endpoint_omitted",
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
    "riemann_hypothesis_assumed_or_claimed",
    "secret_serialized",
    "source_normalization_changed",
    "unit_source_normalization_substituted",
    "zero_table_used",
}


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _pairs_no_duplicates(pairs: list[tuple[str, object]]) -> dict[str, object]:
    out: dict[str, object] = {}
    for key, value in pairs:
        if key in out:
            raise ValueError(f"duplicate JSON key: {key}")
        out[key] = value
    return out


def _strict_load(path: Path) -> dict[str, object]:
    value = json.loads(
        path.read_text(encoding="utf-8"),
        object_pairs_hook=_pairs_no_duplicates,
        parse_float=lambda token: (_ for _ in ()).throw(
            ValueError(f"JSON float forbidden: {token}")
        ),
        parse_constant=lambda token: (_ for _ in ()).throw(
            ValueError(f"non-finite JSON number forbidden: {token}")
        ),
    )
    if not isinstance(value, dict):
        raise ValueError("source lock must be a JSON object")
    return value


def _semantic_sha256(value: dict[str, object]) -> str:
    canonical = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=True,
    ).encode("utf-8")
    return hashlib.sha256(canonical).hexdigest()


def _validate_lock(lock: dict[str, object]) -> None:
    if _semantic_sha256(lock) != EXPECTED_SEMANTIC_SHA256:
        raise ValueError("source-lock semantic digest mismatch")
    if lock.get("schema") != (
        "xi-prolate-projected-anchor-origin-jet-one-height-gate-source-lock-v1"
    ):
        raise ValueError("wrong schema")
    if lock.get("checkpoint_version") != VERSION:
        raise ValueError("wrong checkpoint version")
    if lock.get("terminal_state") != "P0_INVALIDATED":
        raise ValueError("wrong formal state")

    dependencies = lock.get("dependencies")
    if not isinstance(dependencies, list):
        raise ValueError("dependencies must be a list")
    paths = {entry.get("path") for entry in dependencies if isinstance(entry, dict)}
    if paths != EXPECTED_DEPENDENCIES or len(paths) != len(dependencies):
        raise ValueError("dependency set mismatch")
    for entry in dependencies:
        if not isinstance(entry, dict):
            raise ValueError("invalid dependency entry")
        path = entry.get("path")
        digest = entry.get("sha256")
        if not isinstance(path, str) or not isinstance(digest, str):
            raise ValueError("invalid dependency path or digest")
        if _sha256(ROOT / path) != digest:
            raise ValueError(f"dependency hash mismatch: {path}")

    external = lock.get("external_sources")
    if not isinstance(external, list) or len(external) != 1:
        raise ValueError("wrong external source count")
    source = external[0]
    if not isinstance(source, dict):
        raise ValueError("invalid external source")
    observed = (
        source.get("id"),
        source.get("version"),
        source.get("vendored_path"),
        source.get("sha256"),
    )
    if observed != EXPECTED_EXTERNAL:
        raise ValueError("external source mismatch")
    vendored_path = source.get("vendored_path")
    source_digest = source.get("sha256")
    if not isinstance(vendored_path, str) or not isinstance(source_digest, str):
        raise ValueError("invalid external source path or digest")
    if _sha256(ROOT / vendored_path) != source_digest:
        raise ValueError("external source byte hash mismatch")

    conventions = lock.get("locked_conventions")
    if not isinstance(conventions, dict):
        raise ValueError("missing conventions")
    critical_conventions = {
        "fourier_transform": "hat(f)(z)=integral f(y)*exp(-i*z*y) dy",
        "centered_basis": (
            "phi_n(y)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*y/L), abs(n)<=N"
        ),
        "prime_block_sign": "minus, exactly as source equation (3.19)",
        "limiting_transform": (
            "hat(E(h)(exp(.)))(z)=Xi(z)/4 in the printed source normalization"
        ),
    }
    for key, expected in critical_conventions.items():
        if conventions.get(key) != expected:
            raise ValueError(f"critical convention changed: {key}")

    formulas = lock.get("locked_formulas")
    if not isinstance(formulas, dict) or set(formulas) != REQUIRED_FORMULAS:
        raise ValueError("formula set mismatch")
    critical_formulas = {
        "curvature_jet_bound": (
            "abs(ell_2(p_(lambda,N))+Xi''(0)/8)<=L^(5/2)*A_lambda/"
            "(8*sqrt(5))+C_star*L^(7/2)/(4*sqrt(10)*pi^3*N^(5/2))"
            "+T_2(lambda)"
        ),
        "anchor_schedule": (
            "delta_lambda=O(lambda^(-2)) and N/L^(7/5)->infinity imply the "
            "normalized anchor origin two-jet limit"
        ),
        "coefficient_curvature_identity": (
            "(L/(2*pi))^2*<z_N,v>/v_0=ell_2(v)/ell_0(v)-"
            "(L/(2*pi))^2*sum_(n>N)n^(-2)"
        ),
        "fixed_height_sandwich": (
            "log(B_sigma)/sigma^2<=Z_0<=(B_sigma-1)/sigma^2"
        ),
        "relative_odd_response": (
            "M_N(1/2)/M_N(0)=4*sinh(L/4)/L*[1+<g_alpha,T_-^(-1)*beta>]"
            "/[1+<g_0,T_-^(-1)*beta>], alpha=L/(4*pi)"
        ),
    }
    for key, expected in critical_formulas.items():
        if formulas.get(key) != expected:
            raise ValueError(f"critical formula changed: {key}")

    domains = lock.get("locked_domains")
    if not isinstance(domains, dict):
        raise ValueError("missing domains")
    if "N/L^2 bounded away from zero" not in str(domains.get("anchor_coefficient_rate")):
        raise ValueError("anchor exterior schedule omitted")
    if "positive lower enclosure for gamma" not in str(domains.get("ground_transfer")):
        raise ValueError("positive gap enclosure omitted")
    if "abs(K_0) is bounded below" not in str(domains.get("ground_transfer")):
        raise ValueError("anchor origin reserve omitted")

    admissions = lock.get("source_admissions")
    if not isinstance(admissions, dict) or set(admissions) != EXPECTED_ADMISSIONS:
        raise ValueError("admission set mismatch")
    if any(value is not False for value in admissions.values()):
        raise ValueError("a forbidden admission was promoted")

    boundary = lock.get("claim_boundary")
    if not isinstance(boundary, dict):
        raise ValueError("missing claim boundary")
    if boundary.get("checkpoint_version") != VERSION:
        raise ValueError("wrong claim-boundary version")
    if boundary.get("formal_status") != "P0_INVALIDATED":
        raise ValueError("wrong claim-boundary status")
    proved = boundary.get("proved")
    not_proved = boundary.get("not_proved")
    if not isinstance(proved, list) or len(proved) != 6:
        raise ValueError("wrong proved-claim inventory")
    if not isinstance(not_proved, list):
        raise ValueError("missing not-proved inventory")
    joined = " ".join(str(item) for item in not_proved)
    for phrase in (
        "actual arithmetic coefficient cone",
        "actual relative odd-response estimate",
        "equation (5.2)",
        "locally uniform determinant convergence",
    ):
        if phrase not in joined:
            raise ValueError(f"claim boundary omitted: {phrase}")


def _dot(left: tuple[Fraction, ...], right: tuple[Fraction, ...]) -> Fraction:
    return sum(a * b for a, b in zip(left, right, strict=True))


class ProjectedAnchorOriginJetOneHeightGateTests(unittest.TestCase):
    def test_source_lock_hashes_status_and_claim_boundary(self) -> None:
        _validate_lock(_strict_load(LOCK_PATH))
        p0 = _strict_load(ROOT / "P0_STATUS.json")
        project = _strict_load(ROOT / "PROJECT_STATUS.json")
        handoff = _strict_load(ROOT / "HANDOFF_MANIFEST.json")
        self.assertEqual(p0["artifact_version"], project["artifact_version"])
        self.assertEqual(project["artifact_version"], handoff["artifact_version"])
        self.assertEqual(p0["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(project["overall_status"], "P0_INVALIDATED")
        self.assertEqual(handoff["terminal_state"], "P0_INVALIDATED")
        for claims in (p0["component_claims"], project, handoff["claim_status"]):
            for key in TRUE_STATUS_KEYS:
                self.assertIs(claims[key], True)
            for key in FALSE_STATUS_KEYS:
                self.assertIs(claims[key], False)

    def test_centered_origin_mode_formulas_and_norm(self) -> None:
        # After scaling out L^(5/2), the n!=0 integration-by-parts endpoint
        # term is (-1)^n/(4*pi^2*n^2); the centered phase cancels (-1)^n.
        for n in range(1, 9):
            raw_endpoint_coefficient = Fraction((-1) ** n, 4 * n * n)
            centered = ((-1) ** n) * raw_endpoint_coefficient
            self.assertEqual(centered, Fraction(1, 4 * n * n))
        self.assertEqual(Fraction(1, 2) * Fraction(1, 12), Fraction(1, 24))
        # Integral of (y^2/2)^2 on [-L/2,L/2], with L^5 scaled out.
        self.assertEqual(Fraction(1, 4) * Fraction(1, 80), Fraction(1, 320))

    def test_weighted_fourier_tail_keeps_both_signs_and_sharp_schedule(self) -> None:
        # Scale out L^7/pi^6.  One sign contributes 1/(64*n^6).
        for n in range(1, 8):
            one_sign = Fraction(1, 64 * n**6)
            self.assertEqual(2 * one_sign, Fraction(1, 32 * n**6))
        # L^(7/2)/N^(5/2) vanishes for N=L^a precisely when a>7/5.
        threshold = Fraction(7, 5)
        for exponent, should_vanish in (
            (Fraction(7, 5), False),
            (Fraction(3, 2), True),
            (Fraction(2), True),
            (Fraction(7, 2), True),
        ):
            residual_power = Fraction(7, 2) - Fraction(5, 2) * exponent
            self.assertEqual(residual_power < 0, should_vanish)
        self.assertEqual(threshold, Fraction(7, 5))

    def test_coefficient_curvature_identity_retains_exterior(self) -> None:
        # Write w_n=sqrt(2)*v_n/v_0.  Coefficients are tracked as
        # a+b/pi^2, so no transcendental approximation enters the identity.
        weights = (Fraction(2, 3), Fraction(-5, 7), Fraction(11, 13))
        harmonic = sum(Fraction(1, n * n) for n in range(1, 4))
        weighted = sum(weights[n - 1] / (n * n) for n in range(1, 4))
        # A pair (a,b) denotes a+b/pi^2 after L^2 has been scaled out.
        ell_ratio = (Fraction(1, 24), weighted / 4)
        exterior = (Fraction(1, 24), -harmonic / 4)
        z_scaled = (Fraction(0), (harmonic + weighted) / 4)
        reconstructed = (
            ell_ratio[0] - exterior[0],
            ell_ratio[1] - exterior[1],
        )
        self.assertEqual(reconstructed, z_scaled)

        # O(L^-2) for the coefficient functional additionally needs 1/N=O(L^-2).
        for length in range(2, 9):
            quadratic_n = 3 * length * length
            self.assertLessEqual(Fraction(length * length, quadratic_n), Fraction(1, 3))
        # N=L^(3/2) beats the 7/5 two-jet threshold but not the exterior rate.
        exterior_losses = []
        for root in range(2, 9):
            length = root * root
            n_value = root**3
            exterior_losses.append(Fraction(length * length, n_value))
        self.assertEqual(exterior_losses, [Fraction(root) for root in range(2, 9)])

    def test_fixed_height_product_sandwich_and_n1_sharpness(self) -> None:
        sigma_squared = Fraction(1, 4)
        root_squares = (Fraction(2), Fraction(3), Fraction(5))
        trace = sum(Fraction(1, 1) / root for root in root_squares)
        product = Fraction(1)
        for root in root_squares:
            product *= 1 + sigma_squared / root
        self.assertLessEqual(trace, (product - 1) / sigma_squared)
        with localcontext() as context:
            context.prec = 80
            decimal_product = Decimal(product.numerator) / Decimal(product.denominator)
            decimal_sigma = Decimal(sigma_squared.numerator) / Decimal(
                sigma_squared.denominator
            )
            decimal_trace = Decimal(trace.numerator) / Decimal(trace.denominator)
            self.assertLessEqual(decimal_product.ln() / decimal_sigma, decimal_trace)

        one_root = Fraction(7, 3)
        one_product = 1 + sigma_squared / one_root
        self.assertEqual(
            (one_product - 1) / sigma_squared,
            Fraction(1, 1) / one_root,
        )

    def test_pole_factorization_and_even_cancellation_exactly(self) -> None:
        length = Fraction(3)
        pi_proxy = Fraction(22, 7)
        modes = tuple(range(-3, 4))

        def avec(n: int) -> Fraction:
            return length / (length**2 + 16 * pi_proxy**2 * n * n)

        def dvec(n: int) -> Fraction:
            return 4 * pi_proxy * n / (length**2 + 16 * pi_proxy**2 * n * n)

        def kernel(n: int, m: int) -> Fraction:
            denominator = (
                (length**2 + 16 * pi_proxy**2 * n * n)
                * (length**2 + 16 * pi_proxy**2 * m * m)
            )
            return (length**2 - 16 * pi_proxy**2 * n * m) / denominator

        for n in modes:
            for m in modes:
                self.assertEqual(kernel(n, m), avec(n) * avec(m) - dvec(n) * dvec(m))

        vector = {
            -3: Fraction(2, 5),
            -2: Fraction(-1, 7),
            -1: Fraction(4, 9),
            0: Fraction(3, 2),
            1: Fraction(4, 9),
            2: Fraction(-1, 7),
            3: Fraction(2, 5),
        }
        a_dot = sum(avec(n) * vector[n] for n in modes)
        d_dot = sum(dvec(n) * vector[n] for n in modes)
        quadratic = sum(
            vector[n] * kernel(n, m) * vector[m] for n in modes for m in modes
        )
        self.assertEqual(d_dot, 0)
        self.assertEqual(quadratic, a_dot**2)

    def test_pole_cofactor_reconstructs_ground_projector(self) -> None:
        # T has kernel x=(2,1), and adj(T)=x*x^T.
        x = (Fraction(2), Fraction(1))
        matrix_t = ((Fraction(1), Fraction(-2)), (Fraction(-2), Fraction(4)))
        adjugate_t = ((matrix_t[1][1], -matrix_t[0][1]), (-matrix_t[1][0], matrix_t[0][0]))
        self.assertEqual(adjugate_t, ((Fraction(4), Fraction(2)), (Fraction(2), Fraction(1))))
        ell = (Fraction(3), Fraction(4))
        matrix_p = tuple(
            tuple(2 * ell[i] * ell[j] for j in range(2)) for i in range(2)
        )
        xpx = _dot(x, tuple(_dot(row, x) for row in matrix_p))
        trace_p_adj = sum(matrix_p[i][j] * adjugate_t[j][i] for i in range(2) for j in range(2))
        length = Fraction(5)
        denominator = 2 * length * adjugate_t[0][0]
        self.assertEqual(trace_p_adj, xpx)
        self.assertEqual(trace_p_adj / denominator, xpx / (2 * length * x[0] ** 2))

        # N=1 Cauchy/odd-response fixture.  Boundary normalization is
        # xi_0+2*xi_1=1, and h(i*alpha)=i*A(alpha)/alpha exactly.
        xi_1 = Fraction(2, 11)
        xi_0 = 1 - 2 * xi_1
        alpha = Fraction(3, 5)
        cauchy_imaginary_part = xi_0 / alpha + 2 * alpha * xi_1 / (1 + alpha**2)
        response = 1 - 2 * xi_1 / (1 + alpha**2)
        self.assertEqual(cauchy_imaginary_part, response / alpha)
        self.assertEqual(1 - 2 * xi_1, xi_0)

    def test_origin_wronskian_norm_and_residual_gap_sharpness(self) -> None:
        length = Fraction(4)
        sqrt_length = Fraction(2)
        length_five_halves = Fraction(32)
        pi_proxy = Fraction(22, 7)
        k0 = Fraction(3, 5)
        k2 = Fraction(-2, 7)
        nmax = 4
        ell0 = (sqrt_length,) + (Fraction(0),) * nmax
        # Use explicit rational coefficients: sqrt(2) is represented by a
        # formal basis scaling, so its squared contribution is multiplied by 2.
        zero_component = k0 * length_five_halves / 24 - k2 * sqrt_length
        nonzero_squared = (
            k0**2
            * length**5
            / (8 * pi_proxy**4)
            * sum(Fraction(1, n**4) for n in range(1, nmax + 1))
        )
        formula_norm_squared = zero_component**2 + nonzero_squared
        direct_nonzero_squared = sum(
            2
            * (k0 * length_five_halves / (4 * pi_proxy**2 * n**2)) ** 2
            for n in range(1, nmax + 1)
        )
        self.assertEqual(nonzero_squared, direct_nonzero_squared)
        self.assertEqual(formula_norm_squared, zero_component**2 + direct_nonzero_squared)
        self.assertEqual(ell0, (Fraction(2), Fraction(0), Fraction(0), Fraction(0), Fraction(0)))

        # Orientation-free sharpness: B=gamma*I and b parallel to unit j.
        gamma = Fraction(7, 3)
        residual = Fraction(5, 11)
        j_norm_squared = Fraction(13, 6)
        energy = residual**2 / gamma
        leverage = j_norm_squared / gamma
        self.assertEqual(
            energy * leverage,
            (residual / gamma) ** 2 * j_norm_squared,
        )

        # A commuting scalar shift gives ||(A-mu I)^(-1)b||<=||B^(-1)b||.
        diagonal_b = (Fraction(2), Fraction(5))
        forcing = (Fraction(3, 7), Fraction(-2, 9))
        shift = Fraction(1)
        z_mu = tuple(
            forcing[index] / (diagonal_b[index] + shift) for index in range(2)
        )
        solve = tuple(forcing[index] / diagonal_b[index] for index in range(2))
        z_norm_squared = _dot(z_mu, z_mu)
        tau_squared = _dot(solve, solve)
        self.assertLessEqual(z_norm_squared, tau_squared)
        ell0_vector = (Fraction(2), Fraction(0))
        j_vector = (Fraction(0), Fraction(32))
        self.assertLessEqual(_dot(ell0_vector, z_mu) ** 2, _dot(ell0_vector, ell0_vector) * tau_squared)
        self.assertLessEqual(_dot(j_vector, z_mu) ** 2, _dot(j_vector, j_vector) * tau_squared)

    def test_normalized_anchor_rescaling_cancels_exactly(self) -> None:
        scale = Fraction(17, 6)
        unnormalized_zero = Fraction(5, 7)
        unnormalized_curvature = Fraction(-11, 13)
        norm = Fraction(19, 10)
        source_jets = (
            unnormalized_zero / norm,
            unnormalized_curvature / norm,
        )
        unit_rescaled_jets = (
            (scale * unnormalized_zero) / (scale * norm),
            (scale * unnormalized_curvature) / (scale * norm),
        )
        self.assertEqual(unit_rescaled_jets, source_jets)
        self.assertNotEqual(scale * unnormalized_zero, unnormalized_zero)
        self.assertNotEqual(scale * norm, norm)

    def test_adversarial_mutations_fail_closed(self) -> None:
        base = _strict_load(LOCK_PATH)
        mutations: list[tuple[str, dict[str, object]]] = []

        wrong_fourier = copy.deepcopy(base)
        wrong_fourier["locked_conventions"]["fourier_transform"] = (  # type: ignore[index]
            "hat(f)(z)=integral f(y)*exp(+i*z*y) dy"
        )
        mutations.append(("Fourier sign", wrong_fourier))

        wrong_scalar = copy.deepcopy(base)
        wrong_scalar["locked_conventions"]["limiting_transform"] = (  # type: ignore[index]
            "hat(E(h)(exp(.)))(z)=Xi(z)"
        )
        mutations.append(("Xi scalar", wrong_scalar))

        wrong_curvature = copy.deepcopy(base)
        wrong_curvature["locked_formulas"]["curvature_jet_bound"] = (  # type: ignore[index]
            "abs(ell_2(p)-Xi''(0)/8)<=error"
        )
        mutations.append(("curvature sign", wrong_curvature))

        wrong_exterior = copy.deepcopy(base)
        wrong_exterior["locked_formulas"]["coefficient_curvature_identity"] = (  # type: ignore[index]
            "(L/(2*pi))^2*<z_N,v>/v_0=ell_2(v)/ell_0(v)"
        )
        mutations.append(("exterior tail", wrong_exterior))

        wrong_schedule = copy.deepcopy(base)
        wrong_schedule["locked_formulas"]["anchor_schedule"] = (  # type: ignore[index]
            "N/L tends to infinity"
        )
        mutations.append(("schedule", wrong_schedule))

        wrong_normalization = copy.deepcopy(base)
        wrong_normalization["source_admissions"][  # type: ignore[index]
            "unit_source_normalization_substituted"
        ] = True
        mutations.append(("normalization", wrong_normalization))

        nonpositive_gap = copy.deepcopy(base)
        nonpositive_gap["source_admissions"]["nonpositive_gap_reported_as_pass"] = True  # type: ignore[index]
        mutations.append(("gap", nonpositive_gap))

        secret_read = copy.deepcopy(base)
        secret_read["source_admissions"]["api_key_read"] = True  # type: ignore[index]
        mutations.append(("secret", secret_read))

        mandatory_admissions = (
            "binary64_parameters_used",
            "zero_table_used",
            "global_weil_positivity_assumed",
            "prime_power_endpoint_omitted",
            "lambda_squared_mixed_with_lambda",
            "inversion_reflection_dropped",
            "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
        )
        for key in mandatory_admissions:
            mutation = copy.deepcopy(base)
            mutation["source_admissions"][key] = True  # type: ignore[index]
            mutations.append((key, mutation))

        for label, mutation in mutations:
            with self.subTest(label=label):
                with self.assertRaises(ValueError):
                    _validate_lock(mutation)


if __name__ == "__main__":
    unittest.main()
