"""analyze.py <lam> : registered decomposition (fourpart.py) of every vector at (6, lam, 2), q = 7, from results_srv/rows_lam<lam>.json (exact rows from the Y tables).
Cross-checks: rows of one, a, b, mu, al against the stored exact files where they exist (N = 6 at lam = 9; N = 3, 0 at lam = 9, 10).  Writes summary_lam<lam>.txt, parts_lam<lam>.json."""
import sys, json, os, statistics
from fractions import Fraction as Fr
from fourpart import *
from assemble6 import load, pick
lam = int(sys.argv[1]); J = json.load(open(f'results_srv/rows_lam{lam}.json')); np_ = J['np']
rw = lambda L: [(int(a), int(b)) for a, b in L]
S0 = rw(J['S0']); S0al = rw(J['S0_al']); L = []; out = {}
chk = []
for N in (6, 3, 0):
    fn = f'ref/q7_N{N}_lam{lam}_d2.txt'
    if not os.path.exists(fn): continue
    W = load(fn)
    for name in ('one', 'a', 'b', 'mu', 'al'):
        try: w = pick(W, name)
        except KeyError: continue
        mine = (S0 if name == 'one' else S0al) if N == 0 else rw(J['vectors'][name][f'S{N}']) if name in J['vectors'] else None
        if N == 0 and name not in ('one', 'al'): continue
        chk.append((N, name, mine == w['rows']))
L.append(f'(6, {lam}, 2), q = 7, np = {np_}.  Rows against stored exact files: ' + ', '.join(f'N={N} {n}: {"identical" if s else "DIFFERENT"}' for N, n, s in chk)); assert all(s for _, _, s in chk)
sda = {N: Fr(int(J[f'SDA{N}']), int(J[f'D{N}_full'])) for N in (6, 3, 0)}
L.append('Cofactor-slot energy over diagonal (mean of the squarefree-row energy over independent unimodular phases on the cofactors): ' + ', '.join(f'N = {N}: {float(sda[N]):.6g}' for N in (6, 3, 0)))
hdr = 'vector | e_c | A principal | B own-char | C = |Tq|^2 | C_perp | D = |Pi Tf|^2 | |Tf|^2 | G bulk | x_CD | x_CG | x_DG | e_s = |S_6|^2/D_0 | E_j1 | identity'
L.append(hdr); f = lambda x, D: '%.4g' % float(Fr(x)/D)
names = [n for n in J['vectors']]
for name in names:
    v = J['vectors'][name]; s0 = S0al if name == 'al' else S0
    r = decompose(name, rw(v['S6']), rw(v['S3']), s0, np_, int(v['diag6'])); D = r['D_c']
    o = {k: float(Fr(r[k])/D) for k in ('E_c', 'A', 'B', 'C_total', 'C_perp', 'D', 'D_total', 'G', 'x_CD', 'x_CG', 'x_DG', 'E_j1')}
    o['e_s'] = float(Fr(r['E_S6'], int(v['diag6']))); o['D_c'] = str(D); o['E_c_int'] = str(r['E_c']); o['identity'] = r['identity']
    o['A_by_term'] = [float(r[k][0]/D) for k in ('X_along', 'C_along', 'D_along')]; o['B_by_term'] = [float(r[k][1]/D) for k in ('X_along', 'C_along', 'D_along')]
    o['exact'] = {k: str(Fr(r[k])/D) for k in ('E_c', 'A', 'B', 'C_perp', 'D', 'G', 'x_CD', 'x_CG', 'x_DG')}
    out[name] = o
    if not (name.startswith('cm') or name.startswith('ru')):
        L.append(' | '.join([name] + ['%.4g' % o[k] for k in ('E_c', 'A', 'B', 'C_total', 'C_perp', 'D', 'D_total', 'G', 'x_CD', 'x_CG', 'x_DG', 'e_s', 'E_j1')] + [str(o['identity'])]))
        L.append(f"      A by term (X, Tq, Tf): {o['A_by_term'][0]:.4g}, {o['A_by_term'][1]:.4g}, {o['A_by_term'][2]:.4g};  B by term: {o['B_by_term'][0]:.4g}, {o['B_by_term'][1]:.4g}, {o['B_by_term'][2]:.4g}")
L.append(''); L.append('Seeded classes (24 seeds each): min | lower quartile | median | upper quartile | max | mean')
keys = ('E_c', 'A', 'B', 'C_total', 'D', 'G', 'e_s'); cls = {}
for c in ('cm', 'ru'):
    for k in keys:
        x = sorted(out[n][k] for n in names if n.startswith(c)); qs = statistics.quantiles(x, n=4)
        cls[f'{c}.{k}'] = x; L.append(f"{c} {k}: {x[0]:.4g} | {qs[0]:.4g} | {qs[1]:.4g} | {qs[2]:.4g} | {x[-1]:.4g} | {statistics.mean(x):.4g}")
    xs = [out[n]['x_CD'] + out[n]['x_CG'] + out[n]['x_DG'] for n in names if n.startswith(c)]; L.append(f"{c} cross sum: min {min(xs):.4g}, max {max(xs):.4g}")
L.append(''); L.append('Position of the targets in the class of multiplicative signs (cm), and in ru:  quantity: value, rank among the 24 seeds (0 = below all, 24 = above all)')
for t in ('a', 'b'):
    for k in ('E_c', 'D', 'G', 'A', 'B'):
        L.append(f"{t} {k} = {out[t][k]:.4g}: cm rank {sum(1 for x in cls['cm.'+k] if x < out[t][k])}, ru rank {sum(1 for x in cls['ru.'+k] if x < out[t][k])}")
L.append(f"identity E_c = A + B + C_perp + D + G + x_CD + x_CG + x_DG exact for {sum(1 for n in names if out[n]['identity'])} of {len(names)} vectors")
json.dump({'lam': lam, 'np': np_, 'SDA_over_D': {N: float(sda[N]) for N in sda}, 'vectors': out}, open(f'parts_lam{lam}.json', 'w'), indent=0)
open(f'summary_lam{lam}.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
