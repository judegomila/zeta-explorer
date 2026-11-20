"""Prints all tables of RESULT.md from the json files in out_server/ (and out/ for the local rechecks). Usage: mk_tables.py > out/tables.md"""
import json, glob, os, math, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
TWO_PI = 2 * math.pi; CC = math.sqrt(3 * math.pi) / 8; E_TRUNC = 3.06e-5
def T_of_N(N):
    T = max(20.0, TWO_PI * N / max(math.log(max(N, 3)), 1))
    for _ in range(60):
        f = T / TWO_PI * (math.log(T / TWO_PI) - 1) + 0.875 - N; T -= f / (math.log(T / TWO_PI) / TWO_PI)
    return T
def surrogate(N):
    T0 = T_of_N(N); L = math.log(T0); CF = (math.log(T0 / TWO_PI) + 1) / TWO_PI
    Ef = CF * L / T0 * math.exp(2.37e-4); Ec = CC * math.sqrt(L / N); return dict(T0=T0, E_flow=Ef, E_coll=Ec, E=Ef + Ec + E_TRUNC)
def least_CC(D, N):
    s = surrogate(N); return max(0.0, D - E_TRUNC - s['E_flow']) / math.sqrt(math.log(s['T0']) / N)
S = 'out_server/'
def L(fn):
    return json.load(open(fn)) if os.path.exists(fn) else None
g = lambda v, f='%.4g': ('-' if v is None else f % v)

print('## Table T1a: truncation ladder of the controls (Lambda units, z = 2 gamma)\n')
print('T_N = last landing time of the first N zeros (bare: zeros and mirrors only; tail: plus the smooth density above the cut). Lambda_ref = exact value (WIT) or the tail value at the largest N.')
print('D = |Lambda_ref - T_N(bare)|; E(N) = source surrogate; C_C(F, N) = least constant with D <= E_trunc + E_flow + C_C sqrt(log T0 / N) (source value 0.38375).\n')
objs = ['WIT-1-0.6', 'WIT-3-0.6', 'DH', 'HEAT--0.1', 'HEAT--0.5', 'EA-0.1', 'EA-0.02', 'TNR-1000003-2.2', 'TNR-3-2.2']
ref = {}
for o in objs:
    b = L(S + 't1_%s_bare.json' % o); t = L(S + 't1_%s_tail.json' % o)
    if b is None: continue
    rows = list(b['rows']); tr = {r['N']: r for r in (t['rows'] if t else [])}
    fz = {}
    for fn in sorted(glob.glob(S + 't1_%s_bare_M*.json' % o)) + sorted(glob.glob(S + 't1_%s_bare_top*.json' % o)):
        if 'partial' in fn: continue
        for r in json.load(open(fn))['rows']:
            if r.get('T_N') is not None: fz.setdefault(r['N'], {})['top' if '_top' in fn else 'low'] = r
    for N_, dd in fz.items():
        lo_, tp_ = dd.get('low'), dd.get('top'); best = max([x for x in (lo_, tp_) if x], key=lambda x: x['T_N']); r = dict(best); r['frozen'] = True
        r['fz_note'] = 'frozen zones: lowest %s zeros give %s, highest %s give %s' % (lo_['moving'] if lo_ else '-', g(lo_['T_N'], '%.9f') if lo_ else 'not run', tp_['moving'] if tp_ else '-', g(tp_['T_N'], '%.9f') if tp_ else 'not run')
        full = [x for x in rows if x['N'] == N_ and not x.get('frozen')]
        if full: full[0]['fz_note'] = 'full flow; ' + r['fz_note']
        else: rows.append(r)
    for fn in sorted(glob.glob(S + 't1_%s_tail_M*.json' % o)):
        if 'partial' in fn: continue
        for r in json.load(open(fn))['rows']: tr[r['N']] = r
    if o.startswith('WIT'): lam = b['Lambda_exact']; src = 'exact closed form'
    elif o.startswith('HEAT'): lam = abs(float(o[5:])); src = 'exact: |tau| + Lambda(zeta), shown with Lambda(zeta) = 0; tail value at the largest N: %.9f' % max(r['T_N'] for r in tr.values() if r.get('T_N') is not None)
    else:
        cand = [r for r in tr.values() if r.get('T_N') is not None]; top = max(cand, key=lambda r: r['N']) if cand else None
        lam = top['T_N'] if top else None; src = 'tail value at N = %d' % top['N'] if top else '-'
    ref[o] = lam
    print('**%s**: Lambda_ref = %s (%s)\n' % (o, g(lam, '%.9f'), src))
    print('| N | pairs | T_N bare | at height (beta - 1/2) | T_N tail | D | E(N) | D / E(N) | C_C(F, N) | note |'); print('|---|---|---|---|---|---|---|---|---|---|')
    for r in sorted(rows, key=lambda r: (r['N'], r.get('frozen', False))):
        N = r['N']; T = r.get('T_N'); s = surrogate(N)
        if T is None:
            print('| %d | 0 | (all real: -4 t_c) | - | - | >= %s | %s | >= %s | >= %s | no off-line zero among the first N |' % (N, g(lam), g(s['E']), g(lam / s['E'] if lam else None), g(least_CC(lam, N) if lam else None))); continue
        D = abs(lam - T) if lam is not None else None; tt = tr.get(N, {}).get('T_N')
        print('| %d | %s | %.9f | %s | %s | %s | %s | %s | %s | %s |' % (N, r.get('n_pairs', 1), T, ('%.3f (%.4f)' % (r['argmax_gamma'], r['argmax_x'])) if 'argmax_gamma' in r else '0', g(tt, '%.9f'), g(D, '%.3e'), g(s['E'], '%.3e'),
              g(D / s['E'] if D is not None else None, '%.3g'), g(least_CC(D, N) if D is not None else None, '%.3g'), r.get('fz_note', '')))
    print()
