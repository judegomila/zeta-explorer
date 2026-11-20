"""Float64 screening stage (GPU if available).  python run_screen.py <stage> <outfile.jsonl> [scale]
Stages: s1, matched, fixed, euler, translate.  Appends one JSON line per task (checkpoint); skips done keys."""
import sys, json, math, time, os
import numpy as np
import bl
xp = bl.xp

stage, outp = sys.argv[1], sys.argv[2]
scale = sys.argv[3] if len(sys.argv) > 3 else 'small'
BIG = scale == 'big'
done = set()
if os.path.exists(outp):
    for ln in open(outp):
        try:
            done.add(json.loads(ln)['key'])
        except Exception:
            pass
fo = open(outp, 'a')


def emit(key, d):
    d = dict(d); d['key'] = key; d['gpu'] = bl.GPU
    fo.write(json.dumps(d) + '\n'); fo.flush()
    print(key, {k: v for k, v in d.items() if k not in ('key', 'witness_th', 'rows') or key.startswith('hb')}, flush=True)


def tasks_s1():
    Nmax = 48 if BIG else 8
    for inp in ('zeta', 'dh', 'tw2m', 'tw2h', 'liou', 'ea:0.25'):
        for wk in ('sharp', 'riesz1'):
            if wk == 'riesz1' and inp not in ('zeta', 'dh'):
                continue
            for N in range(2, Nmax + 1):
                yield ('afe', inp, N, wk)
    for K in (0, 1, 2):
        for P in ([2, 3, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47] if BIG else [3, 7, 11]):
            if K == 2 and P > 23:
                continue
            yield ('euler', 'dh', P, K)
    for inp in ('zeta', 'tw2m', 'tw2h', 'liou', 'ea:0.25'):
        for K in (1, 2):
            for P in ([2, 3, 5, 7, 11, 13, 17, 19, 23] if BIG else [3, 5]):
                if K == 2 and P > 13:
                    continue
                yield ('euler', inp, P, K)


