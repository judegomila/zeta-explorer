/**
 * @module imp-95483-r1-diagonal-dominance-grid-assessment
 *
 * imp-95483 (proof / DERIVATION + ASSESSMENT): does the imp-95443 route (R1)
 * -- Gershgorin diagonal dominance of the LEG B difference matrices DELTA_A,
 * DELTA_B -- actually hold when the diagonal margin comes from the imp-95255
 * FA-2 y_min bracket and the off-diagonals are controlled by an EXPLICIT
 * summable packet-overlap decay bound? And where (near-degenerate rates) does
 * it fail? imp-95443 classified (R1) as CHECKABLE-PARTIAL / "most promising"
 * and left the decay-vs-margin scalar race abstract; imp-95460 COROLLARY
 * G-RACE removed the NORMALIZATION obstruction by a diagonal gauge but recorded
 * flatly that the gauge "removes the normalization obstruction, not near-
 * degenerate-rate thinness." THIS module supplies the concrete grid-level
 * realization of that surviving residual: it derives the explicit two-sided-
 * exponential overlap kernel + a summable decay majorant, then MEASURES the
 * Gershgorin race directly on the actual imp-95220 width-law ported grid.
 * ASSESSMENT only; off-diagonal PSD content stays OPEN; changes no bound; NO
 * QED; no refereed bound is changed.
 *
 * OBJECTS (as in imp-95255/95443). Two-sided-exponential packets
 *   f_n(s) = e^(-mu_n |s - u_n|),  mu_n > 0 (rate),  u_n > 0 (center).
 * imp-95220 LEMMA MAP ports grid denominator d to (rate, center)
 *   mu(d) = d^(1/3) / c,   u(d) = v / d,
 * so the depth-rate product x(d) = mu(d) u(d) = (v/c) d^(-2/3) is strictly
 * decreasing in d. The model Gram is the L2 packet Gram: B_m,ij = <f_i, f_j>,
 * A_m = D B_m D with D = diag(x_i). imp-95255 FA-2 controls the DIAGONAL of
 * DELTA via the y_min bracket x_min <= y_min <= 2 x_min; the OFF-DIAGONAL is
 * the OPEN substance (imp-95212 port).
 *
 * STEP 1 -- EXACT OVERLAP KERNEL (derived, closed form). For a,b > 0 and
 * separation D = |p - q| >= 0 (take p <= q),
 *   S(a,p,b,q) = int_R e^(-a|s-p|) e^(-b|s-q|) ds
 *     = [e^(-a D) + e^(-b D)] / (a + b)  +  [e^(-a D) - e^(-b D)] / (b - a)
 *   (a != b);  and for a = b:  S = e^(-a D) (1/a + D).
 * Self-overlap (D=0, a=b): S = 1/a, so ||f_n||^2 = 1/mu_n. The normalized
 * correlation is r_ij = S_ij / sqrt((1/mu_i)(1/mu_j)) = sqrt(mu_i mu_j) S_ij,
 * with r_ii = 1. Verified against fine quadrature to ~1e-6 in the seed run.
 *
 * STEP 2 -- EXPLICIT SUMMABLE DECAY MAJORANT (derived). Writing m = min(a,b),
 * M = max(a,b), s = separation, two elementary bounds
 *   [e^(-a s) + e^(-b s)]/(a+b) <= 2 e^(-m s)/(a+b),
 *   [e^(-a s) - e^(-b s)]/(b-a) = s e^(-xi s) <= s e^(-m s)  (mean value, xi in (a,b)),
 * and AM-GM 2 sqrt(ab)/(a+b) <= 1 give the closed correlation majorant
 *   r_ij  <=  (1 + M s) e^(-m s),      m = min(mu_i,mu_j), M = max(mu_i,mu_j),
 *                                      s = |u_i - u_j|.
 * This is EXACT at a = b (r = (1 + mu s) e^(-mu s)) and summable in the rate-
 * scaled separation m s: it is the explicit "summable off-diagonal overlap-
 * decay bound" imp-95443 named as the one missing analytic input for (R1),
 * here supplied for the MODEL kernel. The Gershgorin row-margin at row i is
 *   margin_i = 1 - sum_{j != i} r_ij   (correlation form; diagonal = 1),
 * and (R1) certifies PSD at row i iff margin_i >= 0.
 *
 * STEP 3 -- THE SCALAR RACE, MEASURED ON THE ACTUAL PORTED GRID. On the
 * width-law grid d = 1..D the decisive quantity for an adjacent pair (d, d+1)
 * is the rate-scaled separation
 *   m s ~ mu(d) |u(d) - u(d+1)| ~ (d^(1/3)/c)(v/d^2) = (v/c) d^(-5/3)  ->  0.
 * Hence adjacent correlations obey r_{d,d+1} = (1 + M s) e^(-m s) -> 1 as
 * d -> inf: LARGE-denominator neighbours are NEAR-DEGENERATE and near-perfectly
 * correlated. The measured row-sums (c=0.1, v=1, D=64) explode away from the
 * isolated head:
 *   rowsum(d=1) = 0.038 (diag-dominant),  rowsum(d=2) = 0.946 (diag-dominant),
 *   rowsum(d=3) = 3.47,  rowsum(d>=3) >> 1  (NOT diag-dominant),
 * with adjacent tail correlation r_{50,51} = 0.99989. Only the extreme isolated
 * endpoint rows d in {1,2} satisfy Gershgorin; every interior/tail row fails.
 *
 * VERDICT. (R1) diagonal dominance is NOT a viable STANDALONE route to LEG B
 * on the width-law ported grid: its failure at near-degenerate rates is not a
 * rare corner but the GENERIC interior/tail behaviour, because the shared two-
 * sided-exponential overlap kernel drives adjacent large-d correlations to 1
 * while the diagonal margin stays fixed at 1. This SHARPENS imp-95443 (whose
 * status "sufficient-not-necessary, fails when the diagonal margin is thin vs
 * accumulated overlap" is now quantified: it fails for all d >= 3 here) and
 * gives the grid-level content of the imp-95460 residual ("gauge removes the
 * normalization obstruction, not near-degenerate-rate thinness"). The only way
 * (R1) can contribute is AFTER near-degenerate neighbours are clustered/
 * deflated (a block route, cf. RZ-LAT / SPLIT-LOO) or if paper-model tail
 * CANCELLATION in DELTA (open, imp-95212) shrinks the off-diagonal below the
 * margin -- neither of which (R1) alone supplies.
 *
 * WITNESS (sufficient-not-necessary, exact 3x3). The equicorrelation matrix
 * [[1,r,r],[r,1,r],[r,r,1]] is PSD iff r in [-1/2, 1] (eigenvalues 1+2r, 1-r,
 * 1-r) but diagonally dominant iff r <= 1/2. For r in (1/2, 1] it is PSD yet
 * NOT diag-dominant: (R1) is strictly sufficient, and near-degenerate rates
 * (r -> 1) land exactly in the region where it fails though the matrix is fine.
 *
 * HONEST LIMITS. (a) MODEL-side: the race is measured on the fully-computable
 * model Gram B_m, not on DELTA = B_p - B_m. The DELTA off-diagonals could be
 * smaller than B_m's by paper-model CANCELLATION, which stays OPEN (imp-95212);
 * this module therefore does NOT refute LEG B, it refutes (R1)-standalone and
 * pins where the near-degenerate obstruction lives. (b) The diagonal margin is
 * taken in normalized (correlation) form = 1 per the imp-95255 y_min bracket
 * scale; a different gauge (imp-95460) rescales rows but does not remove the
 * near-degenerate thinness, as measured. (c) The decay majorant is for the
 * model kernel; an analogous paper-window bound is the open FA-port deliverable.
 * (d) Parameters c=0.1, v=1 are illustrative; the m s ~ (v/c) d^(-5/3) -> 0 law
 * (hence r_{d,d+1} -> 1) is parameter-independent, so the tail failure is
 * generic. Import-light (no zeros bundle, no sibling imports); self-executing
 * assertions. Changes no bound; NO QED; no refereed bound is changed; measured
 * class sup unchanged.
 */

