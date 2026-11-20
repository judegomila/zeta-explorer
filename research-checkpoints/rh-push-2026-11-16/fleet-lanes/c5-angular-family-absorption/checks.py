# c5-angular-family-absorption: local checks (numpy + mpmath, < 1 GB planned).
import numpy as np, math, json, sys
from math import gcd
out = {}
# ---------- N1: root number of L(s, lambda^{6k}) via theta inversion ----------
import mpmath as mp
mp.mp.dps = 40
def theta(k, t, R=40):
    s = mp.mpf(0)
    w = mp.mpc(-0.5, mp.sqrt(3)/2)
    for a in range(-R, R+1):
        for b in range(-R, R+1):
            n = a*a - a*b + b*b
            if n == 0 or n > 900: continue
            al = a + b*w
            s += (al**(6*k)).real * mp.e**(-2*mp.pi*n*t/mp.sqrt(3))
    return s
n1 = []
for k in (1, 2, 3, 4):
    t = mp.mpf('0.8')
    lhs = theta(k, 1/t); rhs = t**(6*k+1) * theta(k, t)
    n1.append((k, mp.nstr(lhs, 20), mp.nstr(rhs, 20), mp.nstr(lhs/rhs - 1, 5)))
    print('N1 k=%d Theta(1/t)=%s t^(6k+1)Theta(t)=%s rel.diff=%s' % n1[-1]); sys.stdout.flush()
out['N1_root_number_plus_one'] = n1
# ---------- element table ----------
def elements(Nmax):
    R = int(math.isqrt(int(4*Nmax/3))) + 2
    a = np.arange(-R, R+1)
    A, B = np.meshgrid(a, a, indexing='ij')
    N = A*A - A*B + B*B
    m = (N > 0) & (N <= Nmax)
    return A[m], B[m], N[m]
def mu_F(a, b, n):
    g = gcd(a, b); cnt = 0; m = n; p = 2
    while p*p <= m:
        if m % p == 0:
            e = 0
            while m % p == 0: m //= p; e += 1
            r = _loc(p, e, g)
            if r < 0: return 0
            cnt += r
        p += 1
    if m > 1:
        r = _loc(m, 1, g)
        if r < 0: return 0
        cnt += r
    return -1 if cnt % 2 else 1
def _loc(p, e, g):
    j = 0
    while g % p == 0: g //= p; j += 1
    if p == 3: return 1 if e == 1 else -1
    if p % 3 == 2: return 1 if j == 1 and e == 2 else -1
    if e == 1 and j == 0: return 1
    if e == 2 and j == 1: return 2
    return -1
def bump(x):  # smooth bump on (1,2)
    y = np.zeros_like(x, dtype=float); m = (x > 1) & (x < 2)
    u = x[m]; y[m] = np.exp(-1.0/((u-1)*(2-u)) + 4.0); return y
Y = 20000; Z = 5000
a, b, n = elements(2*Y); m = n > Y
aY, bY, nY = a[m], b[m], n[m]
argY = np.angle(aY + bY*(-0.5 + 1j*math.sqrt(3)/2)); wY = bump(nY/Y)/6.0
a, b, n = elements(2*Z); m = n > Z
aZ, bZ, nZ = a[m], b[m], n[m]
argZ = np.angle(aZ + bZ*(-0.5 + 1j*math.sqrt(3)/2))
muZ = np.array([mu_F(int(x), int(y), int(z)) for x, y, z in zip(aZ, bZ, nZ)], dtype=float)
wZ = bump(nZ/Z)/6.0
print('elements: Y-shell %d, Z-shell %d; planned largest array %d x %d complex = %.0f MB' % (len(nY), len(nZ), 500, len(nY), 500*len(nY)*16/1e6))
Kmax = 1500
ks = np.arange(0, Kmax+1)
Ak = np.empty(Kmax+1, dtype=complex); Bk = np.empty(Kmax+1, dtype=complex)
for i in range(0, Kmax+1, 500):
    kk = ks[i:i+500][:, None]
    Ak[i:i+500] = (np.exp(6j*kk*argY[None, :]) * wY[None, :]).sum(1) / Y
    Bk[i:i+500] = (np.exp(6j*kk*argZ[None, :]) * (wZ*muZ)[None, :]).sum(1) / math.sqrt(Z)
