/** Zero-channel diagnostics and Newton guidance.
 *
 * The theta tracks always come from the saved, actual theta continuation.
 * A displayed finite coupling graph never replaces that evolution.  Certified
 * disks use the supplied exact rational quartet certificates or the finalized
 * Arb theta reference witness, within their recorded geometry and time range.
 * Browser evaluation and other theta candidates are floating-point diagnostics,
 * even when their displayed margin is positive.
 */
import { heatJet, thetaPhi, complex } from './math.js';
import { quarticHeatJet, heatZeroVelocity } from './research-dynamics.js';

const { add, sub, scale, div, abs } = complex;
const C = (re = 0, im = 0) => ({ re, im });
const finite = z => z && Number.isFinite(z.re) && Number.isFinite(z.im);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const number = (x, fallback, a, b) => typeof x === 'number' && Number.isFinite(x) ? clamp(x, a, b) : fallback;
const COLORS = ['#8bd7ef', '#b5df8d', '#f3b576', '#c1a2ef'];
export const QUARTIC_COLLISION_TAU = -(10 - Math.sqrt(46)) / 24;
export const CHANNEL_DEFAULTS = Object.freeze({
  view: 'channels', model: 'theta', frame: 0, end: -.2, branch: 0,
  direction: 'decrease', radiusScale: 1, spread: .25, seed: 19,
  seedCount: 12, newtonTime: 16, perturbationTime: 1, checkpoint: '',
});

export function normalizeChannelState(input = {}) {
  const model = input.model === 'quartic' ? 'quartic' : 'theta';
  const checkpoint = model === 'quartic' && input.checkpoint === 'collision' ? 'collision' : '';
  let frame = number(input.frame, 0, 0, 240);
  if (model === 'theta') frame = Math.round(frame);
  if (checkpoint) frame = -960 * QUARTIC_COLLISION_TAU;
  return {
    view: ['channels', 'coupling', 'newton'].includes(input.view) ? input.view : 'channels',
    model, frame, end: model === 'quartic' ? -.25 : input.end === .2 ? .2 : -.2,
    branch: Math.round(number(input.branch, 0, 0, model === 'quartic' ? 3 : 2)),
    direction: input.direction === 'increase' ? 'increase' : 'decrease',
    radiusScale: number(input.radiusScale, 1, .1, 10),
    spread: number(input.spread, .25, .05, 1),
    seed: Math.round(number(input.seed, 19, 1, 9999)),
    seedCount: Math.round(number(input.seedCount, 12, 4, 24)),
    newtonTime: number(input.newtonTime, 16, .1, 18),
    perturbationTime: number(input.perturbationTime, 1, 0, 2),
    checkpoint,
  };
}

function csqrt(z) {
  const magnitude = abs(z);
  return C(Math.sqrt(Math.max(0, (magnitude + z.re) / 2)), (z.im < 0 ? -1 : 1) * Math.sqrt(Math.max(0, (magnitude - z.re) / 2)));
}

/** Exact algebraic root expressions, evaluated in floating point for drawing.
 * At the algebraic collision (or an indistinguishable machine neighbourhood),
 * velocities and the inverse-gap graph are unresolved, not epsilon-regularized.
 */
export function quarticChannelRoots(tau, { collision = false } = {}) {
  const u = -tau, a = 12 * u - 5;
  let discriminant = 96 * u * u - 80 * u + 9;
  const nearCollision = collision || Math.abs(tau - QUARTIC_COLLISION_TAU) <= 8 * Number.EPSILON;
  if (nearCollision) discriminant = 0;
  const d = csqrt(C(discriminant));
  const squares = [scale(sub(C(-a), d), .5), scale(add(C(-a), d), .5)];
  const roots = [];
  for (const square of squares) {
    const z = csqrt(square);
    for (const sign of [1, -1]) {
      const branch = roots.length, sigma = .5 - sign * z.im / 2, t = sign * z.re / 2;
      roots.push(rootRecord({ sigma, t, branch }, tau, quarticHeatJet(sigma, t, tau), nearCollision));
    }
  }
  return roots;
}

