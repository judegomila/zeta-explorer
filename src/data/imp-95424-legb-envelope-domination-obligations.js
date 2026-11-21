/**
 * @module imp-95424-legb-envelope-domination-obligations
 *
 * imp-95424 (proof-scoping / OBLIGATION LEDGER): enumerate and assess the
 * analytic obligations of the imp-95376 LEG B envelope-domination inequality
 *   LamBar_paper(d)  <=  Lambda(E_V, d)
 * that the imp-95212 Fresnel-Airy envelope port must PROVE for a
 * count/depth-currency signed certificate value R to be admissible on the
 * paper packet actual seam functional. ASSESSMENT only; changes no bound; NO
 * QED; no refereed bound is changed.
 *
 * THE INEQUALITY (imp-95376 LEG B). imp-95376 split-verdict isolated the one
 * surviving ingredient of the seam port: not a quantity beside the port but a
 * statement INSIDE it. The certificate is a theorem about the imp-95226
 * exponential model E_V; for R = sqrt(Lambda(E_V, d)) to bound sqrt(LamBar) of
 * the ACTUAL Fresnel-Airy seam window, the port must majorize the paper
 * window restricted energy ratio by the transcribed exponential model. A port
 * that only IDENTIFIES (rate, center) pairs (a heuristic model substitution)
 * does NOT discharge this; the domination is the substance. This module names
 * precisely what "the domination" decomposes into and classifies each piece.
 *
 * THE TWO RAYLEIGH SUPS. Both sides are restricted-Rayleigh suprema over the
 * SAME finite signed coefficient space a in R^N:
 *   Lambda(E_V, d) = sup_a (a^T A_m a)/(a^T B_m a),  B_m = G,  A_m = D G D,
 *     G_ij = 1/(nu_i + nu_j) (Cauchy, imp-95226), D = diag(e^(-d nu_i));
 *   LamBar_paper(d) = sup_a (a^T A_p a)/(a^T B_p a),  B_p = full-line Gram of
 *     the paper alias packets {phi_n}, A_p = their restricted (s<0) Gram.
 * (R and LamBar are homogeneous of degree 0 in a -- imp-95139 scope -- so both
 * suprema are well-posed generalized-eigenvalue problems on the same space.)
 *
 * SUFFICIENT DECOMPOSITION (the ledger). If
 *   (O1)  B_p  >=  B_m   in PSD (Loewner) order   [denominator minorization]
 *   (O2)  A_p  <=  A_m   in PSD (Loewner) order   [numerator domination]
 * then for every a != 0, a^T A_p a <= a^T A_m a and 0 < a^T B_m a <= a^T B_p a,
 * hence rho_p(a) <= rho_m(a) <= Lambda(E_V, d), and taking the sup gives
 * LamBar_paper(d) <= Lambda(E_V, d). So LEG B REDUCES to a two-sided PSD Gram
 * sandwich (O1)+(O2) plus a coordinate alignment (O0) and a direction check
 * (O3). This decomposition is SUFFICIENT; it is not shown necessary (the
 * eigenvalue ordering could conceivably hold without the full Loewner sandwich),
 * so it is one honest route, possibly stronger than strictly required.
 *
 * THE OBLIGATIONS.
 *
 *   (O0) COORDINATE ALIGNMENT. Identify the paper window alias packets {phi_n}
 *        (grid G(p,D), paper eq 14/15) as the N basis functions and express
 *        LamBar_paper as the restricted Rayleigh sup on the SAME R^N as the
 *        model, with a matching count N and rate/center labels. STATUS:
 *        AVAILABLE-MODULO-MAP -- the imp-95220 width-law geometry map supplies
 *        (rate, center) = (mu(d), u(d)) per denominator d; both Gram matrices
 *        exist since the window is L^2. The map is geometry, not domination.
 *
 *   (O1) DENOMINATOR MINORIZATION  B_p >= B_m (PSD). The paper full-line Gram
 *        must sit ABOVE the Cauchy matrix in Loewner order. STATUS: OPEN.
 *        Only the DIAGONAL is controllable (single-packet total-energy
 *        normalization); the full PSD ordering carries cross-packet overlaps
 *        and is not implied by any pointwise envelope bound.
 *
 *   (O2) NUMERATOR DOMINATION  A_p <= A_m (PSD). The paper restricted (s<0)
 *        Gram must sit BELOW the model restricted Gram in Loewner order.
 *        STATUS: OPEN -- THE SUBSTANCE. The DIAGONAL restricted ratio (model
 *        (A_m)_ii/(B_m)_ii = e^(-2 d nu_i) vs the Fresnel-Airy tail mass) is
 *        the FA-2 / imp-95255 y_min-bracket piece and is understood. The
 *        OFF-DIAGONAL / full-PSD control is NOT: pointwise envelope
 *        (magnitude) domination of the packets does NOT imply Loewner ordering
 *        of their Gram matrices, because the quadratic form a^T A a on a
 *        SIGNED a mixes off-diagonal signs (see NUMERIC WITNESS).
 *
 *   (O3) DIRECTION OF THE TRANSCRIPTION. The (mu(d), u(d)) identification and
 *        the per-block angle sigma_k must be chosen so the MODEL over-estimates
 *        (never under-). STATUS: PARTIAL -- imp-95255 FA-2 gives the diagonal
 *        bracket x_min <= y_min <= 2 x_min and imp-95425 tracks the SPLIT-LOO
 *        sigma_k upper-bound direction (secondary check S1). The diagonal
 *        direction is pinned; the full-matrix direction rides on O1/O2.
 *
 * WHAT IS AVAILABLE vs OPEN.
 *   AVAILABLE: the model side entirely (imp-95226 closed forms, Cauchy G, D G D);
 *     the geometry map (imp-95220); the diagonal ratios and their direction
 *     (imp-95255 FA-2 bracket, y_min collapse). These discharge O0 and the
 *     DIAGONAL of O1/O2 and the diagonal part of O3.
 *   OPEN: the OFF-DIAGONAL / full Loewner content of O1 and O2 -- i.e. a
 *     two-sided PSD Gram sandwich between the Fresnel-Airy window Gram matrices
 *     and the exponential-model Gram matrices. This is exactly the substance of
 *     the still-open imp-95212-subgap-fresnel-airy-envelope-port; it is not
 *     automatic from the geometry map and is not proved here.
 *
 * NUMERIC WITNESS (this module, exact 2x2). Why O2 is non-trivial: a numerator
 * matrix A_flip that is ENTRYWISE-MAGNITUDE-EQUAL to the model numerator A_m
 * (same |entries|, one off-diagonal sign flipped) has a restricted-Rayleigh
 * sup Lambda(A_flip, G) that EXCEEDS Lambda(A_m, G) by ~2x on the imp-95376
 * (nu, d) configuration. So controlling packet MAGNITUDES (an envelope bound)
 * is insufficient for the certificate ordering -- the SIGN structure of the
 * off-diagonal cross energies matters, and O2 genuinely requires Loewner
 * (not entrywise) control. Conversely, when a true PSD ordering DOES hold
 * (A_p = c A_m with 0 < c <= 1, so A_p <= A_m in Loewner order, B_p = B_m),
 * the sufficient decomposition fires: Lambda(A_p, G) = c Lambda(A_m, G) <=
 * Lambda(A_m, G), confirming (O1)+(O2) => LEG B.
 *
 * HONEST LIMITS. (a) ASSESSMENT only: nothing derives or moves a bound; it
 * enumerates and classifies the port obligations. (b) The sufficient
 * decomposition (O1)+(O2) is one route; it is not shown necessary. (c) The
 * numeric witness is a single 2x2 configuration illustrating the general
 * linear-algebra fact that entrywise-magnitude domination does not imply
 * Loewner ordering under a signed Rayleigh quotient -- it is not a
 * paper-window computation. (d) O1/O2 off-diagonal remain OPEN, named as the
 * substance of imp-95212-subgap-fresnel-airy-envelope-port. Import-light (no
 * zeros bundle, no sibling imports). Changes no bound; NO QED; no refereed bound is changed
 * ; measured class sup unchanged.
 */

