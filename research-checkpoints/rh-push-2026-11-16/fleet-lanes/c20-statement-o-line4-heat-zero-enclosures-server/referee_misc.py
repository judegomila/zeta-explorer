"""Referee checks, independent code path (numpy/scipy/mpmath floats; no Arb, no code shared with the lane scripts). Not rigorous.
(1) Lemma T / P2: ratio abs H_0(t+iy)/M_sigma(t) and abs Gamma(a+ib)^2 / (Gamma(a)^2 pi b/sinh(pi b)) on a grid: must be <= 1.
(2) Lemma Q application: trapezoid sum at two steps against each other for tau = 1 at the certified centre (step halving).
(3) Items B, C: SG and NR-q at the closed-form zeros and a 400-point float winding on the half-width 0.05 squares.
(4) Item D: float winding number of N on the box [0,4] x [10,30] (dense sampling) for P = 13, 19, 29, both kinds.
"""
import json, numpy as np, mpmath as mp
from scipy.special import digamma
mp.mp.dps = 30
out = {}
# (1)
def H0(w):
    s = (1 + 1j*w)/2
    return mp.exp(mp.log(s) + mp.log(s-1) - mp.log(16) - s*mp.log(mp.pi)/2 + mp.loggamma(s/2))*mp.zeta(s)
def logM(t, sig):
    x = mp.pi*t/4
    return mp.log(mp.zeta(sig)) - mp.log(16) + 2*mp.log(sig + t/2) - sig*mp.log(mp.pi)/2 + mp.loggamma(sig/2) + (mp.log(x) - mp.log(mp.sinh(x)))/2
worst = 0
for y in ['-1.1', '-1.6', '-1.8', '-2.4', '-3']:
    sig = (1 - mp.mpf(y))/2
    for t in ['0.01', '0.5', '2', '7', '20', '100', '700', '5000']:
        t = mp.mpf(t)
        r = mp.exp(mp.log(abs(H0(t + 1j*mp.mpf(y)))) - logM(t, sig)); worst = max(worst, r)
out['lemmaT_max_ratio_absH0_over_M'] = float(worst)
worst = 0
for a in ['0.05', '0.5', '0.525', '0.8', '1']:
    for b in ['0.01', '0.3', '1', '5', '40']:
        a_, b_ = mp.mpf(a), mp.mpf(b)
        r = abs(mp.gamma(a_ + 1j*b_))**2/(mp.gamma(a_)**2*mp.pi*b_/mp.sinh(mp.pi*b_)); worst = max(worst, r)
out['P2_max_ratio'] = float(worst)
# monotonicity of M for t >= 7 at sigma = 1.05 and 2
out['M_decreasing_from_7'] = all(logM(mp.mpf(t) + mp.mpf('0.25'), s) < logM(mp.mpf(t), s) for s in [mp.mpf('1.05'), mp.mpf(2)] for t in np.arange(7, 60, 0.25))
# (2)
d = json.load(open('out_t1_first_A_p128.json')); c = d['config']
tau = mp.mpf(c['tau']); XC = mp.mpf(c['XC']); r0 = d['rects'][0]
z = XC + mp.mpf(r0['centre_dx']) + 1j*mp.mpf(r0['centre_y']); y0 = mp.mpf('-1.3')      # a third line, not used by the lane
def trap(h, U=24):
    n = int(U/h); tot = 0
    for j in range(-n, n + 1):
        w = XC + j*h + 1j*y0
        tot += H0(w)*mp.exp(-(z - w)**2/(4*tau))
    return tot*h/mp.sqrt(4*mp.pi*tau)
