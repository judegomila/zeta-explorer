import json, sys, collections
rows = [json.loads(l) for l in open(sys.argv[1])]
by = collections.defaultdict(list)
for r in rows: by[(r['T'], r['N'], r['kind'])].append(r)
print("| T | N | kind | points | sup R2 (worst phase): min, max | points with sup R2 > 1.001 | sup R2true: max | cap M/L: min, max | max sup R2true / cap | max (sup R2true - 1)/(cap - 1) | HECKE R2: min, max | max abs(L_quad - L)/L |")
print("|---|---|---|---|---|---|---|---|---|---|---|---|")
for key in sorted(by, key=lambda k: (k[0], k[1], 'ZEO'.index(k[2]))):
    rs = by[key]
    s = [r['sup_R2'] for r in rs]; st = [r['sup_R2true'] for r in rs]; cap = [r['cap_M_over_L'] for r in rs]
    h = [r['families']['HECKE']['R2'] for r in rs]
    print("| %d | %d | %s | %d | %.4f, %.4f | %d | %.4f | %.4f, %.4f | %.4f | %.3f | %.4f, %.4f | %.1e |" % (key[0], key[1], key[2], len(rs), min(s), max(s), sum(v > 1.001 for v in s), max(st), min(cap), max(cap),
          max(a / b for a, b in zip(st, cap)), max((a - 1) / (b - 1) for a, b in zip(st, cap)), min(h), max(h), max(r['Lerr'] for r in rs)))
viol = [(r['T'], r['N'], r['kind'], r['k'], r['sup_R2true'], r['cap_M_over_L']) for r in rows if r['sup_R2true'] > r['cap_M_over_L'] * (1 + 1e-9)]
print("\nrows with sup R2true above the cap:", viol)
z = sorted([r for r in rows if r['T'] == 1 and r['N'] == 2 and r['kind'] == 'Z'], key=lambda r: r['k'])
print("S/M at zeros 1..12:", " ".join("%.3f" % r['S_over_M'] for r in z))
e = sorted([r for r in rows if r['T'] == 1 and r['N'] == 2 and r['kind'] == 'E'], key=lambda r: r['k'])
print("S/M at E midpoints 1..11:", " ".join("%.3f" % r['S_over_M'] for r in e))
