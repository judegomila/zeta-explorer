from klein_index import *
D = Field('dh')
def G(t, tau):
    D.set_tau(tau); s = abs(D.hzz(t)); return re(D.h(t))/s, re(D.hz(t))/s
sol = findroot(G, (mpf('85.6175'), mpf('0.1765')), tol=mpf(10)**-30, maxsteps=100)
t, tau = sol[0], sol[1]
D.set_tau(tau); hzz = re(D.hzz(t))
print('t*=', mp.nstr(t, 20), 'tau*=', mp.nstr(tau, 20))
print('h/|hzz|=', mp.nstr(re(D.h(t))/abs(hzz), 5), 'h_t/|hzz|=', mp.nstr(re(D.hz(t))/abs(hzz), 5), 'hzz=', mp.nstr(hzz, 8))
# local law x^2 = (tau*-tau)/2 check
for d in ['0.002', '0.001']:
    D.set_tau(tau-mpf(d)); z = findroot(D.h, mpc(t, -sqrt(mpf(d)/2)))
    print('tau*-', d, ': x^2/(dtau/2)=', mp.nstr(im(z)**2/(mpf(d)/2), 8))
    D.set_tau(tau+mpf(d)); z = findroot(lambda y: re(D.h(y)), t+sqrt(mpf(d)/2))
    print('tau*+', d, ': (t-t*)^2/(dtau/2)=', mp.nstr((z-t)**2/(mpf(d)/2), 8))
