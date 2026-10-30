import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicationRoot = 'research/rh/foundation';
const checksumPath = `${publicationRoot}/PUBLICATION_SHA256SUMS`;
const sourceStagingCommit = '949a81bc614bb7ad1497c95088b62e61123833cd';
const sourceStagingTree = '7f359f2813e206ee6e991bd888a5c128cbd59dd8';
const sha256Pattern = /^[a-f0-9]{64}$/;
const gitObjectPattern = /^[a-f0-9]{40}$/;
const safePathPattern = /^[A-Za-z0-9._/-]+$/;

const expectedPaths = new Set([
  'research/rh/modules/arithmetic-foundation.md',
  'research/rh/modules/historical-routes.md',
  'research/rh/foundation/SOURCE_PROVENANCE.json',
  'research/rh/foundation/historical-evidence-map.json',
  'research/rh/foundation/historical-qa.json',
  'research/rh/foundation/source/03-landau.tex',
  'research/rh/foundation/source/04-05-shell-vaughan.tex',
  'research/rh/foundation/v7-mathematical-review.md',
  'research/rh/PUBLICATION_SCOPE_2026-10-30.md',
]);

const expectedBodyDigests = Object.freeze({
  'arithmetic-foundation': '121e75c25d5c42a5de23359ccad92c5486ba93c26d71419f79002cbaec9c4648',
  'historical-routes': 'd7c63dd2357431c8731cd45b28e2ae2aa71b969f4a04f811882d8a045288593d',
});

function fail(message) {
  throw new Error(`RH foundation publication audit: ${message}`);
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
  if (!lines.length || lines.some((line) => line.length === 0)) {
    fail('checksum manifest contains an empty line');
  }
  const entries = new Map();
  for (const [index, line] of lines.entries()) {
    const match = /^([a-f0-9]{64})  ([A-Za-z0-9._/-]+)$/.exec(line);
    if (!match) fail(`malformed checksum line ${index + 1}`);
    const [, digest, relativePath] = match;
    if (!isSafeRepositoryPath(relativePath)) fail(`unsafe path on checksum line ${index + 1}`);
    if (relativePath === checksumPath) fail('checksum manifest cannot list itself');
    if (entries.has(relativePath)) fail(`duplicate checksum path: ${relativePath}`);
    entries.set(relativePath, digest);
  }
  return entries;
}

function requireDigest(entries, relativePath, expectedDigest) {
  if (!sha256Pattern.test(expectedDigest || '')) fail(`invalid expected SHA-256 for ${relativePath}`);
  if (entries.get(relativePath) !== expectedDigest) {
    fail(`manifest/provenance digest mismatch for ${relativePath}`);
  }
}

function requireUniqueIds(items, label) {
  assert.ok(Array.isArray(items), `${label} must be an array`);
  const ids = new Set();
  for (const item of items) {
    assert.equal(typeof item?.id, 'string', `${label} entry must have an id`);
    if (ids.has(item.id)) fail(`duplicate ${label} id: ${item.id}`);
    ids.add(item.id);
  }
  return ids;
}

assert.match(sourceStagingCommit, gitObjectPattern, 'invalid source-staging commit');
assert.match(sourceStagingTree, gitObjectPattern, 'invalid source-staging tree');

const manifestText = await readFile(fullPath(checksumPath), 'utf8');
const checksums = parseChecksumManifest(manifestText);
assert.equal(checksums.size, expectedPaths.size, 'expected exactly nine publication files');
const unaccountedPaths = new Set(expectedPaths);
for (const manifestPath of checksums.keys()) {
  if (!unaccountedPaths.delete(manifestPath)) {
    fail(`checksum lists an extra or out-of-scope path: ${manifestPath}`);
  }
}
if (unaccountedPaths.size) {
  fail(`publication files missing from checksum manifest: ${[...unaccountedPaths].join(', ')}`);
}

const foundationFiles = await listFiles(publicationRoot);
const expectedFoundationFiles = new Set(
  [...expectedPaths].filter((entry) => entry.startsWith(`${publicationRoot}/`)),
);
expectedFoundationFiles.add(checksumPath);
for (const relativePath of foundationFiles) {
  if (!expectedFoundationFiles.delete(relativePath)) {
    fail(`unmanifested file in foundation publication directory: ${relativePath}`);
  }
}
if (expectedFoundationFiles.size) {
  fail(`expected foundation files are missing: ${[...expectedFoundationFiles].join(', ')}`);
}

