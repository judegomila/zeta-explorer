/**
 * @module imp-3690-a-weight-superexp-subleading-correction
 * @fileoverview imp-3690 -- MEASURE and DERIVE the SUBLEADING term of the
 *   super-exponential A-weight decay that imp-3665 confirmed at leading order:
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds  ~  exp(-pi e^{4 tau}).
 *
 *   WHAT imp-3665 LEFT OPEN
 *   -----------------------
 *   imp-3665 confirmed -ln A(tau)/(pi e^{4 tau}) -> 1 from ABOVE (1.0266 at
 *   tau=0.5 down to 0.99976 at tau=2) and NOTED, without quantifying, a positive
 *   subleading correction that shrinks relative to the leading pi e^{4 tau} term.
 *   This module pins that correction. Define the residual
 *       r(tau) := -ln A(tau) - pi e^{4 tau}
 *   and DERIVE plus MEASURE its functional form.
 *
 *   THE PRECISION HAZARD imp-3665 COULD NOT BEAT (and how it is beaten here)
 *   ----------------------------------------------------------------------
 *   r(tau) is an O(1) quantity sitting on top of -ln A(tau) ~ pi e^{4 tau}, which
 *   is ~171 at tau=1 and ~9365 at tau=2. imp-3665 formed -ln A on a UNIFORM
 *   Simpson grid on [0,12]; the integrand Phi(s)Phi(s+tau) concentrates in a
 *   spike of width ~1/(4 pi e^{4 tau}) near s=0 (~0.006 at tau=1, ~5e-5 at tau=2),
 *   so a uniform grid under-resolves the spike and leaves a relative error of
 *   ~1e-3 in -ln A. That is ~0.17 at tau=1 and ~9 at tau=2 -- LARGER than r
 *   itself past tau~1.5. So imp-3665 read a residual of -0.29 at tau=1.5 and
 *   -2.24 at tau=2: those two rungs were GRID-NOISE, not the true residual.
 *
 *   The cure is an exact change of variables that linearizes the dominant
 *   exponent and moves the spike to a fixed, well-resolved e^{-x} profile. Put
 *       x = pi e^{4 tau} (e^{4 s} - 1),   so   pi e^{4 tau} e^{4 s} = pi e^{4 tau} + x,
 *       s(x) = (1/4) ln(1 + x/(pi e^{4 tau})),   ds = dx / (4 (pi e^{4 tau} + x)).
 *   For u = s + tau one has e^{4 u} = (pi e^{4 tau} + x)/pi and
 *   exp(-pi n^2 e^{4 u}) = exp(-n^2 (pi e^{4 tau} + x)). Factoring the leading
 *   n=1 exponent e^{-pi e^{4 tau}} out of Phi(s+tau) gives
 *       A(tau) = e^{-pi e^{4 tau}} int_0^inf G(x) dx,
 *       G(x) = Phi(s(x)) * Q(x) / (4 (pi e^{4 tau} + x)),
 *       Q(x) = sum_n [2 pi^2 n^4 e^{4 u} - 3 pi n^2 e^{2 u}]
 *                       exp(-(n^2 - 1) pi e^{4 tau} - n^2 x).
 *   Then, WITHOUT any cancellation,
 *       r(tau) = -ln A(tau) - pi e^{4 tau} = -ln int_0^inf G(x) dx.
 *   G(x) is O(1) with an e^{-x} tail, so a modest Simpson grid in x returns r(tau)
 *   to ~1e-13 at EVERY tau (verified by grid/cutoff doubling), instead of the
 *   ~1e-3-relative-on-9365 wall the uniform-s grid hit.
 *
 *   THE DERIVED SUBLEADING TERM (endpoint-Laplace at s=0)
 *   ----------------------------------------------------
 *   As tau -> inf the x-integral concentrates on x = O(1) with s(x) -> 0, so
 *   Phi(s(x)) -> Phi(0), e^{4 u} -> e^{4 tau}, and the n=1 term dominates:
 *       G(x) -> Phi(0) * (2 pi^2 e^{4 tau}) e^{-x} / (4 pi e^{4 tau})
 *             = Phi(0) (pi/2) e^{-x},
 *   whence int G dx -> (pi/2) Phi(0) and
 *       r(tau) -> C_inf := -ln( (pi/2) Phi(0) ),   Phi(0) = sum_n (2 pi^2 n^4 - 3 pi n^2) e^{-pi n^2}.
 *   The LEADING correction to C_inf comes solely from the -3 pi n^2 e^{2 u}
 *   sub-term of Q (the 2 pi^2 e^{4 u} x-dependence, the 1/(pi e^{4 tau}+x) factor,
 *   and the Phi(s(x)) expansion are all O(e^{-4 tau})): the multiplicative factor
 *   [1 - (3/(2 pi)) e^{-2 u}] -> [1 - (3/(2 pi)) e^{-2 tau}] gives
 *       r(tau) = C_inf + (3/(2 pi)) e^{-2 tau} + O(e^{-4 tau}).
 *   So the second term of the super-exponential expansion of -ln A is the CONSTANT
 *   C_inf, approached by a positive e^{-2 tau} correction with coefficient 3/(2 pi).
 *
 *   MEASURED (self-computing; x-domain Simpson, XMAX=90, M=200000)
 *   -------------------------------------------------------------
 *       tau    r(tau)=-ln A - pi e^{4 tau}    (r - C_inf) e^{2 tau}   [ -> 3/(2 pi) = 0.477465 ]
 *       0.5    0.6168760                      0.713777
 *       1.0    0.4308474                      0.565670
 *       1.5    0.3796876                      0.510078
 *       2.0    0.3632575                      0.489485
 *       2.5    0.3575392                      0.481890
 *       3.0    0.3554798                      0.479093
 *   r(tau) descends monotonically to C_inf = 0.3542923 and (r - C_inf) e^{2 tau}
 *   descends monotonically to 3/(2 pi) = 0.4774648 from above -- both the constant
 *   AND the e^{-2 tau} coefficient are confirmed. The two-term ansatz
 *   C_inf + (3/(2 pi)) e^{-2 tau} matches the measured r(tau) to 2.2e-4 at tau=2,
 *   3.0e-5 at tau=2.5, 4.0e-6 at tau=3 -- a residual-of-ansatz that shrinks by a
 *   factor ~7.4 ~ e^{2} per Delta tau=0.5, confirming the O(e^{-4 tau}) next term.
 *
 *   CROSS-CHECK vs imp-3665: at tau=0.5 imp-3665 read -ln A - pi e^2 = 0.6169
 *   (matches r(0.5)=0.61688) and at tau=1 read 0.4297 (matches r(1)=0.4308 to
 *   its coarse-grid accuracy). At tau=2 imp-3665 read -2.24 -- this module shows
 *   the TRUE residual is +0.3633; the imp-3665 large-tau residual was the
 *   ~1e-3-relative uniform-grid error on -ln A ~ 9365, not the subleading term.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This pins the
 *   second term of a fixed autocorrelation-weight expansion used inside a
 *   mass-feasibility diagnostic; it establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED.
 *   No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3665-a-weight-superexp-decay-crosscheck.js (the leading-order confirmation this extends)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the decay claim under study)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the closed C_n/D_n and bias law)
 *
 *   Ticket: imp-3690 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3646/imp-3665)
const PI = Math.PI;

/**
 * de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI.
 * Phi(u) = sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u}).
 * Phi(u) > 0 for u >= 0 (n=1 amplitude pi e^{2u}(2 pi e^{2u} - 3) > 0).
 */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2) * Math.exp(-PI * n2 * e4);
  }
  return s;
}

