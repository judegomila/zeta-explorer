# c17: rank-2 (SL3, minimal parabolic) truncated inner product kernel, ball arithmetic (python-flint).
# K_T(lam,mu) = sum_{w,w'} c(w,lam) conj(c(w',mu)) e^{<nu,T>} / (nu_1 nu_2), nu = w lam + conj(w' mu),
# <nu,T> = nu_1 tau_1 + nu_2 tau_2, tau_1 = (2 t1 + t2)/3, tau_2 = (t1 + 2 t2)/3   (T = t1 varpi1^vee + t2 varpi2^vee).
# Written from the formula (Miller, math/0006058, Thm 6.1 and (7.6)); does not import the c16 lane code.
from flint import acb, arb, ctx, dirichlet_char
import math

def set_prec(p): ctx.prec = p

def xi(u):
    return acb.pi()**(-u/2) * (u/2).gamma() * u.zeta()

def M_zeta(u):
    return xi(u)/xi(u+1)

def M_toy(u):                      # pole at 1 with residue 2, M(0) = -1, M(u)M(-u) = 1
    return (u+1)/(u-1)

def M_one(u):
    return acb(1)

_chi = None
def _dh_L(s):
    # Davenport-Heilbronn: f = (1 - i k)/2 L(s,chi) + (1 + i k)/2 L(s,chibar), chi mod 5 with chi(2) = i
    global _chi
    if _chi is None:
        _chi = [dirichlet_char(5, 2), dirichlet_char(5, 3)]
    s5 = arb(5).sqrt()
    k = ((10 - 2*s5).sqrt() - 2)/(s5 - 1)
    I = acb(0, 1)
    return (1 - I*k)/2 * _chi[0].l(s) + (1 + I*k)/2 * _chi[1].l(s)

def xi_dh(s):
    return (arb(5)/arb.pi())**(s/2) * ((s+1)/2).gamma() * _dh_L(s)

def M_dh(u):
    return xi_dh(u)/xi_dh(u+1)

def exact_zeros(zeros):
    """zeros: list of complex numbers (used as given: controls) or exact specs
    ('q', eta, g): quartet 1/2 -+ eta +- i g ; ('rp', eta): real pair 1/2 -+ eta.
    Specs are expanded in ball arithmetic from the dyadic numbers eta, g, so that the set is closed under a -> 1 - a
    exactly (a pair built from the floats 0.5 - eta and 0.5 + eta is symmetric only to 1e-17; see bench_float_pairing.jsonl)."""
    out = []
    h = arb(1)/2
    for z in zeros:
        if isinstance(z, (tuple, list)) and z[0] == 'q':
            e = arb(z[1]); g = arb(z[2])
            out += [acb(h-e, g), acb(h-e, -g), acb(h+e, g), acb(h+e, -g)]
        elif isinstance(z, (tuple, list)) and z[0] == 'qd':      # mis-paired quartet: right members shifted by delta (control)
            e = arb(z[1]); g = arb(z[2]); dl = arb(z[3])
            out += [acb(h-e, g), acb(h-e, -g), acb(h+e+dl, g), acb(h+e+dl, -g)]
        elif isinstance(z, (tuple, list)) and z[0] == 'rp':
            e = arb(z[1]); out += [acb(h-e), acb(h+e)]
        else:
            z = complex(z); out.append(acb(z.real, z.imag))
    return out

def blaschke(zeros):
    zs = exact_zeros(zeros)
    def Th(u):
        r = acb(1)
        for a in zs:
            r = r*(u - a)/(u + a.conjugate())
        return r
    return Th

def make_M(base, zeros=()):
    Th = blaschke(zeros) if len(zeros) else None
    if Th is None:
        return base
    return lambda u: base(u)*Th(u)

