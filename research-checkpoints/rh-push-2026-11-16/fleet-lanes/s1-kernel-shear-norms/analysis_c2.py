# Analysis of the twin survey: onset window l* of ||H_{a,L}|| > 1 against off-line zeros.
import sys, json, math, os
import numpy as np, mpmath as mp
import klib
a = float(sys.argv[1]); fn = 'out/c2_twins_a%g.json' % a
rows = json.load(open(fn))
tw = {T['key']: T for T in klib.twin_table()}
mp.mp.dps = 20
KPER = 3000
def make_F(key):
    T = tw[key]; q = T['q']; b = np.array(T['b'], dtype=float)
    N = q*KPER
    n = np.arange(1, N + 1, dtype=float); bn = b[np.arange(1, N + 1) % q]; ln = np.log(n)
    r = np.arange(1, q + 1); br = b[r % q]; x = (N + r)/q
    def F(s):
        head = np.sum(bn*np.exp(-s*ln))
        # tail sum_{m>=0} (m + x)^{-s} by Euler-Maclaurin
        tail = x**(1 - s)/(s - 1) + x**(-s)/2 + s*x**(-s - 1)/12 - s*(s + 1)*(s + 2)*x**(-s - 3)/720
        return head + q**(-s)*np.sum(br*tail)
    return F
def find_zero(key, t0, lstar):
    F = make_F(key)
    res = math.pi/max(lstar, 0.3); best = None
    for dt in (0, -0.5, 0.5, -1, 1, -1.5, 1.5, -2, 2):
        for s0 in (0.5 + a + 0.1, 0.5 + a + 0.3, 1.0, 1.3, 1.8, 2.5, 3.3):
            z = complex(s0, max(t0 + dt*res, 0.3)); ok = False
            for it in range(40):
                f = F(z); d = (F(z + 1e-6) - f)/1e-6
                if d == 0: break
                step = f/d
                if abs(step) > 1.0: step *= 1.0/abs(step)
                z -= step
                if abs(step) < 1e-11: ok = True; break
            if ok and abs(F(z)) < 1e-8 and z.real > 0.5 + a + 1e-6 and z.imag > 0.05 and abs(z.imag - t0) < 2.2*res + 1:
                if best is None or abs(z.imag - t0) < abs(best.imag - t0): best = z
    return best
# validation of the series on Davenport-Heilbronn: known zero 0.8085171825 + 85.6993484854 i
print('check F_DH at its known off-line zero:', abs(make_F('q5.0.T+')(complex(0.8085171825, 85.6993484854))), flush=True)
out = []; npred = 0
for r in rows:
    if 'error' in r or not r['key'].startswith('q'): continue
    q = r['q']; zs = [z for z in (r['zeros'] or []) if z[0] > 0.5 + a]
    rec = {'key': r['key'], 'q': q, 'l_star': r['l_star'], 'freq': r['onset_eigfn_freq'], 'n_listed_poles': len(zs), 'T_scanned': r['T_scanned']}
    if r['l_star'] is not None:
        f = r['onset_eigfn_freq']; res = math.pi/r['l_star']
        near = min(zs, key=lambda z: abs(z[1] - f)) if zs else None
        rec['resolution'] = res
        z = find_zero(r['key'], f, r['l_star'])
        if z is not None:
            rec['zero'] = [float(z.real), float(z.imag)]
            listed = near is not None and abs(near[1] - z.imag) < 1e-3
            rec['zero_source'] = 'found from onset frequency; ' + ('in route-44 table' if listed else 'not in route-44 table')
            if not listed: npred += 1
        elif near is not None and abs(near[1] - f) <= 2.2*res + 1:
            rec['zero'] = near; rec['zero_source'] = 'route-44 table'
        else:
            rec['zero'] = None; rec['zero_source'] = 'none found'
            rec['real_zeros_listed'] = r.get('real_zeros')
        if len(out) % 40 == 0: print('...', len(out), r['key'], rec.get('zero'), flush=True)
    out.append(rec)
on = [x for x in out if x['l_star'] is not None]
matched = [x for x in on if x.get('zero')]
summ = {'a': a, 'n_twins': len(out), 'n_onset': len(on), 'n_no_onset': len(out) - len(on),
        'n_onset_with_offline_zero_at_onset_frequency': len(matched), 'of_which_zero_not_in_route44_table': npred,
        'n_onset_without_zero_found': len(on) - len(matched),
        'no_onset_but_listed_pole': [x['key'] for x in out if x['l_star'] is None and x['n_listed_poles'] > 0]}
if matched:
    X = np.array([math.log(x['q']*x['zero'][1]/(2*math.pi)) for x in matched]); Y = np.array([2*x['l_star'] for x in matched])
    B = np.array([x['zero'][0] - 0.5 - a for x in matched])
    A1 = np.vstack([np.ones(len(X)), X]).T; c1, *_ = np.linalg.lstsq(A1, Y, rcond=None)
    A2 = np.vstack([np.ones(len(X)), X, np.log(B)]).T; c2, *_ = np.linalg.lstsq(A2, Y, rcond=None)
    summ['fit 2l* = c0 + c1 log(q gamma/2pi)'] = [float(v) for v in c1]; summ['fit1_rms'] = float(np.sqrt(np.mean((Y - A1@c1)**2)))
    summ['fit 2l* = c0 + c1 log(q gamma/2pi) + c2 log(beta-1/2-a)'] = [float(v) for v in c2]; summ['fit2_rms'] = float(np.sqrt(np.mean((Y - A2@c2)**2)))
    summ['corr(2l*, log(q gamma/2pi))'] = float(np.corrcoef(X, Y)[0, 1])
    ratio_full = np.exp(Y - X)                      # L*^2 / (q gamma / 2 pi)
    ratio_afe = np.exp(Y - X/2)                     # L*^2 / sqrt(q gamma / 2 pi)   (coefficients used / AFE length)
    for nm, v in (('L*^2/(q gamma/2pi)', ratio_full), ('L*^2/sqrt(q gamma/2pi)', ratio_afe)):
        summ[nm + ' quantiles(min,10%,50%,90%,max)'] = [float(np.quantile(v, p)) for p in (0, 0.1, 0.5, 0.9, 1)]
    inside = [x for x in matched if x['zero'][0] < 1.0]
    if inside:
        v = np.array([math.exp(2*x['l_star'])/math.sqrt(x['q']*x['zero'][1]/(2*math.pi)) for x in inside])
        summ['zeros inside the strip (beta<1): n'] = len(inside)
        summ['zeros inside the strip: L*^2/sqrt(q gamma/2pi) quantiles'] = [float(np.quantile(v, p)) for p in (0, 0.1, 0.5, 0.9, 1)]
        summ['zeros inside the strip: n with L*^2 < sqrt(q gamma/2pi)'] = int(np.sum(v < 1))
    summ['freq-gamma: median |freq - gamma|/resolution'] = float(np.median([abs(x['freq'] - x['zero'][1])/x['resolution'] for x in matched]))
print(json.dumps(summ, indent=1))
json.dump({'summary': summ, 'rows': out}, open('out/analysis_c2_a%g.json' % a, 'w'))
