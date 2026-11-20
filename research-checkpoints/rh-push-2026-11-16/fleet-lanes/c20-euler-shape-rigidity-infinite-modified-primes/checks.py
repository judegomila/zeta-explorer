# c20-euler-shape-rigidity: numerical checks (float64 + mpmath; MEASURED unless stated).
# Run: scripts/memcap.sh 8 python3.14 checks.py
import json, math
import numpy as np
import mpmath as mp

out = {}

def is_prime(n):
    if n < 2: return False
    for p in (2,3,5,7,11,13,17,19,23,29,31,37):
        if n % p == 0: return n == p
    d, s = n-1, 0
    while d % 2 == 0: d //= 2; s += 1
    for a in (2,3,5,7,11,13,17,19,23,29,31,37):   # deterministic below 3.3e24
        x = pow(a, d, n)
        if x in (1, n-1): continue
        for _ in range(s-1):
            x = x*x % n
            if x == n-1: break
        else: return False
    return True

def nextprime(n):
    n += 1
    while not is_prime(n): n += 1
    return n

# ---------------- T1: sparse set S = {nextprime(10^j)}, j = 1..12; FE defect on the line ---------
S = [nextprime(10**j) for j in range(1, 13)]
out['S'] = S
sumS = sum(p**-0.5 for p in S)
tail = sum(10**(-j/2) for j in range(13, 200))   # bound for sum over j >= 13 of p_j^-1/2
out['sum_p^-1/2_over_S_j<=12'] = sumS
out['tail_bound_j>12'] = tail

rng = np.random.default_rng(20261120)
fam = {
 'THIN-sparse (alpha=-1)': [-1.0+0j]*12,
 'DEL-sparse (alpha=0)':  [0j]*12,
 'unimodular random':     list(np.exp(2j*np.pi*rng.random(12))),
 'near-1 (alpha=1+0.3i)': [1+0.3j]*12,
 'large (alpha=2.5)':     [2.5+0j]*12,
}
T = 20000.0; dt = 0.01
t = np.arange(0.0, T, dt)
logp = np.array([math.log(p) for p in S])
T1 = {}
for name, al in fam.items():
    Np = np.ones_like(t, dtype=complex)   # N(1/2+it)
    Nm = np.ones_like(t, dtype=complex)   # N(1/2-it)
    for p, a, lp in zip(S, al, logp):
        yp = p**-0.5*np.exp(-1j*t*lp)
        ym = p**-0.5*np.exp(+1j*t*lp)
        Np *= (1-a*yp)/(1-yp)
        Nm *= (1-a*ym)/(1-ym)
    D = Np - Nm
    rec = {'sup|D| on grid': float(np.max(np.abs(D))),
           'sup|N| on grid': float(np.max(np.abs(Np))),
           'bound exp(sum delta_p)': float(math.exp(sum(abs(1-a)*p**-0.5/(1-p**-0.5) for p, a in zip(S, al))))}
    for n, facs in ((11, [0]), (101, [1]), (11*101, [0, 1]), (121, [0])):
        e = np.exp(1j*t*math.log(n))
        mean_pos = np.mean(Np*e)
        mean_neg = np.mean(Np*np.conj(e))
        meanD = np.mean(D*e)
        c = 1.0
        for i in facs: c *= (1-al[i])
        pred = c*n**-0.5
        rec[f'n={n}'] = {'predicted c(n) n^-1/2': [float(np.real(pred)), float(np.imag(pred))],
                         'mean N(1/2+it) n^{it}': [float(mean_pos.real), float(mean_pos.imag)],
                         'mean N(1/2+it) n^{-it}': [float(mean_neg.real), float(mean_neg.imag)],
                         'mean D(t) n^{it}': [float(meanD.real), float(meanD.imag)]}
    rec['lower bound max_p |1-alpha_p| p^-1/2'] = float(max(abs(1-a)*p**-0.5 for p, a in zip(S, al)))
    A = max(abs(1-a) for a in al)
    rec['tail effect bound on sup|D| (same |1-alpha| bound on j>12)'] = float(2*rec['bound exp(sum delta_p)']*(math.exp(A*tail/(1-10**-6.5))-1))
    T1[name] = rec
out['T1'] = T1

# ---------------- T2: Kronecker sup formula and growth in the non-summable sparse regime ----------
def Mp(alpha, r, m=4096):
    th = np.linspace(0, 2*np.pi, m, endpoint=False)
    y = r*np.exp(1j*th)
    return float(np.max(np.abs((1-alpha*y)/(1-y))))

