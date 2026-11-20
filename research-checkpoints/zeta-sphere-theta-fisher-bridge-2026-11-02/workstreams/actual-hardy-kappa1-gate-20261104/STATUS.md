# Status

- Implementation: prepared in an isolated workstream; the Ewald/direct-source
  factor-two normalization has been corrected after static audit.
- Numerical receipt: `PASS_CERTIFIED_ACTUAL_KAPPA1_J2`.
- Certified finite-rung margin:
  `Delta-R >= 0.35160252495552413165569305419921875`.
- The scalar Ewald head has certified lower bound
  `0.188212952199999965247769750931...` and independently overlaps the head
  reconstructed from the corrected Hardy gate.
- Governance: the initial supervisor was stopped before admission to repair
  the normalization; it had no worker or straggler.  The corrected supervisor
  admitted one worker only after its sampled 50% policy accumulated three
  safe samples.  Its final sample was 30% whole-Mac busy, 4CT remained
  protected, no protected process was signalled, and the queue completed.
- Expected resources: one process, one intended compute thread, with
  cooperative 120-CPU-second and 512-MiB checks.  These are not kernel hard
  caps. Typical runtime is expected to be seconds to low tens of seconds at
  4096 cells and 192-bit Arb precision.
- Remote state: no push, PR update, merge, or deployment performed.
- Protected state: no live 4CT or modular-run file or process was changed.
- Replay compatibility: a narrow temporary-overlay wrapper preserves the
  historical checker and receipt hashes across PR #40's single audited
  trailing-whitespace cleanup.  It rejects every unrecognized dependency
  hash and does not mutate the shared proof note.

The corrected exact replay command is recorded in
`ACTUAL_HARDY_KAPPA1_GATE_20261104.md`.  A second run reproduced every
non-runtime receipt field exactly.  This is one finite actual-theta rung; it
does not provide a uniform degree estimate or an RH conclusion.
