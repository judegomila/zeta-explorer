/** Run with Node 22+: node scripts/verify-visualizations-index.mjs */
import assert from 'node:assert/strict';
import {
  VISUALIZATIONS_INDEX,
  VIZ_MATH_BUCKETS,
  VISUALIZATIONS_INDEX_ASSERTIONS,
  createVisualizationsIndexAssertions,
} from '../src/data/visualizations-index.js';

// Corrupt fresh frozen copies, so rejection comes from the production metadata
// gates rather than merely from a fixture that forgot to freeze its records.
function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
function fixture(change = () => {}) {
  const index = structuredClone(VISUALIZATIONS_INDEX);
  change(index);
  return freeze(index);
}
function failures(index, buckets = VIZ_MATH_BUCKETS) {
  return createVisualizationsIndexAssertions(index, buckets).filter(test => {
    const result = test.holds();
    assert.equal(typeof result, 'boolean', `${test.id} must return a boolean`);
    return !result;
  }).map(test => test.id);
}
let accepted = 0;
let rejected = 0;
function accepts(label, index, buckets) {
  assert.deepEqual(failures(index, buckets), [], label);
  accepted++;
}
function rejects(label, change, expectedId) {
  const failed = failures(fixture(change));
  assert.ok(failed.includes(expectedId), `${label}: expected ${expectedId}, got ${failed.join(', ') || 'no failure'}`);
  rejected++;
}

const metadata = 'imp1228-required-entries-and-metadata';
const routes = 'imp1228-routes-unique-and-required';
const steps = 'imp1228-foundation-steps-pinned';
const buckets = 'imp1228-math-bucket-is-from-closed-set';
const tickets = 'imp1228-every-ticket-present';
const data = 'imp1228-data-modules-pin-to-viz-files';
const sources = 'imp1228-paper-source-and-intro-pin-v52';
const frozen = 'imp1228-record-frozen-and-route-pinned';

assert.equal(VISUALIZATIONS_INDEX_ASSERTIONS.length, 10, 'retain all ten production gate families');
for (const test of VISUALIZATIONS_INDEX_ASSERTIONS) assert.equal(test.holds(), true, test.id);
accepts('current expanded catalog', VISUALIZATIONS_INDEX);
accepts('original nine-card suite', fixture(index => { index.entries = index.entries.slice(0, 9); }),
  Object.freeze(VIZ_MATH_BUCKETS.filter(bucket => bucket !== 'measurement')));

// Valid growth does not require another exact-count update. Shared later
// tickets/data are intentional provenance, not unique card identifiers.
accepts('additional computed view', fixture(index => index.entries.push({
  route: '/research/additional-computed-view', title: 'Additional Computed View',
  oneLine: 'A computed diagnostic that adds a valid card to the evolving catalog.',
  mathBucket: 'measurement', dataModule: null,
  paperSourcePath: 'formalization/paper/additional-computed-view.md',
  ticket: 'user-research-2026-11-08', pedagogicalStep: 124,
  honestCeiling: 'A descriptive numerical diagnostic only; no RH claim.',
})));
accepts('related view sharing existing later provenance and data', fixture(index => index.entries.push({
  ...index.entries.at(-1), route: '/another-view-of-shared-data',
  ticket: 'imp-2673', dataModule: index.entries[0].dataModule,
  pedagogicalStep: 124,
})));
accepts('bounded later summary and nested data path', fixture(index => {
  index.entries.at(-1).oneLine = 'x'.repeat(640);
  index.entries.at(-1).dataModule = 'src/data/research/sample.json';
}));
accepts('comparison with two explicit data sources', fixture(index => {
  index.entries.at(-1).dataModule = 'src/data/first.js, src/data/second.json';
}));

