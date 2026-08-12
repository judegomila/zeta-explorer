from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "BOUNDARY_DISCREPANCY_CONVOLUTION_SOURCE_LOCK.json"
VERSION = "0.52.0-boundary-discrepancy-convolution-reduction"
EXPECTED_SEMANTIC_SHA256 = "235053bfcec3bf33bbc751dafbd3f866f20b4aa9f3660756ed1d3a1d512ff732"

EXPECTED_DEPENDENCIES = {
    "P0_SOURCE_LOCK.json",
    "WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "notes/BOUNDARY_DISCREPANCY_CONVOLUTION_REDUCTION.md",
    "src/weil_matrix.py",
    "src/boundary_discrepancy_convolution.py",
    "verifier/boundary_discrepancy_convolution_replay.py",
}
EXPECTED_ARTIFACTS = {
    "artifacts/boundary_discrepancy_convolution/lambda2_N2_dps80_producer.json",
    "artifacts/boundary_discrepancy_convolution/lambda2_N2_dps80_replay.json",
    "artifacts/boundary_discrepancy_convolution/lambda2_N2_dps160_producer.json",
    "artifacts/boundary_discrepancy_convolution/lambda2_N2_dps160_replay.json",
}

EXPECTED_CONVENTIONS = {
    "physical_interval": "a=log(lambda), L=2*a, I=[-a,a]",
    "measure": "Lebesgue measure on I",
    "zero_extension": "every function on I is extended by zero to the real line before translation",
    "fourier_transform": "hat(f)(t)=integral_I f(x)*exp(-i*t*x) dx",
    "centered_basis": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L), -N<=n<=N",
    "inversion": "J*f(x)=f(-x), equivalently J*V_n=V_-n; both reflected boundary terms are retained",
    "complete_source_operator": "Q_lambda=C_I^*m_lambda(D)C_I+P before parity compression or ground shifting",
    "prime_block_sign": "m_lambda contains -2*sum Lambda(n)/sqrt(n)*cos(t*log(n)), preserving the minus sign in source equation (3.19)",
    "prime_power_endpoint": "the right-continuous inventory includes every prime power 1<n<=lambda^2",
    "lambda_scale": "a=log(lambda), L=2*log(lambda), and exp(L)=lambda^2; lambda is never substituted for lambda^2",
    "ground_state": "x is the real inversion-even lowest eigenvector of the finite compressed complete source matrix; no global Weil positivity or pointwise nonnegativity of x is assumed",
    "weak_test": "the compressed eigen-equation is tested against 1_I in E_N; no pointwise uncompressed eigen-equation is asserted",
    "parameter_ingestion": "decimal source parameters are parsed from text and never through binary64",
    "completed_xi": "xi(z)=(1/2)*z*(z-1)*pi^(-z/2)*Gamma(z/2)*zeta(z), not the critical-line Xi function",
    "ordinary_laplace_domain": "the ordinary-Laplace derivation and numerical samples are restricted to Re(s)>1/2",
    "secret_boundary": "API keys and environment secrets are neither read nor serialized",
}