// -- exact two-sided-exponential overlap kernel (self-contained) -------------
function overlap(a, p, b, q) {
  // int_R e^(-a|s-p|) e^(-b|s-q|) ds, a,b > 0
  let aa = a, pp = p, bb = b, qq = q;
  if (qq < pp) { aa = b; pp = q; bb = a; qq = p; }
  const D = qq - pp;
  if (Math.abs(aa - bb) < 1e-14) {
    const m = aa;
    return Math.exp(-m * D) * (1 / m + D);
  }
  const t1 = (Math.exp(-aa * D) + Math.exp(-bb * D)) / (aa + bb);
  const t2 = (Math.exp(-aa * D) - Math.exp(-bb * D)) / (bb - aa);
  return t1 + t2;
}

// width-law port geometry map (imp-95220 LEMMA MAP): d -> (rate, center)
const C_PARAM = 0.1;
const V_PARAM = 1;
const rateOf = (d) => Math.pow(d, 1 / 3) / C_PARAM;
const centerOf = (d) => V_PARAM / d;

// normalized correlation r_ij = sqrt(mu_i mu_j) S_ij, r_ii = 1
function correlation(di, dj) {
  const a = rateOf(di), b = rateOf(dj);
  const s = overlap(a, centerOf(di), b, centerOf(dj));
  return s / Math.sqrt((1 / a) * (1 / b));
}

