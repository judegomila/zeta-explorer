from __future__ import annotations

import hashlib
import importlib.util
import json
import os
from pathlib import Path
import unittest

from flint import arb


WORKSTREAM = Path(__file__).resolve().parents[1]
SOURCE = WORKSTREAM / "src" / "certify_h5_ratio_compact.py"
RESULT = WORKSTREAM / "results" / "h5_ratio_compact_arb.json"
SPEC = importlib.util.spec_from_file_location("certify_h5_ratio_compact", SOURCE)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("could not load H5 compact certificate module")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


class H5RatioCompactCertificateTest(unittest.TestCase):
    def setUp(self) -> None:
        self.payload = json.loads(RESULT.read_text())

    def test_archived_certificate_binds_source_and_has_strict_margins(self) -> None:
        payload = self.payload
        self.assertEqual(payload["schema_version"], MODULE.SCHEMA_VERSION)
        self.assertEqual(payload["status"], MODULE.STATUS)
        self.assertTrue(payload["checks"]["all_checks_passed"])
        self.assertEqual(
            payload["provenance"]["source_sha256_at_start"], sha256(SOURCE)
        )
        self.assertEqual(
            payload["provenance"]["source_sha256_at_start"],
            payload["provenance"]["source_sha256_at_end"],
        )
        self.assertEqual(payload["parameters"]["arb_internal_threads"], 1)
        self.assertEqual(payload["parameters"]["maximum_theta_derivative"], 22)
        self.assertEqual(
            payload["parameters"]["maximum_stabilized_log_derivative"], 21
        )
        self.assertEqual(payload["parameters"]["total_cells"], 3300)
        compact = payload["compact_certificate"]
        self.assertTrue(arb(compact["h_cover"]["minimum"]["target"]["arb"]) > 416)
        for cover in compact["z_covers"]:
            self.assertTrue(
                arb(cover["minimum"]["target"]["arb"])
                > arb(cover["required_lower"])
            )
        self.assertEqual(
            compact["all_cell_interval_trace_sha256"],
            "22136f96428c4b1c832eec61998bf2de6a01ebf3cc12fb7995c168fe6cfe5b12",
        )

    def test_scope_does_not_promote_fixed_h5_to_all_degree(self) -> None:
        scope = self.payload["scope"]
        self.assertIn("fixed complete-theta H5", scope)
        self.assertIn("does not certify the signed c5 payment", scope)
        self.assertIn("or RH", scope)

    @unittest.skipUnless(
        os.environ.get("RUN_H5_COMPACT_REPLAY") == "1",
        "set RUN_H5_COMPACT_REPLAY=1 for the 3300-cell Arb replay",
    )
    def test_full_replay_matches_archived_cell_trace_and_minima(self) -> None:
        replay = MODULE.build_payload(
            self.payload["parameters"]["arb_precision_bits"]
        )
        self.assertEqual(
            replay["compact_certificate"], self.payload["compact_certificate"]
        )
        self.assertEqual(replay["checks"], self.payload["checks"])


if __name__ == "__main__":
    unittest.main()
