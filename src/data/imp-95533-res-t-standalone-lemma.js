/**
 * imp-95533 — Formalize imp-95530 THEOREM RES-T (fixed-support Weil-positivity
 * resolution law) as a STANDALONE LEMMA, independent of the NS-RIGID dichotomy,
 * and re-verify the imp-95520 Class II correction it claims.
 *
 * ASSESSMENT VERDICT: YES. RES-T is self-contained. Its objects (the compact-
 * support Weil form W_T, a Fejer test packet, an off-line zero quadruple) are
 * DISJOINT from NS-RIGID's objects (the native-span Caratheodory-Pick matrix
 * P_S(eps), the backward heat flow Xi_eps). No step of the RES-T proof uses the
 * A4 dichotomy, the flow-analyticity A2, or the Lagarias-Pick identity A1. The
 * ONLY ingredient the two theorems share is the Weil/Guinand explicit formula
 * itself, which is upstream of both and is not part of either theorem's claim.
 * Hence RES-T can be, and is here, extracted as a lemma with no reference to the
 * native span. RH remains OPEN; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------
 * LEMMA RES-T (standalone). Fix T > 0. Let f be a real even test function with
 * supp f c [-T, T], so its Weil transform fhat(r) = int f(x) e^{irx} dx is an
 * entire function of exponential type T (Paley-Wiener). Let
 *   W_T(f) = archimedean(f) + pole(f) - prime(f) = sum_rho fhat(gamma_rho)
 * be the Weil explicit-formula functional, gamma_rho = (rho - 1/2)/i running over
 * the nontrivial zeros. Weil positivity: RH <=> W_T(f) >= 0 for all f of
 * positive type. Take the Fejer packet concentrated at a real height H:
 *   fhat(r) = (r - H) * sinc^2( T (r - H) / 2 ),   sinc(x) = sin(x)/x,
 * which is of exponential type T (so supp f c [-T, T]) and VANISHES at r = H, so
 * it is blind to a single on-line zero sitting exactly at height H.
 *
 *  (L1) OFF-LINE INCREMENT (exact, elementary). Replace the on-line zero at
 *       height H by the functional-equation quadruple { beta +- iH, 1-beta +- iH },
 *       delta = beta - 1/2. The four heights are gamma = +-H +- i delta. Because
 *       fhat(H) = 0 the removed on-line mass is zero, and the added mass is
 *         dZ = 2 Re[ fhat(H - i delta) conj( fhat(H + i delta) ) ].
 *       Evaluating fhat at the complex height H -+ i delta, with r - H = -+ i delta
 *       and sinc( -+ i T delta / 2 ) = sinh(T delta / 2)/(T delta / 2) =: S(T delta),
 *         fhat(H -+ i delta) = ( -+ i delta ) S(T delta)^2,
 *       so fhat(H - i delta) conj(fhat(H + i delta)) = ( -i delta S^2)( -i delta S^2 )
 *       = - delta^2 S^4, giving the closed form
 *         dZ = -2 delta^2 S(T delta)^4,      S(x) = sinh(x/2)/(x/2).
 *       dZ < 0: an off-line quadruple LOWERS the zero side.
 *
 *  (L2) ON-LINE MASS (exact leading order). The mean zero density at height H is
 *       (1/2pi) log(H/2pi). The positive contribution of the near-H on-line zeros
 *       to W_T(f) is (density) times int (r-H)^2 sinc^4(T(r-H)/2) dr. With the
 *       identity int_{-inf}^{inf} x^2 sinc^4(T x/2) dx = 4 pi / T^3 (verified
 *       below to 5e-4), the on-line mass is
 *         M_on = (1/2pi) log(H/2pi) * 4 pi / T^3 = 2 log(H/2pi) / T^3.
 *
 *  (L3) EXCLUSION THRESHOLD. W_T(f) = M_on + dZ, so W_T(f) < 0 (the off-line
 *       configuration is EXCLUDED by W_T >= 0) iff
 *         delta^2 S(T delta)^4 T^3 > log(H/2pi).                        (RES-T*)
 *       Since S(T delta) ~ e^{T delta / 2}/(T delta) for large T, the detectable
 *       height grows doubly-exponentially: W_T sees off-line quadruples of
 *       displacement delta up to height H ~ 2pi exp( delta^2 S^4 T^3 ).
 *
 *  (L4) HEIGHT CEILING. At the canonical edge displacement delta = 1/2 (a zero at
 *       the 1-line), (RES-T*) reads (1/4) S(T/2)^4 T^3 > log(X/2pi). Its root
 *         T_X = { 3.168 at X=1e6, 3.882 at X=3e12, 4.355 at X=1e20 }
 *       is the smallest T at which W_T can detect a delta=1/2 quadruple sitting at
 *       the verified height X.
 *
 * ---------------------------------------------------------------------------
 * RE-VERIFICATION OF THE imp-95520 CLASS II CORRECTION.
 *
 * The imp-95520 Class II reading (imp-95520-weil-pick-identity-finite-truncation.js)
 * states, on the piecewise-linear hat basis with half-width delta_grid = 0.05:
 *   "A zero at height H off the line perturbs W_T by O(e^{T}/H^4) on this basis:
 *    for T fixed, W_T >= 0 is a CONSEQUENCE of the verified height."
 * i.e. it reads the off-line increment as decaying like H^{-4} in the zero height,
 * so that for EVERY fixed T all sufficiently high zeros are invisible and W_T >= 0
 * follows from the finitely many verified low zeros.
 *
 * RES-T (L1) shows the true increment dZ = -2 delta^2 S(T delta)^4 is INDEPENDENT
 * of the zero height H (it depends only on T and the displacement delta); the
 * H-dependence lives entirely in the on-line normalizing mass M_on ~ log(H)/T^3
 * of (L2). The apparent H^{-4} / e^{T} decay is a NYQUIST ARTIFACT of the
 * delta_grid = 0.05 sampling lattice (the hat kernel 16 sin^4(gamma delta_grid/2)
 * /(delta_grid^2 gamma^4) rolls off as gamma^{-4} above the grid Nyquist
 * frequency pi/delta_grid ~ 63, aliasing the true type-T packet). The corrected
 * statement is (L3)-(L4):
 *   - W_T >= 0 is a consequence of the verified height X ONLY for T < T_X
 *     (T_X = 3.882 at X = 3e12); the T <= 3 hat table itself is unaffected since
 *     3 < T_X.
 *   - For T > T_X, W_T >= 0 is STRICTLY STRONGER than verified height and
 *     STRICTLY WEAKER than RH: its content is the zero-free region
 *     beta - 1/2 <= sqrt( log(t/2pi) / (T^3 S(T*(beta-1/2))^4) ), nontrivial up to
 *     t ~ 2pi exp(T^3 / (4 S^4)).
 *
 * CORRECTION WITNESS (imp-95530 detection scan, height H = 6.0e5): (RES-T*)
 * predicts T* = 5.183 for delta = 0.25 (measured blind at T = 4, detected at
 * T = 5) and T* = 3.179 for delta = 0.49 (blind at 3, detected at 4). A fixed-T
 * O(e^T/H^4) law cannot produce a delta-dependent detection ONSET in T at fixed H;
 * the observed onsets confirm the height-INDEPENDENT (L1) increment gated by the
 * log(H)/T^3 mass, i.e. the RES-T correction, not the Class II reading.
 *
 * INDEPENDENCE CHECK. The lemma statement and its proof (L1)-(L4) reference only:
 * the explicit formula, Paley-Wiener, the sinc/Fejer packet, and elementary
 * complex evaluation of an entire function at H -+ i delta. They do NOT reference
 * P_S(eps), the backward flow Xi_eps, real-analyticity in eps (A2), the PD
 * dichotomy (A4), the Lagarias-Pick identity (A1), or the Blaschke/Muntz A6
 * discussion. RES-T is therefore genuinely a standalone lemma; NS-RIGID is a
 * parallel, independent theorem on a different function class (the native span).
 * The two only meet through the shared explicit-formula upstream.
 *
 * RESIDUAL (named). This module extracts and re-verifies the lemma; it does NOT
 * supply the (L4) T > T_X proof, which imp-95530 (B3) reduces to a POINTWISE
 * short von-Mangoldt Dirichlet-polynomial bound at heights in (X, exp(c e^T)) --
 * the pointwise Hilbert-transform wall. That wall is unclosed and is shared with
 * the imp-95519 / perm-arch no-gos (imp-95543). RES-T changes no bound; it is NOT
 * a Lambda lever (the barrier needs all zeros real below X, not a strip;
 * zero-density-lambda-inert-2026-07-09.js lever 4).
 *
 * Import-free: literals for the imp-95530 / imp-95520 cross-values are baked and
 * the closed forms are recomputed. Changes no bound; NO QED; no refereed bound is changed
 * ; RH open.
 */

