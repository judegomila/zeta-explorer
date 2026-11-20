# Second-method checks (mpmath, 30 digits). Planned memory: < 100 MB (one list of 2e5 ints).
import mpmath as mp
mp.mp.dps = 30
def xi(s): return mp.mpf(1)/2*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
# (a) closed form of sum lam(n)(-1)^v6(n) n^-s = zeta(2s)/zeta(s) * (1-6^-s)/(1+6^-s), by Euler-free direct sum at s = 3
N = 200000
spf = list(range(N+1))
for i in range(2, int(N**0.5)+1):
    if spf[i] == i:
        for j in range(i*i, N+1, i):
            if spf[j] == j: spf[j] = i
lam = [0, 1] + [0]*(N-1)
for n in range(2, N+1): lam[n] = -lam[n//spf[n]]
def v6(n):
    k = 0
    while n % 6 == 0: n //= 6; k += 1
    return k
s = mp.mpf(3)
direct = mp.fsum(lam[n]*(-1)**v6(n)*mp.mpf(n)**(-s) for n in range(1, N+1))
closed = mp.zeta(2*s)/mp.zeta(s)*(1-6**(-s))/(1+6**(-s))
print("(a) direct - closed at s=3 (tail bound N^-2/2 = %.1e): %s" % (float(mp.mpf(N)**-2/2), mp.nstr(direct-closed, 5)))
# (b) monotonicity of |xi(2s)/xi(s)| in sigma on (1/4, 1/2) at several heights: derivative of log modulus by the formula
#     Re( 2 xi'/xi(2s) - xi'/xi(s) ), evaluated by numerical differentiation
def dlog(sig, t):
    f = lambda x: mp.log(abs(xi(2*mp.mpc(x, t))/xi(mp.mpc(x, t))))
    return mp.diff(f, sig)
worst = None
for t in [0.5, 3, 7.0673, 14.2, 21.1, 30.5, 50.2, 101.3]:
    for sig in [0.26, 0.30, 0.35, 0.40, 0.45, 0.49]:
        d = dlog(mp.mpf(sig), mp.mpf(t))
        if worst is None or d < worst[0]: worst = (d, sig, t)
print("(b) min over 48 points of d/dsigma log|xi(2s)/xi(s)| on 0.26..0.49: %s at sigma=%s t=%s" % (mp.nstr(worst[0], 8), worst[1], worst[2]))
# outside the strip the sign is lost: sample sigma = 0.2 (left of the zeros rho/2) and 0.6 (right of the poles rho)
for sig, t in [(0.2, 7.0673), (0.6, 14.1347)]:
    print("    sigma=%s t=%s: %s" % (sig, t, mp.nstr(dlog(mp.mpf(sig), mp.mpf(t)), 8)))
# (c) toy for Lemma B: K(z) = 1/(z-p), Re p > 0. Boundary function on Re z = 0 is bounded by 1/Re p; its
#     positive-frequency part is 0: (1/2pi) int K(it) e^{itu} dt = -e^{pu} 1_{u<0}. Check at u = +1 and u = -1.
p = mp.mpc(0.3, 2.0)
for u in (1, -1):
    val = mp.quadosc(lambda t: (1/(1j*t-p)*mp.exp(1j*t*u)).real, [0, mp.inf], omega=abs(u))*2/(2*mp.pi)  # even/odd symmetry not used: do both halves
    full = (mp.quad(lambda t: 1/(1j*t-p)*mp.exp(1j*t*u), mp.linspace(-400, 400, 801)))/(2*mp.pi)
    print("(c) u=%+d  truncated inverse transform (|t|<=400): %s   predicted: %s" % (u, mp.nstr(full, 6), mp.nstr(-mp.exp(p*u) if u < 0 else mp.mpf(0), 6)))
