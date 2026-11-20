"""Landau means on the on-line ordinates: M_n(T) = (2 pi sqrt(n)/T) sum_{gamma <= T} n^{i gamma}, against -Lambda_f(n), the coefficient of -f'/f.
For a function with all zeros on the line M_n(T) -> -Lambda_f(n) (Landau; explicit formula). The difference is the off-line sum
-(2 pi/T) sum_{off-line rho, Im <= T} n^{rho - 1/2}... (real parts paired by the functional equation).
Usage: landau.py LIST.npy zeta|chi|chibar|dh|alt"""
import sys, math, cmath, numpy as np
g = np.load(sys.argv[1]); kind = sys.argv[2]
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
CHI = {0: 0, 1: 1, 2: 1j, 3: -1j, 4: -1}
def coeff(n):
    if kind == 'zeta': return 1.0
    c = CHI[n % 5]
    return {'chi': c, 'chibar': np.conj(c), 'dh': np.real(c) + KAPPA * np.imag(c), 'alt': None}[kind]
NM = 40
if kind == 'alt': lam = None
else:
    a = [0] + [coeff(n) for n in range(1, NM + 1)]
    lam = [0] * (NM + 1)            # a(n) log n = sum_{d | n} Lambda_f(d) a(n/d)
    for n in range(2, NM + 1):
        s = a[n] * math.log(n) - sum(lam[d] * a[n // d] for d in range(2, n) if n % d == 0)
        lam[n] = s
Ts = [T for T in (1e3, 1e4, 1e5, 5e5, 1e6, 1e7, 4.27e7) if T <= g[-1] * 1.001]
print(kind, 'zeros', len(g))
print('   n   -Lambda_f(n)            ' + '   '.join('M_n(T=%.3g)' % T for T in Ts))
for n in (2, 3, 4, 7, 8, 9, 11, 13, 6):
    row = []
    for T in Ts:
        m = g <= T
        S = np.exp(1j * math.log(n) * g[m]).sum() * 2 * math.pi * math.sqrt(n) / T
        row.append('%+.4f%+.4fi' % (S.real, S.imag))
    l = -complex(lam[n]) if lam else float('nan')
    print('  %2d   %+.4f%+.4fi   ' % (n, l.real, l.imag) + '   '.join(row))
