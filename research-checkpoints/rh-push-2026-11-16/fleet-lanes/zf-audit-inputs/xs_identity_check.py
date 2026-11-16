# Exact check of Xu-Sang (40): 2*Lam*J*(-E-g) == A d^2 + B d + C, on a grid large enough to prove the polynomial identity
from fractions import Fraction as F
def polys(j):
    if j==0:
        return dict(k=F(3,4),b=F(173,2000),l=F(10027,60000),g=F(1,10**6),Lam=2916000000,
          A=[1209956550,2343372300,1740394800,794068800],B=[-1135891798,-1173235148,258347816],C=[266598135,244982070],
          d=[38461880464196,1019289016601843792,3362710436662080432,3158456603732169536,711386879353694144])
    return dict(k=F(29991,40000),b=F(17307,200000),l=F(1253399,7500000),g=F(1,10**7),Lam=1457125331220000000,
          A=[604514027207496297,1171060420363058502,869869372328057808,396910005991680000],B=[-567451842451072679,-586296072701709724,128972962522474840],C=[133165863887059575,122393853878983830],
          d=[937158609712709801654383338059,254346722868854219618398387158475448,839298823187405114798749944189373584,788518797558558572150007715039666880,177683356043985413856187219704574400])
def ev(c,y): return sum(F(ci)*y**i for i,ci in enumerate(c))
def pmul(a,b):
    r=[0]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        for jj,y in enumerate(b): r[i+jj]+=x*y
    return r
for j in (0,1):
    p=polys(j); k,b,l,g=p['k'],p['b'],p['l'],p['g']
    c=1/(3*k); al=F(5,6); ly=(1+b-l)/2; h=(1+b+3*l)/2; C0=F(-1,4)+b/6+5*l/4
    ok=True
    for dn in range(0,6):
        for yn in range(0,7):
            d=F(dn,7); y=F(yn,13); x=F(1,2)-y
            D=3-(1+2*c)*x; P=(2-2*c*x)*(1-x); J=(al-d)*D+d*P
            # (1-R)*J = d*J - (al-d)*d*P/2
            EJ=(C0+d/2+d*x*(l+c*(h/4-ly/2)))*J-F(3,4)*h*(d*J-(al-d)*d*P/2)
            lhs=2*p['Lam']*(-EJ-g*J)
            rhs=ev(p['A'],y)*d*d+ev(p['B'],y)*d+ev(p['C'],y)
            ok&=(lhs==rhs)
    AC=pmul(p['A'],p['C']); BB=pmul(p['B'],p['B'])
    disc=[4*(AC[i] if i<len(AC) else 0)-(BB[i] if i<len(BB) else 0) for i in range(5)]
    print('stage',j,'identity(40) exact on 6x7 grid:',ok,'| disc coeffs match:',disc==p['d'],'| all A,disc coeffs >0:',all(v>0 for v in p['A']+disc))
