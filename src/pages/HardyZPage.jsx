// HardyZPage.jsx -- imp-1116
// Companion viz for HARDY_Z_ASYMPTOTIC (imp-1102).
// Three SVG panels: Z_main(t), Z_enhanced(t), and |error| vs O(t^{-1/4}) bound.
// NO App.jsx route edit (batched separately per ticket spec).

import React from 'react';
import { Link } from 'react-router-dom';
import RelatedLinks from '../components/RelatedLinks.jsx';
import { scaleLinear, scaleBand } from 'd3-scale';
import { HARDY_Z_ASYMPTOTIC } from '../data/hardy-z-asymptotic-comparison.js';

const D  = HARDY_Z_ASYMPTOTIC;
const CT = D.correctionTable;
const ZC = D.zeroChecks;
const MS = D.meanSquare;

const W  = 860;
const PH = 200;
const M  = { top: 26, right: 24, bottom: 44, left: 64 };
const IW = W - M.left - M.right;
const IH = PH - M.top - M.bottom;

const mono = 'var(--font-mono)';
const TF = { fontFamily: mono, fontSize: 9, fill: '#94a3b8' };
const LF = { fontFamily: mono, fontSize: 10, fill: 'var(--text-secondary)' };

function fmtT(t) {
  if (t >= 10000) return '10k';
  if (t >= 1000)  return (t / 1000).toFixed(1) + 'k';
  return t.toFixed(0);
}

const KEYS = CT.map((_, i) => String(i));
const DISP = CT.map(r => fmtT(r.t));
const xB   = scaleBand().domain(KEYS).range([0, IW]).padding(0.35);
const BW   = xB.bandwidth();

const zmMax  = Math.max(1, ...CT.map(r => Math.abs(r.zMain)));
const yP1    = scaleLinear().domain([-zmMax, zmMax]).range([IH, 0]);

const zeMax  = Math.max(1, ...CT.map(r => Math.abs(r.zEnhanced)));
const yP2    = scaleLinear().domain([-zeMax, zeMax]).range([IH, 0]);

const cdMax  = Math.max(0.001, ...CT.map(r => r.corrDiff));
const tfMax  = Math.max(...CT.map(r => r.tFactor));
const yP3max = Math.max(cdMax, tfMax) * 1.15;
const yP3    = scaleLinear().domain([0, yP3max]).range([IH, 0]);

function YTicks({ yScale, count }) {
  return yScale.ticks(count || 4).map(v => (
    <g key={v} transform={`translate(0,${yScale(v)})`}>
      <line x1={0} x2={IW} stroke="#1e293b" />
      <line x1={-4} x2={0} stroke="#475569" />
      <text x={-7} y={3} textAnchor="end" style={TF}>{v.toFixed(2)}</text>
    </g>
  ));
}

function XTicksRow() {
  return KEYS.map((k, i) => {
    const cx = xB(k) + BW / 2;
    return (
      <g key={k} transform={`translate(${cx},${IH})`}>
        <line y1={0} y2={5} stroke="#475569" />
        <text y={18} textAnchor="middle" style={TF}>{DISP[i]}</text>
      </g>
    );
  });
}

function PanelFrame({ label }) {
  return (
    <>
      <line x1={0} x2={IW} y1={IH} y2={IH} stroke="#475569" />
      <line x1={0} x2={0} y1={0}  y2={IH} stroke="#475569" />
      <text transform={`translate(-50,${IH / 2}) rotate(-90)`} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>
        {label}
      </text>
    </>
  );
}

function Bar({ i, yScale, value, fill }) {
  const x  = xB(String(i));
  const y0 = yScale(0);
  const y1 = yScale(value);
  return <rect x={x} y={Math.min(y0, y1)} width={BW} height={Math.abs(y0 - y1)} fill={fill} fillOpacity={0.8} />;
}

