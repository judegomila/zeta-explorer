from __future__ import annotations

import copy
from decimal import Decimal, localcontext
from fractions import Fraction
import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "POLE_DELETED_SCALAR_RESERVE_GATE_SOURCE_LOCK.json"
VERSION = "0.50.0-pole-deleted-scalar-reserve-gate"
EXPECTED_SEMANTIC_SHA256 = "7db61872357378f50770024b2933bdb3a050e7b2ffcba5495f7eb2876b8eaed9"
EXPECTED_DEPENDENCIES = {
    "PROJECTED_ANCHOR_ORIGIN_JET_ONE_HEIGHT_GATE_SOURCE_LOCK.json",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md",
    "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md",
    "notes/GROUND_TRANSFORM_TILT_JET_REDUCTION.md",
    "notes/POLE_DELETED_SCALAR_RESERVE_GATE.md",
}
EXPECTED_EXTERNAL = (
    "CCM-ZST-v1",
    "arXiv:2511.22755v1",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
)
TRUE_STATUS_KEYS = {
    "pole_deleted_scalar_reserve_gate_source_locked",
    "pole_deleted_even_inertia_proved",
    "pole_deleted_ground_inverse_identity_proved",
    "zero_height_mixed_inverse_reserve_equivalence_proved",
    "pole_deleted_diagonal_resolvent_sufficient_gate_proved",
    "pole_deleted_odd_woodbury_reduction_proved",
    "pole_deleted_structural_countermodel_proved",
    "pole_deleted_principal_odd_cancellation_proved",
    "pole_deleted_bernstein_levy_form_proved",
    "pole_deleted_killed_markov_countermodel_proved",
}
FALSE_STATUS_KEYS = {
    "actual_pole_deleted_mixed_inverse_lower_bound_proved",
    "actual_pole_deleted_diagonal_resolvent_bound_proved",
    "actual_zero_height_relative_odd_response_rate_proved",
    "equation_5_2_proved",
    "local_uniform_characteristic_limit_proved",
}
REQUIRED_FORMULAS = {
    "shifted_parity_blocks",
    "pole_forms",
    "even_pole_deletion",
    "even_inertia",
    "inverse_ground_line",
    "mixed_inverse",
    "pole_ratio",
    "relative_odd_response",
    "exterior_product",
    "quotient_product",
    "mixed_product_identity",
    "zero_height_sandwich",
    "automatic_upper_scale",
    "exterior_bound",
    "uniform_reserve_equivalence",
    "adjugate_reconstruction",
    "rank_two_determinant",
    "diagonal_geometry",
    "diagonal_sufficient_gate",
    "schur_ground_coordinate",
    "schur_determinants",
    "schur_diagonal_identity",
    "height_half_principal_odd_cancellation",
    "height_half_determinant_response",
    "odd_pole_deletion",
    "odd_woodbury",
    "odd_response_quotient",
    "combined_multiplier",
    "nonpole_minimum",
    "complete_bernstein_levy_symbol",
    "levy_measure",
    "zero_extension_dirichlet_form",
    "levy_shift_location",
    "mixed_source_equation",
    "actual_arithmetic_target",
    "rational_countermodel",
    "killed_markov_countermodel",
    "cauchy_countermodel_response",
    "cauchy_countermodel_mixed_entry",
}
EXPECTED_ADMISSIONS = {
    "actual_arithmetic_mixed_inverse_lower_bound_proved",
    "actual_arithmetic_diagonal_resolvent_bound_proved",
    "actual_ground_anchor_convergence_claimed",
    "actual_ground_origin_curvature_bound_claimed",
    "actual_relative_odd_response_decay_proved",
    "actual_residual_gap_L5over2_rate_claimed",
    "actual_one_solve_L5over2_rate_claimed",
    "api_key_read",
    "binary64_parameters_used",
    "cached_matrix_or_eigenvector_read",
    "cauchy_countermodel_called_arithmetic",
    "decimal_zero_list_read",
    "determinant_limit_claimed",
    "environment_secret_read",
    "equation_5_2_claimed",
    "exterior_lattice_factor_omitted",
    "finite_diagnostic_promoted_to_asymptotic",
    "fourier_sign_changed",
    "global_weil_positivity_assumed",
    "unshifted_levy_positivity_promoted_to_mixed_reserve",
    "principal_minor_sign_assumed",
    "absolute_value_agmon_bound_claimed",
    "inversion_reflection_dropped",
    "lambda_squared_mixed_with_lambda",
    "locally_uniform_characteristic_convergence_proved",
    "non_effective_O_constant_instantiated",
    "nonpositive_gap_reported_as_pass",
    "pole_factor_changed",
    "pole_projection_dropped",
    "prime_block_sign_changed",
    "prime_power_endpoint_omitted",
    "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
    "riemann_hypothesis_assumed_or_claimed",
    "secret_serialized",
    "source_normalization_changed",
    "unit_source_normalization_substituted",
    "zero_table_used",
}


