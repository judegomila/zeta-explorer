import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97526_TBW,
  IMP97526_TBW_ANGULAR,
  IMP97526_DEPTH,
  IMP97526_THETA_CEILING,
  IMP97526_TOOL_TABLE,
} from '../data/imp-97526-named-concentration-tool-verdict-table-viz-data.js';

// imp-97526: charts the imp-97502 tool-by-tool verdict table for the four
// named band-limited concentration inequalities assessed at 2a=ln3 --
// Wall A (depth) / Wall B (sign-weight) failure columns against the shared
// time-bandwidth product TBW=15.15.

const CELL_STYLE = {
  padding: '10px 12px',
  borderBottom: '1px solid #1e293b',
  color: '#cbd5e1',
  fontSize: '0.82rem',
  verticalAlign: 'top',
};

const HEAD_STYLE = {
  padding: '8px 12px',
  borderBottom: '2px solid #334155',
  color: '#94a3b8',
  fontSize: '0.72rem',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  textAlign: 'left',
};

function WallBadge({ failed }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: '0.72rem',
        fontWeight: 600,
        background: failed ? 'rgba(248,113,113,0.14)' : 'rgba(74,222,128,0.14)',
        color: failed ? '#f87171' : '#4ade80',
      }}
    >
      {failed ? 'FAILS' : 'clears'}
    </span>
  );
}

function VerdictTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={HEAD_STYLE}>Named tool</th>
          <th style={HEAD_STYLE}>Regime / constant behaviour at 2a=ln3</th>
          <th style={HEAD_STYLE}>Wall A (depth)</th>
          <th style={HEAD_STYLE}>Wall B (sign-weight)</th>
          <th style={HEAD_STYLE}>Verdict</th>
        </tr>
      </thead>
      <tbody>
        {IMP97526_TOOL_TABLE.map((row) => (
          <tr key={row.tool}>
            <td style={{ ...CELL_STYLE, color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap' }}>{row.tool}</td>
            <td style={CELL_STYLE}>{row.regime}</td>
            <td style={CELL_STYLE}><WallBadge failed={row.wallA} /></td>
            <td style={CELL_STYLE}><WallBadge failed={row.wallB} /></td>
            <td style={{ ...CELL_STYLE, color: '#94a3b8', fontStyle: 'italic' }}>{row.verdict}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp97526NamedConcentrationToolVerdictTableViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="imp-97502: Named Concentration Tool Verdict Table" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(56,189,248,0.06)',
          borderLeft: '3px solid #38bdf8',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#38bdf8' }}>Honest status:</strong> every
        row below is reused verbatim from imp-97502. Assessment only &mdash;
        no operator positivity, no coercivity constant, no bound moves;
        interval-rigorous reach stays 2a&le;0.96; Platt-Trudgian
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        At 2a = ln3, the confined negative sigma_2 well (depth {IMP97526_DEPTH},
        measure |E| = 13.786) gives a time-bandwidth product
        TBW = |E|&middot;2a = {IMP97526_TBW.toFixed(2)} ({IMP97526_TBW_ANGULAR.toFixed(2)} in
        the 2&pi; convention), both far above the Donoho-Stark
        non-triviality threshold of 1. Every named concentration tool
        assessed against the shared de Branges coercivity primitive falls to
        at least one of two walls: Wall A (a mass-fraction ceiling
        theta&le;theta_max would need theta_max &lt; {IMP97526_THETA_CEILING.toExponential(3)}
        {' '}for a usable c&sim;0.5, since c &ge; -{IMP97526_DEPTH}&middot;theta_max), or
        Wall B (the tool bounds an indicator / Lebesgue mass, never the
        signed sigma_2 weight).
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        tool-by-tool verdict at 2a = ln3
      </h3>
      <VerdictTable />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> presentation
        only, consuming the imp-97502 tool-by-tool verdict verbatim.
        Establishes no operator positivity; changes no bound;
        Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
