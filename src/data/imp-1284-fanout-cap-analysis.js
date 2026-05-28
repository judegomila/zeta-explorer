/**
 * @module imp-1284-fanout-cap-analysis
 * @fileoverview imp-1284 -- Re-evaluation of the parallel-subagent fanout
 *   cap set by imp-1172 (currently HARD_CEILING = 8 in
 *   scripts/dispatch-subagent-worktree.mjs:100).
 *
 *   SCOPE
 *   -----
 *   imp-1172 shipped detectMaxParallel() which computes
 *     cap = max(1, min(floor(ncpu/2), floor(free_ram_gb/3), HARD_CEILING))
 *   with HARD_CEILING = 8. The "8" rationale at the time was "git/file-IO
 *   contention dominates past that" (see JSDoc lines 88-91 of
 *   dispatch-subagent-worktree.mjs).
 *
 *   Since imp-1172 shipped, the harness has gained:
 *     - imp-1143 worktree isolation -- each subagent has its own checkout,
 *       so the shared-file-write race is gone (10-15 concurrent subagents
 *       declared safe in the imp-1143 JSDoc lines 12-16).
 *     - imp-1194 pre-warmed worktree pool -- removes the ~2s/dispatch
 *       overhead, so a higher cap does not amplify dispatch latency.
 *     - imp-1171 + imp-1193 SSR pool -- parallel assertion sweep no longer
 *       gates on a single Vite SSR server.
 *     - 4.7 -> 4.8 Claude Code upgrade (the ticket description hypothesis
 *       of "lower latency per call" is UNVERIFIED -- no measurement yet).
 *
 *   This artifact answers the four ticket questions ((a)-(d) in the imp-1284
 *   description) with the evidence available from the past ~10 days of logs.
 *
 *   HONEST SCOPE
 *   ------------
 *   This file is an EVIDENCE TABLE + RECOMMENDATION. It does NOT change the
 *   cap. The recommendation includes a patch text (as a string) and a
 *   measurement-before-raise gate. The orchestrator is the one who should
 *   apply the patch -- after weighing the recommendation against the
 *   honest-uncertainty signals catalogued below.
 *
 *   Source files referenced:
 *   - scripts/dispatch-subagent-worktree.mjs (cap location: line 100)
 *   - scripts/.channel-quota.json            (40 entries / 65-h window)
 *   - scripts/logs/run_*_2026-05-*.log       (rate-limit evidence, ~11k logs)
 *   - src/data/improvement-queue.js          (imp-1172 + imp-1284 metadata)
 *
 *   Ticket: imp-1284 (meta-harness, high, complete-as-analysis).
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. CURRENT CAP LOCATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Where the cap lives. There is a single source-of-truth constant.
 *
 * @type {{ file: string, line: number, constant: string, value: number, formula: string }}
 */