# ---------- N2: |A_k| against k / sqrt(Y) ----------
n2 = []
for k in (0, 1, 5, 10, 20, 30, 40, 60, 80, 120, 200, 400, 800, 1500):
    n2.append((k, k/math.sqrt(Y), abs(Ak[k]), abs(Ak[k])*math.sqrt(Y)))
    print('N2 k=%5d k/sqrtY=%7.3f |A_k|=%.3e |A_k|sqrtY=%.3e' % n2[-1])
out['N2_Ak'] = n2; out['Y'] = Y; out['Z'] = Z
# ---------- N3: probe = k=0 row for K below the transition ----------
n3 = []
for K in (5, 10, 20, 40, 80, 160, 400, 1500):
    om = np.clip(1 - ks/K, 0, None)          # Fejer weight, even in k; A_{-k}B_{-k} = conj(A_k B_k)
    tot = om[0]*Ak[0]*Bk[0] + 2*np.sum((om[1:]*Ak[1:]*Bk[1:]).real)
    k0 = Ak[0]*Bk[0]
    n3.append((K, float(tot.real), float(k0.real), float(abs(tot-k0))))
    print('N3 K=%5d  sum_k Om A_k B_k = %+.6e   k=0 term = %+.6e   |diff| = %.2e' % n3[-1])
out['N3_probe_vs_k0'] = n3
# ---------- N4: mean square of Moebius rows (angular large sieve) ----------
n4 = []
for K in (50, 200, 800, 1500):
    msq = (abs(Bk[0])**2 + 2*np.sum(abs(Bk[1:K+1])**2)) / (2*K+1)
    n4.append((K, float(msq), float(abs(Bk[0])**2)))
    print('N4 K=%5d mean_k |B_k|^2 = %.4f   |B_0|^2 = %.4f  (B_0 = Z^-1/2 * smoothed Moebius sum over Z[omega])' % n4[-1])
out['N4_meansq'] = n4
# ---------- N5: minimal nonzero angle; ray count ----------
a, b, n = elements(4000)
th = np.abs(np.angle(np.exp(6j*np.angle(a + b*(-0.5 + 1j*math.sqrt(3)/2)))))
on = th < 1e-9
ratio = (th[~on]*np.sqrt(n[~on])).min()
rays = int(on.sum()); print('N5 min over off-ray elements of |6 arg| sqrt(N) = %.4f (>= 6*sqrt(3)/2*... lower bound 3*sqrt3=5.196 asymptotically); on-ray elements with N<=4000: %d = 6*floor(sqrt(4000))=%d' % (ratio, rays, 6*int(math.isqrt(4000))))
out['N5'] = (float(ratio), rays)
# ---------- N6: ring-class characters, conductor f: kernel = Z + f O; Parseval ----------
n6 = []
a, b, n = elements(4000)
for f in (5, 7, 11, 13, 31, 61, 101):
    cop = np.gcd(n, f) == 1
    ker = cop & (b % f == 0)          # alpha = a + b*omega in Z + f*O, prime to f
    n6.append((f, int(cop.sum()//6), int(ker.sum()//6) if ker.sum() % 6 == 0 else float(ker.sum()/6), 4000/f*2*math.pi/math.sqrt(3)/6, math.sqrt(4000)/3))
    print('N6 f=%4d ideals prime to f (N<=4000): %d; with a generator in Z+fO (all 6 unit multiples counted /6): %s ; lattice prediction ~%.1f ; rational-only floor ~%.1f' % n6[-1])
out['N6'] = n6
json.dump(out, open('checks.json', 'w'), indent=1, default=str)
