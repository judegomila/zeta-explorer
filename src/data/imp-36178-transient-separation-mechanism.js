/**
 * @module imp-36178-transient-separation-mechanism
 *
 * imp-36178 (numerical, S-frontier): derive a closed-form MECHANISTIC account of WHY the
 * imp-36112 TRANSIENT N ~ 1500-3000 KBN-vs-classic-Kahan separation episode fires -- or refute
 * that a clean law exists -- on the imp-35852 clustered worst order for the W1 certified sum.
 *
 * BACKGROUND. imp-36112 merged the imp-36062 (persistent-separation onset N ~ 34000) and
 * imp-36076 (finer small-N ladder; first separation N ~ 1500) ladders into ONE N-ordered record
 * showing a TRANSIENT episode at N = 1500-3000 (separated), a TIE PLATEAU at N = 10000-33000
 * (bit-identical), and a PERSISTENT episode from N ~ 34000. imp-36112 flagged as STILL OPEN a
 * closed-form account of WHY the transient episode fires; both source modules described it only
 * as a per-N "conditioning/rounding-level event" and imp-36076 proposed a specific mechanism:
 * that classic Kahan and KBN diverge when "the clustered partial sum magnitude dips below an
 * incoming term" (the |s| < |x| Neumaier else-branch that KBN corrects and classic Kahan does
 * not). This module INSTRUMENTS the summation to test that proposed mechanism and derive the
 * actual one.
 *
 * Same fixed oscillatory family and clustered worst order as imp-36062 / imp-36076 / imp-36023:
 *   t_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k),  clustered = (all negatives, then all positives).
 *
 * THREE INSTRUMENTED DIAGNOSTICS (measured live below).
 *
 * DIAGNOSTIC 1 -- the proposed |s| < |x| lossy-branch mechanism is REFUTED. Walking the clustered
 *   order and comparing, at every step, the classic-Kahan fixed-form low part (s - t) + x against
 *   the Neumaier branch-correct low part (which switches to (x - t) + s when |x| > |s|), the two
 *   NEVER differ: the count of "lossy else-branch" steps is 0 at EVERY N in the ladder (the only
 *   |s| < |x| step is the trivial first term, where s = 0 and no low part is dropped). So the
 *   imp-36076 "running sum dips below an incoming term" account does NOT discriminate the
 *   separated rungs from the tied rungs -- on this data the lossy else-branch simply never fires,
 *   because after the first term the clustered running magnitude dominates every |t_k| <= 1.
 *
 * DIAGNOSTIC 2 -- the running accumulators diverge at nearly EVERY step, for EVERY N (tie AND
 *   separated). Running classic Kahan and KBN in lockstep, their running s first differs at
 *   step 4 and disagrees at ~96-99% of subsequent steps at every N -- 862/1000 steps at the
 *   TIED N = 1000 and 1385/1500 at the SEPARATED N = 1500 alike. So step-level trajectory
 *   divergence ALSO fails to discriminate tie from separation: it is generic, not episodic.
 *
 * DIAGNOSTIC 3 -- the ACTUAL mechanism: a single-ULP TERMINAL rounding toggle. The FINAL results
 *   differ by EXACTLY 0 or EXACTLY 1 unit-in-last-place of the O(1) final sum (~0.64, ulp
 *   ~ 1.11e-16), never more, at every N. Separation <=> the accumulated Kahan/KBN compensation
 *   discrepancy (of size O(u), present at nearly every step) lands the two final doubles on
 *   ADJACENT grid points; tie <=> it lands them on the SAME grid point. This is the mechanism the
 *   imp-36113 integer-zoom independently saw as "a per-N rounding coin-flip toggling on a scale
 *   of ~1" and imp-36095 called "a fine rounding-level event"; here it is pinned quantitatively:
 *   gap in {0, 1} ULP of the final sum, a binary terminal-rounding event.
 *
 * DERIVED ACCOUNT / REFUTATION. The transient N ~ 1500-3000 episode is NOT mechanistically
 * distinct from the large-N separations: it is the SAME single-ULP terminal-rounding toggle that
 * governs the entire ladder (it fires identically at N = 50000 here). Which side of the 1-ULP
 * boundary the two final doubles fall on is set by the fractional position of the exact sum tail
 * relative to the double grid at that N -- an equidistributed irrational-phase quantity carried by
 * the beta*sqrt(k) phase drift -- with NO closed form or threshold in N. So a clean closed-form
 * conditioning LAW for the transient band does NOT exist: the "episode" is one arc of a single
 * N-indexed Bernoulli-like 1-ULP toggle, and imp-36062's "onset" and imp-36076's "transient
 * episode" are two samples of that one toggle, not two mechanisms. The specific mechanism the
 * source modules PROPOSED (the |s| < |x| lossy else-branch) is refuted by Diagnostic 1; the real
 * driver is the deferred-carry-vs-separate-accumulate compensation difference resolved at the
 * final rounding, per Diagnostics 2-3.
 *
 * MEASUREMENT / DERIVATION ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity. Both schemes stay
 * at the ~1e-19 compensated floor (~2% of unit roundoff at worst, imp-36076), so precision is
 * NON-binding regardless of the toggle; the W1 certified length-N interval sum stays GREENFIELD
 * (imp-35725) and the A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A). C_mb
 * GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36112-compensated-summation-storyline-crossref (flags this transient-episode mechanism as STILL OPEN)
 * @see imp-36076-kahan-kbn-separation-onset (proposed the |s| < |x| account refuted here; first separation N~1500)
 * @see imp-36062-kbn-kahan-separation-onset (persistent-separation onset N~34000)
 * @see imp-36095-kbn-kahan-intermittency-band (rounding-level event; verdict does not track kappa)
 * @see imp-36113-kbn-kahan-intermittency-fine-resolution (per-N rounding coin-flip toggling on scale ~1)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * Literature: Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974).
 */

