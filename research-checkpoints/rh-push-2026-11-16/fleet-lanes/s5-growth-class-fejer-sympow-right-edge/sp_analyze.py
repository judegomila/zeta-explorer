"""s5 Speiser companion: summary of the windings of F' in [0.01, 1/2] x [T, T+10] (out/sp_*.log, out/sp_*.json; s2 files for T < 2000.5)."""
import json, re, os
def parse(f, lo=None, hi=None):
    rows = {}
    for l in open(f):
        m = re.match(r'(\w+) T ([\d.]+) winding (-?[\d.]+) count (-?\d+) roots\s+maxstep ([\d.]+) evals (\d+)/', l)
        if m:
            T = float(m.group(2))
            if (lo is None or T >= lo) and (hi is None or T < hi): rows[T] = (float(m.group(3)), int(m.group(4)), float(m.group(5)), int(m.group(6)))
    return rows
out = {}
z = parse('out/sp_ZETA.log'); l4 = parse('out/sp_L4.log')
dh = parse('out/sp_DH.log', 2000.5, 8000.5); dh.update(parse('out/sp_DH_hi.log', 8000.5, 10000.5))
for nm, r in (('ZETA 2000.5..10000.5', z), ('L4 0.5..10000.5', l4), ('DH 2000.5..10000.5', dh)):
    Ts = sorted(r); gaps = [b - a for a, b in zip(Ts[:-1], Ts[1:])]
    tot = sum(v[1] for v in r.values())
    out[nm] = {'windows': len(r), 'contiguous': all(abs(g - 10) < 1e-9 for g in gaps), 'T_first': Ts[0], 'T_last': Ts[-1], 'zeros_of_Fprime': tot, 'max_winding_residual': max(abs(v[0] - v[1]) for v in r.values()),
               'max_step': max(v[2] for v in r.values()), 'evaluations': sum(v[3] for v in r.values())}
    if nm.startswith('DH'):
        per = {}
        for T, v in r.items(): per[int((T - 0.5) // 1000)] = per.get(int((T - 0.5) // 1000), 0) + v[1]
        out[nm]['per_1000'] = {('%d..%d' % (1000 * k, 1000 * k + 1000)): per[k] for k in sorted(per)}
        out[nm]['lowest_window_with_zero'] = min(T for T, v in r.items() if v[1] > 0); out[nm]['max_per_window'] = max(v[1] for v in r.values())
    print(nm, json.dumps(out[nm]))
s2 = '../s2-derivative-zeros-two-line/out/t1_summary.json'
if os.path.exists(s2):
    print('s2 summary keys:', list(json.load(open(s2)).keys())[:12])
json.dump(out, open('out/sp_summary.json', 'w'), indent=1)
