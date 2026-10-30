import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFile = promisify(execFileCallback);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicationRoot = 'research/rh/channel-geometry';
const sourceTreeRoot = `${publicationRoot}/source-tree`;
const provenancePath = `${publicationRoot}/SOURCE_PROVENANCE.json`;
const bodyPath = 'research/rh/modules/channel-geometry.md';
const adapterPath = 'src/data/rh-research/channel-geometry.js';

const sourceBranch = 'codex/rh-channel-geometry-source-2026-10-30';
const sourceCommit = 'a9e52e234e104a1b64b5fce6d2c108519b18eb8f';
const sourceTree = 'dc967ce1539d1fb067ee772b3ec453e159ef8162';
const sourceParent = '942ba1760c4ef54a519750ab91c37a661c31e0ce';
const provenanceSha256 = 'c8e5c20e32ee513aec009c1958316fa8aa9eb15bcda686f2c70543c393579b69';
const bodySha256 = 'bcda63ebc745d6363fc1ac407312035af011af25acc61404923a60147ae592f8';
const bodySizeBytes = 17040;

const sha256Pattern = /^[a-f0-9]{64}$/;
const gitObjectPattern = /^[a-f0-9]{40}$/;
const safePathPattern = /^[A-Za-z0-9._/-]+$/;
const replayRequested = process.argv.slice(2).includes('--replay');

const expectedPackageMetadata = new Set([
  `${publicationRoot}/ANALYTIC_DEPENDENCIES.md`,
  provenancePath,
  `${publicationRoot}/qa/INTEGRATION_BODY_AUDIT.json`,
  `${publicationRoot}/qa/INTEGRATION_BODY_AUDIT.md`,
  `${publicationRoot}/qa/INTEGRATION_VALIDATION.json`,
  `${publicationRoot}/qa/SYNTHETIC_REPLAY.json`,
]);

const expectedPackageMetadataDigests = Object.freeze({
  [`${publicationRoot}/ANALYTIC_DEPENDENCIES.md`]:
    '75a439c6a2e1353a9554387cc14aa41e45a59331f52924480476cd2deafecffe',
  [provenancePath]: provenanceSha256,
  [`${publicationRoot}/qa/INTEGRATION_BODY_AUDIT.json`]:
    '067a0dbfd0b8a022b144610ae9cb0dd2af6e2b1d85c3ce1c11320fb9ad9f8d98',
  [`${publicationRoot}/qa/INTEGRATION_BODY_AUDIT.md`]:
    'a3ffcc5e89358c93f314063089d05035ef1c6cb5d8849414c0591a1e46ca9d16',
  [`${publicationRoot}/qa/INTEGRATION_VALIDATION.json`]:
    'f5db5dad4884c7ec91a7d92e33a4a1c43bddeb39bcdb0985905e084bf15c656d',
  [`${publicationRoot}/qa/SYNTHETIC_REPLAY.json`]:
    '91ba99b873d5c41a036f5e6ffe56e91d4049e765f3a91f03623a6bd9ea864804',
});

const expectedReplayChecks = Object.freeze([
  {
    checker: `${sourceTreeRoot}/rh_attack_cycle_20261030/superwire_channel_attack/check_channel_algebra.py`,
    output: `${sourceTreeRoot}/rh_attack_cycle_20261030/superwire_channel_attack/CHANNEL_ALGEBRA_EXACT_CHECKS.json`,
    outputFile: 'CHANNEL_ALGEBRA_EXACT_CHECKS.json',
    outputSha256: '3400788f5afdb8ff50db9a4069a23c23ea590a0ccffdd58deacc7aa23b035f45',
    requiresSympy: false,
  },
  {
    checker: `${sourceTreeRoot}/rh_attack_cycle_20261030/triangle_channel_bridge/check_triangle_channel_algebra.py`,
    output: `${sourceTreeRoot}/rh_attack_cycle_20261030/triangle_channel_bridge/EXACT_ALGEBRA_CHECKS.json`,
    outputFile: 'EXACT_ALGEBRA_CHECKS.json',
    outputSha256: '71e82d81f1f166327657f1ed472eaa718890833ef6129462b918aa49bcc1b425',
    requiresSympy: true,
  },
]);

