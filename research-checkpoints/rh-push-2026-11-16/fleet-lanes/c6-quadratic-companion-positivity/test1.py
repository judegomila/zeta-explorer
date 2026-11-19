# c6-quadratic-companion-positivity: first decisive test. n <= N = 10^4. Run through scripts/memcap.sh 8.
# Planned memory: a few arrays of length 10^4 of small Python objects (< 50 MB).
import json, sys, time, math
from fractions import Fraction
from mpmath import mp, mpf, mpc, iv
mp.dps = 50; iv.dps = 40
N = 10**4
out = {"N": N}
t0 = time.time()

# ---------- exact ring Z[kappa]/(minpoly) ----------
# kappa = (sqrt(10-2 sqrt5)-2)/(sqrt5-1); minimal polynomial x^4+2x^3-6x^2-2x+1 (derived by hand in RESULT.md;
# irreducible over Q: no rational root, and a factorisation into quadratics needs a, c roots of t^2-2t-4).
DEG = 4; MC = [1, 2, -6, -2, 1]
KAP = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
assert abs(KAP**4 + 2*KAP**3 - 6*KAP**2 - 2*KAP + 1) < mpf(10)**(-45)
out["kappa_minpoly"] = "x^4+2x^3-6x^2-2x+1"; out["kappa"] = float(KAP)
RED = [-c for c in MC[1:]][::-1]   # x^DEG = sum RED[i] x^i
def kmul(a, b):
    r = [0]*(2*DEG-1)
    for i, ai in enumerate(a):
        if ai:
            for j, bj in enumerate(b):
                if bj: r[i+j] += ai*bj
    for d in range(2*DEG-2, DEG-1, -1):
        c = r[d]
        if c:
            r[d] = 0
            for i in range(DEG): r[d-DEG+i] += c*RED[i]
    return tuple(r[:DEG])
def kadd(a, b): return tuple(u+v for u, v in zip(a, b))
ZERO = (0,)*DEG; ONE = (1,)+(0,)*(DEG-1); K = (0,1)+(0,)*(DEG-2)
def kval(a): return sum(mpf(c)*KAP**i for i, c in enumerate(a))
def ksign(a):
    if not any(a): return 0
    v = kval(a); assert abs(v) > mpf(10)**(-30), (a, v)
    return 1 if v > 0 else -1
NEG = lambda a: tuple(-u for u in a)
aDH = [ZERO]*(N+1)
for n in range(1, N+1):
    aDH[n] = {0: ZERO, 1: ONE, 2: K, 3: NEG(K), 4: NEG(ONE)}[n % 5]
