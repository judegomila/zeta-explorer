"""Large-height table: per (scheme, input, weight, N): height screened without a bad block / first bad block,
count of bad blocks, certified FAIL heights (Arb) and certified PASS coverage."""
import json, glob, collections
S = collections.defaultdict(list)
for fn in ['results/box/screen_stage5.jsonl', 'results/box/screen_stage6.jsonl', 'results/box/screen_stage3.jsonl']:
    try: f = open(fn)
    except OSError: continue
    for l in f:
        try: r = json.loads(l)
        except ValueError: continue
        t, s = r['task'], r['res']
        if 'error' in s: continue
        S[(t['scheme'], t['input'], t.get('weight'), t['size'])].append((s['T0'], s['T1'], s['n_bad'], [b[0] for b in s['bad']]))
CF = collections.defaultdict(set); CP = collections.defaultdict(list)
for fn in glob.glob('results/box/cert_3*.jsonl') + ['results/cert_s5_local.jsonl']:
    try: f = open(fn)
    except OSError: continue
    for l in f:
        try: r = json.loads(l)
        except ValueError: continue
        t, v = r['task'], r['res'].get('verdict')
        k = (t['scheme'], t['input'], t.get('weight'), t['size'])
        if t['mode'] == 'fail' and v == 'FAIL': CF[k].add(t['x'])
        if t['mode'] == 'pass' and v == 'PASS': CP[k].append((t['T0'], t['T1']))
def union_len(iv):
    iv = sorted(iv); tot = 0; cur = None
    for a, b in iv:
        if cur is None: cur = [a, b]
        elif a <= cur[1] + 1e-6: cur[1] = max(cur[1], b)
        else: tot += cur[1] - cur[0]; cur = [a, b]
    if cur: tot += cur[1] - cur[0]
    return tot
print('| scheme | input | weight | N | height screened (float64) | bad blocks | lowest bad block | certified off-axis zero (Arb) at blocks x | certified PASS, total height covered |')
print('|---|---|---|---|---|---|---|---|---|')
for k in sorted(S, key=lambda k: (k[0], k[1], k[2], k[3])):
    w = sorted(S[k]); Tmax = max(x[1] for x in w); cov = union_len([(a, b) for a, b, _, _ in w])
    nb = sum(x[2] for x in w); allbad = sorted(b for x in w for b in x[3])
    cf = sorted(CF.get(k, []))
    print('| %s | %s | %s | %d | %.3g (to %.3g) | %d | %s | %s | %s |' % (k[0], k[1], k[2], k[3], cov, Tmax, nb, (allbad[0] if allbad else 'none'),
          (', '.join('%.2f' % x for x in cf[:3]) + (' (+%d)' % (len(cf) - 3) if len(cf) > 3 else '')) if cf else '-', ('%.0f' % union_len(CP[k]) if CP.get(k) else '-')))
