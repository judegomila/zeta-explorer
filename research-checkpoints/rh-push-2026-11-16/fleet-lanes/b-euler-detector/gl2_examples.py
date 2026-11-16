"""(1) Degree-2 lab S_k(SL2(Z)): T_2 has simple spectrum (char poly squarefree; also irreducible check) for even k <= KMAX.
    With Lemma A this gives: FE (level 1, weight k) + Euler factor at the single prime 2  =>  Hecke eigenform.
(2) Counter-twins outside the hierarchy: Laurent twin (integrality fails) and zeta(s-d)zeta(s+d) (temperedness fails).
Run: python -I gl2_examples.py [KMAX]"""
import sys, json, math
from flint import fmpq_mat, fmpq, fmpz_poly, fmpq_poly
import mpmath as mp
KMAX=int(sys.argv[1]) if len(sys.argv)>1 else 300
def mul(a,b,N):
    c=[0]*N
    for i,x in enumerate(a):
        if x:
            for j in range(N-i): c[i+j]+=x*b[j]
    return c
def powl(a,e,N):
    r=[1]+[0]*(N-1)
    for _ in range(e): r=mul(r,a,N)
    return r
def sig(n,k): return sum(d**k for d in range(1,n+1) if n%d==0)
res=[]
for k in range(12,KMAX+1,2):
    d=k//12 - (1 if k%12==2 else 0)
    if d<1: continue
    N=2*d+2
    E4=[1]+[240*sig(n,3) for n in range(1,N)]; E6=[1]+[-504*sig(n,5) for n in range(1,N)]
    D=[0]*N
    e43=powl(E4,3,N); e62=powl(E6,2,N)
    D=[(x-y)//1728 for x,y in zip(e43,e62)]
    basis=[]
    for j in range(1,d+1):
        w=k-12*j
        b=0
        while (w-6*b)%4: b+=1
        a=(w-6*b)//4; assert a>=0
        f=mul(mul(powl(D,j,N),powl(E4,a,N),N),powl(E6,b,N),N); basis.append(f)
    # T_2 image coefficients 1..d
    def T2(f): return [f[2*n]+(2**(k-1)*f[n//2] if n%2==0 else 0) for n in range(0,d+1)]
    B=fmpq_mat(d,d,[fmpq(basis[i][n]) for i in range(d) for n in range(1,d+1)])
    TB=fmpq_mat(d,d,[fmpq(T2(basis[i])[n]) for i in range(d) for n in range(1,d+1)])
    M=TB*B.inv()            # row-vector convention: T(f_i) = sum_j M_ij f_j
    cp=M.charpoly()
    num=fmpz_poly([int(c*cp.denom()) for c in cp.numer().coeffs()]) if hasattr(cp,'numer') else None
    zp=fmpz_poly([int(x) for x in (cp*cp.denom()).coeffs()]) if num is None else num
    g=zp.gcd(zp.derivative())
    fac=zp.factor()[1]
    res.append({'k':k,'dim':d,'squarefree':g.degree()==0,'irreducible':len(fac)==1 and fac[0][1]==1})
ok=all(r['squarefree'] for r in res); irr=all(r['irreducible'] for r in res)
print('weights',res[0]['k'],'..',res[-1]['k'],'count',len(res),'max dim',max(r['dim'] for r in res),'all squarefree',ok,'all irreducible',irr)
# sanity: k=24 char poly x^2 - 1080 x - 20468736
out={'T2_level1':{'KMAX':KMAX,'n_weights':len(res),'max_dim':max(r['dim'] for r in res),'all_squarefree':ok,'all_irreducible':irr}}
# ---------- (2) counter-twins ----------
mp.mp.dps=30
p=2; eps=mp.mpf('0.2')
R=lambda s: 1+eps*(mp.power(p,s-mp.mpf(1)/2)+mp.power(p,mp.mpf(1)/2-s))
F=lambda s: mp.zeta(s)*R(s)
xi=lambda s: mp.pi**(-s/2)*mp.gamma(s/2)*F(s)
s0=mp.mpc('0.3','7.7')
fe=abs(xi(s0)-xi(1-s0))/abs(xi(s0))
delta=mp.acosh(1/(2*eps))/mp.log(p)
zs=[mp.mpc(mp.mpf(1)/2+delta,mp.pi*(2*k+1)/mp.log(p)) for k in range(3)]
out['laurent_twin']={'p':p,'eps':float(eps),'FE_defect':float(fe),'offline_real_part':float(mp.mpf(1)/2+delta),
     'zeros':[[float(z.real),float(z.imag),float(abs(F(z)))] for z in zs],
     'local_factor':'(1 + eps p^{-1/2} x^{-1} + eps p^{1/2} x)/(1-x), x=p^{-s}: Laurent, coefficient support (1/p)N',
     'note':'eps<1/2: zeros at Re s = 1/2 +- arccosh(1/(2 eps))/log p; eps=0.2,p=2 gives Re s = %.6f > 1'%float(mp.mpf(1)/2+delta)}
d=mp.mpf('0.2')
F2=lambda s: mp.zeta(s-d)*mp.zeta(s+d)
xi2=lambda s: mp.pi**(-s)*mp.gamma((s-d)/2)*mp.gamma((s+d)/2)*F2(s)
fe2=abs(xi2(s0)-xi2(1-s0))/abs(xi2(s0))
z1=mp.zetazero(1)
out['shifted_product_twin']={'delta':float(d),'FE_defect':float(fe2),'zero':[float(z1.real+d),float(z1.imag)],'abs_F_at_zero':float(abs(F2(z1+d))),
     'toeplitz_K1_at_p2':'[[2,m1],[m1,2]], m1 = 2^d+2^-d = %.6f > 2: det = %.6f < 0'%(float(2**d+2**-d),float(4-(2**d+2**-d)**2))}
print(json.dumps(out,indent=1)); json.dump(out,open('gl2_examples.json','w'),indent=1)
