"""Combination 3: S(t) from S_1 increments (sawtooth lemma) and the lead of the Littlewood/Turing drift detector.

Sawtooth lemma: S has upward jumps only and slope -rho between jumps (rho = theta'/pi). If |S_1(t2) - S_1(t1)| <= A for
|t2 - t1| <= delta then  S(t) <= A/delta + delta rho/2  and  S(t) >= -A/delta - delta rho/2.
Zeta: Z(t) by Riemann-Siegel (main sum by type-1 NUFFT on a uniform t grid, exact base phases, C0..C2 terms).
L(chi mod 5), DH: Hurwitz zeta by Euler-Maclaurin (main sums by NUFFT), t <= Tmax.
From the zero lists: S (normalised by the window mean), S_1, A_delta, the bound and the ratio; for DH the sign-change count
S_0 (zeros on the line only) and its superposed profile around the steps of -2.
"""
import sys, math, json, time, argparse
import numpy as np, mpmath as mp
import torus as T, s3lib as S
from torus import xp, GPU, asnp

ap = argparse.ArgumentParser()
ap.add_argument('--heights', default='1e6,1e8')
ap.add_argument('--nz', type=float, default=2e4)      # zeros per zeta window
ap.add_argument('--res', type=int, default=40)        # grid points per mean spacing
ap.add_argument('--Tmax', type=float, default=2e4)    # DH / chi range [1, Tmax]
ap.add_argument('--w', type=int, default=12)
ap.add_argument('--out', default='c3.json')
ap.add_argument('--skipdh', type=int, default=0)
a = ap.parse_args(None if __name__ == '__main__' else [])
t00 = time.time()


# ------------------------------------------------------------------ helpers
def nufft_c(omega, c, M, w):
    nf = 2 * M
    SP = S.Spreader(1, nf, M, w=w, dtype=xp.complex128)
    SP.add(xp.asarray(omega % (2 * math.pi)), xp.asarray(c)[None, :])
    out = SP.transform(0)
    del SP
    return out


_PSI = None


def rs_tables(n=2999):
    global _PSI
    if _PSI is None:
        mp.mp.dps = 50
        psi = lambda p: mp.cos(2 * mp.pi * (p * p - p - mp.mpf(1) / 16)) / mp.cos(2 * mp.pi * p)
        ps = [mp.mpf(j) / n for j in range(n + 1)]
        c0 = [psi(p) for p in ps]
        d2 = [mp.diff(psi, p, 2) for p in ps]
        d3 = [mp.diff(psi, p, 3) for p in ps]
        d6 = [mp.diff(psi, p, 6) for p in ps]
        C0 = np.array([float(v) for v in c0])
        C1 = np.array([float(-v / (96 * mp.pi ** 2)) for v in d3])
        C2 = np.array([float(u / (64 * mp.pi ** 2) + v / (18432 * mp.pi ** 4)) for u, v in zip(d2, d6)])
        _PSI = (np.linspace(0, 1, n + 1), C0, C1, C2)
        mp.mp.dps = 30
    return _PSI


def theta_taylor(tc, deg=7):
    mp.mp.dps = 60
    f = lambda t: mp.im(mp.loggamma(mp.mpf(1) / 4 + 1j * t / 2)) - t / 2 * mp.log(mp.pi)
    # derivatives analytically from the asymptotic series: theta' = (1/2) log(t/2pi) - 1/(48 t^2) - ..., use mp.taylor at high precision
    co = mp.taylor(f, mp.mpf(tc), deg)
    c0 = float(mp.fmod(co[0], 2 * mp.pi))
    mp.mp.dps = 30
    return [c0] + [float(c) for c in co[1:]]


