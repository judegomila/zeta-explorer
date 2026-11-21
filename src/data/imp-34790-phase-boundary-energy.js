// @module data/imp-34790-phase-boundary-energy
// imp-34790: Energy of the Hamiltonian around phase-change boundaries in the
// Twin-Ladder Bridge / primon-gas picture -- exact boundary laws and an honest
// classification of which boundaries are REAL phase transitions.
//
// STATUS: RIGOROUS (classical) for the identity and the two boundary expansion
// laws (F1-F3 below: term-by-term differentiation of the Euler product for
// Re s > 1 plus the Stieltjes/Laurent expansion of zeta at s=1 -- textbook
// machinery, no new axioms); MEASUREMENT for the truncation-artifact findings
// (F4-F5). No Lambda contact: nothing here moves Platt-Trudgian Lambda <= 0.2,
// and none of it is evidence for or against RH. NO QED.
//
// HEADLINE FINDINGS
// -----------------
// F1 (IDENTITY, rigorous). The HamiltonianPage "kinetic curvature" term
//     T_zpo(sigma) = sum_p (log p)^2 p^{-2 sigma} / (1 - p^{-2 sigma})^2
//     is EXACTLY (log zeta)''(2 sigma) -- the primon-gas specific-heat kernel
//     at inverse temperature beta = 2 sigma (C_v(beta) = beta^2 (log zeta)''(beta)).
//     Numerically confirmed against an independent Borwein-eta evaluation of
//     zeta, zeta-prime, zeta-double-prime: rel. err 1.15e-13 at x=4 down the
//     ladder to 2.97e-3 at x=1.5, where the residual is exactly the p > 1e7
//     prime-sum tail (it grows as x -> 1+ because the tail does).
//
// F2 (DIVERGENCE LAW at sigma -> 1/2+, rigorous). With u = 2 sigma - 1:
//     T_zpo(sigma) = 1/u^2 - c0 + c1 u + O(u^2),
//       c0 = gamma^2 + 2 gamma_1        = 0.18754623...
//       c1 = 3 gamma_2 + 6 gamma gamma_1 + 2 gamma^3 = 0.10337726...
//     Measured: g(u) - c1 u -> -0.18754600 at u=1e-3 (5e-7 from -c0); slope fit
//     0.10307 vs exact 0.103377. CONSEQUENCE: the full (untruncated) ZPO kinetic
//     curvature term does not have a strictly-convex MINIMUM at sigma = 1/2 --
//     it has a second-order-style DIVERGENCE there, with critical exponent 2,
//     inherited ENTIRELY from the zeta POLE at s = 1 via the doubling beta = 2
//     sigma. It carries pole information (Stieltjes constants), zero information
//     not at all.
//
// F3 (HAGEDORN / BOST-CONNES boundary at sigma = 1, rigorous). With v = beta-1:
//     U(beta)  = -(log zeta)'(beta) = 1/v - gamma + O(v)          (internal energy)
//     C_v(beta) = beta^2 (log zeta)''(beta), C_v v^2 = 1 + 2v + O(v^2).
//     Measured: U - 1/v -> -0.577028 at v=1e-3 (vs -gamma = -0.5772157);
//     C_v v^2 = 1.002001 at v=1e-3 (vs 1 + 2v = 1.002). The sigma=1 transition
//     is one-sided (no equilibrium phase for beta < 1): energy diverges like
//     1/(beta-1), so T = 1 is a LIMITING (Hagedorn) temperature, not a two-phase
//     coexistence point; no latent heat. This is the genuine thermodynamic phase
//     transition of the model (Bost-Connes KMS symmetry breaking at beta=1 is a
//     THEOREM), and it is REDUCES-TO-KNOWN (Bost-Connes 1995, Julia 1990).
//
// F4 (TRUNCATION LAW at the boundary itself, measurement). At sigma = 1/2
//     exactly (x = 1), the prime-truncated kinetic term grows like Mertens:
//     T_P(1) = (log P)^2 / 2 + offset(P), offset(1e7) = -0.18389, drifting
//     slowly toward approximately -c0 (Stieltjes-type finite-part match,
//     consistent but not certified). So the finite-prime page Hamiltonian is
//     FINITE at sigma=1/2 only by truncation, diverging like (log P)^2 / 2.
//
// F5 (VIZ-HAMILTONIAN CONVEXITY IS A TRUNCATION ARTIFACT, measurement). The
//     actual page Hamiltonian kinetic term T_N(sigma,t) = sum_{p <= p_N}
//     (1/2) log p (|H_p(s)|^2 + |H_p(1-s)|^2) at t = 14.134725: its curvature
//     d^2 T_N / d sigma^2 at sigma = 1/2 does NOT converge as N grows --
//     measured 19.2 (N=10), 259.3 (N=100), -77.2 (N=400), -173.7 (N=800),
//     +1320.3 (N=1600), +2869.3 (N=3200): sign flips with growing amplitude
//     (partial sums of a Dirichlet series only convergent for sigma > 1).
//     The "strict convexity of H at sigma = 1/2" claimed on HamiltonianPage
//     is a FINITE-N ARTIFACT: it holds for each truncation the page plots
//     (N <= ~100) but has no N -> infinity limit.
//
// PHASE-BOUNDARY CLASSIFICATION (question 1 of the investigation)
// ---------------------------------------------------------------
//   sigma = 1   : REAL thermodynamic phase transition (Hagedorn maximum
//                 temperature; Bost-Connes KMS symmetry breaking -- theorems).
//                 Zero-free line (Hadamard/de la Vallee Poussin) = PNT; the
//                 boundary laws here see only the POLE, not the zeros.
//   sigma = 1/2 : NOT a phase transition of the real-beta partition function
//                 (zeta is smooth through sigma=1/2 on the real axis:
//                 zeta(1/2) = -1.4603545, (log|zeta|)'' bounded on [0.3,0.7]).
//                 It is (a) the functional-equation SYMMETRY line, and (b) the
//                 locus where the ZPO kinetic kernel diverges -- but that
//                 divergence is the sigma=1 pole pulled back through beta=2sigma,
//                 NOT new structure. The only sense in which sigma=1/2 is a
//                 genuine phase boundary is in COMPLEX temperature: the
//                 Fisher zeros of the primon-gas partition function are the
//                 nontrivial zeta zeros, and RH IS the statement that this
//                 Fisher-zero condensation line is exactly Re beta = 1/2.
//                 That is a restatement of RH, not leverage on it.
//   critical coupling in the supercritical strip: NONE. imp-2323 fine survey
//                 found all phase metrics smooth inside (1/2, 1); the bulk
//                 order-parameter route is EMPIRICALLY DEAD (SupercriticalPage).
//                 In the Calogero-Moser realization the only boundary is the
//                 backward-flow collision threshold, where H_CM is NOT conserved
//                 but strictly increasing with dH_CM/dtau ~ 80/gap^4 (imp-862),
//                 and whose monotone real-zero count re-derives Lambda >= 0
//                 (imp-2673) -- known, no new analytic content.
//
// RH CONTACT (question 3): NONE beyond restatement. The energy landscape near
// both real boundaries is controlled by the pole at s=1 (Stieltjes constants
// gamma, gamma_1, gamma_2 appear; zeros never do). Convexity/energy minimization
// at sigma=1/2 cannot encode zero locations: the untruncated energy diverges
// there pole-driven, and the finite-N convexity is cutoff-dominated (F5).
// The zero information lives only in the complex-beta Fisher-zero locus (= RH)
// and in Weil positivity (= RH) -- both walls already on the route map.
//
// Computed by: scripts/compute-imp-34790-phase-boundary-energy.mjs
// (Borwein-eta n=60 for zeta/zeta'/zeta''; prime sieve to 1e7; 2026-07-06).
// SYNTAX SAFETY: line comments only, single-quoted strings, no apostrophes.

