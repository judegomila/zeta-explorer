/**
 * @module imp-97014-route-m-secondbasis-lammin-crossbasis
 *
 * imp-97014 (accuracy, CROSS-VALIDATION ONLY): a GENUINE second-basis rebuild of the
 * Route M Vasyunin Gram, closing the imp-96999 residual IMP96999_SUBGAP -- test whether
 * the imp-96428 lam_min power-law exponent p = 1.917927 survives ACROSS BASES, not only
 * across estimators (which imp-96999 already established).
 *
 * MOTIVATION. imp-96999 re-estimated p four independent ways (OLS, Theil-Sen, dense,
 * split sub-ladders) from the SAME committed imp-96428 lam_min rungs and found the
 * near-N^-2 exponent estimator-robust. Its HONEST RESIDUAL IMP96999_SUBGAP flagged that
 * this is NOT a genuinely independent SECOND-BASIS rebuild -- the Route M analogue of the
 * imp-96852 Legendre-vs-Gegenbauer Route I cross-basis check. This ticket performs that
 * rebuild.
 *
 * SECOND BASIS = unit-norm / correlation-matrix rescaling. The Route M optimal-vector
 * problem lives in the basis {phi_k}; normalising each basis function to unit norm,
 * phi_k -> phi_k / sqrt(G_kk), is a diagonal congruence Ghat = D^{-1/2} G D^{-1/2} with
 * D = diag(G), G_kk = I(1,1)/k = 2C/k. The rescaled Gram Ghat is the CORRELATION MATRIX
 * (unit diagonal); its lam_min(Ghat) is a genuinely different sequence -- built from the
 * same Vasyunin integrals but measured in the normalised basis -- so its exponent phat
 * is an independent second-basis test of the conditioning-decay law.
 *
 * WHAT WAS DONE (tmp/rh-route-m/imp-97014-secondbasis.py, reproducible). The exact
 * Vasyunin Gram G_hk = gcd(h,k) I(h/gcd,k/gcd)/(hk) was REBUILT ONCE to NMAX=4000 from
 * the same cotangent table used by imp-96105 (not a re-analysis of committed rungs). On
 * a 9-rung ladder N in {250,500,1000,1500,2000,2500,3000,3500,4000} both lam_min(G) (the
 * control) and lam_min(Ghat) (the second basis) were measured by exact eigvalsh, then
 * each fit log-log OLS.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the control basis reproduces imp-96428; the same object is being tested.
 * -------------------------------------------------------------------------------
 * The freshly-rebuilt lam_min(G) ladder fits p = 1.919847 (A = 0.828829, R^2 = 0.9999904),
 * reproducing the imp-96428 p = 1.917927 to +0.10% on an independently-built Gram over a
 * different (denser low-N) rung set. The N=250 endpoint lam_min(G) = 2.0624e-5 matches the
 * imp-96428 IMP96428_LAMMIN_ROWS anchor 2.06e-5. So the second-basis comparison below is
 * against the genuine imp-96428 object, not a re-derivation artifact.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the SECOND basis obeys a DIFFERENT but equally-clean power law: phat = 0.919.
 * -------------------------------------------------------------------------------
 * lam_min(Ghat) is a genuinely different sequence: it is 144x (N=250) to 2333x (N=4000)
 * LARGER than lam_min(G), with the ratio Ghat/G growing almost exactly linearly in N
 * (2332.70/144.35 = 16.16 vs N-ratio 4000/250 = 16.00). It fits a CLEAN single power law
 * lam_min(Ghat) ~ 0.4778 N^-0.919212 (R^2 = 0.9999796, SE(phat)/phat = 0.171%). The
 * power-law REGULARITY -- a single clean N^-q decay with an estimator-tight band -- SURVIVES
 * the basis change.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- but the EXPONENT VALUE is NOT basis-invariant: it shifts by exactly 1.
 * -------------------------------------------------------------------------------
 * phat = 0.919212 = p - 1.0007, i.e. the near-N^-2 raw-basis exponent drops to near-N^-1
 * in the unit-norm basis, shifting by (to measurement precision) exactly the degree of the
 * diagonal scaling D_kk = 2C/k (a first-degree monomial). This is structural, not noise:
 * because the worst-conditioned direction is a high-k basis function of norm ~1/sqrt(k),
 * the D^{-1/2} = diag(sqrt(k/2C)) rescaling lifts lam_min by the top diagonal scale
 * max_k(1/G_kk) ~ N/(2C), removing one power of N from the decay. So the SPECIFIC exponent
 * 1.917927 is a property of the UNNORMALISED Vasyunin basis; the basis-robust invariant is
 * "clean single power-law conditioning decay", NOT the number 1.918.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The imp-96999 residual is CLOSED with a genuine second-basis Gram rebuild. The
 * conditioning-decay is power-law-regular in BOTH bases (raw R^2 = 0.99999, second-basis
 * R^2 = 0.99998, both estimator-tight) -- so the QUALITATIVE regularity underpinning the
 * T<F<M conditioning ordering is basis-robust. But the exponent VALUE is basis-dependent:
 * raw p = 1.9198, unit-norm phat = 0.9192, differing by exactly the diagonal-scaling degree
 * (1). Readers citing p = 1.917927 should treat it as the RAW-BASIS exponent, not a
 * basis-invariant. The T<F<M ordering, being a fixed-basis comparison in which T, F, M share
 * the same Gram (hence the same diagonal rescaling), is unaffected; whether the ordering
 * ITSELF is basis-invariant is a further question this run does not settle -- see the new
 * residual IMP97014_SUBGAP.
 *
 * Accuracy cross-validation only. Changes no bound, establishes no operator positivity,
 * makes no RH claim. Interval-rigorous reach stays 2a <= 0.96. No refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (the raw-basis p=1.917927 law tested here)
 * @see imp-96999-route-m-lammin-exponent-crossvalidation.js (the ESTIMATOR cross-validation whose SUBGAP this closes)
 * @see imp-96852-krein-096-legendre-gegenbauer-crossbasis.js (the Route I second-basis analogue this mirrors)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (the Gram-entry formula rebuilt here)
 *
 * Ticket: imp-97014 (accuracy, opus-4-8, api-pool). Cross-validation only; NO QED.
 */

