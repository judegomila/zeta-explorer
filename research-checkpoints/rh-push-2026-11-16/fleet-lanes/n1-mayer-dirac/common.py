# Mayer collocation matrix and explicit Eisenstein period function.
from mpmath import mp, mpf, mpc, zeta, matrix, cos, pi, lu_solve, bernoulli, rf, factorial, zetazero, gamma
import numpy as np

def nodes(N):
    return [(1 - cos(pi*(2*i+1)/(2*N)))/2 for i in range(N)]

def mayer(b, N, a=0):
    """Nodal matrix of L_b^{(a)} f(x)=sum_{n>=1}(n+a+x)^(-2b) f(1/(n+a+x)) on Chebyshev nodes of [0,1].
    Z_ij = zeta(2b+j, x_i+1+a), V_ij = x_i^j ; returns Z V^{-1} (N x N, planned size N^2 mp numbers)."""
    xs = nodes(N)
    Z = matrix(N, N); V = matrix(N, N)
    for i in range(N):
        for j in range(N):
            Z[i, j] = zeta(2*b + j, xs[i] + 1 + a)
            V[i, j] = xs[i]**j
    # L = Z V^{-1}  <=>  V^T L^T = Z^T
    return Z*(V**-1), xs


def tonp(M):
    return np.array([[complex(M[i, j]) for j in range(M.cols)] for i in range(M.rows)])

def psi(z, s, M=None, J=14):
    """Analytic continuation in s of sum_{m,n>=1}(m z+n)^(-s), z>0 (the Eisenstein period function
    without its zeta(s)/2 (1+z^-s) term).  psi = sum_{m<M} zeta(s, m z+1) + Euler-Maclaurin tail."""
    z = mpf(z)
    if M is None:
        M = int(40/z) + 2
    tot = mpc(0)
    for m in range(1, M):
        tot += zeta(s, m*z + 1)
    # zeta(s,a+1) ~ a^(1-s)/(s-1) - a^(-s)/2 + sum_j B_2j (s)_(2j-1)/(2j)! a^(-s-2j+1)
    tot += z**(1-s)*zeta(s-1, M)/(s-1) - z**(-s)*zeta(s, M)/2
    for j in range(1, J+1):
        tot += bernoulli(2*j)*rf(s, 2*j-1)/factorial(2*j)*z**(-s-2*j+1)*zeta(s+2*j-1, M)
    return tot

def Wg_over(u, nu, J=14):
    """Gamma(nu+1) u^(-nu/2) (W g)(u) = sum_m m^(-nu-1) sum_{k=1}^m e^(-u k/m), continued in nu.
    = (1-e^-u) [ zeta(nu)/u - zeta(nu+1)/2 + sum_m m^(-nu-1)(1/(e^(u/m)-1) - m/u + 1/2) ]."""
    from mpmath import exp, expm1
    u = mpf(u)
    M = int(4*u) + 30
    tot = zeta(nu)/u - zeta(nu+1)/2
    for m in range(1, M):
        h = u/m
        tot += mpf(m)**(-nu-1)*(1/expm1(h) - 1/h + mpf(1)/2)
    for j in range(1, J+1):
        tot += bernoulli(2*j)/factorial(2*j)*u**(2*j-1)*zeta(nu+2*j, M)
    return (1-exp(-u))*tot

def hz(s, a, J=24):
    """Hurwitz zeta for large a (a >= 30) by Euler-Maclaurin; mpmath's zeta(s,a) was found
    inaccurate for complex s and a ~ 10^3 (see dbg.py)."""
    a = mpf(a)
    t = a**(1-s)/(s-1) + a**(-s)/2
    for j in range(1, J+1):
        t += bernoulli(2*j)*rf(s, 2*j-1)/factorial(2*j)*a**(-s-2*j+1)
    return t

def Wg_over(u, nu, J=20):
    from mpmath import exp, expm1
    u = mpf(u)
    M = max(int(4*u) + 40, 600)   # hz needs (|s|+2J)/M small
    tot = zeta(nu)/u - zeta(nu+1)/2
    for m in range(1, M):
        h = u/m
        tot += mpf(m)**(-nu-1)*(1/expm1(h) - 1/h + mpf(1)/2)
    for j in range(1, J+1):
        tot += bernoulli(2*j)/factorial(2*j)*u**(2*j-1)*hz(nu+2*j, M)
    return (1-exp(-u))*tot
