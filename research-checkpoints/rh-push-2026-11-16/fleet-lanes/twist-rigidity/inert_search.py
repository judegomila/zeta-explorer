# For prime d and prime q = 1 mod d: H = subgroup of d-th power residues mod q (index d).
# p_H = least prime in H.  Prime-free support of the degree-d cyclic field of conductor q:  T* = min(log p_H, d log 2, log q).
# Unconditional positivity margin (Theorem 3):  m = (d-1) log q - d*log(8 pi e^{gamma+pi/2}) - 4 sinh(T*/2).
import math, json
from sympy import primerange, isprime
C = math.log(8*math.pi)+0.5772156649015329+math.pi/2
out = {}
for d, QMAX in [(3, 2*10**6), (5, 2*10**6), (7, 4*10**6)]:
    ps = list(primerange(2, 400)); best = None; rows = []
    for q in range(d+1, QMAX, d):
        if q % 2 == 0 or not isprime(q): continue
        e = (q-1)//d; pH = None
        for p in ps:
            if p != q and pow(p, e, q) == 1: pH = p; break
        if pH is None: pH = 401
        if best is None or pH > best:
            best = pH; T = min(math.log(pH), d*math.log(2), math.log(q))
            m = (d-1)*math.log(q) - d*C - 4*math.sinh(T/2)
            rows.append(dict(q=q, least_prime_in_H=pH, Tstar=round(T, 4), margin=round(m, 3)))
    out[d] = rows; print(d, rows[-6:])
json.dump(out, open('inert_search.json', 'w'), indent=1)
