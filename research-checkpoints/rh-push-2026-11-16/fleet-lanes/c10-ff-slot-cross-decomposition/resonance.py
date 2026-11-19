"""resonance.py : POST-HOC (written after the (2, 12, 1) result was seen).  Second squared signal of a target vector: projection of the total row R(m)
(ROW lines of results/*.txt) on the target's own character as a function of the row variable,
   w_F(m) = chi_0(Res(F, m))^3      (nu(m), the quadratic character of conductor F evaluated at m),   and on v_1(m) w_F(m) for d >= 2,
orthogonalised against span{v_0, v_1}.  beta_F = |projection on the enlarged span|^2 / D - beta.  Exact Fractions (totals only; no per-prime split)."""
import glob, sys
from fractions import Fraction as Fr
from ffpy import FF, mul, add, conj, norm, ZP
from wlist import wlist
import analyze_slot as A
Z = A.Z
def rows_of(fn):
    out = {}; 
    for line in open(fn):
        if line.startswith('ROW'):
            t = line.split(); out.setdefault((int(t[1]), int(t[2])), []).append((int(t[4]), int(t[5])))
    return out
def gram_proj(vecs, R):
    K = len(vecs); nm = len(R)
    G = [[sum((vecs[i][m].conj()*vecs[j][m] for m in range(nm)), Z(0)) for j in range(K)] for i in range(K)]
    J = [sum((vecs[i][m].conj()*R[m] for m in range(nm)), Z(0)) for i in range(K)]
    M = [[Z(0)]*K for _ in range(K)]
    B, _, rk = A.proj(G, J, M, K); return B, rk
res = []
for fn in sorted(glob.glob('results/q*_N*_lam*_d*_*.txt')):
    if 'DONE' not in open(fn).read()[-10:]: continue
    recs = A.load(fn); RW = rows_of(fn); q = recs[0]['q']; d = recs[0]['d']; N = recs[0]['N']; lam = recs[0]['lam']; F = FF(q); names = {w: n for n, w in wlist(q)}
    ms = [F.idx2poly(i, d) for i in range(q**d)]
    v0 = [Z(1)]*len(ms); v1 = []
    for m in ms:
        s = (0, 0)
        for a in range(q):
            val = sum(c*pow(a, i, q) for i, c in enumerate(m)) % q
            if val: s = add(s, ZP[F.L6[val]])
        v1.append(Z(*s))
    iw = -1; seen = set()
    for r in recs:
        if (r['spec'], r['var']) in seen: continue
        seen.add((r['spec'], r['var']))
        if r['var'] == 0: iw += 1
        name = names[r['spec']]
        if name not in ('a', 'b', 'c4') or r['var'] != 0: continue
        h = r['spec'].split(); Fp = F.idx2poly(int(h[2]), int(h[1]))
        wF = []
        for m in ms:
            Rr = F.res(Fp, m); wF.append(Z(0) if Rr == 0 else Z(-1 if F.L6[Rr] & 1 else 1))
        R = [Z(a, b) for a, b in RW[(iw, 0)]]; D = Fr(r['D'])
        assert sum(x.norm() for x in R) == r['E']
        base = [v0, v1] if d >= 2 else [v0]
        B0, _ = gram_proj(base, R); ext = base + [wF] + ([[v1[i]*wF[i] for i in range(len(ms))]] if d >= 2 else [])
        B1, rk = gram_proj(ext, R)
        res.append((q, N, lam, d, name, r['E']/D, B0/D, (B1 - B0)/D, (Fr(r['E']) - B1)/D, rk))
if __name__ == '__main__':
    print('q (N,lam,d) vector | e | beta | beta_F (target-character directions) | n_F = e - beta - beta_F | rank')
    for x in sorted(res, key=lambda x: (x[0], x[1], x[3], x[2], x[4])):
        if x[7] > Fr(1, 4) or x[5] >= 2: print(f"{x[0]} ({x[1]},{x[2]},{x[3]}) {x[4]} | {float(x[5]):.4g} | {float(x[6]):.4g} | {float(x[7]):.4g} | {float(x[8]):.4g} | {x[9]}")
    big = [x for x in res if x[7] > Fr(1, 4)]; print(len(res), 'target rows;', len(big), 'with beta_F > 0.25')
