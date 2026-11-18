"""Convergence analysis of the optimal duals on the doubling grid (reads out/opt_*.npz)."""
import numpy as np, math, json, glob, sys
D = 'tmp/research-2026-11-16/push/e1-cofinal-legendre-dual/out/'
xs = sorted(int(f.split('_')[-1][:-4]) for f in glob.glob(D + 'opt_*.npz'))
P = {}
for x in xs:
    d = np.load(D + f'opt_{x}.npz'); J = d['J']; G = np.maximum.accumulate(np.maximum(d['G'], 0)); 
    P[x] = dict(J=J, G=G, u=float(d['u']), v=float(d['v']), val=float(d['value']))
def Gat(x, t):
    p = P[x]; i = np.searchsorted(p['J'], t, side='right') - 1   # G at largest J-point <= t
    return np.where(i >= 0, p['G'][np.maximum(i, 0)], 0.0)
rows = []
print("== A. scalars ==")
print("x  nu1/sqrt(x)  alpha=v/x  gamma=w/x  v*log(x)/x  tau1=x/v  tau1/log(x)  G(x)/sqrt(x)  frac mass on t<=sqrt(x)")
for x in xs:
    p = P[x]; a = p['v'] / x; g = (p['u'] + p['v'] * math.log(x)) / x
    s = math.isqrt(x)
    r = dict(x=x, nu1_sqrt=p['val'] / math.sqrt(x), alpha=a, gamma=g, vlog=a * math.log(x), tau1=1 / a,
             tau1_over_log=1 / (a * math.log(x)), Gx_sqrt=p['G'][-1] / math.sqrt(x), head_frac=float(Gat(x, s)) / p['G'][-1])
    rows.append(r)
    print(f"{x:8d} {r['nu1_sqrt']:.4f} {a:.4f} {g:.4f} {r['vlog']:.4f} {r['tau1']:.4f} {r['tau1_over_log']:.4f} {r['Gx_sqrt']:.2f} {r['head_frac']:.2e}")
print("\n== B. tau=1 normalisation, fixed t: G_x(j) ==")
js = [1, 2, 3, 5, 8, 12, 16, 24, 32, 48, 64, 100]
print("x " + " ".join(f"j={j}" for j in js) + " | Cheb check max_j<=sqrt(x)/2 [G(2j)-G(j) - (3+2 alpha j log2)]")
for x in xs:
    p = P[x]; a = p['v'] / x; s = math.isqrt(x)
    jj = np.arange(1, s // 2 + 1)
    ch = float(np.max(Gat(x, 2 * jj) - Gat(x, jj) - (3 + 2 * a * jj * math.log(2))))
    print(f"{x:8d} " + " ".join(f"{float(Gat(x, j)):.3f}" for j in js) + f" | {ch:.3f}")
print("\n== C. distances between the optimum at x and at 2x ==")
print("x->2x | d_vague = sum_{j<=100} |G_x(j)-G_2x(j)|/j^2 | max_{j<=100}|dG|/(1+G) | density-1: sum_{j<=100}|psi_x-psi_2x|/j^2 | "
      "scale profile sup_{m<=32} |E_x(m)-E_2x(m)|, E_x(m)=(G_x(x/m)-alpha_x x/m)/sqrt(x/m) | corr of E profiles")
out = []
for x in xs:
    if 2 * x not in P: continue
    j = np.arange(1, 101)
    g1 = Gat(x, j); g2 = Gat(2 * x, j)
    dv = float(np.sum(np.abs(g1 - g2) / j ** 2)); dm = float(np.max(np.abs(g1 - g2) / (1 + np.maximum(g1, g2))))
    t1 = x / P[x]['v']; t2 = 2 * x / P[2 * x]['v']
    dd = float(np.sum(np.abs(t1 * g1 - t2 * g2) / j ** 2)); nn = float(np.sum(np.abs(t1 * g1) / j ** 2))
    m = np.arange(1, 33)
    E1 = (Gat(x, x // m) - P[x]['v'] / x * (x // m)) / np.sqrt(x / m)
    E2 = (Gat(2 * x, 2 * x // m) - P[2 * x]['v'] / (2 * x) * (2 * x // m)) / np.sqrt(2 * x / m)
    de = float(np.max(np.abs(E1 - E2))); cc = float(np.corrcoef(E1, E2)[0, 1])
    out.append(dict(x=x, d_vague=dv, d_max=dm, d_dens1=dd, norm_dens1=nn, d_profile=de, corr_profile=cc))
    print(f"{x:8d} | {dv:.4f} | {dm:.4f} | {dd:.4f} (norm {nn:.3f}) | {de:.3f} | {cc:+.3f}")
print("\n== D. excess profile E_x(m), m = 1,2,3,4,6,8,16,32 ==")
for x in xs:
    m = np.array([1, 2, 3, 4, 6, 8, 16, 32])
    E = (Gat(x, x // m) - P[x]['v'] / x * (x // m)) / np.sqrt(x / m)
    print(f"{x:8d} " + " ".join(f"{e:+.3f}" for e in E))
print("\n== E. log-scale mass profile: G_x(x^theta)/(alpha x^theta), theta = .2,.3,.4,.5,.6,.7,.8,.9,1 ==")
for x in xs:
    th = np.array([.2, .3, .4, .5, .6, .7, .8, .9, 1.0]); t = np.floor(x ** th + 1e-9).astype(np.int64)
    a = P[x]['v'] / x
    print(f"{x:8d} " + " ".join(f"{float(Gat(x, tt)) / (a * tt):.3f}" for tt in t))
json.dump(dict(scalars=rows, distances=out), open(D + 'analysis.json', 'w'), indent=1)
