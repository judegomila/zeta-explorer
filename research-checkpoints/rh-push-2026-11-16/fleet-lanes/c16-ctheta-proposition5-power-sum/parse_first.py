"""Turns the logs of the two runs that were stopped before writing JSON (one-pair control, first pass; density-preserving rows, first pass;
universal clusters) into JSON for aggregate.py. Text processing only."""
import re, json, os, ast
HERE = os.path.dirname(os.path.abspath(__file__))
def rd(f):
    p = os.path.join(HERE, f)
    return open(p).read().splitlines() if os.path.exists(p) else []
one = []
for ln in rd("log_onepair_first.log"):
    m = re.match(r"onepair (\S+) (\S+) (\[.*?\]) (\[.*?\]) region (\S+) p5 (\S+) (\{.*\})", ln)
    if m:
        one.append(dict(T=float(m.group(1)), theta=float(m.group(2)), b1_M0=ast.literal_eval(m.group(3)), b1_M1=ast.literal_eval(m.group(4)), b_region=float(m.group(5)), b_p5=float(m.group(6)), mech=ast.literal_eval(m.group(7)), positions=41))
json.dump(one, open(os.path.join(HERE, "out_onepair_first.json"), "w"))
nat = []
for ln in rd("log_nat_first.log"):
    m = re.match(r"nat (\S+) (\S+) (\d+) kappa=2pi/\(d u\) (\S+) b_max_pass (\S+) region (\S+) (\[.*\])", ln)
    if m:
        bm = m.group(5)
        nat.append(dict(T=float(m.group(1)), theta=float(m.group(2)), n=int(m.group(3)), mode="nat", kappa=float(m.group(4)), b_region=float(m.group(6)), best=(None if bm == "None" else dict(bstar=float(bm))), trials=ast.literal_eval(m.group(7))))
json.dump(nat, open(os.path.join(HERE, "out_nat_first.json"), "w"))
un = []
for ln in rd("log_univ.log"):
    m = re.match(r"univ n (\d+) eps (\S+) A_max (\S+) (\[.*\])", ln)
    if m:
        tr = [dict(A=a, min=float(x), fam_min=float(y)) for a, x, y in ast.literal_eval(m.group(4))]
        am = m.group(3)
        un.append(dict(n=int(m.group(1)), eps=float(m.group(2)), best=(None if am == "None" else dict(A=float(am), min=[t["min"] for t in tr if t["A"] == float(am)][0])), trials=tr))
json.dump(un, open(os.path.join(HERE, "out_univ.json"), "w"))
print(len(one), len(nat), len(un))
