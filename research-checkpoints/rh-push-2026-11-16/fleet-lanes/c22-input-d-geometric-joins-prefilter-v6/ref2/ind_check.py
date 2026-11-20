# Independent referee checks. Planned memory: 5 lists of 300001 python ints/complex (< 40 MB).
import math, cmath
import mpmath as mp
mp.mp.dps = 30
N = 300000
print("planned allocation: 5 lists of", N+1, "< 40 MB")
spf = list(range(N+1))
for i in range(2, int(N**0.5)+1):
    if spf[i] == i:
        for j in range(i*i, N+1, i):
            if spf[j] == j: spf[j] = i
primes = [p for p in range(2, N+1) if spf[p] == p]
def cm(val):
    f = [0]*(N+1); f[1] = 1
    for n in range(2, N+1):
        p = spf[n]; f[n] = f[n//p]*val(p)
    return f
def psum(f):
    s = [0]*(N+1)
    for n in range(1, N+1): s[n] = s[n-1]+f[n]
    return s
isq = math.isqrt
lam = cm(lambda p: -1); L = psum(lam)
# A. different THIN set: b = 0.75, 2 and 3 INCLUDED, different greedy rule (density 1/2)
b = 0.75; S = set(); acc = 0.0; prev = 1
for p in primes:
    acc += 0.5*(p-prev)*p**(b-1)/math.log(p+1); prev = p
    if len(S)+1 <= acc+1: S.add(p)
eps = cm(lambda p: -1 if p in S else 1); g = [lam[n]*eps[n] for n in range(N+1)]; G = psum(g)
xs = [7, 36, 37, 1000, 4999, 65536, 123457, 299999, 300000] + list(range(250000, 250400, 7))
okA = all(sum(eps[n]*G[x//n] for n in range(1, x+1)) == isq(x) for x in xs)
print("A. THIN b=0.75, |S|=%d: sum eps(n) G(x/n) = floor sqrt x on %d x: %s" % (len(S), len(xs), okA))
for x in (10**4, 10**5, 3*10**5):
    print("   x=%d G=%d log|G|/log x=%.3f" % (x, G[x], math.log(abs(G[x])+1)/math.log(x)))
print("   local slope 1e5..3e5: %.3f" % (math.log(abs(G[300000])/abs(G[100000]))/math.log(3)))
# B. Proposition 1 with a different base and a non-real f: f(p) = i for p = 1 mod 4, -1 for p = 3 mod 4, exp(0.7i) at 2;
#    twin f'(n) = f(n)(-1)^(v_10(n)); w(10^k) = 2(-f(10))^k (complex check done with Gaussian-exact parts where possible)
def fval(p):
    if p == 2: return cmath.exp(0.7j)
    return 1j if p % 4 == 1 else -1
f = cm(fval)
def vq(n, q):
    k = 0
    while n % q == 0: n //= q; k += 1
    return k
q = 10
fp = [0]+[f[n]*(-1)**vq(n, q) for n in range(1, N+1)]
Sf, Sfp = psum(f), psum(fp)
worst = 0.0
for x in xs:
    t = Sf[x]; k = 1
    while q**k <= x: t += 2*(-f[q])**k*Sf[x//q**k]; k += 1
    worst = max(worst, abs(t-Sfp[x]))
print("B. base 10, complex f: max |S_f'(x) - sum_k w(10^k) S_f(x/10^k)| = %.2e (float rounding only)" % worst)
print("   f'(10) = %s, f'(2) f'(5) = %s (not multiplicative)" % (fp[10], fp[2]*fp[5]))
# closed form at s = 2.5
s = 2.5
direct = sum(fp[n]*n**(-s) for n in range(1, N+1)); Ff = sum(f[n]*n**(-s) for n in range(1, N+1))
print("   F_f' - F_f (1 - f(10)10^-s)/(1 + f(10)10^-s) at s=2.5: %.2e (tail ~ %.1e)" % (abs(direct-Ff*(1-f[q]*q**-s)/(1+f[q]*q**-s)), N**-1.5))
# C. lambda V6 relation at fresh x values
V6 = [0]+[(-1)**vq(n, 6) for n in range(1, N+1)]; LV = psum([lam[n]*V6[n] for n in range(N+1)])
okC = True
for x in xs:
    t = isq(x); k = 1
    while 6**k <= x: t += 2*(-1)**k*isq(x//6**k); k += 1
    if sum(LV[x//n] for n in range(1, x+1)) != t: okC = False
print("C. lambda V6 all-n relation at fresh x:", okC, " max|LV|/sqrt x on [100,N]: %.4f" % max(abs(LV[x])/x**0.5 for x in range(100, N+1)))
# D. claim 3.3 (R2 paragraph): 'Gamma_sigma for lambda(n) n^(-i tau) is unitarily equivalent (modulation)'.
#    Modulation of the kernel gives x^(-i tau) L(x); the partial sum of lambda(n) n^(-i tau) is a different function.
tau = 3.0; T = 0j; maxd = 0.0
for n in range(1, 2001):
    T += lam[n]*n**(-1j*tau); maxd = max(maxd, abs(abs(T)-abs(L[n])))
print("D. max over x<=2000 of | |S_(lambda n^-i tau)(x)| - |L(x)| | , tau=3: %.3f  (0 would be needed for the modulation claim)" % maxd)
print("   symbols: F(s+i tau)/s (partial sums of the twist) vs F(s+i tau)/(s+i tau) (modulated kernel)")
# E. Lemma 0 (c): 'zeros of F_lambda at -1, -2, ...' ; value at s = -2 and -4 (zeta(2s) and zeta(s) both vanish)
for s0 in (-2, -4):
    h = mp.mpf(10)**-12
    print("E. F_lambda(%d) = lim zeta(2s)/zeta(s) = %s (finite, non-zero: not a zero)" % (s0, mp.nstr(mp.zeta(2*(s0+h))/mp.zeta(s0+h), 8)))
print("   F_lambda(-1) = %s, F_lambda(-3) = %s; residue-type check at 1/2: (s-1/2) F at 1/2+1e-10 = %s; F_lambda(1) = %s" % (
    mp.nstr(mp.zeta(-2)/mp.zeta(-1), 5), mp.nstr(mp.zeta(-6)/mp.zeta(-3), 5), mp.nstr(mp.mpf(10)**-10*mp.zeta(1+2*mp.mpf(10)**-10)/mp.zeta(0.5+mp.mpf(10)**-10), 8), mp.nstr(mp.zeta(2+2*h)/mp.zeta(1+h), 5)))
# F. Theorem A (ii) bound on an exactly solvable kernel: Carleman k(u) = 1/u, N = pi, -K'(w) = int u k e^{-wu} = 1/w;
#    bound |K'(w)| <= pi/(2 Re w). And toy of Lemma B with another pole.
print("F. Carleman: |K'(w)| Re w = Re w/|w| <= 1 <= pi/2: consistent, not sharp")
p = mp.mpc(0.15, -5.0)
for u in (0.7, -0.7):
    full = mp.quad(lambda t: 1/(1j*t-p)*mp.exp(1j*t*u), mp.linspace(-600, 600, 2401))/(2*mp.pi)
    print("   toy p=0.15-5i u=%+.1f: %s  predicted %s" % (u, mp.nstr(full, 6), mp.nstr(-mp.exp(p*u) if u < 0 else mp.mpf(0), 6)))
# G. shear row at other points (xi(2s)/xi(s), d/dsigma log modulus)
def xi(s): return mp.mpf(1)/2*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def dlog(sig, t): return mp.diff(lambda x: mp.log(abs(xi(2*mp.mpc(x, t))/xi(mp.mpc(x, t)))), sig)
vals = [(dlog(mp.mpf(sg), mp.mpf(t)), sg, t) for t in (0, 10.0, 14.1347, 25.0109, 77.7, 200.4) for sg in (0.251, 0.33, 0.42, 0.499)]
m = min(vals); print("G. min d/dsigma log|xi(2s)/xi(s)| over 24 fresh points: %s at sigma=%s t=%s" % (mp.nstr(m[0], 6), m[1], m[2]))
# H. 3.3: relation bound zeta(sigma)/(zeta(2 sigma)(sigma-1/2)) against the trivial bound 1/(sigma-1) (|L(x)| <= x)
for sg in (1.01, 1.1, 1.5, 2.0, 3.0):
    print("H. sigma=%.2f relation bound %.4f  trivial bound %.4f" % (sg, mp.zeta(sg)/mp.zeta(2*sg)/(sg-0.5), 1/(sg-1)))
# I. L^1 norm of k_sigma on u <= log N is finite and smooth in sigma (analytic family on sigma > Theta): log-convexity sample
def l1(sg):
    return sum(abs(L[n])*(n**-sg-(n+1)**-sg)/sg for n in range(1, N))
v = [l1(sg) for sg in (0.8, 0.9, 1.0)]
print("I. truncated ||k_sigma||_1 at 0.8, 0.9, 1.0: %.4f %.4f %.4f ; log-convex: %s" % (v[0], v[1], v[2], v[1]**2 <= v[0]*v[2]))
