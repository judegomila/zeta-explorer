import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncMetric } from '../hooks/useAsyncMetric.js';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import FreshnessBanner from '../components/FreshnessBanner.jsx';
// A1 fix: use the precomputed ~6 KB summary instead of the full 16 MB sweep
// module. The full module (which transitively imports 10^6 Odlyzko zeros)
// is still used by daily-health-check.sh for drift detection.
import { EMPIRICAL_M_SWEEP_EXTENDED_SUMMARY as EMPIRICAL_M_SWEEP_EXTENDED } from '../data/empirical-m-sweep-extended-summary.js';
// imp-2956: top-line status, sourced from the same canonical data module
// as /state-of-program so the two surfaces cannot drift. Light, no heavy imports.
import {
  STATE_OF_PROGRAM_SUMMARY_DATE,
  STATE_OF_PROGRAM_TRUTHS,
} from '../data/state-of-program-truths.js';
import { ED, alpha } from '../styles/tokens.js';

const ProofStatusCard = lazy(() => import('../components/ProofStatusCard.jsx'));

/**
 * RH Proof Dashboard — Live Metrics (imp-060)
 *
 * A "mission control" page showing all key proof metrics in real time.
 * Each card computes its metric via useMemo and shows a status badge.
 *
 * Editorial (warm) re-theme: full-width dashboard, identical structure/data.
 * All dark-theme hexes below are mapped 1:1 to the warm palette (literal
 * hex, not var()) so the status semantics (pass/fail/warn) are unchanged.
 */

// Lightweight inline computations to avoid heavy imports at page load.
// We dynamically import the math modules so the dashboard itself is small.

// imp-848: useAsyncMetric extracted to src/hooks/useAsyncMetric.js.
// Previously duplicated between DashboardPage and HealthPage.

// ─── Empirical-Λ Floor card (imp-878) ────────────────────────────────────
// Live readout of the UNCOND-Λ empirical sweep — N_max, both predicate
// statuses, and a link to the full-story narrative. Pulls from
// src/data/empirical-m-sweep-extended.js so the value auto-updates when
// the sweep is re-run (e.g. after fetching more Odlyzko zeros).

function EmpiricalFloorCard() {
  const r = EMPIRICAL_M_SWEEP_EXTENDED;
  const N_max = r.verifiedRange.N_max;
  const e1 = r.empiricalPredicates.E1_rhoNonDecreasing.holds;
  const e2 = r.empiricalPredicates.E2_tauEstNonIncreasing.holds;
  const ok = e1 && e2;
  const color = ok ? ED.series3 : ED.accent;

  return (
    <div className="card" style={{ marginBottom: 24, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
          Empirical-Λ Floor (UNCOND-Λ PATH 1)
        </h3>
        <span style={{
          fontFamily: 'var(--ed-mono, var(--font-mono))',
          fontSize: 18,
          color,
          fontWeight: 700,
        }}>
          N ≤ {N_max.toLocaleString()}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--ink-soft)', fontFamily: 'var(--ed-mono, var(--font-mono))', marginBottom: 6 }}>
        <span>
          E1 (ρ non-decreasing):{' '}
          <strong style={{ color: e1 ? 'var(--series-3)' : 'var(--accent)' }}>{e1 ? '✓' : '✗'}</strong>
        </span>
        <span>
          E2 (τ_c_est non-increasing):{' '}
          <strong style={{ color: e2 ? 'var(--series-3)' : 'var(--accent)' }}>{e2 ? '✓' : '✗'}</strong>
        </span>
        <span>
          violations: <strong>{r.empiricalPredicates.E1_rhoNonDecreasing.violations + r.empiricalPredicates.E2_tauEstNonIncreasing.violations}</strong>
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-faint)', lineHeight: 1.6 }}>
        Direct sweep on Odlyzko zeros; both predicates verified — no C_mb, no GUE on this range.
        Widening from the original 870-zero floor:{' '}
        <strong style={{ color: 'var(--series-1)' }}>{Math.round(N_max / r.previousEmpiricalFloor.N_max)}×</strong>.{' '}
        <Link to="/full-story#uncond" style={{ color: 'var(--brass)' }}>Improving Bounds on Λ →</Link>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      display: 'inline-block',
      width: 20, height: 20,
      border: '2px solid var(--rule)',
      borderTop: '2px solid var(--brass-deco)',
      borderRadius: '50%',
      animation: 'dashboard-spin 0.8s linear infinite',
    }} />
  );
}