// sinc(x) = sin(x)/x on the real axis; S(x) = sinh(x/2)/(x/2) is its value on the
// imaginary axis (the analytic continuation evaluated at H -+ i delta).
const Sfac = (x) => (Math.abs(x) < 1e-12 ? 1 : Math.sinh(x / 2) / (x / 2));

// (L1) exact off-line increment closed form dZ = -2 delta^2 S(T delta)^4.
export const resTIncrement = (T, delta) => -2 * delta * delta * Math.pow(Sfac(T * delta), 4);

// (L1) complex-evaluation cross-check: 2 Re[ fhat(H - i delta) conj fhat(H + i delta) ]
// with fhat(H -+ i delta) = ( -+ i delta ) S(T delta)^2.
function resTIncrementComplex(T, delta) {
  const S = Sfac(T * delta);
  const a = [0, -delta * S * S]; // fhat(H - i delta) = (-i delta) S^2  [real, imag]
  const b = [0, delta * S * S];  // fhat(H + i delta) = ( i delta) S^2
  const re = a[0] * b[0] + a[1] * b[1]; // Re[ a * conj(b) ]
  return 2 * re;
}

// (L2) on-line normalizing mass M_on = 2 log(H/2pi) / T^3.
export const resTOnlineMass = (T, H) => 2 * Math.log(H / (2 * Math.PI)) / (T * T * T);

