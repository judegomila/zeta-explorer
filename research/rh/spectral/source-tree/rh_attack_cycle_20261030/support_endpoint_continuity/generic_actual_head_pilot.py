#!/usr/bin/env python3
"""Small generic rational-support actual even head; no tail majorant claim.

No quarter/half aliases are used in this builder. New prime16 is retained.
The prime block is checked against independent literal translated-cosine
integrals. The X16 formula is checked against the frozen accepted builder.
"""
from pathlib import Path
from fractions import Fraction as Q
import hashlib,json,sys,time
from flint import arb,acb,ctx
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
TERMS=[(2,2),(3,3),(4,2),(5,5),(7,7),(8,2),(9,3),(11,11),(13,13),(16,2)]
def inputs(X=Q(16001,1000),max_index=32,bits=1000):
    ctx.prec=bits;W=(arb(X.numerator)/X.denominator).log();pi=arb.pi();sq2=arb(2).sqrt();sh=(W/4).sinh()**2
    terms=[(n,arb(p).log()/arb(n).sqrt()) for n,p in TERMS if n<X]
    y=(W/2).exp();Jarch=-(y+1).log()+(y*y+1).log()/2+y.atan()+arb(2).log()/2-pi/4
    base=arb.const_euler()+(4*pi*(W/2).tanh()).log()+2*Jarch
    psi0=acb(arb(1)/4).digamma();Kseries=150
    exps=[(arb(1)/2+2*k,(-(arb(1)/2+2*k)*W).exp()) for k in range(Kseries)]
    aend=arb(1)/2+2*Kseries;ee=(-aend*W).exp()/(1-(-2*W).exp())
    b=[arb(0)];ed=[];bprime=[arb(0)];edprime=[]
    for j in range(max_index+1):
        freq=2*pi*j/W;z=acb(arb(1)/4,freq/2);psi=z.digamma();ss=psi.imag/2
        cc=-(psi-psi0).real/2;xx=z.polygamma(1).real/4
        for a,e in exps:
            den=a*a+freq*freq;ss-=e*freq/den
            cc+=e*freq*freq/(a*den)
            xx-=e*((a*a-freq*freq)/(den*den)+W*a/den)
        ss+=arb(0,(ee*freq/(aend*aend)).upper())
        cc+=arb(0,(ee*freq*freq/(aend**3)).upper())
        xx+=arb(0,(ee*(1/(aend*aend)+W/aend)).upper())
        ad=base+2*cc-2*xx/W
        pd=sum((2*w*(1-arb(n).log()/W)*(freq*arb(n).log()).cos() for n,w in terms),arb(0))
        if j==0:ed.append(32*sh/W-ad-pd);edprime.append(-pd);continue
        ps=sum((w*(freq*arb(n).log()).sin() for n,w in terms),arb(0));bp=ps/pi
        den=W*W+16*pi*pi*j*j;bj=32*W*j*sh/den+ss/pi+bp
        b.append(bj);bprime.append(bp)
        ed.append(32*W*sh*(W*W-16*pi*pi*j*j)/(den*den)-ad-pd+bj/j)
        edprime.append(-pd+bp/j)
    def element(j,k,prime=False):
        bb=bprime if prime else b;dd=edprime if prime else ed
        if j==k:return dd[j]
        if k==0:return (-1)**j*sq2*bb[j]/j
        if j==0:return (-1)**k*sq2*bb[k]/k
        return 2*(-1)**(j+k)*(j*bb[j]-k*bb[k])/(j*j-k*k)
    return locals()

def cosine_integral(freq,phase,lo,hi):
    if freq==0:return (hi-lo)*phase.cos()
    return ((freq*hi+phase).sin()-(freq*lo+phase).sin())/freq

def literal_prime_entry(ns,j,k):
    W,pi=ns['W'],ns['pi'];uj=2*pi*j/W;uk=2*pi*k/W
    aj=arb(1) if j==0 else ns['sq2'];ak=arb(1) if k==0 else ns['sq2']
    total=arb(0)
    for n,w in ns['terms']:
        shift=arb(n).log();lo=-W/2;hi=W/2-shift
        # Both directed translations, with their actual common overlap.
        v=(cosine_integral(2*pi*(j-k)/W,-uk*shift,lo,hi)+cosine_integral(2*pi*(j+k)/W,uk*shift,lo,hi)
          +cosine_integral(2*pi*(k-j)/W,-uj*shift,lo,hi)+cosine_integral(2*pi*(k+j)/W,uj*shift,lo,hi))/2
        total+=w*aj*ak*v/W
    return -total

def main():
    start=time.time();new=inputs();idx=[0,1,2,7,16,32]
    for j in idx:
        for k in idx:
            left=new['element'](j,k,True);right=literal_prime_entry(new,j,k)
            assert left.is_finite() and right.is_finite() and (left-right).contains(0),(j,k)
    # Coarse all-sequence coefficients: |beta| <=1/4+S/pi and
    # |b-beta|<=Cformula/j, so j>=2 is covered by this scalar gate.
    beta=arb(1)/4+sum((w for n,w in new['terms']),arb(0))/new['pi']
    Cformula=(2*new['W']*new['sh']+arb(1)/2+arb(55)*new['W']**2/48)/new['pi']**2
    assert Cformula<arb(13)/10 and beta+Cformula/2<3 and abs(new['b'][1])<3
    old_generic=inputs(Q(16))
    sys.path.insert(0,str(ROOT/'rh_attack_cycle_20261029/X16_even_feasibility'))
    from X16_analytic_inputs import build_inputs
    old=build_inputs(1000,36)
    for j in range(33):
        assert old_generic['b'][j].overlaps(old['b'][j])
        assert old_generic['ed'][j].overlaps(old['ed'][j])
        for k in range(33):
            left=old_generic['element'](j,k);right=old['elem'](j,k,'even')
            assert left.is_finite() and right.is_finite() and left.overlaps(right)
    out={'status':'PASS_SMALL_ACTUAL_ENTRY_GATES_ONLY','X':'16001/1000','precision_bits':ctx.prec,
         'generic_prime_integral_checked_indices':idx,'all_36_direct_prime_entries_overlap':True,
         'X16_all_1089_entries_match_accepted_builder':True,'new_prime_count':len(new['terms']),
         'Cbeta_formula':Cformula.str(90),'candidate_Cbeta':'13/10','beta_abs_upper':beta.str(90),
         'candidate_B3_j_ge_2_envelope':(beta+Cformula/2).str(90),'candidate_b1':new['b'][1].str(90),
         'seconds':time.time()-start,'source_sha256':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__).resolve(),ROOT/'rh_attack_cycle_20261029/X16_even_feasibility/X16_analytic_inputs.py']},
         'scope':'Generic actual low-entry source gate and coefficient-envelope checks. No near/self-energy far matrix, complete positivity test, or support extension claim.'}
    (HERE/'GENERIC_ACTUAL_HEAD_PILOT.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
if __name__=='__main__':main()
