/**
 * @module imp-3732-fmb-empirical-crossval
 * @fileoverview imp-3732 (numerical, cross-validation only): FALSIFICATION TEST
 * of the imp-3725 certified two-sided true-flow enclosure of t_c(N) against the
 * INDEPENDENT empirical backward-Dyson RK4 measurements it supersedes.
 *
 * imp-3725 replaced the imp-962 plateau-scan heuristic (F_mb non-regression +
 * maxSmoothScaleRatio = 2.15 slack, carryforward K = 0.2014) with a certified
 * enclosure  0 <= F_mb(N) <= (H^2/8)(1/theta_N2 - 1), K_paper <= 2.424e-6. That
 * lemma was never tabulated against the actual measured F_mb values. Here we
 * MEASURE the empirical F_mb(N) = t_c_measured(N) - H_raw(N)^2/8 at every N on
 * [1e4, 1e6] for which a repo-resident backward-Dyson measurement exists, and
 * CONFIRM each lands inside the certified band [0, FmbUpper(plateau)].
 *
 * WHAT COUNTS AS AN INDEPENDENT MEASUREMENT (no new integration run here)
 * ----------------------------------------------------------------------
 *  (A) imp-2509 fine pass  -- ONE RESOLVED POINT at N = 1e4:
 *      c-mb-dyson-large-n-cache.js records the verbatim RK4 + Kahan-Neumaier
 *      backward-Dyson collision time t_c(1e4) = 1.778248472e-4 at the record
 *      pair index 6708 (dt = 1.776e-7). This is the only rung on [1e4, 1e6]
 *      with a resolved point value of t_c (not a coarse map bracket).
 *  (B) imp-360 extended-ladder -- THREE COARSE CLOSED BRACKETS at N =
 *      25000 / 50000 / 100000 (one-ULP interval-RK4, dt = 1e-4): the closed
 *      brackets bound t_c to width ~1e-4, giving empirical F_mb only to a wide
 *      band, but a genuinely-independent bracket the analytic enclosure must
 *      sit inside.
 *
 * THE FALSIFICATION TEST AND ITS RESULT
 * -------------------------------------
 *  - RESOLVED POINT (N = 1e4): empirical F_mb = 1.777442e-7 sits strictly
 *    INSIDE the certified band [0, 3.155e-7] at 56.3% of the way up the band;
 *    the certified upper bound is 1.775x the measured value. No approach to a
 *    band edge, no violation. The lower lemma (F_mb >= 0) is respected: the
 *    measurement is positive.
 *  - COARSE BRACKETS (N = 25k / 50k / 100k): each imp-360 closed t_c bracket
 *    CONTAINS the imp-3725 analytic enclosure [tcLo, tcHi] (already the imp-3725
 *    cross-check (3)); hence the empirical F_mb band [max(0, br_lo - H^2/8),
 *    br_hi - H^2/8] contains the certified FmbUpper. The map brackets are ~1e2x
 *    too coarse to tighten the certificate, but they do NOT falsify it: no
 *    bracket excludes the certified band.
 *
 * OBSERVED SLACK vs the certified 8.3e4x margin: the 8.3e4x headline is the
 * ratio of the RETIRED conditional carryforward K = 0.2014 to the certified
 * sup K_paper <= 2.424e-6 -- a comparison against the OLD heuristic bound, NOT
 * against the true flow. The slack of the certified UPPER bound over the
 * genuine measured value is far tighter: 1.775x at the one resolved rung. Both
 * numbers are honest and answer different questions -- the enclosure is loose
 * relative to the retired heuristic (hence the huge K margin) yet tight
 * relative to the true flow (hence the ~1.8x point slack).
 *
 * HONEST SCOPE
 * ------------
 *  - Only ONE rung (N = 1e4) carries a resolved point measurement; the other
 *    three are coarse closed brackets. Every finer imp-360 rung at N > 1e5 is
 *    an O(N^2)-compute-infeasible honest partial (t_c_hi = +inf), so no point
 *    F_mb exists there to test -- this cross-validation cannot reach the
 *    small-H plateaus 7-9. The plateau-monotonicity step of imp-3725 (one
 *    evaluation at N2 dominates the plateau) is what makes the missing interior
 *    rungs non-load-bearing; here we only spot-check the rungs that are
 *    measured.
 *  - The imp-2509 N=1e4 pass is flagged resolved:false (it hit the maxSteps
 *    budget at the collision gate, not full resolution), so t_c(1e4) is the
 *    integrator estimate the imp-3725 cross-check (2) already validated as
 *    inside the enclosure; we reuse that same value, adding only the F_mb view.
 *  - Cross-validation / measurement ONLY. No new Lambda bound. imp-3066
 *    off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian
 *    Lambda <= 0.2 remains the rigorous SOTA. NO QED.
 *
 * @see imp-3725 (the certified enclosure being cross-validated)
 * @see imp-3728 (thetaBar sensitivity of the same enclosure)
 * @see src/data/c-mb-dyson-large-n-cache.js (imp-2509 measured t_c point)
 * @see src/data/imp-360-extended-ladder-N1e6-rows.json (measured brackets)
 * @see src/data/imp-3725-fmb-plateau-domination-lemma.js (certified band)
 */

