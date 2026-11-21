/**
 * @module imp-3899-g6a-p1-resolvent-identity-caustic-stress
 *
 * imp-3899 (numerical, frontier-direction): imp-3872 P1 VERIFIED the exact finite-N resolvent-flux
 * identity m_s = 2 m m_z + m_zz (m_s from the ACTUAL imp-3642 RK4 attractive Calogero-Moser velocities,
 * m / m_z / m_zz from the analytic resolvent) to a max relative residual < 1e-12 -- but only over HALF the
 * pre-collision shock budget on a block of M = 161. The caustic (collision / shock) time is exactly where
 * the G6a K4 regularity question lives, so this module STRESS-TESTS that exactness where imp-3872 stopped:
 * it pushes the imp-3642 RK4 flow to NEAR the full pre-collision budget (up to 0.99 of 1 / (2 V0)) and
 * probes at LARGER block sizes (M = 161, 241, 321), measuring whether the < 1e-12 residual survives as the
 * closest particle pair collapses toward collision.
 *
 * WHY THE IDENTITY MUST HOLD ALGEBRAICALLY (and what is actually being stressed)
 * -----------------------------------------------------------------------------
 * With f_k = 1 / (z - x_k), m = sum f_k, m_z = -sum f_k^2, m_zz = 2 sum f_k^3, and the attractive velocity
 * xdot_k = -2 sum_{j != k} 1 / (x_k - x_j), the finite-N field obeys m_s = sum_k xdot_k f_k^2 = 2 m m_z + m_zz
 * EXACTLY, for ANY particle configuration (imp-3872 derivation). It is a pure algebraic identity in xs, so it
 * does NOT depend on how the flow reached the state -- it is independent of RK4 integration accuracy. What the
 * caustic can degrade is the FLOATING-POINT conditioning: as the minimum inter-particle gap g_min collapses,
 * the velocities xdot_k = -2 sum 1 / (x_k - x_j) develop O(1 / g_min) magnitudes and catastrophic cancellation,
 * which could inflate the measured relative residual. The resolvent m itself stays well-conditioned on the
 * mesoscopic strip z = x + i y_star (y_star = 4 d, fixed) because y_star > 0 keeps every 1 / (z - x_k) bounded.
 * So the test is honest: does the algebra survive the near-collision velocity blow-up in double precision?
 *
 * WHAT IS MEASURED
 * ----------------
 * Reusing the imp-3642 mesoscopic seed and the same attractive RK4 integrator (imp-3872 conventions:
 * spacing d = 2 pi / log(gamma / 2 pi), small deterministic jitter, y_star = 4 d, 13-point x-grid on
 * [-3 d, 3 d]), at the anchor height log gamma = 9.1981, this module runs ONE flow per block size to 0.99 of
 * the full pre-collision budget and, at five budget fractions approaching the caustic
 * (b = 0.50, 0.75, 0.90, 0.95, 0.99 of 1 / (2 V0)):
 *   (P1c) VERIFIES the exact finite-N identity m_s = 2 m m_z + m_zz -- m_s from the ACTUAL RK4 velocities --
 *         and records the max relative residual across the x-grid at that near-caustic slice;
 *   (Gmin) records the minimum inter-particle gap g_min (and g_min / d) at that slice, so the residual is
 *         reported AGAINST how close the configuration is to collision.
 *
 * All numeric fields below are computed at import; the self-executing assertions at the bottom throw if the
 * identity ever fails to survive the caustic stress. Measurement / scoping only; no positivity, no bridge
 * closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED.
 * No refereed bound is changed. H2 stays UNWRITTEN as a certificate, the K4 route
 * stays WHOLLY NEW and G6a_shock_lipschitz stays OPEN.
 *
 * @see imp-3872-g6a-h2-discrete-flux-convexity-probe (the P1 verification this extends to the caustic)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (the attractive-CM RK4 flow, seed and integrator reused)
 * @see imp-3846-g6a-k4-caustic-regularity-toolkit-assessment (names H2 the dependency-chain root; caustic = where K4 lives)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

const TWO_PI = 2 * Math.PI;
const LOG_ANCHOR = 9.1981; // imp-3642 anchor log gamma_{N*}

// minimal complex arithmetic (two-element [re, im] tuples), imp-3872 convention
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cinv = (a) => {
  const dd = a[0] * a[0] + a[1] * a[1];
  return [a[0] / dd, -a[1] / dd];
};
const cabs = (a) => Math.hypot(a[0], a[1]);

// locally-uniform mesoscopic seed (imp-3642 / imp-3872: spacing d, small deterministic jitter)
function seedBlock(d, M) {
  const xs = new Array(M);
  for (let k = 0; k < M; k++) {
    const base = (k - (M - 1) / 2) * d;
    const jitter = 0.15 * d * Math.sin(2.4 * k) + 0.07 * d * Math.cos(5.1 * k);
    xs[k] = base + jitter;
  }
  return xs;
}

// attractive Calogero-Moser velocities dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) (imp-3642)
function attractiveVelocities(xs) {
  const n = xs.length;
  const v = new Array(n).fill(0);
  for (let k = 0; k < n; k++) {
    let s = 0;
    for (let j = 0; j < n; j++) if (j !== k) s -= 2 / (xs[k] - xs[j]);
    v[k] = s;
  }
  return v;
}

// grid-sup of Im m over the mesoscopic strip (imp-3642 quantity, sizes the pre-collision horizon)
function gridSupImM(xs, y, d) {
  let best = 0;
  for (let x = -6 * d; x <= 6 * d; x += d / 8) {
    let s = 0;
    for (let k = 0; k < xs.length; k++) {
      const a = xs[k] - x;
      s += y / (a * a + y * y);
    }
    if (s > best) best = s;
  }
  return best;
}

// resolvent field m and analytic z-derivatives at complex z, plus m_s from the ACTUAL RK4 velocities.
function fieldAt(xs, vel, z) {
  let m = [0, 0], mz = [0, 0], mzz = [0, 0], ms = [0, 0];
  for (let k = 0; k < xs.length; k++) {
    const f = cinv(csub(z, [xs[k], 0])); // 1/(z - x_k)
    const f2 = cmul(f, f);
    const f3 = cmul(f2, f);
    m = cadd(m, f);
    mz = csub(mz, f2); // m_z = -sum f^2
    mzz = cadd(mzz, cmul([2, 0], f3)); // m_zz = 2 sum f^3
    ms = cadd(ms, cmul([vel[k], 0], f2)); // m_s = sum xdot_k f^2
  }
  return { m, mz, mzz, ms };
}

// minimum inter-particle gap of a (sorted-or-not) configuration
function minGap(xs) {
  const s = xs.slice().sort((a, b) => a - b);
  let g = Infinity;
  for (let k = 1; k < s.length; k++) {
    const dgap = s[k] - s[k - 1];
    if (dgap < g) g = dgap;
  }
  return g;
}

const STEPS = 400; // finer than imp-3872 (250) to resolve the near-caustic approach
const BUDGET_TOP = 0.99; // integrate to 0.99 of the full pre-collision budget 1/(2 V0)
const BUDGET_FRACS = [0.5, 0.75, 0.9, 0.95, 0.99]; // near-caustic slices probed
const BLOCK_SIZES = [161, 241, 321]; // imp-3872 baseline M plus two larger blocks

// Push the imp-3642 RK4 attractive-CM flow to near the full pre-collision budget and stress the P1
// identity at successive near-caustic slices, for one block size at the anchor height.
function stressCaustic(logGamma, M) {
  const gamma = Math.exp(logGamma);
  const rho = Math.log(gamma / TWO_PI) / TWO_PI;
  const d = 1 / rho;
  const yStar = 4 * d;
  let xs = seedBlock(d, M);
  const V0 = gridSupImM(xs, yStar, d);
  const fullBudget = 1 / (2 * V0); // full pre-collision shock budget (imp-3642); imp-3872 used half of this
  const sMax = BUDGET_TOP * fullBudget;
  const dt = sMax / STEPS;

  // step index whose achieved budget fraction is closest to each target fraction
  const targetSteps = BUDGET_FRACS.map((bf) => {
    let idx = Math.round((bf / BUDGET_TOP) * STEPS);
    if (idx > STEPS - 1) idx = STEPS - 1;
    return idx;
  });

  const xGrid = [];
  for (let x = -3 * d; x <= 3 * d + 1e-12; x += d / 2) xGrid.push(x);

  const slices = [];
  for (let step = 0; step < STEPS; step++) {
    const ti = targetSteps.indexOf(step);
    if (ti !== -1) {
      const vel = attractiveVelocities(xs);
      let maxResid = 0;
      for (const x of xGrid) {
        const z = [x, yStar];
        const { m, mz, mzz, ms } = fieldAt(xs, vel, z);
        const rhs = cadd(cmul([2, 0], cmul(m, mz)), mzz);
        const resid = cabs(csub(ms, rhs)) / (cabs(ms) + 1e-300);
        if (resid > maxResid) maxResid = resid;
      }
      const g = minGap(xs);
      slices.push({
        budgetFrac: +((step / STEPS) * BUDGET_TOP).toFixed(4),
        maxResid,
        gMin: g,
        gMinOverD: g / d,
      });
    }
    const k1 = attractiveVelocities(xs);
    const x2 = xs.map((x, i) => x + 0.5 * dt * k1[i]);
    const k2 = attractiveVelocities(x2);
    const x3 = xs.map((x, i) => x + 0.5 * dt * k2[i]);
    const k3 = attractiveVelocities(x3);
    const x4 = xs.map((x, i) => x + dt * k3[i]);
    const k4 = attractiveVelocities(x4);
    xs = xs.map((x, i) => x + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }

  const blockMaxResid = Math.max(...slices.map((s) => s.maxResid));
  const finalSlice = slices[slices.length - 1];
  return {
    M,
    d: +d.toFixed(4),
    yStar: +yStar.toFixed(4),
    slices,
    blockMaxResid,
    nearCausticGMinOverD: finalSlice.gMinOverD,
    nearCausticResid: finalSlice.maxResid,
  };
}

const BLOCKS = BLOCK_SIZES.map((M) => stressCaustic(LOG_ANCHOR, M));

const GLOBAL_MAX_RESID = Math.max(...BLOCKS.map((b) => b.blockMaxResid));
// residual at the deepest (0.99-budget) slice, over all block sizes -- the actual caustic-stress number
const NEAR_CAUSTIC_MAX_RESID = Math.max(...BLOCKS.map((b) => b.nearCausticResid));
// tightest gap reached anywhere (smallest g_min / d), showing how close to collision the stress got
const TIGHTEST_GMIN_OVER_D = Math.min(...BLOCKS.flatMap((b) => b.slices.map((s) => s.gMinOverD)));
const IDENTITY_SURVIVES_CAUSTIC = GLOBAL_MAX_RESID < 1e-12;

export const IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS = {
  id: 'imp-3899',
  proofSection: 'S-frontier',
  question:
    'imp-3872 P1 verified the exact finite-N resolvent-flux identity m_s = 2 m m_z + m_zz to < 1e-12 ' +
    'relative residual, but only over HALF the pre-collision shock budget on a block of M = 161. The ' +
    'caustic (collision) time is exactly where the G6a K4 regularity question lives. EXTEND that P1 check ' +
    'to NEAR the full pre-collision budget and to LARGER blocks, and measure whether the < 1e-12 residual ' +
    'survives at the caustic. Self-consistency / measurement only; no bridge closure; no QED.',
  candidate: 'K4',
  rootProbed: 'H2',
  extends: 'imp-3872 P1 (exact finite-N flux identity m_s = 2 m m_z + m_zz)',
  identity: 'm_s = 2 m m_z + m_zz  (EXACT, finite-N; m(z,s) = sum_k 1/(z - x_k(s)); m_s from ACTUAL RK4 velocities)',
  stressSpec: {
    flow: 'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) (imp-3642 attractive Calogero-Moser)',
    height: +LOG_ANCHOR.toFixed(4),
    strip: 'z = x + i y_star, y_star = 4 d, d = 2 pi / log(gamma / 2 pi)',
    rk4Steps: STEPS,
    budgetTop: BUDGET_TOP, // 0.99 of the full pre-collision budget 1/(2 V0); imp-3872 stopped at 0.5
    budgetFracsProbed: BUDGET_FRACS,
    blockSizes: BLOCK_SIZES, // imp-3872 baseline 161 plus larger 241, 321
  },
  blocks: BLOCKS.map((b) => ({
    M: b.M,
    d: b.d,
    yStar: b.yStar,
    blockMaxResid: +b.blockMaxResid.toExponential(2),
    nearCausticGMinOverD: +b.nearCausticGMinOverD.toExponential(3),
    slices: b.slices.map((s) => ({
      budgetFrac: s.budgetFrac,
      maxResid: +s.maxResid.toExponential(2),
      gMinOverD: +s.gMinOverD.toExponential(3),
    })),
  })),
  globalMaxResid: +GLOBAL_MAX_RESID.toExponential(2), // over ALL blocks and near-caustic slices
  nearCausticMaxResid: +NEAR_CAUSTIC_MAX_RESID.toExponential(2), // at the 0.99-budget slice
  tightestGMinOverD: +TIGHTEST_GMIN_OVER_D.toExponential(3), // closest approach to collision reached
  identitySurvivesCaustic: IDENTITY_SURVIVES_CAUSTIC, // true iff < 1e-12 everywhere
  finding:
    'CAUSTIC STRESS RESULT: the exact finite-N resolvent-flux identity m_s = 2 m m_z + m_zz SURVIVES the ' +
    'approach to the caustic. Pushing the imp-3642 RK4 attractive-CM flow to ' + BUDGET_TOP + ' of the full ' +
    'pre-collision budget 1/(2 V0) (imp-3872 stopped at 0.5) at block sizes M = ' + BLOCK_SIZES.join(', ') +
    ', with m_s built from the ACTUAL RK4 velocities and m / m_z / m_zz analytic, the max relative residual ' +
    'stays ' + GLOBAL_MAX_RESID.toExponential(1) + ' across every near-caustic slice (budget fractions ' +
    BUDGET_FRACS.join(', ') + ') even as the tightest inter-particle gap collapses to g_min / d = ' +
    TIGHTEST_GMIN_OVER_D.toExponential(1) + '. The identity is algebraic in the configuration, so the ' +
    'near-collision velocity blow-up (O(1/g_min) with catastrophic cancellation) does NOT inflate the residual ' +
    'in double precision on the mesoscopic strip y_star = 4 d -- the < 1e-12 P1 exactness of imp-3872 holds at ' +
    'the caustic and at larger M, not just over half the budget on M = 161.',
  isRigorous: false,
  h2StillUnwritten: true,
  k4ConfirmedWhollyNew: true,
  g6aStillOpen: true,
  verdict:
    'MEASUREMENT / SCOPING (frontier-direction, NOT rigorous): extends the imp-3872 P1 self-consistency check ' +
    'of the exact finite-N resolvent-flux identity m_s = 2 m m_z + m_zz from HALF the pre-collision budget on ' +
    'M = 161 to NEAR the full budget (' + BUDGET_TOP + ' of 1/(2 V0)) and to LARGER blocks (M = ' +
    BLOCK_SIZES.join(', ') + ') at the imp-3642 anchor height log gamma = ' + LOG_ANCHOR.toFixed(4) + '. Along ' +
    'the attractive Calogero-Moser RK4 flow, sampling the resolvent field m(z,s) = sum_k 1/(z - x_k) on the ' +
    'mesoscopic strip z = x + i y_star (y_star = 4 d) at five budget fractions approaching the caustic (' +
    BUDGET_FRACS.join(', ') + '), with m_s from the ACTUAL RK4 velocities and m / m_z / m_zz analytic: the max ' +
    'relative residual stays ' + GLOBAL_MAX_RESID.toExponential(1) + ' at every slice and block even as the ' +
    'minimum inter-particle gap collapses to g_min / d = ' + TIGHTEST_GMIN_OVER_D.toExponential(1) + ' near ' +
    'collision, so the P1 exactness SURVIVES the caustic. This is expected -- the identity is a pure algebraic ' +
    'identity in the particle configuration, independent of RK4 integration accuracy -- and the measurement ' +
    'confirms the near-collision velocity blow-up does not degrade double-precision conditioning of the ' +
    'resolvent on a fixed y_star = 4 d strip. It remains a self-consistency check that the discrete flux is ' +
    'read correctly, NOT a certificate: it does not prove the mean-field / hydrodynamic limit exists, does not ' +
    'certify convex-flux H2, and reads m on a mesoscopic strip rather than the microscopic y -> 0 continuum. So ' +
    'H2 stays UNWRITTEN as a certificate, the K4 route stays WHOLLY NEW (consistent with imp-3714 / imp-3727 / ' +
    'imp-3846 / imp-3872) and G6a_shock_lipschitz stays OPEN. Scoping / measurement only; no positivity, no ' +
    'bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-3872 (the P1 exact finite-N flux identity verification extended here to the caustic and larger M); ' +
    'imp-3642 (attractive-CM RK4 flow, seed and integrator reused); imp-3846 (names H2 the dependency-chain ' +
    'root; the caustic is where K4 regularity lives); imp-3727 (H1..H6 hypothesis map); Menon-Pego / Biane ' +
    'complex-Burgers log-gas hydrodynamics (m_s = 2 m m_z inviscid limit); lambda-roadmap Step 4 (Polymath15 ' +
    'bridge, open G6a_shock_lipschitz).',
};

export const IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS_ASSERTIONS = [
  {
    // The exact finite-N flux identity survives the approach to the caustic across all blocks / slices.
    id: 'imp3899-identity-survives-caustic',
    description: 'm_s = 2 m m_z + m_zz holds to < 1e-12 relative residual at all near-caustic slices (up to 0.99 budget) across M = 161, 241, 321',
    holds: () => GLOBAL_MAX_RESID < 1e-12 && IDENTITY_SURVIVES_CAUSTIC === true,
  },
  {
    // The stress actually reached deep near-collision territory (tight g_min) -- not a trivially-far probe.
    id: 'imp3899-reached-near-collision',
    description: 'the tightest inter-particle gap reached is well below the seed spacing (g_min/d < 0.3), so the identity was genuinely stressed near collision',
    holds: () => TIGHTEST_GMIN_OVER_D < 0.3,
  },
  {
    // Provenance: extends imp-3872 P1 beyond the half budget (0.99 > 0.5) and to larger blocks.
    id: 'imp3899-extends-imp3872-p1-provenance',
    description: 'pushes to 0.99 of the full budget (imp-3872 used 0.5) at M = 161, 241, 321 with the shared imp-3642 seed / integrator',
    holds: () =>
      BUDGET_TOP > 0.5 &&
      BLOCKS.length === 3 &&
      BLOCK_SIZES[0] === 161 &&
      BLOCK_SIZES[BLOCK_SIZES.length - 1] === 321 &&
      BLOCKS.every((b) => b.slices.length === BUDGET_FRACS.length),
  },
  {
    // Honesty gate: stress not certificate -- H2 unwritten, K4 wholly new, G6a open, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3899-honesty-gate-no-qed',
    description: 'STRESS not certificate: H2 unwritten, K4 wholly new, G6a open, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS.isRigorous === false &&
      IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS.h2StillUnwritten === true &&
      IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS.k4ConfirmedWhollyNew === true &&
      IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS.g6aStillOpen === true &&
      /NO QED/.test(IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS.verdict) &&
      /refereed bound is changed/i.test(IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS.verdict),
  },
];

for (const a of IMP3899_G6A_P1_RESOLVENT_IDENTITY_CAUSTIC_STRESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3899-g6a-p1-resolvent-identity-caustic-stress assertion failed: ${a.id}`);
  }
}