EXPECTED_FORMULAS = {
    "complete_multiplier": "m_lambda(t)=Re psi(1/4+i*t/2)-log(pi)-2*sum_(1<n<=lambda^2) Lambda(n)/sqrt(n)*cos(t*log(n))",
    "weighted_sum": "W(exp(t))=sum_(1<n<=exp(t)) Lambda(n)/sqrt(n), with the inclusive right-continuous endpoint convention",
    "weighted_discrepancy": "D(t)=W(exp(t))-2*(exp(t/2)-1)",
    "signed_discrepancy_measure": "dD(t)=sum_(n>=2) Lambda(n)/sqrt(n)*delta_log(n)(dt)-exp(t/2)dt",
    "archimedean_density": "rho(t)=exp(-t/2)/(1-exp(-2*t))",
    "archimedean_tail": "H0(t)=integral_t^infinity rho(u)du=(1/2)*log((1+exp(-t/2))/(1-exp(-t/2)))+atan(exp(-t/2))",
    "signed_boundary_discrepancy": "F(t)=D(t)-H0(t)",
    "boundary_source_identity": "A1(y)=H0(a-y)+H0(a+y)+2*W(lambda^2)-W(lambda*exp(-y))-W(lambda*exp(y)) for almost every y in I",
    "boundary_cancellation_identity": "A1(y)=4*lambda+2*D(L)-4*sqrt(lambda)*cosh(y/2)-F(a-y)-F(a+y) for almost every y in I",
    "finite_moments": "X=integral_I x(y)dy and h=integral_I cosh(y/2)*x(y)dy",
    "signed_boundary_quotient": "C_lambda(x)=X^(-1)*integral_I (F(a-y)+F(a+y))*x(y)dy=2*X^(-1)*integral_0^L F(t)*x(a-t)dt for even x and X!=0",
    "source_independent_scalar": "c_star=psi(1/4)-log(pi)+4",
    "scalar_cancellation": "m_lambda(0)+4*lambda+2*D(L)=c_star",
    "weak_compressed_identity": "C_lambda(x)+epsilon-c_star=-4*h/(sqrt(lambda)*X), obtained by weakly testing the finite compressed equation against 1_I",
    "one_sided_window": "h/X<=B iff c_star-epsilon-4*B/sqrt(lambda)<=C_lambda(x)<c_star-epsilon, assuming X!=0, h/X>0, and B>=0",
    "laplace_D": "L(D)(s)=s^(-1)*(-zeta'/zeta(s+1/2)-2*s/(s-1/2)+2), Re(s)>1/2",
    "laplace_H0": "L(H0)(s)=(psi(1/4+s/2)-psi(1/4))/(2*s), Re(s)>0",
    "completed_xi_laplace": "L(F-c_star/2)(s)=s^(-1)*(-xi'/xi(1/2+s)+1/(1/2+s)-2), Re(s)>1/2",
}

REQUIRED_TRUE_CLAIMS = {
    "exact_finite_boundary_identity_proved",
    "exact_weak_compressed_ground_identity_proved",
    "finite_one_sided_window_equivalence_proved",
    "ordinary_laplace_transform_identity_in_Re_s_gt_one_half_proved",
}
REQUIRED_FALSE_CLAIMS = {
    "uniform_one_sided_boundary_localization_proved",
    "uniform_critical_ground_moment_bound_proved",
    "uniform_mixed_reserve_proved",
    "uniform_complementary_gap_proved",
    "inversion_even_sector_gap_proved",
    "inversion_odd_sector_gap_proved",
    "equation_5_2_proved",
    "locally_uniform_determinant_convergence_proved",
    "transform_bound_at_or_left_of_Re_s_one_half_proved",
    "ground_pointwise_nonnegativity_proved",
    "global_weil_positivity_assumed_or_proved",
    "asymptotic_localization_theorem_proved",
    "riemann_hypothesis_proved",
    "new_lambda_bound_claimed",
}
REQUIRED_REJECTIONS = {
    "absolute_value_substituted_for_signed_boundary_convolution",
    "asymptotic_localization_promoted_from_finite_identity",
    "binary64_parameter_used",
    "boundary_reflection_term_omitted",
    "cached_matrix_or_eigenpair_read",
    "completed_xi_confused_with_critical_line_Xi",
    "endpoint_prime_power_omitted",
    "F_equals_D_plus_H0_substituted",
    "fourier_sign_changed",
    "global_weil_positivity_assumed",
    "ground_quotient_treated_as_a_positive_probability_expectation",
    "inversion_reflection_dropped",
    "lambda_mixed_with_lambda_squared",
    "laplace_meromorphic_continuation_substituted_for_a_uniform_bound",
    "locked_reserve_bound_B_changed_from_exact_string_2",
    "nonpositive_complementary_gap_reported_as_a_pass",
    "ordinary_laplace_sample_taken_at_or_left_of_Re_s_one_half",
    "prime_block_sign_changed",
    "prime_power_n_le_lambda_squared_omitted",
    "producer_boolean_trusted",
    "real_zeta_zero_list_assumed_or_read",
    "real_axis_eigenvalue_agreement_substituted_for_locally_uniform_determinant_convergence",
    "replay_tolerance_relaxed_beyond_10_to_minus_dps_minus_6",
    "reserve_window_upper_bound_made_nonstrict",
    "source_normalization_changed",
    "unit_norm_substituted_for_source_normalization",
    "weak_compressed_identity_promoted_to_a_pointwise_uncompressed_equation",
    "wrong_4_over_sqrt_lambda_reserve_scale_substituted",
    "zeta_zero_list_assumed_or_read",
}


