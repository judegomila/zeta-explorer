/**
 * imp-95577 — Predicting the imp-95557 W(S) decay exponent from a node-SPREAD
 * metric, so the exponent is FIT rather than measured per family.
 *
 * BACKGROUND. imp-95557 measured the imp-95531 PD-persistence window
 *   W(S) = mu_S(0) / M1(S)
 * for three structured node families and reported that the leading log-linear
 * decay exponent c in W ~ exp(-c n) is NOT universal: c = 4.19 (arithmetic),
 * 4.52 (geometric r=1.5), and ~1.74 for the exponentially spread dyadic family
 * (with a poor R^2 = 0.87 because that decay CURVES / decelerates). imp-95557
 * concluded the exponent is "set by node SPREAD, not count" but left the exponent
 * measured-per-family, not predicted. This module supplies the predictor.
 *
 * KEY MOVE. The single global c is the WRONG object for the spread families:
 * their decay decelerates, so no single geometric exponent fits (imp-95557
 * R^2=0.87; imp-95576 later showed the nested-dyadic W actually PLATEAUS at
 * W_inf ~ 2.03e-6 and never crosses). The right object is the LOCAL, per-step
 * exponent between consecutive node counts,
 *   c_step(m) := ln( W(m-1) / W(m) )                                    (>= 0),
 * i.e. how much adding the m-th node contracts the window. We then fit c_step
 * against a per-step SPREAD COORDINATE: the log-position of the newest node,
 *   x(m) := ln( s_m ),   s_m = the m-th node = nu_m + 1/2.
 * (Mechanism: the Cauchy-Gram coupling of a node at s decays like 1/s, so a
 * far-out newest node barely perturbs the pencil and contracts W only weakly.)
 *
 * UNIFIED SPREAD LAW (pooled log-log least squares over ALL c_step points of the
 * three float64-resolvable families, x = ln s_new, y = ln c_step):
 *   ln c_step ~ b0 + b1 * ln s_new,   b1 ~ -0.71,  b0 ~ 2.49,  R^2 ~ 0.99
 *   i.e.  c_step ~ A * s_new^(-p),  A = e^b0 ~ 12.1,  p = -b1 ~ 0.71.
 * A SINGLE two-parameter spread-parametrized law predicts the per-step exponent
 * across arithmetic, geometric r=1.5 AND dyadic families (12 points, R^2 ~ 0.99).
 * The newest-node log-position is the spread statistic that unifies them; a
 * global mean-log-spacing metric (log-range / (n-1)) only ORDERS the families
 * (dense ~0.33 -> c ~ 4.2-4.5; dyadic ~0.64 -> c ~ 1.74) into two clusters and
 * cannot resolve the functional form, so the per-step coordinate is the better
 * predictor.
 *
 * WHY THIS RECONCILES imp-95557 AND imp-95576 (heuristic).
 *  - The per-family GLOBAL c is just the average of c_step over the node counts
 *    the family visits. Dense families keep s_new small (arithmetic s_new = n+1/2
 *    grows only linearly), so c_step stays high (~4) and the average c is high.
 *    The dyadic family pushes s_new = 2^(m-1) out geometrically, so c_step falls
 *    along the SAME spread law and the average c is dragged down -- exactly the
 *    imp-95557 4.2 vs 1.74 split, now from ONE law.
 *  - Summability decides crossing vs plateau. Along a family, the total residual
 *    log-drop is sum_m c_step(m) ~ A * sum_m s_m^(-p). For POLYNOMIAL spread
 *    (arithmetic s_m ~ m) this is A * sum m^(-0.71), which DIVERGES -> W -> 0 ->
 *    the collision threshold IS crossed (imp-95576: arithmetic crosses at n=8).
 *    For GEOMETRIC spread (dyadic s_m ~ 2^m) it is A * sum 2^(-0.71 m), which
 *    CONVERGES -> W tends to a POSITIVE plateau W_inf > 0 and NEVER crosses
 *    (imp-95576: nested dyadic plateaus at ~2.03e-6). The spread law thus
 *    predicts the crossing/plateau dichotomy, not just the exponent.
 *  - Order-of-magnitude plateau check: extrapolating the law from the last
 *    float64 dyadic row (W(8) = 2.7884e-6) gives residual drop sum_{m>=9} c_step
 *    ~ 0.62, so W_inf ~ W(8) * e^(-0.62) ~ 1.5e-6 -- same order as the imp-95576
 *    arbitrary-precision W_inf ~ 2.03e-6 (heuristic, within a factor ~1.3; the
 *    fitted p, A are only float64-range leading values).
 *
 * SCOPE / HONESTY. Report only; changes NO bound; NO QED; RH OPEN; no refereed bound is changed
 * . The fit uses the imp-95557 float64-resolvable rows only
 * (mu_S(0) > ~1e-9); the exponent p ~ 0.71 and prefactor A ~ 12.1 are the leading
 * values on that range, NOT certified constants -- extending them is the separate
 * imp-95576 arbitrary-precision axis. New sub-gap SPREAD-LAW-FORM: with three
 * families the two-parameter power law is well-fit (R^2 ~ 0.99) but finite-size
 * corrections and the true large-s_new exponent are under-determined; a denser
 * bank of geometric ratios r and Arb-precision c_step would pin the form.
 *
 * Import-free (baked imp-95557 float64 W rows; provenance in comments). The
 * assertions recompute c_step, the pooled log-log fit, the predictive check, and
 * the honesty record. Changes no bound; NO QED.
 */

