import json, collections
def rows(f):
    try: return [json.loads(l) for l in open(f)]
    except Exception: return []
print('== c3 A: P13 triangle certificate (t = 0.1607, y0), N = 690988 | 728999')
seen = set()
for r in rows('out/c3_A.jsonl'):
    if r['N'] in (690988, 728999):
        print('  %-11s %-5s N=%d  T = %+.12f  margin %+.6e  share of abs sum from n with a prime factor > 13: %.4f' % (r['obj'], r['moll'], r['N'], r['T'], r['margin'], r['share_rough']))
print('== c3 B: P97 orbit, 1000 points per window (t = 0.132, y = 0.12649)')
for r in rows('out/c3_B.jsonl'):
    print('  %-11s %-5s N=%-9d minRe P100 %.4f  max|T| %.4f  rms T_smooth %.4f  rms T_rough %.4f  max|T_rough| %.4f  min Re(EF) %+.4f  min|EF| %.4f  min|F| %.4f' % (r['obj'], r['moll'], r['N'], r['minRe_P100'], r['max_absT'], r['rms_Tsmooth'], r['rms_Trough'], r['max_Trough'], r['minRe_full'], r['min_abs_full'], r['min_abs_F']))
print('== c3 D: time scan at N = 690988')
d = collections.defaultdict(dict)
for r in rows('out/c3_D.jsonl'): d[(r['obj'], r['moll'])][r['t']] = r
for r in rows('out/c3_B.jsonl'):
    if r['N'] == 690988 and (r['obj'], r['moll']) in d: d[(r['obj'], r['moll'])][r['t']] = r
for k, v in d.items():
    print('  %-11s %-5s ' % k + '  '.join('t=%.2f: minRe %+.3f max|T| %.3f min|F| %.3f' % (t, v[t]['minRe_full'], v[t]['max_absT'], v[t]['min_abs_F']) for t in sorted(v, reverse=True)))
print('== c4: window minimum against the bounds (t = 0.16125, y = 0.1808, 1e4 points per window)')
c = collections.defaultdict(dict)
for r in rows('out/c4_x.jsonl'): c[(r['obj'], r['moll'], r['t'])][r['N']] = r
for k, v in c.items():
    print('  %s %s t=%g' % k)
    for N in sorted(v):
        r = v[N]
        print('     N=%-9d tri %+.4f  two %+.4f  chan_min %.4f  true_min %.4f  true/two %s  true/tri %s  lemma %s' % (N, r['tri'], r['two'], r['chan_min'], r['true_min'], '%.2f' % r['ratio_true_two'] if r['ratio_true_two'] else '-', '%.2f' % r['ratio_true_tri'] if r['ratio_true_tri'] else '-', r['lemma_ok']))
