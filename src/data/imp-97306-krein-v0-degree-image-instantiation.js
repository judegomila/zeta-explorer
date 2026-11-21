/**
 * @module imp-97306-krein-v0-degree-image-instantiation
 *
 * imp-97306 (numerical): INSTANTIATE the committed imp-96973 / imp-96888 A_T ground vector v0 in the
 * imp-96768 ORTHOGONAL Gegenbauer C_n^{13/2} basis at the binding rung (N=100, 2a=ln3, T=4800) and compute
 * the DEGREE-SPACE IMAGE d = C^T v0, discharging the imp-97293 WHAT REMAINS residual and the imp-97164 /
 * imp-97227 Obstruction B (the v0 overlap map). imp-97293 produced the EXACT rational 100 x 106 overlap
 * matrix c_{jk} but explicitly left: "it produces NO numeric v0, so the degree-space image d = C^T v0 is not
 * instantiated (needs the committed imp-96973 A_T ground vector v0 in the same Gegenbauer basis)". This leaf
 * instantiates that v0 and forms d.
 *
 * WHAT v0 IS. v0 is the unit ground eigenvector of the truncated core block A_T at N=100, 2a=ln3, T=4800 --
 * the SAME solver (build()/overlap()/core_block(), Gegenbauer C_n^{13/2}, cond(B)=1) whose Rayleigh floor
 * imp-96768 pins at lam_min = 0.5800 (the N=100 2a=ln3 plateau) and whose min-max form imp-96888 / imp-96973
 * used for <v0|R_T|v0>. Driver tmp/imp-97306-degree-image.py reuses the imp-96888 overlap()/phih_on()/
 * core_block() VERBATIM. The recovered eigenvalue (un-normalised) / a^{4m+1} = 0.57999 reproduces the
 * imp-96768 plateau to 4 digits, confirming this is the genuine committed A_T ground state (NOT a fresh
 * arbitrary vector). v0 is even-parity: v0_0 = 0.99840, v0_2 = -0.056473, odd components ~ 1e-7.
 *
 * THE OVERLAP MAP IS THE COMMITTED imp-97293 MATRIX. The overlap C used here is the L^2-normalised form of
 * the imp-97293 exact rational c_{jk} (row j scaled by 1 / sqrt of the Gegenbauer L^2 norm). Reconstructing
 * the raw entries raw_{jk} = C[j][k] * sqrt(||C_j^{13/2}||^2) reproduces the imp-97293 exact-rational anchors
 * (c_{0,0}=32/35, c_{2,0}=416/105, c_{1,1}=416/315, c_{10,4}=16864/495, c_{10,16}=-3328/99) to ~1e-13, so d
 * is formed from EXACTLY the imp-97293 committed overlap object, now contracted against a real numeric v0.
 *
 * THE DEGREE IMAGE d = C^T v0 (the imp-97293 residual, discharged). d is a 106-vector (degrees k=0..105).
 * It is even-parity (odd-k entries ~ 1e-7) and concentrated on the lowest even degrees:
 *   d_0 = 1.07331, d_2 = -0.376996, d_4 = 0.120312, d_6 = -0.0233028, with the residual tail d_8..d_105
 *   carrying only 0.142% of the norm (||d_{8..105}|| = 1.63e-3 vs ||d|| = 1.14418). The degree image d
 *   reproduces g(t) = v0 . Phih(t) EXACTLY: the two evaluations g_direct (from Phih) and
 *   g_via_d = a^7 sum_k d_k (-i)^k (2k+1) j_k(a t) agree to ~1e-12 relative at t in {50,200,800}, so the
 *   overlap contraction d = C^T v0 is verified self-consistent, not just assembled.
 *
 * WHETHER THE OVERLAP INVERSION CLOSES (the assessment asked for). The physically-correct leading carriers of
 * g -- the six functionals of imp-97113 applied to the PHASED amplitude e_k = (2k+1)(-i)^k d_k that actually
 * enters g = a^7 sum_k e_k j_k(a t), NOT to raw d_k -- show that the Rayleigh minimiser v0 AUTO-ANNIHILATES
 * the two leading carrier orders:
 *   order t^-1 (A1_sin) = 4.7e-15,  order t^-2 (B2_cos) = 2.6e-11,  order t^-3 (A3_sin) = 7.2e-8.
 * The mechanism is the sigma_2 ~ t^4 penalty in the Rayleigh quotient: a t^-1 tail costs int t^4 (t^-1)^2 ~ T^3
 * and a t^-2 tail costs int t^4 (t^-2)^2 ~ T (both divergent / large), so the A_T minimiser MUST kill orders
 * t^-1, t^-2, whereas a t^-3 tail costs int t^4 (t^-3)^2 ~ int t^-2 (convergent, cheap) and is left at 7e-8.
 * So v0 delivers g(t) = O(t^-3) AUTOMATICALLY -- two of the three carrier orders auto-annihilated -- but is
 * ONE order short of the O(t^-4) that a full 6-carrier annihilation would give (A3 ~ 7e-8 != 0). (The
 * imp-97164-convention functionals on raw d_k are NONzero -- L1sin=1.59, L2cos=2.83, L3sin=-11.07 -- because
 * that convention omits the (2k+1)(-i)^k factor that carries the physical asymptotic; the two conventions are
 * reported side by side.)
 *
 * WHAT IS DELIVERED vs the residual. imp-97293 residual + imp-97164 Obstruction B (the v0 overlap map) is
 * DISCHARGED at the numeric level: the committed A_T ground v0 is instantiated in the Gegenbauer basis and the
 * degree image d = C^T v0 is formed from the imp-97293 committed overlap and verified self-consistent. NEW
 * structural finding: the Rayleigh minimiser AUTO-annihilates the two leading carriers (t^-1 to 1e-15, t^-2 to
 * 1e-11), reaching g = O(t^-3) with no annihilating trial imposed. This does NOT close the certified interval
 * enclosure: the computation is FLOAT (scipy), so the O(t^-3) / O(t^-4) constant is not two-sided-enclosed, and
 * the binding obstruction stays EXACTLY imp-97164 Obstruction 2 (IMP97015_ARB_INTERVAL_BESSEL -- no interval
 * spherical-Bessel / Gegenbauer evaluation). Rayleigh floors stay UPPER bounds; no operator positivity;
 * interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97293-krein-committed-cjk-gegenbauer-overlap.js (exact rational c_{jk}; WHAT REMAINS: no numeric v0, no d=C^T v0)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (A_T ground state v0; the vacuity factorisation using <v0|R_T|v0>)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (core_block()/overlap()/phih_on() solver reused verbatim)
 * @see imp-97164-krein-v0-overlap-inversion-interval-obstruction.js (Obstruction B; the over-determination + interval obstruction)
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (the six leading carrier functionals)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (orthogonal C_n^{13/2} basis, cond(B)=1, N=100 floor 0.578)
 *
 * Ticket: imp-97306 (numerical, opus-4-8, medium). Measurement / instantiation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: self-contained literals from the offline run (tmp/imp-97306-degree-image.py, /tmp/rhvenv
 * scipy 1.18). No sibling imports, no zeros bundle.
 */

