"""r3-tnr-control: T-NR twin F(s) = zeta(s) D(s), D(s) = 1 + c q^{1/2-s} + q^{1-2s}.
(1) functional equation, off-line zeros, Lambda_F signs;
(2) twisted family member (Dirichlet character chi mod 7) and the Laurent twin (zeta's own FE);
(3) summatory function of the coefficients of 1/F against the residue prediction.
Run: .venv-arb/bin/python twin.py
"""
import json, math
import mpmath as mp
import numpy as np

mp.mp.dps = 30
out = {}

def twin_params(q, c):
    # roots of X^2 + c sqrt(q) X + q : alpha*beta = q, alpha+beta = -c sqrt(q)
    sq = mp.sqrt(q)
    disc = mp.sqrt(c * c - 4)
    al = sq * (-c - disc) / 2 if c > 0 else sq * (-c + disc) / 2   # |alpha| > sqrt(q)
    be = q / al
    return al, be

def D(s, q, c):
    return 1 + c * mp.power(q, mp.mpf(1) / 2 - s) + mp.power(q, 1 - 2 * s)

def xi_twin(s, q, c):
    # completed: q^{s} pi^{-s/2} Gamma(s/2) zeta(s) D(s) * s(s-1)/2 ; conductor q^2
    return mp.power(q, s) * mp.power(mp.pi, -s / 2) * mp.gamma(s / 2) * mp.zeta(s) * D(s, q, c) * s * (s - 1) / 2

rows = []
for (q, c) in [(3, mp.mpf('2.2')), (2, mp.mpf('2.1')), (5, mp.mpf('2.5')), (3, mp.mpf('-2.2')), (7, mp.mpf('3.0'))]:
    al, be = twin_params(q, c)
    delta0 = mp.acosh(abs(c) / 2) / mp.log(q)
    beta = mp.mpf(1) / 2 + delta0
    # FE defect at a few points
    fe = max(abs(xi_twin(s, q, c) - xi_twin(1 - s, q, c)) / abs(xi_twin(s, q, c))
             for s in [mp.mpc('0.3', '4.1'), mp.mpc('0.77', '13.3'), mp.mpc('1.4', '2.2')])
    # zeros: c>0: heights pi(2k+1)/log q ; c<0: 2 pi k / log q
    h0 = mp.pi / mp.log(q) if c > 0 else 2 * mp.pi / mp.log(q)
    guess = mp.mpc(beta, h0)
    rho = mp.findroot(lambda s: mp.zeta(s) * D(s, q, c), guess)
    # von Mangoldt coefficients at q^k : (1 - alpha^k - beta^k) log q
    lam = [float(1 - al ** k - be ** k) for k in range(1, 6)]
    # coefficients of F at q^k: D(X)/(1-X), X = q^{-s}
    a1 = 1 + c * mp.sqrt(q); a2 = 1 + c * mp.sqrt(q) + q
    rows.append(dict(q=q, c=float(c), alpha=float(al), beta_root=float(be), re_zero=float(beta),
                     first_zero=[float(rho.real), float(rho.imag)], F_at_zero=float(abs(mp.zeta(rho) * D(rho, q, c))),
                     FE_rel_defect=float(fe), Lambda_over_logq_k1to5=lam,
                     aF_q=float(a1), aF_qk_k_ge_2=float(a2), inside_strip=bool(abs(c) < mp.sqrt(q) + 1 / mp.sqrt(q))))
out['twins'] = rows

# argument-principle count of zeros of F with Re s > 7/8 in 0.5 < Im s < T, q=3, c=2.2
q, c = 3, mp.mpf('2.2')
T = 60
def logder(s):
    h = mp.mpf('1e-12')
    f = lambda z: mp.zeta(z) * D(z, q, c)
    return (f(s + h) - f(s - h)) / (2 * h) / f(s)
def count(sig0, sig1, t0, t1):
    path = [mp.mpc(sig0, t0), mp.mpc(sig1, t0), mp.mpc(sig1, t1), mp.mpc(sig0, t1), mp.mpc(sig0, t0)]
    tot = 0
    for a, b in zip(path[:-1], path[1:]):
        n = max(8, int(abs(b - a) * 4))
        pts = [a + (b - a) * mp.mpf(k) / n for k in range(n + 1)]
        tot += mp.quad(logder, pts)
    return tot / (2j * mp.pi)
mp.mp.dps = 20
n78 = count(mp.mpf('0.875'), mp.mpf('3'), mp.mpf('0.5'), mp.mpf(T))
mp.mp.dps = 30
predicted = sum(1 for k in range(0, 1000) if 0.5 < math.pi * (2 * k + 1) / math.log(3) < T)
out['count_Re_gt_7_8'] = dict(q=3, c=2.2, T=T, argument_principle=[float(n78.real), float(n78.imag)], predicted=predicted)

# twisted member: F_chi(s) = L(s,chi) (1 + c chi(q) q^{1/2-s} + chi(q)^2 q^{1-2s}); chi mod 7 (order 6), q = 3
chi_vals = {}
g = 3  # primitive root mod 7
w6 = mp.exp(2j * mp.pi / 6)
x = 1
for k in range(6):
    chi_vals[x] = w6 ** k
    x = x * g % 7
def Lchi(s):
    return mp.power(7, -s) * sum(chi_vals[a] * mp.zeta(s, mp.mpf(a) / 7) for a in range(1, 7))
