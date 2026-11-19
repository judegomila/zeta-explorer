"""istrat_acc.py -- per-row twisted conductor sums and theta estimators for the inter-stratum test (lane c9).

Table: squarefree primary nodes n prime to 6, N(n) <= X (build_table.py), with gamma_1, gamma_2, gamma_3.
Roles (disjoint, so no self term): conductors c = nodes with N <= Xc = X/4; estimator moduli n = nodes with Xc < N <= X.
Rows: m primary, prime to 6, N(m) <= Qmax = Xc^(1/1.4).
Per row m (one pass over the nodes, e_m(n) = exponent of chi_n(m)):
  A_a[m, g]  = sum_{c in g} alpha(c) gamma_2(c) chi_c(m)                 (manuscript shorthand row, type a)
  A_p[m, g]  = sum_{c in g} conj(gamma_1(c)) chi_c(y0) chi_c(m)          (polar-aligned row, positive control)
  r6[m, h, s] = sum_{n in half h, class s} conj(chi_n(y0 m)) gamma_1(n)  (sextic theta estimator, unnormalised)
  r3[m, h, s] = sum_{n in half h, class s} chi_n(y0 m)^-2 chi_n(lambda)^-2 gamma_2(n)   (cubic theta rows, control)
g = (octave bin i of N(c): Xc/2^(i+1) < N <= Xc/2^i, class of c mod 4 (12), class of c mod 9 (9)); y0 = -e0 = 2 lambda^5.
Usage: python istrat_acc.py table.npz out.npz NB [workers]
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

def init(path, NB):
    T = A.SFTable(path)
    G['T'] = T
    sp = ~T.pinert
    G['sp'] = sp; G['p_sp'] = T.pp[sp].astype(np.int64); G['w_sp'] = T.pw[sp].astype(np.int64)
    G['inert'] = [(int(i), Z.PrimeO((int(T.pa[i]), int(T.pb[i])), int(T.pp[i]), True)) for i in np.flatnonzero(T.pinert)]
    X = T.X; Xc = X / 4.0
    N = T.N.astype(np.float64)
    isc = (N <= Xc) & (N > 1)
    ib = np.floor(np.log2(Xc / np.maximum(N, 1))).astype(np.int64)
    isc &= ib < NB
    ise = N > Xc
    half = (N > 0.625 * X).astype(np.int64)
    GC = NB * 108
    grp = np.where(isc, (ib * 12 + T.m4.astype(np.int64)) * 9 + T.m9.astype(np.int64), GC + half * 12 + T.m4.astype(np.int64))
    NG = GC + 24
    use = isc | ise
    y0 = Z.mul((2, 0), Z.power(Z.LAM, 5))
    e0 = node_exp(T, y0); eL = node_exp(T, Z.LAM)
    assert (e0[use] >= 0).all() and (eL[use] >= 0).all()
    cz = np.array([Z.to_c((int(a), int(b))) for a, b in zip(T.na.tolist(), T.nb.tolist())])
    alpha = cz / np.abs(cz)
    # pass 1: conductors alpha gamma_2 (multiplier +1 on e), estimators gamma_1 conj chi_n(y0) (multiplier -1)
    W1 = np.where(isc, alpha * T.g2, np.where(ise, T.g1 * np.conj(Z6[e0 % 6]), 0))
    M1 = np.where(isc, 1, -1).astype(np.int16)
    # pass 2: conductors conj(gamma_1) chi_c(y0) (+1), estimators cubic: gamma_2 zeta^(-2 eL) zeta^(-2 e0) (multiplier -2)
    W2 = np.where(isc, np.conj(T.g1) * Z6[e0 % 6], np.where(ise, T.g2 * Z6[(-2 * eL.astype(np.int64)) % 6] * Z6[(-2 * e0.astype(np.int64)) % 6], 0))
    M2 = np.where(isc, 1, -2).astype(np.int16)
    idx = np.flatnonzero(use)
    G.update(dict(idx=idx, grp6=(grp[idx] * 6).astype(np.int64), NG=NG, GC=GC,
                  W1r=W1[idx].real.copy(), W1i=W1[idx].imag.copy(), W2r=W2[idx].real.copy(), W2i=W2[idx].imag.copy(),
                  M1=M1[idx], M2=M2[idx], NB=NB))
    G['counts'] = np.bincount(grp[idx], minlength=NG)

def one_row(m):
    T = G['T']
    e = node_exp(T, m)[G['idx']].astype(np.int16)
    bad = e < 0
    NG = G['NG']; L = NG * 6 + 1
    out = []
    for Wr, Wi, M in ((G['W1r'], G['W1i'], G['M1']), (G['W2r'], G['W2i'], G['M2'])):
        key = np.where(bad, NG * 6, G['grp6'] + (M * e) % 6)
        re = np.bincount(key, weights=Wr, minlength=L)[:-1].reshape(NG, 6)
        im = np.bincount(key, weights=Wi, minlength=L)[:-1].reshape(NG, 6)
        out.append(((re + 1j * im) * Z6[None, :]).sum(1))
    return out

def work(chunk):
    res = [one_row(m) for m in chunk]
    GC = G['GC']
    Aa = np.array([r[0][:GC] for r in res], dtype=np.complex64); r6 = np.array([r[0][GC:] for r in res])
    Ap = np.array([r[1][:GC] for r in res], dtype=np.complex64); r3 = np.array([r[1][GC:] for r in res])
    return Aa, r6, Ap, r3

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
    path, outp, NB = sys.argv[1], sys.argv[2], int(sys.argv[3])
    nw = int(sys.argv[4]) if len(sys.argv) > 4 else int(os.environ.get('RH_WORKERS', '1'))
    t0 = time.time()
    d = np.load(path); X = int(d['X']); n = len(d['N']); del d
    Xc = X / 4.0; Qmax = Xc ** (1 / 1.4)
    rows = rows_upto(Qmax)
    nr = len(rows); GC = NB * 108
    tab_mb = n * (3 * 16 + 4 * 8 + 3 * 4 + 16 + 8 * 6) / 1e6
    work_mb = n * (8 * 4 + 2 * 3 + 8 * 4 + 8 * 6) / 1e6
    res_mb = nr * (2 * GC * 8 + 2 * 24 * 16) / 1e6
    print(f"X = {X}, nodes = {n}, Xc = {Xc:.0f}, Qmax = {Qmax:.1f}, rows = {nr}, NB = {NB}, groups = {GC}+24, workers = {nw}", flush=True)
    print(f"planned memory: per worker table {tab_mb:.0f} MB + working arrays {work_mb:.0f} MB; x{nw} workers = {nw * (tab_mb + work_mb) / 1e3:.2f} GB;"
          f" results {res_mb:.0f} MB (held twice at save: {2 * res_mb / 1e3:.2f} GB)", flush=True)
    ms = [(a, b) for _, a, b in rows]
    cs = max(1, min(64, nr // (nw * 8) + 1))
    chunks = [ms[i:i + cs] for i in range(0, nr, cs)]
    ctx = get_context('fork')
    parts = []
    with ctx.Pool(nw, initializer=init, initargs=(path, NB)) as pool:
        for k, r in enumerate(pool.imap(work, chunks)):
            parts.append(r)
            if k % max(1, len(chunks) // 20) == 0:
                print(f"chunk {k}/{len(chunks)} {time.time() - t0:.0f}s", flush=True)
    Aa = np.concatenate([p[0] for p in parts]); r6 = np.concatenate([p[1] for p in parts])
    Ap = np.concatenate([p[2] for p in parts]); r3 = np.concatenate([p[3] for p in parts])
    init(path, NB)
    np.savez(outp, X=X, NB=NB, Qmax=Qmax, rows=np.array(rows, dtype=np.int64), Aa=Aa, Ap=Ap, r6=r6, r3=r3, counts=G['counts'])
    print(f"saved {outp} {time.time() - t0:.0f}s", flush=True)

if __name__ == '__main__':
    main()
