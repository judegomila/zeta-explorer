# Explicit L^2 odd test for DH: spectral profile g(t) = exp(-(t-t0)^2/(2 s^2)) on t>0 (odd-extended),
# physical preimage a(x) ~ sin(t0 x/2) exp(-s^2 x^2/8).  Energy Q = int int g C_- g  /  int g^2.
import sys
from lib import *
ctx.dps = 120
def run(kind, t0, s, N=80):
    t0 = arb(t0); s = arb(s)
    a = t0-8*s; b = t0+8*s
    ts = []; ws = []
    for k in range(N):
        x, w = arb.legendre_p_root(N, k, weight=True)
        ts.append((a+b)/2+(b-a)/2*x); ws.append((b-a)/2*w)
    M, J = Cminus_matrix(ts, kind)
    g = [(-(t-t0)**2/(2*s*s)).exp() for t in ts]
    Q = arb(0); nrm = arb(0)
    for i in range(N):
        nrm += ws[i]*g[i]*g[i]
        for k in range(N): Q += ws[i]*ws[k]*g[i]*g[k]*M[i, k]
    return Q/nrm
for kind, t0 in [('dh', '85.72'), ('dh', '114.17'), ('dh', '166.48'), ('dh', '176.72'), ('xi', '85.72')]:
    for s in ['0.05', '0.1', '0.2', '0.4']:
        print(kind, 't0', t0, 'sigma', s, 'Q/||g||^2 =', run(kind, t0, s).str(8), flush=True)