class SourceLockError(ValueError):
    pass


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _unique_object(pairs: list[tuple[str, object]]) -> dict[str, object]:
    result: dict[str, object] = {}
    for key, value in pairs:
        if key in result:
            raise SourceLockError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def _reject_float(token: str) -> object:
    raise SourceLockError(f"JSON float or non-finite constant forbidden: {token}")


def _validate_json_tree(value: object, path: str = "source_lock") -> None:
    if value is None or isinstance(value, (str, bool, int)):
        return
    if isinstance(value, float):
        raise SourceLockError(f"binary64 value forbidden at {path}")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json_tree(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise SourceLockError(f"non-string key at {path}")
            _validate_json_tree(child, f"{path}.{key}")
        return
    raise SourceLockError(f"non-JSON value at {path}")


def _strict_load(raw: str | None = None, path: Path = LOCK_PATH) -> dict[str, object]:
    try:
        value = json.loads(
            path.read_text(encoding="utf-8") if raw is None else raw,
            object_pairs_hook=_unique_object,
            parse_float=_reject_float,
            parse_constant=_reject_float,
        )
    except SourceLockError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise SourceLockError("invalid strict JSON") from exc
    if not isinstance(value, dict):
        raise SourceLockError("source lock must be a JSON object")
    _validate_json_tree(value)
    return value


def _semantic_sha256(value: dict[str, object]) -> str:
    canonical = json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode("ascii")
    return hashlib.sha256(canonical).hexdigest()


def _validate_file_group(
    lock: dict[str, object], key: str, expected_paths: set[str]
) -> None:
    entries = lock.get(key)
    if not isinstance(entries, list) or not entries:
        raise SourceLockError(f"{key} must be a nonempty list")
    observed: set[str] = set()
    for entry in entries:
        if not isinstance(entry, dict) or set(entry) != {"path", "sha256", "role"}:
            raise SourceLockError(f"invalid {key} entry")
        path = entry.get("path")
        digest = entry.get("sha256")
        role = entry.get("role")
        if not isinstance(path, str) or not isinstance(digest, str) or not isinstance(role, str):
            raise SourceLockError(f"invalid {key} field type")
        if path in observed:
            raise SourceLockError(f"duplicate {key} path: {path}")
        observed.add(path)
        target = ROOT / path
        if not target.is_file() or _sha256(target) != digest:
            raise SourceLockError(f"{key} byte hash mismatch: {path}")
    if observed != expected_paths:
        raise SourceLockError(f"wrong {key} inventory")


def _validate_external_sources(lock: dict[str, object]) -> None:
    external = lock.get("external_sources")
    if not isinstance(external, list) or len(external) != 1:
        raise SourceLockError("wrong external-source inventory")
    entry = external[0]
    expected = {
        "id": "CCM-ZST-v1",
        "version": "arXiv:2511.22755v1",
        "vendored_path": "vendor/CCM-ZST-2511.22755v1.pdf",
        "sha256": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
        "role": "finite Weil distribution, pole term, archimedean term, multiplier, Fourier convention, inversion, and the minus-prime sign in equation (3.19)",
    }
    if entry != expected:
        raise SourceLockError("external source metadata mutation")
    target = ROOT / expected["vendored_path"]
    if not target.is_file() or _sha256(target) != expected["sha256"]:
        raise SourceLockError("external source byte mismatch")


def _validate_lock(lock: dict[str, object], *, check_digest: bool = True) -> None:
    _validate_json_tree(lock)
    if check_digest and _semantic_sha256(lock) != EXPECTED_SEMANTIC_SHA256:
        raise SourceLockError("semantic digest mismatch")
    expected_top = {
        "schema",
        "checkpoint_version",
        "claim_class",
        "terminal_state",
        "updated_date",
        "dependencies",
        "external_sources",
        "locked_conventions",
        "locked_formulas",
        "proof_claims",
        "implementation_contract",
        "arithmetic_limitations",
        "artifacts",
        "open_obligations",
        "rejected_mutations",
    }
    if set(lock) != expected_top:
        raise SourceLockError("source-lock top-level inventory mutation")
    if lock.get("schema") != "xi-prolate-boundary-discrepancy-convolution-source-lock-v1":
        raise SourceLockError("wrong schema")
    if lock.get("checkpoint_version") != VERSION:
        raise SourceLockError("wrong checkpoint version")
    if lock.get("terminal_state") != "P0_INVALIDATED":
        raise SourceLockError("wrong formal state")
    if lock.get("updated_date") != "2026-08-08":
        raise SourceLockError("wrong lock date")

    _validate_file_group(lock, "dependencies", EXPECTED_DEPENDENCIES)
    _validate_file_group(lock, "artifacts", EXPECTED_ARTIFACTS)
    _validate_external_sources(lock)

    if lock.get("locked_conventions") != EXPECTED_CONVENTIONS:
        raise SourceLockError("locked convention mutation")
    if lock.get("locked_formulas") != EXPECTED_FORMULAS:
        raise SourceLockError("locked formula mutation")

    claims = lock.get("proof_claims")
    if not isinstance(claims, dict) or set(claims) != REQUIRED_TRUE_CLAIMS | REQUIRED_FALSE_CLAIMS:
        raise SourceLockError("wrong proof-claim inventory")
    if any(claims.get(key) is not True for key in REQUIRED_TRUE_CLAIMS):
        raise SourceLockError("a finite exact claim was removed")
    if any(claims.get(key) is not False for key in REQUIRED_FALSE_CLAIMS):
        raise SourceLockError("an open claim was promoted")

    contract = lock.get("implementation_contract")
    if not isinstance(contract, dict):
        raise SourceLockError("missing implementation contract")
    expected_contract = {
        "locked_pilot": "lambda=2, N=2, B=2 at 80 and 160 decimal digits",
        "locked_reserve_bound": "both producer and verifier require B to be the canonical exact decimal string '2'; no alternate B is accepted",
        "verifier_trust": "the verifier reconstructs formulas and transcendental values from source parameters and does not trust producer matrices, booleans, or cached values",
        "inclusive_endpoint_witness": "the lambda=2 inventory contains the endpoint prime power n=4=lambda^2",
        "laplace_samples": "s=1 and s=1.5, both strictly inside Re(s)>1/2",
        "replay_numeric_tolerance": "every serialized numeric field is replayed with abs(submitted-expected)<=10^(-(dps-6))*max(1,abs(expected)), retaining full requested precision except six guard digits",
        "signed_residual_policy": "combined signed residuals are serialized before absolute values are used for pass/fail comparisons",
        "diagnostic_scope": "the two precision runs are finite point diagnostics and are not extrapolated to an asymptotic theorem",
    }
    for key, expected in expected_contract.items():
        if contract.get(key) != expected:
            raise SourceLockError(f"implementation contract mutation: {key}")

    limitations = lock.get("arithmetic_limitations")
    expected_limitations = {
        "mode": "arbitrary-precision point arithmetic, not interval or ball arithmetic",
        "shared_library": "producer and verifier share mpmath transcendental arithmetic",
        "shared_eigensolver": "producer and verifier share mpmath eigsy",
        "independent_formula_trees": True,
        "cached_matrices_or_zero_tables_used": False,
        "uniform_window_ball_enclosure": False,
        "asymptotic_estimate": False,
    }
    if limitations != expected_limitations:
        raise SourceLockError("arithmetic limitation mutation")

    rejected = lock.get("rejected_mutations")
    if not isinstance(rejected, list) or len(rejected) != len(set(rejected)):
        raise SourceLockError("invalid rejected-mutation inventory")
    if not REQUIRED_REJECTIONS.issubset(set(rejected)):
        raise SourceLockError("mandatory rejected-mutation inventory incomplete")

    obligations = lock.get("open_obligations")
    if not isinstance(obligations, list) or not obligations:
        raise SourceLockError("missing open obligations")


def _strict_artifact(path: Path) -> dict[str, object]:
    return _strict_load(path=path)


class BoundaryDiscrepancyConvolutionSourceLockTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.lock = _strict_load()

    def test_source_lock_semantic_digest_and_all_bound_bytes(self) -> None:
        _validate_lock(self.lock)

    def test_dependency_and_artifact_inventories_are_exact(self) -> None:
        self.assertEqual(
            {entry["path"] for entry in self.lock["dependencies"]},
            EXPECTED_DEPENDENCIES,
        )
        self.assertEqual(
            {entry["path"] for entry in self.lock["artifacts"]},
            EXPECTED_ARTIFACTS,
        )

    def test_external_source_is_exact_and_vendored_hash_matches(self) -> None:
        _validate_external_sources(self.lock)

    def test_note_states_exact_weak_reduction_and_open_boundary(self) -> None:
        note = (ROOT / "notes" / "BOUNDARY_DISCREPANCY_CONVOLUTION_REDUCTION.md").read_text(
            encoding="utf-8"
        )
        for needle in (
            "\\boxed{F(t)=D(t)-H_0(t).}",
            "W(\\lambda e^{-y})-W(\\lambda e^y)",
            "(4.1) weakly against `1_I in E_N`",
            "It is not an expectation",
            "\\mathcal C_\\lambda(x)<c_*-\\epsilon",
            "\\Re s>\\frac12",
            "No asymptotic theorem establishing that control is claimed",
            "equation (5.2)",
        ):
            self.assertIn(needle, note)

    def test_four_point_artifacts_are_strict_and_claim_limited(self) -> None:
        observed_precisions: dict[str, set[int]] = {"producer": set(), "replay": set()}
        for relative in sorted(EXPECTED_ARTIFACTS):
            artifact = _strict_artifact(ROOT / relative)
            self.assertEqual(artifact.get("checkpoint_version"), VERSION)
            self.assertEqual(artifact.get("terminal_state"), "P0_INVALIDATED")
            inputs = artifact.get("input")
            self.assertIsInstance(inputs, dict)
            self.assertEqual(inputs.get("lambda_decimal"), "2")
            self.assertEqual(inputs.get("N"), 2)
            self.assertEqual(inputs.get("reserve_bound_B_decimal"), "2")
            dps = inputs.get("precision_decimal_digits")
            self.assertIn(dps, {80, 160})
            if relative.endswith("_producer.json"):
                observed_precisions["producer"].add(dps)
                self.assertEqual(
                    artifact.get("schema"),
                    "xi-prolate-boundary-discrepancy-convolution-v1",
                )
                formulas = artifact.get("locked_formulas")
                self.assertIsInstance(formulas, dict)
                self.assertEqual(formulas.get("F"), "F(t)=D(t)-H0(t)")
                self.assertIn("<c_star-epsilon", formulas.get("reserve_window"))
                self.assertTrue(formulas.get("laplace").endswith("Re(s)>1/2"))
                terms = artifact["exact_prime_power_inventory"]["terms"]
                self.assertTrue(any(item.get("n") == 4 for item in terms))
                self.assertFalse(artifact["source_admissions"]["zeta_zero_table_read"])
                self.assertFalse(artifact["source_admissions"]["global_weil_positivity_assumed"])
                self.assertTrue(artifact["checks"]["finite_point_diagnostic_only"])
            else:
                observed_precisions["replay"].add(dps)
                self.assertEqual(
                    artifact.get("schema"),
                    "xi-prolate-boundary-discrepancy-convolution-replay-v1",
                )
                self.assertFalse(
                    artifact["checks"]["producer_matrices_and_booleans_trusted"]
                )
                self.assertIn("share mpmath", artifact["shared_arithmetic_and_eigensolver_limitation"])
        self.assertEqual(observed_precisions, {"producer": {80, 160}, "replay": {80, 160}})
        producer_source = (ROOT / "src" / "boundary_discrepancy_convolution.py").read_text(
            encoding="utf-8"
        )
        verifier_source = (
            ROOT / "verifier" / "boundary_discrepancy_convolution_replay.py"
        ).read_text(encoding="utf-8")
        locked_pilot_guard = 'lambda_text != "2" or N != 2 or B_text != "2"'
        self.assertIn(locked_pilot_guard, producer_source)
        self.assertIn(locked_pilot_guard, verifier_source)
        self.assertIn("tolerance = mp.power(10, -(dps - 6))", verifier_source)

    def test_convention_and_formula_mutations_are_rejected(self) -> None:
        mutations: list[dict[str, object]] = []

        def mutate(group: str, key: str, value: object) -> None:
            candidate = copy.deepcopy(self.lock)
            candidate[group][key] = value
            mutations.append(candidate)

        mutate("locked_conventions", "fourier_transform", "hat(f)=integral f*exp(+i*t*x)")
        mutate("locked_conventions", "physical_interval", "L=log(lambda)")
        mutate("locked_conventions", "inversion", "reflection omitted")
        mutate("locked_conventions", "prime_power_endpoint", "1<n<lambda^2")
        mutate("locked_conventions", "lambda_scale", "exp(L)=lambda")
        mutate("locked_conventions", "parameter_ingestion", "binary64 accepted")
        mutate("locked_conventions", "weak_test", "pointwise eigen-equation")
        mutate("locked_conventions", "ordinary_laplace_domain", "Re(s)>=0")
        mutate("locked_formulas", "complete_multiplier", "m_lambda=arch+prime")
        mutate("locked_formulas", "signed_boundary_discrepancy", "F(t)=D(t)+H0(t)")
        mutate("locked_formulas", "boundary_source_identity", "only H0(a-y), no reflection")
        mutate("locked_formulas", "weak_compressed_identity", "C+epsilon-c=-h/X")
        mutate("locked_formulas", "one_sided_window", "lower<=C<=upper")
        mutate("locked_formulas", "completed_xi_laplace", "same identity for Re(s)>0")
        for index, candidate in enumerate(mutations):
            with self.subTest(index=index):
                with self.assertRaises(SourceLockError):
                    _validate_lock(candidate, check_digest=False)

    def test_claim_boundary_promotions_and_demotions_are_rejected(self) -> None:
        for key in sorted(REQUIRED_FALSE_CLAIMS):
            candidate = copy.deepcopy(self.lock)
            candidate["proof_claims"][key] = True
            with self.subTest(promoted=key):
                with self.assertRaises(SourceLockError):
                    _validate_lock(candidate, check_digest=False)
        for key in sorted(REQUIRED_TRUE_CLAIMS):
            candidate = copy.deepcopy(self.lock)
            candidate["proof_claims"][key] = False
            with self.subTest(demoted=key):
                with self.assertRaises(SourceLockError):
                    _validate_lock(candidate, check_digest=False)

    def test_every_mandatory_failure_mutation_is_locked(self) -> None:
        for rejected in sorted(REQUIRED_REJECTIONS):
            candidate = copy.deepcopy(self.lock)
            candidate["rejected_mutations"].remove(rejected)
            with self.subTest(removed=rejected):
                with self.assertRaises(SourceLockError):
                    _validate_lock(candidate, check_digest=False)

    def test_duplicate_keys_binary64_and_nonfinite_numbers_are_rejected(self) -> None:
        for raw in (
            '{"schema":"a","schema":"b"}',
            '{"lambda":2.0}',
            '{"lambda":NaN}',
            '{"lambda":Infinity}',
        ):
            with self.subTest(raw=raw):
                with self.assertRaises(SourceLockError):
                    _strict_load(raw=raw)
        candidate = copy.deepcopy(self.lock)
        candidate["implementation_contract"]["precision"] = 80.0
        with self.assertRaises(SourceLockError):
            _validate_lock(candidate, check_digest=False)

    def test_dependency_artifact_and_external_hash_mutations_are_rejected(self) -> None:
        for key in ("dependencies", "artifacts"):
            candidate = copy.deepcopy(self.lock)
            candidate[key][0]["sha256"] = "0" * 64
            with self.subTest(group=key):
                with self.assertRaises(SourceLockError):
                    _validate_lock(candidate, check_digest=False)
        candidate = copy.deepcopy(self.lock)
        candidate["external_sources"][0]["sha256"] = "0" * 64
        with self.assertRaises(SourceLockError):
            _validate_lock(candidate, check_digest=False)


if __name__ == "__main__":
    unittest.main()
