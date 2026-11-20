# c15-edge-argument-strip-width-hecke-amplified: checks P1-P3 (mpmath, 25 digits; no large allocation: all arrays < 1 MB)
import json, sys, os
import mpmath as mp
mp.mp.dps = 25
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'checks.json')
res = {}
def xi(s): return mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def tau(nu, n):
    return sum((mp.mpf(a)/(n//a))**nu for a in range(1, n+1) if n % a == 0)
zeros = [mp.zetazero(k).imag for k in range(1, 6)]
glx, glw = zip(*[(x, w) for x, w in mp.calculus.quadrature.GaussLegendre(mp.mp).calc_nodes(4, 25)])  # 48 nodes on [-1,1]
def gl(f, a, b):
    h = (b-a)/2; m = (a+b)/2
    return h*sum(w*f(m+h*x) for x, w in zip(glx, glw))
def Kint(nu, n, t0):
    # I_n = int_{2 pi n}^inf |K_nu(u)|^2 du/u
    f = lambda u: abs(mp.besselk(nu, u))**2/u
    a = 2*mp.pi*n
    pts = [a]; step = 1
    while pts[-1] < t0 + 40: pts.append(pts[-1]+step)
    return sum(gl(f, pts[i], pts[i+1]) for i in range(len(pts)-1))
def fourier_terms(nu, t0):
    nmax = int((t0+45)/(2*mp.pi*0.86)) + 1
    return [(n, tau(nu, n)) for n in range(1, nmax+1)]
def fval(x, y, A, B, s, nu, terms):
    v = A*y**s + B*y**(1-s)
    for n, tn in terms:
        v += 4*mp.sqrt(y)*tn*mp.besselk(nu, 2*mp.pi*n*y)*mp.cos(2*mp.pi*n*x)
    return v
def slack(A, B, s, nu, terms):
    # integral of |f|^2 dx dy / y^2 over F with y < 1 : x in [-1/2,1/2], sqrt(1-x^2) <= y <= 1
    def inner(x):
        y0 = mp.sqrt(1-x*x)
        return gl(lambda y: abs(fval(x, y, A, B, s, nu, terms))**2/y**2, y0, 1)
    return 2*gl(inner, 0, mp.mpf(1)/2)
def case(gamma, delta, do_slack):
    s = (1-delta+1j*gamma)/2; nu = s - mp.mpf(1)/2; t0 = gamma/2
    A = xi(2*s); B = xi(2-2*s)   # xi(2s-1) = xi(2-2s) by the functional equation
    terms = fourier_terms(nu, t0)
    In = {n: Kint(nu, n, t0) for n, _ in terms if 2*mp.pi*n < t0+40}
    L = 8*sum(abs(tn)**2*In[n] for n, tn in terms if n in In)
    Mgen = (abs(B)**2-abs(A)**2)/delta + (A*mp.conj(B)).imag/t0   # Maass-Selberg at T = 1
    Mhyp = abs(B)**2/delta
    sc = mp.exp(mp.pi*gamma/2)
    d = dict(gamma=float(gamma), delta=float(delta), absA=float(abs(A)*mp.sqrt(sc)), absB=float(abs(B)*mp.sqrt(sc)),
             L=float(L*sc), M_gen=float(Mgen*sc), M_hyp=float(Mhyp*sc), n1_term=float(8*In[1]*sc),
             zeta_1pd=float(abs(mp.zeta(1+delta+1j*gamma))), nterms=len(terms))
    if do_slack:
        S = slack(A, B, s, nu, terms)
        d['slack'] = float(S*sc); d['identity_defect'] = float(abs(L+S-Mgen)/abs(Mgen))
    return d
P1 = []
for k, g in enumerate(zeros):
    d = case(g, mp.mpf(1)/2, True); d['zero'] = k+1; P1.append(d); print('P1', d, flush=True)
res['P1_actual_zeros_delta_half'] = P1
P2 = []
for k, g in enumerate(zeros):
    for dl in ['0.3', '0.1', '0.03']:
        d = case(g, mp.mpf(dl), (k == 0)); d['zero'] = k+1; P2.append(d); print('P2', d, flush=True)
res['P2_hypothetical_delta'] = P2
# P3: amplifier Gram for T >= N (exact): K(m,n) = sum_{ad=m} sum_{a'd'=n} (a/d)^mu0 conj((a'/d')^mu0) min(d/a, d'/a')^delta
def Kmat(gamma, delta, N):
    mu0 = delta/2 - 1j*gamma/2
    rows = []
    for m in range(1, N+1):
        rows.append([(mp.mpf(a)/(m//a), (mp.mpf(a)/(m//a))**mu0) for a in range(1, m+1) if m % a == 0])
    K = mp.matrix(N, N); lam = mp.matrix(N, 1)
    for i in range(N):
        lam[i] = sum(c for _, c in rows[i])
        for j in range(N):
            K[i, j] = sum(c*mp.conj(c2)*min(1/r, 1/r2)**delta for r, c in rows[i] for r2, c2 in rows[j])
    return K, lam
P3 = []
for k, g in enumerate(zeros):
    for dl in ['0.5', '0.1', '0.03']:
        for N in [8, 32]:
            delta = mp.mpf(dl)
            K, lam = Kmat(g, delta, N)
            # ||sum x_m T_m Lambda^T f||^2 = M(T) x^T K conj(x) ; |lambda_x|^2 = |sum x_m lam_m|^2
            # max gain G = sup |lambda_x|^2 / (x^T K conj x) = lam^T K^{-1} conj(lam) (K Hermitian positive)
            Kreg = K + mp.eye(N)*mp.mpf(10)**(-18)
            sol = mp.lu_solve(Kreg, lam)
            G = sum(mp.conj(lam[i])*sol[i] for i in range(N))
            mineig = min(mp.eigh(K, eigvals_only=True))
            d = dict(zero=k+1, delta=float(delta), N=N, max_gain=float(G.real), gain_imag=float(abs(G.imag)), N_pow_delta=float(mp.mpf(N)**delta),
                     ratio=float(G.real/mp.mpf(N)**delta), min_eig_K=float(mineig),
                     herm_defect=float(max(abs(K[i, j]-mp.conj(K[j, i])) for i in range(N) for j in range(N))))
            P3.append(d); print('P3', d, flush=True)
res['P3_amplifier_T_ge_N'] = P3
json.dump(res, open(OUT, 'w'), indent=1)
print('written', OUT)
