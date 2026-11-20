# DH kernel K_DH(u) = e^{3u} theta(e^{4u}), theta(x) = sum n a(n) exp(-pi n^2 x/5); a = (1,kap,-kap,-1,0) mod 5.
# Checks: (1) evenness (functional equation), (2) positivity, (3) Csordas-type convexity of V(t) = -log K(sqrt t),
# (4) transform normalisation against Lambda_DH, (5) same for zeta Phi as control.
from mpmath import mp, mpf, pi, exp, sqrt, log, diff, quad, cosh, gamma, dirichlet, mpc, linspace, zeta
mp.dps = 40
s5 = sqrt(5); kap = (sqrt(10-2*s5)-2)/(s5-1)
a = [0, 1, kap, -kap, -1]
def Kdh(u):
    y = exp(4*u); return exp(3*u)*sum(n*a[n % 5]*exp(-pi*n*n*y/5) for n in range(1, 60) if n % 5)
def Kz(u):
    return sum((2*pi**2*n**4*exp(9*u)-3*pi*n**2*exp(5*u))*exp(-pi*n**2*exp(4*u)) for n in range(1, 12))
print('evenness DH  max |K(u)/K(-u)-1| :', mp.nstr(max(abs(Kdh(u)/Kdh(-u)-1) for u in [mpf(j)/20 for j in range(1, 16)]), 5))
I = mpc(0, 1)
chi = [0, 1, I, -I, -1]; chib = [0, 1, -I, I, -1]
def Lam(s):
    f = ((1-I*kap)/2)*dirichlet(s, chi) + ((1+I*kap)/2)*dirichlet(s, chib)
    return (5/pi)**(s/2)*gamma((s+1)/2)*f
for z in [mpf('0.3'), mpc(0.2, 3)]:
    tr = quad(lambda u: 2*Kdh(u)*cosh(2*z*u), linspace(0, 2, 9))
    print("transform/Lambda_DH(1/2+z) / (sqrt(5/pi)/4):", mp.nstr(tr/Lam(mpf(1)/2+z)/(sqrt(5/pi)/4), 15))
def conv_scan(K, name, tmax, n=4000):
    V = lambda t: -log(K(sqrt(t)))
    worst = None; neg = []
    for j in range(1, n+1):
        t = mpf(j)*tmax/n
        v2 = diff(V, t, 2)
        if worst is None or v2 < worst[1]: worst = (t, v2)
        if v2 <= 0: neg.append(t)
    print(name, ' min V\'\'(t) on (0,%s]:' % tmax, mp.nstr(worst[1], 8), 'at t=', mp.nstr(worst[0], 6), ' #nonconvex samples:', len(neg),
          ('first/last %s %s' % (mp.nstr(neg[0], 5), mp.nstr(neg[-1], 5)) if neg else ''))
mp.dps = 30
# positivity
print('min K_DH on [0,1.5]:', mp.nstr(min(Kdh(mpf(j)/200) for j in range(0, 301)), 6), ' K_DH(0)=', mp.nstr(Kdh(0), 10))
conv_scan(Kz, 'zeta', mpf('1.0'), 400)
conv_scan(Kdh, 'DH  ', mpf('1.5'), 600)
