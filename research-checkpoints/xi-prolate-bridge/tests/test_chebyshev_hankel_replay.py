import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from chebyshev_hankel_bound import (
    chebyshev_hankel_moments,
    serialize_chebyshev_hankel,
)
from verifier.chebyshev_hankel_bound_replay import (
    INTERVAL_KEYS,
    LOCKED_SOURCE_SHA256,
    parse_exact_decimal,
    reconstruct,
    replay_artifact,
    verify_local_source_lock,
)


class ChebyshevHankelReplayTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.payload = serialize_chebyshev_hankel(
            chebyshev_hankel_moments(60)
        )

    def replay_payload(self, payload, dps=None):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "producer.json"
            path.write_text(json.dumps(payload), encoding="utf-8")
            return replay_artifact(path, dps)

    def test_independent_reconstruction_overlaps_all_seven_intervals(self):
        result = self.replay_payload(self.payload, 80)
        self.assertTrue(result["replay_agrees"])
        self.assertEqual(set(result["intervals_overlap"]), set(INTERVAL_KEYS))
        self.assertTrue(all(result["intervals_overlap"].values()))
        self.assertTrue(
            all(
                result[
                    "certified_upper_endpoints_match_interval_text"
                ].values()
            )
        )
        self.assertEqual(
            set(result["reconstructed_gamma_intervals"]),
            {"gamma_5", "gamma_8", "gamma_10"},
        )
        self.assertFalse(result["producer_check_booleans_trusted"])
        self.assertIn(
            "share the mpmath.iv arithmetic library",
            result["limitations"][0],
        )

    def test_local_v3_lock_and_pdf_bytes_are_checked(self):
        source = verify_local_source_lock()
        self.assertEqual(source["sha256"], LOCKED_SOURCE_SHA256)
        self.assertEqual(source["version"], "arXiv:2204.02588v3")

    def test_exact_decimal_parser_rejects_binary64_and_nonfinite_text(self):
        self.assertEqual(str(parse_exact_decimal("9.22022", "A")), "461011/50000")
        for value in (9.22022, True, None, "nan", "inf", "9.22022/1"):
            with self.subTest(value=value):
                with self.assertRaises((TypeError, ValueError)):
                    parse_exact_decimal(value, "A")

    def test_binary64_inputs_and_endpoints_are_rejected(self):
        for mutation in ("A", "dps", "endpoint"):
            payload = copy.deepcopy(self.payload)
            if mutation == "A":
                payload["inputs"]["A_exact_decimal"] = 9.22022
            elif mutation == "dps":
                payload["inputs"]["interval_decimal_digits"] = 60.0
            else:
                payload["outward_intervals"]["x0"][0] = 0.69
            with self.subTest(mutation=mutation):
                with self.assertRaises(TypeError):
                    self.replay_payload(payload)

    def test_mutated_pnt_kernel_and_constants_are_rejected(self):
        mutations = (
            ("inputs", "alpha_exact_decimal", "0.8476"),
            (
                "locked_formulas",
                "PNT",
                "abs(psi(X)-X)/X < A*(log X)^(3/2)*exp(-alpha*log X)",
            ),
            (
                "locked_formulas",
                "combined_kernel",
                "delta_star(x)=1+exp(-x)*psi(exp(x))",
            ),
            ("source_chain", "sha256", "0" * 64),
        )
        for section, key, replacement in mutations:
            payload = copy.deepcopy(self.payload)
            payload[section][key] = replacement
            with self.subTest(section=section, key=key):
                with self.assertRaises(ValueError):
                    self.replay_payload(payload)

    def test_vacuously_wide_interval_is_rejected(self):
        payload = copy.deepcopy(self.payload)
        payload["outward_intervals"]["x0"] = ["0.1", "10"]
        with self.assertRaisesRegex(ValueError, "vacuously wide"):
            self.replay_payload(payload)

    def test_tight_nonoverlap_and_false_certified_endpoint_do_not_pass(self):
        payload = copy.deepcopy(self.payload)
        payload["outward_intervals"]["x0"] = ["1", "1"]
        result = self.replay_payload(payload)
        self.assertFalse(result["intervals_overlap"]["x0"])
        self.assertFalse(result["replay_agrees"])

        payload = copy.deepcopy(self.payload)
        payload["certified_upper_endpoints"]["C0"] = "159"
        result = self.replay_payload(payload)
        self.assertFalse(
            result["certified_upper_endpoints_match_interval_text"]["C0"]
        )
        self.assertFalse(result["replay_agrees"])

    def test_reconstruction_is_positive_and_contains_all_output_keys(self):
        values = reconstruct(60)
        for key in INTERVAL_KEYS:
            self.assertIn(key, values)
            self.assertGreater(values[key].lower, 0)


if __name__ == "__main__":
    unittest.main()
