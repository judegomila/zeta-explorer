# Contributing

This repository is public. It is also the working repository for ongoing
research, including commits made by automated engines and agents. The rules
below apply to people and to automation alike.

## Never commit

- Credentials of any kind: API keys, tokens, deploy-hook URLs, passwords,
  cookies, `.env` files (only `*.env.example` with placeholder values).
- Account identifiers: Vercel project, team or user IDs, the contents of
  `.vercel/`, gist IDs used by tooling, OIDC or session tokens (expired ones
  included).
- Session transcripts and terminal captures: assistant session files
  (`*.jsonl` under a `-Users-*` or `.claude/projects` directory), `.claude/`,
  `.claude-memory/`, `.aider*`, `.superpowers/`, `thinking/`, shell history,
  pasted prompts.
- Machine state: pid files, heartbeats, watchdog counters, quota files,
  deploy-publisher state, `public/fleet-status.json`, logs, `.DS_Store`.
- Absolute home-directory paths (`/Users/<name>/...`, `/home/<name>/...`),
  host names, private network addresses, `user@host` strings. Use paths
  relative to the repository root or an environment variable.
- Scratch work: everything under `tmp/`. Scratch work belongs in the private
  companion repository.
- Unpublished drafts that are not cleared for release. A draft that is
  published carries a visible status notice at the top of its README.
- Third-party material without a licence that permits redistribution:
  downloaded paper sources or text extractions, other authors' deposits,
  vendored source trees (for example the `OAI` Lean sources). Record the
  citation, URL and checksum instead.
- Compiled executables and build outputs (`.lake/`, `target/`, Mach-O or ELF
  binaries, `__pycache__/`). Commit the source and the build command.
- Files larger than 50 MB.

## Before the first commit on a machine

Either of these installs the commit checks; the second also installs a push
check and is the one a clone that runs engines must use.

```sh
brew install gitleaks pre-commit   # or the equivalent for your platform
pre-commit install                 # commit checks through the pre-commit framework
```

```sh
brew install gitleaks              # node is also required
scripts/install-engine-hooks.sh    # pre-commit, commit-msg and pre-push hooks, no framework
```

The commit check runs `gitleaks` on staged changes, `scripts/check-commit-hygiene.sh`
and `scripts/engine-guard.mjs staged`, which reject the paths and strings
listed above. The push check (second form) repeats the content check for every
commit being pushed and refuses a direct push to `main`. Do not bypass either
with `--no-verify`. If a check reports a false positive, add a narrowly scoped
entry to `.gitleaks.toml` in the same commit and say why in the commit message.

Every pull request into `main` is checked again on GitHub
(`.github/workflows/public-content-guard.yml`).

## Automated engines and agents

`main` deploys to production. Engines never push to it.

- **Start-up check.** Every engine entry point (`scripts/auto-improve*.sh`,
  `scripts/push-watcher.sh`, `scripts/engine-watchdog.sh`,
  `scripts/frontier-scout.sh`) calls `scripts/engine-preflight.sh` and refuses
  to run unless the hooks of `scripts/install-engine-hooks.sh` are installed
  and executable, the check scripts are unmodified, the remote is this
  repository and the working tree is on the engine branch. Engine clones use
  those hooks rather than the pre-commit framework: the framework stashes
  unstaged files and checks the tree out again around each commit, which is
  unsafe when several engines write to one working tree.
- **Staging.** Engines commit only through
  `scripts/engine-commit.sh -m "<message>" -- <file> ...`. Every file is
  named; there is no `git add -A` or `git add .`. The files must be on the
  allow-list in `scripts/engine-allowlist.txt`: `src/`, `scripts/` (not dot
  files and not the engine, hook, deploy or check scripts), `formalization/`,
  `native/`, `rust/`, `rigorous/`, `lean/`, `research/`,
  `research-checkpoints/`, `research-inputs/`, `public/`, `papers/`, `docs/`,
  `observatory/` and the listed top-level documentation files. The commit is
  refused if anything outside the list is staged, by anyone, and the hooks
  apply the same list to any other commit made in engine mode
  (`ZETA_ENGINE=1`, or the branch `engine/work` checked out).
- **Ticket and improvement text.** Every writer of `src/data/improvement-queue.js`,
  `src/data/improvements.js` and `IMPROVEMENTS.md` passes its text through
  `scripts/lib/public-sanitize.mjs` (home and machine paths become
  placeholders; key-shaped strings, account identifiers and e-mail addresses
  are redacted; transcript and terminal text is dropped). The same rules are
  applied to staged lines, commit messages and pushed ranges, where a match is
  a rejection.
- **Pushing.** Engines push only with `scripts/engine-push.sh`, to the branch
  `engine/work`. A person promotes that branch with
  `scripts/promote-engine-work.sh pr` and merges the pull request with a merge
  commit.
- **Status output.** `scripts/fleet-status-writer.mjs` publishes counts, model
  tier names and sanitised commit subjects only. No key or variable names, no
  quota figures, no paths, no host names.

## If something sensitive is committed

Do not push. If it has been pushed, treat a credential as compromised and
rotate it first; removing it from history afterwards does not undo the
exposure. Then open a private security advisory on the repository.
