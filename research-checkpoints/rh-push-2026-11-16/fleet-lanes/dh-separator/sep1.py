# N=1 complex-rate separator: Q(e^{-zt}) = Re L(z)/Re z.  mpmath, 30 digits. MEASURED.
import mpmath as mp
mp.mp.dps = 30
I = mp.mpc(0,1)
chi=[0,1,I,-I,-1]; chib=[mp.conj(c) for c in chi]
def kap(): return (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def f(s,d=0):
    k=kap(); return ((1-I*k)/2)*mp.dirichlet(s,chi,d)+((1+I*k)/2)*mp.dirichlet(s,chib,d)
def L_dh(z):
    s=mp.mpf(1)/2+z
    return mp.log(5/mp.pi)/2+mp.digamma((s+1)/2)/2+f(s,1)/f(s)
def L_z(z):
    s=mp.mpf(1)/2+z
    return 1/s+1/(s-1)-mp.log(mp.pi)/2+mp.digamma(s/2)/2+mp.zeta(s,1,1)/mp.zeta(s)
if __name__=="__main__":
    w = mp.findroot(f, mp.mpc('0.808517','85.699348'))
    print("DH zero s0 =", mp.nstr(w,20), " centred w0 =", mp.nstr(w-0.5,20))
    d0 = mp.re(w)-mp.mpf(1)/2; g0 = mp.im(w)
    print("\nQ1(z)=Re L(z)/Re z at z=x+i*gamma0;  Q2min = (Re L/x - |L/z|)/2 (worst phase real damped cosine)")
    print("%6s %14s %14s %14s %14s"%("x","Q1_DH","Q2min_DH","Q1_zeta","Q2min_zeta"))
    for x in ['0.02','0.05','0.1','0.15','0.2','0.25','0.28','0.30','0.305','0.3085','0.31','0.32','0.4','0.5']:
        x=mp.mpf(x); z=mp.mpc(x,g0)
        a=L_dh(z); b=L_z(z)
        print("%6s %14s %14s %14s %14s"%(mp.nstr(x,4), mp.nstr(mp.re(a)/x,6), mp.nstr((mp.re(a)/x-abs(a/z))/2,6), mp.nstr(mp.re(b)/x,6), mp.nstr((mp.re(b)/x-abs(b/z))/2,6)))
    print("\nheight profile at x=0.25: t-gamma0, Q1_DH, lens bound sqrt((d0-x)(d0+x))=", mp.nstr(mp.sqrt((d0-0.25)*(d0+0.25)),5))
    for dt in ['-0.5','-0.3','-0.2','-0.15','-0.1','-0.05','0','0.05','0.1','0.15','0.2','0.3','0.5']:
        z=mp.mpc('0.25',g0+mp.mpf(dt)); a=L_dh(z)
        print("  %6s %14s"%(dt, mp.nstr(mp.re(a)/mp.re(z),6)))
    # boundary of negativity along t=gamma0
    xl = mp.findroot(lambda x: mp.re(L_dh(mp.mpc(x,g0))), (mp.mpf('0.01'),mp.mpf('0.3')), solver='anderson')
    print("\nRe L_DH(x+i gamma0)=0 at x =", mp.nstr(xl,10))
