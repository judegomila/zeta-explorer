#!/usr/bin/env python3
"""Arb displacement-rank replay of the unchanged lambda=2.5 certificate.

The exact lower-surrogate matrix is inherited from the archived producer.  Its
near-tail correction is represented by four displacement-generator columns;
its far-tail correction is handled by a small bordered Schur complement.
No midpoint operation contributes to any certificate decision.
"""
import argparse
import ast
import hashlib
import json
import time
from pathlib import Path

from flint import arb, arb_mat, ctx

HERE = Path(__file__).resolve().parent
BASE = HERE.parent / 'spectral' / 'certify_lambda25_full_ground.py'


def baseline_inputs(bits):
    """Execute only the original analytic setup and function definitions.

    Stop before its first `results=[]` statement, hence before matrix assembly,
    LDL, certificate output, or copying.  Do not edit the archived producer.
    """
    source = BASE.read_text()
    module = ast.parse(source, filename=str(BASE))
    statements = []
    for node in module.body:
        if isinstance(node, ast.Assign) and any(
            isinstance(t, ast.Name) and t.id == 'results' for t in node.targets
        ):
            break
        # Precision is the sole changed setup instruction.
        if isinstance(node, ast.Assign) and any(
            isinstance(t, ast.Attribute) and isinstance(t.value, ast.Name)
            and t.value.id == 'ctx' and t.attr == 'prec' for t in node.targets
        ):
            node.value = ast.Constant(bits)
        statements.append(node)
    namespace = {'__file__': str(BASE), '__name__': 'archived_setup_only'}
    exec(compile(ast.fix_missing_locations(ast.Module(body=statements,
        type_ignores=[])), str(BASE), 'exec'), namespace)
    return namespace, hashlib.sha256(source.encode()).hexdigest()


def dense_ldl(matrix):
    """Arb no-pivot LDL with a proof-producing sign test at every pivot."""
    n = matrix.nrows()
    lower = [[arb(0) for _ in range(n)] for _ in range(n)]
    pivots = []
    for j in range(n):
        ld = [lower[j][k] * pivots[k] for k in range(j)]
        p = matrix[j,j] - sum((lower[j][k] * ld[k] for k in range(j)), arb(0))
        if not p > 0:
            return pivots, {'pass_positive': False, 'failed_index': j,
                            'pivot': p.str(60)}
        pivots.append(p)
        for i in range(j+1,n):
            lower[i][j] = (matrix[i,j] - sum(
                (lower[i][k] * ld[k] for k in range(j)), arb(0))) / p
    return pivots, pivot_receipt(pivots)


def pivot_receipt(pivots):
    return {'pass_positive': True, 'dimension': len(pivots),
        'min_pivot_lower': str(min(p.lower() for p in pivots)),
        'min_relative_accuracy_bits': min(p.rel_accuracy_bits() for p in pivots),
        'last_pivot': pivots[-1].str(60)}


def far_features(ns, idx, parity):
    """Return P (feature x head) and H with exact far=P.T*H*P+rem*I."""
    L,J,b = ns['L'],ns['J'],ns['b']
    sq2,eps,epsb = ns['sq2'],ns['eps'],ns['epsb']
    HA,HC,HD = ns['HA'],ns['HC'],ns['HD']
    P = arb_mat(2*L,len(idx))
    for ell in range(L):
        for i,k in enumerate(idx):
            a = arb(1) if k == 0 else sq2*(-1)**k
            q = arb(k)/J
            if parity == 'even':
                P[ell,i] = a*q**(2*ell)
                P[L+ell,i] = a*b[k]*q**(2*ell+1)
            else:
                P[ell,i] = a*q**(2*ell+1)
                P[L+ell,i] = a*b[k]*q**(2*ell)
    ha,hc = (HA,HC) if parity == 'even' else (HC,HA)
    he = (HC if parity == 'even' else HD) * (arb(1)/(J*J))
    hb = ha*(4*(1+epsb)*ns['mean']) + he*(2*(1+1/epsb)*ns['Cbeta']**2)
    for ell in range(L):
        hb[ell,ell] += 4*(1+epsb)*ns['deltaosc']
    ho = hc*(4*(1+epsb))
    H = arb_mat(2*L,2*L)
    scale = (1+eps)/ns['dfar']
    for p in range(L):
        for q in range(L):
            H[p,q] = hb[p,q]*scale
            H[L+p,L+q] = ho[p,q]*scale
    return P,H