/**
 * The residual r(tau) = -ln A(tau) - pi e^{4 tau}, evaluated with NO cancellation
 * via the x = pi e^{4 tau}(e^{4 s} - 1) substitution:
 *     r(tau) = -ln int_0^XMAX G(x) dx,
 *     G(x) = Phi(s(x)) Q(x) / (4 (pi e^{4 tau} + x)),
 *     Q(x) = sum_n [2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}] exp(-(n^2-1) pi e^{4 tau} - n^2 x).
 * G is O(1) with an e^{-x} tail; a uniform composite Simpson in x converges to
 * ~1e-13 (checked by XMAX/M doubling), so r(tau) is exact to double precision.
 */
const XMAX = 90;                                // e^{-90} ~ 1.8e-39: no truncation
const XGRID = 200000;                           // Simpson subintervals in x (even)

function residualR(tau) {
  const pe4 = PI * Math.exp(4 * tau);           // pi e^{4 tau}
  const gAt = (x) => {
    const base = pe4 + x;                        // pi e^{4 tau} e^{4 s}
    const e4u = base / PI;                       // e^{4 u},  u = s + tau
    const e2u = Math.sqrt(e4u);                  // e^{2 u}
    const s = 0.25 * Math.log1p(x / pe4);        // s(x) = (1/4) ln(1 + x/(pi e^{4 tau}))
    let q = 0;
    for (let n = 1; n <= NPHI; n += 1) {
      const n2 = n * n;
      const n4 = n2 * n2;
      const amp = 2 * PI * PI * n4 * e4u - 3 * PI * n2 * e2u;
      q += amp * Math.exp(-(n2 - 1) * pe4 - n2 * x);
    }
    return (phiKernel(s) * q) / (4 * base);
  };
  const m = XGRID % 2 === 0 ? XGRID : XGRID + 1;
  const h = XMAX / m;
  let sum = gAt(0) + gAt(XMAX);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * gAt(i * h);
  }
  const integral = (sum * h) / 3;
  return -Math.log(integral);                    // = -ln A(tau) - pi e^{4 tau}
}

