"""Known-answer checks for gw.py (local, under memcap)."""
import math, json, numpy as np, mpmath as mp, w3, gw
PI = math.pi; res = {}
# (c) Montgomery-Taylor constant
for J in (2, 4, 8):
    q, Cw, Cs = gw.mt_window(J)
    res['mt_J%d' % J] = dict(C_w=Cw, C_star=Cs, closed_form=0.5 + math.cos(2 ** -0.5) / math.sin(2 ** -0.5) / math.sqrt(2))
    print('MT window J=%d: C(w_J)=%.8f  C*=%.8f  closed form %.8f' % (J, Cw, Cs, res['mt_J%d' % J]['closed_form']))
s = np.linspace(-0.5, 0.5, 20001); print('box C =', gw.C_of_w(np.ones_like(s), s), '(4/3)')
# (a) build_G against w3.build_box, zeta; (b) against the zero side with the Hann window
NZ = 600
g = np.array([float(mp.zetazero(k).imag) for k in range(1, NZ + 1)])
for (X, nu0, n) in ((200.0, 30.0, 60), (3000.0, 40.0, 60)):
    fam = gw.family('ZETA', X); L = math.log(X)
    G, parts = gw.build_G(fam, nu0, n, X, block=17)
    W = w3.build_box(w3.family('ZETA', X), nu0, n, X)
    d1 = float(np.abs(G - W / L ** 2).max())
    y = (np.concatenate([g, -g]) - nu0) * L / (2 * PI)
    Z = gw.zero_side_G(np.concatenate([y, [(0.5j - nu0) * L / (2 * PI), (-0.5j - nu0) * L / (2 * PI)]]) * 0 + 0j + np.concatenate([y, [0, 0]]), n) if False else gw.zero_side_G(y, n)
    d2 = float(np.abs(w3.hann(G) - w3.hann(Z)).max())
    q, Cw, Cs = gw.mt_window(4)
    ws = gw.window_stats(G, q, block=13); Bk = gw.apply_window(G, q)
    d3 = abs(ws['trace'] - np.trace(Bk)) + abs(ws['fro2'] - (Bk * Bk).sum())
    res['zeta X=%g' % X] = dict(diff_w3=d1, diff_zero_side_hann=d2, window_stats_diff=float(d3))
    print('ZETA X=%g: |G - w3|=%.2e, hann |prime - zero|=%.2e, window_stats check %.2e' % (X, d1, d2, d3))
# EA: zeros gamma -+ i a
for a in (0.1, 0.3):
    for (X, nu0, n) in ((200.0, 30.0, 60), (3000.0, 40.0, 60)):
        fam = gw.family('EA', X, a=a); L = math.log(X)
        G, parts = gw.build_G(fam, nu0, n, X)
        gg = np.concatenate([g, -g])
        y = (np.concatenate([gg - 1j * a, gg + 1j * a]) - nu0) * L / (2 * PI)
        Z = gw.zero_side_G(y, n)
        d2 = float(np.abs(w3.hann(G) - w3.hann(Z)).max())
        ev = np.linalg.eigvalsh(w3.hann(G)); evz = np.linalg.eigvalsh(w3.hann(Z))
        res['EA a=%g X=%g' % (a, X)] = dict(diff_zero_side_hann=d2, absmax=float(np.abs(G).max()), ev_low_prime=ev[:3].tolist(), ev_low_zero=evz[:3].tolist())
        print('EA a=%g X=%g: hann |prime - zero|=%.2e (max entry %.3g); lowest eig prime %s zero %s' % (a, X, d2, np.abs(G).max(), ev[:3], evz[:3]))
# DH against the table of all zeros below 2000
tab = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
on = np.array([float(x) for x in tab['online']])
off = np.array([complex(float(b) - 0.5, float(t)) for b, t, _ in tab['offline']])
goff = np.concatenate([off.imag - 1j * off.real, off.imag + 1j * off.real])
gam = np.concatenate([on, goff]); gam = np.concatenate([gam, -gam])
for (X, nu0, n) in ((200.0, 300.0, 80), (40.0, 600.0, 200)):
    fam = gw.family('DH', X); L = math.log(X)
    G, parts = gw.build_G(fam, nu0, n, X)
    Z = gw.zero_side_G((gam - nu0) * L / (2 * PI), n)
    d2 = float(np.abs(w3.hann(G) - w3.hann(Z)).max())
    res['DH X=%g nu0=%g' % (X, nu0)] = dict(diff_zero_side_hann=d2)
    print('DH X=%g nu0=%g n=%d: hann |prime - zero|=%.2e' % (X, nu0, n, d2))
# (e) sine-process moments from a CUE sample: K = sinc(x_i - x_j) on unfolded eigenangles; GUE values 1, 4/3, 2, 13/4
rng = np.random.default_rng(5)
ms = []
for rep in range(4):
    n = 1500
    A = (rng.normal(size=(n, n)) + 1j * rng.normal(size=(n, n))) / math.sqrt(2)
    Q, R = np.linalg.qr(A); Q = Q * (np.diag(R) / np.abs(np.diag(R)))
    th = np.sort(np.angle(np.linalg.eigvals(Q))); x = th * n / (2 * PI)
    x = x[200:-200]
    for lam in (1.0, 0.5):
        nn = int(lam * len(x))
        Gz = gw.zero_side_G(lam * (x - x[0]), nn)
        ev = np.linalg.eigvalsh(Gz)
        ms.append((lam, [float((ev ** k).mean()) for k in (1, 2, 3, 4)], float(ev[0]), float(ev[-1])))
for lam in (1.0, 0.5):
    arr = np.array([m[1] for m in ms if m[0] == lam])
    print('CUE lam=%g moments m1..m4 = %s +- %s; predicted m1 = %.4f, m2 = %.4f; eig range %.3f .. %.3f' % (lam, arr.mean(0).round(4), arr.std(0).round(4), 1 / lam, 1 / lam ** 2 + 1 / 3,
          min(m[2] for m in ms if m[0] == lam), max(m[3] for m in ms if m[0] == lam)))
    res['CUE lam=%g' % lam] = dict(mean=arr.mean(0).tolist(), std=arr.std(0).tolist())
json.dump(res, open('out/validate.json', 'w'), indent=1)
