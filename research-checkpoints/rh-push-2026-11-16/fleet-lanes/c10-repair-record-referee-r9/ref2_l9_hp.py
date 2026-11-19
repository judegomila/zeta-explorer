from mpmath import mp, mpf, zeta
mp.dps = 80
L4 = lambda z: mpf(4)**(-z)*(zeta(z, mpf(1)/4) - zeta(z, mpf(3)/4))
L5 = lambda z: mpf(5)**(-z)*(zeta(z, mpf(1)/5) - zeta(z, mpf(2)/5) - zeta(z, mpf(3)/5) + zeta(z, mpf(4)/5))
for k in range(12, 18):
    print(k, 'L4', mp.nstr(L4(-k), 6), 'L5', mp.nstr(L5(-k), 6), 'prod', mp.nstr(abs(L4(-k)*L5(-k)), 3))
