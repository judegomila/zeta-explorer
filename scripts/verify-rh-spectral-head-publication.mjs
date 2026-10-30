import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicationRoot = 'research/rh/spectral-head';
const sourceTreeRoot = `${publicationRoot}/source-tree`;
const checksumPath = `${publicationRoot}/PUBLICATION_SHA256SUMS`;
const provenancePath = `${publicationRoot}/SOURCE_PROVENANCE.json`;
const inventoryPath = `${publicationRoot}/DEPENDENCY_INVENTORY.json`;
const readmePath = `${publicationRoot}/README.md`;
const bodyPath = 'research/rh/modules/spectral-head-theory.md';

const sourceStagingCommit = 'ce6ab5bfd3329dabc1b4effeafecd63c79c617ff';
const sourceStagingTree = 'f88adb2e1d9a1549ae5c22da5837e0f0d4636c5f';
const expectedManifestDigest = '1a625c474e5267b2dc994c35ce20e00f856b23c6fee174d0dc7c8c73c0fde01f';
const expectedDigests = Object.freeze({
  [bodyPath]: '4f2ae023c08d8b5aad261f7e63d088ed0dfc4abbbb2d905cfe14a5bc27370247',
  [inventoryPath]: 'e37d720c68f81af7ee25784ae6914c8a96670361aa2b9278353897b785f8804d',
  [readmePath]: '508ec208d43ccb3ee82f9ad891c0e1a22e9ed1bdea99264032473e6e1bbccd96',
  [provenancePath]: '89716e9874921c109c44df5ac5b271eb677ab4fb4bffb0449c6d3be723cd6c13',
});
const expectedOriginalBodyDigest = '602b553e3ea558edb843d15eeefcb09b2bb780b8d34bb4b6ce6656d2c6a657a8';
const expectedOriginalInventoryDigest = 'fd6d600948a74af6bff7366d8cb80d4a86d4903d9b97f1e8c51a65446b09c99e';

const sha256Pattern = /^[a-f0-9]{64}$/;
const gitObjectPattern = /^[a-f0-9]{40}$/;
const safePathPattern = /^[A-Za-z0-9._/-]+$/;

const expectedDag = Object.freeze({
  positive_head: { layer: 'current_deep_lemma_foundation', dependsOn: [] },
  visible_main: { layer: 'current_deep_lemma_foundation', dependsOn: ['positive_head'] },
  strong_edge: { layer: 'current_deep_lemma_foundation', dependsOn: [] },
  weak_head: { layer: 'current_deep_lemma_foundation', dependsOn: ['strong_edge'] },
  finite_channel: { layer: 'current_deep_lemma_foundation', dependsOn: [] },
  collar_tail: {
    layer: 'current_deep_lemma_foundation',
    dependsOn: ['weak_head', 'finite_channel'],
  },
  reciprocal: { layer: 'current_deep_lemma_foundation', dependsOn: ['positive_head'] },
  hardy_gram: {
    layer: 'current_deep_lemma_foundation',
    dependsOn: ['weak_head', 'finite_channel', 'collar_tail', 'reciprocal', 'visible_main'],
  },
  all_head_gram: {
    layer: 'current_result_chain',
    dependsOn: ['hardy_gram', 'collar_tail', 'reciprocal', 'visible_main'],
  },
  threshold_range: { layer: 'current_deep_lemma_foundation', dependsOn: [] },
  action_strip: {
    layer: 'current_result_chain',
    dependsOn: ['threshold_range', 'positive_head'],
  },
  endpoint_leakage: { layer: 'current_result_chain', dependsOn: [] },
  divided_difference: {
    layer: 'current_result_chain',
    dependsOn: ['threshold_range', 'positive_head'],
  },
  restricted_row: {
    layer: 'current_result_chain',
    dependsOn: ['action_strip', 'endpoint_leakage', 'divided_difference'],
  },
  radical_domain: { layer: 'current_result_chain', dependsOn: [] },
  action_transfer: { layer: 'current_result_chain', dependsOn: ['radical_domain'] },
  full_trace_repair: {
    layer: 'current_result_chain',
    dependsOn: [
      'all_head_gram',
      'restricted_row',
      'divided_difference',
      'radical_domain',
      'action_transfer',
    ],
  },
  critical_cutoff: {
    layer: 'current_result_chain',
    dependsOn: ['full_trace_repair', 'action_strip', 'endpoint_leakage', 'positive_head'],
  },
});

