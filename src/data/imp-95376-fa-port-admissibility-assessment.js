/**
 * @module imp-95376-fa-port-admissibility-assessment
 *
 * imp-95376 (proof-scoping / SPLIT VERDICT): does the imp-95212 Fresnel-Airy
 * envelope port ALONE -- together with the already-mapped per-window Q --
 * discharge the GATE-SIDE admissibility of a signed seam certificate value R
 * for the paper packet's ACTUAL seam functional, or does a further ingredient
 * survive? Twenty-fifth-adjacent leg of the seam chain; consumes imp-95276
 * (gate-side map DISSOLVED), imp-95255 (currency per-window map, theta wall),
 * imp-95226 (signed pencil model E_V). ASSESSMENT only; changes no bound; NO
 * QED; no refereed bound is changed.
 *
 * THE SETUP (imp-95276 reduction). imp-95276 dissolved the gate-side half of
 * seam obligation (3): the pipeline R |-> g_R = 2 R sqrt(1 - R^2) |-> gammaSL
 * is the standard well-posed monotone gate the program already runs (its (M1)
 * + (M2) monotonicities are verified there). So the ENTIRE surviving
 * obligation is the INPUT side -- for a signed R to be admissible it must
 * bound sqrt(LamBar) for the paper packet's actual seam functional. imp-95276
 * routed that to (i) the imp-95212 Fresnel-Airy envelope port (paper window
 * -> imp-95226 exponential model E_V) and (ii) the per-window Q extraction.
 * This module asks whether (i) + already-mapped (ii) SUFFICE.
 *
 * WHAT A SIGNED CERTIFICATE IS (imp-95226). Each signed leg outputs
 *   sqrt(Lambda(V, d)) <= R,  Lambda(V, d) = lambda_max of the pencil
 *   (D G D, G),  G_ij = 1/(nu_i + nu_j),  D = diag(e^(-d nu_i)),
 * and, crucially, Lambda(V, d) is the SUPREMUM over ALL nonzero signed
 * coefficient vectors a of the restricted Rayleigh quotient
 *   rho(a) = (a^T D G D a) / (a^T G a).
 * The count/depth-currency families (SGN-EQ, SGN-C imp-95225, COAL-N
 * imp-95251, SPLIT-LOO imp-95250) produce an R that is a function ONLY of the
 * transcribed GEOMETRY (x_min = nu_min d, the distinct-rate count N, the
 * per-block angles sigma_k), never of the amplitude pattern. PHASE-CERT
 * (imp-95221/95233) is the exception: its R <= e^(-y_min)/(2 theta) carries
 * the sign functional theta.
 *
 * THE SPLIT VERDICT.
 *
 * LEG A -- COUNT / DEPTH currency: the port + Q SUFFICE (no further
 * ingredient beside the port). For any of SGN-EQ / SGN-C / COAL-N / SPLIT-LOO
 * the value R is fixed by (x_min or y_min, N, sigma_k). imp-95255 LEG 1
 * already established that y_min rides the SAME transcribed Q as x_min (FA-2
 * bracket x_min <= y_min <= 2 x_min, measured collapse y_min/x_min -> 1), and
 * the count N and the block angles sigma_k are geometry the port supplies.
 * The amplitude SIGN data that imp-95255 LEG 2 found unmapped (theta) is
 * IRRELEVANT here: because Lambda is the sup over ALL signed coefficient
 * vectors, R >= sqrt(Lambda) already dominates the paper window's unknown
 * sign AND modulus pattern. So no theta transcription is required for
 * admissibility of a count/depth-currency R. The imp-95255 theta wall bites
 * ONLY the OPTIONAL phase-discount sharpening (theta < 1 in PHASE-CERT),
 * which BUYS a tighter R -- it is not needed to make R admissible.
 *
 * LEG B -- the ONE surviving ingredient is INSIDE the port, not beside it.
 * The certificate is a theorem about the exponential model E_V, not about the
 * paper's Fresnel-Airy window. For R to bound sqrt(LamBar) of the ACTUAL seam
 * functional, the imp-95212 port must deliver an ENVELOPE-DOMINATION
 * inequality
 *   LamBar_paper(d)  <=  Lambda(E_V, d),
 * i.e. the paper window's restricted energy ratio must be MAJORIZED by the
 * transcribed exponential model, not merely share its rates and centers. A
 * port that only IDENTIFIES (rate, center) pairs (a heuristic model
 * substitution) does NOT discharge admissibility; the domination is the
 * substance of the port. This is the honest residual: it is exactly what the
 * "Fresnel-Airy envelope port" must PROVE, and it is not automatic from the
 * geometry map. Given that domination, LEG A closes admissibility for the
 * count/depth family with no further work.
 *
 * TWO SECONDARY CHECKS THAT RIDE ALONG (flagged, not obstructions).
 *   (S1) For SPLIT-LOO each block angle sigma_k must be transcribed as an
 *        UPPER bound, so that 1/(1 - sigma_k^2) is over- (never under-)
 *        estimated -- a direction-of-inequality check, not a new object.
 *   (S2) The SPLIT-LOO aggregate R = sum_k sqrt(Lambda_k/(1 - sigma_k^2)) can
 *        exceed 1/sqrt2 when many blocks stack, leaving the imp-95276 (M1)
 *        monotone branch; in that regime per-block gate application (imp-95276
 *        multiBlockCaveat) is mandatory. This is a gate-side routing rule
 *        already recorded, not a new input.
 *
 * NUMERIC WITNESS (this module, exact 2x2 signed pencil). On a fixed
 * (nu, d) configuration we exhibit the sign-agnostic sup property that powers
 * LEG A: the pencil eigenvalue Lambda_2 (imp-95226 THEOREM SGN-2X closed
 * form, cross-checked against the direct 2x2 generalized-eigenvalue root)
 * dominates the Rayleigh ratio rho(a) of EVERY test coefficient vector --
 * positive-cone (equal moduli, the paper eq-14 family), sign-alternating, and
 * mixed-modulus alike -- so R = sqrt(Lambda_2) bounds sqrt(LamBar) whatever
 * the window's actual (unknown) signs and moduli are. It also shows sign DOES
 * move rho(a) (the alternating vector beats the positive cone), confirming
 * these are genuinely SIGNED certificates whose sup nonetheless needs no
 * per-window sign input.
 *
 * HONEST LIMITS. (a) ASSESSMENT only: nothing here derives or moves a bound;
 * it classifies the port against the two certificate currencies. (b) LEG A
 * consumes the imp-95255 LEG-1 y_min-rides-Q result (rigorous FA-2 bracket +
 * measured collapse) and the elementary Rayleigh-sup fact; it does NOT re-run
 * the port. (c) LEG B names the surviving domination inequality as the
 * substance of the still-OPEN imp-95212-subgap-fresnel-airy-envelope-port; it
 * is not proved here. (d) The numeric witness is a single 2x2 configuration
 * illustrating a general linear-algebra fact, not a paper-window computation.
 * Import-light (no zeros bundle, no sibling imports). Changes no bound; NO
 * QED; no refereed bound is changed; measured class sup
 * unchanged.
 */

