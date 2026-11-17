# Corner kernel K2 at T=0 for c = c0 * theta, theta a finite real Blaschke product (right half-plane).
# For rational c the corner kernel has finite rank, so the inertia on enough generic nodes is exact.
# Categories: A = xi-quotient type (zero set closed under rho -> conj rho and rho -> 1 - rho, zeros in the strip, even count)
#             B = conj-symmetric zeros with Re rho > 0, no rho -> 1-rho symmetry (still inner, real, theta(z)theta(-z)=1)
#             C = odd number of real zeros (theta(0) = -1)
#             D = like B but with theta(1) < 0 (a real zero r > 1): fails rank 1 (Theorem A)
import mpmath as mp, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
mp.mp.dps = 150
TOL = mp.mpf(10) ** -70
def blaschke(zeros):
    zs = [mp.mpc(r) for r in zeros]
    def th(z):
        v = mp.mpc(1)
        for r in zs:
            v *= (z - r) / (z + mp.conj(r))
        return v
    return th
def mk(zeros):
    th = blaschke(zeros)
    return lambda z: c_pole(z) * th(z)
def inertia(ev):
    return (sum(1 for e in ev if e > TOL), sum(1 for e in ev if abs(e) <= TOL), sum(1 for e in ev if e < -TOL))
def cat_zeros(cat, rng, npairs):
    Z = []
    if cat == 'A':
        k = 0
        while k < npairs:
            kind = rng.choice(['on', 'off', 'real'])
            g = rng.uniform(0.2, 20)
            if kind == 'on':
                Z += [mp.mpc(0.5, g), mp.mpc(0.5, -g)]; k += 1
            elif kind == 'real':
                r = rng.uniform(0.02, 0.48); Z += [mp.mpc(r), mp.mpc(1 - r)]; k += 1
            elif k + 2 <= npairs:
                d = rng.uniform(0.02, 0.49)
                Z += [mp.mpc(0.5 + d, g), mp.mpc(0.5 + d, -g), mp.mpc(0.5 - d, g), mp.mpc(0.5 - d, -g)]; k += 2
    elif cat == 'B':
        for _ in range(npairs):
            x = rng.uniform(0.05, 4); g = rng.uniform(0.2, 20)
            Z += [mp.mpc(x, g), mp.mpc(x, -g)]
    elif cat == 'C':
        Z = [mp.mpc(rng.uniform(0.05, 0.95))]
        for _ in range(npairs - 1):
            x = rng.uniform(0.05, 2); g = rng.uniform(0.2, 20)
            Z += [mp.mpc(x, g), mp.mpc(x, -g)]
    elif cat == 'D':
        Z = [mp.mpc(rng.uniform(1.1, 3)), mp.mpc(rng.uniform(0.05, 0.9))]
        for _ in range(npairs - 1):
            x = rng.uniform(0.05, 2); g = rng.uniform(0.2, 20)
            Z += [mp.mpc(x, g), mp.mpc(x, -g)]
    return Z
def main():
    rng = random.Random(2026)
    nn = 34
    n1 = rand_nodes1(nn, rng, re=(0.1, 2.0), im=(0.1, 6))
    n2 = rand_nodes2(nn, rng, re=(0.1, 1.9), im=(0.1, 6))
    summary = {}
    for cat in 'ABCD':
        for npairs in (1, 2, 3):
            for trial in range(6):
                Z = cat_zeros(cat, rng, npairs)
                c = mk(Z)
                th1 = blaschke(Z)(mp.mpf(1)).real
                _, _, _, ev1 = analyse(gram1(c, n1, mp.mpf(0)))
                _, _, _, ev2 = analyse(gram2(c, n2, (mp.mpf(0),) * 3))
                i1 = inertia(ev1); i2 = inertia(ev2)
                key = (cat, len(Z))
                summary.setdefault(key, []).append((i1, i2))
                print(f"cat {cat} zeros={len(Z)} theta(1)={nstr(th1,3):>8s} R1(+,0,-)={i1} R2(+,0,-)={i2}  Z={[mp.nstr(z,3) for z in Z[:4]]}")
                sys.stdout.flush()
    print("SUMMARY (cat, #zeros): set of (R1 inertia, R2 inertia)")
    for k, v in summary.items():
        print(k, sorted(set(v)))
if __name__ == "__main__":
    main()