Vector = tuple[Fraction, Fraction]
Matrix = tuple[Vector, Vector]


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


def _validate_lock(lock: dict[str, object], *, check_digest: bool = True) -> None:
    if check_digest and _semantic_sha256(lock) != EXPECTED_SEMANTIC_SHA256:
        raise ValueError("source-lock semantic digest mismatch")
    if lock.get("schema") != "xi-prolate-pole-deleted-scalar-reserve-gate-source-lock-v1":
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
    if _sha256(ROOT / EXPECTED_EXTERNAL[2]) != EXPECTED_EXTERNAL[3]:
        raise ValueError("external source byte hash mismatch")

    conventions = lock.get("locked_conventions")
    if not isinstance(conventions, dict):
        raise ValueError("missing conventions")
    critical_conventions = {
        "fourier_transform": "hat(f)(z)=integral f(y)*exp(-i*z*y) dy",
        "matrix_assembly": (
            "form the complete real-axis Q=pole+archimedean-prime matrix with every "
            "prime power n<=lambda^2 before taking a ground shift, parity compression, "
            "inverse, cofactor, or pole deletion"
        ),
        "prime_block_sign": "minus, exactly as source equation (3.19)",
        "pole_deletion_order": (
            "assemble and shift the complete source matrix first; subtract only the "
            "finite projected pole form afterward"
        ),
        "finite_pole_vectors": (
            "p_+=P_(E_N^+)cosh(y/2) and p_-=P_(E_N^-)sinh(y/2); continuum "
            "vectors are not substituted"
        ),
        "nonpole_shift": (
            "m_0=m_lambda(0) is subtracted exactly before the Bernstein-Levy form "
            "is written; the interval state is zero-extended before every translation"
        ),
        "half_paired_trace": (
            "Z_0=sum_(k=1)^N rho_k^(-2); the trace over both roots is not substituted"
        ),
        "parameter_ingestion": (
            "decimal source parameters are parsed directly and never through binary64"
        ),
        "secret_boundary": "API keys and environment secrets are neither read nor serialized",
    }
    for key, expected in critical_conventions.items():
        if conventions.get(key) != expected:
            raise ValueError(f"critical convention changed: {key}")

    formulas = lock.get("locked_formulas")
    if not isinstance(formulas, dict) or set(formulas) != REQUIRED_FORMULAS:
        raise ValueError("formula set mismatch")
    critical_formulas = {
        "pole_forms": "P_+=2*|p_+><p_+| and P_-=-2*|p_-><p_-|",
        "even_pole_deletion": "S_+=T_+-2*|p_+><p_+|",
        "inverse_ground_line": (
            "with h=<p_+,x>!=0, S_+^(-1)*p_+=-x/(2*h) and "
            "<p_+,S_+^(-1)*p_+>=-1/2"
        ),
        "mixed_product_identity": "d_0=-1/(2*sqrt(L)*E*B)",
        "zero_height_sandwich": (
            "4*log(-1/(2*sqrt(L)*E*d_0))<=Z_0<="
            "4*(-1/(2*sqrt(L)*E*d_0)-1)"
        ),
        "rank_two_determinant": (
            "det(T_+ + tau*|e_0^+><e_0^+|)=-2*tau*d_0^2*det(S_+) for tau>0"
        ),
        "diagonal_geometry": (
            "c_0=<e_0^+,S_+^(-1)*e_0^+> satisfies c_0+2*d_0^2>=0"
        ),
        "schur_diagonal_identity": (
            "c_0=-2*(1-2*mu)*d_0^2 and c_0+2*d_0^2=4*mu*d_0^2; "
            "c_0<0 iff mu<1/2"
        ),
        "schur_ground_coordinate": (
            "for T_+=[[a,b^*],[b,C]], p_+=(p_0,p), C>0, "
            "g=p_0-<p,C^(-1)b>, and mu=<p,C^(-1)p>, one has h=x_0*g "
            "and d_0=-1/(2*g)"
        ),
        "schur_determinants": (
            "det(S_+)=-2*g^2*det(C) and "
            "det(C-2*|p><p|)=(1-2*mu)*det(C)"
        ),
        "height_half_principal_odd_cancellation": (
            "at alpha=L/(4*pi), p_-=(i/alpha)*D_0*p and "
            "D_0*(C-2*|p><p|)*D_0+alpha^2*S_-=D_0*C*D_0+"
            "alpha^2*T_-=:H_alpha>0"
        ),
        "height_half_determinant_response": (
            "A(alpha)/A(0)=det(H_alpha)/(det(C)*"
            "det(D_0^2+alpha^2*I))=g/p_0"
        ),
        "odd_pole_deletion": (
            "S_-=T_-+2*|p_-><p_-| is positive definite, "
            "kappa_-=<p_-,S_-^(-1)*p_->, and delta_-=1-2*kappa_->0"
        ),
        "odd_woodbury": (
            "for v=S_-^(-1)*p_-, y=S_-^(-1)*beta, zeta=<p_-,y>, "
            "T_-^(-1)*beta=y+2*zeta*v/delta_-"
        ),
        "combined_multiplier": (
            "m_lambda(t)=Re(psi(1/4+i*t/2))-log(pi)-2*sum_(1<n<=lambda^2) "
            "Lambda(n)*n^(-1/2)*cos(t*log(n))"
        ),
        "nonpole_minimum": (
            "m_0=m_lambda(0)=psi(1/4)-log(pi)-2*sum_(1<n<=lambda^2)"
            "Lambda(n)*n^(-1/2)"
        ),
        "complete_bernstein_levy_symbol": (
            "m_lambda(t)-m_0=Phi(t^2)+2*sum_(1<n<=lambda^2)Lambda(n)*"
            "n^(-1/2)*(1-cos(t*log(n))), Phi(s)=sum_(j>=0)s/(u_j*(s+4*u_j^2)), "
            "u_j=j+1/4"
        ),
        "levy_measure": (
            "nu_lambda(dh)=exp(-abs(h)/2)/(1-exp(-2*abs(h)))*dh+"
            "sum_(1<n<=lambda^2)Lambda(n)*n^(-1/2)*(delta_(log(n))+"
            "delta_(-log(n)))"
        ),
        "zero_extension_dirichlet_form": (
            "<f,Af>=(1/2)*integral_R integral_R abs(tilde(f)(x+h)-"
            "tilde(f)(x))^2 nu_lambda(dh) dx>=0 for A=m_lambda(D)-m_0*I"
        ),
        "levy_shift_location": (
            "with z=epsilon-m_0, S_+=A_+-z*I and S_-=A_--z*I; inertia gives "
            "lambda_1(A_+)<z<lambda_2(A_+) and z<lambda_1(A_-)"
        ),
        "rational_countermodel": (
            "for x=(t,1), p=(1,1), v=(1,-t), T=v*v^T, and S=T-2*p*p^T, "
            "0<t<1, inertia(S)=(1,1,0) and <e_0,S^(-1)*p>="
            "-t/(2*(t+1))->0"
        ),
        "killed_markov_countermodel": (
            "for P>1, p=(P,1), x=(1,1), v=(1,-1), T=v*v^T, "
            "z=2*P^2+2*P+1, and A=T-2*p*p^T+z*I, A is a positive killed "
            "symmetric jump form, A+2*p*p^T has ground x at z, and "
            "<(1,1)/sqrt(2),(A-z*I)^(-1)*p>=-1/(sqrt(2)*(P+1))->0"
        ),
    }
    for key, expected in critical_formulas.items():
        if formulas.get(key) != expected:
            raise ValueError(f"critical formula changed: {key}")

    domains = lock.get("locked_domains")
    if not isinstance(domains, dict):
        raise ValueError("missing domains")
    if "N/L^2 is bounded away from zero" not in str(
        domains.get("uniform_zero_height_equivalence")
    ):
        raise ValueError("quadratic exterior schedule omitted")
    if "c=<eta,x>" not in str(domains.get("finite_even_gate")):
        raise ValueError("source boundary scalar omitted")
    if "inertia alone does not imply it" not in str(
        domains.get("diagonal_sufficient_gate")
    ):
        raise ValueError("conditional diagonal gate promoted")
    if "N>=1" not in str(domains.get("principal_schur_gate")):
        raise ValueError("principal Schur domain omitted")
    if "not promoted across its first even eigenvalue" not in str(
        domains.get("levy_spectral_gate")
    ):
        raise ValueError("unshifted Levy positivity promoted")
    if "not identified with the arithmetic source multiplier" not in str(
        domains.get("countermodel_scope")
    ):
        raise ValueError("countermodel scope changed")

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
        "mixed inverse lower reserve for the actual arithmetic",
        "signed floor or source-metric action estimate",
        "equation (5.2)",
        "locally uniform determinant convergence",
    ):
        if phrase not in joined:
            raise ValueError(f"claim boundary omitted: {phrase}")


