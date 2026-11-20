"""Combination 1 (lane s7): lambda_min of the Weil form on L^2(-a,a) with free prime phases.
H(theta) = B0 - sum_n w_n ( e^{i phi_n} C_n + e^{-i phi_n} C_n^T ),  phi_n = sum_p v_p(n) theta_p,  w_n = c_F(n) (real),
C_n = n^{-1/2} (shift by log n compressed to the Legendre basis), B0 = archimedean part + 2 log Q (+ pole terms, or the
pole vectors projected out: variant 'pf').  theta = 0 is the object itself.  Assembly: wlib.py (lane s2), python-flint.
usage: s7torus.py N prec workers outdir starts  2a_1 2a_2 ...
"""
import sys, os, json, time, math, pickle
import multiprocessing as mp
import numpy as np
from wlib import *
from flint import arf
from scipy.optimize import minimize

N = int(sys.argv[1]); PREC = int(sys.argv[2]); WORKERS = int(sys.argv[3]); OUT = sys.argv[4]; STARTS = int(sys.argv[5])
SUP = sys.argv[6:]
ZK = ['0.25', '0.75', '0.35', '0.15']
NMAX = 31
PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
ALPHA = 1.2393168126993495
TMAX = float(os.environ.get('TMAX', '0'))
setprec(PREC)
os.makedirs(OUT, exist_ok=True)

def ser(M): return [[tuple(int(t) for t in M[i, j].mid().man_exp()) for j in range(M.ncols())] for i in range(M.nrows())]
def des(L): return arb_mat([[arb(arf(t)) for t in row] for row in L])

def stage1(wi):
    setprec(PREC)
    nodes = [(p, k) for p in range(2) for k in range(N + 56)][wi::WORKERS]
    G = gl(N + 56); panels = 2
    Alog = arb_mat(N, N); T = {(s, z): arb_mat(N, N) for s in SUP for z in ZK}
    I2 = eye(N) * 2
    av = {s: arb(s) / 2 for s in SUP}
    for c, (p, k) in enumerate(nodes):
        x, w = G[k]; lo = arb(2 * p) / panels; hw = arb(1) / panels
        v = lo + hw * (1 + x); wv = w * hw
        S = smat(v, N)
        Alog = Alog + (I2 - S) * (wv / (2 * v))
        for s in SUP:
            a = av[s]
            for z in ZK:
                T[(s, z)] = T[(s, z)] + S * (r_z(arb(z), a * v) * a * wv)
    return ser(Alog), {k: ser(v) for k, v in T.items()}

def vp(n):
    out = [0] * len(PR); m = n
    for i, p in enumerate(PR):
        while m % p == 0: m //= p; out[i] += 1
    return out

def objects():
    cz = coef_zeta(NMAX)
    O = {}
    O['zeta'] = (['0.25'], ['0.5'], arb(0), cz)
    O['chim4'] = (['0.75'], [], arb(4).log(), coef_chi(NMAX, [0, 1, 0, -1]))
    O['chi5'] = (['0.25'], [], arb(5).log(), coef_chi(NMAX, CHI5))
    O['chim7'] = (['0.75'], [], arb(7).log(), coef_chi(NMAX, [0, 1, 1, -1, 1, -1, -1]))
    O['dh'] = (['0.75'], [], arb(5).log(), coef_dh(NMAX))
    O['ea0.2'] = (['0.35', '0.15'], ['0.7', '0.3'], arb(0), coef_ea(NMAX, arb('0.2')))
    return O

def stage2(s):
    """float64 and ball data for one support"""
    setprec(PREC)
    a = arb(s) / 2
    base = eye(N) * (arb.const_euler() + (4 * a).log() + arb.pi().log())
    arch = {z: PAY['Alog'] - base - PAY['T'][(s, z)] for z in ZK}
    C = {}
    for n in range(2, NMAX + 1):
        if arb(n).log() < 2 * a: C[n] = rung(N, a, n)
    polev = {p: (pole_vec(N, a, arb(p), 1), pole_vec(N, a, arb(p), -1)) for p in ('0.5', '0.7', '0.3')}
    return s, {z: ser(arch[z]) for z in ZK}, {n: ser(M) for n, M in C.items()}, {p: [[x.mid().man_exp() for x in v] for v in pv] for p, pv in polev.items()}

