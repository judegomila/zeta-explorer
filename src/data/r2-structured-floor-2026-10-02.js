/**
 * @fileoverview r2-structured-floor-2026-10-02 — structure-preserving certificate for the joint source floor of Raymond’s chain
 * (Zenodo 22867547, regenerated locally): small primes treated exactly at θ_S = 0 on an adaptive prime prefix S = {p ≤ P},
 * P ≤ 47, chosen per entry by cos(a log p / 2) ≥ 0.3; rough labels ≤ N0 by the exact Dirichlet-log recursion; tails above N0,
 * the reflected branch and the time box in interval arithmetic. Consumed by the b145 multi-height comparison at PT floor height,
 * with and without the b145 two-band stack. One internal adversarial referee pass (minor, not refuted; one certification bug found).
 *
 * Referee corrections applied (tmp/r2-refF-*):
 *  - Slope-AR bug. r2-floor-batch*.py passed the reflected norm AR of the LAST time sub-cell to the L-slope check; the first
 *    sub-cell has AR larger by a factor 1.0056. Recomputing Dslope with the maximum AR lowers 1985 of 4474 stored floors, by at most
 *    3.29e-4 (376|0.88|sharp). Corrected tables: tmp/r2-refF-out/corrected/. The batch scripts are patched in this synthesis
 *    (AR = max over all sub-cells and pieces). All Λ values below use the corrected tables.
 *      band U1 (multi-height)    0.144505107309658 → 36126446200683/250000000000000 = 0.144505784802732
 *      Raymond start (multi)     0.146146742019966 → 913421175397/6250000000000 = 0.146147388063520
 *      κ = 1 only                0.146605717289275 → 0.146605717289276 (band 0.145196639870979)
 *  - Time box. The radial-contraction step is not written in the files. Referee re-derivation: valid if the box-coefficient function
 *    F* has no zeros on the whole closed small-prime polydisc. Raymond’s A_+ (max 0.449) gives this only up to about a 1% coefficient
 *    inflation (box coefficients sit at L′ = L t_L / t, outside the frequency range A_+ covers). Status: one extra uncertified step.
 *    Lemma-free alternative (direct time ball [a(t_R′), a(t_L′)]) measured at 4 entries: +0.00194 to +0.00225 in K0* at nsub = 2,
 *    +0.00064 to +0.00088 at nsub = 3–4. Exact consumer with every corrected floor lowered by 0.0023: band 0.144544975039788.
 *  - Outer lemma. A float ascent of the TRUE relaxed J over all prime phases has its maximum slightly OFF θ_S = 0 (θ_p ∝ log p,
 *    excess 2.2e-4 / 2.7e-5 / 1e-6 at three entries), while the certificate’s own Φ decreases away from 0 along those directions
 *    (−6e-9 to −1.4e-3). The lemma stated for Φ survives; a proof must be specific to Φ, not inherited from J.
 *  - The tail FFT slack (1e-12·ΣD·Σμ per entry) is a heuristic allowance, not a proved FFT error bound (negligible size).
 *  - Combined check (this synthesis, exact consumer tmp/r2-floor-consume-shift.py on tmp/r2-refF-out/corrected_m0023 with an extra
 *    −0.02): slope-fixed + lemma-free time-box allowance 0.0023 + weak outer lemma margin 0.02 → band 1448843462793/10^13 = 0.1448843462793.
 *
 * PROVED: nothing unconditional. In-session derivations, one internal referee pass: combination inequality (re-derived and matched to
 *  r2core_k.c), L-slope lemma with deficit, adaptive-S extension. CERTIFIED: 2074 adaptive + 326 sharp refreshed-window entries (arb 128 bit
 *  + outward complex-ball C engine), reproduced by the referee to ≤ 2.1e-15 with independent coefficient enclosures; exact rational
 *  consumer outputs. CONDITIONAL: every Λ value (outer lemma, time-box F* zero-freeness or the 0.0023 allowance, G0, multi-height consumer;
 *  band values also Lemma B incl. BB1/BB2, FLINT window, MTY, H2, U2). MEASURED: Kronecker gaps, outer-lemma sampling, robustness.
 *  HEURISTIC: the cos ≥ 0.3 selection rule (decides S, does not validate a floor); Kronecker reference values (float ascents).
 * Verdict: below 0.145 at PT floor height only with the band and only conditionally; without the band 0.146147 (not below 0.145).
 *  PT Lambda <= 0.2 stands. RH open. NO QED.
 * Files: tmp/r2-floor-{cert*,batch*,ccp,consume,consume-shift,adapt-*,outer-*,kron-compare}.py, tmp/r2-floor-c/, tmp/r2-floor-out/,
 *  referee tmp/r2-refF-*.py, tmp/r2-refF-out/ (corrected/, corrected_m0023/, CONSUME_slopefix*.json); /tmp/r2-floor-archive/ (volatile).
 * Import-free. ASSERTIONS recompute the rationals and margins, the slope-fix shifts, the robustness ladder, the gap-closing shares, the
 * adaptive prefix rule at cell 0 (P = 11; cos for p = 19 is 0.046), and the gap ladder monotonicity.
 */

