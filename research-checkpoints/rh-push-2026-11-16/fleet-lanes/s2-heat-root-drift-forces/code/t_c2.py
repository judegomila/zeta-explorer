import numpy as np, math, os
os.environ['RH_BACKEND'] = 'cpu'; os.environ['C2_XCUT'] = '2e6'
import combo2, ctl
p = combo2.nodeset('first', 150)
for code in ('ZETA', 'DH', 'TNR', 'EA-1/4'):
    for t in (1e-2, 2e-4):
        if code == 'DH' and t < 1e-4: continue
        Gz, i1 = combo2.gram_zero(code, t, p); Gp, i2 = combo2.gram_prime(code, t, p)
        ez = np.linalg.eigvalsh(Gz); ep = np.linalg.eigvalsh(Gp)
        print(code, t, 'max|Gz-Gp| %.2e max|G| %.2e | zero: lam_min %.3e  prime: lam_min %.3e lam_max %.3e' % (np.abs(Gz - Gp).max(), np.abs(Gz).max(), ez[0], ep[0], ep[-1]), i1, i2['r_nodes'])
