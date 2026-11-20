"""alias_sieve.py -- combination (4): five-shell functional E_97 and the sieve-algebra energy fraction of the alias
vector, on coefficient vectors Lambda_F(n), n <= N.   usage: alias_sieve.py out.json Nmax Ndh"""
import sys, math, json, time
import numpy as np
import pklib as L

PR = L.PRIMES97; CUTS = [0, 5, 10, 17, 25]
P6 = 30030
QS = [3, 5, 7, 11, 13, 15, 30, 210, 2310, 30030, 97]
NSEED = 16
CHIMOD = [101, 103, 107, 109]
M64 = np.uint64(0xFFFFFFFFFFFFFFFF)

def splitmix(x):
    x = (x + np.uint64(0x9E3779B97F4A7C15))
    x = (x ^ (x >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
    x = (x ^ (x >> np.uint64(27))) * np.uint64(0x94D049BB133111EB)
    return x ^ (x >> np.uint64(31))

def sgn_uni(q, seed):
    with np.errstate(over="ignore"):
        h = splitmix(q ^ np.uint64((seed * 0x100000001B3) & 0xFFFFFFFFFFFFFFFF))
        sg = np.where((h & np.uint64(1)) == 1, 1.0, -1.0)
        h2 = splitmix(h ^ np.uint64(0xABCDEF1234567))
    th = 2 * np.pi * (h2 >> np.uint64(11)).astype(np.float64) / 9007199254740992.0
    return sg, th

def legendre_table(m):
    t = np.full(m, -1.0); t[0] = 0
    for i in range(1, m): t[(i * i) % m] = 1
    return t

def variant_names():
    return ["ZETA", "LIOU", "EA", "TNR3"] + ["CHI%d" % m for m in CHIMOD] + ["SGN%d" % s for s in range(NSEED)] + ["UNI%d" % s for s in range(NSEED)]

def weights(q, j, n):
    """complex weights [nvar, len] for prime powers n = q^j (arrays)"""
    lq = np.log(q.astype(np.float64)); nf = n.astype(np.float64)
    out = [lq + 0j, lq * np.where(j % 2 == 1, -1.0, 1.0) + 0j, lq * (nf ** 0.25 + nf ** -0.25) + 0j]
    cc = 2.2; d = math.sqrt(cc * cc - 4); al = math.sqrt(3) * (-cc + d) / 2; be = math.sqrt(3) * (-cc - d) / 2
    out.append(np.where(q == 3, lq * (1 - al ** j.astype(np.float64) - be ** j.astype(np.float64)), lq) + 0j)
    for m in CHIMOD:
        t = legendre_table(m); c = t[(q % np.uint64(m)).astype(np.int64)]
        out.append(lq * np.where(j % 2 == 1, c, c * c) + 0j)
    sg = []; un = []
    for s in range(NSEED):
        a, th = sgn_uni(q, s + 1)
        sg.append(lq * np.where(j % 2 == 1, a, 1.0) + 0j); un.append(lq * np.exp(1j * th * j))
    return np.array(out + sg + un)

def fold_stats(S30, S97):
    """S30 [nvar, 30030] complex class sums, S97 [nvar, 97] -> dict q -> f_q[nvar], E_q[nvar]"""
    out = {}
    for q in QS:
        if q == 97: Sq = S97
        else:
            idx = np.arange(P6) % q
            Sq = np.stack([np.bincount(idx, weights=S30[v].real, minlength=q) + 1j * np.bincount(idx, weights=S30[v].imag, minlength=q) for v in range(S30.shape[0])])
        F = np.fft.fft(Sq, axis=-1)
        U = np.array([math.gcd(a, q) == 1 for a in range(q)])
        phi = int(U.sum())
        Fu = F[:, U]
        E = (np.abs(Fu) ** 2).sum(-1)
        f = np.abs(Fu.sum(-1)) ** 2 / (phi * E)
        out[q] = (f, E, phi)
    return out

def run(outfn, Nmax, Ndh):
    names = variant_names(); nv = len(names)
    cps = [int(round(10 ** (5 + 0.5 * i))) for i in range(0, 13) if 10 ** (5 + 0.5 * i) <= Nmax * 1.0001]
    print("checkpoints", cps, "variants", nv, "; class arrays %.1f MB; weight block %.1f MB; prime chunk %.1f MB" % (nv * (P6 + 97) * 16 / 1e6, nv * 400000 * 16 / 1e6, 1.3 * (1 << 26) / 17 * 8 / 1e6), flush=True)
    S30 = np.zeros((nv, P6), dtype=complex); S97 = np.zeros((nv, 97), dtype=complex)
    Y4 = np.zeros(nv, dtype=complex); Z = np.zeros((nv, 4), dtype=complex)
    # prime powers j >= 2
    small = L.primes_range(2, int(math.isqrt(Nmax)) + 2)
    pp = []
    for q in small:
        q = int(q); n = q * q; j = 2
        while n <= Nmax: pp.append((n, q, j)); n *= q; j += 1
    pp.sort(); ppn = np.array([x[0] for x in pp], dtype=np.uint64); ppq = np.array([x[1] for x in pp], dtype=np.uint64); ppj = np.array([x[2] for x in pp], dtype=np.int64)
    blk_of = {p: g for g in range(4) for p in PR[CUTS[g]:CUTS[g + 1]]}
    def add(n, q, j, SUB=400000):
        if len(n) > SUB:
            for i in range(0, len(n), SUB): add(n[i:i + SUB], q[i:i + SUB], j[i:i + SUB])
            return
        if len(n) == 0: return
        w = weights(q, j, n)
        r30 = (n % np.uint64(P6)).astype(np.int64); r97 = (n % np.uint64(97)).astype(np.int64)
        for v in range(nv):
            S30[v] += np.bincount(r30, weights=w[v].real, minlength=P6) + 1j * np.bincount(r30, weights=w[v].imag, minlength=P6)
            S97[v] += np.bincount(r97, weights=w[v].real, minlength=97) + 1j * np.bincount(r97, weights=w[v].imag, minlength=97)
        sm = q <= np.uint64(97)
        Y4[:] += w[:, ~sm].sum(-1)
        for i in np.nonzero(sm)[0]: Z[:, blk_of[int(q[i])]] += w[:, i]
    res = {"variants": names, "QS": QS, "checkpoints": []}
    lo = 2; CH = 1 << 26; t0 = time.time(); dh_done = False
    for cp in cps:
        a = lo
        while a <= cp:
            b = min(cp + 1, a + CH)
            pr = L.primes_range(a, b)
            add(pr, pr, np.ones(len(pr), dtype=np.int64))
            a = b
        m = (ppn >= np.uint64(lo)) & (ppn <= np.uint64(cp))
        add(ppn[m], ppq[m], ppj[m])
        lo = cp + 1
        st = fold_stats(S30, S97)
        rec = {"N": cp, "f": {str(q): [float(x) for x in st[q][0]] for q in QS}, "E_over_N2": {str(q): [float(x) / cp ** 2 for x in st[q][1]] for q in QS},
               "phi": {str(q): st[q][2] for q in QS},
               "Y4": [[float(x.real), float(x.imag)] for x in Y4], "Z": [[[float(x.real), float(x.imag)] for x in Z[v]] for v in range(nv)]}
        res["checkpoints"].append(rec)
        print("N=%d %.0fs  f(q=7): ZETA %.6f LIOU %.6f CHI101 %.4f SGN-mean*phi %.3f UNI-mean*phi %.3f | Y4/N ZETA %.4f SGN0 %.2e" % (
            cp, time.time() - t0, st[7][0][0], st[7][0][1], st[7][0][4], 6 * st[7][0][8:8 + NSEED].mean(), 6 * st[7][0][8 + NSEED:].mean(), Y4[0].real / cp, Y4[8].real / cp), flush=True)
    # ---- Davenport-Heilbronn: Lambda_DH on all n <= Ndh
    if Ndh > 0:
        print("DH table: %.2f GB" % (8 * (Ndh + 1) / 1e9), flush=True)
        Ld = L.dh_lambda(Ndh)
        S30d = np.zeros(P6); S97d = np.zeros(97); Y4d = 0.0; Zd = np.zeros(4)
        res["DH"] = []
        lo = 1
        for cp in [c for c in cps if c <= Ndh] + ([Ndh] if Ndh not in cps else []):
            a = lo
            while a <= cp:
                b = min(cp + 1, a + (1 << 24))
                n = np.arange(a, b, dtype=np.int64); w = Ld[a:b]
                S30d += np.bincount(n % P6, weights=w, minlength=P6); S97d += np.bincount(n % 97, weights=w, minlength=97)
                blk = np.full(b - a, 4, dtype=np.int8)
                for g in range(3, -1, -1):
                    for p in PR[CUTS[g]:CUTS[g + 1]]: blk[(-a) % p::p] = g
                bs = np.bincount(blk, weights=w, minlength=5); Zd += bs[:4]; Y4d += bs[4]
                a = b
            lo = cp + 1
            st = fold_stats(S30d[None, :] + 0j, S97d[None, :] + 0j)
            res["DH"].append({"N": cp, "f": {str(q): float(st[q][0][0]) for q in QS}, "E_over_N2": {str(q): float(st[q][1][0]) / cp ** 2 for q in QS},
                              "Y4": float(Y4d), "Z": [float(x) for x in Zd], "sum_abs_tail": float(np.abs(Ld[max(1, cp - 1000):cp + 1]).mean())})
            print("DH N=%d f(7)=%.4f f(97)=%.4f Y4/N=%.4g sumZ/N=%.4g" % (cp, st[7][0][0], st[97][0][0], Y4d / cp, Zd.sum() / cp), flush=True)
    json.dump(res, open(outfn, "w"))
    print("done", flush=True)

if __name__ == "__main__":
    run(sys.argv[1], int(float(sys.argv[2])), int(float(sys.argv[3])))
