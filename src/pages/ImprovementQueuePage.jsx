import React, { useState, useMemo } from 'react';
import { IMPROVEMENT_QUEUE } from '../data/improvement-queue.js';

/* ─── Config ─── */

const CATEGORY_CONFIG = {
  'proof-gap':    { label: 'Proof-Gap',     color: '#ef4444', icon: '\u2205' },
  'visualization':{ label: 'Visualization', color: '#8b5cf6', icon: '\u25ce' },
  'accuracy':     { label: 'Accuracy',      color: '#f59e0b', icon: '\u25c9' },
  'ux':           { label: 'UX',            color: '#3b82f6', icon: '\u2726' },
  'performance':  { label: 'Performance',   color: '#10b981', icon: '\u26a1' },
  'content':      { label: 'Content',       color: '#06b6d4', icon: '\u270e' },
  'meta':         { label: 'Meta',          color: '#ec4899', icon: '\u2699' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  high:     { label: 'High',     color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  medium:   { label: 'Medium',   color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  low:      { label: 'Low',      color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
};

const STATUS_CONFIG = {
  queued:       { label: 'Queued',       color: '#64748b', dot: '#64748b' },
  'in-progress':{ label: 'In Progress', color: '#f59e0b', dot: '#f59e0b' },
  completed:    { label: 'Completed',   color: '#10b981', dot: '#10b981' },
  blocked:      { label: 'Blocked',     color: '#ef4444', dot: '#ef4444' },
};

/* ─── Shared style helpers ─── */

const cardStyle = {
  background: 'rgba(15,23,42,0.6)',
  border: '1px solid #1e293b',
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
  border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid #1e293b',
  background: active ? 'rgba(99,102,241,0.15)' : 'rgba(15,23,42,0.4)',
  color: active ? '#a5b4fc' : '#94a3b8',
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  fontWeight: active ? 600 : 400,
  transition: 'all 0.15s',
});

/* ─── Sub-components ─── */

function ProgressSummary({ items }) {
  const queued = items.filter(i => i.status === 'queued').length;
  const inProgress = items.filter(i => i.status === 'in-progress').length;
  const completed = items.filter(i => i.status === 'completed').length;
  const blocked = items.filter(i => i.status === 'blocked').length;
  const total = items.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.6))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Progress: {pct}%
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            {total} total improvements tracked
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Queued', value: queued, color: '#64748b' },
            { label: 'In Progress', value: inProgress, color: '#f59e0b' },
            { label: 'Completed', value: completed, color: '#10b981' },
            { label: 'Blocked', value: blocked, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ marginTop: 16, height: 8, borderRadius: 4, background: '#1e293b', overflow: 'hidden' }}>
        <div style={{
          display: 'flex', height: '100%',
        }}>
          <div style={{ width: `${(completed/total)*100}%`, background: '#10b981', transition: 'width 0.3s' }} />
          <div style={{ width: `${(inProgress/total)*100}%`, background: '#f59e0b', transition: 'width 0.3s' }} />
          <div style={{ width: `${(blocked/total)*100}%`, background: '#ef4444', transition: 'width 0.3s' }} />
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
      borderLeft: `3px solid ${cat.color || '#334155'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={badgeStyle(pri.bg, pri.color)}>{pri.label}</span>
        <span style={badgeStyle('rgba(30,41,59,0.8)', cat.color)}>{cat.icon} {cat.label}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: sta.color, fontFamily: 'var(--font-mono)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: sta.dot, display: 'inline-block' }} />
          {sta.label}
        </span>
        {item.proofSection && (
          <span style={badgeStyle('rgba(99,102,241,0.15)', '#a5b4fc')}>{item.proofSection}</span>
        )}
        <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{item.id}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>{item.title}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 8 }}>{item.description}</div>
      <div style={{ fontSize: 12, color: '#6366f1', fontStyle: 'italic', lineHeight: 1.5 }}>
        Rationale: {item.rationale}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)' }}>
        Complexity: {item.estimatedComplexity}
        {item.completedAt && <span style={{ marginLeft: 16 }}>Completed: {item.completedAt}</span>}
      </div>
    </div>
  );
}

function NextSteps({ items }) {
  const top5 = items
    .filter(i => i.status === 'queued')
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
    })
    .slice(0, 5);

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ color: '#e2e8f0', fontSize: 18, marginBottom: 12, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
        Next Steps — Top 5 Priority
      </h2>
      {top5.map(item => <QueueCard key={item.id} item={item} />)}
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
      <h2 style={{ color: '#e2e8f0', fontSize: 18, marginBottom: 12, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
        Proof Impact — Section Breakdown
      </h2>
      {sections.map(s => (
        <div key={s} style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a5b4fc', fontSize: 15, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
            {sectionLabels[s]} ({grouped[s].length} items)
          </h3>
          {grouped[s].map(item => (
            <div key={item.id} style={{
              ...cardStyle,
              padding: '10px 16px',
              borderLeft: `3px solid ${PRIORITY_CONFIG[item.priority]?.color || '#334155'}`,
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
              <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{item.title}</span>
              <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{item.id}</span>
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
      title: 'Parallel Agents',
      color: '#8b5cf6',
      content: 'Launch 4+ agents simultaneously working on independent proof paths: S5 spectral, S7 circuit/scattering, S6 energy landscape, and CY geometric lift. Each agent works in isolation using separate worktrees. Results are merged periodically via a coordinator agent that checks cross-section consistency.',
      code: '// Launch from separate terminals:\n// Agent 1: S5 spectral realization\n// Agent 2: S7 scattering matrix\n// Agent 3: S6 energy landscape\n// Agent 4: CY geometric lift\n// Coordinator merges every 30 min',
    },
    {
      title: 'Cron-based Continuous Improvement',
      color: '#10b981',
      content: 'Use the /loop command to schedule recurring improvement sweeps. Chunk work into phases: (1) generate improvement ideas and rank by priority, (2) implement the top-priority item, (3) verify with build + adversarial D-H checks, (4) commit and update the queue. Each cycle takes 5-10 minutes.',
      code: '// Phase 1: Identify highest-priority queued item\n// Phase 2: Implement the change\n// Phase 3: npm run build && verify\n// Phase 4: git commit && mark completed',
    },
    {
      title: 'Worktree Isolation',
      color: '#f59e0b',
      content: 'Use isolation: "worktree" for experimental changes that might break the build. Test radical new approaches (e.g., completely rewriting the Hamiltonian) in parallel without blocking main development. Merge only if the experiment succeeds.',
      code: '// Create isolated worktree for experiments:\n// git worktree add ../mathexplorer-exp feature/radical-hamiltonian\n// Work freely without affecting main branch\n// Merge back only on success',
    },
    {
      title: 'Specialized Agent Types',
      color: '#3b82f6',
      content: 'Match agent type to task: use subagent_type: "Explore" for open-ended mathematical research and literature review. Use "Plan" for architecture decisions and proof strategy. Use "general-purpose" for implementation. This specialization improves quality and reduces wasted context.',
      code: '// Explore agent: "What are all known approaches to S5?"\n// Plan agent: "Design the Connes trace formula module"\n// Implement agent: "Build the trace formula computation"',
    },
    {
      title: 'Background Processing',
      color: '#ec4899',
      content: 'Launch long-running computations with run_in_background: true while continuing interactive work. Compute 10000 zeta zeros, run eigenvalue decomposition for N=500, or verify Tracy-Widom statistics — all without blocking the session.',
      code: '// Start heavy computation in background:\n// run_in_background: true\n// Command: "Compute first 10000 zeta zeros"\n// Continue working on other improvements\n// Get notified when computation completes',
    },
    {
      title: 'Automated Testing Pipeline',
      color: '#06b6d4',
      content: 'After each improvement, automatically run: (1) npm run build to verify no breakage, (2) adversarial D-H function checks against new numerical results, (3) cross-validation against known zero heights, (4) GUE pair correlation consistency check. Any failure triggers immediate investigation.',
      code: '// After every change:\n// 1. npm run build\n// 2. Verify D-H(s) consistency\n// 3. Check against Odlyzko zero tables\n// 4. GUE pair correlation test\n// 5. Li coefficient positivity check',
    },
    {
      title: 'Memory System',
      color: '#a78bfa',
      content: 'Use Claude Code\'s memory to persist insights across sessions. Record: which mathematical approaches worked (and why), which failed (and why), key relationships discovered between proof sections, performance benchmarks, and the current state of each proof gap. Never re-derive the same insight twice.',
      code: '// Persisted memories:\n// "S5: Berry-Keating spectrum matches to 10^-6 for N<50"\n// "S7: Darlington convergence needs Mertens M constant"\n// "S6: Tracy-Widom test passed for N=1000 zeros"\n// "FAILED: Direct Selberg comparison — wrong genus"',
    },
    {
      title: 'Multi-Session Strategy',
      color: '#ef4444',
      content: 'Open multiple Claude Code sessions simultaneously, each tackling a different proof path. Session 1 attacks S5 spectral realization. Session 2 works on S7 scattering. Session 3 develops S6 energy arguments. A fourth session periodically reviews all three and identifies synergies or contradictions.',
      code: '// Session 1: "Focus on S5 spectral realization"\n// Session 2: "Focus on S7 scattering matrix"\n// Session 3: "Focus on S6 energy landscape"\n// Session 4: "Review & merge all proof progress"',
    },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{
        color: '#e2e8f0', fontSize: 20, marginBottom: 4,
        borderBottom: '1px solid #1e293b', paddingBottom: 8,
      }}>
        Meta: Accelerating with Claude Code
      </h2>
      <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
        Practical strategies for maximizing throughput on the RH proof using Claude Code&apos;s
        agent capabilities. Each strategy is designed to multiply effective work rate.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {strategies.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid #1e293b',
            borderTop: `3px solid ${s.color}`,
            borderRadius: 12,
            padding: '20px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color, marginBottom: 8 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 12 }}>
              {s.content}
            </div>
            <pre style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid #1e293b',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 11,
              color: '#64748b',
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
const CATEGORY_TABS = ['all', 'proof-gap', 'visualization', 'accuracy', 'ux', 'performance', 'content', 'meta'];
const PRIORITY_FILTERS = ['all', 'critical', 'high', 'medium', 'low'];
const STATUS_FILTERS = ['all', 'queued', 'in-progress', 'completed', 'blocked'];

const VIEW_TABS = ['queue', 'accelerating'];

export default function ImprovementQueuePage() {
  const [viewTab, setViewTab] = useState('queue');
  const [catFilter, setCatFilter] = useState(TAB_ALL);
  const [priFilter, setPriFilter] = useState('all');
  const [staFilter, setStaFilter] = useState('all');

  const filtered = useMemo(() => {
    return IMPROVEMENT_QUEUE.filter(item => {
      if (catFilter !== 'all' && item.category !== catFilter) return false;
      if (priFilter !== 'all' && item.priority !== priFilter) return false;
      if (staFilter !== 'all' && item.status !== staFilter) return false;
      return true;
    });
  }, [catFilter, priFilter, staFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Improvement Queue &mdash; Road to RH</h1>
        <p style={{ color: '#94a3b8', maxWidth: 700, lineHeight: 1.7 }}>
          A prioritized queue of concrete improvements targeting proof gaps, visualizations,
          accuracy, and workflow acceleration. Each item is ranked by its impact on proving
          the Riemann Hypothesis through the ZPO framework.
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
              border: viewTab === tab ? '1px solid rgba(99,102,241,0.5)' : '1px solid #1e293b',
              background: viewTab === tab ? 'rgba(99,102,241,0.2)' : 'rgba(15,23,42,0.4)',
              color: viewTab === tab ? '#c7d2fe' : '#94a3b8',
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
            <div style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase' }}>Category</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {CATEGORY_TABS.map(tab => (
                <button key={tab} onClick={() => setCatFilter(tab)} style={filterBtnStyle(catFilter === tab)}>
                  {tab === 'all' ? 'All' : (CATEGORY_CONFIG[tab]?.label || tab)}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase' }}>Priority</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {PRIORITY_FILTERS.map(f => (
                <button key={f} onClick={() => setPriFilter(f)} style={filterBtnStyle(priFilter === f)}>
                  {f === 'all' ? 'All' : (PRIORITY_CONFIG[f]?.label || f)}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)', marginBottom: 6, textTransform: 'uppercase' }}>Status</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {STATUS_FILTERS.map(f => (
                <button key={f} onClick={() => setStaFilter(f)} style={filterBtnStyle(staFilter === f)}>
                  {f === 'all' ? 'All' : (STATUS_CONFIG[f]?.label || f)}
                </button>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <NextSteps items={IMPROVEMENT_QUEUE} />

          {/* Proof Impact */}
          <ProofImpact items={IMPROVEMENT_QUEUE} />

          {/* Full Queue */}
          <h2 style={{ color: '#e2e8f0', fontSize: 18, marginBottom: 12, borderBottom: '1px solid #1e293b', paddingBottom: 8 }}>
            Full Queue ({filtered.length} items)
          </h2>
          {filtered.length === 0 ? (
            <div style={{ color: '#475569', textAlign: 'center', padding: 40, fontFamily: 'var(--font-mono)' }}>
              No items match current filters.
            </div>
          ) : (
            filtered.map(item => <QueueCard key={item.id} item={item} />)
          )}
        </>
      )}
    </div>
  );
}
