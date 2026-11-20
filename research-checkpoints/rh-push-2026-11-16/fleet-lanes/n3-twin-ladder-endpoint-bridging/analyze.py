import json, math
d = json.load(open("ev_fine.json")); ev = d["events"]
tr = [json.loads(l) for l in open("tr_main.jsonl")]
off = json.load(open("off_fine.json"))
uniq = {}
for e in ev:
    k = e["wk"][:30]
    if k not in uniq: uniq[k] = e
U = sorted(uniq.values(), key=lambda e: float(e["wk"]))
arr = [e for e in U if e["kind"] == "arrival"]; dep = [e for e in U if e["kind"] == "departure"]
print("unique refined events t<=205, 0<w<=1.3:", len(U), "arrivals", len(arr), "departures", len(dep))
a1 = [e for e in arr if float(e["wk"]) < 1]; d1 = [e for e in dep if float(e["wk"]) < 1]
print("w<1: arrivals", len(a1), "departures", len(d1), "net pairs on line at w=1:", len(a1)-len(d1), "-> zeros", 2*(len(a1)-len(d1)))
print("max residual:", max(max(e["resid"]) for e in U))
# first collisions
fc = {r["wk"][:30]: r["label"] for r in tr if r.get("collided")}
first = [e for e in arr if e["wk"][:30] in fc]
print("first collisions (tracker) total", len(fc), "; found among scan arrivals with t<=205:", len(first))
tk_first = [(float(r["s0"][1]), r["label"], float(r["wk"])) for r in tr if r.get("collided")]
L = [x for x in tk_first if x[1][0] == "L"]; A = [x for x in tk_first if x[1][0] == "A"]
print("ladder first-collision w: min %.5f max %.5f ; w*log(T/2pi): min %.4f max %.4f" % (min(x[2] for x in L), max(x[2] for x in L),
      min(x[2]*math.log(x[0]/2/math.pi) for x in L), max(x[2]*math.log(x[0]/2/math.pi) for x in L)))
print("AP first-collision w:", [(x[1], round(x[2], 4)) for x in A])
# lineage mixing
idmap = {e["id"]: e for e in ev}
mix = 0; same = 0; unk = 0
for e in dep:
    o = e.get("origins")
    if not o or None in o: unk += 1; continue
    k0, k1 = idmap[o[0]]["wk"][:30], idmap[o[1]]["wk"][:30]
    if k0 == k1: same += 1
    else: mix += 1
print("departures: colliding zeros born in the same arrival:", same, " in different arrivals (lineage mixing):", mix, " unknown:", unk)
# last arrival / first departure after 1 by height
for T in (60, 100, 150, 205):
    la = max((float(e["wk"]), float(e["tk"])) for e in a1 if float(e["tk"]) <= T)
    fd = [(float(e["wk"]), float(e["tk"])) for e in dep if float(e["wk"]) > 1 and float(e["tk"]) <= T]
    print(f"T<={T}: last arrival before 1: w={la[0]:.6f} at t={la[1]:.3f}; first departure after 1:", min(fd) if fd else "none below 1.3")
with open("events_table.tsv", "w") as f:
    f.write("kind\tw_k\tt_k\tresidual_H\tresidual_Ht\tnote\n")
    for e in U:
        note = fc.get(e["wk"][:30], "")
        f.write(f"{e['kind']}\t{e['wk'][:66]}\t{e['tk'][:66]}\t{e['resid'][0]:.1e}\t{e['resid'][1]:.1e}\t{note}\n")
with open("first_collisions.tsv", "w") as f:
    f.write("pair\theight_at_w0\tw_k\tt_k\n")
    for r in tr:
        if r.get("collided"): f.write(f"{r['label']}\t{r['s0'][1]:.6f}\t{r['wk'][:66]}\t{r['tk'][:66]}\n")
with open("excursions.tsv", "w") as f:
    f.write("depart_w\tdepart_t\treturn_w\treturn_t\tmax_distance_from_line\n")
    for o in off:
        f.write(f"{o['dep_wk'][:40]}\t{o['dep_tk'][:40]}\t{(o.get('ret_wk') or 'not before 1.3')[:40]}\t{(o.get('ret_tk') or '')[:40]}\t{o.get('max_offline_distance',0):.4f}\n")
# on-line counts at selected w
rows = [json.loads(l) for fn in ("scan_fine1.jsonl", "scan_fine2.jsonl") for l in open(fn)]
for w in (0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.92, 1.0, 1.1, 1.12, 1.2, 1.3):
    r = min(rows, key=lambda r: abs(r["w"]-w)); print("w=%.4f on-line zeros with t<=200: %d" % (r["w"], sum(1 for z in r["zeros"] if z <= 200)))
print("example event rows:")
for e in U:
    if abs(float(e["wk"])-0.3521733) < 1e-6 or abs(float(e["wk"])-0.5657369) < 1e-6 or abs(float(e["wk"])-0.9168512) < 1e-6 or abs(float(e["wk"])-1.122007)<1e-5:
        print(e["kind"], e["wk"][:66], e["tk"][:66], e["resid"], e.get("origins"), [fc.get(idmap[o]["wk"][:30]) for o in (e.get("origins") or []) if o is not None])
