import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import InformationTheoryViz from '../components/InformationTheoryViz.jsx';
import InfoTheoryExperimentsViz from '../components/InfoTheoryExperimentsViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

// Information Theory of the Twin Ladder — editorial (warm) re-theme.
// Same content, same math, same two protected visualizations; dark-theme
// hexes remapped onto the warm --brass/--green/--terra-dk/--blue palette.

const SMALL_PRIMES = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71];

function klWeights(s) {
  const raw = SMALL_PRIMES.map(p => Math.pow(p, -s));
  const total = raw.reduce((a, b) => a + b, 0);
  return raw.map(w => w / total);
}

function computeKLFromHalf(s) {
  const wS = klWeights(s);
  const wH = klWeights(0.5);
  let kl = 0;
  for (let i = 0; i < SMALL_PRIMES.length; i++) {
    if (wS[i] > 1e-20 && wH[i] > 1e-20) kl += wS[i] * Math.log2(wS[i] / wH[i]);
  }
  return Math.max(0, kl);
}

function KLDivergenceSlider() {
  const [sigma, setSigma] = useState(0.5);
  const currentKL = computeKLFromHalf(sigma);

  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const s = 0.01 + (i / 120) * 0.98;
      pts.push([s, computeKLFromHalf(s)]);
    }
    return pts;
  }, []);

  const W = 400, H = 110;
  const maxKL = Math.max(...curve.map(pt => pt[1])) * 1.05 + 1e-10;
  const toX = s => ((s - 0.01) / 0.98) * W;
  const toY = kl => H - (kl / maxKL) * (H - 6) - 3;
  const pathD = curve.map((pt, i) =>
    (i === 0 ? "M" : "L") + " " + toX(pt[0]).toFixed(1) + " " + toY(pt[1]).toFixed(1)
  ).join(" ");
  const cx = toX(sigma), cy = toY(currentKL);

  return (
    <div style={{ marginTop: 16, padding: 12, background: 'color-mix(in srgb, var(--series-2) 5%, transparent)', borderRadius: 8, border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ color: 'var(--ink-soft)', fontSize: 12 }}>σ =</span>
        <input
          type="range" min="0.01" max="0.99" step="0.01"
          value={sigma}
          onChange={e => setSigma(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, minWidth: 36 }}>{sigma.toFixed(2)}</span>
      </div>
      <svg width="100%" viewBox={"0 0 " + W + " " + H} style={{ display: "block", marginBottom: 6 }}>
        <line x1="0" y1={H - 3} x2={W} y2={H - 3} stroke={ED.rule} strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2={H - 3} stroke={ED.rule} strokeWidth="1" />
        <line x1={toX(0.5)} y1="0" x2={toX(0.5)} y2={H - 3} stroke={ED.series3} strokeWidth="1" strokeDasharray="4,3" />
        <path d={pathD} fill="none" stroke={ED.accent} strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="4" fill={ED.series2} />
        <text x={toX(0.5) + 3} y="12" fill={ED.series3} fontSize="9">σ=1/2 (zero)</text>
      </svg>
      <div style={{ color: 'var(--accent)', fontSize: 13, textAlign: "center" }}>
        D<sub>KL</sub>(P<sub>{sigma.toFixed(2)}</sub> &#x2016; P<sub>1/2</sub>) = <strong>{currentKL.toFixed(4)}</strong> bits
      </div>
      <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 8, lineHeight: 1.6 }}>
        Model divergence computed over the first 20 primes with weights p<sup>-σ</sup>. This is a divergence on the
        model prime-oscillator weight distribution, not a metric on the actual Riemann zeros. Zero at σ=1/2 by symmetry.
      </p>
    </div>
  );
}

