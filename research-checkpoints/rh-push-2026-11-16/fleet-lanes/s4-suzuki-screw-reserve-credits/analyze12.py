"""summaries for combinations 1 and 2 from sweep output (<prefix>.bins.txt, .first.txt, .totals.txt)."""
import sys, json, math, collections
import numpy as np
pref = sys.argv[1]; N = float(sys.argv[2]); out = sys.argv[3] if len(sys.argv) > 3 else None
BINW = 0.05
rows = collections.defaultdict(list)
for ln in open(pref + '.bins.txt'):
    if ln.startswith('#'): continue
    a = ln.split(); rows[a[0]].append([float(x) for x in a[1:]])
first = {}
for ln in open(pref + '.first.txt'):
    a = ln.split(); first[a[0]] = {kv.split('=')[0]: int(kv.split('=')[1]) for kv in a[1:]}
band = json.load(open('pred1.json'))['band']
res = dict(N=N, comb1={}, comb2={})
print('--- combination 1: box functional at every prime-power event, q <= %.3g' % N)
for o, rr in rows.items():
    if o == 'zeta_tilde': continue
    A = np.array(rr); ev = A[A[:, 2] > 0]
    nev = int(ev[:, 2].sum()); nneg = int(ev[:, 3].sum())
    i = int(np.argmin(A[:, 4])); j = int(np.argmax(A[:, 5]))
    R = A[A[:, 7] < 1e299]
    rec = dict(events=nev, negative_events=nneg, first_negative_q=(first[o]['firstneg_psi'] if first[o]['firstneg_psi'] > 0 else None),
               min_psi=float(A[i, 4]), min_psi_r_bin=float(A[i, 1]), max_psi=float(A[j, 5]), max_psi_r_bin=float(A[j, 1]),
               min_R_low=(float(R[:, 7].min()) if len(R) else None), R_low_negative_events=int(A[:, 8].sum()),
               first_R_low_negative_q=(first[o]['firstneg_Rlow'] if first[o]['firstneg_Rlow'] > 0 else None), last_bin_r=float(ev[-1, 1]) if len(ev) else None)
    if o in band:
        rec['band'] = band[o]; rec['within_band'] = bool(rec['min_psi'] >= 0 and rec['max_psi'] <= band[o][1])
        # first bin where the kink maximum exceeds the band
    res['comb1'][o] = rec
    fq = rec['first_negative_q']
    print('%-11s events %12d  neg %10d  first neg q %-12s (log q %s)  min Psi %+.6e @r~%.2f  max Psi %+.6e  min R_low %s  band %s' % (
        o, nev, nneg, fq, ('%.3f' % math.log(fq)) if fq else '-', rec['min_psi'], rec['min_psi_r_bin'], rec['max_psi'],
        ('%+.6e' % rec['min_R_low']) if rec['min_R_low'] is not None else '-', rec.get('within_band', '')))
print('--- combination 2: credit variation  V(X) = sum_{X <= p_n <= N} |c_{n+1} - c_n|   (bound (23 L + 34)/sqrt X proved for L >= 512)')
TW = 2/math.e
for o in ('zeta_tilde', 'zeta', 'TNR3_2.2', 'TNR3_2.01', 'flip10'):
    if o not in rows: continue
    A = np.array(rr := rows[o]); rl = A[:, 1]; var = A[:, 12]; sumc = A[:, 9]; sumd = A[:, 10]; sabs = A[:, 11]
    tail = np.cumsum(var[::-1])[::-1]
    tab = []
    for L in (4.0, 6.0, 8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0):
        k = np.nonzero(np.abs(rl - L) < 1e-9)[0]
        if not len(k) or L > math.log(N) - 0.5: continue
        V = float(tail[k[0]]); X = math.exp(L)
        LN = math.log(N); rem = TW*(2*LN + 4)/math.sqrt(N)        # model remainder beyond N (gap model E|g/log p - 1| = 2/e)
        tab.append(dict(L=L, V=V, V_sqrtX_over_L=V*math.sqrt(X)/L, bound=(23*L + 34)/math.sqrt(X), ratio_to_bound=V/((23*L + 34)/math.sqrt(X)),
                        model=TW*(2*L + 4)/math.sqrt(X) - rem, ratio_to_model=V/(TW*(2*L + 4)/math.sqrt(X) - rem)))
    res['comb2'][o] = dict(table=tab, sum_c=float(sumc.sum()), sum_d=float(sumd.sum()), sum_abs_c_primes=float(sabs.sum()), total_variation=float(var.sum()))
    print('%-10s  sum c = %+.6f  sum d = %.6f  sum |c_p| = %.4f  total variation = %.6g' % (o, sumc.sum(), sumd.sum(), sabs.sum(), var.sum()))
    for t in tab: print('    L=%4.1f  V=%.6e  V sqrtX/L=%8.4f  V/bound=%.5f  V/model=%.4f' % (t['L'], t['V'], t['V_sqrtX_over_L'], t['ratio_to_bound'], t['ratio_to_model']))
if out: json.dump(res, open(out, 'w'), indent=1)
