import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION as MS } from '../data/imp-33941-endpoint-peak-growth-model-selection.js';
import { IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW } from '../data/imp-33917-endpoint-residual-growth-law.js';

const { boundarySweep: ROWS } = IMP33917_ENDPOINT_RESIDUAL_GROWTH_LAW;
const { linearFit: LIN, logFit: LOG, selection: SEL } = MS;

// The 9 imp-33917 endpoint peaks with the two imp-33941 OLS curves (linear vs concave-log)
// overlaid, so the model-selection decision (log favored, not decisive) is visible as shapes
// rather than only as AIC/BIC numbers.
function EndpointPeakFitChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = ROWS.map((r) => r.kEnd);
  const ys = ROWS.map((r) => r.peak);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const curveXs = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    curveXs.push(minX + ((maxX - minX) * i) / steps);
  }
  const linYs = curveXs.map((x) => LIN.a + LIN.b * x);
  const logYs = curveXs.map((x) => LOG.a + LOG.b * Math.log(x));

  const allYs = [...ys, ...linYs, ...logYs];
  const minY = Math.min(...allYs);
  const maxY = Math.max(...allYs);
  const padY = (maxY - minY) * 0.08;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY - padY) / (maxY - minY + 2 * padY)) * cH;

  const linPath = curveXs.map((x, i) => `${xAt(x)},${yAt(linYs[i])}`).join(' ');
  const logPath = curveXs.map((x, i) => `${xAt(x)},${yAt(logYs[i])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={linPath} fill="none" stroke="#64748b" strokeWidth={1.75} strokeDasharray="5,3" />
      <polyline points={logPath} fill="none" stroke="#facc15" strokeWidth={2} />
      {xs.map((x, i) => (
        <circle key={`pt-${x}`} cx={xAt(x)} cy={yAt(ys[i])} r={4} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {xs.map((x) => (
        <text key={`xt-${x}`} x={xAt(x)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {x}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        kEnd (OLS fit boundary)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        endpoint peak residual
      </text>
      <text x={padL + 4} y={padT + 12} fill="#38bdf8" fontSize={9.5}>
        imp-33917 measured peaks (9 windows)
      </text>
      <text x={padL + 4} y={padT + 26} fill="#facc15" fontSize={9.5}>
        log fit peak = a + b ln(kEnd) -- favored, w~{SEL.akaikeWeightLog.toFixed(3)}
      </text>
      <text x={padL + 4} y={padT + 40} fill="#64748b" fontSize={9.5}>
        linear fit peak = a + b kEnd -- w~{SEL.akaikeWeightLin.toFixed(3)}
      </text>
    </svg>
  );
}

function ScoreRow({ label, lin, log }) {
  return (
    <tr>
      <td style={{ padding: '0.3rem 0.75rem', color: '#94a3b8' }}>{label}</td>
      <td style={{ padding: '0.3rem 0.75rem', color: '#cbd5e1' }}>{lin}</td>
      <td style={{ padding: '0.3rem 0.75rem', color: '#facc15' }}>{log}</td>
    </tr>
  );
}

export default function Imp34014EndpointPeakModelSelectionFitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Endpoint-Peak Growth Model Selection (imp-33941)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33917 fit the imp-33810 boundary-locked endpoint residual peak over the 9-window
        kEnd = 11..13 sweep with two descriptive forms -- linear and concave log -- calling log
        "marginally better" without formally deciding between them. imp-33941 scores both fits
        against AIC, BIC, AICc and RMSE and finds the concave log form favored by every criterion
        (evidence ratio ~{SEL.evidenceRatioLogOverLin.toFixed(2)}:1), a POSITIVE but not decisive
        margin. The chart below overlays both fitted curves on the 9 measured peaks.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        endpoint peak vs kEnd -- measured points with linear and concave-log OLS fits
      </p>
      <EndpointPeakFitChart />

      <table style={{ marginTop: '1.5rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr>
            <td style={{ padding: '0.3rem 0.75rem', color: '#64748b', fontWeight: 700 }}>criterion</td>
            <td style={{ padding: '0.3rem 0.75rem', color: '#64748b', fontWeight: 700 }}>linear</td>
            <td style={{ padding: '0.3rem 0.75rem', color: '#64748b', fontWeight: 700 }}>log (favored)</td>
          </tr>
        </thead>
        <tbody>
          <ScoreRow label="RMSE" lin={LIN.rmse} log={LOG.rmse} />
          <ScoreRow label="AIC" lin={LIN.aic.toFixed(2)} log={LOG.aic.toFixed(2)} />
          <ScoreRow label="BIC" lin={LIN.bic.toFixed(2)} log={LOG.bic.toFixed(2)} />
          <ScoreRow label="AICc" lin={LIN.aicc.toFixed(2)} log={LOG.aicc.toFixed(2)} />
          <ScoreRow label="Akaike weight" lin={SEL.akaikeWeightLin} log={SEL.akaikeWeightLog} />
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement / model-selection
        only, no proof, no fresh derivation. {MS.finding.R2_strength_positive_not_decisive}{' '}
        The component model is the inherited imp-3220/imp-3406 extrapolation; both forms are
        descriptive, not derived; the imp-33843 log-linear-vs-power-law verdict is untouched;
        C_mb GUE-conditional per imp-486 untouched; NO QED; Platt-Trudgian Lambda&lt;=0.2 remains
        SOTA.
      </div>
    </div>
  );
}
