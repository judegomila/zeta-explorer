import json, collections, glob, os, math
def load(pat):
    out = []
    for f in sorted(glob.glob(pat)):
        for ln in open(f):
            try: out.append(json.loads(ln))
            except Exception: pass
    return out
print('=== S1 screen (GPU): first size with a zero at x >= 0; x_sup at largest size')
rows = collections.defaultdict(dict)
for d in load('results/big_s1.jsonl'):
    k = d['key'].split('|'); rows[(k[1], k[2], k[4])][int(k[3])] = d
for key in sorted(rows):
    r = rows[key]; sz = sorted(r)
    ff = next((s for s in sz if r[s]['n_zero_xge0'] > 0), None)
    lastpass = max([s for s in sz if r[s]['n_zero_xge0'] == 0], default=None)
    print(key, 'sizes', sz[0], '-', sz[-1], '| first fail', ff, 'x_sup', ff and round(r[ff]['x_sup'], 4), '| largest passing size', lastpass,
          '| x_sup(max size)', r[sz[-1]]['x_sup'] and round(r[sz[-1]]['x_sup'], 4), '| min|D| torus random (max size)', round(r[sz[-1]]['min_abs_random_torus'], 4))
    if key[0] == 'afe':
        print('    x_sup by size:', ' '.join(f"{s}:{r[s]['x_sup']:.3f}" for s in sz if r[s]['x_sup'] is not None and s in (3,4,5,6,8,10,12,16,20,24,28,31,32,36,40,44,48)))
print('\n=== S1 exact certificates')
ex = load('results/exact*.jsonl')
c = collections.defaultdict(list)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] in ('s1zero', 's1pass'):
        c[(t['kind'], t['scheme'], t['inp'], t.get('K'), t.get('weight', 'sharp'))].append((t['size'], r['verdict']))
for k in sorted(c, key=str):
    v = sorted(c[k]); cnt = collections.Counter(x[1] for x in v)
    print(k, dict(cnt), 'sizes', [x[0] for x in v][:60], 'unresolved sizes', [x[0] for x in v if x[1] in ('UNRESOLVED', 'ERROR', 'SKIPPED')][:20])
print('\n=== matched AFE windows, screen (GPU): N range, first N with off-line zeros, totals')
m = collections.defaultdict(dict)
for d in load('results/big_matched.jsonl'):
    k = d['key'].split('|'); m[k[1]][int(k[2])] = d
for inp, r in m.items():
    Ns = sorted(r); ff = next((n for n in Ns if r[n]['off'] > 0), None)
    tot = sum(r[n]['tot'] for n in Ns); off = sum(r[n]['off'] for n in Ns)
    print(inp, 'N', Ns[0], '-', Ns[-1], 'first fail N', ff, 'windows with off', sum(1 for n in Ns if r[n]['off'] > 0), '/', len(Ns), 'tot zeros', tot, 'off', off, 'frac %.5f' % (off / max(tot, 1)), 'unresolved', sum(1 for n in Ns if not r[n]['resolved']),
          'max t %.0f' % r[Ns[-1]]['tb'])
    for lo, hi in ((1, 10), (11, 30), (31, 100), (101, 200), (201, 400), (401, 600)):
        sel = [n for n in Ns if lo <= n <= hi]
        if sel:
            t = sum(r[n]['tot'] for n in sel); o = sum(r[n]['off'] for n in sel)
            print('     N %d-%d: off/tot = %d/%d = %.5f' % (sel[0], sel[-1], o, t, o / max(t, 1)))
