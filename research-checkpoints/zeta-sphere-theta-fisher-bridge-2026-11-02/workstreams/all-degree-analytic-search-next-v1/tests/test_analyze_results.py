#!/usr/bin/env python3
"""Tests for the deterministic signed-pair result analyzer."""

from __future__ import annotations

from decimal import Decimal, localcontext
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "src" / "analyze_results.py"
SPEC = importlib.util.spec_from_file_location("next_result_analyzer", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
ANALYZER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = ANALYZER
SPEC.loader.exec_module(ANALYZER)


class AnalyzerFixture:
    def __init__(self, root: Path):
        self.root = root
        self.results = root / "results"
        self.results.mkdir()
        self.tasks_path = root / "tasks.json"
        self.completed_path = root / "completed.jsonl"
        self.failed_path = root / "failed.jsonl"
        self.egf_path = root / "egf.json"
        egf = {
            "status": "exact_egf_identity",
            "parameters": {
                "full_polynomial_degree": 64,
                "scalar_degree": 128,
            },
            "checks": {"all_exact_checks_passed": True},
        }
        self.egf_path.write_text(
            json.dumps(egf, indent=2, sort_keys=True) + "\n", encoding="utf-8"
        )
        self.egf_sha = self.digest(self.egf_path)
        self.tasks: list[dict[str, object]] = []
        self.completed: list[dict[str, object]] = []
        self.failed: list[dict[str, object]] = []
        self.output_paths: dict[str, Path] = {}

    @staticmethod
    def digest(path: Path) -> str:
        return hashlib.sha256(path.read_bytes()).hexdigest()

    @staticmethod
    def decimal_string(value: Decimal) -> str:
        return format(value, "E")

    def result_payload(self, n: int, parity: str, dps: int, replay: bool) -> dict[str, object]:
        power = 2 if parity == "even" else 6
        ell = Decimal("0.25") if parity == "even" else Decimal("1e-100")
        rows: list[dict[str, object]] = []
        for beta, constant_text in ANALYZER.EXPECTED_SCALES:
            constant = Decimal(constant_text)
            with localcontext() as context:
                context.prec = 120
                h_value = constant / (Decimal(n) ** beta)
                energy = Decimal(1) / (Decimal(n) ** power)
                ratio = Decimal(1) if parity == "even" else Decimal(10) ** (n * n)
                residual = Decimal(10) ** (-(80 if replay else 40))
                shift = Decimal(1) / Decimal(n)
            contributions = [Decimal("0.6") + shift, Decimal("-0.4")]
            cumulative = [contributions[0], sum(contributions)]
            rows.append(
                {
                    "beta": beta,
                    "constant": constant_text,
                    "h": self.decimal_string(h_value),
                    "direct_ell": self.decimal_string(ell),
                    "paired_ell": self.decimal_string(ell),
                    "paired_identity_relative_residual": self.decimal_string(residual),
                    "signed_numerator": self.decimal_string(Decimal(1) / ratio),
                    "signed_denominator": "1",
                    "total_variation": "1",
                    "total_variation_over_abs_signed_total": self.decimal_string(ratio),
                    "positive_contribution_sum": "0.6",
                    "negative_contribution_abs_sum": "0.4",
                    "local_feature_energy_0_to_h_simpson16": self.decimal_string(energy),
                    "local_energy_is_rigorous": False,
                    "orbit_signed_contributions": [
                        self.decimal_string(value) for value in contributions
                    ],
                    "orbit_cumulative_signed": [
                        self.decimal_string(value) for value in cumulative
                    ],
                    "minus_tail_diagnostic": {"rigorous_bound": False},
                    "plus_tail_diagnostic": {"rigorous_bound": False},
                }
            )
        return {
            "status": "signed_h_pair_diagnostic",
            "parameters": {
                "n": n,
                "parity": parity,
                "dps": dps,
                "anchor_h": "0",
                "scale_grid": "beta1_beta2_c0p25_1_4",
                "max_orbit": ANALYZER.EXPECTED_MAX_ORBIT,
            },
            "center_interpolant": {
                "ell_A": self.decimal_string(ell),
                "scaled_interpolation_condition_inf": "10",
            },
            "scaled_h_diagnostics": rows,
            "egf_manifest": {
                "path": "egf.json",
                "sha256": self.egf_sha,
                "status": "exact_egf_identity",
            },
        }

    def add_task(
        self,
        n: int,
        parity: str,
        dps: int,
        *,
        replay: bool = False,
        fail: bool = False,
    ) -> None:
        replay_tag = "_replay" if replay else ""
        task_id = f"pair_n{n:02d}_{parity}{replay_tag}_p{dps}"
        output_relative = f"results/{task_id}.json"
        task = {
            "id": task_id,
            "worker": "workstreams/all-degree-analytic-search-next-v1/src/signed_h_pair.py",
            "argv": [
                "--n",
                str(n),
                "--parity",
                parity,
                "--anchor-h",
                "0",
                "--dps",
                str(dps),
                *[
                    value
                    for beta, constant in ANALYZER.EXPECTED_SCALES
                    for value in ("--scaled-h", f"{beta}:{constant}")
                ],
                "--egf-manifest",
                "egf.json",
                "--max-orbit",
                str(ANALYZER.EXPECTED_MAX_ORBIT),
                "--max-seconds",
                "600",
                "--max-output-bytes",
                "8388608",
            ],
            "output": output_relative,
            "expected_status": "signed_h_pair_diagnostic",
            "expected_parameters": {
                "n": n,
                "parity": parity,
                "dps": dps,
                "anchor_h": "0",
                "scale_grid": "beta1_beta2_c0p25_1_4",
                "max_orbit": ANALYZER.EXPECTED_MAX_ORBIT,
            },
        }
        self.tasks.append(task)
        output = self.root / output_relative
        self.output_paths[task_id] = output
        if fail:
            self.failed.append(
                {
                    "task": task_id,
                    "returncode": 1,
                    "output": str(output),
                }
            )
            return
        payload = self.result_payload(n, parity, dps, replay)
        output.write_text(
            json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8"
        )
        self.completed.append(
            {
                "task": task_id,
                "returncode": 0,
                "output": str(output),
                "sha256": self.digest(output),
            }
        )

    def finish(self) -> None:
        for n, dps in ANALYZER.EXPECTED_PRIMARY_N_DPS:
            for parity in ("even", "odd"):
                self.add_task(
                    n,
                    parity,
                    dps,
                    fail=(n == 24 and parity == "odd"),
                )
        for n, dps in ANALYZER.EXPECTED_REPLAY_N_DPS:
            for parity in ("even", "odd"):
                self.add_task(n, parity, dps, replay=True)
        self.tasks_path.write_text(
            json.dumps(
                {
                    "schema_version": 1,
                    "stage": "stage1",
                    "purpose": "synthetic analyzer fixture",
                    "egf_manifest": "egf.json",
                    "egf_manifest_sha256": self.egf_sha,
                    "tasks": self.tasks,
                },
                indent=2,
                sort_keys=True,
            )
            + "\n",
            encoding="utf-8",
        )
        # Deliberately reverse receipt order: analysis ordering must come only
        # from task identities and numeric keys.
        self.completed_path.write_text(
            "".join(json.dumps(row, sort_keys=True) + "\n" for row in reversed(self.completed)),
            encoding="utf-8",
        )
        self.failed_path.write_text(
            "".join(json.dumps(row, sort_keys=True) + "\n" for row in reversed(self.failed)),
            encoding="utf-8",
        )

    def analyze(self) -> dict[str, object]:
        return ANALYZER.build_analysis(
            root=self.root,
            tasks_path=self.tasks_path,
            completed_path=self.completed_path,
            failed_path=self.failed_path,
        )


class AnalyzeResultsTest(unittest.TestCase):
    def test_end_to_end_summary_is_deterministic_and_reproduces_metrics(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            fixture = AnalyzerFixture(Path(directory))
            fixture.finish()
            first = fixture.analyze()
            second = fixture.analyze()
            self.assertEqual(ANALYZER.encoded(first), ANALYZER.encoded(second))

            integrity = first["input_integrity"]
            self.assertEqual(integrity["task_count"], 14)
            self.assertEqual(integrity["completed_count"], 13)
            self.assertEqual(integrity["failed_count"], 1)
            self.assertEqual(integrity["selected_group_coverage"], "10/10")
            self.assertEqual(len(first["selected_sources"]), 10)

            replay = first["replay_gates"]
            self.assertEqual(len(replay), 4)
            accepted_replays = [
                row for row in replay if row["status"] == "accepted_primary_and_replay"
            ]
            self.assertEqual(len(accepted_replays), 3)
            self.assertTrue(all(row["exact_at_emitted_precision"] for row in accepted_replays))
            self.assertTrue(all(row["gate_pass"] for row in accepted_replays))
            recovered = next(
                row for row in replay if row["status"] == "accepted_replay_after_failed_primary"
            )
            self.assertEqual(recovered["n"], 24)
            self.assertEqual(recovered["parity"], "odd")
            self.assertTrue(recovered["numerical_accuracy_gate_pass"])
            self.assertFalse(recovered["replay_agreement_gate_pass"])
            self.assertFalse(recovered["gate_pass"])

            odd_tv = [
                row
                for row in first["tv_cancellation_regressions"]
                if row["parity"] == "odd"
            ]
            self.assertEqual(len(odd_tv), 6)
            for row in odd_tv:
                self.assertAlmostEqual(float(Decimal(row["slope_per_n_squared"])), 1.0, places=12)

            beta2_energy = {
                row["parity"]: Decimal(row["slope_vs_log10_n"])
                for row in first["local_energy_regressions"]
                if row["beta"] == 2 and row["constant"] == "1"
            }
            self.assertAlmostEqual(float(beta2_energy["even"]), -2.0, places=12)
            self.assertAlmostEqual(float(beta2_energy["odd"]), -6.0, places=12)

            profiles = first["profile_comparisons"]
            self.assertEqual(len(profiles), 12)
            self.assertTrue(all(row["n_low"] == 20 and row["n_high"] == 24 for row in profiles))
            self.assertTrue(all(row["gate_pass"] for row in profiles))

            taylor = first["taylor_normalizations"]
            even_c1 = next(
                row
                for row in taylor
                if row["parity"] == "even" and row["constant"] == "1"
            )
            odd_c1 = next(
                row
                for row in taylor
                if row["parity"] == "odd" and row["constant"] == "1"
            )
            self.assertAlmostEqual(float(Decimal(even_c1["energy_over_h_power"])), 1.0)
            self.assertAlmostEqual(float(Decimal(odd_c1["energy_over_h_power"])), 1.0)
            self.assertFalse(first["caveats"]["finite_results_prove_target"])

    def test_tampered_result_is_rejected_before_analysis(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            fixture = AnalyzerFixture(Path(directory))
            fixture.finish()
            target = fixture.output_paths["pair_n12_even_p468"]
            target.write_text(target.read_text(encoding="utf-8") + " ", encoding="utf-8")
            with self.assertRaisesRegex(ANALYZER.AnalysisError, "SHA-256"):
                fixture.analyze()

    def test_queue_egf_binding_is_enforced(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            fixture = AnalyzerFixture(Path(directory))
            fixture.finish()
            queue = json.loads(fixture.tasks_path.read_text(encoding="utf-8"))
            queue["egf_manifest_sha256"] = "0" * 64
            fixture.tasks_path.write_text(
                json.dumps(queue, indent=2, sort_keys=True) + "\n",
                encoding="utf-8",
            )
            with self.assertRaisesRegex(ANALYZER.AnalysisError, "SHA-256"):
                fixture.analyze()


if __name__ == "__main__":
    unittest.main()
