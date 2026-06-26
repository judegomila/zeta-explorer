import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncMetric } from '../hooks/useAsyncMetric.js';
import PageHeader from '../components/PageHeader.jsx';
import FreshnessBanner from '../components/FreshnessBanner.jsx';
// A1 fix: use the precomputed ~6 KB summary instead of the full 16 MB sweep
// module. The full module (which transitively imports 10^6 Odlyzko zeros)
// is still used by daily-health-check.sh for drift detection.
import { EMPIRICAL_M_SWEEP_EXTENDED_SUMMARY as EMPIRICAL_M_SWEEP_EXTENDED } from '../data/empirical-m-sweep-extended-summary.js';
// imp-2956: honest top-line status, sourced from the same canonical data module
// as /state-of-program so the two surfaces cannot drift. Light, no heavy imports.
import { STATE_OF_PROGRAM_TRUTHS } from '../data/state-of-program-truths.js';

const ProofStatusCard = lazy(() => import('../components/ProofStatusCard.jsx'));

/**
 * RH Proof Dashboard — Live Metrics (imp-060)
 *
 * A "mission control" page showing all key proof metrics in real time.
 * Each card computes its metric via useMemo and shows a status badge.
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
  const color = ok ? '#10b981' : '#ef4444';

  return (
    <div className="card" style={{ marginBottom: 24, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 14, color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
          Empirical-Λ Floor (UNCOND-Λ PATH 1)
        </h3>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 18,
          color,
          fontWeight: 700,
        }}>
          N ≤ {N_max.toLocaleString()}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
        <span>
          E1 (ρ non-decreasing):{' '}
          <strong style={{ color: e1 ? '#10b981' : '#ef4444' }}>{e1 ? '✓' : '✗'}</strong>
        </span>
        <span>
          E2 (τ_c_est non-increasing):{' '}
          <strong style={{ color: e2 ? '#10b981' : '#ef4444' }}>{e2 ? '✓' : '✗'}</strong>
        </span>
        <span>
          violations: <strong>{r.empiricalPredicates.E1_rhoNonDecreasing.violations + r.empiricalPredicates.E2_tauEstNonIncreasing.violations}</strong>
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
        Direct sweep on Odlyzko zeros; both predicates verified — no C_mb, no GUE on this range.
        Widening from the original 870-zero floor:{' '}
        <strong style={{ color: '#a5b4fc' }}>{Math.round(N_max / r.previousEmpiricalFloor.N_max)}×</strong>.{' '}
        <Link to="/full-story#uncond" style={{ color: '#38bdf8' }}>Improving Bounds on Λ →</Link>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      display: 'inline-block',
      width: 20, height: 20,
      border: '2px solid #334155',
      borderTop: '2px solid #38bdf8',
      borderRadius: '50%',
      animation: 'dashboard-spin 0.8s linear infinite',
    }} />
  );
}

const STATUS_COLORS = {
  green: { border: '#10b981', bg: 'rgba(16,185,129,0.08)', badge: '#10b981', text: 'PASS' },
  red: { border: '#ef4444', bg: 'rgba(239,68,68,0.08)', badge: '#ef4444', text: 'FAIL' },
  yellow: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', badge: '#f59e0b', text: 'COND' },
};

function MetricCard({ title, subtitle, status, value, detail, loading, error }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.yellow;

  return (
    <div style={{
      background: loading ? '#0f172a' : colors.bg,
      border: `1.5px solid ${loading ? '#334155' : colors.border}`,
      borderRadius: 10,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minHeight: 140,
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 14, color: '#e2e8f0', fontWeight: 600 }}>{title}</h3>
        {!loading && !error && (
          <span style={{
            background: colors.badge,
            color: '#000',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
            letterSpacing: 0.5,
          }}>
            {colors.text}
          </span>
        )}
      </div>
      {subtitle && (
        <div style={{ color: '#64748b', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{subtitle}</div>
      )}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div style={{ color: '#ef4444', fontSize: 12 }}>Error: {error}</div>
        ) : (
          <div style={{
            fontFamily: 'var(--font-mono)',
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
        <div style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.5 }}>{detail}</div>
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
      `\u03BB${i + 1}=${c.lambda.toFixed(4)}`
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
    <div className="page">
      <style>{`
        @keyframes dashboard-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <PageHeader title="RH Proof Dashboard -- Live Metrics">
        <p>
          Real-time computation of key Riemann Hypothesis proof metrics from the ZPO
          oscillator framework. Each card runs an independent computation and reports
          pass/fail status with numerical values.
        </p>
      </PageHeader>

      <FreshnessBanner date="2026-06-23" note="latest research session; metrics computed live on load" />

      {/* imp-2956: honest "state of the program" summary, sourced from the
          canonical STATE_OF_PROGRAM_TRUTHS data module (same facts as
          /state-of-program) so the top-line status cannot drift. */}
      <div
        className="card"
        style={{ marginBottom: 24, borderLeft: '3px solid #94a3b8' }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <strong style={{ color: '#e2e8f0', fontSize: 15 }}>Honest state of the program</strong>
          <Link to="/state-of-program" style={{ fontSize: 12.5 }}>Full state of the program →</Link>
        </div>
        <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.55, margin: '0 0 12px' }}>
          Top-line status before reading any single metric below: there is no shortcut below RH anywhere in the map.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {STATE_OF_PROGRAM_TRUTHS.map((t) => (
            <div key={t.badge} style={{ border: `1px solid ${t.color}`, borderRadius: 6, padding: '8px 10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: t.color,
                }}
              >
                {t.badge}
              </span>
              <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45, marginTop: 4 }}>{t.title}</div>
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
          title="Proof Completeness"
          subtitle="Sections proven or numerically verified"
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
          <h3 style={{ margin: 0, fontSize: 14, color: '#e2e8f0' }}>Overall Proof Status</h3>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: completeness >= 0.8 ? '#10b981' : completeness >= 0.5 ? '#f59e0b' : '#ef4444',
            fontWeight: 700,
          }}>
            {proof.loading ? '...' : `${(completeness * 100).toFixed(0)}%`}
          </span>
        </div>
        <div style={{
          height: 12,
          background: '#1e293b',
          borderRadius: 6,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: proof.loading ? '0%' : `${completeness * 100}%`,
            background: completeness >= 0.8
              ? 'linear-gradient(90deg, #10b981, #34d399)'
              : completeness >= 0.5
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #ef4444, #f87171)',
            borderRadius: 6,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 8, fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)',
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
        <div style={{ color: '#64748b', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          Last verified: {lastVerified
            ? new Date(lastVerified).toLocaleString()
            : (allDone ? new Date().toLocaleString() : 'Computing...')}
        </div>
        <button
          onClick={handleRecompute}
          disabled={!allDone}
          style={{
            background: allDone ? '#3b82f6' : '#334155',
            color: allDone ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: 6,
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 600,
            cursor: allDone ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-mono)',
            transition: 'background 0.2s',
          }}
        >
          Recompute All
        </button>
      </div>

      {/* Shareable Status Card */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 12 }}>Shareable Proof Status Card</h3>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 12 }}>
          Generate a shareable image showing proof status. Click "Save as PNG" to download.
        </p>
        <Suspense fallback={<div style={{ color: '#64748b', fontSize: 12 }}>Loading card...</div>}>
          <ProofStatusCard />
        </Suspense>
      </div>

      {/* Navigation links */}
      <div className="card" style={{ marginTop: 24, borderLeft: '3px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', fontSize: 14, marginBottom: 8 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/rh-attack" style={{ color: '#38bdf8', fontSize: 12 }}>RH Attack</Link>
          <Link to="/proof-checker" style={{ color: '#38bdf8', fontSize: 12 }}>Proof Checker</Link>
          <Link to="/proof-overview" style={{ color: '#38bdf8', fontSize: 12 }}>Proof Overview</Link>
          <Link to="/proof-planner" style={{ color: '#38bdf8', fontSize: 12 }}>Proof Planner</Link>
          <Link to="/statistics" style={{ color: '#38bdf8', fontSize: 12 }}>Statistics</Link>
          <Link to="/gap-closing" style={{ color: '#38bdf8', fontSize: 12 }}>Gap Closing</Link>
        </div>
      </div>
    </div>
  );
}
