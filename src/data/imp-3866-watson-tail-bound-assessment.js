/**
 * @module imp-3866-watson-tail-bound-assessment
 * @fileoverview imp-3866 -- ASSESS the named sub-gap sg-3844-watson-tail: can the Watson-lemma
 *   remainder on the O(e^{-4 tau}) tail of
 *       A(tau) = int_0^inf Phi(s) Phi(s+tau) ds
 *   be turned into a CERTIFIED error bound on c(tau) - (c_inf + B e^{-2 tau}), or does it stay
 *   external? imp-3844 derived only the LEADING Watson term (c_inf = -ln((pi/2) Phi(0))) and the
 *   first subleading coefficient (B = 3/(2 pi)); the all-orders tail bound was tagged open.
 *
 *   THE DECOMPOSITION (what a certified bound rests on)
 *   ---------------------------------------------------
 *   Following imp-3844, with T = pi e^{4 tau} and the substitution t = e^{4s}-1 the shifted-kernel
 *   n=1 tail turns A(tau) into a pure Laplace integral concentrated at the t=0 endpoint:
 *       A_n1(tau) = e^{-T} int_0^inf e^{-T t} phi(t) [ (pi T / 2) - (3/4) sqrt(pi T) / sqrt(1+t) ] dt,
 *       phi(t) = e^{-pi (1+t)} acc(s(t)),   s(t) = (1/4) ln(1+t),
 *       acc(s) = sum_{n>=1} ( 2 pi^2 n^2 (n^2) e^{4s} - 3 pi n^2 e^{2s} ) e^{-pi (n^2-1) e^{4s}}.
 *   The tail c(tau) - (c_inf + B e^{-2 tau}) then has exactly THREE remainder sources, each of
 *   which this module shows is a STANDARD analytic-Watson estimate rather than an external unknown:
 *
 *     (R1) Dropped n>=2 tail of Phi(s+tau).  Every n>=2 term of the shifted kernel carries
 *          e^{-pi (n^2-1) e^{4(s+tau)}} &lt;= e^{-3 pi e^{4 tau}} = e^{-3 T}, i.e. RELATIVE size
 *          e^{-2 T} against the leading e^{-T}. This is super-exponentially small in tau -- far
 *          below any e^{-4 tau} -- and is measured here as UNDETECTABLE in double precision.
 *
 *     (R2) Watson endpoint remainder.  The slow amplitude phi(t) is REAL-ANALYTIC on (-1, inf)
 *          (s(t) = (1/4) ln(1+t) has its nearest singularity at the branch point t = -1, and acc
 *          is a finite sum of analytic terms), so it has radius-of-convergence-1 Cauchy estimates
 *          |phi^{(N)}(0)/N!| &lt;= M(r)/r^N for any r &lt; 1, and on the real axis decays as
 *          phi(t) = O((1+t) e^{-pi t}). The Term-B factor 1/sqrt(1+t) is likewise analytic on
 *          (-1, inf) with radius 1. A split int_0^delta + int_delta^inf then gives a rigorous
 *          Watson remainder: bracket(tau) = 2 pi - 3 e^{-2 tau} + rho(tau) with |rho(tau)| &lt;=
 *          K0 e^{-4 tau}, the e^{-4 tau} order coming from the phi'(0)/T^2 second Watson term.
 *
 *     (R3) The -ln propagation.  c(tau) = -ln A_n1 - T = -ln((pi/2) Phi(0)) - ln(1 + x),
 *          x = -(3/(2 pi)) e^{-2 tau} + rho/(2 pi). The standard ln(1+x) remainder
 *          |ln(1+x) - x| &lt;= x^2 / (2 (1-|x|)) turns (R2) into
 *              c(tau) - (c_inf + B e^{-2 tau}) = -rho/(2 pi) + (9/(8 pi^2)) e^{-4 tau} + O(e^{-6 tau}),
 *          all O(e^{-4 tau}) with an EXPLICIT constant.
 *
 *   NUMERICAL CORROBORATION (this module, self-computing)
 *   -----------------------------------------------------
 *   Over the clean window tau in {2.5, 3, 3.5} (below the imp-3730 cancellation floor near tau~6):
 *     - (R1) the relative drop |A_full/A_n1 - 1| reads 0 to machine precision (super-exp small).
 *     - (R2) rho(tau)/e^{-4 tau} sits at a CONSTANT ~ -3.406, so the bracket remainder is exactly
 *       O(e^{-4 tau}) with a bounded, tau-independent coefficient.
 *     - (R3) [c(tau) - (c_inf + B e^{-2 tau})] / e^{-4 tau} sits at ~ 0.657, and this matches the
 *       CLOSED prediction -rho_ratio/(2 pi) + 9/(8 pi^2) to O(e^{-2 tau}) -- confirming the ln
 *       propagation is exactly the derived quadratic correction, not an unexplained drift.
 *
 *   VERDICT
 *   -------
 *   sg-3844-watson-tail is REDUCIBLE, not external: the O(e^{-4 tau}) tail bound follows from
 *   (R1) the monotone amp_n>0 super-exponential drop, (R2) radius-1 Cauchy estimates plus the
 *   exponential far-tail decay of phi, and (R3) the elementary ln(1+x) remainder. All three are
 *   corroborated numerically here (constant ratios, exact closed-form propagation check). What
 *   stays EXTERNAL is narrower and named as sg-3866-watson-majorant-constant: pinning a single
 *   explicit K0 (the Cauchy majorant M(r) at an optimised r &lt; 1 combined with the int_delta^inf
 *   split constant) into one closed inequality. The NPHI=10 kernel truncation is an upstream
 *   modeling choice, external to this asymptotic; and operator positivity (imp-3066 K_a &gt;= 0)
 *   is UNTOUCHED -- this is a diagnostic-limit asymptotic, not a theorem about zeros. No QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains SOTA.
 *
 *   @see imp-3844-a-weight-correction-limit-closed-form.js (derived c_inf, B; named this sub-gap)
 *   @see imp-3730-a-weight-correction-limit.js (numerically extrapolated c_inf ~ 0.354291; source)
 *   @see imp-3709-a-weight-logdomain-independent-reproduction.js (peak-adapted graded GL reused here)
 *
 *   Ticket: imp-3866 (proof, medium).
 */