for fn in sorted(glob.glob('out/t1_exact_*.json')):
    d = json.load(open(fn)); print('High-precision recheck %s N = %d: Newton on the polynomial heat flow (%d digits) %s ; float64 flow %.12f ; difference %.2e\n' % (d['obj'], d['N'], d['dps'], d['T_exact'][:32], d['T_flow'], d['diff']))

print('\n## Table T1b / T3a: real lists, first collision time on the first N ordinates (4 t_c in Lambda units) against the surrogate\n')
z = L(S + 't3_zeta.json')
if z:
    print('zeta, first 100,116,297 ordinates; %d records of the minimal gap. Fit of log(4 t_c) against log N over the ladder: %.3f (surrogate E: %.3f).\n' % (len(z['records']), z['fit_all']['p_tc'], z['fit_all']['p_E']))
    print('| N | T0 | g_min | t_c (gamma units) | 4 t_c | E(N) | sigma(N) | 4 t_c / E(N) | t_c / E(N) | C_C if Lambda = 0 |'); print('|---|---|---|---|---|---|---|---|---|---|')
    for r in z['ladder'][::2] + [z['ladder'][-1]]:
        print('| %d | %.4g | %.6g | %.5e | %.5e | %.4e | %.4f | %.4g | %.4g | %.3g |' % (r['N'], r['T0'], r['gmin'], r['tc_gamma'], r['tc_lambda'], r['E'], r['sigma'], r['ratio_tc_over_E'], r['ratio_tc_over_E'] / 4, r['least_CC_if_Lambda_0']))
    print('\nPer decade (zeta):\n\n| N range | p(N) of 4 t_c | p of E(N) | p of E_coll | sigma at mid-decade | dyadic steps with zero increment | p of the non-zero increments | 4 t_c / E at the ends |'); print('|---|---|---|---|---|---|---|---|')
    for d in z['decades']: print('| %g .. %g | %.2f | %.3f | %.3f | %.4f | %d of %d | %s | %.3g .. %.3g |' % (d['lo'], d['hi'], d['p_tc'], d['p_E'], d['p_Ecoll'], d['sigma_mid'], d['zero_increments'], d['dyadic_steps'], g(d['p_increments'], '%.2f'), d['tc_over_E_lo'], d['tc_over_E_hi']))
    print('\nBlocks of N consecutive zeros in the upper half of the list (heights 2.2e7 .. 4.3e7): median of (min gap)^2 / 2: ' + ', '.join('N = %g: %.3e (%d blocks)' % (b['N'], b['median_tc_lambda'], b['blocks']) for b in z['blocks_upper_half']) + '; exponent %.3f.\n' % z['blocks_exponent_median'])
