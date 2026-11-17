import json, collections
r = json.load(open('scan_main.json'))
by = collections.defaultdict(list)
for q in r: by[q['sigma']].append(q)
out = {}
for sg, rows in by.items():
    W = [round(q['W']) for q in rows]
    nonint = sum(abs(q['W'] - round(q['W'])) > 1e-3 for q in rows)
    ch = sum(W[i] != W[i + 1] for i in range(len(W) - 1))
    big = sum(abs(W[i] - W[i + 1]) > 1 for i in range(len(W) - 1))
    hist = dict(sorted(collections.Counter(W).items()))
    seg = {}
    for a in (10, 20, 30, 40):
        ws = [w for q, w in zip(rows, W) if a <= q['t'] < a + 10]
        seg["%d-%d" % (a, a + 10)] = (round(sum(ws) / len(ws), 3), min(ws), max(ws))
    where = collections.Counter(rows[i + 1]['minAt'][0] for i in range(len(W) - 1) if W[i] != W[i + 1])
    out[sg] = dict(nonint=nonint, changes=ch, multi_step_changes=big, hist=hist, mean=round(sum(W) / len(W), 3), by_decade=seg, minF=min(q['minF'] for q in rows))
    print("sigma", sg, out[sg])
    # W at t nearest the zeta zeros
    for g in (14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719, 43.327073, 48.005151, 49.773832):
        i = min(range(len(rows)), key=lambda i: abs(rows[i]['t'] - g))
        print("    near gamma=%.3f: W(t-0.1..t+0.1) =" % g, W[max(i - 2, 0):i + 3])
json.dump(out, open('scan_summary.json', 'w'), indent=1)
