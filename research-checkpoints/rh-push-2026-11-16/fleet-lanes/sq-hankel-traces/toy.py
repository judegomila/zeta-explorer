# Rational toy: F even real polynomial. Checks of the pole formulas for Gamma_- (numpy double).
import numpy as np
from numpy.polynomial import polynomial as P
np.set_printoptions(precision=10, linewidth=160)

def build(gammas, quartets):
    zs = []
    for g in gammas: zs += [1j*g, -1j*g]
    for (b, g) in quartets: zs += [b+1j*g, b-1j*g, -b+1j*g, -b-1j*g]
    return np.array(zs)

def Lfun(z, zs):  return np.sum(1.0/(z - zs))
def Lp(z, zs):    return -np.sum(1.0/(z - zs)**2)

def poles(zs, alpha):
    F = np.real(P.polyfromroots(zs)); dF = P.polyder(F)
    D = P.polyadd(F, alpha*dF)
    r = P.polyroots(D)
    # polish by Newton on 1+alpha L
    out = []
    for z in r:
        for _ in range(50):
            z = z - (1+alpha*Lfun(z, zs))/(alpha*Lp(z, zs))
        out.append(z)
    return np.array(out)

def S(t, zs, alpha):
    L = np.sum(1.0/(1j*np.atleast_1d(t)[:, None] - zs[None, :]), axis=1)
    return (1-alpha*L)/(1+alpha*L)

def hs_from_poles(z, r):
    A = 1.0/(np.conj(z)[:, None] + z[None, :])
    M = (np.conj(r)[:, None]*A*r[None, :]) @ np.conj(A)   # R* A R Abar ; nonzero spectrum of Gamma*Gamma
    ev = np.sort(np.real(np.linalg.eigvals(M)))[::-1]
    return np.real(np.trace(M)), ev

def analyse(name, zs, alpha, check=True):
    z = poles(zs, alpha)
    r = np.array([2.0/(alpha*Lp(w, zs)) for w in z])
    rhp, lhp = z[z.real > 0], z[z.real < 0]
    rr, rl = r[z.real > 0], r[z.real < 0]
    hm, evm = hs_from_poles(rhp, rr) if len(rhp) else (0.0, np.array([]))
    hp, evp = hs_from_poles(-lhp, rl)
    nq = int(np.sum(zs.real > 1e-12))
    print(f"[{name}] alpha={alpha}: zeros of F in RHP={nq}, poles of S in RHP={len(rhp)}, LHP={len(lhp)}")
    print(f"   ||Gamma_-||_HS^2 (pole formula) = {hm:.10f}   singular values^2 = {evm}")
    off = zs[zs.real > 1e-12]
    print(f"   sum_offline alpha^2/(alpha^2+beta^2) = {np.sum(alpha**2/(alpha**2+off.real**2)):.10f}")
    if not check: return hm
    # independent check 1: anticausal kernel by quadrature k(u) = (1/2pi) int (S(it)-1) e^{itu} dt, u<0
    # tail -2 alpha n/(z+1) (pole in LHP, no anticausal part) subtracted; uniform grid
    h = 0.004; t = np.arange(-3000, 3000, h) + h/2; nz = len(zs)
    St = S(t, zs, alpha) - 1 + 2*alpha*nz/(1j*t+1)
    for u in (-0.3, -1.0, -2.5):
        kq = np.sum(St*np.exp(1j*t*u))*h/(2*np.pi)
        kp = -np.sum(rr*np.exp(rhp*u)) if len(rhp) else 0
        print(f"   k({u}) quadrature = {kq:.6f}   -sum_RHP r e^(zu) = {kp:.6f}")
    # independent check 2: Besov double integral = ||G+||^2+||G-||^2 ; winding = ||G+||^2-||G-||^2
    n = 3000; th = (np.arange(n)+0.5)/n*np.pi - np.pi/2; t = 6*np.tan(th); jac = 6/np.cos(th)**2*(np.pi/n)
    St = S(t, zs, alpha); L = np.array([Lfun(1j*x, zs) for x in t]); Lpv = np.array([Lp(1j*x, zs) for x in t])
    dS = -2*alpha*Lpv/(1+alpha*L)**2 * 1j          # dS/dt
    dt = t[:, None]-t[None, :]; np.fill_diagonal(dt, 1.0)
    q = np.abs(St[:, None]-St[None, :])**2/dt**2; np.fill_diagonal(q, np.abs(dS)**2)
    besov = np.sum(q*jac[:, None]*jac[None, :])/(4*np.pi**2)
    wind = np.sum(np.conj(St)*dS*jac)/(2j*np.pi)
    print(f"   Besov double integral = {besov:.6f}   ||G+||^2+||G-||^2 (poles) = {hp+hm:.6f}")
    print(f"   -winding = -(1/2pi i) int conj(S) S' = {-wind.real:.6f}   ||G+||^2-||G-||^2 (poles) = {hp-hm:.6f}   #LHP-#RHP = {len(lhp)-len(rhp)}")
    return hm

print("=== A. on-line zeros only (RH toy) ===")
analyse("RH-toy", build([1.0, 2.3, 3.1, 4.7], []), 0.7)
print("=== B. one off-line quartet + on-line zeros ===")
zsB = build([1.0, 2.3, 4.7], [(0.3, 3.1)])
for a in (0.05, 0.7, 5.0): analyse("1 quartet", zsB, a, check=(a == 0.7))
print("=== C. isolated quartet, two-zero model: sigma = alpha/sqrt(alpha^2+beta^2) ===")
for a, b in ((0.7, 0.3), (0.1, 0.4), (3.0, 0.2)):
    zs = build([], [(b, 400.0)]); z = poles(zs, a); rhp = z[z.real > 0]
    r = np.array([2.0/(a*Lp(w, zs)) for w in rhp]); h, ev = hs_from_poles(rhp, r)
    print(f"   alpha={a} beta={b}: singular values {np.sqrt(np.abs(ev))}  predicted {a/np.hypot(a,b):.10f}; Re pole {rhp.real} predicted {np.hypot(a,b)-a:.10f}")
print("=== D. two quartets, large alpha: HS -> number of off-line zeros ===")
zsD = build([1.0, 5.0], [(0.3, 3.1), (0.15, 7.0)])
for a in (0.1, 1.0, 10.0, 100.0, 1000.0): analyse("2 quartets", zsD, a, check=False)
print("=== E. backward-heat toy: f(t)=prod(t^2-g^2), f_tau = exp(-tau d^2/dt^2) f ===")
import math
g = [1.0, 1.4, 3.0, 4.1]
f = np.real(P.polyfromroots([x for y in g for x in (y, -y)]))
for tau in (-0.05, 0.0, 0.02, 0.05, 0.2):
    ft = np.zeros_like(f); d = f.copy(); k = 0
    while len(d) > 0 and np.any(d != 0):
        ft[:len(d)] += (-tau)**k/math.factorial(k)*d; d = P.polyder(d, 2) if len(d) > 2 else np.array([]); k += 1
    roots_t = P.polyroots(ft)
    zs = 1j*roots_t            # F(z)=f(-iz): zeros z = i t
    nonreal = int(np.sum(np.abs(roots_t.imag) > 1e-9))
    z = poles(zs, 0.7); rhp = z[z.real > 1e-12]
    r = np.array([2.0/(0.7*Lp(w, zs)) for w in rhp]); h = hs_from_poles(rhp, r)[0] if len(rhp) else 0.0
    print(f"   tau={tau:+.2f}: non-real zeros of f_tau = {nonreal}, RHP poles of S = {len(rhp)}, ||Gamma_-||_HS^2 = {h:.8f}")
