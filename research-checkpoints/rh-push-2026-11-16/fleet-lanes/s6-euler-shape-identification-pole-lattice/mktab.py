"""Builds tables.md from out/*.json and the logs (no computation)."""
import json, glob, math, re
L = []
def P(*a): L.append(' '.join(str(x) for x in a))
# ---- test 1
P('## Test 1: minimum normalised functional-equation residual R(|S|)\n')
P('| base | n = abs(S) | log p_n | R at theta = 0, pi and random starts (min, max) | R minimum (float64) | R minimum re-evaluated at 100 digits | band abs(Re s - 1/2) < 0.1: rms, min | band >= 0.5: rms, min |')
P('|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out/twin1_*.json')):
    for r in json.load(open(f)):
        b = r['bands']; g = lambda k: '%.4f, %.4f' % (b[k][1], b[k][2]) if k in b else '-'
        P('| %s | %d | %.1f | %.6f, %.6f | %.12f | %s | %s | %s |' % ({'fe': 'any base with a functional equation', 'wt': 'zeta(s + 1.7i)', 'liouville': 'zeta(2s)/zeta(s)'}[r['base']], r['n'], r['log_p_max'], r['R_start_range'][0], r['R_start_range'][1], r['R_min_float'], r['R_min_mp100'][:16], g('<0.1'), g('>=0.5')))
# ---- test 2
P('\n## Test 2: smallest singular value of the Jacobian at alpha = 1 (rms-normalised rows)\n')
P('| P | pi(P) | T | heights | route | sigma_min complex | sigma_min real | sigma_min real x P^(1/2) | frame constant (unit columns) | cone upper bound | support of cone vector | largest entries of the smallest real vector at primes |')
P('|---|---|---|---|---|---|---|---|---|---|---|---|')
seen = set(); J2 = []
for f in sorted(glob.glob('out/jac2_grid_*.json')):
    for x in json.load(open(f)):
        k = (x['P'], x['T'], x['n_t'])
        if k in seen: continue
        seen.add(k); J2.append(x)
for x in sorted(J2, key=lambda x: (x['P'], x['n_t'], x['T'])):
    c = x['complex']; r = x['real']
    P('| %d | %d | %.0e | %d | %s | %.3e | %.3e | %.3f | %.3e | %s | %s | %s |' % (x['P'], x['cols'], x['T'], x['n_t'], x.get('route', 'gram'), c['smin'], r['smin'], r['smin']*x['P']**0.5, r['frame_min'], ('%.3e' % x['cone_ub']) if 'cone_ub' in x else '-', x.get('cone_support', '-'), r['top_primes'][:3]))
for f, title in (('out/jac2_chi.json', 'comparison L-functions (parameter chi(p) at p)'), ('out/jac2_twist.json', 'bases without the functional equation')):
    try: R = json.load(open(f))
    except Exception:
        R = []
        for lf in glob.glob('logs/rh-s6esi-j2-*.log'):
            for l in open(lf):
                if l.startswith('{') and '"obj"' in l:
                    x = json.loads(l)
                    if ('chi' in x['obj']) == ('chi' in f) and x not in R: R.append(x)
        if not R: continue
    P('\n### ' + title + '\n')
    P('| object | P | T | heights | sigma_min complex | sigma_min real | frame constant | rms of r0 | rms after first-order repair |'); P('|---|---|---|---|---|---|---|---|---|')
    for x in R:
        P('| %s | %d | %.0e | %d | %.4e | %.4e | %.4e | %s | %s |' % (x['obj'], x['P'], x['T'], x['n_t'], x['complex']['smin'], x['real']['smin'], x['real']['frame_min'], ('%.4f' % x['r0_rms']) if 'r0_rms' in x else '-', ('%.4f' % x['r0_after_first_order']) if 'r0_after_first_order' in x else '-'))
# ---- test 3
P('\n## Test 3: Gram matrices of dilates\n')
P('### sparse route (zeta-type index sets), server\n')
P('| index set | sigma | N | lambda_min | lambda_max | lambda_min x lambda_max | local exponent of lambda_min | local exponent of lambda_max | residual of the smallest pair |'); P('|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out/gram3_sparse_*.json')):
    prev = None
    for x in json.load(open(f)):
        e = ('%.3f | %.3f' % (math.log(x['lam_min']/prev['lam_min'])/math.log(x['N']/prev['N']), math.log(x['lam_max']/prev['lam_max'])/math.log(x['N']/prev['N']))) if prev else '- | -'
        P('| %s | %s | %d | %.6g | %.6g | %.4f | %s | %.1e |' % ({1: 'all n (zeta, unimodular twist, sign twist, T-NR for N < q)', 2: 'n odd (chi_-4)', 5: '(n, 5) = 1 (chi_5)'}[x['q']], x['sigma'], x['N'], x['lam_min'], x['lam_max'], x['lam_min']*x['lam_max'], e, x['resid_min'])); prev = x