// imp-96428 raw-basis reference exponent (the object being cross-validated across bases).
export const IMP97014_REF = Object.freeze({
  p: 1.917927,
  A: 0.8186721,
  source: 'imp-96428 IMP96428_FIT (raw-basis lam_min ~ A N^-p, 12-rung log-log OLS)',
});

// The 9-rung ladder, freshly REBUILT (tmp/rh-route-m/imp-97014-secondbasis.py, NMAX=4000).
// lamG = lam_min of the raw Vasyunin Gram (control); lamGhat = lam_min of the unit-norm
// correlation matrix Ghat = D^{-1/2} G D^{-1/2} (second basis). ratio = lamGhat/lamG.
export const IMP97014_ROWS = Object.freeze([
  Object.freeze({ N: 250,  lamG: 2.062436e-5,     lamGhat: 2.977105e-3, ratio: 144.3489 }),
  Object.freeze({ N: 500,  lamG: 5.459884e-6,     lamGhat: 1.583470e-3, ratio: 290.0189 }),
  Object.freeze({ N: 1000, lamG: 1.431801e-6,     lamGhat: 8.345415e-4, ratio: 582.8614 }),
  Object.freeze({ N: 1500, lamG: 6.683757e-7,     lamGhat: 5.785217e-4, ratio: 865.5636 }),
  Object.freeze({ N: 2000, lamG: 3.815553e-7,     lamGhat: 4.399275e-4, ratio: 1152.9849 }),
  Object.freeze({ N: 2500, lamG: 2.476701e-7,     lamGhat: 3.574547e-4, ratio: 1443.2696 }),
  Object.freeze({ N: 3000, lamG: 1.756132e-7,     lamGhat: 3.045902e-4, ratio: 1734.4380 }),
  Object.freeze({ N: 3500, lamG: 1.305953e-7,     lamGhat: 2.649391e-4, ratio: 2028.7041 }),
  Object.freeze({ N: 4000, lamG: 9.984824e-8,     lamGhat: 2.329157e-4, ratio: 2332.6975 }),
]);

