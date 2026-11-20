from __future__ import annotations

import copy
from fractions import Fraction
import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "ZERO_HEIGHT_CURVATURE_COEFFICIENT_RESERVE_SOURCE_LOCK.json"
VERSION = "0.48.0-zero-height-curvature-coefficient-reserve"
EXPECTED_SEMANTIC_SHA256 = "2276d39eecbe680ea91b45963494619da4384a38c7f17e055b2db06b37e98a87"
EXPECTED_DEPENDENCIES = {
    "GROUND_JET_WEYL_COEFFICIENT_CONE_SOURCE_LOCK.json",
    "notes/ZERO_HEIGHT_CURVATURE_COEFFICIENT_RESERVE.md",
    "vendor/CCM-ZST-2511.22755v1.pdf",
}
EXPECTED_EXTERNAL = (
    "CCM-ZST-v1",
    "arXiv:2511.22755v1",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
)
TRUE_STATUS_KEYS = {
    "zero_height_curvature_coefficient_reserve_source_locked",
    "zero_height_half_paired_trace_identity_proved",
    "origin_curvature_exterior_tail_identity_proved",
    "quantitative_coefficient_cone_reduction_proved",
    "mixed_adjugate_coefficient_gate_proved",
    "trace_shifted_odd_reserve_proved",
    "origin_projective_curvature_gate_proved",
    "origin_normalized_local_boundedness_conditional_proved",
}
FALSE_STATUS_KEYS = {
    "actual_zero_height_trace_bound_proved",
    "actual_p1_over_p0_rate_proved",
    "actual_origin_projective_curvature_bound_proved",
    "actual_positive_height_projector_separation_proved",
    "actual_shifted_trace_reserve_proved",
}
REQUIRED_FORMULAS = {
    "zero_height_trace",
    "coefficient_ratio",
    "curvature_with_exterior",
    "exterior_bound",
    "pencil_trace",
    "cofactor_trace",
    "principal_even_trace",
    "odd_resolvent_ratio",
    "ground_direction_ratio",
    "ground_direction_norm",
    "spatial_kernel",
    "second_moment",
    "fixed_height_domination",
    "two_height_floor",
    "origin_product",
    "local_bound",
    "local_boundedness_schedule_obstruction",
    "coefficient_propagation",
    "mixed_cofactor_coefficients",
    "bordered_cone",
    "trace_radius",
    "trace_shifted_reserve",
    "origin_projective_curvature",
    "origin_leverage",
    "fourier_origin_functionals",
    "positive_height_cofactor",
    "hellmann_feynman_ratio",
    "coefficient_probability",
    "n1_obstruction",
    "positive_ground_countermodel",
}
EXPECTED_ADMISSIONS = {
    "actual_zero_height_trace_bound_claimed",
    "actual_p1_over_p0_rate_claimed",
    "actual_origin_projective_curvature_bound_claimed",
    "actual_even_ground_coefficient_cone_claimed",
    "actual_pointwise_ground_nonnegativity_claimed",
    "actual_centered_second_moment_bound_claimed",
    "actual_shifted_trace_reserve_claimed",
    "actual_positive_height_projector_separation_claimed",
    "api_key_read",
    "binary64_parameters_used",
    "cached_matrix_or_eigenvector_read",
    "decimal_zero_list_read",
    "determinant_limit_claimed",
    "environment_secret_read",
    "equation_5_2_claimed",
    "exterior_lattice_tail_omitted",
    "finite_local_boundedness_promoted_to_limit_identification",
    "fourier_sign_changed",
    "full_paired_trace_substituted_for_half_paired_trace",
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
CRITICAL_FORMULAS = {
    "zero_height_trace": (
        "Z_0=sum_(k=1)^N rho_k^(-2)=(L/(2*pi))^2*p_1/p_0, "
        "rho_k=2*pi*s_k/L; this is the half-paired trace"
    ),
    "curvature_with_exterior": (
        "M_N''(0)/(2*M_N(0))=(L/(2*pi))^2*(p_1/p_0+sum_(n>N)n^(-2)); "
        "equivalently Z_0 is this quadratic logarithmic coefficient minus the "
        "positive exterior tail"
    ),
    "bordered_cone": (
        "p_(N-r)>0 iff det([[T_+,eta],[g_r^*,0]])<0 because the denominator "
        "is positive and the bordered determinant is -<g_r,adj(T_+)eta>"
    ),
    "trace_radius": (
        "inside the coefficient cone, lambda_max(X)<=Tr(X)=p_(N-1)="
        "sum_(n=1)^N n^2-2*sum_(n=1)^N n^2*xi_n"
    ),
    "local_bound": (
        "sup_(|z|<=R)|hat(x)(z)/hat(x)(0)|<=exp(R^2*(Z_0+"
        "(L/(2*pi))^2*sum_(n>N)n^(-2)))"
    ),
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
    if lock.get("schema") != "xi-prolate-zero-height-curvature-coefficient-reserve-source-lock-v1":
        raise ValueError("wrong schema")
    if lock.get("checkpoint_version") != VERSION:
        raise ValueError("wrong checkpoint version")
    if lock.get("terminal_state") != "P0_INVALIDATED":
        raise ValueError("wrong formal state")

    dependencies = lock.get("dependencies")
    if not isinstance(dependencies, list):
        raise ValueError("dependencies must be a list")
    paths = {entry.get("path") for entry in dependencies if isinstance(entry, dict)}
    if paths != EXPECTED_DEPENDENCIES:
        raise ValueError("dependency set mismatch")
    if len(dependencies) != len(paths):
        raise ValueError("duplicate dependency path")
    for entry in dependencies:
        if not isinstance(entry, dict):
            raise ValueError("invalid dependency entry")
        path = entry.get("path")
        digest = entry.get("sha256")
        if not isinstance(path, str) or not isinstance(digest, str):
            raise ValueError("invalid dependency path or hash")
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

    conventions = lock.get("locked_conventions")
    if not isinstance(conventions, dict):
        raise ValueError("missing conventions")
    if conventions.get("fourier_transform") != "hat(f)(z)=integral f(y)*exp(-i*z*y) dy":
        raise ValueError("Fourier convention changed")
    if conventions.get("prime_block_sign") != (
        "minus, retained inside the complete source matrix before every ground, "
        "pencil, inverse, determinant, cofactor, or leverage operation"
    ):
        raise ValueError("prime sign changed")
    if conventions.get("half_paired_trace") != (
        "Z_0=sum_(k=1)^N rho_k^(-2); the trace over both roots +/-rho_k is "
        "2*Z_0 and is not used in the locked formulas"
    ):
        raise ValueError("half-paired convention changed")
    if conventions.get("exterior_tail") != (
        "the finite curvature identity retains +(L/(2*pi))^2*sum_(n>N)n^(-2) "
        "before solving for the quotient trace"
    ):
        raise ValueError("exterior tail changed")

    formulas = lock.get("locked_formulas")
    if not isinstance(formulas, dict) or set(formulas) != REQUIRED_FORMULAS:
        raise ValueError("formula set mismatch")
    for key, expected in CRITICAL_FORMULAS.items():
        if formulas.get(key) != expected:
            raise ValueError(f"critical formula changed: {key}")

    domains = lock.get("locked_domains")
    if not isinstance(domains, dict):
        raise ValueError("missing domains")
    if "xi_0=x_0/c>0" not in str(domains.get("zero_height")):
        raise ValueError("zero-pair exclusion omitted")
    if "N/L^2 is bounded away from zero" not in str(domains.get("local_boundedness")):
        raise ValueError("local-boundedness schedule omitted")
    if "p_j>0" not in str(domains.get("trace_radius")):
        raise ValueError("trace-radius cone domain omitted")

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
    if not isinstance(proved, list) or len(proved) != 8:
        raise ValueError("wrong proved-claim inventory")
    not_proved = boundary.get("not_proved")
    if not isinstance(not_proved, list):
        raise ValueError("missing not-proved list")
    joined = " ".join(str(item) for item in not_proved)
    for phrase in (
        "actual arithmetic coefficient cone",
        "identification of any normal-family subsequential limit",
        "equation (5.2)",
    ):
        if phrase not in joined:
            raise ValueError(f"claim boundary omitted: {phrase}")


def _determinant(matrix: list[list[Fraction]]) -> Fraction:
    work = [row[:] for row in matrix]
    size = len(work)
    sign = 1
    value = Fraction(1)
    for col in range(size):
        pivot = next((row for row in range(col, size) if work[row][col]), None)
        if pivot is None:
            return Fraction(0)
        if pivot != col:
            work[col], work[pivot] = work[pivot], work[col]
            sign *= -1
        pivot_value = work[col][col]
        value *= pivot_value
        for row in range(col + 1, size):
            factor = work[row][col] / pivot_value
            for index in range(col + 1, size):
                work[row][index] -= factor * work[col][index]
    return sign * value


def _matvec(matrix: list[list[Fraction]], vector: tuple[Fraction, ...]) -> tuple[Fraction, ...]:
    return tuple(sum(row[col] * vector[col] for col in range(len(vector))) for row in matrix)


def _dot(left: tuple[Fraction, ...], right: tuple[Fraction, ...]) -> Fraction:
    return sum(a * b for a, b in zip(left, right, strict=True))


class ZeroHeightCurvatureCoefficientReserveTests(unittest.TestCase):
    def test_source_lock_hashes_conventions_and_boundaries(self) -> None:
        _validate_lock(_strict_load(LOCK_PATH))
        p0 = _strict_load(ROOT / "P0_STATUS.json")
        project = _strict_load(ROOT / "PROJECT_STATUS.json")
        handoff = _strict_load(ROOT / "HANDOFF_MANIFEST.json")
        self.assertEqual(p0["artifact_version"], project["artifact_version"])
        self.assertEqual(p0["artifact_version"], handoff["artifact_version"])
        self.assertEqual(p0["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(project["overall_status"], "P0_INVALIDATED")
        self.assertEqual(handoff["terminal_state"], "P0_INVALIDATED")
        for claims in (p0["component_claims"], project, handoff["claim_status"]):
            for key in TRUE_STATUS_KEYS:
                self.assertIs(claims[key], True)
            for key in FALSE_STATUS_KEYS:
                self.assertIs(claims[key], False)

    def test_first_coefficient_and_zero_trace_fixture(self) -> None:
        xi_0 = Fraction(3, 4)
        xi = [Fraction(1, 8), Fraction(0), Fraction(0)]
        roots = [Fraction(3, 4), Fraction(4), Fraction(9)]
        p_0 = roots[0] * roots[1] * roots[2]
        p_1 = roots[0] * roots[1] + roots[0] * roots[2] + roots[1] * roots[2]
        ratio = p_1 / p_0
        coefficient_ratio = sum(Fraction(1, n * n) for n in range(1, 4))
        coefficient_ratio += Fraction(2, 1) * sum(
            xi[n - 1] / (n * n) for n in range(1, 4)
        ) / xi_0
        self.assertEqual((p_0, p_1, ratio), (Fraction(27), Fraction(183, 4), Fraction(61, 36)))
        self.assertEqual(ratio, sum(Fraction(1, 1) / root for root in roots))
        self.assertEqual(ratio, coefficient_ratio)

    def test_noncommuting_pencil_trace_and_cofactor_fixture(self) -> None:
        matrix_k = [[Fraction(4), Fraction(1)], [Fraction(1), Fraction(1)]]
        matrix_t = [[Fraction(2), Fraction(1)], [Fraction(1), Fraction(1)]]
        inverse_k = [
            [Fraction(1, 3), Fraction(-1, 3)],
            [Fraction(-1, 3), Fraction(4, 3)],
        ]
        product = [
            [sum(inverse_k[i][k] * matrix_t[k][j] for k in range(2)) for j in range(2)]
            for i in range(2)
        ]
        adjugate_k = [[Fraction(1), Fraction(-1)], [Fraction(-1), Fraction(4)]]
        cofactor_trace = sum(
            adjugate_k[i][j] * matrix_t[j][i] for i in range(2) for j in range(2)
        )
        self.assertEqual((_determinant(matrix_k), _determinant(matrix_t)), (Fraction(3), Fraction(1)))
        self.assertEqual(product, [[Fraction(1, 3), Fraction(0)], [Fraction(2, 3), Fraction(1)]])
        self.assertEqual(product[0][0] + product[1][1], Fraction(4, 3))
        self.assertEqual(cofactor_trace, Fraction(4))
        self.assertEqual(
            _determinant(
                [
                    [Fraction(4) + 2, Fraction(1) + 1],
                    [Fraction(1) + 1, Fraction(1) + 1],
                ]
            ),
            Fraction(8),
        )

    def test_curvature_keeps_the_exterior_tail(self) -> None:
        quotient_sum = Fraction(4) + Fraction(1, 4)
        exterior_partial = sum(Fraction(9, n * n) for n in (3, 4, 5))
        product_coefficient = quotient_sum + exterior_partial
        self.assertEqual(exterior_partial, Fraction(769, 400))
        self.assertEqual(product_coefficient, Fraction(2469, 400))
        self.assertEqual(product_coefficient - exterior_partial, Fraction(17, 4))
        true_exterior_upper = exterior_partial + Fraction(9, 5)
        self.assertLess(exterior_partial, true_exterior_upper)
        self.assertLess(true_exterior_upper, Fraction(9, 2))

        # Formal pi^2 bookkeeping for the exact infinite tail in the N=3 fixture.
        harmonic_3 = Fraction(49, 36)
        correction = Fraction(1, 3)
        zero_trace_constant = Fraction(61, 36)
        self.assertEqual(zero_trace_constant - harmonic_3, correction)

    def test_bordered_mixed_cofactor_sign_fixture(self) -> None:
        t_bar = [
            [Fraction(1, 8), Fraction(-1, 4)],
            [Fraction(-1, 4), Fraction(1, 2)],
        ]
        adjugate = [
            [Fraction(1, 2), Fraction(1, 4)],
            [Fraction(1, 4), Fraction(1, 8)],
        ]
        eta = (Fraction(1), Fraction(2))
        g_0 = (Fraction(1), Fraction(2))
        g_1 = (Fraction(1), Fraction(0))
        adj_eta = _matvec(adjugate, eta)
        denominator = _dot(eta, adj_eta)
        self.assertEqual((_determinant(t_bar), adj_eta, denominator), (0, (1, Fraction(1, 2)), 2))
        self.assertEqual(_dot(g_0, adj_eta) / denominator, Fraction(1))
        self.assertEqual(_dot(g_1, adj_eta) / denominator, Fraction(1, 2))
        for vector, expected in ((g_0, Fraction(-2)), (g_1, Fraction(-1))):
            bordered = [
                [t_bar[0][0], t_bar[0][1], eta[0]],
                [t_bar[1][0], t_bar[1][1], eta[1]],
                [vector[0], vector[1], Fraction(0)],
            ]
            self.assertEqual(_determinant(bordered), expected)

    def test_n1_cone_no_go_and_trace_radius_reserve(self) -> None:
        for denominator in (2, 5, 11):
            t = Fraction(1, denominator)
            z = (1 - t) / 2
            a_0 = (1 - t) ** 2 / 2
            a_1 = t * (1 + t) / 2
            b = -t * (1 - t) / 2
            matrix = [[a_1, b, b], [b, a_0, b], [b, b, a_1]]
            ground = (z, t, z)
            odd = (Fraction(1), Fraction(0), Fraction(-1))
            second_even = (t, -(1 - t), t)
            gap = t * t + (1 - t) ** 2 / 2
            self.assertEqual(_matvec(matrix, ground), (0, 0, 0))
            self.assertEqual(_matvec(matrix, odd), tuple(t * value for value in odd))
            self.assertEqual(
                _matvec(matrix, second_even), tuple(gap * value for value in second_even)
            )
            self.assertEqual(Fraction(1) / t, denominator)

        # Independently reconstruct P(s)=s+L^2.  In pi-free units,
        # rho_1^2/(4*pi^2)=s_1^2/L^2=1 and 4*pi^2*Z_0=L^2/s_1^2=1.
        exterior_lower_bounds: list[Fraction] = []
        for length in (2, 4, 8):
            xi_0 = Fraction(length * length)
            xi_1 = (1 - xi_0) / 2
            p_0 = xi_0
            p_1 = Fraction(1)
            root = p_0
            self.assertEqual(-root + p_0, Fraction(0))
            self.assertEqual(root / (length * length), Fraction(1))
            self.assertEqual((length * length) * p_1 / p_0, Fraction(1))
            self.assertEqual(xi_0 + 2 * xi_1, Fraction(1))
            self.assertGreaterEqual(xi_0 - 2 * xi_1, Fraction(1))
            exterior_lower_bounds.append(Fraction(1) + Fraction(length * length, 4))

        # At R=2*pi, retaining only the n=2 exterior factor gives this
        # exact lower bound; the omitted quotient factor equals two.
        self.assertEqual(exterior_lower_bounds, [Fraction(2), Fraction(5), Fraction(17)])
        self.assertEqual(sorted(exterior_lower_bounds), exterior_lower_bounds)

        roots = (Fraction(3, 4), Fraction(4), Fraction(9))
        p_n_minus_1 = sum(roots)
        self.assertEqual(p_n_minus_1, Fraction(55, 4))
        self.assertLessEqual(max(roots), p_n_minus_1)
        xi_norm_squared = Fraction(1, 2)
        xi_0_squared = Fraction(4, 9)
        trace_conditioning = Fraction(2, 3) * xi_norm_squared / xi_0_squared
        shifted_product = Fraction(1, 6) / Fraction(1, 3) * trace_conditioning
        self.assertEqual((trace_conditioning, shifted_product), (Fraction(3, 4), Fraction(3, 8)))

    def test_projective_curvature_and_coefficient_propagation(self) -> None:
        k_0 = Fraction(3)
        k_2 = Fraction(5)
        z_0 = Fraction(1, 2)
        z_2 = Fraction(7, 4)
        w_0 = k_0 - z_0
        w_2 = k_2 - z_2
        jet = k_0 * z_2 - k_2 * z_0
        self.assertEqual(w_2 / w_0, k_2 / k_0 - jet / (k_0 * w_0))

        reciprocal_roots = (Fraction(4, 3), Fraction(1, 4), Fraction(1, 9))
        first = sum(reciprocal_roots)
        second = sum(
            reciprocal_roots[i] * reciprocal_roots[j]
            for i in range(3)
            for j in range(i + 1, 3)
        )
        third = reciprocal_roots[0] * reciprocal_roots[1] * reciprocal_roots[2]
        self.assertLessEqual(second, first**2 / 2)
        self.assertLessEqual(third, first**3 / 6)

    def test_adversarial_lock_mutations_fail_closed(self) -> None:
        lock = _strict_load(LOCK_PATH)
        mutations: list[dict[str, object]] = []

        changed = copy.deepcopy(lock)
        changed["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["locked_formulas"]["curvature_with_exterior"] = (
            "M_N''(0)/(2*M_N(0))=(L/(2*pi))^2*p_1/p_0"
        )
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["locked_conventions"]["half_paired_trace"] = "use the full paired trace"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["locked_conventions"]["prime_block_sign"] = "plus"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["locked_conventions"]["source_normalization"] = "unit norm"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["locked_conventions"]["prime_power_endpoint"] = "inclusive 1<k<=lambda"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["locked_conventions"]["inversion"] = "J*V_n=V_n"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["locked_formulas"]["coefficient_ratio"] = "wrong"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["source_admissions"]["actual_p1_over_p0_rate_claimed"] = True
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["locked_domains"]["local_boundedness"] = "Z_0 is uniformly bounded"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["dependencies"][1]["sha256"] = "0" * 64
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["claim_boundary"]["formal_status"] = "P0_DIAGNOSTIC_PASS"
        mutations.append(changed)

        changed = copy.deepcopy(lock)
        changed["dependencies"].append(copy.deepcopy(changed["dependencies"][0]))
        mutations.append(changed)

        for mutation in mutations:
            with self.subTest(mutation=mutations.index(mutation)):
                with self.assertRaises(ValueError):
                    _validate_lock(mutation)


if __name__ == "__main__":
    unittest.main()
