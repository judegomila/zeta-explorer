#!/usr/bin/env python3
"""Summary table from sweep JSON lines.   python summary.py results/box.jsonl [more.jsonl ...] [--md out.md]

For each scheme variant and input: the largest size with verdict PASS, the largest size below which every
tested size passes, and the first size with verdict FAIL (with the certified bracket for the lowest
off-axis zero).  Columns marked 'high' use the window Tlo <= |Re z| <= T only (default Tlo = 10)."""
import json, sys, collections


def variant(t):
    s = t['scheme']
    if s == 'jensen':
        return 'jensen n=%d' % t.get('shift', 0)
    if s == 'afe':
        return 'afe/%s T=%g' % (t['weight'], t['T'])
    if s == 'dbn':
        return 'dbn lam=%s T=%g' % (t['lam'], t['T'])
    if s == 'bohr':
        return 'bohr/%s' % t['kind']
    if s == 'thalf':
        return 'thalf T=8(N+1)^2+20 capped'
    return '%s T=%g' % (s, t['T'])


def main():
    files = [a for a in sys.argv[1:] if not a.startswith('--')]
    md = sys.argv[sys.argv.index('--md') + 1] if '--md' in sys.argv else None
    if md in files:
        files.remove(md)
    rows = collections.defaultdict(dict)
    stat = collections.Counter()
    secs = collections.defaultdict(float)
    for f in files:
        for line in open(f):
            try:
                r = json.loads(line)
            except ValueError:
                continue
            t = r['task']
            stat[r['status']] += 1
            secs[t['scheme']] += r.get('seconds', 0)
            rows[(variant(t), t['input'])][t['size']] = r          # later lines override earlier ones
    out = []
    out.append('| scheme variant | input | sizes tested | largest PASS | all PASS up to | first FAIL (lowest off-axis Re z in) '
               '| high window: largest PASS | high: first FAIL | other |')
    out.append('|---|---|---|---|---|---|---|---|---|')
    for (v, inp) in sorted(rows):
        rs = rows[(v, inp)]
        sizes = sorted(rs)
        ver, verh, loc, other = {}, {}, {}, collections.Counter()
        for s in sizes:
            r = rs[s]
            res = r.get('result') or {}
            if r['status'] != 'OK':
                other[r['status']] += 1
                continue
            ver[s] = res.get('verdict')
            verh[s] = (res.get('high') or res).get('verdict')
            if res.get('lowest_offaxis_re_in'):
                loc[s] = res['lowest_offaxis_re_in']
            if ver[s] == 'UNRESOLVED':
                other['UNRESOLVED'] += 1

        def stats(vd):
            ps = [s for s in sizes if vd.get(s) == 'PASS']
            fs = [s for s in sizes if vd.get(s) == 'FAIL']
            upto = None
            for s in sizes:
                if vd.get(s) == 'PASS':
                    upto = s
                else:
                    break
            return (max(ps) if ps else '-', upto if upto is not None else '-', min(fs) if fs else '-')
        mp, up, ff = stats(ver)
        mph, _, ffh = stats(verh)
        extra = ''
        if ff != '-' and ff in loc:
            extra = ' (%.3g, %.3g)' % tuple(loc[ff])
        if v.startswith('bohr'):
            vals = ['%s:t_stab=%.3g' % (s, (rs[s]['result'] or {}).get('t_stab', float('nan'))) for s in sizes
                    if rs[s]['status'] == 'OK']
            oth = '; '.join(vals[:4] + (['...'] if len(vals) > 5 else []) + vals[-1:])
        else:
            oth = ', '.join('%s x%d' % kv for kv in other.items())
        out.append('| %s | %s | %s | %s | %s | %s%s | %s | %s | %s |' % (
            v, inp, ','.join(map(str, sizes)), mp, up, ff, extra, mph, ffh, oth))
    out.append('')
    out.append('status counts: ' + ', '.join('%s %d' % kv for kv in sorted(stat.items())))
    out.append('task seconds by scheme: ' + ', '.join('%s %.0f' % kv for kv in sorted(secs.items())))
    txt = '\n'.join(out)
    print(txt)
    if md:
        open(md, 'w').write(txt + '\n')


if __name__ == '__main__':
    main()
