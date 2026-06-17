// @module imp-2656-direct-rh-conjecture-map
// imp-2656 (proof, high, S7): CURRENT STRATEGIC MAP for the direct-RH effort.
//
// PURPOSE
// -------
// The v52 paper audit (paper-audit-dashboard.js + imp-1244 second-pass)
// partitioned the 14 numbered conjectures of twin_ladder_consolidated_v52
// into a fixed verdict vocabulary. The audit is correct but SCATTERED across
// ~30 per-conjecture files. This module is the single CURRENT orientation map
// for the direct-RH stream: it states (1) which conjectures are merely RH in
// disguise (SUBSUMED-BY-RH, dead ends for a direct attack), (2) which are
// genuinely open theorem-targets (INDEPENDENT-NOVEL, PARTIALLY-RELATED),
// (3) the Montgomery pair-correlation (PCC) obstruction stated precisely and
// WHICH stream it blocks, and (4) a ranking of the INDEPENDENT-NOVEL
// conjectures by closeness to a rigorous proof.
//
// HEADLINE ORIENTATION
// --------------------
// There are TWO independent streams in this project:
//
//   STREAM A (Lambda-bound / ESY-closure) — bound the de Bruijn-Newman
//     constant Lambda via the Stieltjes-transform observable psi_N. This
//     stream is BLOCKED by the Montgomery PCC obstruction (stated in
//     SECTION C). PCC is strictly load-bearing for the only ESY route that
//     improves the RATE (Route 1 / direct-Selberg, per imp-1247).
//
//   STREAM B (direct-RH / Volterra collapse) — prove RH itself by closing
//     the de Branges canonical-system existence problem (CDB-Exist), which
//     the imp-1258 two-way collapse reduces to the SINGLE statement
//     Conjecture 27.2: ||V_{a,Phi}||_{L^2([0,infinity))} <= 1. This stream
//     is INDEPENDENT of the Montgomery PCC obstruction — PCC is a statement
//     about pair-correlation of zeros (Stream A), whereas 27.2 is an
//     operator-norm bound on a Volterra kernel built from the prime-pressure
//     Phi (Stream B). Closing PCC does NOT close 27.2 and vice versa.
//
// The strategic upshot for the direct-RH stream: the genuinely-novel,
// closest-to-rigorous target is Conjecture 27.2, NOT any of the seven
// SUBSUMED-BY-RH reformulations (which are RH in another language and so
// cannot be a direct attack), and NOT the Lambda-bound stream (PCC-blocked).
//
// SYNTAX NOTE: no apostrophes inside single-quoted JS strings; no "*/" in
// comments.

// =========================================================================
// SECTION A — VERDICT VOCABULARY (matches paper-audit-dashboard.js).
// =========================================================================

const VERDICT_VOCABULARY = Object.freeze([
  'SUBSUMED-BY-RH',        // a known reformulation of RH; RH in disguise.
  'SUBSUMED-BY-LITERATURE', // a named published theorem (not RH) implies it.
  'PARTIALLY-RELATED',     // adjacent prior work, but does not imply it.
  'INDEPENDENT-NOVEL',     // no known precedent; a genuine theorem-target.
]);

// =========================================================================
// SECTION B — CURRENT CLASSIFICATION MAP of the 14 conjectures.
// =========================================================================
//
// Each row carries: id, short name, audit verdict, the audit ticket that
// established it, and (crucially for steering) directRouteStatus: whether the
// conjecture is a LIVE DIRECT-RH ROUTE (something an attack could plausibly
// close) or a DEAD END (RH in disguise, or subsumed by literature).

