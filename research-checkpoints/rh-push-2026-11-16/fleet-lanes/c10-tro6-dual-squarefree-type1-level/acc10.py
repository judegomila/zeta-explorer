"""acc10.py -- accumulations for lane c10 (dual form on squarefree n; Type I by level).

Table: squarefree primary nodes prime to 6, N <= X (build_table.py). Estimator moduli k: nodes with X/4 < N <= X,
half h = [N > 0.625 X], class sigma = k mod 4.
mode a:  rows = all nodes n with N(n) <= M.  Output
   r6[n, u, h*12+sigma] = sum_k gamma_1(k) conj chi_k(u n),  u in (lambda, y0 = 2 lambda^5, 1)
   r3[n, h*12+sigma]    = sum_k gamma_2(k) chi_k(y0 n)^-2 chi_k(lambda)^-2          (cubic theta rows, control)
mode b:  rows = primary m prime to 6 with N(m) <= Qmax = (X/4)^(1/1.4).  Conductors c: nodes with N <= X/4 in octave
   bin i (Xc/2^(i+1) < N <= Xc/2^i), i < NB.  Levels a: a = 1 and squarefree nodes with 1 < N(a) <= Q_i^0.6.  Output per bin i
   A_i[m, a, c mod 4] = sum_{c in bin i, a | c} mu(c) alpha(c) gamma_2(c) chi_c(m)    (rows with N(m) <= Q_i only)
   r6[m, h*12+sigma] (u = y0), r3[m, h*12+sigma].
Usage: python acc10.py a table.npz out.npz M [workers]     |     python acc10.py b table.npz out.npz NB [workers]
"""
import sys, os, math, time
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import alib as A, zomega as Z
from multiprocessing import get_context
Z6 = Z.ZETA6
G = {}

