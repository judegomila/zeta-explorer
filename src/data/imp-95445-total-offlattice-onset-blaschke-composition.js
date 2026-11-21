/**
 * imp-95445: MEASUREMENT of the TRUE combined off-lattice every-octave onset,
 * composing the imp-95374 RZ-PEN symbol-pencil FLOOR degradation with the
 * imp-95253 SPLIT-LOO numerator/Blaschke drift on ONE common off-lattice draw.
 *
 * WHY THIS IS NOT imp-95429. The sibling imp-95429 already combined the
 * imp-95374 floor with a numerator drift, but it modelled the numerator with
 * a coalLaw-at-perturbed-rate PROXY (coalLaw evaluated at the jittered octave
 * base rate nu_k), NOT with the imp-95253 leg the ticket names. The imp-95253
 * SPLIT-LOO / COROLLARY EV-OCT certificate prices the numerator drift through
 * the Phi_k BLASCHKE cross-factor fence Phi_k = prod ((a-b)/(a+b))^2 over the
 * leave-one-out cross pairs -- a separation-pricing mechanism (adjacent octave
 * sites nearly colliding shrink Phi_k) that is DISTINCT from imp-95429 coalLaw
 * proxy (smallest-rate downward jitter inflating coalLaw(nu_0 x)). This module
 * evaluates the ACTUAL imp-95253 Blaschke certificate on the SAME draw that
 * imp-95429 used, so the two legs are composed on a common protocol and the
 * TRUE combined onset -- the depth at which EITHER certificate fires, i.e. the
 * min of the two architectures -- is quantified rather than each leg being read
 * in isolation. MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT. Two valid upper-bound certificates on the SAME model every-octave
 * Lambda coexist off the geometric dyadic skeleton:
 *   RZ-PEN (imp-95374 / imp-95429): Lambda <= [sum_k coalLaw(nu_k x)] / A,
 *     A = inf lam_min of the seam symbol pencil (the FLOOR that degrades);
 *   SPLIT-LOO (imp-95250 / imp-95253): sqrt(Lambda) <=
 *     sum_k sqrt( coalLaw(s_k x) / Phi_k ), Phi_k the leave-one-out Blaschke
 *     fence on the actual perturbed rates (the NUMERATOR/Blaschke drift).
 * Each certificate FIRES (proves the every-octave bound) at the depth where it
 * first drops below 1; the frontier is free to use whichever fires shallower,
 * so the TRUE combined off-lattice onset is the MIN of the two firing depths.
 *
 * PROTOCOL. Identical off-lattice draw to imp-95429 / imp-95374: m = 8 octave
 * twin blocks, ln nu_k = k ln 2 + U_k with U_k uniform in [-delta, delta] from
 * the SAME deterministic mulberry32 seed 0xc0ffee ^ round(delta 1e6), in-block
 * ratio ln r_k uniform in (ln(1.3)/2, ln(1.3)], five jitter magnitudes delta
 * in {2^-6 .. 2^-2}, 400 trials each. For every trial the SAME 8 twin-pair
 * draw feeds the imp-95253 SPLIT-LOO closed certificate certClosed (PURE
 * arithmetic -- coalLaw and the Blaschke fence Phi_k, no eigensolver, hence
 * fully reproducible across V8). The worst-of-400 SPLIT-LOO onset is bisected
 * per delta. The imp-95429 RZ-PEN worst-of-400 TOTAL onsets are carried as
 * baked reference literals (that module runs a 400-trial pencil sweep in its
 * own assertions; re-importing it is avoided per the heavy-assertion-module
 * rule). The SPLIT-LOO onsets are measured against the m = 8 SPLIT-LOO lattice
 * baseline 11.785532 (blocks {2^k, 1.3 2^k}) so the finite-m gap cancels within
 * the SPLIT-LOO leg, exactly as imp-95429 quotes RZ-PEN shifts against its own
 * 12.220244 lattice baseline.
 *
 * FINDING 1 (the SPLIT-LOO Blaschke leg BINDS the true combined onset at every
 * jitter magnitude). The worst-of-400 firing depths on the common draw:
 *   delta      splitLooOnset   rzpenTotal(imp-95429)   combined = min
 *   2^-6  (1.56%)  12.372922       12.624714            12.372922 (SPLIT-LOO)
 *   2^-5  (3.13%)  12.417797       13.008461            12.417797 (SPLIT-LOO)
 *   2^-4  (6.25%)  12.608776       13.802908            12.608776 (SPLIT-LOO)
 *   2^-3  (12.5%)  13.289128       15.890572            13.289128 (SPLIT-LOO)
 *   2^-2  (25.0%)  15.975033       23.451627            15.975033 (SPLIT-LOO)
 * At EVERY delta the imp-95253 Blaschke certificate fires strictly SHALLOWER
 * than the imp-95429 RZ-PEN total, so the true combined every-octave onset is
 * the SPLIT-LOO leg throughout this band.
 *
 * FINDING 2 (imp-95429 RZ-PEN total is a substantial OVER-estimate of the true
 * combined onset). The combined onset undercuts the imp-95429 RZ-PEN total by
 *   -0.252 / -0.591 / -1.194 / -2.601 / -7.477 depth units
 * at delta = 2^-6 .. 2^-2 -- i.e. the RZ-PEN total over-states the true
 * combined firing depth by ~2% at mild jitter, widening to ~32% (7.5 depth
 * units) at +-25%, because the RZ-PEN floor collapses in a near-collision
 * draw while the SPLIT-LOO Blaschke fence, sharing that same near-collision,
 * degrades far more gently.
 *
 * FINDING 3 (the SPLIT-LOO combined onset rises monotonically and smoothly,
 * with NO near-collision cliff over this band). The SPLIT-LOO onset shift vs
 * its 11.785532 lattice baseline is
 *   +0.587 / +0.632 / +0.823 / +1.504 / +4.190 depth units
 * at delta = 2^-6 .. 2^-2 -- monotone increasing and finite even at +-25%,
 * where the RZ-PEN floor-driven shift blows out to +9.19 (imp-95429 FINDING 1).
 * So composing the two legs REPLACES the imp-95429 floor-collapse tail with the
 * gentler Blaschke-fence tail wherever the SPLIT-LOO certificate is available.
 *
 * HONEST SCOPE / LIMITS. (a) Measurement of two MODEL certificates and their
 * every-octave onsets only; supplies NO off-lattice floor/onset THEOREM and
 * changes NO Lambda bound. (b) Worst-of-400 is a finite-sample lower bound on
 * the true worst case; the SPLIT-LOO column recomputes to full precision from
 * the shared imp-95429 mulberry32 draw, and the RZ-PEN column is imp-95429
 * baked worst-of-400. (c) The two certificates use DIFFERENT model Gram
 * conventions (RZ-PEN sech-half normalised pencil; SPLIT-LOO Cauchy/Blaschke),
 * so "min" is a firing-depth comparison of two independent valid upper bounds
 * on the same Lambda, not an algebraic combination; a genuinely unified single
 * certificate is NOT claimed. (d) Finite m = 8; each leg is shifted against its
 * OWN m = 8 lattice baseline so the finite-m gap cancels within the leg. (e)
 * The imp-95429 +-25% RZ-PEN total inherits that module near-float-noise floor
 * status (min floor 4.69e-16); the SPLIT-LOO onset there is pure-arithmetic and
 * exact. (f) gammaSL obligation (3), signed WEIGHT / modulus-phase legs and the
 * imp-95212 envelope port all remain OPEN. NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record (SPLIT-LOO column recomputed by the assertions below;
// RZ-PEN column is imp-95429 baked worst-of-400 total onset)
// ---------------------------------------------------------------------------

export const IMP95445_TOTAL_OFFLATTICE_ONSET_BLASCHKE_COMPOSITION = {
  id: "imp-95445",
  title:
    "True combined off-lattice every-octave onset: imp-95374 RZ-PEN floor " +
    "degradation composed with the imp-95253 SPLIT-LOO numerator/Blaschke " +
    "drift on one common draw (m = 8, delta in {2^-6..2^-2}, worst-of-400)",
  object:
    "two valid every-octave certificates coexist off-lattice -- RZ-PEN " +
    "Lambda <= [sum_k coalLaw(nu_k x)]/A (imp-95429) and SPLIT-LOO " +
    "sqrt(Lambda) <= sum_k sqrt(coalLaw(s_k x)/Phi_k) (imp-95253, Phi_k the " +
    "leave-one-out Blaschke fence); the true combined onset is the MIN firing " +
    "depth, since the frontier may use whichever certificate fires shallower",
  splitLooBaselineM8: 11.785532466078593,
  rzpenBaselineM8: 12.220243786987574,
  rows: [
    {
      delta: 0.015625,
      splitLooOnset: 12.372921623582751,
      rzpenTotalOnset: 12.624714460092427,
      combinedOnset: 12.372921623582751,
      binds: "split-loo",
      splitLooShift: 0.5873891575041581,
      rzpenOverEstimate: 0.2517928365096757,
    },
    {
      delta: 0.03125,
      splitLooOnset: 12.41779657712189,
      rzpenTotalOnset: 13.008460763944047,
      combinedOnset: 12.41779657712189,
      binds: "split-loo",
      splitLooShift: 0.6322641110432974,
      rzpenOverEstimate: 0.5906641868221569,
    },
    {
      delta: 0.0625,
      splitLooOnset: 12.608775637739516,
      rzpenTotalOnset: 13.802908251614674,
      combinedOnset: 12.608775637739516,
      binds: "split-loo",
      splitLooShift: 0.8232431716609232,
      rzpenOverEstimate: 1.1941326138751579,
    },
    {
      delta: 0.125,
      splitLooOnset: 13.289128103782062,
      rzpenTotalOnset: 15.890571646374998,
      combinedOnset: 13.289128103782062,
      binds: "split-loo",
      splitLooShift: 1.5035956377034693,
      rzpenOverEstimate: 2.601443542592936,
    },
    {
      delta: 0.25,
      splitLooOnset: 15.975032673107545,
      rzpenTotalOnset: 23.45162691545997,
      combinedOnset: 15.975032673107545,
      binds: "split-loo",
      splitLooShift: 4.189500207028952,
      rzpenOverEstimate: 7.476594242352425,
    },
  ],
  honestScope:
    "measurement of two model certificates and their every-octave onsets " +
    "only; supplies NO off-lattice floor or onset theorem and changes no " +
    "Lambda bound; worst-of-400 is a finite-sample lower bound (SPLIT-LOO " +
    "column recomputed from the shared imp-95429 mulberry32 draw, RZ-PEN " +
    "column imp-95429 baked); the two legs use different model Gram " +
    "conventions so min is a firing-depth comparison of two independent valid " +
    "upper bounds, NOT a unified single certificate; each leg shifted against " +
    "its own m = 8 lattice baseline; the +-25% RZ-PEN total inherits the " +
    "imp-95429 near-float-noise status; gammaSL obligation (3), signed WEIGHT " +
    "/ modulus-phase and the imp-95212 envelope port remain OPEN",
  verdict:
    "MEASUREMENT: composing the imp-95374 RZ-PEN floor with the ACTUAL " +
    "imp-95253 SPLIT-LOO Blaschke numerator drift (not the imp-95429 coalLaw " +
    "proxy) on the common off-lattice draw, the SPLIT-LOO Blaschke certificate " +
    "fires strictly SHALLOWER at every jitter magnitude, so it BINDS the true " +
    "combined every-octave onset throughout +-1.56%..+-25% (12.37..15.98 " +
    "depth). The imp-95429 RZ-PEN total therefore OVER-estimates the true " +
    "combined firing depth by 0.25..7.48 depth units (~2%..32%): the Blaschke " +
    "fence degrades gently (shift +0.59..+4.19, no cliff) where the RZ-PEN " +
    "floor collapses in near-collision draws. Changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (import-light: no imports; the SPLIT-LOO
// certificate is pure arithmetic, hence fully reproducible across V8)
// ---------------------------------------------------------------------------

const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
const phiFence = (n1, n2) => {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return p;
};
// mulberry32, identical to imp-95429 prng
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// identical draw order to imp-95429 offLatticeDraw: m octave twin pairs
function offLatticeDraw(m, delta, rand, rBase) {
  const nus = [];
  const lnrMax = Math.log(rBase);
  for (let k = 0; k < m; k++) {
    const base = Math.exp(k * Math.LN2 + delta * (2 * rand() - 1));
    const lnr = lnrMax * (0.5 + 0.5 * rand());
    nus.push(base, base * Math.exp(lnr));
  }
  return nus;
}
const toBlocks = (nus) => {
  const b = [];
  for (let k = 0; k < nus.length; k += 2) b.push([nus[k], nus[k + 1]]);
  return b;
};
// imp-95253 COROLLARY EV-OCT closed SPLIT-LOO certificate on the actual rates
function certClosed(blocks, x) {
  let s = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    s += Math.sqrt(coalLaw(blocks[k][0] * x) / phiFence(blocks[k], rest));
  }
  return s * s;
}
// firing depth of one config: smallest x in [1,60] with certClosed < 1
function cfgOnset(blocks) {
  let lo = 1;
  let hi = 60;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (certClosed(blocks, mid) > 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
// worst-of-T SPLIT-LOO onset on the shared imp-95429 draw
function splitLooWorstOnset(delta, T = 400) {
  const rand = prng(0xc0ffee ^ Math.round(delta * 1e6));
  let worst = 0;
  for (let t = 0; t < T; t++) {
    const o = cfgOnset(toBlocks(offLatticeDraw(8, delta, rand, 1.3)));
    if (o > worst) worst = o;
  }
  return worst;
}
function splitLooLatticeBaseline(m) {
  const blocks = [];
  for (let k = 0; k < m; k++) blocks.push([2 ** k, 1.3 * 2 ** k]);
  return cfgOnset(blocks);
}

const REC = IMP95445_TOTAL_OFFLATTICE_ONSET_BLASCHKE_COMPOSITION;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95445_ASSERTIONS = [
  {
    id: "imp95445-splitloo-baseline",
    description:
      "the m = 8 SPLIT-LOO lattice baseline onset (blocks {2^k, 1.3 2^k}, " +
      "closed Blaschke certificate) reproduces the baked value 11.785532 " +
      "(abs 1e-6)",
    holds: () =>
      Math.abs(splitLooLatticeBaseline(8) - REC.splitLooBaselineM8) < 1e-6,
  },
  {
    id: "imp95445-splitloo-onset-table",
    description:
      "FINDING 1: the worst-of-400 SPLIT-LOO onset on the shared imp-95429 " +
      "mulberry32 draw reproduces the baked column at every delta (abs 1e-6), " +
      "and its shift vs the SPLIT-LOO lattice baseline matches",
    holds: () => {
      const base = REC.splitLooBaselineM8;
      for (const row of REC.rows) {
        const o = splitLooWorstOnset(row.delta);
        if (Math.abs(o - row.splitLooOnset) > 1e-6) return false;
        if (Math.abs(o - base - row.splitLooShift) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95445-splitloo-binds-combined",
    description:
      "FINDING 1: the SPLIT-LOO Blaschke onset fires strictly shallower than " +
      "the imp-95429 RZ-PEN total at every delta, so the combined onset (min) " +
      "equals the SPLIT-LOO leg and binds is split-loo throughout the band",
    holds: () => {
      for (const row of REC.rows) {
        if (!(row.splitLooOnset < row.rzpenTotalOnset)) return false;
        const combined = Math.min(row.splitLooOnset, row.rzpenTotalOnset);
        if (Math.abs(combined - row.combinedOnset) > 1e-12) return false;
        if (Math.abs(combined - row.splitLooOnset) > 1e-12) return false;
        if (row.binds !== "split-loo") return false;
      }
      return true;
    },
  },
  {
    id: "imp95445-rzpen-overestimate",
    description:
      "FINDING 2: the imp-95429 RZ-PEN total over-estimates the true combined " +
      "onset by rzpenOverEstimate = rzpenTotal - combined (positive, matches " +
      "the baked column, and grows monotonically with delta up to 7.48 depth " +
      "units at +-25%)",
    holds: () => {
      let prev = -Infinity;
      for (const row of REC.rows) {
        const over = row.rzpenTotalOnset - row.combinedOnset;
        if (Math.abs(over - row.rzpenOverEstimate) > 1e-9) return false;
        if (!(over > 0)) return false;
        if (!(over > prev)) return false;
        prev = over;
      }
      const last = REC.rows[REC.rows.length - 1];
      return last.rzpenOverEstimate > 7 && last.rzpenOverEstimate < 8;
    },
  },
  {
    id: "imp95445-splitloo-monotone-no-cliff",
    description:
      "FINDING 3: the SPLIT-LOO combined onset rises monotonically in delta " +
      "and stays finite (< 16) even at +-25%, where the imp-95429 RZ-PEN " +
      "floor-driven shift blows out to +9.19 -- the Blaschke fence has no " +
      "near-collision cliff over this band",
    holds: () => {
      for (let i = 1; i < REC.rows.length; i++)
        if (!(REC.rows[i].combinedOnset > REC.rows[i - 1].combinedOnset))
          return false;
      const last = REC.rows[REC.rows.length - 1];
      return last.combinedOnset < 16;
    },
  },
  {
    id: "imp95445-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: MEASUREMENT, no " +
      "off-lattice floor/onset theorem, changes no bound, open legs named, " +
      "no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /measurement of two model certificates/i.test(REC.honestScope) &&
      /remain OPEN/.test(REC.honestScope) &&
      /NO off-lattice floor or onset theorem/i.test(REC.honestScope),
  },
];

for (const a of IMP95445_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95445-total-offlattice-onset-blaschke-composition assertion failed: ${a.id}`,
    );
  }
}

export default IMP95445_TOTAL_OFFLATTICE_ONSET_BLASCHKE_COMPOSITION;