f1 = trap(mp.mpf('0.1')); f2 = trap(mp.mpf('0.05'))
out['trapezoid_step_halving_rel_diff_line_y0_-1.3'] = float(abs(f1 - f2)/abs(f2))
# (3)
g1 = mp.zetazero(1).imag; q = 1 + mp.sqrt(2)
def SG(s, b): return mp.zeta(s)*((s - mp.mpf(1)/2)**2 - b*b)/((s - mp.mpf(1)/2)**2 + g1*g1)
def NR(s, cc): return mp.zeta(s)*(q**(s - mp.mpf(1)/2) + cc + q**(mp.mpf(1)/2 - s))
def wind(f, c0, h, n=100):
    pts = [c0 + h*(-1 + 2*mp.mpf(k)/n) - 1j*h for k in range(n)] + [c0 + h + 1j*h*(-1 + 2*mp.mpf(k)/n) for k in range(n)] \
        + [c0 + h*(1 - 2*mp.mpf(k)/n) + 1j*h for k in range(n)] + [c0 - h + 1j*h*(1 - 2*mp.mpf(k)/n) for k in range(n)]
    v = [f(p) for p in pts]
    return float(sum(mp.arg(v[(k+1) % len(v)]/v[k]) for k in range(len(v)))/(2*mp.pi))
out['BC'] = []
for b in ['0.3', '0.4']:
    b_ = mp.mpf(b); s0 = mp.mpf(1)/2 + b_
    out['BC'].append(dict(control='SG', b=b, abs_at_zero=float(abs(SG(s0, b_))), winding=wind(lambda s: SG(s, b_), s0, mp.mpf('0.05')), zeta_winding=wind(mp.zeta, s0, mp.mpf('0.05'))))
for cc in ['2.1', '2.05']:
    c_ = mp.mpf(cc); w = (c_ + mp.sqrt(c_*c_ - 4))/2; s0 = mp.mpf(1)/2 + (mp.log(w) + 1j*mp.pi)/mp.log(q)
    out['BC'].append(dict(control='NR-q', c=cc, zero=[mp.nstr(s0.real, 18), mp.nstr(s0.imag, 18)], abs_at_zero=float(abs(NR(s0, c_))),
                          winding=wind(lambda s: NR(s, c_), s0, mp.mpf('0.05')), zeta_winding=wind(mp.zeta, s0, mp.mpf('0.05'))))
# (4)
S0 = 0.75 + 20j
def primes_upto(n): return [p for p in range(2, n + 1) if all(p % d for d in range(2, int(p**0.5) + 1))]
def stage(kind, P):
    ps = np.array(primes_upto(P), float); L = np.log(ps).sum()
    if kind == 'zeta': ch = np.ones(len(ps), complex)
    else:
        k = np.arange(1, len(ps) + 1); ch = ps**(1j*S0.imag)*np.exp(1j*(-1.0)**k*np.arccos(-ps**(S0.real - 1.0)))
    l = np.zeros(1); a = np.ones(1, complex)
    for p, cc in zip(ps, ch): l = np.concatenate([l, l + np.log(p)]); a = np.concatenate([a, a*cc])
    def N(z):
        s = 0.5 + z; T = a[None, :]*np.exp((l*l/(2*L))[None, :] - s[:, None]*l[None, :])
        D = T.sum(1); D1 = -(T*l[None, :]).sum(1)
        A = 1/s + 1/(s - 1) - 0.5*np.log(np.pi) + 0.5*digamma(s/2)
        if kind == 'zeta': return (1 + A - np.exp((1 - s)*np.log(P))/(s - 1))*D + D1
        return (s - S0)*((1 + A)*D + D1) + np.exp((S0 - s)*np.log(P))*D
    return N
out['D'] = []
for kind in ['zeta', 'U_s0']:
    for P in [13, 19, 29]:
        N = stage(kind, P); n1, n2 = 8000, 40000
        zz = np.concatenate([np.linspace(0, 4, n1, endpoint=False) + 10j, 4 + 1j*np.linspace(10, 30, n2, endpoint=False),
                             np.linspace(4, 0, n1, endpoint=False) + 30j, 1j*np.linspace(30, 10, n2, endpoint=False)])
        v = np.concatenate([N(zz[i:i+2000]) for i in range(0, len(zz), 2000)])
        dphi = np.angle(np.roll(v, -1)/v)
        out['D'].append(dict(kind=kind, P=P, float_winding=float(dphi.sum()/(2*np.pi)), max_phase_step=float(abs(dphi).max())))
print(json.dumps(out, indent=1)); json.dump(out, open('referee_misc.json', 'w'), indent=1)
