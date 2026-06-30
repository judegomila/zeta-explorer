import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SpectralAttackViz from '../components/SpectralAttackViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { ZETA_ZEROS } from '../math/zeta.js';
import { SG1C_THEOREMS, SG1C_THETA_COVERAGE_INTERVAL, SG1C_R1T4_BASIN_GRID, SG1C_R1T4_RHO1_REPELLER, SG1C_R2T2_SHELL_CROSSCHECK, SG1C_LEMMA1_CROSS_N, SG1C_LEMMA2_CROSS_N } from '../data/sg1c-theta-trap-theorems.js';
import { CTHETA_FLAT_INVARIANT, CTHETA_ON_BASIN_VANISHING } from '../data/imp-3022-ctheta-basin-scaling.js';
import { IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING } from '../data/imp-3086-orthogonalized-basis-conditioning.js';
import { SG1C_ASYM_ISOLATION_CLOSED_FORM } from '../data/sg1c-asym-isolation-closed-form-2026-06-30.js';
import { SG1C_MINGAP_SELECTOR_DISCONTINUITY } from '../data/sg1c-mingap-selector-discontinuity-2026-06-30.js';

// Theorem constants from sg1c-theta-trap-theorems (Theorem A / Corollary A1 / Theorem B)
const TRAP_A = 1 / 4;                      // unconditional trap: every pair with Theta<=1/4 stays trapped
const TRAP_B = SG1C_THEOREMS.theoremB.trapLevel;  // minimal-gap trap: sharp threshold ~0.443
const TRAP_CSTAR = Math.sqrt(2 + Math.sqrt(3)) - 1;  // isolation onset ~0.93185 (R2-T2 closed form)
const EXCURSION_CAP_DRESSED = 0.5073;                 // dressed symmetric excursion peak

function computeThetaData(N) {
  const zs = ZETA_ZEROS.slice(0, N);
  const pairs = [];
  for (let k = 0; k < N - 1; k++) {
    const g = zs[k + 1] - zs[k];
    let E = 0;
    for (let j = 0; j < N; j++) {
      if (j === k || j === k + 1) continue;
      E += 1 / ((zs[k] - zs[j]) * (zs[k + 1] - zs[j]));
    }
    const theta = (g * g * E) / 2;
    pairs.push({ k, g, theta });
  }
  let minIdx = 0;
  for (let i = 1; i < pairs.length; i++) {
    if (pairs[i].theta < pairs[minIdx].theta) minIdx = i;
  }
  const minPair = pairs[minIdx];
  const tcBound = (minPair.g * minPair.g) / 6;
  return { pairs, minIdx, minPair, tcBound };
}

function ThetaTrapSection() {
  const [N, setN] = useState(20);
  const { pairs, minIdx, minPair, tcBound } = useMemo(() => computeThetaData(N), [N]);

  const svgW = 520, svgH = 160, padL = 34, padR = 8, padT = 10, padB = 24;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const yMax = 0.55;
  const yScale = (v) => padT + chartH * (1 - v / yMax);
  const bw = Math.max(1, chartW / pairs.length - 1);
  const belowA = pairs.filter((p) => p.theta < TRAP_A).length;

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #06b6d4' }}>
      <h3 style={{ color: '#06b6d4', fontSize: 16, marginBottom: 12 }}>
        Theta-Trap Explorer: A1 Collision-Time Bound
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        For the first <strong style={{ color: '#e2e8f0' }}>N</strong> zeta zeros,
        compute <InlineMath tex={"\\Theta(0) = g^2 E/2"} /> for every adjacent pair.{' '}
        <strong style={{ color: '#ef4444' }}>Theorem A</strong> (1/4-trap, unconditional): any pair with{' '}
        <InlineMath tex={"\\Theta \\leq 1/4"} /> stays trapped forever.{' '}
        <strong style={{ color: '#06b6d4' }}>Corollary A1</strong>: the minimal pair then satisfies{' '}
        <InlineMath tex={"t_c \\leq g_{\\min}^2/6"} />.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <label style={{ color: '#94a3b8', fontSize: 13, whiteSpace: 'nowrap' }}>
          N = <strong style={{ color: '#e2e8f0' }}>{N}</strong> zeros
        </label>
        <input
          type="range" min={5} max={50} value={N}
          onChange={(e) => setN(Number(e.target.value))}
          style={{ flex: 1 }}
        />
      </div>

      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        {pairs.map((p, i) => {
          const barH = Math.max(1, chartH - (yScale(Math.min(p.theta, yMax)) - padT));
          const color = i === minIdx ? '#f59e0b' : p.theta < TRAP_A ? '#10b981' : p.theta < TRAP_B ? '#3b82f6' : '#ef4444';
          return (
            <rect key={i}
              x={padL + i * (bw + 1)} y={yScale(Math.min(p.theta, yMax))}
              width={bw} height={barH}
              fill={color} opacity={0.8}
            />
          );
        })}
        {/* Theorem A threshold line */}
        <line x1={padL} y1={yScale(TRAP_A)} x2={svgW - padR} y2={yScale(TRAP_A)}
          stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={svgW - padR - 2} y={yScale(TRAP_A) - 3} fill="#ef4444" fontSize={9} textAnchor="end">
          Thm A: 1/4
        </text>
        {/* Theorem B threshold line */}
        <line x1={padL} y1={yScale(TRAP_B)} x2={svgW - padR} y2={yScale(TRAP_B)}
          stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
        <text x={svgW - padR - 2} y={yScale(TRAP_B) - 3} fill="#f59e0b" fontSize={9} textAnchor="end">
          Thm B: {TRAP_B.toFixed(3)}
        </text>
        {/* y-axis labels */}
        {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
          <g key={v}>
            <text x={padL - 3} y={yScale(v) + 3} fill="#475569" fontSize={8} textAnchor="end">
              {v.toFixed(1)}
            </text>
            <line x1={padL - 2} y1={yScale(v)} x2={padL} y2={yScale(v)} stroke="#334155" />
          </g>
        ))}
        <text x={10} y={padT + chartH / 2} fill="#94a3b8" fontSize={10} textAnchor="middle"
          transform={`rotate(-90, 10, ${padT + chartH / 2})`}>
          {'Θ(0)'}
        </text>
        <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH} stroke="#334155" />
        <text x={padL + chartW / 2} y={svgH - 4} fill="#94a3b8" fontSize={10} textAnchor="middle">
          pair index k
        </text>
      </svg>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginTop: 12 }}>
        <div style={{ padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6, borderTop: '2px solid #f59e0b' }}>
          <div style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700 }}>Minimal pair (k={minIdx})</div>
          <div style={{ color: '#e2e8f0', fontSize: 12 }}>
            <InlineMath tex={"\\Theta(0) = " + minPair.theta.toFixed(4)} />
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>g_min = {minPair.g.toFixed(4)}</div>
        </div>
        <div style={{ padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6, borderTop: '2px solid #06b6d4' }}>
          <div style={{ color: '#06b6d4', fontSize: 11, fontWeight: 700 }}>Corollary A1 bound</div>
          <div style={{ color: '#e2e8f0', fontSize: 12 }}>
            <InlineMath tex={"t_c \\leq " + tcBound.toFixed(4)} />
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>= g_min² / 6</div>
        </div>
        <div style={{ padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6, borderTop: '2px solid #ef4444' }}>
          <div style={{ color: '#ef4444', fontSize: 11, fontWeight: 700 }}>Theorem A status</div>
          <div style={{ color: minPair.theta < TRAP_A ? '#10b981' : '#ef4444', fontSize: 12 }}>
            {minPair.theta < TRAP_A ? 'A1 APPLIES' : 'above 1/4-trap'}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>threshold: 1/4 = 0.25</div>
        </div>
        <div style={{ padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 6, borderTop: '2px solid #10b981' }}>
          <div style={{ color: '#10b981', fontSize: 11, fontWeight: 700 }}>Trap coverage</div>
          <div style={{ color: '#e2e8f0', fontSize: 12 }}>{belowA}/{pairs.length} pairs</div>
          <div style={{ color: '#64748b', fontSize: 10 }}>below 1/4 (Thm A)</div>
        </div>
      </div>

      <p style={{ color: '#64748b', fontSize: 12, marginTop: 12, lineHeight: 1.7 }}>
        <span style={{ color: '#10b981', fontWeight: 600 }}>Green</span>: pairs with
        {' '}<InlineMath tex={"\\Theta < 1/4"} /> (Theorem A applies unconditionally).{' '}
        <span style={{ color: '#f59e0b', fontWeight: 600 }}>Orange</span>: the minimal-gap pair (A1 source).{' '}
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>Blue</span>: between the two thresholds (Theorem B
        applies if this is the minimal gap).{' '}
        On the measured real-zero rows <InlineMath tex={"\\Theta(0) \\in \\{0.167, 0.088, 0.046\\}"} />,
        all well under 1/4 — A1 applies unconditionally to actual zero configurations.
      </p>
    </div>
  );
}