print('| list | zeros | p of 4 t_c (whole ladder) | per decade from N = 100: p (zero increments / dyadic steps) | 4 t_c / E at N = 128 and at the top | C_C if Lambda = 0: max over the ladder (at N) | block exponent |'); print('|---|---|---|---|---|---|---|')
for nm in ['zeta', 'L4', 'L5', 'chi', 'chibar', 'dh', 'alt', 'heat_0', 'heat_-1e-4', 'heat_-5e-4', 'heat_-2e-3', 'heat_-1e-2']:
    e = L(S + 't3_%s.json' % nm)
    if not e: continue
    mx = max(e['ladder'], key=lambda r: r['least_CC_if_Lambda_0'])
    print('| %s | %d | %.3f | %s | %.3g, %.3g | %.3g (%d) | %s |' % (nm, e['n'], e['fit_all']['p_tc'], '; '.join('%.2f (%d/%d)' % (d['p_tc'], d['zero_increments'], d['dyadic_steps']) for d in e['decades']),
          e['ladder'][0]['ratio_tc_over_E'], e['ladder'][-1]['ratio_tc_over_E'], mx['least_CC_if_Lambda_0'], mx['N'], g(e.get('blocks_exponent_median'), '%.3f')))

print('\n## Table T2a: curvature at the shock point of the first N zeros (zero side)\n')
print('y_N = sqrt(2 pi / N); r = g_min / (2 y_N); nu = c y_N^3 / 4 (pole units); C_H = sqrt(2 / c).\n')
for nm in ['zeta', 'tnr', 'ea', 'L4', 'L5', 'chi', 'dh', 'dhfull', 'alt', 'heat_0', 'heat_-1e-4', 'heat_-2e-3', 'heat_-1e-2']:
    d = L(S + 't2z_%s.json' % nm)
    if not d: continue
    f = d.get('ladder_fit') or {}
    print('- **%s** (%d ordinates): ' % (nm, d['n']) + '; '.join('N = %g: r %.2f, nu %.3g' % (r['N'], r['r'], r['nu']) + ((' (with off-line zeros %.3g)' % r['nu_full']) if 'nu_full' in r else '') for r in d['ladder']) + '. Exponent of c: %s (pole scale 1.5); of nu: %s; of r: %s.' % (g(f.get('p_c'), '%.3f'), g(f.get('p_nu'), '%.3f'), g(f.get('p_r'), '%.3f')))
print('\n## Table T2b: block footers (closest pair of each block), every y_N\n')
print('| list | blocks x zeros | N | y_N / mean spacing | r: 1 %, median, 99 % | nu: min, median | c: min, 1 %, median | fraction nu > 1/2 | c / (pair only): min, max |'); print('|---|---|---|---|---|---|---|---|---|')
for nm in ['zeta', 'tnr', 'ea', 'chi', 'L4', 'L5', 'dh', 'dhfull', 'alt', 'heat_0', 'heat_-1e-4', 'heat_-2e-3', 'heat_-1e-2']:
    d = L(S + 't2z_%s.json' % nm)
    if not d: continue
    for b in d['blocks']['rows']:
        if b['N'] in (1e3, 1e4, 1e5, 1e6, 1e8):
            print('| %s | %d x %d | %g | %.2g | %.3g, %.3g, %.3g | %.3g, %.3g | %.3g, %.3g, %.3g | %.3f | %.3g, %.3g |' % (nm, d['blocks']['NB'], d['blocks']['W'], b['N'], b['y_over_spacing_median'], b['r_q'][1], b['r_q'][2], b['r_q'][3], b['nu_min'], b['nu_median'], b['c_min'], b['c_q01'], b['c_median'], b['frac_nu_gt_half'], b['c_over_pair_q'][0], b['c_over_pair_q'][4]))
d = L(S + 't2z_dhfull.json')
if d:
    print('\nDH with its off-line pairs added (294 blocks, %s of them farther than 10 mean spacings from every off-line pair): relative change of c, median / max over the far blocks, and median over the near blocks: ' % d['blocks'].get('far_blocks') +
          '; '.join('N = %g: %.1e / %.1e, %.1e' % (b['N'], b['rel_change_far_median'], b['rel_change_far_max'], b['rel_change_near_median']) for b in d['blocks']['rows'] if b['N'] in (1e3, 1e5, 1e8)) + '.')
