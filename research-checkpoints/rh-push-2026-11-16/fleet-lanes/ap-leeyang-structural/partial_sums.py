# Symmetrised partial sums over n:  g_N(s) = G(s) D_N(s) + G(1-s) D_N(1-s),
# G(s) = pi^{-s/2} Gamma(s/2), D_N(s) = sum_{n<=N} n^{-s}.
# Kernel side: Phi_N(u) = sum_{n<=N} n^{-1/2} [phi(u + log(n)/2) + phi(-u + log(n)/2)] up to the factor s(s-1)/2.
# Question: is "all zeros on the line" preserved when terms n = 1..N are added?
# Count zeros in the box 1/2-W < Re s < 1/2+W, T0 < t < T by winding; count sign changes on the line.
# Memory: O(perimeter/step) Python floats, < 10^5 numbers.
import sys
from mpmath import mp, mpf, mpc, pi, loggamma, exp, log, findroot, arg
mp.dps = 20
def gN(s, N, shift):
    # shift: real number subtracted in the exponent to avoid underflow (same for both terms)
    a = exp(-(s/2)*log(pi) + loggamma(s/2) - shift)*sum(mpf(n)**(-s) for n in range(1, N+1))
    r = 1 - s
    b = exp(-(r/2)*log(pi) + loggamma(r/2) - shift)*sum(mpf(n)**(-r) for n in range(1, N+1))
    return a + b
def winding(N, W, T0, T, step):
    import cmath
    pts = []
    x0, x1 = 0.5 - W, 0.5 + W
    nx = int(2*W/step); nt = int((T-T0)/step)
    for k in range(nx): pts.append(complex(x0 + 2*W*k/nx, T0))
    for k in range(nt): pts.append(complex(x1, T0 + (T-T0)*k/nt))
    for k in range(nx): pts.append(complex(x1 - 2*W*k/nx, T))
    for k in range(nt): pts.append(complex(x0, T - (T-T0)*k/nt))
    print("  planned contour evaluations:", len(pts)); sys.stdout.flush()
    tot = 0.0; prev = None; mx = 0.0
    for p in pts + [pts[0]]:
        s = mpc(p.real, p.imag)
        shift = (loggamma(mpc(0.25, p.imag/2))).real  # size of Gamma on the line at this height
        v = complex(gN(s, N, shift))
        ph = cmath.phase(v)
        if prev is not None:
            d = ph - prev
            while d > cmath.pi: d -= 2*cmath.pi
            while d < -cmath.pi: d += 2*cmath.pi
            tot += d; mx = max(mx, abs(d))
        prev = ph
    return tot/(2*cmath.pi), mx
def line_sign_changes(N, T0, T, step):
    c = 0; prev = None
    k = 0
    t = T0
    while t <= T:
        s = mpc(0.5, t)
        shift = (loggamma(mpc(0.25, t/2))).real
        v = gN(s, N, shift).real
        sg = 1 if v > 0 else -1
        if prev is not None and sg != prev: c += 1
        prev = sg; t += step
    return c
T0, T, W = 1.0, 200.0, 4.0
for N in [1, 2, 3, 4, 5, 10]:
    w, mx = winding(N, W, T0, T, 0.01)
    c = line_sign_changes(N, T0, T, 0.002)
    print("N=%d  zeros in box (winding)=%.4f  max phase step=%.3f  sign changes on line=%d  off-line zeros=%d" % (N, w, mx, c, round(w)-c))
    sys.stdout.flush()
# locate the off-line zeros for N=3 by Newton from a grid
print("off-line zeros for N=3 (Re s > 1/2), t < 200:")
found = []
import itertools
for t0 in [x*0.5 for x in range(2, 400)]:
    for x0 in [0.6, 0.8, 1.1, 1.5]:
        try:
            shift = (loggamma(mpc(0.25, t0/2))).real
            r = findroot(lambda s: gN(s, 3, shift), mpc(x0, t0), tol=1e-14, maxsteps=30)
        except Exception:
            continue
        if r.real > 0.5 + 1e-6 and 1 < r.imag < 200 and all(abs(r - q) > 1e-6 for q in found):
            found.append(r)
found.sort(key=lambda q: q.imag)
print(" count:", len(found))
for q in found[:12]:
    print("  ", mp.nstr(q, 12))
