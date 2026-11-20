"""explore_dirs.py : POST-HOC exploration (not pre-registered).  Share of the total row energy (ROW lines) on candidate directions, totals only.
Directions: v_0; vj = sum_a chi_0(m(a))^j (j = 1..5); w = u(m) (the vector's own multiplicative function at the row variable); w*v_1."""
import glob, sys
from fractions import Fraction as Fr
from ffpy import FF, add, ZP
from wlist import wlist
import analyze_slot as A
from resonance import rows_of, gram_proj
Z = A.Z; M64 = (1 << 64) - 1
def hash64(x):
    x = (x + 0x9e3779b97f4a7c15) & M64; x = ((x ^ (x >> 30)) * 0xbf58476d1ce4e5b9) & M64; x = ((x ^ (x >> 27)) * 0x94d049bb133111eb) & M64; return x ^ (x >> 31)
def factor(F, m):
    """monic m of degree <= 3 -> list of (prime poly, multiplicity)."""
    q = F.q; out = []; cur = m[:]
    for a in range(q):
        mult = 0
        while len(cur) > 1 and sum(c*pow(a, i, q) for i, c in enumerate(cur)) % q == 0:
            # divide by (T - a)
            nc = [0]*(len(cur)-1); carry = 0
            for i in range(len(cur)-1, 0, -1):
                carry = (cur[i] + carry*a) % q; nc[i-1] = carry
            cur = nc; mult += 1
        if mult: out.append(([(-a) % q, 1], mult))
    if len(cur) > 1: out.append((cur, 1))
    return out
def ufun(F, name, spec, m):
    h = spec.split(); mode = int(h[0]); q = F.q
    if name == 'one': return 1
    fac = factor(F, m)
    if name == 'mu': return 0 if any(e > 1 for _, e in fac) else (-1)**len(fac)
    if mode == 0:
        Fp = F.idx2poly(int(h[2]), int(h[1])); R = F.res(Fp, m); return 0 if R == 0 else (-1 if F.L6[R] & 1 else 1)
    if mode == 6:
        s = 1
        for P, e in fac:
            idx = sum(c * q**i for i, c in enumerate(P[:-1])); hh = hash64((idx*1000003 + (len(P)-1)*7919 + int(h[1])) & M64)
            if (hh >> 20) & 1 and e & 1: s = -s
        return s
    return None
sel = [x for x in sys.argv[1:] if x != 'summary']; SUMMARY = 'summary' in sys.argv; ALL = []
print('q (N,lam,d) vector | e | beta (v_0, v_1) | + u(m), u(m) v_1 | + v^(2..5) | remainder n')
for fn in sorted(glob.glob('results/q*_N*_lam*_d*_*.txt')):
    if 'DONE' not in open(fn).read()[-10:]: continue
    recs = A.load(fn); RW = rows_of(fn); q = recs[0]['q']; d = recs[0]['d']; N = recs[0]['N']; lam = recs[0]['lam']; F = FF(q); names = {w: n for n, w in wlist(q)}
    if sel and f'{q},{N},{lam},{d}' not in sel: continue
    ms = [F.idx2poly(i, d) for i in range(q**d)]
    vj = {j: [] for j in range(1, 6)}
    for m in ms:
        s = {j: (0, 0) for j in range(1, 6)}
        for a in range(q):
            val = sum(c*pow(a, i, q) for i, c in enumerate(m)) % q
            if val:
                for j in range(1, 6): s[j] = add(s[j], ZP[(j*F.L6[val]) % 6])
        for j in range(1, 6): vj[j].append(Z(*s[j]))
    v0 = [Z(1)]*len(ms); iw = -1; seen = set()
    for r in recs:
        if (r['spec'], r['var']) in seen: continue
        seen.add((r['spec'], r['var']))
        if r['var'] == 0: iw += 1
        name = names[r['spec']]
        if r['var'] != 0 or name == 'al' or name[0] == 'r' or '*' in name: continue
        R = [Z(a, b) for a, b in RW[(iw, 0)]]; D = Fr(r['D']); e = r['E']/D
        w = [Z(ufun(F, name, r['spec'], m)) for m in ms]
        base = [v0, vj[1]]; B0, _ = gram_proj(base, R)
        ext = base + [w, [w[i]*vj[1][i] for i in range(len(ms))]]; B1, _ = gram_proj(ext, R)
        ext2 = ext + [vj[j] for j in range(2, 6)]; B2, rk = gram_proj(ext2, R)
        ALL.append((q, N, lam, d, name, e, B0/D, (B1-B0)/D, (B2-B1)/D, e - B2/D))
        if e - B0/D > Fr(3, 4) and not SUMMARY: print(f"{q} ({N},{lam},{d}) {name} | {float(e):.4g} | {float(B0/D):.4g} | +{float((B1-B0)/D):.4g} | +{float((B2-B1)/D):.4g} | {float(e - B2/D):.4g}  (rank {rk} of {len(ms)})")

if SUMMARY:
    L = ['POST-HOC (not pre-registered). Squarefree rows. n = e - beta (span {v_0, v_1}); n_u = e - (squared signal on span {v_0, v_1, u(m), u(m) v_1}); totals only.',
         'vector class | configurations | max n | at | max n_u | at | number with n > 1.5 | number with n_u > 1.5']
    def cl(nm): return 'U' if nm[0] == 'U' else nm
    for c in ('a', 'b', 'c4', 'mu', 'one', 'U'):
        S = [x for x in ALL if cl(x[4]) == c]
        if not S: continue
        mx = max(S, key=lambda x: x[5]-x[6]); mu_ = max(S, key=lambda x: x[5]-x[6]-x[7])
        L.append(f"{c} | {len(S)} | {float(mx[5]-mx[6]):.3f} | q={mx[0]} ({mx[1]},{mx[2]},{mx[3]}) {mx[4]} | {float(mu_[5]-mu_[6]-mu_[7]):.3f} | q={mu_[0]} ({mu_[1]},{mu_[2]},{mu_[3]}) {mu_[4]} | {sum(1 for x in S if x[5]-x[6] > Fr(3,2))} | {sum(1 for x in S if x[5]-x[6]-x[7] > Fr(3,2))}")
    L.append(''); L.append('rows with n > 1.5: q (N,lam,d) vector | e | beta | squared signal on u(m), u(m) v_1 | on v^(2..5) | n_u | remainder after all')
    for x in sorted(ALL, key=lambda x: (x[0], x[1], x[3], x[2], x[4])):
        if x[5]-x[6] > Fr(3, 2): L.append(f"{x[0]} ({x[1]},{x[2]},{x[3]}) {x[4]} | {float(x[5]):.4g} | {float(x[6]):.4g} | {float(x[7]):.4g} | {float(x[8]):.4g} | {float(x[5]-x[6]-x[7]):.4g} | {float(x[9]):.4g}")
    open('posthoc_dirs.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
