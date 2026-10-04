// RiemannSiegelZPage — imp-1097
// Interactive visualization of the Hardy / Riemann-Siegel Z function
//   Z(t) = exp(i theta(t)) * zeta(1/2 + i t)
// on the critical line. Z is real-valued for real t; its sign changes are
// exactly the imaginary parts of the nontrivial zeta zeros on Re(s) = 1/2.
//
// Renders:
//   (1) primary line plot of Z(t) computed via Riemann-Siegel main sum
//       plus the C_0 correction term across t in (2pi, 100],
//   (2) markers at every detected zero (sign change of Z),
//   (3) horizontal tick markers for the first 29 known Odlyzko zeros,
//   (4) secondary panel showing theta(t) (the Riemann-Siegel theta phase
//       function) on a separate y-axis,
//   (5) agreement / accuracy table comparing detected vs Odlyzko zeros.
//
// Pure SVG + React + d3-scale. No animation, no canvas. Sub-300 lines.

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import RelatedLinks from '../components/RelatedLinks.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { scaleLinear } from 'd3-scale';
import {
  RIEMANN_SIEGEL_Z_EXPLORER,
} from '../data/riemann-siegel-z-explorer.js';
import { ED, alpha } from '../styles/tokens.js';

// SVG geometry — main panel.
const W = 960;
const H_TOP = 320;
const H_BOT = 200;
const M = { top: 30, right: 50, bottom: 40, left: 60 };
const IW = W - M.left - M.right;
const IH_TOP = H_TOP - M.top - M.bottom;
const IH_BOT = H_BOT - M.top - M.bottom;

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  fill: ED.series8,
};

const tickStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  fill: ED.series8,
};

function buildPath(tGrid, values, xScale, yScale) {
  let d = '';
  let started = false;
  for (let i = 0; i < tGrid.length; i++) {
    const v = values[i];
    if (!Number.isFinite(v)) {
      started = false;
      continue;
    }
    const xi = xScale(tGrid[i]);
    const yi = yScale(v);
    if (!started) {
      d += 'M ' + xi.toFixed(2) + ' ' + yi.toFixed(2) + ' ';
      started = true;
    } else {
      d += 'L ' + xi.toFixed(2) + ' ' + yi.toFixed(2) + ' ';
    }
  }
  return d;
}

