# Second referee of c20-u4: Lemma S (30 digits), K3-M (30 digits), and the DEL / THIN rows with zeta's Arch imposed.
# Written from RESULT.md only. float64 scan (screen) + 30-digit re-evaluation of the selected windows (not ball arithmetic).
import json, math, os, sys, time
import numpy as np
import mpmath as mp
mp.mp.dps = 30
HERE = os.path.dirname(os.path.abspath(__file__))
out = {}

# ---------------- Part 1: Lemma S, the pointwise inequality ----------------
def G(x): return mp.digamma(mp.mpc(0.25, x/2))/2 - mp.log(mp.pi)/2
rows = []
for t in (43, 100, 1000, 10**5):
    t = mp.mpf(t); Gt = G(t); worst = (0, 0)
    xs = [t + d for d in [mp.mpf(k)/200*t for k in range(-100, 101) if k != 0]]            # |x-t| <= t/2
    xs += [t + s*t*mp.mpf(r) for s in (-1, 1) for r in (0.5001, 0.6, 0.75, 1, 1.0001, 1.5, 2, 3, 5, 10, 100, 1e4, 1e8)]
    xs += [t + mp.mpf(10)**(-k) for k in range(1, 8)]
    for x in xs:
        r = abs(G(x) - Gt)*t/(mp.log(t)*abs(x - t))
        if r > worst[0]: worst = (r, x)
    near = max(abs(G(x) - Gt)*t/abs(x - t) for x in xs if abs(x - t) <= t/2)
    Lg = mp.log(t/(2*mp.pi))
    rows.append({'t': str(t), 'max ratio |G(x)-G(t)| t/(log t |x-t|) (claimed <= 8)': mp.nstr(worst[0], 8), 'at x': mp.nstr(worst[1], 8),
                 'near zone: max |G(x)-G(t)| t/|x-t| (claimed <= 2)': mp.nstr(near, 8),
                 '2 Re G(1/2+it) - Lg': mp.nstr(2*Gt.real - Lg, 5), 'Im G - pi/4': mp.nstr(Gt.imag - mp.pi/4, 5)})
out['Lemma S pointwise'] = rows
print(json.dumps(rows, indent=1), flush=True)

# ---------------- Part 2: K3-M, first index where Lambda_F differs from Lambda ----------------
def logser(num, den, K):   # coefficients of log(num/den) in y, num(0)=den(0)=1
    def lg(c):
        l = [mp.mpf(0)]*(K+1)
        for k in range(1, K+1):
            s = (c[k] if k < len(c) else 0)*k
            for i in range(1, k): s -= i*l[i]*(c[k-i] if k-i < len(c) else 0)
            l[k] = s/k
        return l
    a, b = lg(num), lg(den); return [x - y for x, y in zip(a, b)]
q = mp.mpf(7); v = mp.log(q)
al, be = 2*mp.cosh(0.1*v), 2*mp.cosh(0.2*v)
mem = {'HQ1 eps=1': ([1, -1, 1], [1, -2, 1]), 'HQ2 eps=0.01': ([1, -4, mp.mpf('6.01'), -4, 1], [1, -4, 6, -4, 1]),
       'HQ3 (7;0.1,0.2)': ([1, -al, 1], [1, -be, 1]), 'HQ4 (7;0.1,0.2)': ([1, al, 1], [1, -be, 1])}
k3 = {}
for nm, (nu, de) in mem.items():
    l = logser(nu, de, 8); j0 = next(k for k in range(1, 9) if abs(l[k]) > mp.mpf(10)**-25)
    # log F - log zeta = sum_k l_k y^k, y = q^(1/2-s): Lambda_F(q^k) - Lambda(q^k) = -k l_k log q * q^(k/2) * (-1)... sign: -F'/F adds k l_k log q q^(k/2) q^(-ks)
    k3[nm] = {'first k with nonzero coefficient of y^k in log f': j0, 'Lambda_F(q^j0) - Lambda(q^j0) = j0 l_j0 log q q^(j0/2)': mp.nstr(j0*l[j0]*v*q**(mp.mpf(j0)/2), 8),
              'coefficients l_1..l_4': [mp.nstr(x, 8) for x in l[1:5]]}
out['K3-M first differing atom (q = 7)'] = k3
print(json.dumps(k3, indent=1), flush=True)