P('\n### dense route, all objects\n')
rows = {}
for f in sorted(glob.glob('out/gram3_dense_*.json')):
    for name, x in json.load(open(f)).items(): rows[(x['sigma'], name, x['N'])] = x
for f in glob.glob('out/g3d_local_*.log') + glob.glob('out/g3x_local*.log'):
    for l in open(f):
        if l.startswith('{'):
            for name, x in json.loads(l).items(): rows.setdefault((x['sigma'], name, x['N']), x)
Ns = sorted({k[2] for k in rows}); names = ['zeta', 'chi_-4', 'chi_5', 'DH', 'DHabs', 'DHsgn', 'E_a(0.02)', 'E_a(0.2)']
for sig in sorted({k[0] for k in rows}):
    P('\nsigma = %s\n' % sig)
    P('| object | ' + ' | '.join('N = %d: lambda_min, lambda_max' % N for N in Ns) + ' | exponent of lambda_min (last two N) | exponent of lambda_max | lacunary {4^k}: min, max | negative eigenvalues |'); P('|---|' + '---|'*(len(Ns)+4))
    for name in names:
        have = [N for N in Ns if (sig, name, N) in rows]
        if not have: continue
        cells = ['%.5g, %.5g' % (rows[(sig, name, N)]['lam_min'], rows[(sig, name, N)]['lam_max']) if (sig, name, N) in rows else '-' for N in Ns]
        if len(have) >= 2:
            a = rows[(sig, name, have[-2])]; b = rows[(sig, name, have[-1])]
            e1 = '%.3f' % (math.log(b['lam_min']/a['lam_min'])/math.log(b['N']/a['N'])); e2 = '%.3f' % (math.log(b['lam_max']/a['lam_max'])/math.log(b['N']/a['N']))
        else: e1 = e2 = '-'
        b = rows[(sig, name, have[-1])]
        P('| %s | %s | %s | %s | %s | %d |' % (name, ' | '.join(cells), e1, e2, ('%.4g, %.4g' % (b['lac4_min'], b['lac4_max'])) if 'lac4_min' in b else '-', max(rows[(sig, name, N)]['n_neg'] for N in have)))
# ---- test 4
P('\n## Test 4: rank-one Maass-Selberg Gram, first order with a negative pivot\n')
P('| design | bits | object | Y | first order with a certified negative pivot | orders certified positive | stopped undetermined at | smallest pivot (order, value) |'); P('|---|---|---|---|---|---|---|---|')
M4 = []
for f in sorted(glob.glob('logs/rh-s6esi-m4-*.log') + glob.glob('logs/rh-s6esi-m4w*.log') + glob.glob('logs/rh-s6esi-m4x*.log')):
    for l in open(f):
        if l.startswith('{'):
            r = json.loads(l)
            if 'error' in r: P('| %s | - | %s | %s | error %s |||||' % (r['design'], r['obj'], r['Y'], r['error'][:60])); continue
            M4.append(r)
order = ['zeta', 'chi_-4', 'chi_5', 'E_a', 'T-NR', 'DH', 'WT', 'Liouville']
for r in sorted(M4, key=lambda r: (r['design'], order.index(r['obj']), eval(r['Y']))):
    P('| %s | %d | %s | %s | %s | %d | %s | %d, %.3g |' % (r['design'], r['bits'], r['obj'], r['Y'], r['first_negative_order'] or 'none', r['orders_certified_positive'], r['undetermined_at'] or '-', r['min_pivot'][0], r['min_pivot'][1]))
try:
    T4 = json.load(open('out/ms4_threshold_local.json'))
    P('\n### threshold in Y (local, mpmath 1200 bits, no enclosures; design W1, order <= 120)\n')
    P('| object | Y | first order with a negative pivot | positive orders | smallest pivot (order, value) |'); P('|---|---|---|---|---|')
    for r in T4: P('| %s | %s | %s | %d | %d, %.3g |' % (r['obj'], r['Y'], r['first_negative_order'] or 'none', r['orders_certified_positive'], r['min_pivot'][0], r['min_pivot'][1]))
except Exception: pass
open('tables.md', 'w').write('\n'.join(L) + '\n'); print(len(L), 'lines')
