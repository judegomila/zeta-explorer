#!/usr/bin/env bash
# Shared prompt sections for all auto-improve engine variants.
# Source this file to access PROMPT_TOKEN_BUDGET, PROMPT_SYNTAX_GOTCHAS,
# and PROMPT_COMMON_RULES_SUFFIX. Each engine script builds its IMPROVE_PROMPT
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
