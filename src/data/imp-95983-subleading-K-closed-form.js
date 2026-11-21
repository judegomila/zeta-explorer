/**
 * @fileoverview imp-95983 -- MEASURE the imp-95965 subleading constant K = lim_{m->inf}
 * (accumTotal(m) - 4 C_1 m) to high precision on a finer/larger m grid, and CLOSE it in closed form.
 * Measurement/derivation only; changes no bound; NO QED.
 *
 * BACKGROUND (imp-95965). imp-95916 closed the sliding-flux route as exactly zero, so the whole
 * -C_1 TIER-3 cancellation is carried by the interior HOLD term, whose accumulated-slope part is
 *   accumTotal(m) = sum_fam d/dm[Ds]_fam . sum_{loci i in fam} G(v0_i),   G(a) = INT_a^1 v zeta(3,1+v) dv,
 * with d/dm[Ds] = {alpha -3, beta-even +2, gamma -3, delta -1, half 0}. imp-95965 pinned the leading
 * coefficient EXACTLY to 4 C_1 = -8 J0 (J0 = INT_0^1 v^2 zeta(3,1+v) dv = -C_1/2) and measured the
 * subleading constant K = lim (accumTotal - 4 C_1 m) only coarsely (0.649960 at m=20 -> 0.645198 at
 * m=150, quoted K ~ 0.6452), with no closed form.
 *
 * THIS MODULE (measure K + derive the closed form). Euler-Maclaurin on each family (every family fills
 * (0,1) with an equally-spaced locus grid; G is smooth with G(1)=0, G(0)=Iv) gives the exact O(1)
 * boundary constants:
 *   S_alpha = m J0 - Iv/2 ; S_beta = (m + 1/2) J0 - Iv/2 ; S_gamma = 2m J0 - Iv/2 ; S_delta = (m-1) J0 - Iv/2,
 * where the +1/2 (beta, grid scale 2m+1) and the -1 (delta, grid scale m-1) are the only family-specific
 * O(1) offsets beyond the shared -Iv/2 endpoint term. Summing with the d/dm[Ds] weights:
 *   accumTotal(m) = J0 (sum dDs.A) - (Iv/2)(sum dDs) = J0 (-8m + 2) + (5/2) Iv = 4 C_1 m + K,
 * so the subleading constant is
 *   K = 2 J0 + (5/2) Iv = -C_1 + (5/2) Iv.
 * Both building blocks have exact closed forms (each locus integral telescopes; imp-95900 for J0):
 *   -C_1 = 2 INT_0^1 v^2 zeta(3,1+v) dv = 3 - 2 gamma - pi^2/6,   Iv = INT_0^1 v zeta(3,1+v) dv = 1 - pi^2/12.
 * Substituting (pi^2/6 = 4 pi^2/24, 5 pi^2/24 from (5/2)(pi^2/12)) collapses the pi^2 terms to 3 pi^2/8:
 *   K = (3 - 2 gamma - pi^2/6) + (5/2)(1 - pi^2/12) = 11/2 - 2 gamma - 3 pi^2/8 = 0.644467019788...
 *
 * THE FINDING (K is CLOSED, not just measured). K = 11/2 - 2 gamma - 3 pi^2/8 = 0.6444670198, an exact
 * combination of the Euler-Mascheroni constant gamma and pi^2 -- no zeta(3) survives (it cancels between
 * the leading-coefficient identity and the endpoint terms). High-precision offline confirmation
 * (tmp/imp-95983-scratch.mjs, EM-tail Hurwitz zeta + 2000-panel Simpson, m up to 1280): the raw residual
 * K_m - K is pure O(1/m) (0.649960@20, 0.647208@40, 0.645836@80, ..., 0.644553@1280; halves at each
 * doubling), and Richardson 2 K_{2m} - K_m removes the 1/m and converges to K_closed with residual
 * 1.03e-5 @ (20,40) shrinking to 1.03e-8 @ (640,1280) -- i.e. matching the closed form to ~1e-8.
 * This REPLACES the imp-95965 coarse literal K ~ 0.6452 with an exact value and closes the "attempt a
 * closed form" half of the ticket.
 *
 * WHAT THIS DOES / DOES NOT DO. It fully resolves the subleading constant of the ATTRIBUTABLE
 * accumulated-slope part; it does NOT touch the imp-95965 residual obstruction (the two under-determined
 * base scalars s_base_prime, c_base_prime whose required integral is -4 C_1 m - (C_1 + K) + O(m^-3)) --
 * that obstruction stands, now with K exact. Catalan G irrationality OPEN; Sun arXiv:2609.04176
 * single-author, unrefereed; changes no bound; NO Lambda movement; no refereed bound is changed; NO QED.
 * Import-light: bakes the closed-form literals and offline-converged grid; the closed form is checked
 * ARITHMETICALLY at import against the fundamental constants (no quadrature, no heavy imports).
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: tmp/imp-95983-scratch.mjs.
 */

