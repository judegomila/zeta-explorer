"""analyze.py Q DEG: registered tests on curves_q{Q}_d{DEG}.json. Exact (Fractions / integers)."""
import sys, os, json
os.environ["Q"] = sys.argv[1]
from sq_q import *
DEG = int(sys.argv[2]); g = (DEG-1)//2
tag = sys.argv[3] if len(sys.argv) > 3 else ""
d = json.load(open(f"curves_q{q}_d{DEG}{tag}.json")); GRID = [tuple(x) for x in d["grid"]]
def Lfull(L1, L2, L3):
    return [1, L1, L2, q*L1, q*q] if g == 2 else [1, L1, L2, L3, q*L2, q*q*L1, q**3]
def indep_rows(rows):
    """indices of a maximal independent subset of rows (incremental exact elimination)"""
    basis = []; idx = []
    for i, r in enumerate(rows):
        v = [Fr(x) for x in r]
        for piv, b in basis:
            if v[piv] != 0:
                f = v[piv]; v = [x - f*y for x, y in zip(v, b)]
        p = next((j for j, x in enumerate(v) if x != 0), None)
        if p is None: continue
        v = [x/v[p] for x in v]; basis.append((p, v)); idx.append(i)
        if len(idx) == len(r): break
    return idx
def particular(M, b):
    """a solution x of M x = b (M of full row rank), free variables 0"""
    n = len(M); m = len(M[0]); A = [[Fr(x) for x in row]+[Fr(y)] for row, y in zip(M, b)]; piv = []
    r = 0
    for c in range(m):
        p = next((i for i in range(r, n) if A[i][c] != 0), None)
        if p is None: continue
        A[r], A[p] = A[p], A[r]; A[r] = [x/A[r][c] for x in A[r]]
        for i in range(n):
            if i != r and A[i][c] != 0: A[i] = [x-A[i][c]*y for x, y in zip(A[i], A[r])]
        piv.append(c); r += 1
        if r == n: break
    x = [Fr(0)]*m
    for i, c in enumerate(piv): x[c] = A[i][m]
    return x
def fit(rows, ind, target):
    """fit target on independent rows, count rows off the fit"""
    x = particular([rows[i] for i in ind], [target[i] for i in ind])
    off = [i for i, r in enumerate(rows) if sum(a*b for a, b in zip(x, r)) != target[i]]
    return x, off
def monos(N):
    if N == 1: return ["1", "L1"]
    if N == 2: return ["1", "L1", "L1^2", "L2"]
    return ["1", "L1", "L1^2", "L2", "L1^3", "L1*L2"] + (["L3"] if g >= 3 else [])
def mono_row(N, L1, L2, L3):
    v = {"1": 1, "L1": L1, "L1^2": L1*L1, "L2": L2, "L1^3": L1**3, "L1*L2": L1*L2, "L3": L3}
    return [v[m] for m in monos(N)]
strata = {}
for ks, rec in d["pts"].items():
    r, L1, L2, L3 = map(int, ks.split(",")); strata.setdefault(r, []).append((L1, L2, L3, rec["S"], rec["mult"]))
