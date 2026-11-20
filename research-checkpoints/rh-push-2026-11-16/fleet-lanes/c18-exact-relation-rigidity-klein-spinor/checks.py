# Checks for RESULT.md (mpmath, 40 digits; not ball arithmetic). Twins HQ1, HQ2, TN1.
import json, math
from mpmath import mp, mpf, mpc, zeta, gamma, pi, log, sqrt, asinh, acosh, exp, binomial, nstr
mp.dps = 40
out = {}
def gam(s): return pi**(-s/2)*gamma(s/2)
def u_of(q, s): return mpf(q)**(mpf(1)/2 - s)
def m1(q, e, s): u = u_of(q, s); return 1 + e*u/(1-u)**2
def m2(q, e, s): u = u_of(q, s); return 1 + e*u**2/(1-u)**4
pts = [mpc('0.3','7.1'), mpc('0.81','23.4'), mpc('1.7','-3.3'), mpc('0.5','40.2'), mpc('-1.3','5.5')]
def fe_res(m, q, e):
    r = 0
    for s in pts:
        a = zeta(s)*m(q, e, s)*gam(s); b = zeta(1-s)*m(q, e, 1-s)*gam(1-s)
        r = max(r, abs(a-b)/abs(a))
    return r
# A. HQ2: zeros, FE, coefficients
A = []
for q, e in [(2, mpf('0.01')), (2, mpf(1)), (3, mpf('1e-4')), (101, mpf('1e-6')), (10007, mpf('1e-8'))]:
    L = log(q)
    z = (2/L)*asinh((e**(mpf(1)/4)/2)*exp(1j*pi/4))     # predicted zero s = 1/2 + z
    s0 = mpf(1)/2 + z
    row = dict(q=q, eps=float(e), zero_re=nstr(s0.real, 15), zero_im=nstr(s0.imag, 15),
               abs_m_at_zero=float(abs(m2(q, e, s0))), abs_G_at_zero=float(abs(zeta(s0)*m2(q, e, s0))),
               abs_zeta_at_zero=float(abs(zeta(s0))),
               predicted_offset=float(e**(mpf(1)/4)/(sqrt(2)*L)), offset=float(s0.real - mpf(1)/2),
               in_open_strip=bool(0 < s0.real < 1),
               fe_rel_residual=float(fe_res(m2, q, e)),
               sup_m_minus_1_on_Re2=float(e*mpf(q)**-3/(1-mpf(q)**(-mpf(3)/2))**4))
    # also zero near the k = 1 pole
    s1 = s0 + 2j*pi/L
    row['abs_G_at_zero_k1'] = float(abs(zeta(s1)*m2(q, e, s1)))
    A.append(row)
out['A_HQ2'] = A
# A3. Dirichlet coefficients of HQ2 at q = 2, eps = 0.01: a(n) = 1 + sum_{2<=j<=v_q(n)} eps*C(j+1,3) q^(j/2)
def coeffs(q, e, N, kind):
    a = [mpf(0)]*(N+1)
    for n in range(1, N+1):
        v = 0; t = n
        while t % q == 0: t //= q; v += 1
        if kind == 2: a[n] = 1 + sum(e*binomial(j+1, 3)*mpf(q)**(mpf(j)/2) for j in range(2, v+1))
        else:         a[n] = 1 + sum(e*j*mpf(q)**(mpf(j)/2) for j in range(1, v+1))
    return a
N = 6000
for kind, q, e, name in [(2, 2, mpf('0.01'), 'HQ2 q=2 eps=0.01'), (1, 3, mpf(5), 'HQ1 q=3 eps=5 (c=3)')]:
    a = coeffs(q, e, N, kind)
    bad = 0; cnt = 0
    for n in range(2, 78):
        for k in range(2, N//n + 1):
            if math.gcd(n, k) == 1:
                cnt += 1
                if abs(a[n*k] - a[n]*a[k]) > mpf(10)**-30: bad += 1
    s = mpf(8)
    ds = sum(a[n]*mpf(n)**-s for n in range(1, N+1))
    cf = zeta(s)*(m2(q, e, s) if kind == 2 else m1(q, e, s))
    out['A3_'+name] = dict(N=N, min_coeff=float(min(a[1:])), coprime_pairs=cnt, multiplicativity_failures=bad,
                           series_minus_closed_form_at_s8=float(abs(ds-cf)))
# B. HQ1 threshold: roots of (1-u)^2 + eps*u
B = []
for e in [mpf('-0.01'), mpf('0.5'), mpf('3.99'), mpf('4.01'), mpf(5)]:
    d = sqrt(mpc((2-e)**2 - 4)); r1 = ((2-e)+d)/2; r2 = ((2-e)-d)/2
    q = 3; L = log(q)
    # zero s = 1/2 - log(u)/L
    s1 = mpf(1)/2 - log(r1)/L
    B.append(dict(eps=float(e), abs_root1=float(abs(r1)), abs_root2=float(abs(r2)), q=3,
                  zero_re=float(s1.real), zero_im=float(s1.imag),
                  abs_G_at_zero=float(abs(zeta(s1)*m1(q, e, s1))), fe_rel_residual=float(fe_res(m1, q, e))))
out['B_HQ1_threshold'] = B
# C. TN1: zeta(s)(1 + q^(3/4 - s)); zero at 3/4 + i pi/log q; coefficients 1 + q^(3/4)[q | n]
C = []
for q in [2, 3, 101]:
    s0 = mpc(mpf(3)/4, pi/log(q))
    C.append(dict(q=q, zero=nstr(s0, 12), abs_G=float(abs(zeta(s0)*(1 + mpf(q)**(mpf(3)/4 - s0))))))
out['C_TN1'] = C
# D. Sequence HQ1(q, c_q), c_q = q^(1/4) + q^(-1/4): zeros on Re s = 3/4 and 1/4; sup |m - 1| on Re s = sigma
D = []
for q in [2, 11, 101, 1009, 10007, 1000003]:
    c = mpf(q)**(mpf(1)/4) + mpf(q)**(-mpf(1)/4); e = c + 2; L = log(q)
    s0 = mpc(mpf(3)/4, pi/L)
    row = dict(q=q, c=float(c), abs_G_at_zero=float(abs(zeta(s0)*m1(q, e, s0))), first_height=float(pi/L))
    for sig in ['2', '1.01', '0.8']:
        uu = mpf(q)**(mpf(1)/2 - mpf(sig)); row['sup_m_minus_1_Re_'+sig] = float(e*uu/(1-uu)**2)
    D.append(row)
out['D_sequence'] = D
json.dump(out, open('checks.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
