import sys, statistics as st
import analyze_slot as A
R = A.main()
def f(x): return f'{float(x):.4g}'
cfgs = sorted({k[:5] for k in R})
sel = sys.argv[1:] 
for c in cfgs:
    q, N, lam, d, var = c
    if sel and f'{q},{N},{d}' not in sel: continue
    print(f'--- q={q} (N,lam,d)=({N},{lam},{d}) var={var} rmax={N+lam-1-d+d//2} kind={R[c+("a",)]["kind"]}')
    for w in ('one', 'a', 'b', 'c4', 'mu', 'al'):
        if c + (w,) not in R: continue
        r = R[c + (w,)]
        x = f"  {w:4s} e={f(r['e'])} s={f(r['s'])} c={f(r['c'])} beta={f(r['beta'])} sb={f(r['sb'])} c_coh={f(r['c_coh'])} c_perp={f(r['c_perp'])} n={f(r['n'])}"
        if var: x += f" | beta4={f(r['beta4'])} c_perp4={f(r['c_perp4'])}"
        print(x)
    for cl in ('U', 'r', 'a*e', 'mu*e'):
        L = [R[k] for k in R if k[:5] == c and k[5].rstrip('0123456789') == cl]
        if not L: continue
        def ms(key): v = [float(r[key]) for r in L]; return f"{st.mean(v):.3g}±{(st.stdev(v) if len(v) > 1 else 0):.2g}[{min(v):.3g},{max(v):.3g}]"
        print(f"  {cl:4s} n={len(L)} e={ms('e')} s={ms('s')} c={ms('c')} beta={ms('beta')} c_perp={ms('c_perp')}")
