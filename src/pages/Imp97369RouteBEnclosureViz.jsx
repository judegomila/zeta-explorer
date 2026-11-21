import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { enclosureUpper, IMP97337_ENCLOSURE, IMP97337_VERDICT } from '../data/imp-97337-krein-routeb-certified-bessel-enclosure.js';
import { ED, alpha } from '../styles/tokens.js';

// imp-97369: first consumer of the imp-97337 certified Route B per-panel |g| enclosure.
// Panel 1 traces g(z) against the certified per-panel enclosure U(zL,zR) over a short
// window near the T-truncation rung. Panel 2 shows the true/enclosure ratio across all
// 572 certified panels (worst 0.9871). Panel 3 shows the Route C far-tail envelope
// |g(z)| z^4 <= C_far beyond Zfar. All three reuse only the exported certified primitives
// (enclosureUpper, sPoly/cPoly) -- no re-derivation of the enclosure math itself.
const { aRung: A, T, Zfar: ZFAR, sPoly: SPOLY, cPoly: CPOLY, routeCConstant: C_FAR, worstTrueOverUpper: WORST } =
  IMP97337_ENCLOSURE;

// exact assembled g(z) = (sin(z) S(z) + cos(z) C(z)) / z, from the certified sPoly/cPoly (imp-97337).
function gAssembled(z) {
  let S = 0;
  let C = 0;
  for (let m = 0; m < SPOLY.length; m++) {
    S += SPOLY[m] * Math.pow(z, -m);
    C += CPOLY[m] * Math.pow(z, -m);
  }
  return (Math.sin(z) * S + Math.cos(z) * C) / z;
}

