# s1-kernel-shear-norms: shared kernel code.
# Convention (repo): x = e^{4u}.  Xi_F(w) = int_R Phi_F(u) e^{iwu} du = Lambda_F(1/2 + i w/2).
#   zeta (canonical de Bruijn-Newman kernel, full-line transform = xi(1/2+iw/2)/4):
#       Phi(u) = sum_n (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u})
#   Dirichlet-type F = sum b(n) n^{-s}, b periodic mod q, parity delta, no pole,
#   Lambda_F(s) = (q/pi)^{(s+delta)/2} Gamma((s+delta)/2) F(s):
#       Phi_F(u) = 4 e^{(1+2 delta)u} sum_n b(n) n^delta exp(-pi n^2 e^{4u}/q)
import math, cmath, json, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))

KAPPA = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)   # DH constant
DH_B = [0.0, 1.0, KAPPA, -KAPPA, -1.0]                           # b(n mod 5), b(1)=1


def real_char(q):
    """primitive real character mod q (Kronecker), returns (b list, delta)."""
    tab = {3: ([0, 1, -1], 1), 4: ([0, 1, 0, -1], 1), 5: ([0, 1, -1, -1, 1], 0),
           7: ([0, 1, 1, -1, 1, -1, -1], 1), 8: ([0, 1, 0, -1, 0, -1, 0, 1], 0),
           11: ([0, 1, -1, 1, 1, 1, -1, -1, -1, 1, -1], 1),
           13: ([0, 1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, 1], 0)}
    b, d = tab[q]
    return [float(x) for x in b], d


def kronecker(D, n):
    """Kronecker symbol (D/n) for n >= 0."""
    if n == 0: return 1 if abs(D) == 1 else 0
    r = 1; t = 0
    while n % 2 == 0: n //= 2; t += 1
    if t:
        if D % 2 == 0: return 0
        if t % 2 and D % 8 in (3, 5): r = -r
    # Jacobi symbol (D/n), n odd positive
    a = D % n; m = n
    while a:
        while a % 2 == 0:
            a //= 2
            if m % 8 in (3, 5): r = -r
        a, m = m, a
        if a % 4 == 3 and m % 4 == 3: r = -r
        a %= m
    return r if m == 1 else 0


