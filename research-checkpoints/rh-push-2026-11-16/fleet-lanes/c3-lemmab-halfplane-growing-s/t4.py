"""c3 t4: (a) profile factor K(delta,Tw) = sqrt(int b^2 e^{2 delta u} int b^2 e^{-2 delta u}) / int b^2 for b = sin^6(pi u/Tw) and for a two-bump profile;
 (b) exponent function f_Theta(sigma0) = (sigma0-Theta)/((1-Theta)(sigma0-1/2)); (c) thresholds: largest Tw with 4 e^{Tw/2} < log(T/2pi) etc."""
import numpy as np, math, json
out = {}
u = np.linspace(0, 1, 400001)
def K(b, d, Tw):
    return float(np.sqrt(np.trapezoid(b**2*np.exp(2*d*Tw*u), u)*np.trapezoid(b**2*np.exp(-2*d*Tw*u), u))/np.trapezoid(b**2, u))
b6 = np.sin(np.pi*u)**6
two = np.where(u < 0.1, np.sin(np.pi*u/0.1)**6, 0) + np.where(u > 0.9, np.sin(np.pi*(u-0.9)/0.1)**6, 0)
print('Tw  delta  K_sin6  K_twobump  e^{delta Tw}')
rows = []
for Tw in [0.693, 1.946, 3.135, 5.352, 10, 20, 40]:
    for d in [0.4, 0.5, 0.75]:
        r = (Tw, d, K(b6, d, Tw), K(two, d, Tw), math.exp(d*Tw)); rows.append(r); print(' %6.3f %.2f %10.4g %10.4g %10.4g' % r)
out['K'] = rows
print('f_Theta(sigma0):')
fr = []
for Th in [0.5, 0.75, 0.875]:
    for s in [Th + 0.01, 0.9, 0.95, 1.0]:
        if s > Th: fr.append((Th, s, (s-Th)/((1-Th)*(s-0.5)))); print('  Theta %.3f sigma0 %.3f f %.4f' % fr[-1])
out['f'] = fr
print('trivial range without multiplier: largest Tw with 4.2 e^{Tw/2} <= log(T/2pi) - 2;  2 loglog T')
tr = []
for lt in [10, 23, 30, 100, 1e3, 1e6, 1e12]:
    Ob = lt - math.log(2*math.pi); Tw = 2*math.log(max((Ob - 2)/4.2, 1e-9)); tr.append((lt, Tw, 2*math.log(lt), Ob/(2*math.pi))); print('  log T %.3g  Tw_max %.3f   2 loglog T %.3f   zero density log(T/2pi)/2pi %.3g  resolution needed Tw >= log(T/2pi) = %.3g' % (lt, Tw, 2*math.log(lt), Ob/(2*math.pi), Ob))
out['trivial'] = tr
json.dump(out, open(__file__.replace('t4.py', 't4.json'), 'w'), indent=1)
