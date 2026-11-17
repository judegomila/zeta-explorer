# n4-spin-order-two-rows, first test. Field K = Q(theta), theta^3+theta^2-2theta-1=0 (conductor 7).
# Exact integer arithmetic for all symbols; float64 only in the box search (re-verified exactly) and the SVD.
import sys, json, random, math, itertools
from collections import defaultdict
import numpy as np
random.seed(20261117)
XMAX = int(sys.argv[2]) if len(sys.argv) > 2 else 20000
BOX = int(sys.argv[3]) if len(sys.argv) > 3 else 45
def mul(x, y):
    a,b,c = x; d,e,f = y
    c0 = a*d; c1 = a*e+b*d; c2 = a*f+b*e+c*d; c3 = b*f+c*e; c4 = c*f
    # th^3 = -th^2+2th+1 ; th^4 = th*th^3 = -th^3+2th^2+th = 3th^2 - th - 1
    return (c0 + c3 - c4, c1 + 2*c3 - c4, c2 - c3 + 3*c4)
SIG_TH = (-2, 0, 1)                 # sigma(theta) = theta^2 - 2
SIG_TH2 = mul(SIG_TH, SIG_TH)
def sig(x):
    a,b,c = x
    return (a + b*SIG_TH[0] + c*SIG_TH2[0], b*SIG_TH[1] + c*SIG_TH2[1], b*SIG_TH[2] + c*SIG_TH2[2])
def sig2(x): return sig(sig(x))
# checks: sigma(theta) is a root, sigma^3 = id
t = SIG_TH; t3 = mul(t, mul(t, t)); t2 = mul(t, t)
assert (t3[0]+t2[0]-2*t[0]-1, t3[1]+t2[1]-2*t[1], t3[2]+t2[2]-2*t[2]) == (0,0,0)
assert sig(sig(sig((0,1,0)))) == (0,1,0) and sig((0,1,0)) != (0,1,0)
def norm(x):
    n = mul(x, mul(sig(x), sig2(x))); assert n[1] == 0 and n[2] == 0; return n[0]
def tr_s2(x):
    s1 = sig(x); s2 = sig2(x)
    T = x[0]+s1[0]+s2[0]; assert x[1]+s1[1]+s2[1] == 0 and x[2]+s1[2]+s2[2] == 0
    p = [mul(x,s1), mul(s1,s2), mul(s2,x)]
    S = sum(q[0] for q in p); assert sum(q[1] for q in p) == 0 and sum(q[2] for q in p) == 0
    return T, S
def totpos(x):
    T, S = tr_s2(x); return T > 0 and S > 0 and norm(x) > 0
UNITS = [(1,0,0), (0,1,0), (1,1,0), mul((0,1,0),(1,1,0))]
UNITS = UNITS + [tuple(-v for v in u) for u in UNITS]
for u in UNITS: assert abs(norm(u)) == 1
def make_totpos(x):
    c = [mul(x,u) for u in UNITS if totpos(mul(x,u))]
    assert len(c) == 1, (x, c)        # 8 sign classes, exactly one totally positive
    return c[0]
def legendre(a, p):
    a %= p
    if a == 0: return 0
    return 1 if pow(a, (p-1)//2, p) == 1 else -1
def jacobi(a, n):
    assert n > 0 and n % 2 == 1
    a %= n; r = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3,5): r = -r
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: r = -r
        a %= n
    return r if n == 1 else 0
