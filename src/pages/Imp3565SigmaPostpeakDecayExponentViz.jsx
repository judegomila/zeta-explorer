import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3565_DECAY_LADDER,
  IMP3565_FAR_TAIL,
  IMP3565_THRESHOLDS,
  IMP3565_PEAK,
  IMP3565_N_CROSSOVER,
  IMP3565_ASYMPTOTIC_EXPONENT,
} from '../data/imp-3565-sigma-postpeak-decay-exponent-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = { ladder: ED.series3, farTail: ED.series1, asymptote: ED.series4, crossover: ED.series7, threshold: ED.series5 };

function DecayExponentChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const logNMin = Math.log10(IMP3565_PEAK.N_max);
  const logNMax = Math.log10(1e50);
  const yMin = 0;
  const yMax = 0.55;

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (p) => padT + cH * (1 - (p - yMin) / (yMax - yMin));

  const ladderPath = IMP3565_DECAY_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.p_local).toFixed(2)).join(' ');
  const farTailPath = IMP3565_FAR_TAIL.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.p_local).toFixed(2)).join(' ');

  const crossover = IMP3565_DECAY_LADDER.find((r) => Math.abs(r.N - IMP3565_N_CROSSOVER) < 1);

  const xTickNs = [IMP3565_PEAK.N_max, 1e7, 1e9, IMP3565_N_CROSSOVER, 1e11, 1e13, 1e20, 1e50];
  const xTickLabels = ['9.2e5', '1e7', '1e9', '3.28e9', '1e11', '1e13', '1e20', '1e50'];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP3565_ASYMPTOTIC_EXPONENT)}
        x2={padL + cW}
        y2={yS(IMP3565_ASYMPTOTIC_EXPONENT)}
        stroke={COLORS.asymptote}
        strokeWidth={1.4}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP3565_ASYMPTOTIC_EXPONENT) - 6} textAnchor="end" fill={ED.brass} fontSize={9}>
        asymptote p -&gt; 1/2 (imp-3463)
      </text>

      <path d={ladderPath} fill="none" stroke={COLORS.ladder} strokeWidth={2} />
      <path d={farTailPath} fill="none" stroke={COLORS.farTail} strokeWidth={2} strokeDasharray="2,3" />

      {IMP3565_DECAY_LADDER.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.p_local)} r={3.5} fill={COLORS.ladder} />
      ))}
      {IMP3565_FAR_TAIL.slice(1).map((r) => (
        <circle key={'ft' + r.N} cx={xS(r.N)} cy={yS(r.p_local)} r={3.5} fill={COLORS.farTail} />
      ))}

      {crossover && (
        <>
          <line x1={xS(crossover.N)} y1={padT} x2={xS(crossover.N)} y2={padT + cH} stroke={COLORS.crossover} strokeWidth={1} strokeDasharray="3,3" />
          <circle cx={xS(crossover.N)} cy={yS(crossover.p_local)} r={5.5} fill="none" stroke={COLORS.crossover} strokeWidth={2} />
          <text x={xS(crossover.N) + 6} y={yS(crossover.p_local) - 8} fill={ED.series7} fontSize={9}>
            crossover: sigma=1/2, p&asymp;0.238
          </text>
        </>
      )}

      <circle cx={xS(IMP3565_PEAK.N_max)} cy={yS(0)} r={4.5} fill="none" stroke={ED.series3} strokeWidth={1.6} />
      <text x={xS(IMP3565_PEAK.N_max) + 6} y={yS(0) + 14} fill={ED.series3} fontSize={9}>
        interior max, p=0
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTickNs.map((N, i) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
            {xTickLabels[i]}
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
        p(N) = -dln sigma/dln N
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.ladder} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series3}>post-peak ladder (imp-3529)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={COLORS.farTail} strokeWidth={2} strokeDasharray="2,3" />
        <text x={padL + 14} y={padT + 29} fill={ED.series1}>far-tail continuation (1e13..1e50)</text>
      </g>
    </svg>
  );
}

function SigmaDecayChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const logNMin = Math.log10(IMP3565_PEAK.N_max);
  const logNMax = Math.log10(4.62e13);
  const yMin = Math.log10(0.008);
  const yMax = Math.log10(1);

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (s) => padT + cH * (1 - (Math.log10(s) - yMin) / (yMax - yMin));

  const ladderPath = IMP3565_DECAY_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.sigma).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0.01, 0.1, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {IMP3565_THRESHOLDS.map((t) => (
        <g key={'th' + t.sigma_below}>
          <line x1={xS(t.N)} y1={padT} x2={xS(t.N)} y2={padT + cH} stroke={COLORS.threshold} strokeWidth={0.8} strokeDasharray="2,3" opacity={0.6} />
        </g>
      ))}

      <path d={ladderPath} fill="none" stroke={COLORS.ladder} strokeWidth={2} />

      {IMP3565_DECAY_LADDER.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.sigma)} r={3.5} fill={COLORS.ladder} />
      ))}
      {IMP3565_THRESHOLDS.map((t) => (
        <circle key={'tp' + t.sigma_below} cx={xS(t.N)} cy={yS(t.sigma_below)} r={4} fill={COLORS.threshold} stroke={ED.paper} strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3565_THRESHOLDS.map((t) => (
        <g key={'xt' + t.sigma_below}>
          <line x1={xS(t.N)} y1={padT + cH} x2={xS(t.N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(t.N)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5} transform={'rotate(-40,' + xS(t.N) + ',' + (padT + cH + 16) + ')'}>
            {t.N.toExponential(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 40} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N at threshold crossing (log scale)
      </text>

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
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.ladder} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series3}>sigma(N) post-peak ladder</text>
        <circle cx={padL + 6} cy={padT + 26} r={4} fill={COLORS.threshold} />
        <text x={padL + 14} y={padT + 29} fill={ED.series5}>threshold crossings (0.9, 0.75, 0.5, 0.25, 0.1, 0.01)</text>
      </g>
    </svg>
  );
}

export default function Imp3565SigmaPostpeakDecayExponentViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Post-Peak Decay Exponent (imp-3529 / imp-3565)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Past the imp-3406 interior maximum (N_max &sim; {IMP3565_PEAK.N_max.toExponential(3)}, sigma_max
        &sim; {IMP3565_PEAK.sigma_max.toFixed(6)}) the conditional share sigma(N) = E_coll/E(N) decays
        toward 0, but NOT as a single power law. The local exponent p(N) = -dln sigma/dln N climbs
        monotonely from 0 at the flat cap toward the imp-3463 far-tail asymptote 1/2, inflecting through
        p &asymp; 0.238 exactly at the imp-3444 E_coll = E_trunc crossover (N &sim;{' '}
        {IMP3565_N_CROSSOVER.toExponential(3)}) where sigma = 1/2.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Local decay exponent p(N) climbing from 0 (interior max) to the 1/2 asymptote, crossover marked
      </p>
      <DecayExponentChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        sigma(N) post-peak decay with the six threshold crossings (0.9 down to 0.01)
      </p>
      <SigmaDecayChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization only --
        no proof, no reduction below RH. p(N) is a local central-difference exponent on the exact
        imp-3220/imp-3406/imp-3463 sub-terms, not a derived closed form; it quantifies the roadmap's
        qualitative "monotone decay toward 0" claim but does not construct the missing imp-3066
        K_a &ge; 0 sign-positivity residual, which remains untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3564-power-iteration-closed-form" style={{ color: 'var(--series-5)' }}>
          Power-Iteration Budget Closed-Form Fit (imp-3564)
        </Link>
      </div>
    </div>
  );
}
