"""ff_recheck.py: exact / high-precision recheck of the Lambda-minimisers reported by ffstream (one per (q, g)).
Exact: counts a_d >= 0 for d <= 60 and d <= 200, inertia of G_N (Descartes on the exact characteristic polynomial), Hasse-Weil-Serre at d <= g.
mpmath (40 digits): roots, eps = max log|beta|, Lambda by bisection on real-rootedness of H_t (polyroots in x = cos theta).
usage: ff_recheck.py out.json st_file.json ..."""
import sys, json, math
import mpmath as mp
import ffanalyze as fa
mp.mp.dps = 40
def lam_mp(cc, q, g, hint):
    L = mp.log(q); b = [mp.mpf(cc[g + k]) * mp.mpf(q) ** (-mp.mpf(g + k) / 2) for k in range(g + 1)]
    def real_rooted(t):
        co = [b[0]] + [2 * b[k] * mp.exp(t * (k * L) ** 2 / 4) for k in range(1, g + 1)]
        # Chebyshev -> monomial
        T = [[mp.mpf(1)], [mp.mpf(0), mp.mpf(1)]]
        for k in range(2, g + 1): T.append([(2 * T[k - 1][i - 1] if i > 0 else 0) - (T[k - 2][i] if i < len(T[k - 2]) else 0) for i in range(k + 1)])
        a = [mp.mpf(0)] * (g + 1)
        for k in range(g + 1):
            for i in range(k + 1): a[i] += co[k] * T[k][i]
        r = mp.polyroots(a[::-1], maxsteps=500, extraprec=200)
        return all(abs(mp.im(x)) < mp.mpf(10) ** -15 and abs(mp.re(x)) <= 1 + mp.mpf(10) ** -15 for x in r)
    lo, hi = mp.mpf(0), mp.mpf(hint) * 4
    assert not real_rooted(lo) and real_rooted(hi)
    for _ in range(90):
        mid = (lo + hi) / 2
        if real_rooted(mid): hi = mid
        else: lo = mid
    return hi
out = []
for fn in sys.argv[2:]:
    s = json.load(open(fn)); q, g = s['q'], s['g']
    if not s['minimisers']: continue
    m = s['minimisers'][0]; c = m['c']
    cc = fa.full_coeffs(c, q, g); p = fa.power_sums(cc, g, 200)
    ok60, _ = fa.counts_ok(p, q, 60); ok200, dfail = fa.counts_ok(p, q, 200)
    negs = [fa.neg_count(fa.gram(p, q, N)) for N in range(1, 2 * g + 2)]
    nu = negs[2 * g - 1]; ndet = next((N for N in range(1, 2 * g + 2) if negs[N - 1] > 0), None)
    serre, sd = fa.serre_ok(p, q, g)
    roots = mp.polyroots([mp.mpf(x) for x in cc], maxsteps=500, extraprec=200)   # ascending coefficients as descending: roots are the alpha_i
    eps = max(mp.log(abs(r) / mp.sqrt(q)) for r in roots)
    L = lam_mp(cc, q, g, m['Lam'])
    Sm = mp.matrix(2 * g, 2 * g)
    for i in range(2 * g):
        for j in range(2 * g): Sm[i, j] = mp.mpf(p[abs(i - j)]) * mp.mpf(q) ** (-mp.mpf(abs(i - j)) / 2)
    lmin = min(mp.eigsy(Sm, eigvals_only=True))
    rec = dict(q=q, g=g, c=c, members=s['members'], rh=s['rh'], fakes=s['fakes'], counts_ok_60=ok60, counts_ok_200=ok200, first_negative_count_degree=dfail, nu_exact=nu, ndet_exact=ndet,
               serre_d_le_g=serre, eps=float(eps), lmin_T2g=float(lmin), C_ratio=float(-lmin / eps ** 2), Lam_mp=float(L), Lam_stream=m['Lam'], hasse_n=fa.first_hasse_fail(p, q, g, 200),
               g1_formula=(4 * math.log((math.isqrt(4 * q) + 1) / (2 * math.sqrt(q))) / math.log(q) ** 2))
    assert nu == m['nu'] and ndet == m['ndet'] and serre == bool(m['serre']), (rec, m)
    out.append(rec)
    print(json.dumps(rec), flush=True)
json.dump(out, open(sys.argv[1], 'w'))
