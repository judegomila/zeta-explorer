/**
 * @module imp-3873-a-weight-offline-literal-independent-reproduction
 * @fileoverview imp-3873 -- CLOSE the offline-verified-literal provenance gap in imp-3850.
 *
 *   imp-3850 extended the imp-3736 two-path (uniform log-Simpson vs graded Gauss-Legendre)
 *   -ln A(tau) reconciliation to tau in {2.5, 3.0}, but its uniform-Simpson anchors at those
 *   tau are OFFLINE-VERIFIED LITERALS baked into the module, not self-computing at import:
 *       tau=2.5 -> n=2.56e7:  -ln A = 69198.54066317427   (offline literal)
 *       tau=3.0 -> n=2.048e8: -ln A = 511309.61253717536  (offline literal)
 *   The near-s=0 peak width ~1/(4 pi e^{4 tau}) collapses to ~5e-6 (2.5) / ~6e-7 (3.0), so a
 *   UNIFORM mesh on [0,12] must be pushed to n=2.56e7 / 2.048e8 to seat enough nodes under the
 *   peak -- far too expensive to self-compute at import. That is why imp-3850 recorded them as
 *   documented constants and flagged the provenance gap in its honestCaveat.offlineRungProvenance.
 *
 *   THIS MODULE closes that gap with a THIRD, structurally INDEPENDENT quadrature that is cheap
 *   enough to self-compute at import and lands on the SAME limit.
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel
 *
 *   THE INDEPENDENT REFINEMENT SCHEDULE (peak-scaled substitution Simpson)
 *   ---------------------------------------------------------------------
 *   The integrand g(s)=Phi(s)Phi(s+tau) decays at rate d/ds ln g|_{s=0} = -4 pi (1 + e^{4 tau})
 *   ~ -4 pi e^{4 tau}, i.e. a characteristic width sigma = 1/(4 pi e^{4 tau}). Substitute
 *       s = sigma * x,   ds = sigma dx  =>  A(tau) = sigma * int_0^{Xmax} g(sigma x) dx
 *   so the peak becomes O(1)-wide in x and a UNIFORM Simpson mesh in x resolves it with only a
 *   few thousand nodes. This is independent of BOTH imp-3850 paths: it is neither the graded-GL
 *   power-panel rule (Path 1) nor the uniform-[0,12] mesh (Path 2) -- it is a uniform mesh in a
 *   DIFFERENT variable, with nodes placed by the analytic peak scale rather than by grid density.
 *   Everything self-computes at import (max <= 8000 nodes); no offline literal is trusted.
 *
 *   MEASURED (all self-computing at import)
 *   ---------------------------------------
 *   The substitution-Simpson climbs MONOTONICALLY from below onto the graded-GL limit:
 *       tau=2.5 (Xmax=40):  n=500 gap -2.3e-7 -> n=1000 -1.4e-8 -> n=2000 -9.0e-10 -> n=8000 -1.5e-11
 *       tau=3.0 (Xmax=40):  n=500 gap -2.3e-7 -> n=1000 -1.4e-8 -> n=2000 -8.1e-10 -> n=8000  0
 *   Converged (n=8000, Xmax=40) it agrees with the graded-GL limit to < 1e-9 absolute:
 *       tau    substitution-Simpson    graded-GL limit        imp-3850 offline Simpson literal
 *       2.5    69198.540665            69198.540665           69198.54066317 (n=2.56e7)
 *       3.0    511309.612538           511309.612538          511309.61253717 (n=2.048e8)
 *   and sits within the imp-3850-documented ~1e-6 absolute of the offline uniform-Simpson literal
 *   (1.6e-6 at 2.5, 1.1e-6 at 3.0). Domain-invariance: Xmax in {40,80,120} converge to the SAME
 *   value at n=8000 (spread < 1e-9), so the x-cutoff is not a truncation artifact.
 *
 *   VERDICT
 *   -------
 *   A structurally independent, self-computing quadrature reproduces the imp-3850 graded-GL limits
 *   -ln A(2.5)=69198.540665 and -ln A(3.0)=511309.612538 to < 1e-9, and reproduces the imp-3850
 *   OFFLINE uniform-Simpson literals to within their documented ~1e-6 / ~1e-11 residual. The offline
 *   n=2.56e7 / n=2.048e8 literals therefore no longer rest on a single unreproduced offline run: they
 *   are corroborated at import by a third path whose node placement follows the analytic peak scale,
 *   confirming the uniform-mesh shortfall was pure under-resolution of the ~5e-6 / ~6e-7 peak.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / PROVENANCE REPRODUCTION ONLY, at the RH-equivalent scale class. It reproduces a
 *   quadrature value for a fixed autocorrelation weight used inside a mass-feasibility diagnostic;
 *   it establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (the module whose offline literals this reproduces)
 *   @see imp-3736-a-weight-quadrature-convergence-assessment.js (the tau in {1.5,2.0} reconciliation)
 *   @see imp-3709-a-weight-logdomain-independent-reproduction.js (the graded-GL path)
 *   @see imp-3665-a-weight-superexp-decay-crosscheck.js (the uniform-Simpson path)
 *
 *   Ticket: imp-3873 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;

/**
 * Factored ln Phi(u) (imp-3709/imp-3850 form): pull out the n=1 leading exponent analytically.
 * ln Phi(u) = -pi e^{4u} + ln( sum_n amp_n e^{-pi (n^2-1) e^{4u}} ).
 */
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;    // > 0 for u >= 0
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// -- Reference path: imp-3850s graded 10-pt Gauss-Legendre limit (Path 1) ---------------------
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
function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

