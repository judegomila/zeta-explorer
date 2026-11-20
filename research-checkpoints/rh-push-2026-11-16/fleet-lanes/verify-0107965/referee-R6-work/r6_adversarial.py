"""R6 referee: independent numerical/adversarial tests of the arithmetic credits on the actual packet data.
Own code. Reads JSON data only (argument 1 = inputs/workspace root). float64 + mpmath; not a proof.
Tests, per row:
  shared (28):  S1 torus minimum of the lower-capacity triangle deficit  >= Delta_fix
                S2 relation-constrained torus minimum (band)               >= Delta_fix + C_orbit
                S3 actual orbit, end to end: M c - Re P_{t,c}(chi_x) >= M c0 - chord(final scalar head)
  retained (39): R1 torus minimum of deficit with L=27 lower capacities    >= C_comp ; torus max of Re P at L=27,29,40 <= raw chord - C_comp
                 R2 relation-constrained torus minimum + (A/4)log(1+v)      >= C_comp + d_new   (sign branches, rectangle points)
                 R3 actual orbit, end to end: A*Delta + raw chord - Re P    >= C_comp + d_new
"""
import sys, json, math, time, itertools, random
from fractions import Fraction as F
from pathlib import Path
import numpy as np, mpmath as mp
from scipy import sparse
from scipy.optimize import minimize
mp.mp.dps = 60
W = Path(sys.argv[1]); BUDGET = float(sys.argv[2]) if len(sys.argv) > 2 else 1500.0
OUTJ = sys.argv[3] if len(sys.argv) > 3 else None
T0 = time.time(); rng = np.random.default_rng(20261117); random.seed(7)
K = 4096; N0 = 690988; X = 6000000185827
def read(p): return json.loads(Path(p).read_text())
root = W / 'attack/latest_lambda_reconstructed/workspace'
BASE = root / 'continuation_20261022b/deliverables/Lambda_Joint_Phases_and_Contact_Slab_Proof_Package_2026-10-22/recovered/package/Lambda_Continuation_Proof_Package_2026-10-22/recovered/base/continuation_package'
ANG = root / 'continuation_20261022b/deliverables/Lambda_Joint_Phases_and_Contact_Slab_Proof_Package_2026-10-22/global_source_progress/candidate'
HYB = root / 'continuation_20261022e/probe_optimisation'
hybrid = read(HYB / 'SHARED_HYBRID_PLAN.json')['rows']
sharp = read(W / 'attack/heat_source/SHARP_SOURCE_256.json')
weighted = read(W / 'strategy_round5/lambda_native_force/weights_v2/WEIGHTED_SOURCE.json')['records']
wcert = {r['row']: r for r in read(W / 'strategy_round5/lambda_native_force/weights_v2/WEIGHTED_CERTIFICATE.json')['rows']}
reports = {r['row']: r for r in read(W / 'corner_search/adversarial_joint_relation_source_receipt.json')['reports']}
raw = read(BASE / 'inputs/source_tree/unconditional_20261020/physical_check/SOURCE.json')['lanes']['B']
resources = read(BASE / 'inputs/source_tree/continuation_20261020/physical/COMPOSITE_SOURCE_EXACT_RECEIPT.json')['records']
angp = read(ANG / 'JOINT_ANGULAR_SOURCE_PRODUCER.json')
affine = read(BASE / 'candidate/JOINT_SOURCE_PRODUCER.json')['rows']
prop = {r['row']: r for r in read(W / 'lambda_round15/director/COMMON_CLOCK_MAIN_39_ROW_SOURCE_PROPOSAL_V2.json')['rows']}
eighth = read(W / 'lambda_round15/new_relations/EIGHT_RELATION_ROW8_SOURCE_PROPOSAL_V1.json')
final = read(W / 'lambda_round15/flow_main_v2/MAIN_CLOCK_SOURCE.json')['records']
m8plan = read(W / 'lambda_round14/material/m8_late/M8_LATE_PLAN.json')['rows']

# ---- arithmetic tables
primes = [p for p in range(2, K + 1) if all(p % d for d in range(2, math.isqrt(p) + 1))]
pidx = {p: j for j, p in enumerate(primes)}; NP = len(primes)
rowsE, colsE, valsE = [], [], []
for n in range(2, K + 1):
    v = n
    for p in primes:
        if p * p > v: break
        e = 0
        while v % p == 0: v //= p; e += 1
        if e: rowsE.append(n - 2); colsE.append(pidx[p]); valsE.append(e)
    if v > 1: rowsE.append(n - 2); colsE.append(pidx[v]); valsE.append(1)
