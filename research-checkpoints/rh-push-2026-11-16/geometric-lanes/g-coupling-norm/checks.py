import json, numpy as np
from flint import arb, acb, arb_mat, acb_poly, ctx
from lib import *
ctx.prec = 3000
res = {}
def rho_split(xs, Ls, nf):
    """1 - rho^2 for frozen = first nf nodes, live = rest: smallest root of det(S - t P_Y)."""
    N = len(xs); nl = N-nf
    K = lambda i, j: (Ls[i]+Ls[j])/(xs[i]+xs[j])
    PX = arb_mat(nf, nf, [K(i, j) for i in range(nf) for j in range(nf)])
    B = arb_mat(nf, nl, [K(i, nf+j) for i in range(nf) for j in range(nl)])
    PY = arb_mat(nl, nl, [K(nf+i, nf+j) for i in range(nl) for j in range(nl)])
    S = PY - B.transpose()*PX.solve(B)
    M = PY.solve(S)
    rts = acb_poly(M.charpoly()).roots()
    return min((r.real for r in rts), key=lambda r: float(r.mid()))
# (a) PR 56 numeric/AUDIT.md log-Pick row: nodes .15,.35,.7,1.2, first two frozen; reported rho = 0.99999999996638
xs = [arb(15)/100, arb(35)/100, arb(7)/10, arb(12)/10]; Ls = [L_xi(x) for x in xs]
t = rho_split(xs, Ls, 2); res['pr56_logpick_rho'] = (1-t).sqrt().str(20); res['pr56_1_minus_rho2'] = t.str(12)
# (b) half/half splits on family B, and DH
for func, Lf in (('xi', L_xi), ('dh', L_dh)):
    for N in (4, 8, 12, 16, 20, 24):
        xs = nodes('B', N); Ls = [Lf(x) for x in xs]
        t = rho_split(xs, Ls, N//2)
        res[f'half_{func}_B_{N}'] = round(log10mid(t), 3)
# (d) one-node identity rho^2 = (1-b^2)/(1-b^2 phi1^2), phi1 = Schur-Nevanlinna iterate
x1, y = arb(7)/10, arb(19)/10
for func, Lf in (('xi', L_xi), ('dh', L_dh)):
    l1, ly = Lf(x1), Lf(y)
    K = lambda a, la, b, lb: (la+lb)/(a+b)
    rho2 = K(x1, l1, y, ly)**2/(K(x1, l1, x1, l1)*K(y, ly, y, ly))
    b = (y-x1)/(y+x1); phi = (ly-l1)/(ly+l1); phi1 = phi/b
    res[f'identity_{func}'] = dict(rho2=rho2.str(25), formula=((1-b*b)/(1-b*b*phi1*phi1)).str(25), phi1=phi1.str(15),
                                  diff_contains_zero=bool((rho2-(1-b*b)/(1-b*b*phi1*phi1)).contains(0)))
# (c) float64: where does double precision lose the sign of the pivot?  (GPU float linear algebra is the same arithmetic)
for fam in ('A', 'B', 'C'):
    xsb = nodes(fam, 40); Lsb = [L_xi(x) for x in xsb]
    A, _ = pick_normalized(xsb, Lsb)
    Af = np.array([[float(a.mid()) for a in r] for r in A])
    d = []
    Lm = np.zeros((40, 40)); 
    for i in range(40):
        for j in range(i):
            Lm[i, j] = (Af[i, j]-sum(Lm[i, k]*Lm[j, k]*d[k] for k in range(j)))/d[j]
        d.append(Af[i, i]-sum(Lm[i, k]**2*d[k] for k in range(i)))
    exact = ldl_pivots(A)
    bad = next((i for i in range(40) if d[i] <= 0 or abs(d[i]/float(exact[i].mid())-1) > 0.5), None)
    res[f'float64_first_wrong_order_{fam}'] = bad+1 if bad is not None else None
    res[f'float64_sample_{fam}'] = [(i+1, d[i], float(exact[i].mid())) for i in (2, 4, 6, 8)]
# (e) pivots always below Szego value?
for f in ('xi_A_100', 'xi_B_100', 'xi_C_80', 'dh_A_100', 'dh_B_100', 'dh_C_80'):
    r = json.load(open(f'piv_{f}.json'))['rows']
    res[f'piv_le_szego_{f}'] = all(x['log10_piv'] <= x['log10_szego'] for x in r)
    res[f'allpos_{f}'] = all(x['positive'] for x in r)
    res[f'defect_log10_range_{f}'] = (round(min(x['log10_piv']-x['log10_szego'] for x in r), 2), round(max(x['log10_piv']-x['log10_szego'] for x in r), 2))
    if f.startswith('xi'):
        res[f'bounds_ok_{f}'] = (all(x['upper_ok'] for x in r), all(x['lower_ok'] for x in r))
        res[f'gap_per_n_{f}'] = (round(max((x['log10_upper']-x['log10_piv'])/x['n'] for x in r if x['n']>=10), 3), round(max((x['log10_piv']-x['log10_lower'])/x['n'] for x in r if x['n']>=10), 3))
json.dump(res, open('checks.json', 'w'), indent=1)
print(json.dumps(res, indent=1))
