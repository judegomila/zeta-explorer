"""condensed.py : the tables shown in RESULT.md (subset of tables.md), from the exact split."""
import statistics as st
from fractions import Fraction as Fr
import analyze_slot as A
R = A.main()
def g(x, n=3): return f'{float(x):.{n}g}'
def sg(x): return f'{float(x):+.3f}'
def rmax(N, lam, d): return N + lam - 1 - d + d//2
cfgs = sorted({k[:5] for k in R}, key=lambda c: (c[0], c[1], c[4], c[3], c[2]))
def cls(c, name): return [R[k] for k in sorted(R) if k[:5] == c and k[5].rstrip('0123456789') == name and k[5] != name]
L = []; P = L.append
P('**Table 1. Squarefree rows at N = 2 (= completed rows), all configurations with lam >= 6.** e = E/D, s = SD/D, c = Cross/D = e - s, beta = exact squared signal / D on span{v_0, v_1}, n = e - beta. U: range over the seeds (8 in F runs, 2 in L runs).\n')
P('| q | (N, lam, d) | rmax | kind | max abs(s - 1) | a: e | a: c | a: beta | a: n | b/c4: e | b/c4: beta | b/c4: n | mu: e | mu: beta | mu: n | one: e | one: beta | U: e | U: beta | U: n |')
P('|' + '---|' * 20)
for c in cfgs:
    q, N, lam, d, var = c
    if N != 2 or var or lam < 6: continue
    sec = 'b' if q == 7 else 'c4'; a = R[c + ('a',)]; b = R[c + (sec,)]; mu = R[c + ('mu',)]; one = R[c + ('one',)]; U = cls(c, 'U')
    smax = max([abs(R[c + (w,)]['s'] - 1) for w in ('one', 'a', sec, 'mu')] + [abs(u['s'] - 1) for u in U])
    rg = lambda k: f"{g(min(u[k] for u in U))} .. {g(max(u[k] for u in U))}"
    P(f"| {q} | ({N}, {lam}, {d}) | {rmax(N, lam, d)} | {a['kind']} | {float(smax):.1e} | {g(a['e'])} | {sg(a['c'])} | {g(a['beta'])} | {g(a['n'])} | {g(b['e'])} | {g(b['beta'])} | {g(b['n'])} | {g(mu['e'], 4)} | {g(mu['beta'], 4)} | {g(mu['n'])} | {g(one['e'])} | {g(one['beta'])} | {rg('e')} | {rg('beta')} | {rg('n')} |")
P('\n**Table 2. N = 3: squarefree rows (variant 0) and completed rows (variant 1), lam >= 6.** beta: span{v_0, v_1}; beta4: span{v_0, v_1, V v_0, V v_1}; n4 = e - beta4.\n')
P('| q | (N, lam, d) | rmax | kind | a sqf: e | a sqf: beta | a sqf: n | a compl: e | a compl: s - 1 | a compl: c | a compl: beta | a compl: beta4 | a compl: n4 | mu compl: e | mu compl: beta4 | mu compl: n4 | U compl: n4 |')
P('|' + '---|' * 17)
for c in cfgs:
    q, N, lam, d, var = c
    if N != 3 or var != 1 or lam < 6: continue
    a = R[c + ('a',)]; a0 = R[c[:4] + (0, 'a')]; mu = R[c + ('mu',)]; U = cls(c, 'U')
    P(f"| {q} | ({N}, {lam}, {d}) | {rmax(N, lam, d)} | {a['kind']} | {g(a0['e'])} | {g(a0['beta'])} | {g(a0['n'])} | {g(a['e'])} | {float(a['s'] - 1):+.1e} | {sg(a['c'])} | {g(a['beta'])} | {g(a['beta4'])} | {g(a['e'] - a['beta4'])} | {g(mu['e'], 4)} | {g(mu['beta4'], 4)} | {g(mu['e'] - mu['beta4'])} | {g(min(u['e'] - u['beta4'] for u in U))} .. {g(max(u['e'] - u['beta4'] for u in U))} |")
P('\n**Table 3. Controls, squarefree rows, lam >= 7.** Mean +- standard deviation over the seeds; in brackets min, max. The slot-sign columns give e of the signed vector; compare with e of the unsigned vector.\n')
P('| q | (N, lam, d) | seeds | r: e | r: c | a: e | a with slot signs: e | mu: e | mu with slot signs: e | al: e | al: s |')
P('|' + '---|' * 11)
def ms(S, k): v = [float(r[k]) for r in S]; return f"{st.mean(v):.2f} +- {(st.stdev(v) if len(v) > 1 else 0):.2f} [{min(v):.2f}, {max(v):.2f}]"
for c in cfgs:
    q, N, lam, d, var = c
    if var or lam < 7: continue
    r = cls(c, 'r'); ae = cls(c, 'a*e'); me = cls(c, 'mu*e'); a = R[c + ('a',)]; mu = R[c + ('mu',)]
    al = R.get(c + ('al',))
    P(f"| {q} | ({N}, {lam}, {d}) | {len(r)} | {ms(r, 'e')} | {ms(r, 'c')} | {g(a['e'])} | {ms(ae, 'e')} | {g(mu['e'], 4)} | {ms(me, 'e')} | {g(al['e'], 4) if al else '-'} | {g(al['s']) if al else '-'} |")
open('condensed.md', 'w').write('\n'.join(L) + '\n'); print(len(L), 'lines')
