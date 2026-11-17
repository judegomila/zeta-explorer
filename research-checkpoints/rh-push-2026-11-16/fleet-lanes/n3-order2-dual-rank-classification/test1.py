# First test: Poisson duals S_f(h;p) = sum_m (f(m)/p) e(hm/p), odd primes p <= 500.
# Exact integers: S_f(0;p), autocorrelation a_k = sum_m chi(f(m)) chi(f(m+k)), fourth moment.
# Float (double): |S(h)|^2 values, multiplicative rank, Kloosterman comparison.
# Largest allocation: 2-variable table p^2 <= 249001 complex128 (4 MB).
import numpy as np, json, math, sys
from math import gcd
print("planned max allocation: 499^2 complex128 = %.1f MB" % (499*499*16/1e6))
def primes(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**.5)+1):
        if s[i]: s[i*i::i] = False
    return [int(x) for x in np.nonzero(s)[0]]
PR = [p for p in primes(500) if p > 2]
def leg_table(p):
    t = -np.ones(p, dtype=np.int64); t[(np.arange(p, dtype=np.int64)**2) % p] = 1; t[0] = 0
    return t
LEG = {p: leg_table(p) for p in PR}
def polyval(co, m, p):  # co highest first
    r = np.zeros_like(m)
    for c in co: r = (r*m + c) % p
    return r
def one_var(name, co, bad, n_sqfree):
    rows = []
    for p in PR:
        if bad % p == 0: continue
        m = np.arange(p, dtype=np.int64)
        chi = LEG[p][polyval(co, m, p)]
        S0 = int(chi.sum()); r = int((chi == 0).sum())
        # exact autocorrelation
        a = np.array([int((chi*np.roll(chi, -k)).sum()) for k in range(p)], dtype=np.int64)
        flat = bool(np.all(a[1:] == a[1]) and (a[0]-a[1] == p))
        M4 = float((a.astype(object)**2).sum())/p**2          # (1/p) sum_h |S|^4 / p^2, exact rational
        S = np.fft.fft(chi.astype(float))                      # S(h) up to h -> -h
        ab2 = (np.abs(S)**2)/p
        nd = len(np.unique(np.round(ab2[1:], 8)))
        # multiplicative rank: number of chi mod p with sum_m chi2(f(m)) chi(m) != 0
        g = next(g for g in range(2, p) if len({pow(g, e, p) for e in range(p-1)}) == p-1)
        idx = np.array([pow(g, e, p) for e in range(p-1)])
        mr = int((np.abs(np.fft.fft(chi[idx].astype(float))) > 1e-7).sum())
        rows.append(dict(p=p, S0=S0, roots=r, flat=flat, M4=M4, ndist=nd, maxdev=float(np.abs(ab2[1:]-1).max()),
                         maxab2=float(ab2[1:].max()), mrank=mr))
    return dict(name=name, n=n_sqfree, rows=rows)
def summ(res):
    R = res['rows']; big = [x for x in R if x['p'] > 100]
    S0s = sorted(set(x['S0'] for x in R))
    out = dict(name=res['name'], n=res['n'], nprimes=len(R),
        flat_all=all(x['flat'] for x in R), flat_count=int(sum(x["flat"] for x in R)),
        S0_set=S0s if len(S0s) <= 6 else "varies (%d values, min %d max %d)" % (len(S0s), S0s[0], S0s[-1]),
        maxS0_over_sqrtp=max(abs(x['S0'])/math.sqrt(x['p']) for x in R),
        M4_mean_p_gt_100=float(np.mean([x['M4'] for x in big])),
        max_abs2_over_p=max(x['maxab2'] for x in R),
        maxdev_p_gt_100=max(x['maxdev'] for x in big),
        ndist_over_p_mean=float(np.mean([x['ndist']/(x['p']-1) for x in big])),
        mrank_over_pm1_mean=float(np.mean([x['mrank']/(x['p']-1) for x in big])),
        flat_implies_S0_zero_and_one_root=all((not x['flat']) or (x['S0'] == 0 and x['roots'] == 1) for x in R))
    return out
