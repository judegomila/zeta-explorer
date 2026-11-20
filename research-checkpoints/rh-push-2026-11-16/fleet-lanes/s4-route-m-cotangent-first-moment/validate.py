# validation of rmc against brute force (mpmath 30 digits) : c0, modular inverse, Vasyunin I(a,b), and I(a,b) = b A(a/b)
import mpmath as mp, subprocess, random, math
mp.mp.dps=30
def c0(h,k): return -sum(mp.mpf(m)/k*mp.cot(mp.pi*m*h/k) for m in range(1,k))
def V(x,y): return sum((mp.mpf((m*x)%y)/y)*mp.cot(mp.pi*m/y) for m in range(1,y))
C=(mp.log(2*mp.pi)-mp.euler)/2
def Ibr(a,b): return C*(a+b)+mp.mpf(a-b)/2*mp.log(mp.mpf(b)/a)-mp.pi/2*(V(a,b)+V(b,a))
random.seed(3); pairs=[]
for k in [2,3,4,5,7,12,97,360,1009,5040,30030,99991]:
    for _ in range(6):
        h=random.randrange(1,k) if k>2 else 1
        if math.gcd(h,k)==1: pairs.append((h,k))
pairs+= [(1,99991),(99990,99991),(2,99991),(49995,99991),(1,2),(1,3),(2,3)]
inp="".join("%d %d\n"%p for p in pairs)
out=subprocess.run(["./rmc_local","X"],input=inp,capture_output=True,text=True).stdout.split("\n")
worst=0
for (h,k),l in zip(pairs,out):
    c,iv=l.split(); c=float(c); iv=int(iv); ex=c0(h,k); assert (iv*h)%k==1%k,(h,k,iv)
    err=abs(c-ex)/max(1,abs(ex)); rel_k=abs(c-ex)/k; worst=max(worst,float(rel_k))
    if float(rel_k)>1e-13: print("BAD",h,k,c,mp.nstr(ex,17))
print("c0: %d pairs, worst |err|/k = %.2e"%(len(pairs),worst))
ip=[(1,1),(1,2),(2,3),(3,7),(5,12),(1,97),(31,97),(96,97),(1000,1009),(389,1009),(1,5040),(2321,5040),(30029,30030),(7,30030)]
inp="".join("I %d %d\n"%p for p in ip)
out=subprocess.run(["./rmc_local","X"],input=inp,capture_output=True,text=True).stdout.split("\n")
worst=0
for (a,b),l in zip(ip,out):
    v=float(l); ex=Ibr(a,b); worst=max(worst,float(abs(v-ex)/abs(ex)))
print("I(a,b): %d pairs, worst rel err %.2e"%(len(ip),worst))
# definition check: I(a,b) = a b Int_0^inf {t/a}{t/b} dt/t^2 by exact piecewise integration up to T plus tail bound
def Idef(a,b,T=200000):
    # breakpoints at multiples of a and b; on each piece {t/a}{t/b} = (t/a-i)(t/b-j)
    pts=sorted(set(list(range(0,T+1,a))+list(range(0,T+1,b)))); s=mp.mpf(0)
    for u,v in zip(pts[:-1],pts[1:]):
        i=u//a; j=u//b
        if u==0: s+=mp.mpf(v)/(a*b); continue
        # int (t/a-i)(t/b-j)/t^2 dt = (v-u)/(ab) - (i/b+j/a) log(v/u) + i j (1/u-1/v)
        s+=mp.mpf(v-u)/(a*b)-(mp.mpf(i)/b+mp.mpf(j)/a)*mp.log(mp.mpf(v)/u)+i*j*(mp.mpf(1)/u-mp.mpf(1)/v)
    return a*b*s
for (a,b) in [(1,1),(2,3),(3,7),(5,12)]:
    v=float(subprocess.run(["./rmc_local","X"],input="I %d %d\n"%(a,b),capture_output=True,text=True).stdout)
    d=Idef(a,b); print("definition",a,b,"closed",v,"integral to T (missing tail in [0,ab/T])",mp.nstr(d,12),"diff",mp.nstr(v-d,3),"tail bound",a*b/200000)
