"""Combination 1, zero side.  nodes nu = c + 1/2 - rho over the zeros rho = beta +- i gamma of the object with |gamma| <= H (or the first N ordinates).
Lambda(nu, d) = ||exp(dA)||^2 (pen.py).  mode f: float64 scaling-and-squaring (numpy or cupy; screen, valid where Lambda >> 1e-10);
mode a: Arb at the given precision (exp once at d = step, then powers).  TILT-DET majorant for K <= 1000.
usage: t1_zero.py out.jsonl mode c step nsteps spec [spec ...];   spec = OBJ:on|all:N  (N = number of ordinates used, 0 = all)"""
import sys, json, math, time, os, numpy as np
import pen
outp, mode, c, step, nsteps = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), int(sys.argv[5])
specs = sys.argv[6:]
ND = json.load(open('nodes.json'))
Q, CQ = 1000003, 2.2
def nodes(obj, which, N):
    """list of (beta, gamma>0) used"""
    if obj.startswith('EA-'):
        a = eval(obj[3:]); z = ND['ZETA']['online']
        on = []; off = [(0.5 + s * a, g) for g in z for s in (1, -1)]
    elif obj.startswith('TNRq'):
        z = ND['ZETA']['online']; on = [(0.5, g) for g in z]
        dl = math.acosh(CQ / 2) / math.log(Q); H = z[N - 1] if N else z[-1]
        off = [(0.5 + s * dl, math.pi * (2 * k + 1) / math.log(Q)) for k in range(int(H * math.log(Q) / (2 * math.pi)) + 1) for s in (1, -1)]
        off = [(b, g) for b, g in off if g <= H]
        on = on[:N] if N else on
        return on + (off if which == 'all' else [])
    else:
        o = ND[obj]; on = [(0.5, g) for g in o['online']]
        off = [(b_, g) for b, g in o['offline'] for b_ in (b, 1 - b)]
    if which == 'on': zs = sorted(on, key=lambda t: t[1])
    else: zs = sorted(on + off, key=lambda t: t[1])
    return zs[:N] if N else zs
def run(spec):
    obj, which, N = spec.split(':'); N = int(N)
    zs = nodes(obj, which, N)
    bet = np.array([b for b, g in zs]); gam = np.array([g for b, g in zs])
    re = np.concatenate([c + 0.5 - bet, c + 0.5 - bet]); im = np.concatenate([-gam, gam])
    order = np.argsort(np.abs(im), kind='stable'); re = re[order]; im = im[order]
    K = len(re); rec = dict(spec=spec, c=c, K=K, mode=mode, step=step, gamma_max=float(gam.max()), n_off=int((bet != 0.5).sum()), min_re=float(re.min()))
    t0 = time.time(); logs = []
    if re.min() <= 0:
        rec['skipped'] = 'a zero with beta >= c + 1/2: its exponential is not in L2 with this weight'; open(outp, 'a').write(json.dumps(rec) + '\n'); print(spec, 'skipped', flush=True); return
    if mode == 'f':
        try:
            import cupy as xp; xp.get_default_memory_pool().set_limit(size=24 * 1024 ** 3); gpu = True
        except Exception:
            xp = np; gpu = False
        print(spec, 'K =', K, 'planned memory: %.2f GB (5 complex128 matrices)' % (5 * K * K * 16 / 1e9), 'gpu' if gpu else 'cpu', flush=True)
        A = xp.asarray(pen.gen_A(re + 1j * im))
        E1, s = pen.expm_ss(A, step, xp); T = E1.copy(); rec['squarings'] = s
        rs = xp.random.RandomState(1) if gpu else np.random.RandomState(1)
        for k in range(1, nsteps + 1):
            v = xp.asarray(rs.standard_normal(K) + 0j)
            prev = 0.0
            for it in range(400):
                w = T.conj().T @ (T @ v); nv = xp.linalg.norm(w); v = w / nv
                if it % 8 == 7:
                    cur = float(nv)
                    if abs(cur - prev) <= 1e-9 * cur: break
                    prev = cur
            logs.append(float(xp.log(nv)))
            if k < nsteps: T = T @ E1
            if k % 20 == 0: print('  step', k, 'logLam %.4f' % logs[-1], '%.0f s' % (time.time() - t0), flush=True)
    else:
        prec = int(mode[1:]) if len(mode) > 1 else 256
        from flint import ctx
        print(spec, 'K =', K, 'planned memory: %.2f GB (acb_mat at %d bits, 4 matrices)' % (4 * K * K * 2 * (prec / 8 + 48) / 1e9, prec), flush=True)
        E1 = pen.arb_expm([repr(float(x)) for x in re], [repr(float(x)) for x in im], step, prec, shift=float(re.min()))
        ctx.prec = prec; T = E1; rr = []
        for k in range(1, nsteps + 1):
            X, e, mr = pen.mat_to_np(T); sv = np.linalg.norm(X, 2)
            logs.append(2 * math.log(sv) + 2 * e * math.log(2.0) - 2 * float(re.min()) * step * k); rr.append(mr / sv)
            print('  d = %g logLam = %.6f relrad = %.1e (%.0f s)' % (step * k, logs[-1], rr[-1], time.time() - t0), flush=True)
            if k < nsteps: T = T * E1
        rec['relrad_max'] = max(rr)
    rec['d'] = [step * k for k in range(1, nsteps + 1)]; rec['logLam'] = logs
    if K <= 1000:
        rec['logTilt'] = [pen.tilt_det_log(re + 1j * im, d)[0] for d in rec['d']]
        # depth at which the tilt bound first drops below 1 (bisection on d)
        f = lambda d: pen.tilt_det_log(re + 1j * im, d)[0]
        lo, hi = 0.0, 1.0
        while f(hi) >= 0 and hi < 1e7: hi *= 2
        for _ in range(40):
            m = (lo + hi) / 2
            if f(m) < 0: hi = m
            else: lo = m
        rec['tilt_first_d_below_1'] = hi
    rec['seconds'] = time.time() - t0
    open(outp, 'a').write(json.dumps(rec) + '\n'); print(spec, 'done %.0f s' % rec['seconds'], 'logLam at d=', rec['d'][::max(1, nsteps // 8)], [round(x, 3) for x in logs[::max(1, nsteps // 8)]], flush=True)
W = int(os.environ.get('RH_WORKERS', '1'))
if mode == 'f' or W == 1 or len(specs) == 1:
    for s in specs: run(s)
else:
    import multiprocessing as mp
    with mp.Pool(min(W, len(specs))) as p: p.map(run, specs, chunksize=1)
