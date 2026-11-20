"""Owned full-theta integrated local-innovation and variance payment test."""
import sys,json,math
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_series,ctx
ctx.prec=160;ctx.cap=9
N=int(sys.argv[1]) if len(sys.argv)>1 else 8000
pi=arb.pi();h=arb_series([0,1],9)
C=1024*math.factorial(8)*4**8
assert (arb(1)/2)*(1-arb(3)/(2*pi))**(-9)<400
assert 3*400/pi<512
assert (arb(10)/9)**20*(-19*pi).exp()<arb(1)/2
sums=[arb(0) for _ in range(7)];width=arb(2)/N
for i in range(N):
 u=arb(2*i+1)/N+arb(0,arb(1)/N)
 z=pi*(2*u).exp();Z=z*(2*h).exp()
 r=arb_series([0],9)
 for n in range(2,9):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
 eps=2*C*9**20*z**8*(-80*z).exp()
 r=arb_series([r[j]+arb(0,(eps/math.factorial(j)).upper()) for j in range(9)],9)
 ell=(2*Z-3).log()+Z.log()-Z+(1+r).log()
 k,k2,k4,k6=[ell[j]*math.factorial(j) for j in [2,4,6,8]]
 g1=-k/2;g2=3*k*k/4+k2/8;g3=-15*k**3/8-15*k*k2/16-k4/32
 g4=105*k**4/16+105*k*k*k2/16+35*k2*k2/64+7*k*k4/16+k6/128
 s2=g2-g1*g1
 assert g1.lower()>0 and s2.lower()>0
 r3=g3-g2*g2/g1;r4=g4-g2*g2-(g3-g1*g2)**2/s2
 psi=4*(u/2).exp()*(2*z*z-3*z)*(-z).exp()*(1+r[0])
 weight=2*u*u*psi*psi
 for j,v in enumerate([arb(1),g1,g2,g3,g4,r3,r4]):sums[j]+=width*weight*v
# Entire u>=2 tail, using proof note's polynomial envelopes.
z=arb(100);e=8*math.factorial(8)*4**8*2**20*z**8*(-3*z).exp()
assert e<arb('1e-10')
for j in range(2,9):
 rr=arb(3)/(2*z)
 assert 2**j*z+2**j*math.factorial(j-1)*rr/(1-rr)**j+1<2**(j+2)*math.factorial(j)*z
Z=pi*arb(4).exp();assert Z>100
coef=[1,18,1944,524880,264539520,5000000,4000000000]
power=[0,1,2,3,4,4,6]
tails=[]
for j in range(7):
 tail=256/pi.sqrt()*coef[j]*Z**(arb(9)/2+power[j])*(-2*Z).exp()
 tails.append(tail)
 sums[j]+=arb(0,tail.upper())
M0,M1,M2,M3,M4,R3,R4=sums
assert M0.lower()>0 and M1.lower()>0
A=M2-M1*M1/M0;assert A.lower()>0
S3=M3-M2*M2/M1
S4=M4-M2*M2/M0-(M3-M1*M2/M0)**2/A
V3=S3-R3;V4=S4-R4
out={'N':N,'bits':ctx.prec,'moments':{str(j):{'lo':str(v.lower()),'hi':str(v.upper())} for j,v in enumerate(sums[:5])},'R3':str(R3),'R4':str(R4),'S3':str(S3),'S4':str(S4),'V3':str(V3),'V4':str(V4),'directed':{key:{'lo':str(v.lower()),'hi':str(v.upper())} for key,v in [('R3',R3),('R4',R4),('S3',S3),('S4',S4),('V3',V3),('V4',V4)]},'tail_bounds':[str(t.upper()) for t in tails],'scope':'Integrated complete-theta innovations and actual global prefix inverse; no target pivot input. Local remainders retained signed.'}
print(json.dumps(out,indent=2))
