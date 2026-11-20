"""Tables for RESULT.md from c1.jsonl, c2.jsonl, c3.jsonl, c4.jsonl (text output)."""
import json, sys, os, math
def load(fn):
    return [json.loads(l) for l in open(fn) if l.startswith('{')] if os.path.exists(fn) else []
def r1(x, d=1): return None if x is None else round(x, d)
which = sys.argv[1:] or ['c1', 'c2', 'c3', 'c4']
if 'c1' in which:
    rows = load('c1.jsonl'); best = {}
    for r in rows:
        k = (r['code'], int(r['family'][4:]))
        if k not in best or r['bits'] >= best[k]['bits']: best[k] = r
    codes = sorted({k[0] for k in best}); ms = sorted({k[1] for k in best})
    print('C1: geo lattice 2^(k/m), n = 24m+1. cell: "+ log2(lambda_min or min pivot)" if all pivots positive, "NEG@k(nu) log2|piv|" at first negative pivot')
    print('m | n | bits | law T(rc=.5) | T(rc=.7) | ' + ' | '.join(codes))
    for m in ms:
        any_ = [best[(c, m)] for c in codes if (c, m) in best][0]
        cells = []
        for c in codes:
            r = best.get((c, m))
            if r is None: cells.append('-'); continue
            if r['first_negative'] is not None: cells.append('NEG@%d(%.3g) %d' % (r['first_negative'], r['first_negative_node'], round(r['first_negative_log2'])))
            elif r['undecided_at'] is not None: cells.append('UND@%d' % r['undecided_at'])
            else: cells.append('+ %s' % (('lmin %d' % round(r['log2_lambda_min'])) if r.get('log2_lambda_min') is not None else ('piv %d' % round(r['min_log2_pivot']))))
        print('%d | %d | %s | %.1f | %.1f | ' % (m, any_['n'], '/'.join(str(best[(c, m)]['bits']) for c in ('ZETA', 'DH') if (c, m) in best), any_['law_T_rc0.5'], any_['law_T_rc0.7']) + ' | '.join(cells))
if 'c2' in which:
    rows = load('c2.jsonl')
    print('\nC2: nodes k^p. code | p | n | bits | nu_max | result | bits at detection vs pi*gamma/(4 ln 2)')
    for r in rows:
        g = None
        if r['code'].startswith('PL:'): g = float(r['code'].split(':')[-1])
        res = ('NEG@n=%d (nu=%.4g) log2|piv|=%d' % (r['first_negative'] + 1, r['first_negative_node'], round(r['first_negative_log2']))) if r['first_negative'] is not None else ('UND@%d' % r['undecided_at'] if r['undecided_at'] is not None else 'all + (min log2 piv %d)' % round(r['min_log2_pivot']))
        ref = '' if g is None else 'ref %.0f' % (math.pi * g / (4 * math.log(2)))
        print(r['code'], '|', r['family'][4:], '|', r['n'], '|', r['bits'], '| %.4g |' % r['nu_max'], res, '|', ref)
if 'c3' in which:
    rows = load('c3.jsonl')
    print('\nC3: Pick index of R_a, Halton nodes in [xlo,2] x [Y0-Y, Y0+Y]. code | a | Y0 | Y | bits | n decided | index | first negative pivots (n, log2) | max|R| at nodes')
    for r in rows:
        print(r['code'], '|', r['a'], '|', r['Y0'], '|', r['Y'], '|', r['bits'], '|', r['decided_up_to'], '|', r['index'], '|', r['negative_pivots_n_log2'][:4], '| %.4f' % r['max_abs_R_at_nodes'])
if 'c4' in which:
    rows = load('c4.jsonl')
    print('\nC4: anticausal energy')
    for r in rows:
        if r['mode'] == 'own':
            print('own', r['code'], 'a', r['a'], 'T', r['T'], 'first off-line', r['first_offline'] and [round(x, 3) for x in r['first_offline']], 'E-', r1(r['E_minus'], 4), 'causalised', r1(r['E_minus_causalised'], 4), 'excess', '%.3g' % r['excess'], 'sigma', r1(r['sigma_causalised'], 4), 'excess/sigma', r1(r['excess_over_sigma'], 3))
        elif r['mode'] == 'planted':
            print('planted', r['base'], 'a', r['a'], 'delta', r['delta'], 'gamma', r['gamma'], 'T/gamma', r['T_over_gamma'], 'E- base', r1(r['E_minus_base'], 3), 'planted', r1(r['E_minus_planted'], 3), 'excess', '%.3g' % r['excess'], 'sigma', r1(r['sigma_base'], 4), 'excess/sigma', '%.3g' % r['excess_over_sigma'])
        else:
            print('sigma', r['code'], 'a', r['a'], 'T', r['T'], 'E-', r1(r['E_minus'], 3), 'E-/T', r1(r['E_minus'] / r['T'], 4), 'sigma', r1(r['sigma'], 4), 'slope', r1(r['slope'], 4))
