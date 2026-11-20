"""validate.py -- checks of the s4 engine against brute force and recorded values."""
import math, json, sys
import numpy as np
import s4lib as S

res = {}
rng = np.random.default_rng(1)

# ---- V1: Legendre DFS against brute force -------------------------------------------------------------
def brute(N, pr):
    n = np.arange(N + 1); rough = np.ones(N + 1, dtype=bool); rough[0] = False
    for p in pr: rough[::p] = False; 
    rough[0] = False
    return n, rough
ok = True
for N, pr in [(10 ** 6, S.P97), (10 ** 6 + 7, S.P997), (123457, S.P97)]:
    n, rough = brute(N, pr); out = S.legendre(N, pr)
    b = [int(rough.sum())] + [int((rough & (n % 5 == r)).sum()) for r in range(1, 5)]
    l = np.array([S.leg101(int(a)) for a in range(101)]); b.append(int(l[n[rough] % 101].sum()))
    ok &= (list(out[:6]) == b)
res["V1_legendre_exact"] = bool(ok)
# smooth-part twists
N = 200000; pr = S.P97; eps = np.array([S.sgn(p) for p in pr], dtype=np.int8); th = np.array([S.uni(p) for p in pr])
val = np.ones(N + 1); valc = np.ones(N + 1, dtype=complex)
for j, p in enumerate(pr):
    q = int(p)
    while q <= N:
        val[::q] *= eps[j]; valc[::q] *= np.exp(2j * np.pi * th[j]); q *= int(p)
bs = int(round(val[1:].sum())); bu = valc[1:].sum()
cs = int(S.smooth_sign(N, pr, eps)[0]); cu = S.smooth_uni(N, pr, th)[0]
res["V1_smooth_sign_exact"] = (bs == cs); res["V1_smooth_uni_err"] = abs(bu - cu)
# five-shell identity and order independence (exact integers)
N = 300000; c = rng.integers(-5, 6, N + 1).astype(np.int64); c[0] = 0; n = np.arange(N + 1)
def shells(order, cuts=S.CUTS97):
    Y = c.copy(); Z = []
    for g in range(4):
        blk = order[cuts[g]:cuts[g + 1]]; keep = np.ones(N + 1, dtype=bool)
        for p in blk: keep[::p] = False
        Yn = np.where(keep, Y, 0); Z.append(Y - Yn); Y = Yn
    return Y, Z
dec = S.P97[::-1]; Y4, Z = shells(dec)
A = 3  # integer A: identity E = L(R c - A c) = (1-A) L(Y4) - A sum L(Z_g)
_, rough = brute(N, S.P97); lhs = int((np.where(rough, c, 0) - A * c).sum()); rhs = (1 - A) * int(Y4.sum()) - A * sum(int(z.sum()) for z in Z)
perm_ok = True
for t in range(3):
    o = rng.permutation(S.P97); Yp, Zp = shells(o); perm_ok &= bool((Yp == Y4).all())
orth = max(abs(int((Z[i] * Z[j]).sum())) for i in range(4) for j in range(i)); orth = max(orth, max(abs(int((z * Y4).sum())) for z in Z))
res["V1_five_shell_identity_exact"] = (lhs == rhs); res["V1_order_independent"] = bool(perm_ok); res["V1_shell_cross_terms"] = orth

# ---- V2: factor sieve against brute force ---------------------------------------------------------------
N = 300000
oi, od, so = S.factor_chunk(1, N + 1, seg=1 << 16, want_sign=True)
sg = np.ones(N + 1); ph = np.zeros(N + 1); sig = np.ones(N + 1)
for p in S.primes_upto(N):
    p = int(p); e = S.sgn(p); t = S.uni(p); q = p; k = 1
    while q <= N:
        sg[q::q] *= e; ph[q::q] += t; q *= p
    # sigma_{2a}: multiply by (1 + p^{2a} + ...) exactly per exponent
    q = p; v = np.zeros(N + 1, dtype=int)
    while q <= N:
        v[q::q] += 1; q *= p
    g = np.cumsum(float(p) ** (2 * S.EA_A * np.arange(0, v.max() + 1))); sig *= g[v]
n = np.arange(N + 1); _, r97 = brute(N, S.P97); _, r997 = brute(N, S.P997)
ea = np.zeros(N + 1); ea[1:] = sig[1:] * n[1:] ** (-S.EA_A); u = np.exp(2j * np.pi * ph)
tot = oi.sum(0); dt = od.sum(0)
res["V2_counts"] = [int(tot[0]) == int(r97.sum()), int(tot[1]) == int(r997.sum()), int(tot[2]) == int(round(sg[1:].sum())),
                    int(tot[3]) == int(round(sg[r97].sum())), int(tot[4]) == int(round(sg[r997].sum())), bool((so == sg[1:]).all())]