# ---- primes
def sieve(n):
    s = bytearray([1])*(n+1); s[0]=s[1]=0
    for i in range(2, int(n**.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(n+1) if s[i]]
PR = sieve(XMAX)
B = BOX
print(f"planned allocation: box search (2B+1)^3 = {(2*B+1)**3} points x 7 float64/int64 arrays = {(2*B+1)**3*8*7/1e6:.0f} MB")
th = [2*math.cos(2*math.pi*k/7) for k in (1,2,3)]
g = np.arange(-B, B+1, dtype=np.float64)
A_, B_, C_ = np.meshgrid(g, g, g, indexing='ij')
Nf = np.ones_like(A_)
for t_ in th: Nf *= (A_ + B_*t_ + C_*t_*t_)
Ni = np.rint(Nf).astype(np.int64); del Nf
absN = np.abs(Ni).ravel()
idx = np.nonzero((absN <= XMAX) & (absN > 1))[0]
order = idx[np.argsort(absN[idx], kind='stable')]
cands = defaultdict(list)
Af = A_.ravel(); Bf = B_.ravel(); Cf = C_.ravel()
prset = set(PR)
for i in order:
    n = int(absN[i])
    if n in prset and len(cands[n]) < 400: cands[n].append((int(Af[i]), int(Bf[i]), int(Cf[i])))
del A_, B_, C_, Ni, absN, Af, Bf, Cf
PRIMES = []   # dict: p (rational), N, kind, r (root, split/ram), gen (totally positive)
for p in PR:
    if p == 2: continue     # odd ideals only
    if p == 7:
        gen = None
        for x in cands[7]:
            if abs(norm(x)) == 7: gen = make_totpos(x); break
        PRIMES.append(dict(p=7, N=7, kind='ram', r=2, gen=gen)); continue
    if p % 7 in (1, 6):
        roots = [r for r in range(p) if (r*r*r + r*r - 2*r - 1) % p == 0]
        assert len(roots) == 3
        for r in roots:
            gen = None
            for x in cands[p]:
                if (x[0] + x[1]*r + x[2]*r*r) % p == 0:
                    assert abs(norm(x)) == p; gen = make_totpos(x); break
            assert gen is not None, ("no generator in box", p, r)
            PRIMES.append(dict(p=p, N=p, kind='split', r=r, gen=gen))
    elif p**3 <= XMAX:
        PRIMES.append(dict(p=p, N=p**3, kind='inert', r=None, gen=(p,0,0)))
PRIMES.sort(key=lambda P: P['N'])
for P in PRIMES: assert totpos(P['gen']) and norm(P['gen']) == P['N']
print("prime ideals (odd, N<=%d): %d  split %d inert %d ram %d" % (XMAX, len(PRIMES),
      sum(P['kind']=='split' for P in PRIMES), sum(P['kind']=='inert' for P in PRIMES), sum(P['kind']=='ram' for P in PRIMES)))
def sym_prime(x, P):
    if P['kind'] == 'inert': return legendre(norm(x), P['p'])
    r = P['r']; return legendre(x[0] + x[1]*r + x[2]*r*r, P['p'])
# self-test of symbol: Euler criterion in O/P for inert primes (direct power in F_p[theta])
def powmod(x, e, p):
    r = (1,0,0)
    while e:
        if e & 1: r = tuple(v % p for v in mul(r, x))
        x = tuple(v % p for v in mul(x, x)); e >>= 1
    return r
for P in PRIMES:
    if P['kind'] == 'inert':
        for _ in range(20):
            x = tuple(random.randrange(P['p']) for _ in range(3))
            if x == (0,0,0): continue
            e = powmod(x, (P['N']-1)//2, P['p'])
            assert e in ((1,0,0), (P['p']-1,0,0)) and (1 if e == (1,0,0) else -1) == sym_prime(x, P)
# ---- ideals: factorisation = tuple of (prime index, exponent)
IDEALS = []
def rec(start, N, gen, fac):
    IDEALS.append(dict(N=N, gen=gen, fac=tuple(fac)))
    for i in range(start, len(PRIMES)):
        q = PRIMES[i]['N']
        if N*q > XMAX: break
        n2, g2, e = N, gen, 0
        while n2*q <= XMAX:
            n2 *= q; g2 = mul(g2, PRIMES[i]['gen']); e += 1
            rec(i+1, n2, g2, fac + [(i, e)])
rec(0, 1, (1,0,0), [])
IDEALS.sort(key=lambda I: I['N'])
print("odd ideals N<=%d: %d" % (XMAX, len(IDEALS)))
def sym(x, fac):          # (x / b), b = prod P^e
    s = 1
    for i, e in fac:
        v = sym_prime(x, PRIMES[i])
        if v == 0: return 0
        if e & 1: s *= v
    return s
def fac_mul(f1, f2):
    d = defaultdict(int)
    for i, e in f1: d[i] += e
    for i, e in f2: d[i] += e
    return tuple(sorted(d.items()))
def spin(I):  return sym(sig2(I['gen']), I['fac'])      # (alpha / sigma(a)) = (sigma^2 alpha / a)
def spin2(I): return sym(sig(I['gen']), I['fac'])       # spin for sigma^2: (alpha / sigma^2(a)) = (sigma alpha / a)
for I in IDEALS:
    I['spin'] = spin(I); I['spin2'] = spin2(I)
    I['sqf'] = all(e == 1 for _, e in I['fac']); I['mu'] = (-1)**len(I['fac']) if I['sqf'] else 0
    I['m4'] = tuple(v % 4 for v in I['gen'])
out = {}
# well-definedness: unit-square change of generator
for I in random.sample(IDEALS, 500):
    u = random.choice(UNITS); g2 = mul(I['gen'], mul(u, u))
    assert sym(sig2(g2), I['fac']) == I['spin']
# ---- (a) cocycle identity and its reduction
nz = [I for I in IDEALS if I['N'] > 1]
tot = bad = 0; red_tot = red_bad = 0; cplus = cminus = 0
Rtab = defaultdict(set)
for _ in range(300000):
    a = random.choice(nz); b = random.choice(nz)
    al, be = a['gen'], b['gen']
    ab = dict(gen=mul(al, be), fac=fac_mul(a['fac'], b['fac']))
    lhs = spin(ab)
    coc = sym(al, [(i,e) for i,e in b['fac']] and tuple(b['fac'])) if False else None
    c1 = sym(sig2(al), b['fac'])       # (alpha / sigma(b))
    c2 = sym(sig2(be), a['fac'])       # (beta / sigma(a))
    tot += 1
    if lhs != a['spin']*b['spin']*c1*c2: bad += 1
    if math.gcd(a['N'], b['N']) == 1:
        cc = c1*c2
        if cc == 1: cplus += 1
        else: cminus += 1
        # reduced form: cocycle = (beta/alpha) (N beta / N alpha) R(sigma^2 alpha, beta), R(x,y) = (x/y)(y/x)
        s2a = sig2(al)
        s2a_fac = None
        R = c1 * sym(be, tuple((perm_i, e) for perm_i, e in ())) if False else None
        red_tot += 1
        # (beta / sigma^2(a)) = (sigma(beta) / a)
        Rv = c1 * sym(sig(be), a['fac'])
        if cc != sym(be, a['fac']) * jacobi(b['N'], a['N']) * Rv: red_bad += 1
        Rtab[(tuple(v % 4 for v in s2a), b['m4'])].add(Rv)
out['a_cocycle'] = dict(pairs=tot, failures=bad, coprime_pairs=red_tot, reduced_identity_failures=red_bad,
                        cocycle_plus=cplus, cocycle_minus=cminus,
                        R_classes_seen=len(Rtab), R_classes_not_constant=sum(len(v) > 1 for v in Rtab.values()),
                        R_classes_minus=sum(v == {-1} for v in Rtab.values()))
print("(a)", out['a_cocycle'])
# product of the two spins = reciprocity factor R(alpha, sigma alpha): function of alpha mod 4 ?
ptab = defaultdict(set); pcount = defaultdict(int)
for I in IDEALS:
    if I['spin'] != 0:
        pr = I['spin']*I['spin2']; ptab[I['m4']].add(pr); pcount[pr] += 1
out['a_spin_product'] = dict(classes_mod4=len(ptab), not_constant=sum(len(v) > 1 for v in ptab.values()),
                             plus=pcount[1], minus=pcount[-1])
print("(a') spin_sigma*spin_sigma2 by alpha mod 4:", out['a_spin_product'])
# ---- (b) absorption
deg1 = [I for I in IDEALS if len(I['fac']) == 1 and I['fac'][0][1] == 1 and PRIMES[I['fac'][0][0]]['kind'] == 'split']
sp = sum(I['spin'] for I in deg1)
out['b_primes'] = dict(n=len(deg1), plus=sum(I['spin'] == 1 for I in deg1), minus=sum(I['spin'] == -1 for I in deg1),
                       zero=sum(I['spin'] == 0 for I in deg1), sum=sp, sum_over_sqrt_n=sp/math.sqrt(len(deg1)))
print("(b) spin on split primes:", out['b_primes'])
SQF = [I for I in IDEALS if I['sqf'] and I['spin'] != 0 and I['N'] > 1]
def stats(vals):
    n = len(vals); s = sum(vals); return dict(n=n, sum=s, mean=s/n, z=s/math.sqrt(n))
out['b_global'] = dict(spin_all=stats([I['spin'] for I in IDEALS if I['spin'] != 0 and I['N'] > 1]),
                       spin_sqf=stats([I['spin'] for I in SQF]),
                       spin_mu=stats([I['spin']*I['mu'] for I in SQF]),
                       mu_alone=stats([I['mu'] for I in SQF]),
                       spin_lambda_liouville=stats([I['spin']*(-1)**sum(e for _, e in I['fac']) for I in IDEALS if I['spin'] != 0 and I['N'] > 1]))
print("(b) global correlations:", json.dumps(out['b_global']))
# ray classes mod m: (O/m)^* / (squares of units); class label by union-find
def ray_classes(m):
    els = [x for x in itertools.product(range(m), repeat=3) if math.gcd(norm(x), m) == 1]
    lab = {x: x for x in els}
    def find(x):
        while lab[x] != x:
            lab[x] = lab[lab[x]]; x = lab[x]
        return x
    gens = [tuple(v % m for v in mul(u, u)) for u in UNITS[:4]]
    for x in els:
        for u in gens:
            y = tuple(v % m for v in mul(x, u)); rx, ry = find(x), find(y)
            if rx != ry: lab[rx] = ry
    return {x: find(x) for x in els}
rng = random.Random(7)
out['b_rayclass'] = {}
for m in (3, 4, 5, 7, 8, 12, 15, 21):
    cl = ray_classes(m); ncl = len(set(cl.values()))
    res = {}
    for name, pop, f in (("primes: spin", deg1, lambda I: I['spin']),
                         ("squarefree: spin*mu", SQF, lambda I: I['spin']*I['mu'])):
        S = defaultdict(int); C = defaultdict(int); R = defaultdict(int)
        for I in pop:
            k = tuple(v % m for v in I['gen'])
            if k not in cl or f(I) == 0: continue
            S[cl[k]] += f(I); C[cl[k]] += 1; R[cl[k]] += rng.choice((-1, 1))
        n = sum(C.values())
        res[name] = dict(n=n, classes_hit=len(C), L1_bound=sum(abs(v) for v in S.values())/n,
                         L1_random_control=sum(abs(v) for v in R.values())/n,
                         max_abs_class_mean_n_ge_20=max([abs(S[k])/C[k] for k in C if C[k] >= 20], default=None),
                         pure_classes_n_ge_8=sum(1 for k in C if C[k] >= 8 and abs(S[k]) == C[k]))
    out['b_rayclass'][m] = dict(classes=ncl, **res)
    print("(b) ray classes mod", m, json.dumps(out['b_rayclass'][m]))
# ---- (c) singular values
for NC in (3000, 20000):
    L = [I for I in IDEALS if I['N'] <= NC and I['sqf'] and I['N'] > 1 and all(PRIMES[i]['kind'] != 'ram' for i, _ in I['fac'])]
    n = len(L)
    print(f"(c) N<={NC}: n={n} squarefree odd ideals prime to 7; planned allocation 4 matrices {n}x{n} float64 = {4*n*n*8/1e6:.0f} MB (+ SVD workspace about the same)")
    # residues of all generators at each prime, then symbols
    # key of an ideal: factorisation; sigma acts on primes: sigma(P_r) has root r' with r'^2-2 = r; here use generator test
    key = {I['fac']: j for j, I in enumerate(L)}
    Mid = np.zeros((n, n)); Msig = np.zeros((n, n))
    s2g = [sig2(I['gen']) for I in L]
    # per-prime symbol tables
    used = sorted({i for I in L for i, _ in I['fac']})
    T_id = {i: np.array([sym_prime(I['gen'], PRIMES[i]) for I in L], dtype=np.int8) for i in used}
    T_s = {i: np.array([sym_prime(x, PRIMES[i]) for x in s2g], dtype=np.int8) for i in used}
    for j, I in enumerate(L):
        c1 = np.ones(n, dtype=np.int8); c2 = np.ones(n, dtype=np.int8)
        for i, _ in I['fac']:
            c1 *= T_id[i]; c2 *= T_s[i]
        Mid[:, j] = c1; Msig[:, j] = c2            # M[a, b] = (alpha / b), (alpha / sigma(b))
    # permutation: row of sigma^2(a) in Mid equals row a of Msig
    def sig_fac(I):   # factorisation of sigma^2(a): primes dividing sigma^2(alpha)
        x = sig2(I['gen']); f = set()
        for i, e in I['fac']:
            P = PRIMES[i]
            if P['kind'] != 'split': f.add((i, e)); continue
            for k in byp[P['p']]:
                Q = PRIMES[k]
                if (x[0] + x[1]*Q['r'] + x[2]*Q['r']**2) % Q['p'] == 0: f.add((k, e))
        assert len(f) == len(I['fac'])
        return tuple(sorted(f))
    byp = defaultdict(list)
    for k, Q in enumerate(PRIMES):
        if Q['kind'] == 'split': byp[Q['p']].append(k)
    perm = np.array([key[sig_fac(I)] for I in L])
    perm_ok = bool(np.array_equal(Msig, Mid[perm, :]))
    diag = np.array([Msig[j, j] for j in range(n)]); spins = np.array([I['spin'] for I in L])
    rs = np.random.RandomState(1)
    Mrand = rs.choice([-1.0, 1.0], size=(n, n)) * (Mid != 0)
    # second control: random bicharacter is not available; use row-shuffled-by-random-permutation Mid (same spectrum by construction)
    sv = {}
    for nm, M in (("id", Mid), ("sigma", Msig), ("random_sign", Mrand)):
        s = np.linalg.svd(M, compute_uv=False); sv[nm] = [float(v) for v in s[:4]]
    out[f'c_svd_{NC}'] = dict(n=n, sqrt_n=math.sqrt(n), zero_fraction=float((Mid == 0).mean()), perm_identity_exact=perm_ok,
                              fixed_points_of_perm=int((perm == np.arange(n)).sum()),
                              diag_equals_spin=bool(np.array_equal(diag, spins)), top4=sv,
                              ratio_sigma_over_2sqrtn=sv['sigma'][0]/(2*math.sqrt(n)),
                              max_abs_sv_diff_id_sigma=float(max(abs(a-b) for a, b in zip(sv['id'], sv['sigma']))))
    print(json.dumps(out[f'c_svd_{NC}']))
    del Mid, Msig, Mrand
# ---- (d) side checks: Galois invariance of spin on the primes above a split p; cocycle on pairs of distinct split primes
byp2 = defaultdict(list)
for I in deg1: byp2[PRIMES[I['fac'][0][0]]['p']].append(I['spin'])
gal_bad = sum(1 for v in byp2.values() if len(v) != 3 or len(set(v)) != 1)
pp = pm = 0
for _ in range(200000):
    a = random.choice(deg1); b = random.choice(deg1)
    if a['N'] == b['N']: continue
    cc = sym(sig2(a['gen']), b['fac']) * sym(sig2(b['gen']), a['fac'])
    if cc == 1: pp += 1
    else: pm += 1
out['d_side'] = dict(split_rational_primes=len(byp2), galois_invariance_failures=gal_bad, prime_pair_cocycle_plus=pp, prime_pair_cocycle_minus=pm)
print("(d)", out['d_side'])
json.dump(out, open(sys.argv[1], 'w'), indent=1)
print("done")
