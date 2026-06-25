/**
 * @module imp-2690-tangency-remainder-sign
 * @fileoverview Rigorously verifies the quadratic-tangency collision coefficient
 * 8 and the SIGN + MAGNITUDE of the remainder term for the FULL N-particle gap
 * ODE (not just the 2-particle reduction), and pins the validity window in
 * g_min over which the tangency law |tau_c| = g_min^2 / 8 holds to a stated
 * relative error. Reconciles two independently-derived remainder forms:
 *
 *   - imp-366 (polymath15-lemma52-shock-holder.js):  d(g_min^2)/dt = -8 + O(g_min),
 *     integrating to |tau_c| = g_min(0)^2 / 8 + O(g_min^3).
 *   - imp-2563 (imp-2563-min-gap-sandwich-theorem.js): the EXACT linearised gap
 *     ODE  du/ds = -8 + 4 B(s) u,  u = r^2,  with B the background field of the
 *     other N-2 particles on the colliding pair.
 *
 * THE RECONCILIATION (they are the same remainder; imp-2563 is one power sharper)
 * ------------------------------------------------------------------------------
 * Both forms start from the same drift. For an adjacent pair a = x_lo < b = x_hi
 * with gap r = b - a, the background drift on the gap is, EXACTLY,
 *
 *     db/ds - da/ds  (background part)  =  2 sum_{j != lo,hi} [ 1/(a-x_j) - 1/(b-x_j) ]
 *                                       =  2 r B(s),
 *
 * since 1/(a-x_j) - 1/(b-x_j) = r / ((a-x_j)(b-x_j)). So dr/ds = -4/r + 2 r B(s),
 * and multiplying by 2r gives the EXACT remainder in d(r^2)/ds:
 *
 *     d(g_min^2)/ds = -8 + 4 B(s) (g_min^2)   [exact, every finite N].   (U)
 *
 * imp-366 wrote the background drift on the gap loosely as an "O(1)" term and
 * multiplied by 2 g_min to get "-8 + O(g_min)". But the background drift on the
 * gap carries an EXPLICIT factor r = g_min (the pair must be ADJACENT, so the
 * field difference telescopes to r B), hence it is O(g_min), and the remainder
 * in d(g_min^2)/ds is therefore 2 g_min * (2 r B) = 4 B g_min^2 = O(g_min^2),
 * NOT O(g_min). The two forms agree: imp-366 "O(g_min)" is a VALID-BUT-LOOSE
 * envelope of the SHARP imp-2563 form 4 B g_min^2 = O(g_min^2), because for
 * g_min <= 1 we have O(g_min^2) subset O(g_min). Carrying the sharp power through
 * the integration upgrades the tangency-law remainder from imp-366's stated
 * O(g_min^3) to the exact O(g_min^4):
 *
 *     |tau_c| = g_min(0)^2 / 8  +  O(beta g_min^4)   [exact; imp-366 stated O(g_min^3)].
 *
 * THE SIGN LEMMA (the N-particle remainder is one-signed, and POSITIVE)
 * --------------------------------------------------------------------
 * In an ordered configuration x_1 < ... < x_N, take any ADJACENT pair
 * a = x_lo < b = x_hi. Every OTHER particle x_j (j != lo, hi) lies either below a
 * or above b -- never strictly between -- so (a - x_j) and (b - x_j) have the
 * SAME sign, hence (b - x_j)(a - x_j) > 0 and
 *
 *     B(s) = sum_{j != lo,hi} 1 / ((b - x_j)(a - x_j))  >  0   (strictly, N >= 3).
 *
 * Therefore the exact remainder 4 B(s) u >= 0: the squared gap decays STRICTLY
 * SLOWER than the bare -8. By Gronwall against u_bare(s) = g^2 - 8 s (which hits
 * 0 at s = g^2/8), w = u - u_bare has w(0) = 0 and w' = 4 B u >= 0 while u > 0,
 * so u >= u_bare and the first collision occurs NO EARLIER than the bare law:
 *
 *     t_c(N)  >=  g_min(0)^2 / 8,   with   t_c = g_min^2/8 + O(beta g_min^4).
 *
 * So the bare two-particle coefficient 8 makes g_min^2/8 a rigorous LOWER bound
 * on |tau_c|; the N-particle background can only DELAY collision, never advance
 * it. This is exactly the mechanism imp-2642 found as a NEGATIVE result: a
 * POSITIVE remainder pushes the effective coefficient |tau_c| / g0^2 ABOVE 1/8,
 * so 1/8 is NOT an upper bound -- and therefore NOT a valid Holder-modulus upper
 * bound C_H. This module RE-DERIVES that sign from first principles (B > 0 for
 * any adjacent pair) and confirms it does not discharge C_H.
 *
 * VALIDITY WINDOW (relative error of the tangency law)
 * ----------------------------------------------------
 * With beta = sup_{0<=s<t_c} |B(s)| (= sup B, since B > 0 here), the imp-2563
 * sandwich gives t_c in [g^2/8, T_+(g,beta)] with one-sided relative deviation
 *
 *     (t_c - g^2/8) / (g^2/8)  <=  (T_+ - g^2/8)/(g^2/8)  =  beta g^2 / 4 + O(g^4).
 *
 * Hence the tangency law |tau_c| = g_min^2/8 holds to relative error eps whenever
 *
 *     g_min  <=  2 sqrt( eps / beta )   [validity window in the min gap].
 *
 * HONEST SCOPE. This verifies the LEADING coefficient 8 (sharp; remainder R = 0
 * in the pure 2-particle case) and the remainder STRUCTURE (sign one-signed
 * positive, magnitude 4 B u = O(beta g^2) differential / O(beta g^4) integrated).
 * It does NOT discharge C_H (the Holder modulus), and 1/8 is NOT a Holder-modulus
 * upper bound -- on the contrary, B > 0 confirms |tau_c|/g0^2 >= 1/8, the
 * imp-2642 NEGATIVE that is locked. No beat is claimed; PT Lambda <= 0.2 SOTA.
 *
 * @see imp-366 polymath15-lemma52-shock-holder.js (O(g_min) remainder, coefficient 8)
 * @see imp-2563-min-gap-sandwich-theorem.js (exact du/ds = -8 + 4 B u; sandwich)
 * @see imp-2642 (POSITIVE-remainder stress test: |tau_c|/g0^2 above 1/8; 1/8 not a sup)
 */

