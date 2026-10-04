import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SafeCanvas from './SafeCanvas.jsx';
import * as THREE from 'three';
import { zetaCriticalStrip, ZETA_ZEROS } from '../math/zeta.js';
import { ED } from '../styles/tokens.js';

/**
 * 3D height-field of |ζ(σ+it)| over the critical strip.
 * Zeros appear as valleys touching the floor.
 * Color encodes arg(ζ(s)) — phase information.
 */

function ZetaSurface({ sigmaRange, tRange, resolution }) {
  const meshRef = useRef();

  const { geometry, colors } = useMemo(() => {
    const [sMin, sMax] = sigmaRange;
    const [tMin, tMax] = tRange;
    const nx = resolution;
    const ny = resolution;

    const positions = [];
    const colorArr = [];
    const indices = [];

    for (let iy = 0; iy <= ny; iy++) {
      for (let ix = 0; ix <= nx; ix++) {
        const u = ix / nx;
        const v = iy / ny;
        const sigma = sMin + u * (sMax - sMin);
        const t = tMin + v * (tMax - tMin);

        const z = zetaCriticalStrip([sigma, t]);
        const mag = Math.sqrt(z[0] * z[0] + z[1] * z[1]);
        const phase = Math.atan2(z[1], z[0]);

        // Position: x = sigma, z = t, y = log(1 + |ζ|) for better visibility
        const height = Math.log(1 + mag) * 0.8;
        positions.push(
          (u - 0.5) * 10,  // x: centered
          height,            // y: height
          (v - 0.5) * 10    // z: centered
        );

        // Color from phase: HSL → RGB
        const hue = (phase + Math.PI) / (2 * Math.PI);
        const brightness = Math.min(0.9, 0.2 + 0.7 * (1 - Math.exp(-mag * 0.3)));
        const color = new THREE.Color();
        color.setHSL(hue, 0.8, brightness * 0.5);
        colorArr.push(color.r, color.g, color.b);
      }
    }

    // Build triangle indices
    for (let iy = 0; iy < ny; iy++) {
      for (let ix = 0; ix < nx; ix++) {
        const a = iy * (nx + 1) + ix;
        const b = a + 1;
        const c = a + (nx + 1);
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colorArr, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return { geometry: geo, colors: colorArr };
  }, [sigmaRange, tRange, resolution]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}

function CriticalLine({ tRange }) {
  const points = useMemo(() => {
    const [tMin, tMax] = tRange;
    const pts = [];
    // Critical line at σ = 0.5, mapped to x = 0
    for (let i = 0; i <= 100; i++) {
      const v = i / 100;
      const t = tMin + v * (tMax - tMin);
      const z = zetaCriticalStrip([0.5, t]);
      const mag = Math.sqrt(z[0] * z[0] + z[1] * z[1]);
      const height = Math.log(1 + mag) * 0.8;
      pts.push(new THREE.Vector3(0, height + 0.02, (v - 0.5) * 10));
    }
    return pts;
  }, [tRange]);

  const geo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geo}>
      <lineBasicMaterial color={ED.series3} linewidth={2} />
    </line>
  );
}

function ZeroMarkers({ tRange }) {
  const [tMin, tMax] = tRange;
  const zeros = ZETA_ZEROS.filter(g => g >= tMin && g <= tMax);

  return (
    <>
      {zeros.map((gamma, i) => {
        const v = (gamma - tMin) / (tMax - tMin);
        return (
          <mesh key={i} position={[0, 0.05, (v - 0.5) * 10]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive={ED.series3} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </>
  );
}

function FloorGrid() {
  return (
    <gridHelper args={[10, 20, '#1e293b', '#0f172a']} position={[0, -0.01, 0]} />
  );
}

function Scene({ sigmaRange, tRange, resolution, showCriticalLine, showZeros }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      <ZetaSurface sigmaRange={sigmaRange} tRange={tRange} resolution={resolution} />
      {showCriticalLine && <CriticalLine tRange={tRange} />}
      {showZeros && <ZeroMarkers tRange={tRange} />}
      <FloorGrid />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI * 0.85}
        minDistance={3}
        maxDistance={25}
      />
    </>
  );
}

export default function Zeta3DLandscape() {
  const [tCenter, setTCenter] = useState(25);
  const [tSpan, setTSpan] = useState(20);
  const [resolution, setResolution] = useState(40);
  const [showCritLine, setShowCritLine] = useState(true);
  const [showZeros, setShowZeros] = useState(true);

  const sigmaRange = [0.0, 1.0];
  const tRange = [tCenter - tSpan / 2, tCenter + tSpan / 2];

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="control-group">
          <label>t center</label>
          <input type="range" min="15" max="300" step="1" value={tCenter}
            onChange={e => setTCenter(+e.target.value)} />
          <span className="control-value">{tCenter}</span>
        </div>
        <div className="control-group">
          <label>t span</label>
          <input type="range" min="5" max="40" step="1" value={tSpan}
            onChange={e => setTSpan(+e.target.value)} />
          <span className="control-value">{tSpan}</span>
        </div>
        <div className="control-group">
          <label>Resolution</label>
          <input type="range" min="20" max="80" step="10" value={resolution}
            onChange={e => setResolution(+e.target.value)} />
          <span className="control-value">{resolution}</span>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-soft)', fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={showCritLine} onChange={e => setShowCritLine(e.target.checked)} />
          Critical line
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-soft)', fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={showZeros} onChange={e => setShowZeros(e.target.checked)} />
          Zero markers
        </label>
      </div>

      <div style={{
        width: '100%', height: 450, borderRadius: 12,
        border: '1px solid var(--rule-soft)', overflow: 'hidden',
        background: 'var(--paper)',
      }}>
        <SafeCanvas
          camera={{ position: [8, 6, 8], fov: 50 }}
          gl={{ antialias: true }}
          style={{ background: 'var(--paper)' }}
        >
          <Scene
            sigmaRange={sigmaRange}
            tRange={tRange}
            resolution={resolution}
            showCriticalLine={showCritLine}
            showZeros={showZeros}
          />
        </SafeCanvas>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12,
                      background: 'color-mix(in srgb, var(--series-5) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-5) 20%, transparent)',
                      color: 'var(--ink-soft)' }}>
          <strong style={{ color: 'var(--series-5)' }}>Height</strong> = log(1 + |ζ(s)|) — zeros are valleys at floor level
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12,
                      background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 20%, transparent)',
                      color: 'var(--ink-soft)' }}>
          <strong style={{ color: 'var(--series-1)' }}>Color</strong> = arg(ζ(s)) — phase singularities at zeros
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12,
                      background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 20%, transparent)',
                      color: 'var(--ink-soft)' }}>
          <strong style={{ color: 'var(--series-3)' }}>Green line</strong> = critical line σ = ½ — drag to rotate
        </div>
      </div>
    </div>
  );
}