// -- The DERIVED subleading constants -------------------------------------------------
const PHI0 = phiKernel(0);                       // Phi(0) = sum_n (2 pi^2 n^4 - 3 pi n^2) e^{-pi n^2}
const C_INF = -Math.log((PI / 2) * PHI0);        // r(tau) -> C_inf = -ln(pi Phi(0)/2)
const C1 = 3 / (2 * PI);                         // leading e^{-2 tau} coefficient (from -3 pi n^2 e^{2u})

// -- The measured residual ladder -----------------------------------------------------
const TAUS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];

const RUNGS = TAUS.map((tau) => {
  const r = residualR(tau);
  const d = r - C_INF;                           // r - C_inf  ~  C1 e^{-2 tau}
  const ansatz = C_INF + C1 * Math.exp(-2 * tau);
  return Object.freeze({
    tau,
    residual: r,                                 // r(tau) = -ln A - pi e^{4 tau}
    minusCinf: d,                                // r - C_inf (the decaying part)
    coeffMeasured: d * Math.exp(2 * tau),        // (r - C_inf) e^{2 tau}  -> 3/(2 pi)
    twoTermAnsatz: ansatz,                        // C_inf + (3/(2 pi)) e^{-2 tau}
    ansatzResidual: Math.abs(r - ansatz),        // |r - ansatz|  ~  O(e^{-4 tau})
  });
});

// -- Diagnostics ----------------------------------------------------------------------
function strictlyDecreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (!(vals[i] < vals[i - 1])) return false;
  return true;
}

const RESIDUALS = RUNGS.map((r) => r.residual);
const COEFFS = RUNGS.map((r) => r.coeffMeasured);
const ANSATZ_RES = RUNGS.map((r) => r.ansatzResidual);
const LAST = RUNGS[RUNGS.length - 1];            // tau = 3

// r(tau) descends monotonically toward the constant C_inf, staying above it.
const residualDecreasesToCinf =
  strictlyDecreasing(RESIDUALS) &&
  RESIDUALS.every((r) => r > C_INF) &&
  Math.abs(LAST.residual - C_INF) < 2e-3;

// (r - C_inf) e^{2 tau} descends monotonically to 3/(2 pi) from above: the e^{-2 tau}
// law AND its coefficient 3/(2 pi) are confirmed.
const coeffConvergesToThreeOverTwoPi =
  strictlyDecreasing(COEFFS) &&
  COEFFS.every((c) => c > C1) &&
  Math.abs(LAST.coeffMeasured - C1) < 2e-3;

// The two-term ansatz C_inf + (3/(2 pi)) e^{-2 tau} matches r(tau) with a residual
// that shrinks like e^{-4 tau} (factor ~7.4 ~ e^2 per Delta tau = 0.5) and is < 1e-5 at tau=3.
const ansatzResidualShrinks =
  strictlyDecreasing(ANSATZ_RES) &&
  LAST.ansatzResidual < 1e-5;