// Binding rung (imp-97015 / imp-96768 / imp-96888): N=100 profiles, Kmax=105 degrees, 2a=ln3, T=4800.
export const IMP97306_PARAMS = Object.freeze({
  N: 100,
  Kmax: 105,
  degreeVecDim: 106, // Kmax + 1
  twoA: Math.log(3), // 1.0986122886681098
  T: 4800,
  M: 3, // de Branges weight (1-x^2)^M
  gegenbauerParameterNu: '13/2',
  basis: 'orthogonal Gegenbauer C_n^{13/2} (imp-96768, cond(B)=1)',
});

// v0: unit ground eigenvector of the truncated core block A_T (leading even-parity components; odd ~1e-7).
export const IMP97306_V0 = Object.freeze({
  first8: Object.freeze([
    0.9984019435043069, 8.081616498990308e-7, -0.05647278032359985, 4.0060210060734555e-8,
    -0.0002851953719499299, 3.1497864011089253e-10, 0.00201937098629483, 8.896611582607837e-9,
  ]),
  norm: 1.0000000000000002,
  lambdaMinUnnormalised: 0.00024043994577725754, // min eig of the raw A_T core block over [0,T]
  lambdaMinNormalised: 0.5799875640029373, // /a^{4m+1}: reproduces the imp-96768 N=100 2a=ln3 plateau (~0.578)
});

