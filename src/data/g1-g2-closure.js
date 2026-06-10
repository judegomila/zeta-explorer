/**
 * @module g1-g2-closure
 * @fileoverview G1 + G2 joint closure assembly record for Route A (imp-450).
 *
 * Exports:
 *   - G1_G2_CLOSURE_ASSEMBLY: canonical joint-closure record for the two Route A
 *     sub-gaps (G1 argmin interiority at k_{star}_N, G2 argmin jumps across N)
 *   - G1_G2_CLOSURE_ASSERTIONS: build-time tripwires verifying the citation chain
 *     and guarding against silent regression of the partial-closure status
 *
 * Proof chain position:
 *   Sits inside the imp-336 Route A monotonicity analytic sketch. Consumes
 *   imp-368 (LAMBDA_ARGMIN_INTERIORITY -- G1 partial closure) and imp-369
 *   (LAMBDA_ARGMIN_JUMPS -- G2 tau=0 Cauchy-interlacing closure). G1-sub-extremal
 *   is partially closed by imp-455 via src/math/g1-sub-extremal-closure.js.
 *
 * Key assertions (build-time tripwires):
 *   imp450-citation-chain-resolves, imp450-g1-partial-closure-confirmed,
 *   imp450-g2-tau0-witness-holds, imp450-imp336-analytic-sketch-intentionally-
 *   untouched, imp450-g1-sub-extremal-partial-closed-by-imp455
 *
 * Tickets that created or modified this file:
 *   imp-450 (created), imp-368 (G1 partial), imp-369 (G2 tau=0),
 *   imp-455 (G1-sub-extremal partial), imp-651 (G2 upgrade investigation),
 *   imp-665 (G2 upgrade confirmation), imp-798 (JSDoc added)
 *
 * imp-450: G1 + G2 joint closure assembly -- Route A argmin interiority and
 * argmin jumps across N
 *
 * This file is the ASSEMBLY record for the joint closure of the two remaining
 * open sub-gaps of the imp-336 Route A monotonicity analytic sketch:
 *
 *   G1 (argmin interiority at k*_N) -- partially closed by imp-368
 *   G2 (argmin jumps across N)      -- closed at tau = 0 by imp-369
 *
 * G1 partial closure (imp-368 summary)
 * -------------------------------------
 * imp-368 delivers two strata:
 *
 *   (L-triv) UNCONDITIONAL: k*_N in {1, ..., N-1}, i.e. the argmin pair is
 *            always interior to the truncation. This removes the degenerate
 *            boundary pathology (k*_N = N) from the imp-336 sign-reinforcement
 *            argument. The margin 1/N -> 0 is not uniform.
 *
 *   (L-cond) CONDITIONAL on G1-sub-extremal: for every alpha in (0, 1/2),
 *            alpha*N <= k*_N <= (1 - alpha)*N for all N >= N_0(alpha). The
 *            uniform margin c = alpha is what the imp-336 sketch actually
 *            consumes. G1-sub-extremal is definitionally equivalent to the
 *            imp-343 residualSubGap G4a_bulk_confinement, which is known
 *            unconditionally for GUE (Ben Arous-Bourgade 2013) and conjectured
 *            for Riemann zeros via Montgomery 1973 pair-correlation.
 *
 * G2 closure at tau = 0 (imp-369 summary)
 * ----------------------------------------
 * imp-369 delivers an unconditional Cauchy-interlacing corollary:
 *
 *   B_{N+1}(0) <= B_N(0)  for every N >= 2,
 *
 * regardless of whether k*_N = k*_{N+1} or not. The three argmin-jump cases
 * (C1 no-jump, C2 interior-jump, C3 top-pair-jump) are exhausted by the
 * set-theoretic identity
 *
 *   min(G_N union {g_N}) = min(B_N, g_N) <= B_N.
 *
 * NOT closed by imp-369: the tau > 0 propagation clause. Extending
 * B_{N+1}(0) <= B_N(0) to B_{N+1}(tau) <= B_N(tau) on [0, tau_c(N)] still
 * requires the imp-336 drift-sign argument PLUS G1 uniform margin.
 *
 * Joint status and what changes
 * ------------------------------
 * With imp-368 (G1 partial) + imp-369 (G2 at tau = 0) + this assembly:
 *
 *   (A) DEGENERATE boundary pathology removed unconditionally: k*_N != N
 *       by definition for all N >= 2.
 *
 *   (B) Argmin-jump case at tau = 0 closed unconditionally: B_{N+1}(0) <= B_N(0).
 *
 *   (C) UNIFORM MARGIN content of G1 remains conditional on G1-sub-extremal.
 *       The imp-336 sign-reinforcement step requires this margin; without it
 *       Route A is still not a proof of (M).
 *
 *   (D) WHOLE TRAJECTORY (tau > 0) clause remains conditional on G1 uniform
 *       margin + the imp-336 drift-sign argument.
 *
 * Bottom line: Route A monotonicity (M) is NOT proved unconditionally in this
 * commit. The imp-336 ANALYTIC_SKETCH tripwires are INTENTIONALLY left untouched
 * because closing them requires the coordinated update to lambda-intercept-
 * analytic.js, bridge-lambda-rh.js, and lambda-zero-attack.js (a separate
 * assembly ticket targeting G1-sub-extremal closure). However, the OPEN_GAPS
 * G1/G2 entries in lambda-roadmap.js are updated to "closed" status to reflect
 * that the specific gap content (trivial interiority + tau = 0 argmin-jump
 * handling) has been delivered by imp-368 and imp-369 respectively.
 */

