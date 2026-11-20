"""pivot_analyze.py : pivot runs (results_pivot/): exact e of the completed and squarefree rows, decomposition E = E_0 + E_1 + cross, against pivot_predictions.json."""
import os, json, math
os.environ['C9_RESDIR'] = 'results_pivot'
import analyze
from plan import weights
from ffpy import FF, norm
from pivot_predict import CFG
P = json.load(open('pivot_predictions.json')); L = ['q (N,lam,d) rmax vector | e completed | e squarefree row | E_0/XD | E_1/XD | cross/XD | Delta predicted | E_1/XD / Delta | e_U measured (predicted)']
chk = {'i': [], 'ii': [], 'iii': [], 'r1': [], 'al': []}
for q, cfgs in CFG.items():
    F = FF(q); Wq = weights(q); names = list(Wq)
    for lam, d in cfgs:
        W = analyze.load(q, 3, lam, d); W0 = analyze.load(q, 0, lam, d)
        if W is None or W0 is None: L.append(f'{q} (3,{lam},{d}) not run'); continue
        for i, name in enumerate(names):
            sn, dg = analyze.completed(q, lam, d, name, W[i], W0, F); e = sn/dg; es = W[i]['sumnorm']/W[i]['diag']
            if name == 'r1': chk['r1'].append((q, lam, d, e - 1, 3/math.sqrt(q**d))); continue
            if name == 'al': chk['al'].append((q, lam, d, e)); continue
            V = analyze.completed.V; S0 = analyze.completed.S0
            E0 = W[i]['sumnorm']; E1 = q*sum(V[mi]**2*norm(S0[mi]) for mi in range(q**d)); cr = sn - E0 - E1; eU = W0[0]['sumnorm']/W0[0]['diag']
            pk = P.get(f'{q} 3 {lam} {d} {name}'); D = pk['Delta'] if pk else None
            L.append(f"{q} (3,{lam},{d}) {lam+1} {name} | {e:.4g} | {es:.4g} | {E0/dg:.4g} | {E1/dg:.4g} | {cr/dg:.4g} | " + (f"{D:.4g} | {(E1/dg/D if D else float('nan')):.3g} | {eU:.4g} ({pk['eU']:.4g})" if pk else '- | - | -'))
            if pk:
                if D >= 0.8: chk['i'].append((q, lam, d, name, E1/dg/D))
                if D == 0: chk['ii'].append((q, lam, d, name, E1/dg))
                if D >= 1.5 and name == 'a': chk['iii'].append((q, lam, d, e))
L.append('')
L.append('(i) E_1/XD / Delta in [0.5, 1.5] where Delta >= 0.8: ' + str([(c[:4], round(c[4], 3)) for c in chk['i']]) + ' -> ' + str(all(0.5 <= c[4] <= 1.5 for c in chk['i'])))
L.append('(ii) E_1/XD <= 0.05 where Delta = 0: ' + str([(c[:4], round(c[4], 4)) for c in chk['ii']]) + ' -> ' + str(all(c[4] <= 0.05 for c in chk['ii'])))
L.append('(iii) target a, completed e >= 1.5 where Delta >= 1.5: ' + str([(c[:3], round(c[3], 3)) for c in chk['iii']]) + ' -> ' + str(all(c[3] >= 1.5 for c in chk['iii'])) + f"; q present: {sorted(set(c[0] for c in chk['iii']))}")
L.append('r1 excess and band: ' + str([(c[:3], round(c[3], 3), round(c[4], 3)) for c in chk['r1']]) + ' -> inside: ' + str(all(abs(c[3]) <= c[4] for c in chk['r1'])))
L.append('al: ' + str([(c[:3], f'{c[3]:.3g}') for c in chk['al']]) + ' -> above 100: ' + str(all(c[3] > 101 for c in chk['al'])))
open('pivot_summary.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
