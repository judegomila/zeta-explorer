from mpmath import mp, mpf, log, sinh, quad, pi, exp, findroot, cos, atan, sqrt, euler
mp.dps = 25
H = mpf('3000175332800')
def Rs(t):  return mpf('0.137')*log(t)+mpf('0.443')*log(log(t))+mpf('1.588')   # Rosser 1941
def Rsp(t): return mpf('0.137')/t+mpf('0.443')/(t*log(t))
def Qlow(n):
    tail = mpf('2.05')*Rs(n)/n**2
    return mpf('0.9166')*n**2*((log(n/(2*pi))+1)/(2*pi*n) - tail)
def Eup(n, c, H=H):
    g = lambda t: 4*sinh(n*c/(4*t*t))**2
    L = n*c/(2*H*H)
    pts = [H*(1+mpf(k)/(8*max(L,1))) for k in range(0,81,4)] + [3*H, 10*H, 100*H, mp.inf]
    I = quad(lambda t: g(t)*(log(t/(2*pi))/(2*pi)+Rsp(t)), pts)
    return I + 2*g(H)*Rs(H)
def nstar(c, H=H):
    f = lambda L: log(Eup(2*H*H*L/c, c, H)) - log(Qlow(2*H*H*L/c))
    lo, hi = mpf(5), mpf(120)
    for _ in range(34):
        mid = (lo+hi)/2
        if f(mid) < 0: lo = mid
        else: hi = mid
    return lo, 2*H*H*lo/c
for name, th in [('theta=1 (classical strip)', mpf(1)), ('theta=7/8', mpf(7)/8), ('theta=0.874887 (unrefereed)', mpf('0.874887'))]:
    c = 2*th-1
    L, n = nstar(c)
    print(name, 'c=', mp.nstr(c,8), 'L*=', mp.nstr(L,10), 'n*=', mp.nstr(n,10), 'n*/H^2=', mp.nstr(n/H**2,8), 'n*/(H^2 log H)=', mp.nstr(n/(H*H*log(H)),8))
    print('   check E/Q at n*:', mp.nstr(Eup(n,c)/Qlow(n),6), ' at 0.5 n*:', mp.nstr(Eup(n/2,c)/Qlow(n/2),6))
print('tailcheck', [mp.nstr(quad(lambda t: 2*Rs(t)/t**3,[n,10*n,1000*n,mp.inf])*n*n/Rs(n),8) for n in (mpf(100),mpf(10)**6,mpf(10)**26)]); print('log H', log(H), 'H^2', H*H)
# single-quadruple twin: first n where 2(r^-n + r^n - 2) > (n/2)(log(n/2pi)-1+gamma)+ C sqrt(n) log n   (RH assumed for zeta)
def twin(c, g0):
    f = lambda n: log(2*(exp(n*c/(2*g0*g0))-2)) - log(0.5*n*(log(n/(2*pi))-1+euler)+ 4 + sqrt(n)*log(n))
    lo, hi = mpf(10)*g0*g0/c, mpf(400)*g0*g0/c
    for _ in range(100):
        mid=(lo+hi)/2
        if f(mid)<0: lo=mid
        else: hi=mid
    return lo
for th in [mpf(1), mpf(7)/8]:
    c=2*th-1; n1=twin(c,H)
    print('single-quadruple twin theta',mp.nstr(th,5),'n1=',mp.nstr(n1,10),'n1/(H^2 log H)=',mp.nstr(n1/(H*H*log(H)),8))
# DH: first off-line zero 0.808517+85.699348i ; conductor 5
c=2*mpf('0.808517')-1; g0=mpf('85.699348')
f = lambda n: log(2*(exp(n*c/(2*g0*g0))-2)) - log(0.5*n*(log(5*n/(2*pi))-1+euler))
lo,hi=mpf(1e4),mpf(1e7)
for _ in range(100):
    mid=(lo+hi)/2
    if f(mid)<0: lo=mid
    else: hi=mid
print('DH estimated first negative Li index ~', mp.nstr(lo,8))
