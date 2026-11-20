# Second pass, independent route: forms on the Fourier side by direct quadrature (no inverse transform),
# a window of lower smoothness (sin^2, in H^1_0 and H^2_0 only), theta' defined as u/Lg, mpmath digamma.
# Also: K3-M twin check (log-derivative coefficients of HQ3, HQ4, HQ2 below q or q^2), the constant of
# the pivot (minimum of |g_0|^2 on |y| <= pi/u for the sine window), and the T-NR constant log q.
# Run: scripts/memcap.sh 8 python3.14 referee_check.py
import numpy as np, mpmath as mp, math, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
out = {}

def Gm(x):
    return complex(0.5*mp.digamma(mp.mpc(0.25, 0.5*x)) - 0.5*mp.log(mp.pi))

def lam_list(P):
    res = []
    for n in range(2, P):
        m, p = n, None
        for d in range(2, int(n**0.5)+1):
            if m % d == 0:
                p = d; break
        if p is None: res.append((n, math.log(n))); continue
        while m % p == 0: m //= p
        if m == 1: res.append((n, math.log(p)))
    return res

rows = []
for t, ratio in ((3e3, 0.6), (3e3, 0.9), (3e5, 0.6), (3e5, 0.9)):
    L = math.log(t/(2*math.pi)); u = ratio*L; P = int(math.floor(math.exp(u))); u = math.log(P)
    # window h_0 = sin^2(pi s/u); g_0 by closed form through fine quadrature on [0,u]
    N = 6000; s = (np.arange(N)+0.5)*u/N; h0 = np.sin(np.pi*s/u)**2
    Y = 400.0; K = 16001; y = np.linspace(-Y, Y, K); dy = y[1]-y[0]
    print(f"planned allocation: {N*K*16/1e6:.0f} MB complex matrix avoided; loop over y in chunks")
    g0 = np.empty(K, dtype=complex)
    for i in range(0, K, 500):
        g0[i:i+500] = (np.exp(-1j*np.outer(y[i:i+500], s))*h0).sum(axis=1)*u/N
    w = np.abs(g0)**2*dy/(2*math.pi)
    n2 = w.sum(); hp = math.sqrt((w*y*y).sum())
    lam = lam_list(P)
    a = np.zeros(K, dtype=complex)
    for n, l in lam:
        a += l/math.sqrt(n)*np.exp(-1j*(t+y)*math.log(n))
    Gy = np.array([Gm(t+yy) for yy in y[::40]]); Gy = np.interp(y, y[::40], Gy.real) + 1j*np.interp(y, y[::40], Gy.imag)
    Gt = Gm(t)
    hAh = (w*a).sum()
    D2 = (w*Gy*a).sum() - Gt*hAh                 # <h, Gamma_c A_P h> - G_t <h, A_P h>
    D1 = (w*2*Gy.real*a).sum() - L*hAh           # <h, Arch_sym A_P h>-type form (uncompressed product)
    eps = math.log(t)/t*hp
    bound = eps*sum(l/math.sqrt(n) for n, l in lam)*math.sqrt(n2)
    rows.append(dict(t=t, u_over_Lg=u/L, P=P, norm2=float(n2), hprime=hp, hAh=[hAh.real, hAh.imag],
                     D2=abs(D2), D1=abs(D1), bound_c1_eq_1=bound, G_t=[Gt.real, Gt.imag], Lg_half=L/2))
    print(rows[-1])
out["collapse"] = rows

# K3-M: log-derivative coefficients of the twins below the stage.
def logder_coeffs(a, N):   # a[1..N] with a[1]=1 ; returns Lambda_F(n), from a(n) log n = sum_{d|n} Lambda_F(d) a(n/d)
    lamF = [0.0]*(N+1)
    for n in range(2, N+1):
        sacc = a[n]*math.log(n)
        for d in range(2, n):
            if n % d == 0: sacc -= lamF[d]*a[n//d]
        lamF[n] = sacc
    return lamF
def zeta_times_local(q, loc, N):  # loc[j] = coefficient of q^(-js) of the local factor (loc[0]=1)
    a = [0.0]*(N+1)
    for n in range(1, N+1):
        j, m = 0, n
        acc = 0.0; pw = 1
        while True:
            if j < len(loc): acc += loc[j]
            if m % q: break
            m //= q; j += 1
        # coefficient: sum over j' <= v_q(n) of loc[j'] * 1
        a[n] = acc
    return a
def series_ratio(num, den, J):
    c = [0.0]*(J+1)
    for j in range(J+1):
        v = num[j] if j < len(num) else 0.0
        for i in range(1, min(j, len(den)-1)+1): v -= den[i]*c[j-i]
        c[j] = v/den[0]
    return c
N = 60; tw = {}
lamZ = logder_coeffs([0.0]+[1.0]*N, N)
for name, q, sign in (("HQ3", 7, -1), ("HQ4", 7, +1)):
    v = math.log(q); A, B = 0.2*v, 0.3*v; al, be = 2*math.cosh(A), 2*math.cosh(B); r = math.sqrt(q)
    num = [1.0, sign*al*r, r*r]; den = [1.0, -be*r, r*r]       # in the variable q^(-s): u = sqrt(q) q^(-s)
    loc = series_ratio(num, den, 6)
    lamF = logder_coeffs(zeta_times_local(q, loc, N), N)
    first = min(n for n in range(2, N+1) if abs(lamF[n]-lamZ[n]) > 1e-9)
    pred = v*(1 + 2*r*(math.cosh(B) - (1 if sign < 0 else -1)*math.cosh(A)))
    tw[name] = dict(q=q, first_differing_n=first, Lambda_F_at_q=lamF[q], predicted=pred)
q = 5; eps = 0.1; r = math.sqrt(q)
num = [0.0, 0.0, eps*r*r]; den = [1.0, -4*r, 6*r*r, -4*r**3, r**4]
loc = series_ratio(num, den, 6); loc[0] += 1.0
lamF = logder_coeffs(zeta_times_local(q, loc, N), N)
tw["HQ2"] = dict(q=q, first_differing_n=min(n for n in range(2, N+1) if abs(lamF[n]-lamZ[n]) > 1e-9))
out["twins"] = tw; print(tw)

# pivot constant: sine window, unit norm, min over |y| <= pi/u of |g_0(y)|^2 / u
u = 7.0; s = (np.arange(20000)+0.5)*u/20000; h0 = math.sqrt(2/u)*np.sin(np.pi*s/u)
ys = np.linspace(-math.pi/u, math.pi/u, 401)
vals = [abs((h0*np.exp(-1j*yy*s)).sum()*u/20000)**2/u for yy in ys]
out["pivot_min_g2_over_u"] = min(vals); print("pivot min |g0|^2/u on |y|<=pi/u:", min(vals), "at centre", vals[200])

# T-NR: m'/m(1/2+w) -> log q as Re w -> +inf
q, c = 3.0, 2.2; v = math.log(q)
f = lambda w: v*(q**w - q**(-w))/(q**w + c + q**(-w))
out["tnr_limit"] = [f(5.0), f(20.0), v]; print("T-NR m'/m at w=5,20 and log q:", out["tnr_limit"])
json.dump(out, open(os.path.join(HERE, "referee_check.json"), "w"), indent=1)
