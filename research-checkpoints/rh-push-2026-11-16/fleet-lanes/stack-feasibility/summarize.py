"""Collect tables for RESULT.md; verify one surgery configuration directly against the LP test constraints (ii)."""
import json, glob, numpy as np, mpmath as mp
from lib import *
mp.mp.dps = 45
rows = json.load(open('surgery2.json'))
for f in sorted(glob.glob('surgery2_1*.json')): rows += json.load(open(f))
best = {}
for r in rows:
    k = (r['L'], r['delta'])
    if k not in best or r['sup_E'] < best[k]['sup_E']: best[k] = r
Ls = sorted(set(k[0] for k in best)); ds = sorted(set(k[1] for k in best))
print('SURGERY: best sup|E| on [0,L] over K in {40,150,400}; in brackets max|eps_k|')
print('| delta | ' + ' | '.join(f'L={L:g}' for L in Ls) + ' |'); print('|' + '---|'*(len(Ls)+1))
for d in ds:
    print(f'| {d:5.3f} | ' + ' | '.join((f"{best[(L,d)]['sup_E']:.1e} ({best[(L,d)]['max_eps']:.2f})" if (L, d) in best else '') for L in Ls) + ' |')
reach = {L: max([d for d in ds if (L, d) in best and best[(L, d)]['sup_E'] < 1e-6] or [0]) for L in Ls}
print('largest delta with sup|E| < 1e-6:', reach)
# direct check of one configuration against the tests of the LP (L = 6, m = 3)
z = json.load(open('zeros_3e12.json')); zt = np.array(z['zeros_tau']); t0 = mp.mpf(z['t0'])
for (L, d) in ((6.0, 0.3), (8.0, 0.16), (10.0, 0.02)):
    s = best[(L, d)]; m = 3; tj = np.arange(-5, 5+1e-9, np.pi/(2*L)); b = b_primes(tj, L, m, t0)
    keep = np.ones(len(zt), bool); keep[s['pair']] = False; keep[s['idx']] = False
    new_online = np.concatenate([zt[keep], zt[s['idx']] + np.array(s['eps'])])
    val = b_zeros(tj, L, m, new_online) + 2*Bhat(s['tq'] - tj + 1j*d, L, m).real
    print(f"config L={L} delta={d} K={s['K']}: quartet at tau={s['tq']:.6f}; max_j |zero side(new config) - prime side(Lambda, n<=e^L)| = {np.abs(val-b).max():.2e};"
          f" original zeros: {np.abs(b_zeros(tj, L, m, zt)-b).max():.2e}; plain insertion without compensation: {np.abs(b_zeros(tj, L, m, zt) + 2*Bhat(s['tq'] - tj + 1j*d, L, m).real - b).max():.2e};"
          f" min gap of new on-line zeros {np.diff(np.sort(new_online)).min():.4f}; max shift {s['max_eps']:.3f}; l2 shift {s['l2_eps']:.3f}")
for f in sorted(glob.glob('cg_*.json')):
    c = json.load(open(f)); print(f, {r['model']: (r.get('pair'), r.get('gap')) for r in c['rows']})