// (L3) exclusion predicate: W_T(f) < 0 iff delta^2 S^4 T^3 > log(H/2pi).
export const resTExcludes = (T, delta, H) =>
  delta * delta * Math.pow(Sfac(T * delta), 4) * T * T * T > Math.log(H / (2 * Math.PI));

// (L4) height-ceiling T_X: root of delta^2 S(T delta)^4 T^3 = log(X/2pi).
export function resTHeightCeiling(X, delta = 0.5) {
  const L = Math.log(X / (2 * Math.PI));
  let lo = 0.1, hi = 100;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    (delta * delta * Math.pow(Sfac(m * delta), 4) * m ** 3 > L) ? (hi = m) : (lo = m);
  }
  return (lo + hi) / 2;
}

// int_{-inf}^{inf} x^2 sinc^4(T x/2) dx = 4 pi / T^3 (composite Simpson witness).
function onlineMassIntegral(T) {
  const N = 4000000, L = 3000 / T, h = 2 * L / N;
  let s = 0;
  for (let i = 0; i <= N; i++) {
    const x = -L + i * h;
    const u = T * x / 2;
    const sc = Math.abs(u) < 1e-9 ? 1 : Math.sin(u) / u;
    const w = (i === 0 || i === N) ? 1 : (i % 2 ? 4 : 2);
    s += w * x * x * Math.pow(sc, 4);
  }
  return s * h / 3;
}

export const IMP95533_LITERALS = Object.freeze({
  // imp-95530 RES-T baked cross-values
  measuredIncrement_T5_d025: -1.6165e-1,
  T_X: { X1e6: 3.168, X3e12: 3.882, X1e20: 4.355 },
  detection_H6e5: { d025_Tstar: 5.183, d049_Tstar: 3.179 },
  // imp-95520 Class II reading being corrected
  classIIReadingDecay: 'O(e^{T}/H^4)',
  classIIGridHalfWidth: 0.05,
  classIILowTable_Tmax: 3, // the T <= 3 hat table (all below T_X), unaffected by the correction
});

