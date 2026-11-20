# Bridge / antibridge block form in one-sided Weil coordinates.
# P_ij = (L(x_i)+L(x_j))/(x_i+x_j)      (bridge = one-sided Weil / log-Pick kernel)
# B_ij = -(L(x_i)-L(x_j))/(x_i-x_j)     (bridge x antibridge coupling; diagonal -L'(x_i))
# Checks: zero-sum factorisations of P+B, P-B; spectra; relative coupling T; DH control.
import sys, json
from mpmath import mp, mpf, mpc, zeta, digamma, log, pi, zetazero, matrix, eigsy, sqrt, dirichlet, diff, re, im, gamma
mp.dps = 40
out = {}

# ---------- zeta: L(w) = (xi'/xi)(1/2+w)
def L_zeta(w):
    s = mpf(1)/2 + w
    return 1/s + 1/(s-1) - log(pi)/2 + digamma(s/2)/2 + zeta(s, derivative=1)/zeta(s)
# ---------- DH: f = (1-i k)/2 L(s,chi) + (1+i k)/2 L(s,chibar), chi(2)=i mod 5
kap = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
chi  = [0, 1, mpc(0,1), mpc(0,-1), -1]
chib = [0, 1, mpc(0,-1), mpc(0,1), -1]
def f_dh(s, d=0):
    return (1-1j*kap)/2*dirichlet(s, chi, d) + (1+1j*kap)/2*dirichlet(s, chib, d)
def L_dh(w):
    s = mpf(1)/2 + w
    return -log(pi/5)/2 + digamma((s+1)/2)/2 + f_dh(s,1)/f_dh(s)
def xi_dh(s):
    return (pi/5)**(-s/2)*gamma((s+1)/2)*f_dh(s)

def kernels(L, nodes, dL=None):
    n = len(nodes); Lv = [L(x) for x in nodes]
    P = matrix(n,n); B = matrix(n,n)
    for i in range(n):
        for j in range(n):
            P[i,j] = (Lv[i]+Lv[j])/(nodes[i]+nodes[j])
            if i == j:
                B[i,j] = -diff(L, nodes[i])
            else:
                B[i,j] = -(Lv[i]-Lv[j])/(nodes[i]-nodes[j])
    return P, B
def rsym(M):
    n = M.rows; R = matrix(n,n)
    for i in range(n):
        for j in range(n): R[i,j] = re(M[i,j])
    return R
def spec(M):
    E = eigsy(rsym(M), eigvals_only=True)
    return [E[i] for i in range(len(E))]
def gen_T(P, B):
    # eigenvalues of T = P^{-1/2} B P^{-1/2}  (needs P > 0)
    from mpmath import cholesky, inverse
    Lc = cholesky(rsym(P)); Li = inverse(Lc)
    T = Li*rsym(B)*Li.T
    T = (T+T.T)/2
    return spec(T)

# ---------- 1. zero-sum identities for zeta
NZ = 400
print("computing", NZ, "zeta zeros ...", flush=True)
mp.dps = 25
gam = [im(zetazero(k)) for k in range(1, NZ+1)]
mp.dps = 40
Tcut = gam[-1]
def even_sum(x, y):
    return 4*x*y*sum(1/((x*x+g*g)*(y*y+g*g)) for g in gam)
def odd_sum(x, y):
    return sum(4*g*g/((x*x+g*g)*(y*y+g*g)) for g in gam)
tail_even = lambda x,y: 4*x*y*(log(Tcut/(2*pi))/(2*pi))/(3*Tcut**3)          # ~ int_T^inf dN/t^4
tail_odd  = (2/pi)*(log(Tcut/(2*pi))+1)/Tcut                                   # ~ int_T^inf 4 dN/t^2
nodes = [mpf(v) for v in ("0.6","0.8","1.1","1.5","2.2","3.5")]
P, B = kernels(L_zeta, nodes)
errs_e = []; errs_o = []
for i in range(len(nodes)):
    for j in range(len(nodes)):
        e = P[i,j]+B[i,j]; o = P[i,j]-B[i,j]
        errs_e.append(abs(e - even_sum(nodes[i],nodes[j])))
        errs_o.append(abs(o - odd_sum(nodes[i],nodes[j]) - tail_odd))
out["zeta_identity"] = dict(n_zeros=NZ, max_abs_err_even=float(max(errs_e)), even_tail_scale=float(tail_even(nodes[-1],nodes[-1])),
    max_abs_err_odd_after_tail=float(max(errs_o)), odd_tail_estimate=float(tail_odd),
    sample_even_00=float(re(P[0,0]+B[0,0])), sample_odd_00=float(re(P[0,0]-B[0,0])))
print(out["zeta_identity"], flush=True)

# ---------- 2. spectra and relative coupling for zeta
mp.dps = 60
P, B = kernels(L_zeta, nodes)
sp = dict(P=spec(P), B=spec(B), even=spec(P+B), odd=spec(P-B))
Tsp = gen_T(P, B)
out["zeta_spectra"] = {k:[float(v) for v in sp[k]] for k in sp}
out["zeta_T_eigs"] = [mp.nstr(v, 20) for v in Tsp]
out["zeta_1_plus_Tmin"] = mp.nstr(1+min(Tsp), 12); out["zeta_1_minus_Tmax"] = mp.nstr(1-max(Tsp), 12)
# single-node relative coupling
sn = {}
for x in ("0.5001","0.6","1","2","5","20"):
    xx = mpf(x); Pv = L_zeta(xx)/xx; Bv = -diff(L_zeta, xx)
    sn[x] = dict(T=mp.nstr(Bv/Pv, 15), RH_bound_on_1_plus_T=mp.nstr(2*xx*xx/(xx*xx+gam[0]**2), 8))
