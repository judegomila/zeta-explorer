// EdgeRigidityPage -- imp-1128
//
// Visualises the EDGE psi_N measurements (psi_N sampled near gamma_1, NOT
// in the bulk midpoint) and compares to the imp-1108 bulk slope.
//
// Renders:
//   (1) interpretation banner (edgeCompatibleWithESY + implication note)
//   (2) log-log scatter: edge psi_N vs N with bulk fit overlaid for visual
//       comparison; ESY target slope = -1 reference line; OLS edge fit.
//   (3) per-N data table including windowEnd / sampleSize
//   (4)-scope panel
//
// Pure SVG + React + d3-scale, matching the imp-1108 page idiom. No
// external chart library; no canvas; no animation.
//
// Data source: src/data/edge-rigidity-empirical-2026-05.js
//
// Editorial (warm) re-theme: full-width shell, identical structure/data/geometry.
//
// @see imp-1128
// @see imp-1108 (sibling bulk measurement)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { scaleLinear } from 'd3-scale';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { EDGE_RIGIDITY_EMPIRICAL } from '../data/edge-rigidity-empirical-2026-05.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

// OLS log-log refit on a subset of rows (for the interactive slider).
function olsLogLog(rows) {
  if (rows.length < 2) return null;
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.psiRMS));
  const n = xs.length;
  let xMean = 0, yMean = 0;
  for (let i = 0; i < n; i++) { xMean += xs[i]; yMean += ys[i]; }
  xMean /= n; yMean /= n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) * (xs[i] - xMean);
  }
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - yMean) * (ys[i] - yMean);
  }
  return { slope, intercept, R2: ssTot === 0 ? 1 : 1 - ssRes / ssTot };
}

// -- SVG geometry ---------------------------------------------------------

const W = 720;
const H = 420;
const M = { top: 30, right: 30, bottom: 60, left: 80 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

const MONO = 'var(--ed-mono, var(--font-mono))';

const labelStyle = {
  fontFamily: MONO,
  fontSize: 11,
  fill: 'var(--ink-soft)',
};

const tickStyle = {
  fontFamily: MONO,
  fontSize: 9,
  fill: 'var(--faint)',
};

function compatibilityTone(compatible) {
  return compatible ? 'var(--green)' : 'var(--terra-dk)';
}

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

const cardLabel = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'var(--faint)',
  marginBottom: 6,
};

function SummaryCard({ label, value, tone, hint }) {
  return (
    <div className="card" style={cardBaseLeft(tone)}>
      <div style={cardLabel}>{label}</div>
      <div style={{ fontSize: 18, fontFamily: MONO, color: tone, marginTop: 2 }}>
        {value}
      </div>
      {hint ? <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>{hint}</div> : null}
    </div>
  );
}

// -- Log-log scatter SVG with bulk-comparison overlay ---------------------

