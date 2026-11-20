#!/usr/bin/env python3
"""Enclose the finite prime/higher-power decomposition; infinite bound is analytic."""
import csv,json,hashlib
from pathlib import Path
from verify_reserve import I,D,constants,arch_interval
ROOT=Path(__file__).resolve().parent

def run():
    path=ROOT/'certificate/reserve_leaves.csv'
    cert=json.loads((ROOT/'certificate/certificate.json').read_text())
    assert hashlib.sha256(path.read_bytes()).hexdigest()==cert['leaf_sha256']
    rows=list(csv.DictReader(path.open()))
    c=constants(); out=[]
    # Crude universal bound on k>=3: replace primes by all integers.
    # Sum log(n)/n^(3/2) <= 4 + log(2)/2^(3/2).
    K=(4+I(2).ln()/(2*I(2).sqrt()))/(1-1/I(2).sqrt())
    C=4*I(2).ln()
    for N in (100,1000,10000,100000,1000000):
        t=I(N).ln(); sums=[I(0),I(0),I(0)]; counts=[0,0,0]
        for row in rows:
            n,p=int(row['prime_power']),int(row['prime'])
            if n>N:break
            k=0; rem=n
            while rem%p==0:rem//=p;k+=1
            assert rem==1
            group=0 if k==1 else 1 if k==2 else 2
            term=I(p).ln()/I(n).sqrt()*(t-I(n).ln())
            # At n=N the exact term is zero.
            if n==N:term=I(0)
            sums[group]=sums[group]+term; counts[group]+=1
        A=arch_interval(t,c)
        full=A-sums[0]-sums[1]-sums[2]
        prime_only=A-sums[0]
        power=sums[1]+sums[2]
        residual=prime_only-power-full
        assert residual.lo<=0<=residual.hi
        bound=C*t*t/4+(C+K)*t
        assert power.hi<bound.lo
        out.append({'N':N,'t':t.strings(),'counts':counts,
                    'Psi':full.strings(),'prime_only_response':prime_only.strings(),
                    'square_contribution':sums[1].strings(),'higher_contribution':sums[2].strings(),
                    'power_correction':power.strings(),'universal_power_upper':str(bound.hi),
                    'identity_residual':residual.strings()})
    result={'scope':'finite decomposition checks, analytic all-t bound in PRIME_ARITHMETIC.md',
            'C':C.strings(),'K':K.strings(),'samples':out}
    (ROOT/'prime_only_audit.json').write_text(json.dumps(result,indent=2)+'\n')
    for r in out:print(r['N'],r['power_correction'][0],r['prime_only_response'][0])

if __name__=='__main__':run()
