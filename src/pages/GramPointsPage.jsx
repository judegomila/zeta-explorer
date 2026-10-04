// GramPointsPage.jsx -- imp-1122
// Gram point visualization and Gram law violations.
// Three panels: Z(g_n) scatter, violation density by block, spacing comparison.
// Plus exception table and interval analysis. 6 tripwires in data file.
// Editorial (warm) re-theme: full-width shell, identical structure/data.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { InlineMath } from '../components/KaTeXMath.jsx';
import { scaleLinear } from 'd3-scale';
import { GRAM_POINTS_DATA } from '../data/gram-points-numerical.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

const D  = GRAM_POINTS_DATA;
const SC = D.scatterSample;
const VB = D.violationBins;
const IA = D.intervalAnalysis;

const W  = 860;
const PH = 220;
const M  = { top: 26, right: 24, bottom: 44, left: 64 };
const IW = W - M.left - M.right;
const IH = PH - M.top - M.bottom;

const mono = 'var(--ed-mono, var(--font-mono))';
const TF = { fontFamily: mono, fontSize: 9, fill: 'var(--faint)' };
const LF = { fontFamily: mono, fontSize: 10, fill: 'var(--ink-soft)' };
const gridStroke = ED.rule;

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
      <line x1={0} x2={IW} stroke={gridStroke} />
      <line x1={-4} x2={0} stroke={gridStroke} />
      <text x={-7} y={3} textAnchor="end" style={TF}>{typeof v === 'number' && Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2)}</text>
    </g>
  ));
}