// Node position s = nu + 1/2 of the m-th node (1-indexed), per family (matches
// imp-95557: dyadic nu=2^k, arithmetic nu=1..n, geometric nu=r^k, k=0-indexed).
export const dyadicS = (m) => 0.5 + 2 ** (m - 1);
export const arithmeticS = (m) => 0.5 + m;
export const geometricS = (r) => (m) => 0.5 + r ** (m - 1);

// imp-95557 float64-resolvable W(S) rows (mu_S(0) > ~1e-9), copied verbatim from
// src/data/imp-95557-w-decay-scaling.js IMP95557_LITERALS.tables. { n, W }.
export const W_TABLES = Object.freeze({
  arithmetic: [
    { n: 2, W: 1.5689e-1 }, { n: 3, W: 1.8424e-3 },
    { n: 4, W: 2.5504e-5 }, { n: 5, W: 5.6749e-7 },
  ],
  geometric15: [
    { n: 2, W: 1.1731e-1 }, { n: 3, W: 8.2692e-4 },
    { n: 4, W: 7.6856e-6 }, { n: 5, W: 1.5761e-7 },
  ],
  dyadic: [
    { n: 2, W: 1.5689e-1 }, { n: 3, W: 2.7478e-3 }, { n: 4, W: 1.3138e-4 },
    { n: 5, W: 2.2725e-5 }, { n: 6, W: 7.2595e-6 }, { n: 7, W: 3.9113e-6 },
    { n: 8, W: 2.7884e-6 },
  ],
});

// Per-step local exponent c_step(m) = ln(W(m-1)/W(m)) and the newest-node
// spread coordinate x = ln(s_m). Returns [{ nFrom, nTo, cStep, sNew, x, y }].
export function localExponents(rows, sOf) {
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const a = rows[i - 1], b = rows[i];
    const cStep = Math.log(a.W / b.W);
    const sNew = sOf(b.n);
    out.push({ nFrom: a.n, nTo: b.n, cStep, sNew, x: Math.log(sNew), y: Math.log(cStep) });
  }
  return out;
}

// Ordinary least squares of y on x. Returns { slope, intercept, r2, npts }.
export function olsFit(pts) {
  const m = pts.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const p of pts) { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; }
  const slope = (m * sxy - sx * sy) / (m * sxx - sx * sx);
  const intercept = (sy - slope * sx) / m;
  const ybar = sy / m;
  let ssr = 0, sst = 0;
  for (const p of pts) { const pred = intercept + slope * p.x; ssr += (p.y - pred) ** 2; sst += (p.y - ybar) ** 2; }
  const r2 = sst > 0 ? 1 - ssr / sst : 1;
  return { slope, intercept, r2, npts: m };
}

// mean log-spacing (log-range / (count-1)) of a family at its last resolvable n
export function meanLogSpacing(rows, sOf) {
  const nMax = rows[rows.length - 1].n;
  return Math.log(sOf(nMax) / sOf(1)) / (nMax - 1);
}

