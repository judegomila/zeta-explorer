import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

// Theorem R1-T2 (imp-2608): uniform-lattice tie value Theta_K = K/(K+1)
// rises monotonically to 1 as K grows (K neighbours per side, spacing 1).
// Telescoping sum: E_K = 2 sum_{m=1}^K 1/(m(m+1)) = 2K/(K+1), g=1,
// Theta_K = E_K / 2 = K/(K+1).
// Consequence: no STATIC tie comparison can cap Theta_exc < 1.
function thetaK(K) { return K / (K + 1); }

// Compute the outer (seizing) pair Theta for the symmetric uniform K-lattice.
// Lattice: {-(K+1/2), ..., -3/2, -1/2, 1/2, ..., K+1/2}, unit spacing.
// Outer pair: (-3/2, -1/2), gap g=1.
function outerTheta(K) {
  const pts = [];
  for (let k = 0; k <= K; k++) {
    pts.push(-(k + 0.5));
    pts.push(k + 0.5);
  }
  const a = -1.5, b = -0.5;
  let E = 0;
  for (const x of pts) {
    if (Math.abs(x - a) < 1e-9 || Math.abs(x - b) < 1e-9) continue;
    E += 1 / ((a - x) * (b - x));
  }
  return 0.5 * E; // Theta = g^2 * E / 2, g = 1
}

const TABLE_K = [1, 2, 3, 4, 5, 6, 7, 8, 200];

// Warm editorial palette for the inline SVG (previously dark-theme hexes).
const COL = {
  central: 'var(--brass-dk)',
  outer: 'var(--green)',
  margin: 'var(--blue)',
  danger: 'var(--terra-dk)',
  axis: 'var(--ink-soft)',
  tick: 'var(--faint)',
  grid: 'var(--hairline)',
  title: 'var(--faint)',
  ink: 'var(--ink)',
};

