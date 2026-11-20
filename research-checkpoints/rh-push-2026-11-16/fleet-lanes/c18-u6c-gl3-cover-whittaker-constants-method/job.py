"""c18-u6c: test of the support/value lemma for the Whittaker coefficients of the cubic theta function on GL(3).

Object: the cubic A_2 Weyl group multiple Dirichlet series over O = Z[w], S = {2, lambda} (Whittaker coefficients of
the Borel Eisenstein series on the cubic cover of GL(3); Brubaker-Bump-Friedberg-Hoffstein, recalled):
    Z(m1, m2) = sum_{c1, c2 primary, coprime to 6} H(c1, c2; m1, m2) N(c1)^(-2 s1) N(c2)^(-2 s2).
H: twisted multiplicativity + p-parts from strict Gelfand-Tsetlin patterns (Gamma rule, n = 3).
Statistic: S(X; m) = sum H(c1, c2; m) (N c1 N c2)^(-1/2) w(N c1/X) w(N c2/X),  w(t) = (1 - t)^3 on [0, 1].
The double residue of Z(m) (the theta coefficient tau(m1, m2) up to a power of the norms) is read as
R(m) = S(X; m)/S(X; (1,1)).  Lemma under test: tau(p^l1, p^l2) != 0 iff (l1, l2) = (0,0) or (1,1) mod 3.
Symbols are exact (integers mod 3); Gauss sums are float64 from the table tmp/sextic/data/sf_1e6.npz (rechecked).
Usage: python job.py table.npz X out.json
"""
import sys, os, json, math, time
import numpy as np

t0 = time.time()
def P(*a):
    print(f"[{time.time() - t0:7.1f}s]", *a, flush=True)

OM = np.exp(2j * np.pi / 3)
LUTC = np.array([1, np.conj(OM), np.conj(OM) ** 2, 0], dtype=np.complex128)     # conj(w)^k, 3 -> 0
LUT = np.array([1, OM, OM ** 2, 0], dtype=np.complex128)

def comb(x, y):
    """add cubic exponents with zero flag 3."""
    s = (x.astype(np.int16) + y) % 3
    return np.where((x == 3) | (y == 3), 3, s).astype(np.int8)

def vpow(base, e, mod):
    res = np.ones_like(base); b = base % mod
    while e:
        if e & 1: res = (res * b) % mod
        b = (b * b) % mod; e >>= 1
    return res

def f2mul(x, y, p):
    a, b = x; c, d = y
    return ((a * c - b * d) % p, (a * d + b * c - b * d) % p)

