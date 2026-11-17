"""general(): Dirichlet polynomial of a product of local polynomials with heat weight exp(c log^2 n)."""
import numpy as np
def general(primes, polys, c):
    """product over p of sum_k polys[p][k] p^{-ks}, heat weight exp(c log^2 n)"""
    lp = np.log(np.array(primes, float))
    logn = np.zeros(1); co = np.ones(1, complex)
    for l, pol in zip(lp, polys):
        k = np.arange(len(pol))
        logn = (logn[:, None] + l * k[None, :]).ravel()
        co = (co[:, None] * np.array(pol, complex)[None, :]).ravel()
    return logn, co * np.exp(c * logn ** 2)