function PanelFrame({ label }) {
  return (
    <>
      <line x1={0} x2={IW} y1={IH} y2={IH} stroke={gridStroke} />
      <line x1={0} x2={0} y1={0} y2={IH} stroke={gridStroke} />
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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 22 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>
            Gram Points and Gram Law Violations{' '}
            <span style={{ fontSize: '0.5em', fontFamily: mono, color: 'var(--faint)', fontWeight: 400 }}>
              (imp-1122)
            </span>
          </h1>
          <AnimationEmbed id="gram-hardy" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 780 }}>
            Gram points <InlineMath tex="g_n" /> solve <InlineMath tex="\theta(g_n)=n\pi" />,
            where theta is the Riemann-Siegel theta function. Gram&apos;s law (1903) predicts{' '}
            <InlineMath tex="\operatorname{sgn} Z(g_n) = (-1)^n" />. Violations are rare but
            infinite; the first exception is at n=126 (Hutchinson 1925). This page visualizes
            the first {D.totalComputed} Gram points, their Z-values, violation patterns, and
            spacing statistics.
          </p>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link
              to="/explorations"
              style={{
                color: 'var(--faint)',
                fontFamily: mono,
                fontSize: 12,
                textDecoration: 'none',
                padding: '4px 10px',
                border: '1px solid var(--hairline)',
                borderRadius: 6,
              }}
            >
              &larr; Explorations
            </Link>
            <Link
              to="/zeta"
              style={{
                color: 'var(--brass)',
                fontFamily: mono,
                fontSize: 12,
                textDecoration: 'none',
                padding: '4px 10px',
                border: '1px solid var(--brass)',
                borderRadius: 6,
              }}
            >
              Zeta visualization &rarr;
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
          <Stat label="Violations" value={String(D.totalViolations)} accent={ED.series2} />
          <Stat label="Violation rate" value={D.violationRate + '%'} accent={D.violationRate > 15 && D.violationRate < 40 ? 'var(--brass-dk)' : 'var(--terra-dk)'} />
          <Stat label="1st exception" value={D.firstException ? 'n=' + D.firstException.n : '?'} accent={ED.series1} />
          <Stat label="Spacing ratio" value={String(D.spacing.ratio)} accent={D.spacing.ratio > 0.7 && D.spacing.ratio < 1.5 ? 'var(--green)' : 'var(--terra-dk)'} />
          <Stat label="1-zero intervals" value={IA.gramLawIntervalPct + '%'} accent={IA.gramLawIntervalPct > 50 ? 'var(--green)' : 'var(--terra-dk)'} />
        </div>

        {/* Finite-window provenance: scope the violation-rate number */}
        <div style={{
          marginTop: 10,
          fontSize: 11.5,
          lineHeight: 1.5,
          color: 'var(--faint)',
          fontFamily: mono,
          background: 'var(--paper2)',
          border: '1px solid var(--hairline)',
          borderLeft: '3px solid var(--faint)',
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
        <div style={{ marginTop: 18, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: mono, marginBottom: 4 }}>
            Panel 1 — Z(g_n) at each Gram point: green = obeys Gram&apos;s law, red = violation
          </div>
          <svg width={W} height={PH} role="img" aria-label="Z(g_n) scatter plot">
            <g transform={`translate(${M.left},${M.top})`}>
              <YTicks yScale={yP1} count={5} />
              <PanelFrame label="Z(g_n)" />
              <line x1={0} x2={IW} y1={yP1(0)} y2={yP1(0)} stroke={gridStroke} strokeDasharray="3,3" />
              {SC.map((p, i) => (
                <circle
                  key={i}
                  cx={xP1(p.n)}
                  cy={yP1(p.Z)}
                  r={p.obeys ? 1.5 : 3}
                  fill={p.obeys ? 'var(--green)' : 'var(--terra-dk)'}
                  fillOpacity={p.obeys ? 0.5 : 0.9}
                />
              ))}
              <text x={IW / 2} y={IH + 36} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>Gram index n</text>
            </g>
          </svg>
          <div style={{ marginTop: 4, fontSize: 10, fontFamily: mono, color: 'var(--ink-soft)', display: 'flex', gap: 16 }}>
            <span><span style={{ color: 'var(--green)' }}>&#9679;</span> obeys Gram&apos;s law</span>
            <span><span style={{ color: 'var(--terra-dk)' }}>&#9679;</span> violation</span>
          </div>
        </div>

        {/* Panel 2: violation density by block */}
        <div style={{ marginTop: 12, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: mono, marginBottom: 4 }}>
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
                    <rect x={x} y={yP2(b.rate)} width={barW} height={h} fill={ED.brass} fillOpacity={0.8} />
                    <text x={x + barW / 2} y={IH + 16} textAnchor="middle" style={TF}>{b.range.split('-')[0]}</text>
                  </g>
                );
              })}
              <line x1={0} x2={IW} y1={yP2(D.violationRate)} y2={yP2(D.violationRate)} stroke={ED.brassDeco} strokeDasharray="4,3" strokeWidth={1.5} />
              <text x={IW + 4} y={yP2(D.violationRate) + 3} style={{ ...TF, fill: 'var(--brass-dk)' }}>avg</text>
              <text x={IW / 2} y={IH + 36} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>block start n</text>
            </g>
          </svg>
        </div>

        {/* Panel 3: Gram spacing vs zero spacing */}
        <div style={{ marginTop: 12, background: 'var(--paper2)', border: '1px solid var(--hairline)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
          <div style={{ fontSize: 11, color: 'var(--faint)', fontFamily: mono, marginBottom: 4 }}>
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
                    stroke={ED.series1} strokeWidth={1.5}
                  />
                );
              })}
              {spacings.map((s, i) => (
                <circle key={i} cx={xP3(i)} cy={yP3(s.gSp)} r={2} fill={ED.series1} />
              ))}
              <text x={IW / 2} y={IH + 36} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>index</text>
            </g>
          </svg>
          <div style={{ marginTop: 4, fontSize: 10, fontFamily: mono, color: 'var(--ink-soft)' }}>
            Avg Gram spacing: {D.spacing.avgGramSpacing} | Avg zero spacing: {D.spacing.avgZeroSpacing} | Ratio: {D.spacing.ratio} (asymptotically 1)
          </div>
        </div>

        {/* Interval analysis card */}
        <div className="card" style={{ marginTop: 20, padding: 14 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5, marginBottom: 8 }}>
            zeros per Gram interval distribution
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            <MiniStat label="Total intervals" value={IA.totalIntervals} />
            <MiniStat label="0 zeros (empty)" value={IA.empty} color={ED.accent} />
            <MiniStat label="1 zero (normal)" value={IA.single} color={ED.series3} />
            <MiniStat label="2+ zeros" value={IA.double} color={ED.brass} />
            <MiniStat label="Zeros checked" value={IA.zerosChecked} color={ED.series1} />
          </div>
        </div>

        {/* Exception table */}
        <div className="card" style={{ marginTop: 16, padding: 14 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5, marginBottom: 8 }}>
            Gram law exceptions ({D.totalViolations} total)
            {D.violations.length > 20 && (
              <button
                onClick={() => setShowAll(s => !s)}
                style={{
                  marginLeft: 12, background: 'var(--paper)', border: '1px solid var(--hairline)',
                  borderRadius: 4, color: 'var(--ink-soft)', fontSize: 10, padding: '2px 8px',
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
                <tr style={{ background: 'var(--paper)' }}>
                  <th style={{ textAlign: 'left', padding: 6 }}>n</th>
                  <th style={{ textAlign: 'right', padding: 6 }}>g_n</th>
                  <th style={{ textAlign: 'right', padding: 6 }}>Z(g_n)</th>
                  <th style={{ textAlign: 'center', padding: 6 }}>expected</th>
                  <th style={{ textAlign: 'center', padding: 6 }}>actual</th>
                </tr>
              </thead>
              <tbody>
                {exceptionsToShow.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--hairline)' }}>
                    <td style={{ padding: 6, color: r.n === 126 ? 'var(--brass-dk)' : 'var(--terra-dk)' }}>
                      {r.n}{r.n === 126 ? ' *' : ''}
                    </td>
                    <td style={{ padding: 6, textAlign: 'right' }}>{r.g.toFixed(4)}</td>
                    <td style={{ padding: 6, textAlign: 'right' }}>{r.Z.toFixed(6)}</td>
                    <td style={{ padding: 6, textAlign: 'center' }}>{r.expectedSign > 0 ? '+' : '-'}</td>
                    <td style={{ padding: 6, textAlign: 'center', color: 'var(--terra-dk)' }}>{r.actualSign > 0 ? '+' : r.actualSign < 0 ? '-' : '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {D.firstException && (
            <div style={{ marginTop: 8, fontSize: 10, fontFamily: mono, color: 'var(--brass-dk)' }}>
              * n=126: first Gram exception (Hutchinson 1925). Z(g_126) = {D.firstException.Z},
              expected sign {D.firstException.expectedSign > 0 ? '+' : '-'},
              got {D.firstException.actualSign > 0 ? '+' : D.firstException.actualSign < 0 ? '-' : '0'}.
            </div>
          )}
        </div>

        {/* First 20 Gram points table */}
        <div className="card" style={{ marginTop: 16, padding: 14 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5, marginBottom: 8 }}>
            first 20 Gram points
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
              <thead>
                <tr style={{ background: 'var(--paper)' }}>
                  <th style={{ textAlign: 'left', padding: 6 }}>n</th>
                  <th style={{ textAlign: 'right', padding: 6 }}>g_n</th>
                  <th style={{ textAlign: 'right', padding: 6 }}>Z(g_n)</th>
                  <th style={{ textAlign: 'center', padding: 6 }}>Gram&apos;s law</th>
                </tr>
              </thead>
              <tbody>
                {D.allGrams.slice(0, 20).map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--hairline)' }}>
                    <td style={{ padding: 6, color: 'var(--blue)' }}>{r.n}</td>
                    <td style={{ padding: 6, textAlign: 'right' }}>{r.g.toFixed(6)}</td>
                    <td style={{ padding: 6, textAlign: 'right' }}>{r.Z.toFixed(6)}</td>
                    <td style={{ padding: 6, textAlign: 'center', color: r.obeys ? 'var(--green)' : 'var(--terra-dk)' }}>
                      {r.obeys ? 'obeys' : 'VIOLATES'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rigor caveat: Gram's law is a heuristic, not a theorem */}
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
          borderRadius: 6,
          fontSize: 11,
          fontFamily: mono,
          color: 'var(--terra-dk)',
          lineHeight: 1.7,
        }}>
          <strong>Gram&apos;s law is an empirical rule of thumb, NOT a theorem.</strong>
          {' '}Titchmarsh (1935) proved violations occur infinitely often, and the violation
          rate grows without bound. Rigorous zero-counting therefore requires Turing&apos;s
          method (1953) — which uses Gram blocks plus explicit error terms — rather than
          relying on Gram&apos;s law alone. The Hardy Z-function values plotted above are
          exactly the Z(g_n) inputs that Turing&apos;s method needs; see{' '}
          <Link to="/hardy-z" style={{ color: 'var(--terra-dk)', textDecoration: 'underline' }}>/hardy-z</Link>
          {' '}and{' '}
          <Link to="/riemann-siegel-z" style={{ color: 'var(--terra-dk)', textDecoration: 'underline' }}>/riemann-siegel-z</Link>.
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--faint)', lineHeight: 1.6 }}>
          Notes: Gram points g_n are defined by theta(g_n) = n*pi where theta is the
          Riemann-Siegel theta function. Gram&apos;s law states sgn Z(g_n) = (-1)^n. Violations
          are expected (~27% in this range). The violation rate increases slowly with height.
          Gram spacings are asymptotically equal to zero spacings: 2*pi / log(t/(2*pi)).
          Rosser&apos;s rule uses blocks of consecutive Gram intervals to certify zero counts
          rigorously. Data from imp-1122 (src/data/gram-points-numerical.js).
        </div>

        {/* ── Related pages ─────────────────────────────────────────────── */}
        <div className="card" style={{
          marginTop: 24,
          background: 'var(--paper2)',
          border: '1px solid var(--hairline)',
          borderLeft: '3px solid var(--brass)',
          borderRadius: 8,
          padding: '16px 18px',
        }}>
          <div style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'var(--faint)',
            marginBottom: 10,
          }}>
            Related Pages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/hardy-z" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>&rarr; Hardy Z-Function</Link>
            <Link to="/riemann-siegel-z" style={{ color: 'var(--terra-dk)', fontSize: 13, textDecoration: 'none' }}>&rarr; Riemann-Siegel Z(t)</Link>
            <Link to="/zeta" style={{ color: 'var(--brass-dk)', fontSize: 13, textDecoration: 'none' }}>&rarr; Zeta Landscape</Link>
            <Link to="/statistics" style={{ color: 'var(--green)', fontSize: 13, textDecoration: 'none' }}>&rarr; Zero Statistics</Link>
            <Link to="/pair-correlation" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>&rarr; Pair Correlation</Link>
            <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13, textDecoration: 'none' }}>&larr; the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--paper2)',
      border: '1px solid var(--hairline)',
      borderRadius: 8,
      padding: 10,
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 18, fontFamily: mono, color: accent || 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'var(--faint)', fontFamily: mono }}>{label}</div>
      <div style={{ fontSize: 16, fontFamily: mono, color: color || 'var(--ink)', marginTop: 2 }}>{value}</div>
    </div>
  );
}
