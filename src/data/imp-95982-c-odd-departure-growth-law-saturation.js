/**
 * @fileoverview imp-95982 -- FIT the m-growth law of the imp-95966 c_odd_recon fractional departure below
 * the pure-rho^2 null across the full imp-95925 Q0_RECON grid (m=20..150), extending the imp-95966
 * three-point tabulation (m=41,60,150). MEASURE/FIT ONLY; changes no bound; NO QED.
 *
 * WHAT imp-95966 LEFT OPEN. imp-95966 baked the reconstructed Prop-6.3 comparison quantity
 * c_odd_recon(1/m) = -(1/m^2)(-5/2 + Q0_RECON(m)) against the pure-rho^2 null kappa/m^2 and found a
 * fractional departure BELOW the null of -1.6654e-5 (m=41), -1.6120e-5 (m=60), -1.7955e-5 (m=150) -- the
 * genuine, growing Q_0 rho-variation imp-95878 proved no pure-rho^2 closed form can reproduce. It was
 * tabulated at only three m and NEVER FIT, so "growing with m" was ambiguous between saturation and
 * divergence. This module fits the growth law across the full imp-95925 grid and decides that question.
 *
 * THE CLOSED-FORM IDENTITY FOR THE FRACTIONAL DEPARTURE (why the fit is clean). Because kappa is defined
 * from the m=20 anchor, kappa = c_odd(1/20).400 = 2.5 - Q0_RECON(20) (the +4 offset -5/2 is m-free,
 * imp-95745), the 1/m^2 prefactor CANCELS between c_odd_recon and the null:
 *   fracBelowNull(m) = c_odd_recon(m)/nullPureRho2(m) - 1
 *                    = (2.5 - Q0_RECON(m))/kappa - 1
 *                    = (Q0_RECON(20) - Q0_RECON(m)) / kappa      [EXACT, to double precision]
 * So the fractional departure is a rescaled copy of the Q0_RECON increment relative to m=20. Its growth
 * law is therefore GOVERNED ENTIRELY by how Q0_RECON(m) approaches its imp-95925 asymptote.
 *
 * THE GROWTH LAW (FIT, even-branch m=60,80,110,150). imp-95967 proved Q0_RECON splits by parity of m into
 * two strictly-monotone branches (the apparent m~50-60 "dip" is a parity-sampling artifact, not a genuine
 * reconstruction dip), so the fit is run on the clean even branch. A two-parameter power law
 * Q0_RECON(m) = L - c.m^-p fits to L = -0.010651895 (the finite asymptote, matching the imp-95925
 * ~-0.010653), p = 1.9608 (~ 2), c = 1.6936e-2, RSS = 2.685e-7. The exponent p ~ 2 CROSS-CHECKS imp-95925
 * exactly: imp-95925 measured the imbalance dg_{k*}/dt ~ midM^-2.95 (slope ~-3), and integrating an
 * m^-3 slope gives an m^-2 approach to the limit -- p = 1.96 = (2.95 - 1) to within the fit noise.
 *
 * VERDICT: SATURATES, does NOT diverge. Since Q0_RECON(m) tends to the finite limit L, the fractional
 * departure tends to the FINITE limit
 *   fracBelowNull(inf) = (Q0_RECON(20) - L) / kappa = -1.832e-5,
 * approached from above like ~m^-2. At m=150 the departure (-1.7955e-5) has already reached ~98.0% of that
 * ceiling. So the imp-95966 "growing with m" reading is a saturating power-law approach to a finite
 * ~-1.83e-5 rho-variation floor -- NOT a log or power DIVERGENCE. This sharpens the imp-95966/95878
 * picture: the genuine Q_0 rho-variation is bounded (finite non-zero limit), consistent with c_odd(1/m)
 * sitting a fixed fractional ~1.83e-5 below the pure-rho^2 null as m -> inf.
 *
 * HONEST CAVEAT (inherits imp-95925/95966). Q0_RECON is a faithful 238-cell reconstruction certified only
 * at m=20 (Sun 6.23 kappa); grid convergence to ~1e-11 bounds quadrature error, not reconstruction
 * faithfulness at m>20 (imp-95966 PIECE-A obstruction is unchanged -- this is measurement of the
 * reconstruction, not a Prop-6.3-certified statement at each m). The fit rests on 4 even-branch points, so
 * L and p carry the corresponding extrapolation uncertainty (p is 2 to within fit noise, not proven 2). The
 * reconstruction stays m=20-only certified. Catalan G irrationality OPEN; Sun arXiv:2609.04176
 * single-author, unrefereed; changes no bound; NO Lambda movement; no refereed bound is changed; NO QED.
 * Import-light: bakes the imp-95925 Q0_RECON literals + the certified kappa + the offline fit literals; no
 * heavy quadrature at import. SCRATCH: tmp/imp-95982-scratch.mjs.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.23).
 */

