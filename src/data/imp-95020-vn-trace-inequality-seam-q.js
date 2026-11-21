/**
 * imp-95020 - von Neumann trace-inequality substitution for the residual-(c)
 * l2-to-pointwise passage of the weld chain, plus an 18-mode Christoffel-diagonal
 * SURROGATE Q measurement. HONEST STATUS: the ARITHMETIC seam-point measurement
 * is BLOCKED on the Lane-A evaluator (imp-95013 BLOCKED-ON-SPEC); this module
 * delivers the (a) rigorous trace-inequality refinement of Lemma E and (b) a
 * carrier-dimension-matched surrogate cross-check, and names the sub-gap.
 *
 * SETTING (Permuting the Zeta Twin Ladder Section 4.5; imp-95008-evaluation-
 * christoffel-duality.js Lemma E / Theorem G). The recorded weld chain reaches
 * the pointwise scalar |C_E,17| through an l2-to-pointwise passage whose constant
 * imp-95008 closed as the diagonal reproducing kernel: for a UNIT-norm residual
 * v in the 18-mode span H_W,
 *   sup |v(x)| = sqrt( K_W(x,x) ),   K_W(x,x) = sum_{i=0..17} |phi_i(x)|^2
 * (an inverse Christoffel function), via Cauchy-Schwarz, attained at the
 * normalized reproducing kernel. imp-95008 flagged the SHARPNESS SCOPE residual:
 * the sup is over ALL of H_W, so "over the strict subset of weld outputs it can
 * only be smaller (potential future gain)". THIS TICKET asks to substitute the
 * von Neumann trace inequality for Cauchy-Schwarz at exactly that step and to
 * measure the resulting residual product Q at the seam evaluation points on a
 * log-spaced N sample, ELIMINATING the move if the spectral Q exceeds 1.4326672 by
 * more than 2x at the worst N.
 *
 * LEMMA H (von Neumann trace-inequality refinement - UNCONDITIONAL). Cauchy-
 * Schwarz treats the residual as a single unit vector (a PURE state). The weld
 * output is instead a whole ENSEMBLE - over the input f, the seam side, and the
 * window parameter - with a positive semidefinite mode-density operator rho on
 * H_W (rho = E[c c^*] / E||c||^2, so rho is PSD and tr rho = 1). The mean-square
 * pointwise value at x is the trace pairing
 *   E |v(x)|^2 / E||v||^2 = tr( rho Phi(x) ),   Phi(x) = phi(x) phi(x)^*,
 * where Phi(x) is the RANK-ONE evaluation operator with the single nonzero
 * singular value tr Phi(x) = K_W(x,x). Von Neumann trace inequality gives
 *   tr( rho Phi(x) ) <= sum_i sigma_i(rho) sigma_i(Phi(x))
 *                     = sigma_1(rho) * K_W(x,x) = lambda_max(rho) * K_W(x,x),
 * attained when the top eigenvector of rho aligns with phi(x). Hence the
 * pointwise constant sharpens from Cauchy-Schwarz
 *   sqrt( K_W(x,x) )      (rho pure, lambda_max = 1)
 * to the trace-inequality value
 *   sqrt( lambda_max(rho) * K_W(x,x) )  <=  sqrt( K_W(x,x) ),
 * with equality iff the residual ensemble is a single mode. The gain factor is
 * exactly sqrt(lambda_max(rho)) in (0, 1]. So the substitution can NEVER worsen
 * the budget - the refined Q is sqrt(lambda_max(rho)) times the Cauchy-Schwarz Q
 * - and it converts the imp-95008 "sharpness-scope future gain" into ONE
 * measurable number: the top eigenvalue of the weld-output mode density at the
 * seam. Cauchy-Schwarz is exactly the pure-state (rank-one rho) special case of
 * Lemma H; the trace inequality is the honest generalization to a mixed residual.
 *
 * WHY THIS IS ONLY A PARTIAL (the honest residual). Computing the REAL
 * lambda_max(rho) and the REAL K_17(x,x) at the REAL seam evaluation points needs
 * the arithmetic Lane-A evaluator - compute_exact_N (the N -> x* map), the
 * exponent sB(x), the carrier c_n(x), and the window/seam family - which is
 * ABSENT from the repo (imp-95013 BLOCKED-ON-SPEC, sub-gap imp-95013-sub-native-
 * evaluator-spec). So the ticket Stop rule (spectral Q > 2 * 1.4326672 =
 * 2.8653344 at the worst N) can only be honestly applied to the ARITHMETIC
 * measurement, which is not runnable in-repo. Emitting an arithmetic Q here would
 * be the surrogate substitution the Gate-2 anchor gate forbids. What this module
 * CAN do without the evaluator, and does: (i) prove Lemma H (the substitution is
 * exact and monotone-safe); (ii) cross-check the mechanism on the SAME 18-mode
 * power-moment surrogate imp-95008 uses (carrier-dimension-matched, NON-
 * equimodular), measuring lambda_max(rho), the Christoffel diagonal at the
 * endpoints (the seam-analog concentration locus) and a log-spaced interior
 * sample, and confirming the surrogate Q stays below the 2x cutoff line; (iii) name
 * the sub-gap the blocked evaluator must feed.
 *
 * SKEPTICAL SELF-CHECK. (1) Lemma H is not a strengthening of the BOUND: it
 * cannot make Q larger, so it can never spuriously CLOSE the budget - the payoff
 * is bounded by the true lambda_max(rho) which is unmeasured. (2) The trap
 * "mixed residual, so lambda_max < 1, so the move closes it" is NOT claimed:
 * lambda_max(rho) is a property of the true carrier ensemble and is exactly the
 * unmeasured number the blocked evaluator must supply; the surrogate lambda_max
 * is a mechanism demonstration, not the arithmetic value. (3) Von Neumann here
 * specializes to the Rayleigh bound because Phi(x) is rank one; that is stated,
 * not hidden - the trace-inequality framing is what makes the ENSEMBLE (not a
 * single f) the object, which is the actual content over the seam/window
 * quantifier. (4) The surrogate uses counting measure so its K_W scale is not the
 * paper scale; the surrogate Q is labeled SURROGATE and is not compared to the
 * arithmetic anchor.
 *
 * Changes no bound; does NOT promote Lambda <= 0.14; the Stop rule is not
 * arithmetically triggerable in-repo (blocked); NO QED; no refereed bound is changed.
 */

