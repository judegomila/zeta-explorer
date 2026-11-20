"""validation of the library on cases with a known answer"""
import math, numpy as np, mpmath as mp, fk
mp.mp.dps = 30
# digamma / loggamma
for z in (0.25 + 5j, 0.75 + 3000.5j, 0.25 + 0.3j):
    print('digamma', z, abs(complex(mp.digamma(z)) - fk.cdigamma(z)), 'loggamma', abs(complex(mp.loggamma(z)) - fk.cloggamma(z)))
# N(T) smooth for zeta: theta(T)/pi + 1
for T in (100.0, 7005.0, 1e6):
    print('nsmooth', T, float(fk.nsmooth(T)) + 1, float(mp.siegeltheta(T) / mp.pi + 1))
# ktilde against quadrature, and against 1/rho
for rho in (0.3, 7.77, 55.5, 911.123, 2999.9):
    ex = mp.quad(lambda u: (1 if u < 0.5 else 1 - (lambda t: t**6*(462+t*(-1980+t*(3465+t*(-3080+t*(1386-252*t))))))(2*u-1)) * mp.sin(rho * u), mp.linspace(0, 1, int(rho / 3) + 8))
    print('ktilde', rho, float(fk.ktilde(rho)), float(ex), 'rel to 1/rho', float(fk.ktilde(rho)) * rho - 1)
# tail integral with constant density replaced: check against closed form for dens ~ const by differencing q
T, a, b = 1000.0, 990.0, 990.3
v = fk.tail_int(T, a, b)[0]
ex = mp.quad(lambda y: (mp.log(1 / mp.pi) + mp.re(mp.digamma(0.25 + 0.5j * y))) / (2 * mp.pi) / ((y - a) * (y - b)), [T, 2 * T, 10 * T, 1e3 * T, 1e6 * T, mp.inf])
print('tail_int', v, float(ex))
# G(x) for zeta against mpmath: G = Re[i xi'/xi(1/2 + ix)]; and the zero sum
x = 100.3
s = mp.mpc(0.5, x)
xi = lambda s: s * (s - 1) * mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
G = mp.re(1j * mp.diff(xi, s) / xi(s))
z = np.array([float(mp.im(mp.zetazero(n))) for n in range(1, 400)])
zs = (1 / (x - z)).sum() + (1 / (x + z)).sum()
T = fk.tstar(399, T0=z[-1]); 
# tail of sum 1/(x-y) + 1/(x+y) = 2x/(x^2-y^2) beyond T
xs, ws = fk.gl(400); w = 0.5 * (xs + 1); y = T / w ** 3
tl = float((fk.dens(y) * 2 * x / (x * x - y * y) * T * 3 / w ** 4 * 0.5 * ws).sum())
print('G(100.3) function', float(G), 'zero sum 399 + tail', zs + tl, 'arch + zeta part', float(fk.arch(x)) + float(mp.re(1j * mp.diff(mp.zeta, s) / mp.zeta(s))))
