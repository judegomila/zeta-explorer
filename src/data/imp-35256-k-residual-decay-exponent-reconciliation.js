/**
 * @module imp-35256-k-residual-decay-exponent-reconciliation
 *
 * imp-35256 (numerical, frontier-measurement): RECONCILE the imp-35240 O(eps) prefactor-residual claim
 * against the imp-35244 next-order eps^{7/2} finding by MEASURING the true decay exponent of
 * K(eps) = (rho(eps) - 2/3)/eps^{3/2} minus the derived closed form 8 sqrt(2)/(9 pi) = 0.40014.
 *
 * THE DISCREPANCY
 * ---------------
 * imp-35240 reads the K-ladder residual K(eps) - 8 sqrt(2)/(9 pi) as shrinking like O(eps) ("the physical
 * next-order term") on its compensated finite-cutoff quadrature ladder. imp-35244 finds the eps^{5/2} slot
 * in rho is EMPTY and the true next-order term is eps^{7/2}. Since
 *     K(eps) - K_closed = (rho - 2/3 - K_closed eps^{3/2}) / eps^{3/2} = r1(eps) / eps^{3/2},
 * an empty eps^{5/2} slot (r1 ~ eps^{7/2}) forces K(eps) - K_closed ~ eps^2 = O(eps^2), NOT O(eps). The two
 * module verdicts are numerically incompatible AS STATED. This module measures the exponent on BOTH routes
 * and pins down why. MEASUREMENT ONLY on the inherited surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.
 *
 * RESULT (measured, this build): BOTH readings are internally correct -- on DIFFERENT integrands.
 * --------------------------------------------------------------------------------------------------
 *   - imp-35240 route (conjugate-symmetric finite-cutoff g_3(t) = (t^2 - i)^{-3} + (t^2 + i)^{-3}):
 *     K(eps) - K_closed decays with LOCAL EXPONENT p ~ 1.00 across eps = {1e-4 .. 3e-6} (then floors on
 *     roundoff near eps = 1e-6). So imp-35240 correctly reads O(eps) ON ITS OWN integrand.
 *   - imp-35244 route (direct branch pair B_3(+) + B_3(-) ~ (i - t^2)^{-3} + (i + t^2)^{-3}, the TRUE
 *     m_double_prime pairing): K(eps) - K_closed decays with LOCAL EXPONENT p ~ 2.00 cleanly across the
 *     imp-35193 clean window N = {1e3 .. 1e6}. So imp-35244 correctly reads O(eps^2) ON ITS integrand.
 *
 * WHY (the odd-power sign flip)
 * -----------------------------
 * The two finite-cutoff integrands for the odd power p = 3 differ by a SINGLE SIGN. The direct branch
 * integrand rescales (u = sqrt(eps) t) to (i - t^2)^{-3} + (i + t^2)^{-3}; using (t^2 - i) = -(i - t^2)
 * and the odd power, (t^2 - i)^{-3} = -(i - t^2)^{-3}, so the imp-35240 symmetric integrand equals
 * -(i - t^2)^{-3} + (i + t^2)^{-3} -- the SAME two branches with the first sign FLIPPED. Both reproduce
 * the leading amplitude A_2 (both give |F_3(inf)| -> A_2/4, rho -> 2/3, K -> 8 sqrt(2)/(9 pi)), so they
 * agree at leading order. But the large-t tails behave oppositely:
 *     symmetric  (t^2 - i)^{-3} + (t^2 + i)^{-3} ~  2 t^{-6}  (the t^{-6} tail SURVIVES) -> eps^{5/2} -> K-resid O(eps)
 *     odd pair   (i - t^2)^{-3} + (i + t^2)^{-3} ~ -6 i t^{-8} (the t^{-6} tail CANCELS)  -> eps^{7/2} -> K-resid O(eps^2)
 * So the eps^{5/2} tail imp-35240 saw is a fingerprint of the conjugate-symmetric SURROGATE integrand, not
 * of the true m_double_prime. imp-35244's diagnosis of the imp-35216 R_3 mis-pairing is the correct one.
 *
 * VERDICT ON THE RECONCILIATION
 * -----------------------------
 * imp-35244 is CORRECT for the physical rho: the true model-cusp m_double_prime is the odd-p branch pair,
 * whose next-order term is eps^{7/2}, hence K(eps) - 8 sqrt(2)/(9 pi) = O(eps^2). imp-35240's O(eps) is a
 * mis-pairing artifact of the conjugate-symmetric finite-cutoff surrogate it happened to build (which
 * reproduces the leading amplitude but injects a spurious eps^{5/2} tail). BOTH numerical reads are valid
 * measurements -- of two different integrands that coincide only at leading order. The corrected reading:
 *     K(eps) - 8 sqrt(2)/(9 pi) = O(eps^2),   with K-residual ~ K_{7/2} eps^2, K_{7/2} = -8 sqrt(2)/(3 pi).
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a
 * rigorous remainder bound on the TRUE RvM cusp jet. Reconciling the two numerical exponent reads (and
 * fixing the O(eps) vs O(eps^2) contradiction in favour of O(eps^2)) sharpens the remainder shape but
 * supplies neither the uniform inequality nor a certified bound, and is read on the inherited model-cusp
 * surrogate. G-b / G6a stay OPEN.
 *
 * VERDICT: MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate,
 * G6a_shock_lipschitz STAYS OPEN. Measuring the local decay exponent of K(eps) - 8 sqrt(2)/(9 pi) on BOTH
 * routes shows the imp-35240 conjugate-symmetric finite-cutoff integrand gives p ~ 1.00 (O(eps)) while the
 * imp-35244 direct odd-p branch pair (the true m_double_prime) gives p ~ 2.00 (O(eps^2)); the two differ
 * by the odd-power sign flip that cancels the t^{-6} tail. The physically-correct reading is O(eps^2)
 * (imp-35244); the imp-35240 O(eps) is a conjugate-symmetric surrogate artifact. This reconciles the two
 * module verdicts but does NOT certify a uniform modulus, does NOT discharge O3 or G6a, establishes no
 * operator positivity, changes no bound. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb
 * remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (reads K-residual O(eps) on the symmetric finite-cutoff route)
 * @see imp-35244-rho-eps52-coefficient-measurement (eps^{5/2} slot EMPTY, next term eps^{7/2}; the mis-pairing diagnosis)
 * @see imp-35216-rho-prefactor-closed-form-assessment (derived K = 8 sqrt(2)/(9 pi); source of the R_3 tail mis-pairing)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), eps^{5/2} renorm)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;
const A2 = (3 * PI) / (2 * SQRT2); // imp-33645 curvature amplitude (reference check only)
const K_CLOSED_FORM = (8 * SQRT2) / (9 * PI); // = 4/(3 A_2) = 0.40014 (imp-35216 / imp-35240)
const K_SEVEN_HALVES = -8 / (3 * (PI / SQRT2)); // = -8 sqrt(2)/(3 pi) = -1.20042 (imp-35244 next-order coefficient)
const TWO_THIRDS = 2 / 3;

// ── Route A: imp-35240 conjugate-symmetric finite-cutoff quadrature. ──
// g_p(t) = (t^2 - i)^{-p} + (t^2 + i)^{-p}, real by conjugate pairing.
function gpSymmetric(p, t) {
  const t2 = t * t;
  const t4 = t2 * t2;
  if (p === 2) {
    const A = t4 - 1;
    return (2 * A) / (A * A + 4 * t4);
  }
  const t6 = t4 * t2;
  const A = t6 - 3 * t2;
  const B = 1 - 3 * t4;
  return (2 * A) / (A * A + B * B);
}
function compensatedSimpson(f, panels) {
  const h = 1 / panels;
  let sum = 0;
  let comp = 0;
  for (let i = 0; i <= panels; i++) {
    const w = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    const y = w * f(i * h) - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  return (sum * h) / 3;
}
function fInfinitySym(p, panels) {
  return compensatedSimpson((x) => {
    if (x >= 1) return 0;
    const om = 1 - x;
    const t = x / om;
    return gpSymmetric(p, t) / (om * om);
  }, panels);
}
function tailSym(p, L, panels) {
  return compensatedSimpson((w) => {
    if (w === 0) return 0;
    const t = L / w;
    return gpSymmetric(p, t) * (L / (w * w));
  }, panels);
}
const F2_INF_SYM = Math.abs(fInfinitySym(2, 1000000));
const F3_INF_SYM = Math.abs(fInfinitySym(3, 1000000));
function rhoSymmetric(eps) {
  const L = 1 / Math.sqrt(eps);
  const absF2 = F2_INF_SYM + tailSym(2, L, 300000);
  const absF3 = F3_INF_SYM + tailSym(3, L, 300000);
  return absF2 / (2 * absF3);
}
// Clean window before the roundoff floor near eps = 1e-6 (documented in imp-35240).
const EPS_LADDER_SYM = [1e-4, 3e-5, 1e-5, 3e-6];
const SYM_ROWS = EPS_LADDER_SYM.map((eps) => {
  const rho = rhoSymmetric(eps);
  const K = (rho - TWO_THIRDS) / Math.pow(eps, 1.5);
  return { eps, rho, K, resid: K - K_CLOSED_FORM };
});

// ── Route B: imp-35244 direct branch quadrature (the TRUE m_double_prime odd-p pairing). ──
// B_p(sgn) = integral_0^1 (i eps - sgn u^2)^{-p} du (cusp-removed), same route as imp-35193 / imp-35244.
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function branch(eps, sgn, p) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps];
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
function rhoDirect(eps) {
  const Bp2 = branch(eps, +1, 2);
  const Bm2 = branch(eps, -1, 2);
  const Bp3 = branch(eps, +1, 3);
  const Bm3 = branch(eps, -1, 3);
  const cRen = Math.hypot(-2 * (Bp2[0] + Bm2[0]), -2 * (Bp2[1] + Bm2[1])) * Math.pow(eps, 1.5);
  const cCurv = Math.hypot(4 * (Bp3[0] + Bm3[0]), 4 * (Bp3[1] + Bm3[1])) * Math.pow(eps, 2.5);
  return cRen / cCurv;
}
const N_LADDER_DIRECT = [1e3, 1e4, 1e5, 1e6];
const DIRECT_ROWS = N_LADDER_DIRECT.map((N) => {
  const eps = Math.sqrt((2 * PI) / N);
  const rho = rhoDirect(eps);
  const K = (rho - TWO_THIRDS) / Math.pow(eps, 1.5);
  return { N, eps, rho, K, resid: K - K_CLOSED_FORM };
});

// Local decay exponent of |K(eps) - K_closed| between consecutive rungs.
function localExponents(rows) {
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    out.push(
      Math.log(Math.abs(rows[i].resid) / Math.abs(rows[i - 1].resid)) /
        Math.log(rows[i].eps / rows[i - 1].eps),
    );
  }
  return out;
}
const SYM_EXPONENTS = localExponents(SYM_ROWS); // ~1.00
const DIRECT_EXPONENTS = localExponents(DIRECT_ROWS); // ~2.00
const SYM_MEAN_EXPONENT = SYM_EXPONENTS.reduce((a, b) => a + b, 0) / SYM_EXPONENTS.length;
const DIRECT_MEAN_EXPONENT = DIRECT_EXPONENTS.reduce((a, b) => a + b, 0) / DIRECT_EXPONENTS.length;

export const IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION = {
  id: 'imp-35256',
  proofSection: 'S-frontier',
  scopes:
    'Reconcile the imp-35240 K-residual O(eps) claim against the imp-35244 empty-eps^{5/2} / next-term-eps^{7/2} ' +
    'finding by measuring the true decay exponent of K(eps) = (rho - 2/3)/eps^{3/2} minus 8 sqrt(2)/(9 pi) on ' +
    'both routes',
  question:
    'Does K(eps) - 8 sqrt(2)/(9 pi) decay like O(eps) (imp-35240) or O(eps^2) (implied by imp-35244 empty ' +
    'eps^{5/2} slot)? Measurement only on the inherited surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.',

  kClosedForm: +K_CLOSED_FORM.toFixed(10), // 0.4001405850
  kSevenHalves: +K_SEVEN_HALVES.toFixed(10), // -1.2004217587 (imp-35244 next-order coefficient)

  // Route A: imp-35240 conjugate-symmetric finite-cutoff integrand g_3 = (t^2-i)^-3 + (t^2+i)^-3.
  symmetricRoute: {
    integrand: 'g_3(t) = (t^2 - i)^{-3} + (t^2 + i)^{-3} (conjugate pair, real)',
    ladder: SYM_ROWS.map((r) => ({
      eps: +r.eps.toExponential(1),
      K: +r.K.toFixed(9),
      kResidual: +r.resid.toExponential(4),
    })),
    localExponents: SYM_EXPONENTS.map((p) => +p.toFixed(4)),
    meanExponent: +SYM_MEAN_EXPONENT.toFixed(4), // ~1.00 -> O(eps)
    reads: 'O(eps)',
  },

  // Route B: imp-35244 direct branch pair (the true m_double_prime odd-p pairing).
  directRoute: {
    integrand: 'B_3(+) + B_3(-) rescales to (i - t^2)^{-3} + (i + t^2)^{-3} (odd-p pair; true m_double_prime)',
    ladder: DIRECT_ROWS.map((r) => ({
      N: r.N,
      eps: +r.eps.toExponential(4),
      K: +r.K.toFixed(8),
      kResidual: +r.resid.toExponential(4),
    })),
    localExponents: DIRECT_EXPONENTS.map((p) => +p.toFixed(4)),
    meanExponent: +DIRECT_MEAN_EXPONENT.toFixed(4), // ~2.00 -> O(eps^2)
    reads: 'O(eps^2)',
  },

  // The reconciliation.
  bothReadsInternallyCorrect: true, // each module correctly measured ITS OWN integrand
  discrepancyMechanism:
    'The two odd-p (p=3) finite-cutoff integrands differ by a single sign: (t^2-i)^{-3} = -(i-t^2)^{-3}, so ' +
    'the imp-35240 symmetric pair equals -(i-t^2)^{-3}+(i+t^2)^{-3} -- the imp-35244 direct pair with the ' +
    'first branch sign FLIPPED. Both reproduce the leading amplitude A_2 (rho -> 2/3, K -> 8 sqrt(2)/(9 pi)) ' +
    'but the symmetric pair keeps a t^{-6} tail (-> eps^{5/2} -> K-resid O(eps)) while the true odd pair ' +
    'cancels it to t^{-8} (-> eps^{7/2} -> K-resid O(eps^2)).',
  physicallyCorrectReading: 'O(eps^2)', // imp-35244 route is the true m_double_prime pairing
  correctModule: 'imp-35244',
  imp35240ReadingIsSurrogateArtifact: true, // its O(eps) is the conjugate-symmetric finite-cutoff surrogate tail

  couplingIsHalfInteger: true, // all surviving rho terms carry half-integer powers (Holder-1/2 fingerprint)
  dischargesO3orG6a: false, // reconciling two numerical exponent reads is not a certified uniform inequality
  residualObstruction:
    'O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a ' +
    'rigorous remainder bound on the TRUE RvM cusp jet; fixing the O(eps) vs O(eps^2) contradiction in favour ' +
    'of O(eps^2) sharpens the remainder shape but supplies neither the uniform inequality nor a certified ' +
    'remainder, and is read on the model-cusp surrogate; G-b stays OPEN',

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. Measuring the local decay exponent of K(eps) - 8 sqrt(2)/(9 pi) on BOTH routes: the imp-35240 ' +
    'conjugate-symmetric finite-cutoff integrand g_3 = (t^2-i)^{-3}+(t^2+i)^{-3} gives exponent ~1.00 (O(eps)) ' +
    'across eps = {1e-4 .. 3e-6}, while the imp-35244 direct branch pair (i-t^2)^{-3}+(i+t^2)^{-3} -- the TRUE ' +
    'm_double_prime pairing -- gives exponent ~2.00 (O(eps^2)) across N = {1e3 .. 1e6}. BOTH reads are correct ' +
    'on their own integrand; the integrands differ by the odd-power sign flip (t^2-i)^{-3} = -(i-t^2)^{-3} that ' +
    'cancels the t^{-6} tail. The physically-correct reading is O(eps^2) (imp-35244); the imp-35240 O(eps) is a ' +
    'conjugate-symmetric finite-cutoff surrogate artifact that reproduces the leading amplitude but injects a ' +
    'spurious eps^{5/2} tail. This reconciles the two module verdicts but does NOT certify a uniform modulus, ' +
    'does NOT discharge O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35256_K_RESIDUAL_DECAY_EXPONENT_ASSERTIONS = [
  {
    // (1) imp-35240 symmetric route reads K-residual ~ O(eps): mean local exponent near 1.
    id: 'imp35256-symmetric-route-reads-O-eps',
    description: 'K(eps) - 8 sqrt(2)/(9 pi) on the conjugate-symmetric finite-cutoff route decays like eps^1 (mean exponent in [0.9, 1.1])',
    holds: () => SYM_MEAN_EXPONENT > 0.9 && SYM_MEAN_EXPONENT < 1.1,
  },
  {
    // (2) imp-35244 direct route reads K-residual ~ O(eps^2): mean local exponent near 2.
    id: 'imp35256-direct-route-reads-O-eps2',
    description: 'K(eps) - 8 sqrt(2)/(9 pi) on the true odd-p branch route decays like eps^2 (mean exponent in [1.9, 2.1])',
    holds: () => DIRECT_MEAN_EXPONENT > 1.9 && DIRECT_MEAN_EXPONENT < 2.1,
  },
  {
    // (3) the two exponents genuinely differ by ~1 (the discrepancy is real, not noise).
    id: 'imp35256-routes-differ-by-one-order',
    description: 'the direct-route exponent exceeds the symmetric-route exponent by at least 0.8 (a full order in eps)',
    holds: () => DIRECT_MEAN_EXPONENT - SYM_MEAN_EXPONENT > 0.8,
  },
  {
    // (4) both routes still reproduce the leading prefactor 8 sqrt(2)/(9 pi) (they agree at leading order).
    id: 'imp35256-both-routes-hit-leading-prefactor',
    description: 'both routes give K -> 8 sqrt(2)/(9 pi) at their tightest rung (|K - K_closed| < 1e-5 symmetric, < 1e-4 direct)',
    holds: () =>
      Math.abs(SYM_ROWS[SYM_ROWS.length - 1].resid) < 1e-5 &&
      Math.abs(DIRECT_ROWS[DIRECT_ROWS.length - 1].resid) < 1e-4,
  },
  {
    // Honesty gate: measurement only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35256-honesty-gate-no-qed',
    description:
      'Measurement only: exponents reconciled but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION.isRigorous === false &&
      IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION.verdict) &&
      /STAYS OPEN/.test(IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35256_K_RESIDUAL_DECAY_EXPONENT_RECONCILIATION.verdict,
      ),
  },
];

for (const a of IMP35256_K_RESIDUAL_DECAY_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35256-k-residual-decay-exponent-reconciliation assertion failed: ${a.id}`);
  }
}