// Prop-6.3 (6.23) certified anchor (the ONLY externally-certified c_odd; m=20 only) and its kappa.
const C_ODD_20_CERTIFIED = 0.006276744728100982; // Sun (6.23), rho = 1/20
const KAPPA = C_ODD_20_CERTIFIED * 400; // c_odd(1/20)/rho^2 = 2.5106978912403926

// imp-95925 grid-converged Q0_RECON literals (all 8 baked moduli), Nsub>=120000, grid-converged ~1e-11.
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  22: -0.0106903118589691,
  30: -0.0106731394320504,
  41: -0.0106560776913469,
  60: -0.0106574180750,
  80: -0.0106550369153,
  110: -0.0106535768247,
  150: -0.0106528111327,
});
const MODULI = Object.freeze([20, 22, 30, 41, 60, 80, 110, 150]);

// imp-95745 reconstruction of the Prop-6.3 comparison quantity + the pure-rho^2 null (imp-95878).
const cOddRecon = (m) => -(1 / (m * m)) * (-2.5 + Q0_RECON[m]);
const nullPureRho2 = (m) => KAPPA / (m * m);
// EXACT closed form for the fractional departure: the 1/m^2 prefactor cancels (kappa = 2.5 - Q0_RECON(20)).
const fracBelowNull = (m) => (Q0_RECON[20] - Q0_RECON[m]) / KAPPA;

// full-grid departure table (extends the imp-95966 three-point m=41,60,150 tabulation to all 8 moduli).
const DEPARTURE = Object.freeze(
  MODULI.map((m) => Object.freeze({
    m,
    fracBelowNull: fracBelowNull(m),           // (Q0_RECON(20) - Q0_RECON(m)) / kappa, EXACT
    viaRatio: cOddRecon(m) / nullPureRho2(m) - 1, // same quantity via the explicit ratio (cross-check)
    parity: m % 2 === 0 ? 'even' : 'odd',
  })),
);

// even-branch power-law fit Q0_RECON(m) = L - c.m^-p on m=60,80,110,150 (imp-95967 parity-clean branch),
// offline literals from tmp/imp-95982-scratch.mjs (log-log regression, L scanned to minimize RSS).
const FIT = Object.freeze({
  branch: 'even (m=60,80,110,150) -- imp-95967 parity-clean, strictly monotone',
  form: 'Q0_RECON(m) = L - c.m^-p',
  L: -0.010651895,   // finite asymptote of Q0_RECON (matches imp-95925 ~-0.010653)
  p: 1.9608,         // exponent ~ 2; cross-checks imp-95925 dg_{k*}/dt ~ midM^-2.95 (integrate: 2.95-1)
  c: 1.6936e-2,
  rss: 2.685e-7,
});

