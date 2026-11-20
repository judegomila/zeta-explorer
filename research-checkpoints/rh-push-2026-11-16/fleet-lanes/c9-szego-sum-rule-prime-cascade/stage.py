# c9-szego-sum-rule-prime-cascade: decisive first test (float64 screen; mpmath spot checks in limit.py)
# Stage F_P(s) = prod_{p<=P} (1 - u_p p^-s)^-1, stub coefficient alpha_p(t) = u_p p^(-sigma - it), delay order = p ascending.
import numpy as np, json, sys, time
from scipy.special import spence, expi
from scipy.stats import ks_2samp
rng = np.random.default_rng(20261118)
SIG = 0.75
def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0].astype(np.int64)
PMAX = 10 ** 6
PR = primes_upto(PMAX); LP = np.log(PR.astype(float))
# THIN (b = 0.9), floor-greedy rule of c4-thin-twist-control-78/thinlib.py
B = 0.9; EI2 = float(expi(B * np.log(2.0)))
Lp = 0.5 * (expi(B * LP) - EI2); f = np.floor(Lp).astype(np.int64); k = 1 + np.arange(len(PR))
c = k + np.minimum(np.minimum.accumulate(f - k), 0); inS = c > np.concatenate(([0], c[:-1]))
U = {'ZETA': np.ones(len(PR), complex), 'LIOU': -np.ones(len(PR), complex),
     'U1': np.exp(2j * np.pi * rng.random(len(PR))), 'U2': np.exp(2j * np.pi * rng.random(len(PR))),
     'THIN': np.where(inS, -1.0, 1.0).astype(complex)}
ALPHA_WT = 17.3; U['WT'] = np.exp(-1j * ALPHA_WT * LP)
out = {'sigma': SIG, 'thin_count': {str(P): int(inS[PR <= P].sum()) for P in (100, 1000, 10 ** 4, 10 ** 6)}}
def nP(P): return int(np.searchsorted(PR, P, side='right'))
def logF(name, P, t, sig=SIG):
    """log|F_P(sig+it)| for array t (chunked over primes)"""
    n = nP(P); r = PR[:n].astype(float) ** (-sig); u = U[name][:n]; lp = LP[:n]
    acc = np.zeros(len(t))
    for a in range(0, n, 256):
        z = (u[a:a+256] * r[a:a+256])[None, :] * np.exp(-1j * t[:, None] * lp[None, a:a+256])
        acc -= np.log(np.abs(1 - z)).sum(axis=1)
    return acc
def Phi(name, P, T, sig=SIG):
    """Phi_P(T) = int_sig^inf arg F_P(x+iT) dx = Im sum_p Li2(u_p p^(-sig-iT))/log p"""
    n = nP(P); z = U[name][:n] * PR[:n].astype(float) ** (-sig) * np.exp(-1j * T * LP[:n])
    return float((spence(1 - z).imag / LP[:n]).sum())
xg, wg = np.polynomial.legendre.leggauss(240)
def window_nodes(T, H, panels=4):
    h = H / panels; ts = []; ws = []
    for j in range(panels):
        ts.append(T + h * j + (xg + 1) * h / 2); ws.append(wg * h / 2)
    return np.concatenate(ts), np.concatenate(ws)
H = 10.0
# ---------- N1: stage sum rule A (Littlewood form): int_W log|F_P| dt = Phi_P(T) - Phi_P(T+H); bound-state term = 0
t0 = time.time(); n1 = []
for P in (100, 1000, 10 ** 4):
    for name in ('ZETA', 'LIOU', 'U1', 'THIN', 'WT'):
        worst = 0.0; ex = None
        for T in np.concatenate(([0.0, 3.0], 10 ** rng.uniform(1, 4, 10))):
            t, w = window_nodes(T, H); lhs = float((logF(name, P, t) * w).sum()); rhs = Phi(name, P, T) - Phi(name, P, T + H)
            if abs(lhs - rhs) >= worst: worst = abs(lhs - rhs); ex = (float(T), lhs, rhs)
        n1.append({'P': P, 'obj': name, 'max_abs_lhs_minus_rhs': worst, 'example_T_lhs_rhs': ex})
        print('N1', P, name, 'max|LHS-RHS| = %.2e' % worst, 'example', ex, flush=True)