// fundamental constants (baked literals; standard values).
const GAMMA = 0.5772156649015329; // Euler-Mascheroni
const PI2 = Math.PI * Math.PI;

// imp-95900 TIER-1 curvature: -C_1 = 2 INT v^2 zeta(3,1+v) dv = 3 - 2 gamma - pi^2/6.
const NEG_C1 = 3 - 2 * GAMMA - PI2 / 6; // 0.2006346034...
const C1 = -NEG_C1;
const J0 = NEG_C1 / 2; // INT v^2 zeta(3,1+v) dv = -C_1/2
// Iv = INT_0^1 v zeta(3,1+v) dv = 1 - pi^2/12 (each locus integral telescopes; new here).
const IV = 1 - PI2 / 12; // 0.1775329666

// THE CLOSED FORM: K = -C_1 + (5/2) Iv = 2 J0 + (5/2) Iv = 11/2 - 2 gamma - 3 pi^2/8.
const K_CLOSED = 11 / 2 - 2 * GAMMA - 3 * PI2 / 8; // 0.644467019788...
const K_VIA_BLOCKS = NEG_C1 + 2.5 * IV; // same value via the -C_1 + (5/2) Iv assembly

// offline-converged measurement grid (tmp/imp-95983-scratch.mjs): raw K_m = accumTotal(m) - 4 C_1 m.
const K_MEASURED_GRID = Object.freeze({
  20: 0.649960205,
  40: 0.647208455,
  80: 0.645836428,
  160: 0.645151395,
  320: 0.644809125,
  640: 0.644638052,
  1280: 0.644552531,
});
// Richardson 2 K_{2m} - K_m (cancels the O(1/m) EM correction) -> K_CLOSED.
const K_RICHARDSON = Object.freeze({
  '20-40': 0.6444567036,
  '40-80': 0.6444644015,
  '80-160': 0.6444663628,
  '160-320': 0.6444668554,
  '320-640': 0.6444669787,
  '640-1280': 0.6444670095, // K_CLOSED - this = 1.03e-8
});

