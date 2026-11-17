# Full spectra (inertia) of rank-1 and rank-2 kernels for rational c at T=0 and small T. 12 nodes.
import mpmath as mp, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
mp.mp.dps = 120
def inertia(ev, tol=mp.mpf(10)**-60):
    return (sum(1 for e in ev if e > tol), sum(1 for e in ev if abs(e) <= tol), sum(1 for e in ev if e < -tol))
def run(name, c, taus=(0, 0.05, 0.3), n=12, sd=5, im=(0.5, 40)):
    rng = random.Random(sd)
    n1 = rand_nodes1(n, rng, im=im); n2 = rand_nodes2(n, rng, im=im)
    for tau in taus:
        t = mp.mpf(tau)
        _, _, _, ev1 = analyse(gram1(c, n1, t))
        _, dmin, _, ev2 = analyse(gram2(c, n2, (t, 0, -t)))
        print(f"{name:26s} tau={tau:5} R1 (+,0,-)={inertia(ev1)} min={nstr(ev1[0],3)} | R2 (+,0,-)={inertia(ev2)} mindiag={nstr(dmin,3)} neg={[nstr(e,3) for e in ev2 if e < -mp.mpf(10)**-60]} smallest+={nstr(min([e for e in ev2 if e > mp.mpf(10)**-60] or [0]),3)}")
    sys.stdout.flush()
h = mp.mpf(1)/2
run("c0", c_pole)
for r in (0.1, 0.5, 0.9, 1.5):
    run(f"c0*real r={r}", make_fake(c_pole, [mp.mpf(r)]))
run("c0*real pair r=.3,.7", make_fake(c_pole, [mp.mpf('0.3'), mp.mpf('0.7')]))
run("c0*pair online g=14", make_fake(c_pole, quad(0, 14.1347)))
run("c0*pair online g=3", make_fake(c_pole, quad(0, 3)))
run("c0*quad d=.2 g=14", make_fake(c_pole, quad(0.2, 14.1347)))
run("c0*quad d=.45 g=14", make_fake(c_pole, quad(0.45, 14.1347)))
run("c0*quad d=.2 g=3", make_fake(c_pole, quad(0.2, 3)))
run("c0*quad d=.45 g=3", make_fake(c_pole, quad(0.45, 3)))
run("c0*quad d=.45 g=1", make_fake(c_pole, quad(0.45, 1)))
run("c0*quad d=.2 g=0.3", make_fake(c_pole, quad(0.2, 0.3)))
run("c0*2 online pairs", make_fake(c_pole, quad(0, 14.1347) + quad(0, 21.022)))
