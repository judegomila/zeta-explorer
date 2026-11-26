#!/usr/bin/env bash
# Shared prompt sections for all auto-improve engine variants.
# Source this file to access PROMPT_TOKEN_BUDGET, PROMPT_SYNTAX_GOTCHAS,
# PROMPT_COMMON_RULES_SUFFIX and PROMPT_COMMIT_PROTOCOL. Each engine script builds its IMPROVE_PROMPT
# by concatenating these shared sections with its own tier-specific steps.

PROMPT_TOKEN_BUDGET='0. TOKEN BUDGET DISCIPLINE: the project has three HUGE monolithic files that you MUST NOT read in full unless you are editing them:
   - src/data/improvements.js (~280K tokens)
   - src/data/improvement-queue.js (~87K tokens)
   - IMPROVEMENTS.md (~60K tokens)
   Reading any of these in full blows the per-minute API tier budget.
   INSTEAD, read the pre-generated cache at scripts/queue-index.json (~4 KB) for:
   - nextImprovementId (use this for the improvements.js append id, no scan needed)
   - criticalPending / highPending / mediumPending / lowPending arrays
   - totalPending / totalCompleted counts'

PROMPT_SYNTAX_GOTCHAS='SYNTAX GOTCHAS (mandatory):
- DO NOT write "dg_k*/dt" or similar inside JSDoc comments — the "*/" prematurely closes the comment. Use "dg_{k*}/dt" in comments.
- DO NOT use apostrophes inside single-quoted JS strings — they close the string. Use double-quoted strings or rewrite.
- The "*/" sequence anywhere inside a JSDoc comment ends the comment.'

PROMPT_COMMON_RULES_SUFFIX='- Never install new packages or dependencies
- Never restructure the project or rename files
- Never modify this auto-improve script or IMPROVEMENTS.md format header
- Never make more than one logical change per run
- Never delete features or pages
- Always verify the build passes before committing
- Focus on the src/ directory only'

# Appended to every engine prompt. The repository is public and its main branch
# deploys to production, so the rules for committing are part of the task.
# (No apostrophes in this block: it is a single-quoted shell string.)
PROMPT_COMMIT_PROTOCOL='COMMIT PROTOCOL (mandatory; this repository is PUBLIC):
- Commit ONLY with: scripts/engine-commit.sh -m "<message that mentions the imp-NNN id>" -- <file> [<file> ...]
  Name every file you changed, one by one. A directory may be named only if every changed file under it is yours.
- NEVER run git add, git commit, git push, git stash, git reset, git rebase, git merge, git checkout or git switch yourself, and never pass --no-verify, -f or --force to anything. Pushing is done by the engine harness, to the branch engine/work only. Never touch the branch main.
- If scripts/engine-commit.sh rejects the commit, fix exactly what it reports and run it again. Do not work around a rejection, do not edit the check scripts, hooks, scripts/engine-allowlist.txt, .gitignore or .gitleaks.toml.
- NEVER put any of these into a file you commit, into ticket or improvement text, or into a commit message: absolute paths of this machine (anything starting with a home directory, /private/tmp, /tmp or /var/folders: write paths relative to the repository root); API keys, tokens or passwords; account, project, team or deployment identifiers; e-mail addresses; host names or IP addresses; pasted terminal output, error dumps, prompts or session text. Summarise a result in your own words instead of pasting output.
- NEVER read, print or copy scripts/.env, scripts/.deploy-hook-url or any other dot file under scripts/, and never print environment variables.
- Scratch files go under tmp/ (git-ignored, never committed). Do not commit logs, state files, downloaded papers or other third-party material, or compiled executables.
- Engines may commit under: src/, formalization/, native/, rust/, rigorous/, lean/, research/, research-checkpoints/, research-inputs/, papers/, docs/, public/, observatory/, scripts/ (not the engine, hook, deploy or check scripts), and IMPROVEMENTS.md. A change to package.json, vercel.json, vite.config.js, index.html, .github/ or any other top-level file is out of scope for an engine: describe it in the ticket instead.'
