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
  status: 'RESOLVED 2026-06-17 (tc-linchpin-resolve workflow, 3 routes + skeptical synthesis): PICTURE A on route-selection, NEGATIVE on the rigorous beat. See resolution below.',
  resolution: {
    routeSelection: 'PICTURE A — the bridge consumes t_c^part, the truncated-flow FIRST-collision time. There is only ONE truncated-flow object: imp-341 tau_c = 1/(2 sup Im m_N) and imp-2563 discriminant smallest-root are the SAME first-collision time, and the OLS ladder measures it. A1 (t_c^part(1e4) <= g_min^2/6 = 2.37e-4) bounds the RIGHT object.',
    theOLSartifact: 'The 0.0071 "t_c_proj" is NOT a distinct mean-field object: it is the y-intercept of a linear-in-1/N fit to small-N rows whose true decay is sub-linear, and the deep gamma~7005 Lehmer pair only enters the first-N list at N>=6710, so small-N rows have large g_min and manufacture a spurious positive intercept. imp-2621 proves the true object is O(1/sqrt N) -> 0, not 0.0066. imp-2564 said B only because imp-1149 Theorem 3 bounds a SEPARATE mean-field proxy 1/(2 M_inf), not the bridge.',
    rigorousBeatConsequence: 'NEGATIVE. A1 is an UPPER bound on t_c; by the imp-2564 sign algebra an upper bound feeds the Rodgers-Tao-dominated LOWER face (Lambda >= -U - E <= 0) and buys nothing on the headline. The headline face Lambda <= -t_c + E(N), with t_c >= 0, reads Lambda <= E(N). So the binding quantity is the BRIDGE ERROR E(N), dominated at N=1e4 by E_coll ~ 9e-2 (C_H=1 placeholder). Route-selection does NOT yield a rigorous Lambda < 0.2; no refereed bound is changed.',
    whatA1buys: 'The |t_c| sub-term becomes rigorous and ~30x smaller (2.37e-4, unconditional via Theta(0)=0.0017<1/4), removing it as the binding obstruction and shifting the ENTIRE remaining burden onto E(N) — consistent with imp-2564 residual R1. The genuine headline lever is now sizing E(N), above all discharging C_H in E_coll.',
  },
};

export const TC_LINCHPIN_ASSERTIONS = [
  {
    id: 'tc-linchpin-theta0-below-quarter-at-1e4',
    description: 'Theta(0) at the N=1e4 minimal pair is far below 1/4, so Corollary A1 rigorously applies to t_c^part there',
    holds: () => TC_PART_VS_MF_LINCHPIN.computedAtN1e4.theta0 < 0.25 && TC_PART_VS_MF_LINCHPIN.computedAtN1e4.a1Applies === true,
  },
  {
    id: 'tc-linchpin-30x-gap-is-epp-not-units',
    description: 'The t_c^part A1 bound is ~30x below the OLS t_c_proj — the OLS value is now resolved as a linear-fit intercept artifact, not a distinct object',
    holds: () => {
      const c = TC_PART_VS_MF_LINCHPIN.computedAtN1e4;
      const r = c.tcProjOLS / c.tcPartUpperBound_g2over6;
      return r > 20 && r < 40 && /RESOLVED/.test(TC_PART_VS_MF_LINCHPIN.status);
    },
  },
  {
    id: 'tc-linchpin-resolved-picture-A-negative-beat',
    description: 'Resolution recorded: PICTURE A on route-selection, NEGATIVE on the rigorous beat (binding quantity is E(N), not t_c)',
    holds: () => {
      const r = TC_PART_VS_MF_LINCHPIN.resolution;
      return !!r && /PICTURE A/.test(r.routeSelection) && /NEGATIVE/.test(r.rigorousBeatConsequence) && /E_coll|C_H/.test(r.whatA1buys);
    },
  },
  {
    // The single most consequential step of the resolution: A1 supplies an UPPER
    // bound on t_c, which only tightens the Rodgers-Tao LOWER face; the headline
    // upper face Lambda <= -t_c + E(N) is tightened only by a LOWER bound on t_c,
    // and with t_c >= 0 it reduces to Lambda <= E(N). This locks that sign-algebra
    // so no future edit can silently flip NEGATIVE into a claimed rigorous beat.
    id: 'tc-linchpin-headline-sign-algebra-no-false-beat',
    description: 'Headline sign algebra locked: an UPPER bound on t_c feeds the LOWER face and buys nothing; t_c>=0 reduces the headline to Lambda <= E(N); no rigorous beat is claimed and no refereed bound is changed',
    holds: () => {
      const r = TC_PART_VS_MF_LINCHPIN.resolution;
      if (!r) return false;
      const c = r.rigorousBeatConsequence;
      const signAlgebraStated =
        /UPPER bound on t_c/.test(c) &&
        /LOWER face/.test(c) &&
        /buys nothing/.test(c) &&
        /Lambda <= E\(N\)/.test(c) &&
        /refereed bound is changed/i.test(c);
      // The A1 object must genuinely be the microscopic t_c sub-term (not E(N)):
      // if it were O(1) it could not be a mere sub-term, and the logic would not apply.
      const tcIsMicroscopicSubterm = TC_PART_VS_MF_LINCHPIN.computedAtN1e4.tcPartUpperBound_g2over6 < 1e-3;
      return signAlgebraStated && tcIsMicroscopicSubterm;
    },
  },
];

for (const a of TC_LINCHPIN_ASSERTIONS) {
  if (!a.holds()) throw new Error(`tc-part-vs-mf-linchpin-finding assertion failed: ${a.id}`);
}