// Build the pooled point set and the unified spread-law fit.
const stepsArith = localExponents(W_TABLES.arithmetic, arithmeticS);
const stepsGeom = localExponents(W_TABLES.geometric15, geometricS(1.5));
const stepsDyad = localExponents(W_TABLES.dyadic, dyadicS);
const POOLED = [...stepsArith, ...stepsGeom, ...stepsDyad];
const FIT = olsFit(POOLED);
const A = Math.exp(FIT.intercept); // prefactor
const P = -FIT.slope;              // spread exponent

// predicted c_step from the unified law at a given newest-node position
export const predictCStep = (sNew) => A * sNew ** (-P);

export const IMP95577_LITERALS = Object.freeze({
  poolFit: { slope: FIT.slope, intercept: FIT.intercept, r2: FIT.r2, npts: FIT.npts, A, p: P },
  meanLogSpacing: {
    arithmetic: meanLogSpacing(W_TABLES.arithmetic, arithmeticS),
    geometric15: meanLogSpacing(W_TABLES.geometric15, geometricS(1.5)),
    dyadic: meanLogSpacing(W_TABLES.dyadic, dyadicS),
  },
  imp95557GlobalC: { arithmetic: 4.187, geometric15: 4.524, dyadic: 1.744 }, // from imp-95557
  dyadicPlateauCheck: (() => {
    // extrapolate the law past the last float64 dyadic row to estimate W_inf
    let drop = 0;
    for (let m = 9; m <= 40; m++) drop += predictCStep(dyadicS(m));
    const Winf = 2.7884e-6 * Math.exp(-drop);
    return { residualDrop: drop, WinfEstimate: Winf, imp95576Winf: 2.03e-6 };
  })(),
});