out['N1'] = n1
# ---------- N2: entropy rule (size-only), windows at generic height; coefficient side sum -log(1-p^-2sig)
n2 = []
for P, NW in ((100, 2000), (1000, 600), (10 ** 4, 300)):
    n = nP(P); coef = float(-np.log1p(-PR[:n].astype(float) ** (-2 * SIG)).sum()); l1 = float((PR[:n].astype(float) ** (-SIG)).sum())
    Ts = rng.uniform(1e7, 1e9, NW); rec = {}
    for name in ('ZETA', 'LIOU', 'U1', 'U2', 'THIN'):
        E = []; MX = []; MN = []; ML = []
        for T in Ts:
            t, w = window_nodes(T, H, panels=4); lf = logF(name, P, t)
            m2 = float((np.exp(2 * lf) * w).sum() / H); ml = float((2 * lf * w).sum() / H)
            E.append(np.log(m2) - ml); MX.append(lf.max()); MN.append(lf.min()); ML.append(ml)
        rec[name] = {k2: np.array(v) for k2, v in (('E', E), ('max', MX), ('min', MN), ('meanlog2', ML))}
    row = {'P': P, 'windows': NW, 'coef_side_sum_minus_log(1-p^-2sig)': coef, 'l1_sum_p^-sig': l1, 'objs': {}}
    for name, d in rec.items():
        row['objs'][name] = {q: {'mean': float(v.mean()), 'sd': float(v.std()), 'min': float(v.min()), 'max': float(v.max())} for q, v in d.items()}
        row['objs'][name]['KS_vs_U1'] = {q: [float(x) for x in ks_2samp(v, rec['U1'][q])] for q, v in d.items()} if name != 'U1' else None
    n2.append(row)
    print('N2 P=%d coef side %.4f  l1 %.2f' % (P, coef, l1))
    for name in rec:
        o = row['objs'][name]
        print('   %-5s E_W mean %.4f sd %.4f max %.3f | sup log|F| max %.3f | inf log|F| min %.3f | mean log|F|^2 mean %+.4f sd %.4f | KS(E) vs U1 %s' % (
            name, o['E']['mean'], o['E']['sd'], o['E']['max'], o['max']['max'], o['min']['min'], o['meanlog2']['mean'], o['meanlog2']['sd'],
            ('D=%.3f p=%.2f' % tuple(o['KS_vs_U1']['E'])) if o['KS_vs_U1'] else '-'), flush=True)
out['N2'] = n2
# ---------- N3: phase-reading coefficient functionals in delay order
# SZ(t;P) = sum_n |alpha_{n+1} - alpha_n|^2 (Simon-Zlatos difference), C1 = Re sum alpha_{n+1} conj alpha_n, l2 = sum |alpha_n|^2
def SZ(name, P, t, sig):
    n = nP(P); a = U[name][:n] * PR[:n].astype(float) ** (-sig) * np.exp(-1j * t * LP[:n])
    return float((np.abs(a[1:] - a[:-1]) ** 2).sum()), float((a[1:] * a[:-1].conj()).real.sum()), float((np.abs(a) ** 2).sum())
n3 = []
for sig in (0.75, 0.4):
    for P in (10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5, 10 ** 6):
        for T in (0.0, 1.0, 10.0, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8):
            ts = T + (0.1 * T + 1.0) * rng.random(40) if T > 0 else np.array([0.0])
            rec = {'sigma': sig, 'P': P, 'T': T}
            for name in ('ZETA', 'LIOU', 'U1', 'THIN'):
                v = np.array([SZ(name, P, t, sig) for t in ts]); rec[name] = {'SZ': float(v[:, 0].mean()), 'C1': float(v[:, 1].mean()), 'l2': float(v[:, 2].mean()), 'ratio_SZ_over_2l2': float(v[:, 0].mean() / (2 * v[:, 2].mean()))}
            n3.append(rec)
    print('N3 sigma=%.2f: ratio SZ/(2 sum p^-2sig); rows T, columns P = 1e2..1e6' % sig)
    for name in ('ZETA', 'LIOU', 'U1', 'THIN'):
        print('  ', name)
        for T in (0.0, 1.0, 10.0, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8):
            print('     T=%-8g' % T, ' '.join('%.4f' % r[name]['ratio_SZ_over_2l2'] for r in n3 if r['sigma'] == sig and r['T'] == T), flush=True)
    print('   absolute SZ at T=10 (ZETA) and T=10 (U1), THIN, by P:', [('%.4g' % r['ZETA']['SZ'], '%.4g' % r['U1']['SZ'], '%.4g' % r['THIN']['SZ']) for r in n3 if r['sigma'] == sig and r['T'] == 10.0])
