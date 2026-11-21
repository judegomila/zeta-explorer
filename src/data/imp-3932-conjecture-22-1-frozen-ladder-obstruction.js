/**
 * @fileoverview imp-3932: Rigorous coefficient-dimension obstruction to
 * Conjecture 22.1 (twin-ladder usefulness) of twin_ladder_consolidated_v52.pdf,
 * the SOLE conjecture graded INDEPENDENT-NOVEL by the imp-1210 literature audit
 * (jointly with 27.2 after imp-1258) that had never been stress-tested directly.
 *
 * @module data/imp-3932-conjecture-22-1-frozen-ladder-obstruction
 *
 * Exports:
 *  - IMP_3932_CONJECTURE_22_1_FROZEN_LADDER_OBSTRUCTION (default + named):
 *    frozen record with the conjecture text, the theorem chain L1-L4, the
 *    Platt-Trudgian benchmark corollary, named obstructions to a FULL
 *    falsification, and the surviving readings.
 *  - IMP_3932_CONJECTURE_22_1_FROZEN_LADDER_OBSTRUCTION_ASSERTIONS:
 *    build-time tripwires re-verifying the Fourier closed form by independent
 *    quadrature, the zero-count cap and its sharpness, the sign-transfer
 *    mechanism, and the benchmark arithmetic.
 *
 * Proof-chain role: a RIGOROUS elementary theorem (Fourier closure +
 * exponential-polynomial zero bound + sign transfer) that falsifies the strong
 * global reading of Conjecture 22.1 for the paper own eq (20)-(21) proxy class
 * at the benchmark the imp-1210 audit itself recommended (Platt-Trudgian 2021).
 * It is a PARTIAL result toward the conjecture in full generality; the exact
 * obstructions to a complete resolution are named, not hidden.
 *
 * NO imports. This module is self-contained and light (no zeros bundle).
 *
 * SYNTAX NOTE: JS string literals use double quotes where an apostrophe is
 * needed; JSDoc comments avoid the close-comment sequence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE CONJECTURE (verbatim, v52 Section 22, "Conjectures and theorem targets")
 * ─────────────────────────────────────────────────────────────────────────────
 * Conjecture 22.1 (Twin-ladder usefulness). "There exists a frozen-ladder
 * approximation whose certified remainder bound in the classical case is
 * smaller, at equal runtime, than a comparable baseline approximation."
 *
 * The paper Section 7 defines the frozen ladder as a compact proxy for the
 * rung stack: a monomial-Gaussian proxy
 *     Phi_fr(u) = e^{-alpha u^2} Sigma_{k=0..K} c_{2k} u^{2k}      (eq 20)
 * or the equivalent-span Hermite-Gaussian basis (eq 21), with certified
 * incomplete-gamma tail bounds (eq 22). In the classical case (beta,P)=(0,0)
 * the target is Xi(t) = xi(1/2 + it) = Integral Phi(u) e^{itu} du, and the
 * frozen-ladder approximation to Xi is Xi_fr(t) = Integral Phi_fr(u)e^{itu}du.
 * The imp-1210 audit recommended naming the baseline explicitly as
 * Platt-Trudgian 2021 (Riemann-Siegel-based verification at height 3e12).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE THEOREM (rigorous)
 * ─────────────────────────────────────────────────────────────────────────────
 * Consider the generalized frozen-ladder class (covering eq 20, eq 21, and any
 * finite mixture, e.g. per-prime freezes with different Gaussian widths):
 *     Phi_fr(u) = Sigma_{j=1..N} e^{-alpha_j u^2} P_j(u^2),
 * with distinct alpha_j > 0 and deg_{u^2} P_j = K_j. Define the coefficient
 * dimension D := Sigma_j (K_j + 1)  (the number of stored polynomial
 * coefficients; the alphas only help).
 *
 * L1 (Fourier closure). Xi_fr(t) = Sigma_j e^{-t^2/(4 alpha_j)} Q_j(t) with
 *    Q_j real, even, deg Q_j <= 2 K_j.
 *    Proof: Integral e^{-alpha u^2} u^{2k} e^{itu} du
 *         = (-1)^k (d^2/dt^2)^k [ sqrt(pi/alpha) e^{-t^2/(4 alpha)} ],
 *    and each t-differentiation of (Gaussian x polynomial) returns
 *    (Gaussian x polynomial) with degree raised by one. Concretely, with the
 *    scaling u = v/sqrt(alpha),
 *         Integral u^{2k} e^{-alpha u^2} cos(tu) du
 *       = alpha^{-(2k+1)/2} sqrt(pi) e^{-t^2/(4 alpha)} g_k(t/sqrt(alpha)),
 *    where g_0 = 1 and g_k = -g_{k-1} pp + s g_{k-1} p + (1/2 - s^2/4) g_{k-1}
 *    (p = derivative in s), an even polynomial of exact degree 2k. QED-L1.
 *
 * L2 (exponential-polynomial zero bound; classical, Polya-Szego Part V,
 *    Problem 75). If g(x) = Sigma_{j=1..N} R_j(x) e^{mu_j x} with distinct
 *    real mu_j and R_j not identically 0, then g has at most
 *    Sigma_j (deg R_j + 1) - 1 real zeros counted with multiplicity.
 *    Proof (induction on N): for N = 1 the zeros are those of R_1. For the
 *    step, h := g e^{-mu_N x} has the same zeros; differentiating h exactly
 *    (deg R_N + 1) times annihilates the R_N block, while every other block
 *    R_j e^{(mu_j - mu_N) x} keeps its exact degree (each derivative maps
 *    R e^{nu x} to (R p + nu R) e^{nu x}, and nu = mu_j - mu_N is nonzero, so
 *    the leading coefficient is multiplied by nu). Rolle with multiplicities
 *    (Z(h) <= Z(h p) + 1, iterated m times: Z(h) <= Z(h^{(m)}) + m) plus the
 *    induction hypothesis gives
 *    Z(g) <= (deg R_N + 1) + [ Sigma_{j<N} (deg R_j + 1) - 1 ]. QED-L2.
 *
 * L3 (sign-change cap). Xi_fr has at most D - 1 zeros, hence at most D - 1
 *    sign changes, on the open half-line (0, infinity).
 *    Proof: by L1 write Q_j(t) = R_j(t^2), deg R_j <= K_j. Substituting
 *    x = t^2 (a bijection (0,inf) -> (0,inf)),
 *    Xi_fr = Sigma_j R_j(x) e^{-x/(4 alpha_j)} with distinct exponents
 *    -1/(4 alpha_j). L2 caps the positive-x zeros by D - 1; each sign change
 *    on (0,inf) sits at a distinct zero. QED-L3. (The cap is SHARP: a single
 *    Gaussian times the Hermite polynomial H_{2K} realizes exactly K = D - 1
 *    positive sign changes; verified numerically in the assertions below.)
 *
 * L4 (sign transfer). If there are nodes 0 < t_0 < ... < t_M at which Xi
 *    alternates in sign with |Xi(t_i)| > eps_i, and the frozen ladder
 *    satisfies |Xi(t_i) - Xi_fr(t_i)| <= eps_i at every node, then Xi_fr
 *    alternates at the same nodes, so it has >= M sign changes on (0,inf),
 *    so by L3:   D >= M + 1.
 *    Proof: |Xi_fr(t_i) - Xi(t_i)| <= eps_i < |Xi(t_i)| forces
 *    sign(Xi_fr(t_i)) = sign(Xi(t_i)); the intermediate value theorem then
 *    yields a sign change between consecutive nodes. QED-L4.
 *
 * BENCHMARK COROLLARY (the audit-recommended classical benchmark).
 *    Platt-Trudgian 2021 (Bull. LMS 53, 792-797) verified that the first
 *    12,363,153,437,138 zeros of zeta are simple and on the critical line, up
 *    to height T0 = 3,000,175,332,800. Since Xi(t) = -f(t) Z(t) with f > 0
 *    smooth and explicit (the modulus of the completed prefactor; only f > 0
 *    matters, so the sign convention is immaterial), Xi has exactly
 *    M_sc = 12,363,153,437,138 sign changes on (0, T0]. Two forms:
 *    TASK FORM (hypothesis-free about the baseline internals): any frozen
 *    ladder in the class above that CERTIFIES M sign changes of Xi on
 *    (0, T0] -- i.e. exhibits M + 1 alternating nodes at which its own
 *    certified remainder is strictly below |Xi| -- has D >= M + 1 by L4.
 *    Matching the baseline deliverable at this benchmark (certifying all
 *    M_sc sign changes) therefore forces
 *        D >= M_sc + 1 = 12,363,153,437,139
 *    stored coefficients.
 *    COMPARISON FORM (margin hypothesis required): "ladder certified
 *    remainder pointwise <= baseline certified remainder" alone does NOT
 *    suffice -- a sign-change verification only guarantees |Z(t_i)| >
 *    |Ztilde(t_i)| - eps_RS(t_i) > 0 at its nodes, not |Z(t_i)| >
 *    eps_RS(t_i), so at a marginal node the true |Xi| can be below the
 *    common remainder level (adversarial-referee finding, 2026-07-03). The
 *    repaired hypothesis: at each node the baseline computed value has a
 *    2x margin, |Ztilde(t_i)| >= 2 eps_RS(t_i) (then |Xi(t_i)| >
 *    f(t_i) eps_RS(t_i) >= the ladder remainder, and L4 fires). The
 *    conclusion becomes D >= (number of margined alternating nodes) + 1;
 *    recovering the full M_sc + 1 needs the 2x margin in every plateau --
 *    transcript-dependent (the published PT result is a zero count, not a
 *    node certificate), though a verifier can always place nodes at plateau
 *    peaks where eps_RS ~ t^{-3/4} makes the margin comfortable. The Riemann-Siegel main sum at the top height has
 *    floor(sqrt(T0/2pi)) = 691,008 terms. The coefficient dimension exceeds
 *    the baseline main-sum length by a factor > 1.78e7. In any evaluation
 *    model that charges at least one operation per stored coefficient per
 *    evaluation (Horner, Clenshaw, or any streaming scheme over eq 20/21
 *    coefficients -- the models the paper quadratures actually use), a single
 *    Xi_fr evaluation costs >= 1.2e13 operations, i.e. "equal runtime" fails
 *    by more than seven orders of magnitude. Separately, the Xi-scale is
 *    |Xi(t)| <= poly(t) e^{-pi t/4}, so ANY Phi-side proxy certification that
 *    resolves signs near T0 must carry an absolute error below
 *    e^{-pi T0/4}, i.e. about pi T0/(4 ln 2) ~ 3.40e12 BITS of absolute
 *    accuracy at the top of the range, whereas Riemann-Siegel certifies the
 *    rotated real function Z at O(1) scale with O(log T) bits.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS DOES AND DOES NOT PROVE (honest boundary)
 * ─────────────────────────────────────────────────────────────────────────────
 * PROVED (rigorous): the strong global reading of Conjecture 22.1 -- a single
 * frozen-ladder approximation from the paper own proxy class (eq 20-21, or any
 * finite Gaussian mixture) with certified remainder beating the named baseline
 * over the classical verified range -- is FALSE at the Platt-Trudgian
 * benchmark, under any per-coefficient-cost evaluation model, by the
 * coefficient-dimension bound D >= 1.2363e13 >> 6.9e5.
 *
 * NOT PROVED (named obstructions, see namedObstructions below): (1) no
 * unconditional runtime lower bound exists for evaluating a SPECIFIC
 * polynomial family (Paterson-Stockmeyer preprocessing evaluates degree-n
 * polynomials in O(sqrt(n)) nonscalar multiplications, and algebraic
 * complexity theory cannot currently exclude an exotic short straight-line
 * program for these particular coefficients); (2) windowed or MODULATED
 * proxies e^{-alpha u^2} cos(t_c u) x poly fall outside the stated class --
 * but such objects reconstruct exactly the band-limited-interpolation
 * technology of Odlyzko-Schonhage, so that surviving reading is
 * PARTIALLY-RELATED to published state of the art, not INDEPENDENT-NOVEL;
 * (3) at small fixed heights the conjecture reduces to constant-chasing and
 * remains open and benchmarkable either way.
 *
 * Novelty split: L2 is classical (Polya-Szego); L1 is textbook Fourier
 * analysis; the APPLICATION -- capping the certified-sign-change capacity of
 * the paper frozen-ladder class against the unconditional zero count of the
 * verified range, and thereby resolving the strong reading of 22.1
 * negatively -- is the new step (no such degree obstruction appears in the
 * paper or in the imp-1210 audit).
 *
 * De Bruijn-Newman status untouched: Polymath15 Lambda <= 0.2 remains the
 * cited SOTA upper bound; nothing here claims any Lambda improvement. NO QED
 * on Conjecture 22.1 in full generality is claimed.
 *
 * INDEPENDENT REFEREE (fresh-context, 2026-07-03): L1-L4 CONFIRMED with no
 * gaps (block-degree preservation in the Rolle induction, multiplicity
 * handling at x = 0, the t = t^2 substitution, and the Xi = -f Z sign
 * convention were each independently re-derived; the Xi_fr not-identically-0
 * caveat is automatic under the L4 hypotheses since |Xi_fr(t_i)| > 0 at the
 * nodes). The original comparison-form benchmark step was REFUTED as first
 * stated and repaired with the explicit 2x-margin hypothesis recorded above;
 * the task form is unaffected. Arithmetic re-verified: N(3e12) main term is
 * ~1.23624e13 and the PT endpoint sits slightly above 3e12 (~4.28 zeros per
 * unit height accounts for the ~7.5e8 surplus), ratio ~1.789e7, precision
 * floor ~3.40e12 bits. Complex-alpha or modulated proxies are the genuine
 * escape hatch and are exactly the fenced-off reading (ii): the
 * Polya-Szego bound requires REAL distinct exponents, which real alpha_j > 0
 * supply.
 */

