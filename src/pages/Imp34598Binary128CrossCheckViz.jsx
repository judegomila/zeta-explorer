import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34569_BINARY128_EMULATION_CROSS_CHECK } from '../data/imp-34569-binary128-emulation-cross-check.js';
import { ED } from '../styles/tokens.js';

const M = IMP34569_BINARY128_EMULATION_CROSS_CHECK;
const RUNGS = M.nodes.filter((n) => n.label.startsWith('e=24') || n.label.startsWith('e=25') || n.label.startsWith('e=26'));

// log10(rel error) vs bf for native and dd, across the e=24/25/26 refinement rungs -- makes the
// >1e6x dd-vs-native accuracy gap visually obvious on a shared log axis.
function RelErrorChart() {
  const svgW = 640;
  const svgH = 280;
  const padL = 64;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = RUNGS.length;
  const xAt = (i) => padL + (i / (n - 1)) * cW;

  const logNative = RUNGS.map((r) => Math.log10(r.relNativeBf));
  const logDd = RUNGS.map((r) => Math.log10(r.relDdBf));
  const yMin = Math.min(...logDd) - 1;
  const yMax = Math.max(...logNative) + 1;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const nativePath = RUNGS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(Math.log10(r.relNativeBf))}`).join(' ');
  const ddPath = RUNGS.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(Math.log10(r.relDdBf))}`).join(' ');

  const gridExponents = [];
  for (let e = Math.ceil(yMax); e >= Math.floor(yMin); e -= 5) gridExponents.push(e);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {gridExponents.map((e) => (
        <g key={e}>
          <line x1={padL} y1={yAt(e)} x2={padL + cW} y2={yAt(e)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(e) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{e}
          </text>
        </g>
      ))}

      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={nativePath} fill="none" stroke={ED.series2} strokeWidth={2} />
      <path d={ddPath} fill="none" stroke={ED.series3} strokeWidth={2} />

      {RUNGS.map((r, i) => (
        <g key={r.label}>
          <circle cx={xAt(i)} cy={yAt(Math.log10(r.relNativeBf))} r={3.5} fill={ED.series2} stroke={ED.paper} strokeWidth={1} />
          <circle cx={xAt(i)} cy={yAt(Math.log10(r.relDdBf))} r={3.5} fill={ED.series3} stroke={ED.paper} strokeWidth={1} />
          <text x={xAt(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.label.split(' ')[0]}
          </text>
        </g>
      ))}

      <text x={padL} y={16} fill={ED.series2} fontSize={10}>
        rel(native, bf) -- double ULP width
      </text>
      <text x={padL + 250} y={16} fill={ED.series3} fontSize={10}>
        rel(dd, bf) -- dd 106-bit floor
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        refinement rung (dd-argmax nodes near k*_dd &asymp; 8.8210916)
      </text>
    </svg>
  );
}

export default function Imp34598Binary128CrossCheckViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Binary128-Emulation resid_exp Cross-Check: native vs dd against the bf arbiter (imp-34598 / imp-34569)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34569 cross-checked the imp-34551 double-double (dd, 106-bit) resid_exp(k) hi-word
        against an INDEPENDENT extended-precision arbiter -- a BigInt decimal fixed-point kernel
        (bf, P=60, ~199-bit) sharing no radix or transcendental algorithm with the dd kernel. At
        every refinement rung, rel(native, bf) sits at native-double ULP width
        (~7.8e-16&nbsp;..&nbsp;4.9e-15) while rel(dd, bf) sits at the dd 106-bit floor
        (~2e-31&nbsp;..&nbsp;1.2e-30) -- the double-double is more than 1e6&times; tighter than
        native at every node. No viz existed for this three-way comparison.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10(relative error vs the independent bf arbiter), native vs dd, across e=24/25/26
      </p>
      <RelErrorChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>rung</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rel(native, bf)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rel(dd, bf)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dd/native tightness</th>
          </tr>
        </thead>
        <tbody>
          {RUNGS.map((r) => (
            <tr key={r.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.relNativeBf.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.relDdBf.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(r.relNativeBf / r.relDdBf).toExponential(2)}x
              </td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, reusing the
        imp-34569 three-way native/dd/bf node table verbatim, no new computation. Independent
        extended-precision cross-validation of an inherited widened pipeline, NOT an RH bound; the
        component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb
        GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
        positivity; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
