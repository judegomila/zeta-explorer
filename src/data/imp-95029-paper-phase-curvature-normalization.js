/**
 * imp-95029 - ASSESSMENT of the paper phase curvature normalization
 * (openResiduals[2] of the imp-95008 sibling chain, the "sibling Theorem D
 * residual") and its EXACT effect on the far-bracket ceiling ledger.
 *
 * CONTEXT. Theorem D of imp-95008-alias-separation-curvature-floor.js brackets
 * the named weld scalar S = sum_{h != 0} w(h)^2 lambda(h)^(-2/3) in closed
 * form, CONDITIONAL on the phase-curvature normalization lambda(h) >= mu ||h/p||
 * (||x|| = dist(x, Z)), exact with mu = 1 for the quadratic Fresnel MODEL phase
 * phi(u) = v u - (k - h/p) u^2 / 2 whose stationary point u* = v/(k - h/p)
 * carries curvature |phi''| = |k - h/p| = lambda by construction. Continuation
 * nineteen (imp-95008-exact-pair-correlation-ceiling.js) and the transfer map
 * imp-95026 both carry "the paper phase curvature normalization" as an OPEN
 * residual. This module derives WHERE that normalization enters the ledger and
 * MEASURES its effect; it instantiates no paper text, so it maps the DEPENDENCE
 * rather than supplying a paper number.
 *
 * FINDING 1 (exact ledger scaling - the normalization is a single lever). The
 * normalization enters the far-bracket ledger ONLY as the multiplicative factor
 * mu^(-2/3) on the named-scalar ceiling: ceiling(mu) = mu^(-2/3) ceiling(1),
 * because Theorem D is homogeneous of degree -2/3 in lambda and mu rescales
 * every lambda(h) uniformly. So mu is a FIFTH ledger lever alongside the four
 * of imp-95026 (sigma, theta, beta, isolation Q), acting multiplicatively and
 * independently of them. Sample: mu = 1/2 inflates the ceiling by 2^(2/3) ~
 * 1.587x; mu = 2 shrinks it by 0.630x; mu = 1/4 inflates by 2.520x.
 *
 * FINDING 2 (mu = 1 is the model tautology, not a free assumption). For the
 * quadratic Fresnel model the curvature AT the stationary point is exactly the
 * alias curvature |k - h/p|, so identifying lambda := |phi''| gives mu = 1
 * identically. The residual is nonzero only insofar as the TRUE paper packet
 * phase carries a curvature at u* differing from the alias tilt |k - h/p|.
 *
 * FINDING 3 (additive-base-curvature model + direct measurement). Model the
 * leading departure of the paper phase from the pure alias tilt as a smooth
 * additive base curvature b (the zeta-side amplitude contributes an O(1)
 * curvature, whereas the alias tilt contributes k - h/p). Then the worst-branch
 * curvature is lambda_paper(h) = min_k |b + (k - h/p)| = dist(h/p - b, Z), so
 *   S(b) = (1/p^2) sum_{h=1}^{p-1} dist(h/p - b, Z)^(-2/3),
 * the SAME comb shifted by b. Measured at p = 97:
 *  - b = 0 recovers the model EXACTLY: S(0) = 0.03811163970959591 equals the
 *    Theorem D closed form 2 p^(-4/3) sum_{j<=48} j^(-2/3) to rel 5.5e-16.
 *  - S(b) has period 1 in b (NOT 1/p - the excluded h = 0 slot breaks the finer
 *    periodicity), is even, and has POLES at b in (1/p)Z \ {0}: RESONANCE, where
 *    the base curvature exactly cancels an alias curvature at a worst branch
 *    (dist -> 0). This is the genuine open RISK.
 *  - Between resonances the effect is BOUNDED (order tens of percent): generic
 *    O(1) base curvatures give S(b)/S(0) = 1.268 (b = 0.3), 1.407 (b = 0.618),
 *    1.170 (b = 12.4); staying within the first quarter of a comb cell keeps it
 *    below 0.55 percent (S(0.25/p)/S(0) = 1.0055) and within the first half
 *    below 2.6 percent (S(0.5/p)/S(0) = 1.0254).
 *  - Approaching a resonance the effect diverges: S(0.9/p)/S(0) = 1.211,
 *    S(0.99/p)/S(0) = 2.209, S(0.999/p)/S(0) = 6.828.
 *
 * DIRECTION. b = 0 (the pure quadratic alias phase) is a LOCAL MINIMUM of S:
 * any additive base curvature only increases the named scalar, monotonically
 * toward the next resonance. So the paper phase normalization can only DEGRADE
 * the model ledger, never improve it, and the degradation is bounded UNLESS the
 * true base curvature resonates with a worst alias.
 *
 * SUB-GAP (honest). The paper base curvature b (equivalently mu) is not pinned
 * in this repo; whether the Section 4.5 packet phase resonates - b within
 * O(1/p^2) of a multiple of 1/p at the worst alias h - is the open question.
 * This derives the DEPENDENCE and brackets the non-resonant effect
 * (mu_eff = (S(b)/S(0))^(-3/2) stays in ~[0.75, 1] across most of a cell); it
 * does NOT supply a paper number. The numerics below CROSS-CHECK the exact
 * statements; they are not the claim. Import-light (no heavy bundle). Changes
 * no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

const P = 97; // the telescope prime (Theorem D reference)

const distZ = (x) => Math.abs(x - Math.round(x));

// named weld scalar under an additive base curvature b (b = 0 is the model)
function namedScalar(b, p = P) {
  let s = 0;
  for (let h = 1; h <= p - 1; h++) s += Math.pow(distZ(h / p - b), -2 / 3);
  return s / (p * p);
}

// Theorem D closed form at mu = 1: 2 p^(-4/3) sum_{j=1..(p-1)/2} j^(-2/3)
function theoremDClosedForm(p = P) {
  let t = 0;
  for (let j = 1; j <= (p - 1) / 2; j++) t += Math.pow(j, -2 / 3);
  return 2 * Math.pow(p, -4 / 3) * t;
}

// ledger effect of the normalization: a single multiplicative factor mu^(-2/3)
const ledgerMultiplier = (mu) => Math.pow(mu, -2 / 3);
function ceilingAtMu(mu, p = P) {
  return ledgerMultiplier(mu) * namedScalar(0, p);
}

// baked literals (measured above)
const S0_MODEL = 0.03811163970959591; // S(0) = Theorem D value at p = 97
const FLOOR_ONLY_CAP = 0.21539829139434846; // (p-1) p^(-4/3), Lemma A(i) alone
const RATIO_B_030 = 1.2678847918233314;
const RATIO_B_0618 = 1.4070308754760001;
const RATIO_B_124 = 1.1704580487715062;
const RATIO_QUARTER_CELL = 1.0054769220613413; // S(0.25/p)/S0
const RATIO_HALF_CELL = 1.0254376264970988; // S(0.5/p)/S0
const RATIO_NEAR_POLE = 6.8283504940520325; // S(0.999/p)/S0

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION = {
  ticket:
    "imp-95029 (assess the paper phase curvature normalization - openResiduals[2] of the imp-95008 sibling chain, the sibling Theorem D residual - and quantify its effect on the far-bracket ceiling ledger)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; Theorem D of imp-95008-alias-separation-curvature-floor.js; executes openResiduals[2] shared across the sibling chain.",
  findingLedgerScaling:
    "The normalization enters the far-bracket ledger ONLY as the multiplicative factor mu^(-2/3) on the Theorem D named-scalar ceiling: ceiling(mu) = mu^(-2/3) ceiling(1) (Theorem D is homogeneous of degree -2/3 in lambda and mu rescales every lambda(h) uniformly). So mu is a FIFTH ledger lever alongside imp-95026 (sigma, theta, beta, isolation Q), acting multiplicatively and independently.",
  findingModelTautology:
    "mu = 1 is not a free assumption: for the quadratic Fresnel model phase the curvature at the stationary point is exactly the alias tilt |k - h/p|, so lambda := |phi''| gives mu = 1 identically. The residual is nonzero only insofar as the true paper packet phase carries a curvature at u* differing from |k - h/p|.",
  findingBaseCurvatureMeasurement:
    "Modelling the leading paper departure as a smooth additive base curvature b gives lambda_paper(h) = dist(h/p - b, Z) and S(b) = (1/p^2) sum_{h=1..p-1} dist(h/p - b, Z)^(-2/3). At p = 97: b = 0 recovers the model exactly (S(0) = 0.03811163970959591 = Theorem D closed form, rel 5.5e-16); S(b) has period 1 (NOT 1/p, the excluded h=0 slot breaks the finer periodicity), is even, and has POLES at b in (1/p)Z\\{0} (RESONANCE - base curvature cancels an alias curvature at a worst branch). Between resonances the effect is BOUNDED (order tens of percent): S(b)/S(0) = 1.268 at b=0.3, 1.407 at b=0.618, 1.170 at b=12.4; below 0.55 percent within the first quarter cell and 2.6 percent within the first half; diverging as b approaches a pole (2.209 at 0.99/p, 6.828 at 0.999/p).",
  direction:
    "b = 0 (the pure quadratic alias phase) is a LOCAL MINIMUM of S: any additive base curvature only increases the named scalar, monotonically toward the next resonance. The paper phase normalization can only DEGRADE the model ledger, never improve it, and the degradation is bounded UNLESS the true base curvature resonates with a worst alias.",
  reference: {
    prime: P,
    s0Model: S0_MODEL,
    theoremDClosedForm: theoremDClosedForm(),
    floorOnlyCap: FLOOR_ONLY_CAP,
    ledgerMultiplierTable: [
      { mu: 0.25, factor: ledgerMultiplier(0.25) },
      { mu: 0.5, factor: ledgerMultiplier(0.5) },
      { mu: 0.75, factor: ledgerMultiplier(0.75) },
      { mu: 1, factor: ledgerMultiplier(1) },
      { mu: 1.5, factor: ledgerMultiplier(1.5) },
      { mu: 2, factor: ledgerMultiplier(2) },
      { mu: 3, factor: ledgerMultiplier(3) },
    ],
    baseCurvatureRatios: {
      b030: RATIO_B_030,
      b0618: RATIO_B_0618,
      b124: RATIO_B_124,
      quarterCell: RATIO_QUARTER_CELL,
      halfCell: RATIO_HALF_CELL,
      nearPole: RATIO_NEAR_POLE,
    },
    note: "measurement/derivation only; mu is a single multiplicative lever mu^(-2/3); b = 0 is the local best; resonances at b in (1/p)Z are the open risk",
  },
  openResiduals: [
    "the paper base curvature b (equivalently mu) is not pinned in this repo - the Section 4.5 packet phase text is not carried here",
    "whether the true packet phase resonates (b within O(1/p^2) of a multiple of 1/p at the worst alias h), where the named scalar diverges - the genuine open risk this assessment isolates",
  ],
  isRigorous: true,
  rigorScope:
    "Finding 1 (ledger scaling mu^(-2/3)) is an exact homogeneity observation on Theorem D. Finding 2 (mu = 1 model tautology) restates the exact construction of the quadratic Fresnel phase. Finding 3 is a MEASUREMENT of the named scalar under the additive-base-curvature model at p = 97: b = 0 reproduces the Theorem D closed form to rel 5.5e-16, the period-1 (not 1/p) structure and the poles at (1/p)Z are exhibited directly, and the bounded non-resonant band and the resonance divergence are computed. No paper constant is instantiated, so no transferred normalization is CLAIMED - only the DEPENDENCE (single lever mu^(-2/3); b = 0 local best; bounded off-resonance; divergent at resonance) is asserted. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT/DERIVATION assessment of the paper phase curvature normalization (Theorem D residual, openResiduals[2]) and its effect on the far-bracket ledger. FINDING 1: the normalization enters ONLY as the multiplicative factor mu^(-2/3) on the named-scalar ceiling (a fifth, independent lever beside imp-95026 sigma/theta/beta/Q). FINDING 2: mu = 1 is the model TAUTOLOGY (the quadratic Fresnel curvature at u* is exactly |k - h/p|), not a free assumption. FINDING 3: under an additive base curvature b the named scalar S(b) = (1/p^2) sum dist(h/p - b, Z)^(-2/3) recovers the model at b = 0 (S(0) = 0.03811163970959591 = Theorem D value), is period-1 (not 1/p) and even, has POLES at b in (1/p)Z (RESONANCE), and off-resonance stays within order tens of percent of the model (1.27x at b = 0.3, 1.03x within a half-cell), diverging (6.83x) as b approaches a pole. DIRECTION: b = 0 is a local minimum, so the paper phase can only DEGRADE the ledger, bounded unless it resonates. SUB-GAP: the paper base curvature b is not pinned in this repo; whether the Section 4.5 phase resonates with a worst alias is the open risk this isolates. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95029_CURVATURE_NORMALIZATION_ASSERTIONS = [
  {
    id: "imp95029-model-recovers-theoremD",
    description:
      "b = 0 recovers the Theorem D closed form 2 p^(-4/3) sum_{j<=48} j^(-2/3) = 0.03811163970959591 to rel 1e-12 at p = 97",
    holds: () => {
      const s0 = namedScalar(0);
      const cf = theoremDClosedForm();
      return (
        Math.abs(s0 - S0_MODEL) <= 1e-12 * S0_MODEL &&
        Math.abs(s0 - cf) <= 1e-12 * cf
      );
    },
  },
  {
    id: "imp95029-ledger-scaling-homogeneous",
    description:
      "Finding 1: the ceiling scales exactly as mu^(-2/3); ceilingAtMu(mu) = mu^(-2/3) S0 and the table values 2^(2/3) (mu=1/2), 2^(-2/3) (mu=2), 4^(1/3) (mu=1/4) are reproduced",
    holds: () => {
      const rel = (x, y) => Math.abs(x - y) <= 1e-12 * Math.abs(y);
      return (
        rel(ceilingAtMu(0.5), Math.pow(0.5, -2 / 3) * namedScalar(0)) &&
        rel(ledgerMultiplier(0.5), Math.pow(2, 2 / 3)) &&
        rel(ledgerMultiplier(2), Math.pow(2, -2 / 3)) &&
        rel(ledgerMultiplier(0.25), Math.pow(4, 2 / 3)) &&
        rel(ledgerMultiplier(1), 1)
      );
    },
  },
  {
    id: "imp95029-period-one-not-oneoverp",
    description:
      "Finding 3: S(b) has period 1 and is even, but is NOT (1/p)-periodic (the excluded h=0 slot breaks the finer period): S(0.37/p) differs from S(1.37/p) while S(b) = S(b+1) = S(-b)",
    holds: () => {
      const rel = (x, y) => Math.abs(x - y) <= 1e-9 * Math.abs(y);
      const b = 0.31;
      const periodOne = rel(namedScalar(b), namedScalar(b + 1));
      const even = rel(namedScalar(b), namedScalar(-b));
      const notFine =
        Math.abs(namedScalar(0.37 / P) - namedScalar(1.37 / P)) >
        1e-3 * namedScalar(0.37 / P);
      return periodOne && even && notFine;
    },
  },
  {
    id: "imp95029-b0-local-minimum",
    description:
      "Direction: b = 0 is a local minimum of S - a small additive base curvature only increases the named scalar (S(0) <= S(0.1/p) <= S(0.25/p) <= S(0.5/p))",
    holds: () => {
      const a0 = namedScalar(0);
      const a1 = namedScalar(0.1 / P);
      const a2 = namedScalar(0.25 / P);
      const a3 = namedScalar(0.5 / P);
      return a0 <= a1 && a1 <= a2 && a2 <= a3;
    },
  },
  {
    id: "imp95029-bounded-off-resonance",
    description:
      "Finding 3: off-resonance the effect is bounded (order tens of percent) - S(b)/S0 = 1.268 (b=0.3), 1.407 (b=0.618), 1.170 (b=12.4), and within a quarter/half cell <= 1.006 / 1.026",
    holds: () => {
      const s0 = namedScalar(0);
      const rel = (x, y) => Math.abs(x - y) <= 1e-9 * Math.abs(y);
      return (
        rel(namedScalar(0.3) / s0, RATIO_B_030) &&
        rel(namedScalar(0.618) / s0, RATIO_B_0618) &&
        rel(namedScalar(12.4) / s0, RATIO_B_124) &&
        rel(namedScalar(0.25 / P) / s0, RATIO_QUARTER_CELL) &&
        rel(namedScalar(0.5 / P) / s0, RATIO_HALF_CELL) &&
        RATIO_B_0618 < 1.5
      );
    },
  },
  {
    id: "imp95029-resonance-divergence",
    description:
      "Finding 3: the named scalar diverges as b approaches a pole in (1/p)Z - S(0.999/p)/S0 = 6.828 and grows past 100x at 0.99999/p (RESONANCE, the isolated open risk)",
    holds: () => {
      const s0 = namedScalar(0);
      const rel = (x, y) => Math.abs(x - y) <= 1e-9 * Math.abs(y);
      return (
        rel(namedScalar(0.999 / P) / s0, RATIO_NEAR_POLE) &&
        namedScalar(0.99999 / P) / s0 > 100
      );
    },
  },
  {
    id: "imp95029-floor-only-context",
    description:
      "cross-check: the model named scalar S0 is 5.65x below the Lemma A(i) floor-only cap (p-1) p^(-4/3) = 0.21539829139434846, unchanged by this assessment",
    holds: () => {
      const rel = (x, y) => Math.abs(x - y) <= 1e-12 * Math.abs(y);
      return (
        rel((P - 1) * Math.pow(P, -4 / 3), FLOOR_ONLY_CAP) &&
        Math.abs(FLOOR_ONLY_CAP / namedScalar(0) - 5.651771821827822) <= 1e-9
      );
    },
  },
  {
    id: "imp95029-honesty-gate",
    description:
      "the verdict names the sub-gap (paper base curvature not pinned; resonance risk), records the single mu^(-2/3) lever and the b=0 local best, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION.promotesBound === false &&
      IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION.openResiduals.length === 2 &&
      /NO QED/.test(IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION.verdict) &&
      /refereed bound is changed/i.test(IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION.verdict) &&
      /mu\^\(-2\/3\)/.test(IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION.verdict) &&
      /RESONANCE/.test(IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION.verdict) &&
      /local minimum/.test(IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION.verdict),
  },
];

for (const a of IMP95029_CURVATURE_NORMALIZATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95029-paper-phase-curvature-normalization assertion failed: ${a.id}`
    );
  }
}

export default IMP95029_PAPER_PHASE_CURVATURE_NORMALIZATION;
