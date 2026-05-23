# LaunchAgent templates

macOS LaunchAgent plists that auto-start the auto-improve engine, the
twice-daily health check, and the engine-watchdog supervisor. Templates use
`__REPO_PATH__` and `__HOME__` placeholders so they're portable across
machines and user accounts.

## Install

```bash
./scripts/setup-new-machine.sh
```

That script will:

1. Verify `node`, `npm`, `claude`, `git` are on PATH.
2. Run `npm install` if `node_modules/` is missing.
3. Warn if `scripts/.env` (engine API key) is missing.
4. Substitute placeholders in these templates and install the result into
   `~/Library/LaunchAgents/`, then load all three via `launchctl`.
5. Print engine status.

## Manual install (if you don't want the setup script)

```bash
REPO=/path/to/mathexplorer
for label in com.mathexplorer.auto-improve com.mathexplorer.daily-health com.mathexplorer.engine-watchdog; do
  sed -e "s|__REPO_PATH__|$REPO|g" -e "s|__HOME__|$HOME|g" \
    "$REPO/scripts/launchd/${label}.plist.template" \
    > "$HOME/Library/LaunchAgents/${label}.plist"
  launchctl load -w "$HOME/Library/LaunchAgents/${label}.plist"
done
```

## Uninstall

```bash
launchctl unload ~/Library/LaunchAgents/com.mathexplorer.auto-improve.plist
launchctl unload ~/Library/LaunchAgents/com.mathexplorer.daily-health.plist
launchctl unload ~/Library/LaunchAgents/com.mathexplorer.engine-watchdog.plist
rm ~/Library/LaunchAgents/com.mathexplorer.{auto-improve,daily-health,engine-watchdog}.plist
```

## What each agent does

- **com.mathexplorer.auto-improve**: spawns `scripts/auto-improve.sh start` at
  login (`RunAtLoad=true`) and re-checks every 5 minutes (`StartInterval=300`).
  If the engine is already running, `do_start` exits cleanly via the PID-file
  check.

- **com.mathexplorer.daily-health**: runs `scripts/daily-health-check.sh` at
  08:00 and 20:00 local time. Restarts engines that died, runs autofill if the
  queue is drained, pushes unpushed commits, sweeps stale rate-limit sentinels.

- **com.mathexplorer.engine-watchdog**: invokes
  `scripts/engine-watchdog.sh --daemon-loop` directly so launchd owns the
  daemon lifecycle (`RunAtLoad=true`, `KeepAlive=true`). The watchdog polls
  every ~90s and restarts any of the four auto-improve engines
  (subscription, api, sonnet, haiku) whose `status` no longer reports
  "is RUNNING", with a circuit-breaker that suppresses restart storms.
  Because launchd holds it under `KeepAlive`, if the watchdog itself dies or
  is killed, launchd respawns it — closing the supervisor-of-supervisor gap.
