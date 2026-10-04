import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT } from '../data/imp-34328-sigma-vs-product-gap-log2pi-shift.js';
import { ED } from '../styles/tokens.js';

const { gapLadder } = IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT;

// gapSigma*logT0 and gapProduct vs log10(N): the two channels are exact complements summing to 1/2
// at every rung, while gapSigma*u (dashed) only approaches 1/2 slowly from below.
function ComplementChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = gapLadder[0].log10N;
  const xMax = gapLadder[gapLadder.length - 1].log10N;
  const yMin = 0.4;
  const yMax = 0.52;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const sigmaLogT0Pts = gapLadder.map((r) => `${xAt(r.log10N)},${yAt(r.gapSigma_times_logT0)}`).join(' ');
  const productPts = gapLadder.map((r) => `${xAt(r.log10N)},${yAt(0.5 - r.gapSigma_times_logT0)}`).join(' ');
  const sigmaUPts = gapLadder.map((r) => `${xAt(r.log10N)},${yAt(r.gapSigma_times_u)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[0.4, 0.44, 0.48, 0.5, 0.52].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {gapLadder.map((r) => (
        <text key={'x' + r.log10N} x={xAt(r.log10N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {r.log10N}
        </text>
      ))}

      {/* 1/2 reference line: gapSigma*logT0 + gapProduct == 1/2 exactly */}
      <line
        x1={padL}
        y1={yAt(0.5)}
        x2={padL + cW}
        y2={yAt(0.5)}
        stroke={ED.series3}
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yAt(0.5) - 5} textAnchor="end" fill={ED.series3} fontSize={9.5}>
        exact complement sum &frac12;
      </text>

      <polyline points={sigmaLogT0Pts} fill="none" stroke={ED.series1} strokeWidth={2} />
      <polyline points={productPts} fill="none" stroke={ED.series7} strokeWidth={2} strokeDasharray="4,2" />
      <polyline points={sigmaUPts} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="2,2" />

      {gapLadder.map((r) => (
        <g key={r.log10N}>
          <circle cx={xAt(r.log10N)} cy={yAt(r.gapSigma_times_logT0)} r={3} fill={ED.series1} />
          <circle cx={xAt(r.log10N)} cy={yAt(0.5 - r.gapSigma_times_logT0)} r={3} fill={ED.series7} />
        </g>
      ))}

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        gap value
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(N)
      </text>

      <g>
        <rect x={padL + 8} y={padT} width={10} height={10} fill={ED.series1} />
        <text x={padL + 22} y={padT + 9} fill={ED.inkSoft} fontSize={10}>
          gapSigma &middot; logT0
        </text>
        <rect x={padL + 8} y={padT + 16} width={10} height={10} fill={ED.series7} />
        <text x={padL + 22} y={padT + 25} fill={ED.inkSoft} fontSize={10}>
          gapProduct (= &frac12; &minus; gapSigma&middot;logT0)
        </text>
        <rect x={padL + 8} y={padT + 32} width={10} height={10} fill={ED.brassDeco} />
        <text x={padL + 22} y={padT + 41} fill={ED.inkSoft} fontSize={10}>
          gapSigma &middot; u (approaches &frac12; slowly, not exact)
        </text>
      </g>
    </svg>
  );
}

export default function Imp34417SigmaVsProductGapComplementViz() {
  const { finding, exactComplementIdentity, verdict } = IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT;
  const first = gapLadder[0];
  const last = gapLadder[gapLadder.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-vs-Product Gap: the Exact Complement Identity (imp-34417 / imp-34328)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34197 showed the E_coll product gap collapses to the EXACT law 1/(2u), with the log(2&pi;)
        shift cancelling. imp-33816 measured the bare sigma-exponent gap as ~1/(2&nbsp;log&nbsp;T0),
        never checking it against the product channel on a shared ladder. imp-34328 tabulates both side
        by side: the sigma gap does NOT carry the exact 1/2 on the u axis (gapSigma&middot;u rises only
        from {first.gapSigma_times_u.toFixed(4)} to {last.gapSigma_times_u.toFixed(4)}), but on its
        natural log&nbsp;T0 axis the two channels are EXACT complements &mdash; {exactComplementIdentity}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        gapSigma&middot;logT0 and gapProduct vs log10(N): exact complements summing to &frac12; at every rung
      </p>
      <ComplementChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>logT0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gapSigma&middot;u</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gapSigma&middot;logT0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gapProduct</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>complementSum</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ratio (sigma/product)</th>
          </tr>
        </thead>
        <tbody>
          {gapLadder.map((row) => (
            <tr key={row.log10N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.log10N}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.logT0}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.gapSigma_times_u.toFixed(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.gapSigma_times_logT0.toFixed(8)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.gapProduct}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.complementSum.toFixed(8)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.ratio_sigma_over_product.toFixed(5)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the complement:</strong> {finding.F2_exact_complement_on_the_logT0_axis}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {verdict}
      </div>
    </div>
  );
}
