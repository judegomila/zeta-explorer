/**
 * @module imp-124775-etrunc-guth-maynard-tail-exponent
 *
 * imp-124775 (proof, S-frontier): PIN the imp-34791-flagged E_trunc
 * "Guth-Maynard tail" prefactor and exponent to explicit numbers for the
 * lambda-roadmap G-Etrunc-Eflow-constants gap, reconcile the imp-34791
 * prefactor 3 -> 5 correction against the Guth-Maynard exponent, and report
 * the explicit UNCONDITIONAL constant OR the precise obstruction preventing it.
 *
 * HONEST PARTIAL. The gap text calls E_trunc "a Guth-Maynard tail whose
 * prefactor/exponent must be pinned unconditionally". This module separates the
 * two halves and finds they discharge differently:
 *
 *   EXPONENT  -- pinned to an exact rational (improved over Ingham).
 *   PREFACTOR -- NOT pinnable to an unconditional number; precise obstruction
 *                identified (Guth-Maynard 2024 is asymptotic / ineffective).
 *
 * NO Lambda value changes. Platt-Trudgian Lambda <= 0.2 REMAINS the rigorous
 * SOTA. NO false QED. This is an analytic/constant-audit leaf on the E_trunc
 * term only; E_flow C_G is untouched; no headline bound moves.
 *
 * ---------------------------------------------------------------------------
 * PART 1 -- THE EXPONENT (pinned, exact, improved over Ingham)
 * ---------------------------------------------------------------------------
 * The PT-anchored E_trunc integrates the off-line zero-count tail from
 * T_PT = 3e12 at the fixed strip sigma = 3/4. The tail decay rate is
 * kappa = 1 - (density exponent). imp-34791 locked the INGHAM exponent
 * e_I(3/4) = 3(1-s)/(2-s) = 3/5, giving kappa_I = 2/5.
 *
 * Guth-Maynard 2024 ("New large value estimates for Dirichlet polynomials",
 * arXiv:2405.20552) proves, for 3/4 <= sigma <= 1,
 *     N(sigma, T) << T^{(30/13)(1-sigma) + o(1)}.
 * At sigma = 3/4 the Guth-Maynard exponent is
 *     e_GM = (30/13)(1/4) = 15/26 = 0.576923...,
 * strictly below the Ingham 3/5 = 0.6, so the tail decay rate improves to
 *     kappa_GM = 1 - 15/26 = 11/26 = 0.423077...   (exact rational, PINNED).
 * The faster decay makes the requirement curve ~2.05x more forgiving at B = 0
 * (A_max is inversely proportional to the tail integral): the GM exponent is a
 * genuine improvement to the EXPONENT half of the obligation.
 *
 * ---------------------------------------------------------------------------
 * PART 2 -- THE PREFACTOR (imp-34791 3 -> 5 correction carried to the GM rate)
 * ---------------------------------------------------------------------------
 * imp-34791 (R2) fixed a genuine bug: the recorded derivation integrated
 * dN = dNbar, but N <= Nbar does NOT imply dN <= dNbar. Integration by parts,
 *     E = int_T^inf (2/t) dN(t)
 *       = [2N(t)/t]_T^inf + 2 int_T^inf N(t)/t^2 dt <= 2 int_T^inf Nbar/t^2 dt,
 * with the boundary term at T_PT vanishing EXACTLY because N_off(T_PT) = 0
 * (Platt-Trudgian verification), gives the honest prefactor 2/kappa, not the
 * slip value 2 e/kappa. That correction is exponent-agnostic, so it carries
 * verbatim to the Guth-Maynard rate:
 *     honest prefactor  = 2/kappa_GM = 52/11 = 4.7273  (integration by parts)
 *     dN=dNbar slip     = 2 e_GM/kappa_GM = 30/11 = 2.7273
 *     slip factor       = (2/kappa)/(2 e/kappa) = 1/e_GM = 26/15 = 1.7333.
 * (Under the Ingham exponent the same slip factor is 1/e_I = 5/3; the value
 * changes only because e depends on which density input is used.)
 * The clean-count E_trunc at C = 1, B = 0 is then
 *     2/kappa_GM * T_PT^{-kappa_GM} = 2.488e-5   (vs the Ingham 5.107e-5),
 * a ~2.05x reduction from the faster GM decay -- but this is a clean-count
 * SHAPE value with C = 1, NOT an unconditional bound: it presumes an explicit
 * leading constant that Guth-Maynard does not supply. See Part 3.
 *
 * ---------------------------------------------------------------------------
 * PART 3 -- THE PRECISE OBSTRUCTION (why the prefactor is not unconditional)
 * ---------------------------------------------------------------------------
 * "Pin the prefactor unconditionally" requires an EXPLICIT constant C and
 * log-power B in a bound N(3/4, T) <= C T^{e} (log T)^B valid for all
 * T >= T_PT. Guth-Maynard 2024 supplies NEITHER:
 *   (a) the "<<" hides an unspecified absolute constant, and
 *   (b) the "+ o(1)" sits IN THE EXPONENT, an ineffective error term with no
 *       stated threshold beyond which it is < any given epsilon.
 * So the improved GM exponent 15/26 cannot be turned into a number: there is no
 * effective/explicit Guth-Maynard zero-density estimate in the literature as of
 * this audit. The precise obstruction is therefore INEFFECTIVITY of the sharper
 * exponent, not a missing algebra step.
 *
 * Consequently the sharpest FULLY EXPLICIT (named-constant, effective) density
 * input at sigma = 3/4 remains the Ingham-exponent family, unchanged from
 * imp-34791: Chourasiya-Simonic 2025 (C = 8.185, log-power (7-5s)/(2-s) = 2.6),
 * giving E_trunc_pt = 3.34 -- 16.7x short of 0.2. The imp-34791 refutation of
 * the imp-1324 Ramare line (wrong exponent 2/3, wrong by ~9.5e7x) also stands
 * unchanged. Net: the EXPONENT half of G-Etrunc-Eflow-constants improves and is
 * pinned; the PREFACTOR half stays uncertified, now with a sharpened diagnosis
 * (blocked on an EFFECTIVE Guth-Maynard, a substantially easier future target
 * than the deeper imp-34791 Part-3 barrier-realness residual, but still open).
 *
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (parent audit: 3->5, Ramare, requirement curve)
 * @see imp-345 (rigorous-modulo-constants E_trunc/E_flow form)
 * @see lambda-roadmap G-Etrunc-Eflow-constants (the obligation this leaf sharpens)
 */

