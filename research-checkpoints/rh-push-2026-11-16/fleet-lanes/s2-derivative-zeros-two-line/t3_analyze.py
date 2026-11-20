"""Combination 3: detection height from the t3_low.py outputs.
D_T(sigma1, tau) = log|G(w)| - int_{T_lo <= |t| <= T} P_w log|G(1/2+it)| dt for T on the integer mesh.
Null level N_m = max over T and over tau in [T_lo + m0, T - m] of |D_T| for ZETA and L3 (no zeros right of the line in range).
T_det(control, m, theta) = smallest T with min over tau in [T_lo + m0, T - m] of D_T < -theta.
Usage: t3_analyze.py outdir window(T_lo_T_hi) control [control ...]   (nulls ZETA and L3 are read from the same window)"""
import sys, json, math, numpy as np
D = sys.argv[1]; WIN = sys.argv[2]; CONTROLS = sys.argv[3:]
OFF = {  # first zeros right of the line (beta - 1/2, gamma), from the control tables (c12-control-battery-harness/tables)
 'DH': [(0.30851718245663738, 85.699348485377592), (0.15083008060973708, 114.16334273075698), (0.07435605045080599, 166.47930591316815),
        (0.22425769462680978, 176.70246124285582), (0.36953057964064307, 240.40467235144069), (0.31954959209881083, 320.87648966877486)],
 'EA': [(0.25, 14.134725141734693), (0.25, 21.022039638771554), (0.25, 25.010857580145688)],
 'TNR': [(0.40375322482772352, 2.8596008673801272 * (2 * k + 1)) for k in range(70)],
 'HEAT-0.5': [(0.24295650648697380, 111.69422767246391), (0.19810791112610752, 150.69224610050648), (0.26099386149214953, 169.61188739393268),
              (0.33771395153011906, 185.50700991526575), (0.34325787078792907, 221.22684080599813), (0.32525411646027780, 231.81865273260702)],
 'HEAT-0.1': [(0.021557868614291504, 415.25627896409037)],
 'LIOU': [(0.5, 0.0)], 'LIOUN': [],
}
import os
_TB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'c12-control-battery-harness', 'tables')
try:
    OFF['DH'] = [(float(b) - 0.5, float(g)) for b, g, _ in json.load(open(_TB + '/zeros_DH.json'))['offline']]
    OFF['EA'] = [(0.25, float(g)) for g in json.load(open(_TB + '/zeros_ZETA.json'))['gamma']]
    for _t in ('-0.5', '-0.1'):
        OFF['HEAT' + _t] = [(float(e[0]), float(e[1])) for e in json.load(open(_TB + '/zeros_HEAT-%s.json' % _t))['offline']]
except Exception as _e:
    print('tables not found, using the built-in short lists', _e, file=sys.stderr)
def load(name):
    z = np.load('%s/t3_%s_%s.npz' % (D, name, WIN))
    Tm = np.arange(float(z['TLO']) + 0.25, float(z['THI']) + 1e-9, 0.25)
    cum = np.cumsum(z['cellint'], axis=2); hi = z['cell_hi']
    idx = np.searchsorted(hi, Tm + 1e-9) - 1
    DT = z['LW'][:, :, None] - cum[:, :, idx]            # [sigma, tau, T]
    # the same with G divided by the constant exp(ubar), ubar = mean of log|G| on the line over the window
    # (removes the truncation bias ubar x (1 - Poisson mass of the window) of an object whose line mean is not 0)
    TLO = float(z['TLO']); ub = float(z['int_U']) / (float(z['THI']) - TLO); taus = z['taus']
    DTc = np.empty_like(DT)
    for i, s1 in enumerate([1.0, 1.2, 1.5]):
        a = s1 - 0.5
        M = (np.arctan((Tm[None, :] - taus[:, None]) / a) - np.arctan((TLO - taus[:, None]) / a)) / math.pi
        if TLO == 0.0: M = M + (np.arctan((Tm[None, :] + taus[:, None]) / a) - np.arctan((TLO + taus[:, None]) / a)) / math.pi
        DTc[i] = DT[i] - ub * (1 - M)
    return dict(z=z, Tm=Tm, DT=DT, DTc=DTc, ubar=ub, taus=z['taus'], TLO=TLO, THI=float(z['THI']))
def stat(o, m, fn, key='DT'):
    """fn over tau in [TLO + m0, T - m] for each T; returns array over T (nan where empty)."""
    m0 = m if o['TLO'] > 0 else 0.0
    out = np.full((3, len(o['Tm'])), np.nan); arg = np.full((3, len(o['Tm'])), np.nan)
    for k, T in enumerate(o['Tm']):
        sel = (o['taus'] >= o['TLO'] + m0) & (o['taus'] <= T - m)
        if sel.any():
            v = o[key][:, sel, k]; out[:, k] = fn(v, axis=1)
            arg[:, k] = o['taus'][sel][np.argmin(v, axis=1)]
    return out, arg
