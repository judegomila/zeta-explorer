"""mtypes.py q N lam d : POST-HOC split of the row energy by the factorisation type of m (exact integers), for each vector: share of sum_m |R_m|^2 and mean |R_m|^2 / mean over all m."""
import sys
import analyze
from plan import weights
from ffpy import FF, norm
q, N, lam, d = [int(x) for x in sys.argv[1:5]]; F = FF(q); W = analyze.load(q, N, lam, d); names = list(weights(q))
def ftype(m):
    cur = m[:]; t = []
    for e in range(1, len(m)):
        for i in range(q**e):
            p = F.idx2poly(i, e); v = 0
            while len(cur) - 1 >= e and not F.pmod(cur, p):
                # divide
                a = cur[:]; quo = [0]*(len(a)-e)
                for k in range(len(a)-1, e-1, -1):
                    f = a[k]; quo[k-e] = f
                    for j in range(e+1): a[k-e+j] = (a[k-e+j] - f*p[j]) % q
                cur = quo; v += 1
            if v: t.append((e, v))
    return ' '.join(f'{e}^{v}' for e, v in sorted(t))
ms = [F.idx2poly(i, d) for i in range(q**d)]; T = [ftype(m) for m in ms]; types = sorted(set(T))
print(f'q={q} (N,lam,d)=({N},{lam},{d}); type = degrees^multiplicities of the prime factors of m; count; then per vector: share of the energy (mean energy relative to the overall mean)')
for t in types:
    idx = [i for i in range(len(ms)) if T[i] == t]; s = f'{t:12s} {len(idx):5d} |'
    for i, n in enumerate(names):
        tot = W[i]['sumnorm']; e = sum(norm(W[i]['rows'][mi]) for mi in idx)
        s += f' {n}: {e/max(tot,1):.3f} ({(e/len(idx))/(max(tot,1)/len(ms)):.2f}) |'
    print(s)
