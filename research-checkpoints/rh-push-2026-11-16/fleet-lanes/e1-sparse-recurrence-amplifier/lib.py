"""Vertical-line evaluation of periodic Dirichlet series F(s)=sum a_m m^{-s}, a_m periodic mod q,
by one type-1 NUFFT for the head (m < q*N) plus an Euler-Maclaurin tail per residue class."""
import numpy as np, finufft
from math import factorial
B2 = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6, -3617/510]  # B_2..B_16
XI = (np.sqrt(10-2*np.sqrt(5))-2)/(np.sqrt(5)-1)
DH = (5, {1:1.0, 2:XI, 3:-XI, 4:-1.0})
ZETA = (1, {1:1.0})   # class "1 mod 1": m = n+1
RHO0 = complex(0.8085171825, 85.6993484854)

def _tail(s, q, j, N):
    """sum_{n>=N} (q n + j)^{-s}, s array; x=N+j/q."""
    x = N + j/q
    lx = np.log(x)
    xs = np.exp(-s*lx)
    out = x*xs/(s-1) + xs/2
    poch = s.copy()            # (s)_{2k-1}
    xp = xs/x
    for k in range(1, len(B2)+1):
        out = out + B2[k-1]/factorial(2*k)*poch*xp
        poch = poch*(s+2*k-1)*(s+2*k)
        xp = xp/(x*x)
    return np.exp(-s*np.log(q))*out

def line(fn, sigma, t0, dt, M, tmax=None, eps=1e-12):
    """F(sigma + i(t0+k dt)), k=0..M-1 (M even)."""
    q, cl = fn
    if tmax is None: tmax = abs(t0)+M*dt
    N = int(max(50, tmax/2 + 10)) if q > 1 else int(max(50, tmax/2+10))
    tc = t0 + (M//2)*dt
    ms=[]; ws=[]
    for j, c in cl.items():
        m = q*np.arange(0 if j>0 else 1, N) + j if q>1 else np.arange(1, N+1)  # zeta: m=1..N
        ms.append(m.astype(np.float64)); ws.append(np.full(m.shape, c))
    m = np.concatenate(ms); w = np.concatenate(ws)
    lam = np.log(m)
    c = (w*m**(-sigma))*np.exp(-1j*tc*lam)
    f = finufft.nufft1d1(dt*lam, c.astype(np.complex128), M, isign=-1, eps=eps)
    s = sigma + 1j*(t0 + dt*np.arange(M))
    for j, cc in cl.items():
        if q>1: f = f + cc*_tail(s, q, j, N)
        else:   f = f + cc*_tail(s, 1, 0, N+1)   # sum_{n>=N+1} n^{-s}
    return f

def point(fn, s, N=None):
    """direct evaluation at array of points s (small arrays)."""
    q, cl = fn
    s = np.atleast_1d(np.asarray(s, dtype=complex))
    if N is None: N = int(max(50, np.max(np.abs(s.imag))*0.5+10))
    out = np.zeros(s.shape, complex)
    for j, cc in cl.items():
        if q>1:
            m = (q*np.arange(0, N)+j).astype(float)
            tl = _tail(s, q, j, N)
        else:
            m = np.arange(1, N+1).astype(float); tl = _tail(s, 1, 0, N+1)
        lm = np.log(m)
        for i in range(s.size):
            out.flat[i] += cc*(np.exp(-s.flat[i]*lm).sum() + tl.flat[i])
    return out
