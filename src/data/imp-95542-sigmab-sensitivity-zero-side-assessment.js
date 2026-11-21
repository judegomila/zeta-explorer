/**
 * imp-95542 - sigma_B sensitivity of the imp-95519 zero-side no-go.
 *
 * The perm-arch imp95519Caveat (perm-arch-sieve-universality-no-go-2026-09-22)
 * flags that imp-95519 pins the coefficient-ladder abscissa at
 *     sigma_B = (1 + y0)/2 = 0.59045
 * as an ASSUMPTION, because sB_of_x is a missing evaluator input (imp-95013).
 * Under the Polymath A/B-effective normalization sB_of_x carries a real shift of
 * about +0.8, giving Re s_B ~ 1.4. This module ASSESSES which imp-95519
 * conclusions actually depend on that abscissa, re-derives the zero-side under
 * Re s_B ~ 1.4, and confirms the prime-side and section 5(i) closures are
 * abscissa-independent. Report only: no bound changes, no refereed bound is changed,
 * RH open, NO QED.
 *
 * WHERE sigma_B ENTERS THE SUMMAND. In the localized barrier sum
 *     A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p),  K_k(n) = a_n n^{-iT} psi_{k,h}(n),
 * the coefficient reading a_n = b_n n^{-sigma_B} contributes sigma_B ONLY through
 * the real amplitude factor n^{-sigma_B}. The bump psi_{k,h} is supported on a
 * window of Fresnel width H_{k,h} = u_{k,h}/sqrt(v) centred at u_{k,h}, with
 * H_{k,h}/u_{k,h} = 1/sqrt(v) ~ 1e-6; across that window n^{-sigma_B} is the
 * constant u_{k,h}^{-sigma_B} up to a relative O(H/u) drift. So sigma_B rescales
 * every packet by a COMMON amplitude and cancels in every RATIO the contract
 * uses - Q_sup, the headroom factor 1.306, the prime-side exponent gap (0 vs 1/2),
 * and the section 5(i) S-bar_p budget are all sigma_B-invariant.
 *
 * ONE PLACE sigma_B IS NOT AN AMPLITUDE. The zero-side identification of the
 * obstruction evaluates the logarithmic derivative of the twisted series AT the
 * abscissa sigma_B: imp-95519 section 4 reads the pointwise requirement as
 * "-(log-derivative of L)(sigma_B + iT, chi) bounded", equivalently a zero-free
 * half-strip sigma > sigma_B at height T for zeta and for L(s, chi mod p <= 97),
 * and diagnoses it as Montgomery-pair-correlation-gated because 59 percent of the
 * majorant mass sits at alpha_{k,h} > 1. The ABSCISSA of that half-strip is the
 * only genuinely sigma_B-dependent conclusion.
 *
 * THE FREQUENCY alpha IS sigma_B-INDEPENDENT. alpha_{k,h} = log u_{k,h}/log T with
 * u_{k,h} = v/(k - h/p), v = x/(4 pi); the stationary point comes from the
 * oscillation n^{-iT}, i.e. from T = Im s only. The imp-95519 evaluator
 * alphaOfXi(xi, N) takes no sigma_B argument - concrete proof that the alpha
 * range and the 59-percent share are abscissa-invariant.
 *
 * RE-DERIVATION UNDER Re s_B ~ 1.4. If the effective abscissa is sigma_B ~ 1.4 > 1
 * it lies to the RIGHT of the critical strip, in the region of absolute
 * convergence of the Euler product. There zeta and every L(s, chi) have NO zeros
 * (classical Re s >= 1 zero-free result), so:
 *   (a) the "zero-free half-strip sigma > 1.4" statement is UNCONDITIONALLY true;
 *   (b) the pointwise Hilbert transform is bounded UNCONDITIONALLY and uniformly
 *       in T by the absolutely convergent sum -(log-derivative of zeta)(1.4)
 *       = sum_n Lambda(n) n^{-1.4} (finite; numerically ~1.97 below);
 *   (c) hence the zero side is NO LONGER pair-correlation-gated: the alpha > 1 /
 *       Montgomery-conjecture obstruction is an ARTIFACT of choosing the
 *       critical-strip abscissa 0.59045 < 1, not an intrinsic wall.
 * The alpha > 1 majorant-share fact is unchanged (frequency is sigma_B-independent)
 * but becomes IRRELEVANT: outside the critical strip pair correlation of zeros is
 * not the operative input. This numerical module witnesses the dichotomy directly:
 * at 1.4 the log-derivative sum is stable across cutoffs (convergent), while at
 * 0.59045 it grows without bound with the cutoff (divergent) - which is exactly
 * why a sub-1 abscissa needs zero-location (analytic continuation through the
 * zeros) and a sigma_B > 1 abscissa does not.
 *
 * NET. imp-95519 zero-side verdict, as written (PCC-gated, half-strip sigma > 0.59045),
 * is CONDITIONAL on sigma_B < 1. Under Re s_B ~ 1.4 the zero side is trivially
 * controlled and that particular obstruction dissolves. This does NOT reopen the
 * sub-0.14 contract, because the two abscissa-invariant closures still bind:
 *   (I) the prime side (Fresnel width below the RH short-interval barrier,
 *       exponent 0 achievable vs 1/2 needed, GRH-inert, height/width-bound) is a
 *       statement about RELATIVE cancellation in the localized packet and is
 *       unchanged by a common amplitude n^{-sigma_B}; and
 *   (II) the section 5(i) small-prime closure - the welds {2,3,5} alone give
 *       sqrt(S-bar_2 + S-bar_3 + S-bar_5) ~ 1.114 >> R_ex at Q = 1, over budget by
 *       roughly 7-10x - is pure S-bar_p budget geometry, abscissa-free.
 * So the last-lever no-go STANDS under both abscissa readings; only the zero-side
 * FRAMING must be stated abscissa-conditionally, and sB_of_x (imp-95013) must be
 * pinned before any sharp zero-side alpha/PCC claim is made. No bound; NO QED;
 * no refereed bound is changed; RH open.
 *
 * Import-light: no zeros bundle, no sibling imports. All literals re-derived.
 */

