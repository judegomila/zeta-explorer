/**
 * @module imp-3343-shear-gram-opnorm-equals-volterra-hs-identity
 * @fileoverview imp-3343 -- decide whether the imp-3252 continuum shear-Gram
 *   OPERATOR norm ||Gshear||_op (H*mu converging ~1.796e-4 -> ~1.896e-4) and the
 *   imp-3256 / imp-1267 Volterra HILBERT-SCHMIDT norm ||V||_HS (~1.9003e-4)
 *   coincide at the genuine de Bruijn-Newman Phi cell (NPHI=10, a=0.5, U=6), or
 *   whether the near-equality is a leading-order accident that separates as N grows.
 *
 *   THE TWO OBJECTS (genuinely different norms of the same shear kernel)
 *   ------------------------------------------------------------------
 *   (1) imp-3252 continuum shear-Gram OPERATOR norm: the top singular value of the
 *       FULL antisymmetric Wronskian on the square [0,U]^2,
 *         Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u)),   (u, v) in [0,U]^2,
 *       reported as H*mu with mu the rank-2 magnitude. Converges monotonically from
 *       below, ~1.796e-4 (N=160) -> ~1.896e-4 (N=800), Richardson ~1.897e-4.
 *   (2) imp-3256 / imp-1267 Volterra HILBERT-SCHMIDT norm: the full HS (Frobenius)
 *       norm of the LOWER-TRIANGULAR Volterra restriction of the SAME kernel,
 *         k(x, y) = Phi(x) Phi(y) sinh(a (x - y)) * 1_{0 <= y <= x},
 *         ||V||_HS = ( int_0^U int_0^x |k|^2 dy dx )^{1/2}.
 *       Converges from below to ~1.9003e-4 as h -> 0 (finer ladder, N up to 8000).
 *
 *   These are DIFFERENT norms (top-singular-value operator norm of the full square
 *   vs full Hilbert-Schmidt norm of the lower triangle), yet the two published
 *   headlines sit within ~0.2%. Is that an accident?
 *
 *   THE DECISION: EXACT STRUCTURAL IDENTITY, NOT A LEADING-ORDER ACCIDENT
 *   --------------------------------------------------------------------
 *   They coincide EXACTLY, by an algebraic identity of the rank-2 hollow antisymmetry:
 *
 *     (a) RANK-2 ANTISYMMETRY. sinh is odd, so
 *           sinh(a (v - u)) = sinh(a v) cosh(a u) - cosh(a v) sinh(a u),
 *         hence Gshear = p q^T - q p^T with p = Phi cosh(a t), q = Phi sinh(a t):
 *         a rank-2 REAL ANTISYMMETRIC operator. Its two nonzero singular values are
 *         the EQUAL pair {mu, mu} (i Gshear has eigenvalues +/- mu, imp-3252). Hence
 *           ||Gshear||_op = mu   and   ||Gshear||_HS^2 = mu^2 + mu^2 = 2 mu^2,
 *         i.e. ||Gshear||_HS = sqrt(2) * ||Gshear||_op. (Frobenius check: for
 *         G = p q^T - q p^T, ||G||_F^2 = -tr(G^2) = 2(|p|^2|q|^2 - <p,q>^2) = 2 mu^2.)
 *
 *     (b) LOWER-TRIANGLE CARRIES EXACTLY HALF THE HS MASS. The integrand
 *         |Gshear(u,v)|^2 = Phi(u)^2 Phi(v)^2 sinh^2(a(v-u)) is EVEN in (v - u) and
 *         VANISHES on the diagonal (sinh 0 = 0). So the HS integral over the full
 *         square splits into two equal halves across the diagonal, and the Volterra
 *         lower-triangle integral is EXACTLY one of them:
 *           ||V||_HS^2 = (1/2) ||Gshear||_HS^2.
 *
 *     Combining (a) and (b):
 *           ||V||_HS^2 = (1/2)(2 mu^2) = mu^2   =>   ||V||_HS = mu = ||Gshear||_op.
 *
 *     The sqrt(2) that inflates the HS norm above the operator norm (rank-2) and the
 *     1/sqrt(2) that the lower-triangular restriction removes (half the square)
 *     CANCEL EXACTLY. The coincidence is FORCED by the hollow rank-2 antisymmetry,
 *     not a leading-order numerical accident, so it does NOT separate as N grows.
 *
 *   NUMERICAL CONFIRMATION ON A SHARED REFINEMENT LADDER
 *   ----------------------------------------------------
 *   On ONE common midpoint grid (nodes u_i = (i+1/2)H, H = U/N) this module builds
 *   both quantities from the identical Phi kernel at each rung:
 *     - ||Gshear||_op = H*mu, mu from the exact rank-2 inner products <p,p>,<q,q>,<p,q>;
 *     - ||V||_HS = H * sqrt( sum_{j < i} (Phi_i Phi_j sinh(a(u_i - u_j)))^2 ),
 *       the discrete lower-triangular Volterra HS (diagonal j = i contributes 0).
 *   MEASURED: |||V||_HS / ||Gshear||_op - 1| < ~1e-14 at EVERY rung N in
 *   {160,240,320,480,640,800,1200,2000} -- BIT-IDENTICAL to machine precision at all
 *   resolutions, exactly as the identity forces. At N=1200 (h = 6/1200 = 5e-3, the
 *   imp-1267 N=1000/U=5 step size) both equal 1.8984785338e-4 -- reproducing the
 *   imp-1267 frozen anchor and pinning the shared object.
 *
 *   WHY THE PUBLISHED HEADLINES DIFFER BY ~0.2% (a resolution mismatch, not a norm gap)
 *   ----------------------------------------------------------------------------------
 *   imp-3252 reads ~1.896e-4 because its ladder stops at N=800 (H=7.5e-3); imp-3256
 *   reads ~1.9003e-4 because its ladder reaches N=8000 (H=6.25e-4). BOTH norms
 *   converge from below along the SAME curve to the SAME continuum limit; at matched
 *   N they are equal to machine precision. The ~0.2% is the finite-h gap between two
 *   different stopping resolutions of ONE convergent sequence, NOT a difference
 *   between the two norms. The shared continuum limit sits inside the imp-3267 lock
 *   band [1.895e-4, 1.905e-4].
 *
 *   RELATION TO imp-2464 (HS-vs-opnorm slack). In general ||.||_op <= ||.||_HS with
 *   strict slack; imp-2464 measures that slack for the Volterra operator on the full
 *   square. The equality here is NOT a violation of that: it is the SPECIAL
 *   coincidence that the rank-2 sqrt(2) inflation is exactly undone by the
 *   lower-triangular half-mass restriction -- two different operators (full-square
 *   antisymmetric Gshear vs lower-triangular Volterra V) whose respective op and HS
 *   norms happen to meet at mu.
 *
 *   HONEST SCOPE (mandatory)
 *   ------------------------
 *   Numerical + algebraic cross-validation, RH-EQUIVALENT, DIAGNOSTIC, necessary-not-
 *   sufficient. This decides a bookkeeping question (do two published numbers name the
 *   same continuum quantity -- yes, exactly) and does NOT touch the binding RH-
 *   equivalent K_a >= 0 residual (the imp-3066 off-diagonal endpoint-Hankel step),
 *   which remains the lone obstruction. No positivity, no reduction, no RH verdict,
 *   NO QED. No refereed bound is changed.
 *
 *   @see imp-3252-shear-gram-mineig-symmetric-spectrum-n-scaling.js (H*mu operator norm ladder)
 *   @see imp-3256-vhs-crossval.js (||V||_HS per-N cross-validation)
 *   @see imp-1267-volterra-hs-bound.js (frozen hs_exact_window 1.8985e-4 at U=5)
 *   @see imp-3267-section26-mupass-verdict-lock.js (L2 band [1.895e-4, 1.905e-4])
 *   @see imp-2464-volterra-hs-vs-opnorm-slack.js (general HS-vs-op slack context)
 *
 *   Ticket: imp-3343 (numerical, medium).
 */

