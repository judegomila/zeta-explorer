// HardyZPage.jsx -- imp-1116
// Companion viz for HARDY_Z_ASYMPTOTIC (imp-1102).
// Three SVG panels: Z_main(t), Z_enhanced(t), and |error| vs O(t^{-1/4}) bound.
// NO App.jsx route edit (batched separately per ticket spec).
//
// Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
// viz logic and numbers, literal warm-palette hex in place of the dark
// slate palette.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { scaleLinear, scaleBand } from 'd3-scale';
import { HARDY_Z_ASYMPTOTIC } from '../data/hardy-z-asymptotic-comparison.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

const D  = HARDY_Z_ASYMPTOTIC;
const CT = D.correctionTable;
const ZC = D.zeroChecks;
const MS = D.meanSquare;

const W  = 860;
const PH = 200;
const M  = { top: 26, right: 24, bottom: 44, left: 64 };
const IW = W - M.left - M.right;
const IH = PH - M.top - M.bottom;

const mono = 'var(--ed-mono, var(--font-mono))';
const TF = { fontFamily: mono, fontSize: 9, fill: ED.inkFaint };
const LF = { fontFamily: mono, fontSize: 10, fill: ED.inkSoft };

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
      <line x1={0} x2={IW} stroke={ED.rule} />
      <line x1={-4} x2={0} stroke={ED.rule} />
      <text x={-7} y={3} textAnchor="end" style={TF}>{v.toFixed(2)}</text>
    </g>
  ));
}

function XTicksRow() {
  return KEYS.map((k, i) => {
    const cx = xB(k) + BW / 2;
    return (
      <g key={k} transform={`translate(${cx},${IH})`}>
        <line y1={0} y2={5} stroke={ED.rule} />
        <text y={18} textAnchor="middle" style={TF}>{DISP[i]}</text>
      </g>
    );
  });
}