const CONJECTURE_MAP = Object.freeze([
  // -- The seven SUBSUMED-BY-RH reformulations (DEAD ENDS for a direct attack)
  Object.freeze({
    id: '15.2', shortName: 'Shift contractivity of X in RHP',
    verdict: 'SUBSUMED-BY-RH', auditTicket: 'imp-1229',
    directRouteStatus: 'DEAD-END-RH-IN-DISGUISE',
    note: 'de Branges 1968 Thm 23 (HB iff K_a PSD) applied to E_a(z)=X(a-iz).',
  }),
  Object.freeze({
    id: '15.3', shortName: 'Hermite-Biehler form of E_a',
    verdict: 'SUBSUMED-BY-RH', auditTicket: 'imp-1230',
    directRouteStatus: 'DEAD-END-RH-IN-DISGUISE',
    note: 'Literally the same statement as 22.4 (dedup flag).',
  }),
  Object.freeze({
    id: '15.4', shortName: 'Re(xi/xi) > 0 for sigma > 1/2',
    verdict: 'SUBSUMED-BY-RH', auditTicket: 'imp-1202',
    directRouteStatus: 'DEAD-END-RH-IN-DISGUISE',
    note: 'Pole-singularity argument: off-critical zero forces Re(xi/xi) to -infinity.',
  }),
  Object.freeze({
    id: '17.3', shortName: 'Ghost-absence (Blaschke product = 1)',
    verdict: 'SUBSUMED-BY-RH', auditTicket: 'imp-1232',
    directRouteStatus: 'DEAD-END-RH-IN-DISGUISE',
    note: 'B_a^+ = 1 iff P_a empty iff no X-zeros with Re > a; definitional.',
  }),
  Object.freeze({
    id: '18.2', shortName: 'Prime-delay domination (Weil form)',
    verdict: 'SUBSUMED-BY-RH', auditTicket: 'imp-1241',
    directRouteStatus: 'DEAD-END-RH-IN-DISGUISE',
    note: 'Conjecture 15.4 after the change of variable s = 1/2 + w.',
  }),
  Object.freeze({
    id: '18.4', shortName: 'Ghost absence (Weil/Pontryagin form)',
    verdict: 'SUBSUMED-BY-RH', auditTicket: 'imp-1232',
    directRouteStatus: 'DEAD-END-RH-IN-DISGUISE',
    note: 'Four-clause bundle; each clause an independent RH-equivalence (Weil 1952).',
  }),
  Object.freeze({
    id: '22.4', shortName: 'Zero bridge-thickness (HB form)',
    verdict: 'SUBSUMED-BY-RH', auditTicket: 'imp-1210',
    directRouteStatus: 'DEAD-END-RH-IN-DISGUISE',
    note: 'Lagarias 2007: E_a HB for all a>0 iff RH. Same content as 15.3.',
  }),

  // -- The five PARTIALLY-RELATED conjectures (existence sub-problems that
  //    unify under CDB-Exist, itself implied by 27.2 per imp-1258).
  Object.freeze({
    id: '16.4', shortName: 'H(E) space existence',
    verdict: 'PARTIALLY-RELATED', auditTicket: 'imp-1231',
    directRouteStatus: 'INTERMEDIATE-UNIFIES-UNDER-CDB-EXIST',
    note: 'de Branges 1968 H(E) existence + Lagarias 2007; needs E from Phi.',
  }),
  Object.freeze({
    id: '16.6', shortName: 'Canonical-system existence',
    verdict: 'PARTIALLY-RELATED', auditTicket: 'imp-1231',
    directRouteStatus: 'INTERMEDIATE-UNIFIES-UNDER-CDB-EXIST',
    note: 'Krein-de Branges canonical-system bijection; non-circular Phi input open.',
  }),
  Object.freeze({
    id: '18.1', shortName: 'CDB-Exist (de Branges canonical system from Phi)',
    verdict: 'PARTIALLY-RELATED', auditTicket: 'imp-1233',
    directRouteStatus: 'INTERMEDIATE-UNIFIES-UNDER-CDB-EXIST',
    note: 'The unifying existence problem; implied by 27.2 (imp-1258 collapse).',
  }),
  Object.freeze({
    id: '22.2', shortName: 'Admissible pressure families',
    verdict: 'PARTIALLY-RELATED', auditTicket: 'imp-1210',
    directRouteStatus: 'INTERMEDIATE-AXIOMATIZATION-DEPENDENT',
    note: 'Verdict depends on the exact axiomatization of admissibility in v52.',
  }),
  Object.freeze({
    id: '22.3', shortName: 'Non-circular bridge-norm realization',
    verdict: 'PARTIALLY-RELATED', auditTicket: 'imp-1210',
    directRouteStatus: 'INTERMEDIATE-AXIOMATIZATION-DEPENDENT',
    note: 'Bridge-norm realization without invoking RH; partially open.',
  }),

  // -- The two INDEPENDENT-NOVEL conjectures (the genuine theorem-targets).
  Object.freeze({
    id: '22.1', shortName: 'Twin-ladder usefulness benchmark',
    verdict: 'INDEPENDENT-NOVEL', auditTicket: 'imp-1210',
    directRouteStatus: 'LIVE-DIRECT-ROUTE-QUALITATIVE',
    note: 'Qualitative quantitative-benchmark claim; no published precedent.',
  }),
  Object.freeze({
    id: '27.2', shortName: 'Volterra norm bound ||V_{a,Phi}|| <= 1',
    verdict: 'INDEPENDENT-NOVEL', auditTicket: 'imp-1240',
    directRouteStatus: 'LIVE-DIRECT-ROUTE-LINCHPIN',
    note: 'The single statement the whole 15-27 program collapses to (imp-1258).',
  }),

  // -- Section 4.5 Conjecture 1 (outside the 15-27 cluster).
  Object.freeze({
    id: '4.5-C1', shortName: 'Linear-statistic variance',
    verdict: 'SUBSUMED-BY-LITERATURE', auditTicket: 'imp-1259',
    directRouteStatus: 'DEAD-END-PUBLISHED',
    note: 'Hughes-Rudnick 2003 + Bourgade 2010 supply the variance asymptotic.',
  }),
]);

