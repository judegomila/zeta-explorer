import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33865_EXPONENT_CURVE,
  IMP33865_WITHIN_1PCT_CROSSING,
} from '../data/imp-33865-sigma-exponent-asymptote-approach-rate-viz-data.js';

// log T0 from log10(N) via the Riemann-von Mangoldt inverse N = (T0/2pi)(log(T0/2pi) - 1),
// i.e. ln N = u + log(u-1) with u = log(T0/2pi), solved by Newton (mirrors the
// imp-33816 logT0FromLnN helper); this is a closed-form asymptotic map, not a
// zeros-table lookup, so it costs nothing to reproduce locally in a page.
function logT0FromLog10N(log10N) {
  const lnN = log10N * Math.LN10;
  let u = lnN;
  for (let i = 0; i < 60; i += 1) {
    const f = u + Math.log(u - 1) - lnN;
    const fPrime = 1 + 1 / (u - 1);
    u -= f / fPrime;
  }
  return u + Math.log(2 * Math.PI);
}

const CURVE_WITH_LOGT0 = IMP33865_EXPONENT_CURVE.map((pt) => ({
  ...pt,
  logT0: logT0FromLog10N(pt.log10N),
}));

const CROSSING_LOGT0 = IMP33865_WITHIN_1PCT_CROSSING.logT0;
const CROSSING_P = IMP33865_WITHIN_1PCT_CROSSING.p_local;

// imp-33816 approach-rate law: gap(N) = 1/2 - p(N) ~ 1/(2 log T0), i.e.
// p_law(logT0) = 1/2 - 1/(2 log T0). Sampled densely over the plotted domain
// so the law curve can be compared directly against the measured points.
function pLawAtLogT0(logT0) {
  return 0.5 - 0.5 / logT0;
}

// The within-0.1% crossing (p >= 0.4995, log T0 ~ 1000, N ~ 1e434) is ~10x past
// the plotted domain -- both N and T0 overflow IEEE-double there, so it is
// reported only from the law, not plotted as a data point.
const WITHIN_0_1PCT_LOGT0_FROM_LAW = 1000;
const WITHIN_0_1PCT_LOG10N_FROM_LAW = 434;

function ExponentVsLogT0Chart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 44;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = CURVE_WITH_LOGT0.map((pt) => pt.logT0);
  const ys = CURVE_WITH_LOGT0.map((pt) => pt.p_local);
  const minX = 0;
  const maxX = Math.max(...xs, CROSSING_LOGT0) * 1.05;
  const minY = 0;
  const maxY = 0.55;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const dataPath = xs.map((x, i) => `${xAt(x)},${yAt(ys[i])}`).join(' ');

  const lawSamples = [];
  const lawSteps = 60;
  for (let i = 0; i <= lawSteps; i += 1) {
    const x = minX + 1 + ((maxX - (minX + 1)) * i) / lawSteps;
    lawSamples.push([x, pLawAtLogT0(x)]);
  }
  const lawPath = lawSamples.map(([x, y]) => `${xAt(x)},${yAt(y)}`).join(' ');

  const halfY = yAt(0.5);
  const crossX = xAt(CROSSING_LOGT0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={halfY} x2={padL + cW} y2={halfY} stroke="#64748b" strokeWidth={1.25} strokeDasharray="5,3" />
      <line x1={crossX} y1={padT} x2={crossX} y2={padT + cH} stroke="#f87171" strokeWidth={1.25} strokeDasharray="3,3" />
      <polyline points={lawPath} fill="none" stroke="#facc15" strokeWidth={1.5} strokeDasharray="4,2" />
      <polyline points={dataPath} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {xs.map((x, i) => (
        <circle key={`pt-${x}`} cx={xAt(x)} cy={yAt(ys[i])} r={3.25} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={0.5} />
      ))}
      <circle cx={crossX} cy={yAt(CROSSING_P)} r={3.75} fill="#f87171" stroke="#0a0f1a" strokeWidth={0.75} />
      {[0, 20, 40, 60, 80, 100].map((t) => (
        <text key={`xt-${t}`} x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {t}
        </text>
      ))}
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((y) => (
        <text key={`yt-${y}`} x={padL - 8} y={yAt(y) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
          {y}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        log T0
      </text>
      <text x={padL + 6} y={padT + 12} fill="#38bdf8" fontSize={9.5}>
        p(N) local exponent (measured)
      </text>
      <text x={padL + 6} y={padT + 24} fill="#facc15" fontSize={9.5}>
        law: 1/2 - 1/(2 log T0)
      </text>
      <text x={padL + 6} y={halfY - 6} fill="#64748b" fontSize={9}>
        imp-3463 far-tail asymptote p -&gt; 1/2
      </text>
      <text x={crossX + 4} y={padT + 40} fill="#f87171" fontSize={9}>
        within 1% at log T0~{CROSSING_LOGT0}
      </text>
    </svg>
  );
}

export default function Imp34016SigmaExponentVsLogT0Viz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma Post-Peak Exponent Ramp vs log T0 (imp-33816)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33816 tracks the local decay exponent p(N) = -d ln sigma / d ln N of the
        Path C error budget's post-peak regime as it climbs toward the imp-3463
        far-tail asymptote p -&gt; 1/2. Re-expressing the same points against log T0
        (via the Riemann-von Mangoldt inverse) instead of log10(N) makes the
        approach-rate law gap(N) = 1/2 - p(N) ~ 1/(2 log T0) directly legible: the
        measured curve (cyan) and the law (yellow dashed) converge as log T0 grows,
        crossing within 1% of 1/2 at log T0~{CROSSING_LOGT0} (N~1e{IMP33865_WITHIN_1PCT_CROSSING.log10N}).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        p(N) vs log T0, with the 1/(2 log T0) approach law overlaid
      </p>
      <ExponentVsLogT0Chart />

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
        <strong style={{ color: '#94a3b8' }}>Beyond the plotted domain:</strong> the
        within-0.1% crossing (p &gt;= 0.4995) needs log T0~{WITHIN_0_1PCT_LOGT0_FROM_LAW}
        {' '}(N~1e{WITHIN_0_1PCT_LOG10N_FROM_LAW}), an order of magnitude past this
        chart's log T0~100 edge -- both N and T0 overflow IEEE-double there, so this
        landmark is reported only from the (F2) law, never evaluated directly.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement /
        re-expression of the imp-33816 curve on a different axis, no proof, no
        fresh derivation. The inherited imp-3220/imp-3406/imp-33582 component
        model is NOT a rigorous asymptotic; changes no bound; imp-3066 K_a&gt;=0
        untouched; C_mb GUE-conditional per imp-486 untouched; NO QED;
        Platt-Trudgian Lambda&lt;=0.2 remains SOTA.
      </div>
    </div>
  );
}
