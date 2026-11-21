/**
 * @module imp-96134-number-variance-honesty-guard
 * @description imp-96134: overclaim-registry guard for the 2026-09-23 number-variance
 * / Route-M leaf modules (imp-96105, imp-96108, imp-96109, imp-96112, imp-96114).
 *
 * Each of these leaves already self-executes an inline honesty gate at import time,
 * but none of the five source files were wired into run-assertions DATA_MODULES, so
 * those inline throws never ran as part of the build sweep -- the exact gap this
 * guard closes, mirroring the imp-2967 cross-check pattern (a standalone registry
 * module the sweep DOES load).
 *
 * For each leaf this asserts its exported honest-status text still:
 *   - keeps RH open, either directly ("RH open" / "RH remains open") or via the
 *     "PCC/GRH-gated" hedge the zero-side leaves use instead
 *   - contains "NO QED" and never uses the word QED outside that phrase
 *   - contains the "Lambda <= 0.2" / "SOTA" Platt-Trudgian banner
 *   - never uses a promotion word (RIGOROUS, RH-follows, proves RH, QED alone)
 *
 * All five imports are light: none of the five leaf modules import anything
 * (verified zero `import` statements), so this module carries no zeros-bundle
 * dependency either.
 */

import {
  IMP96105_VERDICT,
  IMP96105_HONEST_BANNER,
} from './imp-96105-route-m-vasyunin-gram-extend-n6000.js';
import { IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR } from './imp-96108-number-variance-excursion-depth-vs-max-anchor.js';
import { IMP96109_T15E5_DIP_DECORRELATION_SAFETY_MARGIN } from './imp-96109-tue5-dip-decorrelation-safety-margin.js';
import { IMP96112_MAX_ANCHOR_MARGIN_WINDOW_ROBUSTNESS } from './imp-96112-max-anchor-margin-window-robustness.js';
import { IMP96114_MEAN_ANCHOR_DIP_ZSCORE_CROSSCHECK } from './imp-96114-mean-anchor-dip-zscore-crosscheck.js';

// Each entry's `text` is the honest-status prose the leaf module stands behind.
const GUARDED_LEAVES = [
  { id: 'imp-96105', text: IMP96105_HONEST_BANNER },
  { id: 'imp-96108', text: IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR.verdict },
  { id: 'imp-96109', text: IMP96109_T15E5_DIP_DECORRELATION_SAFETY_MARGIN.verdict },
  { id: 'imp-96112', text: IMP96112_MAX_ANCHOR_MARGIN_WINDOW_ROBUSTNESS.verdict },
  { id: 'imp-96114', text: IMP96114_MEAN_ANCHOR_DIP_ZSCORE_CROSSCHECK.verdict },
];

// Promotion words that would flip a measurement-only leaf into a claimed result.
const PROMOTION_RE = /\b(RIGOROUS|RH[- ]follows|RH is (?:true|proven|resolved)|proves? RH)\b/i;

export const IMP_96134_NUMBER_VARIANCE_HONESTY_GUARD_ASSERTIONS = GUARDED_LEAVES.flatMap(
  ({ id, text }) => [
    {
      id: `${id}-honesty-guard-keeps-rh-open`,
      holds: () => /RH (?:open|remains open)/.test(text) || /PCC\/GRH-gated/.test(text),
      why: `${id}'s honest-status text must keep asserting RH is open (directly, or via the PCC/GRH-gated hedge)`,
    },
    {
      id: `${id}-honesty-guard-keeps-no-qed`,
      holds: () => {
        const qedCount = (text.match(/QED/g) || []).length;
        const noQedCount = (text.match(/NO QED/g) || []).length;
        return noQedCount >= 1 && qedCount === noQedCount;
      },
      why: `${id} must carry "NO QED" and never use QED standing alone`,
    },
    {
      id: `${id}-honesty-guard-keeps-pt-sota`,
      holds: () => /Lambda <= 0\.2|refereed bound is changed/.test(text) && /refereed bound is changed/i.test(text),
      why: `${id} must keep citing Platt-Trudgian Lambda <= 0.2 as SOTA`,
    },
    {
      id: `${id}-honesty-guard-no-promotion`,
      holds: () => !PROMOTION_RE.test(text),
      why: `${id}'s verdict must never be promoted to RIGOROUS / RH-follows / a proof of RH`,
    },
  ],
);

for (const a of IMP_96134_NUMBER_VARIANCE_HONESTY_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96134-number-variance-honesty-guard assertion failed: ${a.id}`);
  }
}
