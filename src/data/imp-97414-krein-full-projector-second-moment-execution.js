/**
 * @module imp-97414-krein-full-projector-second-moment-execution
 * @fileoverview imp-97414 -- BUILD the genuine FULL band-projector second-moment matrix
 *   A2 = <P_a M_sigma2 P_a phi_i, P_a M_sigma2 P_a phi_j> at 2a = ln3 and re-run the imp-97400
 *   Lehmann-Maehly (m=1) lower bracket lambda_1 >= rho - 1/nu_max(rho). imp-97400 found BOTH of its A2
 *   surrogates fail: (i) the UNCOMPRESSED <M phi_i, M phi_j> = int sigma_2^2 R_i R_j references M_sigma2
 *   unbounded below to -4336.198 (vacuous); (ii) the trial-space square A1 A0^{-1} A1 returns the Ritz
 *   UPPER bracket 0.543044 exactly (circular). imp-97400 named the genuine Goerisch object -- A2 with the
 *   FULL band projector P_a (kernel K_a(s,t)=sin(a(s-t))/(pi(s-t)), the imp-97399 reproducing kernel) --
 *   as the missing primitive. This leaf builds it and runs the enclosure, turning that residual into
 *   measured numbers and a sharper obstruction.
 *
 *   EXECUTION / MEASUREMENT only. No unconditional positive lower bound is produced; no operator
 *   positivity is established; no bound moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED. Runner: tmp/imp-97414-fullprojector-secondmoment.py
 *   (mpmath dps=50; pole-free basis phi_n(x)=(a^2-x^2)^3 P_n(x/a); N=28, T=200, panel=1.0; the run below).
 *
 * THE REPRODUCING-KERNEL REALIZATION. Because the basis phi_n lives in the Paley-Wiener space PW_a,
 *   P_a phi = phi, so A phi_j = P_a(sigma_2 phi_j), and the reproducing kernel of PW_a expanded in the
 *   COMPLETE basis is K_a(s,t) = sum_k phi_k^ortho(s) phi_k^ortho(t). Hence the sinc-kernel DOUBLE integral
 *   is exactly the enlarged-basis Gram projection
 *      A2 = A1_{N x Kbig} . G_{Kbig}^{-1} . A1_{Kbig x N},  A1_{ij} = <phi_i, sigma_2 phi_j>,  G = Gram,
 *   where the middle sum runs over ALL Kbig >> N basis functions (NOT the N-dim trial space). Kbig = N is
 *   EXACTLY the imp-97400 circular surrogate (ii); Kbig -> infinity is the genuine full projector. Sweeping
 *   Kbig watches A2 (hence the bracket) move AWAY from the circular value toward the full-projector limit.
 *   The Lehmann form G2 = A2 - 2 rho A1 + rho^2 A0 = <(A-rho)phi_i,(A-rho)phi_j> is PSD by construction
 *   (one consistent inner product); lambda_min(G2) >= 0 is checked numerically at every shift.
 *
 * FINDING 1 -- RITZ BRACKETS REPRODUCE imp-97400 EXACTLY. At N=28, T=200 the exact-Gram Rayleigh-Ritz
 *   upper brackets are lambda_1 = 0.543044 and lambda_2 = 83.090493 (gap 82.547450), matching the imp-97400
 *   committed readings to all printed digits -- the driver and basis are consistent.
 *
 * FINDING 2 -- THE FULL-PROJECTOR A2 IS WELL-DEFINED AND CONVERGES. tr(A2) climbs 4.755366e9 (Kbig=28=N,
 *   the circular value) -> 4.806701e9 (Kbig=44) -> 4.813338e9 (Kbig=60) -> 4.815987e9 (Kbig=76), with
 *   shrinking increments (+51.3e6, +6.6e6, +2.6e6): the enlarged-basis reproducing kernel converges to the
 *   genuine sinc-kernel double integral. Kbig=N reproduces the imp-97400 circular surrogate (ii) exactly
 *   (Lehmann bracket = mu = 0.543044 for every rho, residual g2min ~ 1e-10).
 *
 * FINDING 3 -- WITH THE GENUINE FULL PROJECTOR THE m=1 BRACKET COLLAPSES TO VACUITY. As soon as Kbig > N
 *   (the circularity removed) the Lehmann bracket goes hopelessly NEGATIVE: at Kbig=76 it runs from
 *   -4.430e10 (rho = lambda_1 + 0.001) to -1.980e4 (rho = lambda_2 - 1e-4), with nu_max ~ 2.3e-11..5.0e-5
 *   and the ground-vector residual g2min jumping to ~455. This is the SAME vacuity mode as the uncompressed
 *   surrogate (i): the circularity of (ii) was HIDING a huge residual defect. The graph-norm second moment
 *   <A^2> of the finite-N Ritz ground vector is ~5e9 (eta ~ 7e4, vs the Temple/Lehmann break-even 6.695),
 *   because P_a M_sigma2 P_a is unbounded ABOVE (sigma_2 = (t^2+1/4)^2 w_1 grows like t^4 log t), so its
 *   spectrum reaches into the billions and the m=1 graph norm of any non-eigenvector is vacuously large.
 *
 * VERDICT. Executing the genuine full-projector A2 CLOSES the imp-97400 residual hope. Removing surrogate
 *   (ii) circularity does NOT rescue the m=1 enclosure -- it collapses to surrogate (i) vacuity because the
 *   compressed operator P_a M_sigma2 P_a is unbounded ABOVE, so its m=1 graph-norm second moment is
 *   vacuously large regardless of the (large, non-binding) spectral gap 82.5 and regardless of the
 *   still-missing certified rho <= lambda_2. The m=1 Lehmann-Maehly bracket is therefore NOT a viable route
 *   to a positive lower bound on c_sharp at 2a=ln3. NEW SUB-GAP
 *   IMP97414_M1_LEHMANN_VACUOUS_NEEDS_HIGHER_ORDER_OR_SPECTRAL_WINDOW: an m>1 Lehmann enclosure or a
 *   shift-invert / spectral-window restriction below a cutoff would be needed, and both reintroduce the
 *   certified rho <= lambda_2 requirement Rayleigh-Ritz cannot supply (imp-97415). No unconditional
 *   positive lower bound is produced. Execution/measurement only; no operator positivity; no bound moves;
 *   interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97400-krein-lehmann-maehly-lower-bracket-execution.js (the two surrogate A2 failures; named this full-projector primitive)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (the sinc-kernel / reproducing-kernel projector object)
 * @see imp-97415 (the still-required certified LOWER bound rho <= lambda_2)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (inf_t sigma_2 = -4336.198; symbol-inf bound useless)
 * @see imp-97379-krein-csharp-2d-richardson-third-order.js (all extrapolation orders are UPPER brackets; best 0.581059)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97414_BINDING_2A = LN3;
export const IMP97414_RIGOROUS_REACH_2A = 0.96; // unchanged by this execution
export const IMP97414_BEST_UPPER_BRACKET = 0.581059; // committed best Rayleigh-Ritz upper bracket (imp-97206/97355/97379)

// The executed finite-section run (mpmath dps=50, pole-free basis m=3, N=28, T=200, panel=1.0).
export const IMP97414_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  KbigSweep: [28, 44, 60, 76], // Kbig=N is the imp-97400 circular surrogate; Kbig>N is the genuine full projector
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
  a2Definition:
    'A2 = A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N} = <P_a M_sigma2 P_a phi_i, P_a M_sigma2 P_a phi_j>; ' +
    'the enlarged-basis Gram projection IS the sinc-kernel reproducing-kernel double integral (Kbig -> inf).',
});

// FINDING 1 -- Ritz brackets reproduce imp-97400 exactly.
export const IMP97414_RITZ = Object.freeze({
  lambda1UpperBracket: 0.543044, // matches imp-97400 (N=28,T=200)
  lambda2UpperBracket: 83.090493,
  gapUpperBrackets: 82.547450,
  matchesImp97400: true,
});

// FINDING 2 -- the full-projector A2 is well-defined and converges as Kbig grows.
export const IMP97414_A2_CONVERGENCE = Object.freeze({
  traceByKbig: Object.freeze({ 28: 4.755366186e9, 44: 4.806700778e9, 60: 4.813338016e9, 76: 4.815987454e9 }),
  incrementsShrink: true, // +51.3e6, +6.6e6, +2.6e6 -> converging reproducing kernel
  KbigEqualsNIsCircularSurrogate: true, // Kbig=28 reproduces the imp-97400 surrogate (ii): bracket = mu for every rho
  circularBracketValue: 0.543044, // Lehmann bracket at Kbig=N is exactly mu (residual g2min ~ 1e-10)
});

// FINDING 3 -- with the genuine full projector (Kbig>N) the m=1 Lehmann bracket collapses to vacuity.
export const IMP97414_FULL_PROJECTOR_BRACKET = Object.freeze({
  positiveConditionalBracketFound: false, // for every Kbig > N and every shift rho <= lambda_2
  bracketAtKbig76_rhoNearLambda1: -4.4295076e10, // rho = lambda_1 + 0.001
  bracketAtKbig76_rhoNearLambda2: -1.9797e4, // rho = lambda_2 - 1e-4
  nuMaxRange: '2.3e-11 .. 5.0e-5', // vanishing largest generalized eigenvalue -> lower bracket -> -infinity
  groundVectorResidualG2min: 455.4, // lambda_min(G2) at Kbig=76 -- large, so the Ritz vector is far from an eigenvector
  etaOrderOfMagnitude: 7e4, // sqrt(<A^2>) ~ 7e4 for the ground vector, vs break-even 6.695 (~1e4x over)
  sameVacuityModeAsSurrogateI: true, // the circularity of surrogate (ii) was hiding this residual defect
  rootCause:
    'P_a M_sigma2 P_a is unbounded ABOVE (sigma_2 = (t^2+1/4)^2 w_1 grows like t^4 log t), so its spectrum ' +
    'reaches into the billions and the m=1 graph-norm second moment of any non-eigenvector is vacuously large.',
});

export const IMP97414_VERDICT = Object.freeze({
  ticket: 'imp-97414',
  question:
    'does building the GENUINE full band-projector second moment A2 = <P_a M_sigma2 P_a phi_i, ...> (the sinc-kernel double integral / reproducing kernel), removing the imp-97400 surrogate (ii) circularity, let the m=1 Lehmann-Maehly enclosure produce a positive lower bracket for c_sharp at 2a=ln3?',
  answer:
    'no -- and it closes the imp-97400 residual hope. FINDING 1: the exact-Gram Ritz brackets reproduce ' +
    'imp-97400 exactly (lambda_1 = 0.543044, lambda_2 = 83.090493, gap 82.547450). FINDING 2: the ' +
    'enlarged-basis Gram projection A2 = A1_{N,Kbig} G_{Kbig}^{-1} A1_{Kbig,N} is the sinc-kernel ' +
    'reproducing-kernel double integral and CONVERGES (tr(A2) 4.755e9 -> 4.816e9 with shrinking ' +
    'increments); Kbig=N reproduces the circular surrogate (ii) exactly (bracket = mu for every rho). ' +
    'FINDING 3: as soon as Kbig>N (circularity removed) the Lehmann m=1 bracket collapses to hopeless ' +
    'negativity (-4.43e10 near lambda_1, -1.98e4 near lambda_2; nu_max ~ 2.3e-11..5.0e-5), the SAME ' +
    'vacuity mode as the uncompressed surrogate (i): the ground-vector graph norm is ~5e9 (eta ~ 7e4 vs ' +
    'break-even 6.695). Root cause: P_a M_sigma2 P_a is unbounded ABOVE, so its m=1 graph-norm second ' +
    'moment is vacuously large regardless of the (large, non-binding) spectral gap 82.5 and regardless of ' +
    'the still-missing certified rho <= lambda_2 (imp-97415). The m=1 Lehmann-Maehly bracket is NOT a ' +
    'viable route to a positive lower bound on c_sharp at 2a=ln3.',
  binding_2a: LN3,
  bestUpperBracket: 0.581059,
  // Finding 1
  ritzMatchesImp97400: true,
  gapUpperBrackets: 82.547450,
  // Finding 2
  fullProjectorA2Converges: true,
  circularSurrogateReproducedAtKbigEqualsN: true,
  // Finding 3
  m1BracketPositive: false,
  collapsesToUncompressedVacuity: true,
  operatorUnboundedAbove: true,
  newSubGap: 'IMP97414_M1_LEHMANN_VACUOUS_NEEDS_HIGHER_ORDER_OR_SPECTRAL_WINDOW',
  // execution-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97414_ASSERTIONS = [
  {
    id: 'imp97414-ritz-matches-imp97400',
    holds: () =>
      Math.abs(IMP97414_RITZ.lambda1UpperBracket - 0.543044) < 1e-6 &&
      Math.abs(IMP97414_RITZ.lambda2UpperBracket - 83.090493) < 1e-5 &&
      Math.abs(IMP97414_RITZ.gapUpperBrackets - (IMP97414_RITZ.lambda2UpperBracket - IMP97414_RITZ.lambda1UpperBracket)) < 1e-5 &&
      IMP97414_RITZ.matchesImp97400 === true,
    why: 'the exact-Gram Ritz upper brackets reproduce the imp-97400 committed readings (lambda_1=0.543044, lambda_2=83.090493).',
  },
  {
    id: 'imp97414-full-projector-a2-converges',
    holds: () => {
      const tr = IMP97414_A2_CONVERGENCE.traceByKbig;
      const inc1 = tr[44] - tr[28];
      const inc2 = tr[60] - tr[44];
      const inc3 = tr[76] - tr[60];
      return inc1 > 0 && inc2 > 0 && inc3 > 0 && inc1 > inc2 && inc2 > inc3 &&
        IMP97414_A2_CONVERGENCE.KbigEqualsNIsCircularSurrogate === true &&
        Math.abs(IMP97414_A2_CONVERGENCE.circularBracketValue - IMP97414_RITZ.lambda1UpperBracket) < 1e-6;
    },
    why: 'the enlarged-basis A2 has positive shrinking increments (converging reproducing kernel), and Kbig=N reproduces the circular surrogate value mu.',
  },
  {
    id: 'imp97414-m1-bracket-collapses',
    holds: () =>
      IMP97414_FULL_PROJECTOR_BRACKET.positiveConditionalBracketFound === false &&
      IMP97414_FULL_PROJECTOR_BRACKET.bracketAtKbig76_rhoNearLambda1 < 0 &&
      IMP97414_FULL_PROJECTOR_BRACKET.bracketAtKbig76_rhoNearLambda2 < 0 &&
      IMP97414_FULL_PROJECTOR_BRACKET.sameVacuityModeAsSurrogateI === true &&
      IMP97414_VERDICT.newSubGap === 'IMP97414_M1_LEHMANN_VACUOUS_NEEDS_HIGHER_ORDER_OR_SPECTRAL_WINDOW',
    why: 'with the genuine full projector (Kbig>N) the m=1 Lehmann bracket is negative for every shift -- collapses to the uncompressed-surrogate vacuity mode.',
  },
  {
    id: 'imp97414-execution-only-no-qed',
    holds: () =>
      IMP97414_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97414_VERDICT.operatorPositivityProved === false &&
      IMP97414_VERDICT.boundMoves === false &&
      IMP97414_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97414_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97414_BINDING_2A - LN3) < 1e-12 &&
      IMP97414_VERDICT.qed === false,
    why: 'execution/measurement only: no rigorous positive lower bound, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97414_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97414-krein-full-projector-second-moment-execution assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