// =========================================================================
// SECTION C — THE MONTGOMERY PCC OBSTRUCTION, STATED PRECISELY.
// =========================================================================
//
// This is the obstruction that blocks STREAM A (Lambda-bound / ESY closure).
// It is stated here so the direct-RH stream (Stream B / 27.2) knows it is NOT
// the relevant blocker for that stream.

const MONTGOMERY_PCC_OBSTRUCTION = Object.freeze({
  name: 'Montgomery pair-correlation conjecture (PCC), pointwise 2-point form',
  reference: 'Montgomery 1973, Proc. Sympos. Pure Math. XXIV, 181-193',

  preciseStatement:
    'Let gamma, gamma-prime range over the imaginary parts of nontrivial ' +
    'zeta zeros (assume RH for the normalization, or work with Re from 1/2). ' +
    'Normalize spacings by the mean density (log T)/(2 pi). Montgomery PCC ' +
    'asserts that for any fixed Schwartz test function f whose Fourier ' +
    'transform f-hat is supported in (-1, 1), the pair-correlation sum ' +
    'satisfies SUM_{gamma, gamma-prime in [0,T]} f((gamma - gamma-prime) ' +
    '(log T)/(2 pi)) ~ (T log T)/(2 pi) * INTEGRAL f(u) (1 - (sin(pi u)/' +
    '(pi u))^2 + delta(u)) du as T -> infinity. The POINTWISE form needed ' +
    'by ESY Route 1 is the corresponding statement for the 2-point density ' +
    'rho_2(x, y) = 1 - K_sin(x, y)^2 WITHOUT the Fourier-support restriction ' +
    '|supp f-hat| < 1. Montgomery PROVED the restricted (|supp f-hat| < 1) ' +
    'case; the UNRESTRICTED pointwise sine-kernel identity remains OPEN.',

  whatIsProvenUnconditionally:
    'Montgomery 1973 proved the restricted form for f-hat supported in ' +
    '(-1, 1). Selberg 1944 supplies an UNCONDITIONAL integrated (mean-square) ' +
    'upper bound on counting-function fluctuations, but it is NOT pointwise.',

  whyItBlocksStreamA:
    'ESY Route 1 (direct-Selberg, the only ESY route that improves the RATE ' +
    'on psi_N from 1/sqrt(N) to 1/N) needs the EXACT pointwise rho_2 at the ' +
    'microscopic scale y_micro = 2 pi / log gamma_N. The Poisson kernel at ' +
    'y_micro has Fourier extent ~ log N >> 1, so the restricted (|supp ' +
    'f-hat| < 1) form Montgomery proved does NOT reach it; any restriction- ' +
    'compatible smoothing already costs a 1/log N factor (imp-1247 Route 1). ' +
    'Selbergs mean-square bound is consistent with any rho_2 shape of bounded ' +
    'L^2 norm, so it cannot deliver the pointwise 1/N rate.',

  scopeOfBlock:
    'Per imp-1247: PCC is STRICTLY load-bearing for ESY Route 1 ONLY. ' +
    'Route 2 (Sobolev-via-HR) fails by a half-derivative Sobolev cost ' +
    'independent of PCC; Route 3 (higher-cumulant) is bottlenecked by ' +
    'Rudnick-Sarnak rho_3 at the 3-point level, not PCC. No 4th route ' +
    '(Conrey-Snaith ratios, Heath-Brown 4th moment, Riemann-Hilbert ' +
    'spectral, alternative observable) bypasses all bottlenecks.',

  independenceFromStreamB:
    'The Montgomery PCC obstruction is a statement about the 2-point ' +
    'correlation of zeta ZEROS. Stream B (direct-RH via Conjecture 27.2) is ' +
    'an operator-norm bound ||V_{a,Phi}|| <= 1 on a Volterra kernel built ' +
    'from the prime-pressure Phi. These are different mathematical objects: ' +
    'closing PCC does NOT close 27.2, and a proof of 27.2 would establish RH ' +
    '(via CDB-Exist) WITHOUT resolving PCC. The direct-RH stream is therefore ' +
    'NOT blocked by the Montgomery PCC obstruction.',
});