// -- Self-contained finite-N machinery (no heavy imports; mirrors imp-2563) ----

/** Attractive Calogero-Moser drift dx_k/ds = -2 sum_{j!=k} 1/(x_k - x_j). */
function drift(x) {
  const N = x.length;
  const d = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let acc = 0;
    for (let j = 0; j < N; j++) if (j !== k) acc += 1 / (x[k] - x[j]);
    d[k] = -2 * acc;
  }
  return d;
}

/** One classical RK4 step of size h. */
function rk4Step(x, h) {
  const k1 = drift(x);
  const x2 = x.map((v, i) => v + 0.5 * h * k1[i]);
  const k2 = drift(x2);
  const x3 = x.map((v, i) => v + 0.5 * h * k2[i]);
  const k3 = drift(x3);
  const x4 = x.map((v, i) => v + h * k3[i]);
  const k4 = drift(x4);
  return x.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

/** Index lo of the adjacent pair (lo, lo+1) realising the global min gap. */
function minGapPair(x) {
  let lo = 0;
  let best = Infinity;
  for (let i = 0; i < x.length - 1; i++) {
    const g = x[i + 1] - x[i];
    if (g < best) {
      best = g;
      lo = i;
    }
  }
  return { lo, hi: lo + 1, gap: best };
}

/** Background field B = sum_{j != lo,hi} 1/((x_hi - x_j)(x_lo - x_j)). */
function backgroundField(x, lo, hi) {
  const a = x[lo];
  const b = x[hi];
  let s = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === lo || j === hi) continue;
    s += 1 / ((b - x[j]) * (a - x[j]));
  }
  return s;
}

/**
 * Integrate one configuration to collision, tracking beta = sup|B|, the running
 * MINIMUM of B (to certify the sign lemma B > 0 along the whole flow), the
 * measured first-collision time t_c, the bare leading value g^2/8, and the
 * sandwich upper bound T_+.
 */
