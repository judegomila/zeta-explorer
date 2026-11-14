import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { complex, heatJet } from '../dist/math.js';
import { quarticHeatJet } from '../dist/research-dynamics.js';
import {
  CHANNEL_DEFAULTS, QUARTIC_COLLISION_TAU, normalizeChannelState,
  quarticChannelRoots, channelFrame, couplingNetwork, thetaCurvatureEstimate,
  taylorRoucheCandidate, traceNewtonFlow, computeGuidance, computeZeroChannels,
} from '../dist/zero-channels-math.js';

const theta = JSON.parse(fs.readFileSync(new URL('../dist/experiments/zero-confinement-theta.json', import.meta.url)));
const bounds = JSON.parse(fs.readFileSync(new URL('../dist/experiments/zero-channel-bounds.json', import.meta.url)));
const close = (a, b, tolerance = 1e-11) => assert.ok(Math.abs(a - b) <= tolerance, `${a} versus ${b}`);
const root = (id, t, sigma = .5) => ({ id, t, sigma, status: 'simple' });

test('channel state keeps direction independent of heat endpoint and handles algebraic collision explicitly', () => {
  assert.equal(CHANNEL_DEFAULTS.newtonTime, 16);
  const input = normalizeChannelState({ model: 'theta', frame: 19.7, end: .2, direction: 'decrease', radiusScale: -100, branch: 30, seed: Infinity });
  assert.equal(input.frame, 20); assert.equal(input.end, .2); assert.equal(input.direction, 'decrease');
  assert.equal(input.radiusScale, .1); assert.equal(input.branch, 2); assert.equal(input.seed, 19);
  const collision = normalizeChannelState({ model: 'quartic', checkpoint: 'collision', frame: 0 });
  close(-collision.frame / 960, QUARTIC_COLLISION_TAU, 2e-17);
  assert.equal(collision.end, -.25);
  assert.equal(normalizeChannelState({ model: 'theta', checkpoint: 'collision' }).checkpoint, '');
});

test('actual theta positions and velocities never come from the truncated wire network', () => {
  const left = channelFrame({ model: 'theta', frame: 240, direction: 'decrease' }, theta, bounds);
  const right = channelFrame({ model: 'theta', frame: 240, direction: 'increase' }, theta, bounds);
  assert.deepEqual(left.roots, right.roots);
  assert.deepEqual(left.roots.map(r => [r.sigma, r.t]), theta.runs.find(run => run.tauEnd === -.2).frames[240].roots.map(r => [r.sigma, r.t]));
  for (const r of left.roots) {
    const jet = heatJet(r.sigma, r.t, -.2), v = complex.scale(complex.div(jet.secondDerivative, jet.derivative), -.25);
    close(r.velocity.re, v.re); close(r.velocity.im, v.im);
  }
  assert.match(left.coupling.scope, /subgraph/);
  assert.ok(left.coupling.curve.at(-1).ratio > 1);
  assert.ok(right.coupling.curve.at(-1).ratio < 1);
  assert.ok(left.channels.every(c => c.status === 'candidate-one-zero' && !c.certified));
  assert.equal(left.certification.certified, false);
  const positive = channelFrame({ model: 'theta', end: .2, frame: 240 }, theta, bounds);
  assert.ok(positive.roots[0].t < left.roots[0].t);
  assert.throws(() => channelFrame({}, { runs: [] }), /missing or incomplete/);
});

test('quartic branches satisfy the polynomial and stop assigning finite collision weights', () => {
  for (const tau of [0, -.1, -.13, -.15, -.25]) {
    const roots = quarticChannelRoots(tau);
    assert.equal(roots.length, 4);
    for (const r of roots) assert.ok(complex.abs(quarticHeatJet(r.sigma, r.t, tau).value) < 1e-13);
    const positions = roots.map(r => `${r.sigma.toPrecision(10)}:${r.t.toPrecision(10)}`);
    assert.equal(new Set(positions).size, 4);
  }
  const collision = channelFrame({ model: 'quartic', checkpoint: 'collision' }, theta, bounds);
  assert.equal(collision.tau, QUARTIC_COLLISION_TAU);
  assert.ok(collision.roots.every(r => r.status === 'multiple-or-unresolved' && r.velocity === null));
  assert.equal(collision.coupling.valid, false); assert.deepEqual(collision.coupling.edges, []);
  assert.ok(collision.channels.every(c => c.modelZeroCount === 2 && c.status === 'collision' && !c.assignmentStable));
  const departed = channelFrame({ model: 'quartic', frame: 240 }, theta, bounds);
  assert.equal(departed.coupling.valid, false);
  assert.match(departed.coupling.reason, /off-line/);
  assert.ok(departed.channels.every(c => !c.containsAssignedRoot && !c.certified && c.status === 'off-line-outside'));
});

