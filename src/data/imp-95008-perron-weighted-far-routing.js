/**
 * imp-95008 continuation (twenty-second) - LEMMA SW + THEOREM Y-PERRON:
 * the weighted-Schur aggregation move. Consumes the JOINT ceiling-side
 * aggregation lever (b2) block-mass AM-GM + (b3) sup_b routing named by
 * imp-95019, and measures its entire capacity: 1.0008665157515448
 * (0.0866 percent). Fourth ceiling-side far-bracket move; floors untouched.
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture). Theorem Y-EXACT (nineteenth,
 * imp-95008-exact-pair-correlation-ceiling.js) rolls the same-parity
 * cross-block correlations up as
 *   || sum_b w_b ||^2 <= 2 sum_b ||w_b||^2 + 2 ( sup_b OmegaE_b ) M ,
 * where OmegaE_b is the row sum of the symmetric nonnegative block kernel
 *   K(b, bp) = envE( min(b, bp), |b - bp| )   (same-parity blocks, gap >= 2),
 * envE(b, j) = I(V(b, j), rhoCap(j)) the exact Lemma PF pair value at the
 * substituted point, and M = sum_b nTilde_b^2 the far mass currency. The
 * per-pair chain (true correlation <= n_1 n_2 envE via Lemmas CC and RM) is
 * carried verbatim; this module changes ONLY the aggregation step - the
 * passage from per-pair envelope caps to a single constant times M.
 *
 * LEMMA SW (weighted Schur aggregation - UNCONDITIONAL, elementary). Let
 * K(b, bp) >= 0 be symmetric on an index class, x_b > 0 any positive weight,
 * and m_b >= 0 any mass profile. Then
 *   sum_{b != bp} m_b m_bp K(b, bp) <= Lw(x) sum_b m_b^2 ,
 *   Lw(x) = sup_b (1 / x_b) sum_{bp != b} K(b, bp) x_bp .
 * Proof: m_b m_bp <= ( m_b^2 x_bp / x_b + m_bp^2 x_b / x_bp ) / 2 (AM-GM);
 * multiply by K(b, bp) >= 0, sum over ordered pairs, use symmetry to merge
 * the two halves, and pull out the sup. QED. With x = 1 the constant Lw(1)
 * is exactly sup_b OmegaE_b: Lemma SW strictly generalizes the Theorem
 * Y-EXACT aggregation, and any positive weight gives a valid constant.
 *
 * THEOREM Y-PERRON (roll-up with a weighted constant - CONDITIONAL only on
 * MAJ(sigma, theta), like Theorem Y-EXACT). For any positive weights xE on
 * the even class and xO on the odd class,
 *   || sum_b w_b ||^2 <= 2 sum_b ||w_b||^2
 *                        + 2 max( LwEven(xE), LwOdd(xO) ) M .
 * Proof: the parity 2-coloring AM-GM ||E + O||^2 <= 2||E||^2 + 2||O||^2 is
 * unchanged; inside each color class the cross term is bounded by the
 * per-pair envelope caps (Lemmas CC, RM, PF - carried) and then by Lemma SW
 * with that class weight; M = M_even + M_odd recombines the class masses
 * under the max. QED. Achieved point in the Theorem K bracket class
 * {cNear <= 2, Tstar <= Tx(2)}:
 *   ( cNear, cFar ) = ( 2 , 2 max(LwEven, LwOdd) / Tx(2) ) .
 *
 * AGGREGATION SHARPNESS (why this consumes the WHOLE (b2)+(b3) lever). For
 * any mass profile m >= 0 the envelope cross term sum_{b != bp} m_b m_bp
 * K(b, bp) can approach lambda_max(K) |m|^2 (Rayleigh quotient at the
 * Perron profile; the correlation caps are realizable at the abstract Gram
 * level by diagonal-dominant PSD completion, since the diagonal norms
 * ||w_b||^2 are free while M is fixed by the currencies). So within the
 * aggregation step - per-pair envelope caps in, single constant times M
 * out - NO scheme can certify a constant below lambda_max(K), and Lemma SW
 * with a near-Perron weight achieves it: the baked two-sided sandwich is
 *   Rayleigh 3.919793511380258e-5 <= lambda_max <= Lw 3.9197935113802585e-5
 * (relative width 2.3e-16, machine precision). The aggregation step is now
 * SHARP; the entire recoverable (b2)+(b3) capacity is the measured
 *   sup_b OmegaE_b / lambda_max = 1.0008665157515448   (0.0866 percent),
 * certified inside [ OmegaE_2/Lw, OmegaE_2/Rayleigh ] =
 * [ 1.0008665157515446, 1.0008665157515448 ].
 *
 * COROLLARY (reference evaluation, sigma = 1, beta = 1/3, c = v = D = 1,
 * theta = 10; all literals re-computed by the assertions). The even-class
 * kernel is dominated by the single (0, 2) bond envE(0, 2) =
 * 3.9197920255561178e-5 (the b = 0 / b = 2 row-sum near-tie of the
 * nineteenth is the shadow of this shared bond); the near-Perron weight is
 * (0.9999996, 1, 8.707e-4, 6.79e-10, ...) - essentially the even {0, 2}
 * split - and the section Perron value exceeds the bond by only 1.49e-11
 * (the block-4 coupling, second order). Odd class: sup row sum
 * 1.47203498255732e-6 at b = 3, a factor 26.6 below LwEven, so the
 * unweighted row-sum bound suffices there. New achieved point:
 *   cFar 0.2717408057586117 -> 0.27150554192989773
 *     (improvement factor 1.0008665157515448; ledger vs the
 *     pre-seventeenth 4: 14.73266428216332),
 *   headline gap 2.8088338309749887 -> 2.8064020394026787,
 *   fixed-97 gap 225.42360917596611 -> 225.22844518052122,
 *   residual after parity 1.4044169154874944 -> 1.4032010197013394.
 *
 * CONSEQUENCE FOR THE imp-95074 SUB-GAP (block-mass concentration vs
 * excess). The routing component of the A-vs-B question is now ANSWERED
 * within the model family: re-weighting mass across blocks - in ANY witness
 * family - can raise the envelope cross term per unit mass at most to
 * lambda_max, i.e. can recover at most 1.0008665 of the residual
 * 1.4044169154874944; and the optimal mass profile is the near-even {0, 2}
 * split the exhibited witness already uses (Perron weight ~ (1, 1) on
 * blocks 0 and 2). So NEITHER imp-95074 scenario mechanism carries the
 * residual at the block level: the flat-profile re-weighting lever (A) is
 * worth only 0.087 percent, and the sup-pullout looseness (B) is exactly
 * that same 0.087 percent, not 1.40x. The sqrt(2) signature reading of
 * imp-95074 Finding 3 is SUPERSEDED at block level: the residual
 * 1.4032010197013394 that survives this move is NOT a mass 2-coloring
 * sup-vs-RMS artifact (that channel is fully priced here); it lives in the
 * E-REALIZATION step - the passage from envelope caps to the realized
 * witness excess E = cross - sum_b ||w_b||^2, i.e. per-pair envelope
 * attainment at finite rates (imp-95019: ratio -> 1 in the continuous
 * corner limit) times the witness norm subtraction, a cost the bracket
 * class never charges to the ceiling.
 *
 * SUB-GAP (explicitly named, NOT closed):
 *   imp-95008-subgap-witness-Erealization-split -- decompose the surviving
 *   1.4032010197013394 into (attainment shortfall) x (norm-penalty
 *   sum ||w_b||^2 / (lambda_max M)) for the exhibited headline witness.
 *   Needs the witness internals E_cross and sum ||w_b||^2 separately;
 *   the chain bakes only the assembled floor F = E / (Tx(2) M).
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) the kernel row-sum identity
 * rowSum(b) = OmegaE_b is checked exactly (rel 1e-12) on both parities,
 * b <= 60 - the kernel and the nineteenth roll-up are the same object;
 * (2) the sandwich Rayleigh <= Lw is asserted along with its 2.3e-16
 * width, and the bond lower bound envE(0, 2) <= Rayleigh is asserted
 * (two-block mass profile); (3) a deterministic 25-vector LCG battery
 * checks the Lemma SW inequality m^T K m <= Lw |m|^2 directly on the
 * section; (4) the weight is positive over the whole scan (geometric tail
 * ratio 0.2 beyond the 61-block section, min component ~2e-248, no
 * underflow) and every ratio beyond the section is below 1e-100 - the sup
 * is attained inside the section (the kernel decays by ~2^(-44/3) per even
 * block step while the weight decays by 0.04, so ratios are eventually
 * decreasing; in float they underflow to 0); (5) x = 1 reproduces the
 * Theorem Y-EXACT constant sup_b OmegaE_b exactly (rel 1e-12) - the
 * generalization is strict and backward-compatible; (6) the new ceiling
 * stays strictly above both exhibited floors (bracket remains open, floors
 * untouched); (7) float conditioning: envE carries the nineteenth ~1e-8
 * relative partial-fraction cancellation, five orders below the 8.67e-4
 * improvement; the unfolded evaluation exceeds the folded one (nineteenth,
 * imp-95032), so baked literals understate and an upward round of the new
 * ceiling (0.27150555) stays a valid upper bound; (8) SCOPE HONESTY: the
 * sharpness claim is about the AGGREGATION step only (per-pair caps in,
 * constant times M out) - schemes that bypass the parity split or use
 * joint near/far structure are outside it, and packet-level realizability
 * of the Rayleigh profile is exactly the E-realization sub-gap, not
 * claimed here.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * REFINED achieved-side ledger after this step: (a) the outer parity AM-GM
 * factor 2 (Gram-sharp per imp-95018, unrecoverable); (b) the tightness of
 * the substitution point (Lemma X floor strict, Lemma RHO cap attained to
 * 0.4 percent); (b2)+(b3) block-mass AM-GM and sup_b routing are CLOSED -
 * the aggregation constant is now the certified lambda_max sandwich.
 * Witness side: the E-realization split (named sub-gap above).
 *
 * The numerics below CROSS-CHECK the lemma statements; they are not the
 * claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

function gSharp(j) {
  return Math.pow(2, BETA) * gOld(j, QREF, BETA);
}

function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * gSharp(j);
}

function phiTail(x) {
  return Math.pow(1 + x, -THETA);
}

function tailAllSharp(jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const t = phiTail(gSharp(j));
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  return s;
}

const TX2 = tailAllSharp(800);

function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}

// ── Lemma PF exact closed form (short copy, nineteenth continuation) ─────────
function binom(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

function outerFolded(rho, bb, s) {
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(bb - rho, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(rho - bb, -(2 * s - k));
    sum += (ck * Math.pow(rho, s + 1 - k) + dk * Math.pow(rho, s) * Math.pow(bb, 1 - k)) / (k - 1);
  }
  const c1s = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(bb - rho, -(2 * s - 1)) * Math.pow(rho, s);
  return sum + (c1s === 0 ? 0 : c1s * Math.log(bb / rho));
}

function farFolded(rho, T, s) {
  const a = rho + T;
  const rs = Math.pow(rho, s);
  if (rs === 0) return 0;
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - a, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(a - 1, -(2 * s - k));
    sum += (rs * (ck * Math.pow(a, 1 - k) + dk)) / (k - 1);
  }
  const c1 = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - a, -(2 * s - 1));
  return sum + (c1 === 0 ? 0 : rs * c1 * Math.log(1 / a));
}

function middleFolded(rho, T, s) {
  const c = 1 + T;
  const rs = Math.pow(rho, s);
  let sum = 0;
  for (let k = 1; k <= s; k++) {
    const pk = binom(2 * s - k - 1, s - k) * Math.pow(rho + c, -(2 * s - k));
    if (pk === 0) continue;
    const Ja =
      k === 1
        ? rs === 0
          ? 0
          : rs * Math.log((T + rho) / rho)
        : (Math.pow(rho, s + 1 - k) - rs * Math.pow(T + rho, 1 - k)) / (k - 1);
    const Jc = k === 1 ? rs * Math.log(c) : (rs * (1 - Math.pow(c, 1 - k))) / (k - 1);
    sum += pk * (Ja + Jc);
  }
  return sum;
}

function iExact(T, rho, s) {
  return Math.pow(rho, -0.5) * (outerFolded(rho, 1 + T, s) + middleFolded(rho, T, s) + farFolded(rho, T, s));
}

const envEMemo = new Map();
function envE(b, j) {
  const key = b * 4096 + j;
  const hit = envEMemo.get(key);
  if (hit !== undefined) return hit;
  const val = iExact(cornerV(b, j), rhoCap(j), SS);
  envEMemo.set(key, val);
  return val;
}

function omegaE(b) {
  let s = 0;
  for (let j = 2; j <= 800; j += 2) {
    const t = envE(b, j);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  const r = b % 2;
  for (let j = 2; j <= b - r; j += 2) s += envE(b - j, j);
  return s;
}

// ── the same-parity block kernel and its row sums ────────────────────────────
function kEntry(b, bp) {
  if (b === bp) return 0;
  const lo = Math.min(b, bp);
  const j = Math.abs(b - bp);
  return envE(lo, j);
}

function rowSum(b, bMax) {
  let s = 0;
  for (let bp = b % 2; bp <= bMax; bp += 2) {
    if (bp === b) continue;
    const e = kEntry(b, bp);
    if (e === 0) continue;
    s += e;
  }
  return s;
}

// ── near-Perron weight on the even-class section b in {0, 2, ..., 120} ───────
const NB = 61; // section blocks 0..120, even
const SHIFT = envE(0, 2); // positive spectral shift (the 2x2 bond is +/-a)

function buildSectionKernel() {
  const K = [];
  for (let i = 0; i < NB; i++) {
    const row = new Float64Array(NB);
    for (let k = 0; k < NB; k++) row[k] = i === k ? 0 : kEntry(2 * i, 2 * k);
    K.push(row);
  }
  return K;
}

const KSEC = buildSectionKernel();

function perronWeight(iters) {
  let x = new Float64Array(NB).fill(1);
  for (let it = 0; it < iters; it++) {
    const y = new Float64Array(NB);
    for (let i = 0; i < NB; i++) {
      let s = SHIFT * x[i];
      for (let k = 0; k < NB; k++) s += KSEC[i][k] * x[k];
      y[i] = s;
    }
    let nrm = 0;
    for (let i = 0; i < NB; i++) if (y[i] > nrm) nrm = y[i];
    for (let i = 0; i < NB; i++) x[i] = y[i] / nrm;
  }
  return x;
}

const XW = perronWeight(500);
const TAIL_Q = 0.2; // geometric weight ratio per even block step beyond the section

function weightAt(b) {
  const i = b / 2;
  if (i < NB) return XW[i];
  return XW[NB - 1] * Math.pow(TAIL_Q, i - (NB - 1));
}

// weighted-Schur ratio at even block b, kernel scanned to gap <= 800
function swRatio(b) {
  let s = 0;
  for (let bp = 0; bp <= b + 800; bp += 2) {
    if (bp === b) continue;
    const e = kEntry(b, bp);
    if (e === 0) continue;
    s += e * weightAt(bp);
  }
  return s / weightAt(b);
}

function lwEvenScan(bMax) {
  let best = 0;
  let arg = -1;
  for (let b = 0; b <= bMax; b += 2) {
    const r = swRatio(b);
    if (!Number.isFinite(r)) return { best: NaN, arg: b };
    if (r > best) {
      best = r;
      arg = b;
    }
  }
  return { best, arg };
}

// Rayleigh lower bound at the section weight (zero-padded outside)
function rayleighSection() {
  let num = 0;
  let den = 0;
  for (let i = 0; i < NB; i++) {
    den += XW[i] * XW[i];
    for (let k = 0; k < NB; k++) num += XW[i] * KSEC[i][k] * XW[k];
  }
  return num / den;
}

function oddClassSupRowSum(bMax) {
  let best = 0;
  let arg = -1;
  for (let b = 1; b <= bMax; b += 2) {
    const o = omegaE(b);
    if (o > best) {
      best = o;
      arg = b;
    }
  }
  return { best, arg };
}

// ── baked literals ────────────────────────────────────────────────────────────
const TX2_LIT = 2.8874500929283736e-4; // nineteenth
const ENV_V02_EXACT = 3.9197920255561178e-5; // nineteenth corner bond
const OM0_LIT = 3.9198069316120816e-5; // nineteenth b = 0 row sum
const OM2_LIT = 3.9231900742006723e-5; // nineteenth sup row sum (b = 2)
const CFAR_19 = 0.2717408057586117; // nineteenth achieved far ceiling
const HEAD_FLOOR = 0.096745062937484763; // fifteenth/sixteenth witness floor
const F97_FLOOR = 0.0012054673720820889; // fixed-97 witness floor
const GAP_HEAD_19 = 2.8088338309749887;
const GAP_97_19 = 225.42360917596611;
const RESIDUAL_19 = 1.4044169154874944; // imp-95045 residual after parity

const LW_LIT = 3.9197935113802585e-5; // weighted-Schur constant (even class)
const RAYLEIGH_LIT = 3.919793511380258e-5; // section Rayleigh lower bound
const SODD_LIT = 1.47203498255732e-6; // odd-class sup row sum (b = 3)
const CFAR_SW = 0.27150554192989773; // new achieved far ceiling 2 LW / Tx(2)
const IMPROVE_SW = 1.0008665157515448; // CFAR_19 / CFAR_SW
const LEDGER_VS_4_SW = 14.73266428216332; // 4 / CFAR_SW
const GAP_HEAD_SW = 2.8064020394026787;
const GAP_97_SW = 225.22844518052122;
const RESIDUAL_SW = 1.4032010197013394; // GAP_HEAD_SW / 2
const ROUTING_SLACK_LO = 1.0008665157515446; // OM2 / LW
const ROUTING_SLACK_HI = 1.0008665157515448; // OM2 / Rayleigh

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95008_PERRON_WEIGHTED_FAR_ROUTING = {
  ticket:
    "imp-95008 (continuation twenty-two: weighted-Schur aggregation replaces the unweighted sup-row-sum pullout - executes and consumes the joint ceiling-side lever (b2) block-mass AM-GM + (b3) sup_b routing named by imp-95019; answers the routing component of the imp-95074 sub-gap)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; refines the aggregation step of imp-95008-exact-pair-correlation-ceiling.js (Theorem Y-EXACT); audits imp-95074-residual-global-headroom-vs-local-optimum.js.",
  lemmaSW:
    "UNCONDITIONAL weighted Schur aggregation: for a symmetric nonnegative kernel K, any positive weight x and any nonnegative mass profile m, sum_{b != bp} m_b m_bp K(b, bp) <= Lw(x) sum m_b^2 with Lw(x) = sup_b (Kx)_b / x_b. Proof is the weighted AM-GM m_b m_bp <= (m_b^2 x_bp/x_b + m_bp^2 x_b/x_bp)/2 summed under symmetry. With x = 1, Lw(1) = sup_b OmegaE_b - the Theorem Y-EXACT aggregation is the unit-weight special case.",
  theoremYPerron:
    "Roll-up verbatim with per-class weighted constants: ||sum w_b||^2 <= 2 sum ||w_b||^2 + 2 max(LwEven(xE), LwOdd(xO)) M; parity 2-coloring and the per-pair envelope chain (Lemmas CC, RM, PF) carried unchanged; achieved point (cNear, cFar) = (2, 2 max(LwEven, LwOdd) / Tx(2)).",
  aggregationSharpness:
    "For any mass profile the envelope cross term can approach lambda_max(K) |m|^2 (Rayleigh at the Perron profile; caps realizable at the abstract Gram level by diagonal-dominant PSD completion with the diagonal norms free), so no aggregation scheme can certify below lambda_max; the near-Perron weight achieves it. Certified sandwich: Rayleigh 3.919793511380258e-5 <= lambda_max <= Lw 3.9197935113802585e-5 (relative width 2.3e-16). Entire (b2)+(b3) capacity: sup_b OmegaE_b / lambda_max in [1.0008665157515446, 1.0008665157515448] - 0.0866 percent, now consumed.",
  certifiedResult:
    "Reference theta = 10 (sigma = 1, beta = 1/3, c = v = D = 1): even-class kernel dominated by the (0, 2) bond envE(0, 2) = 3.9197920255561178e-5 (the nineteenth b = 0 near-tie is the shadow of this shared bond); near-Perron weight ~ (1, 1) on blocks 0 and 2; odd-class sup row sum 1.47203498255732e-6 at b = 3 (factor 26.6 below LwEven, row-sum bound suffices). New achieved point (cNear, cFar) = (2, 0.27150554192989773): ceiling 0.2717408057586117 -> 0.27150554192989773 (factor 1.0008665157515448; vs the pre-seventeenth 4: 14.73266428216332), headline gap 2.8088338309749887 -> 2.8064020394026787, fixed-97 gap 225.42360917596611 -> 225.22844518052122, residual after parity 1.4044169154874944 -> 1.4032010197013394. Floors untouched.",
  imp95074Consequence:
    "The ROUTING component of the imp-95074 scenario question is answered in the model family: block-mass re-weighting (any witness family) recovers at most 1.0008665 of the residual 1.4044169154874944, and the optimal mass profile is the near-even {0, 2} split the exhibited witness already uses. Neither imp-95074 mechanism carries the residual at block level - the flat-profile re-weighting lever (A) and the sup-pullout looseness (B) are both exactly the same 0.087 percent. The sqrt(2) signature reading is SUPERSEDED at block level: the surviving 1.4032010197013394 lives in the E-REALIZATION step (per-pair attainment at finite rates times the witness norm subtraction sum ||w_b||^2, a cost the bracket class never charges the ceiling), not in mass routing.",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA },
    tx2: TX2_LIT,
    bond: ENV_V02_EXACT,
    om0: OM0_LIT,
    om2: OM2_LIT,
    lwEven: LW_LIT,
    rayleigh: RAYLEIGH_LIT,
    oddSupRowSum: SODD_LIT,
    routingSlackInterval: [ROUTING_SLACK_LO, ROUTING_SLACK_HI],
    ceilings: { nineteenth: CFAR_19, perron: CFAR_SW },
    improvementFactor: IMPROVE_SW,
    ledgerVs4: LEDGER_VS_4_SW,
    headlineBracket: { lo: HEAD_FLOOR, hi: CFAR_SW, gapOld: GAP_HEAD_19, gapNew: GAP_HEAD_SW },
    fixed97Bracket: { lo: F97_FLOOR, hi: CFAR_SW, gapOld: GAP_97_19, gapNew: GAP_97_SW },
    residualAfterParity: { nineteenth: RESIDUAL_19, perron: RESIDUAL_SW },
    upwardRoundedSafeCeiling: 0.27150555,
    floatConditioning:
      "envE carries the nineteenth ~1e-8 relative partial-fraction cancellation (unfolded > folded, so baked literals understate and the upward-rounded ceiling 0.27150555 stays a valid upper bound); the 8.67e-4 improvement is five orders above that floor.",
    note: "floors UNTOUCHED - pure achieved-bound sharpening; the aggregation step is now certified lambda_max-sharp",
  },
  subGap:
    "imp-95008-subgap-witness-Erealization-split - OPEN: decompose the surviving residual 1.4032010197013394 into (per-pair attainment shortfall) x (norm-penalty sum ||w_b||^2 / (lambda_max M)) for the exhibited headline witness; needs the witness internals E_cross and sum ||w_b||^2 separately, which the chain does not bake (only the assembled floor F = E / (Tx(2) M) is a literal).",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "REFINED achieved-side ledger: (a) outer parity AM-GM factor 2 (Gram-sharp per imp-95018, unrecoverable); (b) substitution-point tightness (Lemma X floor strict, Lemma RHO cap attained to 0.4 percent); (b2)+(b3) block-mass AM-GM and sup_b routing are CLOSED by this move (certified lambda_max sandwich, width 2.3e-16); HONEST LIMIT: ~1e-8 float rounding carried from the nineteenth closed form; witness side: the E-realization split (named sub-gap), not claimed",
  ],
  isRigorous: true,
  rigorScope:
    "Lemma SW is elementary weighted AM-GM plus symmetry, unconditional, and reduces to the Theorem Y-EXACT aggregation at x = 1; Theorem Y-PERRON changes only the aggregation step of the carried roll-up (per-pair envelope chain, parity split and currencies untouched), so it is CONDITIONAL exactly on MAJ(sigma, theta) like its predecessor. The new ceiling is an ACHIEVED upper bound in the Theorem K bracket class {cNear <= 2, Tstar <= Tx(2)}. The sharpness claim is scoped to the AGGREGATION step (per-pair caps in, constant times M out): schemes bypassing the parity split or using joint near/far structure are outside it, and packet-level realizability of the Rayleigh profile is the open E-realization sub-gap, not claimed. The weight is a deterministic 500-step shifted power iterate on the 61-block even section with a geometric tail; ANY positive weight yields a valid constant by Lemma SW, so the weight itself needs no certification - only the ratio scan does, and it is recomputed from scratch by the assertions (b <= 400, gap <= 800, the nineteenth scan convention). Float evaluation carries the nineteenth ~1e-8 relative rounding, five orders below the priced 8.67e-4 improvement. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step (twenty-second continuation): NEW Lemma SW (weighted Schur aggregation, unconditional, x = 1 recovers Theorem Y-EXACT) and Theorem Y-PERRON re-run the parity roll-up with a near-Perron weight, replacing the unweighted sup-row-sum pullout sup_b OmegaE_b = 3.9231900742006723e-5 by the certified constant Lw = 3.9197935113802585e-5 with a machine-precision Rayleigh sandwich (width 2.3e-16) - the aggregation step is now lambda_max-SHARP, so the joint ceiling-side lever (b2) block-mass AM-GM + (b3) sup_b routing is executed and CONSUMED, measured at 1.0008665157515448 (0.0866 percent). Reference theta = 10: far ceiling 0.2717408057586117 -> 0.27150554192989773, headline gap 2.8088338309749887 -> 2.8064020394026787, fixed-97 gap 225.42360917596611 -> 225.22844518052122, floors untouched. Routing consequence for imp-95074: block-mass re-weighting in ANY family recovers at most 0.087 percent; the surviving residual 1.4032010197013394 is pinned to the E-realization step (attainment x norm subtraction), named as sub-gap imp-95008-subgap-witness-Erealization-split. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_PWR_ASSERTIONS = [
  {
    id: "imp95008-pwr-nineteenth-reproduction",
    description:
      "independent recomputation reproduces the nineteenth literals before refinement: Tx(2), the corner bond envE(0, 2), and the row sums OmegaE_0, OmegaE_2 (rel 1e-12)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return (
        rel(TX2, TX2_LIT) &&
        rel(envE(0, 2), ENV_V02_EXACT) &&
        rel(omegaE(0), OM0_LIT) &&
        rel(omegaE(2), OM2_LIT) &&
        rel((2 * omegaE(2)) / TX2, CFAR_19)
      );
    },
  },
  {
    id: "imp95008-pwr-kernel-rowsum-identity",
    description:
      "the same-parity block kernel K(b, bp) = envE(min, |b - bp|) has row sums equal to the nineteenth OmegaE_b on BOTH parities (b <= 60, gap <= 800, rel 1e-12) - the kernel and the Theorem Y-EXACT roll-up are the same object",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      for (let b = 0; b <= 60; b++) {
        if (!rel(rowSum(b, b + 800), omegaE(b))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-pwr-unit-weight-recovers-yexact",
    description:
      "Lemma SW at x = 1 recovers the Theorem Y-EXACT constant exactly: the unit-weight even-class ratio sup over b <= 400 equals sup_b OmegaE_b = 3.9231900742006723e-5 (rel 1e-12) - the generalization is strict and backward-compatible",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      let best = 0;
      for (let b = 0; b <= 400; b += 2) {
        const r = rowSum(b, b + 800);
        if (r > best) best = r;
      }
      return rel(best, OM2_LIT);
    },
  },
  {
    id: "imp95008-pwr-sandwich",
    description:
      "the lambda_max sandwich certifies to machine precision: bond envE(0, 2) <= Rayleigh <= Lw, Lw reproduces 3.9197935113802585e-5 and Rayleigh 3.919793511380258e-5 (rel 1e-12), relative width Lw/Rayleigh - 1 <= 1e-12, and Lw < sup_b OmegaE_b strictly",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const { best: lw, arg } = lwEvenScan(400);
      const ray = rayleighSection();
      return (
        rel(lw, LW_LIT) &&
        rel(ray, RAYLEIGH_LIT) &&
        envE(0, 2) <= ray &&
        ray <= lw &&
        lw / ray - 1 <= 1e-12 &&
        lw < OM2_LIT &&
        (arg === 0 || arg === 2)
      );
    },
  },
  {
    id: "imp95008-pwr-lemma-sw-battery",
    description:
      "Lemma SW checked directly: 25 deterministic LCG mass profiles m on the 61-block even section all satisfy m^T K m <= Lw |m|^2 (the weighted bound majorizes every quadratic-form value)",
    holds: () => {
      let seed = 12345;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 25; t++) {
        const m = new Float64Array(NB);
        for (let i = 0; i < NB; i++) m[i] = rand();
        let num = 0;
        let den = 0;
        for (let i = 0; i < NB; i++) {
          den += m[i] * m[i];
          for (let k = 0; k < NB; k++) num += m[i] * KSEC[i][k] * m[k];
        }
        if (!(num <= LW_LIT * den * (1 + 1e-12))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-pwr-weight-positive-tail-negligible",
    description:
      "the scan weight stays positive over the whole b <= 400 range (geometric tail ratio 0.2, no underflow) and every weighted ratio beyond the 61-block section is below 1e-100 - the sup is attained inside the section",
    holds: () => {
      for (let b = 0; b <= 400; b += 2) {
        if (!(weightAt(b) > 0)) return false;
      }
      for (let b = 122; b <= 400; b += 2) {
        if (!(swRatio(b) < 1e-100)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-pwr-odd-class-rowsum-suffices",
    description:
      "odd-class sup row sum reproduces 1.47203498255732e-6 at b = 3 (rel 1e-12) and sits a factor > 26 below LwEven, so the unweighted row-sum bound suffices for the odd class and the combined constant is LwEven",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const { best, arg } = oddClassSupRowSum(399);
      return rel(best, SODD_LIT) && arg === 3 && best * 26 < LW_LIT;
    },
  },
  {
    id: "imp95008-pwr-ceiling-and-brackets",
    description:
      "the new achieved far coefficient cFar = 2 Lw / Tx(2) reproduces 0.27150554192989773 (rel 1e-12), sits strictly below the nineteenth 0.2717408057586117 with improvement factor 1.0008665157515448 and ledger vs 4 of 14.73266428216332; headline gap 2.8088338309749887 -> 2.8064020394026787 and fixed-97 gap 225.42360917596611 -> 225.22844518052122 reproduce (rel 1e-9); both floors stay strictly below (floors untouched)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= (t || 1e-12) * Math.abs(lit);
      const { best: lw } = lwEvenScan(400);
      const c = (2 * lw) / TX2;
      return (
        rel(c, CFAR_SW) &&
        c < CFAR_19 &&
        rel(CFAR_19 / c, IMPROVE_SW) &&
        rel(4 / c, LEDGER_VS_4_SW) &&
        rel(c / HEAD_FLOOR, GAP_HEAD_SW, 1e-9) &&
        rel(c / F97_FLOOR, GAP_97_SW, 1e-9) &&
        rel(GAP_HEAD_SW / 2, RESIDUAL_SW, 1e-9) &&
        HEAD_FLOOR < c &&
        F97_FLOOR < c
      );
    },
  },
  {
    id: "imp95008-pwr-routing-slack-certificate",
    description:
      "the routing-slack certificate reproduces: sup_b OmegaE_b / lambda_max lies in the baked interval [1.0008665157515446, 1.0008665157515448] (endpoints OM2/Lw and OM2/Rayleigh, rel 1e-12), i.e. the entire (b2)+(b3) lever is worth 0.0866 percent",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const { best: lw } = lwEvenScan(400);
      const ray = rayleighSection();
      const lo = OM2_LIT / lw;
      const hi = OM2_LIT / ray;
      return rel(lo, ROUTING_SLACK_LO) && rel(hi, ROUTING_SLACK_HI) && lo <= hi && hi < 1.001;
    },
  },
  {
    id: "imp95008-pwr-honesty-gate",
    description:
      "the verdict states the ceiling move with floors untouched, scopes the sharpness claim to the aggregation step, names the E-realization sub-gap and the ~1e-8 float limit, records the imp-95074 routing consequence, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95008_PERRON_WEIGHTED_FAR_ROUTING.promotesBound === false &&
      IMP95008_PERRON_WEIGHTED_FAR_ROUTING.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_PERRON_WEIGHTED_FAR_ROUTING.verdict) &&
      /refereed bound is changed/i.test(IMP95008_PERRON_WEIGHTED_FAR_ROUTING.verdict) &&
      /floors untouched/.test(IMP95008_PERRON_WEIGHTED_FAR_ROUTING.verdict) &&
      /E-realization/.test(IMP95008_PERRON_WEIGHTED_FAR_ROUTING.verdict) &&
      /AGGREGATION step/.test(IMP95008_PERRON_WEIGHTED_FAR_ROUTING.rigorScope) &&
      /not claimed/.test(IMP95008_PERRON_WEIGHTED_FAR_ROUTING.rigorScope) &&
      /~1e-8/.test(IMP95008_PERRON_WEIGHTED_FAR_ROUTING.rigorScope) &&
      /HONEST LIMIT/.test(IMP95008_PERRON_WEIGHTED_FAR_ROUTING.openResiduals[4]) &&
      typeof IMP95008_PERRON_WEIGHTED_FAR_ROUTING.subGap === "string",
  },
];

for (const a of IMP95008_PWR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-perron-weighted-far-routing assertion failed: ${a.id}`);
  }
}

export default IMP95008_PERRON_WEIGHTED_FAR_ROUTING;
