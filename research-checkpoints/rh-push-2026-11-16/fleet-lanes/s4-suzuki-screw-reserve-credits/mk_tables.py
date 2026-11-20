"""assembles the result tables (markdown fragments) from the output files; usage: mk_tables.py <control sweep prefix> <N> <c4 json> [<top sweep prefix> <N top>]"""
import sys, json, math, collections, subprocess, os
import numpy as np
pref, N, c4f = sys.argv[1], float(sys.argv[2]), sys.argv[3]
top, Ntop = (sys.argv[4], float(sys.argv[5])) if len(sys.argv) > 5 else (pref, N)
PY = sys.executable
an = json.loads(subprocess.run([PY, 'analyze12.py', pref, str(N), '/dev/stdout'], capture_output=True, text=True).stdout.split('\n{', 1)[1].join(['{', '']) if False else '{}')
subprocess.run([PY, 'analyze12.py', pref, str(N), 'out/an_tables.json'], capture_output=True, text=True)
an = json.load(open('out/an_tables.json')); pred = json.load(open('pred1.json'))
subprocess.run([PY, 'analyze12.py', top, str(Ntop), 'out/an_top.json'], capture_output=True, text=True)
antop = json.load(open('out/an_top.json')); json.dump(dict(ctl=an, top=antop, Ntop=Ntop), open('out/an_both.json', 'w'))
c1 = an['comb1']; frag = {}
def fmt(x, d=6): return ('%.' + str(d) + 'f') % x
# ---------- C1 zeta premise
rows = ['| N | events | min Psi at events | max Psi at events | min of R_n - eps(H_n) | negative events | arithmetic |', '|---|---|---|---|---|---|---|']
def one(prefix, n, arith):
    if not os.path.exists(prefix + '.bins.txt'): return
    subprocess.run([PY, 'analyze12.py', prefix, str(n), 'out/_tmp.json'], capture_output=True, text=True)
    z = json.load(open('out/_tmp.json'))['comb1']['zeta']
    rows.append('| %.0e | %s | %.7f | %.7f | %.7f | 0 | %s |' % (n, format(z['events'], ','), z['min_psi'], z['max_psi'], z['min_R_low'], arith) if z['negative_events'] == 0 else '| %.0e | FAIL |' % n)
one('out/s1e8', 1e8, '80-bit'); one('out/t1e10', 1e10, '80-bit'); one('out/d1e10', 1e10, 'float64'); one('out/d1e11', 1e11, 'float64'); one('out/ea2e11', 2e11, 'float64 (Mac)'); one('out/S1e12', 1e12, 'float64, 8 units')
frag['C1ZETA'] = '\n'.join(rows) + '\n\nBand: max Psi <= 0.0689080 < 0.092420 at every size. Comparison: L(s,chi_-4) min %.6f, max %.6f (band 0.312059); L(s,chi_5) min %.6f, max %.6f (band 0.313828); no negative event to N = %.0e.' % (
    antop['comb1']['L_chi-4']['min_psi'], antop['comb1']['L_chi-4']['max_psi'], antop['comb1']['L_chi5']['min_psi'], antop['comb1']['L_chi5']['max_psi'], Ntop)
# ---------- C1 controls
dhhead = open('out/dh22.bins.txt').readline(); dhq = int(dhhead.split('firstneg=')[1].split()[0])
eaq = None
if os.path.exists('out/ea2e11.first.txt'):
    for ln in open('out/ea2e11.first.txt'):
        if ln.startswith('Ea0.05'): eaq = int(ln.split('firstneg_psi=')[1].split()[0])
if c1['Ea0.05']['first_negative_q']: eaq = c1['Ea0.05']['first_negative_q']
dhp = json.load(open('dh_zero_pred.json'))['onset']
ctl = [
 ('DH', dhq, dhp, '0.8085 + 85.699i (first of 84 pairs to height 2000)', 1.306, '3.562 (3.44-3.48 certified)'),
 ('E_a, a = 0.25', c1['Ea0.25']['first_negative_q'], pred['Ea0.25']['first_negative_r'], '0.75 + 14.135i', 0.405, '0.874'),
 ('E_a, a = 0.10', c1['Ea0.10']['first_negative_q'], pred['Ea0.10']['first_negative_r'], '0.60 + 14.135i', 0.405, '0.94 (a = 1/8)'),
 ('E_a, a = 0.05', eaq, pred['Ea0.05']['first_negative_r'], '0.55 + 14.135i', 0.405, '1.007'),
 ('T-NR(3,2.2), own bridge', c1['TNR3_2.2']['first_negative_q'], pred['TNR3_2.2_own']['first_negative_r'], '0.9038 + 2.860i', None, '1.241'),
 ('T-NR(3,2.01), own bridge', c1['TNR3_2.01']['first_negative_q'], pred['TNR3_2.01_own']['first_negative_r'], '0.5910 + 2.860i', None, '1.456-1.459 (this run, m = 2048)'),
 ('T-NR(3,2.2), zeta bridge', c1['TNR3_2.2zb']['first_negative_q'], pred['TNR3_2.2_zb']['first_negative_r'], '0.9038 + 2.860i', None, '1.104'),
]
rows = ['| control | first q with Psi < 0 | log q | predicted from the zero list | lowest off-line zero | (1/2) log(gamma_off/2pi) | full-form onset (rounds 2-3), support |', '|---|---|---|---|---|---|---|']
for nm, q, pr, z, half, on in ctl:
    rows.append('| %s | %s | %s | %.3f | %s | %s | %s |' % (nm, format(q, ',') if q else 'none to %.0e' % N, ('%.3f' % math.log(q)) if q else '-', pr, z, ('%.3f' % half) if half else '< 0', on))
