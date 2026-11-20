import json, sys
for f in sys.argv[1:]:
    R = json.load(open(f))
    print(f"== {R['obj']} T0={R['T0']:.0e} windows17={R['windows17']} zeros={R['zeros_with_close_pairs']} count-expected={R['count_minus_expected']:+.0f} flagged={R['flagged_minima']} close={R['flagged_close_pairs']} marginal={R.get('flagged_marginal')} eta_q={R.get('violation_eta_spacings_q')} viol={R['laguerre_violations']} rmsZ={R['rms_Z']:.3f} max|Z|={R['max_abs_Z']:.1f}")
    print(f"   gaps: max {R['gap_max']:.3f} q(.5,.9,.99,.999,.9999)={[round(x,3) for x in R['gap_q']]} top (gap, max|Z| in it): {[(round(a,2), round(b,1)) for a,b in R['top_gaps'][:4]]}")
    print(f"   gap law (g, n, mean log max|Z|): {[(a, n, round(m,2)) for a,n,m,lo,hi in R['gap_law'] if a*8 % 4 == 1]}  fit mean: {R.get('gap_law_fit_mean_log_maxZ')}")
    if R['laguerre_violations']:
        print(f"   gaps with violation: {R['gaps_with_violation']}; max gap without {R['gap_law_noviol_gap_max']:.3f}, with {R['gap_law_viol_gap_max']:.3f}; law with violation: {[(a, n, round(m,2)) for a,n,m,lo,hi in R['gap_law_viol'] if a*8 % 4 == 1]}")
        print(f"   law without violation: {[(a, n, round(m,2)) for a,n,m,lo,hi in R['gap_law_noviol'] if a*8 % 4 == 1]}")
    for m in R['moll']:
        print(f"   theta={m['theta']} y={m['y']}: mean|FM|^2={m['mean_FM2']:.3f} frac Re(FM)>0 {m['frac_ReFM_pos']:.3f}; largest certified hole {m['cert_max_run_m0.0']:.2f} (margin .05: {m['cert_max_run_m0.05']:.2f}, .2: {m['cert_max_run_m0.2']:.2f}); efficiency by gap {[(a, round(e,2)) for a,b,c,e,mn in m['cert_efficiency_by_gap']]}; on top gaps {[(round(a,2), round(b,2)) for a,b in m['cert_on_top_gaps'][:3]]}")
    for w in R['win']:
        th = R['thetas']
        print(f"   w={w['w']}: hole max {w['hole_max']:.2f} mean {w['hole_mean']:.3f}; max|Z| median all {w['maxZ_median_all']:.2f}, top-1% holes {w['maxZ_median_top1pct_hole']:.2f}; rho(hole,max|Z|)={w['spearman_hole_maxZ']:.3f} rho(hole,J0)={w['spearman_hole_J0']:.3f} " + ' '.join(f"rho(hole,J_{t})={w['spearman_hole_J_th'+str(t)]:.3f} J mean {w['J_mean_th'+str(t)]:.3f} sd {w['J_sd_th'+str(t)]:.3f} holemax|J<med {w['hole_max_given_J_below_median_th'+str(t)]:.2f}" for t in th) + f" | clean {w.get('clean_windows')}: hole max clean {w.get('hole_max_clean')} unclean {w.get('hole_max_unclean')}; unclean holes>=4: {w.get('unclean_holes_ge4')} with max|Z| median {w.get('maxZ_median_unclean_holes_ge4')}; J clean {[round(w.get('J_mean_clean_th'+str(t), 0), 3) for t in th]} unclean {[round(w.get('J_mean_unclean_th'+str(t), 0), 3) for t in th]}" + (f" | viol windows {w['windows_with_violation']}: hole max noviol {w.get('hole_max_noviol')}, viol {w.get('hole_max_viol')}" if w['windows_with_violation'] else ''))
