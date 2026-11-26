import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicationRoot = 'research/rh/signed-complement';
const checksumPath = `${publicationRoot}/PUBLICATION_SHA256SUMS`;
const provenancePath = `${publicationRoot}/SOURCE_PROVENANCE.json`;
const dependencyPath = `${publicationRoot}/ANALYTIC_DEPENDENCIES.md`;
const bodyPath = 'research/rh/modules/signed-complement.md';
const bodyDigest = '66d2a804f9721080b0faf4e323fa09b030a9a4c06d5598e2cc43b6937cb20174';
const sourceStagingCommit = 'e37bb8e670572e22993206ab17df6579611c5436';
const sourceStagingTree = 'c5ba88842295c29c27f024b1ea19200c751d007e';
const sha256Pattern = /^[a-f0-9]{64}$/;
const gitObjectPattern = /^[a-f0-9]{40}$/;
const safePathPattern = /^[A-Za-z0-9._/-]+$/;

const mappings = Object.freeze([
  {
    originalPath: 'rh_attack_cycle_20261030/gamma_complement_attack/BANDLIMITED_ZETA_PACKETS_REFUTE_FOUR_M_GATE.md',
    originalSha256: 'b1196415a51cd8e4eeb3308837eae34a5b9ad68fe6b84e59ca08b5ec31a7dce9',
    publishedPath: `${publicationRoot}/source-tree/rh_attack_cycle_20261030/gamma_complement_attack/BANDLIMITED_ZETA_PACKETS_REFUTE_FOUR_M_GATE.md`,
    publishedSha256: 'fdb99d965d4b24f117afc15f8765ab8564ddfb86ae10516d0ceeeae01375c178',
  },
  {
    originalPath: 'rh_attack_cycle_20261030/independent_review/BANDLIMITED_ZETA_PACKET_GATE_REFUTATION_AUDIT.md',
    originalSha256: '24a7957b5a4061fb055676c19eba855585a941be58cbbab3ea36bb3b80056adb',
    publishedPath: `${publicationRoot}/source-tree/rh_attack_cycle_20261030/independent_review/BANDLIMITED_ZETA_PACKET_GATE_REFUTATION_AUDIT.md`,
    publishedSha256: '7a8b7d7b9cd87a235aafd27e2cd105475865d739f215a21865652c9068084c99',
  },
  {
    originalPath: 'rh_attack_cycle_20261030/gamma_complement_attack/ZETA_PACKET_TO_ACTUAL_POSITIVE_HEAD_PROJECTION.md',
    originalSha256: 'eefbfb43b9cd1cdc45cc7b221f84fbec6e4ac7c10326701f31ac60d0e26ea026',
    publishedPath: `${publicationRoot}/source-tree/rh_attack_cycle_20261030/gamma_complement_attack/ZETA_PACKET_TO_ACTUAL_POSITIVE_HEAD_PROJECTION.md`,
    publishedSha256: '07cc5553b73140d01604f2e0bad12fcb6789600ab1a995bd6eda4c4085a1c5e4',
  },
  {
    originalPath: 'rh_attack_cycle_20261030/independent_review/ZETA_PACKET_ACTUAL_HEAD_PROJECTION_AUDIT.md',
    originalSha256: '7c49891b42623dc923cc71573698f5dd4423c2eef00154908efa8d18c298145f',
    publishedPath: `${publicationRoot}/source-tree/rh_attack_cycle_20261030/independent_review/ZETA_PACKET_ACTUAL_HEAD_PROJECTION_AUDIT.md`,
    publishedSha256: '414fad7b679524cab7fa8baf41691e7a55c2c5df581d763f829f910af590493d',
  },
  {
    originalPath: 'rh_attack_cycle_20261030/gamma_complement_attack/EXACT_PHYSICAL_ADJOINT_AND_NARROW_RESIDUE_SAFE_SECTOR.md',
    originalSha256: '0328e708b96e38eba3d843b4a2f269c7ce2c899731952ed6b9ca97f9cac0ea23',
    publishedPath: `${publicationRoot}/source-tree/rh_attack_cycle_20261030/gamma_complement_attack/EXACT_PHYSICAL_ADJOINT_AND_NARROW_RESIDUE_SAFE_SECTOR.md`,
    publishedSha256: '94d3b9f59834ad3a12950bc5575f0722dd33f00faac629d91c1d3037f12a6bd6',
  },
  {
    originalPath: 'rh_attack_cycle_20261030/independent_review/NARROW_LOBE_TRUE_PHYSICAL_COMPLEMENT_AUDIT.md',
    originalSha256: '3a8d97d42baa55b06e808070869e235f613d7c742caa1689a7ea6531ae32a5b4',
    publishedPath: `${publicationRoot}/source-tree/rh_attack_cycle_20261030/independent_review/NARROW_LOBE_TRUE_PHYSICAL_COMPLEMENT_AUDIT.md`,
    publishedSha256: '7f1c2afd0867056defc6990b115601e7eacc25898ed4809de8ab68154669f5ac',
  },
  {
    originalPath: 'rh_attack_cycle_20261030/weil_radical_tail_attack/CRITICAL_POWER_FOUR_LOG_TUNED_ACTUAL_ACTION_HEAD.md',
    originalSha256: '44599cd2bc804f2387d009506f70ac957ad4643ff45017b00ce9862dc4cf00a1',
    publishedPath: `${publicationRoot}/source-tree/rh_attack_cycle_20261030/weil_radical_tail_attack/CRITICAL_POWER_FOUR_LOG_TUNED_ACTUAL_ACTION_HEAD.md`,
    publishedSha256: 'a7a9854ca9c402821fbccde6aaa7767b734261ca0d2540aa42e8bb664e228636',
  },
  {
    originalPath: 'rh_attack_cycle_20261030/independent_review/CRITICAL_POWER_FOUR_ACTION_HEAD_AUDIT.md',
    originalSha256: '4bcc529f29174dcc08217c1a5de7d1712ffca1f060910eff2a7ca456b9861ac9',
    publishedPath: `${publicationRoot}/source-tree/rh_attack_cycle_20261030/independent_review/CRITICAL_POWER_FOUR_ACTION_HEAD_AUDIT.md`,
    publishedSha256: 'a81b909f45b076a0bbd8daa4b1ec8f97c377e6ec8a889d42ff928a1ed6c78961',
  },
]);