function ThetaLadderTable() {
  const rows = [
    {
      threshold: "Θ ≤ 1/4",
      name: "Theorem A",
      value: "0.2500",
      color: "#10b981",
      status: "RIGOROUS",
      note: "Unconditional trap — every pair with Θ≤1/4 stays trapped forever; Corollary A1 gives t_c ≤ g_min²/6.",
    },
    {
      threshold: "Θ ≤ (√73−5)/8",
      name: "Theorem B (minimal-gap)",
      value: TRAP_B.toFixed(4),
      color: "#f59e0b",
      status: "RIGOROUS",
      note: "Sharp static-cover ceiling — capped-greedy profile flips dΘ/ds>0 exactly here; no static bound surpasses it.",
    },
    {
      threshold: "Θ ≤ ~0.5073",
      name: "Dressed excursion cap",
      value: EXCURSION_CAP_DRESSED.toFixed(4),
      color: "#ef4444",
      status: "NUMERICAL",
      note: "Symmetric peak exactly 1/2 at R1-T tie; dressed near-uniform variant reaches ~0.5073. Band (0.443, 0.5073) REFUTED: no absolute static cap lives there.",
    },
    {
      threshold: "ρ ≤ √(2+√3)−1",
      name: "R2-T2 isolation onset c*",
      value: TRAP_CSTAR.toFixed(5),
      color: "#8b5cf6",
      status: "RIGOROUS",
      note: "ρ = g/d₁ is the isolation ratio (not Θ); self-isolation dρ/ds < 0 for ρ < c*. Basin cap 0.72 sits below c* with safety margin ≥0.207.",
    },
  ];

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: "3px solid #f59e0b" }}>
      <h3 style={{ color: "#f59e0b", fontSize: 16, marginBottom: 4 }}>
        Theta-Trap Threshold Ladder
      </h3>
      <p style={{ color: "#64748b", fontSize: 12, marginBottom: 16 }}>
        Four certified levels from the sg1c analysis, ascending order.
        The band (0.443, 0.5073) is REFUTED: no absolute static Theta* cover exists inside it.
        The c* row is the self-isolation ratio threshold (not a Theta value).
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              {["Threshold", "Name", "Value", "Status", "Note"].map((h) => (
                <th key={h} style={{ color: "#64748b", fontWeight: 600, padding: "6px 10px", textAlign: "left" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} style={{ borderBottom: "1px solid #1e293b" }}>
                <td style={{ padding: "8px 10px", color: row.color, fontFamily: "monospace" }}>
                  {row.threshold}
                </td>
                <td style={{ padding: "8px 10px", color: row.color, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {row.name}
                </td>
                <td style={{ padding: "8px 10px", color: "#e2e8f0", fontFamily: "monospace" }}>
                  {row.value}
                </td>
                <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                  <span style={{
                    background: row.status === "RIGOROUS" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                    color: row.status === "RIGOROUS" ? "#10b981" : "#f59e0b",
                    padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                  }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: "8px 10px", color: "#94a3b8", lineHeight: 1.5 }}>
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ThetaCoverageLadderSection() {
  const { theoremCmap, refutedBand, cAtLowerEndpoint, cAtUpperEndpoint } = SG1C_THETA_COVERAGE_INTERVAL;

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: "3px solid #ef4444" }}>
      <h3 style={{ color: "#ef4444", fontSize: 16, marginBottom: 4 }}>
        Theorem-C Static-Cover Ladder: Theta_max(c)
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
        The Theorem-C isolation-for-cover map trades isolation margin c&nbsp;=&nbsp;g/d&#x2081; for Theta coverage:
        &nbsp;<code style={{ color: "#e2e8f0", fontSize: 12 }}>Theta_max(c) = 2 - 3c&#xb2;/(1+c) - c&#x2074;/(1+c)&#xb2;</code>.
        When the isolation ratio satisfies g/d&#x2081;&nbsp;&le;&nbsp;c the pair is provably non-crossing for every
        Theta*&nbsp;&le;&nbsp;Theta_max(c). At c&nbsp;=&nbsp;0.72 the cover reaches Theta_max&nbsp;&asymp;&nbsp;1.005
        (full unit cover). At c&nbsp;=&nbsp;1 it degenerates to 1/4&nbsp;=&nbsp;Theorem&nbsp;A.
      </p>
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          REFUTED BAND ({refutedBand[0].toFixed(3)}, {refutedBand[1].toFixed(4)})
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12 }}>
          Every Theta* inside this interval is crossed upward by some minimal-gap config:
          the symmetric family peaks at exactly 0.5 (R1-T tie) and the dressed variant reaches 0.5073.
          No absolute static Theta* cover exists in this band. The residual cap above Theta_b must be dynamical.
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              {["c = g/d1", "Theta_max(c)", "Full cover (>=1)?", "In refuted band?", "Status"].map((h) => (
                <th key={h} style={{ color: "#64748b", fontWeight: 600, padding: "6px 10px", textAlign: "left" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {theoremCmap.map(({ c, thetaMax }) => {
              const fullCover = thetaMax >= 1;
              const inBand = thetaMax >= refutedBand[0] && thetaMax <= refutedBand[1];
              const belowBand = !fullCover && !inBand;
              const statusColor = fullCover ? "#10b981" : inBand ? "#ef4444" : "#f59e0b";
              const statusBg = fullCover ? "rgba(16,185,129,0.15)" : inBand ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)";
              const statusLabel = fullCover ? "FULL COVER" : inBand ? "IN REFUTED BAND" : "BELOW BAND";
              return (
                <tr key={c} style={{ borderBottom: "1px solid #1e293b", background: inBand ? "rgba(239,68,68,0.05)" : undefined }}>
                  <td style={{ padding: "8px 10px", color: "#e2e8f0", fontFamily: "monospace" }}>
                    {c.toFixed(2)}
                  </td>
                  <td style={{ padding: "8px 10px", color: statusColor, fontFamily: "monospace", fontWeight: fullCover ? 700 : 400 }}>
                    {thetaMax.toFixed(4)}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    {fullCover
                      ? <span style={{ color: "#10b981", fontWeight: 700 }}>YES (&ge;1)</span>
                      : <span style={{ color: "#64748b" }}>no</span>}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    {inBand
                      ? <span style={{ color: "#ef4444", fontWeight: 700 }}>YES - REFUTED</span>
                      : <span style={{ color: "#64748b" }}>no</span>}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <span style={{ background: statusBg, color: statusColor, padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ color: "#64748b", fontSize: 11, marginTop: 12 }}>
        The Theorem-C map is strictly decreasing on (0,1]. Inversion: cover drops to the lower band endpoint 0.443
        at c&nbsp;&asymp;&nbsp;{cAtLowerEndpoint.toFixed(3)}, and to the upper endpoint 0.5073 at
        c&nbsp;&asymp;&nbsp;{cAtUpperEndpoint.toFixed(3)}.
        Both inversion constants sit above 0.72, consistent with basin certification. Source: imp-3017.
      </p>
    </div>
  );
}

const BASIN_CAP_RHO = 0.72;

function ThetaRhoPhaseDiagram() {
  const [N, setN] = useState(30);

  const points = useMemo(() => {
    const zs = ZETA_ZEROS.slice(0, N);
    const pts = [];
    for (let k = 1; k < N - 2; k++) {
      const g = zs[k + 1] - zs[k];
      const dLeft = zs[k] - zs[k - 1];
      const dRight = zs[k + 2] - zs[k + 1];
      const d1 = Math.min(dLeft, dRight);
      const rho = g / d1;
      let E = 0;
      for (let j = 0; j < N; j++) {
        if (j === k || j === k + 1) continue;
        E += 1 / ((zs[k] - zs[j]) * (zs[k + 1] - zs[j]));
      }
      const theta = (g * g * E) / 2;
      pts.push({ k, rho: Math.min(rho, 1.09), theta: Math.min(theta, 0.59) });
    }
    return pts;
  }, [N]);

  const svgW = 520, svgH = 280, padL = 44, padR = 16, padT = 16, padB = 36;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const rhoMax = 1.1, thetaMax = 0.60;

  const xS = (r) => padL + (Math.min(r, rhoMax) / rhoMax) * chartW;
  const yS = (t) => padT + chartH * (1 - Math.min(t, thetaMax) / thetaMax);

  const y25 = yS(TRAP_A);
  const y443 = yS(TRAP_B);
  const xBasin = xS(BASIN_CAP_RHO);
  const xCstar = xS(TRAP_CSTAR);

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #8b5cf6' }}>
      <h3 style={{ color: '#8b5cf6', fontSize: 16, marginBottom: 8 }}>
        Theta-Trap Phase Diagram: (&rho;, &Theta;) Plane
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        Each adjacent zeta-zero pair plotted at its isolation ratio &rho;&nbsp;=&nbsp;g/d&#x2081; (x-axis)
        and coupling parameter &Theta;&nbsp;=&nbsp;g&#xb2;E/2 (y-axis). Shaded zones show trap coverage.
        Theorem&nbsp;A (green) is unconditional for all &rho;; Theorem&nbsp;B (amber) requires
        minimal-gap status. The vertical lines mark the Theorem-C basin cap (&rho;&nbsp;=&nbsp;0.72)
        and the R2-T2 self-isolation onset c*&nbsp;&asymp;&nbsp;0.932.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <label style={{ color: '#94a3b8', fontSize: 13, whiteSpace: 'nowrap' }}>
          N = <strong style={{ color: '#e2e8f0' }}>{N}</strong> zeros
        </label>
        <input type="range" min={10} max={50} value={N}
          onChange={(e) => setN(Number(e.target.value))}
          style={{ flex: 1 }} />
      </div>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        {/* Shaded trap zones */}
        <rect x={padL} y={y25} width={chartW} height={padT + chartH - y25}
          fill="rgba(16,185,129,0.12)" />
        <rect x={padL} y={y443} width={chartW} height={y25 - y443}
          fill="rgba(245,158,11,0.10)" />
        <rect x={padL} y={padT} width={chartW} height={y443 - padT}
          fill="rgba(239,68,68,0.07)" />

        {/* Horizontal threshold lines */}
        <line x1={padL} y1={y25} x2={svgW - padR} y2={y25}
          stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 2" />
        <text x={svgW - padR - 2} y={y25 - 4} fill="#10b981" fontSize={9} textAnchor="end">
          Thm A: 1/4
        </text>
        <line x1={padL} y1={y443} x2={svgW - padR} y2={y443}
          stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={svgW - padR - 2} y={y443 - 4} fill="#f59e0b" fontSize={9} textAnchor="end">
          Thm B: 0.443
        </text>

        {/* Vertical threshold lines */}
        <line x1={xBasin} y1={padT} x2={xBasin} y2={padT + chartH}
          stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={xBasin + 3} y={padT + 10} fill="#06b6d4" fontSize={9}>
          &#x3c1;=0.72
        </text>
        <line x1={xCstar} y1={padT} x2={xCstar} y2={padT + chartH}
          stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 2" />
        <text x={xCstar - 3} y={padT + 20} fill="#8b5cf6" fontSize={9} textAnchor="end">
          c*
        </text>

        {/* Scatter points */}
        {points.map((p, i) => {
          const col = p.theta < TRAP_A ? '#10b981' : p.theta < TRAP_B ? '#f59e0b' : '#ef4444';
          return (
            <circle key={i}
              cx={xS(p.rho)} cy={yS(p.theta)}
              r={3.5} fill={col} opacity={0.75}
            />
          );
        })}

        {/* Axes */}
        <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH}
          stroke="#334155" strokeWidth={1} />
        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
          stroke="#334155" strokeWidth={1} />

        {/* Y-axis ticks */}
        {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => (
          <g key={v}>
            <text x={padL - 4} y={yS(v) + 3} fill="#475569" fontSize={8} textAnchor="end">
              {v.toFixed(1)}
            </text>
            <line x1={padL - 3} y1={yS(v)} x2={padL} y2={yS(v)} stroke="#334155" />
          </g>
        ))}
        <text x={12} y={padT + chartH / 2} fill="#94a3b8" fontSize={10} textAnchor="middle"
          transform={`rotate(-90, 12, ${padT + chartH / 2})`}>
          {'Θ'}
        </text>

        {/* X-axis ticks */}
        {[0, 0.25, 0.5, 0.72, 1.0].map((v) => (
          <g key={v}>
            <text x={xS(v)} y={padT + chartH + 14} fill="#475569" fontSize={8} textAnchor="middle">
              {v.toFixed(2)}
            </text>
            <line x1={xS(v)} y1={padT + chartH} x2={xS(v)} y2={padT + chartH + 4} stroke="#334155" />
          </g>
        ))}
        <text x={padL + chartW / 2} y={svgH - 3} fill="#94a3b8" fontSize={10} textAnchor="middle">
          {'ρ = g / d₁  (isolation ratio)'}
        </text>
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10, fontSize: 11 }}>
        {[
          { col: '#10b981', label: 'Θ < 1/4 — Theorem A unconditional' },
          { col: '#f59e0b', label: '1/4 ≤ Θ < 0.443 — Theorem B zone' },
          { col: '#ef4444', label: 'Θ ≥ 0.443 — above static cap' },
        ].map(({ col, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: col, flexShrink: 0 }} />
            <span style={{ color: '#94a3b8' }}>{label}</span>
          </div>
        ))}
      </div>
      <p style={{ color: '#64748b', fontSize: 12, marginTop: 8, lineHeight: 1.7 }}>
        The cyan vertical at &rho;&nbsp;=&nbsp;0.72 is the Theorem-C basin cap: pairs with
        &rho;&nbsp;&lt;&nbsp;0.72 are certified in-basin (Theta_max&nbsp;&ge;&nbsp;1 there).
        The purple c* line marks the R2-T2 self-isolation onset (d&rho;/ds&nbsp;&lt;&nbsp;0 for
        &rho;&nbsp;&lt;&nbsp;c*&nbsp;&asymp;&nbsp;0.932), the basin safety margin is 0.207.
      </p>
    </div>
  );
}

// imp-3053: drho/ds-vs-rho self-isolation line plot (distinct from the (rho,Theta) scatter above)
function DrhoSelfIsolationPlot() {
  // R2-T single-neighbour exact rate (normalised d_1=1, g=rho):
  //   d(rho)/ds = (rho - 1) * [2/(rho+1) + 4*(rho+1)/rho]
  // Sign law: strictly negative for rho<1, zero at rho=1, positive above.
  const drhoSingle = (rho) => (rho - 1) * (2 / (rho + 1) + 4 * (rho + 1) / rho);

  // R2-T2 symmetric 4-body rate (normalised d=1):
  //   d(rho)/ds = -4/rho + 4*rho/(rho+1) + 2*rho/(rho+2) + 4*rho - 2
  // Worsening onset at c* = sqrt(2+sqrt(3))-1 ~ 0.93185 (not at rho=1)
  const drhoSymm = (rho) => -4 / rho + 4 * rho / (rho + 1) + 2 * rho / (rho + 2) + 4 * rho - 2;

  const svgW = 520, svgH = 220, padL = 52, padR = 16, padT = 14, padB = 36;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const rhoMin = 0.05, rhoMax = 1.2;
  const yMin = -22, yMax = 14;

  const xS = (r) => padL + ((r - rhoMin) / (rhoMax - rhoMin)) * chartW;
  const yS = (v) => padT + chartH * (1 - (Math.max(yMin, Math.min(yMax, v)) - yMin) / (yMax - yMin));
  const yZero = yS(0);

  const N = 300;
  const rhos = Array.from({ length: N }, (_, i) => rhoMin + (i / (N - 1)) * (rhoMax - rhoMin));

  const singlePath = rhos.map((r, i) => {
    const v = drhoSingle(r);
    return (i === 0 ? 'M' : 'L') + xS(r).toFixed(1) + ',' + yS(v).toFixed(1);
  }).join(' ');

  const symmPath = rhos.map((r, i) => {
    const v = drhoSymm(r);
    return (i === 0 ? 'M' : 'L') + xS(r).toFixed(1) + ',' + yS(v).toFixed(1);
  }).join(' ');

  const xBasin = xS(BASIN_CAP_RHO);
  const xCstar = xS(TRAP_CSTAR);
  const xOne = xS(1.0);
  const xAsym = xS(0.927);

  const yTicks = [-20, -15, -10, -5, 0, 5, 10];
  const rhoTicks = [0.25, 0.5, 0.72, 1.0];

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #06b6d4' }}>
      <h3 style={{ color: '#06b6d4', fontSize: 16, marginBottom: 8 }}>
        Self-Isolation Rate: d&rho;/ds vs &rho;
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        The R2-T exact rate (cyan) uses the single-nearest-neighbour formula: sign(d&rho;/ds) = sign(&rho;&minus;1).
        Every pair with &rho;&nbsp;&lt;&nbsp;1 strictly self-isolates — the rate is <em>negative</em>, driving
        &rho; downward. The &rho;&nbsp;=&nbsp;1 lattice is the unique unstable repeller (rate zero, slope positive).
        The R2-T2 symmetric 4-body rate (purple) has the same sign law but a later worsening onset c*&nbsp;&asymp;&nbsp;0.932.
        The Theorem-C basin cap &rho;&nbsp;=&nbsp;0.72 sits comfortably below both onsets.
      </p>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        {/* Shaded self-isolating region rho < 1 */}
        <rect x={padL} y={padT} width={xOne - padL} height={chartH}
          fill="rgba(16,185,129,0.07)" />
        {/* Zero line */}
        <line x1={padL} y1={yZero} x2={svgW - padR} y2={yZero}
          stroke="#334155" strokeWidth={1} />

        {/* Rate curves */}
        <path d={singlePath} stroke="#06b6d4" strokeWidth={2} fill="none" />
        <path d={symmPath} stroke="#8b5cf6" strokeWidth={1.5} fill="none" strokeDasharray="5 3" />

        {/* rho=1 repeller */}
        <line x1={xOne} y1={padT} x2={xOne} y2={padT + chartH}
          stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 2" />
        <text x={xOne + 3} y={padT + 11} fill="#ef4444" fontSize={9}>
          &rho;=1 repeller
        </text>

        {/* Basin cap */}
        <line x1={xBasin} y1={padT} x2={xBasin} y2={padT + chartH}
          stroke="#10b981" strokeWidth={1} strokeDasharray="4 2" />
        <text x={xBasin + 3} y={padT + chartH - 4} fill="#10b981" fontSize={9}>
          0.72 basin
        </text>

        {/* c* onset */}
        <line x1={xCstar} y1={padT} x2={xCstar} y2={padT + chartH}
          stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 2" />
        <text x={xCstar - 3} y={padT + 22} fill="#8b5cf6" fontSize={9} textAnchor="end">
          c*
        </text>

        {/* Asymmetric multi-body bracket infimum ~0.927 */}
        <line x1={xAsym} y1={padT} x2={xAsym} y2={padT + chartH}
          stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" />
        <text x={xAsym - 3} y={padT + 33} fill="#f59e0b" fontSize={8} textAnchor="end">
          ~0.927
        </text>

        {/* "drho/ds < 0" label in shaded zone */}
        <text x={padL + (xOne - padL) * 0.38} y={yS(-9)} fill="#10b981" fontSize={10} textAnchor="middle">
          d&rho;/ds &lt; 0
        </text>
        <text x={padL + (xOne - padL) * 0.38} y={yS(-9) + 13} fill="#94a3b8" fontSize={9} textAnchor="middle">
          (self-isolating)
        </text>

        {/* "drho/ds > 0" label in right zone */}
        <text x={xOne + (svgW - padR - xOne) * 0.45} y={yS(5)} fill="#ef4444" fontSize={10} textAnchor="middle">
          d&rho;/ds &gt; 0
        </text>

        {/* Axes */}
        <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH}
          stroke="#334155" strokeWidth={1} />
        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
          stroke="#334155" strokeWidth={1} />

        {/* Y-axis ticks */}
        {yTicks.map((v) => (
          <g key={v}>
            <text x={padL - 4} y={yS(v) + 3} fill="#475569" fontSize={8} textAnchor="end">{v}</text>
            <line x1={padL - 3} y1={yS(v)} x2={padL} y2={yS(v)} stroke="#334155" />
          </g>
        ))}
        <text x={14} y={padT + chartH / 2} fill="#94a3b8" fontSize={9} textAnchor="middle"
          transform={`rotate(-90, 14, ${padT + chartH / 2})`}>
          d&rho;/ds
        </text>

        {/* X-axis ticks */}
        {rhoTicks.map((v) => (
          <g key={v}>
            <text x={xS(v)} y={padT + chartH + 14} fill="#475569" fontSize={8} textAnchor="middle">
              {v.toFixed(2)}
            </text>
            <line x1={xS(v)} y1={padT + chartH} x2={xS(v)} y2={padT + chartH + 4} stroke="#334155" />
          </g>
        ))}
        <text x={padL + chartW / 2} y={svgH - 3} fill="#94a3b8" fontSize={10} textAnchor="middle">
          {'ρ = g / d₁  (isolation ratio)'}
        </text>
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10, fontSize: 11 }}>
        {[
          { col: '#06b6d4', label: 'R2-T single-neighbour (exact sign law)' },
          { col: '#8b5cf6', label: 'R2-T2 symmetric 4-body (c* onset)' },
          { col: '#10b981', label: 'Self-isolating basin ρ < 1' },
          { col: '#ef4444', label: 'ρ = 1 repeller' },
        ].map(({ col, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: col, flexShrink: 0 }} />
            <span style={{ color: '#94a3b8' }}>{label}</span>
          </div>
        ))}
      </div>
      <p style={{ color: '#64748b', fontSize: 12, marginTop: 8, lineHeight: 1.7 }}>
        Honest residual: the single-neighbour sign law (cyan) is closed in exact form; the multi-body
        constant remains open between ~0.902 and 0.943. The Theorem-C basin cap 0.72 has a safety margin
        &ge;0.18 below all known worsening onsets, so basin-conditional self-isolation is unaffected.
      </p>
    </div>
  );
}

