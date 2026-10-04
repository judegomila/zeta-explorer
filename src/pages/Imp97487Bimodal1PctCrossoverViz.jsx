import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97487_PROFILES,
  IMP97487_CRESTS,
  IMP97487_THRESHOLD_PCT,
  IMP97487_SCALE,
} from '../data/imp-97487-bimodal-1pct-crossover-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97487: visualizes the imp-97459 bimodal 1% crossover -- two adjacent
// signed-deviation crests at x=1/6 and x=1/5 straddling the 1% level, and
// the piecewise-linear A(b)=x*b scale that survives the branch flip.

const CURVE_COLORS = { 1000: ED.series2, 16000: ED.series1 };

function CrestPanel() {
  const svgW = 720;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 0.15;
  const xMax = 0.21;
  const allVals = IMP97487_PROFILES.flatMap((p) => p.points.map((q) => q.deviationPct));
  const yMin = Math.min(0, ...allVals) - 0.15;
  const yMax = Math.max(...allVals) + 0.15;

  const xOf = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const lowerX = IMP97487_CRESTS.lower.x;
  const upperX = IMP97487_CRESTS.upper.x;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* 1% threshold line */}
      <line
        x1={padL}
        y1={yOf(IMP97487_THRESHOLD_PCT)}
        x2={padL + plotW}
        y2={yOf(IMP97487_THRESHOLD_PCT)}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 4} y={yOf(IMP97487_THRESHOLD_PCT) - 4} textAnchor="end" fill={ED.brass} fontSize={9}>
        1% threshold
      </text>

      {/* crest location markers */}
      <line x1={xOf(lowerX)} y1={padT} x2={xOf(lowerX)} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 3" />
      <line x1={xOf(upperX)} y1={padT} x2={xOf(upperX)} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 3" />
      <text x={xOf(lowerX)} y={padT + 10} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        1/6
      </text>
      <text x={xOf(upperX)} y={padT + 10} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        1/5
      </text>

      {/* d(a,b) curves */}
      {IMP97487_PROFILES.map((p) => (
        <polyline
          key={p.b}
          points={p.points.map((q) => `${xOf(q.x)},${yOf(q.deviationPct)}`).join(' ')}
          fill="none"
          stroke={CURVE_COLORS[p.b] || ED.inkSoft}
          strokeWidth={1.6}
        />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[0.15, 1 / 6, 0.2, 0.21].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(3)}
        </text>
      ))}
      {[yMax, IMP97487_THRESHOLD_PCT, 0, yMin].map((v, i) => (
        <text key={`y${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(2)}%
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        x = a/b &mdash; <tspan fill={CURVE_COLORS[1000]}>red: b=1000</tspan> (1/6 tip under 1%), <tspan fill={CURVE_COLORS[16000]}>blue: b=16000</tspan> (1/6 tip over 1%)
      </text>
    </svg>
  );
}

function ScalePanel() {
  const svgW = 720;
  const svgH = 220;
  const padL = 70;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rows = IMP97487_SCALE;
  const maxB = Math.max(...rows.map((r) => r.b));
  const maxA = Math.max(...rows.map((r) => r.Ab));

  const xOf = (b) => padL + (b / maxB) * plotW;
  const yOf = (a) => padT + plotH - (a / maxA) * plotH;

  const upperPts = rows.filter((r) => r.branch === 'upper (1/5)');
  const lowerPts = rows.filter((r) => r.branch === 'lower (1/6)');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {upperPts.length > 1 && (
        <polyline
          points={upperPts.map((r) => `${xOf(r.b)},${yOf(r.Ab)}`).join(' ')}
          fill="none"
          stroke={CURVE_COLORS[1000]}
          strokeWidth={2}
        />
      )}
      {lowerPts.length > 1 && (
        <polyline
          points={lowerPts.map((r) => `${xOf(r.b)},${yOf(r.Ab)}`).join(' ')}
          fill="none"
          stroke={CURVE_COLORS[16000]}
          strokeWidth={2}
        />
      )}
      {rows.map((r) => (
        <circle
          key={r.b}
          cx={xOf(r.b)}
          cy={yOf(r.Ab)}
          r={3.5}
          fill={r.branch === 'upper (1/5)' ? CURVE_COLORS[1000] : CURVE_COLORS[16000]}
        />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {rows.map((r) => (
        <text key={`xb${r.b}`} x={xOf(r.b)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {r.b}
        </text>
      ))}
      {[0, maxA / 2, maxA].map((v, i) => (
        <text key={`ya${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(0)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        b &mdash; A(b)=x*(1%)b: <tspan fill={CURVE_COLORS[1000]}>red ray, slope 0.199</tspan> (upper/1-5 branch), <tspan fill={CURVE_COLORS[16000]}>blue ray, slope 0.1665</tspan> (lower/1-6 branch)
      </text>
    </svg>
  );
}

export default function Imp97487Bimodal1PctCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97459: The Bimodal 1% Crossover" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> the top
        panel is an exact recomputation of the signed deviation d(a,b) = (I -
        I_lin)/I on the integer-a grid; the crest tips, step point, and A(b)
        scale table are reused verbatim from imp-97459. Establishes no
        operator positivity; changes no bound; the rigorous anchor stays the
        trace ceiling T=2.594e7; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH
        open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97441 found the 1%-tolerance crossover fraction x*(1%) STEPS from
        0.199 to 0.1665 as b grows. imp-97459 traced this to two adjacent
        arithmetic crests of d(a,b): a lower crest at x=1/6 whose sampled tip
        climbs toward a fixed 1.113% continuum value, and an upper crest at
        x=1/5 that sits dead-flat at 1.3934% (always above 1%). Which crest
        the integer-a grid first resolves above the 1% line flips the
        reported x*.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        d(a,b) near x=1/6 and 1/5: the grid-resolution flip
      </h3>
      <CrestPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        A(b) = x*(1%) b: piecewise-linear across the branch jump
      </h3>
      <ScalePanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, consuming the imp-97459 measured crest table, step point, and
        A(b) scale table verbatim; the d(a,b) curves are an exact recompute,
        not new data. Establishes no operator positivity; changes no bound;
        Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