for (const required of VISUALIZATIONS_INDEX.entries.slice(0, 9)) {
  rejects(`missing required ${required.route}`, index => {
    index.entries = index.entries.filter(entry => entry.route !== required.route);
  }, routes);
}
rejects('duplicate route', index => { index.entries.at(-1).route = index.entries[0].route; }, routes);
rejects('swapped original ticket pairings', index => {
  [index.entries[0].ticket, index.entries[1].ticket] = [index.entries[1].ticket, index.entries[0].ticket];
}, tickets);
rejects('duplicate original provenance ticket', index => { index.entries.at(-1).ticket = index.entries[0].ticket; }, tickets);
for (let i = 0; i < 6; i++) {
  rejects(`lost original data pin ${i + 1}`, index => { index.entries[i].dataModule = null; }, data);
}
rejects('swapped original data pins', index => {
  [index.entries[0].dataModule, index.entries[1].dataModule] = [index.entries[1].dataModule, index.entries[0].dataModule];
}, data);
rejects('wrong declared bucket on a foundation card', index => { index.entries[0].mathBucket = 'kernel'; }, buckets);
rejects('unknown bucket on a later card', index => { index.entries.at(-1).mathBucket = 'undeclared'; }, buckets);
rejects('changed original ordering', index => {
  [index.entries[0], index.entries[1]] = [index.entries[1], index.entries[0]];
}, steps);
// This repository's catalog places some later cards between two existing ranks
// with a fractional rank, and two routes carry capital letters; both are valid here.
accepts('fractional later rank and mixed-case route', fixture(index => {
  index.entries.at(-1).pedagogicalStep = 178.5;
  index.entries.at(-1).route = '/viz-sample-K0-view';
}));
for (const step of [0, -1, NaN, Infinity, '3']) {
  rejects(`invalid rank ${step}`, index => { index.entries.at(-1).pedagogicalStep = step; }, steps);
}
for (const route of ['https://example.com/card', '//example.com/card', '/bad//path', '/bad?query=1', '/bad#fragment', '/bad/../path']) {
  rejects(`invalid route ${route}`, index => { index.entries.at(-1).route = route; }, routes);
}
for (const path of [undefined, 1, '../outside.js', 'src/data/../outside.js', '/src/data/file.js', 'src/data/file.txt',
  'src/data/valid.js, ../../outside.js', 'src/data/repeated.js, src/data/repeated.js']) {
  rejects(`invalid data path ${path}`, index => { index.entries.at(-1).dataModule = path; }, data);
}
for (const ticket of ['', 'untracked', 'imp-text', 'user-research-2026-02-30', 'user-research-2026-99-01']) {
  rejects(`invalid ticket ${ticket}`, index => { index.entries.at(-1).ticket = ticket; }, tickets);
}
rejects('empty title', index => { index.entries.at(-1).title = '     '; }, metadata);
rejects('missing summary', index => { delete index.entries.at(-1).oneLine; }, metadata);
rejects('legacy summary still capped at200', index => { index.entries[0].oneLine = 'x'.repeat(201); }, metadata);
rejects('later summary remains bounded', index => { index.entries.at(-1).oneLine = 'x'.repeat(641); }, metadata);
rejects('missing actual source', index => { index.entries.at(-1).paperSourcePath = ''; }, sources);
rejects('rewritten legacy provenance', index => { index.entries[0].paperSourcePath = 'research-inputs/unrelated.pdf'; }, sources);
rejects('rewritten master paper', index => { index.paperSource.path = 'research-inputs/unrelated.pdf'; }, sources);
rejects('empty source note', index => { index.paperSource.note = ' '; }, sources);
rejects('missing ceiling', index => { delete index.entries.at(-1).honestCeiling; }, 'imp2728-every-entry-has-honest-ceiling');
rejects('unqualified positive claim', index => {
  index.entries.at(-1).honestCeiling = 'This visualization establishes all-height operator positivity and proves RH.';
}, 'imp2992-every-ceiling-has-denial-marker');
rejects('sparse entry array', index => { delete index.entries[10]; }, metadata);
rejects('missing entry array', index => { index.entries = null; }, frozen);
rejects('wrong landing route', index => { index.routePath = '/wrong'; }, frozen);

assert.ok(failures(structuredClone(VISUALIZATIONS_INDEX)).includes(frozen), 'mutable catalog must fail');
rejected++;
const mutableEntry = structuredClone(VISUALIZATIONS_INDEX);
mutableEntry.entries.forEach((entry, i) => { if (i !== 10) Object.freeze(entry); });
Object.freeze(mutableEntry.entries); Object.freeze(mutableEntry.paperSource); Object.freeze(mutableEntry);
assert.ok(failures(mutableEntry).includes(metadata), 'mutable entry must fail even when its parents are frozen');
rejected++;
for (const badBuckets of [
  [...VIZ_MATH_BUCKETS], // intentionally mutable
  Object.freeze([...VIZ_MATH_BUCKETS, VIZ_MATH_BUCKETS[0]]),
  Object.freeze(VIZ_MATH_BUCKETS.filter(bucket => bucket !== 'measurement')),
]) {
  assert.ok(failures(VISUALIZATIONS_INDEX, badBuckets).includes(buckets), 'invalid bucket declaration must fail');
  rejected++;
}
const sparseBuckets = [...VIZ_MATH_BUCKETS];
delete sparseBuckets[0];
assert.ok(failures(VISUALIZATIONS_INDEX, Object.freeze(sparseBuckets)).includes(buckets), 'sparse bucket declaration must fail');
rejected++;

console.log(`visualizations index: ${VISUALIZATIONS_INDEX_ASSERTIONS.length} production assertions passed for ${VISUALIZATIONS_INDEX.entries.length} entries.`);
console.log(`${accepted} valid catalog cases accepted; ${rejected} metadata corruptions rejected by the production gates.`);
console.log('Original routes, ticket pairings, six data pins, pedagogical foundation, and explicit claim-scope gates remain enforced.');
