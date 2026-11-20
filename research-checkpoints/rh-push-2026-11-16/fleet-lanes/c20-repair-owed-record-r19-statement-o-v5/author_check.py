# author-side numeric sanity checks of four quoted facts (mpmath, seconds); not part of the referee's work
import mpmath as mp
mp.mp.dps = 30
out = {}
# (1) Liouville cross atom at 12 and 6
l2, l3 = mp.log(2), mp.log(3)
out['mu_cross_12_liouville'] = float(2 * (-l3) * (l2))      # Lambda(3) = -log 3, Lambda(4) = +log 2
out['mu_cross_6_liouville'] = float(2 * (-l2) * (-l3))
# (2) Arch density
rho = lambda x: (mp.re(mp.digamma(mp.mpf(1)/4 + 1j*x/2)) - mp.log(mp.pi)) / (2*mp.pi)
x0 = mp.findroot(rho, 6.3)
out['rho0'] = float(rho(0)); out['rho3'] = float(rho(3)); out['rho6'] = float(rho(6)); out['sign_change'] = float(x0)
out['negative_mass'] = float(-2 * mp.quad(rho, [0, x0]))
# (3) SG density <= 0 and G_+ density >= 0 on a grid
g1 = mp.im(mp.zetazero(1)); b = mp.mpf('0.3'); eta = mp.mpf('0.07'); bb = mp.mpf('0.2')
g298, g299 = mp.im(mp.zetazero(298)), mp.im(mp.zetazero(299)); gbar = (g298 + g299)/2
mx_sg = max(-2*mp.e**(-L/2)*(mp.cosh(b*L) - mp.cos(g1*L)) for L in mp.linspace(0, 30, 6001))
mn_gp = min(4*mp.e**(-L/2)*(mp.cosh(bb*L) - mp.cos(gbar*L)*mp.cosh(eta*L)) for L in mp.linspace(0, 30, 6001))
out['max_D_SG_grid'] = float(mx_sg); out['min_D_plus_grid'] = float(mn_gp)
# (4) SG zero at 1/2 + b: zeta(1/2+b) != 0 and numerator vanishes
s = mp.mpf(1)/2 + b; t2 = s*(1 - s) - mp.mpf(1)/4
out['SG_numerator_at_half_plus_b'] = float(t2 + b**2); out['zeta_at_half_plus_b'] = float(mp.zeta(s))
# (5) HQ2 zero distance formula against a root (q = 7, eps = 0.2: referee root 0.747293959 + 0.238267738 i)
q, eps = 7, mp.mpf('0.2')
out['HQ2_distance_formula_q7_eps0.2'] = float((2/mp.log(q)) * mp.re(mp.asinh((eps**0.25/2) * mp.e**(1j*mp.pi/4))))
import json; print(json.dumps(out, indent=1))
