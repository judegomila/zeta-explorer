/**
 * Contract for app-visible RH research modules.
 *
 * The contract deliberately separates a mathematical statement from its
 * verification envelope and from the things it does not establish.  A module
 * is data, not a proof merely because it renders in the app.
 */

export const RH_RESEARCH_SCHEMA_VERSION = 1;

export const RH_RESEARCH_STATUSES = Object.freeze([
  'proved-identity',
  'proved-estimate',
  'proved-analytic',
  'certified-finite',
  'conditional-reduction',
  'failed-surrogate',
  'superseded',
  'open',
]);

export const RH_REVIEW_STATUSES = Object.freeze([
  'accepted',
  'conditional',
  'failed',
  'superseded',
  'open',
]);

// "accepted" is intentionally limited to repository-internal curation.  Peer
// review is a separate external fact and must not be inferred from this field.
export const RH_REVIEW_SCOPES = Object.freeze(['internal']);

export const RH_ARTIFACT_AVAILABILITY = Object.freeze([
  'available',
  'unavailable',
  'pending',
]);

export const RH_REPRODUCIBILITY_STATUSES = Object.freeze([
  'current-replay',
  'historical-unavailable',
  'partial',
  'not-applicable',
]);

export const RH_SOURCE_ACCESS = Object.freeze(['public', 'private-repository']);

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROUTE = /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SHA256 = /^[a-f0-9]{64}$/i;
const GIT_COMMIT = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i;
const RELATIVE_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/;
const RELATIVE_MARKDOWN = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+\.md$/;
const RELATIVE_JSON = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+\.json$/;
const SAFE_HREF = /^(?:\/(?!\/)[A-Za-z0-9._~!$&'()*+,;=:@%/?#-]*|https:\/\/[^\s]+)$/;

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

function requireRecord(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return false;
  }
  return true;
}

function requireText(value, path, errors) {
  if (!hasText(value)) errors.push(`${path} must be a non-empty string`);
}

function requireStringArray(value, path, errors, { min = 0 } = {}) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return;
  }
  if (value.length < min) errors.push(`${path} must contain at least ${min} item(s)`);
  value.forEach((item, index) => requireText(item, `${path}[${index}]`, errors));
}

function requireRelativePathArray(value, path, errors, { min = 0 } = {}) {
  requireStringArray(value, path, errors, { min });
  if (!Array.isArray(value)) return;
  value.forEach((item, index) => {
    if (hasText(item) && !RELATIVE_PATH.test(item)) {
      errors.push(`${path}[${index}] must be a safe repository-relative path`);
    }
  });
}

function validateOptionalHref(value, path, errors) {
  if (value === undefined) return;
  if (!hasText(value) || !SAFE_HREF.test(value)) {
    errors.push(`${path} must be an app-relative path or an HTTPS URL`);
  }
}

function requireObjectArray(value, path, errors, validator, { min = 0 } = {}) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return;
  }
  if (value.length < min) errors.push(`${path} must contain at least ${min} item(s)`);
  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (requireRecord(item, itemPath, errors)) validator(item, itemPath, errors);
  });
}

function validateEquation(equation, path, errors) {
  requireText(equation.id, `${path}.id`, errors);
  requireText(equation.tex, `${path}.tex`, errors);
  if (equation.label !== undefined) requireText(equation.label, `${path}.label`, errors);
  if (equation.explanation !== undefined) {
    requireText(equation.explanation, `${path}.explanation`, errors);
  }
}

function validateDerivationStep(step, path, errors) {
  requireText(step.id, `${path}.id`, errors);
  requireText(step.title, `${path}.title`, errors);
  requireText(step.body, `${path}.body`, errors);
  requireObjectArray(step.equations, `${path}.equations`, errors, validateEquation);
  if (step.notes !== undefined) requireStringArray(step.notes, `${path}.notes`, errors);
}

function validateCommand(command, path, errors) {
  requireText(command.label, `${path}.label`, errors);
  requireText(command.command, `${path}.command`, errors);
  if (command.cwd !== undefined) requireText(command.cwd, `${path}.cwd`, errors);
  if (command.expected !== undefined) requireText(command.expected, `${path}.expected`, errors);
}

