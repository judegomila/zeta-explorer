import json, math
d = json.load(open('fam_big_k6.json')); rows = {r['q']: r for r in d['rows']}
objs = ['ZETA', 'TNR-3-1.0', 'LIOU', 'SGNR', 'UNIR', 'TNR-2-2.2', 'TNR-3-2.2', 'DH']
def cell(r):
    if r['family_onset'] is None: s = '+%.2e' % r['lam_full_ld']
    else: s = 'neg from %.2f' % r['family_onset']
    if 'members' in r:
        mm = r['member_onsets_min_max']
        s += ' [members: none neg]' if not mm else ' [members: %d of %d neg, %.2f..%.2f]' % (r['members_negative'], r['members'], mm[0], mm[1])
    return s
sel = [5, 7, 11, 13, 19, 29] + [q for q in sorted(rows) if q in (31, 53, 73, 101, 127, 191, 257, 401, 563, 1009, 1013, 2003, 2011, 5003, 5009, 10007)]
qs = sorted(rows)
def near(t): return min(qs, key=lambda q: abs(q - t))
sel = sorted(set([5, 7, 11, 13, 19, 29, 31, 53, 73, 101, 127, 191, 257, 401] + [near(t) for t in (600, 1000, 2000, 3000, 5000, 7500)] + [10007]))
out = ['| q | ' + ' | '.join(objs) + ' |', '|---|' + '---|' * len(objs)]
for q in sel: out.append('| %d | ' % q + ' | '.join(cell(rows[q][o]) for o in objs) + ' |')
out.append('')
for o in objs:
    neg = [(q, rows[q][o]['family_onset']) for q in qs if rows[q][o]['family_onset'] is not None]
    pos = [rows[q][o]['lam_full_ld'] for q in qs if rows[q][o]['family_onset'] is None]
    mem = [(q, rows[q][o]) for q in qs if 'members' in rows[q][o]]
    gaps = [(q, r['family_onset'] - r['member_onsets_min_max'][0]) for q, r in mem if r['family_onset'] is not None and r['member_onsets_min_max']]
    out.append('- %s: family negative at %d of %d moduli%s; least positive full-support value %s; family onset minus first member onset (q = %s): %s' % (
        o, len(neg), len(qs), '' if not neg else ' (largest such q = %d)' % neg[-1][0], '%.3e' % min(pos) if pos else '-',
        ', '.join(str(q) for q, _ in mem), ', '.join('%+.2f' % g for _, g in gaps) if gaps else 'no member and no family onset'))
open('tables_family.md', 'w').write('Selected moduli (all %d moduli: `tables_family_k6_server.md`). Cell: least eigenvalue at full support if positive, else the least support with a negative eigenvalue.\n\n' % len(qs) + '\n'.join(out) + '\n')
print(open('tables_family.md').read())
