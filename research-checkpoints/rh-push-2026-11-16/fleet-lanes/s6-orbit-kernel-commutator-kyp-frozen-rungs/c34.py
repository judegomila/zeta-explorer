# Combinations 3 and 4: Schur-kernel (Pick) Gram matrices of Theta_{F,a}(z) = Lambda_F(1/2+z-a)/Lambda_F(1/2+z+a) on meshes,
# Loewner-pencil realisations from boundary samples, the (ZR) premise, and the detection modulus of a planted pair.
# usage: c34.py <mode> out.jsonl [args]     modes: pick, loewner, zr, detect      (tasks are run in a process pool)
import sys, json, math, random, time, os
from multiprocessing import Pool
from flint import arb, acb, acb_mat, ctx
import olib


def gram_from(key, a, Z, prec, extra=None):
    ctx.prec = prec
    th = olib.make_theta(key, a)
    vals = [th(z) for z in Z]
    if extra is not None:
        vals = [v*extra(z) for v, z in zip(vals, Z)]
    return olib.schur_gram(vals, Z), vals


# ------------------------------------------------------------------ mode pick: nested boundary nodes from height 0
def task_pick(t):
    key, a, h, rmax, prec = t
    ctx.prec = prec
    eps = arb(2)**(-64)
    Z = [acb(eps, arb(j)*arb(h)) for j in range(1, rmax + 1)]
    t0 = time.time()
    try:
        G, vals = gram_from(key, a, Z, prec)
        r = olib.first_neg(G)
        mx = max(float(abs(v)) for v in vals)
    except Exception as e:
        return {'mode': 'pick', 'key': key, 'a': a, 'h': h, 'rmax': rmax, 'error': repr(e)[:200]}
    return {'mode': 'pick', 'key': key, 'a': a, 'h': h, 'rmax': rmax, 'prec': prec, 'first_negative_order': r,
            'height_at_failure': (r*h if r > 0 else None), 'max_abs_theta_minus_1': mx - 1, 'seconds': time.time() - t0}


# ------------------------------------------------------------------ mode loewner
def loewner_poles(H, ys, prec):
    """interleaved Loewner pencil from samples H(y_i) at real y_i (len 2r): poles = eigenvalues of L^{-1} Ls."""
    ctx.prec = prec
    mu = ys[0::2]; la = ys[1::2]; r = len(la); mu = mu[:r]
    v = [H(y) for y in mu]; w = [H(y) for y in la]
    L = acb_mat(r, r, [(v[j] - w[k])/(mu[j] - la[k]) for j in range(r) for k in range(r)])
    Ls = acb_mat(r, r, [(mu[j]*v[j] - la[k]*w[k])/(mu[j] - la[k]) for j in range(r) for k in range(r)])
    M = L.solve(Ls)
    ev = M.eig(algorithm='approx')
    return ev, (L, Ls, v, w, mu, la)


