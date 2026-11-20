"""Markdown tables from run_weil.py / suzuki.py output.  usage: python mk_tables.py weil.json [suzuki.json]"""
import json, sys, math
D = json.load(open(sys.argv[1])); R = D['results']; N = D['N']
def e(x, d=2): return '-' if x is None else ('%.' + str(d) + 'e') % x
def lam(o, key):
    if key not in o: return None
    r = o[key]
    return r['lam'] if 'lam' in r else min(r['even'], r['odd'])
def keyorder(k): return R[k]['twoa']
Ks = sorted([k for k in R if k[0] == 'K'], key=keyorder)
Ss = sorted([k for k in R], key=keyorder)
sgn = [n for n in R[Ks[0]]['objects'] if n.startswith('SGN') and n != 'SGN++++']
print('## Table 1. Combination 1: lambda_min by coefficient vector, Legendre-Galerkin N = %d (Ritz values: upper bounds on the infimum)\n' % N)
print('Forms with zeta\'s gamma factor, pole projected out (pf). "sign patterns" = the 15 non-trivial completely multiplicative sign choices on p = 2,3,5,7.\n')
print('| K | 2a | zeta even | zeta odd | sign patterns negative | least negative sign pattern | Liouville | THIN-0.9 (flip 5) | DEL-0.75 | DEL-0.9 | U-00..07 negative | WT | Cramer P(negative) | primes without prime powers |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for k in Ks:
    r = R[k]; O = r['objects']
    z = O['SGN++++']['pf_k0']
    vals = {n: lam(O[n], 'pf_k0') for n in sgn}
    # patterns that coincide with zeta on active rungs are not counted as distinct
    distinct = {n: v for n, v in vals.items() if any(abs(O[n]['coef'][m] - O['SGN++++']['coef'][m]) > 1e-12 for m in O[n]['coef'])}
    neg = sum(1 for v in distinct.values() if v < 0)
    best = max(distinct.values()) if distinct else None
    if 'U-00' not in O: continue
    un = sum(1 for j in range(8) if lam(O['U-%02d' % j], 'pf_k0') < 0)
    print('| %s | %.4f | %s | %s | %d of %d | %s | %s | %s | %s | %s | %d of 8 | %s | %.3f | %s |' % (k[1:], r['twoa'], e(z['even']), e(z['odd']), neg, len(distinct), e(best),
          e(lam(O['SGN----'], 'pf_k0')), e(lam(O['SGN++-+'], 'pf_k0')), e(lam(O['DEL-0.75'], 'pf_k0')), e(lam(O['DEL-0.9'], 'pf_k0')), un, e(lam(O['WT'], 'pf_k0')),
          r['cramer']['pf']['prob_negative'], e(r['cramer']['primes_only_lam']['pf'])))
print('\nSame with the pole term kept (full form):\n')
print('| K | zeta even | zeta odd | sign patterns negative | Liouville | DEL-0.9 | U negative | Cramer P(negative) |')
print('|---|---|---|---|---|---|---|---|')
for k in Ks:
    r = R[k]; O = r['objects']; z = O['SGN++++']['full_k0']
    if 'U-00' not in O: continue
    vals = {n: lam(O[n], 'full_k0') for n in sgn if any(abs(O[n]['coef'][m] - O['SGN++++']['coef'][m]) > 1e-12 for m in O[n]['coef'])}
    print('| %s | %s | %s | %d of %d | %s | %s | %d of 8 | %.3f |' % (k[1:], e(z['even']), e(z['odd']), sum(1 for v in vals.values() if v < 0), len(vals), e(lam(O['SGN----'], 'full_k0')),
          e(lam(O['DEL-0.9'], 'full_k0')), sum(1 for j in range(8) if lam(O['U-%02d' % j], 'full_k0') < 0), r['cramer']['full']['prob_negative']))
print('\n## Table 2. Objects with a functional equation, own gamma factor, conductor and poles (full form; "pf" = own poles projected out)\n')
own = ['CHI-3', 'CHI5', 'DH', 'TNR-q2-c1.0', 'TNR-q2-c2.2', 'TNR-q3-c1.0', 'TNR-q3-c2.2', 'TNR-q5-c2.2', 'TNR-q7-c2.2', 'EA-1/8', 'EA-1/4']
print('| key | 2a | ' + ' | '.join(own) + ' | EA-1/8 pf | EA-1/4 pf | TNR-q2-c2.2 pf | TNR-q3-c2.2 pf |')
print('|---|---|' + '---|' * (len(own) + 4))
for k in Ss:
    r = R[k]; O = r['objects']
    print('| %s | %.4f | ' % (k, r['twoa']) + ' | '.join(e(lam(O[n], 'full_k0')) for n in own) + ' | %s | %s | %s | %s |' % (e(lam(O['EA-1/8'], 'pf_k0')), e(lam(O['EA-1/4'], 'pf_k0')), e(lam(O['TNR-q2-c2.2'], 'pf_k0')), e(lam(O['TNR-q3-c2.2'], 'pf_k0'))))
print('\n## Table 3. Admissible interval of one coefficient c(n), the others fixed (edges relative to the base value; Ritz: the true interval is contained in the one listed)\n')
for fam in ('ZETA_pf', 'ZETA_full', 'DH_own', 'CHI-3_own', 'CHI5_own'):
    print('\n**%s**\n' % fam)
    print('| K | 2a | base lambda_min | ' + ' | '.join('c(%d)' % n for n in range(2, 11)) + ' | scale |')
    print('|---|---|---|' + '---|' * 10)
    for k in Ks:
        if fam not in R[k]['admissible']: continue
        r = R[k]; A = r['admissible'][fam]
        cells = []
        for dn in ['e%d' % n for n in range(2, 11)] + ['scale']:
            if dn not in A['dirs']: cells.append(''); continue
            ed = A['dirs'][dn]
            cells.append('[%s, %s]' % (e(ed['-']['edge'], 1), e(ed['+']['edge'], 1)))
        print('| %s | %.4f | %s | ' % (k[1:], r['twoa'], e(min(A['base'].values()))) + ' | '.join(cells) + ' |')
    rk = [k for k in Ks if fam in R[k]['admissible'] and any(d.startswith('rand') for d in R[k]['admissible'][fam]['dirs'])]
    if rk:
        print('\nRandom unit directions in coefficient space (%s): smallest and largest half-width found\n' % fam)
        print('| K | directions | min half-width | median | max half-width |'); print('|---|---|---|---|---|')
        for k in rk:
            w = []
            for dn, ed in R[k]['admissible'][fam]['dirs'].items():
                if dn.startswith('rand'):
                    for s in '+-':
                        if ed[s]['edge'] is not None: w.append(abs(ed[s]['edge']))
                        else: w.append(float('inf'))
            w.sort()
            print('| %s | %d | %s | %s | %s |' % (k[1:], len(w) // 2, e(w[0]), e(w[len(w) // 2]), e(w[-1])))
print('\n## Table 4. Combination 2: full form, even block, c(2) replaced by x log 2 (other coefficients zeta\'s); residual = lambda_min, P_2 = x log 2 <v, R_2 v> on the minimiser\n')
for k in [kk for kk in ('a0.5', 'K2', 'K3', 'K4', 'K5') if kk in R]:
    r = R[k]
    print('\n%s (2a = %.4f, rungs %s)\n' % (k, r['twoa'], r['ns']))
    print('| x | residual (even) | P_2 | residual/P_2 | depth (digits) | full odd | pf even | pf odd |'); print('|---|---|---|---|---|---|---|---|')
    for row in sorted(r['combo2_scan'], key=lambda t: t['x_over_log2']):
        p2 = row['full_even_P2']; res = row['full_even']
        ratio = res / p2 if p2 else None
        depth = ('%.1f' % (-math.log10(ratio))) if (ratio and res > 0 and ratio > 0) else ('negative' if res < 0 else '-')
        print('| %.5f | %s | %s | %s | %s | %s | %s | %s |' % (row['x_over_log2'], e(res), e(p2), e(ratio), depth, e(row['full_odd']), e(row['pf_even']), e(row['pf_odd'])))
    O = r['objects']
    for nm in ('CHI-3', 'CHI5', 'DH', 'TNR-q2-c2.2', 'EA-1/8', 'EA-1/4'):
        rec = O[nm]['full_k0']; c2 = O[nm]['coef'].get('2', O[nm]['coef'].get(2))
        g = rec.get('g_even', {}); g2 = g.get('2', g.get(2, 0.0))
        p2 = c2 * g2
        print('\nown form %s: c(2)/log 2 = %.5f, residual even %s, P_2 %s, residual/|P_2| %s, odd %s' % (nm, c2 / math.log(2), e(rec['even']), e(p2), e(rec['even'] / abs(p2)) if p2 else '-', e(rec['odd'])))
print('\n## Table 5. Combination 4: lambda_min on pole-free subfamilies with k vanishing moments (k = 0,1,2,3)\n')
objs4 = [n for n in ['SGN++++', 'ZETA-P2ONLY', 'SGN-+++', 'SGN----', 'SGN+-++', 'DEL-0.9', 'U-00', 'WT', 'TNR-q2-c2.2', 'TNR-q3-c2.2', 'EA-1/8', 'DH', 'CHI-3', 'CHI5'] if n in R[Ss[0]]['objects']]
print('| 2a | ' + ' | '.join(objs4) + ' |'); print('|---|' + '---|' * len(objs4))
for k in Ss:
    r = R[k]; O = r['objects']
    cells = []
    for nm in objs4:
        var = 'pf' if 'pf_k0' in O[nm] else 'full'
        cells.append(' '.join(e(lam(O[nm], '%s_k%d' % (var, kk)), 1) for kk in range(4)))
    print('| %.4f | ' % r['twoa'] + ' | '.join(cells) + ' |')
if len(sys.argv) > 2:
    S = json.load(open(sys.argv[2]))
    print('\n## Table 6. Combination 3: Suzuki cell matrices H_{h,m}, h = log 2 / 2^k, coefficients to X = %g (support up to %.2f)\n' % (S['X'], math.log(S['X'])))
    ks = sorted(next(iter(S['objects'].values()))['levels'], key=int)
    print('| object | ' + ' | '.join('k = %s' % k for k in ks) + ' |'); print('|---|' + '---|' * len(ks))
    for nm, o in S['objects'].items():
        cells = []
        for k in ks:
            lv = o['levels'][k]
            if 'first_negative_m' in lv: cells.append('neg at W = %.3f (m = %d, %s)' % (lv['first_negative_support'], lv['first_negative_m'], e(lv['lam_min_there'], 1)))
            else: cells.append('pos to %.2f (%s)' % (lv['support_max'], e(lv['lam_min_at_mmax'], 1)))
        print('| %s | ' % nm + ' | '.join(cells) + ' |')
    print('\nzeta: threshold eps* for Psi - eps (|r| - log p)_+ (eps_plus) and Psi + eps (|r| - log p)_+ (eps_minus)\n')
    print('| k | m | support / log 2 | lambda_min | ' + ' | '.join('p = %d: eps+ / eps-' % p for p in (2, 3, 5, 7, 101)) + ' |'); print('|---|---|---|---|' + '---|' * 5)
    for row in S['zeta_eps']:
        cells = []
        for p in ('2', '3', '5', '7', '101'):
            if p in row['eps']: cells.append('%s / %s' % (e(row['eps'][p]['eps_plus'], 4), e(row['eps'][p]['eps_minus'], 3)))
            else: cells.append('')
        print('| %d | %d | %.3f | %s | ' % (row['k'], row['m'], row['support_over_log2'], e(row['lam_min_zeta'], 3)) + ' | '.join(cells) + ' |')