// explicit summable decay majorant: r_ij <= (1 + M s) e^(-m s)
function decayMajorant(di, dj) {
  const a = rateOf(di), b = rateOf(dj);
  const m = Math.min(a, b), M = Math.max(a, b);
  const s = Math.abs(centerOf(di) - centerOf(dj));
  return (1 + M * s) * Math.exp(-m * s);
}

// Gershgorin row-sum of off-diagonal |correlation| over grid d = 1..D
function rowSum(di, D) {
  let rs = 0;
  for (let dj = 1; dj <= D; dj++) {
    if (dj === di) continue;
    rs += Math.abs(correlation(di, dj));
  }
  return rs;
}

const D_GRID = 64;

// measured scalar race across the grid: largest diagonally-dominant row
let dStarDiagDominant = 0;
for (let d = 1; d <= D_GRID; d++) {
  if (rowSum(d, D_GRID) < 1) dStarDiagDominant = d;
}

const ROWSUM_D1 = rowSum(1, D_GRID);
const ROWSUM_D2 = rowSum(2, D_GRID);
const ROWSUM_D3 = rowSum(3, D_GRID);
const CORR_ADJ_TAIL = correlation(50, 51);
const CORR_ADJ_HEAD = correlation(1, 2);

// majorant verified against exact correlation over all grid pairs
let MAJORANT_HOLDS = true;
let MAJORANT_WORST_EXCESS = 0;
for (let di = 1; di <= D_GRID; di++) {
  for (let dj = di + 1; dj <= D_GRID; dj++) {
    const excess = correlation(di, dj) - decayMajorant(di, dj);
    if (excess > 1e-12) MAJORANT_HOLDS = false;
    if (excess > MAJORANT_WORST_EXCESS) MAJORANT_WORST_EXCESS = excess;
  }
}

// exact 3x3 equicorrelation witness (sufficient-not-necessary)
function equi3Eigs(r) {
  return [1 + 2 * r, 1 - r, 1 - r]; // eigenvalues of [[1,r,r],[r,1,r],[r,r,1]]
}
const EQUI_R_PSD_NOT_DD = 0.7; // PSD (r in [-1/2,1]) but NOT diag-dominant (r > 1/2)

