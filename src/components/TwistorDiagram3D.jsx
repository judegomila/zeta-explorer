import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  twistorFromS, dualTwistorFromS, incidenceRelation,
  twistorCorrespondence,
} from '../math/twistor.js';
import { losslessBridge } from '../math/oscillators.js';
import { InlineMath } from './KaTeXMath.jsx';

// ─── Twistor Arrow (spinor component as 3D arrow) ───────────────────────────

function SpinorArrow({ origin, direction, color, label, scale = 1 }) {
  const dir = new THREE.Vector3(...direction).normalize();
  const len = new THREE.Vector3(...direction).length() * scale;

  return (
    <group position={origin}>
      <arrowHelper args={[dir, new THREE.Vector3(0, 0, 0), Math.max(len, 0.1), color, 0.15, 0.08]} />
      {label && (
        <Html position={[direction[0] * scale * 0.5, direction[1] * scale * 0.5 + 0.2, direction[2] * scale * 0.5]}
          style={{ color, fontSize: 11, fontWeight: 600, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          {label}
        </Html>
      )}
    </group>
  );
}

// ─── Critical Line Plane ─────────────────────────────────────────────────────

function CriticalLinePlane() {
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[0.02, 6]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Incidence Surface (σ = ½ plane) ─────────────────────────────────────────

function IncidencePlane() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[0.04, 8]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Twistor–Dual Twistor Pair ───────────────────────────────────────────────

function TwistorPair({ sigma, t, animate }) {
  const groupRef = useRef();
  const timeRef = useRef(0);

  const data = useMemo(() => {
    const s = [sigma, t];
    const Z = twistorFromS(s);
    const W = dualTwistorFromS(s);
    const incidence = incidenceRelation(Z, W);
    const bridge = losslessBridge(s);
    return { Z, W, incidence, bridge };
  }, [sigma, t]);

  useFrame((_, delta) => {
    if (animate && groupRef.current) {
      timeRef.current += delta;
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.15;
    }
  });

  const { Z, W, incidence, bridge } = data;
  const scale = 1.5;

  // Twistor Z position (right side)
  const zPos = [1.2, 0, 0];
  // Dual twistor W position (left side)
  const wPos = [-1.2, 0, 0];

  // Bridge arc connecting Z and W
  const bridgePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = zPos[0] * (1 - t) + wPos[0] * t;
      const y = Math.sin(t * Math.PI) * (0.5 + bridge.magnitude * 0.3);
      const z = Math.cos(t * Math.PI * 2) * 0.15;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [bridge.magnitude]);

  const bridgeColor = incidence.satisfied ? '#10b981' : '#ef4444';
  const bridgeOpacity = incidence.satisfied ? 0.8 : 0.4;

  return (
    <group ref={groupRef}>
      {/* Twistor Z */}
      <group position={zPos}>
        {/* ω spinor */}
        <SpinorArrow
          origin={[0, 0, 0]}
          direction={[Z.omega[0] * scale, Z.omega[1] * scale, 0]}
          color="#3b82f6"
          label="ω^A"
          scale={1}
        />
        {/* π spinor */}
        <SpinorArrow
          origin={[0, 0, 0]}
          direction={[0, Z.pi[0] * scale, Z.pi[1] * scale]}
          color="#60a5fa"
          label="π_{A'}"
          scale={1}
        />
        {/* Z sphere */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} transparent opacity={0.7} />
        </mesh>
        <Html position={[0, -0.4, 0]} style={{ color: '#3b82f6', fontSize: 13, fontWeight: 700, pointerEvents: 'none' }}>
          Z<sup>α</sup>
        </Html>
      </group>

      {/* Dual Twistor W */}
      <group position={wPos}>
        {/* ω̃ spinor */}
        <SpinorArrow
          origin={[0, 0, 0]}
          direction={[W.omega[0] * scale, W.omega[1] * scale, 0]}
          color="#f59e0b"
          label="ω̃"
          scale={1}
        />
        {/* π̃ spinor */}
        <SpinorArrow
          origin={[0, 0, 0]}
          direction={[0, W.pi[0] * scale, W.pi[1] * scale]}
          color="#fbbf24"
          label="π̃"
          scale={1}
        />
        {/* W sphere */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} transparent opacity={0.7} />
        </mesh>
        <Html position={[0, -0.4, 0]} style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700, pointerEvents: 'none' }}>
          W<sub>α</sub>
        </Html>
      </group>

      {/* Bridge arc */}
      <Line
        points={bridgePoints}
        color={bridgeColor}
        lineWidth={2}
        transparent
        opacity={bridgeOpacity}
      />

      {/* Incidence label at bridge apex */}
      <Html position={[0, Math.sin(Math.PI / 2) * (0.5 + bridge.magnitude * 0.3) + 0.25, 0]}
        style={{ pointerEvents: 'none', textAlign: 'center' }}>
        <div style={{
          background: incidence.satisfied ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${bridgeColor}`,
          borderRadius: 6,
          padding: '3px 8px',
          fontSize: 10,
          color: bridgeColor,
          fontWeight: 600,
        }}>
          {incidence.satisfied ? 'Z·W = 0 ✓' : `|Z·W| = ${incidence.magnitude.toFixed(3)}`}
        </div>
      </Html>
    </group>
  );
}

// ─── Correspondence Curve (σ sweep) ──────────────────────────────────────────

function CorrespondenceCurve({ t, sigmaRange = [0.1, 0.9] }) {
  const points = useMemo(() => {
    const data = twistorCorrespondence(t, sigmaRange, 60);
    return data.map(d => {
      // Map to 3D: x = σ - 0.5, y = incidence, z = helicity diff
      return new THREE.Vector3(
        (d.sigma - 0.5) * 4,
        -d.incidence * 2 - 1.5,
        d.helicityDiff * 0.5
      );
    });
  }, [t, sigmaRange]);

  return (
    <Line points={points} color="#8b5cf6" lineWidth={1.5} transparent opacity={0.6} />
  );
}

// ─── Zeta Zero Markers ───────────────────────────────────────────────────────

function ZetaZeroMarkers({ zeros }) {
  return (
    <group>
      {zeros.map((gamma, i) => (
        <mesh key={i} position={[0, -1.5, (gamma / 60 - 0.5) * 4]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Axes ────────────────────────────────────────────────────────────────────

function Axes() {
  return (
    <group>
      {/* σ axis */}
      <Line points={[[-2.5, 0, 0], [2.5, 0, 0]]} color="#475569" lineWidth={1} />
      <Html position={[2.7, 0, 0]} style={{ color: '#64748b', fontSize: 10, pointerEvents: 'none' }}>σ</Html>

      {/* t axis */}
      <Line points={[[0, 0, -3], [0, 0, 3]]} color="#475569" lineWidth={1} />
      <Html position={[0, 0, 3.3]} style={{ color: '#64748b', fontSize: 10, pointerEvents: 'none' }}>t</Html>

      {/* vertical */}
      <Line points={[[0, -2.5, 0], [0, 2, 0]]} color="#475569" lineWidth={1} />

      {/* σ = ½ plane indicator */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[0.15, 1.5, 0]} style={{ color: '#10b981', fontSize: 9, pointerEvents: 'none' }}>
        σ = ½
      </Html>
    </group>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function TwistorScene({ sigma, t, animate }) {
  const firstZeros = [14.13, 21.02, 25.01, 30.42, 32.94, 37.59, 40.92, 43.33, 48.01, 49.77];

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} />
      <Axes />
      <TwistorPair sigma={sigma} t={t} animate={animate} />
      <CorrespondenceCurve t={t} />
      <ZetaZeroMarkers zeros={firstZeros} />
      <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} />
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TwistorDiagram3D() {
  const [sigma, setSigma] = useState(0.5);
  const [t, setT] = useState(14.13);
  const [animate, setAnimate] = useState(true);

  const data = useMemo(() => {
    const s = [sigma, t];
    const Z = twistorFromS(s);
    const W = dualTwistorFromS(s);
    const inc = incidenceRelation(Z, W);
    const bridge = losslessBridge(s);
    return { Z, W, inc, bridge };
  }, [sigma, t]);

  const sigmaColor = Math.abs(sigma - 0.5) < 0.02 ? '#10b981'
    : Math.abs(sigma - 0.5) < 0.15 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div className="controls">
        <div className="control-group">
          <label><InlineMath tex={"\\sigma"} /></label>
          <input type="range" min="0.05" max="0.95" step="0.01" value={sigma}
            onChange={e => setSigma(+e.target.value)} style={{ accentColor: sigmaColor }} />
          <span className="control-value" style={{ color: sigmaColor, fontWeight: 700 }}>{sigma.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label><InlineMath tex="t" /></label>
          <input type="range" min="1" max="60" step="0.5" value={t}
            onChange={e => setT(+e.target.value)} />
          <span className="control-value">{t.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label style={{ cursor: 'pointer' }} onClick={() => setAnimate(a => !a)}>
            {animate ? 'Animating' : 'Static'}
          </label>
        </div>
      </div>

      {/* Metrics bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '12px 0' }}>
        {[
          { label: '|χ(s)|', value: data.bridge.magnitude.toFixed(4), color: data.bridge.isUnitary ? '#10b981' : '#f59e0b' },
          { label: 'Z·W', value: data.inc.magnitude.toFixed(4), color: data.inc.satisfied ? '#10b981' : '#ef4444' },
          { label: '‖Z‖', value: data.Z.norm.toFixed(3), color: '#3b82f6' },
          { label: '‖W‖', value: data.W.norm.toFixed(3), color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="stat-box" style={{ padding: '8px 12px' }}>
            <div style={{ color: m.color, fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* 3D Canvas */}
      <div style={{
        width: '100%',
        height: 480,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#080b1a',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <Canvas camera={{ position: [3, 2, 3], fov: 50 }} dpr={[1, 2]}>
          <TwistorScene sigma={sigma} t={t} animate={animate} />
        </Canvas>
      </div>

      <div className="card" style={{ marginTop: 16, padding: '14px 18px', fontSize: 13, color: '#94a3b8' }}>
        <p style={{ marginBottom: 6 }}>
          <strong style={{ color: '#3b82f6' }}>Blue (Z<sup>α</sup>)</strong>: Direct twistor encoding{' '}
          <InlineMath tex={"\\zeta(s)"} />.{' '}
          <strong style={{ color: '#f59e0b' }}>Gold (W<sub>α</sub>)</strong>: Dual twistor encoding{' '}
          <InlineMath tex={"\\zeta(1-s)"} />.{' '}
          Arrows show spinor components <InlineMath tex={"\\omega^A"} /> and <InlineMath tex={"\\pi_{A'}"} />.
        </p>
        <p>
          The <strong style={{ color: '#10b981' }}>green arc</strong> is the intertwiner (bridge){' '}
          <InlineMath tex={"\\chi(s)"} />.
          At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, the incidence relation{' '}
          <InlineMath tex={"Z^{\\alpha} W_{\\alpha} = 0"} /> is satisfied (bridge is lossless, <InlineMath tex={"|\\chi|=1"} />).
          Red dots along the <InlineMath tex="t" />-axis mark known zeta zeros.
        </p>
      </div>
    </div>
  );
}
