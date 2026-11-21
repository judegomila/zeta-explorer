/**
 * @module imp-97636-route2-kbig-truncation-tail-cohort-index
 * @fileoverview imp-97636 -- META cross-reference index note grouping the Route-2 Krein-Lehmann
 *   lambda_2-lower-bound Kbig-truncation-tail cohort into one discoverable thread: the direct-build
 *   chain imp-97482 -> imp-97513 -> imp-97538 (which extends the Kbig reproducing-kernel build and
 *   tightens the bound's upper edge while its delta-ratio keeps RISING instead of plateauing) and
 *   the two diagnosis leaves imp-97582 (tr(A2) trace-limit named-gap) and imp-97600 (floor-spread
 *   decomposition) that independently locate the SAME unresolved K-truncation tail-model ambiguity
 *   inside that chain's residual bracket. Index/meta only; establishes nothing new; changes no
 *   bound; NO QED.
 *
 *   THREAD A -- the direct Kbig-build chain (tightens the upper edge, never plateaus).
 *     imp-97482 -- builds the direct A2 reproducing-kernel matrix at Kbig in {140,180,220,260},
 *       confirming the imp-97455 finite (not divergent) floor and narrowing its bracket to
 *       [-313.8, -308.7] (geometric-tail -309.8 vs a 10-point power-saturation refit -313.756).
 *     imp-97513 -- extends the same build to Kbig in {420,460,500}: bound tightens to -310.375499,
 *       but the successive delta ratios KEEP RISING (0.730 -> 0.752 -> 0.771) past the 0.54
 *       geometric rate the imp-97482 tail assumed, deepening the corrected-tail estimate to ~-310.75
 *       while the power-saturation deep end -313.756 stays untouched.
 *     imp-97538 -- extends further to Kbig in {560,640,720}: bound tightens to -310.692227, and the
 *       ratio rises again (80-step ratio 0.687, 40-step-equivalent ~0.829), pushing the
 *       corrected-tail estimate to ~-310.87. The bracket after Thread A is
 *       [-313.756, -310.692227] (spread ~3.06), with tr(A2) itself converging cleanly toward
 *       ~4819.1M (a figure imp-97538 NAMES but does not derive).
 *
 *   THREAD B -- the diagnosis leaves (locate what the Thread-A residual spread actually is).
 *     imp-97582 -- extrapolates the Thread-A tr(A2) ladder (geometric-tail, Aitken delta^2, and an
 *       algebraic-tail control) and finds all three cluster tightly at ~4818.77M (relative ~1.7e-6)
 *       -- but that pinned limit sits ~0.335M BELOW the imp-97538 named ~4819.1M, a gap unreachable
 *       under the measured 0.688 ratio (would need ratio ~0.986). Names the residual
 *       IMP97582_TRACE_LIMIT_NAMED_GAP_UNRESOLVED and shows the trace is far better-converged
 *       (~1e-6) than the lambda_2 floor itself (~1e-2) -- the floor spread is NOT a trace-ladder
 *       problem.
 *     imp-97600 -- decomposes the Thread-A -313.756/-310.692227 bracket spread (3.06) by source and
 *       finds it is 94.4% K-truncation TAIL-MODEL disagreement (geometric/corrected-tail ~-310.87 vs
 *       the power-saturation refit -313.756), 5.6% honest geometric tail past Kbig=720, and 0% from
 *       quadrature discretization or enclosure arithmetic. Explicitly identifies this as the SAME
 *       geometric-vs-slow-algebraic tail ambiguity imp-97582 found on tr(A2), amplified in the floor
 *       because nu_max is a single extremal eigenvalue rather than the full spectral sum.
 *
 *   WHY GROUP THESE (not re-derive). Read separately, Thread A looks like a routine "extend the Kbig
 *   sweep, bound gets tighter" ladder and Thread B looks like two unrelated diagnostic side-checks
 *   (one on the trace, one on the bound). Grouped, Thread B's two leaves are BOTH answers to the same
 *   question Thread A leaves open at every extension -- "why does the delta ratio keep rising instead
 *   of settling at the assumed geometric rate" -- and they agree: it is a tail-MODEL choice
 *   (geometric vs. algebraic decay), not a numerical-quality problem, and it affects the single
 *   extremal eigenvalue nu_max far more than the well-behaved trace sum tr(A2). This index bakes that
 *   correspondence so a future scout does not re-open "is the spread a precision bug" (imp-97600
 *   already ruled out discretization and arithmetic at 0%) or re-extrapolate tr(A2) from scratch
 *   (imp-97582 already pinned it to ~4818.77M, relative 1.7e-6).
 *
 *   WHAT STAYS OPEN (at the time of this cohort). The Kbig->infinity floor is UNPINNED: the
 *   diagnosis-narrowed honest bracket is [~-310.87, -310.692227] under the measured local ratio,
 *   with the power-saturation deep end -313.756 flagged as an over-extrapolation (needs ratio ~0.975
 *   vs the measured 0.687-0.829); full pinning needs the Kbig >= 800 build (named sub-gap
 *   IMP97600_TAIL_MODEL_UNDECIDED_UNTIL_KBIG800) to decide geometric vs. slow-algebraic. Either way
 *   the floor stays four orders of magnitude below the -310.692227-to-0.581059 requirement for the
 *   m=1 enclosure to be usable at 2a=ln3. No bound on Lambda moves; interval-rigorous reach stays
 *   2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97482-krein-route2-kbig-direct-projector-floor.js (Thread A origin; Kbig 140-260; bracket [-313.8,-308.7])
 * @see imp-97513-krein-route2-kbig420-500-deep-floor.js (Thread A; Kbig 420-500; ratio rising 0.730->0.771)
 * @see imp-97538-krein-route2-kbig560-720-deep-floor.js (Thread A; Kbig 560-720; ratio rising further ~0.829; bracket [-313.756,-310.692227])
 * @see imp-97582-tra2-ladder-extrapolation.js (Thread B; tr(A2) limit ~4818.77M; names the gap to imp-97538's ~4819.1M)
 * @see imp-97600-lambda2-floor-spread-decomposition.js (Thread B; 94.4% of the floor spread is the same tail-model disagreement)
 *
 * Ticket: imp-97636 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const ROUTE2_KBIG_MAX_BUILT = 720;

const ROUTE2_KBIG_TRUNCATION_TAIL_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97482',
    thread: 'A (direct Kbig-build chain)',
    role: 'origin build: Kbig in {140,180,220,260}; confirms finite floor, first bracket',
    result:
      'Confirms the imp-97455 floor is finite (not divergent); direct Kbig=260 bound -308.745199; ' +
      'geometric-tail extrapolation ~-309.8 vs power-saturation refit ~-313.756 -> bracket ' +
      '[-313.8, -308.7]. Names the tr(A2) limit ~4819.1M.',
  }),
  Object.freeze({
    id: 'imp-97513',
    thread: 'A (direct Kbig-build chain)',
    role: 'extends the build to Kbig in {420,460,500}; ratio keeps rising, does not plateau',
    result:
      'Direct Kbig=500 bound -310.375499 (tightens imp-97482 edge); successive delta ratios rise ' +
      '0.730 -> 0.752 -> 0.771, NOT settling at the assumed geometric ~0.54; corrected-tail estimate ' +
      'deepens to ~-310.75; power-saturation deep end -313.756 unchanged.',
  }),
  Object.freeze({
    id: 'imp-97538',
    thread: 'A (direct Kbig-build chain)',
    role: 'extends the build to Kbig in {560,640,720}; ratio rises again; final Thread-A bracket',
    result:
      'Direct Kbig=720 bound -310.692227 (rigorous upper edge); 80-step ratio 0.687222 ' +
      '(40-step-equivalent ~0.829), continuing the rising trend; corrected-tail estimate ~-310.87; ' +
      'bracket after Thread A: [-313.756, -310.692227] (spread ~3.06).',
  }),
  Object.freeze({
    id: 'imp-97582',
    thread: 'B (diagnosis leaves)',
    role: 'extrapolates the tr(A2) trace ladder; finds it far better-pinned than the lambda_2 floor',
    result:
      'Geometric-tail, Aitken delta^2, and an algebraic-tail control all cluster at ~4818.77M ' +
      '(relative spread ~1.7e-6) -- but that sits ~0.335M below the imp-97538 named ~4819.1M, ' +
      'unreachable under the measured 0.688 ratio (needs ~0.986). tr(A2) is pinned ~1e4x tighter ' +
      'than the lambda_2 floor; the floor spread is NOT a trace-ladder problem.',
  }),
  Object.freeze({
    id: 'imp-97600',
    thread: 'B (diagnosis leaves)',
    role: 'decomposes the Thread-A bracket spread by source; identifies the dominant contributor',
    result:
      'The 3.06 bracket spread decomposes 94.4% into K-truncation TAIL-MODEL disagreement (geometric ' +
      '~-310.87 vs power-saturation -313.756), 5.6% honest geometric tail past Kbig=720, 0% from ' +
      'quadrature discretization, 0% from enclosure arithmetic -- the SAME geometric-vs-algebraic ' +
      'ambiguity imp-97582 found on tr(A2), amplified because nu_max is a single extremal eigenvalue.',
  }),
]);

export const IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX = Object.freeze({
  id: 'imp-97636',
  proofSection: 'S-frontier',
  cohort: ROUTE2_KBIG_TRUNCATION_TAIL_COHORT,
  kbigMaxBuilt: ROUTE2_KBIG_MAX_BUILT,
  threadASignal:
    'imp-97482 opens the direct Kbig build and confirms a finite floor; imp-97513 and imp-97538 ' +
    'extend it in two more steps, each time tightening the rigorous upper edge but finding the ' +
    'delta ratio keeps RISING (0.730 -> 0.771 -> ~0.829) rather than settling at the assumed ' +
    'geometric ~0.54, leaving the bracket [-313.756, -310.692227] unpinned at the deep end.',
  threadBSignal:
    'imp-97582 shows the tr(A2) trace ladder itself is pinned to ~4818.77M at relative ~1.7e-6 ' +
    '(far tighter than the floor) but disagrees with the imp-97538 named ~4819.1M by an amount no ' +
    'geometric tail can close; imp-97600 shows the SAME tail-model disagreement is responsible for ' +
    '94.4% of the Thread-A floor-bracket spread, with discretization and arithmetic contributing 0%.',
  question:
    'Read separately, Thread A (extend-and-tighten Kbig sweeps) and Thread B (a trace-limit check ' +
    'and a spread-decomposition check) look like an ordinary numerical ladder plus two unrelated ' +
    'sanity checks. Grouped, do they converge on one diagnosis -- that the residual uncertainty in ' +
    'both the trace and the lambda_2 floor is the SAME undecided geometric-vs-slow-algebraic ' +
    'K-truncation tail model -- and does resolving it (via the named Kbig>=800 build) close the ' +
    'floor bracket, or only narrow it further?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Thread A\'s three-step direct build tightens the ' +
    'Route-2 lambda_2 lower-bound floor\'s rigorous upper edge to -310.692227 but never plateaus ' +
    'the delta ratio, leaving the deep end open. Thread B\'s two diagnosis leaves independently ' +
    'locate the SAME cause: an undecided geometric-vs-algebraic K-truncation tail model, which ' +
    'pins tr(A2) tightly (~1.7e-6) but leaves the single extremal eigenvalue nu_max -- and hence ' +
    'the floor -- unpinned at the ~1e-2 relative level (94.4% tail-model disagreement per ' +
    'imp-97600). No bound on Lambda moves; the floor stays four orders below the m=1-enclosure ' +
    'usability threshold; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed; RH open; ' +
    'NO QED.',
  citation:
    'imp-97482 (origin Kbig build, first bracket); imp-97513 (Kbig 420-500, ratio rising); ' +
    'imp-97538 (Kbig 560-720, ratio rising further, final Thread-A bracket); imp-97582 (tr(A2) ' +
    'trace-limit extrapolation, named-gap unresolved); imp-97600 (floor-spread decomposition, ' +
    '94.4% tail-model disagreement).',
});

export default IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97636-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping the five named tickets across both threads; ' +
      'a missing member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97482', 'imp-97513', 'imp-97538', 'imp-97582', 'imp-97600'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp97636-both-threads-present',
    why: 'The index exists to separate the direct Kbig-build chain (Thread A) from the diagnosis ' +
      'leaves that locate the residual spread\'s source (Thread B); both must be labeled so a ' +
      'reader does not conflate "extend the build" tickets with "diagnose the spread" tickets.',
    holds: () => {
      const threads = IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX.cohort.map((c) => c.thread);
      return (
        threads.filter((t) => t.startsWith('A')).length === 3 &&
        threads.filter((t) => t.startsWith('B')).length === 2
      );
    },
  },
  {
    id: 'imp97636-kbig-max-and-signals-present',
    why: 'The deepest built Kbig anchors the chain and both thread signals summarize what each ' +
      'thread establishes; a missing or wrong value would silently mis-state how far the direct ' +
      'build reaches.',
    holds: () => {
      const idx = IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX;
      return (
        idx.kbigMaxBuilt === 720 &&
        typeof idx.threadASignal === 'string' &&
        idx.threadASignal.length > 0 &&
        typeof idx.threadBSignal === 'string' &&
        idx.threadBSignal.length > 0
      );
    },
  },
  {
    id: 'imp97636-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97636_ROUTE2_KBIG_TRUNCATION_TAIL_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97636-route2-kbig-truncation-tail-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
