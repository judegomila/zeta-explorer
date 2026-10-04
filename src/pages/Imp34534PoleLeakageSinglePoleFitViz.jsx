import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS } from '../data/imp-34512-pole-leakage-fit-15-20-percent-crossings.js';
import { ED } from '../styles/tokens.js';

const {
  poleLocation,
  poleExponentWide,
  poleExponentMid,
  poleExponentNear,
  kStarFitWindow,
  kStarFitNear,
  kStarFitClosest,
} = IMP34512_POLE_LEAKAGE_FIT_15_20_PERCENT_CROSSINGS;

const WINDOWS = [
  { label: '[18.5, 20.9]', exponent: poleExponentWide, kStarFit: kStarFitWindow },
  { label: '[20.0, 21.1]', exponent: poleExponentMid, kStarFit: kStarFitNear },
  { label: '[20.8, 21.2]', exponent: poleExponentNear, kStarFit: kStarFitClosest },
];

// Two side-by-side bar panels: the effective pole exponent collapsing toward 1, and the
// recovered pole climbing toward the inherited k* as the fit window tightens onto it.
function FitConvergenceChart() {
  const svgW = 640;
  const svgH = 300;
  const padT = 24;
  const padB = 46;
  const panelW = 280;
  const gap = 40;
  const barW = 46;

  const expMin = 0.9;
  const expMax = 2.3;
  const expH = svgH - padT - padB;
  const yExp = (v) => padT + expH - ((v - expMin) / (expMax - expMin)) * expH;

  const kMin = 19.5;
  const kMax = 21.5;
  const yK = (v) => padT + expH - ((v - kMin) / (kMax - kMin)) * expH;

  const panel1X0 = 50;
  const panel2X0 = panel1X0 + panelW + gap;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* Panel 1: effective exponent */}
      <line x1={panel1X0} y1={padT} x2={panel1X0} y2={padT + expH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={panel1X0}
        y1={padT + expH}
        x2={panel1X0 + panelW}
        y2={padT + expH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />
      <line
        x1={panel1X0}
        y1={yExp(1)}
        x2={panel1X0 + panelW}
        y2={yExp(1)}
        stroke={ED.series7}
        strokeWidth={1.5}
        strokeDasharray="5,4"
        opacity={0.85}
      />
      <text x={panel1X0 + panelW - 4} y={yExp(1) - 4} textAnchor="end" fill={ED.series7} fontSize={9}>
        order-1 (simple pole)
      </text>
      {WINDOWS.map((w, i) => {
        const x = panel1X0 + 20 + i * ((panelW - 40) / (WINDOWS.length - 1)) - barW / 2;
        const y = yExp(w.exponent);
        return (
          <g key={'exp' + w.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={padT + expH - y}
              fill={ED.series1}
              opacity={0.7}
              rx={2}
            />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={ED.ink} fontSize={10} fontFamily="monospace">
              {w.exponent.toFixed(2)}
            </text>
            <text
              x={x + barW / 2}
              y={padT + expH + 14}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={8}
            >
              {w.label}
            </text>
          </g>
        );
      })}
      <text x={panel1X0 + panelW / 2} y={padT + expH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        effective exponent p
      </text>

      {/* Panel 2: recovered pole */}
      <line x1={panel2X0} y1={padT} x2={panel2X0} y2={padT + expH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={panel2X0}
        y1={padT + expH}
        x2={panel2X0 + panelW}
        y2={padT + expH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />
      <line
        x1={panel2X0}
        y1={yK(poleLocation)}
        x2={panel2X0 + panelW}
        y2={yK(poleLocation)}
        stroke={ED.series7}
        strokeWidth={1.5}
        strokeDasharray="5,4"
        opacity={0.85}
      />
      <text x={panel2X0 + panelW - 4} y={yK(poleLocation) - 4} textAnchor="end" fill={ED.series7} fontSize={9}>
        k* = {poleLocation.toFixed(5)}
      </text>
      {WINDOWS.map((w, i) => {
        const x = panel2X0 + 20 + i * ((panelW - 40) / (WINDOWS.length - 1)) - barW / 2;
        const y = yK(w.kStarFit);
        return (
          <g key={'k' + w.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={padT + expH - y}
              fill={ED.series5}
              opacity={0.7}
              rx={2}
            />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={ED.ink} fontSize={10} fontFamily="monospace">
              {w.kStarFit.toFixed(2)}
            </text>
            <text
              x={x + barW / 2}
              y={padT + expH + 14}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={8}
            >
              {w.label}
            </text>
          </g>
        );
      })}
      <text x={panel2X0 + panelW / 2} y={padT + expH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        recovered 1/leak-root pole k*_fit
      </text>
    </svg>
  );
}

export default function Imp34534PoleLeakageSinglePoleFitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pole-Leakage Single-Pole Fit: Exponent Collapse and Pole Recovery (imp-34534)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34512 fit the imp-34247 pole-leakage metric leak(k) = 100 |dy/dk(k) &minus; P| / |P| to
        the single simple-pole form A/(k* &minus; k) + P over three progressively tighter windows
        approaching the imp-34023 pole k* &asymp; {poleLocation.toFixed(5)}. Over the widest measured
        window the effective local exponent p in leak &sim; (k* &minus; k)^(&minus;p) is
        &asymp; {poleExponentWide.toFixed(2)} &mdash; steeper than a first-order pole &mdash; and a
        naive 1/leak-root pole estimate undershoots to k*_fit &asymp; {kStarFitWindow.toFixed(2)}. As
        the window tightens onto k*, the exponent collapses toward 1 and the recovered pole climbs
        toward the inherited {poleLocation.toFixed(5)}, confirming the singularity is a genuine simple
        pole and its asymptotic driver.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        effective exponent collapsing to 1, and recovered pole climbing to k*, as the fit window tightens
      </p>
      <FitConvergenceChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>Fit window</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>Effective exponent p</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>Recovered k*_fit</th>
          </tr>
        </thead>
        <tbody>
          {WINDOWS.map((w) => (
            <tr key={w.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{w.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{w.exponent.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{w.kStarFit.toFixed(5)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The single-pole form A/(k* &minus; k) + P is only the ASYMPTOTIC (k &rarr; k*) statement, not
        a global fit of the pre-pole window &mdash; the wide window's exponent &asymp;{' '}
        {poleExponentWide.toFixed(2)} and undershooting pole estimate are pre-asymptotic artifacts that
        resolve as the window narrows.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement / threshold-location +
        fit only. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic; the residExp simple-zero structure is a numerical/structural observation, not a
        derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
        operator positivity; imp-3066 K_a &ge; 0 untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
