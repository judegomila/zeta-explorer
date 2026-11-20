# Exact-symmetric sweep at the corner T=0, c = c0 * theta, theta FE-symmetric (zero set closed under conj and rho -> 1-rho,
# built in mp arithmetic so the symmetry is exact to working precision).  Also asymmetry scan.
import mpmath as mp, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
from t4_corner_sweep import blaschke, mk
mp.mp.dps = 220
TOL = mp.mpf(10) ** -130
def inertia(ev):
    return (sum(1 for e in ev if e > TOL), sum(1 for e in ev if abs(e) <= TOL), sum(1 for e in ev if e < -TOL))
rng = random.Random(909)
NN = 46
n2 = rand_nodes2(NN, rng, re=(0.1, 1.9), im=(0.1, 6))
h = mp.mpf(1) / 2
def sym_set(rng, units):
    Z = []; desc = []
    for _ in range(units):
        kind = rng.choice(['on', 'quad', 'quad', 'real'])
        g = mp.mpf(rng.randint(1, 2000)) / 100
        d = mp.mpf(rng.randint(1, 49)) / 100
        if kind == 'on': Z += [mp.mpc(h, g), mp.mpc(h, -g)]; desc.append(f"on({g})")
        elif kind == 'real': Z += [h + d, h - d]; desc.append(f"real(+-{d})")
        else: Z += quad(d, g); desc.append(f"quad({d},{g})")
    return Z, desc
print(f"nodes {NN}, dps {mp.mp.dps}, tol {mp.nstr(TOL,1)}")
allpsd = True
for units in (1, 2, 2, 2, 3, 3, 3, 3, 4, 4):
    Z, desc = sym_set(rng, units)
    _, _, _, ev = analyse(gram2(mk(Z), n2, (mp.mpf(0),) * 3))
    i = inertia(ev); d = len(Z)
    floor = max([abs(e) for e in ev if abs(e) <= TOL] or [0])
    print(f"d={d:2d} C(d,2)={d*(d-1)//2:3d} inertia(+,0,-)={i} smallest nonzero={nstr(min([abs(e) for e in ev if abs(e)>TOL] or [0]),2)} floor={nstr(floor,2)}  {' '.join(desc)}")
    allpsd = allpsd and i[2] == 0
    sys.stdout.flush()
print("all FE-symmetric cases PSD:", allpsd)
print("-- asymmetry scan: zeros 0.3 +- 2i and (0.7+eta) +- (2+eps)i ; eta=eps=0 is the FE-symmetric quadruple")
for eta, eps in ((0, 0), ('0.01', 0), ('-0.01', 0), (0, '0.01'), (0, '-0.01'), ('0.2', 0), ('-0.2', 0), ('1e-6', 0), ('-1e-6', 0), (0, '1e-6')):
    e_ = mp.mpf(eta); p_ = mp.mpf(eps)
    Z = [mp.mpc(mp.mpf('0.3'), 2), mp.mpc(mp.mpf('0.3'), -2), mp.mpc(mp.mpf('0.7') + e_, 2 + p_), mp.mpc(mp.mpf('0.7') + e_, -2 - p_)]
    _, _, _, ev = analyse(gram2(mk(Z), n2, (mp.mpf(0),) * 3))
    neg = [e for e in ev if e < -TOL]
    print(f"eta={eta!s:6} eps={eps!s:6} inertia={inertia(ev)} negative eigenvalues={[nstr(e,3) for e in neg]}")
    sys.stdout.flush()
