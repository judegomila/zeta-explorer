import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34460_WINDOW_ROWS,
  IMP34460_BAND,
  IMP34460_SUMMARY,
} from '../data/imp-34460-two-term-curvature-crossval-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// Bar chart: two-term leading coefficient a vs window, with the one-term constant fit as a tick
// mark on each bar and the 0.437-0.438 band shaded across the full width.
function LeadingCoefficientBars() {
  const svgW = 640;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34460_WINDOW_ROWS;
  const n = rows.length;
  const slot = cW / n;
  const barWidth = 40;

  const yMin = 0.434;
  const yMax = 0.44;
  const yAt = (v) => padT + ((yMax - v) / (yMax - yMin)) * cH;
  const xAt = (i) => padL + slot * i + slot / 2;

  const yTicks = [0.434, 0.436, 0.438, 0.44];

  const bandY1 = yAt(IMP34460_BAND.hi);
  const bandY2 = yAt(IMP34460_BAND.lo);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={bandY1} width={cW} height={bandY2 - bandY1} fill={alpha(ED.series3, 0.1)} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      {rows.map((r, i) => (
        <g key={r.window}>
          <rect
            x={xAt(i) - barWidth / 2}
            y={yAt(r.twoTermA)}
            width={barWidth}
            height={padT + cH - yAt(r.twoTermA)}
            fill={ED.series1}
            stroke={ED.paper}
            strokeWidth={0.75}
          />
          <line
            x1={xAt(i) - barWidth / 2 - 4}
            y1={yAt(r.constA)}
            x2={xAt(i) + barWidth / 2 + 4}
            y2={yAt(r.constA)}
            stroke={ED.series7}
            strokeWidth={1.5}
          />
          <text
            x={xAt(i)}
            y={yAt(r.twoTermA) - 6}
            textAnchor="middle"
            fill={ED.ink}
            fontSize={9.5}
          >
            {r.twoTermA.toFixed(4)}
          </text>
          <text
            x={xAt(i)}
            y={padT + cH + 16}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={8.5}
          >
            {r.kEndLo}..{r.kEndHi}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
        window (kEnd range) &mdash; blue bar = two-term a, pink tick = one-term constant a
      </text>
      <text x={padL + cW / 2} y={padT + cH + 48} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        shaded band = imp-34286 confirmed range [{IMP34460_BAND.lo}, {IMP34460_BAND.hi}]
      </text>
    </svg>
  );
}

export default function Imp34460TwoTermCurvatureCrossvalViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Two-Term Curvature Cross-Validation (imp-34375)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34286 bias-corrected the numerator-approach leading prefactor to a &asymp; {IMP34460_BAND.lo}-{IMP34460_BAND.hi}{' '}
        in the approach gap g(kEnd) = 1 - numerator &asymp; a/kEnd, using a purely first-order fit. imp-34375
        added an explicit curvature term, fitting the two-term model g*kEnd = a + b/kEnd (intercept a, slope
        b) across four windows, to test whether the curvature term relocates the leading coefficient. Every
        two-term a lands inside or immediately adjacent to the confirmed band, and the shift versus the
        one-term constant fit is tiny &mdash; at most {IMP34460_SUMMARY.maxAbsLeadShift.toFixed(6)} (full
        window) and only {IMP34460_SUMMARY.farFieldLeadShift.toFixed(6)} in the far field.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        two-term leading coefficient a vs window, one-term constant fit marked
      </p>
      <LeadingCoefficientBars />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.5rem' }}>window</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>const a (one-term)</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>two-term a</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>curvature b</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>lead shift</th>
          </tr>
        </thead>
        <tbody>
          {IMP34460_WINDOW_ROWS.map((r) => (
            <tr key={r.window} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.5rem' }}>{r.window}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.constA.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.twoTermA.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.curvatureB.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.leadShift >= 0 ? '+' : ''}{r.leadShift.toFixed(6)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> across all four windows the two-term leading
        coefficient a stays inside or immediately adjacent to the {IMP34460_BAND.lo}-{IMP34460_BAND.hi} band,
        and the shift from adding curvature is tiny &mdash; the one-term coefficient was NOT silently
        absorbing curvature. The fitted curvature contribution b/kEnd&sup2; at kEnd = 100 is
        ~{IMP34460_SUMMARY.farFieldCurvatureAt100.toExponential(3)}, roughly four orders of magnitude below
        g(100) &asymp; {IMP34460_SUMMARY.gapAt100}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34375 measurement; no new derivation, no bound changed. Component model is the
        inherited surrogate diagnostic, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486
        UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
