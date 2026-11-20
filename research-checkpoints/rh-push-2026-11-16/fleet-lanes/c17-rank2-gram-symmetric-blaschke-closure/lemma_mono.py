# Lemma M (monotonicity in T): d/d tau_2 K_T(lam,mu) = sum_{j,k=1..3} a_j(lam) conj(a_k(mu)) K1_{tau_1 - tau_2/2}(nu_j(lam), nu_k(mu)),
# K1_t(a,b) = e^{(a+b*)t}/(a+b*) + M(a) e^{(-a+b*)t}/(-a+b*) + M(b)* e^{(a-b*)t}/(a-b*) - M(a) M(b)* e^{-(a+b*)t}/(a+b*)   (rank-one kernel),
# nu_j = z1, z1+z2, z2 ; a_j = c(w_j, lam) e^{(nu_2^{(j)} + nu_j/2) tau_2}, coset representatives e, s2, s2s1.
# Check 1: identity (analytic derivative of the 36-term formula against the 9-term rank-one combination).
# Check 2: certified inertia of the derivative Gram matrix and of K_T - K_0 (ball LDL).
import random, json, sys
from flint import acb, arb, ctx
import k2
random.seed(5)
ctx.prec = 300
def K1(a, b, t, M):
    bc = b.conjugate(); Ma = M(a); Mb = M(b).conjugate()
    return ((a+bc)*t).exp()/(a+bc) + Ma*((-a+bc)*t).exp()/(-a+bc) + Mb*((a-bc)*t).exp()/(a-bc) - Ma*Mb*(-(a+bc)*t).exp()/(a+bc)
def dK_formula(lam, mu, tau, M, which):
    oi = k2.orbit(lam, M, tau); oj = k2.orbit(mu, M, tau)
    s = acb(0)
    for (a, b, c) in oi:
        for (a2, b2, c2) in oj:
            den = (a+a2.conjugate()) if which == 2 else (b+b2.conjugate())
            s += c*c2.conjugate()/den
    return s
def reps(lam, M, tau2):
    z1, z2 = lam
    m2, m12 = M(z2), M(z1+z2)
    # (nu_1, nu_2, c) for e, s2, s2s1
    L = [(z1, z2, acb(1)), (z1+z2, -z2, m2), (z2, -z1-z2, m12*M(z1))]
    return [(n1, c*((n2+n1/2)*tau2).exp()) for (n1, n2, c) in L]
def dK_rank1(lam, mu, tau, M):
    t = tau[0]-tau[1]/2
    s = acb(0)
    for (n1, a) in reps(lam, M, tau[1]):
        for (m1, b) in reps(mu, M, tau[1]):
            s += a*b.conjugate()*K1(n1, m1, t, M)
    return s
def rnd(): return (acb(random.uniform(0.05, 1.5), random.uniform(-6, 6)), acb(random.uniform(0.05, 1.5), random.uniform(-6, 6)))
out = {'identity': [], 'inertia': []}
quart = [complex(0.2, 3), complex(0.2, -3), complex(0.8, 3), complex(0.8, -3)]
for name, zs in (('zeta', []), ('sym(0.3,3)', quart), ('left(0.2+3i)', quart[:2])):
    M = k2.make_M(k2.M_zeta, zs)
    for T in ((0, 0), (0.4, 1.1), (2, 0)):
        tau = k2.tau_of(T)
        lam, mu = rnd(), rnd()
        a = dK_formula(lam, mu, tau, M, 2); b = dK_rank1(lam, mu, tau, M)
        d = float(abs(a-b).mid())/float(abs(a).mid())
        out['identity'].append(dict(case=name, T=T, rel_defect=d)); print(name, T, 'identity rel defect', d)
        # derivative Gram, n = 8, certified
        pts = [rnd() for _ in range(8)]
        n = len(pts)
        for which in (2, 1):
            G = [[dK_formula(pts[i], pts[j], tau, M, which) for j in range(n)] for i in range(n)]
            for i in range(n):
                G[i][i] = acb(G[i][i].real)
                for j in range(i): G[i][j] = G[j][i].conjugate()
            st = k2.ldl_inertia(G)
            out['inertia'].append(dict(case=name, T=T, d_tau=which, status=st[0], npos=st[1], nneg=st[2]))
            print(name, T, 'd/dtau_%d Gram inertia' % which, st[:3])
        if T != (0, 0):
            GT = k2.gram(pts, M, T); G0 = k2.gram(pts, M, (0, 0))
            D = [[GT[i][j]-G0[i][j] for j in range(n)] for i in range(n)]
            st = k2.ldl_inertia(D)
            out['inertia'].append(dict(case=name, T=T, d_tau='K_T-K_0', status=st[0], npos=st[1], nneg=st[2]))
            print(name, T, 'K_T - K_0 inertia', st[:3])
json.dump(out, open('lemma_mono.json', 'w'), indent=1)
