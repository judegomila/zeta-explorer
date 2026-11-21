/**
 * @module imp-33618-strip-height-tradeoff
 *
 * imp-33618 (proof, frontier-assessment): QUANTIFY the H3/H4 strip-height trade-off that imp-33603
 * named as the PRECISE residual of the G6a_shock_lipschitz Lemma-5.2 port. imp-33603 flagged H4
 * (perturbation control on a strip above the fold) as OPEN because the reading strip
 * y_N^sharp = sqrt(2 pi / N) -> 0 descends onto the y -> 0+ boundary shock, where H3 (uniform fold
 * curvature) fails. This module treats the reading strip height y as a FREE variable, writes down an
 * ILLUSTRATIVE decay law for the perturbation-control bound and an ILLUSTRATIVE growth law for the RvM
 * fold-curvature contraction floor, and MEASURES whether any intermediate y*(N) bounded away from 0
 * can hold BOTH the perturbation control (H4) and a uniform curvature lower bound (H3) at once, while
 * still reading the ACTUAL near-collision front. Assessment only. G6a stays OPEN; no QED; does not
 * touch imp-3066 or C_mb.
 *
 * PROVENANCE OF THE TWO MODEL LAWS (honesty note)
 * ----------------------------------------------
 * Neither law is DERIVED rigorously here; each is an illustrative parametrization grounded in a cited
 * repo object, used only to expose the geometry of the conflict, NOT to bound anything.
 *   - CURVATURE / CONTRACTION FLOOR  K(y) ~ y^2. This is the imp-3708 / imp-3726 y2-adapted-flow-depth
 *     scaling: the self-similar backward-flow depth s(y) ~ y^2, so the usable fold-curvature floor
 *     that pins the Holder-1/2 modulus constant vanishes as y^2 toward the boundary. Hence the modulus
 *     constant C_W(y) = sqrt(2 / K(y)) ~ sqrt(2) / y DIVERGES as y -> 0+.
 *   - PERTURBATION BOUND  eps(N, y) ~ 1 / (N y). An illustrative L^inf Stieltjes sampling-error law:
 *     N points read at vertical resolution y give an error that decays as y rises off the boundary.
 *     Perturbation control (H4) is only demonstrable down to y_N^sharp = sqrt(2 pi / N) (imp-341 /
 *     imp-354 convention), which is exactly why the naive reading strip descends to 0.
 *
 * THE TRADE-OFF, AS A FUNCTION OF y
 * ---------------------------------
 * Read the Holder-1/2 modulus at strip height y for a table of size N:
 *   modulus(N, y) = C_W(y) * eps(N, y)^{1/2},  C_W(y) = sqrt(2) / y,  eps(N, y) = 1 / (N y).
 * TWO opposing pressures:
 *   (P-up)   H4 wants y LARGE: perturbation control improves (eps ~ 1/(N y) shrinks) and the strip
 *            sits UNIFORMLY ABOVE the degenerate boundary, so C_W(y) is finite and N-independent.
 *   (P-down) But the ACTUAL near-collision (the shock the modulus must bound) forms AT the boundary,
 *            y -> 0+; to read the genuine Holder-1/2 blow-up the strip must TRACK the front
 *            y ~ y_N^sharp = sqrt(2 pi / N) -> 0, where C_W(y) ~ sqrt(2)/y -> infinity.
 * A fixed y* > 0 bounded away from 0 satisfies (P-up) with a finite N-uniform C_W(y*), but for large N
 * it sits ORDERS above the front y_N^sharp, so it reads the SMOOTH (Lipschitz, H1) region and bounds
 * the WRONG thing -- it is vacuous for the shock. This is the crux: H3 wants y bounded away from 0,
 * the shock lives at y -> 0, and the two demands are mutually exclusive for the boundary front.
 *
 * WHAT THE LADDER MEASURES
 * ------------------------
 * At the natural front y = y_N^sharp = sqrt(2 pi / N):
 *   C_W(y_N^sharp) = sqrt(2) / sqrt(2 pi / N) = sqrt(N / pi)         -> infinity like sqrt(N)
 *   eps(N, y_N^sharp) = 1 / (N sqrt(2 pi / N)) = 1 / sqrt(2 pi N)     -> 0 like 1/sqrt(N)
 *   modulus(N, y_N^sharp) = sqrt(N / pi) * (2 pi N)^{-1/4} ~ N^{1/4}  -> infinity
 * So on the front the modulus constant blows up FASTER than the perturbation control shrinks: the
 * product diverges as N^{1/4}. imp-2520 negative-finding 1 (naive modulus -> 0 as strip height -> 0)
 * is the same statement read from the C_W side (floor -> 0).
 *
 * THE N-UNIFORM WINDOW TEST
 * -------------------------
 * Fix a modulus-constant budget B and a front-reach factor rho. A strip height y* would close the port
 * if it BOTH (i) keeps C_W(y*) <= B, i.e. y* >= sqrt(2)/B (bounded away from 0), AND (ii) reads the
 * front, y* <= rho * y_N^sharp (tracks the shock). For large N, (ii) forces y* <= rho sqrt(2 pi / N)
 * -> 0, contradicting (i). The window is NON-EMPTY only for N <= N_cross = pi rho^2 B^2 and EMPTY for
 * all larger N. With B = 10, rho = 1 that is N_cross ~ 314: every rung of the N >= 1e3 ladder has an
 * EMPTY window. The conflict is therefore FUNDAMENTAL for the boundary shock, not a matter of tuning y.
 *
 * VERDICT: ASSESSMENT ONLY, CONFLICT IS FUNDAMENTAL, G6a STAYS OPEN. No intermediate strip height
 * y*(N) bounded away from 0 holds H3 (uniform curvature) and H4 (perturbation control on the ACTUAL
 * front) simultaneously N-uniformly: the perturbation control and the finite-curvature budget both
 * push toward y bounded away from 0, but the shock the modulus must bound lives at y -> 0, so any y*
 * that stays finite reads off the shock and is vacuous. This CONFIRMS imp-33603 H4 as the load-bearing
 * residual and re-derives, from the geometry, the still-missing object named
 * G6a_shock_lipschitz::y2-adapted-flow-depth (imp-3708 / imp-3726): a strip-height-UNIFORM curvature
 * floor that does NOT vanish as y^2. Both laws here are ILLUSTRATIVE parametrizations, not rigorous
 * bounds; this changes no bound. G6a_shock_lipschitz stays OPEN; no positivity, no bridge closure, no
 * RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED; C_mb share
 * untouched. No refereed bound is changed.
 *
 * @see imp-33603-lemma52-port-scoping (names H4 strip-height-uniformity as the precise residual)
 * @see imp-3726-y2-adapted-flow-depth-schedule (the s(y) ~ y^2 self-similar depth this model uses)
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (the y2-adapted-flow-depth still-missing object)
 * @see imp-2520 (negative-finding 1: naive modulus -> 0 as strip height -> 0)
 * @see lambda-burgers-shock-lipschitz (imp-354: Whitham fold reduction; G6a-sub-constant)
 */

