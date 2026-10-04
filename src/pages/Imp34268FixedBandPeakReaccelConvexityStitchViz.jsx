import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34268_K_ENDS,
  IMP34268_PEAKS,
  IMP34268_INCREMENT_END_KENDS,
  IMP34268_INCREMENTS,
  IMP34268_LINEAR_FIT,
  IMP34268_UNDERPREDICT_ROWS,
  IMP34268_MAX_RESIDUAL,
  IMP34268_POSTMIN_SECOND_DIFF_KENDS,
  IMP34268_POSTMIN_SECOND_DIFFS,
  IMP34268_MAX_SECOND_DIFFERENCE,
} from '../data/imp-34268-fixed-band-peak-reaccel-convexity-stitch-viz-data.js';
import { ED } from '../styles/tokens.js';

// Panel 1: the stitched increment sequence (17 increments over the 18-window grid) against the
// imp-34196 4-point linear extrapolation -- actual pulls monotonically above the line past kEnd~19.5.
function StitchedIncrementChart() {
  const svgW = 680;
  const svgH = 280;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 17.15;
  const maxX = 21.35;
  const minY = 0.014;
  const maxY = 0.108;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const actualPath = IMP34268_INCREMENT_END_KENDS.map((k, i) => `${xAt(k)},${yAt(IMP34268_INCREMENTS[i])}`).join(' ');
  const fitXs = [18.75, 21.25];
  const fitPath = fitXs
    .map((k) => `${xAt(k)},${yAt(IMP34268_LINEAR_FIT.a + IMP34268_LINEAR_FIT.b * k)}`)
    .join(' ');
  const xTicks = [17.25, 18.0, 18.75, 19.5, 20.25, 21.0];
  const yTicks = [0.02, 0.04, 0.06, 0.08, 0.1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT + cH - 4} x2={xAt(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (right endpoint of each increment step)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        fixed-band peak increment
      </text>

      <polyline points={fitPath} fill="none" stroke={ED.series2} strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={xAt(20.4)} y={yAt(IMP34268_LINEAR_FIT.a + IMP34268_LINEAR_FIT.b * 20.4) - 8} fill={ED.series2} fontSize={9}>
        imp-34196 linear fit (extrapolated)
      </text>

      <polyline points={actualPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP34268_INCREMENT_END_KENDS.map((k, i) => (
        <circle
          key={'pt' + k}
          cx={xAt(k)}
          cy={yAt(IMP34268_INCREMENTS[i])}
          r={3.5}
          fill={k >= 19.75 - 1e-9 ? ED.brassDeco : '#c4b5fd'}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

// Panel 2: the growing under-prediction residual (actual - linear-prediction) across the 7
// imp-34169 windows -- +0.000213 (19.75) up to +0.080936 (21.25).
function ResidualChart() {
  const svgW = 680;
  const svgH = 240;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 19.6;
  const maxX = 21.35;
  const minY = 0;
  const maxY = 0.09;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34268_UNDERPREDICT_ROWS.map((r) => `${xAt(r.kEnd)},${yAt(r.residual)}`).join(' ');
  const xTicks = [19.75, 20.25, 20.75, 21.25];
  const yTicks = [0, 0.02, 0.04, 0.06, 0.08];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT + cH - 4} x2={xAt(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (right endpoint)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        residual (actual - linear-predicted)
      </text>

      <polyline points={path} fill="none" stroke={ED.series4} strokeWidth={2} />
      {IMP34268_UNDERPREDICT_ROWS.map((r) => (
        <circle key={'pt' + r.kEnd} cx={xAt(r.kEnd)} cy={yAt(r.residual)} r={3.5} fill={ED.series4} stroke={ED.paper} strokeWidth={0.75} />
      ))}
    </svg>
  );
}

// Panel 3: the increment third differences (second differences of the increments) over the
// post-minimum branch -- strictly positive and growing, +0.000960 -> +0.057428.
function ThirdDifferenceChart() {
  const svgW = 680;
  const svgH = 240;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 18.9;
  const maxX = 21.35;
  const minY = 0;
  const maxY = 0.06;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34268_POSTMIN_SECOND_DIFF_KENDS.map(
    (k, i) => `${xAt(k)},${yAt(IMP34268_POSTMIN_SECOND_DIFFS[i])}`,
  ).join(' ');
  const xTicks = [19.0, 19.5, 20.0, 20.5, 21.0];
  const yTicks = [0, 0.02, 0.04, 0.06];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT + cH - 4} x2={xAt(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (right endpoint)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        peak third difference
      </text>

      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.ruleSoft} strokeWidth={1} strokeDasharray="3,3" />
      <polyline points={path} fill="none" stroke={ED.series3} strokeWidth={2} />
      {IMP34268_POSTMIN_SECOND_DIFF_KENDS.map((k, i) => (
        <circle
          key={'pt' + k}
          cx={xAt(k)}
          cy={yAt(IMP34268_POSTMIN_SECOND_DIFFS[i])}
          r={3.5}
          fill={ED.series3}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp34268FixedBandPeakReaccelConvexityStitchViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Fixed-Band Peak Re-Acceleration Convexity Stitch (imp-34268 / imp-34196 / imp-34169)" />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-faint)' }}>
          &larr; back to the M2-ceiling cohort index
        </Link>
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 740 }}>
        imp-34196 fit the post-minimum fixed-band (k&le;10) peak re-acceleration branch as a LINEAR
        increment slope (b &asymp; {IMP34268_LINEAR_FIT.b.toFixed(7)}, R&sup2; &asymp;{' '}
        {IMP34268_LINEAR_FIT.r2.toFixed(5)}) on four windows ending kEnd = 18.75 .. 19.50. imp-34268
        stitches that branch onto the imp-34169 kEnd 20 .. 21 increments on ONE common 0.25 kEnd
        grid ({IMP34268_K_ENDS[0].toFixed(2)} .. {IMP34268_K_ENDS[IMP34268_K_ENDS.length - 1].toFixed(2)},
        18 windows) and finds the linear fit is reproduced exactly inside its own window but,
        extrapolated forward, UNDER-predicts every subsequent window monotonically -- the residual
        grows from {IMP34268_UNDERPREDICT_ROWS[0].residual.toFixed(6)} at kEnd ={' '}
        {IMP34268_UNDERPREDICT_ROWS[0].kEnd.toFixed(2)} to +{IMP34268_MAX_RESIDUAL.toFixed(6)} at kEnd
        = {IMP34268_UNDERPREDICT_ROWS[IMP34268_UNDERPREDICT_ROWS.length - 1].kEnd.toFixed(2)} -- because
        the fixed-band peak carries strictly POSITIVE and GROWING third differences (increment second
        differences up to +{IMP34268_MAX_SECOND_DIFFERENCE.toFixed(6)}). The re-acceleration branch is
        genuinely CONVEX, not linear.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        stitched 0.25-grid increments vs. the imp-34196 linear extrapolation -- actual (blue/gold)
        pulls above the fit (red dashed) past kEnd &asymp; 19.5
      </p>
      <StitchedIncrementChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        under-prediction residual (actual &minus; linear-predicted) -- monotone growth over the imp-34169 windows
      </p>
      <ResidualChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        increment third differences over the post-minimum branch (kEnd &ge; 19.0) -- strictly positive and rising
      </p>
      <ThirdDifferenceChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>actual increment</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>linear-predicted</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual</th>
          </tr>
        </thead>
        <tbody>
          {IMP34268_UNDERPREDICT_ROWS.map((r) => (
            <tr key={r.kEnd} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kEnd.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.actual.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.predicted.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--brass)' }}>
                +{r.residual.toFixed(6)}
              </td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked
        literals reproducing the imp-34268 measurement; no new derivation, no bound changed.
        Descriptive OLS surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; the functional form of the convex
        branch (quadratic, exponential, or pole-driven) is an OPEN sub-gap; NO QED.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Same fixed-band-peak cohort:</strong> the stitch grid
        runs to kEnd = 21.25, the last computable quarter-rung before the imp-34169 resid_exp
        surrogate pole at k* &asymp; 21.28. Neither imp-34196 (correct within 17.0 .. 19.5) nor
        imp-34169 (correct within 20 .. 21) is overturned by this stitch. Cross-linked here for
        context only; no bound or claim on this page changes. See the{' '}
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-soft)' }}>
          full M2-ceiling cohort index
        </Link>{' '}
        for the other viz surfaces sharing this ceiling.
      </div>
    </div>
  );
}
