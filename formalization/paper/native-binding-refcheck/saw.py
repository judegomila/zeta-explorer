import sys, mpmath as mp
mp.mp.dps = 30
moll=[]
for ln in open(sys.argv[1]):
    if ln.startswith('#') or not ln.strip(): continue
    d,a,b=map(int,ln.split()); moll.append((d,mp.mpf(a)/b))
t=mp.mpf(15830)/100000; y=mp.sqrt(mp.mpf(350708)/10**7)
def consts(N):
    xN=4*mp.pi*N**2-mp.pi*t/4; lx=mp.log(xN/(4*mp.pi))
    inner=max(1-3*y+4*y*(1+y)/xN**2,0)
    sig=(1+y)/2+t/4*lx - t*inner/(2*xN**2)
    return sig, t*y/(2*(xN-6)), mp.exp(mp.mpf(2)/100*y-(y/2)*lx)
N0,N1=int(sys.argv[2]),int(sys.argv[3])
bm=[None]+[mp.exp(t/4*mp.log(m)**2) for m in range(1,N1+1)]
my=[None]+[mp.mpf(m)**y for m in range(1,N1+1)]
gcache={}
def g(N):
    if N not in gcache: gcache[N]=consts(N)[2]
    return gcache[N]
for N in range(N0,N1+1):
    sig,k,gN=consts(N)
    B={};A={};dmin={}
    for d,l in moll:
        for m in range(1,N+1):
            n=d*m; B[n]=B.get(n,0)+l*bm[m]; A[n]=A.get(n,0)+l*bm[m]*my[m]
            dmin[n]=min(dmin.get(n,d),d)
    S=mp.fsum((abs(B[n])+gN*abs(A[n]))*mp.mpf(n)**(-sig) for n in B if n>=2)
    Ssaw=mp.fsum((abs(B[n])+g(max(n//dmin[n],N0))*abs(A[n]))*mp.mpf(n)**(-sig) for n in B if n>=2)
    M=mp.fsum(abs(l)*mp.mpf(d)**(-sig) for d,l in moll)
    C=mp.fsum(bm[m]*(mp.mpf(m)**k-1)*mp.mpf(m)**(y-sig) for m in range(2,N+1))
    print(N, mp.nstr((1-gN-S)/M-gN*C,20), mp.nstr((1-gN-Ssaw)/M-gN*C,20))
