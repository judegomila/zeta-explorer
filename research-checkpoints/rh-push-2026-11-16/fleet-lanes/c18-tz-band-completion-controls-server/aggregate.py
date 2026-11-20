# aggregate.py: tables from res_*.jsonl (text processing only). usage: python aggregate.py > tables.txt
import json, glob, statistics as st, collections
rows = []
seen = set()
for f in sorted(glob.glob("res_*.jsonl")):
    for line in open(f):
        r = json.loads(line)
        k = (r["T0"], r["w"], r["theta"], r["form"], r["obj"])
        if k in seen or ("status" in r and r["obj"] == "all"):
            continue
        seen.add(k)
        rows.append(r)
def cls(o):
    return "chains(24)" if o.startswith("chain") else o
def fmt(x):
    return "%.4g" % x
for form in ("D", "C"):
    G = collections.defaultdict(list)
    NR = collections.defaultdict(int)
    for r in rows:
        if r.get("form") != form:
            continue
        key = (r["T0"], r["theta"], cls(r["obj"]))
        if "status" in r:
            NR[key] += 1
            continue
        G[key].append(r)
    for k in list(NR):
        if k in G:
            del NR[k]
    if not G and not NR:
        continue
    print("## Form %s" % form)
    print("| T0 | theta | u/Lg | object | cells | pass M=0 | pass M=1 | fail M=1 | undecided | s min | s median | s max |" + (" s median without reflected | norm reflected/Lg |" if form == "C" else ""))
    print("|---|---|---|---|---|---|---|---|---|---|---|---|" + ("---|---|" if form == "C" else ""))
    order = ["zeta", "liouville", "chains(24)", "E_a=0.1", "E_a=0.3", "T-NR", "ZQ eta=0.25", "ZQ eta=0.05", "DH", "all"]
    keys = sorted(set(list(G.keys()) + list(NR.keys())), key=lambda k: (k[0], k[1], order.index(k[2]) if k[2] in order else 99))
    for k in keys:
        rs = G.get(k, [])
        if not rs:
            print("| %g | %g | | %s | 0 | not run | | | | | | |" % (k[0], k[1], k[2]))
            continue
        s = [r["s"] for r in rs]
        p0 = sum(r["signs"]["0"] == "pos" for r in rs)
        p1 = sum(r["signs"]["1"] == "pos" for r in rs)
        f1 = sum(r["signs"]["1"] == "neg" for r in rs)
        und = sum(v == "undecided" for r in rs for v in r["signs"].values())
        extra = ""
        if form == "C":
            extra = " %s (pass M=0: %d, M=1: %d) | %s |" % (fmt(st.median([r["lam_min_no_reflected"] / r["Lg"] for r in rs])), sum(r["signs_no_reflected"]["0"] == "pos" for r in rs), sum(r["signs_no_reflected"]["1"] == "pos" for r in rs), fmt(st.median([r["norm_reflected"] for r in rs])))
        print("| %g | %g | %.3f | %s | %d | %d | %d | %d | %d | %s | %s | %s |%s" % (k[0], k[1], rs[0]["u"] / rs[0]["Lg"], k[2], len(rs), p0, p1, f1, und, fmt(min(s)), fmt(st.median(s)), fmt(max(s)), extra))
    print()
# zeta components and enclosure, Form D
print("## zeta, Form D: components (medians over windows) and enclosure")
print("| T0 | theta | windows | lam_max/Lg median | norm prime/Lg | norm pole/Lg | norm (Arch - Lg)/Lg | enclosed | max enclosure tol | max entry radius |")
print("|---|---|---|---|---|---|---|---|---|---|")
G = collections.defaultdict(list)
for r in rows:
    if r.get("form") == "D" and r.get("obj") == "zeta" and "status" not in r:
        G[(r["T0"], r["theta"])].append(r)
for k in sorted(G):
    rs = G[k]
    print("| %g | %g | %d | %s | %s | %s | %s | %d of %d | %.2e | %.2e |" % (k[0], k[1], len(rs), fmt(st.median([r["lam_max"] / r["Lg"] for r in rs])), fmt(st.median([r["norm_prime"] for r in rs])), fmt(max(r["norm_pole"] for r in rs)), fmt(max(r["norm_arch_dev"] for r in rs)), sum(bool(r.get("enclosed")) for r in rs), len(rs), max(r["encl_tol"] for r in rs), max(r["rad"] for r in rs)))
print()
# chains: per chain count
print("## chains, Form D: number of the 24 chains that fail (M = 1, certified) in every window / in at least one window / in none")
print("| T0 | theta | windows | every window | at least one | none |")
print("|---|---|---|---|---|---|")
C = collections.defaultdict(lambda: collections.defaultdict(list))
for r in rows:
    if r.get("form") == "D" and r.get("obj", "").startswith("chain") and "status" not in r:
        C[(r["T0"], r["theta"])][r["obj"]].append(r["signs"]["1"] == "neg")
for k in sorted(C):
    d = C[k]
    print("| %g | %g | %d | %d | %d | %d |" % (k[0], k[1], max(len(v) for v in d.values()), sum(all(v) for v in d.values()), sum(any(v) for v in d.values()), sum(not any(v) for v in d.values())))
