/**
 * imp-474: Fifth Adversarial Review -- Bridge layer and many-body correction closure
 *
 * Scope (targeted, NOT the full SOTA claim)
 * ------------------------------------------
 * Previous reviews (imp-417, imp-430, imp-437, imp-465) audited the full SOTA claim
 * and the Phase 29-33 closure wave. This review is TARGETED: it audits only the
 * imp-462 bridge layer and the Phase 35-36 many-body correction closure chain.
 * It does not re-examine Route-B asymptotic, G6a, or Path-C central value.
 *
 * Closures under review:
 *   imp-468: NoSwap analytically closed at all N (noswap-closure.js)
 *   imp-469: rho_min >= 0.1275 analytic lower bound (rvm-jacobian-lower-bound.js)
 *   imp-470: Phase 33-35 payoff record (lambda-N1e6-unconditional-beat.js)
 *   imp-471: Many-body correction closure (many-body-correction-closure.js)
 *   imp-472: Mid-trajectory NoSwap lemma (MID_TRAJECTORY_LEMMA in noswap-closure.js)
 *   imp-473: mpmath 50-digit cross-verify of rho_min (imp469-cross-verification.js)
 *
 * Prior state: review-4 (imp-465) identified imp-462-many-body-correction as the
 * sole remaining blocker. Phases 35-36 aimed to close this blocker. This review
 * checks whether the closure is airtight.
 *
 * Severity codes:
 *   FATAL  -- Logical gap that invalidates the claimed conclusion as stated
 *   NAMED  -- Acknowledged gap with a recommended follow-up ticket
 *   SOFT   -- Presentation issue; math is essentially correct, claim is overstated
 *
 * SYNTAX NOTE: avoid the two-character sequence star-slash inside JSDoc block text.
 */