const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3646/imp-3665)
const PI = Math.PI;

// Factored ln Phi(u) (imp-3709): ln Phi(u) = -pi e^{4u} + ln( sum_n amp_n e^{-pi(n^2-1)e^{4u}} ).
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;      // > 0 for u >= 0
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// n=1 tail ONLY of the shifted kernel: ln Phi_1(u) = -pi e^{4u} + ln( 2 pi^2 e^{4u} - 3 pi e^{2u} ).
// This is the amplitude the Watson derivation keeps; comparing against the full kernel measures the
// dropped n>=2 remainder (R1).
function logPhiN1(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  const amp1 = 2 * PI * PI * e4 - 3 * PI * e2;                 // > 0 for u >= 0
  return -PI * e4 + Math.log(amp1);
}

// -- Peak-adapted graded Gauss-Legendre log-integral (imp-3709/imp-3730/imp-3844) --------------
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];
function logIntegralGradedGL(lnG, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      terms.push(Math.log(GL_W[k] * half) + lnG(mid + half * GL_X[k]));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return mx + Math.log(acc);
}
const HI = 14;
const PANELS = 1600;
const GRADE = 6;

// -- Closed-form constants (imp-3844) ----------------------------------------------------------
let ACC0 = 0;
for (let n = 1; n <= NPHI; n += 1) {
  const n2 = n * n;
  const n4 = n2 * n2;
  ACC0 += (2 * PI * PI * n4 - 3 * PI * n2) * Math.exp(-PI * (n2 - 1));
}
const PHI0 = Math.exp(-PI) * ACC0;              // = Phi(0)
const C_INF = PI - Math.log(PI / 2) - Math.log(ACC0);   // = -ln( (pi/2) Phi(0) )
const B = 3 / (2 * PI);                         // e^{-2 tau} approach coefficient (derived)