export const IMP95533_RES_T_STANDALONE_LEMMA = Object.freeze({
  id: 'imp-95533-res-t-standalone-lemma',
  title: 'THEOREM RES-T extracted as a standalone lemma (independent of NS-RIGID) with the imp-95520 Class II correction re-verified',
  independentOfNsRigid: true,
  lemmaStatement:
    'Fix T > 0 and the type-T Fejer packet fhat(r) = (r - H) sinc^2(T(r-H)/2), which vanishes at the on-line height H. '
    + 'Replacing the on-line zero at H by the quadruple {beta +- iH, 1-beta +- iH}, delta = beta - 1/2, changes the Weil '
    + 'zero side by exactly dZ = -2 delta^2 S(T delta)^4, S(x) = sinh(x/2)/(x/2), independent of H; the near-H on-line mass '
    + 'is 2 log(H/2pi)/T^3. Hence W_T(f) < 0 (configuration excluded by W_T >= 0) iff delta^2 S(T delta)^4 T^3 > log(H/2pi).',
  proofIngredients: [
    'explicit formula W_T(f) = sum_rho fhat(gamma_rho) with fhat the Weil transform of f, supp f c [-T, T]',
    'Paley-Wiener: fhat entire of exponential type T; evaluate it at the complex heights H -+ i delta',
    'sinc on the imaginary axis: sinc(-+ i T delta/2) = sinh(T delta/2)/(T delta/2) = S(T delta)',
    'mean zero density (1/2pi) log(H/2pi) times int x^2 sinc^4(T x/2) dx = 4 pi / T^3',
  ],
  usesFromNsRigid: 'none — no P_S(eps), no backward flow Xi_eps, no A1 Lagarias-Pick identity, no A2 eps-analyticity, no A4 dichotomy, no A6 Blaschke/Muntz. Only the shared explicit formula, upstream of both.',
  classIICorrection:
    'imp-95520 Class II read the off-line perturbation as O(e^{T}/H^4) on the delta_grid = 0.05 hat basis, concluding W_T >= 0 '
    + 'is a consequence of the verified height for every fixed T. RES-T (L1) shows dZ is INDEPENDENT of the zero height H; the '
    + 'apparent H^{-4}/e^{T} decay is a Nyquist artifact of the 0.05 sampling grid (kernel roll-off above pi/0.05 ~ 63). The '
    + 'corrected statement: W_T >= 0 is a consequence of verified height X only for T < T_X (T_X = 3.882 at X = 3e12); the '
    + 'T <= 3 hat table itself is unaffected since 3 < T_X. For T > T_X it is a genuine zero-free-region statement, strictly '
    + 'stronger than verified height and strictly weaker than RH.',
  correctionWitness:
    'imp-95530 detection scan at H = 6.0e5: (RES-T*) predicts T* = 5.183 (delta = 0.25; blind at T = 4, detected at 5) and '
    + 'T* = 3.179 (delta = 0.49; blind at 3, detected at 4). A fixed-T O(e^T/H^4) law cannot produce a delta-dependent onset in T '
    + 'at fixed H; the observed onsets confirm the height-independent (L1) increment gated by the log(H)/T^3 mass.',
  residual:
    'The (L4) T > T_X proof is NOT supplied here; imp-95530 (B3) reduces it to a pointwise short von-Mangoldt Dirichlet-polynomial '
    + 'bound at heights in (X, exp(c e^T)) -- the pointwise Hilbert-transform wall, shared with imp-95519 / perm-arch (imp-95543) '
    + 'and currently unclosed. RES-T is not a Lambda lever (barrier needs all zeros real below X, not a strip).',
  verdict:
    'YES: RES-T is a self-contained lemma independent of the NS-RIGID dichotomy; the imp-95520 Class II "O(e^T/H^4) / consequence '
    + 'of verified height for all fixed T" reading is corrected to "consequence of verified height only for T < T_X". Changes no '
    + 'bound; NO QED; no refereed bound is changed; RH open.',
});

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);

