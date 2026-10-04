import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3586_CROSSINGS,
  IMP3586_DROP_PROFILE,
  IMP3586_PEAK,
  IMP3586_LOGISTIC_CAP,
  IMP3586_CROSSOVER,
} from '../data/imp-3586-sigma-crossing-logistic-drop-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = { curve: ED.series3, threshold: ED.series5, drop: ED.series1, peak: ED.series7, cap: ED.series4, crossover: ED.series4 };

const LOG10N_MIN = 7.0;
const LOG10N_MAX = 14.5;

function SigmaCrossingsChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = Math.log10(0.003);
  const yMax = Math.log10(1);

  const xS = (log10N) => padL + ((log10N - LOG10N_MIN) / (LOG10N_MAX - LOG10N_MIN)) * cW;
  const yS = (s) => padT + cH * (1 - (Math.log10(s) - yMin) / (yMax - yMin));

  const curvePath = IMP3586_DROP_PROFILE.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.log10N).toFixed(1) + ',' + yS(r.sigma).toFixed(2)).join(' ');

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

      {IMP3586_CROSSINGS.map((c) => (
        <line
          key={'v' + c.sigma_below}
          x1={xS(c.log10N)}
          y1={padT}
          x2={xS(c.log10N)}
          y2={padT + cH}
          stroke={COLORS.threshold}
          strokeWidth={0.8}
          strokeDasharray="2,3"
          opacity={0.6}
        />
      ))}

      <path d={curvePath} fill="none" stroke={COLORS.curve} strokeWidth={2} />

      {IMP3586_CROSSINGS.map((c) => (
        <circle key={c.sigma_below} cx={xS(c.log10N)} cy={yS(c.sigma_below)} r={4} fill={COLORS.threshold} stroke={ED.paper} strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3586_CROSSINGS.map((c) => (
        <g key={'x' + c.sigma_below}>
          <line x1={xS(c.log10N)} y1={padT + cH} x2={xS(c.log10N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text
            x={xS(c.log10N)}
            y={padT + cH + 16}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={7.5}
            transform={'rotate(-40,' + xS(c.log10N) + ',' + (padT + cH + 16) + ')'}
          >
            {c.log10N.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 40} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 N at threshold crossing
      </text>

      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}>
        sigma(N) (log scale)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.curve} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series3}>sigma(N) post-peak curve</text>
        <circle cx={padL + 6} cy={padT + 26} r={4} fill={COLORS.threshold} />
        <text x={padL + 14} y={padT + 29} fill={ED.series5}>root-solved crossings (0.9, 0.75, 0.5, 0.25, 0.1, 0.01)</text>
      </g>
    </svg>
  );
}

function LogisticDropChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = 0;
  const yMax = 0.32;

  const xS = (log10N) => padL + ((log10N - LOG10N_MIN) / (LOG10N_MAX - LOG10N_MIN)) * cW;
  const yS = (d) => padT + cH * (1 - (d - yMin) / (yMax - yMin));

  const curvePath = IMP3586_DROP_PROFILE.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.log10N).toFixed(1) + ',' + yS(r.drop).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 0.1, 0.2, 0.3].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP3586_LOGISTIC_CAP)} x2={padL + cW} y2={yS(IMP3586_LOGISTIC_CAP)} stroke={COLORS.cap} strokeWidth={1.4} strokeDasharray="5,3" />
      <text x={padL + cW - 4} y={yS(IMP3586_LOGISTIC_CAP) - 6} textAnchor="end" fill={ED.brass} fontSize={9}>
        untrimmed logistic cap ln10/8 = {IMP3586_LOGISTIC_CAP.toFixed(5)}
      </text>

      <line x1={xS(IMP3586_CROSSOVER.log10N_sigma_half)} y1={padT} x2={xS(IMP3586_CROSSOVER.log10N_sigma_half)} y2={padT + cH} stroke={COLORS.crossover} strokeWidth={1} strokeDasharray="3,3" />
      <text x={xS(IMP3586_CROSSOVER.log10N_sigma_half) + 4} y={padT + 12} fill={ED.brass} fontSize={8.5}>
        E_coll=E_trunc crossover
      </text>

      <path d={curvePath} fill="none" stroke={COLORS.drop} strokeWidth={2} />

      {IMP3586_DROP_PROFILE.map((r) => (
        <circle key={r.log10N} cx={xS(r.log10N)} cy={yS(r.drop)} r={2} fill={COLORS.drop} />
      ))}

      <circle cx={xS(IMP3586_PEAK.log10N)} cy={yS(IMP3586_PEAK.drop)} r={5.5} fill="none" stroke={COLORS.peak} strokeWidth={2} />
      <text x={xS(IMP3586_PEAK.log10N) + 6} y={yS(IMP3586_PEAK.drop) - 8} fill={ED.series7} fontSize={9}>
        peak {IMP3586_PEAK.drop.toFixed(4)}/decade, sigma&asymp;{IMP3586_PEAK.sigma.toFixed(4)}
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[7, 8, 9, 10, 11, 12, 13, 14].map((v) => (
        <g key={'x' + v}>
          <line x1={xS(v)} y1={padT + cH} x2={xS(v)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 N
      </text>

      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}>
        -d sigma / d log10 N
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.drop} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series1}>logistic sigma-drop profile</text>
      </g>
    </svg>
  );
}

export default function Imp3586SigmaCrossingLogisticDropViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Crossings and Logistic Drop Profile (imp-3556 / imp-3586)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-3556 root-solved post-peak crossings (residual &lt; 1e-9) mark where the
        conditional share sigma(N) = E_coll/E(N) falls below 0.9, 0.75, 0.5, 0.25, 0.1, and
        0.01, spanning log10 N &asymp; {IMP3586_CROSSINGS[0].log10N.toFixed(2)} to{' '}
        {IMP3586_CROSSINGS[IMP3586_CROSSINGS.length - 1].log10N.toFixed(2)}. The sigma-drop rate
        -d sigma/d log10 N is not a constant: it is a logistic-in-ln N bump that PEAKS at{' '}
        {IMP3586_PEAK.drop.toFixed(4)}/decade right at the imp-3444 E_coll = E_trunc crossover
        (sigma &asymp; {IMP3586_PEAK.sigma.toFixed(4)}), staying under the untrimmed logistic
        cap ln(10)/8 = {IMP3586_LOGISTIC_CAP.toFixed(5)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        sigma(N) post-peak curve with the six root-solved threshold crossings
      </p>
      <SigmaCrossingsChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Logistic sigma-drop profile -d sigma/d log10 N, peak and ln10/8 cap marked
      </p>
      <LogisticDropChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. The crossings are certified roots on the exact
        imp-3220/imp-3406/imp-3463 sub-terms, and the drop profile is a central-difference
        reading of the same sigma(N), not a fresh derivation. The imp-3066 K_a &ge; 0
        sign-positivity residual remains untouched.
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