rows.append('| Liouville, random signs, cos(3 log n) twist (zeta bridge), to 1e9 | none (min Psi 0.0636); band left at q = 3, the first event after the changed prime 2 | - | - | pole/zero at s = 1 | - | 0.726-0.734 |')
rows.append('| flip10 (zeta bridge), to 1e10 | none (min Psi 0.0413); R_n - eps < 0 first at q = 59 (first flipped prime); band left in r in [4.15, 4.20) | - | - | - | - | log 59 + 0.005 |')
rows.append('| heat tau < 0 | N | | | | | |')
frag['C1CTL'] = '\n'.join(rows) + '\n\nBetween events the T-NR minimum is interior (convex C), so the predicted r is slightly below the first failing event. DH minimum after the onset: -0.0627 in r in [19.65, 19.70) (zero list: -0.0626 at 19.654), -0.1454 in [21.00, 21.05) (zero list: -0.1427).'
# ---------- C2 variation
c2 = dict(antop['comb2']); c2['flip10'] = an['comb2']['flip10']
Ls = [t['L'] for t in c2['zeta']['table']]
rows = ['| L = log X | ' + ' | '.join('%g' % l for l in Ls) + ' |', '|---|' + '---|'*len(Ls)]
def line(lab, key, o): rows.append('| %s | ' % lab + ' | '.join(('%.4f' % t[key]) if abs(t[key]) < 1e3 else ('%.3g' % t[key]) for t in c2[o]['table'][:len(Ls)]) + ' |')
line('zeta: V sqrt X / L', 'V_sqrtX_over_L', 'zeta'); line('zeta: V / bound', 'ratio_to_bound', 'zeta'); line('zeta: V / model', 'ratio_to_model', 'zeta')
line('zeta, tilde credits: V / bound', 'ratio_to_bound', 'zeta_tilde')
line('T-NR(3,2.2): V / bound', 'ratio_to_bound', 'TNR3_2.2'); line('T-NR(3,2.01): V / bound', 'ratio_to_bound', 'TNR3_2.01')
if 'flip10' in c2 and len(c2['flip10']['table']) >= 1:
    t = {x['L']: x for x in c2['flip10']['table']}; rows.append('| flip10 (to 1e10): V / bound | ' + ' | '.join(('%.3g' % t[l]['ratio_to_bound']) if l in t and l <= 22 else '-' for l in Ls) + ' |')
N2 = Ntop
frag['C2VAR'] = ('N = %.0e (V is truncated at N, so the columns near log N fall off; "V / model" removes that).\n\n' % N2) + '\n'.join(rows) + \
    '\n\nSigned sums to N for zeta: sum of credits G = %+.6f, sum of debts D = %.6f (R changes by G - D); sum |c_p| over primes = %.3f (both Jordan sums grow); total variation of the prime credits %.5f.' % (
    c2['zeta']['sum_c'], c2['zeta']['sum_d'], c2['zeta']['sum_abs_c_primes'], c2['zeta']['total_variation'])
