# H(a) test: F = sum f(n) n^-s, f(1)=1.  ell = Dirichlet-log coefficients of F, kappa = those of zeta.
# H(a):  a_n := kappa(n) - Re ell(n) >= 0 for all n >= 2   (then F F*/zeta^2 = exp(-2A), A = sum a_n n^-s).
# 30-digit mpmath. Planned memory: lists of N=3000 mpc numbers per control (< 5 MB).
import json, sys, random
from mpmath import mp, mpf, mpc, log, sqrt, exp, cos, sin, pi, zeta, findroot, cosh, binomial, re, im, fabs, nstr
mp.dps = 30
N = 3000
TOL = mpf(10)**(-24)
divs = [[] for _ in range(N+1)]
for d in range(2, N+1):
    for m in range(d, N+1, d): divs[m].append(d)
LOG = [mpf(0), mpf(0)] + [log(n) for n in range(2, N+1)]
spf = list(range(N+1))
for i in range(2, int(N**0.5)+1):
    if spf[i] == i:
        for j in range(i*i, N+1, i):
            if spf[j] == j: spf[j] = i
def ppow(n):  # (p,k) if n = p^k else None
    p = spf[n]; k = 0
    while n % p == 0: n //= p; k += 1
    return (p, k) if n == 1 else None
PP = [None, None] + [ppow(n) for n in range(2, N+1)]
kappa = [mpf(0)]*(N+1)
for n in range(2, N+1):
    if PP[n]: kappa[n] = mpf(1)/PP[n][1]
primes = [n for n in range(2, N+1) if spf[n] == n]

