# Controlled corner (T=0) inertia for c = c0 * theta: one family at a time; prints the eigenvalues above the noise floor.
import mpmath as mp, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
from t4_corner_sweep import blaschke, mk
mp.mp.dps = 200
def spec(Z, n2, tol_exp=-120):
    c = mk(Z)
    _, _, _, ev = analyse(gram2(c, n2, (mp.mpf(0),) * 3))
    tol = mp.mpf(10) ** tol_exp
    big = [e for e in ev if abs(e) > tol]
    floor = max([abs(e) for e in ev if abs(e) <= tol] or [mp.mpf(0)])
    return big, floor
def show(label, Z, n2):
    big, floor = spec(Z, n2)
    neg = [e for e in big if e < 0]; pos = [e for e in big if e > 0]
    print(f"{label:44s} rank={len(big):2d} (+{len(pos)},-{len(neg)}) neg={[nstr(e,3) for e in neg]} smallest|nonzero|={nstr(min([abs(e) for e in big] or [0]),3)} floor={nstr(floor,2)}")
    sys.stdout.flush()
def main():
    rng = random.Random(77)
    n2 = rand_nodes2(30, rng, re=(0.1, 1.9), im=(0.1, 6))
    print("-- single conjugate pair x +- i g (not FE-symmetric unless x = 1/2)")
    for g in (0.3, 2, 10):
        for x in (0.05, 0.3, 0.45, 0.5, 0.55, 1.0, 2.5):
            show(f"pair x={x} g={g}", [mp.mpc(x, g), mp.mpc(x, -g)], n2)
    print("-- FE-symmetric quadruple 1/2 +- d +- i g")
    for g in (0.3, 2, 10):
        for d in (0.05, 0.2, 0.45):
            show(f"quad d={d} g={g}", quad(d, g), n2)
    print("-- real zeros")
    for r in (0.1, 0.3, 0.45):
        show(f"real pair r={r}, 1-r", [mp.mpf(r), 1 - mp.mpf(r)], n2)
    show("double real zero at 1/2", [mp.mpf(1)/2, mp.mpf(1)/2], n2)
    show("real pair 0.6, 0.8 (both > 1/2)", [mp.mpf('0.6'), mp.mpf('0.8')], n2)
    show("real pair 0.2, 0.3 (both < 1/2)", [mp.mpf('0.2'), mp.mpf('0.3')], n2)
    print("-- two pairs")
    show("pairs 0.5+-2i, 0.5+-5i", quad(0, 2) + quad(0, 5), n2)
    show("pairs 0.3+-2i, 0.7+-5i", [mp.mpc(0.3, 2), mp.mpc(0.3, -2), mp.mpc(0.7, 5), mp.mpc(0.7, -5)], n2)
    show("pairs 0.7+-2i, 0.7+-5i", [mp.mpc(0.7, 2), mp.mpc(0.7, -2), mp.mpc(0.7, 5), mp.mpc(0.7, -5)], n2)
    show("pairs 0.3+-2i, 0.3+-5i", [mp.mpc(0.3, 2), mp.mpc(0.3, -2), mp.mpc(0.3, 5), mp.mpc(0.3, -5)], n2)
    print("-- three: quad + on-line pair")
    show("quad(0.2,13) + pair 0.5+-3i", quad(0.2, 13) + quad(0, 3), n2)
    show("quad(0.2,3) + pair 0.5+-13i", quad(0.2, 3) + quad(0, 13), n2)
    show("3 on-line pairs", quad(0, 2) + quad(0, 5) + quad(0, 9), n2)
if __name__ == "__main__":
    main()
