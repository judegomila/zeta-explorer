"""Fill the table slots of RESULT.md from server/*.jsonl and local files."""
import json, os, math
def load(fn): return [json.loads(l) for l in open(fn) if l.startswith('{')] if os.path.exists(fn) else []
S = 'server/'
# ---------- C1
rows = load(S + 'c1.jsonl') + load(S + 'c1c.jsonl') + load(S + 'c1d.jsonl') + load(S + 'c1h.jsonl') + load('local_c1_heat.jsonl')
best = {}
for r in rows:
    k = (r['code'], int(r['family'][4:]))
    def score(x): return (x['first_negative'] is not None, x['undecided_at'] is None, x['n'], x['bits'])
    if k not in best or score(r) > score(best[k]): best[k] = r
cols = ['ZETA', 'LCHI4', 'LCHI5', 'DH', 'PL:ZETA:0.30851718:85.69934849', 'EA-1/8', 'EA-1/4', 'TNR', 'HEAT-0.5']
names = ['zeta', 'L(chi_-4)', 'L(chi_5)', 'DH', 'zeta + quadruple at 85.70', 'E_a, a=1/8', 'E_a, a=1/4', 'T-NR', 'heat -0.5']
ms = sorted({k[1] for k in best})
def horizon(h, rc):
    target = 2 * math.pi ** 2 * rc / h; lo = 2 * math.pi; hi = 1e30
    for _ in range(200):
        mid = math.sqrt(lo * hi)
        if mid * math.log(mid / (2 * math.pi)) < target: lo = mid
        else: hi = mid
    return lo
def cell(r):
    if r is None: return ''
    if r['first_negative'] is not None: return 'NEG k=%d (nu=%.3g) 2^%d' % (r['first_negative'], r['first_negative_node'], round(r['first_negative_log2']))
    tag = '' if r['n'] == 24 * int(r['family'][4:]) + 1 else ' [first %d nodes]' % r['n']
    if r['undecided_at'] is not None: return '+ to k=%d (undecided beyond)%s' % (r['undecided_at'], tag)
    if r.get('log2_lambda_min') is not None: return '+ lmin 2^%d' % round(r['log2_lambda_min'])
    return '+ piv 2^%d%s' % (round(r['min_log2_pivot']), tag)
t = ['| m | n | bits (zeta) | law T, r_c = 0.5 / 0.7 | ' + ' | '.join(names) + ' |', '|' + '---|' * (4 + len(names))]
for m in ms:
    h = math.log(2) / m; z = best.get(('ZETA', m))
    t.append('| %d | %d | %s | %.1f / %.1f | ' % (m, 24 * m + 1, z['bits'] if z else '', horizon(h, .5), horizon(h, .7)) + ' | '.join(cell(best.get((c, m))) for c in cols) + ' |')
C1 = '\n'.join(t)
extra = [r for r in rows if r['code'].startswith('PL:') and '85.699' not in r['code'] or r['code'].startswith('PL:LCHI')]
x = ['', 'Planted quadruples (delta = 0.3085) on the lattice m = 64, first 520 nodes (nu <= 279), 16000 bits (zeta) / 8000 bits:', '', '| base | gamma | first negative pivot: n | node | log2 size |', '|---|---|---|---|---|']
for r in extra:
    _, b, d, g = r['code'].split(':')
    x.append('| %s | %s | %s | %s | %s |' % (b, g, r['first_negative'] + 1 if r['first_negative'] is not None else 'none to n = %d' % r['done'], '%.3g' % r['first_negative_node'] if r['first_negative'] is not None else '', round(r['first_negative_log2']) if r['first_negative'] is not None else ''))
C1 += '\n'.join(x)
# ---------- C2
rows = load(S + 'c2.jsonl'); t = ['| object | p | n run | bits | nu_max | outcome | first negative: n, node, n/gamma | log2 pivot | pi gamma/(4 ln 2) |', '|---|---|---|---|---|---|---|---|---|']
for r in rows:
    g = float(r['code'].split(':')[-1]) if r['code'].startswith('PL:') else None
    name = r['code'] if g is None else 'zeta + quadruple at %g' % g
    if r['first_negative'] is not None:
        n1 = r['first_negative'] + 1
        gg = g if g else {'DH': 85.699, 'EA-1/8': 14.135, 'TNR': 2.860}.get(r['code'])
        out = 'negative'; fn = '%d, %.4g, %s' % (n1, r['first_negative_node'], ('%.2f' % (n1 / gg)) if gg else ''); lp = round(r['first_negative_log2']); ref = ('%.0f' % (math.pi * gg / (4 * math.log(2)))) if gg else ''
    else:
        out = 'positive to n = %d' % (r['undecided_at'] if r['undecided_at'] is not None else r['n']); fn = ''; lp = ''; ref = ('%.0f' % (math.pi * g / (4 * math.log(2)))) if g else ''
    t.append('| %s | %s | %d | %d | %.4g | %s | %s | %s | %s |' % (name, r['family'][4:], r['n'], r['bits'], r['nu_max'], out, fn, lp, ref))
