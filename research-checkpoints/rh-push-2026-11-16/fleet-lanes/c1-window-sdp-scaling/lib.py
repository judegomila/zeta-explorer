"""Shared pieces for the stack-feasibility model.
Tests: h_j(t) = Bhat(t - t_j) + Bhat(t + t_j), Bhat(z) = (sin(a z)/(a z))^(2m), a = L/(2m).
B = inverse transform = (1/(2a)) * centred cardinal B-spline of order 2m at u/(2a); supp B = [-L, L].
Explicit formula (CLASSICAL, Weil), with all terms of relative size < 1e-6 at t >= 1000 dropped:
   sum_{gamma>0} Bhat(gamma - t_j) = B(0) log(t_j/2pi) - 2 sum_{n<=e^L} Lambda(n) n^{-1/2} B(log n) cos(t_j log n)."""
import numpy as np, mpmath as mp
from math import comb, factorial

def Bhat(z, L, m):
    a = L/(2*m); x = a*np.asarray(z)
    with np.errstate(all='ignore'):
        s = np.where(np.abs(x) < 1e-8, 1.0, np.sin(x)/np.where(x == 0, 1, x))
    return s**(2*m)

def B(u, L, m):
    a = L/(2*m); k = 2*m; x = np.abs(np.asarray(u, float))/(2*a)
    tot = np.zeros_like(x)
    for j in range(k+1):
        tot += (-1)**j*comb(k, j)*np.clip(x + k/2 - j, 0, None)**(k-1)
    return tot/factorial(k-1)/(2*a)

def prime_powers(N):
    """arrays (n, Lambda(n)) for prime powers n <= N"""
    sieve = np.ones(N+1, bool); sieve[:2] = False
    for i in range(2, int(N**0.5)+1):
        if sieve[i]: sieve[i*i::i] = False
    ps = np.nonzero(sieve)[0]; ns = []; lam = []
    for p in ps:
        q = int(p)
        while q <= N:
            ns.append(q); lam.append(np.log(p)); q *= int(p)
        if p*p > N: break
    big = ps[ps*ps > N] if len(ps) else ps
    # primes with p^2 > N handled in bulk (first such p already added in loop)
    done = set(ns)
    rest = np.array([p for p in ps if int(p) not in done], dtype=np.int64)
    n = np.concatenate([np.array(ns, dtype=np.int64), rest]); l = np.concatenate([np.array(lam), np.log(rest)])
    o = np.argsort(n); return n[o], l[o]

def phases(n, t0):
    """(t0 * log n) mod 2pi, t0 an mpf; returns float array"""
    mp.mp.dps = 45; tp = 2*mp.pi
    return np.array([float(mp.fmod(t0*mp.log(int(k)), tp)) for k in n])

def b_primes(taus, L, m, t0, n=None, lam=None, ph=None, eps=None):
    """prime-side value of sum_{gamma>0} Bhat(gamma - t0 - tau_j).  eps: optional sign twist per n."""
    if n is None: n, lam = prime_powers(int(np.exp(L)))
    keep = n <= np.exp(L); n, lam = n[keep], lam[keep]
    if ph is None: ph = phases(n, t0)
    else: ph = ph[keep]
    ln = np.log(n); w = lam/np.sqrt(n)*B(ln, L, m)
    if eps is not None: w = w*eps[keep]
    t0f = float(t0); taus = np.asarray(taus, float)
    arch = B(0.0, L, m)*np.log((t0f + taus)/(2*np.pi))
    return arch - 2*(np.cos(ph[None, :] + taus[:, None]*ln[None, :]) @ w)

def b_zeros(taus, L, m, ztau):
    """zero-side value from on-line zeros at t0 + ztau"""
    return Bhat(np.asarray(ztau)[None, :] - np.asarray(taus)[:, None], L, m).sum(1)
