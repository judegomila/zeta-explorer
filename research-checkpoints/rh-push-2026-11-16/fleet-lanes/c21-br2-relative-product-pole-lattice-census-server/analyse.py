import json, sys, glob, os, math, statistics as st
def q(v, p):
    v = sorted(v); return v[min(len(v) - 1, int(p * len(v)))]
class S2:
    @staticmethod
    def mean(v):
        v = list(v); return math.fsum(v) / len(v)
    @staticmethod
    def pstdev(v):
        v = list(v); mu = math.fsum(v) / len(v); return math.sqrt(math.fsum((x - mu) ** 2 for x in v) / len(v))
st = S2
def summ(pts, key='ols'):
    if not pts: return None
    bad = [p['label'] for p in pts if not (math.isfinite(p[key][0]) and math.isfinite(p[key][1]))]
    pts = [p for p in pts if math.isfinite(p[key][0]) and math.isfinite(p[key][1])]
    if bad: print('   NONFINITE', key, len(bad), bad[:5])
    if not pts: return dict(n=0, nonfinite=len(bad))
    nbad = len(bad)
    m = [p[key][0] for p in pts]; r = [p[key][1] for p in pts]
    pos = sum(1 for p in pts if p[key][0] - p[key][1] > 0)
    neg = sum(1 for p in pts if p[key][0] + p[key][1] <= 0)
    return dict(n=len(pts), nonfinite=nbad, pos=pos, neg=neg, undec=len(pts) - pos - neg, mean=round(st.mean(m), 4),
                sd=round(st.pstdev(m), 4), min=round(min(m), 4), med=round(q(m, .5), 4), max=round(max(m), 4),
                maxrad=max(r))
out = {}
DIR = sys.argv[1] if len(sys.argv) > 1 else 'out'
for f in sorted(glob.glob(DIR + '/*.json')):
    name = os.path.basename(f)[:-5]
    if name.startswith('test'): continue
    d = json.load(open(f)); m = d['meta']; R = d['res']; print('load', name)
    row = dict(n=m['n'], n_exact=m['n_exact'], j=[m['jmin'], m['jmax']], maxtail=max(m['tails']), dups=m['dups'],
               seconds=m['seconds'], act_last=m['act'][-1])
    a = R['a']
    row['t0'] = dict(ols=a[0]['ols'], y_first=a[0]['y0'], y_last=a[0]['y1']) if a else None
    row['a_poles'] = summ(a[1:]); row['a_poles_hi'] = summ(a[1:], 'hi'); row['a_poles_lo'] = summ(a[1:], 'lo')
    row['a_sec'] = summ(a[1:], 'sec')
    row['a_by_prime'] = {}
    for p in a[1:]:
        row['a_by_prime'].setdefault(p['label'].rsplit('_', 1)[0], []).append([round(p['ols'][0], 3), float('%.1e' % p['ols'][1])])
    row['Ls_first'] = m['Ls_first'][:8]; row['version'] = m.get('version', 1)
    row['b'] = summ(R['b']); row['b_hi'] = summ(R['b'], 'hi'); row['b_sec'] = summ(R['b'], 'sec')
    if R['b']:
        fb = [p for p in R['b'] if math.isfinite(p['y1'][0]) and math.isfinite(p['y1'][1])]
        row['b_y_last'] = dict(mean=round(st.mean(p['y1'][0] for p in fb), 3), sd=round(st.pstdev([p['y1'][0] for p in fb]), 3),
                               min=round(min(p['y1'][0] for p in fb), 3), max=round(max(p['y1'][0] for p in fb), 3),
                               maxrad=max(p['y1'][1] for p in fb), medrad=q([p['y1'][1] for p in fb], .5))
        row['b_range'] = dict(ymax=round(max(p['ymax'] for p in R['b']), 3), ymin=round(min(p['ymin'] for p in R['b']), 3))
    row['c'] = summ(R['c']); row['c_hi'] = summ(R['c'], 'hi')
    if R['c']:
        fc = [p for p in R['c'] if math.isfinite(p['y1'][0])]
        row['c_y_last'] = dict(mean=round(st.mean(p['y1'][0] for p in fc), 3), sd=round(st.pstdev([p['y1'][0] for p in fc]), 3))
    row['a_table'] = [(p['label'], round(p['t'], 6), round(p['ols'][0], 4), '%.1e' % p['ols'][1], round(p['lo'][0], 3), round(p['hi'][0], 3), round(p['y1'][0], 3)) for p in a]
    if 'hq1lit' in R:
        h = R['hq1lit']
        row['hq1lit_poles'] = [(x['label'], round(x['sec'][0], 4)) for x in h[:8]]
        g = [x['sec'][0] for x in h[8:]]
        row['hq1lit_generic'] = dict(n=len(g), min=min(g), max=max(g)) if g else None
    out[name] = row
json.dump(out, open('summary_%s.json' % DIR, 'w'), indent=1)
for k, r in out.items():
    print('==', k, 'n', r['n'], 'exact', r['n_exact'], 'j', r['j'], 'tail', '%.2e' % r['maxtail'], 'sec', r['seconds'])
    print('  t=0:', r['t0'])
    print('  poles(t!=0) ols', r['a_poles']); print('  poles hi-half ', r['a_poles_hi']); print('  by prime', r['a_by_prime'])
    print('  generic ols  ', r['b']); print('  generic hi   ', r['b_hi']); print('  generic y_last', r.get('b_y_last'), r.get('b_range'))
    print('  zeros ols    ', r['c'], r.get('c_y_last'))
    if 'hq1lit_poles' in r: print('  hq1 literal', r['hq1lit_poles'], r['hq1lit_generic'])