// imp-3076: Theta(rho) = (2*rho/(rho+2))^2 phase plot — analytic curve with Theta=1/4 trap crossing and 0.72 basin cap
function ThetaRhoPhaseFunctionPlot() {
  const svgW = 520, svgH = 220, padL = 48, padR = 16, padT = 14, padB = 36;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const rhoMin = 0, rhoMax = 1.1;
  const thetaMax = 0.80;

  const xS = (r) => padL + ((r - rhoMin) / (rhoMax - rhoMin)) * chartW;
  const yS = (t) => padT + chartH * (1 - Math.min(t, thetaMax) / thetaMax);

  // Analytic formula: Theta(rho) = (2*rho / (rho+2))^2
  const thetaFn = (rho) => { const v = 2 * rho / (rho + 2); return v * v; };

  // rho* where Theta=1/4: (2*rho/(rho+2))^2 = 1/4  =>  2*rho/(rho+2) = 1/2  =>  rho = 2/3
  const RHO_STAR = 2 / 3;
  const BASIN_CAP = 0.72;
  const THETA_QUARTER = 0.25;

  const N = 300;
  const rhos = Array.from({ length: N }, (_, i) => rhoMin + (i / (N - 1)) * (rhoMax - rhoMin));

  const curvePath = rhos.map((r, i) => {
    const t = thetaFn(r);
    return (i === 0 ? 'M' : 'L') + xS(r).toFixed(1) + ',' + yS(t).toFixed(1);
  }).join(' ');

  // Shaded region rho <= RHO_STAR (trapped zone)
  const xStar = xS(RHO_STAR);
  const xBasin = xS(BASIN_CAP);
  const yTrap = yS(THETA_QUARTER);
  const yBasinTheta = yS(thetaFn(BASIN_CAP));

  const rhoTicks = [0, 1/3, 2/3, 0.72, 1.0];

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: "3px solid #10b981" }}>
      <h3 style={{ color: "#10b981", fontSize: 16, marginBottom: 8 }}>
        &Theta;(&rho;) = (2&rho;/(&rho;+2))&#xb2; Phase Function (imp-3076)
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        The <strong style={{ color: "#10b981" }}>analytic Theta-function</strong> for a basin pair
        under Theorem-C: &Theta;&nbsp;=&nbsp;(2&rho;/(&rho;+2))&#xb2;.
        The <strong style={{ color: "#ef4444" }}>1/4-trap crossing</strong> occurs exactly at
        &rho;*&nbsp;=&nbsp;2/3 — on-basin pairs (&rho;&nbsp;&lt;&nbsp;2/3) satisfy Theorem&nbsp;A
        unconditionally. The <strong style={{ color: "#06b6d4" }}>0.72 Theorem-C cap</strong> sits
        above the crossing with &Theta;(0.72)&nbsp;&asymp;&nbsp;0.291 (still below the Theorem-B
        threshold 0.443). Distinct from the d&rho;/ds self-isolation plot (imp-3053).
      </p>
      <svg width={svgW} height={svgH} style={{ display: "block", maxWidth: "100%" }}>
        {/* Shaded trap zone rho < rho* */}
        <rect x={padL} y={padT} width={Math.max(0, xStar - padL)} height={chartH}
          fill="rgba(16,185,129,0.10)" />

        {/* Analytic curve */}
        <path d={curvePath} stroke="#10b981" strokeWidth={2.5} fill="none" />

        {/* Theta=1/4 horizontal trap line */}
        <line x1={padL} y1={yTrap} x2={svgW - padR} y2={yTrap}
          stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 2" />
        <text x={svgW - padR - 2} y={yTrap - 4} fill="#ef4444" fontSize={9} textAnchor="end">
          Thm A: &Theta;=1/4
        </text>

        {/* rho* crossing vertical */}
        <line x1={xStar} y1={padT} x2={xStar} y2={padT + chartH}
          stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={xStar + 3} y={padT + 12} fill="#ef4444" fontSize={9}>
          &rho;*=2/3
        </text>
        {/* crossing dot */}
        <circle cx={xStar} cy={yTrap} r={5} fill="#ef4444" />
        <text x={xStar + 7} y={yTrap + 4} fill="#ef4444" fontSize={9}>
          crossing
        </text>

        {/* 0.72 Theorem-C basin cap vertical */}
        <line x1={xBasin} y1={padT} x2={xBasin} y2={padT + chartH}
          stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={xBasin + 3} y={padT + 23} fill="#06b6d4" fontSize={9}>
          0.72 cap
        </text>
        {/* basin cap dot on curve */}
        <circle cx={xBasin} cy={yBasinTheta} r={4} fill="#06b6d4" />

        {/* Axes */}
        <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH}
          stroke="#334155" strokeWidth={1} />
        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH}
          stroke="#334155" strokeWidth={1} />

        {/* Y-axis ticks */}
        {[0, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7].map((v) => (
          <g key={v}>
            <text x={padL - 4} y={yS(v) + 3} fill={v === 0.25 ? "#ef4444" : "#475569"} fontSize={8} textAnchor="end">
              {v === 0.25 ? "1/4" : v.toFixed(1)}
            </text>
            <line x1={padL - 3} y1={yS(v)} x2={padL} y2={yS(v)} stroke="#334155" />
          </g>
        ))}
        <text x={14} y={padT + chartH / 2} fill="#94a3b8" fontSize={9} textAnchor="middle"
          transform={`rotate(-90, 14, ${padT + chartH / 2})`}>
          {"Θ(ρ)"}
        </text>

        {/* X-axis ticks */}
        {rhoTicks.map((v) => (
          <g key={v}>
            <text x={xS(v)} y={padT + chartH + 14} fill={v === 2/3 ? "#ef4444" : v === 0.72 ? "#06b6d4" : "#475569"}
              fontSize={8} textAnchor="middle">
              {v === 2/3 ? "2/3" : v.toFixed(2)}
            </text>
            <line x1={xS(v)} y1={padT + chartH} x2={xS(v)} y2={padT + chartH + 4} stroke="#334155" />
          </g>
        ))}
        <text x={padL + chartW / 2} y={svgH - 3} fill="#94a3b8" fontSize={10} textAnchor="middle">
          {"ρ = g / d₁  (isolation ratio)"}
        </text>
      </svg>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 8, marginTop: 12 }}>
        <div style={{ padding: "8px 12px", background: "rgba(30,41,59,0.5)", borderRadius: 6, borderTop: "2px solid #ef4444" }}>
          <div style={{ color: "#ef4444", fontSize: 11, fontWeight: 700 }}>1/4-trap crossing &rho;*</div>
          <div style={{ color: "#e2e8f0", fontSize: 12 }}>&rho;* = 2/3 &asymp; 0.667</div>
          <div style={{ color: "#64748b", fontSize: 10 }}>&Theta;(2/3) = 1/4 exactly</div>
        </div>
        <div style={{ padding: "8px 12px", background: "rgba(30,41,59,0.5)", borderRadius: 6, borderTop: "2px solid #06b6d4" }}>
          <div style={{ color: "#06b6d4", fontSize: 11, fontWeight: 700 }}>Theorem-C basin cap</div>
          <div style={{ color: "#e2e8f0", fontSize: 12 }}>&rho; = 0.72</div>
          <div style={{ color: "#64748b", fontSize: 10 }}>&Theta;(0.72) &asymp; {thetaFn(0.72).toFixed(4)}</div>
        </div>
        <div style={{ padding: "8px 12px", background: "rgba(30,41,59,0.5)", borderRadius: 6, borderTop: "2px solid #10b981" }}>
          <div style={{ color: "#10b981", fontSize: 11, fontWeight: 700 }}>On-basin Thm A zone</div>
          <div style={{ color: "#e2e8f0", fontSize: 12 }}>&rho; &lt; 2/3 (shaded)</div>
          <div style={{ color: "#64748b", fontSize: 10 }}>&Theta; &lt; 1/4, trap unconditional</div>
        </div>
      </div>

      <p style={{ color: "#64748b", fontSize: 12, marginTop: 10, lineHeight: 1.7 }}>
        The formula &Theta;(&rho;)&nbsp;=&nbsp;(2&rho;/(&rho;+2))&#xb2; is the Theorem-C basin
        relationship: it maps each isolation ratio to its theoretical &Theta; value under the
        basin reconditioning. At &rho;*=2/3 the curve crosses the Theorem&nbsp;A threshold
        (1/4); all pairs with &rho;&nbsp;&lt;&nbsp;2/3 satisfy Theorem&nbsp;A automatically.
        The cap at 0.72 gives &Theta;&asymp;{thetaFn(0.72).toFixed(3)}, safely below
        the Theorem-B static ceiling 0.443.
      </p>
    </div>
  );
}

