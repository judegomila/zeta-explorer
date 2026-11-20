"""Combination 3, case (b): environment sum of adjacent on-line pairs with the off-line zeros included.
S_full = S_on + sum over off-line pairs of 2 Re 1/((a - w)(b - w)), w = gamma_k - i x_k (ordinate coordinates t, zeros of F(1/2 + i t)).
A term is negative only when the pair sits within about x_k of the gap. Records every adjacent on-line pair with S_full < 0, its distance to the
nearest off-line pair in mean spacings, and the first index.  Usage: c3_full.py OBJ OUT.json   (DH | TNR-<q>-<c>, lists as in c1_flow.py)"""
import sys, os, json, math, numpy as np, hl
obj, out = sys.argv[1], sys.argv[2]
if obj == 'DH':
    d = np.load(os.environ.get('RH_DH', '../s3-heat-zero-velocity-channels/data/DH.npz')); on = d['on']; ox = np.abs(d['offx']); og = d['offg']; Q = 5.0
else:
    _, q, c = obj.split('-'); q = float(q); c = float(c)
    fn = os.environ.get('RH_ZETA', '../s1-zero-flow-dynamics/data/zeta_1e7.npy'); g = np.load(fn, mmap_mode='r'); on = np.array(g[:np.searchsorted(g, 1e5)])
    og = (2 * np.arange(0, int(1e5 * math.log(q) / (2 * math.pi)) + 2) + 1) * math.pi / math.log(q); og = og[og < 1e5]; ox = np.full(len(og), math.acosh(c / 2) / math.log(q)); Q = q * q
J = int(sys.argv[3]) if len(sys.argv) > 3 else 200; n = len(on)
S = hl.pair_S(on, J); i0, i1 = J, n - 1 - J
a = on[i0:i1]; b = on[i0 + 1:i1 + 1]
dens_on = (2 * J + 1) / (on[i0 + J + 1:i1 + J + 1] - on[i0 - J:i1 - J])          # local density of the on-line list
Son = S[i0:i1] + 2 * dens_on ** 2 / (J + 0.5)
w = og - 1j * ox
Soff = np.zeros(len(a)); near = np.empty(len(a)); nearx = np.empty(len(a))
hl.log('%s: %d adjacent pairs x %d off-line pairs, chunks of 2e7 complex (0.3 GB)' % (obj, len(a), len(w)))
CH = max(1, int(2e7 // len(w)))
for s in range(0, len(a), CH):
    A = a[s:s + CH, None]; Bb = b[s:s + CH, None]
    Soff[s:s + CH] = (2 * (1 / ((A - w[None, :]) * (Bb - w[None, :]))).real).sum(1)
    mid = 0.5 * (a[s:s + CH] + b[s:s + CH]); k = np.clip(np.searchsorted(og, mid), 1, len(og) - 1)
    k = np.where(np.abs(og[k - 1] - mid) < np.abs(og[k] - mid), k - 1, k)
    near[s:s + CH] = np.abs(og[k] - mid); nearx[s:s + CH] = ox[k]
Sf = Son + Soff
neg = np.nonzero(Sf < 0)[0]
dtot = hl.rho_gamma(0.5 * (a + b), Q)
nsp = near * dtot                                 # distance to the nearest off-line pair in mean spacings of all zeros
first_off_index = int(np.searchsorted(on, og.min()))
res = dict(obj=obj, adjacent_pairs=int(len(a)), offline_pairs=int(len(w)), first_offline_height=float(og.min()), index_of_first_offline_pair=first_off_index,
           S_on_negative=int((Son < 0).sum()), S_full_negative=int(len(neg)), first_index_S_full_negative=int(neg[0] + i0) if len(neg) else None,
           first_height_S_full_negative=float(a[neg[0]]) if len(neg) else None,
           negative_distance_to_nearest_pair_in_mean_spacings=[float(v) for v in np.quantile(nsp[neg], [0, 0.5, 0.9, 1.0])] if len(neg) else None,
           negative_distance_over_displacement=[float(v) for v in np.quantile((near / nearx)[neg], [0, 0.5, 0.9, 1.0])] if len(neg) else None,
           n_negative_farther_than_10_spacings=int((nsp[neg] > 10).sum()), n_negative_farther_than_1_spacing=int((nsp[neg] > 1).sum()),
           gate_full=dict(frac_gt_0p909=float(((Sf * (b - a) ** 2) > 0.909).mean()), frac_on_gt_0p909=float(((Son * (b - a) ** 2) > 0.909).mean())),
           rel_change_far=[float(v) for v in np.quantile(np.abs(Soff / Son)[nsp > 10], [0.5, 0.99, 1.0])] if (nsp > 10).any() else None,
           note_index_window='pairs with index below J=%d are not evaluated (neighbour window)' % J)
hl.jdump(res, out); print(json.dumps(res, indent=0))