// -- imp-95226 signed 2x2 pencil, self-contained (matches imp-95376) ----------
const NU1 = 1.0;
const NU2 = 2.5;
const DEPTH = 1.0;
const W1 = Math.exp(-DEPTH * NU1);
const W2 = Math.exp(-DEPTH * NU2);

// denominator Gram B_m = G (Cauchy), numerator A_m = D G D (model side)
const G = [
  [1 / (2 * NU1), 1 / (NU1 + NU2)],
  [1 / (NU1 + NU2), 1 / (2 * NU2)],
];
const A_M = [
  [W1 * W1 * G[0][0], W1 * W2 * G[0][1]],
  [W1 * W2 * G[1][0], W2 * W2 * G[1][1]],
];

// larger generalized eigenvalue of (A, B): the restricted-Rayleigh sup
function lambdaMax(A, B) {
  const a = A[0][0], b = A[0][1], dd = A[1][1];
  const p = B[0][0], r = B[0][1], q = B[1][1];
  const AA = p * q - r * r;
  const BB = a * q + dd * p - 2 * b * r;
  const CC = a * dd - b * b;
  const disc = Math.sqrt(BB * BB - 4 * AA * CC);
  return (BB + disc) / (2 * AA);
}

const LAMBDA_MODEL = lambdaMax(A_M, G);