function fail(message) {
  throw new Error(`RH channel-geometry publication audit: ${message}`);
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

async function parseJson(relativePath) {
  try {
    return JSON.parse(await readFile(fullPath(relativePath), 'utf8'));
  } catch (error) {
    fail(`cannot parse ${relativePath}: ${error.message}`);
  }
}

function assertSetEqual(actual, expected, message) {
  const missing = [...expected].filter((entry) => !actual.has(entry));
  const extra = [...actual].filter((entry) => !expected.has(entry));
  if (missing.length || extra.length) {
    fail(`${message}; missing=[${missing.join(', ')}], extra=[${extra.join(', ')}]`);
  }
}

async function assertRegularFile(relativePath) {
  const info = await lstat(fullPath(relativePath));
  if (info.isSymbolicLink()) fail(`publication file cannot be a symbolic link: ${relativePath}`);
  if (!info.isFile()) fail(`publication path is not a regular file: ${relativePath}`);
  return info;
}

async function assertNoPrivateOperationalData(relativePath) {
  const text = await readFile(fullPath(relativePath), 'utf8');
  const forbidden = [
    /https:\/\/chatgpt\.com\/c\//i,
    /plugin:\/\//i,
    /\/Users\/[A-Za-z0-9._-]+\//,
    /\/root\/[A-Za-z0-9._/-]+/,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(text)) fail(`private or operational locator remains in ${relativePath}: ${pattern}`);
  }
}

async function commandWorks(command, args) {
  try {
    await execFile(command, args, { timeout: 30_000, maxBuffer: 1024 * 1024 });
    return true;
  } catch {
    return false;
  }
}

async function resolveReplayPython() {
  const explicit = process.env.RH_CHANNEL_GEOMETRY_PYTHON;
  if (explicit) {
    if (!await commandWorks(explicit, ['-c', 'import sympy; assert sympy.__version__ == "1.14.0"'])) {
      fail('RH_CHANNEL_GEOMETRY_PYTHON does not provide SymPy 1.14.0');
    }
    return { command: explicit, prefix: [] };
  }

  if (await commandWorks('python3', ['-c', 'import sympy; assert sympy.__version__ == "1.14.0"'])) {
    return { command: 'python3', prefix: [] };
  }

  if (await commandWorks('uv', [
    'run', '--offline', '--with', 'sympy==1.14.0', 'python',
    '-c', 'import sympy; assert sympy.__version__ == "1.14.0"',
  ])) {
    return {
      command: 'uv',
      prefix: ['run', '--offline', '--with', 'sympy==1.14.0', 'python'],
    };
  }

  fail(
    'exact replay requested, but no Python with SymPy 1.14.0 is available; ' +
    'install the pinned dependency or set RH_CHANNEL_GEOMETRY_PYTHON',
  );
}

