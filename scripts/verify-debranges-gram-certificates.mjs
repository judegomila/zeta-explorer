#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CERTIFICATE_SCHEMA = 'debranges-gram-certificate/v1';
const CASE_SCHEMA = 'debranges-gram-case/v1';
const STATUSES = new Set([
  'CERTIFIED-POSITIVE-FINITE-GRAM',
  'CERTIFIED-NEGATIVE-WITNESS',
  'INCONCLUSIVE',
]);
const SHA256_RE = /^[0-9a-f]{64}$/;
const INTEGER_OR_DECIMAL_RE = /^[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
const FRACTION_RE = /^[+-]?\d+\/\d+$/;
const MAX_ARTIFACT_BYTES = 16 * 1024 * 1024;
const SCOPE = 'Only the finite sampled Gram matrix at the listed nodes is classified; this is not a proof or disproof of the Riemann hypothesis.';

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), '..');
const cliArguments = process.argv.slice(2);
const selfTest = cliArguments.includes('--self-test');
const directoryArgument = cliArguments.find((argument) => !argument.startsWith('--'));
const artifactRoot = path.resolve(
  directoryArgument ?? path.join(repoRoot, 'public', 'certificates', 'debranges-gram'),
);

function fail(message) {
  throw new Error(message);
}

function requireCondition(condition, location, message) {
  if (!condition) fail(`${location}: ${message}`);
}

function requirePlainObject(value, location) {
  requireCondition(
    value !== null && typeof value === 'object' && !Array.isArray(value),
    location,
    'must be a JSON object',
  );
}

function requireExactKeys(value, expected, location) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  requireCondition(
    actual.length === wanted.length && actual.every((key, index) => key === wanted[index]),
    location,
    `must contain exactly: ${wanted.join(', ')}`,
  );
}

function parseJsonStrict(source, filename) {
  let cursor = 0;

  function syntax(message) {
    fail(`${filename}: invalid JSON at offset ${cursor} (${message})`);
  }

  function whitespace() {
    while (/[\u0009\u000a\u000d\u0020]/.test(source[cursor] ?? '')) cursor += 1;
  }

  function string() {
    if (source[cursor] !== '"') syntax('expected string');
    const start = cursor;
    cursor += 1;
    while (cursor < source.length) {
      const character = source[cursor];
      if (character === '"') {
        cursor += 1;
        try {
          return JSON.parse(source.slice(start, cursor));
        } catch (error) {
          syntax(error.message);
        }
      }
      if (character === '\\') {
        cursor += 1;
        const escape = source[cursor];
        if ('"\\/bfnrt'.includes(escape ?? '')) {
          cursor += 1;
          continue;
        }
        if (escape === 'u' && /^[0-9a-fA-F]{4}$/.test(source.slice(cursor + 1, cursor + 5))) {
          cursor += 5;
          continue;
        }
        syntax('invalid string escape');
      }
      if (character.charCodeAt(0) < 0x20) syntax('unescaped control character');
      cursor += 1;
    }
    syntax('unterminated string');
  }

  function number() {
    const token = source
      .slice(cursor)
      .match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/)?.[0];
    if (!token) syntax('invalid number');
    cursor += token.length;
    const value = Number(token);
    if (!Number.isFinite(value)) syntax('non-finite number');
    return value;
  }

  function array() {
    cursor += 1;
    whitespace();
    const result = [];
    if (source[cursor] === ']') {
      cursor += 1;
      return result;
    }
    while (true) {
      result.push(value());
      whitespace();
      if (source[cursor] === ']') {
        cursor += 1;
        return result;
      }
      if (source[cursor] !== ',') syntax('expected comma or closing bracket');
      cursor += 1;
      whitespace();
    }
  }

  function object() {
    cursor += 1;
    whitespace();
    const result = Object.create(null);
    const keys = new Set();
    if (source[cursor] === '}') {
      cursor += 1;
      return result;
    }
    while (true) {
      const key = string();
      if (keys.has(key)) syntax(`duplicate object key ${JSON.stringify(key)}`);
      keys.add(key);
      whitespace();
      if (source[cursor] !== ':') syntax('expected colon');
      cursor += 1;
      result[key] = value();
      whitespace();
      if (source[cursor] === '}') {
        cursor += 1;
        return result;
      }
      if (source[cursor] !== ',') syntax('expected comma or closing brace');
      cursor += 1;
      whitespace();
    }
  }

  function value() {
    whitespace();
    const character = source[cursor];
    if (character === '{') return object();
    if (character === '[') return array();
    if (character === '"') return string();
    for (const [token, result] of [
      ['true', true],
      ['false', false],
      ['null', null],
    ]) {
      if (source.startsWith(token, cursor)) {
        cursor += token.length;
        return result;
      }
    }
    if (character === '-' || /\d/.test(character ?? '')) return number();
    syntax('unexpected token');
  }

  const result = value();
  whitespace();
  if (cursor !== source.length) syntax('trailing content');
  return result;
}

