"""Tables from grid.jsonl (text processing only)."""
import json, sys, collections
def mid(s):
    return float(s.split('[')[1].split(' ')[0]) if s.startswith('[') else float(s)
rows = [json.loads(l) for l in open(sys.argv[1])]
by = collections.defaultdict(list)
for r in rows: by[(r['T'], r['N'], r['kind'], r['delta'])].append(r)
print("| T | N | kind | delta | points | min G_opt/N^d | max G_opt/N^d | certain > 1 | certain < 1 | max over named families | max G_opt/R_gen (where defined) | min, max G_opt(T)/G_opt(T>=N) | max rel radius |")
print("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
summary = {}
for key in sorted(by, key=lambda k: (k[0], k[1], 'ZOE'.index(k[2]), k[3])):
    rs = [r for r in by[key] if 'ratio_opt' in r]
    err = [r for r in by[key] if 'error' in r]
    if not rs: print(key, "ERRORS", len(err)); continue
    ro = [mid(r['ratio_opt']) for r in rs]
    ex = sum(r['exceeds_certain'] for r in rs); be = sum(r['below_certain'] for r in rs)
    fam = max(mid(v) for r in rs for n, v in r['families_ratio'].items() if isinstance(v, str))
    rg = [mid(r['ratio_opt_Rgen']) for r in rs if 'ratio_opt_Rgen' in r]
    cr = [mid(r['G_opt']) / mid(r['G_opt_TgeN']) for r in rs]
    rad = max(r['rad_rel'] for r in rs)
    print("| %d | %d | %s | %s | %d | %.6f | %.6f | %d | %d | %.4f | %s | %.4f, %.4f | %.1e |%s" % (key[0], key[1], key[2], key[3], len(rs), min(ro), max(ro), ex, be, fam,
          ("%.4f (%d pts)" % (max(rg), len(rg))) if rg else "-", min(cr), max(cr), rad, (" errors %d" % len(err)) if err else ""))
    summary[str(key)] = dict(min=min(ro), max=max(ro), exceed=ex, below=be, n=len(rs))
json.dump(summary, open(sys.argv[1].replace('.jsonl', '_summary.json'), 'w'), indent=1)
if len(sys.argv) > 2:
    print()
    for key in sorted(by):
        if key[2] == 'Z':
            print(key, " ".join("%.4f" % mid(r['ratio_opt']) for r in sorted(by[key], key=lambda r: r['k'])))
