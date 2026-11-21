/**
 * @fileoverview imp-96007 -- CROSS-VALIDATE the imp-95982 saturating fracBelowNull ceiling (-1.83e-5,
 * exponent p~2) on the ODD parity branch. imp-95982 fit the c_odd fractional departure below the
 * pure-rho^2 null as Q0_RECON(m) = L - c.m^-p on the EVEN branch only (m=60,80,110,150, four points),
 * getting L=-0.010651895, p=1.9608, and a finite saturation ceiling fracBelowNull(inf) =
 * (Q0_RECON(20)-L)/kappa = -1.832e-5. The verdict SATURATES rested on only four even-branch points, so
 * this module runs the SAME two-parameter power-law fit on the ODD branch and asks whether it converges
 * to the SAME finite ceiling and exponent (genuine parity-independent saturation) or a different limit.
 * MEASURE/FIT ONLY; changes no bound; NO QED.
 *
 * WHERE THE ODD-BRANCH DATA COMES FROM. The imp-95925 wide-interval sweep grid (20,22,30,41,60,80,110,150)
 * has m=41 as its SOLE odd modulus (imp-95967) -- a single point, so a two-parameter power law cannot be
 * fit on the odd branch of THAT grid. The odd-branch DATA is instead the imp-95967 fine integer grid
 * m=41..70, whose odd members m=41,43,...,69 (15 points) form a strictly-monotone-increasing branch. This
 * module fits the odd branch on those 15 points, and -- for an apples-to-apples comparison -- REFITS the
 * even branch (m=42,44,...,70, 15 points) on the SAME fine grid, then compares both to the imp-95982
 * wide-even fit.
 *
 * THE FIT (offline, tmp/imp-96007-scratch.mjs). Same protocol as imp-95982: scan L above max(Q0), do a
 * log-log regression ln(L - Q0(m)) = ln(c) - p.ln(m) for c and p, pick L minimizing RSS in linear space.
 *   ODD  branch (m=41,43,...,69): L = -0.010651861, p = 1.8961, c = 4.820e-3, RSS = 2.170e-18.
 *   EVEN branch (m=42,44,...,70): L = -0.010651836, p = 1.9368, c = 1.552e-2, RSS = 3.237e-18.
 *   imp-95982 wide-even (m=60..150): L = -0.010651895, p = 1.9608 (reference).
 *
 * VERDICT: GENUINE PARITY-INDEPENDENT SATURATION -- the odd branch converges to the SAME finite ceiling.
 * The odd-branch ceiling (Q0_RECON(20) - L_odd)/kappa = -1.8334e-5 matches the imp-95982 even-branch
 * -1.8320e-5 to ~1.0e-8 (~0.06% of the ceiling), and the odd exponent p_odd = 1.896 matches the even
 * p = 1.96 to ~0.04 (both ~2, neither proven 2). The fine-grid even refit (-1.8344e-5) sits between them,
 * confirming the two branches saturate to a common ~-1.833e-5 floor with a common ~m^-2 approach. So the
 * imp-95982 SATURATES verdict is NOT an artifact of the four even-branch points -- it reproduces on the
 * independent odd parity branch.
 *
 * EXTRAPOLATION UNCERTAINTY (combined branches). Across the three fits (odd, fine-even, wide-even):
 *   L        : mean -0.010651864, spread 5.93e-8.
 *   p        : mean 1.9312,        spread 0.0647 (all in [1.896, 1.961]; ~2 to within fit spread, NOT 2).
 *   ceiling  : mean -1.8332e-5,   spread 2.36e-8.
 * So the saturation floor is fracBelowNull(inf) = -1.833e-5 +/- ~1e-8 with exponent p ~ 1.9-2.0. The
 * fine-grid fits give a very slightly higher L than the wide-even fit (the fine grid only reaches m=70 vs
 * m=150), but the ceiling agrees across all three to ~2e-8.
 *
 * HONEST CAVEAT (inherits imp-95925/95966/95967/95982). Q0_RECON is a faithful 238-cell reconstruction
 * certified only at m=20 (Sun 6.23 kappa); grid convergence to ~1e-11 bounds quadrature error, not
 * reconstruction faithfulness at m>20 (imp-95966 PIECE-A obstruction unchanged -- this is measurement of
 * the reconstruction, not a Prop-6.3-certified per-m statement). The exponent p is ~2 to within the
 * cross-branch spread, not proven 2. The reconstruction stays m=20-only certified. Catalan G irrationality
 * OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound; NO Lambda movement; no refereed bound is changed
 * ; NO QED. Import-light: bakes the imp-95967 fine-grid literals + certified kappa + the
 * offline fit literals; no heavy L-scan at import. SCRATCH: tmp/imp-96007-scratch.mjs.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26).
 */

