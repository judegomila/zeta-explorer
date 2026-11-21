/**
 * @module imp-34407-fartail-composite-correction-constant-derivation
 *
 * imp-34407 (numerical, opus-4-8): Derive the imp-34329 far-tail
 * composite-exponent correction constant c ~ 4.4 in r-exponent = 2 - c/log T0
 * ANALYTICALLY from the imp-34248/imp-34174 log-T0-softened r(thr) sub-terms,
 * and measure the residual of the c/log T0 form against the tabulated local
 * exponents.
 *
 * THE OPEN QUESTION (imp-34329 F3)
 * -------------------------------
 * imp-34329 found the deep-tail local r-exponent = d log r / d log thr climbs
 * monotonically back toward 2 with a bounded correction fit r-exponent =
 * 2 - c/log T0, c ~ 4.4 (measured from decade-window secants). It never derived
 * c: is it log(2pi), 2, or some combination? This module answers that from the
 * inherited sub-terms.
 *
 * THE DERIVATION (leading constant is exactly 4, NOT log(2pi))
 * -----------------------------------------------------------
 * Write L = log T0, lam = log(2pi), M = log(T0/2pi) = L - lam. The imp-34248
 * sub-terms are r = B (M+1) L / T0 with B = GRONWALL/(2pi E_trunc), and the
 * crossover fixed point N_cross = K_thr L, K_thr = ((1-thr)/thr)^2 K_AMPL, mapped
 * through the RvM height N = (T0/2pi)(M-1). Eliminating N:
 *
 *     T0 = 2pi K_thr L / (M-1),   so   L = log(2pi K_AMPL) - 2 log thr + log L
 *                                          + 2 log(1-thr) - log(M-1).
 *
 * The leading balance is L = -2 log thr + const (the L, log(M-1) pieces are
 * O(log L) sub-terms), i.e. the height grows as T0 ~ 2pi K_AMPL thr^-2 with the
 * L-dependence CANCELLING. Hence with s = log thr and thr -> 0:
 *
 *     dL/ds -> -2   (so log T0 = -2 log thr + O(log log)).
 *
 * From log r = const + log(M+1) + log L - L, the exponent is
 *
 *     r-exp = d log r/ds = dL/ds [ 1/(M+1) + 1/L - 1 ]
 *           = 2 - 2(1/L + 1/(M+1)) + O(1/L^2)   (using dL/ds = -2)
 *           = 2 - 4/L + O(1/L^2).
 *
 * So the LEADING correction constant is c = 4 EXACTLY -- it is 2 x 2: the power
 * 2 on L in r ~ (log T0)^2 thr^2 (imp-34248 F2) times the slope |dL/d log thr|=2
 * of L = -2 log thr. It is NOT log(2pi); log(2pi) enters only the sub-leading
 * O(1/L^2) correction through M = L - lam.
 *
 * THE REFINED FINITE-L FORMULA (keeps the sub-leading log(2pi))
 * ------------------------------------------------------------
 * Carrying the M = L - lam and the RvM 1/(M-1), 1/L pieces exactly gives the
 * closed instantaneous-exponent correction (2 - r-exp) L = c_analytic(L):
 *
 *     c_analytic(L) = 4 L (L-lam) / ( [ (L-lam)^2 - 1 ] . B_D ),
 *     B_D = 1 - 1/L + 1/(L-lam-1).
 *
 * c_analytic(L) -> 4 as L -> infinity (4.19 at L=40, 4.04 at L=200, 4.004 at
 * L=2000) and matches the numerically-differentiated INSTANTANEOUS exponent of
 * the imp-34248 sub-terms to < 1e-3 for L >= 48 (the dropped O(1/L^2) terms leave
 * ~7e-3 at L ~ 39; see instantaneous ladder).
 *
 * WHY THE imp-34329 FIT READ c ~ 4.4 (secant finite-difference bias)
 * -----------------------------------------------------------------
 * imp-34329 tabulated SECANT local exponents over decade / two-decade windows,
 * not the instantaneous derivative. The secant of a curve whose slope is still
 * drifting biases (2 - r-exp) L upward by ~ +0.25-0.5 relative to the
 * instantaneous c_analytic, giving the ~4.4 reading. The least-squares c fit of
 * r-exp = 2 - c/L against the deep SECANT local exponents is c ~ 4.49 (matching
 * the imp-34329 ~4.4), while the same fit against the INSTANTANEOUS exponents is
 * c ~ 4.15 -- both descending toward the derived limit c = 4.
 *
 * SO the correction constant is derived: c = 4 (the true thr -> 0 limit), the
 * finite-L instantaneous value is c_analytic(L) = 4 L (L-lam)/([(L-lam)^2-1] B_D)
 * (log(2pi) appears only here, at sub-leading order), and the imp-34329 ~4.4 is
 * c = 4 plus its finite-L O(1/L) instantaneous lift plus a secant
 * finite-difference bias -- CONSISTENT with, and refining, r-exp -> 2 and
 * composite -> 3.
 *
 * HONEST SCOPE -- derivation/measurement ONLY, NO QED. This derives the
 * correction constant of the inherited imp-34248/imp-34174/imp-33743
 * extrapolation component model; it changes no bound and introduces no new
 * mathematical claim. The component model is NOT a rigorous asymptotic. E_flow
 * is the benign mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT
 * touch the divergent C_Lip collision-Gronwall. The C_mb GUE-conditional per
 * imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643)
 * is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity;
 * no refereed bound is changed.
 *
 * @see imp-34329-crossover-surplus-fartail-composite-limit (the r-exponent = 2 - c/log T0 fit with c ~ 4.4)
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (the r ~ (log T0)^2 thr^2 factorisation this differentiates)
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form surplus(thr))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const LAM = Math.log(TWO_PI); // lam = log(2pi) ~ 1.8379
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34248/imp-34329 exactly (~1.000237)

// EXACT imp-34248/imp-34329 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 200; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
function rOf(thr) {
  return eFlow(crossoverN(thr)) / E_TRUNC_PT;
}
function logT0of(thr) {
  return Math.log(effectiveHeightForN(crossoverN(thr)));
}

// ── Instantaneous r-exponent d log r / d log thr via a tiny central difference ──
function rExpInstant(thr) {
  const h = 1e-4;
  const s = Math.log(thr);
  const rp = Math.log(rOf(Math.exp(s + h)));
  const rm = Math.log(rOf(Math.exp(s - h)));
  return (rp - rm) / (2 * h);
}

// ── Refined analytic correction: c_analytic(L) = 4 L (L-lam)/([(L-lam)^2-1] B_D) ─
// Derived by carrying M = L - lam and the RvM 1/(M-1), 1/L pieces exactly; the
// LEADING term is c = 4 (log(2pi) only enters the sub-leading O(1/L^2) piece).
function cAnalytic(L) {
  const B_D = 1 - 1 / L + 1 / (L - LAM - 1);
  return (4 * L * (L - LAM)) / (((L - LAM) ** 2 - 1) * B_D);
}

// ── Deep-tail ladder: instantaneous r-exp vs analytic c vs the naive c = 4 ─────
const DEEP_THR = [1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12];
const INSTANTANEOUS_LADDER = DEEP_THR.map((thr) => {
  const L = logT0of(thr);
  const rExp = rExpInstant(thr);
  const cInst = (2 - rExp) * L; // measured instantaneous correction constant
  const cAn = cAnalytic(L); // closed-form prediction
  return {
    thr: +thr.toExponential(0),
    logT0: +L.toFixed(4),
    r_exponent_instant: +rExp.toFixed(5),
    c_instant: +cInst.toFixed(4),
    c_analytic: +cAn.toFixed(4),
    abs_resid_c: +Math.abs(cInst - cAn).toFixed(5),
  };
});

// ── Secant local exponents over the imp-34329 decade windows (reproduces ~4.4) ─
function localExp(a, b) {
  return Math.log(rOf(b) / rOf(a)) / Math.log(b / a);
}
const SECANT_LADDER = DEEP_THR.slice(1).map((thr, k) => {
  const a = DEEP_THR[k];
  const L = logT0of(thr);
  const rExp = localExp(a, thr);
  return {
    window: `${a.toExponential(0)}->${thr.toExponential(0)}`,
    logT0: +L.toFixed(2),
    r_exponent_secant: +rExp.toFixed(5),
    c_secant: +((2 - rExp) * L).toFixed(3),
  };
});

// ── Least-squares c of r-exp = 2 - c/L against each exponent series ────────────
// minimise sum ((2 - c/L) - rExp)^2 over c  =>  c = sum((2-rExp)/L) / sum(1/L^2).
function bestFitC(rows, expKey) {
  let num = 0;
  let den = 0;
  for (const row of rows) {
    const L = row.logT0;
    num += (2 - row[expKey]) / L;
    den += 1 / (L * L);
  }
  return num / den;
}
function rssC(rows, expKey, c) {
  return rows.reduce((s, row) => {
    const pred = 2 - c / row.logT0;
    return s + (pred - row[expKey]) ** 2;
  }, 0);
}
// Fit over the genuinely-deep rungs (log T0 >= 39, i.e. thr <= 1e-3); the thr=1e-2
// shoulder is not far-tail (the analytic O(1/L^2) drop is still ~0.5 there).
const DEEP_INST = INSTANTANEOUS_LADDER.filter((r) => r.logT0 >= 39);
const DEEP_SEC = SECANT_LADDER.filter((r) => r.logT0 >= 39);
const C_FIT_SECANT = bestFitC(DEEP_SEC, 'r_exponent_secant'); // ~4.49 (matches imp-34329 ~4.4)
const C_FIT_INSTANT = bestFitC(DEEP_INST, 'r_exponent_instant'); // ~4.15 (near the derived limit 4)
const RSS_SECANT_C4 = rssC(DEEP_SEC, 'r_exponent_secant', 4); // naive c=4 fits worse on secants
const RSS_SECANT_CFIT = rssC(DEEP_SEC, 'r_exponent_secant', C_FIT_SECANT);
const RSS_INSTANT_C4 = rssC(DEEP_INST, 'r_exponent_instant', 4);
const RSS_INSTANT_CFIT = rssC(DEEP_INST, 'r_exponent_instant', C_FIT_INSTANT);

export const IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION = {
  id: 'imp-34407',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-34329 far-tail composite-exponent correction constant c ~ 4.4 in ' +
    'r-exponent = 2 - c/log T0 analytically from the imp-34248/imp-34174 log-T0-softened r(thr) ' +
    'sub-terms (is it log(2pi), 2, or some combination?), and measure the residual of the c/log T0 ' +
    'form against the tabulated local exponents. Derivation/measurement only within the inherited ' +
    'component model; changes no bound; NO QED.',
  derivation:
    'r = B (M+1) L / T0 with L = log T0, M = log(T0/2pi) = L - lam, lam = log(2pi); the crossover ' +
    'N_cross = K_thr L mapped through N = (T0/2pi)(M-1) gives T0 = 2pi K_thr L/(M-1), whose leading ' +
    'balance is L = -2 log thr + const (the height grows ~thr^-2 with the L-dependence cancelling), ' +
    'so dL/d log thr -> -2. From log r = const + log(M+1) + log L - L this gives r-exp = 2 - 4/L + ' +
    'O(1/L^2): the LEADING constant is c = 4 EXACTLY (= 2 x 2, the power 2 on L in r ~ (log T0)^2 thr^2 ' +
    'times the slope 2 of L = -2 log thr), NOT log(2pi). The refined finite-L instantaneous form is ' +
    'c_analytic(L) = 4 L (L-lam)/([(L-lam)^2-1] B_D), B_D = 1 - 1/L + 1/(L-lam-1), in which log(2pi) ' +
    'enters ONLY the sub-leading correction; c_analytic -> 4 as L -> infinity.',
  leadingConstant: 4,
  isLogTwoPi: false,
  instantaneousLadder: INSTANTANEOUS_LADDER,
  secantLadder: SECANT_LADDER,
  fits: {
    best_fit_c_secant: +C_FIT_SECANT.toFixed(4), // ~4.49, reproduces imp-34329 ~4.4
    best_fit_c_instant: +C_FIT_INSTANT.toFixed(4), // ~4.15, closer to the derived limit 4
    rss_secant_c_naive_4: +RSS_SECANT_C4.toExponential(4),
    rss_secant_c_bestfit: +RSS_SECANT_CFIT.toExponential(4),
    rss_instant_c_naive_4: +RSS_INSTANT_C4.toExponential(4),
    rss_instant_c_bestfit: +RSS_INSTANT_CFIT.toExponential(4),
    note:
      'The imp-34329 ~4.4 is a SECANT (decade-window finite-difference) reading; the INSTANTANEOUS ' +
      'correction constant c_analytic(L) matches the numerically-differentiated exponent of the ' +
      'imp-34248 sub-terms to < 1e-3 for log T0 >= 48 and descends 4.18 -> 4.10 across log T0 = 39 -> 76, ' +
      'toward the derived thr -> 0 limit c = 4.',
  },
  finding: {
    F1_leading_constant_is_four:
      'The leading correction constant is c = 4 EXACTLY, derived as 2 x 2: the power 2 on L in ' +
      'r ~ (log T0)^2 thr^2 (imp-34248 F2) times the slope |dL/d log thr| = 2 of L = -2 log thr. It is ' +
      'NOT log(2pi) and NOT 2; log(2pi) enters only the sub-leading O(1/L^2) correction via M = L - log(2pi).',
    F2_refined_formula_matches_instantaneous:
      'The refined finite-L form c_analytic(L) = 4 L (L-lam)/([(L-lam)^2-1] B_D), B_D = 1 - 1/L + ' +
      '1/(L-lam-1), reproduces the numerically-differentiated INSTANTANEOUS r-exponent of the imp-34248 ' +
      'sub-terms to < 1e-3 for log T0 >= 48, and c_analytic -> 4 as log T0 -> infinity (4.04 at log T0 = 200).',
    F3_imp34329_44_is_secant_bias:
      'The imp-34329 ~4.4 fit is a secant finite-difference reading: the least-squares c of ' +
      'r-exp = 2 - c/log T0 is ~4.49 against the decade-window SECANT exponents but ~4.15 against the ' +
      'INSTANTANEOUS exponents -- both descend toward the derived limit c = 4, so r-exp -> 2 and ' +
      'composite -> 3 stand, with the true limiting constant c = 4 (not 4.4).',
  },
  limitingCorrectionConstant: 4,
  isRigorous: false,
  honestScope:
    'Derivation/measurement only within the inherited imp-34248/imp-34174/imp-33743 extrapolation ' +
    'component model; NO QED. The component model is NOT a rigorous asymptotic; E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; changes no bound; no refereed bound is changed.',
  citation:
    'imp-34329-crossover-surplus-fartail-composite-limit.js (the r-exponent = 2 - c/log T0 fit, c ~ 4.4); ' +
    'imp-34248-crossover-surplus-small-thr-asymptotic.js (the r ~ (log T0)^2 thr^2 factorisation); ' +
    'imp-34174-crossover-surplus-threshold-family-decay.js (closed form surplus(thr)); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION_ASSERTIONS = [
  {
    // F1: the derived leading constant is exactly 4, and the refined formula tends to 4.
    id: 'imp34407-leading-constant-is-four',
    description: 'the leading correction constant is the literal 4 (not log(2pi) ~ 1.838); c_analytic(L) -> 4 as L grows large',
    holds: () =>
      IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION.leadingConstant === 4 &&
      IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION.isLogTwoPi === false &&
      Math.abs(cAnalytic(200) - 4) < 0.05 &&
      Math.abs(cAnalytic(2000) - 4) < 0.01 &&
      cAnalytic(2000) < cAnalytic(200),
  },
  {
    // F2: the closed-form c_analytic reproduces the instantaneous exponent to < 1e-3 for logT0 >= 40.
    id: 'imp34407-analytic-matches-instantaneous',
    description: 'c_analytic(L) matches the numerically-differentiated instantaneous correction to < 1e-3 for logT0 >= 48, confirming the derivation (the dropped O(1/L^2) terms leave ~7e-3 only at logT0 ~ 39)',
    holds: () => {
      for (const row of INSTANTANEOUS_LADDER) {
        if (row.logT0 >= 48 && row.abs_resid_c > 1e-3) return false;
      }
      return true;
    },
  },
  {
    // F2b: the instantaneous correction constant descends toward 4 (4.19->4.10) as logT0 grows 30->76.
    id: 'imp34407-instant-c-descends-toward-4',
    description: 'the instantaneous c descends monotonically over logT0 = 39 -> 76 and stays in (4.0, 4.25), heading to the derived limit 4',
    holds: () => {
      const tail = INSTANTANEOUS_LADDER.filter((r) => r.logT0 >= 39);
      for (let i = 1; i < tail.length; i++) if (!(tail[i].c_instant < tail[i - 1].c_instant)) return false;
      return tail.every((r) => r.c_instant > 4.0 && r.c_instant < 4.25);
    },
  },
  {
    // F3: the SECANT best-fit c reproduces the imp-34329 ~4.4, while the INSTANTANEOUS best-fit is lower.
    id: 'imp34407-secant-fit-reproduces-44',
    description: 'the least-squares c on the deep decade-window secants is ~4.49 (reproduces imp-34329 ~4.4) and exceeds the instantaneous best-fit ~4.15',
    holds: () =>
      Math.abs(C_FIT_SECANT - 4.49) < 0.06 &&
      Math.abs(C_FIT_INSTANT - 4.15) < 0.06 &&
      C_FIT_SECANT > C_FIT_INSTANT,
  },
  {
    // Residual: the c/logT0 form fits the instantaneous exponents tightly (RSS small); on secants the
    // best-fit c beats the naive c=4 (that is why imp-34329 read ~4.4, not 4).
    id: 'imp34407-cform-residual-measured',
    description: 'the c/logT0 form residual is measured: deep-instant RSS < 5e-6 at the analytic-consistent fit, and on secants the best-fit c improves on naive c=4 (that is why imp-34329 read ~4.4, not 4)',
    holds: () =>
      RSS_INSTANT_CFIT < 5e-6 &&
      RSS_SECANT_CFIT < RSS_SECANT_C4 &&
      RSS_SECANT_CFIT < 1e-4,
  },
  {
    // Continuity with imp-34329: the secant r-exponents climb monotonically back toward 2 (all < 2).
    id: 'imp34407-continuity-with-imp34329',
    description: 'the secant r-exponents reproduce the imp-34329 monotone climb back toward 2 (1.876 -> 1.942, all < 2)',
    holds: () => {
      const re = SECANT_LADDER.map((r) => r.r_exponent_secant);
      for (let i = 1; i < re.length; i++) if (!(re[i] > re[i - 1])) return false;
      return re[0] > 1.87 && re[re.length - 1] > 1.94 && re[re.length - 1] < 2;
    },
  },
  {
    // Honesty gate: derivation/measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34407-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION.honestScope) &&
      /NO QED/.test(IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION.honestScope) &&
      /refereed bound is changed/i.test(IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION.honestScope),
  },
];

for (const a of IMP34407_FARTAIL_COMPOSITE_CORRECTION_CONSTANT_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34407-fartail-composite-correction-constant-derivation assertion failed: ${a.id}`);
  }
}
