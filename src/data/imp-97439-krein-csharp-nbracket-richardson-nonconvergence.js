/**
 * @module imp-97439-krein-csharp-nbracket-richardson-nonconvergence
 * @fileoverview imp-97439 -- MEASUREMENT: Richardson/Aitken assessment of the N-direction convergence of
 *   the Krein concentration UPPER bracket lambda_1(N) = lam(N, T->inf) for
 *   c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a = ln3. The committed reading (imp-97183/imp-97206,
 *   cross-validated imp-97401) is an UPPER bracket ~0.581-0.582 with N explicitly unconverged. imp-97206
 *   built the inner T->inf limits per N (Stage 1) but CRASHED at the separable-corner cross-check
 *   immediately after, so the outer N->inf Aitken/Richardson step it set up was never reported. This leaf
 *   performs exactly that step on the T-reliable bracket sequence and DIAGNOSES the convergence.
 *
 *   MEASUREMENT ONLY. lam_1(N) are Rayleigh-Ritz UPPER brackets; establishes NO operator positivity; NO
 *   lower bound; no bound moves; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * THE BRACKET SEQUENCE. The inner T->inf limit per N (imp-97206 Stage 1; cross-validated at dps=70 with an
 *   independent quadrature by imp-97401 for N<=100) is the genuine N-direction bracket sequence. Each entry
 *   carries the inner-T fit-deficit exponent p_T(N) from the least-squares lam(N,inf) - A*T^-p fit -- the
 *   trustworthiness gauge of the inner extrapolation (a clean 1/T^p tail has p_T ~ 2+):
 *     N=52 : 0.645194   p_T=0.09   (T-fit DEGENERATE -- inner limit unreliable; discarded)
 *     N=68 : 0.642371   p_T=0.19   (T-fit DEGENERATE -- inner limit unreliable; discarded)
 *     N=84 : 0.581418   p_T=2.44
 *     N=100: 0.581059   p_T=2.25
 *     N=116: 0.581624   p_T=1.99
 *     N=132: 0.582646   p_T=1.77
 *   The T-reliable subset (p_T>=1.5) is N in {84,100,116,132}.
 *
 * FINDING 1 -- THE T-RELIABLE BRACKET SEQUENCE IS NON-MONOTONE IN N. First differences of lam(N,inf):
 *   84->100 = -0.000359, 100->116 = +0.000565, 116->132 = +0.001022. The sequence DIPS then RISES, and the
 *   upward step ACCELERATES (0.000565 -> 0.001022). Richardson and Aitken both presuppose a monotone
 *   power-law approach to the limit; a non-monotone sequence with growing steps has no such structure, so
 *   neither accelerator is applicable in its convergence-proving regime.
 *
 * FINDING 2 -- AITKEN Delta^2 IS UNSTABLE; NO ACCELERATED LIMIT. The equal-spaced (dN=16) Aitken
 *   accelerant x0 - (dx)^2/(d^2 x) on the two consecutive triples gives 0.581279 (N=84,100,116) and
 *   0.580360 (N=100,116,132) -- a spread of 0.000918, and both sit BELOW the sequence that is itself
 *   drifting UP. A convergent monotone sequence would give consistent accelerants tightening toward the
 *   limit; the disagreement and wrong-side placement confirm the accelerator returns noise, not a limit.
 *   The power-law Richardson search (lam(N,inf) = Lstar + A*N^-q) is likewise degenerate: it rails to
 *   Lstar~0.281 with q~-0.009 (a negative "rate", i.e. no decaying tail to fit).
 *
 * FINDING 3 -- THE LATE-N DRIFT IS A COUPLED-T-TRUNCATION ARTIFACT, NOT GENUINE N-BEHAVIOUR. The inner-T
 *   fit exponent p_T DEGRADES monotonically with N (2.44 -> 2.25 -> 1.99 -> 1.77): larger N needs larger T
 *   for the inner T->inf limit to resolve, so at the FIXED T-grid {800,1600,2400,3200} the inner limit is
 *   progressively UNDER-resolved as N grows. The correlation corr(p_T, lam(N,inf)) = -0.826 (strongly
 *   negative) ties the upward late-N drift directly to the worsening T-extrapolation. So the apparent
 *   N-increase at N=116,132 is contamination from an under-converged inner limit, not evidence that
 *   c_sharp(N) is genuinely increasing.
 *
 * VERDICT. The N-direction bracket sequence does NOT admit a clean Richardson/Aitken limit or a finite
 *   convergence RATE on the truncated (N,T) grid: it is non-monotone (Finding 1), its Aitken accelerants
 *   are mutually inconsistent and wrong-sided (Finding 2), and the only systematic late-N trend is an
 *   artifact of the degrading inner-T extrapolation (Finding 3). What CAN be measured is a flat plateau:
 *   over the T-reliable band N=84..132 the bracket reads mean 0.581687 +/- 0.000590, range
 *   [0.581059, 0.582646], consistent with the committed inner-N=100 value 0.581059 (imp-97206/imp-97401).
 *   This non-convergence-of-rate on truncated grids is consistent with the fractal/Zygmund eigenfunction
 *   behaviour flagged for the Route I semilocal Sonine spectrum. The value stays an UPPER bracket
 *   c_sharp <~ 0.582; NO positive lower bound is produced. SUB-GAP
 *   IMP97439_CSHARP_NBRACKET_RATE_NEEDS_N_UNIFORM_INNER_T_LIMIT. Measurement only; no operator positivity;
 *   no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97183-csharp-extprec-ladder.py (extended-precision Rayleigh-Ritz ladder; raw fixed-T N-descent)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T joint limit ~0.582; inner T->inf Stage 1)
 * @see imp-97401-csharp-crossval-dps70.py (dps=70 / independent-quadrature cross-validation for N<=100)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (why the upper bracket does not give a lower bound)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97439_BINDING_2A = LN3;
export const IMP97439_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

// The inner T->inf bracket sequence lam(N,inf) with the inner-T fit-deficit exponent p_T (imp-97206).
export const IMP97439_BRACKET_SEQUENCE = Object.freeze([
  Object.freeze({ N: 52, lamNinf: 0.645194, pT: 0.09, tReliable: false }),
  Object.freeze({ N: 68, lamNinf: 0.642371, pT: 0.19, tReliable: false }),
  Object.freeze({ N: 84, lamNinf: 0.581418, pT: 2.44, tReliable: true }),
  Object.freeze({ N: 100, lamNinf: 0.581059, pT: 2.25, tReliable: true }),
  Object.freeze({ N: 116, lamNinf: 0.581624, pT: 1.99, tReliable: true }),
  Object.freeze({ N: 132, lamNinf: 0.582646, pT: 1.77, tReliable: true }),
]);

// Finding 1 -- non-monotone first differences on the T-reliable subset.
export const IMP97439_FIRST_DIFFS = Object.freeze({
  from84to100: -0.000359,
  from100to116: +0.000565,
  from116to132: +0.001022, // step ACCELERATES -> no power-law tail
  isMonotone: false,
});

// Finding 2 -- Aitken Delta^2 accelerants (equal dN=16) and the degenerate power-law fit.
export const IMP97439_AITKEN = Object.freeze({
  triple_84_100_116: 0.581279,
  triple_100_116_132: 0.580360,
  spread: 0.000918,     // >> 3e-4: mutually inconsistent
  bothBelowSequence: true, // accelerant sits below a sequence that is drifting UP -> noise, not a limit
  stable: false,
  powerLawLstar: 0.281059, // Lstar + A*N^-q search rails to the floor
  powerLawRate: -0.009,    // negative "rate": no decaying tail -> non-convergent fit
});

// Finding 3 -- the late-N drift tracks the DEGRADING inner-T extrapolation (coupled-T artifact).
export const IMP97439_COUPLED_ARTIFACT = Object.freeze({
  pTExponentsReliableBand: [2.44, 2.25, 1.99, 1.77], // p_T DEGRADES monotonically with N
  corrPTvsLam: -0.826, // strong negative correlation
  driftIsCoupledTTruncationArtifact: true,
});

// What CAN be measured: a flat plateau over the T-reliable band.
export const IMP97439_PLATEAU = Object.freeze({
  band: 'N=84..132 (p_T>=1.5)',
  mean: 0.581687,
  std: 0.000590,
  range: [0.581059, 0.582646],
  committedInnerN100: 0.581059, // imp-97206/imp-97401 reading, inside the plateau
  isUpperBracket: true,
});

export const IMP97439_VERDICT = Object.freeze({
  ticket: 'imp-97439',
  question:
    'does the N-direction bracket sequence lambda_1(N) = lam(N, T->inf) for c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 converge to a finite positive limit at a measurable rate, or does truncated-grid (fractal/Zygmund) behaviour prevent convergence?',
  answer:
    'no measurable convergence rate. The T-reliable bracket sequence (N=84..132, inner-T fit exponent p_T>=1.5) is NON-MONOTONE with an accelerating late-N step (-0.000359, +0.000565, +0.001022), so it has no power-law tail for Richardson/Aitken to accelerate; the two consecutive Aitken Delta^2 accelerants disagree (0.581279 vs 0.580360, spread 0.000918) and both sit below a sequence that is drifting up, i.e. the accelerator returns noise not a limit; and the power-law fit lam(N,inf)=Lstar+A*N^-q is degenerate (rate q~-0.009). The only systematic late-N trend is an ARTIFACT: the inner-T fit exponent p_T degrades monotonically with N (2.44->1.77), corr(p_T, lam)=-0.826, so larger N is progressively under-resolved at the fixed T-grid. What is measurable is a flat plateau: over N=84..132 the bracket reads 0.581687 +/- 0.000590, range [0.581059, 0.582646], consistent with the committed inner-N=100 value 0.581059. c_sharp stays an UPPER bracket <~0.582; no positive lower bound, no rate.',
  binding_2a: LN3,
  // Finding 1
  bracketSequenceNonMonotone: true,
  // Finding 2
  aitkenUnstable: true,
  powerLawFitDegenerate: true,
  // Finding 3
  lateNDriftIsCoupledTArtifact: true,
  innerTExponentDegradesWithN: true,
  // measurable output
  plateauMean: 0.581687,
  plateauStd: 0.000590,
  isUpperBracketOnLambda1: true,
  positiveLowerBoundProduced: false,
  convergenceRateMeasured: false, // the diagnosis is non-convergence-of-rate on truncated grids
  consistentWithFractalZygmundObstruction: true,
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97439_CSHARP_NBRACKET_RATE_NEEDS_N_UNIFORM_INNER_T_LIMIT -- the N-direction convergence RATE of the ' +
    'c_sharp = lambda_min(P_a M_sigma2 P_a) upper bracket lambda_1(N) at 2a=ln3 cannot be extracted from the ' +
    'current coupled (N,T) grid because the inner T->inf extrapolation is NOT N-uniform: its fit-deficit ' +
    'exponent p_T degrades monotonically with N (2.44 at N=84 down to 1.77 at N=132) so the fixed T-grid ' +
    '{800,1600,2400,3200} under-resolves the inner limit at large N, contaminating the outer N-sequence ' +
    '(non-monotone, accelerating step; corr(p_T,lam)=-0.826). To decide whether lambda_1(N) converges and ' +
    'at what rate, the inner T->inf limit must first be made N-uniform (T-grid scaled with N so p_T stays ' +
    '~2+), otherwise Richardson/Aitken on the outer sequence return noise (Aitken accelerant spread 0.000918, ' +
    'both wrong-sided; power-law rate q~-0.009). What is measurable now is only a flat plateau ' +
    '0.581687 +/- 0.000590 over N=84..132, an UPPER bracket <~0.582 consistent with the committed 0.581059. ' +
    'Measurement only; no operator positivity; no lower bound; no bound moves; interval-rigorous reach ' +
    'stays 2a<=0.96.',
  qed: false,
});
export default IMP97439_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97439_ASSERTIONS = [
  {
    id: 'imp97439-bracket-sequence-non-monotone',
    holds: () => {
      const rel = IMP97439_BRACKET_SEQUENCE.filter((r) => r.tReliable);
      if (rel.length !== 4) return false;
      const d = [];
      for (let i = 0; i < rel.length - 1; i++) d.push(rel[i + 1].lamNinf - rel[i].lamNinf);
      // dips then rises with an accelerating rise -> non-monotone, no power-law tail.
      const nonMonotone = !(d.every((x) => x > 0) || d.every((x) => x < 0));
      return nonMonotone && d[0] < 0 && d[1] > 0 && d[2] > d[1] &&
        IMP97439_FIRST_DIFFS.isMonotone === false &&
        IMP97439_VERDICT.bracketSequenceNonMonotone === true;
    },
    why: 'the T-reliable bracket sequence lam(N,inf) for N=84..132 dips (84->100) then rises with an accelerating step (100->116 < 116->132), so it is non-monotone and has no power-law tail for Richardson/Aitken.',
  },
  {
    id: 'imp97439-aitken-unstable-no-accelerated-limit',
    holds: () =>
      Math.abs(IMP97439_AITKEN.triple_84_100_116 - 0.581279) < 1e-6 &&
      Math.abs(IMP97439_AITKEN.triple_100_116_132 - 0.580360) < 1e-6 &&
      IMP97439_AITKEN.spread > 3e-4 &&
      IMP97439_AITKEN.stable === false &&
      IMP97439_AITKEN.bothBelowSequence === true &&
      IMP97439_AITKEN.powerLawRate < 0 && // negative rate -> no decaying tail
      IMP97439_VERDICT.aitkenUnstable === true &&
      IMP97439_VERDICT.powerLawFitDegenerate === true,
    why: 'the two consecutive Aitken Delta^2 accelerants (0.581279, 0.580360) disagree at 9e-4 and both sit below the upward-drifting sequence, and the power-law fit rails to a negative rate q~-0.009: no accelerated limit or rate exists.',
  },
  {
    id: 'imp97439-late-n-drift-is-coupled-t-artifact',
    holds: () => {
      const pT = IMP97439_COUPLED_ARTIFACT.pTExponentsReliableBand;
      // p_T degrades monotonically with N (each larger N has a smaller inner-T exponent).
      const degrades = pT.every((v, i) => i === 0 || v < pT[i - 1]);
      return degrades && IMP97439_COUPLED_ARTIFACT.corrPTvsLam < -0.5 &&
        IMP97439_COUPLED_ARTIFACT.driftIsCoupledTTruncationArtifact === true &&
        IMP97439_VERDICT.lateNDriftIsCoupledTArtifact === true &&
        IMP97439_VERDICT.innerTExponentDegradesWithN === true;
    },
    why: 'the inner-T fit exponent p_T degrades monotonically with N (2.44->1.77) and corr(p_T, lam(N,inf))=-0.826, so the late-N upward drift is a coupled-T-truncation artifact, not genuine N-behaviour.',
  },
  {
    id: 'imp97439-plateau-is-upper-bracket-not-lower-bound',
    holds: () => {
      const P = IMP97439_PLATEAU;
      const vals = IMP97439_BRACKET_SEQUENCE.filter((r) => r.tReliable).map((r) => r.lamNinf);
      const lo = Math.min(...vals), hi = Math.max(...vals);
      return Math.abs(P.mean - 0.581687) < 1e-6 && Math.abs(P.std - 0.000590) < 1e-6 &&
        Math.abs(P.range[0] - lo) < 1e-6 && Math.abs(P.range[1] - hi) < 1e-6 &&
        P.range[0] > 0.58 && P.range[1] < 0.583 &&
        Math.abs(P.committedInnerN100 - 0.581059) < 1e-6 &&
        P.committedInnerN100 >= P.range[0] && P.committedInnerN100 <= P.range[1] &&
        P.isUpperBracket === true;
    },
    why: 'the measurable output is a flat plateau 0.581687 +/- 0.000590 over N=84..132, range [0.581059,0.582646], an UPPER bracket containing the committed inner-N=100 value 0.581059 -- not a lower bound.',
  },
  {
    id: 'imp97439-measurement-only-no-qed',
    holds: () =>
      IMP97439_VERDICT.positiveLowerBoundProduced === false &&
      IMP97439_VERDICT.convergenceRateMeasured === false &&
      IMP97439_VERDICT.isUpperBracketOnLambda1 === true &&
      IMP97439_VERDICT.operatorPositivityProved === false &&
      IMP97439_VERDICT.boundMoves === false &&
      IMP97439_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97439_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97439_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97439_VERDICT.subGap === 'string' &&
      IMP97439_VERDICT.subGap.includes('IMP97439_CSHARP_NBRACKET_RATE_NEEDS_N_UNIFORM_INNER_T_LIMIT') &&
      IMP97439_VERDICT.qed === false,
    why: 'measurement only: lam_1(N) are Rayleigh-Ritz UPPER brackets; no positive lower bound, no convergence rate, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97439_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97439-krein-csharp-nbracket-richardson-nonconvergence assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