function canonicalJson(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    requireCondition(Number.isSafeInteger(value), '$canonical', 'numbers must be safe integers');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }
  requirePlainObject(value, '$canonical');
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(',')}}`;
}

function sha256(value) {
  return createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');
}

function attachHashes(certificateWithoutHashes) {
  const certificate = structuredClone(certificateWithoutHashes);
  delete certificate.hashes;
  certificate.hashes = {
    inputSha256: sha256(certificate.input),
    caseSha256: sha256(certificate.input),
    formulaSha256: sha256(certificate.method),
    sourceSha256: certificate.provenance.source.aggregateSha256,
    proofPayloadSha256: sha256(certificate),
  };
  certificate.hashes.canonicalCertificateSha256 = sha256(certificate);
  return certificate;
}

function withoutKey(value, key) {
  const copy = { ...value };
  delete copy[key];
  return copy;
}

function requireSha256(value, location) {
  requireCondition(typeof value === 'string' && SHA256_RE.test(value), location, 'must be a lowercase SHA-256 hex digest');
}

function exactRationalShape(value, location) {
  requireCondition(typeof value === 'string', location, 'must be an exact rational string, never a JSON number');
  requireCondition(value === value.trim() && value.length > 0 && value.length <= 256, location, 'must be a bounded rational string without whitespace');
  requireCondition(INTEGER_OR_DECIMAL_RE.test(value) || FRACTION_RE.test(value), location, 'must be an integer, fraction, decimal, or decimal exponent');
  if (FRACTION_RE.test(value)) {
    const denominator = value.slice(value.indexOf('/') + 1);
    requireCondition(!/^0+$/.test(denominator), location, 'must not have a zero denominator');
  }
}

function isStrictlyPositiveExact(value) {
  if (value.startsWith('-')) return false;
  const coefficient = (value.startsWith('+') ? value.slice(1) : value)
    .split('/')[0]
    .split(/[eE]/)[0]
    .replace('.', '');
  return /[1-9]/.test(coefficient);
}

function verifyInput(input, location) {
  requirePlainObject(input, location);
  requireExactKeys(
    input,
    ['schemaVersion', 'id', 'a', 'nodes', 'precision_bits', 'theta_crosscheck'],
    location,
  );
  requireCondition(input.schemaVersion === CASE_SCHEMA, `${location}.schemaVersion`, `must equal ${CASE_SCHEMA}`);
  requireCondition(typeof input.id === 'string' && input.id.length > 0, `${location}.id`, 'must be a nonempty string');
  exactRationalShape(input.a, `${location}.a`);
  requireCondition(isStrictlyPositiveExact(input.a), `${location}.a`, 'must be strictly positive');
  requireCondition(Array.isArray(input.nodes) && input.nodes.length > 0, `${location}.nodes`, 'must be a nonempty array');
  input.nodes.forEach((node, index) => {
    const nodeLocation = `${location}.nodes[${index}]`;
    requirePlainObject(node, nodeLocation);
    requireCondition(
      Object.keys(node).length === 2 && Object.hasOwn(node, 're') && Object.hasOwn(node, 'im'),
      nodeLocation,
      'must contain exactly re and im',
    );
    exactRationalShape(node.re, `${nodeLocation}.re`);
    exactRationalShape(node.im, `${nodeLocation}.im`);
    requireCondition(isStrictlyPositiveExact(node.im), `${nodeLocation}.im`, 'must be strictly positive');
  });
  requireCondition(
    Array.isArray(input.precision_bits) && input.precision_bits.length > 0,
    `${location}.precision_bits`,
    'must be a nonempty precision ladder',
  );
  input.precision_bits.forEach((bits, index) => {
    requireCondition(Number.isSafeInteger(bits) && bits >= 64, `${location}.precision_bits[${index}]`, 'must be a safe integer of at least 64 bits');
    if (index > 0) {
      requireCondition(bits > input.precision_bits[index - 1], `${location}.precision_bits`, 'must be strictly increasing without duplicates');
    }
  });
  requirePlainObject(input.theta_crosscheck, `${location}.theta_crosscheck`);
  requireCondition(typeof input.theta_crosscheck.enabled === 'boolean', `${location}.theta_crosscheck.enabled`, 'must be boolean');
  if (input.theta_crosscheck.enabled) {
    requireExactKeys(input.theta_crosscheck, ['enabled', 'cutoff_u', 'theta_terms'], `${location}.theta_crosscheck`);
    exactRationalShape(input.theta_crosscheck.cutoff_u, `${location}.theta_crosscheck.cutoff_u`);
    requireCondition(isStrictlyPositiveExact(input.theta_crosscheck.cutoff_u), `${location}.theta_crosscheck.cutoff_u`, 'must be strictly positive');
    requireCondition(
      Number.isSafeInteger(input.theta_crosscheck.theta_terms) && input.theta_crosscheck.theta_terms > 0,
      `${location}.theta_crosscheck.theta_terms`,
      'must be a positive safe integer',
    );
  } else {
    requireExactKeys(input.theta_crosscheck, ['enabled'], `${location}.theta_crosscheck`);
  }
}

function verifyArbRecord(record, location) {
  requirePlainObject(record, location);
  requireExactKeys(record, ['ball', 'lowerEnclosure', 'upperEnclosure'], location);
  for (const key of ['ball', 'lowerEnclosure', 'upperEnclosure']) {
    requireCondition(typeof record[key] === 'string' && record[key].length > 0, `${location}.${key}`, 'must be a nonempty ball string');
    requireCondition(!/(?:nan|inf)/i.test(record[key]), `${location}.${key}`, 'must not contain a non-finite enclosure');
  }
}

function verifyAcbRecord(record, location) {
  requirePlainObject(record, location);
  requireExactKeys(record, ['real', 'imag'], location);
  verifyArbRecord(record.real, `${location}.real`);
  verifyArbRecord(record.imag, `${location}.imag`);
}

function verifyGramEnclosure(enclosure, location, expectedDimension) {
  requirePlainObject(enclosure, location);
  requireExactKeys(enclosure, ['dimension', 'entryOrder', 'entries', 'sha256'], location);
  requireCondition(enclosure.dimension === expectedDimension, `${location}.dimension`, 'must equal the finite node count');
  requireCondition(enclosure.entryOrder === 'row-major', `${location}.entryOrder`, 'must be row-major');
  requireCondition(Array.isArray(enclosure.entries) && enclosure.entries.length === expectedDimension, `${location}.entries`, 'must be a square row array');
  enclosure.entries.forEach((row, rowIndex) => {
    requireCondition(Array.isArray(row) && row.length === expectedDimension, `${location}.entries[${rowIndex}]`, 'must have the declared dimension');
    row.forEach((entry, columnIndex) => verifyAcbRecord(entry, `${location}.entries[${rowIndex}][${columnIndex}]`));
  });
  requireSha256(enclosure.sha256, `${location}.sha256`);
  requireCondition(
    enclosure.sha256 === sha256(withoutKey(enclosure, 'sha256')),
    `${location}.sha256`,
    'does not match the canonical Gram enclosure payload',
  );
}

function verifyAttempt(attempt, location, expectedDimension) {
  requirePlainObject(attempt, location);
  const baseKeys = [
    'precisionBits', 'status', 'reason', 'finiteGram',
    'finiteGramOnly', 'rhClaim', 'eigenAlgorithm',
  ];
  const optionalKeys = [
    'gramEnclosure', 'rho', 'midpointEigenvalues', 'weylMargins',
    'negativeWitness',
  ];
  requireCondition(
    baseKeys.every((key) => Object.hasOwn(attempt, key))
      && Object.keys(attempt).every((key) => baseKeys.includes(key) || optionalKeys.includes(key)),
    location,
    `has missing or unknown attempt fields; allowed fields are ${[...baseKeys, ...optionalKeys].join(', ')}`,
  );
  requireCondition(Number.isSafeInteger(attempt.precisionBits) && attempt.precisionBits >= 64, `${location}.precisionBits`, 'must be a safe integer of at least 64 bits');
  requireCondition(STATUSES.has(attempt.status), `${location}.status`, 'uses an unknown verdict');
  requireCondition(typeof attempt.reason === 'string' && attempt.reason.length > 0, `${location}.reason`, 'must be a nonempty string');
  requireCondition(attempt.finiteGramOnly === true, `${location}.finiteGramOnly`, 'must be true');
  requireCondition(attempt.rhClaim === false, `${location}.rhClaim`, 'must be false');
  requireCondition(typeof attempt.finiteGram === 'boolean', `${location}.finiteGram`, 'must be boolean');
  requireCondition(attempt.eigenAlgorithm === 'acb_mat.eig:rump', `${location}.eigenAlgorithm`, 'must name the certified Rump eigensolver');
  if (attempt.finiteGram) {
    requireCondition(Object.hasOwn(attempt, 'gramEnclosure'), `${location}.gramEnclosure`, 'is required for an evaluable finite Gram');
    verifyGramEnclosure(attempt.gramEnclosure, `${location}.gramEnclosure`, expectedDimension);
  } else {
    requireCondition(!Object.hasOwn(attempt, 'gramEnclosure'), `${location}.gramEnclosure`, 'must be absent when no finite Gram was evaluated');
  }
  if (attempt.status !== 'INCONCLUSIVE') {
    requireCondition(attempt.finiteGram === true, `${location}.finiteGram`, 'must be true for a decisive verdict');
    requireCondition(Object.hasOwn(attempt, 'rho'), `${location}.rho`, 'is required for a decisive verdict');
    requireCondition(Array.isArray(attempt.midpointEigenvalues), `${location}.midpointEigenvalues`, 'is required for a decisive verdict');
    requireCondition(Array.isArray(attempt.weylMargins), `${location}.weylMargins`, 'is required for a decisive verdict');
  }
  if (Object.hasOwn(attempt, 'rho')) verifyArbRecord(attempt.rho, `${location}.rho`);
  if (Object.hasOwn(attempt, 'midpointEigenvalues')) {
    requireCondition(attempt.midpointEigenvalues.length === expectedDimension, `${location}.midpointEigenvalues`, 'must have one record per matrix dimension');
    attempt.midpointEigenvalues.forEach((entry, index) => verifyAcbRecord(entry, `${location}.midpointEigenvalues[${index}]`));
  }
  if (Object.hasOwn(attempt, 'weylMargins')) {
    requireCondition(attempt.weylMargins.length === expectedDimension, `${location}.weylMargins`, 'must have one record per matrix dimension');
    attempt.weylMargins.forEach((entry, index) => verifyArbRecord(entry, `${location}.weylMargins[${index}]`));
  }
  if (attempt.status === 'CERTIFIED-NEGATIVE-WITNESS') {
    requirePlainObject(attempt.negativeWitness, `${location}.negativeWitness`);
    requireExactKeys(attempt.negativeWitness, ['midpointEigenvalueIndex', 'criterion'], `${location}.negativeWitness`);
    requireCondition(
      Number.isSafeInteger(attempt.negativeWitness.midpointEigenvalueIndex)
        && attempt.negativeWitness.midpointEigenvalueIndex >= 0
        && attempt.negativeWitness.midpointEigenvalueIndex < expectedDimension,
      `${location}.negativeWitness.midpointEigenvalueIndex`,
      'must select a matrix eigenvalue',
    );
    requireCondition(attempt.negativeWitness.criterion === 'lambda_upper(M)+rho_upper<0', `${location}.negativeWitness.criterion`, 'must use the certified negative criterion');
  } else {
    requireCondition(!Object.hasOwn(attempt, 'negativeWitness'), `${location}.negativeWitness`, 'is only allowed for a certified negative witness');
  }
}

function verifyHonestyFlags(record, location, { pointwise = false } = {}) {
  const finiteKey = pointwise ? 'finitePointwiseOnly' : 'finiteGramOnly';
  requireCondition(record[finiteKey] === true, `${location}.${finiteKey}`, 'must be true');
  requireCondition(record.rhClaim === false, `${location}.rhClaim`, 'must be false');
  requireCondition(record.rhSolved === false, `${location}.rhSolved`, 'must be false');
  requireCondition(record.claimComplete === false, `${location}.claimComplete`, 'must be false');
}

function verifyThetaTailRecord(record, location, { bOverA = false } = {}) {
  requirePlainObject(record, location);
  const baseKeys = [
    'boundExponentQ', 'retainedTermsUTail', 'omittedThetaTermsAllU', 'total',
  ];
  const allowedKeys = bOverA ? [...baseKeys, 'epsilon'] : baseKeys;
  requireExactKeys(record, allowedKeys, location);
  baseKeys.forEach((key) => verifyArbRecord(record[key], `${location}.${key}`));
  if (bOverA) {
    exactRationalShape(record.epsilon, `${location}.epsilon`);
    requireCondition(record.epsilon === '1', `${location}.epsilon`, 'must equal the backend majorant epsilon 1');
  }
}

function verifyThetaComponents(record, location, expected) {
  requirePlainObject(record, location);
  requireExactKeys(
    record,
    [
      'normalization', 'components', 'precisionBits', 'node', 'a', 'beta', 'q',
      'cutoffU', 'thetaTerms', 'finiteRectangle', 'tails', 'enclosures',
      'finitePointwiseOnly', 'rhClaim', 'rhSolved', 'claimComplete',
    ],
    location,
  );
  requireCondition(
    record.normalization === 'Xi(z)=8*integral_0^infinity Phi(u)*cos(2*z*u)du',
    `${location}.normalization`,
    'must retain the app theta normalization',
  );
  requireCondition(
    record.components === 'E_a(z)=A_a(z)-i*a*C_a(z); E_a#(z)=A_a(z)+i*a*C_a(z); C_a=B_a/a',
    `${location}.components`,
    'must identify the cancellation-preserving A and B/a components',
  );
  requireCondition(record.precisionBits === expected.precisionBits, `${location}.precisionBits`, 'must match the selected certificate precision');
  requirePlainObject(record.node, `${location}.node`);
  requireExactKeys(record.node, ['re', 'im'], `${location}.node`);
  requireCondition(record.node.re === expected.node.re, `${location}.node.re`, 'must match the requested node exactly');
  requireCondition(record.node.im === expected.node.im, `${location}.node.im`, 'must match the requested node exactly');
  requireCondition(record.a === expected.a, `${location}.a`, 'must match the requested bridge thickness exactly');
  requireCondition(record.beta === expected.node.im, `${location}.beta`, 'must equal the positive node imaginary part');
  exactRationalShape(record.q, `${location}.q`);
  requireCondition(record.cutoffU === expected.cutoffU, `${location}.cutoffU`, 'must match theta_crosscheck.cutoff_u exactly');
  requireCondition(record.thetaTerms === expected.thetaTerms, `${location}.thetaTerms`, 'must match theta_crosscheck.theta_terms');

  requirePlainObject(record.finiteRectangle, `${location}.finiteRectangle`);
  requireExactKeys(record.finiteRectangle, ['A', 'BOverA'], `${location}.finiteRectangle`);
  verifyAcbRecord(record.finiteRectangle.A, `${location}.finiteRectangle.A`);
  verifyAcbRecord(record.finiteRectangle.BOverA, `${location}.finiteRectangle.BOverA`);

  requirePlainObject(record.tails, `${location}.tails`);
  requireExactKeys(record.tails, ['A', 'BOverA'], `${location}.tails`);
  verifyThetaTailRecord(record.tails.A, `${location}.tails.A`);
  verifyThetaTailRecord(record.tails.BOverA, `${location}.tails.BOverA`, { bOverA: true });

  requirePlainObject(record.enclosures, `${location}.enclosures`);
  requireExactKeys(record.enclosures, ['A', 'BOverA', 'E', 'Esharp'], `${location}.enclosures`);
  Object.entries(record.enclosures).forEach(([key, value]) => {
    verifyAcbRecord(value, `${location}.enclosures.${key}`);
  });
  verifyHonestyFlags(record, location, { pointwise: true });
}

function verifyThetaNodeCheck(record, location, expected) {
  requirePlainObject(record, location);
  const baseKeys = [
    'nodeIndex', 'performed', 'overlap', 'EOverlap', 'EsharpOverlap', 'reason',
    'usedForVerdict', 'finitePointwiseOnly', 'rhClaim', 'rhSolved', 'claimComplete',
  ];
  const evidenceKeys = ['theta', 'completedXi'];
  requireCondition(
    baseKeys.every((key) => Object.hasOwn(record, key))
      && Object.keys(record).every((key) => baseKeys.includes(key) || evidenceKeys.includes(key)),
    location,
    `has missing or unknown node-check fields; allowed fields are ${[...baseKeys, ...evidenceKeys].join(', ')}`,
  );
  requireCondition(record.nodeIndex === expected.nodeIndex, `${location}.nodeIndex`, 'must equal its node-array index');
  for (const key of ['performed', 'overlap', 'EOverlap', 'EsharpOverlap']) {
    requireCondition(typeof record[key] === 'boolean', `${location}.${key}`, 'must be boolean');
  }
  requireCondition(typeof record.reason === 'string' && record.reason.length > 0, `${location}.reason`, 'must be a nonempty explanation');
  requireCondition(record.usedForVerdict === false, `${location}.usedForVerdict`, 'must be false');
  verifyHonestyFlags(record, location, { pointwise: true });
  requireCondition(record.overlap === (record.EOverlap && record.EsharpOverlap), `${location}.overlap`, 'must equal EOverlap && EsharpOverlap');

  if (record.performed) {
    requireExactKeys(record, [...baseKeys, ...evidenceKeys], location);
    requirePlainObject(record.completedXi, `${location}.completedXi`);
    requireExactKeys(record.completedXi, ['E', 'Esharp'], `${location}.completedXi`);
    verifyAcbRecord(record.completedXi.E, `${location}.completedXi.E`);
    verifyAcbRecord(record.completedXi.Esharp, `${location}.completedXi.Esharp`);
    verifyThetaComponents(record.theta, `${location}.theta`, expected);
    requireCondition(
      record.reason === (record.overlap
        ? 'theta-and-completed-xi-enclosures-overlap'
        : 'independent-enclosures-do-not-overlap'),
      `${location}.reason`,
      'must match the completed overlap result',
    );
  } else {
    requireExactKeys(record, baseKeys, location);
    requireCondition(record.overlap === false && record.EOverlap === false && record.EsharpOverlap === false, location, 'an incomplete node check cannot claim an overlap');
    requireCondition(record.reason.startsWith('theta-crosscheck-failed:'), `${location}.reason`, 'must identify a failed theta evaluation');
  }
}

function verifyThetaClassification(record, location, expectedDimension, expectedPrecisionBits) {
  requirePlainObject(record, location);
  const baseKeys = [
    'precisionBits', 'status', 'reason', 'finiteGram',
    'finiteGramOnly', 'rhClaim', 'eigenAlgorithm',
  ];
  const optionalKeys = ['rho', 'midpointEigenvalues', 'weylMargins', 'negativeWitness'];
  requireCondition(
    baseKeys.every((key) => Object.hasOwn(record, key))
      && Object.keys(record).every((key) => baseKeys.includes(key) || optionalKeys.includes(key)),
    location,
    `has missing or unknown classification fields; allowed fields are ${[...baseKeys, ...optionalKeys].join(', ')}`,
  );
  requireCondition(record.precisionBits === expectedPrecisionBits, `${location}.precisionBits`, 'must match the selected certificate precision');
  requireCondition(STATUSES.has(record.status), `${location}.status`, 'uses an unknown verdict');
  requireCondition(typeof record.reason === 'string' && record.reason.length > 0, `${location}.reason`, 'must be a nonempty explanation');
  requireCondition(record.finiteGram === true, `${location}.finiteGram`, 'must be true for a performed scaled Gram diagnostic');
  requireCondition(record.finiteGramOnly === true, `${location}.finiteGramOnly`, 'must be true');
  requireCondition(record.rhClaim === false, `${location}.rhClaim`, 'must be false');
  requireCondition(record.eigenAlgorithm === 'acb_mat.eig:rump', `${location}.eigenAlgorithm`, 'must name the certified Rump eigensolver');
  if (record.status !== 'INCONCLUSIVE') {
    requireCondition(Object.hasOwn(record, 'rho'), `${location}.rho`, 'is required for a decisive classification');
    requireCondition(Array.isArray(record.midpointEigenvalues), `${location}.midpointEigenvalues`, 'is required for a decisive classification');
    requireCondition(Array.isArray(record.weylMargins), `${location}.weylMargins`, 'is required for a decisive classification');
  }
  if (Object.hasOwn(record, 'rho')) verifyArbRecord(record.rho, `${location}.rho`);
  if (Object.hasOwn(record, 'midpointEigenvalues')) {
    requireCondition(record.midpointEigenvalues.length === expectedDimension, `${location}.midpointEigenvalues`, 'must have one record per matrix dimension');
    record.midpointEigenvalues.forEach((entry, index) => verifyAcbRecord(entry, `${location}.midpointEigenvalues[${index}]`));
  }
  if (Object.hasOwn(record, 'weylMargins')) {
    requireCondition(record.weylMargins.length === expectedDimension, `${location}.weylMargins`, 'must have one record per matrix dimension');
    record.weylMargins.forEach((entry, index) => verifyArbRecord(entry, `${location}.weylMargins[${index}]`));
  }
  if (record.status === 'CERTIFIED-NEGATIVE-WITNESS') {
    requirePlainObject(record.negativeWitness, `${location}.negativeWitness`);
    requireExactKeys(record.negativeWitness, ['midpointEigenvalueIndex', 'criterion'], `${location}.negativeWitness`);
    requireCondition(
      Number.isSafeInteger(record.negativeWitness.midpointEigenvalueIndex)
        && record.negativeWitness.midpointEigenvalueIndex >= 0
        && record.negativeWitness.midpointEigenvalueIndex < expectedDimension,
      `${location}.negativeWitness.midpointEigenvalueIndex`,
      'must select a matrix eigenvalue',
    );
    requireCondition(record.negativeWitness.criterion === 'lambda_upper(M)+rho_upper<0', `${location}.negativeWitness.criterion`, 'must use the certified negative criterion');
  } else {
    requireCondition(!Object.hasOwn(record, 'negativeWitness'), `${location}.negativeWitness`, 'is only allowed for a certified negative witness');
  }
}

function verifyScaledGramDiagnostic(record, location, theta, certificate) {
  requirePlainObject(record, location);
  const baseKeys = [
    'label', 'formula', 'domain', 'performed', 'usedForVerdict', 'finiteGramOnly',
    'rhClaim', 'rhSolved', 'claimComplete',
  ];
  const performedKeys = [...baseKeys, 'classification', 'gramEnclosure'];
  const incompleteKeys = [...baseKeys, 'reason'];
  requireCondition(typeof record.performed === 'boolean', `${location}.performed`, 'must be boolean');
  requireExactKeys(record, record.performed ? performedKeys : incompleteKeys, location);
  requireCondition(record.label === 'EVIDENCE-ONLY-THETA-SCALED-GRAM', `${location}.label`, 'must label the diagnostic as evidence-only');
  requireCondition(
    record.formula === 'K_a(w,z)/a=(conj(C_a(w))*A_a(z)-conj(A_a(w))*C_a(z))/(pi*(conj(w)-z))',
    `${location}.formula`,
    'must retain the cancellation-preserving scaled-kernel formula',
  );
  requireCondition(record.domain === 'a>0 and the listed strict-upper-half-plane nodes', `${location}.domain`, 'must retain the finite diagnostic domain');
  requireCondition(record.usedForVerdict === false, `${location}.usedForVerdict`, 'must be false');
  verifyHonestyFlags(record, location);

  if (record.performed) {
    requireCondition(theta.performed === true && theta.allOverlaps === true, `${location}.performed`, 'requires all node evaluations and both independent enclosures to overlap');
    verifyThetaClassification(record.classification, `${location}.classification`, certificate.input.nodes.length, certificate.selectedPrecisionBits);
    verifyGramEnclosure(record.gramEnclosure, `${location}.gramEnclosure`, certificate.input.nodes.length);
  } else {
    requireCondition(typeof record.reason === 'string' && record.reason.length > 0, `${location}.reason`, 'must be a nonempty explanation');
    if (!theta.performed) {
      requireCondition(record.reason === 'theta-components-unavailable', `${location}.reason`, 'must identify incomplete theta components');
    } else if (!theta.allOverlaps) {
      requireCondition(record.reason === 'theta-crosscheck-nonoverlap-blocks-scaled-diagnostic', `${location}.reason`, 'must identify the independent-enclosure nonoverlap');
    } else {
      requireCondition(record.reason.startsWith('theta-scaled-gram-failed:'), `${location}.reason`, 'must identify a scaled-Gram backend failure');
    }
  }
}

function verifyThetaCrosscheck(theta, location, certificate) {
  requirePlainObject(theta, location);
  const requested = certificate.input.theta_crosscheck.enabled;
  const honestyKeys = [
    'requested', 'performed', 'usedForVerdict', 'finiteGramOnly', 'rhClaim',
    'rhSolved', 'claimComplete',
  ];
  requireCondition(theta.requested === requested, `${location}.requested`, 'must match the input request');
  requireCondition(typeof theta.performed === 'boolean', `${location}.performed`, 'must be boolean');
  requireCondition(theta.usedForVerdict === false, `${location}.usedForVerdict`, 'must be false');
  verifyHonestyFlags(theta, location);

  if (!requested) {
    requireExactKeys(theta, [...honestyKeys, 'reason'], location);
    requireCondition(theta.performed === false, `${location}.performed`, 'cannot be true when no theta crosscheck was requested');
    requireCondition(theta.reason === 'theta-crosscheck-not-requested', `${location}.reason`, 'must identify an unrequested crosscheck');
    return;
  }

  requireExactKeys(
    theta,
    [
      ...honestyKeys, 'selectedPrecisionBits', 'parameters',
      'allNodeEvaluationsCompleted', 'allOverlaps', 'nodeChecks', 'reason',
      'scaledGramDiagnostic',
    ],
    location,
  );
  requireCondition(theta.selectedPrecisionBits === certificate.selectedPrecisionBits, `${location}.selectedPrecisionBits`, 'must match the certificate selected precision');
  requirePlainObject(theta.parameters, `${location}.parameters`);
  requireExactKeys(theta.parameters, ['cutoffU', 'thetaTerms'], `${location}.parameters`);
  requireCondition(theta.parameters.cutoffU === certificate.input.theta_crosscheck.cutoff_u, `${location}.parameters.cutoffU`, 'must match the input cutoff exactly');
  requireCondition(theta.parameters.thetaTerms === certificate.input.theta_crosscheck.theta_terms, `${location}.parameters.thetaTerms`, 'must match the input theta-term count');
  requireCondition(typeof theta.allNodeEvaluationsCompleted === 'boolean', `${location}.allNodeEvaluationsCompleted`, 'must be boolean');
  requireCondition(typeof theta.allOverlaps === 'boolean', `${location}.allOverlaps`, 'must be boolean');
  requireCondition(Array.isArray(theta.nodeChecks) && theta.nodeChecks.length === certificate.input.nodes.length, `${location}.nodeChecks`, 'must contain one check per input node');
  theta.nodeChecks.forEach((nodeCheck, index) => verifyThetaNodeCheck(
    nodeCheck,
    `${location}.nodeChecks[${index}]`,
    {
      nodeIndex: index,
      node: certificate.input.nodes[index],
      a: certificate.input.a,
      cutoffU: theta.parameters.cutoffU,
      thetaTerms: theta.parameters.thetaTerms,
      precisionBits: theta.selectedPrecisionBits,
    },
  ));
  const allCompleted = theta.nodeChecks.every((nodeCheck) => nodeCheck.performed === true);
  const allOverlaps = theta.nodeChecks.every((nodeCheck) => nodeCheck.overlap === true);
  requireCondition(theta.performed === allCompleted, `${location}.performed`, 'must equal the aggregate node execution result');
  requireCondition(theta.allNodeEvaluationsCompleted === allCompleted, `${location}.allNodeEvaluationsCompleted`, 'must equal the aggregate node execution result');
  requireCondition(theta.allOverlaps === allOverlaps, `${location}.allOverlaps`, 'must equal the aggregate node overlap result');
  requireCondition(
    theta.reason === (!allCompleted
      ? 'theta-crosscheck-incomplete'
      : allOverlaps
        ? 'all-theta-and-completed-xi-enclosures-overlap'
        : 'theta-crosscheck-completed-with-nonoverlap'),
    `${location}.reason`,
    'must match the aggregate execution and overlap results',
  );
  verifyScaledGramDiagnostic(theta.scaledGramDiagnostic, `${location}.scaledGramDiagnostic`, theta, certificate);
}

function verifyCertificate(certificate, filename) {
  const root = filename;
  requirePlainObject(certificate, root);
  requireExactKeys(
    certificate,
    [
      'schemaVersion', 'input', 'status', 'selectedPrecisionBits',
      'finiteGramOnly', 'claimComplete', 'rhClaim', 'rhSolved', 'scope',
      'method', 'thetaCrosscheck', 'attempts', 'provenance', 'hashes',
    ],
    root,
  );
  requireCondition(certificate.schemaVersion === CERTIFICATE_SCHEMA, `${root}.schemaVersion`, `must equal ${CERTIFICATE_SCHEMA}`);
  verifyInput(certificate.input, `${root}.input`);
  requireCondition(STATUSES.has(certificate.status), `${root}.status`, 'uses an unknown verdict');
  requireCondition(Number.isSafeInteger(certificate.selectedPrecisionBits) && certificate.selectedPrecisionBits >= 64, `${root}.selectedPrecisionBits`, 'must be a safe integer of at least 64 bits');
  requireCondition(certificate.input.precision_bits.includes(certificate.selectedPrecisionBits), `${root}.selectedPrecisionBits`, 'must occur in input.precision_bits');

  requireCondition(certificate.finiteGramOnly === true, `${root}.finiteGramOnly`, 'must be true');
  requireCondition(certificate.claimComplete === false, `${root}.claimComplete`, 'must be false');
  requireCondition(certificate.rhClaim === false, `${root}.rhClaim`, 'must be false');
  requireCondition(certificate.rhSolved === false, `${root}.rhSolved`, 'must be false');
  requireCondition(certificate.scope === SCOPE, `${root}.scope`, 'must retain the exact finite-scope disclaimer');
  requirePlainObject(certificate.method, `${root}.method`);
  requireExactKeys(
    certificate.method,
    ['zetaDeflated', 'xi', 'Xi', 'E', 'Esharp', 'kernel', 'matrix', 'perturbation', 'eigenAlgorithm'],
    `${root}.method`,
  );
  for (const [key, value] of Object.entries(certificate.method)) {
    requireCondition(typeof value === 'string' && value.length > 0, `${root}.method.${key}`, 'must be a nonempty formula/method string');
  }
  requireCondition(certificate.method.eigenAlgorithm === 'acb_mat.eig:rump', `${root}.method.eigenAlgorithm`, 'must name the certified Rump eigensolver');
  verifyThetaCrosscheck(certificate.thetaCrosscheck, `${root}.thetaCrosscheck`, certificate);
  requireCondition(Array.isArray(certificate.attempts) && certificate.attempts.length > 0, `${root}.attempts`, 'must be a nonempty array');
  certificate.attempts.forEach((attempt, index) => {
    verifyAttempt(attempt, `${root}.attempts[${index}]`, certificate.input.nodes.length);
    requireCondition(attempt.precisionBits === certificate.input.precision_bits[index], `${root}.attempts[${index}].precisionBits`, 'must follow the input precision ladder in order');
    if (index < certificate.attempts.length - 1) {
      requireCondition(attempt.status === 'INCONCLUSIVE', `${root}.attempts[${index}].status`, 'only the final attempt may be decisive');
    }
  });
  const selectedAttempt = certificate.attempts.at(-1);
  requireCondition(
    selectedAttempt.precisionBits === certificate.selectedPrecisionBits && selectedAttempt.status === certificate.status,
    `${root}.attempts`,
    'final attempt must match the selected precision and verdict',
  );
  requirePlainObject(certificate.provenance, `${root}.provenance`);
  requireExactKeys(
    certificate.provenance,
    [
      'engine', 'engineVersion', 'pythonImplementation', 'pythonVersion',
      'pythonFlintVersion', 'flintVersion', 'flintRelease', 'arithmetic',
      'eigenAlgorithm', 'executableMajorMinor', 'source',
    ],
    `${root}.provenance`,
  );
  requireCondition(certificate.provenance.engine === 'rigorous-shear-gram', `${root}.provenance.engine`, 'must name the rigorous backend');
  requireCondition(certificate.provenance.pythonFlintVersion === '0.9.0', `${root}.provenance.pythonFlintVersion`, 'must equal the pinned backend version 0.9.0');
  requirePlainObject(certificate.provenance.source, `${root}.provenance.source`);
  requireExactKeys(certificate.provenance.source, ['files', 'aggregateSha256'], `${root}.provenance.source`);
  requireCondition(Array.isArray(certificate.provenance.source.files) && certificate.provenance.source.files.length > 0, `${root}.provenance.source.files`, 'must be a nonempty source manifest');
  certificate.provenance.source.files.forEach((entry, index) => {
    requirePlainObject(entry, `${root}.provenance.source.files[${index}]`);
    requireExactKeys(entry, ['path', 'sha256'], `${root}.provenance.source.files[${index}]`);
    requireCondition(typeof entry.path === 'string' && /^[A-Za-z0-9_.-]+\.py$/.test(entry.path), `${root}.provenance.source.files[${index}].path`, 'must be a package-local Python filename');
    requireSha256(entry.sha256, `${root}.provenance.source.files[${index}].sha256`);
  });
  requireSha256(certificate.provenance.source.aggregateSha256, `${root}.provenance.source.aggregateSha256`);
  requireCondition(
    certificate.provenance.source.aggregateSha256 === sha256(certificate.provenance.source.files),
    `${root}.provenance.source.aggregateSha256`,
    'does not match the canonical source manifest',
  );

  requirePlainObject(certificate.hashes, `${root}.hashes`);
  requireExactKeys(
    certificate.hashes,
    [
      'inputSha256', 'caseSha256', 'formulaSha256', 'sourceSha256',
      'proofPayloadSha256', 'canonicalCertificateSha256',
    ],
    `${root}.hashes`,
  );
  const {
    inputSha256,
    caseSha256,
    formulaSha256,
    sourceSha256,
    proofPayloadSha256,
    canonicalCertificateSha256,
  } = certificate.hashes;
  requireSha256(inputSha256, `${root}.hashes.inputSha256`);
  requireSha256(caseSha256, `${root}.hashes.caseSha256`);
  requireSha256(formulaSha256, `${root}.hashes.formulaSha256`);
  requireSha256(sourceSha256, `${root}.hashes.sourceSha256`);
  requireSha256(proofPayloadSha256, `${root}.hashes.proofPayloadSha256`);
  requireSha256(canonicalCertificateSha256, `${root}.hashes.canonicalCertificateSha256`);
  requireCondition(inputSha256 === sha256(certificate.input), `${root}.hashes.inputSha256`, 'does not match the canonical input payload');
  requireCondition(caseSha256 === inputSha256, `${root}.hashes.caseSha256`, 'must match the canonical input digest');
  requireCondition(formulaSha256 === sha256(certificate.method), `${root}.hashes.formulaSha256`, 'does not match the canonical method payload');
  requireCondition(sourceSha256 === certificate.provenance.source.aggregateSha256, `${root}.hashes.sourceSha256`, 'does not match source provenance');
  requireCondition(
    proofPayloadSha256 === sha256(withoutKey(certificate, 'hashes')),
    `${root}.hashes.proofPayloadSha256`,
    'does not match the canonical proof payload',
  );
  const certificateWithoutSelfHash = {
    ...certificate,
    hashes: withoutKey(certificate.hashes, 'canonicalCertificateSha256'),
  };
  requireCondition(
    canonicalCertificateSha256 === sha256(certificateWithoutSelfHash),
    `${root}.hashes.canonicalCertificateSha256`,
    'does not match the canonical certificate payload',
  );
}

async function verifyLocalSourceManifest(certificate, filename) {
  const sourceDirectory = path.join(repoRoot, 'rigorous', 'shear_gram');
  const entries = (await readdir(sourceDirectory, { withFileTypes: true }))
    .filter((entry) => entry.name.endsWith('.py'))
    .sort((left, right) => left.name.localeCompare(right.name));
  const manifest = [];
  for (const entry of entries) {
    requireCondition(entry.isFile(), `${filename}.provenance.source`, `${entry.name} must be a regular source file`);
    const contents = await readFile(path.join(sourceDirectory, entry.name));
    manifest.push({
      path: entry.name,
      sha256: createHash('sha256').update(contents).digest('hex'),
    });
  }
  requireCondition(
    canonicalJson(certificate.provenance.source.files) === canonicalJson(manifest),
    `${filename}.provenance.source.files`,
    'does not match the checked-in rigorous/shear_gram Python sources',
  );
}

function runSelfTests(certificate) {
  const tampered = structuredClone(certificate);
  tampered.input.a = tampered.input.a === '1' ? '2' : '1';
  let rejected = false;
  try {
    verifyCertificate(tampered, 'self-test-tampered.json');
  } catch {
    rejected = true;
  }
  requireCondition(rejected, 'self-test', 'payload tampering was not rejected');

  const dishonestPayload = structuredClone(certificate);
  dishonestPayload.rhSolved = true;
  const rehashedDishonest = attachHashes(dishonestPayload);
  rejected = false;
  try {
    verifyCertificate(rehashedDishonest, 'self-test-dishonest.json');
  } catch {
    rejected = true;
  }
  requireCondition(rejected, 'self-test', 'a rehashed RH claim was not rejected');

  const dishonestThetaPayload = structuredClone(certificate);
  dishonestThetaPayload.thetaCrosscheck.usedForVerdict = true;
  const rehashedDishonestTheta = attachHashes(dishonestThetaPayload);
  rejected = false;
  try {
    verifyCertificate(rehashedDishonestTheta, 'self-test-dishonest-theta.json');
  } catch {
    rejected = true;
  }
  requireCondition(rejected, 'self-test', 'a rehashed verdict-bearing theta crosscheck was not rejected');

  if (certificate.thetaCrosscheck.requested) {
    const dishonestScaledPayload = structuredClone(certificate);
    dishonestScaledPayload.thetaCrosscheck.scaledGramDiagnostic.usedForVerdict = true;
    const rehashedDishonestScaled = attachHashes(dishonestScaledPayload);
    rejected = false;
    try {
      verifyCertificate(rehashedDishonestScaled, 'self-test-dishonest-scaled-gram.json');
    } catch {
      rejected = true;
    }
    requireCondition(rejected, 'self-test', 'a rehashed verdict-bearing scaled theta Gram was not rejected');

    const aggregateMismatchPayload = structuredClone(certificate);
    aggregateMismatchPayload.thetaCrosscheck.allOverlaps = !aggregateMismatchPayload.thetaCrosscheck.allOverlaps;
    const rehashedAggregateMismatch = attachHashes(aggregateMismatchPayload);
    rejected = false;
    try {
      verifyCertificate(rehashedAggregateMismatch, 'self-test-theta-aggregate-mismatch.json');
    } catch {
      rejected = true;
    }
    requireCondition(rejected, 'self-test', 'a rehashed theta aggregate mismatch was not rejected');
  }

  rejected = false;
  try {
    parseJsonStrict('{"a":"1/8","a":"1/7"}', 'self-test-duplicate.json');
  } catch {
    rejected = true;
  }
  requireCondition(rejected, 'self-test', 'duplicate JSON keys were not rejected');
}

async function main() {
  let entries;
  try {
    entries = await readdir(artifactRoot, { withFileTypes: true });
  } catch (error) {
    fail(`certificate directory is unavailable: ${artifactRoot} (${error.message})`);
  }
  const jsonEntries = entries.filter((entry) => entry.name.endsWith('.json'));
  const certificates = [];
  for (const entry of jsonEntries) {
    requireCondition(entry.isFile(), entry.name, 'certificate must be a regular file');
    const filename = path.join(artifactRoot, entry.name);
    const source = await readFile(filename, 'utf8');
    requireCondition(Buffer.byteLength(source, 'utf8') <= MAX_ARTIFACT_BYTES, entry.name, 'certificate exceeds the 16 MiB safety limit');
    const certificate = parseJsonStrict(source, entry.name);
    verifyCertificate(certificate, entry.name);
    await verifyLocalSourceManifest(certificate, entry.name);
    certificates.push(certificate);
  }
  if (selfTest) {
    requireCondition(certificates.length > 0, 'self-test', 'requires at least one valid artifact');
    certificates.forEach(runSelfTests);
  }
  console.log(
    jsonEntries.length === 0
      ? `de Branges Gram certificate audit: no JSON artifacts present in ${artifactRoot}`
      : `de Branges Gram certificate audit: verified ${jsonEntries.length} artifact(s)${selfTest ? ' and passed tamper self-tests' : ''}`,
  );
}

main().catch((error) => {
  console.error(`de Branges Gram certificate audit failed: ${error.message}`);
  process.exitCode = 1;
});
