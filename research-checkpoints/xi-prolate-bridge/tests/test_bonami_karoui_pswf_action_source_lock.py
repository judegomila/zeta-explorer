from __future__ import annotations

from fractions import Fraction
import hashlib
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "BONAMI_KAROUI_PSWF_ACTION_SOURCE_LOCK.json"
PDF_PATH = ROOT / "vendor/BK-PSWF-1405.3676v2.pdf"
PDF_SHA256 = "9fe8dc39e4440200a29ff94bb640b693c06a176d28b7e38a468dce98afa7d7b8"


def _load_no_duplicate_keys(path: Path) -> dict:
    def hook(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError(f"duplicate key: {key}")
            result[key] = value
        return result

    return json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=hook)


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class BonamiKarouiPswfActionSourceLockTest(unittest.TestCase):
    def test_lock_is_strict_json_with_exact_scope(self) -> None:
        payload = _load_no_duplicate_keys(LOCK_PATH)
        self.assertEqual(
            payload["schema"],
            "xi-prolate-bonami-karoui-pswf-action-source-lock-v1",
        )
        self.assertEqual(payload["claim_class"], "BONAMI_KAROUI_PSWF_ACTION_BRACKET")
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(payload["retrieved_date"], "2026-08-11")
        self.assertEqual(len(payload["external_sources"]), 1)
        self.assertFalse(payload["source_admissions"]["riemann_hypothesis_assumed_or_claimed"])

    def test_official_v2_pdf_bytes_are_exactly_vendored(self) -> None:
        payload = _load_no_duplicate_keys(LOCK_PATH)
        source = payload["external_sources"][0]
        self.assertEqual(source["version"], "arXiv:1405.3676v2")
        self.assertEqual(source["version_date"], "2014-10-30")
        self.assertEqual(source["official_url"], "https://arxiv.org/abs/1405.3676v2")
        self.assertEqual(source["official_pdf_url"], "https://arxiv.org/pdf/1405.3676v2")
        self.assertEqual(source["vendored_path"], "vendor/BK-PSWF-1405.3676v2.pdf")
        self.assertEqual(source["sha256"], PDF_SHA256)
        self.assertEqual(_sha256(PDF_PATH), PDF_SHA256)
        self.assertEqual(PDF_PATH.read_bytes()[:5], b"%PDF-")
        self.assertEqual(source["pdf_pages"], 25)

    def test_primary_metadata_and_theorem_locator_are_locked(self) -> None:
        payload = _load_no_duplicate_keys(LOCK_PATH)
        source = payload["external_sources"][0]
        self.assertEqual(source["authors"], ["Aline Bonami", "Abderrazek Karoui"])
        self.assertEqual(
            source["title"],
            "Uniform approximation and explicit estimates for the prolate spheroidal wave functions",
        )
        self.assertEqual(
            source["locator"],
            "Theorem 1, equation (12), PDF page 5 (printed page 5)",
        )

    def test_source_and_repository_conventions_are_not_conflated(self) -> None:
        payload = _load_no_duplicate_keys(LOCK_PATH)
        conventions = payload["locked_conventions"]
        self.assertEqual(conventions["repository_eigenvalue_identification"], "mu_n=chi_n(c)")
        self.assertEqual(
            conventions["repository_action"],
            "A(mu)=sqrt(mu)*E(c/sqrt(mu))",
        )
        self.assertIn("k mapsto k/E(k)", conventions["source_inverse_function"])
        self.assertIn("min(1,1/k)", conventions["source_elliptic_action"])

    def test_theorem_one_action_equivalence_is_exact(self) -> None:
        payload = _load_no_duplicate_keys(LOCK_PATH)
        result = payload["locked_result"]
        self.assertEqual(result["hypotheses"], "c>0 and integer n>=2")
        self.assertEqual(
            result["source_theorem"],
            "Phi(2c/(pi(n+1))) < c/sqrt(chi_n(c)) < Phi(2c/(pi*n))",
        )
        self.assertEqual(
            result["equivalent_action_bracket"],
            "pi*n/2 < sqrt(chi_n(c))*E(c/sqrt(chi_n(c))) < pi*(n+1)/2",
        )

        # Replace pi by any positive rational p.  If
        # 2c/(p(n+1)) < t=k/E(k) < 2c/(pn), then A=c/t has
        # pn/2 < A < p(n+1)/2.  This is the exact positive-inversion step.
        p = Fraction(22, 7)
        for n in range(2, 20):
            c = Fraction(5 * n + 3, 11)
            lower_t = 2 * c / (p * (n + 1))
            upper_t = 2 * c / (p * n)
            t = (lower_t + upper_t) / 2
            action = c / t
            self.assertLess(lower_t, t)
            self.assertLess(t, upper_t)
            self.assertLess(p * n / 2, action)
            self.assertLess(action, p * (n + 1) / 2)

    def test_plus_phase_gap_follows_strictly(self) -> None:
        # A_(n+4)>pi(n+4)/2 and A_n<pi(n+1)/2.
        # Subtraction leaves 3*pi/2 strictly.
        for n in range(2, 20):
            lower_next = Fraction(n + 4, 2)
            upper_current = Fraction(n + 1, 2)
            self.assertEqual(lower_next - upper_current, Fraction(3, 2))

    def test_claim_boundary_remains_fail_closed(self) -> None:
        payload = _load_no_duplicate_keys(LOCK_PATH)
        boundary = payload["claim_boundary"]
        self.assertEqual(len(boundary["proved_by_source"]), 2)
        joined = " ".join(boundary["not_claimed"])
        for phrase in ("edge-rank", "sampler", "equation (5.2)", "RH conclusion"):
            self.assertIn(phrase, joined)

    def test_no_control_bytes(self) -> None:
        for path in (LOCK_PATH, Path(__file__)):
            bad = [value for value in path.read_bytes() if value < 32 and value not in (9, 10)]
            self.assertEqual(bad, [], str(path))


if __name__ == "__main__":
    unittest.main()
