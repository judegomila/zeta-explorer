"""Tables for RESULT.md from blocks_q*_d*.jsonl and checks_q*_d*.json (all numbers derive from exact integers)."""
import json, glob, math, sys
from collections import defaultdict
B = []
for f in sorted(glob.glob('blocks_q*_d*.jsonl')):
    B += [json.loads(l) for l in open(f)]
TARGETS = ('a', 'b'); CTRL = ('n1', 'n2', 'r1', 'r2', 'dh', 'mu', 't')
def hu(r): return r.get('h_up')
print('== T1  F1 / F2 exact checks')
for f in sorted(glob.glob('checks_q*_d*.json')):
    c = json.load(open(f))
    f1 = c.get('F1', {}); f2 = c.get('F2', {})
    print(' q=%d d=%d  k computed %s | F1: k=%s, m tested %s, violations %d | F2 pairs %s violations %s' % (c['q'], c['d'], '0..%d' % max(c['ks']),
          ','.join(f1.keys()) or '-', sum(v['tested'] for v in f1.values()), sum(v['violations'] for v in f1.values()),
          ','.join('%s<->%s' % (k, v['partner']) for k, v in f2.items()) or '-', {k: v.get('violations', 0) for k, v in f2.items()}) + ' | p*-form violations %s | pairs where neither form holds: %d' % ({k: v.get('violations', 0) for k, v in c.get('F2p', {}).items()}, sum(1 for k in f2 if f2[k].get('violations', 0) and c.get('F2p', {}).get(k, {}).get('violations', 1))))
    print('     c_k identically 0 for k in', [k for k, v in c['c_norm2'].items() if v == '0'], ' ||c_k||^2/flat:', {k: round(v, 3) for k, v in c['c_infl'].items()})
print()
print('== T2  invariance of the normalised probe |J|/(||c_k|| ||R||) in k (classes of equal value, 9 digits)')
tot = eq = 0
for q in (7, 13):
    for d in sorted({r['d'] for r in B if r['q'] == q}):
        kh = (d + 1) // 2
        grp = defaultdict(list)
        for r in B:
            if r['q'] == q and r['d'] == d and r.get('log_q_ratio') is not None: grp[(r['target'], r['N'], r['lam'])].append(r)
        n_hi = n_match = 0
        for key, rr in grp.items():
            low = [round(x['log_q_ratio'], 9) for x in rr if x['k'] <= kh]
            for x in rr:
                if x['k'] > kh:
                    n_hi += 1; n_match += (round(x['log_q_ratio'], 9) in low)
        # also: blocks with k > kh and J != 0 while every k <= kh has J = 0
        print(' q=%d d=%d: blocks with k > (d+1)/2 and J != 0: %d ; value equal to that of a block with k <= (d+1)/2: %d' % (q, d, n_hi, n_match))
