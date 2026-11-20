"""Test 4. Rank-one Maass-Selberg Gram with a scattering function phi_F(s) = X_F(2s-1)/X_F(2s),
X_F the completed function of F.  Nodes s_j = 1/2 + d_j + i t_j, 0 < d_j <= 1/4.
  K_ij = [Y^(s_i+conj s_j-1) - phi_i conj(phi_j) Y^(1-s_i-conj s_j)]/(s_i+conj s_j-1)
       + [conj(phi_j) Y^(s_i-conj s_j) - phi_i Y^(conj s_j-s_i)]/(s_i-conj s_j)
For F = zeta and Y >= 1 this is the Gram matrix of the truncated Eisenstein series of SL_2(Z) (Maass-Selberg).
Statistic: first order n at which the leading n x n minor has a negative pivot (LDL^* without pivoting,
ball arithmetic; a pivot whose ball contains 0 stops the run as 'undetermined').
Backend: python-flint (Arb) if present, else mpmath (no enclosures; local validation only).
"""
import sys, json, math, time, os
try:
    import flint
    from flint import acb, arb
    BACK = 'arb'
except Exception:
    import mpmath as mp
    BACK = 'mp'

def setprec(bits):
    if BACK == 'arb': flint.ctx.prec = bits
    else: mp.mp.prec = bits
def C(re, im=0):
    if BACK == 'arb': return acb(arb(re), arb(im))
    return mp.mpc(mp.mpf(re), mp.mpf(im))
def Rr(x): return arb(x) if BACK == 'arb' else mp.mpf(x)
def PI(): return arb.pi() if BACK == 'arb' else mp.pi
def cexp(z): return z.exp() if BACK == 'arb' else mp.exp(z)
def lgam(z): return z.lgamma() if BACK == 'arb' else mp.loggamma(z)
def zeta(u): return u.zeta() if BACK == 'arb' else mp.zeta(u)
def hurw(u, a, q): return u.zeta(acb(arb(a)/q)) if BACK == 'arb' else mp.zeta(u, mp.mpf(a)/q)
def conj(z): return z.conjugate() if BACK == 'arb' else mp.conj(z)
def real(z): return z.real
def cpow(base, z): return cexp(z*math_log(base))
def math_log(x): return Rr(x).log() if BACK == 'arb' else mp.log(x)
def frac(a, b): return Rr(a)/Rr(b)

XIs = None
def xi_const():
    global XIs
    if XIs is None:
        s5 = Rr(5).sqrt() if BACK == 'arb' else mp.sqrt(5)
        t = (10 - 2*s5); t = t.sqrt() if BACK == 'arb' else mp.sqrt(t)
        XIs = (t - 2)/(s5 - 1)
    return XIs

def Xz(u): return cexp(-u/2*math_log(1)*0 - u/2*PI().log() + lgam(u/2))*zeta(u) if BACK == 'arb' else mp.exp(-u/2*mp.log(mp.pi) + mp.loggamma(u/2))*mp.zeta(u)
def X(obj, u):
    if obj == 'zeta': return Xz(u)
    if obj == 'chi_-4':
        L = cpow(4, -u)*(hurw(u, 1, 4) - hurw(u, 3, 4))
        return cexp(-(u+1)/2*(math_log(PI()) - math_log(4)) + lgam((u+1)/2))*L
    if obj == 'chi_5':
        L = cpow(5, -u)*(hurw(u, 1, 5) - hurw(u, 2, 5) - hurw(u, 3, 5) + hurw(u, 4, 5))
        return cexp(-u/2*(math_log(PI()) - math_log(5)) + lgam(u/2))*L
    if obj == 'DH':
        x = xi_const(); L = cpow(5, -u)*(hurw(u, 1, 5) + x*hurw(u, 2, 5) - x*hurw(u, 3, 5) - hurw(u, 4, 5))
        return cexp(-u/2*(math_log(PI()) - math_log(5)) + lgam((u+1)/2))*L
    if obj == 'E_a': a = frac(1, 50); return Xz(u + a)*Xz(u - a)
    if obj == 'T-NR':
        lq = math_log(1000003); c = frac(22, 10); h = frac(1, 2)
        return Xz(u)*(cexp((u - h)*lq) + cexp((h - u)*lq) + c)
    if obj == 'WT': return Xz(u + C(0, frac(17, 10)))
    if obj == 'Liouville': return cexp(-u/2*math_log(PI()) + lgam(u/2))*zeta(2*u)/zeta(u)
    raise ValueError(obj)
