# res-point-spectrum-square: numerical checks. Single process, mpmath only, small memory
# (largest allocation: lists of < 2e5 Python floats, < 20 MB). Run: scripts/memcap.sh 8 python3 checks.py
import mpmath as mp, math, json, time, os, sys
t00 = time.time()
OUT = {}
HERE = os.path.dirname(os.path.abspath(__file__))
mp.mp.dps = 20
print("planned allocation: float lists of length <= 1.2e5 (< 20 MB)")

def xi(s):       # completed zeta, entire, xi(s)=xi(1-s)
    return mp.mpf(1)/2*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def xistar(s):   # pi^{-s/2} Gamma(s/2) zeta(s)
    return mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def Xi(t): return mp.re(xi(mp.mpc(0.5, t)))

# ---------------- A. Weyl-law table ----------------
def Nz_smooth(T): return T/(2*math.pi)*math.log(T/(2*math.pi*math.e)) + 7/8
def sign_changes(fun, T, h):
    n = 0; t = h/2; prev = fun(t); roots = []
    while t < T:
        t2 = t + h; cur = fun(t2)
        if (prev > 0) != (cur > 0):
            n += 1; roots.append((t, t2))
        t, prev = t2, cur
    return n, roots
polya = lambda t: mp.re(mp.besselk(mp.mpc(0, t/2), 2*mp.pi)*mp.exp(mp.pi*t/4))
def Za_line(a):
    return lambda t: mp.re(mp.mpf(a)**mp.mpc(0.5, t)*xistar(mp.mpc(1, 2*t))*mp.exp(mp.pi*t/2))
rows = []
cnt_polya, _ = sign_changes(polya, 100, 0.05)
tabT = [25, 50, 100]
def count_upto(fun, Ts, h):
    res = {}; n = 0; t = h/2; prev = fun(t); Ts = sorted(Ts); i = 0
    while i < len(Ts):
        t2 = t + h; cur = fun(t2)
        if t2 > Ts[i]:
            res[Ts[i]] = n; i += 1
            continue
        if (prev > 0) != (cur > 0): n += 1
        t, prev = t2, cur
    return res
cp = count_upto(polya, tabT, 0.05)
c1 = count_upto(Za_line(1), [T/2 for T in tabT], 0.02)
c2 = count_upto(Za_line(2), [T/2 for T in tabT], 0.02)
for T in tabT:
    row = dict(T=T, N_zeta=int(mp.nzeros(T)), N_zeta_smooth=round(Nz_smooth(T), 2),
               polya_K_it2_2pi=cp[T],
               pseudoLap_a1_upto_T_over_2=c1[T/2], pseudoLap_a2_upto_T_over_2=c2[T/2],
               maass_SL2Z_weyl_main=round(T*T/12 - 2*T/math.pi*math.log(T) , 1),
               maass_wt_half_Gamma0_4_main=round(T*T/2, 1),
               compact_237_main=round(T*T/84, 2),
               casimir_lambda_le_T_SL2Z=round(T/12, 2))
    rows.append(row); print(row)
OUT["A_weyl_table"] = rows
print("A done", round(time.time()-t00, 1), "s")

# ---------------- B. pseudo-Laplacian realisation: Weil form of Z_a = sum of squares over its zeros ----------------
def Zent(a):   # entire, even about s=1/2
    return lambda s: s*(s-1)*(mp.mpf(a)**s*xistar(2*s) + mp.mpf(a)**(1-s)*xistar(2*s-1))
resB = {}
for a in (1, 2):
    F = lambda w, a=a: Zent(a)(mp.mpf(1)/2 + w)
    Lf = lambda x: mp.diff(F, x)/F(x)
    bs = [3, -5]; xs = [1, 2]
    pick = sum(bs[j]*bs[k]*(Lf(xs[j]) + Lf(xs[k]))/(xs[j]+xs[k]) for j in range(2) for k in range(2))
    Tmax = 80
    g = Za_line(a)
    n, br = sign_changes(g, Tmax, 0.02)
    zs = [mp.findroot(g, (lo+hi)/2) for lo, hi in br]
    # argument-principle count of all zeros of the entire function in |Re s - 1/2| < 2, 0 < Im s < Tmax
    Z = Zent(a)
    def dlog(s): return mp.diff(Z, s)/Z(s)
    Tm = mp.mpf(Tmax)
    cont = [mp.mpc(-1.5, 0), mp.mpc(2.5, 0), mp.mpc(2.5, Tm), mp.mpc(-1.5, Tm), mp.mpc(-1.5, 0)]
    # zeros in full box |Im| < Tmax (symmetric), halve after removing real zeros (none expected for a<=2)
    tot = 0
    for p, q in zip([mp.mpc(2.5, -Tm), mp.mpc(2.5, Tm), mp.mpc(-1.5, Tm), mp.mpc(-1.5, -Tm)],
                    [mp.mpc(2.5, Tm), mp.mpc(-1.5, Tm), mp.mpc(-1.5, -Tm), mp.mpc(2.5, -Tm)]):
        npts = max(8, int(abs(q-p)/2))
        pts = [p + (q-p)*k/npts for k in range(npts+1)]
        tot += mp.quad(lambda u: dlog(u), pts)
    nbox = mp.re(tot/(2j*mp.pi))
    V2 = lambda t: abs(sum(b/(mp.mpc(x, t)) for b, x in zip(bs, xs)))**2
    zsum = 2*sum(V2(z) for z in zs)
    tail = 2*4*(math.log(a*Tmax/math.pi) + 1)/(math.pi*Tmax)   # 2 * (sum b)^2 * int_T^inf (1/pi) log(a t/pi) dt / t^2
    resB[a] = dict(pick=float(mp.re(pick)), zeros_on_line_below_T=n, T=Tmax,
                   all_zeros_in_box_abs_Im_lt_T=float(nbox), zero_sum=float(zsum), tail_est=tail,
                   zero_sum_plus_tail=float(zsum)+tail, first_zeros=[float(z) for z in zs[:5]])
    print("B a=%d" % a, resB[a])