function ObstructionChart() {
  const kMax = 12;
  const pts = useMemo(() => {
    const arr = [];
    for (let K = 1; K <= kMax; K++) {
      arr.push({ K, central: thetaK(K), outer: outerTheta(K) });
    }
    return arr;
  }, []);

  const svgW = 560, svgH = 260;
  const padL = 46, padR = 18, padT = 18, padB = 36;
  const cW = svgW - padL - padR, cH = svgH - padT - padB;
  const xScale = (K) => padL + ((K - 1) / (kMax - 1)) * cW;
  const yScale = (v) => padT + cH * (1 - v);

  const pathD = (arr, fn) =>
    arr.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(p.K).toFixed(2)},${yScale(fn(p)).toFixed(2)}`).join(' ');

  const centralPath = pathD(pts, (p) => p.central);
  const outerPath = pathD(pts, (p) => p.outer);

  // filled margin area
  const topLine = pts.map((p) => `${xScale(p.K).toFixed(2)},${yScale(p.central).toFixed(2)}`).join(' L');
  const botLine = [...pts].reverse().map((p) => `${xScale(p.K).toFixed(2)},${yScale(p.outer).toFixed(2)}`).join(' L');
  const marginArea = `M ${topLine} L ${botLine} Z`;

  const yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  const xTicks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* grid */}
      {yTicks.map((v) => (
        <line key={v} x1={padL} y1={yScale(v)} x2={svgW - padR} y2={yScale(v)}
          style={{ stroke: COL.grid, strokeWidth: 1 }} />
      ))}

      {/* Theta = 1 obstruction line */}
      <line x1={padL} y1={yScale(1)} x2={svgW - padR} y2={yScale(1)}
        style={{ stroke: COL.danger, strokeWidth: 1.5 }} strokeDasharray="5 3" />
      <text x={svgW - padR - 2} y={yScale(1) - 4} style={{ fill: COL.danger, fontSize: 9 }} textAnchor="end">
        Theta=1 (no static cap possible)
      </text>

      {/* Theorem A trap = 1/4 */}
      <line x1={padL} y1={yScale(0.25)} x2={svgW - padR} y2={yScale(0.25)}
        style={{ stroke: COL.danger, strokeWidth: 1, opacity: 0.6 }} strokeDasharray="3 2" />
      <text x={padL + 4} y={yScale(0.25) - 4} style={{ fill: COL.danger, fontSize: 8, opacity: 0.7 }}>
        Thm-A trap 1/4
      </text>

      {/* shaded margin */}
      <path d={marginArea} style={{ fill: COL.margin, fillOpacity: 0.15 }} />

      {/* central tie curve */}
      <path d={centralPath} fill="none" style={{ stroke: COL.central, strokeWidth: 2.5 }} />

      {/* outer seizing curve */}
      <path d={outerPath} fill="none" style={{ stroke: COL.outer, strokeWidth: 2 }} />

      {/* dots at K=1 */}
      <circle cx={xScale(1)} cy={yScale(thetaK(1))} r={4} style={{ fill: COL.central }} />
      <text x={xScale(1) + 5} y={yScale(thetaK(1)) - 5} style={{ fill: COL.central, fontSize: 9 }}>1/2</text>
      <circle cx={xScale(1)} cy={yScale(outerTheta(1))} r={4} style={{ fill: COL.outer }} />
      <text x={xScale(1) + 5} y={yScale(outerTheta(1)) + 12} style={{ fill: COL.outer, fontSize: 9 }}>1/3</text>

      {/* arrow annotation at K=8 */}
      <text x={xScale(8) - 2} y={yScale(thetaK(8)) - 6} style={{ fill: COL.central, fontSize: 8 }} textAnchor="end">
        8/9={thetaK(8).toFixed(3)}
      </text>

      {/* margin shrinking annotation */}
      <text x={xScale(6) + 4} y={yScale((thetaK(6) + outerTheta(6)) / 2) + 3}
        style={{ fill: COL.margin, fontSize: 8 }}>
        margin{"->"}0+
      </text>

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} style={{ stroke: COL.axis }} />
      <line x1={padL} y1={padT + cH} x2={svgW - padR} y2={padT + cH} style={{ stroke: COL.axis }} />

      {/* y axis labels */}
      {yTicks.map((v) => (
        <g key={v}>
          <text x={padL - 4} y={yScale(v) + 3} style={{ fill: COL.tick, fontSize: 8 }} textAnchor="end">
            {v.toFixed(1)}
          </text>
          <line x1={padL - 2} y1={yScale(v)} x2={padL} y2={yScale(v)} style={{ stroke: COL.axis }} />
        </g>
      ))}
      <text x={12} y={padT + cH / 2} style={{ fill: COL.title, fontSize: 9 }} textAnchor="middle"
        transform={`rotate(-90, 12, ${padT + cH / 2})`}>
        Theta
      </text>

      {/* x axis labels */}
      {xTicks.map((v) => (
        <g key={v}>
          <text x={xScale(v)} y={svgH - 14} style={{ fill: COL.tick, fontSize: 8 }} textAnchor="middle">{v}</text>
          <line x1={xScale(v)} y1={padT + cH} x2={xScale(v)} y2={padT + cH + 3} style={{ stroke: COL.axis }} />
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 3} style={{ fill: COL.title, fontSize: 9 }} textAnchor="middle">
        K (neighbours per side)
      </text>

      {/* legend */}
      <g>
        <line x1={padL + 8} y1={padT + 6} x2={padL + 24} y2={padT + 6} style={{ stroke: COL.central, strokeWidth: 2.5 }} />
        <text x={padL + 27} y={padT + 9} style={{ fill: COL.central, fontSize: 8 }}>Theta_K = K/(K+1) (central tie)</text>
        <line x1={padL + 152} y1={padT + 6} x2={padL + 168} y2={padT + 6} style={{ stroke: COL.outer, strokeWidth: 2 }} />
        <text x={padL + 171} y={padT + 9} style={{ fill: COL.outer, fontSize: 8 }}>outer seizing pair</text>
        <rect x={padL + 280} y={padT + 2} width={10} height={6} style={{ fill: COL.margin, fillOpacity: 0.4 }} />
        <text x={padL + 293} y={padT + 9} style={{ fill: COL.margin, fontSize: 8 }}>margin (shrinks to 0+)</text>
      </g>
    </svg>
  );
}

function LadderTable() {
  const rows = TABLE_K.map((K) => {
    const tc = thetaK(K), to = outerTheta(K), m = tc - to;
    return { K, tc, to, m };
  });
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
            {['K', 'Theta_K = K/(K+1)', 'outer seizing Theta', 'margin (Theta_K - outer)', 'note'].map((h) => (
              <th key={h} style={{ color: 'var(--faint)', fontWeight: 600, padding: '6px 10px', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ K, tc, to, m }) => (
            <tr key={K} style={{ borderBottom: '1px solid var(--hairline)' }}>
              <td style={{ padding: '7px 10px', color: 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{K}</td>
              <td style={{ padding: '7px 10px', color: 'var(--brass-dk)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{tc.toFixed(6)}</td>
              <td style={{ padding: '7px 10px', color: 'var(--green)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{to.toFixed(6)}</td>
              <td style={{ padding: '7px 10px', color: 'var(--blue)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{m.toExponential(4)}</td>
              <td style={{ padding: '7px 10px', color: 'var(--faint)', fontSize: 10 }}>
                {K === 1 ? '1/2 (symmetric R1-T)' : K === 200 ? 'near 1 — peak UNCAPPED' : `${K}/${K + 1}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Editorial card: warm paper background + hairline border, colored left rule.