export const IMP95577_W_DECAY_SPREAD_LAW = Object.freeze({
  id: 'imp-95577-w-decay-spread-law',
  parent: 'imp-95557-w-decay-scaling',
  question: 'Can the imp-95557 W(S) decay exponent be predicted from a node-spread metric with a single spread-parametrized law, rather than measured per family?',
  method: 'Replace the ill-defined per-family GLOBAL exponent c (which decelerates for spread families) with the LOCAL per-step exponent c_step(m)=ln(W(m-1)/W(m)) and fit it against the newest-node log-position x=ln(s_m). Pool all c_step points of the arithmetic, geometric r=1.5 and dyadic families (imp-95557 float64 rows) and run a log-log least squares.',
  finding: 'A single two-parameter power law c_step ~ A*s_new^(-p) with A ~ 12.1 and p ~ 0.71 predicts the per-step exponent across all three families with pooled R^2 ~ 0.99 (12 points). The newest-node log-position is the unifying spread statistic; the imp-95557 per-family global-c split (4.19 / 4.52 / 1.74) is recovered as the average of c_step over the node positions each family visits (dense families keep s_new ~ n small so c_step stays ~4; the dyadic family pushes s_new ~ 2^m out so c_step falls along the same law). A global mean-log-spacing metric only orders the families into two clusters and cannot resolve the form.',
  reconciliation: 'The spread law also predicts imp-95576 crossing-vs-plateau: the total residual log-drop sum_m c_step ~ A*sum s_m^(-p) DIVERGES for polynomial spread (arithmetic s_m~m => W->0 => crosses at n=8) and CONVERGES for geometric spread (dyadic s_m~2^m => W plateaus at W_inf>0 => never crosses). Extrapolating from W(8)=2.79e-6 gives a residual drop ~0.62 and W_inf ~ 1.5e-6, same order as the imp-95576 arbitrary-precision plateau ~2.03e-6 (heuristic, factor ~1.3).',
  scope: 'Report only; changes NO bound. The fit uses the imp-95557 float64-resolvable rows (mu_S(0) > ~1e-9); p ~ 0.71 and A ~ 12.1 are leading values on that range, not certified constants. Extending them is the separate imp-95576 arbitrary-precision axis.',
  subgap: 'SPREAD-LAW-FORM: with three families the two-parameter power law is well-fit (R^2 ~ 0.99) but finite-size corrections and the true large-s_new exponent are under-determined; a denser bank of geometric ratios r and Arb-precision c_step would pin the functional form.',
  verdict: 'The W(S) decay exponent IS predictable from a node-spread metric: the per-step exponent follows a single power law c_step ~ 12.1*s_new^(-0.71) (pooled R^2 ~ 0.99) in the newest-node log-position, unifying the imp-95557 per-family exponents and the imp-95576 crossing/plateau dichotomy. Residual sub-gap SPREAD-LAW-FORM. Changes no bound; RH OPEN; no refereed bound is changed; NO QED.',
});

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const IMP95577_ASSERTIONS = [
  {
    id: 'imp95577-cstep-reproduce',
    description: 'per-step exponents reproduce: dyadic 7->8 c_step ~ 0.339, arithmetic 2->3 c_step ~ 4.44',
    holds: () => {
      const d = stepsDyad[stepsDyad.length - 1]; // 7->8
      const a = stepsArith[0]; // 2->3
      return relEq(d.cStep, 0.3385, 2e-2) && relEq(a.cStep, 4.444, 2e-2)
        && relEq(d.sNew, 128.5, 1e-9) && relEq(a.sNew, 3.5, 1e-9);
    },
  },
  {
    id: 'imp95577-pooled-powerlaw-fit',
    description: 'pooled log-log fit gives slope in [-0.85,-0.55] (p ~ 0.71), R^2 >= 0.95, 12 points',
    holds: () => FIT.npts === 12 && FIT.slope < -0.55 && FIT.slope > -0.85 && FIT.r2 >= 0.95,
  },
  {
    id: 'imp95577-prefactor',
    description: 'unified-law prefactor A = e^intercept is in [9,16]',
    holds: () => A >= 9 && A <= 16,
  },
  {
    id: 'imp95577-predictive-check',
    description: 'the single law predicts each family last-step c_step within 35% relative error',
    holds: () => {
      const ends = [stepsArith[stepsArith.length - 1], stepsGeom[stepsGeom.length - 1], stepsDyad[stepsDyad.length - 1]];
      return ends.every((e) => Math.abs(predictCStep(e.sNew) - e.cStep) <= 0.35 * e.cStep);
    },
  },
  {
    id: 'imp95577-dyadic-cstep-monotone-down',
    description: 'within the dyadic family c_step strictly decreases (larger newest-node spread => smaller exponent)',
    holds: () => stepsDyad.every((e, i) => i === 0 || stepsDyad[i - 1].cStep > e.cStep),
  },
  {
    id: 'imp95577-spread-orders-globalc',
    description: 'mean-log-spacing orders the families: dense (arith,geom) < dyadic, matching global-c dense>dyadic',
    holds: () => {
      const s = IMP95577_LITERALS.meanLogSpacing, g = IMP95577_LITERALS.imp95557GlobalC;
      return s.arithmetic < s.dyadic && s.geometric15 < s.dyadic && g.arithmetic > g.dyadic && g.geometric15 > g.dyadic;
    },
  },
  {
    id: 'imp95577-plateau-orderofmag',
    description: 'extrapolated dyadic plateau W_inf is a finite positive value within a factor 2 of the imp-95576 arbitrary-precision W_inf ~ 2.03e-6',
    holds: () => {
      const c = IMP95577_LITERALS.dyadicPlateauCheck;
      return c.WinfEstimate > 0 && c.WinfEstimate < c.imp95576Winf * 2 && c.WinfEstimate > c.imp95576Winf / 2;
    },
  },
  {
    id: 'imp95577-honesty',
    description: 'record states report-only scope, SPREAD-LAW-FORM sub-gap, RH OPEN, PT Lambda <= 0.2, NO QED',
    holds: () => /Report only; changes NO bound/.test(IMP95577_W_DECAY_SPREAD_LAW.scope)
      && /SPREAD-LAW-FORM/.test(IMP95577_W_DECAY_SPREAD_LAW.subgap)
      && /RH OPEN/.test(IMP95577_W_DECAY_SPREAD_LAW.verdict)
      && /refereed bound is changed/i.test(IMP95577_W_DECAY_SPREAD_LAW.verdict)
      && /NO QED/.test(IMP95577_W_DECAY_SPREAD_LAW.verdict),
  },
];
for (const a of IMP95577_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95577-w-decay-spread-law assertion failed: ${a.id}`);
}
export default IMP95577_W_DECAY_SPREAD_LAW;
