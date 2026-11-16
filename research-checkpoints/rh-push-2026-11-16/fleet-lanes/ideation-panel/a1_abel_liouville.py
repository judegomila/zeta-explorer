# Angle 1: Abel-summed Liouville / Moebius power series. MEASURED, double precision + mpmath for zero terms.
import numpy as np, mpmath as mp
N = 12_000_000
# Liouville via smallest-prime-factor sieve (Omega parity)
lam = np.ones(N+1, dtype=np.int8); lam[0] = 0
mu = np.ones(N+1, dtype=np.int8); mu[0] = 0
isp = np.ones(N+1, dtype=bool); isp[:2] = False
for p in range(2, int(N**0.5)+1):
    if isp[p]: isp[p*p::p] = False
primes = np.nonzero(isp)[0]
for p in primes:
    if p*p > N: break
    pk = p
    while pk <= N:
        lam[pk::pk] *= -1
        pk *= p
    mu[p*p::p*p] = 0
# large primes: each n has at most one prime factor > sqrt(N); handle via cofactor
rem = np.arange(N+1, dtype=np.int64)
for p in primes:
    if p*p > N: break
    pk = p
    while pk <= N:
        rem[pk::pk] //= p
        pk *= p
big = rem > 1
lam[big] *= -1
omega_small = None
# mu: sign = lam where squarefree
mu = np.where(mu != 0, lam, 0).astype(np.int8)
assert lam[1]==1 and lam[2]==-1 and lam[4]==1 and lam[12]==-1 and mu[30]==-1 and mu[12]==0
c = float(mp.sqrt(mp.pi)/(2*mp.zeta(0.5)))
print("predicted L(e^{-1/x})/sqrt(x) -> sqrt(pi)/(2 zeta(1/2)) =", c)
n = np.arange(N+1, dtype=np.float64)
print("x, L/sqrt(x), (L - c sqrt(x)) [predicted -> 1 = -(1/2)/zeta(0)... see RESULT], M(e^{-1/x})")
for x in [10, 100, 1e3, 1e4, 1e5, 3e5]:
    w = np.exp(-n/x)
    L = float(np.dot(lam, w)); M = float(np.dot(mu, w))
    # identity L(q) = sum_k M(q^{k^2})
    S = 0.0; k = 1
    while k*k < 40*x and x <= 1e4:
        m = int(min(N, 40*x/(k*k)))+1
        S += float(np.dot(mu[:m], np.exp(-n[:m]*(k*k)/x))); k += 1
    if x > 1e4: S = L
    print(f"{x:9.0f} {L/np.sqrt(x):+.9f} {L - c*np.sqrt(x):+.6f} {M:+.9f}  identity gap {abs(L-S):.2e}")
# sign scan of L(q) on a log grid of x
xs = np.exp(np.linspace(np.log(0.2), np.log(3e5), 300))
sg = []
for x in xs:
    sg.append(np.dot(lam[:int(min(N, 40*x))+1], np.exp(-n[:int(min(N, 40*x))+1]/x)))
sg = np.array(sg)
ch = np.nonzero(np.sign(sg[1:]) != np.sign(sg[:-1]))[0]
print("sign changes of L(e^{-1/x}) for x in [0.2, 3e5]:", [(float(xs[i]), float(xs[i+1])) for i in ch])
# zero-term amplitudes: Gamma(rho) zeta(2rho)/zeta'(rho)
mp.mp.dps = 25
for j in (1,2,3):
    rho = mp.zetazero(j)
    aL = mp.gamma(rho)*mp.zeta(2*rho)/mp.zeta(rho, derivative=1)
    aM = mp.gamma(rho)/mp.zeta(rho, derivative=1)
    print(f"zero {j}: |Gamma(rho) zeta(2rho)/zeta'(rho)| = {mp.nstr(abs(aL),6)}, |Gamma(rho)/zeta'(rho)| = {mp.nstr(abs(aM),6)}")
rho = mp.zetazero(1)
aM = 2*abs(mp.gamma(rho)/mp.zeta(rho, derivative=1))
print("Moebius series: oscillation 2|Gamma(rho1)/zeta'(rho1)| x^{1/2} exceeds 2 for x >", mp.nstr((2/aM)**2, 5))
aL = 2*abs(mp.gamma(rho)*mp.zeta(2*rho)/mp.zeta(rho, derivative=1))
print("Liouville: relative margin under RH (first zero pair) =", mp.nstr(aL/abs(c), 5))
# planted off-line zero: x-threshold where a zero beta+i gamma could flip the sign: x^{beta-1/2} |Gamma| ~ |c|
for (b, g) in [(0.75, 3e12), (0.874887, 3e12), (0.51, 3e12)]:
    # log|Gamma(b+ig)| ~ -pi g/2 + (b-1/2) log g + 0.5 log 2pi
    logx = (mp.pi*g/2 - (b-0.5)*mp.log(g))/(b-0.5)
    print(f"planted zero beta={b}, gamma={g:.0e}: sign of L can flip only for log x > {mp.nstr(logx,5)}")