// =========================================================================
// SECTION D — INDEPENDENT-NOVEL conjectures RANKED by closeness to proof.
// =========================================================================
//
// The two INDEPENDENT-NOVEL conjectures are the only genuine theorem-targets.
// Rank them by closeness to a RIGOROUS proof (closenessScore in [0,1],
// higher = closer), with the load-bearing evidence and the residual gap.

const INDEPENDENT_NOVEL_RANKING = Object.freeze([
  Object.freeze({
    rank: 1,
    id: '27.2',
    shortName: 'Volterra norm bound ||V_{a,Phi}|| <= 1',
    closenessScore: 0.65,
    closenessBand: 'CLOSEST — strong numerics, single residual analytic gap',
    whyClosest:
      'The imp-1258 two-way collapse reduces the ENTIRE 15-27 program to ' +
      'this one statement. Empirically it is the most-supported open claim ' +
      'in the project: imp-1248 / imp-1262 power-iteration sweeps give ' +
      '||V_{a,Phi}|| <= 7.45e-5 across a 25x-widened a-grid (down to a = ' +
      '0.001) and U up to 100 — roughly 5000x below the saturation threshold ' +
      'of 1. The STRONGER claim ||V|| <= 1e-3 also holds numerically.',
    residualGap:
      'The numerics are pointwise on a finite [0, U] truncation; a rigorous ' +
      'proof needs an N-uniform analytic operator-norm bound (the Wiener-Hopf ' +
      'tail past U, and the a -> 0 limit, are not yet rigorously controlled). ' +
      'The §27 paper-construct identity (block positivity iff K_a PSD), on ' +
      'which the collapse rests, carries the imp-1265 collapse-with-caveats ' +
      'characterization.',
    blockedByMontgomeryPCC: false,
  }),
  Object.freeze({
    rank: 2,
    id: '22.1',
    shortName: 'Twin-ladder usefulness benchmark',
    closenessScore: 0.15,
    closenessBand: 'FAR — qualitative claim, no quantitative proof handle',
    whyFar:
      'The imp-1210 audit classified 22.1 as INDEPENDENT-NOVEL but ' +
      'QUALITATIVE: it asserts the twin-ladder framework is useful as a ' +
      'benchmark without a sharp quantitative inequality that an attack ' +
      'could discharge. There is no established analytic handle reducing it ' +
      'to a checkable bound, and no numerics comparable to the 27.2 sweeps.',
    residualGap:
      'Needs first a PRECISE quantitative restatement (what inequality, on ' +
      'what class, at what rate) before any rigorous-proof effort is even ' +
      'well-posed. Until then it is not a tractable direct-RH target.',
    blockedByMontgomeryPCC: false,
  }),
]);

