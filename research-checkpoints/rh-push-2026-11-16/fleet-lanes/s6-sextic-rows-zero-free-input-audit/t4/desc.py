#!/usr/bin/env python3
"""desc.py -- flow-descent rate as a pointwise von Mangoldt sum (combination 4 of lane s6-sextic-rows-zero-free-input-audit).

D_F(q; T) = sum_{n <= N} Lambda_F(n) w(n) n^{-s},  s = 1/2 + sqrt(q)/2 + i T,  w(n) = 1 - log n / log N,
on the arithmetic progression T_k = Tc + k delta, k = -M/2 .. M/2-1 (M = 2^19, delta = 0.05), by a type-1 non-uniform FFT
(Gaussian gridding, oversampling 2, half-width MSP). Poisson strength of the lane audit:  P(T) = mean(T) - Re D(T),
mean(T) = (1/2) log(cond T / 2 pi)   [P(z) = sum over real zeros 2y/((x - x_j)^2 + y^2), z = 2T + i sqrt(q)].
Channels per q: zeta, chi_-4, chi_5, hash sign twist (completely multiplicative), Liouville twist, E_a (a = 1/8, 1/4).
T-NR (q0 = 1000003, c = 2.2) is added afterwards from the zeta channel (exact local factor).
usage: desc.py N outdir Tc1 [Tc2 ...]        env USE_GPU=1 for cupy
"""
import sys, os, math, json, time
import numpy as np
GPU = os.environ.get('USE_GPU', '0') == '1'
if GPU:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('GPU_GB', '20')) * 1024 ** 3))
    xp = cp
else:
    xp = np
QS = [0.5625, 0.36, 0.25, 0.16, 0.09, 0.04, 0.0225, 0.01]
SIG = [0.5 + math.sqrt(q) / 2 for q in QS]
CH = ['zeta', 'chi4', 'chi5', 'hash', 'liou', 'Ea125', 'Ea25']
COND = {'zeta': 1, 'chi4': 4, 'chi5': 5, 'hash': 1, 'liou': 1, 'Ea125': 1, 'Ea25': 1}
MLOG = 19; M = 1 << MLOG; R = 2; MR = R * M; MSP = int(os.environ.get('MSP', '7')); DELTA = 0.05
TAU = math.pi * MSP / (M * M * R * (R - 0.5)); H = 2 * math.pi / MR

