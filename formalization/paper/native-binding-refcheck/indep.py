import sys, mpmath as mp
mp.mp.dps = 40
from fractions import Fraction
moll=[]
for ln in open(sys.argv[1]):
    if ln.startswith('#') or not ln.strip(): continue
    d,a,b=map(int,ln.split()); moll.append((d,mp.mpf(a)/b))
t=mp.mpf(15830)/100000; y=mp.sqrt(mp.mpf(350708)/10**7)
def L(N, sigma_override=None):
    xN=4*mp.pi*N**2-mp.pi*t/4; lx=mp.log(xN/(4*mp.pi))
    inner=1-3*y+4*y*(1+y)/xN**2; inner=max(inner,0)
    p=t/4*lx - t*inner/(2*xN**2); sig=(1+y)/2+p
    k=t*y/(2*(xN-6)); g=mp.exp(mp.mpf(2)/100*y-(y/2)*lx)
    bm=[None]+[mp.exp(t/4*mp.log(m)**2) for m in range(1,N+1)]
    my=[None]+[mp.mpf(m)**y for m in range(1,N+1)]
    B={};A={}
    for d,l in moll:
        for m in range(1,N+1):
            n=d*m; B[n]=B.get(n,0)+l*bm[m]; A[n]=A.get(n,0)+l*bm[m]*my[m]
    S=mp.fsum((abs(B[n])+g*abs(A[n]))*mp.mpf(n)**(-sig) for n in B if n>=2)
    M=mp.fsum(abs(l)*mp.mpf(d)**(-sig) for d,l in moll)
    C=mp.fsum(bm[m]*(mp.mpf(m)**k-1)*mp.mpf(m)**(y-sig) for m in range(2,N+1))
    return (1-g-S)/M-g*C, B, A
for N in map(int,sys.argv[2:]):
    print(N, mp.nstr(L(N)[0],25))
