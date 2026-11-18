#!/usr/bin/env python3
"""Second reading of REFEREE2.md section 3 (c3-repair-map-theorem-a): arithmetic spot checks of the constants
used in (D1), (D4), (D5), (D6), (D7). Float64 / mpmath at 30 digits; a text check aid, not a certificate."""
import cmath, math
try:
    import mpmath as mp
    mp.mp.dps = 30
except Exception:
    mp = None
e = lambda x: cmath.exp(2j * math.pi * x)
chi = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}
kappa = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
c1 = (1 - 1j * kappa) / 2; c2 = c1.conjugate()
tau = sum(chi[a] * e(a / 5) for a in range(1, 5))
taub = sum(chi[a].conjugate() if a else 0 for a in [0]) + sum(complex(chi[a]).conjugate() * e(a / 5) for a in range(1, 5))
eps = tau / (1j * math.sqrt(5)); epsb = taub / (1j * math.sqrt(5))
print('kappa =', kappa)
print('(D1) |eps| =', abs(eps), ' eps(chi) c1 - c2 =', eps * c1 - c2, ' eps(conj chi) - conj eps(chi) =', epsb - eps.conjugate(),
      ' eps(conj chi) c2 - c1 =', epsb * c2 - c1)
print('(D6) -i tau/sqrt5 - eps =', -1j * tau / math.sqrt(5) - eps)
# (D5) e(a/5) = (1/4) sum_psi tau(conj psi) psi(a), (a,5)=1 ; characters psi = chi^j
mx = 0
for a in range(1, 5):
    s = 0
    for j in range(4):
        psi = {b: complex(chi[b]) ** j for b in range(1, 5)}
        s += sum(psi[b].conjugate() * e(b / 5) for b in range(1, 5)) * psi[a]
    mx = max(mx, abs(s / 4 - e(a / 5)))
print('(D5) max |e(a/5) - (1/4) sum tau(conj psi) psi(a)| =', mx, ' residue of L(w,chi_0) at 1 = 1 - 1/5 =', 1 - 1 / 5)
print('(D4) 25 * 5^(-5/2) - 5^(-1/2) =', 25 * 5 ** -2.5 - 5 ** -0.5)
rho = 2 ** -0.5
centre, radius = (1 + rho ** 2) / (1 - rho ** 2), 2 * rho / (1 - rho ** 2)
print('(D7) Caratheodory disc at rho = 2^-1/2: centre', centre, 'radius', radius, '(2 sqrt 2 =', 2 * math.sqrt(2), ')')
print('(D7) 1 + centre - radius*(|c1|+|c2|) =', 1 + centre - radius * 2 * abs(c1), ' ; 4 - 2 sqrt2 sqrt(1+kappa^2) =',
      4 - 2 * math.sqrt(2) * math.sqrt(1 + kappa ** 2))
print('(D7) with the real-part Harnack bound alone (F3 as stated): Re(c1 z1 + c2 z2) is not bounded below by Re z only;')
# worst case over the disc versus the claimed bound, by sampling the boundary
worst = min((c1 * (centre + radius * cmath.exp(1j * a)) + c2 * (centre + radius * cmath.exp(1j * b))).real
            for a in [2 * math.pi * k / 720 for k in range(720)] for b in [2 * math.pi * k / 720 for k in range(720)])
print('     sampled min over the two discs of Re(c1 z1 + c2 z2) =', worst, ' (bound 3 - 2 sqrt2 sqrt(1+kappa^2) =',
      3 - 2 * math.sqrt(2) * math.sqrt(1 + kappa ** 2), ')')
if mp:
    s = mp.mpc('0.3', '2.3333')
    Xc = 2 * (2 * mp.pi) ** (s - 1) * mp.gamma(1 - s) * mp.cos(mp.pi * s / 2)
    lhs = mp.gamma(1 - s / 2) / mp.gamma((1 + s) / 2) * mp.pi ** (s - mp.mpf(1) / 2)
    print('(D1) X_c(s) - pi^(s-1/2) Gamma(1-s/2)/Gamma((1+s)/2) at s = 0.3+2.3333i:', mp.nstr(abs(Xc - lhs), 5))
    chiplus = 1j * (2 * mp.pi) ** (s - 1) * mp.exp(-1j * mp.pi * s / 2) * mp.gamma(1 - s)
    Xcplus = (2 * mp.pi) ** (s - 1) * mp.exp(-1j * mp.pi * s / 2) * mp.gamma(1 - s)
    print('(D4) X_c,+ + i chi_+ =', mp.nstr(abs(Xcplus + 1j * chiplus), 5))
    L = lambda s_, sign: mp.dirichlet(s_, [0, 1, sign * 1j, -sign * 1j, -1])
    f = lambda s_: mp.mpc(c1) * L(s_, 1) + mp.mpc(c2) * L(s_, -1)
    print('(D1) |f(s) - 5^(1/2-s) X_c(s) f(1-s)| =', mp.nstr(abs(f(s) - 5 ** (mp.mpf(1) / 2 - s) * Xc * f(1 - s)), 5),
          '(kappa at float64 precision)')