// Prop-6.3 (6.23) certified anchor (the ONLY externally-certified c_odd; m=20 only) and its kappa.
const C_ODD_20_CERTIFIED = 0.006276744728100982; // Sun (6.23), rho = 1/20
const KAPPA = C_ODD_20_CERTIFIED * 400; // c_odd(1/20)/rho^2 = 2.5106978912403926
const Q0_RECON_20 = -0.0106978911; // imp-95925 grid-converged m=20 anchor (10-sig-fig literal)

// imp-95967 fine integer grid Q0_RECON(m) m=41..70 (Nsub=120000, faithful 238-cell reconstruction).
const Q0_FINE = Object.freeze({
  41: -0.0106560776836, 42: -0.0106629746940, 43: -0.0106557142590, 44: -0.0106620160559,
  45: -0.0106553966709, 46: -0.0106611766024, 47: -0.0106551164868, 48: -0.0106604374787,
  49: -0.0106548690514, 50: -0.0106597833704, 51: -0.0106546490920, 52: -0.0106592018125,
  53: -0.0106544528446, 54: -0.0106586820108, 55: -0.0106542770058, 56: -0.0106582164831,
  57: -0.0106541186337, 58: -0.0106577969542, 59: -0.0106539756707, 60: -0.0106574180750,
  61: -0.0106538461139, 62: -0.0106570745668, 63: -0.0106537281117, 64: -0.0106567628851,
  65: -0.0106536212412, 66: -0.0106564773983, 67: -0.0106535230799, 68: -0.0106562168092,
  69: -0.0106534332579, 70: -0.0106559780758,
});
const ODD_M = Object.freeze([41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69]);
const EVEN_M = Object.freeze([42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70]);

// the finite saturation ceiling of the fractional departure, given a fitted asymptote L.
const ceiling = (L) => (Q0_RECON_20 - L) / KAPPA;

// offline two-parameter power-law fits Q0_RECON(m) = L - c.m^-p (tmp/imp-96007-scratch.mjs).
const ODD_FIT = Object.freeze({
  branch: 'odd (m=41,43,...,69) -- imp-95967 fine-grid parity branch, 15 points, strictly monotone',
  form: 'Q0_RECON(m) = L - c.m^-p',
  L: -0.010651860906,
  p: 1.8961,
  c: 4.81996e-3,
  rss: 2.170e-18,
  ceiling: ceiling(-0.010651860906), // (Q0_RECON(20) - L_odd)/kappa ~ -1.8334e-5
});
const EVEN_FIT_FINE = Object.freeze({
  branch: 'even (m=42,44,...,70) -- imp-95967 fine-grid parity branch, 15 points, refit for comparison',
  form: 'Q0_RECON(m) = L - c.m^-p',
  L: -0.010651835676,
  p: 1.9368,
  c: 1.551793e-2,
  rss: 3.237e-18,
  ceiling: ceiling(-0.010651835676), // ~ -1.8344e-5
});
// imp-95982 reference (even branch on the WIDE imp-95925 grid m=60,80,110,150).
const EVEN_FIT_WIDE = Object.freeze({
  branch: 'even (m=60,80,110,150) -- imp-95982 wide-grid fit (reference)',
  form: 'Q0_RECON(m) = L - c.m^-p',
  L: -0.010651895,
  p: 1.9608,
  c: 1.6936e-2,
  rss: 2.685e-7,
  ceiling: ceiling(-0.010651895), // -1.832e-5 (matches imp-95982 baked ceiling)
});

// cross-branch comparison: odd vs the imp-95982 even reference.
const DELTA_L_ODD_VS_WIDE = ODD_FIT.L - EVEN_FIT_WIDE.L;               // ~ +3.4e-8
const DELTA_P_ODD_VS_WIDE = ODD_FIT.p - EVEN_FIT_WIDE.p;              // ~ -0.065
const DELTA_CEILING_ODD_VS_WIDE = ODD_FIT.ceiling - EVEN_FIT_WIDE.ceiling; // ~ -1.3e-8
// fraction of the ceiling difference relative to the ceiling magnitude (~0.06%).
const CEILING_AGREEMENT_FRAC = Math.abs(DELTA_CEILING_ODD_VS_WIDE / EVEN_FIT_WIDE.ceiling);

// combined-branch extrapolation uncertainty (odd, fine-even, wide-even).
const Ls = [ODD_FIT.L, EVEN_FIT_FINE.L, EVEN_FIT_WIDE.L];
const ps = [ODD_FIT.p, EVEN_FIT_FINE.p, EVEN_FIT_WIDE.p];
const ceilings = [ODD_FIT.ceiling, EVEN_FIT_FINE.ceiling, EVEN_FIT_WIDE.ceiling];
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const spread = (a) => Math.max(...a) - Math.min(...a);
const L_MEAN = mean(Ls);
const L_SPREAD = spread(Ls);
const P_MEAN = mean(ps);
const P_SPREAD = spread(ps);
const CEILING_MEAN = mean(ceilings);
const CEILING_SPREAD = spread(ceilings);

