from __future__ import annotations

import copy
from fractions import Fraction
import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "PROJECTIVE_WEDGE_PAIRED_TRACE_SOURCE_LOCK.json"
VERSION = "0.45.0-projective-wedge-paired-trace-odd-response"
EXPECTED_DEPENDENCIES = {
    "PROJECTIVE_LOCAL_DETERMINANT_ODD_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "notes/DETERMINANT_LIMIT_AUDIT.md",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md",
    "notes/PROJECTION_RATE_THEOREM.md",
    "notes/HIGH_FOURIER_COERCIVITY.md",
    "notes/SIGNED_SECTOR_MIDDLE_WINDOW_OBSTRUCTION.md",
    "notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
    "notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md",
    "notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md",
    "notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md",
    "notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md",
    "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md",
    "requirements.txt",
    "vendor/CCM-ZST-2511.22755v1.pdf",
}
EXPECTED_EXTERNALS = {
    (
        "CCM-ZST-v1",
        "arXiv:2511.22755v1",
        "vendor/CCM-ZST-2511.22755v1.pdf",
    ),
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


def _validate(payload: dict) -> None:
    assert payload["schema"] == "xi-prolate-projective-wedge-paired-trace-source-lock-v1"
    assert payload["claim_class"] == (
        "PROJECTIVE_WEDGE_THREE_SCALE_TRANSVERSE_AND_PAIRED_TRACE_ODD_RESPONSE_REDUCTION"
    )
    assert payload["checkpoint_version"] == VERSION
    assert payload["terminal_state"] == "P0_INVALIDATED"

    dependencies = payload["dependencies"]
    assert len(dependencies) == 18
    dependency_paths = [item["path"] for item in dependencies]
    assert len(dependency_paths) == len(set(dependency_paths))
    assert set(dependency_paths) == EXPECTED_DEPENDENCIES
    for item in dependencies:
        relative = Path(item["path"])
        assert not relative.is_absolute()
        assert ".." not in relative.parts
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
    assert conventions["inversion"] == "Jf(x)=f(-x)"
    assert conventions["source_normalization"] == (
        "4*hat(k_lambda^+) tends to Xi; unit-normalizing h_lambda is rejected"
    )

    formulas = payload["locked_formulas"]
    for required in (
        "exact_projective_low_distance",
        "anchor_graph_bounds",
        "raw_transverse_support",
        "separated_cauchy_bound",
        "far_schur_identity",
        "middle_schur_ratio",
        "middle_obstruction_model",
        "odd_response",
        "ground_transform_ratio",
        "first_paired_trace",
        "two_height_trace_gate",
        "subexponential_obstruction",
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
        "exact finite projective low-distance identity",
        "raw low-Fourier support",
        "finite simple-even odd-response",
        "fixed two-height equivalence",
    ):
        assert required in proved
    not_proved = "\n".join(boundary["not_proved"])
    for required in (
        "simple-even global finite Weil ground state",
        "strict shifted even and odd sector signs",
        "middle-window bound",
        "actual exponential odd-resolvent compensation",
        "finite quotient trace-moment limits",
        "equation (5.2)",
    ):
        assert required in not_proved


def _dot(left: tuple[Fraction, ...], right: tuple[Fraction, ...]) -> Fraction:
    return sum((a * b for a, b in zip(left, right)), Fraction(0))


class ProjectiveWedgePairedTraceSourceLockTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.lock = _load_no_duplicate_keys(LOCK_PATH)

    def test_live_lock_and_exact_dependency_source_sets_validate(self) -> None:
        _validate(self.lock)

    def test_new_theorems_and_three_scale_provenance_are_bound(self) -> None:
        dependency_paths = {item["path"] for item in self.lock["dependencies"]}
        self.assertTrue(
            {
                "notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md",
                "notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md",
                "notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md",
                "notes/HIGH_FOURIER_COERCIVITY.md",
                "notes/SIGNED_SECTOR_MIDDLE_WINDOW_OBSTRUCTION.md",
            }.issubset(dependency_paths)
        )
        source_ids = {item["id"] for item in self.lock["external_sources"]}
        self.assertEqual(source_ids, {"CCM-ZST-v1"})

    def test_status_manifests_preserve_the_exact_open_boundary(self) -> None:
        p0 = _load_no_duplicate_keys(ROOT / "P0_STATUS.json")
        project = _load_no_duplicate_keys(ROOT / "PROJECT_STATUS.json")
        handoff = _load_no_duplicate_keys(ROOT / "HANDOFF_MANIFEST.json")
        # The historical source lock remains pinned to VERSION in _validate();
        # the three live manifests advance together at later checkpoints.
        self.assertEqual(p0["artifact_version"], project["artifact_version"])
        self.assertEqual(p0["artifact_version"], handoff["artifact_version"])
        for claims in (p0["component_claims"], project, handoff["claim_status"]):
            self.assertTrue(claims["projective_wedge_paired_trace_source_locked"])
            self.assertTrue(claims["projective_transverse_low_distance_identity_proved"])
            self.assertTrue(claims["anchor_normalized_projective_wedge_criterion_proved"])
            self.assertTrue(claims["paired_trace_odd_resolvent_identity_proved"])
            self.assertTrue(claims["uniform_first_trace_two_height_equivalence_proved"])
            self.assertTrue(claims["ground_transform_ratio_trace_bridge_proved"])
            self.assertTrue(claims["subexponential_odd_response_trace_obstruction_proved"])
            self.assertTrue(claims["three_scale_transverse_resolvent_source_locked"])
            self.assertTrue(claims["transverse_raw_support_identity_proved"])
            self.assertTrue(claims["separated_low_far_cauchy_bound_proved"])
            self.assertTrue(claims["exact_far_schur_elimination_proved"])
            self.assertTrue(claims["honest_far_feedback_superpolynomial_decay_proved"])
            self.assertFalse(
                claims["projective_transverse_low_target_for_actual_weil_ground_proved"]
            )
            self.assertFalse(claims["anchor_wedge_graph_product_for_actual_weil_proved"])
            self.assertFalse(claims["actual_middle_window_transverse_ratio_proved"])
            self.assertFalse(claims["actual_odd_resolvent_exponential_compensation_proved"])
            self.assertFalse(claims["uniform_first_paired_trace_proved"])
            self.assertFalse(claims["finite_quotient_trace_moment_limits_proved"])
            self.assertFalse(claims["equation_5_2_proved"])
            self.assertFalse(claims["local_uniform_characteristic_limit_proved"])

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
        payload["source_admissions"]["equation_5_2_claimed"] = True
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["claim_boundary"]["formal_status"] = "P0_DIAGNOSTIC_PASS"
        with self.assertRaises(AssertionError):
            _validate(payload)

    def test_exact_rational_projective_geometry_and_wedge_fixture(self) -> None:
        x = (Fraction(3), Fraction(4))
        u = (Fraction(1), Fraction(2))
        y = tuple(a - b for a, b in zip(x, u))
        x2 = _dot(x, x)
        u2 = _dot(u, u)
        y2 = _dot(y, y)
        xy = _dot(x, y)
        xu = _dot(x, u)
        least_squares_distance2 = x2 - xy * xy / y2
        transverse_u2 = u2 - xu * xu / x2
        theorem_distance2 = x2 * transverse_u2 / y2
        self.assertEqual(least_squares_distance2, Fraction(1, 2))
        self.assertEqual(theorem_distance2, least_squares_distance2)

        a = Fraction(5, 4)
        kappa_0, kappa_z = Fraction(2), Fraction(3)
        correction_0, correction_z = Fraction(1, 5), Fraction(7, 10)
        w_0 = kappa_0 - correction_0
        w_z = kappa_z - correction_z
        normalized_ground = 4 * a * kappa_0 * w_z / w_0
        projected_comparison = 4 * a * kappa_z
        wedge_error = -(4 * a / w_0) * (
            kappa_0 * correction_z - kappa_z * correction_0
        )
        self.assertEqual(normalized_ground - projected_comparison, wedge_error)

    def test_n1_exact_paired_determinant_and_trace_regression(self) -> None:
        # xi_(-1)=xi_1=1/6 and xi_0=2/3 give P(s)=s^2-2/3.
        alpha = Fraction(2)
        response = 1 - Fraction(1, 3) / (1 + alpha * alpha)
        determinant_at_i_alpha = -(alpha * alpha + Fraction(2, 3))
        self.assertEqual(
            determinant_at_i_alpha,
            -response * (1 + alpha * alpha),
        )

        response_derivative = 2 * alpha / (3 * (1 + alpha * alpha) ** 2)
        trace_bracket = (
            Fraction(1, 1 + alpha * alpha)
            + response_derivative / (2 * alpha * response)
        )
        paired_root_trace = Fraction(1, alpha * alpha + Fraction(2, 3))
        self.assertEqual(trace_bracket, Fraction(3, 14))
        self.assertEqual(trace_bracket, paired_root_trace)


if __name__ == "__main__":
    unittest.main()
