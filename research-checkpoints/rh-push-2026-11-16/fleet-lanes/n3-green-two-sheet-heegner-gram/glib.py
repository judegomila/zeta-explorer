# Resolvent kernel G_s(z,z') = (Delta - s(1-s))^{-1}, Delta = -y^2(dx^2+dy^2), on PSL2(Z)\H.
# Method: G = sum over finitely many cosets of the cylinder kernel P_s + H, H expanded in
# y^{1-s} and sqrt(y) K_{s-1/2}(2 pi |m| y) e(mx); coefficients by collocation (Hejhal-type).
# Works for Re s > 1/2 (physical), Re s = 1/2 (boundary value from the right when called with
# s = 1/2 + it), and Re s < 1/2 (meromorphic continuation = "second sheet").
import numpy as np, mpmath as mp
mp.mp.dps = 20
B2K = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730]

def consts(s):
    s = mp.mpmathify(s)
    C = complex(mp.gamma(s)**2/mp.gamma(2*s))/(4*np.pi)
    reg0 = complex(-(mp.euler+mp.digamma(s))/(2*mp.pi))
    return C, reg0

def gs_small(u, s, C):
    return C*complex(mp.hyp2f1(s, s, 2*s, -1/mp.mpf(u))*mp.mpf(u)**(-mp.mpmathify(s)))

def gs_arr(u, s, C, reg0):
    u = np.asarray(u, float); out = np.empty(u.shape, complex)
    big = u >= 0.5
    ub = u[big]; w = 1.0/(1.0+ub)
    term = np.ones(w.shape, complex); acc = term.copy()
    for k in range(400):
        term = term*((s+k)**2/((2*s+k)*(k+1)))*w
        acc += term
        if k > 30 and (term.size == 0 or np.max(np.abs(term)) < 1e-17*max(1.0, np.max(np.abs(acc)))): break
    out[big] = C*np.exp(-s*np.log1p(ub))*acc
    idx = np.argwhere(~big)
    for ix in idx:
        ix = tuple(ix); uu = u[ix]
        out[ix] = reg0 if uu < 1e-13 else gs_small(uu, s, C)
    return out

def hurwitz(w, q):
    # sum_{m>=0} (q+m)^(-w), q large real array, complex w; Euler-Maclaurin
    lq = np.log(q)
    r = np.exp((1-w)*lq)/(w-1) + 0.5*np.exp(-w*lq)
    poch = w
    for k in range(1, 7):
        r = r + B2K[k-1]/mp.factorial(2*k).__float__()*poch*np.exp((-w-2*k+1)*lq)
        poch = poch*(w+2*k-1)*(w+2*k)
    return r

def P_arr(X, Y, xs, ys, s, C, reg0, N=200, J=9):
    # cylinder kernel sum_n g_s(u(z, w+n)), z = X+iY arrays, w = xs+i ys
    X = np.asarray(X, float); Y = np.asarray(Y, float)
    a = X - xs; a = a - np.round(a); b = Y - ys; yv4 = 4*Y*ys
    n = np.arange(-N, N+1)
    u = ((a[:, None]+n[None, :])**2 + (b**2)[:, None])/yv4[:, None]
    tot = gs_arr(u, s, C, reg0).sum(axis=1)
    # tail
    ck = [1.0+0j]
    for k in range(J): ck.append(ck[-1]*((s+k)**2/((2*s+k)*(k+1))))
    lyv = np.log(yv4)
    for j in range(J+1):
        A = np.zeros(a.shape, complex)
        for k in range(j+1):
            l = j-k; al = -s-k; bn = 1.0+0j
            for i in range(l): bn = bn*(al-i)/(i+1)
            A += ck[k]*(-1)**k*np.exp((s+k)*lyv)*bn*b**(2*l)
        tot += C*A*(hurwitz(2*s+2*j, N+1+a) + hurwitz(2*s+2*j, N+1-a))
    return tot

def pullback(z):
    z = complex(z)
    for _ in range(100000):
        x = z.real - np.floor(z.real+0.5); z = complex(x, z.imag)
        if abs(z) < 1-1e-13: z = -1/z
        else: break
    x, y = z.real, z.imag
    if abs(x-0.5) < 1e-9: x = -0.5
    if abs(abs(complex(x, y))-1) < 1e-9 and x > 0: x = -x
    return complex(x, y)

def pullback_arr(X, Y):
    out = np.array([pullback(complex(x, y)) for x, y in zip(X, Y)])
    return out.real, out.imag