const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595
const Y0 = 0.1809;
const N_LO = 690988;
const SIGMA_B_CRIT = (1 + Y0) / 2; // 0.59045 (imp-95519 assumption)
const SIGMA_B_EFF = 1.4; // Polymath A/B-effective reading (perm-arch caveat)

const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI;
// alpha_{k,h} = log u_{k,h}/log T; NOTE: no sigma_B argument (abscissa-invariant)
const alphaOfXi = (xi, N) => Math.log(stationaryV(N) / xi) / Math.log(heightT(N));
const ALPHA_FLOOR = alphaOfXi(1 / 97, N_LO); // 1.0953, identical for both sigma_B

// packet-window relative amplitude drift H/u = 1/sqrt(v): sigma_B is a common
// amplitude, not a phase (proof that ratios are abscissa-invariant)
const AMP_DRIFT = 1 / Math.sqrt(stationaryV(N_LO)); // ~ 1e-6

// logarithmic derivative sum sum_n Lambda(n) n^{-sigma}: convergent for sigma > 1,
// divergent for sigma < 1 (the concrete Euler-region vs critical-strip witness)
function vonMangoldt(n) {
  for (let p = 2; p * p <= n; p++) {
    if (n % p !== 0) continue;
    let m = n;
    while (m % p === 0) m /= p;
    return m === 1 ? Math.log(p) : 0;
  }
  return n >= 2 ? Math.log(n) : 0;
}
function logDerivPartial(sigma, nMax) {
  let s = 0;
  for (let n = 2; n <= nMax; n++) {
    const L = vonMangoldt(n);
    if (L !== 0) s += L * Math.pow(n, -sigma);
  }
  return s;
}
const ZLD_EFF_1E4 = logDerivPartial(SIGMA_B_EFF, 1e4); // ~1.9276
const ZLD_EFF_1E5 = logDerivPartial(SIGMA_B_EFF, 1e5); // ~1.9654 (stable => convergent)
const ZLD_CRIT_1E4 = logDerivPartial(SIGMA_B_CRIT, 1e4); // ~103.1
const ZLD_CRIT_1E5 = logDerivPartial(SIGMA_B_CRIT, 1e5); // ~269.5 (grows => divergent)
const EFF_CONVERGENCE = Math.abs(ZLD_EFF_1E5 - ZLD_EFF_1E4) / ZLD_EFF_1E4; // < 0.05
const CRIT_GROWTH = ZLD_CRIT_1E5 / ZLD_CRIT_1E4; // > 2

