#!/usr/bin/env python3
"""rows.py -- combination 1 (and input (a) of combination 3) of lane s6-sextic-rows-zero-free-input-audit.

Moduli c: squarefree primary elements of O = Z[w] coprime to 6, N(c) <= X (table of tmp/sextic/build_table.py).
Columns n: all primary n in O coprime to 6 with N(n) <= L.   chi_c(n) = sextic symbol, e = exponent in zeta6^e.
Per column n it stores the shell sums  B[mult, j, shell] = sum_{c in shell, (c, n) = 1} mult(c) chi_c(n)^j,
mult in {gamma_1 (sextic Gauss sum), gamma_2 (cubic Gauss sum), fixed random unit phases}, j = 1..5.
Per worker it accumulates the rows  R_F(c) = sum_{N(n) <= Lcut} a_F(N(n)) N(n)^{-1/2} chi_c(n)^2  (cubic rows) for the
objects of objs1.OBJ and Lcut in LCUTS; the workers' partial rows are summed at the end.
usage: rows.py table.npz outprefix L [nworkers]
"""
import sys, os, math, time, json
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import alib as A, zomega as Z, objs1
Z6 = Z.ZETA6

def columns(L):
    R = int(math.isqrt(4 * L // 3)) + 3
    out = []
    for a in range(-R, R + 1):
        if a % 3 != 1: continue
        for b in range(-R, R + 1):
            if b % 3 != 0: continue
            N = a * a - a * b + b * b
            if N > L or N < 1: continue
            if a % 2 == 0 and b % 2 == 0: continue
            out.append((N, a, b))
    out.sort()
    return out

def worker(wid, T, cols, mine, grid, flatbase, keep, nsh, rnd, tabs, iid, lcuts, pref):
    t0 = time.time()
    mult = [T.g1[keep], T.g2[keep], rnd[keep]]
    B = np.zeros((len(mine), 3, 5, nsh), complex)
    Rarr = np.zeros((len(lcuts), len(objs1.OBJ), T.n), np.complex64)
    z6 = Z6.astype(np.complex64)
    for t, ci in enumerate(mine):
        N, a, b = cols[ci]
        e = T.node_exponents((a, b))
        ek = e[keep]; ok = ek >= 0
        flat = (flatbase + np.maximum(ek, 0))[ok]
        for im in range(3):
            v = mult[im][ok]
            s = (np.bincount(flat, weights=v.real, minlength=nsh * 6) + 1j * np.bincount(flat, weights=v.imag, minlength=nsh * 6)).reshape(nsh, 6)
            for j in range(1, 6):
                B[t, im, j - 1] = s @ Z6[(j * np.arange(6)) % 6]
        ph = np.where(e >= 0, z6[(2 * np.maximum(e, 0)) % 6], 0).astype(np.complex64)
        for il, lc in enumerate(lcuts):
            if N > lc: continue
            for io, o in enumerate(objs1.OBJ):
                cf = iid[ci] if o == 'randiid' else tabs[o][N]
                Rarr[il, io] += np.complex64(cf / math.sqrt(N)) * ph
        if wid == 0 and (t % 50 == 0): print(f"  worker 0: {t}/{len(mine)} columns, {time.time() - t0:.0f}s", flush=True)
    np.save(f"{pref}_B_{wid}.npy", B); np.save(f"{pref}_R_{wid}.npy", Rarr)

def main():
    path, pref, L = sys.argv[1], sys.argv[2], int(float(sys.argv[3]))
    nw = int(sys.argv[4]) if len(sys.argv) > 4 else int(os.environ.get('RH_WORKERS', '4'))
    t0 = time.time()
    T = A.SFTable(path); X = T.X
    cols = columns(L)
    lcuts = sorted(set([min(L, 300), min(L, 1000), L]))
    print(f"table X = {X:.3g}, nodes {T.n}; columns {len(cols)} (N <= {L}); workers {nw}; Lcuts {lcuts}", flush=True)
    print(f"planned: R arrays per worker {len(lcuts) * len(objs1.OBJ) * T.n * 8 / 2**30:.2f} GB x {nw}; B total {len(cols) * 15 * 120 * 16 / 2**30:.3f} GB", flush=True)
    grid = A.geom_grid(1000, X, 100); nsh = len(grid)
    shell = np.searchsorted(grid, T.N, side='left')
    keep = shell < nsh
    flatbase = (shell[keep] * 6).astype(np.int64)
    rng = np.random.default_rng(3)
    rnd = np.exp(2j * np.pi * rng.random(T.n))
    tabs = objs1.coeff_tables(L)
    iid = np.exp(2j * np.pi * np.random.default_rng(17).random(len(cols)))
    import multiprocessing as mp
    ctx = mp.get_context('fork')
    procs = []
    for w in range(nw):
        mine = list(range(w, len(cols), nw))
        pr = ctx.Process(target=worker, args=(w, T, cols, mine, grid, flatbase, keep, nsh, rnd, tabs, iid, lcuts, pref))
        pr.start(); procs.append(pr)
    for pr in procs: pr.join()
    assert all(pr.exitcode == 0 for pr in procs), [pr.exitcode for pr in procs]
    B = np.zeros((len(cols), 3, 5, nsh), complex); Rsum = None
    for w in range(nw):
        B[w::nw] = np.load(f"{pref}_B_{w}.npy"); os.remove(f"{pref}_B_{w}.npy")
        r = np.load(f"{pref}_R_{w}.npy"); os.remove(f"{pref}_R_{w}.npy")
        Rsum = r if Rsum is None else Rsum + r
    cnt = np.bincount(shell[keep], minlength=nsh)
    np.savez(pref + '_B.npz', B=B, cols=np.array(cols), grid=grid, cnt=cnt, X=X, L=L, iid=iid)
    # reductions of the rows: per shell  sum mult(c) R_F(c)  and  sum |R_F(c)|^2 ; plus first-moment and counts
    mults = [T.g1, T.g2, rnd, np.ones(T.n, complex)]
    SR = np.zeros((len(lcuts), len(objs1.OBJ), 4, nsh), complex); S2 = np.zeros((len(lcuts), len(objs1.OBJ), nsh))
    S4 = np.zeros((len(lcuts), len(objs1.OBJ), nsh))
    sk = shell[keep]
    for il in range(len(lcuts)):
        for io in range(len(objs1.OBJ)):
            r = Rsum[il, io].astype(complex)[keep]
            for im in range(4):
                v = mults[im][keep] * r
                SR[il, io, im] = np.bincount(sk, weights=v.real, minlength=nsh) + 1j * np.bincount(sk, weights=v.imag, minlength=nsh)
            S2[il, io] = np.bincount(sk, weights=np.abs(r) ** 2, minlength=nsh)
            S4[il, io] = np.bincount(sk, weights=np.abs(r) ** 4, minlength=nsh)
    np.savez(pref + '_R.npz', SR=SR, S2=S2, S4=S4, lcuts=np.array(lcuts), obj=np.array(objs1.OBJ), grid=grid, cnt=cnt, X=X)
    print(f"done {time.time() - t0:.0f}s", flush=True)

if __name__ == '__main__':
    main()