// -- The INDEPENDENT third path: peak-scaled substitution uniform log-Simpson ------------------
// s = sigma * x, sigma = 1/(4 pi e^{4 tau}) (the analytic peak width). A = sigma * int_0^Xmax g dx.
// Uniform Simpson in x seats O(few-thousand) nodes under the O(1)-wide rescaled peak, so it
// self-computes at import -- unlike the uniform-[0,12] mesh, which needs n=2.56e7 / 2.048e8.
function negLnAsubSimpson(tau, Xmax, n) {
  const sigma = 1 / (4 * PI * Math.exp(4 * tau));
  const m = n % 2 === 0 ? n : n + 1;
  const h = Xmax / m;
  const logw = [];
  let mx = -Infinity;
  for (let i = 0; i <= m; i += 1) {
    const w = i === 0 || i === m ? 1 : (i % 2 === 0 ? 2 : 4);
    const s = sigma * (i * h);
    const t = Math.log(w) + logPhiFactored(s) + logPhiFactored(s + tau);
    logw.push(t);
    if (t > mx) mx = t;
  }
  let acc = 0;
  for (const t of logw) acc += Math.exp(t - mx);
  // -ln A = -[ ln(sigma) + ln(h/3) + mx + ln(acc) ]
  return -(Math.log(sigma) + Math.log(h / 3) + mx + Math.log(acc));
}

const TAUS = [2.5, 3];

// imp-3850s offline-verified uniform-Simpson literals (the provenance gap this module closes).
const IMP3850_OFFLINE_LITERAL = Object.freeze({
  2.5: { n: 25600000, negLnA: 69198.54066317427 },
  3: { n: 204800000, negLnA: 511309.61253717536 },
});

// -- (A) The graded-GL limit, recomputed here as the independent reference target --------------
const GL_LIMIT = Object.freeze({
  2.5: negLnAgradedGL(2.5, 14, 200, 4),
  3: negLnAgradedGL(3, 14, 200, 4),
});

// -- (B) The independent substitution-Simpson refinement ladder (self-computing at import) -----
const SUB_LADDER = TAUS.map((tau) => {
  const limit = GL_LIMIT[tau];
  const rungs = [500, 1000, 2000, 4000, 8000].map((n) => {
    const v = negLnAsubSimpson(tau, 40, n);
    return Object.freeze({ n, negLnA: v, gapToLimit: v - limit });
  });
  return Object.freeze({ tau, Xmax: 40, limit, rungs });
});