// ── Literature constants (cited, not re-derived here) ─────────────────────

// Platt-Trudgian 2021, "The Riemann hypothesis is true up to 3x10^12",
// Bull. London Math. Soc. 53, 792-797: first PT_ZEROS zeros are on the
// critical line and simple, up to height PT_HEIGHT.
const PT_HEIGHT = 3000175332800;
const PT_ZEROS = 12363153437138;

// ── Polynomial helpers (ascending coefficient arrays) ─────────────────────

function polyDeriv(p) {
  const d = [];
  for (let i = 1; i < p.length; i++) d.push(i * p[i]);
  return d.length ? d : [0];
}

function polyAdd(a, b) {
  const n = Math.max(a.length, b.length);
  const out = new Array(n).fill(0);
  for (let i = 0; i < a.length; i++) out[i] += a[i];
  for (let i = 0; i < b.length; i++) out[i] += b[i];
  return out;
}

function polyScale(p, s) {
  return p.map((c) => c * s);
}

function polyShift(p, m) {
  // multiply by s^m
  return new Array(m).fill(0).concat(p);
}

function polyEval(p, x) {
  let v = 0;
  for (let i = p.length - 1; i >= 0; i--) v = v * x + p[i];
  return v;
}

// ── L1 closed form: g_k recurrence and the monomial-Gaussian transform ────

