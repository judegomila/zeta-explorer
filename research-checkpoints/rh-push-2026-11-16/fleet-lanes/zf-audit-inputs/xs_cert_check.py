from fractions import Fraction as F
def setup(k,b,l):
    lx=(1-b-l)/2; ly=(1+b-l)/2; h=(1+b+3*l)/2; B=F(11,12)-l/4
    return lx,ly,h,B
def E(k,b,l,d,x):
    lx,ly,h,B=[float(v) for v in setup(k,b,l)]
    k=float(k);b=float(b);l=float(l)
    c=1/(3*k); a=5/6
    D=3-(1+2*c)*x; P=(2-2*c*x)*(1-x); J=(a-d)*D+d*P
    R=1-d+(a-d)*d*P/(2*J)
    C0=-0.25+b/6+5*l/4
    return C0+d/2+d*x*(l+c*(h/4-ly/2))-0.75*h*(1-R)
for name,(k,b,l,g) in {'stage0':(F(3,4),F(173,2000),F(10027,60000),1e-6),'stage1':(F(29991,40000),F(17307,200000),F(1253399,7500000),1e-7)}.items():
    lx,ly,h,B=setup(k,b,l)
    print(name,'B=',B,float(B),'lx',lx,'ly',ly,'h',h,'(1+k)/2=',(1+k)/2)
    print('  lx>l',lx>l,' ly-l>11b/6',ly-l>11*b/6,' 6kl>3/4',6*k*l>F(3,4),' l/h',float(l/h),' l/(h+zeta)>21/100',l/(h+F(1,10**7))>F(21,100),' B>87/100',B>F(87,100))
    def mx(dlo,dhi,xlo,xhi,n):
        best=(-9,0,0)
        for a in range(n+1):
            dv=dlo+(dhi-dlo)*a/n
            for c in range(n+1):
                xv=xlo+(xhi-xlo)*c/n
                v=E(k,b,l,dv,xv)
                if v>best[0]: best=(v,dv,xv)
        return best
    v,d0,x0=mx(1/8,5/6,0,0.5,600)
    for it in range(5):
        w=3e-3/10**it
        v,d0,x0=mx(max(1/8,d0-w),min(5/6,d0+w),max(0,x0-w),min(.5,x0+w),200)
    print('  max E =',v,'at delta,x=',d0,x0,' need <= -g =',-g, v<=-g)