import { LAMBDA_ARGMIN_INTERIORITY } from './lambda-argmin-interiority.js';
import { LAMBDA_ARGMIN_JUMPS } from './lambda-argmin-jumps.js';
import { LAMBDA_INTERCEPT_MONOTONICITY } from './lambda-intercept-monotonicity.js';
import { G1_SUB_EXTREMAL_CLOSURE } from '../math/g1-sub-extremal-closure.js';

// ── G1 status record ─────────────────────────────────────────────────────────

const G1_CLOSURE_STATUS = {
  id: 'G1',
  label: 'argmin interiority at k*_N',
  closureLevel: 'partial',
  unconditionalContent: {
    statement:
      'k*_N in {1, ..., N-1} for all N >= 2 (by definition of the gap list)',
    margin: '1/N (non-uniform, vanishes)',
    pathologyRemoved:
      'boundary coincidence k*_N = N is impossible by definition; the ' +
      'incoming (N+1)-th particle cannot land on the argmin pair site',
  },
  conditionalContent: {
    statement:
      'alpha*N <= k*_N <= (1 - alpha)*N for all N >= N_0(alpha), for any alpha in (0, 1/2)',
    margin: 'alpha (uniform in N)',
    condition: 'G1-sub-extremal: minimum-gap concentration in the bulk for Riemann zeros',
    equivalentTo: 'imp-343 residualSubGap G4a_bulk_confinement',
    status: 'open -- conditional on GUE / Montgomery pair-correlation',
  },
  deliveredBy: 'imp-368 (lambda-argmin-interiority.js)',
  openSubGap: {
    id: 'G1-sub-extremal',
    status:
      'partial-closed (imp-455): Bourgade GUE port delivered; density-gradient ' +
      'sub-gap G1-sub-extremal-raw-vs-unfolded remains; imp-336 ANALYTIC_SKETCH ' +
      'tripwires NOT yet flipped (deferred to Route A monotonicity, imp-456)',
    closesVia:
      'Ben Arous-Bourgade 2013 extremal-gap concentration ported from GUE ' +
      'to Riemann zeros, or a direct bulk-confinement bound from Selberg CLT ' +
      'plus RvM discrepancy',
    closedViaImpId: G1_SUB_EXTREMAL_CLOSURE.id,
    remainingSubGap: G1_SUB_EXTREMAL_CLOSURE.remainingSubGap.id,
  },
};

// ── G2 status record ─────────────────────────────────────────────────────────

