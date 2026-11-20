# Powered corner test over zeta: many nodes at low height, high precision.
# Question 1 (power): does zeta's c times a NON-FE-symmetric inner pair (Re < 1/2), negative over c0, show a negative eigenvalue?
# Question 2: do FE-symmetric off-line fakes over zeta show one?
import mpmath as mp, random, sys, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
from t4_corner_sweep import blaschke
NN = int(sys.argv[1]) if len(sys.argv) > 1 else 22
mp.mp.dps = int(sys.argv[2]) if len(sys.argv) > 2 else 110
IM = (0.2, 6) if len(sys.argv) <= 3 else (float(sys.argv[3]), float(sys.argv[4]))
print(f"nodes {NN}, dps {mp.mp.dps}, Im range {IM}; planned matrices {NN}x{NN} mpc (< 1 MB)")
g1 = mp.im(mp.zetazero(1)); g2 = mp.im(mp.zetazero(2))
rng = random.Random(404)
n1 = rand_nodes1(NN, rng, re=(0.1, 1.9), im=IM)
n2 = rand_nodes2(NN, rng, re=(0.1, 1.9), im=IM)
memo = {}
def cz(z):
    k = (mp.nstr(z.real, 50), mp.nstr(z.imag, 50))
    if k not in memo: memo[k] = c_zeta(z)
    return memo[k]
h = mp.mpf(1) / 2
def P(x, g): return [mp.mpc(mp.mpf(x), g), mp.mpc(mp.mpf(x), -g)]
cases = [("zeta", [], []),
         ("zeta * pair 0.3 +- i g1 (not FE-sym)", P('0.3', g1), []),
         ("zeta * pair 0.3 +- 2i (not FE-sym)", P('0.3', 2), []),
         ("zeta * pair 0.7 +- 2i (not FE-sym, Re>1/2)", P('0.7', 2), []),
         ("zeta * quad(0.3, 2) (FE-sym, off-line)", quad('0.3', 2), []),
         ("zeta * quad(0.3, g1) (FE-sym, off-line)", quad('0.3', g1), []),
         ("zeta: pair g1 -> quad(0.3, g1) (FE-sym, off-line)", quad('0.3', g1), quad(0, g1)),
         ("zeta: pair g1 -> quad(0.45, g1)", quad('0.45', g1), quad(0, g1)),
         ("zeta: pairs g1,g2 -> quad(0.3,(g1+g2)/2)", quad('0.3', (g1 + g2) / 2), quad(0, g1) + quad(0, g2)),
         ("zeta: pair g1 -> pair at 16 (on-line)", quad(0, 16), quad(0, g1)),
         ("zeta * real pair 0.2, 0.8 (FE-sym)", [mp.mpf('0.2'), 1 - mp.mpf('0.2')], []),
         ("zeta * zero at 1/2 (root number -1)", [h], [])]
for name, new, old in cases:
    t0 = time.time()
    thn = blaschke(new); tho = blaschke(old)
    cc = lambda z: cz(z) * thn(z) / tho(z)
    out = []
    for T in ((0, 0, 0), ('0.1', 0, '-0.1')):
        T = tuple(mp.mpf(x) for x in T)
        _, d1, _, e1 = analyse(gram1(cc, n1, T[0]))
        _, d2, _, e2 = analyse(gram2(cc, n2, T))
        neg2 = [e for e in e2 if e < 0]; neg1 = [e for e in e1 if e < 0]
        out.append(f"T={mp.nstr(T[0],2)}: R1 min {nstr(e1[0],2)} (#neg {len(neg1)}) R2 min {nstr(e2[0],2)} (#neg {len(neg2)}) smallest|ev2| {nstr(min(abs(e) for e in e2),2)}")
    print(f"{name:52s} | " + " | ".join(out) + f"  [{time.time()-t0:.0f}s]"); sys.stdout.flush()