out['N3'] = n3
# ---------- N4: the part of the chain with p << T: distributions over windows, zeta against U
n4 = []
for P, lo, hi in ((100, 1e5, 1e7), (1000, 1e7, 1e9)):
    NW = 3000; n = nP(P)
    def fun(name, Ts):
        res = []
        for T in Ts:
            a = U[name][:n] * PR[:n].astype(float) ** (-SIG) * np.exp(-1j * T * LP[:n])
            res.append((float((np.abs(a[1:] - a[:-1]) ** 2).sum()), float((a[1:] * a[:-1].conj()).real.sum()), float(-np.log(np.abs(1 - a)).sum()), float(-np.angle(1 - a).sum())))
        return np.array(res)
    S = {name: fun(name, rng.uniform(lo, hi, NW)) for name in ('ZETA', 'U1', 'U2', 'THIN', 'LIOU')}
    row = {'P': P, 'T_range': [lo, hi], 'windows': NW, 'KS': {}}
    for a_, b_ in (('ZETA', 'U1'), ('U2', 'U1'), ('THIN', 'U1'), ('LIOU', 'U1'), ('ZETA', 'THIN')):
        row['KS'][a_ + '_vs_' + b_] = {q: [float(x) for x in ks_2samp(S[a_][:, j], S[b_][:, j])] for j, q in enumerate(('SZ', 'C1', 'log|F|', 'argF'))}
    row['moments'] = {name: {q: [float(S[name][:, j].mean()), float(S[name][:, j].std()), float(S[name][:, j].min()), float(S[name][:, j].max())] for j, q in enumerate(('SZ', 'C1', 'log|F|', 'argF'))} for name in S}
    n4.append(row); print('N4 P=%d T in [%g,%g]' % (P, lo, hi))
    for kk, v in row['KS'].items(): print('   KS', kk, {q: 'D=%.3f p=%.3f' % tuple(x) for q, x in v.items()})
    for name in S: print('   ', name, {q: ['%.4f' % x for x in v] for q, v in row['moments'][name].items()}, flush=True)
out['N4'] = n4
# ---------- N5: Kronecker demonstration, stage P = 7 (4 primes): find t* with p^(-i t*) ~ u_p (U1); then compare windows
n = 4; th = np.angle(U['U1'][:n]); best = (9.0, None)
for a in range(0, 400):
    t = (a + np.arange(0, 1, 2e-7) ) * 5e3      # step 1e-3 over [0, 2e6)
    d = np.zeros(len(t))
    for j in range(n):
        x = (t * LP[j] + th[j]) / (2 * np.pi); d = np.maximum(d, np.abs(x - np.round(x)))
    i = int(d.argmin())
    if d[i] < best[0]: best = (float(d[i]), float(t[i]))
tstar = best[1]
# local refinement
for it in range(3):
    tt = tstar + np.linspace(-2e-3, 2e-3, 4001) / (10 ** it); d = np.zeros(len(tt))
    for j in range(n):
        x = (tt * LP[j] + th[j]) / (2 * np.pi); d = np.maximum(d, np.abs(x - np.round(x)))
    tstar = float(tt[d.argmin()]); err = float(d.min() * 2 * np.pi)
t, w = window_nodes(0.0, H); lu = logF('U1', 7, t); lz = logF('ZETA', 7, t + tstar)
n5 = {'primes': [2, 3, 5, 7], 't_star': tstar, 'max_phase_error_rad': err, 'sup_window_diff_log|F|': float(np.abs(lu - lz).max()),
      'E_W_U1_at_0': float(np.log((np.exp(2 * lu) * w).sum() / H) - (2 * lu * w).sum() / H), 'E_W_ZETA_at_tstar': float(np.log((np.exp(2 * lz) * w).sum() / H) - (2 * lz * w).sum() / H),
      'SZ_U1_at_0': SZ('U1', 7, 0.0, SIG)[0], 'SZ_ZETA_at_tstar': SZ('ZETA', 7, tstar, SIG)[0]}
out['N5'] = n5; print('N5', n5)
json.dump(out, open(__file__.replace('.py', '.json'), 'w'), indent=1)
print('done %.0fs' % (time.time() - t0))