out = {"q": q, "deg": DEG, "g": g, "ncurves": d["ncurves"], "strata": {}, "polys": {}}
print(f"== q={q} deg F={DEG} genus={g} curves={d['ncurves']} strata r: " + ", ".join(f"{r}: {len(v)} pts / {sum(x[4] for x in v)} curves" for r, v in sorted(strata.items())))
agg = {}
for r, pts in sorted(strata.items()):
    pts.sort(); T = [traces(None, Lfull(L1, L2, L3), 6) for L1, L2, L3, S, m in pts]; mult = [p[4] for p in pts]
    for N in (1, 2, 3):
        Mrows = [mono_row(N, p[0], p[1], p[2]) for p in pts]; Mind = indep_rows(Mrows)
        Trows = [t[:N+1] for t in T]; Tind = indep_rows(Trows)
        T2rows = [t[:2*N+1] for t in T]; T2ind = indep_rows(T2rows)
        for gi, (N_, lam, k) in enumerate(GRID):
            if N_ != N: continue
            S = [p[3][gi] for p in pts]; key = f"{r}|{N}|{lam}|{k}"
            rec = {"npts": len(pts), "ncurves": sum(mult), "rank_mono": len(Mind), "ncol_mono": len(Mrows[0]), "rank_t": len(Tind), "rank_t2": len(T2ind)}
            if all(s == 0 for s in S): rec["zero"] = True; out["strata"][key] = rec; continue
            xp, offp = fit(Mrows, Mind, S); rec["poly_off"] = len(offp); rec["poly"] = [str(x) for x in xp]
            if len(Mind) == len(Mrows[0]) and not offp: out["polys"][key] = {"monos": monos(N), "coef": [str(x) for x in xp]}
            c, offl = fit(Trows, Tind, S); rec["lin_off"] = len(offl); rec["lin_off_curves"] = sum(mult[i] for i in offl); rec["lin_free"] = len(pts) - len(Tind)
            _, offS2 = fit(T2rows, T2ind, [s*s for s in S]); rec["S2_in_span_t2N_off"] = len(offS2); rec["S2_free"] = len(pts) - len(T2ind)
            _, offS1 = fit(T2rows, T2ind, S); rec["S_in_span_t2N_off"] = len(offS1)
            if not offl and len(Tind) == N+1:
                rec["c"] = [str(x) for x in c]; x = xvec(c, N)
                nle = nneg = neq = neqpred = nbad = 0; rmin = None; rmax = None; ratios_E = set(); rho_hist = {}
                for (L1, L2, L3, _, m), t, s in zip(pts, T, S):
                    ddn = qf(gram(t, 2*N, g), x); H = Fr(g, 2)*ddn/q**N; E = ddn/(2*q**N)
                    if ddn < 0: nneg += m
                    if s*s <= H: nle += m
                    else: nbad += m
                    if H != 0:
                        rho = Fr(s*s)/H; rmin = rho if rmin is None else min(rmin, rho); rmax = rho if rmax is None else max(rmax, rho)
                        if rho == 1: neq += m
                    if E != 0: ratios_E.add(Fr(s*s)/E)
                    # predicted equality locus: all s_m equal
                    e1 = -L1; e2 = L2 - g*q
                    alleq = (e1*e1 == 4*e2) if g == 2 else (e1*e1 == 3*e2 and 27*(-(L3) - 2*q*e1) == e1**3)
                    if alleq: neqpred += m
                rec.update({"S2_le_H": nle, "S2_gt_H": nbad, "DD_wrong_sign": nneg, "rho_min": str(rmin), "rho_max": str(rmax), "rho_eq_1": neq, "all_s_equal": neqpred, "distinct_S2_over_E": len(ratios_E)})
                a = agg.setdefault(N, {"vec": 0, "curves": 0, "le": 0, "gt": 0, "neg": 0, "rmin": None, "rmax": None, "eq1": 0, "alleq": 0, "const_ratio": 0})
                a["vec"] += 1; a["curves"] += sum(mult); a["le"] += nle; a["gt"] += nbad; a["neg"] += nneg; a["eq1"] += neq; a["alleq"] += neqpred
                a["const_ratio"] += (len(ratios_E) <= 1)
                if rmin is not None:
                    a["rmin"] = rmin if a["rmin"] is None else min(a["rmin"], rmin); a["rmax"] = rmax if a["rmax"] is None else max(a["rmax"], rmax)
            out["strata"][key] = rec
# summary tables
for N in (1, 2, 3):
    print(f"-- N={N}")
    for r in sorted(strata):
        recs = [(k, v) for k, v in out["strata"].items() if k.startswith(f"{r}|{N}|")]
        nz = [v for k, v in recs if not v.get("zero")]
        if not nz: print(f"   r={r}: all vectors zero"); continue
        v0 = nz[0]
        print(f"   r={r}: pts={v0['npts']} curves={v0['ncurves']} nonzero vectors={len(nz)}/{len(recs)} | poly lemma: holds {sum(1 for v in nz if v['poly_off']==0)} (mono rank {v0['rank_mono']}/{v0['ncol_mono']}, free pts {v0['npts']-v0['rank_mono']})"
              f" | linear in t_0..t_N: holds {sum(1 for v in nz if v['lin_off']==0)} (free pts {v0['lin_free']}; off-fit pts min {min(v['lin_off'] for v in nz)} max {max(v['lin_off'] for v in nz)})"
              f" | S^2 in span t_0..t_2N: holds {sum(1 for v in nz if v['S2_in_span_t2N_off']==0)} (free pts {v0['S2_free']}) | S in span t_0..t_2N: holds {sum(1 for v in nz if v['S_in_span_t2N_off']==0)}")
    if N in agg:
        a = agg[N]
        print(f"   inequality where linear: vector-strata={a['vec']} curve-cases={a['curves']} S^2<=H: {a['le']} S^2>H: {a['gt']} -D.D<0: {a['neg']} rho in [{float(a['rmin']):.6f}, {float(a['rmax']):.6f}] rho=1: {a['eq1']} (all s_m equal: {a['alleq']}) vector-strata with constant S^2/E: {a['const_ratio']}")
json.dump(out, open(f"analysis_q{q}_d{DEG}{tag}.json", "w"))