function rootRecord(root, tau, jet, forceMultiple = false) {
  const A = abs(jet.derivative), second = abs(jet.secondDerivative);
  const condition = A / (A + second || 1);
  const simple = jet.valid && !forceMultiple && A > 0 && condition > 1e-7;
  const velocity = simple ? heatZeroVelocity(jet) : null;
  return {
    ...root, id: `zero-${root.branch + 1}`, color: COLORS[root.branch % COLORS.length], tau,
    derivativeAbs: A, residual: A ? abs(jet.value) / A : null, condition,
    velocity: velocity && finite(velocity) ? velocity : null,
    status: simple ? 'simple' : 'multiple-or-unresolved',
  };
}

function savedRun(data, end) {
  const run = data?.runs?.find(item => Math.abs(item.tauEnd - end) < 1e-12);
  if (!run || !Array.isArray(run.frames) || run.frames.length !== 241) throw new Error('The saved theta run is missing or incomplete.');
  return run;
}

export function taylorRoucheCandidate({ E, A, B, radius }) {
  const valid = [E, A, B, radius].every(Number.isFinite) && E >= 0 && A > 0 && B >= 0 && radius > 0;
  if (!valid) return { E, A, B, radius, margin: null, relativeMargin: null, passes: false, certified: false, status: 'unresolved' };
  const linear = A * radius, remainder = E + B * radius * radius / 2;
  const margin = linear - remainder;
  return { E, A, B, radius, margin, relativeMargin: margin / linear, passes: margin > 0, certified: false, status: margin > 0 ? 'candidate-one-zero' : 'inconclusive' };
}

// B is an estimate of an analytic full-disk bound, not a quadrature certificate.
const momentCache = new Map();
export function thetaCurvatureEstimate(radius, tauLimit = .2) {
  const r = Math.max(0, radius), key = `${r}|${tauLimit}`;
  if (momentCache.has(key)) return momentCache.get(key);
  const n = 768, h = 1.5 / n;
  let sum = 0;
  for (let k = 0; k <= n; k++) {
    const u = k * h;
    const value = 32 * u * u * Math.exp(tauLimit * u * u) * thetaPhi(u) * Math.cosh(2 * r * u);
    sum += (k === 0 || k === n ? 1 : k % 2 ? 4 : 2) * value;
  }
  const estimate = sum * h / 3;
  if (momentCache.size >= 24) momentCache.delete(momentCache.keys().next().value);
  momentCache.set(key, estimate);
  return estimate;
}

