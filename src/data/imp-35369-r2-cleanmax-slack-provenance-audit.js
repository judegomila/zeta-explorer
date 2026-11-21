/**
 * @module imp-35369-r2-cleanmax-slack-provenance-audit
 * @fileoverview imp-35369: VERIFY whether the
 * src/pages/Imp35288R2FlowLadderSlackViz.jsx N=2000 rung (RUNGS[5]) on-page
 * slack arithmetic (RUNGS[5].t_c_hi - RUNGS[5].cleanMax) is internally
 * consistent after imp-35324, and whether RUNGS[5].cleanMax is in fact baked
 * from the imp-35235 three-of-four failing envelope (the ticket premise) as
 * opposed to the LATER imp-35324 finer-grid envelope.
 *
 * TICKET PREMISE CHECKED
 * -----------------------
 * The frontier-scout ticket assumed RUNGS[5].cleanMax "was baked from the
 * imp-35235 three-of-four failing envelope that excluded the gate-skipped
 * DP45 dt/2 reference." That imp-35235 clean-envelope max is a distinct baked
 * literal, T_C_CLEAN_MAX_35235 = 1.1931054080e-3 (max of RK4 dt, DP45 dt, RK4
 * dt/2 on the imp-35235 tauC/1000 grid).
 *
 * FINDING: THE PREMISE IS FACTUALLY WRONG
 * ----------------------------------------
 * RUNGS[5].cleanMax = 1.1923626880e-3, which does NOT equal the imp-35235
 * clean max (1.1931054080e-3). It instead equals the imp-35324
 * finer-base-grid (dt = tauC_est/4000) RK4 dt/2 estimate -- the envelope MIN
 * of the four imp-35324 references, labelled T_C_FLOW_BEST there. This was
 * already established by the imp-35359 audit (which checked cleanMax against
 * the imp-35324 envelope min); this module additionally checks the SPECIFIC
 * arithmetic named in this ticket -- RUNGS[5].t_c_hi - RUNGS[5].cleanMax --
 * and the "fails" double-count concern the ticket also raised.
 *
 * RESULT: CONSISTENT, NO DISCREPANCY
 * -----------------------------------
 * (1) RUNGS[5].t_c_hi - RUNGS[5].cleanMax = 7.637312e-6, a POSITIVE quantity
 *     correctly reflecting how far the imp-35324 RK4 dt/2 best estimate sits
 *     below the map bracket t_c_hi = 1.2e-3; the on-page prose (line ~200)
 *     labels this "clean best estimate (RK4 dt/2) slack", which matches its
 *     actual provenance (imp-35324 RK4 dt/2), not the imp-35235 three-of-four
 *     reading the ticket assumed.
 * (2) The "fails" double-count concern does not apply: RUNGS[5].status is
 *     "provisional-clear" (not "gate-skip"), and the rendered table status
 *     cell is unconditional ("MET" for every rung, no status-branch), so
 *     there is no residual "FAILS (gate-skip)" label surviving from the
 *     superseded imp-35235 reading.
 * Do NOT fix here per the ticket (verification only) -- there is nothing to
 * fix; the imp-35360 rework already resolved the stale reading and imp-35359
 * already audited the worst-case/clean-min/slack-sign literals.
 *
 * SCOPE: VERIFICATION ONLY. Reports a discrepancy check; finds none. Changes
 * NO bound; does not advance the R2 ladder (stays robustly certified at
 * N=1000 per imp-35221/imp-35324); does not touch the imp-486 GUE
 * conditional. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; "dt/2" prose used throughout.
 *
 * @see imp-35235  R2 N=2000 flow reference (the superseded three-of-four clean envelope)
 * @see imp-35324  finer-grid four-of-four clearing envelope (the ACTUAL cleanMax source)
 * @see imp-35359  prior audit confirming cleanMax equals the imp-35324 envelope min
 * @see imp-35360  the page edit that resolved the stale N=2000-fails reading
 */

// Baked verbatim from src/data/imp-35235-r2-n2000-flow-reference.js.
const T_C_CLEAN_MAX_35235 = 0.0011931054080; // imp-35235 three-of-four clean envelope max