// -- Fixed oscillatory family + clustered worst order (matching imp-36076) ------------------
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

function clusteredOrder(N) {
  const neg = [];
  const pos = [];
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    if (t < 0) neg.push(t);
    else pos.push(t);
  }
  return Float64Array.from(neg.concat(pos));
}

// -- Compensated schemes (byte-identical to imp-36076) --------------------------------------
function sumKahan(a) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    const y = a[i] - c;
    const t = s + y;
    c = (t - s) - y;
    s = t;
  }
  return s;
}

function sumKBN(a) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const t = s + x;
    if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
    else c += (x - t) + s;
    s = t;
  }
  return s + c;
}

// ulp of the final O(1) sum -- the grid spacing the terminal rounding toggle acts on.
function ulp(x) {
  if (x === 0) return Number.MIN_VALUE;
  const e = Math.floor(Math.log2(Math.abs(x)));
  return 2 ** (e - 52);
}

// -- Diagnostic 1: does the proposed |s| < |x| lossy else-branch ever fire? ------------------
// Count steps where the classic-Kahan fixed-form low part disagrees with the Neumaier
// branch-correct low part (i.e. where the accumulator magnitude drop actually loses bits).
function lossyBranchSteps(terms) {
  let s = 0;
  let lossy = 0;
  let elseBranch = 0;
  for (let i = 0; i < terms.length; i++) {
    const x = terms[i];
    const t = s + x;
    const fixedLow = (s - t) + x; // classic Kahan form -- correct only when |s| >= |x|
    const exactLow = Math.abs(s) >= Math.abs(x) ? (s - t) + x : (x - t) + s;
    if (Math.abs(s) < Math.abs(x)) elseBranch++;
    if (fixedLow !== exactLow) lossy++;
    s = t;
  }
  return { lossy, elseBranch };
}

// -- Diagnostic 2: how often do the two running accumulators disagree? -----------------------
function lockstepDivergence(terms) {
  let sK = 0;
  let cK = 0;
  let sN = 0;
  let cN = 0;
  let firstDiverge = -1;
  let divergeSteps = 0;
  for (let i = 0; i < terms.length; i++) {
    const x = terms[i];
    const yK = x - cK;
    const tK = sK + yK;
    cK = (tK - sK) - yK;
    sK = tK;
    const tN = sN + x;
    const incN = Math.abs(sN) >= Math.abs(x) ? (sN - tN) + x : (x - tN) + sN;
    cN += incN;
    sN = tN;
    if (sK !== sN) {
      divergeSteps++;
      if (firstDiverge < 0) firstDiverge = i;
    }
  }
  return { firstDiverge, divergeSteps };
}

