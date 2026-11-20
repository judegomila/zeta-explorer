# Combination 2: commutator form on frequency nodes (source: src/data/imp-commutator-diagonal-positivity.js, imp-3252).
#   A(z) = int_0^inf Phi cosh(au) cos(zu) du,  B(z) = int_0^inf Phi sinh(au) sin(zu) du     (A + iB = int Phi cos((z - ia)u) du = Xi(z - ia)/2)
#   K(w_j, w_k) = [A_j B_k - B_j A_k] / (pi (w_k - w_j)),   K_jj = (A_j B'_j - A'_j B_j)/pi          (de Branges kernel of E = A - iB)
#   diagonal channel D(w_j, w_k) = d(w_j - w_k),  d(t) = (1/2pi) int_0^inf Phi^2 sinh(2au) sin(tu)/t du,  d(0) = (1/2pi) int Phi^2 u sinh(2au) du
#   remainder R = K - D.   Statistic: ||R||_F / ||D||_F and tr K / tr D on node sets (own ordinates, log prime powers, arithmetic-free).
# usage: c2.py out.jsonl key prec nmax a1,a2,...
import sys, json, math, time
import numpy as np
from flint import arb, acb, ctx
import slib, olib


def repro():
    """imp-3252: kernel as typed in the source (NPHI = 10), midpoint grid, a = 0.5, U = 6."""
    def phi(u):
        s = 0.0
        for n in range(1, 11):
            n2 = n*n
            s += (2*math.pi**2*n2*n2*math.exp(4*u) - 3*math.pi*n2*math.exp(2*u))*math.exp(-math.pi*n2*math.exp(4*u))
        return s
    out = {}
    for N in (160, 800, 6400):
        H = 6.0/N
        u = (np.arange(N) + 0.5)*H
        ph = np.array([phi(x) for x in u])
        p = ph*np.cosh(0.5*u); q = ph*np.sinh(0.5*u)
        mu = math.sqrt(max(0.0, p@p*(q@q) - (p@q)**2))
        if N <= 800:
            G = np.outer(p, q) - np.outer(q, p)
            ev = np.linalg.eigvalsh(1j*G)
            out[N] = {'min_eig_iG': float(ev[0]), 'max_eig_iG': float(ev[-1]), 'mu_rank2': mu, 'H_mu': H*mu, 'H2_mu': H*H*mu}
        else:
            out[N] = {'mu_rank2': mu, 'H_mu': H*mu}
    return out


def primes_powers(n):
    N = 200; res = []
    while len(res) < n:
        N *= 2
        sieve = bytearray([1])*(N + 1); sieve[0:2] = b'\x00\x00'
        for i in range(2, int(N**0.5) + 1):
            if sieve[i]: sieve[i*i::i] = bytearray(len(sieve[i*i::i]))
        res = []
        for p in range(2, N + 1):
            if sieve[p]:
                q = p
                while q <= N: res.append(q); q *= p
        res.sort()
    return res[:n]


def own_nodes(key, n):
    """w = 2 gamma for the first n zeros on the line (zeta: exact; others: sign changes of Lambda on the line, bisected)."""
    if key in ('zeta', 'zeta_free'):
        return [2*acb.zeta_zero(k).imag for k in range(1, n + 1)]
    L = olib.make_lambda(key)
    f = lambda t: (L(acb(0.5, t))).real if key != 'liou' else None
    res = []; t = 0.05; step = 0.02
    prev = f(arb(t))
    # normalise by the size to avoid underflow issues: only the sign is used
    while len(res) < n and t < 4000:
        t2 = t + step; cur = f(arb(t2))
        if (prev > 0 and cur < 0) or (prev < 0 and cur > 0):
            lo, hi = t, t2; flo = prev
            for _ in range(60):
                mid = (lo + hi)/2; fm = f(arb(mid))
                if (flo > 0 and fm > 0) or (flo < 0 and fm < 0): lo = mid; flo = fm
                else: hi = mid
            res.append(2*arb((lo + hi)/2))
        t = t2; prev = cur
    return res