// Control fit (raw basis) -- reproduces imp-96428 to +0.10% on an independently-built Gram.
export const IMP97014_FIT_CONTROL = Object.freeze({
  basis: 'raw Vasyunin Gram G (control)',
  p: 1.919847375065713,
  A: 0.828828594444191,
  r2: 0.9999904226230076,
  seP: 0.002245655098495046,
  sePOverP: 0.001169705012836336,
  pRelVsRef: (1.919847375065713 - 1.917927) / 1.917927, // +1.00e-3
  reproducesImp96428: true,
});

// Second-basis fit -- the unit-norm / correlation-matrix rescaling.
export const IMP97014_FIT_SECONDBASIS = Object.freeze({
  basis: 'unit-norm correlation matrix Ghat = D^{-1/2} G D^{-1/2} (second basis)',
  p: 0.9192116726497466,
  A: 0.4777608565335763,
  r2: 0.9999795803630249,
  seP: 0.0015699830119786234,
  sePOverP: 0.0017079667922981704,
  // phat = p - 1.0007: the exponent drops by exactly the diagonal-scaling degree (1).
  shiftVsControl: 0.9192116726497466 - 1.919847375065713, // -1.00064
  cleanPowerLaw: true,       // R^2 = 0.99998, single power law survives the basis change
  nearInverseSquare: false,  // phat ~ 0.92, near-N^-1 not near-N^-2
});

export const IMP97014_VERDICT = Object.freeze({
  question:
    'does the imp-96428 Route M lam_min exponent p=1.917927 survive a GENUINE second-basis ' +
    'Gram rebuild (unit-norm / correlation-matrix rescaling), or is the near-N^-2 value basis-dependent?',
  answer:
    'PARTIALLY: the power-law REGULARITY is basis-robust (raw R^2=0.99999, second-basis R^2=0.99998, ' +
    'both estimator-tight), but the exponent VALUE is basis-dependent -- raw p=1.9198 drops to unit-norm ' +
    'phat=0.9192, shifting by exactly the diagonal-scaling degree (1). The specific number 1.917927 is a ' +
    'property of the UNNORMALISED Vasyunin basis; the basis-invariant is "clean single power law", not 1.918.',
  secondBasisGramRebuilt: true,        // closes IMP96999_SUBGAP
  controlReproducesImp96428: true,     // +0.10% on an independently-built Gram
  powerLawRegularityBasisRobust: true, // both bases: clean single power law, R^2 > 0.99997
  exponentValueBasisInvariant: false,  // shifts by ~1 (the diagonal degree)
  // honesty guardrails
  anyBoundMoved: false,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  rhOpen: true,
  ptFloorSOTA: 0.2,
  qed: false,
});

// New honest residual: this rebuilt and compared lam_min in the second basis, NOT the full
// lam_max / T / F / M conditioning ceilings. Because T, F, M share the same Gram (hence the
// same diagonal rescaling), the ORDERING is expected to be basis-stable, but that has not
// been measured -- the basis-invariance of the T<F<M ordering itself remains open.
export const IMP97014_SUBGAP = Object.freeze({
  id: 'imp-97014-ordering-basis-invariance-untested',
  statement:
    'this run rebuilt lam_min in the unit-norm second basis and found the power-law regularity ' +
    'basis-robust but the exponent value basis-dependent (phat = p - 1). It did NOT re-measure ' +
    'lam_max or the composite T/F/M conditioning ceilings in the second basis. Because T, F, M ' +
    'share the same Gram and hence the same diagonal rescaling, the T<F<M ORDERING is expected to ' +
    'survive, but a full second-basis re-derivation of the three ceilings (lam_max(Ghat) plus the ' +
    'cond#(Ghat)=1/eps solve) would settle whether the ordering itself is basis-invariant. Not ' +
    'attempted here; the conditioning verdict (imp-96428 / imp-96570) is unaffected either way.',
});