ps = [2, 3, 5]; als = [-1.0, 2.0j, 0.0]; sig = 0.6
tt = np.arange(0.0, 400000.0, 0.02)
Nv = np.ones_like(tt, dtype=complex)
for p, a in zip(ps, als):
    y = p**-sig*np.exp(-1j*tt*math.log(p))
    Nv *= (1-a*y)/(1-y)
brute = float(np.max(np.abs(Nv)))
prod = 1.0
for p, a in zip(ps, als): prod *= Mp(a, p**-sig)
out['T2a'] = {'primes': ps, 'alphas': [str(a) for a in als], 'sigma': sig,
              'brute sup over t in [0,4e5]': brute, 'product of local maxima': prod}
del tt, Nv

T2b = []
th = np.linspace(0, 2*np.pi, 720, endpoint=False); w = np.exp(1j*th)
for J in (10, 100, 1000, 10000):
    for eps in (1e-1, 1e-2, 1e-3, 1e-4, 1e-5):
        logprod = 0.0; bohr = 0.0
        for j in range(1, J+1):
            lr = -j*(0.5+eps)*math.log(10)
            r = math.exp(lr) if lr > -700 else 0.0
            c = -(1.0/j)*10**(-j*eps)                  # (1-alpha_p) p^-sigma with alpha_p = 1 + p^(1/2)/j, p = 10^j
            M = float(np.max(np.abs(1 + c*w/(1-r*w))))
            logprod += math.log(M)
            bohr += abs(c)
        T2b.append({'J': J, 'eps': eps, 'log sup_t |N(1/2+eps+it)| (Kronecker product)': logprod,
                    'Bohr lower bound sum_p |c(p)| p^-sigma': bohr})
out['T2b'] = T2b

# ---------------- T3: HQ controls: neither m nor 1/m is analytic on the closed disc |u| <= 1 --------
def series_div(num, den, K):
    c = [0.0]*(K+1)
    for k in range(K+1):
        s = num[k] if k < len(num) else 0.0
        for i in range(1, min(k, len(den)-1)+1):
            s -= den[i]*c[k-i]
        c[k] = s
    return c
def hq(num, den):
    rn = np.roots(num[::-1]); rd = np.roots(den[::-1])
    rec = {'min |root| numerator (zeros of m)': float(np.min(np.abs(rn))),
           'min |root| denominator (poles of m)': float(np.min(np.abs(rd)))}
    for K in (50, 100, 200):
        cm = series_div(num, den, K); cn = series_div(den, num, K)
        rec[f'sum_k<={K} |c_m(q^k)| q^-k/2'] = float(sum(abs(x) for x in cm[1:]))
        rec[f'sum_k<={K} |c_N(q^k)| q^-k/2'] = float(sum(abs(x) for x in cn[1:]))
    return rec
q = 2.0; v = math.log(q)
T3 = {}
eps = 1.0
T3['HQ1(q=2, eps=1)'] = hq([1, -(2-eps), 1], [1, -2, 1])
cq = q**0.25 + q**-0.25
T3['HQ1(q=2, eps=c_q+2) (Prop F)'] = hq([1, cq, 1], [1, -2, 1])
eps = 1e-2
T3['HQ2(q=2, eps=1e-2)'] = hq([1, -4, 6+eps, -4, 1], [1, -4, 6, -4, 1])
a, b = 0.1, 0.2
al, be = 2*math.cosh(a*v), 2*math.cosh(b*v)
T3['HQ3(2; 0.1, 0.2)'] = hq([1, -al, 1], [1, -be, 1])
T3['HQ4(2; 0.1, 0.2)'] = hq([1, al, 1], [1, -be, 1])
out['T3'] = T3

# ---------------- T4: E_a: not zeta's functional equation ----------------
mp.mp.dps = 30
def gam(s): return mp.pi**(-s/2)*mp.gamma(s/2)
aa = mp.mpf('0.25'); s0 = mp.mpc('0.5', '5')
Ea = lambda s: mp.zeta(s+aa)*mp.zeta(s-aa)
m_s = Ea(s0)/mp.zeta(s0); m_r = Ea(1-s0)/mp.zeta(1-s0)
out['T4'] = {'E_a, a=0.25, s=1/2+5i: |m(s) - m(1-s)|': float(abs(m_s - m_r)), '|m(s)|': float(abs(m_s))}

json.dump(out, open('checks.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
