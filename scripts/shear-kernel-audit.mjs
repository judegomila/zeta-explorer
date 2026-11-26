#!/usr/bin/env node

import {
  SHEAR_KERNEL_REPAIR,
  SHEAR_KERNEL_REPAIR_ASSERTIONS,
  divisorPhase,
  divisors,
  finiteGramTailVerdict,
} from '../src/data/shear-kernel-repair-2026-08-28.js';
import {
  IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY,
  IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY_ASSERTIONS,
} from '../src/data/imp-commutator-diagonal-positivity.js';

const blocks = [2, 3, 5, 6, 10, 12, 30];
const frequencies = [0, 2, 5, 10, 15, 20];

const blockRows = blocks.map((N) => ({
  N,
  tau: divisors(N).length,
  values: Object.fromEntries(frequencies.map((xi) => [xi, divisorPhase(N, xi)])),
  changesSignOnGrid: frequencies.some((xi) => divisorPhase(N, xi) < 0),
}));

const report = {
  id: SHEAR_KERNEL_REPAIR.id,
  grade: SHEAR_KERNEL_REPAIR.grade,
  claimComplete: SHEAR_KERNEL_REPAIR.claimComplete,
  rhSolved: SHEAR_KERNEL_REPAIR.rhSolved,
  continuumCorrection: IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY.status,
  assertions: {
    repair: SHEAR_KERNEL_REPAIR_ASSERTIONS.map((a) => ({ id: a.id, holds: a.holds() })),
    measureAudit: IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY_ASSERTIONS.map((a) => ({ id: a.id, holds: a.holds() })),
  },
  divisorBlocks: blockRows,
  finiteGramExamples: {
    positive: finiteGramTailVerdict(0.2, 4, 0.01),
    negative: finiteGramTailVerdict(-0.2, 4, 0.01),
    inconclusive: finiteGramTailVerdict(0.02, 4, 0.01),
  },
  openBackend: SHEAR_KERNEL_REPAIR.finiteCertificate.intervalBackend,
};

if ([...report.assertions.repair, ...report.assertions.measureAudit].some((a) => !a.holds)) {
  throw new Error('shear-kernel audit assertion failure');
}
if (report.claimComplete || report.rhSolved) {
  throw new Error('honesty tripwire: diagnostic must not claim RH completion');
}

console.log(JSON.stringify(report, null, 2));
