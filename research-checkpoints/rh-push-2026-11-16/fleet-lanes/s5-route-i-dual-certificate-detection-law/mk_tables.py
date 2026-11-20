import json, os, sys, math, glob
def rows(fn):
    return [json.loads(l) for l in open(fn)] if os.path.exists(fn) else []
out = []
# control ladder (balls)
for fn in sorted(glob.glob('arb_ctrl_K*.jsonl')) + sorted(glob.glob('arb_zeta*.jsonl')) + sorted(glob.glob('arb_q*.jsonl')):
    R = rows(fn)
    if not R: continue
    objs = sorted({r['obj'] for r in R}); Ks = sorted({r['K'] for r in R})
    out.append('### %s (Ritz values, min over the two parity sectors; ball arithmetic, %s bits)\n' % (fn, sorted({r['prec'] for r in R})))
    out.append('| 2a | K | ' + ' | '.join(objs) + ' |'); out.append('|---|---|' + '---|' * len(objs))
    for K in Ks:
        for s in sorted({r['twoa'] for r in R if r['K'] == K}):
            d = {r['obj']: r for r in R if r['twoa'] == s and r['K'] == K}
            out.append('| %.4f | %d | ' % (s, K) + ' | '.join(('%.4e' % d[o]['lam']) if o in d else '-' for o in objs) + ' |')
    out.append('')
# E_b onsets
R = rows('arb_ea_K300.jsonl')
if R:
    out.append('### arb_ea_K300.jsonl: zeta(s+b) zeta(s-b), full form, K = 300, 448 bits\n')
    objs = sorted({r['obj'] for r in R}, key=lambda s: -float(s[2:]))
    out.append('| 2a | ' + ' | '.join(objs) + ' |'); out.append('|---|' + '---|' * len(objs))
    for s in sorted({r['twoa'] for r in R}):
        d = {r['obj']: r for r in R if r['twoa'] == s}
        out.append('| %.2f | ' % s + ' | '.join(('%.3e' % d[o]['lam']) if o in d else '-' for o in objs) + ' |')
    out.append('')
    out.append('| b | last positive 2a | first negative 2a | T* = 2 pi e e^{2a} at the first negative support | 0.5 log(14.1347/2pi) |'); out.append('|---|---|---|---|---|')
    for o in objs:
        rs = sorted([r for r in R if r['obj'] == o], key=lambda r: r['twoa'])
        neg = [r['twoa'] for r in rs if r['lam'] < 0]
        if neg:
            fn_ = min(neg); lp = max([r['twoa'] for r in rs if r['twoa'] < fn_ and r['lam'] > 0], default=float('nan'))
            out.append('| %s | %.2f | %.2f | %.1f | 0.405 |' % (o[2:], lp, fn_, 2 * math.pi * math.e * math.exp(fn_)))
    out.append('')
# symbol statistics and float Ritz screen
R = rows('symstats_gpu.jsonl')
if R:
    objs = []
    for r in R:
        if r['obj'] not in objs: objs.append(r['obj'])
    out.append('### symstats_gpu.jsonl: float64 screen, lattice nu_k = pi k / a\n')
    out.append('lambda_min (float64; values below 1e-10 in absolute value are noise):\n')
    out.append('| 2a | space dimension | ' + ' | '.join(objs) + ' |'); out.append('|---|---|' + '---|' * len(objs))
    for s in sorted({r['twoa'] for r in R}):
        d = {r['obj']: r for r in R if r['twoa'] == s}
        K = d[objs[0]]['ritz']['K'] if objs[0] in d else 0
        out.append('| %.3f | %d | ' % (s, 2 * K + 1) + ' | '.join(('%.3e' % d[o]['ritz']['lam']) if o in d else '-' for o in objs) + ' |')
    out.append('\nnegative-to-positive mass ratio of the full-prime symbol w_F on [0, T], T = min(5e4, 2 pi e e^{2a}/q):\n')
    out.append('| 2a | ' + ' | '.join(objs) + ' |'); out.append('|---|' + '---|' * len(objs))
    for s in sorted({r['twoa'] for r in R}):
        d = {r['obj']: r for r in R if r['twoa'] == s}
        out.append('| %.3f | ' % s + ' | '.join(('%.4f' % d[o]['stats']['mass_ratio']) if o in d else '-' for o in objs) + ' |')
    out.append('\nbathtub floor in the L^2 normalisation (mean of w_F over its deepest sub-level set of measure pi/a inside [0, T]; the t = 0 well included):\n')
    out.append('| 2a | ' + ' | '.join(objs) + ' |'); out.append('|---|' + '---|' * len(objs))
    for s in sorted({r['twoa'] for r in R}):
        d = {r['obj']: r for r in R if r['twoa'] == s}
        out.append('| %.3f | ' % s + ' | '.join(('%.2f' % d[o]['stats']['floor_L2']) if o in d else '-' for o in objs) + ' |')
    out.append('\nbathtub floor of sigma_2 = (t^2 + 1/4)^2 w_F on the same window, -(a/pi) int over the deepest set (and the place of the minimum of sigma_2):\n')
    out.append('| 2a | window T | ' + ' | '.join(objs) + ' |'); out.append('|---|---|' + '---|' * len(objs))
    for s in sorted({r['twoa'] for r in R}):
        d = {r['obj']: r for r in R if r['twoa'] == s}
        out.append('| %.3f | %.0f | ' % (s, d[objs[0]]['stats']['T']) + ' | '.join(('%.2e (t = %.0f)' % (d[o]['stats']['floor_sigma2'], d[o]['stats']['t_at_min_sigma2'])) if o in d else '-' for o in objs) + ' |')
    out.append('\nspectral centroid of the ground vector (sum v_k^2 nu_k; lower sector):\n')
    out.append('| 2a | ' + ' | '.join(objs) + ' |'); out.append('|---|' + '---|' * len(objs))
    for s in sorted({r['twoa'] for r in R}):
        d = {r['obj']: r for r in R if r['twoa'] == s}
        def cen(r):
            z = r['ritz']; k = 'even' if z['even'] <= z['odd'] else 'odd'
            return z.get(k + '_centroid', z.get('even_centroid'))
        out.append('| %.3f | ' % s + ' | '.join(('%.1f' % cen(d[o])) if o in d else '-' for o in objs) + ' |')
    out.append('')
open('tables_all.md', 'w').write('\n'.join(out) + '\n')
print('\n'.join(out))