print('\n## Table T2c: prime side of the curvature at the block footers\n')
print('| family | footers (heights) | N | y_N log X | X | c zero side (median) | sharp cut-off / zero side: 10 %, 50 %, 90 % | Riesz / zero side | relative error of the Riesz sum | identity residual (median) | T-NR extra term / zero-side sum (median) |'); print('|---|---|---|---|---|---|---|---|---|---|---|')
for nm, f in (('zeta', 'zeta'), ('L(chi_-4)', 'L4'), ('L(chi_5)', 'L5')):
    d = L(S + 't2p_%s.json' % f)
    if not d: continue
    for r in d['rows']:
        if r['X'] in (1e6, 1e10):
            print('| %s | %d (%.3g .. %.3g) | %g | %.2f | %g | %.3g | %s | %s | %s | %.1e | %s |' % (nm, d['footers'], d['heights'][0], d['heights'][1], r['N'], r['yL'], r['X'], r['c_zero_median'], ', '.join('%.2g' % v for v in r['ratio_sharp_q']), ', '.join('%.2g' % v for v in r['ratio_riesz_q']),
                  ', '.join('%.2g' % v for v in r['relerr_riesz_q']), r['identity_residual_q'][1], g(r.get('tnr_extra_over_zero_median'), '%.3g')))

print('\n## Table T4a: S(t) on the prime side: r_rms / r_sup = (rms, sup of |S_X| over a window of 2048 mean spacings) / sqrt(log log T / (2 pi^2))\n')
fams = ['zeta', 'liou', 'rnd', 'chi4', 'chi5', 'tnr1000003', 'ea0.1']
print('| T | X | theta | ' + ' | '.join(fams) + ' |'); print('|---|---|---|' + '---|' * len(fams))
for fn in sorted(glob.glob(S + 't4p_*.json'), key=lambda s: float(s.split('_')[-1][:-5])):
    d = json.load(open(fn))
    for X in d['cuts']:
        rr = {r['family']: r for r in d['rows'] if r['X'] == X}
        print('| %g | %g | %.2f | ' % (d['T'], X, math.log(X) / math.log(d['T'])) + ' | '.join('%.3f / %.2f' % (rr[f]['r_rms'], rr[f]['r_sup']) for f in fams) + ' |')
print('\n## Table T4b: S(t) from the zero lists (windows of 2048 zeros; S continuous in t)\n')
print('| list | height | windows | rms S | r_rms | sup: median, max over windows | r_sup: median, max | drift of S per zero | rms after removing a linear trend per window |'); print('|---|---|---|---|---|---|---|---|---|')
for nm in ['zeta', 'zeta_1e9', 'zeta_1e12', 'L4', 'L5', 'chi', 'chibar', 'dh', 'dhfull', 'alt', 'heat_0', 'heat_-1e-4', 'heat_-5e-4', 'heat_-2e-3', 'heat_-1e-2']:
    d = L(S + 't4z_%s.json' % nm)
    if not d: continue
    for b in d['by_height']:
        print('| %s | %.3g | %d | %.4g | %.4g | %.4g, %.4g | %.3g, %.3g | %.2e | %.4f |' % (nm, b['T_median'], b['windows'], b['rms_all'], b['r_rms'], b['sup_median'], b['sup_max'], b['r_sup_median'], b['r_sup_max'], b['drift_per_zero_median'], b['detrended_rms']))
print('\n## Table T4c: Palm density around close pairs (normalised gap below 0.2) against rho(u) = 1 - S^2 - 3 S\'^2 / pi^2\n')
print('| list | selection | pairs | mean gap | deficit on [-6, 6] (model 1.933) | deficit on [-3, 3] (model 1.865) | rms distance to rho on [-3, 3] | to 1 - S^2 | statistical error per bin | fraction of gaps below 0.2 (GUE 0.00877) | small-gap exponent |'); print('|---|---|---|---|---|---|---|---|---|---|---|')
for nm in ['zeta', 'zeta_1e9', 'zeta_1e12', 'L4', 'L5', 'chi', 'chibar', 'dh', 'dhfull', 'alt', 'heat_0', 'heat_-1e-4', 'heat_-5e-4', 'heat_-2e-3', 'heat_-1e-2']:
    d = L(S + 't4z_%s.json' % nm)
    if not d: continue
    for p in d['palm']:
        if p['pairs'] and p['label'] != 's < 0.1':
            ex = d['small_gap_exponent']; cf = d['close_fraction']
            for thr in ('5', '10', '20'):
                if ('farther than %s ' % thr) in p['label']: ex = d['small_gap_exponent_far_' + thr]; cf = d['close_fraction_far_' + thr]
            if 'within' in p['label']: ex = cf = None
            print('| %s | %s | %d | %.3f | %.3f | %.3f | %.4f | %.4f | %.4f | %s | %s |' % (nm, p['label'], p['pairs'], p['mean_gap'], p['deficit_6'], p['deficit_3'], p['l2_to_palm2'], p['l2_to_palm1'], p['stat_err'], g(cf, '%.5f'), g(ex, '%.2f')))