chq = chi_vals[3 % 7]
def Dchi(s):
    return 1 + c * chq * mp.power(q, mp.mpf(1) / 2 - s) + chq ** 2 * mp.power(q, 1 - 2 * s)
# zero of D_chi: q^{-s} chi(q) = 1/alpha  -> s = log_q(alpha chi(q))
al, be = twin_params(q, c)
s0 = mp.log(al * chq) / mp.log(q)
rho = mp.findroot(lambda s: Lchi(s) * Dchi(s), s0)
out['twisted_member'] = dict(modulus=7, chi_of_q=[float(chq.real), float(chq.imag)],
                             zero=[float(rho.real), float(rho.imag)], abs_F=float(abs(Lchi(rho) * Dchi(rho))))

# Laurent twin: zeta(s) (1 + e (p^{s-1/2} + p^{1/2-s})) : zeta's exact FE (conductor 1)
p, e = 2, mp.mpf('0.2')
def FL(s): return mp.zeta(s) * (1 + e * (mp.power(p, s - mp.mpf(1) / 2) + mp.power(p, mp.mpf(1) / 2 - s)))
def xiL(s): return mp.power(mp.pi, -s / 2) * mp.gamma(s / 2) * FL(s)
feL = abs(xiL(mp.mpc('0.3', '5.5')) - xiL(1 - mp.mpc('0.3', '5.5'))) / abs(xiL(mp.mpc('0.3', '5.5')))
rhoL = mp.mpf(1) / 2 + mp.acosh(1 / (2 * e)) / mp.log(p) + 1j * mp.pi / mp.log(p)
out['laurent_twin'] = dict(p=p, e=float(e), FE_rel_defect=float(feL), zero=[float(rhoL.real), float(rhoL.imag)],
                           abs_F=float(abs(FL(rhoL))))

# (3) summatory function of 1/F coefficients, q=3, c=2.2.
# 1/F = (1/zeta) * (1/D);  1/D = sum_k d_k q^{-ks}, d_k = (alpha^{k+1}-beta^{k+1})/(alpha-beta)
# M_F(x) = sum_k d_k M(x / q^k), M = Mertens.
N = 2 * 10 ** 7
mu = np.ones(N + 1, dtype=np.int8); mu[0] = 0
sieve = np.ones(N + 1, dtype=bool)
for i in range(2, int(N ** 0.5) + 1):
    if sieve[i]:
        sieve[i * i::i] = False
primes = np.nonzero(sieve)[0][2:]
for pp in primes:
    mu[pp::pp] *= -1
    if pp * pp <= N:
        mu[pp * pp::pp * pp] = 0
Mert = np.cumsum(mu.astype(np.int64))
alf, bef = float(al), float(be)
def MF(x):
    tot = 0.0; k = 0
    while q ** k <= x:
        dk = (alf ** (k + 1) - bef ** (k + 1)) / (alf - bef)
        tot += dk * Mert[int(x // q ** k)]
        k += 1
    return tot
beta = float(mp.mpf(1) / 2 + mp.acosh(c / 2) / mp.log(q))
# residue prediction: sum over zeros rho_n = beta + i pi (2n+1)/log q of x^rho /(rho zeta(rho) D'(rho))
def Dprime(s):
    return -mp.log(q) * (c * mp.power(q, mp.mpf(1) / 2 - s) + 2 * mp.power(q, 1 - 2 * s))
mp.mp.dps = 15
NZ = 400
zs = [mp.mpc(beta, mp.pi * (2 * n + 1) / mp.log(q)) for n in range(-NZ, NZ)]
coef = [1 / (r * mp.zeta(r) * Dprime(r)) for r in zs]
def pred(x):
    lx = mp.log(x)
    return float(sum(cf * mp.exp(r * lx) for cf, r in zip(coef, zs)).real)
samples = []
for x in [10 ** 4, 3 * 10 ** 4, 10 ** 5, 3 * 10 ** 5, 10 ** 6, 3 ** 13, 2 * 3 ** 13, 5 * 10 ** 6, 10 ** 7, 3 ** 15, 2 * 10 ** 7]:
    m = MF(x); pr = pred(x + 0.5)
    samples.append(dict(x=x, M_F=m, M=int(Mert[x]), M_F_over_x_beta=m / x ** beta, predicted=pr,
                        pred_over_x_beta=pr / x ** beta, M_over_sqrt_x=float(Mert[x]) / x ** 0.5))
# growth exponent fit from max |M_F| on dyadic blocks
xs = np.unique(np.round(np.logspace(3, math.log10(N), 4000)).astype(np.int64))
vals = np.array([abs(MF(int(x))) for x in xs])
blocks = []
for lo in [1e3, 1e4, 1e5, 1e6]:
    sel = (xs >= lo) & (xs < lo * 10)
    blocks.append((lo, float(vals[sel].max())))
slopes = [math.log10(blocks[i + 1][1] / blocks[i][1]) for i in range(len(blocks) - 1)]
out['inverse_summatory'] = dict(q=3, c=2.2, beta_twin=beta, samples=samples, decade_max=blocks, decade_slopes=slopes,
                                note='M_F(x)=sum_{n<=x} b(n), 1/F = sum b(n) n^{-s}; prediction = residues at the 800 twin zeros nearest the real axis')
json.dump(out, open(__file__.replace('.py', '.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
