"""build_tables.py: markdown tables for RESULT.md from out_server/st_q*_g*.json and out/recheck_all.json; prints totals."""
import json, glob, math, numpy as np
S = sorted((json.load(open(f)) for f in glob.glob('out_server/st_q*_g*.json')), key=lambda s: (s['g'], s['q']))
rc = {(r['q'], r['g']): r for r in json.load(open('out/recheck_all.json'))}
exact = set()
for f in glob.glob('out_server/an_q*_g*.json') + glob.glob('out/an_q*_g*.json'):
    a = json.load(open(f))['summary']; exact.add((a['q'], a['g']))
T1 = ['| g | q | polynomials tested | census members | RH members | fakes | N_det histogram (N: fakes) | pass T_(g+1) | pass Serre d <= g | pass both | exact pass |', '|---|---|---|---|---|---|---|---|---|---|---|']
T2 = ['| g | q | min Lambda over fakes | minimiser (c_1..c_g) | nu | N_det | Serre d <= g | eps | -lambda_min(T_2g)/eps^2 | first n with abs(S_n) > 2g |', '|---|---|---|---|---|---|---|---|---|---|']
g1 = []
for s in S:
    q, g = s['q'], s['g']; r = rc.get((q, g))
    if g == 1:
        g1.append((q, s['members'], s['rh'], s['fakes'], r['Lam_mp'], r['c'][0], abs(r['Lam_mp'] - r['g1_formula'])))
        continue
    hist = ', '.join(f'{k}: {v}' for k, v in s['ndet_hist'].items()) or '-'
    T1.append(f"| {g} | {q} | {s['tested']} | {s['members']} | {s['rh']} | {s['fakes']} | {hist} | {s['fakes_pass_T_gplus1']} | {s['fakes_pass_serre_d_le_g']} | {s['fakes_pass_serre_and_T_gplus1']} | {'yes' if (q, g) in exact else 'no'} |")
    if r: T2.append(f"| {g} | {q} | {r['Lam_mp']:.6g} | {r['c']} | {r['nu_exact']} | {r['ndet_exact']} | {'pass' if r['serre_d_le_g'] else 'reject'} | {r['eps']:.4g} | {r['C_ratio']:.3g} | {r['hasse_n'] if r['hasse_n'] else 'none <= 200'} |")
open('out/census_table.md', 'w').write('\n'.join(T1) + '\n')
g1row = 'g = 1 (27 cells, q = ' + ', '.join(str(x[0]) for x in g1) + '): min Lambda = ' + ', '.join(f'{x[4]:.4g}' for x in g1) + '.'
open('out/lambda_table.md', 'w').write(g1row + '\n\n' + '\n'.join(T2) + '\n')
tot = {k: sum(s[k] for s in S) for k in ('tested', 'members', 'rh', 'fakes')}
print('cells', len(S), tot, 'exact cells', len(exact & {(s['q'], s['g']) for s in S}))
print('g1 fakes total', sum(x[3] for x in g1), 'max |Lam - formula|', max(x[6] for x in g1), 'all fakes N_det 2:', all(s['ndet_hist'] == {'2': s['fakes']} for s in S if s['g'] == 1))
fr = [(s['g'], s['q'], s['fakes_pass_serre_and_T_gplus1'] / s['fakes'], s['fakes_ndet_2g'] / s['fakes']) for s in S if s['g'] >= 2 and s['fakes']]
print('pass-both fraction: min', min(fr, key=lambda x: x[2]), 'max', max(fr, key=lambda x: x[2]))
print('q=2 by g', [(f[0], round(f[2], 3)) for f in fr if f[1] == 2], ' N_det=2g >0 in all cells g>=2 with fakes:', all(f[3] > 0 for f in fr))
print('total pass both g>=2', sum(s['fakes_pass_serre_and_T_gplus1'] for s in S if s['g'] >= 2), 'of', sum(s['fakes'] for s in S if s['g'] >= 2))
R2 = [r for r in rc.values() if r['g'] >= 2]
print('minimisers g>=2:', len(R2), 'C range', min(r['C_ratio'] for r in R2), max(r['C_ratio'] for r in R2), 'eps range', min(r['eps'] for r in R2), max(r['eps'] for r in R2), 'all counts ok to 200:', all(r['counts_ok_200'] for r in rc.values()), 'n minimisers', len(rc))
print('max rel diff stream vs mp', max(abs(r['Lam_mp'] - r['Lam_stream']) / r['Lam_mp'] for r in rc.values()))
print('serre reject among g>=2 minimisers:', [(r['g'], r['q']) for r in R2 if not r['serre_d_le_g']])
print('ndet of minimisers', sorted(set((r['g'], r['ndet_exact']) for r in R2)))
for g in (1, 2, 3, 4):
    pts = [(r['q'], r['Lam_mp']) for r in rc.values() if r['g'] == g and r['q'] >= 4]; pts.sort()
    if len(pts) >= 3:
        sl = np.polyfit(np.log([p[0] for p in pts]), np.log([p[1] for p in pts]), 1)[0]; print('g', g, 'slope', round(sl, 3), 'points', len(pts), 'q range', pts[0][0], pts[-1][0])
print('fixed q=2:', [(r['g'], r['Lam_mp']) for r in sorted(rc.values(), key=lambda r: r['g']) if r['q'] == 2]); print('fixed q=3:', [(r['g'], r['Lam_mp']) for r in sorted(rc.values(), key=lambda r: r['g']) if r['q'] == 3])
print('smallest', min(rc.values(), key=lambda r: r['Lam_mp']))
print('hasse none', [(r['g'], r['q']) for r in rc.values() if not r['hasse_n']], 'max hasse_n', max((r['hasse_n'] or 0, r['g'], r['q']) for r in rc.values()))
