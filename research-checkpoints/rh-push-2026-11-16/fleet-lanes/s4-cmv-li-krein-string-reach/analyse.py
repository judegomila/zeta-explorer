"""collect results into summary.json and print tables"""
import json, glob, math, os, sys
import numpy as np
S = {}
def load(p):
    try: return json.load(open(p))
    except Exception: return None
Z = [float(x) for x in json.load(open('zeros_ZETA.json'))]
import bisect
# ---- combination 1/2: exact runs
rows = []
for p in sorted(glob.glob('out/zeta_a*_N*.json') + glob.glob('out/lchi4_*.json') + glob.glob('loc/zeta_a*_N*.json')):
    d = load(p)
    if not d: continue
    rows.append(dict(file=os.path.basename(p), code=d['code'], a=d['a'], N=d['N'], prec=d['prec'], first_nonpositive_index=d['first_nonpositive_index'],
                     last_index=d['last_index'], last_log2E=d['last_log2E'], eigen=d['eigen_angles'], lev_s=d['levinson_s'], mom_s=d['moments_s']))
    print(os.path.basename(p), 'first E<=0:', d['first_nonpositive_index'], 'last', d['last_index'], 'log2E', round(d['last_log2E'], 1), 'time', d['moments_s'], d['levinson_s'])
    for k, v in d['eigen_angles'].items(): print('    size', k, 'prefix', v['beta+1']['prefix'], v['beta-1']['prefix'], 'count', v['beta+1']['count'], v['beta-1']['count'])
S['exact'] = rows
# planted reach laws
laws = {}
for p in sorted(glob.glob('out/zeta_a*_N*.json') + glob.glob('loc/zeta_a*_N*.json')):
    d = load(p)
    if not d or not d['planted']: continue
    key = p
    tab = {}
    for c in d['planted']:
        tab.setdefault((c['kind'], c['delta']), []).append((c['gamma'], c['first_indefinite_size']))
    out = {}
    for (kind, dl), v in tab.items():
        v.sort(); det = [(g, n) for g, n in v if n]
        ent = dict(points=[(round(g, 3), n, bisect.bisect(Z, g)) for g, n in v])
        if len(det) >= 3:
            lg = np.log([g for g, n in det]); ln = np.log([n for g, n in det])
            b, A = np.polyfit(lg, ln, 1); ent['fit_all'] = dict(A=float(math.exp(A)), b=float(b), n=len(det))
            hi = [(g, n) for g, n in det if g >= 100]
            if len(hi) >= 3:
                b2, A2 = np.polyfit(np.log([g for g, n in hi]), np.log([n for g, n in hi]), 1); ent['fit_gamma_ge_100'] = dict(A=float(math.exp(A2)), b=float(b2), n=len(hi))
            ent['local_exponents'] = [round(float((ln[i + 1] - ln[i]) / (lg[i + 1] - lg[i])), 3) for i in range(len(det) - 1)]
            ent['N_over_count_below'] = [round(n / max(1, bisect.bisect(Z, g)), 2) for g, n in det]
        out['%s:%s' % (kind, dl)] = ent
    laws[key] = out
    print('==', key, 'a', d['a'])
    for k, e in out.items():
        print('  ', k, 'fit', e.get('fit_all'), 'fit>=100', e.get('fit_gamma_ge_100'))
        print('      points (gamma, N_det, zeros below):', e['points'])
        if 'local_exponents' in e: print('      local exponents', e['local_exponents'], ' N/zeros below', e['N_over_count_below'])
S['reach'] = laws
# controls
ctl = {}
for src, pat in (('server', 'out/ctl_*.json'), ('local', 'loc/cmv_*.json')):
    for p in sorted(glob.glob(pat)):
        d = load(p)
        if d: ctl[src + ':' + os.path.basename(p)] = dict(code=d['code'], a=d['a'], N=d['N'], prec=d['prec'], first=d['first_nonpositive_index'], last=d['last_index'], log2E=round(d['last_log2E'], 1), eigen=d['eigen_angles'])
S['controls'] = ctl
print('== controls (first Levinson index with E <= 0)')
for k, v in ctl.items(): print('  ', k, v['code'], 'a', v['a'], 'prec', v['prec'], 'first', v['first'], 'last', v['last'], 'log2E', v['log2E'], {kk: (vv['beta+1']['prefix'], vv['beta-1']['prefix']) for kk, vv in v['eigen'].items()})
# truncated data
tr = {}
for p in sorted(glob.glob('out/trunc*/trunc_a*.json')):
    d = load(p)
    if d:
        r = dict(d['results']); l2 = r.pop('ZETA:log2E', None); tr[os.path.basename(p)] = dict(a=d['a'], n=d['n'], prec=d['prec'], results=r, zeta_log2E=l2)
        print('==', p, 'n', d['n']); 
        for k, v in r.items(): print('   ', k, v)
S['trunc'] = tr
# combination 3
c3 = {}
for src, pat in (('server', 'out3/*.json'), ('local', 'loc/hk_*.json')):
    for p in sorted(glob.glob(pat)):
        d = load(p)
        if not d or 'base' not in d: 
            if d and 'n_jacobi' in d: c3[src + ':' + os.path.basename(p)] = d
            continue
        e = dict(code=d['code'], M=d['M'], prec=d['prec'], s0=d['s0'], base=d['base'], planted=d.get('planted', []), seconds=d.get('seconds'))
        c3[src + ':' + os.path.basename(p)] = e
        print('c3', src, os.path.basename(p), d['code'], 'M', d['M'], 'prec', d['prec'], 's0', d['s0'][:22], d['base'])
        for pl in e['planted']: print('     ', pl['label'], 'first neg', pl['first_negative'], 'negs', pl['negatives_head'][:4], 'zeros below', pl['nbelow'])
S['c3'] = c3
c4 = {}
for p in sorted(glob.glob('out4/*.json')):
    d = load(p)
    if d and 'history' in d:
        c4[os.path.basename(p)] = d
        print('c4', os.path.basename(p), 'N', d['N'], 'M', d['M'], 'its', len(d['history']), 'final max res', d['history'][-1]['max_abs_res'], 'dV l2', round(d['dV_l2'], 2), 'max', round(d['dV_max'], 2))
        for key in ('residual_list', 'dV_spectrum'):
            x = d[key]; print('    ', key, 'corr', round(x['corr_with_Lambda_shape'], 3), 'max non-pp', x['max_non_prime_power'], 'mean non-pp', round(x['mean_non_prime_power'], 2), 'lines>5bg', x['lines_above_5bg'], 'c', x.get('dispersion_c'))
S['c4'] = c4
json.dump(S, open('summary.json', 'w'), indent=1, default=str)
