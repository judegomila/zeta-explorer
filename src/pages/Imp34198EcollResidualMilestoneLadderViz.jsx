import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34198_RESIDUAL_LADDER,
  IMP34198_MILESTONE_CROSSINGS,
  residLawAtLogT0,
} from '../data/imp-34198-ecoll-residual-milestone-ladder-viz-data.js';

// log-log chart: x = log10(log T0), y = log10(residToHalf), so the 1/(2 log T0)
// reference law renders as a straight diagonal line and the measured ladder's
// glacial-but-monotone approach to it is directly legible.
function ResidualVsLogT0Chart() {
  const svgW = 680;
  const svgH = 360;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = IMP34198_RESIDUAL_LADDER.map((r) => Math.log10(r.logT0));
  const ys = IMP34198_RESIDUAL_LADDER.map((r) => Math.log10(r.residToHalf));
  const minX = Math.min(...xs) - 0.1;
  const maxX = Math.max(...xs) + 0.1;
  const minY = Math.min(...ys) - 0.3;
  const maxY = Math.max(...ys) + 0.3;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const dataPath = xs.map((x, i) => `${xAt(x)},${yAt(ys[i])}`).join(' ');

  const lawSteps = 60;
  const lawPath = [];
  for (let i = 0; i <= lawSteps; i += 1) {
    const xLogLogT0 = minX + ((maxX - minX) * i) / lawSteps;
    const logT0 = 10 ** xLogLogT0;
    const y = Math.log10(residLawAtLogT0(logT0));
    lawPath.push(`${xAt(xLogLogT0)},${yAt(y)}`);
  }

  const milestonePoints = IMP34198_MILESTONE_CROSSINGS.map((m) => ({
    ...m,
    x: xAt(Math.log10(m.logT0)),
    y: yAt(Math.log10(m.threshold)),
  }));

  const xTicks = [2, 2.5, 3, 3.5, 4, 4.5, 5];
  const yTicks = [-2, -3, -4, -5, -6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={lawPath.join(' ')} fill="none" stroke="#facc15" strokeWidth={1.5} strokeDasharray="4,2" />
      <polyline points={dataPath} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {xs.map((x, i) => (
        <circle key={`pt-${x}`} cx={xAt(x)} cy={yAt(ys[i])} r={2.75} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={0.5} />
      ))}
      {milestonePoints.map((m) => (
        <g key={`ms-${m.threshold}`}>
          <circle cx={m.x} cy={m.y} r={4} fill="#f87171" stroke="#0a0f1a" strokeWidth={0.75} />
          <text x={m.x} y={m.y - 8} textAnchor="middle" fill="#f87171" fontSize={8.5}>
            {m.label}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <text key={`xt-${t}`} x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {`1e${t}`}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`yt-${t}`} x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
          {`1e${t}`}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        log T0 (log scale)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + cH / 2})`}
      >
        residual to -1/2 (log scale)
      </text>
      <text x={padL + 6} y={padT + 12} fill="#38bdf8" fontSize={9.5}>
        resid(N) measured (log-space direct path)
      </text>
      <text x={padL + 6} y={padT + 24} fill="#facc15" fontSize={9.5}>
        law: 1/(2 log T0)
      </text>
    </svg>
  );
}

export default function Imp34198EcollResidualMilestoneLadderViz() {
  const lastRung = IMP34198_RESIDUAL_LADDER[IMP34198_RESIDUAL_LADDER.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_coll Residual-to-(-1/2) Milestone Ladder (imp-34130)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34130 measured the separated E_coll local-exponent residual to -1/2,
        resid(N) = q(N) + 1/2, and found it keeps CLOSING toward zero as N grows
        rather than saturating at a floor -- decaying as ~1/(2 log T0), the
        identical law governing the imp-33816 sigma-share exponent. Plotted
        log-log against log T0, the measured curve (cyan) tracks the closed-form
        law (yellow dashed) ever more closely, falling to {lastRung.residToHalf.toExponential(3)}{' '}
        by log10(N)={lastRung.log10N} with log T0 * resid = {lastRung.logT0TimesResid.toFixed(5)}.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        resid(N) vs log T0, with the 1e-2..1e-5 crossing thresholds marked
      </p>
      <ResidualVsLogT0Chart />

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
        <strong style={{ color: '#94a3b8' }}>Milestone crossings:</strong> the residual
        first falls below 1e-2 at log10(N)~
        {IMP34198_MILESTONE_CROSSINGS[0].log10N}, below 1e-3 at log10(N)~
        {IMP34198_MILESTONE_CROSSINGS[1].log10N}, below 1e-4 at log10(N)~
        {IMP34198_MILESTONE_CROSSINGS[2].log10N}, and below 1e-5 only at
        log10(N)~{IMP34198_MILESTONE_CROSSINGS[3].log10N} -- glacially, but every
        crossing arrives strictly further out than the last, with no plateau in
        between.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation
        of the already-established imp-34130 measurement (log-space direct path,
        imp-33859), no new computation on the underlying component model. The
        inherited imp-3220/imp-3406 extrapolation is NOT a rigorous asymptotic;
        changes no bound; establishes no operator positivity; imp-3066
        K_a&gt;=0 untouched; C_mb GUE-conditional per imp-486 untouched; NO
        QED; Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
