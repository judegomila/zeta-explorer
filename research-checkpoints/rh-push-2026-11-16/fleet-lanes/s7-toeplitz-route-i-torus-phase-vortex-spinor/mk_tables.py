"""tables.md from the JSON outputs of lane s7 (out1, out1b: torus; out2: heat; out3, out3_local: skew; out4, out4_local: edge, crossing)."""
import json, os, math, glob
import numpy as np
L = []
def P(s=''): L.append(s)
def ld(fn):
    return json.load(open(fn)) if os.path.exists(fn) else None
def f(x, d=4): return ('%+.' + str(d) + 'f') % x
def e(x): return '%+.3e' % x
PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]

# ---------------- T1: torus ----------------
for tag, fn in (('N = 80, 120 starts', 'out1/torus.json'), ('N = 100, 200 starts, orbit scan, local', 'out1c_local/torus.json'), ('N = 120, 300 starts, orbit scan, server', 'out1b/torus.json')):
    d = ld(fn)
    if not d: continue
    ball = {(b['s'], b['obj'], b['variant'], b['tag']): b for b in (ld(fn.replace('torus.json', 'torus_ball.json')) or [])}
    P('## T1. Free prime phases (%s; file %s)\n' % (tag, fn))
    P('lambda_min of the form with the phases of the coefficients twisted by theta (theta = 0: the object). orbit = value at theta = 0; inf, sup over the torus (multi-start L-BFGS); fpos = fraction of 2000 uniform points with lambda_min > 0; N-16 = infimum point re-evaluated in the sub-block of 16 fewer Legendre modes; ball = value at the minimiser in 256-bit midpoint arithmetic.\n')
    P('| object | variant | 2a | dim | orbit | inf | inf (N-16) | inf (ball) | G = orbit - inf | sup | fpos | orbit is the sup | named points |')
    P('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
    for r in sorted(d, key=lambda r: (r['obj'], r['variant'], r['twoa'])):
        key = [k for k in ball if k[1] == r['obj'] and k[2] == r['variant'] and abs(float(k[0]) - r['twoa']) < 1e-9]
        bo = next((ball[k] for k in key if k[3] == 'orbit'), None); bi = next((ball[k] for k in key if k[3] == 'argmin'), None)
        orb = bo['lam'] if (bo and abs(r['orbit']) > 1e-12) else r['orbit']
        orb_s = e(orb) if abs(r['orbit']) > 1e-12 else 'abs < 1e-12'
        if abs(r['orbit']) <= 1e-12: orb = 0.0
        issup = 'yes' if r['sup'] <= orb + 1e-6 else 'no (sup - orbit = %.3g)' % (r['sup'] - orb)
        if r['dim'] == 0: issup = '-'
        nm = ', '.join('%s %s' % (k, f(v, 3)) for k, v in r.get('named', {}).items())
        P('| %s | %s | %.4f | %d | %s | %s | %s | %s | %s | %s | %.4f | %s | %s |' % (r['obj'], r['variant'], r['twoa'], r['dim'], orb_s, f(r['inf']), f(r.get('inf_at_N_minus_16', r['inf'])), bi['lam_str'][:12] if bi else '-', f(orb - r['inf']), e(r['sup']), r['frac_pos'], issup, nm))
    P()
    P('### Minimising configuration (theta_p at the infimum, and theta_p / log p unwrapped to the nearest branch of a common tau)\n')
    P('| object | variant | 2a | theta at the infimum (p = 2, 3, 5, ...) | tau_p = (theta_p + 2 pi k_p) / log p | spread of tau_p |')
    P('|---|---|---|---|---|---|')
    for r in sorted(d, key=lambda r: (r['obj'], r['variant'], r['twoa'])):
        if r['dim'] < 2: continue
        th = np.array(r['argmin']); lp = np.log(np.array(r['primes'], dtype=float))
        best = None
        for sgn in (1, -1):
            for tau in np.arange(0, 12, 0.002):
                kk = np.round((tau * lp - sgn * th) / (2 * math.pi)); taus = (sgn * th + 2 * math.pi * kk) / lp
                sp = float(np.max(np.abs(taus - tau)))
                if best is None or sp < best[0]: best = (sp, tau, taus)
        P('| %s | %s | %.4f | %s | %s | %.3f around tau = %.3f |' % (r['obj'], r['variant'], r['twoa'], ', '.join('%.2f' % x for x in th), ', '.join('%.3f' % x for x in best[2]), best[0], best[1]))
    P()
    if any('orbit_scan' in r for r in d):
        P('### Orbit scan theta_p = tau log p, tau in [0, 300) step 0.02\n')
        P('| object | variant | 2a | torus inf | orbit min (tau) | orbit min for tau <= 5 (tau) | max over tau >= 1 | fraction of the orbit with lambda_min > 0 |')
        P('|---|---|---|---|---|---|---|---|')
        for r in sorted(d, key=lambda r: (r['obj'], r['variant'], r['twoa'])):
            o = r.get('orbit_scan')
            if not o: continue
            P('| %s | %s | %.4f | %s | %s (%.2f) | %s (%.2f) | %s | %.4f |' % (r['obj'], r['variant'], r['twoa'], f(r['inf']), f(o['min']), o['tau'], f(o['min_tau_le_5']), o['tau_le_5'], e(o['max_tau_ge_1']), o['frac_pos']))
        P()
    P('### Second derivative of lambda_min at theta = 0 along each prime coordinate\n')
    P('| object | variant | 2a | d2 lambda_min / d theta_p^2 (p = 2, 3, 5, ...) |')
    P('|---|---|---|---|')
    for r in sorted(d, key=lambda r: (r['obj'], r['variant'], r['twoa'])):
        if r['dim'] and r['twoa'] < 2.0: P('| %s | %s | %.4f | %s |' % (r['obj'], r['variant'], r['twoa'], ', '.join('%.3g' % x for x in r['d2_at_orbit'])))
    P()

# ---------------- T2: heat ----------------
rows = []
for fn in sorted(glob.glob('out2/heat_*.json')): rows += ld(fn)
if rows:
    P('## T2. Gaussian-smoothed cell matrices H_{h,m}(t)\n')
    P('Entries: lambda_min (float64; sign called only when abs(lambda_min) > 1e-11 e^(W/2) and the extended-precision Rayleigh quotient agrees to 1 percent; otherwise 0). t < 0: lattice step (t = s h^2).\n')
    keys = sorted({(r['obj'], r['h'], r['tag']) for r in rows})
    for ob, h, tag in keys:
        sub = [r for r in rows if r['obj'] == ob and r['h'] == h and r['tag'] == tag]
        ts = sorted({r['t'] for r in sub}); Ws = sorted({r['W'] for r in sub})
        P('### %s, h = %.5g %s\n' % (ob, h, tag))
        P('| t \\ window | ' + ' | '.join('%.2f' % w for w in Ws) + ' |')
        P('|---|' + '---|' * len(Ws))
        for t in ts:
            cells = []
            for w in Ws:
                r = next((r for r in sub if r['t'] == t and r['W'] == w), None)
                if r is None: cells.append('n/a'); continue
                lm, lld = r['lam_min'], r['lam_min_ld']
                ok = abs(lm) > 1e-11 * math.exp(w / 2) and (lld is None or abs(lld - lm) <= 0.01 * abs(lm))
                cells.append(('%+.2e' % lm) if ok else '0 (%+.0e)' % lm)
            P('| %+.3g | ' % t + ' | '.join(cells) + ' |')
        P()

# ---------------- T3: skew ----------------
for fn, title in (('out3/skew_all_first.json', 'all prime powers n < e^{2a} (first server run)'), ('out3/skew_all.json', 'all prime powers n < e^{2a}'), ('out3_local/skew_big2.json', 'all prime powers, 2a = log 1e6, FFT-Lanczos (local)'),
                  ('out3_local/skew_fixedP.json', 'fixed coefficient list n <= P (local)'), ('out3/skew_fixedP.json', 'fixed coefficient list n <= P (server)')):
    d = ld(fn)
    if not d: continue
    P('## T3. Skew sections: %s (%s)\n' % (title, fn))
    P('mu_j = j-th largest pair value; r_j = log(mu_1 / mu_j); source law: r_3/r_2 = 8/3 = 2.667, r_4/r_2 = 5.\n')
    P('| object | P | 2a | m | mu_1 | mu_2 | mu_3 | mu_4 | r_3/r_2 | r_4/r_2 | mu_1 / sup of the symbol |')
    P('|---|---|---|---|---|---|---|---|---|---|---|')
    for r in d:
        P('| %s | %s | %.3f | %d | %.5f | %.5f | %.5f | %.5f | %.4f | %.4f | %s |' % (r['obj'], r.get('P', 'all'), r['twoa'], r['m'], r['mu'][0], r['mu'][1], r['mu'][2], r['mu'][3], r['r3_over_r2'], r['r4_over_r2'], ('%.5f' % (r['mu'][0] / r['sup']['sup'])) if 'sup' in r else '-'))
    P()
d = ld('out3_local/skew_pass.json') or ld('out3/skew_pass.json')
if d:
    P('## T3b. Skew sections as 2a passes log n (mesh 0.004, coefficients n <= 400)\n')
    objs = []
    for r in d:
        if r['obj'] not in objs: objs.append(r['obj'])
    scan = sorted({round(r['twoa'], 4) for r in d})
    P('mu_1 (first line) and mu_2 (second line) per object.\n')
    P('| 2a | ' + ' | '.join(objs) + ' |'); P('|---|' + '---|' * len(objs))
    for s in scan[::2]:
        P('| %.2f | ' % s + ' | '.join('%.4f / %.4f' % tuple(next(r['mu'][:2] for r in d if r['obj'] == o and abs(r['twoa'] - s) < 1e-6)) for o in objs) + ' |')
    if 'zeta+c101' in objs and 'tnr-101-2.1' in objs:
        mx = max(abs(a - b) for s in scan for a, b in zip(next(r['mu'] for r in d if r['obj'] == 'zeta+c101' and abs(r['twoa'] - s) < 1e-6), next(r['mu'] for r in d if r['obj'] == 'tnr-101-2.1' and abs(r['twoa'] - s) < 1e-6)))
        mz = max(abs(a - b) for s in scan if s < math.log(101) for a, b in zip(next(r['mu'] for r in d if r['obj'] == 'zeta' and abs(r['twoa'] - s) < 1e-6), next(r['mu'] for r in d if r['obj'] == 'tnr-101-2.1' and abs(r['twoa'] - s) < 1e-6)))
        P('\nT-NR (q = 101) against zeta with c(101) replaced by hand: max difference of the six largest values over the scan = %.2e. T-NR against zeta for 2a < log 101: %.2e.\n' % (mx, mz))
    P()

# ---------------- T4: edge ----------------
for fn in ('out4/edge.json', 'out4_local/edge.json', 'out4/edge_first_mmax12000.json'):
    d = ld(fn)
    if not d: continue
    P('## T4. Lower edge of the cell sections of the truncated symbol w_P (%s)\n' % fn)
    P('sym = symbol only (no pole term). f_min, curvature: minimum of the lattice symbol of the same mesh. Prediction: lambda_j = f_min + (curv/2) (k pi / (m+1))^2, k = j (minimum at 0 or complex symbol) or ceil(j/2) (minima at +-phi_0). exponent = -d log(lambda_j - f_min) / d log m between the two largest windows; ratio = (lambda_j - f_min) / (prediction - f_min) at the largest window.\n')
    P('| object | P | variant | t_0 of the minimum | f_min | curvature (per rad^2 of phi) | largest 2a | m | lambda_1 - f_min | exponent j = 1, 2, 3, 4 | ratio j = 1, 2, 3, 4 | lambda_1, lambda_2, lambda_3 at 2a = log(P+) |')
    P('|---|---|---|---|---|---|---|---|---|---|---|---|')
    for r in d:
        rows_ = r['rows']; sm = r['symbol']
        if not rows_: continue
        a, b = (rows_[-2], rows_[-1]) if len(rows_) > 1 else (rows_[-1], rows_[-1])
        one = next((x for x in rows_ if abs(x['fac'] - 1.0) < 1e-9), None)
        if r['variant'] == 'sym' and len(rows_) > 1:
            ex = [-(math.log(b['ev'][j] - sm['fmin']) - math.log(a['ev'][j] - sm['fmin'])) / (math.log(b['m']) - math.log(a['m'])) if (b['ev'][j] > sm['fmin'] and a['ev'][j] > sm['fmin']) else float('nan') for j in range(4)]
            ra = [(b['ev'][j] - sm['fmin']) / (b['pred'][j] - sm['fmin']) for j in range(4)]
            P('| %s | %d | sym | %.4f | %.5f | %.4g | %.2f | %d | %.4e | %s | %s | %s |' % (r['obj'], r['P'], sm['t0'], sm['fmin'], sm['curv'], b['twoa'], b['m'], b['ev'][0] - sm['fmin'], ', '.join('%.3f' % x for x in ex), ', '.join('%.3f' % x for x in ra), ', '.join('%+.3e' % x for x in one['ev'][:3]) if one else '-'))
        else:
            P('| %s | %d | full | - | - | - | %.2f | %d | - | - | - | %s |' % (r['obj'], r['P'], rows_[-1]['twoa'], rows_[-1]['m'], ', '.join('%+.3e' % x for x in one['ev'][:3]) if one else '-'))
    P()
d = ld('out4_local/cross.json')
if d:
    P('## T4b. Crossing of the full form (own gamma factor, conductor and pole) with coefficients n <= P (local; threshold -1e-9; bisection on the cell count)\n')
    P('| object | P | P+ (next n with c(n) != 0) | log P+ | mesh | lambda_min inside log P+ | crossing bracket | offset from log P+ |')
    P('|---|---|---|---|---|---|---|---|')
    for r in d:
        cr = r.get('crossing')
        P('| %s | %d | %d | %.4f | %.5f | %s | %s | %s |' % (r['obj'], r['P'], r['Pplus'], r['logPplus'], r['h'], e(r['lam_inside']), ('(%.4f, %.4f]' % tuple(cr)) if cr else 'none up to %.2f (lambda_min %s)' % (r['logPplus'] + min(1.0, 0.5 * r['logPplus']), e(r['lam_end'])), ('(%+.4f, %+.4f]' % tuple(r['offset_from_logPplus'])) if cr else '-'))
    P()
open('tables.md', 'w').write('\n'.join(L) + '\n')
print('tables.md: %d lines' % len(L))
