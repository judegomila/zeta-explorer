import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97486_SIGMA2_PROFILE,
  IMP97486_REGION_BOUNDARIES,
  IMP97486_FAR_TAIL_LADDER,
} from '../data/imp-97486-sigma2-second-moment-profile-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// imp-97486: visualizes the imp-97458 sigma_2(t) second-moment profile at
// 2a=ln3 -- two negative wells straddling a finite positive island, then an
// unbounded t^4 ln t far tail -- charted from the exact profile samples and
// the imp-97458 measured region boundaries / far-tail table.

function ProfilePanel() {
  const svgW = 720;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minT = -12;
  const maxT = 12;
  const values = IMP97486_SIGMA2_PROFILE.map((p) => p.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const pad = (maxV - minV) * 0.08;
  const yMin = minV - pad;
  const yMax = maxV + pad;

  const xOf = (t) => padL + ((t - minT) / (maxT - minT)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const y0 = yOf(0);

  const { innerWell, innerIslandPositive, outerWell, farTailOnset } = IMP97486_REGION_BOUNDARIES;

  const band = (t0, t1, fill) => (
    <rect x={xOf(t0)} y={padT} width={Math.max(0, xOf(t1) - xOf(t0))} height={plotH} fill={fill} />
  );

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* region shading, mirrored about t=0 */}
      {band(innerWell[0], innerWell[1], alpha(ED.series2, 0.14))}
      {band(innerIslandPositive[0], innerIslandPositive[1], alpha(ED.series3, 0.16))}
      {band(-innerIslandPositive[1], -innerIslandPositive[0], alpha(ED.series3, 0.16))}
      {band(outerWell[0], outerWell[1], alpha(ED.series2, 0.14))}
      {band(-outerWell[1], -outerWell[0], alpha(ED.series2, 0.14))}
      {band(farTailOnset, maxT, alpha(ED.series4, 0.14))}
      {band(minT, -farTailOnset, alpha(ED.series4, 0.14))}

      {/* zero line */}
      <line x1={padL} y1={y0} x2={padL + plotW} y2={y0} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />

      {/* sigma_2(t) curve */}
      <polyline
        points={IMP97486_SIGMA2_PROFILE.map((p) => `${xOf(p.t)},${yOf(p.value)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.6}
      />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[minT, -farTailOnset, 0, farTailOnset, maxT].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {v}
        </text>
      ))}
      {[yMax, 0, yMin].map((v, i) => (
        <text key={`y${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {Math.round(v)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        t &mdash; red: negative wells; green: inner positive island; yellow: unbounded far-tail onset (|t|&gt;{farTailOnset})
      </text>
    </svg>
  );
}

function FarTailPanel() {
  const svgW = 720;
  const svgH = 220;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const L = IMP97486_FAR_TAIL_LADDER;
  const logT = L.map((p) => Math.log10(p.T));
  const logA = L.map((p) => Math.log10(p.area));
  const minLogT = Math.min(...logT);
  const maxLogT = Math.max(...logT);
  const minLogA = Math.min(...logA);
  const maxLogA = Math.max(...logA);

  const xOf = (lt) => padL + ((lt - minLogT) / (maxLogT - minLogT)) * plotW;
  const yOf = (la) => padT + plotH - ((la - minLogA) / (maxLogA - minLogA)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline
        points={L.map((p) => `${xOf(Math.log10(p.T))},${yOf(Math.log10(p.area))}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={2}
      />
      {L.map((p, i) => (
        <circle key={i} cx={xOf(Math.log10(p.T))} cy={yOf(Math.log10(p.area))} r={3} fill={ED.brassDeco} />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {L.map((p, i) => (
        <text key={`xt${i}`} x={xOf(Math.log10(p.T))} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {p.T}
        </text>
      ))}
      {[minLogA, (minLogA + maxLogA) / 2, maxLogA].map((v, i) => (
        <text key={`ya${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          1e{v.toFixed(0)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        T (log scale) vs cumulative one-sided far-tail area int_{'{10.532}'}^T sigma_2 dt (log scale) &mdash; unbounded, exponent &rarr; 5
      </text>
    </svg>
  );
}

export default function Imp97486Sigma2SecondMomentProfileViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97458: The sigma_2(t) Second-Moment Profile" />

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
        panel is an exact recomputation of sigma_2(t) = (t^2+1/4)^2 w_1(t) on a
        dense grid (h=0.03); the region boundaries (gap [3.306,6.945],
        far-tail onset 10.532) and the bottom panel&apos;s far-tail area table
        are reused verbatim from imp-97458. Establishes no operator
        positivity; changes no bound; interval-rigorous certificate reach
        stays 2a&le;0.96; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open;
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        At the binding half-width 2a=ln3, imp-97458 quantified the discarded
        positive far field named by imp-97416: sigma_2(t) alternates sign
        across two negative wells straddling a finite positive island, then
        turns positive for good beyond |t|=10.532 and grows without bound.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        sigma_2(t): two wells, one island, an unbounded tail
      </h3>
      <ProfilePanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Far-tail cumulative positive area (log-log, unbounded growth)
      </h3>
      <FarTailPanel />

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
        only, consuming the imp-97458 measured region boundaries and far-tail
        table verbatim; the sigma_2(t) samples are an exact recompute, not new
        data. Establishes no operator positivity; changes no bound;
        interval-rigorous certificate reach stays 2a&le;0.96; Platt-Trudgian
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
