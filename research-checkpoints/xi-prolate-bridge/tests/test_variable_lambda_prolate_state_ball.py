import decimal
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class VariableLambdaProlateStateBallTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        flint = Path("/opt/homebrew/opt/flint")
        gmp = Path("/opt/homebrew/opt/gmp")
        mpfr = Path("/opt/homebrew/opt/mpfr")
        if not (flint / "include/flint/arb.h").exists():
            raise unittest.SkipTest("native Homebrew FLINT/Arb is unavailable")
        cls.tmp = Path(tempfile.mkdtemp(prefix="variable-lambda-prolate-ball-"))
        cls.producer = cls.tmp / "producer"
        cls.verifier = cls.tmp / "verifier"
        common = [
            "clang", "-O2", "-std=c11", "-Wall", "-Wextra", "-Werror",
            f"-I{flint / 'include'}", f"-I{gmp / 'include'}",
            f"-I{mpfr / 'include'}", f"-L{flint / 'lib'}",
            f"-L{gmp / 'lib'}", f"-L{mpfr / 'lib'}",
            f"-Wl,-rpath,{flint / 'lib'}", f"-Wl,-rpath,{gmp / 'lib'}",
            f"-Wl,-rpath,{mpfr / 'lib'}", "-lflint", "-lmpfr", "-lgmp", "-lm",
        ]
        for source, output in [
            (ROOT / "src/variable_lambda_prolate_state_ball.c", cls.producer),
            (ROOT / "verifier/variable_lambda_prolate_state_ball_replay.c", cls.verifier),
        ]:
            subprocess.run(
                common[:7] + [str(source)] + common[7:] + ["-o", str(output)],
                cwd=ROOT, check=True, capture_output=True, text=True,
            )
        cls.outputs = {}
        for bits, lambda_text in ((256, "5/2"), (512, "2.500")):
            producer_path = cls.tmp / f"producer_{bits}.txt"
            verifier_path = cls.tmp / f"verifier_{bits}.txt"
            subprocess.run([
                str(cls.producer), "--lambda", lambda_text, "--N", "3",
                "--basis-size", "79", "--tail-terminal", "85",
                "--prec", str(bits), "--output", str(producer_path),
            ], cwd=ROOT, check=True)
            subprocess.run([
                str(cls.verifier), "--producer", str(producer_path),
                "--lambda", "2.5", "--N", "3", "--basis-size", "79",
                "--tail-terminal", "85", "--prec", str(bits),
                "--output", str(verifier_path),
            ], cwd=ROOT, check=True)
            cls.outputs[bits] = producer_path, verifier_path

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    @staticmethod
    def _run(command):
        return subprocess.run(command, cwd=ROOT, capture_output=True, text=True)

    @staticmethod
    def _intervals(path, tag):
        decimal.getcontext().prec = 150
        pattern = re.compile(
            rf"^{tag} (-?\d+) \[([^ ]+) \+/- ([^\]]+)\]$", re.MULTILINE
        )
        answer = {}
        for mode, midpoint, radius in pattern.findall(path.read_text()):
            midpoint = decimal.Decimal(midpoint)
            radius = decimal.Decimal(radius)
            answer[int(mode)] = midpoint - radius, midpoint + radius
        return answer

    @staticmethod
    def _ball_midpoint(path, label):
        match = re.search(
            rf"^BALL {re.escape(label)} \[([^ ]+) \+/- ([^\]]+)\]$",
            path.read_text(), re.MULTILINE,
        )
        if not match:
            raise AssertionError(f"missing ball {label}")
        return decimal.Decimal(match.group(1)), decimal.Decimal(match.group(2))

    def test_pinned_inputs_remain_unchanged(self):
        expected = {
            "P0_SOURCE_LOCK.json":
                "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
            "P0_NORMALIZATION_AUDIT.md":
                "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
            "src/p0_prolate_state_arb.c":
                "fd8fe2a9ff4fb606e674bd4f1bfb71f8fffa4ef69f107e8429b128c24a6ae896",
            "verifier/p0_prolate_state_arb_replay.c":
                "17a78a248259834d0fd95428fc707be8fb5eea9e73b7767adac33e195f4ee2c4",
        }
        for relative, digest in expected.items():
            self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), digest)

    def test_two_paths_and_doubled_precision_enclose_same_coordinates(self):
        poly_families = []
        state_families = []
        for bits in (256, 512):
            producer, verifier = self.outputs[bits]
            self.assertIn("CHECK overall=PASS", producer.read_text())
            self.assertIn("CHECK overall=PASS", verifier.read_text())
            self.assertIn("CHECK independent_matrix_entries_overlap=PASS",
                          verifier.read_text())
            poly_families.extend([
                self._intervals(producer, "POLYCOEFF"),
                self._intervals(verifier, "POLYCOEFF_REPLAY"),
            ])
            state_families.extend([
                self._intervals(producer, "COEFF"),
                self._intervals(verifier, "COEFF_REPLAY"),
            ])
        for families in (poly_families, state_families):
            for mode in range(-3, 4):
                self.assertTrue(all(mode in family for family in families))
                self.assertLessEqual(
                    max(family[mode][0] for family in families),
                    min(family[mode][1] for family in families),
                )

    def test_labels_tail_and_projection_error_are_reproved(self):
        for bits in (256, 512):
            producer, verifier = self.outputs[bits]
            ptext, vtext = producer.read_text(), verifier.read_text()
            self.assertIn("LABEL label=0 rank=0 lower_shift=34 upper_shift=43 status=PASS", ptext)
            self.assertIn("LABEL label=4 rank=2 lower_shift=338 upper_shift=347 status=PASS", ptext)
            self.assertIn("LABEL_REPLAY label=0 lower_shift=34 upper_shift=43 status=PASS", vtext)
            self.assertIn("LABEL_REPLAY label=4 lower_shift=338 upper_shift=347 status=PASS", vtext)
            self.assertIn("CHECK continued_fraction_width_bound=PASS", ptext)
            self.assertIn("CHECK continued_fraction_width_bound=PASS", vtext)
            p_error, _ = self._ball_midpoint(producer, "true_projection_error_upper")
            v_error, _ = self._ball_midpoint(verifier, "replay_true_projection_error_upper")
            self.assertGreater(p_error, decimal.Decimal("0"))
            self.assertLess(p_error, decimal.Decimal("0.001"))
            self.assertLess(abs(p_error - v_error), decimal.Decimal("1e-55"))

    def test_exact_parameter_and_inclusive_noninteger_square_cutoff(self):
        for paths in self.outputs.values():
            for path in paths:
                text = path.read_text()
                self.assertIn("PARAM lambda 5/2", text)
                self.assertIn("PARAM floor_lambda_squared 6", text)
        ptext = self.outputs[256][0].read_text()
        self.assertEqual(len(re.findall(r"^SUMINDEX ", ptext, re.MULTILINE)), 6)
        self.assertNotIn("degenerate_endpoint=1", ptext)
        self.assertNotIn("SUMINDEX 7 ", ptext)

    def test_tail_width_rhs_is_lower_endpoint_certified(self):
        producer_source = (ROOT / "src/variable_lambda_prolate_state_ball.c").read_text()
        verifier_source = (
            ROOT / "verifier/variable_lambda_prolate_state_ball_replay.c"
        ).read_text()
        self.assertIn("set_lower_exact(c2_lower, c2, prec)", producer_source)
        self.assertIn("set_lower_exact(c2lo, c2, prec)", verifier_source)
        self.assertNotIn("set_upper_exact(c2_upper, c2, prec)", producer_source)
        self.assertNotIn("set_upper_exact(c2up, c2, prec)", verifier_source)
        for paths in self.outputs.values():
            for path in paths:
                self.assertIn("LIMIT floor_lambda_squared_max 10000", path.read_text())

    def test_policy_and_parameter_adversaries_fail_closed(self):
        base = [
            str(self.producer), "--lambda", "5/2", "--N", "3",
            "--basis-size", "79", "--tail-terminal", "85", "--prec", "256",
        ]
        adversaries = [
            ["--normalization", "unit_norm"],
            ["--fourier-sign", "negative"],
            ["--inversion-reflection", "omitted"],
            ["--cutoff-policy", "lambda_inclusive"],
            ["--parameter-parser", "binary64"],
            ["--tail-policy", "finite_truncation_only"],
            ["--external-zero-table", "assumed_real"],
            ["--positivity-assumption", "global_weil"],
            ["--determinant-surrogate", "real_axis_eigenvalues"],
        ]
        for extra in adversaries:
            with self.subTest(extra=extra):
                self.assertNotEqual(self._run(base + extra).returncode, 0)
        malformed = ["2.5e0", "0x2.8p0", "nan", "5//2", "2.", ".5"]
        for value in malformed:
            with self.subTest(value=value):
                command = base.copy()
                command[2] = value
                self.assertNotEqual(self._run(command).returncode, 0)
        too_small_interface = base.copy()
        too_small_interface[6] = "78"
        self.assertNotEqual(self._run(too_small_interface).returncode, 0)
        over_resource_cap = base.copy()
        over_resource_cap[2] = "101"
        self.assertNotEqual(self._run(over_resource_cap).returncode, 0)

    def test_replay_rejects_mutated_contract_matrix_and_reflection(self):
        producer = self.outputs[256][0]
        original = producer.read_text()
        mutations = {
            "source hash": original.replace(
                "META source_lock_sha256=24fd", "META source_lock_sha256=ffff", 1),
            "unit normalization": original.replace(
                "LOCK normalization source_limit_h", "LOCK normalization unit_norm", 1),
            "fourier sign": original.replace(
                "LOCK coefficient_sign conjugate_negative_equivalently_cosine_after_evenization",
                "LOCK coefficient_sign positive", 1),
            "missing cutoff term": "\n".join(
                line for line in original.splitlines()
                if not line.startswith("SUMINDEX 6 ")
            ) + "\n",
            "false endpoint degeneracy": original.replace(
                "SUMINDEX 6 included=1 degenerate_endpoint=0",
                "SUMINDEX 6 included=1 degenerate_endpoint=1", 1),
            "wrong label bracket": original.replace(
                "LABEL label=0 rank=0 lower_shift=34",
                "LABEL label=0 rank=0 lower_shift=40", 1),
        }
        diag0 = next(line for line in original.splitlines() if line.startswith("DUMPMD 0 "))
        diag1 = next(line for line in original.splitlines() if line.startswith("DUMPMD 1 "))
        mutations["changed matrix entry"] = original.replace(
            diag0, "DUMPMD 0 " + diag1.split(" ", 2)[2], 1
        )
        cminus3 = next(line for line in original.splitlines() if line.startswith("DUMPC -3 "))
        cminus2 = next(line for line in original.splitlines() if line.startswith("DUMPC -2 "))
        mutations["broken reflection"] = original.replace(
            cminus3, "DUMPC -3 " + cminus2.split(" ", 2)[2], 1
        )
        for name, content in mutations.items():
            with self.subTest(name=name):
                path = self.tmp / (name.replace(" ", "_") + ".txt")
                path.write_text(content)
                result = self._run([
                    str(self.verifier), "--producer", str(path), "--lambda", "5/2",
                    "--N", "3", "--basis-size", "79", "--tail-terminal", "85",
                    "--prec", "256",
                ])
                self.assertNotEqual(result.returncode, 0)

    def test_normalization_and_claim_boundary_are_mandatory(self):
        for paths in self.outputs.values():
            for path in paths:
                text = path.read_text()
                self.assertIn("unit_norm_changes_source_scalar_and_is_rejected=PASS", text)
                self.assertIn("forbidden_unit_normalized_a4", text)
                self.assertIn("META terminal_state=P0_INVALIDATED", text)
                self.assertNotIn("RH_PROVED", text)
                self.assertNotIn("CERTIFIED", text)


if __name__ == "__main__":
    unittest.main()
