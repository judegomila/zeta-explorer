from lib import *
# general real roots: rank and inertia of H_b
cases = {
 'n=1 {1}': [q(1)], 'n=1 {-2/3}': [q(-2,3)],
 'n=2 {1,-1/3}': [q(1), q(-1,3)], 'n=2 {-1/5,-1/3}': [q(-1,5), q(-1,3)], 'n=2 {2,3}':[q(2),q(3)],
 'n=3 {1,-1/5,-1/3} (two left)': [q(1), q(-1,5), q(-1,3)],
 'n=3 {1,-3/5,-4/5} (two right)': [q(1), q(-3,5), q(-4,5)],
 'n=3 {1,-1/4,-3/4} (partners)': [q(1), q(-1,4), q(-3,4)],
 'n=3 {-1,-1/4,-3/4} all neg': [q(-1), q(-1,4), q(-3,4)],
 'n=3 {-1,-1/4,-7/4} all neg': [q(-1), q(-1,4), q(-7,4)],
 'n=3 {2,3,5}': [q(2), q(3), q(5)],
 'n=4 {1,-1/5,-1/3,-3/5}': [q(1), q(-1,5), q(-1,3), q(-3,5)],
 'n=4 all neg': [q(-1), q(-1,5), q(-1,3), q(-3,5)],
 'n=4 {1,-3/5,-4/5,-7/10}': [q(1), q(-3,5), q(-4,5),q(-7,10)],
 'n=4 {1,-1/4,-3/4,-7/10}': [q(1), q(-1,4), q(-3,4),q(-7,10)],
}
for k, r in cases.items():
    H, B, bad = fitH(r)
    print(k, 'basis', len(B), 'fitfail', bad, 'inertia', inertia(H))
# Gram on crossing points p_ij for n=3 generic
r = [q(1), q(-1,5), q(-1,3)]; psi = mkpsi(mkb(r))
pts = [(a, c) for a in r for c in r]
G = fmpq_mat(9, 9, [N(a, c, psi) for a in pts for c in pts])
print('rank of N on 9 crossing points', G.rank())
