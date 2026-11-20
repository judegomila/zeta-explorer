import sys; sys.path.insert(0,'.')
import numpy as np, lines
from flint import acb, arb, ctx, acb_series
ctx.prec=200
def comp(code,s):
    if code=='ZETA': return s*(s-1)*(-s/2*arb.pi().log()).exp()*(s/2).gamma()*s.zeta()
    if code=='DH':
        r5=arb(5).sqrt();k=((10-2*r5).sqrt()-2)/(r5-1)
        return (s/2*(5/arb.pi()).log()).exp()*((s+1)/2).gamma()*(s.zeta(arb(1)/5)+k*s.zeta(arb(2)/5)-k*s.zeta(arb(3)/5)-s.zeta(arb(4)/5))*(-s*arb(5).log()).exp()
    if code=='LCHI3':
        return ((s+1)/2*(3/arb.pi()).log()).exp()*((s+1)/2).gamma()*(s.zeta(arb(1)/3)-s.zeta(arb(2)/3))*(-s*arb(3).log()).exp()
if __name__=='__main__':
    for code,T0 in [('ZETA',30.0),('DH',84.0),('LCHI3',50.0),('ZETA',5000.0)]:
        o=lines.compute(code,T0,2.0,0.005,0.5,workers=4)
        y=o['y']
        for j in [7, 211, 403]:
            for x in [0.05,0.25]:
                s0=acb(0.5+x,float(y[j])); xs=acb_series([s0,1],prec=3); f=comp(code,xs)
                L=complex(f[1]/f[0]); Lp=complex(2*f[2]/f[0]-(f[1]/f[0])**2)
                la=float((abs(f[0])).log())
                print(code,T0,x,j,abs(o['x%g_L'%x][j]-L),abs(o['x%g_Lp'%x][j]-Lp)/abs(Lp),abs(o['x%g_logabs'%x][j]-la))
            s0=acb(0.5,float(y[j])); xs=acb_series([s0,1],prec=3); f=comp(code,xs)
            # Xi(y)=F(1/2+iy): Xi' = i F', Xi''=-F''
            X0=complex(f[0]);X1=complex(1j*complex(f[1]));X2=-2*complex(f[2])
            lag=(X1*X1-X0*X2)/(X0*X0+X1*X1)
            A=o['x0_A'][j];P1=o['x0_P1'][j];P2=o['x0_P2'][j]
            lag2=(P1*P1-A*P2)/(A*A+P1*P1)
            print('  axis',code,T0,j,lag,lag2)