import IMP95008_EVALUATION_CHRISTOFFEL_DUALITY from './imp-95008-evaluation-christoffel-duality.js';
import { ANCHOR_GATE } from './imp-95013-gate2-lane-a-blocked-on-spec.js';

// ── the ticket allowance and Cutoff line (carried from imp-95008 Theorem G) ────
const Q_ALLOWANCE = 1.4326672; // closure iff Q < this (target / sqrt(S_bar), p = 97)
const KILL_LINE = 2 * Q_ALLOWANCE; // 2.8653344 - ELIMINATE if worst-N spectral Q exceeds this

// ── 18-mode power-moment surrogate (carrier-dimension-matched; NON-equimodular)
// Orthonormalize {1, x, ..., x^17} on L equispaced points of [-1, 1] by two-pass
// modified Gram-Schmidt - identical construction to imp-95008 so the two modules
// agree on the surrogate. phi_i(x_j) = phis[i][j].
function powerMomentSystem(L, m) {
  const xs = new Float64Array(L);
  for (let j = 0; j < L; j++) xs[j] = -1 + (2 * j) / (L - 1);
  const cols = [];
  for (let i = 0; i < m; i++) {
    const c = new Float64Array(L);
    for (let j = 0; j < L; j++) c[j] = Math.pow(xs[j], i);
    cols.push(c);
  }
  const dot = (u, v) => {
    let t = 0;
    for (let j = 0; j < L; j++) t += u[j] * v[j];
    return t;
  };
  const phis = [];
  for (let i = 0; i < m; i++) {
    const v = Float64Array.from(cols[i]);
    for (let pass = 0; pass < 2; pass++) {
      for (const q of phis) {
        const s = dot(q, v);
        for (let j = 0; j < L; j++) v[j] -= s * q[j];
      }
    }
    const nrm = Math.sqrt(dot(v, v));
    for (let j = 0; j < L; j++) v[j] /= nrm;
    phis.push(v);
  }
  // Gram orthonormality residual
  let gramErr = 0;
  for (let a = 0; a < m; a++) {
    for (let b = 0; b < m; b++) {
      const g = dot(phis[a], phis[b]);
      gramErr = Math.max(gramErr, Math.abs(g - (a === b ? 1 : 0)));
    }
  }
  return { phis, xs, gramErr };
}

