"""run_fakes.py Q DEG: control. Fake L-polynomials prod_m (1 - s_m u + q u^2), integer coefficients, classes W / R / C
(PREREG), 24 seeds each (seed 20261119), against the curve-independent law fitted on curves (analysis_q{Q}_d{DEG}.json).
Also: the same block tests on every distinct curve point. Exact Fractions; class assignment uses floats with an asserted margin."""
import sys, os, json, random, math, itertools
os.environ["Q"] = sys.argv[1]
from sq_q import *
DEG = int(sys.argv[2]); g = (DEG-1)//2; B = 2*math.sqrt(q)
an = json.load(open(f"analysis_q{q}_d{DEG}.json")); cu = json.load(open(f"curves_q{q}_d{DEG}.json")); GRID = [tuple(x) for x in cu["grid"]]
def Lof(e):
    if g == 2: e1, e2 = e; return [1, -e1, 2*q+e2, -q*e1, q*q]
    e1, e2, e3 = e; L1, L2, L3 = -e1, 3*q+e2, -(2*q*e1+e3); return [1, L1, L2, L3, q*L2, q*q*L1, q**3]
def eof(L):
    return (-L[1], L[2]-2*q) if g == 2 else (-L[1], L[2]-3*q, -L[3]+2*q*L[1])
def sroots(e):
    if g == 2:
        e1, e2 = e; d = e1*e1-4*e2
        if d < 0: return None
        return [(e1-math.sqrt(d))/2, (e1+math.sqrt(d))/2]
    e1, e2, e3 = e
    disc = 18*e1*e2*e3 - 4*e1**3*e3 + e1*e1*e2*e2 - 4*e2**3 - 27*e3*e3   # discriminant of s^3 - e1 s^2 + e2 s - e3
    if disc < 0: return None
    # all real: trigonometric solution
    p = e2 - e1*e1/3; qq = -2*e1**3/27 + e1*e2/3 - e3
    if abs(p) < 1e-12: return [e1/3]*3
    m = 2*math.sqrt(-p/3); arg = max(-1.0, min(1.0, 3*qq/(p*m)))
    return sorted(m*math.cos(math.acos(arg)/3 - 2*math.pi*k/3) + e1/3 for k in range(3))
def cls(e):
    s = sroots(e)
    if s is None: return "C"
    mx = max(abs(x) for x in s); assert abs(mx - B) > 1e-7
    return "W" if mx < B else "R"
def minors_psd(M):
    """exact: symmetric M is positive semidefinite iff all principal minors >= 0"""
    n = len(M)
    def det(A):
        A = [[Fr(x) for x in r] for r in A]; m = len(A); d = Fr(1)
        for i in range(m):
            p = next((r for r in range(i, m) if A[r][i] != 0), None)
            if p is None: return Fr(0)
            if p != i: A[i], A[p] = A[p], A[i]; d = -d
            d *= A[i][i]
            for r in range(i+1, m):
                f = A[r][i]/A[i][i]
                if f: A[r] = [x-f*y for x, y in zip(A[r], A[i])]
        return d
    for k in range(1, n+1):
        for idx in itertools.combinations(range(n), k):
            if det([[M[i][j] for j in idx] for i in idx]) < 0: return False
    return True
def blocks(t):
    """Gram (= minus intersection form) on symmetric classes B_j = P_(g+j) + q^j P_(g-j), j = 0..g, antisymmetric A_j = P_(g+j) - q^j P_(g-j), j = 1..g"""
    G = gram(t, 2*g, g)
    def vec(j, sgn):
        x = [Fr(0)]*(2*g+1); x[g+j] += 1; x[g-j] += sgn*q**j; return x
    Bv = [vec(j, 1) for j in range(g+1)]; Av = [vec(j, -1) for j in range(1, g+1)]
    bil = lambda x, y: sum(x[i]*y[j]*G[i][j] for i in range(2*g+1) for j in range(2*g+1))
    SS = [[bil(x, y) for y in Bv] for x in Bv]; AA = [[bil(x, y) for y in Av] for x in Av]; SA = [[bil(x, y) for y in Av] for x in Bv]
    return SS, AA, all(v == 0 for row in SA for v in row)