# ---------- C2 B(r)
b = json.load(open('out/c2b.json')); rs = np.array(b['rs']); z = b['objs']['zeta']
sel = [5.0, 10.0, 15.0, 20.0, 25.0, 27.6, 30.0, 35.0, 36.8]
idx = [int(np.argmin(np.abs(rs - s))) for s in sel]
rows = ['| r | ' + ' | '.join('%.1f' % rs[i] for i in idx) + ' |', '|---|' + '---|'*len(idx)]
rows.append('| zeta: B - r/2 - kappa | ' + ' | '.join('%.3e' % z['E'][i] for i in idx) + ' |')
rows.append('| zeta: e^{r/6} (B - r/2 - kappa) | ' + ' | '.join('%.3f' % z['scaled_E_exp_r6'][i] for i in idx) + ' |')
rows.append('| zeta: e^{r/4} [A_1(e^{r/2}) - r/2 + gamma] | ' + ' | '.join('%+.3f' % z['zero_part_scaled_exp_r4'][i] for i in idx) + ' |')
for nm, lab in (('L_chi-4', 'L(chi_-4): B_F - r/2 - kappa'), ('liouville', 'Liouville'), ('unimod3', 'cos(3 log n) twist'), ('Ea0.05', 'E_a(0.05)'), ('Ea0.25', 'E_a(0.25)'), ('TNR3_2.2', 'T-NR(3,2.2)'), ('TNR3_2.01', 'T-NR(3,2.01)')):
    rows.append('| %s | ' % lab + ' | '.join(('%+.3f' % b['objs'][nm]['E'][i]) if abs(b['objs'][nm]['E'][i]) < 1e3 else ('%+.2e' % b['objs'][nm]['E'][i]) for i in idx) + ' |')
frag['C2B'] = '\n'.join(rows)
# ---------- C3
def jl(fn): return [json.loads(l) for l in open(fn)] if os.path.exists(fn) else []
on = {}
for fn in ('out/onset_m512.jsonl', 'out/onset_m2048.jsonl', 'out/onset_mscan.jsonl'):
    for r in jl(fn): on[(r['obj'], r['m'])] = r
names = [('DH', '3.562 (cert. 3.44-3.48)'), ('Ea0.05', '1.007'), ('Ea0.10', '0.94 (a = 1/8)'), ('Ea0.25', '0.874'), ('TNR3_2.2', '1.241'), ('TNR3_2.01', '-'), ('TNR3_2.2zb', '1.104'),
         ('liouville', '0.726'), ('randsign', '0.726'), ('unimod3', '0.734'), ('flip10', 'log 59 + 0.000..0.033'), ('zeta', 'none'), ('L_chi-4', 'none'), ('L_chi5', 'none')]
ms = [64, 128, 256, 512, 1024, 2048, 4096]
rows = ['| object | rounds 2-3 onset | ' + ' | '.join('m = %d' % m for m in ms) + ' | m = 16384 |', '|---|---|' + '---|'*(len(ms) + 1)]
big = jl('out/toep_big.jsonl')
def bigcell(nm):
    pts = sorted([r for r in big if r['obj'] == nm], key=lambda r: r['W'])
    if not pts: return '-'
    pos = [r['W'] for r in pts if r['lam_min'] > 0]; neg = [r['W'] for r in pts if r['lam_min'] < 0]
    if neg and pos and max(p for p in pos if p < min(neg)) : return '(%.2f, %.2f]' % (max(p for p in pos if p < min(neg)), min(neg))
    if neg: return 'negative at %.2f' % min(neg)
    return 'positive at ' + ', '.join('%g' % p for p in pos)
for nm, r23 in names:
    cells = []
    for m in ms:
        r = on.get((nm, m))
        if r is None: cells.append('-')
        elif r['bracket'] is None: cells.append('none <= 6 (min %.1e)' % r['min_lam_seen'])
        else: cells.append('%.3f-%.3f' % tuple(r['bracket']))
    rows.append('| %s | %s | ' % (nm, r23) + ' | '.join(cells) + ' | %s |' % bigcell(nm))
txt = 'Step-function onset W*(m): bracket of the first negative eigenvalue (scan step 0.1, then bisection to 0.004; float64 screen; the negative end of every bracket is certified by an Arb Rayleigh quotient).\n\n' + '\n'.join(rows)
if big:
    rows = ['| object | W | lambda_min (float64) | sector | Arb Rayleigh quotient upper bound |', '|---|---|---|---|---|']
    for r in big: rows.append('| %s | %g | %+.3e | %s | %s |' % (r['obj'], r['W'], r['lam_min'], r['sector'], ('%+.6e (certified negative)' % r['rayleigh_arb_upper']) if r.get('certified_negative') else '-'))
    txt += '\n\nm = 16384 (server):\n\n' + '\n'.join(rows)
cert = jl('out/cert512.jsonl') + jl('out/cert2048.jsonl')
if cert:
    okc = [c for c in cert if c['certified_positive_arb_ldl']]
    txt += '\n\nArb LDL^T positivity certificates (all pivots certainly positive): %d of %d: ' % (len(okc), len(cert)) + '; '.join('%s m=%d W=%g' % (c['obj'], c['m'], c['W']) for c in okc) + '.'
