# Second referee, Theorem A / Corollary A2 / Theorem C of c20-euler-shape-rigidity: tests on the controls.
# mpmath 30 digits for point values; numpy float64 only for long Bohr means (labelled). Written from RESULT.md only.
import json, math, os, sys
import mpmath as mp
import numpy as np
mp.mp.dps = 30
HERE = os.path.dirname(os.path.abspath(__file__))
out = {}
def nstr(x, n=12): return mp.nstr(x, n)

def is_prime(n):
    if n < 2: return False
    if n % 2 == 0: return n == 2
    i = 3
    while i*i <= n:
        if n % i == 0: return False
        i += 2
    return True
def sieve(N):
    s = bytearray([1])*(N+1); s[0] = s[1] = 0
    for i in range(2, int(N**0.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(N+1) if s[i]]
def nextprime(n):
    n += 1
    while not is_prime(n): n += 1
    return n

# ---------------- E_a ----------------
a = mp.mpf(1)/4
def gam(s): return mp.pi**(-s/2)*mp.gamma(s/2)
E = {}
for s0 in (mp.mpc('0.5', '5'), mp.mpc('0.8', '11.3'), mp.mpc('0.5', '20')):
    m1 = mp.zeta(s0+a)*mp.zeta(s0-a)/mp.zeta(s0); m2 = mp.zeta(1-s0+a)*mp.zeta(1-s0-a)/mp.zeta(1-s0)
    # E_a's own functional equation (degree 2): gam(s+a)gam(s-a)E_a(s) symmetric
    own = gam(s0+a)*gam(s0-a)*mp.zeta(s0+a)*mp.zeta(s0-a) - gam(1-s0+a)*gam(1-s0-a)*mp.zeta(1-s0+a)*mp.zeta(1-s0-a)
    E[str(s0)] = {'|m(s)|': nstr(abs(m1)), '|m(s)-m(1-s)| (zeta FE defect)': nstr(abs(m1-m2)), 'own FE defect': nstr(abs(own), 5)}
out['E_a a=1/4: not zero; zeta FE fails; own FE holds'] = E
pr = sieve(10**6)
rows = {}
for X in (10**3, 10**4, 10**5, 10**6):
    ps = [p for p in pr if p <= X]
    rows[str(X)] = {sg: float(sum(abs(1 - p**0.25 - p**-0.25)*p**-sg for p in ps)) for sg in (0.5, 1.0, 1.25, 1.3)}
out['E_a: partial sums of |c(p)| p^-sigma, c(p) = 1 - p^a - p^-a (abscissa of the relative product is 1 + a = 1.25, not 1)'] = rows

# ---------------- HQ1..HQ4: palindromic one-prime factors ----------------
def hq_members(q):
    v = mp.log(q); cq = mp.mpf(q)**0.25 + mp.mpf(q)**-0.25
    al, be = 2*mp.cosh(mp.mpf('0.1')*v), 2*mp.cosh(mp.mpf('0.2')*v)
    return {'HQ1 eps=1': ([1, -1, 1], [1, -2, 1]),
            'HQ1 eps=c_q+2': ([1, cq, 1], [1, -2, 1]),
            'HQ1 eps=6': ([1, 4, 1], [1, -2, 1]),
            'HQ2 eps=1e-2': ([1, -4, mp.mpf('6.01'), -4, 1], [1, -4, 6, -4, 1]),
            'HQ3 (0.1,0.2)': ([1, -al, 1], [1, -be, 1]),
            'HQ4 (0.1,0.2)': ([1, al, 1], [1, -be, 1])}
def pv(c, u): return sum(ck*u**k for k, ck in enumerate(c))
H = {}
for q in (2, 5):
    for nm, (num, den) in hq_members(q).items():
        s0 = mp.mpc('0.3', '7.1')
        u1 = mp.mpf(q)**(mp.mpf(1)/2 - s0); u2 = mp.mpf(q)**(s0 - mp.mpf(1)/2)
        m1 = pv(num, u1)/pv(den, u1); m2 = pv(num, u2)/pv(den, u2)
        rn = [complex(r) for r in np.roots([complex(x) for x in num[::-1]])]; rd = [complex(r) for r in np.roots([complex(x) for x in den[::-1]])]  # float64 roots (multiple roots at u = 1)
        # Dirichlet coefficients of m and of N = 1/m at q^k, weighted by q^(-k/2) = Taylor coefficients in u
        K = 120
        def ser(nu, de):
            c = []
            for k in range(K+1):
                sv = nu[k] if k < len(nu) else mp.mpf(0)
                for i in range(1, min(k, len(de)-1)+1): sv -= de[i]*c[k-i]
                c.append(sv)
            return c
        cm = ser(num, den); cN = ser(den, num)
        H[f'q={q} {nm}'] = {'|m(s)| at 0.3+7.1i': nstr(abs(m1)), 'FE defect |m(s)-m(1-s)|': nstr(abs(m1-m2), 5),
            'min |root| num (pole of N)': float(min(abs(r) for r in rn)), 'min |root| den (pole of m)': float(min(abs(r) for r in rd)),
            'root set of num closed under u -> 1/u: max_i min_j |r_i r_j - 1| (float64)': float(max(min(abs(r1*r2 - 1) for r2 in rn) for r1 in rn)),
            'sum_{k<=60} |c_m| , sum_{k<=120} |c_m|': [nstr(sum(abs(x) for x in cm[1:61]), 8), nstr(sum(abs(x) for x in cm[1:]), 8)],
            'sum_{k<=60} |c_N| , sum_{k<=120} |c_N|': [nstr(sum(abs(x) for x in cN[1:61]), 8), nstr(sum(abs(x) for x in cN[1:]), 8)]}
out['HQ members: FE exact, object not zero, (H) fails for N and for m (root in the closed unit disc of both)'] = H

# ---------------- sparse DEL / THIN: Corollary A2 ----------------
S1 = [nextprime(10**j) for j in range(1, 13)]                 # the lane's set
S2 = [nextprime(j**6) for j in range(2, 32)]                  # referee's set (30 primes), sum p^-1/2 ~ sum j^-3
def Nline(S, alpha, t):
    v = mp.mpf(1)
    for p in S:
        y = mp.mpf(p)**-0.5*mp.expjpi(-t*mp.log(p)/mp.pi)
        v *= (1 - alpha*y)/(1 - y)
    return v
A2 = {}
for nm, S in (('S1 lane', S1), ('S2 referee', S2)):
    lp = np.array([math.log(p) for p in S]); rp = np.array([p**-0.5 for p in S])
    tail = float(sum(mp.mpf(j)**-3 for j in range(32, 100000))) if nm.startswith('S2') else 4.7e-7
    for cn, alpha in (('DEL alpha=0', 0.0), ('THIN alpha=-1', -1.0), ('alpha=i', 1j)):
        # float64 screen over [0, 4e4] step 0.01, then 30-digit values at the grid maximiser
        best = (0.0, 0.0); T = 40000.0; dt = 0.01; acc = {}
        pmin = S[0]; n2 = S[0]*S[1]
        mean_p = 0j; mean_n2 = 0j; mean_neg = 0j; cnt = 0
        for k0 in range(0, int(T/dt), 200000):
            t = (np.arange(k0, min(k0+200000, int(T/dt))) + 0.5)*dt
            Np = np.ones_like(t, dtype=complex); Nm = np.ones_like(t, dtype=complex)
            for l, r in zip(lp, rp):
                y = r*np.exp(-1j*t*l); Np *= (1-alpha*y)/(1-y); Nm *= (1-alpha*np.conj(y))/(1-np.conj(y))
            D = np.abs(Np - Nm); i = int(np.argmax(D))
            if D[i] > best[0]: best = (float(D[i]), float(t[i]))
            mean_p += np.sum(Np*np.exp(1j*t*math.log(pmin))); mean_n2 += np.sum(Np*np.exp(1j*t*math.log(n2)))
            mean_neg += np.sum(Np*np.exp(-1j*t*math.log(pmin))); cnt += len(t)
        tb = mp.mpf(best[1])
        Dmp = abs(Nline(S, mp.mpc(alpha), tb) - Nline(S, mp.mpc(alpha), -tb))
        A2[f'{nm} {cn}'] = {'p_min': pmin, 'sum p^-1/2': float(sum(rp)),
            'A2 lower bound |1-alpha| p_min^-1/2': nstr(abs(1-mp.mpc(alpha))*mp.mpf(pmin)**-0.5),
            '|D(t*)| at 30 digits (t* = float64 grid maximiser)': nstr(Dmp, 20), 't*': best[1],
            'N(1/2+it*) (not zero)': nstr(abs(Nline(S, mp.mpc(alpha), tb)), 15),
            'float64 Bohr mean N n^{it}, n=p_min, T=4e4': [float((mean_p/cnt).real), float((mean_p/cnt).imag)],
            'predicted c(p_min) p_min^-1/2': [float(((1-alpha)*pmin**-0.5).real), float(((1-alpha)*pmin**-0.5).imag)],
            'float64 Bohr mean, n=p1*p2': [float((mean_n2/cnt).real), float((mean_n2/cnt).imag)],
            'predicted c(p1 p2) (p1 p2)^-1/2': [float(((1-alpha)**2*n2**-0.5).real), float(((1-alpha)**2*n2**-0.5).imag)],
            '|float64 Bohr mean N n^{-it}|, n=p_min (predicted 0)': float(abs(mean_neg/cnt)),
            'bound on tail effect (primes of the infinite set not included)': tail*2*abs(1-alpha)*3.5*5}
out['Corollary A2 on sparse DEL / THIN'] = A2

# ---------------- map DEL / THIN (b in (1/2,1)): hypothesis (H) fails; object not zero ----------------
b = 0.75
prm = sieve(2*10**6)
Lval = 0.0; prev = 2.0; c = 0; S = []; Sthin = []; cth = 0
def seg(x0, x1, n=8):
    h = (x1-x0)/n; return sum(((x0+(i+.5)*h)**(b-1))/math.log(x0+(i+.5)*h) for i in range(n))*h
for p in prm[1:]:
    Lval += seg(prev, float(p)); prev = float(p)
    if math.floor(Lval) > c: c += 1; S.append(p)
    if math.floor(Lval/2) > cth: cth += 1; Sthin.append(p)
rowsD = {}
for X in (10**3, 10**4, 10**5, 10**6, 2*10**6):
    rowsD[str(X)] = {'pi_S(X) DEL': sum(1 for p in S if p <= X), 'X^b/(b log X)': X**b/(b*math.log(X)),
                     'sum_{p in S, p<=X} p^-1/2': sum(p**-0.5 for p in S if p <= X),
                     'sum p^-0.8 (sigma > b: converges)': sum(p**-0.8 for p in S if p <= X)}
s2 = mp.mpf(2)
Ndel = mp.fprod(1/(1 - mp.mpf(p)**-s2) for p in S); Nthin = mp.fprod((1 + mp.mpf(p)**-s2)/(1 - mp.mpf(p)**-s2) for p in Sthin)
out['map DEL/THIN b=0.75 (greedy floor rule), first members'] = {'S_DEL[:12]': S[:12], 'S_THIN[:12]': Sthin[:12], 'rows': rowsD,
    'N_DEL(2) over p<=2e6 (not 1, not 0)': nstr(Ndel, 20), 'N_THIN(2)': nstr(Nthin, 20)}

# ---------------- Theorem A first form, direct: bounded entire => check Liouville input numerically -------------
# Take the non-product D(s) = 1 + c1 3^-s + c2 7^-s (Lemma A0, no Euler product): sup_t |D(1/2+it)-D(1/2-it)| = exact formula.
c1, c2 = mp.mpf('0.3'), mp.mpc('0.2', '0.1')
ts = [mp.mpf(k)/50 for k in range(0, 20000)]
sup = max(abs((c1*3**-0.5*(mp.expj(-t*mp.log(3)) - mp.expj(t*mp.log(3))) + c2*7**-0.5*(mp.expj(-t*mp.log(7)) - mp.expj(t*mp.log(7))))) for t in ts)
out['Lemma A0 on a non-product (1 + 0.3*3^-s + (0.2+0.1i)*7^-s)'] = {'sup |D(1/2+it)-D(1/2-it)| on grid': nstr(sup, 12),
    'A2 bounds |c(3)|/sqrt3, |c(7)|/sqrt7': [nstr(abs(c1)/mp.sqrt(3)), nstr(abs(c2)/mp.sqrt(7))]}

# ---------------- Theorem C (c): local factor bound for |alpha_p| <= p^(1/2) ----------------
rowsC = []
for sg in (0.51, 0.6, 0.75):
    worst = 0
    for p in (2, 3, 5, 101, 10007):
        r = mp.mpf(p)**-sg
        for alpha in (mp.sqrt(p), -mp.sqrt(p), mp.sqrt(p)*mp.expj(1), 0.5*mp.sqrt(p)):
            sup_ = max(abs((1 - r*mp.expj(th))/(1 - alpha*r*mp.expj(th)) - 1) for th in mp.linspace(0, 2*mp.pi, 721))
            bound = abs(alpha - 1)*r/(1 - mp.mpf(2)**(0.5 - sg))
            worst = max(worst, sup_/bound)
    rowsC.append({'sigma': sg, 'max over samples of sup|m_p - 1| / (|alpha-1| p^-sigma / (1 - 2^(1/2-sigma)))': nstr(worst, 8)})
out['Theorem C (c): summability transfers from N to m when |alpha_p| <= p^(1/2)'] = rowsC

json.dump(out, open(os.path.join(HERE, 'thmA_ref2.json'), 'w'), indent=1, default=str)
print(json.dumps(out, indent=1, default=str))
