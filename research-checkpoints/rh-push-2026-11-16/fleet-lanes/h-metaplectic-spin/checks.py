# h-metaplectic-spin: numerical checks (mpmath, single process, < 1 min)
from mpmath import *
import itertools, json
from math import gcd
mp.dps = 30
out = {}

# ---------- N1: PR 43 sec 5 identity; theta = square root of a period -------------
def theta(t):            # sum_{n in Z} exp(-pi n^2 t), t may be complex with Re t > 0
    return jtheta(3, 0, exp(-pi*t))
r1 = []
for b in [mpf('-1.3'), mpf('0.2'), mpf('0.9'), mpf('2.1')]:
    t = exp(b)
    H = exp(b/4)*theta(t)
    # modulus with K'/K = e^{-b}:  nome q = exp(-pi K'/K) = exp(-pi e^{-b})
    m = mfrom(q=exp(-pi*exp(-b)))
    K, Kp = ellipk(m), ellipk(1-m)
    r1.append((float(b), float(abs(H - sqrt(2/pi)*(K*Kp)**mpf('0.25'))), float(abs(theta(1/t)**2 - 2*K/pi)),
               float(abs(theta(t)**2 - 2*Kp/pi)), float(abs(H - exp(-b/4)*theta(1/t)))))
out['N1_H_vs_periods(b, |H-sqrt(2/pi)(KK\')^(1/4)|, |theta(e^-b)^2-2K/pi|, |theta(e^b)^2-2K\'/pi|, |H(b)-H(-b)|)'] = r1

# ---------- N2: the spin sign is read at the rational cusps, not on the b-line -----
def jac(a, n):
    return jacobi(a, n) if hasattr(mp, 'jacobi_symbol') else _jac(a, n)
def _jac(a, n):
    a %= n; res = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): res = -res
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: res = -res
        a %= n
    return res if n == 1 else 0
r2 = []
y = mpf('1e-3')
for d in [3, 5, 7, 9, 11, 15]:
    for c in range(1, d):
        if gcd(c, d) != 1: continue
        # theta at tau = 2c/d + i y
        S = fsum(exp(2j*pi*mpf(c*n*n % d)/d)*exp(-pi*n*n*y) for n in range(-260, 261))
        eps = 1 if d % 4 == 1 else 1j
        pred = _jac(c, d)*eps/sqrt(d)*y**mpf('-0.5')
        r2.append((c, d, float(abs(S/pred - 1))))
out['N2_cusp_asymptotic_max_rel_err'] = max(x[2] for x in r2)
out['N2_cases'] = len(r2)

# ---------- N3: spin-Hecke operator on ladders ------------------------------------
def ladder(a, nu, tau, N=260, scale=1):
    # f(tau) = sum_{n>=1} a(n) n^nu exp(i pi n^2 tau/scale)
    return fsum(a(n)*mpf(n)**nu*exp(1j*pi*n*n*tau/scale) for n in range(1, N))
def Uop(f, p, tau, per):   # per = period of f in tau (2*scale)
    return fsum(f((tau + per*j)/p**2) for j in range(p*p))/p**2
def Nop_plain(f, p, tau, per):
    return f(tau) - fsum(f(tau + per*mpf(j)/p) for j in range(p))/p
def Nop_spin(f, p, tau, per):
    g = fsum(_jac(j, p)*exp(2j*pi*mpf(j)/p) for j in range(1, p))   # quadratic Gauss sum
    return fsum(_jac(j, p)*f(tau + per*mpf(j)/p) for j in range(1, p))/g
def Top(f, p, eps, nu, tau, per, spin=False):
    Nf = Nop_spin(f, p, tau, per) if spin else Nop_plain(f, p, tau, per)
    return Uop(f, p, tau, per) + eps*mpf(p)**(nu-1)*Nf + eps**2*mpf(p)**(2*nu-1)*f(p*p*tau)

tau0 = mpc('0.31', '0.83')
one = lambda n: 1
f_zeta = lambda tau: ladder(one, 0, tau)
r3 = []
for p in [3, 5, 7]:
    lam = (1 + mpf(1)/p)
    d_plain = abs(Top(f_zeta, p, 1, 0, tau0, 2) - lam*f_zeta(tau0))
    d_spin = abs(Top(f_zeta, p, 1, 0, tau0, 2, spin=True) - lam*f_zeta(tau0))
    r3.append(('zeta ladder', p, float(d_plain), float(d_spin)))
