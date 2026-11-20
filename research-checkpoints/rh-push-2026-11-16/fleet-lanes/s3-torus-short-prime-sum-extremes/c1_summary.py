"""Summary of the c1n runs: per column sd, extremes, exceedances; upper-tail comparison of the orbit against the Haar-flow reference."""
import sys, json, math, numpy as np
def load(fn):
    try:
        return json.load(open(fn))
    except Exception:
        return None
def table(fn, ref=None, label=''):
    R = load(fn)
    if R is None:
        print(f'({fn} missing)'); return
    H = load(ref) if ref else None
    h = np.array(R['hist'], dtype=float); BLO, BW, NB = R['hist_bins']; z0 = int(round(-BLO / BW))
    m = R['meta']
    print(f"\n#### {label} [{fn}]  N = {R['N']:.3g} ({R['nterm']} terms), heights {R['done']:.3e} on the lattice {R['H0']:.3g} + k*{R['step']}, mode {m['mode']}")
    print('| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |')
    print('|---|---|---|---|---|---|---|---|---|---|---|---|')
    for c, (f, j) in enumerate(R['cols']):
        d, twoa = R['weights'][j]
        sd = math.sqrt(max(R['meansq'][c] - R['mean'][c] ** 2, 0))
        ex = int(h[c, z0:].sum())
        hr = ''
        if H is not None and f in ('ZETA', 'SGN', 'UNI', 'LIO', 'THIN'):
            cz = [k for k, (ff, jj) in enumerate(H['cols']) if ff == 'ZETA' and jj == j]
            if cz:
                hh = np.array(H['hist'][cz[0]], dtype=float)
                # compare tails at the level of dev = -beta + 5 sd-ish: use fixed levels in dev relative to the orbit max
                lv = [int(z0 + round((x) / BW)) for x in (-9, -8, -7, -6)]
                hr = '; '.join(f"x={-x}: {h[c, l:].sum() / R['done']:.2e} vs {hh[l:].sum() / H['done']:.2e}" for x, l in zip((-9, -8, -7, -6), lv))
        print(f"| {f} | {d} | {twoa} | {R['torus_sup'][c]:.2f} | {sd:.3f} | {R['maxV'][c]:.3f} | {R['maxV'][c] / sd:.2f} | {R['minV'][c] / sd:.2f} | {R['maxdev'][c]:+.3f} | {ex} | {ex / R['done']:.2e} | {hr} |")
if __name__ == '__main__':
    table('c1n_A.json', 'c1n_D.json', 'A: detection support of offset 3/8 at 3e12')
    table('c1n_D.json', None, 'D: Haar-flow reference for A')
    table('c1n_B.json', 'c1n_D2.json', 'B: detection support of offset 0.2')
    table('c1n_D2.json', None, 'D2: Haar-flow reference for B')
    table('c1n_F.json', 'c1n_F2.json', 'F: detection support of offset 0.137')
    table('c1n_F2.json', None, 'F2: Haar-flow reference for F')
    table('c1n_C.json', None, 'C: full log-derivative coefficients (DH, heat)')
    table('c1n_C2.json', None, 'C2: full coefficients, N = 1.18e6')
    table('c1n_E.json', 'c1n_E2.json', 'E: verified range 1e6..3e8, detection support of offset 0.2 at 5e5')
    table('c1n_E2.json', None, 'E2: Haar-flow reference for E')