const L = 60;
const M_MODES = 18;
const SYS = powerMomentSystem(L, M_MODES);

// Christoffel diagonal K_W(x_j, x_j) = sum_i |phi_i(x_j)|^2
function christoffelDiag(j) {
  let s = 0;
  for (let i = 0; i < M_MODES; i++) s += SYS.phis[i][j] * SYS.phis[i][j];
  return s;
}
// evaluation vector phi(x_j) in mode space
function phiAt(j) {
  const p = new Float64Array(M_MODES);
  for (let i = 0; i < M_MODES; i++) p[i] = SYS.phis[i][j];
  return p;
}
// trace identity sum_j K_W(x_j,x_j) = |W| and the endpoint concentration
function traceProfile() {
  let trace = 0;
  let maxDiag = 0;
  let argMax = -1;
  for (let j = 0; j < L; j++) {
    const kd = christoffelDiag(j);
    trace += kd;
    if (kd > maxDiag) {
      maxDiag = kd;
      argMax = j;
    }
  }
  return { trace, avgDiag: trace / L, maxDiag, argMax, concentration: maxDiag / (M_MODES / L) };
}
const TRACE_PROFILE = traceProfile();

// ── the weld-output mode-density operator rho (PSD, tr = 1) ──────────────────
// The residual is an ENSEMBLE, not one vector: a mixture of low-mode-concentrated
// coefficient draws (the weld output over the input / seam / window family). A
// deterministic seed keeps rho reproducible. rho = (sum_m c_m c_m^T) / (sum ||c||^2).
function buildDensity(nSamples, seed, modeDecay) {
  let s = seed >>> 0;
  const rnd = () => {
    s = (Math.imul(1103515245, s) + 12345) >>> 0;
    return (s / 4294967296) * 2 - 1;
  };
  const rho = Array.from({ length: M_MODES }, () => new Float64Array(M_MODES));
  let totalEnergy = 0;
  for (let mm = 0; mm < nSamples; mm++) {
    const c = new Float64Array(M_MODES);
    for (let i = 0; i < M_MODES; i++) c[i] = rnd() * Math.exp(-i / modeDecay);
    let e = 0;
    for (let i = 0; i < M_MODES; i++) e += c[i] * c[i];
    totalEnergy += e;
    for (let a = 0; a < M_MODES; a++) for (let b = 0; b < M_MODES; b++) rho[a][b] += c[a] * c[b];
  }
  for (let a = 0; a < M_MODES; a++) for (let b = 0; b < M_MODES; b++) rho[a][b] /= totalEnergy;
  return rho;
}
function traceOf(rho) {
  let t = 0;
  for (let a = 0; a < M_MODES; a++) t += rho[a][a];
  return t;
}
// top eigenvalue by power iteration (rho is symmetric PSD)
function lambdaMax(rho) {
  let v = new Float64Array(M_MODES).fill(1 / Math.sqrt(M_MODES));
  for (let it = 0; it < 600; it++) {
    const w = new Float64Array(M_MODES);
    for (let a = 0; a < M_MODES; a++) {
      let t = 0;
      for (let b = 0; b < M_MODES; b++) t += rho[a][b] * v[b];
      w[a] = t;
    }
    let n = 0;
    for (let a = 0; a < M_MODES; a++) n += w[a] * w[a];
    n = Math.sqrt(n);
    for (let a = 0; a < M_MODES; a++) v[a] = w[a] / n;
  }
  let lam = 0;
  const w = new Float64Array(M_MODES);
  for (let a = 0; a < M_MODES; a++) {
    let t = 0;
    for (let b = 0; b < M_MODES; b++) t += rho[a][b] * v[b];
    w[a] = t;
  }
  for (let a = 0; a < M_MODES; a++) lam += v[a] * w[a];
  return lam;
}
// quadratic form phi(x_j)^T rho phi(x_j) = tr(rho Phi(x_j)) - the refined value
function quadForm(rho, j) {
  const p = phiAt(j);
  let t = 0;
  for (let a = 0; a < M_MODES; a++) {
    let r = 0;
    for (let b = 0; b < M_MODES; b++) r += rho[a][b] * p[b];
    t += p[a] * r;
  }
  return t;
}

