"""coefficient side of the box functional against the zero side (zeros to T = 2000 + mean tail)."""
import json, math, numpy as np, mpmath as mp
from lib import *
mp.mp.dps = 30
def coef_side(br, ns, ws, rs):
    out = []
    ln = np.log(ns)
    for r in rs:
        m = ln <= r
        out.append(float(Cfun(br, r)) - float(np.sum(ws[m]*(r - ln[m]))))
    return np.array(out)
def tail_mean(T, N, d=1):
    # sum over |gamma| > T of 1/gamma^2, density (d/2pi) log(N (t/2pi)^d)/... per unit t, both signs
    f = lambda t: (1/(2*math.pi))*(math.log(N) + d*math.log(t/(2*math.pi)))/t**2
    return 2*float(mp.quad(f, [T, mp.inf]))
def zero_side(gs, rs, T, N, d=1):
    # gs: complex array of all gamma with Re gamma > 0 (upper half), both members of off-line pairs included
    out = []
    for r in rs:
        v = 2*np.sum(((1 - np.cos(gs*r))/gs**2).real)
        out.append(v + tail_mean(T, N, d))
    return np.array(out)
rs = np.array([0.3, 0.7, 1.0, 1.5, 2.0, 3.0, 4.5, 6.0, 8.0, 10.0, 12.0, 13.5])
NMAX = 10**6
pp = prime_powers(NMAX); ns = np.array([q for q, p, k in pp], float)
res = {}
# zeta
Z = json.load(open('../s3-truncated-euler-strip/zeros_ZETA.json'))
key = [k for k in Z if isinstance(Z[k], list)][0]
gz = np.array([float(x) for x in Z[key]]); T = float(Z.get('H', gz.max()))
for name in ('zeta', 'L_chi-4', 'Ea0.10', 'TNR3_2.2', 'TNR3_2.2zb'):
    o = [x for x in OBJ if x['name'] == name][0]
    ws = np.array([obj_weight(o, p, k) for q, p, k in pp]); br = obj_bridge(o)
    cs = coef_side(br, ns, ws, rs)
    if name == 'zeta': zs = zero_side(gz.astype(complex), rs, T, 1)
    elif name == 'Ea0.10':
        g = np.concatenate([gz + 0.10j, gz - 0.10j]); zs = zero_side(g, rs, T, 1, d=2)
    elif name.startswith('TNR'):
        q0, c = o['tnr']; dl = math.acosh(c/2)/math.log(q0); kk = np.arange(0, 200000)
        g = np.concatenate([(2*kk + 1)*math.pi/math.log(q0) + 1j*dl, (2*kk + 1)*math.pi/math.log(q0) - 1j*dl])
        zs = zero_side(gz.astype(complex), rs, T, 1)
        fac = np.array([2*np.sum(((1 - np.cos(g*r))/g**2).real) for r in rs])
        fac += 2*2/((2*kk[-1] + 2)*math.pi/math.log(q0))*math.log(q0)/(2*math.pi)   # tail of the factor zeros
        zs = zs + fac
        if not o['own']: zs = zs - rs*math.log(q0)       # zeta's bridge lacks the conductor term r log q0
    else:
        import flint
        zs = None
    res[name] = dict(coef=cs.tolist(), zero=None if zs is None else zs.tolist(), maxdiff=None if zs is None else float(np.max(np.abs(cs - zs))))
    print(name, 'max |coef - zero| =', res[name]['maxdiff'], ' values', np.round(cs, 6)[:8])
# DH
D = json.load(open('../s3-truncated-euler-strip/zeros_DH.json'))
on = np.array([float(x) for x in D['online']]).astype(complex)
off = np.array([complex(float(o[1]), -(float(o[0]) - 0.5)) for o in D['offline']])   # gamma = (rho-1/2)/i = t - i(beta-1/2)
g = np.concatenate([on, off, off.conj()])
lam = dh_lambda(NMAX); n = np.nonzero(lam)[0]
cs = coef_side(bridge('odd', N=5), n.astype(float), lam[n]/np.sqrt(n), rs)
zs = zero_side(g, rs, float(D['H']), 5)
print('DH max |coef - zero| =', float(np.max(np.abs(cs - zs))), np.round(cs, 5), np.round(zs, 5))
res['DH'] = dict(coef=cs.tolist(), zero=zs.tolist(), maxdiff=float(np.max(np.abs(cs - zs))))
json.dump(dict(rs=rs.tolist(), res=res), open('validate_zero.json', 'w'), indent=1)
