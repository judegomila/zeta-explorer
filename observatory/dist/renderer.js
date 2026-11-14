import {displayLogMagnitude,displayVisibility} from './display-field.js';
import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { liftPoint } from './geometry.js';
import * as numerical from './math.js';
const { evaluate, NUMERICS } = numerical;

const TAU = 2 * Math.PI;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const finite = Number.isFinite;
const logMagnitude = (re, im) => Math.log(Math.hypot(re, im));
const validLog = x => Number.isFinite(x) || x === -Infinity;
const softplus = x => x > 36 ? x : x < -36 ? Math.exp(x) : Math.log1p(Math.exp(x));
function polarAt(sigma, t, kind, tau) {
  if (numerical.evaluatePolar) return numerical.evaluatePolar(sigma, t, kind, tau);
  const f = evaluate(sigma, t, kind, tau);
  return { ...f, logAbs: logMagnitude(f.re, f.im), arg: Math.atan2(f.im, f.re) };
}
function weightedLogQuantile(data, logs, quantile = .95) {
  const indices = []; let total = 0;
  for(let i=0;i<logs.length;i++) {
    if(!data.valid[i] || !validLog(logs[i])) continue;
    const w = data.sampleWeights ? data.sampleWeights[i] : 1;
    if(!(w>0) || !finite(w)) continue;
    indices.push(i); total += w;
  }
  indices.sort((a,b)=>logs[a]-logs[b]);
  let accumulated = 0;
  for(const i of indices) {
    accumulated += data.sampleWeights ? data.sampleWeights[i] : 1;
    if(accumulated >= quantile*total) return finite(logs[i]) ? logs[i] : 0;
  }
  return 0;
}
function renderStyleSignature(state) {
  return JSON.stringify(['geometry','projective','function','tau','heightMode','height','colorMode','phaseOffset','exposure','opacity','wireframe','contours','critical','zeros','vortices','ladder','packets','seams','heightLocked','heightLogReference','heightReference','resolution','displayDamping','displayDampingScale'].map(k=>state[k]));
}
function sampleMetadata(data) {
  const logs=data.logAbs||Float64Array.from(data.valid,(_,i)=>logMagnitude(data.values[2*i],data.values[2*i+1]));
  const args=data.arg||Float64Array.from(data.valid,(_,i)=>Math.atan2(data.values[2*i+1],data.values[2*i]));
  return {sampleLogs:logs,sampleArgs:args,autoLogReference:weightedLogQuantile(data,logs),
    uAxis:data.uAxis||Float64Array.from({length:data.nx+1},(_,i)=>data.uvs?data.uvs[2*i]:i/data.nx),
    vAxis:data.vAxis||Float64Array.from({length:data.ny+1},(_,j)=>data.uvs?data.uvs[2*j*(data.nx+1)+1]:j/data.ny)};
}
function axisInterval(axis, value) {
  let lo = 0, hi = axis.length - 1;
  while (lo + 1 < hi) { const mid = (lo + hi) >> 1; if (axis[mid] <= value) lo = mid; else hi = mid; }
  const i = Math.min(lo, axis.length - 2), width = axis[i + 1] - axis[i];
  return [i, width > 0 ? clamp((value - axis[i]) / width, 0, 1) : 0];
}

const tmpColor = new THREE.Color();
const palettes = {
  critical: 0xe7f8b7, real: 0xc4e9ff, imag: 0xffbe81,
  direct: 0x79f7d2, dual: 0xd9a0ff, bridge: 0xffe3a4,
};

function disposeTree(object) {
  object.traverse(node => {
    node.geometry?.dispose();
    const materials = node.material ? (Array.isArray(node.material) ? node.material : [node.material]) : [];
    for (const material of materials) {
      material.map?.dispose();
      material.dispose();
    }
  });
  object.clear();
}

function labelSprite(text, { color = '#a0adbf', size = 0.43, background = false } = {}) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '500 26px ui-monospace, SFMono-Regular, Menlo, monospace';
  const width = Math.ceil(context.measureText(text).width) + 24;
  canvas.width = width;
  canvas.height = 48;
  context.font = '500 26px ui-monospace, SFMono-Regular, Menlo, monospace';
  if (background) {
    context.fillStyle = 'rgba(7,13,23,.86)';
    context.beginPath();
    context.roundRect(0, 0, width, 48, 9);
    context.fill();
  }
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, width / 2, 25);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false }));
  sprite.scale.set(size * width / 48, size, 1);
  sprite.renderOrder = 8;
  return sprite;
}

function glowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 1, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,.85)');
  gradient.addColorStop(0.42, 'rgba(255,255,255,.18)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export class ZetaScene {
  constructor(container, { onProbe = () => {}, onStatus = () => {}, onCameraChange = () => {} } = {}) {
    this.container = container;
    this.onProbe = onProbe;
    this.onStatus = onStatus;
    this.onCameraChange = onCameraChange;
    this.data = null;
    this.state = {};
    this.disposed = false;
    this.needsRender = true;
    this.previousGeometry = null;
    this.lastPointer = 0;
    this.packetTracks = [];
    this.packetTime = 0;
    this.surface = null;
    this.indices = [];
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080e19);
    this.scene.fog = new THREE.FogExp2(0x080e19, 0.013);
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.025, 250);
    this.camera.position.set(14, 13, 19);
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    } catch (error) {
      const notice = document.createElement('div');
      notice.className = 'webgl-unavailable';
      notice.setAttribute('role', 'status');
      notice.style.cssText = 'padding:48px;max-width:460px;color:#b7c6d8;font:15px/1.6 system-ui;';
      notice.textContent = 'The 3D view needs WebGL. Try opening this site in an updated browser with graphics acceleration enabled. The numerical inspector and controls remain available.';
      container.appendChild(notice);
      this.onStatus({ type: 'error', message: 'WebGL is unavailable in this browser.' });
      return;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.domElement.setAttribute('aria-label', 'Interactive three-dimensional zeta surface. Drag to orbit; scroll or pinch to zoom; hover or tap to inspect.');
    this.renderer.domElement.setAttribute('role', 'img');
    this.renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none;';
    this.renderer.domElement.tabIndex = 0;
    container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.09;
    this.controls.rotateSpeed = 0.65;
    this.controls.panSpeed = 0.75;
    this.controls.zoomSpeed = 0.8;
    this.controls.minDistance = 1.1;
    this.controls.maxDistance = 100;
    this.controls.autoRotateSpeed = 0.3;
    this.controls.addEventListener('change', () => { this.needsRender = true; });
    this.controls.addEventListener('end', () => this.onCameraChange());
    this.scene.add(new THREE.HemisphereLight(0xcddfff, 0x14213c, 2.1));
    const key = new THREE.DirectionalLight(0xfff0db, 3.2);
    key.position.set(-5, 12, 8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xabc8ff, 2.4);
    rim.position.set(7, 5, -8);
    this.scene.add(rim);
    const front = new THREE.DirectionalLight(0xcfffee, 0.65);
    front.position.set(1, -3, 7);
    this.scene.add(front);
    this.surfaceGroup = new THREE.Group();
    this.overlayGroup = new THREE.Group();
    this.guideGroup = new THREE.Group();
    this.probeGroup = new THREE.Group();
    this.scene.add(this.surfaceGroup, this.overlayGroup, this.guideGroup, this.probeGroup);
    this.glow = glowTexture();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pointerMove = event => {
      if (event.buttons || performance.now() - this.lastPointer < 65) return;
      this.lastPointer = performance.now();
      this.inspectPointer(event, false);
    };
    this.pointerDown = event => { this.pointerStart = { x: event.clientX, y: event.clientY }; };
    this.pointerUp = event => {
      if (this.pointerStart && Math.hypot(event.clientX - this.pointerStart.x, event.clientY - this.pointerStart.y) < 6) this.inspectPointer(event, true);
    };
    this.renderer.domElement.addEventListener('pointermove', this.pointerMove);
    this.renderer.domElement.addEventListener('pointerdown', this.pointerDown);
    this.renderer.domElement.addEventListener('pointerup', this.pointerUp);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.frame = this.frame.bind(this);
    this.raf = requestAnimationFrame(this.frame);
  }

  resize() {
    if (!this.renderer || this.disposed) return;
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.needsRender = true;
  }

  setData(data, state) {
    if (!this.renderer) return;
    const signature=renderStyleSignature(state);
    const preparedCacheHit=this.data===data&&this.preparedSignature===signature;
    this.data=data;this.state={...state};this.controls.autoRotate=!!state.autoRotate;
    this.metadataCache ||= new WeakMap();
    let metadata=this.metadataCache.get(data);
    if(!metadata){metadata=sampleMetadata(data);this.metadataCache.set(data,metadata);}
    Object.assign(this,metadata);this.syncReference();
    if(!preparedCacheHit){this.buildSurface();this.buildGuides();this.buildOverlays();this.preparedSignature=signature;}
    else this.refreshProbe();
    if(this.previousGeometry!==state.geometry){this.previousGeometry=state.geometry;this.resetCamera('perspective');}
    this.onStatus({type:'render',vertices:data.valid.length,faces:this.indices.length/3,heightScale:this.reference,reference:this.reference,logReference:this.logReference,preparedCacheHit});
    this.needsRender=true;
  }

  syncReference() {
    this.logReference = this.state.heightLocked && finite(this.state.heightLogReference)
      ? this.state.heightLogReference : Number(this.state.heightReference) > 0
      ? Math.log(Number(this.state.heightReference)) : this.autoLogReference;
    this.reference = Math.exp(this.logReference);
  }

  height(re, im) { return this.heightPolar(logMagnitude(re, im), Math.atan2(im, re)); }

  heightPolar(logAbs, arg = 0) {
    // A Klein bottle has no global continuous normal. Scalar normal relief
    // would tear the identified edge; retain the exact immersed base surface.
    if (this.state.geometry === 'klein' || this.state.displayDamping) return 0;
    const mode = this.state.heightMode || 'log';
    if (mode === 'flat' || !this.state.height || !validLog(logAbs) || logAbs === -Infinity) return 0;
    const relative = logAbs - this.logReference;
    let h;
    if (mode === 'real' || mode === 'imag') {
      const component = mode === 'real' ? Math.cos(arg) : Math.sin(arg);
      h = Math.asinh(Math.exp(Math.min(relative, 700)) * component) / Math.asinh(1);
    } else if (mode === 'abs') h = Math.exp(Math.min(relative, 4));
    else h = softplus(relative) / Math.LN2;
    return clamp(h, -2.5, 2.5) * (this.state.geometry === 'plane' ? 2.1 : .46) * this.state.height;
  }

  color(re, im, bridge = NaN) { return this.colorPolar(logMagnitude(re,im),Math.atan2(im,re),bridge); }

  colorPolar(logAbs, arg, bridge = NaN, sigma, t) {
    logAbs=displayLogMagnitude(logAbs,sigma,t,this.state);
    const mode = this.state.colorMode || 'phase';
    if (!validLog(logAbs) || (['bridge','shear'].includes(mode) && !finite(bridge))) return tmpColor.set(0x28313e);
    const relative = logAbs - this.logReference, normalized = softplus(relative) / Math.LN2;
    if (mode === 'phase') {
      const h = (((arg || 0) + Math.PI + (this.state.phaseOffset || 0)) / TAU % 1 + 1) % 1;
      const band = finite(relative) ? .036 * Math.cos(TAU * relative / Math.LN2) : 0;
      tmpColor.setHSL(h, .88, clamp(.42 + .075 * Math.min(normalized, 1) + band, .23, .61));
    } else if (mode === 'modulus') {
      const t = clamp(normalized / 1.8, 0, 1);
      tmpColor.setHSL(.72 - t * .64, .72, .16 + t * .47);
    } else {
      const component = mode === 'imag' ? Math.sin(arg || 0) : Math.cos(arg || 0);
      let value = ['bridge','shear'].includes(mode) ? bridge : Math.tanh(Math.exp(Math.min(relative, 40)) * component * 2);
      if (!finite(value)) value = 0;
      const strength = clamp(Math.abs(value), 0, 1);
      tmpColor.setHSL(value >= 0 ? .45 : .99, .15 + .72 * strength, .76 - .36 * strength);
    }
    if(this.state.displayDamping){const visibility=displayVisibility(logAbs,this.logReference);tmpColor.multiplyScalar(visibility);tmpColor.r+=.025*(1-visibility);tmpColor.g+=.035*(1-visibility);tmpColor.b+=.05*(1-visibility);}
    return tmpColor;
  }

  buildSurface() {
    disposeTree(this.surfaceGroup);
    this.maskSurface = null;
    const data = this.data;
    const count = data.valid.length;
    this.raised = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const re = data.values[2 * i], im = data.values[2 * i + 1];
      const displacement = data.valid[i] ? this.heightPolar(this.sampleLogs[i],this.sampleArgs[i]) : 0;
      for (let axis = 0; axis < 3; axis++) this.raised[3 * i + axis] = data.basePositions[3 * i + axis] + data.normals[3 * i + axis] * displacement;
      const c = this.colorPolar(this.sampleLogs[i],this.sampleArgs[i],data.bridge?.[i] ?? NaN,data.coords[2*i],data.coords[2*i+1]);
      colors[3 * i] = c.r;
      colors[3 * i + 1] = c.g;
      colors[3 * i + 2] = c.b;
    }
    const indices = [], maskedIndices = [];
    for (let j = 0; j < data.ny; j++) {
      for (let i = 0; i < data.nx; i++) {
        const a = j * (data.nx + 1) + i;
        const b = a + 1, c = a + data.nx + 1, d = c + 1;
        if (data.valid[a] && data.valid[b] && data.valid[c]) indices.push(a, c, b);
        else maskedIndices.push(a, c, b);
        if (data.valid[b] && data.valid[c] && data.valid[d]) indices.push(b, c, d);
        else maskedIndices.push(b, c, d);
      }
    }
    this.indices = indices;
    if (this.state.geometry !== 'plane' && maskedIndices.length) {
      const baseGeometry = new THREE.BufferGeometry();
      baseGeometry.setAttribute('position', new THREE.BufferAttribute(data.basePositions.slice(), 3));
      baseGeometry.setIndex(maskedIndices);
      baseGeometry.computeVertexNormals();
      const base = new THREE.Mesh(baseGeometry, new THREE.MeshStandardMaterial({ color: 0x142136, roughness: 0.94, metalness: 0.02, side: THREE.DoubleSide, transparent: true, opacity: 0.65, depthWrite: true }));
      base.renderOrder = -1;
      this.maskSurface = base;
      this.surfaceGroup.add(base);
      const wire = new THREE.Mesh(baseGeometry.clone(), new THREE.MeshBasicMaterial({ color: 0x7d91ad, wireframe: true, transparent: true, opacity: 0.055, depthWrite: false }));
      wire.renderOrder = 1;
      this.surfaceGroup.add(wire);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.raised, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    const opacity = this.state.opacity ?? 0.98;
    const material = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide, vertexColors: true, roughness: 0.49, metalness: 0.07,
      clearcoat: 0.27, clearcoatRoughness: 0.6, transparent: opacity < 0.995,
      opacity, depthWrite: opacity > 0.86, flatShading: false,
    });
    material.polygonOffset = true;
    material.polygonOffsetFactor = 1;
    material.polygonOffsetUnits = 1;
    this.surface = new THREE.Mesh(geometry, material);
    this.surface.renderOrder = 0;
    this.surfaceGroup.add(this.surface);
    if (this.state.wireframe) {
      const mesh = new THREE.Mesh(geometry.clone(), new THREE.MeshBasicMaterial({ color: 0xe7f2ff, wireframe: true, transparent: true, opacity: 0.11, depthWrite: false }));
      mesh.renderOrder = 2;
      this.surfaceGroup.add(mesh);
    }
    this.renderer.toneMappingExposure = 1.2 * (this.state.exposure || 1);
  }

  lineSegments(points, color, opacity = 0.8, group = this.overlayGroup) {
    if (!points.length) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
    const line = new THREE.LineSegments(geometry, material);
    line.renderOrder = 3;
    group.add(line);
    return line;
  }

  contour(field, threshold, color, opacity = 0.8, lift = 0.027) {
    const output = [];
    const data = this.data;
    for (let n = 0; n < this.indices.length; n += 3) {
      const tri = [this.indices[n], this.indices[n + 1], this.indices[n + 2]];
      const crossings = [];
      const isComponent = typeof field === 'string';
      const localLog = isComponent ? Math.max(...tri.map(i => this.sampleLogs[i])) : 0;
      const at = isComponent ? i => {
        const l = this.sampleLogs[i];
        return l === -Infinity ? 0 : Math.exp(l - (finite(localLog) ? localLog : 0)) * (field === 'real' ? Math.cos(this.sampleArgs[i]) : Math.sin(this.sampleArgs[i]));
      } : field;
      for (let edge = 0; edge < 3; edge++) {
        const a = tri[edge], b = tri[(edge + 1) % 3];
        const fa = at(a) - threshold, fb = at(b) - threshold;
        if (!finite(fa) || !finite(fb) || (fa === 0 && fb === 0)) continue;
        if ((fa <= 0 && fb > 0) || (fa > 0 && fb <= 0)) {
          const weight = fa / (fa - fb);
          const point = [];
          for (let axis = 0; axis < 3; axis++) {
            const p = this.raised[a * 3 + axis] * (1 - weight) + this.raised[b * 3 + axis] * weight;
            const normal = data.normals[a * 3 + axis] * (1 - weight) + data.normals[b * 3 + axis] * weight;
            point.push(p + lift * normal);
          }
          crossings.push(point);
        }
      }
      if (crossings.length === 2) output.push(...crossings[0], ...crossings[1]);
    }
    return this.lineSegments(output, color, opacity);
  }

  buildGuides() {
    disposeTree(this.guideGroup);
    if (this.state.geometry !== 'plane') return;
    const data = this.data;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < data.basePositions.length; i += 3) {
      minX = Math.min(minX, data.basePositions[i]); maxX = Math.max(maxX, data.basePositions[i]);
      minZ = Math.min(minZ, data.basePositions[i + 2]); maxZ = Math.max(maxZ, data.basePositions[i + 2]);
    }
    const grid = [], major = [];
    const y = -0.08;
    for (let i = 0; i <= 10; i++) {
      const x = minX + (maxX - minX) * i / 10;
      grid.push(x, y, minZ, x, y, maxZ);
    }
    for (let j = 0; j <= 12; j++) {
      const z = minZ + (maxZ - minZ) * j / 12;
      grid.push(minX, y, z, maxX, y, z);
    }
    major.push(minX, y, minZ, maxX, y, minZ, minX, y, minZ, minX, y, maxZ, maxX, y, minZ, maxX, y, maxZ, minX, y, maxZ, maxX, y, maxZ);
    this.lineSegments(grid, 0x42607d, 0.17, this.guideGroup);
    this.lineSegments(major, 0x7a92ad, 0.35, this.guideGroup);
    const sigmaLabel = labelSprite('σ  ·  Re(s)', { size: 0.40 });
    sigmaLabel.position.set((minX + maxX) / 2, y, maxZ + 0.9);
    this.guideGroup.add(sigmaLabel);
    const tLabel = labelSprite('t  ·  Im(s)', { size: 0.40 });
    tLabel.position.set(minX - 1.05, y, (minZ + maxZ) / 2);
    this.guideGroup.add(tLabel);
    for (let i = 0; i <= 4; i++) {
      const frac = i / 4;
      const value = this.state.sigmaMin + frac * (this.state.sigmaMax - this.state.sigmaMin);
      const label = labelSprite(Number(value.toFixed(2)).toString(), { size: 0.29, color: '#7e91a8' });
      label.position.set(minX + frac * (maxX - minX), y, maxZ + 0.38);
      this.guideGroup.add(label);
    }
    for (let j = 0; j <= 4; j++) {
      const frac = j / 4;
      const value = this.state.tMin + frac * (this.state.tMax - this.state.tMin);
      const label = labelSprite(Number(value.toFixed(2)).toString(), { size: 0.29, color: '#7e91a8' });
      label.position.set(minX - 0.43, y, minZ + frac * (maxZ - minZ));
      this.guideGroup.add(label);
    }
  }

  raisedLine(line, lift = 0.045) {
    const points = line.points || line.positions || [];
    return points.map((point, index) => {
      const normal = line.normals?.[index];
      const value = line.values?.[index];
      if (!normal) return new THREE.Vector3(...point);
      const h = line.logAbs ? this.heightPolar(line.logAbs[index],line.arg?.[index] || 0) : value ? this.height(value[0], value[1]) : 0;
      return new THREE.Vector3(point[0] + normal[0] * (h + lift), point[1] + normal[1] * (h + lift), point[2] + normal[2] * (h + lift));
    });
  }

  pathLine(points, color, opacity = 0.9, dashed = false) {
    if (points.length < 2) return null;
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = dashed
      ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.10, gapSize: 0.075, depthWrite: false })
      : new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
    const line = new THREE.Line(geometry, material);
    if (dashed) line.computeLineDistances();
    line.renderOrder = 4;
    this.overlayGroup.add(line);
    return line;
  }

  buildOverlays() {
    disposeTree(this.overlayGroup);
    this.packetTracks = [];
    const data = this.data;
    if (this.state.contours) {
      this.contour('real', 0, palettes.real, 0.63);
      this.contour('imag', 0, palettes.imag, 0.63);
    }
    if (this.state.critical) {
      if (this.state.geometry !== 'plane') this.criticalTorusOvals();
      else this.contour(i => data.coords[2 * i], 0.5, palettes.critical, 1, 0.052);
    }
    if (this.state.seams && this.state.geometry !== 'plane') {
      const edges = [];
      const add = (a, b) => {
        if (!data.valid[a] || !data.valid[b]) return;
        for (const index of [a, b]) for (let axis = 0; axis < 3; axis++) edges.push(this.raised[3 * index + axis] + data.normals[3 * index + axis] * 0.03);
      };
      for (let j = 0; j < data.ny; j++) { add(j * (data.nx + 1), (j + 1) * (data.nx + 1)); add(j * (data.nx + 1) + data.nx, (j + 1) * (data.nx + 1) + data.nx); }
      for (let i = 0; i < data.nx; i++) { add(i, i + 1); if(this.state.geometry!=='klein')add(data.ny * (data.nx + 1) + i, data.ny * (data.nx + 1) + i + 1); }
      this.lineSegments(edges, 0xd1ddeb, 0.32);
      if(this.state.projective)for(const guide of data.projectiveGuides||[]){
        const points=guide.points.map((p,i)=>new THREE.Vector3(...p).addScaledVector(new THREE.Vector3(...guide.normals[i]),.045));
        this.pathLine(points,guide.color,.8,true);
      }
    }
    if (this.state.zeros) {
      const points = data.zeroPoints || [];
      const heights = [...new Set(points.filter(p => p.t > 0 && p.kind !== 'pole').map(p => p.t))].sort((a,b) => a-b).slice(0,3);
      let labels = 0;
      for (const marker of points) {
        const showLabel = marker.showLabel !== false && (this.state.geometry === 'plane' ? labels < 6 : marker.t > 0 && heights.includes(marker.t));
        this.addZero({ ...marker, showLabel });
        if (showLabel) labels++;
      }
    }
    if (this.state.vortices) {
      for (const flow of data.flowLines || []) this.pathLine(this.raisedLine(flow, 0.06), flow.color || 0xd3fbff, flow.opacity ?? 0.55);
    }
    if (this.state.ladder || this.state.packets) {
      for (const [index, rail] of (data.ladderLines || []).entries()) {
        const points = this.raisedLine(rail, 0.085);
        const color = rail.color || (rail.kind === 'bridge' || rail.kind === 'antibridge' ? palettes.bridge : index % 2 ? palettes.dual : palettes.direct);
        if (this.state.ladder) this.pathLine(points, color, rail.kind === 'rung' ? 0.48 : 0.95, rail.kind === 'antibridge');
        if (this.state.packets && rail.kind === 'rail' && points.length > 2) {
          const material = new THREE.SpriteMaterial({ map: this.glow.clone(), color, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
          for (let particle = 0; particle < 5; particle++) {
            const sprite = new THREE.Sprite(material.clone());
            sprite.material.map = this.glow.clone();
            sprite.scale.setScalar(0.29);
            sprite.renderOrder = 6;
            this.overlayGroup.add(sprite);
            this.packetTracks.push({ sprite, points, phase: particle / 5 + (rail.phase || 0), frequency: rail.frequency || 1, amplitude: rail.amplitude ?? 1, direction: rail.direction || (index % 2 ? -1 : 1) });
          }
          material.map?.dispose();
          material.dispose();
        }
      }
    }
    this.addLandmarks();
    this.refreshProbe();
  }

  addZero(marker) {
    if (!marker.position || !marker.normal) return;
    const normal = new THREE.Vector3(...marker.normal).normalize();
    const value = marker.value || [0, 0];
    const markerHeight = marker.logAbs !== undefined ? this.heightPolar(marker.logAbs,marker.arg || 0) : this.height(value[0], value[1]);
    const position = new THREE.Vector3(...marker.position).addScaledVector(normal, markerHeight + .065);
    const color = marker.color ?? (marker.kind === 'pole' ? 0xff8a85 : 0xecffc2);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), new THREE.MeshBasicMaterial({ color }));
    sphere.position.copy(position);
    sphere.renderOrder = 5;
    if (!marker.hollow) this.overlayGroup.add(sphere);
    else { sphere.geometry.dispose(); sphere.material.dispose(); }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 5, 32), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false }));
    ring.position.copy(position);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    ring.renderOrder = 5;
    this.overlayGroup.add(ring);
    if (marker.label && (marker.showLabel !== false)) {
      const label = labelSprite(marker.label, { color: marker.color ? '#' + marker.color.toString(16).padStart(6, '0') : marker.kind === 'pole' ? '#ffb2a2' : '#d7ebc4', size: 0.27, background: true });
      label.material.depthTest = true;
      label.position.copy(position).addScaledVector(normal, 0.30);
      this.overlayGroup.add(label);
    }
  }

  addLandmarks() {
    if(this.state.geometry==='torus'&&!this.state.projective&&!(this.state.ladder||this.state.critical))return;
    for(const marker of this.data.landmarkValues||[]){
      if(this.state.geometry==='torus'&&!this.state.projective&&!this.state.ladder&&marker.kind!=='puncture')continue;
      const polar=marker.polar;
      this.addZero({...marker,value:polar?[polar.re,polar.im]:[0,0],
        ...(polar?{logAbs:polar.logAbs,arg:polar.arg}:{}),
        color:marker.kind==='puncture'?0xa9bcd4:marker.kind==='anti'?0xffe3a4:marker.kind==='chart'?0x83e8e5:0xa7b9e4,
        hollow:marker.kind==='puncture',label:marker.kind==='branch'?'branch · '+marker.label:marker.label});
    }
  }

  updateStyle(state) {
    if (!this.renderer) return;
    const previous = this.state;
    const previousLogReference = this.logReference;
    this.state = { ...this.state, ...state };
    this.controls.autoRotate = !!this.state.autoRotate;
    if (!this.data) return;
    const rebuild = ['height', 'heightMode', 'colorMode', 'phaseOffset', 'opacity', 'wireframe', 'exposure', 'heightReference', 'heightLocked', 'heightLogReference', 'displayDamping', 'displayDampingScale'].some(key => previous[key] !== this.state[key]);
    if (rebuild) {
      this.syncReference();
      this.buildSurface();
    }
    if (rebuild || ['projective', 'contours', 'critical', 'zeros', 'vortices', 'ladder', 'packets', 'seams'].some(key => previous[key] !== this.state[key])) this.buildOverlays();
    this.preparedSignature=renderStyleSignature(this.state);
    if(previous.playing!==this.state.playing)this.refreshProbe();
    if (previousLogReference !== this.logReference) this.onStatus({type:'render',vertices:this.data.valid.length,faces:this.indices.length/3,heightScale:this.reference,reference:this.reference,logReference:this.logReference});
    this.needsRender = true;
  }

  resetCamera(view = 'perspective') {
    if (!this.renderer) return;
    const kind = this.state.geometry || 'plane';
    let box = this.surface ? new THREE.Box3().setFromObject(this.surface) : null;
    if (!box || box.isEmpty()) box = new THREE.Box3(new THREE.Vector3(-6, 0, -8), new THREE.Vector3(6, 3, 8));
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    // Bound a narrow camera aspect ratio using horizontal as well as vertical field of view.
    const radius = Math.max(size.length() * 0.5, 3.5);
    const fit = radius / Math.sin(this.camera.fov * Math.PI / 360) * Math.max(0.85, 1 / Math.max(this.camera.aspect, 0.5));
    const distance = fit * (kind === 'plane' ? 0.87 : 0.94);
    const target = kind === 'plane' ? new THREE.Vector3(center.x, Math.max(0.4, center.y * 0.35), center.z) : center;
    this.controls.target.copy(target);
    this.camera.up.set(0, 1, 0);
    if (view === 'top' || view === 'phase') {
      this.camera.position.copy(target).add(new THREE.Vector3(0, distance, 0.0001));
      this.camera.up.set(0, 0, -1);
    } else if (view === 'front') this.camera.position.copy(target).add(new THREE.Vector3(0, 0.1, distance));
    else {
      const direction = kind === 'plane' ? new THREE.Vector3(0.72, 0.80, 1.03).normalize() : new THREE.Vector3(0.70, 0.47, 1.0).normalize();
      this.camera.position.copy(target).addScaledVector(direction, distance);
    }
    this.camera.lookAt(target);
    this.controls.update();
    this.controls.saveState();
    this.needsRender = true;
  }

  getCameraState() {
    if (!this.renderer) return null;
    const delta = this.camera.position.clone().sub(this.controls.target);
    return { type: 'webgl', azimuth: Math.atan2(delta.x, delta.z), elevation: Math.asin(delta.y / delta.length()), distance: delta.length(), target: this.controls.target.toArray(), position: this.camera.position.toArray(), up: this.camera.up.toArray() };
  }

  setCameraState(camera) {
    if (!this.renderer || !camera || typeof camera !== 'object') return;
    const vector = a => Array.isArray(a) && a.length === 3 && a.every(x => finite(x) && Math.abs(x) < 1000);
    if (vector(camera.target)) this.controls.target.fromArray(camera.target);
    if (camera.type === 'webgl' && vector(camera.position)) this.camera.position.fromArray(camera.position);
    else if (finite(camera.azimuth) && finite(camera.elevation) && finite(camera.distance)) {
      const distance = clamp(camera.distance, 1.1, 100), elevation = clamp(camera.elevation, -1.56, 1.569);
      this.camera.position.copy(this.controls.target).add(new THREE.Vector3(Math.sin(camera.azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(camera.azimuth) * Math.cos(elevation)).multiplyScalar(distance));
    }
    if (camera.type === 'webgl' && vector(camera.up)) this.camera.up.fromArray(camera.up).normalize();
    else this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.controls.target);
    this.controls.update();
    this.needsRender = true;
  }

  inspectPointer(event, pinned) {
    if (!this.surface || !this.data) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.maskSurface ? [this.surface, this.maskSurface] : [this.surface], false)[0];
    if (!hit?.face || hit.object !== this.surface) return;
    const indices = [hit.face.a, hit.face.b, hit.face.c];
    const vertices = indices.map(i => new THREE.Vector3(this.raised[3 * i], this.raised[3 * i + 1], this.raised[3 * i + 2]));
    const barycentric = new THREE.Vector3();
    THREE.Triangle.getBarycoord(hit.point, vertices[0], vertices[1], vertices[2], barycentric);
    const weights = [barycentric.x, barycentric.y, barycentric.z];
    let sigma = 0, t = 0, re = 0, im = 0, u = 0, v = 0;
    for (let k = 0; k < 3; k++) {
      const index = indices[k], weight = weights[k];
      sigma += this.data.coords[2 * index] * weight;
      t += this.data.coords[2 * index + 1] * weight;
      re += this.data.values[2 * index] * weight;
      im += this.data.values[2 * index + 1] * weight;
      u += (this.data.uvs ? this.data.uvs[2*index] : (index % (this.data.nx + 1)) / this.data.nx) * weight;
      v += (this.data.uvs ? this.data.uvs[2*index+1] : Math.floor(index / (this.data.nx + 1)) / this.data.ny) * weight;
    }
    if (finite(sigma) && finite(t)) {
      this.onProbe({ sigma, t, re, im, u, v, pinned, source: 'mesh-interpolated' });
    }
  }

  insideNumericDomain(sigma, t) {
    const d = this.data?.domain || NUMERICS;
    return finite(sigma) && finite(t) && sigma >= d.sigmaMin && sigma <= d.sigmaMax && Math.abs(t) <= d.tMax
      && !(this.state.function === 'zeta' && Math.hypot(sigma - 1, t) < .025);
  }

  visibleTriangle(u, v) {
    if (!finite(u) || !finite(v) || u < 0 || u > 1 || v < 0 || v > 1) return false;
    const { nx, valid } = this.data, [i,fu] = axisInterval(this.uAxis,u), [j,fv] = axisInterval(this.vAxis,v);
    const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
    return fu + fv <= 1 ? !!(valid[a] && valid[b] && valid[c]) : !!(valid[b] && valid[c] && valid[d]);
  }

  criticalSamples() {
    // Every analytic sample was prepared by the worker/cache. Applying a
    // frame must never invoke zeta, xi, or theta integration on the UI thread.
    return this.data?.criticalSamples || [];
  }

  criticalTorusOvals() {
    // The complete base-chart critical curve is geometric. Its muted dashed
    // tails carry no function values. Bright raised segments are actually
    // evaluated finite samples and never depend on neighboring mesh validity.
    for (const samples of this.criticalSamples()) {
      let raised=[],guide=[],lastSupported=null;
      const flushRaised=()=>{if(raised.length>1)this.pathLine(raised,palettes.critical,1);raised=[];};
      const flushGuide=()=>{if(guide.length>1)this.pathLine(guide,lastSupported?0xa6bb88:0xa6b3c6,lastSupported?.26:.68,!lastSupported);guide=[];};
      for(let i=0;i<samples.length;i++){
        const p=samples[i],base=new THREE.Vector3(...p.position).addScaledVector(new THREE.Vector3(...p.normal),.038);
        if(i){const supported=samples[i-1].computed&&p.computed;if(lastSupported!==null&&supported!==lastSupported){const last=guide[guide.length-1];flushGuide();if(last)guide.push(last);}lastSupported=supported;}
        guide.push(base);
        if(p.computed){const h=this.heightPolar(p.polar.logAbs,p.polar.arg)+.065;raised.push(new THREE.Vector3(...p.position).addScaledVector(new THREE.Vector3(...p.normal),h));}
        else flushRaised();
      }
      flushGuide();flushRaised();
    }
  }

  setProbe(sigma, t) {
    if(!this.renderer||!this.data)return;
    this.probeCoordinates=finite(sigma)&&finite(t)?{sigma,t}:null;
    // Playback only displays cached samples. Inspection resumes when paused.
    if(this.state.playing||!this.insideNumericDomain(sigma,t)){this.refreshProbe();return;}
    this.probeCache ||= new WeakMap();
    let sample=this.probeCache.get(this.data);
    if(!sample||sample.sigma!==sigma||sample.t!==t){
      const polar=polarAt(sigma,t,this.state.function,this.state.tau);
      if(!validLog(polar.logAbs)||!finite(polar.arg)){this.drawProbe(null);return;}
      sample={sigma,t,polar,lifts:liftPoint(sigma,t,this.state)};
      this.probeCache.set(this.data,sample);
    }
    this.drawProbe(sample);
  }

  refreshProbe() {
    const coordinates=this.probeCoordinates;
    if(this.state.playing||!coordinates){this.drawProbe(null);return;}
    const sample=this.probeCache?.get(this.data)||this.data?.probeSample;
    this.drawProbe(sample&&sample.sigma===coordinates.sigma&&sample.t===coordinates.t?sample:null);
  }

  drawProbe(sample) {
    if(!this.renderer)return;
    disposeTree(this.probeGroup);this.needsRender=true;
    if(!sample||!this.insideNumericDomain(sample.sigma,sample.t))return;
    for(const p of sample.lifts||[]){
      if(!this.visibleTriangle(p.u,p.v))continue;
      // Quotient inverses can represent the reflected source point. Imaginary
      // relief follows the conjugated local field, just like the mesh does.
      const localArg=p.conjugated?-sample.polar.arg:sample.polar.arg;
      const h=this.heightPolar(sample.polar.logAbs,localArg)+.065;
      const normal=new THREE.Vector3(...p.normal).normalize();
      const position=new THREE.Vector3(...p.position).addScaledVector(normal,h);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.18,.018,6,40),new THREE.MeshBasicMaterial({color:0xffffff,depthTest:false,transparent:true,opacity:.93}));
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);ring.position.copy(position);ring.renderOrder=10;
      this.probeGroup.add(ring);
    }
  }

  frame() {
    if (this.disposed || !this.renderer) return;
    const delta = Math.min(this.clock.getDelta(), 0.1);
    if (this.state.packets && !this.state.packetPaused) this.packetTime += delta * (this.state.flowSpeed ?? 1);
    const elapsed = this.packetTime;
    const moved = this.controls.update();
    if (this.packetTracks.length && this.state.packets) {
      for (const track of this.packetTracks) {
        const progress = ((track.phase + track.direction * elapsed * 0.055) % 1 + 1) % 1;
        const index = progress * (track.points.length - 1);
        const lower = Math.floor(index), alpha = index - lower;
        track.sprite.position.lerpVectors(track.points[lower], track.points[Math.min(lower + 1, track.points.length - 1)], alpha);
        const envelope = 0.65 + 0.35 * Math.cos(elapsed * track.frequency + track.phase * TAU);
        track.sprite.material.opacity = clamp(envelope * track.amplitude, 0.1, 1);
        track.sprite.scale.setScalar(0.24 + 0.10 * envelope);
      }
      if (!this.state.packetPaused) this.needsRender = true;
    }
    if (this.needsRender || moved || this.controls.autoRotate) {
      this.renderer.render(this.scene, this.camera);
      this.needsRender = false;
    }
    this.raf = requestAnimationFrame(this.frame);
  }

  screenshot() {
    if (!this.renderer) return null;
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this.controls?.dispose();
    if (this.renderer) {
      this.renderer.domElement.removeEventListener('pointermove', this.pointerMove);
      this.renderer.domElement.removeEventListener('pointerdown', this.pointerDown);
      this.renderer.domElement.removeEventListener('pointerup', this.pointerUp);
      disposeTree(this.scene);
      this.glow?.dispose();
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}

