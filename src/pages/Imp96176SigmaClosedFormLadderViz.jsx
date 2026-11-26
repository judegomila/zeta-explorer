import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP96176_SIGMA_CLOSED_FORM_LADDER_VIZ as V } from '../data/imp-96176-sigma-closed-form-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

function RampTable() {
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr>
          {['decade', 'p_full', 'p_closed_form'].map((h) => (
            <th
              key={h}
              style={{
                textAlign: 'right',
                padding: '4px 12px',
                borderBottom: '1px solid var(--rule)',
                color: 'var(--ink-faint)',
                fontWeight: 600,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {V.rampPast1e12.map((r) => (
          <tr key={r.decade}>
            <td style={{ padding: '4px 12px', textAlign: 'right' }}>{r.decade}</td>
            <td style={{ padding: '4px 12px', textAlign: 'right' }}>{r.p_full.toFixed(4)}</td>
            <td style={{ padding: '4px 12px', textAlign: 'right' }}>{r.p_closed_form.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UShapeChart() {
  const svgW = 640;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const loK = 2;
  const hiK = 12;
  const xS = (k) => padL + cW * ((k - loK) / (hiK - loK));

  // Illustrative shape (not a re-derivation): full share rises then falls (U-shape),
  // closed form decreases monotonically -- matches the imp-96151 sign findings only.
  const fullPts = [];
  const cfPts = [];
  const peakK = Math.log10(9.22e5);
  for (let k = loK; k <= hiK; k += 0.25) {
    const x = xS(k);
    const cfY = padT + cH * (0.15 + 0.75 * ((k - loK) / (hiK - loK)) ** 0.6);
    cfPts.push(`${x},${cfY}`);
    const bump = Math.exp(-((k - peakK) ** 2) / 3);
    const fullY = padT + cH * (0.3 - 0.22 * bump + 0.6 * ((k - loK) / (hiK - loK)) ** 0.6);
    fullPts.push(`${x},${fullY}`);
  }

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      <polyline points={fullPts.join(' ')} fill="none" stroke={ED.series1} strokeWidth={2} />
      <polyline points={cfPts.join(' ')} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="4,2" />
      <line
        x1={xS(peakK)}
        y1={padT}
        x2={xS(peakK)}
        y2={padT + cH}
        stroke={ED.series3}
        strokeWidth={1}
        strokeDasharray="2,2"
        opacity={0.6}
      />
      <text x={xS(peakK)} y={padT + cH + 14} textAnchor="middle" fill={ED.series3} fontSize={9}>
        imp-3220 peak (N&asymp;9.22e5)
      </text>
      {[2, 4, 6, 8, 10, 12].map((k) => (
        <text key={k} x={xS(k)} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{k}
        </text>
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={svgW - padR - 4} y={padT + 12} textAnchor="end" fill={ED.series1} fontSize={9}>
        sigma_full (U-shape)
      </text>
      <text x={svgW - padR - 4} y={padT + 24} textAnchor="end" fill={ED.series2} fontSize={9}>
        sigma_CF (monotone)
      </text>
      <text x={padL + cW / 2} y={svgH - padB + 24} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        {V.axisLabel}
      </text>
    </svg>
  );
}

export default function Imp96176SigmaClosedFormLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Closed-Form Conditional-Share Ladder (imp-96151 / imp-96176)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96151 promoted the imp-33723 closed-form crossover N_cross &asymp;{' '}
        {V.N_cross.toExponential(3)} to a two-term analytic share model sigma_CF(N) and tested
        it against the full three-term conditional share sigma_full(N) over the imp-3220
        U-shape peak and the imp-33582 post-peak decay ramp, extended past its original 1e12
        endpoint. The closed form is exactly 1/2 at N_cross (sigma_CF = {V.sigmaCFAtNCross.toFixed(6)})
        by construction.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Schematic: full share (U-shape) vs. closed-form share (monotone right-arm only)
      </p>
      <UShapeChart />

      <p
        style={{
          color: 'var(--ink-faint)',
          fontWeight: 700,
          fontSize: '0.82rem',
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
        }}
      >
        Per-decade decay exponent past the imp-33582 1e12 endpoint
      </p>
      <RampTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue curve
        (sigma_full) rises then falls, carrying the imp-3220 interior peak; the red dashed curve
        (sigma_CF) is strictly monotone decreasing across the whole range and reproduces only
        the post-peak right arm. Past 1e12 the table shows the two per-decade exponents match to
        4 decimals (max relative full-vs-CF share gap {V.maxRelGap.toExponential(2)} over
        [1e10,1e100]), climbing toward the far-tail asymptote 1/{Math.round(1 / V.farTailExponent)}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation/measurement only —
        renders the frozen imp-96151 closed-form-vs-full share comparison verbatim (no
        re-derivation, no fresh term). The component model is the inherited
        imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic; the C_mb
        GUE-conditional per imp-486 is untouched; changes no bound, establishes no operator
        positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
