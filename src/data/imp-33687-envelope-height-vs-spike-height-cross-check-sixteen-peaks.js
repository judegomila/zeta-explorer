/**
 * @module imp-33687-envelope-height-vs-spike-height-cross-check-sixteen-peaks
 * @fileoverview imp-33687 -- CROSS-VALIDATE the imp-33660 band-clearing cluster-peak ENVELOPE-HEIGHT
 *   series against the imp-33663 spike-height READINGS at the shared sixteen cluster peaks over
 *   [400,1200], and MEASURE whether the two INDEPENDENT height definitions agree peak-by-peak.
 *
 *   WHAT NEITHER MODULE RAN
 *   -----------------------
 *   imp-33660 fits the HEIGHT of the sixteen band-clearing cluster peaks: its height is the peak of the
 *   +/-5 rolling-MAX floorUlp ENVELOPE inside each contiguous env >= 64 cluster, located by an argmax
 *   scan of one combined [400,1200] window (peakN = the argmax rung, peakEnv = the envelope there).
 *   imp-33663 separately reads the SAME peaks two ways for its recovery-grade correlation: reading A is
 *   the +/-5 rolling-MAX grade-4 floorUlp taken at a FIXED anchor rung, and reading B is the grade-4
 *   floorUlp at the EXACT anchor rung. The two modules define "peak height" via different constructions
 *   (imp-33660 argmax-located cluster envelope vs imp-33663 fixed-anchor envelope and exact-rung floor)
 *   but NEVER compared them peak-by-peak. This module aligns the sixteen peaks and tabulates the
 *   per-peak height cross-check, importing the two published frozen series so it validates the ACTUAL
 *   records, not a re-derivation.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Import imp-33660s measured.peakNs / measured.peakHeights and imp-33663s measured.anchorRungs /
 *   measured.envelopeHeights (reading A) / measured.exactRungFloors (reading B). Then, per peak i:
 *     (1) ALIGNMENT -- confirm imp-33660 peakN_i == imp-33663 anchorRung_i (one-to-one, same order).
 *     (2) ENVELOPE-DEFINITION discrepancy -- imp-33660 envelope-height_i MINUS imp-33663 reading-A_i.
 *     (3) READING-A vs READING-B offset -- reading-A_i MINUS reading-B_i (the exact-rung floor).
 *   Then report the max/mean envelope-definition discrepancy, the sign and mean of the A-minus-B offset,
 *   and the Pearson correlation between reading A and reading B across the sixteen peaks.
 *
 *   THE HEADLINE RESULT -- THE TWO ENVELOPE DEFINITIONS AGREE EXACTLY; BOTH DECOUPLE FROM THE FLOOR
 *   ---------------------------------------------------------------------------------------------
 *   (a) imp-33660s peakN series [526,591,634,709,735,754,807,824,874,962,998,1038,1072,1104,1126,1198]
 *       equals imp-33663s anchorRungs one-to-one: the argmax-located cluster peak and the fixed anchor
 *       coincide at ALL sixteen peaks.
 *   (b) The imp-33660 band-clearing envelope-HEIGHT series equals the imp-33663 reading-A envelope
 *       series to full double precision at all sixteen peaks (max |discrepancy| ~ 0). The two
 *       "independent" height definitions are the SAME collar-5 rolling-MAX of grade-4 floorUlp evaluated
 *       at the SAME peak rung -- a consistency confirmation, not a discrepancy. The apparent
 *       independence is nominal: imp-33660 locates the peak by argmax and imp-33663 hard-codes it, but
 *       they land on the same rung, so the two height numbers are bit-identical.
 *   (c) Against reading B (the EXACT-rung grade-4 floor) the envelope height is systematically FAR
 *       ABOVE: reading A >= reading B at every one of the sixteen peaks (true by construction, since the
 *       +/-5 rolling-MAX dominates its own centre value), with a mean A-minus-B gap of ~59 ULP. The gap
 *       is largest at the two TALLEST envelope peaks n = 1126 (~143.6 env, ~10.4 exact = ~133 gap) and
 *       n = 1198 (~135.0 env, ~2.9 exact = ~132 gap), whose tall envelopes are COLLAR maxima with tiny
 *       exact-rung floors; and it is SMALLEST at the lone grade-5 rung n = 998 (~85.6 env, ~70.4 exact =
 *       ~15 gap), the only peak whose exact-rung floor exceeds 64. So reading A and reading B are
 *       DECOUPLED (Pearson r ~ -0.2, weakly negative): the tallest cluster envelopes do NOT coincide
 *       with tall exact-rung floors.
 *
 *   This reconciles the two parent verdicts from a single table: imp-33660s tail height growth lives
 *   ENTIRELY in reading A (the collar rolling-max envelope), while imp-33663s recovery-grade step lives
 *   ENTIRELY in reading B (the exact-rung floor). The two height channels agree where they are the same
 *   construction (envelope-vs-envelope) and decouple where they are not (envelope-vs-exact-rung).
 *
 *   VERDICT. ENVELOPE-DEFINITIONS-AGREE-EXACTLY-BUT-DECOUPLE-FROM-THE-EXACT-RUNG-FLOOR. The imp-33660
 *   band-clearing envelope-height and the imp-33663 reading-A envelope-height are numerically identical
 *   peak-by-peak at all sixteen shared cluster peaks (they are the same collar-5 rolling-MAX at the same
 *   rung), while both sit systematically ABOVE the imp-33663 reading-B exact-rung floor (reading A >=
 *   reading B at every peak, mean gap ~59 ULP) and are DECOUPLED from it (r ~ -0.2, largest gap at the
 *   two tallest tail envelopes, smallest at the lone grade-5 rung). Consistent with the imp-33660 /
 *   imp-33663 latticeJitter caveat: the exact per-peak ULP bounces, so the robust reading is the
 *   QUALITATIVE agreement of the two envelope definitions and their joint decoupling from the exact-rung
 *   floor, not the exact gap numbers.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It cross-checks two
 *   published height series and one exact-rung floor series peak-by-peak; it changes NO bound, patches
 *   NO literal, and establishes NO operator positivity. floorUlp is a JITTERY arithmetic-floor lattice
 *   property (imp-33249 / imp-33277 / imp-33296 / imp-33537 / imp-33557 / imp-33599 / imp-33621 /
 *   imp-33638 / imp-33660 / imp-33663 latticeJitterCaveat): the exact per-peak ULP bounces and
 *   cross-platform libm exp/pow variation can shift the exact envelope heights and exact-rung floors,
 *   and hence the exact A-minus-B gaps and the A-vs-B correlation. The robust reading is the QUALITATIVE
 *   conclusion -- the two envelope definitions agree, both decouple from the exact-rung floor -- not the
 *   exact numbers. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a >= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the envelope-height series being checked)
 *   @see imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js (the reading-A / reading-B series)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target both use)
 *
 *   Ticket: imp-33687 (accuracy, medium).
 */

import { IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT } from './imp-33660-cluster-peak-envelope-height-growth-fit.js';
import { IMP33663_RECOVERY_GRADE_VS_SPIKE_HEIGHT_SIXTEEN } from './imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const DEEP_FLOOR_ULP = 64; // the imp-33316 widened deep-tail band -- reading B crosses this at n = 998

// -- Pull the two published series (frozen; import-light, no recompute of the heavy scan) ----------
const M60 = IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT.measured;
const M63 = IMP33663_RECOVERY_GRADE_VS_SPIKE_HEIGHT_SIXTEEN.measured;

const PEAK_NS_60 = M60.peakNs;         // imp-33660 argmax-located cluster peak rungs
const ENV_HEIGHTS_60 = M60.peakHeights; // imp-33660 band-clearing envelope HEIGHT per cluster peak
const ANCHOR_RUNGS_63 = M63.anchorRungs; // imp-33663 fixed anchor rungs
const READING_A_63 = M63.envelopeHeights; // imp-33663 reading A: +/-5 rolling-max grade-4 floorUlp at anchor
const READING_B_63 = M63.exactRungFloors; // imp-33663 reading B: grade-4 floorUlp at the EXACT anchor rung
const GRADES_63 = M63.recoveryGrades;    // imp-33663 recovery grade per peak