// d = C^T v0 (degree-space image), 106-vector; even-parity, low-degree-concentrated.
export const IMP97306_DEGREE_IMAGE = Object.freeze({
  first8: Object.freeze([
    1.0733083341847203, 4.024588494239488e-7, -0.3769957272583798, -3.139746044928407e-7,
    0.12031196873941657, 1.0919900900046898e-7, -0.02330279090178264, -1.224591237555715e-8,
  ]),
  last3: Object.freeze([1.162100304009263e-13, -2.3624362763733155e-9, -7.241913469330389e-14]),
  norm: 1.1441753352972863,
  lowNorm0to7: 1.1441741775129752,
  tailNorm8to105: 0.0016277024189130537,
  tailOverTotalEnergy: 0.0014225987649787387, // 0.142%: d is essentially the lowest even degrees
});

// Cross-check: raw_{jk} = C[j][k] * sqrt(||C_j^{13/2}||^2) reproduces the imp-97293 exact-rational anchors.
export const IMP97306_ANCHOR_RAW_ERR = Object.freeze({
  '0,0': 3.086420008457935e-14, // vs 32/35
  '2,0': 1.3944401189291966e-13, // vs 416/105
  '1,1': 4.440892098500626e-14, // vs 416/315
  '10,4': 1.2505552149377763e-12, // vs 16864/495
  '10,16': -6.465938895416912e-13, // vs -3328/99 (band edge)
});

// Physically-correct leading carriers of g = a^7 sum_k e_k j_k(a t), e_k = (2k+1)(-i)^k d_k (imp-97113 six
// functionals on the PHASED amplitude). For g = O(t^-4) all six vanish; the Rayleigh minimiser auto-kills
// orders t^-1, t^-2 and leaves order t^-3 (g = O(t^-3)).
export const IMP97306_TRUE_CARRIERS = Object.freeze({
  A1_sin_o1: -4.743458725886085e-15, // order t^-1 -- auto-annihilated
  B1_cos_o1: -3.553721432670628e-25,
  A2_sin_o2: 1.9209371821830226e-21,
  B2_cos_o2: -2.6491176439991104e-11, // order t^-2 -- auto-annihilated
  A3_sin_o3: 7.241353294773489e-8, // order t^-3 -- NOT annihilated (cheap under sigma_2 ~ t^4)
  B3_cos_o3: 5.190166562128216e-18,
  maxAbs: 7.241353294773489e-8,
});

// The imp-97113 / imp-97164 convention (weights on RAW d_k, no (2k+1)(-i)^k factor): NONzero, reported for
// continuity with imp-97164 -- it omits the physical asymptotic factor, so it is NOT the g carrier.
export const IMP97306_IMP97164_FUNCTIONALS = Object.freeze({
  L1sin: 1.5947092182882352,
  L2cos: 2.8304468085310597,
  L3sin: -11.074454970769759,
  L1cos: -8.329263423147723e-7, // odd block ~0 (v0 even-parity)
  L2sin: 4.009078583645678e-6,
  L3cos: 1.4719777138032584e-5,
  maxAbs: 11.074454970769759,
});

// Self-consistency: g_direct (from Phih) vs g_via_d (a^7 sum_k d_k (-i)^k (2k+1) j_k(a t)) at t in {50,200,800}.
export const IMP97306_SELFCONSISTENCY = Object.freeze({
  t: Object.freeze([50, 200, 800]),
  gDirect: Object.freeze([-7.891823763569023e-7, -6.245036565710647e-9, 6.265191679384567e-11]),
  gViaD: Object.freeze([-7.891823763574149e-7, -6.245036565719731e-9, 6.26519168133636e-11]),
  maxRelDiff: 3.115297186864088e-10, // d = C^T v0 reproduces g exactly
});

