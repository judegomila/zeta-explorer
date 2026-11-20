"""optional.py : the optional runs of PREREG section 3 (kind M: vectors one, a, mu, r1, a*e1), reported separately from the rule counts."""
import analyze_slot as A
A.INCLUDE_M = True
R = A.main()
def g(x): return f'{float(x):.4g}'
print('| q | (N, lam, d) | rows | vector | e | s - 1 | c | beta | beta4 | n or n4 |'); print('|---|---|---|---|---|---|---|---|---|---|')
for k in sorted(R):
    r = R[k]
    if r['kind'] != 'M': continue
    b4 = g(r['beta4']) if 'beta4' in r else '-'; n = r['e'] - (r['beta4'] if 'beta4' in r else r['beta'])
    print(f"| {k[0]} | ({k[1]}, {k[2]}, {k[3]}) | {'completed' if k[4] else 'squarefree'} | {k[5]} | {g(r['e'])} | {float(r['s']-1):+.1e} | {g(r['c'])} | {g(r['beta'])} | {b4} | {g(n)} |")