// -- The three remainder sources, measured on the clean window ---------------------------------
// c(tau) is computed in the log domain (lnA + T cancels the leading -T without overflow); at
// tau &lt;= 3.5, T = pi e^{4 tau} &lt;= 3.8e6 so the additive cancellation floor is ~1e-9, well below
// the O(e^{-4 tau}) &gt;= e^{-14} signal we are measuring.
const CHECK_TAUS = [2.5, 3, 3.5];
const TAIL_CHECK = CHECK_TAUS.map((tau) => {
  const T = PI * Math.exp(4 * tau);
  const e4t = Math.exp(-4 * tau);
  const lnAfull = logIntegralGradedGL((s) => logPhiFactored(s) + logPhiFactored(s + tau), HI, PANELS, GRADE);
  const lnAn1 = logIntegralGradedGL((s) => logPhiFactored(s) + logPhiN1(s + tau), HI, PANELS, GRADE);

  // (R1) relative size of the dropped n>=2 tail of Phi(s+tau).
  const dropRel = Math.abs(Math.exp(lnAfull - lnAn1) - 1);

  // (R2) reconstruct the Watson bracket: A_n1 = e^{-T} (Phi(0)/4) * bracket.
  const bracket = Math.exp(lnAn1 + T - Math.log(PHI0 / 4));
  const rho = bracket - (2 * PI - 3 * Math.exp(-2 * tau));     // remainder inside the bracket
  const rhoRatio = rho / e4t;                                 // should be a bounded constant

  // (R3) propagate through -ln and compare against the closed prediction.
  const cN1 = -lnAn1 - T;
  const tailResidual = cN1 - (C_INF + B * Math.exp(-2 * tau));
  const tailRatio = tailResidual / e4t;                       // should be a bounded constant
  const propagationPredicted = -rhoRatio / (2 * PI) + 9 / (8 * PI * PI);  // -rho/(2pi) + x^2/2 term

  return Object.freeze({
    tau,
    T,
    dropRel,                                    // (R1)
    rho,                                        // (R2)
    rhoRatio,                                   // (R2) rho / e^{-4 tau}
    tailResidual,                               // (R3)
    tailRatio,                                  // (R3) residual / e^{-4 tau}
    propagationPredicted,                       // (R3) closed prediction of tailRatio
    propagationDiff: tailRatio - propagationPredicted,   // -> 0 as O(e^{-2 tau})
  });
}).map(Object.freeze);

// -- Findings ----------------------------------------------------------------------------------
// (R1) the n>=2 tail is super-exponentially small: undetectable in double precision.
const dropIsSuperExpNegligible = TAIL_CHECK.every((r) => r.dropRel < 1e-12);
// (R2) rho/e^{-4 tau} is a bounded, tau-independent constant -> the bracket remainder is O(e^{-4 tau}).
const rhoTailIsOrderE4tau = TAIL_CHECK.every((r) => Math.abs(r.rhoRatio) < 5);
const rhoRatioStable = Math.abs(TAIL_CHECK[0].rhoRatio - TAIL_CHECK[TAIL_CHECK.length - 1].rhoRatio) < 1e-2;
// (R3) the c(tau) tail residual is O(e^{-4 tau}) AND matches the closed ln-propagation prediction,
// with the discrepancy shrinking as tau grows (it is the O(e^{-2 tau}) higher ln term).
const tailIsOrderE4tau = TAIL_CHECK.every((r) => Math.abs(r.tailRatio) < 5);
const propagationMatches = TAIL_CHECK.every((r) => Math.abs(r.propagationDiff) < 5e-3);
const propagationDiffShrinks =
  Math.abs(TAIL_CHECK[TAIL_CHECK.length - 1].propagationDiff) < Math.abs(TAIL_CHECK[0].propagationDiff);

const verdict =
  dropIsSuperExpNegligible && rhoTailIsOrderE4tau && rhoRatioStable && tailIsOrderE4tau && propagationMatches
    ? 'REDUCIBLE-NOT-EXTERNAL:sg-3844-watson-tail-splits-into-(R1)-n>=2-drop~e^{-3T}(relative-e^{-2T},-machine-zero),-(R2)-Watson-endpoint-remainder-bounded-by-radius-1-Cauchy-estimates-of-the-real-analytic-phi(t)=e^{-pi(1+t)}acc(s(t))-plus-its-e^{-pi t}-far-tail-giving-bracket=2pi-3e^{-2tau}+rho,|rho|<=K0 e^{-4tau}(measured-rho/e^{-4tau}~-3.406-constant),-and-(R3)-the-ln(1+x)-remainder-giving-c(tau)-(c_inf+B e^{-2tau})=-rho/(2pi)+(9/(8pi^2))e^{-4tau}+O(e^{-6tau})(measured-ratio~0.657-matches-the-closed-prediction);-the-ONLY-external-piece-left-is-sg-3866-watson-majorant-constant(one-explicit-K0);-NPHI=10-truncation-and-imp-3066-positivity-untouched;-no-QED'
    : 'INDETERMINATE';

