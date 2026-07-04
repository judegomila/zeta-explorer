import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33266_TOOLKIT,
  IMP33266_DEPENDENCY_CHAIN,
  IMP33266_TOTAL_TOOLS,
  IMP33266_ABSENT_COUNT,
  IMP33266_PARTIAL_COUNT,
} from '../data/imp-33266-g6a-k4-toolkit-status-map-viz-data.js';

const STATUS_COLOR = { absent: '#f87171', partial: '#facc15' };

function StatusPill({ availability }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.1rem 0.5rem',
        borderRadius: 999,
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#0a0f1a',
        background: STATUS_COLOR[availability] || '#94a3b8',
      }}
    >
      {availability}
    </span>
  );
}

function ToolkitTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            {['Tool', 'Yields', 'Produces', 'Requires', 'Status'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {IMP33266_TOOLKIT.map((t) => (
            <tr key={t.id} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '0.5rem 0.6rem', color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {t.id}: {t.tool}
              </td>
              <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>{t.yields}</td>
              <td style={{ padding: '0.5rem 0.6rem', color: '#7dd3fc' }}>{t.produces.join(', ')}</td>
              <td style={{ padding: '0.5rem 0.6rem', color: '#c4b5fd' }}>{t.requires.join(', ')}</td>
              <td style={{ padding: '0.5rem 0.6rem' }}>
                <StatusPill availability={t.availability} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DependencyChainDiagram() {
  const nodes = [
    { id: 'H2', label: 'H2\n(root, unwritten)', x: 40, root: true },
    { id: 'H1', label: 'H1 (via T3)', x: 220 },
    { id: 'H3', label: 'H3 (via T2)', x: 220 },
    { id: 'H4', label: 'H4 (via T1)', x: 400 },
    { id: 'modulus', label: 'with H5 (via T4)\nHoelder-1/2 C_Lip', x: 580 },
  ];
  const y = { H2: 90, H1: 40, H3: 140, H4: 90, modulus: 90 };
  const edges = [
    ['H2', 'H1'],
    ['H2', 'H3'],
    ['H1', 'H4'],
    ['H3', 'H4'],
    ['H4', 'modulus'],
  ];
  const svgW = 700;
  const svgH = 200;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={0} y={0} width={svgW} height={svgH} fill="#0a0f1a" rx={4} />
      {edges.map(([a, b]) => (
        <line
          key={a + b}
          x1={nodes.find((n) => n.id === a).x + 60}
          y1={y[a]}
          x2={nodes.find((n) => n.id === b).x}
          y2={y[b]}
          stroke="#475569"
          strokeWidth={1.4}
          markerEnd="url(#arrow)"
        />
      ))}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#475569" />
        </marker>
      </defs>
      {nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x}
            y={y[n.id] - 18}
            width={n.id === 'modulus' ? 118 : 60}
            height={36}
            rx={5}
            fill={n.root ? '#7f1d1d' : '#1e293b'}
            stroke={n.root ? '#f87171' : '#334155'}
            strokeWidth={1.4}
          />
          {n.label.split('\n').map((line, i) => (
            <text
              key={i}
              x={n.x + (n.id === 'modulus' ? 59 : 30)}
              y={y[n.id] - 3 + i * 12}
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize={9.5}
            >
              {line}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function Imp33266ToolkitStatusMapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="G6a K4 Caustic-Regularity Toolkit: Status Map (imp-3846)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3846 walked the classical caustic-regularity toolkit tool-by-tool against the imp-3642
        CM/Dyson RK4 flow. Of the {IMP33266_TOTAL_TOOLS} classical tools, {IMP33266_ABSENT_COUNT} are
        wholly absent from the repo (T1 Oleinik, T2 Lax/Dafermos, T3 Hopf-Lax, T4 Arnold) and
        {' '}{IMP33266_PARTIAL_COUNT} has only its discrete input partially present (T5 Bec-Khanin). The
        table below records what each tool yields, which imp-3727 hypothesis it produces/requires, and
        its availability; the diagram shows the dependency chain the four absent tools collapse onto.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        toolkit tool-by-tool: yields, hypothesis produced/required, repo availability
      </p>
      <ToolkitTable />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        dependency chain: {IMP33266_DEPENDENCY_CHAIN.label}
      </p>
      <DependencyChainDiagram />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the map:</strong> every genuinely-absent tool
        (T1, T2, T3, T4) lists H2 (genuine nonlinearity / convex flux of the free-Burgers hydrodynamic
        limit) as a prerequisite, so the four absent hypotheses are not independent gaps but a single
        dependency chain rooted at H2. T5 is the only tool with a partial input (the discrete
        Lagrangian map the imp-3642 RK4 integrator computes), but it reads regularity off an
        already-constructed continuum solution downstream of H1/H2/H3, so it is not a shortcut around
        the chain.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> literature-anchored scoping /
        derivation only -- no tool is fully present, H2 stays UNWRITTEN as a certificate (imp-3872
        empirically probes it but does not certify it, see the companion imp-3900 viz), the K4 route
        stays WHOLLY NEW, and G6a_shock_lipschitz stays OPEN. No estimate shipped, no positivity, no
        bridge closure, no RH claim; imp-3066 K_a &ge; 0 positivity untouched; Platt-Trudgian &Lambda;
        &le; 0.2 remains the rigorous SOTA. NO QED.
      </div>
    </div>
  );
}
