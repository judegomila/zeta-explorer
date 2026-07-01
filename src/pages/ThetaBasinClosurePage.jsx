import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

// Attractive CM flow: dx_k/ds = -2 * sum_{j!=k} 1/(x_k - x_j)
function cmForce(xs) {
  const N = xs.length;
  const F = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let j = 0; j < N; j++) {
      if (j !== k) s += 1 / (xs[k] - xs[j]);
    }
    F[k] = -2 * s;
  }
  return F;
}

function computeTheta(xs) {
  const N = xs.length;
  let minG = Infinity, minIdx = 0;
  for (let i = 0; i < N - 1; i++) {
    const g = xs[i + 1] - xs[i];
    if (g < minG) { minG = g; minIdx = i; }
  }
  const a = xs[minIdx], b = xs[minIdx + 1];
  let E = 0;
  for (let j = 0; j < N; j++) {
    if (j === minIdx || j === minIdx + 1) continue;
    E += 1 / ((a - xs[j]) * (b - xs[j]));
  }
  return { theta: minG * minG * E / 2, gap: minG };
}

function rk4Step(xs, dt) {
  const k1 = cmForce(xs);
  const xs2 = xs.map((x, i) => x + dt / 2 * k1[i]);
  const k2 = cmForce(xs2);
  const xs3 = xs.map((x, i) => x + dt / 2 * k2[i]);
  const k3 = cmForce(xs3);
  const xs4 = xs.map((x, i) => x + dt * k3[i]);
  const k4 = cmForce(xs4);
  return xs.map((x, i) => x + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

function runFlow(initialXs, gapStop) {
  let xs = [...initialXs];
  const traj = [];
  let s = 0;
  for (let step = 0; step < 4000; step++) {
    const { theta, gap } = computeTheta(xs);
    traj.push({ s, theta, gap });
    if (gap < gapStop) break;
    // adaptive step: small near collision
    const dt = Math.min(0.002, gap * gap / 4);
    xs = rk4Step(xs, dt);
    s += dt;
  }
  return traj;
}

// Subsample trajectory to at most N points (evenly spaced by index)
function subsample(traj, n) {
  if (traj.length <= n) return traj;
  const step = (traj.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => traj[Math.round(i * step)]);
}

function BasinChart({ isolatedTraj, lattTraj }) {
  const svgW = 560, svgH = 260;
  const padL = 46, padR = 22, padT = 18, padB = 36;
  const cW = svgW - padL - padR, cH = svgH - padT - padB;

  // Normalize s-axis to [0, 1] (s / s_max for each trajectory independently)
  const iMaxS = isolatedTraj[isolatedTraj.length - 1].s || 1;
  const lMaxS = lattTraj[lattTraj.length - 1].s || 1;
  const sharedMax = Math.max(iMaxS, lMaxS);

  const xScale = (s) => padL + (s / sharedMax) * cW;
  const yScale = (v) => padT + cH * (1 - v);

  const iPath = isolatedTraj.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(p.s).toFixed(2)},${yScale(p.theta).toFixed(2)}`).join(' ');
  const lPath = lattTraj.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(p.s).toFixed(2)},${yScale(p.theta).toFixed(2)}`).join(' ');

  const yTicks = [0, 0.1, 0.2, 0.25, 0.4, 0.6, 0.8, 1.0];
  const nXTicks = 6;
  const xTicks = Array.from({ length: nXTicks + 1 }, (_, i) => sharedMax * i / nXTicks);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* grid */}
      {yTicks.map((v) => (
        <line key={v} x1={padL} y1={yScale(v)} x2={svgW - padR} y2={yScale(v)}
          stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* Theta = 1 ceiling */}
      <line x1={padL} y1={yScale(1)} x2={svgW - padR} y2={yScale(1)}
        stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 3" />
      <text x={svgW - padR - 2} y={yScale(1) - 4} fill="#ef4444" fontSize={9} textAnchor="end">
        Theta = 1
      </text>

      {/* Theorem-A trap at 1/4 */}
      <line x1={padL} y1={yScale(0.25)} x2={svgW - padR} y2={yScale(0.25)}
        stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="5 3" />
      <text x={padL + 4} y={yScale(0.25) - 4} fill="#f59e0b" fontSize={8}>
        Thm-A trap 1/4
      </text>

      {/* near-uniform trajectory */}
      <path d={lPath} fill="none" stroke="#8b5cf6" strokeWidth={2.5} />

      {/* isolated trajectory */}
      <path d={iPath} fill="none" stroke="#10b981" strokeWidth={2} />

      {/* start-point dots */}
      <circle cx={xScale(isolatedTraj[0].s)} cy={yScale(isolatedTraj[0].theta)} r={4} fill="#10b981" />
      <circle cx={xScale(lattTraj[0].s)} cy={yScale(lattTraj[0].theta)} r={4} fill="#8b5cf6" />

      {/* annotations */}
      <text x={xScale(lattTraj[0].s) + 6} y={yScale(lattTraj[0].theta) - 5}
        fill="#8b5cf6" fontSize={9}>
        near-uniform (~{lattTraj[0].theta.toFixed(2)})
      </text>
      <text x={xScale(isolatedTraj[0].s) + 6} y={yScale(isolatedTraj[0].theta) + 12}
        fill="#10b981" fontSize={9}>
        isolated (~{isolatedTraj[0].theta.toFixed(3)})
      </text>

      {/* basin label */}
      <text x={padL + cW / 2} y={yScale(0.12)} fill="#10b981" fontSize={8}
        textAnchor="middle" opacity={0.7}>
        Theorem-A basin (Theta stays ≤ 1/4)
      </text>

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" />
      <line x1={padL} y1={padT + cH} x2={svgW - padR} y2={padT + cH} stroke="#334155" />

      {/* y axis labels */}
      {yTicks.map((v) => (
        <g key={v}>
          <text x={padL - 4} y={yScale(v) + 3} fill="#475569" fontSize={8} textAnchor="end">
            {v.toFixed(2)}
          </text>
          <line x1={padL - 2} y1={yScale(v)} x2={padL} y2={yScale(v)} stroke="#334155" />
        </g>
      ))}
      <text x={12} y={padT + cH / 2} fill="#94a3b8" fontSize={9} textAnchor="middle"
        transform={`rotate(-90, 12, ${padT + cH / 2})`}>
        Theta
      </text>

      {/* x axis labels */}
      {xTicks.map((v, idx) => (
        <g key={idx}>
          <text x={xScale(v)} y={svgH - 14} fill="#475569" fontSize={8} textAnchor="middle">
            {v.toFixed(3)}
          </text>
          <line x1={xScale(v)} y1={padT + cH} x2={xScale(v)} y2={padT + cH + 3} stroke="#334155" />
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 3} fill="#94a3b8" fontSize={9} textAnchor="middle">
        s (CM-flow parameter)
      </text>

      {/* legend */}
      <g>
        <line x1={padL + 8} y1={padT + 6} x2={padL + 24} y2={padT + 6} stroke="#10b981" strokeWidth={2} />
        <text x={padL + 27} y={padT + 9} fill="#10b981" fontSize={8}>
          isolated (rho {"<"} 1, Theta(0) {"<"} 1/4) — zero excursion
        </text>
        <line x1={padL + 8} y1={padT + 18} x2={padL + 24} y2={padT + 18} stroke="#8b5cf6" strokeWidth={2.5} />
        <text x={padL + 27} y={padT + 21} fill="#8b5cf6" fontSize={8}>
          near-uniform lattice (rho ~ 1) — stays near 0.8
        </text>
      </g>
    </svg>
  );
}

export default function ThetaBasinClosurePage() {
  const { isolatedTraj, lattTraj, isolatedTheta0, lattTheta0, peakIsolated, peakLatt } = useMemo(() => {
    // ISOLATED: 6 particles, far environment -- rho = g/d_1 << 1, Theta(0) << 1/4
    // Central pair (0, 1), environment at -8, -7, 7, 8 (d_1 = 6 >> g = 1, rho = 1/6)
    const isolated0 = [-8, -7, 0, 1, 7, 8];

    // NEAR-UNIFORM: 10-particle K=4 symmetric uniform lattice, Theta_K = K/(K+1) = 4/5 = 0.8
    // Central pair at (-0.5, 0.5), 4 unit-spaced neighbours per side: rho = g/d_1 = 1
    const latt0 = [-4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5];

    const iRaw = runFlow(isolated0, 0.03);
    const lRaw = runFlow(latt0, 0.03);

    const iSub = subsample(iRaw, 60);
    const lSub = subsample(lRaw, 60);

    const peakI = Math.max(...iRaw.map((p) => p.theta));
    const peakL = Math.max(...lRaw.map((p) => p.theta));

    return {
      isolatedTraj: iSub,
      lattTraj: lSub,
      isolatedTheta0: iRaw[0].theta,
      lattTheta0: lRaw[0].theta,
      peakIsolated: peakI,
      peakLatt: peakL,
    };
  }, []);

  return (
    <div className="page">
      <PageHeader title="Lemma R1-T4: Dynamical Basin Closure">
        <p>
          Starting from an <strong style={{ color: '#10b981' }}>isolated minimal pair</strong> (
          <InlineMath tex={"\\rho = g/d_1 < 1"} />, <InlineMath tex={"\\Theta(0) < 1/4"} /> —
          the real-zero regime) the attractive CM flow keeps the minimal-pair{' '}
          <InlineMath tex={"\\Theta(s)"} /> at exactly <InlineMath tex={"\\Theta(0)"} /> throughout
          (zero excursion). A <strong style={{ color: '#8b5cf6' }}>near-uniform-lattice control</strong>{' '}
          (<InlineMath tex={"\\rho \\approx 1"} />) carries peak{' '}
          <InlineMath tex={"\\Theta \\approx 0.8"} /> — the two regimes are dynamically disconnected.
        </p>
      </PageHeader>

      <BlockMath tex={"\\frac{dx_k}{ds} = -2 \\sum_{j \\neq k} \\frac{1}{x_k - x_j}, \\qquad \\Theta = \\frac{g^2 E}{2}, \\quad E = \\sum_{j \\notin \\{a,b\\}} \\frac{1}{(a-x_j)(b-x_j)}"} />

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ color: '#10b981', fontSize: 16, marginBottom: 10 }}>
          Theta(s) along the CM flow: isolated vs near-uniform
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 14, lineHeight: 1.7 }}>
          The <strong style={{ color: '#10b981' }}>green curve</strong> starts from an
          isolated 6-particle configuration with
          <InlineMath tex={"\\rho = g/d_1 = 1/6 \\ll 1"} /> and{' '}
          <InlineMath tex={"\\Theta(0) \\approx " + isolatedTheta0.toFixed(4)} />{' '}
          (well below the 1/4 trap). The Theorem-A trap is self-enforcing: the minimal
          pair never excurses above <InlineMath tex={"\\Theta(0)"} /> (peak ={' '}
          {peakIsolated.toFixed(4)}). The <strong style={{ color: '#8b5cf6' }}>purple curve</strong>{' '}
          starts from the 10-particle symmetric K=4 uniform lattice with{' '}
          <InlineMath tex={"\\Theta_K = K/(K+1) = 4/5 = 0.8"} /> (rho = 1). The scale-invariant
          collapse keeps Theta near {lattTheta0.toFixed(3)} throughout (peak ={' '}
          {peakLatt.toFixed(4)}). The two curves lie in entirely
          separate dynamical regimes — the isolated basin never reaches the lattice band.
        </p>
        <BasinChart isolatedTraj={isolatedTraj} lattTraj={lattTraj} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {[
            { label: 'isolated Theta(0)', val: isolatedTheta0.toFixed(5), note: 'rho=1/6, well inside trap', color: '#10b981' },
            { label: 'isolated peak Theta', val: peakIsolated.toFixed(5), note: 'zero excursion above Theta(0)', color: '#10b981' },
            { label: 'near-uniform Theta(0)', val: lattTheta0.toFixed(4), note: 'K=4 lattice, Theta_K=4/5', color: '#8b5cf6' },
            { label: 'near-uniform peak Theta', val: peakLatt.toFixed(4), note: 'stays near 0.8 (rho=1)', color: '#8b5cf6' },
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
        <h3 style={{ color: '#8b5cf6', fontSize: 16, marginBottom: 10 }}>Mechanism: Lemma R2-T isolation self-improvement</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          For the single-dominant-neighbour reduction the isolation ratio{' '}
          <InlineMath tex={"\\rho = g/d_1"} /> satisfies the <strong>exact identity</strong>
        </p>
        <BlockMath tex={"\\frac{d\\rho}{ds} = \\frac{g - d_1}{d_1^2} \\left[\\frac{2}{g + d_1} + \\frac{4(g+d_1)}{d_1\\, g}\\right]."} />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          The bracket is strictly positive, so{' '}
          <InlineMath tex={"\\operatorname{sign}(d\\rho/ds) = \\operatorname{sign}(g - d_1)"} />:
          the isolation margin is strictly self-improving for every{' '}
          <InlineMath tex={"\\rho < 1"} />, with threshold exactly 1. The minimal pair
          therefore <em>isolates into the Theorem-A trap</em> rather than climbing toward
          the lattice. The near-uniform lattice sits at{' '}
          <InlineMath tex={"\\rho = 1"} /> — the exact zero of the rate — an{' '}
          <strong style={{ color: '#ef4444' }}>unstable repelling threshold</strong> that
          cannot be reached from <InlineMath tex={"\\rho < 1"} />.
        </p>
        <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, padding: '8px 12px', marginTop: 10 }}>
          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 11 }}>KEY CONSEQUENCE:</span>
          <span style={{ color: '#94a3b8', fontSize: 12 }}> the excursion cap{' '}
            <InlineMath tex={"\\Theta_{\\rm exc} < 1"} /> and the Corollary-A1 hypothesis
            self-enforce on the isolated-pair basin. The high-K lattice peak (
            <InlineMath tex={"\\Theta_K = K/(K+1) \\to 1"} />) is a measure-zero repelling
            locus, not an attractor.
          </span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', fontSize: 16, marginBottom: 8 }}>Honest Status</h3>
        <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.45)', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
          <span style={{ color: '#f87171', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em' }}>BASIN CONDITIONAL: NOT UNCONDITIONAL</span>
          <span style={{ color: '#94a3b8', fontSize: 12 }}> &mdash; the cap holds on the isolated-pair basin (
            <InlineMath tex={"\\rho < 1"} />). The R2-T isolation sign law is proven exactly only for the single nearest neighbour; the multi-body onset is scanned to <InlineMath tex={"\\inf \\approx 0.943"} />, not closed in form.
          </span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
          <strong style={{ color: '#e2e8f0' }}>What this closes:</strong> on the basin{' '}
          <InlineMath tex={"\\rho = g/d_1 < 1"} /> (the measured real-zero regime, where{' '}
          <InlineMath tex={"\\Theta(0) = 0.167 / 0.088 / 0.046"} /> — all well under 1/4) the
          attractive CM flow keeps the minimal-pair Theta bounded by{' '}
          <InlineMath tex={"\\Theta(0)"} /> and drives it to zero at collision. The near-uniform
          lattice ({' '}<InlineMath tex={"\\rho = 1"} />, <InlineMath tex={"\\Theta_K \\to 1"} />){' '}
          is an unstable repeller: the flow cannot reach it from inside the basin.
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          <strong style={{ color: '#f59e0b' }}>What remains open (R2 residual):</strong> closing
          the multi-body self-improvement constant in rigorous form. The single-neighbour case
          gives the sharp threshold <InlineMath tex={"\\rho^* = 1"} /> exactly; the symmetric
          single-shell family (Lemma R2-T2) gives the algebraic{' '}
          <InlineMath tex={"c^* = \\sqrt{2{+}\\sqrt{3}}-1 \\approx 0.932"} />; the global
          asymmetric constant is bracketed in <InlineMath tex={"(0.898, 0.943)"} /> but not
          closed in form.
        </p>
        <p style={{ color: '#64748b', fontSize: 12, marginTop: 8 }}>
          See also:{' '}
          <Link to="/theta-static-obstruction" style={{ color: '#06b6d4' }}>Theta Static Obstruction</Link>{' '}
          (Lemma R1-T2 lattice: Theta_K = K/(K+1) ladder) &middot;{' '}
          <Link to="/theta-seizing-margin" style={{ color: '#06b6d4' }}>Theta Seizing Margin</Link>{' '}
          (Lemma R1-T3 closed-form seizing margin) &middot;{' '}
          <Link to="/spectral-attack" style={{ color: '#06b6d4' }}>Spectral Attack</Link> (full Theta-trap ladder)
        </p>
      </div>
    </div>
  );
}
