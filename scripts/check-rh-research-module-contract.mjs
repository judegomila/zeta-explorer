import { readFile } from 'node:fs/promises';

const contractUrl = new URL('../src/data/rh-research/module-contract.js', import.meta.url);
const contractSource = await readFile(contractUrl, 'utf8');
const contractDataUrl = `data:text/javascript;base64,${Buffer.from(contractSource).toString('base64')}`;
const { createResearchModule, createResearchRegistry, validateResearchModule } = await import(contractDataUrl);

// Synthetic contract fixture only. It is not imported by the app and makes no
// mathematical or numerical claim.
export const RH_RESEARCH_CONTRACT_FIXTURE = {
  schemaVersion: 1,
  id: 'contract-test-fixture',
  route: '/contract-test-fixture',
  title: 'Synthetic contract fixture',
  updatedAt: '2026-10-30',
  status: 'certified-finite',
  reviewStatus: 'accepted',
  reviewScope: 'internal',
  rhStatus: 'open',
  summary: 'Schema exercise only; this is not research evidence.',
  bodyPath: 'research-modules/contract-test-fixture.md',
  claimBoundary: {
    statement: 'This object tests required fields only.',
    doesNotClaim: ['It does not claim a theorem, computation, or progress on RH.'],
  },
  theorem: {
    label: 'Fixture statement',
    statement: 'A syntactically complete record can be validated.',
    hypotheses: ['The object is treated only as a test fixture.'],
    equations: [{ id: 'fixture-equation', tex: '1=1' }],
  },
  derivation: [{
    id: 'fixture-step',
    title: 'Exercise the derivation shape',
    body: 'No mathematical inference is asserted.',
    equations: [],
  }],
  verification: {
    scope: 'Contract validation only.',
    reproducibilityStatus: 'current-replay',
    commands: [{
      label: 'Run this checker',
      command: 'node scripts/check-rh-research-module-contract.mjs',
      expected: 'Prints a passing contract-check message.',
    }],
    artifacts: [{
      label: 'Synthetic digest field',
      path: 'test-fixtures/not-a-research-artifact.txt',
      requiredForClaim: true,
      availability: 'available',
      sha256: '0000000000000000000000000000000000000000000000000000000000000000',
    }],
    replays: [{
      label: 'Synthetic replay record',
      method: 'Run the same structural validator twice.',
      outcome: 'Both structural validations agree.',
    }],
    evidence: [{
      label: 'Contract source',
      kind: 'source',
      location: 'src/data/rh-research/module-contract.js',
    }],
  },
  blockers: [{
    id: 'fixture-not-evidence',
    title: 'Fixture is not evidence',
    statement: 'Curated theorem text and real verifier artifacts are still required.',
  }],
  provenance: {
    sourceManifestPath: 'research-modules/source-manifest.json',
    evidenceManifestPath: 'research-modules/evidence-manifest.json',
    sourceRefs: [{
      repository: 'judegomila/mathexplorer',
      branch: 'codex/rh-research-modules-2026-10-30',
      commit: '0000000000000000000000000000000000000000',
      access: 'private-repository',
      paths: ['scripts/check-rh-research-module-contract.mjs'],
    }],
    curatorNote: 'This source reference identifies test code, not mathematical evidence.',
  },
  failures: [],
  references: [],
};

const fixture = RH_RESEARCH_CONTRACT_FIXTURE;

const frozenFixture = createResearchModule(fixture);
if (!Object.isFrozen(frozenFixture) || !Object.isFrozen(frozenFixture.theorem)) {
  throw new Error('createResearchModule must deeply freeze accepted records');
}

const closedRh = structuredClone(fixture);
closedRh.rhStatus = 'proved';
if (!validateResearchModule(closedRh).errors.some((error) => error.includes('rhStatus'))) {
  throw new Error('validator accepted an RH-closed status');
}

const analyticTheorem = structuredClone(fixture);
analyticTheorem.status = 'proved-analytic';
analyticTheorem.verification.reproducibilityStatus = 'partial';
if (!validateResearchModule(analyticTheorem).ok) {
  throw new Error('validator rejected the proved-analytic result class');
}

const provedEstimate = structuredClone(fixture);
provedEstimate.status = 'proved-estimate';
provedEstimate.verification.reproducibilityStatus = 'partial';
if (!validateResearchModule(provedEstimate).ok) {
  throw new Error('validator rejected the proved-estimate result class');
}

