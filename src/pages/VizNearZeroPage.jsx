import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/*
 * Near a Zeta Zero: rings, nodal lines, and vortex structure.
 *
 * At a simple zero rho = 1/2 + i*gamma of xi, the local product model
 * H(s) = prod_k (s - rho_k) has:
 *   Amplitude rings: level contours |H| = r form concentric ovals near rho.
 *   Nodal lines: Re H = 0 (blue) and Im H = 0 (orange) each pass through rho,
 *     forming a cross. Their intersection IS the zero.
 *   Phase winding: arg H increments by 2pi per circuit -> one vortex.
 *
 * Panel 7 of the Visual Geometries gallery (/visual-geometries).
 * HONEST CEILING: exact exploratory visualization, not a rigorous Lambda bound.
 */

const GAMMAS = [
  14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719,
  43.327073, 48.005151, 49.773832, 52.970321, 56.446248, 59.347044, 60.831779,
  65.112544, 67.079811, 69.546402, 72.067158, 75.704691, 77.144840, 79.337375,
  82.910381, 84.735493, 87.425275, 88.809111,
];

const PX = 440;

function hsl2rgb(h, s, l) {
  h /= 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function NearZeroCanvas({ centerIdx, halfWin, showNodal }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(PX, PX);
    const d = img.data;

    const gc = GAMMAS[centerIdx];
    const sigMin = 0.5 - halfWin;
    const sigMax = 0.5 + halfWin;
    const tMin = gc - halfWin;
    const tMax = gc + halfWin;

    const zeros = GAMMAS
      .filter((g) => Math.abs(g - gc) <= halfWin * 4)
      .map((g) => ({ s: 0.5, g }));

    const reH = new Float32Array(PX * PX);
    const imH = new Float32Array(PX * PX);

    for (let py = 0; py < PX; py++) {
      const t = tMax - (py / (PX - 1)) * (tMax - tMin);
      for (let px = 0; px < PX; px++) {
        const sig = sigMin + (px / (PX - 1)) * (sigMax - sigMin);
        let re = 1, im = 0;
        for (let k = 0; k < zeros.length; k++) {
          const dx = sig - zeros[k].s;
          const dy = t - zeros[k].g;
          const nr = re * dx - im * dy;
          const ni = re * dy + im * dx;
          re = nr; im = ni;
        }
        const idx = py * PX + px;
        reH[idx] = re;
        imH[idx] = im;

        const logmag = 0.5 * Math.log(re * re + im * im + 1e-14);
        let ph = Math.atan2(im, re);
        if (ph < 0) ph += 2 * Math.PI;
        const hue = (ph / (2 * Math.PI)) * 360;
        const frac = logmag - Math.floor(logmag);
        const light = 0.28 + 0.38 * frac;
        const [r, g, b] = hsl2rgb(hue, 0.9, light);
        const o = idx * 4;
        d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255;
      }
    }

    if (showNodal) {
      for (let py = 1; py < PX; py++) {
        for (let px = 1; px < PX; px++) {
          const i = py * PX + px;
          const iL = i - 1;
          const iU = (py - 1) * PX + px;
          const mag2 = reH[i] * reH[i] + imH[i] * imH[i];
          if (mag2 < 1e-20) continue;
          const o = i * 4;
          if (imH[i] * imH[iL] <= 0 || imH[i] * imH[iU] <= 0) {
            d[o] = 251; d[o + 1] = 146; d[o + 2] = 60; d[o + 3] = 255;
          }
          if (reH[i] * reH[iL] <= 0 || reH[i] * reH[iU] <= 0) {
            d[o] = 96; d[o + 1] = 165; d[o + 2] = 250; d[o + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(img, 0, 0);

    const toPx = (sig, t) => [
      ((sig - sigMin) / (sigMax - sigMin)) * (PX - 1),
      ((tMax - t) / (tMax - tMin)) * (PX - 1),
    ];

    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    const [lx] = toPx(0.5, 0);
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, PX); ctx.stroke();
    ctx.setLineDash([]);

    zeros.forEach((z) => {
      const [vx, vy] = toPx(z.s, z.g);
      if (vy < -8 || vy > PX + 8) return;
      const isCentral = Math.abs(z.g - gc) < 1;
      ctx.beginPath();
      ctx.arc(vx, vy, isCentral ? 7.5 : 4.5, 0, 2 * Math.PI);
      ctx.lineWidth = isCentral ? 2.5 : 1.5;
      ctx.strokeStyle = isCentral ? '#fde047' : 'rgba(255,255,255,0.7)';
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fill();
      ctx.stroke();
    });
  }, [centerIdx, halfWin, showNodal]);

  return (
    <canvas
      ref={ref}
      width={PX}
      height={PX}
      style={{ width: '100%', maxWidth: 540, borderRadius: 10, border: '1px solid #1e293b', display: 'block' }}
    />
  );
}

export default function VizNearZeroPage() {
  const [centerIdx, setCenterIdx] = useState(9);
  const [halfWin, setHalfWin] = useState(3);
  const [showNodal, setShowNodal] = useState(true);
  const gc = GAMMAS[centerIdx];

  const zoomLabel = halfWin <= 1.5
    ? 'Tight: pure local ring + nodal cross'
    : halfWin <= 4
    ? 'Medium: neighbor-zero interaction visible'
    : 'Wide: full vortex field view';

  return (
    <div className="page">
      <div className="page-header">
        <h1>Near a Zeta Zero</h1>
        <p className="page-subtitle">
          Zoom in on a single zero{' '}
          <code>ρ = ½ + iγ</code>. The amplitude{' '}
          <strong>rings</strong> (|H| level contours) converge on ρ. The{' '}
          <strong>nodal lines</strong> — blue (Re H = 0) and orange (Im H = 0)
          — intersect exactly at ρ, forming a crossing. This crossing is the
          vortex: arg H winds by 2π per circuit (argument principle, one zero =
          one unit of winding).
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 460px' }}>
          <NearZeroCanvas centerIdx={centerIdx} halfWin={halfWin} showNodal={showNodal} />
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            Re s in [½−{halfWin}, ½+{halfWin}], Im s in [{(gc - halfWin).toFixed(2)}, {(gc + halfWin).toFixed(2)}]
            {' '}· central zero γ ≈ {gc.toFixed(4)}
          </div>
        </div>

        <div style={{ flex: '0 1 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Zero: γ ≈ {gc.toFixed(3)}
              <input
                type="range"
                min={1}
                max={GAMMAS.length - 2}
                value={centerIdx}
                onChange={(e) => setCenterIdx(+e.target.value)}
                style={{ width: '100%', marginTop: 6 }}
              />
            </label>
          </div>

          <div className="card">
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Zoom half-width: ±{halfWin.toFixed(1)}
              <input
                type="range"
                min={0.5}
                max={9}
                step={0.5}
                value={halfWin}
                onChange={(e) => setHalfWin(+e.target.value)}
                style={{ width: '100%', marginTop: 6 }}
              />
            </label>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{zoomLabel}</div>
          </div>

          <div className="card" style={{ background: 'rgba(96,165,250,0.06)', borderLeft: '3px solid #60a5fa' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Nodal Lines</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <div style={{ width: 18, height: 3, background: '#3b82f6', borderRadius: 2, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>Re H(s) = 0</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <div style={{ width: 18, height: 3, background: '#fb923c', borderRadius: 2, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>Im H(s) = 0</span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                Both nodal curves cross at every zero. Four arcs meeting at a point = winding number 1.
              </div>
            </div>
          </div>

          <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={showNodal} onChange={(e) => setShowNodal(e.target.checked)} />
            Show nodal lines
          </label>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>What the rings and nodal lines show</h3>
        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li><strong>Rings = amplitude level contours.</strong> The concentric bands are level sets |H(s)| = r. Near a simple zero they form ovals converging on ρ; the nearest-neighbor zeros distort them at larger scales.</li>
          <li><strong>Nodal lines = the skeleton.</strong> Blue (Re H = 0) and orange (Im H = 0) are the curves where the real and imaginary parts vanish. They always intersect at the zeros: two arcs of each colour, four arcs total per simple zero.</li>
          <li><strong>Winding number = 1.</strong> As any small loop encircles the yellow dot, arg H completes a full 2π rotation. This is the argument principle: each simple zero = one unit of winding.</li>
          <li><strong>Vortex at the crossing.</strong> The four-arc intersection is the phase vortex of V = H'/H. Under RH every such vortex lies on the critical line Re s = ½ (dashed). An off-axis vortex = an off-axis zero = an RH violation.</li>
          <li style={{ color: '#94a3b8' }}><strong>Honest ceiling:</strong> panel 7 of the <Link to="/visual-geometries">Visual Geometries gallery</Link>. Per the <Link to="/route-map">route map</Link> the vortex/winding thread re-derives Λ ≥ 0 only. Exact exploratory visualization — not a rigorous new bound.</li>
        </ul>
        <div style={{ fontSize: 12, marginTop: 8 }}>
          Related:{' '}
          <Link to="/vortex-field" style={{ color: '#3b82f6' }}>Vortex Field (wide view)</Link>
          {' · '}
          <Link to="/viz-prime-caustic" style={{ color: '#3b82f6' }}>Prime Caustics</Link>
          {' · '}
          <Link to="/statistics" style={{ color: '#3b82f6' }}>Zero Statistics</Link>
          {' · '}
          <Link to="/route-map" style={{ color: '#3b82f6' }}>Route Map</Link>
        </div>
      </div>
    </div>
  );
}