cases = [
 ("m", [1,0], 1, 1),
 ("m^2-2", [1,0,-2], 2, 2), ("m^2-3", [1,0,-3], 3, 2), ("m^2-5", [1,0,-5], 5, 2), ("m^2+1", [1,0,1], 1, 2),
 ("m^2+m+1", [1,1,1], 3, 2),
 ("m(m^2-1)", [1,0,-1,0], 1, 3), ("m(m^2-2)", [1,0,-2,0], 2, 3),
 ("m^3-2", [1,0,0,-2], 6, 3), ("m^3-m-1", [1,0,-1,-1], 23, 3),
 ("m(m^2+1)^2", [1,0,2,0,1,0], 1, 1), ("m(m-1)^2", [1,-2,1,0], 1, 1), ("m^3", [1,0,0,0], 1, 1),
 ("m^4-m-1", [1,0,0,-1,-1], 283, 4), ("m^4+1", [1,0,0,0,1], 2, 4), ("3m^4+1",[3,0,0,0,1],6,4),
 ("m^5-m-1", [1,0,0,0,-1,-1], 19*151, 5),
]
ALL = {}; SUM = []
for c in cases:
    res = one_var(*c); ALL[c[0]] = res; s = summ(res); SUM.append(s); print(json.dumps(s))
# ---- specific identities ----
chk = {}
# (a) conic: S_f(0;p) = -1 exactly; S_f(h;p) = K(1, h^2 d/4; p)
def kloos(a, b, c):
    x = np.array([x for x in range(1, c) if gcd(x, c) == 1], dtype=np.int64)
    xi = np.array([pow(int(v), -1, c) for v in x], dtype=np.int64)
    return np.exp(2j*np.pi*((a*x + b*xi) % c)/c).sum()
for d in (2, 3, 5, -1):
    worst = 0.0; ok0 = True
    for p in PR:
        if (2*d) % p == 0: continue
        m = np.arange(p, dtype=np.int64); chi = LEG[p][(m*m - d) % p]
        ok0 &= (int(chi.sum()) == -1)
        i4 = pow(4, -1, p)
        if p <= 211:
            for h in range(1, p):
                Sf = (chi*np.exp(2j*np.pi*h*m/p)).sum()
                worst = max(worst, abs(Sf - kloos(1, (h*h*d*i4) % p, p)))
    chk["conic d=%d: S(0;p)=-1 all p<=500" % d] = bool(ok0)
    chk["conic d=%d: max|S_f(h;p)-K(1,h^2 d/4;p)|, p<=211" % d] = float(worst)
# (b) squarefree composite c prime to 2d: S_f(0;c) = mu(c) exactly; S_f(h;c) = K(1,h^2 d/4;c)
def factor(n):
    f = []; q = 2
    while q*q <= n:
        while n % q == 0: f.append(q); n //= q
        q += 1
    if n > 1: f.append(n)
    return f
for d in (2, 5):
    ok = True; worst = 0.0; cnt = 0
    for c in range(3, 500, 2):
        f = factor(c)
        if len(set(f)) != len(f) or gcd(c, 2*d) != 1: continue
        m = np.arange(c, dtype=np.int64); v = (m*m - d) % c
        jac = np.ones(c, dtype=np.int64)
        for q in f: jac *= LEG[q][v % q]
        mu = (-1)**len(f); ok &= (int(jac.sum()) == mu); cnt += 1
        if c <= 150:
            i4 = pow(4, -1, c)
            for h in range(1, c):
                Sf = (jac*np.exp(2j*np.pi*h*m/c)).sum()
                worst = max(worst, abs(Sf - kloos(1, (h*h*d*i4) % c, c)))
    chk["conic d=%d: S(0;c)=mu(c), %d squarefree c<500 prime to 2d" % (d, cnt)] = bool(ok)
    chk["conic d=%d: max|S_f(h;c)-K(1,h^2 d/4;c)|, all h, c<=150" % d] = float(worst)