def chi_primes_fast(T, y, inert_objs):
    ya, yb = int(y[0]), int(y[1])
    k = np.full(T.np_, -1, dtype=np.int8)
    sp = G['sp']; p = G['p_sp']; w = G['w_sp']
    r = (ya % p + (yb % p) * w) % p
    nz = r != 0
    val = Z._vpow(r[nz], (p[nz] - 1) // 6, p[nz]).astype(np.int64)
    z = (1 + w[nz]) % p[nz]
    cur = np.ones_like(z); kk = np.full(len(z), -1, dtype=np.int8)
    for t in range(6):
        kk[val == cur] = t
        cur = (cur * z) % p[nz]
    assert (kk >= 0).all()
    tmp = np.full(len(p), -1, dtype=np.int8); tmp[nz] = kk; k[sp] = tmp
    for idx, P in inert_objs:
        c = P.chi((ya, yb)); k[idx] = -1 if c is None else c
    return k

def node_exp(T, y):
    kp = chi_primes_fast(T, y, G['inert'])
    e = np.zeros(T.n, dtype=np.int8)
    for lev in T.levels:
        pe = e[T.parent[lev]]; ke = kp[T.last[lev]]
        bad = (pe < 0) | (ke < 0)
        e[lev] = np.where(bad, -1, (pe.astype(np.int16) + ke) % 6).astype(np.int8)
    return e

def base_init(path):
    T = A.SFTable(path)
    G['T'] = T
    sp = ~T.pinert
    G['sp'] = sp; G['p_sp'] = T.pp[sp].astype(np.int64); G['w_sp'] = T.pw[sp].astype(np.int64)
    G['inert'] = [(int(i), Z.PrimeO((int(T.pa[i]), int(T.pb[i])), int(T.pp[i]), True)) for i in np.flatnonzero(T.pinert)]
    X = T.X; N = T.N.astype(np.float64)
    ise = N > X / 4.0
    half = (N > 0.625 * X).astype(np.int64)
    y0 = Z.mul((2, 0), Z.power(Z.LAM, 5))
    e0 = node_exp(T, y0).astype(np.int64); eL = node_exp(T, Z.LAM).astype(np.int64)
    idxE = np.flatnonzero(ise)
    assert (e0[idxE] >= 0).all() and (eL[idxE] >= 0).all()
    G['idxE'] = idxE
    G['grpE6'] = ((half[idxE] * 12 + T.m4[idxE].astype(np.int64)) * 6)
    g1 = T.g1[idxE]; g2 = T.g2[idxE]
    G['e0E'] = e0[idxE]; G['eLE'] = eL[idxE]
    WU = [g1 * np.conj(Z6[eL[idxE] % 6]), g1 * np.conj(Z6[e0[idxE] % 6]), g1]
    G['WU'] = [(w.real.copy(), w.imag.copy()) for w in WU]
    w3 = g2 * Z6[(-2 * eL[idxE]) % 6] * Z6[(-2 * e0[idxE]) % 6]
    G['W3'] = (w3.real.copy(), w3.imag.copy())
    return T, e0, eL

def est_row(eE, shifts):
    """estimator sums for one index; eE = exponents of chi_k(index) on the estimator moduli."""
    bad = eE < 0
    L = 24 * 6 + 1
    key1 = np.where(bad, 24 * 6, G['grpE6'] + (-eE) % 6)
    out = []
    for u in shifts:
        wr, wi = G['WU'][u]
        v = (np.bincount(key1, weights=wr, minlength=L)[:-1] + 1j * np.bincount(key1, weights=wi, minlength=L)[:-1]).reshape(24, 6)
        out.append((v * Z6[None, :]).sum(1))
    key3 = np.where(bad, 24 * 6, G['grpE6'] + (-2 * eE) % 6)
    wr, wi = G['W3']
    v = (np.bincount(key3, weights=wr, minlength=L)[:-1] + 1j * np.bincount(key3, weights=wi, minlength=L)[:-1]).reshape(24, 6)
    return np.array(out), (v * Z6[None, :]).sum(1)

# ------------------------------------------------------------------ mode a
def init_a(path):
    base_init(path)

def work_a(chunk):
    T = G['T']; r6 = []; r3 = []
    for m in chunk:
        e = node_exp(T, m)[G['idxE']].astype(np.int64)
        a, b = est_row(e, (0, 1, 2)); r6.append(a); r3.append(b)
    return np.array(r6), np.array(r3)

# ------------------------------------------------------------------ mode b
def levels_setup(T, NB):
    X = T.X; Xc = X / 4.0; N = T.N.astype(np.float64)
    Qi = np.array([(Xc / 2 ** i) ** (1 / 1.4) for i in range(NB)])
    Amax = Qi[0] ** 0.6
    lev = np.flatnonzero((N > 1) & (N <= Amax)); lev = lev[np.argsort(T.N[lev], kind='stable')]
    lev = np.concatenate([[0], lev])                      # a = 1 first
    small = np.flatnonzero(T.pq <= Amax)
    rank = np.full(T.np_, -1, dtype=np.int64); rank[small] = np.arange(len(small))
    assert len(small) <= 126
    mlo = np.zeros(T.n, dtype=np.uint64); mhi = np.zeros(T.n, dtype=np.uint64)
    for lv in T.levels:
        r = rank[T.last[lv]]
        blo = np.where((r >= 0) & (r < 63), np.left_shift(np.uint64(1), np.clip(r, 0, 62).astype(np.uint64)), np.uint64(0))
        bhi = np.where(r >= 63, np.left_shift(np.uint64(1), np.clip(r - 63, 0, 62).astype(np.uint64)), np.uint64(0))
        mlo[lv] = mlo[T.parent[lv]] | blo; mhi[lv] = mhi[T.parent[lv]] | bhi
    return Qi, lev, mlo, mhi

def init_b(path, NB):
    T, e0, eL = base_init(path)
    X = T.X; Xc = X / 4.0; N = T.N.astype(np.float64)
    isc = (N <= Xc) & (N > 1)
    ib = np.floor(np.log2(Xc / np.maximum(N, 1))).astype(np.int64)
    isc &= ib < NB
    Qi, lev, mlo, mhi = levels_setup(T, NB)
    nl = len(lev)
    nlev_i = np.array([int((T.N[lev] <= Qi[i] ** 0.6).sum()) for i in range(NB)])   # levels used in bin i (prefix of lev)
    cidx = np.flatnonzero(isc)
    pc = []; pl = []
    for li, a in enumerate(lev):
        ok = ((mlo[cidx] & mlo[a]) == mlo[a]) & ((mhi[cidx] & mhi[a]) == mhi[a]) & (li < nlev_i[ib[cidx]])
        cc = cidx[ok]; pc.append(cc); pl.append(np.full(len(cc), li, dtype=np.int64))
    pc = np.concatenate(pc); pl = np.concatenate(pl)
    cz = T.na[pc] + T.nb[pc] * Z.to_c((0, 1)); alpha = cz / np.abs(cz)
    w = T.mu[pc] * alpha * T.g2[pc]
    G.update(dict(pc=pc, key6=((pl * NB + ib[pc]) * 12 + T.m4[pc].astype(np.int64)) * 6, wr=w.real.copy(), wi=w.imag.copy(),
                  NB=NB, nl=nl, nlev_i=nlev_i, Qi=Qi, lev=lev, npairs=len(pc)))

def work_b(chunk):
    T = G['T']; NB = G['NB']; nl = G['nl']; ng = nl * NB * 12
    res = []
    for (nm, a, b) in chunk:
        e_all = node_exp(T, (a, b))
        ec = e_all[G['pc']].astype(np.int64)
        bad = ec < 0
        key = np.where(bad, ng * 6, G['key6'] + ec % 6)
        v = (np.bincount(key, weights=G['wr'], minlength=ng * 6 + 1)[:-1] + 1j * np.bincount(key, weights=G['wi'], minlength=ng * 6 + 1)[:-1]).reshape(ng, 6)
        v = (v * Z6[None, :]).sum(1).reshape(nl, NB, 12)
        per = [v[:G['nlev_i'][i], i, :].astype(np.complex64) if nm <= G['Qi'][i] else None for i in range(NB)]
        r6, r3 = est_row(e_all[G['idxE']].astype(np.int64), (1,))
        res.append((per, r6[0], r3))
    return res

def rows_upto(Q):
    rows = []
    R = int(math.isqrt(int(4 * Q / 3))) + 3
    for b in range(-(R // 3 + 1) * 3, R + 1, 3):
        for a in range(-2 * R - 2, 2 * R + 3):
            if a % 3 != 1: continue
            n = a * a - a * b + b * b
            if n <= Q and n % 2 == 1:
                rows.append((n, a, b))
    rows.sort()
    return rows

def main():
    mode, path, outp = sys.argv[1:4]
    nw = int(sys.argv[5]) if len(sys.argv) > 5 else int(os.environ.get('RH_WORKERS', '1'))
    t0 = time.time()
    d = np.load(path); X = int(d['X']); n = len(d['N']); Nn = d['N']
    tab_mb = n * (3 * 16 + 4 * 8 + 3 * 4 + 16 + 8 * 6) / 1e6
    ctx = get_context('fork')
    if mode == 'a':
        M = float(sys.argv[4])
        assert M < X / 4
        idx = np.flatnonzero(Nn <= M); idx = idx[np.argsort(Nn[idx], kind='stable')]
        na = d['na'][idx]; nb = d['nb'][idx]
        nr = len(idx)
        print(f"mode a: X = {X}, nodes = {n}, M = {M:.0f}, rows = {nr}, workers = {nw}", flush=True)
        print(f"planned memory: per worker table {tab_mb:.0f} MB + working arrays {n * 60 / 1e6:.0f} MB; x{nw} = {nw * (tab_mb + n * 60 / 1e6) / 1e3:.2f} GB; results {nr * 96 * 16 / 1e6:.0f} MB", flush=True)
        ms = list(zip(na.tolist(), nb.tolist()))
        cs = max(1, min(64, nr // (nw * 8) + 1)); chunks = [ms[i:i + cs] for i in range(0, nr, cs)]
        p6 = []; p3 = []
        with ctx.Pool(nw, initializer=init_a, initargs=(path,)) as pool:
            for k, (a, b) in enumerate(pool.imap(work_a, chunks)):
                p6.append(a); p3.append(b)
                if k % max(1, len(chunks) // 20) == 0: print(f"chunk {k}/{len(chunks)} {time.time() - t0:.0f}s", flush=True)
        np.savez(outp, X=X, M=M, idx=idx, r6=np.concatenate(p6), r3=np.concatenate(p3))
    else:
        NB = int(sys.argv[4])
        Xc = X / 4.0; Qmax = Xc ** (1 / 1.4)
        rows = rows_upto(Qmax); nr = len(rows)
        del d
        init_b(path, NB)
        nl = G['nl']; nlev_i = G['nlev_i']; Qi = G['Qi']
        rowsN = np.array([r[0] for r in rows])
        res_mb = sum(int((rowsN <= Qi[i]).sum()) * int(nlev_i[i]) * 12 * 8 for i in range(NB)) / 1e6
        print(f"mode b: X = {X}, nodes = {n}, Qmax = {Qmax:.1f}, rows = {nr}, NB = {NB}, levels = {nl} (per bin {nlev_i.tolist()}), pairs (c, a) = {G['npairs']}, workers = {nw}", flush=True)
        print(f"planned memory: per worker table {tab_mb:.0f} MB + working arrays {(n * 60 + G['npairs'] * 60) / 1e6:.0f} MB; x{nw + 1} processes = {(nw + 1) * (tab_mb + (n * 60 + G['npairs'] * 60) / 1e6) / 1e3:.2f} GB; results {res_mb:.0f} MB (held twice at save: {2 * res_mb / 1e3:.2f} GB)", flush=True)
        cs = max(1, min(32, nr // (nw * 8) + 1)); chunks = [rows[i:i + cs] for i in range(0, nr, cs)]
        per = [[] for _ in range(NB)]; r6 = []; r3 = []
        with ctx.Pool(nw, initializer=init_b, initargs=(path, NB)) as pool:
            for k, res in enumerate(pool.imap(work_b, chunks)):
                for p, a, b in res:
                    for i in range(NB):
                        if p[i] is not None: per[i].append(p[i])
                    r6.append(a); r3.append(b)
                if k % max(1, len(chunks) // 20) == 0: print(f"chunk {k}/{len(chunks)} {time.time() - t0:.0f}s", flush=True)
        out = {f'A{i}': np.array(per[i]) for i in range(NB)}
        T = G['T']; lev = G['lev']
        np.savez(outp, X=X, NB=NB, Qmax=Qmax, rows=np.array(rows, dtype=np.int64), r6=np.array(r6), r3=np.array(r3),
                 lev=lev, levN=T.N[lev], levmu=T.mu[lev], nlev_i=nlev_i, Qi=Qi, **out)
    print(f"saved {outp} {time.time() - t0:.0f}s", flush=True)

if __name__ == '__main__':
    main()
