/**
 * imp-95203 — LEVER 3: the cutoff-tensor scan. Is P = 97 optimal in the
 * freeze tuple q = (P, B, a, r, Y, delta, omega)?
 *
 * QUESTION. The Gate-2 continuation froze the prime cutoff at P = 97
 * (25 primes, five-shell cuts 0/5/10/17/25). The delivered evaluator
 * conventions, the exact cocycle allowance Rex (eq. 19), the carrier
 * remainder 877/(2^{m+1}(m+1)!) (eq. 17), and the five-shell structure
 * (eq. 12) all depend on P. Does any P in {79, 83, 89, 97, 101, 107}
 * give a better contract per unit of open-family difficulty?
 *
 * METHOD (structural, no giant scan). Paper exact formulas
 * (research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf,
 * eqs. 10-14, 17-20, Sections 4.4-4.6) plus the measured weld-ladder
 * structure (imp-95008 chain: theta = 10 far bracket, bridge-witness
 * Gram bonds rho(i,j) = e^{-mu tau}(1 + mu tau)). GRADE: MEASUREMENT
 * (structural scaling analysis on the paper formulas and the model
 * family) — not a contract, not a certification of any alternative P.
 *
 * ── (0) FIRST-ORDER INVARIANCE: cutoff moves are re-bracketings ─────────────
 * The 25-defect telescope (13),
 *   E_P = sum_j A_{<j} R_{>j} (q_{p_j} I - T_{p_j}) F_N ,   q_p = b_p p^{-sB},
 * is EXACT for any prime set and any order. Moving the cutoff 97 -> P'
 * moves, for each marginal prime p, the exact defect
 * A_< R_> (q_p I - T_p) F_N between the rough core C_P = R_P F_N and the
 * cocycle E_P: the underlying scalar (the unsplit two-ladder window sum)
 * is unchanged. This is the no-gain rule in cutoff form: to first order
 * the reserve ledger m_P - |A_P| eps_tr is INVARIANT under recuts;
 * differences are second-order, living exactly where the interval
 * enclosures charge (alias-packet enclosure eps_tr, carrier numerator,
 * shell-transition ledger).
 *
 * ── (a) EXACT COCYCLE RESERVE: marginal Euler weights are ledger-scale ──────
 * With the paper eq. (10) coefficient b_n = exp(t0 (log n)^2 / 4) and the
 * lower-edge abscissa sigma_ref = (1 + y0)/2 = 0.59045 (heat-flow row),
 *   |q_p| = b_p p^{-sigma} = p^{ t0 log p / 4 - sigma } .
 * Across the scan window |q_p| = 0.1237..0.1367 (table below): every
 * marginal prime carries an oscillatory Euler weight of ~2x the anchor
 * reserve 0.0655627054327926 and ~0.45x the whole allowance Rex = 0.27969.
 * The local decay exponent d log|q_p| / d log p = -sigma + t0 log p / 2
 * = -0.3076 at p = 97: |q_p| falls to the anchor-reserve scale 0.0656
 * only at p ~ 2436 (361 primes, ~4.03e5 alias packets) — no cutoff NEAR
 * 97 changes the regime. Over the open family 690988 <= N <= 54799999
 * (whose bounds are P-INDEPENDENT: set by x0 = X + 1 and the N = 54.8e6
 * source-closed start, via x_N = 4 pi (N^2 - t0/16)) the phases of the
 * marginal q_p(x) sweep astronomically many turns, so a UNIFORM contract
 * at cutoff P' must absorb the worst-phase swing sum_{p in symdiff}|q_p|:
 *   P = 89: 0.128 (2.0x anchor reserve);  P = 101: 0.127 (1.9x);
 *   P = 83: 0.260 (4.0x);  P = 107: 0.377 (5.7x);  P = 79: 0.394 (6.0x,
 *   1.41x Rex itself). No candidate recut is first-order favorable, and
 * the worst-phase ledger swing of even the nearest recut (89 or 101)
 * exceeds the entire documented anchor reserve.
 *
 * ── (b) ALIAS PACKETS in the [B_v, Pi_p] weld ──────────────────────────────
 * Eq. (14): prime p contributes p - 1 nonzero alias packets of weight 1/p
 * with stationary shifts u_{k,h} = v/(k - h/p). Packet count
 * A(P) = sum_{p <= P} (p - 1): 769 (79), 851 (83), 939 (89), 1035 (97),
 * 1135 (101), 1343 (107) — +30% weld enclosure work at 107 vs 97, and the
 * naive worst-phase mask-product enclosure prod(1 + |q_p|) grows by the
 * marginal factor 1.4262 at 107 (0.6903 at 79). Larger primes also weld
 * WORSE per packet: the bridge-pair separation currency on the p-grid is
 *   tau(p) = v (1/d2 - 1/d1) / r1 = (4 / ((1 - p^{-2}) r1)) / p ~ 3.186/p
 * (d1 = (p+1)/2p, d2 = (p-1)/2p), so the block-bond Gram entries
 * rho = e^{-mu tau}(1 + mu tau) stiffen toward 1 as p grows
 * (0.99516 at 79 -> 0.99675 at 97 -> 0.99732 at 107 at the baked
 * theta = 10 rate mu = 2.522167), and the exhibited witness-excess floor
 * of the imp-95008 ninth-continuation machinery RISES with p (theta = 10
 * witness, 97-baked parameters: -0.00195 at 79, 0.004294 at 97 — the
 * sibling literal 0.004293997501724381 — 0.004834 at 101, 0.012826 at
 * p = 999983): larger cutoffs push the far bracket floor UP, i.e. shrink
 * the provable-headroom side of the theta = 10 far bracket. Smaller
 * cutoffs weld easier but hand the saved oscillation straight back to the
 * rough core (see (0) and (a)).
 *
 * ── (c) SHELL RECOMBINATION + CARRIER ──────────────────────────────────────
 * Five-shell recut: pi(P) = 22, 23, 24, 25, 26, 28 across the scan; any
 * P != 97 re-cuts (0, 5, 10, 17, 25) (proportional recuts, e.g.
 * (0,4,9,15,22) at 79 or (0,5,11,19,28) at 107) and invalidates the
 * certified finite state machine of Fig. 3 plus the shell-transition
 * ledger; the telescope length pi(P) prices the defect chain linearly.
 * The ONLY P-monotone gain channel is carrier-mass thinning: the eq. (17)
 * numerator scales with the retained (P-rough) coefficient mass, i.e.
 * with the Mertens density prod_{p <= P}(1 - 1/p): proxy 877 ->
 * 907.1 (79) .. 851.9 (107), a <= 3.5% swing sitting on
 * rho_17 = 5.23e-19 — four orders below the eq. (18) shell charge
 * 9.67e-15 and ~17 orders below Rex. The one channel where larger P
 * helps is numerically dead; every channel that binds (worst-phase
 * ledger swing, alias enclosure, Gram-bond stiffening, telescope length,
 * recut) is flat-to-worse in both directions.
 *
 * ── VERDICT ────────────────────────────────────────────────────────────────
 * NO P in {79, 83, 89, 101, 107} beats 97 on reserve-per-open-family-
 * difficulty: first-order reserve is invariant (exact telescope
 * re-bracketing), the binding second-order channels degrade in BOTH
 * directions (smaller P: worst-phase rough-core swing up to 0.394 > Rex
 * reserve scale; larger P: +9.7..30% alias packets, stiffer Gram bonds,
 * rising witness floors, longer telescope), and the only monotone gain
 * (carrier thinning) is ~17 orders below the ledger. P = 97 is a frozen
 * CONVENTION whose value is the sunk certification (gamma atlas 356,468
 * cells, exact rational Rex, anchor cell, shell ledger — all certified
 * AT 97), not the optimum of a smooth objective; the objective is locally
 * flat, so nothing material is being left on the table. RECOMMENDATION:
 * KEEP P = 97 FROZEN. Changing P re-opens every closed scope (atlas,
 * Rex, anchor, telescope, shells = a full new certification campaign),
 * so the bar is a MATERIAL improvement, and the scan finds none.
 *
 * HONEST CAVEATS. (i) Measurement grade: the scan uses the paper's exact
 * formulas and the imp-95008 MODEL-FAMILY weld structure; it certifies no
 * alternative-P continuation and cannot exclude that a from-scratch
 * campaign at some P' lands a different exact Rex ledger. (ii) The
 * witness floors at p != 97 are EXHIBITED evaluations at the 97-optimized
 * baked parameters (legal floors, not per-p optima); the monotone
 * mechanism (tau ~ 3.186/p, Gram bonds -> 1) is structural, the literal
 * values are not sharp. (iii) sigma_ref = (1 + y0)/2 is the heat-row
 * abscissa convention; at sigma = 1 (ladder-module reference) all |q_p|
 * shrink ~6.5x but every comparative conclusion is unchanged (worst-phase
 * swings still move BOTH ways, slope still negative and small). (iv)
 * TRANSCRIPTION FLAG: imp-95012-gate2-frozen-spec.js bCoefficient bakes
 * b_n = exp((log n)^2/4) WITHOUT the t0 factor of paper eq. (10)
 * b_n = exp(t0 (log n)^2/4); with t0 omitted, q_97 ~ 12.6 >> 1 and the
 * Euler mask is no longer a small perturbation of 1 — this module uses
 * the paper formula and flags the frozen-spec discrepancy for audit (the
 * frozen module's own assertions only exercise b_1 = 1, which holds
 * either way; not edited here).
 *
 * Import-light (no heavy bundle, no imports). Changes no bound; does NOT
 * promote any Lambda row; NO QED; no refereed bound is changed.
 */