def zeta_Z_segment(tc, kk, dt, Nrs, Lt):
    """Z(tc + k dt) for k in kk (xp int array, contiguous), main sum n <= Nrs. tc integer."""
    M = 1024
    span = int(max(abs(int(kk[0])), abs(int(kk[-1]))) + 1)
    while M < 2 * span + 2:
        M *= 2
    n = np.arange(1, Nrs + 1)
    cyc = S.cycles_exact(tc, Lt[1:Nrs + 1])
    c = n ** -0.5 * np.exp(-2j * math.pi * cyc)
    F = nufft_c(dt * np.log(n), c, M, a.w)             # k' = -M/2..M/2-1
    F = F[kk + M // 2]
    u = kk.astype(xp.float64) * dt
    th = theta_taylor(tc)
    theta = xp.zeros(u.shape)
    for j in range(len(th) - 1, -1, -1):
        theta = theta * u + th[j]
    Z = 2 * (xp.exp(1j * theta) * F).real
    t = float(tc) + u
    tau = xp.sqrt(t / (2 * math.pi)); p = tau - Nrs
    P, C0, C1, C2 = rs_tables()
    pn = asnp(p)
    R = np.interp(pn, P, C0) + np.interp(pn, P, C1) / asnp(tau) + np.interp(pn, P, C2) / asnp(tau) ** 2
    Z = Z + (-1.0) ** (Nrs - 1) * tau ** -0.5 * xp.asarray(R)
    return Z, theta


def zeros_from_grid(Z, t0, dt):
    """zero positions (numpy float, relative to t0) from sign changes, plus pairs under positive minima / negative maxima; flags."""
    sg = Z > 0
    ch = xp.nonzero(sg[1:] != sg[:-1])[0]
    z0 = asnp(Z[ch]); z1 = asnp(Z[ch + 1]); ch = asnp(ch)
    zs = (ch + z0 / (z0 - z1)) * dt
    # close pairs: local minimum of |Z| without a sign change on either side
    A = xp.abs(Z)
    mid = xp.nonzero((A[1:-1] < A[:-2]) & (A[1:-1] < A[2:]) & (sg[1:-1] == sg[:-2]) & (sg[1:-1] == sg[2:]))[0] + 1
    y0 = asnp(Z[mid - 1]); y1 = asnp(Z[mid]); y2 = asnp(Z[mid + 1]); mid = asnp(mid)
    aa = (y0 - 2 * y1 + y2) / 2; bb = (y2 - y0) / 2
    disc = bb * bb - 4 * aa * y1
    ok = disc > 0
    extra = []
    for i in np.nonzero(ok)[0]:
        r = math.sqrt(disc[i])
        for x in ((-bb[i] - r) / (2 * aa[i]), (-bb[i] + r) / (2 * aa[i])):
            if abs(x) <= 1:
                extra.append((mid[i] + x) * dt)
    vert = y1 - bb * bb / (4 * aa)
    near = float(np.abs(vert[~ok]).min()) if (~ok).any() else float('inf')
    return np.sort(np.concatenate([zs, np.array(extra)])), len(extra), near


def sawtooth(z, wts, Rint, rho, c_frac, span, label, c_fixed=None):
    """z: sorted jump times in [0, span]; wts: jump sizes; Rint(t) = int_0^t rho (smooth counting part), rho = theta'/pi.
    S(t) = c + sum_{z_j <= t} wts_j - Rint(t); c = c_frac + integer chosen by the window mean (or c_fixed)."""
    from scipy.ndimage import maximum_filter1d, minimum_filter1d
    nz = len(z)
    cum = np.cumsum(wts)
    Spost = cum - Rint(z)                                             # S - c just after each jump
    Spre = Spost - wts
    tl = np.concatenate([[0.0], z]); tr = np.concatenate([z, [span]])
    g = tr - tl
    Sstart = np.concatenate([[0.0], Spost])
    rm = rho((tl + tr) / 2)
    I = Sstart * g - rm * g * g / 2
    S1z = np.concatenate([[0.0], np.cumsum(I)])
    mean0 = S1z[-1] / span
    c = c_fixed if c_fixed is not None else c_frac + round(-mean0 - c_frac)
    per = int(min(256, max(8, 5e7 // max(nz, 1))))
    ng = per * nz + 16
    tg = np.linspace(0, span, ng)
    j = np.clip(np.searchsorted(tl, tg, side='right') - 1, 0, len(tl) - 1)
    d = tg - tl[j]
    S1g = S1z[j] + Sstart[j] * d - rho(tl[j] + d / 2) * d * d / 2 + c * tg
    del j, d
    supS = float((Spost + c).max()); infS = float((Spre + c).min())
    absS = max(supS, -infS)
    rmax = float(max(rho(span), rho(0.0)))
    h = tg[1] - tg[0]
    rows = []
    for mult in (1, 2, 4, 8, 16, 32):
        m = int(round(mult / rmax / h))
        if m < 2 or m > ng // 4:
            continue
        A = float((maximum_filter1d(S1g, m + 1, mode='nearest') - minimum_filter1d(S1g, m + 1, mode='nearest')).max())
        dl = m * h
        # A_delta lies in [A, A + 2 |S|_max h] (grid step h)
        rows.append(dict(delta_mean_spacings=mult, delta=dl, A_lo=A, A_hi=A + 2 * absS * h, bound_lo=A / dl + dl * rmax / 2, bound_hi=(A + 2 * absS * h) / dl + dl * rmax / 2,
                         ratio_hi=absS / (A / dl + dl * rmax / 2), ratio_lo=absS / ((A + 2 * absS * h) / dl + dl * rmax / 2)))
    Aglob = float(S1g.max() - S1g.min())
    out = dict(label=label, njumps=nz, span=span, rho=rmax, c=float(c), mean_S=float(mean0 + c), supS=supS, infS=infS, grid_per_spacing=per,
               by_delta=rows, max_ratio_hi=max(r['ratio_hi'] for r in rows) if rows else None,
               A_global=Aglob, sqrt2Arho=math.sqrt(2 * Aglob * rmax), ratio_global=absS / math.sqrt(2 * Aglob * rmax))
    return out, (tl, Spost + c, Spre + c)


def rint_zeta(t0):
    L0 = math.log(t0 / (2 * math.pi))

    def g(x):
        x = np.asarray(x, dtype=float)
        ser = x * x / 2 - x ** 3 / 6 + x ** 4 / 12 - x ** 5 / 20 + x ** 6 / 30
        return np.where(np.abs(x) < 2e-3, ser, (1 + x) * np.log1p(x) - x)
    return lambda t: (np.asarray(t, dtype=float) * L0 + t0 * g(np.asarray(t, dtype=float) / t0)) / (2 * math.pi)


def dh_analysis(zd, t1, span, rho, Rint):
    """line-count function S_0 for DH, its steps of -2, the superposed profile around the steps, sawtooth statistics."""
    z = zd - t1
    cnt = np.arange(1, len(z) + 1)
    Spost = cnt - Rint(z)
    c = -float(np.mean((Spost - 0.5)[z < 80.0])) if (z < 80.0).sum() > 5 else 0.0
    S0 = Spost + c - 0.5                               # mid-jump value at each on-line zero
    from scipy.ndimage import median_filter
    medf = median_filter(S0, size=21, mode='nearest', origin=-10)        # median over the next 21 zeros
    n = len(z)
    gz = np.diff(z) * rho(z[:-1])
    used = np.zeros(n, dtype=bool)
    gam_all = []; gap_all = []
    L = 0; i = 0
    while i < n:
        if medf[i] + 2 * L < -1.0:
            lo = max(0, i - 2); hi = min(n - 1, i + 21)
            g = np.where(used[lo:hi], -1.0, gz[lo:hi])
            jx = lo + int(np.argmax(g))
            used[jx] = True
            gam_all.append(0.5 * (z[jx] + z[jx + 1])); gap_all.append(float(gz[jx]))
            L += 1
        else:
            i += 1
    o = np.argsort(gam_all)
    gam = np.array(gam_all)[o]; gap_all = np.array(gap_all)[o]
    noff = int(round(-np.median(S0[-200:]) / 2))
    spg = 1 / rho(gam) if len(gam) else np.array([])
    iso = np.ones(len(gam), dtype=bool)
    if len(gam) > 1:
        dprev = np.concatenate([[np.inf], np.diff(gam)]); dnext = np.concatenate([np.diff(gam), [np.inf]])
        iso = (dprev > 20 * spg) & (dnext > 20 * spg)
    clean = gam[iso]; gapn = gap_all[iso].tolist()
    ch = gam
    offs = np.arange(-12, 12.01, 0.25)
    prof = []
    for g0 in clean:
        spj = 1 / float(rho(g0))
        if g0 < 20 * spj or g0 > span - 20 * spj:
            continue
        tt = g0 + offs * spj
        S = np.searchsorted(z, tt, side='right') - Rint(tt) + c
        pre = np.mean(S[(offs < -4)])
        prof.append(S - pre)
    out = dict(c=c, level_changes=int(len(ch)), steps_located=int(len(gam)), clean_steps=int(len(clean)), offline_pairs_by_final_level=noff,
               first_step_heights=(gam[:40] + t1).tolist(), clean_gap_mean_spacings=dict(mean=float(np.mean(gapn)) if gapn else None, min=float(np.min(gapn)) if gapn else None),
               final_S0_median=float(np.median(S0[-200:])), S0_min=float(S0.min()))
    if prof:
        P = np.array(prof)
        m = P.mean(axis=0); se = P.std(axis=0) / math.sqrt(len(P)) + 1e-12
        out['profile_offsets_mean_spacings'] = offs.tolist()
        out['profile_mean'] = m.tolist(); out['profile_se'] = se.tolist(); out['profile_events'] = int(len(P))
        i0 = int(np.searchsorted(offs, 0.0))
        lead = 0.0
        for ix in range(i0):
            if (np.abs(m[ix:i0]) > 3 * se[ix:i0]).all() and (np.abs(m[ix:i0]) > 0.1).all():
                lead = float(-offs[ix]); break
        out['lead_mean_spacings'] = lead
    # sawtooth statistics: true S (jumps of 2 at the located steps) and the line count S_0
    zz = np.concatenate([z, gam]); ww = np.concatenate([np.ones(len(z)), 2 * np.ones(len(gam))])
    o = np.argsort(zz)
    st_true, _ = sawtooth(zz[o], ww[o], Rint, rho, 0.0, span, 'DH true S (steps restored)', c_fixed=c)
    st_line, _ = sawtooth(z, np.ones(len(z)), Rint, rho, 0.0, span, 'DH line count S_0', c_fixed=c)
    out['true'] = st_true; out['line'] = st_line
    # windows before the first step: sawtooth statistics on [0, gamma_1)
    if len(gam):
        m1 = z < gam[0]
        st_pre, _ = sawtooth(z[m1], np.ones(int(m1.sum())), Rint, rho, 0.0, float(gam[0]), 'DH below the first off-line height', c_fixed=c)
        out['pre_first'] = st_pre
    return out


# ------------------------------------------------------------------ zeta windows
def zeta_window(Th, nz, res):
    Th = float(Th)
    sp = 2 * math.pi / math.log(Th / (2 * math.pi))
    dt = sp / res
    W = nz * sp
    t0 = int(Th)
    K = int(W / dt)
    Nmax = int(math.sqrt((t0 + W + 2) / (2 * math.pi))) + 1
    pr = T.sieve(Nmax + 1)
    Lt = S.extend_logs(Nmax + 1, pr, S.frac_logs(pr))
    zs = []; nextra = 0; near = float('inf'); k0 = 0
    zerr = None
    while k0 < K:
        ta = t0 + k0 * dt
        Nrs = int(math.sqrt(ta / (2 * math.pi) + 1e-12))
        tb = min(t0 + K * dt, 2 * math.pi * (Nrs + 1) ** 2)
        k1 = min(K, int((tb - t0) / dt) + 1)
        k1 = min(k1, k0 + (1 << 24))
        tc = int(round(t0 + (k0 + k1) / 2 * dt))
        # points t0 + k dt = tc + (t0 - tc) + k dt : shift is not a multiple of dt; use offset grid k' with fractional start
        off = (t0 - tc) / dt
        kk0 = int(math.floor(off + k0)); frac = off + k0 - kk0
        # absorb the fractional offset into the base: evaluate at tc' = tc + frac*dt  (non-integer) -> use shifted transform instead
        kk = xp.arange(kk0, kk0 + (k1 - k0) + 1)
        Z, th = T.retry(zeta_Z_segment_shift, tc, frac * dt, kk, dt, Nrs, Lt)
        if zerr is None:
            ii = np.linspace(0, len(kk) - 2, 12).astype(int)
            mp.mp.dps = 30
            ref = np.array([float(mp.siegelz(mp.mpf(tc) + (int(kk[int(i)]) + mp.mpf(frac)) * mp.mpf(dt))) for i in ii]) if Th <= 1e10 else None
            zerr = float(np.abs(asnp(Z)[ii] - ref).max()) if ref is not None else None
            print('Z max err vs mpmath siegelz:', zerr, flush=True)
        z, ne, nr = zeros_from_grid(Z, 0.0, dt)
        z = z + (tc - t0) + (kk0 + frac) * dt
        lo = k0 * dt; hi = k1 * dt
        zs.append(z[(z >= lo) & (z < hi)]); nextra += ne; near = min(near, nr)
        k0 = k1
        del Z
        T.free()
    z = np.concatenate(zs)
    span = K * dt
    mp.mp.dps = 50
    th0 = mp.im(mp.loggamma(mp.mpf(1) / 4 + 1j * mp.mpf(t0) / 2)) - mp.mpf(t0) / 2 * mp.log(mp.pi)
    c_frac = float(mp.frac(-th0 / mp.pi - 1) )
    mp.mp.dps = 30
    rho = lambda t: np.log((t0 + np.asarray(t, dtype=float)) / (2 * math.pi)) / (2 * math.pi)
    Rint = rint_zeta(float(t0))
    st, prof = sawtooth(z, np.ones(len(z)), Rint, rho, c_frac, span, f'ZETA T={Th:.0e}')
    st.update(T=Th, t0=t0, dt=dt, grid_points=K, pairs_from_parabola=nextra, nearest_unresolved_extremum=near, Z_maxerr_vs_mpmath=zerr)
    return st, z, (t0, span, c_frac, rho, Rint)


def zeta_Z_segment_shift(tc, sh, kk, dt, Nrs, Lt):
    """as zeta_Z_segment at the points tc + sh + k dt (0 <= sh < dt): the shift is put into the strengths (float phase, |sh| < 1)."""
    M = 1024
    span = int(max(abs(int(kk[0])), abs(int(kk[-1]))) + 1)
    while M < 2 * span + 2:
        M *= 2
    n = np.arange(1, Nrs + 1)
    ln = np.log(n)
    cyc = S.cycles_exact(tc, Lt[1:Nrs + 1])
    c = n ** -0.5 * np.exp(-2j * math.pi * cyc - 1j * sh * ln)
    print(f'planned: NUFFT grid {2 * M * 16 / 2**30:.2f} GiB (M={M}, terms={Nrs})', flush=True)
    F = nufft_c(dt * ln, c, M, a.w)
    F = F[kk + M // 2]
    u = kk.astype(xp.float64) * dt + sh
    th = theta_taylor(tc)
    theta = xp.zeros(u.shape)
    for j in range(len(th) - 1, -1, -1):
        theta = theta * u + th[j]
    Z = 2 * (xp.exp(1j * theta) * F).real
    del F
    t = float(tc) + u
    tau = xp.sqrt(t / (2 * math.pi)); p = asnp(tau - Nrs); taun = asnp(tau)
    P, C0, C1, C2 = rs_tables()
    R = np.interp(p, P, C0) + np.interp(p, P, C1) / taun + np.interp(p, P, C2) / taun ** 2
    Z = Z + (-1.0) ** (Nrs - 1) * tau ** -0.5 * xp.asarray(R)
    return Z, theta


# ------------------------------------------------------------------ Dirichlet side (chi mod 5, DH), t <= Tmax
def lgamma_im(z):
    """Im log Gamma(z), Re z > 0 (xp complex array): shift by 10, Stirling."""
    acc = xp.zeros(z.shape)
    zz = z
    for _ in range(10):
        acc += xp.log(zz).imag; zz = zz + 1
    st = (zz - 0.5) * xp.log(zz) - zz + 0.5 * math.log(2 * math.pi) + 1 / (12 * zz) - 1 / (360 * zz ** 3) + 1 / (1260 * zz ** 5)
    return st.imag - acc


def theta5(t, omega=0.0):
    return t / 2 * math.log(5 / math.pi) + lgamma_im(0.75 + 0.5j * t) - omega


def dirichlet_block(tc, M, dt, Nem):
    """L(1/2 + it, chi), L(1/2 + it, chibar) at t = tc + k dt, k = -M/2..M/2-1 (xp complex)."""
    k = xp.arange(-M // 2, M // 2)
    t = tc + k.astype(xp.float64) * dt
    s = 0.5 + 1j * t
    H = []
    m = np.arange(Nem, dtype=np.float64)
    for r in range(1, 5):
        x = r / 5.0
        ln = np.log(m + x)
        c = np.exp(-0.5 * ln - 1j * tc * ln)
        tot = nufft_c(dt * ln, c, M, a.w)
        y = Nem + x; ly = math.log(y)
        tot = tot + xp.exp((1 - s) * ly) / (s - 1) + 0.5 * xp.exp(-s * ly)
        term = s * xp.exp((-s - 1) * ly); fact = 2.0
        for j in range(1, len(T._B2K) + 1):
            tot = tot + T._B2K[j - 1] / fact * term
            term = term * (s + 2 * j - 1) * (s + 2 * j) / (y * y)
            fact *= (2 * j + 1) * (2 * j + 2)
        H.append(tot)
    f5 = xp.exp(-s * math.log(5))
    chi = T.CHI5
    L1 = sum(chi[r] * H[r - 1] for r in range(1, 5)) * f5
    L2 = sum(np.conj(chi[r]) * H[r - 1] for r in range(1, 5)) * f5
    return t, L1, L2


def dirichlet_zeros(Tmax, res):
    sp = 2 * math.pi / math.log(5 * Tmax / (2 * math.pi))
    dt = sp / res
    OM5 = float(np.angle(T.W5) / 2)
    Nem = int(1.2 * Tmax + 40)
    K = int(Tmax / dt)
    M = 1 << 22
    while M > 2 * K and M > 4096:
        M //= 2
    zc, zd = [], []
    errs = {}
    b = 0
    nb = (K + M - 1) // M
    stats = dict(extra_chi=0, extra_dh=0, max_imag_chi=0.0, max_imag_dh=0.0)
    print(f'planned: NUFFT grid {2 * M * 16 / 2**30:.2f} GiB, terms {Nem}, blocks {nb}', flush=True)
    for b in range(nb):
        tc = (b * M + M // 2) * dt
        t, L1, L2 = T.retry(dirichlet_block, tc, M, dt, Nem)
        Zc = xp.exp(1j * theta5(t, OM5)) * L1
        Zd = xp.exp(1j * theta5(t, 0.0)) * (T.DH_C1 * L1 + T.DH_C2 * L2)
        good = (t > 1.0) & (t < Tmax)
        stats['max_imag_chi'] = max(stats['max_imag_chi'], float(xp.abs(Zc.imag[good]).max()))
        stats['max_imag_dh'] = max(stats['max_imag_dh'], float(xp.abs(Zd.imag[good]).max()))
        if b == 0:
            mp.mp.dps = 25
            ii = [int(i) for i in np.linspace(M // 50, M - 2, 6) if float(t[int(i)]) < min(Tmax, 2e4)][:4]
            chi = [0, 1, 1j, -1j, -1]
            ref = [complex(mp.dirichlet(mp.mpc(0.5, float(t[i])), chi)) for i in ii]
            errs['L_chi_maxerr_vs_mpmath'] = float(max(abs(complex(L1[i]) - r) for i, r in zip(ii, ref))) if ref else None
        for Zr, store, key in ((Zc.real, zc, 'extra_chi'), (Zd.real, zd, 'extra_dh')):
            z, ne, nr = zeros_from_grid(Zr, 0.0, dt)
            z = z + float(t[0])
            lo = max(1.0, b * M * dt); hi = min(Tmax, (b + 1) * M * dt)
            store.append(z[(z >= lo) & (z < hi)]); stats[key] += ne
        del L1, L2, Zc, Zd, t
        T.free()
        print(f'dirichlet block {b + 1}/{nb} t={time.time() - t00:.0f}s', flush=True)
    return np.concatenate(zc), np.concatenate(zd), dt, stats, errs


def theta5_np(t, omega=0.0):
    from scipy.special import loggamma
    t = np.asarray(t, dtype=float)
    return t / 2 * math.log(5 / math.pi) + loggamma(0.75 + 0.5j * t).imag - omega


if __name__ == '__main__':
    res = dict(meta=dict(vars(a)), zeta=[], GPU=GPU)
    for Th in [float(h) for h in a.heights.split(',')]:
        st, z, info = zeta_window(Th, int(a.nz), a.res)
        res['zeta'].append(st)
        print(json.dumps({k: (round(v, 5) if isinstance(v, float) else v) for k, v in st.items()}), flush=True)
        if Th == float(a.heights.split(',')[0]):
            # T-NR on the same window: jumps = zeta zeros (weight 1) and the off-line pairs at (2k+1) pi / log 3 (weight 2)
            t0, span, c_frac, rho, Rint = info
            l3 = math.log(3)
            kk = np.arange(math.ceil((t0 * l3 / math.pi - 1) / 2), math.floor(((t0 + span) * l3 / math.pi - 1) / 2) + 1)
            off = (2 * kk + 1) * math.pi / l3 - t0
            off = off[(off > 0) & (off < span)]
            zz = np.concatenate([z, off]); ww = np.concatenate([np.ones(len(z)), 2 * np.ones(len(off))])
            o = np.argsort(zz)
            rho2 = lambda t: rho(t) + l3 / math.pi
            Rint2 = lambda t: Rint(t) + np.asarray(t, dtype=float) * l3 / math.pi
            cf = (c_frac - ((t0 * l3 / math.pi) % 1.0)) % 1.0
            st2, _ = sawtooth(zz[o], ww[o], Rint2, rho2, cf, span, f'T-NR true S, T={Th:.0e}')
            st2['offline_pairs_in_window'] = int(len(off))
            # line count only: S_0 = S_zeta - t log3 / pi (drift); detection of the drift against the zeta bound
            st2['S0_drift_slope'] = -l3 / math.pi
            st2['S0_drift_exceeds_sqrt2Arho_after_t'] = st['sqrt2Arho'] / (l3 / math.pi)
            res['tnr'] = st2
            print(json.dumps({k: (round(v, 5) if isinstance(v, float) else v) for k, v in st2.items()}), flush=True)
        json.dump(res, open(a.out, 'w'))
    if not a.skipdh:
        zc, zd, dt, stats, errs = dirichlet_zeros(a.Tmax, a.res)
        t1 = 1.0; span = a.Tmax - t1
        OM5 = float(np.angle(T.W5) / 2)
        rho = lambda t: np.log(5 * (t1 + np.asarray(t, dtype=float)) / (2 * math.pi)) / (2 * math.pi)
        Rc = lambda t: (theta5_np(t1 + np.asarray(t, dtype=float), OM5) - theta5_np(t1, OM5)) / math.pi
        Rd = lambda t: (theta5_np(t1 + np.asarray(t, dtype=float), 0.0) - theta5_np(t1, 0.0)) / math.pi
        stc, _ = sawtooth(zc - t1, np.ones(len(zc)), Rc, rho, 0.0, span, 'CHI')
        stc, _ = sawtooth(zc - t1, np.ones(len(zc)), Rc, rho, 0.0, span, 'CHI', c_fixed=stc['c'] - stc['mean_S'])
        stc.update(stats=stats, errs=errs, zeros=int(len(zc)))
        res['chi'] = stc
        print(json.dumps({k: (round(v, 5) if isinstance(v, float) else v) for k, v in stc.items() if k not in ('stats', 'errs')}), flush=True)
        res['dh'] = dh_analysis(zd, t1, span, rho, Rd)
        print(json.dumps({k: v for k, v in res['dh'].items() if k in ('steps_located', 'clean_steps', 'offline_pairs_by_final_level', 'lead_mean_spacings', 'profile_events', 'first_step_heights')}), flush=True)
        res['dh'].update(zeros_on_line=int(len(zd)), dt=dt)
        np.save(a.out.replace('.json', '_dhzeros.npy'), zd)
        json.dump(res, open(a.out, 'w'))
    json.dump(res, open(a.out, 'w'))
    print('done', f'{time.time() - t00:.0f}s', flush=True)