export const IMP95542_SIGMAB_SENSITIVITY = Object.freeze({
  ticket: 'imp-95542',
  date: '2026-09-22',
  source:
    'imp-95519 (localized-barrier-sum prime/zero no-go); perm-arch-sieve-universality-no-go-2026-09-22 imp95519Caveat; imp-95013 sB_of_x missing evaluator input',
  question:
    'Does the imp-95519 zero-side alpha/PCC framing survive if the coefficient-ladder abscissa is Re s_B ~ 1.4 (Polymath A/B-effective) rather than the assumed sigma_B = 0.59045',

  sigmaBDependentZeroSide: [
    'The abscissa of the required zero-free half-strip: imp-95519 states sigma > 0.59045 at height T for zeta and L(s, chi mod p <= 97).',
    'The identification of the pointwise obstruction as boundedness of the logarithmic derivative of L evaluated AT sigma_B + iT (the pointwise Hilbert transform of the zero-counting measure at abscissa sigma_B).',
    'The characterization "pair-correlation-gated": that the 59-percent alpha > 1 majorant mass forces Montgomery pair correlation - this only bites if sigma_B lies inside the critical strip (sigma_B < 1).',
  ],
  sigmaBIndependent: [
    'The alpha_{k,h} = log u_{k,h}/log T frequency and the 59-percent alpha > 1 majorant share: alpha comes from the n^{-iT} phase (T = Im s), not from Re s; the imp-95519 alphaOfXi(xi, N) takes no sigma_B argument.',
    'The prime side (Fresnel width below the RH short-interval barrier, exponent 0 achievable vs 1/2 needed, GRH-inert, height/width-bound): sigma_B enters the localized packet only as the common amplitude n^{-sigma_B} ~ u^{-sigma_B}, which cancels in the relative-cancellation ratio.',
    'The section 5(i) small-prime closure: sqrt(S-bar_2 + S-bar_3 + S-bar_5) ~ 1.114 >> R_ex = 0.2797 at Q = 1 (over budget ~7-10x) is S-bar_p budget geometry, abscissa-free.',
    'The contract ratios Q_sup, Q_anchor and the headroom factor 1.306: ratios of packet amplitudes, so the common u^{-sigma_B} cancels.',
  ],

  rederivationUnderEffAbscissa: {
    sigmaBEff: SIGMA_B_EFF,
    inCriticalStrip: false,
    halfStripStatement:
      'sigma > 1.4 is UNCONDITIONALLY zero-free (classical Re s >= 1 zero-free region for zeta and all L(s, chi)); the imp-95519 half-strip requirement becomes trivially true.',
    pointwiseHilbertTransform:
      'For sigma_B > 1 the log-derivative -(sum_n Lambda(n) chi(n) n^{-sigma_B - iT}) is absolutely convergent and bounded uniformly in T by sum_n Lambda(n) n^{-sigma_B} = -(log-derivative of zeta)(sigma_B); at 1.4 this equals about 1.97 (numerically confirmed below).',
    pccGating:
      'DISSOLVES: outside the critical strip pair correlation of zeros is not the operative input, so the alpha > 1 out-of-Montgomery-range obstruction is an artifact of the sub-1 abscissa 0.59045, not an intrinsic wall. The alpha values themselves are unchanged but become irrelevant.',
    numericalWitness: {
      logDerivAt1p4Cutoff1e4: ZLD_EFF_1E4,
      logDerivAt1p4Cutoff1e5: ZLD_EFF_1E5,
      convergenceRelDrift: EFF_CONVERGENCE,
      logDerivAt0p59Cutoff1e4: ZLD_CRIT_1E4,
      logDerivAt0p59Cutoff1e5: ZLD_CRIT_1E5,
      divergenceGrowthRatio: CRIT_GROWTH,
      reading:
        'At 1.4 the sum is stable across cutoffs (convergent, Euler region) so no zero-location is needed; at 0.59045 it grows without bound with the cutoff (divergent, critical strip) so zero-location IS needed - the exact reason imp-95519 hit a zero-side wall at its assumed abscissa.',
    },
  },

  netVerdict:
    'The imp-95519 zero-side verdict as written (pair-correlation-gated, half-strip sigma > 0.59045) is CONDITIONAL on sigma_B < 1. Under Re s_B ~ 1.4 the zero side is unconditionally controlled and that obstruction dissolves; but this does NOT reopen the sub-0.14 contract, because the abscissa-invariant prime-side no-go and the section 5(i) small-prime closure each still bind. The last-lever no-go STANDS under both abscissa readings; only the zero-side FRAMING must be stated abscissa-conditionally, and sB_of_x (imp-95013) must be pinned before any sharp zero-side alpha/PCC claim. No bound changes; NO QED; no refereed bound is changed; RH open.',

  promotesBound: false,
  isRigorous: true,
  rigorScope:
    'The amplitude-cancellation argument and the Euler-region boundedness are elementary and exact; the numerical witness is a finite partial-sum computation. This is an accuracy assessment of imp-95519 framing, not a new theorem that no bound exists.',
});

