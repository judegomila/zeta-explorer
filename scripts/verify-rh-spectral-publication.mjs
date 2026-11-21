import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicationRoot = 'research/rh/spectral';
const checksumPath = `${publicationRoot}/PUBLICATION_SHA256SUMS`;
const provenancePath = `${publicationRoot}/SOURCE_PROVENANCE.json`;
const manifestPath = `${publicationRoot}/manifest.json`;
const bodyPath = 'research/rh/modules/whole-even-certificate.md';
const acceptedCertificatePath =
  `${publicationRoot}/reference/rh_attack_cycle_20261030/` +
  'support_endpoint_continuity/GENERIC_FULL_EVEN_CERTIFICATE.json';
const failedCertificatePath =
  `${publicationRoot}/reference/rh_attack_cycle_20261030/` +
  'support_endpoint_X161/GENERIC_FULL_EVEN_CERTIFICATE.json';
const acceptedCertificateManifestPath =
  `${publicationRoot}/reference/rh_attack_cycle_20261030/` +
  'support_endpoint_continuity/GENERIC_CERTIFICATE_MANIFEST.json';
const failedCertificateManifestPath =
  `${publicationRoot}/reference/rh_attack_cycle_20261030/` +
  'support_endpoint_X161/FAILED_CERTIFICATE_MANIFEST.json';
const acceptedAuditPath =
  `${publicationRoot}/reference/rh_attack_cycle_20261030/independent_review/` +
  'GENERIC_X16001_COMPLETE_EVEN_POSITIVITY_AUDIT.json';
const failedAuditPath =
  `${publicationRoot}/reference/rh_attack_cycle_20261030/independent_review/` +
  'GENERIC_X161_PARAMETERIZATION_AND_FAILED_GATE_AUDIT.json';
const acceptedReplayPath = `${publicationRoot}/validation/ACCEPTED_CLEAN_REPLAY.json`;
const postCurationPath = `${publicationRoot}/validation/POSTCURATION_IDENTITY.json`;
const replayInputPath = `${publicationRoot}/validation/REPLAY_INPUT_MANIFEST.json`;
const staticTransportPath = `${publicationRoot}/validation/STATIC_TRANSPORT_CHECK.json`;
const launcherPath = `${publicationRoot}/replay.py`;

// The source branch need not exist in a shallow build checkout. These source-transport
// identities are pinned together with the current manifest/provenance byte digests below.
const sourceTransport = Object.freeze({
  commit: 'd011a853ffa177fcaedd741616370a38feb37e00',
  tree: '5e56abd63ae89cc783144cab6b19d38514fe5bc9',
  manifestSha256: '1b5cc0afddecf88f23074f7b60cc3aa7de707d07d217223d632e745224737303',
  provenanceSha256: '22056355c2ea3e5be06df5bc8619228b4784d9e413e85627b8eaa5bb64974a69',
});

const expectedBodySha256 = '881a736aa736b37b2b366e5cb61cf2033802eced1d144c98912cb4b0c4e05b11';
const acceptedCacheDigest = '7124e3da5214999afd3edbe57cbbda015f4d14ae6a5f7a7acfafd1330b6292fa';
const failedCacheDigest = 'a16c51de67b2d0296ee0689f2201511e29c3a43705a8ab2f277360b66bf00faf';
const replayInputSha256 = '107c99ab1fed185dbbfc55f0e49ddb6bdeddcf696822e804572a4f09641d7264';
const launcherSha256 = 'f50e72d9cc1d804c4ee00f1e727ebfbab22f8e9299b2d5d2193bbcaa2490d896';
const sha256Pattern = /^[a-f0-9]{64}$/;
const gitObjectPattern = /^[a-f0-9]{40}$/;
const safePathPattern = /^[A-Za-z0-9._/-]+$/;

