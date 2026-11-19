"""arb_probe.py -- ball-arithmetic evaluation of the probe (6.1), independent of probe.c and of the decompositions in prep6.py.

Independent of probe.c / prep6.py in:
  * rows: lattice loop over all m = x + y w with Mmin <= N(m) <= Mmax coprime to 6 (no DFS over ideals, no unit orbits);
  * symbols: numpy modular powers per row; chi_A(m) from the factorisation of A;
  * index phases: xi(A), chi_A(b*), G(A) = conj(chi_A(4)) Gamma(A), R(A, s) are evaluated on the element A = c n^3 itself
    (no use of G(c n^3) = G(c) G(n^3) R(c, n), no per-n factors);
  * Gauss sums g_{chi_s}(s, -m) from the definition (sum over a residue system), per row (no HNF index tables);
  * arithmetic: every coefficient is an acb ball (python-flint), replaced by an exact integer midpoint (scale 2^-44)
    plus radius 2^-43 per component; index sums are exact integer sums (two 22-bit limbs through float64 bincount,
    each partial sum < 2^53); the six sextic classes and everything downstream are combined in acb.
Shared with prep6.py: the table of gamma_2 (used only to select the cube root of mu(c) alpha(c)), the definition of the
weights (prime signs), the test functions (re-implemented here in arb) and the supports of W0, W1.
Usage: python arb_probe.py table.npz Z out.json weight [weight ...]   [--u0 3.5 --u1 4.0]
"""
import sys, os, math, json, time, argparse
import numpy as np
from flint import arb, acb, ctx
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import prep6 as P6

ctx.prec = 120
SCALE = 44

def arb_bump(r, lo, hi):
    t = (2 * r - lo - hi) / (hi - lo)
    if t >= 1 or t <= -1: return arb(0)
    if not (t < 1 and t > -1): raise ArithmeticError('borderline bump argument')
    return (1 - 1 / (1 - t * t)).exp()

def arb_V(u, u0, u1):
    v = (-(u * u) / 4).exp() / (2 * arb.pi().sqrt())
    x = (u - u0) / (u1 - u0)
    if x < 0: return v
    if x > 1: return arb(0)
    if not (x > 0 and x < 1): raise ArithmeticError('borderline taper argument')
    f1 = (-1 / (1 - x)).exp(); f0 = (-1 / x).exp()
    return v * f1 / (f0 + f1)

def zeta(k, n):
    """exp(2 pi i k / n) as acb."""
    return (acb(0, 2) * acb.pi() * k / n).exp()