// Exact rational lookup prevents rounding a time just outside a proved interval
// into it. The nominal quartet clock is the rational decimal frame divided by
// -960; the SVG and numerical evaluator display approximations of that clock.
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
function fraction(n, d = 1n) { if (!d) throw new Error('Invalid rational denominator.'); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; }
function rational(value) {
  const source = String(value).trim();
  if (source.includes('/')) { const [n, d] = source.split('/'); return fraction(BigInt(n), BigInt(d)); }
  const match = /^([+-]?)(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(source);
  if (!match) throw new Error('Invalid rational value.');
  const decimals = match[3] || '', exponent = Number(match[4] || 0) - decimals.length;
  let n = BigInt(match[2] + decimals) * (match[1] === '-' ? -1n : 1n), d = 1n;
  if (exponent >= 0) n *= 10n ** BigInt(exponent); else d = 10n ** BigInt(-exponent);
  return fraction(n, d);
}
const qadd = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
const qsub = (a, b) => fraction(a.n * b.d - b.n * a.d, a.d * b.d);
const qmul = (a, b) => fraction(a.n * b.n, a.d * b.d);
const qdiv = (a, b) => fraction(a.n * b.d, a.d * b.n);
const qcompare = (a, b) => a.n * b.d < b.n * a.d ? -1 : a.n * b.d > b.n * a.d ? 1 : 0;
const qnumber = a => Number(a.n) / Number(a.d);
const qstring = a => `${a.n}/${a.d}`;

function quartetCertificate(state, data) {
  if (state.model !== 'quartic' || state.checkpoint) return null;
  const certificate = data?.exactQuarticCertificate;
  if (!certificate?.intervals?.length || certificate.certified !== true || certificate.certificateId !== 'quartic-affine-rational-v1') return null;
  const tau = qmul(rational(state.frame), fraction(-1n, 960n));
  for (const interval of certificate.intervals) {
    const first = interval.branches?.[0];
    if (!first?.exact) continue;
    try {
      const lo = rational(first.exact.tauMin ?? interval.exact?.tauMin ?? interval.tauMin);
      const hi = rational(first.exact.tauMax ?? interval.exact?.tauMax ?? interval.tauMax);
      if (qcompare(tau, lo) < 0 || qcompare(tau, hi) > 0) continue;
      const fractionAlong = qdiv(qsub(tau, lo), qsub(hi, lo));
      if (interval.branches.length !== 4 || new Set(interval.branches.map(b => b.branch)).size !== 4 || qcompare(rational(interval.minClearanceExact), fraction(0n)) <= 0) return null;
      return {
        certificate, interval, tau: qstring(tau),
        branches: interval.branches.map(branch => {
          const from = rational(branch.exact.centerStartT), to = rational(branch.exact.centerEndT);
          const centerT = qadd(from, qmul(fractionAlong, qsub(to, from)));
          const r = rational(branch.exact.radius), E = rational(branch.exact.E), A = rational(branch.exact.A), B = rational(branch.exact.B), margin = rational(branch.exact.margin);
          const checkedMargin = qsub(qsub(qmul(A, r), E), qmul(fraction(1n, 2n), qmul(B, qmul(r, r))));
          if (branch.certified !== true || ![0, 1, 2, 3].includes(branch.branch) || qcompare(r, fraction(1n, 100n)) !== 0 || qcompare(E, fraction(0n)) < 0 || qcompare(A, fraction(0n)) <= 0 || qcompare(B, fraction(0n)) < 0 || qcompare(margin, fraction(0n)) <= 0 || qcompare(checkedMargin, margin) < 0) throw new Error('Inconsistent quartet certificate.');
          return { ...branch, E: qnumber(E), A: qnumber(A), B: qnumber(B), margin: qnumber(margin), radius: qnumber(r), center: { sigma: .5, t: qnumber(centerT) }, exactCenterT: qstring(centerT) };
        }),
      };
    } catch { return null; }
  }
  return null;
}

function thetaReferenceWitness(state, data) {
  if (state.model !== 'theta') return null;
  const witness = data?.thetaCertifiedWitness;
  if (witness?.certified !== true || witness.certificateType !== 'rouche-reference' || witness.certificateId !== 'theta-first-disk-arb-v1' || witness.branch !== 0 || !witness.exact) return null;
  try {
    const x = witness.exact, tau = fraction(BigInt(state.frame) * (state.end > 0 ? 1n : -1n), 1200n), lo = rational(x.tauMin), hi = rational(x.tauMax);
    if (qcompare(tau, lo) < 0 || qcompare(tau, hi) > 0) return null;
    const sigma = rational(x.centerSigma), height = rational(x.centerT), radius = rational(x.radius), lower = rational(x.referenceModulusLower), upper = rational(x.perturbationUpper), margin = rational(x.margin);
    if (qcompare(sigma, fraction(1n, 2n)) !== 0 || qcompare(radius, fraction(0n)) <= 0 || qcompare(lower, fraction(0n)) <= 0 || qcompare(upper, fraction(0n)) < 0 || qcompare(margin, fraction(0n)) <= 0 || qcompare(qsub(lower, upper), margin) < 0) return null;
    return { ...witness, center: { sigma: .5, t: qnumber(height) }, radius: qnumber(radius), referenceModulusLower: qnumber(lower), perturbationUpper: qnumber(upper), margin: qnumber(margin), exactCenterT: qstring(height), nominalTau: qstring(tau) };
  } catch { return null; }
}

const trajectoriesCache = new WeakMap();
let quartetTrajectories;
function trajectoriesFor(state, data) {
  if (state.model === 'quartic') {
    if (!quartetTrajectories) {
      const paths = Array.from({ length: 4 }, (_, branch) => ({ id: `zero-${branch + 1}`, branch, color: COLORS[branch], points: [] }));
      for (let frame = 0; frame <= 240; frame++) {
        const tau = -frame / 960;
        for (const root of quarticChannelRoots(tau)) paths[root.branch].points.push({ sigma: root.sigma, t: root.t, tau, frame });
      }
      quartetTrajectories = paths;
    }
    return quartetTrajectories;
  }
  let cached = trajectoriesCache.get(data);
  if (!cached) { cached = new Map(); trajectoriesCache.set(data, cached); }
  if (!cached.has(state.end)) {
    const run = savedRun(data, state.end);
    cached.set(state.end, Array.from({ length: 3 }, (_, branch) => ({ id: `zero-${branch + 1}`, branch, color: COLORS[branch], points: run.frames.map(f => ({ sigma: f.roots[branch].sigma, t: f.roots[branch].t, tau: f.tau, frame: f.frame })) })));
  }
  return cached.get(state.end);
}

/** Jacobi diagonalization for the tiny real symmetric Laplacian only. */
function symmetricEigen(matrix) {
  const n = matrix.length, a = matrix.map(row => row.slice()), vectors = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Number(i === j)));
  const scaleA = Math.max(1, ...a.flat().map(Math.abs));
  for (let step = 0; step < 80 * n * n; step++) {
    let p = 0, q = 1, largest = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.abs(a[i][j]) > largest) { largest = Math.abs(a[i][j]); p = i; q = j; }
    if (largest < scaleA * 1e-14) break;
    const angle = .5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]), c = Math.cos(angle), s = Math.sin(angle);
    const app = a[p][p], aqq = a[q][q], apq = a[p][q];
    a[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
    a[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
    a[p][q] = a[q][p] = 0;
    for (let k = 0; k < n; k++) {
      if (k !== p && k !== q) { const kp = a[k][p], kq = a[k][q]; a[k][p] = a[p][k] = c * kp - s * kq; a[k][q] = a[q][k] = s * kp + c * kq; }
      const kp = vectors[k][p], kq = vectors[k][q]; vectors[k][p] = c * kp - s * kq; vectors[k][q] = s * kp + c * kq;
    }
  }
  return a.map((row, i) => ({ value: Math.abs(row[i]) < scaleA * 1e-12 ? 0 : row[i], vector: vectors.map(r => r[i]) })).sort((x, y) => x.value - y.value);
}