// ── Exact constants (Stieltjes) ───────────────────────────────────────────────

const GAMMA = 0.5772156649015329;
const GAMMA1 = -0.07281584548367672;
const GAMMA2 = -0.009690363192872318;
const C0 = GAMMA * GAMMA + 2 * GAMMA1; // 0.18754623284...
const C1 = 3 * GAMMA2 + 6 * GAMMA * GAMMA1 + 2 * GAMMA ** 3; // 0.10337726...

// ── Baked measurements (from the compute script) ─────────────────────────────

// F1: identity T_zpo(x) vs independent (log zeta)''(x), prime sieve to 1e7
const IDENTITY_CHECKS = [
  { x: 1.5, primeSum: 3.843504206, logZetaSecondDeriv: 3.854962916, relErr: 2.972456425e-3 },
  { x: 2.0, primeSum: 0.8844801221, logZetaSecondDeriv: 0.884481834, relErr: 1.935423941e-6 },
  { x: 2.5, primeSum: 0.3504524875, logZetaSecondDeriv: 0.3504524879, relErr: 1.009809814e-9 },
  { x: 3.0, primeSum: 0.1722807115, logZetaSecondDeriv: 0.1722807115, relErr: 5.669666723e-12 },
  { x: 4.0, primeSum: 0.05605589474, logZetaSecondDeriv: 0.05605589474, relErr: 1.154916542e-13 },
];