out["zeta_single_node_T"] = sn
print(json.dumps({k:out[k] for k in ("zeta_spectra","zeta_T_eigs","zeta_1_plus_Tmin","zeta_1_minus_Tmax","zeta_single_node_T")}, indent=1), flush=True)

# ---------- 3. DH control
mp.dps = 40
s0 = mpc("0.808517","85.699348")
from mpmath import findroot
rho = findroot(lambda s: f_dh(s), s0)
out["dh_offline_zero"] = mp.nstr(rho, 25)
out["dh_fe_check"] = mp.nstr(abs(xi_dh(mpc("0.3","7.1"))-xi_dh(1-mpc("0.3","7.1")))/abs(xi_dh(mpc("0.3","7.1"))), 5)
out["dh_L_odd_check"] = mp.nstr(abs(L_dh(mpc("0.3","2.0"))+L_dh(-mpc("0.3","2.0"))), 5)
nodes_dh = [mpf(v) for v in ("1.2","1.5","1.9","2.4","3.0","4.0")]
Pd, Bd = kernels(L_dh, nodes_dh)
spd = dict(P=spec(Pd), B=spec(Bd), even=spec(Pd+Bd), odd=spec(Pd-Bd))
out["dh_real_nodes_spectra"] = {k:[float(v) for v in spd[k]] for k in spd}
try:
    out["dh_T_eigs"] = [mp.nstr(v, 20) for v in gen_T(Pd, Bd)]
except Exception as e:
    out["dh_T_eigs"] = "P not positive definite: "+str(e)

# complex-pair even test: nodes {z, conj z}, coefficients (b, conj b);
# W_even = sum_{k,l} c_k c_l * 2*[ (L(a)+L(b))/(a+b) - (L(a)-L(b))/(a-b) ]  (bilinear; equals sum_rho G(rho)^2)
def Keven(L, a, b):
    if a == b: return L(a)/a - diff(L, a)
    return (L(a)+L(b))/(a+b) - (L(a)-L(b))/(a-b)
def Kodd(L, a, b):
    if a == b: return L(a)/a + diff(L, a)
    return (L(a)+L(b))/(a+b) + (L(a)-L(b))/(a-b)
def pair_form(L, z, b, K):
    nd = [z, z.conjugate()]; c = [b, b.conjugate()]
    return sum(c[k]*c[l]*K(L, nd[k], nd[l]) for k in range(2) for l in range(2))
w0 = rho - mpf(1)/2
res = {}
for dl in ("0.05","0.01"):
    z = w0 + mpf(dl)
    row = {}
    for name, b in (("b=1", mpc(1,0)), ("b=i", mpc(0,1)), ("b=e^{i pi/4}", mpc(1,1)/sqrt(2))):
        row[name] = dict(even=mp.nstr(re(pair_form(L_dh, z, b, Keven)), 12), odd=mp.nstr(re(pair_form(L_dh, z, b, Kodd)), 12),
                         imag_resid=mp.nstr(abs(im(pair_form(L_dh, z, b, Keven))), 3))
    res["delta="+dl] = row
out["dh_complex_pair_near_offline_zero"] = res
# same test for zeta near first zero i*gamma_1 + delta
resz = {}
for dl in ("0.05","0.01"):
    z = mpc(0, gam[0]) + mpf(dl); row = {}
    for name, b in (("b=1", mpc(1,0)), ("b=i", mpc(0,1)), ("b=e^{i pi/4}", mpc(1,1)/sqrt(2))):
        row[name] = dict(even=mp.nstr(re(pair_form(L_zeta, z, b, Keven)), 12), odd=mp.nstr(re(pair_form(L_zeta, z, b, Kodd)), 12))
    resz["delta="+dl] = row
out["zeta_complex_pair_near_first_zero"] = resz
# zeta at the DH witness location (same node, same coefficients)
resz2 = {}
z = w0 + mpf("0.05")
for name, b in (("b=1", mpc(1,0)), ("b=i", mpc(0,1)), ("b=e^{i pi/4}", mpc(1,1)/sqrt(2))):
    resz2[name] = dict(even=mp.nstr(re(pair_form(L_zeta, z, b, Keven)), 12), odd=mp.nstr(re(pair_form(L_zeta, z, b, Kodd)), 12))
out["zeta_at_dh_witness_node"] = resz2

# ---------- 4. finite-shift bridge: K^b(x_i,-x_j) is the Wronskian kernel; a->0 limit is -B
from mpmath import zeta as _z
def F_zeta(w):
    s = mpf(1)/2+w
    return s*(s-1)/2*pi**(-s/2)*gamma(s/2)*zeta(s)
a = mpf("1e-6"); x1, x2 = mpf("0.7"), mpf("1.3")
U = lambda x: F_zeta(x+a); V = lambda x: F_zeta(x-a)
cross = (U(x1)*V(x2)-V(x1)*U(x2))/(x1-x2)
lim = 2*a*F_zeta(x1)*F_zeta(x2)*(L_zeta(x1)-L_zeta(x2))/(x1-x2)
refl = (U(x1)*U(-x2)-V(x1)*V(-x2))/(x1+(-x2))
out["finite_shift_cross"] = dict(wronskian_kernel=mp.nstr(cross,15), bridge_at_reflected_node=mp.nstr(refl,15), small_a_limit=mp.nstr(lim,15))
print(json.dumps(out, indent=1))
json.dump(out, open("antibridge_results.json","w"), indent=1)
