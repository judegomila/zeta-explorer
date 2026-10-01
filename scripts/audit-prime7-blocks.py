"""Independent polynomial-integral checks of the prime-7 collar geometry.

This audits the reduction, not the infinite-dimensional positivity claim.
No functions are imported from the main certificate implementation.
"""
import argparse
import hashlib
import json
from math import comb
from pathlib import Path
from flint import arb, acb, arb_mat, ctx


def close(x):
    assert x.contains(0) and abs(x) < arb('1e-60'), str(x)


def integral(n, u, m, v, lo, hi):
    """Integrate (y+u)^n (y+v)^m by its exact polynomial antiderivative."""
    return sum(arb(comb(n, k)*comb(m, j))*u**(n-k)*v**(m-j)
               * (hi**(k+j+1)-lo**(k+j+1))/(k+j+1)
               for k in range(n+1) for j in range(m+1))


def next_eight_geometry():
    """Check the next decomposition and baseline, not its Weil positivity."""
    B = arb(43)/20
    a = B/2
    l5,l7,l8,l9 = [arb(k).log() for k in (5,7,8,9)]
    c5,c7,c8 = l5/arb(5).sqrt(),l7/arb(7).sqrt(),arb(2).log()/arb(8).sqrt()
    u,v,e = l8-l7,l7-l5,B-l8
    assert l9-l8 < u and l9-l7 < v and l9 < 2*l5
    assert 0 < e < u and e+u < v
    A8 = arb_mat(8,8)
    for i,j,c in [(0,1,c5),(1,2,c7),(2,3,c5),(4,5,c5),(5,6,c7),(6,7,c5),(1,6,c8)]:
        A8[i,j] = A8[j,i] = c
    A4 = arb_mat([[0,c5,0,0],[c5,0,c7,0],[0,c7,0,c5],[0,0,c5,0]])
    A2 = arb_mat([[0,c5],[c5,0]])
    # The tree is bipartite, so positive (1.3 I-A8) implies ||A8||<1.3.
    D = -A8
    for i in range(8): D[i,i] += arb(13)/10
    pivots = []
    for i in range(8):
        pivot = D[i,i]
        assert pivot > 0
        pivots.append(pivot.lower())
        for j in range(i+1,8):
            for k in range(i+1,8):
                D[j,k] -= D[j,i]*D[i,k]/pivot
    close(8*e+4*(u-e)+2*(v-u-e)-2*(B-l5))
    fibers = [(arb(0),e,[l5,arb(0),l7,v,l5+u,u,l8,v+u],A8),
              (e,u,[l5,arb(0),l7,v],A4),
              (e+u,v,[arb(0),l5],A2)]
    for n in range(4):
        for m in range(4):
            direct = -sum(c*(integral(n,arb(0),m,l,-a,a-l)+integral(m,arb(0),n,l,-a,a-l))
                          for l,c in [(l5,c5),(l7,c7),(l8,c8)])
            component = -sum(A[i,j]*integral(n,x-a,m,y-a,lo,hi)
                             for lo,hi,offsets,A in fibers
                             for i,x in enumerate(offsets) for j,y in enumerate(offsets))
            close(component-direct)
    tail = acb(arb(1)/4,220).digamma().real-arb.pi().log()
    tail -= sum(2*arb(p).log()/arb(n).sqrt() for n,p in [(2,2),(3,3),(4,2)])
    assert tail > arb(13)/10
    return {'geometry_checks_width':'43/20', 'chain_norm_upper':'13/10',
            'minimum_baseline_ldl_pivot_lower':str(min(pivots)),
            'old_tail_floor_T440':str(tail),
            'prime8_positivity_certified':False}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output')
    args = parser.parse_args()
    ctx.prec = 320
    B, a, d = arb(2), arb(1), arb(6)/5
    l5, l7 = arb(5).log(), arb(7).log()
    c5, c7 = l5/arb(5).sqrt(), l7/arb(7).sqrt()
    delta, offset = B-l7, l7-l5
    assert 0 < delta < offset and B < 2*l5 and B < arb(8).log()
    # All collar intervals are disjoint except for measure-zero boundaries.
    close(4*delta+2*(offset-delta) - 2*(B-l5))
    close(B-2*(B-l5) - (2*l5-B))
    A4 = arb_mat([[0,c5,0,0],[c5,0,c7,0],[0,c7,0,c5],[0,0,c5,0]])
    A2 = arb_mat([[0,c5],[c5,0]])
    D4, D2 = -A4, -A2
    for i in range(4): D4[i,i] += d
    for i in range(2): D2[i,i] += d
    # Independent closed inverse from reflection-even / reflection-odd 2x2 blocks.
    plus = arb_mat([[d-c7,c5],[c5,d]])/(d*(d-c7)-c5*c5)
    minus = arb_mat([[d+c7,c5],[c5,d]])/(d*(d+c7)-c5*c5)
    H4 = arb_mat(4,4)
    for i in range(2):
        for j in range(2):
            H4[i,j] = H4[3-i,3-j] = (plus[i,j]+minus[i,j])/2
            H4[i,3-j] = H4[3-i,j] = (plus[i,j]-minus[i,j])/2
    H2 = arb_mat([[d,c5],[c5,d]])/(d*d-c5*c5)
    for D,H in [(D4,H4),(D2,H2)]:
        residual = D*H
        for i in range(D.nrows()):
            for j in range(D.ncols()): close(residual[i,j]-int(i==j))
    wrong = arb_mat([[d,c5,0,0],[c5,d,c7,0],[0,c7,d,c5],[0,0,c5,d]])*H4
    assert abs(wrong[0,1]) > arb('0.1')
    rho = (c7+(c7*c7+4*c5*c5).sqrt())/2
    assert d > rho > c5
    close(rho*rho-c7*rho-c5*c5)
    # Entries of the translation form in an unnormalized monomial basis.
    fibers = [(arb(0),delta,[l5,arb(0),l7,offset],A4,H4),
              (delta,offset,[arb(0),l5],A2,H2)]
    nodes = [arb.legendre_p_root(6,k,weight=True) for k in range(6)]
    for n in range(6):
        for m in range(6):
            direct = -sum(c*(integral(n,arb(0),m,ell,-a,a-ell)
                             +integral(m,arb(0),n,ell,-a,a-ell))
                          for ell,c in [(l5,c5),(l7,c7)])
            chain, gram, quadrature = arb(0), arb(0), arb(0)
            for lo,hi,offsets,A,H in fibers:
                for i,u in enumerate(offsets):
                    for j,v in enumerate(offsets):
                        term = integral(n,u-a,m,v-a,lo,hi)
                        chain -= A[i,j]*term
                        correction = H[i,j]-int(i==j)/d
                        gram += correction*term
                        for root,weight in nodes:
                            y = lo+(root+1)*(hi-lo)/2
                            quadrature += weight*(hi-lo)/2*correction*(y+u-a)**n*(y+v-a)**m
            close(chain-direct)
            close(quadrature-gram)
            if (n+m)%2:
                close(chain)
                close(gram)
    # For h=1, deleting the 7-edge changes the form by a strictly positive amount.
    omitted_seven_difference = 2*c7*delta
    assert omitted_seven_difference > arb('0.079')
    next_step = next_eight_geometry()
    checks = ['collar partition and free interior measure',
              'reflection block inverse', 'pair inverse', 'wrong inverse sign rejected',
              'chain norm and positive baseline',
              '36 translation entries versus direct polynomial integrals',
              '36 inverse-Gram entries versus exact-degree Gauss quadrature',
              'mixed-parity entries vanish', 'omitted prime-7 edge detected',
              'prime-8 geometry and collar partition',
              '16 prime-8 translation entries versus polynomial integrals',
              'prime-8 baseline norm and admissible old tail floor']
    result = {'status':'passed', 'scope':'independent prime-7 geometry and integration checks; not RH',
              'checks':checks, 'precision_bits':ctx.prec,
              'omitted_prime7_constant_test_difference':str(omitted_seven_difference),
              'next_prime_power_8':next_step,
              'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    payload = json.dumps(result,indent=2)+'\n'
    if args.output: Path(args.output).write_text(payload)
    print(payload)


if __name__ == '__main__':
    main()
