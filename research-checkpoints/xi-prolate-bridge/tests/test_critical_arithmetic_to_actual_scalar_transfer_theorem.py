#!/usr/bin/env python3
"""Regressions for the critical arithmetic-to-actual scalar transfer."""

from __future__ import annotations

import ast
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "CRITICAL_ARITHMETIC_TO_ACTUAL_SCALAR_TRANSFER_THEOREM.md"
)
NOTE_HASH = "8c453f25d75ab351a15faa65a8b7ce5eaaf96ba3b83043b4cdb037f5daa379d8"

FROZEN = {
    "notes/ADAPTIVE_CRITICAL_EXACT_CARRIER_SHORT_ENDPOINT_COVARIANCE_THEOREM.md":
        "b56bbe941bb9922be5701f17bd404192501c07c8a58e05ec9f58e126df384a1f",
    "tests/test_adaptive_critical_exact_carrier_short_endpoint_covariance_theorem.py":
        "b8724a4e439d3db445a8d92215a6cbee05e6c0d3bba0ce081f707aaace6c0a18",
    "notes/CRITICAL_DENSITY_PROLATE_MELLIN_TRANSPORT_CONNECTION_THEOREM.md":
        "4d20e37cb8b6cfe3d92da7e1344da0f1b12ca9d20185fd7b6d8ac406ef7846c6",
    "tests/test_critical_density_prolate_mellin_transport_connection_theorem.py":
        "0a6128433698ecdc83252747971c61fb0859bf12a2afe582cd78808b8c5b8cf3",
    "notes/SUPERCRITICAL_FULL_SOURCE_ADAPTIVE_ABEL_TAIL_THEOREM.md":
        "ddd9fe4132e43bbbf859b89192380b3c299f2d9e3acec528bdefe39bb0f2eece",
    "tests/test_supercritical_full_source_adaptive_abel_tail_theorem.py":
        "a3d6169ab083b6fa5ebdce9273c43639680ee2d9db2034d3de842703fb814371",
    "notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md":
        "aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6",
    "tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py":
        "6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6",
    "notes/ADAPTIVE_PROLATE_STOKES_ENDPOINT_ROW_TRANSFER_THEOREM.md":
        "0ae198d3a304960744a04c0ec095ffa6afcd4aa61599de551780efb43f89d878",
    "tests/test_adaptive_prolate_stokes_endpoint_row_transfer_theorem.py":
        "e54bb937552247550c4ed57c1e20b86883556460416b5f046618076b2fbf4b76",
    "notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md":
        "2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87",
    "tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py":
        "d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def critical_phi(density: mp.mpf) -> mp.mpf:
    return (
        mp.sqrt(1 - density**2 / 4)
        - 1
        + density / 2 * mp.asin(density / 2)
    )


def kappa(density: mp.mpf) -> mp.mpf:
    return mp.pi * density / 4 - critical_phi(density)


class CriticalArithmeticToActualScalarTransferTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 100
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_direct_closure_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 12)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_retuned_laurent_overlap_has_strict_exponential_margin(self) -> None:
        outer = mp.mpf(21) / 20
        split = mp.mpf(9) / 10
        largest_carrier = kappa(mp.mpf("0.5"))
        bridge = kappa(split) + mp.pi * (outer - split) - kappa(outer)
        self.assertLess(
            abs(largest_carrier - mp.mpf("0.361283181361350270141599713716")),
            mp.mpf("1e-30"),
        )
        self.assertLess(
            abs(bridge - mp.mpf("0.391633876886252053559260432387")),
            mp.mpf("1e-30"),
        )
        self.assertGreater(bridge, largest_carrier)
        self.assertGreater(kappa(split), bridge)
        self.assertLess(outer, 2)
        self.assertIn(r"H={21\over20}", self.text)
        self.assertIn(r"q_0={9\over10}", self.text)

    def test_full_source_abel_exponent_beats_every_critical_carrier(self) -> None:
        abel = mp.mpf(2) / 5
        radial = 9 * mp.pi / 20 - 1
        largest_carrier = kappa(mp.mpf("0.5"))
        self.assertGreater(radial, abel)
        self.assertGreater(abel, largest_carrier)
        for density_text in ("0.16", "0.3", "0.49"):
            self.assertLess(kappa(mp.mpf(density_text)), abel)
        self.assertIn("adaptive `lambda=e^(L/2)`", self.text)
        self.assertIn("without a half-integer or Diophantine hypothesis", self.text)

    def test_phase_q_and_cutoff_index_are_exact(self) -> None:
        length = 200.0
        spacing = 2 * math.pi / length
        carrier = 100_003
        coordinate = 0.5 + 1 / length
        gamma = (carrier - coordinate) * spacing
        phase = math.sin(gamma * length / 2)
        expected = (-1) ** (carrier + 1) * math.sin(math.pi * coordinate)
        q_value = -2 * (-1) ** carrier / math.sqrt(length)
        self.assertAlmostEqual(phase, expected, places=10)
        self.assertAlmostEqual(
            q_value * phase / 2,
            math.sin(math.pi * coordinate) / math.sqrt(length),
            places=10,
        )
        cutoff = carrier - 1
        self.assertEqual(cutoff + 1, carrier)
        normalized = " ".join(self.text.split())
        self.assertIn("n=m=N+1", normalized)
        self.assertIn("N=m-1", normalized)

    def test_tangent_endpoint_and_row_map_to_physical_normalization(self) -> None:
        gamma = 100.0
        base = 101.0
        spacing = 0.05
        envelope = [1.0, 0.8, 0.64, 0.512]
        hardy = [2.0, -1.5, 0.25, 3.0]
        endpoint_sum = sum(
            (-1) ** index * envelope[index] * hardy[index]
            for index in range(len(hardy))
        )
        kernel_sum = sum(
            (-1) ** index
            * envelope[index]
            * hardy[index]
            * gamma**2
            / (gamma**2 - (base + index * spacing) ** 2)
            for index in range(len(hardy))
        )
        endpoint = endpoint_sum / envelope[0]
        row = -2 * kernel_sum / (gamma * envelope[0])
        physical_endpoint = sum(
            (-1) ** index * (-envelope[index] * hardy[index])
            for index in range(len(hardy))
        )
        physical_row = sum(
            (-1) ** index
            * (-envelope[index] * hardy[index])
            * gamma**2
            / (gamma**2 - (base + index * spacing) ** 2)
            for index in range(len(hardy))
        )
        self.assertAlmostEqual(physical_endpoint, -envelope[0] * endpoint)
        self.assertAlmostEqual(
            physical_row,
            gamma * envelope[0] * row / 2,
        )

    def test_scalar_absolute_floor_makes_endpoint_cancellation_harmless(self) -> None:
        ratios = []
        for length in (100.0, 1_000.0, 10_000.0):
            log_length = math.log(length)
            row = length * log_length
            endpoint = row / (2 * log_length)
            q_envelope = 0.37
            phase = 0.999
            error = q_envelope / length
            actual_endpoint = -q_envelope * endpoint + error
            actual_row = q_envelope * phase * row / 2 - error
            ratio = actual_row**2 / actual_endpoint**2
            ratios.append(ratio / log_length**2)
        self.assertGreater(min(ratios), 0.95)
        self.assertLess(max(ratios), 1.05)
        normalized = " ".join(self.text.split())
        self.assertIn("absolute row floor", normalized)
        self.assertIn("divides by the possibly cancelling endpoint", normalized)

    def test_local_error_and_tangent_tail_are_power_saving(self) -> None:
        values = []
        decay = math.pi / 4 - 0.5 * math.asin(0.25)
        for log_c in (40.0, 80.0, 160.0, 320.0):
            c_value = math.exp(log_c)
            length = log_c
            local = c_value ** (-0.25) * length**8
            tail = c_value**0.25 * length**4 * c_value ** (-20 * decay)
            values.append(local + tail)
        self.assertEqual(values, sorted(values, reverse=True))
        self.assertLess(values[-1], 1e-14)
        self.assertIn("c^{-1/4}L^{C_1}=o(1)", self.text)

    def test_no_second_h_scale_or_two_cutoff_transfer_is_used(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "already contains the `1/h` Cauchy scale",
            "No additional factor `h^(-2)`",
            "one-cutoff scalar transfer",
            "two-adjacent-cutoff Hilbert transfer is not invoked",
            "no arithmetic ratio has been selected at `m+1`",
            "do not append that component",
            "operator-relative or mean-square Stokes lemma is unnecessary",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        self.assertNotIn("Its Hilbert loss therefore tends to one", normalized)

    def test_claim_boundary_and_state_are_explicit(self) -> None:
        normalized = " ".join(self.text.split())
        required = (
            "Assume RH",
            "adaptive schedule",
            "literal ceiling",
            "half-integer grid",
            "finite simple-ground",
            "boundary normalization",
            "shifted-sector signs",
            "response reserve",
            "strict denominator branch",
            "not a completed checkpoint",
            "not a completed checkpoint or an RH proof",
            "P0_INVALIDATED",
            "changes none of the standard eight files",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        self.assertIn("O_{\\mathcal D}((\\log L)^{-2})", self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 54)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            completed = subprocess.run(
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(completed.returncode, 0, completed.stdout)

    def test_ascii_python_and_static_invariants(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertNotIn("TODO", self.text)
        self.assertNotIn("FIXME", self.text)
        self.assertGreaterEqual(self.text.count(r"\boxed{"), 4)


if __name__ == "__main__":
    unittest.main()
