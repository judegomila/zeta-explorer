"""Sign-regularity order of the odd half-line kernel H_-(x,y) (alpha=1) on a grid.
Kernels: zeta (kappa=Phi(u/4)), dh (Davenport-Heilbronn theta kernel), k0 (PR56 convexity control),
quartic (exp(-u^4/8), positive comparison class).
H_-(x,y) = 2 int_0^inf kappa(r+x)[(m+r)kappa(r+y) - (d+r)kappa(r-y)] dr, x>=y, m=(x+y)/2, d=(x-y)/2.
Ball arithmetic (python-flint) for evaluation/determinants; Gauss-Legendre quadrature error is NOT enclosed
(checked by a second run with different panel order).  MEASURED, not interval-certified.
usage: tp_order.py KERNEL h n K prec nodes_per_panel [R]
"""
import sys, json, time
from flint import arb, arb_mat, ctx
kern, h_s, n, K, prec, NP = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
R = float(sys.argv[7]) if len(sys.argv) > 7 else 5.0
ctx.prec = prec
h = arb(h_s)
PI = arb.pi()
import math
def kappa_zeta(u):
    u = abs(u); e = u.exp(); pre = (arb('1.25')*u).exp(); s = arb(0)
    for k in range(1, 60):
        ex = PI*k*k*e
        s += PI*k*k*(2*PI*k*k*e-3)*pre*(-ex).exp()
        if float(ex.mid()) > 0.72*prec + 40: break
    return s
s5 = arb(5).sqrt()
TAU = ((10-2*s5).sqrt()-2)/(s5-1)
CDH = [arb(0), arb(1), TAU, -TAU, arb(-1)]
def kappa_dh_raw(u):
    e = u.exp(); pre = (arb('0.75')*u).exp(); s = arb(0)
    for k in range(1, 4000):
        ex = PI*k*k*e/5
        if k % 5: s += k*CDH[k % 5]*(-ex).exp()
        if float(ex.mid()) > 0.72*prec + 40: break
    return pre*s
def kappa_dh(u): return kappa_dh_raw(abs(u))
def kappa_k0(u):
    t = u*u
    return (1+t/10+t*t/300)*(-t).exp()
def kappa_quartic(u):
    t = u*u
    return (-(t*t)/8).exp()
def kappa_chi4(u):
    u = abs(u); e = u.exp(); pre = (arb('0.75')*u).exp(); s = arb(0); chi = [0, 1, 0, -1]
    for k in range(1, 4000):
        ex = PI*k*k*e/4
        if chi[k % 4]: s += k*chi[k % 4]*(-ex).exp()
        if float(ex.mid()) > 0.72*prec + 40: break
    return pre*s
kappa = dict(zeta=kappa_zeta, dh=kappa_dh, k0=kappa_k0, quartic=kappa_quartic, chi4=kappa_chi4)[kern]
if kern == 'dh':
    for uu in ['0.3', '1.1']:
        a, b = kappa_dh_raw(arb(uu)), kappa_dh_raw(-arb(uu))
        print('DH evenness check u=%s: rel diff %s' % (uu, abs((a-b)/a).str(5)), flush=True)
t0 = time.time()
# Gauss-Legendre nodes on [-1,1]
gl = [arb.legendre_p_root(NP, i, weight=True) for i in range(NP)]
npan = int(round(R/0.125)); wpan = arb(R)/npan
nodes = []; wts = []
for p in range(npan):
    a = wpan*p
    for (xq, wq) in gl:
        nodes.append(a + wpan*(xq+1)/2); wts.append(wq*wpan/2)
# table T[j+n][q] = kappa(r_q + j h), j=-n..n
T = [[kappa(r + h*j) for r in nodes] for j in range(-n, n+1)]
print('table done', round(time.time()-t0, 1), 's', flush=True)
def Hm(i, j):  # nodes x=i h, y=j h, i>=j>=1
    m = h*(i+j)/2; d = h*(i-j)/2
    Tx, Ty, Tmy = T[i+n], T[j+n], T[-j+n]
    s = arb(0)
    for q in range(len(nodes)):
        r = nodes[q]
        s += wts[q]*Tx[q]*((m+r)*Ty[q] - (d+r)*Tmy[q])
    return 2*s
H = [[None]*(n+1) for _ in range(n+1)]
for i in range(1, n+1):
    for j in range(1, i+1):
        H[i][j] = H[j][i] = Hm(i, j)
print('matrix done', round(time.time()-t0, 1), 's', flush=True)
out = {'kernel': kern, 'h': h_s, 'n': n, 'prec_bits': prec, 'nodes_per_panel': NP, 'R': R, 'orders': {}}
out['diag_sample'] = {str(i): H[i][i].str(30) for i in (1, n//4, n//2, n)}
for k in range(1, K+1):
    pos = neg = und = 0; firstneg = None; neglist = []
    for i in range(1, n-k+2):
        for j in range(1, n-k+2):
            M = arb_mat([[H[i+a][j+b] for b in range(k)] for a in range(k)])
            dt = M.det()
            if dt > 0: pos += 1
            elif dt < 0:
                neg += 1; neglist.append((i, j))
                if firstneg is None: firstneg = (i, j, dt.str(8))
            else: und += 1
    out['orders'][k] = dict(total=pos+neg+und, pos=pos, neg=neg, undetermined=und, first_negative=firstneg, negative_positions=neglist)
    print(kern, 'order', k, {a: b for a, b in out['orders'][k].items() if a != 'negative_positions'}, round(time.time()-t0, 1), 's', flush=True)
    if neg and und == 0 and pos == 0 and k > 3: break
# LDL pivots of the full symmetric grid matrix (principal test = odd-sector PSD on the grid span)
A = [[H[i][j] for j in range(1, n+1)] for i in range(1, n+1)]
piv = []
for c in range(n):
    p = A[c][c]; piv.append(p)
    if not (p > 0): break
    for r in range(c+1, n):
        f = A[r][c]/p
        for cc in range(c, n): A[r][cc] = A[r][cc] - f*A[c][cc]
out['ldl_pivots_sign'] = ['+' if p > 0 else ('-' if p < 0 else '?') for p in piv]
out['ldl_last_pivot'] = piv[-1].str(8)
print('LDL pivots:', ''.join(out['ldl_pivots_sign']), 'last', piv[-1].str(8), flush=True)
import json
tag = '%s_h%s_n%d_p%d_np%d' % (kern, h_s, n, prec, NP)
json.dump(out, open('tp_%s.json' % tag, 'w'), indent=1)
# dump a few entries for quadrature cross-check
json.dump({('%d,%d' % (i, j)): H[i][j].str(60) for (i, j) in [(1, 1), (2, 1), (n, n), (n, 1), (n//2, n//3 or 1)]}, open('entries_%s.json' % tag, 'w'), indent=1)