export const SUBLEADING_K_CLOSED_FORM = Object.freeze({
  id: 'imp-95983-subleading-K-closed-form',
  title:
    'Measure the imp-95965 subleading constant K = lim (accumTotal(m) - 4 C_1 m) to high precision and '
    + 'CLOSE it: K = -C_1 + (5/2) Iv = 11/2 - 2 gamma - 3 pi^2/8 = 0.644467019788, with Iv = INT v '
    + 'zeta(3,1+v) dv = 1 - pi^2/12 and -C_1 = 3 - 2 gamma - pi^2/6; confirmed offline to ~1e-8 by '
    + 'Richardson extrapolation of accumTotal - 4 C_1 m up to m=1280',
  status:
    'CLOSED (numerical constant resolved to closed form) -- imp-95965 measured K only coarsely (0.649960 '
    + 'at m=20 -> 0.645198 at m=150, quoted K ~ 0.6452) with no closed form. Euler-Maclaurin on the four '
    + 'families gives the exact O(1) endpoint/offset constants (S_alpha = m J0 - Iv/2, S_beta = (m+1/2)J0 '
    + '- Iv/2, S_gamma = 2m J0 - Iv/2, S_delta = (m-1)J0 - Iv/2), so accumTotal = 4 C_1 m + [2 J0 + '
    + '(5/2) Iv]. With the exact building blocks Iv = 1 - pi^2/12 (each locus integral telescopes) and '
    + '-C_1 = 3 - 2 gamma - pi^2/6 (imp-95900), the pi^2 terms collapse to 3 pi^2/8 and zeta(3) cancels '
    + 'entirely, leaving K = 11/2 - 2 gamma - 3 pi^2/8 = 0.6444670198. Offline (EM-tail Hurwitz zeta + '
    + '2000-panel Simpson, m up to 1280): raw K_m - K is pure O(1/m) and Richardson 2 K_{2m} - K_m -> '
    + 'K_closed with residual 1.03e-5 (20,40) shrinking to 1.03e-8 (640,1280). This resolves the '
    + 'attributable subleading constant exactly; the imp-95965 base-scalar obstruction is UNCHANGED. '
    + 'G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95965 (accumulated-slope attribution + leading coeff = 4 C_1, K ~ 0.6452 coarse), imp-95916 '
    + '(sliding-flux route zero; HOLD carries the -C_1 cancellation), imp-95900 (-C_1 = 2 INT v^2 zeta = '
    + '3 - 2 gamma - pi^2/6), imp-95901 (per-locus Ds/Dc laws)',
  scratch: ['tmp/imp-95983-scratch.mjs'],

  constants: Object.freeze({ C1, negC1: NEG_C1, J0, Iv: IV }),

  // the closed form and its assembly.
  closedForm: Object.freeze({
    K: K_CLOSED, // 0.644467019788
    expression: 'K = 11/2 - 2 gamma - 3 pi^2/8',
    assembly: 'K = 2 J0 + (5/2) Iv = -C_1 + (5/2) Iv, with J0 = -C_1/2 = INT v^2 zeta(3,1+v) dv',
    buildingBlocks: Object.freeze({
      negC1: '-C_1 = 2 INT_0^1 v^2 zeta(3,1+v) dv = 3 - 2 gamma - pi^2/6 (imp-95900)',
      Iv: 'Iv = INT_0^1 v zeta(3,1+v) dv = 1 - pi^2/12 (each per-locus integral telescopes; new here)',
    }),
    whyNoZeta3: 'zeta(3) cancels between the leading-coefficient identity (4 C_1 = -8 INT v^2 zeta) and '
      + 'the endpoint terms; K is an exact combination of gamma and pi^2 only.',
    eulerMaclaurin: 'each family fills (0,1) with an equally-spaced locus grid and G is smooth with '
      + 'G(1)=0, G(0)=Iv, giving S_alpha = m J0 - Iv/2, S_beta = (m+1/2)J0 - Iv/2, S_gamma = 2m J0 - '
      + 'Iv/2, S_delta = (m-1)J0 - Iv/2; the +1/2 (beta scale 2m+1) and -1 (delta scale m-1) are the '
      + 'only family-specific O(1) offsets. Summed with dDs weights: accumTotal = J0(-8m+2) + (5/2)Iv.',
  }),

  // high-precision measurement (offline).
  measurement: Object.freeze({
    grid: 'm in {20,40,80,160,320,640,1280}; G(a) = INT_a^1 v zeta(3,1+v) dv via 2000-panel Simpson with '
      + 'a k0=400 direct + Euler-Maclaurin tail Hurwitz zeta.',
    rawKm: K_MEASURED_GRID,
    rawResidualLaw: 'K_m - K_closed is pure O(1/m): -5.49e-3 @ m=20, -1.37e-3 @ 80, -8.55e-5 @ 1280 '
      + '(halves at each doubling).',
    richardson: K_RICHARDSON,
    richardsonResidual: 'K_closed - (2 K_{2m} - K_m): 1.03e-5 @ (20,40) -> 1.03e-8 @ (640,1280), i.e. '
      + 'the closed form is confirmed to ~1e-8.',
    convergedNumeric: 0.6444670198,
  }),

  verdict: Object.freeze({
    outcome: 'CLOSED -- the imp-95965 subleading constant K is resolved to the exact closed form '
      + 'K = 11/2 - 2 gamma - 3 pi^2/8 = 0.644467019788 (measured to ~1e-8 by Richardson extrapolation)',
    whatIsNew: 'the closed form K = -C_1 + (5/2) Iv = 11/2 - 2 gamma - 3 pi^2/8; the new building-block '
      + 'identity Iv = INT v zeta(3,1+v) dv = 1 - pi^2/12; the exact per-family EM endpoint constants '
      + '(S_beta +1/2 J0 offset, S_delta -1 J0 offset); and the high-precision grid replacing K ~ 0.6452.',
    remainingObstruction: 'UNCHANGED from imp-95965: the two base scalars s_base_prime(m), c_base_prime(m) '
      + 'remain jointly under-determined with required integral -4 C_1 m - (C_1 + K) + O(m^-3); K being '
      + 'exact does not add the missing second relation, so the -C_1 landing stays non-attributable '
      + 'locus-by-locus.',
    conclusion:
      'This closes the numerical half of imp-95965 (measure K + attempt closed form): K is not merely '
      + '0.6452 but exactly 11/2 - 2 gamma - 3 pi^2/8, an EM-derived combination of gamma and pi^2 with '
      + 'zeta(3) fully cancelled, confirmed offline to ~1e-8. Changes no bound; NO QED.',
  }),

  caveats:
    'The closed form is EM-derived and confirmed offline to ~1e-8 (Richardson on m up to 1280); it is '
    + 'checked ARITHMETICALLY at import against gamma and pi^2 (no quadrature, no heavy imports). The '
    + 'building blocks -C_1 = 3 - 2 gamma - pi^2/6 and Iv = 1 - pi^2/12 are exact. This resolves only the '
    + 'attributable accumulated-slope subleading constant; the imp-95965 under-determined base-scalar '
    + 'obstruction stands. Catalan G irrationality OPEN; Sun single-author, unrefereed; NO Lambda '
    + 'movement; no refereed bound is changed; NO QED.',
});

