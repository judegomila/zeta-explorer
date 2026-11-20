"""Compact summary rows for RESULT.md. Usage: summ.py label=path.json ..."""
import sys, json, math, numpy as np
import predict2 as P
GUE = lambda d: math.pi ** 2 * d ** 3 / 9
def fit_ab(N, t):
    A = np.vstack([np.ones(len(N)), 1.0 / np.array(N, float)]).T
    return np.linalg.lstsq(A, np.array(t), rcond=None)[0]
print('| list | zeros | height | off-line fraction | Q+1 (top full window, L) | prime prediction | P(s<δ)/GUE at δ = 0.02, 0.05, 0.1 | small-gap exponent | close pairs | closing | max R_eff (close) | s_min | t_c(N_max) | retardation at N_max | fit a (N<=1000) | fit a (all N) | slope log t_c / log N | beta(200, 0.5) | beta(N_max, 0.5) | slope log beta / log N | prod(0.05) |')
for a in sys.argv[1:]:
    lab, f = a.split('='); r = json.load(open(f)); kind = r['kind']
    Ws = [w for w in r['windows'] if w['n'] >= 3000]
    top = max(Ws, key=lambda w: (w['n'] >= 0.2 * max(x['n'] for x in Ws), w['Tmed']))
    tot = sum(w['n'] for w in Ws); Pp = [sum(w['P'][i] * w['n'] for w in Ws) / tot for i in range(6)]
    foff = 1 - sum(w['b'] - w['a'] - 1 for w in Ws) / sum(w['expect_all'] for w in Ws)
    nclose = sum(w['nclose'] for w in Ws); ncl = sum(w['nclosing'] for w in Ws); Rmax = max(w['Rclose_q'][-1] for w in Ws if w['Rclose_q'])
    expo = math.log(Pp[3] / Pp[1]) / math.log(5) if Pp[1] > 0 else float('nan')
    G = r['grid']; tc = [(g['N'], g.get('tc_full') or g.get('tc_local')) for g in G]; tc = [(n, t) for n, t in tc if t]
    Ns = np.array([n for n, t in tc], float); ts = np.array([t for n, t in tc])
    a1 = fit_ab(Ns[Ns <= 1000], ts[Ns <= 1000])[0]; a2 = fit_ab(Ns, ts)[0]; sl = np.polyfit(np.log(Ns), np.log(ts), 1)[0]
    bs = [(g['N'], (g.get('beta_full') or g.get('beta_local') or {}).get('0.5')) for g in G]; bs = np.array([(n, b) for n, b in bs if b], float)
    bsl = np.polyfit(np.log(bs[:, 0]), np.log(bs[:, 1]), 1)[0]
    b200 = [b for n, b in bs if n == 200]
    last = G[-1]; pr = (last.get('prod_full') or last.get('prod_local') or {}).get('0.05')
    print('| %s | %d | %.3g..%.3g | %.4f | %.4f ± %.4f (L=%.2f) | %.4f | %.2f, %.2f, %.2f | %.2f | %d | %d | %.3f | %.5f | %.3e | %.5f | %.2e | %.2e | %.3f | %s | %.4g | %.3f | %.4f |' % (
        lab, r['n'], r['Tmin'], r['Tmax'], foff, top['Q'] + 1, top['Qerr'], top['L'], P.predict(top['L'], 5 if kind == 'dir' else None),
        Pp[1] / GUE(.02), Pp[2] / GUE(.05), Pp[3] / GUE(.1), expo, nclose, ncl, Rmax, last['smin'], ts[-1], ts[-1] / last['tc_pair'], a1, a2, sl, ('%.3f' % b200[0]) if b200 else '-', bs[-1, 1], bsl, pr))
