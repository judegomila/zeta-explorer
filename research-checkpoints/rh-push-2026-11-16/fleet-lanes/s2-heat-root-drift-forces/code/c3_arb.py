"""Higher-precision re-check of combo3 (python-flint balls, PREC bits; Gauss-Legendre quadrature of the archimedean integrals is
   not enclosed. Panels of length <= 0.1, C3_GL nodes per panel (default 48). With 48 nodes the error is near 1e-169 at frequency 80: use C3_GL=160 when lambda_min is below 1e-150 (RESULT.md section 2, item 7).
   Same form and basis as combo3.py, independent arithmetic. Inertia from LDL^T pivots in balls; lambda_min from mpmath eigsy on the midpoints.
   usage: c3_arb.py OUT.json code:a:wmax ..."""
import sys, json, math, os
from multiprocessing import Pool
from flint import arb, acb, ctx
import mpmath as mp
PREC = int(os.environ.get('C3_PREC', '500'))

def coeffs(code, X):
    X = int(math.floor(X + 1e-9)); out = []
    if code == 'DH':
        k = ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1); per = [arb(0), arb(1), k, -k, arb(-1)]
        L = [arb(0)] * (X + 1)
        for n in range(2, X + 1): L[n] = per[n % 5] * arb(n).log()
        for d in range(2, X // 2 + 1):
            for m in range(2, X // d + 1): L[d * m] -= L[d] * per[m % 5]
        return [(arb(n).log(), L[n] / arb(n).sqrt()) for n in range(2, X + 1)]
    for p in range(2, X + 1):
        if any(p % q == 0 for q in range(2, int(p ** 0.5) + 1)): continue
        m = 1
        while p ** m <= X:
            n = p ** m; lp = arb(p).log(); base = lp / arb(n).sqrt()
            if code == 'ZETA': c = base
            elif code == 'LCHI5': c = base * [0, 1, -1, -1, 1][n % 5]
            elif code == 'SGN-LIOU': c = base * (-1) ** m
            elif code == 'TNR':
                th = (arb('2.2') / 2).acosh()
                c = arb(3).log() * (1 / arb(n).sqrt() - (-1) ** m * 2 * (m * th).cosh()) if p == 3 else base
            elif code.startswith('EA-'):
                num, den = code[3:].split('/'); c = base * 2 * (arb(int(num)) / int(den) * m * lp).cosh()
            out.append((m * lp, c)); m += 1
    return out

def job(arg):
    code, a_s, wmax = arg.split(':'); ctx.prec = PREC
    a = arb(a_s); L = 2 * a; K = int(math.ceil(float(wmax) * float(a_s) / math.pi)); pi = arb.pi(); half = arb(1) / 2
    if code.startswith('EA-'):
        num, den = code[3:].split('/'); e = arb(int(num)) / int(den); poles = [half + e, half - e]; gam = [half + e, half - e]; const = -2 * pi.log()
    else:
        poles = [half] if code in ('ZETA', 'SGN-LIOU', 'TNR') else []
        gam = [arb(3) / 2] if code == 'DH' else [half]
        const = {'ZETA': -pi.log(), 'SGN-LIOU': -pi.log(), 'LCHI5': (5 / pi).log(), 'DH': (5 / pi).log(), 'TNR': -pi.log() + 2 * arb(3).log()}[code]
    cf = [(v, c) for v, c in coeffs(code, float(L.exp().mid())) if v < L]
    npan = max(8, int(math.ceil(float(L.mid()) / 0.1))); m = int(os.environ.get("C3_GL", "48"))
    base = [arb.legendre_p_root(m, k, weight=True) for k in range(m)]
    h = L / npan / 2; V = []; W = []
    for p_ in range(npan):
        c0 = L / npan * p_ + h
        for x, w in base: V.append(c0 + h * x); W.append(h * w)
    REG = {}; RR = {}
    for ie, e in enumerate(gam):
        ke = [(-e * v).exp() / (1 - (-2 * v).exp()) for v in V]
        REG[ie] = [(k_ - 1 / (2 * v)) * w for k_, v, w in zip(ke, V, W)]
        RR[ie] = [(2 * (L - v) * k_ - L / v) * w for k_, v, w in zip(ke, V, W)]
    Ein = arb.const_euler() + (2 * L).log() + (2 * L).expint(1); E1 = (2 * L).expint(1)
    sig = []; tau = []
    for k in range(K + 1):
        w = pi * k / a; s = arb(0); t = const * L
        for c in poles:
            for lam0 in (c, -c):
                lam = acb(lam0, w)
                if k == 0 and lam0 == 0: I = acb(L); J = acb(L * L / 2)
                else: I = ((lam * L).exp() - 1) / lam; J = ((lam * L).exp() - 1 - lam * L) / (lam * lam)
                s += I.imag; t += 2 * J.real
        sc = [(w * v).sin_cos() for v in V]
        Si = (w * L).si() if k else arb(0); Cin = (arb.const_euler() + (w * L).log() - (w * L).ci()) if k else arb(0)
        for ie in range(len(gam)):
            sa = arb(0); ta = arb(0)
            for (sn, cs), r1, r2 in zip(sc, REG[ie], RR[ie]): sa += sn * r1; ta += cs * r2
            s += -(sa + Si / 2); t += L * (Cin - Ein) - ta + L * E1
        for v, c in cf:
            sn, cs = (w * v).sin_cos(); s += -c * sn; t += -2 * c * (L - v) * cs
        sig.append(s); tau.append(t)
    n = 2 * K + 1
    def ent(i, j):
        ki, kj = i - K, j - K
        if i == j: return tau[abs(ki)]
        si = sig[abs(ki)] * (1 if ki > 0 else -1 if ki < 0 else 0); sj = sig[abs(kj)] * (1 if kj > 0 else -1 if kj < 0 else 0)
        return (-1) ** (ki - kj) * (2 * a / (pi * (ki - kj))) * (sj - si)
    Q = [[ent(i, j) for j in range(n)] for i in range(n)]
    # inertia by LDL^T in balls (order: k = 0, +1, -1, +2, -2, ... so that leading blocks are nested frequency cut-offs)
    order = [K] + [K + s_ * j for j in range(1, K + 1) for s_ in (1, -1)]
    Lm = [[None] * n for _ in range(n)]; d = []; signs = ''
    for jj in range(n):
        j = order[jj]; s = Q[j][j]
        for kk in range(jj): s -= Lm[jj][kk] * Lm[jj][kk] * d[kk]
        d.append(s)
        if s.contains(0): signs += '?'; break
        signs += '+' if s > 0 else '-'
        for ii in range(jj + 1, n):
            i = order[ii]; x = Q[i][j]
            for kk in range(jj): x -= Lm[ii][kk] * Lm[jj][kk] * d[kk]
            Lm[ii][jj] = x / s
    mp.mp.dps = int(PREC * 0.30103) - 5
    M = mp.matrix(n, n)
    for i in range(n):
        for j in range(n): M[i, j] = mp.mpf(Q[i][j].mid().str(mp.mp.dps, radius=False))
    ev = sorted(mp.eigsy(M, eigvals_only=True)); ev = [x / (2 * mp.mpf(a_s)) for x in ev]
    r = dict(code=code, a=float(a_s), K=K, prec=PREC, nterms=len(cf), lam_min=mp.nstr(ev[0], 12), lam_2=mp.nstr(ev[1], 12), lam_max=mp.nstr(ev[-1], 8),
             n_neg_eig=sum(1 for x in ev if x < 0), ldl_decided=len(signs) - signs.count('?'), ldl_negatives=signs.count('-'),
             first_neg_pivot_index=(signs.find('-') + 1) if '-' in signs else None, max_entry_rad=float(max(Q[i][j].rad() for i in range(n) for j in range(n))))
    print(json.dumps(r), flush=True); return r

if __name__ == '__main__':
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as p: res = p.map(job, sys.argv[2:], chunksize=1)
    json.dump(res, open(sys.argv[1], 'w'), indent=0); print('DONE')
