"""zero-side predictions of the first sign failure of the box functional (combination 1), and the RH band constants."""
import json, math, numpy as np, mpmath as mp
from validate_zero import tail_mean
mp.mp.dps = 30
Z = json.load(open('../s3-truncated-euler-strip/zeros_ZETA.json')); gz = np.array([float(x) for x in Z['gamma']])
tm = tail_mean(2000.0, 1)
out = {}
# band constants: sum over all zeros of 1/gamma^2 = (log Lambda)''(1/2)
xi = lambda s: mp.log(s*(s - 1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s))
mz = mp.diff(xi, mp.mpf(1)/2, 2)
def Lam(q, par, chi):
    return lambda s: mp.log((mp.mpf(q)/mp.pi)**((s + par)/2)*mp.gamma((s + par)/2)*mp.dirichlet(s, chi))
m4 = mp.diff(Lam(4, 1, [0, 1, 0, -1]), mp.mpf(1)/2, 2); m5 = mp.diff(Lam(5, 0, [0, 1, -1, -1, 1]), mp.mpf(1)/2, 2)
out['band'] = {'zeta': [0, float(2*mz)], 'L_chi-4': [0, float(2*m4)], 'L_chi5': [0, float(2*m5)]}
print('sum 1/gamma^2 (all zeros): zeta %.10f (from zero list + tail %.10f), chi_-4 %.10f, chi_5 %.10f' % (mz, 2*np.sum(1/gz**2) + tm, m4, m5))
rs = np.arange(0.7, 60.0001, 0.002)
def first_neg(psi):
    i = np.nonzero(psi < 0)[0]; return float(rs[i[0]]) if len(i) else None
# E_a: zeros at 1/2 +- a + i gamma
for a in (0.05, 0.10, 0.25):
    g = np.concatenate([gz + 1j*a, gz - 1j*a])
    psi = np.array([2*np.sum(((1 - np.cos(g*r))/g**2).real) for r in rs]) + 2*tm
    fn = first_neg(psi)
    # leading model: -4 cosh(a r) cos(gamma_1 r)/gamma_1^2 against the mean level 2 * 2 sum 1/gamma^2
    out['Ea%.2f' % a] = dict(first_negative_r=fn, q=math.exp(fn) if fn else None, min_to_27p6=float(psi[rs <= 27.63].min()))
    print('E_a a=%.2f: zero-side first negative r = %s (q = %s); min over r <= 27.63: %.5f' % (a, fn, ('%.4g' % math.exp(fn)) if fn else None, psi[rs <= 27.63].min()))
# T-NR(q0, c): zeta zeros + factor zeros
for q0, c, own in ((3, 2.2, True), (3, 2.01, True), (3, 2.2, False)):
    dl = math.acosh(c/2)/math.log(q0); kk = np.arange(0, 100000)
    g = np.concatenate([(2*kk + 1)*math.pi/math.log(q0) + 1j*dl, (2*kk + 1)*math.pi/math.log(q0) - 1j*dl])
    rr = rs[rs <= 12]
    psi = np.array([2*np.sum((1 - np.cos(gz*r))/gz**2) + 2*np.sum(((1 - np.cos(g*r))/g**2).real) for r in rr]) + tm
    if not own: psi = psi - rr*math.log(q0)
    i = np.nonzero(psi < 0)[0]
    out['TNR%d_%g_%s' % (q0, c, 'own' if own else 'zb')] = dict(first_negative_r=float(rr[i[0]]) if len(i) else None, delta=dl, gamma_off=math.pi/math.log(q0))
    print('TNR(%d,%g,%s): delta=%.4f gamma_off=%.3f zero-side first negative r = %s' % (q0, c, 'own' if own else 'zeta bridge', dl, math.pi/math.log(q0), rr[i[0]] if len(i) else None))
json.dump(out, open('pred1.json', 'w'), indent=1)
