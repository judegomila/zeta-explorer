import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34383_NARROW_WIDTH_SWEEP,
  IMP34383_OFFSET_SWEEP,
  IMP34383_WIDE_DOMAIN_SWEEP,
  IMP34383_NUM_CONFIGS,
  IMP34383_NUM_UNDERCOUNT_ZERO,
} from '../data/imp-34383-d2-signchange-grid-viz-data.js';
import { ED } from '../styles/tokens.js';

// Narrow-domain [1e9,1e11] width sweep: signChanges (0 or 1) vs bracket width W. The two coarsest
// widths (0.4, 0.5) drop to zero -- too few sub-brackets to resolve the D2 curvature -- highlighted
// in amber; every finer width resolves exactly one crossing (sky blue).
function WidthSweepChart() {
  const svgW = 680;
  const svgH = 200;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const widths = IMP34383_NARROW_WIDTH_SWEEP.map((r) => r.widthDecades);
  const minX = 0;
  const maxX = 0.55;
  const xAt = (x) => padL + (x / maxX) * cW;
  const yAt = (y) => padT + cH - y * cH;

  const xTicks = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[0, 1].map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((w) => (
        <g key={'x' + w}>
          <line x1={xAt(w)} y1={padT + cH - 4} x2={xAt(w)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(w)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {w}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        bracket width W (decades)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        D2 sign changes
      </text>

      {widths.map((w, i) => {
        const s = IMP34383_NARROW_WIDTH_SWEEP[i].signChanges;
        return (
          <circle
            key={'pt' + w}
            cx={xAt(w)}
            cy={yAt(s)}
            r={s === 0 ? 5 : 3.5}
            fill={s === 0 ? ED.brassDeco : ED.series1}
            stroke={ED.paper}
            strokeWidth={0.75}
          />
        );
      })}
    </svg>
  );
}

export default function Imp34383D2SignChangeGridViz() {
  const undercountConfigs = [
    ...IMP34383_NARROW_WIDTH_SWEEP.filter((r) => r.signChanges === 0).map((r) => `W=${r.widthDecades}`),
    ...IMP34383_OFFSET_SWEEP.filter((r) => r.signChanges === 0).map(
      (r) => `W=${r.widthDecades}, offset=${r.offsetFraction}W`,
    ),
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="D2 Sign-Change Grid: Uniqueness Robustness Across 39 Configurations (imp-34383 / imp-34291)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 740 }}>
        imp-33701 read the sigma(N) local-exponent ramp as a single sigmoid knee: its discrete
        second difference D2 changes sign exactly once. imp-33721 pinned the knee's LOCATION and
        showed it is robust across a handful of bracket widths, but never tested whether the
        UNIQUENESS of the crossing survives a wider net. imp-34291 counted D2 sign changes across
        {' '}{IMP34383_NUM_CONFIGS} configurations -- an 11-width sweep, a 16-config width/offset
        sweep, and a 12-config wider-domain sweep -- and found the count NEVER exceeds 1 anywhere.
        The only failure mode is under-resolution: {IMP34383_NUM_UNDERCOUNT_ZERO} of the coarsest
        narrow-domain configs drop to ZERO sign changes (too few sub-brackets to resolve the
        curvature), never to two.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Narrow-domain [1e9,1e11] width sweep -- signChanges vs. bracket width W (amber = under-resolved to zero)
      </p>
      <WidthSweepChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Coarse narrow-domain under-count, never over-count:</strong>{' '}
        the configurations that drop to zero are {undercountConfigs.join('; ')}. Widening the domain
        to [1e8,1e12] or [1e8.5,1e11.5] lets every one of these coarse widths (up to W=0.5) resolve
        enough sub-brackets to recover exactly one crossing -- all {IMP34383_WIDE_DOMAIN_SWEEP.length}
        {' '}wider-domain configurations land on signChanges=1, confirming the zeros were pure
        under-resolution, not a genuine absence of the knee.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34291 measurement; no new derivation, no bound changed. Robustness
        diagnostic, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
        K_a&ge;0 untouched; NO QED. The coarse
        narrow-domain configs that read zero sign changes are under-resolved, not a second
        knee-free zone or evidence of anything structural -- never read a zero count as license to
        fabricate a spurious second knee; every config in this sweep caps at signChanges&le;1.
      </div>
    </div>
  );
}
