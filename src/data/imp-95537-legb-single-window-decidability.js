/**
 * @module imp-95537-legb-single-window-decidability
 *
 * imp-95537 (proof-scoping / DECIDABILITY-AT-A-FIXED-WINDOW ASSESSMENT): the
 * imp-95436 SPLIT verdict leaves LEG B open -- the imp-95212 Fresnel-Airy port
 * still owes the envelope-domination inequality
 *   LamBar_paper(d)  <=  Lambda(E_V, d).
 * imp-95443 already scoped the UNIFORM version (all depths d, all N): it reduces
 * to a summable off-diagonal overlap-decay bound whose row-sum stays below the
 * known diagonal margin -- a decay-vs-margin scalar race. This module asks a
 * different, narrower question the ticket poses: is the SAME inequality
 * decidable at a SINGLE FIXED SEAM WINDOW (one fixed depth d, one fixed rate/
 * center configuration, one fixed matrix size N), and if so, what analytic
 * ingredient is actually missing? ASSESSMENT only; changes no bound; NO QED;
 * no refereed bound is changed; RH open.
 *
 * THE FIXED-WINDOW REDUCTION. At a fixed seam window everything on both sides is
 * a FIXED FINITE object. Both ratios are restricted-Rayleigh suprema over the
 * same signed coefficient space a in R^N with positive-definite denominators
 * (imp-95424):
 *   Lambda(E_V, d)  = sup_a (a^T A_m a)/(a^T B_m a) = lambda_max of pencil (A_m, B_m);
 *   LamBar_paper(d) = sup_a (a^T A_p a)/(a^T B_p a) = lambda_max of pencil (A_p, B_p).
 * With B_m, B_p positive definite (Gram matrices of linearly independent
 * packets), each supremum is ATTAINED and equals the largest generalized
 * eigenvalue of a definite matrix pencil -- a finite, exactly computable real
 * number (a root of det(A - lambda B) = 0). So at a fixed window the inequality
 * collapses to comparing two real numbers:
 *   decide  lambda_max(A_p, B_p)  <=  lambda_max(A_m, B_m).
 * This is DECIDABLE by finite linear algebra. Two consequences sharpen the
 * status of the whole LEG B program:
 *
 *   (D1) The fixed-window inequality is NOT where the difficulty lives. It is a
 *        mechanical generalized-eigenvalue comparison, not an unstructured PSD
 *        question and not undecidable. The genuine open content of LEG B is
 *        UNIFORMITY: the inequality must hold at EVERY depth d (and as N grows),
 *        and that uniform statement is exactly the imp-95443 decay-vs-margin
 *        race. A single-window decision is a necessary spot-check that yields NO
 *        uniform bound.
 *
 *   (D2) At a fixed window the DIRECT pencil comparison is SHARPER than the
 *        imp-95424 / imp-95443 Loewner-sandwich route. That route asks for the
 *        two-sided PSD sandwich DELTA_A = A_m - A_p >= 0 and DELTA_B = B_p - B_m
 *        >= 0, which is only SUFFICIENT (imp-95443). The witness below exhibits a
 *        fixed window where DELTA_A is INDEFINITE (the sandwich is inconclusive)
 *        yet the ratio inequality HOLDS -- so the sharp fixed-window decider is
 *        the direct lambda_max comparison, and a fixed window never needs the
 *        sandwich at all.
 *
 * WHAT INGREDIENT IS ACTUALLY MISSING (isolated). The fixed-window inequality is
 * decidable IN PRINCIPLE, but it cannot be RUN today for one concrete reason,
 * and that reason is NOT analytic: the numeric paper-window Gram entries A_p, B_p
 * -- the actual inner products of the paper packets restricted to s < 0 at that
 * window -- have never been emitted by the imp-95212 port at even one seam
 * window. The port currently supplies a GEOMETRIC RELABELING (rates, centers,
 * amplitude moduli via the imp-95220 width law), not the transcribed Gram matrix
 * NUMBERS. So the missing ingredient for the SINGLE-WINDOW question is a
 * DATA / TRANSCRIPTION ingredient (emit A_p, B_p numerically at one window),
 * after which the comparison is turnkey. This is categorically different from
 * the missing ingredient for the UNIFORM question (the imp-95443 summable
 * off-diagonal decay bound), and separating the two is the point of this
 * assessment: the fixed-window difficulty is DATA, the uniform difficulty is
 * ANALYSIS.
 *
 * NET SCOPE. LEG B splits cleanly along the window axis:
 *   - Per fixed window: DECIDABLE by direct definite-pencil lambda_max
 *     comparison; blocked ONLY by the missing numeric Gram transcription, not by
 *     any PSD-criterion or decidability gap. The Loewner sandwich is not even
 *     required here (it is merely sufficient and can be inconclusive).
 *   - Uniformly in d (and N): the genuine open content, governed by the
 *     imp-95443 decay-vs-margin race; a single-window decision gives no uniform
 *     bound and does not close LEG B.
 *
 * NUMERIC WITNESS (this module, exact 2x2, self-contained, ILLUSTRATIVE ONLY --
 * NOT paper-window Gram values). A fixed window with concrete definite pencils:
 * the direct comparison decides the inequality mechanically (paper 1.2101 <=
 * model 1.5316 => HOLDS); the Loewner sandwich is INCONCLUSIVE at the same
 * window (DELTA_A indefinite, min eigenvalue < 0) even though the inequality
 * holds -- confirming (D2). These matrices are hand-chosen to fix the linear-
 * algebra status; they are not a transcription of any paper packet.
 *
 * HONEST LIMITS. (a) ASSESSMENT only: no port re-run, no packet transcribed, no
 * numeric Gram entries derived, nothing moves a bound. (b) "Decidable at a fixed
 * window" is a statement about finite linear algebra CONDITIONAL on having the
 * numeric Gram data; this module does NOT supply that data, so it does not
 * actually decide LEG B at any real seam window. (c) A fixed-window decision, if
 * run, would be a spot-check only -- it yields no uniform bound and does not
 * close LEG B, whose substance is uniformity (imp-95443). (d) The witnesses are
 * small exact configurations illustrating the decidability and the sufficient-
 * not-necessary status of the sandwich, not paper-window Gram matrices. (e) Full
 * LEG B stays OPEN at imp-95212-subgap-fresnel-airy-envelope-port. Import-light
 * (no zeros bundle, no sibling imports; all facts restated as literals so this
 * module stays independently checkable). Changes no bound; NO QED; Platt-
 * Trudgian Lambda <= 0.2 remains SOTA; RH open.
 */

