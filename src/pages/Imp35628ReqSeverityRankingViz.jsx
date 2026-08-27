import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35628_TIER_BARS,
  IMP35628_SUMMARY,
} from '../data/imp-35628-req-severity-ranking-viz-data.js';

const REACHABILITY_COLOR = {
  'nonexistent-theorem': '#f97316',
  'unreachable-on-natural-rate': '#fb923c',
  conjectural: '#facc15',
  'definitional-prerequisite': '#38bdf8',
  'irreducible-outcome-ceiling': '#94a3b8',
};

function TierBarChart() {
  const w = 720;
  const rowH = 56;
  const h = IMP35628_TIER_BARS.length * rowH + 24;
  const padL = 220;
  const padR = 24;
  const barMaxW = w - padL - padR;

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP35628_TIER_BARS.map((tier, i) => {
        const y = 12 + i * rowH;
        const frac = (IMP35628_TIER_BARS.length - tier.severityRank + 1) / IMP35628_TIER_BARS.length;
        const barW = barMaxW * frac;
        const color = REACHABILITY_COLOR[tier.reachability] || '#38bdf8';
        return (
          <g key={tier.req}>
            <text x={padL - 10} y={y + rowH / 2 - 6} textAnchor="end" fill="#cbd5e1" fontSize={12}>
              RANK {tier.severityRank}: {tier.req}
            </text>
            <text x={padL - 10} y={y + rowH / 2 + 10} textAnchor="end" fill="#64748b" fontSize={9}>
              {tier.name}
            </text>
            <rect x={padL} y={y + 4} width={barW} height={rowH - 20} fill={color} rx={3} />
            <text x={padL + barW + 8} y={y + rowH / 2 - 1} fill="#94a3b8" fontSize={9}>
              {tier.reachability}
              {tier.coupledWith.length > 0 ? ` (couples: ${tier.coupledWith.join(', ')})` : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp35628ReqSeverityRankingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route-(i) Requirement Severity Ranking (imp-35628)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35551 ranked the five imp-35538 route-(i) finite-N remainder derivation requirements
        by bottleneck severity. Bar length encodes severity (RANK 1 = hardest/longest); bar color
        encodes reachability class. REQ 4 (height regime) couples back into REQ 2 (explicit-rate
        GUE local law), and REQ 3 (Fourier support) couples into REQ 2 at full support -- so no
        single requirement discharge collapses the rest.
      </p>

      <TierBarChart />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>rank</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>requirement</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>reachability</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>couples with</th>
          </tr>
        </thead>
        <tbody>
          {IMP35628_TIER_BARS.map((tier) => (
            <tr key={tier.req} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{tier.severityRank}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>
                {tier.req} ({tier.name})
              </td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{tier.reachability}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{tier.coupledWith.join(', ') || '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>
        Binding obstruction: {IMP35628_SUMMARY.bindingObstruction} Single-discharge suffices:{' '}
        {IMP35628_SUMMARY.singleDischargeSuffices ? 'yes' : 'no'}.
      </p>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Scoping-only presentation of
        the imp-35551 severity ranking (no fresh derivation, no heavy data-module import); assesses
        reachability, discharges nothing; changes no bound; establishes no operator positivity;
        C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED.
      </div>
    </div>
  );
}