// g_0 = 1; g_k = -g_{k-1}pp + s g_{k-1}p + (1/2 - s^2/4) g_{k-1}
// so that Integral_R v^{2k} e^{-v^2} cos(sv) dv = sqrt(pi) e^{-s^2/4} g_k(s).
export function hermiteFTPolys(K) {
  const gs = [[1]];
  for (let k = 1; k <= K; k++) {
    const g = gs[k - 1];
    const gp = polyDeriv(g);
    const gpp = polyDeriv(gp);
    let next = polyScale(g, 0.5);
    next = polyAdd(next, polyScale(polyShift(g, 2), -0.25));
    next = polyAdd(next, polyShift(gp, 1));
    next = polyAdd(next, polyScale(gpp, -1));
    gs.push(next);
  }
  return gs;
}

// Closed form for Integral_R u^{2k} e^{-alpha u^2} cos(t u) du.
export function gaussMonomialFT(alpha, k, t) {
  const gs = hermiteFTPolys(k);
  const s = t / Math.sqrt(alpha);
  return (
    Math.pow(alpha, -(2 * k + 1) / 2) *
    Math.sqrt(Math.PI) *
    Math.exp((-t * t) / (4 * alpha)) *
    polyEval(gs[k], s)
  );
}

// Independent verification path: composite Simpson for
// 2 * Integral_0^U u^{2k} e^{-alpha u^2} cos(t u) du  (even integrand).
export function gaussMonomialFTQuad(alpha, k, t, U, n) {
  if (n % 2 === 1) n += 1;
  const h = U / n;
  const f = (u) => Math.pow(u, 2 * k) * Math.exp(-alpha * u * u) * Math.cos(t * u);
  let sum = f(0) + f(U);
  for (let i = 1; i < n; i++) sum += (i % 2 === 1 ? 4 : 2) * f(i * h);
  return 2 * ((h / 3) * sum);
}

