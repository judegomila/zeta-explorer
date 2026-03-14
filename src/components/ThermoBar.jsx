import React, { useMemo } from 'react';
import { thermodynamicState } from '../math/supercritical.js';

const PHASE_META = {
  'supercritical': { label: 'FROZEN', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  'critical-line': { label: 'EQUILIBRIUM', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'critical-strip': { label: 'LIQUID', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'sub-zero': { label: 'VAPORIZED', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

function safe(v, d = 3) {
  if (v === undefined || v === null || !isFinite(v)) return '—';
  return v.toFixed(d);
}

/**
 * Compact thermodynamic readout bar.
 * Shows phase state badge + T, P, F metrics in a single row.
 */
export default function ThermoBar({ sigma, t, numPrimes = 10 }) {
  const thermo = useMemo(() => thermodynamicState(sigma, t, numPrimes), [sigma, t, numPrimes]);
  const meta = PHASE_META[thermo.phase] || PHASE_META['critical-strip'];

  const items = [
    { k: 'T', v: Math.abs(sigma) < 0.01 ? '\u221E' : safe(thermo.temperature, 2), c: '#f59e0b', tip: 'Temperature T = 1/σ — inverse of the real part of s. Diverges at σ → 0; the critical line σ = ½ corresponds to T = 2.' },
    { k: 'P', v: safe(thermo.pressure, 4), c: '#8b5cf6', tip: 'Pressure P = (1/N) Σ_p log|1/(1−p^{−s})| — average log-magnitude of Euler factors, measuring how hard primes "push" at this point in the critical strip.' },
    { k: 'F', v: safe(thermo.freeEnergy, 3), c: '#06b6d4', tip: 'Free energy F = −T·log|ζ(s)| — thermodynamic potential minimized at equilibrium. Zeta zeros correspond to F → +∞ (phase transitions).' },
    { k: 'S', v: safe(thermo.entropy, 3), c: '#10b981', tip: 'Entropy S = log|ζ| − σ·∂log|ζ|/∂σ — measures the disorder of the oscillator chain. Higher entropy = more spread in prime oscillator phases.' },
  ];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px',
      background: 'rgba(17,24,39,0.5)', borderRadius: 8, margin: '8px 0',
      fontSize: 12, fontFamily: 'var(--font-mono)', flexWrap: 'wrap',
    }}>
      <span style={{
        padding: '2px 8px', borderRadius: 4,
        background: meta.bg, color: meta.color,
        fontWeight: 700, fontSize: 10, letterSpacing: 1,
        cursor: 'help',
      }} title={`Phase: ${meta.label} — thermodynamic phase of the oscillator chain at σ = ${sigma.toFixed(2)}`}>
        {meta.label}
      </span>
      {items.map(({ k, v, c, tip }) => (
        <span key={k} style={{ color: '#64748b', cursor: 'help' }} title={tip}>
          {k}=<span style={{ color: c, fontWeight: 600 }}>{v}</span>
        </span>
      ))}
    </div>
  );
}
