# Referee pass: independent re-checks with different parameters and a different grid (mpmath, local, memcap 8 GB).
# Largest object: 30 x 90 grid of complex numbers (< 1 MB).
import json, sys, itertools
from mpmath import mp, mpf, mpc, zeta, gamma, pi, exp, log, re, im, conj, fabs, acosh
mp.dps = 25
OUT = sys.argv[1]; res = {}
def xi(s): return pi**(-s/2)*gamma(s/2)*zeta(s)
def M(z): return xi(z)/xi(z+1)
def N(phi, z, x):
    S = phi(z)*exp(-x*z); return z*(1-S)/(1+S)
GR = [0.011 + 0.103*i for i in range(30)]
GI = [0.07 + 1.37*j for j in range(90)]      # heights to 122
def grid(phi, x):
    neg = 0; mn = mpf('inf'); at = None
    for a in GR:
        for b in GI:
            v = N(phi, mpc(a, b), x); s = im(v)/fabs(v)
            if s < -mpf(10)**(-12): neg += 1
            if s < mn: mn, at = s, (a, b)
    return {'neg': neg, 'of': len(GR)*len(GI), 'min': float(mn), 'at': at}
def bl(*zs):
    def f(z):
        v = mpc(1)
        for a in zs: v *= (z - a)/(z + conj(a))
        return v
    return f
def tnr(q, c):
    T = lambda z: mpf(q)**(z - mpf(1)/2) + mpf(q)**(mpf(1)/2 - z) + c
    return lambda z: T(z)/T(z+1)
cases = {
 'zeta x=0': (M, 0), 'zeta x=1': (M, 1), 'zeta x=-0.1': (M, -0.1),
 'BL pair a=0.9+14.5i x=0': (lambda z: M(z)*bl(mpc(0.9,14.5), mpc(0.9,-14.5))(z), 0),
 'BL two pairs (0.05+0.4i, 0.3+21.02i) x=0': (lambda z: M(z)*bl(mpc(0.05,0.4), mpc(0.05,-0.4), mpc(0.3,21.02), mpc(0.3,-21.02))(z), 0),
 'BL pair a=0.9+14.5i x=1': (lambda z: M(z)*bl(mpc(0.9,14.5), mpc(0.9,-14.5))(z), 1),
 'TNR q=3 c=2.2 x=0': (lambda z: M(z)*tnr(3, mpf('2.2'))(z), 0),
 'TNR q=2 c=-2.1 (real zero pair; outside Lemma M) x=0': (lambda z: M(z)*tnr(2, mpf('-2.1'))(z), 0),
 'BL real pair a=0.3,0.7 (outside Lemma M) x=0': (lambda z: M(z)*bl(mpf('0.3'), mpf('0.7'))(z), 0),
 'BL single real a=0.5 (outside Lemma M) x=0': (lambda z: M(z)*bl(mpf('0.5'))(z), 0),
 'minus sign: -M x=0': (lambda z: -M(z), 0),
 'E_a a=0.05 x=0': (lambda z: M(z+mpf('0.05'))*M(z-mpf('0.05')), 0),
}
for k, (phi, x) in cases.items():
    res[k] = grid(phi, x); print(k, res[k], flush=True)
res['TNR q=3 c=2.2 b'] = float(acosh(mpf('1.1'))/log(3))
# Whittaker arguments: for nu in the open chamber and u with l(s_i u) > l(u): Re <u nu, alpha_i^vee> > 0
def act(word, z, c):
    for g in reversed(word): z = -z if g == 1 else 2*c - z
    return z
z, c = mpc('0.3', '3'), mpc('0.45', '1'); worst = mpf('inf'); cnt = 0
for n in range(0, 9):
    for first in (0, 1):
        u = [(first + j) % 2 for j in range(n)]          # reduced word of length n (leftmost letter = first)
        zz = act(u, z, c)
        for i in (0, 1):
            if n > 0 and u[0] == i: continue             # s_i u shorter
            arg = zz if i == 1 else c - zz
            worst = min(worst, re(arg)); cnt += 1
res['whittaker_min_Re_arg_over_%d_terms' % cnt] = float(worst)
# zeros of the truncation-boundary function T^{z/2} xi(z+1) + T^{-z/2} xi(z) for T = 1 near the axis: sample of sign changes on Re z = 0
def F(t): 
    z = mpc(0, t); return xi(z+1) + xi(z)
sc = 0; prev = None
for j in range(1, 800):
    v = F(mpf(j)*mpf('0.05')); r = re(v) if fabs(re(v)) > fabs(im(v)) else im(v)
    # F(it) = xi(1+it) + conj(xi(1+it)) is real
    if prev is not None and r*prev < 0: sc += 1
    prev = r
res['axis_sign_changes_T=1_t<40'] = sc
res['axis_F_imag_part_max'] = float(max(fabs(im(F(mpf(t)))) for t in (3.3, 17.1, 33.9)))
json.dump(res, open(OUT, 'w'), indent=1, default=str)
for k in list(res)[-4:]: print(k, res[k])