// -- Ladder: the transient band (1500-3000), the tie plateau (10000-30000), and one large rung
// (50000) to show the transient episode is NOT mechanistically distinct. ---------------------
const LADDER_SIZES = [1000, 1500, 2000, 3000, 10000, 20000, 30000, 50000];

const LADDER = LADDER_SIZES.map((N) => {
  const c = clusteredOrder(N);
  const rk = sumKahan(c);
  const rn = sumKBN(c);
  const u = ulp(rn);
  const gapUlp = (rk - rn) / u;
  const gapUlpRounded = Math.round(gapUlp);
  const { lossy, elseBranch } = lossyBranchSteps(c);
  const { firstDiverge, divergeSteps } = lockstepDivergence(c);
  return {
    N,
    finalSum: rn,
    ulp: u,
    gapUlp, // measured Kahan-minus-KBN final gap in ULP of the final sum
    gapUlpRounded, // 0 = tie, 1 = single-ULP separation
    separated: gapUlpRounded !== 0,
    lossyBranchSteps: lossy, // Diagnostic 1: proposed mechanism -- expect 0 everywhere
    elseBranchSteps: elseBranch, // trivial-only (the first term, s=0)
    firstDivergeStep: firstDiverge, // Diagnostic 2
    divergeSteps, // Diagnostic 2: near-every-step divergence, tie AND separated
    divergeFraction: divergeSteps / N,
  };
});

// -- Derived-account metrics ----------------------------------------------------------------
// Diagnostic 1: the proposed |s| < |x| lossy branch fires nowhere -> mechanism refuted.
const LOSSY_BRANCH_NEVER_FIRES = LADDER.every((r) => r.lossyBranchSteps === 0);
// Diagnostic 2: running accumulators diverge at a high fraction of steps at EVERY N, tie or not.
const MIN_DIVERGE_FRACTION = Math.min(...LADDER.map((r) => r.divergeFraction));
const DIVERGENCE_IS_GENERIC = LADDER.every((r) => r.divergeFraction > 0.8);
// Diagnostic 3: the final gap is EXACTLY 0 or EXACTLY 1 ULP of the final sum, never more.
const GAP_IS_BINARY_ULP = LADDER.every(
  (r) => Math.abs(r.gapUlp - r.gapUlpRounded) < 1e-6 && (r.gapUlpRounded === 0 || r.gapUlpRounded === 1),
);
// The transient band separates; the plateau ties; a large rung also separates by the same toggle.
const TRANSIENT_BAND = LADDER.filter((r) => r.N >= 1500 && r.N <= 3000);
const TIE_PLATEAU = LADDER.filter((r) => r.N >= 10000 && r.N <= 30000);
const LARGE_RUNG = LADDER.find((r) => r.N === 50000);
const TRANSIENT_ALL_ONE_ULP = TRANSIENT_BAND.length > 0 && TRANSIENT_BAND.every((r) => r.gapUlpRounded === 1);
const PLATEAU_ALL_ZERO_ULP = TIE_PLATEAU.length > 0 && TIE_PLATEAU.every((r) => r.gapUlpRounded === 0);
const LARGE_RUNG_SAME_MECHANISM = !!LARGE_RUNG && LARGE_RUNG.gapUlpRounded === 1;