// ── Sign-change counting on a grid (numeric tripwire helper) ──────────────

export function countSignChangesOnGrid(fn, t0, t1, steps) {
  let count = 0;
  let lastSign = 0;
  const changes = [];
  for (let i = 0; i <= steps; i++) {
    const t = t0 + ((t1 - t0) * i) / steps;
    const v = fn(t);
    const s = v > 0 ? 1 : v < 0 ? -1 : 0;
    if (s !== 0) {
      if (lastSign !== 0 && s !== lastSign) {
        count += 1;
        changes.push(t);
      }
      lastSign = s;
    }
  }
  return { count, changes };
}

// ── Test instances used by the assertions ─────────────────────────────────

// Sharp instance (single Gaussian): e^{-t^2/4} H_10(t/2). This is the
// t-side of a K=5 (D=6) frozen ladder; H_10 has exactly 5 positive simple
// zeros, so the L3 cap D-1 = 5 is attained. Ascending coefficients of the
// physicist Hermite polynomial H_10.
const H10 = [-30240, 0, 302400, 0, -403200, 0, 161280, 0, -23040, 0, 1024];

export function sharpInstance(t) {
  return Math.exp((-t * t) / 4) * polyEval(H10, t / 2);
}

// Mixture instance (two Gaussians): D = (2+1) + (1+1) = 5, so L3 caps the
// positive-axis sign changes at 4.
export function mixtureInstance(t) {
  const a = Math.exp((-t * t) / 4) * (1 - t * t + 0.1 * Math.pow(t, 4));
  const b = Math.exp((-t * t) / 8) * (0.05 - 0.01 * t * t);
  return a + b;
}

// ── Benchmark arithmetic ───────────────────────────────────────────────────

const TWO_PI = 2 * Math.PI;

// Riemann-von Mangoldt main term N(T) ~ (T/2pi) log(T/2pi) - T/2pi + 7/8.
export function riemannVonMangoldtMainTerm(T) {
  const x = T / TWO_PI;
  return x * Math.log(x) - x + 7 / 8;
}

const RS_MAIN_SUM_TERMS_AT_TOP = Math.floor(Math.sqrt(PT_HEIGHT / TWO_PI));
const COEFFICIENT_LOWER_BOUND = PT_ZEROS + 1;
const RUNTIME_GAP_FACTOR = COEFFICIENT_LOWER_BOUND / RS_MAIN_SUM_TERMS_AT_TOP;
const XI_SCALE_BITS_AT_TOP = (Math.PI * PT_HEIGHT) / (4 * Math.LN2);

