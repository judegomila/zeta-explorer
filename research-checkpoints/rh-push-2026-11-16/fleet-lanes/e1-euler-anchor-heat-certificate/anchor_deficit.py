# Measures the compression ratio q = S y / 2 of adjacent zero pairs of H_t at the anchor time T = C / L(x),
# using Lemma 1.5 (H_t(x) = (1/8) E xi(1/2 + sigma + i x/2), sigma ~ N(0, t/2)) and the exact identity
# q = 1 - d (v(b) - v(a)) / 4, v = H''/H' at the zeros (Lemma 1.3: S = 2/d^2 - d'/(2d), x_k' = H''/H').
import sys, json, math
from mpmath import mp, mpf, mpc, zeta, gamma, pi, findroot, exp, log
mp.dps = 30
Lval = float(sys.argv[1]); C = float(sys.argv[2]); npairs = int(sys.argv[3]); NGH = int(sys.argv[4]) if len(sys.argv) > 4 else 48
x0 = 4*math.pi*math.exp(Lval); t = C/Lval
# trapezoid rule in z (sigma = sqrt(t) z, weight exp(-z^2)); step hz = 14/NGH, |z| <= 7
hz = mpf(14)/NGH
nodes = [(k*hz, hz*exp(-(k*hz)**2)) for k in range(0, NGH//2 + 1)]
ref = None
def logxi_parts(s):
    return mp.loggamma(s/2) - (s/2)*log(pi) + log(s*(s-1)/2)
def H(x):
    # returns H_t(x) * exp(-ref), ref fixed real scaling
    global ref
    g = mpf(x)/2; st = mp.sqrt(mpf(t)); tot = mpf(0)
    for z, w in nodes:
        s = mpc(mpf(1)/2 + st*z, g)
        lg = logxi_parts(s)
        if ref is None: ref = lg.real
        val = exp(lg - ref)*zeta(s)
        tot += w*val.real*(1 if z == 0 else 2)
    return tot/mp.sqrt(pi)/8
s_mean = 4*math.pi/Lval
H(x0)
# convergence check of the quadrature
if NGH == 48:
    pass
grid = [x0 + k*s_mean/6 for k in range(int(6*(npairs+3)))]
vals = [H(x) for x in grid]
zeros = []
for i in range(len(grid)-1):
    if vals[i]*vals[i+1] < 0:
        zeros.append(findroot(H, (grid[i], grid[i+1]), solver='anderson', tol=mpf(10)**-18))
h = mpf(s_mean)*mpf('1e-4')
def v(x):
    a, b, c = H(x-h), H(x), H(x+h)
    return ((a - 2*b + c)/h**2)/((c - a)/(2*h))
vv = [v(z) for z in zeros]
rows = []
for a, b, va, vb in zip(zeros[:-1], zeros[1:], vv[:-1], vv[1:]):
    d = b - a; q = 1 - d*(vb - va)/4; S = 2*q/d**2
    defi = 1 - q
    thr = exp(-4*S*t)   # requirement (6.2) with Lambda -> 0, eta = 0: deficit < exp(-4 S T)
    depth = (log(1/defi)/(4*S)) if defi > 0 else None
    rows.append(dict(a=float(a), d_over_s=float(d/s_mean), q=float(q), deficit=float(defi),
                     a_meas=float(defi*Lval**2/(2*math.pi**2)), S_over_lattice=float(S*8*math.pi**2/Lval**2),
                     thr=float(thr), depth_over_T=(float(depth/t) if depth is not None else None),
                     c_eff=(float(log(1/defi)/Lval) if defi > 0 else None)))
out = dict(L=Lval, C=C, T=t, x0=x0, gamma0=x0/2, NGH=NGH, nzeros=len(zeros), expected=len(grid)/6,
           c_required=C/(2*math.pi**2), rows=rows)
comp = [r for r in rows if r['deficit'] > 0]
out['n_compressed'] = len(comp)
out['n_fail'] = sum(1 for r in comp if r['deficit'] >= r['thr'])
out['max_deficit'] = max(r['deficit'] for r in rows)
out['min_depth_over_T'] = min((r['depth_over_T'] for r in comp), default=None)
out['min_c_eff'] = min((r['c_eff'] for r in comp), default=None)
json.dump(out, open(__file__.rsplit('/',1)[0] + f'/anchor_L{Lval:g}_C{C:g}_n{NGH}.json', 'w'), indent=1)
print({k: out[k] for k in out if k != 'rows'})
