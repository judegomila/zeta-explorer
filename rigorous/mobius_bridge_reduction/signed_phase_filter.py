"""Exact local phase algebra and integer-row character-filter diagnostics.

This is not the Eisenstein-row compensated probe, nor a zero-free certificate.
All reported finite sums are integers or rational numbers. No random phases.
"""
from fractions import Fraction as Q
import json
import sys

if not __debug__:
    raise RuntimeError('Assertions must be enabled.')

# Q(z), z^2=z-1, z a primitive sixth root of unity.
def add(x,y): return (x[0]+y[0],x[1]+y[1])
def scale(x,c): return (c*x[0],c*x[1])
def mul(x,y): return (x[0]*y[0]-x[1]*y[1],x[0]*y[1]+x[1]*y[0]+x[1]*y[1])
def conj(x): return (x[0]+x[1],-x[1])
def norm(x): return x[0]**2+x[0]*x[1]+x[1]**2
def power(x,k):
    y=(Q(1),Q(0))
    for _ in range(k): y=mul(y,x)
    return y

def local_checks():
    roots=[power((Q(0),Q(1)),j) for j in range(6)]
    rows=[]
    for j,x in enumerate(roots):
        f=(Q(0),Q(0))
        for k in range(1,6): f=add(f,scale(power(x,k),Q(1,5)))
        assert f==(Q(1) if j==0 else -Q(1,5),Q(0))
        rows.append({'phase_index':j,'filter':str(f[0]),'ratio_first_coefficient_norm_squared':str(norm(add(x,scale(conj(x),-1))))})
    for k in range(1,13):
        cs=[]; ds=[]
        for j,x in enumerate(roots):
            c=add(power(x,k),scale(mul(conj(x),power(x,k-1)),-1))
            d=add(scale(power(x,k),k),scale(mul(conj(x),power(x,k-1)),-(k-1)))
            assert norm(c)==(0 if j in [0,3] else 3)
            if j in [0,3]: assert d==power(x,k)
            cs.append(norm(c));ds.append(norm(d))
        assert sum(cs)/6==2
        assert sum(ds)/6==2*k*k-2*k+1
    assert sum(Q(r['filter']) for r in rows)==0
    assert sum(Q(r['filter'])**2 for r in rows)/6==Q(1,5)
    return rows

def primes(limit):
    return [p for p in range(7,limit+1,6) if all(p%d for d in range(2,int(p**0.5)+1))]

def table(p):
    # 5*f_p. Every nonzero sixth-root phase has (p-1)/6 preimages.
    a=[0]+[5 if pow(n,(p-1)//6,p)==1 else -1 for n in range(1,p)]
    assert sum(a)==0
    assert sum(x*x for x in a)==5*(p-1)
    for x in a:
        assert x*x==(5+4*x if x else 0)
    return a

def diagnostics():
    ps=primes(400); tabs={p:table(p) for p in ps}; K=len(ps)
    # Exact complete-period Gram orthogonality, including ramified zeros.
    for i,p in enumerate(ps[:4]):
        for q in ps[:i]:
            assert sum(tabs[p][n%p]*tabs[q][n%q] for n in range(p*q))==0
    Ns=[1000,10000,100000,200000]; Nmax=max(Ns)
    total=[0]*Nmax; diag=[0]*Nmax
    for p in ps:
        tab=tabs[p]
        for n in range(1,Nmax+1):
            f=tab[n%p]
            total[n-1]+=f;diag[n-1]+=f*f
    assert total[0]==5*K
    # The cubic-only projection cannot distinguish a cube from phase +/-1.
    for p in ps:
        assert pow(8,(p-1)//3,p)==1
    # The complete filter distinguishes +/-1 but retains sixth powers.
    assert all(tabs[p][64%p]==5 for p in ps)
    complete=sum((Q(p-1,p) for p in ps),Q(0))/(5*K*K)
    rows=[];energy=0;diagonal=0
    for n,(s,d) in enumerate(zip(total,diag),1):
        energy+=s*s;diagonal+=d
        if n in Ns:
            den=25*K*K*n
            rows.append({'N':n,'K':K,'mean_square':str(Q(energy,den)),
                         'diagonal':str(Q(diagonal,den)),
                         'off_diagonal':str(Q(energy-diagonal,den)),
                         'complete_period_benchmark':str(complete)})
    return {'primes':ps,'principal_response':'1','rows':rows}

if __name__=='__main__':
    result={'status':'LOCAL_IDENTITIES_AND_INTEGER_ROW_DIAGNOSTICS_ONLY',
            'local_phases':local_checks(),'integer_rows':diagnostics(),
            'not_established':['Eisenstein-row weighted bound','low-side realization cost','preservation of the full principal Mellin term after insertion','any new zero-free boundary']}
    if '--json' in sys.argv: print(json.dumps(result,indent=2))
    else:
        print('PASS: exact sixth-root cancellation, derivative, and optimal-filter identities.')
        print('PASS: complete-period Gram orthogonality and finite integer-row sums.')
        for row in result['integer_rows']['rows']:
            print('N=%s, K=%s, mean square=%.12f, off diagonal=%.12f' % (row['N'],row['K'],float(Q(row['mean_square'])),float(Q(row['off_diagonal']))))
        print('NO NEW ZERO-FREE BOUND. The global weighted arithmetic embedding remains open.')
