import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95963_LN125_CROSSING_VS_FLOOR_UFIT_RETABULATION as LEDGER } from '../data/imp-95963-ln125-crossing-vs-floor-ufit-retabulation.js';

// imp-95997: standing cross-validation ledger table for the two distinct ln 1.25
// u_fit observables (imp-95895 A_opt-floor vs imp-95939 crossing-constant), so the
// imp-95963 non-conflation finding stays visible as a rendered table, not just a
// data module field.
export default function Imp95997UfitLedgerViz() {
  const { aFloor, crossing, scaleRatioCpredOverAopt } = LEDGER.ln125TwoObservables;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="u_fit Cross-Validation Ledger: A-Floor vs Crossing-Constant Observables at ln 1.25 (imp-95963)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> cross-validation only,
        assembling already-reported values verbatim. No new cited input, no numeric value
        changed, no new Lambda bound; Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains
        SOTA. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        ln&nbsp;1.25 carries <em>two</em> distinct u_fit measurements that differ in scale by
        &asymp;{scaleRatioCpredOverAopt.toExponential(2)}: the imp-95895 dual scalar-class floor
        A_opt extrapolation, and the imp-95939 crossing-constant C&nbsp;=&nbsp;&pi;&sup2;/(2&delta;&sup2;)
        extrapolation. They are not the same quantity measured twice, so they cannot share a
        single ordering axis &mdash; mixing them (as the imp-95997 scout ticket did) is a
        conflation artifact, not a genuine counterexample to the imp-95885 FINDING A ordering.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        The two ln 1.25 observables
      </h3>
      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginBottom: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>Observable</th>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>Source</th>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>Quantity</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>Value(s)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>u_fit_rel</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>On FINDING&nbsp;A axis?</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0', color: '#60a5fa' }}>A-floor</td>
            <td>{aFloor.source}</td>
            <td>{aFloor.quantity}</td>
            <td style={{ textAlign: 'right' }}>
              A_opt&nbsp;={aFloor.aOpt.toExponential(4)}, A_fit&nbsp;={aFloor.aFit.toExponential(4)}
            </td>
            <td style={{ textAlign: 'right', color: '#4ade80' }}>+{(aFloor.uFitRel * 100).toFixed(4)}%</td>
            <td style={{ textAlign: 'right' }}>{aFloor.onFindingAaxis ? 'yes' : 'no'}</td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0', color: '#f87171' }}>Crossing</td>
            <td>{crossing.source}</td>
            <td>{crossing.quantity}</td>
            <td style={{ textAlign: 'right' }}>
              C_pred&nbsp;={crossing.cPred}, C_fit&nbsp;={crossing.cFit}
            </td>
            <td style={{ textAlign: 'right', color: '#f87171' }}>{(crossing.uFitRel * 100).toFixed(4)}%</td>
            <td style={{ textAlign: 'right' }}>{crossing.onFindingAaxis ? 'yes' : 'no'}</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        A-floor u_fit_rel per delta (the common axis FINDING A orders)
      </h3>
      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginBottom: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>delta</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>A_opt</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>reach</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>u_fit_rel</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>contains zero?</th>
          </tr>
        </thead>
        <tbody>
          {LEDGER.aFloorRows.map((r) => (
            <tr key={r.label} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{r.aOpt.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.reach}</td>
              <td style={{ textAlign: 'right' }}>{(r.uFitRel * 100).toFixed(4)}%</td>
              <td style={{ textAlign: 'right' }}>{r.containsZero ? 'yes' : 'no'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        u_fit_rel order on the common A-floor axis: {LEDGER.aFloorUFitOrder.join(' < ')}
        (tightest &rarr; loosest). This matches neither reach alone ({LEDGER.reachOrder.join(' < ')})
        nor conditioning alone ({LEDGER.condOrder.join(' < ')}) &mdash; it is their interplay.
        The crossing row (loosest of all four, at ln&nbsp;1.25&apos;s intermediate conditioning)
        stays off this axis by construction.
      </p>

      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page rendering the frozen
        imp-95963 retabulation verbatim (no re-derivation). Supplies no new bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains
        SOTA. NO QED.
      </div>
    </div>
  );
}