// -- (C) Domain-invariance: Xmax in {40,80,120} converge to the same value (not a truncation) --
const DOMAIN_INVARIANT = TAUS.map((tau) => {
  const x40 = negLnAsubSimpson(tau, 40, 8000);
  const x80 = negLnAsubSimpson(tau, 80, 8000);
  const x120 = negLnAsubSimpson(tau, 120, 8000);
  return Object.freeze({
    tau, x40, x80, x120,
    spread: Math.max(Math.abs(x40 - x80), Math.abs(x80 - x120)),
  });
});
const domainInvariant = DOMAIN_INVARIANT.every((r) => r.spread < 1e-9);

// -- (D) Converged reproduction: substitution-Simpson vs graded-GL limit AND offline literal ---
const REPRODUCTION = TAUS.map((tau) => {
  const converged = negLnAsubSimpson(tau, 40, 8000);
  const gl = GL_LIMIT[tau];
  const lit = IMP3850_OFFLINE_LITERAL[tau];
  return Object.freeze({
    tau,
    subSimpsonConverged: converged,
    gradedGL: gl,
    offlineLiteral: lit.negLnA,
    offlineLiteralN: lit.n,
    absGapToGL: Math.abs(converged - gl),
    relGapToGL: Math.abs(converged - gl) / gl,
    absGapToLiteral: Math.abs(converged - lit.negLnA),
    relGapToLiteral: Math.abs(converged - lit.negLnA) / gl,
  });
});

// -- Verdict classifiers ----------------------------------------------------------------------
// (1) The substitution-Simpson climbs MONOTONICALLY from below onto the graded-GL limit.
const climbsMonotone = SUB_LADDER.every((s) => {
  const g = s.rungs.map((r) => r.negLnA);
  return g[0] < g[1] && g[1] < g[2] && g[2] < g[3] && g[3] <= g[4] &&
    g[4] <= s.limit + 1e-9;
});
// (2) At convergence the independent path agrees with the graded-GL limit to <1e-9 absolute.
const reproducesGL = REPRODUCTION.every((r) => r.absGapToGL < 1e-9);
// (3) At convergence it reproduces the imp-3850 OFFLINE literal to within its documented ~1e-6.
const reproducesOfflineLiteral = REPRODUCTION.every((r) => r.absGapToLiteral < 5e-6 && r.relGapToLiteral < 1e-8);
// (4) Domain-invariant: the x-cutoff is not a truncation artifact.
const cutoffIsNotArtifact = domainInvariant;

const verdict =
  climbsMonotone &&
  reproducesGL &&
  reproducesOfflineLiteral &&
  cutoffIsNotArtifact
    ? 'IMP3850-OFFLINE-LITERAL-PROVENANCE-GAP-CLOSED:-A-THIRD-STRUCTURALLY-INDEPENDENT-PEAK-SCALED-SUBSTITUTION-SIMPSON(s=sigma*x,sigma=1/(4pi e^{4tau}),n<=8000,SELF-COMPUTING)-CLIMBS-MONOTONICALLY-ONTO-THE-GRADED-GL-LIMIT(-lnA(2.5)=69198.540665,-lnA(3.0)=511309.612538)-TO-<1e-9-AND-REPRODUCES-THE-imp-3850-OFFLINE-UNIFORM-SIMPSON-LITERALS(n=2.56e7/2.048e8)-TO-WITHIN-THEIR-DOCUMENTED-~1e-6-ABS/~1e-11-REL;-THE-UNIFORM-MESH-SHORTFALL-WAS-PURE-UNDER-RESOLUTION-OF-THE-~5e-6/~6e-7-PEAK'
    : 'INDETERMINATE';

