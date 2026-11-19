# prep: torus-side quantities for the Laurent / gamma-coupled first-moment brackets (float64 quadrature; MEASURED).
# E_P(w) = prod_p (1 - p^-1/2 w_p)^-1 (zeta), D_P(w) = c1 E_P(chi w) + c2 E_P(conj(chi) w) (DH, conductor 5).
import numpy as np, json, math, itertools
from scipy.optimize import minimize
kap = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
c1, c2 = (1 - 1j*kap)/2, (1 + 1j*kap)/2
CHI = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}
def E(P, w, tw=None):
    r = 1
    for i, p in enumerate(P):
        x = w[i] if tw is None else w[i]*tw[i]
        r = r/(1 - p**-0.5*x)
    return r
def D(P, w):
    ch = [CHI[p % 5] for p in P]
    return c1*E(P, w, ch) + c2*E(P, w, [np.conj(x) for x in ch])
out = {}
print('planned allocation: grids up to 160^3 complex128 = %.2f GB x few' % (160**3*16/1e9))
for P in ([2], [2, 3], [2, 3, 7], [2, 3, 7, 11]):
    n = 160 if len(P) <= 3 else 48
    th = 2*np.pi*np.arange(n)/n
    G = np.meshgrid(*([th]*len(P)), indexing='ij'); w = [np.exp(1j*g) for g in G]
    e = E(P, w); d = D(P, w)
    rec = {'grid': n, 'sum_arcsin_deg': sum(math.degrees(math.asin(p**-0.5)) for p in P),
           'min_Re_E': float(e.real.min()), 'max_Re_E': float(e.real.max()), 'mean_E': complex(e.mean()),
           'L1_E': float(np.abs(e).mean()), 'min_Re_D': float(d.real.min()), 'max_Re_D': float(d.real.max()),
           'mean_D': complex(d.mean()), 'L1_D': float(np.abs(d).mean()), 'min_abs_D': float(np.abs(d).min()),
           'min_abs_E': float(np.abs(e).min())}
    # gamma-coupled brackets  B_G(m)/2 = 1 + conj( int F_P m dHaar )
    for nm, F in (('zeta', e), ('DH', d)):
        rec['BG_half_%s_m=-conjF/|F|' % nm] = complex(1 + np.conj((F*(-np.conj(F)/np.abs(F))).mean()))
        rec['BG_half_%s_m=-conjF/F' % nm] = complex(1 + np.conj((F*(-np.conj(F)/F)).mean()))
        rec['BG_half_%s_m=1' % nm] = complex(1 + np.conj(F.mean()))
    out[str(P)] = rec; print(P, json.dumps(rec, default=str))
# Test A parameters: w_hat = (e^{i th_2}, s e^{i th_p}); minimise Re E(w_hat) / Re D(w_hat)
P = [2, 3, 7]
for s in (0.7, 0.8, 0.9):
    for nm, F in (('zeta', E), ('DH', D)):
        best = None
        for x0 in itertools.product([0.5, 2.0, 3.5, 5.0], repeat=3):
            f = lambda th: (F(P, [np.exp(1j*th[0]), s*np.exp(1j*th[1]), s*np.exp(1j*th[2])])).real
            r = minimize(f, x0, method='Nelder-Mead', options={'xatol': 1e-10, 'fatol': 1e-13})
            if best is None or r.fun < best.fun: best = r
        th = [float(x % (2*np.pi)) for x in best.x]
        wh = [np.exp(1j*th[0]), s*np.exp(1j*th[1]), s*np.exp(1j*th[2])]
        out['testA_%s_s=%g' % (nm, s)] = {'theta': th, 'E_hat': complex(E(P, wh)), 'D_hat': complex(D(P, wh))}
        print('testA', nm, s, th, 'E_hat', complex(E(P, wh)), 'D_hat', complex(D(P, wh)))
json.dump(out, open('prep.json', 'w'), indent=1, default=str)
