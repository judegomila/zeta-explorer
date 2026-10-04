import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { liCoefficients } from '../math/rh-attack.js';
import { ZETA_ZEROS, zetaCriticalStrip, cAbs } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';
import { directLadder, dualLadder } from '../math/oscillators.js';
import { ED, alpha } from '../styles/tokens.js';

// Try to Break the Model — editorial (warm) re-theme.
// Same interactive challenges/math as before (see src/math/rh-attack.js,
// zeta.js, primes.js, oscillators.js); only the chrome is re-themed to the
// warm editorial palette (src/styles/editorial.css). Every claim, number and
// caveat below is kept verbatim — this page exists to be approached, so it has
// to stay.

// Warm-palette hex equivalents of editorial.css's --blue/--green/--brass/
// --brass-dk/--terra-dk. Kept as literal hex (not var(...)) because the
// Challenge number-badge below does `color + '20'` to derive a translucent
// fill, which only works on a hex string.
const HUE_BLUE = ED.series1;
const HUE_GREEN = ED.series3;
const HUE_BRASS = ED.brass;
const HUE_BRASS_DK = ED.brassDeco;
const HUE_TERRA_DK = ED.series2;

function Challenge({ number, title, color, claim, test, children }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card" style={{ borderLeft: `3px solid ${color}`, marginBottom: 16, cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); }}}
      onClick={() => setExpanded(!expanded)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: color + '20', color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{number}</span>
        <div>
          <h3 style={{ color, fontSize: 14, margin: 0 }}>{title}</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, margin: 0 }}>Claim: {claim}</p>
        </div>
        <span style={{ marginLeft: 'auto', color: 'var(--faint)' }}>{expanded ? '▼' : '▶'}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--hairline)', paddingTop: 12 }}>
          <div style={{ color: 'var(--brass-dk)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Can you break this?
          </div>
          {children}
        </div>
      )}
    </div>
  );
}

