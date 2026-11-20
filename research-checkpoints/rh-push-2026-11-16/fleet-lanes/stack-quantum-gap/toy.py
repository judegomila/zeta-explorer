# stack-quantum-gap toy checks (double precision; MEASURED).
# A. Sea model F_d(w) = cosh(Lam w)(w^2 - beta^2): exact quantum q = 1/(alpha x |L'(x)|) vs mean-field formula.
# B. Rational truncation: Hankel norm by FFT/SVD on the circle vs quantum; quartet case vs max_j |S_0(z_j)|.
# C. Lawson (complex Chebyshev) best H^inf approximation error vs Hankel norm; Poisson-L1 inequality.
# D. alpha -> infinity limit: 1 iff beta*Lam < sqrt 2 (sea model).
import numpy as np
from scipy.optimize import brentq
np.set_printoptions(linewidth=200)

def sea_q(alpha, beta, Lam):
    L  = lambda x: Lam*np.tanh(Lam*x) + 2*x/(x*x-beta*beta)
    Lp = lambda x: Lam**2/np.cosh(min(Lam*x, 300.0))**2 - 2*(x*x+beta*beta)/(x*x-beta*beta)**2
    f = lambda x: 1 + alpha*L(x)
    lo, hi = beta*1e-14, beta*(1-1e-14)
    x = brentq(f, lo, hi, xtol=1e-16, rtol=1e-15, maxiter=500)
    return x, 1.0/(alpha*x*abs(Lp(x)))
def mf_q(alpha, beta, Lam):
    a = alpha/(1+alpha*Lam)
    return alpha/((1+alpha*Lam)**2*np.sqrt(beta**2+a**2))
def mf_gap(beta, Lam):
    al = np.logspace(-6, 6, 24001)
    v = mf_q(al, beta, Lam); i = np.argmax(v)
    return v[i], al[i]

print("== A. sea model: exact quantum q vs mean-field q_mf = alpha/((1+alpha Lam)^2 sqrt(beta^2 + a^2)), a = alpha/(1+alpha Lam)")
print("   beta    Lam    alpha      x_pole        q_exact       q_mf         ratio")
for beta in (0.375, 0.1):
    for Lam in (1.0, 3.0, 10.0, 30.0, 100.0):
        for alpha in (0.01, 1.0/Lam, 1.0, 100.0):
            x, q = sea_q(alpha, beta, Lam)
            print(f"   {beta:<6} {Lam:<6} {alpha:<9.4g} {x:<13.6e} {q:<13.6e} {mf_q(alpha,beta,Lam):<12.6e} {q/mf_q(alpha,beta,Lam):.6f}")
print("== A2. sup over alpha of the exact quantum (sea model) vs 1/(4 beta Lam)")
print("   beta    Lam    sup_alpha q     argmax alpha*Lam   1/(4 beta Lam)   mf sup")
for beta in (0.5, 0.375, 0.1, 0.01):
    for Lam in (1.0, 3.0, 10.0, 13.45, 30.0, 100.0, 1000.0):
        al = np.logspace(-5, 5, 2001)
        qs = np.array([sea_q(a, beta, Lam)[1] for a in al]); i = np.argmax(qs)
        print(f"   {beta:<6} {Lam:<7} {qs[i]:<14.6e} {al[i]*Lam:<17.4f} {1/(4*beta*Lam):<15.6e} {mf_gap(beta,Lam)[0]:.6e}")

print("== D. alpha -> infinity limit of the quantum in the sea model (threshold beta*Lam = sqrt2 = 1.41421)")
print("   beta*Lam   q(alpha=1e2/Lam)  q(1e4/Lam)   q(1e6/Lam)   q(1e8/Lam)")
for bl in (0.1, 0.5, 1.0, 1.3, 1.4, 1.43, 1.5, 2.0, 5.0):
    Lam = 10.0; beta = bl/Lam
    print("   %-9s" % bl, "  ".join("%.6e" % sea_q(a/Lam, beta, Lam)[1] for a in (1e2, 1e4, 1e6, 1e8)))

# ---------- B. rational models, Hankel norm on the circle ----------
def make_L(zeros_axis, pairs):
    # zeros at +- i g (g>0 in zeros_axis) ; pairs: list of complex rho=(beta+i g0): zeros rho, -conj rho, conj rho, -rho  (if g0=0: rho,-rho)
    def L(z):
        z = np.asarray(z, dtype=complex); s = np.zeros_like(z)
        for g in zeros_axis: s += 2*z/(z*z+g*g)
        for rho in pairs:
            if abs(rho.imag) < 1e-15: s += 1/(z-rho.real)+1/(z+rho.real)
            else: s += 1/(z-rho)+1/(z+np.conj(rho))+1/(z-np.conj(rho))+1/(z+rho)
        return s
    def Lp(z):
        z = np.asarray(z, dtype=complex); s = np.zeros_like(z)
        for g in zeros_axis: s += -1/(z-1j*g)**2 - 1/(z+1j*g)**2
        for rho in pairs:
            if abs(rho.imag) < 1e-15: s += -1/(z-rho.real)**2-1/(z+rho.real)**2
            else: s += -1/(z-rho)**2-1/(z+np.conj(rho))**2-1/(z-np.conj(rho))**2-1/(z+rho)**2
        return s
    return L, Lp
def newton(L, Lp, alpha, z0):
    z = complex(z0)
    for _ in range(200):
        dz = (1+alpha*L(z))/(alpha*Lp(z)); z = z - dz
        if abs(dz) < 1e-15: break
    return complex(z)