def orbit(lam, M, tau):
    """list of (nu1, nu2, C) with C = c(w,lam) e^{nu1 tau1 + nu2 tau2}"""
    z1, z2 = lam
    m1, m2, m12 = M(z1), M(z2), M(z1+z2)
    o = [(z1, z2, acb(1)), (-z1, z1+z2, m1), (z1+z2, -z2, m2),
         (z2, -z1-z2, m12*m1), (-z1-z2, z1, m12*m2), (-z2, -z1, m1*m2*m12)]
    t1, t2 = tau
    if t1 == 0 and t2 == 0:
        return o
    return [(a, b, c*(a*t1 + b*t2).exp()) for (a, b, c) in o]

def tau_of(T):
    t1, t2 = T
    return ((2*arb(t1) + arb(t2))/3, (arb(t1) + 2*arb(t2))/3)

def Kentry(oi, oj):
    s = acb(0)
    for (a, b, c) in oi:
        for (a2, b2, c2) in oj:
            s += c*c2.conjugate()/((a + a2.conjugate())*(b + b2.conjugate()))
    return s

def gram(points, M, T):
    tau = tau_of(T)
    orbs = [orbit(p, M, tau) for p in points]
    n = len(points)
    G = [[None]*n for _ in range(n)]
    for i in range(n):
        G[i][i] = acb(Kentry(orbs[i], orbs[i]).real)
        for j in range(i+1, n):
            v = Kentry(orbs[i], orbs[j])
            G[i][j] = v
            G[j][i] = v.conjugate()
    return G

def ldl_inertia(G):
    """Diagonally pivoted LDL* in ball arithmetic.
    Returns (status, npos, nneg, pivots) ; status 'ok' if every pivot ball excludes 0, else 'undecided'.
    Pivots are Schur-complement diagonals; inertia of D = inertia of G (Sylvester) when status is ok."""
    n = len(G)
    A = [row[:] for row in G]
    idx = list(range(n))
    piv = []
    npos = nneg = 0
    for k in range(n):
        # choose pivot: largest |mid| among remaining diagonals
        best = None; bv = -1.0
        for i in range(k, n):
            d = A[i][i].real
            v = abs(float(d.mid()))
            if not (v == v): return ('undecided', npos, nneg, piv)
            if v > bv: bv = v; best = i
        if best != k:
            A[k], A[best] = A[best], A[k]
            for r in range(n):
                A[r][k], A[r][best] = A[r][best], A[r][k]
            idx[k], idx[best] = idx[best], idx[k]
        d = A[k][k].real
        if d > 0: npos += 1
        elif d < 0: nneg += 1
        else:
            return ('undecided', npos, nneg, piv)
        piv.append(d)
        for i in range(k+1, n):
            l = A[i][k]/d
            for j in range(i, n):
                A[i][j] = A[i][j] - l*A[j][k].conjugate()
                if j > i: A[j][i] = A[i][j].conjugate()
            A[i][i] = acb(A[i][i].real)
    return ('ok', npos, nneg, piv)

def certify(points_fn, Mfac, T, precs=(256, 512, 1024, 2048, 4096)):
    """points_fn(): builds points at the current precision; Mfac(): builds M at the current precision.
    Returns dict with status, inertia, relative size of the most negative / smallest pivot, precision used."""
    last = None
    for p in precs:
        set_prec(p)
        pts = points_fn(); M = Mfac()
        try:
            G = gram(pts, M, T)
            st, npos, nneg, piv = ldl_inertia(G)
        except ZeroDivisionError:
            st, npos, nneg, piv = 'undecided', 0, 0, []
        dmax = max([abs(float(G[i][i].real.mid())) for i in range(len(G))]) if st != 'x' else 1.0
        last = dict(status=st, npos=npos, nneg=nneg, prec=p, n=len(pts))
        if st == 'ok':
            fl = [float(x.mid()) for x in piv]
            # pivots can under/overflow float: use logs through arb
            logs = [float((abs(x)).log().mid()) / math.log(10) for x in piv]
            last['log10_piv_min'] = min(logs); last['log10_piv_max'] = max(logs)
            if nneg:
                negs = [x for x in piv if x < 0]
                last['log10_negpiv_rel'] = max(float(abs(x).log().mid())/math.log(10) for x in negs) - max(logs)
            return last
    return last
