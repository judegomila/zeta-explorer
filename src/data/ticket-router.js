/**
 * @module ticket-router
 * @fileoverview Routes each improvement ticket to the right execution
 * venue (Opus subscription, Sonnet API, Haiku, scripted, manual, drop)
 * based on ticket category, complexity, dependencies, and channel cost.
 * Exports {@link CHANNELS} (channel definitions), {@link routeTicket}
 * (per-ticket router), {@link groupByChannel} (aggregate report), and
 * {@link TICKET_ROUTER_ASSERTIONS} (build-time guards). Meta-engine
 * routing layer; NOT part of the formal proof chain. Module-doc added
 * by imp-930.
 * @see imp-880
 */

// Ticket channel router — which execution venue is right for each ticket?
//
// Motivation: every ticket in the improvement queue has been routed through
// the auto-improve engine's `claude --print --model opus-4-6` channel
// regardless of whether it needed an LLM at all. imp-359 "load LMFDB zeros"
// is a pure data download; imp-363 "Kahan summation" is a 20-line C-level
// refactor; running these through Opus is ~$0.05 per ticket when $0.00
// would do. And imp-1195..1198 y-axis fixes burn Opus on work Haiku would
// do for 1/50th the cost.
//
// This file defines the five channels and provides a router that, given a
// ticket (category, complexity, ad-hoc hints in the description), returns
// the best channel to execute it in. The router is advisory — the engine,
// fanout, and cron monitor can all consult it to dispatch correctly.
//
// CHANNEL CATALOG
// ---------------
//   'local-script'   Pure Node/Python, no LLM. Deterministic. $0 per run.
//                    Good for: data fetch, numerical computation, file
//                    generation, git operations, build verification.
//                    Bad for: any creative synthesis or new math.
//
//   'api-haiku'      claude --print --model claude-haiku-4-5. Cheap LLM.
//                    Good for: mechanical code edits (y-axis alignment,
//                    filter-bar migrations, tooltip additions), bug fixes
//                    with obvious fix pattern, small lint-scale work.
//                    Bad for: honest scope reasoning, new proof scaffolds.
//
//   'api-opus'       claude --print --model claude-opus-4-6 via
//                    auto-improve.sh. Expensive LLM.
//                    Good for: new proof scaffolds, partial closures with
//                    honest sub-gap enumeration, research-grade exploration.
//                    Bad for: trivial patches (wasteful).
//
//   'agent-tool'     Claude Code `Agent` tool spawned from an interactive
//                    session. Parallel, subscription-quota-backed.
//                    Good for: fanout on 3-5 atomic tickets at once,
//                    self-contained research tickets with clear deliverables.
//                    Bad for: cross-file coordination.
//
//   'main-agent'     The interactive Claude Code session itself.
//                    Good for: capstone assemblies, cross-file edits,
//                    commit consolidation, user dialog, coordination.
//                    Bad for: parallelizable work.

export const CHANNELS = {
  'local-script': {
    id: 'local-script',
    label: 'Local script (no LLM)',
    cost: '$0',
    parallel: true,
    script: 'node scripts/<handler>.mjs',
    bestFor: [
      'data fetch (LMFDB, Odlyzko tables)',
      'numerical integration',
      'deterministic file generation',
      'git operations',
      'build verification',
    ],
    badFor: ['creative synthesis', 'new math', 'honest scope reasoning'],
  },
  'api-haiku': {
    id: 'api-haiku',
    label: 'Haiku via API',
    cost: '~$0.001/run',
    parallel: true,
    script: 'claude --print --model claude-haiku-4-5',
    bestFor: [
      'mechanical code edits',
      'y-axis / layout fixes',
      'filter-bar migrations',
      'tooltip additions',
      'obvious bug fixes',
    ],
    badFor: ['new proofs', 'research-grade work', 'cross-file coordination'],
  },
  'api-opus': {
    id: 'api-opus',
    label: 'Opus via API (auto-improve.sh)',
    cost: '~$0.05/run',
    parallel: false, // single-loop engine
    script: 'claude --print --model claude-opus-4-6',
    bestFor: [
      'new proof scaffolds',
      'partial closures with sub-gap enumeration',
      'research-grade analytic arguments',
      'medium-complexity queue tickets',
    ],
    badFor: ['trivial patches (wasteful)', 'pure numerical work'],
  },
  'agent-tool': {
    id: 'agent-tool',
    label: 'Claude Code Agent tool (fanout)',
    cost: 'subscription quota',
    parallel: true,
    script: '/fanout N from main session',
    bestFor: [
      'fanout on 3-5 atomic tickets in parallel',
      'self-contained research tickets',
      'tickets with clear deliverables and file targets',
    ],
    badFor: ['cross-file coordination', 'long dialog'],
  },
  'main-agent': {
    id: 'main-agent',
    label: 'Main interactive session',
    cost: 'subscription quota',
    parallel: false,
    script: 'direct work in the current Claude Code session',
    bestFor: [
      'capstone assemblies',
      'cross-file edits',
      'commit consolidation',
      'coordination across multiple tickets',
      'user dialog',
    ],
    badFor: ['parallelizable work (use agent-tool instead)'],
  },
};

// ── Keyword heuristics for route inference ────────────────────────────────

