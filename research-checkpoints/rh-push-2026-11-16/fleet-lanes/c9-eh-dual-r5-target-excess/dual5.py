"""c9-eh-dual-r5-target-excess: exact dual decomposition (same formula as ../c8-eh-nonprincipal-row-cancellation/dual.py,
imported unchanged as dual_c8) with (i) seeded control weights, (ii) all weights processed together, (iii) frequencies
split over RH_WORKERS processes, (iv) every row value c_u stored (exact, in Z[zeta_6]).

usage: dual5.py q k Np d out.json [N,lam ...]      (default geometries: all (N, lam) with N + lam = Np, N >= 2)
"""
import sys, os, json, math, time, itertools
import numpy as np
from collections import defaultdict
from multiprocessing import Pool
from dual_c8 import FF, Pairs, base_weight, hash64, red, n2

NS = int(os.environ.get('NSEED', 8))
NAMES = ['a', 'b', 'lnu', 'mu', 't', 'dh', 'thin', 'rm', 'rma', 'n1', 'n2'] + [f'rm:{s}' for s in range(1, NS + 1)] + \
        [f'rma:{s}' for s in range(1, NS + 1)] + [f'n:{s}' for s in range(1, NS + 1)] + [f'g:{s}' for s in range(1, 5)]

def mult_signs(ff, n, seed):
    """completely multiplicative +-1 with hash-random signs on primes (seeded)."""
    key = '_ms_%d' % seed
    cache = getattr(ff, key, None)
    if cache is None:
        cache = [np.ones(1, dtype=np.int64)]; setattr(ff, key, cache)
    sgn = np.array([-1 if (hash64(p * 7919 + 77 + 100003 * seed) >> 20) & 1 else 1 for p in range(len(ff.primes))], dtype=np.int64)
    degs = np.array([ff.primes[x][0] for x in range(len(ff.primes))])
    while len(cache) <= n:
        m = len(cache); arr = np.ones(ff.PW[m], dtype=np.int64); p = ff.lpfp[m]; c = ff.lpfc[m]
        for e in range(1, m + 1):
            sel = np.nonzero(degs[p] == e)[0]
            arr[sel] = sgn[p[sel]] * cache[m - e][c[sel]]
        cache.append(arr)
    return cache[n]

def bw(ff, name, n):
    if ':' not in name: return base_weight(ff, name, n)
    kind, s = name.split(':'); s = int(s)
    if kind == 'n':   # random +-1, not multiplicative
        return np.array([-1 if (hash64(i * 1000003 + 5000 + s) >> 20) & 1 else 1 for i in range(ff.PW[n])], dtype=np.int64)
    if kind == 'g':   # random integers in {-3..3}, not multiplicative, not unimodular
        return np.array([(hash64(i * 1000003 + 9000 + s) >> 20) % 7 - 3 for i in range(ff.PW[n])], dtype=np.int64)
    if kind == 'rm': return mult_signs(ff, n, s)
    if kind == 'rma': return mult_signs(ff, n, s) * base_weight(ff, 'a', n)
    raise ValueError(name)

def row_weight(ff, name, N, lam):
    w = bw(ff, name, N) * (ff.mu[N] != 0)
    if lam == 0: return w
    W = np.zeros(ff.PW[N + lam], dtype=np.int64)
    for pid in ff.nprimes_by_deg[lam]:
        np.add.at(W, ff.mul(ff.primes[pid][2], N), w)
    return W * (ff.mu[N + lam] != 0)