# (c) prime squares: S_f(0;p^2) = p(p-1-(d/p))
okp2 = True
for d in (2, 5):
    for p in [3, 5, 7, 11, 13, 17, 19]:
        if (2*d) % p == 0: continue
        m = np.arange(p*p, dtype=np.int64); val = int((LEG[p][(m*m-d) % p]**2).sum())
        okp2 &= (val == p*(p-1-int(LEG[p][d % p])))
chk["conic: S(0;p^2)=p(p-1-(d/p))"] = bool(okp2)
# (d) cubic: S(0;p) = -a_p; CM checks
ok = True
for p in PR:
    m = np.arange(p, dtype=np.int64); S0 = int(LEG[p][(m*m*m - m) % p].sum())
    if p % 4 == 3: ok &= (S0 == 0)
    else:
        sols = [(a, b) for a in range(1, 23) for b in range(0, 23) if a*a + b*b == p]
        ok &= any(abs(S0) == 2*a for a, b in sols)
chk["m^3-m: S(0;p)=0 for p=3 mod 4, |S(0;p)|=2a with p=a^2+b^2 for p=1 mod 4"] = bool(ok)
ok = True
for p in PR:
    if p == 3: continue
    m = np.arange(p, dtype=np.int64); S0 = int(LEG[p][(m*m*m - 2) % p].sum())
    if p % 3 == 2: ok &= (S0 == 0)
    ok &= (S0*S0 <= 4*p)
chk["m^3-2: S(0;p)=0 for p=2 mod 3, Hasse"] = bool(ok)
# (e) quartic: S(0;p) + (lc/p) bounded by 2 sqrt p
for nm, co, bad in (("m^4-m-1", [1,0,0,-1,-1], 283), ("3m^4+1", [3,0,0,0,1], 6)):
    ok = True
    for p in PR:
        if bad % p == 0: continue
        m = np.arange(p, dtype=np.int64); S0 = int(LEG[p][polyval(co, m, p)].sum())
        ok &= ((S0 + int(LEG[p][co[0] % p]))**2 <= 4*p)
    chk[nm + ": |S(0;p)+(lc/p)|<=2 sqrt p"] = bool(ok)
# ---- two-variable norm forms ----
def two_var(name, A, B, C, bad):
    # N(x,y) = A x^2 + B x y + C y^2
    out = []
    for p in PR:
        if bad % p == 0: continue
        x = np.arange(p, dtype=np.int64)[:, None]; y = np.arange(p, dtype=np.int64)[None, :]
        chi = LEG[p][(A*x*x + B*x*y + C*y*y) % p]
        S0 = int(chi.sum()); r = int((chi == 0).sum())
        S = np.fft.fft2(chi.astype(float)); ab2 = np.abs(S)**2/p**2
        # dual form N*(h) = C h1^2 - B h1 h2 + A h2^2 ; h=(h1,h2) index, fft sign irrelevant for |.|
        Nd = (C*x*x - B*x*y + A*y*y) % p
        gen = Nd != 0
        out.append(dict(p=p, S0=S0, zeros=r, maxdev_generic=float(np.abs(ab2[gen]-1).max()),
                        max_isotropic=float(ab2[~gen].max())))
    return dict(name=name, nprimes=len(out), S0_set=sorted(set(o['S0'] for o in out)),
                maxdev_generic=max(o['maxdev_generic'] for o in out),
                max_abs2_over_p2_on_dual_cone=max(o['max_isotropic'] for o in out))
TV = [two_var("x^2+y^2 (full lattice)", 1, 0, 1, 1), two_var("x^2-2y^2 (full)", 1, 0, -2, 2),
      two_var("x^2+xy+y^2 (full)", 1, 1, 1, 3), two_var("x^2+4y^2 (index-2 sublattice y even)", 1, 0, 4, 1),
      two_var("x^2-8y^2 (index-2)", 1, 0, -8, 2)]
for t in TV: print(json.dumps(t))
for k, v in chk.items(): print(k, "->", v)
json.dump(dict(one_var=SUM, two_var=TV, checks=chk), open("test1.json", "w"), indent=1)
