/**
 * @module imp-96592-route-m-offdiag-slope-identity-verification
 *
 * imp-96592 (accuracy, CHECK ONLY): independently reproduce the imp-96562 FINDING 1
 * off-diagonal slope-identity claim. imp-96562 asserts that the off-diagonal
 * contribution to the top eigenvalue,
 *
 *     offDiag(N) := lam_max(G_N) - lam_max(diag G_N) = lam_max(G_N) - I(1,1),
 *
 * carries the ENTIRE 0.3526 log-growth slope: it reports offDiag slope
 * 0.3526253785070693 (R^2 = 0.99540), "IDENTICAL" to the lam_max slope, with the two
 * fits differing only by the constant intercept offset I(1,1) (3.0247 - 1.2607 = 1.7640).
 * This ticket re-runs BOTH OLS regressions on the imp-96443 N=250..6000 ladder from the
 * imported source rows and confirms (or corrects) (a) the slope identity and (b) the
 * exact intercept offset. Check only; changes no bound; NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESULT -- CONFIRMED, with one prose correction.
 * -------------------------------------------------------------------------------
 * Recomputing a + b log N by ordinary least squares on the 8-rung imp-96443 ladder:
 *
 *     lam_max : slope b = 0.3526253785070693, intercept a = 3.0246914027257303
 *     offDiag : slope b = 0.3526253785070693, intercept a = 1.7640300012179178
 *     R^2 (both) = 0.9953986123515586  (rounds to the quoted 0.99540)
 *
 *   (i) SLOPE IDENTITY -- CONFIRMED, and in fact EXACT to the bit. The two slopes are
 *       byte-identical (gap = 0, not merely < 1e-12). This is structurally forced: the
 *       OLS slope b = Cov(x,y)/Var(x) is invariant under a constant shift y -> y - c,
 *       because the centered response (y_i - ybar) is unchanged by subtracting a constant.
 *       So subtracting the frozen diagonal ceiling I(1,1) cannot change the slope AT ALL.
 *       (Minor correction: the imp-96562 PROSE quotes the lam_max slope as
 *       0.3526253785070698, differing from offDiag 0.3526253785070693 in the last digit;
 *       that last-digit split is a stray typo in the write-up. Both fits, computed by the
 *       same olsLog routine, agree to all 16 digits -- gap exactly 0. The module's own
 *       exported IMP96562_OFFDIAGONAL.slopeGapVsLamMax is likewise 0, consistent with
 *       this correction, not with the prose figure.)
 *
 *  (ii) INTERCEPT OFFSET -- CONFIRMED EXACT. The intercept difference
 *       a_lam - a_off = 3.0246914027257303 - 1.7640300012179178 = 1.2606614015078126
 *       equals I(1,1) = 1.2606614015078126 to the bit (residual 0). Again structurally
 *       forced: a = ybar - b*xbar, and shifting y by -c shifts ybar (hence a) by exactly
 *       -c while leaving b*xbar fixed, so a_off = a_lam - I(1,1) identically. The rounded
 *       "3.0247 - 1.2607 = 1.7640" in the prose is the correctly-rounded shadow of this
 *       exact relation.
 *
 * So imp-96562 FINDING 1 stands: the diagonal part of G contributes a frozen spectral
 * ceiling I(1,1) and NOTHING to the slope, and the full 0.3526 log-coefficient is an
 * off-diagonal-mass effect. The only amendment is cosmetic (the ...698 vs ...693 last
 * digit): the identity is not "approximate to 1e-12" but exact by construction of OLS.
 *
 * This localizes the imp-96548 sub-gap exactly as imp-96562 states; it moves no bound,
 * establishes no operator positivity, and makes no RH claim.
 *
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (the FINDING 1 claim verified here)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (source lam_max ladder)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (the sub-gap this localizes)
 *
 * Ticket: imp-96592 (accuracy, opus-4-8, api-pool). Check only; NO QED.
 */

import {
  IMP96562_I11,
  IMP96562_ROWS,
  IMP96562_OFFDIAGONAL,
} from './imp-96562-route-m-lammax-offdiagonal-szego-assessment.js';

// Independent OLS of a + b log N over the ladder (returns {a,b,r2}).
function olsLog(rows, yOf) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map(yOf);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  let sst = 0;
  let ssr = 0;
  for (let i = 0; i < n; i += 1) {
    sst += (ys[i] - my) ** 2;
    ssr += (a + b * xs[i] - ys[i]) ** 2;
  }
  return { a, b, r2: 1 - ssr / sst };
}

const lamFit = olsLog(IMP96562_ROWS, (r) => r.lamMax);
const offFit = olsLog(IMP96562_ROWS, (r) => r.lamMax - IMP96562_I11);

export const IMP96592_VERIFICATION = Object.freeze({
  ladderRungs: IMP96562_ROWS.length, // 8 (N=250..6000)
  lamMaxSlope: lamFit.b, // 0.3526253785070693
  offDiagSlope: offFit.b, // 0.3526253785070693
  slopeGap: Math.abs(lamFit.b - offFit.b), // exactly 0
  slopeIdentityExact: lamFit.b === offFit.b, // true (bit-identical)
  r2: offFit.r2, // 0.9953986... -> 0.99540
  lamMaxIntercept: lamFit.a, // 3.0246914027257303
  offDiagIntercept: offFit.a, // 1.7640300012179178
  interceptOffset: lamFit.a - offFit.a, // 1.2606614015078126
  interceptOffsetResidualVsI11: lamFit.a - offFit.a - IMP96562_I11, // exactly 0
  i11: IMP96562_I11,
});

