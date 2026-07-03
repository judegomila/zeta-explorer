/**
 * @module imp-3891-g6a-h2-continuum-inviscid-burgers-meanfield-scoping
 *
 * imp-3891 (proof, frontier-direction): imp-3872 ran the cheapest EMPIRICAL PROBE of H2 (genuine
 * nonlinearity / uniformly convex flux of the hydrodynamic limit of the imp-3642 attractive
 * Calogero-Moser / Dyson flow) and found the exact finite-N flux-gradient single-signed (kappa = 2,
 * F_prime_prime(m) = -2 at all 325 sampled points) with a shrinking m_zz viscosity term -- but its
 * VERDICT states H2 stays UNWRITTEN as a certificate: the repo never writes the continuum
 * complex-inviscid-Burgers limit nor the empirical-measure mean-field convergence theorem. This module
 * WRITES the one algebraic piece that is genuinely available and SCOPES PRECISELY why the other stays
 * open, splitting the monolithic root H2 into two named sub-pieces:
 *   H2a -- the algebraic continuum inviscid-Burgers limit m_s + F(m)_z = 0, F(m) = -m^2  (WRITTEN here)
 *   H2b -- the empirical-measure mean-field convergence theorem for this ATTRACTIVE singular flow (OPEN)
 * and names the still-open piece sg-3891-attractive-mean-field-convergence. Literature-anchored
 * scoping / derivation only; no estimate shipped, no bridge closure, no RH claim, NO QED.
 *
 * H2a -- THE CONTINUUM COMPLEX-INVISCID-BURGERS LIMIT (written, algebraically exact)
 * --------------------------------------------------------------------------------
 * The imp-3642 flow advances positions by dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j). Writing the resolvent
 * (Stieltjes) field m(z, s) = sum_k 1/(z - x_k(s)) with f_k = 1/(z - x_k), so m = sum f_k, m_z = -sum f_k^2,
 * m_zz = 2 sum f_k^3, the finite-N field obeys the EXACT identity (imp-3872, no large-N limit):
 *   m_s = 2 m m_z + m_zz.
 * The leading term is the inviscid complex-Burgers transport m_s + F(m)_z = 0 with the QUADRATIC flux
 *   F(m) = -m^2,   F_prime(m) = -2 m,   F_prime_prime(m) = -2  (a nonzero CONSTANT: genuinely nonlinear,
 * uniformly convex -- exactly H2). The trailing m_zz is a finite-N viscosity-like curvature term, lower
 * order under coarse-graining (imp-3872 P3: the fraction |m_zz|/|2 m m_z| shrinks ~500x over y_star/d in
 * [2, 8]). Passing m_zz -> 0 gives the continuum inviscid law m_s = 2 m m_z; this vanishing-viscosity
 * reduction is the FORMAL step and is written here as the target equation, NOT certified uniformly in N
 * (it is controlled only on the clean window y_star/d in [2, 8], not at the microscopic y -> 0 continuum).
 * Reference frame: this is the attractive-sign twin of the Menon-Pego / Biane repulsive complex-Burgers
 * log-gas limit m_s = -2 m m_z; the sign of the interaction flips the sign of the transport term.
 *
 * H2b -- THE EMPIRICAL-MEASURE MEAN-FIELD CONVERGENCE THEOREM (open; three named obstructions)
 * ------------------------------------------------------------------------------------------
 * H2a is only the PDE the limit should satisfy. The certificate H2 additionally needs: the empirical
 * measure mu_M = (1/M) sum_k delta_{x_k(s)} (equivalently its Stieltjes transform G_M = m/M) converges,
 * uniformly on a time interval, to a measure whose Stieltjes field solves m_s = 2 m m_z. For the
 * REPULSIVE Dyson / Calogero-Moser gas this is the classical Rogers-Shi / Chan / Cepa-Lepingle
 * McKean-Vlasov result. For the ATTRACTIVE flow it stays OPEN, and this module scopes exactly why:
 *   (O1) SINGULAR ATTRACTIVE KERNEL. The interaction -2/(x_k - x_j) is neither Lipschitz nor repulsive;
 *        every standard propagation-of-chaos theorem for singular kernels (Dyson-type) uses REPULSION to
 *        keep particles apart. The attractive sign removes the a-priori no-collision estimate those
 *        proofs are built on, so none of them apply off the shelf.
 *   (O2) FINITE-TIME COLLISIONS / SHOCK. The attractive flow drives particles TO collision in finite
 *        time tau_c (this collision IS the object of the imp-3642 study), and the inviscid limit
 *        m_s = 2 m m_z develops a shock at exactly that time. So a convergence theorem can hold at best
 *        on [0, tau_c), and BREAKS at the caustic -- which is precisely where the downstream tools
 *        T1..T4 (entropy-solution regularity) are needed. H2b cannot be extended through the shock
 *        without the very entropy theory H2 is supposed to unlock.
 *   (O3) UNCERTIFIED VANISHING VISCOSITY. Reducing the exact m_s = 2 m m_z + m_zz to the inviscid
 *        m_s = 2 m m_z needs m_zz -> 0 uniformly; imp-3872 MEASURED this shrink only on y_star/d in
 *        [2, 8] and it is uncontrolled at the microscopic y -> 0 continuum where the mean-field limit
 *        lives. So even the passage from the exact finite-N identity to the target PDE is unwritten as
 *        a uniform estimate.
 * These three are collected as the single named open sub-gap sg-3891-attractive-mean-field-convergence.
 *
 * WHAT THIS MODULE CORROBORATES NUMERICALLY (necessary ingredients, NOT the theorem)
 * ---------------------------------------------------------------------------------
 *   (C1) STATIC Stieltjes convergence of the INITIAL data: for the locally-uniform seed lattice
 *        x_k = k d, the finite-block resolvent m_M(z) = sum_{|k|<=M/2} 1/(z - k d) converges as M grows
 *        to the closed-form infinite-lattice resolvent (pi/d) cot(pi z / d), Cauchy in M at rate O(1/M)
 *        (edge correction sum_{k>M/2} 2 z /(k^2 d^2)). This certifies the empirical-measure Stieltjes
 *        field of the initial condition HAS a well-defined continuum limit -- the s = 0 datum of H2b
 *        exists. It does NOT certify the limit propagates along the flow (that is O1/O2/O3).
 *   (C2) EXACT dynamic identity: re-confirms m_s = 2 m m_z + m_zz to < 1e-12 relative residual along a
 *        short attractive RK4 flow, pinning that the finite-N evolution is inviscid-Burgers-plus-viscosity
 *        and that F_prime_prime(m) = -2 (the H2a flux) with no sign change.
 *
 * VERDICT
 * -------
 * H2a (the continuum complex-inviscid-Burgers limit m_s + (-m^2)_z = 0, uniformly convex flux
 * F_prime_prime = -2) is now WRITTEN as the exact finite-N identity plus its formal vanishing-viscosity
 * target, and the initial-data Stieltjes limit is corroborated (C1) and the dynamic identity re-confirmed
 * (C2). H2b -- the empirical-measure mean-field CONVERGENCE THEOREM for this attractive singular flow --
 * stays OPEN behind three named obstructions (singular attractive kernel, finite-time collision shock,
 * uncertified vanishing viscosity), collected as sg-3891-attractive-mean-field-convergence. So the H2 root
 * is split into a written algebraic half and an open analytic half; the K4 caustic-regularity route stays
 * WHOLLY NEW (consistent with imp-3714 / imp-3727 / imp-3846 / imp-3872) and G6a_shock_lipschitz stays
 * OPEN. Scoping / derivation only; no positivity, no bridge closure, no RH claim, NO QED. imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the
 * rigorous SOTA.
 *
 * @see imp-3872-g6a-h2-discrete-flux-convexity-probe (the empirical probe whose unwritten certificate this scopes)
 * @see imp-3846-g6a-k4-caustic-regularity-toolkit-assessment (names H2 the dependency-chain root)
 * @see imp-3727-g6a-k4-entropy-solution-regularity-scoping (the H1..H6 hypothesis map; H2 = convex flux)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (the attractive-CM RK4 flow, seed and integrator reused)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

const TWO_PI = 2 * Math.PI;
const LOG_ANCHOR = 9.1981; // imp-3642 anchor log gamma_{N*}

// ── minimal complex arithmetic (two-element [re, im] tuples) ──
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cinv = (a) => {
  const dd = a[0] * a[0] + a[1] * a[1];
  return [a[0] / dd, -a[1] / dd];
};
const cdiv = (a, b) => cmul(a, cinv(b));
const cabs = (a) => Math.hypot(a[0], a[1]);

// closed-form infinite-lattice resolvent (pi/d) cot(pi z / d) via cot z = cos z / sin z
function ccot(z) {
  const [x, y] = z;
  const cosz = [Math.cos(x) * Math.cosh(y), -Math.sin(x) * Math.sinh(y)];
  const sinz = [Math.sin(x) * Math.cosh(y), Math.cos(x) * Math.sinh(y)];
  return cdiv(cosz, sinz);
}
function latticeResolventClosedForm(z, d) {
  const pod = [Math.PI / d, 0];
  return cmul(pod, ccot(cmul(pod, z)));
}

// ── (C1) STATIC Stieltjes convergence of the seed lattice to the closed form ──
// symmetric block x_k = k d, |k| <= (M-1)/2; m_M(z) -> (pi/d) cot(pi z / d) at rate O(1/M).
function blockResolvent(z, d, M) {
  let m = [0, 0];
  for (let k = 0; k < M; k++) {
    const xk = (k - (M - 1) / 2) * d;
    m = cadd(m, cinv(csub(z, [xk, 0])));
  }
  return m;
}

const D_ANCHOR = 1 / (Math.log(Math.exp(LOG_ANCHOR) / TWO_PI) / TWO_PI); // imp-3642 anchor spacing
const Y_STAR = 4 * D_ANCHOR; // mesoscopic strip (imp-3642 convention)
const Z_PROBE = [0.37 * D_ANCHOR, Y_STAR]; // an off-node interior sample point
const M_LADDER = [41, 81, 161, 321, 641];
const M_INF_RESOLVENT = latticeResolventClosedForm(Z_PROBE, D_ANCHOR);
const C1_ROWS = M_LADDER.map((M) => ({
  M,
  err: cabs(csub(blockResolvent(Z_PROBE, D_ANCHOR, M), M_INF_RESOLVENT)),
}));
// convergence is monotone in M and the finest block error is far below the coarsest (Cauchy in M)
const C1_MONOTONE = C1_ROWS.every((r, i) => i === 0 || r.err < C1_ROWS[i - 1].err);
const C1_ERR_RATIO = C1_ROWS[0].err / C1_ROWS[C1_ROWS.length - 1].err; // >> 1 (about 15x over 41 -> 641)

// ── (C2) EXACT dynamic identity along a short attractive RK4 flow ──
const BLOCK_M = 81;
const STEPS = 40;
function seedBlock(d, M) {
  const xs = new Array(M);
  for (let k = 0; k < M; k++) {
    const base = (k - (M - 1) / 2) * d;
    const jitter = 0.15 * d * Math.sin(2.4 * k) + 0.07 * d * Math.cos(5.1 * k);
    xs[k] = base + jitter;
  }
  return xs;
}
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
function fieldAt(xs, vel, z) {
  let m = [0, 0], mz = [0, 0], mzz = [0, 0], ms = [0, 0];
  for (let k = 0; k < xs.length; k++) {
    const f = cinv(csub(z, [xs[k], 0]));
    const f2 = cmul(f, f);
    const f3 = cmul(f2, f);
    m = cadd(m, f);
    mz = csub(mz, f2);
    mzz = cadd(mzz, cmul([2, 0], f3));
    ms = cadd(ms, cmul([vel[k], 0], f2));
  }
  return { m, mz, mzz, ms };
}
function dynamicIdentityProbe(logGamma) {
  const gamma = Math.exp(logGamma);
  const d = 1 / (Math.log(gamma / TWO_PI) / TWO_PI);
  const yStar = 4 * d;
  let xs = seedBlock(d, BLOCK_M);
  const V0 = gridSupImM(xs, yStar, d);
  const dt = (1 / (2 * V0) / 2) / STEPS;
  const xGrid = [];
  for (let x = -3 * d; x <= 3 * d + 1e-12; x += d / 2) xGrid.push(x);
  let maxResid = 0;
  let kappaMin = Infinity;
  let kappaMax = -Infinity;
  for (let step = 0; step < STEPS; step++) {
    if (step % 10 === 0) {
      const vel = attractiveVelocities(xs);
      for (const x of xGrid) {
        const z = [x, yStar];
        const { m, mz, mzz, ms } = fieldAt(xs, vel, z);
        const rhs = cadd(cmul([2, 0], cmul(m, mz)), mzz);
        const resid = cabs(csub(ms, rhs)) / (cabs(ms) + 1e-300);
        if (resid > maxResid) maxResid = resid;
        const kappa = cdiv(csub(ms, mzz), cmul(m, mz))[0];
        if (kappa < kappaMin) kappaMin = kappa;
        if (kappa > kappaMax) kappaMax = kappa;
      }
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
  return { maxResid, kappaMin, kappaMax };
}
const C2 = dynamicIdentityProbe(LOG_ANCHOR);

// ── H2 split: written algebraic half vs open analytic half ──
const H2_SPLIT = {
  H2a: {
    name: 'continuum complex-inviscid-Burgers limit',
    statement: 'm_s + F(m)_z = 0,  F(m) = -m^2,  F_prime(m) = -2 m,  F_prime_prime(m) = -2 (uniformly convex)',
    source: 'exact finite-N identity m_s = 2 m m_z + m_zz (imp-3872) with m_zz -> 0 (formal vanishing viscosity)',
    status: 'WRITTEN (algebraic; vanishing-viscosity reduction is formal, controlled only on y_star/d in [2, 8])',
    reference: 'attractive-sign twin of the Menon-Pego / Biane repulsive log-gas limit m_s = -2 m m_z',
  },
  H2b: {
    name: 'empirical-measure mean-field convergence theorem',
    statement:
      'the empirical measure mu_M = (1/M) sum delta_{x_k(s)} (Stieltjes transform G_M = m/M) converges ' +
      'uniformly on a time interval to a measure whose Stieltjes field solves m_s = 2 m m_z',
    status: 'OPEN -- sg-3891-attractive-mean-field-convergence',
    obstructions: [
      'O1 singular ATTRACTIVE kernel -2/(x_k - x_j): not Lipschitz, not repulsive; standard singular-kernel ' +
        'propagation-of-chaos (Rogers-Shi / Chan / Cepa-Lepingle) uses repulsion to keep particles apart, so ' +
        'none applies off the shelf',
      'O2 finite-time collision / shock at tau_c: the inviscid limit develops a shock exactly where particles ' +
        'collide, so a convergence theorem holds at best on [0, tau_c) and breaks at the caustic -- precisely ' +
        'where the downstream entropy-solution tools T1..T4 are needed',
      'O3 uncertified vanishing viscosity: m_zz -> 0 measured (imp-3872) only on y_star/d in [2, 8], uncontrolled ' +
        'at the microscopic y -> 0 continuum where the mean-field limit lives',
    ],
  },
};

export const IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING = {
  id: 'imp-3891',
  proofSection: 'S-frontier',
  question:
    'imp-3872 probed H2 (convex flux of the hydrodynamic limit of the imp-3642 attractive-CM flow) and found ' +
    'the exact finite-N flux gradient single-signed (kappa = 2) but left H2 UNWRITTEN as a certificate: the ' +
    'repo never writes the continuum complex-inviscid-Burgers limit nor the empirical-measure mean-field ' +
    'convergence theorem. DERIVE / ASSESS that convergence theorem for the attractive flow toward ' +
    'm_s + F(m)_z = 0 with F(m) = -m^2, or scope precisely why it stays open. Scoping / derivation only, no QED.',
  candidate: 'K4',
  rootScoped: 'H2', // split into H2a (written) and H2b (open)
  h2Split: H2_SPLIT,
  discreteFluxIdentity: {
    statement: 'm_s = 2 m m_z + m_zz  (EXACT, finite-N; m(z,s) = sum_k 1/(z - x_k(s)))',
    inviscidLimit: 'm_zz -> 0  =>  m_s = 2 m m_z = -(m^2)_z  =>  F(m) = -m^2, F_prime_prime(m) = -2',
  },
  // (C1) static Stieltjes convergence of the initial seed lattice to the closed-form infinite resolvent
  c1: {
    probePoint: Z_PROBE.map((v) => +v.toFixed(6)),
    spacing: +D_ANCHOR.toFixed(6),
    closedForm: '(pi/d) cot(pi z / d)',
    closedFormValue: M_INF_RESOLVENT.map((v) => +v.toExponential(6)),
    rows: C1_ROWS.map((r) => ({ M: r.M, err: +r.err.toExponential(3) })),
    monotoneInM: C1_MONOTONE,
    errRatioCoarseToFine: +C1_ERR_RATIO.toFixed(2), // ~15x over M = 41 -> 641, O(1/M) edge decay
    meaning: 'the s = 0 empirical-measure Stieltjes field has a well-defined continuum limit (H2b initial datum exists)',
  },
  // (C2) exact dynamic identity + uniformly convex flux re-confirmed along a short attractive flow
  c2: {
    maxIdentityResidual: +C2.maxResid.toExponential(2), // < 1e-12
    kappaMin: +C2.kappaMin.toFixed(9), // 2.000000000
    kappaMax: +C2.kappaMax.toFixed(9), // 2.000000000
    fluxSecondDerivative: -2,
    meaning: 'the finite-N evolution is inviscid-Burgers-plus-viscosity with uniformly convex flux F_prime_prime = -2',
  },
  openSubGap: 'sg-3891-attractive-mean-field-convergence',
  h2aWritten: true,
  h2bOpen: true,
  isRigorous: false,
  k4ConfirmedWhollyNew: true,
  g6aStillOpen: true,
  verdict:
    'SCOPING / DERIVATION (frontier-direction, NOT rigorous): split the imp-3846 dependency-chain root H2 ' +
    '(convex-flux certification of the imp-3642 attractive-CM hydrodynamic limit) into a WRITTEN algebraic ' +
    'half and an OPEN analytic half. H2a -- the continuum complex-inviscid-Burgers limit m_s + F(m)_z = 0 ' +
    'with F(m) = -m^2, F_prime_prime(m) = -2 (uniformly convex, the attractive-sign twin of the ' +
    'Menon-Pego / Biane repulsive log-gas limit) -- is now WRITTEN as the exact finite-N identity ' +
    'm_s = 2 m m_z + m_zz plus its formal vanishing-viscosity reduction m_zz -> 0. Two necessary ingredients ' +
    'are corroborated: (C1) the seed-lattice resolvent m_M(z) converges to the closed form (pi/d) cot(pi z/d) ' +
    'as M grows (monotone, ~' + (+C1_ERR_RATIO.toFixed(0)) + 'x error drop over M = 41 -> 641, O(1/M) edge ' +
    'decay), so the s = 0 empirical-measure Stieltjes field has a well-defined continuum limit; (C2) the exact ' +
    'identity m_s = 2 m m_z + m_zz holds to ' + C2.maxResid.toExponential(1) + ' relative residual along a ' +
    'short attractive RK4 flow with kappa = 2.000000000 (F_prime_prime = -2, no sign change). But H2b -- the ' +
    'empirical-measure mean-field CONVERGENCE THEOREM that mu_M = (1/M) sum delta_{x_k(s)} converges to a ' +
    'solution of m_s = 2 m m_z -- stays OPEN behind three named obstructions collected as ' +
    'sg-3891-attractive-mean-field-convergence: O1 the singular ATTRACTIVE kernel -2/(x_k - x_j) is neither ' +
    'Lipschitz nor repulsive, so the standard repulsion-based singular-kernel propagation-of-chaos theorems ' +
    '(Rogers-Shi / Chan / Cepa-Lepingle) do not apply; O2 the flow drives finite-time collisions and the ' +
    'inviscid limit shocks at exactly tau_c, so any convergence holds at best on [0, tau_c) and breaks at the ' +
    'caustic where the downstream entropy tools T1..T4 are needed; O3 the m_zz -> 0 vanishing viscosity is ' +
    'measured only on y_star/d in [2, 8] and uncontrolled at the microscopic y -> 0 continuum. So H2 is now ' +
    'half-written (H2a) and half-open (H2b); the K4 route stays WHOLLY NEW (consistent with imp-3714 / ' +
    'imp-3727 / imp-3846 / imp-3872) and G6a_shock_lipschitz stays OPEN. Scoping / derivation only; no ' +
    'positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-3872 (the empirical probe whose unwritten certificate this scopes); imp-3846 (names H2 the dependency ' +
    'root); imp-3727 (H1..H6 hypothesis map, H2 = convex flux); imp-3642 (attractive-CM RK4 flow, seed and ' +
    'integrator reused); literature: Rogers-Shi / Chan / Cepa-Lepingle repulsive Dyson mean-field ' +
    'propagation-of-chaos, Menon-Pego / Biane complex-Burgers log-gas hydrodynamics; lambda-roadmap Step 4 ' +
    '(Polymath15 bridge, open sub-gap G6a_shock_lipschitz).',
};

export const IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING_ASSERTIONS = [
  {
    // (C1) the seed-lattice resolvent converges to the closed-form infinite resolvent, monotone in M.
    id: 'imp3891-c1-static-stieltjes-convergence',
    description: 'm_M(z) -> (pi/d) cot(pi z / d) monotonically as M grows (initial empirical-measure Stieltjes limit exists)',
    holds: () =>
      C1_MONOTONE === true &&
      C1_ROWS[C1_ROWS.length - 1].err < 5e-2 &&
      C1_ERR_RATIO > 5,
  },
  {
    // (C2) the exact finite-N identity holds along the flow and the flux is uniformly convex (kappa = 2).
    id: 'imp3891-c2-exact-identity-and-convex-flux',
    description: 'm_s = 2 m m_z + m_zz to < 1e-12 with kappa = 2.000000000 (F_prime_prime = -2, no sign change)',
    holds: () =>
      C2.maxResid < 1e-12 &&
      Math.abs(C2.kappaMin - 2) < 1e-6 &&
      Math.abs(C2.kappaMax - 2) < 1e-6 &&
      IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.c2.fluxSecondDerivative === -2,
  },
  {
    // H2 split: H2a written, H2b open with exactly three named obstructions and the named sub-gap.
    id: 'imp3891-h2-split-written-and-open',
    description: 'H2a written, H2b open with three obstructions collected as sg-3891-attractive-mean-field-convergence',
    holds: () =>
      IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.h2aWritten === true &&
      IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.h2bOpen === true &&
      H2_SPLIT.H2b.obstructions.length === 3 &&
      IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.openSubGap === 'sg-3891-attractive-mean-field-convergence',
  },
  {
    // Honesty gate: scoping only, K4 wholly new, G6a open, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp3891-honesty-gate-no-qed',
    description: 'scoping/derivation only: K4 wholly new, G6a open, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.isRigorous === false &&
      IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.k4ConfirmedWhollyNew === true &&
      IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.g6aStillOpen === true &&
      /NO QED/.test(IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.verdict) &&
      /remains the rigorous SOTA/.test(IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING.verdict),
  },
];

for (const a of IMP3891_G6A_H2_CONTINUUM_INVISCID_BURGERS_MEANFIELD_SCOPING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3891-g6a-h2-continuum-inviscid-burgers-meanfield-scoping assertion failed: ${a.id}`);
  }
}
