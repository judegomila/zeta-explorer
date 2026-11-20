"""Known-answer checks for w3.py: prime side against the zero side (zeta: mpmath zeros; DH: battery table, all zeros below 2000)."""
import math, json, numpy as np, mpmath as mp, w3
PI = math.pi
res = {}
# zeta zeros
NZ = 400
g = np.array([float(mp.zetazero(k).imag) for k in range(1, NZ + 1)])
gam = np.concatenate([g, -g]).astype(complex)
for (X, nu0, n) in ((20.0, 20.0, 30), (200.0, 30.0, 60), (3000.0, 40.0, 60)):
    fam = w3.family('ZETA', X)
    W = w3.build_box(fam, nu0, n, X)
    Z, F = w3.zero_side_box(gam, nu0, n, X)
    dh = np.abs(w3.hann(W) - w3.hann(Z)).max()
    db = np.abs(W - Z).max()
    ev = np.linalg.eigvalsh(W); evh = np.linalg.eigvalsh(w3.hann(W))
    res['zeta X=%g nu0=%g n=%d' % (X, nu0, n)] = dict(max_abs_diff_hann=float(dh), max_abs_diff_box_with_truncated_zero_sum=float(db), absmax=float(np.abs(W).max()),
        lam_min_box=float(ev[0]), lam_min_hann=float(evh[0]), trace_over_L2=float(np.trace(W) / math.log(X) ** 2))
    print(X, nu0, n, res['zeta X=%g nu0=%g n=%d' % (X, nu0, n)], flush=True)
# DH: all zeros below 2000 from the table (on-line + off-line pairs + conjugates)
tab = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
on = np.array([float(x) for x in tab['online']])
off = np.array([complex(float(b) - 0.5, float(t)) for b, t, _ in tab['offline']])   # beta-1/2 + i gamma -> gamma_rho = gamma - i(beta - 1/2)
goff = np.concatenate([off.imag - 1j * off.real, off.imag + 1j * off.real])
gam = np.concatenate([on, goff]); gam = np.concatenate([gam, -gam])
for (X, nu0, n) in ((20.0, 100.0, 40), (200.0, 300.0, 80), (1000.0, 300.0, 80)):
    fam = w3.family('DH', X)
    W = w3.build_box(fam, nu0, n, X)
    Z, F = w3.zero_side_box(gam, nu0, n, X)
    dh = np.abs(w3.hann(W) - w3.hann(Z)).max()
    evh = np.linalg.eigvalsh(w3.hann(W)); evz = np.linalg.eigvalsh(w3.hann(Z))
    res['DH X=%g nu0=%g n=%d' % (X, nu0, n)] = dict(max_abs_diff_hann=float(dh), absmax=float(np.abs(W).max()), ev_low_prime=[float(x) for x in evh[:4]], ev_low_zero=[float(x) for x in evz[:4]])
    print('DH', X, nu0, n, res['DH X=%g nu0=%g n=%d' % (X, nu0, n)], flush=True)
print('DH c(2), c(4), c(6):', [float(v) for v in w3.dh_logder(10)[1][[0, 2, 4]]], ' (s1 lane: 0.19691, -1.44223, 1.93635)')
json.dump(res, open('w3_validate.json', 'w'), indent=1)
