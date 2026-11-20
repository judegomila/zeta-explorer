import json, math, numpy as np, mpmath as mp
import lib, c4
from validate_zero import tail_mean
mp.mp.dps = 25
N = 10**7; mom = c4.load_mom('out/l1e7.mom.bin', 3)
pp = lib.prime_powers(N, kmin=2); ns = np.array([q for q, p, k in pp], float)
Mz = mom[0] + c4.atoms_to_mom(ns, [math.log(p)/p**(k/2.0) for q, p, k in pp])
alphas = np.array([0.37, 5.0, 14.134725, 21.0, 50.3, 85.6993, 99.9]); Lidx = np.array([200, 1000, 2400, 3200]); L = Lidx*c4.DELTA
S = c4.F_sum(Mz, alphas.astype(complex), Lidx).real
psi = c4.arch_alpha([0.5], 0.0, alphas, L) + c4.pole_alpha([0.5], alphas, L) - S
allpp = lib.prime_powers(N); ln = np.log(np.array([q for q, p, k in allpp], float)); w = np.array([math.log(p)/p**(k/2.0) for q, p, k in allpp])
Z = json.load(open('../s3-truncated-euler-strip/zeros_ZETA.json')); gz = np.array([float(x) for x in Z['gamma']]); g = np.concatenate([gz, -gz])
worst = wz = 0; brz = lib.bridge('zeta')
for i, a in enumerate(alphas):
    for j, l in enumerate(L):
        m = ln < l
        ref = float(lib.Cfun_alpha(brz, l, a)) - float(np.sum(w[m]*(l - ln[m])*np.cos(a*ln[m])))
        zs = float(np.sum((1 - np.cos((g - a)*l))/(g - a)**2)) + tail_mean(2000.0, 1)
        worst = max(worst, abs(ref - psi[i, j])); wz = max(wz, abs(zs - psi[i, j]))
        if j == 3: print('alpha %8.4f L %5.2f  cells %.9f  direct %.9f  zero side %.6f' % (a, l, psi[i, j], ref, zs))
print('max |cell-moment path - direct prime sum| =', worst, ' max |cell path - zero side| =', wz)
# DH: cell moments vs direct, and vs zero side
Md = np.fromfile('out/dhl7.mom.bin', dtype=np.longdouble).reshape(c4.NCELL, c4.KM).astype(float)
lam = lib.dh_lambda(10**6); n = np.nonzero(lam)[0]; lnd = np.log(n); wd = lam[n]/np.sqrt(n)
D = json.load(open('../s3-truncated-euler-strip/zeros_DH.json'))
on = np.array([float(x) for x in D['online']]).astype(complex); off = np.array([complex(float(o[1]), -(float(o[0]) - 0.5)) for o in D['offline']])
gd = np.concatenate([on, off, off.conj()]); gd = np.concatenate([gd, -gd])
Ld = np.array([200, 1000, 2400, 2760]); S = c4.F_sum(Md, alphas.astype(complex), Ld).real
psid = c4.arch_alpha([1.5], math.log(5), alphas, Ld*c4.DELTA) - S
wd1 = wd2 = 0; brd = lib.bridge('odd', N=5)
for i, a in enumerate(alphas):
    for j, l in enumerate(Ld*c4.DELTA):
        m = lnd < l
        ref = float(lib.Cfun_alpha(brd, l, a)) - float(np.sum(wd[m]*(l - lnd[m])*np.cos(a*lnd[m])))
        zs = float(np.sum(((1 - np.cos((gd - a)*l))/(gd - a)**2).real)) + tail_mean(2000.0, 5)
        wd1 = max(wd1, abs(ref - psid[i, j])); wd2 = max(wd2, abs(zs - psid[i, j]))
        if j == 3: print('DH alpha %8.4f L %5.2f  cells %.8f  direct %.8f  zero side %.5f' % (a, l, psid[i, j], ref, zs))
print('DH max |cells - direct| =', wd1, ' max |cells - zero side| =', wd2)
json.dump(dict(zeta_cells_vs_direct=worst, zeta_cells_vs_zero=wz, dh_cells_vs_direct=wd1, dh_cells_vs_zero=wd2), open('c4_validate.json', 'w'))