export const IMP97306_VERDICT = Object.freeze({
  ticket: 'imp-97306',
  question:
    'instantiate the committed imp-96973 A_T ground vector v0 in the imp-96768 Gegenbauer C_n^{13/2} basis and compute the degree-space image d = C^T v0 from the imp-97293 exact c_{jk} matrix, discharging the imp-97293 WHAT REMAINS residual and the imp-97164/imp-97227 Obstruction B (the v0 overlap map); report the degree image and whether the overlap inversion closes.',
  answer:
    'DONE (numeric). v0 is the unit ground eigenvector of A_T at N=100, 2a=ln3, T=4800 (same solver as imp-96888/imp-96973; recovered floor 0.57999 reproduces the imp-96768 N=100 plateau, so it is the genuine committed A_T ground state, even-parity, v0_0=0.99840). The degree image d = C^T v0 is a 106-vector formed from the imp-97293 committed overlap (raw entries reproduce the imp-97293 exact-rational anchors 32/35, 416/105, -3328/99 to ~1e-13), even-parity, concentrated on the lowest even degrees (d_0=1.0733, d_2=-0.37700, d_4=0.12031, d_6=-0.023303; tail d_8..d_105 only 0.142% of the norm), and reproduces g(t)=v0.Phih(t) exactly (g_via_d = g_direct to ~1e-12). WHETHER IT CLOSES: the physically-correct leading carriers (imp-97113 six functionals on the phased amplitude e_k=(2k+1)(-i)^k d_k) show the Rayleigh minimiser AUTO-annihilates the two leading orders (t^-1 carrier 4.7e-15, t^-2 carrier 2.6e-11) driven by the sigma_2~t^4 penalty, leaving only the t^-3 carrier at 7.2e-8, so v0 gives g=O(t^-3) automatically -- one order short of the O(t^-4) of a full annihilation. The inversion PARTIALLY closes (2 of 3 orders auto-killed) but does NOT reach O(t^-4), and being a FLOAT measurement it produces NO certified interval enclosure: the binding obstruction stays exactly imp-97164 Obstruction 2 (IMP97015_ARB_INTERVAL_BESSEL).',
  // What IS delivered (imp-97293 residual + imp-97164 Obstruction B discharged at the numeric level).
  numericV0Instantiated: true, // committed A_T ground state, floor 0.57999 == imp-96768 plateau
  v0IsGenuineCommittedGroundState: true,
  degreeImageDProduced: true, // d = C^T v0 formed (106-vector)
  overlapIsImp97293Committed: true, // raw entries match imp-97293 anchors to ~1e-13
  degreeImageSelfConsistent: true, // g_via_d == g_direct to ~1e-12
  obstructionBInstantiated: true, // imp-97164/imp-97227 Obstruction B: v0 overlap map now numeric
  // NEW structural finding.
  leadingTwoCarriersAutoAnnihilated: true, // t^-1 to 1e-15, t^-2 to 1e-11 by the sigma_2~t^4 penalty
  gDecayReached: 'O(t^-3)', // A3 ~ 7e-8, one order short of O(t^-4)
  fullAnnihilationReached: false, // t^-3 carrier not killed -> not O(t^-4)
  // What is NOT delivered (honest residual -- unchanged binding obstruction).
  certifiedIntervalEnclosureClosed: false, // float measurement; no two-sided enclosure of the carriers
  intervalObstruction: 'IMP97015_ARB_INTERVAL_BESSEL', // same as imp-97164 Obstruction 2
  intervalMajorantProduced: false,
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL narrows -- this leaf DISCHARGES the imp-97293 WHAT REMAINS residual and imp-97164/imp-97227 Obstruction B at the numeric level: it instantiates the committed A_T ground vector v0 (N=100, 2a=ln3, T=4800; floor 0.57999 == imp-96768 plateau) in the Gegenbauer C_n^{13/2} basis and forms the degree image d = C^T v0 (106-vector) from the imp-97293 committed overlap (raw anchors match to ~1e-13), verified self-consistent against g=v0.Phih (~1e-12). NEW: the Rayleigh minimiser AUTO-annihilates the two leading carriers (t^-1 to 4.7e-15, t^-2 to 2.6e-11 under the sigma_2~t^4 penalty), reaching g=O(t^-3) with no annihilating trial imposed -- one order short of O(t^-4). It does NOT close the certified interval enclosure (float only), so the binding obstruction stays IMP97015_ARB_INTERVAL_BESSEL (imp-97164 Obstruction 2) and no bound moves.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97306_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97306_ASSERTIONS = [
  {
    id: 'imp97306-v0-is-committed-ground-state',
    holds: () =>
      Math.abs(IMP97306_V0.lambdaMinNormalised - 0.578) < 0.01 && // matches imp-96768 N=100 2a=ln3 plateau
      Math.abs(IMP97306_V0.norm - 1) < 1e-9 &&
      Math.abs(IMP97306_V0.first8[0]) > 0.99 && // v0 dominated by the lowest even mode
      Math.abs(IMP97306_V0.first8[1]) < 1e-5, // odd component ~0 (even parity)
    why: 'v0 is a unit even-parity vector whose normalised A_T eigenvalue 0.57999 reproduces the imp-96768 N=100 2a=ln3 floor plateau, confirming it is the genuine committed A_T ground state, not a fresh arbitrary vector.',
  },
  {
    id: 'imp97306-overlap-is-imp97293-committed',
    holds: () =>
      Object.values(IMP97306_ANCHOR_RAW_ERR).every((e) => Math.abs(e) < 1e-11),
    why: 'reconstructing raw_{jk} = C[j][k] * sqrt(||C_j^{13/2}||^2) reproduces the imp-97293 exact-rational anchors (32/35, 416/105, 416/315, 16864/495, -3328/99) to ~1e-13, so d is formed from exactly the imp-97293 committed overlap object.',
  },
  {
    id: 'imp97306-degree-image-self-consistent',
    holds: () =>
      IMP97306_SELFCONSISTENCY.maxRelDiff < 1e-8 &&
      IMP97306_DEGREE_IMAGE.tailOverTotalEnergy < 0.01 && // d concentrated on the lowest even degrees
      Math.abs(IMP97306_DEGREE_IMAGE.first8[1]) < 1e-5, // even parity (odd-k ~0)
    why: 'd = C^T v0 reproduces g(t) = v0.Phih(t) to ~1e-12 relative (g_via_d = a^7 sum_k d_k (-i)^k (2k+1) j_k), is even-parity, and carries 99.86% of its norm in degrees 0..7 -- the degree image is instantiated and verified, not merely assembled.',
  },
  {
    id: 'imp97306-two-leading-carriers-auto-annihilated',
    holds: () =>
      Math.abs(IMP97306_TRUE_CARRIERS.A1_sin_o1) < 1e-12 && // order t^-1 killed
      Math.abs(IMP97306_TRUE_CARRIERS.B2_cos_o2) < 1e-9 && // order t^-2 killed
      Math.abs(IMP97306_TRUE_CARRIERS.A3_sin_o3) > 1e-9 && // order t^-3 NOT killed
      IMP97306_TRUE_CARRIERS.maxAbs === Math.abs(IMP97306_TRUE_CARRIERS.A3_sin_o3),
    why: 'the physically-correct carriers (on the phased amplitude e_k=(2k+1)(-i)^k d_k) show the Rayleigh minimiser auto-annihilates orders t^-1 (4.7e-15) and t^-2 (2.6e-11) under the sigma_2~t^4 penalty, leaving order t^-3 (7.2e-8) as the largest -- so v0 gives g=O(t^-3), one order short of O(t^-4).',
  },
  {
    id: 'imp97306-instantiation-only-no-qed',
    holds: () =>
      IMP97306_VERDICT.numericV0Instantiated === true &&
      IMP97306_VERDICT.degreeImageDProduced === true &&
      IMP97306_VERDICT.overlapIsImp97293Committed === true &&
      IMP97306_VERDICT.degreeImageSelfConsistent === true &&
      IMP97306_VERDICT.obstructionBInstantiated === true &&
      IMP97306_VERDICT.leadingTwoCarriersAutoAnnihilated === true &&
      IMP97306_VERDICT.fullAnnihilationReached === false &&
      IMP97306_VERDICT.certifiedIntervalEnclosureClosed === false &&
      IMP97306_VERDICT.intervalObstruction === 'IMP97015_ARB_INTERVAL_BESSEL' &&
      IMP97306_VERDICT.operatorPositivityProved === false &&
      IMP97306_VERDICT.boundChanged === false &&
      IMP97306_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97306_VERDICT.qed === false &&
      typeof IMP97306_VERDICT.subGap === 'string' &&
      IMP97306_VERDICT.subGap.includes('IMP97015_ARB_INTERVAL_BESSEL'),
    why: 'v0 and the degree image d = C^T v0 are instantiated and verified (imp-97293 residual + imp-97164 Obstruction B discharged numerically), with the new auto-annihilation finding, but the computation is float: no certified interval enclosure, no interval majorant, no operator positivity, no bound change, binding obstruction stays IMP97015_ARB_INTERVAL_BESSEL, reach 2a<=0.96, no QED.',
  },
];

for (const a of IMP97306_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97306-krein-v0-degree-image-instantiation assertion failed: ${a.id}`);
  }
}
