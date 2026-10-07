/**
 * weil-balance — the explicit formula drawn as a level balance, with values computed for one real probe.
 *
 * Probe (tmp/concept-diagram-weil-probe.py, a = 1): phi(u) = exp(-1/(1-u^2)) on (-1, 1), h = phi/4 - phi'',
 * so hhat(t) = (t^2 + 1/4) phihat(t) and hhat(+-i/2) = 0 (pole terms vanish); ||h||_2 = 1; g = h*h on [-2, 2].
 *   background B = (1/2pi) int hhat^2 (Re psi(1/4 + it/2) - log pi) dt = 0.4267101
 *   prime sum  P = 2 sum_{log n <= 2} Lambda(n) n^{-1/2} g(log n)        = -0.3838618  (n = 2, 3, 4, 5; n = 7 adds 1e-8)
 *   zeros      Z = 2 sum_{gamma > 0} hhat(gamma)^2 (first 5000 zeros)   = 0.8105720  = B - P to 4.8e-11
 *   per-zero terms 2 hhat(gamma_k)^2: 0.4023630, 0.1740741, 0.1454994 (k = 1, 2, 3), the rest 0.0886355.
 */
import React from 'react';
import { DiagramSvg, DiagramText } from './kit.jsx';

const B = 0.4267101;
const P = -0.3838618;
const Z = 0.810572;
const ZT = [
  { k: '±γ₁', v: 0.402363, at: 14.1347 },
  { k: '±γ₂', v: 0.1740741, at: 21.022 },
  { k: '±γ₃', v: 0.1454994, at: 25.0109 },
  { k: 'rest', v: Z - 0.402363 - 0.1740741 - 0.1454994 },
];
const fmt = (v) => v.toFixed(3).replace('-', '\u2212');

const U = 100; // SVG units per unit of W
const GAP = 2;
const BASE = 176; // top of the pans
const LX = 118; const RX = 302; const BEAM = 56; const SW = 28;

function stack(values, x) {
  let y = BASE;
  return values.map((v, i) => {
    const h = v * U;
    const seg = { x: x - SW / 2, y: y - h, h, mid: y - h / 2, i };
    y -= h + GAP;
    return seg;
  });
}

export default function WeilBalance({ idBase, title, alt }) {
  const left = stack([B, -P], LX);
  const right = stack(ZT.map((z) => z.v), RX);
  const rim = 46;
  return (
    <>
      <DiagramSvg idBase={idBase} viewBox="0 0 420 280" title={title || 'The explicit formula as a balance'} desc={alt}>
        <text x="210" y="20" textAnchor="middle" className="cd-t cd-soft">Explicit formula: the two sides are equal, so the beam is level</text>

        {/* frame: post, base, beam, strings, pans */}
        <line x1="210" y1={BEAM} x2="210" y2="236" className="cd-frame" />
        <path d="M188 240 L232 240 L210 222 Z" className="cd-frame-fill" />
        <line x1={LX - 12} y1={BEAM} x2={RX + 12} y2={BEAM} className="cd-beam" />
        <circle cx="210" cy={BEAM} r="4" className="cd-fill-ink" />
        {[LX, RX].map((x) => (
          <g key={x}>
            <line x1={x} y1={BEAM} x2={x - rim} y2={BASE + 4} className="cd-string" />
            <line x1={x} y1={BEAM} x2={x + rim} y2={BASE + 4} className="cd-string" />
            <path d={`M${x - rim - 6} ${BASE + 4} Q${x} ${BASE + 22} ${x + rim + 6} ${BASE + 4}`} className="cd-pan" />
          </g>
        ))}

        {/* left stack: background and minus the prime sum */}
        {left.map((s) => (
          <rect key={s.i} x={s.x} y={s.y} width={SW} height={s.h} rx="2" className="cd-fill-c3">
            <title>{s.i === 0 ? `background ${B.toFixed(4)}` : `minus prime sum: −(${P.toFixed(4)}) = ${(-P).toFixed(4)}`}</title>
          </rect>
        ))}
        <line x1={LX - 48} y1={left[0].mid} x2={LX - SW / 2 - 3} y2={left[0].mid} className="cd-leader" />
        <line x1={LX - 48} y1={left[1].mid} x2={LX - SW / 2 - 3} y2={left[1].mid} className="cd-leader" />
        <text x={LX - 52} y={left[0].mid - 2} textAnchor="end" className="cd-t cd-sm cd-halo">background</text>
        <text x={LX - 52} y={left[0].mid + 11} textAnchor="end" className="cd-mono cd-halo">{fmt(B)}</text>
        <text x={LX - 52} y={left[1].mid - 2} textAnchor="end" className="cd-t cd-sm cd-halo">− primes</text>
        <text x={LX - 52} y={left[1].mid + 11} textAnchor="end" className="cd-mono cd-halo">−({fmt(P)})</text>

        {/* right stack: zero-side terms */}
        {right.map((s) => (
          <rect key={s.i} x={s.x} y={s.y} width={SW} height={s.h} rx="2" className="cd-fill-c1">
            <title>{ZT[s.i].at ? `zero at height ${ZT[s.i].at}: ${ZT[s.i].v.toFixed(4)}` : `all other zeros: ${ZT[s.i].v.toFixed(4)}`}</title>
          </rect>
        ))}
        {right.map((s) => (
          <g key={`l${s.i}`}>
            <line x1={RX + SW / 2 + 3} y1={s.mid} x2={RX + 44} y2={s.mid} className="cd-leader" />
            <text x={RX + 48} y={s.mid + 3.5} className="cd-mono cd-halo">{ZT[s.i].k} {fmt(ZT[s.i].v)}</text>
          </g>
        ))}

        {/* totals under the pans */}
        <text x={LX} y="210" textAnchor="middle" className="cd-t cd-sm">background − primes</text>
        <text x={LX} y="224" textAnchor="middle" className="cd-mono">{fmt(B)} − ({fmt(P)}) = {fmt(B - P)}</text>
        <text x={RX} y="210" textAnchor="middle" className="cd-t cd-sm">zeros: sum of |ĥ(γ)|²</text>
        <text x={RX} y="224" textAnchor="middle" className="cd-mono">= {fmt(Z)}</text>

        <text x="210" y="258" textAnchor="middle" className="cd-t">RH ⟺ the zero side is ≥ 0 for every admissible probe,</text>
        <text x="210" y="273" textAnchor="middle" className="cd-t cd-soft">i.e. “background − primes” is never negative.</text>
      </DiagramSvg>
      <DiagramText alt={alt}>
        <table className="cd-table">
          <caption>Values for the probe in the caption (‖h‖ = 1)</caption>
          <thead><tr><th scope="col">Term</th><th scope="col">Value</th></tr></thead>
          <tbody>
            <tr><td>background (gamma factor)</td><td>{B.toFixed(7)}</td></tr>
            <tr><td>prime sum, n = 2, 3, 4, 5 (7 adds 10⁻⁸)</td><td>{P.toFixed(7)}</td></tr>
            <tr><td>background − prime sum</td><td>{(B - P).toFixed(7)}</td></tr>
            {ZT.map((z) => <tr key={z.k}><td>zero side: {z.at ? `${z.k} (height ${z.at})` : 'all other zeros'}</td><td>{z.v.toFixed(7)}</td></tr>)}
            <tr><td>zero side, first 5000 zeros</td><td>{Z.toFixed(7)}</td></tr>
          </tbody>
        </table>
      </DiagramText>
    </>
  );
}
