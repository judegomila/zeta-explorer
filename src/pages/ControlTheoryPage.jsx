import React from 'react';
import NyquistBodeViz from '../components/NyquistBodeViz.jsx';
import ScatteringMatrixViz from '../components/ScatteringMatrixViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

export default function ControlTheoryPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Control Theory & Scattering</h1>
        <p>
          An exploratory reformulation of the Riemann Hypothesis as a stability criterion in feedback
          control theory. The Nyquist plot, Bode diagram, and scattering matrix of the ladder-bridge
          system provide suggestive analogies for understanding the locations of zeta zeros.
        </p>
      </div>

      <BlockMath tex="L(s) = \chi(s) \cdot \frac{\zeta(1-s)}{\zeta(s)}, \quad \zeta(s) = 0 \iff 1 + L(s) = 0" />

      <div className="two-col" style={{ marginTop: 24 }}>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>The Feedback Loop Analogy</h3>
          <p style={{ marginTop: 8 }}>
            In control theory, a feedback system becomes unstable when its <em>loop gain</em>{' '}
            <InlineMath tex="L(s)" /> satisfies <InlineMath tex="1 + L(s) = 0" />, i.e.{' '}
            <InlineMath tex="L(s) = -1" />. The key insight is that we can factor{' '}
            <InlineMath tex="\\zeta(s)" /> using the functional equation{' '}
            <InlineMath tex="\\zeta(s) = \\chi(s)\\zeta(1-s)" /> to define a loop gain where
            zeros of <InlineMath tex="\\zeta" /> become exactly the instability points of a
            feedback loop. The direct ladder <InlineMath tex="\\zeta(s)" /> is the plant,
            the dual ladder <InlineMath tex="\\zeta(1-s)" /> is the controller, and{' '}
            <InlineMath tex="\\chi(s)" /> is the feedback channel connecting them.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#10b981' }}>What This Tells Us About RH</h3>
          <p style={{ marginTop: 8 }}>
            On the critical line <InlineMath tex="\\sigma = 1/2" />, the feedback channel{' '}
            <InlineMath tex="\\chi" /> is <em>lossless</em> (<InlineMath tex="|\\chi| = 1" />),
            meaning the system is at marginal stability — zeros sit exactly on the stability
            boundary. If any zero had <InlineMath tex="\\sigma \\neq 1/2" />, the Nyquist
            plot would encircle <InlineMath tex="-1" />, signaling that the feedback loop
            has moved from marginal to genuine instability. RH thus becomes: the loop gain
            never encircles <InlineMath tex="-1" /> when evaluated on the critical line.
            This does not prove RH, but provides a rich visual and conceptual framework
            for understanding <em>why</em> the critical line is special.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#f59e0b' }}>
        <h3 style={{ color: '#f59e0b' }}>What to Explore in Each Visualization</h3>
        <ul style={{ marginLeft: 16, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
          <li>
            <strong style={{ color: '#3b82f6' }}>Nyquist Plot:</strong> at{' '}
            <InlineMath tex="\sigma = 0.5" /> the contour should never
            encircle <InlineMath tex="-1" /> (shown as a red dot). Move{' '}
            <InlineMath tex="\sigma" /> away from <InlineMath tex="0.5" /> and
            watch the contour inflate and begin to encircle{' '}
            <InlineMath tex="-1" />, signaling instability. Widen the t-range
            to trace more of the contour and see additional near-passes.
          </li>
          <li>
            <strong style={{ color: '#10b981' }}>Bode Diagram:</strong> switch
            to the Bode tab to see magnitude (dB) and phase vs frequency on
            log scale. At <InlineMath tex="\sigma = 0.5" /> the magnitude
            hovers near 0 dB (<InlineMath tex="|L| = 1" />); off the critical
            line the gain curve tilts, revealing how far the system is from
            marginal stability.
          </li>
          <li>
            <strong style={{ color: '#8b5cf6' }}>Scattering Magnitude:</strong> the{' '}
            <InlineMath tex="|\chi(\sigma + it)|" /> curve crosses 1 exactly
            at <InlineMath tex="\sigma = 0.5" />. Drag{' '}
            <InlineMath tex="t" /> near a zeta zero (e.g. 14.13, 21.02) and
            watch the curve steepen around the critical line, showing tighter
            impedance matching near resonance.
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>Reflection Coefficient:</strong> switch
            to reflection mode to see <InlineMath tex="\Gamma" /> vanish at{' '}
            <InlineMath tex="\sigma = 0.5" /> — the bridge is perfectly
            matched. The sharper the dip, the stronger the lossless condition.
            Compare at different <InlineMath tex="t" /> values to see how
            matching quality varies with frequency.
          </li>
        </ul>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="viz-title">Nyquist Plot & Bode Diagram</div>
        <div className="viz-subtitle">
          The Nyquist plot traces <InlineMath tex="L(s)" /> as t varies. Encirclements of -1 correspond to zeros off
          the critical line. At <InlineMath tex="\\sigma = 0.5" />, expect zero encirclements (RH). The Bode diagram
          shows magnitude (dB) and phase vs frequency.
        </div>
        <NyquistBodeViz />
      </div>

      <div className="two-col" style={{ marginTop: 32 }}>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>Nyquist Stability Criterion</h3>
          <BlockMath tex="N_{\text{encircle}} = Z_{\text{RHP}} - P_{\text{RHP}}" />
          <p style={{ marginTop: 8 }}>
            The number of clockwise encirclements of -1 by the Nyquist contour equals the number
            of right-half-plane zeros minus poles. For our system: RH says zero encirclements
            when <InlineMath tex="\\sigma = 1/2" /> (marginally stable on the critical line).
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: '#f59e0b' }}>Bode Sensitivity Integral</h3>
          <BlockMath tex="\int_0^\infty \log|S(j\omega)|\, d\omega = \pi \sum_k \text{Re}(p_k)" />
          <p style={{ marginTop: 8 }}>
            Bode's integral constrains the total sensitivity: for a closed-loop stable system with open-loop RHP poles at <InlineMath tex="p_k" />,
            the integral equals <InlineMath tex="\pi \sum_k \text{Re}(p_k)" />. For stable open-loop systems (no RHP poles),
            it is zero — sensitivity reduction at some frequencies must be paid for at others. In our analogy, the integral relates to the prime number theorem error term.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="viz-title">Scattering Matrix of the Lossless Bridge</div>
        <div className="viz-subtitle">
          The bridge connecting direct and dual ladders has <InlineMath tex="|\\chi(\\tfrac{1}{2}+it)| = 1" /> (lossless) on the critical line.
          Off the critical line, the bridge becomes lossy (<InlineMath tex="|\\chi| < 1" />) or amplifying (<InlineMath tex="|\\chi| > 1" />).
          The reflection coefficient <InlineMath tex="\\Gamma" /> vanishes exactly at <InlineMath tex="\\sigma = 1/2" />.
        </div>
        <ScatteringMatrixViz />
      </div>

      <div className="card" style={{ marginTop: 32, borderColor: '#8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6' }}><InlineMath tex="H_\infty" /> Optimal Control</h3>
        <BlockMath tex="\min_\sigma \|S(\sigma + j\cdot)\|_\infty \quad \text{achieved at } \sigma = \frac{1}{2}" />
        <p style={{ marginTop: 12 }}>
          The H-infinity optimal control framework naturally selects <InlineMath tex="\\sigma = 1/2" /> as the operating point
          that minimizes the worst-case sensitivity. The sensitivity/complementary sensitivity balance
          <InlineMath tex="S + T = 1" /> at <InlineMath tex="\\sigma = 1/2" /> is the control-theoretic version of the functional equation.
        </p>
        <div className="two-col" style={{ marginTop: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#3b82f6' }}>Gain margin:</strong> How much the loop gain can
              increase before instability. In our model, this measures how far zeros can drift
              from the critical line before the system becomes unstable. RH says: infinite gain
              margin on the critical line.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#f59e0b' }}>Phase margin:</strong> How much phase lag can
              be added before instability. Related to the argument of <InlineMath tex="\\zeta(s)" /> and the <InlineMath tex="S(t)" /> function
              counting the phase changes of <InlineMath tex="\zeta" /> on the critical line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
