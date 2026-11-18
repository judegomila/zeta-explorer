#!/usr/bin/env python3
"""summ2.py opt_XX.json ... -- compact per-Q table: ratio rho_hat / random rows (means over classes) and z-scores."""
import sys, json, numpy as np
SN = ['sqfree', 'exp2', 'exp>=3', 'all']
keys = ['t_triv', 't_al', 'f1mean', 'f1max', 'f2mean', 'f2max', '30', '100', '300', '1000', 'small', 'all', 'opt2_all']
def val(c, key): return c[key] if key in c else c['opt'][key]
out = {}
for f in sys.argv[1:]:
    d = json.load(open(f)); m = d['meta']
    print(f"\n=== k={d['k']} Q={d['Q']:.0f} R={d['R']:.0f} window {m['nw0']+m['nw1']} free(par0) {m['nfree0']} rows {m['row_cnt']}")
    for proj in ('loo', 'band'):
        print(f" {proj}: " + " ".join(f"{k:>16s}" for k in keys))
        for s in range(4):
            line = f"  {SN[s]:7s}"
            for key in keys:
                a = np.array([val(c, key) for c in d['cols'] if c['s'] == s and c['proj'] == proj and c['v'] == 0])
                b = np.array([val(c, key) for c in d['cols'] if c['s'] == s and c['proj'] == proj and c['v'] > 0])
                z = (a.mean() - b.mean()) / (b.std(ddof=1) * np.sqrt(1 / len(a) + 1 / len(b)))
                line += f" {a.mean():7.4g}/{b.mean():<7.4g}{z:+5.1f}"[:17].rjust(17)
                out.setdefault((proj, s, key), []).append((d['Q'], a.mean(), b.mean(), b.std(ddof=1), z, m['nw0'] + m['nw1']))
            print(line)
    for s in range(4):
        sh = []
        for v in (0, 1, 2):
            El = sum(c['E'] for c in d['cols'] if c['s'] == s and c['proj'] == 'loo' and c['v'] == v)
            Eb = sum(c['E'] for c in d['cols'] if c['s'] == s and c['proj'] == 'band' and c['v'] == v)
            sh.append(1 - Eb / El)
        print(f"  polar share {SN[s]:7s}: rho {sh[0]:.4f} rnd {sh[1]:.4f} {sh[2]:.4f} excess {sh[0]-(sh[1]+sh[2])/2:+.4f}")
if len(sys.argv) > 3:
    print("\n=== slopes d log(stat) / d log Q  (rho | rnd), and mean log-ratio rho/rnd over path points")
    for proj in ('loo', 'band'):
        for s in range(4):
            line = f" {proj:4s} {SN[s]:7s}"
            for key in ['t_al', 'f1max', 'f2max', '30', '100', '1000', 'small', 'all']:
                r = np.array(out[(proj, s, key)]); lq = np.log(r[:, 0])
                sa = np.polyfit(lq, np.log(r[:, 1]), 1)[0]; sb = np.polyfit(lq, np.log(r[:, 2]), 1)[0]
                lr = np.log(r[:, 1] / r[:, 2])
                line += f" | {key}: {sa:+.3f} {sb:+.3f} lr {lr.mean():+.3f}+-{lr.std(ddof=1)/np.sqrt(len(lr)):.3f}"
            print(line)
