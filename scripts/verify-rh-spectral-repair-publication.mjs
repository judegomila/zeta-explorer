import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicationRoot = 'research/rh/spectral-repair';
const checksumPath = `${publicationRoot}/PUBLICATION_SHA256SUMS`;
const provenancePath = `${publicationRoot}/SOURCE_PROVENANCE.json`;
const manifestPath = `${publicationRoot}/manifest.json`;
const bodyPath = 'research/rh/modules/spectral-denominator-repair.md';
const replayPath = `${publicationRoot}/validation/COMPLETE_CLEAN_REPAIR_REPLAY.json`;
const transportPath = `${publicationRoot}/validation/STATIC_SOURCE_TRANSPORT_CHECK.json`;
const certificatePath =
  `${publicationRoot}/reference/rh_attack_cycle_20261030/` +
  'support_endpoint_X161_power8_repair/REPAIRED_FULL_EVEN_CERTIFICATE.json';
const auditPath =
  `${publicationRoot}/reference/rh_attack_cycle_20261030/independent_review/` +
  'GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT.json';

const sourceTransport = Object.freeze({
  commit: '5864e2066640d2f7df21714e8aa14f4e4b7d56e7',
  tree: '978347f62e926c975b19464754df7c534366c56c',
  bodySha256: '5342748924a4ff217157d6e931880d6e97e5a16d474752518c428ca69a855a1f',
  provenanceSha256: '21ac5bab0d6e3fb281cda6dd0024d70f42fcb3b304bb7c0acc3b7db697c204f7',
  manifestSha256: '5a470ac83c3f4d6d62164e835b9da6ca857cf9c440bb78ee5c4282f8d5ea2fd8',
  replaySha256: '05586d72a8253e098a37339b6ba51046419dde1e39297091fb74636222175c2b',
});

const sha256Pattern = /^[a-f0-9]{64}$/;
const gitObjectPattern = /^[a-f0-9]{40}$/;
const safePathPattern = /^[A-Za-z0-9._/-]+$/;

function fail(message) {
  throw new Error(`RH spectral repair publication audit: ${message}`);
}

function safeRepositoryPath(relativePath) {
  return typeof relativePath === 'string' &&
    relativePath.length > 0 &&
    safePathPattern.test(relativePath) &&
    !relativePath.includes('\\') &&
    !path.posix.isAbsolute(relativePath) &&
    path.posix.normalize(relativePath) === relativePath &&
    !relativePath.split('/').some((part) => part === '.' || part === '..');
}