function PanelFrame({ label }) {
  return (
    <>
      <line x1={0} x2={IW} y1={IH} y2={IH} stroke={ED.rule} />
      <line x1={0} x2={0} y1={0}  y2={IH} stroke={ED.rule} />
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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 6 }}>Hardy Z(t) Asymptotic Comparison (imp-1116)</h1>
        <p className="ed-lbl">Related: <Link to="/riemann-siegel-z">Riemann–Siegel Z(t)</Link></p>
          <AnimationEmbed id="gram-hardy" />
        <p style={{ color: 'var(--ink-faint)', fontSize: 14, marginBottom: 12, lineHeight: 1.6 }}>
          Three-panel view of Z(t) = exp(i&middot;theta(t)) &middot; zeta(1/2+it): main-sum-only
          approximation (Panel 1), C0+C1+C2 enhanced approximation (Panel 2), and
          the absolute correction difference versus the leading O(t^-1/4) scale
          (Panel 3). Data from imp-1102. Test t values: {CT.map(r => fmtT(r.t)).join(', ')}.
        </p>
        <div style={{ marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/explorations" style={{ color: 'var(--ink-faint)', fontFamily: mono, fontSize: 12 }}>
            &larr; Explorations
          </Link>
          <Link to="/zeta" style={{ color: 'var(--brass)', fontFamily: mono, fontSize: 12 }}>
            Zeta visualization
          </Link>
        </div>

        {/* Stat strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))',
          gap: 12,
        }}>
          <Stat label="Mean-square (obs)" value={MS.observed.toFixed(3)} />
          <Stat label="Titchmarsh (pred)" value={MS.titchmarshPredAtMid.toFixed(3)} />
          <Stat label="MS ratio" value={MS.ratio.toFixed(3)} accent={MS.ratio > 0.7 && MS.ratio < 1.6 ? ED.series3 : ED.series2} />
          <Stat label="Zeros in [100,130]" value={String(ZC.length)} />
          <Stat label="Zero checks pass" value={ZC.filter(r => r.absZ < 0.1).length + ' / ' + ZC.length} accent={ZC.every(r => r.absZ < 0.1) ? ED.series3 : ED.series2} />
          <Stat label="Theta residual" value={D.thetaAsymptotic.residual.toExponential(2)} />
        </div>

        {/* Panel 1: Z_main */}
        <div style={{ marginTop: 18, background: 'var(--paper-2)', border: '1px solid var(--rule)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: mono, marginBottom: 4 }}>
            Panel 1 — Z_main(t): main sum only, error O(t^-1/4)
          </div>
          <svg width={W} height={PH} role="img" aria-label="Z_main(t) bar chart">
            <g transform={`translate(${M.left},${M.top})`}>
              <YTicks yScale={yP1} count={5} />
              <XTicksRow />
              <PanelFrame label="Z_main" />
              <line x1={0} x2={IW} y1={yP1(0)} y2={yP1(0)} stroke={ED.rule} strokeDasharray="3,3" />
              {CT.map((r, i) => <Bar key={i} i={i} yScale={yP1} value={r.zMain} fill={ED.inkSoft} />)}
              {CT.map((r, i) => (
                <circle key={i} cx={xB(String(i)) + BW / 2} cy={yP1(r.zMain)} r={3} fill="#877b67" />
              ))}
              <text x={IW / 2} y={IH + 40} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>t</text>
            </g>
          </svg>
        </div>

        {/* Panel 2: Z_enhanced */}
        <div style={{ marginTop: 12, background: 'var(--paper-2)', border: '1px solid var(--rule)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: mono, marginBottom: 4 }}>
            Panel 2 — Z_enhanced(t): main sum + C0+C1+C2 correction, error O(t^-5/4)
          </div>
          <svg width={W} height={PH} role="img" aria-label="Z_enhanced(t) bar chart">
            <g transform={`translate(${M.left},${M.top})`}>
              <YTicks yScale={yP2} count={5} />
              <XTicksRow />
              <PanelFrame label="Z_enh" />
              <line x1={0} x2={IW} y1={yP2(0)} y2={yP2(0)} stroke={ED.rule} strokeDasharray="3,3" />
              {CT.map((r, i) => <Bar key={i} i={i} yScale={yP2} value={r.zEnhanced} fill={ED.series1} />)}
              {CT.map((r, i) => (
                <circle key={i} cx={xB(String(i)) + BW / 2} cy={yP2(r.zEnhanced)} r={3} fill={ED.series1} />
              ))}
              <text x={IW / 2} y={IH + 40} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>t</text>
            </g>
          </svg>
        </div>

        {/* Panel 3: corrDiff + tFactor */}
        <div style={{ marginTop: 12, background: 'var(--paper-2)', border: '1px solid var(--rule)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: mono, marginBottom: 4 }}>
            Panel 3 — absolute correction |Z_enh - Z_main| (terra) vs (t/(2pi))^(-1/4) scale (blue markers)
          </div>
          <svg width={W} height={PH} role="img" aria-label="Correction scaling">
            <g transform={`translate(${M.left},${M.top})`}>
              <YTicks yScale={yP3} count={5} />
              <XTicksRow />
              <PanelFrame label="|error|" />
              {CT.map((r, i) => <Bar key={i} i={i} yScale={yP3} value={r.corrDiff} fill={ED.series2} />)}
              {CT.map((r, i) => {
                const cx = xB(String(i)) + BW / 2;
                const cy = yP3(r.tFactor);
                return (
                  <g key={i}>
                    <line x1={cx - 6} x2={cx + 6} y1={cy} y2={cy} stroke={ED.series1} strokeWidth={2} />
                    <circle cx={cx} cy={cy} r={3.5} fill={ED.series1} stroke={ED.ink} strokeWidth={1} />
                  </g>
                );
              })}
              <text x={IW / 2} y={IH + 40} textAnchor="middle" style={{ ...LF, fontSize: 11 }}>t</text>
            </g>
          </svg>
          <div style={{ marginTop: 6, fontSize: 10, fontFamily: mono, color: 'var(--ink-soft)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span><span style={{ color: 'var(--accent)' }}>|</span> |Z_enh - Z_main|</span>
            <span><span style={{ color: 'var(--series-1)' }}>&#9679;</span> (t/(2pi))^(-1/4) reference scale</span>
          </div>
        </div>

        {/* Zero checks table */}
        <div className="card" style={{ marginTop: 20, padding: 14, background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--ink-faint)', letterSpacing: 0.5, marginBottom: 8 }}>
            Z(gamma_n) near-zero checks — known zeros in [100, 130]
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
              <thead>
                <tr style={{ background: 'var(--paper-3)' }}>
                  <th style={{ textAlign: 'left', padding: 6, color: 'var(--ink)' }}>n</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>gamma_n</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>|Z_enh(gamma_n)|</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>pass (&lt; 0.1)</th>
                </tr>
              </thead>
              <tbody>
                {ZC.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--rule)' }}>
                    <td style={{ padding: 6, color: 'var(--brass)' }}>{r.idx}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink)' }}>{r.gamma.toFixed(6)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink)' }}>{r.absZ.toExponential(4)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: r.absZ < 0.1 ? 'var(--series-3)' : 'var(--accent)' }}>
                      {r.absZ < 0.1 ? 'yes' : 'NO'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Correction table */}
        <div className="card" style={{ marginTop: 16, padding: 14, background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--ink-faint)', letterSpacing: 0.5, marginBottom: 8 }}>
            correction scaling table
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
              <thead>
                <tr style={{ background: 'var(--paper-3)' }}>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>t</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>N</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>Z_main</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>Z_enh</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>|diff|</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>(t/2pi)^(-1/4)</th>
                  <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>relBound</th>
                </tr>
              </thead>
              <tbody>
                {CT.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--rule)' }}>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--brass)' }}>{r.t}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink)' }}>{r.N}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink)' }}>{r.zMain.toFixed(5)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink)' }}>{r.zEnhanced.toFixed(5)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--accent)' }}>{r.corrDiff.toExponential(3)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: 'var(--series-1)' }}>{r.tFactor.toFixed(5)}</td>
                    <td style={{ padding: 6, textAlign: 'right', color: r.relBound < 2.0 ? 'var(--series-3)' : 'var(--accent)' }}>{r.relBound.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: 'var(--ink-faint)', lineHeight: 1.6 }}>
          Notes: Z(t) = exp(i&middot;theta(t))&middot;zeta(1/2+it) is real for real t; its zeros are exactly the
          nontrivial zeta-zeros on the critical line Re(s) = 1/2. The main sum runs to
          N = floor(sqrt(t/(2*pi))). Adding C0+C1+C2 correction reduces the remainder from
          O(t^-1/4) to O(t^-5/4). The relBound column (|diff|/tFactor) stays below 2.0
          by assertion. Data from imp-1102 (src/data/hardy-z-asymptotic-comparison.js).
        </div>

        {/* Related pages */}
        <div className="card" style={{ marginTop: 24, padding: 14, background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--ink-faint)', marginBottom: 8 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/gram-points" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Gram Points
            </Link>
            <Link to="/riemann-siegel-z" style={{ fontSize: 12, color: 'var(--series-1)', textDecoration: 'none' }}>
              → Riemann-Siegel Z(t)
            </Link>
            <Link to="/zeta" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              → Zeta Landscape
            </Link>
            <Link to="/statistics" style={{ fontSize: 12, color: 'var(--series-3)', textDecoration: 'none' }}>
              → Zero Statistics
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--paper-2)',
      border: '1px solid var(--rule)',
      borderRadius: 8,
      padding: 10,
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-faint)', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 18, fontFamily: mono, color: accent || 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
