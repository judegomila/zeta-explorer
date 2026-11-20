# check of Sigma_beta(z) = sum_{k>=1} e^{-k^beta z} = Gamma(1+1/beta) z^{-1/beta} + sum_{j>=0} zeta(-beta j) (-z)^j / j!   (beta < 1)
# the right side is entire apart from the first term; evaluated also at a point with Re z < 0 (no meaning for the left side there)
from mpmath import mp, mpf, mpc, nsum, gamma, zeta, exp, factorial, inf
mp.dps = 40
def rhs(beta, z, J=400):
    return gamma(1 + 1/beta) * z ** (-1/beta) + sum(zeta(-beta * j) * (-z) ** j / factorial(j) for j in range(J))
for beta in (mpf(1)/2, mpf(3)/4):
    for z in (mpc(0.3, 0.0), mpc(0.2, 1.7), mpc(0.05, 6.0)):
        lhs = nsum(lambda k: exp(-k ** beta * z), [1, inf])
        r = rhs(beta, z)
        print('beta', float(beta), 'z', complex(z), 'lhs', complex(lhs), 'diff', float(abs(lhs - r)))
    for z in (mpc(0.0, 3.0), mpc(-0.2, 3.0)):
        print('beta', float(beta), 'z', complex(z), 'continued value', complex(rhs(beta, z)))
    print('coefficient sizes |zeta(-beta j)|/j! at j = 50, 100, 200:', [float(abs(zeta(-beta*j))/factorial(j)) for j in (50, 100, 200)])