def block(ff, pairs, k, Np, d, WM, wid=0, nw=1):
    """WM: int64 array (nW, q^Np). Returns rows: label -> (nW, 6) object array; diag (nW python ints); nfreq (this worker)."""
    q = ff.q; r = k + Np - 1 - d; even = (k - Np) % 6 == 0; nW = WM.shape[0]
    rows = {}; diag = [0] * nW; nfreq = 0; cnt = 0
    for gam in range(0, min(k, Np) + 1):
        k1, N1 = k - gam, Np - gam
        sgam = (ff.sq ** ((gam * (gam - 1) // 2 + N1 * (N1 - 1) // 2) % 2)) * (ff.s0 ** ((N1 * (k1 + 1) + gam * k1) % 2))
        for g in np.nonzero(ff.mu[gam])[0]:
            g = int(g); gf = ff.factor(gam, g); gco = ff.coeffs(gam, g); mug = int(ff.mu[gam][g]); gps = list(gf.keys())
            subs = list(itertools.chain.from_iterable(itertools.combinations(gps, t) for t in range(len(gps) + 1)))
            if k1 == 0 and N1 == 0:
                if wid == 0:
                    tot = 0
                    for sub in subs:
                        de = sum(ff.primes[p][0] for p in sub)
                        if de <= d: tot += (-1) ** len(sub) * q ** (gam - de)
                    for i in range(nW): diag[i] += sgam * mug * int(WM[i, g]) * tot
                continue
            gA = ff.mul(gco, N1); Wg = WM[:, gA]
            WB = None
            for sub in subs:
                de = sum(ff.primes[p][0] for p in sub)
                if de > d: continue
                rp = r - 2 * gam + de
                if rp < 0: continue
                coef0 = sgam * mug * (-1) ** len(sub) * q ** (gam - de)
                gefac = {p: 2 + (5 if p in sub else 0) for p in gps}
                for j in (range(0, rp + 1) if even else (rp,)):
                    wt = (-1 if j == rp else q - 1) if even else 1
                    for z in range(ff.PW[j]):
                        cnt += 1
                        if cnt % nw != wid: continue
                        if WB is None:
                            WB = []
                            for jj in range(0, min(k1, N1) + 1):
                                hs, As, sg = pairs.get(N1, jj)
                                WB.append((Wg[:, As] * (sg * ff.mu[N1][As])[None, :]).astype(np.float64))
                        zf = ff.factor(j, z); fac = dict(gefac)
                        for p, v in zf.items(): fac[p] = fac.get(p, 0) + v
                        label = tuple(sorted((p, v % 6) for p, v in fac.items() if v % 6))
                        nfreq += 1
                        phn = {}; a = []
                        for n in range(0, k1 + 1):
                            phn[n] = ff.phase(n, fac); a.append(np.bincount(phn[n], minlength=7)[:6])
                        phA = phn[N1] if N1 in phn else ff.phase(N1, fac)
                        res = np.zeros((nW, 6), dtype=np.int64)
                        for jj in range(0, min(k1, N1) + 1):
                            hs, As, sg = pairs.get(N1, jj)
                            pa = phA[As]; ok = np.nonzero(pa < 6)[0]
                            if not len(ok): continue
                            ph = (phn[jj][hs[ok]] - pa[ok]) % 6
                            wb = WB[jj][:, ok]
                            H = np.empty((nW, 6), dtype=np.int64)
                            for i in range(nW): H[i] = np.rint(np.bincount(ph, weights=wb[i], minlength=6)).astype(np.int64)
                            aa = a[k1 - jj]
                            for s_ in range(6):
                                for t in range(6):
                                    if aa[t]: res[:, (s_ + t) % 6] += H[:, s_] * int(aa[t])
                        if res.any():
                            if label not in rows: rows[label] = np.zeros((nW, 6), dtype=object)
                            rows[label] += (coef0 * wt) * res.astype(object)
    return rows, diag, nfreq

_G = {}
def _work(wid):
    ff, pairs, k, Np, d, WM, nw = _G['args']
    rows, diag, nfreq = block(ff, pairs, k, Np, d, WM, wid, nw)
    return {lab: [[int(x) for x in red(v[i])] for i in range(v.shape[0])] for lab, v in rows.items()}, diag, nfreq

def run_block(ff, pairs, k, N, lam, d, names, nw):
    Np = N + lam
    WM = np.stack([row_weight(ff, nm, N, lam) for nm in names])
    _G['args'] = (ff, pairs, k, Np, d, WM, nw)
    if nw == 1: outs = [_work(0)]
    else:
        with Pool(nw) as pool: outs = pool.map(_work, range(nw))
    rows = {}; diag = [0] * len(names); nfreq = 0
    for r_, dg, nf in outs:
        nfreq += nf
        for i in range(len(names)): diag[i] += dg[i]
        for lab, v in r_.items():
            if lab not in rows: rows[lab] = [[0, 0] for _ in names]
            t = rows[lab]
            for i in range(len(names)): t[i][0] += v[i][0]; t[i][1] += v[i][1]
    return rows, diag, nfreq

def stats_from(q, rows, diag_i, i, k, Np, d):
    even = (k - Np) % 6 == 0
    princ = tuple(rows.get((), [[0, 0]] * (i + 1))[i]); np_ = [0, 0]; T1 = 0.0; S2 = 0; U = 0; mx = 0.0
    for lab, v in rows.items():
        if lab == (): continue
        xy = tuple(v[i])
        if xy == (0, 0): continue
        U += 1; np_[0] += xy[0]; np_[1] += xy[1]; a2 = n2(xy); S2 += a2; T1 += math.sqrt(a2); mx = max(mx, math.sqrt(a2))
    tot = (princ[0] + np_[0] + diag_i, princ[1] + np_[1])
    J2 = q ** (2 * d) * (1 if even else q) * n2(tot)
    return dict(even=even, U=U, NP2=n2(tuple(np_)), T1=T1, S2=S2, max=mx, princ2=n2(princ), diag=diag_i, tot2=n2(tot), J2=str(J2))

if __name__ == '__main__':
    q, k, Np, d = [int(x) for x in sys.argv[1:5]]; outfn = sys.argv[5]
    geos = [tuple(int(t) for t in s.split(',')) for s in sys.argv[6:]] or [(N, Np - N) for N in range(Np, 1, -1)]
    nw = int(os.environ.get('RH_WORKERS', 1)); D = max(k, Np); r = k + Np - 1 - d
    names = [nm for nm in NAMES if not (q != 7 and nm in ('b', 'dh'))]
    npr = sum((q ** e) // e for e in range(1, max(r, 1) + 1))
    print(f"# q={q} k={k} Np={Np} d={d} r={r} workers={nw} weights={len(names)}", flush=True)
    print(f"# planned memory per worker: coefficient matrices {sum(q**n*(n+1)*2 for n in range(D+1))/1e6:.1f} MB; sieve {sum(q**n*13 for n in range(D+1))/1e6:.1f} MB; "
          f"phase tables <= {npr} primes x {sum(q**n for n in range(D+1))} bytes = {npr*sum(q**n for n in range(D+1))/1e9:.2f} GB; "
          f"weight matrix {len(names)*q**Np*8/1e6:.1f} MB; pair tables (weights x pairs x 8 bytes, pairs <= ~8 q^Np) <= {len(names)*8*q**Np*8/1e9:.2f} GB; "
          f"total for {nw} workers <= {nw*(npr*sum(q**n for n in range(D+1))/1e9 + len(names)*9*q**Np*8/1e9 + 0.3):.2f} GB", flush=True)
    ff = FF(q, D); pairs = Pairs(ff)
    for (N, lam) in geos:
        t0 = time.time()
        rows, diag, nfreq = run_block(ff, pairs, k, N, lam, d, names, nw)
        recs = []
        for i, nm in enumerate(names):
            st = stats_from(q, rows, diag[i], i, k, Np, d); st.update(q=q, w=nm, k=k, N=N, lam=lam, d=d, r=r, nfreq=nfreq); recs.append(st)
        with open(outfn, 'a') as f:
            f.write(json.dumps(dict(q=q, k=k, N=N, lam=lam, d=d, r=r, names=names, nfreq=nfreq, diag=[int(x) for x in diag], stats=recs,
                                    rows={';'.join(f'{p}^{v}' for p, v in lab): v for lab, v in rows.items()})) + "\n")
        a = recs[0]
        print(f"k={k} N={N} lam={lam} d={d} r={r} freqs={nfreq} rows={len(rows)} {time.time()-t0:.1f}s  a: U={a['U']} NP2={a['NP2']} T1={a['T1']:.4g}", flush=True)