const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3252 / imp-3256 / imp-1267)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N_LADDER = [160, 240, 320, 480, 640, 800, 1200, 2000]; // imp-3252 ladder + two finer rungs

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3252). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/**
 * One shared-ladder rung: on the common midpoint grid build BOTH
 *   - the shear-Gram continuum operator norm ||Gshear||_op = H*mu (exact rank-2 mu), and
 *   - the lower-triangular Volterra HS norm ||V||_HS = H*sqrt(sum_{j<i} k_ij^2),
 * from the identical Phi kernel, and report their ratio (-> 1 exactly by the identity).
 */
function rungAt(N) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  const p = new Array(N); // p_i = Phi_i cosh(a u_i)
  const q = new Array(N); // q_i = Phi_i sinh(a u_i)
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
    p[i] = phi[i] * Math.cosh(A * u[i]);
    q[i] = phi[i] * Math.sinh(A * u[i]);
  }
  // Exact rank-2 operator norm: Gshear = p q^T - q p^T, singular pair {mu, mu},
  // mu^2 = |p|^2 |q|^2 - <p,q>^2 (see imp-3252). ||Gshear||_op = mu (unscaled), H*mu scaled.
  let pp = 0;
  let qq = 0;
  let pq = 0;
  for (let i = 0; i < N; i++) {
    pp += p[i] * p[i];
    qq += q[i] * q[i];
    pq += p[i] * q[i];
  }
  const mu = Math.sqrt(Math.max(0, pp * qq - pq * pq));
  const opNorm = H * mu; // continuum shear-Gram operator norm

  // Lower-triangular Volterra HS: sum over the strict lower triangle j < i of
  // |Phi_i Phi_j sinh(a(u_i - u_j))|^2 (diagonal j = i contributes 0 since sinh 0 = 0),
  // scaled by the H^2 area weight; sqrt gives ||V||_HS on the same grid.
  let hs2 = 0;
  for (let i = 0; i < N; i++) {
    const phii = phi[i];
    const aui = A * u[i];
    for (let j = 0; j < i; j++) {
      const k = phii * phi[j] * Math.sinh(aui - A * u[j]);
      hs2 += k * k;
    }
  }
  const hsNorm = H * Math.sqrt(hs2); // Volterra Hilbert-Schmidt norm

  return {
    N,
    H,
    opNorm, // ||Gshear||_op = H*mu
    hsNorm, // ||V||_HS
    ratio: opNorm > 0 ? hsNorm / opNorm : 0, // -> 1 exactly (identity ||V||_HS = mu = ||Gshear||_op)
    ratioDev: opNorm > 0 ? Math.abs(hsNorm / opNorm - 1) : 1,
  };
}