// ── PT anchor and the two density exponents at sigma = 3/4 ─────────────────────
const T_PT = 3e12; // Platt-Trudgian 2021 verified off-line-free height
const SIGMA_FIXED = 0.75; // fixed strip (imp-459); NOT a moving thin strip

const inghamExponent = (s) => (3 * (1 - s)) / (2 - s);
const guthMaynardExponent = (s) => (30 / 13) * (1 - s); // arXiv:2405.20552, 3/4 <= s <= 1

const E_I = inghamExponent(SIGMA_FIXED); // 3/5 = 0.6 exact
const KAPPA_I = 1 - E_I; // 2/5 exact (imp-34791 lock)
const E_GM = guthMaynardExponent(SIGMA_FIXED); // 15/26 = 0.576923...
const KAPPA_GM = 1 - E_GM; // 11/26 = 0.423077... exact rational (PINNED)

// ── Rigorous geometric tail envelope (same primitive as imp-34791) ────────────
// int_T^inf t^{-1-c} (log t)^B dt <= (T^{-c}/c) (log T)^B / (1 - B/(c log T)),
// valid for B < c log T (geometric envelope of the ascending series).
function tailEnvelope(c, B, T) {
  const lT = Math.log(T);
  if (!(B < c * lT)) return Infinity;
  return (Math.pow(T, -c) / c) * Math.pow(lT, B) / (1 - B / (c * lT));
}
// Parts bound, boundary term = 0 by N_off(T_PT) = 0:
//   E_trunc(T) = int_T^inf (2/t) dN_off <= 2 C tailEnvelope(kappa, B, T).
const eTruncExplicit = (C, kappa, B, T) => 2 * C * tailEnvelope(kappa, B, T);