function validateArtifact(artifact, path, errors) {
  requireText(artifact.label, `${path}.label`, errors);
  requireText(artifact.path, `${path}.path`, errors);
  if (typeof artifact.requiredForClaim !== 'boolean') {
    errors.push(`${path}.requiredForClaim must be a boolean`);
  }
  if (hasText(artifact.path) && !RELATIVE_PATH.test(artifact.path)) {
    errors.push(`${path}.path must be a safe repository-relative path`);
  }
  if (!RH_ARTIFACT_AVAILABILITY.includes(artifact.availability)) {
    errors.push(`${path}.availability must be one of ${RH_ARTIFACT_AVAILABILITY.join(', ')}`);
  }
  if (artifact.availability === 'available' && !SHA256.test(artifact.sha256 || '')) {
    errors.push(`${path}.sha256 must be a 64-character SHA-256 when the artifact is available`);
  }
  if (artifact.availability !== 'available') {
    requireText(artifact.note, `${path}.note`, errors);
  }
  if (artifact.sizeBytes !== undefined &&
      (!Number.isSafeInteger(artifact.sizeBytes) || artifact.sizeBytes < 0)) {
    errors.push(`${path}.sizeBytes must be a non-negative safe integer`);
  }
  validateOptionalHref(artifact.href, `${path}.href`, errors);
}

function validateReplay(replay, path, errors) {
  requireText(replay.label, `${path}.label`, errors);
  requireText(replay.method, `${path}.method`, errors);
  requireText(replay.outcome, `${path}.outcome`, errors);
  if (replay.command !== undefined) requireText(replay.command, `${path}.command`, errors);
  if (replay.evidence !== undefined) requireStringArray(replay.evidence, `${path}.evidence`, errors);
}

function validateEvidence(evidence, path, errors) {
  requireText(evidence.label, `${path}.label`, errors);
  requireText(evidence.kind, `${path}.kind`, errors);
  requireText(evidence.location, `${path}.location`, errors);
  if (evidence.note !== undefined) requireText(evidence.note, `${path}.note`, errors);
  validateOptionalHref(evidence.href, `${path}.href`, errors);
}

function validateBlocker(blocker, path, errors) {
  requireText(blocker.id, `${path}.id`, errors);
  requireText(blocker.title, `${path}.title`, errors);
  requireText(blocker.statement, `${path}.statement`, errors);
  if (blocker.physicsAnalogy !== undefined) {
    requireText(blocker.physicsAnalogy, `${path}.physicsAnalogy`, errors);
  }
  if (blocker.nextTest !== undefined) requireText(blocker.nextTest, `${path}.nextTest`, errors);
}

function validateSourceRef(source, path, errors) {
  requireText(source.repository, `${path}.repository`, errors);
  requireText(source.branch, `${path}.branch`, errors);
  requireText(source.commit, `${path}.commit`, errors);
  if (!RH_SOURCE_ACCESS.includes(source.access)) {
    errors.push(`${path}.access must be one of ${RH_SOURCE_ACCESS.join(', ')}`);
  }
  if (hasText(source.commit) && !GIT_COMMIT.test(source.commit)) {
    errors.push(`${path}.commit must be an immutable 40- or 64-character Git object id`);
  }
  requireRelativePathArray(source.paths, `${path}.paths`, errors, { min: 1 });
  validateOptionalHref(source.pullRequest, `${path}.pullRequest`, errors);
  if (source.note !== undefined) requireText(source.note, `${path}.note`, errors);
}

function validateFailure(failure, path, errors) {
  requireText(failure.id, `${path}.id`, errors);
  requireText(failure.title, `${path}.title`, errors);
  requireText(failure.surrogate, `${path}.surrogate`, errors);
  requireText(failure.failureStage, `${path}.failureStage`, errors);
  requireText(failure.implication, `${path}.implication`, errors);
  requireStringArray(failure.nonImplications, `${path}.nonImplications`, errors, { min: 1 });
  requireObjectArray(failure.evidence, `${path}.evidence`, errors, validateEvidence, { min: 1 });
}