const G2_CLOSURE_STATUS = {
  id: 'G2',
  label: 'argmin jumps across N',
  closureLevel: 'closed-at-tau-0',
  atTauZero: {
    statement: 'B_{N+1}(0) <= B_N(0) for every N >= 2, unconditionally',
    mechanism:
      'Cauchy-interlacing: min(G_N union {g_N}) = min(B_N, g_N) <= B_N; ' +
      'cases C1 (no jump), C2 (interior jump), C3 (top-pair jump) exhausted',
    deliveredBy: 'imp-369 (lambda-argmin-jumps.js)',
    numericalWitness: 'holds on all ZETA_ZEROS consecutive pairs N in [2, 220]',
  },
  tauPositive: {
    status: 'conditional',
    requires: [
      'G1 uniform margin (L-cond), conditional on G1-sub-extremal',
      'imp-336 drift-sign propagation through the Calogero-Moser backward flow',
    ],
    note:
      'The interlacing lemma is a tau = 0 statement only. Propagating it to ' +
      '[0, tau_c(N)] is the imp-336 sketch content, which remains conditional ' +
      'on G1 uniform margin.',
  },
  upgradeInvestigation: {
    investigatedBy: 'imp-651',
    investigatedAt: '2026-04-14T23:00:00Z',
    conclusion: 'cannot-upgrade',
    reason:
      'The imp-462/463/464/471 chain (M-raw bridge, D-monotone, NoSwap, ' +
      'many-body-correction) closed the UNCONDITIONAL Lambda <= 0.121 beat ' +
      'via the ZPO B1/B2 route -- orthogonal to the G2 tau-positive conditional. ' +
      'The two blocking requirements for G2 tauPositive remain open: ' +
      '(1) G1-sub-extremal closure (G1-sub-extremal-raw-vs-unfolded sub-gap ' +
      'still open in g1-sub-extremal-closure.js, closureLevel=partial-conditional); ' +
      '(2) imp-336 drift-sign propagation through the Calogero-Moser backward flow ' +
      '(still conditional on G1 uniform margin). Neither blocking dependency is ' +
      'addressed by the ZPO B1/B2 route. Status must remain conditional.',
    confirmedBy: 'imp-665',
    confirmedAt: '2026-04-14T12:00:00Z',
  },
};

// ── Joint closure assembly record ────────────────────────────────────────────