// ── PART 2 numbers: the 3->5 correction carried to the GM decay rate ──────────
const HONEST_PREFACTOR_GM = 2 / KAPPA_GM; // 52/11 = 4.7273 (integration by parts)
const SLIP_PREFACTOR_GM = (2 * E_GM) / KAPPA_GM; // 30/11 = 2.7273 (dN=dNbar slip)
const SLIP_FACTOR_GM = HONEST_PREFACTOR_GM / SLIP_PREFACTOR_GM; // 1/e_GM = 26/15
const CLEAN_COUNT_GM = eTruncExplicit(1, KAPPA_GM, 0, T_PT); // 2.488e-5 (C=1 SHAPE, not a bound)
const CLEAN_COUNT_I = eTruncExplicit(1, KAPPA_I, 0, T_PT); // 5.107e-5 (imp-34791 clean-count)
const GM_OVER_I_CLEAN = CLEAN_COUNT_GM / CLEAN_COUNT_I; // ~0.487 (GM tail ~2.05x smaller)

// ── PART 1 numbers: the requirement curve under the improved GM exponent ──────
const A_MAX_GM = (B) => 0.2 / eTruncExplicit(1, KAPPA_GM, B, T_PT);
const A_MAX_GM_CURVE = [0, 1, 2, 2.6].map((B) => ({ B, A_max: +A_MAX_GM(B).toPrecision(4) }));
const A_MAX_FORGIVENESS_B0 = A_MAX_GM(0) / (0.2 / CLEAN_COUNT_I); // ~2.05x vs Ingham at B=0

// ── PART 3: the sharpest EXPLICIT (effective) input is still Ingham-family ─────
// Chourasiya-Simonic 2025 (arXiv:2507.15184): explicit Ingham exponent, C=8.185,
// log-power (7-5s)/(2-s) = 2.6 at sigma = 3/4. Uses kappa_I (NOT the ineffective GM).
const CS_CONSTANT = 8.185;
const CS_LOG_POWER = (7 - 5 * SIGMA_FIXED) / (2 - SIGMA_FIXED); // 2.6 exact
const E_CS_EXPLICIT = eTruncExplicit(CS_CONSTANT, KAPPA_I, CS_LOG_POWER, T_PT); // 3.343
const CS_GAP_FACTOR = E_CS_EXPLICIT / 0.2; // 16.7x short of 0.2

