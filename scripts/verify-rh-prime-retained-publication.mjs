import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicationRoot = 'research/rh/prime-retained-inverse';
const checksumPath = `${publicationRoot}/SHA256SUMS`;
const provenancePath = `${publicationRoot}/SOURCE_PROVENANCE.json`;
const manifestPath = `${publicationRoot}/INTEGRATION_MANIFEST.json`;
const bodyPath = 'research/rh/modules/prime-retained-tail-certificate.md';
const duplicateBodyPath = `${publicationRoot}/prime-retained-tail-certificate.md`;
const independentReceiptPath = `${publicationRoot}/receipts/INDEPENDENT_FULL_GATE.json`;
const sourceRoot = `${publicationRoot}/source-tree`;
const attemptRoot =
  `${sourceRoot}/rh_attack_cycle_20261030/support_endpoint_X165/` +
  'prime_retained_rankone_attempt';
const producerReceiptPath = `${attemptRoot}/PRIME_RETAINED_RANKONE_FULL_GATE.json`;
const completeAuditPath =
  `${attemptRoot}/independent_review/COMPLETE_REPLAY_INDEPENDENT_AUDIT.json`;
const wordingAuditPath =
  `${attemptRoot}/independent_review/FINAL_THEOREM_MODULE_WORDING_AUDIT.json`;
const theoremPath = `${attemptRoot}/THEOREM_ACTUAL_WHOLE_EVEN_X165.md`;
const failedManifestPath =
  `${sourceRoot}/rh_attack_cycle_20261030/support_endpoint_X165/` +
  'BOUNDED_ATTEMPT_TERMINAL_MANIFEST.json';
const moduleDataPath = 'src/data/rh-research/prime-retained-tail-certificate.js';

const sourceTransport = Object.freeze({
  commit: 'a3879a8281c53a160f5789a6c6b3fee1380a0d22',
  tree: 'd5fae555cc4d25283e972a267c593fa91446b5f3',
  parent: '942ba1760c4ef54a519750ab91c37a661c31e0ce',
  branch: 'codex/rh-prime-retained-source-2026-10-30',
  bodySha256: '976652e8e2bf33f02c099ad9b6737e4e3dc410852eedd62ba1c7978c5aea26f5',
  producerSha256: '8fad3f81f08b714052715c368bd6480764f7448347494d36ec50f2d38067406c',
  independentSha256: '774b0121e863088495d1867281824a69f37bd6bdc30a14ddddf6df2096c63dc1',
  failedManifestSha256: 'ac80ae840bc9fb057bc5858c8473aa30b82bb3a0be5693499512d5cb30e8980c',
});

const sha256Pattern = /^[a-f0-9]{64}$/;
const gitObjectPattern = /^[a-f0-9]{40}$/;
const safePathPattern = /^[A-Za-z0-9._/-]+$/;

function fail(message) {
  throw new Error(`RH prime-retained publication audit: ${message}`);
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
    const [, digest, packageRelativePath] = match;
    if (!safeRepositoryPath(packageRelativePath)) fail(`unsafe checksum path: ${packageRelativePath}`);
    const relativePath = `${publicationRoot}/${packageRelativePath}`;
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

function mathematicalFields(value) {
  if (Array.isArray(value)) return value.map(mathematicalFields);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.endsWith('seconds'))
        .map(([key, item]) => [key, mathematicalFields(item)]),
    );
  }
  return value;
}

function collectStrings(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStrings(item, output));
  }
  return output;
}

for (const [label, objectId] of Object.entries({
  commit: sourceTransport.commit,
  tree: sourceTransport.tree,
  parent: sourceTransport.parent,
})) {
  assert.match(objectId, gitObjectPattern, `invalid source ${label}`);
}

const checksumText = await readFile(fullPath(checksumPath), 'utf8');
const checksums = parseChecksums(checksumText);
assert.equal(checksums.size, 57, 'expected exactly 57 checksum-listed package payloads');

