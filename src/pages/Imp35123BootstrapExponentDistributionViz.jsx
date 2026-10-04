import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE } from '../data/imp-34994-cmb-exponent-bootstrap-jackknife.js';
import { ED } from '../styles/tokens.js';

const D = IMP34994_CMB_EXPONENT_BOOTSTRAP_JACKKNIFE;
const HIST = D.bootstrap.histogram;
const P_PINNED = D.pointEstimate.p_pinned;
const CI_LO = D.bootstrap.ci95_lo;
const CI_HI = D.bootstrap.ci95_hi;
const R_1P5 = 1.5;
const R_1P6 = 1.6;
const SIGMA_1P5 = D.cleanRationalRejection.sigma_from_1p5_bootstrap;
const SIGMA_1P6 = D.cleanRationalRejection.sigma_from_1p6_bootstrap;

// bin midpoints, used both for bar x-position and for the domain the two rationals sit outside of
const BIN_MIDS = Array.from({ length: HIST.bins }, (_, i) => (HIST.edges[i] + HIST.edges[i + 1]) / 2);
const MAX_COUNT = Math.max(...HIST.counts);

function BootstrapHistogram() {
  const svgW = 760;
  const svgH = 280;
  const padL = 48;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const domainLo = Math.min(HIST.edges[0], R_1P5) - 0.001;
  const domainHi = Math.max(HIST.edges[HIST.edges.length - 1], R_1P6) + 0.001;
  const xAt = (p) => padL + ((p - domainLo) / (domainHi - domainLo)) * cW;
  const yAt = (count) => padT + cH - (count / MAX_COUNT) * cH;
  const barW = Math.max(1, xAt(HIST.edges[1]) - xAt(HIST.edges[0]) - 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {HIST.counts.map((c, i) => (
        <rect
          key={i}
          x={xAt(HIST.edges[i])}
          y={yAt(c)}
          width={barW}
          height={padT + cH - yAt(c)}
          fill={ED.series1}
          opacity={0.75}
        />
      ))}

      {/* bootstrap 95% percentile CI band */}
      <rect
        x={xAt(CI_LO)}
        y={padT}
        width={Math.max(1, xAt(CI_HI) - xAt(CI_LO))}
        height={cH}
        fill={ED.series3}
        opacity={0.12}
      />
      <line x1={xAt(CI_LO)} y1={padT} x2={xAt(CI_LO)} y2={padT + cH} stroke={ED.series3} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={xAt(CI_HI)} y1={padT} x2={xAt(CI_HI)} y2={padT + cH} stroke={ED.series3} strokeWidth={1} strokeDasharray="3,3" />

      {/* pinned point estimate */}
      <line x1={xAt(P_PINNED)} y1={padT} x2={xAt(P_PINNED)} y2={padT + cH} stroke={ED.inkSoft} strokeWidth={1.5} />

      {/* clean rationals, both far outside the histogram body */}
      <line x1={xAt(R_1P5)} y1={padT} x2={xAt(R_1P5)} y2={padT + cH} stroke={ED.series2} strokeWidth={2} />
      <text x={xAt(R_1P5)} y={padT - 6} textAnchor="middle" fill={ED.series2} fontSize={11}>
        3/2 (~{SIGMA_1P5}sigma)
      </text>
      <line x1={xAt(R_1P6)} y1={padT} x2={xAt(R_1P6)} y2={padT + cH} stroke={ED.brassDeco} strokeWidth={2} />
      <text x={xAt(R_1P6)} y={padT - 6} textAnchor="middle" fill={ED.brass} fontSize={11}>
        8/5 (~{SIGMA_1P6}sigma)
      </text>

      {[domainLo, P_PINNED, domainHi].map((v, i) => (
        <text key={i} x={xAt(v)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v.toFixed(3)}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        bootstrap exponent p (4000 seeded-LCG resamples)
      </text>
    </svg>
  );
}

export default function Imp35123BootstrapExponentDistributionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Bootstrap Distribution of the Pinned Crossing-Strength Exponent p (imp-35123 / imp-34994)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 720 }}>
        imp-34994 resampled (with replacement, {D.bootstrap.resamples} deterministic seeded-LCG draws) the same
        21-point imp-34925 C_mb fit grid used by imp-34950 to fix the pinned power-law exponent p, giving a
        bootstrap distribution with mean {D.bootstrap.mean} and 95% percentile CI [{CI_LO}, {CI_HI}]. The
        histogram below is that distribution; the clean rationals 3/2 and 8/5 sit far off both tails, ~
        {SIGMA_1P5} and ~{SIGMA_1P6} bootstrap-SE sigma from the pinned point estimate p = {P_PINNED}.
      </p>

      <BootstrapHistogram />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.82rem', margin: '1rem 0 0' }}>
        Grey line: pinned point estimate p = {P_PINNED}. Green band: bootstrap 95% percentile CI [{CI_LO}, {CI_HI}].
        Red / amber lines: the clean rationals 3/2 and 8/5, both decisively outside the histogram body and the CI.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page plotting the imp-34994
        bootstrap resampling distribution (4000 seeded-LCG draws over the reused imp-34925 21-point C_mb grid);
        it changes no bound and does NOT discharge the GUE conditional (C_mb GUE-conditional per imp-486). The
        C_C 1/8 ansatz (imp-2642/imp-2643) is untouched, establishes no operator positivity, imp-3066 K_a &ge; 0
        untouched, and the far-tail exponent stays 1/2 (imp-3463). "p is non-rational" is a statement about the
        SURROGATE fit, not a structural or arithmetic fact. No RH verdict, NO QED.
      </div>
    </div>
  );
}