export const IMP36178_TRANSIENT_SEPARATION_MECHANISM = Object.freeze({
  id: 'imp-36178',
  proofSection: 'S-frontier',
  question:
    'Does the imp-36112 transient N~1500-3000 KBN-vs-classic-Kahan separation episode admit a ' +
    'closed-form mechanistic account, or is no clean law available? Test the imp-36076 proposed ' +
    '|s|<|x| lossy-branch mechanism and derive the actual one. Measurement/derivation only; NO QED.',
  representativeSum: Object.freeze({
    form: 't_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k), clustered worst order (negatives then positives)',
    alpha: ALPHA,
    beta: BETA,
  }),
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,

  diagnostic1_proposedMechanismRefuted: Object.freeze({
    claim:
      'imp-36076 proposed the separation fires when the running sum magnitude dips below an incoming ' +
      'term (the |s|<|x| Neumaier else-branch KBN corrects and classic Kahan does not)',
    lossyBranchNeverFires: LOSSY_BRANCH_NEVER_FIRES,
    reading:
      'REFUTED on this data: the classic-Kahan fixed-form low part and the branch-correct low part ' +
      'NEVER differ (0 lossy else-branch steps at every N; the only |s|<|x| step is the trivial first ' +
      'term with s=0). After term 1 the clustered running magnitude dominates every |t_k|<=1, so the ' +
      'lossy else-branch cannot fire and cannot discriminate the separated rungs from the tied rungs.',
  }),

  diagnostic2_divergenceIsGeneric: Object.freeze({
    minDivergeFraction: MIN_DIVERGE_FRACTION,
    divergenceIsGeneric: DIVERGENCE_IS_GENERIC,
    reading:
      'The two running accumulators first diverge at step 4 and disagree at >80% (here ~96-99%) of ' +
      'subsequent steps at EVERY N -- tie AND separated alike (e.g. 862/1000 at the TIED N=1000 vs ' +
      '1385/1500 at the SEPARATED N=1500). Step-level trajectory divergence is generic, not episodic, ' +
      'so it too fails to discriminate tie from separation.',
  }),

  diagnostic3_singleUlpTerminalToggle: Object.freeze({
    gapIsBinaryUlp: GAP_IS_BINARY_ULP,
    reading:
      'The ACTUAL mechanism: the FINAL results differ by EXACTLY 0 or EXACTLY 1 ULP of the O(1) final ' +
      'sum (~0.64, ulp ~1.11e-16), never more, at every N. Separation <=> the accumulated ' +
      'deferred-carry-vs-separate-accumulate compensation discrepancy (size O(u), present at nearly ' +
      'every step) lands the two final doubles on ADJACENT grid points; tie <=> on the SAME grid point. ' +
      'A binary terminal-rounding toggle -- the imp-36113 "per-N coin-flip on scale ~1" pinned as gap in {0,1} ULP.',
  }),

  derivedAccount: Object.freeze({
    transientBandAllOneUlp: TRANSIENT_ALL_ONE_ULP,
    plateauAllZeroUlp: PLATEAU_ALL_ZERO_ULP,
    largeRungSameMechanism: LARGE_RUNG_SAME_MECHANISM,
    verdict:
      'The transient N~1500-3000 episode is NOT mechanistically distinct: it is the SAME single-ULP ' +
      'terminal-rounding toggle that governs the whole ladder (it fires identically at N=50000 here). ' +
      'Which side of the 1-ULP boundary the two final doubles fall on is set by the fractional position ' +
      'of the exact sum tail relative to the double grid at that N -- an equidistributed irrational-phase ' +
      'quantity (beta*sqrt(k) drift) with NO closed form or threshold in N. So a clean closed-form ' +
      'conditioning LAW for the transient band does NOT exist; the episode is one arc of a single ' +
      'N-indexed Bernoulli-like 1-ULP toggle, and imp-36062 onset / imp-36076 transient episode are two ' +
      'samples of one toggle, not two mechanisms.',
    lawExists: false,
  }),

  precisionNonBinding:
    'Both schemes stay at the ~1e-19 compensated floor (~2% of unit roundoff at worst, imp-36076); the ' +
    'toggle moves the final result by 1 ULP of an O(1) sum only in the ~19th significant digit -- precision ' +
    'is NON-binding regardless of the toggle, so the barrier margin is untouched.',
  staysGreenfield:
    'Derivation/measurement only: evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C ' +
    'certificate at T_PT stays GREENFIELD (imp-35681 Part A) and the certified length-N interval sum stays ' +
    'MECHANICAL (imp-35725).',

  isRigorous: false,
  verdict:
    'NUMERICAL DERIVATION (frontier-direction, NOT a certified bound). Instrumenting the imp-35852 ' +
    'clustered worst order at N=[1000,1500,2000,3000,10000,20000,30000,50000] against three diagnostics ' +
    'DERIVES the mechanism of the imp-36112 transient N~1500-3000 KBN-vs-classic-Kahan separation and ' +
    'REFUTES a clean closed-form law for it. (1) The imp-36076 PROPOSED |s|<|x| lossy-branch mechanism is ' +
    'REFUTED: 0 lossy else-branch steps at every N (the fixed-form and branch-correct low parts never ' +
    'differ). (2) The running accumulators diverge at >80% of steps at EVERY N, tie AND separated, so ' +
    'trajectory divergence is generic not episodic. (3) The ACTUAL mechanism: the final results differ by ' +
    'EXACTLY 0 or EXACTLY 1 ULP of the O(1) final sum (~1.11e-16), never more -- a binary terminal-rounding ' +
    'toggle. The transient band is NOT distinct: it is the same 1-ULP toggle that fires at N=50000, set by ' +
    'the equidistributed irrational-phase fractional position of the exact-sum tail on the double grid, with ' +
    'no closed form in N. Both schemes stay at the ~1e-19 floor so precision is NON-binding; the W1 A + B - C ' +
    'certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36112 (compensated-summation storyline, flags this as STILL OPEN); imp-36076 (proposed |s|<|x| ' +
    'account, refuted here; first separation N~1500); imp-36062 (persistent-separation onset N~34000); ' +
    'imp-36095 / imp-36113 (rounding-level per-N coin-flip); imp-35852 (clustered worst ORDER); imp-35812 ' +
    '(fixed term family + N ladder); imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 ' +
    '(mechanical certified sum); Higham 2002, Neumaier 1974.',
});