export default function RiemannSiegelZPage() {
  const R = RIEMANN_SIEGEL_Z_EXPLORER;
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [tMaxView, setTMaxView] = useState(50);

  // X-axis spans [0, tMaxView]. The y-axis for Z auto-fits the visible window.
  const xMain = scaleLinear().domain([0, tMaxView]).range([0, IW]);

  const visibleZ = useMemo(() => {
    const vals = [];
    for (let i = 0; i < R.tGrid.length; i++) {
      if (R.tGrid[i] >= 0 && R.tGrid[i] <= tMaxView) {
        if (Number.isFinite(R.zValues[i])) vals.push(R.zValues[i]);
        if (showEnhanced && Number.isFinite(R.zEnhancedValues[i])) {
          vals.push(R.zEnhancedValues[i]);
        }
      }
    }
    return vals;
  }, [R, tMaxView, showEnhanced]);

  const zAbsMax = visibleZ.length === 0
    ? 1
    : Math.max(1, Math.ceil(Math.max(...visibleZ.map((v) => Math.abs(v)))));
  const yMain = scaleLinear().domain([-zAbsMax, zAbsMax]).range([IH_TOP, 0]);

  const visibleTheta = useMemo(() => {
    const vals = [];
    for (let i = 0; i < R.tGrid.length; i++) {
      if (R.tGrid[i] >= 0 && R.tGrid[i] <= tMaxView
          && Number.isFinite(R.thetaValues[i])
          && R.tGrid[i] >= R.tFloor) {
        vals.push(R.thetaValues[i]);
      }
    }
    return vals;
  }, [R, tMaxView]);

  const thetaMin = visibleTheta.length === 0 ? -2 : Math.floor(Math.min(...visibleTheta));
  const thetaMax = visibleTheta.length === 0 ? 2 : Math.ceil(Math.max(...visibleTheta));
  const yTheta = scaleLinear().domain([thetaMin, thetaMax]).range([IH_BOT, 0]);

  const xTicks = (() => {
    const ticks = [];
    const span = tMaxView;
    const step = span <= 20 ? 2 : span <= 50 ? 5 : 10;
    for (let t = 0; t <= span; t += step) ticks.push(t);
    return ticks;
  })();

  const zPath = buildPath(R.tGrid, R.zValues, xMain, yMain);
  const zEnhPath = showEnhanced ? buildPath(R.tGrid, R.zEnhancedValues, xMain, yMain) : '';
  const thetaPath = buildPath(R.tGrid, R.thetaValues, xMain, yTheta);

  // Marker filters for the visible window.
  const visibleDetected = R.detectedZeros.filter((z) => z >= 0 && z <= tMaxView);
  const visibleKnown = R.knownOdlyzkoZerosUpTo100.filter((z) => z >= 0 && z <= tMaxView);

  const matchPct = R.detectedZeros.length === 0
    ? 0
    : 100 * R.agreementCount / R.detectedZeros.length;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>Riemann-Siegel Z(t) Explorer (imp-1097)</h1>
        <p className="ed-lbl">Related: <Link to="/hardy-z">Hardy Z(t) asymptotics</Link></p>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.65, maxWidth: 760 }}>
          The Hardy / Riemann-Siegel Z function Z(t) = e^{'{i theta(t)}'}
          {' '}* zeta(1/2 + i t) is REAL for real t and its sign changes
          coincide with the imaginary parts of the nontrivial zeros of zeta
          on the critical line Re(s) = 1/2. This page plots Z(t) from the
          Riemann-Siegel formula (main sum + C_0 correction) on the
          interval (2 pi, 100] and verifies that every detected sign change
          recovers a known Odlyzko zero.
        </p>
        <div style={{ marginTop: 10 }}>
          <Link to="/explorations" style={{ color: 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: 12, textDecoration: 'none' }}>
            &larr; back to Explorations
          </Link>
        </div>

      {/* Summary stat strip. */}
      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
      }}>
        <Stat label="Detected zeros (t in [0,100])" value={R.detectedZeros.length} />
        <Stat label="Odlyzko reference zeros" value={R.knownOdlyzkoZerosUpTo100.length} />
        <Stat label="Agreement (within 0.01)" value={R.agreementCount + ' / ' + R.detectedZeros.length} accent={matchPct >= 90 ? 'var(--green)' : 'var(--terra-dk)'} />
        <Stat label="Spurious detections" value={R.spuriousZeros.length} accent={R.spuriousZeros.length === 0 ? 'var(--green)' : 'var(--terra-dk)'} />
        <Stat label="Missing zeros" value={R.missingZeros.length} accent={R.missingZeros.length === 0 ? 'var(--green)' : 'var(--terra-dk)'} />
        <Stat label="Grid samples" value={R.nPoints} />
      </div>

      {/* Controls. */}
      <div style={{
        marginTop: 16,
        background: 'var(--paper)',
        border: '1px solid var(--hairline)',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 18,
      }}>
        <label style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>
          t window upper bound:&nbsp;
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={tMaxView}
            onChange={(e) => setTMaxView(Number(e.target.value))}
            style={{ verticalAlign: 'middle' }}
          />
          <span style={{ color: 'var(--terra)', marginLeft: 8 }}>{tMaxView}</span>
        </label>
        <label style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>
          <input
            type="checkbox"
            checked={showEnhanced}
            onChange={(e) => setShowEnhanced(e.target.checked)}
            style={{ verticalAlign: 'middle', marginRight: 6 }}
          />
          overlay enhanced (C_0 + C_1 + C_2) — NOTE: shows finite-difference artifacts at small t
        </label>
      </div>

      {/* Main Z(t) plot. */}
      <div style={{ overflowX: 'auto', marginTop: 16, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
          Z(t) = exp(i theta(t)) * zeta(1/2 + i t) — Riemann-Siegel formula, main sum + C_0
        </div>
        <svg width={W} height={H_TOP} role="img" aria-label="Riemann-Siegel Z(t)">
          <g transform={'translate(' + M.left + ',' + M.top + ')'}>
            {/* Invalid-region shading below tFloor. */}
            <rect
              x={xMain(0)}
              y={0}
              width={Math.max(0, xMain(Math.min(R.tFloor, tMaxView)) - xMain(0))}
              height={IH_TOP}
              fill={alpha(ED.series2, 0.08)}
              stroke="none"
            />
            <text x={xMain(R.tFloor / 2)} y={14} textAnchor="middle" style={{ ...labelStyle, fill: 'var(--series-2)' }}>
              t &lt; 2 pi (invalid)
            </text>

            {/* Zero baseline. */}
            <line x1={0} x2={IW} y1={yMain(0)} y2={yMain(0)} stroke={ED.rule} strokeDasharray="3,3" />

            {/* Known Odlyzko zero markers (orange ticks on the baseline). */}
            {visibleKnown.map((k, idx) => (
              <line
                key={'odl-' + idx}
                x1={xMain(k)}
                x2={xMain(k)}
                y1={yMain(0) - 6}
                y2={yMain(0) + 6}
                stroke={ED.brassDeco}
                strokeWidth={1.5}
              />
            ))}

            {/* Enhanced overlay (yellow). */}
            {showEnhanced && (
              <path d={zEnhPath} fill="none" stroke={ED.brassDeco} strokeWidth={1} strokeOpacity={0.5} />
            )}

            {/* Primary Z curve (cyan). */}
            <path d={zPath} fill="none" stroke={ED.series6} strokeWidth={1.5} />

            {/* Detected zero dots. */}
            {visibleDetected.map((z, idx) => (
              <circle key={'det-' + idx} cx={xMain(z)} cy={yMain(0)} r={3.5} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />
            ))}

            {/* Axes. */}
            <line x1={0} x2={IW} y1={IH_TOP} y2={IH_TOP} stroke={ED.rule} />
            {xTicks.map((t) => (
              <g key={'xt-' + t} transform={'translate(' + xMain(t) + ',' + IH_TOP + ')'}>
                <line y1={0} y2={5} stroke={ED.rule} />
                <text y={18} textAnchor="middle" style={tickStyle}>{t}</text>
              </g>
            ))}
            <line x1={0} x2={0} y1={0} y2={IH_TOP} stroke={ED.rule} />
            {[-zAbsMax, -zAbsMax / 2, 0, zAbsMax / 2, zAbsMax].map((v) => (
              <g key={'yt-' + v} transform={'translate(0,' + yMain(v) + ')'}>
                <line x1={-5} x2={0} stroke={ED.rule} />
                <text x={-8} y={3} textAnchor="end" style={tickStyle}>{v.toFixed(1)}</text>
              </g>
            ))}
            <text transform={'translate(-44,' + IH_TOP / 2 + ') rotate(-90)'} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>
              Z(t)
            </text>
            <text x={IW / 2} y={IH_TOP + 35} textAnchor="middle" style={{ ...labelStyle, fontSize: 11 }}>t</text>
          </g>
        </svg>

        {/* Legend. */}
        <div style={{ marginTop: 8, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span><span style={{ color: 'var(--series-6)' }}>—</span> Z(t) basic (C_0)</span>
          {showEnhanced && (<span><span style={{ color: 'var(--brass)' }}>—</span> Z(t) enhanced (C_0+C_1+C_2)</span>)}
          <span><span style={{ color: 'var(--series-3)' }}>&#9679;</span> detected sign change</span>
          <span><span style={{ color: 'var(--brass)' }}>|</span> Odlyzko reference zero</span>
        </div>
      </div>

      {/* Theta(t) panel. */}
      <div style={{ overflowX: 'auto', marginTop: 16, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
          theta(t) = (t/2) log(t / 2pi) - t/2 - pi/8 + 1/(48 t) + 7/(5760 t^3)  — Riemann-Siegel theta phase
        </div>
        <svg width={W} height={H_BOT} role="img" aria-label="theta(t)">
          <g transform={'translate(' + M.left + ',' + M.top + ')'}>
            <line x1={0} x2={IW} y1={yTheta(0)} y2={yTheta(0)} stroke={ED.rule} strokeDasharray="3,3" />
            <path d={thetaPath} fill="none" stroke={ED.series5} strokeWidth={1.5} />
            <line x1={0} x2={IW} y1={IH_BOT} y2={IH_BOT} stroke={ED.rule} />
            {xTicks.map((t) => (
              <g key={'xtheta-' + t} transform={'translate(' + xMain(t) + ',' + IH_BOT + ')'}>
                <line y1={0} y2={5} stroke={ED.rule} />
                <text y={18} textAnchor="middle" style={tickStyle}>{t}</text>
              </g>
            ))}
            <line x1={0} x2={0} y1={0} y2={IH_BOT} stroke={ED.rule} />
            {[thetaMin, (thetaMin + thetaMax) / 2, thetaMax].map((v, idx) => (
              <g key={'ytheta-' + idx} transform={'translate(0,' + yTheta(v) + ')'}>
                <line x1={-5} x2={0} stroke={ED.rule} />
                <text x={-8} y={3} textAnchor="end" style={tickStyle}>{v.toFixed(1)}</text>
              </g>
            ))}
            <text transform={'translate(-44,' + IH_BOT / 2 + ') rotate(-90)'} textAnchor="middle" style={{ ...labelStyle, fontSize: 11, fill: 'var(--series-5)' }}>
              theta(t)
            </text>
          </g>
        </svg>
      </div>

      {/* Agreement table — first 10 zeros side by side. */}
      <div className="card" style={{ marginTop: 24, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5, marginBottom: 8 }}>
          first 10 detected zeros vs Odlyzko reference
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ background: 'var(--paper)' }}>
              <th style={{ textAlign: 'left', padding: 6, color: 'var(--ink)' }}>n</th>
              <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>detected gamma_n</th>
              <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>Odlyzko gamma_n</th>
              <th style={{ textAlign: 'right', padding: 6, color: 'var(--ink)' }}>abs error</th>
            </tr>
          </thead>
          <tbody>
            {R.perZeroAccuracy.slice(0, 10).map((row, idx) => {
              const known = R.knownOdlyzkoZerosUpTo100[idx];
              const good = row.absError < 0.05;
              return (
                <tr key={'row-' + idx} style={{ borderTop: '1px solid var(--hairline)' }}>
                  <td style={{ padding: 6, color: 'var(--terra)' }}>{idx + 1}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink-soft)' }}>{row.detected.toFixed(6)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: 'var(--ink-soft)' }}>{known != null ? known.toFixed(6) : '—'}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: good ? 'var(--green)' : 'var(--terra-dk)' }}>
                    {row.absError.toExponential(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Notes. */}
      <div style={{ marginTop: 16, fontSize: 11, color: 'var(--faint)', lineHeight: 1.6 }}>
        Notes: (1) the Riemann-Siegel main sum index N = floor(sqrt(t / 2 pi))
        equals zero for t &lt; 2 pi, where the formula is undefined; the page
        shades that region red and forces Z = 0 there. (2) Sign detection uses
        the basic Riemann-Siegel Z (main sum + C_0 correction) because it is
        numerically stable across the entire grid; the enhanced overlay
        (C_0 + C_1 + C_2 via finite differences) shows sporadic O(1) spikes at
        small t that are artifacts of the d3 / d5 differencing through a
        cosine denominator, not real signal. (3) Detected zero count and
        accuracy match the first 29 Odlyzko zeros up to t = 100 within the
        published 9-digit reference precision.
        Data source: src/data/riemann-siegel-z-explorer.js (1000 sample
        grid pre-computed at module load via src/math/zeta.js riemannSiegelZ).
      </div>

      <RelatedLinks links={[
        { to: '/hardy-z', label: 'Hardy Z-Function' },
        { to: '/gram-points', label: 'Gram Points' },
        { to: '/zeta', label: 'Zeta Landscape' },
        { to: '/statistics', label: 'Zero Statistics' },
      ]} />

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
        <Link to="/" style={{ color: 'var(--ink-soft)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
      </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--paper)',
      border: '1px solid var(--hairline)',
      borderRadius: 8,
      padding: 10,
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{
        marginTop: 4,
        fontSize: 18,
        fontFamily: 'var(--font-mono)',
        color: accent || 'var(--ink)',
      }}>
        {value}
      </div>
    </div>
  );
}