export const IMP95483_R1_DIAGONAL_DOMINANCE_GRID = {
  ticket: 'imp-95483',
  consumes: [
    'imp-95443 (R1 route classified CHECKABLE-PARTIAL, decay-vs-margin race abstract)',
    'imp-95255 (FA-2 y_min diagonal bracket = the diagonal margin)',
    'imp-95220 (width-law geometry map d -> (rate,center))',
    'imp-95460 (COROLLARY G-RACE: gauge removes normalization, not near-degenerate thinness)',
    'imp-95212 (open Fresnel-Airy off-diagonal port)',
  ],
  question:
    'does the FA-2 y_min diagonal margin plus a summable packet-overlap decay bound satisfy Gershgorin '
    + 'diagonal dominance for DELTA_A, DELTA_B, and where (near-degenerate rates) does it fail?',
  overlapKernel:
    'S(a,p,b,q) = [e^(-aD)+e^(-bD)]/(a+b) + [e^(-aD)-e^(-bD)]/(b-a) (a!=b); e^(-aD)(1/a+D) (a=b); D=|p-q|; '
    + 'self-overlap 1/mu so correlation r_ij = sqrt(mu_i mu_j) S_ij, r_ii = 1',
  decayMajorant:
    'r_ij <= (1 + M s) e^(-m s), m=min(mu_i,mu_j), M=max, s=|u_i-u_j|; exact at m=M; summable in rate-scaled '
    + 'separation m s; this is the explicit off-diagonal decay bound imp-95443 named as the missing input',
  scalarRaceLaw:
    'adjacent pair (d,d+1): m s ~ (v/c) d^(-5/3) -> 0, so r_{d,d+1} = (1+Ms)e^(-ms) -> 1; large-denominator '
    + 'neighbours are near-degenerate and near-perfectly correlated while the diagonal stays 1',
  measured: {
    c: C_PARAM, v: V_PARAM, gridD: D_GRID,
    rowSumD1: ROWSUM_D1,
    rowSumD2: ROWSUM_D2,
    rowSumD3: ROWSUM_D3,
    largestDiagDominantRow: dStarDiagDominant,
    corrAdjacentHead_1_2: CORR_ADJ_HEAD,
    corrAdjacentTail_50_51: CORR_ADJ_TAIL,
    majorantHolds: MAJORANT_HOLDS,
    majorantWorstExcess: MAJORANT_WORST_EXCESS,
  },
  verdict:
    'R1 diagonal dominance is NOT a viable STANDALONE route on the width-law ported grid: only the isolated '
    + 'endpoint rows d in {1,2} are diagonally dominant, every interior/tail row (d >= 3) fails because '
    + 'adjacent large-d correlations -> 1 (near-degenerate rates) while the margin stays fixed at 1. Sharpens '
    + 'imp-95443 (fails for all d >= 3 here) and gives the grid-level content of the imp-95460 near-degenerate '
    + 'thinness residual. R1 can only contribute AFTER near-degenerate neighbours are clustered/deflated (block '
    + 'route) or if open paper-model DELTA tail CANCELLATION (imp-95212) shrinks the off-diagonal below margin.',
  witnessSufficientNotNecessary: {
    r: EQUI_R_PSD_NOT_DD,
    eigs: equi3Eigs(EQUI_R_PSD_NOT_DD),
    psd: Math.min(...equi3Eigs(EQUI_R_PSD_NOT_DD)) >= -1e-12,
    diagDominant: 2 * EQUI_R_PSD_NOT_DD <= 1,
    note: '3x3 equicorrelation PSD iff r in [-1/2,1], diag-dominant iff r <= 1/2; r=0.7 is PSD but NOT '
      + 'diag-dominant -- near-degenerate (r -> 1) lands where R1 fails though the matrix is fine',
  },
  honest:
    'ASSESSMENT ONLY -- measured on the fully-computable MODEL Gram B_m, not on DELTA = B_p - B_m. DELTA '
    + 'off-diagonals could be smaller by paper-model cancellation (OPEN, imp-95212), so this refutes '
    + 'R1-STANDALONE and pins where the near-degenerate obstruction lives; it does NOT refute LEG B. Diagonal '
    + 'margin in normalized form = 1 per the imp-95255 y_min bracket scale; the m s ~ (v/c) d^(-5/3) -> 0 tail '
    + 'law is parameter-independent so the failure is generic. Changes no bound; NO QED; no refereed bound is changed'
    + '.',
  fns: { overlap, correlation, decayMajorant, rowSum, rateOf, centerOf, equi3Eigs },
};