function tangencyWitness(x0) {
  let x = x0.slice();
  const start = minGapPair(x);
  const g = start.gap;
  const lo0 = start.lo;

  let s = 0;
  let beta = 0;
  let Bmin = Infinity;
  let stablePair = true;
  let gap = start.gap;
  const EPS = 1e-5; // stop a hair before the singularity; correct analytically

  while (gap > EPS) {
    const p = minGapPair(x);
    if (p.lo !== lo0) stablePair = false;
    const B = backgroundField(x, p.lo, p.hi);
    beta = Math.max(beta, Math.abs(B));
    Bmin = Math.min(Bmin, B);
    const h = Math.max(1e-9, Math.min(1e-5, 0.001 * gap * gap));
    x = rk4Step(x, h);
    s += h;
    gap = minGapPair(x).gap;
    if (s > 10) break; // safety: never seen, collision is at ~g^2/8
  }
  const pf = minGapPair(x);
  const Bf = backgroundField(x, pf.lo, pf.hi);
  beta = Math.max(beta, Math.abs(Bf));
  Bmin = Math.min(Bmin, Bf);
  const tc = s + (gap * gap) / 8; // remaining-time leading correction from EPS

  const lead = (g * g) / 8;
  const tPlus = (1 / (4 * beta)) * Math.log(2 / (2 - beta * g * g));

  return {
    g,
    beta,
    Bmin,
    tcNumeric: tc,
    lead,
    tPlus,
    deviation: tc - lead, // integrated remainder; expect O(g^4)
    relError: (tc - lead) / lead, // expect O(g^2), bounded by beta g^2/4
    backgroundPositive: Bmin > 0, // sign lemma: B > 0 along the whole flow
    lowerBoundHolds: tc >= lead * (1 - 1e-6), // t_c >= g^2/8 (B>0 delays collision)
    withinSandwich: tc <= tPlus * (1 + 1e-3), // t_c <= T_+ (imp-2563 upper)
    stablePair,
  };
}

// -- Numerical witnesses --------------------------------------------------------

// (0) Pure 2-particle case: B = 0 identically, so du/ds = -8 EXACTLY and
//     t_c = g^2/8 with NO remainder. This is the coefficient-8 verification at
//     R = 0 -- the sharp leading term the whole tangency law rests on.
const TWO_PARTICLE = tangencyWitness([0.0, 0.4]);

// (1)/(2) N-particle: a fixed well-separated background {-4,-2,3} with one
//     embedded small gap of width g (config A) and g/2 (config B). Same
//     background => beta nearly constant; B > 0 throughout (sign lemma); the
//     integrated deviation t_c - g^2/8 must QUARTER-of-a-quarter (factor ~16)
//     when g halves (O(g^4) law), while the relative error quarters (O(g^2)).
const CONFIG_A = tangencyWitness([-4, -2, 0.0, 0.3, 3]);
const CONFIG_B = tangencyWitness([-4, -2, 0.075, 0.225, 3]);
const DEVIATION_RATIO = CONFIG_A.deviation / CONFIG_B.deviation; // expect ~16
const REL_ERROR_RATIO = CONFIG_A.relError / CONFIG_B.relError; // expect ~4

// (3) Constant-B closed form cross-check: with B == beta frozen, the exact
//     solution gives t_c = T_+ = g^2/8 + beta g^4/32 + O(g^6). Verify the
//     leading O(g^4) coefficient beta/32 against the closed form at three gaps.
function constantBClosedForm(g, beta) {
  const tPlus = (1 / (4 * beta)) * Math.log(2 / (2 - beta * g * g));
  const dev = tPlus - (g * g) / 8;
  const predicted = (beta * g * g * g * g) / 32; // beta g^4 / 32
  return { g, beta, tPlus, dev, predicted, ratio: dev / predicted };
}
const CF_BETA = 0.2;
const CF_ROWS = [0.3, 0.15, 0.075].map((g) => constantBClosedForm(g, CF_BETA));