def main():
    out_path, key, prec, nmax = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    alist = [float(x) for x in sys.argv[5].split(',')]
    f = open(out_path, 'a')
    if key == 'repro':
        f.write(json.dumps({'mode': 'repro', 'rows': repro()}) + '\n'); return
    ctx.prec = prec
    t0 = time.time()
    kkey = key
    T, W, Kv = slib.table(kkey)
    print(key, 'table', len(T), 'nodes, %.1fs' % (time.time() - t0), flush=True)
    WK = [w*k for w, k in zip(W, Kv)]
    Tf = np.array([float(t) for t in T]); K2f = np.array([float(w*k*k) for w, k in zip(W, Kv)])
    # node sets
    sets = {}
    zkey = 'zeta' if (key.startswith('heat') or key.startswith('E_b') or key.startswith('NR') or key in ('zeta',)) else key
    okey = {'chi-4': 'chi-4', 'chi5': 'chi5', 'DH': 'DH'}.get(key)
    nown = nmax if okey is None else min(nmax, 300)
    own = own_nodes(okey or 'zeta', nown)
    sets['own' if (okey or key == 'zeta') else 'zeta-ordinates'] = own
    # arithmetic-free: same count on the same range from the smooth counting function of zeta (2 x smooth ordinates), or equispaced
    wmax = float(own[-1])
    sets['equispaced'] = [arb(wmax)*arb(j)/len(own) for j in range(1, len(own) + 1)]
    if zkey == 'zeta':
        sets['smooth'] = [2*olib.smooth_ordinate(k, float(own[k - 1])/2) for k in range(1, len(own) + 1)]
    pp = primes_powers(min(nmax, 2000))
    sets['log-prime-powers'] = [arb(q).log() for q in pp]
    lo = math.log(2.0); hi = math.log(pp[-1])
    sets['equispaced-on-log-prime-power-range'] = [arb(lo) + (arb(hi) - arb(lo))*arb(j)/(len(pp) - 1) for j in range(len(pp))]
    ns = [n for n in (10, 50, 200, 500, 1000, 2000) if n <= nmax]
    for a in alist:
        aa = arb(a)
        # diagonal channel in float64: d(t) on demand
        m2 = K2f*np.sinh(2*a*Tf)
        d0 = float((m2*Tf).sum()/(2*math.pi))
        for sname, nodes in sets.items():
            n_all = len(nodes)
            # A + iB = int Phi cos((w - ia) u),  A' + iB' = -int Phi u sin((w - ia) u)
            A = []; B = []; Ad = []; Bd = []
            for w in nodes:
                z = acb(w, -aa); s0 = acb(0); s1 = acb(0)
                for t, wk in zip(T, WK):
                    c, s = (z*t).cos(), (z*t).sin()
                    s0 += wk*c; s1 -= wk*t*s
                A.append(s0.real); B.append(s0.imag); Ad.append(s1.real); Bd.append(s1.imag)
            pi = arb.pi()
            Kd = [(A[j]*Bd[j] - Ad[j]*B[j])/pi for j in range(n_all)]
            wf = np.array([float(w) for w in nodes])
            for n in ns:
                if n > n_all: continue
                # float64 parts
                dt = wf[:n, None] - wf[None, :n]
                Dm = np.empty((n, n))
                ch = max(1, min(64, int(2e7/(n*len(Tf)))))
                for i0 in range(0, n, ch):
                    tt = dt[i0:i0 + ch]
                    with np.errstate(divide='ignore', invalid='ignore'):
                        val = np.where(np.abs(tt)[..., None] > 1e-12, np.sin(tt[..., None]*Tf)/np.where(np.abs(tt)[..., None] > 1e-12, tt[..., None], 1.0), Tf)
                    Dm[i0:i0 + ch] = (val*m2).sum(axis=-1)/(2*math.pi)
                normD2 = float((Dm**2).sum())
                # <K, D> and ||K||^2 in balls (K is tiny beyond the lowest nodes)
                KD = arb(0); KK = arb(0); trK = arb(0)
                for j in range(n):
                    trK += Kd[j]; KD += Kd[j]*arb(float(Dm[j, j])); KK += Kd[j]*Kd[j]
                    for k in range(j + 1, n):
                        v = (A[j]*B[k] - B[j]*A[k])/(pi*(nodes[k] - nodes[j]))
                        KD += 2*v*arb(float(Dm[j, k])); KK += 2*v*v
                ratio2 = 1 - 2*KD/arb(normD2) + KK/arb(normD2)
                row = {'mode': 'c2', 'key': key, 'a': a, 'nodes': sname, 'n': n, 'prec': prec, 'd0': d0,
                       'trK_over_trD': float(trK/(n*arb(d0))), 'K11_over_d0': float(Kd[0]/arb(d0)), 'Knn_over_d0_log10': olib.l10(Kd[n - 1]/arb(d0)),
                       'normK_over_normD': float((KK/arb(normD2)).sqrt()), 'ratio_R_over_D': float(ratio2.sqrt()),
                       'one_minus_ratio': float(1 - ratio2.sqrt()), 'min_Kdiag_sign': min(slib.sgn(x) for x in Kd[:n]),
                       'node_range': [float(nodes[0]), float(nodes[n - 1])], 'seconds': time.time() - t0}
                f.write(json.dumps(row) + '\n'); f.flush()
                print(json.dumps(row)[:400], flush=True)


main()
