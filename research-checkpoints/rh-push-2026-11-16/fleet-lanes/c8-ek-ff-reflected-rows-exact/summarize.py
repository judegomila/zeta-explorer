"""Tables from the exact EN lines (results_q*.txt).  Every EN field is an exact integer; the numbers printed here are
ratios and logarithms of those integers (float64 from Python ints / Fractions; no identity is claimed from them).
  e      = sumnorm / diagsum            (row energy over its exact diagonal term; 1 = diagonal level)
  Enorm  = sumnorm / sumW2 = ||B||^2/||beta||^2 with beta_A = g_3(1,A) w(A) / |A|
  a      = log_q(Enorm) / d             (exponent in Q = q^d; diagonal = 1)
  aK     = min(N+lam, 2d+lam-N) / d     (smaller of the two Hilbert-Schmidt levels: unreflected columns q^(N+lam), reflected dual length q^(2d+lam-N))
  K-region: N - lam < d < N + lam (both column counts exceed the number of rows)."""
import sys, math, glob, os, json
from fractions import Fraction
HERE = os.path.dirname(os.path.abspath(__file__))
import genjobs
def load():
    rows = {}
    for fn in sorted(glob.glob(os.path.join(HERE, 'results_q*.txt'))):
        for line in open(fn):
            if not line.startswith('EN '): continue
            f = [x.strip() for x in line.split('|')]; h = f[0].split()
            q, d, N, lam, mode, p1, p2, p3 = [int(x) for x in h[1:9]]
            W = genjobs.weights(q); name = next((n for n, w in W.items() if w == (mode, p1, p2, p3)), None)
            if name is None: continue
            rows[(q, name, N, lam, d)] = dict(np=int(f[1]), sumnorm=int(f[2]), diag=int(f[3]), sW2=int(f[4]), maxnorm=int(f[5]), nsupp=int(f[6]))
    return rows
def stats(r, q, N, lam, d):
    e = r['sumnorm'] / r['diag'] if r['diag'] else float('nan')
    En = r['sumnorm'] / r['sW2'] if r['sW2'] else float('nan')
    a = math.log(En) / math.log(q) / d if En > 0 else float('nan')
    aK = min(N + lam, 2 * d + lam - N) / d
    return e, En, a, aK
def fit(pts):
    n = len(pts); sx = sum(p[0] for p in pts); sy = sum(p[1] for p in pts); sxx = sum(p[0] ** 2 for p in pts); sxy = sum(p[0] * p[1] for p in pts)
    return (n * sxy - sx * sy) / (n * sxx - sx * sx)
