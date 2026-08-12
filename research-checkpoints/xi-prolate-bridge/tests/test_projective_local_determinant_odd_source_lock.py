from __future__ import annotations

import copy
import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "PROJECTIVE_LOCAL_DETERMINANT_ODD_SOURCE_LOCK.json"
VERSION = "0.44.0-projective-low-resolvent-determinant-odd"
EXPECTED_DEPENDENCIES = {
    "EXPLICIT_MIXED_COST_QUOTIENT_ODD_SOURCE_LOCK.json",
    "DIRECT_RH_ATTACK.md",
    "P0_SOURCE_LOCK.json",
    "P0_NORMALIZATION_AUDIT.md",
    "notes/DETERMINANT_LIMIT_AUDIT.md",
    "notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md",
    "notes/PROJECTED_STATE_NORM_LOWER_BOUND.md",
    "notes/PROJECTION_RATE_THEOREM.md",
    "notes/HIGH_FOURIER_COERCIVITY.md",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md",
    "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md",
    "notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md",
    "notes/ODD_JUMP_FINITE_KRYLOV_ATTACK.md",
    "notes/ODD_NU_TRANSVERSE_SIGN_ATTACK.md",
    "notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
    "notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md",
    "notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md",
    "notes/UNPROJECTED_ODD_NU_SIGN_ATTACK.md",
    "requirements.txt",
    "vendor/CCM-ZST-2511.22755v1.pdf",
    "vendor/SLEPIAN-PSWF-IV-1964.pdf",
}
EXPECTED_EXTERNALS = {
    (
        "CCM-ZST-v1",
        "arXiv:2511.22755v1",
        "vendor/CCM-ZST-2511.22755v1.pdf",
    ),
    (
        "SLEPIAN-PSWF-IV-1964",
        "Bell System Technical Journal 43 (1964), 3009--3057",
        "vendor/SLEPIAN-PSWF-IV-1964.pdf",
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
    assert payload["schema"] == "xi-prolate-projective-local-determinant-odd-source-lock-v1"
    assert payload["checkpoint_version"] == VERSION
    assert payload["terminal_state"] == "P0_INVALIDATED"

    dependencies = payload["dependencies"]
    assert len(dependencies) == 21
    dependency_paths = [item["path"] for item in dependencies]
    assert len(dependency_paths) == len(set(dependency_paths))
    assert set(dependency_paths) == EXPECTED_DEPENDENCIES
    for item in dependencies:
        relative = Path(item["path"])
        assert not relative.is_absolute()
        assert ".." not in relative.parts
        assert _sha256(ROOT / relative) == item["sha256"]

    external_sources = payload["external_sources"]
    assert len(external_sources) == 2
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

    admissions = payload["source_admissions"]
    assert admissions
    assert all(value is False for value in admissions.values())

    boundary = payload["claim_boundary"]
    assert boundary["checkpoint_version"] == VERSION
    assert boundary["formal_status"] == "P0_INVALIDATED"
    not_proved = "\n".join(boundary["not_proved"])
    for required in (
        "simple-even global finite Weil ground state",
        "lambda-scale low-resolvent",
        "uniform first paired-resolvent trace",
        "positive unprojected odd third moment",
        "equation (5.2)",
    ):
        assert required in not_proved


class ProjectiveLocalDeterminantOddSourceLockTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.lock = _load_no_duplicate_keys(LOCK_PATH)

    def test_live_lock_and_every_dependency_validate(self) -> None:
        _validate(self.lock)

    def test_four_new_theorem_notes_are_bound(self) -> None:
        dependency_paths = {item["path"] for item in self.lock["dependencies"]}
        self.assertTrue(
            {
                "notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md",
                "notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md",
                "notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md",
                "notes/UNPROJECTED_ODD_NU_SIGN_ATTACK.md",
            }.issubset(dependency_paths)
        )

    def test_suzuki_candidate_is_not_an_admitted_source(self) -> None:
        source_ids = {item["id"] for item in self.lock["external_sources"]}
        self.assertNotIn("SUZUKI-SCREW-2606.09096v1", source_ids)
        self.assertTrue((ROOT / "notes/SUZUKI_SCREW_SOURCE_CANDIDATE_AUDIT.md").is_file())

    def test_status_manifests_preserve_open_claims(self) -> None:
        p0 = _load_no_duplicate_keys(ROOT / "P0_STATUS.json")
        project = _load_no_duplicate_keys(ROOT / "PROJECT_STATUS.json")
        handoff = _load_no_duplicate_keys(ROOT / "HANDOFF_MANIFEST.json")
        # This historical lock remains immutable when a later checkpoint
        # advances the live status manifests.  Require the three live
        # manifests to agree with one another, while the lock itself remains
        # pinned to VERSION in _validate().
        self.assertEqual(p0["artifact_version"], project["artifact_version"])
        self.assertEqual(p0["artifact_version"], handoff["artifact_version"])
        for claims in (p0["component_claims"], project, handoff["claim_status"]):
            self.assertTrue(claims["projective_local_determinant_odd_source_locked"])
            self.assertFalse(claims["projective_low_mode_actual_weil_ground_target_proved"])
            self.assertFalse(claims["finite_quotient_trace_moment_limits_proved"])
            self.assertFalse(claims["actual_odd_energy_orientation_proved"])
            self.assertFalse(claims["equation_5_2_proved"])
            self.assertFalse(claims["local_uniform_characteristic_limit_proved"])
            self.assertFalse(claims["suzuki_screw_v1_admitted"])

    def test_source_convention_mutations_fail_closed(self) -> None:
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

    def test_hash_and_claim_mutations_fail_closed(self) -> None:
        payload = copy.deepcopy(self.lock)
        payload["dependencies"][0]["sha256"] = "0" * 64
        with self.assertRaises(AssertionError):
            _validate(payload)

        payload = copy.deepcopy(self.lock)
        payload["source_admissions"]["equation_5_2_claimed"] = True
        with self.assertRaises(AssertionError):
            _validate(payload)


if __name__ == "__main__":
    unittest.main()
