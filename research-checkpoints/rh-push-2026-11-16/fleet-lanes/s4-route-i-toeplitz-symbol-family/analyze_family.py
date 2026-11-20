"""Table for combination 4 from family.py output. usage: analyze_family.py file.json [file2.json ...]"""
import sys, json, math
for fn in sys.argv[1:]:
    d = json.load(open(fn)); rows = d['rows']
    objs = [k for k in rows[0] if k != 'q']
    print('\n### %s: X = %g, mesh h = %.5f, cells M = %d (support %.2f)\n' % (fn, d['X'], d['h'], d['M'], d['M'] * d['h']))
    print('| q | ' + ' | '.join(objs) + ' |'); print('|---|' + '---|' * len(objs))
    def cell(r):
        if r['family_onset'] is None: s = 'pos to %.2f (%.2e)' % (r['support'], r['lam_full_ld'])
        else: s = 'neg from %.3f (%.1e)' % (r['family_onset'], r['rayleigh_ld_at_onset'])
        if 'members' in r:
            mm = r['member_onsets_min_max']
            s += '; members: %d of %d neg' % (r['members_negative'], r['members']) + ('' if not mm else ', first %.3f, last %.3f' % (mm[0], mm[1]))
        return s
    for row in rows:
        print('| %d | ' % row['q'] + ' | '.join(cell(row[o]) for o in objs) + ' |')
    # summary
    print('\nSummary:')
    for o in objs:
        neg = [(r['q'], r[o]['family_onset']) for r in rows if r[o]['family_onset'] is not None]
        pos = [r['q'] for r in rows if r[o]['family_onset'] is None]
        viol = [r['q'] for r in rows if 'members' in r[o] and r[o]['family_onset'] is not None and (r[o]['member_onsets_min_max'] is None or r[o]['family_onset'] < r[o]['member_onsets_min_max'][0] - 1e-9)]
        lmin = min((r[o]['lam_full_ld'] for r in rows if r[o]['family_onset'] is None), default=None)
        print('- %s: family negative for %d of %d moduli%s; positive at full support for q in %s%s; family onset below the first member onset: %s' % (
            o, len(neg), len(rows), '' if not neg else ' (largest such q = %d, onset there %.2f)' % (neg[-1][0], neg[-1][1]),
            ('[%d..%d] (%d moduli)' % (pos[0], pos[-1], len(pos)) if pos else 'none'), '' if lmin is None else ', least lambda_min %.3e' % lmin, viol if viol else 'never'))