export const IMP3873_A_WEIGHT_OFFLINE_LITERAL_INDEPENDENT_REPRODUCTION = Object.freeze({
  id: 'imp-3873-a-weight-offline-literal-independent-reproduction',
  ticket: 'imp-3873',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  reproducesModule: 'imp-3850-a-weight-dual-path-tau25-30-reconciliation.js',

  summary:
    'CLOSES the imp-3850 offline-verified-literal provenance gap: imp-3850s uniform-Simpson anchors at ' +
    'tau in {2.5,3.0} (-ln A(2.5)=69198.54066317 at n=2.56e7, -ln A(3.0)=511309.61253717 at n=2.048e8) were ' +
    'OFFLINE literals baked in because the ~5e-6 / ~6e-7 near-s=0 peak forces a uniform [0,12] mesh to huge n. ' +
    'This module reproduces them with a THIRD, structurally independent, SELF-COMPUTING quadrature: a peak-scaled ' +
    'substitution uniform Simpson s=sigma*x, sigma=1/(4 pi e^{4 tau}), which seats O(few-thousand) nodes under the ' +
    'rescaled O(1)-wide peak. It climbs MONOTONICALLY from below onto the graded-GL limit (n=500 gap ~-2.3e-7 -> ' +
    'n=8000 gap ~-1.5e-11), agrees with the graded-GL limit to <1e-9 absolute, and reproduces the imp-3850 offline ' +
    'uniform-Simpson literals to within their documented ~1e-6 absolute / ~1e-11 relative residual (1.6e-6 at 2.5, ' +
    '1.1e-6 at 3.0). Domain-invariant (Xmax in {40,80,120} agree <1e-9), so the x-cutoff is not a truncation ' +
    'artifact. The offline n=2.56e7 / 2.048e8 literals thus no longer rest on a single unreproduced run. ' +
    'ACCURACY/PROVENANCE REPRODUCTION, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity ' +
    '(imp-3066) untouched; no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    sharedKernel: 'the factored ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}) is held fixed; only the QUADRATURE differs',
    independentPath: 'peak-scaled substitution uniform Simpson: s=sigma*x with sigma=1/(4 pi e^{4 tau}) the analytic peak width, so A=sigma*int_0^Xmax g(sigma x) dx and a uniform x-mesh resolves the O(1)-wide rescaled peak with n<=8000 nodes',
    whyIndependent: 'neither the imp-3850 graded-GL power-panel rule (Path 1) nor its uniform-[0,12] mesh (Path 2): a uniform mesh in a DIFFERENT variable, nodes placed by the analytic peak scale rather than grid density',
    selfComputing: 'all rungs, the domain-invariance check and the graded-GL reference recompute at import (max <=8000 nodes); NO offline literal is trusted -- the imp-3850 literals are only COMPARED against, not used as inputs',
    domainIsolation: 'the substitution integral is evaluated at Xmax in {40,80,120} to confirm the outer x-cutoff does not bias the limit',
    peakWidthOrigin: 'd/ds ln g|_{s=0} = -4 pi(1 + e^{4 tau}) ~ -4 pi e^{4 tau}, giving the characteristic width sigma = 1/(4 pi e^{4 tau}) (~5e-6 at 2.5, ~6e-7 at 3.0) that dictates the uniform-mesh refinement imp-3850 had to reach offline',
  }),

  measured: Object.freeze({
    taus: TAUS,
    glLimit: GL_LIMIT,
    imp3850OfflineLiteral: IMP3850_OFFLINE_LITERAL,
    subLadder: SUB_LADDER,
    domainInvariant: DOMAIN_INVARIANT,
    domainInvariantPass: domainInvariant,
    reproduction: REPRODUCTION,
    climbsMonotone,
    reproducesGL,
    reproducesOfflineLiteral,
    cutoffIsNotArtifact,
    verdict,
  }),

  interpretation: Object.freeze({
    theGapClosed:
      'imp-3850 recorded the tau in {2.5,3.0} uniform-Simpson anchors as OFFLINE-VERIFIED LITERALS (n=2.56e7, ' +
      'n=2.048e8) because the collapsing near-s=0 peak makes a uniform [0,12] mesh too expensive to self-compute. ' +
      'This module reproduces those exponents with an independent, self-computing peak-scaled substitution Simpson, ' +
      'so the literals are now corroborated by a third path rather than a single unreproduced offline run.',
    monotoneClimbFromBelow:
      'The substitution-Simpson climbs MONOTONICALLY from below onto the graded-GL limit at both tau ' +
      '(Xmax=40: n=500 gap ~-2.3e-7 -> n=1000 ~-1.4e-8 -> n=2000 ~-9e-10 -> n=8000 ~-1.5e-11), matching the ' +
      'monotone-from-below character of the imp-3850 uniform-Simpson climb but converging with ~3000x fewer nodes.',
    reproducesBothTargets:
      'At n=8000 the independent path agrees with the graded-GL limit to <1e-9 absolute AND sits within the ' +
      'imp-3850-documented ~1e-6 absolute / ~1e-11 relative of the offline uniform-Simpson literal, confirming ' +
      'the uniform-mesh shortfall imp-3850 reported was pure under-resolution of the ~5e-6 / ~6e-7 peak, not bias.',
    domainNotArtifact:
      'Xmax in {40,80,120} converge to the same value at n=8000 (spread <1e-9), so the substitution x-cutoff is ' +
      'not a truncation artifact -- the rescaled integrand is fully decayed well inside Xmax=40.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Reproduces, with a third independent quadrature, the log-domain decay exponents of a fixed autocorrelation ' +
      'weight -- a magnitude used inside a mass-feasibility diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    literalProvenanceNowClosed:
      'The imp-3850 offline uniform-Simpson literals (n=2.56e7 at tau=2.5, n=2.048e8 at tau=3.0) are used here ONLY ' +
      'as comparison targets, never as inputs; the reproduction path is fully self-computing at import (n<=8000), so ' +
      'the offline literals are now independently corroborated rather than trusted on provenance.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ----------------------------------------------------------------------
export const IMP3873_A_WEIGHT_OFFLINE_LITERAL_INDEPENDENT_REPRODUCTION_ASSERTIONS = [
  {
    id: 'imp3873-independent-path-climbs-monotone-onto-gl-limit',
    why: 'The peak-scaled substitution Simpson must climb MONOTONICALLY from below onto the graded-GL limit at ' +
         'both tau through the self-computing ladder (n=500..8000), with no overshoot -- the same monotone ' +
         'character as the imp-3850 uniform-Simpson climb but ~3000x cheaper.',
    holds: () => climbsMonotone,
  },
  {
    id: 'imp3873-reproduces-graded-gl-limit-to-1e-9',
    why: 'THE INDEPENDENCE: at n=8000 the substitution Simpson must agree with the recomputed graded-GL limit to ' +
         '<1e-9 absolute at both tau (-ln A(2.5)=69198.540665, -ln A(3.0)=511309.612538).',
    holds: () => reproducesGL,
  },
  {
    id: 'imp3873-reproduces-imp3850-offline-literal-to-documented-residual',
    why: 'THE PURPOSE: the independent converged value must reproduce the imp-3850 OFFLINE uniform-Simpson ' +
         'literals (69198.54066317 at n=2.56e7, 511309.61253717 at n=2.048e8) to within their documented ' +
         '~1e-6 absolute / ~1e-11 relative residual, closing the offline-verified-literal provenance gap.',
    holds: () => reproducesOfflineLiteral,
  },
  {
    id: 'imp3873-substitution-domain-invariant',
    why: 'Xmax in {40,80,120} must converge to the same value at n=8000 (spread <1e-9), proving the substitution ' +
         'x-cutoff is not a truncation artifact.',
    holds: () => cutoffIsNotArtifact,
  },
  {
    id: 'imp3873-verdict-records-provenance-gap-closed',
    why: 'The classified verdict must record that the imp-3850 offline-literal provenance gap is closed by an ' +
         'independent self-computing quadrature, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3873-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/provenance reproduction only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3873_A_WEIGHT_OFFLINE_LITERAL_INDEPENDENT_REPRODUCTION.honestCaveat;
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

for (const assertion of IMP3873_A_WEIGHT_OFFLINE_LITERAL_INDEPENDENT_REPRODUCTION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3873-a-weight-offline-literal-independent-reproduction assertion failed: ${assertion.id}`);
  }
}

export default IMP3873_A_WEIGHT_OFFLINE_LITERAL_INDEPENDENT_REPRODUCTION;
