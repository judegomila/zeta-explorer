# Sanity checks of the referee's own kernels before any comparison with the lane's stored signs.
import sys, os, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from flint import arb, acb, ctx
import item6_kern as K
from fractions import Fraction
P = lambda s: K.Pt(Fraction(s))

out = {}
K.setprec(200)
t0 = time.time()
# 1. zeta kernel even (functional equation) and K3 even; value of K3 positive
z1, z2 = K.zeta_pol(P('0.7'))[0], K.zeta_pol(P('-0.7'))[0]
out['zeta_pol_even_defect'] = float(abs(z1 - z2).abs_upper())
k1, k2 = K.zeta_k3(P('1.1')), K.zeta_k3(P('-1.1'))
out['zeta_k3_even_defect'] = float(abs(k1[0] - k2[0]).abs_upper())
out['zeta_k3_odd_deriv_defect'] = float(abs(k1[1] + k2[1]).abs_upper())
out['zeta_k3(0.3)'] = float(K.zeta_k3(P('0.3'))[0].real.mid())
# closed form of K3 against the jet form
out['k3_closed_vs_jet'] = float(abs(K._k3zeta_point(acb(arb(3)/10), 40) - K.zeta_k3(P('0.3'))[0]).abs_upper())
# 2. characters: K(-u) = conj K(u); DH coefficient ratios
for (q, lab) in [(3, 2), (4, 3), (5, 2), (5, 4), (7, 2), (7, 3), (7, 6), (8, 3), (8, 5), (9, 2), (9, 4), (11, 2), (11, 10),
                 (12, 11), (13, 2), (13, 5), (13, 12)]:
    a = K.chi_jet(q, lab, P('0.35'))[0]
    b = K.chi_jet(q, lab, P('-0.35'))[0]
    out['chi%d.%d_fe_defect' % (q, lab)] = float(abs(b - a.conjugate()).abs_upper() / abs(a).abs_lower())
    vals, par = K.chi_values(q, lab)
    out['chi%d.%d_parity' % (q, lab)] = par
oc = K.chi_omega_conj(5, 2)
vals, par = K.chi_values(5, 2)
r = [float((oc * vals[n]).real.mid()) for n in (1, 2, 3, 4)]
out['dh_coef_ratio'] = [x / r[0] for x in r]
# 3. E_a: E*(i, 0.7) and evenness
a = (Fraction(1, 5), Fraction(0))
out['E*(i,0.7)'] = float(K.ea_pol(P('0'), a)[0].real.mid())
e1, e2 = K.ea_pol(P('0.9'), a)[0], K.ea_pol(P('-0.9'), a)[0]
out['ea_even_defect'] = float(abs(e1 - e2).abs_upper())
e1, e2 = K.ea_k3(P('0.9'), a)[0], K.ea_k3(P('-0.9'), a)[0]
out['ea_k3_even_defect'] = float(abs(e1 - e2).abs_upper())
out['ea_k3(0.9)'] = float(e1.real.mid())
ac = (Fraction(1, 5), Fraction(3))
e1, e2 = K.ea_pol(P('0.6'), ac)[0], K.ea_pol(P('-0.6'), ac)[0]
out['eis_even_defect'] = float(abs(e1 - e2).abs_upper())
# 4. jets: derivative from jet against finite difference of values (zeta, chi, E_a)
h = arb(1) / 10 ** 12
for nm, f in [('zeta', K.zeta_pol), ('chi7.2', lambda u: K.chi_jet(7, 2, u)), ('ea', lambda u: K.ea_pol(u, a)),
              ('thw', lambda u: K.thw_pol(u, Fraction(3))), ('zk3', K.zeta_k3)]:
    c = f(P('0.4'))
    fd = (f(P('0.4').add(Fraction(1, 10**12)))[0] - f(P('0.4').add(-Fraction(1, 10**12)))[0]) / (2 * h)
    out['jet_d1_defect_' + nm] = float(abs(fd - c[1]).abs_upper() / abs(c[1]).abs_lower())
    fd2 = (f(P('0.4').add(Fraction(1, 10**12)))[1] - f(P('0.4').add(-Fraction(1, 10**12)))[1]) / (2 * h)
    out['jet_d2_defect_' + nm] = float(abs(fd2 - 2 * c[2]).abs_upper() / abs(c[2]).abs_lower())
# 5. HEAT: tau = 0 returns zeta's kernel with polar terms; c(0) = 1
K.setprec(128)
zero = Fraction(0)
for u in (0.0, 0.5, 1.3, -0.8):
    hp = K.heat_pol(P(str(u)), zero)
    zp = K.zeta_pol(P(str(u)))
    out['heat_tau0_vs_zeta_u=%g' % u] = [float(abs(hp[k] - zp[k]).abs_upper()) for k in range(4)]
out['heat_c_tau0'] = float((K._heat_int(zero, None, 1) + K._heat_int(zero, None, -1)).real.mid())
tau = Fraction(-1, 2)
hp = K.heat_pol(P('0.5'), tau)
k3 = K.heat_k3(P('0.5'), tau)
# ODE check (D^2 - 1/4) Kpol = K3 on the jets
out['heat_ode_defect'] = float(abs(2 * hp[2] - hp[0] / 4 - k3[0]).abs_upper())
out['heat_pol(-0.5)(0.5)'] = float(hp[0].real.mid())
out['seconds'] = time.time() - t0
json.dump(out, open(sys.argv[1], 'w'), indent=1)
for k, v in out.items():
    print(k, v)