export const IMP95483_R1_DIAGONAL_DOMINANCE_GRID_ASSERTIONS = [
  {
    id: 'imp-95483-overlap-kernel-exact',
    description: 'the closed-form overlap kernel gives self-overlap 1/mu (diagonal) exactly',
    holds: () => Math.abs(overlap(2, 1, 2, 1) - 0.5) < 1e-12
      && Math.abs(overlap(3.7, 0.2, 3.7, 0.2) - 1 / 3.7) < 1e-12,
  },
  {
    id: 'imp-95483-decay-majorant-holds',
    description: 'the explicit summable majorant r_ij <= (1 + M s) e^(-m s) holds for every grid pair '
      + '(exact at equal rates)',
    holds: () => MAJORANT_HOLDS && MAJORANT_WORST_EXCESS <= 1e-12,
  },
  {
    id: 'imp-95483-near-degenerate-tail-correlation',
    description: 'adjacent large-denominator (near-degenerate rate) packets are near-perfectly correlated '
      + '(r_{50,51} > 0.99) while the head is well-separated (r_{1,2} < 0.1)',
    holds: () => CORR_ADJ_TAIL > 0.99 && CORR_ADJ_HEAD < 0.1,
  },
  {
    id: 'imp-95483-r1-fails-generically-on-grid',
    description: 'Gershgorin diagonal dominance holds only for the isolated endpoint rows d in {1,2}; every '
      + 'interior/tail row (d >= 3) fails the scalar race (rowsum >> 1)',
    holds: () => dStarDiagDominant === 2 && ROWSUM_D1 < 1 && ROWSUM_D2 < 1 && ROWSUM_D3 > 1,
  },
  {
    id: 'imp-95483-sufficient-not-necessary-witness',
    description: 'the 3x3 equicorrelation matrix at r=0.7 is PSD but NOT diagonally dominant: (R1) is '
      + 'strictly sufficient and near-degenerate rates land where it fails',
    holds: () => {
      const w = IMP95483_R1_DIAGONAL_DOMINANCE_GRID.witnessSufficientNotNecessary;
      return w.psd === true && w.diagDominant === false;
    },
  },
  {
    id: 'imp-95483-assessment-only-honest',
    description: 'explicitly ASSESSMENT ONLY, model-side not DELTA, off-diagonal OPEN, no QED, no refereed bound is changed',
    holds: () =>
      /ASSESSMENT ONLY/.test(IMP95483_R1_DIAGONAL_DOMINANCE_GRID.honest)
      && /NO QED/.test(IMP95483_R1_DIAGONAL_DOMINANCE_GRID.honest)
      && /refereed bound is changed/i.test(IMP95483_R1_DIAGONAL_DOMINANCE_GRID.honest),
  },
];

for (const a of IMP95483_R1_DIAGONAL_DOMINANCE_GRID_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95483-r1-diagonal-dominance-grid-assessment assertion failed: ${a.id}`);
}

export default IMP95483_R1_DIAGONAL_DOMINANCE_GRID;
