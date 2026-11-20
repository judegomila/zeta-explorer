"""Markdown tables for RESULT.md from the result files (out/, out/server/)."""
import json, glob, math, os, sys
O = 'out/'
def J(p): return json.load(open(p))
# ---- combination 1: truth
ts = J(O + 'truth_stats_1e10.json') if os.path.exists(O + 'truth_stats_1e10.json') else J(O + 'truth_stats_1e9.json')
print('### T1 sup of abs(excess)/sqrt X per decade\n')
for k in (0, 1, 2):
    names = [f'zeta k={k}', f'Ea0.02 k={k} (over 2 sqrt X)', f'Ea0.1 k={k} (over 2 sqrt X)', f'TNR k={k}', f'chi4 k={k}', f'chi5 k={k}', f'ded4 k={k}', f'liouville k={k}', f'randsign k={k}', f'unimod k={k}']
    print(f'k = {k}\n\n| decade of X | zeta | E_a, a = 0.02 (/2) | ratio to zeta | cosh(a log X) | E_a, a = 0.1 (/2) | ratio | cosh | T-NR q = 1000003 | L(chi_-4) | L(chi_5) | zeta_Q(i) | Liouville | random sign | twist alpha = 1 |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
    for i, row in enumerate(ts[names[0]]):
        m = row[0]; v = [ts[n][i][1] for n in names]; mid = (m + 0.5) * math.log(10)
        print(f"| 1e{m}..1e{m+1} | {v[0]:.4f} | {v[1]:.4f} | {v[1]/v[0]:.3f} | {math.cosh(0.02*mid):.3f} | {v[2]:.4f} | {v[2]/v[0]:.3f} | {math.cosh(0.1*mid):.3f} | {v[3]:.4f} | {v[4]:.4f} | {v[5]:.4f} | {v[6]:.4f} | {v[7]:.4f} | {v[8]:.3f} | {v[9]:.4f} |")
    print()
# ---- LP-R
print('### T2 LP-R (zeta), D = 2.2 sqrt X\n\n| k | X | D | robust gap / sqrt X | penalty / sqrt X | exact gap of the optimiser / sqrt X | l1 norm of c | where |\n|---|---|---|---|---|---|---|---|')
seen = {}
for f, where in [(O + 'lpR_zeta.jsonl', 'local')] + [(p, 'server') for p in sorted(glob.glob(O + 'server/rh-s6-zR*.log'))]:
    if not os.path.exists(f): continue
    for l in open(f):
        if l.startswith('{'):
            r = json.loads(l)
            if r['status'] == 0: seen[(r['k'], r['X'])] = (r, where if (r['k'], r['X']) not in seen else 'local, server')
            else: seen.setdefault((r['k'], r['X']), (r, where))
for (k, X), (r, where) in sorted(seen.items()):
    if r['status'] == 0: print(f"| {k} | {X:.0e} | {r['D']} | {r['robust_gap_over_sqrtX']:.4f} | {r['pen_over_sqrtX']:.4f} | {r['exact_gap_over_sqrtX']:.4f} | {r['l1']:.3g} | {where} |")
    else: print(f"| {k} | {X:.0e} | {r['D']} | solver status {r['status']} | | | | {where} |")
print()
# ---- combination 4
files = sorted(glob.glob(O + 'server/h_*.json'), key=lambda p: (J(p)['T0'], J(p)['obj']))
loc = [p for p in sorted(glob.glob(O + 'hole_*.json')) if 'v1' not in p]
have = {(J(p)['obj'], J(p)['T0']) for p in files}
files += [p for p in loc if (J(p)['obj'], J(p)['T0']) not in have]
files = sorted(files, key=lambda p: (J(p)['T0'], ['zeta', 'chi4', 'chi5', 'DH'].index(J(p)['obj'])))
NM = {'zeta': 'zeta', 'chi4': 'L(chi_-4)', 'chi5': 'L(chi_5)', 'DH': 'DH'}
print('### T3 zeros, gaps\n\n| F | T | windows (17 sp.) | where | zeros counted | counted - expected | unresolved close pairs inserted | positive minima, eta >= 0.06 / 0.1 / 0.5 sp. | largest gap (sp.) | 99.99% gap | max abs Z | rms Z |\n|---|---|---|---|---|---|---|---|---|---|---|---|')
for p in files:
    R = J(p); pm = R.get('positive_minima_eta_ge_steps', {})
    print(f"| {NM[R['obj']]} | {R['T0']:.0e} | {R['windows17']} | {'server GPU' if 'server' in p else 'local CPU'} | {R['zeros_with_close_pairs']} | {R['count_minus_expected']:+.0f} | {R['flagged_close_pairs'] + R.get('flagged_marginal', 0)} | {pm.get('0.6', R['laguerre_violations'])} / {pm.get('1.0', '-')} / {pm.get('5.0', '-')} | {R['gap_max']:.3f} | {R['gap_q'][4]:.3f} | {R['max_abs_Z']:.1f} | {R['rms_Z']:.3f} |")
print('\n### T4 gap law: mean of log max abs Z inside a gap of length g (gaps without an inserted pair)\n\n| F | T | g in [1.5,1.75) | [2,2.25) | [2.5,2.75) | [3,3.25) | fit slope, intercept (g >= 1.5) | DH: gaps holding a positive minimum: [3,3.25) | [4,4.25) | [5,5.25) | [6,6.25) | largest such gap, max abs Z in it |\n|---|---|---|---|---|---|---|---|---|---|---|---|')
def lawget(law, g):
    for a, n, m, lo, hi in law:
        if abs(a - g) < 1e-9: return f"{m:.2f} ({n})"
    return '-'
for p in files:
    R = J(p); law = R.get('gap_law_noviol', R['gap_law']) if R['laguerre_violations'] else R['gap_law']; fit = R.get('gap_law_fit_mean_log_maxZ') or {}
    lv = R.get('gap_law_viol', []) if R['obj'] == 'DH' else []
    tg = R['top_gaps'][0]
    print(f"| {NM[R['obj']]} | {R['T0']:.0e} | {lawget(law, 1.625)} | {lawget(law, 2.125)} | {lawget(law, 2.625)} | {lawget(law, 3.125)} | {fit.get('slope', float('nan')):.3f}, {fit.get('intercept', float('nan')):.3f} | {lawget(lv, 3.125)} | {lawget(lv, 4.125)} | {lawget(lv, 5.125)} | {lawget(lv, 6.125)} | {tg[0]:.2f}, {tg[1]:.1f} |")
print('\n### T5 mollified function\n\n| F | T | theta | y | mean abs(FM)^2 | fraction of the line with Re(FM) > 0 | largest certified hole (sp.) | certified share of gaps in [2,2.5) | of gaps >= 3 | largest gap, certified part |\n|---|---|---|---|---|---|---|---|---|---|')
for p in files:
    R = J(p)
    for m in R['moll']:
        eff = {a: e for a, b, c, e, mn in m['cert_efficiency_by_gap']}
        tg = m['cert_on_top_gaps'][0]
        print(f"| {NM[R['obj']]} | {R['T0']:.0e} | {m['theta']} | {m['y']} | {m['mean_FM2']:.3f} | {m['frac_ReFM_pos']:.3f} | {m['cert_max_run_m0.0']:.2f} | {eff.get(2.0, float('nan')):.2f} | {eff.get(3.0, float('nan')):.2f} | {tg[0]:.2f}, {tg[1]:.2f} |")
print('\n### T6 windows\n\n| F | T | w | windows | largest hole | clean windows | largest hole, clean | largest hole, other | other windows with hole >= 4: number, median max abs Z | median max abs Z, all | J(1/4) clean / other | J(1/2) clean / other | sd of J(1/2) | rho(hole, J(1/2)) | rho(hole, max abs Z) |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for p in files:
    R = J(p)
    for w in R['win']:
        if w['w'] not in (7, 17): continue
        f2 = lambda x: '-' if x is None else f"{x:.2f}"
        print(f"| {NM[R['obj']]} | {R['T0']:.0e} | {w['w']} | {w['nwin']} | {w['hole_max']:.2f} | {w.get('clean_windows')} | {f2(w.get('hole_max_clean'))} | {f2(w.get('hole_max_unclean'))} | {w.get('unclean_holes_ge4', 0)}, {f2(w.get('maxZ_median_unclean_holes_ge4'))} | {w['maxZ_median_all']:.2f} | {f2(w.get('J_mean_clean_th0.25'))} / {f2(w.get('J_mean_unclean_th0.25'))} | {f2(w.get('J_mean_clean_th0.5'))} / {f2(w.get('J_mean_unclean_th0.5'))} | {w['J_sd_th0.5']:.2f} | {w['spearman_hole_J_th0.5']:.2f} | {w['spearman_hole_maxZ']:.2f} |")