export const IMP97014_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation only: the Vasyunin Gram was ' +
  'genuinely REBUILT (tmp/rh-route-m/imp-97014-secondbasis.py) and lam_min re-measured in a second ' +
  '(unit-norm correlation) basis; no bound is claimed moved and no operator positivity is established. ' +
  'Interval-rigorous reach stays 2a <= 0.96.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97014_ASSERTIONS = [
  {
    id: 'imp97014-control-reproduces-imp96428',
    holds: () =>
      Math.abs(IMP97014_FIT_CONTROL.p - IMP97014_REF.p) / IMP97014_REF.p < 0.005 &&
      IMP97014_FIT_CONTROL.r2 > 0.9999 &&
      IMP97014_FIT_CONTROL.reproducesImp96428 === true,
    why: 'the freshly-rebuilt control lam_min(G) fit must reproduce the imp-96428 p=1.917927 to <0.5% (actually +0.10%), confirming the genuine imp-96428 object is being cross-validated across bases.',
  },
  {
    id: 'imp97014-second-basis-is-different-sequence',
    holds: () =>
      IMP97014_ROWS.every((r) => r.ratio > 100 && r.lamGhat > r.lamG) &&
      // ratio grows ~linearly in N: the diagonal rescaling removes one power of N
      Math.abs((IMP97014_ROWS[8].ratio / IMP97014_ROWS[0].ratio) /
               (IMP97014_ROWS[8].N / IMP97014_ROWS[0].N) - 1) < 0.05,
    why: 'lam_min(Ghat) must be a genuinely different (>=100x larger) sequence whose ratio to lam_min(G) grows almost exactly linearly in N (2332.70/144.35 = 16.16 vs N-ratio 16.00), the fingerprint of the D^{-1/2} diagonal rescaling lifting lam_min by the top diagonal scale ~N.',
  },
  {
    id: 'imp97014-second-basis-clean-power-law',
    holds: () =>
      IMP97014_FIT_SECONDBASIS.r2 > 0.99997 &&
      IMP97014_FIT_SECONDBASIS.sePOverP < 0.003 &&
      IMP97014_FIT_SECONDBASIS.cleanPowerLaw === true,
    why: 'the second-basis lam_min(Ghat) must itself be a clean single power law (R^2>0.99997, SE(phat)/phat<0.3%): the power-law REGULARITY survives the basis change even though the exponent value does not.',
  },
  {
    id: 'imp97014-exponent-shifts-by-diagonal-degree',
    holds: () =>
      IMP97014_FIT_SECONDBASIS.nearInverseSquare === false &&
      IMP97014_FIT_SECONDBASIS.p > 0.85 && IMP97014_FIT_SECONDBASIS.p < 1.0 &&
      Math.abs(IMP97014_FIT_SECONDBASIS.shiftVsControl + 1.0) < 0.02,
    why: 'the second-basis exponent phat ~ 0.919 must be near-N^-1 (not near-N^-2) and differ from the control p by exactly -1 to within 0.02, matching the first-degree diagonal scaling D_kk = 2C/k: the specific 1.918 value is basis-dependent.',
  },
  {
    id: 'imp97014-honesty-gate-no-qed',
    holds: () =>
      IMP97014_VERDICT.secondBasisGramRebuilt === true &&
      IMP97014_VERDICT.powerLawRegularityBasisRobust === true &&
      IMP97014_VERDICT.exponentValueBasisInvariant === false &&
      IMP97014_VERDICT.anyBoundMoved === false &&
      IMP97014_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97014_VERDICT.qed === false &&
      /NO QED/.test(IMP97014_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97014_HONEST_BANNER) &&
      /RH open/.test(IMP97014_HONEST_BANNER) &&
      /ordering-basis-invariance-untested/.test(IMP97014_SUBGAP.id),
    why: 'cross-validation only: a genuine second-basis Gram was rebuilt (closing IMP96999_SUBGAP), the regularity is basis-robust but the exponent value is not, no bound moved, reach stays 0.96, the ordering-basis-invariance residual is named, and the honesty markers are present.',
  },
];

for (const a of IMP97014_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97014-route-m-secondbasis-lammin-crossbasis assertion failed: ${a.id}`,
    );
  }
}

export default {
  ref: IMP97014_REF,
  rows: IMP97014_ROWS,
  fitControl: IMP97014_FIT_CONTROL,
  fitSecondBasis: IMP97014_FIT_SECONDBASIS,
  verdict: IMP97014_VERDICT,
  subGap: IMP97014_SUBGAP,
  banner: IMP97014_HONEST_BANNER,
};