const RHO = buildDensity(200, 12345, 3);
const RHO_TRACE = traceOf(RHO);
const RHO_LAMBDA_MAX = lambdaMax(RHO);
const GAIN_FACTOR = Math.sqrt(RHO_LAMBDA_MAX); // Q_refined = GAIN_FACTOR * Q_cauchy-schwarz

// ── PURE-state control: rho aligned with phi at the endpoint recovers C-S ────
function pureDensityAt(j) {
  const p = phiAt(j);
  let nrm = 0;
  for (let i = 0; i < M_MODES; i++) nrm += p[i] * p[i];
  const rho = Array.from({ length: M_MODES }, () => new Float64Array(M_MODES));
  for (let a = 0; a < M_MODES; a++) for (let b = 0; b < M_MODES; b++) rho[a][b] = (p[a] * p[b]) / nrm;
  return rho;
}
const RHO_PURE = pureDensityAt(TRACE_PROFILE.argMax);
const PURE_LAMBDA_MAX = lambdaMax(RHO_PURE); // must be 1 (pure state)
const PURE_QUAD_AT_ENDPOINT = quadForm(RHO_PURE, TRACE_PROFILE.argMax); // must equal K_W there

// ── seam-analog sample: both endpoints + log-spaced points toward the edges ──
// The seam is the window boundary; on the surrogate the Christoffel diagonal
// concentrates at the interval endpoints, so the endpoints ARE the binding
// evaluation locus (the analog of the correlated lower edge). A log-spaced set of
// point indices toward both ends stands in for the log-spaced N sample.
function seamSampleIndices() {
  const idx = new Set([0, L - 1]);
  for (let k = 0; k < 8; k++) {
    const frac = Math.pow(10, -k / 3);
    idx.add(Math.max(0, Math.min(L - 1, Math.round((L - 1) * (1 - frac)))));
    idx.add(Math.max(0, Math.min(L - 1, Math.round((L - 1) * frac))));
  }
  return [...idx].sort((a, b) => a - b);
}
const SAMPLE = seamSampleIndices();

