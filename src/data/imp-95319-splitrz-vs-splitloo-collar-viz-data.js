/**
 * @module imp-95319-splitrz-vs-splitloo-collar-viz-data
 *
 * imp-95319 (ux): lightweight, import-light viz-data module baking sampled
 * values of the imp-95250 LEMMA LOO "linear-in-m Riesz constant"
 *   A_LOO(m) = [ sum_{k=0}^{m-1} (1 - sigma_k^2)^(-1) ]^(-1)
 * -- estimated via the imp-95249 LEMMA ANG-DET fence 1 - sigma_k^2 >= Phi_k,
 * Phi_k = prod_{l != k} [ beta(2^k,2^l) beta(2^k,r 2^l) beta(r 2^k,2^l)
 * beta(r 2^k, r 2^l) ]^2, beta(a,b) = (a-b)/(a+b), on the imp-95250 EV-OCT
 * octave-twin blocks V_k = {2^k, r 2^k} -- against the imp-95252 THEOREM
 * RZ-TWIN / COROLLARY RZ-BLOCK constant A_blk, which is genuinely
 * m-INDEPENDENT (flat) at the same window ratio r = 1.3.
 *
 * imp-95250 HONEST LIMITS (d) already names A_LOO(m) as the constant LEMMA
 * LOO alone would give for a direct block-Riesz-basis statement (as opposed
 * to the depth-suppressed EV-OCT-UNIF route), and flags it as "linear-in-m"
 * (i.e. its reciprocal, the summed per-block collar, grows linearly in m) --
 * this is exactly the residual imp-95252 closes with a single flat constant.
 * This module evaluates A_LOO(m) directly from the LEMMA ANG-DET fence
 * definition (no re-derivation, straightforward application of an already
 * proven formula) and compares it with the already-baked imp-95252
 * aBlkRho2R13 constant, showing the CROSSOVER: at small m (<= 4) the naive
 * per-block constant is actually LARGER (less costly) than the flat
 * m-uniform constant, but for m >= 5 it drops below and continues to decay,
 * consistent with A_LOO(m) * m converging to a positive limit (~8.5e-16 by
 * m = 256) -- an asymptotically LINEAR-in-m collar, numerically confirming
 * the imp-95250 HONEST LIMITS (d) description and explaining why the
 * imp-95252 flat m-uniform constant (and its onset drop from 27.0356 to
 * 15.9816) was needed for large octave counts.
 *
 * All values recomputed here independently from the definitions documented
 * in imp-95249 (LEMMA ANG-DET, referenced), imp-95250-leaveoneout-multiblock
 * -split-certificate.js (LEMMA LOO / HONEST LIMITS (d)), and imp-95252
 * -muniform-block-riesz-seam-pencil.js (aBlkRho2R13) -- no new derivation,
 * no heavy import, no re-import of the source modules (each carries its own
 * self-executing assertions). Follows the imp-95317 / imp-95305 import-light
 * viz-data pattern.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95249 / imp-95250 /
 * imp-95252 documented definitions verbatim; the observed 1/m asymptotic
 * decay of A_LOO(m) is a NUMERIC illustration, not a new proved rate; changes
 * no bound, no operator positivity, no RH claim; NO QED. No refereed bound is changed.
 *
 * @see imp-95250-leaveoneout-multiblock-split-certificate.js (source: LEMMA
 *   LOO, HONEST LIMITS (d) naming the linear-in-m constant)
 * @see imp-95252-muniform-block-riesz-seam-pencil.js (source: COROLLARY
 *   RZ-BLOCK flat constant A_blk, aBlkRho2R13)
 * @see imp-95305-splitrz-vs-evoctunif-onset-viz-data.js (companion: SPLIT-RZ
 *   vs EV-OCT-UNIF onset drop at unbounded m, both m-independent)
 *
 * Ticket: imp-95319 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

// window ratio (matches the imp-95252 aBlkRho2R13 constant)
export const IMP95319_R = 1.3;

// the imp-95252 flat, m-independent block-Riesz constant at r = 1.3
export const IMP95319_A_BLK = 1.344996021179e-11;

// A_LOO(m) at r = 1.3, for octave-block counts m = 1..32 (LEMMA LOO's naive
// per-block reciprocal-sum constant, via the LEMMA ANG-DET fence)
export const IMP95319_A_LOO_CURVE = [
  { m: 1, aLoo: 1.0 },
  { m: 2, aLoo: 5.4864086123e-5 },
  { m: 3, aLoo: 1.1871477812e-8 },
  { m: 4, aLoo: 9.2839634755e-11 },
  { m: 5, aLoo: 2.3148176958e-12 },
  { m: 6, aLoo: 1.7760917991e-13 },
  { m: 7, aLoo: 2.7589196930e-14 },
  { m: 8, aLoo: 7.0827085802e-15 },
  { m: 10, aLoo: 1.2208730727e-15 },
  { m: 12, aLoo: 4.4101375647e-16 },
  { m: 16, aLoo: 1.5227342795e-16 },
  { m: 20, aLoo: 8.7693301095e-17 },
  { m: 24, aLoo: 6.1325471732e-17 },
  { m: 28, aLoo: 4.7134589440e-17 },
  { m: 32, aLoo: 3.8276370952e-17 },
];

// crossover: A_LOO(m) exceeds A_blk for m <= 4, drops below for m >= 5
export const IMP95319_CROSSOVER = { belowM: 4, aboveM: 5 };

// A_LOO(m) * m at larger m, showing convergence toward a positive constant
// (the numeric signature of an asymptotically linear-in-m collar)
export const IMP95319_M_SCALING = [
  { m: 32, aLooTimesM: 1.224844e-15 },
  { m: 64, aLooTimesM: 9.785090e-16 },
  { m: 128, aLooTimesM: 8.891029e-16 },
  { m: 256, aLooTimesM: 8.502589e-16 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

function beta(a, b) {
  return (a - b) / (a + b);
}
function phiK(m, r, k) {
  let prod = 1;
  for (let l = 0; l < m; l++) {
    if (l === k) continue;
    const a1 = 2 ** k;
    const a2 = r * 2 ** k;
    const b1 = 2 ** l;
    const b2 = r * 2 ** l;
    const cross = beta(a1, b1) * beta(a1, b2) * beta(a2, b1) * beta(a2, b2);
    prod *= cross ** 2;
  }
  return prod;
}
function aLooExact(m, r) {
  let s = 0;
  for (let k = 0; k < m; k++) s += 1 / phiK(m, r, k);
  return 1 / s;
}

const IMP95319_ASSERTIONS = [
  {
    id: 'imp95319-aloo-matches-angdet-fence-definition',
    description:
      'every baked A_LOO(m) value matches a live recomputation from the LEMMA ANG-DET fence Phi_k (product of squared cross-block Blaschke factors) to 1e-6 relative, at r = 1.3',
    holds: () =>
      IMP95319_A_LOO_CURVE.every((p) => {
        const expected = aLooExact(p.m, IMP95319_R);
        return Math.abs(p.aLoo - expected) / expected < 1e-6;
      }),
  },
  {
    id: 'imp95319-aloo-monotone-decreasing-in-m',
    description:
      'A_LOO(m) is strictly decreasing as m grows (adding blocks can only add positive terms to the reciprocal sum, per LEMMA LOO)',
    holds: () =>
      IMP95319_A_LOO_CURVE.every(
        (p, i) => i === 0 || p.aLoo < IMP95319_A_LOO_CURVE[i - 1].aLoo,
      ),
  },
  {
    id: 'imp95319-crossover-matches-baked-constants',
    description:
      'A_LOO(m) exceeds the flat imp-95252 A_blk for m = 4 and drops below it for m = 5, matching the recorded crossover',
    holds: () => {
      const at4 = IMP95319_A_LOO_CURVE.find((p) => p.m === IMP95319_CROSSOVER.belowM).aLoo;
      const at5 = IMP95319_A_LOO_CURVE.find((p) => p.m === IMP95319_CROSSOVER.aboveM).aLoo;
      return at4 > IMP95319_A_BLK && at5 < IMP95319_A_BLK;
    },
  },
  {
    id: 'imp95319-m-scaling-converges-live-recomputation',
    description:
      'A_LOO(m) * m matches a live recomputation at m = 32, 64, 128, 256 to 1e-4 relative, and the product is converging (differences shrink) toward a positive limit -- the numeric signature of an asymptotically linear-in-m collar',
    holds: () => {
      const rows = IMP95319_M_SCALING.map((p) => ({
        ...p,
        live: aLooExact(p.m, IMP95319_R) * p.m,
      }));
      if (!rows.every((r) => Math.abs(r.aLooTimesM - r.live) / r.live < 1e-4)) return false;
      for (let i = 1; i < rows.length; i++) {
        const prevGap = Math.abs(rows[i - 1].aLooTimesM - rows[i].aLooTimesM);
        if (i >= 2) {
          const olderGap = Math.abs(rows[i - 2].aLooTimesM - rows[i - 1].aLooTimesM);
          if (!(prevGap < olderGap)) return false;
        }
      }
      return rows.every((r) => r.aLooTimesM > 0);
    },
  },
];

for (const a of IMP95319_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95319-splitrz-vs-splitloo-collar-viz-data assertion failed: ${a.id}`);
  }
}
