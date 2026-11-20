"""Certified finite boundary reductions using outward Decimal intervals.

No third-party dependencies. All matrix signs come from interval arithmetic,
not floating-point eigenvalues. This program proves only finite statements.
"""
from decimal import Decimal, Context, ROUND_FLOOR, ROUND_CEILING, ROUND_HALF_EVEN
from fractions import Fraction
from math import comb, isqrt
from bisect import bisect_right
from pathlib import Path
from time import perf_counter
import json

PRECISION = 440
DOWN = Context(prec=PRECISION, rounding=ROUND_FLOOR)
UP = Context(prec=PRECISION, rounding=ROUND_CEILING)
NEAR = Context(prec=PRECISION, rounding=ROUND_HALF_EVEN)
ZERO = Decimal(0)


class I:
    __slots__ = ('lo','hi')
    def __init__(self, lo=0, hi=None):
        if isinstance(lo,I):
            self.lo,self.hi=lo.lo,lo.hi
            return
        if isinstance(lo,Fraction):
            self.lo=DOWN.divide(Decimal(lo.numerator),Decimal(lo.denominator))
            self.hi=UP.divide(Decimal(lo.numerator),Decimal(lo.denominator))
            return
        if isinstance(lo,float) or isinstance(hi,float):
            raise TypeError('Use exact integers or decimal strings, not floats.')
        self.lo=Decimal(lo)
        self.hi=Decimal(lo if hi is None else hi)
        assert self.lo<=self.hi
    def __add__(self,x):
        x=I(x)
        return I(DOWN.add(self.lo,x.lo),UP.add(self.hi,x.hi))
    __radd__=__add__
    def __neg__(self):
        return I(self.hi.copy_negate(),self.lo.copy_negate())
    def __sub__(self,x): return self+-I(x)
    def __rsub__(self,x): return I(x)+-self
    def __mul__(self,x):
        x=I(x)
        ends=((self.lo,x.lo),(self.lo,x.hi),(self.hi,x.lo),(self.hi,x.hi))
        return I(min(DOWN.multiply(a,b) for a,b in ends),max(UP.multiply(a,b) for a,b in ends))
    __rmul__=__mul__
    def __truediv__(self,x):
        x=I(x)
        if x.lo<=0<=x.hi: raise ZeroDivisionError('Interval contains zero')
        return self*I(DOWN.divide(Decimal(1),x.hi),UP.divide(Decimal(1),x.lo))
    def __rtruediv__(self,x): return I(x)/self
    def square(self):
        return I(0 if self.lo<=0<=self.hi else min(DOWN.multiply(self.lo,self.lo),DOWN.multiply(self.hi,self.hi)),
                 max(UP.multiply(self.lo,self.lo),UP.multiply(self.hi,self.hi)))
    def abs(self):
        return I(0 if self.lo<=0<=self.hi else min(self.lo.copy_abs(),self.hi.copy_abs()),
                 max(self.lo.copy_abs(),self.hi.copy_abs()))
    def positive_part(self): return I(max(ZERO,self.lo),max(ZERO,self.hi))
    def _monotone(self,name):
        a=getattr(NEAR,name)(self.lo)
        b=getattr(NEAR,name)(self.hi)
        return I(NEAR.next_minus(a),NEAR.next_plus(b))
    def exp(self): return self._monotone('exp')
    def ln(self):
        assert self.lo>0
        return self._monotone('ln')
    def sqrt(self):
        assert self.lo>=0
        z=self._monotone('sqrt')
        z.lo=max(ZERO,z.lo)
        return z
    def mid(self): return NEAR.divide(NEAR.add(self.lo,self.hi),Decimal(2))
    def width(self): return UP.subtract(self.hi,self.lo)
    def report(self): return {'lower':str(self.lo),'upper':str(self.hi)}


def dot(a,b): return sum((x*y for x,y in zip(a,b)),I(0))


def bernoulli(n):
    bs=[Fraction(1)]
    for m in range(1,n+1):
        bs.append(-sum((Fraction(comb(m+1,j))*bs[j] for j in range(m)),Fraction(0))/Fraction(m+1))
    return bs


