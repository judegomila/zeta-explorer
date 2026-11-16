#!/usr/bin/env python3
"""fast.py -- resumable, checkpointed version of rows_nat.py + pass2.py (same quantities, one pass per row).

Per row m (all nonzero m in O, sorted by norm, N(m) <= Qmax):
  rho_str, rho_cor, se   as in rows_nat.py (complete coefficient rho_nat = rho_str + rho_cor, proof note (3.9); PC = 100)
  B[key]                 toy cubic rows, A = c (n = 1 part)          keys psi|R as in tmp/sextic/conj_rows.py
  Bn[key]                the n != 1, n squarefree part of the rows with A = c n^3 (see pass2.py)
  E                      int8 sextic exponents of chi_c(m) for squarefree c prime to 6, N(c) <= CM (spectrum)
Runs for at most BUDGET seconds of wall time, saving a block file every BLK rows; rerun to resume.
usage: fast.py Qmax out_dir [budget_seconds]
"""
import sys, os, math, time, itertools, glob
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX); sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import alib as A, zomega as Z
import rows_nat as RN
Z6 = Z.ZETA6
LUT = np.concatenate([Z6, [0]])                  # exponent -1 -> 0
PC = 100; CM = 100000; BLK = 250

def main():
    Qmax, outd = int(sys.argv[1]), sys.argv[2]
    budget = float(sys.argv[3]) if len(sys.argv) > 3 else 1000.0
    t0 = time.time(); os.makedirs(outd, exist_ok=True)
    C = RN.Ctx(Qmax); T = C.T; n = T.n
    grid = C.grid; nsh = len(grid)
    shell = np.searchsorted(grid.astype(np.int64), T.N, side='left')
    assert shell.max() < nsh
    flat = shell * 12 + T.m4.astype(np.int64)
    perm = np.argsort(flat, kind='stable'); fs = flat[perm]
    L = nsh * 12
    starts = np.searchsorted(fs, np.arange(L), 'left'); ends = np.searchsorted(fs, np.arange(L), 'right')
    empty = ends == starts
    cum_pad = None
    def binsum(v):
        cs = np.concatenate([[0], np.cumsum(v)])
        return (cs[ends] - cs[starts]).reshape(nsh, 12)
    g1p = T.g1[perm]; g2p = T.g2[perm]; Np = T.N[perm]; Nf = Np.astype(float)
    nap = T.na[perm]; nbp = T.nb[perm]
    e_ne0 = C.e_ne0[perm]; assert (e_ne0 >= 0).all()
    g1e0 = np.conj(Z6[e_ne0]) * g1p
    a_th = grid.astype(float)[1:] ** (2 / 3) - grid.astype(float)[:-1] ** (2 / 3)
    def fit(dS, dn):
        d = dS[1:]; nn = dn[1:].astype(float); ok = nn > 0
        inv = np.where(ok, 1.0 / np.where(ok, nn, 1), 0)
        W = (a_th[:, None] ** 2 * inv).sum(0)
        return (a_th[:, None] * d * inv).sum(0) / W, 1 / np.sqrt(W)
    # ---- exponent cache for primes of norm <= Qmax (perm order), memmap on disk
    gp = C.gp; npr = len(gp); kpos = {k: i for i, (k, _) in enumerate(gp)}
    cpath = os.path.join(outd, f'Ecache_{Qmax}.dat'); dpath = os.path.join(outd, f'Ecache_{Qmax}.done.npy')
    Ec = np.memmap(cpath, dtype=np.int8, mode='r+' if os.path.exists(cpath) else 'w+', shape=(npr, n))
    done = np.load(dpath) if os.path.exists(dpath) else np.zeros(npr, bool)
    for i, (k, pi) in enumerate(gp):
        if done[i]: continue
        Ec[i] = T.node_exponents(pi)[perm]; done[i] = True
        if i % 50 == 49 or i == npr - 1:
            Ec.flush(); np.save(dpath, done)
        if time.time() - t0 > budget:
            Ec.flush(); np.save(dpath, done); print(f"cache {int(done.sum())}/{npr}; budget reached", flush=True); return
    Ec.flush(); np.save(dpath, done)
    e_zeta = T.node_exponents(Z.UNITS[1])[perm].astype(np.int16); e_lam = T.node_exponents(Z.LAM)[perm].astype(np.int16)
    e_two = T.node_exponents((-2, 0))[perm].astype(np.int16)
    print(f"cache ready ({npr} primes), {time.time()-t0:.0f}s", flush=True)
    # ---- toy rows
    alpha = ((nap - nbp / 2.0) + 1j * (nbp * math.sqrt(3) / 2.0)) / np.sqrt(Nf)
    Gc = T.G()[perm]
    psis = {'aG': alpha * Gc, 'a': alpha, '1': np.ones(n, complex)}
    Rs = (10 ** 4, 10 ** 5, 10 ** 6)
    keys = [(name, R) for R in Rs for name in psis]
    CF = []                                             # per R: (idx, [3, len] coefficient matrix)
    for R in Rs:
        lx = np.log(Nf / R); idx = np.flatnonzero(np.abs(lx) <= 2.2)
        w = np.exp(-2 * lx[idx] ** 2) / np.sqrt(Nf[idx])
        CF.append((idx, np.stack([g2p[idx] * psis[name][idx] * w for name in psis])))
    # n^3 part: concatenated sparse terms
    ordN = np.argsort(Np, kind='stable'); Nsrt = Np[ordN]
    t_idx = []; t_nd = []; t_key = []; t_cf = []
    for R in Rs:
        nmax = (R * math.exp(2.2)) ** (1 / 3.0)
        for nd in np.flatnonzero((Np > 1) & (Np <= nmax)):
            Reff = R / Nf[nd] ** 3
            lo = np.searchsorted(Nsrt, Reff * math.exp(-2.2), 'left'); hi = np.searchsorted(Nsrt, Reff * math.exp(2.2), 'right')
            idx = ordN[lo:hi]
            if len(idx) == 0: continue
            lx = np.log(Nf[idx] / Reff); w = np.exp(-2 * lx ** 2) / np.sqrt(Nf[idx])
            for name in psis:
                psn = alpha[nd] ** 3 if name in ('aG', 'a') else 1.0
                t_idx.append(idx); t_nd.append(np.full(len(idx), nd)); t_key.append(np.full(len(idx), keys.index((name, R))))
                t_cf.append(g2p[idx] * psis[name][idx] * w * psn / Nf[nd])
    t_idx = np.concatenate(t_idx); t_nd = np.concatenate(t_nd); t_key = np.concatenate(t_key); t_cf = np.concatenate(t_cf)
    small = np.flatnonzero(Np <= CM)
    np.savez(os.path.join(outd, 'conductors.npz'), cN=Np[small], cna=nap[small], cnb=nbp[small], cg2=g2p[small],
             keys=np.array([f"{k[0]}|{k[1]}" for k in keys]))
    # ---- rows
    Rr = int(math.isqrt(4 * Qmax // 3)) + 2
    ms = sorted([(a, b) for a in range(-Rr, Rr + 1) for b in range(-Rr, Rr + 1) if (a, b) != (0, 0) and Z.norm((a, b)) <= Qmax],
                key=lambda t: (Z.norm(t), t))
    ntot = len(ms)
    print(f"rows {ntot}; n-terms {len(t_idx)}; setup {time.time()-t0:.0f}s", flush=True)
    for b0 in range(0, ntot, BLK):
        fn = os.path.join(outd, f'blk_{b0:06d}.npz')
        if os.path.exists(fn): continue
        if time.time() - t0 > budget:
            print(f"budget reached before block {b0}", flush=True); return
        blk = ms[b0:b0 + BLK]; nb_ = len(blk)
        rs = np.zeros((nb_, 12), complex); rc = np.zeros((nb_, 12), complex); se = np.zeros((nb_, 12))
        Bv = np.zeros((nb_, 9), complex); Bn = np.zeros((nb_, 9), complex); E = np.zeros((nb_, len(small)), np.int8)
        Nm = np.zeros(nb_, np.int64); fl = np.zeros((nb_, 6), np.int16); sqf = np.zeros(nb_, bool); sq = np.zeros(nb_, bool); six = np.zeros(nb_, bool)
        for i, m in enumerate(blk):
            a, b, u, fac = C.factor(m)
            em = (u * e_zeta + a * e_lam + b * e_two)
            bad = np.zeros(n, bool)
            for (k, j) in fac:
                ep = Ec[kpos[k]]; bad |= ep < 0; em = em + j * ep.astype(np.int16)
            em = np.where(bad, -1, em % 6)
            ph = LUT[em]                                   # chi_n(m), 0 if not coprime
            good = ~bad
            dn = binsum(good.astype(np.int64))
            v = np.conj(ph) * g1e0
            c0, sd = fit(binsum(v), dn); rs[i] = c0; se[i] = sd
            y = Z.mul(C.ne0, m); nterms = 0
            smallp = [(k, j) for (k, j) in fac if T.pq[k] <= PC and (j + 1) % 6 != 0]
            for r in range(1, len(smallp) + 1):
                for sub in itertools.combinations(smallp, r):
                    g, c1, facs = C.gt_c1(y, list(sub))
                    e1 = np.zeros(n, np.int16)
                    for (k, kk) in facs: e1 += kk * Ec[kpos[k]]
                    vY = v * np.conj(LUT[(4 * e1) % 6])    # e1 >= 0 on good nodes; v = 0 elsewhere
                    cY, _ = fit(binsum(vY), dn)
                    w = g * float(Z.norm(c1)) ** (-2.0 / 3.0); ic1 = Z.mod4_index(c1)
                    for sp in range(12):
                        rc[i, C.m4mul[sp, ic1]] += w * Z.Rrec(C.reps[sp], c1) * cY[sp]
                    nterms += 1
            for ri, (idx, cf) in enumerate(CF):
                Bv[i, 3 * ri:3 * ri + 3] = cf @ ph[idx]
            en = em[t_nd]; ok = en >= 0
            val = t_cf * ph[t_idx] * np.where(ok, Z6[(3 * np.maximum(en, 0)) % 6], 0)
            Bn[i] = np.bincount(t_key, weights=val.real, minlength=9) + 1j * np.bincount(t_key, weights=val.imag, minlength=9)
            E[i] = em[small]
            ex = [j for _, j in fac]
            Nm[i] = Z.norm(m); fl[i] = (a, b, u, len(fac), max(ex, default=0), nterms)
            sqf[i] = all(e == 1 for e in ex); sq[i] = all(e % 2 == 0 for e in ex); six[i] = all(e % 6 == 0 for e in ex)
        np.savez(fn + '.tmp.npz', ms=np.array(blk), Nm=Nm, rho_str=rs, rho_cor=rc, se=se, B=Bv, Bn=Bn, E=E, flags=fl, sqf=sqf, sq=sq, six=six)
        os.replace(fn + '.tmp.npz', fn)
        print(f"  block {b0} done (N <= {Nm[-1]}), {time.time()-t0:.0f}s", flush=True)
    print("ALLDONE", flush=True)
main()
