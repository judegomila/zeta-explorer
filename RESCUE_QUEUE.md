# Rescue Queue

Append-only log of user asks that could NOT be fully completed in one session, usually because of API rate limits or agent-side errors. The goal: zero work lost when a session is interrupted. Next session reads this file and drains it with `/drain-rescue`.

## Protocol

**When to append here:**
1. An Agent tool call returns `API Error: Rate limit reached` and the underlying work was not fully committed to git.
2. A long user ask was partially implemented and a downstream subtask got blocked.
3. The user explicitly says "queue this for later".
4. A slash command or cron tick bailed out due to backoff before completing its work.

**What to append:**
- Timestamp in UTC
- Category (`rate-limit`, `agent-error`, `user-deferred`, `engine-bailout`)
- Short description of what was asked
- Pointer to the relevant conversation turn or commit (if any)
- Partial-state inventory: what files were touched, what still needs doing
- Explicit definition of "done"

**Draining:**
Use the `/drain-rescue` slash command — it reads this file, presents each entry as a discrete task, and lets you work them in priority order. When a task is done, check it off with `[x]` and add a completed-commit reference.

Format for each entry:
```
### YYYY-MM-DDTHH:MM:SSZ — category — short-title
- **Origin:** <commit sha | turn identifier | "user-typed">
- **Ask:** <what the user was trying to do>
- **Partial state:** <files touched, work not committed>
- **Done when:** <explicit completion criteria>
- **Status:** [ ] pending / [x] done (<commit sha>)
```

---

## Pending rescue items

### 2026-04-11T05:30:00Z — rate-limit — imp-354 G6a shock Lipschitz partial closure
- **Origin:** Fanout turn where 4 agents were launched; imp-354 agent hit "API Error: Rate limit reached" before running `git commit`.
- **Ask:** Close G6a_shock_lipschitz (the unique load-bearing critical blocker of the Λ-attack) via a Whitham Hölder-1/2 fold-catastrophe argument.
- **Partial state:** `src/data/lambda-burgers-shock-lipschitz.js` exists (26KB, 536 lines), queue status flipped to `completed`, `improvements.js` entry id 1205 appended, `IMPROVEMENTS.md` row appended. ONLY the git commit step did not run.
- **Done when:** `git log --grep=imp-354` shows a commit with the rescue work.
- **Status:** [ ] pending — to be committed in the Phase 15 rescue commit

### 2026-04-11T05:30:00Z — rate-limit — imp-369 G2 argmin jumps closure
- **Origin:** Same fanout turn; imp-369 agent hit rate limit before git commit.
- **Ask:** Close G2 (imp-336 sub-gap) via Cauchy interlacing / pair-majorization. Key finding: G2 closure at τ=0 is NOT equivalent to the monotonicity conjecture (M) itself, but is a trivial consequence of the min-gap list structure.
- **Partial state:** `src/data/lambda-argmin-jumps.js` exists (20KB), queue flipped, logs appended. Git commit did not run.
- **Done when:** `git log --grep=imp-369` shows the rescue commit.
- **Status:** [ ] pending — to be committed in the Phase 15 rescue commit