function UnitarityChallenge() {
  const [numPrimes, setNumPrimes] = useState(20);
  const [tValue, setTValue] = useState(14.13);

  const result = useMemo(() => {
    const s = [0.5, tValue];
    const dir = directLadder(s, numPrimes);
    const dual = dualLadder(s, numPrimes);
    const Zd = dir.totalImpedance;
    const Zu = dual.totalImpedance;
    const Zsum = [Zd[0] + Zu[0], Zd[1] + Zu[1]];
    const ZsumMag = Math.sqrt(Zsum[0] ** 2 + Zsum[1] ** 2);
    if (ZsumMag < 1e-20) return { deficit: NaN };
    const Zdiff = [Zd[0] - Zu[0], Zd[1] - Zu[1]];
    const S11Re = (Zdiff[0] * Zsum[0] + Zdiff[1] * Zsum[1]) / (ZsumMag ** 2);
    const S11Im = (Zdiff[1] * Zsum[0] - Zdiff[0] * Zsum[1]) / (ZsumMag ** 2);
    const S11mag = Math.sqrt(S11Re ** 2 + S11Im ** 2);
    const geoR = Math.sqrt(Math.max(Zd[0], 0) * Math.max(Zu[0], 0));
    const S21mag = 2 * geoR / ZsumMag;
    return { deficit: Math.abs(S11mag ** 2 + S21mag ** 2 - 1), S11mag, S21mag };
  }, [numPrimes, tValue]);

  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
        Try to find a (numPrimes, t) combination where the unitarity deficit exceeds 0.01.
        If you can, our Mertens bound is wrong.
      </p>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>Primes</label>
          <input type="range" min="5" max="200" step="5" value={numPrimes}
            aria-label={`Number of primes: ${numPrimes}`}
            onChange={e => setNumPrimes(+e.target.value)} />
          <span className="control-value">{numPrimes}</span>
        </div>
        <div className="control-group">
          <label>t value</label>
          <input type="range" min="5" max="500" step="0.5" value={tValue}
            aria-label={`t value: ${tValue.toFixed(1)}`}
            onChange={e => setTValue(+e.target.value)} />
          <span className="control-value">{tValue.toFixed(1)}</span>
        </div>
      </div>
      <div style={{ padding: '10px 14px', borderRadius: 6,
        background: result.deficit < 0.01 ? 'color-mix(in srgb, var(--series-3) 8%, transparent)' : 'color-mix(in srgb, var(--series-2) 8%, transparent)',
        border: `1px solid ${result.deficit < 0.01 ? alpha(ED.series3, 0.25) : alpha(ED.series2, 0.25)}` }}>
        <strong style={{ color: result.deficit < 0.01 ? 'var(--green)' : 'var(--terra-dk)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
          δ = {result.deficit?.toExponential(4) || 'NaN'} {result.deficit < 0.01 ? '✓ PASSES' : '✗ FAILED'}
        </strong>
        <div style={{ color: 'var(--faint)', fontSize: 12, marginTop: 4 }}>
          |S₁₁| = {result.S11mag?.toFixed(4)} | |S₂₁| = {result.S21mag?.toFixed(4)}
        </div>
      </div>
    </div>
  );
}

function LiChallenge() {
  const [maxN, setMaxN] = useState(20);
  const [numZeros, setNumZeros] = useState(100);
  const data = useMemo(() => liCoefficients(maxN, numZeros), [maxN, numZeros]);

  const firstNegative = data.find(d => !d.positive);

  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
        Try to find an n where <InlineMath tex="\lambda_n \leq 0" />. If RH is true, you can't.
        Increase n or decrease the number of zeros to make the computation less accurate.
      </p>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>Max n</label>
          <input type="range" min="5" max="50" step="1" value={maxN}
            aria-label={`Maximum n: ${maxN}`}
            onChange={e => setMaxN(+e.target.value)} />
          <span className="control-value">{maxN}</span>
        </div>
        <div className="control-group">
          <label>Zeros used</label>
          <input type="range" min="10" max="500" step="10" value={numZeros}
            aria-label={`Number of zeros used: ${numZeros}`}
            onChange={e => setNumZeros(+e.target.value)} />
          <span className="control-value">{numZeros}</span>
        </div>
      </div>
      <div style={{ padding: '10px 14px', borderRadius: 6,
        background: firstNegative ? 'color-mix(in srgb, var(--series-2) 8%, transparent)' : 'color-mix(in srgb, var(--series-3) 8%, transparent)',
        border: `1px solid ${firstNegative ? alpha(ED.series2, 0.25) : alpha(ED.series3, 0.25)}` }}>
        <strong style={{ color: firstNegative ? 'var(--terra-dk)' : 'var(--green)' }}>
          {firstNegative ? `✗ λ_${firstNegative.n} = ${firstNegative.lambda.toExponential(4)} < 0` : `✓ All ${maxN} Li coefficients positive`}
        </strong>
        <div style={{ color: 'var(--faint)', fontSize: 11, marginTop: 4, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
          {data.slice(0, 8).map(d => `λ_${d.n}=${d.lambda.toFixed(2)}`).join(' | ')}
        </div>
      </div>
    </div>
  );
}

function ConvexityChallenge() {
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [numPrimes, setNumPrimes] = useState(20);

  const h = useMemo(() => {
    const primes = getPrimes(numPrimes);
    let val = 0;
    for (const p of primes) {
      const logP = Math.log(p);
      const pS = Math.pow(p, -sigma);
      const phase = t * logP;
      const denom = (1 - pS * Math.cos(phase)) ** 2 + (pS * Math.sin(phase)) ** 2;
      val += logP / Math.max(denom, 1e-15);
    }
    return val;
  }, [sigma, t, numPrimes]);

  const hHalf = useMemo(() => {
    const primes = getPrimes(numPrimes);
    let val = 0;
    for (const p of primes) {
      const logP = Math.log(p);
      const pH = Math.pow(p, -0.5);
      const phase = t * logP;
      const denom = (1 - pH * Math.cos(phase)) ** 2 + (pH * Math.sin(phase)) ** 2;
      val += logP / Math.max(denom, 1e-15);
    }
    return val;
  }, [t, numPrimes]);

  const isMinimum = h >= hHalf - 1e-6;

  return (
    <div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
        Try to find a σ where H(σ,t) {"<"} H(½,t). If you can, the energy landscape argument fails.
      </p>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>σ</label>
          <input type="range" min="0.1" max="0.9" step="0.01" value={sigma}
            aria-label={`sigma value: ${sigma.toFixed(2)}`}
            onChange={e => setSigma(+e.target.value)} />
          <span className="control-value">{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>t</label>
          <input type="range" min="5" max="200" step="0.5" value={t}
            aria-label={`t value: ${t.toFixed(1)}`}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
        </div>
      </div>
      <div style={{ padding: '10px 14px', borderRadius: 6,
        background: isMinimum ? 'color-mix(in srgb, var(--series-3) 8%, transparent)' : 'color-mix(in srgb, var(--series-2) 8%, transparent)',
        border: `1px solid ${isMinimum ? alpha(ED.series3, 0.25) : alpha(ED.series2, 0.25)}` }}>
        <strong style={{ color: isMinimum ? 'var(--green)' : 'var(--terra-dk)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
          H({sigma.toFixed(2)}, {t.toFixed(1)}) = {h.toFixed(2)} | H(½, {t.toFixed(1)}) = {hHalf.toFixed(2)}
          {isMinimum ? ' ✓ σ=½ is minimum' : ' ✗ FOUND LOWER ENERGY'}
        </strong>
      </div>
    </div>
  );
}

export default function BreakItPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Try to Break the Model</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Each challenge below presents a Twin-Ladder Bridge claim with interactive controls.
            Your goal: find parameters that make it FAIL. If you succeed, you've found a genuine flaw.
            If you can't, that establishes nothing beyond the finite range you checked — a finite
            computation is not a theorem, and no amount of passing sliders turns these claims into one.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--brass-dk)', background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)' }}>
          <p style={{ color: 'var(--brass-dk)', fontSize: 13, fontWeight: 600, margin: 0 }}>
            Rules: Drag sliders to extreme values. Use very few primes. Try large t.
            Try σ far from ½. If any metric turns red — you've found something worth investigating.
          </p>
        </div>

        <Challenge number={1} title="S-Matrix Unitarity" color={HUE_BLUE}
          claim="|S₁₁|² + |S₂₁|² = 1 on σ = ½ (deficit < 0.01)">
          <UnitarityChallenge />
        </Challenge>

        <Challenge number={2} title="Li Coefficient Positivity" color={HUE_GREEN}
          claim="λ_n > 0 for all n (RH equivalent)">
          <LiChallenge />
        </Challenge>

        <Challenge number={3} title="Hamiltonian Convexity" color={HUE_BRASS}
          claim="H(σ,t) is minimized at σ = ½ for all t">
          <ConvexityChallenge />
        </Challenge>

        <Challenge number={4} title="Bridge Unitarity" color={HUE_BRASS_DK}
          claim="|χ(½+it)| = 1 exactly — the bridge is lossless">
          <div style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
            <p>This is a mathematical identity: <InlineMath tex="|\chi(\tfrac{1}{2}+it)| = 1" /> for all real t.
            It follows from the functional equation and cannot be broken computationally — it's PROVEN.
            The only objection is to question whether the bridge interpretation is physically meaningful.</p>
            <div style={{ padding: '8px 12px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-3) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--series-3) 25%, transparent)', marginTop: 8 }}>
              <strong style={{ color: 'var(--green)' }}>✓ UNBREAKABLE — mathematical identity</strong>
            </div>
          </div>
        </Challenge>

        <Challenge number={5} title="The Gap (RH-equivalent)" color={HUE_TERRA_DK}
          claim="J-contractivity persists in the N→∞ limit — equivalent to RH, not a technical step">
          <div style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
            <p>This is the remaining gap, and it is not a plausible axiom one lemma away from closing:
            the limiting contractivity statement is <strong>equivalent to RH itself</strong> (in the
            compiled operator form, <InlineMath tex="\|V\| \leq 1" /> — see{' '}
            <Link to="/what-we-know" style={{ color: 'var(--brass-dk)' }}>What We Know §26</Link>).
            Assuming it assumes the conclusion. The sketched argument — S_N → S_∞ in operator norm
            (O(1/log P) via Mertens), J-contractivity closed in operator norm, therefore S_∞ is
            J-contractive — fails because the norm convergence estimate is itself unproven at the
            strength required; proving it is where the full difficulty of RH sits.</p>
            <p style={{ color: 'var(--brass-dk)', fontWeight: 600, marginTop: 8 }}>
              To break the model here, exhibit the equivalence failure directly: either (a) show the
              claimed operator-norm convergence rate is wrong, or (b) show the finite-N contractivity
              data is compatible with a non-contractive limit. No finite computation on this page can
              settle the statement either way.
            </p>
            <BlockMath tex="\|S_N - S_\infty\|_{\text{op}} \to 0 \ \text{(unproven at required strength)} \implies S_\infty^* J S_\infty \leq J \iff \text{RH}" />
          </div>
        </Challenge>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              ['/proof-overview', 'Proof Overview'],
              ['/gap-closing', 'Gap Closing'],
              ['/rh-attack', 'RH Approach'],
              ['/proof-planner', 'Proof Planner'],
              ['/proof-checker', 'Proof Checker'],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 13,
                background: 'var(--paper)', color: 'var(--brass-dk)',
                textDecoration: 'none', border: '1px solid var(--hairline)',
              }}>{label}</Link>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/" style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
              ← the atlas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
