import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicationRoot = 'research/rh/suzuki';
const checksumPath = `${publicationRoot}/PUBLICATION_SHA256SUMS`;
const checksumFile = path.join(repositoryRoot, checksumPath);
const sha256Pattern = /^[a-f0-9]{64}$/;
const safePathPattern = /^[A-Za-z0-9._/-]+$/;

function fail(message) {
  throw new Error(`Suzuki publication audit: ${message}`);
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

const manifestText = await readFile(checksumFile, 'utf8');
const checksums = parseChecksumManifest(manifestText);

const sourceProvenancePath = `${publicationRoot}/SOURCE_PROVENANCE.json`;
const transportManifestPath = `${publicationRoot}/CODE_AND_RECEIPTS_MANIFEST.json`;
const [sourceProvenance, transportManifest] = await Promise.all([
  readFile(fullPath(sourceProvenancePath), 'utf8').then(JSON.parse),
  readFile(fullPath(transportManifestPath), 'utf8').then(JSON.parse),
]);

assert.equal(sourceProvenance.schemaVersion, 1, 'unexpected source-provenance schema');
assert.equal(sourceProvenance.reviewUnit, 'suzuki', 'unexpected review unit');
assert.equal(sourceProvenance.publicationRelocation?.sourceStagingHead,
  '1a85a498d3de8a42bb7d7b18a916b9b603cfd688', 'source-staging head drift');

const expectedModuleIds = new Set([
  'suzuki-recurrence',
  'prime-memory',
  'finite-suzuki-certificate',
]);
assert.equal(sourceProvenance.modules?.length, expectedModuleIds.size, 'expected exactly three modules');
const bodyPaths = new Set();
for (const module of sourceProvenance.modules) {
  if (!expectedModuleIds.delete(module.id)) fail(`unexpected or duplicate module id: ${module.id}`);
  const expectedPath = `research/rh/modules/${module.id}.md`;
  assert.equal(module.bodyPath, expectedPath, `body path drift for ${module.id}`);
  assert.match(module.relocatedFrom || '', /^content\/rh-modules\/.+byte-identical move/,
    `missing relocation record for ${module.id}`);
  requireDigest(checksums, module.bodyPath, module.bodySha256);
  bodyPaths.add(module.bodyPath);
}
assert.equal(expectedModuleIds.size, 0, 'one or more expected modules are missing');

const publicationFiles = await listFiles(publicationRoot);
const publicationFilesExceptManifest = publicationFiles.filter((entry) => entry !== checksumPath);
const allowedPaths = new Set([...publicationFilesExceptManifest, ...bodyPaths]);
for (const manifestPath of checksums.keys()) {
  if (!allowedPaths.delete(manifestPath)) fail(`checksum lists an extra or out-of-scope path: ${manifestPath}`);
}
if (allowedPaths.size) fail(`publication files missing from checksum manifest: ${[...allowedPaths].join(', ')}`);

for (const [relativePath, expectedDigest] of checksums) {
  const file = fullPath(relativePath);
  const info = await lstat(file);
  if (info.isSymbolicLink()) fail(`checksum target cannot be a symbolic link: ${relativePath}`);
  if (!info.isFile()) fail(`checksum target is not a regular file: ${relativePath}`);
  const actualDigest = sha256(await readFile(file));
  if (actualDigest !== expectedDigest) fail(`SHA-256 mismatch for ${relativePath}`);
}

assert.deepEqual(
  sourceProvenance.codeAndReceiptMapping,
  transportManifest.files,
  'source provenance and code/receipt transport mappings differ',
);

for (const item of transportManifest.files || []) {
  const repositoryPath = `${publicationRoot}/${item.transport_path}`;
  requireDigest(checksums, repositoryPath, item.transport_sha256);
  if (item.byte_identical) {
    assert.equal(item.source_sha256, item.transport_sha256,
      `byte-identical source hash drift for ${item.transport_path}`);
  }
}

for (const item of transportManifest.new_portable_files || []) {
  requireDigest(checksums, `${publicationRoot}/${item.path}`, item.sha256);
}

const compressed = transportManifest.files.find((item) => item.encoding?.startsWith('gzip'));
assert.ok(compressed, 'compressed full certificate mapping is missing');
assert.equal(compressed.transport_path, 'receipts/COARSE_RESERVE_10M_256BIT.json.gz');
assert.equal(compressed.transport_sha256,
  '5043211b81a548d8e661a8aac26427564c0c0d79081a0dfba89214cb1d47e95d');
assert.equal(compressed.source_sha256,
  '8d4347f8fdcfc78886ad648849f4baf2041b0e01dc342baba1a76f5dffefe18e');
assert.equal(compressed.transport_bytes, 279729);
assert.equal(compressed.source_bytes, 1152332);

const compressedBytes = await readFile(fullPath(`${publicationRoot}/${compressed.transport_path}`));
assert.equal(compressedBytes.length, compressed.transport_bytes, 'compressed certificate byte length drift');
assert.equal(compressedBytes[0], 0x1f, 'invalid gzip magic byte 1');
assert.equal(compressedBytes[1], 0x8b, 'invalid gzip magic byte 2');
assert.equal(compressedBytes[2], 0x08, 'unexpected gzip compression method');
assert.equal(compressedBytes.readUInt32LE(4), 0, 'gzip mtime must remain deterministic at zero');
const decompressedBytes = gunzipSync(compressedBytes);
assert.equal(decompressedBytes.length, compressed.source_bytes, 'decompressed certificate byte length drift');
assert.equal(sha256(decompressedBytes), compressed.source_sha256,
  'decompressed certificate SHA-256 drift');

console.log(
  `RH Suzuki publication audit: PASS (${checksums.size} files; ` +
  `${decompressedBytes.length} certificate bytes verified)`,
);
