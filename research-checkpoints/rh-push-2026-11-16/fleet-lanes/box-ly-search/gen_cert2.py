"""gen_cert2.py <out.jsonl> <screen files...>: certified tasks from the later screen stages.
Order: (1) FAIL candidates (first 3 bad blocks of every failing record), (2) PASS chunks of 250 for clean records,
smallest N x height first."""
import json, sys
fails, passes = [], []
seenf = set()
for fn in sys.argv[2:]:
    for l in open(fn):
        try: r = json.loads(l)
        except ValueError: continue
        t, res = r['task'], r['res']
        if 'error' in res: continue
        base = dict(scheme=t['scheme'], input=t['input'], size=t['size'], weight=t.get('weight', 'sharp'), Y=res['Y'])
        if base['weight'].startswith('riesz') and not base['weight'][5:].isdigit():
            continue                                  # fractional orders: screen only
        if res.get('bad'):
            for b in res['bad'][:3]:
                k = (json.dumps(base, sort_keys=True), b[0])
                if k in seenf: continue
                seenf.add(k)
                fails.append((b[0] * 1e-9 + t['size'], dict(mode='fail', x=b[0], **base)))
        elif t['size'] <= 400:
            x = res['T0']
            while x < res['T1'] - 1e-9:
                x2 = min(x + 250, res['T1'])
                pri = t['size'] * (1 + x2 / 2000)
                if t['input'] in ('zeta', 'chi4'): pri *= 0.3
                passes.append((pri, dict(mode='pass', T0=round(x, 6), T1=round(x2, 6), **base)))
                x = x2
fails.sort(key=lambda p: p[0]); passes.sort(key=lambda p: p[0])
with open(sys.argv[1], 'w') as f:
    for _, t in fails + passes:
        f.write(json.dumps(t) + '\n')
print(len(fails), 'fail tasks', len(passes), 'pass tasks')