def n1test(t):
    """N = 1 inequality with c = (0, 1): S = t_1, D = P_2 + q P_0; returns S^2, H, -D.D"""
    x = xvec([Fr(0), Fr(1)], 1); ddn = qf(gram(t, 2, g), x); return t[1]**2, Fr(g, 2)*ddn/q, ddn
def polyval(key, L):
    P = an["polys"][key]; v = {"1": 1, "L1": L[1], "L1^2": L[1]**2, "L2": L[2], "L1^3": L[1]**3, "L1*L2": L[1]*L[2], "L3": L[3]}
    return sum(Fr(c)*v[m] for m, c in zip(P["monos"], P["coef"]))
# ---------- curves: block tests on every distinct L point
pts = {}
for ks, rec in cu["pts"].items():
    r, L1, L2, L3 = map(int, ks.split(",")); L = tuple(Lof(eof([1, L1, L2, L3])))
    if g == 2: assert L[3] == q*L1
    pts[L] = pts.get(L, 0) + rec["mult"]
st = {"n": 0, "sym_psd": 0, "anti_psd": 0, "orth": 0, "ineq": 0, "eq": 0, "alleq": 0, "H0": 0, "eq_implies_alleq": 0, "rho_min": None}
for L, m in pts.items():
    t = traces(None, list(L), 2*g); SS, AA, orth = blocks(t); s2, H, ddn = n1test(t)
    st["n"] += 1; st["sym_psd"] += minors_psd(SS); st["anti_psd"] += minors_psd(AA); st["orth"] += orth; st["ineq"] += (s2 <= H and ddn >= 0)
    e = eof(L); alleq = (e[0]**2 == 4*e[1]) if g == 2 else (e[0]**2 == 3*e[1] and 27*e[2] == e[0]**3)
    st["alleq"] += alleq; st["H0"] += (H == 0); st["eq"] += (H != 0 and s2 == H); st["eq_implies_alleq"] += (H != 0 and s2 == H and alleq)
    if H != 0:
        rho = Fr(s2)/H; st["rho_min"] = rho if st["rho_min"] is None else min(st["rho_min"], rho)
st["rho_min"] = str(st["rho_min"])
print(f"== q={q} g={g}: curves, distinct L-polynomials {st['n']}: sym block PSD {st['sym_psd']}, antisym block PSD {st['anti_psd']}, sym orthogonal to antisym {st['orth']}, N=1 inequality {st['ineq']}, equality (H != 0) {st['eq']} of which all s_m equal {st['eq_implies_alleq']}; all s_m equal {st['alleq']}; H = 0: {st['H0']}; min rho {st['rho_min']}")
# ---------- fakes
random.seed(20261119 + 100*q + g); fakes = {"W": [], "R": [], "C": []}; tries = 0
curveL = set(pts)
while min(len(v) for v in fakes.values()) < 24:
    tries += 1
    if g == 2:
        if tries % 2: e = (random.randint(-14, 14), random.randint(-45, 45))
        else:
            s = [random.uniform(-B, B) for _ in range(2)]; e = (round(s[0]+s[1]), round(s[0]*s[1]))
    else:
        if tries % 2: e = (random.randint(-14, 14), random.randint(-60, 60), random.randint(-160, 160))
        else:
            s = [random.uniform(-1.6*B, 1.6*B) for _ in range(3)]; e = (round(sum(s)), round(s[0]*s[1]+s[0]*s[2]+s[1]*s[2]), round(s[0]*s[1]*s[2]))
    if e[0] == 0: continue
    c = cls(e)
    if len(fakes[c]) < 24 and e not in fakes[c]: fakes[c].append(e)