g = jl('out/gain512.jsonl')
if g:
    rows = ['| object | W | lambda_min | G(1e-2) | G(1e-4) | G(1e-6) |', '|---|---|---|---|---|---|']
    for r in g:
        if (r['obj'], r['W']) in (('zeta', 1.0), ('zeta', 3.0), ('zeta', 6.0), ('L_chi-4', 6.0), ('L_chi5', 6.0), ('DH', 3.7), ('DH', 3.8), ('DH', 4.5), ('Ea0.05', 1.1), ('Ea0.05', 1.9), ('Ea0.25', 0.9), ('Ea0.25', 1.1),
                                 ('TNR3_2.2', 1.2), ('TNR3_2.2', 1.3), ('TNR3_2.2zb', 1.0), ('TNR3_2.2zb', 1.2), ('liouville', 0.7), ('liouville', 0.8), ('unimod3', 0.8), ('flip10', 4.0), ('flip10', 4.2)):
            rows.append('| %s | %g | %+.3e | %.6f | %.6f | %.6f |' % (r['obj'], r['W'], r['lam_min'], r['G_0.01'], r['G_0.0001'], r['G_1e-06']))
    txt += '\n\nGain ratio at m = 512 (float64; G(eps) > 1 exactly when lambda_min < -eps):\n\n' + '\n'.join(rows)
frag['C3'] = txt
# ---------- C4
d = json.load(open(c4f)); R = {r['obj']: r for r in d['results']}
wins = ['3-6', '6-10', '10-15', '15-20', '20-24', '24-27.6']
rows = ['| object | first L with min over alpha < 0 | alpha there | p on [3,6] | [6,10] | [10,15] | [15,20] | [20,24] | [24,27.6] | 2 Theta - 1 |', '|---|---|---|---|---|---|---|---|---|---|---|']
th = {'zeta': '0', 'L_chi-4': '0', 'L_chi5': '0', 'liouville(zeta bridge)': '1 (pole mismatch)', 'unimod3(zeta bridge)': '1 (pole mismatch)', 'Ea0.05': '0.10', 'Ea0.10': '0.20', 'Ea0.25': '0.50',
      'TNR3_2.2_own': '0.808', 'TNR3_2.2_zb': '0.808', 'TNR3_2.01_own': '0.182', 'TNR3_2.01_zb': '0.182', 'TNR2_2.2_own': '1.280', 'TNR2_2.2_zb': '1.280', 'TNR101_2.2_own': '0.192', 'TNR101_2.2_zb': '0.192', 'DH': '0.617 (zero at 85.7); 0.739 (zero at 240.4, outside the grid)'}
for nm in ('zeta', 'L_chi-4', 'L_chi5', 'DH', 'Ea0.05', 'Ea0.10', 'Ea0.25', 'TNR3_2.2_own', 'TNR3_2.2_zb', 'TNR3_2.01_own', 'TNR3_2.01_zb', 'TNR2_2.2_own', 'TNR2_2.2_zb', 'TNR101_2.2_own', 'TNR101_2.2_zb', 'liouville(zeta bridge)', 'unimod3(zeta bridge)'):
    r = R[nm]; fl_ = r['first_L_negative']
    rows.append('| %s | %s | %s | ' % (nm, 'none' if fl_ is None else '%.1f' % fl_, '-' if fl_ is None else '%.2f' % r['alpha_at_first_negative']) + ' | '.join(('%.3f' % r['p_fit'][w]) if w in r['p_fit'] else '-' for w in wins) + ' | %s |' % th[nm])
z = R['zeta']; L = np.array(z['L']); E = np.array(z['E'])
txt = 'alpha grid: %d values on [0, %g]; L grid step 0.1 from 0.5; prime powers to N = %.0e (DH: all n to 2.2e9, L <= 21.5).\n\n' % (d['n_alpha'], d['alpha_max'], d['N']) + '\n'.join(rows)
txt += '\n\nzeta: E(L)/(L^2/2) = ' + ', '.join('%.3f (L = %g)' % (E[i]/(L[i]**2/2), L[i]) for i in [int(np.argmin(np.abs(L - x))) for x in (5, 10, 15, 20, 25, L[-1])]) + '; smallest value of Psi_alpha(L) on the whole grid %.4f.' % min(z['min'])
dh = R['DH']; Ld = np.array(dh['L']); am = dh['alpha_min_negative']
txt += '\n\nDH: lowest alpha with a negative value, by L: ' + ', '.join('%g: %s' % (Ld[i], 'none' if am[i] is None else '%.1f' % am[i]) for i in [int(np.argmin(np.abs(Ld - x))) for x in (4.0, 4.5, 6, 8, 10, 11.5, 13, 15, 17, 19, 20, 21, 21.5)]) + '.'
frag['C4'] = txt
json.dump(frag, open('out/fragments.json', 'w'), indent=1)
for k, v in frag.items(): print('=====', k); print(v)
