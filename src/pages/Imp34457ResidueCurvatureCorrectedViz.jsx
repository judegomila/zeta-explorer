import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34457_RUNGS,
  IMP34457_RESIDUE_COMPARISON,
  IMP34457_RESIDUE_REL_SHIFT,
} from '../data/imp-34457-residue-curvature-corrected-viz-data.js';
import { ED } from '../styles/tokens.js';

// Bar chart: the two competing residue reads (linear secant vs curvature-corrected quadratic),
// both negative, the quadratic read smaller in magnitude (tightened toward zero).
function ResidueComparisonBars() {
  const svgW = 640;
  const svgH = 260;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 60;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const { linear, quadratic } = IMP34457_RESIDUE_COMPARISON;
  const rows = [linear, quadratic];

  const yMin = -2.2e-8;
  const yMax = 0;
  const yAt = (v) => padT + ((v - yMax) / (yMin - yMax)) * cH;

  const n = rows.length;
  const slot = cW / n;
  const barW = slot * 0.4;

  const yTicks = [0, -0.5e-8, -1.0e-8, -1.5e-8, -2.0e-8];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}

      {rows.map((r, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        // The residues are negative, so the bar hangs from the zero line down to yAt(residue).
        // Use min/abs so the SVG rect y/height are valid for either sign (a raw bottom-top went
        // negative for negative residues, which SVG rejects).
        const yZero = yAt(0);
        const yVal = yAt(r.residue);
        const rectY = Math.min(yZero, yVal);
        const rectH = Math.abs(yVal - yZero);
        const isQuadratic = i === 1;
        return (
          <g key={r.label}>
            <rect
              x={x}
              y={rectY}
              width={barW}
              height={rectH}
              fill={isQuadratic ? ED.series3 : ED.series7}
              stroke={ED.paper}
              strokeWidth={0.75}
            />
            <text x={xCenter} y={rectY - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
              {r.residue.toExponential(4)}
            </text>
            <text x={xCenter} y={padT + cH + 18} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Line chart: the 3 baked resid_exp rungs (k=21.0/21.25/21.5), highlighting the k=21.0 rung
// that the linear secant never used but the quadratic fit needs to fix the curvature.
function RungResidExpLine() {
  const svgW = 640;
  const svgH = 260;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 21.0;
  const xMax = 21.5;
  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;

  const yMin = -6e-8;
  const yMax = 10e-8;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const yTicks = [-5e-8, 0, 5e-8, 10e-8];

  const points = IMP34457_RUNGS.map((r) => `${xAt(r.k)},${yAt(r.residExp)}`).join(' ');
  const kStar = IMP34457_RESIDUE_COMPARISON.kStar;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}

      <line
        x1={xAt(kStar)}
        y1={padT}
        x2={xAt(kStar)}
        y2={padT + cH}
        stroke={ED.series7}
        strokeWidth={1.25}
        strokeDasharray="5,4"
      />
      <text x={xAt(kStar) + 4} y={padT + 10} fill={ED.series7} fontSize={9.5}>
        k* &asymp; {kStar}
      </text>

      <polyline points={points} fill="none" stroke={ED.series1} strokeWidth={2} />

      {IMP34457_RUNGS.map((r) => (
        <g key={r.k}>
          <circle
            cx={xAt(r.k)}
            cy={yAt(r.residExp)}
            r={5}
            fill={r.usedByLinearSecant ? ED.series1 : ED.series3}
            stroke={ED.paper}
            strokeWidth={1}
          />
          <text
            x={xAt(r.k)}
            y={yAt(r.residExp) - 10}
            textAnchor="middle"
            fill={ED.inkSoft}
            fontSize={9}
            fontFamily="monospace"
          >
            {r.residExp.toExponential(3)}
          </text>
          <text x={xAt(r.k)} y={padT + cH + 18} textAnchor="middle" fill={ED.ink} fontSize={9.5} fontFamily="monospace">
            k={r.k}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp34457ResidueCurvatureCorrectedViz() {
  const { linear, quadratic } = IMP34457_RESIDUE_COMPARISON;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Curvature-Corrected Residue Re-Read (imp-34397)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34310 measured the eflow_over_resid pole residue at k*&asymp;21.28095 using a 2-point
        linear secant over the outer pair of imp-34237 rungs (k=21.25, 21.5), giving R&asymp;
        {linear.residue.toExponential(4)}. imp-34397 brought in the third, unused k=21.0 rung to
        fit a quadratic and evaluate the local slope AT k* instead of averaging it over the wide
        secant span &mdash; tightening the residue to R&asymp;{quadratic.residue.toExponential(4)},
        a {(IMP34457_RESIDUE_REL_SHIFT.relShift * 100).toFixed(2)}% inward shift.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The three baked resid_exp rungs &mdash; green marks the k=21.0 rung the linear secant
        never used
      </p>
      <RungResidExpLine />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Residue comparison: linear secant (pink) vs curvature-corrected quadratic (green) &mdash;
        both negative, quadratic smaller in magnitude
      </p>
      <ResidueComparisonBars />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>read</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>slope at k*</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residue</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>k-zero</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>k-zero gap from k*</th>
          </tr>
        </thead>
        <tbody>
          {[linear, quadratic].map((row) => (
            <tr key={row.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.slopeAtKStar.toExponential(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.residue.toExponential(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.kZero.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.kZeroGap.toExponential(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> the quadratic fit through all
        three rungs recovers a local slope at k* that is steeper than the wide secant, tightening
        the residue by {Math.abs(IMP34457_RESIDUE_REL_SHIFT.relShift * 100).toFixed(2)}% and
        independently recovering k* to a gap {IMP34457_RESIDUE_REL_SHIFT.kZeroGapTighteningFactor.toFixed(1)}x
        smaller than the linear secant zero &mdash; corroborating both the pole location and the
        direction of the curvature correction.
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
        reproducing the imp-34310/imp-34397 measurements; no new derivation, no bound changed.
        Surrogate diagnostic, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486
        UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
