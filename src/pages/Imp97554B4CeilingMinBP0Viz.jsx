import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP97554_POINTS, IMP97554_MIN_WITNESS } from '../data/imp-97554-b4-ceiling-minb-p0-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97554: visualizes the imp-97500 RESULT 3 counterexample-size curve
// log10(b) = Prod_{P0<=p<=Ycross} p vs the window floor P0, showing the
// INTERIOR minimum at P0=1409 (~17.82M digits) -- ~44% fewer digits than the
// imp-97496 boundary witness at P0=379 (~31.97M digits).

function MinBPanel() {
  const svgW = 720;
  const svgH = 340;
  const padL = 70;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const sorted = [...IMP97554_POINTS].sort((a, b) => a.P0 - b.P0);
  const xs = sorted.map((p) => Math.log10(p.P0));
  const ys = sorted.map((p) => p.log10b);

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const yPad = (yMax - yMin) * 0.1;

  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - (yMin - yPad)) / (yMax + yPad - (yMin - yPad))) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline
        points={sorted.map((p) => `${xOf(Math.log10(p.P0))},${yOf(p.log10b)}`).join(' ')}
        fill="none"
        stroke={ED.series3}
        strokeWidth={1.6}
      />

      {sorted.map((p) => (
        <circle
          key={`pt-${p.P0}`}
          cx={xOf(Math.log10(p.P0))}
          cy={yOf(p.log10b)}
          r={p.P0 === IMP97554_MIN_WITNESS.P0 ? 5.5 : 3.4}
          fill={p.P0 === IMP97554_MIN_WITNESS.P0 ? ED.brassDeco : ED.series1}
        />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {sorted.map((p) => (
        <text key={`x${p.P0}`} x={xOf(Math.log10(p.P0))} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {p.P0}
        </text>
      ))}
      {[yMax, (yMax + yMin) / 2, yMin].map((v, i) => (
        <text key={`y${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {(v / 1e6).toFixed(1)}M
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        P0 (window floor prime, log scale) &mdash; green: log10(b) counterexample-size digits; yellow dot: interior minimum at P0=1409
      </text>
    </svg>
  );
}

export default function Imp97554B4CeilingMinBP0Viz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97500: b/4-Ceiling Counterexample Size vs Window Floor P0" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-3) 6%, transparent)',
          borderLeft: '3px solid var(--series-3)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-3)' }}>Honest status:</strong> this
        chart reuses the imp-97500 CROSSINGS table verbatim (no new
        measurement). The b/4-ceiling lower edge was already REFUTED
        (imp-97481) and is a dead route; this only visualizes the
        already-measured smallest-witness curve. Presentation only;
        establishes no operator positivity; changes no bound; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        For each window floor P0, b = Prod_{'{P0<=p<=Ycross}'} p is the
        smallest counterexample crossing the (already-refuted) b/4-ceiling
        surrogate threshold. Raising P0 deepens the exact limit L(P0) so
        Ycross falls, but also raises the window floor theta(&lt;P0) &mdash;
        the two effects trade off, producing an interior minimum at{' '}
        P0={IMP97554_MIN_WITNESS.P0}: log10(b_min) ={' '}
        {IMP97554_MIN_WITNESS.log10b.toLocaleString()} (~
        {(IMP97554_MIN_WITNESS.log10b / 1e6).toFixed(2)}M digits), ~
        {(100 * (1 - IMP97554_MIN_WITNESS.log10b / IMP97554_MIN_WITNESS.vsImp97496P0379Log10b)).toFixed(0)}%
        fewer digits than the imp-97496 boundary witness at P0=379 (
        {IMP97554_MIN_WITNESS.vsImp97496P0379Log10b.toLocaleString()} digits).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        log10(b) vs P0 (log scale)
      </h3>
      <MinBPanel />

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
        only, consuming the imp-97500 CROSSINGS table verbatim. A finer prime
        sweep (imp-97540) later pinned the true optimum at P0=1429, only
        ~0.004% smaller than this P0=1409 estimate &mdash; the coarse grid
        charted here was already essentially on the optimum. Establishes no
        operator positivity; changes no bound;
        RH open; NO QED.
      </div>
    </div>
  );
}