NAMES = ['a', 'b', 'dh', 'n1', 'th', 'r1', 'tb', 'mn', 'mu', 'al']
def main():
    R = load(); out = []
    P = out.append
    P(f'# rows loaded: {len(R)}')
    for q in (7, 13):
        P(f'\n## T1 (q = {q}): families, three largest sizes; slope = least-squares slope of log_q(Enorm) against d')
        fams = {'A (n,n,n): M=1, l=1': lambda n: (n, n, n), 'A+ (n,n,n+1)': lambda n: (n, n, n + 1), 'A- (n,n,n-1)': lambda n: (n, n, n - 1),
                'B (2j,j,2j): M=1, l=1/2': lambda j: (2 * j, j, 2 * j), 'C (j,2j,2j): M=2, l=2': lambda j: (j, 2 * j, 2 * j), 'D (n,n-1,n-1)': lambda n: (n, n - 1, n - 1)}
        for fname, fn in fams.items():
            P(f'\n{fname}')
            P('| weight | sizes (N,lam,d) | e = energy/diagonal | exponent a | fitted slope | K slope | diagonal slope |')
            P('|---|---|---|---|---|---|---|')
            for name in NAMES:
                have = [fn(n) for n in range(1, 9) if (q, name) + fn(n) in R and fn(n)[2] >= 1 and fn(n)[1] >= 1]
                have = have[-3:]
                if len(have) < 2: continue
                st = [stats(R[(q, name) + c], q, *c) for c in have]
                sl = fit([(c[2], math.log(s[1]) / math.log(q)) for c, s in zip(have, st)]) if all(s[1] > 0 for s in st) else float('nan')
                slK = fit([(c[2], min(c[0] + c[1], 2 * c[2] + c[1] - c[0])) for c in have])
                P(f"| {name} | {' '.join(str(c).replace(' ', '') for c in have)} | {' '.join('%.4g' % s[0] for s in st)} | {' '.join('%.3f' % s[2] for s in st)} | {sl:.3f} | {slK:.2f} | 1 |")
        P(f'\n## T2 (q = {q}): all computed configurations in the K-region (N - lam < d < N + lam), lam >= 1, N >= 1, by weight')
        P('| weight | configs | e: min | median | max | configs with e > 1.5 | max of a - 1 | min over configs of (aK - a) | threshold count: a <= 1.05 / 1.05 < a < 1.15 / a >= 1.15 (d >= 3) |')
        P('|---|---|---|---|---|---|---|---|---|')
        for name in NAMES:
            L = [(N, lam, d, stats(r, q, N, lam, d)) for (qq, nm, N, lam, d), r in R.items() if qq == q and nm == name and lam >= 1 and N >= 1 and N - lam < d < N + lam]
            if not L: continue
            es = sorted(x[3][0] for x in L); L3 = [x for x in L if x[2] >= 3]
            c1 = sum(1 for x in L3 if x[3][2] <= 1.05); c3 = sum(1 for x in L3 if x[3][2] >= 1.15); c2 = len(L3) - c1 - c3
            P(f"| {name} | {len(L)} | {es[0]:.4g} | {es[len(es) // 2]:.4g} | {es[-1]:.4g} | {sum(1 for e in es if e > 1.5)} | {max(x[3][2] for x in L) - 1:.3f} | {min(x[3][3] - x[3][2] for x in L):.3f} | {c1} / {c2} / {c3} |")
        P(f'\n## T3 (q = {q}): d-scan at fixed (N, lam): e = energy/diagonal; [K] marks the K-region')
        for (N, lam) in [(3, 3), (4, 4), (5, 5), (4, 2), (6, 3), (3, 6), (6, 6), (5, 3), (2, 4)]:
            ds = sorted({d for (qq, nm, n, l, d) in R if qq == q and n == N and l == lam})
            if len(ds) < 2: continue
            P(f'\n(N, lam) = ({N}, {lam}); columns: d = ' + ', '.join(f"{d}{'[K]' if N - lam < d < N + lam else ''}" for d in ds))
            for name in NAMES:
                vals = ['%.4g' % stats(R[(q, name, N, lam, d)], q, N, lam, d)[0] if (q, name, N, lam, d) in R else '-' for d in ds]
                if any(v != '-' for v in vals): P(f'  {name:3s}: ' + '  '.join(vals))
        P(f'\n## T4 (q = {q}): aligned vector: energy/diagonal against nsupp/q^d (the unreflected Hilbert-Schmidt level), K-region, largest sizes')
        L = sorted([(d + N + lam, N, lam, d) for (qq, nm, N, lam, d) in R if qq == q and nm == 'al' and lam >= 1 and N >= 1 and N - lam < d < N + lam])[-12:]
        for _, N, lam, d in L:
            r = R[(q, 'al', N, lam, d)]; e, En, a, aK = stats(r, q, N, lam, d)
            P(f'  (N,lam,d)=({N},{lam},{d}): e = {e:.4g}; nsupp/q^d = {r["nsupp"] / q ** d:.4g}; a = {a:.3f}; (N+lam)/d = {(N + lam) / d:.3f}; aK = {aK:.3f}')
        P(f'\n## T5 (q = {q}): largest single row, max_m |B_m|^2 / mean_m |B_m|^2, K-region, d >= 4')
        for name in NAMES:
            L = [(r['maxnorm'] * q ** d / r['sumnorm']) for (qq, nm, N, lam, d), r in R.items() if qq == q and nm == name and lam >= 1 and N >= 1 and N - lam < d < N + lam and d >= 4 and r['sumnorm']]
            if L: P(f'  {name:3s}: configs {len(L)}, median {sorted(L)[len(L) // 2]:.3g}, max {max(L):.4g}')
    # ---- T6: coherent (Bessel) part of the row energy, from the exact Moebius sums
    SC = {}
    fn = os.path.join(HERE, 'sc_results.txt')
    if os.path.exists(fn):
        for line in open(fn):
            f = line.split('|'); h = f[0].split(); q, d, N, lam, mode, p1, p2, p3 = [int(x) for x in h[1:9]]
            W = genjobs.weights(q); name = next((n for n, w in W.items() if w == (mode, p1, p2, p3)), None)
            if name: SC[(q, name, N, lam, d)] = [int(x) for x in f[1].split()]
    def bcoh(q, name, N, lam, d):
        """sum over k <= d/2 of |J_k|^2/||c_k||^2 divided by the diagonal, with |J_k| = wt_k q^d |S_cop(k)| (exact at r = 0; c7 law for 1 <= r <= 5),
        ||c_0||^2 = q^d, ||c_k||^2 = q^(d+2k)(1-1/q).  Returns (value as Fraction, number of k with dual length r >= 6, which are left out)."""
        S = SC.get((q, name, N, lam, d)); r_ = R.get((q, name, N, lam, d))
        if S is None or r_ is None or not r_['diag']: return None
        tot = Fraction(0); skipped = 0; Np = N + lam
        for k in range(0, d // 2 + 1):
            r = k + Np - 1 - d
            if r < 0: continue
            # principal part of Z_r (Theorem A of r2-ff-tro6-complete): sixth powers z = v^6 among the dual frequencies
            if (k - Np) % 6 == 0: wt = (q - 1) * sum(q ** i for i in range(0, (r - 1) // 6 + 1)) - (q ** (r // 6) if r % 6 == 0 else 0) if r >= 1 else -1; wt2 = wt * wt
            else: wt2 = q * q ** (r // 3) if r % 6 == 0 else 0
            if r >= 6: skipped += 1
            nc = Fraction(q ** d) if k == 0 else Fraction(q ** (d + 2 * k) * (q - 1), q)
            tot += Fraction(wt2 * q ** (2 * d) * S[k] ** 2) / nc
        return tot / (q ** Np * r_['diag']), skipped
    for q in (7, 13):
        P(f'\n## T6 (q = {q}): row energy against diagonal + coherent part. x = e - 1 (measured, exact integers); B = coherent part predicted from the exact Moebius sums (principal sixth-power frequencies; exact at dual length r = 0, c7 law for 1 <= r <= 5, same count applied for r >= 6, marked *); K-region, d >= 2')
        P('| weight | configs | median x | max x | median B | max B | median of x - B | max abs(x - B) | configs with x - B > 0.5 | configs containing a k with r >= 6 |')
        P('|---|---|---|---|---|---|---|---|---|---|')
        for name in NAMES:
            L = []
            for (qq, nm, N, lam, d), r in R.items():
                if qq != q or nm != name or lam < 1 or N < 1 or not (N - lam < d < N + lam) or d < 2: continue
                b = bcoh(q, name, N, lam, d)
                if b is None: continue
                L.append((r['sumnorm'] / r['diag'] - 1, float(b[0]), b[1], (N, lam, d)))
            if not L: continue
            xs = sorted(x[0] for x in L); bs = sorted(x[1] for x in L); ds = sorted(x[0] - x[1] for x in L)
            worst = max(L, key=lambda x: abs(x[0] - x[1]))
            P(f"| {name} | {len(L)} | {xs[len(xs) // 2]:.4g} | {xs[-1]:.4g} | {bs[len(bs) // 2]:.4g} | {bs[-1]:.4g} | {ds[len(ds) // 2]:.4g} | {abs(worst[0] - worst[1]):.4g} at {worst[3]} | {sum(1 for x in L if x[0] - x[1] > 0.5)} | {sum(1 for x in L if x[2])} |")
        P(f'\n## T7 (q = {q}): largest configurations, x = e - 1 and coherent part B (K-region), sorted by size')
        big = sorted({(N + lam + d, N, lam, d) for (qq, nm, N, lam, d) in R if qq == q and lam >= 1 and N >= 2 and N - lam < d < N + lam})[-14:]
        for _, N, lam, d in big:
            parts = []
            for name in NAMES:
                r = R.get((q, name, N, lam, d))
                if not r: continue
                b = bcoh(q, name, N, lam, d) if name not in ('r1', 'al') else None
                parts.append(f"{name}: {r['sumnorm'] / r['diag'] - 1:+.4g}" + (f" (B {float(b[0]):.3g}{'*' if b[1] else ''})" if b else ''))
            P(f'  (N,lam,d)=({N},{lam},{d}), a at diagonal+K-size would be {min(N + lam, 2 * d + lam - N) / d:.2f}: ' + '; '.join(parts))
    # ---- T8: non-coherent part e - B_coh, and the long-mark corner
    for q in (7, 13):
        P(f'\n## T8 (q = {q}): non-coherent part n = e - B_coh (all computed configurations with lam >= 1, N >= 1, d >= 2, d + lam > N; unstarred = no k with r >= 6)')
        P('| weight | unstarred configs | min n | 5% | median | 95% | max n | starred configs | min n | median | max n |')
        P('|---|---|---|---|---|---|---|---|---|---|---|')
        for name in NAMES:
            if name in ('r1', 'al'): continue
            U = []; S_ = []
            for (qq, nm, N, lam, d), r in R.items():
                if qq != q or nm != name or lam < 1 or N < 1 or d < 2 or not r['diag']: continue
                b = bcoh(q, name, N, lam, d)
                if b is None: continue
                (S_ if b[1] else U).append(r['sumnorm'] / r['diag'] - float(b[0]))
            if not U: continue
            U.sort(); S_.sort(); pc = lambda L, p: L[min(len(L) - 1, int(p * len(L)))]
            P(f"| {name} | {len(U)} | {U[0]:.3g} | {pc(U, 0.05):.3g} | {pc(U, 0.5):.3g} | {pc(U, 0.95):.3g} | {U[-1]:.3g} | {len(S_)} | " + (f"{S_[0]:.3g} | {pc(S_, 0.5):.3g} | {S_[-1]:.3g} |" if S_ else "- | - | - |"))
    P('\n## T9 (q = 7): long marks. e = energy/diagonal; B = coherent part (starred: contains a k with r >= 6); a = exponent in q^d; rmax = largest dual length among k <= d/2')
    for cfg in [(1, 5, 2), (1, 6, 2), (1, 7, 2), (1, 8, 2), (1, 9, 2), (1, 10, 2), (1, 7, 3), (1, 8, 3), (1, 9, 3), (1, 7, 4), (1, 8, 4), (2, 6, 2), (2, 7, 2), (2, 10, 2), (2, 7, 3), (2, 7, 4), (3, 6, 3), (3, 6, 4), (6, 6, 3), (6, 6, 4)]:
        parts = []
        for name in NAMES:
            r = R.get((7, name) + cfg)
            if not r or not r['diag']: continue
            e, En, a, aK = stats(r, 7, *cfg); b = bcoh(7, name, *cfg) if name not in ('r1', 'al') else None
            parts.append(f"{name}: e {e:.4g}, a {a:.2f}" + (f", B {float(b[0]):.3g}{'*' if b[1] else ''}" if b else ''))
        if parts: P(f"  (N,lam,d)={cfg}, rmax = {cfg[2] // 2 + cfg[0] + cfg[1] - 1 - cfg[2]}, 3N = {3 * cfg[0]}: " + '; '.join(parts))
    open(os.path.join(HERE, 'summary.txt'), 'w').write('\n'.join(out) + '\n'); print('\n'.join(out))
if __name__ == '__main__': main()
