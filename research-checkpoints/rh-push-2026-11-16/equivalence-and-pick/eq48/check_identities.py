# Small-scale numerical audit of the three identities used in RESULT.md:
#  (I1) Q_L(v) = Pick quadratic form
#  (I2) PR48 eq (13): Q_L = E_gamma + pole - 2c0||v||^2 - 2 sum Lambda(n)/sqrt(n) C_v(log n)
#  (I3) PR50 eq (1.7): Q_L = sum_rho V(rho) conj V(-conj rho)  (zeros from mpmath.zetazero)
#  (I4) margin failure: V_M = W(z)*((a+5/2)/(z+a))^M, Q_L/|V(5/2)|^2 -> 0
import mpmath as mp
mp.mp.dps = 30
def L(p):
    s = mp.mpf(1)/2 + p
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
x = [mp.mpf(2), mp.mpf('2.7'), mp.mpf('3.5')]
b = [mp.mpf(1), mp.mpf('-2.5'), mp.mpf('1.5')]
N = len(x); Lx = [L(t) for t in x]
QL = sum(b[i]*b[j]*(Lx[i]+Lx[j])/(x[i]+x[j]) for i in range(N) for j in range(N))
print("Q_L (Pick)        =", mp.nstr(QL, 15))
V = lambda z: sum(b[j]/(z+x[j]) for j in range(N))
# gamma energy
def term(k):
    lam = 2*k + mp.mpf(5)/2
    H2 = sum(b[i]*b[j]*x[i]*x[j]/((x[i]+lam)*(x[j]+lam)*(x[i]+x[j])) for i in range(N) for j in range(N))
    return V(lam)**2 + 2/lam*H2
Eg = mp.nsum(term, [0, mp.inf])
h = mp.mpf(1)/2
J2 = sum(b[i]*b[j]/((x[i]-h)*(x[j]-h)*(x[i]+x[j])) for i in range(N) for j in range(N))
pole = V(-h)**2 - J2
c0 = (mp.log(mp.pi) - mp.digamma(mp.mpf(5)/4))/2
v2 = sum(b[i]*b[j]/(x[i]+x[j]) for i in range(N) for j in range(N))
Cv = lambda l: sum(b[i]*b[j]*mp.exp(-x[i]*l)/(x[i]+x[j]) for i in range(N) for j in range(N))
# von Mangoldt via sieve
NMAX = 200000
import math
lam_ = [0.0]*(NMAX+1)
isp = bytearray([1])*(NMAX+1); isp[0]=isp[1]=0
for p in range(2, NMAX+1):
    if isp[p]:
        for q in range(p*p, NMAX+1, p): isp[q]=0
        pk = p
        while pk <= NMAX:
            lam_[pk] = math.log(p); pk *= p
# C_v(log n) = sum_ij coef_i n^{-x_i}; use floats for speed (terms are tiny)
coef = [float(sum(b[i]*b[j]/(x[i]+x[j]) for j in range(N))) for i in range(N)]
xf = [float(t) for t in x]
prime = 0.0
for n in range(2, NMAX+1):
    if lam_[n]:
        prime += lam_[n]/math.sqrt(n)*sum(coef[i]*n**(-xf[i]) for i in range(N))
RHS = Eg + pole - 2*c0*v2 - 2*prime
print("RHS of PR48 (13)  =", mp.nstr(RHS, 15), " diff", mp.nstr(QL-RHS, 3), "(prime tail bound ~ N^{-2}log N ~ 3e-10)")
# (1.7) under the computed zeros (all on the line numerically): sum 2|V(i gamma)|^2
K = 300
zsum = mp.mpf(0)
for k in range(1, K+1):
    g = mp.im(mp.zetazero(k))
    zsum += 2*abs(V(1j*g))**2
print("zero-side sum (first %d zeros) =" % K, mp.nstr(zsum, 15), " diff", mp.nstr(QL-zsum, 3), "(tail since sum b=0 is O(gamma_K^-3))")
# (I4) margin failure: W vanishes at first m zero pairs, a=1, test V_M(z) = W(z)*((a+2.5)/(z+a))^M
a = mp.mpf(1); m = 3
gam = [mp.im(mp.zetazero(k)) for k in range(1, m+1)]
W = lambda z: mp.fprod([z**2 + g**2 for g in gam])
for M in [8, 16, 32, 64]:
    VM = lambda z: W(z)*((a+mp.mpf(5)/2)/(z+a))**M
    q = sum(2*abs(VM(1j*mp.im(mp.zetazero(k))))**2 for k in range(m+1, 120))
    print("M=%d  Q_L(V_M) (zeros 4..119) / |V_M(5/2)|^2 =" % M, mp.nstr(q/abs(VM(mp.mpf(5)/2))**2, 6))