print('\n=== exact windows')
res = collections.defaultdict(list)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] not in ('win', 'winpt'): continue
    isgrid = abs(t['T2'] - t['T1'] - 50) < 1e-6 or t['kind'] == 'winpt'
    if t.get('phi'):
        key = ('translate', t['kind'], t['scheme'], t['inp'], t['size'], t.get('K'), (t.get('tag') or '').rstrip('0123456789'))
    elif t['scheme'] == 'afe' and not isgrid:
        key = ('matched', t['inp'])
    else:
        key = ('grid', t['kind'], t['scheme'], t['inp'], t['size'], t.get('K'))
    res[key].append((t['size'] if key[0] == 'matched' else t['T1'], r['verdict'], r.get('n_up', 0), r.get('n_tot', 0), r.get('n_real', 0)))
for k in sorted(res, key=str):
    v = sorted(res[k])
    P = [x for x in v if x[1].startswith('PASS')]; Fl = [x for x in v if x[1].startswith('FAIL')]; U = [x for x in v if not (x[1].startswith('PASS') or x[1].startswith('FAIL'))]
    # contiguous range from the start
    print(k, 'n', len(v), 'range', round(v[0][0], 1), '-', round(v[-1][0], 1), 'PASS', len(P), 'FAIL', len(Fl), 'UNRES', len(U),
          'first FAIL', Fl and round(Fl[0][0], 1), 'last FAIL', Fl and round(Fl[-1][0], 1), 'first UNRES', U and round(U[0][0], 1),
          'tot zeros', sum(x[3] or 0 for x in v), 'non-real', sum((x[3] or 0) - (x[4] or 0) for x in Fl))
for name in ('fixed', 'euler', 'translate'):
    print('\n=== screen', name)
    for d in load(f'results/big_{name}.jsonl'):
        print(d['key'], {k: v for k, v in d.items() if k not in ('key', 'rows', 'line2', 'gpu')}, ('line2 off: ' + ' '.join(str(x[3]) for x in d['line2'])) if 'line2' in d else '')

print('\n=== zeros of the sharp main sum D_N right of 1/2 + x0 in the matched window (certified)')
dw = collections.defaultdict(lambda: collections.defaultdict(dict))
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] != 'dwin' or 'n_right' not in r: continue
    who = t['inp'] + ('+rand' if t.get('phi') else '')
    dw[who][t['x0']].setdefault(t['size'], []).append(r['n_right'])
for who in sorted(dw):
    for x0 in sorted(dw[who]):
        r = dw[who][x0]; Ns = sorted(r)
        first = next((n for n in Ns if max(r[n]) > 0), None)
        line = []
        for lo, hi in ((1, 5), (6, 10), (11, 20), (21, 40), (41, 80), (81, 150), (151, 400)):
            sel = [n for n in Ns if lo <= n <= hi]
            if sel: line.append('N%d-%d: %.2f' % (lo, sel[-1], sum(sum(r[n]) / len(r[n]) for n in sel) / len(sel)))
        print(who, 'x0', x0, 'N', Ns[0], '-', Ns[-1], 'first N with a zero', first, 'windows zero-free', sum(1 for n in Ns if max(r[n]) == 0), '/', len(Ns), '| mean zeros per window:', ' '.join(line))
print('\n=== theta form (b), point-sampled totals + certified sign changes: per window (n_tot in |Im z|<1, n_real)')
tw = collections.defaultdict(dict)
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] != 'winpt' or 'n_tot' not in r: continue
    tag = (t.get('tag') or 'diag'); tagc = tag.rstrip('0123456789') if tag.startswith('rand') else tag
    tw[(t['inp'], t['size'], tagc)].setdefault(round(t['T1']), []).append((r['n_tot'], r['n_real']))
for k in sorted(tw, key=str):
    r = tw[k]
    print(k, ' '.join('%d:[%s]' % (T1, ('%d/%d' % r[T1][0]) if len(r[T1]) == 1 else 'tot %.1f real %.1f rr %d/%d' % (sum(x[0] for x in r[T1]) / len(r[T1]), sum(x[1] for x in r[T1]) / len(r[T1]), sum(1 for x in r[T1] if x[0] == x[1]), len(r[T1]))) for T1 in sorted(r)))
