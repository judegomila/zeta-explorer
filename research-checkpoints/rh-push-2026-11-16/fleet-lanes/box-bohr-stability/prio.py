import json, re
A = json.load(open('tasksAll.json'))
def rnd(t):
    m = re.match(r'rand(\d+)', t.get('tag', '') or ''); return int(m.group(1)) if m else -1
def pr(t):
    k, sch, inp, N = t['kind'], t.get('scheme'), t.get('inp'), t.get('size', 0)
    T1 = t.get('T1', 0)
    if k in ('s1zero', 's1pass'): return 0
    if k == 'dwin':
        if t.get('phi'): return 1 if (N <= 40 and rnd(t) < 10) else None
        return 1 if N <= (200 if inp == 'dh' else 100) else 9
    if k == 'winpt':
        if N < 10 or not t.get('phi'): return 2
        tag = t.get('tag', '')
        return 2 if (rnd(t) in (0, 1) or tag.startswith('near') or (tag == 'line2' and abs(t['phi']['2'] - 3.14159) < 0.01)) else None
    if sch == 'ladder': return 3 if T1 < 1100 else 8
    if sch == 'true': return 3 if (inp == 'zeta' or T1 < 1100) else None
    if sch == 'euler':
        if t.get('phi'): return 4 if rnd(t) < 20 else None
        if inp == 'zeta': return 4
        return 5 if T1 < 1100 else None
    if sch == 'afe' and t.get('phi'): return 6 if (N <= 20 and rnd(t) < 12) else None
    if sch == 'afe' and abs(t['T2'] - T1 - 50) < 1e-6: return 6 if (N <= 2 or T1 < 1100) else None
    if sch == 'afe':
        lim = {'zeta': 120, 'dh': 240}.get(inp, 60)
        return 7 if N <= lim else None
    return 9
buckets = {}
for t in A:
    p = pr(t)
    if p is not None: buckets.setdefault(p, []).append(t)
for p in buckets:
    buckets[p].sort(key=lambda t: (t.get('size', 0) * (t.get('T2', 0) - t.get('T1', 0))) if p in (1, 7) else t.get('T1', 0))
out = list(buckets.pop(0, []))
keys = sorted(buckets); idx = {p: 0 for p in keys}
blk = {1: 80, 2: 6, 3: 30, 4: 40, 5: 20, 6: 20, 7: 8, 8: 10, 9: 10}
while any(idx[p] < len(buckets[p]) for p in keys):
    for p in keys:
        out.extend(buckets[p][idx[p]:idx[p] + blk[p]]); idx[p] += blk[p]
json.dump(out, open('tasksP.json', 'w'))
print(len(out), {p: len(v) for p, v in buckets.items()})