// (4) Validity window: |tau_c| = g^2/8 to relative error eps holds for
//     g <= 2 sqrt(eps / beta). Tabulate the max gap at a few error targets.
function validityWindow(eps, beta) {
  return 2 * Math.sqrt(eps / beta);
}
const WINDOW_ROWS = [1e-2, 1e-3, 1e-4].map((eps) => ({
  eps,
  beta: CONFIG_A.beta,
  gMax: validityWindow(eps, CONFIG_A.beta),
}));

// -- Exported record ------------------------------------------------------------

export const TANGENCY_REMAINDER_SIGN = {
  id: 'imp-2690',
  parent: 'imp-2690',
  closes:
    'imp-2690: verify coefficient 8 and the remainder sign/magnitude for the ' +
    'N-particle (not just 2-particle) gap ODE; reconcile imp-366 O(g_min) vs ' +
    'imp-2563 exact 4 B u; pin the tangency validity window in g_min.',
  verdict: 'CLOSED (verification + reconciliation; no beat claimed)',

  reconciliation:
    'The imp-366 remainder "-8 + O(g_min)" and the imp-2563 exact "-8 + 4 B(s) u" ' +
    'are the SAME remainder. The background drift on an ADJACENT gap telescopes ' +
    'to 2 r B(s) (explicit factor r), so the d(g^2)/ds remainder is 4 B g^2 = ' +
    'O(g^2), and imp-366 "O(g_min)" is a valid-but-loose envelope of it ' +
    '(O(g^2) subset O(g) for g <= 1). Carrying the sharp power through the ' +
    'integral upgrades the tangency remainder from imp-366 O(g_min^3) to the ' +
    'exact O(g_min^4).',

  coefficientEight:
    'Sharp. In the pure 2-particle case B = 0 identically, du/ds = -8 EXACTLY ' +
    'and t_c = g^2/8 with zero remainder (witness: rel error ~1e-8, pure ' +
    'integration noise). The 8 = 2 * (4) comes from 2g * (-4/g) in the Dyson ' +
    'beta=2 two-particle repulsion.',

  signLemma:
    'For any adjacent pair a = x_lo < b = x_hi, every other particle lies below ' +
    'a or above b, so (a-x_j)(b-x_j) > 0 and B(s) = sum 1/((b-x_j)(a-x_j)) > 0 ' +
    'strictly (N >= 3). Hence the remainder 4 B u >= 0: the squared gap decays ' +
    'slower than the bare -8, and by Gronwall t_c(N) >= g^2/8. The N-particle ' +
    'background can only DELAY collision, never advance it.',

  magnitude:
    'Differential remainder 4 B(s) u = O(beta g^2); integrated deviation ' +
    't_c - g^2/8 = O(beta g^4). Witness ratios on halving g: deviation /16 ' +
    '(O(g^4)) and relative error /4 (O(g^2)).',

  validityWindow:
    '|tau_c| = g_min^2/8 holds to relative error eps for g_min <= 2 sqrt(eps/beta) ' +
    '(one-sided deviation (T_+ - g^2/8)/(g^2/8) = beta g^2/4 + O(g^4)).',

  reconcilesImp2642:
    'B > 0 is precisely the POSITIVE remainder imp-2642 found by stress test: ' +
    'it pushes |tau_c|/g0^2 ABOVE 1/8, so 1/8 is NOT a sup and NOT a valid ' +
    'Holder-modulus upper bound C_H. This module re-derives that sign from ' +
    'first principles; it does NOT discharge C_H (imp-2642 NEGATIVE locked).',

  honest:
    'Verifies the LEADING coefficient 8 and the remainder STRUCTURE (one-signed ' +
    'positive, O(beta g^2) differential / O(beta g^4) integrated). Does NOT ' +
    'discharge C_H. 1/8 is NOT a Holder-modulus upper bound. No beat; PT ' +
    'Lambda <= 0.2 SOTA.',

  witness: {
    twoParticle: TWO_PARTICLE,
    configA: CONFIG_A,
    configB: CONFIG_B,
    deviationRatioAoverB: DEVIATION_RATIO,
    relErrorRatioAoverB: REL_ERROR_RATIO,
    constantBClosedForm: CF_ROWS,
    validityWindowRows: WINDOW_ROWS,
  },

  sources: [
    'src/data/polymath15-lemma52-shock-holder.js (imp-366: coefficient 8, O(g_min) remainder)',
    'src/data/imp-2563-min-gap-sandwich-theorem.js (exact du/ds = -8 + 4 B u; sandwich T_-,T_+)',
    'imp-2642 (POSITIVE-remainder stress test; 1/8 not a Holder sup, NEGATIVE locked)',
  ],
};

