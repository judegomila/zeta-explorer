"""(K3) for the degenerate Eisenstein input: genus sums of Epstein zeta values over the interchange quadruple
G_1, G_p, G_q, G_pq (genera of <1,1,d>), p = q = 1 mod 8, (p/q) = 1.
Exact part: rational arithmetic. Analytic part: python-flint balls (acb), prec bits below."""
import sys, json, math, os, time
from fractions import Fraction
import numpy as np
from genus import *

PREC = int(os.environ.get('K3_PREC','160'))
T_CUT = 24.0     # theta splitting keeps pi*Q(x) <= pi*T_CUT

def kronecker_fund(D, m):
    """Kronecker symbol (D/m) for fundamental discriminant D<0, m>=1"""
    if m == 0: return 0
    r = 1
    v = 0
    while m % 2 == 0: m //= 2; v += 1
    if v:
        if D % 2 == 0: return 0
        if v % 2 and (D % 8) in (3, 5): r = -r
    # Jacobi (D/m), m odd positive
    a = D % m; n = m
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): r = -r
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: r = -r
        a %= n
    return r if n == 1 else 0

def factor(n):
    f = {}; p = 2
    while p*p <= n:
        while n % p == 0: f[p] = f.get(p, 0)+1; n //= p
        p += 1
    if n > 1: f[n] = f.get(n, 0)+1
    return f

def L1_fund(D):
    """L(1, chi_D), D<0 fundamental, by the finite class number sum (exact up to pi)"""
    a = abs(D)
    s = sum(m*kronecker_fund(D, m) for m in range(1, a))
    return -math.pi*s/a**1.5

_hist = {}
def hist_mod(A, m):
    key = (A, m)
    if key in _hist: return _hist[key]
    x = np.arange(m, dtype=np.int64)
    X, Y = np.meshgrid(x, x, indexing='ij')
    base = (A[0][0]*X*X + A[1][1]*Y*Y + 2*A[0][1]*X*Y) % m
    h = np.zeros(m, dtype=np.int64)
    for z in range(m):
        v = (base + (2*A[0][2]*z % m)*X + (2*A[1][2]*z % m)*Y + A[2][2]*z*z) % m
        h += np.bincount(v.ravel(), minlength=m)
    _hist[key] = h
    return h

def r_gen_siegel(A, d, dprimes, n, maxmod=700):
    """Siegel's formula 2 pi sqrt(n/d) prod_p alpha_p(n) with L(1,chi) from the class number sum.
    returns float or None when a needed local count is beyond maxmod."""
    fn = factor(n)
    sf = 1
    for p, e in factor(d*n).items():
        if e % 2: sf *= p
    D0 = -sf if sf % 4 == 3 else -4*sf
    bad = set(fn) | set(dprimes) | {2}
    val = L1_fund(D0)*6/math.pi**2
    for p in factor(abs(D0)): val /= (1 - p**-2.0)
    for p in bad: val /= (1 + kronecker_fund(D0, p)/p)
    for p in bad:
        vp = fn.get(p, 0)
        if p != 2 and p not in dprimes:
            if vp == 0: val *= 1 + legendre(-d*n, p)/p; continue
            if vp == 1: val *= 1 - p**-2.0; continue
        k = vp + (3 if p == 2 else 1)
        m = p**k
        if m > maxmod: return None
        h = hist_mod(A, m)
        val *= float(h[n % m])/m**2
    return 2*math.pi*math.sqrt(n/d)*val

def genus_data(d, primes, N, verbose=True):
    t0 = time.time()
    target = genus_inv(((1,0,0),(0,1,0),(0,0,d)), primes)
    g = classes(d, primes)
    L = g[target]
    nall = sum(len(v) for v in g.values())
    M = sum(Fraction(1, o) for _, o in L)
    W = [Fraction(0)]*(N+1)
    Kd = int(T_CUT*d) + 1
    Wd = np.zeros(Kd+1, dtype=object)
    beta = 0.0; betad = 0.0
    for k, o in L:
        A = gram_from_key(k)
        rc = rep_counts(A, N)
        for n in range(1, N+1): W[n] += Fraction(int(rc[n]), o)
        ad = adj3(A)
        rd = rep_counts(ad, Kd)
        Wd += np.array([Fraction(int(x), o) for x in rd], dtype=object)
        beta = max(beta, max(ad[i][i] for i in range(3))/d)
        betad = max(betad, max(A[i][i] for i in range(3))/d)
    if verbose: print("det %d: %d classes in all genera, %d genera, target genus %s: %d classes, mass(O) %s, %.1fs" % (d, nall, len(g), target, len(L), M, time.time()-t0), flush=True)
    return dict(d=d, classes=L, M=M, W=W, Wd=list(Wd), beta=beta, betad=betad, ngenera=len(g), nclasses_all=nall, target=target)