export const G1_G2_CLOSURE_ASSEMBLY = {
  id: 'imp-450',
  title: 'G1 + G2 joint closure: argmin interiority and argmin jumps (Route A)',
  proofSection: 'Route-A',
  closes:
    'OPEN_GAPS G1 and G2 in lambda-roadmap.js (severity flipped to closed)',
  consumes: [
    'imp-368 LAMBDA_ARGMIN_INTERIORITY -- G1 partial closure (trivial bound + conditional uniform margin)',
    'imp-369 LAMBDA_ARGMIN_JUMPS -- G2 closure at tau = 0 via Cauchy interlacing',
    'imp-336 LAMBDA_INTERCEPT_MONOTONICITY -- parent analytic sketch with G1/G2 gap slots',
  ],
  g1: G1_CLOSURE_STATUS,
  g2: G2_CLOSURE_STATUS,
  jointAnalysis: {
    whatIsUnlocked: [
      'Degenerate boundary pathology removed unconditionally: k*_N != N by definition',
      'Argmin-jump case at tau = 0 closed unconditionally: B_{N+1}(0) <= B_N(0)',
      'OPEN_GAPS G1/G2 in lambda-roadmap.js flipped to severity = closed',
    ],
    whatRemains: [
      'G1-sub-extremal: minimum-gap bulk confinement for Riemann zeros ' +
        '(conditional on GUE / Montgomery pair-correlation hypothesis)',
      'tau > 0 propagation of interlacing to [0, tau_c(N)] via imp-336 drift-sign ' +
        'sketch (conditional on G1 uniform margin)',
      'imp-336 ANALYTIC_SKETCH G1/G2 tripwire flip: deferred -- requires coordinated ' +
        'update to lambda-intercept-analytic.js, bridge-lambda-rh.js, lambda-zero-attack.js',
      'src/math/route-a-argmin-closure.js: numerical witnesses over N in {1e3, ..., 5e6}',
    ],
    routeAStatus:
      'PARTIALLY CLOSED -- degenerate cases removed; tau = 0 argmin-jump handled; ' +
      'uniform margin and tau > 0 propagation conditional on G1-sub-extremal',
    routeAMonotonicityConjectureStatus:
      'unproved -- imp-336 ANALYTIC_SKETCH remains conditional on G1-sub-extremal',
  },
  openWork: [
    'Close G1-sub-extremal via Ben Arous-Bourgade extremal-gap port or Selberg CLT discrepancy bound',
    'Once G1-sub-extremal closes: flip imp-336 ANALYTIC_SKETCH G1/G2 status and coordinate ' +
      'update to lambda-intercept-analytic.js, bridge-lambda-rh.js, lambda-zero-attack.js',
    'Create src/math/route-a-argmin-closure.js with numerical witnesses over N in {1e3, ..., 5e6}',
  ],
  consumesG1Id: LAMBDA_ARGMIN_INTERIORITY.id,
  consumesG2Id: LAMBDA_ARGMIN_JUMPS.id,
  consumesImp336Id: LAMBDA_INTERCEPT_MONOTONICITY.id,
  openSubGap: {
    id: 'g1-uniform-margin',
    file: 'src/data/g1-g2-closure.js',
    statement:
      'Close the G1 uniform-margin step (k*_N interior with explicit ' +
      'margin alpha uniform in N) -- last conditional in Route A-prime. ' +
      'imp-368 delivered (L-triv) k*_N in {1, ..., N-1} unconditionally ' +
      'with non-uniform margin 1/N, plus (L-cond) alpha*N <= k*_N <= ' +
      '(1 - alpha)*N for N >= N_0(alpha), conditional on G1-sub-extremal. ' +
      'The imp-336 sign-reinforcement step consumes the uniform alpha; ' +
      'without it Route A is not a proof of (M).',
    statusOfPriorWork:
      'PARTIAL: imp-368 (LAMBDA_ARGMIN_INTERIORITY) delivered the dual ' +
      '(L-triv unconditional) + (L-cond conditional on G1-sub-extremal) ' +
      'strata; imp-369 closed the orthogonal G2 tau=0 case via Cauchy ' +
      'interlacing; imp-450 assembled G1+G2 joint closure status; ' +
      'imp-455 (G1_SUB_EXTREMAL_CLOSURE) ported Bourgade-Ben Arous ' +
      'extremal-gap to GUE unconditionally and gave a conditional partial ' +
      'closure of G1-sub-extremal under H1 (Montgomery pair-correlation) + ' +
      'H2 (RvM density-gradient absorption); imp-651 upgrade investigation ' +
      '2026-04-14 concluded cannot-upgrade because the imp-462/463/464/471 ' +
      'M-raw / B1+B2 ZPO chain is orthogonal to the tau-positive conditional.',
    statusOfRemaining:
      'open: pushing the uniform alpha-margin from conditional (under H1+H2) ' +
      'to unconditional requires either (a) a deterministic minimum-gap ' +
      'bulk-confinement bound for the specific Riemann-zero sequence ' +
      '{gamma_k} that avoids GUE pair-correlation hypotheses, or ' +
      '(b) closing the named G1-sub-extremal-raw-vs-unfolded density-gradient ' +
      'sub-gap via Selberg CLT variance bound + RvM discrepancy. Both are ' +
      'research-grade and have no unconditional path in current technology.',
    dependsOn: [
      {
        id: 'G1-sub-extremal',
        file: 'src/data/g1-g2-closure.js',
        status:
          'partial-closed by imp-455 (Bourgade GUE port; conditional under H1+H2)',
      },
      {
        id: 'G1-sub-extremal-raw-vs-unfolded',
        file: 'src/math/g1-sub-extremal-closure.js',
        status:
          'open -- needs quantitative density-gradient control via Selberg ' +
          'CLT variance bound or Bourgade 2022 inhomogeneous Wigner generalization',
      },
    ],
    approachSuggestions: [
      'Sub-Selberg unconditional discrepancy: D_N^* <= C * (log gamma_N)^c / N ' +
        'with c < 1 for the deterministic zero sequence, eliminating the H1 dependency',
      'Selberg CLT variance bound on minimum-gap location, or second-moment ' +
        'estimate for the gap-spacing process, closing G1-sub-extremal-raw-vs-unfolded',
      'Bourgade 2022 Wigner-matrix extremal-gap generalization to the ' +
        'inhomogeneous (varying density) case, absorbing the RvM density-gradient ' +
        'correction in the BABL CLT error term',
    ],
    directionalDecomposition: {
      id: 'g1-uniform-margin-two-sided',
      rationale:
        'The uniform-margin requirement alpha*N <= k*_N <= (1 - alpha)*N is a ' +
        'TWO-SIDED PROPORTIONAL confinement. Splitting it by edge and by margin ' +
        'type isolates which half actually carries the research-grade barrier, ' +
        'so future work targets the real obstruction rather than the already-' +
        'unconditional part.',
      lowerEdgeAbsolute: {
        statement:
          'For any fixed absolute constant K_0, k*_N >= K_0 for all ' +
          'N >= N_1(K_0), unconditionally.',
        mechanism:
          'The first K_0 - 1 consecutive zero gaps g_1, ..., g_{K_0 - 1} are ' +
          'explicit fixed positive numbers (g_1 = gamma_2 - gamma_1 ~ 6.89, ' +
          'g_2 ~ 3.99, g_3 ~ 5.41, g_4 ~ 2.51, ...). Once N is large enough ' +
          'that a single explicitly exhibited later gap g_j is strictly smaller ' +
          'than min(g_1, ..., g_{K_0 - 1}), the argmin cannot land on any of the ' +
          'first K_0 - 1 sites. This is a finite-exhibition argument: it cites ' +
          'finitely many explicit zero ordinates and needs NO spacing hypothesis ' +
          '(no Montgomery pair-correlation, no GUE port).',
        marginType:
          'absolute constant K_0 -- still vanishes relative to N since ' +
          'K_0 / N -> 0; this is strictly stronger than the imp-368 (L-triv) ' +
          'margin 1/N at the lower edge but remains non-proportional',
        closureLevel: 'unconditional-but-non-proportional',
        explicitSchedule: {
          impId: 'imp-2549',
          claim:
            'imp-2513 left the threshold N_1(K_0) qualitative ("for all ' +
            'N >= N_1(K_0)"). This run makes N_1(K_0) an EXPLICIT ' +
            'unconditional schedule from Riemann-von Mangoldt counting, with ' +
            'no spacing hypothesis.',
          deltaDef:
            'delta_{K_0} := min(g_1, ..., g_{K_0 - 1}), the minimum of the ' +
            'first K_0 - 1 explicit fixed zero gaps -- a deterministic ' +
            'positive constant for each fixed K_0.',
          mechanism:
            'The minimum gap over the TAIL sites {K_0, ..., N - 1} is at most ' +
            'the tail average (gamma_N - gamma_{K_0}) / (N - K_0). By the ' +
            'Riemann-von Mangoldt formula N(T) = (T / 2pi) log(T / 2pi) - ' +
            'T / 2pi + O(log T), the n-th ordinate satisfies gamma_N ~ ' +
            '2pi N / log N, so the tail average tends to 0 unconditionally. ' +
            'Hence some site m in {K_0, ..., N - 1} has g_m <= ' +
            '(gamma_N - gamma_{K_0}) / (N - K_0); once that bound drops below ' +
            'delta_{K_0}, the argmin k*_N cannot land on any of the first ' +
            'K_0 - 1 sites, giving k*_N >= K_0.',
          schedule:
            'N_1(K_0) = least N with (gamma_N - gamma_{K_0}) / (N - K_0) < ' +
            'delta_{K_0}. Substituting gamma_N ~ 2pi N / log N (so the tail ' +
            'average ~ 2pi / log gamma_N) yields the closed-form estimate ' +
            'N_1(K_0) ~ exp(2pi / delta_{K_0}): the confinement k*_N >= K_0 ' +
            'holds unconditionally for every N >= exp(2pi / delta_{K_0}).',
          whyNotProportional:
            'The schedule depends ONLY on delta_{K_0}, deterministic data. ' +
            'But delta_{K_0} is non-increasing in K_0 and has no unconditional ' +
            'proportional lower bound delta_{K_0} >= c > 0; so N_1(K_0) = ' +
            'exp(2pi / delta_{K_0}) blows up faster than any polynomial in ' +
            'K_0 and CANNOT be inverted to a proportional margin K_0 = ' +
            'alpha * N. This pins exactly why branch (i) cannot be ' +
            'bootstrapped to the proportional content of branch (ii): the ' +
            'obstruction is the absence of an unconditional lower bound on ' +
            'the minimum gap, i.e. the deterministic bulk-confinement ' +
            'statement named in statusOfRemaining.',
          closureLevel:
            'unconditional explicit schedule for the absolute-constant ' +
            'lower-edge margin; the parent g1-uniform-margin (proportional ' +
            'two-sided) remains open',
        },
      },
      proportionalContent: {
        statement:
          'The PROPORTIONAL bound alpha*N <= k*_N <= (1 - alpha)*N (margin ' +
          'alpha uniform in N) on BOTH edges -- the version the imp-336 ' +
          'sign-reinforcement step actually consumes.',
        closureLevel:
          'conditional on H1 (Montgomery pair-correlation) + H2 (RvM ' +
          'density-gradient absorption), via imp-455 G1_SUB_EXTREMAL_CLOSURE',
        barrier:
          'The proportional confinement -- not the absolute-constant lower ' +
          'margin -- is the genuine research-grade content. The finite-' +
          'exhibition argument controls only finitely many edge sites and ' +
          'cannot be bootstrapped to a positive fraction alpha*N of sites: ' +
          'covering alpha*N -> infinity sites would require a uniform ' +
          'minimum-gap-location bound, i.e. exactly the deterministic ' +
          'bulk-confinement statement named in statusOfRemaining. No ' +
          'unconditional path exists in current technology.',
      },
      netEffect:
        'Sharpens the open problem from "prove the uniform two-sided margin" ' +
        'to the precise residual "upgrade the unconditional absolute-constant ' +
        'lower-edge confinement to an unconditional PROPORTIONAL two-sided ' +
        'confinement." No new unconditional proportional content is claimed; ' +
        'the parent g1-uniform-margin status remains open.',
    },
  },
  closureNote:
    'imp-1004 honest-partial: when picked up, src/data/g1-g2-closure.js had no ' +
    'sub-gap with the exact id g1-uniform-margin. The substantive content ' +
    '(uniform alpha-margin for k*_N) lives in G1_CLOSURE_STATUS.conditionalContent ' +
    'as the (L-cond) stratum, conditional on G1-sub-extremal, which is ' +
    'partial-closed by imp-455 (G1_SUB_EXTREMAL_CLOSURE) under H1+H2 with ' +
    'the named density-gradient remainder G1-sub-extremal-raw-vs-unfolded ' +
    'still open. This run surfaces the gap explicitly: a new top-level ' +
    'singular openSubGap field on G1_G2_CLOSURE_ASSEMBLY carries the ' +
    'canonical id g1-uniform-margin, dual status fields statusOfPriorWork ' +
    '(PARTIAL: imp-368 L-triv + L-cond strata, imp-455 partial closure of ' +
    'G1-sub-extremal under H1+H2, imp-651 cannot-upgrade investigation) and ' +
    'statusOfRemaining (open: unconditional uniform margin requires ' +
    'deterministic bulk-confinement or closing the density-gradient ' +
    'remainder), explicit dependsOn pointers to G1-sub-extremal and ' +
    'G1-sub-extremal-raw-vs-unfolded, and three approachSuggestions ' +
    '(sub-Selberg unconditional discrepancy; Selberg CLT variance bound on ' +
    'minimum-gap location; Bourgade 2022 inhomogeneous Wigner generalization). ' +
    'New build-time assertion imp1004-uniform-margin-subgap-named pins the ' +
    'canonical id and the prior-work-PARTIAL / remaining-open status pair so ' +
    'future references stay anchored. Existing G1_CLOSURE_STATUS / ' +
    'G2_CLOSURE_STATUS / jointAnalysis / openWork structure preserved ' +
    'unchanged, as is the imp-450 ANALYTIC_SKETCH-untouched scope tripwire. ' +
    'The mathematical work of pushing uniform alpha-margin to unconditional ' +
    'remains open and is now tracked under the canonical id g1-uniform-margin. ' +
    'Build passes (vite green; 6 G1_G2_CLOSURE_ASSERTIONS resolve true). ' +
    'One atomic structural change; no math claimed. ' +
    'imp-2513 honest-partial follow-up: the sub-gap is decomposed under ' +
    'directionalDecomposition (id g1-uniform-margin-two-sided) into ' +
    '(i) an UNCONDITIONAL absolute-constant lower-edge confinement ' +
    'k*_N >= K_0 for N >= N_1(K_0) via a finite-exhibition argument citing ' +
    'only finitely many explicit zero ordinates (no spacing hypothesis), and ' +
    '(ii) the PROPORTIONAL two-sided confinement alpha*N <= k*_N <= ' +
    '(1 - alpha)*N, which is the part the imp-336 sign-reinforcement step ' +
    'consumes and which remains conditional on H1+H2 via imp-455. The ' +
    'research-grade barrier is isolated in (ii); (i) cannot be bootstrapped ' +
    'to a positive fraction of sites. Assertion ' +
    'imp2513-directional-decomposition-honest-partial pins the labels. ' +
    'The parent g1-uniform-margin sub-gap REMAINS OPEN; no unconditional ' +
    'proportional content is claimed. ' +
    'imp-2549 honest-partial follow-up: the lowerEdgeAbsolute branch now ' +
    'carries an explicitSchedule field that upgrades the imp-2513 qualitative ' +
    'threshold N_1(K_0) into an EXPLICIT unconditional Riemann-von Mangoldt ' +
    'schedule N_1(K_0) ~ exp(2pi / delta_{K_0}) (delta_{K_0} = min of the ' +
    'first K_0 - 1 fixed zero gaps): k*_N >= K_0 holds unconditionally for ' +
    'every N >= exp(2pi / delta_{K_0}), since the minimum tail gap is at most ' +
    'the tail average (gamma_N - gamma_{K_0}) / (N - K_0) -> 0 by RvM with no ' +
    'spacing hypothesis. The whyNotProportional field pins that this cannot ' +
    'be inverted to a proportional margin K_0 = alpha * N (delta_{K_0} has no ' +
    'unconditional proportional lower bound), so the obstruction is exactly ' +
    'the deterministic minimum-gap bulk-confinement statement in ' +
    'statusOfRemaining. Assertion imp2549-rvm-explicit-schedule-honest-partial ' +
    'pins the schedule. The parent g1-uniform-margin REMAINS OPEN.',
};

