"""prep6.py -- input for probe.c: the probe I_w(X, Y, Z) of manuscript display (6.1) at X = Y = Z^(1/2).

Conventions (paper.txt Sections 4.1, 4.2, 6.1; S = {2, lambda}, P_0 = 4):
  b* = 2 lambda = 2 + 4w (norm 12).  xi = xi_2 xi_lambda mod b*: xi_2 the cubic character of (O/2)^x with xi_2(w) = e(1/3),
  xi_lambda the quadratic character of (O/lambda)^x.  tau = 12^(-1/2) sum_{d mod b*} xi(d) e(d/b*).
  Row index A = c n^3 (c squarefree, c and n primary, coprime to 6).  Completed row (Mellin integral of T_{m,s,w}):
      B_{m,s}(Z) = sum_{c,n} gamma_2(c) conj(alpha(A)) w(A) conj(xi(A)) conj(chi_A(b*)) R(A, s) chi_A(m) conj(G(A))
                             q_c^(-1/2) q_n^(-1) V(q_A / Z),
  G(A) = conj(chi_A(4)) Gamma(A)  (so that gamma_1 gamma_2 = mu alpha G, checked below),  V(y) = V_G(y) * taper,
  V_G(y) = exp(-(log y)^2/4)/(2 sqrt pi)  (inverse Mellin transform of Phi(t) = e^{t^2}).
  The text file prints alpha and G without bars; the bars are forced by the cancellation described in Section 7.2 and are
  selected here by the variant flags (default 'bar','bar'); the other variants are controls.
  Probe:  I_w = (1/Y) sum_s W1(q_s/Y) chi_s(b*) / (tau xi(s) sqrt(12 q_s X))
                 sum_m xi(m) q_s^(-1/2) g_{chi_s}(s, -m) W0(q_m/(12 q_s X)) B_{m,s}(Z).
  Stored per s: TA_s[k] = (1/Y) W1(q_s/Y) chi_s(b*) conj(xi(s)) / (tau sqrt(12 X)) q_s^(-1) g_{chi_s}(s, k), k mod s,
  so that I_w = sum_m xi(m) sum_s TA_s[-m] W0(q_m/(12 q_s X)) B_{m,s}.
  B depends on s through R(A, s) only, i.e. through the square class of s mod 4 (4 classes sigma).
Signal (Lemma 7.1 at u = 1, w = 1, z = 1/6;  (10.1)):
      f_w(Z) = kappa0 Z^(1/6) sum_{c sf, d} prod_{p | cd}(1 - 1/q_p) mu(c) w(c d^6) conj(alpha(d))^6 q_c^(-5/6) q_d^(-2) V(q_c q_d^6/Z),
      kappa0 = prod_{p not in S}(1 - q_p^-2),   c_S = W1^(1) M(1/6) (Res zeta_F^S)^2 / 6.
Usage: python prep6.py table.npz Z out.bin [--u0 3.5 --u1 4.0] [--valpha bar|plain] [--vG bar|plain]
"""
import sys, os, math, json, argparse
import numpy as np

WEIGHTS = ['one', 'liou', 't95a', 't95b', 't95c', 'g95', 't99', 't97', 't90', 'd50a', 'd50b', 'nm50', 'iid', 'd75']
NW = len(WEIGHTS)
SQ3 = math.sqrt(3.0)
Z6 = np.exp(1j * np.pi * np.arange(6) / 3.0)
W1_SUPP = (1.0, 2.0)
W0_SUPP = (1.0, 1.25)

