# Z(w,s) = int_0^inf (theta(t^2)^w - 1) t^s dt/t (regularised), theta(t)=sum_n exp(-pi n^2 t).
# FE s <-> w-s.  Rotated-contour formula (ray t = e^{i delta} u, delta = pi/4 - eps):
#   e^{delta*tau} Z(w, w/2+x+i tau) = e^{i delta (w/2+x)} (J(s) - 1/s) + e^{-i delta (w/2-x)} (Jb(w-s) - 1/(w-s)),
#   J(s) = int_1^inf f(u) u^{s-1} du,  f(u) = theta(e^{2 i delta} u^2)^w - 1,  Jb uses conj(f).
import numpy as np
def nodes(eps, ppu=130, ng=16, tail=40.0):
    delta = np.pi/4 - eps
    U = np.sqrt(tail/(np.pi*np.sin(2*eps)))
    npan = int(np.ceil(ppu*np.log(U)))
    edges = np.exp(np.linspace(0, np.log(U), npan+1))
    xg, wg = np.polynomial.legendre.leggauss(ng)
    a = edges[:-1][:, None]; b = edges[1:][:, None]
    u = ((a+b)/2 + (b-a)/2*xg[None, :]).ravel()
    W = ((b-a)/2*wg[None, :]).ravel()
    return delta, u, W
def logtheta(u, delta):
    z = np.exp(2j*delta)*u**2
    q = np.exp(-np.pi*z)
    aq = np.abs(q).max()
    N = int(np.ceil(np.log(1e-19)/np.log(aq)))+2
    L = np.zeros_like(q)
    qn = np.ones_like(q)
    for n in range(1, N+1):
        qn = qn*q            # q^n
        if n % 2 == 0: L += np.log1p(-qn)
        else: L += 2*np.log1p(qn)
    return L
def gmat(ws, u, W, L):
    ws = np.asarray(ws)
    return (W[:, None]*np.expm1(L[:, None]*ws[None, :]))*np.exp(np.log(u)[:, None]*(ws[None, :]/2-1))
def evalZ(ws, x, tau, u, W, L, delta, chunk=1500, G=None):
    """returns array (len(tau), len(ws)) complex: e^{delta tau} Z(w, w/2 + x + i tau)"""
    ws = np.asarray(ws, float); x = np.broadcast_to(np.asarray(x, float), np.shape(tau)).astype(float); tau = np.asarray(tau, float)
    if G is None: G = gmat(ws, u, W, L)
    Gc = np.conj(G); lu = np.log(u)
    out = np.empty((len(tau), len(ws)), complex)
    for i in range(0, len(tau), chunk):
        xs = x[i:i+chunk, None]; ts = tau[i:i+chunk, None]
        E = np.exp((xs+1j*ts)*lu[None, :])
        A1 = E @ G
        A2 = (1.0/E) @ Gc if np.any(xs != 0) else None
        s = ws[None, :]/2 + xs + 1j*ts
        s2 = ws[None, :]/2 - xs - 1j*ts
        t1 = np.exp(1j*delta*(ws[None, :]/2+xs))*(A1 - 1/s)
        if A2 is None: out[i:i+chunk] = 2*t1.real
        else: out[i:i+chunk] = t1 + np.exp(-1j*delta*(ws[None, :]/2-xs))*(A2 - 1/s2)
    return out
