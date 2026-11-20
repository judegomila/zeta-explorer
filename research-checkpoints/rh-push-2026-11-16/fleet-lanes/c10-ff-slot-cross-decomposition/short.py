"""short.py : slot split at short marks (ffxs en, results_short/): the model at the geometry of the Z[omega] screen (lam about N/3, P | columns allowed
to have several marked prime factors).  Same statistics as the screen of c9-mv6-window-statement:
  ratio = E/D,  sd = SD/SDdiag (slot-diagonal part over its phase average),  cr = (E - SD - (D - SDdiag))/D (cross term minus its phase average, over the diagonal)."""
import glob
from fractions import Fraction as Fr
NAMES = {'0 0 0 0': 'one', '0 3 2 3': 'a', '0 3 8 3': 'b', '0 4 2 3': 'c4', '4 0 0 0': 'mu', '5 0 0 0': 'al'}
rows = []
for fn in sorted(glob.glob('results_short/q*.txt')):
    for line in open(fn):
        if not line.startswith('ENX'): continue
        f = [x.strip() for x in line.split('|')]; h = f[0].split(); q, d, N, lam = [int(x) for x in h[1:5]]; spec = ' '.join(h[5:9])
        name = NAMES.get(spec) or ('U' + str(int(h[6]) - 30) if h[5] == '6' else 'r' + str(int(h[6]) - 10))
        np_, E, D, SD, SDd, N0, SB0 = [int(x) for x in f[1:8]]
        rows.append(dict(q=q, N=N, lam=lam, d=d, w=name, np=np_, e=Fr(E, D), sd=Fr(SD, SDd), cr=Fr(E - SD - (D - SDd), D), pav=Fr(D - SDd, D), b0=Fr(N0, q**d * D)))
if __name__ == '__main__':
    cfgs = sorted({(r['q'], r['N'], r['lam'], r['d']) for r in rows})
    print('| q | (N, lam, d) | marks | vector | ratio | sd | cr | phase average of Cross / D | k = 0 squared signal / D |'); print('|---|---|---|---|---|---|---|---|---|')
    for c in cfgs:
        L = [r for r in rows if (r['q'], r['N'], r['lam'], r['d']) == c]
        for r in L:
            if r['w'][0] in 'Ur' and r['w'] not in ('U',): continue
            print(f"| {c[0]} | ({c[1]}, {c[2]}, {c[3]}) | {r['np']} | {r['w']} | {float(r['e']):.4g} | {float(r['sd']):.4g} | {float(r['cr']):+.4g} | {float(r['pav']):+.4g} | {float(r['b0']):.4g} |")
        for cl in 'Ur':
            S = [r for r in L if r['w'][0] == cl and r['w'][1:].isdigit()]
            if S:
                f = lambda k: f"{min(float(r[k]) for r in S):.4g} .. {max(float(r[k]) for r in S):.4g}"
                print(f"| {c[0]} | ({c[1]}, {c[2]}, {c[3]}) | {S[0]['np']} | class {cl} ({len(S)} seeds) | {f('e')} | {f('sd')} | {f('cr')} | {f('pav')} | {f('b0')} |")
