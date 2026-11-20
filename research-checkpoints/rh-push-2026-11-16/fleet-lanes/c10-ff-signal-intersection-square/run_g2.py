import random
from sq import *
PR5 = primes_upto(5)[5]; random.seed(20261118); samp = random.sample(PR5, 80); ok = 0; pairs = {}
for F in samp:
    v = nu(F); L = [sum(v(A) for A in mono(n)) for n in range(3)]
    t = traces(None, [1, L[1], L[2], q*L[1], q*q], 4); M2 = L[1]**2 - L[2]
    ok += (2*M2 == t[1]**2 + t[2]); pairs.setdefault((t[1], t[2]), set()).add(M2)
print('genus 2, 80 curves: 2 M_2 = t_1^2 + t_2 in', ok, '/ 80; distinct (t_1, t_2):', len(pairs))