// The natural perturbation-control strip height (imp-341 / imp-354 convention). Descends to 0 as N grows.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// ILLUSTRATIVE modulus constant from the imp-3726 y^2 contraction floor K(y) = y^2: C_W = sqrt(2 / y^2).
function cW(y) {
  return Math.sqrt(2) / y;
}

// ILLUSTRATIVE L^inf Stieltjes sampling-error bound: N points at vertical resolution y.
function epsBound(N, y) {
  return 1 / (N * y);
}

// The Holder-1/2 modulus read at strip height y for table size N.
function modulus(N, y) {
  return cW(y) * Math.sqrt(epsBound(N, y));
}

// N-uniform window parameters: modulus-constant budget B and front-reach factor rho.
const BUDGET_B = 10; // require C_W(y*) <= 10 (finite, N-uniform curvature floor)
const REACH_RHO = 1; // require y* <= rho * y_N^sharp (strip tracks the actual shock front)

// The window is non-empty only for N <= N_cross; empty for all larger N.
const N_CROSS = Math.PI * REACH_RHO * REACH_RHO * BUDGET_B * BUDGET_B; // pi rho^2 B^2 ~ 314

// A ladder from moderate to very large N, all above N_cross, so every rung has an EMPTY window.
const N_LADDER = [1e3, 1e4, 1e6, 1e8, 1e10, 1e12];

