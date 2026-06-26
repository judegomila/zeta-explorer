// GramPointsPage.jsx -- imp-1122
// Gram point visualization and Gram law violations.
// Three panels: Z(g_n) scatter, violation density by block, spacing comparison.
// Plus exception table and interval analysis. 6 tripwires in data file.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RelatedLinks from '../components/RelatedLinks.jsx';
import { scaleLinear } from 'd3-scale';
import { GRAM_POINTS_DATA } from '../data/gram-points-numerical.js';

const D  = GRAM_POINTS_DATA;
const SC = D.scatterSample;
const VB = D.violationBins;
const IA = D.intervalAnalysis;

const W  = 860;
const PH = 220;
const M  = { top: 26, right: 24, bottom: 44, left: 64 };
const IW = W - M.left - M.right;
const IH = PH - M.top - M.bottom;

const mono = 'var(--font-mono)';
const TF = { fontFamily: mono, fontSize: 9, fill: '#94a3b8' };
const LF = { fontFamily: mono, fontSize: 10, fill: 'var(--text-secondary)' };

// Panel 1: Z(g_n) scatter plot
const xP1 = scaleLinear().domain([0, Math.max(...SC.map(p => p.n))]).range([0, IW]);
const zAbs = Math.max(1, ...SC.map(p => Math.abs(p.Z)));
const yP1 = scaleLinear().domain([-zAbs, zAbs]).range([IH, 0]);

// Panel 2: violation density bars
const maxRate = Math.max(1, ...VB.map(b => b.rate));
const yP2 = scaleLinear().domain([0, maxRate * 1.15]).range([IH, 0]);
const barW = IW / VB.length - 2;

// Panel 3: spacing comparison (first 49 spacings)
const gramSp = D.allGrams.slice(0, 50);
const spacings = [];
for (let i = 0; i < gramSp.length - 1; i++) {
  spacings.push({ n: gramSp[i].n, gSp: gramSp[i + 1].g - gramSp[i].g });
}
const maxSp = Math.max(1, ...spacings.map(s => s.gSp));
const xP3 = scaleLinear().domain([0, spacings.length - 1]).range([0, IW]);
const yP3 = scaleLinear().domain([0, maxSp * 1.1]).range([IH, 0]);

function YTicks({ yScale, count }) {
  return yScale.ticks(count || 4).map(v => (
    <g key={v} transform={`translate(0,${yScale(v)})`}>
      <line x1={0} x2={IW} stroke="#1e293b" />
      <line x1={-4} x2={0} stroke="#475569" />
      <text x={-7} y={3} textAnchor="end" style={TF}>{typeof v === 'number' && Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2)}</text>
    </g>
  ));
}

function PanelFrame({ label }) {
  return (
    <>
      <line x1={0} x2={IW} y1={IH} y2={IH} stroke="#475569" />
      <line x1={0} x2={0} y1={0} y2={IH} stroke="#475569" />
      <text transform={`translate(-50,${IH / 2}) rotate(-90)`} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>
        {label}
      </text>
    </>
  );
}