# chi mod 5 with chi(2) = i (odd), DH coefficients
def chi(n):
    return {0: 0, 1: 1, 2: 1j, 3: -1j, 4: -1}[n % 5]
def chib(n): return conj(chi(n))
kap = (sqrt(10 - 2*sqrt(5)) - 2)/(sqrt(5) - 1)
def aDH(n): return ((1 - 1j*kap)*chi(n) + (1 + 1j*kap)*chib(n))/2
out['DH_coeffs_1..5'] = [complex(aDH(n)) for n in range(1, 6)]
f_chi = lambda tau: ladder(chi, 1, tau, scale=5)
f_dh = lambda tau: ladder(aDH, 1, tau, scale=5)
for p in [2, 3, 7, 11]:
    if p == 2:
        spinflag = False
    else:
        spinflag = True
    e = chi(p); lam = e*p*(1 + mpf(1)/p)
    d = abs(Top(f_chi, p, e, 1, tau0, 10, spin=spinflag) - lam*f_chi(tau0))
    r3.append(('chi ladder, eps=chi(p)', p, float(d)))
    # DH: T_eps f - lam f = U + eps p^(nu-1) N + eps^2 p^(2nu-1) V - lam f ; fit (eps, lam) on 2 points, test on 2 others
    pts = [tau0, mpc('-0.4', '0.6'), mpc('1.1', '1.2'), mpc('0.05', '0.45')]
    nu = 1
    dat = []
    for t in pts:
        Nf = Nop_spin(f_dh, p, t, 10) if spinflag else Nop_plain(f_dh, p, t, 10)
        dat.append((Uop(f_dh, p, t, 10), mpf(p)**(nu-1)*Nf, mpf(p)**(2*nu-1)*f_dh(p*p*t), f_dh(t)))
    (U0, N0, V0, F0), (U1, N1, V1, F1) = dat[0], dat[1]
    # eliminate lam: (U0 + e N0 + e^2 V0)/F0 = (U1 + e N1 + e^2 V1)/F1
    A_ = V0/F0 - V1/F1; B_ = N0/F0 - N1/F1; C_ = U0/F0 - U1/F1
    best = None
    disc = sqrt(B_*B_ - 4*A_*C_)
    cands = [(-B_ + disc)/(2*A_), (-B_ - disc)/(2*A_)] if abs(A_) > mpf(10)**(-20) else [-C_/B_]
    r3.append(('DH fit coefficients |A|,|B|,|C|', p, float(abs(A_)), float(abs(B_)), float(abs(C_))))
    for e_ in cands:
        l_ = (U0 + e_*N0 + e_*e_*V0)/F0
        res = max(abs(U + e_*N + e_*e_*V - l_*F)/abs(F) for (U, N, V, F) in dat[2:])
        if best is None or res < best[2]: best = (complex(e_), complex(l_), float(res))
    r3.append(('DH ladder, (eps,lam) fitted on 2 points, relative residual on 2 others', p) + best)
    # same fit for the chi ladder as a positive control
    dat = []
    for t in pts:
        Nf = Nop_spin(f_chi, p, t, 10) if spinflag else Nop_plain(f_chi, p, t, 10)
        dat.append((Uop(f_chi, p, t, 10), mpf(p)**(nu-1)*Nf, mpf(p)**(2*nu-1)*f_chi(p*p*t), f_chi(t)))
    e_ = chi(p); l_ = (dat[0][0] + e_*dat[0][1] + e_*e_*dat[0][2])/dat[0][3]
    r3.append(('chi ladder, eps=chi(p), relative residual on the same 2 others', p,
               float(max(abs(U + e_*N + e_*e_*V - l_*F)/abs(F) for (U, N, V, F) in dat[2:]))))
for p in [11, 19, 29]:
    e = chi(p); lam = e*p*(1 + mpf(1)/p)
    r3.append(('DH ladder at split prime, eps=chi(p)=+-1, |T f - lam f|/|f|', p, complex(e),
               float(abs(Top(f_dh, p, e, 1, tau0, 10, spin=True) - lam*f_dh(tau0))/abs(f_dh(tau0)))))