const TRADEOFF_LADDER = N_LADDER.map((N) => {
  const yFront = ySharp(N);
  const yLowerForBudget = Math.sqrt(2) / BUDGET_B; // C_W(y) <= B  <=>  y >= sqrt(2)/B
  const yUpperForFront = REACH_RHO * yFront; // read the front  <=>  y <= rho * y_N^sharp
  const windowEmpty = yLowerForBudget > yUpperForFront;
  return {
    N,
    y_N_sharp: +yFront.toExponential(4),
    C_W_at_front: +cW(yFront).toExponential(4), // sqrt(N/pi) -> infinity like sqrt(N)
    eps_at_front: +epsBound(N, yFront).toExponential(4), // 1/sqrt(2 pi N) -> 0 like 1/sqrt(N)
    modulus_at_front: +modulus(N, yFront).toExponential(4), // ~ N^{1/4} -> infinity
    window_y_lower: +yLowerForBudget.toExponential(4), // finite-curvature demand: y >= this
    window_y_upper: +yUpperForFront.toExponential(4), // read-the-front demand: y <= this
    windowEmpty, // true iff no y* holds BOTH H3 (budget) and H4 (front-reach)
  };
});

export const IMP33618_STRIP_HEIGHT_TRADEOFF = {
  id: 'imp-33618',
  proofSection: 'S-frontier',
  assesses:
    'The H3/H4 strip-height trade-off named as the imp-33603 residual of the G6a_shock_lipschitz ' +
    'Lemma-5.2 port: whether any intermediate reading strip height y*(N) bounded away from 0 can hold ' +
    'perturbation control (H4) and a uniform fold-curvature lower bound (H3) at once on the actual front.',
  freeVariable: 'reading strip height y > 0 (the reading is at {Im z >= y})',
  modelLaws: {
    curvatureFloor: 'K(y) ~ y^2 (imp-3726 / imp-3708 self-similar depth s(y) ~ y^2) => C_W(y) = sqrt(2)/y',
    perturbationBound: 'eps(N, y) ~ 1/(N y) (illustrative L^inf Stieltjes sampling error), controlled down to y_N^sharp = sqrt(2 pi / N)',
    modulus: 'modulus(N, y) = C_W(y) * eps(N, y)^{1/2}',
    caveat: 'BOTH laws are ILLUSTRATIVE parametrizations grounded in cited repo objects, NOT rigorous bounds; this changes no bound.',
  },
  frontScaling: {
    C_W_at_front: 'C_W(y_N^sharp) = sqrt(N/pi) -> infinity like sqrt(N)',
    eps_at_front: 'eps(N, y_N^sharp) = 1/sqrt(2 pi N) -> 0 like 1/sqrt(N)',
    modulus_at_front: 'modulus(N, y_N^sharp) ~ N^{1/4} -> infinity: the curvature blow-up beats the perturbation decay',
  },
  window: {
    budgetB: BUDGET_B,
    reachRho: REACH_RHO,
    nonEmptyCondition: 'sqrt(2)/B <= y* <= rho * sqrt(2 pi / N)  (H3 budget AND H4 front-reach on the same y*)',
    nCross: +N_CROSS.toFixed(2), // ~ 314.16: non-empty only for N <= N_cross, empty above
    verdictAcrossLadder: 'EMPTY at every rung (all N >= 1e3 > N_cross ~ 314)',
  },
  tradeoffLadder: TRADEOFF_LADDER,
  conflictFundamental: true, // no y*(N) bounded away from 0 reads the front with finite N-uniform C_W
  residualConfirmed: 'G6a_shock_lipschitz::y2-adapted-flow-depth (a strip-height-uniform curvature floor that does not vanish as y^2)',
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous): treating the reading strip height y as a free ' +
    'variable, the perturbation-control bound eps(N, y) ~ 1/(N y) improves as y rises off the boundary ' +
    'while the fold-curvature contraction floor K(y) ~ y^2 (imp-3726 / imp-3708) makes the modulus ' +
    'constant C_W(y) = sqrt(2)/y diverge as y -> 0+. On the ACTUAL near-collision front ' +
    'y = y_N^sharp = sqrt(2 pi / N) the modulus constant blows up as sqrt(N/pi) FASTER than the ' +
    'perturbation control shrinks (1/sqrt(2 pi N)), so the Holder-1/2 modulus itself diverges as ' +
    'N^{1/4}. The N-uniform window test shows why no tuning of y rescues this: requiring C_W(y*) <= B ' +
    'forces y* >= sqrt(2)/B bounded away from 0, but reading the front forces y* <= rho sqrt(2 pi / N) ' +
    '-> 0, and the two are compatible only for N <= N_cross = pi rho^2 B^2 (~314 at B=10, rho=1) -- ' +
    'EMPTY for every rung of the N >= 1e3 ladder. A fixed y* > 0 does keep C_W finite N-uniformly but ' +
    'sits orders above the front, reading the smooth (Lipschitz, H1) region and bounding the WRONG ' +
    'thing. The H3/H4 conflict is therefore FUNDAMENTAL for the boundary shock, not a matter of ' +
    'choosing y: it re-derives, from the geometry, the still-missing object ' +
    'G6a_shock_lipschitz::y2-adapted-flow-depth (imp-3708 / imp-3726) -- a strip-height-UNIFORM ' +
    'curvature floor that does not vanish as y^2. Both model laws are ILLUSTRATIVE, not rigorous; this ' +
    'confirms imp-33603 H4 as the load-bearing residual and changes no bound. G6a_shock_lipschitz ' +
    'stays OPEN; no positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 positivity UNTOUCHED; C_mb share untouched. No refereed bound is changed' +
    '.',
  citation:
    'imp-33603-lemma52-port-scoping (H4 strip-height-uniformity residual); ' +
    'imp-3726-y2-adapted-flow-depth-schedule and imp-3708-s2-gronwall-vacuity-intrinsic-assessment ' +
    '(the s(y) ~ y^2 self-similar depth and the y2-adapted-flow-depth still-missing object); imp-2520 ' +
    '(negative-finding 1: naive modulus -> 0 as strip height -> 0); lambda-burgers-shock-lipschitz ' +
    '(imp-354: Whitham fold reduction, G6a-sub-constant).',
};