def splitmix(x, salt):
    z = (x.astype(np.uint64) + np.uint64(0x9E3779B97F4A7C15) * np.uint64(salt + 1)) & np.uint64(0xFFFFFFFFFFFFFFFF)
    z = (z ^ (z >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
    z = (z ^ (z >> np.uint64(27))) * np.uint64(0x94D049BB133111EB)
    z = z ^ (z >> np.uint64(31))
    return (z >> np.uint64(11)).astype(np.float64) / float(1 << 53)

def bump(r, lo, hi):
    """exp(1 - 1/(1 - t^2)), t = (2r - lo - hi)/(hi - lo), on lo < r < hi; 0 outside."""
    r = np.asarray(r, dtype=float)
    t = (2.0 * r - lo - hi) / (hi - lo)
    out = np.zeros_like(r)
    ins = np.abs(t) < 1
    out[ins] = np.exp(1.0 - 1.0 / (1.0 - t[ins] ** 2))
    return out

def Vtest(u, u0, u1):
    u = np.asarray(u, dtype=float)
    v = np.exp(-u * u / 4.0) / (2.0 * math.sqrt(math.pi))
    x = (u - u0) / (u1 - u0)
    t = np.ones_like(u)
    mid = (x > 0) & (x < 1)
    xm = x[mid]
    f1 = np.exp(-1.0 / (1.0 - xm)); f0 = np.exp(-1.0 / xm)
    t[mid] = f1 / (f0 + f1)
    t[x >= 1] = 0.0
    return v * t

# ------------------------------------------------------------------ O = Z[w]
def zmul(x, y):
    a, b = x; c, d = y
    return (a * c - b * d, a * d + b * c - b * d)
def znorm(x):
    return x[0] * x[0] - x[0] * x[1] + x[1] * x[1]
def zconj(x):
    return (x[0] - x[1], -x[1])
def to_c(x):
    return complex(x[0] - x[1] / 2.0, x[1] * SQ3 / 2.0)

def sqclass_tab():
    reps = {(1, 0): (0, 0), (-1, 0): (1, 0), (1, 2): (0, 1), (-1, -2): (1, 1)}
    tab = {}
    for rep, ef in reps.items():
        for sq in [(1, 0), (0, 1), (-1, -1)]:
            c = zmul(rep, sq)
            tab[(c[0] % 4, c[1] % 4)] = ef[0] + 2 * ef[1]
    assert len(tab) == 12
    return tab
SQT = sqclass_tab()
SQARR = np.full((4, 4), -1, dtype=np.int8)
for (a_, b_), v_ in SQT.items(): SQARR[a_, b_] = v_

def rsign(c1, c2):
    """r of (4.4) on class indices e + 2f."""
    e, f = c1 & 1, c1 >> 1; g, h = c2 & 1, c2 >> 1
    return -1 if (e * h + f * g + f * h) % 2 else 1
RS = np.array([[rsign(i, j) for j in range(4)] for i in range(4)], dtype=np.int8)

def Gamma4(a, b):
    a = np.asarray(a); b = np.asarray(b)
    I4 = np.array([1, 1j, -1, -1j])
    return (1 + I4[(-b) % 4] + I4[a % 4] + I4[(b - a) % 4]) / 2

def xi2_exp(a, b):
    """exponent k (xi_2 = e(k/3)) of the cubic character of (O/2)^x at a + b w (odd norm)."""
    a = np.asarray(a) % 2; b = np.asarray(b) % 2
    return np.where(b == 0, 0, np.where(a == 0, 1, 2))

def xi_val(a, b):
    """xi(a + b w) for a + b w coprime to 6 (0 otherwise)."""
    a = np.asarray(a); b = np.asarray(b)
    n = a * a - a * b + b * b
    ok = (n % 2 == 1) & (n % 3 != 0)
    s3 = (a + b) % 3
    ql = np.where(s3 == 1, 1.0, -1.0)
    return np.where(ok, ql * np.exp(2j * np.pi * xi2_exp(a, b) / 3.0), 0)

def tau_value():
    # residues mod b* = 2 lambda: lattice b* O; use CRT representatives x + y w, 0 <= x < 12 restricted to a system: O/(2 lambda) has 12 elements
    # HNF of (2,4): generated by (2,4) and (2,4)*w = (-4,-2): lattice {(2,4),(-4,-2)} -> index 12
    reps = hnf_residues((2, 4))
    bc = to_c((2, 4)); s = 0j
    for (x, y) in reps:
        v = xi_val(x, y)
        s += complex(v) * np.exp(4j * np.pi * (to_c((x, y)) / bc).imag / SQ3)
    return s / math.sqrt(12.0)

def hnf(n):
    """lattice nO in coordinates (x, y) of x + y w: basis (g, 0), (r, h), g h = N(n), 0 <= r < g."""
    a, b = n
    x0, y0 = [a, b], [-b, a - b]
    while y0[1] != 0:
        qt = x0[1] // y0[1]
        x0, y0 = y0, [x0[0] - qt * y0[0], x0[1] - qt * y0[1]]
    h = abs(x0[1]); g = abs(y0[0])
    r = x0[0] if x0[1] > 0 else -x0[0]
    assert g * h == znorm(n)
    return g, r % g, h

def hnf_residues(n):
    g, r, h = hnf(n)
    return [(x, y) for y in range(h) for x in range(g)]        # index = y * g + x

# ------------------------------------------------------------------ symbols at table primes
def _vpow(base, exp, mod):
    base = base.astype(np.uint64) % mod.astype(np.uint64)
    exp = exp.astype(np.uint64).copy(); mod = mod.astype(np.uint64)
    res = np.ones_like(base)
    while np.any(exp):
        odd = (exp & np.uint64(1)).astype(bool)
        res = np.where(odd, (res * base) % mod, res)
        base = (base * base) % mod
        exp >>= np.uint64(1)
    return res

def inert_chi(q, x):
    """sextic exponent of x mod the inert prime q (norm q^2); None if q | x."""
    r = (x[0] % q, x[1] % q)
    if r == (0, 0): return None
    res = (1, 0); base = r; e = (q * q - 1) // 6
    while e:
        if e & 1:
            res = zmul(res, base); res = (res[0] % q, res[1] % q)
        base = zmul(base, base); base = (base[0] % q, base[1] % q)
        e >>= 1
    cur = (1, 0)
    for k in range(6):
        if cur == res: return k
        cur = zmul(cur, (1, 1)); cur = (cur[0] % q, cur[1] % q)
    raise ArithmeticError

def chi_primes(pp, pw, pinert, y):
    """exponent of chi_pi(y) at every table prime (-1 if pi | y)."""
    ya, yb = int(y[0]), int(y[1])
    k = np.full(len(pp), -1, dtype=np.int8)
    sp = ~pinert
    p = pp[sp].astype(np.int64); w = pw[sp]
    r = (ya % p + (yb % p) * w) % p
    nz = r != 0
    val = _vpow(r[nz], (p[nz] - 1) // 6, p[nz]).astype(np.int64)
    z = (1 + w[nz]) % p[nz]
    cur = np.ones_like(z); kk = np.full(len(z), -1, dtype=np.int8)
    for t in range(6):
        kk[val == cur] = t
        cur = (cur * z) % p[nz]
    assert (kk >= 0).all()
    tmp = np.full(int(sp.sum()), -1, dtype=np.int8); tmp[nz] = kk; k[sp] = tmp
    for idx in np.flatnonzero(pinert):
        c = inert_chi(int(pp[idx]), (ya, yb)); k[idx] = -1 if c is None else c
    return k

def prime_chi_scalar(k, pa, pb, pp, pw, pinert, x):
    """sextic exponent of x at table prime k (python ints); None if divisible."""
    if pinert[k]:
        return inert_chi(int(pp[k]), x)
    p = int(pp[k]); w = int(pw[k])
    r = (x[0] + x[1] * w) % p
    if r == 0: return None
    v = pow(r, (p - 1) // 6, p); z = (1 + w) % p; cur = 1
    for t in range(6):
        if v == cur: return t
        cur = cur * z % p
    raise ArithmeticError

# ------------------------------------------------------------------ weights
def thin_greedy(p1, b):
    from scipy.special import expi
    L = 0.5 * (expi(b * np.log(p1.astype(float))) - expi(b * math.log(2.0)))
    fl = np.floor(L).astype(np.int64)
    n = np.arange(1, len(p1) + 1)
    c = n + np.minimum(0, np.minimum.accumulate(fl - n))
    return np.diff(np.concatenate([[0], c])) == 1

def prime_signs(pa, pb, pp, pinert):
    npr = len(pp)
    s = np.ones((NW, npr), dtype=np.int8)
    split = ~pinert
    up = pb > 0
    p1 = np.unique(pp[split])
    pos = np.minimum(np.searchsorted(p1, pp), len(p1) - 1)
    for name, b, salt in (('t95a', 0.95, 11), ('t95b', 0.95, 12), ('t95c', 0.95, 14), ('t99', 0.99, 15), ('t97', 0.97, 16), ('t90', 0.90, 13)):
        inS = splitmix(p1, salt) < p1.astype(float) ** (b - 1.0)
        side = splitmix(p1, salt + 100) < 0.5
        s[WEIGHTS.index(name), split & inS[pos] & (up == side[pos])] = -1
    try:
        mem = thin_greedy(p1, 0.95)
        s[WEIGHTS.index('g95'), split & up & mem[pos]] = -1
    except ImportError:
        print("scipy missing: g95 set to the weight 1", flush=True)
    s[WEIGHTS.index('liou'), :] = -1
    key = pp.astype(np.int64) * 4 + up.astype(np.int64) * 2 + pinert.astype(np.int64)
    s[WEIGHTS.index('d75'), splitmix(key, 21) < 0.75] = -1
    s[WEIGHTS.index('d50a'), splitmix(key, 22) < 0.50] = -1
    s[WEIGHTS.index('d50b'), splitmix(key, 23) < 0.50] = -1
    # for nm50 the multiplicative part is Liouville (node-level mixing below)
    s[WEIGHTS.index('nm50'), :] = -1
    return s

def node_key(na, nb):
    return (na.astype(np.int64) + 8000) * 32003 + (nb.astype(np.int64) + 8000)

def node_signs(ps, parent, last, depth, na, nb):
    nn = len(parent)
    sg = np.ones((NW, nn), dtype=np.int8)
    for L in range(1, int(depth.max()) + 1):
        lev = np.flatnonzero(depth == L)
        sg[:, lev] = sg[:, parent[lev]] * ps[:, last[lev]]
    key = node_key(na, nb)
    sg[WEIGHTS.index('iid')] = np.where(splitmix(key, 31) < 0.5, -1, 1)
    half = splitmix(key, 51) < 0.5
    rnd = np.where(splitmix(key, 52) < 0.5, -1, 1).astype(np.int8)
    i = WEIGHTS.index('nm50')
    sg[i] = np.where(half, sg[i], rnd)
    return sg

def n_signs(ps, fac):
    """weight of n^3 (n given by its prime factorisation [(k, e)]) for every weight; non-multiplicative weights: see header."""
    ws = np.ones(NW, dtype=np.int8)
    for k, e in fac:
        if e % 2: ws *= ps[:, k]
    ws[WEIGHTS.index('iid')] = 1
    return ws

def factor_primary(x, small):
    """factor a primary element coprime to 6 over the list small = [(k, (a, b), q)] of table primes; returns [(k, e)]."""
    rem = x; fac = []
    for k, pi, q in small:
        if znorm(rem) == 1: break
        e = 0
        while znorm(rem) % q == 0:
            num = zmul(rem, zconj(pi))
            if num[0] % q == 0 and num[1] % q == 0:
                rem = (num[0] // q, num[1] // q); e += 1
            else:
                break
        if e: fac.append((k, e))
    assert rem == (1, 0), (x, rem, fac)
    return fac

def primary_list(qlo, qhi):
    """primary elements coprime to 6 with qlo <= norm <= qhi, sorted by (norm, a, b)."""
    out = []
    B = int(math.sqrt(4 * qhi / 3.0)) + 4
    for a in range(-B, B + 1):
        if a % 3 != 1: continue
        for b in range(-B, B + 1):
            if b % 3 != 0: continue
            q = a * a - a * b + b * b
            if q < qlo or q > qhi or q % 2 == 0: continue
            out.append((q, a, b))
    out.sort()
    return out

def cS_value():
    from math import gamma, pi
    r = np.linspace(W0_SUPP[0], W0_SUPP[1], 200001)
    f = bump(r, *W0_SUPP) * r ** (-1.0 / 6.0)
    int0 = float(((f[1:] + f[:-1]) / 2 * np.diff(r)).sum())
    M16 = gamma(1 / 6) / gamma(5 / 6) * (4 * pi * pi / 3) ** (-1 / 6) * (2 * pi / SQ3) * int0
    r = np.linspace(W1_SUPP[0], W1_SUPP[1], 200001)
    f = bump(r, *W1_SUPP)
    W1h = float(((f[1:] + f[:-1]) / 2 * np.diff(r)).sum())
    res = pi / (3 * SQ3) * (2 / 3) * (3 / 4)
    return W1h * M16 * res * res / 6.0, {'W1hat1': W1h, 'M16': M16, 'int_W0_r^-1/6': int0, 'res_zetaS': res}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('table'); ap.add_argument('Z', type=float); ap.add_argument('out')
    ap.add_argument('--u0', type=float, default=3.5); ap.add_argument('--u1', type=float, default=4.0)
    ap.add_argument('--valpha', default='bar'); ap.add_argument('--vG', default='bar')
    ap.add_argument('--dump', default=None, help='npz with node-level data for the independent checks')
    a = ap.parse_args()
    Z = int(a.Z); u0, u1 = a.u0, a.u1
    X = Y = math.sqrt(Z)
    Xmax = int(math.floor(Z * math.exp(u1)))
    d = np.load(a.table)
    assert Xmax <= int(d['X']), (Xmax, int(d['X']))
    N = d['N']
    keep = np.flatnonzero(N <= Xmax); nn = len(keep)
    print(f"Z = {Z}, taper [{u0}, {u1}], Xmax = {Xmax}, nodes {nn}; planned arrays < {nn * 90 / 1e9:.2f} GB", flush=True)
    remap = np.full(len(N), -1, dtype=np.int64); remap[keep] = np.arange(nn)
    na = d['na'][keep]; nb = d['nb'][keep]; Nk = N[keep]
    parent = remap[np.maximum(d['parent'][keep], 0)].astype(np.int32); parent[0] = -1
    assert (parent[1:] >= 0).all() and (parent[1:] < np.arange(1, nn)).all()
    pq = d['pq']; npr = int((pq <= Xmax).sum())
    assert (np.flatnonzero(pq <= Xmax) == np.arange(npr)).all()
    last = d['last'][keep].astype(np.int32)
    assert nn == 1 or last[1:].max() < npr
    pa = d['pa'][:npr]; pb = d['pb'][:npr]; pp = d['pp'][:npr]; pinert = d['pinert'][:npr]; pw = d['pw'][:npr].copy()
    pqn = pq[:npr]
    pwc = pw.copy(); pwc[pinert] = -1
    g1 = d['g1'][keep]; g2 = d['g2'][keep]; g3 = d['g3'][keep]; depth = d['depth'][keep]
    mu = np.where(depth % 2 == 0, 1.0, -1.0)
    alpha = (na - nb / 2.0 + 1j * nb * SQ3 / 2.0) / np.sqrt(Nk)
    levels = [np.flatnonzero(depth == L) for L in range(1, int(depth.max()) + 1)] if nn > 1 else []

    def node_exp(kp):
        e = np.zeros(nn, dtype=np.int16)
        for lev in levels:
            e[lev] = (e[parent[lev]] + kp[last[lev]]) % 6
        return e
    kB = chi_primes(pp, pwc, pinert, (2, 4)); k4 = chi_primes(pp, pwc, pinert, (4, 0))
    assert (kB >= 0).all() and (k4 >= 0).all()
    eB = node_exp(kB); e4 = node_exp(k4)
    Gm4 = Gamma4(na, nb)
    Gdef = np.conj(Z6[e4]) * Gm4                           # G(c) = conj(chi_c(4)) Gamma(c)
    # checks of (4.7) on the table
    err47a = np.abs(g2 ** 3 - mu * alpha).max()
    err47b = np.abs(g1 * g2 - mu * alpha * Gdef).max()
    err47c = np.abs(Gdef - np.conj(Z6[e4]) * g3).max()
    print(f"(4.7) checks: |g2^3 - mu alpha| {err47a:.2e}; |g1 g2 - mu alpha G| {err47b:.2e}; |Gamma - g3| {err47c:.2e}", flush=True)
    assert err47a < 1e-6 and err47b < 1e-6 and err47c < 1e-6
    cls = SQARR[na % 4, nb % 4].astype(np.int8); assert (cls >= 0).all()
    xiA = np.exp(2j * np.pi * xi2_exp(na, nb) / 3.0)      # xi(c) (xi_lambda(c) = 1 for primary c)
    aphase = np.conj(alpha) if a.valpha == 'bar' else alpha
    Gph = np.conj(Gdef) if a.vG == 'bar' else Gdef
    base = g2 * aphase * np.conj(xiA) * np.conj(Z6[eB]) * Gph / np.sqrt(Nk)
    ps = prime_signs(pa, pb, pp, pinert)
    sg = node_signs(ps, parent, last, depth, na, nb)
    neg = sg < 0
    patA = np.zeros(nn, dtype=np.uint8); patB = np.zeros(nn, dtype=np.uint8)
    for w in range(NW):
        if w < 7: patA |= (neg[w].astype(np.uint8) << w)
        else: patB |= (neg[w].astype(np.uint8) << (w - 7))
    u1n = np.log(Nk / Z)
    bv = base * Vtest(u1n, u0, u1)
    # ---- n != 1 terms
    qmax = int(math.floor(Xmax ** (1.0 / 3.0) + 1e-9))
    nlist = [t for t in primary_list(2, qmax) if t[0] ** 3 <= Xmax]
    small = [(k, (int(pa[k]), int(pb[k])), int(pqn[k])) for k in range(npr) if pqn[k] <= max(qmax, int(2 * Y) + 2)]
    ncoef = []; nws = []; ncls = []; facptr = [0]; facprime = []; facexp = []; listptr = [0]; listidx = []; listbv = []
    for q, x, y in nlist:
        fac = factor_primary((x, y), small)
        al = to_c((x, y)) / math.sqrt(q)
        al3 = (np.conj(al) if a.valpha == 'bar' else al) ** 3
        eBn = (3 * sum(e * int(kB[k]) for k, e in fac)) % 6
        Gn = complex(Gamma4(x, y))                         # G(n^3) = Gamma(n) (chi_n(4)^3 = 1)
        if a.vG == 'bar': Gn = Gn.conjugate()
        # xi(n)^3 = 1
        ncoef.append(al3 * np.conj(Z6[eBn]) * Gn / q)
        nws.append(n_signs(ps, fac)); ncls.append(SQT[(x % 4, y % 4)])
        for k, e in fac:
            facprime.append(k); facexp.append(e)
        facptr.append(len(facprime))
        idx = np.flatnonzero(Nk * (q ** 3) <= Xmax)
        vv = base[idx] * Vtest(np.log(Nk[idx] * float(q ** 3) / Z), u0, u1)
        nzv = np.abs(vv) > 0
        listidx.append(idx[nzv].astype(np.int32)); listbv.append(vv[nzv])
        listptr.append(listptr[-1] + int(nzv.sum()))
    nterm = len(nlist)
    # ---- s list and Gauss tables
    tau = tau_value()
    assert abs(abs(tau) - 1) < 1e-12
    slist = [t for t in primary_list(int(math.floor(W1_SUPP[0] * Y)), int(math.ceil(W1_SUPP[1] * Y)))
             if W1_SUPP[0] < t[0] / Y < W1_SUPP[1]]
    sdat = []; TA = []; off = 0
    for q, x, y in slist:
        fac = factor_primary((x, y), small) if q > 1 else []
        g, r, h = hnf((x, y))
        res = [(xx, yy) for yy in range(h) for xx in range(g)]
        chi = np.zeros(q, dtype=np.complex128)
        for i, dd in enumerate(res):
            tot = 0; ok = True
            for k, e in fac:
                kk = prime_chi_scalar(k, pa, pb, pp, pw, pinert, dd)
                if kk is None: ok = False; break
                tot += e * kk
            if ok: chi[i] = Z6[tot % 6]
        # e(k d / s) = exp(2 pi i y(k d conj(s)) / q)
        rx = np.array([t[0] for t in res], dtype=np.int64); ry = np.array([t[1] for t in res], dtype=np.int64)
        cs = zconj((x, y))
        # d * conj(s)
        dx = rx * cs[0] - ry * cs[1]; dy = rx * cs[1] + ry * cs[0] - ry * cs[1]
        dx %= q; dy %= q
        # (k * dcs).y = kx*dy + ky*dx - ky*dy
        ph = (np.outer(rx, dy) + np.outer(ry, (dx - dy) % q)) % q
        gs = (np.exp(2j * np.pi * ph / q) * chi[None, :]).sum(axis=1)
        chis_b = Z6[sum(e * int(kB[k]) for k, e in fac) % 6]
        xis = complex(xi_val(x, y))
        pref = (1.0 / Y) * float(bump(q / Y, *W1_SUPP)) * chis_b * np.conj(xis) / (tau * math.sqrt(12.0 * X)) / q
        TA.append(pref * gs)
        sdat.append((x, y, q, g, r, h, SQT[(x % 4, y % 4)], off)); off += q
    ns = len(slist)
    TA = np.concatenate(TA) if ns else np.zeros(0, complex)
    qs_min = min(t[0] for t in slist); qs_max = max(t[0] for t in slist)
    Mmin = int(math.floor(12.0 * X * qs_min * W0_SUPP[0])); Mmax = int(math.ceil(12.0 * X * qs_max * W0_SUPP[1]))
    print(f"n-terms {nterm} (list entries {listptr[-1]}), s-values {ns} (table entries {off}), rows q_m in [{Mmin}, {Mmax}]", flush=True)
    with open(a.out, 'wb') as f:
        np.array([0x50364336, Z, npr, nn, NW, nterm, listptr[-1], len(facprime), ns, off, Mmin, Mmax], dtype=np.int64).tofile(f)
        np.array([X, Y, W0_SUPP[0], W0_SUPP[1]], dtype=np.float64).tofile(f)
        pp.astype(np.int64).tofile(f); pwc.astype(np.int64).tofile(f)
        parent.tofile(f); last.tofile(f); bv.astype(np.complex128).tofile(f); patA.tofile(f); patB.tofile(f); cls.astype(np.uint8).tofile(f)
        np.array(ncoef, dtype=np.complex128).tofile(f)
        (np.array(nws, dtype=np.int8).reshape(nterm, NW) if nterm else np.zeros((0, NW), np.int8)).tofile(f)
        np.array(ncls, dtype=np.int32).tofile(f)
        np.array(facptr, dtype=np.int32).tofile(f); np.array(facprime, dtype=np.int32).tofile(f); np.array(facexp, dtype=np.int32).tofile(f)
        np.array(listptr, dtype=np.int64).tofile(f)
        (np.concatenate(listidx) if nterm else np.zeros(0, np.int32)).astype(np.int32).tofile(f)
        (np.concatenate(listbv) if nterm else np.zeros(0, np.complex128)).astype(np.complex128).tofile(f)
        np.array([t[:8] for t in sdat], dtype=np.int64).reshape(ns, 8).tofile(f)
        TA.astype(np.complex128).tofile(f)
    # ---- signal f_w and Mertens-type sums
    phi = np.ones(nn)
    for lev in levels:
        phi[lev] = phi[parent[lev]] * (1.0 - 1.0 / pqn[last[lev]])
    cS, cparts = cS_value()
    kappa0 = 1.0 / (1.6449340668482264 * 0.7813024128964862 * (1 - 1 / 9.0) * (1 - 1 / 16.0))
    V1 = Vtest(u1n, u0, u1)
    S = np.array([(mu * sg[w] * phi * Nk ** (-5.0 / 6.0) * V1).sum() for w in range(NW)], dtype=complex)
    S_d1 = S.copy()
    qd6max = Xmax
    dk = [k for k in range(npr) if float(pqn[k]) ** 6 <= qd6max]
    assert Xmax < 49.0 ** 6                                                # d ranges over primes only (no products in range)
    for k in dk:
        qd = float(pqn[k]); ald = to_c((int(pa[k]), int(pb[k]))) / math.sqrt(qd)
        div = np.zeros(nn, dtype=bool)
        for lev in levels:
            div[lev] = div[parent[lev]] | (last[lev] == k)
        ph = np.where(div, phi, phi * (1 - 1 / qd))
        sel = Nk * qd ** 6 <= Xmax
        Vd = Vtest(np.log(Nk[sel] * qd ** 6 / Z), u0, u1)
        cf = (np.conj(ald) ** 6 if a.valpha == 'bar' else ald ** 6) * qd ** (-2.0)
        for w in range(NW):
            S[w] += cf * (mu[sel] * sg[w][sel] * ph[sel] * Nk[sel] ** (-5.0 / 6.0) * Vd).sum()
    fsig = kappa0 * Z ** (1.0 / 6.0) * S
    # ---- principal row, residue at w = 1 only, exact sum over the sixth-power frequencies H = a^6 (Section 7.1 with u = 1):
    #      P_w = W1^(1) rho_S X^(1/2) sum_{A, a} c_w(A, a) q_A^(-1) V(q_A/Z) W0~(X q_a^6/q_A)
    from scipy.special import j0
    rr = np.linspace(W0_SUPP[0], W0_SUPP[1], 2001); wr = bump(rr, *W0_SUPP); dr = rr[1] - rr[0]
    sgrid = np.linspace(0.0, 60.0, 30001)
    W0t = np.empty(len(sgrid))
    for i0 in range(0, len(sgrid), 2000):
        sl = sgrid[i0:i0 + 2000]
        J = j0(4 * math.pi * np.outer(sl, np.sqrt(rr)) / SQ3) * wr[None, :]
        W0t[i0:i0 + 2000] = (2 * math.pi / SQ3) * (J[:, 1:] + J[:, :-1]).sum(axis=1) * dr / 2
    def W0tilde(t):
        s = np.sqrt(np.asarray(t, dtype=float))
        return np.where(s < sgrid[-1], np.interp(s, sgrid, W0t), 0.0)
    tail_W0t = float(np.abs(W0t[-3000:]).max())
    amax = int(min(2000, max(50.0, (3600.0 * Xmax / X) ** (1.0 / 6.0) + 1)))     # sqrt(X q_a^6/q_A) > 60 beyond
    alist = [(1, 1, 0)] + primary_list(2, amax)
    smallP = [(k, (int(pa[k]), int(pb[k])), int(pqn[k])) for k in range(npr) if pqn[k] <= amax]
    Pw = np.zeros(NW, dtype=complex)
    base_c = mu * phi / Nk
    divk = {}
    for k in dk:
        div = np.zeros(nn, dtype=bool)
        for lev in levels:
            div[lev] = div[parent[lev]] | (last[lev] == k)
        divk[k] = div
    for qa, ax, ay in alist:
        fa = factor_primary((ax, ay), smallP) if qa > 1 else []
        phia = 1.0
        for k, e in fa: phia *= (1.0 - 1.0 / float(pqn[k]))
        Wt = W0tilde(X * float(qa) ** 6 / Nk)
        common = phia * base_c * V1 * Wt
        for w in range(NW):
            Pw[w] += (common * sg[w]).sum()
        for k, e in fa:                                   # A = c pi^6 with pi | a
            if k not in divk: continue
            qd = float(pqn[k]); ald = to_c((int(pa[k]), int(pb[k]))) / math.sqrt(qd)
            a2 = (np.conj(ald) ** 6 if a.valpha == 'bar' else ald ** 6)
            sel = Nk * qd ** 6 <= Xmax
            extra = np.where(divk[k][sel], (1.0 / (1 - 1 / qd)) if e == 1 else 1.0, 1.0 if e == 1 else (1 - 1 / qd))
            term = phia * base_c[sel] * extra * a2 * qd ** (-2.0) * Vtest(np.log(Nk[sel] * qd ** 6 / Z), u0, u1) * W0tilde(X * float(qa) ** 6 / (Nk[sel] * qd ** 6))
            for w in range(NW):
                Pw[w] += (term * sg[w][sel]).sum()
    Pw *= cparts['W1hat1'] * cparts['res_zetaS'] * math.sqrt(X)
    mert = [(mu * sg[w] * V1 / np.sqrt(Nk)).sum() for w in range(NW)]
    side = {'Z': Z, 'X': X, 'Y': Y, 'u0': u0, 'u1': u1, 'valpha': a.valpha, 'vG': a.vG, 'Xmax': Xmax, 'nodes': int(nn), 'nprimes': int(npr),
            'nterms': nterm, 'ns': ns, 'Mmin': Mmin, 'Mmax': Mmax, 'tau': [tau.real, tau.imag], 'cS': cS, 'cS_parts': cparts, 'kappa0': kappa0,
            'weights': WEIGHTS, 'frac_neg': [float(neg[w].mean()) for w in range(NW)],
            'f': [[float(z.real), float(z.imag)] for z in fsig],
            'f_d1': [[float(z.real), float(z.imag)] for z in kappa0 * Z ** (1.0 / 6.0) * S_d1],
            'P': [[float(z.real), float(z.imag)] for z in Pw], 'W0tilde_tail': tail_W0t, 'amax': amax,
            'mertens': [float(m) for m in mert], 'W0_supp': W0_SUPP, 'W1_supp': W1_SUPP}
    json.dump(side, open(a.out + '.side.json', 'w'), indent=1)
    print("c_S = %.6g; c_S f_w: " % cS + ", ".join(f"{WEIGHTS[w]} {(cS * fsig[w]).real:+.5f}{(cS * fsig[w]).imag:+.5f}i" for w in range(NW)), flush=True)
    if a.dump:
        np.savez(a.dump, na=na, nb=nb, Nk=Nk, base=base, sg=sg, cls=cls, ps=ps, tau=tau, kB=kB)
    print(f"wrote {a.out}", flush=True)

if __name__ == '__main__':
    main()