/** The graph is valid for distinct simple on-line roots. Theta uses only the
 * observed three-node subgraph: its spectrum does not bound the infinite system.
 */
export function couplingNetwork(roots, { model = 'theta', direction = 'decrease', perturbationTime = 1, branch = 0 } = {}) {
  const scope = model === 'quartic' ? 'Full four-root polynomial network; frozen-frame linearization.' : 'Observed three-root subgraph only; omitted theta roots are not bounded. Frozen-frame illustration.';
  const invalid = reason => ({ valid: false, reason, scope, edges: [], matrix: [], eigenvalues: [], mode: null, curve: [], spectralGap: null });
  if (roots.length < 2) return invalid('At least two resolved roots are required.');
  if (roots.some(root => root.status !== 'simple')) return invalid('A multiple or ill-conditioned zero makes the inverse-gap network unresolved.');
  if (roots.some(root => Math.abs(root.sigma - .5) > 1e-10)) return invalid('The positive real-height Laplacian is unavailable after an off-line departure.');
  const n = roots.length, matrix = Array.from({ length: n }, () => Array(n).fill(0)), edges = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const gap = roots[i].t - roots[j].t;
    if (Math.abs(gap) <= 1e-8) return invalid('The gap is zero or numerically unresolved; no finite replacement weight is used.');
    const weight = 1 / (gap * gap);
    matrix[i][i] += weight; matrix[j][j] += weight; matrix[i][j] -= weight; matrix[j][i] -= weight;
    edges.push({ source: roots[i].id, target: roots[j].id, i, j, weight, gap: Math.abs(gap) });
  }
  const eigensystem = symmetricEigen(matrix), eigenvalues = eigensystem.map(item => item.value);
  const initial = roots.map((_, i) => (i === clamp(branch, 0, n - 1) ? 1 : 0) - 1 / n), length = Math.hypot(...initial);
  for (let i = 0; i < n; i++) initial[i] /= length;
  const coefficients = eigensystem.map(item => item.vector.reduce((sum, v, i) => sum + v * initial[i], 0));
  const sign = direction === 'increase' ? -1 : 1, curve = [];
  for (let k = 0; k <= 80; k++) {
    const time = perturbationTime * k / 80;
    const logs = coefficients.map((coefficient, i) => Math.abs(coefficient) < 1e-12 ? -Infinity : 2 * Math.log(Math.abs(coefficient)) + sign * eigenvalues[i] * time);
    const maximum = Math.max(...logs), logRatio = .5 * (maximum + Math.log(logs.reduce((sum, value) => sum + Math.exp(value - maximum), 0)));
    curve.push({ time, logRatio, ratio: logRatio < 700 ? Math.exp(logRatio) : null });
  }
  return { valid: true, reason: '', scope, edges, matrix, eigenvalues, eigensystem, spectralGap: eigenvalues.find(value => value > 0) ?? 0, mode: { initial, coefficients, direction, law: 'dη/dτ = −Lη/2; L is frozen at the selected frame', translationMode: Array(n).fill(1 / Math.sqrt(n)) }, curve };
}

