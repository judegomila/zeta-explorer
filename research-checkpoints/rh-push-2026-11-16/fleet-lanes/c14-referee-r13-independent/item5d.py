# Lane 5, Lemma 1: two further instances (one off the critical line), same routines as items35.py, shorter range V.
import sys, os, json, math, random, time
from fractions import Fraction
from flint import arb, acb, ctx, dirichlet_char

out = {}
ctx.prec = 200
PI = acb.pi()
I = acb(0, 1)

def hz(s, a):
    return acb(s).zeta(a)


def estermann(u, w, h, k):
    """D(u, w; h/k) = sum sigma_w(n) e(nh/k) n^-u = k^(w-2u) sum_{m,n=1..k} e(mnh/k) zeta(u-w, m/k) zeta(u, n/k)."""
    u, w = acb(u), acb(w)
    h = h % k
    z1 = [hz(u - w, arb(m) / k) for m in range(1, k + 1)]
    z2 = [hz(u, arb(n) / k) for n in range(1, k + 1)]
    tot = acb(0)
    for m in range(1, k + 1):
        for n in range(1, k + 1):
            tot += (2 * PI * I * ((m * n * h) % k) / k).exp() * z1[m - 1] * z2[n - 1]
    return acb(k) ** (w - 2 * u) * tot


# Lemma 1 (finite J with remainder integral), coded from the display in the lane's RESULT.md section 1
def Xf(u):
    u = acb(u)
    return acb(2) ** u * PI ** (u - 1) * (PI * u / 2).sin() * (1 - u).gamma()


def Q2j(b, j):
    v = acb(1)
    for l in range(j):
        v *= (arb(2 * l + 1) / 2) ** 2 - b * b
    return v


def lemma1(a, q, b, J, c, V, V1):
    b = acb(b)
    x = arb(a) / q
    D0 = estermann(acb(1) / 2 + b, 2 * b, a, q)
    lg = (2 * PI / x).log()
    main = acb(0)
    dual0 = None
    for j in range(J + 1):
        pref = (-1) ** j * Q2j(b, j) / math.factorial(j)
        Dj = estermann(acb(1) / 2 + b + j, 2 * b, -q, a)
        if j == 0:
            dual0 = Dj
        br = (x / (2 * PI * I)) ** j * Dj
        for l in range(j + 1):
            br -= acb((-1) ** (j - l)) / math.factorial(j - l) * (acb(1) / 2 + l + b).zeta() * (acb(1) / 2 + l - b).zeta() * (x / (2 * PI * I)) ** l
        br -= (acb(1) / 2 + b - j).gamma() * (1 + 2 * b).zeta() * (-(acb(1) / 2 + b) * lg).exp() * (-(acb(1) / 2 + b) * PI * I / 2).exp()
        br -= (acb(1) / 2 - b - j).gamma() * (1 - 2 * b).zeta() * (-(acb(1) / 2 - b) * lg).exp() * (-(acb(1) / 2 - b) * PI * I / 2).exp()
        main += pref * br
    coefs = [(-1) ** j * Q2j(b, j) / math.factorial(j) for j in range(J + 1)]
    lg2 = lg + PI * I / 2
    half = acb(1) / 2

    def integrand(v, analytic):
        w = acb(c) + I * v
        H = (2 * PI) ** (2 * w) * (-w).gamma() / (Xf(half + w - b) * Xf(half + w + b))
        sub = acb(0)
        for j in range(J + 1):
            sub += coefs[j] * (w - j).gamma()
        return (H - sub) * (half + w - b).zeta() * (half + w + b).zeta() * (-w * lg2).exp()
    tot = acb(0)
    edges = [-V1]
    while edges[-1] < V:
        step = 2.0 if abs(edges[-1]) < 60 else (10.0 if edges[-1] < 300 else 50.0)
        edges.append(min(V, edges[-1] + step))
    for e0, e1 in zip(edges[:-1], edges[1:]):
        tot += acb.integral(integrand, acb(e0), acb(e1), rel_tol=arb(2) ** -90, abs_tol=arb(2) ** -110)
    EJ = tot / (2 * PI)
    # size of the integrand at the upper end (tail indicator)
    tail = abs(integrand(acb(V), False))
    return D0, main, EJ, dual0, tail


cf = lambda z: complex(float(z.real.mid()), float(z.imag.mid()))
lem = {}
for (a, q, b, J, c, V) in ((4, 9, acb(0.15, 1.2), 8, -0.8, 350.0), (5, 7, acb(0, 3.2), 9, -0.75, 350.0)):
    ctx.prec = 260
    t0 = time.time()
    D0, main, EJ, dual0, tail = lemma1(a, q, b, J, c, V, 48.0)
    lem['a/q=%d/%d b=%s J=%d c=%g V=%g' % (a, q, cf(b), J, c, V)] = dict(D0=str(cf(D0)), main=str(cf(main)), E_J=str(cf(EJ)), defect=float(abs(D0 - main - EJ).abs_upper()),
                                                                            defect_without_E_J=float(abs(D0 - main).mid()), dual_j0=str(cf(dual0)), abs_integrand_at_V=float(tail.mid()), seconds=round(time.time() - t0, 1))
    print(json.dumps(lem, indent=1), flush=True)
    json.dump(lem, open(sys.argv[1], 'w'), indent=1)