# ---------------- Part 3: DEL / THIN with zeta's Arch imposed ----------------
def sieve(N):
    s = bytearray([1])*(N+1); s[0] = s[1] = 0
    for i in range(2, int(N**0.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(N+1) if s[i]]
def greedy(primes, b, half):
    Lval = 0.0; prev = 2.0; c = 0; S = set()
    def seg(x0, x1, n=8):
        h = (x1-x0)/n; return sum(((x0+(i+.5)*h)**(b-1))/math.log(x0+(i+.5)*h) for i in range(n))*h
    for p in primes[1:]:
        Lval += seg(prev, float(p)); prev = float(p)
        tgt = math.floor(Lval/2) if half else math.floor(Lval)
        if tgt > c: c += 1; S.add(p)
    return S
def overlaps_np(a, u, K):          # O[j,k] = (2/u) int_a^u sin(j pi s/u) sin(k pi (s-a)/u) ds, closed form; a: array
    a = np.asarray(a)[:, None, None]
    j = np.arange(1, K+1)[None, :, None]*math.pi/u; k = np.arange(1, K+1)[None, None, :]*math.pi/u
    dm = j - k; dp = j + k
    with np.errstate(divide='ignore', invalid='ignore'):
        t1 = np.where(np.abs(dm) > 1e-14, (np.sin(dm*u + k*a) - np.sin(dm*a + k*a))/np.where(np.abs(dm) > 1e-14, dm, 1.0), (u - a)*np.cos(k*a))
    t2 = (np.sin(dp*u - k*a) - np.sin(dp*a - k*a))/dp
    O = (t1 - t2)/u
    return np.where(a < u, O, 0.0)
def overlap_mp(a, u, jj, kk):
    al, be = jj*mp.pi/u, kk*mp.pi/u
    if a >= u: return mp.mpf(0)
    t1 = (u - a)*mp.cos(be*a) if jj == kk else (mp.sin((al-be)*u + be*a) - mp.sin((al-be)*a + be*a))/(al-be)
    t2 = (mp.sin((al+be)*u - be*a) - mp.sin((al+be)*a - be*a))/(al+be)
    return (t1 - t2)/u

THETA = 0.75; K = 6
def setup(P):
    pr = sieve(P)
    pp = []    # (n, p, k)
    for p in pr:
        n = p; k = 1
        while n < P: pp.append((n, p, k)); n *= p; k += 1
    pp.sort()
    return pr, pp
def errK(t, P, nprime):          # bound for (|E_M| + E_0 n' n)/Lg with norm(h_0) = 1, norm(h_0') = nprime (Proposition M, candidate (M))
    Lg = math.log(t/(2*math.pi)); u = math.log(P)
    eps = 16*math.log(t)/t*nprime
    EM = eps*(2*Lg + 4.2*math.sqrt(P)) + eps**2 + 10*Lg/t**2
    E0 = 16*(math.log(t)/t)*(3*Lg + 4.2*math.sqrt(P)) + 4*u*math.sqrt(P)*t**-2*Lg*nprime
    return (EM + E0*nprime)/Lg

res3 = {}
for (T0, W, dt, b) in ((1.0e6, 2000.0, 0.05, 0.75), (1.0e6, 2000.0, 0.05, 0.9), (1.0e5, 2000.0, 0.05, 0.75)):
    P = int(math.floor(T0**THETA)); u = math.log(P)
    pr, pp = setup(P)
    allpr = sieve(max(P, 100))
    S_del = greedy(allpr, b, False); S_thin = greedy(allpr, b, True)
    nn = np.array([n for n, p, k in pp], dtype=float); ln = np.log(nn)
    w_z = np.array([math.log(p)/math.sqrt(n) for n, p, k in pp])
    w_del = np.array([0.0 if p in S_del else math.log(p)/math.sqrt(n) for n, p, k in pp])
    w_thin = np.array([((-1)**k if p in S_thin else 1)*math.log(p)/math.sqrt(n) for n, p, k in pp])
    print(f"PLAN: T0={T0} P={P} u={u:.3f} prime powers={len(pp)} heights={int(W/dt)}; overlap array {len(pp)*K*K*8/1e6:.1f} MB; chunk phases {2000*len(pp)*16/1e6:.0f} MB", flush=True)
    O = overlaps_np(ln, u, K).reshape(len(pp), K*K)
    # check of the closed form against quadrature at two shifts (mp)
    chk = max(abs(overlap_mp(mp.log(n), mp.mpf(u), j, k) - (2/mp.mpf(u))*mp.quad(lambda s: mp.sin(j*mp.pi*s/u)*mp.sin(k*mp.pi*(s-mp.log(n))/u), [mp.log(n), u]))
              for n in (2, 97) for j in (1, 3) for k in (1, 2, 3))
    ts = T0 + (np.arange(int(W/dt)) + 0.5)*dt
    stats = {nm: {'min': (1e9, 0.0, None), 'count_below': 0} for nm in ('zeta', 'DEL', 'THIN')}
    err_unif = errK(T0, P, K*math.pi/u)
    t_start = time.time()
    lam_all = {nm: [] for nm in stats}
    for c0 in range(0, len(ts), 2000):
        tc = ts[c0:c0+2000]
        ph = np.exp(-1j*np.outer(tc, ln))
        Lg = np.log(tc/(2*math.pi))
        for nm, w in (('zeta', w_z), ('DEL', w_del), ('THIN', w_thin)):
            Bm = ((ph*w) @ O).reshape(len(tc), K, K)
            Q = Lg[:, None, None]*np.eye(K)[None] - (Bm + np.conj(np.transpose(Bm, (0, 2, 1))))
            ev, vec = np.linalg.eigh(Q)
            lam = ev[:, 0]; lam_all[nm].append(lam)
            i = int(np.argmin(lam))
            if lam[i] < stats[nm]['min'][0]: stats[nm]['min'] = (float(lam[i]), float(tc[i]), vec[i, :, 0].copy())
            stats[nm]['count_below'] += int(np.sum(lam < -err_unif))
    rec = {'P': P, 'u': u, 'u/Lg': u/math.log(T0/(2*math.pi)), 'K': K, 'b': b, 'heights': len(ts), 'range': [T0, T0+W], 'step': dt,
           'S_DEL below P': len([p for p in S_del if p < P]), 'S_THIN below P': len([p for p in S_thin if p < P]), 'S_DEL first': sorted(S_del)[:8], 'S_THIN first': sorted(S_thin)[:8],
           'uniform error bound err_K (form units, norm 1)': err_unif, 'overlap closed form vs quadrature (mp)': mp.nstr(chk, 5),
           'scan_seconds': time.time() - t_start}
    for nm in stats:
        lam = np.concatenate(lam_all[nm])
        rec[nm] = {'min lambda_min (float64)': stats[nm]['min'][0], 'at t': stats[nm]['min'][1],
                   'heights with lambda_min < -err_K': stats[nm]['count_below'], 'fraction': stats[nm]['count_below']/len(ts),
                   'median lambda_min': float(np.median(lam)), 'heights with lambda_min < 0': int(np.sum(lam < 0))}
    # 30-digit re-evaluation at the DEL and THIN minimisers, with P = floor(t^theta') at that height
    for nm, Sset, sign in (('DEL', S_del, 0), ('THIN', S_thin, -1)):
        lam0, tb, cvec = stats[nm]['min']
        tm = mp.mpf(tb); Pm = int(mp.floor(tm**mp.mpf(THETA))); um = mp.log(Pm)
        _, ppm = setup(Pm)
        cm = [mp.mpc(complex(x)) for x in cvec]; nrm = sum(abs(x)**2 for x in cm)
        npr = mp.sqrt(sum(abs(x)**2*((k+1)*mp.pi/um)**2 for k, x in enumerate(cm))/nrm)
        vals = {}
        Bz = mp.mpc(0); Bc = mp.mpc(0)
        for n, p, k in ppm:
            a = mp.log(n); ph = mp.expj(-tm*a); wz = mp.log(p)/mp.sqrt(n)
            wc = wz*(0 if (sign == 0 and p in Sset) else ((-1)**k if (sign == -1 and p in Sset) else 1))
            # only overlaps with a < u matter; quadratic form c^* O c
            qf = mp.mpc(0)
            for j in range(K):
                for kk in range(K):
                    qf += mp.conj(cm[j])*cm[kk]*overlap_mp(a, um, j+1, kk+1)
            Bz += wz*ph*qf; Bc += wc*ph*qf
        Lgm = mp.log(tm/(2*mp.pi))
        Qz = Lgm - 2*(Bz/nrm).real; Qc = Lgm - 2*(Bc/nrm).real
        e = errK(float(tm), Pm, float(npr))
        rec[nm]['30-digit re-evaluation at the minimiser'] = {'t': mp.nstr(tm, 15), 'P = floor(t^0.75)': Pm, 'norm(h_0\')/norm(h_0)': mp.nstr(npr, 8),
            'form value for the control (norm 1)': mp.nstr(Qc, 15), 'form value for zeta, same vector': mp.nstr(Qz, 15), 'Lg': mp.nstr(Lgm, 10),
            'error bound (|E_M| + E_0 n\')/Lg for this vector': e, 'violates (M) with the error term': bool(Qc < -e), 'zeta passes on this vector': bool(Qz > e),
            'coefficients c_k (float64 eigenvector)': [[float(x.real), float(x.imag)] for x in cvec]}
    res3[f'T0={T0:g}, b={b}'] = rec
    print(json.dumps(rec, indent=1, default=str), flush=True)
out['DEL / THIN with zeta Arch imposed'] = res3
json.dump(out, open(os.path.join(HERE, 'u4_ref2.json'), 'w'), indent=1, default=str)
