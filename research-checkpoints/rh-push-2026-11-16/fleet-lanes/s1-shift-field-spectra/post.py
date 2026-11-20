"""collect the band files, pool the sub-bands of one band, and print the tables."""
import sys, json, glob, math, os, re
import numpy as np
from scipy.special import exp1
import sfs

def primes(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for p in range(2, int(n ** 0.5) + 1):
        if s[p]: s[p * p::p] = False
    return np.nonzero(s)[0].astype(float)

PR = primes(10 ** 7); LP = np.log(PR); SM = PR < 1e4
_cache = {}
def vpred(x, h, drop5=False):
    """sum over prime powers of k^-2 p^(-k(1+2x)) (1 - cos(2 h k log p)); primes to 1e7 (k = 1), to 1e4 (k >= 2); tail by E1."""
    key = (x, round(h, 4), drop5)
    if key in _cache: return _cache[key]
    term = PR ** (-(1 + 2 * x)) * (1 - np.cos(2 * h * LP))
    if drop5: term[2] = 0.0
    tot = term.sum()
    for k in range(2, 30):
        term = PR[SM] ** (-k * (1 + 2 * x)) * (1 - np.cos(2 * h * k * LP[SM])) / k ** 2
        if drop5: term[2] = 0.0
        tot += term.sum()
    tot += exp1(2 * x * math.log(1e7))
    _cache[key] = tot
    return tot

groups = {}
for f in sorted(glob.glob(sys.argv[1] + '/*.json')):
    b = os.path.basename(f)
    if not re.match(r'(arb|rs|per)_', b): continue
    d = json.load(open(f))
    tag = b.rsplit('_', 1)[0]
    for o, r in d['results'].items():
        r['U'] = d['U']
        groups.setdefault((o, tag), []).append(r)

XS = list(sfs.T2_PHASE) + [p[0] for p in sfs.T2_PAIR]
rows = []
for (o, tag), rs in groups.items():
    n = sum(r['n'] for r in rs)
    g = dict(name=o, tag=tag, engine=tag.split('_')[0], T=min(r['T'] for r in rs), Tend=max(r['T'] + r['U'] for r in rs),
             n=n, dt=rs[0]['dt'], parts=len(rs), y=rs[0]['y'], L=rs[0]['L'])
    g['height'] = sum(r['height'] for r in rs)
    for k in ('negW_frac', 'negF_frac', 'sech2'):
        g[k] = (sum(np.array(r[k]) * r['n'] for r in rs) / n).tolist()
    g['runs'] = np.sum([r['runs'] for r in rs], axis=0).tolist()
    for k in ('firstW', 'firstF'):
        g[k] = [min([r[k][j] for r in rs if r[k][j] is not None], default=None) for j in range(sfs.NS)]
    g['minW'] = [min(r['minW'][j] for r in rs) for j in range(sfs.NS)]
    g['mom'] = {m: {q: sum(r['mom'][m][q] * r['n'] for r in rs) / n for q in ('F', 'V', 'psi2')} for m in rs[0]['mom']}
    wr = [(r, r['windows']) for r in rs if r['windows'].get('var')]
    if wr:
        num = np.zeros(len(XS)); den = np.zeros(len(XS)); c = 0
        for r, w in wr:
            if 'hvals' in w:
                hv, hc = np.array(w['hvals'][0]), np.array(w['hvals'][1])
            else:                                               # reconstruct the half-widths used (older output files)
                M = int(round((r['n'] * r['dt']) / w['delta'])) + 2
                ctt = r['T'] + w['delta'] * np.arange(M)
                jj = np.maximum(1, np.rint(np.sqrt(ctt / (2 * math.pi)) / w['delta']).astype(int)); ii = np.arange(M)
                ok = (ii - jj >= 0) & (ii + jj < M - 1)
                uj, hc = np.unique(jj[ok], return_counts=True); hv = uj * w['delta']
            if len(hv) > 60:                                    # subsample the half-widths
                sel = np.linspace(0, len(hv) - 1, 60).astype(int); hv = hv[sel]; hc = hc[sel]
            vp = np.array([sum(cnt * vpred(x, h, drop5=o in ('LCHI', 'DH')) for h, cnt in zip(hv, hc)) / hc.sum() for x in XS])
            v = np.array(w['var'])
            if 'var3' in w and w['independent'] >= 20: v = np.array(w['var3'])      # cubic detrending when the sub-band is long
            if r['T'] >= 1e4: v[4:] = np.nan     # B_a series: non-zero mean times the quantised window length; estimator not valid
            num += v * w['centres']; den += vp * w['centres']; c += w['centres']
        g['var'] = (num / c).tolist(); g['vpred'] = (den / c).tolist()
        g['independent'] = sum(w['independent'] for _, w in wr)
        g['h_mid'] = float(np.median([w['h_mid'] for _, w in wr]))
        g['ratio'] = (num / den).tolist()
        g['Bdetrend'] = 'cubic' if all('var3' in w for _, w in wr) else 'linear'
    rows.append(g)
ORDER = ['ZETA', 'LCHI', 'DH', 'EA18', 'EA14', 'TNR', 'HEAT-0.1', 'HEAT-0.5', 'LIOU']
rows.sort(key=lambda r: (ORDER.index(r['name']), r['T']))
json.dump(rows, open(sys.argv[2], 'w'), indent=0)
def f3(x): return '-' if x is None else ('%.3g' % x)
def band(r): return '%.6g .. %.6g' % (r['T'], r['Tend'])
md = []
md.append('### Table T1. mean of |psi F|^2 / mean of |psi V|^2 on the 1/2-line (references 3 and 4/3 for an Euler product at theta = 1/2)\n')
md.append('| object | band | grid step | y | theta = log y / L | reference F / V | no mollifier | mollifiers (name: F / V) |\n|---|---|---|---|---|---|---|---|')
for r in rows:
    th = math.log(max(r['y'], 2)) / r['L']
    md.append('| %s | %s | %g | %d | %.3f | %.3f / %.3f | %s / %s | %s |' % (r['name'], band(r), r['dt'], r['y'], th, 1 + 1 / th, 1 + 1 / (3 * th) - 0.5 + th / 3, f3(r['mom']['none']['F']), f3(r['mom']['none']['V']),
              ' ; '.join('%s: %s / %s' % (k, f3(v['F']), f3(v['V'])) for k, v in r['mom'].items() if k != 'none')))
md.append('\n### Table T2. variance of the window integral divided by the prime-power sum (a -> 0: x = 0.05, 0.1, 0.2, 0.5; then B_a/(2a): (x, a) = (0.05, 0.05), (0.1, 0.05), (0.15, 0.05), (0.2, 0.1))\n')
md.append('| object | band | half-width h | independent windows | a -> 0 ratios | B_a ratios | mean sech^2 (B_a pairs) |\n|---|---|---|---|---|---|---|')
for r in rows:
    if r.get('ratio') and r['independent'] >= 1.5:
        md.append('| %s | %s | %.4g | %.0f | %s | %s | %s |' % (r['name'], band(r), r['h_mid'], r['independent'], ' '.join('%.3f' % x for x in r['ratio'][:4]),
                  ' '.join(('%.3f' % x) if x == x else 'n/a' for x in r['ratio'][4:]), ' '.join('%.3f' % x for x in r['sech2'])))
md.append('\n### Table T3. fraction of grid points with W < 0 (completed function) and with Re F < 0 (uncompleted), sigma = 0.55, 0.6, 0.7, 0.8, 0.9, 1\n')
md.append('| object | band | W < 0 fractions | first t with W < 0 (any line 0.51..1) | min Re(F\'/F) on 0.51, 0.55, 0.7 | Re F < 0 fractions | first t with Re F < 0 (lines 0.55..1) |\n|---|---|---|---|---|---|---|')
idx = [2, 3, 5, 6, 7, 8]
for r in rows:
    fw = [x for x in r['firstW'][1:] if x is not None]; ff = [x for x in r['firstF'][2:] if x is not None]
    md.append('| %s | %s | %s | %s | %s | %s | %s |' % (r['name'], band(r), ' '.join('%.4f' % r['negW_frac'][i] for i in idx), ('%.8g' % min(fw)) if fw else '-',
              ' '.join('%.3g' % r['minW'][i] for i in (1, 2, 5)), ' '.join('%.4f' % r['negF_frac'][i] for i in idx), ('%.8g' % min(ff)) if ff else '-'))
md.append('\n### Table T4. interlacing failures (maximal runs of Re F\'/F < 0 on Re s = 1/2 + a) per unit height, a = 0.01, 0.05, 0.2\n')
md.append('| object | band | failures per unit height | first t on each line |\n|---|---|---|---|')
for r in rows:
    if r['dt'] > 0.06: continue
    md.append('| %s | %s | %s | %s |' % (r['name'], band(r), ' '.join('%.4g' % (r['runs'][i] / r['height']) for i in (1, 2, 5)),
              ' '.join(('%.8g' % r['firstW'][i]) if r['firstW'][i] is not None else '-' for i in (1, 2, 5))))
open(sys.argv[3] if len(sys.argv) > 3 else 'TABLES.md', 'w').write('\n'.join(md) + '\n')
print('rows', len(rows))