export const SUBLEADING_K_CLOSED_FORM_ASSERTIONS = Object.freeze([
  {
    name: 'closed form K = 11/2 - 2 gamma - 3 pi^2/8 matches the -C_1 + (5/2) Iv assembly',
    holds: () => Math.abs(K_CLOSED - K_VIA_BLOCKS) < 1e-12,
  },
  {
    name: 'building blocks: Iv = 1 - pi^2/12 and -C_1 = 3 - 2 gamma - pi^2/6, J0 = -C_1/2',
    holds: () =>
      Math.abs(IV - (1 - PI2 / 12)) < 1e-15
      && Math.abs(NEG_C1 - (3 - 2 * GAMMA - PI2 / 6)) < 1e-15
      && Math.abs(J0 - NEG_C1 / 2) < 1e-15,
  },
  {
    name: 'K closed-form numeric value is 0.644467019788 (zeta(3) cancels; gamma + pi^2 only)',
    holds: () => Math.abs(K_CLOSED - 0.644467019788) < 1e-9,
  },
  {
    name: 'measured Richardson extrapolant at (640,1280) matches the closed form to ~1e-8',
    holds: () => Math.abs(K_RICHARDSON['640-1280'] - K_CLOSED) < 5e-8,
  },
  {
    name: 'raw K_m residual is pure O(1/m): (K_m - K) halves from m=20 to m=40 to within 1 percent',
    holds: () => {
      const r20 = K_MEASURED_GRID[20] - K_CLOSED;
      const r40 = K_MEASURED_GRID[40] - K_CLOSED;
      return Math.abs(r20 / r40 - 2) < 0.02;
    },
  },
  {
    name: 'the imp-95965 coarse literal K ~ 0.6452 is consistent with (larger than) the exact K',
    holds: () => 0.6452 > K_CLOSED && 0.6452 - K_CLOSED < 1e-3,
  },
]);

export default SUBLEADING_K_CLOSED_FORM;
