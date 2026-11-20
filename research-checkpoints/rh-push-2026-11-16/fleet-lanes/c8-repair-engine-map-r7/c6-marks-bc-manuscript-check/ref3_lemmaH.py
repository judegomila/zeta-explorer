# Third-referee check of Lemma H (MS Lemma 7.1, j = 0): P_p summed directly from the series (7.10) with C_p from (7.8)
# and the lift formula for g_{chi^r}(p^t, p^{j'}) (MS text before (7.7)); not from table (7.16) and not from (7.11).
# Free unit phases: eta(p), a_p (through alpha), rho (sixth root of unity), G_1 phase; omega = +-1;
# constraints used: gamma_1 = Q^{-1/2} G_1, G_1 G_5 = omega Q, gamma_3^2 = omega.  G_2, G_3(sign), G_4 are free and must not matter for j = 0.
# Planned memory: negligible (triple loop of < 4e4 terms per point).
import cmath, math, random
random.seed(20261118)
def unit(): return cmath.exp(2j*math.pi*random.random())
def lift(r, t, jp, Q, G):                      # g_{chi^r}(p^t, p^{jp}), t >= 1, jp >= 0
    if r % 6: return Q**(t-1)*G[r % 6]*(1 if jp == t-1 else 0)
    return Q**t*(1 if jp >= t else 0) - Q**(t-1)*(1 if jp >= t-1 else 0)
def C(t, k, jp, Q, G, om):
    if t == 0 and k == 0: return 1
    if t == 0: return 1 if jp == 0 else 0
    if k == 0: return lift(t, t, jp, Q, G)
    if k == 1 and jp >= 1: return (1/om)*G[1]*lift(t-1, t, jp-1, Q, G)
    return 0
worst = 0; worstH = 0
for Q in (4, 7, 13, 31):
    for trial in range(6):
        x = complex(random.uniform(0.9, 1.3), random.uniform(-3, 3)); w = complex(random.uniform(0.95, 1.2), random.uniform(-3, 3))
        z = complex(random.uniform(0.25, 0.4), random.uniform(-1, 1))
        eta, ap, om = unit(), unit(), random.choice((1, -1)); rho = cmath.exp(2j*math.pi*random.randrange(6)/6)
        g3 = cmath.sqrt(om)*random.choice((1, -1))
        G = {1: math.sqrt(Q)*unit()}; G[5] = om*Q/G[1]; G[3] = math.sqrt(Q)*g3; G[2] = math.sqrt(Q)*unit(); G[4] = math.sqrt(Q)*unit()
        g1 = G[1]/math.sqrt(Q)
        P = 0; Pstar = 0
        for e0 in (0, 1):
            for l in range(0, 40):
                t = e0 + 3*l
                for k in range(0, 60 if t == 0 else 2):
                    for m in range(0, 60):
                        c = C(t, k, 6*m, Q, G, om)           # j = 0: j' = 6m
                        if c == 0: continue
                        term = ((-1)**e0)*(g1**(-e0))*(eta**e0)*((ap*g3)**l)*(rho**(k-t))*(om**((t*k - e0*l - l*(l-1)//2) % 2))*c \
                               * Q**(-(x+0.5)*e0 - (1+3*x)*l - w*k - 6*z*m)
                        P += term
                        if t > 0: Pstar += term
        V = Q**(-6*z); R = ap**2*Q**(4-6*x-6*z); Wl = rho*Q**(-w); q = 1/Q
        Ps711 = (1/(1-R))*((R*(1-q) - eta*(Q-1)*Q**(-x-w)*V)/(1-V) + (-eta/rho*Q**(-x) + Wl*R))
        P711 = 1/(1-V) + Wl/(1-Wl) + Ps711
        worst = max(worst, abs(P - P711)/abs(P711), abs(Pstar - Ps711)/abs(Ps711))
print('series (7.10)+(7.8) against (7.11), j = 0, 24 random points (rho any sixth root, omega = +-1): max relative difference %.2e' % worst)
# closed form of Lemma H at (w, z) = (1, 1/6), rho = 1, directly from the truncated series
for Q in (4, 7, 13):
    for trial in range(4):
        s = complex(random.uniform(0.75, 1.1), random.uniform(-4, 4)); eta, ap, om = unit(), unit(), random.choice((1, -1))
        g3 = cmath.sqrt(om); G = {1: math.sqrt(Q)*unit()}; G[5] = om*Q/G[1]; G[3] = math.sqrt(Q)*g3; G[2] = G[4] = 0
        g1 = G[1]/math.sqrt(Q); P = 0
        for e0 in (0, 1):
            for l in range(0, 44):
                t = e0 + 3*l
                for k in range(0, 70 if t == 0 else 2):
                    for m in range(0, 70):
                        c = C(t, k, 6*m, Q, G, om)
                        if c == 0: continue
                        P += ((-1)**e0)*(g1**(-e0))*(eta**e0)*((ap*g3)**l)*(om**((t*k - e0*l - l*(l-1)//2) % 2))*c*Q**(-(s+0.5)*e0 - (1+3*s)*l - k - m)
        q = 1/Q; D = eta*Q**(-s); R = ap**2*Q**(3-6*s)
        H = P*(1-q)*(1-q)/(1-D); closed = (1-q*q)*(1 - D*(1-q) - R*q)/((1-R)*(1-D))
        worstH = max(worstH, abs(H-closed)/abs(closed))
print('H_p(u = 1; w = 1, z = 1/6) from the series against (1-q^2)(1 - D(1-q) - Rq)/((1-R)(1-D)), 12 points, Re s in (0.75, 1.1): max relative difference %.2e' % worstH)
# Liouville twist: H_lambda(1) != 0. Local factor at s = 1 with eta(p) = -1: D = -1/Q, R = a^2 Q^-3.
mn = 1
for Q in (4, 7, 13, 19, 25, 31, 37):
    lo = min(abs((1-1/Q**2)*(1 + (1/Q)*(1-1/Q) - cmath.exp(1j*th)*Q**-4)/((1-cmath.exp(1j*th)*Q**-3)*(1+1/Q))) for th in [k*0.01 for k in range(629)])
    mn = min(mn, lo)
print('local factor of H_lambda at s = 1: |H_p| >= %.4f over Q in {4,..,37} and all phases of a_p^2; H_p = 1 + O(Q^-2), product absolutely convergent' % mn)