### 2026-04-11T05:30:00Z — rate-limit — imp-374 cross-validation table (10 rows, 6 assertions, D1 disagreement)
- **Origin:** Same fanout turn; imp-374 agent hit rate limit before git commit.
- **Ask:** Consolidate all Λ / intercept-a estimates in the codebase into a single cross-validation table with ε-tolerance assertions.
- **Partial state:** `src/data/lambda-cross-validation.js` has a large diff (+509 lines adding `LAMBDA_CROSS_VALIDATION_TABLE` + `_ASSERTIONS`), queue flipped, id 1207 logged, D1 disagreement recorded honestly (OLS/WLS symmetric intervals don't strictly overlap). Git commit did not run.
- **Done when:** `git log --grep=imp-374` shows the rescue commit.
- **Status:** [ ] pending — to be committed in the Phase 15 rescue commit

### 2026-04-11T05:30:00Z — rate-limit — imp-354 / 368 / 369 / 374 fanout round 2 never fired
- **Origin:** The fanout turn could not retry the 3 failed agents; one rate-limit event killed three concurrent ones.
- **Ask:** After the initial fanout, I would have liked to fanout AGAIN on the next tier (imp-359 LMFDB zeros, imp-360 fresh Dyson ladder, imp-362 interval arithmetic integrator) but was blocked.
- **Partial state:** None — nothing started.
- **Done when:** A fanout on {imp-359, imp-360, imp-362} produces 3 commits.
- **Status:** [ ] pending — run `/fanout 3` after the imp-354/369/374 rescue commit lands

### 2026-04-11T05:30:00Z — deferred-acceleration — model tier routing (Haiku for bugs, Opus for proof)
- **Origin:** /btw response from the assistant listed "Switch the engine's model to Haiku 4.5 for trivial tickets" as a high-leverage acceleration. Not implemented in the current session.
- **Ask:** Add two-tier routing to `scripts/auto-improve.sh`: Haiku for `bug|ux|visual|performance`, Opus for `proof|accuracy|feature`. Free up Opus quota for the real work.
- **Partial state:** None.
- **Done when:** `scripts/auto-improve.sh` dispatches to different `claude --print --model` flags based on ticket category, or uses a pre-run category probe to decide.
- **Status:** [ ] pending

### 2026-04-11T05:30:00Z — deferred-acceleration — second engine instance for proof-only work
- **Origin:** Same /btw response: "Spin up a second auto-improve.sh instance with a different prompt filter".
- **Ask:** Launch a second engine loop with a prompt that targets `category: 'proof'` only. Parallel to the main loop. Double throughput on Tier 1 RPM.
- **Partial state:** None.
- **Done when:** `scripts/auto-improve-proof.sh` or equivalent exists, runs in background, targets proof-category tickets, and does not conflict with the main engine.
- **Status:** [ ] pending

### 2026-04-11T05:30:00Z — deferred-acceleration — queue-index cache for tokens
- **Origin:** /btw response: "Cache the expensive per-run reads. Every engine run re-reads the same files (~50K tokens of re-reading per run)".
- **Ask:** Build a `scripts/queue-index.json` regenerator (pre-run hook) that extracts just the critical pending ticket metadata so each engine run reads 3KB instead of 500KB.
- **Partial state:** None.
- **Done when:** Engine prompt reads `scripts/queue-index.json` first and only reads `improvement-queue.js` if the index is stale.
- **Status:** [ ] pending

### 2026-04-11T05:30:00Z — deferred-acceleration — LMFDB zero fetch (imp-359)
- **Origin:** /btw response: "LMFDB zero fetch script — imp-359 needs the Odlyzko tables. One good agent run (or a Python script) to download and package them".
- **Ask:** Download the Odlyzko / LMFDB first-10^6 Riemann zero ordinates into `src/data/zeros-to-1e6.js` with provenance metadata. Unblocks imp-360 fresh Dyson ladder downstream.
- **Partial state:** None.
- **Done when:** `src/data/zeros-to-1e6.js` exports an array or Float64Array of at least 10^5 verified zero ordinates with file-hash + URL provenance.
- **Status:** [ ] pending

### 2026-04-11T05:30:00Z — deferred-acceleration — PostToolUse hook for auto-build
- **Origin:** /btw response: "Add a PostToolUse hook on Write|Edit that runs npm run build automatically. Catches parse errors like the dg_k*/dt JSDoc trap ~30s earlier".
- **Ask:** Add a hook in `.claude/settings.local.json` or `~/.claude/settings.json` that runs `npm run build` after every Write|Edit to a .jsx|.js file.
- **Partial state:** None.
- **Done when:** The hook is configured and visible in `/hooks`, and one test edit triggers a build.
- **Status:** [ ] pending

---

## Completed rescue items

<!-- Move entries here when drained. Keep the commit sha for audit. -->
