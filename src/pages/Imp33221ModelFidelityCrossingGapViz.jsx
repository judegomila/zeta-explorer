import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33221_RUNGS,
  IMP33221_CROSSING_C123,
  IMP33221_CROSSING_EXTENDED,
  IMP33221_CROSSING_MODEL_EXACT,
  IMP33221_CROSSING_MEASURED,
  IMP33221_CROSSING_GAP,
  IMP33221_TILT_GRID,
} from '../data/imp-33221-model-fidelity-crossing-gap-viz-data.js';

function LnCrossingChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const nMin = 10;
  const nMax = 80;
  const yMin = -0.2;
  const yMax = 2.2;

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const series = [
    { key: 'driftMeasured', color: '#f472b6', label: 'measured (real A(tau))' },
    { key: 'driftModelExact', color: '#38bdf8', label: 'surrogate, exact resummation' },
    { key: 'driftExtended', color: '#34d399', label: 'surrogate, +C1..C5 series' },
    { key: 'driftC123', color: '#94a3b8', label: 'surrogate, imp-3848 +C1..C3' },
  ];

  const yTicks = [0, 0.5, 1, 1.5, 2];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="5,3" />
      <text x={padL + 4} y={yS(1) - 5} fill="#fbbf24" fontSize={8.5}>
        L_n = 1
      </text>

      {[
        { n: IMP33221_CROSSING_MODEL_EXACT, color: '#38bdf8', label: 'n~18.38' },
        { n: IMP33221_CROSSING_MEASURED, color: '#f472b6', label: 'n~48.58' },
      ].map((c) => (
        <g key={c.label}>
          <line x1={xS(c.n)} y1={padT} x2={xS(c.n)} y2={padT + cH} stroke={c.color} strokeWidth={1} strokeDasharray="2,3" opacity={0.7} />
          <text x={xS(c.n)} y={padT - 8} textAnchor="middle" fill={c.color} fontSize={8.5}>
            {c.label}
          </text>
        </g>
      ))}

      {series.map((s) => {
        const path = IMP33221_RUNGS.map(
          (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r[s.key]).toFixed(2),
        ).join(' ');
        return <path key={s.key} d={path} fill="none" stroke={s.color} strokeWidth={2} />;
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP33221_RUNGS.map((r) => (
        <g key={'x' + r.n}>
          <line x1={xS(r.n)} y1={padT + cH} x2={xS(r.n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        n
      </text>

      <g transform={`translate(${padL + cW - 210}, ${padT + 6})`}>
        {series.map((s, i) => (
          <g key={s.key} transform={`translate(0, ${i * 13})`}>
            <line x1={0} y1={0} x2={16} y2={0} stroke={s.color} strokeWidth={2} />
            <text x={20} y={3.5} fill="#94a3b8" fontSize={8.5}>
              {s.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function C4C5MagnitudeChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const nMin = 10;
  const nMax = 80;
  const yMin = -3.2;
  const yMax = -0.5;

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const yTicks = [1e-1, 1e-2, 1e-3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {['c4', 'c5'].map((key, si) => {
        const color = key === 'c4' ? '#34d399' : '#a78bfa';
        const path = IMP33221_RUNGS.map((r, i) => {
          const v = Math.max(1e-5, Math.abs(r[key]));
          return (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(v).toFixed(2);
        }).join(' ');
        return (
          <g key={key}>
            <path d={path} fill="none" stroke={color} strokeWidth={2} />
            {IMP33221_RUNGS.map((r) => (
              <circle key={r.n} cx={xS(r.n)} cy={yS(Math.max(1e-5, Math.abs(r[key])))} r={3} fill={color} />
            ))}
            <text x={padL + cW - 4} y={padT + 12 + si * 12} textAnchor="end" fill={color} fontSize={8.5}>
              {key === 'c4' ? '|C4| (fifth-derivative)' : '|C5| (sixth-derivative)'}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP33221_RUNGS.map((r) => (
        <g key={'x' + r.n}>
          <line x1={xS(r.n)} y1={padT + cH} x2={xS(r.n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        n
      </text>
    </svg>
  );
}

export default function Imp33221ModelFidelityCrossingGapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Model-Fidelity L_n = 1 Crossing Gap (imp-3871 / imp-3893)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The reduced moment-ratio drift factor L_n = eps_n * n(1 + 4 tau*) predicted by the imp-3665
        super-exponential surrogate integrand tau^n exp(-pi e^{'{4 tau}'}) crosses L_n = 1 at
        n &asymp; {IMP33221_CROSSING_MODEL_EXACT.toFixed(2)} -- whether measured from the imp-3848
        truncated series (+C1..C3, n &asymp; {IMP33221_CROSSING_C123.toFixed(2)}), the imp-3871
        extended series (+C4, C5, n &asymp; {IMP33221_CROSSING_EXTENDED.toFixed(2)}), or the fully
        resummed surrogate integrand itself. The measurement built from the real Phi-autocorrelation
        A(tau) instead crosses at n &asymp; {IMP33221_CROSSING_MEASURED.toFixed(2)}, a gap of
        &asymp; {IMP33221_CROSSING_GAP.toFixed(1)} units that no saddle order can close.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        L_n across n=10..80: three surrogate descriptions converge near n&asymp;18, the real-A(tau)
        measurement crosses far to the right near n&asymp;48.6
      </p>
      <LnCrossingChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        The imp-3871 fifth/sixth-derivative saddle corrections |C4|, |C5|: small and shrinking, not
        growing -- they cannot supply the ~30-unit shift needed to reach the measured crossing
      </p>
      <C4C5MagnitudeChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> the top chart shows that
        adding the imp-3871 C4/C5 terms (green) to the imp-3848 truncation (grey) moves the
        predicted crossing only from n&asymp;17.1 to n&asymp;18.3, landing almost exactly on the
        fully-resummed surrogate crossing (blue, n&asymp;18.38) -- the asymptotic series has
        effectively converged by five terms. The measured curve (pink), built from the real
        Phi-autocorrelation A(tau) via the imp-3893 moment ladder, sits well above the surrogate
        curves across the whole range and only reaches L_n=1 near n&asymp;48.6. The bottom chart
        shows why higher saddle orders cannot close the gap: |C4| and |C5| shrink monotonically
        from n=10 to n=80 (C4: 0.131 &rarr; 0.0007; |C5|: 0.017 &rarr; 0.0001) instead of growing,
        so the surrogate series has no room left to move its crossing another ~30 units. imp-3893
        pinned the actual mechanism instead: a sub-3% moment-ratio tilt T_n (
        {IMP33221_TILT_GRID[0].tilt.toFixed(4)} at n=10 down to{' '}
        {IMP33221_TILT_GRID[IMP33221_TILT_GRID.length - 1].tilt.toFixed(4)} at n=80) between the
        true and surrogate weights, leveraged by the eps_n near-cancellation into an additive drift
        offset supplying 94-100% of the L_n gap -- a model-fidelity discrepancy in the weight
        itself, not a truncation-order artifact.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/characterization
        only -- no proof, no reduction below RH. This localizes and quantifies a model-fidelity gap
        between the imp-3665 super-exponential surrogate A(tau) and the real Phi-autocorrelation
        A(tau); it establishes no operator positivity, mass-feasibility is
        necessary-but-not-sufficient, and the operator-level K_a &ge; 0 sign-positivity residual
        (imp-3066) remains untouched. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