// Words/phrases in ticket titles or descriptions that strongly indicate the
// ticket is a pure local-script task (no LLM needed).
const LOCAL_SCRIPT_SIGNALS = [
  'load LMFDB',
  'Odlyzko',
  'fetch',
  'download',
  'Turing method',
  'zero count verification',
  'Kahan',
  'compensated summation',
  'measured Dyson',
  'rerun imp-',
  'numerical integration',
];

// Signals for a mechanical, Haiku-appropriate ticket.
const HAIKU_SIGNALS = [
  'y-axis',
  'label',
  'filter-bar',
  'tab button',
  'select dropdown',
  'tooltip',
  'resize listener',
  'legend swatch',
  'color midpoint',
  'off-center',
  'hover',
];

// Signals for cross-file assembly — main-agent territory.
const MAIN_AGENT_SIGNALS = [
  'capstone',
  'assemble',
  'SOTA claim',
  'cross-file',
  'consolidated table',
  'master assembly',
];

// ── The router ─────────────────────────────────────────────────────────────

/**
 * Given a ticket, return its recommended channel id.
 *
 * Routing rules (in priority order):
 *   1. If the ticket has an explicit `channel` field, respect it.
 *   2. Category = 'proof' AND complexity ∈ {high, research} → agent-tool
 *      or api-opus (the caller picks; router returns 'agent-tool' as the
 *      more parallelizable option by default).
 *   3. Title/description contains LOCAL_SCRIPT_SIGNALS → local-script.
 *   4. Title/description contains HAIKU_SIGNALS → api-haiku.
 *   5. Title/description contains MAIN_AGENT_SIGNALS → main-agent.
 *   6. Category ∈ {bug, ux, visual, performance, accuracy at small scale}
 *      → api-haiku.
 *   7. Category = 'proof' AND complexity ∈ {small, medium} → api-opus.
 *   8. Category = 'feature' → main-agent (usually cross-file).
 *   9. Default → api-opus.
 */
export function routeTicket(ticket) {
  if (!ticket) return 'api-opus';
  if (ticket.channel && CHANNELS[ticket.channel]) return ticket.channel;

  const text = [
    ticket.title || '',
    ticket.description || '',
  ]
    .join(' ')
    .toLowerCase();

  // Rule 3: explicit local-script signals always win over category defaults.
  for (const sig of LOCAL_SCRIPT_SIGNALS) {
    if (text.includes(sig.toLowerCase())) return 'local-script';
  }

  // Rule 5: main-agent signals (capstone work) win over proof heuristics.
  for (const sig of MAIN_AGENT_SIGNALS) {
    if (text.includes(sig.toLowerCase())) return 'main-agent';
  }

  // Rule 4: Haiku signals for mechanical UI edits.
  for (const sig of HAIKU_SIGNALS) {
    if (text.includes(sig.toLowerCase())) return 'api-haiku';
  }

  // Rule 2: research-grade proof → agent-tool (parallel fanout default).
  if (
    ticket.category === 'proof' &&
    (ticket.estimatedComplexity === 'research' ||
      ticket.estimatedComplexity === 'high')
  ) {
    return 'agent-tool';
  }

  // Rule 6: mechanical categories → Haiku.
  const haikuCategories = ['bug', 'ux', 'visual', 'performance'];
  if (haikuCategories.includes(ticket.category)) return 'api-haiku';

  // Rule 7: small/medium proof → Opus.
  if (
    ticket.category === 'proof' &&
    (ticket.estimatedComplexity === 'small' ||
      ticket.estimatedComplexity === 'medium')
  ) {
    return 'api-opus';
  }

  // Rule 8: feature → main-agent (usually cross-file).
  if (ticket.category === 'feature') return 'main-agent';

  // Rule 9: default.
  return 'api-opus';
}

/**
 * Group a list of tickets by their routed channel. Returns
 * { [channelId]: [ticketId, ...] }.
 */
export function groupByChannel(tickets) {
  const out = {};
  for (const t of tickets) {
    const c = routeTicket(t);
    if (!out[c]) out[c] = [];
    out[c].push(t.id);
  }
  return out;
}

// ── Build-time assertions ─────────────────────────────────────────────────

export const TICKET_ROUTER_ASSERTIONS = [
  {
    id: 'router-all-channels-have-label',
    holds: () => Object.values(CHANNELS).every((c) => c.label && c.cost && c.script),
    why:
      'Every channel must have a label, cost, and script string so the ' +
      'router page can render it without undefined values.',
  },
  {
    id: 'router-respects-explicit-channel',
    holds: () =>
      routeTicket({ channel: 'local-script', category: 'proof' }) ===
      'local-script',
    why:
      'An explicit channel field on a ticket must always win over the ' +
      'heuristics — operators may know better than the router.',
  },
  {
    id: 'router-signals-route-correctly',
    holds: () =>
      routeTicket({
        category: 'proof',
        estimatedComplexity: 'medium',
        title: 'Load LMFDB Odlyzko zeros to N = 10^6',
        description: 'Fetch the Odlyzko tables and store them.',
      }) === 'local-script',
    why:
      'The LMFDB fetch signal should route to local-script regardless of ' +
      'category, because a data download needs no LLM.',
  },
  {
    id: 'router-default-falls-through',
    holds: () =>
      routeTicket({ category: 'proof', estimatedComplexity: 'medium' }) ===
      'api-opus',
    why:
      'A medium-complexity proof ticket with no signals should route to ' +
      'Opus by default.',
  },
];