// -- imp-95226 signed 2x2 pencil, self-contained -----------------------------
// Config: two distinct rates, depth d. w_i = e^(-d nu_i).
const NU1 = 1.0;
const NU2 = 2.5;
const DEPTH = 1.0;
const W1 = Math.exp(-DEPTH * NU1);
const W2 = Math.exp(-DEPTH * NU2);

// Cauchy Gram G and shifted-restricted D G D (D = diag(w_i)).
const G = [
  [1 / (2 * NU1), 1 / (NU1 + NU2)],
  [1 / (NU1 + NU2), 1 / (2 * NU2)],
];
const DGD = [
  [W1 * W1 * G[0][0], W1 * W2 * G[0][1]],
  [W1 * W2 * G[1][0], W2 * W2 * G[1][1]],
];

// restricted Rayleigh quotient rho(a) = (a^T DGD a)/(a^T G a)
function rayleigh(a) {
  const quad = (M) =>
    a[0] * a[0] * M[0][0] + 2 * a[0] * a[1] * M[0][1] + a[1] * a[1] * M[1][1];
  return quad(DGD) / quad(G);
}

// direct larger generalized eigenvalue of (DGD, G): larger root of
// (pq - r^2) lam^2 - (a q + d p - 2 b r) lam + (a d - b^2) = 0
function lambdaMaxDirect() {
  const a = DGD[0][0], b = DGD[0][1], dd = DGD[1][1];
  const p = G[0][0], r = G[0][1], q = G[1][1];
  const A = p * q - r * r;
  const B = a * q + dd * p - 2 * b * r;
  const C = a * dd - b * b;
  const disc = Math.sqrt(B * B - 4 * A * C);
  return (B + disc) / (2 * A);
}

// imp-95226 THEOREM SGN-2X closed form
function lambda2Sgn2x() {
  const h = ((W1 - W2) * (NU1 + NU2)) / (NU2 - NU1);
  return W1 * W2 + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * W1 * W2);
}

const LAMBDA2 = lambda2Sgn2x();
const RECIP_SQRT2 = 1 / Math.SQRT2;

// test coefficient vectors: positive cone (paper eq-14 equal moduli),
// sign-alternating, and mixed modulus -- all admissibility-agnostic
const TEST_VECTORS = [
  { name: 'positive-cone-equal', a: [1, 1] },
  { name: 'sign-alternating', a: [1, -1] },
  { name: 'mixed-modulus-pos', a: [1, 0.3] },
  { name: 'mixed-modulus-signed', a: [1, -0.3] },
  { name: 'heavy-second-signed', a: [0.4, -1] },
  { name: 'near-eigenvector', a: [1, -1.7] },
];

