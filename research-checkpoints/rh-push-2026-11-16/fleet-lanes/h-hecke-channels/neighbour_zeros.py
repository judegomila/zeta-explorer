# Zeros of the Epstein field on the p=3 and p=5 neighbours of the square torus tau=i (python-flint, 100 bits;
# floating evaluation, radii not used as a certificate).
#   Lambda_{p i}(s) = (1/2) pi^-s Gamma(s) p^s (A+B),  Lambda_{(-1+p i)/2}(s) = (1/2) pi^-s Gamma(s) p^s (A-B)
import sys, json, cmath, math
from flint import acb, arb, dirichlet_char, ctx
ctx.prec = 100
L4 = dirichlet_char(4, 3); L3 = dirichlet_char(3, 2); L12 = dirichlet_char(12, 11)
L5 = dirichlet_char(5, 4); L20 = dirichlet_char(20, 19)

def parts(s, p):
    A0 = s.zeta()*L4.l(s)
    if p == 3:
        return (1 + acb(3)**(1-2*s))*A0, L3.l(s)*L12.l(s)
    return (1 - 2*acb(5)**(-s) + acb(5)**(1-2*s))*A0, L5.l(s)*L20.l(s)

def g(s, p, sign):
    A, B = parts(s, p); return A + sign*B
def gc(sig, t, p, sign):
    v = g(acb(sig, t), p, sign); return complex(float(v.real.mid()), float(v.imag.mid()))

def check(p):
    from mpmath import mp, mpc, pi, gamma, mpf, nstr
    from hecke_checks import Estar
    mp.dps = 25; out = []
    for (a, b) in [(0.7, 11.3), (1.4, 3.1)]:
        s = mpc(a, b); pre = pi**(-s)*gamma(s)*mpf(p)**s/2
        e1 = Estar(mpc(0, p), s); e2 = Estar(mpc(-0.5, p/2.), s)
        v1 = g(acb(a, b), p, 1); v2 = g(acb(a, b), p, -1)
        v1 = mpc(v1.real.mid().str(28, radius=False), v1.imag.mid().str(28, radius=False)); v2 = mpc(v2.real.mid().str(28, radius=False), v2.imag.mid().str(28, radius=False))
        out.append((nstr(abs(e1-pre*v1)/abs(e1), 3), nstr(abs(e2-pre*v2)/abs(e2), 3)))
    return out

def newton(s, p, sign):
    for _ in range(60):
        f = g(s, p, sign); h = acb(1e-12)
        d = (g(s+h, p, sign) - g(s-h, p, sign))/(2*h)
        step = f/d
        s = acb(s.real.mid(), s.imag.mid()) - acb(step.real.mid(), step.imag.mid())
        s = acb(s.real.mid(), s.imag.mid())
        if abs(complex(float(step.real.mid()), float(step.imag.mid()))) < 1e-22: break
    return s

def scan(p, sign, T, ds=0.02, dt=0.04, smin=0.5, smax=1.7):
    ns = int(round((smax-smin)/ds))+1; nt = int(round((T-1)/dt))+1
    row = lambda j: [abs(gc(smin+i*ds, 1+j*dt, p, sign)) for i in range(ns)]
    r0 = row(0); r1 = row(1); roots = []
    for j in range(1, nt-1):
        r2 = row(j+1)
        for i in range(1, ns-1):
            v = r1[i]
            if v < r1[i-1] and v <= r1[i+1] and v < r0[i] and v <= r2[i]:
                s0 = complex(smin+i*ds, 1+j*dt)
                r = newton(acb(s0.real, s0.imag), p, sign)
                rc = complex(float(r.real.mid()), float(r.imag.mid()))
                if rc.real > 0.5 + 1e-9 and abs(rc - s0) < 0.3 and all(abs(rc-q[0]) > 1e-7 for q in roots):
                    roots.append((rc, r))
        r0, r1 = r1, r2
    return roots

def winding(p, sign, T, a=-1.0, b=2.5, t0=1.0):
    pts = []
    def edge(z0, z1, n):
        for k in range(n): pts.append(z0 + (z1-z0)*k/n)
    step = 0.01
    edge(complex(a, t0), complex(b, t0), int((b-a)/step)); edge(complex(b, t0), complex(b, T), int((T-t0)/step))
    edge(complex(b, T), complex(a, T), int((b-a)/step)); edge(complex(a, T), complex(a, t0), int((T-t0)/step))
    tot = 0.0; prev = gc(pts[0].real, pts[0].imag, p, sign); worst = 0
    for z in pts[1:] + pts[:1]:
        cur = gc(z.real, z.imag, p, sign); d = cmath.phase(cur/prev); worst = max(worst, abs(d)); tot += d; prev = cur
    return tot/(2*math.pi), worst

def online(p, sign, T, t0=1.0, dt=0.002):
    def Z(t):
        s = acb(0.5, t)
        v = (acb.pi()**(-s))*s.gamma()*acb(p)**s*g(s, p, sign)
        return float(v.real.mid())
    n = 0; t = t0; prev = Z(t)
    while t < T:
        t += dt; cur = Z(t)
        if (cur > 0) != (prev > 0): n += 1
        prev = cur
    return n

if __name__ == "__main__":
    p = int(sys.argv[1]); T = float(sys.argv[2])
    print("identity check vs Bessel expansion, p=%d:" % p, check(p), flush=True)
    res = {}
    for sign in (1, -1):
        rts = scan(p, sign, T); rts.sort(key=lambda q: q[0].imag)
        w, worst = winding(p, sign, T); nl = online(p, sign, T)
        res[str(sign)] = {"offline": [(q[1].real.mid().str(18, radius=False), q[1].imag.mid().str(18, radius=False)) for q in rts], "winding": w, "online": nl}
        print("p=%d sign=%+d  box [-1,2.5]x[1,%g]: winding=%.4f (max step %.2f rad)  sign changes on line=%d  off-line found (Re>1/2)=%d  => winding - online - 2*off = %.4f"
              % (p, sign, T, w, worst, nl, len(rts), w - nl - 2*len(rts)), flush=True)
        for rc, r in rts:
            A, B = parts(r, p)
            print("    %.12f + %.12f i   |g|=%.1e  |A|=%.4f |B|=%.4f" % (rc.real, rc.imag, abs(gc(rc.real, rc.imag, p, sign)),
                  abs(complex(float(A.real.mid()), float(A.imag.mid()))), abs(complex(float(B.real.mid()), float(B.imag.mid())))), flush=True)
    json.dump(res, open("neighbour_zeros_p%d.json" % p, "w"), indent=1)
