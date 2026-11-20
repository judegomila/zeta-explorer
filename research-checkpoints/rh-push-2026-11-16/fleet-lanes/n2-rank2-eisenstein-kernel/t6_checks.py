# Checks of the two identities used in RESULT.md, power control over zeta, DH near its pole, sign twist.
import mpmath as mp, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
from t4_corner_sweep import blaschke
mp.mp.dps = 60
rng = random.Random(5)
print("== (A) rank-1 identity: (z-1)(conj w-1) K1_0 = z conj(w) A + B - v(z) conj v(w),  v = 1 - theta")
print("       and v = G(.,1)/(1+theta(1)), norm^2 = (1-theta(1))/(1+theta(1))")
Z = [mp.mpc('0.3', 2), mp.mpc('0.3', -2), mp.mpc('0.7', 2), mp.mpc('0.7', -2), mp.mpf('0.9'), mp.mpf('0.1')]
th = blaschke(Z); c = lambda z: c_pole(z) * th(z)
def kt(z, w): return (1 - th(z) * mp.conj(th(w))) / (z + mp.conj(w))
def ht(z, w): return -(th(z) - mp.conj(th(w))) / (z - mp.conj(w))
def G(z, w): return z * mp.conj(w) * (kt(z, w) + ht(z, w)) + (kt(z, w) - ht(z, w))
worst = 0
for _ in range(20):
    z = mp.mpc(rng.uniform(0.1, 2), rng.uniform(-5, 5)); w = mp.mpc(rng.uniform(0.1, 2), rng.uniform(-5, 5))
    lhs = (z - 1) * (mp.conj(w) - 1) * K1(z, w, c(z), c(w), mp.mpf(0))
    rhs = G(z, w) - (1 - th(z)) * mp.conj(1 - th(w))
    worst = max(worst, abs(lhs - rhs))
    one = mp.mpf(1)
    worst = max(worst, abs((1 - th(z)) * (1 + th(one)) - G(z, one + mp.mpf(10) ** -40)) / 1e20)
print("   max |lhs-rhs| =", nstr(worst, 3))
z = mp.mpc(0.7, 1.3); eps = mp.mpf(10) ** -25
print("   |v(z)(1+theta(1)) - G(z,1)| =", nstr(abs((1 - th(z)) * (1 + th(1)) - G(z, mp.mpf(1) + eps)), 3), "(eps 1e-25 offset)")

print("== (B) derivative identity: d/dx K2_{T + x alpha1^vee} = sum_{v,v'} a_v conj(a_v') K1_{alpha2(T)/2}(z_v, z_v')")
def K2T(c, n, T):
    l = lam_from(*n[0]); m = lam_from(*n[1])
    return K2(l, m, Mtable(c, *n[0]), Mtable(c, *n[1]), T)
def rhsB(c, n, T):
    # cosets of W_M \ W, M = {1, s_2}; minimal representatives v with z_v = (v lam)_2 - (v lam)_3 in {z2, z1+z2, z1}
    reps = [(0, 1, 2), (1, 0, 2), (2, 0, 1)]     # v lam = (lam[p0], lam[p1], lam[p2]) with p1 < p2
    t = (T[1] - T[2]) / 2
    TP = (T[0], (T[1] + T[2]) / 2, (T[1] + T[2]) / 2)
    out = 0
    def data(zz):
        l = lam_from(*zz); cc = {(0, 1): c(zz[0]), (1, 2): c(zz[1]), (0, 2): c(zz[0] + zz[1])}
        res = []
        for p in reps:
            m = mp.mpc(1)
            for a in range(3):
                for b in range(a + 1, 3):
                    if p[a] > p[b]: m *= cc[(p[b], p[a])]
            vl = (l[p[0]], l[p[1]], l[p[2]])
            res.append((m * mp.exp(sum(vl[i] * TP[i] for i in range(3))), vl[1] - vl[2]))
        return res
    dl = data(n[0]); dm = data(n[1])
    for (a, z) in dl:
        for (b, w) in dm:
            out += a * mp.conj(b) * K1(z, w, c(z), c(w), t)
    return out
h = mp.mpf(10) ** -20
a1 = (mp.mpf(1), mp.mpf(-1), mp.mpf(0))
for name, cc in (("zeta", c_zeta), ("c0*quad(0.2,3)", lambda z: c_pole(z) * blaschke(quad(0.2, 3))(z))):
    n = rand_nodes2(2, rng, im=(1, 20))
    T = (mp.mpf('0.5'), mp.mpf('0.1'), mp.mpf('-0.6'))
    Tp = tuple(T[i] + h * a1[i] for i in range(3)); Tm = tuple(T[i] - h * a1[i] for i in range(3))
    fd = (K2T(cc, n, Tp) - K2T(cc, n, Tm)) / (2 * h)
    print(f"   {name}: finite difference {nstr(fd, 12)}  formula {nstr(rhsB(cc, n, T), 12)}  |diff| {nstr(abs(fd - rhsB(cc, n, T)), 3)}")