def near_generators(ns,idx,parity):
    """Construct C's diagonal and two wedge pairs, without a dense Gram.

    C=A-nearGram-(alpha+rem)I+the even constant-coordinate lift.
    Delta(C)=(z-U) wedge a + z wedge V, with nodes x=k^2.
    """
    N,J,b,sq2 = ns['N'],ns['J'],ns['b'],ns['sq2']
    xs = [k*k for k in idx]
    if parity == 'even':
        aa = [arb(1) if k == 0 else sq2*(-1)**k for k in idx]
        tt = [k*b[k] for k in idx]
        tails = [(j*j, j*b[j], 2/ns['ds'][j]) for j in range(N+1,J+1)]
    else:
        aa = [sq2*(-1)**k*k for k in idx]
        tt = [b[k]/k for k in idx]
        tails = [(j*j, b[j]/j, arb(2*j*j)/ns['ds'][j]) for j in range(N+1,J+1)]
    g,h,diagonal = [],[],[]
    for k,x,a,t in zip(idx,xs,aa,tt):
        F,G,H,diag = arb(0),arb(0),arb(0),arb(0)
        for y,tj,wa2 in tails:
            den = y-x
            f = wa2/den
            F += f
            G += f*tj
            H += f*tj*tj
            diag += wa2*(a*(tj-t)/den)**2
        z = a*t
        U = a*(H-t*G)
        V = a*(t*F-G)
        g.append([z-U,z])
        h.append([a,V])
        diagonal.append(ns['elem'](k,k,parity)-ns['alpha']-ns['rem']-diag
                        +(1 if parity == 'even' and k == 0 else 0))
    return xs,g,h,diagonal


def displacement_entry(xs,g,h,i,j):
    return sum((g[i][k]*h[j][k]-h[i][k]*g[j][k]
                for k in range(len(g[i]))),arb(0))/(xs[i]-xs[j])


def structured_eliminate(xs,g,h,diagonal,P,pivoting=True):
    """Rank-four interval LDL, simultaneously eliminating feature RHS.

    R initially equals P.T.  Accumulate S=P C^{-1} P.T using the same LDL.
    This does not store the n-by-n triangular factor.
    """
    xs = xs[:]
    g = [row[:] for row in g]
    h = [row[:] for row in h]
    diagonal = diagonal[:]
    n,r = len(xs),P.nrows()
    order = list(range(n))
    rhs = [[P[q,i] for q in range(r)] for i in range(n)]
    S = [[arb(0) for _ in range(r)] for _ in range(r)]
    pivots = []
    for p in range(n):
        if pivoting:
            # A midpoint may select a permutation, never certify a sign.
            chosen = max(range(p,n),key=lambda i:float(diagonal[i].mid()))
            for vec in (xs,g,h,diagonal,rhs,order):
                vec[p],vec[chosen] = vec[chosen],vec[p]
        d = diagonal[p]
        if not d > 0:
            return pivots,None,{'pass_positive':False,'failed_index':p,
                                'pivot':d.str(60),'elimination_order':order}
        pivots.append(d)
        gp,hp,rp = g[p][:],h[p][:],rhs[p][:]
        rp_div = [v/d for v in rp]
        for q in range(r):
            for s in range(q,r):
                S[q][s] += rp[q]*rp_div[s]
        for i in range(p+1,n):
            v = displacement_entry(xs,g,h,i,p)
            ell = v/d
            diagonal[i] -= v*ell
            for q in range(len(gp)):
                g[i][q] -= ell*gp[q]
                h[i][q] -= ell*hp[q]
            for q in range(r):
                rhs[i][q] -= ell*rp[q]
        if p%128 == 0:
            print('structured pivot',p,d.str(14),'accuracy_bits',d.rel_accuracy_bits(),flush=True)
    for q in range(r):
        for s in range(q):
            S[q][s] = S[s][q]
    receipt = pivot_receipt(pivots)
    receipt['elimination_order'] = order
    return pivots,arb_mat(S),receipt


def dense_original(ns,idx,parity,P,H):
    size = len(idx)
    K = arb_mat(ns['J']-ns['N'],size)
    for row,j in enumerate(range(ns['N']+1,ns['J']+1)):
        sw = (1/ns['ds'][j]).sqrt()
        for i,k in enumerate(idx):
            K[row,i] = sw*ns['elem'](j,k,parity)
    core = arb_mat(size,size)
    for i,k in enumerate(idx):
        for j,l in enumerate(idx):
            core[i,j] = ns['elem'](k,l,parity)
        core[i,i] -= ns['alpha']+ns['rem']
    if parity == 'even':
        core[0,0] += 1
    core = core-K.transpose()*K
    return core,core-P.transpose()*H*P


