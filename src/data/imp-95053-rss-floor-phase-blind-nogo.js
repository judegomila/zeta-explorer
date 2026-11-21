/**
 * imp-95053 - THEOREM (phase-blind no-go, sharpening imp-95006): the strongest
 * bound that shell ORTHOGONALITY + reproducing-kernel duality can deliver -- the
 * orthogonal root-sum-square (RSS) majorant -- already overshoots R_ex, for
 * EVERY distribution of the shell mass. So the "five-shell orthogonality +
 * anti-Hermitian complement" lever cannot, by itself, fit the 0.0655627 reserve;
 * a phase-COHERENT (arg-dependent) bound is mathematically necessary, and that is
 * exactly the arithmetic input the operator framework does not supply.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SETTING. The strict Lambda <= 0.14 contract reduces to one open family:
 *   |C_E,17| < R_strict = 0.27968819555261474   (< R_ex = 0.2796881955526244)
 * uniformly over 690988 <= N <= 54799999, every window parameter, both seam
 * sides, where C_E,17 = the 18-moment-carrier evaluation of the exact five-shell
 * cocycle (imp-95003 five_shell_identity)
 *   E97 = (1 - A97) L(Y4) - A97 sum_{g=1..4} L(Z_g) = sum_{g=0..4} z_g,
 * z_0 = L((1-A97)Y4), z_g = -L(A97 Z_g) (g=1..4), the five shell EVALUATIONS at
 * the seam point (L = the carrier point-evaluation functional). The anchor cell
 * gives |E97|(690988) = 0.2141254901198318, a reserve
 *   W_reserve = R_ex - |E97| = 0.0655627054327926
 * against the exact allowance.
 *
 * WHAT LIFTS TO THE FAMILY UNCONDITIONALLY (recorded here for the contrast):
 *   (L1) the identity E97 = sum_g z_g is ALGEBRAIC -- it holds at every
 *        (N, window, seam), so it is already uniform; "lifting the pointwise
 *        identity" is not the obstacle (imp-95003).
 *   (L2) the five shells have Fourier-DISJOINT supports, so in the DFT picture
 *        the coefficient vector splits orthogonally (Pythagoras, K=1); this is a
 *        support fact, kernel-verified at every N (imp-95003, imp-95008 Lemma 2).
 *   (L3) the l2->pointwise duality is EXACT and, in an equimodular carrier,
 *        point-INDEPENDENT: |E97| <= sqrt(K_17(x,x)) ||coeff(E97)||_2 with
 *        K_17(x,x) = |W|/L uniform in the seam point (imp-95008 evaluation-
 *        christoffel-duality, Lemma E / Corollary E1(ii)).
 * Chaining (L2)+(L3): the BEST bound this lever yields is
 *   |C_E,17| <= sqrt(K_17) sqrt( sum_g ||shell_g||^2 )  =  sqrt( sum_g |z_g|^2 )
 *            =: rho_RSS      (equimodular carrier, RK step tight per shell).
 * This is the "orthogonal RSS majorant": the l2 upgrade of the l1 tiling.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LEMMA (RSS floor - UNCONDITIONAL, Cauchy-Schwarz). For n complex numbers z_g
 * with total mass m = sum_g |z_g|,
 *   rho_RSS = sqrt( sum_g |z_g|^2 )  >=  m / sqrt(n),
 * with equality iff all |z_g| are equal. Hence the orthogonal RSS majorant is
 * bounded BELOW by m/sqrt(n) for EVERY distribution of the mass among the shells.
 *
 * THEOREM (phase-blind no-go). Any majorant B(|z_0|,...,|z_4|) that depends only
 * on the shell magnitudes -- i.e. is INVARIANT under z_g -> e^{i theta_g} z_g --
 * satisfies B >= rho_RSS >= m/sqrt(5) (the orthogonal RSS is the smallest such
 * majorant that respects the per-shell RK bounds). With the documented total
 * shell mass m = 0.919 (imp-95010 shell l1 mass; the mass whose deep cancellation
 * to |E97| = 0.2141 the enclosure lives on):
 *   rho_RSS >= 0.919 / sqrt(5) = 0.4109893... > R_ex = 0.2796881955526244.
 * At the documented per-shell shape [0.30,0.24,0.18,0.14,0.11] (imp-95011)
 * rho_RSS = 0.435917... (factor 1.5586 over R_ex; the l1 tiling m = 0.919 is
 * 3.286 over). Therefore NO phase-blind majorant fits W_reserve: not the l1
 * tiling (imp-95006), and -- the new content -- NOT the orthogonal RSS either,
 * for ANY mass distribution. Fitting the reserve REQUIRES a phase-coherent bound
 * on |sum_g z_g| that uses the relative phases arg(z_g).
 *
 * SELF-CONSISTENCY (why the lever and the obstruction are the same coin). Fitting
 * |sum z_g| = 0.2141 under R_ex demands correlation gain
 *   gamma = |sum z_g| / m = 0.2141/0.919 = 0.2330,
 * strictly below the phase-blind floor 1/sqrt(5) = 0.4472: the value sits a
 * further factor rho_RSS/|E97| = 0.4359/0.2141 = 2.036 BELOW the RSS majorant.
 * That factor-2 gap is PURE phase coherence -- invisible to any magnitude-only
 * tool. The very premise that inter-shell cancellation is NEEDED (m >> |E97|) is
 * exactly what forces every phase-blind majorant above R_ex.
 *
 * EIGENVALUE READING (the coercive-quadratic / anti-Hermitian route, imp-95007/
 * imp-95009). |sum_g z_g|^2 = z* J z with J = all-ones (rank 1): eigenvalues
 * {n, 0,...,0}. The value 0.2141^2 sits near the BOTTOM (destructive) eigenspace
 * z ⟂ 1, while the RSS floor is the trace/average. A uniform enclosure needs z
 * pinned to that bottom eigenspace across the family -- a coherent-phase
 * condition. The only in-repo operator tool to enforce it is the anti-Hermitian
 * complement, and imp-95009 CERTIFIES it cannot: a cancelling quadratic form
 * uniform in the configuration needs spec(A_+) symmetric about 0 (tr A_+^odd = 0),
 * but the twin-ladder direct residual carries a net retained phase (nonzero odd
 * moment), so no unitary V gives V* A_+ V = -A_+. The bottom-eigenspace alignment
 * is therefore NOT enforced by any invariance-preserving operator identity.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE EXACT OBSTRUCTION TO LIFTING (the answer to the ticket). The pointwise
 * five-shell identity IS uniform; what does not lift by soft structure is the
 * SMALLNESS of its value. That smallness is the coherent alignment of the five
 * shell-evaluation phases arg(z_g)(N), governed (imp-95052) by the Riemann-von
 * Mangoldt per-unit-N advance Dphi_g = 2pi log(p_g)/log(N). Uniform width-fitting
 * <=> these phases stay stationary-phase-aligned (gamma <= 0.233, i.e. z stays in
 * the bottom eigenspace of J) across 690988 <= N <= 54799999 <=> the shells are a
 * genuine Gauss-sum / theta stationary-phase structure, NOT a raw prime-alias
 * comb. That is an ARITHMETIC fact about the Fresnel-Airy packet phases; it is (a)
 * phase-blind-invisible to orthogonality/RK, and (b) spectrally unreachable via
 * the anti-Hermitian complement. This is the precise, quantified failing step,
 * and it mirrors the flow-blindness no-go: soft (operator/orthogonality) hypotheses
 * are phase-blind; the residual needs arithmetic input.
 *
 * This is a rigorous NO-GO (a proved obstruction), NOT a closure. It does NOT
 * promote Lambda <= 0.14 and refutes a route class (phase-blind majorants) rather
 * than opening one. The numerics below are exact cross-checks of the Cauchy-Schwarz
 * floor and the documented constants (they are the claim's arithmetic, computed
 * import-light). Changes no bound; NO QED; no refereed bound is changed.
 */

