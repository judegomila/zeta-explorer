import json, glob, os
d0 = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out_server')
print('object T | per Y: min M_K, fraction of samples with M_K < 0, max of Re G (bound for zeta under RH: (1/2) log(qt/2pi)), min of Re G')
for f in sorted(glob.glob(os.path.join(d0, 'p4_*.json'))):
    if 'deriv' in f or 'zetaD' in f: continue
    d = json.load(open(f)); T = float(d['T']); import math
    q = {'chi4': 4, 'chi5': 5}.get(d['obj'], 1); bound = 0.5 * math.log(q * T / (2 * math.pi))
    print(d['obj'], d['T'], 'arch %.3f' % bound, ' | '.join('Y %g: min %.3f, <0 %.2e, maxReG %.2f, minReG %.2f' % (r['Y'], r['M_K']['min'], r['M_K']['frac_below_0'], -r['ReG']['min'], -r['ReG']['max']) for r in d['cols'].values()))
