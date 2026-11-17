# Hecke action on the four loadings: coefficient level, ladder level, torus level
import json, math, mpmath as mp, numpy as np
from common import *
setup(30)
R = {}; ns = lambda x,n=8: mp.nstr(x,n)
N = 3000; q = Q; kp = float(kap())
def vq(n,p):
    k=0
    while n%p==0: n//=p; k+=1
    return k
aval = float(mp.mpf('0.3'))
def sigma_pow(n, e): return sum(d**e for d in range(1,n+1) if n%d==0)
def coeffs(lab):
    a = np.zeros(N+1)
    for n in range(1,N+1):
        if lab=='zeta': a[n]=1
        elif lab=='DH': a[n]=[0,1,kp,-kp,-1][n%5]
        elif lab in ('NR','NRt'):
            c = 2.2 if lab=='NR' else 1.0; k = vq(n,q)
            a[n] = 1 if k==0 else (1+c*math.sqrt(q) if k==1 else 1+c*math.sqrt(q)+q)
        elif lab=='EA': a[n] = sigma_pow(n, 2*aval)*n**(-aval)
    return a
primes = [p for p in range(2,60) if all(p%d for d in range(2,p))]
def is_pp(n):
    for p in range(2,n+1):
        if n%p==0:
            while n%p==0: n//=p
            return n==1
    return False
for lab in ['zeta','DH','NR','NRt','EA']:
    a = coeffs(lab); out = {}
    # (i) Hecke-eigen (multiplicativity) defect per prime: max_{(n,p)=1, pn<=N} |a(pn)-a(p)a(n)|
    out['eigen_defect_p'] = {p: float(max(abs(a[p*n]-a[p]*a[n]) for n in range(1,N//p+1) if n%p)) for p in [2,3,5,7,11,13,19]}
    # (ii) log-derivative coefficients c(n): a(n) log n = sum_{d|n} c(d) a(n/d)
    c = np.zeros(N+1)
    for n in range(2,N+1):
        s = a[n]*math.log(n)
        for d in range(2,n):
            if n%d==0: s -= c[d]*a[n//d]
        c[n] = s
    offr = sum(abs(c[n]) for n in range(2,N+1) if not is_pp(n)); tot = sum(abs(c[2:]))
    out['off_rung_mass_fraction'] = float(offr/tot); out['c(6)'] = float(c[6])
    out['min_c(n)/log n'] = float(min(c[n]/math.log(n) for n in range(2,N+1)))
    out['Lambda_nonneg'] = bool(min(c[2:]) > -1e-9)
    # (iii) rung moments and Toeplitz temperedness test, degree d
    d = 2 if lab=='EA' else 1
    toe = {}
    for p in [2,3,5]:
        kmax = int(math.log(N)/math.log(p)); m = [d]+[c[p**k]/math.log(p) for k in range(1,kmax+1)]
        res = {}
        for K in [1,2,3]:
            if K<=kmax:
                T = np.array([[m[abs(i-j)] for j in range(K+1)] for i in range(K+1)]); res['K=%d'%K] = float(np.linalg.eigvalsh(T).min())
        toe[p] = dict(m=[round(float(x),6) for x in m[:5]], min_eig=res,
                      theta_exponent=float(max(math.log(abs(m[k])+1e-300)/(k*math.log(p)) for k in range(1,kmax+1))))
    out['rung_toeplitz'] = toe
    out['ramanujan_exponent_max_log|a(n)|/log n_(n>100)'] = float(max(math.log(abs(a[n])+1e-300)/math.log(n) for n in range(101,N+1)))
    R[lab] = out; print(lab, json.dumps(out), flush=True)
# (iv) DH in the Hecke plane: basis chi, chibar (chi(2)=i); U_p acts diag(chi(p), conj chi(p)); Fricke W swaps the lines
chi = {1:1, 2:1j, 3:-1j, 4:-1}
w = np.array([(1-1j*kp)/2, (1+1j*kp)/2])
hp = {}
for p in [2,3,7,11,13,19]:
    U = np.diag([chi[p%5], np.conj(chi[p%5])]); v = U@w
    lam = np.vdot(w,v)/np.vdot(w,w); hp[p] = dict(chi_p=str(chi[p%5]), eigen_residual=float(np.linalg.norm(v-lam*w)/np.linalg.norm(v)))
W = np.array([[0,1],[1,0]]); U2 = np.diag([1j,-1j])
R['DH_hecke_plane'] = dict(per_prime=hp, W_U2_Winv_equals_U2_adjoint=bool(np.allclose(W@U2@W, U2.conj().T)), W_commutes_U2=bool(np.allclose(W@U2, U2@W)))
print(R['DH_hecke_plane'], flush=True)
# (v) ladder Hecke operator: T_q = V_q + V_q^{-1}, (V_q psi)(x) = q^{1/2} psi(q^2 x); Mellin symbol q^{1/2-s}+q^{s-1/2}
psi = lambda x: mp.nsum(lambda n: mp.e**(-mp.pi*n*n*x), [1, mp.inf]) if x > 0.05 else None
def psi_(x):   # psi via theta inversion for small x
    if x >= 1: return sum(mp.e**(-mp.pi*n*n*x) for n in range(1,12))
    return (x**(-mp.mpf(1)/2)*(1+2*psi_(1/x)) - 1)/2
s = mp.mpc(3.2, 1.7); c = mp.mpf('2.2'); lq = mp.log(q)
tq = lambda x: mp.sqrt(q)*psi_(q*q*x) + psi_(x/(q*q))/mp.sqrt(q) + c*psi_(x)
I = mp.quad(lambda x: tq(x)*x**(s/2-1), [0, mp.mpf(1)/100, mp.mpf(1)/10, 1, 3, 10, mp.inf])
xis = mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
R['ladder_hecke_check: Mellin[(V_q+V_q^-1+c)psi]/(xi*(s)(2cosh((s-1/2)log q)+c))'] = ns(I/(xis*(2*mp.cosh((s-mp.mpf(1)/2)*lq)+c)), 15)
print(R, flush=True)
# (vi) torus Hecke: E(tau,s) = sum' y^s/|m tau+n|^{2s};  sum over the p+1 p-isogenous tori = (p^s+p^{1-s}) E
def E(tau, s, M=700):
    m = np.arange(-M, M+1)[:,None]; n = np.arange(-M, M+1)[None,:]
    d = (m*tau.real+n)**2 + (m*tau.imag)**2; d[M,M] = np.inf
    return float((tau.imag**s/d**s).sum())
th = {}
tau = complex(0, 1.3); s0 = 3.0
for p in [2,3,5]:
    nb = [p*tau] + [(tau+j)/p for j in range(p)]
    lhs = sum(E(t, s0) for t in nb); rhs = (p**s0+p**(1-s0))*E(tau, s0)
    js = [mp.kleinj(mp.mpc(t)) for t in nb]
    th[p] = dict(ratio_lhs_over_rhs=lhs/rhs, neighbours=[str(t) for t in nb],
                 imag_j_over_abs_j=[ns(mp.im(j)/abs(j),5) for j in js])
R['torus_hecke_tau=1.3i_s=3'] = th; print(th, flush=True)
json.dump(R, open('hecke.json','w'), indent=1)
