import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha } from '../styles/tokens.js';

const initialQueue = [];

/* ─── Config ─── */

const CATEGORY_CONFIG = {
  'proof-gap':    { label: 'Proof-Gap',     color: ED.accent, icon: '∅' },
  'proof':        { label: 'Proof',         color: ED.brass, icon: '⊢' },
  'verification': { label: 'Verification',  color: ED.series3, icon: '✓' },
  'visualization':{ label: 'Visualization', color: ED.series1, icon: '◎' },
  'accuracy':     { label: 'Accuracy',      color: ED.accent, icon: '◉' },
  'ux':           { label: 'UX',            color: ED.brass, icon: '✦' },
  'performance':  { label: 'Performance',   color: ED.series3, icon: '⚡' },
  'content':      { label: 'Content',       color: ED.series1, icon: '✎' },
  'meta':         { label: 'Meta',          color: ED.accent, icon: '⚙' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: ED.accent, bg: alpha(ED.series2, 0.15) },
  high:     { label: 'High',     color: ED.brass, bg: alpha(ED.brass, 0.15) },
  medium:   { label: 'Medium',   color: ED.series1, bg: alpha(ED.series1, 0.15) },
  low:      { label: 'Low',      color: ED.inkFaint, bg: alpha(ED.inkFaint, 0.15) },
};

const STATUS_CONFIG = {
  pending:              { label: 'Pending',            color: ED.inkFaint, dot: ED.inkFaint },
  'in-progress':        { label: 'In Progress',        color: ED.brass, dot: ED.brass },
  completed:            { label: 'Completed',          color: ED.series3, dot: ED.series3 },
  partial:              { label: 'Partial',            color: ED.brass, dot: ED.brass },
  conditional:          { label: 'Conditional',        color: ED.brass, dot: ED.brass },
  'conditional-closed': { label: 'Conditional-closed', color: ED.series3, dot: ED.series3 },
  blocked:              { label: 'Blocked',            color: ED.accent, dot: ED.series2 },
  superseded:           { label: 'Superseded',         color: ED.series1, dot: ED.series1 },
  done:                 { label: 'Done',               color: ED.series3, dot: ED.series3 },
};

/* ─── Shared style helpers ─── */

const cardStyle = {
  background: ED.paper2,
  border: '1px solid var(--rule)',
  borderRadius: 12,
  padding: '16px 20px',
  marginBottom: 12,
};

const badgeStyle = (bg, color) => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 99,
  fontSize: 11,
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  background: bg,
  color,
  marginRight: 6,
});

const filterBtnStyle = (active) => ({
  padding: '6px 14px',
  borderRadius: 8,
  border: active ? '1px solid var(--brass)' : '1px solid var(--rule)',
  background: active ? alpha(ED.brass, 0.15) : ED.paper,
  color: active ? ED.brass : ED.inkFaint,
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  fontWeight: active ? 600 : 400,
  transition: 'all 0.15s',
});

/* ─── Sub-components ─── */

function ProgressSummary({ items }) {
  const pending = items.filter(i => i.status === 'pending').length;
  const inProgress = items.filter(i => i.status === 'in-progress').length;
  const completed = items.filter(i => i.status === 'completed' || i.status === 'done').length;
  const blocked = items.filter(i => i.status === 'blocked').length;
  const total = items.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ ...cardStyle, background: 'linear-gradient(135deg, var(--paper-2), var(--paper-3))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
            Progress: {pct}%
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
            {total} total improvements tracked
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Pending', value: pending, color: ED.inkFaint },
            { label: 'In Progress', value: inProgress, color: ED.brass },
            { label: 'Completed', value: completed, color: ED.series3 },
            { label: 'Blocked', value: blocked, color: ED.accent },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ marginTop: 16, height: 8, borderRadius: 4, background: 'var(--rule)', overflow: 'hidden' }}>
        <div style={{
          display: 'flex', height: '100%',
        }}>
          <div style={{ width: `${(completed/total)*100}%`, background: 'var(--series-3)', transition: 'width 0.3s' }} />
          <div style={{ width: `${(inProgress/total)*100}%`, background: 'var(--brass)', transition: 'width 0.3s' }} />
          <div style={{ width: `${(blocked/total)*100}%`, background: 'var(--series-2)', transition: 'width 0.3s' }} />
        </div>
      </div>
    </div>
  );
}

