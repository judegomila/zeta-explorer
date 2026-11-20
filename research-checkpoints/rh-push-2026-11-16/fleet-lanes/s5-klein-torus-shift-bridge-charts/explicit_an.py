"""Analysis of combination (4).  usage: explicit_an.py OUT.json   (reads out/ex_*.npz, out/zeros_*.json, zeros_DH.json)"""
import sys, os, json, math, glob
import numpy as np
import explib
HERE = os.path.dirname(os.path.abspath(__file__))
res = {}

def load(name):
    f = os.path.join(HERE, 'out', name + '.npz')
    if not os.path.exists(f): return None
    d = np.load(f); m = json.loads(str(d['meta'])); N = m['N']
    t = m['Tc'] + m['delta'] * np.arange(-N // 2, N // 2)
    return d['S'], d['xs'], t, m

def smax(t): return 0.112 * math.log(t) + 0.278 * math.log(math.log(t)) + 2.510     # Trudgian 2014, unconditional bound for |S(t)|

def phi_tail(x, d, X, eta, dens):
    """dens * X^-x * int_d^inf |betahat(eta(-x + i u))| e^{-eta x} / u du   (far zeros assumed to have Re rho - 1/2 <= 0)"""
    u = d * np.exp(np.linspace(0, 8, 4000))
    f = np.abs(explib.betahat(eta * (-x + 1j * u))) / u
    return dens * math.exp(-(math.log(X) - eta) * x) * float(np.sum((f[1:] + f[:-1]) / 2 * np.diff(u)))

def block_analysis(tag, model, zeros_file, cond=1.0, stride=8, tnr=None):
    L = load(tag)
    if L is None or not os.path.exists(zeros_file): return
    S, xs, t, m = L; X = m['X']; eta = m['eta']; Z = json.load(open(zeros_file))
    out = dict(model=model, X=X, eta=eta, Tc=m['Tc'], delta=m['delta'], N=m['N'], terms=m['terms'], lines=[])
    for i, x in enumerate(xs):
        s = 0.5 + x + 1j * t
        AX = (-S[i] + explib.gamma_part(model, s, X, eta)).real
        dens = math.log(cond * m['Tc'] / (2 * math.pi)) / (2 * math.pi)
        row = dict(x=float(x), c=float(x * math.log(m['Tc'])), heights=int(len(t)), min_A_X=float(AX.min()), frac_A_X_negative=float((AX < 0).mean()),
                   mean_A_X=float(AX.mean()), mean_expected_pi_density=math.pi * dens, max_A_X=float(AX.max()), windows=[])
        worst = 0; worst_ratio = 0; ghosts = []
        for w in Z['windows']:
            g = np.array([float(v) for v in w['gammas']])
            if len(g) < 10: continue
            pad = 0.25 * (w['hi'] - w['lo']) if tag.endswith('pad25') else None
            lo_in = w['lo'] + (w['hi'] - w['lo'] - (20 if m['Tc'] < 5e9 else 10)) / 2; hi_in = w['hi'] - (lo_in - w['lo'])
            sel = np.nonzero((t >= lo_in) & (t <= hi_in))[0][::stride]
            if len(sel) == 0: continue
            ts = t[sel]
            B = explib.zero_kernel(x, ts, np.zeros(len(g)), g, X, eta).real
            d1 = ts - w['lo']; d2 = w['hi'] - ts
            tail = dens * ((math.pi / 2 - np.arctan(d1 / x)) + (math.pi / 2 - np.arctan(d2 / x)))
            rem = AX[sel] - B - tail
            tolS = 2 * x * smax(m['Tc']) * (1 / d1.min() ** 2 + 1 / d2.min() ** 2)
            tolP = 2 * phi_tail(x, min(d1.min(), d2.min()), X, eta, dens)
            wr = dict(lo=w['lo'], hi=w['hi'], listed=len(g), samples=int(len(sel)), max_abs_rem=float(np.abs(rem).max()), mean_rem=float(rem.mean()),
                      tol_S=float(tolS), tol_Phi_RH=float(tolP), min_A_X=float(AX[sel].min()), min_block=float(B.min()))
            if 'n0' in w: wr['ghost_count'] = int(w['n1'] - w['n0'] - len(g))
            if 'main_term' in w: wr['count_minus_main_term'] = float(len(g) - w['main_term'] / 2)   # zeros_win.py main_term counts both signs of the ordinate
            if tnr:
                q, c, b = tnr
                dl = explib.tnr_delta(q, c, x, ts, X, eta).real; ex = explib.tnr_exact(q, c, x, ts).real
                sp = 2 * math.pi / math.log(q); gam0 = math.pi / math.log(q)
                dist = np.abs(((ts - gam0 + sp / 2) % sp) - sp / 2)
                outside = (x * x + dist * dist) > 4 * b * b
                rr = rem + dl
                wr['tnr'] = dict(frac_outside_disk=float(outside.mean()), min_rem_outside=float(rr[outside].min()) if outside.any() else None, max_rem_outside=float(rr[outside].max()) if outside.any() else None,
                                 frac_outside_below_minus_tol=float((rr[outside] < -(tolS + tolP)).mean()) if outside.any() else None,
                                 exact_pair_field_min_outside=float(ex[outside].min()) if outside.any() else None, exact_pair_field_min_inside=float(ex[~outside].min()) if (~outside).any() else None,
                                 prime_side_local_terms_max_abs=float(np.abs(dl).max()))
            row['windows'].append(wr); worst = max(worst, wr['max_abs_rem']); worst_ratio = max(worst_ratio, wr['max_abs_rem'] / (tolS + tolP))
        row['n_windows'] = len(row['windows']); row['max_abs_rem_all_windows'] = worst; row['max_rem_over_tol'] = worst_ratio
        row['tol_S_typ'] = row['windows'][0]['tol_S'] if row['windows'] else None; row['tol_Phi_typ'] = row['windows'][0]['tol_Phi_RH'] if row['windows'] else None
        if tnr and row['windows']:
            row['tnr_summary'] = dict(frac_outside_below_minus_tol=float(np.mean([w_['tnr']['frac_outside_below_minus_tol'] for w_ in row['windows'] if w_['tnr']['frac_outside_below_minus_tol'] is not None] or [float('nan')])),
                                      min_rem_outside=min([w_['tnr']['min_rem_outside'] for w_ in row['windows'] if w_['tnr']['min_rem_outside'] is not None] or [float('nan')]),
                                      exact_pair_field_min_outside=min([w_['tnr']['exact_pair_field_min_outside'] for w_ in row['windows'] if w_['tnr']['exact_pair_field_min_outside'] is not None] or [float('nan')]),
                                      local_terms_max_abs=max(w_['tnr']['prime_side_local_terms_max_abs'] for w_ in row['windows']))
        if len(row['windows']) > 6: row['windows'] = row['windows'][:3] + row['windows'][-3:]
        out['lines'].append(row)
        print(tag, model, 'x=%.4f' % x, 'heights', len(t), 'min A_X %.4f frac<0 %.2e mean %.4f (pi dens %.4f) | windows %d max|rem| %.3e tolS %.2e tolPhi %.2e ratio %.2f' %
              (row['min_A_X'], row['frac_A_X_negative'], row['mean_A_X'], row['mean_expected_pi_density'], row['n_windows'], worst, row['tol_S_typ'] or -1, row['tol_Phi_typ'] or -1, worst_ratio),
              ('| TNR ' + json.dumps(row.get('tnr_summary'))) if tnr else '', flush=True)
    res[tag + ('' if not tnr else '_TNR_q%d' % tnr[0])] = out

def low_zeta_zero_file():
    """zero file for the T = 1e3 runs from the battery table (zeros below 4000): one window [200, 1800]"""
    src = os.path.join(HERE, 'zeros_ZETA_2H.json'); dst = os.path.join(HERE, 'out', 'zeros_T1e3_battery.json')
    if os.path.exists(src):
        g = [v for v in json.load(open(src))['gamma'] if 880 <= float(v) <= 1120]
        json.dump(dict(code='ZETA', windows=[dict(lo=880.0, hi=1120.0, gammas=g)]), open(dst, 'w'))
    return dst

def dh_analysis():
    Z = json.load(open(os.path.join(HERE, 'zeros_DH.json')))
    on = np.array([float(v) for v in Z['online']]); off = np.array([[float(r[0]) - 0.5, float(r[1])] for r in Z['offline']])
    g_on = np.concatenate([on, -on]); b_on = np.zeros(len(g_on))
    g_off = np.concatenate([off[:, 1], off[:, 1], -off[:, 1], -off[:, 1]]); b_off = np.concatenate([off[:, 0], -off[:, 0], off[:, 0], -off[:, 0]])
    out = dict(first_offline=[off[0].tolist(), off[1].tolist()], rows=[])
    for Xs in ('1e4', '1e5', '1e6', '1e7'):
        L = load('ex_DH_X' + Xs)
        if L is None: continue
        S, xs, t, m = L; X = m['X']; eta = m['eta']
        for i, x in enumerate(xs):
            sel = np.nonzero((t >= 5) & (t <= 400))[0][::4]; ts = t[sel]
            s = 0.5 + x + 1j * ts
            AX = (-S[i][sel] + explib.gamma_part('DH', s, X, eta)).real
            Bon = explib.zero_kernel(x, ts, b_on, g_on, X, eta).real
            Boff = explib.zero_kernel(x, ts, b_off, g_off, X, eta).real
            dens = np.log(5 * 2000 / (2 * math.pi)) / (2 * math.pi)
            tail = x * 2 * (math.log(5 * 2000 / (2 * math.pi)) + 1) / (2 * math.pi * 2000)
            rem_on = AX - Bon - tail; rem_full = rem_on - Boff
            Lor_off = explib.lorentz(x, ts, b_off, g_off).real
            row = dict(X=X, x=float(x))
            for lo, hi in ((10, 45), (45, 70), (70, 80), (80, 84), (87, 95), (95, 105), (120, 160)):
                k = (ts >= lo) & (ts <= hi)
                row['t_%d_%d' % (lo, hi)] = dict(max_abs_rem_online_block=float(np.abs(rem_on[k]).max()), min_rem_online_block=float(rem_on[k].min()),
                                                 max_abs_true_pair_field=float(np.abs(Lor_off[k]).max()), min_true_pair_field=float(Lor_off[k].min()),
                                                 max_abs_rem_all_strip_zeros=float(np.abs(rem_full[k]).max()))
            out['rows'].append(row)
            print('DH X=%s x=%.2f' % (Xs, x), ' | '.join('%s: rem_on %.3e true %.3e full %.3e' % (k, v['max_abs_rem_online_block'], v['max_abs_true_pair_field'], v['max_abs_rem_all_strip_zeros']) for k, v in row.items() if k.startswith('t_')), flush=True)
    res['DH'] = out

def simple_stats(tag, model):
    L = load(tag)
    if L is None: return
    S, xs, t, m = L; out = dict(model=model, X=m['X'], Tc=m['Tc'], N=m['N'], lines=[])
    for i, x in enumerate(xs):
        s = 0.5 + x + 1j * t
        G = explib.gamma_part(model, s, m['X'], m['eta']).real if not (model == 'LIOU' or model.startswith('SGN')) else 0.0
        AX = (-S[i]).real + G
        out['lines'].append(dict(x=float(x), min=float(AX.min()), max=float(AX.max()), mean=float(AX.mean()), rms=float(np.sqrt((AX ** 2).mean())), frac_negative=float((AX < 0).mean())))
        print(tag, 'x=%.4f min %.4g max %.4g mean %.4g rms %.4g frac<0 %.3f' % (x, AX.min(), AX.max(), AX.mean(), np.sqrt((AX ** 2).mean()), (AX < 0).mean()), flush=True)
    res[tag] = out

if __name__ == '__main__':
    z3 = low_zeta_zero_file()
    for Xs in ('1e4', '1e6', '1e8'):
        block_analysis('ex_ZETA_T1e3_X' + Xs, 'ZETA', z3, stride=4)
        block_analysis('ex_ZETA_T1e3_X' + Xs, 'ZETA', z3, stride=4, tnr=(3, 2.2, 0.4037532248277236))
    for tag, zf in (('ex_ZETA_T1e6_X1e6', 'zeros_T1e6'), ('ex_ZETA_T1e6_X1e8', 'zeros_T1e6'), ('ex_ZETA_T1e8_X1e8', 'zeros_T1e8'), ('ex_ZETA_T1e10_X1e10', 'zeros_T1e10'), ('ex_ZETA_T1e10_X1e6', 'zeros_T1e10')):
        block_analysis(tag, 'ZETA', os.path.join(HERE, 'out', zf + '.json'))
    for tag in ('ex_ZETA_T1e6_X1e6', 'ex_ZETA_T1e6_X1e8'):
        block_analysis(tag, 'ZETA', os.path.join(HERE, 'out', 'zeros_T1e6.json'), tnr=(1000003, 2.2, 0.03210653389931739))
    block_analysis('ex_LCHI4_T1e4_X1e8', 'LCHI4', os.path.join(HERE, 'out', 'zeros_LCHI4_T1e4.json'), cond=4.0)
    dh_analysis()
    for Xs in ('1e4', '1e6', '1e8'): simple_stats('ex_EA_X' + Xs, 'EA:0.125')
    for tag, mdl in (('ex_LIOU_T1e6_X1e8', 'LIOU'), ('ex_SGN7_T1e6_X1e8', 'SGN:7'), ('ex_SGN8_T1e6_X1e8', 'SGN:8')): simple_stats(tag, mdl)
    json.dump(res, open(sys.argv[1], 'w'), indent=1)