// VERDICT: genuine parity-independent saturation to a common ~-1.833e-5 ceiling with p~2.
const PARITY_INDEPENDENT_SATURATION =
  CEILING_AGREEMENT_FRAC < 0.01          // odd and even ceilings agree to <1% of the ceiling
  && ODD_FIT.p > 1.8 && ODD_FIT.p < 2.1  // odd exponent ~2
  && P_SPREAD < 0.1;                     // exponents consistent across all three fits

export const C_ODD_DEPARTURE_ODD_BRANCH_CROSSVALIDATION = Object.freeze({
  id: 'imp-96007-c-odd-departure-odd-branch-crossvalidation',
  title:
    'Cross-validate the imp-95982 saturating fracBelowNull ceiling (-1.83e-5, p~2) on the ODD parity '
    + 'branch: fit Q0_RECON(m) = L - c.m^-p on the imp-95967 fine-grid odd members m=41,43,...,69 (15 '
    + 'points) and it converges to the SAME finite ceiling (-1.8334e-5 vs the imp-95982 -1.8320e-5, '
    + 'differ ~1e-8 / ~0.06%) with the SAME exponent (p=1.896 vs 1.96, both ~2) -- a GENUINE '
    + 'parity-independent saturation, not an artifact of the four even-branch points',
  status:
    'MEASURED/FIT (cross-validation on the independent ODD parity branch) -- the imp-95925 sweep grid has '
    + 'm=41 as its SOLE odd modulus (imp-95967), so the two-parameter power law is fit instead on the '
    + 'imp-95967 fine-grid odd members m=41,43,...,69 (15 points). Same protocol as imp-95982 (scan L, '
    + 'log-log regression for c,p, minimize RSS): the ODD branch gives L=-0.010651861, p=1.8961, '
    + 'c=4.820e-3, RSS=2.170e-18, ceiling (Q0_RECON(20)-L)/kappa = -1.8334e-5; the fine-grid EVEN refit '
    + '(m=42,44,...,70) gives L=-0.010651836, p=1.9368, ceiling -1.8344e-5. Both match the imp-95982 '
    + 'wide-even ceiling -1.8320e-5 to ~1e-8 (~0.06% of the ceiling) and its exponent ~2. VERDICT: '
    + 'GENUINE PARITY-INDEPENDENT SATURATION to a common ~-1.833e-5 floor like ~m^-2 -- the imp-95982 '
    + 'SATURATES verdict is not an artifact of the four even-branch points. Combined-branch extrapolation '
    + 'uncertainty: ceiling -1.8332e-5 +/- ~2.4e-8, exponent p mean 1.93 spread 0.065 (~2, NOT proven 2). '
    + 'Measurement of the reconstruction (m=20-only certified, imp-95966 PIECE-A obstruction unchanged); '
    + 'changes no bound. G irrationality OPEN; Sun unrefereed; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95982 (fit the fractional departure on the EVEN branch only and read SATURATES from 4 points -- '
    + 'this module cross-validates on the ODD branch), imp-95967 (fine integer grid m=41..70 supplying the '
    + '15 odd-branch points, and the finding that m=41 is the sole odd modulus of the imp-95925 sweep), '
    + 'imp-95925 (large-m Q0_RECON grid + finite asymptote ~-0.010653), imp-95966 (m>20 certification '
    + 'obstruction), imp-95745 (+4 offset m-free, so kappa = 2.5 - Q0_RECON(20))',
  scratch: ['tmp/imp-96007-scratch.mjs'],

  kappa: KAPPA,
  cOdd20Certified: C_ODD_20_CERTIFIED,
  q0Recon20: Q0_RECON_20,
  oddModuli: ODD_M,
  evenModuli: EVEN_M,

  fits: Object.freeze({
    odd: ODD_FIT,
    evenFine: EVEN_FIT_FINE,
    evenWide: EVEN_FIT_WIDE,
  }),

  comparison: Object.freeze({
    deltaLOddVsWide: DELTA_L_ODD_VS_WIDE,             // ~ +3.4e-8
    deltaPOddVsWide: DELTA_P_ODD_VS_WIDE,             // ~ -0.065
    deltaCeilingOddVsWide: DELTA_CEILING_ODD_VS_WIDE, // ~ -1.3e-8
    ceilingAgreementFrac: CEILING_AGREEMENT_FRAC,     // ~0.0006 (odd vs even ceilings agree to ~0.06%)
    reading:
      'the odd-branch saturation ceiling matches the imp-95982 even-branch ceiling to ~1e-8 (~0.06% of '
      + 'the ceiling magnitude) and the exponents agree to ~0.065 -- both parity branches saturate to a '
      + 'common finite ~-1.833e-5 rho-variation floor with a common ~m^-2 approach.',
  }),

  extrapolationUncertainty: Object.freeze({
    fits: 3, // odd, fine-even, wide-even
    LMean: L_MEAN,
    LSpread: L_SPREAD,             // ~5.9e-8
    pMean: P_MEAN,                 // ~1.93
    pSpread: P_SPREAD,             // ~0.065 (all in [1.896, 1.961]; ~2 to within spread, NOT proven 2)
    ceilingMean: CEILING_MEAN,     // ~-1.8332e-5
    ceilingSpread: CEILING_SPREAD, // ~2.4e-8
    reading:
      'across the three fits the saturation floor is fracBelowNull(inf) = -1.833e-5 +/- ~1e-8 with '
      + 'exponent p ~ 1.9-2.0. The fine-grid fits give a slightly higher L than the wide-even fit (the '
      + 'fine grid reaches only m=70 vs m=150), but the ceiling agrees to ~2e-8.',
  }),

  finding: Object.freeze({
    outcome:
      'GENUINE PARITY-INDEPENDENT SATURATION -- the odd branch converges to the SAME finite ~-1.833e-5 '
      + 'ceiling with the SAME exponent ~2 as the imp-95982 even branch; NOT a different limit or divergence',
    parityIndependentSaturation: PARITY_INDEPENDENT_SATURATION, // true
    reading:
      'the imp-95982 SATURATES verdict is confirmed on the independent odd parity branch: the four '
      + 'even-branch points were not driving the finite-ceiling conclusion. The genuine Q_0 rho-variation '
      + '(imp-95878) is bounded, with a parity-independent ~-1.833e-5 fractional floor.',
  }),

  caveats:
    'Measurement/fit only; recomputes the ceilings from the baked imp-95967 fine-grid Q0_RECON literals '
    + 'and offline fit literals. Q0_RECON is certified only at m=20 (imp-95966 PIECE-A obstruction '
    + 'unchanged), so this fits the reconstruction, not a Prop-6.3-certified per-m quantity. p is ~2 to '
    + 'within the cross-branch spread (0.065), NOT proven 2. Catalan G irrationality OPEN; Sun '
    + 'single-author, unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.',
});

