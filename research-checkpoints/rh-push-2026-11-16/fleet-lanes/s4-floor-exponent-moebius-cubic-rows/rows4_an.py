# analysis of rows4 output: restricted fourth moment of the central block on the class of the k = ceil(rows^R) rows
# with the largest |S_{m*}| (plain witness at block m*); omega = -log(share)/log(rows).
import sys, json, math
import numpy as np
RC = 0.590332; import os
NW = int(os.environ.get('NW', 5)); NAMES = ['TRUE', 'SGN', 'LIOU', 'THIN', 'DEL', 'IID'][:NW]
def load(fn):
    with open(fn, 'rb') as f:
        n = int(np.frombuffer(f.read(8), np.int64)[0]); d = np.frombuffer(f.read(), np.dtype([('p', np.int32), ('r', np.int32), ('v', np.float32, 4*NW)]))
    assert len(d) == n; return d
def analyse(fn):
    d = load(fn); n = len(d); k = int(math.ceil(n**RC)); v = d['v'].astype(np.float64); rec = dict(rows=n, k=k, omega_random=1 - math.log(k)/math.log(n), w={})
    rng = np.random.default_rng(1)
    for w, nm in enumerate(NAMES):
        sm = v[:, 4*w]**2 + v[:, 4*w+1]**2; sh = v[:, 4*w+2]**2 + v[:, 4*w+3]**2; T = sh**2
        top = np.argpartition(-sm, k)[:k]; share = T[top].sum()/T.sum()
        selfs = np.sort(T)[-k:].sum()/T.sum()
        # null: classes of size k drawn at random, 200 draws
        nul = np.array([T[rng.choice(n, k, replace=False)].sum() for _ in range(200)])/T.sum()
        cor = float(np.corrcoef(np.log(sm + 1e-300), np.log(sh + 1e-300))[0, 1])
        rec['w'][nm] = dict(omega=-math.log(share)/math.log(n), share=share, omega_self=-math.log(selfs)/math.log(n),
                            omega_null_mean=float(-np.log(nul).mean()/math.log(n)), omega_null_sd=float(np.log(nul).std()/math.log(n)),
                            ln_share=float(math.log(share)), top_mean_sh_ratio=float(sh[top].mean()/sh.mean()), mean_sm=float(sm.mean()), mean_sh=float(sh.mean()), mean_T=float(T.mean()), max_sm=float(sm.max()), corr_log=cor,
                            kurt_half=float(T.mean()/sh.mean()**2))
    # class defined by the TRUE score, target from each control (and reverse): overlap of classes
    smT = v[:, 0]**2 + v[:, 1]**2; topT = set(np.argpartition(-smT, k)[:k].tolist())
    for w, nm in enumerate(NAMES):
        sm = v[:, 4*w]**2 + v[:, 4*w+1]**2; rec['w'][nm]['class_overlap_with_TRUE'] = len(topT & set(np.argpartition(-sm, k)[:k].tolist()))/k
    return rec
if __name__ == '__main__':
    out = {}
    for fn in sys.argv[2:]:
        r = analyse(fn); out[fn] = r
        print(fn, 'rows', r['rows'], 'k', r['k'], 'random %.4f' % r['omega_random'])
        for nm in NAMES:
            x = r['w'][nm]; print('   %-5s omega %.4f  null %.4f (sd %.4f)  self %.4f  corr %.3f  mean|S_m*|^2 %.4f mean|S_h|^2 %.4f kurt %.3f overlap %.3f' % (nm, x['omega'], x['omega_null_mean'], x['omega_null_sd'], x['omega_self'], x['corr_log'], x['mean_sm'], x['mean_sh'], x['kurt_half'], x['class_overlap_with_TRUE']))
    json.dump(out, open(sys.argv[1], 'w'), indent=1)