export default function GramPointsPage() {
  const [showAll, setShowAll] = useState(false);
  const exceptionsToShow = showAll ? D.violations : D.violations.slice(0, 20);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Gram Points and Gram Law Violations (imp-1122)</h1>
        <p className="page-subtitle">
          Gram points g_n solve theta(g_n) = n*pi where theta is the Riemann-Siegel theta
          function. Gram's law (1903) predicts sgn Z(g_n) = (-1)^n. Violations are rare but
          infinite; the first exception is at n=126 (Hutchinson 1925). This page visualizes
          the first {D.totalComputed} Gram points, their Z-values, violation patterns, and
          spacing statistics.
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/explorations" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            &larr; Explorations
          </Link>
          <Link to="/zeta" style={{ color: '#a855f7', fontFamily: mono, fontSize: 12 }}>
            Zeta visualization
          </Link>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
      }}>
        <Stat label="Gram points" value={String(D.totalComputed)} />
        <Stat label="Violations" value={String(D.totalViolations)} accent="#fca5a5" />
        <Stat label="Violation rate" value={D.violationRate + '%'} accent={D.violationRate > 15 && D.violationRate < 40 ? '#fbbf24' : '#fca5a5'} />
        <Stat label="1st exception" value={D.firstException ? 'n=' + D.firstException.n : '?'} accent="#a78bfa" />
        <Stat label="Spacing ratio" value={String(D.spacing.ratio)} accent={D.spacing.ratio > 0.7 && D.spacing.ratio < 1.5 ? '#86efac' : '#fca5a5'} />
        <Stat label="1-zero intervals" value={IA.gramLawIntervalPct + '%'} accent={IA.gramLawIntervalPct > 50 ? '#86efac' : '#fca5a5'} />
      </div>

      {/* Finite-window provenance: scope the violation-rate number */}
      <div style={{
        marginTop: 10,
        fontSize: 11.5,
        lineHeight: 1.5,
        color: 'var(--text-muted)',
        fontFamily: mono,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid #64748b',
        borderRadius: 6,
        padding: '8px 10px',
      }}>
        Provenance: the first {D.totalComputed} Gram points from{' '}
        <code>src/data/gram-points-numerical.js</code>, each computed via the Riemann-Siegel
        theta function. The {D.violationRate}% violation rate is a <strong>finite-window</strong>{' '}
        figure specific to this low height range &mdash; it is not a universal constant and grows
        without bound as t&rarr;&infin; (Titchmarsh 1935). Read it as a local sample, not a limit.
      </div>

      {/* Panel 1: Z(g_n) scatter */}
      <div style={{ marginTop: 18, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: mono, marginBottom: 4 }}>
          Panel 1 — Z(g_n) at each Gram point: green = obeys Gram's law, red = violation
        </div>
        <svg width={W} height={PH} role="img" aria-label="Z(g_n) scatter plot">
          <g transform={`translate(${M.left},${M.top})`}>
            <YTicks yScale={yP1} count={5} />
            <PanelFrame label="Z(g_n)" />
            <line x1={0} x2={IW} y1={yP1(0)} y2={yP1(0)} stroke="#475569" strokeDasharray="3,3" />
            {SC.map((p, i) => (
              <circle
                key={i}
                cx={xP1(p.n)}
                cy={yP1(p.Z)}
                r={p.obeys ? 1.5 : 3}
                fill={p.obeys ? '#4ade80' : '#f87171'}
                fillOpacity={p.obeys ? 0.5 : 0.9}
              />
            ))}
            <text x={IW / 2} y={IH + 36} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>Gram index n</text>
          </g>
        </svg>
        <div style={{ marginTop: 4, fontSize: 10, fontFamily: mono, color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
          <span><span style={{ color: '#4ade80' }}>&#9679;</span> obeys Gram's law</span>
          <span><span style={{ color: '#f87171' }}>&#9679;</span> violation</span>
        </div>
      </div>

      {/* Panel 2: violation density by block */}
      <div style={{ marginTop: 12, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: mono, marginBottom: 4 }}>
          Panel 2 — Gram law violation rate (%) by blocks of 100
        </div>
        <svg width={W} height={PH} role="img" aria-label="Violation density bars">
          <g transform={`translate(${M.left},${M.top})`}>
            <YTicks yScale={yP2} count={5} />
            <PanelFrame label="rate %" />
            {VB.map((b, i) => {
              const x = (IW / VB.length) * i + 1;
              const h = IH - yP2(b.rate);
              return (
                <g key={i}>
                  <rect x={x} y={yP2(b.rate)} width={barW} height={h} fill="#f59e0b" fillOpacity={0.8} />
                  <text x={x + barW / 2} y={IH + 16} textAnchor="middle" style={TF}>{b.range.split('-')[0]}</text>
                </g>
              );
            })}
            <line x1={0} x2={IW} y1={yP2(D.violationRate)} y2={yP2(D.violationRate)} stroke="#fbbf24" strokeDasharray="4,3" strokeWidth={1.5} />
            <text x={IW + 4} y={yP2(D.violationRate) + 3} style={{ ...TF, fill: '#fbbf24' }}>avg</text>
            <text x={IW / 2} y={IH + 36} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>block start n</text>
          </g>
        </svg>
      </div>

      {/* Panel 3: Gram spacing vs zero spacing */}
      <div style={{ marginTop: 12, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: mono, marginBottom: 4 }}>
          Panel 3 — Gram interval widths (g_(n+1) - g_n) for n = 0..48
        </div>
        <svg width={W} height={PH} role="img" aria-label="Gram spacing line chart">
          <g transform={`translate(${M.left},${M.top})`}>
            <YTicks yScale={yP3} count={5} />
            <PanelFrame label="spacing" />
            {spacings.map((s, i) => {
              if (i === 0) return null;
              const prev = spacings[i - 1];
              return (
                <line
                  key={i}
                  x1={xP3(i - 1)} y1={yP3(prev.gSp)}
                  x2={xP3(i)} y2={yP3(s.gSp)}
                  stroke="#38bdf8" strokeWidth={1.5}
                />
              );
            })}
            {spacings.map((s, i) => (
              <circle key={i} cx={xP3(i)} cy={yP3(s.gSp)} r={2} fill="#7dd3fc" />
            ))}
            <text x={IW / 2} y={IH + 36} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>index</text>
          </g>
        </svg>
        <div style={{ marginTop: 4, fontSize: 10, fontFamily: mono, color: 'var(--text-secondary)' }}>
          Avg Gram spacing: {D.spacing.avgGramSpacing} | Avg zero spacing: {D.spacing.avgZeroSpacing} | Ratio: {D.spacing.ratio} (asymptotically 1)
        </div>
      </div>

      {/* Interval analysis card */}
      <div className="card" style={{ marginTop: 20, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 8 }}>
          zeros per Gram interval distribution
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
          <MiniStat label="Total intervals" value={IA.totalIntervals} />
          <MiniStat label="0 zeros (empty)" value={IA.empty} color="#f87171" />
          <MiniStat label="1 zero (normal)" value={IA.single} color="#4ade80" />
          <MiniStat label="2+ zeros" value={IA.double} color="#fbbf24" />
          <MiniStat label="Zeros checked" value={IA.zerosChecked} color="#a78bfa" />
        </div>
      </div>

      {/* Exception table */}
      <div className="card" style={{ marginTop: 16, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 8 }}>
          Gram law exceptions ({D.totalViolations} total)
          {D.violations.length > 20 && (
            <button
              onClick={() => setShowAll(s => !s)}
              style={{
                marginLeft: 12, background: '#334155', border: '1px solid #475569',
                borderRadius: 4, color: '#94a3b8', fontSize: 10, padding: '2px 8px',
                cursor: 'pointer', fontFamily: mono,
              }}
            >
              {showAll ? 'show fewer' : `show all ${D.violations.length}`}
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ textAlign: 'left', padding: 6 }}>n</th>
                <th style={{ textAlign: 'right', padding: 6 }}>g_n</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Z(g_n)</th>
                <th style={{ textAlign: 'center', padding: 6 }}>expected</th>
                <th style={{ textAlign: 'center', padding: 6 }}>actual</th>
              </tr>
            </thead>
            <tbody>
              {exceptionsToShow.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: 6, color: r.n === 126 ? '#f59e0b' : '#f87171' }}>
                    {r.n}{r.n === 126 ? ' *' : ''}
                  </td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.g.toFixed(4)}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.Z.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'center' }}>{r.expectedSign > 0 ? '+' : '-'}</td>
                  <td style={{ padding: 6, textAlign: 'center', color: '#fca5a5' }}>{r.actualSign > 0 ? '+' : r.actualSign < 0 ? '-' : '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {D.firstException && (
          <div style={{ marginTop: 8, fontSize: 10, fontFamily: mono, color: '#fbbf24' }}>
            * n=126: first Gram exception (Hutchinson 1925). Z(g_126) = {D.firstException.Z},
            expected sign {D.firstException.expectedSign > 0 ? '+' : '-'},
            got {D.firstException.actualSign > 0 ? '+' : D.firstException.actualSign < 0 ? '-' : '0'}.
          </div>
        )}
      </div>

      {/* First 20 Gram points table */}
      <div className="card" style={{ marginTop: 16, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 8 }}>
          first 20 Gram points
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ textAlign: 'left', padding: 6 }}>n</th>
                <th style={{ textAlign: 'right', padding: 6 }}>g_n</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Z(g_n)</th>
                <th style={{ textAlign: 'center', padding: 6 }}>Gram's law</th>
              </tr>
            </thead>
            <tbody>
              {D.allGrams.slice(0, 20).map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: 6, color: '#a78bfa' }}>{r.n}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.g.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.Z.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'center', color: r.obeys ? '#86efac' : '#fca5a5' }}>
                    {r.obeys ? 'obeys' : 'VIOLATES'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        padding: '10px 14px',
        background: '#1c1917',
        border: '1px solid #78350f',
        borderRadius: 6,
        fontSize: 11,
        fontFamily: mono,
        color: '#fbbf24',
        lineHeight: 1.7,
      }}>
        <strong>Gram&apos;s law is an empirical rule of thumb, NOT a theorem.</strong>
        {' '}Titchmarsh (1935) proved violations occur infinitely often, and the violation
        rate grows without bound. Rigorous zero-counting therefore requires Turing&apos;s
        method (1953) — which uses Gram blocks plus explicit error terms — rather than
        relying on Gram&apos;s law alone. The Hardy Z-function values plotted above are
        exactly the Z(g_n) inputs that Turing&apos;s method needs; see{' '}
        <Link to="/hardy-z" style={{ color: '#fbbf24', textDecoration: 'underline' }}>/hardy-z</Link>
        {' '}and{' '}
        <Link to="/riemann-siegel-z" style={{ color: '#fbbf24', textDecoration: 'underline' }}>/riemann-siegel-z</Link>.
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Notes: Gram points g_n are defined by theta(g_n) = n*pi where theta is the
        Riemann-Siegel theta function. Gram's law states sgn Z(g_n) = (-1)^n. Violations
        are expected (~27% in this range). The violation rate increases slowly with height.
        Gram spacings are asymptotically equal to zero spacings: 2*pi / log(t/(2*pi)).
        Rosser's rule uses blocks of consecutive Gram intervals to certify zero counts
        rigorously. Data from imp-1122 (src/data/gram-points-numerical.js).
      </div>

      <RelatedLinks links={[
        { to: '/hardy-z', label: 'Hardy Z-Function' },
        { to: '/riemann-siegel-z', label: 'Riemann-Siegel Z(t)' },
        { to: '/zeta', label: 'Zeta Landscape' },
        { to: '/statistics', label: 'Zero Statistics' },
        { to: '/pair-correlation', label: 'Pair Correlation' },
      ]} />
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 10,
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 18, fontFamily: mono, color: accent || '#e2e8f0' }}>
        {value}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: mono }}>{label}</div>
      <div style={{ fontSize: 16, fontFamily: mono, color: color || '#e2e8f0', marginTop: 2 }}>{value}</div>
    </div>
  );
}