print()
def table(title, targets, lamsel, q=7):
    print(title)
    ds = sorted({r['d'] for r in B if r['q'] == q})
    for t in targets:
        rows = [r for r in B if r['q'] == q and r['target'] == t and lamsel(r['lam']) and r['N'] >= 1 and hu(r) is not None and r['k'] <= (r['d'] + 1) // 2]
        keys = sorted({(r['N'], r['lam']) for r in rows})
        print('  target', t, ' columns d =', ds, ' entry: max over k <= (d+1)/2 of h_up [r at the max]')
        for (N, lam) in keys:
            cells = []
            for d in ds:
                rr = [r for r in rows if r['N'] == N and r['lam'] == lam and r['d'] == d]
                if not rr: cells.append('      .   ')
                else:
                    m = max(rr, key=hu); cells.append('%6.2f[%2d]' % (hu(m), m['r']))
            print('   N=%d lam=%d | %s' % (N, lam, ' '.join(cells)))
table('== T3  base probe (lam = 0), targets', TARGETS, lambda l: l == 0)
table('== T3b base probe (lam = 0), q = 13', ('a',), lambda l: l == 0, q=13)
table('== T4  marked probe (lam >= 1), targets', TARGETS, lambda l: l >= 1)
table('== T5  controls, lam = 0', CTRL, lambda l: l == 0)
table('== T5b controls, lam >= 1', ('n1', 'r1', 'mu', 'dh'), lambda l: l >= 1)
print()
print('== T6  signal law |J| = wt q^d |S_cop(k)|  (k <= (d+1)/2; r = 0: wt = 1 or sqrt q; 1 <= r <= 5 and 6 | k - N\': wt = q - 1)')
for q in (7, 13):
    ex = defaultdict(lambda: [0, 0]); dev = defaultdict(list); zero = defaultdict(lambda: [0, 0, []])
    for r in B:
        if r['q'] != q or r['k'] > (r['d'] + 1) // 2 or r['target'] in ('r1', 'r2') or r['d'] < 4 or r['k'] == r['N'] + r['lam']: continue
        if r['d'] < r['N'] + r['lam'] and r['r'] > 0: reg = 'd<N\''
        else: reg = 'd>=N\''
        if 'J_over_pred' in r:
            if r['r'] == 0: ex[reg][0] += 1; ex[reg][1] += (r['J2'] == r['pred_J2'])
            else: dev[(reg, r['r'])].append(r['J_over_pred'])
        elif r.get('pred_J2') == '0':
            z = zero[(reg, r['r'])]; z[0] += 1; z[1] += (r['J2'] == '0')
            if r.get('log_q_ratio') is not None: z[2].append(r['log_q_ratio'])
    print(' q=%d (d >= 4, k != N\')  r = 0: blocks %s (count, exact integer equality |J|^2 = pred)' % (q, dict(ex)))
    for key in sorted(dev):
        v = sorted(dev[key]); print('   %s r=%d: %d blocks, J/pred min %.3f median %.3f max %.3f' % (key[0], key[1], len(v), v[0], v[len(v) // 2], v[-1]))
    for key in sorted(zero):
        z = zero[key]; print('   %s r=%d, 6 does not divide k-N\' (no principal weight): %d blocks, J = 0 exactly in %d; else log_q(|J|/L) max %s' % (key[0], key[1], z[0], z[1], ('%.2f' % max(z[2])) if z[2] else '-'))
print()
print('== T7  row mean square against the diagonal (d >= N\'): excess = ||R||^2/(q^d D) - 1; bessel = sum_{k<=d/2} |J_k|^2/||c_k||^2 / (q^d D)')
seen = set(); agg = defaultdict(list)
for r in B:
    if 'row_excess_over_diag' not in r or r['q'] != 7: continue
    key = (r['target'], r['N'], r['lam'], r['d'])
    if key in seen: continue
    seen.add(key); agg[r['target']].append((r['row_excess_over_diag'], r['bessel_over_diag'], key))
for t in ('a', 'b', 'n1', 'n2', 'r1', 'dh', 't', 'mu'):
    v = agg.get(t, [])
    if not v: continue
    e = sorted(x[0] for x in v)
    print('  %-3s rows %3d | excess min %8.4f median %8.4f max %8.4f | max at %s' % (t, len(v), e[0], e[len(e) // 2], e[-1], max(v)[2]))
print('  mu control, largest excesses and the Bessel share of the total row energy:')
for x in sorted(agg.get('mu', []), reverse=True)[:12]:
    print('     N=%d lam=%d d=%d: excess %.3f, bessel/(1+excess) = %.3f' % (x[2][1], x[2][2], x[2][3], x[0], x[1] / (1 + x[0])))
print('  targets a, b at d >= 5, sorted by |excess| (largest 8):')
for x in sorted([y for t in ('a', 'b') for y in agg.get(t, []) if y[2][3] >= 5], key=lambda y: -abs(y[0]))[:8]:
    print('     %s N=%d lam=%d d=%d: excess %.4f, bessel %.4f' % (x[2][0], x[2][1], x[2][2], x[2][3], x[0], x[1]))
print()
print('== T8  fit: log_q(|J|/(||c|| ||R||)) = a + b N over target blocks (a, b) with r = 0, k <= (d+1)/2, d >= 4, by lam')
for lam in range(0, 7):
    pts = [(r['N'], r['log_q_ratio']) for r in B if r['q'] == 7 and r['target'] in TARGETS and r['lam'] == lam and r['r'] == 0 and r['k'] <= (r['d'] + 1) // 2 and r['d'] >= 4 and r.get('log_q_ratio') is not None and r['N'] >= 1]
    if len({p[0] for p in pts}) < 2: continue
    n = len(pts); sx = sum(p[0] for p in pts); sy = sum(p[1] for p in pts); sxx = sum(p[0] ** 2 for p in pts); sxy = sum(p[0] * p[1] for p in pts)
    b = (n * sxy - sx * sy) / (n * sxx - sx * sx); a = (sy - b * sx) / n
    print('   lam=%d: %3d blocks, N in %s: slope b = %.3f (Weil: -1/2), fitted h = 3 + 6 b = %.2f' % (lam, n, sorted({p[0] for p in pts}), b, 3 + 6 * b))

print()
print("== T9  blocks that satisfy the signal law (r = 0 exact, or 1 <= r <= 5 with |J/pred - 1| <= 0.25), d >= 4, k <= (d+1)/2, k != N': largest h_up per (target, N, lam)")
for t in ('a', 'b', 'n1', 'n2', 'dh', 'mu'):
    best = {}
    for r in B:
        if r['q'] != 7 or r['target'] != t or r['d'] < 4 or r['k'] > (r['d'] + 1) // 2 or r['k'] == r['N'] + r['lam'] or r['N'] < 1: continue
        if 'J_over_pred' not in r or abs(r['J_over_pred'] - 1) > 0.25 or r.get('h_up') is None: continue
        key = (r['N'], r['lam'])
        if key not in best or r['h_up'] > best[key]['h_up']: best[key] = r
    print('  target', t)
    for N in sorted({k[0] for k in best}):
        print('    N=%d: ' % N + '  '.join('lam=%d: %.2f (d=%d,k=%d,r=%d)' % (lam, best[(N, lam)]['h_up'], best[(N, lam)]['d'], best[(N, lam)]['k'], best[(N, lam)]['r']) for (n, lam) in sorted(best) if n == N))
    for N in sorted({k[0] for k in best}):
        v = [best[k]['h_up'] for k in best if k[0] == N]; print('    N=%d: max over lam %.2f, median %.2f' % (N, max(v), sorted(v)[len(v) // 2]))