res["V2_uni_err"] = [abs(dt[0] + 1j * dt[1] - u[1:].sum()), abs(dt[2] + 1j * dt[3] - u[r97].sum()), abs(dt[4] + 1j * dt[5] - u[r997].sum())]
res["V2_ea_relerr"] = [abs(dt[6] / ea[1:].sum() - 1), abs(dt[7] / ea[r97].sum() - 1), abs(dt[8] / ea[r997].sum() - 1)]

# ---- V3: packet chunk summaries against the O(n^2) Gram ---------------------------------------------------
geom = [0, 1, 0, 1, 2]; mu = np.array([0.23208, 0.23208, 0.4, 2.5, 0.23208])
lo, mid, hi = 2, 1024, 4096
xs = [0.05, 0.166]; Ts = [14.134725, 1000.0]
ch = S.prime_chunk(lo, hi, geom, mu, xs, Ts)
pr = [int(p) for p in S.primes(lo, hi)]
pk = sorted([(p, 0) for p in pr] + [(3 ** k, k) for k in range(2, 20) if lo <= 3 ** k < hi])
def brute_gram(pk, lo, hi, g, m, o):
    us = []; am = []
    for n, k in pk:
        u = math.log(n) if g == 1 else float(n)
        if g == 2 and n > 3 and k == 0: u += 0.9 * (S.uni(n, S.SEED + 999) - 0.5)
        if k == 0: a = math.log(n) * S.eps_obj(o, n)
        else: a = math.log(3) * (1 - S.tnr_sk(k)) if o == 6 else 0.0
        us.append(u); am.append(a)
    us = np.array(us); am = np.array(am, dtype=complex)
    ulo = math.log(lo) if g == 1 else float(lo); uhi = math.log(hi) if g == 1 else float(hi)
    d = np.abs(us[:, None] - us[None, :]); K = (1 / m + d) * np.exp(-m * d)
    Q = (am[:, None] * np.conj(am[None, :]) * K).sum().real
    al = uhi - us; be = us - ulo
    return Q, (am * np.exp(-m * al)).sum(), (am * al * np.exp(-m * al)).sum(), (am * np.exp(-m * be)).sum(), (am * be * np.exp(-m * be)).sum()
err = 0
for gi, g in enumerate(geom):
    for o in range(7):
        b = brute_gram(pk, lo, hi, g, mu[gi], o); G = ch["G"]
        got = (G["Q"][gi, o], G["cup"][gi, o], G["c1up"][gi, o], G["cdn"][gi, o], G["c1dn"][gi, o])
        for x, y in zip(got, b): err = max(err, abs(x - y) / (abs(y) + 1e-300) if abs(y) > 1e-200 else abs(x - y))
res["V3_chunk_vs_brute_relerr"] = err
# stitching
cA = S.prime_chunk(lo, mid, geom, mu, xs, Ts); cB = S.prime_chunk(mid, hi, geom, mu, xs, Ts)
LA = np.array([S.upos(g if g != 2 else 0, mid) - S.upos(g if g != 2 else 0, lo) for g in geom]); LB = np.array([S.upos(g if g != 2 else 0, hi) - S.upos(g if g != 2 else 0, mid) for g in geom])
st = S.stitch(cA["G"], cB["G"], LA, LB, mu)
res["V3_stitch_relerr"] = max(float(np.max(np.abs(st[k] - ch["G"][k]) / (np.abs(ch["G"][k]) + 1e-300))) for k in st)
# inner product across a gap against brute force
c1 = S.prime_chunk(64, 128, geom, mu); c2 = S.prime_chunk(256, 512, geom, mu)
Dg = np.array([S.upos(g if g != 2 else 0, 256) - S.upos(g if g != 2 else 0, 128) for g in geom]); ip_ = S.inner(c1["G"], c2["G"], Dg, mu)
p1 = [int(p) for p in S.primes(64, 128)]; p2 = [int(p) for p in S.primes(256, 512)]; e2 = 0
for gi, g in enumerate(geom[:4]):
    for o in range(7):
        q1 = p1 + ([81] if o == 6 else []); q2 = p2
        u1 = np.array([S.upos(g, p) for p in q1]); u2 = np.array([S.upos(g, p) for p in q2])
        a1 = np.array([math.log(p) * S.eps_obj(o, p) for p in p1] + ([math.log(3) * (1 - S.tnr_sk(4))] if o == 6 else []), dtype=complex); a2 = np.array([math.log(p) * S.eps_obj(o, p) for p in p2], dtype=complex)
        d = u2[None, :] - u1[:, None]; b = (a1[:, None] * np.conj(a2[None, :]) * (1 / mu[gi] + d) * np.exp(-mu[gi] * d)).sum()
        e2 = max(e2, abs(b - ip_[gi, o]) / abs(b)); print('inner', g, o, b, ip_[gi, o]) if abs(b - ip_[gi, o]) / abs(b) > 1e-9 else None
