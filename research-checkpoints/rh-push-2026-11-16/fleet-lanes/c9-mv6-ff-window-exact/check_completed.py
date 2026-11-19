"""check_completed.py q d lam : the assembled completed row for N = 3 (analyze.completed, from two ffw runs) against an independent brute force
from the definition (python, Z[zeta_6] exact): R_m = sum_P [ sum_{A' sqf deg 3} zeta^{g(PA')} u(A') chi_{PA'}(m) + Jbar sum_{n linear} u(n)^3 chi_n(m)^3 zeta^{g(P)} chi_P(m) ],
weights one, a, mu.  Also the vanishing test of the polynomial structure is not used here: this is a check of the assembly only."""
import sys, subprocess, os
from ffpy import *
from plan import weights
import analyze
q = int(sys.argv[1]); d = int(sys.argv[2]); lam = int(sys.argv[3]); F = FF(q); Wq = weights(q)
os.makedirs('results', exist_ok=True)
ws = ' '.join(f'{w[0]} {w[1]} {w[2]} {w[3]} 0' for w in Wq.values())
for N, wl in ((3, ws), (0, '0 0 0 0 0 5 0 0 0 0 1 12 0 0 0')):
    fn = f'results/q{q}_N{N}_lam{lam}_d{d}.txt'
    if not os.path.exists(fn): open(fn, 'w').write(subprocess.run(['./ffw', 'enw', str(q), str(d), str(N), str(lam)] + wl.split(), capture_output=True, text=True).stdout)
W3 = analyze.load(q, 3, lam, d); W0 = analyze.load(q, 0, lam, d)
nm = q**d; ms = [F.idx2poly(i, d) for i in range(nm)]
primes = [P for P in (F.idx2poly(i, lam) for i in range(q**lam)) if F.irreducible(P)]
Fa = F.idx2poly(Wq['a'][2], 3)
def u(name, A):
    if name == 'one': return 1
    if name == 'mu':
        g = F.gphase(A, 0); return 0 if g is None else (-1 if (3*(len(A)-1) + g) % 6 == 3 else 1)
    R = F.res(Fa, A); return 0 if R == 0 else (-1 if (3*F.L6[R]) % 6 == 3 else 1)
As = [F.idx2poly(i, 3) for i in range(q**3)]; lin = [F.idx2poly(i, 1) for i in range(q)]
for name in ('one', 'a', 'mu'):
    acc = [[0]*6 for _ in range(nm)]; acc1 = [[0]*6 for _ in range(nm)]
    uA = [u(name, A) for A in As]; un = [(-1 if name == 'mu' else u(name, n)) for n in lin]
    for P in primes:
        gP = F.gphase(P, 2); cP = [F.chi(P, m) for m in ms]
        for ai, A in enumerate(As):
            if uA[ai] == 0: continue
            g = F.gphase(F.pmul(P, A), 2)
            if g is None: continue
            for mi, m in enumerate(ms):
                c = F.chi(A, m)
                if c is None or cP[mi] is None: continue
                acc[mi][(g + c + cP[mi] + (3 if uA[ai] < 0 else 0)) % 6] += 1
        for i, n in enumerate(lin):
            if un[i] == 0: continue
            for mi, m in enumerate(ms):
                c = F.chi(n, m)
                if c is None or cP[mi] is None: continue
                acc1[mi][(gP + cP[mi] + 3*c + (3 if un[i] < 0 else 0)) % 6] += 1
    tot = 0
    for mi in range(nm):
        H = acc[mi]; r0 = (H[0]-H[2]-H[3]+H[5], H[1]+H[2]-H[4]-H[5]); H = acc1[mi]; r1 = (H[0]-H[2]-H[3]+H[5], H[1]+H[2]-H[4]-H[5])
        tot += norm(add(r0, mul(F.Jb, r1)))
    i = list(Wq).index(name); sn, dg = analyze.completed(q, lam, d, name, W3[i], W0, F)
    print(f'q={q} (3,{lam},{d}) {name}: brute force sum of norms {tot}; assembled {sn}; equal: {tot == sn}; diagonal {dg}')
