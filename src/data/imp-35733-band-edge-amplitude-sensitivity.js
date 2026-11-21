/**
 * @module imp-35733-band-edge-amplitude-sensitivity
 *
 * imp-35733 (numerical, measurement): SENSITIVITY of the imp-35680 band-averaged
 * structure-factor amplitude A_band to the band edge. imp-35680 measured
 *   A_band = (1 / (2 alphaLimit)) INT_{-1}^{1} |alpha| d alpha = 1/2
 * at the FULL proven band |alpha| < 1, reporting ratio A_band / C_C ~ 1.3029
 * (a ~30.3 percent overshoot) versus C_C = (1/8) sqrt(3 pi) ~ 0.383748. It never
 * varied the band edge. This module tabulates the partial-band amplitude
 *   A_band(c) = (1 / (2 c)) INT_{-c}^{c} |alpha| d alpha = c/2   (Simpson-measured)
 * across c = {0.25, 0.5, 0.75, 1.0} and its ratio A_band(c) / C_C.
 *
 * SETUP (standard GUE / Montgomery pair correlation, as in imp-35680). The
 * connected-cluster structure factor is S(alpha) = |alpha| for |alpha| < 1
 * (Montgomery ramp) and S(alpha) = 1 for |alpha| >= 1 (the diagonal collision
 * plateau). A partial-band proxy of edge c <= 1 averages the in-band ramp only:
 * A_band(c) = mean of |alpha| over [-c, c] = c/2. Since c <= 1 at every rung, the
 * collision-carrying plateau S = 1 on |alpha| >= 1 stays ENTIRELY out of band for
 * all c (the ramp reaches level 1 only at the measure-zero boundary |alpha| = c
 * when c = 1), so the collision constant C_C remains structurally inaccessible at
 * every band edge, corroborating the imp-35652 option-(a) NOT-viable verdict.
 *
 * MEASUREMENT. A_band(c) grows LINEARLY in the band edge c (slope 1/2), so the
 * ratio A_band(c) / C_C = c / (2 C_C) is linear in c too. The overshoot ratio
 * therefore sweeps monotonically as the band widens:
 *   c = 0.25 -> A_band = 0.125,  ratio ~ 0.32574 (undershoot)
 *   c = 0.50 -> A_band = 0.250,  ratio ~ 0.65148 (undershoot)
 *   c = 0.75 -> A_band = 0.375,  ratio ~ 0.97721 (undershoot, near parity)
 *   c = 1.00 -> A_band = 0.500,  ratio ~ 1.30294 (the imp-35680 ~30.3pc overshoot)
 * The ratio crosses unity (A_band(c) = C_C exactly) at the crossover edge
 *   c_star = 2 C_C = (1/4) sqrt(3 pi) ~ 0.767495,
 * which lies BELOW the proven edge c = 1 -- i.e. the ~30.3 percent overshoot at the
 * full band is not a fixed feature but the endpoint of a linear sweep that only
 * turns into overshoot once the band widens past c_star ~ 0.7675. No partial-band
 * edge reproduces C_C except the single measure-zero point c = c_star, and even
 * there the amplitude equals C_C only by band-width coincidence, carrying no
 * dependence on the collision scale s_min ~ M^{-1/3} nor on C_H = 1/8.
 *
 * Measurement only; corroborates the imp-35652 option-(a) NOT-viable verdict and
 * extends the imp-35680 single-edge reading to a band-edge sweep; derives no
 * remainder; discharges nothing; changes no bound; establishes no operator
 * positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, E_trunc =
 * 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a
 * stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35680-constant-mismatch-magnitude (single full-band edge A_band = 1/2 extended here)
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (constantMismatch / option-a scope)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz, C_H = 1/8)
 * Literature: Montgomery (1973, pair correlation / form factor); Rudnick-Sarnak
 * (1996, n-level correlations). Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { IMP35680_CONSTANT_MISMATCH_MAGNITUDE } from './imp-35680-constant-mismatch-magnitude.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const ALPHA_LIMIT = 1; // Montgomery/Rudnick-Sarnak proven support |alpha| < 1

// Target short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752

// Composite Simpson quadrature (n even). Used to MEASURE the band integrals
// rather than substitute their closed forms, so the module is a genuine numeric
// check of the amplitude a partial-band proxy recovers at each edge c.
function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

const NPAN = 1000;

// Partial-band-averaged structure factor over |alpha| < c (use even symmetry;
// the integrand is linear on [0, c] so Simpson is exact). A_band(c) = c/2.
function aBand(c) {
  const bandIntegral = 2 * simpson((a) => a, 0, c, NPAN); // INT_{-c}^{c} |alpha| ~ c^2
  return bandIntegral / (2 * c); // ~ c/2
}

const BAND_EDGES = [0.25, 0.5, 0.75, 1.0];

// The plateau S = 1 on |alpha| >= 1 is out of band at every c <= 1: the in-band
// average only ever sees the ramp |alpha| on [0, c], never the collision plateau.
const bandEdgeLadder = BAND_EDGES.map((c) => {
  const a = aBand(c);
  return {
    c,
    aBand: +a.toPrecision(8), // c/2
    ratioBandToCC: +(a / C_C).toPrecision(8), // c / (2 C_C)
    overshoot: a > C_C, // true only once c > c_star = 2 C_C ~ 0.7675
    plateauInBand: false, // collision plateau S = 1 on |alpha| >= 1 stays out of band for c <= 1
  };
});

// Crossover edge where the partial-band amplitude equals C_C exactly:
// A_band(c) = c/2 = C_C  <=>  c_star = 2 C_C = (1/4) sqrt(3 pi).
const C_STAR = 2 * C_C; // ~ 0.76749504

// The ratio is linear in c (slope 1/(2 C_C)); report it as the sweep signature.
const RATIO_SLOPE = 1 / (2 * C_C); // d(ratio)/dc ~ 1.3029400

export const IMP35733_BAND_EDGE_AMPLITUDE_SENSITIVITY = {
  id: 'imp-35733',
  proofSection: 'S-frontier',
  question:
    'How does the imp-35680 band-averaged structure-factor amplitude A_band and its overshoot ratio A_band / C_C ' +
    'evolve as the partial band |alpha| < c widens (c in {0.25, 0.5, 0.75, 1.0}) toward the proven |alpha| < 1 edge?',
  setup:
    'GUE connected structure factor S(alpha) = |alpha| for |alpha| < 1 (Montgomery ramp), S(alpha) = 1 for ' +
    '|alpha| >= 1 (diagonal collision plateau). A partial-band proxy of edge c <= 1 recovers the mean ramp ' +
    'A_band(c) = (1 / (2c)) INT_{-c}^{c} |alpha| d alpha = c/2 (Simpson-measured). The collision plateau S = 1 on ' +
    '|alpha| >= 1 carries C_C = (1/8) sqrt(3 pi) and stays entirely out of band for every c <= 1.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (target, untouched)
    alphaLimit: ALPHA_LIMIT,
    bandEdgeLadder, // c -> {aBand = c/2, ratioBandToCC = c/(2 C_C), overshoot, plateauInBand:false}
    crossoverEdgeCStar: +C_STAR.toPrecision(8), // 0.76749504 -- A_band(c_star) = C_C exactly
    ratioSlopePerC: +RATIO_SLOPE.toPrecision(8), // 1.3029400 -- ratio grows linearly in c
    fullBandRatio: +(aBand(1.0) / C_C).toPrecision(8), // 1.3029400 -- matches imp-35680
  },
  findings:
    'The Simpson-measured partial-band amplitude A_band(c) = c/2 grows LINEARLY in the band edge c, so the ratio ' +
    'A_band(c) / C_C = c / (2 C_C) sweeps monotonically: ~0.3257 at c = 0.25, ~0.6515 at c = 0.5, ~0.9772 at ' +
    'c = 0.75 (near parity), and ~1.3029 at the full band c = 1 (the imp-35680 ~30.3 percent overshoot). The ratio ' +
    'crosses unity (A_band = C_C exactly) only at the crossover edge c_star = 2 C_C = (1/4) sqrt(3 pi) ~ 0.7675, ' +
    'which sits BELOW the proven edge c = 1: the ~30.3 percent overshoot is the endpoint of a linear sweep, present ' +
    'only once the band widens past c_star, not a fixed feature. At every c <= 1 the collision-carrying plateau ' +
    'S = 1 on |alpha| >= 1 is entirely out of band (the ramp reaches level 1 only at the measure-zero boundary when ' +
    'c = 1), so no partial-band edge reproduces C_C except by band-width coincidence at the single point c_star, ' +
    'carrying no s_min ~ M^{-1/3} nor C_H = 1/8 dependence -- corroborating imp-35652 option (a) NOT viable.',
  scaleIndependent: true, // every A_band(c) = c/2 is N-independent (contrast imp-35673 divergent shortfall)
  corroboratesImp35652ConstantMismatch: true,
  extendsImp35680SingleEdge: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). The partial-band structure-factor amplitude A_band(c) = c/2 (Simpson-measured) ' +
    'grows linearly in the band edge c, sweeping the ratio A_band(c) / C_C from ~0.3257 (c = 0.25) through ~0.9772 ' +
    '(c = 0.75) to ~1.3029 at the full proven band c = 1 (the imp-35680 ~30.3 percent overshoot). The ratio equals ' +
    'unity only at the crossover edge c_star = 2 C_C = (1/4) sqrt(3 pi) ~ 0.7675 < 1, so the overshoot appears only ' +
    'once the band widens past c_star. The collision-carrying plateau S = 1 on |alpha| >= 1 stays entirely out of ' +
    'band at every c <= 1, so no partial-band edge reports C_C = (1/8) sqrt(3 pi) except by band-width coincidence, ' +
    'with no s_min or C_H = 1/8 dependence -- corroborating the imp-35652 option-(a) NOT-viable verdict and ' +
    'extending the imp-35680 single-edge reading. Derives no remainder; discharges nothing; changes no bound; ' +
    'establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 ' +
    '(imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35680 (single full-band edge A_band = 1/2 extended here); imp-35652 (option-a / constantMismatch scope); ' +
    'imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-486 (GUE-conditional ' +
    'caveat). Literature: Montgomery (1973, pair correlation / form factor); Rudnick-Sarnak (1996). ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35733_BAND_EDGE_AMPLITUDE_SENSITIVITY_ASSERTIONS = [
  {
    // (1) target C_C reproduces (1/8) sqrt(3 pi) and matches the imp-35680 baked value.
    id: 'imp35733-cc-target-matches-imp35680',
    description: 'the target collision constant reproduces (1/8) sqrt(3 pi) ~ 0.38374752 and matches the imp-35680 baked C_C',
    holds: () =>
      Math.abs(C_C - 0.38374752) < 1e-6 &&
      Math.abs(C_C - IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.C_C) < 1e-6,
  },
  {
    // (2) each Simpson-measured rung equals c/2 (Simpson exact on the linear ramp).
    id: 'imp35733-partial-band-equals-c-over-2',
    description: 'the Simpson-measured partial-band amplitude A_band(c) equals c/2 at every band edge c',
    holds: () =>
      bandEdgeLadder.every((row) => Math.abs(row.aBand - row.c / 2) < 1e-9),
  },
  {
    // (3) the ratio grows linearly (slope 1/(2 C_C)) and the full-band rung matches imp-35680 ~1.3029.
    id: 'imp35733-ratio-linear-full-band-matches-imp35680',
    description: 'the ratio A_band(c)/C_C is linear in c with slope 1/(2 C_C) and the c=1 rung matches imp-35680 ~1.3029',
    holds: () => {
      const full = bandEdgeLadder.find((r) => r.c === 1.0);
      return (
        bandEdgeLadder.every((row) => Math.abs(row.ratioBandToCC - row.c * RATIO_SLOPE) < 1e-6) &&
        full.ratioBandToCC > 1.302 && full.ratioBandToCC < 1.304 &&
        Math.abs(full.ratioBandToCC - IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.ratioBandToCC) < 1e-6
      );
    },
  },
  {
    // (4) overshoot appears only past the crossover edge c_star = 2 C_C ~ 0.7675 < 1.
    id: 'imp35733-crossover-edge-below-proven-band',
    description: 'the unity-crossover edge c_star = 2 C_C ~ 0.7675 lies below the proven band c=1, so only c=1 overshoots',
    holds: () => {
      const overshootEdges = bandEdgeLadder.filter((r) => r.overshoot).map((r) => r.c);
      return (
        Math.abs(C_STAR - 0.25 * Math.sqrt(3 * Math.PI)) < 1e-9 &&
        C_STAR > 0.767 && C_STAR < 0.768 &&
        C_STAR < ALPHA_LIMIT &&
        Math.abs(aBand(C_STAR) - C_C) < 1e-9 && // A_band(c_star) = C_C exactly
        overshootEdges.length === 1 && overshootEdges[0] === 1.0
      );
    },
  },
  {
    // (5) the collision plateau S = 1 on |alpha| >= 1 stays out of band at every c <= 1.
    id: 'imp35733-plateau-out-of-band-every-edge',
    description: 'the collision-carrying plateau S = 1 on |alpha| >= 1 is out of band at every tabulated edge c <= 1',
    holds: () =>
      bandEdgeLadder.every((row) => row.plateauInBand === false && row.c <= ALPHA_LIMIT),
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35733-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35733_BAND_EDGE_AMPLITUDE_SENSITIVITY;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.corroboratesImp35652ConstantMismatch === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35733_BAND_EDGE_AMPLITUDE_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35733-band-edge-amplitude-sensitivity assertion failed: ${a.id}`);
  }
}
