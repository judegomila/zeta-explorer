import React from 'react';
import { BlockMath, InlineMath } from './KaTeXMath.jsx';

/**
 * Audit-safe replacement for the former Nyquist plot.
 *
 * With the functional-equation convention used by Twin Ladder Explorer,
 *   zeta(s) = chi(s) zeta(1-s),
 * the old loop expression is identically one wherever the quotient is defined.
 * Plotting it as a nontrivial feedback loop and counting encirclements was
 * therefore mathematically invalid.
 */
export default function NyquistBodeViz() {
  return (
    <div className="card" style={{ borderLeft: '3px solid var(--series-2)' }}>
      <h3 style={{ color: 'var(--series-2)', marginTop: 0 }}>Nyquist construction withdrawn</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        The former visualization used
        <InlineMath tex="L(s)=\chi(s)\zeta(1-s)/\zeta(s)" />. The functional equation
        makes this ratio equal to <InlineMath tex="1" /> after removable common factors
        are handled:
      </p>
      <BlockMath tex="L(s)=\chi(s)\frac{\zeta(1-s)}{\zeta(s)}\equiv1" />
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.75 }}>
        Its Nyquist trace is a single point, not an RH stability test. A meaningful control
        route would first need a nontrivial transfer realization whose poles have been
        proved to encode the completed zeta divisor; that realization is currently open.
      </p>
    </div>
  );
}
