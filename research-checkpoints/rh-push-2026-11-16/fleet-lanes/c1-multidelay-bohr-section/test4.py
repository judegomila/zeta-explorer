# Fejer-tapered joint section: U^F_Q(s) = sum_{n<=Q} Lambda(n) (1 - log n/log Q) n^{-s}  (all prime powers).
# Identity (classical explicit formula): G - U^F_Q = sum_rho k(s-rho) - G'(s)/lam - Q^{1-s}/((1-s)^2 lam) + triv,
#   k(a) = int_0^lam (1-u/lam) e^{-au} du, Re k >= 0 for Re a >= 0 (Polya).  lam = log Q.
# Measured: max over the window of the defect  Re U^F_Q - Re G - corr,  corr = Re G'/lam + Re pole  (zero for twists).
import numpy as np, math, json, sys, time
rng = np.random.default_rng(7)
N = 1000
def digamma(w):
    w = np.asarray(w, complex); acc = np.zeros_like(w)
    for k in range(8): acc -= 1.0/(w+k)
    x = w+8; x2 = 1.0/(x*x)
    return acc + np.log(x) - 0.5/x - x2*(1/12. - x2*(1/120. - x2*(1/252. - x2*(1/240. - x2/132.))))
def trigamma(w):
    w = np.asarray(w, complex); acc = np.zeros_like(w)
    for k in range(8): acc += 1.0/(w+k)**2
    x = w+8
    return acc + 1/x + 0.5/x**2 + 1/(6*x**3) - 1/(30*x**5) + 1/(42*x**7)
G   = lambda s: 1/s + 1/(s-1) - 0.5*math.log(math.pi) + 0.5*digamma(s/2)
Gp  = lambda s: -1/s**2 - 1/(s-1)**2 + 0.25*trigamma(s/2)
GD  = lambda s: 0.5*math.log(5/math.pi) + 0.5*digamma((s+1)/2)
GDp = lambda s: 0.25*trigamma((s+1)/2)
n = np.arange(1, N+1); ln = np.log(n)
# von Mangoldt, and smallest prime factor for completely multiplicative twists
lam = np.zeros(N+1); spf = np.zeros(N+1, int)
for p in range(2, N+1):
    if spf[p] == 0:
        for m in range(p, N+1, p):
            if spf[m] == 0: spf[m] = p
        q = p
        while q <= N: lam[q] = math.log(p); q *= p
primes = [p for p in range(2, N+1) if spf[p] == p]
def cm(vals):   # completely multiplicative extension of prime values (dict p -> complex)
    e = np.ones(N+1, complex)
    for m in range(2, N+1): e[m] = e[m//spf[m]]*vals[spf[m]]
    return e
kap = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
a_dh = np.array([[0, 1, kap, -kap, -1][m % 5] for m in range(N+1)], float); a_dh[0] = 0
lam_dh = np.zeros(N+1)
divs = [[] for _ in range(N+1)]
for d in range(1, N+1):
    for m in range(2*d, N+1, d): divs[m].append(d)
for m in range(2, N+1):
    lam_dh[m] = a_dh[m]*math.log(m) - sum(lam_dh[d]*a_dh[m//d] for d in divs[m] if d > 1)
chi_tab = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}
coef = {'true': lam[1:].astype(complex)}
for k in range(5): coef['sign_rand_%d' % k] = (lam*cm({p: rng.choice([-1.0, 1.0]) for p in primes}))[1:]
for k in range(3): coef['unimod_rand_%d' % k] = (lam*cm({p: np.exp(2j*np.pi*rng.random()) for p in primes}))[1:]
coef['sign_adv_t5000'] = (lam*cm({p: (1.0 if math.cos(5000*math.log(p)) >= 0 else -1.0) for p in primes}))[1:]
chi = cm({p: chi_tab[p % 5] for p in primes})
coef['chi5'] = (lam*chi)[1:]
coef['DH'] = lam_dh[1:].astype(complex)
QS = [30, 100, 300, 1000]; SIGS = [0.5, 0.6, 0.75]
T0, T1, DT, CH = 100.0, 1.0e4, 0.02, 20000
print('planned chunk allocation: %d x %d complex128 x ~3 = %.2f GB' % (CH, N, CH*N*16*3/1e9)); sys.stdout.flush()
keys = list(coef) + ['chi5_own_gamma', 'E_a_0.2']
res = {k: np.full((len(SIGS), len(QS)), -np.inf) for k in keys}     # max (Re U^F - Re G_ref)
arg = {k: np.zeros((len(SIGS), len(QS))) for k in keys}
resc = {k: np.full((len(SIGS), len(QS)), -np.inf) for k in ('true', 'chi5_own_gamma')}   # with corr removed
nt = int(round((T1-T0)/DT))+1; t00 = time.time()
def upd(d, key, js, jq, tt):
    k = int(np.argmax(d))
    if d[k] > res[key][js, jq]: res[key][js, jq] = d[k]; arg[key][js, jq] = tt[k]
for st in range(0, nt, CH):
    t = T0 + DT*np.arange(st, min(st+CH, nt))
    E = np.exp(-1j*np.outer(t, ln))                    # n^{-it}
    for js, sg in enumerate(SIGS):
        s = sg + 1j*t
        rG, rGp, rGD, rGDp = G(s).real, Gp(s).real, GD(s).real, GDp(s).real
        for jq, Q in enumerate(QS):
            L = math.log(Q)
            w = np.where(n <= Q, (1 - ln/L), 0.0)*n**(-sg)
            for key, c in coef.items():
                U = (E[:, :Q] @ (c[:Q]*w[:Q])).real
                ref = rGD if key == 'DH' else rG
                upd(U - ref, key, js, jq, t)
                if key == 'true':
                    pole = (Q**(1-s)/((1-s)**2*L)).real
                    resc['true'][js, jq] = max(resc['true'][js, jq], (U - rG - rGp/L - pole).max())
                if key == 'chi5':
                    upd(U - rGD, 'chi5_own_gamma', js, jq, t)
                    resc['chi5_own_gamma'][js, jq] = max(resc['chi5_own_gamma'][js, jq], (U - rGD - rGDp/L).max())
            # E_a
            a = 0.2
            wa = np.where(n <= Q, (1 - ln/L), 0.0)*(n**(-(sg+a)) + n**(-(sg-a)))
            U = (E[:, :Q] @ (coef['true'][:Q]*wa[:Q])).real
            upd(U - (G(s+a)+G(s-a)).real, 'E_a_0.2', js, jq, t)
    print('chunk', st, '%.0fs' % (time.time()-t00)); sys.stdout.flush()
out = {'QS': QS, 'SIGS': SIGS, 'window': [T0, T1, DT],
       'max_ReUF_minus_ReG': {k: res[k].tolist() for k in keys}, 'argmax_t': {k: arg[k].tolist() for k in keys},
       'max_defect_after_explicit_correction': {k: resc[k].tolist() for k in resc}}
json.dump(out, open('test4.json', 'w'), indent=1)
for k in keys: print('%-18s' % k, [[round(x, 3) for x in r] for r in res[k].tolist()])
for k in resc: print('corrected %-18s' % k, [['%.2e' % x for x in r] for r in resc[k].tolist()])