const unbundledDependencies = Object.freeze([
  ['TRACE_REPAIRS_AT_BANDWIDTH_SCALE_AND_FULL_DEEP_HEAD_ACTION.md', 'b1440ac746cdc6819010735b74bc78b55d44a24b82f32897c76129f3215bd1f6'],
  ['SHARP_SOURCE_POISSON_AND_ALL_HEAD_COORDINATE_CLOSURE.md', 'fe914fb77a89eeddf77ccc2a425f2653307a15ff84c6fe8640819ac19d2b7faa'],
  ['POLYNOMIAL_DEFICIT_WEIL_HEAD_ENERGY_TRANSFER.md', '120b7cec1e421b8dae7e63061460b9ccd6499f1958d388b27cdfad12df66c4c4'],
  ['EXACT_RADICAL_WINDOW_IDENTITY_AND_TWO_TAIL_BRIDGE.md', '788280061df1d3acd494b47a95d85280b8a4646f79237ed5d4edcf7b8f421430'],
  ['CARLEMAN_TAIL_TO_WINDOW_WEIL_ACTION_TRANSFER.md', 'fc903d4c2afebe561323ecf085661a1fadd6c854f1f284e4722434da40598bb1'],
  ['ADDITIVE_THRESHOLD_ENDPOINT_NULL_VALUE_FRAME.md', '62cff67c897596caf6dfab6f8b09a1e71975aafe6ff643f33aec6ff2fe794b4c'],
  ['MEAN_ZERO_ORIGIN_TRACE_AND_MOBIUS_POLE_ABSORPTION.md', 'ab05993feef16a0dc83ea024e051ee19cf87b5fe77308148f138a61b7ecae5fc'],
  ['EXACT_COMPLEMENT_AND_NESTED_FRAME_CROWDING.md', '52aee3c3d81d743f86c3b86ac3a25d93b6c87aa7742b0ba9551f4feba08cf236'],
]);

const expectedPaths = new Set([
  bodyPath,
  provenancePath,
  dependencyPath,
  ...mappings.map((mapping) => mapping.publishedPath),
]);

function fail(message) {
  throw new Error(`RH signed-complement publication audit: ${message}`);
}