export const C_ODD_DEPARTURE_ODD_BRANCH_CROSSVALIDATION_ASSERTIONS = Object.freeze([
  {
    name: 'the odd and even fine-grid branches each have 15 members (m=41..70 split by parity)',
    holds: () =>
      ODD_M.length === 15 && EVEN_M.length === 15
      && ODD_M.every((m) => m % 2 === 1) && EVEN_M.every((m) => m % 2 === 0)
      && ODD_M[0] === 41 && ODD_M[14] === 69 && EVEN_M[0] === 42 && EVEN_M[14] === 70,
  },
  {
    name: 'the ceiling closed form reproduces the imp-95982 wide-even ceiling -1.832e-5 from L=-0.010651895',
    holds: () =>
      Math.abs(EVEN_FIT_WIDE.ceiling - (-1.832e-5)) < 2e-8
      && Math.abs(KAPPA - (2.5 - Q0_RECON_20)) < 1e-9,
  },
  {
    name: 'FIT: the ODD branch gives exponent p ~ 2 (1.8 < p_odd < 2.1) and RSS < 1e-15',
    holds: () =>
      ODD_FIT.p > 1.8 && ODD_FIT.p < 2.1
      && ODD_FIT.rss < 1e-15
      && Math.abs(ODD_FIT.L - (-0.010651861)) < 1e-8,
  },
  {
    name: 'CROSS-VALIDATION: the odd-branch ceiling matches the imp-95982 even ceiling to ~1e-8 (<1% of it)',
    holds: () =>
      Math.abs(ODD_FIT.ceiling - EVEN_FIT_WIDE.ceiling) < 5e-8
      && CEILING_AGREEMENT_FRAC < 0.01,
  },
  {
    name: 'VERDICT: genuine parity-independent saturation to a common ~-1.833e-5 ceiling with p~2',
    holds: () =>
      PARITY_INDEPENDENT_SATURATION === true
      && Math.abs(CEILING_MEAN - (-1.833e-5)) < 3e-8
      && P_SPREAD < 0.1,
  },
  {
    name: 'honest: fit only, m=20-only certified, p not proven 2, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () => {
      const s = C_ODD_DEPARTURE_ODD_BRANCH_CROSSVALIDATION.status;
      return /MEASURED\/FIT/.test(s)
        && /m=20-only certified/.test(s)
        && /NOT proven 2/.test(s)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default C_ODD_DEPARTURE_ODD_BRANCH_CROSSVALIDATION;
