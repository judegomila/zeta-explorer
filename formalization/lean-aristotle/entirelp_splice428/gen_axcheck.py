#!/usr/bin/env python3
"""Generate axcheck.lean for the entirelp_splice428 package, with the banked audit
invariants (ARISTOTLE_TARGETS.md 2026-09-18 pipeline rules):

* comment-aware name extraction (block comments, docstrings, line comments stripped
  BEFORE scanning, so names mentioned in prose are never picked up);
* wrap-proof parsing (declaration names are taken from the `theorem <name>` token
  itself, so multi-line signatures/proofs cannot hide or split a name);
* theorem-count invariant: the number of emitted `#print axioms` lines must equal the
  number of `theorem` declarations counted by an independent source grep, else abort;
* exact-name phantoms: every emitted name is later required (by check_axcheck.py) to
  appear verbatim in the Lean `#print axioms` output, and the output line count must
  equal the emitted count — an unknown identifier makes `lake env lean` fail loudly.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
FILES = ["HeatTransfer.lean", "Stage1MB.lean", "Truncation.lean", "Stage1LP.lean",
         "ProbeStatements.lean", "RealRootedPreservation.lean", "Splice.lean"]

def strip_comments(src: str) -> str:
    out, i, n, depth = [], 0, len(src), 0
    while i < n:
        if src.startswith("/-", i):
            depth += 1; i += 2; continue
        if depth > 0:
            if src.startswith("-/", i):
                depth -= 1; i += 2
            else:
                if src[i] == "\n": out.append("\n")
                i += 1
            continue
        if src.startswith("--", i):
            j = src.find("\n", i)
            i = n if j == -1 else j
            continue
        out.append(src[i]); i += 1
    return "".join(out)

DECL = re.compile(r"^(?:@\[[^\]]*\]\s*)?(?:private\s+|protected\s+)?"
                  r"(?:noncomputable\s+)?(theorem|lemma)\s+([A-Za-z0-9_.' -￿]+)",
                  re.M)
NS = re.compile(r"^(namespace|section|end)\b\s*([A-Za-z0-9_.']*)", re.M)

names = []
grep_count = 0
for f in FILES:
    src = (ROOT / "RequestProject" / f).read_text()
    clean = strip_comments(src)
    # independent count: raw grep for theorem/lemma keyword at line start (comment-stripped)
    grep_count += len(re.findall(r"^(?:@\[[^\]]*\]\s*)?(?:private\s+|protected\s+)?"
                                 r"(?:noncomputable\s+)?(?:theorem|lemma)\s", clean, re.M))
    # namespace-tracking scan
    stack = []  # (kind, name)
    events = []
    for m in NS.finditer(clean):
        events.append((m.start(), "ns", m.group(1), m.group(2)))
    for m in DECL.finditer(clean):
        events.append((m.start(), "decl", m.group(1), m.group(2)))
    events.sort()
    for _, kind, a, b in events:
        if kind == "ns":
            if a == "namespace":
                stack.append(("namespace", b))
            elif a == "section":
                stack.append(("section", b))
            else:  # end
                if stack:
                    stack.pop()
        else:
            prefix = ".".join(nm for k, nm in stack if k == "namespace" and nm)
            full = f"{prefix}.{b}" if prefix and not b.startswith(prefix + ".") else b
            names.append((f, full))

emitted = [full for _, full in names]
if len(emitted) != grep_count:
    print(f"COUNT INVARIANT VIOLATED: extracted {len(emitted)} names, "
          f"source grep counts {grep_count} theorem declarations", file=sys.stderr)
    sys.exit(1)
dups = {x for x in emitted if emitted.count(x) > 1}
if dups:
    print(f"DUPLICATE fully-qualified names (ambiguous audit): {sorted(dups)}", file=sys.stderr)
    sys.exit(1)

hdr = ["import RequestProject.Main", ""]
body = []
cur = None
for f, full in names:
    if f != cur:
        body.append(f"-- {f}")
        cur = f
    body.append(f"#print axioms {full}")
(ROOT / "axcheck.lean").write_text("\n".join(hdr + body) + "\n")
print(f"axcheck.lean written: {len(emitted)} #print axioms lines "
      f"(count invariant OK vs grep={grep_count})")