for (const [relativePath, expectedDigest] of Object.entries({
  [duplicateBodyPath]: sourceTransport.bodySha256,
  [producerReceiptPath]: sourceTransport.producerSha256,
  [independentReceiptPath]: sourceTransport.independentSha256,
  [failedManifestPath]: sourceTransport.failedManifestSha256,
  [provenancePath]: '26cb2c84ef406f2d8e6bd72922d32475d269c8320d07b06fa84754db5925fad9',
  [manifestPath]: 'f7c63d799b8328aed9ffae176aee89cf7f8cffb4a2528d3f78bca80c0b96e33e',
  [theoremPath]: '26bc2956663cd9baa15eb081285bd5c01a0e4677d676b3c4cc839670e16339f4',
  [completeAuditPath]: 'b861fb13c2cd1b124f0dce1d73fc9b28c20db78afac6ebab8fbbe98babadd979',
  [wordingAuditPath]: 'a056f7524940d9c001ef8315e25ba268980311fd4711aabb0411a47241dcfc39',
  [`${publicationRoot}/verify_source_slice.py`]:
    '653e8ecb74b330298b2743e0be594b8beb5b5a835570b4d062f2ebf7955476f1',
})) {
  assert.match(expectedDigest, sha256Pattern, `invalid pinned hash for ${relativePath}`);
  assert.equal(checksums.get(relativePath), expectedDigest, `pinned hash drift for ${relativePath}`);
}

const publicationFiles = await listFiles(publicationRoot);
exactSet(
  new Set(publicationFiles),
  new Set([checksumPath, ...checksums.keys()]),
  'on-disk prime-retained package inventory',
);

const payloads = new Map();
for (const [relativePath, expectedDigest] of checksums) {
  const info = await lstat(fullPath(relativePath));
  if (!info.isFile() || info.isSymbolicLink()) fail(`checksum target is not a regular file: ${relativePath}`);
  const bytes = await readFile(fullPath(relativePath));
  if (sha256(bytes) !== expectedDigest) fail(`SHA-256 mismatch for ${relativePath}`);
  payloads.set(relativePath, bytes);
}

const canonicalBodyBytes = await readFile(fullPath(bodyPath));
assert.equal(sha256(canonicalBodyBytes), sourceTransport.bodySha256, 'canonical body hash drift');
assert.deepEqual(
  canonicalBodyBytes,
  payloads.get(duplicateBodyPath),
  'canonical and frozen duplicate proof bodies must remain byte-identical',
);

