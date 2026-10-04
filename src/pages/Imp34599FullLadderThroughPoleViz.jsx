import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34406_EFLOW_ATTR_RUNGS } from '../data/imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import { IMP34572_FAR_SIDE_RUNGS } from '../data/imp-34572-eflow-attr-far-side-pole-smoothness.js';
import { ED } from '../styles/tokens.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// Join the imp-34406 near/at-pole bracket (k=21.00..21.50) with the imp-34572 far-side
// rungs (k=21.30..21.60), deduplicating the three shared overlap rungs (21.30/21.40/21.50,
// reproduced exactly by imp-34572) into ONE monotone-through-the-pole ladder. Both source
// modules are import-light baked literals; no new computation, no zeros bundle.
const BY_K = new Map();
for (const r of IMP34406_EFLOW_ATTR_RUNGS) BY_K.set(r.k, { k: r.k, eflowAttr: r.eflowAttr });
for (const r of IMP34572_FAR_SIDE_RUNGS) {
  if (!BY_K.has(r.k)) BY_K.set(r.k, { k: r.k, eflowAttr: r.eflowAttr });
}
const LADDER = Array.from(BY_K.values()).sort((a, b) => a.k - b.k);

// Per-rung local log-slope d ln(eflowAttr) / dk, central difference on the (non-uniform)
// ladder spacing -- the same finite-difference shape imp-34572 uses for its far-side slopes.
function localSlope(i) {
  if (i === 0 || i === LADDER.length - 1) return null;
  const lo = LADDER[i - 1];
  const hi = LADDER[i + 1];
  return (Math.log(hi.eflowAttr) - Math.log(lo.eflowAttr)) / (hi.k - lo.k);
}
const RUNGS = LADDER.map((r, i) => ({ ...r, slope: localSlope(i), isPole: r.k === KSTAR }));

function LadderChart() {
  const svgW = 640;
  const svgH = 280;
  const padL = 64;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = RUNGS[0].k;
  const kMax = RUNGS[RUNGS.length - 1].k;
  const xAt = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const logVals = RUNGS.map((r) => Math.log10(r.eflowAttr));
  const yMin = Math.min(...logVals) - 0.3;
  const yMax = Math.max(...logVals) + 0.3;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const path = RUNGS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.k)},${yAt(Math.log10(r.eflowAttr))}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <line
        x1={xAt(KSTAR)}
        y1={padT}
        x2={xAt(KSTAR)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={xAt(KSTAR) + 4} y={padT + 10} fill={ED.brass} fontSize={9}>
        k* &asymp; 21.28095 (simple pole)
      </text>

      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2} />

      {RUNGS.map((r) => (
        <circle
          key={r.k}
          cx={xAt(r.k)}
          cy={yAt(Math.log10(r.eflowAttr))}
          r={r.isPole ? 4.5 : 3}
          fill={r.isPole ? ED.brassDeco : ED.series3}
          stroke={ED.paper}
          strokeWidth={1}
        />
      ))}

      <text x={padL} y={16} fill={ED.series3} fontSize={10}>
        log10(eflow_attr(k)) -- {RUNGS.length} rungs, k = {kMin.toFixed(2)} .. {kMax.toFixed(2)}
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k
      </text>
    </svg>
  );
}

export default function Imp34599FullLadderThroughPoleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Full eflow_attr(k) Ladder Through the Pole k* (imp-34599 / imp-34406 / imp-34572)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The eflow_attr(k) genuine-simple-pole story was previously split across two modules:
        imp-34406 (near/at-pole bracket, k=21.00&nbsp;..&nbsp;21.50) and imp-34572 (far-side
        rungs, k=21.30&nbsp;..&nbsp;21.60). This tab joins both brackets -- deduplicating the
        three overlap rungs (k=21.30/21.40/21.50, reproduced exactly by imp-34572) -- into one
        monotone-decreasing ladder of {RUNGS.length} rungs spanning k = {RUNGS[0].k.toFixed(2)}
        &nbsp;..&nbsp;{RUNGS[RUNGS.length - 1].k.toFixed(2)}, with the per-rung local log-slope
        d&nbsp;ln(eflow_attr)/dk shown alongside. Both value and slope stay smooth, monotone, and
        finite straight through k* &asymp; 21.28095 -- no kink, sign change, or slope jump.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10(eflow_attr(k)) across the full ladder, pole location marked
      </p>
      <LadderChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>eflow_attr(k)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>local log-slope (per k)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {RUNGS.map((r) => (
            <tr
              key={r.k}
              style={{
                borderBottom: '1px solid var(--rule-soft)',
                color: r.isPole ? 'var(--brass)' : 'var(--ink)',
                fontWeight: r.isPole ? 700 : 400,
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.isPole ? 'k* = ' : ''}
                {r.k}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.eflowAttr.toExponential(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.slope === null ? '(endpoint)' : r.slope.toFixed(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.k <= 21.25 ? 'imp-34406' : r.k >= 21.55 ? 'imp-34572' : 'imp-34406 & imp-34572'}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, joining the
        imp-34406 and imp-34572 baked rung tables verbatim (the local log-slope column is a
        plain central-difference recomputation from those published values, no new measurement).
        Import-light, no zeros bundle in the chain. A finite-difference recovery of an inherited
        surrogate numerator across an inherited pole, NOT an RH bound; the component model is
        the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
        GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
        positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
