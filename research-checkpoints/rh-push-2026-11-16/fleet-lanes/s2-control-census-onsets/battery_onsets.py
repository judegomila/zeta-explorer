# Combinations 1 (twin census cross-check), 2 (Euler detector + joint statistic) and 4 (GL2 amplitude vectors):
# double-precision Weil-form onsets and finite-support detector onsets on the control battery.
import sys, os, json, math, time
for _k in ('VECLIB_MAXIMUM_THREADS', 'OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[_k] = '1'
import numpy as np
import wf, objs
NB = int(os.environ.get('NB', 170)); AMAX = float(os.environ.get('AMAX', 3.0)); WORKERS = int(os.environ.get('RH_WORKERS', 2))
PART = sys.argv[1]; OUT = sys.argv[2]
NMAX = int(math.exp(2*AMAX)) + 3
TAB = wf.sieve_mangoldt(NMAX)
B = None
SUPPORTS = [math.log(3), math.log(6), math.log(12), 3.0, 4.0, 5.0, 6.0]

def detector(c, deg=1):
    """finite-support Euler detector from c(n), n <= NMAX.
    E1: first non-prime-power n with c(n) != 0 (support log n) and running max |c(n)|/log n on non-prime-powers.
    E2: rung Toeplitz T_p^(K) = [m_|i-j|], m_0 = deg, m_k = c(p^k)/log p: first (K log p) with lambda_min < 0."""
    L, P, K = TAB; n = len(c) - 1
    npp = [(q, c[q]/math.log(q)) for q in range(2, n + 1) if L[q] == 0 and abs(c[q]) > 1e-9]
    e2 = []
    for p in [q for q in range(2, n + 1) if K[q] == 1]:
        m = [float(deg)]; pk = p
        while pk <= n: m.append(c[pk]/math.log(p)); pk *= p
        for KK in range(1, len(m)):
            T = np.array([[m[abs(i - j)] for j in range(KK + 1)] for i in range(KK + 1)])
            lm = float(np.linalg.eigvalsh(T)[0])
            if lm < -1e-9: e2.append((KK*math.log(p), p, KK, lm)); break
    e2.sort()
    def at(S):
        v1 = max([abs(v) for q, v in npp if math.log(q) < S] or [0.0])
        v2 = max([-lm for s, p, KK, lm in e2 if s < S] or [0.0])
        return v1, v2
    return dict(E1_onset=math.log(npp[0][0]) if npp else None, E1_first=npp[0] if npp else None,
                E2_onset=e2[0][0] if e2 else None, E2_first=e2[0][1:] if e2 else None, at={('%.4f' % S): at(S) for S in SUPPORTS})

def c_from_spec(s):
    c = np.zeros(NMAX + 1); n = np.rint(np.exp(s['x'])).astype(int); ok = n <= NMAX; c[n[ok]] = s['w'][ok]*np.sqrt(n[ok]); return c

def run(job):
    name, kind, par = job; t0 = time.time()
    try:
        s = build(kind, par)
        lo, hi, sec, l = B.onset(s, lo=0.15, hi=AMAX, tol=0.005)
        rec = dict(name=name, kind=kind, par=par, a_pos=lo, a_neg=hi, sector=sec, lam=l,
                   lam_at={('%.4f' % S): (B.lam(s, S/2), B.nrm) for S in SUPPORTS if S/2 <= AMAX})
        if kind != 'gl2': rec['det'] = detector(s.get('c') if s.get('c') is not None else c_from_spec(s), par.get('deg', 1) if isinstance(par, dict) else 1)
        rec['secs'] = round(time.time() - t0, 2); return rec
    except Exception as e:
        import traceback; return dict(name=name, kind=kind, err=repr(e), tb=traceback.format_exc()[-400:])

FORMS = {}
def build(kind, par):
    if kind == 'zeta': return objs.spec_zeta(NMAX, TAB)
    if kind == 'dirichlet':
        q = par['q']; chi = {-4: lambda p: 0 if p % 2 == 0 else (1 if p % 4 == 1 else -1), -3: lambda p: 0 if p % 3 == 0 else (1 if p % 3 == 1 else -1),
                             5: lambda p: 0 if p % 5 == 0 else (1 if p % 5 in (1, 4) else -1)}[q]
        return objs.spec_dirichlet_real(chi, abs(q), 1 if q < 0 else 0, NMAX, 'L(chi_%d)' % q, TAB)
    if kind == 'periodic': return objs.spec_periodic(par['a'], par['q'], par['delta'], NMAX, par.get('name', ''))
    if kind == 'arm':      # Euler arm L(s, chi), complex chi: real test functions see c(n) = Lambda(n) Re chi(n)
        L, P, K = TAB; q = par['q']; c = np.array([L[n]*par['re'][n % q] for n in range(NMAX + 1)]); x, w = wf.atoms_from_c(c)
        s = wf.arch_dirichlet(q, par['delta']); s.update(x=x, w=w, poles=(), name='arm', c=c); return s
    if kind == 'Ea': s = objs.spec_Ea(par['al'], NMAX, TAB); return s
    if kind == 'tnr': return objs.spec_tnr(par['q'], par['c'], NMAX, par['bridge'], TAB)
    if kind == 'sign':
        if par['rule'] == 'liouville': f = lambda p: -1
        elif par['rule'] == 'single': f = lambda p: -1 if p == par['P'] else 1
        elif par['rule'] == 'above': f = lambda p: -1 if p >= par['P'] else 1
        else:
            rng = np.random.Generator(np.random.PCG64(121000 + par['seed'])); L, P, K = TAB
            pr = [int(q) for q in range(2, NMAX + 1) if K[q] == 1]; e = dict(zip(pr, 1 - 2*rng.integers(0, 2, size=len(pr)))); f = lambda p: e[p]
        return objs.spec_signtwist(f, NMAX, 'SGN', TAB)
    if kind == 'unimod':
        if 'alpha' in par: return objs.spec_unimod(par['alpha'], NMAX, TAB)
        rng = np.random.Generator(np.random.PCG64(120000 + par['seed'])); L, P, K = TAB
        pr = [int(q) for q in range(2, NMAX + 1) if K[q] == 1]; u = dict(zip(pr, rng.random(len(pr))))
        n = np.nonzero(L)[0]; e = np.array([math.cos(2*math.pi*u[int(p)]*int(k)) for p, k in zip(P[n], K[n])])
        s = wf.arch_dirichlet(1, 0); s.update(x=np.log(n), w=e*L[n]/np.sqrt(n), poles=(0.5,), name='U'); return s
    if kind == 'gl2':
        k, N = par['k'], par['N']; fam = par['fam']
        if fam == 'vertex': amp = lambda p, j: 2.0*par['sign']**j
        elif fam == 'signvertex':
            rng = np.random.Generator(np.random.PCG64(5000 + par['seed'])); L, P, K = TAB
            pr = [int(q) for q in range(2, NMAX + 1) if K[q] == 1]; e = dict(zip(pr, 1 - 2*rng.integers(0, 2, size=len(pr)))); amp = lambda p, j: 2.0*float(e[p])**j
        elif fam == 'satotate':
            rng = np.random.Generator(np.random.PCG64(6000 + par['seed'])); L, P, K = TAB
            pr = [int(q) for q in range(2, NMAX + 1) if K[q] == 1]
            th = {}
            for p in pr:       # Sato-Tate angle by rejection
                while True:
                    t = rng.random()*math.pi
                    if rng.random() < math.sin(t)**2: th[p] = t; break
            amp = lambda p, j: 2*math.cos(j*th[p])
        elif fam == 'excess':      # lambda(p) = 2 + e at every prime: alpha + 1/alpha = 2 + e, alpha > 1
            lam = 2 + par['e']; al = (lam + math.sqrt(lam*lam - 4))/2; amp = lambda p, j: par.get('sign', 1)**j*(al**j + al**(-j))
        elif fam == 'Ea': amp = lambda p, j: p**(j*par['b']) + p**(-j*par['b'])
        elif fam == 'single':      # one prime q0 with lambda = sgn (2 + e); the other primes at base (0, +2 vertex, or a form)
            lam = 2 + par['e']; al = (lam + math.sqrt(lam*lam - 4))/2; base = par['base']
            fa = FORMS[base] if base in FORMS else None
            def amp(p, j):
                if p == par['q0']: return par.get('sign', 1)**j*(al**j + al**(-j))
                if base == 'zero': return 0.0
                if base == 'vertex': return 2.0
                return fa(p, j)
        elif fam == 'form': amp = FORMS[par['form']]
        return objs.spec_gl2_amp(k, N, amp, NMAX, 'gl2', TAB)
    raise ValueError(kind)

def jobs_part(part):
    J = []
    if part == 'battery':
        J.append(('zeta', 'zeta', {}))
        for q in (-4, -3, 5): J.append(('L(chi_%d)' % q, 'dirichlet', dict(q=q)))
        J.append(('DH', 'periodic', dict(a=objs.dh_coeffs(), q=5, delta=1)))
        for al in (0.05, 0.125, 0.25, 0.375, 0.45): J.append(('E_a(%g)' % al, 'Ea', dict(al=al, deg=2)))
        for q in (2, 3, 5, 7, 11, 13, 17, 23, 31, 47, 61, 97, 199, 397):
            for c in (2.2, 3.0, 1.0, -1.0):
                for br in ('own', 'zeta'): J.append(('TNR(q=%d,c=%g,%s)' % (q, c, br), 'tnr', dict(q=q, c=c, bridge=br)))
        J.append(('SGN-LIOU', 'sign', dict(rule='liouville')))
        for sd in range(12): J.append(('SGN-%02d' % sd, 'sign', dict(rule='random', seed=sd)))
        for P in (2, 3, 5, 7, 11, 13, 17, 23, 31, 47, 61, 97, 199, 397): J.append(('SGN-single(%d)' % P, 'sign', dict(rule='single', P=P)))
        for P in (3, 5, 11, 23, 47, 97, 199, 397): J.append(('SGN-above(%d)' % P, 'sign', dict(rule='above', P=P)))
        for al in (1.2393168126993495, 0.1, 0.3, 3.0, 14.134725): J.append(('WT(%g)' % al, 'unimod', dict(alpha=al)))
        for sd in range(12): J.append(('U-%02d' % sd, 'unimod', dict(seed=sd)))
    if part in ('twins', 'arms'):
        import chars44
        for q in range(3, 50):
            for ip, p in enumerate(chars44.complex_pairs(q)):
                base = 'q%d.%d' % (q, ip)
                J.append((base + '.L', 'arm', dict(re=[c.real for c in p['chi']], q=q, delta=p['delta'])))
                if part == 'arms': continue
                for t in chars44.twins(p):
                    J.append((base + ('.T+' if t['omega'] > 0 else '.T-'), 'periodic', dict(a=t['a'], q=q, delta=p['delta'])))
    if part == 'gl2':
        import gl2forms
        for nm, (k, N, amp) in gl2forms.all_forms(NMAX).items():
            FORMS[nm] = amp; J.append(('form:' + nm, 'gl2', dict(k=k, N=N, fam='form', form=nm)))
        bridges = [(2, 11), (2, 37), (2, 100), (4, 5), (12, 1), (16, 1), (24, 1), (36, 1), (2, 1000), (2, 10**5)]
        for (k, N) in bridges:
            bn = '(k=%d,N=%d)' % (k, N)
            for sg in (1, -1): J.append(('vertex%+d%s' % (2*sg, bn), 'gl2', dict(k=k, N=N, fam='vertex', sign=sg)))
            for sd in range(10): J.append(('signvertex-%d%s' % (sd, bn), 'gl2', dict(k=k, N=N, fam='signvertex', seed=sd)))
            for sd in range(10): J.append(('satotate-%d%s' % (sd, bn), 'gl2', dict(k=k, N=N, fam='satotate', seed=sd)))
            for e in (1e-3, 1e-2, 0.03, 0.1, 0.3, 1.0, 3.0):
                J.append(('excess(%g)%s' % (e, bn), 'gl2', dict(k=k, N=N, fam='excess', e=e)))
                J.append(('excess(-%g)%s' % (e, bn), 'gl2', dict(k=k, N=N, fam='excess', e=e, sign=-1)))
            for b in (0.02, 0.05, 0.1, 0.2, 0.3, 0.45, 0.75, 1.5): J.append(('Ea(b=%g)%s' % (b, bn), 'gl2', dict(k=k, N=N, fam='Ea', b=b)))
            for q0 in (2, 3, 5, 7, 11):
                for e in (1e-3, 1e-2, 0.1, 0.3, 1.0, 3.0, 10.0):
                    for base in ('zero', 'vertex'):
                        J.append(('single(q=%d,e=%g,%s)%s' % (q0, e, base, bn), 'gl2', dict(k=k, N=N, fam='single', q0=q0, e=e, base=base)))
        for nm, (k, N, amp) in gl2forms.all_forms(NMAX).items():     # one prime pushed outside the box on a genuine form
            for q0 in (2, 3, 5, 7, 11):
                if N % q0 == 0: continue
                for e in (1e-3, 1e-2, 0.1, 0.3, 1.0, 3.0):
                    J.append(('single(q=%d,e=%g) on %s' % (q0, e, nm), 'gl2', dict(k=k, N=N, fam='single', q0=q0, e=e, base=nm)))
    return J

if __name__ == '__main__':
    J = jobs_part(PART)
    print('part %s: %d objects, NB=%d AMAX=%g NMAX=%d' % (PART, len(J), NB, AMAX, NMAX), flush=True)
    B = wf.Basis(NB, cache='.')
    import multiprocessing as mp
    t0 = time.time(); res = []
    with mp.get_context('fork').Pool(WORKERS) as pool:
        for i, r in enumerate(pool.imap(run, J, chunksize=4)):
            res.append(r)
            if i % 100 == 0: print(i, r.get('name'), r.get('a_neg'), r.get('err'), '%.0fs' % (time.time() - t0), flush=True)
    json.dump(res, open(OUT, 'w'))
    print('done %.0fs' % (time.time() - t0), flush=True)