function cardBaseLeft(color) {
  return {
    background: 'var(--paper2)',
    border: '1px solid var(--hairline)',
    borderLeft: `3px solid ${color}`,
    borderRadius: 8,
    padding: '16px 18px',
  };
}

export default function ThetaStaticObstructionPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Theorem R1-T2: Static-Route Obstruction</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            The uniform symmetric lattice with <InlineMath tex={"K"} /> unit neighbours per side
            places the central pair at the exact tie value{' '}
            <InlineMath tex={"\\Theta_K = K/(K+1)"} />, which rises
            monotonically to 1 as <InlineMath tex={"K \\to \\infty"} />.
            The seizing margin (the gap between the central tie and the adjacent outer
            competitor) shrinks to 0+ along the same family. Consequence:{' '}
            <strong style={{ color: 'var(--terra-dk)' }}>no static tie comparison can deliver
            an absolute cap <InlineMath tex={"\\Theta_{\\rm exc} < 1"} /></strong>.
            The static route is closed as an <em>obstruction</em>, not as a cap.
          </p>
        </div>

        <BlockMath tex={"\\Theta_K \\;=\\; \\frac{K}{K+1} \\;=\\; \\frac{1}{2}E_K, \\quad E_K = 2\\sum_{m=1}^K \\frac{1}{m(m+1)} = \\frac{2K}{K+1} \\;\\xrightarrow{K\\to\\infty}\\; 1"} />

        <div className="card" style={{ ...cardBaseLeft('var(--brass-dk)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--brass-dk)', fontSize: 16, marginBottom: 10 }}>
            Theta_K (central tie) and seizing margin vs K
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, marginBottom: 14, lineHeight: 1.7 }}>
            The amber curve shows the central tie value <InlineMath tex={"\\Theta_K = K/(K+1)"} />{' '}
            rising toward the red dashed ceiling at <InlineMath tex={"\\Theta = 1"} />.
            At <strong style={{ color: 'var(--ink)' }}>K = 1</strong> (the symmetric uniform 4-tie)
            the central value is exactly 1/2; at K=6 it is already 6/7 = 0.857.
            The green curve is the adjacent outer seizing competitor — always below (margin&nbsp;&gt;&nbsp;0),
            but the shaded gap shrinks toward 0+ as K grows.
            The red dotted line at 1/4 is the unconditional Theorem-A trap (irrelevant for large K).
          </p>
          <ObstructionChart />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {[
              { label: 'K=1 Theta_K', val: '1/2 = 0.5000', note: 'symmetric R1-T value', color: 'var(--brass-dk)' },
              { label: 'K=6 Theta_K', val: `${thetaK(6).toFixed(4)}`, note: '= 6/7 (already near 1)', color: 'var(--brass-dk)' },
              { label: 'K=200 Theta_K', val: `${thetaK(200).toFixed(4)}`, note: 'near 1 — peak uncapped', color: 'var(--terra-dk)' },
              { label: 'margin at K=8', val: `${(thetaK(8) - outerTheta(8)).toExponential(3)}`, note: 'small but > 0', color: 'var(--blue)' },
            ].map(({ label, val, note, color }) => (
              <div key={label} style={{ flex: '1 1 140px', padding: '8px 12px', background: 'var(--paper)', borderRadius: 6, border: '1px solid var(--hairline)', borderTop: `2px solid ${color}` }}>
                <div style={{ color, fontSize: 11, fontWeight: 700 }}>{label}</div>
                <div style={{ color: 'var(--ink)', fontSize: 13, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{val}</div>
                <div style={{ color: 'var(--faint)', fontSize: 10 }}>{note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ ...cardBaseLeft('var(--blue)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 16, marginBottom: 10 }}>Theta_K Ladder Table</h3>
          <LadderTable />
          <p style={{ color: 'var(--faint)', fontSize: 12, marginTop: 12, lineHeight: 1.7 }}>
            The seizing mechanism holds at every K (margin &gt; 0, the outer competitor always seizes),
            but the margin shrinks as the lattice grows. At K=200 the central tie value is{' '}
            <InlineMath tex={"200/201 \\approx 0.995"} />, confirming the peak is not bounded below 1.
          </p>
        </div>

        <div className="card" style={{ ...cardBaseLeft('var(--terra-dk)'), marginTop: 24 }}>
          <h3 style={{ color: 'var(--terra-dk)', fontSize: 16, marginBottom: 8 }}>Status</h3>
          <div style={{ background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
            <span style={{ color: 'var(--terra-dk)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em' }}>R1 EXCURSION-CAP RESIDUAL: PURELY DYNAMICAL</span>
            <span style={{ color: 'var(--ink-soft)', fontSize: 12 }}> &mdash; The static route is closed as an <em>obstruction</em> (<InlineMath tex={"\\Theta_K \\to 1"} />), not as a cap &lt; 1. No static tie comparison can bound the excursion peak; the open question is now entirely dynamical: whether the CM flow, started from real-zero-like data, can reach a near-uniform lattice.</span>
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--ink)' }}>What this closes (as an obstruction):</strong> the
            candidate static route — "bound the tie value of the central pair to show the excursion peak
            stays below 1" — is provably blocked by the K-neighbour uniform lattice family. No static
            comparison of tie values can deliver an absolute cap <InlineMath tex={"\\Theta_{\\rm exc} < 1"} />.
            The seizing mechanism (competitor carries strictly lower Theta, margin&nbsp;&gt;&nbsp;0) extends
            to asymmetric and dressed ties (Lemma R1-T3 closes the 4-particle asymmetric tie exactly), but the
            margin vanishes along the multi-body family while the tie value rises.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
            <strong style={{ color: 'var(--brass-dk)' }}>What remains open (R1 dynamical residual):</strong> a cap
            must come from showing the attractive CM flow, started from generic (real-zero-like) data, never
            drives the minimal-gap locus onto a long near-uniform lattice. The near-uniform lattice sits at
            isolation ratio <InlineMath tex={"\\rho = g/d_1 = 1"} />, which is the unstable repelling threshold
            of Lemma R2-T; Lemma R1-T4 establishes the cap on the isolated-pair basin
            (<InlineMath tex={"\\rho < 1, \\Theta(0) < 1/4"} />) but not unconditionally
            (multi-body Lemma R2-T residual remains open).
          </p>
        </div>

        <div className="card" style={{ ...cardBaseLeft('var(--brass)'), marginTop: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>Related pages</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/theta-seizing-margin" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Lemma R1-T3 seizing margin viz (asymmetric 4-tie closed form)
            </Link>
            <Link to="/spectral-attack" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Spectral Approach (full Theta-trap ladder)
            </Link>
            <Link to="/" style={{ fontSize: 12, color: 'var(--terra-dk)', textDecoration: 'none' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
