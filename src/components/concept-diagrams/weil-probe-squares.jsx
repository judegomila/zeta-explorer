/**
 * weil-probe-squares — a real probe h on [-a, a], its |hhat(t)|^2 sampled at the first ten zeta zero heights,
 * and a schematic of how a hypothetical off-line pair breaks the sum of squares.
 *
 * Probe (tmp/concept-diagram-weil-probe.py, a = 1): phi(u) = exp(-1/(1-u^2)), h = phi/4 - phi'' (pole-free:
 * hhat(t) = (t^2 + 1/4) phihat(t)), ||h||_2 = 1. H_Y: h(u) at u = -1, -0.99, ..., 1. HH_Y: |hhat(t)|^2 at
 * t = 0, 0.25, ..., 60. ZEROS: [gamma_k, |hhat(gamma_k)|^2] for k = 1..10 (Odlyzko ordinates from src/data/zeros-to-1e6.js).
 */
import React from 'react';
import { DiagramSvg, DiagramText, scale, pathOf, ArrowDefs } from './kit.jsx';

const H_Y = [0,0,0,-0.004,-0.071,-0.338,-0.817,-1.371,-1.848,-2.168,-2.315,-2.315,-2.205,-2.023,-1.801,-1.562,-1.321,-1.091,-0.876,-0.68,-0.505,-0.35,-0.214,-0.096,0.005,0.092,0.166,0.229,0.281,0.325,0.361,0.39,0.414,0.432,0.447,0.458,0.466,0.471,0.474,0.476,0.475,0.474,0.471,0.467,0.463,0.458,0.452,0.446,0.44,0.434,0.427,0.42,0.414,0.407,0.4,0.394,0.387,0.381,0.374,0.368,0.362,0.356,0.35,0.345,0.339,0.334,0.329,0.324,0.319,0.315,0.31,0.306,0.302,0.298,0.294,0.291,0.287,0.284,0.281,0.278,0.275,0.273,0.27,0.268,0.266,0.264,0.262,0.26,0.258,0.257,0.256,0.254,0.253,0.252,0.251,0.251,0.25,0.25,0.249,0.249,0.249,0.249,0.249,0.25,0.25,0.251,0.251,0.252,0.253,0.254,0.256,0.257,0.258,0.26,0.262,0.264,0.266,0.268,0.27,0.273,0.275,0.278,0.281,0.284,0.287,0.291,0.294,0.298,0.302,0.306,0.31,0.315,0.319,0.324,0.329,0.334,0.339,0.345,0.35,0.356,0.362,0.368,0.374,0.381,0.387,0.394,0.4,0.407,0.414,0.42,0.427,0.434,0.44,0.446,0.452,0.458,0.463,0.467,0.471,0.474,0.475,0.476,0.474,0.471,0.466,0.458,0.447,0.432,0.414,0.39,0.361,0.325,0.281,0.229,0.166,0.092,0.005,-0.096,-0.214,-0.35,-0.505,-0.68,-0.876,-1.091,-1.321,-1.562,-1.801,-2.023,-2.205,-2.315,-2.315,-2.168,-1.848,-1.371,-0.817,-0.338,-0.071,-0.004,0,0,0];
const HH_Y = [0.0011,0.0017,0.0043,0.0108,0.0238,0.0456,0.0774,0.1184,0.1658,0.2143,0.2578,0.2893,0.3033,0.2963,0.2678,0.2213,0.1632,0.1026,0.0494,0.0129,0,0.014,0.0536,0.1132,0.1837,0.2538,0.312,0.3487,0.3578,0.3375,0.2912,0.2265,0.1543,0.0862,0.0335,0.0043,0.0028,0.0281,0.0748,0.134,0.1945,0.2455,0.2779,0.286,0.2689,0.2297,0.1758,0.1166,0.0623,0.022,0.0018,0.0041,0.0271,0.0655,0.1112,0.1553,0.1893,0.2071,0.2056,0.1854,0.1507,0.1079,0.0649,0.0291,0.0065,0.0001,0.0102,0.0337,0.0653,0.0983,0.1262,0.1436,0.1474,0.1372,0.1151,0.0856,0.0542,0.0267,0.0076,0.0001,0.0046,0.0194,0.041,0.0647,0.0855,0.0994,0.1037,0.0979,0.0833,0.0628,0.0405,0.0205,0.0063,0.0002,0.0027,0.0128,0.0278,0.0446,0.0595,0.0695,0.0728,0.0688,0.0585,0.044,0.0282,0.0141,0.0042,0.0001,0.0021,0.0095,0.0203,0.0322,0.0425,0.0493,0.0512,0.0479,0.0402,0.0298,0.0186,0.0089,0.0023,0,0.002,0.0077,0.0157,0.024,0.0311,0.0354,0.0361,0.0331,0.0272,0.0196,0.0117,0.0051,0.001,0.0001,0.0022,0.0067,0.0125,0.0184,0.0231,0.0256,0.0254,0.0227,0.0181,0.0124,0.0069,0.0027,0.0003,0.0003,0.0023,0.0059,0.0103,0.0143,0.0173,0.0185,0.0178,0.0153,0.0117,0.0076,0.0038,0.0012,0,0.0005,0.0025,0.0053,0.0085,0.0112,0.0129,0.0133,0.0123,0.0102,0.0073,0.0044,0.0019,0.0004,0,0.0008,0.0026,0.0048,0.007,0.0087,0.0096,0.0095,0.0084,0.0066,0.0044,0.0024,0.0008,0.0001,0.0002,0.0011,0.0026,0.0042,0.0057,0.0067,0.0071,0.0066,0.0056,0.0041,0.0025,0.0011,0.0003,0,0.0004,0.0013,0.0024,0.0037,0.0046,0.0051,0.0051,0.0045,0.0036,0.0024,0.0013,0.0005,0,0.0001,0.0006,0.0014,0.0023,0.0031,0.0037,0.0038,0.0036,0.003,0.0022,0.0014,0.0006,0.0001,0,0.0002,0.0007,0.0014,0.002,0.0026,0.0028,0.0028,0.0025,0.0019,0.0013];
const ZEROS = [[14.1347, 0.20118], [21.022, 0.08704], [25.0109, 0.07275], [30.4249, 0.00099], [32.9351, 0.01367], [37.5862, 0.00343], [40.9187, 0.00171], [43.3271, 0.00356], [48.0052, 0.00258], [49.7738, 0.00394]];
const SUB = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₁₀'];

