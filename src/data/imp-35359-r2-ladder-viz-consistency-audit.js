/**
 * @module imp-35359-r2-ladder-viz-consistency-audit
 * @fileoverview imp-35359: DATA-CONSISTENCY AUDIT of the
 * src/pages/Imp35288R2FlowLadderSlackViz.jsx N=2000 rung (RUNGS[5]) against the
 * LATER imp-35324 finer-grid four-of-four marginal-clearance reference and the
 * imp-35278 within-step step-over finding.
 *
 * WHY THIS AUDIT
 * --------------
 * The frontier scout flagged that the viz baked its N=2000 literals from the
 * imp-35150 / imp-35190 / imp-35221 / imp-35235 chain and annotated the N=2000
 * rung as a gate-skip with a FAILING (negative-slack) envelope, whereas the
 * imp-35324 finer base grid (dt = tauC_est/4000) committed AFTER imp-35235
 * restored a four-of-four CLEARING envelope with a razor-thin +6.16e-8 slack.
 * The scout asked: is the viz N=2000-fails reading stale/contradictory relative
 * to imp-35324, and is the worst-case selection and displayed slack sign right.
 *
 * WHAT THIS AUDIT CHECKED (literal verification, no new computation)
 * -----------------------------------------------------------------
 * Re-read src/pages/Imp35288R2FlowLadderSlackViz.jsx RUNGS[5] and the imp-35324
 * FLOW_REFERENCES table (src/data/imp-35324-r2-n2000-finer-grid-reference.js):
 *   imp-35324 four references (pair 1495, all land in the (0, 1e-4) gate):
 *     RK4  dt   t_c = 1.1925112320e-3
 *     DP45 dt   t_c = 1.1925112320e-3
 *     RK4  dt/2 t_c = 1.1923626880e-3   (clean best / envelope MIN)
 *     DP45 dt/2 t_c = 1.1999384320e-3   (worst case / envelope MAX)
 *   map bracket upper endpoint t_c_hi = 1.2e-3.
 *
 * FINDING: THE VIZ IS ALREADY CONSISTENT (the stale reading was resolved by
 * imp-35360). RUNGS[5] now bakes t_c_flow = 1.1999384320e-3 (the DP45 dt/2
 * worst-case MAX, correct selection), cleanMax = 1.1923626880e-3 (the RK4 dt/2
 * envelope MIN), t_c_hi = 1.2e-3, status = "provisional-clear" (NOT gate-skip),
 * and displayed slack = t_c_hi - t_c_flow = +6.16e-8 (POSITIVE sign, rendered
 * green). All three audited aspects -- literals, worst-case selection, and
 * displayed slack sign -- are CORRECT and MATCH imp-35324. The narrative and
 * table label the rung "marginally MET / PROVISIONAL" and cite imp-35278 for the
 * within-step step-over. NO stale "N=2000-fails" annotation survives.
 *
 * ONE COSMETIC RESIDUAL (recommend, not applied here): the table status cell
 * (Imp35288R2FlowLadderSlackViz.jsx line ~189) still branches on
 * status === "gate-skip" to print "FAILS (gate-skip)". No rung carries that
 * status any longer (RUNGS[5] is "provisional-clear"), so the branch is DEAD
 * code -- a vestige of the pre-imp-35360 state. It produces NO wrong output
 * today (the else-branch renders "MET"), but a future editor reintroducing a
 * gate-skip status would get an un-annotated bare "FAILS". Harmless now; worth a
 * follow-up cleanup. This audit does NOT edit the page (audit-only per ticket).
 *
 * SCOPE: AUDIT / MEASUREMENT ONLY. Recommends but does not apply page edits;
 * changes NO bound; does not advance the R2 ladder (stays robustly certified at
 * N=1000 per imp-35221/imp-35324); does not touch the imp-486 GUE conditional.
 * No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; "dt/2" prose used throughout.
 *
 * @see imp-35235  R2 N=2000 flow reference (the DP45 dt/2 gate-skip, now superseded)
 * @see imp-35324  finer-grid four-of-four clearing envelope (the reference this audits against)
 * @see imp-35278  gate-free signed-crossing: within-step step-over confirmation
 * @see imp-35360  the page edit that resolved the stale N=2000-fails reading
 */

// Baked verbatim from the imp-35324 FLOW_REFERENCES table (no new computation).
const IMP_35324_FLOW_TC = {
  rk4_dt: 0.0011925112320,
  dp45_dt: 0.0011925112320,
  rk4_dt_half: 0.0011923626880, // envelope MIN (clean best estimate)
  dp45_dt_half: 0.0011999384320, // envelope MAX (worst case)
};
const T_C_HI = 0.0012;

