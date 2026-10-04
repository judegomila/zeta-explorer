import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET } from '../data/imp-33601-sigma-half-vs-crossover-eflow-offset.js';

const COHORT = [
  {
    id: 'imp-33723',
    path: '/viz-imp33930-crossover-fixed-point-convergence',
    title: 'Crossover Fixed-Point Convergence',
    summary:
      'Pins the imp-3444 E_coll = E_trunc crossover in CLOSED FORM as a Banach fixed point ' +
      'N_cross = (C_C/E_trunc)^2 log T0(N_cross), matching bisection to ~1.7e-15.',
  },
  {
    id: 'imp-33743',
    path: '/viz-imp34355-fartail-crossover-residual-collapse',
    title: 'Far-Tail Residual Collapse',
    summary:
      'Extends the closed form to the sigma < 0.1 far-tail landmark: the closed-form-vs-empirical ' +
      'residual there is ~54x tighter than the halving residual, tracking E_flow/E_trunc decay.',
  },
  {
    id: 'imp-34174',
    path: '/viz-imp34353-crossover-surplus-family-decay',
    title: 'Crossover Surplus Family Decay',
    summary:
      'Tabulates the E_flow/E_trunc surplus across the threshold family thr in {0.5,0.3,0.1,0.05,0.01}, ' +
      'showing it collapses monotonically and drops below 1e-4 at thr ~ 0.314.',
  },
  {
    id: 'imp-34248',
    path: '/viz-imp34354-crossover-surplus-small-thr-factorisation',
    title: 'Small-thr Surplus Factorisation',
    summary:
      'Splits the surplus into a linear target-share prefactor and a log-softened E_flow ratio, ' +
      'fitting the composite decay to a super-linear ~thr^2.9 exponent.',
  },
  {
    id: 'imp-34270',
    path: '/viz-imp34352-eflow-gronwall-crossover-offset',
    title: 'E_flow Gronwall Crossover-Offset Decomposition',
    summary:
      'Forms the explicit leading 2*E_flow/E_trunc correction and confirms it (plus a log T0 drift) ' +
      'reproduces the measured ~0.4% halving-vs-crossover offset to <1e-6.',
  },
];

export default function Imp34361EflowCrossoverOffsetCohortIndexPage() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="E_flow Crossover-Offset / Threshold-Family Cohort (imp-34361)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        The imp-33601 identity chain -- imp-33601 (sigma = 1/2 &lt;=&gt; E_coll = E_trunc + E_flow),
        imp-33723 (closed-form N_cross), imp-33743 (far-tail generalisation), imp-34174/imp-34248
        (surplus tabulation and small-thr asymptotic), and imp-34270 (explicit E_flow correction) --
        all measure the same sigma-halving-vs-crossover offset from one shared component model, but
        were shipped across separate viz pages with no shared landing surface. This index groups the
        five navigable viz pages so the cohort can be read as one story.
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {COHORT.map((entry) => (
          <Link
            key={entry.id}
            to={entry.path}
            style={{
              display: 'block',
              padding: '0.85rem 1rem',
              background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
              borderLeft: '3px solid var(--rule)',
              borderRadius: '0 4px 4px 0',
              textDecoration: 'none',
            }}
          >
            <div style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '0.9rem' }}>
              {entry.title} <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>({entry.id})</span>
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              {entry.summary}
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>imp-33601 founding identity (no dedicated viz page):</strong>{' '}
        {IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET.exactRelation} -- the sigma-halving point sits
        BELOW the imp-3444 crossover (N_half ~{' '}
        {IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET.landmarks.N_half_sigma_eq_half} vs N_cross ~{' '}
        {IMP33601_SIGMA_HALF_VS_CROSSOVER_EFLOW_OFFSET.landmarks.N_cross_Ecoll_eq_Etrunc}) because
        E_coll is strictly decreasing in N and the extra E_flow term forces a larger target. This
        identity is the shared root every other module in the cohort builds on.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>imp-34328 sigma-vs-product gap complement (not identical laws):</strong>{' '}
        The sigma-exponent gap 1/2 - p (imp-33816) and the imp-34197 E_coll product gap 1/(2u) look like
        "the same law" at a glance, but imp-34328 shows they are EXACT COMPLEMENTS on the log T0 axis
        instead: gapSigma * log T0 + gapProduct = 1/2 at every rung, not gapSigma = gapProduct. The
        product cancels the log(2 pi) shift between u = log(T0/2 pi) and log T0 by multiplying through
        log T0; the bare sigma-exponent gap keeps that shift, so it approaches 1/2 * u only slowly
        (0.446 to 0.500) rather than sitting on it exactly. See the{' '}
        <Link to="/viz-imp34417-sigma-vs-product-gap-complement" style={{ color: 'var(--series-1)' }}>
          side-by-side complement chart (imp-34417)
        </Link>{' '}
        for the full ladder. Cross-check/tabulation only, NOT an RH bound.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> this is a navigation aid over
        already-published measurements. The offset and its E_flow attribution are real, reproducible
        readings under the inherited imp-3220/imp-3406 conditional-share extrapolation -- not a
        derived mathematical bound. It changes no bound and patches no literal. C_mb GUE-conditional
        per imp-486 untouched; imp-3066 K_a&ge;0 untouched; RH-equivalent, NO QED.
      </div>
    </div>
  );
}