# ---------------- search ----------------
def build(case):
    """case = (s, obj, variant, Nsub) -> float arrays B0 (d x d), Cs (K x d x d), w (K), V (K x 11)"""
    s, nm, variant, Ns = case
    zs, poles, shift, coef = OBJ[nm]
    arch, C, polev = DATA[s]
    B = sum(arch[z] for z in zs)[:Ns, :Ns] + float(shift.mid()) * np.eye(Ns)
    cols = []
    for p in poles:
        for v in polev[p]: cols.append(v[:Ns])
    Z = None
    if variant == 'full':
        for v in cols: B = B + np.outer(v, v)
    elif cols:
        Q, _ = np.linalg.qr(np.array(cols).T, mode='complete'); Z = Q[:, len(cols):]
        B = Z.T @ B @ Z
    ns = [n for n in sorted(C) if float(coef[n].mid()) != 0.0]
    Cs = np.array([C[n][:Ns, :Ns] if Z is None else Z.T @ C[n][:Ns, :Ns] @ Z for n in ns]) if ns else np.zeros((0, B.shape[0], B.shape[0]))
    w = np.array([float(coef[n].mid()) for n in ns]); V = np.array([vp(n) for n in ns], dtype=float).reshape(len(ns), len(PR))
    return (B + B.T) / 2, Cs, w, V, ns

def Hmat(B, Cs, w, V, th):
    ph = np.exp(1j * (V @ th)) * w
    M = np.tensordot(ph, Cs, axes=1)
    return B - M - M.conj().T

def lam_grad(B, Cs, w, V, th, sign=1.0):
    H = Hmat(B, Cs, w, V, th)
    ev, U = np.linalg.eigh(H)
    k = 0 if sign > 0 else 0
    u = U[:, 0]
    g = np.einsum('i,kij,j->k', u.conj(), Cs, u)
    dphi = 2 * w * np.imag(np.exp(1j * (V @ th)) * g)
    return ev[0], V.T @ dphi

