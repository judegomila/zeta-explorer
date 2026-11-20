# validation on cases with known answers
import math, time, json
from flint import arb, acb, ctx
import olib, slib
olib.setprec(256)
out = {}
# 1. xi functional equation and DH functional equation; DH zero at 0.808517 + 85.699348 i
s = acb(0.3, 7.7)
out['xi_fe'] = float(abs(olib.xi(s) - olib.xi(1 - s))/abs(olib.xi(s)))
out['dh_fe'] = float(abs(olib.lam_dh(s) - olib.lam_dh(1 - s))/abs(olib.lam_dh(s)))
out['dh_zero_abs'] = float(abs(olib.lam_dh(acb('0.808517', '85.699348')))/abs(olib.lam_dh(acb('0.75', '85.3'))))
for k in ('chi-4', 'chi5'):
    L = olib.make_lambda(k); out[k + '_fe'] = float(abs(L(s) - L(1 - s))/abs(L(s)))
# 2. kernel transform against Lambda: Xi(w) = xi(1/2 + i w/2); heat tau = 0 quadrature
X = olib.heat_xi(0.0)
w = acb(11.3, 0.4)
out['heat0_vs_xi'] = float(abs(X(w) - 8*olib.xi(acb(0.5) + acb(0, 1)*w/2))/abs(X(w)))
out['heat0_ratio_const'] = str((X(w)/olib.xi(acb(0.5) + acb(0, 1)*w/2)).real.str(12))
# 3. Blaschke product: inertia of the Schur Gram = number of right-half-plane poles (known answer)
import random
random.seed(1)
def bl(alphas):
    def f(z):
        v = acb(1)
        for al in alphas:
            v = v*(z - al)/(z + al.conjugate())
        return v
    return f
good = [acb(0.3 + 0.1*i, 1.0*i) for i in range(6)]          # zeros in RHP: Schur
th = bl(good)
Z = [acb(0.05 + 0.4*random.random(), 6*random.random()) for _ in range(14)]
G = olib.schur_gram([th(z) for z in Z], Z)
out['blaschke6_inertia_14nodes'] = olib.inertia(G)[:3]
def anti(alphas, bad):
    f0 = bl(alphas); f1 = bl(bad)
    return lambda z: f0(z)/f1(z)
th2 = anti(good, [acb(0.2, 2.5), acb(0.1, 4.0)])
G = olib.schur_gram([th2(z) for z in Z], Z)
out['blaschke6_over_2_inertia_14nodes'] = olib.inertia(G)[:3]
# 4. zeta: Theta Schur at low nodes (a = 0.1), E_b = 0.3 not Schur
Z = [acb(0.05, 10 + 0.7*j) for j in range(16)]
for key in ('zeta', 'chi-4', 'E_b=0.3', 'DH'):
    th = olib.make_theta(key, 0.1)
    G = olib.schur_gram([th(z) for z in Z], Z)
    out['gram16_' + key] = olib.inertia(G)[:3]
# 5. smooth ordinates near 100
out['smooth_ord_29'] = float(olib.smooth_ordinate(29, 98.8)); out['zero_29'] = float(acb.zeta_zero(29).imag)
print(json.dumps(out, indent=1))
