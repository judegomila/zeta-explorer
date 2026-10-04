import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35121_LADDER,
  IMP35121_LANDMARKS,
} from '../data/imp-35121-ecoll-etrunc-eflow-decomposition-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = { coll: ED.series3, trunc: ED.series5, flow: ED.series4, landmark: ED.series7 };

function EcollEtruncEflowChart() {
  const svgW = 680;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 64;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const logNMin = 5.9;
  const logNMax = 13.1;
  const yMin = Math.log10(1e-11);
  const yMax = Math.log10(3e-3);

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const seriesPath = (key) =>
    IMP35121_LADDER.map(
      (r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r[key]).toFixed(2)
    ).join(' ');

  const collPath = seriesPath('E_coll');
  const truncPath = seriesPath('E_trunc');
  const flowPath = seriesPath('E_flow');

  const yTicks = [1e-10, 1e-8, 1e-6, 1e-4, 1e-3];
  const xTickNs = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP35121_LANDMARKS.map((l) => (
        <line
          key={'vl' + l.key}
          x1={xS(l.N)}
          y1={padT}
          x2={xS(l.N)}
          y2={padT + cH}
          stroke={COLORS.landmark}
          strokeWidth={1}
          strokeDasharray="3,2"
          opacity={0.7}
        />
      ))}

      <path d={collPath} fill="none" stroke={COLORS.coll} strokeWidth={2} />
      <path d={truncPath} fill="none" stroke={COLORS.trunc} strokeWidth={2} strokeDasharray="6,3" />
      <path d={flowPath} fill="none" stroke={COLORS.flow} strokeWidth={2} strokeDasharray="1,2" />

      {IMP35121_LADDER.map((r) => (
        <circle key={'c' + r.N} cx={xS(r.N)} cy={yS(r.E_coll)} r={3} fill={COLORS.coll} />
      ))}
      {IMP35121_LADDER.map((r) => (
        <circle key={'t' + r.N} cx={xS(r.N)} cy={yS(r.E_trunc)} r={2.5} fill={COLORS.trunc} />
      ))}
      {IMP35121_LADDER.map((r) => (
        <circle key={'f' + r.N} cx={xS(r.N)} cy={yS(r.E_flow)} r={2.5} fill={COLORS.flow} />
      ))}

      {IMP35121_LANDMARKS.map((l, i) => (
        <text
          key={'lbl' + l.key}
          x={xS(l.N)}
          y={padT + 12 + i * 11}
          textAnchor="middle"
          fill={ED.series7}
          fontSize={7.5}
        >
          {l.key}
        </text>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTickNs.map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {N.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        error term (log scale)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.coll} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series3}>E_coll ~ sqrt(log T0 / N)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={COLORS.trunc} strokeWidth={2} strokeDasharray="6,3" />
        <text x={padL + 14} y={padT + 29} fill={ED.series5}>E_trunc (flat floor, 3.06e-5)</text>
        <line x1={padL + 2} y1={padT + 40} x2={padL + 10} y2={padT + 40} stroke={COLORS.flow} strokeWidth={2} strokeDasharray="1,2" />
        <text x={padL + 14} y={padT + 43} fill={ED.brass}>E_flow ~ (log T0 / T0) Gronwall</text>
      </g>
    </svg>
  );
}

export default function Imp35121EcollEtruncEflowDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_coll / E_trunc / E_flow Component Decomposition of E(N) (imp-33601 / imp-35121)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-33601 surrogate E(N) = E_coll(N) + E_trunc + E_flow(N) splits into three terms:
        the decaying GUE-conditional E_coll(N) &sim; sqrt(log T0 / N), the flat N-independent
        E_trunc floor (imp-2631, exactly 3.06e-5), and the small Gronwall flow term E_flow(N).
        Across N &isin; [1e6, 1e13] all three are shown on a shared log-log axis, with the four
        imp-33601-family landmarks marked: the imp-3406 sigma peak (N &sim; 9.22e5, E_coll
        dominant), the imp-33582 N_half (N &sim; 3.267e9, sigma = 1/2 exactly), the imp-33723
        closed-form N_cross (N &sim; 3.280294e9, E_coll = E_trunc), and the imp-33721 ramp
        inflection N_star (N &sim; 3.38e9, E_trunc just overtaking E_coll).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        E_coll / E_trunc / E_flow across N = 1e6 .. 1e13, four landmarks annotated
      </p>
      <EcollEtruncEflowChart />

      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--rule)' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Landmark</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>N</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>E_coll</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>E_trunc</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>E_flow</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Dominant term</th>
            </tr>
          </thead>
          <tbody>
            {IMP35121_LANDMARKS.map((l) => (
              <tr key={l.key} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                <td style={{ padding: '4px 8px' }}>{l.label}</td>
                <td style={{ textAlign: 'right', padding: '4px 8px' }}>{l.N.toExponential(3)}</td>
                <td style={{ textAlign: 'right', padding: '4px 8px' }}>{l.E_coll.toExponential(3)}</td>
                <td style={{ textAlign: 'right', padding: '4px 8px' }}>{l.E_trunc.toExponential(3)}</td>
                <td style={{ textAlign: 'right', padding: '4px 8px' }}>{l.E_flow.toExponential(3)}</td>
                <td style={{ padding: '4px 8px' }}>{l.dominant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> E_coll (solid green) falls
        roughly as N<sup>-1/2</sup> and dominates the low-N regime (sigma &sim; 0.95 at the imp-3406
        peak); E_trunc (dashed purple) is exactly flat at 3.06e-5; E_flow (dotted amber) is always
        the smallest term but decays fastest, so it never dominates -- it only matters through the
        exact identity sigma = 1/2 &hArr; E_coll = E_trunc + E_flow (imp-33601), which is why N_half
        sits slightly below N_cross. Past N_cross, E_trunc becomes and stays the dominant floor.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Step-4 status -- E(N) does NOT vanish here:</strong>{' '}
        this chart's own E_trunc curve is the flat purple line, not a decaying one: E(N) = E_coll
        + E_trunc + E_flow FLOORS at the constant E_trunc = 3.06e-5 (imp-35100) instead of tending
        to 0, so the fixed-strip surrogate as written provably CANNOT supply the LAMBDA_CHAIN_STEPS
        Step-4 rate E(N) &rarr; 0. The only knob that vanishes E_trunc is Knob A -- growing the
        VERIFIED height T_v(N) &rarr; &infin; at a fixed abscissa (imp-35149); the thin-moving-strip
        Knob B makes E_trunc GROW instead (imp-2622). Knob A's own supply of T_v(N) beyond
        T_PT = 3e12 is unresolved (imp-35149 R3), so this remains a scoped-but-open route, not a
        closed one.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> visualization only -- the
        component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic. The C_mb GUE-conditional per imp-486 is untouched; changes no bound;
        establishes no operator positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict,
        NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp33628-etrunc-ecoll-crossover" style={{ color: 'var(--series-5)' }}>
          E_trunc / E_coll Post-Peak Crossover Ladder (imp-33602 / imp-33628)
        </Link>
      </div>
    </div>
  );
}
