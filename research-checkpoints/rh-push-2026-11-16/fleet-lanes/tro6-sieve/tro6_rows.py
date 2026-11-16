#!/usr/bin/env python3
"""tro6_rows.py -- extend tmp/sextic/conj_rows.py to larger Q on the rows prime to 6 (xi(m) != 0 in (6.2)).
Reuses rho/se for N(m) <= 796 from tmp/sextic/conj_rows_800.npz; computes new rows up to Qmax or a wall-time limit.
Toy rows B_m(psi, R) as in conj_rows.py, psi in {alpha G, alpha}, R = Qj^1.4 for Qj in QJ (matched length ratio).
usage: tro6_rows.py Qmax tlimit_seconds
"""
import sys, os, math, time
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z
Z6 = Z.ZETA6
QJ = [100, 200, 400, 800, 1600, 3200, 6400]
def main():
    Qmax = int(sys.argv[1]); tlim = float(sys.argv[2]); t0 = time.time()
    here = os.path.dirname(os.path.abspath(__file__)); pref = os.path.join(here, 'tro6_rows')
    log = open(pref + '.log', 'w')
    def P(*a):
        s = ' '.join(str(x) for x in a); print(s, flush=True); log.write(s + '\n'); log.flush()
    T = A.SFTable(os.path.join(SX, 'data/sf_1e7.npz')); X = T.X
    old = np.load(os.path.join(SX, 'conj_rows_800.npz'))
    oldmap = {(int(a), int(b)): i for i, (a, b) in enumerate(old['ms'])}
    grid = A.geom_grid(1000, X, 90); B4 = A.Binner(T, grid, T.m4, 12)
    ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5)); e_ne0 = T.node_exponents(ne0).astype(np.int16)
    Nf = T.N.astype(float)
    alpha = ((T.na - T.nb / 2.0) + 1j * (T.nb * math.sqrt(3) / 2.0)) / np.sqrt(Nf)
    psis = {'aG': alpha * T.G(), 'a': alpha}
    coef = {}
    for Qj in QJ:
        R = Qj ** 1.4; lx = np.log(Nf / R); idx = np.flatnonzero(np.abs(lx) <= 2.2)
        w = np.exp(-2 * lx[idx] ** 2) / np.sqrt(Nf[idx])
        for name, ps in psis.items(): coef[(name, Qj)] = (idx, T.g2[idx] * ps[idx] * w)
    keys = list(coef.keys())
    Rr = int(math.isqrt(4 * Qmax // 3)) + 2
    ms = sorted([(a, b) for a in range(-Rr, Rr + 1) for b in range(-Rr, Rr + 1)
                 if 1 < Z.norm((a, b)) <= Qmax and Z.norm((a, b)) % 2 == 1 and Z.norm((a, b)) % 3 == 1],
                key=lambda t: (Z.norm(t), t))
    n = len(ms); P(f"rows prime to 6, 1 < N(m) <= {Qmax}: {n}; keys {len(keys)}; setup {time.time()-t0:.1f}s")
    rho = np.zeros((n, 12), complex); se = np.zeros((n, 12)); Bv = np.zeros((n, len(keys)), complex); Nm = np.zeros(n, np.int64)
    def save(upto):
        np.savez(pref + '.npz', ms=np.array(ms[:upto]), Nm=Nm[:upto], rho=rho[:upto], se=se[:upto], B=Bv[:upto],
                 keys=np.array([f"{k[0]}|{k[1]}" for k in keys]))
    done = 0; nchk = 0
    for i, m in enumerate(ms):
        if time.time() - t0 > tlim and Z.norm(m) != Nm[i - 1]: break
        em = T.node_exponents(m).astype(np.int16)
        if m in oldmap:
            j = oldmap[m]; rho[i] = old['rho'][j]; se[i] = old['se'][j]
            if nchk < 3:   # recompute a few as a consistency check
                ey = np.where(em < 0, -1, (em + e_ne0) % 6)
                dS, dn = B4.binned(np.where(ey >= 0, np.conj(Z6[np.maximum(ey, 0)]), 0) * T.g1)
                c = [A.fit_binned(grid, dS[:, s], dn[:, s], 2 / 3)[0] for s in range(12)]
                P(f"  check row {m}: max |rho_new - rho_old| = {np.abs(np.array(c) - rho[i]).max():.2e}"); nchk += 1
        else:
            ey = np.where(em < 0, -1, (em + e_ne0) % 6)
            dS, dn = B4.binned(np.where(ey >= 0, np.conj(Z6[np.maximum(ey, 0)]), 0) * T.g1)
            for s in range(12):
                c, sd, _, _ = A.fit_binned(grid, dS[:, s], dn[:, s], 2 / 3); rho[i, s] = c; se[i, s] = sd
        for j, k in enumerate(keys):
            idx, cf = coef[k]; e = em[idx]
            Bv[i, j] = (cf * np.where(e >= 0, Z6[np.maximum(e, 0)], 0)).sum()
        Nm[i] = Z.norm(m); done = i + 1
        if done % 250 == 0: save(done); P(f"  {done}/{n} rows (N <= {Nm[i]}), {time.time()-t0:.0f}s")
    save(done); P(f"done {done} rows, N(m) <= {Nm[done-1]}, {time.time()-t0:.1f}s")
if __name__ == '__main__': main()
