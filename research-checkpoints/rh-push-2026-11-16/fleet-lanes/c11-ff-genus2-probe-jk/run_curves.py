"""run_curves.py Q DEG [SAMPLE]: per squarefree monic F of degree DEG over F_Q: r(F), L_1..L_3, S_cop(k; N, lam) on the registered grid.
Output: curves_q{Q}_d{DEG}.json = distinct points (r, L1, L2, L3) -> S vector, multiplicity, one example F; mismatch count.
Exact integers. Largest table: 60 x (q^3 - q^2) int64 coefficients (< 1 MB)."""
import sys, os, json, random, time
os.environ["Q"] = sys.argv[1]
from sq_q import *
from multiprocessing import Pool
DEG = int(sys.argv[2]); SAMPLE = int(sys.argv[3]) if len(sys.argv) > 3 else 0
NS = [1, 2, 3]; LAMS = [0, 1, 2, 3, 7]; KMAX = 3
GRID = [(N, lam, k) for N in NS for lam in LAMS for k in range(KMAX+1)]
PRL = [p for d in (1, 2, 3) for p in PR[d]]; PIDX = {p: i for i, p in enumerate(PRL)}
# coefficient vectors: S_cop(k; N, lam) = sum_{A'} w(A') C[N][lam][k][A'], by linearity of scop in w (same function scop, unit weights)
COEF = {}
for N in NS:
    for lam in LAMS:
        M = [[0]*len(SQF[N]) for _ in range(KMAX+1)]
        for i, (A, ps) in enumerate(SQF[N]):
            col = scop(lambda B, pp, A=A: 1 if B == A else 0, N, lam, KMAX)
            for k in range(KMAX+1): M[k][i] = col[k]
        COEF[(N, lam)] = M
SQIDX = {N: [[PIDX[p] for p in ps] for A, ps in SQF[N]] for N in NS}
# all monic A of degree n <= 3 as multisets of primes (for L_n)
MONO = {1: {}, 2: {}, 3: {}}
def _build():
    import itertools
    for n in (1, 2, 3):
        for r in range(1, n+1):
            for comb in itertools.combinations_with_replacement(PRL, r):
                if sum(len(p)-1 for p in comb) == n:
                    A = (1,)
                    for p in comb: A = mul(A, p)
                    MONO[n][A] = [PIDX[p] for p in comb]
        assert len(MONO[n]) == q**n
_build()
MONOIDX = {n: list(MONO[n].values()) for n in (1, 2, 3)}
def deriv(F): return [(i*c) % q for i, c in enumerate(F)][1:]
def one(F):
    if res(list(F), deriv(F)) == 0: return None
    chi = [LEG[res(list(F), list(p))] for p in PRL]
    r = sum(1 for i in range(q) if chi[i] == 0)
    L = []
    for n in (1, 2, 3):
        s = 0
        for idx in MONOIDX[n]:
            v = 1
            for i in idx: v *= chi[i]
            s += v
        L.append(s)
    S = []
    for N in NS:
        w = []
        for idx in SQIDX[N]:
            v = 1
            for i in idx: v *= chi[i]
            w.append(v)
        nz = [(i, v) for i, v in enumerate(w) if v]
        for lam in LAMS:
            for row in COEF[(N, lam)]: S.append(sum(v*row[i] for i, v in nz))
    # order of S: N, lam, k  (same as GRID)
    return (r, L[0], L[1], L[2]), S
def chunk(idxs):
    out = []
    for idx in idxs:
        F = tuple((idx//q**a) % q for a in range(DEG)) + (1,)
        o = one(F)
        if o is not None: out.append((idx, o))
    return out
if __name__ == "__main__":
    t0 = time.time(); tot = q**DEG
    if SAMPLE:
        random.seed(20261119); idxs = random.sample(range(tot), SAMPLE*2)
    else: idxs = list(range(tot))
    # direct check of scop linearity path against scop itself on 3 curves
    for idx in idxs[:40]:
        F = tuple((idx//q**a) % q for a in range(DEG)) + (1,); o = one(F)
        if o is None: continue
        v = nu(F); ref = []
        for N in NS:
            for lam in LAMS: ref.extend(scop(lambda A, ps: v(A), N, lam, KMAX))
        assert ref == o[1], (F, ref[:5], o[1][:5])
        assert [sum(v(A) for A in mono(n)) for n in (1, 2, 3)] == list(o[0][1:])
    chunks = [idxs[i:i+500] for i in range(0, len(idxs), 500)]
    pts = {}; nsq = 0; mism = 0
    with Pool(4) as pool:
        for outc in pool.imap(chunk, chunks):
            for idx, (key, S) in outc:
                if SAMPLE and nsq >= SAMPLE: break
                nsq += 1; ks = ",".join(map(str, key))
                if ks in pts:
                    if pts[ks]["S"] != S: mism += 1; pts[ks].setdefault("alt", []).append([idx, S])
                    pts[ks]["mult"] += 1
                else: pts[ks] = {"S": S, "mult": 1, "F": idx}
    print(f"q={q} deg={DEG} squarefree curves={nsq} (all={tot - tot//q}) distinct (r,L1,L2,L3)={len(pts)} S-not-a-function-of-point mismatches={mism} time={time.time()-t0:.1f}s")
    json.dump({"q": q, "deg": DEG, "ncurves": nsq, "sample": SAMPLE, "grid": GRID, "mismatch": mism, "pts": pts}, open(f"curves_q{q}_d{DEG}.json", "w"))
