import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

// Lemma R1-T3 (imp-2628): asymmetric minimal-gap 4-tie {-1, 0, 1, 1+b}, b >= 1
// Theta_central(b) = 1/4 + 1/(2 b (b+1))
// Theta_seize(b)   = 1/4 + 1/(2 (b+1)(b+2))
// margin           = Theta_central - Theta_seize = 1 / (b (b+1) (b+2))
const TRAP_A = 0.25;

function thetaCentral(b) { return 0.25 + 1 / (2 * b * (b + 1)); }
function thetaSeize(b) { return 0.25 + 1 / (2 * (b + 1) * (b + 2)); }
function margin(b) { return 1 / (b * (b + 1) * (b + 2)); }

const TABLE_B = [1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 50];

function SeizingMarginChart() {
  const bMax = 30;
  const bStep = 0.1;
  const points = useMemo(() => {
    const pts = [];
    for (let b = 1; b <= bMax + bStep / 2; b += bStep) {
      pts.push({ b, tc: thetaCentral(b), ts: thetaSeize(b), m: margin(b) });
    }
    return pts;
  }, []);

  const svgW = 560, svgH = 240;
  const padL = 44, padR = 16, padT = 14, padB = 32;
  const cW = svgW - padL - padR, cH = svgH - padT - padB;
  const yMax = 0.76;
  const xScale = (b) => padL + ((b - 1) / (bMax - 1)) * cW;
  const yScale = (v) => padT + cH * (1 - v / yMax);

  const pathD = (arr, fn) => arr.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(p.b).toFixed(2)},${yScale(fn(p)).toFixed(2)}`).join(' ');

  const yCentral = pathD(points, (p) => p.tc);
  const ySeize = pathD(points, (p) => p.ts);
  const yMargin = pathD(points, (p) => p.m);

  const yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const xTicks = [1, 5, 10, 15, 20, 25, 30];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* grid */}
      {yTicks.map((v) => (
        <line key={v} x1={padL} y1={yScale(v)} x2={svgW - padR} y2={yScale(v)}
          stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* Theorem-A trap line */}
      <line x1={padL} y1={yScale(TRAP_A)} x2={svgW - padR} y2={yScale(TRAP_A)}
        stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 3" />
      <text x={svgW - padR - 2} y={yScale(TRAP_A) - 4} fill="#ef4444" fontSize={9} textAnchor="end">
        Thm-A trap 1/4
      </text>

      {/* b=1 symmetric point annotation */}
      <line x1={xScale(1)} y1={padT} x2={xScale(1)} y2={padT + cH}
        stroke="#475569" strokeWidth={1} strokeDasharray="3 2" />
      <text x={xScale(1) + 3} y={padT + 10} fill="#475569" fontSize={8}>b=1 (symm)</text>

      {/* curves */}
      <path d={yCentral} fill="none" stroke="#f59e0b" strokeWidth={2} />
      <path d={ySeize} fill="none" stroke="#10b981" strokeWidth={2} />
      <path d={yMargin} fill="none" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="6 2" />

      {/* special point b=1: Theta_central = 1/2 */}
      <circle cx={xScale(1)} cy={yScale(thetaCentral(1))} r={4} fill="#f59e0b" />
      <text x={xScale(1) + 5} y={yScale(thetaCentral(1)) - 4} fill="#f59e0b" fontSize={9}>1/2</text>

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" />
      <line x1={padL} y1={padT + cH} x2={svgW - padR} y2={padT + cH} stroke="#334155" />

      {/* y axis labels */}
      {yTicks.map((v) => (
        <g key={v}>
          <text x={padL - 4} y={yScale(v) + 3} fill="#475569" fontSize={8} textAnchor="end">
            {v.toFixed(1)}
          </text>
          <line x1={padL - 2} y1={yScale(v)} x2={padL} y2={yScale(v)} stroke="#334155" />
        </g>
      ))}
      <text x={12} y={padT + cH / 2} fill="#94a3b8" fontSize={9} textAnchor="middle"
        transform={`rotate(-90, 12, ${padT + cH / 2})`}>
        Theta / margin
      </text>

      {/* x axis labels */}
      {xTicks.map((v) => (
        <g key={v}>
          <text x={xScale(v)} y={svgH - 8} fill="#475569" fontSize={8} textAnchor="middle">{v}</text>
          <line x1={xScale(v)} y1={padT + cH} x2={xScale(v)} y2={padT + cH + 3} stroke="#334155" />
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 1} fill="#94a3b8" fontSize={9} textAnchor="middle">b</text>

      {/* legend */}
      <g>
        <line x1={padL + 8} y1={padT + 6} x2={padL + 24} y2={padT + 6} stroke="#f59e0b" strokeWidth={2} />
        <text x={padL + 27} y={padT + 9} fill="#f59e0b" fontSize={8}>Theta_central</text>
        <line x1={padL + 90} y1={padT + 6} x2={padL + 106} y2={padT + 6} stroke="#10b981" strokeWidth={2} />
        <text x={padL + 109} y={padT + 9} fill="#10b981" fontSize={8}>Theta_seize</text>
        <line x1={padL + 168} y1={padT + 6} x2={padL + 184} y2={padT + 6} stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={padL + 187} y={padT + 9} fill="#8b5cf6" fontSize={8}>margin (x10)</text>
      </g>
    </svg>
  );
}

function ValueTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            {['b', 'Theta_central', 'Theta_seize', 'margin 1/(b(b+1)(b+2))', 'margin -> 0 as'].map((h) => (
              <th key={h} style={{ color: '#64748b', fontWeight: 600, padding: '6px 10px', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_B.map((b) => {
            const tc = thetaCentral(b), ts = thetaSeize(b), m = margin(b);
            const exactMargin = `1/${b}·${b + 1}·${b + 2}`;
            return (
              <tr key={b} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '7px 10px', color: '#e2e8f0', fontFamily: 'monospace' }}>{b}</td>
                <td style={{ padding: '7px 10px', color: '#f59e0b', fontFamily: 'monospace' }}>{tc.toFixed(6)}</td>
                <td style={{ padding: '7px 10px', color: '#10b981', fontFamily: 'monospace' }}>{ts.toFixed(6)}</td>
                <td style={{ padding: '7px 10px', color: '#8b5cf6', fontFamily: 'monospace' }}>
                  {m.toExponential(4)} <span style={{ color: '#475569' }}>= {exactMargin}</span>
                </td>
                <td style={{ padding: '7px 10px', color: '#64748b', fontFamily: 'monospace', fontSize: 10 }}>
                  {b >= 20 ? 'deep in Thm-A basin' : b >= 10 ? 'near 1/4' : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ThetaSeizingMarginPage() {
  const b1Margin = margin(1);
  const b10Margin = margin(10);

  return (
    <div className="page">
      <PageHeader title="Lemma R1-T3: Seizing Margin Visualization">
        <p>
          The asymmetric minimal-gap 4-tie <InlineMath tex={"\\{-1, 0, 1, 1{+}b\\}"} /> (b&nbsp;&#x2265;&nbsp;1)
          closes the static seizing argument in exact closed form. The central pair carries{' '}
          <InlineMath tex={"\\Theta_{\\rm central}(b) = \\tfrac{1}{4} + \\tfrac{1}{2b(b+1)}"} /> while the tied
          competitor that seizes minimality carries{' '}
          <InlineMath tex={"\\Theta_{\\rm seize}(b) = \\tfrac{1}{4} + \\tfrac{1}{2(b+1)(b+2)}"} />.
          Their difference — the <strong style={{ color: '#8b5cf6' }}>seizing margin</strong> — is the
          exact rational <InlineMath tex={"\\frac{1}{b(b+1)(b+2)} > 0"} /> for all b&nbsp;&#x2265;&nbsp;1.
        </p>
      </PageHeader>

      <BlockMath tex={"\\Theta_{\\rm central}(b) - \\Theta_{\\rm seize}(b) \\;=\\; \\frac{1}{b\\,(b+1)\\,(b+2)} \\;>\\; 0 \\qquad \\forall\\, b \\ge 1"} />

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 16, marginBottom: 10 }}>
          Theta_central, Theta_seize, and Seizing Margin vs b
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 14, lineHeight: 1.7 }}>
          At <strong style={{ color: '#e2e8f0' }}>b = 1</strong> (the symmetric uniform tie) the central tie value
          is exactly <InlineMath tex={"1/2"} /> and the margin is <InlineMath tex={"1/6 \\approx 0.167"} />.
          As <InlineMath tex={"b \\to \\infty"} /> the far right neighbour recedes, both curves approach the
          red dashed <strong style={{ color: '#ef4444' }}>Theorem-A trap at 1/4</strong>, and the
          margin <InlineMath tex={"\\to 0+"} />. Asymmetry only <em>lowers</em> the central tie value —
          the excursion peak on this family stays exactly 1/2.
          <br />
          <span style={{ color: '#64748b', fontSize: 11 }}>
            Note: the purple margin curve is shown at actual scale — it falls from{' '}
            {b1Margin.toFixed(4)} at b=1 to {b10Margin.toFixed(4)} at b=10.
          </span>
        </p>
        <SeizingMarginChart />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {[
            { label: 'b=1 central tie', val: thetaCentral(1).toFixed(4), note: '= 1/2 (symmetric peak)', color: '#f59e0b' },
            { label: 'b=1 margin', val: margin(1).toFixed(5), note: '= 1/6', color: '#8b5cf6' },
            { label: 'b→∞ limit', val: '0.25000', note: 'Thm-A trap (1/4)', color: '#ef4444' },
            { label: 'margin → 0+', val: '~ 1/b³', note: 'benign: tie in trap band', color: '#10b981' },
          ].map(({ label, val, note, color }) => (
            <div key={label} style={{ flex: '1 1 140px', padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6, borderTop: `2px solid ${color}` }}>
              <div style={{ color, fontSize: 11, fontWeight: 700 }}>{label}</div>
              <div style={{ color: '#e2e8f0', fontSize: 13, fontFamily: 'monospace' }}>{val}</div>
              <div style={{ color: '#64748b', fontSize: 10 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 16, marginBottom: 10 }}>Exact Values Table</h3>
        <ValueTable />
        <p style={{ color: '#64748b', fontSize: 12, marginTop: 12, lineHeight: 1.7 }}>
          The margin <InlineMath tex={"1/(b(b+1)(b+2))"} /> is always positive and exactly rational.
          At b=1 it is 1/6; at b=10 it is 1/1320.
          As b grows both <InlineMath tex={"\\Theta_{\\rm central}"} /> and <InlineMath tex={"\\Theta_{\\rm seize}"} /> converge
          to 1/4 from above, meaning the tie falls into the unconditional Theorem-A trap — the b→∞ limit is
          <em> benign</em>, not an obstruction.
        </p>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', fontSize: 16, marginBottom: 8 }}>Honest Status</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          <strong style={{ color: '#e2e8f0' }}>What this closes:</strong> the static asymmetric 4-particle tie in
          exact closed form. The seizing competitor always carries strictly lower Theta; the excursion peak on the
          full asymmetric 4-tie family is exactly 1/2 (attained only at b=1).
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          <strong style={{ color: '#f59e0b' }}>What remains open (R1 dynamical residual):</strong> the
          multi-body near-uniform lattice (Theta_K = K/(K+1) → 1, Lemma R1-T2) where the margin → 0 while
          the tie value <em>rises</em>. That is a genuinely different regime — not the 4-particle asymmetric
          tie — and requires a <em>dynamical</em> reachability argument (Lemma R1-T4 / R2-T), not a static
          comparison.
        </p>
        <p style={{ color: '#64748b', fontSize: 12, marginTop: 8 }}>
          See also: <Link to="/spectral-attack" style={{ color: '#06b6d4' }}>Spectral Attack</Link> for the
          full Theta-trap threshold ladder and the Theorem-A / B / C context.
        </p>
      </div>
    </div>
  );
}
