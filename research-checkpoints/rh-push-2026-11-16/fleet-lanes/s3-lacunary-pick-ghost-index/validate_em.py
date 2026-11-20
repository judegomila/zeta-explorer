import numpy as np, math
from scipy.special import sici
import run_em as E
ok = True
# 1. R = 1: E_- = T.   2. R = e^{-ict}: E_- = (2/pi)[sin^2(cT)/c + T(pi/2 - Si(2cT))].  3. e^{+ict}: 2T minus that.
T = 7.0
for dt in (0.02, 0.01):
    t = E.tgrid(int(round(T / dt)), dt)
    e1 = E.eminus(np.ones_like(t, dtype=complex), dt)
    c = 3.3; ex = (2 / math.pi) * (math.sin(c * T) ** 2 / c + T * (math.pi / 2 - sici(2 * c * T)[0]))
    e2 = E.eminus(np.exp(-1j * c * t), dt); e3 = E.eminus(np.exp(1j * c * t), dt)
    print('dt', dt, 'R=1:', e1, 'exact', T, '| causal exp:', e2, 'exact', ex, '| anticausal exp:', e3, 'exact', 2 * T - ex)
    ok &= abs(e1 - T) < 1e-9 and abs(e2 - ex) < 2e-3 and abs(e3 - (2 * T - ex)) < 2e-3
# 4. kernel identity against direct double sum (independent formula), Blaschke factor and its inverse
dt = 0.01; t = E.tgrid(int(round(T / dt)), dt)
for name, g in (('blaschke', (1j * t - 1 - 5j) / (1j * t + 1 - 5j)), ('pole', (1j * t + 1 - 5j) / (1j * t - 1 - 5j))):
    th = np.unwrap(np.angle(g)); D = t[:, None] - t[None, :]; np.fill_diagonal(D, 1.0)
    K = np.sin(th[None, :] - th[:, None]) / D; np.fill_diagonal(K, -np.gradient(th, dt))
    direct = T - K.sum() * dt * dt / (2 * math.pi)
    e = E.eminus(g, dt); print(name, 'fft', e, 'direct kernel sum', direct); ok &= abs(e - direct) < 5e-3
print('VALIDATION', 'PASS' if ok else 'FAIL')