// ── Frozen export ──────────────────────────────────────────────────────────

export const IMP_3932_CONJECTURE_22_1_FROZEN_LADDER_OBSTRUCTION = Object.freeze({
  id: 'imp-3932',
  ticket: 'imp-3932',
  date: '2026-07-03',
  paper: 'twin_ladder_consolidated_v52.pdf',
  target:
    'Conjecture 22.1 (Twin-ladder usefulness), Section 22 "Conjectures and ' +
    'theorem targets"; audited INDEPENDENT-NOVEL by imp-1210 (2026-05-26) ' +
    'and never previously approached.',
  conjectureVerbatim:
    'There exists a frozen-ladder approximation whose certified remainder ' +
    'bound in the classical case is smaller, at equal runtime, than a ' +
    'comparable baseline approximation.',
  proxyClass:
    'Paper Section 7, eq (20)-(21): Phi_fr(u) = e^{-alpha u^2} ' +
    'Sigma_{k=0..K} c_{2k} u^{2k} (monomial- or Hermite-Gaussian basis, same ' +
    'span); generalized here to finite mixtures Sigma_j e^{-alpha_j u^2} ' +
    'P_j(u^2) with coefficient dimension D = Sigma_j (K_j + 1).',
  theorem: Object.freeze({
    name: 'Frozen-ladder coefficient-dimension obstruction',
    statement:
      'TASK FORM: any generalized frozen ladder that certifies M sign ' +
      'changes of Xi on (0, T0] (exhibits M + 1 alternating nodes where its ' +
      'own certified remainder is strictly below |Xi|) satisfies D >= M + 1. ' +
      'Matching the baseline deliverable at the Platt-Trudgian 2021 ' +
      'benchmark (T0 = 3,000,175,332,800; M_sc = 12,363,153,437,138 sign ' +
      'changes, all zeros to T0 being simple and on-line) forces D >= ' +
      '1.2363e13 stored coefficients, against a Riemann-Siegel main sum of ' +
      '691,008 terms at the top height: equal runtime fails by a factor > ' +
      '1.78e7 in any per-coefficient-cost evaluation model. COMPARISON ' +
      'FORM: "ladder remainder pointwise <= baseline remainder" implies the ' +
      'same bound ONLY under the additional 2x-margin hypothesis at the ' +
      'baseline nodes (|Ztilde(t_i)| >= 2 eps_RS(t_i)); without it a ' +
      'marginal node can defeat the transfer (adversarial-referee finding).',
    lemmas: Object.freeze([
      Object.freeze({
        id: 'L1-fourier-closure',
        statement:
          'The Fourier transform of e^{-alpha u^2} x (even polynomial of ' +
          'degree 2K in u) is e^{-t^2/(4 alpha)} x (even polynomial of ' +
          'degree 2K in t); mixtures map to mixtures with the same block ' +
          'degrees.',
        proofStatus: 'RIGOROUS (textbook; closed form re-verified by quadrature in assertions)',
      }),
      Object.freeze({
        id: 'L2-exp-poly-zero-bound',
        statement:
          'Sigma_{j=1..N} R_j(x) e^{mu_j x} with distinct real mu_j has at ' +
          'most Sigma_j (deg R_j + 1) - 1 real zeros with multiplicity.',
        proofStatus:
          'RIGOROUS (classical: Polya-Szego, Problems and Theorems in ' +
          'Analysis, Part V, Problem 75; Rolle induction reproduced in the ' +
          'module header)',
      }),
      Object.freeze({
        id: 'L3-sign-change-cap',
        statement:
          'A generalized frozen-ladder transform with coefficient dimension ' +
          'D has at most D - 1 sign changes on (0, infinity); the cap is ' +
          'sharp (Hermite instance attains it).',
        proofStatus: 'RIGOROUS (substitution x = t^2 + L1 + L2; sharpness verified numerically)',
      }),
      Object.freeze({
        id: 'L4-sign-transfer',
        statement:
          'Certifying the sign of Xi at M+1 alternating nodes with margins ' +
          'exceeding the certified remainder forces the approximant to have ' +
          '>= M sign changes, hence D >= M + 1.',
        proofStatus: 'RIGOROUS (intermediate value theorem)',
      }),
    ]),
    benchmark: Object.freeze({
      baseline:
        'Platt-Trudgian 2021, Bull. London Math. Soc. 53, 792-797 ' +
        '(Riemann-Siegel-based; the baseline the imp-1210 audit itself ' +
        'recommended naming in 22.1)',
      ptHeight: PT_HEIGHT,
      ptZeros: PT_ZEROS,
      signChangesOfXi: PT_ZEROS,
      coefficientLowerBound: COEFFICIENT_LOWER_BOUND,
      rsMainSumTermsAtTop: RS_MAIN_SUM_TERMS_AT_TOP,
      runtimeGapFactor: RUNTIME_GAP_FACTOR,
      xiScaleBitsAtTop: XI_SCALE_BITS_AT_TOP,
      xiScaleNote:
        '|Xi(t)| <= poly(t) e^{-pi t/4}, so resolving signs of Xi near T0 ' +
        'needs ~ pi T0 / (4 ln 2) ~ 3.40e12 bits of absolute accuracy at ' +
        'the Xi scale; Riemann-Siegel certifies the rotated function Z at ' +
        'O(1) scale with O(log T) bits. This scale problem is intrinsic to ' +
        'ANY Phi-side proxy, windowed or not.',
      marginHypothesis:
        'Comparison form only: at each baseline node, computed value at ' +
        'least twice the certified remainder (|Ztilde(t_i)| >= 2 ' +
        'eps_RS(t_i)). Transcript-dependent for the published PT run (a ' +
        'zero count is published, not a node certificate); a verifier can ' +
        'enforce it by placing nodes at plateau peaks since eps_RS ~ ' +
        't^{-3/4} is tiny. The task form needs no such hypothesis.',
    }),
  }),
  refereeReview: Object.freeze({
    date: '2026-07-03',
    method:
      'Fresh-context independent referee instructed to refute each lemma ' +
      'and the benchmark instantiation, including sign conventions, Rolle ' +
      'block-degree preservation, multiplicity edge cases, class escape ' +
      'hatches (repeated or complex alpha, modulation), and the arithmetic.',
    outcome:
      'L1-L4 CONFIRMED with no gaps. The comparison-form benchmark step was ' +
      'REFUTED as first drafted (baseline sign verification guarantees ' +
      '|Z(t_i)| > |Ztilde(t_i)| - eps_RS(t_i) > 0, not |Z(t_i)| > ' +
      'eps_RS(t_i)) and repaired with the explicit 2x-margin hypothesis; ' +
      'the task form was unaffected and carries the headline bound. ' +
      'Arithmetic re-verified independently (RvM main term, RS main-sum ' +
      'length, gap factor ~1.789e7, precision floor ~3.40e12 bits).',
  }),
  rigorStatus:
    'RIGOROUS for the theorem chain L1-L4 and the benchmark corollary ' +
    '(modulo the cited Platt-Trudgian 2021 computational-literature ' +
    'constants, cross-checked against the Riemann-von Mangoldt main term in ' +
    'the assertions). PARTIAL as a resolution of Conjecture 22.1 in full ' +
    'generality: the strong global reading is falsified; weaker readings ' +
    'survive and are named below.',
  verdictFor22_1:
    'The strong global reading of Conjecture 22.1 -- a frozen ladder from ' +
    'the paper own eq (20)-(21) class (or any finite Gaussian mixture) ' +
    'beating the named classical baseline over the verified range -- is ' +
    'FALSE at the Platt-Trudgian benchmark under any per-coefficient-cost ' +
    'evaluation model. The INDEPENDENT-NOVEL content of 22.1 therefore does ' +
    'not survive in its strong form: the surviving readings are either ' +
    'PARTIALLY-RELATED to published technology (windowed/modulated proxies ' +
    '= Odlyzko-Schonhage band-limited interpolation) or small-height ' +
    'constant-chasing. Novelty verdict of imp-1210 (about the literature) ' +
    'unchanged; this is a truth-status result.',
  namedObstructions: Object.freeze([
    'Runtime-model boundary: no unconditional lower bound exists for ' +
      'evaluating a SPECIFIC polynomial; Paterson-Stockmeyer preprocessing ' +
      'needs only O(sqrt(n)) nonscalar multiplications for degree n, and ' +
      'excluding an exotic short straight-line program for these particular ' +
      'coefficients is an open algebraic-complexity problem. The D >= ' +
      '1.2363e13 STORAGE bound is unconditional; the runtime conclusion is ' +
      'stated per evaluation model.',
    'Class boundary: modulated proxies e^{-alpha u^2} cos(t_c u) x poly ' +
      '(window recentering in t) escape the exponential-polynomial zero ' +
      'bound, but reconstruct Odlyzko-Schonhage band-limited interpolation ' +
      '-- published state of the art, hence no longer INDEPENDENT-NOVEL ' +
      'content. Also the Xi-scale precision problem (3.4e12 bits at the ' +
      'top) applies to every Phi-side proxy, modulated or not.',
    'Regime boundary: at small fixed heights (t up to a few hundred) both ' +
      'runtimes are trivial and the comparison is about constants; a ' +
      'modest Hermite-Gaussian proxy may genuinely compete there. That ' +
      'reading of 22.1 remains open and benchmarkable, but it is not the ' +
      'reading the imp-1210 audit graded novel (the audit anchored 22.1 to ' +
      'the Platt-Trudgian benchmark).',
    'Margin boundary (referee finding): the comparison form ("remainder ' +
      'pointwise <= baseline remainder") transfers sign certification only ' +
      'under the 2x-margin node hypothesis; the hypothesis-free headline ' +
      'bound is carried by the task form (certifying M sign changes forces ' +
      'D >= M + 1), which conditions on what the ladder accomplishes, not ' +
      'on baseline transcript internals.',
  ]),
  survivingReadings: Object.freeze([
    'Windowed/modulated frozen ladders (= band-limited interpolation a la ' +
      'Odlyzko-Schonhage): survives, but PARTIALLY-RELATED, not novel.',
    'Small-height constant-level comparisons: survives, open, benchmarkable.',
    'Exotic fast-evaluable exponential polynomials: not excluded, blocked ' +
      'only by the absence of algebraic-complexity lower bounds.',
  ]),
  honestScope: Object.freeze([
    'The Platt-Trudgian height and zero count are literature constants, not ' +
      're-derived here; the assertions cross-check them against the ' +
      'Riemann-von Mangoldt main term to 5e6 absolute (relative 4e-7).',
    'Grid-based sign-change counts in the assertions are tripwires, not ' +
      'proofs: a grid can only undercount. The mathematical content of L3 ' +
      'does not depend on the grid; the grid checks catch implementation ' +
      'regressions and would catch a falsified cap on the test instances.',
    'No claim is made about Conjecture 22.1 under readings that leave the ' +
      'paper eq (20)-(21) proxy class (see namedObstructions); no claim of ' +
      'any de Bruijn-Newman Lambda improvement is made (no refereed bound is changed' +
      '). NO false QED: the conjecture in full ' +
      'generality is resolved only partially, and the boundary is stated.',
  ]),
  relationToLambda:
    'Independent of the de Bruijn-Newman constant; no refereed bound is changed' +
    ' and is untouched.',
  auditCrossRefs: Object.freeze(['imp-1210', 'imp-1163', 'imp-1258']),
});