def elem(x):
    """the complex number x[0] + x[1] w as acb."""
    return acb(arb(2 * x[0] - x[1]) / 2, arb(x[1]) * arb(3).sqrt() / 2)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('table'); ap.add_argument('Z', type=int); ap.add_argument('out'); ap.add_argument('weights', nargs='+')
    ap.add_argument('--u0', default='3.5'); ap.add_argument('--u1', default='4.0')
    a = ap.parse_args()
    t0 = time.time()
    Z = a.Z; u0 = arb(a.u0); u1 = arb(a.u1)
    Xs = arb(Z).sqrt(); Ys = Xs
    Xmax = int(math.floor(Z * math.exp(float(a.u1))))
    d = np.load(a.table)
    N = d['N']; keep = np.flatnonzero(N <= Xmax); nn = len(keep)
    remap = np.full(len(N), -1, dtype=np.int64); remap[keep] = np.arange(nn)
    na = d['na'][keep]; nb = d['nb'][keep]; Nk = N[keep]; depth = d['depth'][keep]; g2 = d['g2'][keep]
    parent = remap[np.maximum(d['parent'][keep], 0)]; parent[0] = -1
    last = d['last'][keep]
    npr = int((d['pq'] <= Xmax).sum())
    pa = d['pa'][:npr]; pb = d['pb'][:npr]; pp = d['pp'][:npr]; pinert = d['pinert'][:npr]; pw = d['pw'][:npr].copy(); pq = d['pq'][:npr]
    pwc = pw.copy(); pwc[pinert] = -1
    levels = [np.flatnonzero(depth == L) for L in range(1, int(depth.max()) + 1)]
    wi = [P6.WEIGHTS.index(w) for w in a.weights]
    ps = P6.prime_signs(pa, pb, pp, pinert)
    sg = P6.node_signs(ps, parent.astype(np.int32), last, depth, na, nb)
    W0lo, W0hi = P6.W0_SUPP; W1lo, W1hi = P6.W1_SUPP
    # ---- s values
    Yf = math.sqrt(Z)
    slist = [t for t in P6.primary_list(int(math.floor(W1lo * Yf)), int(math.ceil(W1hi * Yf))) if W1lo < t[0] / Yf < W1hi]
    for q, x, y in slist:                                 # the float test of the open support must be decided by arb as well
        r = arb(q) / Ys
        assert (r > W1lo and r < W1hi)
    small = [(k, (int(pa[k]), int(pb[k])), int(pq[k])) for k in range(npr) if pq[k] <= max(int(2 * Yf) + 2, int(Xmax ** (1 / 3.0)) + 2)]
    kB = P6.chi_primes(pp, pwc, pinert, (2, 4)); k4 = P6.chi_primes(pp, pwc, pinert, (4, 0))
    # tau
    bst = (2, 4); tau = acb(0)
    for (x, y) in P6.hnf_residues(bst):
        n_ = x * x - x * y + y * y
        if n_ % 2 == 0 or n_ % 3 == 0: continue
        num = P6.zmul((x, y), P6.zconj(bst))              # d / b* = num / 12
        xi = (1 if (x + y) % 3 == 1 else -1) * zeta(int(P6.xi2_exp(x, y)), 3)
        tau += xi * zeta(num[1] % 12, 12)
    tau = tau / arb(12).sqrt()
    assert abs(abs(tau) - 1) < arb('1e-25')
    sinfo = []
    for q, x, y in slist:
        fac = P6.factor_primary((x, y), small) if q > 1 else []
        res = P6.hnf_residues((x, y))
        chi = []
        for dd in res:
            tot = 0; ok = True
            for k, e in fac:
                kk = P6.prime_chi_scalar(k, pa, pb, pp, pw, pinert, dd)
                if kk is None: ok = False; break
                tot += e * kk
            chi.append(tot % 6 if ok else -1)
        chis_b = sum(e * int(kB[k]) for k, e in fac) % 6
        xis = (1 if (x + y) % 3 == 1 else -1) * zeta(int(P6.xi2_exp(x, y)), 3)
        pref = arb_bump(arb(q) / Ys, W1lo, W1hi) * zeta(chis_b, 6) * xis.conjugate() / (Ys * tau * (12 * Xs).sqrt() * q)
        roots = [zeta(j, 6 * q) for j in range(6 * q)]    # zeta6^e * e(y/q) = exp(2 pi i (e q + 6 y) / (6 q))
        sinfo.append(dict(q=q, s=(x, y), cs=P6.zconj((x, y)), res=res, chi=chi, pref=pref, roots=roots, cls=P6.SQT[(x % 4, y % 4)], cache={}))
    qs_min = min(t[0] for t in slist); qs_max = max(t[0] for t in slist)
    Mmin = int(math.floor(12.0 * Yf * qs_min * W0lo)); Mmax = int(math.ceil(12.0 * Yf * qs_max * W0hi))
    # ---- index set: A = c n^3, coefficient balls
    nlist = [(1, 1, 0)] + [t for t in P6.primary_list(2, int(Xmax ** (1 / 3.0) + 1e-9)) if t[0] ** 3 <= Xmax]
    sq3 = arb(3).sqrt()
    eB = np.zeros(nn, dtype=np.int64); e4 = np.zeros(nn, dtype=np.int64)
    for lev in levels:
        eB[lev] = (eB[parent[lev]] + kB[last[lev]]) % 6; e4[lev] = (e4[parent[lev]] + k4[last[lev]]) % 6
    I4 = [acb(1), acb(0, 1), acb(-1), acb(0, -1)]
    cube = [zeta(j, 3) for j in range(3)]
    A_c = []; A_coef = []; A_cls = []; A_nfac = []; A_sign = []
    maxrad = 0.0
    for q, x, y in nlist:
        nfac = P6.factor_primary((x, y), small) if q > 1 else []
        n3 = P6.zmul(P6.zmul((x, y), (x, y)), (x, y))
        eBn = 3 * sum(e * int(kB[k]) for k, e in nfac); e4n = 3 * sum(e * int(k4[k]) for k, e in nfac)
        wn = np.ones(P6.NW, dtype=np.int64)
        for k, e in nfac:
            if e % 2: wn *= ps[:, k]
        wn[P6.WEIGHTS.index('iid')] = 1
        idx = np.flatnonzero(Nk * (q ** 3) <= Xmax)
        for c in idx.tolist():
            cel = (int(na[c]), int(nb[c])); Ael = P6.zmul(cel, n3); qA = int(Nk[c]) * q ** 3
            V = arb_V((arb(qA) / Z).log(), u0, u1)
            if V == 0: continue
            # gamma_2(c): cube root of mu(c) alpha(c) nearest to the table value
            mu = 1 if depth[c] % 2 == 0 else -1
            al_c = elem(cel) / arb(int(Nk[c])).sqrt()
            tv = complex(g2[c]); tb = acb(tv.real, tv.imag)       # exact float; (mu alpha)/tb^3 is within 1e-6 of 1
            ratio = (mu * al_c) / (tb * tb * tb)
            assert abs(ratio - 1) < arb('1e-6')
            g2c = tb * (ratio.log() / 3).exp()                    # the cube root of mu(c) alpha(c) nearest to the table value
            al_A = elem(Ael) / arb(qA).sqrt()
            xiA = zeta(int(P6.xi2_exp(Ael[0], Ael[1])), 3)       # xi_lambda(A) = 1 (A = 1 mod 3)
            assert (Ael[0] + Ael[1]) % 3 == 1
            chiB = zeta((int(eB[c]) + eBn) % 6, 6); chi4 = zeta((int(e4[c]) + e4n) % 6, 6)
            Gam = (1 + I4[(-Ael[1]) % 4] + I4[Ael[0] % 4] + I4[(Ael[1] - Ael[0]) % 4]) / 2
            G = chi4.conjugate() * Gam
            coef = g2c * al_A.conjugate() * xiA.conjugate() * chiB.conjugate() * G.conjugate() * V / (arb(int(Nk[c])).sqrt() * q)
            maxrad = max(maxrad, float(coef.real.rad()), float(coef.imag.rad()))
            A_c.append(c); A_coef.append(coef); A_cls.append(P6.SQT[(Ael[0] % 4, Ael[1] % 4)]); A_nfac.append(nfac)
            A_sign.append([int(sg[w][c]) * int(wn[w]) for w in wi])
    nA = len(A_c)
    assert maxrad < 2.0 ** (-SCALE - 2)
    sc = arb(2) ** SCALE
    def imid(v):
        f = (v * sc).mid().floor().unique_fmpz()
        assert f is not None
        return int(f)
    cre = np.array([imid(z.real) for z in A_coef], dtype=np.int64)
    cim = np.array([imid(z.imag) for z in A_coef], dtype=np.int64)
    # |coef * 2^44 - integer| <= 1 + radius * 2^44 < 2 = 2^-43 * 2^44 per component
    A_c = np.array(A_c); A_cls = np.array(A_cls, dtype=np.int64); A_sign = np.array(A_sign, dtype=np.int64)
    LIMB = 1 << 22
    assert np.abs(cre).max() < (1 << 46) and np.abs(cim).max() < (1 << 46)
    def limbs(v):
        lo = v % LIMB; hi = (v - lo) // LIMB
        return hi.astype(np.float64), lo.astype(np.float64)       # |hi| < 2^24, 0 <= lo < 2^22; sums over < 2^20 terms exact
    assert nA < (1 << 20)
    limb = {}
    for j, w in enumerate(wi):
        limb[w] = [limbs(cre * A_sign[:, j]), limbs(cim * A_sign[:, j])]
    # n-part exponent data: 3 * sum e * k_p(m); stored as sparse lists
    has_n = np.array([len(f) > 0 for f in A_nfac])
    print(f"Z = {Z}: indices {nA} (n != 1: {int(has_n.sum())}), s-values {len(slist)}, rows N(m) in [{Mmin}, {Mmax}], max coefficient radius {maxrad:.2e}; setup {time.time() - t0:.1f}s", flush=True)
    # ---- rows
    sp = ~pinert; pS = pp[sp].astype(np.int64); wS = pw[sp].astype(np.int64); eS = (pS - 1) // 6
    zS = (1 + wS) % pS
    zpow = np.empty((6, len(pS)), dtype=np.int64); cur = np.ones_like(pS)
    for t in range(6):
        zpow[t] = cur; cur = (cur * zS) % pS
    inert_idx = np.flatnonzero(pinert)
    z6 = [zeta(k, 6) for k in range(6)]
    RS = P6.RS
    tot = {w: acb(0) for w in wi}; NB2 = {w: [arb(0)] * 4 for w in wi}; Na2 = [arb(0)] * 4
    B = int(math.sqrt(4 * Mmax / 3.0)) + 3
    nrows = 0
    w0cache = {}
    for x in range(-B, B + 1):
        for y in range(-B, B + 1):
            nm = x * x - x * y + y * y
            if nm < Mmin or nm > Mmax or nm % 2 == 0 or nm % 3 == 0: continue
            # A side
            av = [acb(0)] * 4; any_a = False
            for S in sinfo:
                key = (nm, S['q'])
                if key not in w0cache:
                    w0cache[key] = arb_bump(arb(nm) / (12 * S['q'] * Xs), W0lo, W0hi)
                wv = w0cache[key]
                if wv == 0: continue
                q = S['q']
                # -m d conj(s) / q: y-coordinate mod q
                mm = (-x, -y)
                kk = P6.zmul(mm, S['cs']); kk = (kk[0] % q, kk[1] % q)
                if kk not in S['cache']:
                    g = acb(0)
                    for dd, e in zip(S['res'], S['chi']):
                        if e < 0: continue
                        yy = (kk[0] * dd[1] + kk[1] * dd[0] - kk[1] * dd[1]) % q
                        g += S['roots'][(e * q + 6 * yy) % (6 * q)]
                    S['cache'][kk] = g
                av[S['cls']] = av[S['cls']] + S['pref'] * S['cache'][kk] * wv
                any_a = True
            for s_ in range(4): Na2[s_] = Na2[s_] + abs(av[s_]) ** 2
            # symbols of m at all table primes
            r = (x % pS + (y % pS) * wS) % pS
            val = P6._vpow(r, eS, pS).astype(np.int64)
            kS = np.full(len(pS), -1, dtype=np.int64)
            for t in range(6): kS[val == zpow[t]] = t
            kS[r == 0] = -100
            kp = np.empty(npr, dtype=np.int64); kp[sp] = kS
            for i_ in inert_idx:
                c_ = P6.inert_chi(int(pp[i_]), (x, y)); kp[i_] = -100 if c_ is None else c_
            assert (kp != -1).all()
            e = np.zeros(nn, dtype=np.int64)
            for lev in levels:
                e[lev] = e[parent[lev]] + kp[last[lev]]
            eA = e[A_c].copy()
            for i_ in np.flatnonzero(has_n):
                eA[i_] += sum(3 * ee * int(kp[k]) for k, ee in A_nfac[i_])
            ok = eA >= 0
            bins = (A_cls * 6 + (eA % 6))[ok]
            cnt = np.bincount(bins, minlength=24)
            xi = (1 if (x + y) % 3 == 1 else -1) * zeta(int(P6.xi2_exp(x, y)), 3)
            for w in wi:
                (rh, rl), (ih, il) = limb[w]
                sre = np.bincount(bins, weights=rh[ok], minlength=24).astype(np.int64) * LIMB + np.bincount(bins, weights=rl[ok], minlength=24).astype(np.int64)
                sim = np.bincount(bins, weights=ih[ok], minlength=24).astype(np.int64) * LIMB + np.bincount(bins, weights=il[ok], minlength=24).astype(np.int64)
                BC = []
                for cl in range(4):
                    t = acb(0)
                    for k in range(6):
                        j = cl * 6 + k
                        if cnt[j] == 0: continue
                        rd_ = float(cnt[j]) * 2.0 ** (-(SCALE - 1))          # exact in float64
                        v = acb(arb(int(sre[j])) / sc + arb(0, rd_), arb(int(sim[j])) / sc + arb(0, rd_))
                        t += z6[k] * v
                    BC.append(t)
                rowsum = acb(0)
                for s_ in range(4):
                    b = acb(0)
                    for cl in range(4): b += int(RS[cl][s_]) * BC[cl]
                    NB2[w][s_] = NB2[w][s_] + abs(b) ** 2
                    rowsum += av[s_] * b
                tot[w] = tot[w] + xi * rowsum
            nrows += 1
    out = {'Z': Z, 'rows': nrows, 'Mmin': Mmin, 'Mmax': Mmax, 'indices': nA, 'prec_bits': ctx.prec, 'weights': {}}
    def ball(z): return {'mid': float(z.mid()), 'rad': float(z.rad())}
    out['Na2'] = [ball(v) for v in Na2]
    for w in wi:
        out['weights'][P6.WEIGHTS[w]] = {'I_re': ball(tot[w].real), 'I_im': ball(tot[w].imag), 'NB2': [ball(v) for v in NB2[w]]}
        print(f"  {P6.WEIGHTS[w]:5s} I = [{tot[w].real.str(12)}] + [{tot[w].imag.str(12)}] i   sum NB2 = {sum(NB2[w], arb(0)).str(12)}", flush=True)
    print(f"  Na2 = {[v.str(10) for v in Na2]}; rows {nrows}; {time.time() - t0:.1f}s", flush=True)
    json.dump(out, open(a.out, 'w'), indent=1)

if __name__ == '__main__':
    main()
