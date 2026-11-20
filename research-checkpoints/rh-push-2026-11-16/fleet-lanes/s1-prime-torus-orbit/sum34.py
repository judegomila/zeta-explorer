"""Compact tables from t3.json and t4.json."""
import sys, json
if len(sys.argv) > 1 and sys.argv[1]:
    r = json.load(open(sys.argv[1]))
    print('checks', r['checks']); print('coherent-weight quartiles (Haar)', r['coh_quartiles_haar'])
    print('fam T n bad(se) gramlaw f0 f2 chg/int | agree(cuts) | v model_orbit model_haar | corr(bad,coh) | small |')
    for x in r['rows']:
        print(f"{x['fam']:5s} {x['T']:.0e} {x['n_gram']} bad {x['bad_rate']:.4f}({x['bad_se']:.4f}) law {x['gram_law_frac']:.4f} f0 {x['frac0']:.4f} f2 {x['frac2']:.4f} chg {x['sign_changes_per_interval']:.4f}"
              f" defblk {x['blocks_with_deficit']} badNoDef {x['bad_rate_no_deficit_blocks']} (n {x['n_no_deficit']}) | agree {[round(v,3) for v in x['agree_torus_sign']]} cut* {x['model_cut']:.0e}"
              f" | v {x['v_fit']:.3f} mo {x['model_bad_orbit']:.4f} mh {x['model_bad_haar']:.4f} ts {x['torus_sign_bad_haar']:.4f} | corr {x['corr_bad_coh']:+.3f} | small {x['small_Z']} varO {x['var_arg_torus_orbit']:.3f} varH {x['var_arg_torus_haar']:.3f}")
        print('      bins:', ' '.join(f"[n{t['n']} act {t['actual']:.3f}±{t['se']:.3f} mod {t['model_orbit']:.3f} haar {t['model_haar']:.3f}]" for t in x['table'] if t['n']))
if len(sys.argv) > 2:
    r = json.load(open(sys.argv[2]))
    print('decades', r['decades']); print('AFE', r['afe'])
    for m, v in r['stageA'].items():
        print('stage A m', m, 'slope', v['slope'], '-1/m', round(v['minus_one_over_m'], 3), 'norm', round(v['norm'], 3), [round(c, 4) if c else None for c in v['record_curve']])
    for k, v in r['B'].items():
        print(f"{k:18s} wind {v['winding']:+.1f} rouche {v['rouche_threshold']:.3f} randmed {v['random_median']:.3f} best {v['best']:.3f} at {v['best_tau']:.4g} ({v['best_kind']}) slope {v['slope']}")
        print('      rec ', [round(c, 3) if c else None for c in v['best_curve']]); print('      rand', [round(c, 3) if c else None for c in v['curves']['rand']])