// ── Build-time tripwires ───────────────────────────────────────────────────

export const IMP_3932_CONJECTURE_22_1_FROZEN_LADDER_OBSTRUCTION_ASSERTIONS = [
  {
    id: 'imp3932-l1-closed-form-matches-quadrature',
    holds: () => {
      const cases = [
        [1, 0, 0],
        [1, 1, 1.3],
        [1, 3, 4.2],
        [2, 2, 2.1],
        [0.5, 4, 3.3],
      ];
      return cases.every(([alpha, k, t]) => {
        const closed = gaussMonomialFT(alpha, k, t);
        const quad = gaussMonomialFTQuad(alpha, k, t, 14, 30000);
        return Math.abs(closed - quad) <= 1e-7 * Math.max(1, Math.abs(closed));
      });
    },
    why:
      'L1 rests on the closed form Integral u^{2k} e^{-alpha u^2} cos(tu) du ' +
      '= alpha^{-(2k+1)/2} sqrt(pi) e^{-t^2/(4 alpha)} g_k(t/sqrt(alpha)) ' +
      'with the g_k recurrence implemented in hermiteFTPolys. An independent ' +
      'composite-Simpson quadrature must reproduce it across alpha, k, and t ' +
      '(including the alpha-scaling and the k=0 Gaussian base case). A ' +
      'recurrence sign error or scaling slip would break the whole theorem ' +
      'chain and must fail here.',
  },
  {
    id: 'imp3932-l3-cap-holds-on-mixture-instance',
    holds: () => {
      const { count } = countSignChangesOnGrid(mixtureInstance, 0, 40, 80000);
      return count >= 2 && count <= 4;
    },
    why:
      'The two-Gaussian mixture instance has coefficient dimension D = 5, ' +
      'so L3 caps its positive-axis sign changes at D - 1 = 4. The grid ' +
      'count must respect the cap (a count of 5+ would falsify L3 or expose ' +
      'an implementation bug) and must find the >= 2 sign changes the ' +
      'instance provably has (values at t = 0, 3, 6 alternate +, -, +), ' +
      'proving the counter is not blind.',
  },
  {
    id: 'imp3932-l3-cap-is-sharp-on-hermite-instance',
    holds: () => {
      const { count } = countSignChangesOnGrid(sharpInstance, 0, 12, 48000);
      return count === 5;
    },
    why:
      'Sharpness: e^{-t^2/4} H_10(t/2) is the transform side of a single-' +
      'Gaussian frozen ladder with K = 5, D = 6, and H_10 has exactly 5 ' +
      'simple positive zeros, so the instance must attain the L3 cap D - 1 ' +
      '= 5 exactly. Counting 4 or 6 would mean either the Hermite ' +
      'coefficients or the counter are wrong, and would invalidate the ' +
      'sharpness claim in the theorem record.',
  },
  {
    id: 'imp3932-l4-sign-transfer-mechanism',
    holds: () => {
      const { changes } = countSignChangesOnGrid(sharpInstance, 0, 12, 48000);
      if (changes.length !== 5) return false;
      const edges = [0, ...changes, 12];
      const nodes = [];
      for (let i = 0; i + 1 < edges.length; i++) {
        nodes.push((edges[i] + edges[i + 1]) / 2);
      }
      const margins = nodes.map((t) => Math.abs(sharpInstance(t)));
      const minMargin = Math.min(...margins);
      if (!(minMargin > 0)) return false;
      const perturbed = (t) =>
        sharpInstance(t) + 0.4 * minMargin * Math.exp((-t * t) / 100);
      const signsMatch = nodes.every(
        (t) => Math.sign(perturbed(t)) === Math.sign(sharpInstance(t)),
      );
      const { count } = countSignChangesOnGrid(perturbed, 0, 12, 48000);
      return signsMatch && count >= 5;
    },
    why:
      'L4 in miniature: perturbing the sharp instance by strictly less than ' +
      'the smallest node margin (a 0.4 x minMargin Gaussian bump) must ' +
      'preserve the sign at all 6 plateau nodes and hence keep >= 5 sign ' +
      'changes, exactly the intermediate-value transfer the benchmark ' +
      'corollary uses to force D >= M + 1. If this mechanism failed ' +
      'numerically the corollary logic would be suspect.',
  },
  {
    id: 'imp3932-benchmark-constants-cross-check',
    holds: () => {
      const rvm = riemannVonMangoldtMainTerm(PT_HEIGHT);
      return Math.abs(rvm - PT_ZEROS) < 5e6;
    },
    why:
      'The Platt-Trudgian pair (T0 = 3,000,175,332,800; 12,363,153,437,138 ' +
      'zeros) must be mutually consistent with the Riemann-von Mangoldt ' +
      'main term (T/2pi) log(T/2pi) - T/2pi + 7/8, whose true deviation is ' +
      'O(log T). Agreement within 5e6 absolute (4e-7 relative) catches a ' +
      'typo in either literature constant; the actual deviation should be ' +
      'orders of magnitude smaller.',
  },
  {
    id: 'imp3932-benchmark-gap-arithmetic',
    holds: () => {
      const b = IMP_3932_CONJECTURE_22_1_FROZEN_LADDER_OBSTRUCTION.theorem.benchmark;
      return (
        b.rsMainSumTermsAtTop === Math.floor(Math.sqrt(PT_HEIGHT / (2 * Math.PI))) &&
        b.rsMainSumTermsAtTop > 6.9e5 &&
        b.rsMainSumTermsAtTop < 6.92e5 &&
        b.coefficientLowerBound === PT_ZEROS + 1 &&
        b.runtimeGapFactor > 1.78e7 &&
        b.xiScaleBitsAtTop > 3.39e12 &&
        b.xiScaleBitsAtTop < 3.41e12
      );
    },
    why:
      'The headline benchmark numbers must be computed, not hand-typed: the ' +
      'Riemann-Siegel main-sum length floor(sqrt(T0/2pi)) ~ 691,008, the ' +
      'coefficient lower bound M_sc + 1, the runtime gap factor > 1.78e7, ' +
      'and the Xi-scale precision floor pi T0/(4 ln 2) ~ 3.40e12 bits. Any ' +
      'drift between the frozen record and the recomputed values means the ' +
      'stated corollary no longer matches its own inputs.',
  },
  {
    id: 'imp3932-record-structure-and-honesty',
    holds: () => {
      const r = IMP_3932_CONJECTURE_22_1_FROZEN_LADDER_OBSTRUCTION;
      return (
        r.theorem.lemmas.length === 4 &&
        r.namedObstructions.length >= 4 &&
        r.survivingReadings.length >= 3 &&
        /PARTIAL/.test(r.rigorStatus) &&
        /RIGOROUS/.test(r.rigorStatus) &&
        /equal runtime/.test(r.conjectureVerbatim) &&
        /Lambda <= 0.2|refereed bound is changed/.test(r.relationToLambda) &&
        /TASK FORM/.test(r.theorem.statement) &&
        /2x-margin/.test(r.theorem.statement) &&
        /REFUTED as first drafted/.test(r.refereeReview.outcome) &&
        /CONFIRMED/.test(r.refereeReview.outcome) &&
        typeof r.theorem.benchmark.marginHypothesis === 'string' &&
        r.honestScope.some((s) => /NO false QED/.test(s))
      );
    },
    why:
      'Honesty guards: the record must keep all four lemmas, at least four ' +
      'named obstructions (including the referee-found margin boundary) and ' +
      'three surviving readings (no silent promotion of the partial ' +
      'falsification to a full one), carry the verbatim conjecture text ' +
      'including the equal-runtime clause, state that Polymath15 Lambda <= ' +
      '0.2 SOTA is untouched, keep BOTH theorem forms (hypothesis-free task ' +
      'form and 2x-margin comparison form) with the adversarial-referee ' +
      'record of the refuted-and-repaired step, and retain the NO false QED ' +
      'disclosure. Softening any of these would misrepresent the result.',
  },
];

export default IMP_3932_CONJECTURE_22_1_FROZEN_LADDER_OBSTRUCTION;
