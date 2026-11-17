# First pass with rational c (cheap): pure-pole model and Blaschke fakes over it. Rank 1 and rank 2.
import mpmath as mp, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from r2lib import *
mp.mp.dps = 80
def run(name, c, seeds=(1, 2, 3), n=8, taus=(0, 0.1, 0.5, 2.0, -0.3), im=(10, 50)):
    for sd in seeds:
        rng = random.Random(sd)
        n1 = rand_nodes1(n, rng, im=im); n2 = rand_nodes2(n, rng, im=im)
        for tau in taus:
            t = mp.mpf(tau)
            h1, dmin1, dmax1, ev1 = analyse(gram1(c, n1, t))
            h2, dmin2, dmax2, ev2 = analyse(gram2(c, n2, (t, 0, -t)))
            print(f"{name:28s} seed={sd} tau={tau:5} | R1 mindiag={nstr(dmin1)} evmin={nstr(ev1[0])} evmax={nstr(ev1[-1])} | "
                  f"R2 herm={nstr(h2,2)} mindiag={nstr(dmin2)} evmin={nstr(ev2[0])} ev2={nstr(ev2[1])} evmax={nstr(ev2[-1])}")
        sys.stdout.flush()
run("pole c0", c_pole)
run("c0*pair on-line g=14", make_fake(c_pole, quad(0, 14.1347)))
run("c0*quad d=0.2 g=14", make_fake(c_pole, quad(0.2, 14.1347)))
run("c0*quad d=0.2 g=30", make_fake(c_pole, quad(0.2, 30)))
run("c0*real zero r=0.5", make_fake(c_pole, [mp.mpf(1)/2]))