def cubic_exp(a, b, pa, pb, pp, inert, pw):
    """cubic residue symbol exponent k ((x/pi)_3 = w^k) of x = a + b w (arrays) at the prime (pa, pb); 3 if pi | x."""
    if not inert:
        p = int(pp); w = int(pw)
        r = (a % p + (b % p) * w) % p
        val = vpow(r, (p - 1) // 3, p)
        k = np.full(r.shape, -1, dtype=np.int8)
        k[val == 1] = 0; k[val == w] = 1; k[val == (w * w) % p] = 2; k[r == 0] = 3
        assert (k >= 0).all()
        return k
    p = int(pp); e = (p * p - 1) // 3
    x = (a % p, b % p); res = (np.ones_like(a), np.zeros_like(a)); bb = x
    while e:
        if e & 1: res = f2mul(res, bb, p)
        bb = f2mul(bb, bb, p); e >>= 1
    k = np.full(a.shape, -1, dtype=np.int8)
    k[(res[0] == 1) & (res[1] == 0)] = 0
    k[(res[0] == 0) & (res[1] == 1)] = 1
    k[(res[0] == p - 1) & (res[1] == p - 1)] = 2
    k[(x[0] == 0) & (x[1] == 0)] = 3
    assert (k >= 0).all()
    return k

def gt_local(l1, l2, q, gam):
    """p-part H(p^k1, p^k2; p^l1, p^l2), n = 3, as dict (k1, k2) -> complex. gam = normalised cubic Gauss sum of p."""
    sq = math.sqrt(q)
    def gauss(r):       # g(p^(r-1), p^r)
        t = r % 3
        return q ** (r - 1) * (-1 if t == 0 else (sq * gam if t == 1 else sq * np.conj(gam)))
    def hh(r):
        return (q - 1) * q ** (r - 1) if r % 3 == 0 else 0
    a00, a01, a02 = l1 + l2 + 2, l2 + 1, 0
    out = {}
    for a11 in range(a01, a00 + 1):
        for a12 in range(a02, a01 + 1):
            if a11 == a12: continue
            for a22 in range(a12, a11 + 1):
                ents = [((a11 - a01) + (a12 - a02), a11 == a00, a11 == a01),
                        ((a12 - a02), a12 == a01, a12 == a02),
                        ((a22 - a12), a22 == a11, a22 == a12)]
                w = 1
                for G, b, c in ents:
                    if b and c: w = 0; break
                    if c: w *= q ** G
                    elif b: w *= gauss(G)
                    else:
                        h = hh(G)
                        if h == 0: w = 0; break
                        w *= h
                if w == 0: continue
                k = ((a11 - a01) + (a12 - a02), a22 - a02)
                out[k] = out.get(k, 0) + w
    return {k: v for k, v in out.items() if abs(v) > 1e-9}

def wfun(t):
    return np.where(t < 1, (1 - np.minimum(t, 1)) ** 3, 0.0)

def main():
    path, X, outp = sys.argv[1], int(float(sys.argv[2])), sys.argv[3]
    d = np.load(path)
    keep = np.flatnonzero(d['N'] <= X); n = len(keep)
    remap = -np.ones(len(d['N']), dtype=np.int64); remap[keep] = np.arange(n)
    na = d['na'][keep]; nb = d['nb'][keep]; N = d['N'][keep]; gam = d['g2'][keep]
    par = d['parent'][keep]; par = np.where(par >= 0, remap[np.maximum(par, 0)], -1)
    last = d['last'][keep]; depth = d['depth'][keep]
    npr = int((d['pq'] <= X).sum())
    assert (np.diff(d['pq'][:npr + 1]) >= 0).all() and last.max() < npr
    pa, pb, pp, pq, pin, pw, pg = (d[k][:npr] for k in ('pa', 'pb', 'pp', 'pq', 'pinert', 'pw', 'pg2'))
    P(f"X = {X}: squarefree nodes n = {n}, primes {npr} (inert {int(pin.sum())})")
    P(f"planned allocations: Ep {n * npr / 1e6:.0f} MB int8, E {n * n / 1e6:.0f} MB int8, work chunks < 400 MB")
    # ---- prime symbol matrix Ep[A, p]
    Ep = np.empty((n, npr), dtype=np.int8)
    for j in range(npr):
        Ep[:, j] = cubic_exp(na, nb, pa[j], pb[j], pp[j], bool(pin[j]), pw[j])
    P("Ep built")
    # ---- check Gauss sums of the first primes against the table (direct sums)
    chk = []
    for j in list(range(6)) + [int(np.flatnonzero(pin)[0])]:
        if pin[j]:
            p = int(pp[j]); va, vb = np.meshgrid(np.arange(p), np.arange(p)); va = va.ravel(); vb = vb.ravel()
        else:
            va = np.arange(int(pp[j])); vb = np.zeros_like(va)
        k = cubic_exp(va, vb, pa[j], pb[j], pp[j], bool(pin[j]), pw[j])
        v = va - vb / 2 + 1j * vb * math.sqrt(3) / 2
        pi = pa[j] - pb[j] / 2 + 1j * pb[j] * math.sqrt(3) / 2
        z = v / pi
        g = (LUT[k] * np.exp(4j * np.pi * z.imag / math.sqrt(3))).sum() / math.sqrt(pq[j])
        chk.append(abs(g - pg[j]))
    P("Gauss-sum recheck (7 primes), max |direct - table| =", max(chk)); assert max(chk) < 1e-9
    # ---- E_T[B, A] = exponent of (A/B)_3
    E = np.empty((n, n), dtype=np.int8)
    E[0, :] = 0
    for L in range(1, int(depth.max()) + 1):
        lev = np.flatnonzero(depth == L)
        for s in range(0, len(lev), 2000):
            ii = lev[s:s + 2000]
            E[ii, :] = comb(E[par[ii], :], Ep[:, last[ii]].T)
    P("E built")
    # reciprocity check (primary elements): E symmetric
    rng = np.random.default_rng(1); ii = rng.integers(0, n, 4000); jj = rng.integers(0, n, 4000)
    rec_bad = int((E[ii, jj] != E[jj, ii]).sum()); P("reciprocity check on 4000 random pairs: mismatches", rec_bad)
    # twisted multiplicativity of table Gauss sums: gam(A p) = w^(2 e) gam(A) gam(p)
    lev = np.flatnonzero(depth >= 2)[:20000]
    pnode = {int(last[i]): int(i) for i in np.flatnonzero(depth == 1)}       # prime index -> node
    pn = np.array([pnode[int(x)] for x in last[lev]])
    tm = np.abs(gam[lev] - LUT[(2 * E[par[lev], pn]) % 3] * gam[par[lev]] * gam[pn]).max()
    P("twisted multiplicativity of table Gauss sums (20000 nodes): max dev", tm)
    order = np.argsort(N, kind='stable'); Ns = N[order]
    Xs = [X // 8, X // 4, X // 2, X]
    # ---- twists
    def pidx(q, which=0):
        return int(np.flatnonzero(pq == q)[which])
    A7, B7, A13, A19, I5 = pidx(7, 0), pidx(7, 1), pidx(13, 0), pidx(19, 0), pidx(25, 0)
    twists = [('1', {})]
    for nm, pj in (('P7', A7), ('P13', A13), ('P19', A19)):
        for l in ((1, 0), (0, 1), (1, 1), (2, 0), (2, 1), (1, 2), (2, 2)):
            twists.append((f"{nm}^{l}", {pj: l}))
    for l in ((3, 0), (0, 3), (3, 3), (4, 1), (1, 4)):
        twists.append((f"P7^{l}", {A7: l}))
    twists += [("P7^(1,1)*P13^(1,1)", {A7: (1, 1), A13: (1, 1)}), ("P7^(1,0)*P13^(0,1)", {A7: (1, 0), A13: (0, 1)}),
               ("P7^(1,1)*P7b^(1,1)", {A7: (1, 1), B7: (1, 1)}), ("P7^(1,1)*P13^(1,0)", {A7: (1, 1), A13: (1, 0)}),
               ("P7b^(1,1)", {B7: (1, 1)}), ("I5^(1,1)", {I5: (1, 1)}), ("I5^(1,0)", {I5: (1, 0)})]
    sqX = math.isqrt(X)
    defect_primes = [j for j in range(npr) if pq[j] <= sqX]
    def esym(j, k):      # exponent of (p_j / p_k)
        return int(Ep[pnode[j], k])
    def bil(Bsel, Asel, V, U):
        """sum_x sum_{B, A} V[B, x] conj(w)^E[B, A] U[A, x] for index arrays (None = all); returns array over x."""
        nBq = n if Bsel is None else len(Bsel); nAq = n if Asel is None else len(Asel)
        tot = np.zeros(V.shape[1], dtype=np.complex128)
        step = max(1, int(2e7 // max(nAq, 1)))
        for s in range(0, nBq, step):
            if Bsel is None:
                blk = E[s:s + step, :] if Asel is None else E[s:s + step][:, Asel]
            else:
                rows = Bsel[s:s + step]
                blk = E[rows, :] if Asel is None else E[np.ix_(rows, Asel)]
            Zc = LUTC[blk]
            tot += ((Zc @ U) * V[s:s + step]).sum(axis=0)
        return tot
    res = {}; deferred = []
    for name, tw in twists:
        tprimes = sorted(tw)
        # local tables
        loc = {}
        for j in tprimes:
            tab = gt_local(tw[j][0], tw[j][1], float(pq[j]), complex(pg[j]))
            tab.pop((0, 0), None); loc[j] = tab
        nont = {}
        def loc_of(j):
            if j in loc: return loc[j]
            if j not in nont:
                tab = gt_local(0, 0, float(pq[j]), complex(pg[j]))
                for k in ((0, 0), (1, 0), (0, 1)): tab.pop(k, None)
                nont[j] = tab
            return nont[j]
        cand = tprimes + [j for j in defect_primes if j not in tw]
        # twist exponents for u, v (trivial-G part), zero flags at twist primes
        base_eu = np.zeros(n, dtype=np.int16); base_ev = np.zeros(n, dtype=np.int16); base_ok = np.ones(n, dtype=bool)
        for j in tprimes:
            col = Ep[:, j]; base_ok &= col != 3
            base_eu -= tw[j][0] * col; base_ev -= tw[j][1] * col
        S = np.zeros(len(Xs), dtype=np.complex128); nG = 0; Sparts = {'trivial': None}
        Xa = np.array(Xs, dtype=float)
        stack = [(0, [], 1, 1, 1 + 0j)]       # (next cand position, [(j, a, b)], Ng1, Ng2, H value)
        while stack:
            pos, items, Ng1, Ng2, Hv = stack.pop()
            # evaluate this G
            if Ng1 < X and Ng2 < X:
                nA = int(np.searchsorted(Ns, X / Ng1, side='left')); nB = int(np.searchsorted(Ns, X / Ng2, side='left'))
                if nA > 0 and nB > 0:
                    Asel = None if not items else order[:nA]; Bsel = None if not items else order[:nB]
                    ia = slice(None) if Asel is None else Asel; ib = slice(None) if Bsel is None else Bsel
                    eu = base_eu[ia].copy(); ev = base_ev[ib].copy(); oka = base_ok[ia].copy(); okb = base_ok[ib].copy()
                    for (j, a, b) in items:
                        ca = Ep[ia, j]; cb = Ep[ib, j]
                        oka &= ca != 3; okb &= cb != 3
                        eu += (2 * a - b) * ca; ev += (2 * b - a) * cb
                    U = (gam[ia] * LUT[eu % 3] * oka)[:, None] * wfun(N[ia][:, None] * Ng1 / Xa[None, :])
                    V = (gam[ib] * LUT[ev % 3] * okb)[:, None] * wfun(N[ib][:, None] * Ng2 / Xa[None, :])
                    nG += 1
                    if not items:
                        deferred.append((name, U, V))
                    else:
                        S += Hv * bil(Bsel, Asel, V, U)
            # extend
            for k in range(pos, len(cand)):
                j = cand[k]; q = int(pq[j])
                if Ng1 * q >= X and Ng2 * q >= X: 
                    if j not in tw: break
                    continue
                for (a, b), hv in loc_of(j).items():
                    M1 = Ng1 * q ** a; M2 = Ng2 * q ** b
                    if M1 >= X or M2 >= X: continue
                    # twist symbols conj(chi_p(m1'))^a conj(chi_p(m2'))^b
                    ex = 0
                    for jj in tprimes:
                        if jj != j:
                            ex -= (a * tw[jj][0] + b * tw[jj][1]) * esym(jj, j)
                    # cross symbols with earlier items
                    for (j2, a2, b2) in items:
                        ex += (2 * a * a2 + 2 * b * b2 - a * b2 - a2 * b) * esym(j, j2)
                    stack.append((k + 1, items + [(j, a, b)], M1, M2, Hv * hv / q ** ((a + b) / 2) * OM ** (ex % 3)))
        res[name] = {'Sdef': S.copy(), 'nG': nG}
        P(f"twist {name:24s} nG={nG:5d} defect part done")
    # trivial-G parts of all twists in one pass over E
    Uall = np.concatenate([u for (_, u, _) in deferred], axis=1); Vall = np.concatenate([v for (_, _, v) in deferred], axis=1)
    P(f"trivial-G pass: columns {Uall.shape[1]}, U/V {Uall.nbytes / 1e6:.0f} MB each")
    triv = bil(None, None, Vall, Uall)
    for i, (name, _, _) in enumerate(deferred):
        tv = triv[4 * i:4 * i + 4]; S = res[name]['Sdef'] + tv
        res[name] = {'S': [[float(z.real), float(z.imag)] for z in S], 'nG': res[name]['nG'],
                     'S_trivialG': [[float(z.real), float(z.imag)] for z in tv]}
        P(f"twist {name:24s} S(X)={S[-1].real:+.5e}{S[-1].imag:+.5e}i  S(X/2)={S[-2].real:+.5e}{S[-2].imag:+.5e}i")
    # ---- GL(2) calibration: S1(X; r) = sum_c g(r, c) N(c)^(-1/2) w(N c/X), r = p^l, l = 0, 1, 2
    cal = {}
    Xa = np.array(Xs, dtype=float)
    cal['1'] = [complex(z) for z in (gam[:, None] * wfun(N[:, None] / Xa[None, :])).sum(axis=0)]
    for nm, j in (('P7', A7), ('P13', A13), ('P19', A19), ('I5', I5)):
        q = float(pq[j]); col = Ep[:, j]; ok = col != 3; g = complex(pg[j])
        for l in (1, 2):
            tw_ = np.where(ok, LUTC[(l * col) % 3], 0) * gam       # conj(chi_A(p))^l gam(A)
            s = (tw_[:, None] * wfun(N[:, None] / Xa[None, :])).sum(axis=0)
            if l == 1:    # c = p^2 A: g(p, p^2 A) / (q sqrt(N A)) = sqrt(q) conj(gam(p)) gam(A)
                s = s + math.sqrt(q) * np.conj(g) * ((gam * ok)[:, None] * wfun(N[:, None] * q * q / Xa[None, :])).sum(axis=0)
            else:         # c = p^3 A: g(p^2, p^3 A)/(q^(3/2) sqrt(N A)) = -sqrt(q) conj(chi_A(p))^2 gam(A)
                s = s - math.sqrt(q) * (tw_[:, None] * wfun(N[:, None] * q ** 3 / Xa[None, :])).sum(axis=0)
            cal[f"{nm}^{l}"] = [complex(z) for z in s]
    out = {'X': X, 'Xs': Xs, 'n': n, 'npr': npr, 'rec_bad': rec_bad, 'tm_dev': float(tm), 'gauss_recheck': float(max(chk)),
           'twists': res, 'gl2': {k: [[z.real, z.imag] for z in v] for k, v in cal.items()},
           'gauss': {nm: [complex(pg[j]).real, complex(pg[j]).imag, int(pq[j])] for nm, j in
                     (('P7', A7), ('P7b', B7), ('P13', A13), ('P19', A19), ('I5', I5))},
           'esym': {'P7,P13': esym(A7, A13), 'P7,P7b': esym(A7, B7)},
           'seconds': time.time() - t0}
    json.dump(out, open(outp, 'w'), indent=1)
    P("saved", outp)

if __name__ == '__main__':
    main()