// The next-order e^{-4 tau} scaling: the ansatz-residual ratio over Delta tau=0.5 is ~e^2.
const q20 = RUNGS.find((r) => r.tau === 2.0);
const q25 = RUNGS.find((r) => r.tau === 2.5);
const q30 = RUNGS.find((r) => r.tau === 3.0);
const nextTermIsE4tau =
  Math.abs(q20.ansatzResidual / q25.ansatzResidual - Math.exp(2)) < 1.0 &&
  Math.abs(q25.ansatzResidual / q30.ansatzResidual - Math.exp(2)) < 1.0;

// Cross-check vs imp-3665: at tau=0.5 and tau=1 the imp-3665 uniform-grid residual
// is recovered; at tau=2 imp-3665 read a grid-noise -2.24 where the TRUE r(2) is +0.36.
const q05 = RUNGS.find((r) => r.tau === 0.5);
const q10 = RUNGS.find((r) => r.tau === 1.0);
const matchesImp3665Small =
  Math.abs(q05.residual - 0.6169) < 1e-3 &&        // imp-3665: -ln A(0.5) - pi e^2 = 0.6169
  Math.abs(q10.residual - 0.4297) < 3e-3;          // imp-3665: -ln A(1) - pi e^4 = 0.4297 (coarse grid)
const imp3665LargeTauWasGridNoise = q20.residual > 0 && q20.residual < 0.5; // NOT the -2.24 imp-3665 read

// C_inf identity: -ln(pi Phi(0)/2) with Phi(0) ~ 0.44670 gives ~0.35429.
const cinfConsistent =
  Math.abs(PHI0 - 0.4466969) < 1e-6 && Math.abs(C_INF - 0.3542923) < 1e-6;

const verdict =
  residualDecreasesToCinf &&
  coeffConvergesToThreeOverTwoPi &&
  ansatzResidualShrinks &&
  nextTermIsE4tau &&
  matchesImp3665Small &&
  imp3665LargeTauWasGridNoise &&
  cinfConsistent
    ? 'A-WEIGHT-SUBLEADING-PINNED:r(tau)=-ln A-pi e^{4 tau}->C_inf=-ln(pi Phi(0)/2)=0.3542923,CORRECTION=(3/(2 pi)) e^{-2 tau}+O(e^{-4 tau});imp-3665 large-tau residual was uniform-grid noise'
    : 'INDETERMINATE';