test('the finite Laplacian has the correct spectrum, null mode, energy law, and physical time sign', () => {
  const roots = [root('a', 0), root('b', 2)];
  const network = couplingNetwork(roots, { model: 'quartic', direction: 'increase', perturbationTime: .8 });
  assert.deepEqual(network.matrix, [[.25, -.25], [-.25, .25]]);
  close(network.eigenvalues[0], 0); close(network.eigenvalues[1], .5);
  close(network.curve.at(-1).ratio, Math.exp(-.5 * .5 * .8), 1e-13);
  const reverse = couplingNetwork(roots, { direction: 'decrease', perturbationTime: .8 });
  close(network.curve.at(-1).ratio * reverse.curve.at(-1).ratio, 1, 1e-13);
  const four = couplingNetwork(quarticChannelRoots(-.12), { model: 'quartic' });
  for (const row of four.matrix) close(row.reduce((a, b) => a + b, 0), 0, 1e-12);
  for (const eigen of four.eigensystem) {
    const applied = four.matrix.map(row => row.reduce((sum, value, j) => sum + value * eigen.vector[j], 0));
    for (let i = 0; i < applied.length; i++) close(applied[i], eigen.value * eigen.vector[i], 1e-10);
  }
  const perturbation = [1, -2, .2, .8];
  const energy = perturbation.reduce((sum, v, i) => sum + v * four.matrix[i].reduce((part, w, j) => part + w * perturbation[j], 0), 0);
  const edgeEnergy = four.edges.reduce((sum, edge) => sum + edge.weight * (perturbation[edge.i] - perturbation[edge.j]) ** 2, 0);
  close(energy, edgeEnergy, 1e-10); assert.ok(energy > 0);
  assert.equal(couplingNetwork([root('a', 1), root('b', 1)]).valid, false);
  assert.equal(couplingNetwork([root('a', 0), root('b', 2, .6)]).valid, false);
});

test('exact quartet certificates apply to their rational centerlines, radius, and complete time slabs', () => {
  for (const interval of bounds.exactQuarticCertificate.intervals) {
    const tau = (interval.tauMin + interval.tauMax) / 2;
    const frame = channelFrame({ model: 'quartic', frame: -960 * tau }, theta, bounds);
    assert.equal(frame.certification.certified, true);
    for (const c of frame.channels) {
      assert.equal(c.status, 'certified-one-zero'); assert.equal(c.modelZeroCount, 1);
      assert.ok(c.margin > 0 && c.clearance > 0 && c.containsAssignedRoot && c.assignmentStable);
      assert.equal(c.radius, .01); assert.ok(c.exactCenterT.includes('/'));
      assert.ok(c.certificateInterval.tauMin <= tau + 1e-14 && c.certificateInterval.tauMax >= tau - 1e-14);
    }
  }
  const endpoint = channelFrame({ model: 'quartic', frame: 124.8 }, theta, bounds);
  assert.equal(endpoint.certification.certified, true);
  close(endpoint.channels[0].margin, .020444320768133732, 1e-15);
  const middle = channelFrame({ model: 'quartic', frame: 124.32 }, theta, bounds);
  assert.ok(Math.abs(middle.channels[0].center.t - middle.roots[0].t) > 1e-6, 'the certificate center is not silently replaced with the numerical zero');
  assert.equal(channelFrame({ model: 'quartic', frame: 124.8000000001 }, theta, bounds).certification.certified, false);
  assert.equal(channelFrame({ model: 'quartic', frame: 120, radiusScale: .5 }, theta, bounds).certification.certified, false);
  assert.equal(channelFrame({ model: 'quartic', frame: 120 }, theta).certification.certified, false);
});

test('a positive Taylor–Rouche diagnostic is not promoted to a proof, and wrong centers fail', () => {
  const good = taylorRoucheCandidate({ E: .001, A: 2, B: 1, radius: .1 });
  assert.equal(good.passes, true); assert.equal(good.certified, false);
  const wrong = taylorRoucheCandidate({ E: 2, A: 1, B: 0, radius: 1 });
  assert.equal(wrong.passes, false);
  assert.equal(taylorRoucheCandidate({ E: 0, A: 0, B: 1, radius: .1 }).status, 'unresolved');
  close(thetaCurvatureEstimate(.01), .023120988875129596, 1e-11);
  assert.ok(thetaCurvatureEstimate(.1) > thetaCurvatureEstimate(.01));
});

