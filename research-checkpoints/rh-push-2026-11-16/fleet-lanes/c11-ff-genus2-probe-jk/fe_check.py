"""fe_check.py Q DEG NCURVES: direct sums L_n = sum_{A monic, deg n} nu_F(A), n = 0..DEG, on a seeded subsample; checks deg L = 2g, L_(2g-n) = q^(g-n) L_n."""
import sys, os, random
os.environ["Q"] = sys.argv[1]
from sq_q import *
DEG = int(sys.argv[2]); n = int(sys.argv[3]); g = (DEG-1)//2
random.seed(20261119); ok = bad = 0; done = 0
while done < n:
    idx = random.randrange(q**DEG); F = tuple((idx//q**a) % q for a in range(DEG)) + (1,)
    if res(list(F), [(i*c) % q for i, c in enumerate(F)][1:]) == 0: continue
    done += 1; L = [sum(LEG[res(list(F), list(A))] for A in mono(m)) for m in range(DEG+1)]
    good = L[2*g+1:] == [0]*(DEG-2*g) and all(L[2*g-m] == q**(g-m)*L[m] for m in range(g+1))
    ok += good; bad += (not good)
print(f"q={q} deg F={DEG}: {n} seeded squarefree F, functional equation and degree 2g by direct summation: {ok} hold, {bad} fail")