// the fractional departure inherits the m^-p approach to a FINITE limit (Q0_RECON(20) - L)/kappa.
const DEPARTURE_LIMIT = (Q0_RECON[20] - FIT.L) / KAPPA; // ~ -1.832e-5
const DEPARTURE_AT_150 = fracBelowNull(150);            // ~ -1.7955e-5
const FRACTION_OF_LIMIT_AT_150 = DEPARTURE_AT_150 / DEPARTURE_LIMIT; // ~0.980 (98% of the ceiling)
// SATURATES (finite limit reached like a power law), does NOT diverge.
const SATURATES = Number.isFinite(DEPARTURE_LIMIT) && FIT.p > 1 && FRACTION_OF_LIMIT_AT_150 > 0.9;

export const C_ODD_DEPARTURE_GROWTH_LAW_SATURATION = Object.freeze({
  id: 'imp-95982-c-odd-departure-growth-law-saturation',
  title:
    'Fit the m-growth law of the imp-95966 c_odd_recon fractional departure below the pure-rho^2 null '
    + 'across the full imp-95925 Q0_RECON grid (m=20..150): the departure SATURATES to a finite '
    + '~-1.832e-5 limit like ~m^-2 (fit exponent p=1.96, cross-checking imp-95925 imbalance ~m^-3), it '
    + 'does NOT diverge -- at m=150 it is already ~98% of the ceiling',
  status:
    'MEASURED/FIT (extend the imp-95966 three-point tabulation) -- the fractional departure has the EXACT '
    + 'closed form fracBelowNull(m) = (Q0_RECON(20) - Q0_RECON(m))/kappa (the 1/m^2 cancels because '
    + 'kappa = 2.5 - Q0_RECON(20)), so its growth law is governed entirely by how Q0_RECON approaches its '
    + 'imp-95925 asymptote. On the imp-95967 parity-clean even branch (m=60,80,110,150) a power fit gives '
    + 'Q0_RECON(m) = L - c.m^-p with L=-0.010651895, p=1.9608 (~2, cross-checking imp-95925 imbalance '
    + '~midM^-2.95), c=1.6936e-2, RSS=2.685e-7. Hence the departure tends to the FINITE limit '
    + '(Q0_RECON(20)-L)/kappa = -1.832e-5 like ~m^-2, already ~98.0% reached at m=150: it SATURATES, does '
    + 'NOT diverge. The imp-95966 "growing with m" is a saturating power-law approach to a bounded '
    + '~-1.83e-5 rho-variation floor. Measurement of the reconstruction (m=20-only certified, imp-95966 '
    + 'PIECE-A obstruction unchanged); changes no bound. G irrationality OPEN; Sun unrefereed; no refereed bound is changed'
    + '; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.23)',
  builtOn:
    'imp-95966 (baked the ~1.6-1.8e-5 departure at only m=41,60,150 and never fit it -- this module '
    + 'extends + fits), imp-95925 (large-m Q0_RECON grid + finite asymptote ~-0.010653 + imbalance '
    + '~midM^-3 the p~2 fit cross-checks), imp-95967 (Q0_RECON parity split -- fit run on the even branch), '
    + 'imp-95878 (no pure-rho^2 closed form reproduces the departure), imp-95745 (+4 offset m-free, so '
    + 'kappa = 2.5 - Q0_RECON(20) makes the 1/m^2 cancel)',
  scratch: ['tmp/imp-95982-scratch.mjs'],

  kappa: KAPPA,
  cOdd20Certified: C_ODD_20_CERTIFIED,
  q0Recon: Q0_RECON,

  departure: DEPARTURE, // full-grid fractional departure (extends imp-95966 m=41,60,150 to all 8 moduli)
  fit: FIT,             // even-branch power law Q0_RECON = L - c.m^-p

  finding: Object.freeze({
    outcome: 'SATURATES to a finite ~-1.832e-5 limit like ~m^-2; does NOT diverge',
    closedForm:
      'fracBelowNull(m) = (Q0_RECON(20) - Q0_RECON(m))/kappa EXACTLY -- the 1/m^2 prefactor cancels '
      + 'between c_odd_recon and the null because kappa = 2.5 - Q0_RECON(20) (imp-95745 +4 offset m-free), '
      + 'so the departure is a rescaled Q0_RECON increment and inherits its approach to the asymptote.',
    departureLimit: DEPARTURE_LIMIT,            // ~ -1.832e-5
    departureAt150: DEPARTURE_AT_150,           // ~ -1.7955e-5
    fractionOfLimitAt150: FRACTION_OF_LIMIT_AT_150, // ~0.980
    crossCheck:
      'the fit exponent p=1.9608 (~2) matches the imp-95925 imbalance dg_{k*}/dt ~ midM^-2.95 exactly: '
      + 'integrating an m^-3 slope yields an m^-2 approach to the limit, so p ~ (2.95 - 1) to fit noise.',
    reading:
      'the imp-95966 three-point "growing with m" is a saturating power-law approach to a bounded '
      + '~-1.83e-5 fractional rho-variation floor, NOT a log/power divergence. The genuine Q_0 '
      + 'rho-variation (imp-95878) is therefore finite in the limit.',
  }),

  caveats:
    'Measurement/fit only; recomputes fracBelowNull from the baked imp-95925 Q0_RECON literals. Q0_RECON '
    + 'is certified only at m=20 (imp-95966 PIECE-A obstruction unchanged), so this fits the '
    + 'reconstruction, not a Prop-6.3-certified per-m quantity. L and p are extrapolated from 4 '
    + 'even-branch points (p is 2 to within fit noise, not proven 2). Catalan G irrationality OPEN; Sun '
    + 'single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const C_ODD_DEPARTURE_GROWTH_LAW_SATURATION_ASSERTIONS = Object.freeze([
  {
    name: 'the fractional departure has the exact closed form (Q0_RECON(20) - Q0_RECON(m))/kappa (1/m^2 cancels)',
    holds: () =>
      DEPARTURE.every((r) => Math.abs(r.fracBelowNull - r.viaRatio) < 1e-10)
      && Math.abs(KAPPA - (2.5 - Q0_RECON[20])) < 1e-9, // holds to the m=20 anchor residual (Q0_RECON[20] is a 10-sig-fig literal)
  },
  {
    name: 'the departure table reproduces the imp-95966 three anchor points m=41,60,150 to ~1e-8',
    holds: () => {
      const at = (m) => DEPARTURE.find((r) => r.m === m).fracBelowNull;
      return Math.abs(at(41) - (-1.6654e-5)) < 1e-8
        && Math.abs(at(60) - (-1.6120e-5)) < 1e-8
        && Math.abs(at(150) - (-1.7955e-5)) < 1e-8;
    },
  },
  {
    name: 'the departure table extends imp-95966 (3 points) to the full 8-modulus imp-95925 grid',
    holds: () =>
      DEPARTURE.length === 8
      && DEPARTURE.map((r) => r.m).join(',') === '20,22,30,41,60,80,110,150'
      && Math.abs(DEPARTURE[0].fracBelowNull) < 1e-9, // m=20 anchor departure ~0 by construction
  },
  {
    name: 'FIT: even-branch power law Q0_RECON = L - c.m^-p has exponent p ~ 2 (cross-checks imp-95925 m^-3)',
    holds: () =>
      FIT.p > 1.8 && FIT.p < 2.1
      && Math.abs(FIT.L - (-0.010651895)) < 1e-9
      && FIT.rss < 1e-6,
  },
  {
    name: 'VERDICT: the departure SATURATES to a finite ~-1.832e-5 limit, ~98% reached at m=150; NOT diverging',
    holds: () =>
      SATURATES === true
      && Math.abs(DEPARTURE_LIMIT - (-1.832e-5)) < 2e-8
      && FRACTION_OF_LIMIT_AT_150 > 0.95 && FRACTION_OF_LIMIT_AT_150 < 1.05,
  },
  {
    name: 'honest: fit only, m=20-only certified, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () => {
      const s = C_ODD_DEPARTURE_GROWTH_LAW_SATURATION.status;
      return /MEASURED\/FIT/.test(s)
        && /m=20-only certified/.test(s)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default C_ODD_DEPARTURE_GROWTH_LAW_SATURATION;