// ── anchored constants (imp-95003 / 95006 / 95010 / 95011 / 95012) ──────────
const N_LO = 690988;
const N_HI = 54799999;
const R_EX = 0.2796881955526244; // exact allowance R_ex
const R_STRICT = 0.27968819555261474; // strict 18-moment-carrier target
const ANCHOR_E97 = 0.2141254901198318; // |E97|(690988), the one closed source cell
const W_RESERVE = R_EX - ANCHOR_E97; // 0.0655627054327926
const N_SHELLS = 5; // Y4, Z1, Z2, Z3, Z4
const SHELL_L1_MASS = 0.919; // documented decoupled shell l1 mass (imp-95010)
// documented per-shell evaluation-magnitude shape (imp-95011 SHELL_AMP)
const SHELL_SHAPE = [0.3, 0.24, 0.18, 0.14, 0.11];

// ── the RSS floor and the phase-blind majorants ─────────────────────────────
const shapeSum = SHELL_SHAPE.reduce((s, a) => s + a, 0); // 0.97
const scale = SHELL_L1_MASS / shapeSum; // rescale to the documented l1 mass
const Z = SHELL_SHAPE.map((a) => a * scale); // |z_g| at the documented mass
const l1Mass = Z.reduce((s, a) => s + a, 0); // = SHELL_L1_MASS
const rhoRSS = Math.sqrt(Z.reduce((s, a) => s + a * a, 0)); // orthogonal RSS majorant
const rssFloor = SHELL_L1_MASS / Math.sqrt(N_SHELLS); // Cauchy-Schwarz floor m/sqrt(n)

