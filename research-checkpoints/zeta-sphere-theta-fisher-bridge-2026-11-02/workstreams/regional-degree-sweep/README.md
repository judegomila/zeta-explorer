# Complete-theta regional degree sweep

This isolated workstream runs a progressive interval atlas of the v31 signed
regional-compensation mechanism. See `STATUS.md` for scope, controls and the
recovery procedure.

## Verification

```sh
python3 workstreams/regional-degree-sweep/tests/test_governor.py
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/regional-degree-sweep/tests/test_spatial_tail_preflight.py
python3 workstreams/regional-degree-sweep/tests/test_degree7_reference.py \
  --python /Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python
```

## Generated state

- `tasks.json`: deterministic queue.
- `results/*.json`: atomic finite experiment outputs.
- `run/heartbeat.json`: current lock/load policy and owned PIDs.
- `run/events.jsonl`: append-only control events.
- `run/completed.jsonl`: completed-result hashes.
- `run/failed.jsonl`: failed task receipts.

No push, deployment, power-setting change or edit to the live 4CT scripts is
performed by this workstream.

## Governor safety and protected-work discovery

The supervisor is sampled admission control, not a kernel CPU quota and not a
hard total-machine CPU cap. It admits toward at most 84% sampled host busy only
when both macOS lock keys definitely agree that the screen is locked. Unlocked,
unknown, missing, or contradictory lock evidence uses the 42% admission target.
A failed load sample pauses all owned workers.

Protected work is discovered from a configurable root, current root PID, and
one or more literal command patterns. Each command match must also have a cwd
under the protected root. The scanner continues after apparent completion so a
restart is protected; PID reuse, process-turnover races, unreadable cwd, and
other uncertainty all retain the protected-active low-concurrency policy. By
default, completion requires 12 consecutive confident full-process-table
absence samples. Signals are restricted to process groups created and recorded
by this supervisor, after PID, PGID, and session identity checks.

Each run directory has a lifetime `flock`, so a second live supervisor cannot
use the same run state or duplicate its workers. The lock is released by the
kernel after an abnormal supervisor exit. Before the lock is acquired, the
whole task manifest is rejected if task IDs or normalized output paths collide,
if an output escapes the workspace root, or if an `accepted_verdicts` policy is
malformed. When `accepted_verdicts` is present, a receipt is restart-complete
only when its verdict is explicitly allowed as well as its status and bound
parameters matching.

`TERM`, `INT`, Python exceptions, and worker-launch failures enter best-effort
cleanup: the supervisor continues attempting to terminate every recorded owned
process group even if a receipt or log write fails. Each worker also has a
lightweight guardian outside its pausable process group. The guardian verifies
the fresh worker PID=PGID=SID identity and watches its direct supervisor-parent
relationship; if the supervisor disappears, including via `SIGKILL` or during
the launch-registration window, it resumes the owned group, sends `TERM`, and
after ten seconds escalates only that verified owned group to `KILL`. A power
loss, simultaneous guardian failure, or descendants that deliberately escape
the owned session still require process-table recovery checks.

Launch configuration must provide protected-pid, protected-root, and one or
more repeated protected-command-pattern arguments. For the chain19 workload,
patterns should cover the root script and independently long-lived children,
for example scripts/chain19.sh, contract_guided.py, and
complete-refinement-78/scripts/antichain, plus scripts/floor_up.sh. The current
protected root PID must be resolved immediately before launch. Omitting an
independently reparented child pattern can falsely classify 4CT as finished.

Use a fresh run directory and a scientifically meaningful analytic queue. Do
not relaunch the completed legacy finite regional-atlas queue merely to consume
idle CPU. After detached launch, verify `heartbeat.json`; the launcher reporting
a child PID alone is not proof that manifest validation and lock acquisition
succeeded.