// imp-3055: R1-T4 dynamical-reachability basin-closure narrative
function R1T4BasinClosureSection() {
  const grid = SG1C_R1T4_BASIN_GRID;
  const rep = SG1C_R1T4_RHO1_REPELLER;

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: "3px solid #10b981" }}>
      <h3 style={{ color: "#10b981", fontSize: 16, marginBottom: 8 }}>
        Lemma R1-T4: Dynamical-Reachability Basin Closure
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        Can the attractive CM flow drive an isolated minimal pair toward the uncapped near-uniform
        lattice configuration? <strong style={{ color: "#e2e8f0" }}>Lemma R1-T4 (imp-2637)</strong> answers
        no, on the isolated-pair basin: starting from a compressed minimal pair
        (&rho;&nbsp;=&nbsp;g/d&#x2081;&nbsp;&lt;&nbsp;1, &Theta;(0)&nbsp;&lt;&nbsp;1/4 &mdash; the real-zero
        regime), the CM flow drives &rho; <em>downward</em> by Lemma R2-T, trapping the pair deeper into
        the Theorem-A basin rather than allowing excursion toward the lattice. The &rho;&nbsp;=&nbsp;1
        near-uniform lattice is the <em>unstable repelling threshold</em> of this dynamics and is therefore
        not reachable by an isolated pair flowing inward.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ color: "#10b981", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>
            Isolated-pair basin: {grid.gridSize} starts
          </div>
          <div style={{ color: "#e2e8f0", fontSize: 13, marginBottom: 4 }}>
            Worst excursion = <strong>{grid.worstExcursion < 1e-9 ? "~0 (machine precision)" : grid.worstExcursion.toExponential(2)}</strong>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12 }}>
            Peak &Theta; stays at &Theta;(0) over the entire CM-flow trajectory.
            Violations: <strong style={{ color: grid.violations.length === 0 ? "#10b981" : "#ef4444" }}>{grid.violations.length}</strong>
          </div>
        </div>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>
            Near-uniform lattice controls (&rho;&nbsp;~&nbsp;1)
          </div>
          <div style={{ color: "#e2e8f0", fontSize: 13, marginBottom: 4 }}>
            Min control peak = <strong>{grid.minControlPeak.toFixed(3)}</strong>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12 }}>
            Lattice controls climb to high &Theta; (~0.8), proving the integrator
            detects a climb when one exists.
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto", marginBottom: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              {["N", "g0", "rho0", "Theta(0)", "Peak Theta", "Excursion", "Status"].map((h) => (
                <th key={h} style={{ color: "#64748b", fontWeight: 600, padding: "5px 8px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.isolated.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                <td style={{ padding: "6px 8px", color: "#e2e8f0" }}>{r.N}</td>
                <td style={{ padding: "6px 8px", color: "#e2e8f0", fontFamily: "monospace" }}>{r.g0.toFixed(2)}</td>
                <td style={{ padding: "6px 8px", color: "#06b6d4", fontFamily: "monospace" }}>{r.rho0.toFixed(4)}</td>
                <td style={{ padding: "6px 8px", color: "#f59e0b", fontFamily: "monospace" }}>{r.theta0.toFixed(4)}</td>
                <td style={{ padding: "6px 8px", color: "#10b981", fontFamily: "monospace" }}>{r.peakTheta.toFixed(4)}</td>
                <td style={{ padding: "6px 8px", color: "#94a3b8", fontFamily: "monospace" }}>{r.excursion < 1e-10 ? "~0" : r.excursion.toExponential(1)}</td>
                <td style={{ padding: "6px 8px" }}>
                  <span style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                    BASIN CLOSED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
        <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          rho = 1 Lattice: Measure-Zero Unstable Repeller (imp-3048)
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>
          The single-neighbour R2-T rate F(rho) = (rho&minus;1)[2/(rho+1) + 4(rho+1)/rho] has a unique
          interior fixed point at rho = 1 (F(1) = {rep.fixedPointResidual.toFixed(0)}) with closed-form
          eigenvalue F&prime;(1) = <strong style={{ color: "#ef4444" }}>{rep.eigenClosed}</strong> &gt; 0.
          This certifies rho = 1 as a <strong>linearly unstable repeller</strong>: any perturbation away from
          rho = 1 flows outward, not back. sign(F) = sign(rho&minus;1) on the full grid (holds:{" "}
          <strong style={{ color: rep.signLawHolds ? "#10b981" : "#ef4444" }}>{rep.signLawHolds ? "YES" : "NO"}</strong>),
          and perturbed RK4 integration from rho = 1 &plusmn; 1e-3 drifts away on both sides (drifts away:{" "}
          <strong style={{ color: rep.driftsAway ? "#10b981" : "#ef4444" }}>{rep.driftsAway ? "YES" : "NO"}</strong>).
          The near-uniform lattice configuration occupies a <em>measure-zero</em> locus in the space of
          pair configurations and is not accessible from the isolated-pair basin.
        </div>
      </div>

      <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          Honest Residual
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>
          {SG1C_THEOREMS.lemmaR1T4}
        </div>
      </div>
    </div>
  );
}