// F2: g(u) = (log zeta)''(1+u) - 1/u^2; gMinusLinear = g - C1*u -> -C0
const DIVERGENCE_LAW = [
  { u: 0.3, g: -0.1600797891, gMinusLinear: -0.1910929683 },
  { u: 0.1, g: -0.1776336544, gMinusLinear: -0.1879713808 },
  { u: 0.03, g: -0.1844842615, gMinusLinear: -0.1875855795 },
  { u: 0.01, g: -0.1865168676, gMinusLinear: -0.1875506402 },
  { u: 0.003, g: -0.187236487, gMinusLinear: -0.1875466188 },
  { u: 0.001, g: -0.187442626, gMinusLinear: -0.1875460033 },
];
const FITTED_SLOPE = 0.1030694912; // finite-u estimate of C1 from u in {3e-3, 1e-3}

// F3: Hagedorn boundary; UminusPole = -(log zeta)'(1+v) - 1/v -> -GAMMA;
// CvTimesV2 = (1+v)^2 (log zeta)''(1+v) v^2 -> 1 (as 1 + 2v)
const HAGEDORN_LAW = [
  { v: 0.3, UminusPole: -0.5252389226, CvTimesV2: 1.665651864 },
  { v: 0.1, UminusPole: -0.5589636147, CvTimesV2: 1.207850633 },
  { v: 0.03, UminusPole: -0.571635403, CvTimesV2: 1.060723853 },
  { v: 0.01, UminusPole: -0.5753453567, CvTimesV2: 1.020080973 },
  { v: 0.003, UminusPole: -0.576653491, CvTimesV2: 1.006007305 },
  { v: 0.001, UminusPole: -0.5770281702, CvTimesV2: 1.002000812 },
];

// F4: truncation law at x=1 (sigma=1/2): offset = T_P(1) - (log P)^2/2
const TRUNCATION_LAW = [
  { P: 1e3, T_P: 23.96498678, offset: 0.106445286 },
  { P: 1e4, T_P: 42.36807431, offset: -0.04711057065 },
  { P: 1e5, T_P: 66.13811413, offset: -0.135612251 },
  { P: 1e6, T_P: 95.25773618, offset: -0.1764298052 },
  { P: 1e7, T_P: 129.7126153, offset: -0.1838883804 },
];

// Smoothness through sigma=1/2 on the real axis (t=0): no singularity
const ZETA_HALF = -1.460354509; // reference -1.4603545088...
const REAL_AXIS_D2_MAX = 10.88801374; // max |(log|zeta|)''| on sigma in [0.3, 0.7]

// F5: finite-N viz-Hamiltonian curvature d^2 T_N / d sigma^2 at sigma=1/2,
// t = 14.134725 (first zero ordinate), central difference h=1e-3
const VIZ_CURVATURE = [
  { N: 10, pMax: 29, curvature: 19.17719149 },
  { N: 25, pMax: 97, curvature: 70.74257562 },
  { N: 50, pMax: 229, curvature: 151.7494805 },
  { N: 100, pMax: 541, curvature: 259.2942404 },
  { N: 200, pMax: 1223, curvature: 217.5405991 },
  { N: 400, pMax: 2741, curvature: -77.16305208 },
  { N: 800, pMax: 6133, curvature: -173.6530612 },
  { N: 1600, pMax: 13499, curvature: 1320.274407 },
  { N: 3200, pMax: 29443, curvature: 2869.31705 },
];

// ── Exported record ───────────────────────────────────────────────────────────

