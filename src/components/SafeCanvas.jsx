import React from 'react';
import { Canvas } from '@react-three/fiber';

// Probe WebGL once and cache. A throwaway <canvas> + getContext is the
// standard three.js availability check; it returns null (no throw) when the
// context can't be created — unlike THREE.WebGLRenderer, which throws.
let _webglOK = null;
export function isWebGLAvailable() {
  if (_webglOK !== null) return _webglOK;
  try {
    const c = document.createElement('canvas');
    _webglOK = !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    _webglOK = false;
  }
  return _webglOK;
}

function Fallback() {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: '#64748b', fontSize: 13, textAlign: 'center', padding: 24,
    }}>
      <div style={{ maxWidth: 360, lineHeight: 1.6 }}>
        <div style={{ fontSize: 26, marginBottom: 10, opacity: 0.6 }}>⬡</div>
        3D view unavailable — this browser or device couldn't create a WebGL
        context (hardware acceleration may be off, or WebGL is disabled).
        <div style={{ marginTop: 8, color: '#475569' }}>
          The controls and data below still work.
        </div>
      </div>
    </div>
  );
}

// Catches a WebGL/renderer error thrown after mount (e.g. context exhaustion
// when many 3D canvases coexist) so it degrades to the fallback instead of
// bubbling an uncaught error up to the route-level boundary.
class GLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() { /* swallow — fallback is shown via state */ }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}

// Drop-in replacement for @react-three/fiber's <Canvas> that never throws an
// uncaught error when WebGL is unavailable.
export default function SafeCanvas({ children, ...canvasProps }) {
  if (!isWebGLAvailable()) return <Fallback />;
  return (
    <GLErrorBoundary>
      <Canvas {...canvasProps}>{children}</Canvas>
    </GLErrorBoundary>
  );
}
