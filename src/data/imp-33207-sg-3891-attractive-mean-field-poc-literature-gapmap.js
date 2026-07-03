/**
 * @module imp-33207-sg-3891-attractive-mean-field-poc-literature-gapmap
 *
 * imp-33207 (proof, S-frontier): imp-3891 split the imp-3846 dependency-chain root H2 into a WRITTEN
 * algebraic half H2a (the continuum complex-inviscid-Burgers limit m_s + F(m)_z = 0, F(m) = -m^2) and an
 * OPEN analytic half H2b (the empirical-measure mean-field CONVERGENCE THEOREM for the ATTRACTIVE singular
 * flow), naming the open piece sg-3891-attractive-mean-field-convergence behind three obstructions
 * (O1 singular attractive kernel, O2 finite-time collision shock, O3 uncertified vanishing viscosity).
 * This module ASSESSES that named sub-gap against the propagation-of-chaos / empirical-measure literature:
 * it catalogues the main singular-kernel mean-field convergence theorems, records for each the STRUCTURAL
 * INGREDIENT it relies on, and states precisely why that ingredient is unavailable for the attractive
 * 1/(x_k - x_j) Calogero-Moser kernel of the imp-3642 Dyson flow. It then assembles the list of what a
 * rigorous continuum limit for THIS attractive flow would additionally require that repulsive-kernel
 * results do not supply, and corroborates the central structural fact numerically (necessary, NOT
 * sufficient). Literature-scope / gap map only; no new theorem, no operator positivity, no RH claim, NO QED.
 *
 * THE LITERATURE, KERNEL BY KERNEL (what each theorem needs, why the attractive sign kills it)
 * ------------------------------------------------------------------------------------------
 *   (L1) Sznitman classical propagation of chaos (McKean-Vlasov). Needs a GLOBALLY LIPSCHITZ interaction
 *        kernel; the coupling / empirical-measure estimate is a Gronwall on the Lipschitz constant. The
 *        1/x kernel is not even locally bounded, so this does not touch either sign.
 *   (L2) Rogers-Shi (1993) / Cepa-Lepingle (1997) / Chan -- the repulsive Dyson / Calogero-Moser SDE.
 *        The empirical-measure limit is obtained BECAUSE the strong repulsion +beta/(x_k - x_j) supplies
 *        an a-priori NO-COLLISION estimate (Bessel-type comparison, non-collision of the eigenvalue
 *        process). Flip the sign to the ATTRACTIVE -2/(x_k - x_j) and that a-priori estimate is not merely
 *        weaker -- it is FALSE: the flow drives collisions in finite time. The entire proof scaffold rests
 *        on the ingredient the attractive sign removes.
 *   (L3) Osada (interacting Brownian motions with logarithmic / Ruelle-class potentials). Dirichlet-form /
 *        martingale-problem approach; the singular drift must be LOCALLY FORM-CONTROLLABLE, which uses the
 *        repulsive potential to make the reference Gibbs measure integrable near coincidence points. The
 *        attractive potential concentrates mass at coincidences, so the reference measure is not locally
 *        integrable and the form is not closable by this route.
 *   (L4) Serfaty modulated-energy / Duerinckx (quantitative mean field for Coulomb and Riesz gases). The
 *        estimate controls the MODULATED ENERGY E(mu_M, mu) = (1/2) int int g(x - y) d(mu_M - mu)(x)
 *        d(mu_M - mu)(y) and Gronwalls it. This works BECAUSE the kernel g is positive-definite (repulsive):
 *        E >= 0 with coercivity in a negative Sobolev norm. For the ATTRACTIVE sign g flips sign, E loses
 *        its lower bound and its coercivity, so the modulated-energy Gronwall collapses -- there is no
 *        positive functional to close on.
 *   (L5) Jabin-Wang (relative-entropy method, W^{-1,inf} / bounded-divergence kernels). Controls the
 *        relative entropy H(mu_M | mu) via a large-deviation / law-of-large-numbers term whose GOOD SIGN
 *        needs the kernel to be repulsive (or at least not concentrating). The attractive 1/x is both too
 *        singular (outside W^{-1,inf}) and sign-wrong, so the entropy dissipation term does not have the
 *        sign the estimate requires.
 *   (L6) Fournier-Jourdain / Fournier-Hauray-Mischler (2D vortex, Biot-Savart). Handles a genuinely
 *        singular kernel, but it is the DIVERGENCE-FREE antisymmetric Biot-Savart kernel (no gradient /
 *        no attraction-to-collision structure) and the argument leans on that incompressible geometry.
 *        The 1D attractive gradient flow has neither the divergence-free structure nor a no-collision law,
 *        so this route does not transfer.
 * Common thread: EVERY off-the-shelf singular-kernel mean-field theorem buys its empirical-measure limit
 * with a REPULSION-supplied ingredient -- an a-priori no-collision estimate (L2/L3), a coercive modulated
 * energy (L4), a good-sign entropy dissipation (L5), or a divergence-free geometry (L6). The attractive
 * Calogero-Moser sign removes exactly that ingredient in each case. So the answer to the sub-gap question
 * is: NO existing propagation-of-chaos theorem covers the attractive singular 1/x flow, and the obstruction
 * is structural, not a matter of sharpening constants.
 *
 * WHAT A RIGOROUS CONTINUUM LIMIT FOR THE ATTRACTIVE FLOW WOULD ADDITIONALLY REQUIRE
 * ---------------------------------------------------------------------------------
 * (beyond what any repulsive-kernel result supplies)
 *   (R1) A controlled-collision / regularized no-collision estimate up to tau_c. Repulsive proofs GET
 *        no-collision for free; the attractive flow must instead supply quantitative control of the
 *        minimum gap on [0, tau_c) (it necessarily fails AT tau_c). This replaces O1 with a positive task.
 *   (R2) A NEW coercive functional replacing the modulated energy. Since the log / Riesz modulated energy
 *        is not coercive at the attractive sign (L4), a substitute Lyapunov functional with a definite
 *        sign along the attractive flow is required -- or a different (e.g. optimal-transport / entropy-
 *        solution) metric in which convergence is stable.
 *   (R3) A shock-consistent notion of solution and convergence THROUGH the caustic. The inviscid limit
 *        m_s = 2 m m_z shocks at tau_c; a rigorous limit must select the entropy/viscosity solution past
 *        the shock (Kruzhkov-type), an object repulsive smooth-flow results never need. This is exactly the
 *        downstream T1..T4 entropy-solution toolkit, so H2b cannot be closed independently of G6a K4.
 *   (R4) Uniform microscopic vanishing-viscosity control m_zz -> 0 as y -> 0 (imp-3891 O3). imp-3872 only
 *        measured the shrink on the clean window y_star/d in [2, 8]; the mean-field limit lives at y -> 0.
 *
 * NUMERICAL CORROBORATION (necessary structural fact, NOT the theorem)
 * -------------------------------------------------------------------
 * The single fact that all of L2/L3/L4/L5 hinge on is that the REPULSIVE flow keeps particles apart while
 * the ATTRACTIVE flow drives them together. We demonstrate it directly by running the SAME jittered seed
 * lattice under both signs of the Calogero-Moser velocity dx_k/ds = -+2 sum_{j != k} 1/(x_k - x_j) and
 * tracking two diagnostics along a short RK4 flow (stopped safely before any collision):
 *   (D1) MIN-GAP: the minimum nearest-neighbour spacing. Under the attractive sign it DECREASES (approach
 *        to the finite-time collision tau_c -- the a-priori no-collision estimate of L2/L3 is absent);
 *        under the repulsive sign it INCREASES (particles spread -- the estimate holds).
 *   (D2) LOG-ENERGY L = sum_{j < k} log|x_j - x_k| (the log-gas Lyapunov functional). The attractive flow
 *        is gradient DESCENT on L (dL/ds = -2 sum_k (grad_k L)^2 <= 0, driving L -> -inf at collision), so
 *        L is unbounded below and supplies NO a-priori control; the repulsive flow is gradient ASCENT
 *        (dL/ds >= 0), so L is a coercive Lyapunov function -- the exact L4 modulated-energy dichotomy.
 * This corroborates the structural gap map; it certifies NOTHING about the continuum theorem itself (that
 * remains sg-3891-attractive-mean-field-convergence, OPEN).
 *
 * VERDICT
 * -------
 * ASSESSMENT (literature-scope, NOT rigorous): no propagation-of-chaos / empirical-measure mean-field
 * convergence theorem in the singular-kernel literature (Sznitman; Rogers-Shi / Cepa-Lepingle / Chan;
 * Osada; Serfaty / Duerinckx modulated energy; Jabin-Wang relative entropy; Fournier-Jourdain 2D vortex)
 * covers the ATTRACTIVE singular 1/(x_k - x_j) Calogero-Moser kernel of the imp-3642 Dyson flow. Every one
 * buys its limit with a repulsion-supplied ingredient -- a-priori no-collision, coercive modulated energy,
 * good-sign entropy dissipation, or divergence-free geometry -- and the attractive sign removes precisely
 * that ingredient. A rigorous continuum limit for the attractive flow would additionally require R1 a
 * controlled-collision estimate up to tau_c, R2 a new coercive Lyapunov functional (the log/Riesz
 * modulated energy is not coercive at this sign), R3 a shock-consistent entropy-solution notion of
 * convergence through the caustic (coupling H2b to the downstream G6a K4 T1..T4 toolkit, so H2b cannot be
 * closed in isolation), and R4 uniform microscopic vanishing-viscosity control (imp-3891 O3). The central
 * repulsive-vs-attractive structural fact is corroborated numerically (D1 min-gap collapse / D2 log-energy
 * descent under the attractive sign vs spread / ascent under the repulsive sign). So sg-3891-attractive-
 * mean-field-convergence stays OPEN and its obstruction is STRUCTURAL, not constant-sharpening. Literature
 * scope / gap map only; no new theorem, no operator positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains
 * the rigorous SOTA.
 *
 * @see imp-3891-g6a-h2-continuum-inviscid-burgers-meanfield-scoping (names H2b / the sub-gap this assesses)
 * @see imp-3872-g6a-h2-discrete-flux-convexity-probe (the exact finite-N identity m_s = 2 m m_z + m_zz)
 * @see imp-3846-g6a-k4-caustic-regularity-toolkit-assessment (names H2 the dependency root; T1..T4 tools)
 * @see imp-3727-g6a-k4-entropy-solution-regularity-scoping (the entropy-solution notion R3 points to)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (the attractive-CM RK4 flow, seed reused)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

const TWO_PI = 2 * Math.PI;
const LOG_ANCHOR = 9.1981; // imp-3642 anchor log gamma_{N*} (shared with imp-3891)

const D_ANCHOR = 1 / (Math.log(Math.exp(LOG_ANCHOR) / TWO_PI) / TWO_PI); // imp-3642 anchor spacing

// ── shared seed lattice (same jitter recipe as imp-3891, small block for a fast twin-sign flow) ──
const BLOCK_M = 15;
function seedBlock(d, M) {
  const xs = new Array(M);
  for (let k = 0; k < M; k++) {
    const base = (k - (M - 1) / 2) * d;
    const jitter = 0.15 * d * Math.sin(2.4 * k) + 0.07 * d * Math.cos(5.1 * k);
    xs[k] = base + jitter;
  }
  return xs;
}

// Calogero-Moser velocity with an explicit sign: sign = -1 attractive, sign = +1 repulsive.
function cmVelocities(xs, sign) {
  const n = xs.length;
  const v = new Array(n).fill(0);
  for (let k = 0; k < n; k++) {
    let s = 0;
    for (let j = 0; j < n; j++) if (j !== k) s += sign * 2 / (xs[k] - xs[j]);
    v[k] = s;
  }
  return v;
}

function minGap(xs) {
  const s = xs.slice().sort((a, b) => a - b);
  let g = Infinity;
  for (let k = 1; k < s.length; k++) g = Math.min(g, s[k] - s[k - 1]);
  return g;
}

// log-gas Lyapunov functional L = sum_{j<k} log|x_j - x_k|
function logEnergy(xs) {
  let L = 0;
  for (let k = 0; k < xs.length; k++)
    for (let j = 0; j < k; j++) L += Math.log(Math.abs(xs[k] - xs[j]));
  return L;
}

// short RK4 flow at fixed sign; dt chosen so the total drift stays well below the initial min gap
// (stopped safely before any collision, so the trend is a clean gradient monotonicity, not a blow-up).
const STEPS = 60;
function flowTrend(d, M, sign) {
  let xs = seedBlock(d, M);
  const gap0 = minGap(xs);
  const L0 = logEnergy(xs);
  const v0 = cmVelocities(xs, sign);
  const vmax = v0.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const dt = (0.25 * gap0) / (vmax * STEPS); // cumulative drift ~ 0.25 * gap0 over the whole flow
  for (let step = 0; step < STEPS; step++) {
    const k1 = cmVelocities(xs, sign);
    const x2 = xs.map((x, i) => x + 0.5 * dt * k1[i]);
    const k2 = cmVelocities(x2, sign);
    const x3 = xs.map((x, i) => x + 0.5 * dt * k2[i]);
    const k3 = cmVelocities(x3, sign);
    const x4 = xs.map((x, i) => x + dt * k3[i]);
    const k4 = cmVelocities(x4, sign);
    xs = xs.map((x, i) => x + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }
  const gapEnd = minGap(xs);
  const Lend = logEnergy(xs);
  return { gap0, gapEnd, L0, Lend };
}

const ATTRACTIVE = flowTrend(D_ANCHOR, BLOCK_M, -1);
const REPULSIVE = flowTrend(D_ANCHOR, BLOCK_M, +1);

// D1: min-gap collapses under attraction, spreads under repulsion.
const D1_ATTRACTIVE_GAP_SHRINKS = ATTRACTIVE.gapEnd < ATTRACTIVE.gap0;
const D1_REPULSIVE_GAP_GROWS = REPULSIVE.gapEnd > REPULSIVE.gap0;
// D2: log-energy descends under attraction (no lower bound), ascends under repulsion (coercive Lyapunov).
const D2_ATTRACTIVE_LOGE_DESCENDS = ATTRACTIVE.Lend < ATTRACTIVE.L0;
const D2_REPULSIVE_LOGE_ASCENDS = REPULSIVE.Lend > REPULSIVE.L0;

// ── the literature gap map: each theorem, its repulsion-supplied ingredient, why the attractive sign kills it ──
const LITERATURE_GAP_MAP = [
  {
    id: 'L1',
    result: 'Sznitman classical propagation of chaos (McKean-Vlasov)',
    ingredient: 'globally Lipschitz interaction kernel (Gronwall on the Lipschitz constant)',
    breaks: 'the 1/x kernel is not even locally bounded -- inapplicable to either sign',
  },
  {
    id: 'L2',
    result: 'Rogers-Shi / Cepa-Lepingle / Chan repulsive Dyson-Calogero-Moser SDE',
    ingredient: 'a-priori NO-COLLISION estimate supplied by the strong repulsion (Bessel comparison)',
    breaks: 'the attractive sign makes that estimate FALSE -- the flow drives finite-time collisions',
  },
  {
    id: 'L3',
    result: 'Osada interacting Brownian motions (logarithmic / Ruelle-class potentials)',
    ingredient: 'local form-controllability of the singular drift via a repulsive integrable Gibbs measure',
    breaks: 'the attractive potential concentrates mass at coincidences -- reference measure not locally integrable',
  },
  {
    id: 'L4',
    result: 'Serfaty / Duerinckx modulated-energy mean field (Coulomb / Riesz gases)',
    ingredient: 'a coercive modulated energy E >= 0 (positive-definite repulsive kernel g)',
    breaks: 'at the attractive sign g flips, E loses its lower bound and coercivity -- the Gronwall collapses',
  },
  {
    id: 'L5',
    result: 'Jabin-Wang relative-entropy method (W^{-1,inf} kernels)',
    ingredient: 'good-sign entropy dissipation from a repulsive / bounded-divergence kernel',
    breaks: 'the attractive 1/x is too singular (outside W^{-1,inf}) and sign-wrong -- dissipation term wrong sign',
  },
  {
    id: 'L6',
    result: 'Fournier-Jourdain / Fournier-Hauray-Mischler 2D vortex (Biot-Savart)',
    ingredient: 'divergence-free antisymmetric geometry (no attraction-to-collision structure)',
    breaks: 'the 1D attractive gradient flow has neither divergence-free structure nor a no-collision law',
  },
];

// ── what a rigorous attractive continuum limit would additionally require ──
const ADDITIONAL_REQUIREMENTS = [
  {
    id: 'R1',
    need: 'controlled-collision / regularized no-collision estimate up to tau_c',
    notSuppliedBecause: 'repulsive proofs get no-collision for free; the attractive flow must supply it and it fails AT tau_c',
  },
  {
    id: 'R2',
    need: 'a new coercive Lyapunov functional replacing the modulated energy',
    notSuppliedBecause: 'the log / Riesz modulated energy is not coercive at the attractive sign (L4)',
  },
  {
    id: 'R3',
    need: 'a shock-consistent entropy-solution notion of convergence THROUGH the caustic',
    notSuppliedBecause: 'the inviscid limit shocks at tau_c; couples H2b to the downstream G6a K4 T1..T4 toolkit, so H2b is not independently closable',
  },
  {
    id: 'R4',
    need: 'uniform microscopic vanishing-viscosity control m_zz -> 0 as y -> 0',
    notSuppliedBecause: 'imp-3872 measured the shrink only on y_star/d in [2, 8]; the mean-field limit lives at y -> 0 (imp-3891 O3)',
  },
];

export const IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP = {
  id: 'imp-33207',
  proofSection: 'S-frontier',
  question:
    'ASSESS the named open sub-gap sg-3891-attractive-mean-field-convergence: scope from the ' +
    'propagation-of-chaos / empirical-measure literature whether any rigorous mean-field convergence ' +
    'theorem covers the ATTRACTIVE singular 1/(x_k - x_j) Calogero-Moser kernel of the imp-3642 Dyson flow, ' +
    'and identify precisely what a rigorous continuum limit for this attractive flow would require that ' +
    'repulsive-kernel results do not supply. Literature-scope only, no QED.',
  subGapAssessed: 'sg-3891-attractive-mean-field-convergence',
  literatureGapMap: LITERATURE_GAP_MAP,
  commonThread:
    'every off-the-shelf singular-kernel mean-field theorem buys its empirical-measure limit with a ' +
    'REPULSION-supplied ingredient (a-priori no-collision, coercive modulated energy, good-sign entropy ' +
    'dissipation, or divergence-free geometry); the attractive Calogero-Moser sign removes exactly that ' +
    'ingredient in each case',
  coversAttractiveKernel: false, // no existing theorem applies
  obstructionIsStructural: true, // not a matter of sharpening constants
  additionalRequirements: ADDITIONAL_REQUIREMENTS,
  // numerical corroboration of the central repulsive-vs-attractive structural fact
  numericalCorroboration: {
    blockSize: BLOCK_M,
    spacing: +D_ANCHOR.toFixed(6),
    steps: STEPS,
    d1MinGap: {
      attractive: { gap0: +ATTRACTIVE.gap0.toExponential(4), gapEnd: +ATTRACTIVE.gapEnd.toExponential(4), shrinks: D1_ATTRACTIVE_GAP_SHRINKS },
      repulsive: { gap0: +REPULSIVE.gap0.toExponential(4), gapEnd: +REPULSIVE.gapEnd.toExponential(4), grows: D1_REPULSIVE_GAP_GROWS },
      meaning: 'attraction drives toward the finite-time collision (no-collision estimate absent); repulsion spreads',
    },
    d2LogEnergy: {
      attractive: { L0: +ATTRACTIVE.L0.toFixed(6), Lend: +ATTRACTIVE.Lend.toFixed(6), descends: D2_ATTRACTIVE_LOGE_DESCENDS },
      repulsive: { L0: +REPULSIVE.L0.toFixed(6), Lend: +REPULSIVE.Lend.toFixed(6), ascends: D2_REPULSIVE_LOGE_ASCENDS },
      meaning: 'L is gradient-descended (unbounded below, no control) by attraction and ascended (coercive Lyapunov) by repulsion -- the L4 dichotomy',
    },
    certifies: 'the structural gap map only; NOT the continuum theorem (that stays sg-3891-attractive-mean-field-convergence, OPEN)',
  },
  isRigorous: false,
  subGapStillOpen: true,
  k4ConfirmedWhollyNew: true,
  g6aStillOpen: true,
  verdict:
    'ASSESSMENT (literature-scope, NOT rigorous): NO propagation-of-chaos / empirical-measure mean-field ' +
    'convergence theorem in the singular-kernel literature (Sznitman; Rogers-Shi / Cepa-Lepingle / Chan; ' +
    'Osada; Serfaty / Duerinckx modulated energy; Jabin-Wang relative entropy; Fournier-Jourdain 2D vortex) ' +
    'covers the ATTRACTIVE singular 1/(x_k - x_j) Calogero-Moser kernel of the imp-3642 Dyson flow. Each buys ' +
    'its limit with a repulsion-supplied ingredient -- an a-priori no-collision estimate (L2/L3), a coercive ' +
    'modulated energy (L4), a good-sign entropy dissipation (L5), or a divergence-free geometry (L6) -- and ' +
    'the attractive sign removes precisely that ingredient, so the obstruction is STRUCTURAL, not a matter of ' +
    'sharpening constants. A rigorous continuum limit for the attractive flow would additionally require: R1 a ' +
    'controlled-collision estimate up to tau_c (repulsive proofs get no-collision for free; the attractive ' +
    'flow must supply it and it fails AT tau_c); R2 a new coercive Lyapunov functional (the log / Riesz ' +
    'modulated energy is not coercive at this sign); R3 a shock-consistent entropy-solution notion of ' +
    'convergence THROUGH the caustic, coupling H2b to the downstream G6a K4 T1..T4 toolkit so H2b is not ' +
    'independently closable; and R4 uniform microscopic vanishing-viscosity control m_zz -> 0 as y -> 0 ' +
    '(imp-3891 O3). The central repulsive-vs-attractive structural fact is corroborated numerically: the ' +
    'SAME seed lattice run under both signs shows the min gap COLLAPSING and the log-energy L DESCENDING ' +
    'under attraction (no a-priori control) versus SPREADING and ASCENDING under repulsion (coercive ' +
    'Lyapunov) -- the exact L4 modulated-energy dichotomy. So sg-3891-attractive-mean-field-convergence ' +
    'stays OPEN; the K4 route stays WHOLLY NEW and G6a_shock_lipschitz stays OPEN. Literature scope / gap map ' +
    'only; no new theorem, no operator positivity, no bridge closure, no RH claim, NO QED. imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the ' +
    'rigorous SOTA.',
  citation:
    'imp-3891 (names H2b / sg-3891-attractive-mean-field-convergence, the sub-gap this assesses); imp-3872 ' +
    '(exact finite-N identity m_s = 2 m m_z + m_zz); imp-3846 (names H2 the dependency root, T1..T4 tools); ' +
    'imp-3727 (entropy-solution regularity R3 points to); imp-3642 (attractive-CM RK4 flow, seed reused); ' +
    'literature: Sznitman McKean-Vlasov PoC; Rogers-Shi / Cepa-Lepingle / Chan repulsive Dyson mean field; ' +
    'Osada interacting Brownian motions; Serfaty / Duerinckx modulated energy; Jabin-Wang relative entropy; ' +
    'Fournier-Jourdain / Fournier-Hauray-Mischler 2D vortex; lambda-roadmap Step 4 (Polymath15 bridge, open ' +
    'sub-gap G6a_shock_lipschitz).',
};

export const IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP_ASSERTIONS = [
  {
    // D1: the SAME seed shows min-gap collapse under attraction and spread under repulsion (no-collision
    // estimate present only for the repulsive sign) -- the L2/L3 dichotomy.
    id: 'imp33207-d1-mingap-attractive-collapse-repulsive-spread',
    description: 'min gap shrinks under the attractive sign and grows under the repulsive sign (a-priori no-collision only exists for repulsion)',
    holds: () => D1_ATTRACTIVE_GAP_SHRINKS === true && D1_REPULSIVE_GAP_GROWS === true,
  },
  {
    // D2: the log-gas Lyapunov functional descends (unbounded below) under attraction and ascends (coercive)
    // under repulsion -- the L4 modulated-energy sign dichotomy.
    id: 'imp33207-d2-logenergy-attractive-descent-repulsive-ascent',
    description: 'log-energy L descends under attraction (no control) and ascends under repulsion (coercive Lyapunov) -- L4 dichotomy',
    holds: () => D2_ATTRACTIVE_LOGE_DESCENDS === true && D2_REPULSIVE_LOGE_ASCENDS === true,
  },
  {
    // The gap map lists exactly the six catalogued theorems, none of which covers the attractive kernel,
    // and the assessment records the obstruction as structural.
    id: 'imp33207-gapmap-no-theorem-covers-attractive-structural',
    description: 'six catalogued theorems, none covers the attractive kernel, obstruction is structural',
    holds: () =>
      LITERATURE_GAP_MAP.length === 6 &&
      IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.coversAttractiveKernel === false &&
      IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.obstructionIsStructural === true &&
      ADDITIONAL_REQUIREMENTS.length === 4,
  },
  {
    // Honesty gate: literature-scope only, sub-gap stays open, K4 wholly new, G6a open, no QED, PT SOTA,
    // imp-3066 untouched.
    id: 'imp33207-honesty-gate-no-qed',
    description: 'literature-scope only: sub-gap open, K4 wholly new, G6a open, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.isRigorous === false &&
      IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.subGapStillOpen === true &&
      IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.k4ConfirmedWhollyNew === true &&
      IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.g6aStillOpen === true &&
      /NO QED/.test(IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.verdict) &&
      /remains the\s+rigorous SOTA/.test(IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP.verdict),
  },
];

for (const a of IMP33207_SG3891_ATTRACTIVE_MEAN_FIELD_POC_LITERATURE_GAPMAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33207-sg-3891-attractive-mean-field-poc-literature-gapmap assertion failed: ${a.id}`);
  }
}
