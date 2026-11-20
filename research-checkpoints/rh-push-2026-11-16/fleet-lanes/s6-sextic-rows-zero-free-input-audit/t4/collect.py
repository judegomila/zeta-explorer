#!/usr/bin/env python3
"""collect.py -- tables for combination 4 from the desc_summary.json files (all windows found under t4/out9*)."""
import json, glob, os, math, sys
H = os.path.dirname(os.path.abspath(__file__))
W = {}
for f in glob.glob(os.path.join(H, 'out9*', 'desc_summary.json')):
    d = json.load(open(f))
    for k, v in d['windows'].items(): W[float(k)] = v
# E_a has two gamma factors: its mean term is twice zeta's (desc.py used one); correct minP and the P-fractions are not re-derivable, so only minP is shifted
for T in W:
    for k, v in W[T].items():
        if isinstance(v, dict) and v.get('ch') in ('Ea125', 'Ea25'): v['minP'] = v['minP'] + v['mean_c']
Ts = sorted(W); QS = [0.5625, 0.36, 0.25, 0.16, 0.09, 0.04, 0.0225, 0.01]
out = {'windows': Ts}
def tab(ch, key, fmt="%.2f"):
    print(f"\n{ch}: {key}   (rows: window centre; columns: q = " + ", ".join(str(q) for q in QS) + ")")
    for T in Ts:
        print(f"  {T:8.3g} | mean {W[T][f'{ch}|{QS[0]}'].get('mean_c', float('nan')):6.3f} | " + "  ".join(fmt % W[T][f"{ch}|{q}"][key] for q in QS))
for ch in ('zeta', 'chi4', 'chi5', 'tnr'):
    tab(ch, 'minP')
for ch in ('zeta', 'chi4', 'chi5', 'hash', 'liou', 'Ea125', 'Ea25'):
    tab(ch, 'maxRe'); tab(ch, 'supAbs')
tab('zeta', 'fracP_lt437', "%.4f"); tab('zeta', 'fracP_lt217', "%.4f"); tab('hash', 'fracP_lt437', "%.4f"); tab('liou', 'fracP_lt437', "%.4f"); tab('hash', 'minP'); tab('liou', 'minP')
tab('Ea125', 'minP'); tab('Ea25', 'minP'); tab('Ea125', 'fracP_lt0', "%.4f"); tab('Ea25', 'fracP_lt0', "%.4f"); tab('tnr', 'fracP_lt437', "%.4f")
# q*(X; p): least q of the grid such that the budget minP >= p holds at this q and every larger q, in the window and cumulatively
print("\nq*(X; p) = least grid q with min P >= p for all grid q' >= q   [window | all windows up to X]   ('-' = fails already at q = 0.5625)")
res = {}
for ch in ('zeta', 'chi4', 'chi5', 'tnr', 'hash', 'liou', 'Ea125', 'Ea25'):
    for p in (0.0, 2.17, 4.37):
        row = []
        for i, T in enumerate(Ts):
            def qstar(ws):
                best = None
                for q in QS:
                    if all(W[t][f"{ch}|{q}"]['minP'] >= p for t in ws): best = q
                    else: break
                return best
            a = qstar([T]); b = qstar(Ts[:i + 1])
            row.append((a, b))
        res[f"{ch}|{p}"] = row
        print(f"  {ch:6s} p = {p:4.2f}: " + "  ".join(f"{'-' if a is None else a}|{'-' if b is None else b}" for a, b in row))
# design budgets p_req(q): fraction of samples failing at the start abscissa
print("\nfraction of samples with P < p_req(q) (design U0.145: t0 = 0.1314, y0 = 0.165), zeta")
for T in Ts:
    print(f"  {T:8.3g} | " + "  ".join(f"{W[T][f'zeta|{q}']['preq_U0.145']:.2f}:{W[T][f'zeta|{q}']['fracfail_U0.145']:.4f}" for q in QS))
json.dump({'Ts': Ts, 'qstar': res}, open(os.path.join(H, 'collect.json'), 'w'))