const STATUS_COLORS = {
  green: { border: ED.series3, bg: alpha(ED.series3, 0.08), badge: ED.series3, text: 'PASS' },
  red: { border: ED.accent, bg: alpha(ED.series2, 0.08), badge: ED.series2, text: 'FAIL' },
  yellow: { border: ED.brassDeco, bg: alpha(ED.brassDeco, 0.08), badge: ED.brassDeco, text: 'COND' },
};

function MetricCard({ title, subtitle, status, value, detail, loading, error }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.yellow;

  return (
    <div style={{
      background: loading ? 'var(--paper-2)' : colors.bg,
      border: `1.5px solid ${loading ? ED.rule : colors.border}`,
      borderRadius: 10,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minHeight: 140,
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>{title}</h3>
        {!loading && !error && (
          <span style={{
            background: colors.badge,
            color: 'var(--paper)',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 4,
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            letterSpacing: 0.5,
          }}>
            {colors.text}
          </span>
        )}
      </div>
      {subtitle && (
        <div style={{ color: 'var(--ink-faint)', fontSize: 11, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>{subtitle}</div>
      )}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div style={{ color: 'var(--accent)', fontSize: 12 }}>Error: {error}</div>
        ) : (
          <div style={{
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            fontSize: 22,
            fontWeight: 700,
            color: colors.border,
            textAlign: 'center',
          }}>
            {value}
          </div>
        )}
      </div>
      {!loading && !error && detail && (
        <div style={{ color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.5 }}>{detail}</div>
      )}
    </div>
  );
}

// ── Metric computations ──────────────────────────────────────────────────────

function computeUnitarityDeficit() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.infiniteProductUnitarityBound(100, 6);
    const avgDeficit = result.actualAvgDeficit;
    return {
      status: avgDeficit < 0.01 ? 'green' : avgDeficit < 0.1 ? 'yellow' : 'red',
      value: avgDeficit.toExponential(4),
      detail: `P=${result.P}, tail bound ${result.tailEstimate.toExponential(2)}. Converges to 0 as P grows.`,
    };
  });
}

function computeLiCoefficients() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.liCoefficients(5, 50);
    // NOTE: liCoefficients() returns { lambdas: [...] }, not { coefficients: [...] }.
    // Field-name drift bug — the old dashboard read result.coefficients which is undefined.
    const lambdas = result.lambdas.slice(0, 5);
    const allPositive = lambdas.every(c => c.lambda > 0);
    const display = lambdas.map((c, i) =>
      `λ${i + 1}=${c.lambda.toFixed(4)}`
    ).join('  ');
    return {
      status: allPositive ? 'green' : 'red',
      value: allPositive ? 'All Positive' : 'NEGATIVE FOUND',
      detail: display,
    };
  });
}

function computePotapov() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.potapovFactorization(60, 15);
    // NOTE: actual return fields are { jContractivity, schurClass, potapovApplies,
    // proofChain, rigorousSteps, totalSteps, verdict }. Old dashboard read
    // result.overallPass and result.schurClassPass which do not exist and
    // always evaluated falsy → always showed VIOLATION.
    const passed = result.potapovApplies === true;
    const schurOK = result.schurClass === true;
    // proofChain statuses include 'verified', 'verified (Euler product is meromorphic)',
    // 'verified numerical', etc. Match any status starting with 'verified'.
    const verifiedCount = result.proofChain.filter(
      s => typeof s.status === 'string' && s.status.startsWith('verified')
    ).length;
    return {
      status: passed ? 'green' : 'yellow',
      value: passed ? 'J-Contractive' : result.verdict || 'Partial',
      detail: `${verifiedCount}/${result.proofChain.length} steps verified (${result.rigorousSteps}/${result.totalSteps} rigorous). `
        + (schurOK ? 'Schur class OK.' : 'Schur class: conditions not met.'),
    };
  });
}

