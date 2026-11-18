#!/usr/bin/env python3
"""tables.py -- markdown tables for RESULT.md from opt_XX.json."""
import json, glob, numpy as np
SN = ['squarefree', 'max exp 2', 'max exp >= 3', 'all']
def val(c, key): return c[key] if key in c else c['opt'][key]
D = [json.load(open(f)) for f in sorted(glob.glob('opt_[0-9][0-9].json'))]
def ab(d, s, proj, key):
    a = np.array([val(c, key) for c in d['cols'] if c['s'] == s and c['proj'] == proj and c['v'] == 0])
    b = np.array([val(c, key) for c in d['cols'] if c['s'] == s and c['proj'] == proj and c['v'] > 0])
    return a.mean(), b.mean(), b.std(ddof=1) * np.sqrt(1 / len(a) + 1 / len(b))
print("| Q | window | free phases (small / all) | rows per stratum |"); print("|---|---|---|---|")
for d in D:
    m = d['meta']; print(f"| {d['Q']:.0f} | {m['nw0']+m['nw1']} | {m['nfree0']['small']} / {m['nfree0']['all']} per parity | {m['row_cnt']} |")
for proj in ('band', 'loo'):
    for key in ('30', '1000', 'small', 'all', 'f2max', 'f1max', 't_al'):
        print(f"\n**{proj}, statistic {key}: rho_hat / random rows (z)**\n")
        print("| stratum | " + " | ".join(f"{d['Q']:.0f}" for d in D) + " | slope rho | slope rnd | diff |"); print("|---|" + "---|" * (len(D) + 3))
        for s in range(4):
            cells = []; A = []; B = []
            for d in D:
                a, b, se = ab(d, s, proj, key); A.append(a); B.append(b)
                f = (lambda x: f"{x:.3g}") if key != 'all' else (lambda x: f"{x:.0f}")
                cells.append(f"{f(a)} / {f(b)} ({(a-b)/se:+.1f})")
            lq = np.log([d['Q'] for d in D]); sa = np.polyfit(lq, np.log(A), 1)[0]; sb = np.polyfit(lq, np.log(B), 1)[0]
            # jackknife error of the slope difference
            jk = [np.polyfit(np.delete(lq, i), np.delete(np.log(A), i) - np.delete(np.log(B), i), 1)[0] for i in range(len(D))]
            ej = np.sqrt((len(D) - 1) / len(D) * ((np.array(jk) - np.mean(jk)) ** 2).sum())
            print(f"| {SN[s]} | " + " | ".join(cells) + f" | {sa:+.3f} | {sb:+.3f} | {sa-sb:+.3f} +- {ej:.3f} |")
print("\n**polar share of the conductor-side energy (rho_hat; random rows; excess)**\n")
print("| stratum | " + " | ".join(f"{d['Q']:.0f}" for d in D) + " |"); print("|---|" + "---|" * len(D))
for s in range(4):
    cells = []
    for d in D:
        sh = []
        for v in (0, 1, 2):
            El = sum(c['E'] for c in d['cols'] if c['s'] == s and c['proj'] == 'loo' and c['v'] == v)
            Eb = sum(c['E'] for c in d['cols'] if c['s'] == s and c['proj'] == 'band' and c['v'] == v)
            sh.append(1 - Eb / El)
        cells.append(f"{sh[0]:.4f}; {(sh[1]+sh[2])/2:.4f}; {sh[0]-(sh[1]+sh[2])/2:+.4f}")
    print(f"| {SN[s]} | " + " | ".join(cells) + " |")
print("\nvalidation against the round-2 snapshot (max abs difference of sum over strata):", [f"{d['meta'].get('valid0', float('nan')):.1e}" for d in D])