OUT["B_pseudo_laplacian"] = resB
print("B done", round(time.time()-t00, 1), "s")

# ---------------- C. rank-one (period-constraint) family on the Tate model ----------------
gam = [mp.im(mp.zetazero(n)) for n in range(1, 9)]
def pv_even(rho, E, T, pieces):
    # symmetric PV of int rho(t)/(t-E) dt for even rho = int_0^T rho(t) 2E/(t^2-E^2) dt ; rho(E)=0 so integrand is regular
    f = lambda t: rho(t)*2*E/(t*t - E*E)
    return mp.quad(f, pieces)
def G_even(rho, E, T, pieces):
    f = lambda t: rho(t)*(1/(t-E)**2 + 1/(t+E)**2)
    return mp.quad(f, pieces)
rhoT = lambda t: Xi(t)**2
m0 = 2*mp.quad(rhoT, [0, 5, 10, 20, 40, 80])
resC = []
for n, g in enumerate(gam, 1):
    pieces = sorted(set([0, 5, 10, 20, 30, 40, 60, 90] + [float(g)]))
    Fv = pv_even(rhoT, g, 90, pieces)
    Gv = G_even(rhoT, g, 90, pieces)
    resC.append(dict(n=n, gamma=float(g), F=float(Fv), minus_m0_over_gamma=float(-m0/g), alpha=float(-1/Fv), G=float(Gv)))
    print("C Tate/Gaussian weight", resC[-1])
OUT["C_rank_one_tate"] = dict(m0=float(m0), rows=resC)
print("C done", round(time.time()-t00, 1), "s")

# ---------------- C2. de Branges / bridge weight rho_B = (1/pi) Xi^2/(Xi^2+Xi'^2): PV must vanish at every zero ----------------
mp.mp.dps = 15
def M(t):   # Xi'/Xi (t) = Re( i xi'/xi(1/2+it) )
    s = mp.mpc(0.5, t)
    L = 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
    return mp.re(1j*L)
T2 = 400.0; h = 0.004; N2 = int(T2/h)
print("planned: %d evaluations of zeta'/zeta, one float list of that length" % N2)
tt = [(k+0.5)*h for k in range(N2)]
rb = []
for t in tt:
    try:
        m = float(M(t)); rb.append(1/(math.pi*(1+m*m)))
    except ZeroDivisionError:
        rb.append(0.0)
mean_tail = sum(rb[int(300/h):])/len(rb[int(300/h):])
resC2 = []
for n, g in enumerate(gam[:5], 1):
    g = float(g)
    I = sum(r*2*g/(t*t-g*g) for r, t in zip(rb, tt))*h
    tail = mean_tail*math.log((T2+g)/(T2-g))    # int_T^inf 2g/(t^2-g^2) dt = log((T+g)/(T-g))
    scale = sum(r*2*g/abs(t*t-g*g) for r, t in zip(rb, tt))*h
    resC2.append(dict(n=n, gamma=g, PV_to_T=I, tail_est=tail, PV_total=I+tail, abs_integral=scale))
    print("C2 de Branges weight", resC2[-1])
OUT["C2_rank_one_debranges"] = dict(T=T2, h=h, mean_density_300_400=mean_tail, rows=resC2)
print("C2 done", round(time.time()-t00, 1), "s")

# ---------------- D. DH control for the rank-one family ----------------
mp.mp.dps = 20
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
aa = [0, 1, kap, -kap, -1]
def fDH(s): return mp.mpf(5)**(-s)*sum(aa[r]*mp.zeta(s, mp.mpf(r)/5) for r in range(1, 5))
def xiDH(s): return (mp.mpf(5)/mp.pi)**(s/2)*mp.gamma((s+1)/2)*fDH(s)
XiDH = lambda t: mp.re(xiDH(mp.mpc(0.5, t)))
rhoD = lambda t: XiDH(t)**2
gD = lambda t: XiDH(t)*mp.exp(mp.pi*t/4)
nD, brD = sign_changes(gD, 30, 0.05)
zD = [mp.findroot(XiDH, (lo+hi)/2) for lo, hi in brD][:6]
m0D = 2*mp.quad(rhoD, [0, 5, 10, 20, 40, 80])
resD = []
for n, g in enumerate(zD, 1):
    pieces = sorted(set([0, 5, 10, 20, 30, 40, 60, 90] + [float(g)]))
    Fv = pv_even(rhoD, g, 90, pieces)
    resD.append(dict(n=n, gamma=float(g), F=float(Fv), alpha=float(-1/Fv)))
    print("D DH on-line zero", resD[-1])
t_off = mp.mpf("85.6993484854")
ratio = abs(xiDH(mp.mpc(0.5, t_off)))/abs(xiDH(mp.mpc(0.5, t_off-0.4)))
OUT["D_DH"] = dict(m0=float(m0D), rows=resD,
                   density_at_offline_height_relative=float(ratio**2),
                   note="spectral density |xi_DH(1/2+it)|^2 at t=85.699348 relative to its value at t-0.4; nonzero => no member of the family has an eigenvalue there")
print("D density ratio at off-line height:", float(ratio**2))
OUT["elapsed_s"] = round(time.time()-t00, 1)
json.dump(OUT, open(os.path.join(HERE, "checks.json"), "w"), indent=1)
print("elapsed", OUT["elapsed_s"])
