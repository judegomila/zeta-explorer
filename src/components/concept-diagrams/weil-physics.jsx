/**
 * weil-physics — positive energy as the physical picture of Weil positivity.
 *
 * Toy system: wall - k1 - mass - k2 - mass - k3 - wall, displacements (x1, x2), energy
 * E = (1/2)[k1 x1^2 + k2 (x2 - x1)^2 + k3 x2^2]. Along x = (s, -s): E = (1/2)[k1 + 4 k2 + k3] s^2.
 *   stable   k = (1, 1, 1):    E = 3 s^2 >= 0 (stiffness matrix eigenvalues 1, 3)
 *   unstable k = (1, -1.5, 1): E = -2 s^2 < 0 along (s, -s); along (s, s) E = s^2 (eigenvalues 1, -2)
 */
import React from 'react';
import { DiagramSvg, DiagramText, scale, pathOf } from './kit.jsx';

function zigzag(x0, x1, y, n = 6, amp = 6) {
  const pts = [[x0, y], [x0 + 4, y]];
  const w = (x1 - x0 - 8) / n;
  for (let i = 0; i < n; i++) pts.push([x0 + 4 + w * (i + 0.5), y + (i % 2 ? amp : -amp)]);
  pts.push([x1 - 4, y], [x1, y]);
  return pathOf(pts);
}

function Chain({ y, negative, label, sub, arr }) {
  return (
    <g>
      <text x="14" y={y - 30} className="cd-t cd-strong">{label}</text>
      <text x="80" y={y - 30} className="cd-t cd-sm cd-soft">{sub}</text>
      <rect x="10" y={y - 14} width="8" height="28" className="cd-wall" />
      <rect x="196" y={y - 14} width="8" height="28" className="cd-wall" />
      <path d={zigzag(18, 66, y)} className="cd-spring" />
      <rect x="66" y={y - 11} width="24" height="22" rx="3" className="cd-mass" />
      <path d={zigzag(90, 124, y)} className={negative ? 'cd-spring cd-spring-neg cd-stroke-c2' : 'cd-spring'} />
      <rect x="124" y={y - 11} width="24" height="22" rx="3" className="cd-mass" />
      <path d={zigzag(148, 196, y)} className="cd-spring" />
      <line x1="72" y1={y + 20} x2="86" y2={y + 20} className="cd-arrowline" markerEnd={`url(#${arr})`} />
      <line x1="142" y1={y + 20} x2="128" y2={y + 20} className="cd-arrowline" markerEnd={`url(#${arr})`} />
      <text x="78" y={y + 33} textAnchor="middle" className="cd-mono">+s</text>
      <text x="136" y={y + 33} textAnchor="middle" className="cd-mono">−s</text>
      <text x="107" y={y - 15} textAnchor="middle" className="cd-mono cd-halo">k₂ = {negative ? '−1.5' : '1'}</text>
    </g>
  );
}

export default function WeilPhysics({ idBase, title, alt }) {
  const sx = scale(-1, 1, 246, 408); const ey = scale(-2.2, 3.2, 190, 46);
  const S = Array.from({ length: 81 }, (_, i) => -1 + i * 0.025);
  const stable = pathOf(S.map((s) => [sx(s), ey(3 * s * s)]));
  const unstable = pathOf(S.map((s) => [sx(s), ey(-2 * s * s)]));
  return (
    <>
      <DiagramSvg idBase={idBase} viewBox="0 0 420 306" title={title || 'Positive energy and stability'} desc={alt}>
        <defs>
          <marker id={`${idBase}-parr`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className="cd-fill-ink" />
          </marker>
        </defs>
        <Chain arr={`${idBase}-parr`} y={66} label="Stable" sub="all springs k = 1" />
        <Chain arr={`${idBase}-parr`} y={156} negative label="Unstable" sub="middle spring has k < 0" />
        <text x="14" y="214" className="cd-mono">E = ½[k₁s² + k₂(2s)² + k₃s²]</text>

        {/* energy plot */}
        <text x="246" y="26" className="cd-t">Energy E (↔ W(h))</text>
        <text x="246" y="39" className="cd-t cd-sm cd-soft">along the displacement (+s, −s)</text>
        {[-2, -1, 1, 2, 3].map((v) => (
          <g key={v}>
            <line x1="246" x2="408" y1={ey(v)} y2={ey(v)} className="cd-grid" />
            <text x="242" y={ey(v) + 3.5} textAnchor="end" className="cd-mono">{v}</text>
          </g>
        ))}
        <line x1="246" x2="408" y1={ey(0)} y2={ey(0)} className="cd-axis" />
        <text x="242" y={ey(0) + 3.5} textAnchor="end" className="cd-mono">0</text>
        <path d={stable} className="cd-line cd-stroke-c1" />
        <path d={unstable} className="cd-line cd-dash cd-stroke-c2" />
        <text x={sx(0)} y={ey(2.3)} textAnchor="middle" className="cd-t cd-sm cd-halo">stable: E = 3s² ≥ 0</text>
        <text x={sx(0)} y={ey(-1.65)} textAnchor="middle" className="cd-t cd-sm cd-halo">unstable: E = −2s² &lt; 0</text>
        {[-1, 0, 1].map((v) => (
          <text key={v} x={sx(v)} y="204" textAnchor="middle" className="cd-mono">{v}</text>
        ))}
        <text x="327" y="218" textAnchor="middle" className="cd-t cd-sm cd-soft">displacement s (↔ probe h)</text>

        {/* mapping */}
        <line x1="10" x2="410" y1="232" y2="232" className="cd-grid" />
        <g className="cd-t cd-sm">
          <text x="14" y="250"><tspan className="cd-strong">Stable</tspan>: E ≥ 0 for every displacement  ↔  <tspan className="cd-strong">RH</tspan>: W(h) ≥ 0 for every h.</text>
          <text x="14" y="266">A displacement with E &lt; 0  ↔  a probe with W(h) &lt; 0  ↔  an off-line zero.</text>
          <text x="14" y="282">Moving both masses the same way, (s, s), gives E = s² ≥ 0 in both chains:</text>
          <text x="14" y="298">only some displacements expose the instability.</text>
        </g>
      </DiagramSvg>
      <p className="cd-note">
        <strong>Where the analogy breaks.</strong> No physical system with energy W is known; building one would be a
        Hilbert–Pólya realisation. W ≥ 0 must hold at every support length at once, not for one fixed system. The
        background stiffness grows like log t with frequency, unlike ordinary springs, and the prime couplings are fixed
        by arithmetic, not chosen.
      </p>
      <DiagramText alt={alt} />
    </>
  );
}