const CAP_LOCATION = Object.freeze({
  file: 'scripts/dispatch-subagent-worktree.mjs',
  line: 100,
  constant: 'HARD_CEILING',
  value: 8,
  formula:
    'cap = max(1, min(floor(ncpu/2), floor(free_ram_gb/3), HARD_CEILING))',
  envOverride: 'SUBAGENT_MAX_PARALLEL',
  fallback: 3,
  rationaleQuotedFromImp1172:
    'hard ceiling of 8 because git/file-IO contention dominates past that',
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CURRENT HARDWARE MEASUREMENT (reference machine: this Mac, 2026-05-28)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Live values from this Mac at the time of analysis, used to determine
 * whether the HARD_CEILING is actually the binding term in the min() or
 * whether ncpu/2 or freeRamGb/3 binds first.
 *
 * @type {Readonly<object>}
 */
const REFERENCE_HARDWARE = Object.freeze({
  ncpu: 18,                          // sysctl -n hw.ncpu
  cpuCap: 9,                         // floor(18 / 2)
  freeRamGb: 56,                     // vm_stat: Pages free+inactive+speculative * 16384B / GB
  ramCap: 18,                        // floor(56 / 3)
  hardCeiling: 8,
  effectiveCap: 8,                   // min(9, 18, 8) = 8
  bindingTerm: 'HARD_CEILING',       // 8 < 9 (cpuCap) < 18 (ramCap)
  diskFreeGB: 1828,                  // df -H: 1995G - 138G used = 1828G free
  activeWorktreesNow: 61,            // ls .claude/worktrees/ | wc -l
  note:
    'On this machine HARD_CEILING binds before CPU or RAM. Raising the ' +
    'ceiling to 12 would give cap = min(9, 18, 12) = 9, which is CPU-bound. ' +
    'Raising to 16 would give cap = min(9, 18, 16) = 9, still CPU-bound. ' +
    'So the practical near-term ceiling on this machine is 9, not 12 or 16, ' +
    'unless ncpu/2 is also relaxed -- which would risk starving the parent.',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. SATURATING-RESOURCE ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Table of candidate saturating resources with evidence from logs +
 * harness state, and the per-candidate verdict.
 *
 * Verdict values:
 *   binding              -- saturation observed at current cap.
 *   not-binding-evidence -- not observed to saturate, evidence cited.
 *   uncertain            -- no evidence either way; flagged for measurement.
 *
 * @type {ReadonlyArray<{
 *   resource: string,
 *   evidence: ReadonlyArray<string>,
 *   verdict: 'binding' | 'not-binding-evidence' | 'uncertain'
 * }>}
 */
const SATURATING_RESOURCE_TABLE = Object.freeze([
  {
    resource: 'api-channel-http-rate-limit',
    evidence: [
      'scripts/logs/ shows 115 RATE-LIMIT-DETECTED hits over ~10 days',
      '41 of those in the last week (2026-05-22 .. 2026-05-28)',
      '4 today (2026-05-28) on the api channel alone',
      'Recent api hit at run #429 with window in=6.4%, out=13.0% -- NOT ' +
        'quota-saturating; the limit is per-minute request count, not tokens',
      'Subscription/Sonnet/Haiku channels also hit rate-limit independently',
      'CRITICAL: ALL rate-limit incidents are SEQUENTIAL single-engine runs, ' +
        'NOT subagent fanout dispatches. The api channel and the subagent ' +
        'pool consume DIFFERENT quotas (api uses ANTHROPIC_API_KEY direct, ' +
        'subagents use the parent Claude Code session credentials).',
    ],
    verdict: 'not-binding-evidence',
  },
  {
    resource: 'parent-claude-code-session-concurrent-request-limit',
    evidence: [
      'Subagent calls go through the parent Claude Code session, so they ' +
        'count against the SAME concurrent-request budget as the parent.',
      'No direct measurement of this limit exists in scripts/logs/.',
      'No observed "parent session throttled" event in any past wave (cf. ' +
        'fanout-5, fanout-7, fanout-8 dispatches in recent weeks).',
      'Anthropic public docs (https://docs.anthropic.com/.../rate-limits) ' +
        'state per-org concurrent-request limits, but the per-Claude-Code ' +
        'session limit is undocumented at this date.',
      'UNCERTAINTY: cannot rule out that 12+ concurrent subagents would ' +
        'trip a per-session limit; this is the WEAKEST evidence link in ' +
        'the table.',
    ],
    verdict: 'uncertain',
  },
  {
    resource: 'local-cpu',
    evidence: [
      'sysctl -n hw.ncpu = 18 on reference machine',
      'cpuCap = floor(18 / 2) = 9 -- 1 above current HARD_CEILING',
      'A subagent is mostly I/O-bound (file reads, LLM calls); per-subagent ' +
        'CPU is typically <0.3 cores in steady state (estimate, not measured)',
      'Even at 9 subagents, parent + 9 * 0.3 = ~3 cores active, leaving ' +
        '~15 cores headroom',
      'No "system load" warnings in scripts/logs/ (zero grep hits for ' +
        '"system.*overloaded", "load average exceeded")',
    ],
    verdict: 'not-binding-evidence',
  },
  {
    resource: 'local-ram',
    evidence: [
      'vm_stat reports 56 GB free on reference machine',
      'ramCap = floor(56 / 3) = 18 -- 10 above current HARD_CEILING',
      'No OOM events grep-able in scripts/logs/ (zero hits for ' +
        '"out of memory", "ENOMEM", "OOM killed")',
      'A worktree checkout is ~600 MB (the repo working tree); 61 active ' +
        'worktrees at the moment of analysis (38 GB resident) and the ' +
        'machine reports 56 GB free -- so RAM is comfortable',
      'Each subagent process is small (<100 MB resident estimate)',
    ],
    verdict: 'not-binding-evidence',
  },
  {
    resource: 'disk-io-throughput',
    evidence: [
      'df -H reports 1828 GB free on /System/Volumes/Data',
      'No ENOSPC / "disk full" events in scripts/logs/',
      'Apple Silicon SSD random-IO is ~5 GB/s sequential; not a 5- to ' +
        '12-subagent bottleneck',
      'imp-1194 pre-warmed pool removed the ~2s per-dispatch git-fetch cost',
    ],
    verdict: 'not-binding-evidence',
  },
  {
    resource: 'file-locks-shared-queue-writes',
    evidence: [
      'This was the imp-1172 rationale for ceiling=8 ("git/file-IO ' +
        'contention dominates past that")',
      'imp-1143 (worktree isolation) was the FIX: each subagent edits ' +
        'its OWN copy of improvement-queue.js + IMPROVEMENTS.md; merge ' +
        'happens 3-way at the end',
      'imp-1143 JSDoc (lines 12-16) explicitly states "10-15 concurrent ' +
        'subagents become safe" with worktrees',
      'imp-1285 (in queue, pending) documents the only known shared-write ' +
        'race -- engine vs subagent on the SAME ticket, not subagent vs ' +
        'subagent. That race is orthogonal to the fanout cap.',
      'Recent merge logs (engines + subagents) show no merge-conflict ' +
        'failures attributable to fanout > 5',
    ],
    verdict: 'not-binding-evidence',
  },
  {
    resource: 'git-worktree-add-contention',
    evidence: [
      '61 active worktrees on disk right now; no errors',
      'imp-1194 pool eliminates per-dispatch git worktree add cost',
      'Git index lock (.git/index.lock) is per-worktree, not global, in ' +
        'modern git (>= 2.5 worktree HEADs)',
      'Anecdotal: no past failure logs naming "fatal: another git process"',
    ],
    verdict: 'not-binding-evidence',
  },
  {
    resource: 'network-bandwidth',
    evidence: [
      'Per-subagent network is dominated by LLM API streams, ~kbps each',
      '12 subagents * 100 kbps = 1.2 Mbps -- 4 orders of magnitude below ' +
        'home/office links',
      'No "timeout" cluster in scripts/logs/ correlated with fanout events',
    ],
    verdict: 'not-binding-evidence',
  },
]);

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECOMMENDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The recommendation is to raise HARD_CEILING from 8 to 10 (a +2 bump, NOT
 * +4 or +8) because:
 *
 *   1. The CPU-cap term in the min() is 9 on the reference machine, so even
 *      raising HARD_CEILING to 12 would only deliver cap=9 here (one extra
 *      slot, not three). Raising past 10 buys nothing on this hardware
 *      unless ncpu/2 is also relaxed -- which is a separate, riskier change.
 *
 *   2. The strongest piece of evidence FOR raising is that file-IO
 *      contention (imp-1172's original blocker) was fixed by imp-1143
 *      worktree isolation. imp-1143's own JSDoc cites "10-15 concurrent
 *      subagents become safe".
 *
 *   3. The strongest piece of evidence AGAINST raising aggressively is
 *      the parent-Claude-Code-session concurrent-request-limit, which is
 *      undocumented and unmeasured. A +2 bump from 8 to 10 is a 25%
 *      increase -- big enough to learn from, small enough that a single
 *      per-session throttle event is recoverable.
 *
 *   4. Past rate-limit incidents (115 in ~10 days) all came from
 *      SEQUENTIAL single-engine API calls, not from subagent fanout. So
 *      the rate-limit history is NOT evidence against raising the
 *      subagent cap. It IS evidence that the api channel hits its own
 *      limit easily -- but that is orthogonal.
 *
 *   5. The honest follow-up: after raising to 10, measure (peak parallel
 *      count, observed throttle events, any merge conflicts) for one full
 *      week before considering 12 or higher.
 *
 * @type {Readonly<{
 *   action: 'stay' | '+2' | '+4' | '+8',
 *   newCap: number,
 *   confidence: 'low' | 'medium' | 'high',
 *   followUp: string
 * }>}
 */
const RECOMMENDATION = Object.freeze({
  action: '+2',
  newCap: 10,
  confidence: 'medium',
  followUp:
    'After one week at HARD_CEILING=10, count (a) peak concurrent ' +
    'subagent count actually achieved, (b) any new throttle / 429 / ' +
    'merge-conflict events attributable to fanout. If (a) is hitting 10 ' +
    'consistently AND (b) is zero, file a follow-up ticket to raise to 12 ' +
    '(which on the reference machine still binds at cpuCap=9 -- so the ' +
    'next bump should be paired with relaxing the ncpu/2 term to ncpu*0.6 ' +
    'or ncpu*0.7).',
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE PATCH (verbatim, NOT applied)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Unified-diff-style patch for the orchestrator to apply manually after
 * weighing the recommendation. The change is a single constant.
 *
 * The patch deliberately also updates the JSDoc comment so a future
 * reader understands why the ceiling moved from 8 to 10.
 *
 * @type {string}
 */
const PATCH_TEXT = `--- a/scripts/dispatch-subagent-worktree.mjs
+++ b/scripts/dispatch-subagent-worktree.mjs
@@ -85,10 +85,15 @@
  * Replaces a hardcoded MAX_PARALLEL=5 in downstream fanout callers so the
  * same script bursts higher on a beefy laptop / cloud instance without
  * code changes.
  *
- * Formula: min(floor(ncpu / 2), floor(free_ram_gb / 3), 8)
+ * Formula: min(floor(ncpu / 2), floor(free_ram_gb / 3), 10)
  *   - /2 on CPU leaves headroom for the parent session + system processes.
  *   - /3 on RAM (GB) keeps each subagent under a 3GB working-set budget.
- *   - hard ceiling of 8 because git/file-IO contention dominates past that.
+ *   - hard ceiling of 10 (imp-1284, was 8 from imp-1172). imp-1143
+ *     worktree isolation removed the shared-file-write race that motivated
+ *     the imp-1172 ceiling=8. imp-1143 JSDoc declares 10-15 concurrent
+ *     subagents safe under worktrees. We pick 10 (not 12 or 15) because
+ *     (a) on an 18-core machine the cpuCap = floor(18/2) = 9 binds before
+ *     a ceiling of 12 ever activates, and (b) +2 is a measurable bump
+ *     small enough that one undocumented per-session throttle event is
+ *     recoverable. Re-measure peak parallel count + throttle events after
+ *     one week before considering 12.
  *
  * Env override SUBAGENT_MAX_PARALLEL=N short-circuits detection.
  * Falls back to 3 if any probe fails (safe default matching the old single-thread CI path).
@@ -97,7 +102,7 @@
  */
 export function detectMaxParallel({ silent = false } = {}) {
   const FALLBACK = 3;
-  const HARD_CEILING = 8;
+  const HARD_CEILING = 10;

   // 1. Env override wins
   const envRaw = process.env.SUBAGENT_MAX_PARALLEL;
`;

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTED MAIN OBJECT
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1284_FANOUT_CAP_ANALYSIS = Object.freeze({
  ticket: 'imp-1284',
  status: 'analysis-complete-patch-not-applied',
  predecessor: 'imp-1172',
  capLocation: CAP_LOCATION,
  referenceHardware: REFERENCE_HARDWARE,
  saturatingResourceTable: SATURATING_RESOURCE_TABLE,
  recommendation: RECOMMENDATION,
  patchText: PATCH_TEXT,
  evidenceSummary: Object.freeze({
    rateLimitsLogged10Days: 115,
    rateLimitsLogged7Days: 41,
    rateLimitsToday: 4,
    rateLimitsAttributableToFanout: 0,
    oomEvents: 0,
    diskFullEvents: 0,
    activeWorktreesAtAnalysis: 61,
    worktreeAddFailuresLogged: 0,
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. BUILD-TIME TRIPWIRES
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1284_FANOUT_CAP_ANALYSIS_ASSERTIONS = [
  {
    id: 'imp1284-cap-location-documented',
    holds: () =>
      typeof CAP_LOCATION.file === 'string' &&
      CAP_LOCATION.file === 'scripts/dispatch-subagent-worktree.mjs' &&
      typeof CAP_LOCATION.line === 'number' &&
      CAP_LOCATION.line === 100 &&
      CAP_LOCATION.constant === 'HARD_CEILING' &&
      CAP_LOCATION.value === 8,
    why:
      'The single source-of-truth constant for the subagent fanout cap must ' +
      'be documented as scripts/dispatch-subagent-worktree.mjs:100 ' +
      'HARD_CEILING = 8. If this drifts (file moves, line moves, constant ' +
      'renamed, or value changed without updating this file) the patch in ' +
      'PATCH_TEXT will no longer apply cleanly and the recommendation rots.',
  },

  {
    id: 'imp1284-saturating-resource-named-not-unknown',
    holds: () => {
      const allowed = new Set(['binding', 'not-binding-evidence', 'uncertain']);
      const bindingOrUncertain = SATURATING_RESOURCE_TABLE.filter(
        (row) => row.verdict === 'binding' || row.verdict === 'uncertain'
      );
      const verdictsAllowed = SATURATING_RESOURCE_TABLE.every((row) =>
        allowed.has(row.verdict)
      );
      // At least one resource MUST be named -- either binding now, or
      // uncertain (= named follow-up). Empty = ticket question unanswered.
      return verdictsAllowed && bindingOrUncertain.length >= 1;
    },
    why:
      'imp-1284 ticket question (b) explicitly asks which resource saturates ' +
      'first. The hard-rule in the ticket prohibits saying "unknown". Either ' +
      'the table must contain at least one verdict=binding row (the named ' +
      'binding resource), or at least one verdict=uncertain row (a named ' +
      'candidate flagged for measurement). The current table has the ' +
      'parent-Claude-Code-session-concurrent-request-limit row flagged ' +
      'uncertain, which satisfies the "named, not unknown" requirement.',
  },

  {
    id: 'imp1284-recommendation-in-permitted-set',
    holds: () => {
      const allowed = new Set(['stay', '+2', '+4', '+8']);
      return (
        allowed.has(RECOMMENDATION.action) &&
        typeof RECOMMENDATION.newCap === 'number' &&
        Number.isInteger(RECOMMENDATION.newCap) &&
        RECOMMENDATION.newCap >= 8 &&
        RECOMMENDATION.newCap <= 16
      );
    },
    why:
      'imp-1284 ticket constrains recommendation to {stay, +2, +4, +8}. The ' +
      'newCap value must be an integer in [8, 16] -- 8 = stay, 16 = +8. ' +
      'Anything outside drifts from the ticket scope.',
  },

  {
    id: 'imp1284-rationale-cites-at-least-two-evidence-rows',
    holds: () => {
      // The recommendation rationale (JSDoc above RECOMMENDATION) names
      // five reasons. Encoded structurally: the SATURATING_RESOURCE_TABLE
      // must have at least 2 rows with non-empty evidence arrays of >= 3
      // evidence items each, so the recommendation has > 6 evidence points
      // it can cite.
      const rowsWithSubstantialEvidence = SATURATING_RESOURCE_TABLE.filter(
        (row) => Array.isArray(row.evidence) && row.evidence.length >= 3
      );
      return rowsWithSubstantialEvidence.length >= 2;
    },
    why:
      'imp-1284 hard-rule requires the rationale to reference at least 2 ' +
      'pieces of evidence. Structurally we enforce that >= 2 saturating- ' +
      'resource rows each carry >= 3 evidence items, giving the ' +
      'recommendation > 6 evidence points to draw from.',
  },

  {
    id: 'imp1284-patch-is-syntactically-valid-diff',
    holds: () => {
      if (typeof PATCH_TEXT !== 'string') return false;
      if (PATCH_TEXT.length < 100) return false;
      // Must have a unified-diff header.
      if (!PATCH_TEXT.startsWith('--- a/scripts/dispatch-subagent-worktree.mjs\n')) return false;
      if (!PATCH_TEXT.includes('+++ b/scripts/dispatch-subagent-worktree.mjs\n')) return false;
      // Must change the HARD_CEILING constant specifically.
      if (!PATCH_TEXT.includes('-  const HARD_CEILING = 8;')) return false;
      if (!PATCH_TEXT.includes(`+  const HARD_CEILING = ${RECOMMENDATION.newCap};`)) return false;
      // Must contain at least one @@ hunk header.
      if (!/@@ -\d+,\d+ \+\d+,\d+ @@/.test(PATCH_TEXT)) return false;
      return true;
    },
    why:
      'The patch text must be a syntactically valid unified diff so that ' +
      '`git apply` would accept it as input. Structural checks: file ' +
      'headers, at least one @@ hunk header, and the specific HARD_CEILING ' +
      'before/after lines matching the recommended newCap. If any check ' +
      'fails the patch is not directly applicable and the recommendation ' +
      'rots silently.',
  },

  {
    id: 'imp1284-imp-1172-cross-referenced',
    holds: () => {
      if (CAP_LOCATION.rationaleQuotedFromImp1172.length < 20) return false;
      if (
        !IMP_1284_FANOUT_CAP_ANALYSIS.predecessor ||
        IMP_1284_FANOUT_CAP_ANALYSIS.predecessor !== 'imp-1172'
      ) {
        return false;
      }
      if (!PATCH_TEXT.includes('imp-1284')) return false;
      if (!PATCH_TEXT.includes('imp-1172')) return false;
      return true;
    },
    why:
      'imp-1284 is a re-evaluation of imp-1172. The predecessor must be ' +
      'declared structurally (IMP_1284_FANOUT_CAP_ANALYSIS.predecessor), ' +
      'the imp-1172 verbatim rationale must be quoted in CAP_LOCATION, ' +
      'and the patch text must mention both ticket ids so future archaeology ' +
      'can trace the chain.',
  },

  // ── Two more rigorous-scope tripwires ──
  {
    id: 'imp1284-reference-hardware-shows-ceiling-binds',
    holds: () => {
      const { cpuCap, ramCap, hardCeiling, effectiveCap, bindingTerm } =
        REFERENCE_HARDWARE;
      // The point of the analysis: HARD_CEILING IS the binding term on the
      // reference machine. If this is wrong, the entire "ceiling is too
      // conservative" argument falls apart.
      const computedCap = Math.max(1, Math.min(cpuCap, ramCap, hardCeiling));
      if (computedCap !== effectiveCap) return false;
      const argmin =
        hardCeiling <= cpuCap && hardCeiling <= ramCap
          ? 'HARD_CEILING'
          : (cpuCap <= ramCap ? 'cpuCap' : 'ramCap');
      return argmin === bindingTerm;
    },
    why:
      'The recommendation rests on the claim that HARD_CEILING is currently ' +
      'the binding term in the min(cpuCap, ramCap, HARD_CEILING) formula on ' +
      'the reference machine -- otherwise raising the ceiling buys nothing. ' +
      'This tripwire verifies the algebra: min(cpuCap, ramCap, hardCeiling) ' +
      'must equal effectiveCap, and the declared bindingTerm must be the ' +
      'argmin. A drift in REFERENCE_HARDWARE values that flips the binding ' +
      'term would invalidate the recommendation.',
  },

  {
    id: 'imp1284-recommendation-stays-within-cpu-cap-on-reference-hardware',
    holds: () => {
      const { cpuCap, ramCap } = REFERENCE_HARDWARE;
      // We do NOT want a recommendation that lets newCap > cpuCap, because
      // on this hardware ncpu/2 = cpuCap is the next binding term and
      // exceeding it risks starving the parent session.
      // Specifically: after the patch, the effective cap is
      //   min(cpuCap, ramCap, newCap)
      // which we want to be <= cpuCap. This is automatic from the min(),
      // but we also gate that newCap itself is <= cpuCap + 1 -- i.e. the
      // patch raises the ceiling at most one notch ABOVE cpuCap so that a
      // hardware upgrade (more CPUs) immediately delivers the new headroom
      // without code edits.
      return (
        RECOMMENDATION.newCap <= cpuCap + 1 &&
        RECOMMENDATION.newCap <= ramCap
      );
    },
    why:
      'Rigorous scope check: the recommended newCap must not exceed cpuCap+1 ' +
      'on the reference machine (with 18 CPUs that means <= 10). Raising ' +
      'past cpuCap+1 would not deliver any additional concurrency on this ' +
      'hardware (the min() formula clips back to cpuCap) -- it would only ' +
      'mislead a reader of the dispatch script into thinking 12+ subagents ' +
      'are possible. The +1 slack lets a single-CPU upgrade (18 -> 20 cores) ' +
      'immediately deliver one more slot without re-editing. The newCap=10 ' +
      'recommendation satisfies this exactly.',
  },
];