def conv(a, b, mul, add, zero):
    c = [zero]*(N+1)
    for d in range(1, N+1):
        ad = a[d]
        if ad == zero: continue
        for m in range(1, N//d+1):
            bm = b[m]
            if bm == zero: continue
            c[d*m] = add(c[d*m], mul(ad, bm))
    return c
kconv = lambda a, b: conv(a, b, kmul, kadd, ZERO)
def report_exact(name, c):
    sg = [ksign(c[n]) for n in range(1, N+1)]
    neg = [n for n in range(1, N+1) if sg[n-1] < 0]
    out[name] = {"negatives": len(neg), "zeros": sg.count(0), "first_negative_n": neg[:8],
                 "first_negative_values": [float(kval(c[n])) for n in neg[:8]]}
    print(name, out[name], flush=True)

# A. DH substituted into unshifted products (exact)
f2 = kconv(aDH, aDH); f4 = kconv(f2, f2)
report_exact("A1_DH_f", aDH); report_exact("A2_DH_f^2", f2); report_exact("A3_DH_f^4 (Ingham form at gamma=0)", f4)
# B. DH coefficient squares (exact): a^2 and (a*a)^2 ; identity a^2 = (1+k^2)/2 chi0 + (1-k^2)/2 (n/5)
sq = [ZERO]+[kmul(aDH[n], aDH[n]) for n in range(1, N+1)]
k2 = kmul(K, K)
leg = {0: 0, 1: 1, 4: 1, 2: -1, 3: -1}
ok = True
for n in range(1, N+1):
    l = leg[n % 5]; c0 = 0 if n % 5 == 0 else 1
    # 2*a^2 == (1+k2) c0 + (1-k2) l
    lhs = tuple(2*u for u in sq[n])
    rhs = kadd(tuple(c0*u for u in kadd(ONE, k2)), tuple(l*u for u in kadd(ONE, NEG(k2))))
    ok &= (lhs == rhs)
out["B1_identity_aDH^2 = (1+k^2)/2 chi0 + (1-k^2)/2 legendre5, exact for n<=N"] = ok
report_exact("B2_DH_|a|^2", sq)
sq2 = [ZERO]+[kmul(f2[n], f2[n]) for n in range(1, N+1)]
report_exact("B3_DH_|a*a|^2", sq2)
# multiplicativity defect of the coefficient squares (exact): first coprime (m,n), mn<=N, with c(mn) != c(m)c(n)
def first_defect(c, one):
    cnt = 0; first = None
    for m in range(2, 101):
        for n in range(m+1, N//m+1):
            if math.gcd(m, n) == 1:
                if c[m*n] != kmul(c[m], c[n]):
                    cnt += 1
                    if first is None: first = (m, n, float(kval(c[m*n])), float(kval(kmul(c[m], c[n]))))
    return {"first": first, "count_m<=100": cnt, "c(1)": float(kval(c[1]))}
out["B4_defect_|aDH|^2"] = first_defect(sq, ONE)
out["B5_defect_|aDH*aDH|^2"] = first_defect(sq2, ONE)
out["B6_defect_aDH"] = first_defect(aDH, ONE)
print({k: out[k] for k in out if k.startswith("B")}, flush=True)

# ---------- shifted forms: interval arithmetic ----------
def ivconv(a, b):
    c = [iv.mpc(0)]*(N+1)
    for d in range(1, N+1):
        ad = a[d]
        for m in range(1, N//d+1):
            c[d*m] = c[d*m] + ad*b[m]
    return c
def rep_iv(name, c, extra=None):
    neg = []; und = []; mn = None
    for n in range(1, N+1):
        r = c[n].real
        if r.b < 0: neg.append(n)
        elif r.a < 0: und.append(n)
    out[name] = {"certified_negative": len(neg), "undecided(interval contains 0)": len(und),
                 "first_negative_n": neg[:8], "first_negative_values": [float(c[n].real.mid) for n in neg[:8]],
                 "max_abs_imag": float(max(abs(c[n].imag.mid) for n in range(1, N+1)))}
    if extra: out[name].update(extra)
    print(name, out[name], flush=True)
aDHf = [iv.mpf(0)]+[iv.mpf([kval(aDH[n])]*2) for n in range(1, N+1)]
aDHf = [iv.mpc(v) for v in aDHf]
ivlog = [iv.mpf(0), iv.mpf(0)]+[iv.log(iv.mpf(n)) for n in range(2, N+1)]
def shift(g):  # n^{-i g}
    gi = iv.mpf(g)
    return [iv.mpc(0)]+[iv.mpc(iv.cos(gi*ivlog[n]), -iv.sin(gi*ivlog[n])) for n in range(1, N+1)]
one = [iv.mpc(0)]+[iv.mpc(1)]*N
issq = [iv.mpc(0)]*(N+1)
for k in range(1, int(N**0.5)+1): issq[k*k] = iv.mpc(1)
for gname, g in [("gamma1=14.134725141734693", "14.134725141734693"), ("gammaDH=85.6993484854", "85.6993484854")]:
    sp_ = shift(g); sm_ = [iv.mpc(0)]+[iv.mpc(v.real, -v.imag) for v in sp_[1:]]
    # zeta: sigma = 1 * n^{-ig};  |sigma|^2 ; identity (|sigma|^2 * 1_sq) = 1*1*n^{-ig}*n^{ig}
    sig = ivconv(one, sp_)
    sig2 = [iv.mpc(0)]+[iv.mpc(v.real*v.real+v.imag*v.imag) for v in sig[1:]]
    lhs = ivconv(sig2, issq)
    sigb = ivconv(one, sm_); rhs = ivconv(sig, sigb)
    err = max(abs((lhs[n]-rhs[n]).real.mid) + abs((lhs[n]-rhs[n]).imag.mid) for n in range(1, N+1))
    rad = max((lhs[n]-rhs[n]).real.delta for n in range(1, N+1))
    out["C_zeta_Ramanujan_identity_"+gname] = {"max_mid_difference": float(err), "max_interval_width": float(rad)}
    rep_iv("C_zeta_product_zeta^2 zeta(s+ig) zeta(s-ig), "+gname, rhs)
    # DH substituted: f^2 f(s+ig) f(s-ig)
    fp = [a*b for a, b in zip(aDHf, sp_)]; fm = [a*b for a, b in zip(aDHf, sm_)]
    f2i = ivconv(aDHf, aDHf); ff = ivconv(fp, fm); prod = ivconv(f2i, ff)
    rep_iv("D_DH_product_f^2 f(s+ig) f(s-ig), "+gname, prod)
    # DH coefficient square b = aDH * (aDH n^{-ig}) : |b|^2 and its multiplicativity defect
    b = ivconv(aDHf, fp)
    b2 = [iv.mpf(0)]+[v.real*v.real+v.imag*v.imag for v in b[1:]]
    first = None; cnt = 0
    for m in range(2, 60):
        for n in range(m+1, N//m+1):
            if math.gcd(m, n) == 1:
                d = b2[m*n]-b2[m]*b2[n]
                if d.a > 0 or d.b < 0:
                    cnt += 1
                    if first is None: first = (m, n, float(b2[m*n].mid), float((b2[m]*b2[n]).mid))
    out["E_DH_|aDH * aDH n^-ig|^2 defect, "+gname] = {"first certified": first, "count_m<60": cnt}
    print(out["E_DH_|aDH * aDH n^-ig|^2 defect, "+gname], flush=True)
out["seconds"] = time.time()-t0
json.dump(out, open("test1.json", "w"), indent=1)
print("done", out["seconds"])
