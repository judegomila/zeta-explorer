import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97169_SCATTER_ROWS,
  IMP97169_MAGNITUDE_LADDER,
  IMP97169_MAGNITUDE_RATIOS,
  IMP97169_SIGN_LAW_LABELS,
} from '../data/imp-97169-route-m-residual-sign-magnitude-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97212: the imp-97169 viz-data leaf (fixed-omega(b) cohort tables baked from imp-97140) had
// no chart consumer yet. This page renders it as two panels: a signed-log scatter of r(b) vs b
// colored by omega(b) parity (highlighting the three sweep exceptions where the leading-term
// cancellation flips the naive parity prediction), and a log-axis omega -> GM|r(b)| magnitude
// ladder with the non-clean consecutive ratios labelled.

function signedLog10(x) {
  if (x === 0) return 0;
  return Math.sign(x) * Math.log10(Math.abs(x));
}

function ScatterChart({ rows }) {
  const svgW = 680;
  const svgH = 360;
  const padL = 70;
  const padR = 30;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logB = rows.map((r) => Math.log10(r.b));
  const signedR = rows.map((r) => signedLog10(r.r));
  const minLogB = Math.min(...logB);
  const maxLogB = Math.max(...logB);
  const maxAbsSignedR = Math.max(...signedR.map((v) => Math.abs(v)));

  const xAt = (lb) => padL + ((lb - minLogB) / (maxLogB - minLogB)) * cW;
  const yAt = (sr) => padT + cH / 2 - (sr / maxAbsSignedR) * (cH / 2 - 10);

  const colorFor = (row) => {
    if (row.isException) return ED.series4;
    return row.parity === 'odd' ? ED.series3 : ED.series2;
  };

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yAt(0)} x2={svgW - padR} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} />
      <text x={padL - 10} y={yAt(0) + 4} textAnchor="end" fill={ED.inkFaint} fontSize={9.5} fontFamily="monospace">
        r=0
      </text>
      <text x={svgW - padR} y={svgH - padB + 30} textAnchor="end" fill={ED.inkFaint} fontSize={9.5} fontFamily="monospace">
        b (log scale) &rarr;
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        fontFamily="monospace"
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        sign(r)&middot;log10|r|
      </text>
      {rows.map((row) => {
        const cx = xAt(Math.log10(row.b));
        const cy = yAt(signedLog10(row.r));
        return (
          <g key={row.b}>
            <circle
              cx={cx}
              cy={cy}
              r={row.isException ? 6 : 4.5}
              fill={colorFor(row)}
              stroke={row.isException ? ED.paper : 'none'}
              strokeWidth={row.isException ? 1.5 : 0}
              opacity={0.9}
            />
            <text x={cx} y={cy - 9} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5} fontFamily="monospace">
              b={row.b}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MagnitudeLadderChart({ ladder, ratios }) {
  const svgW = 640;
  const rowH = 44;
  const padL = 60;
  const padR = 110;
  const padT = 20;
  const svgH = padT + ladder.length * rowH + 16;
  const cW = svgW - padL - padR;
  const logVals = ladder.map((row) => Math.log10(row.gmAbsR));
  const maxLog = Math.max(...logVals);
  const minLog = Math.min(...logVals);
  const xAt = (v) => ((v - minLog) / (maxLog - minLog)) * cW;
  const ratioKeys = ['1to2', '2to3', '3to4'];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {ladder.map((row, idx) => {
        const y = padT + idx * rowH;
        const w = Math.max(4, xAt(Math.log10(row.gmAbsR)));
        return (
          <g key={row.omega}>
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10.5} fontFamily="monospace">
              &omega;={row.omega}
            </text>
            <rect x={padL} y={y + 8} width={cW} height={rowH - 20} fill={ED.paper3} rx={3} />
            <rect x={padL} y={y + 8} width={w} height={rowH - 20} fill={ED.series1} rx={3} />
            <text x={padL + w + 6} y={y + rowH / 2 + 4} fill={ED.ink} fontSize={9.5} fontFamily="monospace">
              GM|r| &asymp; {row.gmAbsR.toExponential(2)}
            </text>
            {idx > 0 && (
              <text
                x={padL - 8}
                y={y - 10}
                textAnchor="end"
                fill={ED.brass}
                fontSize={9}
                fontFamily="monospace"
              >
                &times;{ratios[ratioKeys[idx - 1]]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97212RouteMResidualSignMagnitudeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Residual Sign / Magnitude Ladder" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 6%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>Honest status:</strong> {IMP97169_SIGN_LAW_LABELS.observed}.
        The imp-97140 exponent string <code>{IMP97169_SIGN_LAW_LABELS.imp97140String}</code> is
        data-inconsistent; the sign matches the imp-97167-corrected{' '}
        <code>{IMP97169_SIGN_LAW_LABELS.imp97167CorrectedString}</code> form. This is a measurement
        display, not a new bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Signed-log scatter of r(b) = F_arith(b)/(&phi;(b) b) &minus; &kappa;_arith against b (log
        axis). Green = &omega;(b) odd (predicted and observed r&gt;0); red = &omega;(b) even
        (predicted and observed r&lt;0); amber = the three sweep exceptions (b=2310, 2730, 30030)
        where a leading-term cancellation flips the naive parity prediction.
      </p>
      <ScatterChart rows={IMP97169_SCATTER_ROWS} />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.25rem 0 0.5rem', maxWidth: 700 }}>
        Magnitude ladder: geometric-mean |r(b)| per fixed &omega;(b), log axis. Consecutive ratios
        ({ratioLabel(IMP97169_MAGNITUDE_RATIOS)}) are not a constant &asymp;2&times; step, so the
        decay is not a clean 2<sup>&minus;&omega;</sup> proxy.
      </p>
      <MagnitudeLadderChart ladder={IMP97169_MAGNITUDE_LADDER} ratios={IMP97169_MAGNITUDE_RATIOS} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-97169 viz-data leaf (every value reused verbatim from imp-97140, no re-derivation).
        Changes no bound, establishes no operator positivity; Platt-Trudgian &Lambda;&le;0.2
        remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}

function ratioLabel(ratios) {
  return `${ratios['1to2']} / ${ratios['2to3']} / ${ratios['3to4']}`;
}