export const IMP33618_STRIP_HEIGHT_TRADEOFF_ASSERTIONS = [
  {
    // The natural front strip height y_N^sharp = sqrt(2 pi / N) strictly decreases toward 0.
    id: 'imp33618-front-descends-to-zero',
    description: 'y_N^sharp = sqrt(2 pi / N) strictly decreases toward 0 across the N ladder',
    holds: () =>
      TRADEOFF_LADDER.every((row, i) => i === 0 || row.y_N_sharp < TRADEOFF_LADDER[i - 1].y_N_sharp) &&
      ySharp(1e3) > 0.07 &&
      ySharp(1e12) < 1e-5,
  },
  {
    // On the front the modulus constant blows up (C_W ~ sqrt(N)) while the perturbation shrinks (eps ~ 1/sqrt(N)).
    id: 'imp33618-front-curvature-blows-up-perturbation-shrinks',
    description: 'C_W_at_front increases and eps_at_front decreases monotonely across the ladder',
    holds: () =>
      TRADEOFF_LADDER.every(
        (row, i) =>
          i === 0 ||
          (row.C_W_at_front > TRADEOFF_LADDER[i - 1].C_W_at_front &&
            row.eps_at_front < TRADEOFF_LADDER[i - 1].eps_at_front),
      ),
  },
  {
    // The Holder-1/2 modulus read on the front DIVERGES (curvature blow-up beats perturbation decay).
    id: 'imp33618-modulus-on-front-diverges',
    description: 'modulus_at_front strictly increases across the ladder (~ N^{1/4} -> infinity)',
    holds: () =>
      TRADEOFF_LADDER.every(
        (row, i) => i === 0 || row.modulus_at_front > TRADEOFF_LADDER[i - 1].modulus_at_front,
      ) && TRADEOFF_LADDER[TRADEOFF_LADDER.length - 1].modulus_at_front > TRADEOFF_LADDER[0].modulus_at_front,
  },
  {
    // No y* holds BOTH the finite-curvature budget and the front-reach: window empty at every rung.
    id: 'imp33618-uniform-window-empty',
    description: 'the H3/H4 N-uniform window is EMPTY for every ladder rung (N >= 1e3 > N_cross ~ 314)',
    holds: () =>
      TRADEOFF_LADDER.every((row) => row.windowEmpty === true) &&
      N_CROSS > 300 &&
      N_CROSS < 320 &&
      IMP33618_STRIP_HEIGHT_TRADEOFF.conflictFundamental === true,
  },
  {
    // Honesty gate: assessment only, not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33618-honesty-gate-no-qed',
    description: 'Assessment only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33618_STRIP_HEIGHT_TRADEOFF.isRigorous === false &&
      /NO QED/.test(IMP33618_STRIP_HEIGHT_TRADEOFF.verdict) &&
      /stays OPEN/.test(IMP33618_STRIP_HEIGHT_TRADEOFF.verdict) &&
      /refereed bound is changed/i.test(IMP33618_STRIP_HEIGHT_TRADEOFF.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33618_STRIP_HEIGHT_TRADEOFF.verdict),
  },
];

for (const a of IMP33618_STRIP_HEIGHT_TRADEOFF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33618-strip-height-tradeoff assertion failed: ${a.id}`);
  }
}
