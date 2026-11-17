"""r3-tnr-control: the principal normalizer H_eta(s) = H_{eta,1}(s, 1, 1/6) of the 7/8 manuscript.
(a) sympy: from manuscript (7.11)-(7.12) at u = 1 (j = 0, rho = 1):
      H_p(x,w,z) = [(1-V)(1-W)(1 - D) + ... ]  and at (w, z) = (1, 1/6):
      H_p = (1 - Q^-2) (1 - Q^-1 (R - D)/(1 - D)) / (1 - R),  R = a_p^2 Q^{3-6s}, D = eta(p) Q^{-s}.
(b) L(s, lambda^6), lambda(z) = z/|z| on Z[omega] (frequency-6 Groessencharacter, conductor 1):
    L-function of the CM newform sum z^6 q^{|z|^2}/6 of weight 7, level 3. Functional equation check and
    first zeros rho'; the normalizer vanishes at s = (3 + rho')/6.
(c) numerical check of the factorisation H_eta(s) = L^S(6s-3, lambda^6 eta^6) * E(s) for eta = 1 on a prime range.
Run: .venv-arb/bin/python normalizer.py
"""
import json, math, cmath
import sympy as sp
import mpmath as mp

out = {}
# ---------- (a)
Q, D, R, V, W, eta = sp.symbols('Q D R V W eta')
# u = 1: j = 0, rho = 1, Wloc = W = Q^{-w}, D = eta Q^{-x}; so eta (Q-1) Q^{-x-w} = D W (Q-1), eta Q^{-x} = D
J0 = -D + W * R
Pstar = (1 / (1 - R)) * ((R * (1 - 1 / Q) - D * W * (Q - 1) * V) / (1 - V) + J0)
P = 1 / (1 - V) + W / (1 - W) + Pstar
H = sp.simplify(P * (1 - V) * (1 - W) / (1 - D))
out['H_p_general_u1'] = str(sp.factor(H))
# general (w,z): numerator of H_p (1-R)(1-D)
num = sp.expand(sp.simplify(H * (1 - R) * (1 - D)))
out['H_p_times_(1-R)(1-D)'] = str(num)
Hres = sp.simplify(H.subs({V: 1 / Q, W: 1 / Q}))
claim = (1 - Q ** -2) * (1 - (R - D) / (Q * (1 - D))) / (1 - R)
out['closed_form_residual_at_w1_z16'] = str(sp.simplify(Hres - claim))

# ---------- (b) CM form of weight 7, level 3
mp.mp.dps = 30
NMAX = 400
a = [mp.mpf(0)] * (NMAX + 1)
B = int(math.isqrt(NMAX)) * 2 + 3
om = complex(-0.5, math.sqrt(3) / 2)
acc = [0j] * (NMAX + 1)
for m in range(-B, B + 1):
    for n in range(-B, B + 1):
        nm = m * m - m * n + n * n
        if 0 < nm <= NMAX:
            z = m + n * om
            acc[nm] += z ** 6
for n in range(1, NMAX + 1):
    a[n] = mp.mpf(round(acc[n].real / 6))
out['a_n_first'] = [int(a[n]) for n in range(1, 14)]
k, Nlev = 7, 3
sqN = mp.sqrt(Nlev)
def Lam(s, eps, t=mp.mpf(1)):
    tot = mp.mpc(0)
    for n in range(1, NMAX + 1):
        if a[n] == 0:
            continue
        y = 2 * mp.pi * n / sqN
        tot += a[n] * (mp.power(1 / y, s) * mp.gammainc(s, y * t) + eps * mp.power(1 / y, k - s) * mp.gammainc(k - s, y / t))
    return tot
s_test = mp.mpc('3.2', '4.7')
fe = {}
for eps in (1, -1):
    v1, v2 = Lam(s_test, eps, mp.mpf(1)), Lam(s_test, eps, mp.mpf('1.15'))
    fe[eps] = float(abs(v1 - v2) / abs(v1))