function computeGUESpacing() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.montgomeryOdlyzko(100, 30);
    // NOTE: numberVariance is an ARRAY of { L, variance, gueExpected, poissonExpected, gueRatio },
    // not an object with normalizedVariance. pairCorrelation may be undefined at this sample
    // size. Compute the aggregate GUE ratio from the array — average of gueRatio across scales.
    const nvArray = Array.isArray(result.numberVariance) ? result.numberVariance : null;
    if (nvArray && nvArray.length > 0) {
      const ratios = nvArray
        .map(r => r.gueRatio)
        .filter(r => typeof r === 'number' && Number.isFinite(r) && r > 0);
      if (ratios.length > 0) {
        const avgRatio = ratios.reduce((s, r) => s + r, 0) / ratios.length;
        // GUE agreement expects ratio ~1. Near-zero means variance is WAY below GUE
        // (too clustered), large means variance is above GUE (too random).
        const distFromGUE = Math.abs(avgRatio - 1);
        return {
          status: distFromGUE < 0.3 ? 'green' : distFromGUE < 0.7 ? 'yellow' : 'red',
          value: `ratio=${avgRatio.toFixed(3)}`,
          detail: `Variance/GUE ratio across ${nvArray.length} scales L. GUE expects ~1.0. ` +
            `min=${Math.min(...ratios).toFixed(3)}, max=${Math.max(...ratios).toFixed(3)}.`,
        };
      }
    }
    return {
      status: 'yellow',
      value: 'N/A',
      detail: `montgomeryOdlyzko returned no usable numberVariance/pairCorrelation for the given sample size. Keys: ${Object.keys(result).join(',')}.`,
    };
  });
}

function computeWeilPositivity() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.weilPositivityTest([0.5, 1, 2, 5, 10], 80, 50);
    const tests = result.results;
    const allPositive = tests.every(t => t.balance >= -1e-10);
    const allConsistent = tests.every(t => t.consistent);
    const minSum = Math.min(...tests.map(t => t.balance));
    const inconsistentCount = tests.filter(t => !t.consistent).length;
    return {
      status: (allPositive && allConsistent) ? 'green' : 'red',
      value: (allPositive && allConsistent) ? 'Non-Negative' : `Min = ${minSum.toExponential(3)}`,
      detail: inconsistentCount > 0
        ? `Tested ${tests.length} widths. ${inconsistentCount} inconsistent (balance outside ±0.5·zeroSum). Min = ${minSum.toExponential(3)}.`
        : `Tested ${tests.length} Gaussian widths. All consistent, min balance = ${minSum.toExponential(3)}.`,
    };
  });
}

function computeProofCompleteness() {
  return import('../math/rh-attack.js').then(mod => {
    const result = mod.assembleCompleteProof(30, 50);
    const sections = result.sections;
    const proven = sections.filter(s => s.status === 'proven').length;
    const verified = sections.filter(s => s.status === 'verified-numerical').length;
    const total = sections.length;
    return {
      status: proven + verified >= total ? 'green' : proven + verified >= 6 ? 'yellow' : 'red',
      value: `${proven + verified} / ${total}`,
      detail: `${proven} proven, ${verified} numerically verified. `
        + `Weakest: ${result.weakestLink || 'N/A'}. Completeness: ${(result.completeness * 100).toFixed(0)}%.`,
      completeness: result.completeness,
    };
  });
}