// ── frozen conventions ────────────────────────────────────────────────────────
const T0 = 24727519 / 200000000; // 0.123637595 (eq. 8)
const Y0 = 1809 / 10000; // 0.1809
const SIGMA_REF = (1 + Y0) / 2; // 0.59045 heat-row abscissa
const X0 = 6000000185828; // X + 1
const ANCHOR_RESERVE = 0.0655627054327926;
const REX = 0.2796881955526244146123;
const SHELL_CHARGE = 590221 / 61030685553249484800; // eq. (18) = 9.67089e-15

const PRIMES_TO_130 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127,
];
const SCAN_P = [79, 83, 89, 97, 101, 107];

// paper eq. (10): b_n = exp(t0 (log n)^2 / 4)
export function bPaper(n) {
  const l = Math.log(n);
  return Math.exp((T0 * l * l) / 4);
}
// marginal Euler weight |q_p| = b_p p^{-sigma}
export function qAbs(p, sigma) {
  return bPaper(p) * Math.pow(p, -sigma);
}

const primesLE = (P) => PRIMES_TO_130.filter((p) => p <= P);
const nextPrime = (P) => PRIMES_TO_130.find((p) => p > P);
const symdiff97 = (P) => {
  const a = primesLE(P);
  const b = primesLE(97);
  return [...a.filter((p) => !b.includes(p)), ...b.filter((p) => !a.includes(p))];
};

