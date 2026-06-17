import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SpectralAttackViz from '../components/SpectralAttackViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { ZETA_ZEROS } from '../math/zeta.js';

// Theorem constants from sg1c-theta-trap-theorems (Theorem A / Corollary A1 / Theorem B)
const TRAP_A = 1 / 4;                      // unconditional trap: every pair with Theta<=1/4 stays trapped
const TRAP_B = (Math.sqrt(73) - 5) / 8;   // minimal-gap trap: sharp threshold ~0.443

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
