# referee-side checks (independent of q5_test.py). Memory: negligible.
from mpmath import mp, mpf, mpc, zeta, findroot, fabs, acosh, log, pi, dirichlet, sqrt, gamma
mp.dps = 30
I = mpc(0, 1)
# (a) off-line zeros of the entry Z_1 = 5^-s zeta(s,1/5) with Re s > 1/2
found = []
for a0 in [0.7, 0.9, 1.05]:
    for k in range(8, 260):
        t0 = k / 4
        s = mpc(a0, t0)
        if fabs(zeta(s, mpf(1)/5)) < 0.12:
            try:
                z = findroot(lambda x: zeta(x, mpf(1)/5), s)
                if z.real > 0.52 and fabs(zeta(z, mpf(1)/5)) < mpf(10)**-25:
                    found.append((round(float(z.real), 10), round(float(z.imag), 10)))
            except Exception:
                pass
print('HUR zeros Re>1/2:', sorted(set(found), key=lambda x: -x[0])[:8])
# (b) Bochner: entries are the finite Fourier transform of chi -> L(s,chi); check at s = 1.7 + 3i
chis = [[0,1,1,1,1],[0,1,I,-I,-1],[0,1,-1,-1,1],[0,1,-I,I,-1]]
s = mpc('1.7', '3')
for c in range(1, 5):
    lhs = 5**(-s) * zeta(s, mpf(c)/5)
    rhs = sum(ch[c].conjugate() * dirichlet(s, ch) if isinstance(ch[c], mpc) else ch[c] * dirichlet(s, ch) for ch in chis) / 4
    print('entry', c, 'defect', float(fabs(lhs - rhs)))
# (c) T-NR matrix lift at q = 5, p0 = 2, c = 3: eigenvalue factor chi^-1(2) 2^(s-1/2) + c + chi(2) 2^(1/2-s)
c0 = mpf(3); p0 = mpf(2)
d = acosh(c0/2) / log(p0)
for name, ch2 in [('chi0', mpc(1)), ('chi(2)=i', I), ('chi5', mpc(-1))]:
    from mpmath import arg
    th = arg(ch2)
    # zero: (s-1/2) log p0 - i th = d log p0 + i pi  ->  s = 1/2 + d + i (pi + th)/log p0
    z = mpf(1)/2 + d + I * (pi + th) / log(p0)
    val = ch2.conjugate() * p0**(z - mpf(1)/2) + c0 + ch2 * p0**(mpf(1)/2 - z)
    print('T-NR lift', name, 'zero at', mp.nstr(z, 12), '|factor| =', float(fabs(val)))
# (d) E_a lift: coefficient sigma_{2a}(n) n^-a > 0 (a = 0.2), eigenvalue zeta(s+a)zeta(s-a) at s = 1/2 + a + i*14.134725...
a = mpf('0.2'); g = mp.zetazero(1).imag
print('E_a lift Perron eigenvalue at 1/2+a+i gamma_1:', float(fabs(zeta(mpf(1)/2 + a + I*g - a) * zeta(mpf(1)/2 + a + I*g + a))))
print('min coefficient n<=30:', float(min(sum(mpf(dv)**(2*a) for dv in range(1, n+1) if n % dv == 0) * mpf(n)**(-a) for n in range(1, 31))))
# (e) sandwich of Lemma Q on a toy: entries of sum_chi T_chi e_chi with random 3x3 T_chi; check max_c ||t(c)|| >= ||T_chi0||/phi and sum_c t(c) = T_chi0
import random
random.seed(1)
from mpmath import matrix, norm, svd_r
T = [matrix(3,3) for _ in range(4)]
for M in T:
    for i in range(3):
        for j in range(3):
            M[i,j] = mpf(random.uniform(-1,1))
t = []
for c in range(1,5):
    acc = matrix(3,3)
    for k, ch in enumerate(chis):
        acc = acc + (mpc(ch[c]).conjugate()) * T[k]
    t.append(acc/4)
S = t[0]+t[1]+t[2]+t[3]
print('sum_c t(c) - T_chi0:', float(norm(S - T[0])))