// Certified band, quoted verbatim from imp-3725 ROWS (FmbUpper = tcHi - tcLo,
// tcLo = H_raw^2/8). Kept as literals here to avoid importing the heavy lemma
// module transitively; the arithmetic ties are re-checked in assertions.
const CERT = Object.freeze({
  p0: { H: 0.0376985,  tcLo: 1.77647103e-4, tcHi: 1.77962623e-4, FmbUpper: 3.1551985e-7 },
  p1: { H: 0.03530732, tcLo: 1.55825865e-4, tcHi: 1.56269756e-4, FmbUpper: 4.43891849e-7 },
  p2: { H: 0.02953763, tcLo: 1.09058933e-4, tcHi: 1.09219541e-4, FmbUpper: 1.60607652e-7 },
  p6: { H: 0.01470148, tcLo: 2.70166746e-5, tcHi: 2.70304017e-5, FmbUpper: 1.37271093e-8 },
});

// (A) RESOLVED POINT: imp-2509 fine-pass measured t_c at N = 1e4.
const TC_MEASURED_1E4 = 0.0001778248472; // c-mb-dyson-large-n-cache.js N=10000 row

// (B) COARSE CLOSED BRACKETS: imp-360 one-ULP interval-RK4 [t_c_lo, t_c_hi].
const IMP_360_BRACKETS = Object.freeze([
  { N: 25000,  plateau: 'p1', tcLoBr: 1e-4, tcHiBr: 2e-4 }, // imp-360 rows.json
  { N: 50000,  plateau: 'p2', tcLoBr: 1e-4, tcHiBr: 2e-4 },
  { N: 100000, plateau: 'p6', tcLoBr: 0,    tcHiBr: 1e-4 },
]);

// ── The cross-validation rows ───────────────────────────────────────────────

// Resolved point rung.
const fmbEmp1e4 = TC_MEASURED_1E4 - CERT.p0.tcLo;

const RESOLVED_ROWS = Object.freeze([
  {
    N: 10000,
    plateau: 'p0',
    kind: 'resolved-point',
    source: 'imp-2509 c-mb-dyson-large-n-cache (RK4+Kahan, dt=1.776e-7, pair 6708)',
    tcMeasured: TC_MEASURED_1E4,
    fmbEmpirical: fmbEmp1e4,
    certBandLo: 0,
    certBandHi: CERT.p0.FmbUpper,
    insideBand: fmbEmp1e4 >= 0 && fmbEmp1e4 <= CERT.p0.FmbUpper,
    positionInBand: fmbEmp1e4 / CERT.p0.FmbUpper,        // 0.563
    observedUpperSlack: CERT.p0.FmbUpper / fmbEmp1e4,     // 1.775x
  },
]);

// Coarse bracket rungs: empirical F_mb is a band; test = certified enclosure
// must sit inside the measured bracket (else the two would be inconsistent).
const BRACKET_ROWS = Object.freeze(
  IMP_360_BRACKETS.map((b) => {
    const c = CERT[b.plateau];
    const fmbBandLo = Math.max(0, b.tcLoBr - c.tcLo);
    const fmbBandHi = b.tcHiBr - c.tcLo;
    return Object.freeze({
      N: b.N,
      plateau: b.plateau,
      kind: 'coarse-bracket',
      source: 'imp-360 extended-ladder (one-ULP interval-RK4, dt=1e-4)',
      tcBracket: [b.tcLoBr, b.tcHiBr],
      fmbEmpiricalBand: [fmbBandLo, fmbBandHi],
      certEnclosure: [c.tcLo, c.tcHi],
      certFmbUpper: c.FmbUpper,
      // consistency: the analytic enclosure lies inside the measured bracket,
      // hence the certified FmbUpper lies inside the empirical F_mb band.
      certEnclosureInsideBracket: c.tcLo >= b.tcLoBr && c.tcHi <= b.tcHiBr,
      certFmbUpperInsideBand: c.FmbUpper >= fmbBandLo && c.FmbUpper <= fmbBandHi,
    });
  }),
);