// =========================================================================
// SECTION E — AGGREGATE COUNTS + STRATEGIC RECOMMENDATION.
// =========================================================================

function countByVerdict(v) {
  return CONJECTURE_MAP.filter((c) => c.verdict === v).length;
}

const VERDICT_COUNTS = Object.freeze({
  'SUBSUMED-BY-RH': countByVerdict('SUBSUMED-BY-RH'),
  'SUBSUMED-BY-LITERATURE': countByVerdict('SUBSUMED-BY-LITERATURE'),
  'PARTIALLY-RELATED': countByVerdict('PARTIALLY-RELATED'),
  'INDEPENDENT-NOVEL': countByVerdict('INDEPENDENT-NOVEL'),
});

const STRATEGIC_RECOMMENDATION = Object.freeze({
  headline:
    'Concentrate the direct-RH stream on Conjecture 27.2 ' +
    '(||V_{a,Phi}|| <= 1). It is the single INDEPENDENT-NOVEL target that is ' +
    'both genuinely novel and closest to a rigorous proof, and it is NOT ' +
    'blocked by the Montgomery PCC obstruction that stalls the Lambda-bound ' +
    'stream.',
  doNotAttackDirectly:
    'The seven SUBSUMED-BY-RH conjectures (15.2, 15.3, 15.4, 17.3, 18.2, ' +
    '18.4, 22.4) are RH in another language; attacking any of them directly ' +
    'is attacking RH itself with no leverage gained.',
  intermediateLever:
    'The five PARTIALLY-RELATED conjectures (16.4, 16.6, 18.1, 22.2, 22.3) ' +
    'unify under CDB-Exist, which imp-1258 shows is implied by 27.2. So they ' +
    'come for free once 27.2 closes; they are not separate attack fronts.',
  streamSeparation:
    'Track Stream A (Lambda-bound, PCC-blocked) and Stream B (direct-RH via ' +
    '27.2, PCC-independent) as DISTINCT efforts. Progress on Montgomery PCC ' +
    'does not advance 27.2 and a proof of 27.2 does not require PCC.',
});

// =========================================================================
// EXPORTED RECORD.
// =========================================================================