/**
 * Validate a candidate module without mutating it.
 *
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateResearchModule(module) {
  const errors = [];
  if (!requireRecord(module, 'module', errors)) return { ok: false, errors };

  if (module.schemaVersion !== RH_RESEARCH_SCHEMA_VERSION) {
    errors.push(`schemaVersion must equal ${RH_RESEARCH_SCHEMA_VERSION}`);
  }
  requireText(module.id, 'id', errors);
  if (hasText(module.id) && !SLUG.test(module.id)) errors.push('id must be a lower-case kebab slug');
  requireText(module.route, 'route', errors);
  if (hasText(module.route) && !ROUTE.test(module.route)) {
    errors.push('route must be one lower-case kebab-case path segment');
  }
  requireText(module.title, 'title', errors);
  requireText(module.updatedAt, 'updatedAt', errors);
  if (hasText(module.updatedAt) && !ISO_DATE.test(module.updatedAt)) {
    errors.push('updatedAt must use YYYY-MM-DD');
  }
  if (!RH_RESEARCH_STATUSES.includes(module.status)) {
    errors.push(`status must be one of ${RH_RESEARCH_STATUSES.join(', ')}`);
  }
  if (module.reviewStatus !== undefined && !RH_REVIEW_STATUSES.includes(module.reviewStatus)) {
    errors.push(`reviewStatus must be one of ${RH_REVIEW_STATUSES.join(', ')}`);
  }
  if (module.reviewScope !== undefined && !RH_REVIEW_SCOPES.includes(module.reviewScope)) {
    errors.push(`reviewScope must be one of ${RH_REVIEW_SCOPES.join(', ')}`);
  }
  if (module.reviewStatus === 'accepted' && module.reviewScope !== 'internal') {
    errors.push("accepted reviewStatus requires reviewScope to be exactly 'internal'");
  }
  if (module.rhStatus !== 'open') errors.push("rhStatus must be exactly 'open'");
  requireText(module.summary, 'summary', errors);
  if (module.bodyPath !== undefined && !RELATIVE_MARKDOWN.test(module.bodyPath)) {
    errors.push('bodyPath must be a safe repository-relative .md path');
  }

  if (requireRecord(module.claimBoundary, 'claimBoundary', errors)) {
    if (module.claimBoundary.title !== undefined) {
      requireText(module.claimBoundary.title, 'claimBoundary.title', errors);
    }
    requireText(module.claimBoundary.statement, 'claimBoundary.statement', errors);
    requireStringArray(
      module.claimBoundary.doesNotClaim,
      'claimBoundary.doesNotClaim',
      errors,
      { min: 1 },
    );
  }

  if (requireRecord(module.theorem, 'theorem', errors)) {
    requireText(module.theorem.label, 'theorem.label', errors);
    requireText(module.theorem.statement, 'theorem.statement', errors);
    requireStringArray(module.theorem.hypotheses, 'theorem.hypotheses', errors);
    requireObjectArray(module.theorem.equations, 'theorem.equations', errors, validateEquation, { min: 1 });
  }

  requireObjectArray(module.derivation, 'derivation', errors, validateDerivationStep, { min: 1 });

  if (requireRecord(module.verification, 'verification', errors)) {
    if (module.verification.result !== undefined) {
      requireText(module.verification.result, 'verification.result', errors);
    }
    requireText(module.verification.scope, 'verification.scope', errors);
    if (!RH_REPRODUCIBILITY_STATUSES.includes(module.verification.reproducibilityStatus)) {
      errors.push(
        `verification.reproducibilityStatus must be one of ${RH_REPRODUCIBILITY_STATUSES.join(', ')}`,
      );
    }
    requireObjectArray(module.verification.commands, 'verification.commands', errors, validateCommand);
    requireObjectArray(module.verification.artifacts, 'verification.artifacts', errors, validateArtifact);
    requireObjectArray(module.verification.replays, 'verification.replays', errors, validateReplay);
    requireObjectArray(module.verification.evidence, 'verification.evidence', errors, validateEvidence, { min: 1 });
  }

  requireObjectArray(module.blockers, 'blockers', errors, validateBlocker, { min: 1 });

  if (requireRecord(module.provenance, 'provenance', errors)) {
    requireObjectArray(module.provenance.sourceRefs, 'provenance.sourceRefs', errors, validateSourceRef, { min: 1 });
    if (module.provenance.sourceManifestPath !== undefined &&
        !RELATIVE_JSON.test(module.provenance.sourceManifestPath)) {
      errors.push('provenance.sourceManifestPath must be a safe repository-relative .json path');
    }
    if (module.provenance.evidenceManifestPath !== undefined &&
        !RELATIVE_JSON.test(module.provenance.evidenceManifestPath)) {
      errors.push('provenance.evidenceManifestPath must be a safe repository-relative .json path');
    }
    if (module.provenance.curatorNote !== undefined) {
      requireText(module.provenance.curatorNote, 'provenance.curatorNote', errors);
    }
  }

  if (module.failures !== undefined) {
    requireObjectArray(module.failures, 'failures', errors, validateFailure);
  }
  if (module.references !== undefined) {
    requireStringArray(module.references, 'references', errors);
  }

  if (module.status === 'certified-finite' && isRecord(module.verification)) {
    if (module.verification.reproducibilityStatus === 'not-applicable') {
      errors.push('certified-finite modules cannot use not-applicable reproducibility');
    }
    if (!module.verification.artifacts?.length) {
      errors.push('certified-finite modules require at least one artifact record');
    }
    if (module.verification.reproducibilityStatus === 'current-replay') {
      if (!module.verification.commands?.length) {
        errors.push('current-replay certified-finite modules require a verification command');
      }
      const loadBearingArtifacts = module.verification.artifacts?.filter(
        (artifact) => artifact.requiredForClaim,
      ) || [];
      if (!loadBearingArtifacts.length) {
        errors.push('current-replay certified-finite modules require a load-bearing artifact');
      }
      if (loadBearingArtifacts.some((artifact) => artifact.availability !== 'available')) {
        errors.push('current-replay certified-finite modules require every load-bearing artifact to be available');
      }
      if (!module.verification.replays?.length) {
        errors.push('current-replay certified-finite modules require an independent replay record');
      }
    }
    if (module.verification.reproducibilityStatus === 'historical-unavailable' &&
        !module.verification.artifacts?.some(
          (artifact) => artifact.requiredForClaim && artifact.availability === 'unavailable',
        )) {
      errors.push(
        'historical-unavailable certified-finite modules require an unavailable load-bearing artifact record',
      );
    }
  }
  if (module.status === 'failed-surrogate' && !module.failures?.length) {
    errors.push('failed-surrogate modules require at least one failure record');
  }

  return { ok: errors.length === 0, errors };
}

export function assertResearchModule(module) {
  const result = validateResearchModule(module);
  if (!result.ok) {
    throw new TypeError(`Invalid RH research module:\n- ${result.errors.join('\n- ')}`);
  }
  return module;
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

export function createResearchModule(module) {
  return deepFreeze(assertResearchModule(module));
}

export function createResearchRegistry(modules) {
  if (!Array.isArray(modules)) throw new TypeError('RH research registry must be an array');
  const seenIds = new Set();
  const seenRoutes = new Set();
  const validated = modules.map((module, index) => {
    const entry = createResearchModule(module);
    if (seenIds.has(entry.id)) {
      throw new TypeError(`Duplicate RH research module id at index ${index}: ${entry.id}`);
    }
    if (seenRoutes.has(entry.route)) {
      throw new TypeError(`Duplicate RH research module route at index ${index}: ${entry.route}`);
    }
    seenIds.add(entry.id);
    seenRoutes.add(entry.route);
    return entry;
  });
  return Object.freeze(validated);
}

export default createResearchModule;
