import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97587_OSCILLATION_SAMPLES,
  IMP97587_LOGLOG_SAMPLES,
  IMP97587_PEAK_VALIDATION,
  IMP97587_BIAS,
} from '../data/imp-97587-krein-farprofile-envelope-viz-data.js';

// imp-97587: charts the imp-97518 closed-form confinement far profile
// psi_R(t) ~ -(1/pi) g''(a) sin(a t)/t^3 oscillating inside its +-1/t^3
// envelope, |psi_R(t)|^2 inside the 1/t^6 envelope on a log-log panel, and
// the imp-97497 sin^2-peak validation ratios climbing toward 1.

const COLOR_CURVE = '#38bdf8';
const COLOR_ENVELOPE = '#f97316';
const COLOR_PEAK = '#4ade80';

function OscillationPanel() {
  const svgW = 680;
  const svgH = 240;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const samples = IMP97587_OSCILLATION_SAMPLES;
  const tMin = samples[0].t;
  const tMax = samples[samples.length - 1].t;
  const vMax = Math.max(...samples.map((p) => p.envelope)) * 1.1;

  const xOf = (t) => padL + ((t - tMin) / (tMax - tMin)) * plotW;
  const yOf = (v) => padT + plotH / 2 - (v / vMax) * (plotH / 2);

  const curvePoints = samples.map((p) => `${xOf(p.t)},${yOf(p.psiLead)}`).join(' ');
  const envUpper = samples.map((p) => `${xOf(p.t)},${yOf(p.envelope)}`).join(' ');
  const envLower = samples.map((p) => `${xOf(p.t)},${yOf(-p.envelope)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={envUpper} fill="none" stroke={COLOR_ENVELOPE} strokeWidth={1.25} strokeDasharray="4 3" />
      <polyline points={envLower} fill="none" stroke={COLOR_ENVELOPE} strokeWidth={1.25} strokeDasharray="4 3" />
      <polyline points={curvePoints} fill="none" stroke={COLOR_CURVE} strokeWidth={1.75} />

      <line x1={padL} y1={padT + plotH / 2} x2={padL + plotW} y2={padT + plotH / 2} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {[15, 40, 65, 90, 100].map((t) => (
        <text key={`xt${t}`} x={xOf(t)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
          {t}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill="#64748b" fontSize={9}>
        t &mdash; <tspan fill={COLOR_CURVE}>psi_R(t)</tspan> oscillating inside its{' '}
        <tspan fill={COLOR_ENVELOPE}>&plusmn;1/t^3 envelope</tspan>
      </text>
    </svg>
  );
}

function LogLogPanel() {
  const svgW = 680;
  const svgH = 240;
  const padL = 64;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const samples = IMP97587_LOGLOG_SAMPLES;
  const logTMin = Math.log10(samples[0].t);
  const logTMax = Math.log10(samples[samples.length - 1].t);
  const allSq = samples.flatMap((p) => [p.psiSqLead, p.envelopeSq]).filter((v) => v > 0);
  const logVMin = Math.min(...allSq.map((v) => Math.log10(v)));
  const logVMax = Math.max(...allSq.map((v) => Math.log10(v)));

  const xOf = (t) => padL + ((Math.log10(t) - logTMin) / (logTMax - logTMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - logVMin) / (logVMax - logVMin)) * plotH;

  const envPoints = samples.map((p) => `${xOf(p.t)},${yOf(p.envelopeSq)}`).join(' ');
  const curvePoints = samples
    .filter((p) => p.psiSqLead > 0)
    .map((p) => `${xOf(p.t)},${yOf(p.psiSqLead)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={envPoints} fill="none" stroke={COLOR_ENVELOPE} strokeWidth={1.5} strokeDasharray="4 3" />
      <polyline points={curvePoints} fill="none" stroke={COLOR_CURVE} strokeWidth={1.25} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {[15, 50, 200, 400, 1000, 1200].map((t) => (
        <text key={`xt${t}`} x={xOf(t)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
          {t}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill="#64748b" fontSize={9}>
        t (log) &mdash; <tspan fill={COLOR_CURVE}>|psi_R(t)|^2</tspan> touching the{' '}
        <tspan fill={COLOR_ENVELOPE}>1/t^6 envelope</tspan> at sin^2 peaks
      </text>
    </svg>
  );
}

function PeakValidationTable() {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem', marginBottom: '1rem' }}>
      <thead>
        <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '4px 8px' }}>t (sin^2 peak)</th>
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>asymptotic / exact ratio</th>
        </tr>
      </thead>
      <tbody>
        {IMP97587_PEAK_VALIDATION.map((p) => (
          <tr key={p.t} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ textAlign: 'left', padding: '4px 8px' }}>{p.t}</td>
            <td style={{ textAlign: 'right', padding: '4px 8px', color: COLOR_PEAK }}>{p.ratio}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp97587KreinFarprofileEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97518: The Confinement Far-Profile 1/t^3 Envelope" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(56,189,248,0.06)',
          borderLeft: '3px solid #38bdf8',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#38bdf8' }}>Honest status:</strong> presentation only,
        charting the already-proved imp-97518 closed form and the imp-97497
        peak-validation ratios verbatim. No operator positivity; no bound
        moves; interval-rigorous certified reach stays 2a&le;0.96;
        Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97518 proved (three integrations by parts of the finite cosine
        transform) that the band-limited confinement family's far profile is
        psi_R(t) ~ -(1/pi) g&Prime;(a) sin(a t)/t^3, with g&Prime;(a) =
        (8/a^2) exp(-(R a)^2/2) = {IMP97587_BIAS.gppEdge.toFixed(6)} at the
        imp-97497 tail-converged optimum R* = {IMP97587_BIAS.R}. The panel
        below shows psi_R(t) oscillating inside its exact &plusmn;1/t^3
        envelope; the second panel shows |psi_R(t)|^2 tracing the 1/t^6 power
        law on a log-log axis, touching the envelope at the sin^2 peaks.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        psi_R(t) vs its 1/t^3 envelope
      </h3>
      <OscillationPanel />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        |psi_R(t)|^2 vs the 1/t^6 envelope (log-log)
      </h3>
      <LogLogPanel />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        imp-97497 sin^2-peak validation (asymptotic vs exact cosine sum)
      </h3>
      <PeakValidationTable />

      <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        The next-order 1/t^4 bias term -(1/pi) g'''(a) cos(a t)/t^4 has g'''(a)
        = {IMP97587_BIAS.gpppEdge.toFixed(6)} and relative coefficient
        g'''(a)/g''(a) = {IMP97587_BIAS.biasRelCoeff.toFixed(6)} at R* =
        {' '}{IMP97587_BIAS.R}; it is smallest exactly at the sin^2 peaks
        (cos &rarr; 0), which is why the peak-validation ratio climbs so
        tightly toward 1 as t grows from 203 to 1004.
      </p>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page
        consuming the imp-97518 closed-form functions and the imp-97497
        peak-validation ratios verbatim; no re-solve. Establishes no operator
        positivity; changes no bound; PT Lambda&le;0.2 remains SOTA; RH open;
        NO QED.
      </div>
    </div>
  );
}
