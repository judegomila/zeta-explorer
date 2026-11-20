"""Prints the tables of RESULT.md from the json files in out_server/ (and out/)."""
import json, glob, os, sys, numpy as np
D = sys.argv[1] if len(sys.argv) > 1 else 'out_server'
def L(fn):
    return json.load(open(fn)) if os.path.exists(fn) else None
print('== combination 2/3 per list')
for fn in sorted(glob.glob(D + '/c23_*.json')):
    d = L(fn); nm = d['name']; bf = d.get('block_min_fit', {}); c3 = d['c3']; cp = c3['closest_pairs']
    full = [(r['N'], r['tc_flow'], r['retardation'], r['in_bracket']) for r in d['ladder'] if 'tc_flow' in r]
    last = d['ladder'][-1]
    print('%-10s n=%d  block-min exponent %.4f +- %.4f prefactor %.3f local %s' % (nm, d['n'], bf.get('exponent', float('nan')), bf.get('exponent_err', float('nan')), bf.get('prefactor', float('nan')), np.round(bf.get('local_exponents', []), 3)))
    print('     ratio to GUE cubic law:', [(b['N'], round(b['ratio_to_gue'], 3), b['blocks']) for b in d['block_min']])
    print('     ladder: slope log t_c %.3f ; t_c(Nmax)=%.4e retard %.2e ; full-flow N max %s ; all in bracket %s ; theta<0.99 at %d of %d rungs' % (
        d['ladder_fit']['slope_log_tc_vs_log_N'], last['tc_window_ld'], last['retardation_window'], full[-1][0] if full else None, all(f[3] for f in full) if full else None,
        sum(r['tc_upper'] is None for r in d['ladder']), len(d['ladder'])))
    print('     full flow rows:', [(f[0], '%.4e' % f[1], '%.1e' % f[2]) for f in full][-4:])
    ek = [r['Ekin_growth_times_g4'][-1] for r in d['ladder'] if 'Ekin_growth_times_g4' in r]
    print('     Ekin growth * g^4:', np.round(ek, 4))
    print('     ansatz: t_c/E', ['%.2e' % v for v in d['ladder_fit']['ratio_tc_over_ansatz'][::4]], ' s_min/E', ['%.2f' % v for v in d['ladder_fit']['ratio_smin_over_ansatz'][::4]])
    print('     small-gap exponent %.2f ; P(s<0.05)/cubic %.2f' % (d['small_gap']['exponent_0p02_0p1'], d['small_gap']['P'][2]['frac'] / d['small_gap']['P'][2]['gue_cubic']))
    print('     gates: S<0 %d of %d ; frac S g^2>0.909 %.4f+-%.4f ; >2 %.4f ; close pairs %s' % (c3['S_negative'], c3['pairs'], c3['frac_gate_gt_0p909'][0], c3['frac_gate_gt_0p909'][1], c3['frac_gate_gt_2'][0], c3['close_pairs']))
    print('     running minimal pair: max gate %.4g ; all < 0.909 %s' % (max(m['gate_S_g2'] for m in c3['running_minimal_pair']), all(m['lt_0p909'] for m in c3['running_minimal_pair'])))
    print('     closest pairs:', {k: (np.round(v, 5).tolist() if isinstance(v, list) else v) for k, v in cp.items()})
print('== combination 4 zero side')
for fn in sorted(glob.glob(D + '/c4_disc_*.json')):
    d = L(fn)
    print('%-10s n=%d' % (d['name'], d['n']), [(w['N'], w['windows'], 'mean %.3f+-%.3f' % (w['mean'], w['sem'] or 0), 'med %.3f' % w['median'], 'max %.1f' % w['max'], 'nn %.2f' % w['nearest_neighbour_share']) for w in d['windows']])
    print('     running mean:', [(r['n'], round(r['mean'], 3)) for r in d['running_mean'][::3]])
