import pickle, numpy as np, glob
for fn in sorted(glob.glob('v2_q*.pkl')):
    R = pickle.load(open(fn, 'rb'))
    if not R: continue
    q = R[0]['q']
    relerr = max(r['err'] / max(abs(r['B']), r['cs'] * 1e-3, 1e-300) for r in R if r['cs'] > 1e-6)
    abserr = max(r['err'] for r in R); big = max(abs(r['B']) for r in R)
    nz = [r for r in R if r['cs'] > 1e-6 * q ** (r['d'] + r['k'] + r['N'])]
    par = {p: sum(1 for r in R if ((r['N'] - r['k']) % 6 == 0) == p) for p in (True, False)}
    print(f"{fn}: {len(R)} blocks (even {par[True]}, odd {par[False]}; r from {min(r['r'] for r in R)} to {max(r['r'] for r in R)}), "
          f"{len(nz)} with nonzero norms; max abs err {abserr:.1e} (max |B| {big:.2e}); max err/|B| over nonzero-B blocks "
          f"{max(r['err']/abs(r['B']) for r in nz if abs(r['B']) > 1e-3*r['cs']):.1e}")
    if 'sfc' in fn or 'q13' in fn: continue
    print("  blocks with d >= 3, ratio >= 2 x null (k, N, d, r, nu, ratio, x null, principal share, diag share, nonprincipal share, conj-row ratio):")
    for r in nz:
        if r['d'] >= 3 and r['ratio'] >= 2 * r['null']:
            print(f"   ({r['k']},{r['N']},{r['d']}) r={r['r']:2d} {r['nu']:9s} {r['ratio']:.4f} {r['ratio']/r['null']:5.2f} {r['principal']:.4f} {r['diag']:.4f} {r['nonprincipal']:.4f} {r['conj_ratio']:.3f}")
    print("  d = 4, r >= 0, all nonzero blocks: (k,N) nu ratio/null | conj-row ratio/null")
    for r in nz:
        if r['d'] == 4 and r['r'] >= 0:
            print(f"   ({r['k']},{r['N']}) r={r['r']} {r['nu']:9s} {r['ratio']/r['null']:6.2f} | {r['conj_ratio']/r['null']:6.2f}   normc={r['normc']:.3f} normR={r['normR']:.3f}")
