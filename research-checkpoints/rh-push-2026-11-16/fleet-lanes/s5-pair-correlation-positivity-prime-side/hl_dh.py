"""Combination 3 for Davenport-Heilbronn: C_2(h; X) = sum_{n<=X} c(n) c(n+h), 0 <= h <= 10000, c = coefficients of -F'/F (all integers; psnu.dh_coeffs).
FFT cross-correlation by blocks; checkpoints X = 10^(j/4).  Also sum c(n), sum c(n)^2 and max |c(n)| up to X.  Usage: hl_dh.py C.npy OUT.json"""
import sys, json, math, numpy as np
H = 10000; NF = 1 << 22; SEG = NF - H - 8
def main(fn, out):
    c = np.load(fn, mmap_mode='r'); X = len(c) - 1
    cps = sorted(set(int(round(10 ** (j / 4.0) / SEG)) * SEG for j in range(16, 33) if 10 ** (j / 4.0) <= X * 1.001 and round(10 ** (j / 4.0) / SEG) >= 1))
    acc = np.zeros(H + 1); rows = []; s1 = 0.0; mx = 0.0
    for b in range(0, cps[-1] // SEG):
        a = np.asarray(c[b * SEG + 1: b * SEG + 1 + SEG + H + 8]).astype(np.float64)
        if len(a) < SEG + H + 8: a = np.concatenate([a, np.zeros(SEG + H + 8 - len(a))])
        fa = np.conj(np.fft.rfft(a[:SEG], n=NF)); fb = np.fft.rfft(a, n=NF)
        acc += np.fft.irfft(fa * fb, n=NF)[:H + 1]; s1 += float(a[:SEG].sum()); mx = max(mx, float(np.max(np.abs(a[:SEG]))))
        x = (b + 1) * SEG
        if x in cps:
            h = acc[1:]
            rows.append(dict(X=x, sum_c=s1, sum_c2=float(acc[0]), max_abs_c=mx, C2_mean_over_h=float(h.mean()), C2_rms_over_h=float(np.sqrt(np.mean(h * h))), C2_std_over_h=float(h.std()),
                             C2_h=[float(acc[k]) for k in (1, 2, 5, 6, 10, 30, 210, 1000, 9999, 10000)], corr_h1_h2=None))
            print(json.dumps(rows[-1]), flush=True)
    lx = np.log([r['X'] for r in rows])
    fit = dict(exp_sum_c2=float(np.polyfit(lx, np.log([r['sum_c2'] for r in rows]), 1)[0]), exp_C2_rms=float(np.polyfit(lx, np.log([r['C2_rms_over_h'] for r in rows]), 1)[0]),
               exp_abs_sum_c=float(np.polyfit(lx, np.log(np.abs([r['sum_c'] for r in rows])), 1)[0]), exp_max_abs_c=float(np.polyfit(lx, np.log([r['max_abs_c'] for r in rows]), 1)[0]))
    print(json.dumps(fit)); json.dump(dict(rows=rows, fit=fit, hs=[1, 2, 5, 6, 10, 30, 210, 1000, 9999, 10000]), open(out, 'w'), indent=1)
if __name__ == '__main__': main(sys.argv[1], sys.argv[2])