function PanelEnclosure() {
  const svgW = 720;
  const svgH = 280;
  const padL = 52;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const zStart = T * A;
  const zSpan = 14; // a handful of panels, wide enough to see the step envelope
  const panelWidth = 0.7; // matches the imp-97337 panel size

  const nCurve = 400;
  const curvePts = [];
  for (let i = 0; i <= nCurve; i++) {
    const z = zStart + (i / nCurve) * zSpan;
    curvePts.push([z, Math.abs(gAssembled(z))]);
  }

  const panels = [];
  for (let z = zStart; z < zStart + zSpan; z += panelWidth) {
    panels.push([z, Math.min(z + panelWidth, zStart + zSpan)]);
  }

  const yVals = curvePts.map((p) => p[1]).concat(panels.map(([zL, zR]) => enclosureUpper(zL, zR)));
  const maxY = Math.max(...yVals) * 1.08;

  const xOf = (z) => padL + ((z - zStart) / zSpan) * plotW;
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill={alpha(ED.series1, 0.03)} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, maxY / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}
      {panels.map(([zL, zR]) => {
        const u = enclosureUpper(zL, zR);
        return (
          <line
            key={`pan${zL}`}
            x1={xOf(zL)}
            y1={yOf(u)}
            x2={xOf(zR)}
            y2={yOf(u)}
            stroke={ED.brassDeco}
            strokeWidth={2}
          />
        );
      })}
      <polyline
        points={curvePts.map(([z, v]) => `${xOf(z)},${yOf(v)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.6}
      />
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        z = a t near the T-truncation rung (blue = |g(z)|, gold steps = certified U(zL,zR) per panel)
      </text>
    </svg>
  );
}

function PanelRatioLadder() {
  const svgW = 720;
  const svgH = 220;
  const padL = 52;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const zStart = T * A;
  const zSpan = 400; // matches the imp-97337 certified panel range [T a, T a + 400]
  const panelWidth = 0.7;
  const nSample = 40;

  const ratios = [];
  for (let z = zStart; z < zStart + zSpan; z += panelWidth) {
    const zL = z;
    const zR = Math.min(z + panelWidth, zStart + zSpan);
    const U = enclosureUpper(zL, zR);
    let mx = 0;
    for (let i = 0; i <= nSample; i++) {
      mx = Math.max(mx, Math.abs(gAssembled(zL + (zR - zL) * (i / nSample))));
    }
    ratios.push(mx / U);
  }

  const minY = Math.min(...ratios, WORST) - 0.02;
  const maxY = 1.0;

  const xOf = (i) => padL + (i / (ratios.length - 1)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      {[minY, WORST, 1].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}
      <polyline
        points={ratios.map((r, i) => `${xOf(i)},${yOf(r)}`).join(' ')}
        fill="none"
        stroke={ED.series3}
        strokeWidth={1.6}
      />
      <line
        x1={padL}
        y1={yOf(WORST)}
        x2={padL + plotW}
        y2={yOf(WORST)}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + 6} y={yOf(WORST) - 4} fill={ED.series2} fontSize={8.5}>
        certified worst = {WORST.toFixed(4)}
      </text>
      <text x={padL + plotW / 2} y={padT + plotH + 20} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        panel index over z in [T a, T a + 400] ({IMP97337_ENCLOSURE.panelsChecked} panels): true sup / certified upper
      </text>
    </svg>
  );
}

function PanelRouteCFarTail() {
  const svgW = 720;
  const svgH = 220;
  const padL = 52;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const zStart = ZFAR;
  const zSpan = 6000;
  const n = 300;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const z = zStart + (i / n) * zSpan;
    pts.push([z, Math.abs(gAssembled(z)) * Math.pow(z, 4)]);
  }
  const maxY = Math.max(C_FAR, ...pts.map((p) => p[1])) * 1.08;

  const xOf = (z) => padL + ((z - zStart) / zSpan) * plotW;
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, maxY / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(0)}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(C_FAR)}
        x2={padL + plotW}
        y2={yOf(C_FAR)}
        stroke={ED.brassDeco}
        strokeWidth={1.4}
        strokeDasharray="4 3"
      />
      <text x={padL + 6} y={yOf(C_FAR) - 4} fill={ED.brass} fontSize={8.5}>
        C_far = {C_FAR.toFixed(1)}
      </text>
      <polyline
        points={pts.map(([z, v]) => `${xOf(z)},${yOf(v)}`).join(' ')}
        fill="none"
        stroke={ED.series7}
        strokeWidth={1.6}
      />
      <text x={padL + plotW / 2} y={padT + plotH + 20} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        z &ge; Zfar = a Tfar: |g(z)| z&#8308; (pink) stays under the closed-form constant C_far (gold)
      </text>
    </svg>
  );
}

export default function Imp97369RouteBEnclosureViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Krein Route B: Certified Per-Panel |g| Enclosure + Route C Far-Tail" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> derivation/execution only.
        No bound on Lambda moves; no operator positivity established; interval-rigorous reach
        stays 2a&le;{IMP97337_VERDICT.intervalRigorousReachUnchanged}; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        g(t) = v0&middot;&Phi;(t) is bounded per panel [zL, zR] (z = a t) by the certified,
        interval-Bessel-library-free enclosure U(zL, zR) = (sinSup&middot;Sbar(zL) +
        cosSup&middot;Cbar(zL)) / zL, built from the exact-integer assembled polynomials S(z),
        C(z) (imp-97337, imp-97263). The enclosure brackets the exact g at every one of{' '}
        {IMP97337_ENCLOSURE.panelsChecked} panels, worst (true sup)/(enclosure) ={' '}
        {WORST.toFixed(4)}.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        |g(z)| against the certified step enclosure, near the T-truncation rung
      </h3>
      <PanelEnclosure />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        True/enclosure ratio across all {IMP97337_ENCLOSURE.panelsChecked} certified panels
      </h3>
      <PanelRatioLadder />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Route C far-tail majorant: |g(z)| z&#8308; &le; C_far beyond Zfar
      </h3>
      <PanelRouteCFarTail />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> panel 1 shows the
        certified step enclosure (gold) always sitting above the oscillating |g(z)| (blue) it
        brackets. Panel 2 shows the true/enclosure ratio staying in (0.9, 1) across all panels,
        never touching or exceeding the dashed 1.0 line -- a valid, tight (~1.3% conservative)
        replacement for the imp-97184 sampled subgrid sup. Panel 3 shows the closed-form Route C
        constant (gold, no Bessel evaluation) dominating the measured |g(z)| z&#8308; envelope for
        all z beyond Zfar.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-97337 certified enclosure and Route C constant verbatim (via the exported
        enclosureUpper primitive and sPoly/cPoly); no re-derivation of the bounding argument, no
        new numerics. Residuals R1 (actual ground-state v0) and R2 (full sigma_2-weighted
        majorant) stay open (imp-97337).
      </div>
    </div>
  );
}
