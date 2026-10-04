import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION } from '../data/imp-34819-crossover-gpp-fifth-band-envelope-extension.js';
import { ED } from '../styles/tokens.js';

const D = IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION;

// -- descending five-band bound ladder, log-scale bars. --
function BandLadderPanel({ bands }) {
  const svgW = 660;
  const padL = 80;
  const padR = 30;
  const padT = 20;
  const padB = 60;
  const barGap = 14;
  const barH = 26;
  const plotW = svgW - padL - padR;
  const svgH = padT + bands.length * (barH + barGap) + padB;

  const logs = bands.map((b) => Math.log10(b.left_endpoint_bound_B));
  const maxLog = Math.max(...logs);
  const minLog = Math.min(...logs);
  const xOf = (v) => padL + ((v - minLog) / (maxLog - minLog || 1)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {bands.map((b, i) => {
        const y = padT + i * (barH + barGap);
        const w = xOf(logs[i]) - padL;
        return (
          <g key={b.band.join('-')}>
            <text x={padL - 10} y={y + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11} fontFamily="monospace">
              [{b.band[0].toExponential(0)},{b.band[1].toExponential(0)}]
            </text>
            <rect x={padL} y={y} width={Math.max(w, 2)} height={barH} fill={ED.series1} opacity={0.85} rx={3} />
            <text x={padL + Math.max(w, 2) + 8} y={y + barH / 2 + 4} fill={ED.series1} fontSize={11} fontFamily="monospace">
              B={b.left_endpoint_bound_B.toExponential(3)}
            </text>
          </g>
        );
      })}
      <text x={svgW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        Per-band left-endpoint bound B, bar length proportional to log10 B -- strictly descending ladder across the five bands
      </text>
    </svg>
  );
}

// -- shrink-ratio panel: per-decade ratios rising monotonically toward 100x/decade. --
function ShrinkRatioPanel({ ratios }) {
  const svgW = 660;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 200;
  const svgH = plotH + padT + padB;

  const yLo = Math.min(...ratios) - 0.3;
  const yHi = 100.2;
  const xOf = (i) => padL + (i / (ratios.length - 1 || 1)) * plotW;
  const yOf = (v) => padT + ((yHi - v) / (yHi - yLo)) * plotH;

  const points = ratios.map((r, i) => `${xOf(i)},${yOf(r)}`).join(' ');
  const ceilingY = yOf(100);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={svgW - padR} y1={padT + plotH} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} x2={svgW - padR} y1={ceilingY} y2={ceilingY} stroke={ED.rule} strokeWidth={1.5} strokeDasharray="5,4" />
      <text x={svgW - padR} y={ceilingY - 6} textAnchor="end" fill={ED.inkFaint} fontSize={10} fontFamily="monospace">
        100x/decade ceiling
      </text>
      <polyline points={points} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      {ratios.map((r, i) => (
        <g key={i}>
          <circle cx={xOf(i)} cy={yOf(r)} r={4.5} fill={ED.series5} />
          <text x={xOf(i)} y={yOf(r) - 10} textAnchor="middle" fill={ED.series5} fontSize={10} fontFamily="monospace">
            {r.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        Per-decade shrink ratios B_i/B_(i+1), rising monotonically toward the clean 100x/decade ceiling
      </text>
    </svg>
  );
}

export default function Imp34855FiveBandShrinkRatioLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Five-Band Envelope Shrink-Ratio Ladder (imp-34855 / imp-34819)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34819 appended a 5th far-tail band [1e13,1e14] to the crossover-map second-derivative
        envelope and found the descending ladder B(1e9) &gt; B(1e10) &gt; B(1e11) &gt; B(1e12) &gt; B(1e13)
        survives, with the single leftmost constant B(1e9) still dominating every band
        (B(1e9)/max_union = {D.globalEnvelopeRatio_B_over_unionMax.toFixed(3)}), and the per-decade shrink
        ratios ({D.perDecadeShrinkRatios.join(', ')}) rising monotonically toward the clean 100x/decade
        set by the T^2 factor.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Descending five-band left-endpoint bound ladder
      </p>
      <BandLadderPanel bands={D.bands} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Per-decade shrink ratios rising toward the 100x/decade ceiling
      </p>
      <ShrinkRatioPanel ratios={D.perDecadeShrinkRatios} />

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        The new far-tail decade ratio B(1e12)/B(1e13) = {D.newBandShrinkRatio_B1e12_over_B1e13} exceeds the
        prior [1e11,1e12] ratio {D.prevLastShrinkRatio_B1e11_over_B1e12} and stays below 100, so nearing the
        1/2 density asymptote TIGHTENS rather than loosens the geometric decay of the envelope.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34819
        literals verbatim (no new computation). Measures the curvature envelope of the INHERITED
        imp-3220/imp-3406 surrogate crossover map; changes no bound; the C_mb GUE-conditional per imp-486
        and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; establishes no operator positivity;
        no RH verdict, NO QED.
      </div>
    </div>
  );
}
