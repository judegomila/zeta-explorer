import json, glob, os, sys
d0 = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out_server')
for f in sorted(glob.glob(os.path.join(d0, 'p4_*.json'))):
    if 'deriv' in f or 'zetaD' in f: continue
    d = json.load(open(f)); print(d['obj'], 'T', d['T'], 'samples', d['n_samples'], 'nufft max err %.1e' % max(c['abs_diff'] for c in d['nufft_check']))
    for k, r in d['cols'].items():
        m = r['M_K']; g = r['ReG']
        s = '   Y %-5g M_K min %.4f max %.3f mean %.4f std %.4f below p_req %.3g blocks %s/%s | -ReG min %.3f max %.3f std %.4f' % (r['Y'], m['min'], m['max'], m['mean'], m['std'], m['frac_below_preq'], m['blocks_with_min_below_preq'], m['blocks_65536'], g['min'], g['max'], g['std'])
        if 'M_K_full_with_local_factor' in r:
            ff = r['M_K_full_with_local_factor']; s += ' | full with local factor: min %.3f mean %.3f below %.3g; factor term range %s' % (ff['min'], ff['mean'], ff['frac_below_preq'], [round(v, 3) for v in r['local_factor_term_range']])
        print(s)