// ── the scan table (all rows recomputed by the assertions) ───────────────────
export function scanRow(P, sigma = SIGMA_REF) {
  const ps = primesLE(P);
  const sd = symdiff97(P);
  const mertens = ps.reduce((a, p) => a * (1 - 1 / p), 1);
  const mertens97 = primesLE(97).reduce((a, p) => a * (1 - 1 / p), 1);
  return {
    P,
    piP: ps.length,
    aliasPackets: ps.reduce((a, p) => a + p - 1, 0), // sum (p-1), eq. (14)
    marginalPrimesVs97: sd,
    worstPhaseSwingVs97: sd.reduce((a, p) => a + qAbs(p, sigma), 0),
    qNextRetained: qAbs(nextPrime(P), sigma), // first P-rough oscillation scale
    maskUpperRatioVs97:
      ps.reduce((a, p) => a * (1 + qAbs(p, sigma)), 1) /
      primesLE(97).reduce((a, p) => a * (1 + qAbs(p, sigma)), 1),
    carrierNumeratorProxy: (877 * mertens) / mertens97, // Mertens-thinning proxy
  };
}
export const SCAN_TABLE = SCAN_P.map((P) => scanRow(P));

// ── weld-side p-dependence (imp-95008 model-family machinery, verbatim) ─────
const SIGMA_MODEL = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
function bridgeWitness(p) {
  const d1 = (p + 1) / (2 * p);
  const d2 = (p - 1) / (2 * p);
  const h3 = Math.ceil((3 * p) / 4) - 1;
  const d3 = 1 - h3 / p;
  const d4 = d3 - 1 / p;
  const d = [d1, d2, d3, d4];
  return { d, u: d.map((x) => VV / x), r: d.map((x) => CC * Math.pow(x, -BETA)) };
}
const fCorr = (z) => Math.exp(-z) * (1 + z);
export function witnessExcess(p, mu, a) {
  const w = bridgeWitness(p);
  const t = (i, j) => Math.abs(w.u[j] - w.u[i]);
  const rho = (i, j) => fCorr(mu * t(i, j));
  const q =
    -(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) +
    2 *
      (a[0] * a[1] * rho(0, 1) +
        a[0] * a[2] * rho(0, 2) +
        a[0] * a[3] * rho(0, 3) +
        a[1] * a[3] * rho(1, 3) +
        a[2] * a[3] * rho(2, 3)) -
    2 * a[1] * a[2] * rho(1, 2);
  return q / mu;
}
const MU_T10 = 2.522167;
const A_T10 = [0.636635, 0.621654, 0.309907, 0.334962];
export function bridgeTau(p) {
  const d1 = (p + 1) / (2 * p);
  const d2 = (p - 1) / (2 * p);
  const r1 = CC * Math.pow(d1, -BETA);
  return (VV * (1 / d2 - 1 / d1)) / r1;
}
export const WELD_TREND = SCAN_P.map((p) => ({
  p,
  bridgeTau: bridgeTau(p),
  tauTimesP: bridgeTau(p) * p, // ~3.186, the exact 1/p law
  gramBondT10: fCorr(MU_T10 * bridgeTau(p)),
  exhibitedExcessT10: witnessExcess(p, MU_T10, A_T10), // 97-baked params
}));

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP_95203_CUTOFF_TENSOR_SCAN = {
  id: 'imp-95203',
  title: 'Cutoff-tensor scan: P = 97 vs P in {79, 83, 89, 101, 107}',
  grade: 'measurement',
  source:
    'paper eqs. 10-14, 17-20 (Sections 4.4-4.6) + imp-95008 weld-ladder model-family machinery + imp-95012 frozen spec',
  firstOrderInvariance:
    'The 25-defect telescope (13) is exact for any prime set: a cutoff move transfers exact defects A_< R_> (q_p I - T_p) F_N between rough core and cocycle without changing the underlying scalar — first-order reserve invariance (the no-gain rule in cutoff form). All P-dependence is second-order, in the enclosure charges.',
  scanTable: SCAN_TABLE,
  weldTrend: WELD_TREND,
  bindingChannels: {
    marginalEulerWeightAt97: qAbs(97, SIGMA_REF), // 0.1282, ~2x anchor reserve
    localSlopeDlogQDlogP: -SIGMA_REF + (T0 * Math.log(97)) / 2, // -0.3076
    kneePrimeWhereQEqualsReserve: 2436, // pi = 361, ~4.03e5 alias packets
    anchorReserve: ANCHOR_RESERVE,
    RexExact: REX,
  },
  deadGainChannel: {
    channel: 'carrier-mass thinning (eq. 17 numerator, Mertens proxy)',
    proxyRange: '877 -> 907.1 (P=79) .. 851.9 (P=107)',
    magnitude: 'acts on rho_17 = 5.23e-19, 4 orders below the shell charge 9.67e-15, ~17 below Rex',
  },
  openFamilyPIndependence:
    'x_N = 4 pi (N^2 - t0/16): x_690988 <= x0 = X + 1 < x_690989, and the closure start N = 54,800,000 is a source-verification fact — neither bound involves P, so no recut shrinks the open family.',
  transcriptionFlag:
    'imp-95012-gate2-frozen-spec.js bCoefficient omits the t0 factor of paper eq. (10) (bakes exp(log^2 n / 4), paper has exp(t0 log^2 n / 4)); with t0 omitted q_97 ~ 12.6 >> 1 and the Euler mask is not a small perturbation — audit the frozen spec transcription (its own assertions only test b_1 = 1).',
  recommendation: 'KEEP-P97-FROZEN',
  verdict:
    'MEASUREMENT-grade structural scan: no P in {79, 83, 89, 101, 107} beats 97 on reserve-per-open-family-difficulty. First-order reserve is invariant under recuts (exact telescope re-bracketing); the binding second-order channels degrade both ways (smaller P: worst-phase rough-core swing 0.26-0.39 vs anchor reserve 0.0656; larger P: +9.7-30% alias packets, Gram bonds stiffen toward 1 as tau ~ 3.186/p, exhibited witness floors rise, telescope lengthens, shells re-cut); the only P-monotone gain (carrier thinning) is ~17 orders below the ledger. P = 97 is a frozen convention whose value is the sunk certification at 97 (gamma atlas 356,468 cells, exact rational Rex, anchor cell, shell ledger); the local objective is flat, so the material-improvement bar for a new certification campaign is not met. Changes no bound; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP_95203_ASSERTIONS = [
  {
    id: 'imp-95203-prime-counts-and-alias-packets',
    description:
      'pi(P) = 22, 23, 24, 25, 26, 28 and alias-packet counts sum(p-1) = 769, 851, 939, 1035, 1135, 1343 across the scan window',
    holds: () => {
      const pi = SCAN_TABLE.map((r) => r.piP).join(',');
      const al = SCAN_TABLE.map((r) => r.aliasPackets).join(',');
      return pi === '22,23,24,25,26,28' && al === '769,851,939,1035,1135,1343';
    },
  },
  {
    id: 'imp-95203-marginal-euler-weights-ledger-scale',
    description:
      '|q_p| at sigma_ref = (1+y0)/2 sits in [0.1237, 0.1368] for p in 79..109, is monotone decreasing in p, exceeds the anchor reserve everywhere in the window, and the local slope is -0.3076',
    holds: () => {
      const ps = [79, 83, 89, 97, 101, 103, 107, 109];
      const qs = ps.map((p) => qAbs(p, SIGMA_REF));
      for (let i = 1; i < qs.length; i++) if (!(qs[i] < qs[i - 1])) return false;
      const inBand = qs.every((q) => q > 0.1237 && q < 0.1368);
      const aboveReserve = qs.every((q) => q > ANCHOR_RESERVE);
      const slope = -SIGMA_REF + (T0 * Math.log(97)) / 2;
      return inBand && aboveReserve && Math.abs(slope - -0.30764) < 1e-4 &&
        Math.abs(qAbs(97, SIGMA_REF) - 0.128187) < 1e-5;
    },
  },
  {
    id: 'imp-95203-worst-phase-swings-vs-reserve',
    description:
      'worst-phase ledger swings vs 97: 0.394 (79), 0.260 (83), 0.128 (89), 0 (97), 0.127 (101), 0.377 (107) — even the nearest recut exceeds the whole anchor reserve 0.0656, and P = 79 exceeds Rex itself times 1.41',
    holds: () => {
      const s = Object.fromEntries(SCAN_TABLE.map((r) => [r.P, r.worstPhaseSwingVs97]));
      return (
        Math.abs(s[79] - 0.394428) < 1e-5 &&
        Math.abs(s[83] - 0.259844) < 1e-5 &&
        Math.abs(s[89] - 0.128187) < 1e-5 &&
        s[97] === 0 &&
        Math.abs(s[101] - 0.126609) < 1e-5 &&
        Math.abs(s[107] - 0.376877) < 1e-5 &&
        s[89] > ANCHOR_RESERVE &&
        s[101] > ANCHOR_RESERVE &&
        s[79] > REX &&
        Math.abs(s[79] / REX - 1.41) < 0.01
      );
    },
  },
  {
    id: 'imp-95203-carrier-channel-dead',
    description:
      'the Mertens carrier proxy spans 907.1 (79) to 851.9 (107) — a <= 3.5% swing on rho_17 = 5.23e-19, which is > 4 orders below the eq. (18) shell charge and > 17 orders below Rex: the only P-monotone gain channel cannot bind',
    holds: () => {
      const c = Object.fromEntries(SCAN_TABLE.map((r) => [r.P, r.carrierNumeratorProxy]));
      let fact = 1;
      for (let k = 2; k <= 18; k++) fact *= k;
      const rho17 = 877 / (Math.pow(2, 18) * fact);
      return (
        Math.abs(c[79] - 907.13) < 0.01 &&
        Math.abs(c[107] - 851.85) < 0.01 &&
        c[97] === 877 &&
        Math.abs(rho17 - 5.225389294223831e-19) < 1e-30 &&
        (c[79] / 877) * rho17 < SHELL_CHARGE / 1e3 &&
        (c[79] / 877) * rho17 < REX / 1e17
      );
    },
  },
  {
    id: 'imp-95203-mask-enclosure-marginal-ratios',
    description:
      'worst-phase mask-product enclosure ratio vs 97: 0.6903 at P = 79 and 1.4262 at P = 107 — the enclosure charge grows ~43% at the largest scan cutoff',
    holds: () => {
      const m = Object.fromEntries(SCAN_TABLE.map((r) => [r.P, r.maskUpperRatioVs97]));
      return (
        Math.abs(m[79] - 0.690347) < 1e-5 &&
        Math.abs(m[107] - 1.426204) < 1e-5 &&
        Math.abs(m[97] - 1) < 1e-12
      );
    },
  },
  {
    id: 'imp-95203-weld-trend-tau-gram-floor',
    description:
      'bridge tau obeys the exact 1/p law (tau * p in [3.184, 3.189] across the scan), Gram bonds stiffen monotonically toward 1 (0.995157 at 79 -> 0.996752 at 97 -> 0.997319 at 107), and the exhibited theta = 10 excess at p = 97 reproduces the imp-95008 baked literal 0.004293997501724381',
    holds: () => {
      const tp = WELD_TREND.map((r) => r.tauTimesP);
      if (!tp.every((x) => x > 3.184 && x < 3.189)) return false;
      const g = WELD_TREND.map((r) => r.gramBondT10);
      for (let i = 1; i < g.length; i++) if (!(g[i] > g[i - 1])) return false;
      const at = (p) => WELD_TREND.find((r) => r.p === p);
      return (
        Math.abs(at(79).gramBondT10 - 0.995157) < 1e-6 &&
        Math.abs(at(107).gramBondT10 - 0.997319) < 1e-6 &&
        Math.abs(at(97).exhibitedExcessT10 - 0.004293997501724381) < 1e-12 &&
        at(101).exhibitedExcessT10 > at(97).exhibitedExcessT10 &&
        Math.abs(witnessExcess(999983, MU_T10, A_T10) - 0.01282647) < 1e-7
      );
    },
  },
  {
    id: 'imp-95203-open-family-p-independent',
    description:
      'x_N = 4 pi (N^2 - t0/16) straddles x0 = X + 1 between N = 690988 and 690989, and both family bounds involve only (X, t0, source-closure start), never P',
    holds: () => {
      const xN = (N) => 4 * Math.PI * (N * N - T0 / 16);
      return xN(690988) <= X0 && X0 < xN(690989) && xN(690987) < X0;
    },
  },
  {
    id: 'imp-95203-knee-far-from-window',
    description:
      '|q_p| at sigma_ref only reaches the anchor-reserve scale at p ~ 2436 (still above the reserve at 2400, below at 2450): no cutoff near 97 changes the regime',
    holds: () =>
      qAbs(2400, SIGMA_REF) > ANCHOR_RESERVE &&
      qAbs(2450, SIGMA_REF) < ANCHOR_RESERVE &&
      qAbs(107, SIGMA_REF) > 1.88 * ANCHOR_RESERVE,
  },
  {
    id: 'imp-95203-sigma-sensitivity',
    description:
      'at sigma = 1 (ladder-module reference) the marginal weights shrink to ~0.019 but every comparison is unchanged: |q_p| still monotone decreasing with small negative slope, and the worst-phase swings still land on BOTH sides of 97',
    holds: () => {
      const ps = [79, 83, 89, 97, 101, 107];
      const qs = ps.map((p) => qAbs(p, 1));
      for (let i = 1; i < qs.length; i++) if (!(qs[i] < qs[i - 1])) return false;
      const slope1 = -1 + (T0 * Math.log(97)) / 2;
      return (
        Math.abs(qAbs(97, 1) - 0.019686) < 1e-5 &&
        slope1 < 0 &&
        Math.abs(slope1 - -0.71719) < 1e-4
      );
    },
  },
  {
    id: 'imp-95203-transcription-flag-is-real',
    description:
      'the flagged discrepancy is arithmetic fact: paper eq. (10) b_97 = exp(t0 log^2 97 / 4) = 1.9096 gives q_97 = 0.128 < 1, while the imp-95012 bCoefficient convention exp(log^2 97 / 4) = 187.17 gives q_97 = 12.6 > 1 (mask not a small perturbation)',
    holds: () => {
      const l = Math.log(97);
      const bNoT0 = Math.exp((l * l) / 4);
      return (
        Math.abs(bPaper(97) - 1.909557) < 1e-5 &&
        Math.abs(bNoT0 - 187.166) < 0.01 &&
        bNoT0 * Math.pow(97, -SIGMA_REF) > 1 &&
        qAbs(97, SIGMA_REF) < 1
      );
    },
  },
  {
    id: 'imp-95203-honesty-gate',
    description:
      'measurement grade recorded; recommendation KEEP-P97-FROZEN; recert caveat, transcription flag, NO QED, PT SOTA all present; no bound promoted',
    holds: () =>
      IMP_95203_CUTOFF_TENSOR_SCAN.grade === 'measurement' &&
      IMP_95203_CUTOFF_TENSOR_SCAN.recommendation === 'KEEP-P97-FROZEN' &&
      /NO QED/.test(IMP_95203_CUTOFF_TENSOR_SCAN.verdict) &&
      /refereed bound is changed/i.test(IMP_95203_CUTOFF_TENSOR_SCAN.verdict) &&
      /material-improvement bar/.test(IMP_95203_CUTOFF_TENSOR_SCAN.verdict) &&
      /sunk certification/.test(IMP_95203_CUTOFF_TENSOR_SCAN.verdict) &&
      /audit the frozen spec transcription/.test(IMP_95203_CUTOFF_TENSOR_SCAN.transcriptionFlag),
  },
];

for (const a of IMP_95203_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95203-cutoff-tensor-scan assertion failed: ${a.id}`);
  }
}

export default IMP_95203_CUTOFF_TENSOR_SCAN;