for (const [relativePath, expectedDigest] of checksums) {
  const file = fullPath(relativePath);
  const info = await lstat(file);
  if (info.isSymbolicLink()) fail(`checksum target cannot be a symbolic link: ${relativePath}`);
  if (!info.isFile()) fail(`checksum target is not a regular file: ${relativePath}`);
  const actualDigest = sha256(await readFile(file));
  if (actualDigest !== expectedDigest) fail(`SHA-256 mismatch for ${relativePath}`);
}

const provenancePath = `${publicationRoot}/SOURCE_PROVENANCE.json`;
const evidenceMapPath = `${publicationRoot}/historical-evidence-map.json`;
const qaPath = `${publicationRoot}/historical-qa.json`;
const [provenance, evidenceMap, qa] = await Promise.all([
  readFile(fullPath(provenancePath), 'utf8').then(JSON.parse),
  readFile(fullPath(evidenceMapPath), 'utf8').then(JSON.parse),
  readFile(fullPath(qaPath), 'utf8').then(JSON.parse),
]);

assert.equal(provenance.schemaVersion, 1, 'unexpected source-provenance schema');
assert.equal(provenance.reviewUnit, 'foundation-route-atlas', 'unexpected review unit');
assert.equal(provenance.pathMapping?.localBodyRoot, 'content/rh-modules');
assert.equal(provenance.pathMapping?.repositoryBodyRoot, 'research/rh/modules');

const expectedModules = new Map([
  ['arithmetic-foundation', {
    status: 'conditional-reduction',
    reproducibilityStatus: 'not-applicable',
  }],
  ['historical-routes', {
    status: 'open',
    reproducibilityStatus: 'partial',
  }],
]);
assert.equal(provenance.modules?.length, expectedModules.size, 'expected exactly two foundation modules');
for (const module of provenance.modules) {
  const expected = expectedModules.get(module.id);
  if (!expected) fail(`unexpected or duplicate module id: ${module.id}`);
  assert.equal(module.status, expected.status, `status drift for ${module.id}`);
  assert.equal(module.reviewStatus, 'accepted', `review status drift for ${module.id}`);
  assert.equal(module.reviewScope, 'internal', `review scope drift for ${module.id}`);
  assert.equal(module.rhStatus, 'open', `RH status drift for ${module.id}`);
  assert.equal(
    module.reproducibilityStatus,
    expected.reproducibilityStatus,
    `reproducibility drift for ${module.id}`,
  );
  assert.equal(module.bodyPath, `research/rh/modules/${module.id}.md`, `body path drift for ${module.id}`);
  requireDigest(checksums, module.bodyPath, expectedBodyDigests[module.id]);
  expectedModules.delete(module.id);
}
assert.equal(expectedModules.size, 0, 'one or more expected modules are missing');
assert.equal(
  provenance.bodyCuration?.['historical-routes']?.publishedSha256,
  expectedBodyDigests['historical-routes'],
  'historical route body-curation hash drift',
);

const mappedPaths = new Set();
for (const mapping of provenance.sourceMappings || []) {
  if (!isSafeRepositoryPath(mapping.publishedPath)) fail(`unsafe published source path: ${mapping.publishedPath}`);
  if (mappedPaths.has(mapping.publishedPath)) fail(`duplicate published source mapping: ${mapping.publishedPath}`);
  mappedPaths.add(mapping.publishedPath);
  requireDigest(checksums, mapping.publishedPath, mapping.publishedSha256);
  assert.match(mapping.originalSha256 || '', sha256Pattern, `invalid original hash for ${mapping.publishedPath}`);
  if (mapping.transformation.startsWith('None;')) {
    assert.equal(
      mapping.originalSha256,
      mapping.publishedSha256,
      `byte-identical mapping hash drift for ${mapping.publishedPath}`,
    );
  }
}
assert.deepEqual(
  mappedPaths,
  new Set([
    'research/rh/foundation/source/03-landau.tex',
    'research/rh/foundation/source/04-05-shell-vaughan.tex',
    'research/rh/foundation/v7-mathematical-review.md',
  ]),
  'source mapping inventory drift',
);

assert.equal(evidenceMap.schema_version, 1, 'unexpected evidence-map schema');
assert.equal(evidenceMap.reviewScope, 'internal', 'evidence map must remain internal review');
assert.match(evidenceMap.claim_boundary || '', /^No RH,/, 'evidence claim boundary drift');
const expectedRouteIds = new Set([
  'twin-ladder',
  'information-criticality',
  'synchronization',
  'vortex-collision',
  'theta-finite',
  'discrete-curvature',
  'twistor-thin',
  'arithmetic-duals',
  'mobius-zero-free',
  'curvature-bulk-suzuki',
  'newman-distinction',
]);
const routeIds = requireUniqueIds(evidenceMap.routes, 'route');
assert.deepEqual(routeIds, expectedRouteIds, 'historical route inventory drift');

