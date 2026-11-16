# Check: Q_a(v) = sum_ij b_i b_j (L(x_i+a)+L(x_j+a))/(x_i+x_j)   (L = d/dz log xi(1/2+z))
#      = sum_w |V(a-w)|^2 + 2 sum_w (a-Re w) int_0^inf |sum_j b_j e^{-x_j t}/(x_j+a-w)|^2 dt
# with w = +- i gamma (zeros below the cutoff are on the line). Truncated zero sum + tail trend.
import mpmath as mp
mp.mp.dps = 25
def L(z):
    s = mp.mpf(1)/2 + z
    # xi'/xi(s) = 1/s + 1/(s-1) - log(pi)/2 + psi(s/2)/2 + zeta'/zeta(s)
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
x = [mp.mpf('0.3'), mp.mpf('0.9'), mp.mpf('2.2'), mp.mpf('5')]
b = [mp.mpf('1'), mp.mpf('-2.5'), mp.mpf('1.7'), mp.mpf('-0.4')]
a = mp.mpf(3)/8
Q = sum(b[i]*b[j]*(L(x[i]+a)+L(x[j]+a))/(x[i]+x[j]) for i in range(4) for j in range(4))
print("Q_a direct      =", mp.nstr(Q, 15))
gam = [mp.im(mp.zetazero(n)) for n in range(1, 601)]
def partial(N):
    tot = mp.mpf(0)
    for g in gam[:N]:
        for w in (mp.mpc(0, g), mp.mpc(0, -g)):
            c = [b[j]/(x[j]+a-w) for j in range(4)]
            V = sum(c)
            E = sum(c[i]*mp.conj(c[j])/(x[i]+x[j]) for i in range(4) for j in range(4))
            tot += abs(V)**2 + 2*a*mp.re(E)
    return tot
for N in (150, 300, 600):
    p = partial(N)
    print(f"zero-side SOS, {N} zeros: {mp.nstr(p, 15)}   deficit {mp.nstr(Q-p, 6)}   deficit*gamma_N/log(gamma_N) = {mp.nstr((Q-p)*gam[N-1]/mp.log(gam[N-1]), 6)}")
