#!/usr/bin/env python3
"""Regressions for the coherent mixed-bridge beta-row floor theorem."""

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
NOTE = ROOT / "notes" / (
    "GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md"
)
NOTE_HASH = "43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2"

FROZEN = {
    "notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md":
        "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb",
    "tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py":
        "0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc",
    "notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md":
        "4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2",
    "tests/test_mixed_bridge_xi_over_s_boundary_obstruction_theorem.py":
        "1bc81194a9fa2fd4eac92491a08c60bc58f3640ac16e4e5e17864da8a2970c67",
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "tests/test_growing_low_prefix_outer_floor_assembly_theorem.py":
        "634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311",
    "notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md":
        "a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459",
    "tests/test_growing_odd_low_prefix_outer_floor_transfer_theorem.py":
        "c8a86e338762f00c32c04e9e300fc3398d4cbb084f16a1a530b77a16a1144bad",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
        "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
    "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
        "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
    "notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md":
        "1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce",
    "tests/test_growing_low_prefix_complete_profile_fio_reduction.py":
        "ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d",
    "notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md":
        "b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44",
    "tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py":
        "16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_REFLECTED_STIELTJES_THEOREM.md":
        "621594962543f7700503cc545cca57b97a4969ef15b0129b0c026758398e8502",
    "tests/test_growing_low_prefix_endpoint_compressed_reflected_stieltjes_theorem.py":
        "f56565c253c2278fd3cbd0023317d5646059169e657b2225611a32a9867fa1fa",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/GROWING_TRANSITION_DISCREPANCY_ZERO_ORBIT_BERNOULLI_TAIL_BARRIER.md":
        "29270fcd5a38282ca06d0726afa1fc0334ae0fd2cdb64b9cf3ee6ef9b3ba5d48",
    "tests/test_growing_transition_discrepancy_zero_orbit_bernoulli_tail_barrier.py":
        "fa0c69ba37a5cd7064fcbcefc7df3489861d02ecc7fbc3b10996829e3a064b28",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class GrowingMixedBridgeCoherentBetaRowFloorTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_beta_slot_factor_and_coherent_sign(self) -> None:
        for rho in (0.31 + 14.2j, 0.5 + 21.7j, 0.77 - 33.4j):
            for lam, amplitude in ((3.0, 1.2), (11.0, -2.7)):
                beta = lam ** (-rho) / (2 * rho)
                beta_vee = lam ** (-(1 - rho)) / (2 * (1 - rho))
                plus = -amplitude * (beta + beta_vee) / 2
                minus = amplitude * (beta - beta_vee) / 2
                coherent = plus**2 - minus**2
                expected = amplitude**2 / (
                    4 * lam * rho * (1 - rho)
                )
                self.assertAlmostEqual(abs(coherent - expected), 0.0, places=13)

                wrong_odd_sign = plus**2 + minus**2
                self.assertGreater(abs(wrong_odd_sign - expected), 1e-10)

    def test_relative_log_lambda_powers_cancel_exactly(self) -> None:
        for rho in (0.2 + 9.0j, 0.5 + 17.0j, 0.8 - 25.0j):
            w_value = (rho - 0.5) / 1j
            for lam in (2.0, 7.0, 19.0):
                product = lam ** (-(1 - rho)) * lam ** (-1j * w_value)
                self.assertAlmostEqual(
                    abs(product - lam ** -0.5),
                    0.0,
                    places=13,
                )

        self.assertIn("{C_\\xi g(0)\\over4\\lambda}", self.text)
        self.assertIn("complete compact", self.text)
        self.assertIn("is absolutely convergent", self.text)

    def test_cxi_constant_and_bridge_limit_are_positive(self) -> None:
        euler_gamma = 0.577215664901532860606512090082402431
        c_xi = 2 + euler_gamma - math.log(4 * math.pi)
        self.assertGreater(c_xi, 0.0)
        self.assertAlmostEqual(c_xi, 0.04619141793224202, places=14)
        bridge_limit = c_xi / math.sqrt(2)
        safe_limit = c_xi / (2 * math.sqrt(2))
        self.assertAlmostEqual(bridge_limit, 0.032662264852510225, places=14)
        self.assertAlmostEqual(safe_limit, 0.016331132426255113, places=14)

    def test_kernel_endpoint_sign_and_prime_arch_terms(self) -> None:
        values = []
        for t_value in (1e-2, 1e-3, 1e-4, 1e-5):
            # Here exp(t)<2, so psi_0(exp(t))=0.
            kernel = math.exp(-t_value / 2) * (
                math.exp(t_value)
                - math.log(2 * math.pi)
                - 0.5 * math.log(1 - math.exp(-2 * t_value))
            )
            regular = kernel + 0.5 * math.log(t_value)
            values.append(regular)
            self.assertGreater(kernel, 0.0)
        self.assertLess(max(values) - min(values), 0.03)

        for token in (
            "e^t-\\psi_0(e^t)-\\log(2\\pi)",
            "-{1\\over2}\\log t+O(1)",
            "The \\(e^{t/2}\\) term in (3.4) is the \\(s=1\\) residue",
            "\\int_0^\\infty e^{-t/2}K(t)\\,dt=C_\\xi",
            "no hidden boundary delta",
            "full multiplicity",
        ):
            self.assertIn(token, self.text)

    def test_finite_prime_step_equals_ordered_tail_sum(self) -> None:
        prime_powers = (
            (2, math.log(2)),
            (3, math.log(3)),
            (4, math.log(2)),
            (5, math.log(5)),
            (7, math.log(7)),
            (8, math.log(2)),
            (9, math.log(3)),
        )
        decay = 1.3 + 0.5
        ordered = sum(
            weight * n ** (-decay) / decay
            for n, weight in prime_powers
        )

        step_integral = 0.0
        cumulative = 0.0
        locations = [math.log(n) for n, _ in prime_powers]
        for index, ((_, weight), left) in enumerate(zip(prime_powers, locations)):
            cumulative += weight
            right = locations[index + 1] if index + 1 < len(locations) else math.inf
            upper = 0.0 if math.isinf(right) else math.exp(-decay * right)
            step_integral += cumulative * (
                math.exp(-decay * left) - upper
            ) / decay
        self.assertAlmostEqual(step_integral, ordered, places=14)

    def test_exact_profile_normalization_and_sampler_balance(self) -> None:
        self.assertAlmostEqual(1 / (2 * math.sqrt(2)), math.sqrt(2) / 4, places=15)
        for q_value, r_value in ((10.0, 0.2), (50.0, 1.1), (200.0, 2.3)):
            balance = q_value * math.exp(-r_value)
            first = balance ** -0.5
            second = (
                q_value ** 1.5
                * math.exp(-1.5 * r_value)
                * balance ** -2
            )
            self.assertAlmostEqual(first, second, places=14)

        for token in (
            "\\Phi={U\\over2\\sqrt2}",
            "m\\asymp Qe^{-r}",
            "Q^{1/2}e^{-r/2}",
            "Q^{3/2}e^{-3r/2}",
        ):
            self.assertIn(token, self.text)

    def test_uniform_little_o_length_treats_bounded_q_separately(self) -> None:
        alpha = 0.8476836
        previous = float("inf")
        for length in (math.exp(36), math.exp(64), math.exp(100), math.exp(144)):
            q_value = length
            log_q = math.log(q_value)
            exponent = math.sqrt(log_q - math.log(math.log(q_value + 2)))
            ratio = (
                q_value
                * (1 + math.log(q_value + 2)) ** 4
                * math.exp(-2 * alpha * exponent)
                / length
            )
            self.assertLess(ratio, previous)
            previous = ratio

        bounded_q_constant = 37.0
        self.assertLess(bounded_q_constant / math.exp(36), 1e-9)
        self.assertIn("For \\(1\\leq Q\\leq Q_*\\)", self.text)
        self.assertIn("C_{Q_*}", self.text)
        self.assertNotIn("o(Q)", self.text)

    def test_safe_bridge_modal_scale_is_geometric_mean(self) -> None:
        for lam in (3.0, 5.0, 8.0):
            log_d_two = 5 * math.log(lam) - 4 * math.pi * lam**2
            log_cross = log_d_two / 2
            self.assertGreater(log_cross, log_d_two)
            # Even after a fixed polynomial, sqrt(d_2)=o(1/lambda).
            log_polynomial_cross = 20 * math.log(lam) + log_cross
            self.assertLess(log_polynomial_cross, -math.log(lam))

        self.assertIn("D_b+\\sqrt {D_b}", self.text)
        self.assertIn("absolute beta two-slot norm", self.text)
        self.assertIn("\\sqrt{D_b/\\lambda}", self.text)
        self.assertNotIn("all bridge errors are \\(O(D_b)\\)", self.text)

    def test_exact_lower_ritz_shift_and_two_schur_scales(self) -> None:
        for length, b_value, e_squared in (
            (80.0, 0.032, 0.2),
            (800.0, 0.0325, 0.7),
            (8000.0, 0.0326, 1.5),
        ):
            a_value = length / 8
            mu_value = (
                a_value
                + b_value
                - math.sqrt((a_value - b_value) ** 2 + 4 * e_squared)
            ) / 2
            lower = b_value - e_squared / (a_value - b_value)
            self.assertGreaterEqual(mu_value + 1e-14, lower)
            self.assertLess(b_value - mu_value, e_squared / (a_value - b_value))
            self.assertLess(e_squared / a_value, e_squared / b_value)

        for token in (
            "genuine lower-Ritz erosion",
            "{e_\\lambda^2\\over b_\\lambda}=o(L)",
            "{e_\\lambda^2\\over a_\\lambda}=o(1)",
            "rank-one even--odd captured cross",
        ):
            self.assertIn(token, self.text)

    def test_corrected_metric_upper_comparison(self) -> None:
        k_psi = 0.7
        c_origin = 2.0
        amplitude_bound = 3.0
        for lam, length, d_bridge in (
            (20.0, 6.0, 1e-10),
            (100.0, 9.0, 1e-30),
        ):
            d_captured = 1.4
            z_squared = 0.8
            origin_squared = c_origin * length * d_captured / lam
            direct_bound = (
                3 * d_captured
                + 3 * d_bridge * z_squared
                + 6 * k_psi * origin_squared / lam
                + 6 * k_psi * amplitude_bound**2 * z_squared / lam
            )
            coefficient_c = 3 + 6 * k_psi * c_origin * length / lam**2
            coefficient_z = 3 * lam * d_bridge + 6 * k_psi * amplitude_bound**2
            displayed_bound = (
                coefficient_c * d_captured
                + coefficient_z * z_squared / lam
            )
            self.assertAlmostEqual(direct_bound, displayed_bound, places=14)

        self.assertIn("Only this upper comparison is asserted", self.text)
        self.assertIn("no unproved two-sided metric", self.text)

    def test_cutoff_order_cap_and_scope_tokens(self) -> None:
        required = (
            "finite endpoint-compressed profile class",
            "never exchanges the infinite zero sum",
            "compactly supported",
            "compact-BV test",
            "symmetric Abel explicit formula",
            "Only then let the Abel",
            "No separately divergent pole row is formed",
            "there is no sum-integral Fubini step",
            "R\\to\\infty\\ \\longrightarrow\\ H\\to\\infty",
            "every direct captured even--odd Weil cross is zero",
            "adjoining \\(b\\)",
            "corrected representative of the leading beta term",
            "not a retained \\(L/8\\) floor",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "for every L2 profile",
            "general L2 Plemelj theorem",
            "the bridge bump is negligible",
            "drop the bridge bump",
            "drop the beta row",
            "This proves the Riemann hypothesis",
            "standard eight are changed",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

    def test_import_hygiene(self) -> None:
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
                "__future__", "ast", "hashlib", "math",
                "pathlib", "re", "shutil", "subprocess", "tempfile",
                "unittest",
            },
        )

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
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
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
