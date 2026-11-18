"""restricted4.py -- fourth moment of the central block restricted to a detector-ranked class, sextic prime-conductor rows.

Rows: prime ideals pi of Z[w] of norm p = 1 mod 3, U <= p < 2U (two per p); chi_pi(n) = sixth root congruent to
n^{(p-1)/6} mod pi, n the primary generator (a = 1 mod 3, b = 0 mod 3) of an ideal prime to 3.
Polynomials (central normalisation, dyadic profile W(x) = sin^2(pi log2 x) on [1,2]):
  S_m(u) = sum_n chi_u(n) N(n)^{-1/2} W(N(n)/U^m),   M_r(u) = same with mu(n).
  A(u)   = sum_n chi_u(n) N(n)^{-1/2} exp(-(N(n)/U^{1/2})^2)   (smooth sum to central length).
Class: the k = ceil(rows^R) rows with largest score (R = 0.590332). Scores: |M_r* S_m*| (detector), |S_m*|, |M_r*|,
two-scale min of normalised |M_r1 S_m*| and |M_r* S_m*| (pairs admissible at t = 1 and t = t*).
Controls: random completely multiplicative sixth-root rows (same pipeline); random class (share = k/rows).
Single process. Planned memory printed before allocation.
"""
import sys, math, json, time
import numpy as np

RC, DELTA, RSTAR, MSTAR, R1 = 0.590332, 0.469345, 0.745700, 0.418254, 0.581746
Z6 = np.exp(1j * np.pi * np.arange(6) / 3.0)

def sieve_spf(n):
    spf = np.zeros(n + 1, dtype=np.int64)
    for i in range(2, n + 1):
        if spf[i] == 0:
            spf[i::i][spf[i::i] == 0] = i
    return spf

def mul(x, y):
    a, b = x; c, d = y
    return (a * c - b * d, a * d + b * c - b * d)
def conj(x): return (x[0] - x[1], -x[1])
def norm(x): return x[0] * x[0] - x[0] * x[1] + x[1] * x[1]
def divides(d, x):
    n = norm(d); t = mul(x, conj(d))
    return t[0] % n == 0 and t[1] % n == 0
