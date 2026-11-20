"""s1-antibridge-cutoff-energy, combination (2): pulse leakage || Q_1 C_0 f ||^2, C_0 = multiplier S(it) = (F - alpha F')/(F + alpha F')(it).
Convention (PR 44): f^(t) = int f(u) e^{itu/2} du, ||f||^2 = (1/4pi) int |f^|^2 dt.
Regularised pulse (supported in [0,1], so leakage 0 is still equivalent to causality on it):
   f_eps = 1_[0, 1-3 eps] * (1_[0,eps]/eps)^{*3},  f_eps^(z) = (e^{z(1-3eps)/2} - 1)/(z/2) * ((e^{z eps/2} - 1)/(z eps/2))^3.
FFT side (float64; no zero information): g = C_0 f_eps on the grid, leakage = sum_{u>1} g^2 du.
Pole side (exact identity, RESULT.md): S f^ has anticausal part sum_j w_j/(z - p_j) over the poles p_j of S in Re z > 0
(the zeros of F + alpha F' there), w_j = Res_{p_j} S * e^{-p_j/2} f^(p_j), and
   leakage = (1/2) sum_{j,k} w_j conj(w_k)/(p_j + conj p_k).
Usage: leak.py selftest | leak.py scan OBJ scan.npz out.json [Tcap] | leak.py zeta flint.npz gpu_prefix out.json"""
import sys, json, math
import numpy as np
PI = math.pi
ALPHA = 1.0

def pulse_hat(z, eps, k=3):
    """f_eps^(z) for complex array z (z = it on the axis)"""
    z = np.asarray(z, dtype=complex)
    small = np.abs(z) < 1e-8
    zz = np.where(small, 1.0, z)
    a = (np.exp(zz * (1 - k * eps) / 2) - 1) / (zz / 2)
    a = np.where(small, 1 - k * eps, a)
    if eps > 0:
        x = zz * eps / 2
        b = np.where(np.abs(x) < 1e-6, 1 + x / 2, (np.exp(x) - 1) / np.where(x == 0, 1.0, x))
        b = np.where(small, 1.0, b)
        a = a * b ** k
    return a

