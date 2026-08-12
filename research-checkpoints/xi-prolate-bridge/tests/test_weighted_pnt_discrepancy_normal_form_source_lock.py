from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM_SOURCE_LOCK.json"
VERSION = "0.51.0-weighted-pnt-discrepancy-normal-form"
EXPECTED_SEMANTIC_SHA256 = "25540d3287629464037296a1700072808011049cc252caf6e9d43a7615c79b9f"


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
    raise SourceLockError(f"JSON float forbidden: {token}")


def _strict_load(raw: str | None = None) -> dict[str, object]:
    value = json.loads(
        LOCK_PATH.read_text(encoding="utf-8") if raw is None else raw,
        object_pairs_hook=_unique_object,
        parse_float=_reject_float,
        parse_constant=_reject_float,
    )
    if not isinstance(value, dict):
        raise SourceLockError("source lock must be an object")
    return value


def _semantic_sha256(value: dict[str, object]) -> str:
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()
    ).hexdigest()


def _validate_file_group(lock: dict[str, object], key: str) -> None:
    entries = lock.get(key)
    if not isinstance(entries, list) or not entries:
        raise SourceLockError(f"{key} must be a nonempty list")
    paths: set[str] = set()
    for entry in entries:
        if not isinstance(entry, dict):
            raise SourceLockError(f"invalid {key} entry")
        path = entry.get("path")
        digest = entry.get("sha256")
        if not isinstance(path, str) or not isinstance(digest, str):
            raise SourceLockError(f"invalid {key} path or digest")
        if path in paths:
            raise SourceLockError(f"duplicate {key} path")
        paths.add(path)
        target = ROOT / path
        if not target.is_file() or _sha256(target) != digest:
            raise SourceLockError(f"{key} byte hash mismatch: {path}")