def hankel_norm(Sfun, a, N=1<<17, n=1200):
    th = 2*np.pi*(np.arange(N)+0.5)/N
    t = a/np.tan(th/2)                      # zeta = (z-a)/(z+a) = e^{i th}, z = i t
    u = Sfun(1j*t)
    c = np.fft.fft(u*np.exp(-1j*np.pi*np.arange(N)/N*0))/N   # c_k = (1/N) sum u e^{-ik th_j}; th_j has half-step offset
    k = np.arange(N); c = c*np.exp(-1j*np.pi*k/N)
    neg = c[::-1][:2*n+2]                    # c_{-1}, c_{-2}, ...
    H = np.array([[neg[i+j] for j in range(n)] for i in range(n)])
    return np.linalg.svd(H, compute_uv=False)[:4], u, th
print("== B. rational models: ||Gamma_-|| (FFT/SVD Hankel matrix on the circle) vs quantum")
for (name, d, K, pairs, alpha) in [
        ("real pair, sea d=1 K=6", 1.0, 6, [0.3+0j], 0.7),
        ("real pair, sea d=0.5 K=12", 0.5, 12, [0.3+0j], 0.7),
        ("real pair, sea d=0.25 K=24", 0.25, 24, [0.3+0j], 0.7),
        ("real pair, sea d=0.25 K=24", 0.25, 24, [0.3+0j], 0.08),
        ("quartet g0=1.1, sea d=1 K=6", 1.0, 6, [0.3+1.1j], 0.7),
        ("quartet g0=0.2, sea d=1 K=6", 1.0, 6, [0.3+0.2j], 0.7),
        ("two quartets, sea d=1 K=6", 1.0, 6, [0.3+1.1j, 0.2+2.3j], 0.7)]:
    ax = [d*(k+0.5) for k in range(K)]
    L, Lp = make_L(ax, pairs)
    S = lambda z: (1-alpha*L(z))/(1+alpha*L(z))
    poles = []
    for rho in pairs:
        cands = [rho] if abs(rho.imag) < 1e-15 else [rho, np.conj(rho)]
        for r0 in cands:
            zj = newton(L, Lp, alpha, r0 - 0.3*min(alpha, 0.1))
            assert zj.real > 0 and abs(1+alpha*L(zj)) < 1e-9, (zj,)
            poles.append(zj)
    qs = []
    for j, zj in enumerate(poles):
        r = 2/(alpha*Lp(zj)); q = abs(r)/(2*zj.real)
        bl = np.prod([abs((zj-zk)/(zj+np.conj(zk))) for k, zk in enumerate(poles) if k != j])
        qs.append((q, q*bl))
    sv, u, th = hankel_norm(S, a=2.0)
    print(f"   {name}, alpha={alpha}: poles {[np.round(p,6) for p in poles]}")
    print(f"      local quanta |r|/(2x) = {[round(q[0],8) for q in qs]}  with Blaschke factor |S_0(z_j)| = {[round(q[1],8) for q in qs]}")
    print(f"      Hankel singular values (FFT/SVD) = {np.round(sv,8)}   ; norm - max|S_0(z_j)| = {sv[0]-max(q[1] for q in qs):.3e}")

# ---------- C. Lawson best approximation + Poisson-L1 inequality ----------
def lawson(u, th, K, iters=400):
    A = np.exp(1j*np.outer(th, np.arange(K)))
    w = np.ones(len(th))/len(th)
    best = 9
    for it in range(iters):
        sw = np.sqrt(w)[:, None]
        c = np.linalg.lstsq(A*sw, u*sw[:, 0], rcond=None)[0]
        e = np.abs(u - A@c); best = min(best, e.max())
        w = w*e; w /= w.sum()
    return best, c
print("== C. best H^inf approximation (Lawson, polynomial basis of degree K on the circle) vs ||Gamma_-||; Poisson-L1 averages")
d, K0, pairs, alpha = 1.0, 6, [0.3+0j], 0.7
ax = [d*(k+0.5) for k in range(K0)]
L, Lp = make_L(ax, pairs); S = lambda z: (1-alpha*L(z))/(1+alpha*L(z))
z1 = newton(L, Lp, alpha, 0.25); q1 = abs(2/(alpha*Lp(z1)))/(2*z1.real)
N = 4096; th = 2*np.pi*(np.arange(N)+0.5)/N; a = 2.0; t = a/np.tan(th/2); u = S(1j*t)
print(f"   model: real pair beta=0.3, sea d=1 K=6, alpha=0.7; pole {z1.real:.8f}; quantum = ||Gamma_-|| = {q1:.8f}")
pois = (z1.real/np.pi)/((t-z1.imag)**2+z1.real**2)
dt_dth = a/(2*np.sin(th/2)**2); wq = pois*dt_dth*(2*np.pi/N)
print(f"   Poisson weight total = {wq.sum():.6f}")
for K in (10, 20, 40, 80, 160):
    E, c = lawson(u, th, K)
    A = np.exp(1j*np.outer(th, np.arange(K))); err = np.abs(u-A@c)
    print(f"   K={K:<4} min sup|S-h| = {E:.6f}   Poisson-L1 average of |S-h| at the pole = {(err*wq).sum():.6f}   (floor {q1:.6f})")
for nm, hv in (("h=0", 0*u), ("h=S(z+0.5)", S(1j*t+0.5)), ("h=S(z+0.31) (pole-free: x_pole<0.3)", S(1j*t+0.31)), ("h=S(z+0.05) (NOT in H^inf)", S(1j*t+0.05))):
    err = np.abs(u-hv); print(f"   {nm:<40} sup = {err.max():.6f}   Poisson-L1 at pole = {(err*wq).sum():.6f}")
