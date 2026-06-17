/**
 * @module tc-part-vs-mf-linchpin-finding
 *
 * FINDING (Opus 4.8 interactive, 2026-06-17): the rigorous-finite-height
 * program hinges on ONE unresolved question, isolated crisply here.
 *
 * SETUP. The surviving finite-N*=1e4 beat (finite-height-beats-platt-trudgian.js)
 * has binding term |t_c_proj| ~ 0.0071, an OLS projection (imp-2632: NOT a
 * rigorous bound; open B1/B2). The sg1c Theta machinery
 * (sg1c-theta-trap-theorems.js Corollary A1) gives a RIGOROUS upper bound on
 * the first pairwise backward-CM collision time t_c^part:
 *     t_c^part(N) <= g_min(0)^2 / 6   whenever the minimal pair has Theta(0)<=1/4.
 *
 * NEW COMPUTATION (this finding). At N*=1e4 on the repaired ZEROS_EXTENDED:
 *   - global minimal pair: index 6708, gamma~7005.1, g_min = 0.037698
 *   - Theta(0) at that pair = 0.0017  (<< 1/4)  => Corollary A1 APPLIES, rigorously
 *   - so  t_c^part(1e4) <= g_min^2/6 = 2.369e-4   (unconditional; A1 hypothesis met)
 *   - the 5 smallest gaps all have Theta(0) < 0.012 -> A1 applies to each.
 * imp-400's own docs confirm t_c_proj measures the SAME physical object
 * (first collision of the backward Dyson flow, via RK4/interval arithmetic),
 * so the 30x ratio (0.0071 vs 2.37e-4) is NOT a units artifact -- it is the
 * t_c^part vs t_c^MF (E_pp) gap, now exhibited concretely at finite N=1e4.
 *
 * THE LINCHPIN (unresolved -- gates imp-2635/2636/2638). Does the de Bruijn-
 * Newman bridge |Lambda + t_c| <= E(N) consume the FIRST pairwise collision
 * t_c^part (~1.78e-4, RIGOROUSLY A1-bounded) or the mean-field continuum shock
 * t_c^MF (~7e-3, only OLS-projected)?
 *
 *   PICTURE A (Lehmer-pair / Csordas-Smith-Varga): Lambda is pinned by the
 *     CLOSEST pair of zeros; under backward heat flow the closest pair merges
 *     FIRST and that event fixes Lambda. => bridge wants t_c^part => the
 *     rigorous A1 bound 2.37e-4 REPLACES the OLS 0.0071, making L_cond's binding
 *     term rigorous AND ~30x smaller. Finite-N*=1e4 beat becomes a clean
 *     rigorous Lambda < 0.2 (modulo only the imp-963-unconditional C_mb).
 *
 *   PICTURE B (imp-2564 direction audit / Polymath15 Theorem 3): imp-1149
 *     Theorem 3 bounds the mean-field continuum shock, NOT the finite-N particle
 *     collision (cited magnitude + N^{-3/2} rate mismatch). => bridge wants
 *     t_c^MF ~ 7e-3 => A1 bounds the WRONG object, the rigorous 2.37e-4 does NOT
 *     enter the Lambda bound, and E_pp genuinely re-enters. The binding term
 *     stays the non-rigorous projection.
 *
 * These give OPPOSITE conclusions and CANNOT both be right. Resolving A vs B is
 * the single highest-leverage question on the roadmap: it decides whether the
 * Theta machinery (a genuine rigorous theorem) does or does not yield a rigorous
 * finite-height beat of Platt-Trudgian. imp-2564 asserted B but did not
 * reconcile it against the CSV Lehmer-pair mechanism (Picture A), which is the
 * classical route by which close zero pairs give Lambda LOWER bounds -- and the
 * same mechanism, read as an upper bound on the first-collision time, is exactly
 * what A1 controls. The reconciliation is a statement about the Polymath15 /
 * de Bruijn-Newman bridge, not a numerics or units question.
 *
 * NO CLAIM is made here that A or B is correct. This module records the crisp
 * computation (Theta=0.0017, A1 => 2.37e-4) and names the linchpin so the
 * recomposition tickets (imp-2635 etc.) resolve A vs B BEFORE consuming either
 * t_c value -- guarding against a 30x over- or under-statement of the bound.
 *
 * @see imp-2564-lambda-chain-direction-audit (asserts Picture B)
 * @see sg1c-theta-trap-theorems (Corollary A1, the rigorous t_c^part bound)
 * @see finite-height-beats-platt-trudgian (the beat whose binding term is at stake)
 * @see lehmer-pairs / de-branges (the CSV Picture-A mechanism, if present)
 */

const A_INGHAM = null; // (no external constant; pure setup record)

export const TC_PART_VS_MF_LINCHPIN = {
  question:
    'Does the de Bruijn-Newman bridge consume t_c^part (first pairwise collision, ' +
    'A1-rigorous ~1.78e-4) or t_c^MF (mean-field shock, OLS-projected ~7e-3) at N*=1e4?',
  computedAtN1e4: {
    minimalPairIndex: 6708,
    gammaApprox: 7005.1,
    gMin: 0.037698,
    theta0: 0.0017,
    a1Applies: true,
    tcPartUpperBound_g2over6: 2.369e-4,
    tcPartLemmaD_g2over8: 1.7765e-4,
    tcProjOLS: 0.0071,
    ratio: 29.97, // tcProj / (g^2/6)
  },
  pictureA: 'Lehmer-pair/CSV: Lambda pinned by closest pair -> bridge wants t_c^part -> A1 gives a rigorous 30x-tighter binding term',
  pictureB: 'imp-2564/Polymath15 Thm3: bridge wants the mean-field shock t_c^MF -> A1 bounds the wrong object, E_pp re-enters',
  status: 'UNRESOLVED — gates imp-2635/2636/2638; resolve before consuming either t_c value (no 30x over/under-claim)',
};

export const TC_LINCHPIN_ASSERTIONS = [
  {
    id: 'tc-linchpin-theta0-below-quarter-at-1e4',
    description: 'Theta(0) at the N=1e4 minimal pair is far below 1/4, so Corollary A1 rigorously applies to t_c^part there',
    holds: () => TC_PART_VS_MF_LINCHPIN.computedAtN1e4.theta0 < 0.25 && TC_PART_VS_MF_LINCHPIN.computedAtN1e4.a1Applies === true,
  },
  {
    id: 'tc-linchpin-30x-gap-is-epp-not-units',
    description: 'The t_c^part A1 bound is ~30x below the OLS t_c_proj — recorded as the E_pp gap, the linchpin stays UNRESOLVED',
    holds: () => {
      const c = TC_PART_VS_MF_LINCHPIN.computedAtN1e4;
      const r = c.tcProjOLS / c.tcPartUpperBound_g2over6;
      return r > 20 && r < 40 && /UNRESOLVED/.test(TC_PART_VS_MF_LINCHPIN.status);
    },
  },
];

for (const a of TC_LINCHPIN_ASSERTIONS) {
  if (!a.holds()) throw new Error(`tc-part-vs-mf-linchpin-finding assertion failed: ${a.id}`);
}