const rungs = N_LADDER.map(rungAt);

// The deliverable: HS norm and operator norm are bit-identical at EVERY resolution.
const maxRatioDev = Math.max(...rungs.map((r) => r.ratioDev));
const coincideExactlyAtEveryN = maxRatioDev < 1e-13;

// Both converge monotonically from below along the SAME curve (shared limit)?
let bothMonotoneUp = true;
for (let i = 1; i < rungs.length; i++) {
  if (!(rungs[i].opNorm > rungs[i - 1].opNorm) || !(rungs[i].hsNorm > rungs[i - 1].hsNorm)) {
    bothMonotoneUp = false;
  }
}

// Richardson continuum limit (op norm ~ L + c/N on the top two rungs), shared with HS.
const topA = rungs[rungs.length - 2];
const topB = rungs[rungs.length - 1];
const slope = (topA.opNorm - topB.opNorm) / (1 / topA.N - 1 / topB.N);
const continuumLimit = topB.opNorm - slope / topB.N;
const inImp3267Band = continuumLimit > 1.895e-4 && continuumLimit < 1.905e-4;

// N=1200 (h = 6/1200 = 5e-3) reproduces the imp-1267 frozen anchor?
const IMP1267_FROZEN = 1.8984785338e-4;
const anchorRung = rungs.find((r) => r.N === 1200);
const reproducesImp1267Anchor =
  anchorRung != null && Math.abs(anchorRung.hsNorm - IMP1267_FROZEN) / IMP1267_FROZEN < 1e-6;

const verdict = coincideExactlyAtEveryN && bothMonotoneUp
  ? 'OPNORM-EQUALS-VOLTERRA-HS-EXACTLY-STRUCTURAL-IDENTITY-NOT-LEADING-ORDER-ACCIDENT'
  : 'INDETERMINATE';