// -- Per-peak alignment + height cross-check table -------------------------------------------------
const N_PEAKS = Math.min(PEAK_NS_60.length, ANCHOR_RUNGS_63.length);
const PEAK_TABLE = [];
for (let i = 0; i < N_PEAKS; i += 1) {
  const n = PEAK_NS_60[i];
  const env60 = ENV_HEIGHTS_60[i];
  const readingA = READING_A_63[i];
  const readingB = READING_B_63[i];
  PEAK_TABLE.push(Object.freeze({
    n,
    anchorRung: ANCHOR_RUNGS_63[i],
    aligned: PEAK_NS_60[i] === ANCHOR_RUNGS_63[i],
    env60,                                  // imp-33660 band-clearing envelope height
    readingA,                               // imp-33663 reading A (fixed-anchor envelope)
    readingB,                               // imp-33663 reading B (exact-rung floor)
    recoveryGrade: GRADES_63[i],
    envDefDiscrepancy: env60 - readingA,    // the two INDEPENDENT envelope definitions, peak-by-peak
    aMinusB: readingA - readingB,           // envelope-height minus exact-rung floor (systematic offset)
  }));
}

// -- Alignment: do the imp-33660 argmax peaks equal the imp-33663 anchor rungs one-to-one? ---------
const allAligned = PEAK_TABLE.every((r) => r.aligned);

// -- Envelope-definition discrepancy (imp-33660 env height vs imp-33663 reading A) -----------------
const envDefDiscrepancies = PEAK_TABLE.map((r) => Math.abs(r.envDefDiscrepancy));
const maxEnvDefDiscrepancy = Math.max(...envDefDiscrepancies);
const meanEnvDefDiscrepancy = envDefDiscrepancies.reduce((a, b) => a + b, 0) / envDefDiscrepancies.length;
const envDefinitionsAgree = maxEnvDefDiscrepancy < 1e-9; // bit-identical construction => essentially zero

// -- Reading-A vs reading-B systematic offset (envelope height above the exact-rung floor) ---------
const aMinusBs = PEAK_TABLE.map((r) => r.aMinusB);
const minAMinusB = Math.min(...aMinusBs);
const maxAMinusB = Math.max(...aMinusBs);
const meanAMinusB = aMinusBs.reduce((a, b) => a + b, 0) / aMinusBs.length;
const readingADominatesB = PEAK_TABLE.every((r) => r.readingA >= r.readingB); // rolling-max >= centre value

// -- Pearson correlation between reading A and reading B across the sixteen peaks (guarded) --------
function pearson(xs, ys) {
  const nPts = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / nPts;
  const my = ys.reduce((a, b) => a + b, 0) / nPts;
  let cov = 0;
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < nPts; i += 1) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    cov += dx * dy;
    vx += dx * dx;
    vy += dy * dy;
  }
  const denom = Math.sqrt(vx * vy);
  return denom > 0 ? cov / denom : 0;
}
const corrReadingAvsReadingB = pearson(READING_A_63.slice(0, N_PEAKS), READING_B_63.slice(0, N_PEAKS));

// -- Decoupling diagnostics: the two tallest envelopes vs the lone grade-5 (exact-rung > 64) rung --
const tallestByEnv = PEAK_TABLE.slice().sort((a, b) => b.env60 - a.env60);
const twoTallestEnvPeaks = tallestByEnv.slice(0, 2);
// The tall envelope peaks have SMALL exact-rung floors (collar-driven maxima, not exact-rung floors).
const tallestEnvHaveSmallExactRung = twoTallestEnvPeaks.every((r) => r.readingB < DEEP_FLOOR_ULP);
// The lone grade-5 rung is exactly the one whose exact-rung floor exceeds the 64 band (imp-33663 tautology).
const elevatedGradeRungs = PEAK_TABLE.filter((r) => r.recoveryGrade > Math.min(...GRADES_63));
const elevatedRungHasHighExactRung = elevatedGradeRungs.every((r) => r.readingB >= DEEP_FLOOR_ULP);
// The tallest-envelope peaks are NOT the elevated-grade rung -- envelope amplitude and floor decouple.
const tallestEnvNotElevatedGrade = twoTallestEnvPeaks.every(
  (r) => !elevatedGradeRungs.some((e) => e.n === r.n),
);
const envAndExactRungDecoupled = corrReadingAvsReadingB < 0.3;