const externalAcceptance = structuredClone(fixture);
externalAcceptance.reviewScope = 'peer-reviewed';
if (!validateResearchModule(externalAcceptance).errors.some((error) => error.includes('reviewScope'))) {
  throw new Error('validator allowed internal acceptance to masquerade as peer review');
}

const unsafeBodyPath = structuredClone(fixture);
unsafeBodyPath.bodyPath = '../private-notes/fixture.md';
if (!validateResearchModule(unsafeBodyPath).errors.some((error) => error.includes('bodyPath'))) {
  throw new Error('validator accepted a parent-traversing Markdown body path');
}

const mutableSourceRef = structuredClone(fixture);
mutableSourceRef.provenance.sourceRefs[0].commit = 'origin/main';
if (!validateResearchModule(mutableSourceRef).errors.some((error) => error.includes('immutable'))) {
  throw new Error('validator accepted a mutable branch name as a provenance commit');
}

const unsafeSourcePath = structuredClone(fixture);
unsafeSourcePath.provenance.sourceRefs[0].paths = ['../private-notes/fixture.md'];
if (!validateResearchModule(unsafeSourcePath).errors.some((error) => error.includes('sourceRefs'))) {
  throw new Error('validator accepted a parent-traversing source path');
}

const missingDigest = structuredClone(fixture);
delete missingDigest.verification.artifacts[0].sha256;
if (!validateResearchModule(missingDigest).errors.some((error) => error.includes('sha256'))) {
  throw new Error('validator accepted an available artifact without a SHA-256');
}

const unavailableCurrentCertificate = structuredClone(fixture);
unavailableCurrentCertificate.verification.artifacts[0] = {
  label: 'Missing synthetic artifact',
  path: 'test-fixtures/missing.txt',
  requiredForClaim: true,
  availability: 'unavailable',
  note: 'Intentionally absent for this negative contract check.',
};
if (!validateResearchModule(unavailableCurrentCertificate).errors.some((error) => error.includes('load-bearing artifact'))) {
  throw new Error('validator labeled an unavailable-only certificate as a current replay');
}

const mixedCurrentCertificate = structuredClone(fixture);
mixedCurrentCertificate.verification.artifacts.push({
  label: 'Missing load-bearing core',
  path: 'test-fixtures/missing-core.txt',
  requiredForClaim: true,
  availability: 'unavailable',
  note: 'The available regression fixture cannot replace this load-bearing core.',
});
if (!validateResearchModule(mixedCurrentCertificate).errors.some((error) => error.includes('every load-bearing'))) {
  throw new Error('validator let a small available artifact mask an unavailable load-bearing core');
}

const historicalCertificate = structuredClone(unavailableCurrentCertificate);
historicalCertificate.verification.reproducibilityStatus = 'historical-unavailable';
if (!validateResearchModule(historicalCertificate).ok) {
  throw new Error('validator rejected an explicitly historical-unavailable certificate');
}

const nonReproducibleCertificate = structuredClone(fixture);
nonReproducibleCertificate.verification.reproducibilityStatus = 'not-applicable';
if (!validateResearchModule(nonReproducibleCertificate).errors.some((error) => error.includes('cannot use not-applicable'))) {
  throw new Error('validator accepted not-applicable reproducibility for a finite certificate');
}

const incompleteFailure = structuredClone(fixture);
incompleteFailure.status = 'failed-surrogate';
incompleteFailure.failures = [{
  id: 'incomplete',
  title: 'Incomplete failure record',
  surrogate: 'A synthetic surrogate.',
  failureStage: 'Synthetic stage.',
  implication: 'Only the surrogate failed.',
  nonImplications: [],
  evidence: fixture.verification.evidence,
}];
if (!validateResearchModule(incompleteFailure).errors.some((error) => error.includes('nonImplications'))) {
  throw new Error('validator accepted a failed surrogate without non-implications');
}

const unsafeEvidenceLink = structuredClone(fixture);
unsafeEvidenceLink.verification.evidence[0].href = 'javascript:alert(1)';
if (!validateResearchModule(unsafeEvidenceLink).errors.some((error) => error.includes('href'))) {
  throw new Error('validator accepted an unsafe evidence link');
}

try {
  const duplicate = structuredClone(fixture);
  duplicate.title = 'Duplicate fixture';
  createResearchRegistry([fixture, duplicate]);
  throw new Error('registry accepted duplicate ids and routes');
} catch (error) {
  if (!/Duplicate RH research module/.test(error.message)) throw error;
}

console.log('RH research module contract: PASS');