def images(zp, Y1):
    # gamma z' over Gamma_inf\Gamma with height >= Y1 (with multiplicity for elliptic points)
    from math import gcd
    res = []; y = zp.imag; R = y/Y1
    cmax = int(np.sqrt(R)/y)+1
    for c in range(0, cmax+1):
        if c == 0: res.append(zp); continue
        dmax = int(np.sqrt(R)+c*abs(zp.real))+2
        for d in range(-dmax, dmax+1):
            if gcd(c, abs(d)) != 1: continue
            if abs(c*zp+d)**2 <= R:
                a = pow(d, -1, c) if c > 1 else 0   # a d = 1 mod c
                bb = (a*d-1)//c
                res.append((a*zp+bb)/(c*zp+d))
    return res

class Solver:
    def __init__(self, s, Y=0.6, Y1=0.35, M=22, NP=160, N=200):
        self.s = complex(s); self.Y = Y; self.Y1 = Y1; self.M = M; self.N = N
        self.C, self.reg0 = consts(self.s)
        self.nu = mp.mpmathify(self.s)-mp.mpf(1)/2
        xk = (np.arange(NP)+0.37)/NP - 0.5
        self.xk = xk; self.yk = np.full(NP, Y)
        self.xs, self.ys = pullback_arr(xk, self.yk)
        self.ms = [m for m in range(-M, M+1) if m != 0]
        A = self.basis(self.xs, self.ys) - self.basis(self.xk, self.yk)
        self.scale = np.linalg.norm(A, axis=0); self.A = A/self.scale
        self.sv = np.linalg.svd(self.A, compute_uv=False)
    def kb(self, m, y):
        return complex(mp.sqrt(y)*mp.besselk(self.nu, 2*mp.pi*abs(m)*y))
    def basis(self, X, Y):
        X = np.asarray(X, float); Y = np.asarray(Y, float)
        B = np.empty((X.size, 2*self.M+1), complex)
        B[:, 0] = np.exp((1-self.s)*np.log(Y))
        cache = {}
        for j, m in enumerate(self.ms):
            col = np.empty(X.size, complex)
            for i, y in enumerate(Y):
                key = (abs(m), float(y))
                if key not in cache: cache[key] = self.kb(m, float(y))
                col[i] = cache[key]
            B[:, j+1] = col*np.exp(2j*np.pi*m*X)
        return B
    def S(self, X, Y, zp):
        tot = np.zeros(np.asarray(X).shape, complex)
        for w in images(zp, self.Y1):
            tot += P_arr(X, Y, w.real, w.imag, self.s, self.C, self.reg0, N=self.N)
        return tot
    def solve(self, zp):
        rhs = self.S(self.xk, self.yk, zp) - self.S(self.xs, self.ys, zp)
        coef, *_ = np.linalg.lstsq(self.A, rhs, rcond=None)
        res = np.linalg.norm(self.A@coef-rhs)/max(np.linalg.norm(rhs), 1e-300)
        return coef/self.scale, res
    def G(self, zs, zp, coef):
        X = np.array([z.real for z in zs]); Y = np.array([z.imag for z in zs])
        return self.S(X, Y, zp) + self.basis(X, Y)@coef
    def gram(self, pts):
        # matrix G(p_a,p_b) over distinct points of F; diagonal log term dropped (real)
        n = len(pts); Gm = np.empty((n, n), complex); rs = []
        for b, zp in enumerate(pts):
            coef, res = self.solve(zp); rs.append(res)
            Gm[:, b] = self.G(pts, zp, coef)
        return Gm, max(rs)

def eis(z, s):
    z = complex(z); x, y = mp.mpf(z.real), mp.mpf(z.imag); s = mp.mpmathify(s)
    xi = lambda w: mp.pi**(-w/2)*mp.gamma(w/2)*mp.zeta(w)
    phi = xi(2*s-1)/xi(2*s)
    tot = y**s + phi*y**(1-s)
    pref = 4*mp.sqrt(y)/(mp.pi**(-s)*mp.gamma(s)*mp.zeta(2*s))
    nmax = int(60/(2*np.pi*float(y)))+3
    acc = 0
    for n in range(1, nmax+1):
        sig = sum(mp.mpf(d)**(1-2*s) for d in range(1, n+1) if n % d == 0)
        acc += mp.mpf(n)**(s-mp.mpf(1)/2)*sig*mp.besselk(s-mp.mpf(1)/2, 2*mp.pi*n*y)*mp.cos(2*mp.pi*n*x)
    return complex(tot+pref*acc)

def hecke(z, n):
    # T_n z as list of points (multiset), pulled back
    pts = []
    for a in range(1, n+1):
        if n % a: continue
        d = n//a
        for b in range(d): pts.append(pullback((a*z+b)/d))
    return pts
