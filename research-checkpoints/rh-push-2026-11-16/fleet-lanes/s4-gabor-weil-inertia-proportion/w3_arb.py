"""Certified inertia of the prime-side matrix W (box and Hann windows) in Arb ball arithmetic.
Usage: w3_arb.py FAMILY nu_lo nu_hi X prec_bits [eig]
Entries are balls (prime sum is finite: n <= X; arch terms from Arb digamma/polygamma; exponentially small residue sum truncated
with an explicit tail bound added to the radius).  Inertia by LDL^T without pivoting: a sign is certified when the pivot ball excludes 0.
Eigenvalues (optional) from mpmath at the same precision on the midpoints (not certified)."""
import sys, math, json, time
from flint import arb, acb, ctx
import w3

def run(name, lo, hi, X, prec, do_eig=True, log=print, return_W=False):
    ctx.prec = prec
    t0 = time.time()
    L = arb(int(X)).log() if float(X).is_integer() else arb(X).log()
    pi = arb.pi(); delta = 2 * pi / L
    nu0 = arb(lo)
    n = int((hi - lo) / float(delta)) + 1
    nus = [nu0 + delta * a for a in range(n)]
    # ---- coefficients
    Xi = int(X)
    if name == 'DH':
        s5 = arb(5).sqrt(); kap = ((10 - 2 * s5).sqrt() - 2) / (s5 - 1)
        per = [arb(0), arb(1), kap, -kap, arb(-1)]
        rhs = [None] * (Xi + 1)
        for m in range(2, Xi + 1):
            r = m % 5
            rhs[m] = per[r] * arb(m).log() if r else arb(0)
        terms = []
        for d in range(2, Xi + 1):
            cd = rhs[d]
            if d % 5 != 0:
                terms.append((d, cd))
                for m in range(2, Xi // d + 1):
                    r = m % 5
                    if r: rhs[d * m] = rhs[d * m] - cd * per[r]
        mus = [1]; logN = arb(5).log(); pole = False
    else:
        import numpy as np
        nn, pp, kk = w3.prime_powers(Xi)
        terms = []
        for m, p, k in zip(nn.tolist(), pp.tolist(), kk.tolist()):
            lp = arb(p).log()
            if name == 'ZETA': c = lp
            elif name == 'CHI5R': c = lp * [0, 1, -1, -1, 1][m % 5]
            elif name == 'LIOU': c = lp * (-1) ** k
            else: raise ValueError(name)
            if m % 5 == 0 and name == 'CHI5R': continue
            terms.append((m, c))
        mus = [0]; logN = arb(5).log() if name == 'CHI5R' else arb(0); pole = name in ('ZETA', 'LIOU')
    log('n=%d nodes, %d terms, coefficients in %.1fs' % (n, len(terms), time.time() - t0))
    # ---- Dirichlet sums E(nu_a), D(nu_a) by recurrence in a
    us = [arb(m).log() for m, _ in terms]
    w = [c / arb(m).sqrt() * (acb(0, 1) * nu0 * u).exp() for (m, c), u in zip(terms, us)]
    z = [(acb(0, 1) * delta * u).exp() for u in us]
    E = []; D = []
    for a in range(n):
        e = acb(0); d = acb(0)
        for j in range(len(w)):
            e += w[j]; d += w[j] * us[j]
            w[j] = w[j] * z[j]
        E.append(e); D.append(d)
    log('sums in %.1fs' % (time.time() - t0))
    # ---- arch
    Lf = float(L)
    J = [arb(0)] * n; Jd = [arb(0)] * n; Om = [logN - len(mus) * pi.log()] * n
    ph = (acb(0, -1) * nu0 * L).exp()
    for mu in mus:
        for a in range(n):
            zz = acb(arb(1 + 2 * mu) / 4, nus[a] / 2)
            ps = zz.digamma(); tg = acb.polygamma(zz, acb(1))
            if tg is None: raise RuntimeError('no polygamma')
            J[a] = J[a] + ps.imag; Om[a] = Om[a] + ps.real; Jd[a] = Jd[a] + tg.real / 2
        K = int((prec * 0.6932 / Lf + 4) / 2) + 2
        for a in range(n):
            s1 = acb(0); s2 = acb(0)
            for k in range(K):
                al = arb(1 + 2 * mu) / 2 + 2 * k
                wk = (-al * L).exp()
                den = acb(-nus[a], al)
                s1 += wk / den; s2 += wk / (den * den)
            tail = (-(arb(1 + 2 * mu) / 2 + 2 * K) * L).exp() * 4      # |1/den| <= 1/alpha <= 1, geometric tail
            tb = arb(0, float(tail.upper()))
            J[a] = J[a] + 2 * (ph * s1).real + tb; Jd[a] = Jd[a] + 2 * (ph * s2).real + tb
    v = [L / (2 * pi) * J[a] + L / pi * E[a].imag for a in range(n)]
    diag = [Jd[a] + L * Om[a] - 2 * (L * E[a].real - D[a].real) for a in range(n)]
    W = [[None] * n for _ in range(n)]
    Fp = [2 * ((acb(0, 0.5) - nus[a]) * L / 2).sin() / (acb(0, 0.5) - nus[a]) for a in range(n)] if pole else None
    for a in range(n):
        for b in range(a + 1):
            if a == b: x = diag[a]
            else: x = (v[a] - v[b]) / (a - b) * (1 if (a - b) % 2 == 0 else -1)
            if pole: x = x + 2 * (Fp[a] * Fp[b]).real
            W[a][b] = x; W[b][a] = x
    maxrad = max(float(W[a][b].rad()) for a in range(n) for b in range(a + 1))
    absmax = max(abs(float(W[a][b].mid())) for a in range(n) for b in range(a + 1))
    log('matrix in %.1fs, max entry %.4g, max radius %.3g' % (time.time() - t0, absmax, maxrad))
    out = dict(family=name, lo=lo, hi=hi, X=X, prec=prec, n=n, nterms=len(terms), absmax=absmax, max_radius=maxrad, delta=float(delta))
    if return_W: return W, nus, L, out
    def hann(M):
        m = len(M)
        A = [[(M[i][j] + 2 * M[i + 1][j] + M[i + 2][j]) / 4 for j in range(m)] for i in range(m - 2)]
        return [[(A[i][j] + 2 * A[i][j + 1] + A[i][j + 2]) / 4 for j in range(m - 2)] for i in range(m - 2)]
    def inertia(M):
        m = len(M); A = [row[:] for row in M]
        pos = neg = und = 0; piv = []
        for k in range(m):
            p = A[k][k]
            if p > 0: pos += 1
            elif p < 0: neg += 1
            else:
                und += 1; piv.append(None); return pos, neg, m - pos - neg, piv
            piv.append(float(p.mid()))
            rk = A[k]
            for i in range(k + 1, m):
                f = rk[i] / p            # upper triangle only: A[i][k] = A[k][i]
                ri = A[i]
                for j in range(i, m):
                    ri[j] = ri[j] - f * rk[j]
        return pos, neg, und, piv
    for lab, M in (('box', W), ('hann', hann(W))):
        pos, neg, und, piv = inertia(M)
        r = dict(dim=len(M), n_pos=pos, n_neg=neg, undecided=und, min_abs_pivot=min((abs(x) for x in piv if x is not None), default=None),
                 neg_pivot_index=[i for i, x in enumerate(piv) if x is not None and x < 0][:5])
        if do_eig:
            import mpmath as mp
            mp.mp.prec = prec
            MM = mp.matrix(len(M), len(M))
            for i in range(len(M)):
                for j in range(len(M)):
                    MM[i, j] = mp.mpf(M[i][j].mid().str(int(prec * 0.30103) + 5, radius=False))
            ev = mp.eigsy(MM, eigvals_only=True)
            ev = sorted(ev)
            r['ev_low'] = [mp.nstr(x, 6) for x in ev[:6]]; r['ev_high'] = mp.nstr(ev[-1], 6)
            r['n_neg_eig'] = sum(1 for x in ev if x < 0)
            r['smallest_abs_eig'] = mp.nstr(min(abs(x) for x in ev), 6)
            r['n_eig_below_1e-13'] = sum(1 for x in ev if abs(x) < 1e-13)
        out[lab] = r
        log(lab, json.dumps(r))
    out['time_s'] = time.time() - t0
    return out

if __name__ == '__main__':
    name = sys.argv[1]; lo = float(sys.argv[2]); hi = float(sys.argv[3]); X = float(sys.argv[4]); prec = int(sys.argv[5])
    do_eig = len(sys.argv) > 6 and sys.argv[6] == 'eig'
    out = run(name, lo, hi, X, prec, do_eig, log=lambda *a: print(*a, file=sys.stderr, flush=True))
    print(json.dumps(out), flush=True)