const parsedJson = new Map();
for (const [relativePath, bytes] of payloads) {
  if (!relativePath.endsWith('.json')) continue;
  try {
    parsedJson.set(relativePath, JSON.parse(bytes.toString('utf8')));
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error.message}`);
  }
}

const provenance = parsedJson.get(provenancePath);
const manifest = parsedJson.get(manifestPath);
const producer = parsedJson.get(producerReceiptPath);
const independent = parsedJson.get(independentReceiptPath);
const completeAudit = parsedJson.get(completeAuditPath);
const wordingAudit = parsedJson.get(wordingAuditPath);
const failedManifest = parsedJson.get(failedManifestPath);
for (const [label, value] of Object.entries({
  provenance,
  manifest,
  producer,
  independent,
  completeAudit,
  wordingAudit,
  failedManifest,
})) {
  assert.ok(value, `${label} JSON is missing`);
}

assert.equal(provenance.schemaVersion, 1);
assert.equal(provenance.reviewUnit, 'prime-retained-inverse');
assert.equal(provenance.module?.id, 'prime-retained-tail-certificate');
assert.equal(provenance.module?.bodyPath, bodyPath);
assert.equal(provenance.module?.status, 'certified-finite');
assert.equal(provenance.module?.reviewStatus, 'accepted');
assert.equal(provenance.module?.reviewScope, 'internal');
assert.equal(provenance.module?.rhStatus, 'open');
assert.equal(provenance.module?.verification?.reproducibilityStatus, 'current-replay');
assert.match(provenance.module?.claim || '', /sqrt\(33\/2\)/);
assert.match(provenance.module?.claim || '', /existential positive constant/);
assert.match(provenance.module?.claim || '', /no numerical floor, odd\/cofinal\/RH claim/);
assert.deepEqual(provenance.fixedSettings, {
  X: '33/2',
  N: 2048,
  J: 16384,
  L: 36,
  precisionBits: 1000,
  primeNormPower: 8,
  primeEnvelope: '477513/125000',
  inverseC: '2/25',
  youngEpsilon: '1/4',
});
assert.equal(Object.keys(provenance.sourcePins || {}).length, 19);
assert.equal(provenance.producerReceiptSha256, sourceTransport.producerSha256);
assert.equal(provenance.independentReceiptSha256, sourceTransport.independentSha256);
assert.equal(provenance.oldFailedTerminalSha256, sourceTransport.failedManifestSha256);
assert.equal(provenance.moduleBodyUnchanged, true);
assert.equal(provenance.all19RuntimeSourceDependenciesUnchanged, true);

assert.equal(manifest.status, 'PROPOSED_LOCAL_APP_SLICE_NOT_PUBLISHED');
assert.match(manifest.accepted_result || '', /1<lambda<=sqrt\(33\/2\)/);
assert.match(manifest.constant_scope || '', /Existential positive uniform constant/);
assert.deepEqual(manifest.excluded_claims, ['odd-sector positivity', 'cofinal-support theorem', 'RH']);
assert.equal(manifest.previous_endpoint, 'sqrt(161/10)');
assert.equal(manifest.new_endpoint, 'sqrt(33/2)');
assert.equal(manifest.producer_receipt_sha256, sourceTransport.producerSha256);
assert.equal(manifest.independent_receipt_sha256, sourceTransport.independentSha256);
assert.equal(manifest.old_failed_terminal_sha256, sourceTransport.failedManifestSha256);
assert.equal(manifest.all_19_producer_source_pins_match_staged_copies, true);
assert.equal(manifest.full_replay_completed_in_original_isolated_tree, true);
assert.match(manifest.math_field_comparison || '', /2049\/72\/72 positive pivots/);
assert.match(manifest.provenance_runtime || '', /115 independently copied python-flint runtime files unchanged/);
assert.match(manifest.history || '', /failed diagonal-only comparison/);
assert.equal(manifest.files?.length, 50, 'expected 50 staged evidence/source records');
assert.equal(manifest.module_sha256, sourceTransport.bodySha256);
assert.equal(manifest.frozen_package_verification_command, 'python verify_source_slice.py');

for (const receipt of [producer, independent]) {
  assert.equal(receipt.status, 'PASS');
  assert.equal(receipt.test_kind, 'COMPLETE_FULL_EVEN_TEST');
  assert.equal(receipt.X, '33/2');
  assert.deepEqual(
    [receipt.N, receipt.J, receipt.L, receipt.precision_bits],
    [2048, 16384, 36, 1000],
  );
  assert.equal(receipt.inverse_c, '2/25');
  assert.equal(receipt.young_epsilon, '1/4');
  assert.equal(receipt.positive_rank_one_tail_inverse_correction, true);
  assert.equal(receipt.rank_one_lift, false);
  assert.equal(receipt.all_sources_unchanged, true);
  assert.equal(Object.keys(receipt.source_sha256_before || {}).length, 19);
  assert.deepEqual(receipt.source_sha256_before, receipt.source_sha256_after);
  assert.deepEqual(
    [receipt.core?.dimension, receipt.coefficient_H?.dimension, receipt.whitened_Schur?.dimension],
    [2049, 72, 72],
  );
  assert.equal(receipt.core?.pass_positive, true);
  assert.equal(receipt.coefficient_H?.pass_positive, true);
  assert.equal(receipt.whitened_Schur?.pass_positive, true);
  assert.match(receipt.scope || '', /No odd\/cofinal\/RH claim/);
}
assert.deepEqual(
  mathematicalFields(producer),
  mathematicalFields(independent),
  'producer and independent replay mathematical fields drifted',
);
assert.deepEqual(producer.source_sha256_before, provenance.sourcePins);

assert.equal(completeAudit.status, 'PASS_COMPLETE_ISOLATED_REPLAY_AND_ANALYTIC_AUDIT');
assert.equal(completeAudit.X, '33/2');
assert.equal(completeAudit.lambda, 'sqrt(33/2)');
assert.equal(completeAudit.dimension, 2049);
assert.equal(completeAudit.all_2049_core_72_H_72_Schur_pivots_positive, true);
assert.equal(completeAudit.all_non_timing_receipt_fields_identical, true);
assert.equal(completeAudit.all_19_source_files_unchanged_in_both_trees, true);
assert.equal(completeAudit.all_115_runtime_files_unchanged_in_both_trees, true);
assert.equal(completeAudit.producer_receipt_sha256, sourceTransport.producerSha256);
assert.equal(completeAudit.independent_receipt_sha256, sourceTransport.independentSha256);

assert.equal(wordingAudit.status, 'PASS_FINAL_THEOREM_AND_MODULE_WORDING_REVIEW');
for (const key of [
  'theorem_and_staged_copy_identical',
  'actual_form_and_natural_logarithmic_domain_valid',
  'complex_reflection_even_and_constant_mode_quantifiers_valid',
  'existential_positive_delta_from_bounded_schur_factorization_valid',
  'same_delta_inherited_on_all_nested_smaller_centered_supports',
  'no_pivot_as_eigenvalue_floor',
  'no_odd_cofinal_or_RH_overclaim',
  'internal_review_not_peer_or_formal_acceptance_explicit',
  'all_nontiming_producer_replay_fields_identical',
]) {
  assert.equal(wordingAudit[key], true, `wording audit drift: ${key}`);
}
assert.equal(wordingAudit.driver_dependencies_unchanged, 19);
assert.equal(wordingAudit.numerical_producer_runs_performed_for_this_wording_audit, 0);

assert.match(failedManifest.status || '', /FAILED_CORE_AND_EXACT_DIRECTIONAL_OBSTRUCTION/);
assert.equal(failedManifest.X, '33/2');
assert.equal(failedManifest.new_endpoint_accepted, false);
assert.match(failedManifest.scope || '', /no actual negativity or odd\/cofinal\/global RH conclusion/);

const canonicalBody = canonicalBodyBytes.toString('utf8');
for (const requiredText of [
  '1<\\lambda\\le\\sqrt{33/2}',
  'D\\ge d+B',
  'D^{-1}\\le d^{-1}-\\frac{2}{25}d^{-1}Bd^{-1}',
  'Y^*B_{nn}Y\\ge ee^*/E_0',
  'All 2,049 pivots positive',
  'All 72 pivots positive',
  'existential',
  'earlier diagonal-inverse comparison',
  'This did not prove actual negative',
  'No odd-sector or',
  'RH is not proved',
]) {
  assert.ok(canonicalBody.includes(requiredText), `canonical proof body omitted: ${requiredText}`);
}

const moduleUrl = pathToFileURL(fullPath(moduleDataPath));
const { PRIME_RETAINED_TAIL_CERTIFICATE: module } = await import(moduleUrl.href);
assert.ok(module, 'structured app module export is missing');
assert.equal(module.id, 'prime-retained-tail-certificate');
assert.equal(module.route, '/rh-prime-retained-tail-certificate');
assert.equal(module.bodyPath, bodyPath);
assert.equal(module.status, 'certified-finite');
assert.equal(module.reviewStatus, 'accepted');
assert.equal(module.reviewScope, 'internal');
assert.equal(module.rhStatus, 'open');
assert.equal(module.verification?.reproducibilityStatus, 'current-replay');
assert.ok(
  module.provenance?.sourceRefs?.some((source) =>
    source.branch === sourceTransport.branch && source.commit === sourceTransport.commit),
  'module provenance must pin the exact source branch and commit',
);
assert.ok(
  module.verification?.artifacts?.some((artifact) =>
    artifact.path === producerReceiptPath && artifact.sha256 === sourceTransport.producerSha256),
  'module must pin the producer receipt',
);
assert.ok(
  module.verification?.artifacts?.some((artifact) =>
    artifact.path === independentReceiptPath && artifact.sha256 === sourceTransport.independentSha256),
  'module must pin the independent receipt',
);
assert.ok(module.verification?.replays?.length >= 1, 'module must expose independent replay evidence');
assert.ok(module.failures?.length >= 1, 'module must retain the failed comparison route');
const failedRoute = module.failures.find((failure) =>
  /diagonal|inverse|comparison/i.test(`${failure.title} ${failure.surrogate}`));
assert.ok(failedRoute, 'failed diagonal-inverse comparison is missing from structured data');
assert.match(failedRoute.implication || '', /surrogate|lower bound/i);
for (const nonImplication of [
  /actual.*negative|negative.*actual|actual.*negativity/i,
  /RH/i,
]) {
  assert.ok(
    failedRoute.nonImplications?.some((item) => nonImplication.test(item)),
    `failed-route boundary is missing: ${nonImplication}`,
  );
}

const structuredText = collectStrings(module).join('\n');
for (const requiredPattern of [
  /sqrt(?:\{|\()33\/2(?:\}|\))/,
  /existential/i,
  /D\\ge d\+B/,
  /2\}\{25\}|2\/25/,
  /2049|2,049/,
  /72/,
  /rank-one/i,
  /no numerical value|not.*eigenvalue floor|no numerical.*floor/i,
  /odd-sector|odd sector/i,
  /cofinal/i,
  /RH/,
]) {
  assert.match(structuredText, requiredPattern, `structured module omitted ${requiredPattern}`);
}

console.log(
  'RH prime-retained publication audit: PASS ' +
  `(${checksums.size} package files; 19 sources; 2049+72+72 gates; ` +
  'endpoint sqrt(33/2); existential whole-even floor; RH open)',
);
