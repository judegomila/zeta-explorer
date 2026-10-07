/**
 * weil-support-ladder — support sizes at which Weil positivity is proved, certified or measured.
 *
 * One convention throughout: 2a = width of the support of the probe h (h in L^2(-a, a)) = half-width of the
 * support of g = h * h~ = the largest log n that enters the prime sum. Every marker converted to it:
 *  - Yoshida 1992 / Connes-Consani 2021: g in C_c([2^{-1/2}, 2^{1/2}]) multiplicative (their g = our h), so
 *    log-support [-ln2/2, ln2/2], 2a = ln 2 = 0.6931; pole-free (Fourier transform vanishing at +-i/2).
 *    Connes-Consani, arXiv:2006.13771, Introduction: "This result was proved in [34]" = Yoshida 1992.
 *    Connes-Consani Theorem 1 (Sonin-trace lower bound) additionally needs the Fourier transform to vanish at 0 (v1, p.2).
 *  - Toeplitz-Krein: 2a <= 0.96, interval arithmetic (src/data/rh-route-i-toeplitz-krein-certificate-2026-09-24.js).
 *  - ARB-LEGE: h in L^2(-a, a), a <= (ln 3)/2, i.e. 2a <= ln 3 = 1.0986 (src/data/tlb-arb-lege-2026-09-28.js).
 *  - p = 2-only crossing: 2a* = 1.1316 at low Galerkin N (src/data/project-attempts-dag.js routes-i-pencil-highres-map);
 *    drifts 1.1305 (N = 20) -> 1.1003 (N = 52) (src/data/imp-97560-crossing-2astar-drift-vs-N-measurement.js). Measured.
 *  - Davenport-Heilbronn twin: g supported in [-a, a] with (g*g)(log n), n <= e^{2a} (same convention, their g = our h):
 *    proved >= 0 for 2a <= 0.78306, certified negative witness at a = 1.72 i.e. 2a = 3.44, finite-basis positive
 *    through a = 1.70 i.e. 2a = 3.40 (src/data/tlb-dh-blind-2026-09-28.js); certified positive for 2a <= ln 11 = 2.3979
 *    (src/data/dag3-dhblindln3-2026-09-28.js).
 *  - RES-T: fhat(r) = (r - H) sinc^2(T(r - H)/2), supp f in [-T, T], zero term fhat(gamma) conj fhat(conj gamma), so f is
 *    the probe h and T = a; primes n <= e^{2T}. T_X = 3.882 at X = 3e12 -> 2a = 7.764
 *    (src/data/imp-95530-native-span-arithmetic-input-rigidity.js, tmp/rh-arith-input-A-compact-support-detection.mjs).
 */
import React from 'react';
import { DiagramSvg, DiagramText, scale, ArrowDefs, LineKey } from './kit.jsx';

const LN2 = Math.log(2);
const LN3 = Math.log(3);
const LN11 = Math.log(11);

export const LADDER_MARKERS = [
  { what: 'Yoshida 1992 (as cited by Connes–Consani 2021): pole-free Weil positivity', twoA: LN2, native: 'support of f = g∗g* in (1/2, 2), multiplicative', fn: 'ζ', tier: 'proved (peer-reviewed)' },
  { what: 'Connes–Consani 2021, Theorem 1: Sonin-trace lower bound, hence positivity, when the Fourier transform also vanishes at 0', twoA: LN2, native: 'their g (our h) supported in [2^−1/2, 2^1/2], multiplicative; Fourier transform vanishing at ±i/2 and at 0', fn: 'ζ', tier: 'proved (peer-reviewed)' },
  { what: 'Toeplitz–Krein certificate, pole-free positivity', twoA: 0.96, native: 'a ≤ 0.48', fn: 'ζ', tier: 'certified (interval arithmetic, internal review)' },
  { what: 'ARB-LEGE certificate, W(h) ≥ 8.2045368·10⁻⁴‖h‖² (pole-free)', twoA: LN3, native: 'h in L²(−a, a), a ≤ (ln 3)/2', fn: 'ζ', tier: 'certified (Arb, two internal referee passes)' },
  { what: 'Form with only the p = 2 term turns indefinite', twoA: 1.1316, native: '2a* = 1.1316 (N ≈ 20) drifting to 1.1003 (N = 52)', fn: 'ζ, one-prime model', tier: 'measured (Galerkin, not converged in N)' },
  { what: 'RES-T ceiling at verified height X = 3·10¹²', twoA: 7.764, native: 'T_X = 3.882 with supp h ⊂ [−T, T]', fn: 'ζ', tier: 'project lemma (leading order, unreviewed)' },
  { what: 'Davenport–Heilbronn twin: W ≥ 0', twoA: 0.78306, native: 'same convention', fn: 'F_DH (RH false)', tier: 'proved (closed-form bound; project, internal review only)' },
  { what: 'Davenport–Heilbronn twin: W ≥ 6.9·10⁻⁹‖h‖²', twoA: LN11, native: '2a ≤ ln 11', fn: 'F_DH (RH false)', tier: 'certified (Arb, internal review)' },
  { what: 'Davenport–Heilbronn twin: positive in finite bases', twoA: 3.40, native: 'a ≤ 1.70', fn: 'F_DH (RH false)', tier: 'measured' },
  { what: 'Davenport–Heilbronn twin: explicit h with W(h) < 0', twoA: 3.44, native: 'a = 1.72', fn: 'F_DH (RH false)', tier: 'certified (Arb, internal review)' },
];

