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
//   (4) honest-scope panel
//
// Pure SVG + React + d3-scale, matching the imp-1108 page idiom. No
// external chart library; no canvas; no animation.
//
// Data source: src/data/edge-rigidity-empirical-2026-05.js
//
// @see imp-1128
// @see imp-1108 (sibling bulk measurement)

import React from 'react';
import { Link } from 'react-router-dom';
import { scaleLinear } from 'd3-scale';
import { EDGE_RIGIDITY_EMPIRICAL } from '../data/edge-rigidity-empirical-2026-05.js';
import RelatedLinks from '../components/RelatedLinks.jsx';

// -- SVG geometry ---------------------------------------------------------

const W = 720;
const H = 420;
const M = { top: 30, right: 30, bottom: 60, left: 80 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fill: 'var(--text-secondary)',
};

const tickStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  fill: '#94a3b8',
};

function compatibilityTone(compatible) {
  return compatible ? '#22c55e' : '#ef4444';
}

function SummaryCard({ label, value, tone, hint }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid ' + tone,
        borderRadius: 6,
        padding: '10px 12px',
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 18, fontFamily: 'var(--font-mono)', color: tone, marginTop: 4 }}>
        {value}
      </div>
      {hint ? <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{hint}</div> : null}
    </div>
  );
}

// -- Log-log scatter SVG with bulk-comparison overlay ---------------------

