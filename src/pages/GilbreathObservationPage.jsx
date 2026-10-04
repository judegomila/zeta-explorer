import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import GilbreathTriangleViz from '../components/GilbreathTriangleViz.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

// Gilbreath's Observation Explorer — editorial (warm) re-theme, dashboard layout.
// GilbreathTriangleViz is kept exactly as-is; only the surrounding chrome is retheme'd.

export default function GilbreathObservationPage() {
  const [liveCert, setLiveCert] = useState(null);
  const handleCertUpdate = useCallback((data) => setLiveCert(data), []);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Gilbreath's Observation Explorer</h1>
          <AnimationEmbed id="gilbreath" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
            Write out the primes <InlineMath tex={"2, 3, 5, 7, 11, 13, \\ldots"} />, take the
            absolute differences of consecutive terms to form a new row, then repeat on that row,
            and so on. In 1958 Norman Gilbreath noticed (and Proth had observed in 1878) that the{' '}
            <strong>first entry of every derived row is always 1</strong>. Whether this holds
            forever is still an <strong style={{ color: 'var(--terra-dk)' }}>open conjecture</strong>.
            This explorer builds the iterated-difference triangle and boxes the leading column
            where the 1s live.
          </p>
        </div>

        <BlockMath tex={"a^{(0)}_i = p_{i+1}, \\qquad a^{(k)}_i = \\bigl| a^{(k-1)}_{i+1} - a^{(k-1)}_{i} \\bigr|, \\qquad a^{(k)}_0 \\stackrel{?}{=} 1 \\;\\; \\forall k \\ge 1"} />

        <div style={{ marginTop: 32 }}>
          <GilbreathTriangleViz onCertUpdate={handleCertUpdate} />
        </div>

        {liveCert && (
          <div style={{
            margin: '8px 0 0', padding: '8px 14px', borderRadius: 6,
            background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 35%, transparent)',
            fontSize: 12, fontFamily: 'var(--ed-mono, var(--font-mono))', color: 'var(--ink-soft)', lineHeight: 1.9,
          }}>
            <strong style={{ color: 'var(--green)' }}>Live verification</strong>
            {' '}({liveCert.sourceLabel}, {liveCert.numTerms} terms):{' '}
            rows 1–<strong style={{ color: 'var(--ink)' }}>{liveCert.cert.verifiedThrough}</strong> verified, a_k[0] = 1.{' '}
            {liveCert.cert.firstCleanRow !== null
              ? <>{'{0,2}'}-lock engaged at row <strong style={{ color: 'var(--blue)' }}>{liveCert.cert.firstCleanRow}</strong>; rows {liveCert.cert.firstCleanRow}–{liveCert.cert.guaranteedThrough} pinned structurally (Lemma B).</>
              : <span style={{ color: 'var(--faint)' }}>{'{0,2}'}-lock not yet engaged in this range.</span>}
          </div>
        )}

        <div className="two-col" style={{ marginTop: 32 }}>
          <div className="card">
            <h3 style={{ color: 'var(--blue)' }}>What the Triangle Shows</h3>
            <p style={{ marginTop: 8 }}>
              Row 0 is the prime sequence itself. Each subsequent row is the row of absolute
              differences of the one above it, so the triangle narrows by one cell per row. After
              just a few rows the entries collapse almost entirely into{' '}
              <strong style={{ color: 'var(--ink)' }}>0s</strong> and{' '}
              <strong style={{ color: 'var(--blue)' }}>2s</strong> — yet the leftmost entry stubbornly
              stays at <strong style={{ color: 'var(--brass)' }}>1</strong>. That persistent leading 1
              is the entire content of Gilbreath's observation.
            </p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--green)' }}>Is It Really About Primes?</h3>
            <p style={{ marginTop: 8 }}>
              Surprisingly, perhaps not. Hallard Croft conjectured that the leading-1 phenomenon is
              not special to primes at all — it should hold for <em>any</em> sequence that starts
              with 1 (or 2), grows reasonably, and whose gaps are even and not too large. Use the
              source toggle above to test this: drop the prime 2, or switch to a{' '}
              <strong>random even-gap sequence</strong>, and watch the leading 1s persist anyway.
              This reframes Gilbreath's conjecture as a statement about difference dynamics rather
              than about primes specifically.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--terra-dk)' }}>
          <h3 style={{ color: 'var(--terra-dk)', fontSize: 14, marginBottom: 12 }}>
            Status: Open, but Heavily Verified
          </h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
            Gilbreath's conjecture has <strong>never been proved</strong>. However, Andrew Odlyzko
            verified in 1993 that the leading entry stays 1 for every derived row down to a depth
            determined by the primes up to <InlineMath tex={"\\pi(10^{13}) \\approx 3.4 \\times 10^{11}"} /> terms.
            A heuristic argument explains <em>why</em> we expect it to hold — once a row consists
            mostly of 0s and 2s, the difference operation tends to preserve a leading 1 — but
            turning that heuristic into a rigorous proof remains elusive, largely because it
            requires control over the fine structure of prime gaps.
          </p>
        </div>

        <div className="card" style={{ marginTop: 24, borderColor: 'var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)' }}>How far the leading 1 can actually be proved</h3>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            The usual "rows become 0s and 2s, so the 1 survives" story is a heuristic — but it
            hides a surprising amount of <strong>rigour</strong>. The leading 1 is really{' '}
            <em>two</em> mechanisms, and one of them is a free theorem:
          </p>

          <div style={{ marginTop: 14 }}>
            <h4 style={{ color: 'var(--brass)', fontSize: 13, margin: '0 0 4px' }}>Lemma A — parity invariant (unconditional)</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
              Row 1 is the gap sequence <InlineMath tex={"(1,2,2,4,2,4,\\ldots)"} />: the first gap is
              odd, every later gap is even. Modulo 2 that is the unit vector{' '}
              <InlineMath tex={"(1,0,0,\\ldots)"} />, and since{' '}
              <InlineMath tex={"|a-b| \\equiv a+b \\pmod 2"} /> the difference operator acts as XOR, so
            </p>
            <BlockMath tex={"a^{(k)}_0 \\equiv \\sum_{j} \\binom{k-1}{j}\\, a^{(1)}_j \\equiv \\binom{k-1}{0}\\cdot 1 = 1 \\pmod 2 \\qquad \\forall k \\ge 1."} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
              So the leading entry is <strong style={{ color: 'var(--brass)' }}>always odd</strong> — it lives
              in <InlineMath tex={"\\{1,3,5,\\ldots\\}"} />. Toggle{' '}
              <strong>"Show mod 2"</strong> above and watch the entire leading column turn uniformly gold.
            </p>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ color: 'var(--green)', fontSize: 13, margin: '0 0 4px' }}>Lemma B — propagation fixed point (elementary)</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
              If a row has the form <InlineMath tex={"1, e_1, e_2, \\ldots"} /> with every{' '}
              <InlineMath tex={"e_i \\in \\{0,2\\}"} />, the next row is{' '}
              <InlineMath tex={"|e_1-1|, |e_2-e_1|, \\ldots"} />. But{' '}
              <InlineMath tex={"|0-1| = |2-1| = 1"} /> and the difference of two elements of{' '}
              <InlineMath tex={"\\{0,2\\}"} /> stays in <InlineMath tex={"\\{0,2\\}"} />. So the form{' '}
              <strong>regenerates itself</strong> — no run-length hypothesis needed. The dashed cyan
              line in the heatmap marks the first row that reaches this <InlineMath tex={"1,(0|2)^*"} />{' '}
              shape; below it the leading 1 is structurally locked.
            </p>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 13, margin: '0 0 4px' }}>Reduction — the open half, isolated</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
              Combining "always odd" (Lemma A) with "bounded by 2" forces the leading entry to equal 1.
              So the entire conjecture collapses to a single boundedness statement:
            </p>
            <BlockMath tex={"\\text{Gilbreath} \\iff a^{(k)}_0 \\le 2 \\;\\;\\forall k \\iff \\exists\\, r:\\; a^{(r)}_i \\in \\{0,2\\} \\;\\; \\forall\\, i \\ge 1."} />
            <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
              Equivalently: some finite row must have its <em>entire infinite tail</em> in{' '}
              <InlineMath tex={"\\{0,2\\}"} />. This is exactly where rigour stops. Prime gaps are{' '}
              <strong style={{ color: 'var(--terra-dk)' }}>unbounded</strong> (Cramér predicts maximal gaps{' '}
              <InlineMath tex={"\\sim (\\log x)^2"} />), so arbitrarily large values are injected
              arbitrarily deep into the triangle, and you must show the contraction toward{' '}
              <InlineMath tex={"\\{0,2\\}"} /> outpaces them <em>uniformly</em> in the starting length.
              That is an additive / 2-adic statement about the fine structure of gaps — and notably it
              is invisible to zeta-zero analysis, which only sees gaps in analytic average.
            </p>
          </div>

          <p style={{ marginTop: 16, padding: '10px 12px', borderRadius: 6,
                      background: 'color-mix(in srgb, var(--series-2) 7%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                      color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--terra-dk)' }}>Status.</strong> Lemmas A and B are proved here;
            the certificate above verifies the leading 1 by exact computation over the displayed range
            and shows where the structural lock engages. None of this closes the conjecture — the
            uniform-contraction core remains open, and no finite computation can reach the infinite
            tail. This page demonstrates the rigorous half and isolates the open half; it does{' '}
            <strong>not</strong> claim a proof.
          </p>
        </div>

        <div className="card" style={{ marginTop: 24, borderColor: 'var(--blue)' }}>
          <h3 style={{ color: 'var(--blue)' }}>Reading the Heatmap</h3>
          <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 }}>
            Each cell is colored by its value:{' '}
            <strong style={{ color: 'var(--ink)' }}>0 is dark</strong>,{' '}
            <strong style={{ color: 'var(--brass)' }}>1 is gold</strong>,{' '}
            <strong style={{ color: 'var(--blue)' }}>2 is blue</strong>, and larger values fade into a
            hot inferno palette. The boxed leftmost column is drawn{' '}
            <strong style={{ color: 'var(--green)' }}>green</strong> when every derived row begins with 1
            and <strong style={{ color: 'var(--terra-dk)' }}>red</strong> if the pattern ever breaks. Slide
            the term count and switch sources to probe how robust the leading-1 column really is.
          </p>
        </div>

        {/* Related Pages */}
        <div className="card" style={{ marginTop: 24, background: 'color-mix(in srgb, var(--series-1) 5%, transparent)' }}>
          <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Link to="/twin-ladder" style={{ color: 'var(--brass)', fontSize: 13 }}>Twin Ladder</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/mills-theorem" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>Mills' Theorem</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/zeta" style={{ color: 'var(--blue)', fontSize: 13 }}>Zeta Function</Link>
            <span style={{ color: 'var(--hairline)' }}>|</span>
            <Link to="/" style={{ color: 'var(--green)', fontSize: 13 }}>← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
