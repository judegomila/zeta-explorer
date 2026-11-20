"""Combination (4b): Poisson-measure criterion. q(t) = 2 Re c(1/2 + i t), c = F'/F at s = 1 + i t.
If c is positive-real on Re w > 0 then q(t) = const + int dmu(u)/((t - u)^2 + 1/4) with const >= 0, mu >= 0
(for an even F with zeros beta + i gamma: q = sum 2 b/((t-gamma)^2 + b^2)-type terms, b = 1/2 - (beta - 1/2); all on-line <=> width 1/2).
Stage q:    run4_nnls.py q <code> <T0> <T1> <dt>            -> q_<code>_<T0>_<T1>.npy (float64; Arb at 128 bits per point)
Stage nnls: run4_nnls.py nnls <out.jsonl> <code> <T0> <T1> <dt> <W> <hu> [delta:gamma ...]
            windows [t0, t0 + W]; columns: Lorentzians at u in [t0 - pad, t0 + W + pad] step hu, far-field Lorentzians
            (geometric spacing out to 1e7 on both sides), one constant. Non-negative least squares (scipy, float64: a SCREEN).
            planted specs add the exact contribution of an off-line quadruple to q (calibration of the detection floor)."""
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool

def tag(code): return code.replace('/', '_').replace(':', '_')

def _q(args):
    code, ts = args
    from flint import arb, acb, ctx
    import lib, lib2
    ctx.prec = 160 if code.startswith('HEAT') else 128
    o = lib.get(code) if code.startswith('HEAT') else lib2.get(code)
    out = []
    for t in ts:
        w = acb(arb(1) / 2, arb(t))
        v = lib.logder(o, w) if code.startswith('HEAT') else lib2.logder(o, w)
        out.append(2 * float(v.real.mid()))
    return out

def stage_q(code, T0, T1, dt):
    fn = 'q_%s_%g_%g_%g.npy' % (tag(code), T0, T1, dt)
    if os.path.exists(fn): return np.load(fn)
    n = int(round((T1 - T0) / dt)) + 1
    ts = [T0 + dt * i for i in range(n)]
    ch = [ts[i:i + 200] for i in range(0, n, 200)]
    t = time.time()
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
        res = pool.map(_q, [(code, c) for c in ch])
    q = np.array([x for r in res for x in r])
    np.save(fn, q); print('q', code, T0, T1, dt, n, 'sec %.1f' % (time.time() - t), flush=True)
    return q

def planted_q(t, delta, gamma):
    """exact contribution to q of the quadruple +-delta +- i gamma (w-plane): sum over the four zeros of 2 Re 1/(1/2 + i t - rho)"""
    tot = np.zeros_like(t)
    for b in (delta, -delta):
        for g in (gamma, -gamma):
            tot += 2 * (0.5 - b) / ((0.5 - b) ** 2 + (t - g) ** 2)
    return tot

def _win(args):
    from scipy.optimize import nnls
    t, b, hu, pad, label, t0 = args
    W = t[-1] - t[0]
    u = np.arange(t[0] - pad, t[-1] + pad + hu / 2, hu)
    far = 0.25 * 1.3 ** np.arange(0, 68)                    # up to about 1.4e7
    uf = np.concatenate([t[0] - pad - far, t[-1] + pad + far])
    U = np.concatenate([u, uf])
    A = 1.0 / ((t[:, None] - U[None, :]) ** 2 + 0.25)
    A = np.concatenate([A, np.ones((len(t), 1))], axis=1)
    sc = np.linalg.norm(A, axis=0); A = A / sc
    t1 = time.time()
    try:
        x, rn = nnls(A, b, maxiter=40 * A.shape[1])
        st = 'ok'
    except Exception as e:
        return dict(code=label, t0=float(t0), W=float(W), status='fail:' + str(e)[:60])
    r = A @ x - b
    inner = (t >= t[0] + 2) & (t <= t[-1] - 2)
    k = int(np.argmax(np.abs(r)))
    mass = x / sc
    return dict(code=label, t0=float(t0), W=float(W), rows=len(t), cols=A.shape[1], status=st,
                rel_resid=float(np.linalg.norm(r) / np.linalg.norm(b)), max_abs_resid=float(np.abs(r).max()),
                t_at_max=float(t[k]), inner_max_abs_resid=float(np.abs(r[inner]).max()), q_max=float(b.max()), q_min=float(b.min()),
                active=int((x > 0).sum()), mass_inside=float(mass[:len(u)].sum()), const=float(mass[-1]), sec=round(time.time() - t1, 2))

def stage_nnls(out, code, T0, T1, dt, W, hu, specs):
    q = stage_q(code, T0, T1, dt)
    n = len(q); t = T0 + dt * np.arange(n)
    m = int(round(W / dt)) + 1
    print('planned window matrix: %d x %d float64 = %.1f MB' % (m, int((W + 12) / hu) + 140, m * (int((W + 12) / hu) + 140) * 8 / 1e6), flush=True)
    for spec in [None] + specs:
        b = q.copy(); label = code
        if spec is not None:
            d, g = spec.split(':'); b = b + planted_q(t, float(d), float(g)); label = 'PL:%s:%s' % (code, spec)
        jobs = []
        i = 0
        while i + m <= n:
            if spec is None or abs(t[i] + W / 2 - float(spec.split(':')[1])) <= 3 * W:
                jobs.append((t[i:i + m], b[i:i + m], hu, 6.0, label, t[i]))
            i += m - 1
        with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
            for rec in pool.imap(_win, jobs):
                open(out, 'a').write(json.dumps(rec) + '\n')
                print(json.dumps(rec), flush=True)

if __name__ == '__main__':
    if sys.argv[1] == 'q':
        stage_q(sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]))
    else:
        a = sys.argv[2:]
        stage_nnls(a[0], a[1], float(a[2]), float(a[3]), float(a[4]), float(a[5]), float(a[6]), a[7:])