def _validate_lock(lock: dict[str, object], *, check_digest: bool = True) -> None:
    if check_digest and _semantic_sha256(lock) != EXPECTED_SEMANTIC_SHA256:
        raise SourceLockError("semantic digest mismatch")
    if lock.get("schema") != "xi-prolate-weighted-pnt-discrepancy-normal-form-source-lock-v1":
        raise SourceLockError("wrong schema")
    if lock.get("checkpoint_version") != VERSION:
        raise SourceLockError("wrong checkpoint version")
    if lock.get("terminal_state") != "P0_INVALIDATED":
        raise SourceLockError("wrong formal state")
    _validate_file_group(lock, "dependencies")
    _validate_file_group(lock, "artifacts")

    external = lock.get("external_sources")
    if not isinstance(external, list) or len(external) != 2:
        raise SourceLockError("wrong external-source inventory")
    expected_external = {
        (
            "CCM-ZST-v1",
            "arXiv:2511.22755v1",
            "vendor/CCM-ZST-2511.22755v1.pdf",
            "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
        ),
        (
            "FKS-PNT-v3",
            "arXiv:2204.02588v3",
            "vendor/FKS-PNT-2204.02588v3.pdf",
            "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4",
        ),
    }
    observed_external = set()
    for entry in external:
        if not isinstance(entry, dict):
            raise SourceLockError("invalid external source")
        item = (
            entry.get("id"),
            entry.get("version"),
            entry.get("vendored_path"),
            entry.get("sha256"),
        )
        observed_external.add(item)
        path = entry.get("vendored_path")
        digest = entry.get("sha256")
        if not isinstance(path, str) or not isinstance(digest, str) or _sha256(ROOT / path) != digest:
            raise SourceLockError("external source byte mismatch")
    if observed_external != expected_external:
        raise SourceLockError("external source mismatch")

    conventions = lock.get("locked_conventions")
    if not isinstance(conventions, dict):
        raise SourceLockError("missing locked conventions")
    expected_conventions = {
        "fourier_transform": "hat(f)(t)=integral_I f(x)*exp(-i*t*x) dx",
        "logarithmic_interval": "a=log(lambda), L=2*a, I=[-a,a]",
        "zero_extension": "every translation is applied after extension by zero to the whole real line",
        "centered_basis": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L), abs(n)<=N",
        "inversion": "J*f(x)=f(-x), equivalently J*V_n=V_-n",
        "prime_endpoint": "every prime power 1<n<=lambda^2 is included; h<=L is inclusive",
        "tail_domain": "nu_tail is integrated over the whole real translation line; h>L killing is retained",
    }
    for key, expected in expected_conventions.items():
        if conventions.get(key) != expected:
            raise SourceLockError(f"locked convention mutation: {key}")
    prime_sign = conventions.get("prime_block_sign")
    if not isinstance(prime_sign, str) or "contains -2*sum" not in prime_sign:
        raise SourceLockError("prime sign mutation")
    if conventions.get("parameter_ingestion") != (
        "decimal source parameters are parsed from text and never through binary64"
    ):
        raise SourceLockError("parameter-ingestion mutation")

    formulas = lock.get("locked_formulas")
    if not isinstance(formulas, dict):
        raise SourceLockError("missing formulas")
    expected_formulas = {
        "tail_measure": "nu_tail(dh)=exp(-5*abs(h)/2)/(1-exp(-2*abs(h))) dh",
        "weighted_discrepancy": "D_lambda(h)=W(exp(h))-2*(exp(h/2)-1), 0<=h<=L",
        "signed_discrepancy_measure": "dD_lambda=sum_(1<n<=lambda^2) Lambda(n)/sqrt(n)*delta_log(n)-exp(h/2) dh",
        "signed_translation": "T_D*f=integral_[0,L] K_h*f dD_lambda(h)",
        "pole_kernel": "P=K_plus+K_minus; equivalently P_plus-K_plus=K_minus and P_minus-K_plus=K_minus on their parity sectors",
        "source_independent_scalar": "c_star=psi(1/4)-log(pi)+4=4-gamma-pi/2-3*log(2)-log(pi)",
        "normal_form": "Q_lambda=c_star*I+A_tail-T_D as a form and on every finite Fourier compression",
        "critical_reserve_target": "the open reserve is h/X<=C uniformly on one common unbounded schedule",
        "ball_minor": "Delta_1324=(Q_plus)_12*(Q_plus)_34-(Q_plus)_14*(Q_plus)_32 is strictly negative at lambda=2,N=4",
    }
    for key, expected in expected_formulas.items():
        if formulas.get(key) != expected:
            raise SourceLockError(f"locked formula mutation: {key}")

    claims = lock.get("proof_claims")
    if not isinstance(claims, dict):
        raise SourceLockError("missing proof claims")
    required_true = {
        "weighted_pnt_discrepancy_normal_form_proved",
        "both_parity_kernel_identities_proved",
        "all_lambda_dependent_scalar_mass_cancels_proved",
        "full_tail_killing_retained",
        "inclusive_endpoint_enforced_by_inventory",
        "critical_ground_moment_equivalence_proved",
        "residual_scalar_cancellation_proved",
        "continuous_main_density_magnitude_only_no_go_proved",
        "actual_shift_invariant_negative_minor_ball_enclosed",
    }
    required_false = {
        "actual_natural_even_total_nonnegativity_at_lambda2_N4",
        "uniform_critical_ground_moment_bound_proved",
        "uniform_mixed_reserve_proved",
        "uniform_complementary_gap_proved",
        "equation_5_2_proved",
        "locally_uniform_determinant_convergence_proved",
        "riemann_hypothesis_proved",
        "new_lambda_bound_claimed",
    }
    if any(claims.get(key) is not True for key in required_true):
        raise SourceLockError("a proved finite claim was removed")
    if any(claims.get(key) is not False for key in required_false):
        raise SourceLockError("an open or rejected claim was promoted")

    rejected = lock.get("rejected_mutations")
    required_rejections = {
        "archimedean_tail_truncated_at_interval_length",
        "binary64_parameter_used",
        "continuous_main_density_sign_changed",
        "endpoint_prime_power_omitted",
        "fourier_sign_changed",
        "global_weil_positivity_assumed",
        "inversion_reflection_dropped",
        "lambda_mixed_with_lambda_squared",
        "nonpositive_complementary_gap_reported_as_a_pass",
        "normal_form_identity_promoted_to_uniform_reserve",
        "prime_block_sign_changed",
        "producer_boolean_trusted",
        "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
        "source_normalization_changed",
        "total_positivity_assumed_for_the_actual_natural_even_matrix",
        "unit_source_normalization_substituted",
        "zero_table_used",
    }
    if not isinstance(rejected, list) or not required_rejections.issubset(set(rejected)):
        raise SourceLockError("mandatory rejection inventory incomplete")


class WeightedPNTDiscrepancySourceLockTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.lock = _strict_load()

    def test_source_lock_and_all_bound_bytes(self) -> None:
        _validate_lock(self.lock)

    def test_note_states_exact_theorem_and_open_boundary(self) -> None:
        note = (ROOT / "notes" / "WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md").read_text(
            encoding="utf-8"
        )
        for needle in (
            "Q_\\lambda=c_*I+A_{\\rm tail}-T_D",
            "D_\\lambda(h)=W(e^h)-2(e^{h/2}-1)",
            "The endpoint is inclusive",
            "No truncation of `nu_tail`",
            "does not prove it",
            "equation (5.2)",
        ):
            self.assertIn(needle, note)

    def test_semantic_mutations_are_rejected(self) -> None:
        mutations = []

        def mutate(path: tuple[str, str], value: object) -> None:
            candidate = copy.deepcopy(self.lock)
            candidate[path[0]][path[1]] = value
            mutations.append(candidate)

        mutate(("locked_conventions", "fourier_transform"), "hat(f)=integral f*exp(+i*t*x)")
        mutate(("locked_conventions", "logarithmic_interval"), "L=log(lambda)")
        mutate(("locked_conventions", "inversion"), "reflection omitted")
        mutate(("locked_conventions", "prime_endpoint"), "1<n<lambda")
        mutate(("locked_conventions", "tail_domain"), "truncate at h=L")
        mutate(("locked_conventions", "parameter_ingestion"), "binary64 accepted")
        mutate(("locked_formulas", "signed_discrepancy_measure"), "dD=dW+exp(h/2)dh")
        mutate(("locked_formulas", "source_independent_scalar"), "c_star=psi(1/4)-log(pi)")
        mutate(("locked_formulas", "normal_form"), "Q=cI+A_tail+T_D")
        mutate(("locked_formulas", "ball_minor"), "Delta_1324>0")
        mutate(("proof_claims", "uniform_mixed_reserve_proved"), True)
        mutate(("proof_claims", "equation_5_2_proved"), True)
        mutate(("proof_claims", "riemann_hypothesis_proved"), True)
        mutate(("proof_claims", "actual_natural_even_total_nonnegativity_at_lambda2_N4"), True)
        for index, candidate in enumerate(mutations):
            with self.subTest(index=index):
                with self.assertRaises(SourceLockError):
                    _validate_lock(candidate, check_digest=False)

    def test_duplicate_keys_and_binary64_numbers_are_rejected(self) -> None:
        with self.assertRaises(SourceLockError):
            _strict_load('{"schema":"a","schema":"b"}')
        with self.assertRaises(SourceLockError):
            _strict_load('{"lambda":2.0}')

    def test_dependency_and_artifact_hash_mutations_are_rejected(self) -> None:
        for key in ("dependencies", "artifacts"):
            candidate = copy.deepcopy(self.lock)
            candidate[key][0]["sha256"] = "0" * 64
            with self.subTest(key=key):
                with self.assertRaises(SourceLockError):
                    _validate_lock(candidate, check_digest=False)


if __name__ == "__main__":
    unittest.main()