export default function InformationTheoryPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Information Theory of the Twin Ladder</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
            The Twin-Ladder Bridge viewed as a communication channel. Six information-theoretic
            measures reveal that the critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> is the
            unique operating point that simultaneously optimizes entropy, capacity, mutual information,
            and divergence from equilibrium.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--green)' }}>
          <h3 style={{ color: 'var(--green)', fontSize: 14, marginBottom: 8 }}>The Channel Model</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            Treat the Euler product cascade as a discrete memoryless channel: input is the complex
            frequency <InlineMath tex={"s = \\sigma + it"} />, each prime oscillator stage adds noise
            proportional to the impedance mismatch <InlineMath tex={"\\Delta Z_p"} />, and the channel
            output is <InlineMath tex={"\\zeta(s)"} />. The bridge <InlineMath tex={"\\chi(s)"} /> acts as
            the feedback path coupling direct and dual ladders.
          </p>
        </div>

        <BlockMath tex={"\\text{Channel: } \\; Y = \\prod_p H_p(s) \\cdot X + N(\\sigma), \\quad \\text{where } N(\\sigma) \\propto |Z_{\\text{direct}} - Z_{\\text{dual}}|^2"} />

        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card">
            <h3 style={{ color: 'var(--blue)', fontSize: 14 }}>Six Measures, One Answer</h3>
            <table style={{ width: '100%', fontSize: 12, color: 'var(--ink-soft)', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--blue)' }}>Measure</th>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--green)' }}>At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Shannon Entropy', 'Maximum (most balanced prime weighting)'],
                  ['Channel Capacity', 'Maximum (conjugate-matched, noise minimized)'],
                  ['Mutual Information I(D;D*)', 'Maximum (bridge unitary, full coupling)'],
                  ['Fisher Information', 'Singularity at zeros (infinite sensitivity)'],
                  ['Rate-Distortion', 'Minimum rate for given distortion'],
                  ['KL Divergence', 'Zero (system at equilibrium)'],
                ].map(([measure, status], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <td style={{ padding: '6px 8px', color: 'var(--brass-dk)' }}>{measure}</td>
                    <td style={{ padding: '6px 8px', fontSize: 11 }}>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--brass-dk)', fontSize: 14 }}>Why This Matters for RH</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
              If the twin ladder is a <em>capacity-achieving</em> channel at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />,
              then zeros of the transfer function <InlineMath tex={"\\zeta(s)"} /> correspond to
              channel capacity singularities. Information theory provides a framework where:
            </p>
            <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              <li><strong>Entropy maximization</strong> forces uniform prime weight distribution</li>
              <li><strong>Capacity optimality</strong> forces minimum impedance mismatch (conjugate match)</li>
              <li><strong>KL minimization</strong> forces the equilibrium state</li>
              <li><strong>Fisher divergence</strong> pins zeros to exact <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /></li>
            </ul>
            <p style={{ color: 'var(--terra-dk)', fontSize: 12, marginTop: 12, fontWeight: 600 }}>
              Gap: These are properties of the model at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />,
              not proofs that zeros must lie there. The Fisher singularity is the most suggestive:
              it says the system has infinite sensitivity to <InlineMath tex={"\\sigma"} />-perturbation
              at zeros, which is consistent with (but does not prove) confinement to the critical line.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <InformationTheoryViz />
        </div>

        <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)', fontSize: 16, marginBottom: 8 }}>Interactive Experiments</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
            Explore how the twin ladder's control parameters (<InlineMath tex={"\\sigma"} />, <InlineMath tex={"t"} />, numPrimes)
            affect information-theoretic efficiency measures. All six independent measures achieve their optimum
            at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> — the critical line.
          </p>
          <InfoTheoryExperimentsViz />
        </div>

        <div className="card" style={{ marginTop: 32, borderColor: 'var(--brass)' }}>
          <h3 style={{ color: 'var(--brass)', fontSize: 14 }}>The Information-Theoretic Proof Strategy</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            A potential proof path via information theory would require:
          </p>
          <BlockMath tex={"\\text{If } \\; \\sigma^* = \\arg\\max_\\sigma C(\\sigma, t) \\;\\text{ and }\\; \\zeta(\\sigma^* + it) = 0 \\;\\Longrightarrow\\; \\sigma^* = \\tfrac{1}{2}"} />
          <ol style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2.2 }}>
            <li>
              <strong>Step 1:</strong> Prove the channel capacity <InlineMath tex={"C(\\sigma, t)"} /> is
              strictly concave in <InlineMath tex={"\\sigma"} /> with unique maximum at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
              <span style={{ color: 'var(--green)', marginLeft: 8 }}>(Numerically verified)</span>
            </li>
            <li>
              <strong>Step 2:</strong> Prove zeros of <InlineMath tex={"\\zeta(s)"} /> are channel capacity
              singularities — the transfer function vanishes exactly where the channel capacity is maximized.
              <span style={{ color: 'var(--brass-dk)', marginLeft: 8 }}>(Plausible but unproven)</span>
            </li>
            <li>
              <strong>Step 3:</strong> Combine: zeros must occur at the unique capacity maximum <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
              <span style={{ color: 'var(--terra-dk)', marginLeft: 8 }}>(Requires Steps 1 + 2)</span>
            </li>
          </ol>
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            The weakness in Step 2 is fundamental: zeros of a transfer function do not generically occur at
            capacity maxima. The Twin-Ladder Bridge model has special structure (Euler product, functional equation symmetry)
            that might force this, but a proof would require deep results from both information theory and
            analytic number theory.
          </p>
        </div>

        <div className="two-col" style={{ marginTop: 24 }}>
          <div className="card">
            <h3 style={{ color: 'var(--blue)', fontSize: 14 }}>Connections to Known Results</h3>
            <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 2 }}>
              <li><strong>Shannon (1948):</strong> Channel capacity = max mutual information</li>
              <li><strong>Gallager (1968):</strong> Random coding achieves capacity for memoryless channels</li>
              <li><strong>Cover & Thomas:</strong> Rate-distortion duality with channel capacity</li>
              <li><strong>Connes (1999):</strong> Trace formula approach relates spectral data to primes</li>
              <li><strong>Berry–Keating (1999):</strong> Quantum mechanical interpretation of zeros</li>
            </ul>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--green)', fontSize: 14 }}>Novel Observations</h3>
            <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 2 }}>
              <li>The Euler product entropy is maximized at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> (most balanced prime weighting)</li>
              <li>KL divergence <InlineMath tex={"D_{\\text{KL}}(P_\\sigma \\| P_{1/2})"} /> is a natural "distance from RH" measure</li>
              <li>Fisher information diverges at zeros like <InlineMath tex={"|\\zeta(\\sigma+it)|^{-2}"} /></li>
              <li>Rate-distortion curve quantifies the "complexity" of <InlineMath tex={"\\zeta(s)"} /> in prime-oscillator bits</li>
              <li>Channel capacity duality: <InlineMath tex={"C(\\sigma) = C(1-\\sigma)"} /> from functional equation</li>
            </ul>
          </div>
        </div>

        {/* From Shannon to Weil: Information-Theoretic Unification */}
        <div className="card" style={{ marginTop: 32, borderColor: 'var(--green)' }}>
          <h3 style={{ color: 'var(--green)' }}>From Shannon to Weil: Information-Theoretic Unification</h3>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            The six information measures in the table above are not independent -- they are all shadows of a
            single deeper structure. The critical line <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> emerges as
            the unique fixed point from every angle:
          </p>
          <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2.2, marginTop: 8 }}>
            <li>
              <strong style={{ color: 'var(--blue)' }}>Shannon entropy of Euler factors:</strong> maximized
              at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> where the direct/dual weight distributions
              coincide. The distribution is not uniform — small primes still dominate via <InlineMath tex={"p^{-1/2}"} /> — but
              entropy is maximized because the functional equation symmetry makes the weighting most balanced.
            </li>
            <li>
              <strong style={{ color: 'var(--brass-dk)' }}>KL divergence:</strong> <InlineMath tex={"D_{\\text{KL}}(P_\\sigma \\| P_{1/2}) \\geq 0"} /> with
              equality if and only if <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />. This divergence is a natural
              Lyapunov function -- it decreases monotonically as the system flows toward equilibrium on the critical line.
            </li>
            <li>
              <strong style={{ color: 'var(--terra-dk)' }}>Fisher information:</strong> diverges at zeros
              like <InlineMath tex={"|\\zeta(\\sigma + it)|^{-2}"} />, indicating infinite sensitivity
              to <InlineMath tex={"\\sigma"} />-perturbation. The system is maximally "aware" of its position at each zero.
            </li>
            <li>
              <strong style={{ color: 'var(--brass)' }}>Mutual information:</strong> <InlineMath tex={"I(\\text{direct};\\text{dual})"} /> is
              maximized when the bridge is unitary, which occurs precisely at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
              Full coupling between the twin ladders means maximum information transfer.
            </li>
          </ul>
          <div style={{ marginTop: 16, padding: 12, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: 'var(--green)' }}>
              <strong>Connes 2026 connection:</strong> The Weil positivity form <InlineMath tex={"W(g * \\tilde{g}) \\geq 0"} /> captures
              ALL of these measures in a single quadratic form. The key insight
              is that <InlineMath tex={"W(g * \\tilde{g}) \\geq 0"} /> simultaneously encodes entropy maximization, KL divergence
              minimization, and Fisher information divergence. The Weil form is the "master inequality" from which
              every information-theoretic characterization of RH can be derived as a special case.
            </p>
          </div>
          <BlockMath tex={"W(g * \\tilde{g}) \\geq 0 \\;\\Longleftrightarrow\\; \\text{RH} \\;\\Longleftrightarrow\\; \\max_\\sigma H(\\sigma) \\text{ at } \\sigma = \\tfrac{1}{2} \\;\\Longleftrightarrow\\; D_{\\text{KL}} = 0 \\text{ only at } \\sigma = \\tfrac{1}{2}"} />
          <div style={{ marginTop: 16, padding: 12, background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 35%, transparent)', borderRadius: 8 }}>
            <p style={{ fontSize: 12.5, color: 'var(--brass-dk)', lineHeight: 1.7, margin: 0 }}>
              <strong>Status:</strong> The phrase "master inequality" and the iff-chain above are
              illustrative, not a theorem. The six measures all peaking at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> are
              PROPERTIES of the engineered channel model defined on this page, not independently established
              facts about <InlineMath tex={"\\zeta"} />. Only <InlineMath tex={"W(g * \\tilde{g}) \\geq 0 \\Leftrightarrow \\text{RH}"} /> (Weil
              positivity) is a genuine equivalence; the remaining links in the chain are heuristic correspondences
              within the model. The real open gap is <strong>Step 2</strong> (flagged above as "Plausible but
              unproven"): showing the zeros of <InlineMath tex={"\\zeta"} /> coincide with the channel-capacity
              maxima is not delivered by any of these information measures.
            </p>
          </div>
        </div>

        {/* Chaitin's Constant and Zeta: Incompressibility as Irrationality */}
        <div className="card" style={{ marginTop: 32, borderColor: 'var(--brass-dk)' }}>
          <h3 style={{ color: 'var(--brass-dk)' }}>Chaitin's Constant and Zeta: Incompressibility as Irrationality</h3>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            There is a deep link between algorithmic information theory and the irrationality of zeta values,
            connecting to the <Link to="/odd-zeta" style={{ color: 'var(--blue)' }}>Odd Zeta irrationality approach</Link>.
            It is conjectured (unproven) that the Kolmogorov complexity of odd zeta values grows
            faster than any logarithmic bound:
          </p>
          <BlockMath tex={"K\\bigl(\\zeta(2n+1) \\,|\\, N\\bigr) \\gg \\log N"} />
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            The heuristic: the Euler product forces specific digit patterns that resist compression,
            and the prime oscillators impose correlations across all scales. No such lower bound is a
            theorem — proving it would settle the irrationality of every odd zeta value, and only
            ζ(3) is known irrational. See the heuristic-analogy caveat on{' '}
            <Link to="/odd-zeta" style={{ color: 'var(--blue)' }}>the odd-zeta page</Link>.
          </p>
          <div className="two-col" style={{ marginTop: 12, gap: 16 }}>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', borderRadius: 8 }}>
              <p style={{ fontSize: 13, color: 'var(--brass-dk)' }}>
                <strong>Incompressibility implies irrationality:</strong> If <InlineMath tex={"K(\\zeta(2n+1) \\,|\\, N)"} /> grows
                like <InlineMath tex={"N^\\alpha"} /> for any <InlineMath tex={"\\alpha > 0"} />, then the number must be
                irrational. Rational numbers have eventually periodic digit expansions, which can be compressed
                to <InlineMath tex={"O(\\log N)"} /> bits. The Euler product structure prevents this compression.
              </p>
            </div>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', borderRadius: 8 }}>
              <p style={{ fontSize: 13, color: 'var(--blue)' }}>
                <strong>Connection to channel capacity:</strong> The critical line maximizes information
                throughput in the twin-ladder channel. At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />,
                the channel achieves maximum capacity, and the output signal (zeta values) carries maximum
                information content. This is consistent with the incompressibility of zeta values -- a
                maximally informative channel produces maximally complex output.
              </p>
            </div>
          </div>
        </div>

        {/* Channel Capacity and the Prime Number Theorem */}
        <div className="card" style={{ marginTop: 32, borderColor: 'var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)' }}>Channel Capacity and the Prime Number Theorem</h3>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            Shannon's channel capacity theorem sets the fundamental limit on reliable communication
            through a noisy channel. The prime counting function obeys a strikingly analogous capacity
            constraint, suggesting the primes form a natural communication channel whose capacity is
            dictated by the Prime Number Theorem.
          </p>
          <BlockMath tex={"C = B \\log_2(1 + \\text{SNR})"} />
          <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2.2, marginTop: 8 }}>
            <li>
              <strong style={{ color: 'var(--blue)' }}>Shannon's channel capacity:</strong>{' '}
              <InlineMath tex={"C = B \\log_2(1 + \\text{SNR})"} /> — the maximum rate of reliable
              information transfer through a band-limited noisy channel.
            </li>
            <li>
              <strong style={{ color: 'var(--blue)' }}>Prime counting as capacity limit:</strong> The
              prime counting function <InlineMath tex={"\\pi(x) \\sim x / \\log x"} /> is analogous to
              a channel capacity — it sets the maximum "information rate" of primes up to{' '}
              <InlineMath tex={"x"} />.
            </li>
            <li>
              <strong style={{ color: 'var(--green)' }}>Bandwidth of the prime channel:</strong> The
              "bandwidth" <InlineMath tex={"B"} /> of the prime channel is{' '}
              <InlineMath tex={"\\log x"} /> — the range of logarithmic scales over which primes up
              to <InlineMath tex={"x"} /> are distributed.
            </li>
            <li>
              <strong style={{ color: 'var(--brass-dk)' }}>SNR from prime density:</strong> The "signal-to-noise
              ratio" is determined by the prime density:{' '}
              <InlineMath tex={"\\text{SNR} \\approx 1/\\log x"} />. Primes become sparser (noisier)
              at larger scales.
            </li>
            <li>
              <strong style={{ color: 'var(--brass)' }}>PNT as capacity achievement:</strong> The Prime
              Number Theorem says the information rate of primes equals their channel capacity — the
              primes are a <em>capacity-achieving</em> code.
            </li>
          </ul>
          <div className="two-col" style={{ marginTop: 16, gap: 16 }}>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', borderRadius: 8 }}>
              <p style={{ fontSize: 13, color: 'var(--blue)' }}>
                <strong>Error term under RH:</strong> The error in the prime counting function is
                bounded by
              </p>
              <BlockMath tex={"|\\pi(x) - \\text{li}(x)| \\leq C\\sqrt{x}\\,\\log x"} />
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
                assuming the Riemann Hypothesis. This is the tightest possible error bound — the
                "noise floor" of the prime channel.
              </p>
            </div>
            <div style={{ padding: 12, background: 'color-mix(in srgb, var(--brass) 8%, transparent)', borderRadius: 8 }}>
              <p style={{ fontSize: 13, color: 'var(--brass)' }}>
                <strong>Gaussian noise interpretation:</strong> RH implies that the "noise" in the
                prime channel is Gaussian with variance{' '}
                <InlineMath tex={"\\sim x^{1/2}"} />. The fluctuations{' '}
                <InlineMath tex={"\\pi(x) - \\text{li}(x)"} /> behave like a random walk with steps
                bounded by <InlineMath tex={"\\sqrt{x}\\,\\log x"} />, exactly the signature of
                additive white Gaussian noise in Shannon's model.
              </p>
            </div>
          </div>
        </div>

        {/* Relative Entropy and the Functional Equation */}
        <div className="card" style={{ marginTop: 32, borderColor: 'var(--terra-dk)' }}>
          <h3 style={{ color: 'var(--terra-dk)' }}>Relative Entropy and the Functional Equation</h3>
          <p style={{ marginTop: 8, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            The Kullback-Leibler divergence measures information asymmetry between two distributions.
            Applied to the twin ladder, it reveals that the functional equation of{' '}
            <InlineMath tex={"\\zeta(s)"} /> forces perfect symmetry — zero relative entropy — at the
            critical line.
          </p>
          <BlockMath tex={"D_{\\text{KL}}(P \\| Q) = \\sum_n P(n) \\log \\frac{P(n)}{Q(n)}"} />
          <ul style={{ marginLeft: 16, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 2.2, marginTop: 8 }}>
            <li>
              <strong style={{ color: 'var(--terra-dk)' }}>KL divergence:</strong>{' '}
              <InlineMath tex={"D_{\\text{KL}}(P \\| Q) = \\sum_n P(n) \\log \\frac{P(n)}{Q(n)}"} />{' '}
              measures the information asymmetry between distributions{' '}
              <InlineMath tex={"P"} /> and <InlineMath tex={"Q"} />.
            </li>
            <li>
              <strong style={{ color: 'var(--blue)' }}>Twin ladder distributions:</strong>{' '}
              <InlineMath tex={"P"} /> = distribution from the direct ladder,{' '}
              <InlineMath tex={"Q"} /> = distribution from the dual ladder. These encode how
              energy is distributed across prime oscillator stages in each half of the network.
            </li>
            <li>
              <strong style={{ color: 'var(--green)' }}>Functional equation constraint:</strong> The
              functional equation <InlineMath tex={"\\zeta(s) = \\chi(s)\\,\\zeta(1-s)"} /> implies
              that <InlineMath tex={"D_{\\text{KL}}(P \\| Q)"} /> is minimized at{' '}
              <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />.
            </li>
            <li>
              <strong style={{ color: 'var(--brass-dk)' }}>At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />:</strong>{' '}
              <InlineMath tex={"D_{\\text{KL}} = 0"} /> — the distributions are identical (
              <InlineMath tex={"P = Q"} />), representing perfect symmetry between the direct and
              dual ladders.
            </li>
            <li>
              <strong style={{ color: 'var(--brass)' }}>Away from <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />:</strong>{' '}
              <InlineMath tex={"D_{\\text{KL}} > 0"} /> — there is information asymmetry between
              the direct and dual distributions. The further from the critical line, the greater
              the asymmetry.
            </li>
          </ul>
          <div style={{ marginTop: 16, padding: 12, background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: 'var(--terra-dk)' }}>
              <strong>Information-theoretic bridge unitarity:</strong> The condition{' '}
              <InlineMath tex={"D_{\\text{KL}}(P \\| Q) = 0"} /> is exactly the information-theoretic
              version of bridge unitarity. When the bridge <InlineMath tex={"\\chi(s)"} /> is unitary
              at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, it maps the direct ladder distribution
              to the dual ladder distribution without any information loss — the two sides of the
              network carry identical information.
            </p>
          </div>
          <BlockMath tex={"D_{\\text{KL}}(P \\| Q) = 0 \\;\\Longleftrightarrow\\; P = Q \\;\\Longleftrightarrow\\; \\sigma = \\tfrac{1}{2} \\;\\Longleftrightarrow\\; \\chi(s) \\text{ is unitary}"} />
          <KLDivergenceSlider />
        </div>

        {/* Related Pages */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 10 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Link to="/odd-zeta" style={{ color: 'var(--brass-dk)', fontSize: 13, textDecoration: 'none' }}>Odd Zeta Irrationality</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/spectral-attack" style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>Spectral Approach</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/concepts" style={{ color: 'var(--brass)', fontSize: 13, textDecoration: 'none' }}>Concepts</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/formal-proof" style={{ color: 'var(--green)', fontSize: 13, textDecoration: 'none' }}>Formal Proof</Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/" style={{ color: 'var(--brass)', fontSize: 13, textDecoration: 'none' }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
