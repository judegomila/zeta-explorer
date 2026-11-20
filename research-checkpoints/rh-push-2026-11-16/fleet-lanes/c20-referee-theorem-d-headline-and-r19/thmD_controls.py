# Referee 2 checks for Theorem D of c1-leeyang-krein-limit. mpmath, small arrays (N<=2e5 floats ~ 2 MB).
import mpmath as mp, math, cmath, json
mp.mp.dps = 30
out = {}
# --- 1. DH exponential stages: f_N = exp(sum_{n<=N} b_n n^-s), b_n = Lambda_F(n)/log n
N = 200000
print("planned allocation: 3 float lists of length", N+1, "~", 3*8*(N+1)/1e6, "MB")
sq5 = math.sqrt(5); kap = (math.sqrt(10-2*sq5)-2)/(sq5-1)
per = [0.0, 1.0, kap, -kap, -1.0]
a = [0.0]+[per[n%5] for n in range(1,N+1)]
# a_n log n = sum_{d|n} Lam(d) a_{n/d}  => Lam(n) = a_n log n - sum_{d|n,1<d<n} Lam(d) a_{n/d}
acc = [0.0]*(N+1); Lam=[0.0]*(N+1)
for d in range(2,N+1):
    Lam[d] = a[d]*math.log(d) - acc[d]
    if Lam[d]!=0.0:
        ld=Lam[d]
        for m in range(2, N//d+1):
            acc[d*m] += ld*a[m]
b = [0.0,0.0]+[Lam[n]/math.log(n) for n in range(2,N+1)]
out['kappa']=kap; out['b6']=b[6]; out['b10']=b[10]; out['b12']=b[12]
print("kappa",kap,"b_6",b[6],"(nonzero => log-coefficients not on prime powers)  a6-a2a3",a[6]-a[2]*a[3])
def DH(s):
    # via Hurwitz zeta: sum_{r} per[r] 5^-s zeta(s, r/5)
    return sum(per[r]*mp.power(5,-s)*mp.zeta(s, mp.mpf(r)/5) for r in range(1,5))
def stage(s, M):
    return cmath.exp(sum(b[n]*cmath.exp(-s*math.log(n)) for n in range(2,M+1)))
rows=[]
for s in [3+5j, 2+17j, 1.6+40j, 1.3+85.7j]:
    F = complex(DH(mp.mpc(s)))
    r=[abs(stage(s,M)/F-1) for M in (100,1000,10000,200000)]
    rows.append((str(s),abs(F),r)); print("DH stage rel err at",s,"|F|",abs(F),r)
out['dh_stage_relerr']=rows
# absolute convergence abscissa proxy: sum |b_n| n^-sigma partial sums
for sig in (1.3,1.5,2.0):
    print("sum|b_n|n^-sig, sig",sig,[sum(abs(b[n])*n**(-sig) for n in range(2,M+1)) for M in (1000,20000,200000)])
# stage at the off-line zero of DH: nonzero (exponential), modulus drifts
z0 = 0.8085171825+85.6993484854j
print("|DH(z0)|",abs(complex(DH(mp.mpc(z0)))), "|stage(z0)|",[abs(stage(z0,M)) for M in (100,1000,10000,200000)])
out['dh_stage_at_zero']=[abs(stage(z0,M)) for M in (100,1000,10000,200000)]
# --- 2. Local-factor zeros of the multiplicative controls in the strip (step S1 fails for Euler stages)
q=2.0; c=2.5
beta = 0.5+math.acosh(c/2)/math.log(q)
s0 = beta+1j*math.pi/math.log(q)
m = lambda s: q**(s-0.5)+c+q**(0.5-s)
print("T-NR q=2 c=2.5: local zero at",s0,"|m|",abs(m(s0)))
out['tnr_zero']=[s0.real,s0.imag,abs(m(s0))]
# HQ2 q=7 eps=0.2: zero of 1+eps u^2/(1-u)^4, u=q^(1/2-s)
q=7; eps=0.2
g=lambda s: 1+eps*mp.power(q,1-2*s)/(1-mp.power(q,mp.mpf(1)/2-s))**4
r=mp.findroot(g, mp.mpc(0.747,0.238)); print("HQ2 q=7 eps=.2 zero",r,abs(g(r)))
out['hq2_zero']=[float(r.real),float(r.imag)]
# Prop F: G_q factor 1+(c_q+2)u/(1-u)^2 vanishes on Re s=3/4
for q in (5,101,10007):
    cq=q**0.25+q**-0.25
    # (1-u)^2+(cq+2)u = u^2+cq u+1 = 0 -> u = -q^{+-1/4}; |u|=q^{1/2-sigma} -> sigma = 1/4 or 3/4
    s=0.75+1j*math.pi/math.log(q); u=q**(0.5-s); val=1+(cq+2)*u/(1-u)**2
    # size of factor-1 at sigma=1 : shows convergence to zeta right of 3/4
    dev=max(abs((cq+2)*q**(0.5-(sg+1j*t))/(1-q**(0.5-(sg+1j*t)))**2) for sg in (0.8,1.0) for t in (0.0,1.0,math.pi/math.log(q)))
    print("G_q q",q,"factor at 3/4+i pi/log q:",abs(val),"sup|factor-1| on sigma in {0.8,1}:",dev)
out['propF']="see log"
# --- 3. Liouville sign chain: stage prod (1+p^-s)^-1, normaliser exp(+E_1((s-1)log P)) [pole at 1]; target zeta(2s)/zeta(s)
def primes(n):
    sv=bytearray([1])*(n+1); sv[0:2]=b'\0\0'
    for i in range(2,int(n**.5)+1):
        if sv[i]: sv[i*i::i]=bytearray(len(sv[i*i::i]))
    return [i for i in range(n+1) if sv[i]]
PR=primes(10**6); print("primes to 1e6:",len(PR))
def E1(w): return complex(mp.e1(mp.mpc(w)))
for s in (0.8+20j, 0.65+25.2j):
    tgt_l=complex(mp.zeta(2*s)/mp.zeta(s)); tgt_z=complex(mp.zeta(s))
    res=[]
    for P in (10**3,10**4,10**5,10**6):
        lz=0j; ll=0j
        for p in PR:
            if p>P: break
            x=cmath.exp(-s*math.log(p)); lz-=cmath.log(1-x); ll-=cmath.log(1+x)
        e=E1((s-1)*math.log(P))
        res.append((P, abs(cmath.exp(lz+e)/tgt_z-1), abs(cmath.exp(ll-e)/tgt_l-1), abs(cmath.exp(ll+e)/tgt_l-1)))
    print("s",s,"(P, zeta relerr pole-renorm, Liouville relerr with inverse factor, Liouville with zeta's factor):"); [print("   ",x) for x in res]
    out['liouville_'+str(s)]=res
# --- 4. E_a: stages x normaliser near a zero of E_a (rho + a), a = 0.2: unbounded? value -> 0 at the zero
aa=0.2; rho=0.5+14.134725141734693j; z=rho+aa
res=[]
for P in (10**3,10**4,10**5,10**6):
    l=0j
    for p in PR:
        if p>P: break
        lp=math.log(p); l-=cmath.log(1-cmath.exp(-(z+aa)*lp))+cmath.log(1-cmath.exp(-(z-aa)*lp))
    e=E1((z+aa-1)*math.log(P))+E1((z-aa-1)*math.log(P))
    res.append((P,abs(cmath.exp(l+e))))
print("E_a renormalised stage at its zero rho+a (target 0; Hurwitz: cannot converge locally uniformly with zero-free stages):",res)
out['Ea_at_zero']=res
json.dump(out,open('thmD_controls.json','w'),indent=1,default=str)
