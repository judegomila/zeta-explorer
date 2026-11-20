# First test proper: zeta's c, E_a, Blaschke fakes over zeta, DH. Rank 1 and rank 2 Gram spectra.
import mpmath as mp, random, sys, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
mp.mp.dps = 70
TOL = mp.mpf(10) ** -45
G1 = mp.im(mp.zetazero(1)); G2 = mp.im(mp.zetazero(2))
def Tvec(t1, t2):
    t1 = mp.mpf(t1); t2 = mp.mpf(t2)
    return ((2 * t1 + t2) / 3, (-t1 + t2) / 3, (-t1 - 2 * t2) / 3)
TS = [(0, 0), (0.05, 0.05), (0.3, 0), (0, 0.3), (0.3, 0.3), (1, 1), (-0.2, -0.2)]
def cached(c):
    memo = {}
    def f(z):
        k = (mp.nstr(z.real, 40), mp.nstr(z.imag, 40))
        if k not in memo: memo[k] = c(z)
        return memo[k]
    return f
def run(name, c, nodesets):
    c = cached(c)
    for label, n1, n2 in nodesets:
        row1 = []; row2 = []
        for (t1, t2) in TS:
            _, d1, _, ev1 = analyse(gram1(c, n1, mp.mpf(t1)))
            _, d2, _, ev2 = analyse(gram2(c, n2, Tvec(t1, t2)))
            row1.append(f"t={t1}: {nstr(ev1[0],3)}" + ("" if d1 > 0 else f"[diag {nstr(d1,2)}]"))
            row2.append(f"T=({t1},{t2}): {nstr(ev2[0],3)}" + ("" if d2 > 0 else f"[diag {nstr(d2,2)}]"))
        print(f"## {name} | nodes {label}")
        print("   R1 evmin: " + "; ".join(row1))
        print("   R2 evmin: " + "; ".join(row2))
        sys.stdout.flush()
def nodesets(n=8):
    out = []
    for sd in (11, 12):
        rng = random.Random(sd)
        out.append((f"rand{sd} Im 10-50", rand_nodes1(n, rng), rand_nodes2(n, rng)))
    rng = random.Random(21)   # clustered near the first zero height
    out.append(("near g1 Im 12-17", rand_nodes1(n, rng, im=(12, 17)), rand_nodes2(n, rng, im=(12, 17))))
    return out
NS = nodesets()
t0 = time.time()
run("zeta", c_zeta, NS)
run("E_a a=0.2", make_Ea(0.2), NS)
run("fake on-line: zero pair g1 -> 16", make_fake(c_zeta, quad(0, 16), quad(0, G1)), NS)
for d in (0.1, 0.3, 0.45):
    run(f"fake off-line: pair g1 -> quad(d={d}, g1)", make_fake(c_zeta, quad(d, G1), quad(0, G1)), NS)
run("fake off-line count-preserving: pairs g1,g2 -> quad(0.3,(g1+g2)/2)", make_fake(c_zeta, quad(0.3, (G1 + G2) / 2), quad(0, G1) + quad(0, G2)), NS)
run("fake: zeta + extra quad(0.3, 30)", make_fake(c_zeta, quad(0.3, 30)), NS)
run("fake root number -1: zeta * zero at 1/2", make_fake(c_zeta, [mp.mpf(1) / 2]), NS)
print("time", time.time() - t0); sys.stdout.flush()
run("DH", c_dh, NS)
rng = random.Random(31)
dhn1 = [mp.mpc(rng.uniform(1.1, 1.5), rng.uniform(8, 10)) for _ in range(6)]
dhn2 = [(mp.mpc(rng.uniform(0.9, 1.6), rng.uniform(8, 10)), mp.mpc(rng.uniform(0.1, 0.9), rng.uniform(-30, -20))) for _ in range(6)]
run("DH", c_dh, [("near the pole of c_DH at 1.3086+8.918i", dhn1, dhn2)])
print("time", time.time() - t0)