function fullPath(relativePath) {
  if (!safeRepositoryPath(relativePath)) fail(`unsafe repository path: ${relativePath}`);
  const resolved = path.resolve(repositoryRoot, relativePath);
  if (!resolved.startsWith(`${repositoryRoot}${path.sep}`)) fail(`path escapes root: ${relativePath}`);
  return resolved;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function listFiles(relativeDirectory) {
  const output = [];
  async function visit(relativePath) {
    const entries = await readdir(fullPath(relativePath), { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const child = path.posix.join(relativePath, entry.name);
      if (entry.isSymbolicLink()) fail(`symbolic links are forbidden in publication data: ${child}`);
      if (entry.isDirectory()) await visit(child);
      else if (entry.isFile()) output.push(child);
      else fail(`unsupported filesystem entry: ${child}`);
    }
  }
  await visit(relativeDirectory);
  return output;
}

function parseChecksums(text) {
  if (text.includes('\r')) fail('checksum manifest must use LF line endings');
  if (!text.endsWith('\n')) fail('checksum manifest must end with one newline');
  const entries = new Map();
  for (const [index, line] of text.slice(0, -1).split('\n').entries()) {
    const match = /^([a-f0-9]{64})  ([A-Za-z0-9._/-]+)$/.exec(line);
    if (!match) fail(`malformed checksum line ${index + 1}`);
    const [, digest, relativePath] = match;
    if (!safeRepositoryPath(relativePath)) fail(`unsafe checksum path: ${relativePath}`);
    if (relativePath === checksumPath) fail('checksum manifest cannot list itself');
    if (entries.has(relativePath)) fail(`duplicate checksum path: ${relativePath}`);
    entries.set(relativePath, digest);
  }
  return entries;
}

function exactSet(actual, expected, label) {
  const extra = [...actual].filter((value) => !expected.has(value));
  const missing = [...expected].filter((value) => !actual.has(value));
  if (extra.length || missing.length) {
    fail(`${label} mismatch; extra=[${extra.join(', ')}], missing=[${missing.join(', ')}]`);
  }
}

assert.match(sourceTransport.commit, gitObjectPattern, 'invalid source commit');
assert.match(sourceTransport.tree, gitObjectPattern, 'invalid source tree');

const checksumText = await readFile(fullPath(checksumPath), 'utf8');
const checksums = parseChecksums(checksumText);
assert.equal(checksums.size, 21, 'expected 21 checksum-listed payloads');

for (const [relativePath, expectedDigest] of Object.entries({
  [bodyPath]: sourceTransport.bodySha256,
  [provenancePath]: sourceTransport.provenanceSha256,
  [manifestPath]: sourceTransport.manifestSha256,
  [replayPath]: sourceTransport.replaySha256,
  [`${publicationRoot}/replay.py`]: '8b96d457f1d9bb264137136fb9b915e5f6958aa32ede366371b3f8f012fc6563',
  [certificatePath]: '2b7edf024d6e8b0192d0bf5267f04a887daa99b9fcadbed72780d4c02302d992',
  [auditPath]: '807899c0259a066005cbb0e49bd08f64ddf83e9772df6102439b5d58c4d37da8',
  [transportPath]: '06b4227a782ce57128760d93b2d7bdf373f7012f2f723ebc9b72c2440ac42f72',
})) {
  assert.match(expectedDigest, sha256Pattern, `invalid pinned hash for ${relativePath}`);
  assert.equal(checksums.get(relativePath), expectedDigest, `pinned hash drift for ${relativePath}`);
}

const publicationFiles = await listFiles(publicationRoot);
const actualPayloads = new Set([
  bodyPath,
  ...publicationFiles.filter((relativePath) => relativePath !== checksumPath),
]);
exactSet(actualPayloads, new Set(checksums.keys()), 'on-disk repair inventory');

const payloads = new Map();
for (const [relativePath, expectedDigest] of checksums) {
  const info = await lstat(fullPath(relativePath));
  if (!info.isFile() || info.isSymbolicLink()) fail(`checksum target is not a regular file: ${relativePath}`);
  const bytes = await readFile(fullPath(relativePath));
  if (sha256(bytes) !== expectedDigest) fail(`SHA-256 mismatch for ${relativePath}`);
  payloads.set(relativePath, bytes);
}

const parsedJson = new Map();
for (const [relativePath, bytes] of payloads) {
  if (!relativePath.endsWith('.json')) continue;
  try {
    parsedJson.set(relativePath, JSON.parse(bytes.toString('utf8')));
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error.message}`);
  }
}
assert.equal(parsedJson.size, 11, 'expected exactly 11 JSON payloads');

const provenance = parsedJson.get(provenancePath);
const manifest = parsedJson.get(manifestPath);
const replay = parsedJson.get(replayPath);
const transport = parsedJson.get(transportPath);
const certificate = parsedJson.get(certificatePath);
const audit = parsedJson.get(auditPath);
for (const [label, value] of Object.entries({ provenance, manifest, replay, transport, certificate, audit })) {
  assert.ok(value, `${label} JSON is missing`);
}

assert.equal(provenance.schemaVersion, 1);
assert.equal(provenance.reviewUnit, 'spectral-repair');
assert.equal(provenance.module?.id, 'spectral-denominator-repair');
assert.equal(provenance.module?.bodyPath, bodyPath);
assert.equal(provenance.module?.status, 'certified-finite');
assert.equal(provenance.module?.reviewStatus, 'accepted');
assert.equal(provenance.module?.reviewScope, 'internal');
assert.equal(provenance.module?.rhStatus, 'open');
assert.equal(provenance.module?.verification?.reproducibilityStatus, 'current-replay');
assert.match(provenance.module?.claim || '', /sqrt\(161\/10\)/);
assert.match(provenance.module?.historicalFailure || '', /seventh-power sufficient lower surrogate remains failed/);
assert.equal(provenance.cleanOverlayReplay?.sha256, sourceTransport.replaySha256);
assert.equal(provenance.cleanOverlayReplay?.status, 'PASS_COMPLETE_CLEAN_REPAIR_REPRODUCTION');

assert.equal(manifest.schema_version, 1);
assert.equal(manifest.status, 'ACCEPTED_INDEPENDENT_COMPLETE_REPLAY');
assert.equal(manifest.base_package, '../spectral');
assert.equal(manifest.base_case, 'failed');
assert.equal(manifest.base_manifest_sha256, '1b5cc0afddecf88f23074f7b60cc3aa7de707d07d217223d632e745224737303');
assert.equal(manifest.base_replay_helper_sha256, 'f50e72d9cc1d804c4ee00f1e727ebfbab22f8e9299b2d5d2193bbcaa2490d896');
assert.equal(manifest.base_cache_canonical_nontiming_sha256, 'a16c51de67b2d0296ee0689f2201511e29c3a43705a8ab2f277360b66bf00faf');
assert.equal(manifest.runtime?.python_tested, '3.12.14');
assert.equal(manifest.runtime?.python_flint, '0.9.0');
assert.equal(Object.keys(manifest.sources || {}).length, 3, 'expected exactly three new runtime sources');
assert.match(manifest.scope || '', /No odd\/cofinal\/RH result/);

assert.equal(certificate.status, 'PASS');
assert.equal(certificate.X, '161/10');
assert.equal(certificate.lambda, 'sqrt(161/10)');
assert.equal(certificate.dimension, 2049);
assert.equal(certificate.prime_norm_power, 8);
assert.equal(certificate.whole_prime_norm_rational_envelope, '3790593/1000000');
assert.equal(certificate.exact_near_denominator_increase, '0.014520');
assert.equal(certificate.old_far_majorant_reused_unchanged, true);
assert.equal(certificate.rank_one_lift, false);
assert.deepEqual(
  [certificate.core?.dimension, certificate.coefficient_H?.dimension, certificate.whitened_Schur?.dimension],
  [2049, 72, 72],
);
assert.ok(certificate.core?.pass_positive);
assert.ok(certificate.coefficient_H?.pass_positive);
assert.ok(certificate.whitened_Schur?.pass_positive);
assert.match(certificate.scope || '', /failed seventh-power certificate.*remain untouched/i);

assert.equal(audit.status, 'PASS_ACTUAL_COMPLETE_REFLECTION_EVEN_COERCIVITY_THROUGH_SQRT_16_1');
assert.equal(audit.reviewer, 'independent internal mathematical/source audit');
assert.equal(audit.accepted_theorem?.X, '161/10');
assert.equal(audit.accepted_theorem?.lambda_endpoint, 'sqrt(161/10)');
assert.equal(audit.accepted_theorem?.numeric_floor_extracted, false);
assert.equal(audit.repair?.prime_norm_power, 8);
assert.equal(audit.repair?.exact_tail_denominator_lift, '363/25000');
assert.equal(audit.repair?.old_far_H_and_remainder_retained_unchanged, true);
assert.deepEqual(audit.full_replay?.dimensions, [2049, 72, 72]);
assert.equal(audit.full_replay?.every_non_timing_field_identical, true);
for (const forbiddenInference of [
  'numerical physical spectral floor from pivots',
  'odd-sector positivity',
  'cofinal support positivity',
  'RH',
  'actual negativity from the previous failed lower surrogate',
]) {
  assert.ok(audit.not_inferred?.includes(forbiddenInference), `missing non-inference: ${forbiddenInference}`);
}

assert.equal(replay.status, 'PASS_COMPLETE_CLEAN_REPAIR_REPRODUCTION');
assert.equal(replay.manifest_sha256, sourceTransport.manifestSha256);
assert.equal(replay.base_manifest_sha256, manifest.base_manifest_sha256);
assert.equal(replay.python, '3.12.14');
assert.equal(replay.python_flint, '0.9.0');
assert.ok(Math.abs(replay.seconds - 428.85750794410706) < 1e-9, 'clean replay timing drift');
assert.equal(replay.cache?.rows, 10437);
assert.equal(replay.cache?.exact_required_index_set, true);
assert.equal(replay.cache?.canonical_all_rows_sha256, manifest.base_cache_canonical_nontiming_sha256);
assert.equal(replay.complete_gate_fields?.X, '161/10');
assert.equal(replay.complete_gate_fields?.lambda, 'sqrt(161/10)');
assert.equal(replay.complete_gate_fields?.exact_near_denominator_increase, '0.014520');
assert.equal(replay.complete_gate_fields?.old_far_majorant_reused_unchanged, true);
assert.equal(replay.complete_gate_fields?.core?.pass_positive, true);
assert.equal(replay.complete_gate_fields?.coefficient_H?.pass_positive, true);
assert.equal(replay.complete_gate_fields?.whitened_Schur?.pass_positive, true);

assert.equal(transport.status, 'PASS_SOURCE_AND_TRANSPORT_IDENTITY');
assert.equal(transport.complete_clean_overlay_replay_status, replay.status);
assert.equal(transport.complete_clean_overlay_replay_sha256, sourceTransport.replaySha256);
assert.equal(transport.frozen_base_manifest_and_helper_pins_match, true);

const body = payloads.get(bodyPath)?.toString('utf8') || '';
for (const requiredText of [
  'there is a constant \\(c_*>0\\)',
  'failed seventh-power',
  '\\frac{363}{25000}=0.014520',
  '\\frac1{d_{\\rm new,j}}\\le\\frac1{d_{\\rm old,j}}\\le\\omega_{\\rm old,j}',
  'All 2,049 core pivots and both sets of 72 auxiliary pivots are strictly positive',
  'The constant is existential',
  'no odd-sector theorem',
  'proof of RH',
]) {
  assert.ok(body.includes(requiredText), `canonical proof body omitted: ${requiredText}`);
}

console.log(
  'RH spectral repair publication audit: PASS ' +
  `(${checksums.size} files; ${parsedJson.size} JSON; 10437 moments; 2049+72+72 gates; ` +
  'endpoint sqrt(161/10); RH open)',
);
