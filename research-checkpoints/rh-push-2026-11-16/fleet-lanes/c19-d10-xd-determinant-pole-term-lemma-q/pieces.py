# N = (1/2) A[ L(x1,y1) L(x2,y2) b(x12) b(y12) ]  (X = 0).  Pole base: L_b = Lp - 2 gam gam^T,
#   variant 'plus' : Lp = (x+1)(y+1) L_g,  gam = g(x);    variant 'minus': Lp = (x-1)(y-1) L_g, gam = g(-x).
# Exact inertia of the pieces on the Gram points.
from xd import *
def polymat_shift(Lg, s):   # coefficients of (x+s)(y+s) Lg(x,y), size (d+1)x(d+1)
    d = len(Lg); M = [[0]*(d+1) for _ in range(d+1)]
    for i in range(d):
        for j in range(d):
            c = Lg[i][j]
            M[i+1][j+1] += c; M[i+1][j] += s*c; M[i][j+1] += s*c; M[i][j] += s*s*c
    return M
def pieces(specs, variant='plus'):
    b = bpoly(specs, 'pole'); g = bpoly(specs, 'minus'); n = len(b)-1
    # b = (u-1) g up to a common positive scale: check
    chk = [0]*(n+1)
    for i, c in enumerate(g): chk[i+1] += c; chk[i] -= c
    assert chk == b
    Lg = bezout(g); s = 1 if variant == 'plus' else -1
    Lp = polymat_shift(Lg, s); gam = [c*(s**k) for k, c in enumerate(g)]   # g(x) or g(-x)
    Lb = bezout(b)
    for i in range(n):
        for j in range(n): assert Lb[i][j] == Lp[i][j] - 2*gam[i]*gam[j]
    pts, m = pointset(n)
    def bev(u):
        r = 0
        for c in reversed(b): r = r*u + c
        return r
    rows = []
    for p in pts:
        acc = [[0]*n for _ in range(n)]
        for (x, sg) in orbit(p):
            w = sg*bev(x[0]+x[1]); p1 = [x[0]**k for k in range(n)]; p2 = [x[1]**k for k in range(n)]
            for i in range(n):
                for j in range(n): acc[i][j] += w*p1[i]*p2[j]
        rows.append(acc)
    Th = [fmpz_mat(n, n, [x for r in a for x in r]) for a in rows]     # Theta(p) as n x n matrix
    Lpm = fmpz_mat(n, n, [x for r in Lp for x in r]); gm = fmpz_mat(n, 1, gam); Lbm = fmpz_mat(n, n, [x for r in Lb for x in r])
    def gramof(A1, A2):   # sum_{abcd} A1[a,c] A2[b,d] Th_p[a,b] Th_q[c,d] = tr( Th_p^T A1 Th_q A2^T )
        K = [A1*T*A2.transpose() for T in Th]
        return fmpz_mat(m, m, [sum((Th[i][a, c]*K[j][a, c] for a in range(n) for c in range(n)), fmpz(0)) for i in range(m) for j in range(m)])
    gg = gm*gm.transpose()
    out = {}
    N2 = gramof(Lbm, Lbm); out['2N'] = inertia_int(N2)
    PP = gramof(Lpm, Lpm); out['Lp(x)Lp'] = inertia_int(PP)
    Pg = gramof(Lpm, gg); gP = gramof(gg, Lpm); out['Lp(x)gg'] = inertia_int(Pg); out['gg(x)Lp'] = inertia_int(gP)
    G4 = gramof(gg, gg); out['gg(x)gg'] = inertia_int(G4)
    out['cross sum'] = inertia_int(Pg+gP)
    assert N2 == PP - 2*Pg - 2*gP + 4*G4
    out['Lp(x)Lp + 4gggg'] = inertia_int(PP+4*G4)
    return out
if __name__ == '__main__':
    for name, sp in (('sym real pair', [('r', '1/4')]), ('sym quartet', [('q', '1/4', '1')]), ('sym d=6', [('q', '1/4', '1'), ('l', '2')]), ('left pair', [('p', '1/5', '2')]), ('right pair', [('p', '4/5', '2')]), ('left+right pair', [('p', '1/5', '2'), ('p', '2/3', '1')])):
        for v in ('plus', 'minus'): print(name, v, pieces(sp, v), flush=True)