def phi(obj, s): return X(obj, 2*s - 1)/X(obj, 2*s)

def vdc(j, base=2):
    v = 0.0; f = 1.0/base
    while j: v += f*(j % base); j //= base; f /= base
    return v
def nodes(design, M):
    """exact dyadic/rational node coordinates (as strings for exact conversion)"""
    out = []
    for j in range(M):
        dq = max(1, int(round(256*vdc(j+1, 3))))            # d = dq/1024 in (0, 1/4]
        if design == 'W1': tq = 8 + int(round(400*vdc(j+1, 2)*1.0)) ; tden = 4        # t in [2, 102], step 1/4
        elif design == 'W2': tq = 100 + int(round(10000*4*vdc(j+1, 2))); tden = 4     # t in [25, 10025]
        elif design == 'W3': tq = 8 + int(round(1600*vdc(j+1, 2))); tden = 4           # t in [2, 402]
        out.append((dq, tq, tden))
    # make t distinct
    seen = set(); res = []
    for dq, tq, tden in out:
        while tq in seen: tq += 1
        seen.add(tq); res.append((dq, tq, tden))
    return res

def gram_pivots(obj, design, M, Ystr, bits, phis=None):
    setprec(bits)
    nd = nodes(design, M)
    S = [C(frac(1, 2) + frac(dq, 1024), frac(tq, tden)) for dq, tq, tden in nd]
    t0 = time.time()
    if phis is None: phis = [phi(obj, s) for s in S]
    tphi = time.time() - t0
    num, den = Ystr.split('/'); lY = math_log(frac(int(num), int(den)))
    def K(i, j):
        si = S[i]; sj = conj(S[j]); a = si + sj - 1; b = si - sj
        return (cexp(a*lY) - phis[i]*conj(phis[j])*cexp(-a*lY))/a + (conj(phis[j])*cexp(b*lY) - phis[i]*cexp(-b*lY))/b
    L = []; D = []; first_neg = None; undet = None; minpiv = None; herm = 0.0
    for k in range(M):
        row = []
        for j in range(k):
            v = K(k, j)
            for m in range(j): v = v - row[m]*conj(L[j][m])*D[m]
            row.append(v/D[j])
        d = real(K(k, k))
        for m in range(k): d = d - real(row[m]*conj(row[m]))*D[m]
        if BACK == 'arb':
            if d < 0: sign = -1
            elif d > 0: sign = 1
            else: sign = 0
            dm = float(d.mid())
        else:
            dm = float(d); sign = (dm > 0) - (dm < 0)
        if sign == 0: undet = k+1; break
        if minpiv is None or dm < minpiv[1]: minpiv = (k+1, dm)
        if sign < 0: first_neg = k+1; break
        L.append(row); D.append(d)
    return dict(obj=obj, design=design, M=M, Y=Ystr, bits=bits, backend=BACK, first_negative_order=first_neg,
                undetermined_at=undet, orders_certified_positive=len(D), min_pivot=minpiv, diag1=float(real(K(0, 0)).mid()) if BACK == 'arb' else float(real(K(0, 0))),
                secs_phi=tphi, secs=time.time()-t0), phis

def task(args):
    obj, design, M, Ys, bits = args; out = []; phis = None
    for Y in Ys:
        try:
            r, phis = gram_pivots(obj, design, M, Y, bits, phis)
        except Exception as e:
            r = dict(obj=obj, design=design, Y=Y, error=repr(e))
        out.append(r); print(json.dumps(r), flush=True)
    return out

