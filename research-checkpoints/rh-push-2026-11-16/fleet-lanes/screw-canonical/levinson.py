# Discrete Krein system (Levinson-Durbin) of the Toeplitz compression of the screw kernel on step functions of mesh h.
import sys, math
from flint import arb, ctx
from screw import weights
kind = sys.argv[1]; T = float(sys.argv[2]); m = int(sys.argv[3]); ctx.dps = int(sys.argv[4]) if len(sys.argv) > 4 else 200
h = arb(T)/m
beta = arb(5)/2 if kind == 'zeta' else arb(3)/2
a0 = (arb(5)/4).digamma() - arb.pi().log() if kind == 'zeta' else (arb(3)/4).digamma() + (5/arb.pi()).log()
W = weights(kind, T + float(h))
S0 = (beta/2).zeta(2)/4 if False else None
def hz2(b):   # sum_m 1/(2m+b)^2 = zeta(2, b/2)/4
    return arb(2).zeta(b/2)/4
Z = hz2(beta)
def Psi(t):
    if t == 0: return arb(0)
    s = arb(0); j = 0; q = (-2*t).exp(); e = (-beta*t).exp()
    while True:
        b = 2*j + beta
        term = e/(b*b); s += term; e = e*q; j += 1
        if float(b*t) > ctx.prec*0.7 + 40: break
    v = a0*t/2 + Z - s
    for (n, w) in W:
        l = arb(n).log()
        if float(t - l) > 0: v -= w*(t-l)
    if kind == 'zeta': v += 4*((t/2).exp() - 1 - t/2)
    return v
P = [Psi(h*d) for d in range(m+2)]
q = [2*P[1]/h] + [(P[d+1]-2*P[d]+P[d-1])/h for d in range(1, m+1)]
# Levinson-Durbin
a = [arb(1)]; E = q[0]; out = []
for k in range(1, m):
    acc = sum((a[j]*q[k-j] for j in range(k)), arb(0))
    alpha = -acc/E
    a = [a[j] + alpha*(a[k-j] if 0 < k-j < k or k-j == 0 else arb(0)) if j < k else alpha for j in range(k+1)]
    a[0] = arb(1)
    E = E*(1-alpha*alpha)
    out.append((k, float(alpha.mid()), float(E.mid()), float(alpha.rad())))
    if float(alpha.rad()) > 1e-6: print("PRECISION LOST at k=%d t=%.4f" % (k, k*T/m)); break
print('Psi(T)=', float(P[m]), 'q0', float(q[0]))
big = sorted(out, key=lambda z: -abs(z[1]))[:12]
print('largest |alpha_k|: (k, t=k*h, alpha, 1-|alpha|, E_k)')
for (k, al, E_, _r) in sorted(big):
    print(k, '%.4f' % (k*T/m), '%.6f' % al, '%.3e' % (1-abs(al)), '%.3e' % E_)
print('min E_k', min(z[2] for z in out), 'all |alpha|<1:', all(abs(z[1]) < 1 for z in out))
import json; json.dump(out, open('lev_%s_%g_%d.json' % (kind, T, m), 'w'))
bad = [z for z in out if abs(z[1]) >= 1 or z[2] <= 0]
print('SUMMARY', kind, 'T', T, 'm', m, 'dps', ctx.dps, 'last k', out[-1][0], 'first failure (k,t,alpha):', (bad[0][0], bad[0][0]*T/m, bad[0][1]) if bad else None)
