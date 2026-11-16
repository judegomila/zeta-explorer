# Two-point vertical mixture f_a(z) = Xi(z+a) + Xi(z-a), Xi(z) = xi(1/2+iz)/2 (real on R, even).
# Multiplier form: f_a = 2 * int cos(a u) Phi(u) e^{izu} du.
# Real zeros in (-X, X) by sign changes; all zeros in the box [-X,X] x [-Y,Y] by winding number.
from mpmath import mp, mpf, mpc, pi, gamma, zeta, arg
import cmath, math
mp.dps = 15
def Xi(z):
    s = mpc(0.5, 0) + 1j*z; return s*(s-1)*pi**(-s/2)*gamma(s/2)*zeta(s)/4
def f(a, z): return Xi(z+a) + Xi(z-a)
def real_count(a, X, h=0.02):
    n = 0; prev = None; zs = []
    N = int(round(X/h))
    for k in range(0, N+1):
        x = k*h + 1e-9
        v = f(a, mpf(x)).real
        if prev is not None and (v > 0) != (prev > 0): n += 1; zs.append(round(x, 2))
        prev = v
    return n, zs
def winding(a, X, Y, h=0.02):
    pts = []
    nx = int(2*X/h); ny = int(2*Y/h)
    pts += [complex(-X + 2*X*k/nx, -Y) for k in range(nx)]
    pts += [complex(X, -Y + 2*Y*k/ny) for k in range(ny)]
    pts += [complex(X - 2*X*k/nx, Y) for k in range(nx)]
    pts += [complex(-X, Y - 2*Y*k/ny) for k in range(ny)]
    tot = 0.0; prev = None; first = None; maxstep = 0
    for p in pts + [pts[0]]:
        w = complex(f(a, mpc(p)))
        th = cmath.phase(w)
        if prev is not None:
            d = th - prev
            while d > math.pi: d -= 2*math.pi
            while d < -math.pi: d += 2*math.pi
            tot += d; maxstep = max(maxstep, abs(d))
        prev = th
    return tot/(2*math.pi), maxstep
X = 60.3; Y = 4.0
for a in [0, 0.5, 1, 2, 3, 5]:
    n, zs = real_count(a, X)
    w, ms = winding(a, X, Y)
    print("a=%-4s real zeros in (0,X): %d  => 2x = %d ; zeros in box (winding) = %.3f (max phase step %.2f) ; nonreal in box = %d" % (a, n, 2*n, w, ms, round(w) - 2*n), flush=True)
    if a in (2, 3, 5): print("   real zeros:", zs)