def epstein_genus(G, s):
    """sum_{Q in G} Z_Q(s)/|O(Q)| as an acb ball (theta splitting, rigorous tail radius)."""
    from flint import acb, arb, ctx
    ctx.prec = PREC
    d = G['d']; s = acb(s); pi = acb.pi()
    s2 = acb(3)/2 - s
    tot = acb(0)
    N1 = int(T_CUT)
    for n in range(1, N1+1):
        w = G['W'][n]
        if w == 0: continue
        u = pi*n
        tot += acb(w.numerator)/w.denominator * u.gamma_upper(s) * (-s*u.log()).exp()
    dual = acb(0)
    Kd = len(G['Wd'])-1
    for k in range(1, Kd+1):
        w = G['Wd'][k]
        if w == 0: continue
        u = pi*k/d
        dual += acb(w.numerator)/w.denominator * u.gamma_upper(s2) * (-s2*u.log()).exp()
    Mq = acb(G['M'].numerator)/G['M'].denominator
    rootd = acb(d).sqrt()
    lam = tot + dual/rootd + Mq*(1/(rootd*(s - acb(3)/2)) - 1/s)
    # tails (Lemma T): each omitted term is at most 2 e^{-u}/u in modulus once u >= 2(|Re s|+|Re s2|+2)
    sig = abs(float(s.real.mid())) + 1.5 + 2
    assert math.pi*T_CUT >= 2*(sig+2)
    Mf = float(G['M'])*len(G['classes'])  # sum of 1/|O| <= M ; number-of-points bound per class
    c1 = (2*math.sqrt(G['beta'])+1)**3
    tail1 = float(G['M'])*c1*1.1*(N1+1)**1.5*math.exp(-math.pi*(N1+1))*2
    c2 = (2*math.sqrt(G['betad']*d)+1)**3     # count of y with y^T adj y <= k is <= (2 sqrt(k*betad)+1)^3 <= c2 * max(k/d,1)^1.5
    T = Kd/d
    tail2 = float(G['M'])*c2*d*T**1.5*math.exp(-math.pi*T)/(math.pi-1.5/T)*2/math.sqrt(d)
    rad = tail1 + tail2
    lam += acb(arb(0, rad), arb(0, rad))
    Z = lam * (s*pi.log()).exp() / s.gamma()
    return Z, rad

