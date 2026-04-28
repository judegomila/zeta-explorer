/**
 * imp-925 successor: empirical wrapper-width comparison
 *   eml-composite (1 outward inflation per call)  vs.
 *   per-op composite: expInterval + logInterval + subInterval (3 inflations).
 *
 * RATIONALE
 * ---------
 * imp-925 shipped the eml_interval primitive on the claim that a single
 * outward inflation per primitive call is asymptotically tighter than the
 * per-op chain {exp, log, sub} that produces the same enclosure. This
 * benchmark verifies the claim numerically and quantifies the savings.
 *
 * METHOD
 * ------
 * For 1000 random (x, y) point intervals (x ∈ [-2, 2], y ∈ [0.1, 10]):
 *   E_eml  = eml_interval([x, x], [y, y])
 *   E_perop = subInterval(expInterval([x,x]), logInterval([y,y]))
 *   width_eml  = E_eml[1] - E_eml[0]
 *   width_perop = E_perop[1] - E_perop[0]
 *   ratio = width_perop / width_eml
 *
 * Then report mean, median, max ratio across the 1000 samples. A ratio
 * > 1 means per-op is wider (worse); ratio = 1 means they tie. Theoretical
 * prediction: per-op = 3 inflations stacked = ~3× the per-call ULP, so
 * ratio should be approximately 3.
 */

import {
  eml_interval,
  exp_interval,
  log_interval_direct,
} from './imp-925-eml-interval-primitive.mjs';
import {
  subInterval,
} from './interval-dyson-integrator.mjs';

function log(msg) {
  process.stdout.write(msg + '\n');
}

const N = 1000;
const X_LO = -2;
const X_HI = 2;
const Y_LO = 0.1;
const Y_HI = 10;

function rand(lo, hi) {
  return lo + Math.random() * (hi - lo);
}

const ratios = [];
const widthsEml = [];
const widthsPerop = [];

for (let i = 0; i < N; i++) {
  const x = rand(X_LO, X_HI);
  const y = rand(Y_LO, Y_HI);
  const xInt = [x, x];
  const yInt = [y, y];

  const E_eml = eml_interval(xInt, yInt);
  if (E_eml === null) continue;

  const expI = exp_interval(xInt);
  const logI = log_interval_direct(yInt);
  if (logI === null) continue;
  const E_perop = subInterval(expI, logI);

  const w_eml = E_eml[1] - E_eml[0];
  const w_perop = E_perop[1] - E_perop[0];
  if (w_eml > 0) {
    ratios.push(w_perop / w_eml);
  }
  widthsEml.push(w_eml);
  widthsPerop.push(w_perop);
}

ratios.sort((a, b) => a - b);
function pct(arr, p) {
  return arr[Math.floor((arr.length - 1) * p)];
}

const meanRatio =
  ratios.reduce((s, x) => s + x, 0) / ratios.length;
const medianRatio = pct(ratios, 0.5);
const p99Ratio = pct(ratios, 0.99);
const maxRatio = ratios[ratios.length - 1];

const meanEml =
  widthsEml.reduce((s, x) => s + x, 0) / widthsEml.length;
const meanPerop =
  widthsPerop.reduce((s, x) => s + x, 0) / widthsPerop.length;

log('imp-925 wrapper-width benchmark: eml_interval vs per-op composite');
log('================================================================');
log(`samples           : ${ratios.length}`);
log(`x ∈ [${X_LO}, ${X_HI}],  y ∈ [${Y_LO}, ${Y_HI}]`);
log(`mean   width(eml)  = ${meanEml.toExponential(3)}`);
log(`mean   width(perop) = ${meanPerop.toExponential(3)}`);
log(`mean   ratio (perop/eml) = ${meanRatio.toFixed(3)}`);
log(`median ratio = ${medianRatio.toFixed(3)}`);
log(`p99    ratio = ${p99Ratio.toFixed(3)}`);
log(`max    ratio = ${maxRatio.toFixed(3)}`);
log('');
if (meanRatio > 1.5) {
  log(
    `VERDICT: per-op is ${meanRatio.toFixed(2)}× WIDER than eml on average. ` +
    `eml-composite produces tighter enclosures.`,
  );
} else if (meanRatio < 0.9) {
  log(
    `VERDICT: per-op is ${(1 / meanRatio).toFixed(2)}× TIGHTER than eml. ` +
    `Unexpected — eml outward inflation may be too aggressive.`,
  );
} else {
  log('VERDICT: similar widths. eml savings are modest at point intervals.');
}