const fixedPayloadPaths = new Set([
  bodyPath,
  `${publicationRoot}/.gitignore`,
  `${publicationRoot}/REPRODUCE.md`,
  provenancePath,
  manifestPath,
  launcherPath,
  `${publicationRoot}/requirements.txt`,
  acceptedReplayPath,
  postCurationPath,
  replayInputPath,
  staticTransportPath,
]);

const pinnedDigests = Object.freeze({
  [bodyPath]: expectedBodySha256,
  [provenancePath]: sourceTransport.provenanceSha256,
  [manifestPath]: sourceTransport.manifestSha256,
  [launcherPath]: launcherSha256,
  [acceptedReplayPath]: '0c056655f85782baef9385755bbb64dc671aa8bfd08b200d1964012cd929ce86',
  [postCurationPath]: '721d3809e36f645143e96d90221692bf1fa146a8a8e9508391f509453947083e',
  [replayInputPath]: replayInputSha256,
  [staticTransportPath]: 'daef19eadf97a1c28bc963dbfa94b39a0cd2e72aff43c2d2cf6d6b686f5af6a7',
  [acceptedCertificatePath]: '589f88eb475bd51023abacb58af4bbf473041b9c0610184c33561c5f14a396c2',
  [failedCertificatePath]: '852645d51afa4d663313b420c2310b73532bf264ada50032801ba21f97eb5ac8',
  [acceptedAuditPath]: 'e46765602300ec44b16a87772e81a51f187cb73c2a5d822a1b080544476bdf78',
  [failedAuditPath]: '1950cda955688bfc110e5ace987eaab9781fdf90b56b58f9000fecfb719020e8',
});