// imp-3060: symmetric shell-onset ladder table (SG1C_R2T2_SHELL_CROSSCHECK, imp-3008)
function ShellOnsetLadderSection() {
  const cc = SG1C_R2T2_SHELL_CROSSCHECK;

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: "3px solid #06b6d4" }}>
      <h3 style={{ color: "#06b6d4", fontSize: 16, marginBottom: 8 }}>
        Symmetric Shell-Onset Ladder (Lemma R2-T2 cross-check)
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        For the symmetric (2K+2)-body shell config{" "}
        <span style={{ fontFamily: "monospace", color: "#e2e8f0" }}>
          &#123;&minus;(&rho;/2+K..1), &minus;&rho;/2, &rho;/2, &rho;/2+1..K&#125;
        </span>{" "}
        (unit spacing), the worsening-onset &rho;* &mdash; where the central-pair isolation flow
        d&rho;/ds crosses 0 from below &mdash; is bisected for each shell count K.{" "}
        <strong style={{ color: "#e2e8f0" }}>K=1</strong> reproduces the{" "}
        <strong style={{ color: "#06b6d4" }}>imp-3005 closed form</strong>{" "}
        c* = &radic;(2+&radic;3)&minus;1 &asymp; {cc.cStarClosed.toFixed(8)} to machine precision,
        and the onset rises monotonically with K toward 1 &mdash; so the single shell (K=1) is the
        <em> worst</em> symmetric case. Every onset sits far above the Theorem-C basin constant{" "}
        {cc.theoremCConstant}.
      </p>

      {/* imp-3036: surface the exact defining quartic + u-substitution and the closure-status line */}
      <div style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ color: "#06b6d4", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          Closed form (imp-3005, Lemma R2-T2)
        </div>
        <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.8 }}>
          The K=1 worsening onset is the unique root in (0,1) of the quartic{" "}
          <span style={{ fontFamily: "monospace", color: "#06b6d4" }}>&rho;&#8308; + 4&rho;&sup3; + 2&rho;&sup2; &minus; 4&rho; &minus; 2 = 0</span>.
          The substitution <span style={{ fontFamily: "monospace", color: "#e2e8f0" }}>u = &rho;&sup2; + 2&rho;</span> collapses it to the
          quadratic <span style={{ fontFamily: "monospace", color: "#e2e8f0" }}>u&sup2; &minus; 2u &minus; 2 = 0</span>, giving the radical
          <strong style={{ color: "#06b6d4" }}> c* = &radic;(2+&radic;3) &minus; 1 = (1+&radic;3)/&radic;2 &minus; 1 &asymp; {cc.cStarClosed.toFixed(8)}</strong>.
        </div>
        <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 6, lineHeight: 1.7 }}>
          <strong style={{ color: "#10b981" }}>CLOSED:</strong> single-neighbour onset c = 1, the symmetric
          single-shell c* (above, in closed form), and the unconditional &Theta; &le; 1/4 trap.{" "}
          <strong style={{ color: "#f59e0b" }}>OPEN:</strong> the global asymmetric multi-body constant below c*
          (imp-3021 brackets it in &asymp;(0.90, 0.94); still no closed form).
        </div>
      </div>

      <div style={{ overflowX: "auto", marginBottom: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              {["Shell count K", "Bodies (2K+2)", "Worsening onset rho*", "rho* - c*", "Margin over 0.72"].map((h) => (
                <th key={h} style={{ color: "#64748b", fontWeight: 600, padding: "5px 8px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cc.shells.map((r) => (
              <tr key={r.shellCount} style={{ borderBottom: "1px solid #1e293b" }}>
                <td style={{ padding: "6px 8px", color: "#e2e8f0" }}>
                  {r.shellCount}
                  {r.shellCount === 1 && (
                    <span style={{ marginLeft: 6, background: "rgba(6,182,212,0.15)", color: "#06b6d4", padding: "1px 5px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
                      = c* (closed form)
                    </span>
                  )}
                </td>
                <td style={{ padding: "6px 8px", color: "#94a3b8", fontFamily: "monospace" }}>{2 * r.shellCount + 2}</td>
                <td style={{ padding: "6px 8px", color: "#06b6d4", fontFamily: "monospace" }}>{r.onsetNumeric.toFixed(8)}</td>
                <td style={{ padding: "6px 8px", color: "#f59e0b", fontFamily: "monospace" }}>
                  {Math.abs(r.deltaFromCStar) < 1e-7 ? "<1e-7" : "+" + r.deltaFromCStar.toFixed(6)}
                </td>
                <td style={{ padding: "6px 8px", color: "#10b981", fontFamily: "monospace" }}>
                  +{(r.onsetNumeric - cc.theoremCConstant).toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
            Asymmetric minimal-pair scan
          </div>
          <div style={{ color: "#e2e8f0", fontSize: 13 }}>
            inf &asymp; <strong>{cc.asymMinPairScan}</strong> &lt; c* (imp-3005, 2e6 configs)
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
            Asymmetric configs worsen marginally <em>earlier</em> than the symmetric closed form.
          </div>
        </div>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ color: "#10b981", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
            Adversarial multi-body scan
          </div>
          <div style={{ color: "#e2e8f0", fontSize: 13 }}>
            inf &asymp; <strong>{cc.scannedMultiBodyInf}</strong> &gt; c* (Lemma R2-T, 3e6 configs)
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
            Brackets the closed form c* &asymp; {cc.cStarClosed.toFixed(5)} from above.
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          Honest residual: global multi-body constant stays OPEN
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>
          {cc.agreement}
        </div>
      </div>
    </div>
  );
}

// imp-3098: surface the imp-3067 CTHETA_FLAT_INVARIANT certified export
// (off-basin g0 * dTheta/dW_1 = 16/27, flat to machine precision over a deep
// g0-halving sweep). This SURFACES the certified result; it does not recompute
// it. MANDATORY caveat: scale-law SIGNATURE only -- does NOT close the
// off-basin divergence; PT Lambda <= 0.2 stays the rigorous SOTA.
function ConditioningCollapseBars() {
  const m = IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING.measured;
  // Three quantities, each measured in the raw diagonal-only (imp-3066) basis vs the
  // full-passive-Gram orthonormalized basis. The operator/diagonal gap "after" bar carries
  // the strictly-positive surviving residual gap that is NOT a conditioning artifact.
  const groups = [
    {
      label: 'Operator norm ||R||',
      before: m.operatorNormImp3066Diagonal,
      after: m.operatorNormGramSchmidt,
      residual: false,
    },
    {
      label: 'Operator/diag gap',
      before: m.operatorDiagonalGapImp3066Diagonal,
      after: m.operatorDiagonalGapGramSchmidt,
      residual: true, // the part that SURVIVES orthogonalization
    },
    {
      label: 'Off-diag Frobenius',
      before: m.offDiagonalFrobeniusImp3066Diagonal,
      after: m.offDiagonalFrobeniusGramSchmidt,
      residual: false,
    },
  ];

  const svgW = 520, svgH = 270, padL = 44, padR = 16, padT = 16, padB = 60;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const yMax = 5; // tallest bar is the raw operator norm ~4.62
  const yS = (v) => padT + chartH * (1 - Math.min(v, yMax) / yMax);
  const yBase = padT + chartH;

  const groupW = chartW / groups.length;
  const barW = 40;
  const gap = 10; // space between the paired before/after bars

  const yTicks = [0, 1, 2, 3, 4, 5];

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f472b6' }}>
      <h3 style={{ color: '#f472b6', fontSize: 16, marginBottom: 8 }}>
        Conditioning Collapse: Raw Monomial vs Orthonormalized Basis (imp-3086)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        imp-3066 normalized the de-homogenized operator by only the <em>diagonal</em> of the passive
        cosh Gram, dropping its dense positive off-diagonal cross-terms on an ill-conditioned monomial
        basis. Restoring the full passive Gram via Gram-Schmidt orthonormalization collapses all three
        measured quantities &mdash; operator norm{' '}
        <strong style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>
          {m.operatorNormImp3066Diagonal.toFixed(2)}&nbsp;&rarr;&nbsp;{m.operatorNormGramSchmidt.toFixed(2)}
        </strong>
        , operator/diagonal gap{' '}
        <strong style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>
          {m.operatorDiagonalGapImp3066Diagonal.toFixed(2)}&nbsp;&rarr;&nbsp;{m.operatorDiagonalGapGramSchmidt.toFixed(2)}
        </strong>
        , off-diag Frobenius{' '}
        <strong style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>
          {m.offDiagonalFrobeniusImp3066Diagonal.toFixed(2)}&nbsp;&rarr;&nbsp;{m.offDiagonalFrobeniusGramSchmidt.toFixed(2)}
        </strong>{' '}
        &mdash; so the imp-3066 gap was <strong style={{ color: '#e2e8f0' }}>largely a basis-conditioning
        artifact</strong>. But a strictly-positive residual gap (pink-highlighted bar) of{' '}
        <strong style={{ color: '#f472b6', fontFamily: 'monospace' }}>
          {m.operatorDiagonalGapGramSchmidt.toFixed(3)}
        </strong>{' '}
        survives: the off-diagonal endpoint-Hankel obstruction is real, just far smaller than the raw
        basis advertised. The operator norm itself is a <strong style={{ color: '#e2e8f0' }}>basis
        invariant</strong> &mdash; triangular Gram-Schmidt and symmetric Loewdin orthogonalization agree
        to{' '}
        <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>
          rel-diff {m.operatorNormInvarianceRelDiff.toExponential(1)}
        </strong>
        .
      </p>

      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        {/* Y-axis grid + ticks */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={padL} y1={yS(v)} x2={svgW - padR} y2={yS(v)} stroke="#1e293b" strokeWidth={1} />
            <text x={padL - 5} y={yS(v) + 3} fill="#475569" fontSize={8} textAnchor="end">{v}</text>
          </g>
        ))}

        {groups.map((g, gi) => {
          const cx = padL + groupW * (gi + 0.5);
          const xBefore = cx - barW - gap / 2;
          const xAfter = cx + gap / 2;
          return (
            <g key={g.label}>
              {/* raw monomial (before) bar */}
              <rect x={xBefore} y={yS(g.before)} width={barW} height={yBase - yS(g.before)}
                fill="#64748b" opacity={0.85} />
              <text x={xBefore + barW / 2} y={yS(g.before) - 4} fill="#94a3b8" fontSize={9}
                textAnchor="middle">{g.before.toFixed(2)}</text>

              {/* orthonormalized (after) bar; residual gap highlighted pink */}
              <rect x={xAfter} y={yS(g.after)} width={barW} height={yBase - yS(g.after)}
                fill={g.residual ? '#f472b6' : '#06b6d4'} opacity={0.9} />
              <text x={xAfter + barW / 2} y={yS(g.after) - 4}
                fill={g.residual ? '#f472b6' : '#22d3ee'} fontSize={9}
                textAnchor="middle">{g.after.toFixed(2)}</text>

              {/* group label */}
              <text x={cx} y={yBase + 14} fill="#94a3b8" fontSize={9} textAnchor="middle">{g.label}</text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={padL} y1={yBase} x2={svgW - padR} y2={yBase} stroke="#334155" strokeWidth={1} />
        <line x1={padL} y1={padT} x2={padL} y2={yBase} stroke="#334155" strokeWidth={1} />

        {/* Legend */}
        <rect x={padL + 6} y={svgH - 30} width={12} height={12} fill="#64748b" opacity={0.85} />
        <text x={padL + 22} y={svgH - 20} fill="#94a3b8" fontSize={9}>raw monomial (diag-only)</text>
        <rect x={padL + 170} y={svgH - 30} width={12} height={12} fill="#06b6d4" opacity={0.9} />
        <text x={padL + 186} y={svgH - 20} fill="#94a3b8" fontSize={9}>orthonormalized</text>
        <rect x={padL + 300} y={svgH - 30} width={12} height={12} fill="#f472b6" opacity={0.9} />
        <text x={padL + 316} y={svgH - 20} fill="#94a3b8" fontSize={9}>surviving residual</text>
      </svg>

      <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
        <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          Honest scope: diagnostic on the representative truncation &mdash; no RH verdict
        </div>
        <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
          Structural diagnostic on the same representative degree-{IMP3086_ORTHOGONALIZED_BASIS_CONDITIONING.construction.degree}{' '}
          monomial-moment truncation as imp-3066 &mdash; <strong style={{ color: '#e2e8f0' }}>not</strong> the
          section-26 Gram. The orthonormalized operator norm ({m.operatorNormGramSchmidt.toFixed(2)}) carries no
          RH verdict; positivity was not attempted; this is not a proof or reduction. Platt-Trudgian
          &Lambda;&nbsp;&le;&nbsp;0.2 remains the rigorous SOTA.
        </div>
      </div>
    </div>
  );
}

function CThetaFlatInvariantPanel() {
  const inv = CTHETA_FLAT_INVARIANT;
  const tbl = inv.table;
  // Sample first / middle / last rows so the ~6-decade span reads at a glance.
  const sampled = [tbl[0], tbl[Math.floor(tbl.length / 2)], tbl[tbl.length - 1]];

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: "3px solid #a78bfa" }}>
      <h3 style={{ color: "#a78bfa", fontSize: 16, marginBottom: 8 }}>
        Off-Basin C&#x398; Scale-Law Signature: g&#x2080;&middot;d&#x398;/dW&#x2081; = 16/27 (certified flat, imp-3067)
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        On the crowded off-basin lattice (&rho;&nbsp;=&nbsp;1) the C&#x398; sensitivity
        d&#x398;/dW&#x2081; blows up like 1/g&#x2080;, but the{" "}
        <strong style={{ color: "#e2e8f0" }}>product</strong>{" "}
        g&#x2080;&middot;d&#x398;/dW&#x2081; is g&#x2080;-independent and pinned at{" "}
        <strong style={{ color: "#a78bfa", fontFamily: "monospace" }}>
          16/27 = {(16 / 27).toFixed(7)}
        </strong>
        . The imp-3067 export <code style={{ color: "#e2e8f0" }}>CTHETA_FLAT_INVARIANT</code>{" "}
        certifies this directly: the same central finite-difference measured over a{" "}
        <strong style={{ color: "#e2e8f0" }}>{tbl.length}-halving</strong>{" "}
        (~{inv.decadesSpanned.toFixed(2)}-decade) g&#x2080; sweep stays pinned to within{" "}
        <strong style={{ color: "#10b981", fontFamily: "monospace" }}>
          max-dev {inv.maxDeviationFrom16over27.toExponential(1)}
        </strong>{" "}
        &lt; 1e-9. This is the scale-free signature of the off-basin C&#x398; divergence &mdash; not
        an artefact of the chosen g&#x2080;.
      </p>

      <div style={{ overflowX: "auto", marginBottom: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              {["g₀ (sweep)", "g₀·dΘ/dW₁", "deviation from 16/27"].map((h) => (
                <th key={h} style={{ color: "#64748b", fontWeight: 600, padding: "5px 8px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampled.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                <td style={{ padding: "6px 8px", color: "#94a3b8", fontFamily: "monospace" }}>{r.g0.toExponential(3)}</td>
                <td style={{ padding: "6px 8px", color: "#a78bfa", fontFamily: "monospace" }}>{r.product.toFixed(10)}</td>
                <td style={{ padding: "6px 8px", color: "#10b981", fontFamily: "monospace" }}>{r.deviation.toExponential(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>
          First / middle / last of {tbl.length} sampled rows; full table in CTHETA_FLAT_INVARIANT (imp-3067).
        </div>
      </div>

      <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          Honest scope: scale-law signature only &mdash; does NOT close the off-basin divergence
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>
          {inv.honest}
        </div>
      </div>
    </div>
  );
}

// imp-3096: two-curve log-log visualization of the imp-3022 C_Theta sensitivity.
// Plots dTheta/dW_1 vs g0 on log-log axes for BOTH regimes over the same ~6-decade
// g0 sweep: the off-basin (crowded, rho == 1) 1/g0 BLOWUP (slope -1, sensitivity
// dTheta/dW_1 = (16/27)/g0 climbing as g0 falls) against the on-basin (isolated,
// rho -> 0) VANISHING line (slope +1, dTheta/dW_1 = 2 g0/D^2 -> 0). The off-basin
// column is reconstructed as product/g0 from the certified CTHETA_FLAT_INVARIANT
// table (the flat product g0*dTheta/dW_1 = 16/27); the on-basin column is onDW
// straight from CTHETA_ON_BASIN_VANISHING. UX only: does NOT close the off-basin
// divergence; PT Lambda <= 0.2 stays SOTA.
function CThetaSensitivityLogLogPlot() {
  const off = CTHETA_FLAT_INVARIANT.table.map((r) => ({ g0: r.g0, dW: r.product / r.g0 }));
  const on = CTHETA_ON_BASIN_VANISHING.table.map((r) => ({ g0: r.g0, dW: r.onDW }));
  const log10 = (v) => Math.log10(v);

  const xs = off.map((p) => log10(p.g0));
  const ys = [...off, ...on].map((p) => log10(p.dW));
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.floor(Math.min(...ys)), yMax = Math.ceil(Math.max(...ys));

  const svgW = 540, svgH = 320, padL = 50, padR = 18, padT = 18, padB = 56;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const xS = (lg) => padL + (chartW * (lg - xMin)) / (xMax - xMin);
  const yS = (ly) => padT + chartH * (1 - (ly - yMin) / (yMax - yMin));

  const polyOff = off.map((p) => `${xS(log10(p.g0))},${yS(log10(p.dW))}`).join(' ');
  const polyOn = on.map((p) => `${xS(log10(p.g0))},${yS(log10(p.dW))}`).join(' ');

  const xTicks = [];
  for (let t = Math.ceil(xMin); t <= Math.floor(xMax); t++) xTicks.push(t);
  const yTicks = [];
  for (let t = yMin; t <= yMax; t += 2) yTicks.push(t);

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f97316' }}>
      <h3 style={{ color: '#f97316', fontSize: 16, marginBottom: 8 }}>
        C&#x398; Sensitivity in g&#x2080;-Space: Off-Basin 1/g&#x2080; Blowup vs On-Basin Vanishing (imp-3096)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        The same imp-3022 sensitivity column, now in <strong style={{ color: '#e2e8f0' }}>g&#x2080;/sensitivity
        space</strong> (distinct from the &#x398;(&rho;) phase plot and the d&rho;/ds self-isolation plots,
        which live in &rho;-space). On log-log axes the two basins are mirror-image straight lines about the
        &rho;* = 2/3 regime split. <strong style={{ color: '#f97316' }}>Off-basin</strong> (crowded lattice,
        &rho; = 1): d&#x398;/dW&#x2081; = (16/27)/g&#x2080; climbs with <strong style={{ color: '#e2e8f0' }}>slope
        &minus;1</strong> (11.97&nbsp;&rarr;&nbsp;95.77 over the first three halvings, &rarr;&nbsp;
        {(off[off.length - 1].dW).toExponential(1)} at the sweep floor) &mdash; the flat product
        g&#x2080;&middot;d&#x398;/dW&#x2081; = <strong style={{ color: '#f97316', fontFamily: 'monospace' }}>16/27
        = {(16 / 27).toFixed(5)}</strong>. <strong style={{ color: '#22d3ee' }}>On-basin</strong> (isolated pair,
        &rho;&nbsp;&rarr;&nbsp;0): d&#x398;/dW&#x2081; = 2&nbsp;g&#x2080;/D&sup2; vanishes with{' '}
        <strong style={{ color: '#e2e8f0' }}>slope +1</strong>, halving at every halving.
      </p>

      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        {/* grid + y ticks (log10 dTheta/dW_1) */}
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line x1={padL} y1={yS(t)} x2={svgW - padR} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
            <text x={padL - 6} y={yS(t) + 3} fill="#475569" fontSize={8} textAnchor="end">{`1e${t}`}</text>
          </g>
        ))}
        {/* x ticks (log10 g0) */}
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line x1={xS(t)} y1={padT} x2={xS(t)} y2={padT + chartH} stroke="#1e293b" strokeWidth={1} />
            <text x={xS(t)} y={padT + chartH + 14} fill="#475569" fontSize={8} textAnchor="middle">{`1e${t}`}</text>
          </g>
        ))}

        {/* off-basin blowup (slope -1) */}
        <polyline points={polyOff} fill="none" stroke="#f97316" strokeWidth={2} />
        {off.map((p, i) => (
          <circle key={`off${i}`} cx={xS(log10(p.g0))} cy={yS(log10(p.dW))} r={2} fill="#f97316" />
        ))}
        {/* on-basin vanishing (slope +1) */}
        <polyline points={polyOn} fill="none" stroke="#22d3ee" strokeWidth={2} />
        {on.map((p, i) => (
          <circle key={`on${i}`} cx={xS(log10(p.g0))} cy={yS(log10(p.dW))} r={2} fill="#22d3ee" />
        ))}

        {/* axes */}
        <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH} stroke="#334155" strokeWidth={1} />
        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#334155" strokeWidth={1} />

        {/* axis labels */}
        <text x={padL + chartW / 2} y={svgH - 6} fill="#64748b" fontSize={10} textAnchor="middle">log&#8321;&#8320; g&#8320; (gap scale)</text>
        <text x={14} y={padT + chartH / 2} fill="#64748b" fontSize={10} textAnchor="middle"
          transform={`rotate(-90 14 ${padT + chartH / 2})`}>log&#8321;&#8320; d&#x398;/dW&#8321;</text>

        {/* curve labels */}
        <text x={xS(xMin) + 6} y={yS(log10(off[off.length - 1].dW)) + 2} fill="#f97316" fontSize={9}>off-basin: slope &minus;1 (16/27)/g&#8320;</text>
        <text x={xS(xMin) + 6} y={yS(log10(on[on.length - 1].dW)) - 4} fill="#22d3ee" fontSize={9}>on-basin: slope +1, 2g&#8320;/D&sup2;</text>

        {/* legend */}
        <rect x={padL + 6} y={svgH - 30} width={12} height={3} fill="#f97316" />
        <text x={padL + 22} y={svgH - 25} fill="#94a3b8" fontSize={9}>off-basin &rho;=1 blowup (flat product 16/27)</text>
        <rect x={padL + 300} y={svgH - 30} width={12} height={3} fill="#22d3ee" />
        <text x={padL + 316} y={svgH - 25} fill="#94a3b8" fontSize={9}>on-basin &rho;&rarr;0 vanishing</text>
      </svg>

      <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
        <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          Honest scope: g&#x2080;-space visualization only &mdash; does NOT close the off-basin divergence
        </div>
        <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
          The two lines separate exactly at &rho;* = 2/3 (where &#x398; hits the Theorem-A trap 1/4): below it
          the on-basin sensitivity vanishes, above it the off-basin sensitivity diverges as 1/g&#x2080;. This
          MEASURES why the reconditioning is only basin-conditional; it does not remove the off-basin
          blowup. Platt-Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 stays the rigorous SOTA; the finite-N*=1e4
          beat stays an ESTIMATE. No false QED.
        </div>
      </div>
    </div>
  );
}

// imp-3038: surface the two EXACT analytic identities (Lemma 1 dE/ds, Lemma 2
// dTheta/ds) -- the analytic engine of the whole Theta-trap result -- with their
// independent cross-N re-verification max-rel-err (SG1C_LEMMA1_CROSS_N / _LEMMA2_CROSS_N).
function VerifiedAnalyticIdentitiesCard() {
  const l1 = SG1C_LEMMA1_CROSS_N;
  const l2 = SG1C_LEMMA2_CROSS_N;
  return (
    <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #22d3ee' }}>
      <h3 style={{ color: '#22d3ee', fontSize: 16, marginBottom: 8 }}>
        Verified Analytic Identities: the Exact dE/ds &amp; d&#x398;/ds Engine (imp-3038)
      </h3>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>
        Both static closed-form trap thresholds (Theorem A at &#x398;&nbsp;=&nbsp;1/4, Theorem B
        at &#x398;<sub>b</sub>&nbsp;=&nbsp;0.443) descend from two <strong style={{ color: '#e2e8f0' }}>exact</strong>{' '}
        rate identities for the tracked adjacent pair, where{' '}
        <InlineMath tex={"T_j = 1/\\big((x_i - x_j)(x_{i+1} - x_j)\\big)"} />,{' '}
        <InlineMath tex={"E = \\sum_j T_j"} />, <InlineMath tex={"g = x_{i+1}-x_i"} /> the pair gap,
        and <InlineMath tex={"\\Theta = g^2 E / 2"} />. They hold for every adjacent pair at every N
        (no hypothesis):
      </p>

      <div style={{ marginBottom: 6 }}>
        <div style={{ color: '#64748b', fontSize: 12, marginBottom: 2 }}>Lemma 1 (environment energy rate):</div>
        <BlockMath tex={"\\frac{dE}{ds} = -2E^2 + 12\\sum_j T_j^2 + 4g^2\\sum_j T_j^3"} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: '#64748b', fontSize: 12, marginBottom: 2 }}>Lemma 2 (trap-coordinate rate):</div>
        <BlockMath tex={"\\frac{d\\Theta}{ds} = -\\frac{4\\,\\Theta(2-\\Theta)}{g^2} + 6g^2\\sum_j T_j^2 + 2g^4\\sum_j T_j^3"} />
      </div>

      <div style={{ overflowX: 'auto', marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Identity', 'Independent reference', 'Max rel err (N-sweep)', 'Worst N'].map((h) => (
                <th key={h} style={{ color: '#64748b', fontWeight: 600, padding: '5px 8px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '6px 8px', color: '#94a3b8' }}>Lemma 1 dE/ds</td>
              <td style={{ padding: '6px 8px', color: '#94a3b8' }}>chain-rule (algebraically distinct)</td>
              <td style={{ padding: '6px 8px', color: '#10b981', fontFamily: 'monospace' }}>{l1.worstRelErrChain.toExponential(1)}</td>
              <td style={{ padding: '6px 8px', color: '#475569', fontFamily: 'monospace' }}>{l1.worstChainRow.N}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '6px 8px', color: '#94a3b8' }}>Lemma 1 dE/ds</td>
              <td style={{ padding: '6px 8px', color: '#94a3b8' }}>central finite differences</td>
              <td style={{ padding: '6px 8px', color: '#10b981', fontFamily: 'monospace' }}>{l1.worstRelErrFd.toExponential(1)}</td>
              <td style={{ padding: '6px 8px', color: '#475569', fontFamily: 'monospace' }}>{l1.worstFdRow.N}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '6px 8px', color: '#94a3b8' }}>Lemma 2 d&#x398;/ds</td>
              <td style={{ padding: '6px 8px', color: '#94a3b8' }}>central finite differences</td>
              <td style={{ padding: '6px 8px', color: '#10b981', fontFamily: 'monospace' }}>{l2.worstRelErr.toExponential(1)}</td>
              <td style={{ padding: '6px 8px', color: '#475569', fontFamily: 'monospace' }}>{l2.worstRow.N}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>
          Recomputed live at build over N &#x2208; {'{4,6,8,12,20,50}'}, 8 deterministic configs each
          (SG1C_LEMMA1_CROSS_N / SG1C_LEMMA2_CROSS_N, imp-3025 / imp-3041).
        </div>
      </div>

      <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
        The Lemma 1 chain-rule witness &mdash; which never forms{' '}
        <InlineMath tex={"E^2"} />, <InlineMath tex={"\\sum T^2"} />, or <InlineMath tex={"\\sum T^3"} />{' '}
        &mdash; agrees to <strong style={{ color: '#e2e8f0' }}>machine precision</strong>, certifying the
        identity is EXACT rather than merely fit to finite-difference noise; the finite-difference legs
        sit at the step-roundoff floor (~1e-8). Numerical re-verification of load-bearing algebra; no new claim.
      </p>
    </div>
  );
}

// imp-3185: asymmetric multi-body isolation closed form (imp-3170)
function AsymIsolationClosedFormPanel() {
  const d = SG1C_ASYM_ISOLATION_CLOSED_FORM;
  return (
    <div className="card" style={{ marginTop: 24, borderLeft: "3px solid #f97316" }}>
      <h3 style={{ color: "#f97316", fontSize: 16, marginBottom: 4 }}>
        Asymmetric Multi-Body Isolation Onset: Closed Form (imp-3170)
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        The multi-body asymmetric worst-case class left open by imp-3045 is now closed in{" "}
        <strong style={{ color: "#f97316" }}>transcendental</strong> form.
        The onset c<sub>asym</sub> is the unique root in (0,1) of the transcendental equation:
      </p>

      <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8, padding: "10px 16px", marginBottom: 14 }}>
        <div style={{ fontFamily: "monospace", color: "#f97316", fontSize: 14, marginBottom: 6 }}>
          {d.transcendentalEquation}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12 }}>
          Config class: {d.configClass}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10, marginBottom: 16 }}>
        <div style={{ padding: "10px 12px", background: "rgba(30,41,59,0.6)", borderRadius: 6, borderTop: "2px solid #f97316" }}>
          <div style={{ color: "#f97316", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>c_asym (transcendental)</div>
          <div style={{ color: "#e2e8f0", fontFamily: "monospace", fontSize: 13 }}>{d.cAsym.toFixed(10)}</div>
          <div style={{ color: "#64748b", fontSize: 10, marginTop: 3 }}>digamma root of drho/ds = 0</div>
        </div>
        <div style={{ padding: "10px 12px", background: "rgba(30,41,59,0.6)", borderRadius: 6, borderTop: "2px solid #06b6d4" }}>
          <div style={{ color: "#06b6d4", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>c* symmetric (algebraic)</div>
          <div style={{ color: "#e2e8f0", fontFamily: "monospace", fontSize: 13 }}>{d.symmetricUpperEnd.toFixed(8)}</div>
          <div style={{ color: "#64748b", fontSize: 10, marginTop: 3 }}>sqrt(2+sqrt(3))-1, K=1 shell</div>
        </div>
        <div style={{ padding: "10px 12px", background: "rgba(30,41,59,0.6)", borderRadius: 6, borderTop: "2px solid #10b981" }}>
          <div style={{ color: "#10b981", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Basin margin</div>
          <div style={{ color: "#e2e8f0", fontFamily: "monospace", fontSize: 13 }}>{d.preservedBasinMargin.toFixed(4)}</div>
          <div style={{ color: "#64748b", fontSize: 10, marginTop: 3 }}>c_asym - 0.72 = 0.1828 &gt; 0</div>
        </div>
        <div style={{ padding: "10px 12px", background: "rgba(30,41,59,0.6)", borderRadius: 6, borderTop: "2px solid #64748b" }}>
          <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>drho/ds at basin 0.72</div>
          <div style={{ color: "#e2e8f0", fontFamily: "monospace", fontSize: 13 }}>{d.basinDrho.toFixed(4)}</div>
          <div style={{ color: "#64748b", fontSize: 10, marginTop: 3 }}>strongly self-improving (&lt; 0)</div>
        </div>
      </div>

      <div style={{ background: "rgba(30,41,59,0.5)", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 12, marginBottom: 8 }}>
          Why two different worlds: algebraic d_1 side vs transcendental digamma lattice tail
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.8 }}>
          <strong style={{ color: "#06b6d4" }}>d_1 side (nearest neighbour) telescopes algebraically:</strong>{" "}
          <span style={{ fontFamily: "monospace", color: "#e2e8f0" }}>
            v_0 - v_{"{-1}"} = 1/g - 2
          </span>{" "}
          (value at c_asym: {d.d1SideClosedForm.toFixed(6)}). The infinite sum over the left side
          collapses because every term beyond the nearest neighbour cancels exactly.
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.8, marginTop: 6 }}>
          <strong style={{ color: "#f97316" }}>Pair-gap side carries the irreducible digamma tail:</strong>{" "}
          the opposite uniform lattice contributes{" "}
          <span style={{ fontFamily: "monospace", color: "#e2e8f0" }}>
            psi(g+1) + gamma = sum_k[1/k - 1/(g+k)]
          </span>{" "}
          (value at c_asym: {d.latticeTailDigamma.toFixed(6)}). This sum does NOT telescope -- it
          converges to the digamma transcendental. That is the precisely-located obstruction to an
          algebraic closed form beyond the single nearest neighbour.
        </div>
      </div>

      <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          Corrects imp-3045 numerical bracket ~0.9032-0.9039
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>
          The imp-3045 bisection locked onto a <strong style={{ color: "#e2e8f0" }}>discontinuity of
          the discrete minimal-gap selector</strong> near g ~ 0.9029, not onto the smooth drho/ds zero.
          At g = {d.scanDiscontinuityValue.toFixed(10)}, the true drho/ds is{" "}
          <strong style={{ color: "#f59e0b" }}>&gt; 0</strong>{" "}
          ({d.scanWasHigh ? "confirmed HIGH" : "check failed"}), so the genuine continuous onset sits
          strictly below it. The closed form pins it at c_asym = {d.cAsym.toFixed(10)}.
        </div>
      </div>

      <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
          Honest status
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>
          {d.honest}
        </div>
        <div style={{ color: "#64748b", fontSize: 11, marginTop: 6, lineHeight: 1.6 }}>
          <strong style={{ color: "#f59e0b" }}>Open sub-gap:</strong> {d.openSubGap}
        </div>
      </div>
    </div>
  );
}

// imp-3203: viz of the imp-3173 minimal-gap selector discontinuity
function MinGapSelectorDiscontinuityViz() {
  const d = SG1C_MINGAP_SELECTOR_DISCONTINUITY;

  const data = useMemo(() => {
    const R = 64;
    const vel = (x) => x.map((xi, i) => -x.reduce((s, xj, j) => (i === j ? s : s + 1 / (xi - xj)), 0));
    const gaps = (x) => { const g = []; for (let i = 1; i < x.length; i++) g.push(x[i] - x[i - 1]); return g; };
    function cfg(g) { const x = [-1, 0, g]; for (let k = 1; k <= R; k++) x.push(g + k); return x.sort((a, b) => a - b); }
    function leftBranch(g) {
      const x = cfg(g), G = gaps(x), v = vel(x), gi = 1;
      const dg = v[gi + 1] - v[gi], d1 = G[gi - 1], near = gi, nbr = gi - 1;
      return dg / d1 - (g * (v[near] - v[nbr])) / (d1 * d1);
    }
    function rightBranch(g) {
      const x = cfg(g), G = gaps(x), v = vel(x), gi = 1;
      const dg = v[gi + 1] - v[gi], d1 = G[gi + 1], near = gi + 1, nbr = gi + 2;
      return dg / d1 - (g * (v[nbr] - v[near])) / (d1 * d1);
    }
    function naiveSel(g) {
      const x = cfg(g), G = gaps(x), gi = G.indexOf(Math.min(...G));
      const pi = gi, pj = gi + 1;
      let d1 = Infinity, near = -1, nbr = -1;
      if (gi - 1 >= 0 && G[gi - 1] < d1) { d1 = G[gi - 1]; near = pi; nbr = gi - 1; }
      if (gi + 1 < G.length && G[gi + 1] < d1) { d1 = G[gi + 1]; near = pj; nbr = gi + 2; }
      if (near < 0) return null;
      const v = vel(x), dg = v[pj] - v[pi];
      const dd1 = x[nbr] > x[near] ? v[nbr] - v[near] : v[near] - v[nbr];
      return dg / d1 - (g * dd1) / (d1 * d1);
    }
    const N = 280, lo = 0.901, hi = 0.905;
    const left = [], right = [], naive = [];
    for (let i = 0; i <= N; i++) {
      const g = lo + (hi - lo) * i / N;
      left.push({ g, v: leftBranch(g) });
      right.push({ g, v: rightBranch(g) });
      const nv = naiveSel(g);
      if (nv !== null) naive.push({ g, v: nv });
    }
    return { left, right, naive };
  }, []);

  const svgW = 580, svgH = 210;
  const padL = 50, padR = 18, padT = 18, padB = 34;
  const chartW = svgW - padL - padR, chartH = svgH - padT - padB;
  const gLo = 0.901, gHi = 0.905, vLo = -0.85, vHi = 0.28;
  const xS = (g) => padL + (g - gLo) / (gHi - gLo) * chartW;
  const yS = (v) => padT + chartH - (v - vLo) / (vHi - vLo) * chartH;
  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${xS(p.g).toFixed(1)},${yS(p.v).toFixed(1)}`).join(' ');

  const xOnset = xS(d.trueOnsetClosedForm);
  const xFalse = xS(d.scanFalseOnset);
  const yZero = yS(0);

  return (
    <div className="card" style={{ marginTop: 24, borderLeft: "3px solid #8b5cf6" }}>
      <h3 style={{ color: "#8b5cf6", fontSize: 16, marginBottom: 4 }}>
        Minimal-Gap Selector Discontinuity (imp-3173): LEFT vs RIGHT Branch
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
        The imp-3045 bisection was trapped by a discrete-selector round-off artifact.
        Near g&nbsp;&isin;&nbsp;(0.901,&nbsp;0.905) the naive strict-"&lt;" d<sub>1</sub> tie-break
        flips <strong style={{ color: "#e2e8f0" }}>{d.selectorFlipsNearOnset.toLocaleString()} times</strong>,
        switching between two smooth branches:
        the <strong style={{ color: "#06b6d4" }}>LEFT (correct)</strong> branch that crosses zero at
        the true c<sub>asym</sub>, and the <strong style={{ color: "#ef4444" }}>RIGHT (spurious)</strong> branch
        flat at ~&minus;0.59 with no zero near the onset.
      </p>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", maxWidth: svgW, display: "block" }}>
        <line x1={padL} y1={yZero} x2={svgW - padR} y2={yZero} stroke="#334155" strokeWidth={1} />

        {data.naive.map((p, i) => (
          <circle key={i} cx={xS(p.g).toFixed(1)} cy={yS(p.v).toFixed(1)} r={1.2}
            fill={p.v > -0.3 ? "#06b6d4" : "#ef4444"} opacity={0.35} />
        ))}

        <path d={toPath(data.right)} stroke="#ef4444" strokeWidth={1.5} fill="none" strokeDasharray="4 2" opacity={0.85} />
        <path d={toPath(data.left)} stroke="#06b6d4" strokeWidth={2} fill="none" />

        <line x1={xOnset} y1={padT} x2={xOnset} y2={padT + chartH}
          stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={xOnset + 3} y={padT + 13} fill="#10b981" fontSize={8}>c_asym</text>
        <text x={xOnset + 3} y={padT + 22} fill="#10b981" fontSize={7.5}>{d.trueOnsetClosedForm.toFixed(6)}</text>

        <line x1={xFalse} y1={padT} x2={xFalse} y2={padT + chartH}
          stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={xFalse + 3} y={padT + 35} fill="#f59e0b" fontSize={8}>imp-3045</text>
        <text x={xFalse + 3} y={padT + 45} fill="#f59e0b" fontSize={7.5}>{d.scanFalseOnset.toFixed(7)}</text>

        <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH} stroke="#334155" strokeWidth={1} />
        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#334155" strokeWidth={1} />

        {[-0.8, -0.6, -0.4, -0.2, 0.0, 0.2].map((v) => (
          <g key={v}>
            <text x={padL - 4} y={yS(v) + 3} fill="#475569" fontSize={7.5} textAnchor="end">{v.toFixed(1)}</text>
            <line x1={padL - 3} y1={yS(v)} x2={padL} y2={yS(v)} stroke="#334155" />
          </g>
        ))}
        <text x={12} y={padT + chartH / 2} fill="#94a3b8" fontSize={8.5} textAnchor="middle"
          transform={`rotate(-90, 12, ${padT + chartH / 2})`}>
          d&rho;/ds
        </text>

        {[0.901, 0.902, 0.903, 0.904, 0.905].map((v) => (
          <g key={v}>
            <text x={xS(v)} y={padT + chartH + 13} fill="#475569" fontSize={7.5} textAnchor="middle">
              {v.toFixed(3)}
            </text>
            <line x1={xS(v)} y1={padT + chartH} x2={xS(v)} y2={padT + chartH + 4} stroke="#334155" />
          </g>
        ))}
        <text x={padL + chartW / 2} y={svgH - 3} fill="#94a3b8" fontSize={9} textAnchor="middle">
          g (isolation ratio, R=64 approximation)
        </text>
      </svg>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8, fontSize: 11 }}>
        {[
          { col: "#06b6d4", label: "LEFT branch: smooth, crosses zero at true c_asym (tight -1 neighbour)" },
          { col: "#ef4444", label: "RIGHT branch: flat ~-0.59, no zero near onset (spurious lattice neighbour)" },
          { col: "#8b5cf6", label: "Naive selector scatter: chaotic jumps between branches (~1000 flips)" },
          { col: "#10b981", label: "c_asym = 0.902790 (true continuous onset, imp-3170)" },
          { col: "#f59e0b", label: "imp-3045 false onset 0.903236 (trapped above by spurious RIGHT negatives)" },
        ].map(({ col, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: col, flexShrink: 0 }} />
            <span style={{ color: "#94a3b8" }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "10px 14px", marginTop: 12 }}>
        <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Honest status</div>
        <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>{d.honest}</div>
      </div>
    </div>
  );
}

export default function SpectralAttackPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Spectral Attack on RH</h1>
        <p>
          A systematic multi-pronged attack combining information theory, twistor geometry,
          thermodynamic phase analysis, and ZX-calculus to build a confinement proof for zeta zeros.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 8 }}>The Strategy</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          Instead of relying on a single proof technique, we combine <strong>six independent measures</strong> that
          all point to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />. If these measures are genuinely independent
          (low pairwise correlation), the combined evidence is exponentially stronger than any single measure.
        </p>
      </div>

      <BlockMath tex={
        '\\Phi(\\sigma, t) = \\alpha \\cdot D_{KL}(\\sigma) + \\beta \\cdot |Z \\cdot W|^2 + ' +
        '\\gamma \\cdot (1 - |\\chi|)^2 + \\delta \\cdot \\Delta H + ' +
        '\\epsilon \\cdot (1 - C/C_{\\max}) + \\zeta \\cdot \\Delta F'
      } />

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6', fontSize: 14 }}>Six Attack Vectors</h3>
          <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 12, lineHeight: 2 }}>
            <li><strong style={{ color: '#10b981' }}>Fisher-Twistor:</strong> Fisher info diverges where twistor incidence vanishes</li>
            <li><strong style={{ color: '#06b6d4' }}>KL Lyapunov:</strong> KL divergence acts as a Lyapunov function &rarr; stability at &sigma;=&frac12;</li>
            <li><strong style={{ color: '#f59e0b' }}>Phase Barriers:</strong> Thermodynamic free energy traps zeros in critical strip</li>
            <li><strong style={{ color: '#eab308' }}>Fourier-Info:</strong> Information spectral peaks align with prime log-frequencies</li>
            <li><strong style={{ color: '#8b5cf6' }}>Confinement:</strong> Unified potential &Phi; has global minimum at &sigma;=&frac12;</li>
            <li><strong style={{ color: '#ef4444' }}>ZX Circuit:</strong> Phase gadget measurement deterministic at &sigma;=&frac12;</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b', fontSize: 14 }}>Key Insight: Independence</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
            The cross-correlation matrix reveals which measures are truly independent.
            Low correlation between Fisher information and KL divergence, for instance,
            means they provide <em>independent evidence</em> for &sigma;=&frac12;. The more independent
            measures that all converge on the same answer, the harder it is for the answer to be wrong.
          </p>
          <p style={{ color: '#ef4444', fontSize: 12, marginTop: 12, fontWeight: 600 }}>
            Caveat: Numerical convergence of independent measures is strong evidence but not proof.
            A formal proof requires showing the confinement potential has a unique minimum analytically.
          </p>
        </div>
      </div>

      {/* ─── Mathematical Foundation ─── */}
      <div className="card" style={{ marginTop: 24, marginBottom: 24, borderLeft: '3px solid #06b6d4' }}>
        <h3 style={{ color: '#06b6d4', fontSize: 16, marginBottom: 16 }}>
          Mathematical Foundation: Derivations
        </h3>

        {/* KL Lyapunov */}
        <div style={{ marginBottom: 28 }}>
          <h4 style={{ color: '#06b6d4', fontSize: 14, marginBottom: 10 }}>
            1. KL Divergence as a Lyapunov Function
          </h4>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Setup:</strong> For each <InlineMath tex={"\\sigma"} /> in the critical
            strip, define a probability distribution over primes from the Euler factors:
          </p>
          <BlockMath tex={"p_k(\\sigma) = \\frac{|1 - p_k^{-s}|^{-2}}{\\sum_j |1 - p_j^{-s}|^{-2}}, \\quad s = \\sigma + it"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
            This normalizes the squared Euler factor magnitudes into a valid distribution. At
            <InlineMath tex={"\\sigma = \\frac{1}{2}"} />, we get the reference distribution
            <InlineMath tex={"p_k^* = p_k(\\tfrac{1}{2})"} />.
          </p>

          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Step 1 — Define the KL divergence.</strong>
          </p>
          <BlockMath tex={"D_{KL}(P_\\sigma \\| P_{1/2}) = \\sum_{k=1}^{K} p_k(\\sigma) \\log \\frac{p_k(\\sigma)}{p_k(1/2)}"} />

          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Step 2 — Non-negativity (Gibbs' inequality).</strong> By the
            log-sum inequality:
          </p>
          <BlockMath tex={"D_{KL}(P_\\sigma \\| P_{1/2}) \\geq 0 \\quad \\text{with equality iff } p_k(\\sigma) = p_k(1/2) \\text{ for all } k"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Proof sketch:</strong> Apply Jensen's inequality to the concave
            function <InlineMath tex={"\\log"} />:
          </p>
          <BlockMath tex={"-D_{KL} = \\sum_k p_k(\\sigma) \\log \\frac{p_k(1/2)}{p_k(\\sigma)} \\leq \\log \\sum_k p_k(\\sigma) \\cdot \\frac{p_k(1/2)}{p_k(\\sigma)} = \\log \\sum_k p_k(1/2) = \\log 1 = 0"} />

          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Step 3 — Lyapunov interpretation.</strong> Since
            <InlineMath tex={"D_{KL} \\geq 0"} /> with minimum at <InlineMath tex={"\\sigma = \\frac{1}{2}"} />,
            it acts as a Lyapunov function: any perturbation away from
            <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> increases the KL divergence, making the
            critical line a stable equilibrium of the prime distribution.
          </p>
          <BlockMath tex={"\\frac{\\partial D_{KL}}{\\partial \\sigma}\\bigg|_{\\sigma=1/2} = 0, \\quad \\frac{\\partial^2 D_{KL}}{\\partial \\sigma^2}\\bigg|_{\\sigma=1/2} > 0"} />
        </div>

        {/* Fisher-Twistor */}
        <div style={{ marginBottom: 28 }}>
          <h4 style={{ color: '#10b981', fontSize: 14, marginBottom: 10 }}>
            2. Fisher Information and Twistor Incidence
          </h4>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Setup:</strong> Define the Fisher information with respect to
            <InlineMath tex={"\\sigma"} /> using the Euler product factors
            <InlineMath tex={"H_p(s) = (1 - p^{-s})^{-1}"} />:
          </p>
          <BlockMath tex={"F(\\sigma, t) = \\sum_{p \\leq P} \\left( \\frac{\\partial \\log |H_p(s)|}{\\partial \\sigma} \\right)^2"} />

          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Step 1 — Compute the derivative.</strong> Since
            <InlineMath tex={"H_p = (1 - p^{-s})^{-1}"} />:
          </p>
          <BlockMath tex={"\\log |H_p| = -\\log |1 - p^{-s}| = -\\tfrac{1}{2}\\log\\left((1 - p^{-\\sigma}\\cos(t\\log p))^2 + p^{-2\\sigma}\\sin^2(t\\log p)\\right)"} />
          <BlockMath tex={"\\frac{\\partial \\log |H_p|}{\\partial \\sigma} = \\frac{p^{-\\sigma}\\log p \\cdot (\\cos(t\\log p) - p^{-\\sigma})}{|1 - p^{-s}|^2}"} />

          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Step 2 — Divergence at zeros.</strong> When
            <InlineMath tex={"\\zeta(s_0) = 0"} />, the product
            <InlineMath tex={"\\prod_p |H_p(s_0)|"} /> must vanish, which means the log-derivatives
            grow without bound as more primes are included:
          </p>
          <BlockMath tex={"|\\zeta(s_0)| \\to 0 \\implies \\sum_p |\\partial_\\sigma \\log |H_p||^2 \\to \\infty"} />
          <p style={{ color: '#10b981', fontSize: 13, lineHeight: 1.8, marginTop: 4, fontWeight: 600 }}>
            Fisher information diverges at zeta zeros — the prime distribution becomes infinitely
            sensitive to <InlineMath tex={"\\sigma"} /> perturbations, creating an information-theoretic "wall"
            that confines zeros to a sharp locus.
          </p>
        </div>

        {/* Unified Potential */}
        <div>
          <h4 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 10 }}>
            3. Unified Confinement Potential
          </h4>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Construction:</strong> Define the weighted potential combining
            all six measures:
          </p>
          <BlockMath tex={"\\Phi(\\sigma, t) = \\alpha \\cdot D_{KL}(\\sigma) + \\beta \\cdot |Z \\cdot W|^2 + \\gamma \\cdot (1 - |\\chi(s)|)^2 + \\delta \\cdot \\Delta H(\\sigma) + \\epsilon \\cdot (1 - C/C_{\\max}) + \\zeta_w \\cdot \\Delta F(\\sigma)"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
            where each coefficient <InlineMath tex={"\\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\zeta_w > 0"} />
            is a positive weight.
          </p>

          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Key property — Each term is independently minimized at
            {' '}<InlineMath tex={"\\sigma = \\frac{1}{2}"} />:</strong>
          </p>
          <ul style={{ marginLeft: 16, color: '#94a3b8', fontSize: 12, lineHeight: 2.2 }}>
            <li><InlineMath tex={"D_{KL}(\\sigma) \\geq 0"} /> with equality at <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> (Gibbs' inequality)</li>
            <li><InlineMath tex={"|Z \\cdot W|^2 = 4(\\sigma - \\frac{1}{2})^2 \\cos^2(t\\log 2) \\geq 0"} /> with equality at <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> (twistor incidence)</li>
            <li><InlineMath tex={"(1 - |\\chi|)^2 \\geq 0"} /> with equality at <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> (bridge unitarity)</li>
            <li><InlineMath tex={"\\Delta H(\\sigma) \\geq 0"} /> with equality at <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> (entropy maximized)</li>
            <li><InlineMath tex={"1 - C/C_{\\max} \\geq 0"} /> with equality at <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> (channel capacity)</li>
            <li><InlineMath tex={"\\Delta F(\\sigma) \\geq 0"} /> with equality at <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> (free energy minimum)</li>
          </ul>

          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Therefore:</strong>
          </p>
          <BlockMath tex={"\\Phi(\\sigma, t) \\geq 0 \\quad \\text{with} \\quad \\Phi(\\tfrac{1}{2}, t) = 0 \\quad \\text{for all } t"} />
          <p style={{ color: '#8b5cf6', fontSize: 13, lineHeight: 1.8, marginTop: 4, fontWeight: 600 }}>
            The critical line is the unique global minimum of <InlineMath tex={"\\Phi"} />. If it can be
            shown that zeta zeros must minimize <InlineMath tex={"\\Phi"} /> (not just that
            <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> does), this would prove RH. The independence of the
            six measures (low pairwise correlation) means this is not a circular argument — they
            provide six independent reasons why <InlineMath tex={"\\sigma = \\frac{1}{2}"} /> is special.
          </p>
        </div>
      </div>

      {/* ─── Weil Quadratic Form Attack (Connes 2026) ─── */}
      <div className="card" style={{ marginTop: 24, marginBottom: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 16, marginBottom: 16 }}>
          Weil Quadratic Form Attack (Connes 2026)
        </h3>

        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
          Alain Connes' 2026 paper introduces a seventh attack vector based on the <strong style={{ color: '#e2e8f0' }}>Weil
          explicit formula</strong> and its associated quadratic form. The Weil positivity condition is directly
          equivalent to the Riemann Hypothesis:
        </p>
        <BlockMath tex={"W(g \\ast \\tilde{g}) = \\int\\!\\int g(x)\\, K(x,y)\\, \\overline{g(y)}\\, dx\\, dy \\geq 0 \\quad \\Longleftrightarrow \\quad \\text{RH}"} />
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 4 }}>
          where the kernel encodes prime information:
        </p>
        <BlockMath tex={"K(x,y) = \\sum_p \\frac{\\log p}{\\sqrt{p}} \\bigl[\\delta(x{-}y{-}\\log p) + \\delta(x{-}y{+}\\log p)\\bigr]"} />

        {/* Key Result */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 10 }}>
            4. The Primes &lt; 13 Result
          </h4>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <strong style={{ color: '#e2e8f0' }}>Remarkable finding:</strong> Restricting the Weil quadratic form to
            only five primes <InlineMath tex={"\\{2, 3, 5, 7, 11\\}"} /> and extremizing yields approximations
            to the first 50 nontrivial zeros of <InlineMath tex={"\\zeta(s)"} /> with accuracies spanning:
          </p>
          <BlockMath tex={"2.6 \\times 10^{-55} \\;\\leq\\; |\\gamma_n - \\tilde{\\gamma}_n| \\;\\leq\\; 10^{-3}"} />
          <p style={{ color: '#f59e0b', fontSize: 13, lineHeight: 1.8, marginTop: 4, fontWeight: 600 }}>
            The approximating values <InlineMath tex={"\\tilde{\\gamma}_n"} /> provably lie exactly on the
            critical line <InlineMath tex={"\\text{Re}(s) = \\tfrac{1}{2}"} />. Five primes encode fifty zeros.
          </p>
        </div>

        {/* Connection to ZPO */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ color: '#10b981', fontSize: 14, marginBottom: 10 }}>
            5. Connection to the ZPO Framework
          </h4>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            In the ZPO ladder model, the Weil explicit formula is the <strong style={{ color: '#e2e8f0' }}>input-output relation</strong> of
            the prime oscillator cascade. The Weil quadratic form becomes the <strong style={{ color: '#e2e8f0' }}>energy
            functional</strong> of the LC network:
          </p>
          <BlockMath tex={"W(g) = \\hat{g}(0) + \\hat{g}(1) - \\sum_{p} \\sum_{k=1}^{\\infty} \\frac{\\log p}{p^{k/2}} \\bigl[g(k\\log p) + g(-k\\log p)\\bigr]"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
            The spectral side (sum over zeros) equals the geometric side (sum over primes). This is exactly
            the <strong>Selberg trace formula</strong> in the arithmetic setting, and maps onto the ZPO
            direct/dual ladder duality:
          </p>
          <BlockMath tex={"\\underbrace{\\sum_{\\rho} h(\\gamma_\\rho)}_{\\text{Direct ladder (spectral)}} = \\underbrace{\\frac{1}{4\\pi}\\!\\int h(r)\\,r\\tanh(\\pi r)\\,dr + \\sum_{p,k} \\frac{\\log p}{p^{k/2} - p^{-k/2}} \\hat{h}(k\\log p)}_{\\text{Dual ladder (geometric)}}"} />
        </div>

        {/* Information Compression */}
        <div>
          <h4 style={{ color: '#06b6d4', fontSize: 14, marginBottom: 10 }}>
            6. Information Compression: Primes to Zeros
          </h4>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            The five primes below 13 carry only <InlineMath tex={"\\sum_{p<13} \\log_2 p \\approx 12.2"} /> bits
            of information, yet they determine 50 zero locations. This 10:1 compression ratio reveals the
            prime oscillator cascade as an <strong style={{ color: '#e2e8f0' }}>optimal encoder</strong>:
          </p>
          <BlockMath tex={"K(\\gamma_1, \\ldots, \\gamma_{50}) \\leq K(2,3,5,7,11) + C_{\\text{algorithm}}"} />
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 4, marginBottom: 8 }}>
            where <InlineMath tex={"K(\\cdot)"} /> denotes Kolmogorov complexity. The Weil formula is the encoder,
            extremization is the decoder, and the critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> is
            where channel capacity is maximized (connecting to the Shannon analysis in the information theory page).
          </p>
          <p style={{ color: '#06b6d4', fontSize: 13, lineHeight: 1.8, marginTop: 4, fontWeight: 600 }}>
            This provides a seventh independent measure for the spectral attack: the Weil quadratic form
            positivity. Combined with the original six, the confinement potential gains an arithmetic
            component rooted directly in the Euler product structure.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', fontSize: 14 }}>The Seven Measures at a Glance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginTop: 12 }}>
          {[
            { name: 'KL Divergence', val: 'D_{KL} = 0', at: '\\sigma = \\tfrac{1}{2}', color: '#3b82f6' },
            { name: 'Fisher Info', val: 'I_F \\to \\infty', at: '\\text{at zeros}', color: '#8b5cf6' },
            { name: 'Bridge Mag', val: '|\\chi| = 1', at: '\\sigma = \\tfrac{1}{2}', color: '#10b981' },
            { name: 'Entropy', val: 'H_{\\max}', at: '\\sigma = \\tfrac{1}{2}', color: '#06b6d4' },
            { name: 'Gradient', val: '\\nabla\\Phi = 0', at: '\\sigma = \\tfrac{1}{2}', color: '#f59e0b' },
            { name: 'Hamiltonian', val: '\\mathcal{H}_{\\min}', at: '\\sigma = \\tfrac{1}{2}', color: '#ec4899' },
            { name: 'Weil Form', val: 'W \\geq 0', at: '\\text{RH} \\iff', color: '#ef4444' },
          ].map(({ name, val, at, color }) => (
            <div key={name} style={{ padding: '10px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 8, borderTop: `2px solid ${color}` }}>
              <div style={{ color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{name}</div>
              <div style={{ color: '#e2e8f0', fontSize: 12, marginBottom: 2 }}>
                <InlineMath tex={val} />
              </div>
              <div style={{ color: '#64748b', fontSize: 10 }}>
                <InlineMath tex={at} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ color: '#64748b', fontSize: 12, marginTop: 12 }}>
          All seven measures are independently minimized, maximized, or singular at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
          The unified potential <InlineMath tex={"\\Phi(\\sigma, t)"} /> combines them with equal weight, creating
          a deep potential well that confines zeros to the critical line.
        </p>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#06b6d4' }}>
        <h3 style={{ color: '#06b6d4' }}>What to Explore in Each Tab</h3>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
          <strong style={{ color: '#3b82f6' }}>Fisher-Twistor</strong> plots Fisher information (blue, left axis) and
          twistor incidence (green, right axis) across <InlineMath tex={"\\sigma"} />. Fisher info peaks sharply
          near <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> while twistor incidence vanishes there — slide{' '}
          <InlineMath tex="t" /> near a zeta zero (e.g. 14.13) to see the Fisher peak intensify dramatically.
          <strong style={{ color: '#10b981' }}> Lyapunov</strong> shows the KL divergence landscape: it forms a
          V-shaped valley centered on the critical line, confirming{' '}
          <InlineMath tex={"D_{KL}(\\sigma \\| \\tfrac{1}{2}) = 0"} /> only at{' '}
          <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />. Watch the valley steepen as you increase the number of primes.
          <strong style={{ color: '#f59e0b' }}> Phase Barriers</strong> visualizes the thermodynamic free energy
          and entropy across the critical strip — look for the entropy maximum and free energy minimum
          coinciding at the critical line, creating a potential barrier that confines zeros.
          <strong style={{ color: '#8b5cf6' }}> Correlation Matrix</strong> shows the pairwise correlations between
          all attack measures. Low off-diagonal values (blues) mean the measures are independent —
          the more independent they are, the stronger the combined evidence. High correlations (reds)
          reveal which measures are essentially measuring the same thing.
          <strong style={{ color: '#ef4444' }}> Strategy Scores</strong> evaluates each attack vector's
          effectiveness, showing how confidently each measure pins zeros to the critical line. Compare
          scores at different <InlineMath tex="t" /> values to see which measures are strongest near zeros
          vs. between zeros.
        </p>
      </div>

      <div style={{ marginTop: 24 }}>
        <SpectralAttackViz />
      </div>

      {/* ─── Theta-Trap Explorer ─── */}
      <ThetaTrapSection />

      {/* ─── Verified Analytic Identities: exact dE/ds & dTheta/ds engine (imp-3038) ─── */}
      <VerifiedAnalyticIdentitiesCard />

      {/* ─── Theta-Trap Threshold Ladder Table ─── */}
      <ThetaLadderTable />

      {/* ─── Theorem-C Static-Cover Ladder (imp-3017) ─── */}
      <ThetaCoverageLadderSection />

      {/* ─── Theta-Trap Phase Diagram ─── */}
      <ThetaRhoPhaseDiagram />

      {/* ─── drho/ds Self-Isolation Line Plot (imp-3053) ─── */}
      <DrhoSelfIsolationPlot />

      {/* ─── Theta(rho) = (2*rho/(rho+2))^2 Phase Function Plot (imp-3076) ─── */}
      <ThetaRhoPhaseFunctionPlot />

      {/* ─── R1-T4 Basin Closure Narrative (imp-3055) ─── */}
      <R1T4BasinClosureSection />

      {/* ─── Symmetric Shell-Onset Ladder (imp-3060) ─── */}
      <ShellOnsetLadderSection />

      {/* ─── Asymmetric Multi-Body Isolation Closed Form (imp-3185 surfaces imp-3170) ─── */}
      <AsymIsolationClosedFormPanel />

      {/* ─── Minimal-Gap Selector Discontinuity Viz (imp-3203 surfaces imp-3173) ─── */}
      <MinGapSelectorDiscontinuityViz />

      {/* ─── Off-Basin C_Theta Flat Invariant 16/27 (imp-3098 surfaces imp-3067) ─── */}
      <CThetaFlatInvariantPanel />

      {/* ─── C_Theta sensitivity log-log plot in g0-space (imp-3096) ─── */}
      <CThetaSensitivityLogLogPlot />

      {/* ─── Conditioning Collapse before/after bars (imp-3116 surfaces imp-3086) ─── */}
      <ConditioningCollapseBars />

      {/* Related Pages */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/rh-attack" style={{ color: '#3b82f6', fontSize: 13 }}>RH Attack</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/gap-closing" style={{ color: '#f97316', fontSize: 13 }}>Gap Closing</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/formal-proof" style={{ color: '#10b981', fontSize: 13 }}>Formal Proof</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/proof-checker" style={{ color: '#ef4444', fontSize: 13 }}>Proof Checker</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/twistor" style={{ color: '#f59e0b', fontSize: 13 }}>Twistor</Link>
        </div>
      </div>
    </div>
  );
}