export function channelFrame(input = {}, thetaDataset, boundsDataset) {
  const state = normalizeChannelState(input);
  const tau = state.checkpoint === 'collision' ? QUARTIC_COLLISION_TAU : state.end * state.frame / 240;
  const sourceJet = state.model === 'quartic' ? quarticHeatJet : heatJet;
  let roots;
  if (state.model === 'quartic') roots = quarticChannelRoots(tau, { collision: state.checkpoint === 'collision' });
  else {
    const saved = savedRun(thetaDataset, state.end).frames[state.frame];
    if (!saved?.roots || saved.roots.length !== 3) throw new Error('The theta checkpoint does not contain all three saved branches.');
    roots = saved.roots.map((root, branch) => rootRecord({ sigma: root.sigma, t: root.t, branch }, saved.tau, heatJet(root.sigma, root.t, saved.tau)));
  }
  const proof = quartetCertificate(state, boundsDataset);
  const thetaWitness = thetaReferenceWitness(state, boundsDataset);
  const baseRadii = state.model === 'quartic' ? [.01, .01, .01, .01] : [.01, .0001, .00001];
  const channels = roots.map(root => {
    const template = proof?.branches.find(branch => branch.branch === root.branch && branch.certified === true) ?? (root.branch === 0 ? thetaWitness : null);
    const certified = state.radiusScale === 1 ? template : null;
    const referenceCertificate = certified?.certificateType === 'rouche-reference';
    const center = template?.center ?? { sigma: .5, t: root.t };
    const baseRadius = template ? Number(template.radius) : baseRadii[root.branch];
    const radius = baseRadius * state.radiusScale;
    const jet = sourceJet(center.sigma, center.t, tau);
    const E = abs(jet.value), A = abs(jet.derivative);
    const B = state.model === 'quartic' ? 48 * (2 * Math.abs(center.t) + 2 * radius) ** 2 + 8 * Math.abs(-12 * tau - 5) : thetaCurvatureEstimate(radius);
    let candidate = taylorRoucheCandidate({ E, A, B, radius });
    if (referenceCertificate) candidate = { ...candidate, E: null, A: null, B: null, margin: certified.margin, relativeMargin: certified.margin / certified.referenceModulusLower, certified: true, passes: true, status: 'certified-one-zero', numericalTaylorCandidate: candidate };
    else if (certified) candidate = { ...candidate, E: certified.E, A: certified.A, B: certified.B, margin: certified.margin, relativeMargin: certified.margin / (certified.A * radius), certified: true, passes: true, status: 'certified-one-zero' };
    const distances = roots.map(other => Math.hypot(other.sigma - center.sigma, other.t - center.t));
    const boundaryContact = distances.some(distance => Math.abs(distance - radius) < 1e-10 * Math.max(1, radius));
    const modelZeroCount = state.model === 'quartic' && !boundaryContact ? distances.filter(distance => distance < radius).length : null;
    let status = candidate.status;
    if (!certified) {
      if (root.status !== 'simple') status = 'collision';
      else if (modelZeroCount >= 2) status = 'contains-pair';
      else if (distances[root.branch] >= radius) status = 'off-line-outside';
      else if (boundaryContact) status = 'boundary-contact';
    }
    return { ...candidate, status, id: root.id, branch: root.branch, color: root.color, center, baseRadius, geometrySource: template ? 'recorded-certificate' : 'numerical-root', containsAssignedRoot: distances[root.branch] < radius, modelZeroCount, boundaryContact,
      exactCenterT: template?.exactCenterT ?? null, exactBounds: certified?.exact ?? null,
      certificateType: referenceCertificate ? 'rouche-reference' : 'taylor-rouche', certificateKind: referenceCertificate ? 'rouche-reference' : 'taylor-rouche',
      boundaryFloor: referenceCertificate ? certified.referenceModulusLower : null,
      referenceModulusLower: referenceCertificate ? certified.referenceModulusLower : null,
      perturbationUpper: referenceCertificate ? certified.perturbationUpper : null,
      certificateInterval: referenceCertificate ? { tauMin: certified.tauMin, tauMax: certified.tauMax, nominalTau: certified.nominalTau, certificateId: certified.certificateId } : certified ? { tauMin: proof.interval.tauMin, tauMax: proof.interval.tauMax, nominalTau: proof.tau, minClearance: proof.interval.minClearance, certificateId: proof.interval.certificateId } : null,
      scope: referenceCertificate ? 'Certified fixed first-root disk: interval arithmetic at the reference, analytic theta tail bounds, and a whole-parameter Rouché perturbation bound. Display coordinates are rounded.' : certified ? 'Exact rational interval certificate, including the full disk and parameter slab. Display coordinates are rounded.' : state.model === 'theta' ? 'Taylor–Rouché candidate using finite quadrature and a sampled center; not certified.' : 'Algebraic quartet evaluated in floating point; this displayed disk has no interval certificate.',
    };
  });
  for (const channel of channels) {
    channel.clearance = Math.min(...channels.filter(other => other !== channel).map(other => Math.hypot(channel.center.sigma - other.center.sigma, channel.center.t - other.center.t) - channel.radius - other.radius));
    channel.assignmentStable = channel.passes && channel.clearance > 0 && channel.containsAssignedRoot && roots[channel.branch].status === 'simple';
  }
  return {
    state, tau, roots, channels, selected: { root: roots[state.branch], channel: channels[state.branch] },
    trajectories: trajectoriesFor(state, thetaDataset),
    coupling: couplingNetwork(roots, state),
    certification: { certified: channels.every(channel => channel.certified), certifiedCount: channels.filter(channel => channel.certified).length, totalCount: channels.length, model: state.model, boundaryAndTimeCovered: state.radiusScale === 1 && (!!proof || !!thetaWitness), certificateId: state.radiusScale === 1 ? proof?.certificate.certificateId ?? thetaWitness?.certificateId ?? null : null, interval: state.radiusScale !== 1 ? null : proof ? { tauMin: proof.interval.tauMin, tauMax: proof.interval.tauMax } : thetaWitness ? { tauMin: thetaWitness.tauMin, tauMax: thetaWitness.tauMax } : null },
    scope: state.model === 'theta' ? 'Actual saved theta zero tracks. Three observed branches; no claim to enumerate all zeros.' : 'Exact finite quartic calibration, including both signs of height. Branch identity through a collision is not unique.',
  };
}

