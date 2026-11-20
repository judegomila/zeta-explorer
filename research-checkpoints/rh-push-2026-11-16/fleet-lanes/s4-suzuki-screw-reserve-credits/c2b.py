"""Combination 2a: proper-power memory B(r) = sum_{p^k <= e^r, k >= 2} c(p^k) p^{-k/2} against r/2 + kappa, zeta and controls.
Primes to PMAX (so r <= 2 log PMAX)."""
import sys, json, math, numpy as np
import lib
PMAX = int(float(sys.argv[1])); out = sys.argv[2]
print('planned allocation: sieve %.2f GB, primes %.2f GB' % (PMAX/1e9, PMAX/math.log(PMAX)*1.2*8*6/1e9))
ps = lib.primes_upto(PMAX).astype(np.float64); lp = np.log(ps)
EG = 0.57721566490153286
kap_partial = float(np.sum(lp/(np.sqrt(ps)*(ps - 1))))
theta = float(np.sum(lp))
kappa = -EG + kap_partial + 2/math.sqrt(PMAX) - (theta - PMAX)/PMAX**1.5
rs = np.arange(1.4, 2*math.log(PMAX) + 1e-9, 0.1)
def B_of(amp, name):
    """amp(p array, k) -> amplitude array; returns B(r) on rs, split even/odd k"""
    Be = np.zeros(len(rs)); Bo = np.zeros(len(rs))
    k = 2
    while 2.0**k <= math.exp(rs[-1])*1.0000001:
        m = ps <= math.exp(rs[-1]/k)*1.0000001
        pk = ps[m]; t = amp(pk, k)*lp[m]/pk**(k/2.0); cs = np.concatenate([[0.0], np.cumsum(t)])
        idx = np.searchsorted(pk, np.exp(rs/k)*(1 + 1e-13), side='right')
        if k % 2 == 0: Be += cs[idx]
        else: Bo += cs[idx]
        k += 1
    return Be, Bo
res = dict(PMAX=PMAX, kappa=kappa, rs=rs.tolist(), objs={})
Be, Bo = B_of(lambda p, k: np.ones_like(p), 'zeta'); B = Be + Bo
E = B - rs/2 - kappa
odd_total = kap_partial + 2/math.sqrt(PMAX)           # sum_p log p/(sqrt p (p-1))
zero_part = Be - rs/2 + EG                            # A_1(e^{r/2}) - log(e^{r/2}) + gamma  (carries the zeros: sum over rho of y^{rho-1}/(rho-1) type)
res['objs']['zeta'] = dict(E=E.tolist(), scaled_E_exp_r6=(E*np.exp(rs/6)).tolist(), zero_part_scaled_exp_r4=(zero_part*np.exp(rs/4)).tolist(), odd_tail=(Bo - odd_total).tolist())
print('kappa = %.10f' % kappa)
for r0 in (5, 10, 15, 20, 25, 27.6, 30, 35, rs[-1]):
    i = int(np.argmin(np.abs(rs - r0)))
    print('r=%5.1f  B-r/2-kappa=%+.3e  e^{r/6}(..)=%+.4f  odd tail=%+.3e  e^{r/4}[A1(e^{r/2})-r/2+gamma]=%+.4f' % (rs[i], E[i], E[i]*math.exp(rs[i]/6), Bo[i] - odd_total, zero_part[i]*math.exp(rs[i]/4)))
h = np.vectorize(lambda p, s: lib.hash_u(int(p), s))
ctl = {
 'L_chi-4': lambda p, k: np.where(p % 2 == 0, 0.0, np.where(p % 4 == 1, 1.0, -1.0))**k,
 'liouville': lambda p, k: np.full_like(p, (-1.0)**k),
 'unimod3': lambda p, k: np.cos(3.0*k*np.log(p)),
 'Ea0.05': lambda p, k: 2*np.cosh(0.05*k*np.log(p)),
 'Ea0.25': lambda p, k: 2*np.cosh(0.25*k*np.log(p)),
}
for nm, amp in ctl.items():
    be, bo = B_of(amp, nm); d = be + bo - rs/2 - kappa
    res['objs'][nm] = dict(E=d.tolist(), even_minus_zeta_even=(be - Be).tolist())
    print('%-10s B_F - r/2 - kappa at r = 5, 10, 20, max: %+.4f %+.4f %+.4f %+.4f ; even-k part minus zeta even-k part at max r: %+.3e' % (nm, d[36], d[86], d[186], d[-1], (be - Be)[-1]))
for q0, c in ((3, 2.2), (3, 2.01)):
    ex = np.zeros(len(rs)); k = 2
    while k*math.log(q0) <= rs[-1]:
        ex += lib.tnr_extra(q0, c, k)*(rs >= k*math.log(q0) - 1e-12); k += 1
    d = E + ex; res['objs']['TNR%d_%g' % (q0, c)] = dict(E=d.tolist())
    i1 = int(np.argmax(np.abs(d) > 1.0)) if np.any(np.abs(d) > 1.0) else -1
    print('TNR%d_%g B_F - r/2 - kappa at r = 5, 10, 20: %+.3f %+.3f %+.3e ; first r with |.| > 1: %s (log q0^2 = %.3f)' % (q0, c, d[36], d[86], d[186], rs[i1] if i1 >= 0 else None, 2*math.log(q0)))
json.dump(res, open(out, 'w'))