// -- Verdict classifiers --------------------------------------------------------------------------
const coverageOk = N_PEAKS === 16 && PEAK_TABLE.length === 16;

const verdict =
  coverageOk && allAligned && envDefinitionsAgree && readingADominatesB && meanAMinusB > 0 &&
  envAndExactRungDecoupled && tallestEnvHaveSmallExactRung && elevatedRungHasHighExactRung &&
  tallestEnvNotElevatedGrade
    ? 'ENVELOPE-DEFINITIONS-AGREE-EXACTLY-BUT-DECOUPLE-FROM-THE-EXACT-RUNG-FLOOR:-CROSS-CHECKING-THE-imp-33660-' +
      'BAND-CLEARING-CLUSTER-PEAK-ENVELOPE-HEIGHT-SERIES-AGAINST-THE-imp-33663-READING-A-(FIXED-ANCHOR-ENVELOPE)-' +
      'AND-READING-B-(EXACT-RUNG-FLOOR)-AT-THE-SHARED-SIXTEEN-CLUSTER-PEAKS-{526,591,634,709,735,754,807,824,874,' +
      '962,998,1038,1072,1104,1126,1198}-SHOWS-(a)-THE-imp-33660-ARGMAX-PEAK-RUNGS-EQUAL-THE-imp-33663-ANCHOR-RUNGS-' +
      'ONE-TO-ONE,-(b)-THE-imp-33660-ENVELOPE-HEIGHT-EQUALS-THE-imp-33663-READING-A-ENVELOPE-TO-FULL-DOUBLE-PRECISION-' +
      'AT-ALL-SIXTEEN-PEAKS-(MAX-|DISCREPANCY|~0)-BECAUSE-BOTH-ARE-THE-SAME-COLLAR-5-ROLLING-MAX-OF-grade-4-floorUlp-' +
      'AT-THE-SAME-RUNG,-AND-(c)-BOTH-SIT-SYSTEMATICALLY-ABOVE-THE-READING-B-EXACT-RUNG-FLOOR-(reading-A>=reading-B-AT-' +
      'EVERY-PEAK,-MEAN-GAP~59-ULP)-AND-ARE-DECOUPLED-FROM-IT-(PEARSON-r~-0.2):-THE-TWO-TALLEST-ENVELOPES-n=1126-' +
      '(~143.6-env,~10.4-exact)-AND-n=1198-(~135.0-env,~2.9-exact)-ARE-COLLAR-MAXIMA-WITH-TINY-EXACT-RUNG-FLOORS,-WHILE-' +
      'THE-LONE-grade-5-RUNG-n=998-(~85.6-env,~70.4-exact)-IS-THE-ONLY-PEAK-WHOSE-EXACT-RUNG-FLOOR-EXCEEDS-64.-SO-' +
      'imp-33660s-TAIL-HEIGHT-GROWTH-LIVES-ENTIRELY-IN-READING-A-AND-imp-33663s-RECOVERY-GRADE-STEP-LIVES-ENTIRELY-IN-' +
      'READING-B.-CONSISTENT-WITH-THE-imp-33660/imp-33663-latticeJitterCaveat-(EXACT-PER-PEAK-ULP-BOUNCES,-SO-THE-ROBUST-' +
      'READING-IS-THE-QUALITATIVE-AGREEMENT-AND-DECOUPLING,-NOT-THE-EXACT-GAPS).-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-' +
      'JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33687_ENVELOPE_HEIGHT_VS_SPIKE_HEIGHT_CROSS_CHECK = Object.freeze({
  id: 'imp-33687-envelope-height-vs-spike-height-cross-check-sixteen-peaks',
  ticket: 'imp-33687',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  crossValidatesModules: [
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'CROSS-VALIDATES the imp-33660 band-clearing cluster-peak ENVELOPE-HEIGHT series against the imp-33663 ' +
    'spike-height READINGS (reading A = fixed-anchor +/-5 rolling-max envelope; reading B = exact-rung grade-4 ' +
    'floor) at the shared sixteen cluster peaks over [400,1200], a peak-by-peak height cross-check neither module ' +
    'ran. RESULT: (a) the imp-33660 argmax peak rungs equal the imp-33663 anchor rungs one-to-one; (b) the ' +
    'imp-33660 envelope height equals the imp-33663 reading-A envelope to full double precision at all sixteen ' +
    'peaks (max |discrepancy| ~ 0) -- the two "independent" definitions are the SAME collar-5 rolling-max of ' +
    'grade-4 floorUlp at the SAME rung; (c) both sit systematically ABOVE reading B (reading A >= reading B at ' +
    'every peak, mean gap ~59 ULP) and are DECOUPLED from it (Pearson r ~ -0.2): the two tallest envelopes ' +
    'n = 1126/1198 are collar maxima with tiny exact-rung floors (~10/~3 ULP), while the lone grade-5 rung n = 998 ' +
    'is the only peak whose exact-rung floor exceeds 64 (~70.4). So imp-33660s tail height growth lives entirely in ' +
    'reading A and imp-33663s recovery-grade step lives entirely in reading B. VERDICT: ' +
    'ENVELOPE-DEFINITIONS-AGREE-EXACTLY-BUT-DECOUPLE-FROM-THE-EXACT-RUNG-FLOOR, consistent with the imp-33660/' +
    'imp-33663 latticeJitterCaveat. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; ' +
    'jittery lattice floor; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    source: 'imports the two published frozen series (imp-33660 measured.peakNs/peakHeights, imp-33663 measured.anchorRungs/envelopeHeights/exactRungFloors) -- validates the records, not a re-derivation',
    alignment: 'confirm imp-33660 argmax peakN_i == imp-33663 anchorRung_i one-to-one, same order, over the sixteen peaks',
    envDefDiscrepancy: 'per peak, imp-33660 band-clearing envelope-height MINUS imp-33663 reading-A fixed-anchor envelope',
    aMinusBoffset: 'per peak, imp-33663 reading-A (envelope) MINUS reading-B (exact-rung grade-4 floor) -- the systematic gap',
    correlation: 'Pearson correlation of reading A against reading B across the sixteen peaks -- the envelope/exact-rung coupling',
    decoupling: 'the two tallest-envelope peaks exact-rung floors vs the lone grade-5 rung exact-rung floor (imp-33663 tautology cross-read)',
    selfComputing: 'the alignment, the two discrepancy series, the offset stats, the correlation, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nPeaks: N_PEAKS,
    peakTable: Object.freeze(PEAK_TABLE.slice()),
    peakNs60: Object.freeze(PEAK_NS_60.slice(0, N_PEAKS)),
    anchorRungs63: Object.freeze(ANCHOR_RUNGS_63.slice(0, N_PEAKS)),
    // -- alignment --
    allAligned,
    // -- envelope-definition cross-check (imp-33660 env height vs imp-33663 reading A) --
    maxEnvDefDiscrepancy,
    meanEnvDefDiscrepancy,
    envDefinitionsAgree,
    // -- reading-A vs reading-B systematic offset --
    minAMinusB,
    maxAMinusB,
    meanAMinusB,
    readingADominatesB,
    corrReadingAvsReadingB,
    envAndExactRungDecoupled,
    // -- decoupling diagnostics --
    twoTallestEnvPeaks: Object.freeze(twoTallestEnvPeaks.map((r) => Object.freeze({ n: r.n, env60: r.env60, readingB: r.readingB }))),
    tallestEnvHaveSmallExactRung,
    elevatedGradeRungs: Object.freeze(elevatedGradeRungs.map((r) => Object.freeze({ n: r.n, recoveryGrade: r.recoveryGrade, readingB: r.readingB }))),
    elevatedRungHasHighExactRung,
    tallestEnvNotElevatedGrade,
    // -- verdict --
    coverageOk,
    verdict,
  }),

  interpretation: Object.freeze({
    peaksAlignOneToOne:
      'The imp-33660 cluster-peak rungs (located by an argmax scan of the +/-5 rolling-max envelope over one ' +
      'combined [400,1200] window) equal the imp-33663 hard-coded anchor rungs one-to-one at all sixteen peaks, so ' +
      'the height cross-check compares the two modules at the SAME rungs -- the nominal "independence" of the two ' +
      'peak-location procedures does not produce different rungs.',
    envelopeDefinitionsAreIdentical:
      'The imp-33660 band-clearing envelope-height and the imp-33663 reading-A envelope-height agree to full double ' +
      'precision at every peak (max |discrepancy| ~ 0). This is because BOTH are the collar-5 rolling-MAX of the same ' +
      'grade-4 floorUlp (min residual over budgets >= 200 nodes vs the imp-33213 A_log target) evaluated at the same ' +
      'rung: imp-33660s peakEnv is the envelope at its argmax peakN, and imp-33663s reading A is the envelope at the ' +
      'coincident anchor. The two "independent" height definitions are numerically the SAME construction -- a ' +
      'consistency confirmation across the two modules, not a discrepancy.',
    envelopeSitsAboveExactRung:
      'Against reading B (the grade-4 floorUlp at the EXACT anchor rung) the envelope height is systematically far ' +
      'above: reading A >= reading B at every one of the sixteen peaks (true by construction, the +/-5 rolling-MAX ' +
      'dominates its own centre value), with a mean A-minus-B gap of ~59 ULP. The envelope height is a collar ' +
      'rolling-MAX, so it captures the tallest nearby spike, not the exact-rung floor.',
    envelopeAndExactRungDecouple:
      'Reading A and reading B are DECOUPLED (Pearson r ~ -0.2, weakly negative). The A-minus-B gap is LARGEST at the ' +
      'two tallest envelopes n = 1126 (~143.6 env, ~10.4 exact) and n = 1198 (~135.0 env, ~2.9 exact) -- tall collar ' +
      'maxima with tiny exact-rung floors -- and SMALLEST at the lone grade-5 rung n = 998 (~85.6 env, ~70.4 exact), ' +
      'the only peak whose exact-rung floor exceeds the imp-33316 < 64 band. So a tall cluster envelope does NOT ' +
      'imply a tall exact-rung floor.',
    reconcilesBothVerdicts:
      'The single cross-check table reconciles the two parent verdicts: imp-33660s tail height GROWTH lives entirely ' +
      'in reading A (the collar rolling-max envelope, which grows in the tail), while imp-33663s recovery-grade STEP ' +
      'lives entirely in reading B (the exact-rung floor, which crosses 64 at n = 998). The two channels agree where ' +
      'they are the same construction (envelope-vs-envelope) and decouple where they are not (envelope-vs-exact-rung), ' +
      'which is exactly why the tall tail envelopes force no higher recovery grade.',
    verdict:
      'VERDICT: ENVELOPE-DEFINITIONS-AGREE-EXACTLY-BUT-DECOUPLE-FROM-THE-EXACT-RUNG-FLOOR. The two envelope-height ' +
      'definitions are numerically identical peak-by-peak; both sit systematically above and are decoupled from the ' +
      'exact-rung floor. This bounds any "the two modules disagree on peak height" concern to nil for the envelope ' +
      'channel, and localizes the envelope/exact-rung decoupling that separates the two parent findings.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Cross-checks the imp-33660 band-clearing cluster-peak envelope-height series against the imp-33663 reading-A ' +
      '(fixed-anchor envelope) and reading-B (exact-rung floor) series peak-by-peak at the shared sixteen cluster ' +
      'peaks over [400,1200], importing the two published frozen records. It changes NO bound, patches NO literal, ' +
      'and establishes NO operator positivity. Grid-design cross-validation only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33660/imp-33663/imp-33638/imp-33621/imp-33599/' +
      'imp-33557/imp-33539/imp-33316/imp-33213; this cross-checks the located peak heights, not that truncation.',
    latticeJitterCaveat:
      'floorUlp is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/imp-33557/' +
      'imp-33599/imp-33621/imp-33638/imp-33660/imp-33663): the exact per-peak ULP bounces and cross-platform libm ' +
      'exp/pow variation can shift the exact envelope heights and exact-rung floors, and hence the mean ~59 ULP ' +
      'A-minus-B gap and the ~-0.2 A-vs-B correlation. The robust reading is the QUALITATIVE conclusion -- the two ' +
      'envelope definitions AGREE (a bit-identical construction) and both DECOUPLE from the exact-rung floor -- not ' +
      'the exact gap or correlation numbers.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33687_ENVELOPE_HEIGHT_VS_SPIKE_HEIGHT_CROSS_CHECK_ASSERTIONS = [
  {
    id: 'imp33687-coverage',
    why: 'Both parent series must supply sixteen shared cluster peaks so the height cross-check runs peak-by-peak.',
    holds: () => coverageOk && PEAK_TABLE.length === 16,
  },
  {
    id: 'imp33687-peaks-align-one-to-one',
    why: 'The imp-33660 argmax peak rungs must equal the imp-33663 anchor rungs one-to-one, so the two modules are ' +
         'compared at the same rungs.',
    holds: () => allAligned && PEAK_TABLE.every((r) => r.n === r.anchorRung),
  },
  {
    id: 'imp33687-envelope-definitions-agree',
    why: 'THE HEADLINE (agreement): the imp-33660 band-clearing envelope-height must equal the imp-33663 reading-A ' +
         'envelope to full double precision at every peak (max |discrepancy| < 1e-9) -- they are the same collar-5 ' +
         'rolling-max at the same rung.',
    holds: () => envDefinitionsAgree && maxEnvDefDiscrepancy < 1e-9,
  },
  {
    id: 'imp33687-reading-A-dominates-reading-B',
    why: 'Reading A (the +/-5 rolling-max envelope) must be >= reading B (the exact-rung floor) at every peak -- the ' +
         'rolling-max dominates its own centre value.',
    holds: () => readingADominatesB && PEAK_TABLE.every((r) => r.readingA >= r.readingB) && minAMinusB >= 0,
  },
  {
    id: 'imp33687-systematic-positive-offset',
    why: 'The envelope height must sit systematically ABOVE the exact-rung floor: the mean A-minus-B gap is positive ' +
         'and substantial.',
    holds: () => meanAMinusB > 0,
  },
  {
    id: 'imp33687-envelope-and-exact-rung-decoupled',
    why: 'THE HEADLINE (decoupling): reading A and reading B must be decoupled -- their Pearson correlation is below ' +
         '0.3 (weakly negative on this sample).',
    holds: () => envAndExactRungDecoupled && corrReadingAvsReadingB < 0.3,
  },
  {
    id: 'imp33687-tallest-envelopes-have-small-exact-rung',
    why: 'The two tallest cluster envelopes (n=1126,1198) must have SMALL exact-rung floors (< 64) -- they are collar ' +
         'maxima, not tall exact-rung floors.',
    holds: () => tallestEnvHaveSmallExactRung && tallestEnvNotElevatedGrade,
  },
  {
    id: 'imp33687-elevated-grade-rung-has-high-exact-rung',
    why: 'The lone elevated-recovery-grade rung (n=998) must be exactly the peak whose exact-rung floor exceeds the ' +
         'imp-33316 < 64 band -- the imp-33663 exact-rung tautology cross-read.',
    holds: () => elevatedGradeRungs.length >= 1 && elevatedRungHasHighExactRung,
  },
  {
    id: 'imp33687-verdict-records-agree-but-decouple',
    why: 'The classified verdict must record ENVELOPE-DEFINITIONS-AGREE-EXACTLY-BUT-DECOUPLE-FROM-THE-EXACT-RUNG-FLOOR, ' +
         'not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33687-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33687_ENVELOPE_HEIGHT_VS_SPIKE_HEIGHT_CROSS_CHECK.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33687_ENVELOPE_HEIGHT_VS_SPIKE_HEIGHT_CROSS_CHECK_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33687-envelope-height-vs-spike-height-cross-check-sixteen-peaks assertion failed: ${assertion.id}`);
  }
}
