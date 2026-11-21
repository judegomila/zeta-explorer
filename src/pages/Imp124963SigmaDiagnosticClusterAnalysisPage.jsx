import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP124906_SIGMA_DIAGNOSTIC_LEAF_CLUSTER_INDEX } from '../data/imp-124906-sigma-diagnostic-leaf-cluster-index.js';

// imp-124963: the imp-124906 index module maps the 17-leaf sigma-diagnostic cluster by
// sub-thread in prose/data form only -- no page consumed it, so a reader had to follow the
// @see list by hand. This adds the first navigable, tabbed consumer: one tab per sub-thread,
// each listing its members' role/result plus a link to that member's existing viz page where
// one has already shipped.

const VIZ_PAGES = {
  'imp-124769': [{ path: '/viz-imp124824-ecf-stencil-crossover', title: 'E_CF stencil crossover chart' }],
  'imp-124849': [{ path: '/viz-imp124882-dps-invariance-ladder', title: 'dps-invariance ladder chart' }],
  'imp-124770': [
    { path: '/viz-imp124815-pairratio-ladder', title: 'pair-ratio ladder chart' },
    { path: '/viz-imp124842-roundoff-law', title: 'round-off law chart' },
  ],
  'imp-124811': [{ path: '/viz-imp124842-roundoff-law', title: 'round-off law chart' }],
  'imp-124850': [{ path: '/viz-imp124880-pairratio-drift-slope-scatter', title: 'drift-slope scatter chart' }],
  'imp-124772': [
    { path: '/viz-imp124881-floor-elasticity-sidebyside', title: 'floor-elasticity side-by-side chart' },
    { path: '/viz-imp124841-knee-locator-comparison', title: 'knee-locator comparison chart' },
    { path: '/viz-imp124961-f2-residual-curvature-u', title: 'F2 residual-curvature U chart' },
  ],
  'imp-124814': [{ path: '/viz-imp124841-knee-locator-comparison', title: 'knee-locator comparison chart' }],
  'imp-124848': [{ path: '/viz-imp124881-floor-elasticity-sidebyside', title: 'floor-elasticity side-by-side chart' }],
  'imp-124793': [{ path: '/viz-imp124840-fartail-per-nine-ladder', title: 'per-nine spacing ladder chart' }],
  'imp-124852': [{ path: '/viz-imp124899-kernel-arm-offset-asymmetry', title: 'kernel arm-offset asymmetry chart' }],
};

const { cluster, threadTitles } = IMP124906_SIGMA_DIAGNOSTIC_LEAF_CLUSTER_INDEX;

const TABS = Object.keys(threadTitles)
  .map(Number)
  .sort((a, b) => a - b)
  .map((threadNum) => ({
    id: `thread-${threadNum}`,
    label: `Thread ${threadNum}: ${threadTitles[threadNum]}`,
    members: cluster.filter((c) => c.thread === threadNum),
  }));

function ThreadPanel({ members }) {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {members.map((m) => {
        const links = VIZ_PAGES[m.id] ?? [];
        return (
          <div
            key={m.id}
            style={{
              padding: '0.85rem 1rem',
              background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
              borderLeft: '3px solid var(--rule)',
              borderRadius: '0 4px 4px 0',
            }}
          >
            <div style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '0.9rem' }}>
              {m.role} <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>({m.id})</span>
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              {m.result}
            </div>
            {links.length > 0 && (
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {links.map((l) => (
                  <Link key={l.path} to={l.path} style={{ color: 'var(--series-1)', fontSize: '0.78rem' }}>
                    {l.title} &rarr;
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Imp124963SigmaDiagnosticClusterAnalysisPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const active = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Sigma-Diagnostic Leaf Cluster Analysis (imp-124906, 17 leaves)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        {IMP124906_SIGMA_DIAGNOSTIC_LEAF_CLUSTER_INDEX.question}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', borderBottom: '1px solid var(--rule)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.78rem',
              background: 'none',
              border: 'none',
              borderBottom: t.id === activeTab ? '2px solid var(--series-1)' : '2px solid transparent',
              color: t.id === activeTab ? 'var(--ink)' : 'var(--ink-faint)',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ThreadPanel members={active.members} />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> navigable index/analysis view
        over the already-committed imp-124906 cluster; establishes nothing new and moves no bound.
        Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation; C_mb
        GUE-conditional per imp-486 and the C_C 1/8 ansatz untouched; imp-3066 K_a&ge;0 untouched;
        RH open; NO QED. No refereed bound is changed.
      </div>
    </div>
  );
}