// -- exact 2x2 helpers, self-contained ---------------------------------------
function eigMinSym2(M) {
  // smaller eigenvalue of a real symmetric 2x2 [[a,b],[b,c]]
  const a = M[0][0], b = M[0][1], c = M[1][1];
  const tr = a + c;
  const disc = Math.sqrt((a - c) * (a - c) + 4 * b * b);
  return (tr - disc) / 2;
}
function genEigMaxSym2(A, B) {
  // largest generalized eigenvalue of a definite symmetric 2x2 pencil (A, B),
  // B positive definite: the larger root of det(A - lambda B) = 0, i.e.
  // (det B) lambda^2 - (a11 b22 + a22 b11 - 2 a12 b12) lambda + (det A) = 0.
  const a11 = A[0][0], a12 = A[0][1], a22 = A[1][1];
  const b11 = B[0][0], b12 = B[0][1], b22 = B[1][1];
  const alpha = b11 * b22 - b12 * b12; // det B > 0
  const beta = -(a11 * b22 + a22 * b11 - 2 * a12 * b12);
  const gamma = a11 * a22 - a12 * a12; // det A
  const disc = Math.sqrt(beta * beta - 4 * alpha * gamma);
  return (-beta + disc) / (2 * alpha);
}

// Model side (exponential envelope E_V): B_m Cauchy-like PD, A_m = D B_m D.
const B_M = [[1, 0.5], [0.5, 1]];
const A_M = [[1.44, 0.48], [0.48, 0.64]]; // = diag(1.2,0.8) * B_M * diag(1.2,0.8)
// Paper side (ILLUSTRATIVE fixed window, NOT transcribed paper Gram values).
const B_P = [[1.1, 0.45], [0.45, 1.05]];
const A_P = [[1.30, 0.40], [0.40, 0.60]];

