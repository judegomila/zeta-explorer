import decimal
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ProlateStateBallTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        flint = Path("/opt/homebrew/opt/flint")
        gmp = Path("/opt/homebrew/opt/gmp")
        mpfr = Path("/opt/homebrew/opt/mpfr")
        if not (flint / "include/flint/arb.h").exists():
            raise unittest.SkipTest("native Homebrew FLINT/Arb is unavailable")
        cls.tmp = Path(tempfile.mkdtemp(prefix="p0-prolate-state-ball-"))
        common = [
            "clang", "-O2", "-std=c11", "-Wall", "-Wextra", "-Werror",
            f"-I{flint / 'include'}", f"-I{gmp / 'include'}", f"-I{mpfr / 'include'}",
            f"-L{flint / 'lib'}", f"-L{gmp / 'lib'}", f"-L{mpfr / 'lib'}",
            f"-Wl,-rpath,{flint / 'lib'}", f"-Wl,-rpath,{gmp / 'lib'}",
            f"-Wl,-rpath,{mpfr / 'lib'}", "-lflint", "-lmpfr", "-lgmp", "-lm",
        ]
        cls.producer = cls.tmp / "producer"
        cls.replay = cls.tmp / "replay"
        cls.raw_gap = cls.tmp / "raw_gap"
        for source, output in [
            (ROOT / "src/p0_prolate_state_arb.c", cls.producer),
            (ROOT / "verifier/p0_prolate_state_arb_replay.c", cls.replay),
            (ROOT / "verifier/p0_n4_raw_gap_arb.c", cls.raw_gap),
        ]:
            subprocess.run(common[:7] + [str(source)] + common[7:] + ["-o", str(output)],
                           cwd=ROOT, check=True, capture_output=True, text=True)

        cls.outputs = {}
        for nmax in (3, 4):
            for bits in (256, 512):
                producer_path = cls.tmp / f"lambda2_N{nmax}_producer_{bits}.txt"
                replay_path = cls.tmp / f"lambda2_N{nmax}_replay_{bits}.txt"
                subprocess.run([
                    str(cls.producer), "--lambda", "2", "--N", str(nmax),
                    "--basis-size", "40", "--prec", str(bits),
                    "--output", str(producer_path),
                ], cwd=ROOT, check=True)
                subprocess.run([
                    str(cls.replay), "--lambda", "2", "--N", str(nmax),
                    "--basis-size", "40", "--prec", str(bits),
                    "--producer", str(producer_path), "--output", str(replay_path),
                ], cwd=ROOT, check=True)
                cls.outputs[nmax, bits] = producer_path, replay_path

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    @staticmethod
    def _run(command):
        return subprocess.run(command, cwd=ROOT, capture_output=True, text=True)

    @staticmethod
    def _display_intervals(path, replay=False):
        decimal.getcontext().prec = 120
        tag = "COEFF_REPLAY" if replay else "COEFF"
        pattern = re.compile(
            rf"^{tag} (-?\d+) \[([^ ]+) \+/- ([^\]]+)\]$", re.MULTILINE
        )
        result = {}
        for mode, midpoint, radius in pattern.findall(path.read_text()):
            m = decimal.Decimal(midpoint)
            r = decimal.Decimal(radius)
            result[int(mode)] = (m - r, m + r)
        return result

    def test_doubled_precision_and_independent_paths_overlap(self):
        for nmax in (3, 4):
            families = []
            for bits in (256, 512):
                producer, replay = self.outputs[nmax, bits]
                ptext, rtext = producer.read_text(), replay.read_text()
                self.assertIn("CHECK overall=PASS", ptext)
                self.assertIn("CHECK overall=PASS", rtext)
                self.assertIn("CHECK residual_ball_inside_certified_count_bracket=PASS", ptext)
                self.assertIn("CHECK producer_replay_coefficient_and_kappa_overlap=PASS", rtext)
                families.append(self._display_intervals(producer))
                families.append(self._display_intervals(replay, replay=True))
            for mode in range(-nmax, nmax + 1):
                self.assertTrue(all(mode in family for family in families))
                self.assertLessEqual(max(f[mode][0] for f in families),
                                     min(f[mode][1] for f in families))

    def test_policy_adversaries_fail_closed(self):
        base = [str(self.producer), "--lambda", "2", "--N", "4",
                "--basis-size", "40", "--prec", "256"]
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

    def test_replay_rejects_mutated_contract_and_payload(self):
        producer, _ = self.outputs[4, 256]
        original = producer.read_text()
        mutations = {
            "unit normalization": original.replace(
                "LOCK normalization source_limit_h", "LOCK normalization unit_norm", 1),
            "missing endpoint index": "\n".join(
                line for line in original.splitlines() if not line.startswith("SUMINDEX 4 ")) + "\n",
            "precision mismatch": original.replace("PARAM precision 256", "PARAM precision 255", 1),
            "missing infinite tail": original.replace(
                "LOCK eigen_tail infinite_residual_and_schur",
                "LOCK eigen_tail finite_truncation_only", 1),
        }
        c0 = next(line for line in original.splitlines() if line.startswith("DUMPC 0 "))
        c1 = next(line for line in original.splitlines() if line.startswith("DUMPC 1 "))
        mutations["changed coefficient ball"] = original.replace(
            c0, "DUMPC 0 " + c1.split(" ", 2)[2], 1)
        km = next(line for line in original.splitlines() if line.startswith("DUMPK -4 "))
        kp = next(line for line in original.splitlines() if line.startswith("DUMPK 4 "))
        k3 = next(line for line in original.splitlines() if line.startswith("DUMPK 3 "))
        mutations["broken inversion reflection"] = original.replace(
            km, "DUMPK -4 " + k3.split(" ", 2)[2], 1)
        self.assertEqual(km.split(" ", 2)[2], kp.split(" ", 2)[2])

        for name, text in mutations.items():
            with self.subTest(name=name):
                path = self.tmp / (name.replace(" ", "_") + ".txt")
                path.write_text(text)
                result = self._run([
                    str(self.replay), "--lambda", "2", "--N", "4",
                    "--basis-size", "40", "--prec", "256", "--producer", str(path),
                ])
                self.assertNotEqual(result.returncode, 0)

    def test_normalization_regression_is_mandatory(self):
        for path in self.outputs[4, 256]:
            text = path.read_text()
            self.assertIn("CHECK unit_norm_changes_source_scalar_and_is_rejected=PASS", text)
            self.assertIn("forbidden_unit_normalized_a4", text)

    def test_four_way_n4_raw_odd_floor_minus_q(self):
        matrix_dir = ROOT / "artifacts/p0_ball_pilots/lambda2_N4"
        weil = [
            matrix_dir / "producer_256bits.txt",
            matrix_dir / "verifier_256bits.txt",
            matrix_dir / "producer_512bits.txt",
            matrix_dir / "verifier_512bits.txt",
        ]
        if not all(path.exists() for path in weil):
            self.skipTest("four-way N=4 Weil balls are unavailable")
        state = [self.outputs[4, 256][0], self.outputs[4, 256][1],
                 self.outputs[4, 512][0], self.outputs[4, 512][1]]
        command = [str(self.raw_gap), "--prec", "512"]
        for path in weil:
            command += ["--weil", str(path)]
        for path in state:
            command += ["--state", str(path)]
        result = self._run(command)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("CHECK four_way_intersections_and_symmetries=PASS", result.stdout)
        self.assertIn("CHECK odd_block_minus_3e_minus_7_positive_definite=PASS", result.stdout)
        self.assertIn("CHECK odd_floor_minus_raw_q_strictly_positive=PASS", result.stdout)
        self.assertIn("META terminal_state=P0_INVALIDATED", result.stdout)

        duplicate_command = [str(self.raw_gap), "--prec", "512"]
        for path in weil:
            duplicate_command += ["--weil", str(path)]
        for path in [state[0], state[0], state[2], state[3]]:
            duplicate_command += ["--state", str(path)]
        self.assertNotEqual(self._run(duplicate_command).returncode, 0)


if __name__ == "__main__":
    unittest.main()
