"""Class phases (Lemma 3 of RESULT.md).  For coprime squarefree primary c, c' and h = unit * lambda^i * 2^j the phase of the
frequency-h term is  chi_c(c') conj(chi_c'(c)) conj(chi_c(h)) chi_c'(-h).  Claim: it equals 1 whenever c = c' mod F for a
fixed modulus F supported on {2, lambda}.  Find the smallest F in a list for which this holds on all sampled pairs."""
import numpy as np, lib7
D = lib7.build(6000); pl, S, qc, inc = D['pl'], D['S'], D['qc'], D['inc']
el = []
for r in range(len(qc)):
    e = (1, 0)
    for j in np.nonzero(inc[r])[0]: e = lib7.emul(e, (pl[j].a, pl[j].b))
    el.append(e)
el = np.array(el, dtype=np.int64)
E = np.rint(inc @ S.astype(np.float32) @ inc.T).astype(np.int64) % 6
cop = ~((inc @ inc.T) > 0.5)
hs = []
for k in range(6):
    for i in range(0, 7):
        for j in range(0, 7):
            hs.append(lib7.emul(lib7.emul(lib7.epow((1, 1), k), lib7.epow((1, 2), i)), (2 ** j, 0)))
hu = np.array([h[0] for h in hs], dtype=np.int64); hv = np.array([h[1] for h in hs], dtype=np.int64)
T, Zm = lib7.sym_table(pl, hu, hv); eh = np.rint(inc @ T).astype(np.int64) % 6            # exponent of chi_c(h)
T, Zm = lib7.sym_table(pl, -hu, -hv); emh = np.rint(inc @ T).astype(np.int64) % 6          # exponent of chi_c(-h)
for F in (3, 4, 6, 9, 12, 18, 24, 36, 72):
    key = (el[:, 0] % F) * F + (el[:, 1] % F)
    bad = 0; tot = 0; ncl = len(set(key.tolist()))
    for kv in set(key.tolist()):
        idx = np.nonzero(key == kv)[0]
        if len(idx) < 2: continue
        sub = (E[np.ix_(idx, idx)] - E[np.ix_(idx, idx)].T) % 6
        c = cop[np.ix_(idx, idx)]
        for t in range(len(hs)):
            ph = (sub - eh[idx, t][:, None] + emh[idx, t][None, :]) % 6
            bad += int(np.sum((ph != 0) & c)); tot += int(np.sum(c))
    print('F = %2d  classes hit %4d  pair-frequency phases tested %9d  not equal to 1: %d' % (F, ncl, tot, bad))
