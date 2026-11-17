"""Extract all double-zero events (arrivals onto / departures from the line Re s = w/2) from the line scans,
refine each to 60+ digits, classify, and follow lineage labels of on-line zeros."""
import sys, json, time
from zf import *
from track import collide, fH
from flint import acb, arb, ctx
TCUT = float(sys.argv[2]) if len(sys.argv) > 2 else 212.0
files = sys.argv[3:]
rows = []
for fn in files:
    rows += [json.loads(l) for l in open(fn)]
rows.sort(key=lambda r: r["w"])
rows = [{"w": 0.0, "zeros": []}] + rows
def match(A, B, tol=0.3, skip=0.2):
    n, m = len(A), len(B); INF = 1e18
    D = [[0.0]*(m+1) for _ in range(n+1)]; P = [[0]*(m+1) for _ in range(n+1)]
    for i in range(n+1):
        for j in range(m+1):
            if i == 0 and j == 0: continue
            best = INF; p = 0
            if i > 0 and D[i-1][j]+skip < best: best = D[i-1][j]+skip; p = 1
            if j > 0 and D[i][j-1]+skip < best: best = D[i][j-1]+skip; p = 2
            if i > 0 and j > 0 and abs(A[i-1]-B[j-1]) < tol and D[i-1][j-1]+abs(A[i-1]-B[j-1]) < best:
                best = D[i-1][j-1]+abs(A[i-1]-B[j-1]); p = 3
            D[i][j] = best; P[i][j] = p
    i, j = n, m; ma = [None]*n; mb = [None]*m
    while i > 0 or j > 0:
        p = P[i][j]
        if p == 3: ma[i-1] = j-1; mb[j-1] = i-1; i -= 1; j -= 1
        elif p == 1: i -= 1
        else: j -= 1
    return ma, mb
Z = ZF()
def refine(wlo, whi, t0):
    dw = whi - wlo
    for f in (0.5, 0.25, 0.75, 0.1, 0.9, 0.02, 0.98):
        try:
            wk, tk, ok, res = collide(Z, wlo + f*dw, t0)
        except Exception as e:
            continue
        if ok and wlo - dw <= float(wk) <= whi + dw and abs(float(tk)-t0) < 0.25:
            e = arb(10)**(-25)
            hw = (fH(Z, wk+e, tk)[0] - fH(Z, wk-e, tk)[0])/(2*e)
            htt = (fH(Z, wk, tk+e)[1] - fH(Z, wk, tk-e)[1])/(2*e)
            kind = "arrival" if float(hw/htt) < 0 else "departure"
            return wk.str(70, radius=False), tk.str(70, radius=False), res, kind, float(hw/htt)
    return None
events = []; labels = []   # labels of on-line zeros in current row
anomalies = []
t00 = time.time()
for r0, r1 in zip(rows[:-1], rows[1:]):
    A = [z for z in r0["zeros"] if z <= TCUT+2]; B = [z for z in r1["zeros"] if z <= TCUT+2]
    labA = labels[:len(A)] + [None]*(len(A)-len(labels))
    ma, mb = match(A, B)
    labB = [labA[mb[j]] if mb[j] is not None else None for j in range(len(B))]
    ua = [i for i in range(len(A)) if ma[i] is None and A[i] <= TCUT]
    ub = [j for j in range(len(B)) if mb[j] is None and B[j] <= TCUT]
    def pairs(idx, L):
        out = []; k = 0
        while k < len(idx):
            if k+1 < len(idx) and idx[k+1] == idx[k]+1: out.append((idx[k], idx[k+1])); k += 2
            else: anomalies.append((r0["w"], r1["w"], L, idx[k])); k += 1
        return out
    for (i1, i2) in pairs(ua, "A"):
        t0 = (A[i1]+A[i2])/2
        ref = refine(r0["w"], r1["w"], t0)
        ev = {"scan_kind": "departure", "w_lo": r0["w"], "w_hi": r1["w"], "t_scan": t0, "gap_before": A[i2]-A[i1], "origins": [labA[i1], labA[i2]]}
        if ref: ev.update({"wk": ref[0], "tk": ref[1], "resid": ref[2], "kind": ref[3]})
        ev["id"] = len(events); events.append(ev)
    for (j1, j2) in pairs(ub, "B"):
        t0 = (B[j1]+B[j2])/2
        ref = refine(r0["w"], r1["w"], t0)
        ev = {"scan_kind": "arrival", "w_lo": r0["w"], "w_hi": r1["w"], "t_scan": t0, "gap_after": B[j2]-B[j1]}
        if ref: ev.update({"wk": ref[0], "tk": ref[1], "resid": ref[2], "kind": ref[3]})
        ev["id"] = len(events); events.append(ev)
        labB[j1] = labB[j2] = ev["id"]
    labels = labB
print("rows", len(rows), "events", len(events), "anomalies", len(anomalies), "time", round(time.time()-t00,1))
json.dump({"TCUT": TCUT, "events": events, "anomalies": anomalies, "final_labels": labels,
           "final_zeros": [z for z in rows[-1]["zeros"] if z <= TCUT+2], "final_w": rows[-1]["w"]}, open(sys.argv[1], "w"), indent=0)