C2 = '\n'.join(t)
# ---------- C3
rows = load(S + 'c3.jsonl'); t = ['| object | a | box centre Y0 | half-height Y | bits | n decided | index | negative pivots (n, log2 size), first four | max abs R at nodes |', '|---|---|---|---|---|---|---|---|---|']
for r in rows:
    name = r['code'] if not r['code'].startswith('PL:') else '%s + quadruple at %s' % (r['code'].split(':')[1], r['code'].split(':')[-1])
    t.append('| %s | %s | %g | %g | %d | %d | %d | %s | %.4f |' % (name, r['a'], r['Y0'], r['Y'], r['bits'], r['decided_up_to'], r['index'], ', '.join('(%d, %d)' % (a, round(b)) for a, b in r['negative_pivots_n_log2'][:4]), r['max_abs_R_at_nodes']))
C3 = '\n'.join(t)
# ---------- C4
rows = load(S + 'c4b.jsonl'); t = ['   | object | a | T | first off-line zero | E_-(g) | E_-(g beta) | E_-(g beta^2) | excess | causal step | second difference |', '   |---|---|---|---|---|---|---|---|---|---|']
for r in rows:
    t.append('   | %s | %s | %g | %s | %.5f | %.5f | %.5f | %.4g | %.4g | %.2g |' % (r['code'], r['a'], r['T'], '%.3f + %.2f i' % tuple(r['first_offline']), r['E_poles'], r['E_causal'], r['E_causal_doubled'], r['excess'], r['causal_step'], r['second_difference']))
C4M = '\n'.join(t)
rows = load(S + 'c4.jsonl'); t = ['| object | a | T | T/gamma_1 | E_- | E_- causalised | excess | sigma | excess/sigma |', '|---|---|---|---|---|---|---|---|---|']
for r in rows:
    if r['mode'] == 'own' and r['first_offline'] and (r['code'] != 'DH' or r['a'] in (0.1, 0.3)):
        t.append('| %s | %s | %g | %.2f | %.4f | %.4f | %.3g | %s | %s |' % (r['code'], r['a'], r['T'], r['T'] / r['first_offline'][1], r['E_minus'], r['E_minus_causalised'], r['excess'], ('%.3g' % r['sigma_causalised']) if r['sigma_causalised'] else '-', ('%.3g' % r['excess_over_sigma']) if r['excess_over_sigma'] else '-'))
    if r['mode'] == 'own' and not r['first_offline']:
        t.append('| %s | %s | %g | - | %.4f | (causal) | 0 | %s | - |' % (r['code'], r['a'], r['T'], r['E_minus'], ('%.3g' % r['sigma_causalised']) if r['sigma_causalised'] else '-'))
pl = [r for r in rows if r['mode'] == 'planted'] + load('local_c4_planted_T25000.jsonl') + load('local_c4_planted_T1e5.jsonl')
seen = set()
for r in pl:
    if r.get('mode') != 'planted': continue
    key = (r['base'], r['gamma'], r['T'], r['a'])
    if key in seen: continue
    seen.add(key)
    t.append('| %s + quadruple (0.3085, %g) | %s | %g | %.2f | %.3f | %.3f | %.3g | %.3g | %.3g |' % (r['base'], r['gamma'], r['a'], r['T'], r['T_over_gamma'], r['E_minus_planted'], r['E_minus_planted_causalised'], r['excess'], r['sigma_base'], r['excess_over_sigma']))
for r in pl:
    if r.get('mode') == 'sigma': t.append('| %s | %s | %g | - | %.3f | (causal) | 0 | %.3g | - |' % (r['code'], r['a'], r['T'], r['E_minus'], r['sigma']))
C4 = '\n'.join(t)
s = open('RESULT.template.md').read()
for k, v in (('C1TABLE', C1), ('C2TABLE', C2), ('C3TABLE', C3), ('C4MIRROR', C4M), ('C4TABLE', C4)):
    if k in s: s = s.replace(k, v)
    else: print('slot missing', k)
open('RESULT.md', 'w').write(s)
print('filled')
