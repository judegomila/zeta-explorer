# Check L_F (prime side) against sum over zeros of K_u(s - rho), zeta, low height. mpmath zeros.
import numpy as np, mpmath as mp
from scipy.special import digamma
NZ = 400
gam = np.array([float(mp.im(mp.zetazero(k))) for k in range(1, NZ+1)])
G = gam[-1]
for (t, P) in [(30.3, 50.0), (47.0, 300.0), (60.5, 2000.0)]:
    u = np.log(P); s = 0.5 + 1j*t
    K = lambda w: 1/w - (1 - np.exp(-u*w))/(u*w*w)
    trig = lambda z: 1/z + 1/(2*z**2) + 1/(6*z**3) - 1/(30*z**5)
    # psi' by recurrence shift for small |z|
    z = s/2; pp = 0
    while abs(z) < 30: pp += 1/z**2; z = z + 1
    pp += trig(z)
    g = 0.5*digamma(s/2) - 0.5*np.log(np.pi)
    tot = 0; totS = 0
    n = 2
    sv = np.ones(int(P)+1, bool); sv[:2] = False
    for i in range(2, int(P**0.5)+1):
        if sv[i]: sv[i*i::i] = False
    for p in np.nonzero(sv)[0]:
        q = p
        while q <= P:
            tot += np.log(p)*(1 - np.log(q)/u)*q**(-s); totS += np.log(p)*q**(-s); q *= p
    trivF = sum(np.exp(-u*(2*k+s))/(u*(2*k+s)**2) for k in range(1, 40))
    trivS = sum(np.exp(-u*(2*k+s))/(2*k+s) for k in range(1, 40))
    LF = K(s) + K(s-1) + g + 0.25*pp/u - tot - np.exp(-u*s)/(u*s*s) - trivF
    LS = 1/s + 1/(s-1) + g - totS + np.exp(u*(1-s))/(1-s)
    zs = sum(K(s - (0.5+1j*y)) + K(s - (0.5-1j*y)) for y in gam)
    zS = sum((1-np.exp(-u*(s-(0.5+1j*y))))/(s-(0.5+1j*y)) + (1-np.exp(-u*(s-(0.5-1j*y))))/(s-(0.5-1j*y)) for y in gam)
    # tail of on-line zeros beyond G for the Fejer sum: |sum| <= (2/u) int_G^inf (log(y/2pi)/2pi) (2/y^2) dy
    zs = zs + 1j*2*t*(np.log(G/(2*np.pi))+1)/(2*np.pi*G)   # imaginary part of the omitted pairs: -2it sum_{gamma>G} 1/gamma^2 ... sign fixed by 1/(s-rho)+1/(s-conj rho)
    tail = (2/u)*(np.log(G/(2*np.pi))+1)/(np.pi*G)
    print("t=%.1f P=%g  L_F prime side %.6f%+.6fi  zero side %.6f%+.6fi  diff %.2e (tail bound %.2e) | sharp: prime %.4f%+.4fi zero(400, cond. conv.) %.4f%+.4fi" % (t, P, LF.real, LF.imag, zs.real, zs.imag, abs(LF-zs), tail, LS.real, LS.imag, zS.real, zS.imag))
