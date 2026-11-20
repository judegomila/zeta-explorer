# All-degree analytic search — status

The gated follow-on in `../all-degree-analytic-search-next-v1` is also
complete. Its exact EGF gate passed. Its finite scale sweep found that both
candidate polynomial layers reduce to ordinary parity Taylor behavior and
that odd-sector absolute payment loses roughly `10^(1.39 N^2)` cancellation.
The current analytic blocker is the residue-preserving signed Schur inequality
recorded in that workstream's `RESULTS.md`.

This workstream supersedes the escalating regional cell-count queue as the
overnight priority.  The completed degree-7/9 regional outputs remain useful
mechanism diagnostics, but no larger finite certificate is the goal.

The first analytic queue is complete: 165 valid outputs, zero failed workers,
and a normal supervisor exit after `queue_complete`. It falsified fixed
rank-4 and width-4 operator templates and exposed an exact parity-selective
center cancellation in the residue experiment. `RESULTS_SUMMARY.md` records
the results and their numerical limits. Re-running the exhausted queue is not
useful; the next workload must test a new degree-dependent border or signed
`h`-integrated compensation identity.

## Compute contract

- The protected 4CT chain is identified by both PID, command, and working
  directory.  It is never signalled or edited.
- A native lock state requires agreement of both macOS lock keys.  Missing or
  disagreeing keys are treated as unlocked.
- Locked target: 84% total-host busy, below the user's 90% ceiling.  While 4CT
  is active, at most five analytic workers run; after it is confirmed absent
  for three samples, at most fifteen run.
- Unlocked or uncertain target: 42% total-host busy and at most five workers,
  leaving more than one logical core below the user's 50% ceiling.
- Failed host-load sampling pauses every owned worker.  Signals are sent only
  to process groups created and recorded by the supervisor.
- Workers use background QoS, nice level 20 after inheritance, and one thread
  per numerical library.

macOS has no installed hard percentage quota.  Enforcement is a conservative
sampled `SIGSTOP`/`SIGCONT` governor.  It cannot prevent unrelated processes
from taking the host above a ceiling, and it cannot promise a zero-duration
transient between samples.  When unrelated load already exceeds the active
ceiling, all owned workers remain paused.

## Stop and recovery

The run directory contains atomic results, an append-only event log, completed
hashes, failed receipts, and a heartbeat.  The same control command used by the
regional diagnostic queue applies to this run directory.  A graceful stop
resumes paused children, sends `TERM` only to recorded owned groups, waits 30
seconds, and reports rather than force-killing any straggler.

## Scientific scope

Every numerical finite section is labeled structure discovery or
falsification.  It cannot establish an all-degree inequality or RH.  The only
promotion gate is a proof of an arbitrary-degree identity or inequality with
complete-theta and modular-residue terms retained.
