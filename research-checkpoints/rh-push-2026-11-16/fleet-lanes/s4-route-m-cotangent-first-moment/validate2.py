# end-to-end check of the per-b sums (S, sum|V|, Q = sum V^2/a, F) against direct summation of the definitions
import numpy as np, math, subprocess, mpmath as mp
EG=0.57721566490153286061; C=(math.log(2*math.pi)-EG)/2
def direct(b):
    S=Sa=Q=F=0.0
    for a in range(2,b):
        if math.gcd(a,b)!=1: continue
        m=np.arange(1,a); vba=float((((m*b)%a)/a/np.tan(np.pi*m/a)).sum())
        m=np.arange(1,b); vab=float((((m*a)%b)/b/np.tan(np.pi*m/b)).sum())
        S+=vba; Sa+=abs(vba); Q+=vba*vba/a; F+=C*(a+b)+0.5*(a-b)*math.log(b/a)-math.pi/2*(vab+vba)
    return S,Sa,Q,F
bs=[5,12,97,210,2003,2310,4999]
open("loc/v2.txt","w").write("\n".join(map(str,bs))+"\n")
out=subprocess.run(["./rmc_local","L","loc/v2.txt"],capture_output=True,text=True).stdout.strip().split("\n")
worst=0
for b,l in zip(bs,out):
    v=l.split(); S,Sa,Q,F=direct(b); e=max(abs(float(v[2])-S)/abs(S),abs(float(v[3])-Sa)/Sa,abs(float(v[4])-Q)/Q,abs(float(v[6])-F)/F); worst=max(worst,e)
    print("b=%d  S fast %.12g direct %.12g   Q fast %.12g direct %.12g   F fast %.12g direct %.12g   max rel diff %.1e"%(b,float(v[2]),S,float(v[4]),Q,float(v[6]),F,e))
print("worst relative difference",worst)
mp.mp.dps=30
b=211; S=mp.mpf(0)
for a in range(2,b): S+=sum((mp.mpf((m*b)%a)/a)*mp.cot(mp.pi*m/a) for m in range(1,a))
v=subprocess.run(["./rmc_local","L","/dev/stdin"],input="211\n",capture_output=True,text=True).stdout.split()
print("b=211 S(b): fast %.15g, 30-digit direct %s"%(float(v[2]),mp.nstr(S,18)))
