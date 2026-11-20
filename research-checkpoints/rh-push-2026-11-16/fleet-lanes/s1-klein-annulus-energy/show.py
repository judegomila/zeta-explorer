import json, sys
for fn in sys.argv[1:]:
    d = json.load(open(fn)); print('==', d['code'], d['T0'], d['ell'])
    for r in d['combo1']:
        print(' c1 al=%g b=%g | -th\' min %.3g mean %.3g N* %s | u min %.3g mean %.3g neg %.3f N* %s | D min %.3g mean %.3g neg %.3f N* %s' % (
            r['alpha'], r['b'], r['mtheta_min'], r['mtheta_mean'], r['mtheta_Nstar'], r['u_min'], r['u_mean'], r['u_negfrac'], r['u_Nstar'], r['D_min'], r['D_mean'], r['D_negfrac'], r['D_Nstar']))
    for r in d['combo3']:
        print(' c3 a=%g h=%g | t %d valid %d fire %d (%.4f) viol %d | lhs<0 %d | identity dev %.2e | min slack %.3g' % (
            r['a'], r['h'], r['n_t'], r['n_valid'], r['n_fire'], r['frac_fire'], r['n_violation'], r['n_lhs_negative'], r['identity_max_rel_dev'], r['min_rel_slack']))
    for r in d['combo4']:
        print(' c4 a=%g turns %.3f rate %.4f th\'min %.3g G %s' % (r['a'], r['turns'], r['turn_rate'], r['theta_prime_min'], ' '.join('%s:%.4f' % (k, v) if v is not None else k + ':-' for k, v in r['G'].items())))
