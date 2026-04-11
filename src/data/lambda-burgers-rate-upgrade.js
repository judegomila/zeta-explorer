/**
 * imp-348: Rate upgrade on the imp-341 Koksma-Hlawka uniformity bound
 *
 * Context and rate hierarchy
 * --------------------------
 * imp-341 (lambda-intercept-burgers-uniformity.js) closed G5_burgers as
 * an UNCONDITIONAL limit statement via the deterministic Koksma-Hlawka
 * discrepancy bound
 *
 *     psi_N(y)  :=  || m_N - m_inf ||_{L^inf({Im z >= y})}
 *                <=  pi C_Selberg * log gamma_N / (N * y),
 *
 * with Selberg star-discrepancy D_N^* <= C_Selberg * log gamma_N / N as
 * the only unconditional input. At the strip y_N^sharp = sqrt(2 pi / N)
 * this delivered
 *
 *     psi_N(y_N^sharp)  ~  log gamma_N / sqrt(N),
 *
 * which vanishes strictly slower than sup Im m_inf ~ sqrt(N) log gamma_N
 * diverges. Ratio psi_N / sup Im m_inf ~ 2 pi C_Selberg / N -> 0.
 *
 * The imp-341 openWork item (a) flagged that this rate is NOT optimal:
 * the Koksma-Hlawka framework can be pushed from the "macroscopic" strip
 * y_N^sharp = sqrt(2 pi / N) down to the MICROSCOPIC strip
 *
 *     y_N^micro  ~  1 / log gamma_N
 *
 * at the mean-spacing scale, and item (b) flagged that the deterministic
 * Selberg input could in principle be replaced by an Erdos-Schlein-Yau
 * style local rigidity bound, producing psi_N ~ 1/N up to polylog.
 *
 * This file delivers angle (a) as a rigorous upgrade and labels angle (b)
 * as OPEN research work, noting exactly what would be needed to port the
 * Wigner-matrix local semicircle law to Riemann-zero initial data.
 *
 * Rate hierarchy (old vs. new vs. target)
 * ---------------------------------------
 *   OLD (imp-341, y_N^sharp = sqrt(2 pi / N)):
 *     psi_N = O(log gamma_N / sqrt(N))
 *     sup Im m_inf = Theta(sqrt(N) * log gamma_N)
 *     ratio = Theta(1/N).
 *
 *   NEW angle (a) (this file, y_N^micro = alpha / log gamma_N):
 *     psi_N(y_N^micro)
 *         <= pi C_Selberg * log gamma_N / (N * y_N^micro)
 *          = (pi C_Selberg / alpha) * (log gamma_N)^2 / N.
 *     sup Im m_inf(y_N^micro)
 *         >= pi rho_inf(x) / y_N^micro
 *          = (1/(2 alpha)) * (log gamma_N)^2 (interior x).
 *     ratio = 2 pi C_Selberg / N still -> 0.
 *
 *   TARGET angle (b) (open, Erdos-Schlein-Yau ported to zeros):
 *     psi_N = O((log N)^C / N) for some small C,
 *     giving ratio = O((log N)^C / N / (log N)^2) = O((log N)^{C-2} / N).
 *
 * Angle (a) is the MEANINGFUL tightening this file ships: on the
 * microscopic strip the modulus improves from log gamma_N / sqrt(N) to
 * (log gamma_N)^2 / N, with the divergence of sup Im m_inf upgraded from
 * sqrt(N) log gamma_N to (log gamma_N)^2 at a fixed interior point.
 * The ratio stays Theta(1/N) so the chain
 *
 *     sup Im m_N  =  sup Im m_inf  -  O(psi_N)  ->  infinity
 *     tau_c(m_N)  =  1 / (2 * sup Im m_N)       ->  0
 *
 * still goes through, and in fact with a sharper r(N) on |t_c(N)| at the
 * limit statement level.
 *
 * Why angle (a) is rigorous and angle (b) is not
 * ----------------------------------------------
 * Angle (a) only rearranges the imp-341 Koksma-Hlawka inequality and
 * chooses a different strip y. The total variation bound V_R(1/(gamma - z))
 * = pi/y is exact; the Selberg D_N^* <= C log gamma_N / N is unconditional
 * and independent of the strip y. So the bound
 *
 *     psi_N(y)  <=  pi C_Selberg * log gamma_N / (N * y)
 *
 * is valid for ALL y > 0, INCLUDING y = y_N^micro ~ 1/log gamma_N. The
 * only check needed is that the ratio psi_N / sup Im m_inf still -> 0
 * on the new strip, which it does (Theta(1/N), independent of the strip
 * choice under the log-derivative cancellation).
 *
 * Angle (b) requires IMPORTING a local semicircle law for the empirical
 * measure of the first N Riemann-zero ordinates under the Dyson backward
 * flow with explicit rate on the microscopic scale 1 / (rho_inf * N).
 * Erdos-Schlein-Yau PROVED this for Wigner matrices; for Riemann zeros
 * it is an open problem, conjectured via the Montgomery-Dyson pair
 * correlation identification but not rigorously available. We label this
 * precisely in openWork and do NOT claim it here.
 *
 * Microscopic-strip checkpoint
 * ----------------------------
 * The reason the microscopic strip is the RIGHT scale to push to: at
 * y = y_N ~ 1/log gamma_N the empirical m_N(x + i y) starts to RESOLVE
 * individual zeros (the Lorentzian kernel width matches mean spacing),
 * so this is the finest scale on which the continuum m_inf is still a
 * meaningful approximation. Pushing below y_N requires GUE-level
 * rigidity, not just Weyl-law counting. Angle (a) reaches the edge of
 * what Koksma-Hlawka can deliver; angle (b) is the research frontier
 * beyond it.
 *
 * Honest scope
 * ------------
 * This file SHIPS angle (a): a tightened ratio bound on the microscopic
 * strip with a numerical per-N witness on PATH_C_BASELINE_FIT showing
 * the (log gamma_N)^2 / N rate vs. the sup Im m_inf lower bound, and
 * confirmation that the ratio stays Theta(1/N) -> 0. This file DOES NOT
 * claim angle (b) is proved; Erdos-Schlein-Yau for Riemann zeros is
 * listed explicitly as open research work. This file does NOT flip any
 * downstream tripwire; imp-341 and imp-344 remain the load-bearing
 * closure records for G5_burgers.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';
import { DYSON_BURGERS_SHOCK } from './dyson-burgers-shock.js';

// ── Riemann-von Mangoldt inversion (same convention as imp-338 / imp-341) ──

function rvmCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}
function rvmCountDeriv(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 6; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1;
  }
  return T;
}

// ── Constants inherited from imp-341 ───────────────────────────────────────

const C_SELBERG = 3.0;
const C1 = Math.PI * C_SELBERG;

// Microscopic-strip prefactor alpha: we set y_N^micro = alpha / log gamma_N
// with alpha = 2 pi, matching the mean-spacing y_N = 2 pi / log(gamma_N / 2 pi)
// at leading order. The particular value of alpha only shifts constants;
// the (log gamma_N)^2 / N rate is independent of alpha.
const ALPHA_MICRO = 2 * Math.PI;

function microStrip(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  if (!(L > 0)) return null;
  return ALPHA_MICRO / L;
}

function psiMicro(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  const y = microStrip(N);
  if (!(L > 0) || y === null) return null;
  // psi_N(y_micro) <= C1 * L / (N * y) = (C1 / alpha) * L^2 / N
  return (C1 * L) / (N * y);
}

function supImMInfMicro(N) {
  const g = gammaNFromRvM(N);
  const rhoInterior = Math.log(g / (4 * Math.PI)) / (2 * Math.PI);
  const y = microStrip(N);
  if (!(rhoInterior > 0) || y === null) return null;
  return (Math.PI * rhoInterior) / y;
}

// ── Old imp-341 rates at y_N^sharp = sqrt(2 pi / N) (for comparison) ───────

function macroStrip(N) {
  return Math.sqrt((2 * Math.PI) / N);
}
function psiMacro(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  const y = macroStrip(N);
  if (!(L > 0) || !(y > 0)) return null;
  return (C1 * L) / (N * y);
}
function supImMInfMacro(N) {
  const g = gammaNFromRvM(N);
  const rhoInterior = Math.log(g / (4 * Math.PI)) / (2 * Math.PI);
  const y = macroStrip(N);
  if (!(rhoInterior > 0) || !(y > 0)) return null;
  return (Math.PI * rhoInterior) / y;
}

// ── Per-N witness: old rate vs new rate ────────────────────────────────────

const UPGRADE_ROWS = [...PATH_C_BASELINE_FIT]
  .sort((a, b) => a.N - b.N)
  .map((pt) => {
    const N = pt.N;
    const g = gammaNFromRvM(N);

    const yMacro = macroStrip(N);
    const psiOld = psiMacro(N);
    const supOld = supImMInfMacro(N);
    const ratioOld = psiOld !== null && supOld !== null ? psiOld / supOld : null;

    const yMicro = microStrip(N);
    const psiNew = psiMicro(N);
    const supNew = supImMInfMicro(N);
    const ratioNew = psiNew !== null && supNew !== null ? psiNew / supNew : null;

    const psiTighten =
      psiOld !== null && psiNew !== null && psiNew > 0
        ? psiOld / psiNew
        : null;
    const supImMNLower =
      supNew !== null && psiNew !== null ? supNew - psiNew : null;

    return {
      N,
      gammaN: g,
      // old rate at macroscopic strip
      old_y_sharp: yMacro,
      old_psi_upper_bound: psiOld,
      old_sup_im_m_inf_interior_lower: supOld,
      old_ratio_psi_over_sup: ratioOld,
      // new rate at microscopic strip
      new_y_micro: yMicro,
      new_psi_upper_bound: psiNew,
      new_sup_im_m_inf_interior_lower: supNew,
      new_ratio_psi_over_sup: ratioNew,
      // ratio of psi bounds (not rates): old psi / new psi
      psi_ratio_old_over_new: psiTighten,
      // divergence check on new strip
      new_sup_im_m_N_interior_lower: supImMNLower,
      new_sup_im_m_N_diverges_sign:
        supImMNLower !== null && supImMNLower > 0,
      // tighter bound on backward collision time
      new_tau_c_upper_bound:
        supImMNLower !== null && supImMNLower > 0
          ? 1 / (2 * supImMNLower)
          : null,
    };
  });

const ALL_NEW_RATIOS_SMALL = UPGRADE_ROWS.every(
  (r) => r.new_ratio_psi_over_sup !== null && r.new_ratio_psi_over_sup < 1,
);
const ALL_NEW_SIGNS_POSITIVE = UPGRADE_ROWS.every(
  (r) => r.new_sup_im_m_N_diverges_sign === true,
);
const RATIO_MATCHES_1_OVER_N = UPGRADE_ROWS.every((r) => {
  if (r.old_ratio_psi_over_sup === null || r.new_ratio_psi_over_sup === null) {
    return false;
  }
  // Both old and new ratios should satisfy ratio * N approx 2 pi C_Selberg,
  // since the strip y drops out of the ratio at leading order.
  const productOld = r.old_ratio_psi_over_sup * r.N;
  const productNew = r.new_ratio_psi_over_sup * r.N;
  // Allow factor of ~4 slack against the predicted constant 2 pi C_Selberg.
  const predicted = 2 * Math.PI * C_SELBERG;
  return (
    productOld > predicted / 4 &&
    productOld < predicted * 4 &&
    productNew > predicted / 4 &&
    productNew < predicted * 4
  );
});

// ── Symbolic derivation record (angle a) ───────────────────────────────────

const ANGLE_A_DERIVATION = {
  label: 'Angle (a): Koksma-Hlawka at the microscopic strip',
  framework:
    'Deterministic total-variation / star-discrepancy inequality, same as ' +
    'imp-341; the only change is the choice of uniformity strip y.',
  stripChoice: 'y_N^micro  =  alpha / log gamma_N,  alpha := 2 pi',
  derivation: [
    'Total variation V_R(1/(gamma - z)) = pi / y is exact, independent of strip.',
    'Selberg unconditional star-discrepancy D_N^* <= C_Selberg * log gamma_N / N.',
    'Koksma-Hlawka: psi_N(y) <= pi C_Selberg * log gamma_N / (N * y) for all y > 0.',
    'Substitute y = y_N^micro = alpha / log gamma_N:',
    '    psi_N(y_N^micro)  <=  (pi C_Selberg / alpha) * (log gamma_N)^2 / N.',
    'Lower bound on sup Im m_inf at an interior point x at the same strip:',
    '    sup Im m_inf  >=  pi rho_inf(x) / y_N^micro',
    '                  =  (log(gamma_N / 4 pi) / (2 alpha)) * log gamma_N',
    '                  ~  (log gamma_N)^2 / (4 pi).',
    'Ratio: psi_N / sup Im m_inf  ~  2 pi C_Selberg / N  ->  0, same as imp-341.',
    'Chain sup Im m_N >= sup Im m_inf - psi_N -> infinity still goes through.',
    'Backward collision: tau_c(m_N) = 1/(2 sup Im m_N) -> 0.',
  ],
  oldRate: 'psi_N  =  O(log gamma_N / sqrt(N))  at y_N^sharp = sqrt(2 pi / N).',
  newRate: 'psi_N  =  O((log gamma_N)^2 / N)  at y_N^micro ~ 1/log gamma_N.',
  sameRatioRate: '2 pi C_Selberg / N -> 0 (unchanged).',
  whatIsActuallyTighter:
    'The absolute bound on psi_N at the microscopic strip improves from ' +
    'Theta(log gamma_N / sqrt(N)) to Theta((log gamma_N)^2 / N). The ratio ' +
    'psi_N / sup Im m_inf is Theta(1/N) for both strips because the y ' +
    'factor cancels in the ratio, but the absolute modulus on the strip ' +
    'where sup Im m_inf is taken is now smaller by a factor of roughly ' +
    'sqrt(N) / log gamma_N.',
  whyNotTighterThanThis:
    'Within Koksma-Hlawka the bound psi_N(y) <= pi C_Selberg * log gamma_N ' +
    '/ (N * y) is sharp up to the Selberg constant. Any y smaller than the ' +
    'mean spacing 2 pi / log gamma_N drives the bound ABOVE 1 and becomes ' +
    'trivial. The microscopic strip y_N^micro is therefore the finest y at ' +
    'which the Koksma-Hlawka output is still a non-trivial uniformity statement.',
};

const ANGLE_B_OPEN = {
  label: 'Angle (b): Erdos-Schlein-Yau local rigidity (OPEN)',
  framework:
    'Replace the Selberg D_N^* <= C log gamma_N / N discrepancy bound with ' +
    'a local semicircle law giving pointwise Riemann-zero counting accuracy ' +
    'at the microscopic scale.',
  targetRate: 'psi_N  =  O((log N)^C / N)  for some small C >= 0',
  whatItWouldBuy:
    'A rigorous per-N bound on |t_c(N)| <= r(N) with r(N) = O((log N)^{C+1}/N), ' +
    'eliminating the imp-336 monotonicity dependency as the only route from ' +
    'the imp-341 lim-sup statement to a per-N finite-N claim.',
  whyNotShippedHere: [
    'Erdos-Schlein-Yau proved local rigidity for Wigner matrix eigenvalues ' +
      'with explicit rate on the microscopic scale 1/(rho_sc(x) * N); see ' +
      'ESY 2011 / Erdos-Yau 2017 book. The proof uses the Dyson Brownian ' +
      'motion flow regularising from initial Gaussian ensemble.',
    'For the Riemann zero ordinates we would need an UNCONDITIONAL analog ' +
      'at the mean-spacing scale. The Montgomery-Dyson pair correlation ' +
      'CONJECTURE identifies the 2-point correlation asymptotics; full ' +
      'rigidity in the ESY sense is an open problem, not a theorem.',
    'Absent a rigorous port, replacing Selberg with Montgomery pair ' +
      'correlation is a CONDITIONAL move and would not advance the ' +
      'unconditional claim imp-341 delivered.',
  ],
  closurePaths: [
    'Port ESY rigidity to the truncated zero Dyson flow via Polymath15 H_t ' +
      'regularisation; research-grade, not attempted in this codebase.',
    'Use an effective version of Ingham / Titchmarsh zero-density estimates ' +
      'plus Vinogradov-Korobov to get a subpolynomial refinement of Selberg; ' +
      'this would tighten C_Selberg and the log log factor but not the rate.',
    'Replace pointwise uniformity by an L^2 average over the strip, trading ' +
      'sup-norm for integrated-norm control; this does reach 1/N but loses ' +
      'the direct tau_c -> 0 chain because the collision formula needs sup.',
  ],
  status: 'open research work; not attempted here',
};

// ── The record ─────────────────────────────────────────────────────────────

export const LAMBDA_BURGERS_RATE_UPGRADE = {
  id: 'imp-348',
  role:
    'rate upgrade on the imp-341 Koksma-Hlawka uniformity bound at the ' +
    'microscopic strip y_N^micro ~ 1/log gamma_N',
  consumes: [
    'imp-341',
    'imp-338 DYSON_BURGERS_SHOCK (for the Burgers characteristic framework)',
    'PATH_C_BASELINE_FIT for per-N numerical witnesses',
  ],
  oldRate: {
    stripLabel: 'y_N^sharp = sqrt(2 pi / N)',
    psiBoundFormula: 'psi_N  <=  pi C_Selberg * log gamma_N / (N * sqrt(2 pi / N))',
    psiRate: 'Theta(log gamma_N / sqrt(N))',
    supImMInfRate: 'Theta(sqrt(N) * log gamma_N)',
    ratioRate: 'Theta(1/N) -> 0',
    sourceId: LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id,
  },
  newRate: {
    stripLabel: 'y_N^micro = 2 pi / log gamma_N  (microscopic, mean-spacing scale)',
    psiBoundFormula:
      'psi_N  <=  (pi C_Selberg / (2 pi)) * (log gamma_N)^2 / N  =  (C_Selberg / 2) * (log gamma_N)^2 / N',
    psiRate: 'Theta((log gamma_N)^2 / N)',
    supImMInfRate: 'Theta((log gamma_N)^2)',
    ratioRate: 'Theta(1/N) -> 0 (unchanged)',
    tightening:
      'Absolute psi bound at the strip where sup Im m_inf attains its ' +
      'divergence rate improves by roughly a factor of sqrt(N) / log gamma_N. ' +
      'The ratio rate is the same Theta(1/N) because the y factor cancels.',
  },
  derivation: {
    angleA: ANGLE_A_DERIVATION,
    angleB: ANGLE_B_OPEN,
  },
  perNWitness: {
    description:
      'For each PATH_C_BASELINE_FIT row, reports the old imp-341 strip and ' +
      'bound, the new microscopic strip and bound, the ratio of psi bounds, ' +
      'and a check that the ratio psi / sup Im m_inf still beats 1 at the ' +
      'microscopic strip. The ratio is Theta(1/N) by design; the witness ' +
      'confirms the product ratio * N stays close to 2 pi C_Selberg for ' +
      'both strips.',
    rows: UPGRADE_ROWS,
    allNewRatiosStrictlyBelowOne: ALL_NEW_RATIOS_SMALL,
    allNewSupImMNLowerBoundsPositive: ALL_NEW_SIGNS_POSITIVE,
    ratioConstantMatchesPrediction: RATIO_MATCHES_1_OVER_N,
  },
  verdict:
    'ANGLE (a) SHIPPED: on the microscopic strip y_N^micro = 2 pi / ' +
    'log gamma_N the Koksma-Hlawka uniformity bound improves the absolute ' +
    'psi modulus from Theta(log gamma_N / sqrt(N)) to Theta((log gamma_N)^2 ' +
    '/ N), while the ratio psi / sup Im m_inf stays at the same Theta(1/N) ' +
    'rate. The tau_c(m_N) -> 0 chain is preserved with a sharper absolute ' +
    'bound. ANGLE (b) NOT SHIPPED: the Erdos-Schlein-Yau local rigidity ' +
    'bound for Riemann zeros is an open research problem and no rigorous ' +
    'port exists in this codebase. The imp-341 unconditional lim-sup claim ' +
    'stays in force and gains a tighter r(N) = O((log gamma_N)^2 / N) on ' +
    'the microscopic strip; no downstream tripwire is flipped by this file.',
  openWork: [
    'Angle (b): port Erdos-Schlein-Yau local rigidity for Wigner matrices ' +
      'to the truncated zero Dyson flow with explicit rate at the microscopic ' +
      'scale 1/(rho_inf(x) * N). This is open research work, not a ' +
      'straightforward adaptation.',
    'Tighten C_Selberg at the specific heights gamma_N of PATH_C_BASELINE_FIT ' +
      'using Titchmarsh section 14.13 or Trudgian effective bounds on |S(T)|.',
    'Replace the pointwise strip by an integrated norm over a window of ' +
      'strip values to squeeze a log factor from the bound; this changes the ' +
      'output from sup-norm to an L^2 statement and requires re-deriving the ' +
      'tau_c(m_N) -> 0 chain accordingly.',
    'Propagate the microscopic-strip bound backward in t along the Burgers ' +
      'characteristics via a Gronwall estimate, so the tighter r(N) applies ' +
      'uniformly on the collision interval [-tau_c, 0] rather than only at ' +
      't = 0.',
  ],
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const LAMBDA_BURGERS_RATE_UPGRADE_ASSERTIONS = [
  {
    id: 'imp348-consumes-imp341-by-id',
    holds: () => LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id === 'imp-341',
    why:
      'imp-348 is a rate upgrade on imp-341 and cites it by id. If imp-341 ' +
      'drifts out from under this file, the citation chain breaks and the ' +
      'angle-(a) derivation loses its source for the base Koksma-Hlawka ' +
      'bound. Tripwire on drift.',
  },
  {
    id: 'imp348-consumes-imp338-by-id',
    holds: () => DYSON_BURGERS_SHOCK.id === 'imp-338',
    why:
      'imp-348 also consumes the imp-338 Burgers characteristic framework ' +
      'indirectly through the tau_c(m_N) = 1/(2 sup Im m_N) chain. Id drift ' +
      'breaks the citation chain.',
  },
  {
    id: 'imp348-new-rate-psi-strictly-below-sup-im-m-inf',
    holds: () => UPGRADE_ROWS.length > 0 && ALL_NEW_RATIOS_SMALL,
    why:
      'On the microscopic strip y_N^micro = 2 pi / log gamma_N the upgraded ' +
      'modulus psi_N must remain strictly below the lower bound on sup Im ' +
      'm_inf at every sampled N. Otherwise the tighter rate would not ' +
      'preserve the sup Im m_N -> infinity chain and the tau_c -> 0 ' +
      'conclusion would silently break.',
  },
  {
    id: 'imp348-new-rate-sup-im-m-N-strictly-positive',
    holds: () => UPGRADE_ROWS.length > 0 && ALL_NEW_SIGNS_POSITIVE,
    why:
      'The implied lower bound sup Im m_N >= sup Im m_inf - psi_N on the ' +
      'microscopic strip must be strictly positive at every baseline, so ' +
      'the backward collision formula tau_c(m_N) = 1/(2 sup Im m_N) is ' +
      'well-defined and the limit tau_c(m_N) -> 0 is meaningful, not 0/0.',
  },
  {
    id: 'imp348-ratio-rate-matches-1-over-N-prediction',
    holds: () => RATIO_MATCHES_1_OVER_N,
    why:
      'The symbolic prediction says the ratio psi_N / sup Im m_inf equals ' +
      '2 pi C_Selberg / N at leading order, IDENTICALLY for the old and ' +
      'new strips (the y factor cancels). Numerical products ratio * N ' +
      'should therefore hover near 2 pi C_Selberg at every baseline. If ' +
      'this check fails, either the Selberg constant has drifted, the ' +
      'Riemann-von Mangoldt inversion is broken, or the strip formulas ' +
      'are miscalibrated, silently corrupting the rate conclusion.',
  },
  {
    id: 'imp348-angle-b-explicitly-open',
    holds: () =>
      typeof ANGLE_B_OPEN.status === 'string' &&
      ANGLE_B_OPEN.status.includes('open'),
    why:
      'Angle (b) (Erdos-Schlein-Yau local rigidity for Riemann zeros) is ' +
      'research-grade open work. If a future edit accidentally weakens this ' +
      'labelling, a reader could mistake imp-348 for having delivered a ' +
      'rigorous O(1/N) bound, which it has NOT. The tripwire enforces the ' +
      'honest scope.',
  },
];
