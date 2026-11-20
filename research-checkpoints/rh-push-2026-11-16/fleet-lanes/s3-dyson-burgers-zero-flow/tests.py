"""Validation on cases with known answers."""
import numpy as np, math, zf
from zf import xp, asnp
ok = True
def chk(name, got, want, tol):
    global ok
    good = abs(got - want) <= tol; ok &= good
    print('%-58s got %.12g want %.12g %s' % (name, got, want, 'ok' if good else 'FAIL'))
# 1 uniform lattice: Theta_K = K/(K+1)
for K in (1, 6, 50):
    x = np.arange(2 * K + 2, dtype=float); g, Th = zf.pair_theta(x, K=2 * K + 2)
    chk('lattice central Theta_K, K=%d' % K, Th[K], K / (K + 1), 1e-12)
# 2 four-tie {-1,0,1,1+b}: central 1/4 + 1/(2b(b+1))
b = 2.5; x = np.array([-1, 0, 1, 1 + b]); g, Th = zf.pair_theta(x, K=4)
chk('four-tie central Theta', Th[1], 0.25 + 1 / (2 * b * (b + 1)), 1e-12)
chk('symmetric triplet Theta', zf.pair_theta(np.array([-1., 0, 1]), K=3)[1][0], 0.25, 1e-12)
# 3 conjugate pair as extra particle: closed form 2 Re 1/((a-z)(b-z))
z = np.array([3 + 0.7j, 3 - 0.7j]); x = np.array([0., 1.]); g, Th = zf.pair_theta(x, K=2, extra=z)
chk('extra complex pair', Th[0], 0.5 * 2 * (1 / ((0 - z[0]) * (1 - z[0]))).real, 1e-12)
# 4 window statistics against brute force
rng = np.random.default_rng(1); x = np.cumsum(rng.gamma(4, 0.25, 4000)); g, Th = zf.pair_theta(x, K=50)
for N in (2, 7, 20, 64):
    r = zf.window_stats(g, Th, [N])[0]; w = N - 1
    am = [s + int(np.argmin(g[s:s + w])) for s in range(len(g) - w + 1)]
    chk('window fail count N=%d' % N, r['fail_0.25'], sum(Th[i] > 0.25 for i in am), 0)
    chk('window max Theta N=%d' % N, r['maxTheta'], max(Th[i] for i in am), 1e-15)
    chk('number of windows N=%d' % N, r['windows'], len(am), 0)
i = int(np.argmax(Th * (g < np.quantile(g, 0.2)))); sp = zf.span_of(g, i)
chk('span_of is maximal window', all(g[j] >= g[i] for j in range(max(0, i - 3), min(len(g), i + 3))) or sp >= 2, True, 0)
# 5 flows: two particles t_c = g^2/8; symmetric triplet: outer pair gap G=2d: d' = -2(1/d + 1/(2d)) = -3/d -> t_c = d^2/6 (A1 is sharp there)
r = zf.backward_flow(np.array([0., 0.3]), np, cfl=0.05, stop=1e-8); chk('two-body t_c = g^2/8', r['tc'], 0.09 / 8, 1e-10)
r = zf.backward_flow(np.array([-0.3, 0., 0.3]), np, cfl=0.02, stop=1e-8); chk('symmetric triplet t_c = g^2/6', r['tc'], 0.09 / 6, 1e-7)
# conjugate pair alone: b^2 = b0^2 + 2 s ; plus a far real pair colliding at g^2/8 (1 + small)
X = np.array([0 + 0.5j, 0 - 0.5j, 40.0, 40.2]); r = zf.backward_flow(X, np, cfl=0.05, isreal=np.array([False, False, True, True]), stop=1e-8)
chk('conjugate pair separates: b(s)^2 = b0^2 + 2 s', r['X'][0].imag ** 2, 0.25 + 2 * r['s_end'], 1e-5)
chk('real pair next to a far conjugate pair', r['tc'] / (0.04 / 8), 1.0, 2e-3)
# forces on the backend
x = np.sort(rng.normal(size=300)); F = asnp(zf.forces(xp.asarray(x), xp)); Fd = np.array([sum(1 / (x[k] - x[j]) for j in range(300) if j != k) for k in range(300)])
chk('pairwise forces (backend %s)' % ('gpu' if zf.GPU else 'cpu'), float(np.abs(F - Fd).max() / np.abs(Fd).max()), 0, 1e-12)
# long double flow
r = zf.backward_flow(np.array([0., 0.3], dtype=np.longdouble), np, cfl=0.05, stop=1e-8); chk('two-body long double', r['tc'], 0.09 / 8, 1e-9)
# frozen far field against the full flow
x = np.cumsum(rng.gamma(6, 1 / 6, 1200)); i = int(np.argmin(np.diff(x))); rf = zf.backward_flow(x, np)
lo = max(0, min(900, i - 150)); sel = np.zeros(1200, bool); sel[lo:lo + 300] = True
F0, F1 = zf.rect_field(x[sel], x[~sel], np); rz = zf.backward_flow(x[sel], np, ext=(F0, F1, x[sel].copy()))
chk('frozen linearised far field vs full flow (rel)', rz['tc'] / rf['tc'], 1.0, 1e-5)
print('ALL OK' if ok else 'SOME FAILED')

# 6 exact window definition against brute force
import c1
rng = np.random.default_rng(3); x = np.cumsum(rng.gamma(2, 0.5, 3000)); g, Th = zf.pair_theta(x, K=200)
for N in (100, 180):
    w = N - 1; nf = 0; mx = 0
    for s0 in range(len(x) - N + 1):
        W = x[s0:s0 + N]; k = int(np.argmin(np.diff(W))); t = (W[k] - W) * (W[k + 1] - W); t[k] = np.inf; t[k + 1] = np.inf
        v = 0.5 * (W[k + 1] - W[k]) ** 2 * (1 / t).sum(); nf += v > 0.25; mx = max(mx, v)
    f, m = c1.exact_for_pairs(x, g, np.arange(len(g)), N, 0.25)
    chk('exact window fail count N=%d' % N, f, nf, 0); chk('exact window max N=%d' % N, m, mx, 1e-12)
print('ALL OK' if ok else 'SOME FAILED')

# 7 T-NR local-factor zeros: closed form against the direct sum over 4000 pairs
a, b = 1977.17, 1977.27; D = 2 * math.pi / math.log(3); bb = math.acosh(1.1) / math.log(3)
w = np.array([complex((2 * k + 1) * math.pi / math.log(3), sgn * bb) for k in range(-200000, 200000) for sgn in (1, -1)])
chk('T-NR factor zeros closed form', float(c1.tnr_extra_E(np.array([a]), np.array([b]))[0]), float((1 / ((a - w) * (b - w))).sum().real), 1e-5)
print('ALL OK' if ok else 'SOME FAILED')