def task_loewner(t):
    key, a, y0, y1, r, prec, label = t
    ctx.prec = prec
    t0 = time.time()
    try:
        if key.startswith('blaschke'):
            al = [acb(0.2 + 0.05*i, 3.0*i + 1) for i in range(int(key[8:]))]
            def th(z):
                z = acb(z); v = acb(1)
                for x in al: v = v*(z - x)/(z + x.conjugate())
                return v
        else:
            th = olib.make_theta(key, a)
        H = lambda y: th(acb(0, y))
        ys = [arb(y0) + (arb(y1) - arb(y0))*(arb(2*i + 1)/(4*r)) for i in range(2*r)]
        ev, (L, Ls, v, w, mu, la) = loewner_poles(H, ys, prec)
        # y-plane: genuine poles of Theta (zero on the line at ordinate g) sit at y = g + i a; a zero right of 1/2 + a gives Im y < 0
        P = [(float(e.real), float(e.imag)) for e in ev]
        inwin = [p for p in P if y0 <= p[0] <= y1]
        uns = [p for p in P if p[1] < 0]
        uns_in = [p for p in inwin if p[1] < 0]
        st_in = sorted(p[1] for p in inwin if p[1] > 0)
        # fit error at midpoints between samples
        Wm = acb_mat(1, r, w); Vm = acb_mat(r, 1, v)
        err = 0.0
        for i in range(0, 2*r - 1, max(1, (2*r)//16)):
            y = (ys[i] + ys[i + 1])/2
            Hy = (Wm*((Ls - L*acb(y)).solve(Vm)))[0, 0]
            err = max(err, float(abs(Hy - H(y))))
        res = {'mode': 'loewner', 'label': label, 'key': key, 'a': a, 'window': [y0, y1], 'r': r, 'prec': prec, 'n_poles': len(P),
               'n_unstable': len(uns), 'n_unstable_in_window': len(uns_in), 'n_in_window': len(inwin),
               'stable_in_window_im_min_med_max': ([st_in[0], st_in[len(st_in)//2], st_in[-1]] if st_in else None),
               'n_stable_in_window_within_1pct_of_a': sum(1 for x in st_in if abs(x - a) < 0.01*a),
               'unstable_in_window': sorted(uns_in)[:12], 'fit_error_midpoints': err, 'seconds': time.time() - t0}
        if key.startswith('blaschke'):
            res['true_poles_y'] = [(float((-x.conjugate()/acb(0, 1)).real), float((-x.conjugate()/acb(0, 1)).imag)) for x in al]
            res['found'] = sorted(P)
        return res
    except Exception as e:
        return {'mode': 'loewner', 'label': label, 'key': key, 'a': a, 'r': r, 'error': repr(e)[:300]}


# ------------------------------------------------------------------ mode zr: premise scan
def task_zr(t):
    key, a, ylo, yhi, npts, prec, seed = t
    ctx.prec = prec
    rnd = random.Random(seed)
    th = olib.make_theta(key, a)
    mx = None; arg = None; ratios = []
    for _ in range(npts):
        x = rnd.choice([0.002, 0.01, 0.05, 0.1, 0.25, 0.5]); y = rnd.uniform(ylo, yhi)
        v = abs(th(acb(x, y)))
        lg = float(v.log())
        if mx is None or lg > mx: mx = lg; arg = (x, y)
        pred = -2*min(x, a)*math.log(y/(2*math.pi))
        ratios.append(lg/pred)
    ratios.sort()
    return {'mode': 'zr', 'key': key, 'a': a, 'window': [ylo, yhi], 'points': npts, 'max_log_abs_theta': mx, 'argmax': arg,
            'ratio_to_smooth_law_min_med_max': [ratios[0], ratios[len(ratios)//2], ratios[-1]]}


# ------------------------------------------------------------------ mode detect: least mesh density that sees a pole in Re z > 0
def task_detect(t):
    """key: object whose Theta has a pole at z = (delta - a) + i g.  Mesh: z_j = x0 + i (g + (j + off) h), j = -K/2..K/2-1.
    Returns for each h on a geometric ladder the negative index for two offsets; h* = largest h with a negative pivot at both."""
    key, a, g, delta, x0, K, prec, twin, label = t
    ctx.prec = prec
    t0 = time.time()
    try:
        extra = None
        if twin:
            # arithmetic-free twin: zeta's ordinates within W of g are moved to the smooth ordinates (N_smooth = k - 1/2)
            W = twin
            n0 = int(float(arb(g - W).zeta_nzeros())); n1 = int(float(arb(g + W).zeta_nzeros()))
            old = []; new = []
            for k in range(max(1, n0 + 1), n1 + 1):
                go = acb.zeta_zero(k).imag
                old.append(go); new.append(olib.smooth_ordinate(k, float(go)))
            extra = olib.twin_factor(a, old, new)
        th = olib.make_theta(key, a)
        dens = math.log(max(g, 10)/(2*math.pi))/(2*math.pi)      # zeros per unit height (zeta)
        rows = []; hstar = None
        hs = [4.0/dens*2**(-m/4.0) for m in range(0, 57)]
        cache = {}
        for h in hs:
            negs = []
            for off in (0.5, 0.23):
                Z = [acb(x0, g + (j + off)*h) for j in range(-K//2, K - K//2)]
                vals = [th(z) for z in Z]
                if extra is not None: vals = [v*extra(z) for v, z in zip(vals, Z)]
                G = olib.schur_gram(vals, Z)
                r = olib.first_neg(G)
                mxm = max(float(abs(v)) for v in vals)
                negs.append((r, mxm))
            rows.append({'h': h, 'h_times_density': h*dens, 'first_neg': [n[0] for n in negs], 'max_abs_theta': [n[1] for n in negs]})
            if hstar is None and all(n[0] > 0 for n in negs):
                hstar = h
                # a modulus witness (ZR) is present iff max |Theta| > 1 at a node
            if hstar is not None and len(rows) >= hs.index(hstar) + 5:
                break
        zr_h = None
        for rw in rows:
            if all(m > 1 for m in rw['max_abs_theta']): zr_h = rw['h']; break
        res = {'mode': 'detect', 'label': label, 'key': key, 'a': a, 'g': g, 'delta': delta, 'x0': x0, 'K': K, 'prec': prec, 'twin_W': twin,
               'density': dens, 'h_star': hstar, 'h_star_times_density': (hstar*dens if hstar else None),
               'Nstar_over_N': ((g/hstar)/olib.nzeta(g) if hstar and g > 20 else None), 'h_modulus_witness': zr_h,
               'rows': rows, 'seconds': time.time() - t0}
        return res
    except Exception as e:
        return {'mode': 'detect', 'label': label, 'key': key, 'a': a, 'g': g, 'delta': delta, 'error': repr(e)[:300]}


def task_pickwin(t):
    """nodes confined to heights (0, Y]: z_j = eps + i Y j / r; least r on a ladder with a negative pivot."""
    key, a, Y, rl, prec = t
    ctx.prec = prec
    eps = arb(2)**(-64)
    t0 = time.time(); rows = []; rstar = None
    try:
        th = olib.make_theta(key, a)
        for r in rl:
            Z = [acb(eps, arb(Y)*j/r) for j in range(1, r + 1)]
            G = olib.schur_gram([th(z) for z in Z], Z)
            fn = olib.first_neg(G)
            rows.append([r, fn])
            if fn > 0 and rstar is None:
                rstar = r; break
            if fn < 0: break
    except Exception as e:
        return {'mode': 'pickwin', 'key': key, 'a': a, 'Y': Y, 'error': repr(e)[:200]}
    return {'mode': 'pickwin', 'key': key, 'a': a, 'Y': Y, 'prec': prec, 'ladder': rows, 'r_star': rstar, 'seconds': time.time() - t0}


FN = {'pickwin': task_pickwin, 'pick': task_pick, 'loewner': task_loewner, 'zr': task_zr, 'detect': task_detect}


def run(t):
    return FN[t[0]](t[1])


if __name__ == '__main__':
    tasks = json.load(open(sys.argv[1])); out = sys.argv[2]
    print('tasks', len(tasks), 'workers', olib.workers(), '(largest matrix side: %d balls)' % max([t[1][3] if t[0] == 'pick' else 300 for t in tasks]), flush=True)
    with Pool(olib.workers()) as p, open(out, 'a') as f:
        for res in p.imap_unordered(run, [(t[0], tuple(t[1])) for t in tasks]):
            f.write(json.dumps(res) + '\n'); f.flush()
            print(json.dumps({k: v for k, v in res.items() if k not in ('rows', 'found')})[:600], flush=True)