function isSafeRepositoryPath(relativePath) {
  return typeof relativePath === 'string' &&
    relativePath.length > 0 &&
    safePathPattern.test(relativePath) &&
    !relativePath.includes('\\') &&
    !path.posix.isAbsolute(relativePath) &&
    path.posix.normalize(relativePath) === relativePath &&
    !relativePath.split('/').some((part) => part === '.' || part === '..');
}

function fullPath(relativePath) {
  if (!isSafeRepositoryPath(relativePath)) fail(`unsafe repository path: ${relativePath}`);
  const resolved = path.resolve(repositoryRoot, relativePath);
  if (!resolved.startsWith(`${repositoryRoot}${path.sep}`)) {
    fail(`path escapes repository root: ${relativePath}`);
  }
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
      if (entry.isSymbolicLink()) fail(`symbolic links are not allowed: ${child}`);
      if (entry.isDirectory()) await visit(child);
      else if (entry.isFile()) output.push(child);
      else fail(`unsupported filesystem entry: ${child}`);
    }
  }
  await visit(relativeDirectory);
  return output;
}

function parseChecksumManifest(text) {
  if (text.includes('\r')) fail('checksum manifest must use LF line endings');
  if (!text.endsWith('\n')) fail('checksum manifest must end with one newline');
  const lines = text.slice(0, -1).split('\n');
  if (!lines.length || lines.some((line) => !line)) fail('checksum manifest contains an empty line');
  const entries = new Map();
  for (const [index, line] of lines.entries()) {
    const match = /^([a-f0-9]{64})  ([A-Za-z0-9._/-]+)$/.exec(line);
    if (!match) fail(`malformed checksum line ${index + 1}`);
    const [, digest, relativePath] = match;
    if (!isSafeRepositoryPath(relativePath)) fail(`unsafe checksum path: ${relativePath}`);
    if (relativePath === checksumPath) fail('checksum manifest cannot list itself');
    if (entries.has(relativePath)) fail(`duplicate checksum path: ${relativePath}`);
    entries.set(relativePath, digest);
  }
  return entries;
}

function requireDigest(entries, relativePath, digest) {
  assert.match(digest || '', sha256Pattern, `invalid SHA-256 for ${relativePath}`);
  if (entries.get(relativePath) !== digest) {
    fail(`manifest/provenance digest mismatch for ${relativePath}`);
  }
}

assert.match(sourceStagingCommit, gitObjectPattern, 'invalid source-staging commit');
assert.match(sourceStagingTree, gitObjectPattern, 'invalid source-staging tree');

const manifestText = await readFile(fullPath(checksumPath), 'utf8');
const checksums = parseChecksumManifest(manifestText);
assert.equal(checksums.size, 11, 'expected exactly eleven signed-complement publication files');
assert.deepEqual(new Set(checksums.keys()), expectedPaths, 'signed-complement manifest inventory drift');

const publicationFiles = await listFiles(publicationRoot);
const expectedPublicationFiles = new Set(
  [...expectedPaths].filter((entry) => entry.startsWith(`${publicationRoot}/`)),
);
expectedPublicationFiles.add(checksumPath);
assert.deepEqual(new Set(publicationFiles), expectedPublicationFiles,
  'signed-complement publication directory has missing or unmanifested files');

for (const [relativePath, expectedDigest] of checksums) {
  const info = await lstat(fullPath(relativePath));
  if (info.isSymbolicLink()) fail(`checksum target cannot be a symbolic link: ${relativePath}`);
  if (!info.isFile()) fail(`checksum target is not a regular file: ${relativePath}`);
  const bytes = await readFile(fullPath(relativePath));
  if (sha256(bytes) !== expectedDigest) fail(`SHA-256 mismatch for ${relativePath}`);
}

const [provenance, dependencyText, bodyBytes] = await Promise.all([
  readFile(fullPath(provenancePath), 'utf8').then(JSON.parse),
  readFile(fullPath(dependencyPath), 'utf8'),
  readFile(fullPath(bodyPath)),
]);