export default function WeilSupportLadder({ idBase, title, alt }) {
  const X = scale(0, 8, 24, 372);
  const Zx = scale(0.6, 1.2, 24, 404);
  const zY = 90; const dY = 128; const axY = 154;
  return (
    <>
      <DiagramSvg idBase={idBase} viewBox="0 0 420 424" title={title || 'Support sizes for Weil positivity'} desc={alt}>
        <ArrowDefs idBase={idBase} />
        {/* legend */}
        <LineKey x={24} y={14} cls="cd-seg cd-proved cd-stroke-ink" label="proved" />
        <LineKey x={110} y={14} cls="cd-seg cd-cert cd-stroke-ink" label="certified, computer-assisted" />
        <LineKey x={308} y={14} cls="cd-seg cd-meas cd-stroke-ink" label="measured" />
        <LineKey x={24} y={32} cls="cd-seg cd-proved cd-stroke-c1" label="ζ (Riemann zeta)" />
        <LineKey x={170} y={32} cls="cd-seg cd-proved cd-stroke-c2" label="Davenport–Heilbronn twin (RH false)" />

        {/* overview */}
        <text x="24" y="58" className="cd-t cd-strong">All supports, 2a from 0 to 8</text>
        <rect x={X(0.6)} y={zY - 18} width={X(1.2) - X(0.6)} height={dY - zY + 26} className="cd-zoomband" />
        <text x="24" y={zY - 10} className="cd-t cd-sm">ζ: pole-free Weil positivity</text>
        <line x1={X(0)} x2={X(LN2)} y1={zY} y2={zY} className="cd-seg cd-proved cd-stroke-c1" />
        <line x1={X(LN2)} x2={X(LN3)} y1={zY} y2={zY} className="cd-seg cd-cert cd-stroke-c1" />
        <line x1={X(7.764)} x2={X(7.764)} y1={zY - 10} y2={zY + 10} className="cd-tick" />
        <text x={X(7.764) + 4} y={zY - 30} textAnchor="end" className="cd-t cd-sm cd-halo">RES-T ceiling, 2a = 7.76</text>
        <text x={X(7.764) + 4} y={zY - 17} textAnchor="end" className="cd-t cd-sm cd-soft cd-halo">project lemma, leading order</text>

        <text x="24" y={dY - 10} className="cd-t cd-sm">Davenport–Heilbronn twin (conductor 5)</text>
        <line x1={X(0)} x2={X(0.78306)} y1={dY} y2={dY} className="cd-seg cd-proved cd-stroke-c2" />
        <line x1={X(0.78306)} x2={X(LN11)} y1={dY} y2={dY} className="cd-seg cd-cert cd-stroke-c2" />
        <line x1={X(LN11)} x2={X(3.40)} y1={dY} y2={dY} className="cd-seg cd-meas cd-stroke-c2" />
        <g className="cd-seg cd-stroke-c2">
          <line x1={X(3.44) - 4} y1={dY - 4} x2={X(3.44) + 4} y2={dY + 4} />
          <line x1={X(3.44) - 4} y1={dY + 4} x2={X(3.44) + 4} y2={dY - 4} />
          <title>2a = 3.44: explicit probe with W &lt; 0 (certified, Arb)</title>
        </g>
        <text x={X(3.44) + 9} y={dY + 4} className="cd-t cd-sm cd-halo">W &lt; 0 certified at 2a = 3.44</text>

        <line x1={X(0)} x2={X(8)} y1={axY} y2={axY} className="cd-axis" />
        <line x1={X(8)} x2="414" y1={axY} y2={axY} className="cd-axis cd-meas-axis" markerEnd={`url(#${idBase}-arr)`} />
        <text x="414" y={axY - 7} textAnchor="end" className="cd-t cd-sm cd-halo">all 2a ⟺ RH (open)</text>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
          <g key={v}>
            <line x1={X(v)} x2={X(v)} y1={axY} y2={axY + 4} className="cd-axis" />
            <text x={X(v)} y={axY + 15} textAnchor="middle" className="cd-mono">{v}</text>
          </g>
        ))}
        <text x="414" y={axY + 15} textAnchor="end" className="cd-mono">∞</text>
        <text x="24" y={axY + 31} className="cd-t cd-sm cd-soft">shaded band: enlarged below</text>
        <text x="404" y={axY + 31} textAnchor="end" className="cd-t cd-sm cd-soft">2a = width of the support of h</text>

        {/* detail */}
        <line x1="10" x2="410" y1="200" y2="200" className="cd-grid" />
        <text x="24" y="218" className="cd-t cd-strong">Detail for ζ, 2a from 0.6 to 1.2</text>
        {[[LN2, 'ln 2 = 0.693'], [LN3, 'ln 3 = 1.099']].map(([v, l]) => (
          <g key={l}>
            <line x1={Zx(v)} x2={Zx(v)} y1="226" y2="388" className="cd-grid" />
            <text x={Zx(v)} y="398" textAnchor="middle" className="cd-mono">{l}</text>
          </g>
        ))}
        <text x="24" y="240" className="cd-t cd-sm cd-halo">Yoshida 1992; Connes–Consani 2021: 2a ≤ ln 2</text>
        <line x1={Zx(0.6)} x2={Zx(LN2)} y1="250" y2="250" className="cd-seg cd-proved cd-stroke-c1" />
        <text x="24" y="276" className="cd-t cd-sm cd-halo">Toeplitz–Krein certificate (interval arithmetic): 2a ≤ 0.96</text>
        <line x1={Zx(0.6)} x2={Zx(0.96)} y1="286" y2="286" className="cd-seg cd-cert cd-stroke-c1" />
        <text x="24" y="312" className="cd-t cd-sm cd-halo">ARB-LEGE certificate (Arb): 0.96 &lt; 2a ≤ ln 3</text>
        <line x1={Zx(0.96)} x2={Zx(LN3)} y1="322" y2="322" className="cd-seg cd-cert cd-stroke-c1" />
        <text x={Zx(1.09)} y="348" textAnchor="end" className="cd-t cd-sm cd-halo">form with only the p = 2 term turns indefinite:</text>
        <text x={Zx(1.09)} y="362" textAnchor="end" className="cd-t cd-sm cd-halo">2a* = 1.132 (N ≈ 20) drifting to 1.100 (N = 52)</text>
        <g className="cd-seg cd-meas cd-stroke-c1">
          <line x1={Zx(1.1003)} x2={Zx(1.1316)} y1="356" y2="356" />
        </g>
        <line x1={Zx(1.1003)} x2={Zx(1.1003)} y1="351" y2="361" className="cd-tick-c1" />
        <line x1={Zx(1.1316)} x2={Zx(1.1316)} y1="351" y2="361" className="cd-tick-c1" />
        <line x1={Zx(0.6)} x2={Zx(1.2)} y1="388" y2="388" className="cd-axis" />
        {[0.6, 0.8, 1.0, 1.2].map((v) => (
          <g key={v}>
            <line x1={Zx(v)} x2={Zx(v)} y1="388" y2="392" className="cd-axis" />
            <text x={Zx(v)} y="414" textAnchor="middle" className="cd-mono">{v.toFixed(1)}</text>
          </g>
        ))}
      </DiagramSvg>
      <DiagramText alt={alt}>
        <table className="cd-table">
          <caption>Markers, converted to 2a = width of the support of h</caption>
          <thead><tr><th scope="col">Result</th><th scope="col">2a</th><th scope="col">As stated in the source</th><th scope="col">Function</th><th scope="col">Status</th></tr></thead>
          <tbody>
            {LADDER_MARKERS.map((m) => (
              <tr key={m.what}><td>{m.what}</td><td>{m.twoA.toFixed(4)}</td><td>{m.native}</td><td>{m.fn}</td><td>{m.tier}</td></tr>
            ))}
          </tbody>
        </table>
      </DiagramText>
    </>
  );
}