def run_quad(p, q, N, svals):
    out = dict(p=p, q=q)
    assert p % 8 == 1 and q % 8 == 1 and legendre(p, q) == 1 and legendre(q, p) == 1
    Gs = {}
    for name, d, pr in (('1', 1, ()), ('p', p, (p,)), ('q', q, (q,)), ('pq', p*q, (p, q))):
        Gs[name] = genus_data(d, pr, N)
    out['classes'] = {k: len(v['classes']) for k, v in Gs.items()}
    out['mass_O'] = {k: str(v['M']) for k, v in Gs.items()}
    # control 1: mass (phi = 1) is a pure tensor: exact
    dm = Gs['1']['M']*Gs['pq']['M'] - Gs['p']['M']*Gs['q']['M']
    out['delta_mass_exact'] = str(dm)
    # control 2: fixed-n theta coefficient arrays are pure tensors up to the archimedean factor: exact for all n <= N
    bad = 0; nz = 0
    for n in range(1, N+1):
        dn = Gs['1']['W'][n]*Gs['pq']['W'][n] - Gs['p']['W'][n]*Gs['q']['W'][n]
        if dn != 0: bad += 1
        if Gs['1']['W'][n] != 0: nz += 1
    out['fixed_n_ratio_examples'] = {n: str(Gs['1']['W'][n]*Gs['pq']['W'][n]/(Gs['p']['W'][n]*Gs['q']['W'][n])) for n in (1,2,3,5,6,10,11,14) if Gs['p']['W'][n]*Gs['q']['W'][n] != 0}
    out['fixed_n_delta_nonzero_count'] = bad; out['fixed_n_tested'] = N; out['fixed_n_with_W1_nonzero'] = nz
    # same for the dual (adjoint form) arrays at matched index k: indices scale with d, test k1*kpq-kp*kq on index j: adj of G_d at j*? skipped
    # Siegel check (class-number formula) for each genus
    sieg = {}
    for name, G in Gs.items():
        A = ((1,0,0),(0,1,0),(0,0,G['d']))
        dpr = [x for x in (p, q) if G['d'] % x == 0]
        worst = 0.0; cnt = 0; skipped = 0
        for n in range(1, min(N, 240)+1):
            r = r_gen_siegel(A, G['d'], dpr, n)
            if r is None: skipped += 1; continue
            mine = float(G['W'][n]/G['M'])
            worst = max(worst, abs(mine - r)/max(1.0, abs(r))); cnt += 1
        sieg[name] = dict(tested=cnt, skipped=skipped, max_abs_rel_dev=worst)
    out['siegel_check'] = sieg
    print(json.dumps({k: out[k] for k in out}, default=str), flush=True)
    # analytic part
    from flint import acb, arb, ctx
    ctx.prec = PREC
    res = []
    for s in svals:
        sc = acb(s[0], s[1])
        K = {}; rads = {}
        for name, G in Gs.items():
            Z, rad = epstein_genus(G, sc)
            K[name] = Z * (sc*acb(G['d']).log()/3).exp()   # phi(g_Q) = det^{s/3} Z_Q(s); weights 1/|O| (1/|SO| = 2/|O|)
            rads[name] = rad
        Delta = K['1']*K['pq'] - K['p']*K['q']
        rho = K['1']*K['pq']/(K['p']*K['q']) - 1
        nonzero = not Delta.contains(0)
        rec = dict(s=list(s), K={k: str(v) for k, v in K.items()}, tail_radius=rads, Delta=str(Delta), rho=str(rho),
                   Delta_excludes_zero=bool(nonzero), K_nonzero={k: (not v.contains(0)) for k, v in K.items()},
                   rho_mid=[float(rho.real.mid()), float(rho.imag.mid())], rho_rad=float(max(rho.real.rad(), rho.imag.rad())))
        # closed form (direct class-number series) where it converges fast
        if s[1] == 0 and s[0] >= 6:
            Kc = {}
            for name, G in Gs.items():
                acc = arb(0)
                for n in range(1, N+1):
                    w = G['W'][n]
                    if w: acc += arb(w.numerator)/w.denominator / arb(n)**arb(s[0])
                tail = float(G['M'])*27*max(G['beta'], 1.0)**1.5*s[0]*N**(1.5-s[0])/(s[0]-1.5)
                Kc[name] = (acc + arb(0, tail)) * (arb(s[0])*arb(G['d']).log()/3).exp()
            Dc = Kc['1']*Kc['pq'] - Kc['p']*Kc['q']
            rec['closed_form_Delta'] = str(Dc)
            rec['closed_vs_method_overlap'] = bool(Dc.overlaps(Delta.real))
            rec['closed_vs_method_K_overlap'] = {k: bool(Kc[k].overlaps(K[k].real)) for k in Kc}
            rec['closed_minus_method_K_rel'] = {k: float(abs((Kc[k]-K[k].real).mid())/abs(Kc[k].mid())) for k in Kc}
        res.append(rec)
        print(json.dumps(rec), flush=True)
    out['values'] = res
    return out

if __name__ == "__main__":
    if sys.argv[2].startswith('auto'):
        B = int(sys.argv[2][4:])
        pr = [x for x in range(17, B+1) if x % 8 == 1 and all(x % t for t in range(2, int(x**.5)+1))]
        quads = [(a, b) for i, a in enumerate(pr) for b in pr[i+1:] if legendre(a, b) == 1]
    else:
        quads = [tuple(map(int, a.split(','))) for a in sys.argv[2].split(';')]
    print('quadruples', quads, flush=True)
    dm = max(a*b for a, b in quads)
    print('planned allocations: largest dual index array %d entries (object, < %.2f GB); vector boxes below 0.1 GB each unless printed' % (int(T_CUT*dm)+2, (int(T_CUT*dm)+2)*200/2**30), flush=True)
    N = int(sys.argv[3])
    svals = [(2.0, 0.0), (3.0, 0.0), (6.0, 0.0), (10.0, 0.0), (1.6, 0.0), (1.0, 0.0), (0.75, 0.0), (0.75, 3.0), (0.75, 10.0), (0.75, 25.0), (1.51, 0.0), (0.75, 40.0), (0.9, 14.134725)]
    from multiprocessing import Pool
    nw = int(os.environ.get('RH_WORKERS', '2'))
    with Pool(min(nw, len(quads))) as P:
        outs = P.starmap(run_quad, [(p, q, N, svals) for p, q in quads])
    json.dump(outs, open(sys.argv[1], 'w'), indent=1, default=str)