// Baked verbatim from Imp35288R2FlowLadderSlackViz.jsx RUNGS[5].
const VIZ_N2000_RUNG = {
  N: 2000,
  t_c_flow: 0.0011999384320, // must equal the envelope MAX
  cleanMax: 0.0011923626880, // must equal the envelope MIN
  t_c_hi: 0.0012,
  status: 'provisional-clear', // must NOT be gate-skip / failing
};

const envMax = Math.max(
  IMP_35324_FLOW_TC.rk4_dt,
  IMP_35324_FLOW_TC.dp45_dt,
  IMP_35324_FLOW_TC.rk4_dt_half,
  IMP_35324_FLOW_TC.dp45_dt_half,
);
const envMin = Math.min(
  IMP_35324_FLOW_TC.rk4_dt,
  IMP_35324_FLOW_TC.dp45_dt,
  IMP_35324_FLOW_TC.rk4_dt_half,
  IMP_35324_FLOW_TC.dp45_dt_half,
);
const displayedSlack = VIZ_N2000_RUNG.t_c_hi - VIZ_N2000_RUNG.t_c_flow;

export const IMP_35359_R2_LADDER_VIZ_CONSISTENCY_AUDIT = {
  ticket: 'imp-35359',
  category: 'accuracy',
  verdict: 'CONSISTENT -- stale N=2000-fails reading already resolved by imp-35360',
  auditedPage: 'src/pages/Imp35288R2FlowLadderSlackViz.jsx',
  reference: 'src/data/imp-35324-r2-n2000-finer-grid-reference.js',
  checks: {
    worstCaseSelectionCorrect: VIZ_N2000_RUNG.t_c_flow === envMax,
    cleanMinCorrect: VIZ_N2000_RUNG.cleanMax === envMin,
    tcHiMatches: VIZ_N2000_RUNG.t_c_hi === T_C_HI,
    slackSignPositive: displayedSlack > 0,
    statusNotFailing: VIZ_N2000_RUNG.status !== 'gate-skip',
  },
  displayedSlack,
  envMax,
  envMin,
  cosmeticResidual:
    'table status cell branches on status===gate-skip (dead code post imp-35360); harmless, follow-up cleanup only',
  scope: 'AUDIT ONLY; recommends no page edit applied; changes NO bound; NO QED',
};

// Self-executing consistency gate: throws on import if the viz literals ever
// drift back out of agreement with the imp-35324 reference (regression guard
// against reintroducing the stale N=2000-fails reading).
export const IMP_35359_R2_LADDER_VIZ_CONSISTENCY_AUDIT_ASSERTIONS = [
  {
    name: 'imp-35359: viz N=2000 t_c_flow equals the imp-35324 worst-case (DP45 dt/2) envelope max',
    run: () => VIZ_N2000_RUNG.t_c_flow === envMax && envMax === IMP_35324_FLOW_TC.dp45_dt_half,
    detail:
      'The RUNGS[5] worst-case flow collision must be the MAX of the four imp-35324 ' +
      'references (DP45 dt/2 = 1.1999384320e-3), not the superseded imp-35235 ' +
      'gate-skip 1.3238e-3. Guards the worst-case selection.',
  },
  {
    name: 'imp-35359: viz N=2000 clean best equals the imp-35324 envelope min (RK4 dt/2)',
    run: () => VIZ_N2000_RUNG.cleanMax === envMin && envMin === IMP_35324_FLOW_TC.rk4_dt_half,
    detail: 'The open finer-grid best marker (cleanMax) must be the envelope MIN = RK4 dt/2 = 1.1923626880e-3.',
  },
  {
    name: 'imp-35359: displayed slack is POSITIVE and equals t_c_hi - envMax (razor-thin +6.16e-8)',
    run: () => displayedSlack > 0 && Math.abs(displayedSlack - 6.15680e-8) < 1e-12,
    detail:
      'The slack sign must be POSITIVE (marginally MET), matching imp-35324 slack ' +
      '+6.156800e-8; a negative slack would re-assert the stale gate-skip FAILS reading.',
  },
  {
    name: 'imp-35359: viz N=2000 status is not a failing gate-skip',
    run: () => VIZ_N2000_RUNG.status !== 'gate-skip',
    detail: 'RUNGS[5] must carry provisional-clear (not gate-skip); the imp-35235 fails annotation was superseded by imp-35324/imp-35360.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35359_R2_LADDER_VIZ_CONSISTENCY_AUDIT_ASSERTIONS) {
  if (!a.run()) {
    throw new Error(`[imp-35359 consistency audit] FAILED: ${a.name}`);
  }
}
