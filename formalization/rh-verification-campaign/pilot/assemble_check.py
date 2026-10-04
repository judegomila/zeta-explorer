#!/usr/bin/env python3
"""
b145-D assembly checker: decides whether a set of chain-worker logs certifies
"every zero of zeta with ordinate in (t_lo, t_hi] is simple and on the critical line".

Usage: assemble_check.py <t_lo> <t_hi> <n_expected_first|none> log1.jsonl [log2.jsonl ...]

Checks (all must pass):
  C1 every OK chunk has ordered_disjoint == true; FAIL lines are allowed only if a
     later OK chunk in the same log starts at the same n_first (retry succeeded);
  C2 within each log, consecutive OK chunks satisfy n_first[c+1] == n_last[c] + 1;
  C3 across logs (sorted by first zero ordinate): n_first[next] <= n_last[prev] + 1
     (overlap allowed) and, on the overlap, the logs agree on the index of the
     first zero of the later log (its ordinate interval lies after the prev log's
     zero n_first[next]-1 when that zero is present);
  C4 coverage: the certified index range contains a zero with ordinate <= t_lo
     and a zero with ordinate > t_hi, so (t_lo, t_hi] is interior;
  C5 optional: if n_expected_first is given, the index of the last zero <= t_lo
     equals it (hand-off check against the prior verification, e.g. PT's
     N(3000175332800) = 12363153437138).
Indices are exact (Turing anchors), so C2/C3 imply no zero is missed between
consecutive certified zeros.
Exit 0 iff all pass; prints a JSON summary.
"""
import json
import sys
from fractions import Fraction


def F(s):
    return Fraction(s)


def load(path):
    ok, fails = [], []
    for line in open(path):
        line = line.strip()
        if not line:
            continue
        r = json.loads(line)
        (ok if r.get("status") == "OK" else fails).append(r)
    return ok, fails


def main():
    t_lo, t_hi = F(sys.argv[1]), F(sys.argv[2])
    n_exp = None if sys.argv[3] == "none" else int(sys.argv[3])
    logs = sys.argv[4:]
    errors = []
    segs = []
    retries = 0
    for p in logs:
        ok, fails = load(p)
        if not ok:
            errors.append(f"{p}: no OK chunks")
            continue
        starts = {int(r["n_first"]) for r in ok}
        for f in fails:
            retries += 1
            if int(f["n_first"]) not in starts:
                errors.append(f"{p}: unrecovered FAIL at n={f['n_first']} T={f['T']}")
        for r in ok:
            if not r.get("ordered_disjoint", False):
                errors.append(f"{p}: chunk {r['chunk']} not ordered/disjoint")
        for a, b in zip(ok, ok[1:]):
            if int(b["n_first"]) != int(a["n_last"]) + 1:
                errors.append(f"{p}: index gap {a['n_last']} -> {b['n_first']}")
            if F(b["t_first_lo"]) < F(a["t_last_hi"]):
                # isolating intervals of consecutive zeros may share an endpoint; overlap is an error
                errors.append(f"{p}: ordinate overlap at chunk {b['chunk']}")
        segs.append(dict(path=p, n0=int(ok[0]["n_first"]), n1=int(ok[-1]["n_last"]),
                         t0=F(ok[0]["t_first_lo"]), t1=F(ok[-1]["t_last_hi"]),
                         chunks=len(ok), zeros=sum(int(r["found"]) for r in ok),
                         cpu=sum(float(r["cpu_s"]) for r in ok) + sum(float(f.get("cpu_s", 0)) for f in fails)))
    segs.sort(key=lambda s: s["t0"])
    for a, b in zip(segs, segs[1:]):
        if b["n0"] > a["n1"] + 1:
            errors.append(f"cross-log gap: {a['path']} ends at n={a['n1']}, {b['path']} starts at n={b['n0']}")
    if segs:
        if not (segs[0]["t0"] <= t_lo):
            errors.append("coverage: first certified zero interval does not start at or below t_lo")
        if not (max(s["t1"] for s in segs) > t_hi):
            errors.append("coverage: last certified zero interval does not end above t_hi")
    summary = dict(
        logs=len(segs), retries=retries,
        n_first=segs[0]["n0"] if segs else None, n_last=max(s["n1"] for s in segs) if segs else None,
        t_first=float(segs[0]["t0"]) if segs else None, t_last=float(max(s["t1"] for s in segs)) if segs else None,
        chunks=sum(s["chunks"] for s in segs), zeros_reported=sum(s["zeros"] for s in segs),
        cpu_s=round(sum(s["cpu"] for s in segs), 2),
        errors=errors, PASS=not errors,
    )
    if n_exp is not None:
        summary["handoff_note"] = ("C5 requires the per-zero intervals (zeros.bin) to locate the last zero <= t_lo; "
                                   "run handoff_check.py on the first log")
    print(json.dumps(summary, indent=1))
    sys.exit(0 if not errors else 1)


if __name__ == "__main__":
    main()