const MODEL_LAM_MAX = genEigMaxSym2(A_M, B_M); // Lambda(E_V, d) at this window
const PAPER_LAM_MAX = genEigMaxSym2(A_P, B_P); // LamBar_paper(d) at this window
const INEQUALITY_HOLDS = PAPER_LAM_MAX <= MODEL_LAM_MAX;

// Loewner-sandwich route (imp-95424 / imp-95443), only SUFFICIENT:
const DELTA_A = [
  [A_M[0][0] - A_P[0][0], A_M[0][1] - A_P[0][1]],
  [A_M[0][1] - A_P[0][1], A_M[1][1] - A_P[1][1]],
];
const DELTA_B = [
  [B_P[0][0] - B_M[0][0], B_P[0][1] - B_M[0][1]],
  [B_P[0][1] - B_M[0][1], B_P[1][1] - B_M[1][1]],
];
const DELTA_A_EIGMIN = eigMinSym2(DELTA_A);
const DELTA_B_EIGMIN = eigMinSym2(DELTA_B);
const SANDWICH_CONCLUSIVE = DELTA_A_EIGMIN >= 0 && DELTA_B_EIGMIN >= 0;

export const IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY = {
  ticket: 'imp-95537',
  consumes: [
    'imp-95436 (SPLIT verdict: LEG B open)',
    'imp-95376 (FA-port admissibility assessment)',
    'imp-95424 (LEG B obligation ledger: Loewner sandwich O1/O2)',
    'imp-95443 (LEG B establishment routes: uniform decay-vs-margin race)',
    'imp-95212 (Fresnel-Airy envelope port, still open)',
  ],
  legBInequality: 'LamBar_paper(d) <= Lambda(E_V, d)',
  fixedWindowReduction:
    'at a single fixed seam window (fixed d, fixed rate/center config, fixed N) both sides are largest '
    + 'generalized eigenvalues of definite matrix pencils: Lambda(E_V,d)=lambda_max(A_m,B_m), '
    + 'LamBar_paper(d)=lambda_max(A_p,B_p), B_m/B_p positive definite. Each supremum is attained and exactly '
    + 'computable (a root of det(A - lambda B)=0), so the inequality collapses to comparing two real numbers -- '
    + 'DECIDABLE by finite linear algebra.',
  findings: {
    D1_difficulty_is_uniformity:
      'the fixed-window inequality is a mechanical generalized-eigenvalue comparison, not an unstructured PSD '
      + 'question and not undecidable. The genuine open content of LEG B is UNIFORMITY over depth d (and N) -- '
      + 'the imp-95443 decay-vs-margin race. A single-window decision is a necessary spot-check yielding NO '
      + 'uniform bound.',
    D2_direct_sharper_than_sandwich:
      'at a fixed window the DIRECT pencil comparison is sharper than the imp-95424/imp-95443 Loewner sandwich '
      + '(DELTA_A>=0 and DELTA_B>=0), which is only sufficient. The witness has DELTA_A INDEFINITE (sandwich '
      + 'inconclusive) yet the ratio inequality HOLDS, so a fixed window never needs the sandwich.',
  },
  missingIngredient:
    'DATA / TRANSCRIPTION, not analysis: the numeric paper-window Gram entries A_p, B_p (actual inner products '
    + 'of the paper packets restricted to s<0 at that window) have never been emitted by the imp-95212 port at '
    + 'even one seam window -- the port supplies a geometric relabeling (rates, centers, moduli via the '
    + 'imp-95220 width law), not the Gram NUMBERS. Emit A_p, B_p at one window and the comparison is turnkey. '
    + 'This is categorically different from the UNIFORM missing ingredient (the imp-95443 summable off-diagonal '
    + 'decay bound): fixed-window difficulty is DATA, uniform difficulty is ANALYSIS.',
  witness: {
    modelLamMax: MODEL_LAM_MAX,
    paperLamMax: PAPER_LAM_MAX,
    inequalityHolds: INEQUALITY_HOLDS,
    deltaAeigMin: DELTA_A_EIGMIN,
    deltaBeigMin: DELTA_B_EIGMIN,
    sandwichConclusive: SANDWICH_CONCLUSIVE,
    note:
      'ILLUSTRATIVE fixed window (NOT paper-window Gram values): direct comparison decides the inequality '
      + 'mechanically (paper 1.2101 <= model 1.5316 => HOLDS); the Loewner sandwich is inconclusive at the '
      + 'same window (DELTA_A indefinite, eigMin<0) even though the inequality holds -- confirming D2. Hand-'
      + 'chosen to fix the linear-algebra status, not a transcription of any paper packet.',
  },
  netScope:
    'LEG B splits along the window axis: per fixed window DECIDABLE by direct definite-pencil lambda_max '
    + 'comparison (blocked only by missing numeric Gram transcription, not by any PSD-criterion or decidability '
    + 'gap; the sandwich is not even required); uniformly in d and N the genuine open content (imp-95443 '
    + 'decay-vs-margin race). A single-window decision gives no uniform bound and does not close LEG B.',
  honest:
    'ASSESSMENT ONLY -- no port re-run, no packet transcribed, no numeric Gram entries derived; nothing moves '
    + 'a bound. "Decidable at a fixed window" is CONDITIONAL on having the numeric Gram data, which this module '
    + 'does NOT supply, so it does not actually decide LEG B at any real seam window. A fixed-window decision '
    + 'would be a spot-check only, no uniform bound, LEG B not closed (substance = uniformity, imp-95443). '
    + 'Witnesses are small exact configurations, not paper-window Gram matrices. Full LEG B stays OPEN at '
    + 'imp-95212-subgap-fresnel-airy-envelope-port. Changes no bound; NO QED; no refereed bound is changed'
    + '; RH open.',
  fns: { eigMinSym2, genEigMaxSym2 },
};