def fundamental_discriminants(dmax):
    def sqfree(n):
        n = abs(n); p = 2
        while p*p <= n:
            if n % (p*p) == 0: return False
            p += 1
        return True
    out = []
    for D in range(-dmax, dmax + 1):
        if D in (0, 1): continue
        if (D % 4 == 1 and sqfree(D)) or (D % 4 == 0 and (D//4) % 4 in (2, 3) and sqfree(D//4)):
            out.append(D)
    return out


def kron_char(D):
    q = abs(D)
    return [float(kronecker(D, n)) for n in range(q)], (0 if D > 0 else 1)


def twin_table(qmin=5, qmax=49):
    """all route-44 twins: key, q, delta, omega, coefficient vector a (period q)."""
    import chars44
    out = []
    for q in range(qmin, qmax + 1):
        for ip, p in enumerate(chars44.complex_pairs(q)):
            for t in chars44.twins(p):
                out.append({'key': 'q%d.%d.%s' % (q, ip, 'T+' if t['omega'] > 0 else 'T-'),
                            'q': q, 'delta': p['delta'], 'omega': t['omega'],
                            'b': [float(x) for x in t['a']], 'a1': t['a1'],
                            'chi': p['chi']})
    return out


# ---------------- float64 kernels -----------------
def phi_zeta_np(u, N=30):
    u = np.asarray(u, dtype=np.float64)
    e4 = np.exp(4*u); e5 = np.exp(5*u); e9 = np.exp(9*u)
    s = np.zeros_like(u)
    for n in range(1, N + 1):
        s += (2*math.pi**2*n**4*e9 - 3*math.pi*n*n*e5)*np.exp(-math.pi*n*n*e4)
    return s


def phi_repo_np(u, N=10):
    """kernel exactly as typed in imp-3849 (prefactors e^{4u}, e^{2u}); used only to
    replay its landmark numbers."""
    u = np.asarray(u, dtype=np.float64)
    e2 = np.exp(2*u); e4 = np.exp(4*u)
    s = np.zeros_like(u)
    for n in range(1, N + 1):
        s += (2*math.pi**2*n**4*e4 - 3*math.pi*n*n*e2)*np.exp(-math.pi*n*n*e4)
    return s


def phi_F_np(u, b, q, delta, N=None):
    u = np.asarray(u, dtype=np.float64)
    e4 = np.exp(4*u)
    if N is None:
        N = int(6*math.sqrt(q)*4) + 10
    s = np.zeros_like(u)
    for n in range(1, N + 1):
        bn = b[n % q]
        if bn == 0.0:
            continue
        s += bn*(n**delta)*np.exp(-math.pi*n*n*e4/q)
    return 4*np.exp((1 + 2*delta)*u)*s


# ---------------- mpmath kernels (any precision) -----------------
def phi_zeta_mp(u, N=12):
    import mpmath as mp
    e4 = mp.exp(4*u); e5 = mp.exp(5*u); e9 = mp.exp(9*u)
    return mp.fsum((2*mp.pi**2*n**4*e9 - 3*mp.pi*n*n*e5)*mp.exp(-mp.pi*n*n*e4) for n in range(1, N + 1))


def phi_repo_mp(u, N=10):
    import mpmath as mp
    e2 = mp.exp(2*u); e4 = mp.exp(4*u)
    return mp.fsum((2*mp.pi**2*n**4*e4 - 3*mp.pi*n*n*e2)*mp.exp(-mp.pi*n*n*e4) for n in range(1, N + 1))


def phi_F_mp(u, b, q, delta, N=None):
    import mpmath as mp
    e4 = mp.exp(4*u)
    if N is None:
        N = int(6*math.sqrt(q)*4) + 10
    s = mp.fsum(b[n % q]*(n**delta)*mp.exp(-mp.pi*n*n*e4/q) for n in range(1, N + 1) if b[n % q] != 0)
    return 4*mp.exp((1 + 2*delta)*u)*s


def dh_b_mp():
    import mpmath as mp
    k = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
    return [mp.mpf(0), mp.mpf(1), k, -k, mp.mpf(-1)]


def gl_nodes(n, a, b):
    x, w = np.polynomial.legendre.leggauss(n)
    return 0.5*(b - a)*x + 0.5*(b + a), 0.5*(b - a)*w


if __name__ == '__main__':
    # self-test: evenness of the kernels and the Fourier identity for DH and chi_{-3}
    import mpmath as mp
    mp.mp.dps = 30
    print('Phi_zeta(0)       =', phi_zeta_mp(mp.mpf(0)), '(known 0.446696900467...)')
    for u in (0.1, 0.3, 0.6):
        print('even zeta  u=%.1f' % u, mp.nstr(phi_zeta_mp(mp.mpf(u))/phi_zeta_mp(-mp.mpf(u)) - 1, 5),
              ' DH', mp.nstr(phi_F_mp(mp.mpf(u), dh_b_mp(), 5, 1)/phi_F_mp(-mp.mpf(u), dh_b_mp(), 5, 1) - 1, 5),
              ' chi-3', mp.nstr(phi_F_mp(mp.mpf(u), [0, 1, -1], 3, 1)/phi_F_mp(-mp.mpf(u), [0, 1, -1], 3, 1) - 1, 5),
              ' chi5', mp.nstr(phi_F_mp(mp.mpf(u), [0, 1, -1, -1, 1], 5, 0)/phi_F_mp(-mp.mpf(u), [0, 1, -1, -1, 1], 5, 0) - 1, 5))
    # Fourier identity at w = 2t: int Phi e^{iwu} du = Lambda(1/2+it)
    t = mp.mpf('3.7')
    b = dh_b_mp()
    lhs = mp.quad(lambda u: phi_F_mp(u, b, 5, 1)*mp.cos(2*t*u), mp.linspace(0, 2, 9))*2
    s = mp.mpf(1)/2 + 1j*t
    F = sum(b[r]*mp.zeta(s, mp.mpf(r)/5) for r in range(1, 5))/5**s
    rhs = (5/mp.pi)**((s + 1)/2)*mp.gamma((s + 1)/2)*F
    print('DH Fourier identity: lhs', mp.nstr(lhs, 15), 'rhs', mp.nstr(rhs, 15))
    lhs = mp.quad(lambda u: phi_zeta_mp(u)*mp.cos(2*t*u), mp.linspace(0, 2, 9))*2
    xi = s*(s - 1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
    print('zeta: lhs', mp.nstr(lhs, 15), 'xi/8', mp.nstr(xi/8, 15))
    tw = twin_table(5, 13)
    print(len(tw), 'twins q<=13;', tw[0]['key'], [round(x/tw[0]['a1'], 9) for x in tw[0]['b']], 'kappa', KAPPA)
    for T in tw[:6]:
        bb = [mp.mpf(x) for x in T['b']]
        u = mp.mpf('0.25')
        r = phi_F_mp(u, bb, T['q'], T['delta'])/phi_F_mp(-u, bb, T['q'], T['delta'])
        print(T['key'], 'delta', T['delta'], 'Phi(u)/Phi(-u) =', mp.nstr(r, 12), '(expect omega = %d)' % T['omega'])


def twin_table_mp(prec_bits, qmin=5, qmax=49, only_plus=True):
    """route-44 twins with coefficients recomputed at prec_bits (exact phases from chars44; Gauss sum by mpmath).
    Returns list of dicts with 'b' as decimal strings.  Needed wherever exact evenness of Phi_F matters."""
    import chars44
    import mpmath as mp
    mp.mp.prec = prec_bits + 40
    out = []
    for q in range(qmin, qmax + 1):
        for ip, p in enumerate(chars44.complex_pairs(q)):
            ph = p['phase']                                   # Fractions (None where chi = 0)
            chi = [mp.mpc(0) if ph[n] is None else mp.expjpi(2*mp.mpf(ph[n].numerator)/ph[n].denominator) for n in range(q)]
            tau = mp.fsum(chi[n]*mp.expjpi(2*mp.mpf(n)/q) for n in range(q))
            eps = tau/((mp.mpc(0, 1))**p['delta']*mp.sqrt(q))
            th0 = -mp.arg(eps)/2
            for w, th in ((+1, th0), (-1, th0 + mp.pi/2)):
                if only_plus and w < 0: continue
                a = [(mp.expj(th)*c).real for c in chi]
                out.append({'key': 'q%d.%d.%s' % (q, ip, 'T+' if w > 0 else 'T-'), 'q': q, 'delta': p['delta'], 'omega': w,
                            'b': [mp.nstr(x, prec_bits//3) for x in a], 'abs_eps_minus_1': float(abs(abs(eps) - 1))})
    return out
