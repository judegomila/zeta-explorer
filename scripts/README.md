# scripts/

Project-internal CLIs and one-shots. Most files are ad-hoc computations or
build-time assertion sweeps documented in their own top-of-file comment block.

## salvage-subagent.mjs (imp-1270)

Automates the post-subagent salvage flow: cherry-pick a worktree branch
commit onto the current branch, auto-resolve the canonical
`scripts/run-assertions.mjs` DATA_MODULES additive conflict, and drop the
temp branch. Bails to a clean manual state on any conflict outside its
narrow auto-resolution policy.

```
node scripts/salvage-subagent.mjs --task <task-id>      # primary: by worktree agent id
node scripts/salvage-subagent.mjs --commit <sha>        # alternate: by commit SHA
node scripts/salvage-subagent.mjs --worktree <path>     # alternate: by worktree path
node scripts/salvage-subagent.mjs --task <id> --dry-run # preview without changes
node scripts/salvage-subagent.mjs --task <id> --push    # cherry-pick AND push (default: don't push)
```

`<task-id>` is the worktree directory suffix, e.g. `a05f2a7af9d530498` for
`.claude/worktrees/agent-a05f2a7af9d530498/` -- NOT the `imp-NNNN` ticket id.

Exit codes:

| code | meaning |
| ---- | ------- |
| 0    | salvage (or dry-run) succeeded, working tree clean |
| 1    | usage error (bad flag, wrong working directory, missing worktree) |
| 2    | cherry-pick conflict that the auto-resolver refused; cherry-pick left in-progress for the human to finish with `git cherry-pick --continue` |
| 3    | internal git/fs error (fetch failed, push failed, etc.) -- state may be dirty |

Auto-resolution policy (safe-by-default): the script auto-resolves a conflict
only when ALL of the following hold:

1. The only conflicted file is `scripts/run-assertions.mjs`.
2. The file contains exactly one conflict block.
3. The conflict block sits inside the `const DATA_MODULES = [ ... ]` array.
4. Every non-blank line on both sides matches the DATA_MODULES line shape
   (a `/src/*.js` quoted path string or a leading `//` comment).

When all four hold, the resolver concatenates the two halves (ours then theirs)
in place of the conflict. Resolution is rejected if any conflict markers remain
or if `node --check` cannot parse the resulting file.

On any condition outside the policy the script prints
`MANUAL RESOLUTION NEEDED in <file>`, exits 2, and leaves the cherry-pick
on disk for `git cherry-pick --continue` after manual resolve.

## dispatch-subagent.mjs (imp-1273)

Subagent dispatch prompt-template generator. Each Agent() dispatch the
orchestrator makes is ~300-500 words, ~80% of which is repeated boilerplate
(worktree setup, build-green, single atomic commit, mark queue completed,
do-not-push, report-back format). This CLI takes a ticket-id from
`src/data/improvement-queue.js`, loads the template at
`scripts/templates/subagent-prompt.tmpl`, and emits a fully-formed prompt
to stdout that the orchestrator copies straight into the Agent() call.

```
node scripts/dispatch-subagent.mjs --ticket imp-NNNN
node scripts/dispatch-subagent.mjs --ticket imp-NNNN --refs imp-XXX,imp-YYY
node scripts/dispatch-subagent.mjs --ticket imp-NNNN --bg
node scripts/dispatch-subagent.mjs --ticket imp-NNNN --template <path>
```

The CLI:

- Validates the ticket id is `imp-NNNN` format.
- Loads `src/data/improvement-queue.js` via dynamic import; refuses to
  dispatch on a ticket already `status='completed'` (prevents duplicate
  runs that overwrite finished work).
- Resolves one-line summaries for every ticket in `dependsOn` and for
  every ticket in `--refs`.
- Auto-detects context files: any `src/data/<ticket-id>*.js` (WIP or
  completed data module) and the five most recent
  `thinking/decisions/*.md` files mentioning the ticket id.
- Maps `model` to a subagent persona hint and a `completedByChannel`
  string convention (`opus-4-8-worktree`, `sonnet-4-6-worktree`,
  `haiku-4-5-worktree`).
- `--bg` injects the background-mode reminder block.
- Template uses Mustache-style `{{placeholders}}` resolved by plain
  `String.prototype.replaceAll` — no Mustache / Handlebars dependency.

This is a prompt GENERATOR. It never invokes `Agent()` itself.

Exit codes:

| code | meaning |
| ---- | ------- |
| 0    | prompt rendered to stdout |
| 1    | usage error: bad flag, missing ticket, malformed id, or ticket already completed |
| 2    | template malformed: file missing, missing required placeholders, or unresolved placeholders after render |
| 3    | internal error (queue import failure, fs error) |

Test invocation:

```
node scripts/dispatch-subagent.mjs --ticket imp-1281 --refs imp-1240,imp-1258 > /tmp/prompt-test.txt
```

## run-assertions.mjs

Build-time assertion sweep. See top-of-file comment block.