function QueueCard({ item }) {
  const cat = CATEGORY_CONFIG[item.category] || {};
  const pri = PRIORITY_CONFIG[item.priority] || {};
  const sta = STATUS_CONFIG[item.status] || {};

  return (
    <div style={{
      ...cardStyle,
      borderLeft: `3px solid ${cat.color || ED.rule}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={badgeStyle(pri.bg, pri.color)}>{pri.label}</span>
        <span style={badgeStyle(ED.paper3, cat.color)}>{cat.icon} {cat.label}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: sta.color, fontFamily: 'var(--font-mono)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: sta.dot, display: 'inline-block' }} />
          {sta.label}
        </span>
        {item.proofSection && (
          <span style={badgeStyle(alpha(ED.brass, 0.15), ED.brass)}>{item.proofSection}</span>
        )}
        <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{item.id}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{item.title}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 8 }}>{item.description}</div>
      <div style={{ fontSize: 12, color: 'var(--brass)', fontStyle: 'italic', lineHeight: 1.5 }}>
        Rationale: {item.rationale}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
        Complexity: {item.estimatedComplexity}
        {item.completedAt && <span style={{ marginLeft: 16 }}>Completed: {item.completedAt}</span>}
      </div>
    </div>
  );
}

function NextSteps({ items }) {
  const top5 = items
    .filter(i => i.status === 'pending')
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
    })
    .slice(0, 5);

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 className="ed-h2" style={{ marginBottom: 12, borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
        Next Steps — Top 5 Priority
      </h2>
      {top5.length === 0 ? (
        <div style={{ color: 'var(--ink-faint)', textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          No pending items match the current filters.
        </div>
      ) : (
        top5.map(item => <QueueCard key={item.id} item={item} />)
      )}
    </div>
  );
}

function ProofImpact({ items }) {
  const sections = ['S5', 'S6', 'S7'];
  const grouped = {};
  sections.forEach(s => {
    grouped[s] = items.filter(i => i.proofSection === s).sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
    });
  });

  const sectionLabels = {
    S5: 'S5 — Spectral Realization',
    S6: 'S6 — Energy Landscape',
    S7: 'S7 — Scattering / Circuit',
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 className="ed-h2" style={{ marginBottom: 12, borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
        Section Breakdown (legacy S5/S6/S7 view)
      </h2>
      <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 12, maxWidth: 700, lineHeight: 1.6 }}>
        Grouping by the historical S5/S6/S7 &ldquo;proof section&rdquo; tags of the
        early twin-ladder/ZPO model. That model is retired as a route (the T3
        hypothesis was shown to be a zero-free-strip statement in disguise);
        the tags are kept only to index old tickets. Current tickets target
        the Λ-bound program and mostly carry no section tag.
      </p>
      {sections.map(s => (
        <div key={s} style={{ marginBottom: 24 }}>
          <h3 style={{ color: 'var(--brass)', fontSize: 15, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
            {sectionLabels[s]} ({grouped[s].length} items)
          </h3>
          {grouped[s].map(item => (
            <div key={item.id} style={{
              ...cardStyle,
              padding: '10px 16px',
              borderLeft: `3px solid ${PRIORITY_CONFIG[item.priority]?.color || ED.rule}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}>
              <span style={badgeStyle(PRIORITY_CONFIG[item.priority]?.bg, PRIORITY_CONFIG[item.priority]?.color)}>
                {PRIORITY_CONFIG[item.priority]?.label}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: STATUS_CONFIG[item.status]?.color,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_CONFIG[item.status]?.dot, display: 'inline-block' }} />
                {STATUS_CONFIG[item.status]?.label}
              </span>
              <span style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 500 }}>{item.title}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{item.id}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function AcceleratingSection() {
  const strategies = [
    {
      title: 'Parallel Agents (historical S5/S6/S7 era)',
      color: ED.accent,
      content: 'Early-phase protocol; the proof paths named below are the retired section tags. Launch 4+ agents simultaneously working on independent proof paths: S5 spectral, S7 circuit/scattering, S6 energy landscape, and CY geometric lift. Each agent works in isolation using separate worktrees. Results are merged periodically via a coordinator agent that checks cross-section consistency.',
      code: '// Launch from separate terminals:\n// Agent 1: S5 spectral realization\n// Agent 2: S7 scattering matrix\n// Agent 3: S6 energy landscape\n// Agent 4: CY geometric lift\n// Coordinator merges every 30 min',
    },
    {
      title: 'Cron-based Continuous Improvement',
      color: ED.series3,
      content: 'Use the /loop command to schedule recurring improvement sweeps. Chunk work into phases: (1) generate improvement ideas and rank by priority, (2) implement the top-priority item, (3) verify with build + skeptical D-H checks, (4) commit and update the queue. Each cycle takes 5-10 minutes.',
      code: '// Phase 1: Identify highest-priority queued item\n// Phase 2: Implement the change\n// Phase 3: npm run build && verify\n// Phase 4: git commit && mark completed',
    },
    {
      title: 'Worktree Isolation',
      color: ED.brass,
      content: 'Use isolation: "worktree" for experimental changes that might break the build. Test radical new approaches (e.g., completely rewriting the Hamiltonian) in parallel without blocking main development. Merge only if the experiment succeeds.',
      code: '// Create isolated worktree for experiments:\n// git worktree add ../mathexplorer-exp feature/radical-hamiltonian\n// Work freely without affecting main branch\n// Merge back only on success',
    },
    {
      title: 'Specialized Agent Types',
      color: ED.series1,
      content: 'Match agent type to task: use subagent_type: "Explore" for open-ended mathematical research and literature review. Use "Plan" for architecture decisions and proof strategy. Use "general-purpose" for implementation. This specialization improves quality and reduces wasted context.',
      code: '// Explore agent: "What are all known approaches to S5?"\n// Plan agent: "Design the Connes trace formula module"\n// Implement agent: "Build the trace formula computation"',
    },
    {
      title: 'Background Processing',
      color: ED.accent,
      content: 'Launch long-running computations with run_in_background: true while continuing interactive work. Compute 10000 zeta zeros, run eigenvalue decomposition for N=500, or verify Tracy-Widom statistics — all without blocking the session.',
      code: '// Start heavy computation in background:\n// run_in_background: true\n// Command: "Compute first 10000 zeta zeros"\n// Continue working on other improvements\n// Get notified when computation completes',
    },
    {
      title: 'Automated Testing Pipeline',
      color: ED.series3,
      content: 'After each improvement, automatically run: (1) npm run build to verify no breakage, (2) skeptical D-H function checks against new numerical results, (3) cross-validation against known zero heights, (4) GUE pair correlation consistency check. Any failure triggers immediate investigation.',
      code: '// After every change:\n// 1. npm run build\n// 2. Verify D-H(s) consistency\n// 3. Check against Odlyzko zero tables\n// 4. GUE pair correlation test\n// 5. Li coefficient positivity check',
    },
    {
      title: 'Memory System for Mathematical Discovery',
      color: ED.brass,
      content: 'Persist mathematical discoveries across sessions using Claude Code\'s memory system. Store which proof approaches worked vs failed, track the evolving state of each proof section, and build a cumulative knowledge base. Memory types include: user preferences (notation style, preferred proof techniques), project state (current status of S5/S6/S7 gaps, open conjectures), and feedback on approaches (what converged, what diverged, error magnitudes). Example: "Remember that the Mertens bound approach for S7 was successful with O(1/log P) convergence rate." This eliminates redundant re-derivation and ensures each session starts from the frontier, not from scratch.',
      code: '// Memory categories for RH proof work:\n//\n// DISCOVERIES (persist across all sessions):\n// "S5: Berry-Keating spectrum matches zeros to 10^-6 for N<50"\n// "S5: Connes trace formula arithmetic side converges for P<200"\n// "S5: Selberg geodesic-prime isomorphism confirmed for genus 2"\n//\n// FAILED APPROACHES (avoid repeating):\n// "FAILED: Direct Selberg comparison — wrong genus assumption"\n// "FAILED: Naive Euler product in critical strip — diverges"\n//\n// PROOF STATE TRACKING:\n// "S5 status: 3/4 sub-lemmas proved, spectral gap bound open"\n// "S6 status: GUE confirmed, Tracy-Widom edge test passed N=1000"\n// "S7 status: Mertens bound approach successful, unitarity proved"\n//\n// PREFERENCES:\n// "User prefers Connes NCG notation over Deninger for S5"\n// "Display math with full derivation steps, not just results"',
    },
    {
      title: 'Multi-Session Proof Coordination (historical S5/S6/S7 era)',
      color: ED.series1,
      content: 'Early-phase protocol; the S5 spectral avenue named below is retired (see the banner above). Open multiple Claude Code sessions simultaneously, each specialized for a different proof avenue. Session 1: S5 spectral theory — Connes trace formula, Berry-Keating operator, Selberg comparison. Session 2: S7 circuit theory — Darlington synthesis, Mertens bounds, unitarity convergence. Session 3: S6 statistical mechanics — GUE pair correlation, Tracy-Widom edge statistics, Weil positivity. Session 4: New approaches — Calabi-Yau geometry, information theory, Langlands connections. Merge protocol: each session commits to its own feature branch, with periodic merges to main after build verification. Conflict resolution: if two sessions modify the same math module, the session with the higher-priority proof section (S5 > S7 > S6) takes precedence, and the other rebases.',
      code: '// === MULTI-SESSION LAUNCH PROTOCOL ===\n//\n// Terminal 1 — S5 Spectral Realization:\n// claude "Focus on S5: Connes trace, Berry-Keating, Selberg.\n//         Branch: feature/s5-spectral"\n//\n// Terminal 2 — S7 Circuit / Scattering:\n// claude "Focus on S7: Darlington unitarity, Mertens bounds.\n//         Branch: feature/s7-scattering"\n//\n// Terminal 3 — S6 Energy Landscape:\n// claude "Focus on S6: GUE, Tracy-Widom, Weil positivity.\n//         Branch: feature/s6-energy"\n//\n// Terminal 4 — New Approaches:\n// claude "Explore CY geometry, info theory, Langlands.\n//         Branch: feature/new-approaches"\n//\n// === MERGE PROTOCOL (every 30 min) ===\n// 1. Each session: git commit && git push\n// 2. Coordinator: git merge feature/* into main\n// 3. Run npm run build to verify no conflicts\n// 4. Cross-validate: check all numerical results agree\n// 5. Priority on conflict: S5 > S7 > S6 > new',
    },
    {
      title: 'Formal Verification with Lean4 (now live)',
      color: ED.accent,
      content: 'Originally a roadmap card ("integrate the Lean4 theorem prover..."); formalization is no longer hypothetical. The program runs a live Lean 4 pipeline via the Aristotle autoformalization service: wave-1 verified results live in formalization/lean-aristotle/permutation-calculus/, including the frozen-rung proposition set checked against mathlib, and hypothesis (H6) of the §4.7 chain is discharged via a kernel-verified rectangle argument-principle formalization. Statements are autoformalized, proved or refuted by the prover, and the checked artifacts are committed to the repo; lemmas that resist formalization mark real gaps.',
      code: '-- Live pipeline (current):\n-- formalization/lean-aristotle/permutation-calculus/\n--   wave-1 verified Lean results (mathlib)\n--   frozen-rung proposition set: verified\n--   (H6) rectangle argument principle:\n--     kernel-verified\n--\n-- Flow: statement -> Aristotle autoformalize\n--   -> Lean 4 proof search -> kernel check\n--   -> commit checked artifact',
    },
    {
      title: 'Continuous Improvement Pipeline',
      color: ED.series3,
      content: 'A queue-driven approach (this very system) ensures systematic progress. The pipeline: (1) Maintain a ranked priority queue of improvements targeting proof gaps, accuracy, visualization, and meta-workflow. (2) Automated build verification after each change — every commit must pass npm run build before merge. (3) Cross-validation: every numerical claim is checked against the de Bruijn-Newman constant Lambda, Odlyzko zero tables, GUE pair correlation predictions, and Li coefficient positivity bounds. Any inconsistency with the Dirichlet-Hardy counterexample function triggers immediate investigation. (4) Progress tracking via the improvement log (IMPROVEMENTS.md) provides a complete audit trail of every change, enabling rollback and trend analysis.',
      code: '// Continuous pipeline cycle:\n// 1. Pick highest-priority queued item\n//    from IMPROVEMENT_QUEUE\n// 2. Implement the change\n// 3. npm run build  (must pass)\n// 4. Cross-validate:\n//    - D-H function consistency\n//    - Odlyzko zero table match\n//    - GUE pair correlation check\n//    - Li coefficient positivity\n// 5. git commit with audit trail\n// 6. Mark item completed, update log\n// 7. Repeat (via /loop or next session)',
    },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 className="ed-h2" style={{
        marginBottom: 4,
        borderBottom: '1px solid var(--rule)', paddingBottom: 8,
      }}>
        Meta: Accelerating with Claude Code (archived early-phase playbook)
      </h2>
      <div style={{
        padding: '12px 16px',
        marginBottom: 16,
        marginTop: 12,
        background: 'color-mix(in srgb, var(--series-2) 7%, transparent)',
        border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
        borderRadius: 8,
        fontSize: 13,
        color: 'var(--ink-soft)',
        lineHeight: 1.7,
        maxWidth: 900,
      }}>
        <strong>Historical document.</strong> This tab is the workflow playbook
        from the program&apos;s first phase and is kept as a record, not as
        current strategy. The S5/S6/S7 &ldquo;proof section&rdquo; avenues it
        organizes work around are retired: the S5 spectral route
        (Berry&ndash;Keating operator, Connes trace formula) runs into the
        known no-gos for a self-adjoint xp realization, and the twin-ladder
        model&apos;s T3 hypothesis was later shown to be a zero-free-strip
        statement in disguise. The generic tooling patterns (worktrees,
        background runs, build gates) remain in use, pointed at the Λ-bound
        program instead.
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
        The strategy cards below describe how early sessions parallelized work
        across the then-current proof sections.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {strategies.map((s, i) => (
          <div key={i} style={{
            background: 'var(--paper-2)',
            border: '1px solid var(--rule)',
            borderTop: `3px solid ${s.color}`,
            borderRadius: 12,
            padding: '20px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color, marginBottom: 8 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 12 }}>
              {s.content}
            </div>
            <pre style={{
              background: 'var(--paper)',
              border: '1px solid var(--rule)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 11,
              color: 'var(--ink-faint)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.5,
              overflow: 'auto',
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}>
              {s.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

const TAB_ALL = 'all';
const CATEGORY_TABS = ['all', 'proof', 'proof-gap', 'verification', 'visualization', 'accuracy', 'ux', 'performance', 'content', 'meta'];
const PRIORITY_FILTERS = ['all', 'critical', 'high', 'medium', 'low'];
const STATUS_FILTERS = ['all', 'pending', 'partial', 'conditional', 'conditional-closed', 'completed', 'superseded', 'done', 'in-progress', 'blocked'];

const VIEW_TABS = ['queue', 'accelerating'];

export default function ImprovementQueuePage() {
  const [viewTab, setViewTab] = useState('queue');
  const [catFilter, setCatFilter] = useState(TAB_ALL);
  const [priFilter, setPriFilter] = useState('all');
  const [staFilter, setStaFilter] = useState('all');
  const [IMPROVEMENT_QUEUE, setImprovementQueue] = useState(initialQueue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../data/improvement-queue-archive.js').then(mod => {
      setImprovementQueue(mod.IMPROVEMENT_QUEUE_ALL);
      setLoading(false);
    });
  }, []);

  // Hooks must be called unconditionally on every render — keep this above
  // the loading early-return. Previously useMemo sat after the return, which
  // crashed the page on second render with "rendered more hooks than expected".
  const filtered = useMemo(() => {
    return IMPROVEMENT_QUEUE.filter(item => {
      if (catFilter !== 'all' && item.category !== catFilter) return false;
      if (priFilter !== 'all' && item.priority !== priFilter) return false;
      if (staFilter !== 'all' && item.status !== staFilter) return false;
      return true;
    });
  }, [IMPROVEMENT_QUEUE, catFilter, priFilter, staFilter]);

  if (loading) {
    return (
      <div className="ed-root">
        <EditorialHeader />
        <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', color: 'var(--ink-faint)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Improvement Queue</h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: 700, lineHeight: 1.7 }}>
            A prioritized queue of concrete improvements targeting proof gaps, visualizations,
            accuracy, and workflow acceleration. Each item is ranked by its impact on the
            Λ-bound program &mdash; tightening rigorous bounds on the de Bruijn&ndash;Newman
            constant. There is no shortcut framing here: the program&apos;s own no-go results
            rule out every soft route to RH, so tickets target specific bound components,
            verification gates, and infrastructure.
          </p>
        </div>

        {/* View tabs: Queue vs Accelerating */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {VIEW_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setViewTab(tab)}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: viewTab === tab ? '1px solid var(--brass)' : '1px solid var(--rule)',
                background: viewTab === tab ? 'color-mix(in srgb, var(--brass) 15%, transparent)' : 'var(--paper)',
                color: viewTab === tab ? 'var(--brass)' : 'var(--ink-soft)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: viewTab === tab ? 700 : 400,
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.15s',
              }}
            >
              {tab === 'queue' ? 'Improvement Queue' : 'Accelerating with Claude Code'}
            </button>
          ))}
        </div>

        {viewTab === 'accelerating' ? (
          <AcceleratingSection />
        ) : (
          <>
            {/* Progress Summary */}
            <ProgressSummary items={IMPROVEMENT_QUEUE} />

            {/* Filters */}
            <div style={{ marginTop: 20, marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase' }}>Category</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {CATEGORY_TABS.map(tab => {
                  const n = tab === 'all' ? IMPROVEMENT_QUEUE.length : IMPROVEMENT_QUEUE.filter(i => i.category === tab).length;
                  return (
                    <button key={tab} onClick={() => setCatFilter(tab)} style={filterBtnStyle(catFilter === tab)} aria-pressed={catFilter === tab}>
                      {tab === 'all' ? 'All' : (CATEGORY_CONFIG[tab]?.label || tab)} <span style={{ opacity: 0.6 }}>({n})</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase' }}>Priority</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {PRIORITY_FILTERS.map(f => {
                  const n = f === 'all' ? IMPROVEMENT_QUEUE.length : IMPROVEMENT_QUEUE.filter(i => i.priority === f).length;
                  return (
                    <button key={f} onClick={() => setPriFilter(f)} style={filterBtnStyle(priFilter === f)} aria-pressed={priFilter === f}>
                      {f === 'all' ? 'All' : (PRIORITY_CONFIG[f]?.label || f)} <span style={{ opacity: 0.6 }}>({n})</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase' }}>Status</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {STATUS_FILTERS.map(f => {
                  const n = f === 'all' ? IMPROVEMENT_QUEUE.length : IMPROVEMENT_QUEUE.filter(i => i.status === f).length;
                  return (
                    <button key={f} onClick={() => setStaFilter(f)} style={filterBtnStyle(staFilter === f)} aria-pressed={staFilter === f} disabled={n === 0 && f !== 'all'}>
                      {f === 'all' ? 'All' : (STATUS_CONFIG[f]?.label || f)} <span style={{ opacity: 0.6 }}>({n})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active filter indicator — shows clearly when any filter is active */}
            {(catFilter !== 'all' || priFilter !== 'all' || staFilter !== 'all') && (
              <div style={{
                padding: '10px 14px',
                marginBottom: 20,
                background: 'color-mix(in srgb, var(--brass) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--brass) 30%, transparent)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--ink-soft)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--brass)', textTransform: 'uppercase' }}>Active filters:</span>
                {catFilter !== 'all' && <span>category=<b>{CATEGORY_CONFIG[catFilter]?.label || catFilter}</b></span>}
                {priFilter !== 'all' && <span>priority=<b>{PRIORITY_CONFIG[priFilter]?.label || priFilter}</b></span>}
                {staFilter !== 'all' && <span>status=<b>{STATUS_CONFIG[staFilter]?.label || staFilter}</b></span>}
                <button
                  onClick={() => { setCatFilter('all'); setPriFilter('all'); setStaFilter('all'); }}
                  style={{
                    marginLeft: 'auto',
                    padding: '3px 10px',
                    fontSize: 11,
                    borderRadius: 6,
                    border: '1px solid var(--brass)',
                    background: 'transparent',
                    color: 'var(--brass)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  clear
                </button>
              </div>
            )}

            {/* Next Steps — respects filter so status button visibly affects every section */}
            <NextSteps items={filtered} />

            {/* Proof Impact — respects filter */}
            <ProofImpact items={filtered} />

            {/* Full Queue */}
            <h2 className="ed-h2" style={{ marginBottom: 12, borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
              Full Queue ({filtered.length} items)
            </h2>
            {filtered.length === 0 ? (
              <div style={{ color: 'var(--ink-faint)', textAlign: 'center', padding: 40, fontFamily: 'var(--font-mono)' }}>
                No items match current filters.
              </div>
            ) : (
              filtered.map(item => <QueueCard key={item.id} item={item} />)
            )}
          </>
        )}

        {/* ── Related pages ──────────────────────────────────────────── */}
        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--brass)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--ink-faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
            <Link to="/meta-acceleration" style={{ fontSize: 12, color: 'var(--series-1)', textDecoration: 'none' }}>
              → Meta Acceleration
            </Link>
            <Link to="/improvements" style={{ fontSize: 12, color: 'var(--series-3)', textDecoration: 'none' }}>
              → Per-commit improvements log
            </Link>
            <Link to="/research-journal" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              → Research Journal
            </Link>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/">← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