res["V3_inner_relerr"] = e2
# OU tail energy V against the double sum with kernel (1)
def V_from(chunks, nx, nT):
    out = np.zeros((nx, nT, 7)); R = np.zeros((nx, nT, 7), dtype=complex)
    for c_ in reversed(chunks):
        Ct = c_["V"][..., 0] + 1j * c_["V"][..., 1]; A1 = c_["V"][..., 2] + 1j * c_["V"][..., 3]; A2 = c_["V"][..., 4]
        tot = Ct + R; out += (np.abs(tot) ** 2) * c_["A0"][:, None, None] - 2 * (np.conj(tot) * A1).real + A2; R = tot
    return out, R
V1c, R1 = V_from([ch], 2, 2); V2c, R2 = V_from([cA, cB], 2, 2)
errV = 0
for ix, x in enumerate(xs):
    for it, T in enumerate(Ts):
        for o in range(7):
            lam = []; a = []
            for n, k in pk:
                L = math.log(n)
                if k == 0: a.append((1 - n ** -0.125) * n ** -0.834 * S.eps_obj(o, n))
                else: a.append((1 - n ** -0.125) * (-S.tnr_sk(k) / k) * n ** -0.834 if o == 6 else 0.0)
                lam.append(L)
            lam = np.array(lam); a = np.array(a, dtype=complex)
            d = lam[:, None] - lam[None, :]; s = lam[:, None] + lam[None, :]
            Kc = 0.5 * np.exp(-1j * T * d) * (np.exp(-x * np.abs(d)) - np.exp(-x * s))
            Vb = (a[:, None] * np.conj(a[None, :]) * Kc).sum().real
            # chunk starts at v = lo = 2: add the piece v in [1,2] where the tail is the full sum
            add = (2 ** (2 * x) - 1) / 2 * abs(R1[ix, it, o]) ** 2
            for Vc in (V1c, V2c):
                errV = max(errV, abs(Vc[ix, it, o] + add - Vb) / abs(Vb))
res["V3_OU_tail_energy_relerr"] = errV

# ---- V4: Airy window against a direct numpy sum -----------------------------------------------------------
from scipy.special import airy
tab = S.airy_table(); c = 5.0e7 + 0.37; H = 3000.0; cuts = [S.A1, S.A2, 7.0, 12.0]
W, M, npk, lo_, hi_ = S.airy_window(c, H, cuts, tab, 97, 96)
pr = S.primes(lo_, hi_).astype(np.float64); x = (pr - c) / H; sel = (x >= tab[0]) & (x < 9.0 - 1e-9); pr = pr[sel]; x = x[sel]
w = np.log(pr) * airy(x)[0]; eW = 0
for o in range(6):
    e = np.array([S.eps_obj(o, int(p)) for p in pr], dtype=complex)
    for m, cu in enumerate(cuts):
        s_ = x >= -cu
        b0 = (w * e)[s_].sum(); b1 = (w * e * np.exp(2j * np.pi * 96 * (pr % 97) / 97))[s_].sum()
        eW = max(eW, abs(W[o, m, 0] - b0) / M[0, m, 0], abs(W[o, m, 1] - b1) / M[0, m, 0])
res["V4_airy_window_err_over_M1"] = eW

# ---- V5: theta_C of imp-95397 ---------------------------------------------------------------------------
def gram(a, p, b, q):
    D = abs(q - p)
    if a == b: return math.exp(-a * D) * (D + 1 / a)
    s = a + b; t = a - b; z = t * D
    return 2 * math.exp(-b * D) / s * (1 + b * D * (-math.expm1(-z) / z if z != 0 else 1.0))
def thetaC(p, k, n):
    hs = range(1, p); ds = [k - h / p for h in hs]; mu_ = [d ** (1 / 3) / 1.7 for d in ds]; u = [2.3 / d for d in ds]
    num = den = 0
    for m, hm in enumerate(hs):
        for l, hl in enumerate(hs):
            G = gram(mu_[m], u[m], mu_[l], u[l]); num += math.cos(2 * math.pi * (hm - hl) * n / p) * G; den += G
    return num / den
rec = {(5, 5, 1): 0.062951, (5, 5, 2): 0.062506, (7, 6, 1): 0.028019, (7, 6, 2): 0.027812}
res["V5_thetaC_recorded_maxdiff"] = max(abs(thetaC(*k) - v) for k, v in rec.items())

print(json.dumps(res, indent=1, default=float))
json.dump(res, open("validate.json", "w"), indent=1, default=float)

# ---- V6: correlation / cap ratio: two single packets at the facing edges attain the cap exactly; brute-force quadrature check
import an3_check