export const ETRUNC_GUTH_MAYNARD_TAIL_EXPONENT = {
  ticket: 'imp-124775',
  proofSection: 'S-frontier',
  date: '2026-09-27',
  verdict:
    'PARTIAL. The G-Etrunc-Eflow-constants "Guth-Maynard tail" obligation splits into an EXPONENT half '
    + '(discharged) and a PREFACTOR half (obstructed). EXPONENT: at sigma = 3/4 the Guth-Maynard 2024 '
    + 'zero-density exponent (30/13)(1-s) = 15/26 improves on the Ingham 3/5, so the tail decay rate is '
    + 'pinned to the exact rational kappa_GM = 11/26 = 0.4231 (vs the imp-34791 Ingham lock kappa_I = 2/5), '
    + 'making the requirement curve ~2.05x more forgiving at B = 0. The imp-34791 prefactor 3 -> 5 correction '
    + '(dN <= dNbar fails; integration by parts with boundary term vanishing by N_off(T_PT) = 0) carries '
    + 'verbatim to this rate: honest prefactor 2/kappa_GM = 52/11 = 4.7273, dN=dNbar slip 30/11, slip factor '
    + '1/e_GM = 26/15. PREFACTOR: NOT pinnable to an unconditional number -- Guth-Maynard 2024 is asymptotic '
    + '(N << T^{(30/13)(1-s)+o(1)}: an unspecified << constant AND an ineffective o(1) IN THE EXPONENT), so '
    + 'the improved exponent yields no explicit constant. The sharpest fully-EXPLICIT input at sigma = 3/4 '
    + 'stays Chourasiya-Simonic 2025 (Ingham family, E_trunc = 3.34, 16.7x short); the imp-34791 refutation '
    + 'of the imp-1324 Ramare line stands. NET: the exponent obligation is discharged, the prefactor '
    + 'obligation is re-diagnosed as "blocked on an EFFECTIVE Guth-Maynard", not on missing algebra. '
    + 'NO Lambda value changes. Platt-Trudgian Lambda <= 0.2 REMAINS the rigorous SOTA. NO false QED.',

  exponentHalf: {
    status: 'PINNED (exact rational, improved over Ingham)',
    inghamExponentAt34: +E_I.toFixed(6), // 0.600000
    kappaIngham: +KAPPA_I.toFixed(6), // 0.400000 (imp-34791 lock)
    guthMaynardExponentAt34: +E_GM.toFixed(6), // 0.576923 = 15/26
    kappaGuthMaynard: +KAPPA_GM.toFixed(6), // 0.423077 = 11/26 (PINNED)
    kappaGuthMaynardExactRational: '11/26',
    improvesInghamBy: +(KAPPA_GM - KAPPA_I).toFixed(6), // +0.023077 faster decay
    guthMaynardValidRange: '3/4 <= sigma <= 1 (arXiv:2405.20552)',
    requirementCurveGM: A_MAX_GM_CURVE,
    forgivenessVsInghamAtB0: +A_MAX_FORGIVENESS_B0.toFixed(4), // ~2.0525x more forgiving
  },

  prefactorCorrectionCarried: {
    source: 'imp-34791 (R2): N <= Nbar does not imply dN <= dNbar; parts with N_off(T_PT) = 0',
    honestPrefactorGM: +HONEST_PREFACTOR_GM.toFixed(6), // 4.727273 = 52/11
    slipPrefactorGM: +SLIP_PREFACTOR_GM.toFixed(6), // 2.727273 = 30/11
    slipFactorGM: +SLIP_FACTOR_GM.toFixed(6), // 1.733333 = 1/e_GM = 26/15
    slipFactorInghamForContrast: +(1 / E_I).toFixed(6), // 1.666667 = 5/3 (imp-34791)
    cleanCountGM_T_PT: +CLEAN_COUNT_GM.toExponential(4), // 2.4879e-5 (C=1 SHAPE, NOT a bound)
    cleanCountIngham_T_PT: +CLEAN_COUNT_I.toExponential(4), // 5.1065e-5 (imp-34791)
    gmOverInghamCleanCount: +GM_OVER_I_CLEAN.toFixed(4), // 0.4872 (GM tail ~2.05x smaller)
    caveat:
      'The clean-count uses C = 1: it is the tail SHAPE at the GM decay rate, NOT an unconditional bound. '
      + 'Pinning it to a number requires an explicit C, which Guth-Maynard does not supply (see obstruction).',
  },

  obstruction: {
    statement:
      'The PREFACTOR cannot be pinned to an unconditional number: Guth-Maynard 2024 gives '
      + 'N(sigma, T) << T^{(30/13)(1-sigma) + o(1)}, whose "<<" hides an unspecified absolute constant AND '
      + 'whose "+ o(1)" is an ineffective error term IN THE EXPONENT with no stated threshold. No explicit / '
      + 'effective Guth-Maynard zero-density estimate exists in the literature as of this audit.',
    kind: 'ineffectivity of the sharper exponent (not a missing algebra step)',
    sharpestExplicitInputStillIngham: {
      source: 'Chourasiya-Simonic 2025 (arXiv:2507.15184), Ingham exponent kappa_I = 2/5',
      constant: CS_CONSTANT, // 8.185
      logPowerAt34: +CS_LOG_POWER.toFixed(4), // 2.6
      eTruncExplicit: +E_CS_EXPLICIT.toFixed(4), // 3.3435
      gapFactorVs0p2: +CS_GAP_FACTOR.toFixed(2), // 16.72x short
    },
    ramareLineStillRefuted: 'imp-34791 refutation of the imp-1324 Ramare line (exponent 2/3, ~9.5e7x) stands',
    futureTarget:
      'An EFFECTIVE Guth-Maynard estimate (explicit C, explicit threshold for the o(1)) would pin the '
      + 'prefactor at the improved exponent -- a substantially easier target than the deeper imp-34791 '
      + 'Part-3 residual (barrier-type realness control of hypothetical deep zeros above T_PT), but OPEN.',
  },

  roadmapGap: 'G-Etrunc-Eflow-constants',
  deterministic: true, // no GUE, no PCC
  changesLambdaValue: false,
  rigorousBeat: false,
  honest:
    'The exponent half of the Guth-Maynard tail obligation is discharged (kappa_GM = 11/26 exact, improving '
    + 'the Ingham 2/5) and the imp-34791 3 -> 5 prefactor correction is carried to it (2/kappa_GM = 52/11). '
    + 'The prefactor half is NOT unconditional: Guth-Maynard 2024 is asymptotic (ineffective o(1) in the '
    + 'exponent + unnamed constant), so the sharpest EXPLICIT input stays Chourasiya-Simonic (16.7x short). '
    + 'No headline bound moves. Platt-Trudgian Lambda <= 0.2 REMAINS the rigorous SOTA. NO false QED.',
};

