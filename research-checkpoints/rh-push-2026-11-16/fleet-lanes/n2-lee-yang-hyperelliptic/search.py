"""First test: minimise the 2nd-smallest |u| sqrt(q) over root sets of N(u;z) on several domains.
Also the antisymmetrised (odd-subset) object  W_odd = (W(u;z) - z^[n] W(u;1/z))/2  (pivot).
usage: search.py q n maxsets nstarts"""
import sys, json, itertools, numpy as np
from scipy.optimize import minimize
from lylib import *
q, n, maxsets, nst = map(int, sys.argv[1:5])
chi = chi_table(q); vals = value_tables(q, n-1)
rng = np.random.default_rng(12345)
subs = [s for s in itertools.combinations(range(q), n) if s[0]==0 and s[1]==1]
if len(subs) > maxsets:
    subs = [subs[i] for i in sorted(rng.choice(len(subs), maxsets, replace=False))]
sq = q**0.5
PM = np.array([[(p>>i)&1 for i in range(n)] for p in range(2**n)])
allp = (2**n-1)
def make(cnt):
    cf = np.array(cnt, dtype=float)                    # (n, 2^n)
    cinv = cf[:, [allp ^ p for p in range(2**n)]]      # counts for z^[n] W(u;1/z)
    Cc = ((q-1)//2)**n
    def mono(z):
        return np.prod(np.where(PM==1, np.asarray(z,dtype=complex)[None,:], 1.0), axis=1)
    def Nco(z):
        m = mono(z); A = cf @ m
        co = np.zeros(n+1, dtype=complex); co[:n] += A; co[1:] -= q*A
        co[n] += Cc*np.prod(1+np.asarray(z))
        return co
    def Oco(z):   # odd part: degree <= n-1 polynomial
        m = mono(z); return (cf @ m - cinv @ m)/2
    return Nco, Oco
def rts(co):
    co = np.trim_zeros(co[::-1], 'f')
    if len(co) < 2: return np.array([np.inf])
    co = co.copy()
    # drop numerically-zero leading coefficients (roots at infinity)
    while len(co) > 2 and abs(co[0]) < 1e-13*np.abs(co).max(): co = co[1:]
    return np.roots(co)
def kth(co, k):
    a = np.sort(np.abs(rts(co)))
    return a[k]*sq if len(a) > k else np.inf
def zfrom(x, mode):
    if mode == 'torus': return np.exp(1j*x)
    if mode == 'poly':  return np.abs(np.sin(x[:n]))*np.exp(1j*x[n:])
    if mode == 'real':  return np.cos(x)+0j
    if mode == 'diag':  return np.full(n, abs(np.sin(x[0]))*np.exp(1j*x[1]))
    if mode == 'rdiag': return np.full(n, np.cos(x[0])+0j)
dims = {'torus': n, 'poly': 2*n, 'real': n, 'diag': 2, 'rdiag': 1}
out = []
for es in subs:
    cnt = counts(q, list(es), vals, chi)
    Nco, Oco = make(cnt)
    rm = np.sort(np.abs(rts(Nco(-np.ones(n)))))*sq
    r1 = rts(Nco(np.ones(n)))
    assert abs(rm[0]-1/sq) < 1e-9 and np.allclose(rm[1:], 1, atol=1e-6), rm     # Weil at z=-1
    assert np.allclose(r1, 1, atol=5e-2), r1                                      # (1-u)^n at z=+1
    assert np.allclose(np.sort(np.abs(rts(Oco(-np.ones(n)))))*sq, 1, atol=1e-6)
    rec = {'q': q, 'n': n, 'es': list(map(int, es))}
    for obj, fco, k in (('N_second', Nco, 1), ('N_first', Nco, 0), ('odd_first', Oco, 0)):
        for mode in ('torus', 'poly', 'real', 'diag', 'rdiag'):
            best = (np.inf, None)
            ns = nst if mode in ('torus', 'poly', 'real') else max(20, nst//3)
            for s in range(ns):
                x0 = rng.uniform(0, 2*np.pi, dims[mode])
                g = lambda x: kth(fco(zfrom(x, mode)), k)
                r = minimize(g, x0, method='Nelder-Mead', options={'xatol':1e-10,'fatol':1e-13,'maxiter':4000,'maxfev':8000})
                if r.fun < best[0]: best = (float(r.fun), zfrom(r.x, mode))
            z = best[1]
            rec[f'{obj}|{mode}'] = {'min': best[0], 'z_re': [float(v.real) for v in z], 'z_im': [float(v.imag) for v in z],
                                    'roots_abs_sqrtq': [float(v) for v in np.sort(np.abs(rts(fco(z))))*sq]}
    out.append(rec)
    print(es, ' '.join(f"{k.replace('_',' ')}={v['min']:.5f}" for k, v in rec.items() if '|' in k), flush=True)
json.dump(out, open(f'search_q{q}_n{n}.json', 'w'), indent=1)