// witness: entrywise-magnitude-equal numerator with a flipped off-diagonal sign
const A_FLIP = [
  [A_M[0][0], -A_M[0][1]],
  [-A_M[1][0], A_M[1][1]],
];
const LAMBDA_FLIP = lambdaMax(A_FLIP, G);

// sufficient-decomposition witness: A_p = c A_m (0 < c <= 1) is <= A_m in
// Loewner order (A_m is PSD), B_p = B_m; the sup scales by c
const C_SHRINK = 0.8;
const A_SHRINK = [
  [C_SHRINK * A_M[0][0], C_SHRINK * A_M[0][1]],
  [C_SHRINK * A_M[1][0], C_SHRINK * A_M[1][1]],
];
const LAMBDA_SHRINK = lambdaMax(A_SHRINK, G);

export const IMP95424_LEGB_ENVELOPE_DOMINATION = {
  ticket: 'imp-95424',
  consumes: ['imp-95376 (LEG B split verdict)', 'imp-95226 (E_V pencil model)',
    'imp-95255 (y_min/theta map)', 'imp-95220 (width-law geometry map)'],
  legBInequality: 'LamBar_paper(d) <= Lambda(E_V, d)',
  sufficientDecomposition:
    '(O1) B_p >= B_m (PSD) AND (O2) A_p <= A_m (PSD) => rho_p(a) <= rho_m(a) for all a => '
    + 'LamBar_paper(d) <= Lambda(E_V, d). Sufficient, not shown necessary.',
  obligations: [
    {
      id: 'O0',
      name: 'coordinate alignment',
      statement: 'identify paper alias packets {phi_n} as the N model basis functions on the same R^N; '
        + 'express LamBar_paper as a restricted Rayleigh sup with matching count and (rate,center) labels',
      status: 'AVAILABLE-MODULO-MAP',
      basis: 'imp-95220 width-law geometry map supplies (mu(d),u(d)); both Grams exist (window is L^2)',
    },
    {
      id: 'O1',
      name: 'denominator minorization  B_p >= B_m (PSD)',
      statement: 'paper full-line Gram sits ABOVE the Cauchy matrix in Loewner order',
      status: 'OPEN (diagonal only)',
      basis: 'single-packet total-energy normalization controls the diagonal; full PSD ordering carries '
        + 'cross-packet overlaps not implied by any pointwise envelope bound',
    },
    {
      id: 'O2',
      name: 'numerator domination  A_p <= A_m (PSD) -- THE SUBSTANCE',
      statement: 'paper restricted (s<0) Gram sits BELOW the model restricted Gram in Loewner order',
      status: 'OPEN (off-diagonal)',
      basis: 'DIAGONAL restricted ratio e^(-2 d nu_i) vs Fresnel-Airy tail mass = FA-2/imp-95255 y_min bracket '
        + '(understood); OFF-DIAGONAL Loewner control is NOT implied by pointwise envelope (magnitude) '
        + 'domination, because a signed a mixes off-diagonal cross-energy signs (see witness)',
    },
    {
      id: 'O3',
      name: 'direction of the transcription',
      statement: '(mu(d),u(d)) and block angles sigma_k chosen so the model OVER-estimates (never under-)',
      status: 'PARTIAL',
      basis: 'imp-95255 FA-2 diagonal bracket x_min <= y_min <= 2 x_min; imp-95425 tracks SPLIT-LOO '
        + 'sigma_k upper-bound direction (S1); full-matrix direction rides on O1/O2',
    },
  ],
  available: 'model side entirely (imp-95226 closed forms, Cauchy G, D G D); geometry map (imp-95220); '
    + 'diagonal ratios and their direction (imp-95255 FA-2 bracket, y_min collapse) -- discharge O0 and the '
    + 'DIAGONAL of O1/O2/O3',
  open: 'the OFF-DIAGONAL / full Loewner content of O1 and O2 -- a two-sided PSD Gram sandwich between the '
    + 'Fresnel-Airy window Gram matrices and the exponential-model Gram matrices; the substance of the '
    + 'still-open imp-95212-subgap-fresnel-airy-envelope-port, NOT automatic from the geometry map',
  config: { nu: [NU1, NU2], depth: DEPTH },
  lambdaModel: LAMBDA_MODEL,
  witness: {
    entrywiseMagnitudeEqualButLarger: {
      lambdaModel: LAMBDA_MODEL,
      lambdaFlip: LAMBDA_FLIP,
      ratio: LAMBDA_FLIP / LAMBDA_MODEL,
      note: 'A_flip has the SAME |entries| as A_m (one off-diagonal sign flipped) yet its signed-Rayleigh '
        + 'sup EXCEEDS the model -- envelope/magnitude domination is insufficient for O2',
    },
    loewnerShrinkFires: {
      c: C_SHRINK,
      lambdaShrink: LAMBDA_SHRINK,
      note: 'A_p = c A_m (0<c<=1) IS <= A_m in Loewner order, B_p = B_m; the sup scales by c <= 1, '
        + 'confirming (O1)+(O2) => LEG B when a true PSD ordering holds',
    },
  },
  honest:
    'ASSESSMENT ONLY -- no port re-run, no packet transcribed, no certificate instantiated on a paper '
    + 'window; the sufficient decomposition (O1)+(O2) is one route, not shown necessary; the numeric '
    + 'witness is one 2x2 configuration illustrating that entrywise-magnitude domination does not imply '
    + 'Loewner ordering under a signed Rayleigh quotient; O1/O2 off-diagonal remain OPEN as the substance '
    + 'of imp-95212-subgap-fresnel-airy-envelope-port. Changes no bound; NO QED; no refereed bound is changed'
    + '.',
  fns: { lambdaMax },
};