export const IMP3690_A_WEIGHT_SUPEREXP_SUBLEADING_CORRECTION = Object.freeze({
  id: 'imp-3690-a-weight-superexp-subleading-correction',
  ticket: 'imp-3690',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsConfirmation: 'imp-3665-a-weight-superexp-decay-crosscheck.js',
  claimUnderStudy: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',

  summary:
    'MEASURES and DERIVES the subleading term of the imp-3665-confirmed super-exponential A-weight decay A(tau) = ' +
    'int Phi(s)Phi(s+tau) ds ~ exp(-pi e^{4 tau}). Defines the residual r(tau) = -ln A(tau) - pi e^{4 tau} and pins it. ' +
    'The key move is the exact substitution x = pi e^{4 tau}(e^{4 s}-1), which reduces r(tau) to -ln int_0^inf G(x) dx ' +
    'with NO cancellation (G is O(1), e^{-x} tail), so r is exact to ~1e-13 -- beating the ~1e-3-relative uniform-grid ' +
    'wall imp-3665 hit on -ln A ~ 9365. RESULT: r(tau) -> C_inf = -ln(pi Phi(0)/2) = 0.3542923 (a CONSTANT), with leading ' +
    'correction (3/(2 pi)) e^{-2 tau} (from the -3 pi n^2 e^{2u} sub-term) and next term O(e^{-4 tau}). Measured: r descends ' +
    '0.61688 -> 0.35548 to C_inf and (r-C_inf) e^{2 tau} descends 0.7138 -> 0.4791 to 3/(2 pi)=0.4774648 from above; the ' +
    'two-term ansatz matches r to 4e-6 at tau=3 with an e^{-4 tau}-shrinking residual. Recovers the imp-3665 tau=0.5,1 ' +
    'residuals (0.6169, 0.4297) and shows its tau=2 read of -2.24 was uniform-grid noise (true r(2)=+0.3633). ' +
    'MEASUREMENT/DERIVATION, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no QED.',

  method: Object.freeze({
    residual: 'r(tau) = -ln A(tau) - pi e^{4 tau}, the second term of the super-exp expansion of -ln A',
    substitution: 'x = pi e^{4 tau}(e^{4 s}-1) => s(x)=(1/4)ln(1+x/(pi e^{4 tau})), ds=dx/(4(pi e^{4 tau}+x)), e^{4u}=(pi e^{4 tau}+x)/pi',
    noCancellation: 'r(tau) = -ln int_0^XMAX G(x) dx, G(x)=Phi(s(x)) Q(x)/(4(pi e^{4 tau}+x)); G is O(1) with e^{-x} tail',
    kernelFactor: 'Q(x) = sum_n [2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}] exp(-(n^2-1) pi e^{4 tau} - n^2 x), the e^{-pi e^{4 tau}}-factored Phi(s+tau)',
    grid: 'uniform composite Simpson in x, XMAX=90, M=200000; converges to ~1e-13 by XMAX/M doubling',
    derivation: 'endpoint-Laplace at s=0: G(x) -> Phi(0)(pi/2) e^{-x} => C_inf = -ln(pi Phi(0)/2); -3 pi n^2 e^{2u} sub-term => (3/(2 pi)) e^{-2 tau}',
    selfComputing: true,
  }),

  derived: Object.freeze({
    phi0: PHI0,                                  // Phi(0) = sum_n (2 pi^2 n^4 - 3 pi n^2) e^{-pi n^2} ~ 0.4466969
    cInf: C_INF,                                 // -ln(pi Phi(0)/2) ~ 0.3542923 (the constant subleading term)
    cInfClosedForm: 'C_inf = -ln( (pi/2) sum_{n>=1} (2 pi^2 n^4 - 3 pi n^2) e^{-pi n^2} )',
    correctionCoeff: C1,                         // 3/(2 pi) ~ 0.4774648 (leading e^{-2 tau} coefficient)
    expansion: '-ln A(tau) = pi e^{4 tau} + C_inf + (3/(2 pi)) e^{-2 tau} + O(e^{-4 tau})',
  }),

  measured: Object.freeze({
    xCutoff: XMAX,
    gridSubintervals: XGRID,
    rungs: RUNGS,
    residualFirst: RESIDUALS[0],                 // r(0.5) ~ 0.61688
    residualLast: LAST.residual,                 // r(3.0) ~ 0.35548
    coeffFirst: COEFFS[0],                        // (r-C_inf) e^{2 tau} at tau=0.5 ~ 0.7138
    coeffLast: LAST.coeffMeasured,                // at tau=3 ~ 0.4791 -> 3/(2 pi)
    ansatzResidualLast: LAST.ansatzResidual,      // |r - two-term| at tau=3 ~ 4e-6
    residualDecreasesToCinf,
    coeffConvergesToThreeOverTwoPi,
    ansatzResidualShrinks,
    nextTermIsE4tau,
    matchesImp3665Small,
    imp3665LargeTauWasGridNoise,
    cinfConsistent,
    verdict,
  }),

  interpretation: Object.freeze({
    subleadingIsConstant:
      'The subleading term of -ln A(tau) is the CONSTANT C_inf = -ln(pi Phi(0)/2) ~ 0.3542923: after subtracting the ' +
      'leading pi e^{4 tau}, r(tau) does NOT keep growing but settles to C_inf. This is exactly the "positive correction ' +
      'that shrinks relative to the leading term" imp-3665 observed but did not quantify.',
    correctionLaw:
      'The approach to C_inf is a positive e^{-2 tau} correction with coefficient 3/(2 pi): (r(tau)-C_inf) e^{2 tau} ' +
      'descends monotonically to 0.4774648 from above (0.7138 at tau=0.5 -> 0.4791 at tau=3). The e^{-2 tau} rate and ' +
      'the 3/(2 pi) coefficient both come from the -3 pi n^2 e^{2u} sub-term of the kernel amplitude; the next term is ' +
      'O(e^{-4 tau}), confirmed by the ansatz-residual shrinking by ~e^2 per Delta tau=0.5.',
    imp3665GridNoise:
      'imp-3665 read -ln A - pi e^{4 tau} = -0.29 at tau=1.5 and -2.24 at tau=2. Those were the ~1e-3-relative uniform-' +
      'grid error on -ln A ~ 1267 and ~9365, not the residual: the true r(1.5)=+0.3797 and r(2)=+0.3633. The x-domain ' +
      'substitution removes the spike-under-resolution that produced the spurious negative readings, while reproducing ' +
      'the imp-3665 small-tau residuals (0.6169 at tau=0.5, 0.4297 at tau=1) where its grid was still adequate.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Pins the second (constant) term and the leading e^{-2 tau} correction of a fixed autocorrelation-weight ' +
      'expansion, a premise used inside a mass-feasibility diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------
export const IMP3690_A_WEIGHT_SUPEREXP_SUBLEADING_CORRECTION_ASSERTIONS = [
  {
    id: 'imp3690-residual-descends-to-constant-Cinf',
    why: 'THE CORE RESULT: r(tau) = -ln A(tau) - pi e^{4 tau} descends monotonically toward the CONSTANT ' +
         'C_inf = -ln(pi Phi(0)/2) ~ 0.3542923 (staying above it), so the subleading term of -ln A is a constant.',
    holds: () => residualDecreasesToCinf,
  },
  {
    id: 'imp3690-correction-coeff-is-three-over-two-pi',
    why: 'The approach to C_inf obeys r(tau) - C_inf ~ (3/(2 pi)) e^{-2 tau}: (r-C_inf) e^{2 tau} descends monotonically ' +
         'to 3/(2 pi) = 0.4774648 from above, pinning both the e^{-2 tau} rate and its coefficient.',
    holds: () => coeffConvergesToThreeOverTwoPi,
  },
  {
    id: 'imp3690-two-term-ansatz-matches-with-e4tau-remainder',
    why: 'The derived two-term ansatz C_inf + (3/(2 pi)) e^{-2 tau} matches the measured r(tau) with a residual that ' +
         'shrinks like e^{-4 tau} (factor ~e^2 per Delta tau=0.5) and is < 1e-5 at tau=3, fixing the next term as O(e^{-4 tau}).',
    holds: () => ansatzResidualShrinks && nextTermIsE4tau,
  },
  {
    id: 'imp3690-Cinf-closed-form-consistent',
    why: 'C_inf = -ln(pi Phi(0)/2) with Phi(0) = sum_n (2 pi^2 n^4 - 3 pi n^2) e^{-pi n^2} ~ 0.4466969 evaluates to ' +
         '~0.3542923, the measured large-tau limit of the residual.',
    holds: () => cinfConsistent,
  },
  {
    id: 'imp3690-recovers-imp3665-small-tau-residuals',
    why: 'The x-domain residual reproduces the imp-3665 uniform-grid residuals where that grid was adequate: ' +
         'r(0.5) ~ 0.6169 and r(1) ~ 0.4297.',
    holds: () => matchesImp3665Small,
  },
  {
    id: 'imp3690-imp3665-large-tau-was-grid-noise',
    why: 'imp-3665 read -ln A - pi e^{4 tau} = -2.24 at tau=2 (uniform-grid noise on -ln A ~ 9365). The cancellation-free ' +
         'x-domain value is the true positive residual r(2) in (0, 0.5), not a negative number.',
    holds: () => imp3665LargeTauWasGridNoise,
  },
  {
    id: 'imp3690-verdict-pins-subleading-term',
    why: 'The classified verdict must record that the subleading term is the constant C_inf with a (3/(2 pi)) e^{-2 tau} ' +
         'correction, and that the imp-3665 large-tau residual was grid noise -- not indeterminate.',
    holds: () =>
      verdict ===
      'A-WEIGHT-SUBLEADING-PINNED:r(tau)=-ln A-pi e^{4 tau}->C_inf=-ln(pi Phi(0)/2)=0.3542923,CORRECTION=(3/(2 pi)) e^{-2 tau}+O(e^{-4 tau});imp-3665 large-tau residual was uniform-grid noise',
  },
  {
    id: 'imp3690-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/derivation only, mass-feasibility necessary-but-not-sufficient, operator ' +
         'positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3690_A_WEIGHT_SUPEREXP_SUBLEADING_CORRECTION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3690_A_WEIGHT_SUPEREXP_SUBLEADING_CORRECTION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3690-a-weight-superexp-subleading-correction assertion failed: ${assertion.id}`);
  }
}

export default IMP3690_A_WEIGHT_SUPEREXP_SUBLEADING_CORRECTION;
