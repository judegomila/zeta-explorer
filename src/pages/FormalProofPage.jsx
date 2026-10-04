import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import FormalProofViz from '../components/FormalProofViz.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { PROOF_SECTIONS, overallProofStatus } from '../math/formal-proof.js';
import { STATUS, ED } from '../styles/tokens.js';

// Formal Proof Attempt — the Twin-Ladder Bridge (ZPO) 10-section proof sketch.
// Editorial (warm) re-theme: full-width dashboard, identical structure/data.
// RH is NOT proved here; this is a gap-tracking framework only.

const STATUS_COLORS = {
  proven: STATUS.proved.fg,
  conditional: STATUS.conditional.fg,
  gap: STATUS.open.fg,
  open: STATUS.open.fg,
};

const STATUS_LABELS = {
  proven: 'Proven',
  conditional: 'Conditional',
  gap: 'Gap',
  open: 'Open',
};

export default function FormalProofPage() {
  const status = overallProofStatus();
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Formal Proof Attempt</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
            A structured attempt to prove the Riemann Hypothesis through the Twin-Ladder Bridge
            (ZPO) framework. This page lays out every step of the argument, identifies exactly
            where the gaps lie, and provides computational verification of each claim.
          </p>
        </div>

        {/* ── clarity Statement ── */}
        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--accent)' }}>
          <h3 style={{ color: 'var(--accent)', fontSize: 14, marginBottom: 8 }}>Status</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            This is <strong style={{ color: 'var(--accent)' }}>NOT</strong> a complete proof of the Riemann Hypothesis.
            It is a <em>framework for identifying exactly where the gaps lie</em>. The Twin-Ladder Bridge model
            provides a physically motivated structure that is consistent with RH, but{' '}
            <strong>consistency is not proof</strong>. Of the 10 sections below,{' '}
            only {status.counts.proven} are rigorously proven, {status.counts.conditional} are conditional
            on unverified hypotheses, {status.counts.gap} contain specific mathematical gaps, and{' '}
            {status.counts.open} remain open problems. The critical gaps (S5, S7) represent deep
            unsolved questions in spectral theory and network synthesis. Closing them would require
            genuinely new mathematics.
          </p>
        </div>

        {/* ── Main Theorem Statement ── */}
        <div className="card" style={{ marginBottom: 24, background: 'var(--paper)', borderLeft: '3px solid var(--brass)' }}>
          <BlockMath tex={
            '\\boxed{\\textbf{Riemann Hypothesis:}\\quad ' +
            '\\zeta(\\rho) = 0,\\; \\rho \\text{ nontrivial} ' +
            '\\;\\Longrightarrow\\; \\operatorname{Re}(\\rho) = \\tfrac{1}{2}}'
          } />
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="two-col" style={{ marginTop: 24, marginBottom: 24 }}>
          {/* Left Column: Proof Structure */}
          <div className="card">
            <h3 style={{ color: 'var(--series-1)', fontSize: 14, marginBottom: 4 }}>Proof Structure</h3>
            <p style={{ color: 'var(--ink-faint)', fontSize: 11, marginBottom: 10 }}>Click a section to view its statement and gap analysis.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PROOF_SECTIONS.map(section => {
                const color = STATUS_COLORS[section.status];
                const isOpen = selectedSection?.id === section.id;
                return (
                  <div key={section.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      aria-controls={`section-panel-${section.id}`}
                      onClick={() => setSelectedSection(isOpen ? null : section)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSection(isOpen ? null : section); }}}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: isOpen ? '6px 6px 0 0' : 6,
                        background: isOpen ? color + '14' : color + '08',
                        borderLeft: `3px solid ${color}`,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--ed-mono, var(--font-mono))', fontWeight: 700,
                        fontSize: 11, color, minWidth: 24,
                      }}>
                        {section.id}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--ink)', flex: 1 }}>
                        {section.title}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                        background: color + '20', color,
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        {STATUS_LABELS[section.status]}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--ink-faint)', marginLeft: 2 }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                    {isOpen && (
                      <div style={{
                        padding: '10px 12px', borderRadius: '0 0 6px 6px',
                        background: color + '0c',
                        borderLeft: `3px solid ${color}`,
                        borderTop: `1px solid ${color}30`,
                      }}>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statement</span>
                          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--ink)', overflowX: 'auto' }}>
                            <BlockMath tex={section.statement} />
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gap Analysis</span>
                          <p style={{ marginTop: 4, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{section.gapAnalysis}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Current Assessment */}
          <div className="card">
            <h3 style={{ color: 'var(--brass)', fontSize: 14, marginBottom: 12 }}>Current Assessment</h3>

            {/* Progress bars */}
            <div style={{ marginBottom: 16 }}>
              {[
                { label: 'Proven', count: status.counts.proven, pct: status.percentages.proven, color: ED.series3 },
                { label: 'Conditional', count: status.counts.conditional, pct: status.percentages.conditional, color: ED.brass },
                { label: 'Gap', count: status.counts.gap, pct: status.percentages.gap, color: ED.brass },
                { label: 'Open', count: status.counts.open, pct: status.percentages.open, color: ED.accent },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: item.color, fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: 'var(--ink-faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                      {item.count}/{status.total} ({item.pct}%)
                    </span>
                  </div>
                  <div style={{
                    height: 6, borderRadius: 3, background: 'var(--paper-3)', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      width: `${item.pct}%`,
                      background: item.color,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Key findings */}
            <h4 style={{ color: 'var(--series-3)', fontSize: 12, marginBottom: 8 }}>What IS Established</h4>
            <ul style={{ marginLeft: 14, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              <li>
                Euler factors <InlineMath tex="H_p(s) = 1/(1-p^{-s})" /> are valid transfer functions (S1)
              </li>
              <li>
                The cascade <InlineMath tex={"\\zeta(s) = \\prod H_p(s)"} /> converges for{' '}
                <InlineMath tex={"\\sigma > 1"} /> (S2)
              </li>
              <li>
                The bridge satisfies <InlineMath tex={"|\\chi(\\tfrac{1}{2}+it)| = 1"} /> exactly (S3)
              </li>
            </ul>

            <h4 style={{ color: 'var(--accent)', fontSize: 12, marginTop: 12, marginBottom: 8 }}>Critical Gaps</h4>
            <ul style={{ marginLeft: 14, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8 }}>
              <li>
                <strong style={{ color: 'var(--brass)' }}>S5:</strong> No self-adjoint operator with
                spectrum = zeta zeros has been constructed (Hilbert-Polya gap)
              </li>
              <li>
                <strong style={{ color: 'var(--brass)' }}>S7:</strong> Darlington synthesis requires exact
                losslessness for the entire infinite network, not just the bridge
              </li>
              <li>
                <strong style={{ color: 'var(--accent)' }}>S8, S10:</strong> Spectral confinement and
                completeness remain open — these ARE the Riemann Hypothesis
              </li>
            </ul>

            <div style={{
              marginTop: 12, padding: '8px 12px', borderRadius: 6,
              background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
              fontSize: 11, color: 'var(--accent)', lineHeight: 1.6,
            }}>
              <strong>Verdict:</strong> {status.verdict}
            </div>
          </div>
        </div>

        {/* ── Interactive Visualization ── */}
        <h2 className="ed-h2" style={{ marginTop: 32, marginBottom: 12 }}>Interactive Proof Explorer</h2>
        <div style={{ marginBottom: 8 }}>
          <FormalProofViz />
        </div>

        {/* ── Critical Path Card ── */}
        <div className="card" style={{ marginTop: 32, border: '2px solid var(--brass-deco)' }}>
          <h3 style={{ color: 'var(--brass)', fontSize: 14, marginBottom: 12 }}>
            Critical Path: What Needs to Be Proved
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
            The Twin-Ladder Bridge framework identifies three independent paths that would each prove RH if completed.
            Each requires closing a single critical gap:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {/* Path A: Hilbert-Polya */}
            <div style={{
              padding: '14px 16px', borderRadius: 8, background: 'var(--paper-2)',
              border: '1px solid color-mix(in srgb, var(--brass) 40%, transparent)',
            }}>
              <h4 style={{ color: 'var(--brass)', fontSize: 12, marginBottom: 8 }}>
                Path A: Spectral (Hilbert-Polya)
              </h4>
              <ol style={{ marginLeft: 14, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.9 }}>
                <li>S1 + S2: Euler product = oscillator cascade <span style={{ color: 'var(--series-3)' }}>[Done]</span></li>
                <li>S3: Functional equation = lossless bridge <span style={{ color: 'var(--series-3)' }}>[Done]</span></li>
                <li>S4: Continue cascade to critical strip <span style={{ color: 'var(--brass)' }}>[Conditional]</span></li>
                <li style={{ color: 'var(--brass)', fontWeight: 600 }}>
                  S5: Construct self-adjoint operator <span>[GAP]</span>
                </li>
                <li>S8: Eigenvalues are real, so <InlineMath tex={"\\text{Re}(\\rho) = \\tfrac{1}{2}"} /></li>
              </ol>
            </div>

            {/* Path B: Darlington */}
            <div style={{
              padding: '14px 16px', borderRadius: 8, background: 'var(--paper-2)',
              border: '1px solid color-mix(in srgb, var(--brass) 40%, transparent)',
            }}>
              <h4 style={{ color: 'var(--brass)', fontSize: 12, marginBottom: 8 }}>
                Path B: Network Synthesis (audited obstruction)
              </h4>
              <ol style={{ marginLeft: 14, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.9 }}>
                <li>S1 + S2: Twin-ladder = cascade network <span style={{ color: 'var(--series-3)' }}>[Done]</span></li>
                <li>S3: Bridge is unitary at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> <span style={{ color: 'var(--series-3)' }}>[Done]</span></li>
                <li>S4: Extend to critical strip <span style={{ color: 'var(--brass)' }}>[Conditional]</span></li>
                <li style={{ color: 'var(--brass)', fontWeight: 600 }}>
                  S7: Prove exact Darlington conditions <span>[GAP]</span>
                </li>
                <li style={{ color: 'var(--accent)' }}>
                  S8: Blocked — zeta zeros are poles of
                  <InlineMath tex={"S_{21}=\\zeta(2s)/\\zeta(s)"} />, not transmission zeros
                </li>
              </ol>
            </div>

            {/* Path C: Connes / Weil Positivity */}
            <div style={{
              padding: '14px 16px', borderRadius: 8, background: 'var(--paper-2)',
              border: '1px solid color-mix(in srgb, var(--series-1) 40%, transparent)',
            }}>
              <h4 style={{ color: 'var(--series-1)', fontSize: 12, marginBottom: 8 }}>
                Path C: Weil Positivity (Connes)
              </h4>
              <ol style={{ marginLeft: 14, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.9 }}>
                <li>Weil explicit formula defines quadratic form <InlineMath tex={"W(f)"} /> <span style={{ color: 'var(--series-3)' }}>[Classical]</span></li>
                <li>Small-prime extremization recovers zeros <span style={{ color: 'var(--series-3)' }}>[Numerical]</span></li>
                <li style={{ color: 'var(--series-1)', fontWeight: 600 }}>
                  Prove <InlineMath tex={"W(g * \\tilde{g}) \\geq 0"} /> for all admissible <InlineMath tex={"g"} /> <span>[GAP]</span>
                </li>
                <li>Positivity <InlineMath tex={"\\Longleftrightarrow"} /> RH</li>
              </ol>
            </div>
          </div>

          <div style={{
            marginTop: 16, padding: '10px 14px', borderRadius: 6,
            background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 40%, transparent)',
            fontSize: 12, color: 'var(--brass)', lineHeight: 1.7,
          }}>
            <strong>Bottom line:</strong> The Twin-Ladder Bridge framework reduces the Riemann Hypothesis to a question
            in spectral theory (construct a self-adjoint operator), network synthesis
            (prove an infinite analytic realization <em>and</em> a valid pole-confinement bridge), or Weil positivity
            (prove non-negativity of <InlineMath tex={"W(g * \\tilde{g})"} /> for all admissible{' '}
            <InlineMath tex={"g"} />). All three are deep open problems,
            but they provide concrete mathematical targets rather than vague aspirations.
          </div>
        </div>

        {/* ── Twin-Ladder Bridge Theorem Statement ── */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--series-1)', fontSize: 14, marginBottom: 12 }}>
            The Twin-Ladder Bridge Proof Attempt: Formal Statement
          </h3>
          <BlockMath tex={
            '\\text{If } \\exists \\text{ self-adjoint } \\mathcal{A} \\text{ on } L^2(X, \\mu) ' +
            '\\text{ s.t. } \\operatorname{Spec}(\\mathcal{A}) = \\{\\gamma_n\\}_{n=1}^{\\infty} ' +
            '\\text{ where } \\zeta(\\tfrac{1}{2} + i\\gamma_n) = 0,'
          } />
          <BlockMath tex={
            '\\text{then } \\gamma_n \\in \\mathbb{R} \\;\\forall n ' +
            '\\;\\Longrightarrow\\; \\operatorname{Re}(\\rho_n) = \\tfrac{1}{2} \\;\\forall n ' +
            '\\;\\Longrightarrow\\; \\text{RH.}'
          } />
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            The Twin-Ladder Bridge candidate for <InlineMath tex={"\\mathcal{A}"} /> is the quantization of the
            Hamiltonian <InlineMath tex={"\\mathcal{H}(\\sigma,t)"} /> restricted to the critical line.
            The Hilbert space <InlineMath tex={"L^2(X,\\mu)"} /> would be constructed from the prime
            oscillator chain. <strong style={{ color: 'var(--accent)' }}>This construction is not yet
            achieved</strong> — it is the content of Gap S5.
          </p>
        </div>

        {/* ── Supporting Evidence Summary ── */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--series-3)', fontSize: 14, marginBottom: 12 }}>
            Supporting Computational Evidence
          </h3>
          <table style={{ width: '100%', fontSize: 12, color: 'var(--ink-soft)', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--ink)' }}>Test</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--ink)' }}>Result</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--ink)' }}>Proves RH?</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Li coefficients lambda_n > 0 for n = 1..40',
                  'All positive (using 650 zeros)',
                  'No. Finite computation only verifies consistency.'
                ],
                [
                  'H(sigma,t) minimized at sigma = 1/2',
                  'Confirmed for all tested t in [10, 1000]',
                  'No. Energy minimum != zero location without S5.'
                ],
                [
                  '|chi(1/2 + it)| = 1',
                  'Exact to machine precision',
                  'Yes, but this is a known theorem (functional eq).'
                ],
                [
                  'First 10^13 zeros on critical line',
                  'Confirmed (Gourdon 2004; Platt-Trudgian 2021 rigorous to 3×10¹²)',
                  'No. Any finite check cannot prove RH.'
                ],
                [
                  'de Bruijn-Newman constant Lambda >= 0',
                  'Proved (Rodgers-Tao 2020); upper bound Lambda <= 0.2 (Platt-Trudgian 2021)',
                  'No. Lambda = 0 is EQUIVALENT to RH and remains open; Lambda >= 0 means RH, if true, is "barely true".'
                ],
                [
                  'Entropy/capacity/MI peak at sigma = 1/2',
                  'Confirmed numerically',
                  'No. Information-theoretic analogy, not proof.'
                ],
              ].map(([test, result, proves], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                  <td style={{ padding: '6px 10px', fontSize: 11 }}>{test}</td>
                  <td style={{ padding: '6px 10px', color: 'var(--series-3)', fontSize: 11 }}>{result}</td>
                  <td style={{ padding: '6px 10px', color: 'var(--brass)', fontSize: 11 }}>{proves}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── New Computational Evidence: Selberg Trace Test ── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--series-1)' }}>
          <h3 style={{ color: 'var(--series-1)', fontSize: 14, marginBottom: 12 }}>
            New Computational Evidence: Selberg Trace Test
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            The <code style={{ color: 'var(--series-1)' }}>selbergTraceTest</code> function computes both sides
            of the explicit formula independently. The <strong style={{ color: 'var(--ink)' }}>spectral
            side</strong> (sum over nontrivial zeros) should equal the{' '}
            <strong style={{ color: 'var(--ink)' }}>geometric side</strong> (sum over prime powers).
            Agreement provides a consistency check on the prime-zero duality that underlies both the
            Twin-Ladder Bridge framework and classical analytic number theory.
          </p>
          <BlockMath tex={
            '\\sum_{\\rho}\\, h(\\gamma_\\rho) \\;=\\; ' +
            '\\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} h(r)\\,\\Omega(r)\\,dr ' +
            '\\;+\\; \\sum_{p,\\,k} \\frac{\\log p}{p^{k/2}}\\, ' +
            '\\hat{h}(k \\cdot \\log p)'
          } />
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            The test evaluates this identity for a Gaussian test function{' '}
            <InlineMath tex={"h(r) = e^{-\\alpha r^2}"} /> and reports the relative error between
            the two sides. Color coding:{' '}
            <span style={{ color: 'var(--series-3)', fontWeight: 600 }}>green</span> if relative error &lt; 1%,{' '}
            <span style={{ color: 'var(--brass)', fontWeight: 600 }}>orange</span> if &lt; 5%,{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>red</span> otherwise.
            This test <strong style={{ color: 'var(--brass)' }}>does not prove RH</strong>, but it
            validates the internal consistency of the prime-zero correspondence that the ZPO
            framework is built upon.
          </p>
        </div>

        {/* ── Berry-Keating Eigenvalue Test ── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass-deco)' }}>
          <h3 style={{ color: 'var(--brass)', fontSize: 14, marginBottom: 12 }}>
            Berry-Keating Eigenvalue Test
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            Berry and Keating (1999) proposed <InlineMath tex={"H = xp"} /> as the Hilbert-Polya
            operator whose eigenvalues would be the imaginary parts of the nontrivial zeros.
            The <code style={{ color: 'var(--series-1)' }}>berryKeatingEigenvalues</code> function computes
            eigenvalues via semiclassical (WKB) quantization of this Hamiltonian, applying the
            Bohr-Sommerfeld condition:
          </p>
          <BlockMath tex={
            '\\oint p\\, dx \\;=\\; 2\\pi\\left(n + \\tfrac{1}{2}\\right), \\qquad n = 0, 1, 2, \\ldots'
          } />
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            Comparing with known zeros: the semiclassical eigenvalues agree within ~1% for the
            first ~10 eigenvalues, then gradually diverge as higher-order corrections become
            significant. This provides evidence for{' '}
            <strong style={{ color: 'var(--brass)' }}>Gap S5</strong> (existence of a self-adjoint
            operator) but is <strong style={{ color: 'var(--accent)' }}>NOT a proof</strong> —
            semiclassical quantization is an approximation, not an exact spectral result.
            Closing S5 would require constructing the exact quantum Hamiltonian and proving
            self-adjointness on a suitable Hilbert space. See the{' '}
            <Link to="/berry-keating-xp" style={{ color: 'var(--brass)' }}>Berry-Keating H = xp</Link>{' '}
            page for the eigenvalue construction in detail.
          </p>
          <div style={{
            marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 8, fontSize: 11, color: 'var(--ink-soft)',
          }}>
            <div style={{
              padding: '8px 12px', borderRadius: 6, background: 'var(--paper-2)',
              border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)',
            }}>
              <span style={{ color: 'var(--brass)', fontWeight: 600 }}>Semiclassical</span>
              <br />
              First ~10 eigenvalues match known <InlineMath tex={"\\gamma_n"} /> to ~1%
            </div>
            <div style={{
              padding: '8px 12px', borderRadius: 6, background: 'var(--paper-2)',
              border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Limitation</span>
              <br />
              Higher eigenvalues diverge; WKB is not exact
            </div>
          </div>
        </div>

        {/* ── Connes' Weil Form: A New Path ── */}
        <div className="card" style={{ marginTop: 24, border: '2px solid var(--series-1)' }}>
          <h3 style={{ color: 'var(--series-1)', fontSize: 14, marginBottom: 12 }}>
            Connes' Weil Form: A New Path
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
            Connes (2026) showed that extremizing the Weil quadratic form recovers the nontrivial
            zeros of <InlineMath tex={"\\zeta(s)"} /> from information about only small primes.
            This provides a <strong style={{ color: 'var(--series-1)' }}>third independent path</strong> to
            the Riemann Hypothesis, alongside the Hilbert-Polya (Path A) and Darlington (Path B)
            approaches:
          </p>
          <BlockMath tex={
            'W(g * \\tilde{g}) \\;\\geq\\; 0 \\quad \\text{for all admissible } g ' +
            '\\;\\;\\Longleftrightarrow\\;\\; \\text{RH}'
          } />
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            The Weil explicit formula defines a quadratic form{' '}
            <InlineMath tex={"W(f) = \\sum_\\rho \\hat{f}(\\gamma_\\rho)"} /> over test functions.
            Connes' key insight is that the positivity of <InlineMath tex={"W(g * \\tilde{g})"} />{' '}
            for all admissible <InlineMath tex={"g"} /> is <em>equivalent</em> to RH. Moreover,
            the extremization procedure using only primes <InlineMath tex={"p < 13"} /> already
            locates the first ~50 nontrivial zeros with high accuracy.
          </p>

          <div style={{
            marginTop: 16, padding: '14px 16px', borderRadius: 8, background: 'var(--paper-2)',
            border: '1px solid color-mix(in srgb, var(--series-1) 40%, transparent)',
          }}>
            <h4 style={{ color: 'var(--series-1)', fontSize: 12, marginBottom: 8 }}>
              Path C: Weil Positivity (Connes)
            </h4>
            <ol style={{ marginLeft: 14, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.9 }}>
              <li>Define Weil quadratic form <InlineMath tex={"W(f)"} /> via explicit formula <span style={{ color: 'var(--series-3)' }}>[Classical]</span></li>
              <li>Show small-prime extremization recovers zeros <span style={{ color: 'var(--series-3)' }}>[Numerical, primes &lt; 13]</span></li>
              <li style={{ color: 'var(--brass)', fontWeight: 600 }}>
                Prove <InlineMath tex={"W(g * \\tilde{g}) \\geq 0"} /> for all admissible <InlineMath tex={"g"} /> <span>[GAP]</span>
              </li>
              <li>Positivity implies all zeros on critical line <span style={{ color: 'var(--brass)' }}>[Conditional on step 3]</span></li>
            </ol>
          </div>

          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            This path is particularly appealing because it reduces RH to a positivity question
            about a specific quadratic form, bypassing the need for explicit operator construction (S5)
            or infinite network synthesis (S7). See the{' '}
            <Link to="/hamiltonian" style={{ color: 'var(--series-1)' }}>Hamiltonian page</Link>{' '}
            for related spectral analysis, and the{' '}
            <Link to="/connes-adelic" style={{ color: 'var(--series-1)' }}>Connes adelic trace</Link>{' '}
            page for the small-prime Weil-form construction in detail.
          </p>
        </div>

        {/* ── Updated Scorecard ── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--series-1)' }}>
          <h3 style={{ color: 'var(--series-1)', fontSize: 14, marginBottom: 12 }}>
            Updated Scorecard
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
            Summary of all computational tests now available in the Twin-Ladder Bridge framework:
          </p>
          <table style={{ width: '100%', fontSize: 12, color: 'var(--ink-soft)', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--ink)' }}>Test</th>
                <th style={{ textAlign: 'center', padding: '6px 10px', color: 'var(--ink)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--ink)' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  test: 'Bridge unitarity',
                  status: 'PASSED',
                  color: ED.series3,
                  notes: 'Proven — follows from the functional equation',
                },
                {
                  test: 'Li coefficients',
                  status: 'PASSED',
                  color: ED.series3,
                  notes: 'Numerical — all positive for n = 1..40',
                },
                {
                  test: 'Hamiltonian minimization',
                  status: 'PASSED',
                  color: ED.series3,
                  notes: 'Numerical — confirmed for t in [10, 1000]',
                },
                {
                  test: 'Selberg trace',
                  status: 'PASSED',
                  color: ED.series3,
                  notes: 'New — spectral/geometric sides agree (< 1% error)',
                },
                {
                  test: 'Berry-Keating eigenvalues',
                  status: 'PARTIAL',
                  color: ED.brass,
                  notes: 'First ~10 match known zeros, then diverge',
                },
                {
                  test: 'Weil form extremization',
                  status: 'PASSED',
                  color: ED.series3,
                  notes: 'Primes < 13 recover ~50 zeros (Connes 2026)',
                },
                {
                  test: 'D-H discriminator',
                  status: 'PASSED',
                  color: ED.series3,
                  notes: 'Euler product structure is essential',
                },
                {
                  test: 'Bootstrap confidence',
                  status: 'MIXED',
                  color: ED.brass,
                  notes: '2 strong, 4 weak strategies',
                },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                  <td style={{ padding: '6px 10px', fontSize: 11 }}>{row.test}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
                      background: row.color + '20', color: row.color,
                      textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '6px 10px', fontSize: 11 }}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            marginTop: 16, padding: '10px 14px', borderRadius: 6,
            background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 40%, transparent)',
            fontSize: 12, color: 'var(--series-1)', lineHeight: 1.7,
          }}>
            <strong>Summary:</strong> Six of eight tests pass outright. Berry-Keating eigenvalues
            are partial (semiclassical only), and bootstrap confidence is mixed. None of these
            computational results constitute a proof, but they provide strong evidence that the
            Twin-Ladder Bridge framework captures genuine structure in the distribution of zeta zeros.
          </div>
        </div>

        {/* ── Computational Evidence Summary Scorecard ── */}
        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--series-1)' }}>
          <h3 style={{ color: 'var(--series-1)', fontSize: 14, marginBottom: 16 }}>
            Computational Evidence Summary
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>
            Compact scorecard of every numerical test executed across the Twin-Ladder Bridge framework.
            Each entry records the test name, domain, verdict, and the section of the proof it supports.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {[
              { name: 'Bridge Unitarity', section: 'S3', verdict: 'EXACT', color: ED.series3, icon: '=',
                detail: '|chi(1/2+it)|=1 to machine eps' },
              { name: 'Li Coefficients', section: 'S6', verdict: 'PASS', color: ED.series3, icon: '+',
                detail: 'lambda_n > 0 for n=1..40 (650 zeros)' },
              { name: 'Hamiltonian Min', section: 'S4', verdict: 'PASS', color: ED.series3, icon: 'V',
                detail: 'argmin H = 1/2 for t in [10,1000]' },
              { name: 'Selberg Trace', section: 'S2', verdict: 'PASS', color: ED.series3, icon: 'T',
                detail: 'Spectral = Geometric (<1% error)' },
              { name: 'Berry-Keating WKB', section: 'S5', verdict: 'PARTIAL', color: ED.brass, icon: '~',
                detail: 'First 10 eigenvalues match, then drift' },
              { name: 'Weil Extremization', section: 'S9', verdict: 'PASS', color: ED.series3, icon: 'W',
                detail: 'Primes <13 recover ~50 zeros' },
              { name: 'D-H Discriminator', section: 'S1', verdict: 'PASS', color: ED.series3, icon: 'D',
                detail: 'Euler product structure essential' },
              { name: 'Bootstrap Confidence', section: 'S8', verdict: 'MIXED', color: ED.brass, icon: 'B',
                detail: '2 strong + 4 weak strategies' },
              { name: 'Platt Zero Check', section: 'S10', verdict: 'PASS', color: ED.series3, icon: '#',
                detail: 'Zeros verified to height 3×10¹² (rigorous)' },
              { name: 'Entropy Peak', section: 'S4', verdict: 'PASS', color: ED.series3, icon: 'S',
                detail: 'Entropy/capacity/MI peak at sigma=1/2' },
              { name: 'de Bruijn-Newman', section: 'S10', verdict: 'PROVEN', color: ED.series1, icon: 'L',
                detail: 'Lambda>=0 (Rodgers-Tao 2020); Lambda=0 is equivalent to RH and open' },
              { name: 'Gradient Descent', section: 'S4', verdict: 'PASS', color: ED.series3, icon: 'G',
                detail: 'Converges to sigma=1/2 for all tested zeros' },
            ].map((t, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 8, background: 'var(--paper-2)',
                border: `1px solid ${t.color}25`,
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: 'var(--ink)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 4, display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: t.color + '18', color: t.color,
                      fontSize: 10, fontWeight: 800, fontFamily: 'var(--ed-mono, var(--font-mono))',
                    }}>{t.icon}</span>
                    {t.name}
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 3,
                    background: t.color + '20', color: t.color,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{t.verdict}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
                  Section {t.section}
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  {t.detail}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16, display: 'flex', gap: 16, alignItems: 'center',
            padding: '10px 14px', borderRadius: 6,
            background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 30%, transparent)',
          }}>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              <span style={{ color: 'var(--series-3)', fontWeight: 700 }}>
                8 PASS
              </span>
              <span style={{ color: 'var(--series-1)', fontWeight: 700 }}>
                1 PROVEN
              </span>
              <span style={{ color: 'var(--brass)', fontWeight: 700 }}>
                2 PARTIAL/MIXED
              </span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                0 FAIL
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--ink-soft)', marginLeft: 'auto' }}>
              1 external theorem (de Bruijn-Newman). No result constitutes a proof of RH.
            </span>
          </div>
        </div>

        {/* ── Related Pages ── */}
        <div className="card" style={{ marginTop: 24, background: 'color-mix(in srgb, var(--series-1) 4%, transparent)' }}>
          <h3 style={{ color: 'var(--ink-faint)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/rh-attack" style={{ color: 'var(--series-1)', fontSize: 13 }}>RH Approach</Link>
            <span style={{ color: 'var(--rule)' }}>|</span>
            <Link to="/spectral-attack" style={{ color: 'var(--series-1)', fontSize: 13 }}>Spectral Approach</Link>
            <span style={{ color: 'var(--rule)' }}>|</span>
            <Link to="/gap-closing" style={{ color: 'var(--series-1)', fontSize: 13 }}>Gap Closing</Link>
            <span style={{ color: 'var(--rule)' }}>|</span>
            <Link to="/proof-checker" style={{ color: 'var(--series-1)', fontSize: 13 }}>Proof Checker</Link>
            <span style={{ color: 'var(--rule)' }}>|</span>
            <Link to="/rigor" style={{ color: 'var(--series-1)', fontSize: 13 }}>Rigor Criticisms</Link>
          </div>
        </div>

        <div className="ed-postfoot">
          <Link to="/">← the atlas</Link>
        </div>
      </div>
    </div>
  );
}
