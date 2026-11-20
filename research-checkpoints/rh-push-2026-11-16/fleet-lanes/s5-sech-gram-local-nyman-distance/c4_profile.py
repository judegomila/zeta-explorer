# c4_profile.py : pointwise profile of the optimal Nyman-Beurling approximant (combination 4).
#   P_N(t) = |1 - F(1/2+it) D_N(1/2+it)|^2,  D_N = sum_{n<=N} y_n n^{-s},  y = G_N^{-1} b  (exact Gram from nbcore; sign convention
#   fixed by the data: the sign for which (1/2pi) int P_N(t)/(1/4+t^2) dt over the range stays below d_N^2).
# usage: c4_profile.py <dir> <tag> <N> <kind: zeta | per q c1..cq | tnr q c> <Tmax> <out.json>
import sys, json, math, time, numpy as np, mpmath as mp
import objs
d, tag, N, kind = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
EG = 0.57721566490153286061
print(f'planned allocation: Gram {8*N*N/1e9:.2f} GB + Cholesky factor {8*N*N/1e9:.2f} GB', flush=True)
G = np.fromfile(f'{d}/gram_{tag}.bin', dtype=np.float64).reshape(N, N); n_arr = np.arange(1, N+1, dtype=np.float64)
if kind == 'zeta':
    bvec = (np.log(n_arr)+1-EG)/n_arr; Tmax = float(sys.argv[5]); outp = sys.argv[6]; coef = None
elif kind == 'per':
    q = int(sys.argv[5]); coef = [float(x) for x in sys.argv[6:6+q]]; Tmax = float(sys.argv[6+q]); outp = sys.argv[7+q]
    L1 = -sum(coef[r-1]*float(mp.digamma(mp.mpf(r)/q)) for r in range(1, q+1))/q; bvec = L1/n_arr; print('F(1) =', L1)
elif kind == 'tnr':
    q = int(sys.argv[5]); c = float(sys.argv[6]); Tmax = float(sys.argv[7]); outp = sys.argv[8]
    def beta(th):
        if th >= 1: return (math.log(th)+1-EG)/th
        X = 1/th; M = int(math.floor(X+1e-12)); Hn = sum(1.0/k for k in range(1, M+1)); return ((1-EG) - (math.log(X) - Hn + M/X))/th
    bvec = np.array([beta(n) + c*q**0.5*beta(n*q) + q*beta(n*q*q) for n in range(1, N+1)])
L = np.linalg.cholesky(G); del G
yfull = np.linalg.solve(L, bvec); d2all = 1 - np.cumsum(yfull*yfull)
h = 0.01; nT = int(round(Tmax/h)); u = (np.arange(1, nT+1)*h) - Tmax/2; T0 = Tmax/2; t = T0 + u          # t in (0, Tmax]
if kind == 'zeta': F = objs.zeta_line(T0, u)
elif kind == 'per': F = objs.periodic_line(T0, u, coef)
else:
    w = np.exp(-1j*t*math.log(q)); F = objs.zeta_line(T0, u)*(1 + c*w + w*w)       # H^2 normalisation zeta(s)(1 + c q^(1/2-s) + q^(1-2s))
aF = np.abs(F)
# zeros on the line: local minima of |F| on the grid with a small value, refined by a parabola through |F|^2
i = np.where((aF[1:-1] < aF[:-2]) & (aF[1:-1] <= aF[2:]) & (aF[1:-1] < 0.05*np.median(aF)))[0]+1
a, b0, c0 = aF[i-1]**2, aF[i]**2, aF[i+1]**2; zer = t[i] + 0.5*h*(a-c0)/(a-2*b0+c0)
print('zeros on the line found in (0, %g]: %d; first %s' % (Tmax, len(zer), zer[:3]), flush=True)
lad = [n for n in (100, 250, 500, 1000, 2000, 4000, 5000, 10000) if n <= N]
out = {'tag': tag, 'kind': kind, 'N': N, 'Tmax': Tmax, 'h': h, 'n_zeros': int(len(zer)), 'rows': []}
logn = np.log(n_arr)
for n in lad:
    y = np.linalg.solve(L[:n, :n].T, yfull[:n])                 # G_n^{-1} b
    D = np.zeros(len(t), dtype=np.complex128)
    for k0 in range(0, len(t), 2000):
        tt = t[k0:k0+2000]; D[k0:k0+2000] = np.exp(-1j*tt[:, None]*logn[None, :n]) @ (y/np.sqrt(n_arr[:n]))
    best = None
    for sgn in (+1, -1):
        Pn = np.abs(1 + sgn*F*D)**2; mass = 2*float((Pn/(0.25+t*t)).sum()*h)/(2*math.pi)
        if best is None or mass < best[1]: best = (sgn, mass, Pn)
    sgn, mass, Pn = best
    def stats(tlim):
        zz = zer[zer <= tlim]; mids = []; inner = []; mins = []
        for g0, g1 in zip(zz[:-1], zz[1:]):
            k0, k1 = np.searchsorted(t, [g0, g1]); 
            if k1-k0 < 8: continue
            seg = Pn[k0:k1]; q1 = (k1-k0)//4
            mids.append(float(seg[(k1-k0)//2])); inner.append(float(seg[q1:(k1-k0)-q1].max())); mins.append(float(seg.min()))
        k = np.searchsorted(t, tlim)
        if not mids: return {'tlim': tlim, 'gaps': 0, 'sup_all': float(Pn[:k].max()) if k else None, 'median_all': float(np.median(Pn[:k])) if k else None}
        return {'tlim': tlim, 'gaps': len(mids), 'mid_median': float(np.median(mids)), 'mid_max': float(np.max(mids)), 'inner_half_sup': float(np.max(inner)),
                'gap_min_median': float(np.median(mins)), 'sup_all': float(Pn[:k].max()), 'median_all': float(np.median(Pn[:k]))}
    kz = np.clip(np.searchsorted(t, zer), 1, len(t)-1)
    row = {'N': n, 'd2': float(d2all[n-1]), 'sign': sgn, 'mass_in_range': mass, 'at_zero_max_dev': float(np.abs(Pn[kz]-1).max()) if len(zer) else None,
           'stats': [stats(x) for x in sorted(set([Tmax] + [float(v) for v in sys.argv if v.startswith('lim=') for v in [v[4:]]]))]}
    out['rows'].append(row); print(json.dumps(row), flush=True)
json.dump(out, open(outp, 'w'), indent=1); print('C4DONE', tag)