const rat = (s) => { const [a, b] = String(s).split('/').map(Number); return a / (b ?? 1); };
// Largest prime p ≤ 47 such that every prime ≤ p has cos(a log p / 2) ≥ c (the adaptive prefix rule).
const PRIMES47 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const prefixP = (a, c = 0.3) => { let P = null; for (const p of PRIMES47) { if (Math.cos((a * Math.log(p)) / 2) >= c) P = p; else break; } return P; };

export const R2_STRUCTURED_FLOOR = Object.freeze({
  id: 'r2-structured-floor-2026-10-02',
  date: '2026-10-02',
  title: 'Structure-preserving joint source floor — Λ ≤ 0.1445058 at PT floor height with the two-band stack, conditional on the outer lemma',
  status:
    'CONDITIONAL (outer lemma unproved; time-box F* zero-freeness uncertified; Raymond chain G0; multi-height consumer; band values also on '
    + 'Lemma B with BB1/BB2 unproved, FLINT window, MTY, H2) + CERTIFIED floors (slope-fixed) + MEASURED gaps. One internal referee pass '
    + '(minor, one bug fixed). No bound below 0.2 is proved. NO QED.',
  headline:
    'Slope-corrected structured floors with the b145 two-band stack give Λ ≤ 36126446200683/250000000000000 = 0.144505784802732 at PT floor '
    + 'height (margin 4.94e-4), conditional on the outer lemma (θ_S = 0 maximises the certificate’s bound function Φ) and the band inputs. '
    + 'Without the band: 0.146147388063520. With a weak outer lemma (margin 0.02) and the lemma-free time-box allowance (0.0023): 0.1448843462793.',

  exact: Object.freeze({
    bandMulti: '36126446200683/250000000000000',
    raymondMulti: '913421175397/6250000000000',
    bandK1: '145196639870979/1000000000000000',
    raymondK1: '36651429322319/250000000000000',
    bandMultiPreFix: '72252553654829/500000000000000',
    raymondMultiPreFix: '73073371009983/500000000000000',
    bandTimeBox0023: '36136243759947/250000000000000',
    raymondTimeBox0023: '146183989848867/1000000000000000',
    bandTimeBoxWeak002: '1448843462793/10000000000000',
    bandWeak002PreFix: '72422425356253/500000000000000',
    prevS235Band: 0.145378548198705,
    b145BestPT: '18409208597849/125000000000000',
    trackARegression: 0.148963469500858,
    U2: '36063660805739/250000000000000',
  }),
  slopeFix: Object.freeze({ lowered: 1985, stored: 4474, maxShift: 3.29407602e-4, worst: '376|0.88|sharp', ARratio: 1.0055701352776176 }),
  // uniform floor loss δ (pre-fix floors) → band value; exact consumer runs
  robustness: Object.freeze([[0, 0.144505107309658], [0.005, 0.144590], [0.01, 0.144675], [0.02, 0.144844850712506], [0.03, 0.145014189001195]]),
  kronGaps: Object.freeze([0.0049, 0.0062, 0.0094, 0.0123, 0.0187, 0.0252, 0.0309, 0.0308, 0.0282, 0.0249, 0.0277, 0.0279]),
  gapClosedShare: [0.878, 0.947],
  gapLadderCell350: Object.freeze([[5, 0.6539], [7, 0.6322], [11, 0.6221], [13, 0.6147], [17, 0.6094], [19, 0.6051], [23, 0.6017], [29, 0.5993], [31, 0.5971], [37, 0.5955], [43, 0.5930], [47, 0.5921]]),
  kronCell350: 0.5613,
  outerLemma: Object.freeze({
    statement: 'for the cos-positive prefix S of each entry, sup over θ_S of Φ(θ_S) = Φ(0)',
    weakForm: 'sup Φ ≤ Φ(0) + 0.02 suffices (band 0.1448843462793 with the time-box allowance)',
    sampled: { entries: 216, of: 635, evals: 12615, maxExcess: -7.579157303061468e-5 },
    ascents: '10 adaptive-S + 16 P5 entries: maximum at θ_S = 0',
    failsWithNegCos: { cell: 0, a: 1.0355, S29: 0.37547, S47: 0.3583, kron: 0.37702 },
    trueJoffZero: [2.2e-4, 2.7e-5, 1e-6],
  }),
  timeBox: Object.freeze({ directBallNsub2: [0.00194, 0.00225], directBallNsub34: [0.00064, 0.00088], allowanceUsed: 0.0023 }),
  certified: Object.freeze({ adaptive: 2074, sharpRefreshed: 326, s235: 2074, rerunAgree: 2.1e-15, minCosOverRanges: 0.30014, AplusMax: [0.294, 0.357, 0.449], minHeight: 0.6336 }),

  verdict:
    'Λ < 0.145 at PT floor height holds only conditionally: 0.144505784802732 with the two-band stack (slope-fixed), conditional on the outer '
    + 'lemma, the time-box zero-freeness step (or its 0.0023 allowance: 0.144544975039788), Raymond’s chain G0, the multi-height consumer and the '
    + 'band inputs (Lemma B with BB1/BB2 not proved, FLINT window, MTY, H2, U2). Without the band 0.146147388063520. A weak outer lemma with margin '
    + '0.02 is enough (0.1448843462793 with the time-box allowance). PT Lambda <= 0.2 stands. RH open. NO QED.',
  nextStep:
    'Certify the weak outer lemma sup Φ ≤ Φ(0) + 0.02 on the 635 band-path entries (second-order Taylor box bounds near θ_S = 0 plus coarse '
    + 'global bounds, P47 late cells first) or prove a monotonicity lemma for cos-positive prime sets; write the time-box lemma or re-run the floors '
    + 'with the direct time ball at nsub = 3–4 (+0.0006–0.0009); send the combination inequality and deficit slope lemma to an external referee.',
});