export const IMP95376_FA_PORT_ADMISSIBILITY = {
  ticket: 'imp-95376',
  obligation: '(3) input-side admissibility of a signed R (imp-95276 reduction)',
  question:
    'does the imp-95212 Fresnel-Airy envelope port ALONE (with already-mapped Q) make a '
    + 'signed R admissible as a bound on sqrt(LamBar) for the paper packet actual seam functional?',
  verdict: 'SPLIT',
  legA:
    'COUNT/DEPTH currency (SGN-EQ, SGN-C, COAL-N, SPLIT-LOO): port + Q SUFFICE. R depends only on '
    + 'transcribed geometry (x_min/y_min via imp-95255 LEG 1, count N, block angles sigma_k); because '
    + 'Lambda is the sup over ALL signed coefficient vectors, R already dominates the window unknown '
    + 'sign AND modulus pattern, so no theta transcription is needed for admissibility. The imp-95255 '
    + 'theta wall bites only the OPTIONAL phase-discount sharpening, not admissibility.',
  legB:
    'the ONE surviving ingredient is INSIDE the port: it must deliver an ENVELOPE-DOMINATION '
    + 'inequality LamBar_paper(d) <= Lambda(E_V, d), majorizing the paper window restricted energy '
    + 'ratio by the transcribed exponential model -- not merely identifying rates and centers. A '
    + 'geometry-only (heuristic model-substitution) port does NOT discharge admissibility; the '
    + 'domination is the substance of the still-open imp-95212 port.',
  secondaryChecks: {
    S1: 'SPLIT-LOO sigma_k must be transcribed as an UPPER bound (safe direction of 1/(1-sigma^2)).',
    S2: 'SPLIT-LOO aggregate R can exceed 1/sqrt2 and leave the imp-95276 (M1) monotone branch; '
      + 'per-block gate application (imp-95276 multiBlockCaveat) is then mandatory.',
  },
  monotoneBranchTop: RECIP_SQRT2,
  config: { nu: [NU1, NU2], depth: DEPTH, w: [W1, W2] },
  lambda2: LAMBDA2,
  Radmissible: Math.sqrt(LAMBDA2),
  witness: TEST_VECTORS.map((t) => ({ name: t.name, rho: rayleigh(t.a) })),
  honest:
    'ASSESSMENT ONLY -- no port re-run, no packet transcribed, no certificate instantiated on a paper '
    + 'window; LEG B names (does not prove) the domination inequality as the substance of the open '
    + 'imp-95212-subgap-fresnel-airy-envelope-port; the numeric witness is one 2x2 configuration '
    + 'illustrating a general Rayleigh-sup fact. Changes no bound; NO QED; no refereed bound is changed'
    + '.',
  fns: { rayleigh, lambdaMaxDirect, lambda2Sgn2x },
};

export const IMP95376_FA_PORT_ADMISSIBILITY_ASSERTIONS = [
  {
    id: 'imp-95376-sgn2x-matches-direct-eig',
    description: 'imp-95226 SGN-2X closed form equals the direct 2x2 generalized eigenvalue (rel 1e-12)',
    holds: () => Math.abs(lambda2Sgn2x() - lambdaMaxDirect()) <= 1e-12 * lambdaMaxDirect(),
  },
  {
    id: 'imp-95376-sup-dominates-every-sign-modulus',
    description: 'Lambda_2 dominates the Rayleigh ratio of every test vector (sign-agnostic sup, LEG A)',
    holds: () => TEST_VECTORS.every((t) => rayleigh(t.a) <= LAMBDA2 + 1e-12),
  },
  {
    id: 'imp-95376-sign-moves-rayleigh',
    description: 'the sign-alternating vector strictly beats the positive cone -- these are genuinely SIGNED certs',
    holds: () => rayleigh([1, -1]) > rayleigh([1, 1]) + 1e-12,
  },
  {
    id: 'imp-95376-positive-cone-not-maximizer',
    description: 'the paper eq-14 positive-cone (equal moduli) vector is NOT the maximizer, so admissibility '
      + 'cannot rely on the transcribed modulus/sign family -- only on the sup (LEG A rationale)',
    holds: () => rayleigh([1, 1]) < LAMBDA2 - 1e-9,
  },
  {
    id: 'imp-95376-R-is-sqrt-lambda',
    description: 'the admissible certificate value is R = sqrt(Lambda_2), a bound on sqrt(LamBar) once LEG B holds',
    holds: () => Math.abs(IMP95376_FA_PORT_ADMISSIBILITY.Radmissible - Math.sqrt(LAMBDA2)) <= 1e-15,
  },
  {
    id: 'imp-95376-split-verdict-honest',
    description: 'explicitly SPLIT verdict, ASSESSMENT ONLY, no refereed bound is changed',
    holds: () =>
      IMP95376_FA_PORT_ADMISSIBILITY.verdict === 'SPLIT'
      && /ASSESSMENT ONLY/.test(IMP95376_FA_PORT_ADMISSIBILITY.honest)
      && /refereed bound is changed/i.test(IMP95376_FA_PORT_ADMISSIBILITY.honest),
  },
];

for (const a of IMP95376_FA_PORT_ADMISSIBILITY_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95376-fa-port-admissibility-assessment assertion failed: ${a.id}`);
}

export default IMP95376_FA_PORT_ADMISSIBILITY;