nulls = {n: load(n) for n in ('ZETA', 'L3')}
res = dict(window=WIN, margins={}, controls={})
MS = [1.0, 2.0, 5.0, 10.0]
for m in MS:
    lev = {}
    for n, o in nulls.items():
        a, _ = stat(o, m, lambda v, axis: np.abs(v).max(axis=axis)); lev[n] = [float(np.nanmax(a[i])) for i in range(3)]
    res['margins'][m] = lev
for c in CONTROLS:
    o = load(c); r = dict(first_offline=OFF.get(c, [])[:3], rows=[])
    g1 = OFF[c][0][1] if OFF.get(c) else None
    if g1 is not None and o['TLO'] > 0:
        g1 = min((g for d, g in OFF[c] if g > o['TLO']), default=None)
    r['line_mean_of_log_abs_G'] = o['ubar']
    for m in MS:
        mn0, arg0 = stat(o, m, lambda v, axis: v.min(axis=axis))
        mn1, arg1 = stat(o, m, lambda v, axis: v.min(axis=axis), key='DTc')
        for i, s1 in enumerate([1.0, 1.2, 1.5]):
            null = max(res['margins'][m]['ZETA'][i], res['margins'][m]['L3'][i])
            row = dict(margin=m, sigma1=s1, null_level=null)
            for lab, th, mn, arg in [('2x_null', 2 * null, mn0, arg0), ('2x_null_meancorr', 2 * null, mn1, arg1)]:
                k = np.where(mn[i] < -th)[0]
                if len(k):
                    T = float(o['Tm'][k[0]]); row['T_det_' + lab] = T; row['tau_at_det_' + lab] = float(arg[i][k[0]]); row['D_at_det_' + lab] = float(mn[i][k[0]])
                    if g1 is not None: row['gamma1_minus_T_det_' + lab] = g1 - T
                else: row['T_det_' + lab] = None
            r['rows'].append(row)
    # full-window D against the Blaschke sum of the tabulated zeros
    full = o['DT'][:, :, -1]; taus = o['taus']; sel = (taus >= o['TLO'] + (20 if o['TLO'] > 0 else 0)) & (taus <= o['THI'] - 20)
    if OFF.get(c) and sel.any():
        zs = [(d, g) for d, g in OFF[c] if o['TLO'] <= g <= o['THI']] if o['TLO'] > 0 else OFF[c]
        r['blaschke_check'] = []
        for i, s1 in enumerate([1.0, 1.2, 1.5]):
            a = s1 - 0.5; B = np.zeros(len(taus))
            for d, g in zs:
                for sg in ((1, -1) if g > 0 else (1,)):
                    u = taus - sg * g + 1e-300; B += 0.5 * np.log(((a - d) ** 2 + u ** 2) / ((a + d) ** 2 + u ** 2))
            j = np.argmin(full[i][sel])
            r['blaschke_check'].append(dict(sigma1=s1, min_D=float(full[i][sel][j]), at_tau=float(taus[sel][j]), blaschke_there=float(B[sel][j]),
                                            max_abs_D_minus_blaschke=float(np.abs(full[i][sel] - B[sel]).max()), zeros_used=len(zs)))
    elif sel.any():
        r['full_window'] = [dict(sigma1=s1, min_D=float(full[i][sel].min()), max_D=float(full[i][sel].max())) for i, s1 in enumerate([1.0, 1.2, 1.5])]
    # D_T at fixed tau = gamma1 - 2 and gamma1 - 5 (mesh points) as the upper limit T passes gamma1
    if g1 is not None:
        for off in (2.0, 5.0):
            j = int(np.argmin(np.abs(taus - (g1 - off)))); prof = []
            for dT in [-1.5, -1.0, -0.75, -0.5, -0.25, 0.0, 0.25, 0.5, 1.0, 2.0, 5.0, 20.0]:
                Tq = round((g1 + dT) * 4) / 4
                k = np.where(np.abs(o['Tm'] - Tq) < 1e-9)[0]
                if len(k) and Tq > taus[j]:
                    prof.append([round(Tq - g1, 4), [round(float(o['DT'][i, j, k[0]]), 6) for i in range(3)], [round(float(nulls['ZETA']['DT'][i, j, k[0]]), 6) for i in range(3)]])
            r['profile_tau=gamma1-%g__[T-gamma1, D_control(3 sigma1), D_zeta(3 sigma1)]' % off] = prof
    res['controls'][c] = r
print(json.dumps(res, indent=1))
