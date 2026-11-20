# c17-u6f: reads (N), (J), (D) of the complex isogenous points of theta under T_{p^2}; twin controls.
# python-flint ball arithmetic. Usage: job.py grid|mellin  (RH_WORKERS processes)
import sys, os, json, math, time
from multiprocessing import Pool
from flint import acb, arb, ctx

PRIMES = [3, 5, 7, 11, 13]

def theta(tau):
    # theta(tau) = sum_n e(n^2 tau) = theta_3(0 | 2 tau)
    return acb(0).modular_theta(2 * tau)[2]

def make_fn(kind, p):
    """returns (f, shift): f evaluates the function at tau; shift = period (points use b*shift)."""
    if kind == 'theta':
        return theta, 1
    if kind in ('EP5', 'EP6'):
        m = int(kind[2:])
        return (lambda tau: theta(tau) * theta(m * tau)), 1
    q = 5 if p == 3 else 3
    sq = arb(q).sqrt()
    if kind == 'twinG33':
        c = -(sq**3 + sq)
    elif kind == 'twin2.2':
        c = arb('-2.2')
    else:
        raise ValueError(kind)
    def g(tau):
        return theta(tau / (q*q)) / sq + sq * theta(tau * (q*q)) + c * theta(tau)
    return g, q*q

def point_values(f, shift, p, x):
    tau = acb(0, x / 2)
    v1 = [f((tau + b*shift) / (p*p)) for b in range(1, p*p)]
    v2 = [f(tau + arb(b*shift) / p) for b in range(1, p)]
    return v1, v2

def jgap(vals):
    n = len(vals)
    s = acb(0)
    ln = arb(0)
    for v in vals:
        s += v
        ln += abs(v).log()
    A = s.real / n
    return A, ln, abs(A).log() - ln / n

def sgn(a):
    if a > 0: return 1
    if a < 0: return -1
    return 0

def f2(a):
    a = arb(a)
    return float(a.mid()) if abs(a.mid()) > arb('1e-300') or a.mid() == 0 else a.mid().str(8, radius=False)

