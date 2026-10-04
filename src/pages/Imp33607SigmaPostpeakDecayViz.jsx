import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33607_SIGMA_CURVE,
  IMP33607_PEAK,
  IMP33607_THRESHOLDS,
  IMP33607_CROSSOVER,
  IMP33607_EXPONENT_LADDER,
  IMP33607_EXPONENT_ASYMPTOTE,
} from '../data/imp-33607-sigma-postpeak-decay-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = { curve: ED.series3, peak: ED.series3, threshold: ED.series5, crossover: ED.series7, exponent: ED.series1 };

function ExponentLadderChart() {
  const svgW = 640;
  const padL = 44;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const n = IMP33607_EXPONENT_LADDER.length;
  const barGap = 10;
  const barW = (cW - barGap * (n - 1)) / n;
  const yMax = IMP33607_EXPONENT_ASYMPTOTE + 0.05;
  const yS = (p) => padT + cH * (1 - p / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <line
        x1={padL}
        y1={yS(IMP33607_EXPONENT_ASYMPTOTE)}
        x2={padL + cW}
        y2={yS(IMP33607_EXPONENT_ASYMPTOTE)}
        stroke={COLORS.crossover}
        strokeWidth={1}
        strokeDasharray="4,2"
      />
      <text x={padL + cW - 2} y={yS(IMP33607_EXPONENT_ASYMPTOTE) - 5} textAnchor="end" fill={ED.series7} fontSize={8.5}>
        imp-3463 far-tail asymptote 1/2
      </text>

      {IMP33607_EXPONENT_LADDER.map((r, i) => {
        const x = padL + i * (barW + barGap);
        const y = yS(r.p_local);
        return (
          <g key={r.decade}>
            <rect x={x} y={y} width={barW} height={padT + cH - y} fill={COLORS.exponent} opacity={0.85} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={ED.series1} fontSize={9}>
              {r.p_local}
            </text>
            <text
              x={x + barW / 2}
              y={padT + cH + 14}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={8}
            >
              {r.decade}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        p_local
      </text>
    </svg>
  );
}

function SigmaPostpeakChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const logNMin = Math.log10(IMP33607_PEAK.N_peak);
  const logNMax = 12;
  const yMin = Math.log10(0.05);
  const yMax = Math.log10(1);

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (s) => padT + cH * (1 - (Math.log10(s) - yMin) / (yMax - yMin));

  const curvePath = IMP33607_SIGMA_CURVE.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.sigma).toFixed(2)
  ).join(' ');

  const xTickNs = [IMP33607_PEAK.N_peak, 1e7, 1e9, 1e11, 1e12];
  const xTickLabels = ['9.22e5', '1e7', '1e9', '1e11', '1e12'];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0.1, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {IMP33607_THRESHOLDS.map((t) => (
        <line
          key={'thl' + t.label}
          x1={xS(t.N)}
          y1={padT}
          x2={xS(t.N)}
          y2={padT + cH}
          stroke={COLORS.threshold}
          strokeWidth={0.8}
          strokeDasharray="2,3"
          opacity={0.6}
        />
      ))}

      <line
        x1={xS(IMP33607_CROSSOVER.N)}
        y1={padT}
        x2={xS(IMP33607_CROSSOVER.N)}
        y2={padT + cH}
        stroke={COLORS.crossover}
        strokeWidth={1.2}
        strokeDasharray="4,2"
      />

      <path d={curvePath} fill="none" stroke={COLORS.curve} strokeWidth={2} />

      {IMP33607_SIGMA_CURVE.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.sigma)} r={3.5} fill={COLORS.curve} />
      ))}

      <circle
        cx={xS(IMP33607_PEAK.N_peak)}
        cy={yS(IMP33607_PEAK.sigma_max)}
        r={5.5}
        fill="none"
        stroke={COLORS.peak}
        strokeWidth={2}
      />
      <text x={xS(IMP33607_PEAK.N_peak) + 6} y={yS(IMP33607_PEAK.sigma_max) - 8} fill={ED.series3} fontSize={9}>
        interior peak (imp-3406)
      </text>

      {IMP33607_THRESHOLDS.map((t) => (
        <circle key={'thc' + t.label} cx={xS(t.N)} cy={yS(t.sigma)} r={4} fill={COLORS.threshold} stroke={ED.paper} strokeWidth={1} />
      ))}

      <circle
        cx={xS(IMP33607_CROSSOVER.N)}
        cy={yS(IMP33607_CROSSOVER.sigma)}
        r={6}
        fill="none"
        stroke={COLORS.crossover}
        strokeWidth={2}
      />
      <text x={xS(IMP33607_CROSSOVER.N) + 6} y={yS(IMP33607_CROSSOVER.sigma) + 16} fill={ED.series7} fontSize={9}>
        imp-3444 crossover
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTickNs.map((N, i) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {xTickLabels[i]}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale)
      </text>

      {IMP33607_THRESHOLDS.map((t) => (
        <text
          key={'thlab' + t.label}
          x={xS(t.N)}
          y={padT + cH + 48}
          textAnchor="middle"
          fill={ED.series5}
          fontSize={7.5}
          transform={'rotate(-40,' + xS(t.N) + ',' + (padT + cH + 48) + ')'}
        >
          {t.N.toExponential(2)}
        </text>
      ))}

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        sigma(N) (log scale)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.curve} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series3}>sigma(N) post-peak (imp-33582)</text>
        <circle cx={padL + 6} cy={padT + 26} r={4} fill={COLORS.threshold} />
        <text x={padL + 14} y={padT + 29} fill={ED.series5}>threshold crossings (0.9, 0.5, 0.1)</text>
      </g>
    </svg>
  );
}

export default function Imp33607SigmaPostpeakDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Post-Peak Decay Past the PATH-1 Ceiling (imp-33582 / imp-33607)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Past the imp-3406 interior maximum (N_peak &sim; {IMP33607_PEAK.N_peak.toExponential(3)}, sigma_max
        &sim; {IMP33607_PEAK.sigma_max.toFixed(4)}), the conditional share sigma(N) = E_coll/E(N) decays
        slowly and acceleratingly across the extrapolation grid the 10^6 PATH-1 ceiling left open. The
        share stays above 0.9 out to N &sim; 2.57e7, halves at N &sim; 3.27e9 -- landing within &sim;0.4%
        of the imp-3444 E_coll = E_trunc crossover -- and drops below 0.1 only at N &sim; 3.21e11.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        sigma(N) past the interior peak, with the three threshold crossings and the imp-3444 crossover marked
      </p>
      <SigmaPostpeakChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        per-decade local decay exponent p_local, ramping toward the far-tail 1/2 asymptote (imp-95081)
      </p>
      <ExponentLadderChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization only -- no
        proof, no reduction below RH. sigma(N) is the inherited imp-3220/imp-3406 extrapolation model, NOT
        a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is untouched; changes no bound;
        establishes no operator positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3565-sigma-postpeak-decay-exponent" style={{ color: 'var(--series-5)' }}>
          Sigma(N) Post-Peak Decay Exponent (imp-3565)
        </Link>
      </div>
    </div>
  );
}
