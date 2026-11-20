# Second pass (same agent, different formulas): DH confluent Pick form at a = 1, orders 147..151.
# Build: non-deflated complex Hurwitz series (acb_series), closed binomial formula for the jets (no recurrence).
# Decision: sign of arb_mat.det of leading minors (flint LU), not the lane's LDL.
import json, sys, time
from math import comb
from flint import arb, acb, acb_series, arb_mat, ctx
bits = int(sys.argv[1]); N = int(sys.argv[2]); ctx.prec = bits
t0 = time.time()
a = arb(1); s0 = acb(arb(3)/2)
s5 = arb(5).sqrt(); k0 = ((10 - 2*s5).sqrt() - 2)/(s5 - 1); A = [arb(1), k0, -k0, arb(-1)]
ctx.cap = N + 1
S = acb_series([s0, 1])
H = None
for r in range(1, 5):
    t = S.zeta(acb(arb(r)/5))*acb(A[r-1])
    H = t if H is None else H + t
ld = H.derivative()/H
gam = ((S + 1)/2).lgamma().derivative()
l = [(ld[k] + gam[k]).real for k in range(N)]
l[0] += (arb(5)/arb.pi()).log()/2 - arb(5).log()
im = max(float(abs((ld[k] + gam[k]).imag).upper()) for k in range(N))
inv = 1/(2*a)
ipw = [inv]
for k in range(2*N + 2): ipw.append(ipw[-1]*inv)       # ipw[m] = (2a)^-(m+1)
def P(i, j):
    tot = arb(0)
    for k in range(i + 1):
        m = i - k + j
        v = l[k]*comb(m, j)*ipw[m]
        tot += v if m % 2 == 0 else -v
    for k in range(j + 1):
        m = i + j - k
        v = l[k]*comb(m, i)*ipw[m]
        tot += v if m % 2 == 0 else -v
    return tot
print('planned memory: %d balls of %d bits, about %.2f GB' % (N*N, bits, N*N*bits/8*2.5/1e9), flush=True)
rows = [[None]*N for _ in range(N)]
for i in range(N):
    for j in range(i + 1):
        rows[i][j] = rows[j][i] = P(i, j)
out = {'bits': bits, 'N': N, 'max_imag_part_of_l': im, 'build_s': time.time() - t0, 'dets': {}}
prev = None
for n in sys.argv[3].split(','):
    n = int(n)
    d = arb_mat([[rows[i][j] for j in range(n)] for i in range(n)]).det()
    out['dets'][n] = {'ball': d.str(15), 'sign': (1 if d > 0 else (-1 if d < 0 else 0))}
    print(n, out['dets'][n], flush=True)
out['total_s'] = time.time() - t0
json.dump(out, open('ref_check.json', 'w'), indent=1)
