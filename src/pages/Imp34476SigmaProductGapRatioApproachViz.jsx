import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34415_SIGMA_PRODUCT_GAP_RATIO_99PCT_CROSSING } from '../data/imp-34415-sigma-product-gap-ratio-99pct-crossing.js';
import { ED } from '../styles/tokens.js';

const { ladder, crossing, deficitNumerator, verdict } = IMP34415_SIGMA_PRODUCT_GAP_RATIO_99PCT_CROSSING;

// x-axis is log10(log10N) since the ladder spans log10N = 12 .. 1e5 (four decades of decades).
function RatioChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = ladder.map((r) => Math.log10(r.log10N));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = 0.88;
  const yMax = 1.0;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const ratioPts = ladder.map((r) => `${xAt(Math.log10(r.log10N))},${yAt(r.ratio)}`).join(' ');
  const xCross = xAt(Math.log10(crossing.log10NStar));
  const yCross = yAt(crossing.target);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[0.88, 0.92, 0.96, 0.99, 1.0].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {ladder.map((r) => (
        <text
          key={'x' + r.log10N}
          x={xAt(Math.log10(r.log10N))}
          y={padT + cH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={8}
        >
          {r.log10N >= 1000 ? r.log10N.toExponential(0) : r.log10N.toFixed(0)}
        </text>
      ))}

      <line x1={padL} y1={yCross} x2={padL + cW} y2={yCross} stroke={ED.series3} strokeWidth={1} strokeDasharray="5,3" />
      <text x={padL + 6} y={yCross - 6} fill={ED.series3} fontSize={9.5}>
        0.99 crossing (log10 N &asymp; {crossing.log10NStar.toFixed(1)})
      </text>

      <polyline points={ratioPts} fill="none" stroke={ED.series1} strokeWidth={2} />
      {ladder.map((r) => (
        <circle key={r.log10N} cx={xAt(Math.log10(r.log10N))} cy={yAt(r.ratio)} r={2.75} fill={ED.series1} />
      ))}
      <circle cx={xCross} cy={yCross} r={4} fill="none" stroke={ED.series3} strokeWidth={1.5} />

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        R(u) = gapSigma / gapProduct
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(N) (log-scaled axis)
      </text>
    </svg>
  );
}

// The exact deficit 1 - R = (1 + log 2pi)/logT0 on a log-log axis: a straight line confirms the
// pure 1/logT0 decay (slope -1 in log-log space).
function DeficitChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = ladder.map((r) => Math.log10(r.log10N));
  const ys = ladder.map((r) => Math.log10(r.deficitFromOne));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const pts = ladder.map((r) => `${xAt(Math.log10(r.log10N))},${yAt(Math.log10(r.deficitFromOne))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[yMin, (yMin + yMax) / 2, yMax].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            10^{v.toFixed(1)}
          </text>
        </g>
      ))}
      {ladder.map((r) => (
        <text
          key={'x' + r.log10N}
          x={xAt(Math.log10(r.log10N))}
          y={padT + cH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={8}
        >
          {r.log10N >= 1000 ? r.log10N.toExponential(0) : r.log10N.toFixed(0)}
        </text>
      ))}

      <polyline points={pts} fill="none" stroke={ED.series7} strokeWidth={2} />
      {ladder.map((r) => (
        <circle
          key={r.log10N}
          cx={xAt(Math.log10(r.log10N))}
          cy={yAt(Math.log10(r.deficitFromOne))}
          r={2.75}
          fill={ED.series7}
        />
      ))}

      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        1 &minus; R (log scale)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(N) (log-scaled axis)
      </text>
    </svg>
  );
}

export default function Imp34476SigmaProductGapRatioApproachViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma/Product Gap Ratio Approach to 1 (imp-34476 / imp-34415)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34328 found the sigma and product gap channels have ratio R(u) = (u&minus;1)/(u+log&nbsp;2&pi;),
        which rises toward 1 but never reaches it at any evaluated height. imp-34415 shows the deficit
        1&nbsp;&minus;&nbsp;R = {deficitNumerator.toFixed(5)}/log&nbsp;T0 decays purely logarithmically, so the
        two channels do not agree to 1% until log10&nbsp;N &asymp; {crossing.log10NStar.toFixed(1)}
        (log&nbsp;T0 &asymp; {crossing.logT0Star.toFixed(1)}), tightening only ~{crossing.rate_dRatio_dlog10N.toExponential(2)}
        {' '}per decade of N at that point.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        R(u) vs log10(N): approaches 1 from below, marked 0.99 crossing
      </p>
      <RatioChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        exact deficit 1 &minus; R = (1 + log 2&pi;)/log T0 (log-log axes: straight line confirms the pure 1/log T0 decay)
      </p>
      <DeficitChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log T0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>R(u)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>1 &minus; R</th>
          </tr>
        </thead>
        <tbody>
          {ladder.map((row) => (
            <tr key={row.log10N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>
                {row.log10N === crossing.log10NStar ? row.log10N.toFixed(3) + ' (0.99 crossing)' : row.log10N}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.logT0.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.ratio.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.deficitFromOne.toExponential(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {verdict}
      </div>
    </div>
  );
}
