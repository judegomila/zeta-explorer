"""R5 referee: direct numerical test of sec 3.3-3.5 / App A / C.3 against the ACTUAL finite model (51).
Own code (numpy float64/complex128). Reads packet JSON as data only (paths passed as argv[1]).
For chosen rows, times, centres x >= X and phases it evaluates f_x, the Euler multiplier, Q, V, T_K and the
log-derivative remainder directly from n = 1..N and compares with the bounds assembled from the stored primitives.
tau and Gamma are free unit-phase parameters here (the bounds of this part are claimed for every phase)."""
import sys, json, math
from fractions import Fraction as F
import numpy as np
PH = sys.argv[1] + '/inputs/source_tree/unconditional_20261020/physical_check/'
rows_wanted = [int(x) for x in sys.argv[2].split(',')]
N0 = 690988; K = 4096; X = 6000000185827; v0 = math.log(N0); DEL = 1e-12; VP = 6723 / 500
plan = json.load(open(PH + 'PLAN.json'))['blocks']
nat = json.load(open(PH + 'retained/THERMAL_NATIVE_256_B.json'))['blocks']
act = json.load(open(PH + 'ACTIVATION.json'))['blocks']
rng = np.random.default_rng(20261117)
fl = lambda s: float(F(s))

def coeffs(t):
    lg = np.zeros(K + 1); lg[1:] = np.log(np.arange(1, K + 1))
    b = np.exp(t * lg ** 2 / 4); b[0] = 0
    d = np.zeros(K + 1); pend = np.zeros(K + 1)
    for n in range(2, K + 1):
        d[n] = lg[n] * b[n] - pend[n]
        m = np.arange(2, K // n + 1)
        if len(m): pend[n * m] += d[n] * b[m]
    dt = d.copy()
    for p in (2, 3, 5):
        q = p; j = 1
        while q <= K:
            dt[q] -= lg[p] * math.exp(j * t * lg[p] ** 2 / 4); q *= p; j += 1
        dt[p] = 0.0
    return lg, b, d, dt

def euler(t):
    e = [(1, 1.0, 0.0)]
    for p in (2, 3, 5):
        e += [(d * p, -s, q + math.log(p) ** 2) for d, s, q in list(e)]
    return e  # (d, sign, sum log^2 p)

worst = {}
def rec(key, ratio, info):
    if key not in worst or ratio > worst[key][0]: worst[key] = (ratio, info)

def primitives_direct(h, tl, tr):
    """A,B,P,P1,D,Z,T at the comparison point (thermal t+, abscissa (1+h)/2 + t- L0/4), by direct sums over all n<=N0."""
    L0 = 2 * v0; su = (1 + h) / 2 + tl * L0 / 4; sv = su - h
    ln = np.log(np.arange(1, N0 + 1, dtype=np.float64))
    u = np.exp(tr * ln ** 2 / 4 - su * ln); refl = np.exp(tr * ln ** 2 / 4 - sv * ln) * math.exp(-h * L0 / 2)
    E = [(d, s * math.exp(tr * q / 4 - su * math.log(d)), math.log(d)) for d, s, q in euler(tr)]
    P = sum(abs(w) for d, w, l in E); P1 = sum(abs(w) * l for d, w, l in E)
    # collected head c(m) m^-su for m<=N0 and overflow in absolute value
    cw = np.zeros(N0 + 1); ab = 0.0; abB = 0.0
    cs_u = np.concatenate([[0.0], np.cumsum(u)]); cs_ul = np.concatenate([[0.0], np.cumsum(u * ln)])
    for d, w, l in E:
        m = N0 // d
        cw[d:d * m + 1:d] += w * u[:m]
        ab += abs(w) * (cs_u[N0] - cs_u[m]); abB += abs(w) * ((cs_ul[N0] - cs_ul[m]) + l * (cs_u[N0] - cs_u[m]))
    lnall = np.concatenate([[0.0], ln])
    minc = cw[2:].min()
    Ahead = cw[2:].sum(); Bhead = (cw[2:] * lnall[2:]).sum()
    A = Ahead + ab + P * refl.sum(); B = Bhead + abB + P * (refl * (L0 - ln)).sum() + P1 * refl.sum()
    lg, b, d_, dt = coeffs(tr)
    kk = np.arange(2, K + 1); q = dt[2:] * np.exp(-su * lg[2:])
    D = q.sum(); csc = np.cumsum(cw); Z = (q * (csc[N0 // kk] - cw[1] - cw[0])).sum()
    T = 0.0
    for p in (2, 3, 5):
        uu = math.exp(tr * math.log(p) ** 2 / 4 - su * math.log(p)); j = 1; n = p
        while n <= K: n *= p; j += 1
        T += math.log(p) * uu ** j / (1 - uu)
    return dict(A=A, B=B, P=P, P1=P1, D=D, Z=Z, T=T, minc=minc)

def caps(n, aa, dd):
    A, B, P, P1, DU, DM, Z, T = (fl(n[k]) for k in ('prefix_A_upper', 'prefix_B_upper', 'Euler_norm_upper', 'Euler_log_moment_upper', 'D_upper', 'D_match_lower', 'overlap_Z_match_lower', 'Euler_tail_upper'))
    a = P * aa; b = 2 * P * dd + P1 * aa; g = 1 - A - a
    R = B - (1 - A) * DM - 2 * Z
    return dict(an=(R + b + a * DU) / (2 * g) + T / 2, num=R + b + a * DU, g=g, a=a, b=b, A=A, B=B, P=P, R=R)

for i in rows_wanted:
    blk = plan[i]; tl, tr, sc = fl(blk['t_lo']), fl(blk['t_hi']), fl(blk['scale'])
    nr = {F(x['height']): x for x in nat[i]['height_records']}; ar = {F(x['height']): x for x in act[i]['heights']}
    hs = [F(blk['scale']) * F(h) for h in ('2', '109/50', '5/2', '3', '4', '5', '6')]
    nodes = [(F(blk['scale']) * F(p['height']), float(F(blk['scale']) * F(p['height']) * F(p['r'])), fl(p['weight']) / sc) for p in blk['probes']]
    dual = [fl(x) for x in json.load(open(PH + 'envelopes/%03d.json' % i))['dual']]
    assert all(h in nr for h, v, w in nodes) and set(hs) == set(nr)
    # --- independent direct recomputation of the stored primitives at the comparison point
    for hF in hs:
        st = nr[hF]; pr = primitives_direct(float(hF), tl, tr)
        for key, mine, up in (('prefix_A_upper', pr['A'], True), ('prefix_B_upper', pr['B'], True), ('Euler_norm_upper', pr['P'], True), ('Euler_log_moment_upper', pr['P1'], True), ('D_upper', pr['D'], True), ('D_match_lower', pr['D'], False), ('overlap_Z_match_lower', pr['Z'], False), ('Euler_tail_upper', pr['T'], True)):
            s_ = fl(st[key]); rel = (mine - s_) / abs(mine) if up else (s_ - mine) / abs(mine)
            rec('stored primitive on wrong side of own direct value (relative, >1e-9 would be a failure): ' + key, rel, (i, str(hF)))
        rec('min collected head coefficient c(m)m^-s (negated)', -pr['minc'], (i, str(hF)))
    for t in (tl, tr):
        lg, bK, dK, dtK = coeffs(t)
        for s in (0.0, 0.02, 0.15, 0.35, 0.8, 1.6):
            x = X if s == 0.0 else 4 * math.pi * math.exp(2 * (v0 + s))
            L = math.log(x / (4 * math.pi)); s_true = L / 2 - v0; N = int(math.isqrt(int(x / (4 * math.pi) + t / 16)))
            assert N >= N0 and s_true > 0
            ln = np.log(np.arange(1, N + 1, dtype=np.float64))
            assert ln[-1] - v0 <= s_true + DEL + 1e-13
            base = t * ln ** 2 / 4 - (0.5 + t * L / 4) * ln
            u = s_true + DEL
            for trial in range(2):
                tau = rng.uniform(0, 3000.0); Gam = np.exp(1j * rng.uniform(0, 2 * math.pi))
                E_list = [(d, sgn * math.exp(t * q / 4), math.log(d)) for d, sgn, q in euler(t)]
                def evalz(h, v):
                    first = np.exp(base - h * ln / 2 + 1j * (tau + v / 2) * ln)
                    refl = Gam * np.exp(base - h * (L - ln) / 2 + 1j * (v / 2 * (L - ln) - tau * ln))
                    f = first.sum() + refl.sum(); fp = (-ln / 2 * first).sum() + (-(L - ln) / 2 * refl).sum()
                    ff = first[:N0].sum() + refl[:N0].sum(); ffp = (-ln[:N0] / 2 * first[:N0]).sum() + (-(L - ln[:N0]) / 2 * refl[:N0]).sum()
                    aA = np.abs(first[N0:]).sum() + np.abs(refl[N0:]).sum(); aD = (ln[N0:] / 2 * np.abs(first[N0:])).sum() + ((L - ln[N0:]) / 2 * np.abs(refl[N0:])).sum()
                    Ez = 0; Ezp = 0
                    for d, w, l in E_list:
                        term = w * np.exp(-(0.5 + t * L / 4) * l - h * l / 2 + 1j * (tau + v / 2) * l)
                        Ez += term; Ezp += -l / 2 * term
                    k = np.arange(2, K + 1); ph = np.exp(-(0.5 + t * L / 4) * lg[2:] - h * lg[2:] / 2 + 1j * (tau + v / 2) * lg[2:])
                    TK = (dtK[2:] * ph).sum(); head = -0.5 * (dK[2:] * ph).sum()
                    Q = Ez * f; Qp = Ezp * f + Ez * fp; Qf = Ez * ff; Qfp = Ezp * ff + Ez * ffp
                    return dict(f=f, fp=fp, Q=Q, Qp=Qp, Qf=Qf, Qfp=Qfp, E=Ez, TK=TK, rem=fp / f - head, aA=aA, aD=aD)
                tag = (i, 't=%g' % t, 's=%.3g' % s_true, 'N=%d' % N, trial)
                for hF in hs:
                    h = float(hF); st = nr[hF]; ac = ar[hF]; C = fl(ac['C_upper'])
                    near = caps(st, 2 * C * u, C * (VP + 2 * u) * u); glob = caps(st, fl(ac['Aact_upper']), fl(ac['Dact_upper']))
                    # App A closed forms
                    d_ = (h - 1) / 2; p_ = (h + 1) / 2; a_ = tl * (2689 / 200) / 2; k_ = a_ + d_; c_ = a_ + h; U_ = 1 / d_ - 1 / p_
                    A3 = math.exp(-a_ * u) / d_ - U_ * math.exp(-k_ * u) - math.exp(-c_ * u) / p_
                    Aa = VP / (2 * d_) + 1 / (2 * d_ * d_); Ak = VP * U_ / 2 + (1 / d_ ** 2 - 1 / p_ ** 2) / 2; Bk = U_ / 2; Ac = VP / (2 * p_) + 1 / (2 * p_ * p_); Bc = 1 / p_
                    D3 = Aa * math.exp(-a_ * u) - (Ak + Bk * u) * math.exp(-k_ * u) - (Ac + Bc * u) * math.exp(-c_ * u)
                    for v in (0.0, rng.uniform(-1.95, 1.95)):
                        r = evalz(h, v)
                        if N > N0:
                            rec('activation amplitude: actual sum / (C*A(u)) [App A (111)]', r['aA'] / (C * A3), tag + (str(hF),))
                            rec('activation half-frequency moment: actual / (C*D(u)) [App A (112)]', r['aD'] / (C * D3), tag + (str(hF),))
                            rec('C*A(u) / stored global Aact', C * A3 / fl(ac['Aact_upper']), tag + (str(hF),))
                            rec('C*D(u) / stored global Dact', C * D3 / fl(ac['Dact_upper']), tag + (str(hF),))
                            rec('C*A(u) / near 2Cu', A3 / (2 * u), tag); rec('C*D(u) / near C(V+ +2u)u', D3 / ((VP + 2 * u) * u), tag)
                        rec('|E| / P', abs(r['E']) / near['P'], tag + (str(hF),))
                        rec('fixed labels |Q_fixed-1| / A', abs(r['Qf'] - 1) / near['A'], tag + (str(hF),))
                        rec('fixed labels |2 Q_fixed\'| / B', abs(2 * r['Qfp']) / near['B'], tag + (str(hF),))
                        rec('fixed labels |V_f - Q_f T_K| / R*  [eq (62)]', abs(-2 * r['Qfp'] - r['Qf'] * r['TK']) / near['R'], tag + (str(hF),))
                        for nm, cp in (('near', near), ('global', glob)):
                            if cp['g'] <= 0: continue
                            rec('g / |Q| (%s)' % nm, cp['g'] / abs(r['Q']), tag + (str(hF),))
                            rec('|2Q\'| / (B+b) (%s)' % nm, abs(2 * r['Qp']) / (cp['B'] + cp['b']), tag + (str(hF),))
                            rec('|V - Q T_K| / (R*+b+aD+) (%s)' % nm, abs(-2 * r['Qp'] - r['Q'] * r['TK']) / cp['num'], tag + (str(hF),))
                            rec('|f\'/f - head| / E_an (%s) [eq (64)/(68)]' % nm, abs(r['rem']) / cp['an'], tag + (str(hF),))
                # signed functional of the analytic remainder vs triangle and spectral (72) bounds
                val = 0.0
                for hF, a, w in nodes:
                    h = float(hF)
                    val += w * 0.5 * (evalz(h, a)['rem'].real + (evalz(h, -a)['rem'].real if a != 0 else evalz(h, a)['rem'].real))
                for nm, fa in (('near', lambda hF: caps(nr[hF], 2 * fl(ar[hF]['C_upper']) * u, fl(ar[hF]['C_upper']) * (VP + 2 * u) * u)), ('global', lambda hF: caps(nr[hF], fl(ar[hF]['Aact_upper']), fl(ar[hF]['Dact_upper'])))):
                    cps = {hF: fa(hF) for hF in hs}
                    if min(c['g'] for c in cps.values()) <= 0: continue
                    tri = sum(abs(w) * cps[hF]['an'] for hF, a, w in nodes); com = sum(c * cps[hF]['an'] for c, hF in zip(dual, hs))
                    rec('|L_i(analytic remainder)| / triangle bound (%s)' % nm, abs(val) / tri, tag)
                    rec('|L_i(analytic remainder)| / spectral-envelope bound sum c_l E_an,l (%s) [eq (72)]' % nm, abs(val) / com, tag)
            del ln, base
    print('row', i, 'done', flush=True)
print('\nRESULT: worst ratio observed for each claimed inequality (ratio <= 1 means the inequality held in every test):')
for k in sorted(worst):
    print('  %-95s %.6g   at %s' % (k, worst[k][0], worst[k][1]))
bad = [k for k in worst if worst[k][0] > 1 and 'wrong side' not in k and 'negated' not in k]
bad += [k for k in worst if 'wrong side' in k and worst[k][0] > 1e-9]
bad += [k for k in worst if 'negated' in k and worst[k][0] > 1e-13]
print('VIOLATIONS:', bad)