def ediv(x, d):
    n = norm(d); t = mul(x, conj(d))
    return (t[0] // n, t[1] // n)

def columns(Nmax):
    """primary elements of norm <= Nmax, their prime-ideal factor lists, mu."""
    els = []
    B = int(math.isqrt(4 * Nmax // 3)) + 3
    for a in range(-2 * B, 2 * B + 1):
        if a % 3 != 1: continue
        for b in range(-3 * ((2 * B) // 3 + 1), 2 * B + 1, 3):
            if b % 3: continue
            N = a * a - a * b + b * b
            if 0 < N <= Nmax: els.append((N, a, b))
    els.sort()
    spf = sieve_spf(Nmax)
    primes = {}            # key (c, d) -> index
    plist = []
    def pidx(el):
        if el not in primes:
            primes[el] = len(plist); plist.append(el)
        return primes[el]
    by_norm = {}
    for N, a, b in els:
        by_norm.setdefault(N, []).append((a, b))
    split = {}             # p -> two primary primes of norm p
    for N, a, b in els:
        if N > 1 and spf[N] == N and N % 3 == 1:
            split.setdefault(N, []).append((a, b))
    fac = []; mu = []
    for N, a, b in els:
        x = (a, b); f = []; m = 1; n = N
        while n > 1:
            p = int(spf[n]); e = 0
            while n % p == 0: n //= p; e += 1
            if p % 3 == 2:
                assert e % 2 == 0
                v = e // 2; f += [pidx((-p, 0))] * v
                if v > 1: m = 0
                else: m = -m
            else:
                assert p % 3 == 1 and len(split[p]) == 2
                tot = 0
                for pr in split[p]:
                    v = 0; y = x
                    while divides(pr, y): y = ediv(y, pr); v += 1
                    f += [pidx(pr)] * v; tot += v
                    if v > 1: m = 0
                    elif v == 1: m = -m
                assert tot == e
        fac.append(f); mu.append(m)
    nf = max(len(f) for f in fac)
    F = np.full((len(els), nf), len(plist), dtype=np.int32)      # pad index -> zero exponent column
    for i, f in enumerate(fac): F[i, :len(f)] = f
    Ns = np.array([e[0] for e in els], dtype=np.float64)
    return Ns, np.array(mu, dtype=np.float64), F, np.array(plist, dtype=np.int64)

def rows_true(U):
    """prime rows: (p, w) with w^2 + w + 1 = 0 mod p, U <= p < 2U."""
    spf = sieve_spf(2 * U)
    out = []
    for p in range(U, 2 * U):
        if spf[p] == p and p % 3 == 1:
            g = 2
            while pow(g, (p - 1) // 3, p) == 1: g += 1
            w = pow(g, (p - 1) // 3, p)
            out.append((p, w)); out.append((p, w * w % p))
    return np.array(out, dtype=np.int64)

def chi_primes(rows, plist):
    """exponent k (chi = zeta6^k) of chi_row(prime column); rows x primes int8."""
    p = rows[:, 0:1]; w = rows[:, 1:2]
    base = (plist[None, :, 0] % p + (plist[None, :, 1] % p) * w) % p
    e = (p - 1) // 6
    res = np.ones_like(base)
    for bit in range(int(e.max()).bit_length()):
        m = ((e >> bit) & 1).astype(bool)
        res = np.where(m, res * base % p, res)
        base = base * base % p
    z = (1 + w) % p
    k = np.full(res.shape, -1, dtype=np.int8); cur = np.ones_like(z)
    for t in range(6):
        k[res == cur] = t
        cur = cur * z % p
    assert (k >= 0).all()
    return k

def poly_weights(Ns, mu, U):
    def W(x):
        out = np.zeros_like(x); ok = (x >= 1) & (x <= 2)
        out[ok] = np.sin(np.pi * np.log2(x[ok])) ** 2
        return out
    amp = Ns ** -0.5
    cols = {
        'S_half': amp * W(Ns / U ** 0.5),
        'A_half': amp * np.exp(-(Ns / U ** 0.5) ** 2),
        'S_mstar': amp * W(Ns / U ** MSTAR),
        'M_rstar': amp * mu * W(Ns / U ** RSTAR),
        'M_r1': amp * mu * W(Ns / U ** R1),
    }
    names = list(cols)
    return names, np.stack([cols[n] for n in names], axis=1)

def evaluate(E, F, Wt, chunk):
    """E: rows x primes int8 exponents; returns rows x polys complex sums."""
    nrow = E.shape[0]
    Eext = np.concatenate([E, np.zeros((nrow, 1), dtype=np.int8)], axis=1)
    out = np.empty((nrow, Wt.shape[1]), dtype=np.complex128)
    for s in range(0, nrow, chunk):
        Ec = Eext[s:s + chunk]
        ex = np.zeros((Ec.shape[0], F.shape[0]), dtype=np.int16)
        for j in range(F.shape[1]):
            ex += Ec[:, F[:, j]]
        out[s:s + chunk] = Z6[ex % 6] @ Wt
    return out

def stats(P, names, U):
    n = P.shape[0]; k = int(math.ceil(n ** RC)); ln = math.log(n)
    v = {nm: np.abs(P[:, i]) for i, nm in enumerate(names)}
    D = v['M_rstar'] * v['S_mstar']; D1 = v['M_r1'] * v['S_mstar']
    scores = {
        'det': D, 'plain': v['S_mstar'], 'inv': v['M_rstar'],
        'two': np.minimum(D / np.sqrt(np.mean(D ** 2)), D1 / np.sqrt(np.mean(D1 ** 2))),
    }
    res = {'rows': n, 'k': k, 'omega_random_class': 1 - math.log(k) / ln}
    for tn in ('S_half', 'A_half'):
        T = v[tn] ** 4; tot = T.sum()
        r = {'mean_sq': float(np.mean(v[tn] ** 2)), 'mean_4': float(T.mean()),
             'kurt': float(T.mean() / np.mean(v[tn] ** 2) ** 2)}
        scores_t = dict(scores); scores_t['self'] = T
        for sn, sc in scores_t.items():
            idx = np.argpartition(sc, n - k)[n - k:]
            sh = float(T[idx].sum() / tot)
            r[sn] = {'share': sh, 'omega': -math.log(sh) / ln, 'lift': sh * n / k}
        r['mix6_ratio'] = float(np.mean(T * D ** 2) / (T.mean() * np.mean(D ** 2)))
        r['mix6_mean'] = float(np.mean(T * D ** 2))
        res[tn] = r
    thr = U ** (DELTA * (RSTAR + MSTAR))
    res['mean_D2'] = float(np.mean(D ** 2)); res['max_D2'] = float(np.max(D ** 2)); res['threshold_D2'] = thr
    res['n_over_threshold_raw'] = int((D ** 2 >= thr).sum())
    res['n_over_threshold_normalised'] = int((D ** 2 / np.mean(D ** 2) >= thr).sum())
    res['corr_logD_logT'] = float(np.corrcoef(np.log(D + 1e-300), np.log(v['S_half'] + 1e-300))[0, 1])
    res['corr_logSm_logT'] = float(np.corrcoef(np.log(v['S_mstar'] + 1e-300), np.log(v['S_half'] + 1e-300))[0, 1])
    res['corr_logMr_logT'] = float(np.corrcoef(np.log(v['M_rstar'] + 1e-300), np.log(v['S_half'] + 1e-300))[0, 1])
    return res

def main():
    kmin, kmax, nseed = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3])
    out = {}
    for kk in range(kmin, kmax + 1):
        U = 2 ** kk; t0 = time.time()
        Nmax = int(max(2 * U ** RSTAR, 6 * U ** 0.5)) + 1
        Ns, mu, F, plist = columns(Nmax)
        rows = rows_true(U)
        nrow, ncol, npr = len(rows), len(Ns), len(plist)
        chunk = max(1, min(nrow, int(4e8 / (16 * ncol))))
        plan = (nrow * npr * 8 * 4 + chunk * ncol * (16 + 2 + 16) + nrow * (npr + 1)) / 2 ** 30
        print(f"U=2^{kk} rows={nrow} cols={ncol} primes={npr} maxfac={F.shape[1]} chunk={chunk} planned peak ~{plan:.2f} GB", flush=True)
        assert plan < 6.0
        names, Wt = poly_weights(Ns, mu, float(U))
        Wt = Wt.astype(np.complex128)
        E = np.concatenate([chi_primes(rows[s:s + 4000], plist) for s in range(0, nrow, 4000)], axis=0)
        rec = {'U': U, 'true': stats(evaluate(E, F, Wt, chunk), names, float(U))}
        ctl = []
        for sd in range(nseed):
            rng = np.random.default_rng(1000 * kk + sd)
            Er = rng.integers(0, 6, size=E.shape, dtype=np.int8)
            ctl.append(stats(evaluate(Er, F, Wt, chunk), names, float(U)))
        rec['random_mult'] = ctl
        out[kk] = rec
        t = rec['true']
        print(f"   true: k={t['k']} om_rand={t['omega_random_class']:.4f} S_half: det {t['S_half']['det']['omega']:.4f} plain {t['S_half']['plain']['omega']:.4f} "
              f"inv {t['S_half']['inv']['omega']:.4f} two {t['S_half']['two']['omega']:.4f} self {t['S_half']['self']['omega']:.4f} mix6 {t['S_half']['mix6_ratio']:.3f} "
              f"| over-thr {t['n_over_threshold_raw']} / norm {t['n_over_threshold_normalised']} | {time.time() - t0:.0f}s", flush=True)
        if ctl:
            m = lambda key: np.mean([c['S_half'][key]['omega'] for c in ctl])
            print(f"   rand: det {m('det'):.4f} plain {m('plain'):.4f} inv {m('inv'):.4f} two {m('two'):.4f} self {m('self'):.4f} "
                  f"mix6 {np.mean([c['S_half']['mix6_ratio'] for c in ctl]):.3f}", flush=True)
        json.dump(out, open(f"restricted4_{kmin}_{kmax}.json", 'w'), indent=1)

if __name__ == '__main__':
    main()
