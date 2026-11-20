"""Collect all outputs (out_server/ and out/) into compact tables printed as markdown-ready text."""
import json, glob, os, math, sys
S = '../out_server/'; Lc = '../out/'
def load(p):
    try: return json.load(open(p))
    except Exception as e: return None
print('## combo1 exact (heights below 2000)')
for c in ('ZETA', 'DH', 'TNR'):
    r = load(S + 'c1_exact_%s.json' % c)
    if not r: continue
    print(c, 'n', r['n'], 'first offline', r['first_offline_height'], 'dgamma/dtau first3', [round(x, 4) for x in r['dgamma_dtau_first3']])
    for row in r['rows']:
        print('  X=%g %-5s | all: corr %.3f slope %.3f | <85: corr %.3f (n=%d) | <200: %.3f | <1000: %.3f | std_E %.3g std_V %.3g' % (row['X'], row['weight'], row['all']['corr'], row['all']['slope'], row['below_85']['corr'], row['below_85']['n'], row['below_200']['corr'], row['below_1000']['corr'], row['all']['std_E'], row['all']['std_V']))
print('## combo1 lists')
for p in sorted(glob.glob(S + 'c1_list_*.json')):
    r = load(p)
    if not r: continue
    print(os.path.basename(p), 'height', r.get('height'), 'count', r.get('count'), 'V_std %.3f' % r.get('V_std', float('nan')))
    for row in r['rows']:
        d = row['corr_by_decile']
        print('  X=%g %-5s corr %.4f slope %.3f std_E %.3g | deciles min %.3f max %.3f | id-check %s' % (row['X'], row['weight'], row['full']['corr'], row['full']['slope'], row['full']['std_E'], min(d), max(d), row.get('identity_check_corr_prime_vs_zero_kernel')))
print('## combo2 float64 N=20000')
for p in sorted(glob.glob(S + 'c2_*.json')):
    r = load(p)
    if not r: continue
    print(os.path.basename(p))
    for x in r:
        if 'error' in x: print('  ', x['code'], x['t'], x['side'], 'ERROR', x['error'][:100]); continue
        print('   %-9s t=%-8g %-6s N=%d lam_min %+.3e lam_max %.3e rank %d | %s' % (x['code'], x['t'], x['side'], x['N'], x['lam_min'], x['lam_max'], x['num_rank'], ' '.join('%s=%s' % (k, x[k]) for k in ('n_online', 'n_offline', 'r_nodes', 'p_max_used') if k in x)))
print('## combo2 exact')
for p in (Lc + 'c2_exact.log', Lc + 'c2_exact_heat.log'):
    if not os.path.exists(p): continue
    for l in open(p):
        if l.startswith('{'):
            r = json.loads(l); print('   %-9s t=%g N=%d prec=%d n*=%s p*=%s decided=%d neg=%d first_off=%s log10|pivot|=%s' % (r['code'], r['t'], r['N'], r['prec'], r['n_star'], r['p_at_n_star'], r['decided'], r['negatives'], r['first_offline'], r['log10_first_neg_pivot']))
print('## combo3 float64')
for p in sorted(glob.glob(S + 'c3_*.json')):
    r = load(p)
    if not r: continue
    print(os.path.basename(p)); codes = []
    for x in r:
        if x['code'] not in codes: codes.append(x['code'])
    for c in codes:
        rows = [x for x in r if x['code'] == c]
        print('  ', c, 'wmax %.0f' % rows[0]['wmax'], ' '.join('%g:%+.1e(%d;%.0f)' % (x['a'], x['lam_min'], x['n_neg'], x['vec_peak_freq']) for x in rows))
print('## combo3 arb')
r = load(Lc + 'c3_arb.json') or []
for x in sorted(r, key=lambda x: (x['code'], x['a'])):
    print('   %-9s a=%-5g K=%d lam_min %s lam_2 %s neg_eig %d ldl %d/%d neg %d' % (x['code'], x['a'], x['K'], x['lam_min'], x['lam_2'], x['n_neg_eig'], x['ldl_decided'], 2 * x['K'] + 1, x['ldl_negatives']))
print('## combo4')
r = load(S + 'c4_vdc.json')
if r:
    for k, v in r.items():
        if isinstance(v, dict): print('   %-14s n*=%s decided=%d negatives=%d acc_bits=%d log10|piv| at 20,60,120: %s' % (k, v['n_star'], v['n_decided'], v['negatives'], v['min_rel_accuracy_bits'], [v['log10_abs_pivots'][i] for i in (19, 59, 119) if i < len(v['log10_abs_pivots'])]))
hz = load(S + 'hz.json') or []
for x in hz:
    off = x['offline']; on = x['online']
    if off:
        d, g = off[0]; print('   eps=%g first non-real: Re z=%.4f height=%.3f angle=%.4f | on-line below it: %d | on-line zeros of smaller modulus: %d | lowest on-line %.3f' % (x['eps'], d, g, math.atan2(d, g), sum(1 for t in on if t < g), sum(1 for t in on if t < math.hypot(d, g)), on[0] if on else float('nan')))
    else: print('   eps=%g none found below %g (seeds Re z <= 40)' % (x['eps'], x['tmax']))
print(load(S + 'gaplaw.json'))
