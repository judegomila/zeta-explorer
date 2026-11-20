# c1_exact.py : ball-arithmetic minimum of the discretised local Nyman-Beurling problem (same grid, same float64
# values of F taken as exact numbers), by normal equations at high precision. Compared with the float64 ladder.
# usage: c1_exact.py <obj> <T0> <H> <prec_bits> <out.json> N1 N2 ...
import sys, json, math, time, numpy as np, flint
from flint import acb, arb, acb_mat
import objs, c1_local_nb as c1
nm = sys.argv[1]; T0 = float(sys.argv[2]); H = float(sys.argv[3]); prec = int(sys.argv[4]); outp = sys.argv[5]
Ns = [int(x) for x in sys.argv[6:]]; h = 0.05
flint.ctx.prec = prec
nU = int(round(9*H/h)); u = np.arange(-nU, nU+1)*h
v = objs.eval_objects(T0, u, [nm], h=h)[nm]
c1.LAD = sorted(Ns); fl = c1.solve_window(v, u, H, h, max(Ns))
K = len(u); print('K', K, 'planned acb matrix', K, 'x', max(Ns), flush=True)
wk = [(1/(arb(math.pi if False else 0)+arb.pi()*arb(float(uu))/arb(H)).cosh())*arb(h)/(2*arb(H)) for uu in u]
sk = [x.sqrt() for x in wk]; W0 = sum(wk, arb(0))
Fk = [acb(float(z.real), float(z.imag)) for z in v]
out = {'obj': nm, 'T0': T0, 'H': H, 'prec': prec, 'rows': []}
for N in sorted(Ns):
    t0 = time.time()
    logs = [arb(n).log() for n in range(1, N+1)]
    A = acb_mat(K, N, [sk[k]*Fk[k]*(acb(0, -1)*arb(float(u[k]))*logs[j]).exp() for k in range(K) for j in range(N)])
    Ah = A.transpose().conjugate() if hasattr(A, 'conjugate') else acb_mat(N, K, [A[k, j].conjugate() for j in range(N) for k in range(K)])
    G = Ah*A; b = Ah*acb_mat(K, 1, [acb(x) for x in sk])
    c = G.solve(b)
    d2 = W0 - (b.transpose()*acb_mat(N, 1, [c[i, 0].conjugate() for i in range(N)]))[0, 0].real
    rel = d2/W0; cn2 = sum((abs(c[i, 0])**2 for i in range(N)), arb(0))
    fr = [r for r in fl['rows'] if r['N'] == N][0]
    row = {'N': N, 'exact_rel': float(rel.mid()), 'exact_rad': float(rel.rad()), 'exact_log10_cnorm2': float(cn2.log().mid())/math.log(10),
           'float_rel': fr['rel'], 'float_rank': fr['rank'], 'sec': time.time()-t0}
    out['rows'].append(row); print(row, flush=True); json.dump(out, open(outp, 'w'), indent=1)
