# DH control for the PR-57 Taylor-Rouche one-zero disk  E + B r^2/2 < A r  (non-interval, mpmath 30 digits).
from mpmath import mp, mpf, mpc, pi, gamma, dirichlet, sqrt, findroot, diff, exp
mp.dps = 30
I = mpc(0, 1); s5 = sqrt(5); kap = (sqrt(10-2*s5)-2)/(s5-1)
chi = [0, 1, I, -I, -1]; chib = [0, 1, -I, I, -1]
def f(s, d=0): return ((1-I*kap)/2)*dirichlet(s, chi, d) + ((1+I*kap)/2)*dirichlet(s, chib, d)
def disk(c, r, label, nb=96):
    E = abs(f(c)); A = abs(f(c, 1))
    B = max(abs(f(c + r*exp(2*pi*I*k/nb), 2)) for k in range(nb))*mpf('1.05')   # sampled sup (max modulus), 5% pad
    m = A*r - E - B*r*r/2
    print('%s c=%s r=%s  E=%s A=%s B<~%s  margin A r - E - B r^2/2 = %s  -> %s' % (label, mp.nstr(c, 12), r,
          mp.nstr(E, 3), mp.nstr(A, 6), mp.nstr(B, 6), mp.nstr(m, 6), 'ONE ZERO' if m > 0 else 'no certificate'))
# on-line zero: Lambda real on the line; locate first sign change
Z = lambda t: ((5/pi)**((mpf(1)/2+I*t)/2)*gamma((mpf(3)/2+I*t)/2)*f(mpf(1)/2+I*t)).real
t = mpf(1); prev = Z(t); t0 = None
while t < 12:
    t += mpf('0.25'); cur = Z(t)
    if prev*cur < 0: t0 = findroot(Z, (t-mpf('0.25'), t), solver='anderson'); break
    prev = cur
print('first on-line DH zero ordinate ~', mp.nstr(t0, 15))
disk(mpc(mpf(1)/2, mp.mpf(mp.nstr(t0, 15))), mpf('0.2'), 'on-line ')
rho = findroot(f, mpc('0.808517', '85.699348'))
print('off-line DH zero', mp.nstr(rho, 15))
c = mpc(mp.nstr(rho.real, 12), mp.nstr(rho.imag, 12))
disk(c, mpf('0.1'), 'off-line')
print('distance of the off-line disk from Re s = 1/2:', mp.nstr(c.real - mpf(1)/2 - mpf('0.1'), 6))