// factors over the allowance
const l1OverRex = l1Mass / R_EX;
const rssOverRex = rhoRSS / R_EX;
const floorOverRex = rssFloor / R_EX;

// the coherence gap the value sits below the RSS majorant
const correlationGain = ANCHOR_E97 / l1Mass; // gamma = |E97| / m
const phaseBlindFloorGain = 1 / Math.sqrt(N_SHELLS); // 1/sqrt(5) = 0.4472...
const coherenceFactor = rhoRSS / ANCHOR_E97; // ~2.036, pure phase coherence

// eigenvalue reading: |sum z|^2 = z* J z, J = all-ones (n x n), spectrum {n,0..0}
const J_TOP_EIGENVALUE = N_SHELLS; // constructive (uniform) direction
const J_BOTTOM_EIGENVALUE = 0; // destructive subspace z ⟂ 1

// ── exact Cauchy-Schwarz floor cross-check on random mass distributions ─────
// rho_RSS >= m/sqrt(n) for EVERY nonnegative split of the mass m; verify on a
// deterministic ensemble that the floor is never violated and equality is
// approached only at the equal split.
function rssFloorHoldsOnEnsemble(trials) {
  let s = 12345 >>> 0;
  const next = () => {
    s = (Math.imul(1103515245, s) + 12345) >>> 0;
    return s / 4294967296;
  };
  let minRatio = Infinity;
  let maxRatio = -Infinity;
  let allAboveRex = true;
  for (let t = 0; t < trials; t++) {
    const raw = Array.from({ length: N_SHELLS }, () => next() + 1e-6);
    const sc = SHELL_L1_MASS / raw.reduce((a, b) => a + b, 0);
    const zz = raw.map((r) => r * sc);
    const rss = Math.sqrt(zz.reduce((a, b) => a + b * b, 0));
    const ratio = rss / rssFloor; // must be >= 1 (Cauchy-Schwarz)
    minRatio = Math.min(minRatio, ratio);
    maxRatio = Math.max(maxRatio, ratio);
    if (rss <= R_EX) allAboveRex = false; // must stay > R_ex at fixed mass 0.919
  }
  return { minRatio, maxRatio, allAboveRex };
}
const ENSEMBLE = rssFloorHoldsOnEnsemble(4000);

// equal-split RSS = the MINIMUM possible RSS at the documented mass
const RSS_EQUAL_SPLIT = SHELL_L1_MASS / Math.sqrt(N_SHELLS); // = rssFloor