function fail(message) {
  throw new Error(`RH spectral-head publication audit: ${message}`);
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

async function assertNoSymlinkComponents(relativePath) {
  let current = repositoryRoot;
  for (const component of relativePath.split('/')) {
    current = path.join(current, component);
    const info = await lstat(current);
    if (info.isSymbolicLink()) fail(`symbolic links are not allowed in publication data: ${relativePath}`);
  }
}

async function listFiles(relativeDirectory) {
  await assertNoSymlinkComponents(relativeDirectory);
  const rootInfo = await lstat(fullPath(relativeDirectory));
  if (!rootInfo.isDirectory()) fail(`publication root is not a directory: ${relativeDirectory}`);

  const output = [];
  async function visit(relativePath) {
    const entries = await readdir(fullPath(relativePath), { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const child = path.posix.join(relativePath, entry.name);
      if (entry.isSymbolicLink()) fail(`symbolic links are not allowed in publication data: ${child}`);
      if (entry.isDirectory()) await visit(child);
      else if (entry.isFile()) output.push(child);
      else fail(`unsupported filesystem entry in publication data: ${child}`);
    }
  }
  await visit(relativeDirectory);
  return output;
}

function parseChecksumManifest(text) {
  if (text.includes('\r')) fail('checksum manifest must use LF line endings');
  if (!text.endsWith('\n')) fail('checksum manifest must end with one newline');
  const lines = text.slice(0, -1).split('\n');
  if (lines.length !== 58) fail(`checksum manifest must contain exactly 58 entries, found ${lines.length}`);
  if (lines.some((line) => line.length === 0)) fail('checksum manifest contains an empty line');

  const entries = new Map();
  let previousPath = '';
  for (const [index, line] of lines.entries()) {
    const match = /^([a-f0-9]{64})  ([A-Za-z0-9._/-]+)$/.exec(line);
    if (!match) fail(`malformed checksum line ${index + 1}`);
    const [, digest, relativePath] = match;
    if (!isSafeRepositoryPath(relativePath)) fail(`unsafe path on checksum line ${index + 1}`);
    if (relativePath === checksumPath) fail('checksum manifest cannot list itself');
    if (entries.has(relativePath)) fail(`duplicate checksum path: ${relativePath}`);
    if (previousPath && previousPath >= relativePath) {
      fail(`checksum paths are not strictly sorted at line ${index + 1}`);
    }
    entries.set(relativePath, digest);
    previousPath = relativePath;
  }
  return entries;
}

function parseJson(text, label) {
  if (text.startsWith('\uFEFF')) fail(`${label} must not start with a byte-order mark`);
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function requireDigest(entries, relativePath, expectedDigest) {
  if (!sha256Pattern.test(expectedDigest || '')) fail(`invalid expected SHA-256 for ${relativePath}`);
  if (entries.get(relativePath) !== expectedDigest) {
    fail(`manifest/provenance digest mismatch for ${relativePath}`);
  }
}

function assertSameSet(actual, expected, message) {
  assert.deepEqual(new Set(actual), new Set(expected), message);
}

function requireTextIncludes(text, fragment, label) {
  assert.ok(text.includes(fragment), `${label} missing required boundary: ${fragment}`);
}

function transitiveDependencies(start, dependenciesById) {
  const seen = new Set();
  function visit(id, stack) {
    if (stack.has(id)) fail(`dependency cycle detected through ${id}`);
    if (seen.has(id)) return;
    seen.add(id);
    const nextStack = new Set(stack).add(id);
    for (const dependency of dependenciesById.get(id) || []) visit(dependency, nextStack);
  }
  visit(start, new Set());
  return seen;
}

assert.equal(sourceStagingCommit, 'ce6ab5bfd3329dabc1b4effeafecd63c79c617ff');
assert.equal(sourceStagingTree, 'f88adb2e1d9a1549ae5c22da5837e0f0d4636c5f');
assert.match(sourceStagingCommit, gitObjectPattern, 'invalid source-staging commit');
assert.match(sourceStagingTree, gitObjectPattern, 'invalid source-staging tree');

const manifestBytes = await readFile(fullPath(checksumPath));
assert.equal(sha256(manifestBytes), expectedManifestDigest, 'publication checksum manifest drift');
const checksums = parseChecksumManifest(manifestBytes.toString('utf8'));

const [provenanceText, inventoryText, readmeText, bodyText] = await Promise.all([
  readFile(fullPath(provenancePath), 'utf8'),
  readFile(fullPath(inventoryPath), 'utf8'),
  readFile(fullPath(readmePath), 'utf8'),
  readFile(fullPath(bodyPath), 'utf8'),
]);
const provenance = parseJson(provenanceText, provenancePath);
const inventory = parseJson(inventoryText, inventoryPath);

for (const [relativePath, expectedDigest] of Object.entries(expectedDigests)) {
  requireDigest(checksums, relativePath, expectedDigest);
}

assert.equal(provenance.schemaVersion, 1, 'unexpected source-provenance schema');
assert.equal(provenance.reviewUnit, 'spectral-head', 'unexpected provenance review unit');
assert.equal(provenance.module?.id, 'spectral-head-theory', 'module id drift');
assert.equal(provenance.module?.bodyPath, bodyPath, 'module body path drift');
assert.equal(provenance.module?.status, 'proved-identity', 'module status drift');
assert.equal(provenance.module?.reviewStatus, 'accepted', 'module review status drift');
assert.equal(provenance.module?.reviewScope, 'internal', 'module review scope drift');
assert.equal(provenance.module?.rhStatus, 'open', 'module RH status drift');
assert.equal(
  provenance.module?.verification?.reproducibilityStatus,
  'partial',
  'module reproducibility scope drift',
);
assert.match(
  provenance.module?.verification?.scope || '',
  /No executable replay, effective onset or formal verification\./,
  'module analytic-availability boundary drift',
);

assert.equal(provenance.bodyMapping?.originalPath, 'staging/spectral-head-theory.md');
assert.equal(provenance.bodyMapping?.originalSha256, expectedOriginalBodyDigest);
assert.equal(provenance.bodyMapping?.publishedPath, bodyPath);
assert.equal(provenance.bodyMapping?.publishedSha256, expectedDigests[bodyPath]);
assert.match(provenance.bodyMapping?.transformation || '', /No strengthening of theorem\./);
assert.equal(provenance.dependencyInventory?.path, inventoryPath);
assert.equal(provenance.dependencyInventory?.sha256, expectedDigests[inventoryPath]);

const expectedClaims = new Map([
  ['actual-near-null-head', 'proved-identity'],
  ['head-rank-and-physical-bridge', 'proved-identity'],
  ['whole-complement', 'open'],
]);
assert.equal(provenance.module?.claims?.length, expectedClaims.size, 'claim inventory drift');
for (const claim of provenance.module.claims) {
  const expectedStatus = expectedClaims.get(claim.id);
  if (!expectedStatus) fail(`unexpected or duplicate provenance claim: ${claim.id}`);
  assert.equal(claim.status, expectedStatus, `claim status drift for ${claim.id}`);
  assert.equal(typeof claim.scope, 'string', `claim scope missing for ${claim.id}`);
  expectedClaims.delete(claim.id);
}
assert.equal(expectedClaims.size, 0, 'one or more provenance claims are missing');
assert.match(
  provenance.module.claims.find((claim) => claim.id === 'whole-complement').scope,
  /No whole-complement floor.*RH theorem\./,
  'whole-complement open boundary drift',
);

assert.equal(
  provenance.externalSourceCheck?.source,
  'Karnik–Romberg–Davenport, arXiv:2006.00427v2, Corollaries3–4',
  'KRD source citation drift',
);
assert.equal(provenance.externalSourceCheck?.url, 'https://arxiv.org/html/2006.00427v2');
assert.equal(
  provenance.externalSourceCheck?.checkedClaim,
  'Concentration prefix constant beta=(2/pi^2)log(200lambda^2+25) under c=2pi lambda^2, with lower prefix shift7 and deficit prefactor10.',
  'KRD checked-claim drift',
);
assert.equal(
  provenance.externalSourceCheck?.scope,
  'Primary statement checked; not a new proof of its theorem.',
  'KRD proof-scope drift',
);

assert.equal(inventory.schemaVersion, 1, 'unexpected dependency-inventory schema');
assert.equal(inventory.reviewUnit, 'spectral-head', 'unexpected inventory review unit');
assert.equal(inventory.reproducibilityStatus, 'partial', 'inventory reproducibility drift');
assert.equal(inventory.originalInventorySha256, expectedOriginalInventoryDigest, 'original inventory hash drift');
assert.match(inventory.scope || '', /Not finite-support positivity, complement coercivity or RH\./);
assert.match(inventory.availabilityScope || '', /no executable-replay/);
assert.match(inventory.foundationScope || '', /explicit admitted analytic lemmas/);
assert.ok(
  inventory.externalClassicalInputs?.some((item) => /Uniform KRD concentration transition\/prefix bounds/.test(item)),
  'KRD classical input is missing',
);
assert.ok(
  inventory.deliberateExclusions?.some((item) => /finite X16\.001\/X16\.1 numerical certificates/.test(item)),
  'finite numerical certificate exclusion is missing',
);

assert.equal(inventory.proofUseUnits?.length, 18, 'expected exactly 18 proof-use units');
const dependenciesById = new Map();
const layerCounts = new Map();
for (const unit of inventory.proofUseUnits) {
  const expected = expectedDag[unit.id];
  if (!expected || dependenciesById.has(unit.id)) fail(`unexpected or duplicate proof-use unit: ${unit.id}`);
  assert.equal(unit.layer, expected.layer, `layer drift for ${unit.id}`);
  assert.deepEqual(unit.dependsOnUnits, expected.dependsOn, `dependency drift for ${unit.id}`);
  assert.equal(typeof unit.proofUse, 'string', `proof-use scope missing for ${unit.id}`);
  assert.ok(unit.proofUse.length > 0, `empty proof-use scope for ${unit.id}`);
  dependenciesById.set(unit.id, unit.dependsOnUnits);
  layerCounts.set(unit.layer, (layerCounts.get(unit.layer) || 0) + 1);
}
assertSameSet(dependenciesById.keys(), Object.keys(expectedDag), 'proof-use unit inventory drift');
assert.equal(layerCounts.get('current_deep_lemma_foundation'), 9, 'deep-foundation unit count drift');
assert.equal(layerCounts.get('current_result_chain'), 9, 'current-result unit count drift');
for (const [unitId, dependencies] of dependenciesById) {
  for (const dependency of dependencies) {
    assert.ok(dependenciesById.has(dependency), `unknown dependency ${dependency} from ${unitId}`);
  }
  transitiveDependencies(unitId, dependenciesById);
}
assertSameSet(
  transitiveDependencies('critical_cutoff', dependenciesById),
  Object.keys(expectedDag),
  'critical-cutoff chain must transitively bind every selected proof-use unit',
);

assert.equal(inventory.sourceMappings?.length, 54, 'expected exactly 54 source mappings');
const roleCounts = new Map();
const rolesByUnit = new Map();
const publishedPaths = new Set();
const originalPaths = new Set();
for (const mapping of inventory.sourceMappings) {
  assert.ok(dependenciesById.has(mapping.unitId), `mapping has unknown unit: ${mapping.unitId}`);
  assert.ok(
    ['source', 'audit_note', 'audit_receipt'].includes(mapping.role),
    `mapping has invalid role: ${mapping.role}`,
  );
  if (!isSafeRepositoryPath(mapping.originalPath)) fail(`unsafe original source path: ${mapping.originalPath}`);
  if (!isSafeRepositoryPath(mapping.publishedPath)) fail(`unsafe published source path: ${mapping.publishedPath}`);
  assert.ok(
    mapping.publishedPath.startsWith(`${sourceTreeRoot}/`),
    `published source path is outside the scoped source tree: ${mapping.publishedPath}`,
  );
  if (originalPaths.has(mapping.originalPath)) fail(`duplicate original source path: ${mapping.originalPath}`);
  if (publishedPaths.has(mapping.publishedPath)) fail(`duplicate published source path: ${mapping.publishedPath}`);
  originalPaths.add(mapping.originalPath);
  publishedPaths.add(mapping.publishedPath);

  assert.match(mapping.originalSha256 || '', sha256Pattern, `invalid original hash for ${mapping.publishedPath}`);
  assert.match(mapping.publishedSha256 || '', sha256Pattern, `invalid published hash for ${mapping.publishedPath}`);
  requireDigest(checksums, mapping.publishedPath, mapping.publishedSha256);
  assert.ok(
    Array.isArray(mapping.transformation) &&
      mapping.transformation.length > 0 &&
      mapping.transformation.every((item) => typeof item === 'string' && item.length > 0),
    `invalid transformation record for ${mapping.publishedPath}`,
  );
  if (mapping.transformation.includes('Byte-identical.')) {
    assert.equal(
      mapping.originalSha256,
      mapping.publishedSha256,
      `byte-identical mapping hash drift for ${mapping.publishedPath}`,
    );
  }
  if (mapping.role === 'source' || mapping.role === 'audit_note') {
    assert.match(mapping.publishedPath, /\.md$/, `non-Markdown ${mapping.role} mapping`);
  } else {
    assert.match(mapping.publishedPath, /\.json$/, 'non-JSON audit receipt mapping');
  }

  roleCounts.set(mapping.role, (roleCounts.get(mapping.role) || 0) + 1);
  const roles = rolesByUnit.get(mapping.unitId) || [];
  roles.push(mapping.role);
  rolesByUnit.set(mapping.unitId, roles);
}
for (const role of ['source', 'audit_note', 'audit_receipt']) {
  assert.equal(roleCounts.get(role), 18, `${role} mapping count drift`);
}
for (const unitId of dependenciesById.keys()) {
  assert.deepEqual(
    [...(rolesByUnit.get(unitId) || [])].sort(),
    ['audit_note', 'audit_receipt', 'source'],
    `source/audit mapping triple drift for ${unitId}`,
  );
}

const expectedManifestPaths = new Set([
  bodyPath,
  inventoryPath,
  readmePath,
  provenancePath,
  ...publishedPaths,
]);
assert.equal(expectedManifestPaths.size, 58, 'expected publication path inventory must contain 58 files');
assertSameSet(checksums.keys(), expectedManifestPaths, 'checksum manifest path inventory drift');

const packageFiles = await listFiles(publicationRoot);
const expectedPackageFiles = new Set(
  [...expectedManifestPaths].filter((relativePath) => relativePath.startsWith(`${publicationRoot}/`)),
);
expectedPackageFiles.add(checksumPath);
assertSameSet(packageFiles, expectedPackageFiles, 'extra or missing file in spectral-head publication package');

for (const [relativePath, expectedDigest] of checksums) {
  await assertNoSymlinkComponents(relativePath);
  const info = await lstat(fullPath(relativePath));
  if (!info.isFile()) fail(`checksum target is not a regular file: ${relativePath}`);
  const actualDigest = sha256(await readFile(fullPath(relativePath)));
  if (actualDigest !== expectedDigest) fail(`SHA-256 mismatch for ${relativePath}`);
}

requireTextIncludes(bodyText, 'It is not a numerical spectral run or a finite-support positivity certificate.', bodyPath);
requireTextIncludes(bodyText, 'no executable replay is claimed', bodyPath);
requireTextIncludes(bodyText, 'not conditional on an unproved complement estimate', bodyPath);
requireTextIncludes(bodyText, 'no proof of RH', bodyPath);
requireTextIncludes(bodyText, 'Nothing above supplies a lower bound on the correctly projected complementary diagonal block', bodyPath);
requireTextIncludes(bodyText, 'https://arxiv.org/pdf/2006.00427v2', bodyPath);
requireTextIncludes(readmeText, 'There is no runnable numerical certificate in this unit', readmePath);
requireTextIncludes(readmeText, 'It does not establish a lower bound on the whole physical complement', readmePath);
requireTextIncludes(readmeText, 'or prove RH.', readmePath);

assert.ok(!JSON.stringify(provenance).includes('current-replay'), 'provenance must not claim a current replay');
assert.ok(!JSON.stringify(inventory).includes('current-replay'), 'inventory must not claim a current replay');

console.log(
  `RH spectral-head publication audit: PASS (${checksums.size} files; ` +
  `${inventory.proofUseUnits.length} proof-use units; ${inventory.sourceMappings.length} mappings; ` +
  `source ${sourceStagingCommit.slice(0, 12)} tree ${sourceStagingTree.slice(0, 12)})`,
);
