"""Arb certificate for a directional repair of the inherited FINITE test.

No assertion is made about the unobserved infinite-dimensional complement.
Input q enclosures are from discrete-curvature v3. Run regenerate_row.py
to independently regenerate them with the included original interval engine.
"""
from pathlib import Path
from fractions import Fraction
import json, hashlib, argparse
from flint import arb, arb_mat, ctx

ROOT = Path(__file__).resolve().parent

def eye(n):
    return arb_mat([[int(i == j) for j in range(n)] for i in range(n)])

def positive(M):
    """Interval LDL: accepting every pivot proves positive definiteness."""
    n=M.nrows(); L=[[arb(0) for _ in range(n)] for _ in range(n)]; ds=[]
    for j in range(n):
        d=M[j,j]-sum((L[j][k]**2*ds[k] for k in range(j)),arb(0))
        if not d>0: raise ArithmeticError(f'Nonpositive or unresolved pivot {j}: {d}')
        ds.append(d); L[j][j]=arb(1)
        for i in range(j+1,n):
            L[i][j]=(M[i,j]-sum((L[i][k]*L[j][k]*ds[k] for k in range(j)),arb(0)))/d
    return min(float(x.lower()) for x in ds)  # display only, not acceptance

def arbf(q):
    return arb(q.numerator)/q.denominator