def run_block(ns,max_index,parity,check_dense,pivoting):
    started = time.time()
    idx = list(range(0 if parity == 'even' else 1,max_index+1))
    P,H = far_features(ns,idx,parity)
    xs,g,h,diagonal = near_generators(ns,idx,parity)
    setup_seconds = time.time()-started
    dense_checks = None
    if check_dense:
        dense_started = time.time()
        C,M = dense_original(ns,idx,parity,P,H)
        discrepancy = arb(0)
        for i in range(len(idx)):
            assert (diagonal[i]-C[i,i]).contains(0)
            for j in range(i):
                diff = displacement_entry(xs,g,h,i,j)-C[i,j]
                assert diff.contains(0), (i,j,diff)
                discrepancy = max(discrepancy,abs(diff).upper())
        cp,cr = dense_ldl(C)
        mp,mr = dense_ldl(M)
        dense_checks = {'core':cr,'original_full_surrogate':mr,
            'all_initial_generator_entries_overlap_original':True,
            'offdiagonal_difference_abs_upper':str(discrepancy),
            'seconds':time.time()-dense_started}
    started_elimination = time.time()
    pivots,S,core_receipt = structured_eliminate(xs,g,h,diagonal,P,pivoting)
    elapsed = time.time()-started_elimination
    result = {'parity':parity,'max_head_index':max_index,'dimension':len(idx),
        'core_displacement_rank_bound':4,'far_feature_rank_bound':P.nrows(),
        'structured_core':core_receipt,'setup_seconds':setup_seconds,
        'structured_elimination_seconds':elapsed,'dense_checks':dense_checks}
    if S is not None:
        hp,hr = dense_ldl(H)
        T = H-H*S*H
        tp,tr = dense_ldl(T)
        result.update(far_coefficient_H=hr,bordered_schur=tr,
            pass_original_surrogate=core_receipt['pass_positive'] and hr['pass_positive'] and tr['pass_positive'])
        if check_dense and core_receipt['pass_positive'] and cr['pass_positive']:
            order = core_receipt['elimination_order']
            permuted = arb_mat([[C[i,j] for j in order] for i in order])
            cp,permuted_receipt = dense_ldl(permuted)
            dense_checks['permuted_core'] = permuted_receipt
            assert len(pivots) == len(cp)
            assert all(p.overlaps(q) for p,q in zip(pivots,cp))
            result['all_core_pivots_overlap_dense'] = True
    else:
        result['pass_original_surrogate'] = False
    result['seconds'] = time.time()-started
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--max-index',type=int,default=32)
    parser.add_argument('--bits',type=int,default=400)
    parser.add_argument('--parity',choices=['even','odd','both'],default='both')
    parser.add_argument('--dense',action='store_true')
    parser.add_argument('--natural-order',action='store_true')
    parser.add_argument('--output',default='STRUCTURED_LAMBDA25_SMALL.json')
    args = parser.parse_args()
    assert 1 <= args.max_index <= 512
    start = time.time()
    ns,source_sha = baseline_inputs(args.bits)
    blocks = []
    for parity in (['even','odd'] if args.parity == 'both' else [args.parity]):
        result = run_block(ns,args.max_index,parity,args.dense,not args.natural_order)
        print(json.dumps(result,indent=2),flush=True)
        blocks.append(result)
    out = {'status':'PASS' if all(b['pass_original_surrogate'] for b in blocks) else 'FAILED_OR_INCONCLUSIVE',
        'precision_bits':ctx.prec,'lambda_value':'2.5','original_N':ns['N'],
        'original_J':ns['J'],'original_L':ns['L'],'alpha':'1e-22',
        'original_source_sha256':source_sha,'blocks':blocks,'seconds':time.time()-start,
        'scope':'Exact same lower-surrogate as archived lambda2.5 full-ground producer, restricted to selected principal head indices. For max-index512 and both parities this replays its full finite certificate. Analytic operator dependencies unchanged; not an RH result.',
        'interval_contract':'All entries, diagonal updates, generators, feature solves and small LDL pivots use Arb directed ball arithmetic. Strict positivity is tested on the entire pivot ball. Exact displacement and bordered identities prove containment; overlap checks are supplemental regression checks, not their proof.'}
    (HERE/args.output).write_text(json.dumps(out,indent=2)+'\n')


if __name__ == '__main__':
    main()
