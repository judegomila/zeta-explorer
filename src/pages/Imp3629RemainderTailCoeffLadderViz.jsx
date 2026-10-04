import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP3629_COEFF_LADDER } from '../data/imp-3629-remainder-tail-coeff-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const CN_COLOR = ED.series1;
const DN_COLOR = ED.series7;
const DEV_COLOR = ED.series3;

function CoeffLadderChart() {
  const svgW = 640;
  const padL = 70;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const ns = IMP3629_COEFF_LADDER.map((d) => d.n);
  const nMin = ns[0];
  const nMax = ns[ns.length - 1];
  const logYMin = Math.log10(5e-6);
  const logYMax = Math.log10(2e-3);

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));

  const cnPath = IMP3629_COEFF_LADDER.map(
    (d, i) => (i === 0 ? 'M' : 'L') + xS(d.n).toFixed(1) + ',' + yS(d.leadingCoeff).toFixed(2),
  ).join(' ');
  const dnPath = IMP3629_COEFF_LADDER.map(
    (d, i) => (i === 0 ? 'M' : 'L') + xS(d.n).toFixed(1) + ',' + yS(Math.abs(d.nextOrderCoeff)).toFixed(2),
  ).join(' ');
  const devPath = IMP3629_COEFF_LADDER.map(
    (d, i) => (i === 0 ? 'M' : 'L') + xS(d.n).toFixed(1) + ',' + yS(d.fittedExponentDev).toFixed(2),
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[5e-6, 1e-5, 5e-5, 1e-4, 5e-4, 1e-3, 2e-3].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <path d={cnPath} fill="none" stroke={CN_COLOR} strokeWidth={2} />
      {IMP3629_COEFF_LADDER.map((d) => (
        <circle key={'c' + d.n} cx={xS(d.n)} cy={yS(d.leadingCoeff)} r={2.8} fill={CN_COLOR} />
      ))}

      <path d={dnPath} fill="none" stroke={DN_COLOR} strokeWidth={1.6} strokeDasharray="4,3" />
      {IMP3629_COEFF_LADDER.map((d) => (
        <circle key={'d' + d.n} cx={xS(d.n)} cy={yS(Math.abs(d.nextOrderCoeff))} r={2.4} fill={DN_COLOR} />
      ))}

      <path d={devPath} fill="none" stroke={DEV_COLOR} strokeWidth={1.6} strokeDasharray="1,3" />
      {IMP3629_COEFF_LADDER.map((d) => (
        <circle key={'e' + d.n} cx={xS(d.n)} cy={yS(d.fittedExponentDev)} r={2.4} fill={DEV_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {ns.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            n={n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        rung n (parity alternates odd/even)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        magnitude (log scale)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={CN_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series1}>C_n = M_(n+2)/((n+1)(n+2)M_n) (leading coefficient)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={DN_COLOR} strokeWidth={1.6} strokeDasharray="4,2" />
        <text x={padL + 14} y={padT + 29} fill={ED.series7}>|D_n| (next-order coefficient, always negative)</text>
        <line x1={padL + 2} y1={padT + 40} x2={padL + 10} y2={padT + 40} stroke={DEV_COLOR} strokeWidth={1.6} strokeDasharray="1,2" />
        <text x={padL + 14} y={padT + 43} fill={ED.series3}>|p_fit - 2| (actual least-squares fit-bias deviation)</text>
      </g>
    </svg>
  );
}

export default function Imp3629RemainderTailCoeffLadderViz() {
  const first = IMP3629_COEFF_LADDER[0];
  const last = IMP3629_COEFF_LADDER[IMP3629_COEFF_LADDER.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Remainder-Tail Coefficient Ladder C_n / D_n (imp-3581 / imp-3600)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3581 derived the closed leading coefficient C_n = M_(n+2)/((n+1)(n+2)M_n) and next-order
        coefficient D_n for the moment-remainder tail exponent p=2 at rungs n=3 (odd sinh) and n=4
        (even cosh); imp-3600 extended the same closed forms to n=5,6. Across all four rungs, C_n
        falls monotonically from {first.leadingCoeff.toExponential(3)} at n={first.n} to{' '}
        {last.leadingCoeff.toExponential(3)} at n={last.n}, |D_n| falls alongside it, and the actual
        least-squares fit-bias |p_fit - 2| stays fully explained by the closed D_n cov(a^2,ln a)/var(ln a)
        law at every rung -- the tail exponent is EXACTLY 2 throughout, not just at n=3,4.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        C_n, |D_n|, and |p_fit - 2| across rungs n=3..6
      </p>
      <CoeffLadderChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the solid line is the closed
        leading coefficient C_n, confirmed independently by r_n(a)/a^2 -&gt; C_n at the deepest rung of
        each ladder; the dashed line is |D_n|, the next-order coefficient (always negative, so the
        fitted slope always reads slightly below 2); the dotted line is the actual measured
        |p_fit - 2|, which tracks no simple monotone law of its own because it depends on both D_n and
        the ladder-specific cov(a^2,ln a)/var(ln a) factor, but is reproduced by the closed bias law to
        ~1e-9 at every rung.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/derivation only --
        this certifies the decay ORDER (p=2) of a fixed-weight Taylor remainder across four rungs; it
        establishes NO operator positivity. RH-equivalent, necessary-but-not-sufficient; the imp-3066
        K_a &ge; 0 sign-positivity obstruction is UNTOUCHED. No RH verdict, no QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3612-fit-bias-depth-sweep" style={{ color: 'var(--series-5)' }}>
          Remainder-Tail Fit-Bias Depth Sweep (imp-3581 / imp-3612)
        </Link>
      </div>
    </div>
  );
}
