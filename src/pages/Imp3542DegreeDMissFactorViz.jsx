import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3542_MEASURED_D2_S3,
  IMP3542_MEASURED_D2_S4,
  IMP3542_MEASURED_D3_S3,
  IMP3542_MEASURED_D3_S4,
  IMP3542_FAMILY_DEGREES,
  IMP3542_K_MIN,
  IMP3542_K_MAX,
} from '../data/imp-3542-degree-d-miss-factor-viz-data.js';

const missFactor = (d, k) => 1 - 1 / Math.pow(k, d + 1);
const overPrediction = (d, k) => Math.pow(k, d + 1);

const K_SAMPLES = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8];
const DEGREE_COLORS = { 1: '#64748b', 2: '#7c3aed', 3: '#10b981', 4: '#f59e0b', 5: '#ef4444' };

function MissFactorChart() {
  const svgW = 620;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const xS = (k) => padL + ((k - 1) / (IMP3542_K_MAX - 1)) * cW;
  const yS = (v) => padT + cH * (1 - v);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {IMP3542_FAMILY_DEGREES.map((d) => {
        const path = K_SAMPLES.map((k, i) => (i === 0 ? 'M' : 'L') + xS(k).toFixed(1) + ',' + yS(missFactor(d, k)).toFixed(2)).join(' ');
        return <path key={d} d={path} fill="none" stroke={DEGREE_COLORS[d]} strokeWidth={2} opacity={d === 2 || d === 3 ? 1 : 0.45} />;
      })}

      {[
        { pts: IMP3542_MEASURED_D2_S3, color: '#7c3aed' },
        { pts: IMP3542_MEASURED_D3_S3, color: '#10b981' },
      ].map(({ pts, color }, i) =>
        pts.map((r) => (
          <circle key={i + '-' + r.k} cx={xS(r.k)} cy={yS(r.measuredMiss)} r={3.5} fill={color} stroke="#0a0f1a" strokeWidth={1} />
        ))
      )}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[2, 3, 4, 6, 8].map((k) => (
        <g key={'x' + k}>
          <line x1={xS(k)} y1={padT + cH} x2={xS(k)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        ladder index k
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        miss factor 1 &minus; 1/k^(d+1)
      </text>

      <g>
        {IMP3542_FAMILY_DEGREES.map((d, i) => (
          <g key={d}>
            <circle cx={padL + 14} cy={padT + 14 + i * 14} r={4} fill={DEGREE_COLORS[d]} />
            <text x={padL + 22} y={padT + 17 + i * 14} fill="#94a3b8" fontSize={9}>
              d = {d} (1 &minus; 1/k^{d + 1}){d === 2 || d === 3 ? ' -- measured points overlaid' : ''}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function OverPredictionChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMin = 0;
  const yMax = Math.log10(overPrediction(5, IMP3542_K_MAX));
  const xS = (k) => padL + ((Math.log10(k) - Math.log10(IMP3542_K_MIN)) / (Math.log10(IMP3542_K_MAX) - Math.log10(IMP3542_K_MIN))) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const yTicks = [1, 10, 1e2, 1e3, 1e4, 1e5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v >= 1000 ? v.toExponential(0) : v}
          </text>
        </g>
      ))}

      {IMP3542_FAMILY_DEGREES.map((d) => {
        const path = K_SAMPLES.map((k, i) => (i === 0 ? 'M' : 'L') + xS(k).toFixed(1) + ',' + yS(overPrediction(d, k)).toFixed(2)).join(' ');
        return <path key={d} d={path} fill="none" stroke={DEGREE_COLORS[d]} strokeWidth={2} opacity={d === 2 || d === 3 ? 1 : 0.45} />;
      })}

      {[
        { pts: IMP3542_MEASURED_D2_S3, d: 2, color: '#7c3aed' },
        { pts: IMP3542_MEASURED_D3_S3, d: 3, color: '#10b981' },
      ].map(({ pts, d, color }, i) =>
        pts.map((r) => (
          <circle
            key={i + '-' + r.k}
            cx={xS(r.k)}
            cy={yS(1 / (1 - r.measuredMiss))}
            r={3.5}
            fill={color}
            stroke="#0a0f1a"
            strokeWidth={1}
          />
        ))
      )}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[2, 3, 4, 6, 8].map((k) => (
        <g key={'x' + k}>
          <line x1={xS(k)} y1={padT + cH} x2={xS(k)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        ladder index k (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        over-prediction k^(d+1) (log scale)
      </text>
    </svg>
  );
}

export default function Imp3542DegreeDMissFactorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Degree-d Miss-Factor Family 1 &minus; 1/k^(d+1) vs. Ladder Index k (imp-3488 / imp-3510 / imp-3524 / imp-3542)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3488 derived the closed-form degree-2 (cosh) miss factor 1 &minus; 1/k<sup>3</sup> and
        imp-3510 the degree-3 (sinh) analogue 1 &minus; 1/k<sup>4</sup>; imp-3524 unified both into
        the single degree-indexed law 1 &minus; 1/k<sup>(d+1)</sup> (exponent p = d, over-prediction
        k<sup>(d+1)</sup>) from the leading bridge-mass form B<sub>d</sub>(a) &sim; (a<sup>d</sup>/d!)
        M<sub>d</sub>. The curves below plot the family for d = 1..5, with the measured d = 2, 3 points
        from the imp-3469 k-ladder {'{'}2,3,4,6,8{'}'} on both base cells overlaid, landing on their
        closed forms.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Miss factor 1 &minus; 1/k^(d+1) for d = 1..5, with measured d = 2, 3 points (S3 cell)
      </p>
      <MissFactorChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Over-prediction factor k^(d+1) for d = 1..5 (log-log), with measured d = 2, 3 points (S3 cell)
      </p>
      <OverPredictionChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> derivation/certification and
        visualization only &mdash; no proof, no reduction below RH. This unifies the k-scaling law
        of the absolute-measure degree-d bridge-mass integrand across d; it establishes no operator
        positivity. Mass-feasibility is necessary-but-not-sufficient and the degree-d faces carry no
        feasibility comparison (imp-3469). The operator-level K_a &ge; 0 sign-positivity residual
        (imp-3066) remains untouched. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3541-cosh-cancellation-margin" style={{ color: '#7c3aed' }}>
          Cosh Cancellation-Safety Margin (imp-3541)
        </Link>
      </div>
    </div>
  );
}
