import math
from mpmath import mp, mpf, log
mp.dps=50
# fixed low height t=14.134725 (below every t_r): is there still an m with the forced phase in [1.008,4.95]?  r=3 datum (all a_i,b_i>=0, so m>=1 suffices)
a=[1,2,6]; b=[0,4,5]; t=mpf('14.134725')
for p,k in ((3,30),(5,21),(2,60)):
    r=3; q=p**k; H=p**(-(-k//r))
    # solve D(x)=2/t by bisection on x in (0,5)
    D=lambda x: sum(math.log1p(u*x) for u in a)-sum(math.log1p(u*x) for u in b)
    lo,hi=1e-6,5.0
    for _ in range(100):
        mid=(lo+hi)/2
        if D(mid)<2/float(t): lo=mid
        else: hi=mid
    xs=lo; m=int(H/xs)
    while m%p==0: m+=1
    Pa=1;Pb=1
    for u in a: Pa*=m+u*H
    for u in b: Pb*=m+u*H
    th=t*(log(mpf(Pa))-log(mpf(Pb)))
    print(f"p={p} k={k} H={H} x*={xs:.4f} m={m} top={m+6*H} q^(1/3)={q**(1/3):.4g} top/q^(1/3)={(m+6*H)/q**(1/3):.2f} (Pa-Pb)%q={(Pa-Pb)%q} tD={float(th):.4f} |e^-itD -1|={float(abs(mp.expj(-th)-1)):.4f} -> eps>={float(abs(mp.expj(-th)-1))/6:.4f}")
