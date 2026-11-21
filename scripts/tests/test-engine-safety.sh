#!/bin/bash
# scripts/tests/test-engine-safety.sh
#
# Feeds the shared sanitiser, the staging helper and the git hooks bad inputs
# and shows that each one is rejected. Runs in a throw-away repository under
# $TMPDIR; it does not touch this clone's index, branches or remotes and makes
# no network call.
#
#   bash scripts/tests/test-engine-safety.sh
#
# Requires: git, node, gitleaks. Exit 0 = every case behaved as expected.
#
# The bad inputs are assembled at run time from fragments so that this file
# does not itself contain a home path or a key-shaped string.
set -u
export GIT_TRACE2_EVENT=0
SRC="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/engine-safety-test.XXXXXX")" || exit 1
trap 'rm -rf "$WORK"' EXIT
pass=0; failed=0

for tool in git node gitleaks; do
  command -v "$tool" >/dev/null 2>&1 || { echo "missing tool: $tool"; exit 1; }
done

# ── fixtures (built from fragments) ─────────────────────────────────────────
U="/Us"; U="${U}ers"
HOME_PATH="$U/alice/Documents/project/notes.txt"
LINUX_HOME="/ho"; LINUX_HOME="${LINUX_HOME}me/alice/run/output.txt"
PRIV_TMP="/priv"; PRIV_TMP="${PRIV_TMP}ate/tm"; PRIV_TMP="${PRIV_TMP}p/claude-501/session/tasks/abc.output"
KEY="sk-a"; KEY="${KEY}nt-api03-$(printf 'q7Zx%.0s' 1 2 3 4 5 6 7 8 9 10 11 12)"
GH="gh"; GH="${GH}p_$(printf 'a1B2%.0s' 1 2 3 4 5 6 7 8 9)"
REM="system"; REM="${REM}-reminder"
TRANSCRIPT="$(printf '<%s>\nThe user sent a message.\n</%s>\nHuman: please run the build\nAssistant: running it now' "$REM" "$REM")"
SESSION_JSON="{\"parent"; SESSION_JSON="${SESSION_JSON}Uuid\":\"0000\",\"session"; SESSION_JSON="${SESSION_JSON}Id\":\"1111\",\"type\":\"tool_"; SESSION_JSON="${SESSION_JSON}use\"}"
TERMINAL="$(printf 'alice@Alices-MacBook-Pro project %% npm run build\nnpm ERR! code ELIFECYCLE')"

# ── helpers ─────────────────────────────────────────────────────────────────
ok()   { pass=$((pass + 1)); echo "PASS  $1"; [ -n "${2:-}" ] && echo "        -> $2"; }
bad()  { failed=$((failed + 1)); echo "FAIL  $1"; [ -n "${2:-}" ] && printf '%s\n' "$2" | sed 's/^/        /'; }
# expect_reject <name> <grep pattern expected in output> <command...>
expect_reject() {
  local name="$1" pat="$2"; shift 2
  local out rc
  out="$("$@" 2>&1)"; rc=$?
  if [ "$rc" -ne 0 ] && printf '%s' "$out" | grep -Eq -- "$pat"; then
    ok "$name" "$(printf '%s' "$out" | grep -E -- "$pat" | head -1 | cut -c1-150)"
  else
    bad "$name (exit $rc, expected a rejection matching /$pat/)" "$out"
  fi
}
expect_ok() {
  local name="$1"; shift
  local out rc
  out="$("$@" 2>&1)"; rc=$?
  if [ "$rc" -eq 0 ]; then ok "$name"; else bad "$name (exit $rc)" "$out"; fi
}

# ── a throw-away clone with a local "remote" ────────────────────────────────
SLUG="test-owner/zeta-explorer"
REMOTE_DIR="$WORK/remote/github.com/$SLUG.git"     # path ends like the expected URL
REPO="$WORK/repo"
mkdir -p "$REMOTE_DIR" "$REPO"
git init -q --bare "$REMOTE_DIR"
git init -q "$REPO"
cd "$REPO" || exit 1
git config user.name "Test"; git config user.email "test@example.com"
git config commit.gpgsign false
mkdir -p scripts/lib scripts/hooks src/data src/pages
cp "$SRC/.gitignore" "$SRC/.gitleaks.toml" .
cp "$SRC/scripts/check-commit-hygiene.sh" "$SRC/scripts/engine-guard.mjs" "$SRC/scripts/engine-allowlist.txt" \
   "$SRC/scripts/engine-preflight.sh" "$SRC/scripts/engine-commit.sh" "$SRC/scripts/engine-push.sh" \
   "$SRC/scripts/install-engine-hooks.sh" "$SRC/scripts/prepush-tracked-imports-guard.mjs" scripts/