assert.equal(bodyBytes.length, 9350, 'canonical signed-complement body byte length drift');
assert.equal(sha256(bodyBytes), bodyDigest, 'canonical body SHA-256 drift');
assert.equal(provenance.schemaVersion, 1, 'unexpected provenance schema');
assert.equal(provenance.reviewUnit, 'signed-complement', 'unexpected review unit');
assert.equal(provenance.module?.id, 'signed-complement');
assert.equal(provenance.module?.bodyPath, bodyPath);
assert.equal(provenance.module?.status, 'proved-identity');
assert.equal(provenance.module?.reviewStatus, 'accepted');
assert.equal(provenance.module?.reviewScope, 'internal');
assert.equal(provenance.module?.rhStatus, 'open');
assert.equal(provenance.module?.reproducibilityStatus, 'partial');
assert.equal(provenance.module?.verification?.reproducibilityStatus, 'partial');
assert.equal(provenance.module?.verification?.dependencyInventory, dependencyPath);
assert.match(provenance.module?.verification?.scope || '', /no numerical replay is applicable/i);
assert.match(provenance.module?.verification?.scope || '', /not bundled/i);
assert.equal(provenance.bodySha256, bodyDigest);
assert.equal(provenance.bodyRevision?.publishedSha256, bodyDigest);
requireDigest(checksums, bodyPath, provenance.bodySha256);

const expectedClaims = new Map([
  ['strong-4M-cap', 'failed-surrogate'],
  ['actual-head-projection', 'proved-identity'],
  ['restricted-complement-sector', 'proved-identity'],
  ['whole-complement', 'open'],
]);
assert.equal(provenance.module?.claims?.length, expectedClaims.size, 'claim inventory drift');
for (const claim of provenance.module.claims) {
  if (!expectedClaims.has(claim.id)) fail(`unexpected or duplicate claim: ${claim.id}`);
  assert.equal(claim.status, expectedClaims.get(claim.id), `claim status drift: ${claim.id}`);
  expectedClaims.delete(claim.id);
}
assert.equal(expectedClaims.size, 0, 'one or more required claims are missing');

assert.equal(provenance.sourceMappings?.length, mappings.length, 'source mapping count drift');
for (const expected of mappings) {
  const actual = provenance.sourceMappings.find((mapping) => mapping.publishedPath === expected.publishedPath);
  assert.ok(actual, `missing source mapping: ${expected.publishedPath}`);
  for (const key of ['originalPath', 'originalSha256', 'publishedPath', 'publishedSha256']) {
    assert.equal(actual[key], expected[key], `source mapping ${key} drift: ${expected.publishedPath}`);
  }
  assert.match(actual.transformation || '', /Retained all mathematical sections/,
    `source mapping transformation drift: ${expected.publishedPath}`);
  requireDigest(checksums, expected.publishedPath, expected.publishedSha256);
}

assert.deepEqual(provenance.excludedPending, [
  'FINITE_MOBIUS_INVERSE_COST_SURVIVES_HEAD_REMOVAL.md',
  'SELFDUAL_EXTERIOR_MINIMUM_AND_WEIGHTED_CHARGE_PORTS.md',
], 'excluded-pending inventory drift');
assert.ok(provenance.limits.includes('No RH or new global zero-free region'));
assert.ok(provenance.limits.includes('No external peer review or formal verification'));
assert.ok(provenance.limits.includes('No extension of finite whole-even endpoint'));
assert.ok(provenance.limits.includes('No source positivity inferred from physical small L2 error'));

assert.match(dependencyText, /partial analytic proof-tree availability/i);
assert.match(dependencyText, /No numerical replay is applicable/i);
assert.match(dependencyText, /do not constitute the complete transitive proof tree/i);
assert.match(dependencyText, /separately curated spectral-head theory module is needed/i);
assert.match(dependencyText, /finite `X = 16001\/1000` replay does not depend/i);
const missingMarkers = dependencyText.match(/Availability in this unit: not bundled;/g) || [];
assert.equal(missingMarkers.length, unbundledDependencies.length,
  'expected exactly eight explicitly unbundled immediate dependencies');
for (const [filename, digest] of unbundledDependencies) {
  assert.match(digest, sha256Pattern);
  assert.ok(dependencyText.includes(filename), `dependency inventory omitted ${filename}`);
  assert.ok(dependencyText.includes(digest), `dependency inventory omitted hash for ${filename}`);
  assert.ok(![...checksums.keys()].some((entry) => entry.endsWith(`/${filename}`)),
    `unbundled dependency was silently added to the manifest: ${filename}`);
}

console.log(
  `RH signed-complement publication audit: PASS (${checksums.size} files; ` +
  `${mappings.length} mapped sources; ${unbundledDependencies.length} dependencies explicitly unbundled; ` +
  `source ${sourceStagingCommit.slice(0, 12)} tree ${sourceStagingTree.slice(0, 12)})`,
);
