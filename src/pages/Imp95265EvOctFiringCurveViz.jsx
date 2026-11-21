import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95265_EVOCT_FIRING_CURVE,
  IMP95265_XSTAR_EVOCT,
} from '../data/imp-95265-evoct-firing-curve-viz-data.js';
import { ED } from '../styles/tokens.js';

// log10(certCoalM(6, x)) vs depth x on the m=6 coalescent dyadic skeleton --
// the certificate spans ~412 down to ~1.7e-4 over x in [8, 16], so a log
// y-axis is used; the firing threshold (cert = 1, log10 = 0) crosses at
// xStarEvOct = 11.31664319 (imp-95250 COROLLARY EV-OCT).
function FiringCurve() {
  const points = IMP95265_EVOCT_FIRING_CURVE;
  const svgW = 640;
  const padL = 52;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 340;
  const padT = 24;
  const padB = 56;
  const plotH = svgH - padT - padB;

  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.log10Cert));
  const maxY = Math.max(...points.map((p) => p.log10Cert));
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const xTicks = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  const yTicks = [-4, -3, -2, -1, 0, 1, 2, 3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}

      {/* firing threshold: cert = 1, log10Cert = 0 */}
      <line
        x1={padL}
        y1={yOf(0)}
        x2={padL + plotW}
        y2={yOf(0)}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="5 4"
      />
      <text x={padL + plotW - 4} y={yOf(0) - 6} textAnchor="end" fill={ED.brass} fontSize={8.5}>
        cert = 1 (fires below)
      </text>

      {/* onset marker */}
      <line
        x1={xOf(IMP95265_XSTAR_EVOCT)}
        y1={padT}
        x2={xOf(IMP95265_XSTAR_EVOCT)}
        y2={padT + plotH}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text x={xOf(IMP95265_XSTAR_EVOCT)} y={padT + 10} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
        xStarEvOct = {IMP95265_XSTAR_EVOCT}
      </text>

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        depth x
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        log10( certCoalM(6, x) )
      </text>

      <polyline
        points={points.map((p) => `${xOf(p.x)},${yOf(p.log10Cert)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2.25}
        opacity={0.9}
      />

      {points.map((p) => (
        <circle
          key={p.x}
          cx={xOf(p.x)}
          cy={yOf(p.log10Cert)}
          r={p.x === IMP95265_XSTAR_EVOCT ? 5 : 3.5}
          fill={p.x === IMP95265_XSTAR_EVOCT ? ED.series2 : ED.series1}
          stroke={ED.paper}
          strokeWidth={1.25}
        />
      ))}
    </svg>
  );
}

export default function Imp95265EvOctFiringCurveViz() {
  const points = IMP95265_EVOCT_FIRING_CURVE;
  const at12 = points.find((p) => p.x === 12);
  const at14 = points.find((p) => p.x === 14);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="EV-OCT Certificate Firing Curve, m = 6 Dyadic Skeleton (imp-95250 / imp-95265)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> the certificate is a
        model-family bound, not a paper-transferred one, and sits orders above the exact
        pencil &mdash; &asymp;1.6e4&times; at m = 6, r = 1.05, x = 12 (imp-95250 HONEST LIMITS
        (a)). Its onsets (xStarEvOct = 11.32 coalescent, 27.04 m-and-r-uniform) sit above both
        the single-pair SPLIT-2 onset (7.10) and the twin-free Blaschke&ndash;Lagrange onset
        (4.24). It fences a twin pair in every octave of a dyadic skeleton at unbounded octave
        count; it establishes no operator positivity and changes no Lambda bound. RH does not follow
        from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95250 COROLLARY EV-OCT gives the fully closed-form certificate
        sqrt(Lambda(V, x)) &le; sum_(k=0..5) sqrt(coalLaw(2^k x) / Phi_k(r)) for the twin-block
        skeleton V_k = {'{'}2^k, r&nbsp;2^k{'}'}, k = 0..5, at the coalescent limit r &rarr; 1.
        Squaring gives the certCoalM(6, x) curve below: it decays from &asymp;{points[0].cert}
        {' '}at x = {points[0].x} through the firing threshold (value 1) at xStarEvOct =
        {' '}{IMP95265_XSTAR_EVOCT}, down to &asymp;{at12.cert} at x = 12 and
        &asymp;{at14.cert.toExponential(2)} at x = 14.
      </p>

      <FiringCurve />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the y-axis is
        log10(certCoalM(6, x)) because the certificate spans &asymp;413 down to &asymp;1.7e-4
        over x in [8, 16]. The dashed amber line marks the firing threshold cert = 1
        (log10 = 0); the certificate fires (value below 1) for every x above the dashed red
        onset line at xStarEvOct = {IMP95265_XSTAR_EVOCT}, the coalescent-limit onset for
        every-octave twin pairs on the m = 6 skeleton (imp-95250 COROLLARY EV-OCT).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-95265 baked viz-data (certCoalM(6, x) recomputed independently from the imp-95250
        coalLaw / betaLat closed forms, not re-derived or re-conjectured). Changes no bound,
        establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