function LogLogScatterEdgeVsBulk({ title, edgeRows, edgeFit, bulkFit, color, highlightN }) {
  const logNs = edgeRows.map((r) => Math.log10(r.N));
  const logPsis = edgeRows.map((r) => Math.log10(r.psiRMS));

  const minLogN = Math.min(...logNs) - 0.1;
  const maxLogN = Math.max(...logNs) + 0.1;
  const minLogPsi = Math.min(...logPsis) - 0.4;
  const maxLogPsi = Math.max(...logPsis) + 0.3;

  const x = scaleLinear().domain([minLogN, maxLogN]).range([0, IW]);
  const y = scaleLinear().domain([minLogPsi, maxLogPsi]).range([IH, 0]);

  const fitX1 = minLogN;
  const fitX2 = maxLogN;

  // Edge fit: log_e -> log_10 conversion.
  const edgeY1Ln = edgeFit.intercept + edgeFit.slope * Math.log(Math.pow(10, fitX1));
  const edgeY2Ln = edgeFit.intercept + edgeFit.slope * Math.log(Math.pow(10, fitX2));
  const edgeY1Log10 = edgeY1Ln * Math.log10(Math.E);
  const edgeY2Log10 = edgeY2Ln * Math.log10(Math.E);

  // Bulk fit anchored at the smallest-N edge point (so the visual slope
  // comparison is -- the constant is irrelevant, only the slope
  // difference is being shown).
  const bulkAnchor = logPsis[0];
  const bulkY1 = bulkAnchor;
  const bulkY2 = bulkAnchor + bulkFit.slope * (fitX2 - fitX1);

  // ESY target line (slope = -1) anchored at smallest-N edge point.
  const targetY1 = logPsis[0];
  const targetY2 = logPsis[0] + (-1) * (fitX2 - fitX1);

  // Tracy-Widom edge target line: Wigner edge fluctuations scale as N^{-2/3}.
  const twY1 = logPsis[0];
  const twY2 = logPsis[0] + (-2 / 3) * (fitX2 - fitX1);

  const xTicks = [];
  for (let v = Math.ceil(minLogN); v <= Math.floor(maxLogN); v += 1) xTicks.push(v);
  const yTicks = [];
  for (let v = Math.ceil(minLogPsi); v <= Math.floor(maxLogPsi); v += 1) yTicks.push(v);

  return (
    <div className="card" style={{ marginTop: 12, ...cardBaseLeft(color), padding: 12 }}>
      <div
        style={{
          fontSize: 12,
          fontFamily: MONO,
          color: 'var(--ink-soft)',
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <svg width={W} height={H} role="img" aria-label={title}>
        <g transform={'translate(' + M.left + ',' + M.top + ')'}>
          {xTicks.map((t) => (
            <line
              key={'xg-' + t}
              x1={x(t)}
              x2={x(t)}
              y1={0}
              y2={IH}
              stroke={ED.ruleSoft}
              strokeDasharray="2,4"
            />
          ))}
          {yTicks.map((t) => (
            <line
              key={'yg-' + t}
              x1={0}
              x2={IW}
              y1={y(t)}
              y2={y(t)}
              stroke={ED.ruleSoft}
              strokeDasharray="2,4"
            />
          ))}

          {/* ESY target slope = -1 reference line. */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(targetY1)}
            y2={y(targetY2)}
            stroke={ED.series3}
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />

          {/* Tracy-Widom edge target slope = -2/3 (Wigner edge N^{-2/3} scale). */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(twY1)}
            y2={y(twY2)}
            stroke={ED.accentDeco}
            strokeWidth={1.5}
            strokeDasharray="4,2"
          />

          {/* Bulk fit slope (overlaid for comparison). */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(bulkY1)}
            y2={y(bulkY2)}
            stroke={ED.brassDeco}
            strokeWidth={1.5}
            strokeDasharray="3,3"
          />

          {/* Edge OLS fit. */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(edgeY1Log10)}
            y2={y(edgeY2Log10)}
            stroke={color}
            strokeWidth={2}
          />

          {edgeRows.map((r, i) => (
            <g key={'pt-' + r.N}>
              <circle
                cx={x(logNs[i])}
                cy={y(logPsis[i])}
                r={5}
                fill={color}
                stroke={ED.paper}
                strokeWidth={1.2}
              >
                <title>
                  {'N = ' +
                    r.N +
                    ' | psi_RMS = ' +
                    r.psiRMS.toExponential(4) +
                    ' | eta = ' +
                    r.eta.toExponential(2) +
                    ' | edgeWindowEnd = ' +
                    r.edgeWindowEnd +
                    ' | M = ' +
                    r.sampleSize}
                </title>
              </circle>
            </g>
          ))}

          <line x1={0} x2={IW} y1={IH} y2={IH} stroke={ED.inkSoft} />
          {xTicks.map((t) => (
            <g key={'xt-' + t} transform={'translate(' + x(t) + ',' + IH + ')'}>
              <line y1={0} y2={5} stroke={ED.inkSoft} />
              <text y={18} textAnchor="middle" style={tickStyle}>
                {'10^' + t}
              </text>
            </g>
          ))}
          <text
            x={IW / 2}
            y={IH + 42}
            textAnchor="middle"
            style={{ ...labelStyle, fontSize: 11 }}
          >
            N (zero count)
          </text>

          <line x1={0} x2={0} y1={0} y2={IH} stroke={ED.inkSoft} />
          {yTicks.map((t) => (
            <g key={'yt-' + t} transform={'translate(0,' + y(t) + ')'}>
              <line x1={-5} x2={0} stroke={ED.inkSoft} />
              <text x={-8} y={3} textAnchor="end" style={tickStyle}>
                {'10^' + t}
              </text>
            </g>
          ))}
          <text
            transform={'translate(-58,' + IH / 2 + ') rotate(-90)'}
            textAnchor="middle"
            style={{ ...labelStyle, fontSize: 11 }}
          >
            psi_N (edge RMS fluctuation)
          </text>

          <g transform={'translate(' + (IW - 250) + ',6)'}>
            <rect
              x={-6}
              y={-4}
              width={256}
              height={92}
              rx={6}
              fill={ED.paper}
              fillOpacity={0.92}
              stroke={ED.rule}
            />
            <circle cx={6} cy={8} r={4} fill={color} stroke={ED.paper} strokeWidth={1.2} />
            <text x={20} y={12} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
              edge (slope = {edgeFit.slope.toFixed(3)}, R^2 = {edgeFit.R2.toFixed(3)})
            </text>
            <line x1={0} x2={14} y1={24} y2={24} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="3,3" />
            <text x={20} y={28} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
              bulk reference (slope = {bulkFit.slope.toFixed(3)})
            </text>
            <line
              x1={0}
              x2={14}
              y1={40}
              y2={40}
              stroke={ED.series3}
              strokeWidth={1.5}
              strokeDasharray="6,4"
            />
            <text x={20} y={44} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
              ESY target slope = -1
            </text>
            <line
              x1={0}
              x2={14}
              y1={56}
              y2={56}
              stroke={ED.accentDeco}
              strokeWidth={1.5}
              strokeDasharray="4,2"
            />
            <text x={20} y={60} style={{ ...labelStyle, fontSize: 10, fill: 'var(--ink-soft)' }}>
              Tracy-Widom target slope = -2/3
            </text>
            <text x={0} y={80} style={{ ...labelStyle, fontSize: 9, fill: 'var(--faint)' }}>
              bulk overlay anchored at smallest-N edge point
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}

// All 5 N values in the dataset, in ascending order.
const ALL_N_LABELS = [100, 500, 1000, 5000, 10000];

// -- Page component -------------------------------------------------------

export default function EdgeRigidityPage() {
  const D = EDGE_RIGIDITY_EMPIRICAL;
  const compat = D.edgeCompatibleWithESY;
  const tone = compatibilityTone(compat);
  const edgeBeatsBulk = D.bulkComparison.edgeBeatsBulkSlope;

  // Interactive sample-size control: limit to first `numPoints` N values.
  // Default = 5 (all points). Min = 2 (need at least two for OLS).
  const [numPoints, setNumPoints] = useState(5);

  const macroRows = D.measuredPsiNEdgeMacro.slice(0, numPoints);
  const microRows = D.measuredPsiNEdge.slice(0, numPoints);
  const activeMacroFit = olsLogLog(macroRows) || D.fittedSlopeEdge;
  const activeMicroFit = olsLogLog(microRows) || D.fittedSlopeEdgeMicro;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Edge Rigidity Empirical Measurement</h1>
          <p className="ed-lbl">Related: <Link to="/esy-rigidity-empirical">ESY rigidity (bulk)</Link></p>
          <AnimationEmbed id="esy-rigidity" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Re-measures the ESY-style local-law fluctuation quantity{' '}
            <code>psi_N</code> at the SPECTRAL EDGE (the small-ordinate region near{' '}
            <code>gamma_1 = 14.1347</code>), in contrast to the imp-1108 bulk
            measurement, which sampled the midpoint window{' '}
            <code>[x_{'{N/4}'}, x_{'{3N/4}'}]</code>. The question: does the edge
            regime show ESY-compatible rigidity (slope approximately{' '}
            <code>-1</code>) that the bulk did not?
          </p>
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link
              to="/explorations"
              style={{
                color: 'var(--brass)',
                fontFamily: MONO,
                fontSize: 12,
                textDecoration: 'none',
                padding: '4px 10px',
                border: '1px solid var(--brass)',
                borderRadius: 6,
              }}
            >
              &larr; back to Explorations
            </Link>
            <span style={{
              color: 'var(--faint)',
              fontFamily: MONO,
              fontSize: 11,
              padding: '4px 10px',
              border: '1px solid var(--hairline)',
              borderRadius: 6,
            }}>
              imp-1128 · sibling of imp-1108 (bulk measurement)
            </span>
          </div>
        </div>

        {/* Verdict banner. */}
        <div className="card" style={{ ...cardBaseLeft(tone), marginBottom: 24 }}>
          <div style={cardLabel}>
            Edge compatibility verdict (slope &lt; {D.edgeESYSlopeThreshold})
          </div>
          <div
            style={{
              fontSize: 22,
              fontFamily: MONO,
              color: tone,
              marginTop: 4,
              fontWeight: 700,
            }}
          >
            {compat ? 'EDGE-ESY-COMPATIBLE' : 'EDGE-ESY-INCOMPATIBLE'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.6 }}>
            Edge slope (macro) = <code>{D.fittedSlopeEdge.slope.toFixed(4)}</code> | bulk
            slope (macro, imp-1108) = <code>{D.fittedSlopeBulk.slope.toFixed(4)}</code> |
            difference = <code>{D.bulkComparison.slopeDifferenceMacro.toFixed(4)}</code> | edge beats bulk
            slope: <strong style={{ color: edgeBeatsBulk ? 'var(--green)' : 'var(--terra-dk)' }}>{edgeBeatsBulk ? 'YES' : 'NO'}</strong>
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              color: 'var(--ink)',
              lineHeight: 1.55,
              padding: '8px 12px',
              background: 'var(--paper)',
              borderRadius: 6,
              border: '1px solid var(--hairline)',
            }}
          >
            <strong style={{ color: 'var(--brass-dk)' }}>Implication for rho_min chain:</strong>{' '}
            {D.implicationForRhoMinChain}
          </div>
        </div>

        {/* Interactive sample-size control. */}
        <div
          className="card"
          style={{
            ...cardBaseLeft('var(--brass)'),
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ ...cardLabel, marginBottom: 0, minWidth: 120 }}>
            Sample size (N values)
          </div>
          <input
            type="range"
            min={2}
            max={5}
            step={1}
            value={numPoints}
            onChange={(e) => setNumPoints(Number(e.target.value))}
            style={{ flex: 1, minWidth: 140, maxWidth: 260, accentColor: 'var(--brass)', cursor: 'pointer' }}
          />
          <div style={{ fontFamily: MONO, fontSize: 12, color: 'var(--ink-soft)', minWidth: 200 }}>
            N &isin; &#123;{ALL_N_LABELS.slice(0, numPoints).join(', ')}&#125;
          </div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: 'var(--brass-dk)' }}>
            live edge slope: <strong>{activeMacroFit.slope.toFixed(4)}</strong>
            <span style={{ color: 'var(--faint)', marginLeft: 8 }}>
              R&sup2; = {activeMacroFit.R2.toFixed(3)}
            </span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--faint)' }}>
            TW target = -0.667 | ESY target = -1.000
          </div>
        </div>

        {/* Numeric summary cards. */}
        <div className="card-grid" style={{ marginBottom: 24 }}>
          <SummaryCard
            label="edge slope (macro)"
            value={D.fittedSlopeEdge.slope.toFixed(4)}
            tone={tone}
            hint={'ESY target = -1.0; threshold = ' + D.edgeESYSlopeThreshold}
          />
          <SummaryCard
            label="edge R^2 (macro)"
            value={D.fittedSlopeEdge.R2.toFixed(4)}
            tone={D.fittedSlopeEdge.R2 >= 0.85 ? 'var(--green)' : 'var(--brass-dk)'}
            hint="OLS fit quality"
          />
          <SummaryCard
            label="bulk slope (imp-1108)"
            value={D.fittedSlopeBulk.slope.toFixed(4)}
            tone={ED.brassDeco}
            hint="lifted from esy-rigidity-empirical-2026-05.js"
          />
          <SummaryCard
            label="edge slope (micro)"
            value={D.fittedSlopeEdgeMicro.slope.toFixed(4)}
            tone={ED.inkFaint}
            hint={'eta = c/N (bounded-not-decay expected)'}
          />
          <SummaryCard
            label="slope diff (macro)"
            value={D.bulkComparison.slopeDifferenceMacro.toFixed(4)}
            tone={D.bulkComparison.slopeDifferenceMacro < 0 ? 'var(--green)' : 'var(--brass-dk)'}
            hint="edge_slope - bulk_slope (negative = edge steeper)"
          />
          <SummaryCard
            label="edge window cap"
            value={D.sampleSizeCap}
            tone={ED.inkFaint}
            hint="M_EDGE_MAX (matches imp-1108 M_BULK_MAX)"
          />
        </div>

        {/* Scatter plots (rows filtered by numPoints slider; fits recomputed live). */}
        <LogLogScatterEdgeVsBulk
          title="Macroscopic scale (eta = c) -- well-posed ESY regime; ESY predicts slope = -1"
          edgeRows={macroRows}
          edgeFit={activeMacroFit}
          bulkFit={D.fittedSlopeBulk}
          color={ED.series1}
        />
        <LogLogScatterEdgeVsBulk
          title="Microscopic scale (eta = c/N) -- bounded-not-decay expected at corrected ESY scale"
          edgeRows={microRows}
          edgeFit={activeMicroFit}
          bulkFit={D.fittedSlopeBulkMicro}
          color={ED.brass}
        />

        {/* Data table. */}
        <div className="card" style={{ ...cardBaseLeft('var(--hairline)'), marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              fontFamily: MONO,
              color: 'var(--ink-soft)',
              marginBottom: 8,
            }}
          >
            per-N edge measurements (representative point = midpoint of x_0 and x_1)
          </div>
          <table style={{ width: '100%', fontSize: 12, fontFamily: MONO, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--faint)', textAlign: 'right' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>N</th>
                <th style={{ padding: '6px 8px' }}>eta_micro</th>
                <th style={{ padding: '6px 8px' }}>psi_micro</th>
                <th style={{ padding: '6px 8px' }}>psi_macro</th>
                <th style={{ padding: '6px 8px' }}>M (sampleSize)</th>
                <th style={{ padding: '6px 8px' }}>windowEnd</th>
                <th style={{ padding: '6px 8px' }}>E_repr (midpoint x_0, x_1)</th>
              </tr>
            </thead>
            <tbody>
              {D.measuredPsiNEdge.map((r, i) => {
                const rMacro = D.measuredPsiNEdgeMacro[i];
                return (
                  <tr key={r.N} style={{ borderTop: '1px solid var(--hairline)', color: 'var(--ink-soft)', textAlign: 'right' }}>
                    <td style={{ textAlign: 'left', padding: '6px 8px' }}>{r.N}</td>
                    <td style={{ padding: '6px 8px' }}>{r.eta.toExponential(2)}</td>
                    <td style={{ padding: '6px 8px' }}>{r.psiRMS.toFixed(6)}</td>
                    <td style={{ padding: '6px 8px' }}>{rMacro.psiRMS.toFixed(6)}</td>
                    <td style={{ padding: '6px 8px' }}>{r.sampleSize}</td>
                    <td style={{ padding: '6px 8px' }}>{r.edgeWindowEnd}</td>
                    <td style={{ padding: '6px 8px' }}>{r.E_representative.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Method + interpretation. */}
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          <div className="card" style={cardBaseLeft('var(--blue)')}>
            <div style={cardLabel}>Method</div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--ink)',
                marginTop: 6,
                lineHeight: 1.6,
                fontFamily: MONO,
              }}
            >
              {D.operationalDefinition}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--faint)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--ink-soft)' }}>Edge window:</strong> {D.edgeWindowDefinition}
            </div>
          </div>

          <div className="card" style={cardBaseLeft('var(--green)')}>
            <div style={cardLabel}>Interpretation</div>
            <div style={{ fontSize: 12, color: 'var(--ink)', marginTop: 6, lineHeight: 1.6 }}>
              The bulk imp-1108 measurement falsified ESY rigidity in the
              midpoint window. imp-1128 tests whether the EDGE regime (near
              gamma_1) is different. Result: edge slope ={' '}
              <code>{D.fittedSlopeEdge.slope.toFixed(4)}</code>, bulk slope ={' '}
              <code>{D.fittedSlopeBulk.slope.toFixed(4)}</code>. Edge {edgeBeatsBulk ? 'beats' : 'does not beat'}{' '}
              bulk; verdict = <strong style={{ color: tone }}>{compat ? 'EDGE-ESY-COMPATIBLE' : 'EDGE-ESY-INCOMPATIBLE'}</strong>.
            </div>
          </div>
        </div>

        {/* Scope panel. */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), marginTop: 16 }}>
          <div style={{ ...cardLabel, color: 'var(--brass-dk)', marginBottom: 8 }}>
            Scope
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 12,
              color: 'var(--ink)',
              lineHeight: 1.6,
            }}
          >
            {D.honestScope.map((s, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Parallel tickets footer. */}
        <div style={{ marginTop: 16, fontSize: 11, color: 'var(--faint)', fontFamily: MONO }}>
          parallel-agent batch: {D.parallelTickets.join(' | ')}
        </div>

        {/* Related pages. */}
        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginTop: 24 }}>
          <div style={cardLabel}>Related pages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Link to="/statistics" style={{ color: 'var(--blue)', fontSize: 13 }}>Zero Statistics</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/pair-correlation" style={{ color: 'var(--brass)', fontSize: 13 }}>Pair Correlation</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/gue-comparison" style={{ color: 'var(--green)', fontSize: 13 }}>GUE Comparison</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/gram-points" style={{ color: 'var(--brass-dk)', fontSize: 13 }}>Gram Points</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/esy-rigidity-empirical" style={{ color: 'var(--blue)', fontSize: 13 }}>ESY Rigidity (empirical)</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>&larr; the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