export const IMP95424_LEGB_ENVELOPE_DOMINATION_ASSERTIONS = [
  {
    id: 'imp-95424-model-lambda-positive-finite',
    description: 'the model restricted-Rayleigh sup is a finite positive number',
    holds: () => Number.isFinite(LAMBDA_MODEL) && LAMBDA_MODEL > 0,
  },
  {
    id: 'imp-95424-witness-entrywise-magnitude-equal',
    description: 'A_flip is entrywise-magnitude-equal to A_m (same |entries|)',
    holds: () =>
      Math.abs(Math.abs(A_FLIP[0][0]) - Math.abs(A_M[0][0])) <= 1e-15
      && Math.abs(Math.abs(A_FLIP[0][1]) - Math.abs(A_M[0][1])) <= 1e-15
      && Math.abs(Math.abs(A_FLIP[1][1]) - Math.abs(A_M[1][1])) <= 1e-15,
  },
  {
    id: 'imp-95424-magnitude-domination-insufficient',
    description: 'entrywise-magnitude equality does NOT bound the signed-Rayleigh sup: Lambda(A_flip,G) '
      + 'strictly exceeds Lambda(A_m,G) -- O2 needs Loewner, not envelope, control',
    holds: () => LAMBDA_FLIP > LAMBDA_MODEL * (1 + 1e-9),
  },
  {
    id: 'imp-95424-loewner-shrink-fires',
    description: 'a true Loewner ordering A_p = c A_m (0<c<=1), B_p = B_m gives Lambda(A_p,G) = c Lambda(A_m,G) '
      + '<= Lambda(A_m,G) -- the sufficient decomposition works when the PSD ordering holds',
    holds: () =>
      Math.abs(LAMBDA_SHRINK - C_SHRINK * LAMBDA_MODEL) <= 1e-12 * LAMBDA_MODEL
      && LAMBDA_SHRINK <= LAMBDA_MODEL + 1e-12,
  },
  {
    id: 'imp-95424-ledger-open-legs-named',
    description: 'O1 and O2 are recorded OPEN and O2 is flagged THE SUBSTANCE; O0 available-modulo-map, O3 partial',
    holds: () => {
      const o = IMP95424_LEGB_ENVELOPE_DOMINATION.obligations;
      const byId = Object.fromEntries(o.map((x) => [x.id, x]));
      return /AVAILABLE-MODULO-MAP/.test(byId.O0.status)
        && /OPEN/.test(byId.O1.status)
        && /OPEN/.test(byId.O2.status) && /SUBSTANCE/.test(byId.O2.name)
        && /PARTIAL/.test(byId.O3.status);
    },
  },
  {
    id: 'imp-95424-assessment-only-honest',
    description: 'explicitly ASSESSMENT ONLY, no QED, no refereed bound is changed',
    holds: () =>
      /ASSESSMENT ONLY/.test(IMP95424_LEGB_ENVELOPE_DOMINATION.honest)
      && /NO QED/.test(IMP95424_LEGB_ENVELOPE_DOMINATION.honest)
      && /refereed bound is changed/i.test(IMP95424_LEGB_ENVELOPE_DOMINATION.honest),
  },
];

for (const a of IMP95424_LEGB_ENVELOPE_DOMINATION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95424-legb-envelope-domination-obligations assertion failed: ${a.id}`);
}

export default IMP95424_LEGB_ENVELOPE_DOMINATION;
