import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95430_BREACH_THRESHOLD_BOUND } from '../data/imp-95430-breach-threshold-bound.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP95430_BREACH_THRESHOLD_BOUND;
const M_ROWS = DATA.mDependence;
const RHO_ROWS = DATA.rhoDependence;

// Line chart: delta*(m) at rho = 2, monotone decreasing. The m = 8 point is
// highlighted as the binding-pattern-annotated crossing (Finding 1).
function MDependenceChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const xVals = M_ROWS.map((r) => r.m);
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yVals = M_ROWS.map((r) => r.pct);
  const top = Math.max(...yVals) + 2;
  const bot = 0;
  const yOf = (v) => padT + ((top - v) / (top - bot)) * plotH;

  const path = M_ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.m)} ${yOf(r.pct)}`,
  ).join(' ');

  const yTicks = [0, 5, 10, 15, 20].filter((v) => v <= top);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <line key={`g${v}`} x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {M_ROWS.map((r) => {
        const binding = r.m === 8;
        return (
          <g key={r.m}>
            <circle cx={xOf(r.m)} cy={yOf(r.pct)} r={binding ? 6 : 4} fill={binding ? ED.brassDeco : ED.series1} />
            {binding && (
              <text x={xOf(r.m)} y={yOf(r.pct) - 12} textAnchor="middle" fill={ED.brass} fontSize={9.5}>
                single binder: idx {DATA.breachM8Rho2.bindingPatternIdx}
              </text>
            )}
            <text x={xOf(r.m)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
              m={r.m}
            </text>
          </g>
        );
      })}
      {yTicks.map((v) => (
        <text key={`t${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}%
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        octave count m (rho = 2)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        delta* (percent)
      </text>
    </svg>
  );
}

// Line chart: delta*(rho) at m = 8, monotone increasing.
function RhoDependenceChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const xVals = RHO_ROWS.map((r) => r.rho);
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const yVals = RHO_ROWS.map((r) => r.pct);
  const top = Math.max(...yVals) + 2;
  const bot = 0;
  const yOf = (v) => padT + ((top - v) / (top - bot)) * plotH;

  const path = RHO_ROWS.map(
    (r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.rho)} ${yOf(r.pct)}`,
  ).join(' ');

  const yTicks = [0, 10, 20, 30].filter((v) => v <= top);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <line key={`g${v}`} x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2} />
      {RHO_ROWS.map((r) => {
        const binding = r.rho === 2;
        return (
          <g key={r.rho}>
            <circle cx={xOf(r.rho)} cy={yOf(r.pct)} r={binding ? 6 : 4} fill={binding ? ED.brassDeco : ED.series3} />
            {binding && (
              <text x={xOf(r.rho)} y={yOf(r.pct) - 12} textAnchor="middle" fill={ED.brass} fontSize={9.5}>
                single binder: idx {DATA.breachM8Rho2.bindingPatternIdx}
              </text>
            )}
            <text x={xOf(r.rho)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
              rho={r.rho}
            </text>
          </g>
        );
      })}
      {yTicks.map((v) => (
        <text key={`t${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}%
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        lattice ratio rho (m = 8)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        delta* (percent)
      </text>
    </svg>
  );
}

export default function Imp95492BreachThresholdSurfaceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Off-Lattice Breach-Threshold delta*(m, rho) Surface (imp-95430)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a
        measurement/derivation-only page tabulating the imp-95430 worst-of-400
        crossing threshold. It changes no bound and proves no off-lattice floor
        theorem. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art.
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95430 bisected the imp-95374 Finding&nbsp;3 crossing bracket to the
        tighter threshold delta* = 5.199% at m&nbsp;=&nbsp;8, rho&nbsp;=&nbsp;2,
        where the proven m-uniform floor A_unif4(rho) is first breached by the
        consistently scaled worst-of-400 off-lattice seam-pencil floor. A single
        pattern &mdash; index&nbsp;{DATA.breachM8Rho2.bindingPatternIdx} of the
        400 &mdash; is the exact binder at that crossing (gold points below). The
        threshold shrinks as the octave count m grows and grows as the lattice
        ratio rho widens.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        delta*(m) at rho&nbsp;=&nbsp;2 &mdash; shrinks with more octave blocks
      </h3>
      <MDependenceChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        delta*(rho) at m&nbsp;=&nbsp;8 &mdash; grows with wider lattice spacing
      </h3>
      <RhoDependenceChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>m (rho=2)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>delta*</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>+-%</th>
            <th style={{ textAlign: 'left', paddingBottom: 4, paddingLeft: 24 }}>rho (m=8)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>delta*</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>+-%</th>
          </tr>
        </thead>
        <tbody>
          {M_ROWS.map((r, i) => {
            const rr = RHO_ROWS[i];
            return (
              <tr key={r.m} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
                <td style={{ padding: '3px 0' }}>{r.m}</td>
                <td style={{ textAlign: 'right' }}>{r.deltaStar.toFixed(6)}</td>
                <td style={{ textAlign: 'right' }}>{r.pct.toFixed(2)}%</td>
                <td style={{ paddingLeft: 24 }}>{rr ? rr.rho : ''}</td>
                <td style={{ textAlign: 'right' }}>{rr ? rr.deltaStar.toFixed(6) : ''}</td>
                <td style={{ textAlign: 'right' }}>{rr ? `${rr.pct.toFixed(2)}%` : ''}</td>
              </tr>
            );
          })}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Single-binding-pattern
        annotation:</strong> at the m&nbsp;=&nbsp;8, rho&nbsp;=&nbsp;2 crossing
        (gold point on both curves), the worst-of-400 minimum is realized by one
        fixed pattern &mdash; index&nbsp;{DATA.breachM8Rho2.bindingPatternIdx}
        &mdash; whose own floor crossing alone reproduces delta* to six digits.
        The collapse past that threshold is nonetheless a COLLECTIVE effect of
        the full jittered configuration (imp-95430 Finding&nbsp;4: the tightest
        in-block gap {DATA.bindingGapM8.minInBlock.toFixed(6)} sits just above
        the in-block window floor {DATA.bindingGapM8.inBlockWindowFloor.toFixed(6)},
        while the tightest cross-block gap {DATA.bindingGapM8.minCrossBlock.toFixed(6)}
        stays far from closing) &mdash; not the closing of any single pinned
        pair.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        rendering the frozen imp-95430 baked record (no re-derivation). The
        crossing threshold is a worst-of-400 estimate, not an infimum (larger T
        finds worse configurations and lowers delta*); the comparison is
        against the proven m-uniform A_unif4(rho), so finite-m headroom is part
        of the absorbed margin. Supplies no off-lattice floor theorem, changes
        no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