if stage == 's1':
    for (sch, inp, size, opt) in tasks_s1():
        key = f's1|{sch}|{inp}|{size}|{opt}'
        if key in done:
            continue
        poly = bl.afe_poly(inp, size, wkind=opt) if sch == 'afe' else bl.euler_poly(inp, size, opt)
        J, m = len(poly[0]), poly[2].shape[1]
        B = int(min(50000 if BIG else 4000, 1.5e7 // max(J, 1)))
        print(f'  planned: B={B} J={J} m={m}; largest array B*J complex128 = {B * J * 16 / 1e9:.2f} GB (x ~6 temporaries)', flush=True)
        t0 = time.time()
        r = bl.s1_search(poly, B=B, iters=500 if BIG else 300)
        r['primes'] = poly[3]; r['wall'] = round(time.time() - t0, 1)
        emit(key, r)

elif stage == 'matched':
    # fixed-N AFE object on its matched window [t_N, t_{N+1}], t_N = 2 pi N^2 / q
    Nmax = 600 if BIG else 12
    for inp in ('zeta', 'dh', 'tw2m', 'liou', 'tw2h'):
        q = 5.0 if inp == 'dh' else 1.0
        nm = {'zeta': Nmax, 'dh': 400}.get(inp, 150) if BIG else Nmax
        for N in range(1, nm + 1):
            key = f'matched|{inp}|{N}'
            if key in done:
                continue
            ta = max(2 * math.pi * N * N / q, 3.0) + 0.0137; tb = 2 * math.pi * (N + 1) ** 2 / q + 0.0137
            if tb - ta < 1:
                continue
            o = bl.Obj(inp, 'afe', N)
            t0 = time.time()
            r = bl.count_window(o, ta, tb, W=1.0, dt=0.01)
            r.update(ta=ta, tb=tb, wall=round(time.time() - t0, 2))
            emit(key, r)

elif stage == 'fixed':
    T, win = (20000.0, 250.0) if BIG else (500.0, 250.0)
    for inp in ('zeta', 'dh', 'tw2m', 'liou'):
        for N in (1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 50):
            key = f'fixed|{inp}|{N}'
            if key in done:
                continue
            o = bl.Obj(inp, 'afe', N)
            rows = []
            for ta in np.arange(3.0137, T, win):
                r = bl.count_window(o, ta, ta + win, W=1.0, dt=0.01)
                rows.append([round(float(ta), 4), r['tot'], r['on'], r['off'], r['resolved']])
            offw = [x for x in rows if x[3] != 0]
            emit(key, dict(T=T, tot=sum(x[1] for x in rows), on=sum(x[2] for x in rows), off=sum(x[3] for x in rows),
                           first_off_window=(offw[0][0] if offw else None), last_off_window=(offw[-1][0] if offw else None),
                           n_off_windows=len(offw), unresolved=sum(1 for x in rows if not x[4]), rows=rows))

elif stage == 'euler':
    T, win = (30000.0, 1000.0) if BIG else (1000.0, 250.0)
    Ps = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] if BIG else [2, 5, 11]
    for K in (1, 0):
        W = 0.45 if K == 0 else 0.5
        for inp in ('zeta', 'tw2m', 'tw2h', 'liou', 'dh', 'ea:0.25', 'nr:3:2.2'):
            for P in Ps:
                if inp.startswith('nr') and P < 3:
                    continue
                key = f'euler|{inp}|{P}|K{K}'
                if key in done:
                    continue
                o = bl.Obj(inp, 'euler', P, K=K)
                rows = []
                t0 = time.time()
                for ta in np.arange(3.0137, T, win):
                    r = bl.count_window(o, ta, ta + win, W=W, dt=0.01, maxref=3)
                    rows.append([round(float(ta), 4), r['tot'], r['on'], r['off'], r['resolved']])
                offw = [x for x in rows if x[3] != 0]
                emit(key, dict(T=T, W=W, tot=sum(x[1] for x in rows), on=sum(x[2] for x in rows), off=sum(x[3] for x in rows),
                               first_off_window=(offw[0][0] if offw else None), last_off_window=(offw[-1][0] if offw else None),
                               n_off_windows=len(offw), unresolved=sum(1 for x in rows if not x[4]),
                               wall=round(time.time() - t0, 1), rows=[x for x in rows if x[3] != 0 or not x[4]][:400]))

elif stage == 'translate':
    # torus translates of the zeta AFE object on matched windows: omega_p = exp(-i phi_p)
    rng = np.random.default_rng(7)
    Ns = list(range(2, 41 if BIG else 7))
    nb = 60 if BIG else 6
    for N in Ns:
        key = f'translate|zeta|{N}'
        if key in done:
            continue
        ta = 2 * math.pi * N * N + 0.0137; tb = 2 * math.pi * (N + 1) ** 2 + 0.0137
        ps = bl.primes_upto(N)
        res = {'random': [], 'line2': []}
        for b in range(nb):
            phi = {p: float(rng.uniform(0, 2 * math.pi)) for p in ps}
            r = bl.count_window(bl.Obj('zeta', 'afe', N, phi=phi), ta, tb, W=1.0, dt=0.01)
            res['random'].append([r['tot'], r['on'], r['off'], r['resolved']])
        for k in range(0, 24):
            ph = 2 * math.pi * k / 24
            r = bl.count_window(bl.Obj('zeta', 'afe', N, phi={2: ph}), ta, tb, W=1.0, dt=0.01)
            res['line2'].append([round(ph, 4), r['tot'], r['on'], r['off'], r['resolved']])
        rr = res['random']
        emit(key, dict(ta=ta, tb=tb, n_random=nb, frac_random_real_rooted=sum(1 for x in rr if x[2] == 0) / nb,
                       mean_off_random=sum(x[2] for x in rr) / nb, mean_tot_random=sum(x[0] for x in rr) / nb,
                       mean_on_random=sum(x[1] for x in rr) / nb,
                       unresolved=sum(1 for x in rr if not x[3]), diag=res['line2'][0], line2=res['line2']))
if stage == 's1x':
    # S1 screen at larger N (sharp and Riesz AFE)
    for N in range(52, 129, 4):
        for inp, wk in (('zeta', 'sharp'), ('zeta', 'riesz1'), ('dh', 'sharp'), ('dh', 'riesz1'), ('tw2h', 'sharp')):
            key = f's1|afe|{inp}|{N}|{wk}'
            if key in done:
                continue
            poly = bl.afe_poly(inp, N, wkind=wk)
            J, m = len(poly[0]), poly[2].shape[1]
            B = 40000
            print(f'  planned: B={B} J={J} m={m}; largest array B*J complex128 = {B * J * 16 / 1e9:.2f} GB (x ~6 temporaries)', flush=True)
            t0 = time.time()
            r = bl.s1_search(poly, B=B, iters=500)
            r['primes'] = poly[3]; r['wall'] = round(time.time() - t0, 1)
            emit(key, r)
if stage == 'near':
    # off-line zeros of translated zeta AFE sections close to the diagonal: phi_2 = e, phi_3 = e, and the
    # time-shift direction phi_p = tau log p (Dirichlet part evaluated at t + tau, gamma phase at t)
    for N in ((10, 20, 40, 80, 160) if BIG else (5, 10)):
        key = f'near|zeta|{N}'
        if key in done:
            continue
        ta = 2 * math.pi * N * N + 0.0137; tb = 2 * math.pi * (N + 1) ** 2 + 0.0137
        ps = bl.primes_upto(N)
        rows = []
        for e in (0.0, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1.0, -0.001, -0.01, -0.1, -1.0):
            row = {'e': e}
            for name, phi in (('phi2', {2: e}), ('phi3', {3: e}), ('shift', {p: e * math.log(p) for p in ps})):
                r = bl.count_window(bl.Obj('zeta', 'afe', N, phi=phi), ta, tb, W=1.0, dt=0.01)
                row[name] = [r['tot'], r['off'], r['resolved']]
            rows.append(row)
        emit(key, dict(ta=ta, tb=tb, rows=rows))
        print('   ' + ' | '.join(f"{r['e']}: phi2 {r['phi2'][1]} phi3 {r['phi3'][1]} shift {r['shift'][1]}" for r in rows), flush=True)
if stage == 'hb':
    # torus-uniform HB functional S(x) = sup_th log|D(-x,-th)| - log|D(x,th)|: adversarial maximisation vs closed form
    import thresholds as TH
    rng = np.random.default_rng(5)
    def Dprod(inp, ps, K, x, th, sgn):
        out = xp.ones(th.shape[0], dtype=xp.complex128)
        for j, p in enumerate(ps):
            e = {'zeta': 1.0, 'tw2h': 0.5 if p == 2 else 1.0}[inp]
            y = e * p ** (-0.5 - x) * xp.exp(-1j * sgn * th[:, j])
            f = xp.ones_like(y); yy = xp.ones_like(y)
            for _ in range(K):
                yy = yy * y; f = f + yy
            out *= f
        return out
    def Ddh(ps, K, x, th, sgn):
        a = xp.ones(th.shape[0], dtype=xp.complex128); b = xp.ones(th.shape[0], dtype=xp.complex128)
        for j, p in enumerate(ps):
            y = p ** (-0.5 - x) * xp.exp(-1j * sgn * th[:, j]); ch = bl.CHI5[p % 5]
            fa = xp.ones_like(y); fb = xp.ones_like(y); ya = xp.ones_like(y); yb = xp.ones_like(y)
            for _ in range(K):
                ya = ya * (ch * y); yb = yb * (np.conj(ch) * y); fa = fa + ya; fb = fb + yb
            a *= fa; b *= fb
        return bl.C1 * a + np.conj(bl.C1) * b
    cases = [('zeta', P, K) for P in ((11, 23, 47, 97) if BIG else (5, 11)) for K in (1, 2)] + [('tw2h', 23, 1), ('dh', 3, 1), ('dh', 2, 2)]
    for inp, P, K in cases:
        key = f'hb|{inp}|{P}|{K}'
        if key in done:
            continue
        ps = [p for p in bl.primes_upto(P) if not (inp == 'dh' and p == 5)]
        m = len(ps)
        def S(x, th):
            if inp == 'dh':
                return xp.log(xp.abs(Ddh(ps, K, -x, th, -1))) - xp.log(xp.abs(Ddh(ps, K, x, th, 1)))
            return xp.log(xp.abs(Dprod(inp, ps, K, -x, th, -1))) - xp.log(xp.abs(Dprod(inp, ps, K, x, th, 1)))
        rows = []
        B = 4_000_000 if BIG else 100_000
        print(f'  planned: {B} torus points x {m} primes float64 = {B * m * 8 / 1e9:.2f} GB per array', flush=True)
        for x in (0.05, 0.15, 0.3, 0.5):
            th = xp.asarray(rng.uniform(0, 2 * math.pi, (B, m)))
            v = S(x, th)
            top = xp.argsort(v)[-2000:]
            th = th[top]; best_rand = float(v.max())
            step = 0.2
            cur = S(x, th)
            for it in range(300):                       # coordinate-free random-direction ascent
                d = xp.asarray(rng.normal(0, 1, th.shape)) * step
                new = S(x, th + d)
                acc = new > cur
                th = xp.where(acc[:, None], th + d, th); cur = xp.where(acc, new, cur)
                if it % 60 == 59:
                    step *= 0.4
            closed = TH.S_prod(inp, P, K, x) if inp != 'dh' else TH.S_dh(P, K, x)
            rows.append(dict(x=x, sup_random=best_rand, sup_adversarial=float(cur.max()), closed_form=closed))
        emit(key, dict(points_per_x=B, rows=[{k: round(v, 6) for k, v in r.items()} for r in rows],
                       max_excess_over_closed=max(r['sup_adversarial'] - r['closed_form'] for r in rows)))
print('STAGE DONE', stage, flush=True)