export default function WeilProbeSquares({ idBase, title, alt }) {
  // panel A: h(u)
  const ax = scale(-1, 1, 30, 192); const ay = scale(-2.4, 0.6, 140, 44);
  const hPath = pathOf(H_Y.map((y, i) => [ax(-1 + i * 0.01), ay(y)]));
  // panel B: |hhat|^2
  const bx = scale(0, 60, 240, 410); const by = scale(0, 0.38, 140, 44);
  const hhPath = pathOf(HH_Y.map((y, i) => [bx(i * 0.25), by(y)]));
  return (
    <>
      <DiagramSvg idBase={idBase} viewBox="0 0 420 372" title={title || 'A probe and its squares at the zeros'} desc={alt}>
        <ArrowDefs idBase={idBase} />
        {/* panel A */}
        <text x="30" y="20" className="cd-t">Probe h(u) on [−a, a], a = 1</text>
        <text x="30" y="34" className="cd-t cd-sm cd-soft">smooth, zero outside [−1, 1]</text>
        {[-2, -1, 0].map((v) => (
          <g key={v}>
            <line x1="30" x2="192" y1={ay(v)} y2={ay(v)} className={v === 0 ? 'cd-axis' : 'cd-grid'} />
            <text x="26" y={ay(v) + 3.5} textAnchor="end" className="cd-mono">{v}</text>
          </g>
        ))}
        <path d={hPath} className="cd-line cd-stroke-c1" />
        {[[-1, '−a'], [0, '0'], [1, 'a']].map(([u, l]) => (
          <text key={l} x={ax(u)} y="154" textAnchor="middle" className="cd-mono">{l}</text>
        ))}
        <text x="111" y="168" textAnchor="middle" className="cd-t cd-sm cd-soft">u</text>

        {/* panel B */}
        <text x="240" y="20" className="cd-t">|ĥ(t)|² and its values at the zeros</text>
        <text x="240" y="34" className="cd-t cd-sm cd-soft">dots: the first ten zero heights</text>
        {[0, 0.1, 0.2, 0.3].map((v) => (
          <g key={v}>
            <line x1="240" x2="410" y1={by(v)} y2={by(v)} className={v === 0 ? 'cd-axis' : 'cd-grid'} />
            <text x="236" y={by(v) + 3.5} textAnchor="end" className="cd-mono">{v}</text>
          </g>
        ))}
        <path d={hhPath} className="cd-line-thin cd-stroke-context" />
        {ZEROS.map(([g, v], k) => (
          <g key={g}>
            <circle cx={bx(g)} cy={by(v)} r="4" className="cd-dot cd-fill-c1">
              <title>{`γ${SUB[k]} = ${g}: |ĥ(γ)|² = ${v}`}</title>
            </circle>
          </g>
        ))}
        {/* labels sit in the empty band above the decaying curve, joined to their dots by leaders */}
        {[[0, 18, 0.3], [1, 25, 0.225], [2, 32, 0.15]].map(([k, lt, lv]) => (
          <g key={`lab${k}`}>
            <line x1={bx(ZEROS[k][0]) + 3} y1={by(ZEROS[k][1]) - 3} x2={bx(lt) - 2} y2={by(lv) + 1} className="cd-leader" />
            <text x={bx(lt)} y={by(lv) + 3.5} className="cd-mono cd-halo">γ{SUB[k]} {ZEROS[k][1].toFixed(3)}</text>
          </g>
        ))}
        {[0, 20, 40, 60].map((t) => (
          <text key={t} x={bx(t)} y="154" textAnchor="middle" className="cd-mono">{t}</text>
        ))}
        <text x="325" y="168" textAnchor="middle" className="cd-t cd-sm cd-soft">t (height)</text>

        {/* panel C: schematic */}
        <line x1="10" x2="410" y1="184" y2="184" className="cd-grid" />
        <text x="10" y="202" className="cd-t">Schematic, not to scale: why an off-line zero breaks the squares</text>
        <rect x="30" y="214" width="120" height="128" className="cd-strip" />
        <line x1="90" y1="214" x2="90" y2="342" className="cd-critline" />
        <line x1="30" y1="350" x2="160" y2="350" className="cd-axis" markerEnd={`url(#${idBase}-arr)`} />
        <line x1="30" y1="350" x2="30" y2="210" className="cd-axis" markerEnd={`url(#${idBase}-arr)`} />
        <text x="30" y="364" textAnchor="middle" className="cd-mono">0</text>
        <text x="90" y="364" textAnchor="middle" className="cd-mono">½</text>
        <text x="150" y="364" textAnchor="middle" className="cd-mono">1</text>
        <text x="150" y="340" textAnchor="middle" className="cd-mono">Re s</text>
        <text x="36" y="224" className="cd-mono">Im s</text>
        {/* hypothetical pair */}
        <circle cx="120" cy="252" r="5" className="cd-hollow cd-stroke-c2" />
        <circle cx="60" cy="252" r="5" className="cd-hollow cd-stroke-c2" />
        <line x1="90" y1="268" x2="120" y2="268" className="cd-leader" />
        <text x="105" y="281" textAnchor="middle" className="cd-mono">δ</text>
        <text x="120" y="242" textAnchor="middle" className="cd-mono cd-halo">β+iγ</text>
        <text x="60" y="242" textAnchor="middle" className="cd-mono cd-halo">1−β+iγ</text>
        {/* on-line zero */}
        <circle cx="90" cy="314" r="4.5" className="cd-dot cd-fill-c1" />
        <text x="98" y="318" className="cd-mono cd-halo">½+iγ</text>

        <g className="cd-t cd-sm">
          <text x="172" y="232"><tspan className="cd-strong">Hypothetical off-line pair</tspan> (none is known)</text>
          <text x="172" y="246">δ = β − ½ ≠ 0. The two zeros contribute</text>
          <text x="172" y="260">ĥ(γ − iδ)·conj ĥ(γ + iδ) and its conjugate,</text>
          <text x="172" y="274">sum 2 Re[ĥ(γ − iδ)·conj ĥ(γ + iδ)]:</text>
          <text x="172" y="288">not a square, and negative for suitable h.</text>
          <text x="172" y="312"><tspan className="cd-strong">On the line</tspan> (γ real): the term is</text>
          <text x="172" y="326">ĥ(γ)·conj ĥ(γ) = |ĥ(γ)|² ≥ 0.</text>
        </g>
      </DiagramSvg>
      <DiagramText alt={alt}>
        <table className="cd-table">
          <caption>|ĥ(γ)|² at the first ten zero heights (probe in the caption, ‖h‖ = 1)</caption>
          <thead><tr><th scope="col">k</th><th scope="col">γₖ</th><th scope="col">|ĥ(γₖ)|²</th></tr></thead>
          <tbody>{ZEROS.map(([g, v], k) => <tr key={g}><td>{k + 1}</td><td>{g}</td><td>{v}</td></tr>)}</tbody>
        </table>
      </DiagramText>
    </>
  );
}
