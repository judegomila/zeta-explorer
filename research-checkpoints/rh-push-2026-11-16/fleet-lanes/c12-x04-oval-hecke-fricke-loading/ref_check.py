"""Second pass, different cases from checks.py. mpmath 30 digits, < 100 MB."""
import mpmath as mp, math
mp.mp.dps = 30; pi = mp.pi
e = lambda t: mp.exp(2j*pi*t)
def th(x, num=0, den=1):
    N = int(mp.sqrt(72/(pi*x))) + 3; s = mp.mpc(1)
    for n in range(1, N+1): s += 2*e(mp.mpf(num*n*n % den)/den)*mp.exp(-pi*n*n*x)
    return s
def leg(a, p):
    a %= p
    return 0 if a == 0 else (1 if pow(a, (p-1)//2, p) == 1 else -1)
# 1. p = 11, 13 at x = 0.2: complex part = dilates ; coefficient-level check of T_{p^2}
for p in (11, 13):
    x = mp.mpf('0.2')
    pts = [th(x/p**2, b, p*p) for b in range(1, p*p)]
    G = sum(leg(b, p)*e(mp.mpf(b)/p) for b in range(p))
    mid = sum(leg(b, p)*th(x, b, p) for b in range(1, p))/G
    cx = sum(pts)/p**2 + mid/p
    pred = th(x) - th(x/p**2)/p**2 + (th(x) - th(p*p*x))/p
    print('p', p, 'complex part - dilates', mp.nstr(abs(cx - pred), 3))
# 2. zero of C_3 and T-NR form
for q in (3, 7):
    off = mp.acosh((q**mp.mpf(1.5) + mp.sqrt(q))/2)/mp.log(q)
    s = mp.mpf(0.5) + off + 2j*pi/mp.log(q)   # zeros repeat with period 2 pi i/log q
    C = 1 + mp.mpf(1)/q - q**(s-2) - q**(-1-s)
    tw = -q**mp.mpf(-1.5)*(2*mp.cosh((s-0.5)*mp.log(q)) - (q**mp.mpf(1.5) + mp.sqrt(q)))
    s2 = mp.mpc(0.3, 4.4)
    C2 = 1 + mp.mpf(1)/q - q**(s2-2) - q**(-1-s2)
    tw2 = -q**mp.mpf(-1.5)*(2*mp.cosh((s2-0.5)*mp.log(q)) - (q**mp.mpf(1.5) + mp.sqrt(q)))
    print('q', q, '|C_q(zero)|', mp.nstr(abs(C), 3), 'C - twin form at 0.3+4.4i', mp.nstr(abs(C2 - tw2), 3))
# 3. Epstein: T_7 on [1,0,5] (7 = 2+2+3 non-principal), T_11 on [1,0,6] (11 = 8+3 non-principal), T_5 on [1,0,6]->also checks.py
def ThQ(form, x, num=0, den=1):
    a, b, c = form; R = int(mp.sqrt(34/(pi*x*min(a, c - b*b/(4.0*a))))) + 4; s = mp.mpc(0)
    for m in range(-R, R+1):
        for n in range(-R, R+1):
            q = a*m*m + b*m*n + c*n*n
            s += e(mp.mpf(num*q % den)/den)*mp.exp(-pi*q*x)
    return s
for Q0, Q1, p in (((1,0,5),(2,2,3),7), ((1,0,6),(2,0,3),11), ((1,0,5),(1,0,5),41), ((2,2,3),(1,0,5),3)):
    x = mp.mpf('0.45')
    T = sum(ThQ(Q0, x/p, b, p) for b in range(p))/p + ThQ(Q0, p*x)
    print(Q0, 'T_%d' % p, '-> 2 Theta', Q1, mp.nstr(abs(T - 2*ThQ(Q1, x)), 3), '; vs 2 Theta', Q0, mp.nstr(abs(T - 2*ThQ(Q0, x)), 3))
# 4. commutator multiplier: M[(W D_2 - D_2 W) theta] / (2 Lambda) = 2^{-1/2} 2^{s/2} - 2^{-s/2} = 2^{3/4} sinh((s-1/2) log2/2)
s = mp.mpc(0.3, 4.4)
print('commutator multiplier diff', mp.nstr(abs(2**(-mp.mpf(1)/2)*2**(s/2) - 2**(-s/2) - 2**mp.mpf(0.75)*mp.sinh((s-0.5)*mp.log(2)/2)), 3))
# 5. p = 13, b = 2: real part of one complex point as zeta x local factor: coefficient check
p = 13; b = 2; s = mp.mpc(2.1, 0.7)
G = sum(e(mp.mpf(b*r*r % p)/p) for r in range(p))           # quadratic Gauss sum (b/p) sqrt(p), p = 1 mod 4
direct = mp.mpf(p)**(-s)*sum(e(mp.mpf(b*r*r % p)/p).real*mp.zeta(s, mp.mpf(r)/p) for r in range(1, p+1))
# real part = zeta-component + even characters; zeta-component:
zc = ((G.real - 1) + (p - G.real)*mp.mpf(p)**(-s))/(p - 1)*mp.zeta(s)
print('p=13 b=2: G =', mp.nstr(G, 8), ' (p-G)/(G-1) - G =', mp.nstr(abs((p-G)/(G-1) - G), 3), ' direct real-part series - zeta component =', mp.nstr(direct - zc, 6), '(nonzero: other even characters)')
