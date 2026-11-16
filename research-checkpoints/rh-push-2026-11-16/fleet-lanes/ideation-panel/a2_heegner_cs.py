# Angle 2: Chowla-Selberg / Lagarias-Suzuki split at the Heegner point D=163 (class number 1). MEASURED (mpmath).
import mpmath as mp
mp.mp.dps = 30
D = 163; k = mp.sqrt(D)/2
def kron(n):  # chi_{-163}(n) = (n/163) Legendre (163 = 3 mod 4, so (-163/n) = (n/163))
    n %= D
    if n == 0: return 0
    return 1 if pow(n, (D-1)//2, D) == 1 else -1
chi = [kron(n) for n in range(D)]
def xs(w): return mp.pi**(-w/2)*mp.gamma(w/2)*mp.zeta(w)
def main(s): return 2*(k**s*xs(2*s) + k**(1-s)*xs(2*s-1))
def sig(n, z): return sum(mp.mpf(d)**z for d in range(1, n+1) if n % d == 0)
def rem(s, N=12):
    return 8*mp.sqrt(k)*sum(mp.mpf(n)**(s-mp.mpf(1)/2)*sig(n, 1-2*s)*(-1)**n*mp.besselk(s-mp.mpf(1)/2, 2*mp.pi*k*n) for n in range(1, N+1))
def full(s): return (k/mp.pi)**s*mp.gamma(s)*2*mp.zeta(s)*mp.dirichlet(s, chi)
print("identity check  full = main + rem  (a=1,b=1,c=41):")
for s in [mp.mpf(2), mp.mpc(0.7, 3), mp.mpc(0.5, 10), mp.mpc(0.5, 30)]:
    f = full(s); m = main(s); r = rem(s)
    print(" s =", mp.nstr(s, 6), " |full-(main+rem)|/|full| =", mp.nstr(abs(f-m-r)/abs(f), 3), "  |rem|/|main| =", mp.nstr(abs(r)/abs(m), 3))
print("ratio |rem|/|main| on the line, t = 1..60 (transition expected near t ~ 2 pi k =", mp.nstr(2*mp.pi*k, 5), ")")
for t in [1, 5, 10, 15, 20, 25, 30, 35, 38, 40, 42, 45, 50, 60]:
    s = mp.mpc(0.5, t); print("  t =", t, mp.nstr(abs(rem(s, 20))/abs(main(s)), 3))
# zeros on the line: main (Lagarias-Suzuki, all on the line) vs full
def realval(fn, t):
    return mp.re(fn(mp.mpc(0.5, t)))  # both are real on the line
def zeros(fn, T, h=0.02):
    out = []; t = mp.mpf('0.01'); a = realval(fn, t)
    while t < T:
        b = realval(fn, t+h)
        if a*b < 0: out.append(mp.findroot(lambda u: realval(fn, u), (t, t+h), solver='anderson'))
        a = b; t += h
    return out
T = 45
zm = zeros(main, T); zf = zeros(full, T)
print("zeros on the line up to", T, ": main", len(zm), " full", len(zf))
for a, b in zip(zm, zf): print("  main %s   full %s   diff %s" % (mp.nstr(a, 14), mp.nstr(b, 14), mp.nstr(a-b, 3)))
# Hermite-Biehler margin of the main term: log|k^s xs(2s)| - log|k^(1-s) xs(2s-1)| on sigma=0.6,0.75,1
print("HB margin log|E(s)/E#(s)|, E = k^s xi*(2s):")
for sg in (0.55, 0.75, 1.0):
    print("  sigma", sg, [mp.nstr(mp.log(abs(k**mp.mpc(sg,t)*xs(2*mp.mpc(sg,t)))/abs(k**(1-mp.mpc(sg,t))*xs(2*mp.mpc(sg,t)-1))), 4) for t in (2, 10, 20, 40, 80)])