out['root_number_test_rel_diff'] = {str(e): v for e, v in fe.items()}
eps = 1 if fe[1] < fe[-1] else -1
out['root_number'] = eps
# Hardy-type real function on the critical line s = 7/2 + i g
def Zf(g):
    s = mp.mpc(3.5, g)
    v = Lam(s, eps)
    return (v if eps == 1 else v / 1j)
zeros = []
prev_g, prev_v = mp.mpf(0.05), None
g = mp.mpf('0.05')
vals = []
while g < 22:
    v = Zf(g)
    vals.append((g, v.real, abs(v.imag)))
    g += mp.mpf('0.1')
for (g0, v0, _), (g1, v1, _) in zip(vals[:-1], vals[1:]):
    if v0 * v1 < 0:
        r = mp.findroot(lambda t: Zf(t).real, (g0, g1), solver='anderson')
        zeros.append(r)
out['max_imag_part_on_line'] = float(max(v[2] for v in vals))
out['zeros_gamma_prime'] = [float(z) for z in zeros]
out['normalizer_zeros_s'] = [[7 / 12, float(z / 6)] for z in zeros]
# count check via argument principle is omitted; N(T) main term for degree 2, conductor 3, weight 7:
def Nmain(T):
    # (T/pi) log(sqrt(3) T/(2 pi e)) + O(1) with weight shift
    return float(T / mp.pi * mp.log(sqN * T / (2 * mp.pi * mp.e)))
out['zero_count_to_22'] = dict(found=len(zeros), main_term=Nmain(22))

# ---------- (c) factorisation on a prime range, eta = 1: prod_{P0<Np<=P1} H_p(s) vs prod (1-R)^{-1} * prod E_p
def eis_primes(P1):
    """primary generators (== 1 mod 3) of prime ideals of norm <= P1, norm prime to 3; returns (z, Q)."""
    res = []
    lim = int(math.isqrt(P1)) * 2 + 3
    seen = set()
    for m in range(-lim, lim + 1):
        for n in range(-lim, lim + 1):
            nm = m * m - m * n + n * n
            if nm < 2 or nm > P1 or nm % 3 == 0:
                continue
            # z = m + n*omega ; primary: z == 1 mod 3 i.e. m == 1 mod 3, n == 0 mod 3
            if (m - 1) % 3 or n % 3:
                continue
            # prime ideal: norm rational prime (split) or norm p^2 with z = +-p inert
            isp = sp.isprime(nm)
            if not isp:
                r = math.isqrt(nm)
                if not (r * r == nm and n == 0 and sp.isprime(r) and r % 3 == 2):
                    continue
            res.append((complex(m - n / 2, n * math.sqrt(3) / 2), nm))
    return res
prs = eis_primes(20000)
P0 = 50
def local_H(s, z, Qn):
    al6 = (z / abs(z)) ** 6
    Rv = al6 * Qn ** (3 - 6 * s)
    Dv = Qn ** (-s)
    return (1 - Qn ** -2.0) * (1 - (Rv - Dv) / (Qn * (1 - Dv))) / (1 - Rv), Rv, Dv
chk = []
for s in [complex(0.9, 3.0), complex(0.7, 1.0), complex(0.62, 2.0)]:
    logH = 0j; logL = 0j; logE = 0j; sumabsR = 0.0; sumabsE = 0.0
    for z, Qn in prs:
        if Qn <= P0:
            continue
        h, Rv, Dv = local_H(s, z, Qn)
        logH += cmath.log(h); logL += -cmath.log(1 - Rv)
        e = (1 - Qn ** -2.0) * (1 - (Rv - Dv) / (Qn * (1 - Dv)))
        logE += cmath.log(e); sumabsR += abs(Rv); sumabsE += abs(e - 1)
    chk.append(dict(s=[s.real, s.imag], log_prod_H=[logH.real, logH.imag], log_prod_L=[logL.real, logL.imag],
                    log_prod_E=[logE.real, logE.imag], sum_abs_R=sumabsR, sum_abs_E_minus_1=sumabsE))
out['factorisation_check_primes_50_to_20000'] = chk
out['n_prime_ideals'] = len(prs)
json.dump(out, open(__file__.replace('.py', '.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
