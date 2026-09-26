import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97303_ROWS,
  IMP97303_MEASURED,
} from '../data/imp-97303-bessel-hankel-majorant-vs-measured-viz-data.js';

// imp-97303: imp-97263 derived a closed-form z^-4 majorant C(Z0) for the imp-97134 annihilating
// trials but shipped it only as prose ("~5-70x loose"). This page charts the flat majorant line
// against both measured |g(z)| z^4 curves (even-degree and odd-degree trials) on a log10 y-axis,
// then charts the looseness ratio C(Z0)/measured directly.

function LineChart({ series, xLabel, yLabel, logX = false }) {
  const svgW = 640;
  const svgH = 280;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tx = (x) => (logX ? Math.log10(x) : x);
  const allX = series.flatMap((s) => s.points.map((p) => tx(p.x)));
  const allY = series.flatMap((s) => s.points.map((p) => p.y));
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY) * (Math.min(...allY) < 0 ? 1.05 : 0.9);
  const maxY = Math.max(...allY) * 1.1;
  const spanY = maxY - minY || 1;

  const xOf = (x) => padL + ((tx(x) - minX) / (maxX - minX || 1)) * plotW;
  const yOf = (y) => padT + plotH - ((y - minY) / spanY) * plotH;

  const xTicks = Array.from({ length: 6 }, (_, i) => minX + (i / 5) * (maxX - minX));
  const yTicks = Array.from({ length: 5 }, (_, i) => minY + (i / 4) * spanY);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(logX ? 10 ** v : v)} y1={padT + plotH} x2={xOf(logX ? 10 ** v : v)} y2={padT + plotH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xOf(logX ? 10 ** v : v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
            {logX ? `1e${v.toFixed(1)}` : v.toFixed(0)}
          </text>
        </g>
      ))}
      {series.map((s) => (
        <g key={s.label}>
          <polyline
            points={s.points.map((p) => `${xOf(p.x)},${yOf(p.y)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={1.9}
            strokeDasharray={s.dashed ? '4,3' : undefined}
          />
          {s.points.map((p) => (
            <circle key={`${s.label}-${p.x}`} cx={xOf(p.x)} cy={yOf(p.y)} r={2.4} fill={s.color} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        {xLabel}
      </text>
      <text x={12} y={padT + 8} fill="#94a3b8" fontSize={9}>
        {yLabel}
      </text>
    </svg>
  );
}

function Legend({ series }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
      {series.map((s) => (
        <span key={s.label} style={{ color: s.color }}>
          &#9632; {s.label}
        </span>
      ))}
    </div>
  );
}

export default function Imp97303BesselHankelMajorantViz() {
  const magnitudeSeries = [
    { label: 'majorant C(Z0)', color: '#a78bfa', dashed: true, points: IMP97303_ROWS.map((r) => ({ x: r.z, y: Math.log10(r.majorantGz4) })) },
    { label: 'even trial: measured |g(z)| z^4', color: '#38bdf8', points: IMP97303_ROWS.map((r) => ({ x: r.z, y: Math.log10(r.evenGz4) })) },
    { label: 'odd trial: measured |g(z)| z^4', color: '#f87171', points: IMP97303_ROWS.map((r) => ({ x: r.z, y: Math.log10(r.oddGz4) })) },
  ];
  const ratioSeries = [
    { label: 'C(Z0) / even measured', color: '#38bdf8', points: IMP97303_ROWS.map((r) => ({ x: r.z, y: r.evenRatio })) },
    { label: 'C(Z0) / odd measured', color: '#f87171', points: IMP97303_ROWS.map((r) => ({ x: r.z, y: r.oddRatio })) },
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Bessel-Hankel z^-4 Majorant vs the Measured Annihilating-Trial Decay" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> MEASUREMENT only. imp-97263
        derived the closed-form analytic constant C(Z0)&nbsp;&asymp;&nbsp;{IMP97303_MEASURED.CofZ0.toExponential(3)}{' '}
        (at Z0&nbsp;=&nbsp;a&nbsp;T&nbsp;&asymp;&nbsp;{IMP97303_MEASURED.Z0.toFixed(2)}) bounding
        |g(z)|&nbsp;z^4 for the imp-97134 annihilating trials via the triangle inequality on the
        exact terminating Hankel P/Q expansion. It is valid at every measured rung but loose: the
        even-degree trial sits {IMP97303_MEASURED.evenRatioBand[0].toFixed(1)}x&ndash;
        {IMP97303_MEASURED.evenRatioBand[1].toFixed(1)}x under it, the odd-degree trial{' '}
        {IMP97303_MEASURED.oddRatioBand[0].toFixed(1)}x&ndash;{IMP97303_MEASURED.oddRatioBand[1].toFixed(1)}x
        under it. No bound moves; Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains SOTA; RH
        open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        The majorant (purple, dashed) sits above both measured curves at every rung z&nbsp;=
        &nbsp;{IMP97303_MEASURED.zRange[0]}..{IMP97303_MEASURED.zRange[1]}, confirming validity of
        the triangle-inequality bound derived from exact-integer Hankel coefficients; the gap to
        each measured curve is the price of not exploiting further cross-degree cancellation.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        log10(|g(z)| z^4): majorant vs measured, by trial (log10 z scale)
      </h3>
      <LineChart series={magnitudeSeries} xLabel="z (log10 scale)" yLabel="log10(|g(z)| z^4)" logX />
      <Legend series={magnitudeSeries} />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '1.5rem 0 1rem', maxWidth: 700 }}>
        Normalizing by the measured curve shows the looseness directly as a ratio C(Z0) / measured:
        the odd-degree trial (red) stays a modest few-x under the bound at every rung, while the
        even-degree trial (blue) -- whose measured decay is itself much smaller -- sits far further
        under it, since C(Z0) is a single constant built to cover both trials simultaneously.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Looseness ratio C(Z0) / measured |g(z)| z^4 vs z (log10 scale)
      </h3>
      <LineChart series={ratioSeries} xLabel="z (log10 scale)" yLabel="C(Z0) / measured" logX />
      <Legend series={ratioSeries} />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-97303 viz-data leaf (majorant constant reused verbatim from imp-97263, measured decay
        reused verbatim from imp-97134; no re-evaluation of any spherical-Bessel function). Changes
        no bound, establishes no operator positivity; Platt-Trudgian &Lambda;&le;0.2 remains SOTA;
        RH open; NO QED.
      </div>
    </div>
  );
}
