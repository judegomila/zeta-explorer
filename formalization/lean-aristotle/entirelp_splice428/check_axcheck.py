#!/usr/bin/env python3
"""Audit the `lake env lean axcheck.lean` output against all banked invariants:

1. exact-name phantom check (both directions): the set of names reported by Lean must
   equal, name-for-exact-name, the set of names in axcheck.lean;
2. count invariant: #(reported lines) == #(#print axioms lines in axcheck.lean);
3. axiom cleanliness: every declaration on a subset of
   {propext, Classical.choice, Quot.sound}; no sorryAx, no extra axioms;
4. the capstone `EntireLP.heat_preserves_LP_entire_of_growth` must be present and on
   exactly [propext, Classical.choice, Quot.sound].

Usage: lake env lean axcheck.lean > axcheck.out 2>&1 ; python3 check_axcheck.py axcheck.out
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
out = pathlib.Path(sys.argv[1]).read_text()
expected = re.findall(r"^#print axioms (\S+)$", (ROOT / "axcheck.lean").read_text(), re.M)

dep = re.compile(r"'([^']+)' depends on axioms: \[([^\]]*)\]")
nodep = re.compile(r"'([^']+)' does not depend on any axioms")
reported = {}
for m in dep.finditer(out):
    reported[m.group(1)] = [a.strip() for a in m.group(2).split(",") if a.strip()]
for m in nodep.finditer(out):
    reported[m.group(1)] = []

ALLOWED = {"propext", "Classical.choice", "Quot.sound"}
CAPSTONE = "EntireLP.heat_preserves_LP_entire_of_growth"
fail = []

if len(reported) != len(expected):
    fail.append(f"COUNT INVARIANT: {len(reported)} reported vs {len(expected)} requested")
missing = [n for n in expected if n not in reported]
phantom = [n for n in reported if n not in expected]
if missing: fail.append(f"MISSING (never reported): {missing}")
if phantom: fail.append(f"PHANTOM (reported but not requested): {phantom}")
for n, axs in sorted(reported.items()):
    bad = set(axs) - ALLOWED
    if bad: fail.append(f"DIRTY AXIOMS in {n}: {sorted(bad)}")
if CAPSTONE not in reported:
    fail.append(f"CAPSTONE {CAPSTONE} absent")
elif set(reported[CAPSTONE]) != ALLOWED:
    fail.append(f"CAPSTONE axioms {reported[CAPSTONE]} != exactly {sorted(ALLOWED)}")
if re.search(r"error|sorry", out, re.I):
    for line in out.splitlines():
        if re.search(r"error|sorry", line, re.I):
            fail.append(f"OUTPUT FLAG: {line.strip()}")

if fail:
    print("AUDIT FAILED:")
    for f in fail: print("  -", f)
    sys.exit(1)
print(f"AUDIT PASSED: {len(reported)} declarations, all on subsets of "
      f"{sorted(ALLOWED)}; capstone '{CAPSTONE}' on exactly the 3 standard axioms.")
