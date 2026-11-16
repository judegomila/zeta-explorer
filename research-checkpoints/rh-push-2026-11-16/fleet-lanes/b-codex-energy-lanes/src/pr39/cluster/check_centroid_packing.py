"""Exact rational checks for the two centroid packing estimates."""
from fractions import Fraction as F
from itertools import product


def signed(v, b):
    return (v*v-b*b)/(v*v+b*b)**2


def check_local():
    cases = 0
    for k in range(1,161):
        x = F(k,32)
        for j in range(33):
            u = x*j/32
            adverse = u*u*max(0,-signed(x,1))
            overlap = max(0,min(x+u,1)-(x-u))
            assert 8*adverse <= overlap
            # Compare the second charge to sin(Omega)/sqrt(3) by squaring.
            denom = (1+(x-u)**2)*(1+(x+u)**2)
            loss = 2*u*u/(1+x*x)**2
            assert 3*loss**2*denom <= 4*u*u
            cases += 1
    return cases


def check_site_counts():
    # Each tuple is (simple line copies, other line copies, off-line copies).
    types = [(1,0,0),(0,2,0),(0,0,2),(1,0,2),(0,3,2)]
    cases = 0
    for sites in product(types, repeat=5):
        count = sum(sum(site) for site in sites)
        simple = sum(site[0] for site in sites)
        singleton = [sum(site)==1 for site in sites]
        full_pairs = sum(a and b for a,b in zip(singleton,singleton[1:]))
        projected_pairs = sum(a[0] and b[0] for a,b in zip(sites,sites[1:]))
        assert full_pairs >= 2*simple-count-1
        assert 2*projected_pairs >= 2*(simple-1)-(count-simple)
        cases += 1
    return cases


def check_surplus():
    cases = 0
    for d in [F(1,999), F(1,4), F(2), F(3)]:
        gap = [-d,d]
        for b in [F(1,10000), F(1,3)]:
            for v in [d,2*d,100*d]:
                # Include coheight exterior pairs and a far real zero.
                exterior = [(v,b),(v,-b),(-3*d,F(0))]
                bound = sum(1/(t*t+y*y) for t,y in exterior)
                contribution = sum(signed(t,y) for t,y in exterior)
                curvature = sum(1/t**2 for t in gap)+contribution
                loss = sum(2*d*d*y*y/(t*t+y*y)**2 for t,y in exterior)
                assert d*d*(curvature-bound)==2-loss
                hypothetical = -2/b**2+contribution
                assert hypothetical <= bound-2/b**2
                cases += 1
    return cases


if __name__ == '__main__':
    print("Local rational rectangles:", check_local())
    print("Finite site sequences:", check_site_counts())
    print("Surplus and reflected-pair models:", check_surplus())
    assert F(2,5)-F(3,10)-F(3,35)-F(1,200)==F(13,1400)
    # Outward rational check using pi < 355/113 and sqrt(3) > 1.732.
    assert F(1,3)-F(1,200)-16*F(355,113)/(93*F(1732,1000)) > F(162,10000)
