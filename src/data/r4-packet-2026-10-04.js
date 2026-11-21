/**
 * @fileoverview r4-packet-2026-10-04 — persistent replay packet formalization/review-packet-sub0145 for the route-P / b145 consumer runs
 * (replaces the volatile /tmp copies for the consumer layer). One adversarial internal referee pass (tmp/r4-ref-packet-*): not refuted, minor.
 *
 * Command: `cd formalization/review-packet-sub0145 && ./replay.sh` (default tier: offline venv from wheels/, MANIFEST check, staging,
 *  25 runs + 7 assembly checks, ~6 min on 4 cores); `--deep` regenerates the consumed tables from upstream/ (44 runs total);
 *  `--trace` adds a PEP 578 file-access audit of the traced interpreter.
 *
 * Referee corrections applied:
 *  - Isolation: the PEP 578 hook does not cover subprocess children (R20, R24, R25). Replaced as evidence by an OS sandbox (macOS
 *    Seatbelt, repository outside the copy, /private/tmp and network denied): ./replay.sh --deep --trace → 44/44 runs, 7/7 checks, exit 0.
 *  - P-cert had no independent-code replay in the packet; the referee ran one (384 bits, two grids): U reproduced, 75,542 steps, 0 fails.
 *  - The WOL-C hypothesis size (630 band-path entries, 4 certified at r3) is not replayed by replay.sh; r3-outer-used2.py regenerates
 *    used_w002.json byte-identically (sha256 7d4d9aef…).
 *  - verify_lemma_B_hypotheses.py needs system FLINT only with --flint; default mode passes W, G, RH-win and H2 on the packet copies but
 *    stops on stack_X170.json (not packaged).
 *  - r2coef caches are regenerable: cc -O2 coef.c -lflint … then ./coef 690988 …; one regenerated cache matches its recorded hash.
 *  - replay.sh runs rm -rf on a user-supplied --venv path (destructive if misdirected). Default tier is 25 runs (the '19 runs' timing is old).
 *  - The packet is untracked in git; wheels/ and upstream/ are git-ignored local copies. Producer layer hashed, not re-executed.
 *
 * CERTIFIED (reproducibility only): the three values replay exactly. No mathematical status changes. Import-free.
 * ASSERTIONS recompute the stored-value decimals, b145 = max(U1, U2), the ordering checked by A5, and the run counts.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const lt = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d < c * b; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };

export const R4_PACKET = Object.freeze({
  id: 'r4-packet-2026-10-04',
  date: '2026-10-04',
  title: 'Replay packet review-packet-sub0145: one offline command reproduces b145, P-cert and P-cond exactly (44/44 deep, sandboxed)',
  status: 'CERTIFIED reproducibility of the consumer layer; producer layer hashed only; packet not yet committed. No value changes. NO QED.',
  path: 'formalization/review-packet-sub0145',
  command: './replay.sh',
  deepCommand: './replay.sh --deep --trace',
  runs: Object.freeze({ defaultRuns: 25, deepExtra: 19, assembly: 7 }),
  confirmations: Object.freeze([
    { by: 'author', cmd: './replay.sh --deep --trace', runs: '44/44', checks: '7/7', seconds: 3801.9 },
    { by: 'referee (Seatbelt sandbox, relocated copy)', cmd: './replay.sh --deep --trace', runs: '44/44', checks: '7/7', seconds: 2758.3 },
  ]),
  // r4 synthesis rerun of the default tier (2026-10-02 machine date; log tmp/r4-synth-out/replay_default.log): REPLAY PASS, exit 0
  synthesisRerun: Object.freeze({ cmd: './replay.sh', runs: '25/25', checks: '7/7', seconds: 232.5, exit: 0 }),
  packetSha256: '57e8d48665e1d34cb3b30720ab1a60bb2b3a2f4fe56849ccb3794e20c46d248a',
  manifestFiles: 560,
  values: Object.freeze({
    b145: '18409208597849/125000000000000', PcertR3: '73770784989943/500000000000000', PcondR3: '1448843462793/10000000000000',
    U2: '36063660805739/250000000000000', noR2: '29511133454807/200000000000000', taskMargins: '147541824070553/1000000000000000',
  }),
  verdict: 'The consumer layer of the three PT-height values is persisted, SHA-256 pinned and replayed by one offline command; the referee reproduced '
    + 'it under an OS sandbox (44/44, 7/7). Reproducibility only — no analytic input is refereed by the packet. The packet replays the r3 values; the '
    + 'r4 merged admission (synthesis) is not yet inside it. No refereed bound is changed. RH open. NO QED.',
});

const P = R4_PACKET;
export const R4_PACKET_ASSERTIONS = Object.freeze([
  {
    id: 'r4-packet-a5-ordering',
    holds: () => {
      const v = P.values;
      return lt(v.PcondR3, '145/1000') && lt('145/1000', v.b145) && lt(v.b145, v.PcertR3) && lt(v.PcertR3, v.taskMargins) && lt(v.taskMargins, v.noR2) && lt(v.noR2, '1758354/10000000')
        && lt(v.U2, v.b145) && Object.values(v).every((x) => exact15(x) !== null);
    },
    why: 'A5: P-cond < 0.145 < b145 < P-cert < P-cert(task margins) < noR2 < 0.1758354; b145 = max(U1, U2) = U1 since U2 < U1.',
  },
  { id: 'r4-packet-runs', holds: () => P.runs.defaultRuns + P.runs.deepExtra === 44 && P.synthesisRerun.runs === `${P.runs.defaultRuns}/${P.runs.defaultRuns}` && P.synthesisRerun.exit === 0 && P.confirmations.every((c) => c.runs === '44/44' && c.checks === '7/7') && /^[0-9a-f]{64}$/.test(P.packetSha256), why: '25 + 19 = 44 runs; both deep confirmations pass.' },
  { id: 'r4-packet-honest', holds: () => /Reproducibility only/.test(P.verdict) && /NO QED/.test(P.status) && /not yet committed/.test(P.status), why: 'Packet certifies arithmetic replay, not analytic inputs.' },
]);

export default R4_PACKET;
