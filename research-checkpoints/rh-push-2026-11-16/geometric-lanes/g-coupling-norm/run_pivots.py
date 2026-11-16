import sys, json, time
from flint import arb, acb, ctx
from lib import *
func, family, Nmax, prec = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
ctx.prec = prec
t0 = time.time()
xs = nodes(family, Nmax)
Lf = L_xi if func == 'xi' else L_dh
Ls = [Lf(x) for x in xs]
print('L values done', time.time()-t0, flush=True)
A, K = pick_normalized(xs, Ls)
d = ldl_pivots(A)
print('LDL done', time.time()-t0, flush=True)
zeros = None
if func == 'xi':
    zeros = [z.imag for z in acb.zeta_zeros(1, Nmax//2 + 2)]
else:
    zeros = [arb(z) for z in json.load(open('dh_zeros.json'))['online']]
rows = []
for n in range(1, Nmax):         # split: frozen = first n nodes, live = node n+1 (index n)
    y = xs[n]; X = xs[:n]
    piv = d[n]
    m = n//2
    prodx = arb(1)
    for x in X: prodx *= (x-y)**2
    # Szego (Hardy) reference: 1-rho^2 = B_X(y)^2
    bl = arb(1)
    for x in X: bl *= ((x-y)/(x+y))**2
    row = dict(n=n, y=float(y.mid()), log10_piv=log10mid(piv), piv=piv.str(8), positive=bool(piv > 0),
               relrad=float((piv.rad()/abs(piv.mid())).mid()) if not piv.contains(0) else None,
               log10_szego=log10mid(bl))
    if m <= len(zeros)-2:
        g = zeros
        # upper bound (all listed zeros on the line): tau_m * prod (x_j-y)^2 / prod_{k<=m}(y^2+g_k^2)^2
        den = arb(1)
        for k in range(m): den *= (y*y+g[k]**2)**2
        tau = 1 - (y/Ls[n])*sum((2/(g[k]**2+y*y) for k in range(m)), arb(0))
        up = tau*prodx/den
        # lower bound under positivity of the discarded terms: duality with points -y, +-i g_k (k<=m+1), needs deg q<=2m
        mm = m+1 if n % 2 == 0 else m+1   # deg q <= n; relation needs n <= 2*mm, i.e. mm >= n/2
        if n % 2 == 1: mm = m+1           # n=2m+1 <= 2(m+1)
        den2 = arb(1)
        for k in range(mm): den2 *= (y*y+g[k]**2)**2
        S = arb(0)
        for k in range(mm):
            pj = arb(1)
            for x in X: pj *= (g[k]**2 + x*x)
            pl = arb(1)
            for l in range(mm):
                if l != k: pl *= (g[l]**2-g[k]**2)**2
            S += pj/(2*g[k]**2*pl)
        lo = (y/Ls[n])*prodx/(den2*S)
        row.update(log10_upper=log10mid(up), log10_lower=log10mid(lo), tau=float(tau.mid()),
                   upper_ok=bool(piv < up) if func=='xi' else None, lower_ok=bool(piv > lo) if func=='xi' else None)
    rows.append(row)
    print(json.dumps(row), flush=True)
json.dump(dict(func=func, family=family, Nmax=Nmax, prec=prec, rows=rows, seconds=time.time()-t0),
          open(f'piv_{func}_{family}_{Nmax}.json', 'w'), indent=0)
