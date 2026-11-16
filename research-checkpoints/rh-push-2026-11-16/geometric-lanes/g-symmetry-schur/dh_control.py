# Davenport-Heilbronn control for the symmetry lane (see RESULT.md section 6).
import mpmath as mp, json, sys
mp.mp.dps = 30
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
a = [0, 1, kap, -kap, -1]
def theta_d(x, N=60):                 # theta, theta', theta'' with theta(x)=sum n a(n) e^{-pi n^2 x/5}
    s0=s1=s2=mp.mpf(0)
    for n in range(1, N):
        if n%5==0: continue
        c = mp.pi*n*n/5
        e = n*a[n%5]*mp.e**(-c*x)
        s0 += e; s1 += -c*e; s2 += c*c*e
        if c*x > 90: break
    return s0, s1, s2
def Phi(y):
    return mp.e**(1.5*y)*theta_d(mp.e**(2*y), N=400)[0]
res = {}
res['evenness_max_rel_err'] = mp.nstr(max(abs(Phi(y)-Phi(-y))/Phi(y) for y in [mp.mpf(k)/10 for k in range(1,9)]), 5)
vals = [Phi(mp.mpf(k)/200) for k in range(0, 601)]
res['min_Phi_on_[0,3]'] = mp.nstr(min(vals), 8); res['Phi(0)'] = mp.nstr(vals[0], 12)
res['Phi_monotone_decreasing_on_[0,3]'] = all(vals[i+1] < vals[i] for i in range(600))
def Vpp(t):
    y = mp.sqrt(t); x = mp.e**(2*y)
    th, th1, th2 = theta_d(x, N=400)
    P1 = 1.5 + 2*x*th1/th
    P2 = 4*x*th1/th + 4*x*x*(th2/th - (th1/th)**2)
    return (-P2 + P1/y)/(4*y*y)
ts = [mp.mpf(k)/100 for k in range(1, 901)]
vpp = [Vpp(t) for t in ts]
res['min_Vpp_on_[0.01,9]'] = mp.nstr(min(vpp), 8); res['argmin_t'] = mp.nstr(ts[vpp.index(min(vpp))], 4)
res['Vpp_samples'] = {mp.nstr(t,3): mp.nstr(v,6) for t, v in list(zip(ts, vpp))[::100]}
res['Vpp(1e-6)'] = mp.nstr(Vpp(mp.mpf('1e-6')), 8)
print(json.dumps(res, indent=1)); sys.stdout.flush()
def dh(s): return 5**(-s)*sum(a[k]*mp.zeta(s, mp.mpf(k)/5) for k in range(1,5))
def Lam(s): return (5/mp.pi)**(s/2)*mp.gamma((s+1)/2)*dh(s)
s = mp.mpc(0.3,7)
res['FE |Lam(s)-Lam(1-s)|/|Lam(s)|'] = mp.nstr(abs(Lam(s)-Lam(1-s))/abs(Lam(s)), 5)
res['reality Im/Re of Lam(1/2+10i)'] = mp.nstr(mp.im(Lam(0.5+10j))/mp.re(Lam(0.5+10j)), 5)
res['conj |Lam(conj s)-conj Lam(s)|/|Lam|'] = mp.nstr(abs(Lam(mp.conj(s))-mp.conj(Lam(s)))/abs(Lam(s)), 5)
f10 = 2*mp.quad(lambda y: Phi(y)*mp.cos(10*y), mp.linspace(0, 3, 13))
res['theta_integral / Lam(1/2+10i)'] = mp.nstr(f10/Lam(0.5+10j), 15)
rho = mp.findroot(dh, mp.mpc('0.808517','85.699348'))
res['offline_zero'] = mp.nstr(rho, 12)
f = lambda t: mp.re(Lam(mp.mpc(0.5, t)))
rows = []
for k in range(0, 31):
    t = mp.mpf(84) + mp.mpf(k)/10
    f0, f1, f2 = f(t), mp.diff(f, t, 1, h=mp.mpf('1e-6')), mp.diff(f, t, 2, h=mp.mpf('1e-6'))
    W = f1*f1 - f0*f2; sc = f1*f1 + abs(f0*f2)
    rows.append((float(t), float((W + f0*f1/t)/sc), float((W - f0*f1/t)/sc)))
res['DH_diagonals (t, C_-(t,t)/scale, C_+(t,t)/scale)'] = rows
res['DH_most_negative_Cminus'] = min(rows, key=lambda r: r[1])
res['DH_most_negative_Cplus'] = min(rows, key=lambda r: r[2])
print(json.dumps(res, indent=1)); json.dump(res, open('dh_control.json','w'), indent=1)
