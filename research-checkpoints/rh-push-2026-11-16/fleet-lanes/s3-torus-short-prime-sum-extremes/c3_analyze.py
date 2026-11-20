import sys, json, math, numpy as np
R = json.load(open(sys.argv[1]))
def line(x, extra=''):
    bd = {r['delta_mean_spacings']: r for r in x['by_delta']}
    b1 = bd.get(1); b4 = bd.get(4)
    return (f"| {x['label']} | {x['njumps']} | {x['rho']:.3f} | {x['supS']:+.3f} | {x['infS']:+.3f} | {x['A_global']:.3f} | {x['sqrt2Arho']:.3f} | {x['ratio_global']:.3f} | "
            f"{b1['ratio_lo']:.3f}-{b1['ratio_hi']:.3f} | {b4['ratio_lo']:.3f}-{b4['ratio_hi']:.3f} | {x['mean_S']:+.4f} | {extra} |")
print('| object | jumps | rho | sup S | inf S | A = range of S_1 | sqrt(2 A rho) | sup abs S / sqrt(2 A rho) | ratio at delta = 1 spacing | at 4 spacings | window mean of S | notes |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|')
for z in R['zeta']:
    print(line(z, f"grid {z['grid_points']:.1e} pts, close pairs {z['pairs_from_parabola']}, Z err vs mpmath {z['Z_maxerr_vs_mpmath']}"))
if 'tnr' in R:
    print(line(R['tnr'], f"{R['tnr']['offline_pairs_in_window']} off-line pairs in window; line count drifts at slope {R['tnr']['S0_drift_slope']:.4f}"))
if 'chi' in R:
    print(line(R['chi'], f"imag part of Z {R['chi']['stats']['max_imag_chi']:.1e}; L err {R['chi']['errs']}"))
if 'dh' in R:
    d = R['dh']
    print(line(d['true'], f"{d['steps_located']} steps of 2 restored at gap midpoints"))
    print(line(d['line'], f"line count only; final level {d['final_S0_median']:.1f}"))
    print(line(d['pre_first'], 'window below the first off-line height'))
    print()
    print({k: d[k] for k in ('steps_located', 'clean_steps', 'offline_pairs_by_final_level', 'clean_gap_mean_spacings', 'lead_mean_spacings', 'profile_events', 'zeros_on_line')})
    o = d['profile_offsets_mean_spacings']; m = d['profile_mean']; se = d['profile_se']
    print('superposed profile of the line count around isolated steps (offset in mean spacings: mean +- se):')
    print(' '.join(f"{o[i]:+.2f}:{m[i]:+.3f}±{se[i]:.3f}" for i in range(len(o)) if abs(o[i]) <= 4.01 and (i % 1 == 0)))
    print('first step heights:', [round(x, 2) for x in d['first_step_heights'][:8]])