def sieve(N):
    """primes <= N (int64), segmented, odd only."""
    r = int(math.isqrt(N)) + 1
    s = np.ones(r + 1, bool); s[:2] = False
    for i in range(2, int(math.isqrt(r)) + 1):
        if s[i]: s[i * i::i] = False
    base = np.flatnonzero(s); base = base[base > 2]
    out = [np.array([2], np.int64)]
    SEG = 1 << 25                      # numbers per segment (odd only: SEG/2 flags)
    lo = 3
    while lo <= N:
        hi = min(lo + SEG, N + 1)      # [lo, hi), lo odd
        m = (hi - lo + 1) // 2
        f = np.ones(m, bool)
        for p in base:
            p = int(p)
            if p * p >= hi: break
            st = max(p * p, ((lo + p - 1) // p) * p)
            if st % 2 == 0: st += p
            f[(st - lo) // 2::p] = False
        out.append(lo + 2 * np.flatnonzero(f).astype(np.int64))
        lo = hi if hi % 2 == 1 else hi + 1
    return np.concatenate(out)

def hbit(x):
    x = (x.astype(np.uint64) + np.uint64(0x9E3779B97F4A7C15))
    x = (x ^ (x >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
    x = (x ^ (x >> np.uint64(27))) * np.uint64(0x94D049BB133111EB)
    x = x ^ (x >> np.uint64(31))
    return ((x >> np.uint64(17)) & np.uint64(1)).astype(np.int8)

def terms(N):
    """all prime powers n = p^k <= N sorted by n: n, p, k."""
    P = sieve(N)
    ns = [P]; ps = [P]; ks = [np.ones(len(P), np.int8)]
    k = 2
    while 2 ** k <= N:
        r = int(round(N ** (1.0 / k))) + 1
        while r ** k > N: r -= 1
        pp = P[P <= r]
        ns.append(pp ** k); ps.append(pp); ks.append(np.full(len(pp), k, np.int8)); k += 1
    n = np.concatenate(ns); p = np.concatenate(ps); k = np.concatenate(ks)
    o = np.argsort(n, kind='stable')
    return n[o], p[o], k[o]

def coeffs(n, p, k):
    """a_F(p^k)/1 for the completely multiplicative channels (int8) ; E_a handled as float factors."""
    c4 = np.where(p % 4 == 1, 1, np.where(p % 4 == 3, -1, 0)).astype(np.int8)
    r5 = p % 5; c5 = np.where((r5 == 1) | (r5 == 4), 1, np.where(r5 == 0, 0, -1)).astype(np.int8)
    eh = (1 - 2 * hbit(p)).astype(np.int8)
    odd = (k % 2 == 1)
    A = {'zeta': np.ones(len(n), np.int8),
         'chi4': np.where(odd, c4, c4 * c4).astype(np.int8),
         'chi5': np.where(odd, c5, c5 * c5).astype(np.int8),
         'hash': np.where(odd, eh, 1).astype(np.int8),
         'liou': np.where(odd, -1, 1).astype(np.int8)}
    return A

def window(Tc, n, p, k, A, N, outdir, chunk=1 << 19):
    t0 = time.time()
    nt = len(n)
    lgN = math.log(N)
    om_l = np.log(n.astype(np.longdouble))                    # 80-bit on x86 Linux
    twopi = 2 * np.arctan2(np.longdouble(0), np.longdouble(-1))
    u = np.longdouble(Tc) * om_l / twopi
    fr = (u - np.floor(u)).astype(np.float64)
    om = om_l.astype(np.float64); del om_l, u
    base = (p * (1.0 - om / lgN)) * np.exp(-2j * np.pi * fr)   # Lambda w e^{-i Tc log n}   (p = log p here)
    del fr
    nch = len(QS) * len(CH)
    print(f"  window Tc = {Tc:.6g}: terms {nt}, channels {nch}; grid alloc {nch * MR * 16 / 2**30:.2f} GB, chunk alloc {nch * chunk * 16 * 2 / 2**30:.2f} GB", flush=True)
    grid = xp.zeros((nch, MR + 4 * MSP + 8), dtype=xp.complex128)   # padded by OFF on the left
    OFF = 2 * MSP + 4
    for a in range(0, nt, chunk):
        b = min(a + chunk, nt)
        omc = xp.asarray(om[a:b]); bc = xp.asarray(base[a:b])
        x = DELTA * omc
        j0 = xp.rint(x / H).astype(xp.int64); d = x - j0 * H
        W = xp.empty((nch, b - a), dtype=xp.complex128)
        fac = {c: xp.asarray(A[c][a:b]).astype(xp.float64) for c in A}
        fac['Ea125'] = 2 * xp.cosh(0.125 * omc); fac['Ea25'] = 2 * xp.cosh(0.25 * omc)
        for iq, sg in enumerate(SIG):
            sq = bc * xp.exp(-sg * omc)
            for ic, c in enumerate(CH):
                W[iq * len(CH) + ic] = sq * fac[c]
        # cells: j0 is nondecreasing (terms sorted by n)
        chg = xp.flatnonzero(xp.diff(j0) != 0)
        ends = xp.concatenate([chg, xp.asarray([b - a - 1])])             # last index of each cell
        cells = j0[ends]
        for o in range(-MSP, MSP + 1):
            ker = xp.exp(-(d - o * H) ** 2 / (4 * TAU))
            C = xp.cumsum(W * ker, axis=1)
            S = C[:, ends]
            S[:, 1:] -= C[:, ends[:-1]]
            grid[:, cells + o + OFF] += S        # cells distinct within a chunk -> no duplicate indices
        del W, C, S
    g = grid[:, OFF:OFF + MR].copy()
    # wrap the padding (points near 0 / 2 pi do not occur: x in [delta log 2, delta log N]); assert it is empty
    padl = float(xp.abs(grid[:, :OFF]).max()); padr = float(xp.abs(grid[:, OFF + MR:]).max())
    Fk = xp.fft.fft(g, axis=1)
    kk = xp.concatenate([xp.arange(0, M // 2), xp.arange(-M // 2, 0)])
    idx = kk % MR
    D = Fk[:, idx] * (xp.exp(kk.astype(xp.float64) ** 2 * TAU) * (H / math.sqrt(4 * math.pi * TAU)))
    order = xp.argsort(kk)
    D = D[:, order]; kk = kk[order]
    D = cp.asnumpy(D) if GPU else D
    kk = cp.asnumpy(kk) if GPU else kk
    T = Tc + DELTA * kk
    # direct check on a few samples (float64 phases from the long-double reduced base)
    rng = np.random.default_rng(5); chk = []
    for ks in rng.integers(0, M, 6):
        kp = int(kk[ks])
        combos = ((0, 0), (len(QS) - 1, 0), (3, 2), (len(QS) - 1, 6)); dv = [0j] * len(combos)
        for a in range(0, nt, 1 << 22):
            sl = slice(a, a + (1 << 22)); oc = om[sl]
            e = base[sl] * np.exp(-1j * kp * DELTA * oc)
            for t, (iq, ic) in enumerate(combos):
                c = CH[ic]
                f = (2 * np.cosh((0.125 if c == 'Ea125' else 0.25) * oc)) if c.startswith('Ea') else A[c][sl]
                dv[t] += np.sum(e * np.exp(-SIG[iq] * oc) * f)
        for t, (iq, ic) in enumerate(combos):
            chk.append(abs(dv[t] - D[iq * len(CH) + ic, ks]) / max(1.0, abs(dv[t])))
    print(f"    nufft vs direct: max rel err {max(chk):.2e} on {len(chk)} values; pad {padl:.1e} {padr:.1e}; {time.time() - t0:.0f}s", flush=True)
    np.save(os.path.join(outdir, f"D_{Tc:.6g}.npy"), D.astype(np.complex64))
    return T, D, max(chk)

def tnr_local(sig, T, q0=1000003, c=2.2):
    """Re of f'/f(s) for f = 1 + c q^{1/2-s} + q^{1-2s} and the shift log q of the mean term (conductor q^2)."""
    s = sig + 1j * T; lq = math.log(q0)
    z = np.exp((0.5 - s) * lq)
    f = 1 + c * z + z * z; fp = -lq * (c * z + 2 * z * z)
    return (fp / f).real, lq

def p_req(q, t0, y0):
    """p >= 0 with int_{y0}^{sqrt q} Y/(1+pY) dY = t0 (0 if de Bruijn alone suffices)."""
    yq = math.sqrt(q)
    if yq <= y0 or (q - y0 * y0) / 2 <= t0: return 0.0
    f = lambda pp: (yq - y0) / pp - (math.log1p(pp * yq) - math.log1p(pp * y0)) / pp ** 2 - t0
    lo, hi = 1e-9, 1e6
    for _ in range(200):
        mid = math.sqrt(lo * hi)
        if f(mid) > 0: lo = mid
        else: hi = mid
    return lo

DESIGNS = {'U0.145': (0.1314, 0.165), 'P15': (0.2, 0.2), 'U0.116': (0.1025, 0.165)}

def stats(T, D, Tc):
    out = {}
    for iq, q in enumerate(QS):
        for ic, c in enumerate(CH):
            d = D[iq * len(CH) + ic]
            mean = 0.5 * np.log(COND[c] * T / (2 * math.pi))
            Pw = mean - d.real
            i0 = int(np.argmin(Pw)); i1 = int(np.argmax(np.abs(d)))
            rec = dict(q=q, sigma=SIG[iq], ch=c, mean_c=float(0.5 * math.log(COND[c] * Tc / (2 * math.pi))),
                       maxRe=float(d.real.max()), minRe=float(d.real.min()), supAbs=float(np.abs(d).max()), T_supAbs=float(T[i1]),
                       rmsRe=float(np.sqrt(np.mean(d.real ** 2))), meanRe=float(d.real.mean()),
                       minP=float(Pw[i0]), T_minP=float(T[i0]), medP=float(np.median(Pw)),
                       fracP_lt0=float(np.mean(Pw < 0)), fracP_lt217=float(np.mean(Pw < 2.17)), fracP_lt437=float(np.mean(Pw < 4.37)))
            for dn, (t0, y0) in DESIGNS.items():
                pr = p_req(q, t0, y0); rec['preq_' + dn] = pr; rec['fracfail_' + dn] = float(np.mean(Pw < pr))
            out[f"{c}|{q}"] = rec
        # T-NR from the zeta channel
        d = D[iq * len(CH)]
        loc, lq = tnr_local(SIG[iq], T)
        Pw = 0.5 * np.log(T / (2 * math.pi)) - d.real + loc + lq
        i0 = int(np.argmin(Pw))
        out[f"tnr|{q}"] = dict(q=q, sigma=SIG[iq], ch='tnr', minP=float(Pw[i0]), T_minP=float(T[i0]), medP=float(np.median(Pw)),
                               fracP_lt0=float(np.mean(Pw < 0)), fracP_lt217=float(np.mean(Pw < 2.17)), fracP_lt437=float(np.mean(Pw < 4.37)),
                               minP_zeta_bridge=float((0.5 * np.log(T / (2 * math.pi)) - d.real + loc).min()))
    return out

def main():
    N = int(float(sys.argv[1])); outdir = sys.argv[2]; Tcs = [float(x) for x in sys.argv[3:]]
    os.makedirs(outdir, exist_ok=True)
    t0 = time.time()
    print(f"N = {N:.3g}; planned: primes ~{1.1 * N / math.log(N):.3g} terms, host arrays ~{1.1 * N / math.log(N) * 60 / 2**30:.2f} GB; GPU = {GPU}", flush=True)
    n, p, k = terms(N)
    A = coeffs(n, p, k)
    nprimes = int((k == 1).sum()); p = np.log(p.astype(np.float64)); k = None     # from here on p holds log p
    print(f"terms: {len(n)} prime powers <= {N} ({nprimes} primes), {time.time() - t0:.0f}s", flush=True)
    res = {'N': N, 'M': M, 'delta': DELTA, 'MSP': MSP, 'QS': QS, 'windows': {}}
    for Tc in Tcs:
        T, D, err = window(Tc, n, p, k, A, N, outdir)
        st = stats(T, D, Tc); st['_nufft_err'] = err; st['_T_lo'] = float(T[0]); st['_T_hi'] = float(T[-1])
        res['windows'][f"{Tc:.6g}"] = st
        json.dump(res, open(os.path.join(outdir, 'desc_summary.json'), 'w'), indent=0)
        z = st[f"zeta|{QS[-1]}"]; z0 = st[f"zeta|{QS[0]}"]
        print(f"    zeta q=0.01: minP {z['minP']:.3f} at T={z['T_minP']:.2f}, mean {z['mean_c']:.3f}, maxRe {z['maxRe']:.3f}; q=0.5625: minP {z0['minP']:.3f}; total {time.time() - t0:.0f}s", flush=True)
    print("DONE", flush=True)

if __name__ == '__main__':
    main()