export default function HardyZPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Hardy Z(t) Asymptotic Comparison (imp-1116)</h1>
        <p className="page-subtitle">
          Three-panel view of Z(t) = exp(i*theta(t)) * zeta(1/2+it): main-sum-only
          approximation (Panel 1), C0+C1+C2 enhanced approximation (Panel 2), and
          the absolute correction difference versus the leading O(t^-1/4) scale
          (Panel 3). Data from imp-1102. Test t values: {CT.map(r => fmtT(r.t)).join(', ')}.
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))',
        gap: 12,
      }}>
        <Stat label="Mean-square (obs)" value={MS.observed.toFixed(3)} />
        <Stat label="Titchmarsh (pred)" value={MS.titchmarshPredAtMid.toFixed(3)} />
        <Stat label="MS ratio" value={MS.ratio.toFixed(3)} accent={MS.ratio > 0.7 && MS.ratio < 1.6 ? '#86efac' : '#fca5a5'} />
        <Stat label="Zeros in [100,130]" value={String(ZC.length)} />
        <Stat label="Zero checks pass" value={ZC.filter(r => r.absZ < 0.1).length + ' / ' + ZC.length} accent={ZC.every(r => r.absZ < 0.1) ? '#86efac' : '#fca5a5'} />
        <Stat label="Theta residual" value={D.thetaAsymptotic.residual.toExponential(2)} />
      </div>

      {/* Panel 1: Z_main */}
      <div style={{ marginTop: 18, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: mono, marginBottom: 4 }}>
          Panel 1 — Z_main(t): main sum only, error O(t^-1/4)
        </div>
        <svg width={W} height={PH} role="img" aria-label="Z_main(t) bar chart">
          <g transform={`translate(${M.left},${M.top})`}>
            <YTicks yScale={yP1} count={5} />
            <XTicksRow />
            <PanelFrame label="Z_main" />
            <line x1={0} x2={IW} y1={yP1(0)} y2={yP1(0)} stroke="#475569" strokeDasharray="3,3" />
            {CT.map((r, i) => <Bar key={i} i={i} yScale={yP1} value={r.zMain} fill="#64748b" />)}
            {CT.map((r, i) => (
              <circle key={i} cx={xB(String(i)) + BW / 2} cy={yP1(r.zMain)} r={3} fill="#94a3b8" />
            ))}
            <text x={IW / 2} y={IH + 40} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>t</text>
          </g>
        </svg>
      </div>

      {/* Panel 2: Z_enhanced */}
      <div style={{ marginTop: 12, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: mono, marginBottom: 4 }}>
          Panel 2 — Z_enhanced(t): main sum + C0+C1+C2 correction, error O(t^-5/4)
        </div>
        <svg width={W} height={PH} role="img" aria-label="Z_enhanced(t) bar chart">
          <g transform={`translate(${M.left},${M.top})`}>
            <YTicks yScale={yP2} count={5} />
            <XTicksRow />
            <PanelFrame label="Z_enh" />
            <line x1={0} x2={IW} y1={yP2(0)} y2={yP2(0)} stroke="#475569" strokeDasharray="3,3" />
            {CT.map((r, i) => <Bar key={i} i={i} yScale={yP2} value={r.zEnhanced} fill="#0891b2" />)}
            {CT.map((r, i) => (
              <circle key={i} cx={xB(String(i)) + BW / 2} cy={yP2(r.zEnhanced)} r={3} fill="#22d3ee" />
            ))}
            <text x={IW / 2} y={IH + 40} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>t</text>
          </g>
        </svg>
      </div>

      {/* Panel 3: corrDiff + tFactor */}
      <div style={{ marginTop: 12, background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: mono, marginBottom: 4 }}>
          Panel 3 — absolute correction |Z_enh - Z_main| (orange) vs (t/(2pi))^(-1/4) scale (blue markers)
        </div>
        <svg width={W} height={PH} role="img" aria-label="Correction scaling">
          <g transform={`translate(${M.left},${M.top})`}>
            <YTicks yScale={yP3} count={5} />
            <XTicksRow />
            <PanelFrame label="|error|" />
            {CT.map((r, i) => <Bar key={i} i={i} yScale={yP3} value={r.corrDiff} fill="#f97316" />)}
            {CT.map((r, i) => {
              const cx = xB(String(i)) + BW / 2;
              const cy = yP3(r.tFactor);
              return (
                <g key={i}>
                  <line x1={cx - 6} x2={cx + 6} y1={cy} y2={cy} stroke="#60a5fa" strokeWidth={2} />
                  <circle cx={cx} cy={cy} r={3.5} fill="#3b82f6" stroke="#0f172a" strokeWidth={1} />
                </g>
              );
            })}
            <text x={IW / 2} y={IH + 40} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>t</text>
          </g>
        </svg>
        <div style={{ marginTop: 6, fontSize: 10, fontFamily: mono, color: 'var(--text-secondary)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span><span style={{ color: '#f97316' }}>|</span> |Z_enh - Z_main|</span>
          <span><span style={{ color: '#3b82f6' }}>&#9679;</span> (t/(2pi))^(-1/4) reference scale</span>
        </div>
      </div>

      {/* Zero checks table */}
      <div className="card" style={{ marginTop: 20, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 8 }}>
          Z(gamma_n) near-zero checks — known zeros in [100, 130]
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ textAlign: 'left', padding: 6 }}>n</th>
                <th style={{ textAlign: 'right', padding: 6 }}>gamma_n</th>
                <th style={{ textAlign: 'right', padding: 6 }}>|Z_enh(gamma_n)|</th>
                <th style={{ textAlign: 'right', padding: 6 }}>pass (&lt; 0.1)</th>
              </tr>
            </thead>
            <tbody>
              {ZC.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: 6, color: '#a855f7' }}>{r.idx}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.gamma.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.absZ.toExponential(4)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: r.absZ < 0.1 ? '#86efac' : '#fca5a5' }}>
                    {r.absZ < 0.1 ? 'yes' : 'NO'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correction table */}
      <div className="card" style={{ marginTop: 16, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 8 }}>
          correction scaling table
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ textAlign: 'right', padding: 6 }}>t</th>
                <th style={{ textAlign: 'right', padding: 6 }}>N</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Z_main</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Z_enh</th>
                <th style={{ textAlign: 'right', padding: 6 }}>|diff|</th>
                <th style={{ textAlign: 'right', padding: 6 }}>(t/2pi)^(-1/4)</th>
                <th style={{ textAlign: 'right', padding: 6 }}>relBound</th>
              </tr>
            </thead>
            <tbody>
              {CT.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: 6, textAlign: 'right', color: '#a855f7' }}>{r.t}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.N}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.zMain.toFixed(5)}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.zEnhanced.toFixed(5)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#f97316' }}>{r.corrDiff.toExponential(3)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#60a5fa' }}>{r.tFactor.toFixed(5)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: r.relBound < 2.0 ? '#86efac' : '#fca5a5' }}>{r.relBound.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Notes: Z(t) = exp(i*theta(t))*zeta(1/2+it) is real for real t; its zeros are exactly the
        nontrivial zeta-zeros on the critical line Re(s) = 1/2. The main sum runs to
        N = floor(sqrt(t/(2*pi))). Adding C0+C1+C2 correction reduces the remainder from
        O(t^-1/4) to O(t^-5/4). The relBound column (|diff|/tFactor) stays below 2.0
        by assertion. Data from imp-1102 (src/data/hardy-z-asymptotic-comparison.js).
      </div>

      <RelatedLinks links={[
        { to: '/gram-points', label: 'Gram Points' },
        { to: '/riemann-siegel-z', label: 'Riemann-Siegel Z(t)' },
        { to: '/zeta', label: 'Zeta Landscape' },
        { to: '/statistics', label: 'Zero Statistics' },
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