function rk4(jetAt, position, step) {
  const velocity = p => {
    const jet = jetAt(p.re, p.im);
    if (!jet.valid || !finite(jet.value) || !finite(jet.derivative) || abs(jet.derivative) === 0) return null;
    const v = scale(div(jet.value, jet.derivative), -1);
    return finite(v) ? v : null;
  };
  const a = velocity(position); if (!a) return null;
  const b = velocity(add(position, scale(a, step / 2))); if (!b) return null;
  const c = velocity(add(position, scale(b, step / 2))); if (!c) return null;
  const d = velocity(add(position, scale(c, step))); if (!d) return null;
  return add(position, scale(add(add(a, scale(add(b, c), 2)), d), step / 6));
}

/** Continuous Newton flow, with an independent artificial path clock ell.
 * The fixed function and its zeros never move while this path is integrated.
 */
export function traceNewtonFlow(jetAt, seed, {
  maxTime = 16, roots = [], tolerance = 2e-9, convergenceTolerance = 1e-7,
  maxSteps = 600, bounds = { sigmaMin: -2, sigmaMax: 3, tMin: -65, tMax: 65 },
} = {}) {
  let position = C(seed.sigma, seed.t), ell = 0, step = .16, attempts = 0;
  const initial = jetAt(position.re, position.im), initialAbs = initial.valid ? abs(initial.value) : NaN;
  const points = [{ sigma: position.re, t: position.im, ell, logMagnitudeRatio: initialAbs > 0 ? 0 : null }];
  let status = 'time-limit', destination = null, cluster = [], phaseError = 0, decayError = 0, finalDistance = null;
  const isInside = p => p.re >= bounds.sigmaMin && p.re <= bounds.sigmaMax && p.im >= bounds.tMin && p.im <= bounds.tMax;
  if (!initial.valid || !Number.isFinite(initialAbs)) return { seed, points, status: 'evaluation-failed', destination, cluster, phaseError: null, decayError: null, finalDistance, ell };
  while (ell < maxTime - 1e-12 && attempts++ < maxSteps) {
    const jet = jetAt(position.re, position.im), derivative = abs(jet.derivative), curvature = abs(jet.secondDerivative);
    if (!jet.valid || !finite(jet.value)) { status = 'evaluation-failed'; break; }
    const near = roots.map(root => ({ root, distance: Math.hypot(position.re - root.sigma, position.im - root.t) })).sort((a, b) => a.distance - b.distance);
    finalDistance = near[0]?.distance ?? null;
    if (derivative <= 1e-12 * Math.max(curvature, initial.derivative ? abs(initial.derivative) : 0, 1e-300)) {
      cluster = near.filter(item => item.distance < 1e-5).map(item => item.root.id);
      status = cluster.length > 1 || near[0]?.root.status === 'multiple-or-unresolved' && near[0].distance < 1e-5 ? 'multiple-root' : 'critical-point'; break;
    }
    const correction = abs(div(jet.value, jet.derivative));
    if (correction <= convergenceTolerance) {
      cluster = near.filter(item => item.distance <= 4 * convergenceTolerance + 2e-8).map(item => item.root.id);
      if (cluster.length > 1 || near[0]?.root.status === 'multiple-or-unresolved' && near[0].distance < 1e-5) status = 'multiple-root';
      else if (cluster.length === 1) { status = 'converged'; destination = cluster[0]; }
      else status = 'unassigned-zero';
      break;
    }
    if (!Number.isFinite(correction)) { status = 'critical-point'; break; }
    step = Math.min(step, maxTime - ell, .12 / Math.max(correction, 1e-12));
    const full = rk4(jetAt, position, step);
    const half = rk4(jetAt, position, step / 2);
    const fine = half && rk4(jetAt, half, step / 2);
    if (!full || !fine || !isInside(fine)) {
      step /= 2;
      if (step < 1e-7) { status = fine && !isInside(fine) ? 'left-domain' : 'critical-point'; break; }
      continue;
    }
    const error = abs(sub(full, fine)) / 15;
    if (error > tolerance) { step /= 2; if (step < 1e-7) { status = 'integration-unresolved'; break; } continue; }
    position = fine; ell += step;
    const value = jetAt(position.re, position.im).value, expected = scale(initial.value, Math.exp(-ell));
    const valueAbs = finite(value) ? abs(value) : NaN;
    points.push({ sigma: position.re, t: position.im, ell, logMagnitudeRatio: initialAbs > 0 && valueAbs > 0 ? Math.log(valueAbs) - Math.log(initialAbs) : null });
    const expectedAbs = initialAbs * Math.exp(-ell);
    if (expectedAbs > 0 && finite(value)) {
      decayError = Math.max(decayError, abs(sub(value, expected)) / expectedAbs);
      const ratio = div(value, initial.value);
      if (finite(ratio) && valueAbs > 1e-14 * initialAbs) phaseError = Math.max(phaseError, Math.abs(Math.atan2(ratio.im, ratio.re)));
    }
    if (error < tolerance / 32) step = Math.min(.2, step * 1.5);
  }
  if (attempts >= maxSteps && status === 'time-limit') status = 'integration-limit';
  if (status === 'time-limit' && roots.length) {
    const near = roots.map(root => ({ root, distance: Math.hypot(position.re - root.sigma, position.im - root.t) })).sort((a, b) => a.distance - b.distance);
    finalDistance = near[0].distance;
    if (near[0].distance < 1e-4 && (near.length < 2 || near[1].distance > 4 * near[0].distance) && near[0].root.status === 'simple') { status = 'approaching'; destination = near[0].root.id; }
  }
  return { seed, points, status, destination, cluster, phaseError, decayError, finalDistance, ell };
}