export const IMP_3732_FMB_EMPIRICAL_CROSSVAL = Object.freeze({
  id: 'imp-3732',
  title:
    'Empirical cross-validation of the imp-3725 certified F_mb enclosure ' +
    'against measured backward-Dyson t_c on [1e4, 1e6]',
  status: 'cross-validation-complete',
  rhFree: true,
  semantics:
    'independent falsification test (measured F_mb vs certified band); ' +
    'no new bound, NO QED',

  resolvedRows: RESOLVED_ROWS,
  bracketRows: BRACKET_ROWS,

  headline: {
    resolvedRungsTested: RESOLVED_ROWS.length,
    bracketRungsTested: BRACKET_ROWS.length,
    allResolvedInsideBand: RESOLVED_ROWS.every((r) => r.insideBand),
    allBracketsConsistent: BRACKET_ROWS.every((r) => r.certEnclosureInsideBracket),
    resolvedPointSlack_1e4: RESOLVED_ROWS[0].observedUpperSlack, // ~1.775x
    resolvedPointPositionInBand_1e4: RESOLVED_ROWS[0].positionInBand, // ~0.563
    note:
      'The one resolved rung (N=1e4) sits at 56.3% of the certified band with ' +
      'a 1.775x upper-bound slack -- the enclosure is TIGHT relative to the ' +
      'true flow. The imp-3725 8.31e4x headline is slack vs the RETIRED ' +
      'carryforward K=0.2014, a different (heuristic-bound) comparison, not vs ' +
      'the measured value. No rung approaches or violates a band edge. ' +
      'imp-3066 UNTOUCHED; Platt-Trudgian Lambda<=0.2 stays SOTA; NO QED.',
  },

  scope: {
    measuredCoverage:
      'Only N=1e4 has a resolved point t_c; N=25k/50k/100k are coarse closed ' +
      'brackets. imp-360 rungs at N>1e5 are O(N^2)-compute-infeasible partials ' +
      '(t_c_hi=+inf), so plateaus 7-9 (smallest H) carry NO measured F_mb to ' +
      'test here.',
    whyStillMeaningful:
      'imp-3725 plateau-monotonicity makes one N2 evaluation dominate each ' +
      'plateau, so the unmeasured interior rungs are not load-bearing; this ' +
      'module spot-checks the measured rungs against the same certificate.',
    notClosed:
      'cond-CH and the other conditional legs of bound-imp-1088-finite-1e6; ' +
      'the directed-rounding subgap imp-3725-sub-directed-rounding.',
  },
});

// ── Build-time assertions (self-executing; throw at import on failure) ───────

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3732_FMB_EMPIRICAL_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3732-cert-band-ties-to-imp3725',
    holds: () =>
      Object.values(CERT).every(
        (c) =>
          rel(c.tcLo, (c.H * c.H) / 8) < 1e-4 &&
          rel(c.FmbUpper, c.tcHi - c.tcLo) < 1e-3,
      ),
    why:
      'The certified literals must tie to the imp-3725 lemma: tcLo = H^2/8 and ' +
      'FmbUpper = tcHi - tcLo. If these drift the whole cross-check is against ' +
      'the wrong band.',
  },
  {
    id: 'imp3732-resolved-point-inside-band',
    holds: () =>
      RESOLVED_ROWS.every(
        (r) => r.fmbEmpirical >= r.certBandLo && r.fmbEmpirical <= r.certBandHi,
      ),
    why:
      'The falsification test: every RESOLVED empirical F_mb = t_c_measured - ' +
      'H^2/8 must land inside the certified band [0, FmbUpper]. A value below 0 ' +
      'would break the lower lemma (F_mb>=0); a value above FmbUpper would ' +
      'falsify the imp-3725 upper bound.',
  },
  {
    id: 'imp3732-resolved-point-fmb-value',
    holds: () => rel(fmbEmp1e4, 1.777442e-7) < 1e-3 && rel(RESOLVED_ROWS[0].observedUpperSlack, 1.7751) < 1e-3,
    why:
      'Pin the measured F_mb(1e4) = t_c - H^2/8 = 1.777442e-7 and the observed ' +
      'upper-bound slack FmbUpper/F_mb = 1.775x, so a table drift is caught.',
  },
  {
    id: 'imp3732-brackets-contain-cert-enclosure',
    holds: () =>
      BRACKET_ROWS.every(
        (r) => r.certEnclosureInsideBracket && r.certFmbUpperInsideBand,
      ),
    why:
      'Each imp-360 coarse closed t_c bracket must CONTAIN the imp-3725 ' +
      'analytic enclosure (so the certified FmbUpper lies inside the empirical ' +
      'F_mb band). Bracket exclusion would signal a real analytic/measured ' +
      'inconsistency; containment is consistency at coarse resolution.',
  },
  {
    id: 'imp3732-no-band-edge-approach',
    holds: () =>
      RESOLVED_ROWS.every((r) => r.positionInBand > 0.05 && r.positionInBand < 0.95),
    why:
      'Honest reporting: the resolved measurement sits comfortably inside the ' +
      'band (not hugging an edge). If a future rung landed within 5% of an ' +
      'edge this should trip so the near-miss is surfaced, not hidden.',
  },
  {
    id: 'imp3732-crossval-only-no-qed',
    holds: () =>
      IMP_3732_FMB_EMPIRICAL_CROSSVAL.status === 'cross-validation-complete' &&
      IMP_3732_FMB_EMPIRICAL_CROSSVAL.headline.allResolvedInsideBand === true &&
      IMP_3732_FMB_EMPIRICAL_CROSSVAL.headline.allBracketsConsistent === true,
    why:
      'This module is a measurement-only cross-validation: it must report all ' +
      'resolved rungs inside the band and all brackets consistent, and it ' +
      'claims no new bound (NO QED; imp-3066 untouched; PT Lambda<=0.2 SOTA).',
  },
];

// Self-executing (imp-3715/imp-3725 convention): any failed assertion throws.
for (const assertion of IMP_3732_FMB_EMPIRICAL_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3732-fmb-empirical-crossval assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3732_FMB_EMPIRICAL_CROSSVAL;