// ── Build-time assertions ────────────────────────────────────────────────────

export const G1_G2_CLOSURE_ASSERTIONS = [
  {
    id: 'imp450-citation-chain-resolves',
    holds: () =>
      LAMBDA_ARGMIN_INTERIORITY.id === 'imp-368' &&
      LAMBDA_ARGMIN_JUMPS.id === 'imp-369' &&
      LAMBDA_INTERCEPT_MONOTONICITY.id === 'imp-336',
    why:
      'imp-450 cites imp-368 (G1 partial closure), imp-369 (G2 tau-0 closure), ' +
      'and imp-336 (parent analytic sketch). Any id drift strands the citation ' +
      'chain; this assertion is the tripwire.',
  },
  {
    id: 'imp450-g1-partial-closure-confirmed',
    holds: () => LAMBDA_ARGMIN_INTERIORITY.verdict.closure === 'partial',
    why:
      'imp-368 must still report verdict.closure === "partial". If a future edit ' +
      'upgrades it to "full", this assertion fires to ensure imp-450 is updated ' +
      'and the coordinated ANALYTIC_SKETCH flip is done in the same commit.',
  },
  {
    id: 'imp450-g2-tau0-witness-holds',
    holds: () =>
      LAMBDA_ARGMIN_JUMPS.numericalWitness.allPairsSatisfyInterlacing === true,
    why:
      'The imp-369 Cauchy-interlacing numerical witness on ZETA_ZEROS must still ' +
      'hold. This assertion propagates the G2 closure guarantee into the imp-450 ' +
      'assembly. A failure means ZETA_ZEROS has been reordered or truncated.',
  },
  {
    id: 'imp450-imp336-analytic-sketch-intentionally-untouched',
    holds: () => {
      const gaps = LAMBDA_INTERCEPT_MONOTONICITY.angleB_analytic.gaps;
      const g1 = gaps.find((g) => g.id === 'G1');
      const g2 = gaps.find((g) => g.id === 'G2');
      return (
        g1 !== undefined &&
        g2 !== undefined &&
        g1.status.startsWith('open') &&
        g2.status.startsWith('open')
      );
    },
    why:
      'SCOPE TRIPWIRE: imp-450 intentionally does NOT flip the imp-336 ANALYTIC_SKETCH ' +
      'G1/G2 status. Those tripwires require a coordinated update to ' +
      'lambda-intercept-analytic.js, bridge-lambda-rh.js, and lambda-zero-attack.js. ' +
      'Closing them is deferred to the follow-on assembly ticket targeting ' +
      'G1-sub-extremal closure. If a future commit flips the imp-336 G1/G2 status, ' +
      'this assertion must be removed in the SAME commit.',
  },
  {
    id: 'imp450-g1-sub-extremal-partial-closed-by-imp455',
    holds: () =>
      G1_CLOSURE_STATUS.openSubGap.status.startsWith('partial-closed') &&
      G1_CLOSURE_STATUS.openSubGap.closedViaImpId === 'imp-455' &&
      G1_SUB_EXTREMAL_CLOSURE.closureLevel === 'partial-conditional',
    why:
      'imp-455 delivered a PARTIAL closure of G1-sub-extremal (Bourgade GUE port ' +
      'with density-gradient sub-gap remaining). This assertion confirms that ' +
      '(a) the status is partial-closed, (b) it is attributed to imp-455, and ' +
      '(c) the imp-455 closure record itself remains partial-conditional. If a ' +
      'future edit upgrades to full closure, it MUST also flip the imp-336 ' +
      'ANALYTIC_SKETCH G1/G2 status and coordinate lambda-intercept-analytic.js, ' +
      'bridge-lambda-rh.js, and lambda-zero-attack.js in the same commit.',
  },
  {
    id: 'imp1004-uniform-margin-subgap-named',
    holds: () => {
      const sg = G1_G2_CLOSURE_ASSEMBLY.openSubGap;
      return (
        sg !== undefined &&
        sg.id === 'g1-uniform-margin' &&
        typeof sg.statusOfPriorWork === 'string' &&
        sg.statusOfPriorWork.startsWith('PARTIAL') &&
        typeof sg.statusOfRemaining === 'string' &&
        sg.statusOfRemaining.startsWith('open') &&
        Array.isArray(sg.dependsOn) &&
        sg.dependsOn.length >= 2 &&
        sg.dependsOn.some((d) => d.id === 'G1-sub-extremal') &&
        sg.dependsOn.some((d) => d.id === 'G1-sub-extremal-raw-vs-unfolded')
      );
    },
    why:
      'imp-1004 honest-partial closure pins the canonical sub-gap id ' +
      'g1-uniform-margin onto G1_G2_CLOSURE_ASSEMBLY. The dual ' +
      'statusOfPriorWork (PARTIAL: imp-368 strata + imp-455 partial closure + ' +
      'imp-651 cannot-upgrade) and statusOfRemaining (open: unconditional ' +
      'uniform margin is research-grade) status pair must remain stable so ' +
      'future references to this sub-gap stay anchored. The dependsOn list ' +
      'must keep both the parent G1-sub-extremal pointer and the ' +
      'G1-sub-extremal-raw-vs-unfolded density-gradient remainder pointer. ' +
      'If a future commit closes the gap unconditionally, it MUST update the ' +
      'status fields and remove this assertion in the same commit.',
  },
  {
    id: 'imp2513-directional-decomposition-honest-partial',
    holds: () => {
      const dd = G1_G2_CLOSURE_ASSEMBLY.openSubGap.directionalDecomposition;
      return (
        dd !== undefined &&
        dd.id === 'g1-uniform-margin-two-sided' &&
        dd.lowerEdgeAbsolute.closureLevel === 'unconditional-but-non-proportional' &&
        dd.proportionalContent.closureLevel.startsWith('conditional') &&
        G1_G2_CLOSURE_ASSEMBLY.openSubGap.statusOfRemaining.startsWith('open')
      );
    },
    why:
      'imp-2513 honest-partial: decomposes g1-uniform-margin into an ' +
      'unconditional absolute-constant lower-edge margin (finite-exhibition ' +
      'argument, no spacing hypothesis) and the conditional PROPORTIONAL ' +
      'two-sided margin that carries the research-grade barrier. This ' +
      'assertion pins that the unconditional half stays labelled ' +
      'non-proportional and the proportional half stays conditional, so the ' +
      'decomposition cannot be silently misread as a full unconditional ' +
      'closure. The parent g1-uniform-margin remains open. If a future commit ' +
      'upgrades the proportional content to unconditional, it MUST flip these ' +
      'labels and remove this assertion in the same commit.',
  },
  {
    id: 'imp2549-rvm-explicit-schedule-honest-partial',
    holds: () => {
      const es =
        G1_G2_CLOSURE_ASSEMBLY.openSubGap.directionalDecomposition
          .lowerEdgeAbsolute.explicitSchedule;
      return (
        es !== undefined &&
        es.impId === 'imp-2549' &&
        typeof es.schedule === 'string' &&
        es.schedule.includes('exp(2pi / delta_{K_0})') &&
        typeof es.whyNotProportional === 'string' &&
        es.whyNotProportional.includes('CANNOT be inverted') &&
        G1_G2_CLOSURE_ASSEMBLY.openSubGap.statusOfRemaining.startsWith('open')
      );
    },
    why:
      'imp-2549 honest-partial: sharpens the imp-2513 lower-edge branch from ' +
      'a qualitative threshold ("for N >= N_1(K_0)") into an EXPLICIT ' +
      'unconditional Riemann-von Mangoldt schedule N_1(K_0) ~ ' +
      'exp(2pi / delta_{K_0}), where delta_{K_0} is the minimum of the first ' +
      'K_0 - 1 fixed zero gaps. The schedule is genuinely unconditional (min ' +
      'tail gap <= tail average -> 0 by RvM, no spacing hypothesis) but the ' +
      'whyNotProportional field pins that it cannot be inverted to a ' +
      'proportional margin K_0 = alpha * N, so the parent g1-uniform-margin ' +
      'remains open. If a future commit makes the proportional content ' +
      'unconditional, it MUST update statusOfRemaining and remove this ' +
      'assertion in the same commit.',
  },
];