out = {"q": q, "g": g, "curves": st, "fakes": {}}
keys1 = [k for k in an["polys"] if k.split("|")[0] in ("0", "1")]
polys_r_differ = sum(1 for k in an["polys"] if k.startswith("0|") and ("1|"+k[2:]) in an["polys"] and an["polys"][k]["coef"] != an["polys"]["1|"+k[2:]]["coef"])
print(f"   law used for fakes: {len(keys1)} polynomials (strata r = 0, 1; full monomial rank); vectors whose polynomial differs between r = 0 and r = 1: {polys_r_differ}")
for c in ("W", "R", "C"):
    rec = {"n": 0, "is_curve_L": 0, "sym_psd": 0, "anti_psd": 0, "orth": 0, "ineq": 0, "DD_neg": 0, "S0": 0, "DD0": 0, "gap0": 0, "rhos": [], "list": [], "law_lin_ok": 0, "law_lin_tot": 0, "h2_lower_ok": 0, "h2_lower_tot": 0, "N1_all_vectors_agree": 0}
    for e in fakes[c]:
        L = Lof(e); t = traces(None, L, 2*g); SS, AA, orth = blocks(t); s2, H, ddn = n1test(t)
        rec["n"] += 1; rec["is_curve_L"] += (tuple(L) in curveL); rec["sym_psd"] += minors_psd(SS); rec["anti_psd"] += minors_psd(AA); rec["orth"] += orth
        ok = (s2 <= H and ddn >= 0); rec["ineq"] += ok; rec["DD_neg"] += (ddn < 0); rec["S0"] += (s2 == 0); rec["DD0"] += (ddn == 0)
        gap = H - s2; rec["gap0"] += (gap == 0); rho = (float(Fr(s2)/H) if H != 0 else None); rec["rhos"].append(rho)
        # the law itself on the fake: every N = 1 vector of strata r = 0, 1 gives the same verdict (S = c_1 t_1)
        agree = True
        for k in keys1:
            r, N, lam, kk = k.split("|")
            if N != "1": continue
            S = polyval(k, L); cc = an["strata"][k].get("c")
            if cc is None: agree = False; continue
            cv = [Fr(x) for x in cc]; rec["law_lin_tot"] += 1; rec["law_lin_ok"] += (S == sum(a*b for a, b in zip(cv, t)))
            x = xvec(cv, 1); dd = qf(gram(t, 2, g), x); agree &= ((S*S <= Fr(g, 2)*dd/q and dd >= 0) == ok)
        rec["N1_all_vectors_agree"] += agree
        # post hoc (not registered): pure N = 2 signal h_2 = L1^2 - L2 >= -g q
        h2 = L[1]**2 - L[2]; rec["h2_lower_tot"] += 1; rec["h2_lower_ok"] += (h2 >= -g*q)
        rec["list"].append({"e": e, "L": L, "S2": str(s2), "H": str(H), "ineq": ok, "sym_psd": minors_psd(SS), "anti_psd": minors_psd(AA), "h2": h2})
    rr = [x for x in rec["rhos"] if x is not None]
    print(f"   class {c}: n={rec['n']} (equal to a curve L-polynomial of this family: {rec['is_curve_L']}) | sym block PSD {rec['sym_psd']} | antisym block PSD {rec['anti_psd']} | orthogonal {rec['orth']} | N=1 inequality 0<=S^2<=H holds {rec['ineq']} (-D.D<0: {rec['DD_neg']}) | all N=1 vectors agree {rec['N1_all_vectors_agree']} | degenerate: S=0 {rec['S0']}, D.D=0 {rec['DD0']}, gap=0 {rec['gap0']} | rho range [{min(rr):.4f}, {max(rr):.4f}] | law = c.t on fake {rec['law_lin_ok']}/{rec['law_lin_tot']} | post hoc h_2 >= -g q: {rec['h2_lower_ok']}/{rec['h2_lower_tot']}")
    out["fakes"][c] = rec
json.dump(out, open(f"fakes_q{q}_d{DEG}.json", "w"))
