# checks: (a) X_0 against Arb zeta; (b) step halving at t = 30, 500; (c) located off-line zero for tau = -0.5; (d) c11 value at zero 34.
from flint import arb, acb, ctx
import cell1
from cell1 import Heat
F0=Heat('0'); ctx.prec=cell1.PREC
def xi(s): return s*(s-1)*(-(s/2)*arb.pi().log()).exp()*(s/2).gamma()*s.zeta()
for s in (acb(0.5,30),acb(1.5,111.03),acb(0.5,499.3),acb(1.5,499.3)):
    a=F0.X(s); b=xi(s)/2; print('X_0 vs xi/2 at',complex(s),'rel diff',float(abs(a-b)/abs(b)), 'rad/|val|',float(a.rad()/abs(b)))
G=Heat('-0.5','0.001'); F=Heat('-0.5')
for s in (acb(0.5,30),acb(1.5,499.3)):
    a=F.X(s); b=G.X(s); print('tau=-0.5 step 0.002 vs 0.001 at',complex(s),'rel diff',float(abs(a-b)/abs(b)))
z=acb('0.1981079','150.6922461')+acb(1)/2
print('tau=-0.5 at mapped zero s=1/2+z:',float(abs(F.X(z))),'vs nearby',float(abs(F.X(z+acb('0.01')))))
import mpmath
g=arb(str(mpmath.mp.mpf(mpmath.zetazero(34).imag)))
mpmath.mp.dps=40; g=arb(mpmath.nstr(mpmath.zetazero(34).imag,38)); rho=acb(arb(1)/2,g)
d=F0.dH(g); xv=F0.X(rho+1)
print('c11 (3.2) = -Re{xi\'(rho34) xi(rho34+1)} from heat code (x4):', (4*d*xv.imag).str(15), ' q_1 =',float((-(d/abs(d))*xv.imag/abs(xv)).mid()))
