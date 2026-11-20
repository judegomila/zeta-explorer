"""Test 4, prime side: S_X(t) = -(1/pi) sum_{n = p^k <= X} a(n) sin(t log n) / (k sqrt(n)) on a uniform grid of M points of step
delta = (mean spacing)/4 starting at T, for cut-offs X = T^(1/4), T^(1/2), T (capped at XMAX), families:
  zeta  a = 1;  liou  a(p^k) = (-1)^k (sign twist, completely multiplicative, eps_p = -1);  rnd  a(p^k) = eps_p^k, eps_p = +-1 from a seed;
  chi4  a = chi_-4(n);  chi5  a = (n/5).
T-NR (q, c): a differs from zeta's only at n = q^j; its row is the zeta row plus a closed-form term, added in the summary.
E_a: a(p^k) = p^(k a) + p^(-k a), a = 0.1.
Phases T log n mod 2 pi are taken in binary128 (kbq.c). The partial sums are stored at each cut-off (the primes are processed in increasing order).
Usage: t4_prime.py T XMAX M OUT.json
Statistic: rms and sup of |S_X| over the window, divided by sqrt(log log T / (2 pi^2))."""
import sys, json, math, numpy as np, bl, hl
T = float(sys.argv[1]); XMAX = float(sys.argv[2]); M = int(sys.argv[3]); out = sys.argv[4]
if T > 1e6: assert bl.HAVE_QUAD, 'binary128 phases are needed above 1e6'
sp = bl.TWO_PI / math.log(T / bl.TWO_PI); delta = sp / 4
cuts = sorted(set(min(XMAX, T ** th) for th in (0.25, 0.5, 1.0)))
Xtop = cuts[-1]
fam = ['zeta', 'liou', 'rnd', 'chi4', 'chi5', 'ea0.1']
hl.log('T=%g spacing %.5f delta %.5f window %.1f = %d spacings; cut-offs %s; M=%d' % (T, sp, delta, M * delta, M // 4, cuts, M))
rng = np.random.default_rng(20261120)
S = np.zeros((len(fam), M)); C = np.zeros((len(fam), M)); snaps = {}
CH = 2.5e8                                   # values of n per chunk; primes per chunk about CH / log X: arrays (2 + 6) * 8 bytes each
edges = sorted(set([2.0] + [c for c in cuts] + list(np.arange(CH, Xtop, CH)) + [Xtop]))
small = bl.primes_upto(int(math.isqrt(int(Xtop)) + 1))
def chunk(lo, hi):
    """prime powers n in (lo, hi] (lo = 2 includes 2): n, k, p"""
    lo_i = int(lo) + 1 if lo > 2 else 2; hi_i = int(hi)
    seg = np.ones(hi_i - lo_i + 1, bool)
    for p in small:
        if p * p > hi_i: break
        st = max(p * p, (lo_i + p - 1) // p * p); seg[st - lo_i::p] = False
    pr = (np.nonzero(seg)[0] + lo_i).astype(np.float64); n = [pr]; k = [np.ones(len(pr))]; pp = [pr]
    j = 2
    while 2.0 ** j <= hi:
        q = small[(small.astype(np.float64) ** j > lo if lo > 2 else True) & (small.astype(np.float64) ** j <= hi)].astype(np.float64)
        if len(q): n.append(q ** j); k.append(np.full(len(q), float(j))); pp.append(q)
        j += 1
    return np.concatenate(n), np.concatenate(k), np.concatenate(pp)
nP = 0
for lo, hi in zip(edges[:-1], edges[1:]):
    n, k, p = chunk(lo, hi)
    if len(n):
        nP += len(n)
        phi, lg = bl.phase_big(n, T)
        base = 1.0 / (k * np.sqrt(n))
        pi_ = p.astype(np.int64); odd = (k % 2 == 1)
        c4 = np.where(pi_ % 4 == 1, 1.0, np.where(pi_ % 4 == 3, -1.0, 0.0)); c5 = np.array([0.0, 1.0, -1.0, -1.0, 1.0])[pi_ % 5]
        # eps_p from a hash of p (reproducible across chunks)
        eps = np.where(((pi_ * 2654435761) >> 7) % 2 == 0, 1.0, -1.0)
        coef = np.stack([base, base * np.where(odd, -1.0, 1.0), base * np.where(odd, eps, 1.0), base * np.where(odd, c4, c4 * c4), base * np.where(odd, c5, c5 * c5),
                         base * (n ** 0.1 + n ** -0.1)])
        s_, c_ = bl.rot_sum(phi, delta * lg, coef, M); S += s_; C += c_
    if hi in cuts:
        snaps[hi] = (-S / math.pi).copy(); hl.log('cut-off %g reached: %d prime powers' % (hi, nP))
norm = math.sqrt(math.log(math.log(T)) / (2 * math.pi ** 2))
res = dict(T=T, M=M, delta=delta, spacing=sp, norm=norm, cuts=cuts, families=fam, rows=[])
tt = np.arange(M) * delta
q = 1000003.0; cq = 2.2
for X, Sx in snaps.items():
    for i, f in enumerate(fam):
        v = Sx[i]; res['rows'].append(dict(family=f, X=X, theta=math.log(X) / math.log(T), rms=float(np.sqrt((v ** 2).mean())), sup=float(np.abs(v).max()), mean=float(v.mean()),
                                         r_rms=float(np.sqrt((v ** 2).mean()) / norm), r_sup=float(np.abs(v).max() / norm)))
    # T-NR: Lambda_F(q^j) q^(-j/2) = (-1)^(j+1) log q (alpha^j + alpha^-j) + log q q^(-j/2); extra term in S_X for q^j <= X
    al = cq / 2 + math.sqrt(cq * cq / 4 - 1); ex = np.zeros(M); j = 1
    phq, lq = bl.phase_big(np.array([q]), T)
    while q ** j <= X:
        ex += -(1 / math.pi) * (-1) ** (j + 1) * (al ** j + al ** -j) / j * np.sin(j * (phq[0] + tt * lq[0])); j += 1
    v = Sx[0] + ex
    res['rows'].append(dict(family='tnr1000003', X=X, theta=math.log(X) / math.log(T), rms=float(np.sqrt((v ** 2).mean())), sup=float(np.abs(v).max()), mean=float(v.mean()),
                            r_rms=float(np.sqrt((v ** 2).mean()) / norm), r_sup=float(np.abs(v).max() / norm), extra_terms=j - 1))
res['S_zeta_first'] = {('%g' % X): Sx[0][:2048].tolist() for X, Sx in snaps.items()}
bl.jdump(res, out)
for r in res['rows']: print('%-11s X=%-8g rms %.4f sup %.4f r_rms %.3f r_sup %.3f' % (r['family'], r['X'], r['rms'], r['sup'], r['r_rms'], r['r_sup']))
