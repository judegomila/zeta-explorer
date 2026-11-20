# Inertia of the cutoff-energy kernel C(t,s) = (f(t)f'(s)-f'(t)f(s))/(t-s)  (PR56 operator-duality eq.(5), alpha/pi dropped)
# Tests: (1) polynomial-Gaussian control k_0 (PR56 factorization.md): finite rank, exact inertia vs RHP zeros of F+alpha F'
#        (2) Davenport-Heilbronn vs zeta in a height window around the DH off-line zero 0.808517+85.699348i
import mpmath as mp, sys
mp.mp.dps = 110

def inertia(M, tol):
    ev = mp.eigsy(M, eigvals_only=True)
    ev = sorted([e for e in ev])
    top = max(abs(e) for e in ev)
    neg = [e/top for e in ev if e < -tol*top]
    pos = [e/top for e in ev if e > tol*top]
    return len(pos), len(neg), [mp.nstr(e/top, 6) for e in ev[:3]], mp.nstr(ev[-1]/top,4)

def kernel(f, df, ts, d2f=None):
    n = len(ts); fv = [f(t) for t in ts]; dv = [df(t) for t in ts]
    sc = [abs(fv[i]) + abs(dv[i]) for i in range(n)]
    M = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            if i == j:
                M[i, j] = (dv[i]**2 - fv[i]*d2f(ts[i]))/(sc[i]*sc[j])
            else:
                M[i, j] = (fv[i]*dv[j] - dv[i]*fv[j])/(ts[i]-ts[j])/(sc[i]*sc[j])
    return M

# ---------- (1) polynomial-Gaussian control ----------
print("== PG control k_0: F(z)=e^{z^2/16}(z^4+528z^2+80832) ==")
P  = lambda z: z**4 + 528*z**2 + 80832
dP = lambda z: 4*z**3 + 1056*z
print(" zeros of F (z):", [mp.nstr(r, 8) for r in mp.polyroots([1,0,528,0,80832])])
for alpha in ['0.05','0.3','1','4','50']:
    a = mp.mpf(alpha)
    # D = P + a(P' + zP/8) : coefficients descending, degree 5
    c = [a/8, 1, a*(4+mp.mpf(528)/8), 528, a*(1056+mp.mpf(80832)/8), 80832]
    r = mp.polyroots(c, maxsteps=500, extraprec=200)
    print("  alpha=%s  RHP zeros of F+alpha F': %d  LHP: %d" % (alpha, sum(1 for x in r if x.real > 0), sum(1 for x in r if x.real < 0)))
f   = lambda t: mp.e**(-t*t/16)*P(1j*t).real
df  = lambda t: mp.diff(f, t)
d2f = lambda t: mp.diff(f, t, 2)
ts = [mp.mpf(k)*mp.mpf('1.3') - mp.mpf('9.05') for k in range(15)]
M = kernel(f, df, ts, d2f)
print("  full kernel, 15 generic nodes: (pos,neg) =", inertia(M, mp.mpf(10)**-60)[:2], " [prediction (3,2)]")
# parity sectors C_-(t,s)=C(t,s)-C(t,-s), C_+ = C(t,s)+C(t,-s) on t,s>0
tp = [mp.mpf(k)*mp.mpf('1.1') + mp.mpf('0.37') for k in range(9)]
full = kernel(f, df, tp + [-t for t in tp], d2f)
n = len(tp)
Cm = mp.matrix(n,n); Cp = mp.matrix(n,n)
for i in range(n):
    for j in range(n):
        Cm[i,j] = full[i,j] - full[i,n+j]; Cp[i,j] = full[i,j] + full[i,n+j]
# undo the row scaling asymmetry: scaling sc(t)=sc(-t) since f even, |f'| even -> consistent
print("  odd sector (pos,neg) =", inertia(Cm, mp.mpf(10)**-60)[:2], "  even sector (pos,neg) =", inertia(Cp, mp.mpf(10)**-60)[:2])

# ---------- (2) DH vs zeta ----------
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def dh(s):
    return 5**(-s)*(mp.zeta(s, mp.mpf(1)/5) + kap*mp.zeta(s, mp.mpf(2)/5) - kap*mp.zeta(s, mp.mpf(3)/5) - mp.zeta(s, mp.mpf(4)/5))
def Fdh(t):  # completed, real and even on the critical line; scaled by exp(pi t/4) (positive scaling, inertia-neutral after row scaling)
    s = mp.mpf(1)/2 + 1j*t
    return ((5/mp.pi)**(s/2)*mp.gamma((s+1)/2)*dh(s))
def Fz(t):
    s = mp.mpf(1)/2 + 1j*t
    return (s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s))
print("== DH sanity: |f(0.808517+85.699348i)| =", mp.nstr(abs(dh(mp.mpc('0.808517','85.699348'))), 5),
      " Im F_DH(1/2+10i)/Re =", mp.nstr(Fdh(mp.mpf(10)).imag/Fdh(mp.mpf(10)).real, 5))
for name, G in (("DH", Fdh), ("zeta", Fz)):
    f   = lambda t, G=G: G(t).real
    df  = lambda t, f=f: mp.diff(f, t)
    d2f = lambda t, f=f: mp.diff(f, t, 2)
    for N, half in ((6, mp.mpf('1.0')), (10, mp.mpf('2.0')), (14, mp.mpf('3.0'))):
        ts = [mp.mpf('85.699348') - half + 2*half*(k+mp.mpf('0.31'))/N for k in range(N)]
        M = kernel(f, df, ts, d2f)
        p, q, low, _ = inertia(M, mp.mpf(10)**-45)
        print("  %-4s N=%2d window +-%s: (pos,neg)=(%d,%d) lowest normalized eigs %s" % (name, N, mp.nstr(half,2), p, q, low))