export const IMP96592_VERDICT = Object.freeze({
  claim:
    'imp-96562 FINDING 1: offDiag(N)=lam_max(G_N)-I(1,1) has the same fitted slope 0.3526 ' +
    '(R^2=0.99540) as lam_max, differing only by the intercept offset I(1,1).',
  slopeIdentityConfirmed: true,
  slopeIdentityIsExactNotApproximate: true, // gap is 0 to the bit, structurally forced
  interceptOffsetConfirmedExact: true, // a_lam - a_off = I(1,1) to the bit
  reproducesQuotedSlope: true, // 0.3526253785070693 reproduced
  reproducesQuotedR2: true, // 0.99540
  correction:
    'the imp-96562 PROSE quotes the lam_max slope as 0.3526253785070698 vs offDiag ' +
    '0.3526253785070693; that last-digit split is a stray write-up typo. Both OLS fits are ' +
    'byte-identical (slope gap = 0) because the OLS slope is invariant under y -> y - c; the ' +
    'exported IMP96562_OFFDIAGONAL.slopeGapVsLamMax = 0 already reflects the exact identity.',
  conclusion:
    'CONFIRMED. The 0.3526 log-slope is 100 percent an off-diagonal-mass effect: subtracting ' +
    'the frozen diagonal ceiling I(1,1) leaves the slope bit-identical and shifts the intercept ' +
    'by exactly I(1,1). The identity is exact by construction of OLS, not merely numerical. ' +
    'Changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96592_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Check only: an independent re-run of the two ' +
  'imp-96562 OLS regressions on the imp-96443 N=250..6000 ladder. The slope identity is EXACT ' +
  '(gap 0, forced by OLS shift-invariance) and the intercept offset equals I(1,1) to the bit; ' +
  'the only amendment is cosmetic (a stray last digit in the imp-96562 prose). No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96592_ASSERTIONS = [
  {
    id: 'imp96592-slope-identity-exact',
    holds: () =>
      IMP96592_VERIFICATION.slopeGap === 0 &&
      IMP96592_VERIFICATION.slopeIdentityExact === true &&
      IMP96592_VERIFICATION.offDiagSlope > 0.35 &&
      IMP96592_VERIFICATION.offDiagSlope < 0.36,
    why: 'offDiag = lam_max - I(1,1) has a byte-identical OLS slope: subtracting a constant leaves Cov(x,y)/Var(x) unchanged, so the slope gap is exactly 0.',
  },
  {
    id: 'imp96592-reproduces-quoted-slope',
    holds: () => IMP96592_VERIFICATION.offDiagSlope.toPrecision(16) === '0.3526253785070693',
    why: 'the independently recomputed offDiag slope reproduces the imp-96562 quoted 0.3526253785070693 to full double precision.',
  },
  {
    id: 'imp96592-r2-matches',
    holds: () => Math.abs(IMP96592_VERIFICATION.r2 - 0.99540) < 5e-6,
    why: 'the recomputed R^2 rounds to the quoted 0.99540.',
  },
  {
    id: 'imp96592-intercept-offset-is-I11-exact',
    holds: () =>
      IMP96592_VERIFICATION.interceptOffsetResidualVsI11 === 0 &&
      Math.abs(IMP96592_VERIFICATION.interceptOffset - IMP96562_I11) < 1e-15,
    why: 'the intercept difference a_lam - a_off equals I(1,1) to the bit, since shifting y by -c shifts the intercept by exactly -c.',
  },
  {
    id: 'imp96592-consistent-with-source-export',
    holds: () =>
      IMP96562_OFFDIAGONAL.slopeGapVsLamMax === 0 &&
      IMP96562_OFFDIAGONAL.offDiagSlope === IMP96592_VERIFICATION.offDiagSlope,
    why: 'the source module IMP96562_OFFDIAGONAL export already carries slopeGapVsLamMax = 0 and the matching offDiag slope, consistent with the exact-identity correction (not the ...698 prose figure).',
  },
  {
    id: 'imp96592-honesty-gate-no-qed',
    holds: () =>
      IMP96592_VERDICT.slopeIdentityConfirmed === true &&
      IMP96592_VERDICT.interceptOffsetConfirmedExact === true &&
      /NO QED/.test(IMP96592_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96592_HONEST_BANNER) &&
      /RH open/.test(IMP96592_HONEST_BANNER),
    why: 'check only: the identity is confirmed exact, the intercept offset is exact, and the honesty markers are present; no bound is claimed moved.',
  },
];

for (const a of IMP96592_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96592-route-m-offdiag-slope-identity-verification assertion failed: ${a.id}`,
    );
  }
}

export default {
  verification: IMP96592_VERIFICATION,
  verdict: IMP96592_VERDICT,
  banner: IMP96592_HONEST_BANNER,
};