async function replaySyntheticChecks() {
  const runner = await resolveReplayPython();
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'rh-channel-geometry-replay-'));
  try {
    for (const [index, replay] of expectedReplayChecks.entries()) {
      const replayDirectory = path.join(temporaryRoot, `replay-${index + 1}`);
      await mkdir(replayDirectory, { recursive: true });
      const checkerCopy = path.join(replayDirectory, path.basename(replay.checker));
      await copyFile(fullPath(replay.checker), checkerCopy);
      const args = [...runner.prefix, checkerCopy];
      try {
        await execFile(runner.command, args, {
          cwd: replayDirectory,
          timeout: 120_000,
          maxBuffer: 4 * 1024 * 1024,
        });
      } catch (error) {
        fail(`synthetic checker failed (${replay.checker}): ${error.stderr || error.message}`);
      }
      const produced = await readFile(path.join(replayDirectory, replay.outputFile));
      const expected = await readFile(fullPath(replay.output));
      assert.equal(sha256(produced), replay.outputSha256, `replayed output digest drift: ${replay.output}`);
      assert.deepEqual(produced, expected, `replayed output is not byte-identical: ${replay.output}`);
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

assert.match(sourceCommit, gitObjectPattern, 'invalid source commit');
assert.match(sourceTree, gitObjectPattern, 'invalid source tree');
assert.match(sourceParent, gitObjectPattern, 'invalid source parent');
assert.match(provenanceSha256, sha256Pattern, 'invalid provenance SHA-256');
assert.match(bodySha256, sha256Pattern, 'invalid canonical-body SHA-256');
assert.notEqual(sourceCommit, sourceTree, 'source commit and tree must remain distinct pins');
assert.notEqual(sourceCommit, sourceParent, 'source commit and parent must remain distinct pins');

const provenanceBytes = await readFile(fullPath(provenancePath));
assert.equal(sha256(provenanceBytes), provenanceSha256, 'SOURCE_PROVENANCE.json SHA-256 drift');
const provenance = JSON.parse(provenanceBytes.toString('utf8'));
assert.equal(provenance.schemaVersion, 1, 'unexpected provenance schema');
assert.equal(provenance.status, 'LOCAL_INTEGRATION_SLICE_UNPUBLISHED', 'source-slice status boundary drift');
assert.equal(provenance.remoteCommit, null, 'frozen pre-publication provenance must not invent a remote commit');
assert.equal(provenance.privacyAndProvenanceTransformationsOnly, true, 'curation boundary drift');
assert.equal(provenance.mathematicalContentUnchanged, true, 'mathematical-content boundary drift');
assert.match(provenance.annularReviewBoundary || '', /Only the independently rederived T=X fixed-envelope precursor/, 'annular review boundary drift');
assert.match(provenance.analyticAvailability || '', /partial/, 'analytic availability must remain partial');

assert.equal(provenance.files?.length, 24, 'expected exactly 24 curated source files');
const originalPaths = new Set();
const repositoryPaths = new Set();
for (const item of provenance.files) {
  assert.ok(isSafeRepositoryPath(item.originalPath), `unsafe original path: ${item.originalPath}`);
  assert.ok(isSafeRepositoryPath(item.repoPath), `unsafe repository path: ${item.repoPath}`);
  assert.ok(item.repoPath.startsWith(`${sourceTreeRoot}/`), `curated source lies outside source tree: ${item.repoPath}`);
  if (originalPaths.has(item.originalPath)) fail(`duplicate original source path: ${item.originalPath}`);
  if (repositoryPaths.has(item.repoPath)) fail(`duplicate curated source path: ${item.repoPath}`);
  originalPaths.add(item.originalPath);
  repositoryPaths.add(item.repoPath);

  assert.match(item.originalSha256 || '', sha256Pattern, `invalid original SHA-256: ${item.originalPath}`);
  assert.match(item.curatedSha256 || '', sha256Pattern, `invalid curated SHA-256: ${item.repoPath}`);
  assert.ok(Number.isSafeInteger(item.bytes) && item.bytes > 0, `invalid byte count: ${item.repoPath}`);
  const info = await assertRegularFile(item.repoPath);
  assert.equal(info.size, item.bytes, `curated byte count drift: ${item.repoPath}`);
  const bytes = await readFile(fullPath(item.repoPath));
  assert.equal(sha256(bytes), item.curatedSha256, `curated SHA-256 drift: ${item.repoPath}`);

  assert.ok(Array.isArray(item.transformations), `transformations must be an array: ${item.repoPath}`);
  if (item.transformations.length === 0) {
    assert.equal(item.originalSha256, item.curatedSha256, `untransformed source hash drift: ${item.repoPath}`);
  } else {
    assert.notEqual(item.originalSha256, item.curatedSha256, `transformed source retained the original hash: ${item.repoPath}`);
    for (const transformation of item.transformations) {
      assert.equal(typeof transformation.kind, 'string', `transformation kind missing: ${item.repoPath}`);
      assert.ok(transformation.kind.length > 0, `empty transformation kind: ${item.repoPath}`);
      assert.ok(Number.isSafeInteger(transformation.occurrences) && transformation.occurrences > 0,
        `invalid transformation count: ${item.repoPath}`);
    }
  }
  await assertNoPrivateOperationalData(item.repoPath);
}

const sourceTreeFiles = new Set(await listFiles(sourceTreeRoot));
assertSetEqual(sourceTreeFiles, repositoryPaths, 'source-tree/provenance inventory mismatch');

const originalPins = provenance.originalProducerPinsVerified || {};
assert.equal(Object.keys(originalPins).length, 3, 'expected exactly three original producer pins');
for (const [originalPath, expectedDigest] of Object.entries(originalPins)) {
  const item = provenance.files.find((entry) => entry.originalPath === originalPath);
  assert.ok(item, `producer pin has no provenance entry: ${originalPath}`);
  assert.equal(item.originalSha256, expectedDigest, `producer pin drift: ${originalPath}`);
}

const packageFiles = new Set(await listFiles(publicationRoot));
assertSetEqual(
  packageFiles,
  new Set([...repositoryPaths, ...expectedPackageMetadata]),
  'channel-geometry package inventory mismatch',
);
assertSetEqual(
  new Set(Object.keys(expectedPackageMetadataDigests)),
  expectedPackageMetadata,
  'package metadata digest inventory mismatch',
);
for (const [relativePath, expectedDigest] of Object.entries(expectedPackageMetadataDigests)) {
  assert.match(expectedDigest, sha256Pattern, `invalid package metadata SHA-256: ${relativePath}`);
  await assertRegularFile(relativePath);
  assert.equal(
    sha256(await readFile(fullPath(relativePath))),
    expectedDigest,
    `package metadata SHA-256 drift: ${relativePath}`,
  );
  await assertNoPrivateOperationalData(relativePath);
}

const jsonPaths = [...packageFiles].filter((relativePath) => relativePath.endsWith('.json'));
for (const relativePath of jsonPaths) await parseJson(relativePath);

const bodyInfo = await assertRegularFile(bodyPath);
const bodyBytes = await readFile(fullPath(bodyPath));
assert.equal(bodyInfo.size, bodySizeBytes, 'canonical body byte count drift');
assert.equal(sha256(bodyBytes), bodySha256, 'canonical body SHA-256 drift');
await assertNoPrivateOperationalData(bodyPath);

const bodyAuditPath = `${publicationRoot}/qa/INTEGRATION_BODY_AUDIT.json`;
const validationPath = `${publicationRoot}/qa/INTEGRATION_VALIDATION.json`;
const replayReceiptPath = `${publicationRoot}/qa/SYNTHETIC_REPLAY.json`;
const dependencyPath = `${publicationRoot}/ANALYTIC_DEPENDENCIES.md`;
const [bodyAudit, validation, replayReceipt, dependencyText] = await Promise.all([
  parseJson(bodyAuditPath),
  parseJson(validationPath),
  parseJson(replayReceiptPath),
  readFile(fullPath(dependencyPath), 'utf8'),
]);

assert.equal(bodyAudit.status, 'PASS_SCOPED_INTEGRATION_BODY_REVIEW', 'body-audit status drift');
assert.equal(bodyAudit.body_path, bodyPath, 'body-audit path drift');
assert.equal(bodyAudit.body_sha256, bodySha256, 'body-audit SHA-256 drift');
assert.equal(bodyAudit.display_math_blocks, 45, 'display-math inventory drift');
assert.equal(bodyAudit.inline_math_expressions, 112, 'inline-math inventory drift');
assert.equal(bodyAudit.curated_source_files_checked, 24, 'body-audit source inventory drift');
assert.equal(bodyAudit.changed_accepted_sources, false, 'accepted-source boundary drift');
assert.equal(bodyAudit.remote_actions, false, 'frozen source audit must not claim remote actions');
assert.match(bodyAudit.checks?.annular_scope || '', /T=X=exp\(2b\), fixed smooth U precursor only/, 'body-audit annular scope drift');
assert.match(bodyAudit.checks?.physical_head || '', /incomplete transitive proof tree disclosed/, 'body-audit dependency boundary drift');

assert.equal(validation.status, 'PASS_LOCAL_INTEGRATION_SLICE_WITH_EXPLICIT_PUBLICATION_GATE', 'integration-validation status drift');
assert.equal(validation.originalAndCuratedSourcePins, 24, 'validation source-pin count drift');
assert.equal(validation.bodySha256, bodySha256, 'validation canonical-body SHA-256 drift');
assert.equal(validation.sourceManifestSha256, provenanceSha256, 'validation provenance SHA-256 drift');
assert.equal(validation.privacyScan, 'PASS', 'validation privacy scan is not passing');
assert.equal(validation.missingProvenanceRejected, true, 'publication gate no longer rejects missing provenance');
assert.ok(validation.notRun?.includes('remote publication or registration'), 'frozen validation publication boundary is missing');

assert.equal(replayReceipt.scope, 'Synthetic algebra only; not actual-prime numerical certification', 'synthetic replay scope drift');
assert.equal(replayReceipt.checks?.length, expectedReplayChecks.length, 'synthetic replay inventory drift');
for (const expected of expectedReplayChecks) {
  const receipt = replayReceipt.checks.find((entry) => entry.checker === expected.checker);
  assert.ok(receipt, `synthetic replay receipt is missing: ${expected.checker}`);
  assert.equal(receipt.status, 'PASS_BYTE_IDENTICAL', `synthetic replay status drift: ${expected.checker}`);
  assert.equal(receipt.output_sha256, expected.outputSha256, `synthetic replay digest drift: ${expected.checker}`);
  const outputBytes = await readFile(fullPath(expected.output));
  assert.equal(sha256(outputBytes), expected.outputSha256, `checked-in synthetic output drift: ${expected.output}`);
}

assert.match(dependencyText, /complete transitive action\/Gram\/domain tree\s+is not included/, 'analytic dependency boundary drift');
assert.match(dependencyText, /cofinal coverage and RH remain unproved/, 'RH stopping boundary drift');
assert.match(dependencyText, /synthetic\s+matrix countermodels do not establish negative actual Weil vectors/i,
  'synthetic countermodel boundary drift');

await assertRegularFile(adapterPath);
const contractSource = await readFile(fullPath('src/data/rh-research/module-contract.js'), 'utf8');
const contractUrl = `data:text/javascript;base64,${Buffer.from(contractSource).toString('base64')}`;
const rawAdapterSource = await readFile(fullPath(adapterPath), 'utf8');
const adapterSource = rawAdapterSource.replace(
  "import { createResearchModule } from './module-contract.js';",
  `import { createResearchModule } from '${contractUrl}';`,
);
assert.notEqual(adapterSource, rawAdapterSource, 'app adapter contract import is missing or changed');
const adapterUrl = `data:text/javascript;base64,${Buffer.from(adapterSource).toString('base64')}`;
const adapterExports = await import(adapterUrl);
const moduleRecord = adapterExports.CHANNEL_GEOMETRY || adapterExports.default;
assert.ok(moduleRecord, 'channel-geometry app adapter export is missing');
assert.equal(moduleRecord.id, 'channel-geometry', 'app module id drift');
assert.equal(moduleRecord.route, '/rh-channel-geometry', 'app route drift');
assert.equal(moduleRecord.status, 'proved-analytic', 'app result-class drift');
assert.equal(moduleRecord.reviewStatus, 'accepted', 'app review-status drift');
assert.equal(moduleRecord.reviewScope, 'internal', 'app review-scope drift');
assert.equal(moduleRecord.rhStatus, 'open', 'app RH-status drift');
assert.equal(moduleRecord.bodyPath, bodyPath, 'app canonical-body path drift');
assert.equal(moduleRecord.verification?.reproducibilityStatus, 'partial', 'app reproducibility boundary drift');
assert.equal(moduleRecord.provenance?.sourceManifestPath, provenancePath, 'app provenance path drift');
assert.ok(moduleRecord.verification?.artifacts?.some((artifact) =>
  artifact.path === bodyPath &&
  artifact.sha256 === bodySha256 &&
  artifact.sizeBytes === bodySizeBytes &&
  artifact.requiredForClaim === true &&
  artifact.availability === 'available'), 'app canonical-body artifact pin is missing');
assert.ok(moduleRecord.verification?.artifacts?.some((artifact) =>
  artifact.path === provenancePath &&
  artifact.sha256 === provenanceSha256 &&
  artifact.requiredForClaim === true &&
  artifact.availability === 'available'), 'app provenance artifact pin is missing');
const sourceRefs = moduleRecord.provenance?.sourceRefs || [];
assert.ok(sourceRefs.length > 0, 'app source reference is missing');
for (const sourceRef of sourceRefs) {
  assert.equal(sourceRef.repository, 'judegomila/mathexplorer', 'app source repository drift');
  assert.equal(sourceRef.branch, sourceBranch, 'app source branch drift');
  assert.equal(sourceRef.commit, sourceCommit, 'app source commit drift');
  assert.equal(sourceRef.access, 'private-repository', 'app source access boundary drift');
}

if (replayRequested) await replaySyntheticChecks();

console.log(
  `RH channel-geometry publication audit: PASS (${provenance.files.length} curated sources; ` +
  `body ${bodySha256.slice(0, 12)}; source ${sourceCommit.slice(0, 12)} ` +
  `tree ${sourceTree.slice(0, 12)} parent ${sourceParent.slice(0, 12)}; ` +
  `${replayRequested ? '2 byte-identical synthetic replays' : 'static replay receipts verified'})`,
);