def grid_task(args):
    kind, p = args
    ctx.prec = 1536
    f, shift = make_fn(kind, p)
    n = p*p + p - 2
    rows = []
    t0 = time.time()
    for k in range(200):
        x = arb(10) ** (arb(-3) + arb(6) * k / 199)
        v1, v2 = point_values(f, shift, p, x)
        vals = v1 + v2
        A, ln, J = jgap(vals)
        A1, ln1, J1 = jgap(v1)
        A2, ln2, J2 = jgap(v2)
        row = dict(k=k, x=float(x.mid()), A=f2(A), signA=sgn(A), logN=f2(ln), J=f2(J), signJ=sgn(J),
                   J1=f2(J1), signJ1=sgn(J1), J2=f2(J2), signJ2=sgn(J2))
        # imaginary parts
        ims = [sgn(v.imag) for v in vals]
        row['im_signs'] = ''.join('+' if s > 0 else '-' if s < 0 else '0' for s in ims)
        row['n_im_undecided'] = ims.count(0)
        # norm as a complex ball
        N = acb(1)
        for v in vals: N *= v
        row['signN'] = sgn(N.real); row['N_imag_contains0'] = bool(N.imag.contains(0))
        # discriminant
        ld = arb(0); und = 0
        for i in range(n):
            vi = vals[i]
            for j in range(i+1, n):
                d = abs(vi - vals[j])
                if d > 0: ld += d.log()
                else: und += 1
        row['logabsD'] = f2(2*ld) if und == 0 else None
        row['D_pairs_undecided'] = und
        row['signD'] = ((-1) ** (n//2)) if (und == 0 and row['n_im_undecided'] == 0) else 0
        if kind != 'theta':
            ga = f(acb(0, x/2)).real; gb = f(acb(0, x/(2*p*p))).real; gc = f(acb(0, x*p*p/2)).real
            row['norm_defect'] = f2(ln - ((n+2)*abs(ga).log() - abs(gb).log() - abs(gc).log()))
            row['sum_defect_rel'] = f2((A*n - ((p*p-1)*ga - gb + p*gc)) / (A*n))
            row['monotone_ok'] = bool(abs(gb) > abs(ga)) and bool(abs(ga) > abs(gc))
        if kind == 'theta':
            a = theta(acb(0, x/2)).real; b = theta(acb(0, x/(2*p*p))).real; c = theta(acb(0, x*p*p/2)).real
            S_pred = (p*p - 1)*a - b + p*c
            N_pred = a**(n+2) / (b*c)
            row['sum_identity_ok'] = bool((A*n).overlaps(S_pred)) and float(abs((A*n - S_pred)/S_pred).upper()) < 1e-300
            row['norm_identity_ok'] = bool(N.real.overlaps(N_pred)) and float(abs((N.real - N_pred)/N_pred).upper()) < 1e-300
            # family identities
            N1 = acb(1)
            for v in v1: N1 *= v
            cp = theta(acb(0, x*p/2)).real
            row['norm1_identity_ok'] = float(abs((N1.real - a**(p*p+p+1)/(cp**(p+1)*b)) / N1.real).upper()) < 1e-300
            N2 = acb(1)
            for v in v2: N2 *= v
            row['norm2_identity_ok'] = float(abs((N2.real - cp**(p+1)/(c*a)) / N2.real).upper()) < 1e-300
        rows.append(row)
    return dict(kind=kind, p=p, n=n, seconds=time.time()-t0, rows=rows)

# ---------------- Mellin ----------------
LAM = 100                 # K(v) = J(v) - J(v + LAM*H): M[K] = (1 - e^{-u}) M[J]
SIGMAS = ['0.15', '0.25', '0.3', '0.35', '0.5', '0.7']
TMAX = 200; TSTEP = 2     # t = k/TSTEP

def J_of(kind, p, f, shift, x):
    n = p*p + p - 2
    if kind == 'theta':
        a = theta(acb(0, x/2)).real; b = theta(acb(0, x/(2*p*p))).real; c = theta(acb(0, x*p*p/2)).real
        A = ((p*p - 1)*a - b + p*c) / n
        lN = ((n+2)*a.log() - b.log() - c.log()) / n
        return A.log() - lN, lN
    v1, v2 = point_values(f, shift, p, x)
    A, ln, J = jgap(v1 + v2)
    return J, ln / n

def mellin_task(args):
    kind, p = args
    ctx.prec = 1100
    H = arb(1) / 100          # step in v = log x
    f, shift = make_fn(kind, p)
    t0 = time.time()
    tol = arb(2) ** (-900)
    Jc = {}
    def Jv(k):
        if k not in Jc:
            Jc[k] = J_of(kind, p, f, shift, (H*k).exp())
        return Jc[k]
    def K(k):
        a = Jv(k); b = Jv(k + LAM); c = Jv(k + 2*LAM)
        return a[0] - b[0], a[1] - 2*b[1] + c[1]   # first difference of J, second difference of (log N)/n
    # scan outward from k=0 until |K| e^{sigma v} is below tol for 30 consecutive steps (sigma range 0.15..0.7)
    ks = {}
    flag = {}
    for direction in (+1, -1):
        k = 0 if direction == 1 else -1
        run = 0
        while True:
            kv = K(k); ks[k] = kv
            v = H*k
            w = (v * (arb('0.7') if direction == 1 else arb('0.15'))).exp()
            small = (abs(kv[0]) * w < tol) and (abs(kv[1]) * w < tol)
            run = run + 1 if small else 0
            if run >= 30: break
            if abs(k) > 6000:
                flag[direction] = 'no decay within |v| <= 60: last K = %s' % kv[0].str(10)
                break
            k += direction
    keys = sorted(ks)
    out = dict(kind=kind, p=p, kmin=keys[0], kmax=keys[-1], flags=flag, rows=[])
    # sums: M_h[K](u) = H sum K(v_k) e^{u v_k}, for h and for 2h (even k only)
    W = {}
    for sig in SIGMAS:
        s = arb(sig)
        W[sig] = ([ks[k][0] * (s*H*k).exp() for k in keys], [ks[k][1] * (s*H*k).exp() for k in keys])
    for it in range(0, TMAX*TSTEP + 1):
        t = arb(it) / TSTEP
        phs = [acb(0, t*H*k).exp() for k in keys]     # computed directly (no accumulated products)
        for sig in SIGMAS:
            s = arb(sig); u = acb(s, t)
            wJ, wN = W[sig]
            SJ = acb(0); SN = acb(0); SJ2 = acb(0)
            for idx, k in enumerate(keys):
                ph = phs[idx]
                SJ += wJ[idx] * ph; SN += wN[idx] * ph
                if k % 2 == 0: SJ2 += wJ[idx] * ph
            den = 1 - (-u).exp()
            MJ = SJ * H / den; MN = SN * H / (den*den); MJ2 = SJ2 * 2 * H / den
            row = dict(sigma=sig, t=float(t.mid()), logabsMJ=float(abs(MJ).log().mid()), argMJ=float(MJ.arg().mid()),
                       logabsMN=float(abs(MN).log().mid()),
                       rel_h_vs_2h=float((abs(MJ - MJ2)/abs(MJ)).mid()),
                       relrad_MJ=float((MJ.real.rad() + MJ.imag.rad()) / abs(MJ).mid()))
            if kind == 'theta':
                n = p*p + p - 2
                G = (arb.pi() ** (-u)) * u.gamma() * u.zeta() * (u+1).zeta() * (2 - acb(2)**(-u)) * (1 - acb(2)**(1-u))
                Z = (p*p + p - acb(p)**(2*u) - acb(p)**(-2*u)) * G / n
                row['logabsZ_formula'] = float(abs(Z).log().mid())
                row['rel_MN_vs_formula'] = float((abs(MN - Z)/abs(Z)).mid())
            out['rows'].append(row)
    out['seconds'] = time.time() - t0
    return out

if __name__ == '__main__':
    mode = sys.argv[1]
    W = int(os.environ.get('RH_WORKERS', '4'))
    kinds = ['theta', 'twinG33', 'twin2.2']
    tasks = [(k, p) for p in reversed(PRIMES) for k in kinds]
    fn = grid_task if mode.startswith('grid') else mellin_task
    if mode == 'gridx':
        tasks = [(k, p) for p in reversed(PRIMES) for k in ['twinG33', 'twin2.2', 'EP5', 'EP6']]
    if len(sys.argv) > 2:  # smoke test: one task
        tasks = [(sys.argv[2], int(sys.argv[3]))]
    with Pool(W) as pool:
        for res in pool.imap_unordered(fn, tasks):
            name = '%s_%s_p%d.json' % ('grid' if mode == 'gridx' else mode, res['kind'], res['p'])
            json.dump(res, open(name, 'w'))
            print('done', name, round(res['seconds'], 1), 's', res.get('flags', ''), flush=True)
