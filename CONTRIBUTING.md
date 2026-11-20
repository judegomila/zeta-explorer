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

```sh
brew install gitleaks pre-commit   # or the equivalent for your platform
pre-commit install
```

The hook runs `gitleaks` on staged changes and `scripts/check-commit-hygiene.sh`,
which rejects the paths and strings listed above. Do not bypass it with
`--no-verify`. If the hook reports a false positive, add a narrowly scoped
entry to `.gitleaks.toml` in the same commit and say why in the commit message.

## Automated engines and agents

Engines commit only allow-listed paths: `src/`, `scripts/` (excluding dot
files), `formalization/`, `native/`, `rust/`, `rigorous/`, `lean/`,
`research-checkpoints/`, `research-inputs/`, `public/`, `papers/`, `observatory/`, and the top-level documentation files. Use
`git add <path>` with explicit paths; never `git add -A` or `git add .`.

## If something sensitive is committed

Do not push. If it has been pushed, treat a credential as compromised and
rotate it first; removing it from history afterwards does not undo the
exposure. Then open a private security advisory on the repository.