print("== (C) power control over zeta: zeta's c times ONE conjugate pair x +- 14.1347i (inner, real, c(z)c(-z)=1; not FE-symmetric unless x=1/2)")
g1 = mp.im(mp.zetazero(1))
def evmin(c, n1, n2, T=(0, 0, 0)):
    T = tuple(mp.mpf(x) for x in T)
    _, d1, _, e1 = analyse(gram1(c, n1, mp.mpf(0))); _, d2, _, e2 = analyse(gram2(c, n2, T))
    return e1[0], e2[0], d2
sets = []
for sd in (11, 12):
    r = random.Random(sd); sets.append((f"rand{sd} Im 10-50", rand_nodes1(8, r), rand_nodes2(8, r)))
r = random.Random(21); sets.append(("Im 12-17", rand_nodes1(8, r, im=(12, 17)), rand_nodes2(8, r, im=(12, 17))))
r = random.Random(22); sets.append(("Im 0.2-6", rand_nodes1(8, r, im=(0.2, 6)), rand_nodes2(8, r, im=(0.2, 6))))
memo = {}
def cz(z):
    k = (mp.nstr(z.real, 40), mp.nstr(z.imag, 40))
    if k not in memo: memo[k] = c_zeta(z)
    return memo[k]
cases = [("zeta", [])] + [(f"zeta * pair x={x}", [mp.mpc(x, g1), mp.mpc(x, -g1)]) for x in ('0.1', '0.3', '0.45', '0.5', '0.7', '1.5')]
cases += [("zeta * quad(0.3, g1)  [FE-symmetric]", quad('0.3', g1)), ("zeta * pairs 0.2+-i g1, 0.8+-i(g1+1)", [mp.mpc('0.2', g1), mp.mpc('0.2', -g1), mp.mpc('0.8', g1 + 1), mp.mpc('0.8', -g1 - 1)])]
for name, Zs in cases:
    thz = blaschke(Zs); cc = lambda z: cz(z) * thz(z)
    row = []
    for (lab, n1, n2) in sets:
        e1, e2, d2 = evmin(cc, n1, n2)
        row.append(f"{lab}: R1 {nstr(e1,2)} R2 {nstr(e2,2)}" + ("" if d2 > 0 else f"[diag {nstr(d2,2)}]"))
    print(f"   {name:40s} T=0 evmin | " + " | ".join(row)); sys.stdout.flush()

print("== (D) DH: zeros with Re > 1 exist (classical) but none was located below height 260 (t6d_dh_zero.py); FE and E_a residue signs")
print("   FE check c(z)c(-z) at z=0.3+7i:", nstr(c_dh(mp.mpc(0.3, 7)) * c_dh(-mp.mpc(0.3, 7)), 8))
print("   E_a, a=0.2: c_a on the real axis near its two poles 1-a, 1+a (sign of (z-p) c_a(z) = sign of the residue):")
ca = make_Ea('0.2')
for p in ('0.8', '1.2'):
    z = mp.mpf(p) + mp.mpf(10) ** -12
    print("     p =", p, " (z-p) c_a(z) ->", nstr((z - mp.mpf(p)) * ca(z), 8))
print("   zeta: residue of c at 1 =", nstr(mp.mpf(10) ** -12 * c_zeta(1 + mp.mpf(10) ** -12), 10), " 1/xi(2) =", nstr(1 / xi(mp.mpf(2)), 10))
print("== (E) sign twist (Liouville: L = zeta(2s)/zeta(s)); c(z)c(-z) and |c| on the imaginary axis")
z = mp.mpc(0.3, 7)
print("   c(z)c(-z) =", nstr(c_liouville(z) * c_liouville(-z), 8), "  |c(12i)| =", nstr(abs(c_liouville(mp.mpc(0, 12))), 8), " (zeta: ", nstr(abs(c_zeta(mp.mpc(0, 12))), 8), ")")
r = random.Random(11); n1 = rand_nodes1(8, r); n2 = rand_nodes2(8, r)
A = gram2(c_liouville, n2, (mp.mpf(0),) * 3)
hd, d2min, _, e2 = analyse(A)
_, d1min, _, e1 = analyse(gram1(c_liouville, n1, mp.mpf(0)))
print("   Hermitian defect of the rank-2 Gram matrix (relative):", nstr(hd, 3), "; R1 evmin", nstr(e1[0], 3), "R2 evmin", nstr(e2[0], 3), "min diag", nstr(d2min, 3))
