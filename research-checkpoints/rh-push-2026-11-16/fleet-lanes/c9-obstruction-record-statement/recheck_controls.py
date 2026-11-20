# Re-run of existing referee checks of control zeros quoted in STATEMENT_O.md (no new computation).
# Sources of the checks: c1-missing-controls/REFEREE.md (Liouville), c5-device-table-extension (interpolation twin),
# r3-tnr-control/REFEREE.md (T-NR twin), map section 2 row EA (E_a). mpmath only; memory: scalars.
import json, mpmath as mp
mp.mp.dps = 40
out = {}
# 1. Liouville twist zeta(2s)/zeta(s) at s = 1/4 + i*gamma_1/2 (zero at rho/2)
g1 = mp.zetazero(1).imag
s = mp.mpf(1)/4 + 1j*g1/2
out['liouville'] = {'s': mp.nstr(s, 15), 'abs_F': mp.nstr(abs(mp.zeta(2*s)/mp.zeta(s)), 5), 'abs_zeta_s': mp.nstr(abs(mp.zeta(s)), 6)}
# 2. E_a = zeta(s+a) zeta(s-a), a = 0.2: zero at 1/2 + a + i gamma_1
a = mp.mpf('0.2'); s = mp.mpf(1)/2 + a + 1j*g1
out['E_a'] = {'a': '0.2', 's': mp.nstr(s, 15), 'abs_F': mp.nstr(abs(mp.zeta(s+a)*mp.zeta(s-a)), 5)}
# 3. T-NR twin factor 2cosh((s-1/2) log q) + c, q = 3, c = 2.2: zero at 1/2 + arccosh(1.1)/log 3 + i pi/log 3
q = mp.mpf(3); c = mp.mpf('2.2')
s = mp.mpf(1)/2 + mp.acosh(c/2)/mp.log(q) + 1j*mp.pi/mp.log(q)
fac = lambda s: 2*mp.cosh((s-mp.mpf(1)/2)*mp.log(q)) + c
out['tnr'] = {'s': mp.nstr(s, 12), 'abs_factor': mp.nstr(abs(fac(s)), 5), 'fe_defect_factor': mp.nstr(abs(fac(s)-fac(1-s)), 5),
              'heights_below_60': len([k for k in range(0, 100) if (2*k+1)*mp.pi/mp.log(q) < 60])}
# 4. Interpolation twin zeta + L(s,chi_-4) L(s,chi_5), c = 1: zero near 0.8641 + 29.9504i; agreement at s = 0,-1,..,-5
chi4 = [0, 1, 0, -1]; chi5 = [0, 1, -1, -1, 1]
L4 = lambda s: mp.dirichlet(s, chi4); L5 = lambda s: mp.dirichlet(s, chi5)
C = lambda s: mp.zeta(s) + L4(s)*L5(s)
z = mp.findroot(C, mp.mpc('0.8641', '29.9504'))
out['twin'] = {'zero': mp.nstr(z, 10), 'abs_C': mp.nstr(abs(C(z)), 5),
               'max_abs_product_at_nonpositive_integers_0..-5': mp.nstr(max(abs(L4(-k)*L5(-k)) for k in range(0, 6)), 5)}
print(json.dumps(out, indent=1))
json.dump(out, open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), 'recheck_controls.json'), 'w'), indent=1)