def fft_leak(S, dt, eps, c=1.0):
    """S on t_j = j dt, j = 0..M.  returns leakage beyond u > c, total energy, input energy"""
    M = S.size - 1; n = 2 * M
    G = np.conj(S)                                  # one copy; the pulse factor is applied in chunks (memory)
    ein = 0.0; CH = 1 << 22
    for i0 in range(0, M + 1, CH):
        i1 = min(M + 1, i0 + CH)
        V = pulse_hat(1j * dt * np.arange(i0, i1), eps)
        a2 = np.abs(V) ** 2
        if i0 == 0: a2[0] *= 0.5
        if i1 == M + 1: a2[-1] *= 0.5
        ein += float(a2.sum()) * 2 * dt / (4 * PI)
        G[i0:i1] *= np.conj(V)
    del V, a2
    g = np.fft.irfft(G, n); del G
    g *= n * dt / (4 * PI)
    du = 4 * PI / (n * dt)
    # u_k = k du for k <= n/2, (k - n) du above; u > c  <=>  floor(c/du) < k <= n/2
    k0 = int(math.floor(c / du)) + 1
    tot = float(np.dot(g, g) * du)
    leak = float(np.dot(g[k0:n // 2 + 1], g[k0:n // 2 + 1]) * du)
    k30 = min(n // 2, int(math.floor((c + 30.0) / du)))
    leak30 = float(np.dot(g[k0:k30 + 1], g[k0:k30 + 1]) * du)
    # wrap diagnostic: energy in the 30 units that sit just beyond the far (negative-delay) end of the periodic window
    kw = n // 2 + 1; kw2 = min(n, kw + (k30 - k0))
    wrap30 = float(np.dot(g[kw:kw2], g[kw:kw2]) * du)
    q = n // 4
    far = float(np.dot(g[q:n - q], g[q:n - q]) * du)
    del g
    return dict(eps=eps, leakage=leak, leakage_first_30=leak30, energy_30_units_at_far_end=wrap30, output_energy=tot, input_energy=ein, energy_beyond_quarter_window=far, du=du, window=du * n)

def pole_leak(poles, res, eps, c=1.0):
    """poles p_j (Re > 0, Im > 0) with residues of S; conjugates are added here"""
    p = np.concatenate([poles, np.conj(poles)]); r = np.concatenate([res, np.conj(res)])
    w = r * np.exp(-p * c / 2) * pulse_hat(p, eps)
    A = 1.0 / (p[:, None] + np.conj(p[None, :]))
    return float((0.5 * (w[:, None] * np.conj(w[None, :]) * A).sum()).real), w

def selftest():
    """known answer: S = product of inverse Blaschke factors with poles p, conj p (two pairs), times a causal inner factor"""
    dt = 0.02; T = 4000.0; M = int(T / dt); t = dt * np.arange(M + 1); z = 1j * t
    P = np.array([0.3 + 85.7j, 0.15 + 20.0j])
    S = np.ones_like(z)
    for p in P:
        S = S * (z + np.conj(p)) / (z - p) * (z + p) / (z - np.conj(p))
    S = S * (1.7 - z) / (1.7 + z)                 # causal inner factor (zero at 1.7, pole at -1.7)
    allp = np.concatenate([P, np.conj(P)])
    def Sfun(zz):
        s = (1.7 - zz) / (1.7 + zz)
        for p in P: s = s * (zz + np.conj(p)) / (zz - p) * (zz + p) / (zz - np.conj(p))
        return s
    res = []
    for p in P:
        h = 1e-6
        res.append(Sfun(p + h) * h)               # residue by a one-sided limit (simple pole), 1e-6 accuracy
    res = np.array(res)
    out = []
    for eps in [0.1, 0.05, 0.02]:
        a = fft_leak(S, dt, eps); b, _ = pole_leak(P, res, eps)
        c0 = fft_leak((1.7 - z) / (1.7 + z), dt, eps)
        out.append(dict(eps=eps, fft=a['leakage'], poles=b, ratio=a['leakage'] / b, causal_only=c0['leakage'], energy_defect=a['output_energy'] - a['input_energy']))
        print(out[-1])
    return out

def find_poles(obj, offline, T, alpha=ALPHA):
    """zeros of 1 + alpha L(z) in Re z > 0 near the off-line zeros d + i gamma (exact evaluator), with residues 2/(alpha L'(p))"""
    from flint import acb, arb, ctx
    import flib
    if obj == 'HEAT':
        import linescan
        getobj = lambda g: linescan.heat_obj(g + 2)
    else:
        o = flib.OBJ[obj]; getobj = lambda g: o
    poles = []; resid = []; fail = 0
    for d, g in offline:
        if g > T: continue
        o = getobj(g)
        if obj != 'HEAT': ctx.prec = 128
        best = None
        # two-pole model near the foot: L = 1/(w-d) + 1/(w+d) + ell, w = z - i gamma;  1 + alpha L = 0 has the root
        # w_+ = (-alpha + sqrt(alpha^2 + (1 + alpha ell)^2 d^2))/(1 + alpha ell) in Re w > 0 (close to the axis for small d)
        w = acb('0.02')
        for _ in range(3):
            z0 = acb(0, g) + w
            c = o.taylor(z0, 2); ell = c[1] / c[0] - 1 / (w - d) - 1 / (w + d)
            q = 1 + alpha * ell
            w = (-alpha + (alpha * alpha + q * q * d * d).sqrt()) / q
            w = acb(max(float(w.real), 1e-4), float(w.imag))
        starts = [(float(w.real) - d, float(w.imag))] + [(a - d, b) for a in (0.005, 0.02, 0.05, 0.1, 0.2, 0.35) for b in (0.0, 0.1, -0.1, 0.3, -0.3, 0.6, -0.6)]
        for dx, dy in starts:
            z = acb(d + dx + 1e-3, g + dy)
            ok = False
            for _ in range(40):
                c = o.taylor(z, 3)
                L = c[1] / c[0]; Lp = 2 * c[2] / c[0] - L * L
                G = 1 + alpha * L
                dz = G / (alpha * Lp)
                z = acb(z.real.mid() - dz.real.mid(), z.imag.mid() - dz.imag.mid())
                if abs(float(z.imag) - g) > 3.0 or abs(float(z.real)) > 3.0: break
                if float(abs(dz).mid()) < 1e-22: ok = True; break
            if ok and float(z.real) > 0 and abs(float(z.imag) - g) < 3.0:
                pz = complex(z); rz = complex(2 / (alpha * Lp))
                if best is None or abs(pz - complex(d, g)) < abs(best[0] - complex(d, g)): best = (pz, rz)
                if dx == starts[0][0]: break
        if best is None: fail += 1
        else: poles.append(best[0]); resid.append(best[1])
    # remove duplicates (two off-line zeros attracting the same pole)
    P = np.array(poles); R = np.array(resid)
    keep = []
    for i in range(P.size):
        if all(abs(P[i] - P[j]) > 1e-9 for j in keep): keep.append(i)
    return P[keep], R[keep], fail, len(poles) - len(keep)

def S_from_scan(D, Tcap=None, stride=1):
    t = D['t']; L0i = D['L0i']
    if Tcap: m = t <= Tcap + 1e-9; t = t[m]; L0i = L0i[m]
    t = t[::stride]; L0i = L0i[::stride]
    S = (1 - 1j * ALPHA * L0i) / (1 + 1j * ALPHA * L0i)
    S[0] = 1.0 if not np.isfinite(S[0]) else S[0]
    return t, S

def run_scan(obj, path, outp, Tcap=None):
    import analyze
    D = np.load(path); t, S = S_from_scan(D, Tcap)
    dt = float(t[1] - t[0]); T = float(t[-1])
    epss = [e for e in [0.3, 0.2, 0.1, 0.05, 0.03, 0.02, 0.015, 0.01, 0.005, 0.0025] if e * T >= 300] or [0.3]
    res = dict(obj=obj, T=T, dt=dt, alpha=ALPHA, fft=[fft_leak(S, dt, e) for e in epss])
    # reversed orientation: the same pulse through conj(S) (anticausal); shows the size a non-causal multiplier produces
    res['fft_conjugate_multiplier'] = fft_leak(np.conj(S), dt, epss[0])
    tab, Htab = analyze.offline_table(obj, T)
    if tab:
        Tp = min(T, Htab) - 1
        P, R, fail, dup = find_poles(obj, tab, Tp)
        res['poles'] = dict(count=int(P.size), offline_pairs=int(sum(1 for d, g in tab if g <= Tp)), newton_failures=fail, duplicates=dup, table_height=Tp,
                            first=[[P[i].real, P[i].imag, abs(R[i])] for i in range(min(5, P.size))])
        res['pole_side'] = []
        for e in epss + [0.0]:
            v, w = pole_leak(P, R, e)
            single = 0.5 * np.abs(w[:P.size]) ** 2 / (2 * P.real) * 2
            res['pole_side'].append(dict(eps=e, leakage=v, diagonal_part=float(single.sum()), largest_single_pair=float(single.max()), largest_at=float(P[int(np.argmax(single))].imag)))
        for a, b in zip(res['fft'], res['pole_side']): a['pole_side'] = b['leakage']; a['ratio'] = a['leakage'] / b['leakage'] if b['leakage'] else None
        # leakage against the height of the poles included (cumulative): which heights carry it
        e = epss[-1]; cum = []
        order = np.argsort(P.imag)
        for m in sorted(set([1, 2, 3, 5, 10, 20, 50, 100, 200, 500, 1000, P.size])):
            if m <= P.size: cum.append([float(P[order[m - 1]].imag), pole_leak(P[order[:m]], R[order[:m]], e)[0]])
        res['pole_side_cumulative_by_height'] = dict(eps=e, rows=cum)
    json.dump(res, open(outp, 'w'), indent=1)
    print(json.dumps(res, indent=1)[:5000])

def run_zeta(flint_path, gpu_prefix, outp, stride=1, Tmax=None):
    """S(it) for zeta: exact values (flint scan) below its top height, float64 Riemann-Siegel values (GPU scan) above"""
    D = np.load(flint_path); t1, S1 = S_from_scan(D)
    dt1 = float(t1[1] - t1[0])
    G = json.load(open(gpu_prefix + '.json')); ph = np.load(gpu_prefix + '_Sphase.npy', mmap_mode='r')
    dt = 2 * G['dt'] * stride; T0 = G['T0']
    ph = np.array(ph[::stride][:int(round((Tmax - T0) / dt)) + 1]) if Tmax else np.array(ph[::stride])
    st = int(round(dt / dt1)); t1 = t1[::st]; S1 = S1[::st]
    n1 = int(round(T0 / dt)); assert abs(n1 * dt - T0) < 1e-9
    nf = S1.size - 1                                  # flint values for t < t1[nf]
    print('planned memory: S array %.2f GB, FFT work about %.2f GB (one conjugate copy, irfft output and its work array)' % ((n1 + ph.size) * 16 / 1e9, (n1 + ph.size) * 16 * 3 / 1e9), flush=True)
    Sg = np.exp(1j * ph); del ph
    ov = np.abs(S1[n1:nf] - Sg[:nf - n1])
    res = dict(obj='ZETA', dt=dt, alpha=ALPHA, flint_below=float(t1[nf]), overlap_max_diff=float(ov.max()), overlap_max_diff_above_1000=float(ov[int(900 / dt):].max()),
               overlap_rms_diff=float(np.sqrt((ov ** 2).mean())), fft=[], fft_by_band=[])
    S = np.concatenate([S1[:nf], Sg[nf - n1:]]); del Sg
    T = dt * (S.size - 1); res['T'] = T
    for e in [0.3, 0.1, 0.03, 0.01, 3e-3, 1e-3, 3e-4, 1e-4]:
        if e * T >= 300:
            r = fft_leak(S, dt, e); res['fft'].append(r); print(r, flush=True)
    res['fft_conjugate_multiplier'] = fft_leak(np.conj(S), dt, 0.3)
    # the same pulse with the multiplier known only up to height T_b (band truncated at T_b): leakage against T_b
    for Tb in [1e3, 1e4, 1e5, 1e6]:
        if Tb < T:
            m = int(Tb / dt); r = fft_leak(S[:m + 1], dt, min(0.3, 300 / Tb)); r['T_band'] = Tb; res['fft_by_band'].append(r)
    json.dump(res, open(outp, 'w'), indent=1)
    print(json.dumps(res, indent=1)[:4000])

if __name__ == '__main__':
    if sys.argv[1] == 'selftest': selftest()
    elif sys.argv[1] == 'scan': run_scan(sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]) if len(sys.argv) > 5 else None)
    elif sys.argv[1] == 'zeta': run_zeta(sys.argv[2], sys.argv[3], sys.argv[4], int(sys.argv[5]) if len(sys.argv) > 5 else 1, float(sys.argv[6]) if len(sys.argv) > 6 else None)
