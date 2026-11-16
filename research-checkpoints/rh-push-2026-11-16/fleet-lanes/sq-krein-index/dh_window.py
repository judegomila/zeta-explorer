# Control 1 (DH) and zeta: windowed index.  F(z) = completed function at s = 1/2+z (real on the axis z=it up to a fixed phase, even).
# Counts by the argument principle on the box 0<Re z<X, T1<Im z<T2:
#   Z_D(alpha) = zeros of D = F + alpha F' ;  compared with (N_box(F on [-X,X]) - N_0)/2 and with the axis winding of D.
import mpmath as mp, sys, time
mp.mp.dps = 30
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def dh(s): return 5**(-s)*(mp.zeta(s, mp.mpf(1)/5) + kap*mp.zeta(s, mp.mpf(2)/5) - kap*mp.zeta(s, mp.mpf(3)/5) - mp.zeta(s, mp.mpf(4)/5))
# scaled by exp(pi*Im(s)/4) to keep sizes O(1); the scaling e^{-i pi z/4}... is NOT used: we scale by a real positive function of t only on the axis.
def Fdh(z):
    s = mp.mpf(1)/2 + z
    return mp.exp(-1j*mp.pi*z/4)*0 + (5/mp.pi)**(s/2)*mp.gamma((s+1)/2)*dh(s)
def Fz(z):
    s = mp.mpf(1)/2 + z
    return s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
h = mp.mpf(10)**-10
def FdF(F, z):
    a = F(z+h); b = F(z-h)
    return (a+b)/2, (a-b)/(2*h)
def winding(vals):
    tot = mp.mpf(0)
    for i in range(len(vals)-1):
        d = mp.arg(vals[i+1]/vals[i]); tot += d
        if abs(d) > 1.2: print("   WARNING large step", mp.nstr(d,4))
    return tot/(2*mp.pi)
def path(pts_corner, n):
    out=[]
    for k in range(len(pts_corner)-1):
        a,b = pts_corner[k], pts_corner[k+1]
        m = max(8, int(n*abs(b-a)))
        out += [a+(b-a)*mp.mpf(j)/m for j in range(m)]
    out.append(pts_corner[-1]); return out
def run(name, F, T1, T2, X, alphas, dens=40):
    t0=time.time()
    # right box boundary (counter-clockwise), left edge on the axis
    box = path([mp.mpc(0,T1), mp.mpc(X,T1), mp.mpc(X,T2), mp.mpc(0,T2), mp.mpc(0,T1)], dens)
    vals = [FdF(F,z) for z in box]
    # axis samples for sign changes of f and axis winding
    nax = int((T2-T1)*dens); ax = [mp.mpc(0, T1+(T2-T1)*mp.mpf(j)/nax) for j in range(nax+1)]
    axv = [FdF(F,z) for z in ax]
    ph = axv[0][0]/abs(axv[0][0])   # F is real on the axis up to a constant phase (checked below)
    fr = [(v[0]/ph) for v in axv]
    maxim = max(abs(x.imag)/abs(x) for x in fr)
    N0 = sum(1 for i in range(nax) if fr[i].real*fr[i+1].real < 0)
    # full symmetric box for F
    fb = path([mp.mpc(-X,T1), mp.mpc(X,T1), mp.mpc(X,T2), mp.mpc(-X,T2), mp.mpc(-X,T1)], dens)
    NF = winding([F(z) for z in fb])
    print("%s window t in [%s,%s], X=%s: zeros of F in |Re z|<X: %s ; sign changes on axis N0=%d ; (N-N0)/2 = %s   [axis reality defect %s]" % (name, T1, T2, X, mp.nstr(NF,8), N0, mp.nstr((NF-N0)/2,8), mp.nstr(maxim,3)))
    for al in alphas:
        al = mp.mpf(al)
        ZD = winding([v[0]+al*v[1] for v in vals])
        wax = winding([v[0]+al*v[1] for v in axv])*2   # in units of pi
        print("   alpha=%-6s zeros of D in right box: %s   axis Delta arg D / pi = %s" % (mp.nstr(al,4), mp.nstr(ZD,8), mp.nstr(wax,8)))
    print("   (%.0fs)" % (time.time()-t0)); sys.stdout.flush()
run("DH  ", Fdh, mp.mpf(80), mp.mpf(120), mp.mpf(3), ['0.02','0.5','5','100'])
run("zeta", Fz,  mp.mpf(80), mp.mpf(120), mp.mpf(3), ['0.02','0.5','5','100'])
run("DH  ", Fdh, mp.mpf(10), mp.mpf(200), mp.mpf(3), ['0.2','3'], dens=30)
