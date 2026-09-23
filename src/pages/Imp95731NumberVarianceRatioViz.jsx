import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95710_NUMBER_VARIANCE_RATIO_VS_HEIGHT } from '../data/imp-95710-number-variance-ratio-vs-height.js';

const DATA = IMP95710_NUMBER_VARIANCE_RATIO_VS_HEIGHT;
const ROWS = DATA.rows;

// r(T) vs log10 T: the six measured points, the [min,max] band, the mean line,
// the GUE asymptote 1, and the ~6.8-decade gap out to the imp-95519 window bottom.
function VarianceRatioChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const logT = (T) => Math.log10(T);
  const xMin = logT(ROWS[0].Tc);
  const xMax = logT(DATA.windowReach.windowBottomT);
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yMin = 0;
  const yMax = 1.05;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const measuredPath = ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(logT(r.Tc))} ${yOf(r.varRatioMeasuredOverGUE)}`,
  ).join(' ');

  const measuredTopX = xOf(logT(DATA.windowReach.measuredTopT));
  const windowBottomX = xOf(logT(DATA.windowReach.windowBottomT));
  const bandTopY = yOf(DATA.trend.maxRatio);
  const bandBotY = yOf(DATA.trend.minRatio);
  const meanY = yOf(DATA.trend.meanRatio);
  const gueY = yOf(1);

  const xTicks = [4, 6, 8, 10, 12].filter((v) => v >= xMin && v <= xMax);
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* measured [min,max] band across the sampled window */}
      <rect
        x={xOf(xMin)}
        y={bandTopY}
        width={measuredTopX - xOf(xMin)}
        height={bandBotY - bandTopY}
        fill="rgba(96,165,250,0.10)"
      />

      {/* unmeasured window-reach gap, sampled top to imp-95519 window bottom */}
      <rect
        x={measuredTopX}
        y={padT}
        width={windowBottomX - measuredTopX}
        height={plotH}
        fill="rgba(248,113,113,0.06)"
      />
      <line x1={measuredTopX} y1={padT} x2={measuredTopX} y2={padT + plotH} stroke="#f87171" strokeWidth={1} strokeDasharray="3 3" />
      <text x={measuredTopX + 4} y={padT + 10} fill="#f87171" fontSize={9.5}>
        measured top T={DATA.windowReach.measuredTopT.toExponential(0)}
      </text>
      <line x1={windowBottomX} y1={padT} x2={windowBottomX} y2={padT + plotH} stroke="#f87171" strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={windowBottomX - 4} y={padT + 22} textAnchor="end" fill="#f87171" fontSize={9.5}>
        imp-95519 bottom T=3.0e12
      </text>
      <text x={(measuredTopX + windowBottomX) / 2} y={padT + 40} textAnchor="middle" fill="#f87171" fontSize={9.5}>
        ~{DATA.windowReach.gapToWindowBottomDecades.toFixed(1)} decades UNMEASURED
      </text>

      {/* GUE asymptote r = 1 */}
      <line x1={padL} y1={gueY} x2={padL + plotW} y2={gueY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
      <text x={padL + plotW - 4} y={gueY - 5} textAnchor="end" fill="#94a3b8" fontSize={9}>
        GUE asymptote r=1
      </text>

      {/* mean ratio line */}
      <line x1={padL} y1={meanY} x2={measuredTopX} y2={meanY} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="2 3" />
      <text x={padL + 4} y={meanY - 5} fill="#fbbf24" fontSize={9}>
        mean r&asymp;{DATA.trend.meanRatio.toFixed(3)}
      </text>

      <path d={measuredPath} fill="none" stroke="#60a5fa" strokeWidth={2} />
      {ROWS.map((r) => (
        <circle key={r.Tc} cx={xOf(logT(r.Tc))} cy={yOf(r.varRatioMeasuredOverGUE)} r={3} fill="#60a5fa" />
      ))}

      {xTicks.map((v) => (
        <text key={`tx${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
          1e{v}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {t.toFixed(1)}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        height T (log scale)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        var. ratio r(T)
      </text>
    </svg>
  );
}

export default function Imp95731NumberVarianceRatioViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Number-Variance Ratio r(T) vs Height and the Window-Reach Gap (imp-95710)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a
        measurement/presentation-only page re-plotting the frozen imp-95710
        tabulation (no re-derivation, no new claim). The conservatism r &lt; 1
        is established only across the measured window T = 1e4..5e5; the
        extrapolation out to the imp-95519 window bottom T = 3.0e12 is a
        named, unmeasured sub-gap. It changes no bound and proves no
        RH-relevant theorem. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains
        state of the art. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The pointwise number-variance ratio r(T)&nbsp;=&nbsp;sd(C&minus;E)&sup2;&nbsp;/&nbsp;&Sigma;&sup2;(L)
        compares the measured pointwise fluctuation of the zero-counting function against
        the GUE mean-square envelope &Sigma;&sup2;(L)&nbsp;=&nbsp;(1/&pi;&sup2;)(log(2&pi;L)&nbsp;+&nbsp;&gamma;&nbsp;+&nbsp;1).
        Across the six measured heights (T&nbsp;=&nbsp;1e4..5e5) it sits in a narrow band
        r&nbsp;&isin;&nbsp;[{DATA.trend.minRatio.toFixed(3)},&nbsp;{DATA.trend.maxRatio.toFixed(3)}]
        (mean&nbsp;&asymp;&nbsp;{DATA.trend.meanRatio.toFixed(3)}), well below the GUE asymptote 1, with a
        weak, noise-dominated log-linear slope (R&sup2;&nbsp;&asymp;&nbsp;{DATA.trend.r2.toFixed(2)}). The
        red band marks the ~{DATA.windowReach.gapToWindowBottomDecades.toFixed(1)}-decade
        gap between the sampled top height and the imp-95519 window bottom
        T&nbsp;=&nbsp;3.0e12, where whether the conservatism persists, deepens, or reverts
        toward 1 is UNMEASURED.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Variance ratio r(T) vs height (log scale)
      </h3>
      <VarianceRatioChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>local count L</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>GUE var</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>measured var</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>r(T)</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.Tc} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.Tc.toExponential(1)}</td>
              <td style={{ textAlign: 'right' }}>{r.meanLocalCountL.toFixed(2)}</td>
              <td style={{ textAlign: 'right' }}>{r.gueVariance.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.measuredVariance.toFixed(4)}</td>
              <td style={{ textAlign: 'right', color: '#60a5fa' }}>{r.varRatioMeasuredOverGUE.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page
        rendering the frozen imp-95710 tabulation (no re-derivation). Supplies
        no new bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
