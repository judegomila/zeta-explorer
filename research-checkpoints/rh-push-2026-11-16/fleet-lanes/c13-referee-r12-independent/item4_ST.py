# Independent check of the numerical inputs to Lemmas S and T (c12-heat-tied-family-open-cell), q = 5, 7, 13.
# (S) one zero of the entire numerator N(s) = sum_chi prod_{chi' != chi} X(chi'), X(chi)=L(s,chi)L(2-s,conj chi),
#     certified by Rouche (Cauchy bounds from a wide-ball enclosure), with every X(chi) != 0 on the disc,
#     so w0 = N / prod X has exactly one zero in the disc.  Different method from the lane (winding of w0 on a square).
# (T) S_v(t), S_w(t) on Re s = 1/2 evaluated in Arb; first certified negative value on my own grid.
import sys, math, time
from flint import acb, arb, ctx, dirichlet_char
def conj_n(q,n): return pow(n,-1,q)
def fam(q,parity): return [n for n in range(2,q) if dirichlet_char(q,n).parity()==parity]
class Fam:
    def __init__(s,q,ns):
        s.q=q; s.ns=ns; s.ch={n:dirichlet_char(q,n) for n in set(ns)|{conj_n(q,n) for n in ns}}
        s.a=s.ch[ns[0]].parity()
        assert all(s.ch[n].parity()==s.a for n in ns)
    def X(s,n,z): return s.ch[n].l(z)*s.ch[conj_n(s.q,n)].l(2-z)
    def Xs(s,z): return [s.X(n,z) for n in s.ns]
    def N(s,z):
        xs=s.Xs(z); tot=acb(0)
        for i in range(len(xs)):
            pr=acb(1)
            for j in range(len(xs)):
                if j!=i: pr*=xs[j]
            tot+=pr
        return tot
    def w0(s,z):
        tot=acb(0)
        for x in s.Xs(z): tot+=1/x
        return tot
    def xi(s,n,z):
        return (arb(s.q)/arb.pi())**(z/2)*((z+s.a)/2).gamma()*s.ch[n].l(z)
    def Sv_Sw(s,t):
        z1=acb(arb(1)/2,t); z2=acb(arb(3)/2,t)
        sv=acb(0); sw=acb(0)
        for n in s.ns:
            p=s.xi(n,z1)*s.xi(n,z2).conjugate()
            sv+=p; sw+=1/p
        return sv.real, sw.real
def mid(z): return acb(z.real.mid(),z.imag.mid())
def certify(F,guess,label):
    ctx.prec=300
    z=acb(guess.real,guess.imag); h=acb(arb(10)**-30)
    for _ in range(40):
        v=F.w0(z); dv=(F.w0(z+h)-F.w0(z-h))/(2*h)
        st=v/dv; z=mid(z-st)
        if abs(complex(st))<1e-70: break
    c=z
    R=arb('1e-3'); r=arb('1e-9'); hh=arb('1e-20')
    wide=acb(arb(c.real.mid(),1e-3),arb(c.imag.mid(),1e-3))      # square containing disc |s-c|<=R
    M=abs(F.N(wide)).upper()
    Nc=abs(F.N(c)).upper()
    d=(F.N(c+acb(hh))-F.N(c-acb(hh)))/(2*hh)
    derr=M*hh**2/R**3/(1-(hh/R)**2)
    rem=M*(r/R)**2/(1-r/R)
    lhs=arb(Nc)+derr*r+rem
    rhs=abs(d).lower()*r
    ok_rouche = bool(lhs<arb(rhs))
    small=acb(arb(c.real.mid(),1e-9),arb(c.imag.mid(),1e-9))
    xs=F.Xs(small); ok_den=all(not x.contains(0) and x.is_finite() for x in xs)
    in_strip = bool(c.real-r>arb(1)/2) and bool(c.real+r<arb(3)/2)
    print(f"[S] {label}: zero of w0 at {c.real.str(22,radius=False)} + {c.imag.str(22,radius=False)} i ; |N(c)|<={float(Nc):.2e} M<={float(M):.3g} |N'(c)|>={float(abs(d).lower()):.3g} Rouche(one zero of N in |s-c|<1e-9)={ok_rouche} denominators_nonzero_on_disc={ok_den} disc_inside_strip={in_strip} minRe-1/2>={float((c.real-r-arb(1)/2).lower()):.6f}")
    return ok_rouche and ok_den and in_strip
def scan(F,label,T,step=0.05,off=0.013):
    ctx.prec=128
    fv=fw=None; und=0; nneg_v=0; n=0; minv=None
    t=off
    while t<=T:
        sv,sw=F.Sv_Sw(arb(t)); n+=1
        if sv<0:
            nneg_v+=1
            if fv is None: fv=(t,sv)
        elif not sv>0: und+=1
        if sw<0:
            if fw is None: fw=(t,sw)
        elif not sw>0: und+=1
        t=round(t+step,6)
    print(f"[T] {label}: grid {off}+{step}k to {T}: first certified S_v<0 at t={fv[0] if fv else None} value {fv[1].str(8) if fv else ''}; first certified S_w<0 at t={fw[0] if fw else None} value {fw[1].str(8) if fw else ''}; fraction S_v<0 = {nneg_v/n:.3f}; undetermined signs={und}")
    return fv,fw
t0=time.time()
allok=True
F5=Fam(5,[2,3]); F7e=Fam(7,[2,4]); F7o=Fam(7,[3,5,6]); F7op=Fam(7,[3,5]); F13o=Fam(13,fam(13,1)); F13e=Fam(13,fam(13,0)); F13p=Fam(13,[2,7])
print("families:",{k:v.ns for k,v in dict(q5pair=F5,q7even=F7e,q7odd3=F7o,q13odd=F13o,q13even=F13e,q13pair=F13p).items()})
print("orders q7 even pair:",[dirichlet_char(7,n).order() for n in (2,4)],"q13 odd count",len(F13o.ns),"even",len(F13e.ns))
allok&=certify(F5,acb('0.5102208213939666302655','77.2289925269322087901733'),"q=5 pair")
allok&=certify(F7e,acb('0.5054676842298626','62.0637973223254559'),"q=7 even pair")
allok&=certify(F7o,acb('0.5085957730951408','17.4811128503728930'),"q=7 three odd")
allok&=certify(F13o,acb('0.5066815768421099','5.7567776952144580'),"q=13 six odd")
allok&=certify(F13e,acb('0.5083033922110508','10.4820929394352770'),"q=13 five even")
print("all Lemma-S certificates:",allok, "elapsed",round(time.time()-t0,1))
# pair identity: w0=0 iff v=0 ; check v at the q=5 zero
for F,lab,T in ((F5,"q=5 pair",40),(F7e,"q=7 even pair",40),(F7op,"q=7 odd complex pair",40),(F7o,"q=7 three odd",40),(F13p,"q=13 pair {2,7}",40),(F13e,"q=13 five even",40),(F13o,"q=13 six odd",40)):
    scan(F,lab,T)
# single functions: zeta, and q=5 one character
class Z:
    def Sv_Sw(s,t):
        def xi(z): return z*(z-1)*arb.pi()**(-z/2)*(z/2).gamma()*z.zeta()
        p=xi(acb(arb(1)/2,t))*xi(acb(arb(3)/2,t)).conjugate(); return p.real,(1/p).real
scan(Z(),"zeta alone (xi with s(s-1))",40)
scan(Fam(5,[2]),"q=5 one character",40)
print("elapsed",round(time.time()-t0,1))