// ── Main component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [recomputeKey, setRecomputeKey] = useState(0);
  const [lastVerified, setLastVerified] = useState(null);

  // Each metric recomputes when recomputeKey changes
  const unitarity = useAsyncMetric(
    useCallback(() => computeUnitarityDeficit(), [recomputeKey]) // eslint-disable-line react-hooks/exhaustive-deps
  );
  const liCoeffs = useAsyncMetric(
    useCallback(() => computeLiCoefficients(), [recomputeKey]) // eslint-disable-line react-hooks/exhaustive-deps
  );
  const potapov = useAsyncMetric(
    useCallback(() => computePotapov(), [recomputeKey]) // eslint-disable-line react-hooks/exhaustive-deps
  );
  const gue = useAsyncMetric(
    useCallback(() => computeGUESpacing(), [recomputeKey]) // eslint-disable-line react-hooks/exhaustive-deps
  );
  const weil = useAsyncMetric(
    useCallback(() => computeWeilPositivity(), [recomputeKey]) // eslint-disable-line react-hooks/exhaustive-deps
  );
  const proof = useAsyncMetric(
    useCallback(() => computeProofCompleteness(), [recomputeKey]) // eslint-disable-line react-hooks/exhaustive-deps
  );

  const allDone = !unitarity.loading && !liCoeffs.loading && !potapov.loading
    && !gue.loading && !weil.loading && !proof.loading;

  // Set lastVerified when all computations finish
  useMemo(() => {
    if (allDone && !lastVerified) {
      setLastVerified(new Date().toISOString());
    }
  }, [allDone]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRecompute = () => {
    setLastVerified(null);
    setRecomputeKey(k => k + 1);
  };

  // Overall completeness bar
  const completeness = proof.value?.completeness ?? 0;
  const passingCards = [unitarity, liCoeffs, potapov, gue, weil].filter(
    m => m.value && m.value.status === 'green'
  ).length;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <style>{`
          @keyframes dashboard-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>RH Proof Dashboard — Live Metrics</h1>
          <p className="ed-lbl">Related: <Link to="/health">Model metrics (live)</Link> · <Link to="/gap-closing">Unitarity-deficit gap analysis</Link></p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Real-time computation of key Riemann Hypothesis proof metrics from the ZPO
            oscillator framework. Each card runs an independent computation and reports
            pass/fail status with numerical values.
          </p>
        </div>

        <FreshnessBanner date={STATE_OF_PROGRAM_SUMMARY_DATE} note="status reconciliation; metrics computed live on load" />

        {/* imp-2956: "state of the program" summary, sourced from the
            canonical STATE_OF_PROGRAM_TRUTHS data module (same facts as
            /state-of-program) so the top-line status cannot drift. */}
        <div
          className="card"
          style={{ marginBottom: 24, borderLeft: '3px solid var(--rule)' }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            <strong style={{ color: 'var(--ink)', fontSize: 15 }}>state of the program</strong>
            <Link to="/state-of-program" style={{ fontSize: 12.5 }}>Full state of the program →</Link>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
            Top-line status before reading any single metric below: there is no shortcut below RH anywhere in the map.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {STATE_OF_PROGRAM_TRUTHS.map((t) => (
              <div key={t.badge} style={{ border: `1px solid ${t.color}`, borderRadius: 6, padding: '8px 10px' }}>
                <span
                  style={{
                    fontFamily: 'var(--ed-mono, var(--font-mono))',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    color: t.color,
                  }}
                >
                  {t.badge}
                </span>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 4 }}>{t.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2x3 metric grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}>
          <MetricCard
            title="S7 Unitarity Deficit"
            subtitle="delta(P) for P=100 primes"
            loading={unitarity.loading}
            error={unitarity.error}
            status={unitarity.value?.status}
            value={unitarity.value?.value}
            detail={unitarity.value?.detail}
          />
          <MetricCard
            title="Li Coefficients"
            subtitle="lambda_1 through lambda_5"
            loading={liCoeffs.loading}
            error={liCoeffs.error}
            status={liCoeffs.value?.status}
            value={liCoeffs.value?.value}
            detail={liCoeffs.value?.detail}
          />
          <MetricCard
            title="Potapov J-Contractivity"
            subtitle="J-contractive factorization check"
            loading={potapov.loading}
            error={potapov.error}
            status={potapov.value?.status}
            value={potapov.value?.value}
            detail={potapov.value?.detail}
          />
          <MetricCard
            title="GUE Spacing"
            subtitle="Normalized variance (target < 0.5)"
            loading={gue.loading}
            error={gue.error}
            status={gue.value?.status}
            value={gue.value?.value}
            detail={gue.value?.detail}
          />
          <MetricCard
            title="Weil Positivity"
            subtitle="Sum h(gamma) >= 0 for Gaussian test"
            loading={weil.loading}
            error={weil.error}
            status={weil.value?.status}
            value={weil.value?.value}
            detail={weil.value?.detail}
          />
          <MetricCard
            title="ZPO Model Diagnostic"
            subtitle="S1–S8 model sections proven or numerically verified — a finite-model diagnostic, not RH proof progress"
            loading={proof.loading}
            error={proof.error}
            status={proof.value?.status}
            value={proof.value?.value}
            detail={proof.value?.detail}
          />
        </div>

        {/* imp-878: Empirical-Λ Floor card — pulls live from imp-833 + imp-858 sweep. */}
        <EmpiricalFloorCard />

        {/* Proof Status bar */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 14, color: 'var(--ink)' }}>Overall Proof Status</h3>
            <span style={{
              fontFamily: 'var(--ed-mono, var(--font-mono))',
              fontSize: 14,
              color: completeness >= 0.8 ? 'var(--series-3)' : completeness >= 0.5 ? 'var(--brass)' : 'var(--accent)',
              fontWeight: 700,
            }}>
              {proof.loading ? '...' : `${(completeness * 100).toFixed(0)}%`}
            </span>
          </div>
          <div style={{
            height: 12,
            background: 'var(--paper-3)',
            borderRadius: 6,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: proof.loading ? '0%' : `${completeness * 100}%`,
              background: completeness >= 0.8
                ? 'linear-gradient(90deg, var(--series-3), var(--series-3))'
                : completeness >= 0.5
                  ? 'linear-gradient(90deg, var(--brass-deco), var(--brass-deco))'
                  : 'linear-gradient(90deg, var(--series-2), var(--accent-deco))',
              borderRadius: 6,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: 8, fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--ed-mono, var(--font-mono))',
          }}>
            <span>S1 -- S8 proof sections</span>
            <span>{passingCards}/5 metric checks passing</span>
          </div>
        </div>

        {/* Footer with timestamp and recompute */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ color: 'var(--ink-faint)', fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Last verified: {lastVerified
              ? new Date(lastVerified).toLocaleString()
              : (allDone ? new Date().toLocaleString() : 'Computing...')}
          </div>
        </div>

        {/* Navigation links */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--series-1)' }}>
          <h3 style={{ color: 'var(--series-1)', fontSize: 14, marginBottom: 8 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/rh-attack" style={{ color: 'var(--brass)', fontSize: 12 }}>RH Approach</Link>
            <Link to="/proof-checker" style={{ color: 'var(--brass)', fontSize: 12 }}>Proof Checker</Link>
            <Link to="/proof-overview" style={{ color: 'var(--brass)', fontSize: 12 }}>Proof Overview</Link>
            <Link to="/proof-planner" style={{ color: 'var(--brass)', fontSize: 12 }}>Proof Planner</Link>
            <Link to="/statistics" style={{ color: 'var(--brass)', fontSize: 12 }}>Statistics</Link>
            <Link to="/gap-closing" style={{ color: 'var(--brass)', fontSize: 12 }}>Gap Closing</Link>
          </div>
          <p style={{ margin: '14px 0 0' }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
