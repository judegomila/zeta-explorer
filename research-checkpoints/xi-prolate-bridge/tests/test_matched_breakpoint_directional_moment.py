from __future__ import annotations

import ast
import copy
import hashlib
import json
from pathlib import Path
import sys
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import matched_breakpoint_directional_moment as producer  # noqa: E402
from verifier import matched_breakpoint_directional_moment_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


def interval_records(value: object, path: tuple[object, ...] = ()) -> dict[tuple[object, ...], object]:
    if isinstance(value, dict):
        if set(value) == {"decimal", "dyadic"}:
            return {path: value}
        result: dict[tuple[object, ...], object] = {}
        for key, child in value.items():
            result.update(interval_records(child, path + (key,)))
        return result
    if isinstance(value, list):
        result = {}
        for index, child in enumerate(value):
            result.update(interval_records(child, path + (index,)))
        return result
    return {}


class MatchedBreakpointDirectionalMomentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.base80 = producer.produce(5, 80)
        cls.base160 = producer.produce(5, 160)

    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")

    def _payload(self) -> dict[str, object]:
        return copy.deepcopy(self.base80)

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=self._bytes(payload))

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None
            else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    def test_all_four_pilot_artifacts_replay_and_bind_exact_bytes(self) -> None:
        for p in (5, 9):
            for dps in (80, 160):
                with self.subTest(p=p, dps=dps):
                    path = ROOT / "artifacts" / "matched_breakpoint_directional_moment" / f"p{p}_d{dps}_producer.json"
                    raw = path.read_bytes()
                    payload = verifier._strict_json_loads(raw, "test artifact")
                    self.assertEqual(payload, producer.produce(p, dps))
                    report = verifier.replay(payload, producer_bytes=raw)
                    self.assertEqual(
                        report["schema"],
                        "xi-prolate-matched-breakpoint-directional-moment-replay-v1",
                    )
                    self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                    self.assertEqual(
                        report["producer_binding"]["sha256"],
                        hashlib.sha256(raw).hexdigest(),
                    )
                    self.assertTrue(report["checks"]["formula_tree_independent"])
                    self.assertFalse(report["checks"]["producer_booleans_trusted"])

    def test_schema_inventory_and_shared_library_limitation(self) -> None:
        payload = self._payload()
        self.assertEqual(
            set(payload),
            {
                "schema", "source_lock", "inputs", "terminal_state",
                "source_conventions", "claim_boundary", "certificate",
                "arithmetic_libraries",
            },
        )
        self.assertEqual(
            set(payload["certificate"]),
            {
                "schedule", "moment_threshold_sharpness",
                "positive_pole_centered_obstruction", "rank_one_neumann_algebra",
                "parity_projection_idempotence", "positive_pole_intervals",
                "breakpoint_intervals", "checks",
            },
        )
        report = self._replay(payload)
        libraries = report["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertIn("mpmath.iv", libraries["independence_limitation"])

    def test_all_33_intervals_nest_at_doubled_precision(self) -> None:
        low = interval_records(self.base80["certificate"])
        high = interval_records(self.base160["certificate"])
        self.assertEqual(set(low), set(high))
        self.assertEqual(len(low), 33)
        for path in sorted(low, key=str):
            with self.subTest(path=path):
                lo80, hi80 = verifier._submitted_interval(low[path], "d80", 80)
                lo160, hi160 = verifier._submitted_interval(high[path], "d160", 160)
                self.assertLessEqual(lo80, lo160)
                self.assertLessEqual(hi160, hi80)

    def test_source_lock_and_every_dependency_are_rehashed(self) -> None:
        payload = self._payload()
        binding = payload["source_lock"]
        self.assertEqual(binding["sha256"], verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(set(binding["dependency_hashes"]), verifier.EXPECTED_DEPENDENCY_PATHS)
        for relative, expected in binding["dependency_hashes"].items():
            self.assertEqual(
                hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected
            )
        with mock.patch.object(verifier, "EXPECTED_SOURCE_LOCK_SHA256", "0" * 64):
            self._reject(payload, "source-lock byte hash")

    def test_exact_moment_positive_pole_and_rank_one_boundaries(self) -> None:
        certificate = self.base80["certificate"]
        threshold = certificate["moment_threshold_sharpness"]
        self.assertEqual(threshold["r_star"], 2)
        self.assertEqual(threshold["least_integer_strict_order"], 3)
        self.assertFalse(threshold["boundary_equality_rejected"]["strict_target_power_test"])
        self.assertEqual(threshold["boundary_equality_rejected"]["actual_minimum"], R(0))
        self.assertEqual(threshold["below_threshold_counterexample"]["actual_minimum"], R(-1))
        self.assertTrue(threshold["strict_order_pass_model"]["strict_target_power_test"])

        positive = certificate["positive_pole_centered_obstruction"]
        self.assertEqual(positive["actual_minimum"], R(1))
        self.assertEqual(positive["order_independent_centered_bound"], R(-1))
        self.assertEqual(
            [item["exact_radius"] for item in positive["moments_k_1_through_4"]],
            [R(4)] * 4,
        )

        rank_one = certificate["rank_one_neumann_algebra"]
        equality = rank_one["rank_one_equality_rejection"]
        direction = rank_one["directional_neumann"]
        self.assertEqual(equality["load_2_p_M_inverse_p"], R(1))
        self.assertEqual(equality["A_minus_determinant"], R(0))
        self.assertFalse(equality["strict_pass"])
        self.assertEqual(direction["true_rank_one_load"], R(5, 24))
        self.assertEqual(direction["directional_load_upper"], R(57, 256))
        self.assertEqual(direction["one_minus_delta"], R(1, 4))

    def test_equality_obstruction_and_neumann_mutations_are_rejected(self) -> None:
        mutations = []

        payload = self._payload()
        payload["certificate"]["moment_threshold_sharpness"]["boundary_equality_rejected"]["strict_target_power_test"] = True
        mutations.append(payload)

        payload = self._payload()
        payload["certificate"]["positive_pole_centered_obstruction"]["order_independent_centered_bound"] = R(1)
        mutations.append(payload)

        payload = self._payload()
        payload["certificate"]["rank_one_neumann_algebra"]["rank_one_equality_rejection"]["strict_pass"] = True
        mutations.append(payload)

        payload = self._payload()
        direction = payload["certificate"]["rank_one_neumann_algebra"]["directional_neumann"]
        direction["directional_load_upper"] = direction["one_minus_delta"]
        mutations.append(payload)

        payload = self._payload()
        del payload["certificate"]["positive_pole_centered_obstruction"]
        mutations.append(payload)

        for index, payload in enumerate(mutations):
            with self.subTest(index=index):
                self._reject(payload)

    def test_projection_idempotence_and_inversion_reflection_are_enforced(self) -> None:
        payload = self._payload()
        parity = payload["certificate"]["parity_projection_idempotence"]
        parity["even_projection_squared"][0][0] = R(0)
        self._reject(payload, "parity_projection_idempotence")

        payload = self._payload()
        payload["source_conventions"]["locked_conventions"]["inversion"] = "Fourier residue parity substituted"
        self._reject(payload, "source_conventions")

        payload = self._payload()
        payload["claim_boundary"]["source_admissions"]["inversion_reflection_dropped"] = True
        self._reject(payload, "claim_boundary")

    def test_locked_sign_phase_schedule_and_endpoint_mutations_are_rejected(self) -> None:
        convention_mutations = {
            "fourier_sign": "fhat(t)=integral f(x)*exp(+i*t*x)dx",
            "centered_modes": "phi_n(x)=L^(-1/2)*exp(i*omega_n*x)",
            "matched_schedule": "N=ceil(lambda)",
            "prime_endpoint": "prime powers n<lambda^2 only",
            "prime_sign": "m_lambda=2*theta_prime+2*sum prime terms",
            "pole_signs": "positive pole only; odd pole omitted",
        }
        for key, replacement in convention_mutations.items():
            with self.subTest(convention=key):
                payload = self._payload()
                payload["source_conventions"]["locked_conventions"][key] = replacement
                self._reject(payload, "source_conventions")

        payload = self._payload()
        payload["certificate"]["schedule"]["N"] += 1
        self._reject(payload, "schedule")

    def test_every_forbidden_source_admission_is_rejected(self) -> None:
        admissions = self.base80["claim_boundary"]["source_admissions"]
        self.assertTrue(admissions)
        self.assertFalse(any(admissions.values()))
        for key in admissions:
            with self.subTest(admission=key):
                payload = self._payload()
                payload["claim_boundary"]["source_admissions"][key] = True
                self._reject(payload)

    def test_determinant_rank_and_physical_angle_promotions_are_rejected(self) -> None:
        for key in (
            "full_matched_dimension_claimed",
            "prolate_moment_minor_inferred",
        ):
            with self.subTest(key=key):
                payload = self._payload()
                payload["certificate"]["breakpoint_intervals"][key] = True
                self._reject(payload)

        payload = self._payload()
        payload["certificate"]["positive_pole_intervals"]["physical_high_angle_inferred"] = True
        self._reject(payload)

        payload = self._payload()
        payload["certificate"]["breakpoint_intervals"]["plus_determinant_excludes_zero"] = False
        self._reject(payload)

    def test_independent_direct_vandermonde_overlap_is_reconstructed(self) -> None:
        for sector in ("plus", "odd"):
            with self.subTest(sector=sector):
                payload = self._payload()
                independent = verifier._independent_intervals(5, 80)
                breakpoint = independent["breakpoint"]
                old_dps = verifier.mp.iv.dps
                try:
                    verifier.mp.iv.dps = 80
                    displaced_formula = (
                        breakpoint[f"{sector}_direct"] + verifier.mp.iv.mpf(1)
                    )
                finally:
                    verifier.mp.iv.dps = old_dps
                breakpoint[f"{sector}_formula"] = displaced_formula
                payload["certificate"]["breakpoint_intervals"][
                    f"{sector}_determinant_vandermonde"
                ] = verifier._interval_record(displaced_formula, 80)
                with mock.patch.object(
                    verifier, "_independent_intervals", return_value=independent
                ):
                    self._reject(payload, "independently reconstructed.*do not overlap")

    def test_interval_decimal_reversal_and_excess_width_are_rejected(self) -> None:
        payload = self._payload()
        interval = payload["certificate"]["positive_pole_intervals"]["ell"]
        interval["decimal"][0] = "0"
        self._reject(payload, "decimal text")

        payload = self._payload()
        interval = payload["certificate"]["positive_pole_intervals"]["ell"]
        interval["dyadic"]["lower"], interval["dyadic"]["upper"] = (
            interval["dyadic"]["upper"], interval["dyadic"]["lower"]
        )
        self._reject(payload, "reversed")

        payload = self._payload()
        wide = verifier._interval_record(verifier.mp.iv.mpf([-1, 2]), 80)
        payload["certificate"]["positive_pole_intervals"]["ell"] = wide
        self._reject(payload, "excessively wide")

    def test_binary64_duplicate_keys_noncanonical_rationals_and_byte_binding(self) -> None:
        payload = self._payload()
        payload["inputs"]["lambda_numerator"] = 5.0
        self._reject(payload, "binary64")

        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads('{"x": 0.5}', "float fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier._strict_json_loads('{"x": 1, "x": 2}', "duplicate fixture")

        payload = self._payload()
        payload["certificate"]["moment_threshold_sharpness"]["L"] = {
            "numerator": "2", "denominator": "2"
        }
        self._reject(payload, "canonical rational")

        payload = self._payload()
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "do not decode exactly"):
            verifier.replay(payload, producer_bytes=self._bytes(self.base160))

    def test_input_budget_caps_precede_quadratic_work(self) -> None:
        payload = self._payload()
        payload["inputs"]["lambda_numerator"] = 1001
        self._reject(payload, "lambda numerator exceeds")

        payload = self._payload()
        payload["inputs"]["dps"] = 10001
        self._reject(payload, "precision exceeds")

        with self.assertRaisesRegex(ValueError, "producer work budget"):
            producer.produce(1001, 80)
        with self.assertRaisesRegex(ValueError, "producer work budget"):
            producer.produce(5, 10001)

    def test_no_cross_import_environment_or_secret_read_path(self) -> None:
        producer_source = (ROOT / "src" / "matched_breakpoint_directional_moment.py").read_text(encoding="utf-8")
        verifier_source = (ROOT / "verifier" / "matched_breakpoint_directional_moment_replay.py").read_text(encoding="utf-8")
        tree = ast.parse(verifier_source)
        imports = {
            alias.name
            for node in ast.walk(tree)
            if isinstance(node, ast.Import)
            for alias in node.names
        }
        from_imports = {
            node.module
            for node in ast.walk(tree)
            if isinstance(node, ast.ImportFrom) and node.module is not None
        }
        self.assertNotIn("matched_breakpoint_directional_moment", imports | from_imports)
        self.assertNotIn("os", imports | from_imports)
        self.assertNotIn("getenv(", producer_source + verifier_source)
        self.assertNotIn("os.environ", producer_source + verifier_source)


if __name__ == "__main__":
    unittest.main()