def _dot(left: Vector, right: Vector) -> Fraction:
    return left[0] * right[0] + left[1] * right[1]


def _matvec(matrix: Matrix, vector: Vector) -> Vector:
    return (_dot(matrix[0], vector), _dot(matrix[1], vector))


def _det(matrix: Matrix) -> Fraction:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def _inverse(matrix: Matrix) -> Matrix:
    determinant = _det(matrix)
    if determinant == 0:
        raise ZeroDivisionError("singular matrix")
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(sum(left[i][k] * right[k][j] for k in range(2)) for j in range(2))
        for i in range(2)
    )  # type: ignore[return-value]


def _outer(left: Vector, right: Vector) -> Matrix:
    return tuple(
        tuple(left[i] * right[j] for j in range(2)) for i in range(2)
    )  # type: ignore[return-value]


def _combine(left: Matrix, right: Matrix, right_scale: Fraction) -> Matrix:
    return tuple(
        tuple(left[i][j] + right_scale * right[i][j] for j in range(2))
        for i in range(2)
    )  # type: ignore[return-value]


class PoleDeletedScalarReserveGateTests(unittest.TestCase):
    def test_source_lock_hashes_status_and_claim_boundary(self) -> None:
        _validate_lock(_strict_load(LOCK_PATH))
        p0 = _strict_load(ROOT / "P0_STATUS.json")
        project = _strict_load(ROOT / "PROJECT_STATUS.json")
        handoff = _strict_load(ROOT / "HANDOFF_MANIFEST.json")
        # This historical lock stays pinned to VERSION while the live
        # manifests advance together at later checkpoints.
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

    def test_rational_even_fixture_and_collapsing_mixed_orientation(self) -> None:
        for t in (Fraction(1, 2), Fraction(1, 5), Fraction(1, 19)):
            x: Vector = (t, Fraction(1))
            p: Vector = (Fraction(1), Fraction(1))
            matrix_t: Matrix = ((Fraction(1), -t), (-t, t * t))
            matrix_s: Matrix = (
                (matrix_t[0][0] - 2, matrix_t[0][1] - 2),
                (matrix_t[1][0] - 2, matrix_t[1][1] - 2),
            )
            self.assertEqual(_matvec(matrix_t, x), (Fraction(0), Fraction(0)))
            self.assertEqual(_det(matrix_s), -2 * (t + 1) ** 2)
            self.assertLess(_det(matrix_s), 0)  # one positive and one negative root

            inverse_p = _matvec(_inverse(matrix_s), p)
            expected = tuple(-entry / (2 * (t + 1)) for entry in x)
            self.assertEqual(inverse_p, expected)
            self.assertEqual(_dot(p, inverse_p), Fraction(-1, 2))
            self.assertEqual(inverse_p[0], -t / (2 * (t + 1)))

            principal_c = t * t
            schur_g = 1 - Fraction(1, principal_c) * (-t)
            mu = Fraction(1, principal_c)
            c0 = _inverse(matrix_s)[0][0]
            self.assertEqual(inverse_p[0], -1 / (2 * schur_g))
            self.assertEqual(_det(matrix_s), -2 * schur_g**2 * principal_c)
            self.assertEqual(c0, -2 * (1 - 2 * mu) * inverse_p[0] ** 2)
            self.assertEqual(c0 + 2 * inverse_p[0] ** 2, 4 * mu * inverse_p[0] ** 2)

        d_values = tuple(-t / (2 * (t + 1)) for t in (Fraction(1, n) for n in range(2, 9)))
        self.assertTrue(all(abs(d_values[i + 1]) < abs(d_values[i]) for i in range(6)))

    def test_fixed_height_product_and_zero_trace_sandwich(self) -> None:
        sqrt_length = Fraction(3)
        exterior = Fraction(5, 4)
        product = Fraction(7, 6)
        d0 = -1 / (2 * sqrt_length * exterior * product)
        self.assertEqual(d0, Fraction(-4, 35))
        self.assertEqual(-1 / (2 * sqrt_length * d0), exterior * product)
        self.assertEqual(-1 / (2 * sqrt_length * exterior * d0), product)

        # One quotient-root square rho^2=3/2 makes the product exactly 7/6.
        trace = Fraction(2, 3)
        upper = 4 * (product - 1)
        self.assertEqual(trace, upper)
        with localcontext() as context:
            context.prec = 80
            decimal_product = Decimal(product.numerator) / Decimal(product.denominator)
            decimal_trace = Decimal(trace.numerator) / Decimal(trace.denominator)
            self.assertLessEqual(4 * decimal_product.ln(), decimal_trace)

    def test_rank_two_determinant_and_diagonal_geometry(self) -> None:
        t = Fraction(1, 3)
        tau = Fraction(7, 5)
        matrix_t: Matrix = ((Fraction(1), -t), (-t, t * t))
        matrix_s: Matrix = (
            (matrix_t[0][0] - 2, matrix_t[0][1] - 2),
            (matrix_t[1][0] - 2, matrix_t[1][1] - 2),
        )
        inverse_s = _inverse(matrix_s)
        p: Vector = (Fraction(1), Fraction(1))
        d0 = _matvec(inverse_s, p)[0]
        c0 = inverse_s[0][0]
        completed: Matrix = (
            (matrix_t[0][0] + tau, matrix_t[0][1]),
            matrix_t[1],
        )
        self.assertEqual(_det(completed), -2 * tau * d0**2 * _det(matrix_s))
        self.assertEqual(_det(completed), tau * t * t)
        self.assertGreaterEqual(c0 + 2 * d0**2, 0)

        # A separate exact fixture attains equality in the conditional
        # diagonal gate: S=diag(-2,1), p=e0, and T=S+2*pp^T=diag(0,1).
        gate_s: Matrix = ((Fraction(-2), Fraction(0)), (Fraction(0), Fraction(1)))
        gate_p: Vector = (Fraction(1), Fraction(0))
        gate_t: Matrix = ((Fraction(0), Fraction(0)), (Fraction(0), Fraction(1)))
        gate_inverse = _inverse(gate_s)
        length = Fraction(25)
        kappa = Fraction(25, 2)
        gate_c0 = gate_inverse[0][0]
        gate_d0 = _matvec(gate_inverse, gate_p)[0]
        self.assertEqual(gate_t[0][0], gate_s[0][0] + 2)
        self.assertEqual(gate_c0, -kappa / length)
        self.assertEqual(gate_c0 + 2 * gate_d0**2, 0)
        self.assertEqual(gate_d0**2, kappa / (2 * length))

    def test_odd_woodbury_and_response_quotient(self) -> None:
        matrix_s: Matrix = ((Fraction(4), Fraction(0)), (Fraction(0), Fraction(5)))
        matrix_t: Matrix = ((Fraction(2), Fraction(0)), (Fraction(0), Fraction(5)))
        p: Vector = (Fraction(1), Fraction(0))
        beta: Vector = (Fraction(2), Fraction(3))
        inverse_s = _inverse(matrix_s)
        inverse_t = _inverse(matrix_t)
        v = _matvec(inverse_s, p)
        y = _matvec(inverse_s, beta)
        zeta = _dot(p, y)
        kappa = _dot(p, v)
        delta = 1 - 2 * kappa
        woodbury = tuple(y[i] + 2 * zeta * v[i] / delta for i in range(2))
        direct = _matvec(inverse_t, beta)
        self.assertEqual(delta, Fraction(1, 2))
        self.assertEqual(woodbury, direct)

        g0: Vector = (Fraction(1, 3), Fraction(-2, 7))
        ga: Vector = (Fraction(-1, 5), Fraction(4, 9))

        def response(g: Vector) -> Fraction:
            return 1 + _dot(g, direct)

        def numerator(g: Vector) -> Fraction:
            return delta * (1 + _dot(g, y)) + 2 * zeta * _dot(g, v)

        self.assertEqual(response(ga) / response(g0), numerator(ga) / numerator(g0))

        # At height 1/2 the finite pole phases cancel exactly between the
        # e0-deleted even block and the odd pole-deleted block.
        diagonal_d: Matrix = ((Fraction(1), Fraction(0)), (Fraction(0), Fraction(2)))
        principal_c: Matrix = ((Fraction(3), Fraction(1)), (Fraction(1), Fraction(4)))
        odd_t: Matrix = ((Fraction(5), Fraction(1, 2)), (Fraction(1, 2), Fraction(6)))
        pole_tail: Vector = (Fraction(1, 3), Fraction(-2, 5))
        alpha = Fraction(3, 2)
        d_pole = _matvec(diagonal_d, pole_tail)
        principal_deleted = _combine(principal_c, _outer(pole_tail, pole_tail), Fraction(-2))
        odd_deleted = _combine(
            odd_t,
            _outer(d_pole, d_pole),
            Fraction(2, 1) / alpha**2,
        )
        left = _combine(
            _matmul(_matmul(diagonal_d, principal_deleted), diagonal_d),
            odd_deleted,
            alpha**2,
        )
        right = _combine(
            _matmul(_matmul(diagonal_d, principal_c), diagonal_d),
            odd_t,
            alpha**2,
        )
        self.assertEqual(left, right)
        self.assertGreater(right[0][0], 0)
        self.assertGreater(_det(right), 0)

    def test_cauchy_countermodel_response_is_nondecaying(self) -> None:
        for a in (Fraction(1, 2), Fraction(2), Fraction(7)):
            response = (a * a + Fraction(3, 4)) / (a * a + 1)
            ratio = response / Fraction(3, 4)
            self.assertEqual(
                ratio,
                Fraction(4, 3) - 1 / (3 * (a * a + 1)),
            )

            sqrt_length = Fraction(3)
            sinh_proxy = Fraction(11, 5)
            d0 = (
                -3
                * sqrt_length
                * (a * a + 1)
                / (8 * sinh_proxy * (4 * a * a + 3))
            )
            self.assertEqual(-sqrt_length / (8 * sinh_proxy * d0), ratio)

        ratios = tuple(
            Fraction(4, 3) - Fraction(1, 3 * (n * n + 1)) for n in range(1, 10)
        )
        self.assertTrue(all(ratios[i + 1] > ratios[i] for i in range(8)))
        self.assertTrue(all(value > 1 for value in ratios))

    def test_combined_multiplier_keeps_endpoint_and_minus_prime_sign(self) -> None:
        # A rational stand-in for the archimedean samples isolates the exact
        # finite combinatorics.  The prime-power endpoint 9 is included.
        lambda_squared = 9
        von_mangoldt = {
            2: Fraction(2),
            3: Fraction(3),
            4: Fraction(2),
            5: Fraction(5),
            7: Fraction(7),
            8: Fraction(2),
            9: Fraction(3),
        }
        cosine_samples = {
            2: Fraction(1, 2),
            3: Fraction(-1, 3),
            4: Fraction(2, 5),
            5: Fraction(-3, 10),
            7: Fraction(1, 6),
            8: Fraction(-2, 7),
            9: Fraction(3, 8),
        }
        radical_proxies = {
            2: Fraction(7, 5),
            3: Fraction(5, 3),
            4: Fraction(2),
            5: Fraction(9, 4),
            7: Fraction(8, 3),
            8: Fraction(14, 5),
            9: Fraction(3),
        }
        archimedean = Fraction(13, 7)

        def distinct_prime_factors(value: int) -> set[int]:
            factors: set[int] = set()
            divisor = 2
            remainder = value
            while divisor * divisor <= remainder:
                while remainder % divisor == 0:
                    factors.add(divisor)
                    remainder //= divisor
                divisor += 1
            if remainder > 1:
                factors.add(remainder)
            return factors

        prime_powers = tuple(
            n
            for n in range(2, lambda_squared + 1)
            if len(distinct_prime_factors(n)) == 1
        )
        self.assertEqual(prime_powers, (2, 3, 4, 5, 7, 8, 9))
        self.assertEqual(tuple(sorted(von_mangoldt)), prime_powers)

        terms = [
            von_mangoldt[n] * cosine_samples[n] / radical_proxies[n]
            for n in sorted(von_mangoldt)
            if 1 < n <= lambda_squared
        ]
        assembled = archimedean - 2 * sum(terms)
        independent = archimedean
        for n in prime_powers:
            independent -= 2 * von_mangoldt[n] * cosine_samples[n] / radical_proxies[n]
        self.assertEqual(assembled, independent)
        without_endpoint = assembled + 2 * von_mangoldt[9] * cosine_samples[9] / radical_proxies[9]
        self.assertNotEqual(without_endpoint, assembled)
        with_wrong_sign = archimedean + 2 * sum(terms)
        self.assertNotEqual(with_wrong_sign, assembled)

        # The digamma difference is a complete Bernstein sum in s=t^2.
        s_value = Fraction(7, 5)
        first_u = Fraction(1, 4)
        first_term = s_value / (first_u * (s_value + 4 * first_u**2))
        self.assertEqual(first_term, 16 * s_value / (1 + 4 * s_value))
        bernstein_terms = tuple(
            s_value
            / (
                Fraction(4 * j + 1, 4)
                * (s_value + 4 * Fraction(4 * j + 1, 4) ** 2)
            )
            for j in range(6)
        )
        self.assertTrue(all(term > 0 for term in bernstein_terms))

        # Positive killed-jump structure and a positive constant ground still
        # do not control the mixed orientation.
        for pole_scale in (Fraction(2), Fraction(5), Fraction(13)):
            pole: Vector = (pole_scale, Fraction(1))
            constant_ground: Vector = (Fraction(1), Fraction(1))
            difference: Vector = (Fraction(1), Fraction(-1))
            matrix_t = _outer(difference, difference)
            matrix_s = _combine(matrix_t, _outer(pole, pole), Fraction(-2))
            shift = 2 * pole_scale**2 + 2 * pole_scale + 1
            killed: Matrix = (
                (matrix_s[0][0] + shift, matrix_s[0][1]),
                (matrix_s[1][0], matrix_s[1][1] + shift),
            )
            completed = _combine(killed, _outer(pole, pole), Fraction(2))
            self.assertEqual(
                _matvec(completed, constant_ground),
                tuple(shift * entry for entry in constant_ground),
            )
            self.assertGreater(killed[0][0], 0)
            self.assertGreater(_det(killed), 0)
            inverse_pole = _matvec(_inverse(matrix_s), pole)
            expected = Fraction(-1, 2) / (pole_scale + 1)
            self.assertEqual(inverse_pole, (expected, expected))
            self.assertEqual(_dot(constant_ground, inverse_pole), -1 / (pole_scale + 1))

    def test_adversarial_mutations_fail_closed(self) -> None:
        base = _strict_load(LOCK_PATH)
        mutations: list[tuple[str, dict[str, object]]] = []

        replacements = (
            ("Fourier sign", "locked_conventions", "fourier_transform", "hat(f)(z)=integral f(y)*exp(+i*z*y) dy"),
            ("prime sign", "locked_conventions", "prime_block_sign", "plus"),
            ("pole order", "locked_conventions", "pole_deletion_order", "delete before assembly"),
            ("pole projection", "locked_conventions", "finite_pole_vectors", "use continuum vectors"),
            ("nonpole shift", "locked_conventions", "nonpole_shift", "replace m_lambda(0) by an unspecified constant"),
            ("pole factor", "locked_formulas", "pole_forms", "P_+=|p_+><p_+| and P_-=|p_-><p_-|"),
            ("exterior factor", "locked_formulas", "mixed_product_identity", "d_0=-1/(2*sqrt(L)*B)"),
            ("endpoint", "locked_formulas", "combined_multiplier", "sum_(1<n<lambda^2)"),
            ("relative sign", "locked_formulas", "even_pole_deletion", "S_+=T_++2*|p_+><p_+|"),
            ("Schur ground sign", "locked_formulas", "schur_ground_coordinate", "g=p_0+<p,C^(-1)b> and d_0=1/(2*g)"),
            ("Schur determinant factor", "locked_formulas", "schur_determinants", "det(S_+)=-g^2*det(C)"),
            ("principal pole phase", "locked_formulas", "height_half_principal_odd_cancellation", "p_-=D_0*p"),
            ("height-half denominator", "locked_formulas", "height_half_determinant_response", "A(alpha)/A(0)=det(H_alpha)/det(C)=g/p_0"),
            ("unspecified finite minimum", "locked_formulas", "nonpole_minimum", "m_0=O(1)"),
            ("Levy prime sign", "locked_formulas", "complete_bernstein_levy_symbol", "Phi(t^2)-2*sum prime jumps"),
            ("Levy atoms omitted", "locked_formulas", "levy_measure", "nu_lambda(dh)=exp(-abs(h)/2)/(1-exp(-2*abs(h)))*dh"),
            ("killed model mixed entry", "locked_formulas", "killed_markov_countermodel", "the mixed entry is uniformly bounded away from zero"),
            ("countermodel promotion", "locked_domains", "countermodel_scope", "the Cauchy family is arithmetic"),
        )
        for label, section, key, value in replacements:
            mutation = copy.deepcopy(base)
            mutation[section][key] = value  # type: ignore[index]
            mutations.append((label, mutation))

        mandatory_admissions = (
            "api_key_read",
            "binary64_parameters_used",
            "zero_table_used",
            "global_weil_positivity_assumed",
            "unshifted_levy_positivity_promoted_to_mixed_reserve",
            "principal_minor_sign_assumed",
            "absolute_value_agmon_bound_claimed",
            "prime_power_endpoint_omitted",
            "lambda_squared_mixed_with_lambda",
            "inversion_reflection_dropped",
            "nonpositive_gap_reported_as_pass",
            "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
            "unit_source_normalization_substituted",
            "actual_arithmetic_mixed_inverse_lower_bound_proved",
            "actual_relative_odd_response_decay_proved",
            "cauchy_countermodel_called_arithmetic",
        )
        for key in mandatory_admissions:
            mutation = copy.deepcopy(base)
            mutation["source_admissions"][key] = True  # type: ignore[index]
            mutations.append((key, mutation))

        for label, mutation in mutations:
            with self.subTest(label=label):
                with self.assertRaises(ValueError):
                    _validate_lock(mutation, check_digest=False)


if __name__ == "__main__":
    unittest.main()
