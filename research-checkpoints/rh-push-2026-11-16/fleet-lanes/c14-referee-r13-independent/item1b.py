# Lane 1 supplement: (i) Lemma L with the full theta kernel (direct sum with enough terms), zeta's own lattice-row
# minors and the twin's, in the lane's node range and in wider ranges; (ii) Lemma E transform and log-concavity redone
# with enough terms of the series at negative arguments (the first pass truncated at 30 terms).
import sys, os, json, math, random, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from flint import arb, acb, ctx
import item6_kern as K
out = {}


def theta_direct(x):
    xf = float(x.mid())
    N = int(math.sqrt((ctx.prec * 0.6932 + 60) / (math.pi * xf))) + 3
    s = arb(0)
    for n in range(1, N + 1):
        s += (-arb.pi() * n * n * x).exp()
    return 1 + 2 * s


def theta(x):
    # Jacobi: theta(x) = x^(-1/2) theta(1/x) (CLASSICAL), used for x < 1 to keep the sums short;
    # checked against the direct sum below.
    if x < 1:
        return theta_direct(1 / x) / x.sqrt()
    return theta_direct(x)


ctx.prec = 400
out['jacobi_check'] = float(abs(theta(arb(3) / 100) - theta_direct(arb(3) / 100)).upper())
print('jacobi check', out['jacobi_check'], flush=True)


def detr(M):
    return K.det([[acb(v) for v in row] for row in M]).real


def sgn(v):
    return 1 if v > 0 else (-1 if v < 0 else 0)


def run(p0, c, k, rng, amax, ylog, x0log, ntr):
    cnt_z = {1: 0, -1: 0, 0: 0}
    cnt_w = {1: 0, -1: 0, 0: 0}
    for _ in range(ntr):
        x0 = math.exp(rng.uniform(-x0log, x0log))
        a = sorted(rng.sample(range(-amax, amax + 1), k))
        y = sorted(math.exp(rng.uniform(-ylog, ylog)) for _ in range(k))
        sz = sw = 0
        for prec in (2000, 8000, 32000, 128000):
            ctx.prec = prec
            om = {-1: arb(p0) ** (-0.5), 0: arb(c), 1: arb(p0) ** 0.5}
            cache = {}

            def Kv(m, j):
                if (m, j) not in cache:
                    cache[(m, j)] = theta(arb(x0) * arb(p0) ** (2 * m) * arb(y[j]))
                return cache[(m, j)]
            Z = [[Kv(ai, j) for j in range(k)] for ai in a]
            W = [[sum(om[n] * Kv(ai + n, j) for n in (-1, 0, 1)) for j in range(k)] for ai in a]
            sz, sw = sgn(detr(Z)), sgn(detr(W))
            if sz != 0 and sw != 0:
                break
        cnt_z[sz] += 1
        cnt_w[sw] += 1
    return dict(zeta_lattice_minors=cnt_z, twin_lattice_minors=cnt_w)


res = {}
for label, (amax, ylog, x0log) in {'lane range (a in -2..2, |log y| <= 1.2, |log x0| <= 0.5)': (2, 1.2, 0.5),
                                    'wider (a in -3..3, |log y| <= 2.5, |log x0| <= 0.35)': (3, 2.5, 0.35)}.items():
    for (p0, c) in ((2, 2.0506), (2, 2.0), (3, 2.0785), (2, 0.5), (2, 1.4142)):
        if p0 == 3 and amax == 3:
            continue
        for k in (3, 4, 5):
            rng = random.Random(1000 * p0 + 10 * k + int(c * 100))
            r = run(p0, c, k, rng, amax, ylog, x0log, 100)
            res['%s | p0=%d c=%g k=%d' % (label, p0, c, k)] = r
            print(label, p0, c, k, r, flush=True)
out['lemma_L_theta'] = res

# Lemma E redone
ctx.prec = 128
PI = acb.pi()


def k3(v):
    vf = float(acb(v).real.mid())
    N = int(math.sqrt((ctx.prec * 0.6932 + 60) / (math.pi * math.exp(2 * min(vf, 0.0) - 0.2)))) + 3
    return K._k3zeta_point(acb(v), N)


def xis(u):
    u = acb(u)
    return PI ** (-u / 2) * (u / 2).gamma() * u.zeta()


def rxi(s):
    s = acb(s)
    return s * (s - 1) / 2 * xis(s)


def tr(z):
    z = acb(z)
    tot = acb(0)
    for e0, e1 in ((-3.2, -1.5), (-1.5, 0), (0, 1.5), (1.5, 3.2)):
        tot += acb.integral(lambda v, an: k3(v) * (z * v).exp(), acb(e0), acb(e1), rel_tol=arb(2) ** -60)
    return tot


cf = lambda z: complex(float(z.real.mid()), float(z.imag.mid()))
a = arb(3) / 10
t = arb(37) / 10
v1, v2 = tr(acb(a, t)), tr(acb(-a, t))
x1 = rxi(acb(arb(1) / 2 + a, t))
x2 = rxi(acb(arb(1) / 2 - a, t))
out['lemma_E_transform'] = dict(int_K3_e_plus=str(cf(v1)), two_xi_plus=str(cf(2 * x1)), int_K3_e_minus=str(cf(v2)), two_xi_minus=str(cf(2 * x2)),
                                product_over_4=str(cf(v1 * v2 / 4)), abs_xi_sq=float((abs(x1) ** 2).mid()), lane_value=0.13091264136,
                                defect_plus=float(abs(v1 - 2 * x1).abs_upper()), defect_minus=float(abs(v2 - 2 * x2).abs_upper()))
print(out['lemma_E_transform'], flush=True)


def phi_a(u, aa):
    u = acb(u)
    tot = acb(0)
    edges = [-3.2, -1.0, 0.0, 1.0, 3.2]
    for e0, e1 in zip(edges[:-1], edges[1:]):
        tot += acb.integral(lambda v, an: k3(v) * (aa * v).exp() * k3(u - v) * (-aa * (u - v)).exp(), acb(e0), acb(e1), rel_tol=arb(2) ** -50)
    return tot.real


ctx.prec = 100
grid = [arb(j) / 20 for j in range(0, 33)]
for aa in (arb(3) / 10, arb(45) / 100):
    vals = [phi_a(u, aa) for u in grid]
    lg = [v.log() for v in vals]
    sd = [float(((lg[j - 1] - 2 * lg[j] + lg[j + 1]) * 400).upper()) for j in range(1, len(lg) - 1)]
    # order-3 determinant check of the convolution kernel on equally spaced nodes (PF_3 pattern for kernels K(u_i - v_j))
    out['lemma_E_logconcavity_a=%g' % float(aa)] = dict(max_second_difference_of_log=max(sd), all_positive_values=all(v > 0 for v in vals), decreasing=all(vals[j + 1] < vals[j] for j in range(len(vals) - 1)), phi_a_0=float(vals[0].mid()))
    print(out['lemma_E_logconcavity_a=%g' % float(aa)], flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