export const IMP_2656_DIRECT_RH_CONJECTURE_MAP = Object.freeze({
  id: 'imp-2656-direct-rh-conjecture-map',
  ticket: 'imp-2656',
  builtAt: '2026-06-17',
  paper: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  proofSection: 'S7',

  verdictVocabulary: VERDICT_VOCABULARY,
  conjectureMap: CONJECTURE_MAP,
  verdictCounts: VERDICT_COUNTS,

  montgomeryPccObstruction: MONTGOMERY_PCC_OBSTRUCTION,
  independentNovelRanking: INDEPENDENT_NOVEL_RANKING,
  strategicRecommendation: STRATEGIC_RECOMMENDATION,

  honestScope: Object.freeze([
    'This module SYNTHESIZES existing audit verdicts (paper-audit-dashboard, ' +
    'imp-1244 second-pass, imp-1247 PCC recheck, imp-1258 Volterra collapse). ' +
    'It does NOT re-derive any verdict and does NOT close any conjecture.',
    'The closenessScore values (27.2 at 0.65, 22.1 at 0.15) are SUBJECTIVE ' +
    'ordinal estimates reflecting numerical support and the presence of an ' +
    'analytic reduction; they are NOT rigorous probabilities.',
    'The claim that Stream B (27.2) is independent of the Montgomery PCC ' +
    'obstruction is an OBJECT-LEVEL observation (different mathematical ' +
    'objects: zero pair-correlation vs Volterra operator norm), not a proof ' +
    'that 27.2 is easier — only that PCC is not its blocker.',
    'Conjecture 27.2 remains OPEN: the numerics are on a finite truncation; ' +
    'an N-uniform analytic norm bound is the residual gap (imp-1265 caveats).',
  ]),

  crossReferences: Object.freeze([
    'paper-audit-dashboard.js — canonical per-conjecture verdicts',
    'imp-1244-subsumed-rh-second-pass.js — 7 SUBSUMED-BY-RH re-verified',
    'imp-1247-shared-pcc-obstruction-recheck.js — PCC scope across ESY routes',
    'imp-1258-volterra-cdb-bridge.js — 15-27 program collapses to 27.2',
    'imp-1248 / imp-1262 — Volterra-norm numerical sweeps (||V|| <= 7.45e-5)',
    'imp-1265 — adversarial recheck of the §27 block-positivity identity',
  ]),
});

export default IMP_2656_DIRECT_RH_CONJECTURE_MAP;

// =========================================================================
// BUILD-TIME TRIPWIRES.
// =========================================================================