export const IMP_34790_PHASE_BOUNDARY_ENERGY = Object.freeze({
  ticketId: 'imp-34790',
  builtAt: '2026-07-06',
  generatedBy: 'scripts/compute-imp-34790-phase-boundary-energy.mjs',
  status: 'RIGOROUS (classical) for F1-F3; MEASUREMENT for F4-F5; no Lambda contact; NO QED',

  constants: Object.freeze({ GAMMA, GAMMA1, GAMMA2, C0, C1 }),
  identityChecks: Object.freeze(IDENTITY_CHECKS.map(Object.freeze)),
  divergenceLaw: Object.freeze(DIVERGENCE_LAW.map(Object.freeze)),
  fittedSlope: FITTED_SLOPE,
  hagedornLaw: Object.freeze(HAGEDORN_LAW.map(Object.freeze)),
  truncationLaw: Object.freeze(TRUNCATION_LAW.map(Object.freeze)),
  zetaHalf: ZETA_HALF,
  realAxisD2Max: REAL_AXIS_D2_MAX,
  vizCurvature: Object.freeze(VIZ_CURVATURE.map(Object.freeze)),

  phaseClassification: Object.freeze({
    sigmaEquals1: 'REAL phase transition: Hagedorn limiting temperature + Bost-Connes KMS symmetry breaking (theorems); U ~ 1/(beta-1), C_v ~ (beta-1)^{-2}, one-sided, no latent heat; sees only the pole, reduces-to-known',
    sigmaEqualsHalf: 'NOT a real-beta phase transition (zeta smooth there on the real axis); functional-equation symmetry line; the ZPO kinetic-kernel divergence at sigma=1/2 is the s=1 pole pulled back through beta=2sigma; genuine boundary only as the conjectural Fisher-zero condensation line in complex beta, which IS RH restated',
    supercriticalStrip: 'NO critical coupling inside (1/2,1): imp-2323 fine survey smooth, bulk order-parameter route empirically dead; CM collision threshold re-derives Lambda>=0 only (imp-862, imp-2673)',
  }),

  closureNote:
    'Energy of the Hamiltonian around phase-change boundaries. F1: the ZPO ' +
    'kinetic curvature term is EXACTLY (log zeta) double-prime at 2 sigma, the ' +
    'primon-gas specific-heat kernel at beta = 2 sigma (verified to 1.1e-13). ' +
    'F2: near sigma = 1/2+ it diverges as (2 sigma - 1)^{-2} - (gamma^2 + ' +
    '2 gamma_1) + (3 gamma_2 + 6 gamma gamma_1 + 2 gamma^3)(2 sigma - 1), ' +
    'critical exponent 2, driven entirely by the zeta pole at s = 1 -- so the ' +
    'claimed strict convexity at sigma = 1/2 is, for the full sum, a divergence ' +
    'carrying pole (Stieltjes) information and zero information not at all. ' +
    'F3: the sigma = 1 boundary obeys U = 1/(beta-1) - gamma + O(beta-1) and ' +
    'C_v (beta-1)^2 -> 1: a one-sided Hagedorn limiting-temperature transition ' +
    '(Bost-Connes symmetry breaking; known). F4: at sigma = 1/2 exactly the ' +
    'truncated kinetic term grows like (log P)^2 / 2 (Mertens) with finite part ' +
    'drifting toward -(gamma^2 + 2 gamma_1). F5: the finite-N page Hamiltonian ' +
    'curvature at sigma = 1/2 sign-flips with growing amplitude (19 -> 259 -> ' +
    '-77 -> -174 -> +1320 -> +2869 across N = 10..3200): the visualized strict ' +
    'convexity is a truncation artifact with no N -> infinity limit. HONEST ' +
    'CLASSIFICATION: reduces-to-known (Bost-Connes 1995, Julia 1990, Stieltjes ' +
    'expansion); the only zero-encoding phase boundary is the complex-beta ' +
    'Fisher-zero line Re beta = 1/2, which IS RH. No new route below the PCC ' +
    'wall; no refereed bound is changed; NO QED.',
});

// ── Build-time tripwires ──────────────────────────────────────────────────────