const validStatuses = new Set([
  'proved-identity',
  'proved-analytic',
  'certified-finite',
  'conditional-reduction',
  'failed-surrogate',
  'superseded',
  'open',
]);
const sourceCollections = [
  evidenceMap.inspected_remote_sources,
  evidenceMap.inspected_delivered_sources,
  evidenceMap.inspected_pinned_cached_sources,
];
const knownSourceIds = new Set();
for (const [index, collection] of sourceCollections.entries()) {
  for (const source of collection || []) {
    if (knownSourceIds.has(source.id)) fail(`duplicate evidence source id: ${source.id}`);
    knownSourceIds.add(source.id);
    if (source.commit !== undefined) assert.match(source.commit, gitObjectPattern, `invalid source commit: ${source.id}`);
    if (source.url !== undefined) {
      assert.match(source.url, /^https:\/\/github\.com\/judegomila\/mathexplorer\/blob\//,
        `unexpected source URL: ${source.id}`);
      if (source.commit !== undefined) assert.ok(source.url.includes(`/${source.commit}/`), `source URL commit drift: ${source.id}`);
    }
    if (index === 1) assert.equal(source.remote_link_verified, false, `delivered source publication drift: ${source.id}`);
  }
}
for (const route of evidenceMap.routes) {
  assert.ok(validStatuses.has(route.status), `invalid route status: ${route.id}`);
  assert.equal(route.reviewScope, 'internal', `route review scope drift: ${route.id}`);
  assert.equal(route.reproducibilityState, 'partial', `route replay scope drift: ${route.id}`);
  assert.ok(Array.isArray(route.includedStatuses) && route.includedStatuses.length > 0,
    `route has no included statuses: ${route.id}`);
  for (const status of route.includedStatuses) {
    assert.ok(validStatuses.has(status), `invalid included status ${status} for ${route.id}`);
  }
  for (const sourceId of route.sources || []) {
    assert.ok(knownSourceIds.has(sourceId), `unknown source ${sourceId} for ${route.id}`);
  }
}

const arithmeticDuals = evidenceMap.routes.find((route) => route.id === 'arithmetic-duals');
assert.match(arithmeticDuals.reproducibilityNote, /1\.1 GB bundle unavailable/, 'historical missing bundle boundary drift');
const thetaFinite = evidenceMap.routes.find((route) => route.id === 'theta-finite');
assert.match(thetaFinite.accepted, /real \|x\|<=13/, 'theta real-box scope drift');
assert.match(thetaFinite.accepted, /\[0,1\/2\]x\[200,220\]/, 'theta endpoint-box scope drift');
assert.ok(evidenceMap.blockers.some((item) => /PR6 remains P0_INVALIDATED/.test(item)), 'PR6 invalidation missing');
assert.ok(evidenceMap.blockers.some((item) => /PR14 .* remains conditional/.test(item)), 'PR14 conditional boundary missing');

const pullRequestNumbers = new Set([6, 13, 14, 15, 16, 17, 18, 19]);
assert.equal(evidenceMap.pull_requests?.length, pullRequestNumbers.size, 'pull request inventory drift');
for (const pr of evidenceMap.pull_requests) {
  if (!pullRequestNumbers.delete(pr.number)) fail(`unexpected or duplicate pull request: ${pr.number}`);
  assert.equal(pr.state, 'open', `historical PR state drift: ${pr.number}`);
  assert.equal(pr.merged, false, `historical PR merge boundary drift: ${pr.number}`);
  assert.match(pr.head_sha || '', gitObjectPattern, `invalid historical PR head: ${pr.number}`);
  assert.equal(pr.url, `https://github.com/judegomila/mathexplorer/pull/${pr.number}`);
}
assert.equal(pullRequestNumbers.size, 0, 'one or more historical PR records are missing');

assert.deepEqual(qa.fresh_checks, evidenceMap.fresh_checks, 'QA and evidence-map fresh checks differ');
assert.deepEqual(qa.remaining_blockers, evidenceMap.blockers, 'QA and evidence-map blockers differ');
assert.equal(qa.privacy_scan, 'PASS', 'privacy scan is not passing');
assert.equal(qa.display_math_delimiters, 'PASS', 'display-math delimiter scan is not passing');
assert.equal(qa.json_parse, 'PASS', 'JSON parse scan is not passing');
assert.equal(qa.route_source_references, 'PASS', 'route source reference scan is not passing');

console.log(
  `RH foundation publication audit: PASS (${checksums.size} files; ` +
  `${evidenceMap.routes.length} historical routes; source ${sourceStagingCommit.slice(0, 12)} ` +
  `tree ${sourceStagingTree.slice(0, 12)})`,
);