def validate():
    """known answer: Maass-Selberg at real s, s' against direct integration of the truncated Eisenstein series
    over the fundamental domain (mpmath, 15 digits)."""
    import mpmath as mp
    mp.mp.dps = 15
    xi2 = lambda s: mp.pi**(-s)*mp.gamma(s)*mp.zeta(2*s)
    ph = lambda s: xi2(s - mp.mpf(1)/2)/xi2(s)
    sig = lambda n, w: sum(d**w for d in range(1, n+1) if n % d == 0)
    def an(n, y, s): return 2*mp.sqrt(y)/xi2(s)*n**(s-mp.mpf(1)/2)*sig(n, 1-2*s)*mp.besselk(s-mp.mpf(1)/2, 2*mp.pi*n*y)
    NT = 7
    def E(x, y, s): return y**s + ph(s)*y**(1-s) + sum(an(n, y, s)*2*mp.cos(2*mp.pi*n*x) for n in range(1, NT))
    s1 = mp.mpf('0.7'); s2 = mp.mpf('0.85'); Y = mp.mpf('1.5')
    # modular invariance check of the expansion: E(z) = E(-1/z)
    z = mp.mpc(0.3, 0.9); w = -1/z
    print('modular check |E(z) - E(-1/z)|:', mp.nstr(abs(E(z.real, z.imag, s1) - E(w.real, w.imag, s1)), 5))
    c0 = lambda y, s: y**s + ph(s)*y**(1-s)
    top = mp.quad(lambda y: 2*sum(an(n, y, s1)*an(n, y, s2) for n in range(1, NT))/y**2, [Y, 3, 8])
    mid = mp.quad(lambda y: (c0(y, s1)*c0(y, s2) + 2*sum(an(n, y, s1)*an(n, y, s2) for n in range(1, NT)))/y**2, [1, Y])
    low = 2*mp.quad(lambda x: mp.quad(lambda y: E(x, y, s1)*E(x, y, s2)/y**2, [mp.sqrt(1-x*x), 1]), [0, 0.5])
    direct = top + mid + low
    a = s1 + s2 - 1; b = s1 - s2
    formula = (Y**a - ph(s1)*ph(s2)*Y**(-a))/a + (ph(s2)*Y**b - ph(s1)*Y**(-b))/b
    print('direct integral', mp.nstr(direct, 12), 'Maass-Selberg formula', mp.nstr(formula, 12), 'diff', mp.nstr(abs(direct-formula), 5))
    # code path: K(i,j) of gram_pivots at the same real nodes equals the formula (phi through X())
    setprec(60); p1 = phi('zeta', C('0.7')); print('phi code vs direct:', mp.nstr(abs(complex(p1.real, p1.imag) - complex(ph(s1))), 5) if BACK == 'mp' else abs(complex(float(p1.real.mid()), float(p1.imag.mid())) - complex(ph(s1))))

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'validate': validate()
    elif mode == 'small':
        for obj in ['zeta', 'chi_-4', 'chi_5', 'E_a', 'T-NR', 'DH', 'WT', 'Liouville']:
            task((obj, 'W1', int(sys.argv[2]), ['1/1', '2/1'], int(sys.argv[3])))
    elif mode == 'run':
        from multiprocessing import Pool
        design = sys.argv[2]; M = int(sys.argv[3]); bits = int(sys.argv[4]); Ys = sys.argv[5].split(','); objs = sys.argv[6].split(',')
        tasks = [(o, design, M, Ys, bits) for o in objs]
        with Pool(min(len(tasks), int(os.environ.get('RH_WORKERS', '4')))) as pool:
            res = pool.map(task, tasks, chunksize=1)
        json.dump([r for rr in res for r in rr], open(f'out/ms4_{design}_{M}_{bits}_{sys.argv[7] if len(sys.argv) > 7 else "a"}.json', 'w'), indent=1)