export const IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY_ASSERTIONS = [
  {
    id: 'imp-95537-fixed-window-comparison-decidable',
    description: 'at the fixed window both sides are finite generalized max-eigenvalues and the inequality is a '
      + 'mechanical comparison of two real numbers',
    holds: () =>
      Number.isFinite(MODEL_LAM_MAX)
      && Number.isFinite(PAPER_LAM_MAX)
      && Math.abs(MODEL_LAM_MAX - 1.531616) < 1e-5
      && Math.abs(PAPER_LAM_MAX - 1.210148) < 1e-5,
  },
  {
    id: 'imp-95537-inequality-holds-at-witness-window',
    description: 'the direct pencil comparison decides the inequality TRUE at the illustrative window (paper '
      + 'lambda_max <= model lambda_max)',
    holds: () => INEQUALITY_HOLDS === true && PAPER_LAM_MAX <= MODEL_LAM_MAX,
  },
  {
    id: 'imp-95537-direct-sharper-than-sandwich',
    description: 'the Loewner sandwich is INCONCLUSIVE at this window (DELTA_A indefinite) even though the '
      + 'inequality holds -- the direct comparison is the sharp fixed-window decider (D2)',
    holds: () => DELTA_A_EIGMIN < 0 && SANDWICH_CONCLUSIVE === false && INEQUALITY_HOLDS === true,
  },
  {
    id: 'imp-95537-missing-ingredient-is-data-not-analysis',
    description: 'the isolated missing ingredient for the single-window question is a DATA/TRANSCRIPTION gap '
      + '(numeric Gram entries from the port), distinct from the uniform decay-vs-margin analysis',
    holds: () =>
      /DATA \/ TRANSCRIPTION/.test(IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY.missingIngredient)
      && /imp-95443/.test(IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY.missingIngredient),
  },
  {
    id: 'imp-95537-assessment-only-honest',
    description: 'explicitly ASSESSMENT ONLY, no QED, no refereed bound is changed, RH open',
    holds: () =>
      /ASSESSMENT ONLY/.test(IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY.honest)
      && /NO QED/.test(IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY.honest)
      && /Lambda <= 0.2|refereed bound is changed/.test(IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY.honest)
      && /RH open/.test(IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY.honest),
  },
];

for (const a of IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95537-legb-single-window-decidability assertion failed: ${a.id}`);
  }
}

export default IMP95537_LEGB_SINGLE_WINDOW_DECIDABILITY;
