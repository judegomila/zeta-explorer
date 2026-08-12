from __future__ import annotations

import ast
import copy
import hashlib
import json
import mpmath as mp
from pathlib import Path
import sys
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

import compressed_multiplier_trace as producer  # noqa: E402
from verifier import compressed_multiplier_trace_replay as verifier  # noqa: E402


class CompressedMultiplierTraceTests(unittest.TestCase):
    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        raw = self._bytes(payload)
        return verifier.replay(payload, producer_bytes=raw)

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None
            else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    def test_p5_p7_replay_at_base_and_doubled_precision(self) -> None:
        expected_terms = {
            5: [(2, 2, 1), (3, 3, 1), (4, 2, 2), (5, 5, 1)],
            7: [
                (2, 2, 1),
                (3, 3, 1),
                (4, 2, 2),
                (5, 5, 1),
                (7, 7, 1),
                (8, 2, 3),
                (9, 3, 2),
                (11, 11, 1),
            ],
        }
        for p, terms in expected_terms.items():
            low = producer.produce(p, 50)
            high = producer.produce(p, 100)
            for payload in (low, high):
                raw = self._bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                self.assertEqual(
                    report["status"],
                    "COMPRESSED_MULTIPLIER_TRACE_COMPONENT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )
                self.assertTrue(
                    report["checks"][
                        "all_submitted_intervals_enclose_reconstruction"
                    ]
                )
                self.assertFalse(report["checks"]["producer_booleans_trusted"])
                exact = payload["certificate"]["exact"]
                self.assertEqual(
                    [
                        (item["n"], item["prime"], item["exponent"])
                        for item in exact["prime_powers"]
                    ],
                    terms,
                )
                self.assertEqual(exact["N"], (p * p + 3) // 4)
                self.assertEqual(exact["ambient_even_complement_dimension"], exact["N"])
                self.assertEqual(exact["ambient_odd_dimension"], exact["N"])
                self.assertTrue(exact["finite_trace_rank_bound_is_order_vacuous"])
                self.assertEqual(exact["prime_power_integer_cutoff"], p * p // 4)
                self.assertEqual(payload["arithmetic"]["library"], "mpmath.iv 1.4.1")
            for name in producer.INTERVAL_FIELDS:
                a = verifier._interval(
                    low["certificate"]["outward_intervals"][name], name, 50
                )
                b = verifier._interval(
                    high["certificate"]["outward_intervals"][name], name, 100
                )
                self.assertLessEqual(a[0], b[1], name)
                self.assertLessEqual(b[0], a[1], name)
                self.assertLessEqual(b[1] - b[0], a[1] - a[0], name)

    def test_exact_capture_and_quotient_gluing_saturations(self) -> None:
        payload = producer.produce(5, 50)
        regressions = payload["certificate"]["exact_regressions"]
        capture = regressions["capture_floor_model"]
        self.assertEqual(capture["g"], {"numerator": "4", "denominator": "1"})
        self.assertEqual(
            capture["s_squared"], {"numerator": "9", "denominator": "25"}
        )
        self.assertEqual(
            capture["certified_floor"], {"numerator": "7", "denominator": "25"}
        )
        self.assertEqual(capture["actual_compressed_floor"], capture["certified_floor"])
        self.assertEqual(
            capture["inclusive_rank_projector_threshold"], "[g-delta,infinity)"
        )
        self.assertEqual(
            capture["strict_capture_projector_threshold"], "(g-delta,infinity)"
        )
        self.assertEqual(capture["inclusive_rank_projector_diagonal"], [1, 1])
        self.assertEqual(capture["strict_capture_projector_diagonal"], [1, 0])
        gluing = regressions["quotient_gluing_model"]
        self.assertEqual(
            gluing["quotient_metric"], {"numerator": "9", "denominator": "4"}
        )
        self.assertEqual(gluing["chi"], {"numerator": "3", "denominator": "5"})
        self.assertEqual(gluing["nu"], {"numerator": "2", "denominator": "5"})
        self._replay(payload)

    def test_producer_and_reconstructor_reject_nonexact_or_off_schedule_inputs(self) -> None:
        for value in (True, 5.0, 4, 3):
            with self.subTest(value=value, path="producer"):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(value, 50)  # type: ignore[arg-type]
            with self.subTest(value=value, path="verifier"):
                with self.assertRaises(verifier.ReplayError):
                    verifier.reconstruct(value, 50)  # type: ignore[arg-type]
        for value in (False, 50.0, 49):
            with self.subTest(value=value, parameter="dps"):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(5, value)  # type: ignore[arg-type]

    def test_exact_producer_bytes_duplicate_keys_and_binary64_are_rejected(self) -> None:
        payload = producer.produce(5, 50)
        raw = self._bytes(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)
        changed = copy.deepcopy(payload)
        changed["input"]["lambda_numerator"] = 7
        with self.assertRaisesRegex(verifier.ReplayError, "do not decode exactly"):
            verifier.replay(changed, producer_bytes=raw)
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(b'{"p":5,"p":7}', "adversarial")
        payload["input"]["kappa"] = 0.5
        self._reject(payload, "binary64|non-integer JSON number")

    def test_omitted_prime_power_and_lambda_cutoff_substitution_are_rejected(self) -> None:
        payload = producer.produce(7, 50)
        inventory = payload["certificate"]["exact"]["prime_powers"]
        inventory[:] = [item for item in inventory if item["n"] != 8]
        payload["certificate"]["exact"]["prime_power_count"] -= 1
        self._reject(payload, "prime-power inventory")

        payload = producer.produce(7, 50)
        payload["certificate"]["exact"]["prime_power_integer_cutoff"] = 3
        self._reject(payload, "prime-power inventory|schedule")

        payload = producer.produce(7, 50)
        payload["certificate"]["exact"]["x_lambda_squared"] = copy.deepcopy(
            payload["certificate"]["exact"]["lambda"]
        )
        self._reject(payload, "schedule")

        payload = producer.produce(5, 50)
        payload["certificate"]["exact"][
            "finite_trace_rank_bound_is_order_vacuous"
        ] = False
        self._reject(payload, "schedule|prime-power inventory")

    def test_fourier_sign_prime_sign_and_endpoint_mutations_are_rejected(self) -> None:
        payload = producer.produce(5, 50)
        payload["locked_conventions"]["source_interval"] = (
            "[-log(lambda),log(lambda)] with Lebesgue measure and zero extension"
        )
        self._reject(payload, "locked_conventions")

        payload = producer.produce(5, 50)
        payload["locked_conventions"]["physical_interval"] = (
            "[-lambda,lambda] with Lebesgue measure and zero extension"
        )
        self._reject(payload, "locked_conventions")

        payload = producer.produce(5, 50)
        payload["locked_conventions"]["fourier_sign"] = (
            "fhat(t)=integral f(y)*exp(+i*t*y) dy"
        )
        self._reject(payload, "locked_conventions")

        payload = producer.produce(5, 50)
        payload["locked_conventions"]["prime_sign"] = (
            "m_lambda=2*theta_prime+2*sum Lambda(n)/sqrt(n)*cos(t*log(n))"
        )
        self._reject(payload, "locked_conventions")

        payload = producer.produce(5, 50)
        payload["locked_conventions"]["prime_endpoint"] = (
            "prime powers n<lambda^2 only"
        )
        self._reject(payload, "locked_conventions")

    def test_cached_matrix_claim_promotions_and_falsified_library_are_rejected(self) -> None:
        payload = producer.produce(5, 50)
        payload["certificate"]["cached_weil_matrix"] = [[1]]
        self._reject(payload, "certificate inventory|cached matrices")

        payload = producer.produce(5, 50)
        payload["claim_scope"]["proved"].append(
            "equation (5.2) of DIRECT_RH_ATTACK.md"
        )
        self._reject(payload, "claim_scope")

        for field in (
            "physical_capture_claimed",
            "signed_low_comparison_claimed",
            "signed_sector_floor_claimed",
            "equation_5_2_claimed",
            "determinant_limit_claimed",
            "rh_proved",
        ):
            payload = producer.produce(5, 50)
            payload["source_admissions"][field] = True
            with self.subTest(field=field):
                self._reject(payload, "source_admissions")

        payload = producer.produce(5, 50)
        payload["arithmetic"]["library"] = "mpmath.iv falsified-version"
        self._reject(payload, "arithmetic")

        payload = producer.produce(5, 50)
        payload["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        self._reject(payload, "terminal_state")

    def test_raw_dyadic_overwide_and_non_enclosing_intervals_are_rejected(self) -> None:
        payload = producer.produce(5, 50)
        endpoint = payload["certificate"]["outward_intervals"]["M2_bound"][
            "dyadic"
        ]["upper"]
        endpoint[3] += 1
        self._reject(payload, "bit count|canonical")

        payload = producer.produce(5, 50)
        interval = payload["certificate"]["outward_intervals"]["trace_bound"]
        interval["dyadic"] = {
            "lower": [0, "0", 0, 0],
            "upper": [0, "1", 20, 1],
        }
        interval["decimal"] = ["0.0", "1048576.0"]
        self._reject(payload, "precision-tight|center differs")

        payload = producer.produce(5, 50)
        expected_lower = verifier.reconstruct(5, 50)[1]["L"][0]
        sign, mantissa, exponent, bit_count = expected_lower._mpf_
        singleton = [sign, str(mantissa), exponent, bit_count]
        with mp.workdps(70):
            decimal = mp.nstr(expected_lower, 60)
        interval = payload["certificate"]["outward_intervals"]["L"]
        interval["dyadic"] = {"lower": singleton, "upper": singleton.copy()}
        interval["decimal"] = [decimal, decimal]
        self._reject(payload, "does not enclose independent reconstruction")

    def test_regression_mutations_are_reconstructed_not_trusted(self) -> None:
        changes = (
            ("capture_floor_model", "certified_floor", "8"),
            ("capture_floor_model", "actual_compressed_floor", "8"),
            ("quotient_gluing_model", "chi_squared", "10"),
            ("quotient_gluing_model", "nu", "1"),
            ("rank_only_capture_obstruction", "forced_s_squared", "0"),
        )
        for section, field, numerator in changes:
            payload = producer.produce(5, 50)
            payload["certificate"]["exact_regressions"][section][field][
                "numerator"
            ] = numerator
            with self.subTest(section=section, field=field):
                self._reject(payload, "regression reconstruction")

        payload = producer.produce(5, 50)
        payload["certificate"]["exact_regressions"]["capture_floor_model"][
            "strict_capture_projector_threshold"
        ] = "[g-delta,infinity)"
        self._reject(payload, "regression reconstruction")

        payload = producer.produce(5, 50)
        payload["source_admissions"][
            "inclusive_rank_projector_distinct_from_strict_capture_projector"
        ] = False
        self._reject(payload, "source_admissions")

    def test_source_hashes_are_rehashed_and_declared_exactly(self) -> None:
        payload = producer.produce(5, 50)
        payload["source_hashes"][producer.NOTE] = "0" * 64
        self._reject(payload, "source-hash inventory")

        payload = producer.produce(5, 50)
        with mock.patch.dict(
            verifier.PINNED_HASHES, {verifier.NOTE: "0" * 64}, clear=False
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "source byte hash"):
                self._replay(payload)

    def test_verifier_imports_neither_producer_nor_project_helpers(self) -> None:
        source = (ROOT / "verifier/compressed_multiplier_trace_replay.py").read_text(
            encoding="utf-8"
        )
        tree = ast.parse(source)
        modules: list[str] = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                modules.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                modules.append(node.module)
        self.assertNotIn("compressed_multiplier_trace", modules)
        forbidden = {
            "parity_multiplier_schur",
            "high_fourier_coercivity",
            "weil_matrix",
        }
        self.assertTrue(forbidden.isdisjoint(modules))


if __name__ == "__main__":
    unittest.main()