def dlog(f):
    """ell(n): log F = sum ell(n) n^-s.  f(n) log n = sum_{d|n, d>1} Lam(d) f(n/d)."""
    Lam = [mpc(0)]*(N+1)
    for n in range(2, N+1):
        s = f[n]*LOG[n]
        for d in divs[n]:
            if d < n: s -= Lam[d]*f[n//d]
        Lam[n] = s
    return [mpc(0), mpc(0)] + [Lam[n]/LOG[n] for n in range(2, N+1)]
def dexp(ell):
    f = [mpc(0)]*(N+1); f[1] = mpc(1)
    for n in range(2, N+1):
        s = mpc(0)
        for d in divs[n]: s += ell[d]*LOG[d]*f[n//d]
        f[n] = s/LOG[n]
    return f
def conv(f, g):
    h = [mpc(0)]*(N+1)
    for d in range(1, N+1):
        if g[d] == 0: continue
        for m in range(1, N//d+1): h[d*m] += g[d]*f[m]
    return h
ONE = [mpc(0)] + [mpc(1)]*N
def from_g(g):  # f = 1 * g, g dict
    G = [mpc(0)]*(N+1)
    for k, v in g.items():
        if k <= N: G[k] = mpc(v)
    return conv(ONE, G)
def cmult(val):  # completely multiplicative from values at primes
    f = [mpc(0)]*(N+1); f[1] = mpc(1)
    for n in range(2, N+1): f[n] = f[n//spf[n]]*val(spf[n])
    return f
def mult_defect(f):
    from math import gcd
    worst = mpf(0); arg = None
    for m in range(2, 60):
        for n in range(m+1, N//m+1):
            if gcd(m, n) == 1:
                d = abs(f[m*n]-f[m]*f[n])
                if d > worst: worst = d; arg = (m, n)
    return worst, arg

results = []
def report(name, f, mult_claim, note=""):
    ell = dlog(f)
    a = [mpf(0)]*(N+1)
    for n in range(2, N+1): a[n] = kappa[n] - ell[n].real
    neg = [n for n in range(2, N+1) if a[n] < -TOL]
    mx = max(abs(a[n]) for n in range(2, N+1))
    npp = max(abs(ell[n]) for n in range(2, N+1) if not PP[n])   # log mass off prime powers
    md, marg = mult_defect(f)
    # identity check at s = 12: F F*/zeta^2 vs exp(-2A)   (truncation ~ N^-10)
    s = mpf(12)
    Fv = sum(f[n]*mpf(n)**(-s) for n in range(1, N+1))
    lhs = (Fv*Fv.conjugate()).real/zeta(s)**2
    rhs = exp(-2*sum(a[n]*mpf(n)**(-s) for n in range(2, N+1)))
    first = neg[0] if neg else None
    r = dict(control=name, multiplicative_claimed=mult_claim, mult_defect=nstr(md, 8), mult_defect_at=marg,
             log_mass_off_prime_powers=nstr(npp, 8), max_abs_a=nstr(mx, 12), n_negative=len(neg), first_negative_n=first,
             a_at_first_negative=(nstr(a[first], 25) if first else None), min_a=nstr(min(a[2:]), 25),
             argmin=min(range(2, N+1), key=lambda n: a[n]), passes_Ha=(len(neg) == 0),
             identity_relerr_s12=nstr(abs(lhs-rhs)/abs(rhs), 5), note=note)
    results.append(r)
    print(json.dumps(r)); sys.stdout.flush()
    return ell, a

# ---------- 1. DH ----------
xi5 = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
per = [mpf(0), mpf(1), xi5, -xi5, mpf(-1)]
fDH = [mpc(0)] + [mpc(per[n % 5]) for n in range(1, N+1)]
ellDH, aDH = report("DH", fDH, False, "period 5 (1, xi, -xi, -1, 0); no pole at 1 (c = 0)")
print("DH ell(6) =", nstr(ellDH[6], 25), " f(6)-f(2)f(3) =", nstr(fDH[6]-fDH[2]*fDH[3], 25))
# ---------- 2. Lemma E exponential stages ----------
for N0 in (5, 6, 50, 1000):
    ellS = [ellDH[n] if n <= N0 else mpc(0) for n in range(N+1)]
    report("LemmaE DH exp-stage N0=%d" % N0, dexp(ellS), False, "exp(sum_{n<=N0} b_n n^-s), b_n = ell_DH(n)")
ellZ = [mpc(kappa[n]) if n <= 50 else mpc(0) for n in range(N+1)]
report("LemmaE zeta exp-stage N0=50", dexp(ellZ), True, "exp(sum_{n<=50} kappa(n) n^-s)")
# ---------- 3. HQ1..HQ4, G_q, T-NR ----------
def local_series(q, coeff, K=40):  # g(q^k) = coeff(k) q^(k/2)
    g = {1: 1}
    k = 1
    while q**k <= N:
        g[q**k] = coeff(k)*sqrt(mpf(q))**k; k += 1
    return g
def ratio_series(num, den, K=40):  # power series num/den in u
    c = []
    for k in range(K):
        v = (num[k] if k < len(num) else mpf(0)) - sum(den[j]*c[k-j] for j in range(1, min(k, len(den)-1)+1))
        c.append(v/den[0])
    return c
q = 2; eps = mpf(1)
report("HQ1 q=2 eps=1 (zeros on line)", from_g(local_series(q, lambda k: eps*k)), True, "zeta(1+eps u/(1-u)^2)")
eps = mpf(5)
report("HQ1 q=2 eps=5 (zeros off line)", from_g(local_series(q, lambda k: eps*k)), True)
q = 7; eps = mpf('0.2')
report("HQ2 q=7 eps=0.2", from_g(local_series(q, lambda k: eps*binomial(k+1, 3) if k >= 2 else 0)), True, "zeta(1+eps u^2/(1-u)^4)")
q = 5; A_, B_ = mpf('0.07'), mpf('0.31')
al = mpf(q)**A_+mpf(q)**(-A_); be = mpf(q)**B_+mpf(q)**(-B_)
c3 = ratio_series([1, -al, 1], [1, -be, 1]); c4 = ratio_series([1, al, 1], [1, -be, 1])
report("HQ3 (5;0.07,0.31)", from_g(local_series(q, lambda k: c3[k])), True, "zeta(1-alpha u+u^2)/(1-beta u+u^2)")
report("HQ4 (5;0.07,0.31)", from_g(local_series(q, lambda k: c4[k])), True, "zeta(1+alpha u+u^2)/(1-beta u+u^2)")
q = 5; epsF = mpf(q)**mpf('0.25')+mpf(q)**mpf('-0.25')+2
report("G_q q=5 (Prop F)", from_g(local_series(q, lambda k: epsF*k)), True, "HQ1 at eps=q^(1/4)+q^(-1/4)+2")
for cc in ('2.5', '-2.5'):
    cc_ = mpf(cc)
    report("T-NR q=2 c=%s, normalised by u" % cc, from_g({1: 1, 2: cc_*sqrt(2), 4: 2}), True, "zeta(1+c u+u^2), u=2^(1/2-s)")
# ---------- 4. sign chains, unimodular twists, DEL, THIN ----------
report("Liouville (alpha_p=-1)", cmult(lambda p: mpc(-1)), True, "c = 0")
random.seed(11)
sg = {p: random.choice((-1, 1)) for p in primes}
report("random sign chain", cmult(lambda p: mpc(sg[p])), True)
th = {p: mpf(random.random())*2*pi for p in primes}
report("random unimodular twist", cmult(lambda p: exp(mpc(0, th[p]))), True)
alpha = mpf('1.3')
report("n^(-i alpha), alpha=1.3", cmult(lambda p: exp(mpc(0, -alpha*log(p)))), True)
# greedy thin set, b = 0.9, rule: count+1 <= T(p), T(x) = li(x^b)-li(2^b)
from mpmath import li
b = mpf('0.9'); S = set(); cnt = 0
for p in primes:
    if cnt+1 <= li(mpf(p)**b)-li(mpf(2)**b): S.add(p); cnt += 1
print("THIN/DEL greedy S (b=0.9) below", N, ":", len(S), "primes; first", sorted(S)[:8])
report("THIN b=0.9 (alpha_p=-1 on S)", cmult(lambda p: mpc(-1 if p in S else 1)), True)
report("DEL b=0.9 (alpha_p=0 on S)", cmult(lambda p: mpc(0 if p in S else 1)), True)
report("contraction |alpha_p|=1/2 random phase", cmult(lambda p: exp(mpc(0, th[p]))/2), True, "completely multiplicative, not unimodular")
report("one parameter of modulus 1.2 at p=3", cmult(lambda p: mpc(0.6, 1.039230484541326) if p == 3 else mpc(1)), True, "alpha_3 = 1.2 e^{i pi/3}")
# ---------- 5. Theorem C product E_a and imaginary shift ----------
a_ = mpf('0.2')
fz1 = cmult(lambda p: mpc(mpf(p)**a_)); fz2 = cmult(lambda p: mpc(mpf(p)**(-a_)))
report("E_a = zeta(s+a)zeta(s-a), a=0.2", conv(fz1, fz2), True)
t_ = mpf('1.3')
fz1 = cmult(lambda p: exp(mpc(0, t_*log(p)))); fz2 = cmult(lambda p: exp(mpc(0, -t_*log(p))))
report("zeta(s+it)zeta(s-it), t=1.3", conv(fz1, fz2), True, "degree 2, unimodular local parameters")
# ---------- 6. non-multiplicative candidates with A >= 0 ----------
b = mpf('0.7')
report("P1 zeta(s)(1-6^(b-s)), b=0.7", from_g({1: 1, 6: -mpf(6)**b}), False)
g = {1: 1}; k = 1
from mpmath import factorial
while 6**k <= N: g[6**k] = mpf(-1)**k/factorial(k); k += 1
report("P2 zeta(s) exp(-6^-s)", from_g(g), False)
b = mpf('0.1')
g = {n: -mpf(n)**(b-1) for n in range(2, N+1)}; g[1] = 1
report("P3 zeta(s)(2-zeta(s+1-b)), b=0.1", from_g(g), False)
report("P4 zeta(s)(1+6^(b-s)), b=0.7 (sign reversed)", from_g({1: 1, 6: mpf(6)**mpf('0.7')}), False)
# P3 zeros
w0 = findroot(lambda w: zeta(w)-2, mpf('1.7'))
print("P3: real zero of 2-zeta(w): w0 =", nstr(w0, 28), " => real zero of F at", nstr(w0-(1-b), 28), "; c = 2-zeta(2-b) =", nstr(2-zeta(2-b), 28))
for guess in (mpc(1.0, 9.0), mpc(0.9, 14.0), mpc(1.2, 20.0), mpc(1.3, 5.0)):
    try:
        w1 = findroot(lambda w: zeta(w)-2, guess)
        print("P3: zero of 2-zeta(w) from guess", guess, ":", nstr(w1, 22), "|res| =", nstr(abs(zeta(w1)-2), 5), " => zero of F at", nstr(w1-(1-b), 22), "; zeta there:", nstr(abs(zeta(w1-(1-b))), 8))
    except Exception as e:
        print("P3 findroot failed", guess, e)
# P3 partial sums: S(x) = sum_d g(d) floor(x/d) at x = N
fP3 = from_g(g); c = 2-zeta(2-b); run = mpf(0); worst = mpf(0)
for n in range(1, N+1):
    run += fP3[n].real
    worst = max(worst, abs(run-c*n)/mpf(n)**b)
print("P3: max_n |S(n)-c n| / n^b, n<=%d:" % N, nstr(worst, 10))
# ---------- 7. general frequencies: NR-q and a Beurling member (local computation in u) ----------
def neg_log_series(poly, K):  # coefficients of -log(poly(u)), poly[0]=1
    # (log P)' = P'/P
    c = [mpc(0)]*(K+1)
    for k in range(1, K+1):
        v = k*(poly[k] if k < len(poly) else 0)
        for j in range(1, k):
            if k-j < len(poly): v -= j*c[j]*poly[k-j]
        c[k] = mpc(v)/k
    return [-x for x in c]
qq = 1+sqrt(mpf(2))
for cc in ('2.1', '-2.1'):
    co = neg_log_series([1, mpf(cc), 1], 30)
    a_k = [co[k].real*qq**(mpf(k)/2) for k in range(1, 31)]   # coefficient of q^(-ks) in A
    neg = [k+1 for k, v in enumerate(a_k) if v < -TOL]
    r = dict(control="NR-q q=1+sqrt2 c=%s, normalised by u" % cc, multiplicative_claimed="generalised (frequencies log n + j log q)",
             passes_Ha=(len(neg) == 0), first_negative_k=(neg[0] if neg else None), a_k1=nstr(a_k[0], 25), a_k2=nstr(a_k[1], 25),
             max_abs_a=nstr(max(abs(v) for v in a_k), 12), n_negative=len(neg))
    results.append(r); print(json.dumps(r))
# Beurling member: generalised primes = rational primes with 3 replaced by pi; chi unimodular on generalised primes
random.seed(5)
gp = [mpf(p) for p in primes[:200] if p != 3] + [pi]
ph = [mpf(random.random())*2*pi for _ in gp]
K = 12
a_rel_B = []; a_rel_Z = []
for P, t in zip(gp, ph):
    for k in range(1, K+1):
        v = (1-cos(k*t))/k
        a_rel_B.append(v)
        a_rel_Z.append(((P, k), -cos(k*t)/k if P == pi else v))   # zeta has no atom at pi^k
for k in range(1, K+1): a_rel_Z.append(((mpf(3), k), mpf(1)/k))    # zeta's atoms at 3^k, absent from F
negZ = [(nstr(x[0][0], 8), x[0][1], nstr(x[1], 20)) for x in a_rel_Z if x[1] < -TOL]
r = dict(control="Beurling member (3 -> pi), unimodular parameters", multiplicative_claimed="yes over its own semigroup",
         passes_Ha_rel_zetaB=(min(a_rel_B) >= -TOL), min_a_rel_zetaB=nstr(min(a_rel_B), 20), max_a_rel_zetaB=nstr(max(a_rel_B), 20),
         passes_Ha_rel_zeta=(len(negZ) == 0), negatives_rel_zeta=negZ[:4], n_negative_rel_zeta=len(negZ))
results.append(r); print(json.dumps(r))
# ---------- 8. search: non-multiplicative f with |f(n)| = 1 for all n and A >= 0 ----------
def search(force, label):
    f = [mpf(0)]*(N+1); f[1] = mpf(1); Lam = [mpf(0)]*(N+1); stuck = None; nflip = 0
    for n in range(2, N+1):
        cn = mpf(0)
        for d in divs[n]:
            if d < n: cn += Lam[d]*f[n//d]
        cn /= LOG[n]                      # ell(n) = f(n) - cn ; need f(n) - cn <= kappa(n)
        if n in force: v = mpf(force[n])
        elif 1-cn <= kappa[n]+TOL: v = mpf(1)
        else: v = mpf(-1)
        if v-cn > kappa[n]+TOL: stuck = (n, nstr(cn, 15)); break
        if v == -1: nflip += 1
        f[n] = v; Lam[n] = (v-cn)*LOG[n]
    return f, stuck, nflip
for force, label in (({6: -1}, "force f(6)=-1"), ({6: -1, 10: -1, 15: -1}, "force f(6)=f(10)=f(15)=-1"), ({30: -1}, "force f(30)=-1")):
    f, stuck, nflip = search(force, label)
    print("search", label, ": stuck at", stuck, "; values -1 chosen:", nflip)
    if not stuck:
        fc = [mpc(x) for x in f]
        report("SEARCH +-1 greedy, " + label, fc, False, "|f(n)|=1 for all n<=N; f=+1 unless H(a) forces -1")
        run = mpf(0); tr = []
        for n in range(1, N+1):
            run += f[n]
            if n in (100, 300, 1000, 3000): tr.append((n, nstr(run/n, 8)))
        print("   partial sums S(n)/n:", tr, " f on 2..40:", [int(x) for x in f[2:41]])
json.dump(results, open("ha_test.json", "w"), indent=1)