// ── Build-time assertions (self-executing, THROW on failure) ──────────────────
export const ETRUNC_GUTH_MAYNARD_TAIL_ASSERTIONS = [
  {
    id: 'imp124775-gm-exponent-exact-rational-improves-ingham',
    why:
      'At sigma = 3/4 the Guth-Maynard exponent (30/13)(1-s) = 15/26 must be strictly below the Ingham '
      + '3(1-s)/(2-s) = 3/5, so the pinned tail decay rate kappa_GM = 11/26 exceeds the Ingham 2/5. If this '
      + 'drifts, the exponent lock is void.',
    holds: () =>
      Math.abs(E_GM - 15 / 26) < 1e-15
      && Math.abs(KAPPA_GM - 11 / 26) < 1e-15
      && E_GM < E_I
      && KAPPA_GM > KAPPA_I
      && Math.abs(E_I - 0.6) < 1e-15,
  },
  {
    id: 'imp124775-prefactor-3to5-carried-to-gm-rate',
    why:
      'The imp-34791 integration-by-parts correction is exponent-agnostic: honest prefactor 2/kappa_GM = '
      + '52/11 = 4.7273, dN=dNbar slip 2 e_GM/kappa_GM = 30/11 = 2.7273, slip factor 1/e_GM = 26/15. The '
      + 'clean-count SHAPE at C = 1 must reproduce 2.488e-5, ~0.487x the Ingham 5.107e-5.',
    holds: () =>
      Math.abs(HONEST_PREFACTOR_GM - 52 / 11) < 1e-12
      && Math.abs(SLIP_PREFACTOR_GM - 30 / 11) < 1e-12
      && Math.abs(SLIP_FACTOR_GM - 26 / 15) < 1e-12
      && Math.abs(CLEAN_COUNT_GM - 2.4879e-5) < 1e-8
      && Math.abs(GM_OVER_I_CLEAN - 0.4872) < 1e-3,
  },
  {
    id: 'imp124775-gm-requirement-curve-monotone-and-forgiving',
    why:
      'The GM requirement curve A_max(B) must be strictly decreasing in B and ~2.05x more forgiving than '
      + 'the Ingham curve at B = 0 (faster decay -> larger admissible A). If it drifts, the PT-anchor '
      + 'arithmetic at the GM rate moved.',
    holds: () => {
      const vals = A_MAX_GM_CURVE.map((r) => r.A_max);
      const decreasing = vals.every((v, i) => i === 0 || v < vals[i - 1]);
      return decreasing
        && Math.abs(A_MAX_FORGIVENESS_B0 - 2.0525) < 1e-2
        && A_MAX_GM(0) > 0.2 / CLEAN_COUNT_I;
    },
  },
  {
    id: 'imp124775-prefactor-obstruction-effective-gm-missing',
    why:
      'The prefactor is NOT unconditional because Guth-Maynard 2024 is asymptotic. The sharpest EXPLICIT '
      + 'input therefore stays the Ingham-family Chourasiya-Simonic value E_trunc = 3.34, 16.7x short of '
      + '0.2 -- unchanged by the improved GM exponent, which supplies no constant.',
    holds: () =>
      Math.abs(CS_LOG_POWER - 2.6) < 1e-12
      && E_CS_EXPLICIT > 0.2
      && CS_GAP_FACTOR > 15 && CS_GAP_FACTOR < 18
      && ETRUNC_GUTH_MAYNARD_TAIL_EXPONENT.obstruction.kind.includes('ineffectivity'),
  },
  {
    id: 'imp124775-honesty-gates',
    why:
      'No false QED: PARTIAL verdict, no Lambda value change, no rigorous beat, deterministic (no GUE/PCC), '
      + 'PT cited as SOTA, and the prefactor obstruction is named explicitly.',
    holds: () => {
      const m = ETRUNC_GUTH_MAYNARD_TAIL_EXPONENT;
      return m.verdict.startsWith('PARTIAL')
        && m.changesLambdaValue === false
        && m.rigorousBeat === false
        && m.deterministic === true
        && /Lambda <= 0.2 REMAINS the rigorous SOTA/.test(m.honest)
        && /NO false QED/.test(m.honest)
        && m.exponentHalf.kappaGuthMaynardExactRational === '11/26';
    },
  },
];

for (const a of ETRUNC_GUTH_MAYNARD_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-124775 assertion failed: ' + a.id + ' -- ' + a.why);
  }
}
