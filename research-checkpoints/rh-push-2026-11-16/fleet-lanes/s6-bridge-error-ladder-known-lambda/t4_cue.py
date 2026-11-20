"""Reference for the Palm density: eigenangles of Haar unitary matrices (size n, m matrices), written as one list with a gap of 5 between matrices
is NOT used; each matrix is analysed on the circle and the histograms are pooled. Output: pooled Palm density around close pairs (s < 0.2)."""
import sys, json, numpy as np
n, m = int(sys.argv[1]), int(sys.argv[2]); rng = np.random.default_rng(7)
bins = np.linspace(-6, 6, 121); H = np.zeros(120); npairs = 0; ngap = 0; nclose5 = 0
for r in range(m):
    z = (rng.standard_normal((n, n)) + 1j * rng.standard_normal((n, n))) / np.sqrt(2); q, rr = np.linalg.qr(z); d = np.diag(rr); q = q * (d / abs(d))
    th = np.sort(np.angle(np.linalg.eigvals(q))) * n / (2 * np.pi)          # mean spacing 1 on a circle of length n
    ext = np.concatenate([th[-20:] - n, th, th[:20] + n]); gap = np.diff(ext)[20:20 + n]   # gap i: between point i and i+1 (cyclic)
    idx = np.nonzero(gap < 0.2)[0] + 20; npairs += len(idx); ngap += n; nclose5 += int((gap < 0.05).sum())
    mid = 0.5 * (ext[idx] + ext[idx + 1])
    for off in list(range(-16, 0)) + list(range(2, 18)): H += np.histogram(ext[idx + off] - mid, bins)[0]
emp = H / (npairs * 0.1)
json.dump(dict(name='cue_%d' % n, n=n, m=m, palm=[dict(label='all close pairs (s < 0.2)', pairs=npairs, density=emp.tolist(), l2_to_palm2=0.0, stat_err=float(np.sqrt(1 / (npairs * 0.1))),
          deficit_6=float(((1 - emp) * 0.1).sum()))], close_fraction=npairs / ngap, small_gap_exponent=float(np.log(npairs / max(nclose5, 1)) / np.log(4))), open('out/t4_cue_%d.json' % n, 'w'))
print('pairs', npairs, 'close fraction', npairs / ngap, 'exponent', np.log(npairs / max(nclose5, 1)) / np.log(4))
