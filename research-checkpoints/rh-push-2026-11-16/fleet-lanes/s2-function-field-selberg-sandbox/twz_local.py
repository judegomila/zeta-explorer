"""twz_local.py a b R step out.json : single-process version of twzeros.py with K = 30 (local validation run)."""
import sys, json, math, warnings
warnings.simplefilter('ignore')
import twzeros as tz
rs = [tz.step * (i + 1) for i in range(int(tz.R / tz.step))]
vals = [tz.Zh(r, K=30) for r in rs]
zeros = []
for (r0, v0, i0), (r1, v1, i1) in zip(vals, vals[1:]):
    if v0 * v1 < 0:
        lo, hi, flo = r0, r1, v0
        for _ in range(34):
            mid = (lo + hi) / 2; fm = tz.Zh(mid, K=30)[1]
            if fm * flo < 0: hi = mid
            else: lo, flo = mid, fm
        zeros.append((lo + hi) / 2)
imrat = max(abs(i) / (abs(v) + abs(i) + 1e-300) for r, v, i in vals)
json.dump(dict(a=tz.a, b=tz.b, R=tz.R, step=tz.step, logc=tz.logc, zeros=zeros, max_im_ratio=imrat, vals=vals), open(sys.argv[5], 'w'))
print('zeros', len(zeros), zeros, 'max Im/|.|', imrat, flush=True)