export const IMP_2656_DIRECT_RH_CONJECTURE_MAP_ASSERTIONS = [
  {
    id: 'imp2656-all-conjectures-mapped',
    why:
      'The map must cover all 15 audited conjectures: the 14 of the 15-27 ' +
      'cluster (7 SUBSUMED-BY-RH + 5 PARTIALLY-RELATED + 2 INDEPENDENT-NOVEL) ' +
      'plus Section 4.5 Conjecture 1. Dropping one leaves the map incomplete.',
    holds: () => IMP_2656_DIRECT_RH_CONJECTURE_MAP.conjectureMap.length === 15,
  },
  {
    id: 'imp2656-verdict-counts-match-canonical-partition',
    why:
      'The classification must reproduce the canonical v52 partition: 7 ' +
      'SUBSUMED-BY-RH, 5 PARTIALLY-RELATED, 2 INDEPENDENT-NOVEL, 1 SUBSUMED-' +
      'BY-LITERATURE. Any drift means the synthesis diverged from the audit.',
    holds: () => {
      const c = IMP_2656_DIRECT_RH_CONJECTURE_MAP.verdictCounts;
      return (
        c['SUBSUMED-BY-RH'] === 7 &&
        c['PARTIALLY-RELATED'] === 5 &&
        c['INDEPENDENT-NOVEL'] === 2 &&
        c['SUBSUMED-BY-LITERATURE'] === 1
      );
    },
  },
  {
    id: 'imp2656-every-verdict-from-fixed-vocabulary',
    why:
      'Each conjecture verdict must come from the fixed four-element ' +
      'vocabulary, matching paper-audit-dashboard.js. An out-of-vocabulary ' +
      'verdict would break downstream aggregation.',
    holds: () => {
      const allowed = new Set(IMP_2656_DIRECT_RH_CONJECTURE_MAP.verdictVocabulary);
      return IMP_2656_DIRECT_RH_CONJECTURE_MAP.conjectureMap.every((c) =>
        allowed.has(c.verdict),
      );
    },
  },
  {
    id: 'imp2656-pcc-obstruction-stated-precisely',
    why:
      'The Montgomery PCC obstruction is a required deliverable. Its precise ' +
      'statement must mention the Fourier-support restriction (the crux: ' +
      'Montgomery proved |supp f-hat| < 1; the unrestricted pointwise form is ' +
      'open) and the sine-kernel. A vague statement fails the ticket.',
    holds: () => {
      const s = IMP_2656_DIRECT_RH_CONJECTURE_MAP.montgomeryPccObstruction.preciseStatement;
      return (
        typeof s === 'string' &&
        s.length >= 400 &&
        /-1, 1\)|\(-1,1\)/.test(s) &&
        /sin\(pi u\)|sine-kernel|K_sin/.test(s) &&
        /OPEN/.test(s)
      );
    },
  },
  {
    id: 'imp2656-pcc-blocks-stream-A-not-stream-B',
    why:
      'The load-bearing strategic claim is that the Montgomery PCC ' +
      'obstruction blocks the Lambda-bound stream (A) but NOT the direct-RH ' +
      'stream (B / Conjecture 27.2). If this flips, the orientation is wrong.',
    holds: () => {
      const o = IMP_2656_DIRECT_RH_CONJECTURE_MAP.montgomeryPccObstruction;
      return (
        typeof o.whyItBlocksStreamA === 'string' &&
        o.whyItBlocksStreamA.length >= 200 &&
        typeof o.independenceFromStreamB === 'string' &&
        /does NOT close 27.2|NOT blocked/.test(o.independenceFromStreamB)
      );
    },
  },
  {
    id: 'imp2656-independent-novel-ranking-covers-both-and-is-ordered',
    why:
      'The ranking must cover exactly the two INDEPENDENT-NOVEL conjectures ' +
      '(27.2 and 22.1), be strictly ordered by closenessScore (descending), ' +
      'and place 27.2 first as the closest-to-rigorous target.',
    holds: () => {
      const r = IMP_2656_DIRECT_RH_CONJECTURE_MAP.independentNovelRanking;
      if (r.length !== 2) return false;
      const ids = r.map((x) => x.id);
      if (!ids.includes('27.2') || !ids.includes('22.1')) return false;
      return (
        r[0].id === '27.2' &&
        r[0].closenessScore > r[1].closenessScore &&
        r.every((x) => x.closenessScore >= 0 && x.closenessScore <= 1)
      );
    },
  },
  {
    id: 'imp2656-ranking-ids-match-independent-novel-verdicts',
    why:
      'The ranked ids must be EXACTLY the conjectures whose map verdict is ' +
      'INDEPENDENT-NOVEL. A mismatch would mean the ranking and the ' +
      'classification disagree on which conjectures are genuine targets.',
    holds: () => {
      const novel = new Set(
        IMP_2656_DIRECT_RH_CONJECTURE_MAP.conjectureMap
          .filter((c) => c.verdict === 'INDEPENDENT-NOVEL')
          .map((c) => c.id),
      );
      const ranked = new Set(
        IMP_2656_DIRECT_RH_CONJECTURE_MAP.independentNovelRanking.map((x) => x.id),
      );
      if (novel.size !== ranked.size) return false;
      for (const id of novel) if (!ranked.has(id)) return false;
      return true;
    },
  },
  {
    id: 'imp2656-strategic-recommendation-points-at-27-2',
    why:
      'The strategic recommendation must name Conjecture 27.2 as the focus ' +
      'of the direct-RH stream and warn that the seven SUBSUMED-BY-RH ' +
      'conjectures are RH in disguise. This is the actionable output.',
    holds: () => {
      const rec = IMP_2656_DIRECT_RH_CONJECTURE_MAP.strategicRecommendation;
      return (
        /27\.2/.test(rec.headline) &&
        /SUBSUMED-BY-RH|RH in another language/.test(rec.doNotAttackDirectly)
      );
    },
  },
  {
    id: 'imp2656-honest-scope-discloses-synthesis-not-closure',
    why:
      'The honest scope must disclose that this module SYNTHESIZES prior ' +
      'audits and does NOT close any conjecture, and that 27.2 remains OPEN. ' +
      'Without this, the map could be misread as a proof claim.',
    holds: () => {
      const blob = IMP_2656_DIRECT_RH_CONJECTURE_MAP.honestScope.join(' ');
      return (
        /SYNTHESIZES|synthesizes/.test(blob) &&
        /does NOT close|remains OPEN/.test(blob)
      );
    },
  },
];