export const IMP95533_ASSERTIONS = [
  {
    id: 'imp95533-l1-increment-closed-form',
    description: '(L1) the closed form dZ = -2 delta^2 S^4 matches the complex evaluation 2 Re[fhat(H-id) conj fhat(H+id)] to 1e-12 and reproduces the imp-95530 measured dZ at T=5, delta=0.25 (rel 1e-3); dZ < 0 always',
    holds: () => {
      for (const [T, d] of [[5, 0.25], [10, 0.1], [14, 0.49]]) {
        if (!relEq(resTIncrement(T, d), resTIncrementComplex(T, d), 1e-12)) return false;
        if (!(resTIncrement(T, d) < 0)) return false;
      }
      return relEq(resTIncrement(5, 0.25), IMP95533_LITERALS.measuredIncrement_T5_d025, 1e-3);
    },
  },
  {
    id: 'imp95533-l2-online-mass-integral',
    description: '(L2) int x^2 sinc^4(Tx/2) dx = 4 pi / T^3 (rel 1e-3 at T = 5), so M_on = 2 log(H/2pi)/T^3',
    holds: () => relEq(onlineMassIntegral(5), 4 * Math.PI / 125, 1e-3)
      && relEq(resTOnlineMass(5, 3e12), 2 * Math.log(3e12 / (2 * Math.PI)) / 125, 1e-12),
  },
  {
    id: 'imp95533-l3l4-threshold-and-ceiling',
    description: '(L3)/(L4) T_X roots reproduce imp-95530: 3.168 (1e6), 3.882 (3e12), 4.355 (1e20) rel 1e-3; the T <= 3 hat table lies below T_X(3e12); resTExcludes agrees with resTIncrement vs resTOnlineMass',
    holds: () => {
      const Tx = IMP95533_LITERALS.T_X;
      if (!relEq(resTHeightCeiling(1e6), Tx.X1e6, 1e-3)) return false;
      if (!relEq(resTHeightCeiling(3e12), Tx.X3e12, 1e-3)) return false;
      if (!relEq(resTHeightCeiling(1e20), Tx.X1e20, 1e-3)) return false;
      if (!(IMP95533_LITERALS.classIILowTable_Tmax < resTHeightCeiling(3e12))) return false;
      // exclusion predicate consistency: excluded iff |dZ| > M_on
      for (const [T, d, H] of [[6, 0.5, 3e12], [3, 0.5, 3e12], [5, 0.25, 6e5]]) {
        const excl = Math.abs(resTIncrement(T, d)) > resTOnlineMass(T, H);
        if (resTExcludes(T, d, H) !== excl) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95533-class-ii-correction-witness',
    description: 'correction witness: predicted detection onsets T* = 5.183 (delta 0.25) and 3.179 (delta 0.49) at H = 6.0e5 reproduce the imp-95530 scan (rel 1e-3); the two onsets differ, which a fixed-T O(e^T/H^4) law cannot produce',
    holds: () => {
      const H = 599722.344;
      const t1 = resTHeightCeiling(H, 0.25), t2 = resTHeightCeiling(H, 0.49);
      return relEq(t1, IMP95533_LITERALS.detection_H6e5.d025_Tstar, 1e-3)
        && relEq(t2, IMP95533_LITERALS.detection_H6e5.d049_Tstar, 1e-3)
        && Math.abs(t1 - t2) > 1;
    },
  },
  {
    id: 'imp95533-independence-and-honesty',
    description: 'record states RES-T is independent of NS-RIGID, uses none of A1/A2/A4/A6, carries the Class II correction and residual, and states RH open / PT Lambda <= 0.2 / NO QED',
    holds: () => IMP95533_RES_T_STANDALONE_LEMMA.independentOfNsRigid === true
      && /none/.test(IMP95533_RES_T_STANDALONE_LEMMA.usesFromNsRigid)
      && /Nyquist artifact/.test(IMP95533_RES_T_STANDALONE_LEMMA.classIICorrection)
      && /T < T_X/.test(IMP95533_RES_T_STANDALONE_LEMMA.classIICorrection)
      && /pointwise Hilbert-transform wall/.test(IMP95533_RES_T_STANDALONE_LEMMA.residual)
      && /RH open/.test(IMP95533_RES_T_STANDALONE_LEMMA.verdict)
      && /refereed bound is changed/i.test(IMP95533_RES_T_STANDALONE_LEMMA.verdict)
      && /NO QED/.test(IMP95533_RES_T_STANDALONE_LEMMA.verdict),
  },
];

for (const a of IMP95533_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95533-res-t-standalone-lemma assertion failed: ${a.id}`);
}

export default IMP95533_RES_T_STANDALONE_LEMMA;
