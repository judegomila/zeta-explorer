#!/usr/bin/env python3
"""Insert the tables of analysis.txt into RESULT.md placeholders (block placeholders only)."""
import re, os
H = os.path.dirname(os.path.abspath(__file__))
a = open(os.path.join(H, "analysis.txt")).read()
def block(start, stop=None):
    i = a.index(start); j = a.index(stop, i) if stop else len(a)
    return "```\n" + a[i:j].rstrip() + "\n```"
s = open(os.path.join(H, "RESULT.md")).read()
nat = block("== natural slot [Z^l", "== fitted exponent")
fit_lines = [l for l in a[a.index("== fitted exponent"):a.index("== fixed number")].splitlines()
             if l.startswith("==") or re.match(r"\s+(Ap|Rc|R|K4a|Q|K|Q0)\s", l) or "number of marks" in l]
fit = "```\n" + "\n".join(fit_lines) + "\n```"
fx = block("== fixed number of marks", "== overlap model")
ov = block("== overlap model", "== natural slot: overlap prediction")
ovn = block("== natural slot: overlap prediction")
for k, v in [("@@NATTABLE@@", nat), ("@@FITTABLE@@", fit), ("@@FIXTABLE@@", fx), ("@@OVTABLE@@", ov), ("@@OVNAT@@", ovn)]:
    assert k in s, k
    s = s.replace(k, v)
open(os.path.join(H, "RESULT.md"), "w").write(s)
print("left:", sorted(set(re.findall(r"@@[A-Z0-9]+@@", s))))
