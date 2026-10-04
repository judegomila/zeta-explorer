# (1) constants of Lehman-Brent Thm 2.1 / Trudgian Cor 2.3 and their rounding;
# (2) explicit zero configuration consistent with |int_{t1}^{t2} S| <= a + b log t2 on EVERY subinterval, with K Rosser blocks
#     after a good Gram point g_n and N(g_n) = n + 3  (so N(g_n) <= n+1 fails) -- tests whether the block criterion can follow
#     from the integral bound alone.
import mpmath as mp
mp.mp.dps = 40
L2PI = mp.log(2*mp.pi)
for name, a, b in [('Lehman (1.7, 0.114)', mp.mpf('1.7'), mp.mpf('0.114')), ('Trudgian Thm 2.2 (2.067, 0.059)', mp.mpf('2.067'), mp.mpf('0.059'))]:
    c2 = b/(6*mp.pi); c1 = (a - b*L2PI)/(6*mp.pi)
    print(f"{name}: exact (b/6pi, (a-b log2pi)/6pi) = ({mp.nstr(c2,8)}, {mp.nstr(c1,8)})")
c2 = mp.mpf('0.059')/(6*mp.pi); c1 = (mp.mpf('2.067') - mp.mpf('0.059')*L2PI)/(6*mp.pi)
print("Cor 2.3 (0.0031, 0.11) dominates exact Trudgian form iff log g <=", mp.nstr((mp.mpf('0.11')-c1)/(c2-mp.mpf('0.0031')), 8))
def theta(t): return mp.im(mp.loggamma(mp.mpf(1)/4 + 0.5j*t)) - t/2*mp.log(mp.pi)
def gram(n, guess):
    return mp.findroot(lambda t: theta(t) - n*mp.pi, guess)
def flint_bound(g):
    L = mp.log(g); return mp.ceil(min(mp.mpf('0.0061')*L*L + mp.mpf('0.08')*L, mp.mpf('0.0031')*L*L + mp.mpf('0.11')*L))
def experiment(g0, a, b, K, label):
    n0 = int(mp.floor(theta(mp.mpf(g0))/mp.pi))
    # Gram points g_{n0-3} .. g_{n0+K+5}
    G = {}
    t = mp.mpf(g0)
    for j in range(-3, K + 6):
        t = gram(n0 + j, t if j == -3 else t + 2*mp.pi/mp.log(t/(2*mp.pi)))
        G[n0 + j] = t
    n = n0; p = n0 + K
    zeros = []
    # background (mean-zero S): one zero at the midpoint of each Gram interval before g_{n-1} and after g_{p+2}
    for j in range(n0 - 3, n - 1): zeros.append((G[j] + G[j+1]) / 2)
    gm = (G[n-1] + G[n]) / 2; zeros += [gm, G[n] - mp.mpf('1e-9'), G[n] - mp.mpf('1e-9')]   # 3 zeros in [g_{n-1}, g_n): S jumps +3 overall
    for j in range(n, p): zeros.append(G[j+1] - mp.mpf('1e-9'))                             # K unit Rosser blocks, zero at the right end
    # [g_p, g_{p+2}): no zeros (S comes down by 2); afterwards background again
    for j in range(p + 2, p + 5): zeros.append((G[j] + G[j+1]) / 2)
    zeros.sort()
    tA, tB = G[n0 - 3], G[p + 5]
    N_A = (n0 - 3) + 1          # background normalisation: S(g_j) = 0 there, i.e. N(g_j) = j + 1
    # S(t) = N(t) - 1 - theta(t)/pi ; integrate exactly piecewise (theta integrated by Gauss-Legendre per piece, 40 digits)
    pts = [tA] + [z for z in zeros if tA < z < tB] + [tB]
    F = [mp.mpf(0)]; ts = [tA]; Nc = N_A
    for i in range(len(pts) - 1):
        x, y = pts[i], pts[i+1]
        if i > 0: Nc += 1
        I = (Nc - 1)*(y - x) - mp.quad(theta, [x, y])/mp.pi
        # sample interior for max/min of F (S monotone decreasing between zeros, so F is concave there: check endpoints + stationary point)
        F.append(F[-1] + I); ts.append(y)
    # max over t1<t2 of F(t2)-F(t1) and of F(t1)-F(t2); refine with sub-sampling of each piece
    fine_t = []; fine_F = []
    Nc = N_A; acc = mp.mpf(0)
    for i in range(len(pts) - 1):
        x, y = pts[i], pts[i+1]
        if i > 0: Nc += 1
        for s in range(8):
            u = x + (y - x)*s/8
            fine_t.append(u); fine_F.append(acc + (Nc - 1)*(u - x) - mp.quad(theta, [x, u])/mp.pi if s else acc)
        acc += (Nc - 1)*(y - x) - mp.quad(theta, [x, y])/mp.pi
    fine_t.append(tB); fine_F.append(acc)
    best_pos = mp.mpf(0); best_neg = mp.mpf(0); mn = fine_F[0]; mx = fine_F[0]
    for f in fine_F:
        best_pos = max(best_pos, f - mn); best_neg = max(best_neg, mx - f); mn = min(mn, f); mx = max(mx, f)
    bnd = a + b*mp.log(tB)
    Ng = {j: N_A + sum(1 for z in zeros if z <= G[j]) for j in G}
    good = all((Ng[j] - (j + 1)) % 2 == 0 for j in range(n, p + 1))
    Delta = G[p] - G[p-1]
    print(f"{label}: g_n = {mp.nstr(G[n], 16)}, K = {K} unit blocks, FLINT/Cor2.3 bound = {flint_bound(G[p])}, N(g_n) - (n+1) = {Ng[n] - (n+1)},"
          f" all g_n..g_p good: {good}, Gram spacing = {mp.nstr(Delta, 6)}")
    print(f"     max_t1<t2 int S = {mp.nstr(best_pos, 6)}, max_t1<t2 (-int S) = {mp.nstr(best_neg, 6)}, bound a + b log t = {mp.nstr(bnd, 6)}"
          f"  => consistent with the integral bound: {best_pos < bnd and best_neg < bnd}")
experiment('7800000001000', mp.mpf('2.067'), mp.mpf('0.059'), 6, 'Trudgian Thm 2.2 at 7.8e12')
experiment('7800000001000', mp.mpf('2.067'), mp.mpf('0.059'), 9, 'Trudgian Thm 2.2 at 7.8e12')
experiment('7800000001000', mp.mpf('2.067'), mp.mpf('0.059'), 10, 'Trudgian Thm 2.2 at 7.8e12')
experiment('10000000000', mp.mpf('1.71'), mp.mpf('0.114'), 6, 'Lehman (Brent Thm 3.1) at 1e10')
experiment('32585736', mp.mpf('1.71'), mp.mpf('0.114'), 4, 'Lehman at Brent 1979 height 3.26e7')