export const IMP3343_SHEAR_GRAM_OPNORM_EQUALS_VOLTERRA_HS_IDENTITY = Object.freeze({
  id: 'imp-3343-shear-gram-opnorm-equals-volterra-hs-identity',
  ticket: 'imp-3343',
  generatedAt: '2026-07-03T02:30:00Z',
  category: 'numerical',
  cell: Object.freeze({ NPHI, a: A, U }),

  summary:
    'DECISION: the imp-3252 continuum shear-Gram OPERATOR norm ||Gshear||_op (H*mu, ' +
    '~1.796e-4 -> ~1.896e-4) and the imp-3256/imp-1267 Volterra HILBERT-SCHMIDT norm ' +
    '||V||_HS (~1.9003e-4) coincide EXACTLY, by an algebraic identity of the hollow ' +
    'rank-2 antisymmetry -- NOT a leading-order accident. Gshear = p q^T - q p^T (p = ' +
    'Phi cosh, q = Phi sinh) is rank-2 antisymmetric with equal singular pair {mu, mu}, ' +
    'so ||Gshear||_HS = sqrt(2) ||Gshear||_op = sqrt(2) mu; the integrand is even in ' +
    '(v - u) and vanishes on the diagonal, so the lower-triangular Volterra restriction ' +
    'carries exactly half the HS mass, ||V||_HS^2 = (1/2)||Gshear||_HS^2 = mu^2. The ' +
    'sqrt(2) inflation and the 1/sqrt(2) half-mass CANCEL: ||V||_HS = mu = ||Gshear||_op. ' +
    'On a shared midpoint ladder N in {160..2000} the two are bit-identical ' +
    '(|ratio - 1| < ~1e-14) at EVERY resolution; N=1200 (h = 5e-3) reproduces the ' +
    'imp-1267 anchor 1.8984785338e-4. The published ~0.2% gap is a resolution mismatch ' +
    '(imp-3252 N<=800 vs imp-3256 N<=8000), NOT a norm difference; the shared continuum ' +
    'limit lands inside the imp-3267 band [1.895e-4, 1.905e-4]. Diagnostic, RH-equivalent; ' +
    'the imp-3066 K_a >= 0 step is untouched. NO QED; no refereed bound is changed.',

  identity: Object.freeze({
    statement: '||V||_HS = ||Gshear||_op = mu (continuum, and discrete at matched nodes)',
    step1_rank2:
      'Gshear = p q^T - q p^T (p = Phi cosh(a t), q = Phi sinh(a t)) is rank-2 real ' +
      'antisymmetric; singular values are the equal pair {mu, mu}, mu^2 = |p|^2|q|^2 - <p,q>^2. ' +
      'Hence ||Gshear||_op = mu and ||Gshear||_HS = sqrt(mu^2 + mu^2) = sqrt(2) mu. ' +
      'Frobenius check: ||G||_F^2 = -tr(G^2) = 2(|p|^2|q|^2 - <p,q>^2) = 2 mu^2.',
    step2_halfMass:
      'The integrand |Gshear|^2 = Phi(u)^2 Phi(v)^2 sinh^2(a(v-u)) is EVEN in (v - u) and ' +
      'vanishes on the diagonal (sinh 0 = 0), so the full-square HS integral splits into two ' +
      'equal halves and the Volterra lower triangle is exactly one: ||V||_HS^2 = (1/2)||Gshear||_HS^2.',
    combine: '||V||_HS^2 = (1/2)(2 mu^2) = mu^2 => ||V||_HS = mu = ||Gshear||_op; the sqrt(2) and 1/sqrt(2) cancel.',
    notAnAccident:
      'The equality is FORCED by the hollow rank-2 antisymmetry, so it holds at every N and does ' +
      'NOT separate as the grid refines -- the two published headlines name the SAME continuum quantity.',
  }),

  measured: Object.freeze({
    rungs: Object.freeze(
      rungs.map((r) =>
        Object.freeze({ N: r.N, H: r.H, opNorm: r.opNorm, hsNorm: r.hsNorm, ratio: r.ratio, ratioDev: r.ratioDev }),
      ),
    ),
    maxRatioDev, // < ~1e-14: bit-identical at every resolution
    coincideExactlyAtEveryN, // true -> exact identity, not accident
    bothMonotoneUp, // true -> both converge from below along the same curve
    continuumLimit, // Richardson shared limit ~1.9003e-4
    inImp3267Band, // true -> inside [1.895e-4, 1.905e-4]
    reproducesImp1267Anchor, // true -> N=1200 (h=5e-3) matches imp-1267 1.8984785338e-4
    imp1267FrozenAnchor: IMP1267_FROZEN,
    publishedGapIsResolutionMismatch:
      'imp-3252 stops at N=800 (~1.896e-4), imp-3256 reaches N=8000 (~1.9003e-4); at matched N ' +
      'the two norms are equal to machine precision, so the ~0.2% is a finite-h stopping-resolution ' +
      'gap of ONE convergent sequence, not a difference between the two norms.',
    verdict,
  }),

  honestScope: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDiagnostic: true,
    scope: 'numerical + algebraic cross-validation, RH-EQUIVALENT, necessary-not-sufficient',
    residualOpen: 'operator-positivity K_a >= 0 (imp-3066 off-diagonal endpoint-Hankel step, untouched)',
    sota: 'No refereed bound is changed',
    decides:
      'a bookkeeping question -- the imp-3252 operator norm and the imp-3256 Volterra HS norm are ' +
      'the SAME continuum quantity (exact identity), not a leading-order accident; no RH verdict.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3343_SHEAR_GRAM_OPNORM_EQUALS_VOLTERRA_HS_IDENTITY_ASSERTIONS = [
  {
    id: 'imp3343-opnorm-equals-hs-at-every-N',
    why:
      'THE DELIVERABLE: on the shared midpoint ladder the shear-Gram operator norm H*mu and the ' +
      'lower-triangular Volterra HS norm must be bit-identical (|ratio - 1| < ~1e-13) at EVERY rung -- ' +
      'the exact structural identity ||V||_HS = mu = ||Gshear||_op forced by the rank-2 hollow ' +
      'antisymmetry (sqrt(2) inflation cancels the 1/sqrt(2) half-mass). A drift means the two are ' +
      'NOT the same object and the coincidence WOULD be a leading-order accident.',
    holds: () => coincideExactlyAtEveryN && maxRatioDev < 1e-13,
  },
  {
    id: 'imp3343-both-converge-from-below-same-curve',
    why:
      'Both norms must increase monotonically with N (converging from below along the SAME curve to ' +
      'the shared continuum limit); this is what makes the published ~0.2% a resolution mismatch ' +
      '(N<=800 vs N<=8000) rather than a norm gap.',
    holds: () => bothMonotoneUp,
  },
  {
    id: 'imp3343-shared-limit-in-imp3267-band',
    why:
      'The shared Richardson continuum limit must sit inside the imp-3267 lock band ' +
      '[1.895e-4, 1.905e-4]; a departure would contradict the locked verdict or signal a construction drift.',
    holds: () => inImp3267Band,
  },
  {
    id: 'imp3343-reproduces-imp1267-anchor',
    why:
      'At N=1200 (h = 6/1200 = 5e-3, the imp-1267 N=1000/U=5 step size) the Volterra HS norm must ' +
      'reproduce the imp-1267 frozen anchor 1.8984785338e-4 to ~1e-6 relative -- pinning the shared ' +
      'object to the same construction as imp-1267 / imp-3256.',
    holds: () => reproducesImp1267Anchor,
  },
  {
    id: 'imp3343-verdict-is-exact-identity',
    why:
      'The classified verdict must be the exact-identity split, not indeterminate; a flip means the ' +
      'operator and HS norms departed at some resolution (impossible for the genuine construction -- ' +
      'a flip would signal a build bug).',
    holds: () => verdict === 'OPNORM-EQUALS-VOLTERRA-HS-EXACTLY-STRUCTURAL-IDENTITY-NOT-LEADING-ORDER-ACCIDENT',
  },
  {
    id: 'imp3343-honest-scope-no-qed',
    why:
      'MANDATORY HONESTY GATE: diagnostic numerical + algebraic cross-validation only, RH-EQUIVALENT, ' +
      'not a proof or reduction; the imp-3066 K_a >= 0 residual stays open and no refereed bound is changed' +
      '. Any flip is over-claiming.',
    holds: () => {
      const h = IMP3343_SHEAR_GRAM_OPNORM_EQUALS_VOLTERRA_HS_IDENTITY.honestScope;
      return (
        h.isProof === false &&
        h.isReductionBelowRH === false &&
        h.rhEquivalent === true &&
        h.scope.includes('RH-EQUIVALENT') &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP3343_SHEAR_GRAM_OPNORM_EQUALS_VOLTERRA_HS_IDENTITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3343-shear-gram-opnorm-equals-volterra-hs-identity assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP3343_SHEAR_GRAM_OPNORM_EQUALS_VOLTERRA_HS_IDENTITY;