E = sparse.csr_matrix((valsE, (rowsE, colsE)), shape=(K - 1, NP), dtype=float)
ET = E.T.tocsr()
logn = np.array([math.log(n) for n in range(2, K + 1)]); logp = np.array([math.log(p) for p in primes])
mplog = [mp.mpf(0), mp.mpf(0)] + [mp.log(n) for n in range(2, K + 1)]
divs = [[] for _ in range(K + 1)]
for d in range(2, K + 1):
    for n in range(2 * d, K + 1, d): divs[n].append(d)
_dcache = {}
def dcoef(t):
    """own computation: d_t = (b log) * b^{-1} via the triangular recurrence, 60 digits, returned as float array n=2..K"""
    t = F(t)
    if t in _dcache: return _dcache[t]
    tt = mp.mpf(t.numerator) / t.denominator
    b = [mp.mpf(0), mp.mpf(1)] + [mp.exp(tt * mplog[n] ** 2 / 4) for n in range(2, K + 1)]
    d = [mp.mpf(0)] * (K + 1)
    for n in range(2, K + 1):
        d[n] = mplog[n] * b[n] - mp.fsum(d[r] * b[n // r] for r in divs[n])
    arr = np.array([float(d[n]) for n in range(2, K + 1)])
    assert arr.min() >= -1e-25, ('negative d_t', t, arr.min())
    _dcache[t] = np.maximum(arr, 0.0); return _dcache[t]
def filt(nodes):
    f = np.zeros(K - 1)
    for h, v, w in nodes: f += float(w) * np.exp(-float(h) * logn / 2) * np.cos(float(v) * logn / 2)
    return f
c0 = math.log(N0) / 2; L0 = 4 * c0

# ---- actual physical phases: frac((x/2) log p / (2 pi)) by exact big-integer fixed point
BITS = 300
Lfix = [int(mp.floor(mp.log(p) / (4 * mp.pi) * mp.mpf(2) ** BITS)) for p in primes]   # log p/(4 pi)
def base_phases(xs_q):
    """xs_q: list of Fractions x (denominator power of two). returns array [len, NP] of (x/2) log p mod 2pi"""
    out = np.empty((len(xs_q), NP))
    for a, x in enumerate(xs_q):
        num, den = x.numerator, x.denominator
        sh = den.bit_length() - 1; assert den == 1 << sh
        mod = 1 << (BITS + sh)
        out[a] = [((num * Lf) % mod) / mod for Lf in Lfix]
    return out * 2 * math.pi
def sample_x(lo, hi, n):
    return [F(int(rng.uniform(lo, hi) * 1024), 1024) for _ in range(n)]
XB = sample_x(X, 6.6e12, 2500) + [F(X), F(X - 4), F(6599999999999), F(66 * 10 ** 11)]
XN = sample_x(X, 6.26e12, 2500)
XF = sample_x(6.6e12, 6.75e12, 600) + sample_x(6.75e12, 2e13, 400) + [F(int(10 ** e * rng.uniform(1, 9))) for e in (14, 16, 20, 30, 60) for _ in range(40)]
XS = XB + XN + XF
xs_f = np.array([float(x) for x in XS])
Lx = np.array([float(mp.log(mp.mpf(x.numerator) / x.denominator / (4 * mp.pi))) for x in XS])
dL = np.array([float(mp.log(mp.mpf(x.numerator) / x.denominator / (4 * mp.pi)) - 2 * mp.log(N0)) for x in XS])  # L-L0 accurately
print('samples', len(XS), 'computing exact phases ...', flush=True)
PH = base_phases(XS)
print('phases done', round(time.time() - T0, 1), 's; min L-L0 =', dL.min(), flush=True)

def orbit_cos(i_t, chunk=500):
    """yield (slice, cos(tau log n)) for actual phases, thermal time t"""
    for a in range(0, len(XS), chunk):
        th = PH[a:a + chunk] + (math.pi * i_t / 8) * logp[None, :]
        yield slice(a, a + chunk), np.cos(th @ ET)      # [chunk, K-1]

def torus_min(wts, fsign, starts, Kc=None, rhs=None, maxiter=600):
    """minimise D(th)=sum w_n (1 - f_n cos(E_n th)) over gauged prime angles; optional linear constraints Kc th = rhs (exact, via null space)."""
    wf = wts * fsign
    if Kc is not None:
        part = np.linalg.lstsq(Kc, rhs, rcond=None)[0]
        Q, _ = np.linalg.qr(Kc.T, mode='complete'); Z = Q[:, Kc.shape[0]:]
    best = (np.inf, None)
    for s in starts:
        if Kc is None:
            fun = lambda y: (float(np.sum(wts) - wf @ np.cos(E @ y)), ET @ (wf * np.sin(E @ y)))
            y0 = s
        else:
            def fun(y):
                th = part + Z @ y; ph = E @ th
                return float(np.sum(wts) - wf @ np.cos(ph)), Z.T @ (ET @ (wf * np.sin(ph)))
            y0 = Z.T @ (s - part)
        r = minimize(fun, y0, jac=True, method='L-BFGS-B', options={'maxiter': maxiter, 'maxfun': 3 * maxiter, 'ftol': 1e-15, 'gtol': 1e-10})
        if r.fun < best[0]: best = (r.fun, (r.x if Kc is None else part + Z @ r.x))
    return best

res = {'shared': [], 'retained': [], 'fail': []}
def flag(row, name, margin, extra=''):
    if not (margin >= -1e-9):
        res['fail'].append((row, name, margin)); print('  *** VIOLATION row', row, name, margin, extra, flush=True)

def gauged(fl):
    s = np.sign(fl); sp = np.array([s[p - 2] for p in primes])           # prime gauges
    # g_n = prod s_p^{e_p}
    neg = (sp < 0).astype(float); par = (E @ neg) % 2
    g = np.where(par > 0.5, -1.0, 1.0)
    return s, sp, s * g                                                  # frustration sign f_n = s_n g_n

order = [i for i in range(67)]
for i in order:
    spec = hybrid[i]; tl, th_ = map(F, spec['time']); tm = (tl + th_) / 2
    nodes = [(F(v['height']), F(v['shift']), F(v['weight'])) for v in spec['nodes']]
    M = float(sum(w for _, _, w in nodes)); fl = filt(nodes); absf = np.abs(fl)
    s, sp, fs = gauged(fl)
    dlo, dhi = dcoef(tl), dcoef(th_)
    tleft = BUDGET - (time.time() - T0)
    rich = tleft > 0
    if spec['mode'] != 'retained':
        table = read(W / 'attack/heat_source' / sharp['records'][i]['fixed_table_file'])
        fixed = float(F(sharp['records'][i]['fixed_phase_credit'])); coord = float(F(sharp['records'][i]['sharp_coordinate_credit']))
        mu = float(F(sharp['records'][i]['coordinate_derivative_margin'])); orbit = float(F(wcert[i]['paid_credit']))
        lowcap = 0.5 * dlo * np.exp(-(0.5 + float(th_) * c0) * logn) * absf            # own lower-capacity formula
        stored = np.array([int(v) for v in table['lower_caps']], dtype=float) / 2.0 ** 128
        capviol = float(np.max(stored - lowcap * (1 + 1e-11)))
        # own mu
        U0 = 0.5 * dhi * np.exp(-(0.5 + float(tl) * c0) * logn) * absf
        mu_own = M - float(th_) * float(np.sum(logn * U0))
        rec = {'row': i, 'M': M, 'fixed': fixed, 'coord': coord, 'orbit': orbit, 'mu': mu, 'mu_own': mu_own, 'cap_excess': capviol}
        flag(i, 'stored lower cap <= own lower cap', -capviol); flag(i, 'stored mu <= own mu (+1e-9)', mu_own - mu + 1e-9)
        # S1 torus minimum with lower capacities
        starts = [np.zeros(NP)] + ([rng.uniform(-np.pi, np.pi, NP), rng.normal(0, 0.3, NP)] if rich else [])
        m1, _ = torus_min(lowcap, fs, starts)
        rec['S1_torus_min_minus_fixed'] = m1 - fixed; flag(i, 'S1', m1 - fixed)
        # S2 constrained by the certified relations at band points
        rels = reports[i]['relations']; Kc = np.zeros((len(rels), NP)); lr = []
        for j, rel in enumerate(rels):
            for p, k in rel['pairs']: Kc[j, pidx[p]] = k
            lr.append(mp.log(mp.mpf(int(rel['ratio_numerator'])) / int(rel['ratio_denominator'])))
        s2 = np.inf; phis_all = []
        pts = [(F(6 * 10 ** 12), tl), (F(66 * 10 ** 11), th_), (F(63 * 10 ** 11), tm)]
        for (xx, tt) in pts:
            tau = mp.mpf(xx) / 2 + mp.pi * mp.mpf(tt.numerator) / tt.denominator / 8
            phis = np.array([float(tau * l) for l in lr]); phis_all.append(phis)
            brs = [np.zeros(len(rels)), np.ones(len(rels))] + ([rng.integers(0, 2, len(rels)).astype(float) for _ in range(6)] if rich else [])
            for mvec in brs:
                rhs = phis - 2 * np.pi * mvec
                v2, thv = torus_min(lowcap, fs, [np.zeros(NP)], Kc, rhs, maxiter=400)
                assert np.max(np.abs(Kc @ thv - rhs)) < 1e-8
                s2 = min(s2, v2)
        rec['phi_range'] = [float(np.min(phis_all)), float(np.max(phis_all))]
        rec['S2_constrained_min_minus_fixed_minus_orbit'] = s2 - fixed - orbit; flag(i, 'S2', s2 - fixed - orbit)
        # S3 actual orbit end to end + relation phase identity on the orbit
        fh, lh = float(F(weighted[i]['first_hi'])), float(F(weighted[i]['last_hi']))
        worst = np.inf; worst_band = np.inf; worst_def = np.inf; relerr = 0.0
        for tt, dco in ((tl, dlo), (tm, dcoef(tm)), (th_, dhi)):
            theta = float((tt - tl) / (th_ - tl)); chord = (1 - theta) * fh + theta * lh
            for sl, C in orbit_cos(float(tt)):
                cc = Lx[sl] / 4
                coef = 0.5 * dco[None, :] * np.exp(-(0.5 + float(tt) * cc[:, None]) * logn[None, :]) * fl[None, :]
                reP = np.sum(coef * C, axis=1)
                marg = M * dL[sl] / 4 - reP + chord                     # (M c - ReP) - (M c0 - chord)
                worst = min(worst, marg.min())
                inband = xs_f[sl] <= 6.6e12
                if inband.any():
                    worst_band = min(worst_band, marg[inband].min())
                    dfc = np.sum(lowcap[None, :] * (1 - s[None, :] * C[inband]), axis=1)   # lower-capacity deficit at actual phases
                    worst_def = min(worst_def, dfc.min() - fixed - orbit)
        rec.update({'S3_min_margin_all_x': worst, 'S3_min_margin_band': worst_band, 'S3b_band_deficit_minus_fixed_minus_orbit': worst_def})
        flag(i, 'S3', worst); flag(i, 'S3b', worst_def)
        res['shared'].append(rec)
        print('S row', i, {k: (round(v, 9) if isinstance(v, float) else v) for k, v in rec.items()}, round(time.time() - T0), 's', flush=True)
    else:
        r = angp['records'][i]; rs = resources[i]
        cc_ = float(F(rs['accepted_credit'])); d_old = float(F(r['credit']))
        gain = F(29, 10000) if i == 8 else F(prop[i]['old_source_gain']); d_new = d_old + float(gain)
        beta = F(affine[i]['beta']); A = float((1 - beta) * sum(w for _, _, w in nodes)); omega = 4 * d_new / A; V = omega / (1 - omega)
        low27 = 0.5 * dlo * np.exp(-(0.5 + float(th_) * 27 / 4) * logn) * absf
        fh, lh = float(F(raw[i]['first_hi'])), float(F(raw[i]['last_hi']))
        rec = {'row': i, 'M': M, 'A': A, 'beta': float(beta), 'C_comp': cc_, 'd_old': d_old, 'd_new': d_new, 'omega': omega}
        # gauge consistency with packet
        pg = rs['prime_gauge']; assert all(int(pg[str(p)]) == int(sp[pidx[p]]) for p in angp['prime_list']), 'gauge mismatch'
        # R1 torus minimum (L=27 lower capacities) and polydisc statement
        starts = [np.zeros(NP)] + ([rng.uniform(-np.pi, np.pi, NP), rng.normal(0, 0.3, NP)] if rich else [])
        m1, _ = torus_min(low27, fs, starts)
        rec['R1_torus_min_minus_Ccomp'] = m1 - cc_; flag(i, 'R1', m1 - cc_)
        poly = np.inf
        for LL in (27.0, 29.0, 40.0):
            for tt, dco, chord in ((tl, dlo, fh), (th_, dhi, lh)):
                a = 0.5 * dco * np.exp(-(0.5 + float(tt) * LL / 4) * logn) * absf
                mm, _ = torus_min(a, fs, [np.zeros(NP)] + ([rng.normal(0, 0.3, NP)] if rich else []))
                poly = min(poly, chord - float(a.sum()) + mm - cc_)      # chord - max Re P - C_comp
        rec['R1b_polydisc_min(chord-maxReP-Ccomp)'] = poly; flag(i, 'R1b', poly)
        # R2 relation-constrained minimum
        rels = [angp['relation_catalogue'][rid] for rid in r['relations']] + ([eighth['new_relation']] if i == 8 else [])
        m = len(rels); Kc = np.zeros((m, NP)); aj = []; hj = []
        for j, rel in enumerate(rels):
            for p, e in zip(angp['prime_list'], rel['exponents']): Kc[j, pidx[p]] = e
            aj.append(2 * N0 ** 2 * mp.log(mp.mpf(int(rel['numerator'])) / int(rel['denominator']))); hj.append(int(rel['target']))
        ql, qh = float(tl) / (16 * N0 ** 2), float(th_) / (16 * N0 ** 2)
        s2 = np.inf; dmax = 0.0
        allbr = list(itertools.product((1, -1), repeat=m))
        nb = len(allbr) if (i in (0, 8, 66) and rich) else (12 if rich else 3)
        brs = [allbr[0], allbr[-1]] + random.sample(allbr, max(0, nb - 2)) if nb < len(allbr) else allbr
        for (v, q) in ((0.0, ql), (V, qh), (0.0, qh), (V, ql), (V / 2, (ql + qh) / 2)):
            delta = np.array([float(a * (1 + mp.mpf(v) + mp.mpf(q)) - h) for a, h in zip(aj, hj)]); dmax = max(dmax, np.max(np.abs(delta)))
            use = brs if (v, q) in ((0.0, ql), (V, qh)) else brs[:3]
            for sg in use:
                sg = np.array(sg, dtype=float); rhs = np.pi * (delta + sg)          # k.th = pi(1+delta) or pi(delta-1)
                v2, thv = torus_min(low27, fs, [np.zeros(NP)], Kc, rhs, maxiter=400)
                assert np.max(np.abs(Kc @ thv - rhs)) < 1e-8
                s2 = min(s2, v2 + A / 4 * math.log1p(v) - cc_ - d_new)
        rec['max_abs_delta_on_rectangle_pts'] = dmax; rec['R2_constrained_min_margin'] = s2; rec['R2_branches'] = len(brs); flag(i, 'R2', s2)
        # R3 actual orbit, end to end, and (75) on the orbit
        worst = np.inf; worst_near = np.inf; idmax = 0.0; worst_def = np.inf
        for tt, dco in ((tl, dlo), (tm, dcoef(tm)), (th_, dhi)):
            theta = float((tt - tl) / (th_ - tl)); chord = (1 - theta) * fh + theta * lh
            for sl, C in orbit_cos(float(tt)):
                cc = Lx[sl] / 4
                absc = 0.5 * dco[None, :] * np.exp(-(0.5 + float(tt) * cc[:, None]) * logn[None, :]) * absf[None, :]
                reP = np.sum(absc * s[None, :] * C, axis=1)
                marg = A * dL[sl] / 4 + chord - reP - cc_ - d_new
                worst = min(worst, marg.min())
                near = dL[sl] <= omega
                if near.any():
                    worst_near = min(worst_near, marg[near].min())
                    dfc = np.sum(low27[None, :] * (1 - s[None, :] * C[near]), axis=1) + A * dL[sl][near] / 4
                    worst_def = min(worst_def, dfc.min() - cc_ - d_new)
            # identity (75): k.theta/pi - (1+delta) is an even integer on the actual orbit (near samples)
            idx = np.where(dL <= omega)[0][:60]
            for a in idx:
                thg = PH[a] + (math.pi * float(tt) / 8) * logp - np.pi * (sp < 0)
                vv = math.expm1(dL[a]); qq = float(tt) / (16 * N0 ** 2)
                for j in range(m):
                    val = float(Kc[j] @ thg) / math.pi - (1 + float(aj[j]) * (1 + vv + qq) - hj[j])
                    idmax = max(idmax, abs(val / 2 - round(val / 2)) * 2)
        rec.update({'R3_min_margin_all_x': worst, 'R3_min_margin_near': worst_near, 'R3b_near_lowcap_deficit_margin': worst_def, 'eq75_max_dist_to_even_integer': idmax})
        flag(i, 'R3', worst); flag(i, 'R3b', worst_def); flag(i, 'eq75', 1e-3 - idmax)
        res['retained'].append(rec)
        print('R row', i, {k: (round(v, 9) if isinstance(v, float) else v) for k, v in rec.items()}, round(time.time() - T0), 's', flush=True)
print('VIOLATIONS', len(res['fail']), res['fail'])
if OUTJ: Path(OUTJ).write_text(json.dumps(res, indent=1, default=float))
print('done', round(time.time() - T0), 's')
