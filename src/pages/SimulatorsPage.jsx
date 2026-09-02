import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';

/* Simulators index — every interactive explorer in one place. Linked from the
   home KPI. Editorial theme. */

const SIMS = [
  ['/oscillators', 'Prime oscillators', 'Each prime as an LC resonator with impedance log p; the Euler product as a ladder network.'],
  ['/hamiltonian', 'Hamiltonian', 'The energy landscape of the finite model, minimized on the critical line.'],
  ['/zeta', 'Zeta landscape', 'The |ζ| surface over the complex plane with zeros as wells.'],
  ['/waves', 'Wave simulator', 'The finite ζ-model as a standing wave — a model diagnostic, not a realization.'],
  ['/fourier', 'Fourier', 'The explicit-formula duality between primes and zeros, interactively.'],
  ['/control', 'Control theory', 'Nyquist/Bode reading of the twin-ladder transfer functions.'],
  ['/statistics', 'Zero statistics', 'Spacing distributions against GUE.'],
  ['/simulator', 'Simulator', 'The general finite-model sandbox.'],
  ['/supercritical', 'Supercritical', 'The zeta-as-fluid thermodynamics exploration.'],
  ['/spectral-attack', 'Spectral attack', 'The operator-spectrum exploration console.'],
  ['/gap-closing', 'Gap closing', 'The historical gap-closing diagnostics (model-level).'],
  ['/formal-proof', 'Formal proof', 'The proof-assistant status console.'],
];

export default function SimulatorsPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div className="ed-lbl">work the problem</div>
        <h1 style={{ fontFamily: 'var(--ed-display)', fontWeight: 560, fontSize: 38, lineHeight: 1.1, margin: '6px 0 10px', color: 'var(--ink)' }}>
          Simulators
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          The {SIMS.length} interactive explorers. Each is a finite-model instrument — none is a proof object.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 22 }} className="ed-map">
          {SIMS.map(([to, name, desc], i) => (
            <Link key={to} to={to} className="ed-tile">
              <div className="ed-tmeta"><span className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)' }}>{String(i + 1).padStart(2, '0')}</span></div>
              <h3>{name}</h3>
              <p>{desc}</p>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 26, fontSize: 13.5 }}>
          <Link to="/visualizations">The full visualization catalog →</Link>
          <span style={{ color: 'var(--faint)' }}> · </span>
          <Link to="/">← home</Link>
        </div>
      </div>
    </div>
  );
}
