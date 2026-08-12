#!/usr/bin/env python3
"""Regressions for the growing low-prefix endpoint-null tail theorem."""

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


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md"
)
NOTE_HASH = "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc"

FROZEN = {
    "notes/GROWING_TRANSITION_ENDPOINT_NULL_COLLECTIVE_DILATION_FRAME_REDUCTION.md":
        "bbffec21c91b1e1150e36c9b2120b9255f1d0aa1bd4a1c7ec226e02db8d6abe6",
    "tests/test_growing_transition_endpoint_null_collective_dilation_frame_reduction.py":
        "eb25ab43e4f5fdeea96d89aa425ac2a9ab4f7cbdd0feaad3294e494387840f66",
    "notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md":
        "fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c",
    "tests/test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem.py":
        "b734c0e93d264cca9bfe31a141f06907724e526de08781295b6a7cd3bcc0b47c",
    "notes/PROLATE_TAIL_ENVELOPE.md":
        "309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d",
    "tests/test_prolate_tail_envelope.py":
        "bb5b5ec58f6357a8defcf36b19d3a1674091518903c5438f56c17ae6eef0581e",
    "notes/LEADING_PROLATE_OSCILLATION_THEOREM.md":
        "d65e9221642b09cb66b0f0c46d716f5d7fae98980f4c3ed3289033dacb9a266b",
    "tests/test_leading_prolate_oscillation.py":
        "00f5c5740c3f9002e2c9159b280a8764e955a356ac68ca365627de52b7c0eba5",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "tests/test_growing_transition_equality_conductor_garding_theorem.py":
        "61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba",
    "notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md":
        "ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86",
    "tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py":
        "bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class GrowingLowPrefixEndpointNullWeightedTailTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(f"`{relative}`", self.text)
            self.assertIn(f"`{expected}`", self.text)
        if NOTE_HASH.startswith("DRAFT_"):
            self.skipTest("draft note intentionally awaits final self-hash")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_central_packet_minmax_scale(self) -> None:
        for c_value, count in ((100.0, 3), (1000.0, 17), (5000.0, 51)):
            self.assertLessEqual(count, 2 * c_value / math.pi)
            radius_sq = math.pi * count / (2 * c_value)
            ell = 2 * math.sqrt(radius_sq) / count
            kinetic = math.pi**2 / ell**2
            potential = c_value**2 * radius_sq
            half = math.pi * c_value * count / 2
            self.assertAlmostEqual(kinetic / half, 1.0, places=13)
            self.assertAlmostEqual(potential / half, 1.0, places=13)
            self.assertAlmostEqual((kinetic + potential) / (2 * half), 1.0, places=13)

    def test_endpoint_riesz_row_has_q_cubed_scale(self) -> None:
        for q_value in (1, 2, 5, 17, 100):
            # Q+1 rows, each spectral difference at most O(c Q), and
            # e_n^2/d_n is O(lambda).
            normalized = (q_value + 1) * (4 * q_value + 1) ** 2 / q_value**3
            self.assertLessEqual(normalized, 50)

    def test_tail_and_sampler_exponents_cancel_y_exactly(self) -> None:
        for y_value in (-0.49, -0.2, 0.0, 0.31, 0.49):
            sampler_power = -1 - 2 * y_value
            tail_power = -3 + 2 * y_value
            self.assertAlmostEqual(sampler_power + tail_power, -4)

    def test_centered_weight_cancels_fractional_graph_scale(self) -> None:
        for y_value in (0.0, 0.11, 0.37, 0.49):
            epsilon = 0.5 - y_value
            self.assertAlmostEqual(2 * y_value + 2 * epsilon, 1)
            self.assertLessEqual(-2 * y_value + 2 * epsilon, 1)

    def test_translation_interpolation_exponents(self) -> None:
        for epsilon in (0.01, 0.1, 0.25, 0.5):
            theta = epsilon / 2
            m_power = -4 * (1 - theta) - 2 * theta
            c_power = 2 * theta
            h_power = 2 * theta
            self.assertAlmostEqual(m_power, -4 + epsilon)
            self.assertAlmostEqual(c_power, epsilon)
            self.assertAlmostEqual(h_power, epsilon)
            self.assertLessEqual(-1 + epsilon / 2, -0.75)

    def test_hard_graph_scale_and_profile_normalization(self) -> None:
        for lam in (2.5, 7.5, 31.5):
            c_value = 2 * math.pi * lam**2
            # S_Q/c followed by the U multiplier lambda.
            graph = lam * (lam * c_value**2) / c_value
            self.assertAlmostEqual(graph, c_value**2 / (2 * math.pi))

            u_value = math.sqrt(2 * lam)
            phi_value = math.sqrt(lam) / 2
            ratio = phi_value / u_value
            self.assertAlmostEqual(ratio, 1 / (2 * math.sqrt(2)))
            self.assertAlmostEqual(ratio**2, 1 / 8)

    def test_hard_edge_phase_proof_tokens(self) -> None:
        required = (
            "G_\\mu(0)=1",
            "\\operatorname {Var}\\log\\Omega_\\mu",
            "{u_\\mu\\over R}",
            "I(z):={1\\over c^2}+\\int_1^z",
            "{c\\sqrt R\\,I(z)^2\\over z^2}",
            "\\int_0^{\\log2}|\\partial_s\\partial_\\mu G_\\mu|^2",
            "\\delta_Q",
            "\\lambda^2\\delta_Q^2\\leq Q^2",
            "one-dimensional Sobolev--FTC inequality",
            "arithmetic sampler \\(m=1\\)",
            "no source singleton",
        )
        for token in required:
            self.assertIn(token, self.text)
        forbidden = (
            "insert these bounds once into the Bessel Green formula",
            "absorb them because",
            "|H_n(v)|\\leq|e_n|",
            "W\\subset\\{2,3,\\ldots\\}",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_operator_sampler_sum_and_exact_centering(self) -> None:
        required = (
            "W\\subset\\mathbb N",
            "including \\(W=\\{1\\}\\)",
            "\\Phi x={\\sqrt\\lambda\\over2}e^{s/2}H(\\lambda e^s)",
            "={1\\over2\\sqrt2}Ux",
            "exact centered block Gram is \\(1/8\\)",
            "{1\\over8}\\sum_{m\\in W}\\|A_{m,y}^{\\rm ctr}\\|^2",
            "{1\\over8}\\sum_{m\\in W}",
            "\\lambda^yM_yR_mUx",
            "\\lambda^{-y}M_{-y}R_mUx",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_metric_scope_and_claim_boundary(self) -> None:
        required = (
            "exact full-exterior-metric statement",
            "D_{\\rm full}=C^*\\operatorname {diag}(d_n)C",
            "D_{\\rm full}^\\#=T_\\eta^*D_{\\rm full}T_\\eta",
            "Dropping the pulled-back metric cross",
            "would\nnot be licensed",
            "not one of the modal columns",
            "The result is **not** proved",
            "old full transition inventory",
            "does not close the old full-transition version",
            "positive\noperator-valued dilation frame",
            "do not determine the sign",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_display_balance_unique_tags_and_tex_hygiene(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for bad in ("{cal ", "\\left{", "\\tag{\\tag"):
            self.assertNotIn(bad, self.text)
        self.assertIsNone(re.search(r"(?<!\\)qquad", self.text))

        inside_aligned = False
        for line_number, line in enumerate(self.text.splitlines(), 1):
            if "\\begin{aligned}" in line:
                self.assertFalse(inside_aligned, line_number)
                inside_aligned = True
                continue
            if "\\end{aligned}" in line:
                self.assertTrue(inside_aligned, line_number)
                inside_aligned = False
                continue
            if inside_aligned:
                stripped = line.rstrip()
                trailing = len(stripped) - len(stripped.rstrip("\\"))
                self.assertNotEqual(trailing, 1, line_number)
        self.assertFalse(inside_aligned)

    def test_displayed_tex_compiles_when_available(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_ascii_control_bytes_and_import_hygiene(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "hashlib", "math", "pathlib", "re",
                "shutil", "subprocess", "tempfile", "unittest",
            },
        )
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))


if __name__ == "__main__":
    unittest.main()