// -- Build-time assertions ------------------------------------------------------

export const TANGENCY_REMAINDER_SIGN_ASSERTIONS = [
  {
    id: 'imp2690-coefficient-8-sharp-two-particle',
    holds: () => Math.abs(TWO_PARTICLE.relError) < 1e-5 && TWO_PARTICLE.Bmin === 0,
    why:
      'Pure 2-particle case: B = 0 identically so du/ds = -8 EXACTLY and ' +
      't_c = g^2/8 with no remainder (relative error is pure RK4 noise < 1e-5). ' +
      'This certifies the sharp leading coefficient 8 at R = 0.',
  },
  {
    id: 'imp2690-background-field-strictly-positive',
    holds: () =>
      CONFIG_A.backgroundPositive === true &&
      CONFIG_B.backgroundPositive === true &&
      CONFIG_A.Bmin > 0 &&
      CONFIG_B.Bmin > 0,
    why:
      'Sign lemma: for an adjacent pair every other particle lies outside [a,b], ' +
      'so (a-x_j)(b-x_j) > 0 and B(s) > 0 along the ENTIRE flow. Failure means ' +
      'the sign argument (hence the t_c >= g^2/8 lower bound and the imp-2642 ' +
      'reconciliation) is wrong.',
  },
  {
    id: 'imp2690-tangency-is-lower-bound',
    holds: () =>
      CONFIG_A.lowerBoundHolds === true &&
      CONFIG_B.lowerBoundHolds === true &&
      CONFIG_A.withinSandwich === true &&
      CONFIG_B.withinSandwich === true &&
      CONFIG_A.stablePair === true &&
      CONFIG_B.stablePair === true,
    why:
      'Because B > 0 delays collision, the measured t_c must satisfy ' +
      'g^2/8 <= t_c <= T_+ at both configurations (positive remainder => bare ' +
      'g^2/8 is a LOWER bound). This is the N-particle statement the 2-particle ' +
      'coefficient 8 underpins.',
  },
  {
    id: 'imp2690-integrated-remainder-is-O-g4',
    holds: () => DEVIATION_RATIO > 13 && DEVIATION_RATIO < 20,
    why:
      'The integrated remainder t_c - g^2/8 is O(beta g^4) (exact form), so ' +
      'halving g must reduce it by a factor ~16. This upgrades imp-366 stated ' +
      'O(g_min^3) to the exact O(g_min^4) and is the integrated content of the ' +
      'reconciliation.',
  },
  {
    id: 'imp2690-differential-remainder-is-O-g2',
    holds: () => REL_ERROR_RATIO > 3.6 && REL_ERROR_RATIO < 4.5,
    why:
      'The relative error (t_c - g^2/8)/(g^2/8) ~ beta g^2/4 is O(g^2), so ' +
      'halving g quarters it. This upgrades imp-366 stated O(g_min) differential ' +
      'remainder to the exact 4 B u = O(g_min^2).',
  },
  {
    id: 'imp2690-constant-B-closed-form-leading-coeff',
    holds: () => CF_ROWS.every((r) => r.ratio > 0.99 && r.ratio < 1.05),
    why:
      'With B frozen at beta the exact solution gives t_c - g^2/8 = beta g^4/32 ' +
      '+ O(g^6); the closed-form deviation must match beta g^4/32 with ratio ' +
      '-> 1 as g shrinks. Confirms the O(g^4) coefficient analytically, ' +
      'independent of the RK4 witness.',
  },
];

// -- Self-executing tripwire (matches the imp-2563 sibling pattern) -------------
for (const a of TANGENCY_REMAINDER_SIGN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `[imp-2690-tangency-remainder-sign] build-time assertion failed: ${a.id} - ${a.why}`,
    );
  }
}
