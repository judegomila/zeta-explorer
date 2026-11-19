# Independent check of Lemma X / Lemma P of c12-depth-aspect-height-transfer.
# Exact integers for congruences, Arb balls for phases, float brute force over all characters.
import math, cmath, random, sys
from fractions import Fraction
from flint import arb, fmpz, ctx
ctx.prec = 200
DATA = {2: ((1,-1),(0,0)), 3: ((1,2,6),(0,4,5)), 4: ((0,4,7,11),(1,2,9,10)), 5: ((1,2,10,14,18),(0,4,8,16,17))}
def prouhet(r):
    a=[n for n in range(2**r) if bin(n).count('1')%2==0]; b=[n for n in range(2**r) if bin(n).count('1')%2==1]
    return tuple(a),tuple(b)
DATA[6]=prouhet(6)
def P(v,j): return sum(x**j for x in v)
def prod(v):
    o=1
    for x in v:o*=x
    return o
print("== (a) data: power sums, kappa; Lemma P exact")
random.seed(20261119)
CONST={}
for r,(a,b) in DATA.items():
    assert len(a)==len(b)
    eq=all(P(a,j)==P(b,j) for j in range(1,r)); d=P(a,r)-P(b,r)
    s=len(a); A=max(abs(x) for x in a+b); kappa=Fraction(abs(d),r)
    fails=0; trials=0
    for _ in range(3000):
        H=random.randint(1,10**6); m=random.randint(-10**9,10**9); trials+=1
        if (prod([m+x*H for x in a])-prod([m+x*H for x in b]))%(H**r)!=0: fails+=1
    # sharpness: is the congruence false mod H^(r+1) for some (m,H)?  (shows r is exact order)
    sharp=any((prod([m+x*H for x in a])-prod([m+x*H for x in b]))%(H**(r+1))!=0 for H in (7,11,13) for m in (1,2,3))
    # x_1: largest x with T(x)/ (kappa x^r) <= 1/10, T(x)=sum_{j>r}|dP_j| x^j/j ; ratio increasing in x. bisection in exact rationals with tail bound
    def ratio_upper(x):  # x Fraction < 1/(2A)
        J=200; tot=Fraction(0)
        for j in range(r+1,J+1):
            tot+=Fraction(abs(P(a,j)-P(b,j)),j)*x**(j-r)
        y=A*x; tail=2*s*Fraction(A)**r*y**(J+1-r)/(1-y)   # |dP_j|<=2s A^j
        return (tot+tail)/kappa
    lo=Fraction(0); hi=Fraction(1,2*A)
    if ratio_upper(hi)<=Fraction(1,10): lo=hi
    else:
        for _ in range(60):
            mid=(lo+hi)/2
            mid=Fraction(mid.numerator*10**12//mid.denominator,10**12)
            if mid<=lo: break
            if ratio_upper(mid)<=Fraction(1,10): lo=mid
            else: hi=mid
    x1=lo
    tr=max(4.5/(float(kappa)*float(x1)**r),(3*r)**r*1.12/float(kappa))
    CONST[r]=(a,b,s,A,kappa,x1,tr)
    print(f"r={r} s={s} A={A} sums_equal_below_r={eq} dP_r={d} kappa={kappa} LemmaP_fail={fails}/{trials} not_mod_H^(r+1)={sharp} x1(exact rational cert, 10% holds)={float(x1):.6g} t_r={tr:.6g} eps={0.479/s:.4f}")

print("== (b) interval checks of proof constants")
r_ = arb(1.12)/arb(4.5)
for r in range(2,41):
    lhs=1-(arb('1.12')/arb('4.5'))**(arb(1)/r); assert lhs>arb('0.9')/r, r
print("1-(1.12/4.5)^(1/r) > 0.9/r certified for r=2..40")
print("2 sin(0.504) =",(2*arb('0.504').sin()).str(8)," 2 sin(4.95/2) =",(2*(arb('4.95')/2).sin()).str(8))
assert 2*arb('0.504').sin()>arb('0.958') and 2*(arb('4.95')/2).sin()>arb('0.958')

print("== (c) three fresh (p,k,t) per the lemma, all m in the window, Arb phase")
def window_check(p,k,t,r):
    a,b,s,A,kappa,x1,tr=CONST[r]
    q=p**k; H=p**(-(-k//r)); assert (H**r)%q==0
    assert abs(t)>=tr, ("t below t_r",t,tr)
    kt=float(kappa)*abs(t)
    x0=(1.12/kt)**(1/r); xu=(4.5/kt)**(1/r)
    mlo=math.ceil(H/xu); mhi=math.floor(H/x0)
    Nreq=H*((kt/1.12)**(1/r)+A)
    cnt=0; bad=0; worst=None; tmin=None; tmax=None
    step=max(1,(mhi-mlo)//20000)
    T=arb(str(t))
    for m in range(mlo,mhi+1,step):
        if m%p==0: continue
        Ia=[m+x*H for x in a]; Ib=[m+x*H for x in b]
        assert min(Ia+Ib)>0 and all(n%p for n in Ia+Ib)
        assert max(Ia+Ib)<=Nreq+1e-9*Nreq
        assert (prod(Ia)-prod(Ib))%q==0
        D=arb(0)
        for n in Ia: D+=arb(n).log()
        for n in Ib: D-=arb(n).log()
        ph=T*D
        dev=abs(2*(ph/2).sin())      # |exp(-i t D)-1|
        cnt+=1
        aph=abs(ph)
        if not (dev>arb('0.958')): bad+=1
        lo_=float(dev.lower())
        worst=lo_ if worst is None else min(worst,lo_)
        f=float(aph.mid()); tmin=f if tmin is None else min(tmin,f); tmax=f if tmax is None else max(tmax,f)
    print(f"p={p} k={k} t={t} r={r}: q={q:.4g} H={H} window m in [{mlo},{mhi}] tested {cnt} (step {step}) |tD| in [{tmin:.4f},{tmax:.4f}] min certified |e^(-itD)-1| >= {worst:.4f} violations={bad}; N_req={Nreq:.6g}; sqrt(q)={math.sqrt(q):.6g}; (q|t|)^(1/r)={(q*abs(t))**(1/r):.6g}")
window_check(11,4,5000.3,2)
window_check(2,21,4.0e5,3)
window_check(13,12,1.0e8,4)
window_check(3,25,3.0e10,5)
window_check(17,7,-123456.789,2)

print("== (d) brute force over ALL characters mod q and optimal unimodular c")
def chars(p,k):
    q=p**k; units=[n for n in range(1,q) if n%p]
    if p==2:
        # (Z/2^k)^x = <-1> x <5>
        idx={}
        o=2**(k-2) if k>=2 else 1
        for e in range(2):
            for f in range(o):
                idx[(pow(-1,e,q)*pow(5,f,q))%q]=(e,f)
        assert len(idx)==len(units)
        for u in range(2):
            for v in range(o):
                yield (lambda n,u=u,v=v: cmath.exp(2j*math.pi*(u*idx[n%q][0]/2+v*idx[n%q][1]/o)))
    else:
        phi=q-q//p
        g=next(g for g in range(2,q) if g%p and all(pow(g,phi//l,q)!=1 for l in set(f for f in range(2,phi+1) if phi%f==0 and all(f%d for d in range(2,int(f**.5)+1)))))
        idx={}; x=1
        for e in range(phi): idx[x]=e; x=x*g%q
        for a in range(phi):
            yield (lambda n,a=a: cmath.exp(2j*math.pi*a*idx[n%q]/phi))
def best_c_err(angles):
    ang=sorted(x%(2*math.pi) for x in angles)
    gaps=[ang[i+1]-ang[i] for i in range(len(ang)-1)]+[ang[0]+2*math.pi-ang[-1]]
    span=2*math.pi-max(gaps)
    return 2*math.sin(span/4)
def brute(p,k,t,r,Ns=None):
    a,b,s,A,kappa,x1,tr=CONST[r]
    q=p**k; H=p**(-(-k//r)); kt=float(kappa)*abs(t)
    Nreq=math.ceil(H*((kt/1.12)**(1/r)+A))
    ok = abs(t)>=tr
    ns=[n for n in range(1,Nreq+1) if n%p]
    base=[t*math.log(n) for n in ns]    # arg of n^{it}; z_n = chi(n) n^{it}
    out={}
    Ns = Ns or [Nreq]
    for chi in chars(p,k):
        vals=[cmath.phase(chi(n))+bb for n,bb in zip(ns,base)]
        for N in Ns:
            j=sum(1 for n in ns if n<=N)
            e=best_c_err(vals[:j])
            if N not in out or e<out[N]: out[N]=e
    print(f"p={p} k={k} q={q} t={t} r={r} hypotheses_met={ok} N_req={Nreq} bound={0.479/s:.4f}: "+" ".join(f"N={N}:minerr={out[N]:.4f}" for N in Ns))
    return out
brute(7,2,50.0,2,[5,10,15,20,30,40,54,61])
brute(3,4,60.5,2,[5,10,20,40,60,80])
brute(2,6,45.0,2,[5,10,20,40,59])
brute(5,4,200.0,2,[10,20,50,100,200,360])
brute(5,3,4.0e5,3,[10,20,50,100,400,842])
brute(3,3,3.5e5,3,[10,20,50,100,480])