test('the actual-theta witness certifies only its recorded first-root disk and full time window', () => {
  assert.equal(bounds.thetaCertifiedWitness.certified, true);
  for (const end of [-.2, .2]) for (const frame of [0, 30, 60]) {
    const result = channelFrame({ model: 'theta', end, frame }, theta, bounds);
    const channel = result.channels[0];
    assert.equal(result.certification.certified, false);
    assert.equal(result.certification.certifiedCount, 1); assert.equal(result.certification.totalCount, 3);
    assert.equal(channel.certificateType, 'rouche-reference'); assert.equal(channel.status, 'certified-one-zero');
    assert.equal(channel.radius, .35); assert.deepEqual(channel.center, { sigma: .5, t: 14.134725141734693 });
    assert.equal(channel.E, null); assert.equal(channel.A, null); assert.equal(channel.B, null);
    close(channel.margin, channel.boundaryFloor - channel.perturbationUpper, 1e-18);
    assert.ok(channel.margin > 0 && channel.clearance > 0 && channel.containsAssignedRoot);
    assert.ok(result.channels.slice(1).every(c => !c.certified && c.status === 'candidate-one-zero'));
    assert.equal(channel.certificateInterval.tauMin, -.05); assert.equal(channel.certificateInterval.tauMax, .05);
  }
  const outside = channelFrame({ model: 'theta', frame: 61 }, theta, bounds);
  assert.equal(outside.certification.certifiedCount, 0);
  assert.equal(outside.channels[0].radius, .01);
  const scaled = channelFrame({ model: 'theta', frame: 60, radiusScale: 1.12 }, theta, bounds);
  assert.equal(scaled.certification.certifiedCount, 0);
  assert.equal(scaled.channels[0].baseRadius, .35);
  close(scaled.channels[0].radius, .35 * 1.12);
  assert.deepEqual(scaled.channels[0].center, bounds.thetaCertifiedWitness.center);
  assert.equal(scaled.channels[0].certificateType, 'taylor-rouche');
  assert.equal(scaled.channels[0].geometrySource, 'recorded-certificate');
});

const linearJet = (sigma, t) => ({ valid: true, value: { re: sigma - .5, im: t - 1 }, derivative: { re: 1, im: 0 }, secondDerivative: { re: 0, im: 0 } });
test('Newton flow preserves the fixed-function identity rather than moving its zero', () => {
  const seed = { sigma: .8, t: 1.2 }, zero = root('target', 1);
  const trace = traceNewtonFlow(linearJet, seed, { maxTime: 4, roots: [zero] });
  const last = trace.points.at(-1);
  close(last.sigma, .5 + .3 * Math.exp(-4), 2e-9);
  close(last.t, 1 + .2 * Math.exp(-4), 2e-9);
  close(last.logMagnitudeRatio, -last.ell, 1e-6);
  assert.ok(trace.phaseError < 1e-12); assert.ok(trace.decayError < 1e-6);
  assert.deepEqual(zero, root('target', 1));
  const converged = traceNewtonFlow(linearJet, seed, { roots: [zero] });
  assert.equal(converged.status, 'converged'); assert.equal(converged.destination, 'target');
});

test('Newton paths identify their actual basin, including off-line zeros and derivative failures', () => {
  const jet = (sigma, t) => ({ valid: true, value: { re: (sigma - .5) ** 2 - t * t - .25, im: 2 * (sigma - .5) * t }, derivative: { re: 2 * (sigma - .5), im: 2 * t }, secondDerivative: { re: 2, im: 0 } });
  const roots = [root('left', 0, 0), root('right', 0, 1)];
  const left = traceNewtonFlow(jet, { sigma: .1, t: .15 }, { roots });
  const right = traceNewtonFlow(jet, { sigma: .9, t: .15 }, { roots });
  assert.equal(left.destination, 'left'); assert.equal(right.destination, 'right');
  assert.equal(left.status, 'converged'); assert.equal(right.status, 'converged');
  assert.ok(Math.max(left.phaseError, right.phaseError) < 1e-5);
  const critical = traceNewtonFlow(jet, { sigma: .5, t: 0 }, { roots });
  assert.equal(critical.status, 'critical-point'); assert.equal(critical.destination, null);
  const collisionRoots = quarticChannelRoots(QUARTIC_COLLISION_TAU, { collision: true });
  const atCollision = traceNewtonFlow((s, t) => quarticHeatJet(s, t, QUARTIC_COLLISION_TAU), { sigma: .5, t: collisionRoots[0].t }, { roots: collisionRoots });
  assert.equal(atCollision.status, 'multiple-root'); assert.equal(atCollision.destination, null);
  assert.equal(atCollision.cluster.length, 2);
});

test('seeded actual-theta guidance is deterministic and marks the captured branch', () => {
  const frame = channelFrame({ model: 'theta', frame: 240, seedCount: 4 }, theta, bounds);
  const first = computeGuidance(frame), repeat = computeGuidance(frame);
  assert.deepEqual(first, repeat);
  assert.equal(first.summary.converged, 4);
  assert.deepEqual(first.summary.destinations, { 'zero-1': 4 });
  assert.ok(first.summary.maxPhaseError < 1e-5);
  assert.ok(first.summary.maxDecayError < 2e-5);
  const other = computeGuidance(frame, { ...frame.state, seed: 20 });
  assert.notDeepEqual(first.traces.map(t => t.seed), other.traces.map(t => t.seed));
  const result = computeZeroChannels({ model: 'quartic', frame: 0, seedCount: 4 }, theta, bounds, { includeGuidance: true });
  assert.equal(result.guidance.traces.length, 4);
  assert.ok(JSON.stringify(result).length > 0);
});