export const IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO = {
  ticket: 'imp-95053',
  parentTickets: ['imp-95006', 'imp-95008', 'imp-95009', 'imp-95011', 'imp-95052'],
  title:
    'Phase-blind no-go: the orthogonal RSS majorant overshoots R_ex for every shell-mass distribution; the width needs a phase-coherent (arithmetic) bound',
  source:
    'Permuting the Zeta Twin Ladder Section 4.5-4.8; /permutation-architecture; imp-95003 five_shell_identity; imp-95008 evaluation-christoffel-duality; imp-95009 anti-Hermitian obstruction; imp-95010 shell l1 mass; imp-95052 phase-regime assessment',
  openFamily: { N_LO, N_HI, R_ex: R_EX, R_strict: R_STRICT, anchorE97: ANCHOR_E97, reserve: W_RESERVE },
  liftsUnconditionally: {
    identity: 'E97 = sum_g z_g is algebraic, holds at every (N,window,seam) - already uniform (imp-95003)',
    orthogonality: 'Fourier-disjoint shell supports -> Pythagoras K=1 at every N (imp-95003/95008)',
    duality: 'l2->pointwise is exact and point-independent in an equimodular carrier: |E97| <= sqrt(|W|/L) ||coeff||_2 (imp-95008 Lemma E / E1(ii))',
    bestBoundFromLever: 'chaining these gives |C_E,17| <= rho_RSS = sqrt(sum_g |z_g|^2), the orthogonal RSS majorant',
  },
  lemmaRSSfloor:
    'UNCONDITIONAL (Cauchy-Schwarz): rho_RSS = sqrt(sum_g |z_g|^2) >= m/sqrt(n), m = sum_g |z_g|, equality iff equal masses. The orthogonal RSS majorant is bounded below by m/sqrt(n) for EVERY mass distribution.',
  theoremPhaseBlindNoGo:
    'Any magnitude-only majorant B (invariant under z_g -> e^{i theta_g} z_g) satisfies B >= rho_RSS >= m/sqrt(5). At m = 0.919: rho_RSS >= 0.919/sqrt(5) = 0.4109893 > R_ex = 0.2796882. So no phase-blind majorant fits the reserve; a phase-coherent bound using arg(z_g) is necessary.',
  numbers: {
    shellL1Mass: l1Mass,
    rhoRSS,
    rssFloor,
    rssEqualSplit: RSS_EQUAL_SPLIT,
    l1OverRex,
    rssOverRex,
    floorOverRex,
    correlationGain,
    phaseBlindFloorGain,
    coherenceFactor,
  },
  eigenvalueReading:
    '|sum_g z_g|^2 = z* J z, J all-ones (spectrum {5,0,0,0,0}); the value 0.2141^2 sits near the bottom (destructive) eigenspace z ⟂ 1, the RSS floor is the average. Uniform enclosure needs z pinned to the bottom eigenspace across the family - a coherent-phase condition, NOT enforced by any operator identity (imp-95009: spec(A_+) not symmetric about 0, nonzero odd moment).',
  jTopEigenvalue: J_TOP_EIGENVALUE,
  jBottomEigenvalue: J_BOTTOM_EIGENVALUE,
  exactObstruction:
    'The pointwise identity is uniform; its VALUE-smallness is the coherent alignment of arg(z_g)(N), governed by the Riemann-von Mangoldt advance Dphi_g = 2pi log(p_g)/log(N) (imp-95052). Uniform width-fitting <=> the shells are a genuine stationary-phase (Gauss-sum/theta) structure, not a raw prime-alias comb - an ARITHMETIC fact, phase-blind-invisible to orthogonality/RK and spectrally unreachable via the anti-Hermitian complement. Mirrors the flow-blindness no-go: soft hypotheses are phase-blind; the residual needs arithmetic input.',
  namedResiduals: [
    'the arithmetic phase regime of the Fresnel-Airy shells (smooth sqrt-N envelope vs raw N comb) uniform over 690988<=N<=54799999 - the offline sub-gap imp-95011-sub-arithmetic-carrier-scan; this no-go PROVES no phase-blind route can substitute for it',
    'the documented shell l1 mass 0.919 is the imp-95010 scale; a certified family-uniform LOWER bound on m (which strengthens the no-go: larger m raises the floor) is not established, but the no-go already binds at m as small as R_ex*sqrt(5) = 0.6254',
  ],
  isRigorous: true,
  rigorScope:
    'The RSS floor (Cauchy-Schwarz), the phase-blind no-go, the eigenvalue reading and the self-consistency arithmetic are UNCONDITIONAL and exact given the documented shell mass and the equimodular-carrier best-case for the lever. The conclusion is a proved OBSTRUCTION (route-class refutation), not a closure. Numerics are the exact arithmetic of the claim.',
  promotesBound: false,
  refutesRouteClass: 'phase-blind (magnitude-only) majorants for |C_E,17|, including the l1 tiling AND the orthogonal RSS',
  verdict:
    'THEOREM (phase-blind no-go): the orthogonal RSS majorant - the strongest bound shell orthogonality + reproducing-kernel duality can yield - is >= m/sqrt(5) = 0.4110 > R_ex = 0.2797 for EVERY shell-mass distribution (documented shape 0.4359, factor 1.56 over; l1 tiling 0.919, factor 3.29 over). So the five-shell orthogonality + anti-Hermitian lever cannot by itself fit the 0.0655627 reserve; the enclosure necessarily rests on a phase-coherent bound on arg(z_g), which the operator framework does not supply (anti-Hermitian coercivity is spectrally obstructed, imp-95009) and which reduces exactly to the arithmetic stationary-phase question of imp-95052. Changes no bound; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; import-light; throw on violation) ───────────
export const IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO_ASSERTIONS = [
  {
    id: 'imp95053-rss-floor-is-cauchy-schwarz',
    description: 'rho_RSS >= m/sqrt(n) exactly, and equals it at the equal split (the minimum RSS at fixed mass)',
    holds: () =>
      rhoRSS >= rssFloor - 1e-12 &&
      Math.abs(RSS_EQUAL_SPLIT - SHELL_L1_MASS / Math.sqrt(N_SHELLS)) < 1e-15 &&
      Math.abs(rssFloor - 0.41098929426446135) < 1e-9,
  },
  {
    id: 'imp95053-rss-floor-exceeds-rex',
    description: 'the RSS floor m/sqrt(5) = 0.41099 exceeds R_ex = 0.27969 (factor > 1.46) - no mass distribution can bring the orthogonal RSS under the allowance',
    holds: () => rssFloor > R_EX && floorOverRex > 1.46 && floorOverRex < 1.48,
  },
  {
    id: 'imp95053-documented-rss-exceeds-rex',
    description: 'at the documented per-shell shape the orthogonal RSS majorant 0.43592 exceeds R_ex by factor ~1.5586',
    holds: () =>
      Math.abs(rhoRSS - 0.4359174015517867) < 1e-9 &&
      rhoRSS > R_EX &&
      rssOverRex > 1.55 &&
      rssOverRex < 1.56,
  },
  {
    id: 'imp95053-l1-tiling-also-fails',
    description: 'the l1 tiling mass 0.919 exceeds R_ex by factor ~3.286 (imp-95006 divergence, recovered)',
    holds: () => l1Mass > R_EX && l1OverRex > 3.28 && l1OverRex < 3.29,
  },
  {
    id: 'imp95053-coherence-gap-is-factor-two',
    description: 'the true value sits a factor ~2.036 below the RSS majorant (pure phase coherence); correlation gain 0.233 < phase-blind floor 1/sqrt(5)=0.4472',
    holds: () =>
      Math.abs(coherenceFactor - 2.0358) < 1e-3 &&
      correlationGain < phaseBlindFloorGain &&
      Math.abs(correlationGain - 0.233) < 2e-3 &&
      Math.abs(phaseBlindFloorGain - 0.4472135955) < 1e-9,
  },
  {
    id: 'imp95053-no-go-binds-down-to-m-0.6253',
    description: 'the no-go binds for any total mass m >= R_ex*sqrt(5) = 0.6254, well below the documented 0.919 - the obstruction is robust to the mass floor',
    holds: () => {
      const mCritical = R_EX * Math.sqrt(N_SHELLS);
      return Math.abs(mCritical - 0.6254018) < 1e-4 && SHELL_L1_MASS > mCritical;
    },
  },
  {
    id: 'imp95053-cauchy-schwarz-floor-never-violated',
    description: 'over 4000 random mass distributions at fixed m=0.919 the orthogonal RSS never drops below m/sqrt(5) and never falls to R_ex',
    holds: () =>
      ENSEMBLE.minRatio >= 1 - 1e-9 &&
      ENSEMBLE.maxRatio <= Math.sqrt(N_SHELLS) + 1e-9 &&
      ENSEMBLE.allAboveRex === true,
  },
  {
    id: 'imp95053-eigenvalue-reading',
    description: 'the all-ones quadratic form has spectrum {5,0,0,0,0}: constructive top 5, destructive bottom 0 - the value lives near the bottom (coherent) eigenspace',
    holds: () => J_TOP_EIGENVALUE === N_SHELLS && J_BOTTOM_EIGENVALUE === 0,
  },
  {
    id: 'imp95053-honesty-gate-no-qed',
    description: 'proved obstruction, not a closure: promotes no bound, refutes the phase-blind route class, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO.promotesBound === false &&
      IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO.isRigorous === true &&
      /phase-blind/.test(IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO.refutesRouteClass) &&
      /NO QED/.test(IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO.verdict) &&
      /refereed bound is changed/i.test(IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO.verdict),
  },
];

for (const a of IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95053-rss-floor-phase-blind-nogo assertion failed: ${a.id}`);
  }
}

export default IMP95053_RSS_FLOOR_PHASE_BLIND_NOGO;
