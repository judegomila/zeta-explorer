import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3613_XI_MAX,
  IMP3613_XI_PEAK_MAX,
  IMP3613_XI_STAR,
  IMP3613_N_REPLICA,
  IMP3613_N_COLOCATE,
  IMP3613_N_STAR_FLOOR,
  IMP3613_LINES_ZOOM,
  IMP3613_LINE_WIDE,
  IMP3613_LADDER,
} from '../data/imp-3613-replica-fold-in-geometry-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

const LINE_COLORS = { xiMax: ED.series2, xiPeakMax: ED.series4, xiStar: ED.series1 };
const BAND_FILL = alpha(ED.series3, 0.08);
const WIDE_COLOR = ED.series2;
const RUNG_COLOR = ED.series3;

function ZoomChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const nMin = 0;
  const nMax = 1000;
  const lMin = -400;
  const lMax = 700;

  const xS = (N) => padL + ((N - nMin) / (nMax - nMin)) * cW;
  const yS = (L) => padT + cH * (1 - (L - lMin) / (lMax - lMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {/* Observable band (0, xi_max] shaded */}
      <rect x={padL} y={yS(IMP3613_XI_MAX)} width={cW} height={yS(0) - yS(IMP3613_XI_MAX)} fill={BAND_FILL} />

      {[-400, -200, 0, 200, 400, 600].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* xi_max ceiling line */}
      <line x1={padL} y1={yS(IMP3613_XI_MAX)} x2={padL + cW} y2={yS(IMP3613_XI_MAX)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,2" />

      {IMP3613_LINES_ZOOM.map((line) => {
        const d = line.points.map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.N).toFixed(1) + ',' + yS(p.L).toFixed(1)).join(' ');
        const crossN = Math.min(line.crossingN, nMax);
        return (
          <g key={line.key}>
            <path d={d} fill="none" stroke={LINE_COLORS[line.key]} strokeWidth={2} />
            {line.crossingN <= nMax && (
              <>
                <line x1={xS(crossN)} y1={padT} x2={xS(crossN)} y2={padT + cH} stroke={LINE_COLORS[line.key]} strokeWidth={1} strokeDasharray="4,3" opacity={0.7} />
                <circle cx={xS(crossN)} cy={yS(IMP3613_XI_MAX)} r={3.2} fill={LINE_COLORS[line.key]} />
              </>
            )}
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[0, 200, 394, 688, 764, 1000].map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        grid size N
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        replica location L = 2 xi_Nyq - xi_true
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={LINE_COLORS.xiMax} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series2}>xi_true=400: crosses ceiling at N_replica=764</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={LINE_COLORS.xiPeakMax} strokeWidth={2} />
        <text x={padL + 14} y={padT + 29} fill={ED.brass}>xi_true=320.01: crosses at N_colocate=688</text>
        <line x1={padL + 2} y1={padT + 40} x2={padL + 10} y2={padT + 40} stroke={LINE_COLORS.xiStar} strokeWidth={2} />
        <text x={padL + 14} y={padT + 43} fill={ED.series1}>xi_true=xi_star=12.087: crosses at N~394</text>
      </g>
    </svg>
  );
}

function WideChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const logNMin = Math.log10(100);
  const logNMax = Math.log10(9600);
  const lMin = 0;
  const lMax = 10000;

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (L) => padT + cH * (1 - (L - lMin) / (lMax - lMin));

  const d = IMP3613_LINE_WIDE.map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.N).toFixed(1) + ',' + yS(p.L).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <rect x={padL} y={yS(IMP3613_XI_MAX)} width={cW} height={yS(0) - yS(IMP3613_XI_MAX)} fill={BAND_FILL} />

      {[0, 400, 2000, 4000, 6000, 8000, 10000].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP3613_XI_MAX)} x2={padL + cW} y2={yS(IMP3613_XI_MAX)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,2" />
      <path d={d} fill="none" stroke={WIDE_COLOR} strokeWidth={2} />

      {IMP3613_LADDER.map((r) => (
        <circle key={r.N} cx={xS(r.N)} cy={yS(r.L)} r={4} fill={RUNG_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[100, 764, 1200, 2400, 4800, 9600].map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        grid size N (log scale)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        L(400, N)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={WIDE_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series2}>band-top replica location, extended to N=9600</text>
        <circle cx={padL + 6} cy={padT + 26} r={3.6} fill={RUNG_COLOR} />
        <text x={padL + 14} y={padT + 29} fill={ED.series3}>imp-3558 rungs (all replica-free, L &gt;&gt; 400)</text>
      </g>
    </svg>
  );
}

export default function Imp3613ReplicaFoldInGeometryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Aliasing Fold-In Geometry (imp-3582 / imp-3613)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Midpoint quadrature with N panels on [0, U] samples at Nyquist frequency
        xi_Nyq = pi N/U; a genuine spectral source at xi_true produces its first
        positive-baseband aliasing replica at L(xi_true, N) = 2 xi_Nyq - xi_true.
        The replica is only observable if it folds back into the scanned band
        (0, {IMP3613_XI_MAX}]. Since L grows with N, each source's replica
        eventually crosses the ceiling and leaves the band for good -- the
        crossing point is that source's fold-in floor. The loosest floor uses
        the band-top source xi_true={IMP3613_XI_MAX} (N_replica=
        {IMP3613_N_REPLICA}); the largest genuine peak xi_true~
        {IMP3613_XI_PEAK_MAX} tightens it to N_colocate={IMP3613_N_COLOCATE};
        the maximizer itself xi_true=xi_star~{IMP3613_XI_STAR} tightens it
        further to N~{IMP3613_N_STAR_FLOOR.toFixed(1)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Zoomed view: three fold-in floors, N in [0, 1000]
      </p>
      <ZoomChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Wide view: band-top replica location extended to the imp-3558 ladder, N in {'{'}1200, 2400, 4800, 9600{'}'}
      </p>
      <WideChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the
        shaded band is the scanned window (0, 400]. All three replica-location
        lines climb with N and cross the band ceiling at N=394, 688, and 764 in
        that order, so N &gt; 764 (the largest crossing) certifies every
        scenario has already folded out of the band. Every imp-3558 rung sits
        far to the right of 764 -- the smallest, N=1200, already has a
        band-top replica location of {IMP3613_LADDER[0].L.toFixed(0)}, more
        than double the {IMP3613_XI_MAX} ceiling -- so the band is provably
        replica-free at all four rungs.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong>{' '}
        derivation/certification only -- this supplies the analytic aliasing
        floor for the imp-3558 argmax-drift-0 discriminator; it does NOT give
        xi* or the sup a closed form (the imp-3470 stationarity equation stays
        transcendental) and does not extend the finite-domain (0, 400]
        measurement. RH-equivalent, necessary-but-not-sufficient; the imp-3066
        K_a &ge; 0 positivity remains the lone obstruction, untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3611-skew-toeplitz-krylov-gap-ladder" style={{ color: 'var(--series-5)' }}>
          Corrected-Krylov Skew-Toeplitz Gap Ladder (imp-3611)
        </Link>
      </div>
    </div>
  );
}