for p in [2, 3, 7, 13]:
    for e in [chi(p), chib(p)]:
        lam = e*p*(1 + mpf(1)/p)
        r3.append(('DH ladder at inert prime, eps, |T f - lam f|/|f|', p, complex(e),
                   float(abs(Top(f_dh, p, e, 1, tau0, 10, spin=(p != 2)) - lam*f_dh(tau0))/abs(f_dh(tau0)))))
out['N3_spin_hecke'] = r3
out['N3_DH_exact_defect a(6)-a(2)a(3)'] = complex(aDH(6) - aDH(2)*aDH(3))
out['N3_DH_exact_defect a(4)-a(2)^2'] = complex(aDH(4) - aDH(2)**2)

# ---------- N4: the truncated-inverse detector applied to DH ----------------------
def L(s, ch):
    return fsum(ch(a)*zeta(s, mpf(a)/5) for a in range(1, 5))/mpf(5)**s
def fDH(s): return ((1 - 1j*kap)*L(s, chi) + (1 + 1j*kap)*L(s, chib))/2
def Mmu(s): return ((1 - 1j*kap)/L(s, chi) + (1 + 1j*kap)/L(s, chib))/2
rho0 = findroot(fDH, mpc('0.808517', '85.699348'))
out['N4_DH_zero'] = (float(rho0.real), float(rho0.imag))
out['N4_|fDH(rho0)|'] = float(abs(fDH(rho0)))
out['N4_L(rho0,chi), L(rho0,chibar)'] = (complex(L(rho0, chi)), complex(L(rho0, chib)))
out['N4_Mmu(rho0) finite'] = complex(Mmu(rho0))
# Dirichlet series check at s = 3: sum mu(n) a(n) n^-s  vs Mmu(3) vs 1/fDH(3)
def mobius(n):
    r = 1; q = 2
    while q*q <= n:
        if n % q == 0:
            n //= q
            if n % q == 0: return 0
            r = -r
        q += 1
    if n > 1: r = -r
    return r
s3 = mpf(3)
ps = fsum(mobius(n)*aDH(n)*mpf(n)**(-s3) for n in range(1, 20000))
out['N4_s=3: sum mu a n^-s, Mmu, 1/fDH'] = (complex(ps), complex(Mmu(s3)), complex(1/fDH(s3)))
out['N4_s=3: Mmu*fDH - 1'] = complex(Mmu(s3)*fDH(s3) - 1)

# ---------- N5: Hasse-Davenport (duplication) on Z/6-graded Gauss sums ------------
def primroot(p):
    for g in range(2, p):
        if all(pow(g, (p-1)//q, p) != 1 for q in [q for q in range(2, p) if (p-1) % q == 0 and all(q % r for r in range(2, q))]):
            return g
r5 = []
for p in [7, 13, 19, 31, 37, 43, 61]:
    g = primroot(p); ind = {}; x = 1
    for k in range(p-1):
        ind[x] = k; x = x*g % p
    z6 = exp(2j*pi/6)
    def ch(r, a): return 0 if a % p == 0 else z6**(r*ind[a % p])
    def G(r):
        if r % 6 == 0: return fsum(exp(2j*pi*mpf(a)/p) for a in range(1, p))    # zero-extended principal: -1
        return fsum(ch(r, a)*exp(2j*pi*mpf(a)/p) for a in range(1, p))
    hd = abs(G(1)*G(4) - conj(ch(1, 4))*G(2)*G(3))
    hd3 = abs(G(1)*G(3)*G(5) - conj(ch(1, 27))*G(3)*G(2)*G(4))  # triplication l=3: prod_{a in mu_3} g(chi a) = chi^-3(3) g(chi^3) prod g(a)
    r5.append((p, float(abs(G(0) + 1)), float(hd), float(hd3), float(abs(abs(G(1))**2 - p))))
out['N5_HD(p, |G0+1|, |G1G4 - chibar(4)G2G3|, |G1G3G5 - chibar(27)G3G2G4|, ||G1|^2-p|)'] = r5

for k, v in out.items():
    print(k, '=', v, flush=True)
json.dump({k: str(v) for k, v in out.items()}, open('checks.json', 'w'), indent=1)