export const IMP95542_SIGMAB_SENSITIVITY_ASSERTIONS = Object.freeze([
  {
    id: 'imp95542-alpha-abscissa-invariant',
    description: 'alpha_{k,h} at the floor alias is set by T only (about 1.0953), unchanged by sigma_B',
    holds: () => Math.abs(ALPHA_FLOOR - 1.0953) < 5e-4 && alphaOfXi.length === 2,
  },
  {
    id: 'imp95542-amplitude-drift-tiny',
    description: 'sigma_B is a common packet amplitude: relative drift H/u = 1/sqrt(v) is about 1e-6',
    holds: () => AMP_DRIFT > 0 && AMP_DRIFT < 1e-5,
  },
  {
    id: 'imp95542-eff-abscissa-convergent',
    description: 'at sigma_B = 1.4 the log-derivative sum is stable across cutoffs (Euler region, bounded ~1.97)',
    holds: () => EFF_CONVERGENCE < 0.05 && ZLD_EFF_1E5 > 1.5 && ZLD_EFF_1E5 < 2.5,
  },
  {
    id: 'imp95542-crit-abscissa-divergent',
    description: 'at sigma_B = 0.59045 the log-derivative sum grows with the cutoff (critical strip, needs zero-location)',
    holds: () => CRIT_GROWTH > 2 && ZLD_CRIT_1E5 > ZLD_CRIT_1E4,
  },
  {
    id: 'imp95542-eff-gt-one',
    description: 'the effective abscissa 1.4 lies to the right of the critical strip (Re s > 1, unconditionally zero-free)',
    holds: () => SIGMA_B_EFF > 1 && SIGMA_B_CRIT < 1,
  },
  {
    id: 'imp95542-honesty-gate-no-qed',
    description: 'assessment only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95542_SIGMAB_SENSITIVITY.promotesBound === false &&
      /NO QED/.test(IMP95542_SIGMAB_SENSITIVITY.netVerdict) &&
      /refereed bound is changed/i.test(IMP95542_SIGMAB_SENSITIVITY.netVerdict),
  },
]);

for (const a of IMP95542_SIGMAB_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95542-sigmab-sensitivity-zero-side-assessment assertion failed: ${a.id}`);
  }
}

export default IMP95542_SIGMAB_SENSITIVITY;