function LogLogScatterEdgeVsBulk({ title, edgeRows, edgeFit, bulkFit, color }) {
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
  // comparison is honest -- the constant is irrelevant, only the slope
  // difference is being shown).
  const bulkAnchor = logPsis[0];
  const bulkY1 = bulkAnchor;
  const bulkY2 = bulkAnchor + bulkFit.slope * (fitX2 - fitX1);

  // ESY target line (slope = -1) anchored at smallest-N edge point.
  const targetY1 = logPsis[0];
  const targetY2 = logPsis[0] + (-1) * (fitX2 - fitX1);

  const xTicks = [];
  for (let v = Math.ceil(minLogN); v <= Math.floor(maxLogN); v += 1) xTicks.push(v);
  const yTicks = [];
  for (let v = Math.ceil(minLogPsi); v <= Math.floor(maxLogPsi); v += 1) yTicks.push(v);

  return (
    <div
      style={{
        marginTop: 12,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
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
              stroke="#1e293b"
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
              stroke="#1e293b"
              strokeDasharray="2,4"
            />
          ))}

          {/* ESY target slope = -1 reference line. */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(targetY1)}
            y2={y(targetY2)}
            stroke="#22c55e"
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />

          {/* Bulk fit slope (overlaid for comparison). */}
          <line
            x1={x(fitX1)}
            x2={x(fitX2)}
            y1={y(bulkY1)}
            y2={y(bulkY2)}
            stroke="#facc15"
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
                stroke="white"
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

          <line x1={0} x2={IW} y1={IH} y2={IH} stroke="#475569" />
          {xTicks.map((t) => (
            <g key={'xt-' + t} transform={'translate(' + x(t) + ',' + IH + ')'}>
              <line y1={0} y2={5} stroke="#475569" />
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

          <line x1={0} x2={0} y1={0} y2={IH} stroke="#475569" />
          {yTicks.map((t) => (
            <g key={'yt-' + t} transform={'translate(0,' + y(t) + ')'}>
              <line x1={-5} x2={0} stroke="#475569" />
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
              height={74}
              rx={6}
              fill="rgba(15,23,42,0.7)"
              stroke="rgba(148,163,184,0.35)"
            />
            <circle cx={6} cy={8} r={4} fill={color} stroke="white" strokeWidth={1.2} />
            <text x={20} y={12} style={{ ...labelStyle, fontSize: 10, fill: '#cbd5e1' }}>
              edge (slope = {edgeFit.slope.toFixed(3)}, R^2 = {edgeFit.R2.toFixed(3)})
            </text>
            <line x1={0} x2={14} y1={24} y2={24} stroke="#facc15" strokeWidth={1.5} strokeDasharray="3,3" />
            <text x={20} y={28} style={{ ...labelStyle, fontSize: 10, fill: '#cbd5e1' }}>
              bulk reference (slope = {bulkFit.slope.toFixed(3)})
            </text>
            <line
              x1={0}
              x2={14}
              y1={40}
              y2={40}
              stroke="#22c55e"
              strokeWidth={1.5}
              strokeDasharray="6,4"
            />
            <text x={20} y={44} style={{ ...labelStyle, fontSize: 10, fill: '#cbd5e1' }}>
              ESY target slope = -1
            </text>
            <text x={0} y={62} style={{ ...labelStyle, fontSize: 9, fill: '#94a3b8' }}>
              bulk overlay anchored at smallest-N edge point
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}

// -- Page component -------------------------------------------------------

export default function EdgeRigidityPage() {
  const D = EDGE_RIGIDITY_EMPIRICAL;
  const compat = D.edgeCompatibleWithESY;
  const tone = compatibilityTone(compat);
  const edgeBeatsBulk = D.bulkComparison.edgeBeatsBulkSlope;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Edge Rigidity Empirical Measurement (imp-1128)</h1>
        <p className="page-subtitle">
          Re-measures the ESY-style local-law fluctuation quantity{' '}
          <code>psi_N</code> at the SPECTRAL EDGE (small-ordinate region near{' '}
          <code>gamma_1 = 14.1347</code>), in contrast to the imp-1108 bulk
          measurement which sampled the midpoint window{' '}
          <code>[x_{'{N/4}'}, x_{'{3N/4}'}]</code>. Tests whether the edge
          regime exhibits ESY-compatible rigidity (slope approximately{' '}
          <code>-1</code>) that the bulk did not.
        </p>
        <div style={{ marginTop: 10, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          <Link to="/explorations" style={{ color: '#a855f7' }}>
            &larr; back to Explorations
          </Link>
        </div>
      </div>

      {/* Verdict banner. */}
      <div
        style={{
          marginTop: 16,
          padding: 14,
          background: 'rgba(15, 23, 42, 0.5)',
          border: '2px solid ' + tone,
          borderRadius: 8,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Edge compatibility verdict (slope &lt; {D.edgeESYSlopeThreshold})
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'var(--font-mono)',
            color: tone,
            marginTop: 6,
            fontWeight: 'bold',
          }}
        >
          {compat ? 'EDGE-ESY-COMPATIBLE' : 'EDGE-ESY-INCOMPATIBLE'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
          Edge slope (macro) = {D.fittedSlopeEdge.slope.toFixed(4)} | bulk
          slope (macro, imp-1108) = {D.fittedSlopeBulk.slope.toFixed(4)} |
          difference ={' '}
          {D.bulkComparison.slopeDifferenceMacro.toFixed(4)} | edge beats bulk
          slope: <strong>{edgeBeatsBulk ? 'YES' : 'NO'}</strong>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: 'var(--text-primary)',
            lineHeight: 1.5,
          }}
        >
          <strong>Implication for rho_min chain:</strong>{' '}
          {D.implicationForRhoMinChain}
        </div>
      </div>

      {/* Numeric summary cards. */}
      <div
        className="card-grid"
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        <SummaryCard
          label="edge slope (macro)"
          value={D.fittedSlopeEdge.slope.toFixed(4)}
          tone={tone}
          hint={'ESY target = -1.0; threshold = ' + D.edgeESYSlopeThreshold}
        />
        <SummaryCard
          label="edge R^2 (macro)"
          value={D.fittedSlopeEdge.R2.toFixed(4)}
          tone={D.fittedSlopeEdge.R2 >= 0.85 ? '#22c55e' : '#facc15'}
          hint="OLS fit quality"
        />
        <SummaryCard
          label="bulk slope (imp-1108)"
          value={D.fittedSlopeBulk.slope.toFixed(4)}
          tone="#facc15"
          hint="lifted from esy-rigidity-empirical-2026-05.js"
        />
        <SummaryCard
          label="edge slope (micro)"
          value={D.fittedSlopeEdgeMicro.slope.toFixed(4)}
          tone="#94a3b8"
          hint={'eta = c/N (bounded-not-decay expected)'}
        />
        <SummaryCard
          label="slope diff (macro)"
          value={D.bulkComparison.slopeDifferenceMacro.toFixed(4)}
          tone={D.bulkComparison.slopeDifferenceMacro < 0 ? '#22c55e' : '#facc15'}
          hint="edge_slope - bulk_slope (negative = edge steeper)"
        />
        <SummaryCard
          label="edge window cap"
          value={D.sampleSizeCap}
          tone="#94a3b8"
          hint="M_EDGE_MAX (matches imp-1108 M_BULK_MAX)"
        />
      </div>

      {/* Scatter plots. */}
      <LogLogScatterEdgeVsBulk
        title="Macroscopic scale (eta = c) -- well-posed ESY regime; ESY predicts slope = -1"
        edgeRows={D.measuredPsiNEdgeMacro}
        edgeFit={D.fittedSlopeEdge}
        bulkFit={D.fittedSlopeBulk}
        color="#a855f7"
      />
      <LogLogScatterEdgeVsBulk
        title="Microscopic scale (eta = c/N) -- bounded-not-decay expected at corrected ESY scale"
        edgeRows={D.measuredPsiNEdge}
        edgeFit={D.fittedSlopeEdgeMicro}
        bulkFit={D.fittedSlopeBulkMicro}
        color="#3b82f6"
      />

      {/* Data table. */}
      <div
        style={{
          marginTop: 16,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            marginBottom: 8,
          }}
        >
          per-N edge measurements (representative point = midpoint of x_0 and x_1)
        </div>
        <table style={{ width: '100%', fontSize: 12, fontFamily: 'var(--font-mono)', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#94a3b8', textAlign: 'right' }}>
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
                <tr key={r.N} style={{ borderTop: '1px solid #1e293b', color: '#cbd5e1', textAlign: 'right' }}>
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
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
          <div
            style={{
              fontSize: 11,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Method
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-primary)',
              marginTop: 6,
              lineHeight: 1.6,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {D.operationalDefinition}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
            <strong>Edge window:</strong> {D.edgeWindowDefinition}
          </div>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
          <div
            style={{
              fontSize: 11,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Interpretation
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 6, lineHeight: 1.6 }}>
            The bulk imp-1108 measurement falsified ESY rigidity in the
            midpoint window. imp-1128 tests whether the EDGE regime (near
            gamma_1) is different. Result: edge slope ={' '}
            <code>{D.fittedSlopeEdge.slope.toFixed(4)}</code>, bulk slope ={' '}
            <code>{D.fittedSlopeBulk.slope.toFixed(4)}</code>. Edge {edgeBeatsBulk ? 'beats' : 'does not beat'}{' '}
            bulk; verdict = <strong>{compat ? 'EDGE-ESY-COMPATIBLE' : 'EDGE-ESY-INCOMPATIBLE'}</strong>.
          </div>
        </div>
      </div>

      {/* Honest scope panel. */}
      <div
        style={{
          marginTop: 16,
          background: 'rgba(250, 204, 21, 0.06)',
          border: '1px solid rgba(250, 204, 21, 0.4)',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#facc15',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 8,
          }}
        >
          Honest scope
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 12,
            color: 'var(--text-primary)',
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
      <div style={{ marginTop: 16, fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
        parallel-agent batch: {D.parallelTickets.join(' | ')}
      </div>

      <RelatedLinks links={[
        { to: '/statistics', label: 'Zero Statistics' },
        { to: '/pair-correlation', label: 'Pair Correlation' },
        { to: '/gue-comparison', label: 'GUE Comparison' },
        { to: '/gram-points', label: 'Gram Points' },
      ]} />
    </div>
  );
}