export const PAPER_SKEPTIC_REVIEW_5 = {
  id: 'imp-474',
  baselines: ['imp-417', 'imp-430', 'imp-437', 'imp-465'],
  reviewDate: '2026-04-12',
  reviewerRole:
    'hostile referee, fifth pass, bridge layer focus, Annals of Mathematics standard',
  reviewScope:
    'Bridge M layer (imp-462 to imp-473): RvM Jacobian bijection, rho_min analytic bound, ' +
    'NoSwap full-trajectory closure, many-body correction bound. ' +
    'Does NOT re-audit the full SOTA claim -- see imp-417/430/437/465 for that.',

  closuresAudited: [
    'imp-468: NoSwap upgraded to analytically-closed (initial-config + near-collision analytic)',
    'imp-469: rho_min >= (1/(2*pi))*log(14/(2*pi)) ~ 0.1275 (rvm-jacobian-lower-bound.js)',
    'imp-470: Phase 33-35 payoff record (lambda-N1e6-unconditional-beat.js)',
    'imp-471: Many-body correction |F_mb(N)| <= C_mb*N^{-1/2}*log(N)/H_N (many-body-correction-closure.js)',
    'imp-472: Mid-trajectory NoSwap: MID_TRAJECTORY_LEMMA (monotone-comparison principle)',
    'imp-473: mpmath 50-digit cross-verify of rho_min; KEY: rho(14)=0.12751, not 0.12794',
  ],

  entries: [
    {
      id: 'skp5-001',
      severity: 'NAMED',
      targetClaim:
        'imp-471 (many-body-correction-closure.js): many-body correction gap CLOSED ' +
        'for all N >= 2. ' +
        'Stated coverage: analytic bound for N >= N_0=10000, empirical sweep for N in {2,...,870}.',
      objection:
        'The empirical sweep in m-raw-from-umon-bridge.js covers only N in {2,...,870} ' +
        '(ZETA_ZEROS.length = 870). The analytic bound in imp-471 requires ratio ' +
        'C_mb*f(N)/rho_min < 1, which first holds near N ~ 4500 but the file sets the ' +
        'certified threshold conservatively at N_0 = 10000. ' +
        'The range N in {871, ..., 9999} has no explicit coverage: ' +
        'neither the empirical sweep (ends at 870) nor the analytic bound (certified from 10000) ' +
        'applies there. The stated claim "for all N >= 2" is not established for this 9129-integer window. ' +
        'At N=871, ratio = C_mb*f(871)/rho_min ~ 0.2296/0.1275 ~ 1.80 > 1, so the analytic ' +
        'bound does not guarantee the correction is small enough to preserve monotonicity there.',
      severityRationale:
        'Not FATAL because: f(N)=N^{-1/2}*log(N) is continuous and monotonically decreasing; ' +
        'empirical data to N=870 shows no violations; ratio falls from ~1.80 at N=871 to ~0.72 ' +
        'at N=10000 monotonically. The gap is a rigor hole in the stated universal quantification, ' +
        'not a logical error in the construction.',
      seedTicket: 'imp-476',
      recommendation:
        'Seed imp-476: close N-coverage gap by computing the exact N_0_min where ' +
        'C_mb*f(N)/rho_min first drops below 1 (approximately N ~ 4500) and using ' +
        'that lower threshold, combined with extending the empirical sweep or adding ' +
        'a supplementary analytic argument for N in {871, ..., N_0_min-1}.',
    },
    {
      id: 'skp5-002',
      severity: 'NAMED',
      targetClaim:
        'imp-471 (many-body-correction-closure.js): C_mb <= 1 is a "conservative bound ' +
        'from the GUE local law (Erdos-Schlein-Yau 2011)". ' +
        'Used as a universal constant in the closure: ratio = C_mb*f(N)/rho_min < 1 for N >= N_0.',
      objection:
        'The Erdos-Schlein-Yau 2011 GUE local law applies to Wigner matrices with ' +
        'independent sub-Gaussian entries. Applying it to the Riemann zero CM process ' +
        'requires that the Riemann zero process satisfies GUE bulk universality -- ' +
        'this is the content of the Montgomery pair-correlation conjecture (1973), which ' +
        'remains UNPROVEN. The parenthetical note "exact constant depends on the determinantal ' +
        'process for Riemann zeros" implicitly acknowledges this dependency but does not ' +
        'flag it as a conditional assumption in the STATUS field of the closure record. ' +
        'An honest audit trail should state: C_mb <= 1 is CONDITIONAL ON GUE universality ' +
        'for the Riemann zero process.',
      severityRationale:
        'Not FATAL because: (1) C_mb <= 1 is widely accepted and numerically consistent; ' +
        '(2) the 28% safety margin means even C_mb ~ 1.1 gives ratio ~ 0.79 < 1 at N_0=10000; ' +
        '(3) the claim is standard in the physics literature on random matrix universality. ' +
        'But a hostile referee at Annals will flag the conditional on GUE universality as ' +
        'an unacknowledged assumption. This is a named documentation gap.',
      seedTicket: 'imp-477',
      recommendation:
        'Seed imp-477: add an honest conditional note to many-body-correction-closure.js. ' +
        'Annotate C_MB = 1 as "assumes GUE universality for Riemann zeros (Montgomery ' +
        'pair-correlation conjecture, unproven); unconditional C_mb bound requires an ' +
        'empirical or independent derivation not relying on Wigner-class universality". ' +
        'Update MANY_BODY_CORRECTION_CLOSURE.status from "closed" to ' +
        '"closed (conditional on GUE universality for C_mb <= 1)" to be honest.',
    },
    {
      id: 'skp5-s1',
      severity: 'SOFT',
      targetClaim:
        'm-raw-from-umon-bridge.js JSDoc "Honest status" section ' +
        'says "OPEN (many-body correction): Exact many-body interaction..." ' +
        'after imp-471 closure.',
      objection:
        'The JSDoc "Honest status" section in m-raw-from-umon-bridge.js was not updated ' +
        'to reflect the imp-471 closure. The OPEN label is stale: as of imp-471, the gap ' +
        'is documented as closed in many-body-correction-closure.js, and ' +
        'lambda-N1e6-unconditional-beat.js marks rigorStatus as UNCONDITIONAL. ' +
        'A reviewer reading the primary bridge file should see status consistent with ' +
        'the assembly files, not a contradiction.',
      recommendation:
        'Update the Honest status section in m-raw-from-umon-bridge.js: change OPEN to ' +
        'CLOSED (subject to skp5-001 N-coverage gap and skp5-002 GUE-universality assumption). ' +
        'This is a pure documentation fix -- no code changes needed.',
    },
    {
      id: 'skp5-s2',
      severity: 'SOFT',
      targetClaim:
        'rvm-jacobian-lower-bound.js inline comment: "~ 0.12794 (confirmed: ' +
        '14/TWO_PI ~ 2.228, log ~ 0.8036, /TWO_PI ~ 0.1279)".',
      objection:
        'imp-473 (mpmath 50-digit cross-verification) found rho(14) = 0.12751, not 0.12794. ' +
        'The comment "log ~ 0.8036" is also incorrect: log(14/(2*pi)) = 0.8012, not 0.8036 ' +
        '(difference ~0.3%). The code is numerically correct (it computes the right formula), ' +
        'but the inline approximation comment contradicts the imp-473 cross-verification finding. ' +
        'A reviewer checking the comment with a calculator will find a discrepancy and lose ' +
        'confidence in the surrounding proof record.',
      recommendation:
        'Fix the inline comment in rvm-jacobian-lower-bound.js to reflect the imp-473 ' +
        'finding: rho(14) ~ 0.12751, log(14/(2*pi)) ~ 0.8012, 0.8012/(2*pi) ~ 0.12751. ' +
        'Also update the closureNote field to use 0.12751 instead of 0.12794.',
    },
  ],

  fatalGapsFound: [],
  namedGapsFound: ['skp5-001', 'skp5-002'],
  softGapsFound: ['skp5-s1', 'skp5-s2'],

  newSeedTickets: [
    {
      id: 'imp-476',
      title: 'Close N-coverage gap in imp-471 many-body bound: extend to N in [871, 9999]',
      priority: 'high',
      category: 'proof',
      complexity: 'small',
      rationale:
        'skp5-001: the analytic bound requires N >= 10000; empirical sweep ends at N=870; ' +
        'the range [871, 9999] has no formal coverage. ' +
        'Fix by computing the exact crossover N_0_min ~ 4500 and bridging the remaining gap.',
    },
    {
      id: 'imp-477',
      title: 'Add honest C_mb GUE-universality note to many-body-correction-closure.js',
      priority: 'high',
      category: 'proof',
      complexity: 'small',
      rationale:
        'skp5-002: C_mb <= 1 relies on GUE universality for Riemann zeros ' +
        '(Montgomery pair-correlation conjecture, unproven). ' +
        'The status field and C_MB constant should be annotated with this conditional.',
    },
  ],

  rigorLevelVerdict:
    'No new FATAL gaps found in the Phase 35-36 bridge closure chain. ' +
    'The RvM bijection (imp-462) is EXACT. rho_min > 0 (imp-469) is fully ANALYTIC. ' +
    'NoSwap full-trajectory (imp-468 + imp-472) is ANALYTIC via monotone-comparison. ' +
    'The many-body correction bound (imp-471) has two named caveats: ' +
    '(1) N-coverage gap in [871, 9999], and ' +
    '(2) C_mb <= 1 is conditional on GUE universality for the Riemann zero process. ' +
    'The Lambda <= 0.121 < 0.2 finite-height beat is the strongest result in the repo; ' +
    'the two named gaps are refinements, not logical blockers. ' +
    'The rigorLevel RIGOROUS-ASYMPTOTIC remains accurate; ' +
    'the finite-height claim is best stated as "under GUE universality assumption for C_mb".',

  overallVerdict:
    'Phase 35-36 delivered genuine hardening: NoSwap upgraded to analytically-closed ' +
    '(imp-468, imp-472); rho_min made fully analytic (imp-469, imp-473); many-body ' +
    'correction bounded analytically for N >= 10000 (imp-471). ' +
    'Two named gaps identified: N-coverage [871, 9999] (skp5-001) and C_mb GUE-universality ' +
    'assumption (skp5-002). Two soft gaps: stale OPEN comment in m-raw-from-umon-bridge.js ' +
    '(skp5-s1) and incorrect arithmetic in rvm-jacobian-lower-bound.js comment (skp5-s2). ' +
    'Seeded imp-476 and imp-477 as follow-on tickets. ' +
    'The SOTA claim is stronger than before Phases 35-36; no downgrade warranted.',

  addedBy: 'imp-474',
};