cp "$SRC/scripts/lib/public-sanitize.mjs" scripts/lib/
cp "$SRC/scripts/hooks/pre-commit" "$SRC/scripts/hooks/commit-msg" "$SRC/scripts/hooks/pre-push" scripts/hooks/
chmod +x scripts/*.sh scripts/hooks/*
printf 'export const improvements = [\n  { id: 1, summary: "first" },\n];\n' > src/data/improvements.js
printf 'export const IMPROVEMENT_QUEUE = [\n];\n' > src/data/improvement-queue.js
printf '# log\n' > IMPROVEMENTS.md
printf '{"name":"x"}\n' > package.json
printf 'export default function App() { return null; }\n' > src/App.jsx
git add -A >/dev/null 2>&1
git commit -q --no-verify -m "fixture: initial tree"
git branch -M main
git remote add origin "$REMOTE_DIR"
git push -q --no-verify origin main
git fetch -q origin
export ENGINE_REPO_SLUG="$SLUG"

echo "== 1. start-up check =="
expect_reject "preflight refuses when hooks are not installed" "hook pre-commit is not installed" bash scripts/engine-preflight.sh
expect_ok     "install-engine-hooks.sh installs the three hooks" bash scripts/install-engine-hooks.sh
expect_reject "preflight refuses on main (production branch)" "deploys to production" bash scripts/engine-preflight.sh
git switch -q -c engine/work
expect_ok     "preflight passes on engine/work with hooks installed" bash scripts/engine-preflight.sh
chmod -x "$(git rev-parse --git-path hooks)/pre-push"
expect_reject "preflight refuses when a hook is not executable" "pre-push is not executable" bash scripts/engine-preflight.sh
chmod +x "$(git rev-parse --git-path hooks)/pre-push"
echo "# local edit" >> scripts/engine-allowlist.txt
expect_reject "preflight refuses when a check script was edited locally" "differ from HEAD" bash scripts/engine-preflight.sh
git checkout -q -- scripts/engine-allowlist.txt
git remote set-url origin "$WORK/remote/github.com/someone/other-repo.git"
expect_reject "preflight refuses a different remote" "expected github.com/$SLUG" bash scripts/engine-preflight.sh
git remote set-url origin "$REMOTE_DIR"

echo "== 2. shared sanitiser (write time) =="
san() { node --input-type=module -e '
  import { sanitizeText, findViolations, sanitizeForLedger } from "./scripts/lib/public-sanitize.mjs";
  const [mode, text, want] = process.argv.slice(1);
  if (mode === "rewrite") {
    const out = sanitizeForLedger(text);
    if (findViolations(out).length || (want && !out.includes(want))) { console.error("not clean: " + out); process.exit(1); }
    console.log("rewritten to: " + out.replace(/\n/g, " | ").slice(0, 110));
  } else {
    const v = findViolations(text);
    if (!v.length) { console.log("no violation found"); process.exit(0); }
    console.error(v.map((x) => "violation " + x.rule + ": " + x.excerpt).join("\n")); process.exit(1);
  }' "$@"; }
expect_reject "sanitiser flags a home path"            "path-home-users"        san detect "see $HOME_PATH for the run"
expect_reject "sanitiser flags a server home path"     "path-home-linux"        san detect "output in $LINUX_HOME"
expect_reject "sanitiser flags a /private/tmp path"    "path-private-tmp"       san detect "log at $PRIV_TMP"
expect_reject "sanitiser flags a key-shaped string"    "secret-anthropic-key"   san detect "used key $KEY in the run"
expect_reject "sanitiser flags a GitHub token"         "secret-github-token"    san detect "token $GH"
expect_reject "sanitiser flags a transcript block"     "transcript-reminder"    san detect "$TRANSCRIPT"
expect_reject "sanitiser flags session-file JSON"      "transcript-session-field" san detect "$SESSION_JSON"
expect_reject "sanitiser flags pasted terminal output" "terminal-"              san detect "$TERMINAL"
expect_ok     "sanitiser rewrites a home path to the placeholder" san rewrite "see $HOME_PATH" "$U/USER/Documents"
expect_ok     "sanitiser redacts a key-shaped string"   san rewrite "key $KEY end" "[REDACTED-KEY]"
expect_ok     "sanitiser replaces a transcript block"   san rewrite "$TRANSCRIPT" "[transcript omitted]"
expect_reject "sanitiser flags an e-mail address in ticket text" "account-email" san detect "ask bob.smith@university.edu about it"
expect_ok     "sanitiser leaves ordinary ticket text alone" san detect "imp-123: derive the bound C_E < 0.2797 on 690988 <= N; see src/data/foo.js and W@W.conj"

echo "== 3. ledger text is sanitised on the way into a commit =="
printf 'export const improvements = [\n  { id: 1, summary: "first" },\n  { id: 2, summary: "ran from %s with %s" },\n];\n' "$HOME_PATH" "$PRIV_TMP" > src/data/improvements.js
printf 'export const clean = 1;\n' > src/data/imp-2-module.js
expect_ok "engine-commit sanitises the added ledger line and commits" bash scripts/engine-commit.sh -m "imp-2: add module" -- src/data/improvements.js src/data/imp-2-module.js
if git show HEAD:src/data/improvements.js | grep -q "$U/USER/Documents" && ! git show HEAD:src/data/improvements.js | grep -q "alice"; then
  ok "committed ledger line carries the placeholder, not the home path" "$(git show HEAD:src/data/improvements.js | grep 'id: 2' | cut -c1-120)"
else bad "committed ledger line still has the raw path" "$(git show HEAD:src/data/improvements.js)"; fi

echo "== 4. staging helper (allow-list, fail closed) =="
mkdir -p tmp && echo "scratch" > tmp/notes.txt
printf 'ANTHROPIC_API_KEY=%s\n' "$KEY" > scripts/.env
printf 'TOKEN=abc\n' > .env
printf 'export const x = 2;\n' > src/data/imp-3-module.js
expect_reject "engine-commit refuses 'commit everything' (.)"      "refused path"            bash scripts/engine-commit.sh -m "imp-3: x" -- .
expect_reject "engine-commit refuses -A"                           "not available"           bash scripts/engine-commit.sh -A -m "imp-3: x"
expect_reject "engine-commit refuses a file under tmp/"            "tmp/notes.txt: scratch directory" bash scripts/engine-commit.sh -m "imp-3: x" -- tmp/notes.txt
expect_reject "engine-commit refuses scripts/.env"                 "scripts/.env: environment file"   bash scripts/engine-commit.sh -m "imp-3: x" -- scripts/.env
expect_reject "engine-commit refuses a top-level .env"             "\.env: environment file" bash scripts/engine-commit.sh -m "imp-3: x" -- .env
echo '{"name":"y"}' > package.json
expect_reject "engine-commit refuses a path outside the allow-list" "package.json: outside the engine allow-list" bash scripts/engine-commit.sh -m "imp-3: x" -- package.json
git checkout -q -- package.json
echo "allow **" >> scripts/engine-allowlist.txt
expect_reject "engine cannot commit a change to its own allow-list" "REFUSE|may not commit" bash scripts/engine-commit.sh -m "imp-3: x" -- scripts/engine-allowlist.txt
git checkout -q -- scripts/engine-allowlist.txt
if [ -z "$(git diff --cached --name-only)" ]; then ok "nothing was left staged by the refused commits"; else bad "index not clean" "$(git diff --cached --name-only)"; fi

# a sibling engine has staged its own file; ours must not sweep it in
printf 'export const sibling = 1;\n' > src/data/sibling-module.js
git add -- src/data/sibling-module.js
expect_ok "engine-commit commits only the named file" bash scripts/engine-commit.sh -m "imp-3: add module" -- src/data/imp-3-module.js
if [ "$(git show --format= --name-only HEAD)" = "src/data/imp-3-module.js" ] && git diff --cached --name-only | grep -q sibling-module; then
  ok "a sibling's staged file stayed staged and was not swept into the commit"
else bad "sibling file handling" "$(git show --format= --name-only HEAD; git diff --cached --name-only)"; fi
git restore --staged -- src/data/sibling-module.js; rm -f src/data/sibling-module.js

# something outside the allow-list is already in the index (forced past .gitignore)
git add -f tmp/notes.txt
printf 'export const y = 3;\n' > src/data/imp-4-module.js
expect_reject "engine-commit fails closed when the index holds a foreign path" "tmp/notes.txt" bash scripts/engine-commit.sh -m "imp-4: add module" -- src/data/imp-4-module.js
git restore --staged -- tmp/notes.txt

echo "== 5. git hooks reject a raw 'git add -A; git commit' (engine mode) =="
raw_commit() { ( export ZETA_ENGINE=1; git add -A -f -- "$@" && git commit -q -m "imp-5: raw commit" ); local rc=$?; git reset -q HEAD -- . ; return $rc; }
expect_reject "hook rejects a forced file under tmp/"   "tmp/notes.txt"                  raw_commit tmp/notes.txt
expect_reject "hook rejects a forced scripts/.env"       "scripts/.env"                   raw_commit scripts/.env
printf 'export const note = "copied from %s";\n' "$HOME_PATH" > src/data/imp-5-module.js
expect_reject "hook rejects a home path in a data module" "path-home-users|home path"    raw_commit src/data/imp-5-module.js
printf 'export const k = "%s";\n' "$KEY" > src/data/imp-5-module.js
expect_reject "hook rejects a key-shaped string"         "secret-anthropic-key|leaks found" raw_commit src/data/imp-5-module.js
printf '%s\n' "$SESSION_JSON" > src/data/imp-5-capture.jsonl
expect_reject "hook rejects a session-transcript record" "transcript-"                   raw_commit src/data/imp-5-capture.jsonl
rm -f src/data/imp-5-capture.jsonl
printf '\xcf\xfa\xed\xfe\x07\x00\x00\x01' > src/data/tool-binary
expect_reject "hook rejects a compiled executable"       "compiled executable"            raw_commit src/data/tool-binary
rm -f src/data/tool-binary src/data/imp-5-module.js
printf 'export const z = 5;\n' > src/data/imp-5-module.js
msg_commit() { ( export ZETA_ENGINE=1; git add -- src/data/imp-5-module.js && git commit -q -m "imp-5: ran in $HOME_PATH" ); local rc=$?; git reset -q HEAD -- . ; return $rc; }
expect_reject "commit-msg hook rejects a home path in the message" "path-home-users"     msg_commit
# the value of the local secret file, in a shape no pattern knows
printf 'WEIRD_SECRET=zz-local-secret-value-000111222\n' > scripts/.env
printf 'export const leaked = "zz-local-secret-value-000111222";\n' > src/data/imp-5-module.js
expect_reject "hook rejects the literal value of scripts/.env" "secret-local-file-value"  raw_commit src/data/imp-5-module.js
rm -f src/data/imp-5-module.js scripts/.env .env src/data/imp-4-module.js

echo "== 6. push flow =="
push_as_engine() { ( export ZETA_ENGINE=1; git push "$@" ); }
expect_reject "pre-push rejects an engine push to main"            "deploys to production" push_as_engine origin HEAD:refs/heads/main
expect_reject "pre-push rejects an engine push to another branch"  "engines push only to"  push_as_engine origin HEAD:refs/heads/feature-x
git tag test-tag
expect_reject "pre-push rejects pushing tags"                      "tags are not pushed|engines push only to" push_as_engine origin test-tag
git tag -d test-tag >/dev/null
expect_ok     "engine-push dry run (ENGINE_PUSH_DISABLED=1) pushes nothing" env ENGINE_PUSH_DISABLED=1 bash scripts/engine-push.sh
if git ls-remote --heads origin engine/work | grep -q engine/work; then bad "dry run pushed"; else ok "remote has no engine/work after the dry run"; fi
expect_ok     "engine-push pushes engine/work" bash scripts/engine-push.sh
if [ "$(git ls-remote --heads origin main | cut -f1)" = "$(git rev-parse main)" ] && git ls-remote --heads origin engine/work | grep -q "$(git rev-parse HEAD)"; then
  ok "remote main is unchanged; remote engine/work has the engine commits"
else bad "remote state" "$(git ls-remote origin)"; fi
# a person on an ordinary branch: main still needs the explicit override
git switch -q -c topic-branch
printf 'export const t = 1;\n' > src/data/topic-module.js
git add -- src/data/topic-module.js && git commit -q -m "imp-6: topic change"
expect_reject "pre-push rejects a person's direct push to main without the override" "open a pull request" git push origin HEAD:refs/heads/main
if [ "$(git ls-remote --heads origin main | cut -f1)" = "$(git rev-parse main)" ]; then ok "remote main is still unchanged"; else bad "remote main moved"; fi
git switch -q engine/work; git branch -q -D topic-branch
# a bad commit that reached local history (hooks bypassed) is stopped at push
printf 'export const note = "from %s";\n' "$HOME_PATH" > src/data/imp-6-module.js
git add -- src/data/imp-6-module.js && git commit -q --no-verify -m "imp-6: bypassed hooks"
git rm -q -- src/data/imp-6-module.js && git commit -q --no-verify -m "imp-6: remove it again"
expect_reject "engine-push rejects a range whose history contains a home path, even if a later commit removes it" "path-home-users" bash scripts/engine-push.sh
expect_reject "pre-push hook rejects the same range on a direct git push" "path-home-users" push_as_engine origin HEAD:refs/heads/engine/work

echo
echo "passed: $pass   failed: $failed"
[ "$failed" -eq 0 ]