const F = R2_STRUCTURED_FLOOR;
const E = F.exact;

export const R2_STRUCTURED_FLOOR_ASSERTIONS = Object.freeze([
  {
    id: 'r2-floor-exact-values',
    holds: () => Math.abs(rat(E.bandMulti) - 0.144505784802732) < 1e-15 && Math.abs(rat(E.raymondMulti) - 0.14614738806352) < 1e-15
      && Math.abs(rat(E.bandTimeBox0023) - 0.144544975039788) < 1e-15 && Math.abs(rat(E.bandTimeBoxWeak002) - 0.1448843462793) < 1e-15
      && Math.abs(rat(E.bandMultiPreFix) - 0.144505107309658) < 1e-15 && Math.abs(rat(E.bandWeak002PreFix) - 0.144844850712506) < 1e-15,
    why: 'Rationals match the quoted decimals (exact consumer outputs, slope-fixed and pre-fix).',
  },
  {
    id: 'r2-floor-slope-fix-direction',
    holds: () => {
      const dB = rat(E.bandMulti) - rat(E.bandMultiPreFix), dR = rat(E.raymondMulti) - rat(E.raymondMultiPreFix);
      // lowering floors can only raise the output; bounded by sensitivity |dU/dδ| ≈ 0.0166 times the max shift
      return dB > 0 && dR > 0 && dB < 0.0166 * F.slopeFix.maxShift * 1.5 && Math.abs(dB - 6.77493e-7) < 1e-11
        && F.slopeFix.lowered < F.slopeFix.stored && F.slopeFix.ARratio > 1 && F.slopeFix.ARratio < 1.01;
    },
    why: 'The slope-AR fix lowers floors (max 3.29e-4), so every output rises: band +6.77e-7, within the sensitivity bound 0.0166 × shift.',
  },
  {
    id: 'r2-floor-below-0145-only-with-band',
    holds: () => rat(E.bandMulti) < 0.145 && rat(E.raymondMulti) > 0.145 && rat(E.raymondK1) > 0.145 && rat(E.bandK1) > 0.145
      && rat(E.bandTimeBox0023) < 0.145 && rat(E.bandTimeBoxWeak002) < 0.145 && Math.abs(0.145 - rat(E.bandMulti) - 4.942e-4) < 1e-6
      && Math.abs(0.145 - rat(E.bandTimeBoxWeak002) - 1.157e-4) < 1e-6
      && Math.max(rat(E.bandMulti), rat(E.U2)) === rat(E.bandMulti)
      && rat(E.bandMulti) < E.prevS235Band && E.prevS235Band < rat(E.b145BestPT) && rat(E.b145BestPT) < E.trackARegression,
    why: 'Below 0.145 needs the multi-height band (κ = 1 alone 0.145197); band = U1 > U2; margins 4.94e-4 (headline) and 1.16e-4 (weak lemma + time-box allowance).',
  },
  {
    id: 'r2-floor-robustness-ladder',
    holds: () => {
      const r = F.robustness;
      const slopes = r.slice(1).map(([d, u], i) => (u - r[i][1]) / (d - r[i][0]));
      const cross = r[3][0] + (0.145 - r[3][1]) / ((r[4][1] - r[3][1]) / (r[4][0] - r[3][0]));
      return r.every(([d, u], i) => i === 0 || u > r[i - 1][1]) && slopes.every((s) => s > 0.0165 && s < 0.0175)
        && r[3][1] < 0.145 && r[4][1] > 0.145 && cross > 0.029 && cross < 0.0293;
    },
    why: 'Uniform floor loss raises the band value at ≈ 0.0166–0.0171 per unit; crossing of 0.145 at a loss of ≈ 0.0292.',
  },
  {
    id: 'r2-floor-adaptive-prefix-rule',
    holds: () => {
      const a = F.outerLemma.failsWithNegCos.a;
      return prefixP(a) === 11 && Math.abs(Math.cos((a * Math.log(19)) / 2) - 0.046) < 0.002 && Math.cos((a * Math.log(13)) / 2) < 0.3
        && F.outerLemma.failsWithNegCos.S29 < F.outerLemma.failsWithNegCos.kron && F.outerLemma.failsWithNegCos.S47 < F.outerLemma.failsWithNegCos.S29
        && F.certified.minCosOverRanges > 0.3;
    },
    why: 'At cell 0 (a = 1.0355) the cos ≥ 0.3 prefix stops at P = 11 (p = 13 gives 0.240, p = 19 gives 0.046); prefixes containing cos < 0 primes give Φ(0) below the Kronecker ascent, so θ_S = 0 is not a maximiser there.',
  },
  {
    id: 'r2-floor-kronecker-gap',
    holds: () => {
      const g = F.gapLadderCell350;
      return F.kronGaps.length === 12 && Math.min(...F.kronGaps) === 0.0049 && Math.max(...F.kronGaps) === 0.0309
        && g.every(([, v], i) => i === 0 || v < g[i - 1][1]) && g.every(([, v]) => v > F.kronCell350)
        && Math.abs(g[g.length - 1][1] - F.kronCell350 - 0.0308) < 1e-9 && F.gapClosedShare[0] < F.gapClosedShare[1]
        && F.outerLemma.sampled.maxExcess < 0 && F.timeBox.allowanceUsed >= F.timeBox.directBallNsub2[1];
    },
    why: 'Certified cost stays above the Kronecker ascent (0.0049–0.0309); the cell-350 ladder decreases in P; sampled outer-lemma excess negative; time-box allowance covers the largest measured direct-ball excess.',
  },
  {
    id: 'r2-floor-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(F.verdict) && /NO QED/.test(F.verdict) && /only conditionally/.test(F.verdict)
      && /outer lemma unproved/.test(F.status) && /NO QED/.test(F.status),
    why: 'Sub-0.145 value conditional on an unproved outer lemma and unrefereed band inputs; no bound below 0.2 proved.',
  },
]);

export default R2_STRUCTURED_FLOOR;