export const IMP_34790_ASSERTIONS = [
  {
    id: 'imp34790-identity-prime-sum-equals-logzeta-2nd-deriv',
    description: 'T_zpo(x) = (log zeta) double-prime (x): rel err < 1e-12 at x=4, < 1e-5 at x=2, tail-dominated growth toward x=1',
    holds: () => {
      const c = IMP_34790_PHASE_BOUNDARY_ENERGY.identityChecks;
      const at = x => c.find(r => r.x === x);
      return at(4).relErr < 1e-12 && at(3).relErr < 1e-10 && at(2).relErr < 1e-5 &&
        c.every((r, i) => i === 0 || r.relErr < c[i - 1].relErr);
    },
  },
  {
    id: 'imp34790-divergence-constant-is-stieltjes-c0',
    description: 'g(u) - C1 u -> -(gamma^2 + 2 gamma_1) within 1e-5 at u=1e-3, monotone approach',
    holds: () => {
      const d = IMP_34790_PHASE_BOUNDARY_ENERGY.divergenceLaw;
      const last = d[d.length - 1];
      const errs = d.map(r => Math.abs(r.gMinusLinear + C0));
      return Math.abs(last.gMinusLinear + C0) < 1e-5 &&
        errs.every((e, i) => i === 0 || e <= errs[i - 1]) &&
        Math.abs(IMP_34790_PHASE_BOUNDARY_ENERGY.fittedSlope - C1) < 5e-4;
    },
  },
  {
    id: 'imp34790-hagedorn-energy-and-specific-heat-laws',
    description: 'U - 1/v -> -gamma (within 2e-4 at v=1e-3) and C_v v^2 -> 1 as 1 + 2v (within 1e-5 of 1.002 at v=1e-3)',
    holds: () => {
      const h = IMP_34790_PHASE_BOUNDARY_ENERGY.hagedornLaw;
      const last = h[h.length - 1];
      return Math.abs(last.UminusPole + GAMMA) < 2e-4 &&
        Math.abs(last.CvTimesV2 - 1.002) < 1e-5 &&
        h.every((r, i) => i === 0 || Math.abs(r.CvTimesV2 - 1) < Math.abs(h[i - 1].CvTimesV2 - 1));
    },
  },
  {
    id: 'imp34790-truncation-mertens-law-at-boundary',
    description: 'T_P(1) tracks (log P)^2/2 with |offset| < 0.2 at every decade P >= 1e3 and |ratio - 1| < 0.002 at P=1e7',
    holds: () => {
      const t = IMP_34790_PHASE_BOUNDARY_ENERGY.truncationLaw;
      const lead = P => Math.log(P) * Math.log(P) / 2;
      const last = t[t.length - 1];
      return t.every(r => Math.abs(r.offset) < 0.2) &&
        Math.abs(last.T_P / lead(last.P) - 1) < 0.002;
    },
  },
  {
    id: 'imp34790-no-singularity-at-real-sigma-half',
    description: 'zeta(1/2) matches -1.4603545088 to 1e-8 and (log|zeta|) curvature stays bounded through sigma=1/2 on the real axis',
    holds: () =>
      Math.abs(IMP_34790_PHASE_BOUNDARY_ENERGY.zetaHalf - (-1.4603545088)) < 1e-8 &&
      IMP_34790_PHASE_BOUNDARY_ENERGY.realAxisD2Max < 11,
  },
  {
    id: 'imp34790-viz-convexity-is-truncation-artifact',
    description: 'Finite-N Hamiltonian curvature at sigma=1/2 has no limit: sign flips (K_400 < 0 < K_3200) and amplitude grows (|K_3200| > 5 |K_100|)',
    holds: () => {
      const v = IMP_34790_PHASE_BOUNDARY_ENERGY.vizCurvature;
      const at = N => v.find(r => r.N === N).curvature;
      return at(400) < 0 && at(800) < 0 && at(3200) > 0 &&
        Math.abs(at(3200)) > 5 * Math.abs(at(100)) &&
        at(100) > 0; // small-N regime (what the page plots) IS convex
    },
  },
  {
    id: 'imp34790-honesty-gate',
    description: 'closureNote states reduces-to-known, no Lambda contact, NO QED, and no refereed bound is changed',
    holds: () => {
      const n = IMP_34790_PHASE_BOUNDARY_ENERGY.closureNote;
      return /reduces-to-known/.test(n) && /NO QED/.test(n) && /refereed bound is changed/i.test(n) &&
        /truncation artifact/.test(n);
    },
  },
];

for (const a of IMP_34790_ASSERTIONS) {
  if (!a.holds()) throw new Error('imp-34790 assertion failed: ' + a.id);
}