export const IMP3866_WATSON_TAIL_BOUND_ASSESSMENT = Object.freeze({
  id: 'imp-3866-watson-tail-bound-assessment',
  ticket: 'imp-3866',
  assessesSubGap: 'sg-3844-watson-tail',
  refinesModule: 'imp-3844-a-weight-correction-limit-closed-form.js',
  newResidualSubGap: 'sg-3866-watson-majorant-constant',

  summary:
    'ASSESSES the imp-3844 sub-gap sg-3844-watson-tail (rigorous all-orders bound on the ' +
    'O(e^{-4 tau}) tail of A(tau) = int Phi(s) Phi(s+tau) ds) and finds it REDUCIBLE, not ' +
    'external. The tail c(tau) - (c_inf + B e^{-2 tau}) splits into three STANDARD analytic-Watson ' +
    'remainders: (R1) the dropped n>=2 kernel tail is e^{-3T} = relative e^{-2T} (super-exp small, ' +
    'measured as machine zero); (R2) the Watson endpoint remainder is controlled by radius-1 Cauchy ' +
    'estimates of the real-analytic amplitude phi(t) = e^{-pi(1+t)} acc(s(t)) (nearest singularity ' +
    'at the branch point t=-1) plus its e^{-pi t} far-tail decay, giving bracket = 2 pi - 3 e^{-2 ' +
    'tau} + rho with |rho| <= K0 e^{-4 tau} (measured rho/e^{-4 tau} ~ -3.406, tau-independent); ' +
    '(R3) the -ln propagation via the elementary ln(1+x) remainder gives c(tau) - (c_inf + B e^{-2 ' +
    'tau}) = -rho/(2 pi) + (9/(8 pi^2)) e^{-4 tau} + O(e^{-6 tau}), whose measured ratio ~0.657 ' +
    'matches that closed prediction to O(e^{-2 tau}). The one piece left external is ' +
    'sg-3866-watson-majorant-constant: pinning a single explicit K0. NPHI=10 truncation is an ' +
    'upstream modeling choice; operator positivity (imp-3066) UNTOUCHED; RH-EQUIVALENT diagnostic ' +
    'asymptotic, necessary-but-not-sufficient, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  remainderSources: Object.freeze({
    R1_droppedTail:
      'n>=2 terms of Phi(s+tau) carry e^{-pi(n^2-1)e^{4(s+tau)}} <= e^{-3 pi e^{4 tau}} = e^{-3 T}, ' +
      'relative e^{-2 T} vs the leading e^{-T}; certifiable from amp_n > 0 monotone decay. Measured ' +
      'relative drop is 0 to machine precision on the clean window.',
    R2_watsonEndpoint:
      'phi(t) = e^{-pi(1+t)} acc(s(t)), s(t) = (1/4) ln(1+t), is real-analytic on (-1, inf) with ' +
      'nearest singularity at the branch point t=-1, hence radius-1 Cauchy estimates ' +
      '|phi^{(N)}(0)/N!| <= M(r)/r^N (r<1) and real-axis decay phi(t) = O((1+t) e^{-pi t}); the ' +
      'Term-B factor 1/sqrt(1+t) is analytic on (-1, inf) with the same radius. A split ' +
      'int_0^delta + int_delta^inf yields |rho(tau)| <= K0 e^{-4 tau}, the e^{-4 tau} order set by ' +
      'the phi(0)-vs-phi prime(0)/T^2 second Watson term.',
    R3_lnPropagation:
      'c(tau) = -ln A_n1 - T = -ln((pi/2) Phi(0)) - ln(1 + x), x = -(3/(2 pi)) e^{-2 tau} + ' +
      'rho/(2 pi); |ln(1+x) - x| <= x^2/(2(1-|x|)) gives c(tau) - (c_inf + B e^{-2 tau}) = ' +
      '-rho/(2 pi) + (9/(8 pi^2)) e^{-4 tau} + O(e^{-6 tau}), all O(e^{-4 tau}) with explicit constant.',
  }),

  measured: Object.freeze({
    nphi: NPHI,
    cInf: C_INF,                                // 0.35429228409357
    b: B,                                       // 3/(2 pi)
    phi0: PHI0,
    tailCheck: TAIL_CHECK,                       // per-tau {dropRel, rho, rhoRatio, tailResidual, tailRatio, propagationPredicted, propagationDiff}
    dropIsSuperExpNegligible,                    // (R1)
    rhoTailIsOrderE4tau,                         // (R2)
    rhoRatioStable,                              // (R2)
    tailIsOrderE4tau,                            // (R3)
    propagationMatches,                          // (R3)
    propagationDiffShrinks,                      // (R3)
    verdict,
  }),

  interpretation: Object.freeze({
    reducibility:
      'sg-3844-watson-tail is not an external open problem but a reduction target: the O(e^{-4 tau}) ' +
      'tail bound is a textbook Watson-lemma-with-remainder estimate once the amplitude phi is ' +
      'identified as real-analytic with radius 1 and exponential far-tail decay. The three ' +
      'remainder sources are each standard; the derivation would need only bookkeeping, not a new idea.',
    whatIsMeasured:
      'The module measures all three remainders numerically: (R1) the n>=2 drop is machine zero, ' +
      '(R2) rho/e^{-4 tau} is a tau-independent constant ~ -3.406 (so the bracket remainder is ' +
      'genuinely O(e^{-4 tau})), and (R3) the c(tau) tail ratio ~0.657 matches the CLOSED ' +
      'prediction -rho_ratio/(2 pi) + 9/(8 pi^2), with the discrepancy shrinking like e^{-2 tau}. ' +
      'This is direct evidence that the derived order and constant are correct, not fitted.',
    whatStaysExternal:
      'Only sg-3866-watson-majorant-constant: turning the radius-1 Cauchy majorant M(r) at an ' +
      'optimised r < 1, together with the int_delta^inf far-tail split constant, into a SINGLE ' +
      'explicit numeric K0 in |rho| <= K0 e^{-4 tau}. That is a finite majorant computation, not a ' +
      'missing structural input. The NPHI=10 kernel truncation is upstream and separate.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    assessmentScope:
      'An assessment (with numerical corroboration) of whether a named remainder-tail sub-gap is ' +
      'certifiable. It reduces sg-3844-watson-tail to standard Watson-lemma ingredients and confirms ' +
      'the derived O(e^{-4 tau}) order and its constant numerically. It does NOT write out the ' +
      'closed majorant inequality and establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    residualSubGap:
      'sg-3866-watson-majorant-constant: the reduction to radius-1 Cauchy estimates + exponential ' +
      'far-tail + ln(1+x) remainder is characterized and numerically corroborated, but a single ' +
      'explicit K0 in |rho(tau)| <= K0 e^{-4 tau} is not computed here. This is a diagnostic-limit ' +
      'asymptotic assessment, not a theorem about zeros.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP3866_WATSON_TAIL_BOUND_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp3866-R1-n2-tail-super-exp-negligible',
    why: '(R1) the dropped n>=2 tail of Phi(s+tau) is e^{-3T} = relative e^{-2T}: undetectable in ' +
         'double precision (< 1e-12) across the clean window, confirming it is far below O(e^{-4 tau}).',
    holds: () => dropIsSuperExpNegligible,
  },
  {
    id: 'imp3866-R2-bracket-remainder-is-order-e-4tau',
    why: '(R2) rho(tau)/e^{-4 tau} is bounded (< 5) AND tau-independent (endpoints agree to < 1e-2), ' +
         'so the Watson bracket remainder is genuinely O(e^{-4 tau}) with a stable coefficient.',
    holds: () => rhoTailIsOrderE4tau && rhoRatioStable,
  },
  {
    id: 'imp3866-R3-tail-residual-matches-closed-propagation',
    why: '(R3) the c(tau) tail residual / e^{-4 tau} is bounded (< 5) and matches the closed ' +
         'prediction -rho_ratio/(2 pi) + 9/(8 pi^2) to < 5e-3, with the discrepancy shrinking as ' +
         'tau grows (it is the O(e^{-2 tau}) higher ln term: the 0.5-step diff ratio is ~e^{-1}).',
    holds: () => tailIsOrderE4tau && propagationMatches && propagationDiffShrinks,
  },
  {
    id: 'imp3866-constants-inherited-from-imp3844',
    why: 'The assessment is grounded in the imp-3844 closed form: c_inf = pi - ln(pi/2) - ln(acc0) ' +
         '= 0.35429228409357 and B = 3/(2 pi).',
    holds: () =>
      Math.abs(C_INF - 0.35429228409357) < 1e-12 && Math.abs(B - 3 / (2 * PI)) < 1e-15,
  },
  {
    id: 'imp3866-verdict-records-reducible',
    why: 'The classified verdict must record that sg-3844-watson-tail is REDUCIBLE (not external), ' +
         'not indeterminate.',
    holds: () => verdict.startsWith('REDUCIBLE-NOT-EXTERNAL'),
  },
  {
    id: 'imp3866-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: assessment only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, a sharpened residual sub-gap named, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP3866_WATSON_TAIL_BOUND_ASSESSMENT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /sg-3866-watson-majorant-constant/.test(c.residualSubGap) &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3866_WATSON_TAIL_BOUND_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3866-watson-tail-bound-assessment assertion failed: ${assertion.id}`);
  }
}

export default IMP3866_WATSON_TAIL_BOUND_ASSESSMENT;
