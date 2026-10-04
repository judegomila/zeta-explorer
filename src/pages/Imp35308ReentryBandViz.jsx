import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT } from '../data/imp-35243-reentry-band-surrogate-fidelity-assessment.js';
import { ED, alpha } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35243 data module; no new
// computation is performed here (viz/UX only).
const { demonstration_D1_floor_sensitivity: D1, demonstration_D2_extrapolation_gap: D2 } =
  IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT;

const REENTRY_EXP = D2.reentry_decades_above_verified + D2.pt_verified_height_log10;
const EXIT_EXP = D2.exit_decades_above_verified + D2.pt_verified_height_log10;

function BandVsVerifiedChart() {
  const svgW = 700;
  const padL = 40;
  const padR = 24;
  const padT = 44;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const rowH = 46;
  const svgH = padT + rowH * 2 + padB;

  const xMin = 0;
  const xMax = 40;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;

  const yPT = padT + rowH * 0.5;
  const yBand = padT + rowH * 1.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 20} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Reentry band [10^{D2.reentry_decades_above_verified.toFixed(1)}+{D2.pt_verified_height_log10.toFixed(2)},
        10^{EXIT_EXP.toFixed(2)}] vs the PT verified-zero height (log10 N axis)
      </text>

      <line x1={padL} y1={svgH - padB} x2={padL + plotW} y2={svgH - padB} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 10, 20, 30, 40].map((v) => (
        <g key={v}>
          <line x1={xOf(v)} y1={svgH - padB} x2={xOf(v)} y2={svgH - padB + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            10^{v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N (log10 scale)
      </text>

      {/* PT verified-height marker */}
      <circle cx={xOf(D2.pt_verified_height_log10)} cy={yPT} r={5} fill={ED.series3} />
      <text x={xOf(D2.pt_verified_height_log10)} y={yPT - 10} textAnchor="middle" fill={ED.series3} fontSize={9}>
        PT verified height ~10^{D2.pt_verified_height_log10.toFixed(2)}
      </text>

      {/* Reentry band */}
      <rect
        x={xOf(REENTRY_EXP)}
        y={yBand - 8}
        width={xOf(EXIT_EXP) - xOf(REENTRY_EXP)}
        height={16}
        fill={alpha(ED.series5, 0.35)}
        stroke={ED.series5}
        strokeWidth={1.5}
      />
      <text x={xOf(REENTRY_EXP)} y={yBand - 14} textAnchor="middle" fill={ED.series5} fontSize={9}>
        reentry 10^{REENTRY_EXP.toFixed(2)}
      </text>
      <text x={xOf(EXIT_EXP)} y={yBand + 26} textAnchor="middle" fill={ED.series5} fontSize={9}>
        exit 10^{EXIT_EXP.toFixed(2)}
      </text>

      {/* Gap annotation lines */}
      <line
        x1={xOf(D2.pt_verified_height_log10)}
        y1={(yPT + yBand) / 2}
        x2={xOf(REENTRY_EXP)}
        y2={(yPT + yBand) / 2}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <text x={(xOf(D2.pt_verified_height_log10) + xOf(REENTRY_EXP)) / 2} y={(yPT + yBand) / 2 - 6} textAnchor="middle" fill={ED.series2} fontSize={9}>
        ~{D2.reentry_decades_above_verified.toFixed(1)} decades
      </text>
    </svg>
  );
}

function FloorSlideChart() {
  const svgW = 700;
  const padL = 40;
  const padR = 24;
  const padT = 44;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const rowH = 40;
  const svgH = padT + rowH * 2 + padB;

  const xMin = 0;
  const xMax = 50;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;

  const bandWidth = EXIT_EXP - REENTRY_EXP;
  const shiftedStart = REENTRY_EXP + D1.decade_shift_per_floor_halving;

  const yBefore = padT + rowH * 0.5;
  const yAfter = padT + rowH * 1.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 20} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        D1: band position slides ~{D1.decade_shift_per_floor_halving.toFixed(2)} decades per factor-2 change in EPS_FP
      </text>

      <line x1={padL} y1={svgH - padB} x2={padL + plotW} y2={svgH - padB} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 10, 20, 30, 40, 50].map((v) => (
        <g key={v}>
          <line x1={xOf(v)} y1={svgH - padB} x2={xOf(v)} y2={svgH - padB + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            10^{v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N (log10 scale)
      </text>

      <rect x={xOf(REENTRY_EXP)} y={yBefore - 7} width={xOf(REENTRY_EXP + bandWidth) - xOf(REENTRY_EXP)} height={14} fill={alpha(ED.series5, 0.35)} stroke={ED.series5} strokeWidth={1.5} />
      <text x={xOf(REENTRY_EXP) - 6} y={yBefore + 4} textAnchor="end" fill={ED.series5} fontSize={9}>
        EPS_FP
      </text>

      <rect x={xOf(shiftedStart)} y={yAfter - 7} width={xOf(shiftedStart + bandWidth) - xOf(shiftedStart)} height={14} fill={alpha(ED.series2, 0.35)} stroke={ED.series2} strokeWidth={1.5} />
      <text x={xOf(shiftedStart) - 6} y={yAfter + 4} textAnchor="end" fill={ED.series2} fontSize={9}>
        EPS_FP/2
      </text>

      <line
        x1={xOf(REENTRY_EXP)}
        y1={(yBefore + yAfter) / 2}
        x2={xOf(shiftedStart)}
        y2={(yBefore + yAfter) / 2}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <text x={(xOf(REENTRY_EXP) + xOf(shiftedStart)) / 2} y={(yBefore + yAfter) / 2 - 6} textAnchor="middle" fill={ED.brass} fontSize={9}>
        {D1.decade_shift_per_floor_halving.toFixed(2)} decades
      </text>
    </svg>
  );
}

export default function Imp35308ReentryBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Iters-to-Floor Reentry Band vs Verified Height (imp-35308)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35243/imp-34997/imp-35111 iters-to-floor off-by-one reentry band sits at
        [10^{REENTRY_EXP.toFixed(2)}, 10^{EXIT_EXP.toFixed(2)}] on the N axis, roughly
        {' '}{D2.reentry_decades_above_verified.toFixed(1)}&ndash;{D2.exit_decades_above_verified.toFixed(1)} decades
        above the highest Platt&ndash;Trudgian verified-zero height (~10^{D2.pt_verified_height_log10.toFixed(2)})
        that binds &Lambda;&nbsp;&le;&nbsp;0.2. The second panel shows the imp-35243 D1 result: the
        band position itself slides by ~{D1.decade_shift_per_floor_halving.toFixed(2)} decades for every
        factor-2 change in the machine-epsilon agreement floor EPS_FP used to define it.
      </p>

      <BandVsVerifiedChart />
      <div style={{ marginTop: '1.75rem' }}>
        <FloorSlideChart />
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the
        imp-35243 baked demonstration_D1_floor_sensitivity / demonstration_D2_extrapolation_gap
        literals verbatim (no new computation). The reentry band is a SURROGATE feature
        ~15&ndash;25 decades above any verified datum, not established as a feature of the true
        collapse dynamic (imp-35243). The imp-35263 direct EPS_FP sweep CONFIRMS R1
        (floor-independence) is binding: the band slides &gt;10 decades per factor-2 change in the
        machine-epsilon representation constant EPS_FP, a floor-artifact absent from the true
        continuum. R1 / the imp-35243a surrogate-fidelity certificate stay OPEN; changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
