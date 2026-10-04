import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS } from '../data/imp-34408-widening-slope-prepole-landmark-decade-axis.js';
import { ED } from '../styles/tokens.js';

const {
  landmarks,
  gapK_L1_L2,
  gapK_L2_L3,
  gapRatioK,
  gapRatioU,
  verdict,
} = IMP34408_WIDENING_SLOPE_PREPOLE_LANDMARK_DECADE_AXIS;

// The three landmarks on the shared k-axis, with the two consecutive gaps and their compression ratio.
function LandmarkAxis() {
  const svgW = 680;
  const svgH = 190;
  const padL = 40;
  const padR = 40;
  const padT = 50;
  const padB = 46;
  const cW = svgW - padL - padR;
  const axisY = padT + 40;

  const kMin = landmarks[0].k - 1.2;
  const kMax = landmarks[2].k + 1.2;
  const xAt = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const colors = [ED.series1, ED.series3, ED.series2];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />

      {landmarks.map((lm, i) => (
        <g key={lm.id}>
          <line x1={xAt(lm.k)} y1={axisY - 8} x2={xAt(lm.k)} y2={axisY + 8} stroke={colors[i]} strokeWidth={2} />
          <circle cx={xAt(lm.k)} cy={axisY} r={4.5} fill={colors[i]} />
          <text x={xAt(lm.k)} y={axisY - 16} textAnchor="middle" fill={colors[i]} fontSize={9.5} fontWeight={700}>
            L{i + 1}
          </text>
          <text x={xAt(lm.k)} y={axisY + 22} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
            k&asymp;{lm.k}
          </text>
          <text x={xAt(lm.k)} y={axisY + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            u&asymp;{lm.u}
          </text>
        </g>
      ))}

      {/* gap L1->L2 */}
      <line
        x1={xAt(landmarks[0].k)}
        y1={axisY - 26}
        x2={xAt(landmarks[1].k)}
        y2={axisY - 26}
        stroke={ED.rule}
        strokeWidth={1}
        markerEnd="url(#arrowEnd)"
      />
      <text x={(xAt(landmarks[0].k) + xAt(landmarks[1].k)) / 2} y={axisY - 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        gap {gapK_L1_L2.toFixed(2)}
      </text>

      {/* gap L2->L3 */}
      <line
        x1={xAt(landmarks[1].k)}
        y1={axisY - 26}
        x2={xAt(landmarks[2].k)}
        y2={axisY - 26}
        stroke={ED.rule}
        strokeWidth={1}
      />
      <text x={(xAt(landmarks[1].k) + xAt(landmarks[2].k)) / 2} y={axisY - 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        gap {gapK_L2_L3.toFixed(2)}
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        decade index k (shared axis) &mdash; second gap &asymp; {(gapRatioK * 100).toFixed(1)}% of first (k), {(gapRatioU * 100).toFixed(1)}% (u)
      </text>
    </svg>
  );
}

export default function Imp34478WideningSlopePrepoleLandmarkDecadeAxisViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Three Widening-Slope Pre-Pole Landmarks on One Decade Axis (imp-34478 / imp-34408)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34408 co-tabulates three previously separate widening-slope pre-pole landmarks on one shared
        decade axis: the imp-34330 residual sign-change (L1, k&asymp;{landmarks[0].k}), the imp-34327 mapped
        &minus;1 crossing (L2, k&asymp;{landmarks[1].k}), and the imp-34247/imp-34023 M2 pole (L3,
        k&asymp;{landmarks[2].k}). The consecutive gaps compress toward the pole &mdash; the second gap is
        only &asymp;{(gapRatioK * 100).toFixed(1)}% of the first on the k-axis ({(gapRatioU * 100).toFixed(1)}%
        on the u-axis) &mdash; and the two axis ratios agree to &lt;0.1%, the signature of a near-affine
        height map rather than an independent arithmetic or geometric ladder.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        L1, L2, L3 on the shared k-axis, with the two consecutive gaps and their compression ratio
      </p>
      <LandmarkAxis />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>name</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>u</th>
          </tr>
        </thead>
        <tbody>
          {landmarks.map((lm, i) => (
            <tr key={lm.id} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>L{i + 1} ({lm.id})</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{lm.name}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{lm.k}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{lm.u}</td>
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