function fail(message) {
  throw new Error(`RH spectral publication audit: ${message}`);
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

function requireExactSet(actual, expected, label) {
  const extra = [...actual].filter((value) => !expected.has(value));
  const missing = [...expected].filter((value) => !actual.has(value));
  if (extra.length || missing.length) {
    fail(`${label} mismatch; extra=[${extra.join(', ')}], missing=[${missing.join(', ')}]`);
  }
}

function requireSafeMappedPath(relativePath, label) {
  if (!isSafeRepositoryPath(relativePath)) fail(`unsafe ${label} path: ${relativePath}`);
  return relativePath;
}

assert.match(sourceTransport.commit, gitObjectPattern, 'invalid source-staging commit');
assert.match(sourceTransport.tree, gitObjectPattern, 'invalid source-staging tree');

const checksumText = await readFile(fullPath(checksumPath), 'utf8');
const checksums = parseChecksumManifest(checksumText);
assert.equal(checksums.size, 62, 'expected exactly 62 payload entries excluding the checksum manifest');
for (const [relativePath, digest] of Object.entries(pinnedDigests)) {
  requireDigest(checksums, relativePath, digest);
}

const publicationFiles = await listFiles(publicationRoot);
const actualPayloadPaths = new Set([
  bodyPath,
  ...publicationFiles.filter((relativePath) => relativePath !== checksumPath),
]);
requireExactSet(actualPayloadPaths, new Set(checksums.keys()), 'on-disk publication inventory');

const payloadBytes = new Map();
for (const [relativePath, expectedDigest] of checksums) {
  const info = await lstat(fullPath(relativePath));
  if (info.isSymbolicLink()) fail(`checksum target cannot be a symbolic link: ${relativePath}`);
  if (!info.isFile()) fail(`checksum target is not a regular file: ${relativePath}`);
  const bytes = await readFile(fullPath(relativePath));
  if (sha256(bytes) !== expectedDigest) fail(`SHA-256 mismatch for ${relativePath}`);
  payloadBytes.set(relativePath, bytes);
}

const parsedJson = new Map();
for (const [relativePath, bytes] of payloadBytes) {
  if (!relativePath.endsWith('.json')) continue;
  try {
    parsedJson.set(relativePath, JSON.parse(bytes.toString('utf8')));
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error.message}`);
  }
}
assert.equal(parsedJson.size, 29, 'expected exactly 29 parseable JSON payloads');

const provenance = parsedJson.get(provenancePath);
const manifest = parsedJson.get(manifestPath);
assert.ok(provenance, 'source provenance JSON is missing');
assert.ok(manifest, 'spectral manifest JSON is missing');

assert.equal(provenance.schemaVersion, 1, 'unexpected source-provenance schema');
assert.equal(provenance.reviewUnit, 'spectral', 'unexpected source-provenance review unit');
assert.equal(provenance.module?.id, 'whole-even-certificate', 'module id drift');
assert.equal(provenance.module?.bodyPath, bodyPath, 'module body path drift');
assert.equal(provenance.module?.bodySha256, expectedBodySha256, 'module body hash drift');
assert.equal(provenance.module?.status, 'certified-finite', 'module status drift');
assert.equal(provenance.module?.reviewStatus, 'accepted', 'module review status drift');
assert.equal(provenance.module?.reviewScope, 'internal', 'module review scope drift');
assert.equal(provenance.module?.rhStatus, 'open', 'module RH status drift');
assert.equal(
  provenance.module?.verification?.reproducibilityStatus,
  'current-replay',
  'module reproducibility status drift',
);

const claims = provenance.module?.claims;
assert.equal(claims?.length, 2, 'expected exactly one accepted claim and one failed route');
const acceptedClaim = claims.find((claim) => claim.id === 'actual-whole-even-X16001');
const failedClaim = claims.find((claim) => claim.id === 'X161-failed-lower-surrogate');
assert.ok(acceptedClaim, 'accepted whole-even claim is missing');
assert.ok(failedClaim, 'failed X=16.1 route is missing');
assert.equal(acceptedClaim.status, 'certified-finite', 'accepted claim status drift');
assert.equal(acceptedClaim.reviewStatus, 'accepted', 'accepted claim review status drift');
assert.equal(acceptedClaim.range, '1 < lambda <= sqrt(16001/1000)', 'accepted range drift');
assert.equal(
  acceptedClaim.positiveFloor,
  'Existential; no numerical endpoint floor advertised.',
  'accepted coercivity-floor boundary drift',
);
assert.equal(acceptedClaim.reproducibilityStatus, 'current-replay');
assert.equal(failedClaim.status, 'failed-surrogate', 'failed route status drift');
assert.equal(failedClaim.reviewStatus, 'failed', 'failed route review status drift');
assert.equal(failedClaim.reproducibilityStatus, 'partial');
assert.match(failedClaim.scope || '', /Negative surrogate is not actual negativity\.$/);

assert.equal(provenance.noteMappings?.length, 11, 'expected exactly 11 curated note mappings');
const expectedPayloadPaths = new Set(fixedPayloadPaths);
for (const mapping of provenance.noteMappings) {
  assert.equal(mapping.review_unit, 'spectral', 'note mapping review unit drift');
  requireSafeMappedPath(mapping.original_path, 'original note');
  const publishedPath = requireSafeMappedPath(mapping.published_path, 'published note');
  assert.ok(publishedPath.startsWith(`${publicationRoot}/source-tree/`), 'note outside source tree');
  assert.match(mapping.original_sha256 || '', sha256Pattern, `invalid original hash for ${publishedPath}`);
  requireDigest(checksums, publishedPath, mapping.published_sha256);
  if (expectedPayloadPaths.has(publishedPath)) fail(`duplicate mapped payload path: ${publishedPath}`);
  expectedPayloadPaths.add(publishedPath);
}
assert.equal(provenance.runtimeAndReceiptMapping?.path, manifestPath, 'runtime mapping path drift');
assert.equal(
  provenance.runtimeAndReceiptMapping?.sha256,
  sourceTransport.manifestSha256,
  'runtime mapping manifest hash drift',
);
assert.deepEqual(provenance.limitations, [
  'No RH, odd-space, cofinal-support, or effective onset claim',
  'No claim that negative sufficient surrogate is actual negative energy',
  'No external peer review or proof-assistant formalization',
]);

assert.equal(manifest.schema_version, 1, 'unexpected spectral manifest schema');
assert.equal(manifest.runtime?.python_tested, '3.12.14', 'tested Python version drift');
assert.equal(manifest.runtime?.python_flint, '0.9.0', 'tested python-flint version drift');
assert.deepEqual(manifest.runtime?.other_third_party_runtime_packages, []);
assert.match(manifest.scope || '', /No RH claim\.$/);

const sourceEntries = Object.entries(manifest.sources || {});
assert.equal(sourceEntries.length, 17, 'expected exactly 17 executable source files');
for (const [sourcePath, metadata] of sourceEntries) {
  requireSafeMappedPath(sourcePath, 'source');
  assert.ok(sourcePath.endsWith('.py'), `non-Python executable source entry: ${sourcePath}`);
  const publishedPath = `${publicationRoot}/source-tree/${sourcePath}`;
  requireDigest(checksums, publishedPath, metadata.sha256);
  assert.equal(payloadBytes.get(publishedPath)?.length, metadata.bytes, `source byte length drift: ${sourcePath}`);
  if (expectedPayloadPaths.has(publishedPath)) fail(`duplicate source payload path: ${publishedPath}`);
  expectedPayloadPaths.add(publishedPath);
}

const receiptEntries = Object.entries(manifest.reference_receipts || {});
assert.equal(receiptEntries.length, 23, 'expected exactly 23 reference receipts');
for (const [receiptPath, metadata] of receiptEntries) {
  requireSafeMappedPath(receiptPath, 'reference receipt');
  assert.ok(receiptPath.endsWith('.json'), `non-JSON reference receipt: ${receiptPath}`);
  assert.match(metadata.original_sha256 || '', sha256Pattern, `invalid original receipt hash: ${receiptPath}`);
  const publishedPath = `${publicationRoot}/reference/${receiptPath}`;
  requireDigest(checksums, publishedPath, metadata.transport_sha256);
  assert.equal(payloadBytes.get(publishedPath)?.length, metadata.bytes, `receipt byte length drift: ${receiptPath}`);
  if (expectedPayloadPaths.has(publishedPath)) fail(`duplicate receipt payload path: ${publishedPath}`);
  expectedPayloadPaths.add(publishedPath);
}
assert.equal(expectedPayloadPaths.size, 62, 'derived publication inventory must contain exactly 62 paths');
requireExactSet(new Set(checksums.keys()), expectedPayloadPaths, 'manifest-derived publication inventory');

const expectedAcceptedCommands = [
  ['rh_attack_cycle_20261030/support_endpoint_continuity/generic_prime_power7_feasibility.py'],
  [
    'rh_attack_cycle_20261030/support_endpoint_continuity/compute_generic_moment_cache_v2.py',
    '--workers',
    '4',
  ],
  ['rh_attack_cycle_20261030/support_endpoint_continuity/generic_actual_head_pilot.py'],
  ['rh_attack_cycle_20261030/support_endpoint_continuity/certify_generic_X16001.py', '--small'],
  ['rh_attack_cycle_20261030/support_endpoint_continuity/certify_generic_X16001.py'],
];
const expectedFailedCommands = [
  ['rh_attack_cycle_20261030/support_endpoint_next_feasibility/X161_power7.py'],
  [
    'rh_attack_cycle_20261030/support_endpoint_X161/compute_moment_cache.py',
    '--limit',
    '64',
    '--workers',
    '4',
  ],
  ['rh_attack_cycle_20261030/support_endpoint_X161/compute_moment_cache.py', '--workers', '4'],
  ['rh_attack_cycle_20261030/support_endpoint_X161/preflight_support_and_cache.py'],
  ['rh_attack_cycle_20261030/support_endpoint_X161/check_cache_isolation.py'],
  ['rh_attack_cycle_20261030/support_endpoint_X161/certify_generic_support.py', '--small'],
  ['rh_attack_cycle_20261030/support_endpoint_X161/certify_generic_support.py'],
];

assert.deepEqual(Object.keys(manifest.cases || {}).sort(), ['accepted', 'failed']);
const acceptedCase = manifest.cases.accepted;
const failedCase = manifest.cases.failed;
assert.equal(acceptedCase.id, 'rh-supported-even-x16001', 'accepted case id drift');
assert.equal(acceptedCase.status, 'ACCEPTED_INDEPENDENT_COMPLETE_REPLAY', 'accepted case status drift');
assert.equal(acceptedCase.directory, 'rh_attack_cycle_20261030/support_endpoint_continuity');
assert.equal(
  acceptedCase.cache,
  'rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_MOMENT_CACHE_V2.jsonl',
);
assert.equal(acceptedCase.canonical_all_rows_sha256, acceptedCacheDigest, 'accepted cache digest drift');
assert.equal(acceptedCase.required_cache_rows, 10437, 'accepted cache row count drift');
assert.equal(acceptedCase.expected_certificate_status, 'PASS');
assert.deepEqual(acceptedCase.commands, expectedAcceptedCommands, 'accepted replay commands drift');
assert.match(acceptedCase.claim || '', /existential positive constant/);
assert.match(acceptedCase.claim || '', /no numerical endpoint floor/);

assert.equal(failedCase.id, 'rh-supported-even-x161-failed-surrogate', 'failed case id drift');
assert.equal(
  failedCase.status,
  'FAILED_SUFFICIENT_SURROGATE_NOT_ACTUAL_NEGATIVITY',
  'failed case status drift',
);
assert.equal(failedCase.directory, 'rh_attack_cycle_20261030/support_endpoint_X161');
assert.equal(failedCase.cache, 'rh_attack_cycle_20261030/support_endpoint_X161/MOMENT_CACHE.jsonl');
assert.equal(failedCase.canonical_all_rows_sha256, failedCacheDigest, 'failed cache digest drift');
assert.equal(failedCase.required_cache_rows, 10437, 'failed cache row count drift');
assert.equal(failedCase.expected_certificate_status, 'FAILED_OR_INCONCLUSIVE');
assert.deepEqual(failedCase.commands, expectedFailedCommands, 'failed replay commands drift');

const acceptedCertificate = parsedJson.get(acceptedCertificatePath);
const failedCertificate = parsedJson.get(failedCertificatePath);
assert.equal(acceptedCertificate.status, 'PASS', 'accepted certificate status drift');
assert.equal(acceptedCertificate.test_kind, 'COMPLETE_FULL_EVEN_TEST');
assert.equal(acceptedCertificate.X, '16001/1000');
assert.equal(acceptedCertificate.lambda, 'sqrt(16001/1000)');
assert.equal(acceptedCertificate.dimension, 2049);
assert.equal(acceptedCertificate.N, 2048);
assert.equal(acceptedCertificate.J, 16384);
assert.equal(acceptedCertificate.L, 36);
assert.equal(acceptedCertificate.rank_one_lift, false);
assert.equal(acceptedCertificate.core?.pass_positive, true);
assert.equal(acceptedCertificate.core?.dimension, 2049);
assert.equal(acceptedCertificate.coefficient_H?.pass_positive, true);
assert.equal(acceptedCertificate.coefficient_H?.dimension, 72);
assert.equal(acceptedCertificate.whitened_Schur?.pass_positive, true);
assert.equal(acceptedCertificate.whitened_Schur?.dimension, 72);
assert.equal(acceptedCertificate.dense_checks, null);
assert.match(acceptedCertificate.scope || '', /No odd\/cofinal\/RH result\.$/);

assert.equal(failedCertificate.status, 'FAILED_OR_INCONCLUSIVE', 'failed certificate status drift');
assert.equal(failedCertificate.test_kind, 'COMPLETE_FULL_EVEN_TEST');
assert.equal(failedCertificate.X, '161/10');
assert.equal(failedCertificate.lambda, 'sqrt(161/10)');
assert.equal(failedCertificate.dimension, 2049);
assert.equal(failedCertificate.core?.pass_positive, true);
assert.equal(failedCertificate.core?.dimension, 2049);
assert.equal(failedCertificate.coefficient_H?.pass_positive, true);
assert.equal(failedCertificate.coefficient_H?.dimension, 72);
assert.equal(failedCertificate.whitened_Schur?.pass_positive, false);
assert.equal(failedCertificate.whitened_Schur?.failed_index, 0);
assert.match(failedCertificate.whitened_Schur?.pivot || '', /^\[-0\.674664753296947/);

const acceptedCertificateManifest = parsedJson.get(acceptedCertificateManifestPath);
const failedCertificateManifest = parsedJson.get(failedCertificateManifestPath);
assert.equal(
  acceptedCertificateManifest.status,
  'PRODUCER_COMPLETE_PASS_INDEPENDENT_COMPLETE_REVIEW_PENDING',
  'accepted producer manifest status drift',
);
assert.equal(
  acceptedCertificateManifest.source_and_evidence_sha256?.[
    'rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_FULL_EVEN_CERTIFICATE.json'
  ],
  pinnedDigests[acceptedCertificatePath],
);
assert.equal(
  failedCertificateManifest.status,
  'STRICT_LOWER_SURROGATE_FAILURE_NO_ACTUAL_NEGATIVITY',
  'failed producer manifest caveat drift',
);
assert.equal(
  failedCertificateManifest.sha256?.[
    'rh_attack_cycle_20261030/support_endpoint_X161/GENERIC_FULL_EVEN_CERTIFICATE.json'
  ],
  pinnedDigests[failedCertificatePath],
);

const acceptedAudit = parsedJson.get(acceptedAuditPath);
assert.equal(
  acceptedAudit.status,
  'PASS_ACTUAL_COMPLETE_REFLECTION_EVEN_COERCIVITY_THROUGH_SQRT_16_001',
  'accepted independent audit status drift',
);
assert.equal(acceptedAudit.accepted_theorem?.X, '16001/1000');
assert.equal(acceptedAudit.accepted_theorem?.lambda_endpoint, 'sqrt(16001/1000)');
assert.equal(acceptedAudit.accepted_theorem?.numeric_floor_extracted, false);
assert.equal(acceptedAudit.accepted_theorem?.old_lambda4_numeric_floor_transplanted, false);
assert.match(acceptedAudit.accepted_theorem?.statement || '', /There exists c_\*>0/);
assert.deepEqual(acceptedAudit.full_replay?.dimensions, [2049, 72, 72]);
assert.equal(acceptedAudit.full_replay?.status, 'PASS');
assert.equal(acceptedAudit.full_replay?.every_non_timing_field_identical, true);
assert.equal(acceptedAudit.new_cache_independent_validation?.all_entries_recomputed, 10437);
assert.equal(acceptedAudit.new_cache_independent_validation?.minimum_restored_bits, 942);
assert.ok(acceptedAudit.not_inferred?.includes('numerical c_* from pivots'));
assert.ok(acceptedAudit.not_inferred?.includes('RH'));

const failedAudit = parsedJson.get(failedAuditPath);
assert.equal(
  failedAudit.status,
  'PASS_PARAMETERIZATION_PREREQUISITES_ONLY__FULL_X161_CERTIFICATE_FAILED',
  'failed independent audit status drift',
);
assert.equal(failedAudit.X, '161/10');
assert.equal(failedAudit.producer_full_gate?.status, 'FAILED_OR_INCONCLUSIVE');
assert.equal(failedAudit.producer_full_gate?.core_2049_pass, true);
assert.equal(failedAudit.producer_full_gate?.coefficient_H72_pass, true);
assert.equal(failedAudit.producer_full_gate?.whitened_failed_index, 0);
assert.equal(failedAudit.producer_full_gate?.independently_rerun, false);
assert.equal(failedAudit.actual_physical_negativity_inferred, false);
assert.equal(failedAudit.new_endpoint_accepted, false);
assert.equal(failedAudit.retained_accepted_endpoint, 'sqrt(16001/1000)');
assert.match(failedAudit.exact_blocker || '', /does not prove actual negativity\.$/);
assert.equal(failedAudit.complete_cache_recomputed, 10437);

const bodyText = payloadBytes.get(bodyPath).toString('utf8');
assert.match(bodyText, /The coercivity constant at this enlarged endpoint is existential; no numerical value is claimed\./);
assert.match(bodyText, /No minimum LDL pivot is substituted for that constant\./);
assert.match(bodyText, /It does \*\*not\*\* prove negativity of the actual form\./);

const acceptedReplay = parsedJson.get(acceptedReplayPath);
assert.equal(acceptedReplay.schema_version, 1);
assert.equal(acceptedReplay.case, 'accepted');
assert.equal(acceptedReplay.status, 'PASS_COMPLETE_CLEAN_REPRODUCTION');
assert.equal(acceptedReplay.manifest_sha256, replayInputSha256);
assert.equal(acceptedReplay.launcher_sha256, launcherSha256);
assert.equal(acceptedReplay.cache?.rows, 10437);
assert.equal(acceptedReplay.cache?.exact_required_index_set, true);
assert.equal(acceptedReplay.cache?.minimum_reloaded_accuracy_bits, 942);
assert.equal(acceptedReplay.cache?.canonical_all_rows_sha256, acceptedCacheDigest);
assert.equal(acceptedReplay.cache?.every_nontiming_row_field_matches_reference_digest, true);
assert.equal(acceptedReplay.certificate_status, 'PASS');
assert.equal(acceptedReplay.complete_gate_fields?.X, '16001/1000');
assert.equal(acceptedReplay.complete_gate_fields?.lambda, 'sqrt(16001/1000)');
assert.equal(acceptedReplay.complete_gate_fields?.dimension, 2049);
assert.equal(acceptedReplay.complete_gate_fields?.core?.pass_positive, true);
assert.equal(acceptedReplay.complete_gate_fields?.core?.dimension, 2049);
assert.equal(acceptedReplay.complete_gate_fields?.coefficient_H?.pass_positive, true);
assert.equal(acceptedReplay.complete_gate_fields?.coefficient_H?.dimension, 72);
assert.equal(acceptedReplay.complete_gate_fields?.whitened_Schur?.pass_positive, true);
assert.equal(acceptedReplay.complete_gate_fields?.whitened_Schur?.dimension, 72);
assert.deepEqual(
  acceptedReplay.stages?.map((stage) => stage.command),
  expectedAcceptedCommands,
  'clean-replay stage commands drift',
);
assert.ok(acceptedReplay.stages?.every((stage) => stage.exit_code === 0), 'a clean-replay stage failed');
assert.equal(acceptedReplay.receipt_comparisons?.length, 6);
assert.ok(
  acceptedReplay.receipt_comparisons.every(
    (comparison) => comparison.all_mathematical_and_nontiming_nonprovenance_fields_identical === true,
  ),
  'clean replay differs from a frozen receipt',
);
assert.equal(acceptedReplay.static_source_count_verified_before_after_every_stage, 17);
assert.equal(acceptedReplay.frozen_reference_receipts_unchanged, true);
assert.match(acceptedReplay.scope || '', /No odd\/cofinal\/RH conclusion\./);

const replayInput = parsedJson.get(replayInputPath);
assert.equal(replayInput.schema_version, 1);
assert.deepEqual(replayInput.sources, manifest.sources, 'replay/current executable source maps differ');
assert.deepEqual(replayInput.cases, manifest.cases, 'replay/current case definitions differ');
assert.deepEqual(replayInput.runtime, manifest.runtime, 'replay/current runtime definitions differ');
assert.equal(Object.keys(replayInput.reference_receipts || {}).length, 23);

const postCuration = parsedJson.get(postCurationPath);
assert.equal(postCuration.status, 'PASS_METADATA_ONLY_POSTCURATION_IDENTITY');
assert.equal(postCuration.accepted_clean_replay_report_sha256_unchanged, checksums.get(acceptedReplayPath));
assert.equal(postCuration.replay_input_manifest_sha256, checksums.get(replayInputPath));
assert.equal(postCuration.current_manifest_sha256, checksums.get(manifestPath));
assert.equal(postCuration.replay_input_manifest_preserved_at, 'validation/REPLAY_INPUT_MANIFEST.json');
assert.equal(postCuration.all17_python_source_bytes_unchanged, true);
assert.equal(postCuration.case_commands_and_all10437row_canonical_digests_unchanged, true);
assert.equal(postCuration.all_mathematical_gate_receipt_bytes_unchanged, true);
assert.equal(postCuration.all_non_reviewer_audit_fields_unchanged, true);
assert.equal(postCuration.full_replay_repeated, false);
assert.match(postCuration.scope || '', /No numerical rerun is claimed\.$/);

const changedReceiptPaths = new Set(
  postCuration.changed_reference_receipts?.map((receipt) => receipt.path),
);
assert.equal(changedReceiptPaths.size, 3, 'expected exactly three reviewer-only receipt changes');
const actualChangedReceiptPaths = new Set();
for (const [receiptPath, currentMetadata] of Object.entries(manifest.reference_receipts)) {
  const replayMetadata = replayInput.reference_receipts[receiptPath];
  if (JSON.stringify(currentMetadata) !== JSON.stringify(replayMetadata)) {
    actualChangedReceiptPaths.add(receiptPath);
  }
}
requireExactSet(actualChangedReceiptPaths, changedReceiptPaths, 'post-curation changed receipt inventory');
for (const record of postCuration.changed_reference_receipts) {
  assert.equal(record.only_changed_json_field, 'reviewer');
  assert.equal(record.all_other_fields_identical, true);
  assert.equal(record.original_sha256, replayInput.reference_receipts[record.path]?.transport_sha256);
  assert.equal(record.transport_sha256, manifest.reference_receipts[record.path]?.transport_sha256);
}

const staticTransport = parsedJson.get(staticTransportPath);
assert.equal(staticTransport.status, 'PASS_STATIC_TRANSPORT_AND_COMPARISON_CHECK');
assert.equal(staticTransport.original_python_sources_byte_identical, 17);
assert.equal(staticTransport.original_json_receipts, 23);
assert.equal(staticTransport.launcher_sha256, checksums.get(launcherPath));
assert.equal(staticTransport.manifest_sha256, checksums.get(manifestPath));
assert.equal(staticTransport.mathematical_field_filter_keeps_sign_accuracy_and_floor_fields, true);
assert.equal(staticTransport.transformation_preserves_all_mathematical_fields, true);
assert.equal(staticTransport.only_transformed_receipts?.length, 4);
assert.ok(staticTransport.only_transformed_receipts.includes(
  'rh_attack_cycle_20261030/support_endpoint_X161/PREFLIGHT_SUPPORT_AND_CACHE.json',
));
for (const changedPath of changedReceiptPaths) {
  assert.ok(staticTransport.only_transformed_receipts.includes(changedPath));
}

console.log(
  `RH spectral publication audit: PASS (${checksums.size} files; ${parsedJson.size} JSON; ` +
  `17 sources; 23 receipts; source ${sourceTransport.commit.slice(0, 12)} tree ` +
  `${sourceTransport.tree.slice(0, 12)}; no numerical replay run)`,
);