def constants():
    def atan_inverse(q):
        x=I(1)/q
        xx=x.square()
        power=x
        total=I(0)
        for k in range(1000):
            total += ((-1)**k)*power/(2*k+1)
            power *= xx
            tail=power/(2*k+3)
            if tail.hi<Decimal('1e-430'):
                return total+I(tail.hi.copy_negate(),tail.hi)
        raise RuntimeError('atan tail')
    pi=16*atan_inverse(5)-4*atan_inverse(239)
    # Euler transform of the alternating Catalan series. The positive kth
    # finite difference is B(1/2,k+1)/2 * sum_{j=0}^k 1/(2j+1), and <=1.
    beta, odds, catalan = I(2),I(0),I(0)
    for k in range(1460):
        odds += I(1)/(2*k+1)
        catalan += beta*odds/(2**(k+2))
        beta *= I(2*(k+1))/(2*k+3)
    catalan += I(0,(I(1)/(2**1460)).hi)
    # Harmonic-number Euler-Maclaurin expansion, positive real argument.
    # The signed remainder is bounded by the first omitted Bernoulli term.
    n,K=1024,128
    bs=bernoulli(2*K+2)
    gamma=sum((I(1)/j for j in range(1,n+1)),I(0))-I(n).ln()-I(1)/(2*n)
    for k in range(1,K+1): gamma += I(bs[2*k]/Fraction(2*k*n**(2*k)))
    rem=I(bs[2*K+2]/Fraction((2*K+2)*n**(2*K+2)))
    gamma += I(min(ZERO,rem.lo),max(ZERO,rem.hi))
    return pi,gamma,catalan