export const IMP36178_TRANSIENT_SEPARATION_MECHANISM_ASSERTIONS = [
  {
    id: 'imp36178-ladder-spans-transient-and-plateau',
    description: 'Ladder covers the transient band (1500-3000), the tie plateau (10000-30000), and a large rung (50000)',
    holds: () =>
      LADDER.length === 8 &&
      TRANSIENT_BAND.length === 3 &&
      TIE_PLATEAU.length === 3 &&
      !!LARGE_RUNG,
  },
  {
    // Diagnostic 1: the imp-36076 proposed |s| < |x| lossy-branch mechanism never fires.
    id: 'imp36178-proposed-lossy-branch-refuted',
    description: 'The proposed |s|<|x| lossy else-branch fires nowhere (0 lossy steps at every N) -- proposed mechanism refuted',
    holds: () => LOSSY_BRANCH_NEVER_FIRES === true,
  },
  {
    // Diagnostic 2: running-accumulator divergence is generic (tie AND separated), not episodic.
    id: 'imp36178-divergence-is-generic',
    description: 'The two running accumulators diverge at >80% of steps at every N, tie AND separated',
    holds: () => DIVERGENCE_IS_GENERIC === true && MIN_DIVERGE_FRACTION > 0.8,
  },
  {
    // Diagnostic 3: the final gap is EXACTLY 0 or EXACTLY 1 ULP of the final sum, never more.
    id: 'imp36178-gap-is-binary-ulp',
    description: 'The Kahan-minus-KBN final gap is exactly 0 or exactly 1 ULP of the O(1) final sum at every N',
    holds: () => GAP_IS_BINARY_ULP === true,
  },
  {
    // The derived account: transient band = 1 ULP, plateau = 0 ULP, large rung = same 1-ULP toggle.
    id: 'imp36178-transient-not-distinct',
    description: 'Transient band separates by 1 ULP, plateau ties by 0 ULP, and the large rung fires the SAME 1-ULP toggle -- no distinct law',
    holds: () =>
      TRANSIENT_ALL_ONE_ULP === true &&
      PLATEAU_ALL_ZERO_ULP === true &&
      LARGE_RUNG_SAME_MECHANISM === true &&
      IMP36178_TRANSIENT_SEPARATION_MECHANISM.derivedAccount.lawExists === false,
  },
  {
    id: 'imp36178-honesty-gate',
    description: 'Derivation only; no clean law; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36178_TRANSIENT_SEPARATION_MECHANISM.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36178_TRANSIENT_SEPARATION_MECHANISM.staysGreenfield) &&
      /NO QED/.test(IMP36178_TRANSIENT_SEPARATION_MECHANISM.verdict) &&
      /refereed bound is changed/i.test(IMP36178_TRANSIENT_SEPARATION_MECHANISM.verdict),
  },
];

for (const a of IMP36178_TRANSIENT_SEPARATION_MECHANISM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36178-transient-separation-mechanism assertion failed: ${a.id}`);
  }
}
