"""Tables for the compensated probe (q2_q*.jsonl)."""
import json, glob, math, os
HERE = os.path.dirname(os.path.abspath(__file__))
rows = [json.loads(l) for fn in sorted(glob.glob(os.path.join(HERE, 'q2_q*.jsonl'))) for l in open(fn)]
out = []; P = out.append
P(f'# blocks: {len(rows)}')
n = ok = 0; n2 = ok2 = 0
for r in rows:
    if r['r'] == 0 and int(r['Jm2']) > 0 and r['S_m_k']:
        n += 1; ok += int(r['B2']) * r['S_m_k'] ** 2 == int(r['Jm2']) * (r['npr'] * r['S_b_k_minus_lam']) ** 2
    # counting identity: S_m(k) = -npr (S_b(k) - S_b(k-lam)) + corr, corr from A' divisible by the marked prime (not tested as an identity; the size of corr is reported)
P(f'Law L (exact integers): r = 0, J_m != 0: |B|^2 S_m(k)^2 == |J_m|^2 (pi(lam) S_b(k-lam))^2 in {ok} of {n} blocks')
def sig(r):  # marked block obeys the signal law: r = 0, or 1 <= r <= 5 with 6 | k - N - lam
    return int(r['Jm2']) > 0 and (r['r'] == 0 or (1 <= r['r'] <= 5 and (r['k'] - r['N'] - r['lam']) % 6 == 0))
for reg in (True, False):
    for lam in (1, 2):
        for tname in ('a', 'b', 'n1', 'mu'):
            L = [r for r in rows if r['region_lx_lt_l'] == reg and r['lam'] == lam and r['target'] == tname and sig(r)]
            if not L: continue
            rho = sorted(r['B_over_Jm'] for r in L); lo = min(min(r['Cminus_over_Jm'], r['Cplus_over_Jm']) for r in L); hi = max(max(r['Cminus_over_Jm'], r['Cplus_over_Jm']) for r in L)
            cs = sorted({round(abs(r['cos_phase']), 4) for r in L if 'cos_phase' in r})
            dh = max(abs(6 / r['N'] * math.log(x) / math.log(r['q'])) for r in L for x in (r['Cminus_over_Jm'], r['Cplus_over_Jm']) if x > 0)
            P(f"signal-law blocks, lx<l={reg}, lam={lam}, weight {tname}: {len(L)} blocks; rho=|B|/|J_m| in [{rho[0]:.4f}, {rho[-1]:.4f}] (q^-lam = {7 ** -lam:.4f}); |C|/|J_m| in [{lo:.4f}, {hi:.4f}] over both signs; max |shift of h_up| = {dh:.3f}; |cos(relative phase)| values {cs[:6]}")
L = [r for r in rows if r['region_lx_lt_l'] and int(r['Jm2']) > 0]
P(f"region lx<l, all blocks with J_m != 0: {len(L)}; rescaled term exactly 0 in {sum(1 for r in L if int(r['B2']) == 0)}; rho <= 0.25 in {sum(1 for r in L if r['B_over_Jm'] <= 0.25)}; rho > 0.25 in {sum(1 for r in L if r['B_over_Jm'] > 0.25)} (of which obeying the signal law: {sum(1 for r in L if r['B_over_Jm'] > 0.25 and sig(r))})")
L = [r for r in rows if int(r['Jm2']) == 0 and int(r['B2']) > 0]
P(f"blocks with J_m = 0 and rescaled term != 0: {len(L)} (lx<l: {sum(1 for r in L if r['region_lx_lt_l'])})")
open(os.path.join(HERE, 'q2_summary.txt'), 'w').write('\n'.join(out) + '\n'); print('\n'.join(out))