def prime_powers(limit):
    sieve=bytearray(b'\1')*(limit+1)
    sieve[:2]=b'\0\0'
    for p in range(2,isqrt(limit)+1):
        if sieve[p]: sieve[p*p::p]=b'\0'*((limit-p*p)//p+1)
    out=[]
    for p in range(2,limit+1):
        if sieve[p]:
            n=p
            while n<=limit:
                out.append((n,p))
                n*=p
    return sorted(out)


class Arithmetic:
    def __init__(self,limit=65536):
        self.limit=limit
        self.pi,self.gamma,self.catalan=constants()
        self.ell=I(2).ln()
        self.slope=self.pi.ln()+self.gamma+self.pi/2+3*self.ell
        self.psi1=self.pi.square()+8*self.catalan-16
        self.powers=prime_powers(limit)
        self.cs,self.ds=[I(0)],[I(0)]
        for n,p in self.powers:
            ln=I(n).ln()
            c=I(p).ln()/I(n).sqrt()
            self.cs.append(self.cs[-1]+c)
            self.ds.append(self.ds[-1]+c*ln)
        self.cache={(0,0):I(0)}
        self.meshkeys={}
        self.tail_target=Decimal('1e-410')

    def smooth(self,t):
        z=(-2*t).exp()
        term=(-I('2.5')*t).exp()
        total,k=I(0),0
        while True:
            den=I(k)+I('1.25')
            total += term/den.square()
            term *= z
            k+=1
            tail=term/((I(k)+I('1.25')).square()*(1-z))
            if tail.hi < self.tail_target:
                total += I(0,tail.hi)
                break
        return self.slope*t-8*((t/2).exp()-1)-(self.psi1-total)/2

    def j(self,d,k):
        if d==0:return I(0)
        while k>0 and d%2==0: d//=2;k-=1
        key=(d,k)
        if key not in self.cache:
            denom=2**k
            assert (self.limit+1)**denom > 2**d, 'Prime cutoff too small'
            if k not in self.meshkeys:self.meshkeys[k]=[n**denom for n,p in self.powers]
            idx=bisect_right(self.meshkeys[k],2**d)
            t=self.ell*d/denom
            self.cache[key]=self.smooth(t)+2*(t*self.cs[idx]-self.ds[idx])
        return self.cache[key]

    def coefficients(self,k,m,control=None):
        h=self.ell/(2**k)
        js=[]
        for d in range(m+1):
            j=self.j(d,k)
            if control=='entire':
                t=h*d
                j-=2*self.ell*t
                for a in range(1,d//(2**k)+1):
                    x=I(a)*self.ell*I('0.4')
                    cosh=(x.exp()+(-x).exp())/2
                    j-=4*self.ell*((-1)**a)*cosh*(t-a*self.ell)
            js.append(j)
        q=[-js[1]/h]+[-(js[d+1]-2*js[d]+js[d-1])/(2*h) for d in range(1,m)]
        if control=='prime2':
            r=2**k
            if r<m:q[r]-=I('0.04')
        return q


def boundary_recursion(q):
    # a_j are the coefficients of x_n + sum_j a_j x_(n-j).
    e,a=q[0],[]
    if e.lo<=0:raise ArithmeticError('Nonpositive initial diagonal')
    steps=[]
    for n in range(1,len(q)):
        b=q[n]+dot(a,list(reversed(q[1:n])))
        center=q[n]-b
        reflection=b/e
        anew=[a[j]-reflection*a[n-2-j] for j in range(n-1)]+[-reflection]
        enew=e*(1-reflection.square())
        margin=e-b.abs()
        row=dict(order=n,matrix_size=n+1,e=e.report(),b=b.report(),
                 center=center.report(),reflection=reflection.report(),
                 boundary_margin=margin.report(),new_pivot=enew.report())
        steps.append(row)
        if enew.hi<0:
            # A fixed rational vector, then an independent direct energy bound.
            den=10**30
            nums=[int(NEAR.to_integral_value(NEAR.multiply(x.mid(),Decimal(den)))) for x in reversed(anew)]+[den]
            v=[I(Fraction(x,den)) for x in nums]
            energy=sum((v[i]*q[abs(i-j)]*v[j] for i in range(n+1) for j in range(n+1)),I(0))
            norm=dot(v,v)
            assert energy.hi<0
            return dict(status='certified_negative',first_failed_size=n+1,
                        steps=steps,witness=dict(numerators=nums,denominator=den,
                            energy=energy.report(),rayleigh=(energy/norm).report()))
        if enew.lo<=0:raise ArithmeticError(f'Unresolved pivot at size {n+1}')
        e,a=enew,anew
    return dict(status='certified_positive_definite',max_size=len(q),
                minimum_pivot_lower=str(min([q[0].lo]+[Decimal(s['new_pivot']['lower']) for s in steps])),steps=steps)


def ldl(q):
    # Independent O(n^3) interval factorization used only on small cross-checks.
    n=len(q)
    l=[[I(0) for _ in range(n)] for _ in range(n)]
    d=[]
    for j in range(n):
        pivot=q[0]-sum((l[j][k].square()*d[k] for k in range(j)),I(0))
        d.append(pivot)
        l[j][j]=I(1)
        if pivot.lo<=0<=pivot.hi:raise ArithmeticError('Indeterminate LDL pivot')
        for i in range(j+1,n):
            l[i][j]=(q[i-j]-sum((l[i][k]*l[j][k]*d[k] for k in range(j)),I(0)))/pivot
    return d


def check_interval_engine():
    samples=[Fraction(-7,3),Fraction(-1,7),Fraction(0),Fraction(2,9),Fraction(5,2)]
    checks=0
    def contains(iv,x):
        return Fraction(iv.lo)<=x<=Fraction(iv.hi)
    for x in samples:
        for y in samples:
            for iv,z in [(I(x)+I(y),x+y),(I(x)-I(y),x-y),(I(x)*I(y),x*y)]:
                assert contains(iv,z);checks+=1
            if y:
                assert contains(I(x)/I(y),x/y);checks+=1
        assert contains(I(x).square(),x*x);checks+=1
    assert I(-2,3).square().lo==0 and I(-2,3).square().hi>=9
    assert I(-2,3).abs().lo==0
    # These rational bounds enclose broad genuine transcendental values.
    assert I(1).exp().lo>Decimal('2.71828') and I(1).exp().hi<Decimal('2.71829')
    assert I(2).ln().lo>Decimal('0.69314') and I(2).ln().hi<Decimal('0.69315')
    return checks+4


def main():
    start=perf_counter()
    checks=check_interval_engine()
    ar=Arithmetic()
    result=dict(status='Finite outward-rounded interval certificates; universal RH inequality remains open.',
                precision_decimal_digits=PRECISION,
                constants={name:x.report() for name,x in [('pi',ar.pi),('gamma',ar.gamma),('catalan',ar.catalan)]},
                arithmetic={},controls={})
    for k,m in [(0,16),(1,32),(2,64),(3,128),(4,256),(5,64),(6,128)]:
        label=f'k{k}_m{m}'
        q=ar.coefficients(k,m)
        rec=boundary_recursion(q)
        assert rec['status']=='certified_positive_definite'
        result['arithmetic'][label]=dict(k=k,m=m,support_log2_units=Fraction(m,2**k).__str__(),q=[x.report() for x in q],recursion=rec)
        print(label,rec['status'],'min pivot',rec['minimum_pivot_lower'][:18],flush=True)
    for kind in ['prime2','entire']:
        q=ar.coefficients(2,8,control=kind)
        rec=boundary_recursion(q)
        assert rec['status']=='certified_negative'
        result['controls'][kind]=dict(q=[x.report() for x in q],recursion=rec)
        print(kind,'first failure',rec['first_failed_size'],flush=True)
    # Independent elimination cross-checks on true and perturbed matrices.
    for control in [None,'prime2','entire']:
        q=ar.coefficients(2,8,control)
        ds=ldl(q)
        rec=boundary_recursion(q)
        for d,s in zip(ds[1:],rec['steps']):
            e=I(s['new_pivot']['lower'],s['new_pivot']['upper'])
            assert max(d.lo,e.lo)<=min(d.hi,e.hi)
            checks+=1
    result['identity_and_interval_checks']=checks
    result['elapsed_seconds']=perf_counter()-start
    root=Path(__file__).resolve().parent
    (root/'certificates.json').write_text(json.dumps(result,indent=2)+'\n')
    print('done',result['elapsed_seconds'], 'seconds',flush=True)


if __name__=='__main__':main()
