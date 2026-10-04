import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96422_FRAC_LADDER_SERIES,
  IMP96422_PEAK_COMPARISON,
  IMP96422_HONEST_BANNER,
} from '../data/imp-96422-eflow-frac-ladder-peak-recovery-viz-data.js';
import { ED } from '../styles/tokens.js';

function FracLadderChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 3;
  const xMax = 12;
  // log-scale y axis over the observed range [1.22e-5, 1.38e-1].
  const yMinLog = Math.log10(1e-5);
  const yMaxLog = Math.log10(2e-1);

  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMinLog) / (yMaxLog - yMinLog)) * plotH;

  const pathD = IMP96422_FRAC_LADDER_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.eFlowOverEN).toFixed(4)}`)
    .join(' ');

  const xTicks = [3, 4, 5, 6, 7, 9, 12];
  const yTicks = [1e-5, 1e-4, 1e-3, 1e-2, 1e-1];
  const peakX = xOf(IMP96422_PEAK_COMPARISON.full.log10N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}

      {/* peak-manufacturing region marker (N ~ 9.22e5) */}
      <line x1={peakX} y1={padT} x2={peakX} y2={padT + plotH} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <text x={peakX + 4} y={padT + 12} fill={ED.series2} fontSize={8}>
        peak N&asymp;{IMP96422_PEAK_COMPARISON.full.N.toExponential(2)}
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={pathD} fill="none" stroke={ED.series5} strokeWidth={2} opacity={0.95} />
      {IMP96422_FRAC_LADDER_SERIES.map((p) => (
        <circle key={`f-${p.log10N}`} cx={xOf(p.log10N)} cy={yOf(p.eFlowOverEN)} r={2.6} fill={ED.series5} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N (ladder from 1e3 to 1e12; axis compressed past 9)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series5} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>E_flow / E_N (log scale)</text>
      </g>
    </svg>
  );
}

function PeakComparisonChart() {
  const svgW = 420;
  const svgH = 220;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const { full, recon } = IMP96422_PEAK_COMPARISON;
  const yMin = 0.945;
  const yMax = 0.951;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const fullX = padL + plotW * 0.32;
  const reconX = padL + plotW * 0.68;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[0.945, 0.947, 0.949, 0.951].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(3)}</text>
        </g>
      ))}

      <line x1={fullX} y1={yOf(full.sigma)} x2={reconX} y2={yOf(recon.sigma)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />

      <circle cx={fullX} cy={yOf(full.sigma)} r={5} fill={ED.series1} />
      <text x={fullX} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>full</text>
      <text x={fullX} y={yOf(full.sigma) - 10} textAnchor="middle" fill={ED.series1} fontSize={9}>
        {full.sigma.toFixed(4)}
      </text>

      <circle cx={reconX} cy={yOf(recon.sigma)} r={5} fill={ED.brassDeco} />
      <text x={reconX} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>recon</text>
      <text x={reconX} y={yOf(recon.sigma) - 10} textAnchor="middle" fill={ED.brass} fontSize={9}>
        {recon.sigma.toFixed(4)}
      </text>

      <text x={padL + plotW / 2} y={16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        sigma_max at the peak
      </text>
    </svg>
  );
}

export default function Imp96422EflowFracLadderPeakRecoveryViz() {
  const { full, recon, peakLocationRelErr, peakHeightAbsErr } = IMP96422_PEAK_COMPARISON;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96266: E_flow Fractional-Suppression Ladder and the Recon-vs-Full Sigma Peak" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96422_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96266 measured that the E_flow fraction E_flow/E_N falls steeply across the imp-3220
        U-shape region, from 1.38e-1 at N=1e3 down to 1.22e-5 at N=1e12. Re-applying that
        differential suppression to the peakless closed-form baseline (sigma_recon) recovers the
        full three-term share&apos;s interior maximum to within {peakHeightAbsErr.toExponential(2)}{' '}
        in height and {peakLocationRelErr.toExponential(2)} in location.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        E_flow / E_N vs log10 N (log scale, monotone decreasing)
      </h3>
      <FracLadderChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Reconstructed vs full sigma peak
      </h3>
      <PeakComparisonChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the fractional ladder
        shows why the imp-3220 peak is a Gronwall-flow feature -- E_flow dominates the left arm
        (13.8% of E_N at N=1e3) but becomes negligible past the crossover (0.0012% at N=1e12).
        The peak comparison shows the full share peaking at N&asymp;{full.N.toExponential(3)},
        sigma_max&asymp;{full.sigma.toFixed(4)}, against the reconstruction&apos;s
        N&asymp;{recon.N.toExponential(3)}, sigma&asymp;{recon.sigma.toFixed(4)} -- close enough
        in height to confirm the E_flow correction is the whole story, with the residual location
        gap attributable to first-order truncation of the reconstruction.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96266
        baked fractional-suppression ladder and peak/peak-recovery landmarks verbatim (only the
        chart-axis reshaping is computed here). The component model is the inherited
        imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb
        GUE-conditional per imp-486 stays untouched. Changes no bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