def run_case(case):
    t0 = time.time()
    s, nm, variant, Ns = case
    B, Cs, w, V, ns = build(case)
    act = [i for i in range(len(PR)) if V.shape[0] and np.any(V[:, i] != 0)]
    k = len(act)
    out = dict(twoa=float(s), obj=nm, variant=variant, N=Ns, dim=k, primes=[PR[i] for i in act], n_terms=ns)
    def f(x, sign=1.0):
        th = np.zeros(len(PR)); th[act] = x
        l, g = lam_grad(B, Cs, w, V, th)
        return sign * l, sign * g[act]
    def val(th_full):
        return float(np.linalg.eigvalsh(Hmat(B, Cs, w, V, np.array(th_full)))[0])
    out['orbit'] = val(np.zeros(len(PR)))
    named = {}
    if nm == 'zeta':
        named['liou'] = [math.pi] * len(PR)
        named['uni'] = [-ALPHA * math.log(p) for p in PR]
        named['flip2'] = [math.pi] + [0.0] * (len(PR) - 1)
        out['named'] = {kk: val(v) for kk, v in named.items()}
    # the orbit theta_p = tau log p (unimodular twist n^{-i tau}): scan
    if k and TMAX > 0:
        taus = np.arange(0.0, TMAX, 0.02); lp = np.log(np.array(PR, dtype=float)); tv = np.empty(len(taus))
        for i, tau in enumerate(taus):
            th = np.zeros(len(PR)); th[act] = (tau * lp)[act]; tv[i] = np.linalg.eigvalsh(Hmat(B, Cs, w, V, th))[0]
        i0 = int(np.argmin(tv)); i5 = int(np.argmin(tv[:251]))
        out['orbit_scan'] = dict(tmax=TMAX, min=float(tv[i0]), tau=float(taus[i0]), min_tau_le_5=float(tv[i5]), tau_le_5=float(taus[i5]),
                                 max_tau_ge_1=float(tv[50:].max()), frac_pos=float(np.mean(tv > 0)), q=[float(x) for x in np.quantile(tv, [0.01, 0.5, 0.99])])
    if k == 0:
        out.update(inf=out['orbit'], sup=out['orbit'], argmin=[], argmax=[], frac_pos=1.0 if out['orbit'] > 0 else 0.0, secs=time.time() - t0)
        return out
    rng = np.random.Generator(np.random.PCG64(hash((s, nm, variant)) % 2 ** 32))
    # random sample: distribution of lambda_min over the torus
    R = 2000
    vals = np.empty(R)
    X = rng.uniform(-math.pi, math.pi, (R, k))
    for i in range(R):
        th = np.zeros(len(PR)); th[act] = X[i]; vals[i] = np.linalg.eigvalsh(Hmat(B, Cs, w, V, th))[0]
    out['frac_pos'] = float(np.mean(vals > 0)); out['sample_mean'] = float(vals.mean()); out['sample_min'] = float(vals.min()); out['sample_max'] = float(vals.max())
    out['sample_q'] = [float(q) for q in np.quantile(vals, [0.01, 0.1, 0.5, 0.9, 0.99])]
    order = np.argsort(vals)
    starts_min = [X[i] for i in order[:STARTS // 2]] + [rng.uniform(-math.pi, math.pi, k) for _ in range(STARTS - STARTS // 2)]
    for v in named.values(): starts_min.append(np.array(v)[act] + 0.05 * rng.standard_normal(k))
    best = (np.inf, None); allmin = []
    for x0 in starts_min:
        r = minimize(f, x0, jac=True, method='L-BFGS-B', options=dict(maxiter=300, gtol=1e-9))
        allmin.append(float(r.fun))
        if r.fun < best[0]: best = (float(r.fun), r.x.copy())
    starts_max = [X[i] for i in order[::-1][:max(4, STARTS // 4)]] + [np.zeros(k) + 0.02 * rng.standard_normal(k) for _ in range(3)]
    bestM = (-np.inf, None)
    for x0 in starts_max:
        r = minimize(f, x0, args=(-1.0,), jac=True, method='L-BFGS-B', options=dict(maxiter=300, gtol=1e-9))
        if -r.fun > bestM[0]: bestM = (float(-r.fun), r.x.copy())
    wrap = lambda x: [float((t + math.pi) % (2 * math.pi) - math.pi) for t in x]
    am = np.array(wrap(best[1]))
    if am[np.argmax(np.abs(am))] < 0: am = -am          # theta -> -theta symmetry
    out.update(inf=best[0], argmin=[float(t) for t in am], sup=bestM[0], argmax=wrap(bestM[1]),
               n_starts=len(starts_min), frac_starts_at_inf=float(np.mean(np.array(allmin) < best[0] + 1e-6 * max(1, abs(best[0])))),
               local_min_q=[float(q) for q in np.quantile(allmin, [0, 0.25, 0.5, 0.75, 1])])
    # second derivative of lambda_min at theta = 0 along each coordinate (is the object's point a local max or min?)
    e = 1e-3; hess = []
    for j in range(k):
        x = np.zeros(k); x[j] = e
        hess.append(float((f(x)[0] - 2 * f(np.zeros(k))[0] + f(-x)[0]) / e ** 2))
    out['d2_at_orbit'] = hess
    # sub-block convergence check of the infimum at the minimiser
    if Ns > 24:
        Bs, Css, ws, Vs, _ = build((s, nm, variant, Ns - 16))
        th = np.zeros(len(PR)); th[act] = am
        out['inf_at_N_minus_16'] = float(np.linalg.eigvalsh(Hmat(Bs, Css, ws, Vs, th))[0])
    out['secs'] = time.time() - t0
    return out

def ball_check(rec):
    """eigenvalue at theta in ball arithmetic: real symmetric 2d x 2d embedding of the Hermitian matrix"""
    setprec(PREC)
    s, nm, variant = rec['s'], rec['obj'], rec['variant']
    zs, poles, shift, coef = OBJ[nm]
    arch, C, polev = BALL[s]
    B = sum((arch[z] for z in zs[1:]), arch[zs[0]]) + eye(N) * shift
    cols = []
    for p in poles:
        for v in polev[p]: cols.append(v)
    Z = None
    if variant == 'full':
        for v in cols:
            cm = arb_mat([[x] for x in v]); B = B + cm * cm.transpose()
    elif cols: Z = complement(cols, N)
    pr = (lambda M: M) if Z is None else (lambda M: Z.transpose() * M * Z)
    th = rec['theta']
    A = pr(B); d = A.nrows(); Bim = arb_mat(d, d)
    for n in C:
        cn = coef[n]
        if float(cn.mid()) == 0.0: continue
        phi = sum(arb(th[i]) * e for i, e in enumerate(vp(n)))
        Cn = pr(C[n])
        A = A - (Cn + Cn.transpose()) * (cn * phi.cos())
        Bim = Bim - (Cn - Cn.transpose()) * (cn * phi.sin())
    big = arb_mat(2 * d, 2 * d)
    for i in range(d):
        for j in range(d):
            big[i, j] = A[i, j]; big[d + i, d + j] = A[i, j]; big[i, d + j] = -Bim[i, j]; big[d + i, j] = Bim[i, j]
    Bf = tofloat(big); wv, Vv = np.linalg.eigh((Bf + Bf.T) / 2)
    if abs(wv[0]) < 1e-7:
        r = eigmin_subspace(big, wv, Vv)
    else:
        r = eigmin(big, check=False)
    return dict(s=s, obj=nm, variant=variant, tag=rec['tag'], lam=r['lam'], lam_str=r['lam_str'], float_lam=float(wv[0]))

if __name__ == '__main__':
    mp.set_start_method('fork')
    t0 = time.time()
    print('planned: %d supports x %d gamma arguments, N = %d, %d-bit; arb matrices %d x %d each (about %d MB total)' % (
        len(SUP), len(ZK), N, PREC, N, N, len(SUP) * (len(ZK) + 31) * N * N * (PREC // 8 + 48) // 2 ** 20), flush=True)
    with mp.Pool(WORKERS) as pool:
        parts = pool.map(stage1, range(WORKERS))
    Alog = arb_mat(N, N); T = {(s, z): arb_mat(N, N) for s in SUP for z in ZK}
    for A_, T_ in parts:
        Alog = Alog + des(A_)
        for k in T_: T[k] = T[k] + des(T_[k])
    PAY = {'Alog': Alog, 'T': T}
    print('stage1 done %.0fs' % (time.time() - t0), flush=True)
    with mp.Pool(min(WORKERS, len(SUP))) as pool:
        st2 = pool.map(stage2, SUP)
    BALL = {}; DATA = {}
    for s, arch, C, polev in st2:
        ab = {z: des(M) for z, M in arch.items()}; cb = {n: des(M) for n, M in C.items()}
        pb = {p: [[arb(arf(t)) for t in v] for v in pv] for p, pv in polev.items()}
        BALL[s] = (ab, cb, pb)
        DATA[s] = ({z: tofloat(M) for z, M in ab.items()}, {n: tofloat(M) for n, M in cb.items()},
                   {p: [np.array([float(x.mid()) for x in v]) for v in pv] for p, pv in pb.items()})
    OBJ = objects()
    print('stage2 done %.0fs' % (time.time() - t0), flush=True)
    cases = []
    for s in SUP:
        for nm in OBJ:
            for variant in (['pf', 'full'] if OBJ[nm][1] else ['full']):
                cases.append((s, nm, variant, N))
    res = []
    with mp.Pool(WORKERS) as pool:
        for r in pool.imap_unordered(run_case, cases):
            res.append(r); print(json.dumps(r), flush=True)
            json.dump(res, open(os.path.join(OUT, 'torus.json'), 'w'))
    # ball re-evaluation at the object's point and at the minimiser
    recs = []
    for r in res:
        s = next(x for x in SUP if abs(float(x) - r['twoa']) < 1e-12)
        full = lambda x: [dict(zip(r['primes'], x)).get(p, 0.0) for p in PR]
        recs.append(dict(s=s, obj=r['obj'], variant=r['variant'], tag='orbit', theta=[0.0] * len(PR)))
        if r['dim']: recs.append(dict(s=s, obj=r['obj'], variant=r['variant'], tag='argmin', theta=full(r['argmin'])))
    with mp.Pool(WORKERS) as pool:
        bc = pool.map(ball_check, recs)
    json.dump(bc, open(os.path.join(OUT, 'torus_ball.json'), 'w'))
    for b in bc: print('ball', json.dumps(b), flush=True)
    print('done %.0fs' % (time.time() - t0), flush=True)