function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => { value += 0x6D2B79F5; let t = value; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const guidanceCache = new Map();
export function computeGuidance(frame, input = frame.state) {
  const state = normalizeChannelState(input), root = frame.roots[state.branch];
  const key = JSON.stringify([state.model, frame.tau, root.sigma, root.t, state.branch, state.spread, state.seed, state.seedCount, state.newtonTime]);
  if (guidanceCache.has(key)) return guidanceCache.get(key);
  const jetAt = (sigma, t) => state.model === 'quartic' ? quarticHeatJet(sigma, t, frame.tau) : heatJet(sigma, t, frame.tau);
  const random = randomGenerator(state.seed), rotation = random() * 2 * Math.PI;
  const traces = [];
  for (let i = 0; i < state.seedCount; i++) {
    const angle = rotation + 2 * Math.PI * i / state.seedCount, distance = state.spread * (.85 + .15 * random());
    const seed = { sigma: root.sigma + distance * Math.cos(angle), t: root.t + distance * Math.sin(angle) };
    traces.push({ id: `probe-${i + 1}`, ...traceNewtonFlow(jetAt, seed, { maxTime: state.newtonTime, roots: frame.roots }) });
  }
  const statuses = {}, destinations = {};
  for (const trace of traces) { statuses[trace.status] = (statuses[trace.status] || 0) + 1; if (trace.destination) destinations[trace.destination] = (destinations[trace.destination] || 0) + 1; }
  const result = { traces, summary: { statuses, destinations, count: traces.length, converged: statuses.converged || 0, approaching: statuses.approaching || 0, unresolved: traces.filter(trace => !['converged', 'approaching'].includes(trace.status)).length, maxPhaseError: Math.max(...traces.map(trace => trace.phaseError ?? 0)), maxDecayError: Math.max(...traces.map(trace => trace.decayError ?? 0)) }, scope: 'Continuous Newton paths for probes in a fixed function. They do not move the zeros or establish RH. Numerical integration; failures are retained.' };
  if (guidanceCache.size >= 6) guidanceCache.delete(guidanceCache.keys().next().value);
  guidanceCache.set(key, result);
  return result;
}

export function computeZeroChannels(input, thetaDataset, boundsDataset, { includeGuidance = false } = {}) {
  const frame = channelFrame(input, thetaDataset, boundsDataset);
  if (includeGuidance) frame.guidance = computeGuidance(frame, frame.state);
  return frame;
}