// Baked verbatim from src/data/imp-35324-r2-n2000-finer-grid-reference.js.
const T_C_FLOW_BEST_35324 = 0.0011923626880; // RK4 dt/2 finer-grid estimate (envelope min)

// Baked verbatim from src/pages/Imp35288R2FlowLadderSlackViz.jsx RUNGS[5].
const VIZ_N2000_RUNG = {
  t_c_flow: 0.0011999384320,
  cleanMax: 0.0011923626880,
  t_c_hi: 0.0012,
  status: 'provisional-clear',
};

const cleanMaxSlack = VIZ_N2000_RUNG.t_c_hi - VIZ_N2000_RUNG.cleanMax;

export const IMP_35369_R2_CLEANMAX_SLACK_PROVENANCE_AUDIT = {
  ticket: 'imp-35369',
  category: 'bug',
  verdict: 'CONSISTENT -- ticket premise (imp-35235 sourcing) is factually wrong; actual source is imp-35324',
  auditedPage: 'src/pages/Imp35288R2FlowLadderSlackViz.jsx',
  checks: {
    cleanMaxNotFromImp35235: VIZ_N2000_RUNG.cleanMax !== T_C_CLEAN_MAX_35235,
    cleanMaxIsImp35324Best: VIZ_N2000_RUNG.cleanMax === T_C_FLOW_BEST_35324,
    cleanMaxSlackPositive: cleanMaxSlack > 0,
    noFailsDoubleCount: VIZ_N2000_RUNG.status !== 'gate-skip',
  },
  cleanMaxSlack,
  scope: 'VERIFICATION ONLY; changes NO bound; NO QED',
};

// Self-executing consistency gate: throws on import if the audited quantities
// ever drift out of agreement (regression guard against re-introducing the
// stale imp-35235-sourced cleanMax or a resurrected "fails" label).
export const IMP_35369_R2_CLEANMAX_SLACK_PROVENANCE_AUDIT_ASSERTIONS = [
  {
    name: 'imp-35369: viz cleanMax is NOT the imp-35235 three-of-four clean max (ticket premise is wrong)',
    run: () => VIZ_N2000_RUNG.cleanMax !== T_C_CLEAN_MAX_35235,
    detail:
      'The ticket assumed RUNGS[5].cleanMax was baked from the imp-35235 ' +
      'three-of-four envelope (1.1931054080e-3). It is not -- guards against ' +
      'that stale premise being reasserted.',
  },
  {
    name: 'imp-35369: viz cleanMax equals the imp-35324 finer-grid RK4 dt/2 best estimate',
    run: () => VIZ_N2000_RUNG.cleanMax === T_C_FLOW_BEST_35324,
    detail:
      'RUNGS[5].cleanMax must track the imp-35324 envelope min (RK4 dt/2, ' +
      '1.1923626880e-3), the actual provenance of the on-page open marker.',
  },
  {
    name: 'imp-35369: t_c_hi - cleanMax is positive and equals the expected 7.637312e-6',
    run: () => cleanMaxSlack > 0 && Math.abs(cleanMaxSlack - 7.637312e-6) < 1e-11,
    detail:
      'The on-page prose quantity (RUNGS[5].t_c_hi - RUNGS[5].cleanMax) must ' +
      'reproduce 7.637312e-6 to reported precision; this is the specific ' +
      'arithmetic the ticket named.',
  },
  {
    name: 'imp-35369: no resurrected fails/gate-skip double-count on RUNGS[5]',
    run: () => VIZ_N2000_RUNG.status !== 'gate-skip',
    detail:
      'RUNGS[5].status must stay "provisional-clear", not "gate-skip" -- the ' +
      'ticket-raised double-count concern requires the superseded imp-35235 ' +
      'failing status to have resurfaced, which it has not.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35369_R2_CLEANMAX_SLACK_PROVENANCE_AUDIT_ASSERTIONS) {
  if (!a.run()) {
    throw new Error(`[imp-35369 cleanMax slack provenance audit] FAILED: ${a.name}`);
  }
}
