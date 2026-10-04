import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35404_LADDER } from '../data/imp-35404-krawczyk-headroom-cancellation-viz-data.js';
import { ED } from '../styles/tokens.js';

// Diverging bar chart: dFP (positive, FP_LO finite-N push) above the zero line, dG (negative,
// asymptotic-floor G-factor pull) below it, at each of the three imp-34693 band landmarks --
// the imp-35266 near-exact 2:1 cancellation whose net residue is the reported surplus.
function DivergingCancellationChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 30;
  const padB = 54;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const yMax = 130;
  const zeroY = padT + plotH * (yMax / (yMax + yMax));
  const yOf = (v) => padT + plotH / 2 - (v / yMax) * (plotH / 2);

  const n = IMP35404_LADDER.length;
  const slot = plotW / n;
  const barW = slot * 0.4;

  const yTicks = [-100, -50, 0, 50, 100];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        dFP (FP_LO push, +) vs dG (G-factor pull, -) at each band landmark
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {IMP35404_LADDER.map((row, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        return (
          <g key={row.label}>
            <rect
              x={x}
              y={yOf(row.dFP)}
              width={barW}
              height={zeroY - yOf(row.dFP)}
              fill={ED.series7}
              stroke={ED.paper}
              strokeWidth={0.75}
            />
            <rect
              x={x}
              y={zeroY}
              width={barW}
              height={yOf(row.dG) - zeroY}
              fill={ED.series1}
              stroke={ED.paper}
              strokeWidth={0.75}
            />
            <text x={xCenter} y={yOf(row.dFP) - 6} textAnchor="middle" fill={ED.series7} fontSize={9} fontFamily="monospace">
              +{row.dFP.toFixed(2)}
            </text>
            <text x={xCenter} y={yOf(row.dG) + 12} textAnchor="middle" fill={ED.series1} fontSize={9} fontFamily="monospace">
              {row.dG.toFixed(2)}
            </text>
            <text x={xCenter} y={padT + plotH + 18} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
              {row.label}
            </text>
            <text x={xCenter} y={padT + plotH + 32} textAnchor="middle" fill={ED.brass} fontSize={9} fontFamily="monospace">
              net +{row.surplus.toFixed(2)}
            </text>
          </g>
        );
      })}

      <g>
        <rect x={padL + plotW - 210} y={padT} width={10} height={10} fill={ED.series7} />
        <text x={padL + plotW - 196} y={padT + 9} fill={ED.inkSoft} fontSize={9.5}>
          dFP (FP_LO finite-N push)
        </text>
        <rect x={padL + plotW - 210} y={padT + 16} width={10} height={10} fill={ED.series1} />
        <text x={padL + plotW - 196} y={padT + 25} fill={ED.inkSoft} fontSize={9.5}>
          dG (G-factor pull)
        </text>
      </g>
    </svg>
  );
}

export default function Imp35404KrawczykHeadroomCancellationViz() {
  const top = IMP35404_LADDER[IMP35404_LADDER.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Headroom 2:1 Cancellation: FP_LO Push vs G-Factor Pull (imp-35404 / imp-35266)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35241 located the Krawczyk contraction-validity headroom worst case at the band-top
        (S&nbsp;~&nbsp;2555.18, a residual&nbsp;~55.18 above the closed-form floor
        S_inf&nbsp;=&nbsp;1/(2&nbsp;&delta;)&nbsp;=&nbsp;2500) but reported that surplus as a single
        lumped number. imp-35266 decomposed it: the surplus is the residue of a near-exact 2:1
        cancellation between a positive FP_LO finite-N push (dFP) and a negative asymptotic-floor
        G-factor pull (dG), with -dFP/dG&nbsp;~&nbsp;2.00042 essentially N-flat across the whole
        imp-34693 admissible band. This page visualizes that cancellation at all three band
        landmarks.
      </p>

      <DivergingCancellationChart />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dFP (push)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dG (pull)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>net surplus</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>-dFP/dG ratio</th>
          </tr>
        </thead>
        <tbody>
          {IMP35404_LADDER.map((row) => (
            <tr key={row.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>+{row.dFP.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.dG.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>+{row.surplus.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.ratio.toFixed(5)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        At the band-top the FP_LO piece (+{top.dFP.toFixed(2)}) is ~2.0004x the magnitude of the
        G-factor piece ({top.dG.toFixed(2)}), and that ratio is essentially unchanged at N_cross and
        band-bottom -- the FP_LO finite-N correction is the dominant single driver of the surplus,
        almost exactly halved by the asymptotic-floor G-factor deficit at every landmark.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-35266 measurement verbatim; no new derivation, no bound changed.
        Measurement only on the inherited imp-3220/imp-3406 surrogate, reproducing the
        imp-35241/imp-35176/imp-34996 machinery; the imp-34714a machine certificate REMAINS OPEN and
        F(m)&nbsp;=&nbsp;0 stays a double-precision artifact; C_C&nbsp;1/8 ansatz (imp-2642/2643) and
        C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
