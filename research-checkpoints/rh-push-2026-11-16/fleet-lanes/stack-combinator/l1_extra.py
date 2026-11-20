# L1 statistic on lines approaching the abscissa of the zeros: E_a (a=0.3, zeros at x=0.3) vs zeta (Lean: none for x>3/8; RH: zeros at x=0)
import mpmath as mp, math
mp.mp.dps = 15
lz = lambda s: mp.zeta(s, derivative=1)/mp.zeta(s)
A = mp.mpf('0.3')
for x0 in (0.4, 0.33, 0.31, 0.301):
    best = {}
    for name, f in (('zeta', lz), ('E_a', lambda s: lz(s+A)+lz(s-A))):
        m = max(float(mp.re(f(mp.mpc(0.5+x0, 14.134725 + k*0.002)))) for k in range(-50, 51))
        best[name] = m/math.log(16.13)
    print(f"x0={x0}: max over |t-14.1347|<=0.1 of Re f'/f / log(t+2):  zeta {best['zeta']:.3f}   E_a(0.3) {best['E_a']:.3f}")
