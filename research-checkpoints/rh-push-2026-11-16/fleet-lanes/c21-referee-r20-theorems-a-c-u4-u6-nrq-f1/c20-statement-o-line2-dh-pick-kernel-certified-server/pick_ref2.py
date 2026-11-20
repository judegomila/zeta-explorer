# Second-referee recomputation of certified configurations of c20-statement-o-line2 (independent code).
# Written from the definitions in that lane's RESULT.md only; the lane's scripts were not opened.
# Build: real arb_series; DH through non-deflated Hurwitz zeta series in s at s0 = 1/2 + a; gamma part through the
# derivative of an lgamma series; E_q part through exp series. Decision: own LDL^T on lists of arb (no pivoting).
# Usage: python pick_ref2.py <name> <fun: DH|DHQ|E2|ZETA> <a as p/q> <order N> <bits> <out.json>
import sys, json, time, os
from flint import arb, arb_series, ctx, fmpq

name, fun, a_s, N, bits, outp = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
outp = os.path.abspath(outp)
ctx.prec = bits
ctx.cap = N + 2
DEFL = (a_s in ('1/2',))
p_, q_ = (a_s.split('/') + ['1'])[:2]
a = arb(fmpq(int(p_), int(q_)))
print(f"PLAN: {name} fun={fun} a={a_s} N={N} bits={bits}; matrix {N}x{N} arb, about {N*N*2*(bits//8+64)/1e6:.0f} MB", flush=True)
t0 = time.time()

def jets_DH():
    S = arb_series([arb(1)/2 + a, 1])                       # s = 1/2 + a + x
    r5 = (arb(5).sqrt())
    k0 = ((10 - 2*r5).sqrt() - 2)/(r5 - 1)
    coef = {1: arb(1), 2: k0, 3: -k0, 4: arb(-1)}
    f = None
    for r, c in coef.items():
        term = S.zeta(arb(fmpq(r, 5)), DEFL) * c             # Hurwitz zeta(s, r/5) as a series in x (deflated at s0 = 1: sum of a(r) is 0)
        f = term if f is None else f + term
    f = f * (S * (-arb(5).log())).exp()                      # times 5^(-s)
    Lf = f.derivative() / f
    lg = ((S + 1) / 2).lgamma()                              # log Gamma((s+1)/2)
    L = Lf + lg.derivative() + (arb(5)/arb.pi()).log()/2
    return [L[k] for k in range(N)], f[0]

def jets_E(q):
    Z = arb_series([a, 1])                                   # z = a + x
    w = Z * (arb(q).log()/2)
    E = w.exp(); Ei = (w * (-1)).exp()
    L = (E - Ei) / (E + Ei) * (arb(q).log()/2)
    return [L[k] for k in range(N)]

def jets_ZETA():
    S = arb_series([arb(1)/2 + a, 1])
    W = S.zeta(1, True) * (S - 1) + 1                        # (s-1) zeta(s) = 1 + (s-1) * deflated zeta
    L = W.derivative()/W + arb_series([1])/S - arb.pi().log()/2 + (S/2).lgamma().derivative()
    return [L[k] for k in range(N)], W[0]

info = {}
if fun in ('DH', 'DHQ'):
    l, f0 = jets_DH(); info['f_DH(1/2+a)'] = f0.str(25)
    if fun == 'DHQ':
        for q in (2, 3, 4, 9):
            e = jets_E(q); l = [x + y for x, y in zip(l, e)]
elif fun == 'E2':
    l = jets_E(2)
elif fun == 'ZETA':
    l, w0 = jets_ZETA(); info['(s-1)zeta(s) at 1/2+a'] = w0.str(25)
info['L(a)'] = l[0].str(25); info['jets_seconds'] = time.time() - t0
print("L(a) =", l[0].str(25), " jets", round(time.time() - t0, 1), "s", flush=True)

# jet Pick matrix: 2a P[i][j] + P[i-1][j] + P[i][j-1] = l_i [j=0] + l_j [i=0]
inv2a = 1/(2*a)
P = [[None]*N for _ in range(N)]
for i in range(N):
    for j in range(i + 1):
        v = arb(0)
        if j == 0: v += l[i]
        if i == 0: v += l[j]
        if i > 0: v -= P[i-1][j] if j <= i-1 else P[j][i-1]
        if j > 0: v -= P[i][j-1]
        P[i][j] = v * inv2a
t1 = time.time(); print("matrix", round(t1 - t0, 1), "s", flush=True)

# LDL^T, row-oriented (Cholesky-Crout order), no pivoting. Lm[i][j] for j < i; d[j].
d = []; Lm = [[None]*N for _ in range(N)]; neg = []; bad = []; minrel = 10**9
for i in range(N):
    for j in range(i):
        s = P[i][j]
        for k in range(j):
            s -= Lm[i][k] * Lm[j][k] * d[k]
        Lm[i][j] = s / d[j]
    s = P[i][i]
    for k in range(i):
        s -= Lm[i][k] * Lm[i][k] * d[k]
    d.append(s)
    if s.contains(0) if hasattr(s, 'contains') else not (s > 0 or s < 0):
        bad.append(i + 1); print("UNDECIDED pivot", i + 1, flush=True); break
    if s < 0: neg.append(i + 1)
    rb = s.rel_accuracy_bits(); minrel = min(minrel, rb)
    if (i + 1) % 32 == 0 or s < 0: print("pivot", i + 1, s.str(22), flush=True)
out = {'name': name, 'fun': fun, 'a': a_s, 'N': N, 'bits': bits, 'negative_pivots': neg, 'undecided': bad,
       'pivots_computed': len(d), 'min_rel_accuracy_bits': int(minrel), 'info': info,
       'pivots': {str(k): d[k-1].str(22) for k in sorted(set([1, 2, 21, 22, 100, 147, 148, 149, 150, 151, 200, 217, 218, 219, 220, N] + neg)) if k <= len(d)},
       'seconds': time.time() - t0}
json.dump(out, open(outp, 'w'), indent=1)
print(json.dumps({k: out[k] for k in ('name', 'negative_pivots', 'undecided', 'pivots_computed', 'min_rel_accuracy_bits', 'seconds')}), flush=True)