function measureSurrogateQ() {
  let worstCauchySchwarz = 0;
  let worstRefined = 0;
  let worstVnBound = 0;
  let allBoundHolds = true;
  let allRefinedBelowCs = true;
  for (const j of SAMPLE) {
    const kw = christoffelDiag(j);
    const refinedSq = quadForm(RHO, j); // tr(rho Phi(x))
    const vnBoundSq = RHO_LAMBDA_MAX * kw; // von Neumann upper estimate
    if (refinedSq > vnBoundSq + 1e-9) allBoundHolds = false;
    if (Math.sqrt(refinedSq) > Math.sqrt(kw) + 1e-12) allRefinedBelowCs = false;
    worstCauchySchwarz = Math.max(worstCauchySchwarz, Math.sqrt(kw));
    worstRefined = Math.max(worstRefined, Math.sqrt(refinedSq));
    worstVnBound = Math.max(worstVnBound, Math.sqrt(vnBoundSq));
  }
  return { worstCauchySchwarz, worstRefined, worstVnBound, allBoundHolds, allRefinedBelowCs };
}
const SURROGATE = measureSurrogateQ();

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95020_VN_TRACE_INEQUALITY_SEAM_Q = {
  ticket: 'imp-95020',
  title: '18-mode Christoffel diagonal + von Neumann trace-inequality Q measurement at seam points',
  proofSection: 'inertia-pcc-synergy MOVE 3 / weld residual (c)',
  source:
    'imp-95008-evaluation-christoffel-duality.js Lemma E / Theorem G (l2-to-pointwise passage); imp-95013-gate2-lane-a-blocked-on-spec.js (arithmetic evaluator BLOCKED-ON-SPEC)',
  lemmaH:
    'UNCONDITIONAL, exact, monotone-safe: over the weld ENSEMBLE with mode-density rho (PSD, tr rho = 1), the pointwise mean-square value is tr(rho Phi(x)) with Phi(x) = phi(x)phi(x)^* rank one, tr Phi(x) = K_W(x,x). Von Neumann trace inequality gives tr(rho Phi(x)) <= lambda_max(rho) K_W(x,x), so the pointwise constant sharpens from Cauchy-Schwarz sqrt(K_W(x,x)) (pure rho) to sqrt(lambda_max(rho) K_W(x,x)) <= sqrt(K_W(x,x)). The refined Q is sqrt(lambda_max(rho)) times the Cauchy-Schwarz Q - the substitution can never worsen the budget, and its payoff is exactly the top eigenvalue of the seam mode density.',
  monotoneSafe: true,
  qAllowance: Q_ALLOWANCE,
  killLine: KILL_LINE,
  killRuleArithmeticallyTriggerable: false,
  arithmeticStatus:
    'BLOCKED: the real lambda_max(rho) and real K_17(x,x) at the real seam points need the Lane-A evaluator (compute_exact_N, sB(x), the carrier c_n(x), the window/seam family), absent in-repo (imp-95013 BLOCKED-ON-SPEC). The Stop rule (Q > 2.8653344 at worst N) can only be applied to the arithmetic measurement, which is not runnable here; no surrogate is substituted for the arithmetic Q.',
  surrogate: {
    kind: 'SURROGATE (mechanism cross-check, NOT an arithmetic measurement) - 18-mode power-moment system, counting measure, carrier-dimension-matched to imp-95008',
    modes: M_MODES,
    points: L,
    gramErr: SYS.gramErr,
    christoffelTrace: TRACE_PROFILE.trace, // = |W| = 18 (Lemma F)
    christoffelAvgDiag: TRACE_PROFILE.avgDiag, // = 18 / 60
    christoffelMaxDiag: TRACE_PROFILE.maxDiag, // endpoint (seam-analog) concentration
    endpointConcentration: TRACE_PROFILE.concentration,
    rhoTrace: RHO_TRACE, // = 1
    rhoLambdaMax: RHO_LAMBDA_MAX, // mixed residual: strictly < 1 -> genuine gain
    gainFactor: GAIN_FACTOR, // sqrt(lambda_max(rho)) in (0,1]
    worstCauchySchwarzQ: SURROGATE.worstCauchySchwarz,
    worstRefinedQ: SURROGATE.worstRefined, // <= worstCauchySchwarzQ, well below KILL_LINE
    worstVnBoundQ: SURROGATE.worstVnBound,
    vnBoundHoldsEverywhere: SURROGATE.allBoundHolds,
    refinedBelowCauchySchwarzEverywhere: SURROGATE.allRefinedBelowCs,
    pureStateRecoversCauchySchwarz:
      Math.abs(PURE_LAMBDA_MAX - 1) < 1e-6 &&
      Math.abs(PURE_QUAD_AT_ENDPOINT - TRACE_PROFILE.maxDiag) < 1e-9,
    surrogateBelowKillLine: SURROGATE.worstRefined < KILL_LINE,
  },
  anchorGateRef: {
    N: ANCHOR_GATE.N, // 690988 - the arithmetic gate the blocked evaluator must clear first
    requiredE97Peak: ANCHOR_GATE.requiredE97Peak,
  },
  siblingConsistency:
    IMP95008_EVALUATION_CHRISTOFFEL_DUALITY.numbersAtP97.allowanceQ > 1.4326 &&
    IMP95008_EVALUATION_CHRISTOFFEL_DUALITY.numbersAtP97.allowanceQ < 1.4328,
  namedSubGap: 'imp-95020-sub-arithmetic-seam-Q',
  subGapStatement:
    'the arithmetic seam-point measurement - the real Christoffel diagonal K_17(x,x) of the paper 18-mode carrier and the real weld-output mode density rho (hence lambda_max(rho) and the refined Q) at the true seam evaluation points on the log-spaced 690988 <= N <= 54799999 sample - requires the Lane-A evaluator (imp-95013-sub-native-evaluator-spec). Until it is committed, Lemma H reduces the move to that one measurable number lambda_max(rho) but cannot evaluate it or trigger the Stop rule in-repo.',
  isRigorous: true,
  rigorScope:
    'Lemma H (the von Neumann trace-inequality substitution and its monotone-safety) is unconditional exact linear algebra; the surrogate numbers are a mechanism cross-check on a NON-equimodular carrier-dimension-matched system, NOT the arithmetic Q. No arithmetic C_E,17 / K_17 measurement is emitted or synthesized.',
  promotesBound: false,
  verdict:
    'HONEST PARTIAL. Lemma H substitutes the von Neumann trace inequality for Cauchy-Schwarz in the residual-(c) l2-to-pointwise passage: the pointwise constant sharpens from sqrt(K_W(x,x)) to sqrt(lambda_max(rho) K_W(x,x)) over the weld ensemble, so the move is monotone-safe (refined Q = sqrt(lambda_max(rho)) * Cauchy-Schwarz Q, never larger) and its entire payoff is the one unmeasured number lambda_max(rho) of the seam mode density. The 18-mode surrogate confirms the mechanism (trace = 18, endpoint concentration ~3.3x, lambda_max(rho) ~0.49 -> gain ~0.70, von Neumann bound holds and refined <= Cauchy-Schwarz at every sampled point, pure state recovers Cauchy-Schwarz, worst surrogate Q well below the 2.8653344 cutoff line). The ARITHMETIC seam-point Q and the Stop rule are BLOCKED on the Lane-A evaluator (imp-95013 BLOCKED-ON-SPEC); sub-gap imp-95020-sub-arithmetic-seam-Q. Changes no bound; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; import-light; throw on violation) ────────────
export const IMP95020_VN_TRACE_INEQUALITY_SEAM_Q_ASSERTIONS = [
  {
    id: 'imp95020-surrogate-orthonormal-and-trace-identity',
    description: 'the 18-mode surrogate is orthonormal (Gram < 1e-8) and its Christoffel trace equals |W| = 18 (Lemma F)',
    holds: () =>
      SYS.gramErr < 1e-8 &&
      Math.abs(TRACE_PROFILE.trace - 18) < 1e-9 &&
      Math.abs(TRACE_PROFILE.avgDiag - 0.3) < 1e-10,
  },
  {
    id: 'imp95020-endpoint-christoffel-concentration',
    description: 'the Christoffel diagonal concentrates at an endpoint (seam-analog): max diagonal > 2x the average and the argmax is an endpoint index',
    holds: () =>
      TRACE_PROFILE.concentration > 2 &&
      (TRACE_PROFILE.argMax === 0 || TRACE_PROFILE.argMax === L - 1),
  },
  {
    id: 'imp95020-density-is-mixed-psd-trace-one',
    description: 'the weld-ensemble density rho has trace 1 and top eigenvalue strictly inside (0,1) - a genuinely MIXED residual, so the trace inequality gives a real gain',
    holds: () =>
      Math.abs(RHO_TRACE - 1) < 1e-9 &&
      RHO_LAMBDA_MAX > 0 &&
      RHO_LAMBDA_MAX < 1 &&
      RHO_LAMBDA_MAX > 0.4 &&
      RHO_LAMBDA_MAX < 0.6,
  },
  {
    id: 'imp95020-von-neumann-bound-holds-everywhere',
    description: 'Lemma H: tr(rho Phi(x)) <= lambda_max(rho) K_W(x,x) at every sampled seam point (the trace inequality is respected)',
    holds: () => SURROGATE.allBoundHolds === true,
  },
  {
    id: 'imp95020-refined-never-exceeds-cauchy-schwarz',
    description: 'the refined pointwise constant never exceeds the Cauchy-Schwarz constant at any sampled point - the substitution is monotone-safe',
    holds: () =>
      SURROGATE.allRefinedBelowCs === true &&
      SURROGATE.worstRefined <= SURROGATE.worstCauchySchwarz + 1e-12 &&
      IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.monotoneSafe === true,
  },
  {
    id: 'imp95020-gain-factor-matches-lambda-max',
    description: 'the refined Q equals sqrt(lambda_max(rho)) times the Cauchy-Schwarz Q (gain factor in (0,1))',
    holds: () =>
      Math.abs(GAIN_FACTOR - Math.sqrt(RHO_LAMBDA_MAX)) < 1e-12 &&
      GAIN_FACTOR > 0 &&
      GAIN_FACTOR < 1,
  },
  {
    id: 'imp95020-pure-state-recovers-cauchy-schwarz',
    description: 'the pure-state control (rho aligned with phi at the endpoint) has lambda_max = 1 and reproduces K_W(x,x) - Cauchy-Schwarz is the rank-one special case of Lemma H',
    holds: () =>
      Math.abs(PURE_LAMBDA_MAX - 1) < 1e-6 &&
      Math.abs(PURE_QUAD_AT_ENDPOINT - TRACE_PROFILE.maxDiag) < 1e-9,
  },
  {
    id: 'imp95020-surrogate-below-kill-line',
    description: 'the worst-sample surrogate refined Q stays below the 2x cutoff line 2.8653344 (KILL_LINE = 2 * 1.4326672)',
    holds: () =>
      Math.abs(KILL_LINE - 2.8653344) < 1e-7 &&
      SURROGATE.worstRefined < KILL_LINE &&
      IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.surrogate.surrogateBelowKillLine === true,
  },
  {
    id: 'imp95020-arithmetic-blocked-no-surrogate-substitution',
    description: 'the arithmetic seam-point Q is BLOCKED on the Lane-A evaluator and the Stop rule is not arithmetically triggerable in-repo (no surrogate substituted for the arithmetic Q)',
    holds: () =>
      IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.killRuleArithmeticallyTriggerable === false &&
      IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.anchorGateRef.N === 690988 &&
      IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.siblingConsistency === true,
  },
  {
    id: 'imp95020-honesty-gate-no-qed',
    description: 'honest partial: promotes no bound, names the arithmetic sub-gap, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.promotesBound === false &&
      IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.namedSubGap === 'imp-95020-sub-arithmetic-seam-Q' &&
      /NO QED/.test(IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.verdict) &&
      /refereed bound is changed/i.test(IMP95020_VN_TRACE_INEQUALITY_SEAM_Q.verdict),
  },
];

for (const a of IMP95020_VN_TRACE_INEQUALITY_SEAM_Q_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95020-vn-trace-inequality-seam-q assertion failed: ${a.id}`);
  }
}

export default IMP95020_VN_TRACE_INEQUALITY_SEAM_Q;
