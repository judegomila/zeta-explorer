import numpy as np, math, mpmath as mp, kern
mp.mp.dps = 40
u = np.array([-1.3, -0.2, 0.05, 0.4, 1.7, 2.5])
J = kern.ZETA.jets(u, 4, True)
def Kz(x): return mp.exp(x/2)*mp.jtheta(3, 0, mp.exp(-mp.pi*mp.exp(2*x)))
for k in range(5):
    ref = [float(mp.diff(Kz, float(x), k)) for x in u]
    print('zeta pol', k, np.max(np.abs(J[k]-ref)/np.abs(ref)))
J3 = kern.ZETA.jets(u, 2, False)
def K3(x): return mp.diff(Kz, x, 2) - Kz(x)/4
def Phi(x): return mp.nsum(lambda n: (4*mp.pi**2*n**4*mp.exp(9*x/2) - 6*mp.pi*n**2*mp.exp(5*x/2))*mp.exp(-mp.pi*n**2*mp.exp(2*x)), [1, mp.inf])
print('K3 vs closed form', [float(J3[0][i]/Phi(float(u[i]))) for i in range(1,5)])
# characters
cnt = {}
for q in range(3, 14):
    r = kern.primitive_reps(q); cnt[q] = (sum(1 for x in r if x[2]), sum(1 for x in r if not x[2]))
print(cnt)
for q in (5, 7, 13):
    for m, v, real in kern.primitive_reps(q):
        c = kern.Chi(q, v, 'chi%d.%d' % (q, m))
        print(q, m, real, c.d, c.eps, c.eps_check, c.omega)
# E_a check against c12: E*(i, 0.7) = -2.33099381341482
e = kern.EA(0.2, 'EA')
print('E*(i,0.7)', e.jets(np.array([0.0]), 0, True)[0, 0])
h = kern.Heat(0.0, 'H0')
Jh = h.jets(u, 4, True); Jz = kern.ZETA.jets(u, 4, True)
print('heat tau=0 vs zeta', np.max(np.abs(Jh-Jz)/np.abs(Jz)))
t = kern.ThetaW(1.0, 'T1')
print('theta^1 vs zeta', np.max(np.abs(t.jets(u,4,True)-Jz)/np.abs(Jz)), np.max(np.abs(t.jets(u,2,False)-J3)/np.abs(J3)))
