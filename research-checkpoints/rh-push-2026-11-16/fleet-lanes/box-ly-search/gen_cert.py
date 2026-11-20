"""gen_cert.py <screen.jsonl> <tasks_out.jsonl> [maxN] [Tcap] : certified-test tasks from screen results.
FAIL candidates: the first clean bad block (and the first bad block).  PASS candidates: chunks of 250 up to Tcap."""
import json, sys
maxN = int(sys.argv[3]) if len(sys.argv) > 3 else 10 ** 9
Tcap = float(sys.argv[4]) if len(sys.argv) > 4 else 1e9
out = []
for l in open(sys.argv[1]):
    try: r = json.loads(l)
    except ValueError: continue
    t, res = r['task'], r['res']
    if 'error' in res or t['size'] > maxN: continue
    base = dict(scheme=t['scheme'], input=t['input'], size=t['size'], weight=t.get('weight', 'sharp'), Y=res['Y'])
    for k in ('pc',):
        if k in t: base[k] = t[k]
    cost = t['size'] * (1 + res['T1'] / 500)
    if res.get('first_bad'):
        seen = set()
        for fb in (res.get('first_bad_clean'), res.get('first_bad')):
            if fb and fb[0] not in seen:
                seen.add(fb[0])
                out.append((t['size'] * (1 + fb[0] / 500) * 0.01, dict(mode='fail', x=fb[0], **base)))
    else:
        x = res['T0']
        while x < min(res['T1'], Tcap) - 1e-9:
            x2 = min(x + 250, res['T1'], Tcap)
            out.append((t['size'] * (1 + x2 / 100) ** 2, dict(mode='pass', T0=round(x, 6), T1=round(x2, 6), **base)))
            x = x2
out.sort(key=lambda p: p[0])
with open(sys.argv[2], 'w') as f:
    for _, t in out:
        f.write(json.dumps(t) + '\n')
print(len(out), 'tasks', sum(1 for _, t in out if t['mode'] == 'fail'), 'fail')