def run(bits):
    ctx.prec=bits
    inp=ROOT/'input'
    data=json.loads((inp/'arithmetic-row.json').read_text())
    assert data['k']==6 and data['m']==128 and len(data['q'])==128
    # Union outward Arb enclosures of exact decimal endpoints.
    q=[arb(x['lower']).union(arb(x['upper'])) for x in data['q']]
    H=arb_mat([[q[abs(i-j)] for j in range(128)] for i in range(128)])
    wit=json.loads((inp/'refinement_witness.json').read_text())
    den=wit['denominator']; assert den==10**12
    # Same fixed 64-cell trial, embedded in 128 cells. P G = U,
    # where U's columns are disjoint blocks of eight ones; U*U = 8I.
    G=arb_mat([[arb(2*wit['trial_G_64'][i//2][j])/den for j in range(16)] for i in range(128)])
    for i in range(16):
        for j in range(16):
            assert sum(2*wit['trial_G_64'][k//2][j] for k in range(8*i,8*i+8))==8*den*int(i==j)
    P=arb_mat([[arb(int(i//8==j//8))/8 for j in range(128)] for i in range(128)])
    Q=eye(128)-P; beta=arb(5569)/10000
    K=Q*H*Q-Q*beta
    # Independently certify positivity of the 112-dimensional restriction
    # of K to the detail space. This finite check is sufficient here.
    W=arb_mat([[int(i==8*(j//7)+j%7)-int(i==8*(j//7)+7) for j in range(112)] for i in range(128)])
    detail_pivot=positive(W.transpose()*K*W)
    R=Q*H*G; F=G.transpose()*H*G
    C0=F-R.transpose()*R/beta
    # Direction selection is merely a proposal. Exact rationals are fixed
    # before the following interval proof. No float determines acceptance.
    Znums=[[round(Fraction(str(R[i,j].mid().fmpq()))*10**12) for j in range(16)] for i in range(128)]
    Z=Q*arb_mat([[arb(x)/10**12 for x in row] for row in Znums])
    A=Z.transpose()*K*Z; V=K*Z
    A_pivot=positive(A)
    M=A+V.transpose()*V/beta
    M_pivot=positive(M)
    B=V.transpose()*R
    capture_solve=M.inv()*B/beta
    correction=B.transpose()*capture_solve/beta
    C=C0+correction
    # Prove a spectral lower bound, not merely positive raw LDL pivots.
    margin=arb(29)/100000  # 0.00029 in normalized coarse coordinates
    C_pivot=positive(C-eye(16)*(8*margin))
    u=arb_mat([[arb(x)/den] for x in wit['coarse_u']])
    old=(u.transpose()*C0*u)[0,0]/(8*(u.transpose()*u)[0,0])
    assert old < -arb(1060)/10000
    # Deliberately reversed correction must fail for the same direction.
    wrong=(u.transpose()*(C0-correction)*u)[0,0]
    assert wrong < 0
    try:
        positive(-C)
    except ArithmeticError:
        negative_rejected=True
    else:
        raise AssertionError('Negative matrix incorrectly accepted')
    # Independently evaluate the inherited infinite-detail FLOOR only.
    # This does not certify the full infinite-directional correction.
    pi=arb.pi(); T=2*arb(2).log(); h=T/16
    cost=arb(2).log()/arb(2).sqrt()+arb(3).log()/arb(3).sqrt()
    floor=(1/(2*h)).log()-(1/pi+arb(1)/2)*h-cost-h**2/(2*pi**2)*((T/2).sinh()+T/2)
    assert floor > beta
    # Attempt the inherited v3 continuum test at THE SAME 128-cell grid.
    # The combined remainder is the operator tail of G-Z*capture_solve.
    trial=G-Z*capture_solve
    physical=trial/(T/128).sqrt()
    J=arb_mat([[physical[0,j] if i==0 else -physical[127,j] if i==128 else physical[i,j]-physical[i-1,j] for j in range(16)] for i in range(129)])
    delta=T/128
    bigK=abs((arb(1)/4).digamma()-pi.log())+4+2*cost
    cdelta=bigK+(1+2/delta).log()
    aa=2*delta**2/pi**2*((T/2).sinh()-T/2)*((T/2).sinh()+T/2)
    bb=2*delta/pi*(5*cdelta**2+8*cdelta+8)
    E=aa*(trial.transpose()*trial)+(bb*129)*(J.transpose()*J)
    remainder=R-V*capture_solve
    finite_variational=F-capture_solve.transpose()*A*capture_solve-remainder.transpose()*remainder/beta
    assert all((finite_variational[i,j]-C[i,j]).contains(0) for i in range(16) for j in range(16))
    continuum_test=finite_variational-E/beta
    continuum_direction=(u.transpose()*continuum_test*u)[0,0]/(8*(u.transpose()*u)[0,0])
    assert continuum_direction<0
    out={
        'status':'PASS_FINITE_DIRECTIONAL_REPAIR', 'precision_bits':bits,
        'support':'log(4)', 'coarse_cells':16, 'trial_cells':64,
        'observed_cells':128, 'capture_columns':16, 'beta':'5569/10000',
        'same_trial_as_inherited_v3':True,
        'old_fixed_direction_rayleigh_interval':str(old),
        'normalized_new_lower_bound':'29/100000',
        'new_bound_statement':'C_directional / 8 > (29/100000) I_16',
        'same_grid_continuum_test':'FAIL_SUFFICIENT_BOUND_ONLY',
        'same_grid_continuum_test_direction_interval':str(continuum_direction),
        'infinite_detail_floor_interval':str(floor),
        'minimum_ldl_pivot_display_only':{'finite_detail':detail_pivot,'A':A_pivot,'M':M_pivot,'new_minus_margin':C_pivot},
        'negative_controls':{'negative_matrix_rejected':negative_rejected,'reversed_correction_rejected':True},
        'capture_rational_denominator':10**12, 'capture_rational_numerators':Znums,
        'source_sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [inp/'arithmetic-row.json',inp/'refinement_witness.json',Path(__file__)]},
        'continuum_correction_certified':False, 'new_support_positivity_claim':False,
        'rh_proof_claim':False,
        'limitation':'Input coefficient intervals and their analytic formula are a trust boundary. No omitted continuum residual or all-support estimate is certified.'}
    target=ROOT/f'directional-results-{bits}.json'
    target.write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps({k:v for k,v in out.items() if k not in ('capture_rational_numerators','source_sha256')},indent=2))
    return out

if __name__=='__main__':
    if not __debug__:raise RuntimeError('Do not disable certificate assertions')
    p=argparse.ArgumentParser();p.add_argument('--bits',type=int,default=384)
    run(p.parse_args().bits)
