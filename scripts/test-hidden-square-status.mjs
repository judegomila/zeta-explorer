#!/usr/bin/env node
// Focused record/UI and exact finite-algebra regressions; no research sweep.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import {
  HIDDEN_SQUARE_PROGRAM_SECTION as S,
  HIDDEN_SQUARE_PROGRAM_SECTION_ASSERTIONS as assertions,
} from '../src/data/hidden-square-program-section.js';

const page = await readFile(new URL('../src/pages/HiddenSquareProgramPage.jsx', import.meta.url), 'utf8');

test('the dated withdrawal takes precedence without erasing the historical record', () => {
  assert.equal(S.generatedAt, '2026-05-28T16:50:00Z');
  assert.equal(S.currentStatus.status, 'WITHDRAWN-AS-A-REDUCTION');
  assert.equal(S.currentStatus.effectiveDate, '2026-06-18');
  assert.match(S.currentStatus.reference, /section26-verdict/);
  assert.match(S.endpointHankel.keyConjecture27_2, /Historical Conjecture 27\.2.*withdrawn.*2026-06-18/);
  assert.match(S.endpointHankel.finiteWindowDiagnostic, /NOT empirical evidence/);
  assert.match(S.historicalImplicationsForRH.futureExperiment, /imp-1219-sub-volterra-norm-pilot/);
  for (const text of Object.values(S.chainOfReductions)) {
    assert.match(text, /^Historical May 28 proposal \(withdrawn June 18\):/);
  }
});

test('current implications cannot promote the historical pilot to arithmetic evidence', () => {
  assert.match(S.implicationsForRH.currentVerdict, /Withdrawn as a reduction/);
  assert.match(S.implicationsForRH.finiteEvidence, /not empirical evidence for no-ghost/);
  assert.match(S.implicationsForRH.finiteEvidence, /finite-only scope/);
  assert.match(S.implicationsForRH.historicalContext, /historical/);
  assert.match(page, /Object\.entries\(S\.implicationsForRH\)/);
  assert.doesNotMatch(page, /Object\.entries\(S\.historicalImplicationsForRH\)/);
});

test('P=1,S=2 refutes the generic norm biconditional but satisfies the exact criterion', () => {
  const c = S.relativePositivity.counterexample;
  assert.deepEqual(c, { passive: 1, shear: 2, kernel: 3, relative: 2 });
  assert.equal(c.kernel, c.passive + c.shear);
  assert.equal(c.relative, c.shear / c.passive);
  assert.equal(c.kernel >= 0, 1 + c.relative >= 0);
  assert.equal(Math.abs(c.relative) <= 1, false);
  assert.match(S.relativePositivity.scope, /Finite Hermitian.*positive definite.*Hermitian/);
  assert.equal(S.relativePositivity.criterionMath, 'K\\succeq0\\quad\\iff\\quad I+R\\succeq0');
  assert.match(S.relativePositivity.normStatus, /sufficient, not necessary/);
});

test('finite diagonal congruence and the sufficient norm gate have the stated direction', () => {
  for (const p of [0.25, 1, 4]) {
    for (const r of [-2, -1, -0.5, 0, 0.5, 1, 2]) {
      const s = p * r;
      assert.equal(p + s >= 0, 1 + r >= 0);
      if (Math.abs(r) <= 1) assert.ok(p + s >= 0);
    }
  }
});

test('the valid special off-diagonal block norm equivalence is preserved', () => {
  for (const v of [0, 0.5, 1, 2, -0.5, -2]) {
    const eigenvalues = [1 - Math.abs(v), 1 + Math.abs(v)];
    assert.equal(eigenvalues.every(x => x >= 0), Math.abs(v) <= 1);
  }
  assert.match(S.relativePositivity.specialCase, /symmetric spectrum.*off-diagonal block/);
  assert.match(page, /For a separately specified bounded operator V/);
  assert.ok(page.includes('\\begin{pmatrix} I & V_{a,\\Phi}'));
  assert.match(page, /Identifying this block with the arithmetic kernel is not established/);
});

test('the live page shares the corrected criterion and labels the old conjecture locally', () => {
  assert.match(page, /math=\{S\.relativePositivity\.criterionMath\}/);
  assert.match(page, /math=\{S\.relativePositivity\.counterexampleMath\}/);
  assert.match(page, /\{S\.relativePositivity\.limitations\}/);
  assert.match(page, /\{S\.currentStatus\.notice\}/);
  assert.match(page, /Historical Conj 27\.2 — withdrawn as a reduction \(2026-06-18\)/);
  assert.match(page, /HISTORICAL NORM DIAGNOSTIC · NOT ARITHMETIC EVIDENCE/);
  assert.doesNotMatch(page, /SURVIVING TARGET: RH-EQUIVALENT/);
  assert.doesNotMatch(page, /\\\|R\\\|.*\\iff.*K_a/);
  assert.doesNotMatch(page, /rigorous SOTA/);
  assert.match(S.endpointHankel.verdict, /Historical June 18 benchmark citation/);
});

test('finite scope, later retractions and cross-paired Wronskian remain intact', () => {
  assert.match(page, /§25–27 chain is retained below as a retracted route/);
  assert.match(page, /2026-08-28 CORRECTION/);
  assert.match(page, /The literal diagonal split is withdrawn/);
  assert.match(page, /finiteGramOnly=true · rhClaim=false · rhSolved=false · claimComplete=false/);
  assert.match(S.commutator.kernel, /E_a\(z\) E_a\^#\(w̄\) − E_a\^#\(z\) E_a\(w̄\)/);
  assert.match(S.commutator.wronskianForm, /A_a\(z\) B_a\(w̄\) − B_a\(z\) A_a\(w̄\)/);
  assert.match(S.relativePositivity.limitations, /Semidefinite.*infinite operators.*domain/);
});

test('newer finite-Gram/theta guards and diagnostic implementations are byte-preserved', () => {
  const start = page.indexOf('const FINITE_GRAM_STATUSES');
  const end = page.indexOf('export default function HiddenSquareProgramPage');
  assert.ok(start >= 0 && end > start);
  const hash = createHash('sha256').update(page.slice(start, end)).digest('hex');
  assert.equal(hash, '43ec3b932880ee37365cebc70d8d259fd9cf52f077456446e946e41451aaf6f8');
});

test('only this inspected record’s focused assertions run', () => {
  for (const item of assertions) {
    assert.equal(item.holds(), true, item.id);
  }
});
