import json, glob, math, os, sys
D = sys.argv[1] if len(sys.argv) > 1 else 'out'
print('== spectrum (FFT-Mellin) ==')
for f in sorted(glob.glob(f'{D}/spec_*.json')):
    r = json.load(open(f)); v = r['values']; res = r['res']
    conv = [abs(x) for x, e in zip(v, res) if e < 1e-6]
    s3 = sum(abs(x) ** 3 for x in conv)
    print(f"{r['config']:24s} d={r['delta']:g} {r['kind'][:5]} top: " + ' '.join(f'{x:+.7f}' for x in v[:6]) + f" | 1-|l0|={1-abs(v[0]):.3e} | max|l|={max(abs(x) for x in v):.7f} | n_conv={len(conv)} sum|l|^3(conv)={s3:.4f} | |l|[8..15]: " + ' '.join(f'{abs(x):.4f}' for x in v[8:16]))
print('== symbol ==')
for f in sorted(glob.glob(f'{D}/symbol_*.json')):
    r = json.load(open(f))
    print(f"{r['name']:5s} p={r['p']} Lhat(0)={r['L0']:+.6f} min[0,60]={r['minL']:+.6f} at t={r['argmin']:.2f} (2theta'={r['tth0']:.4f}, 2ReL'/L={r['ld0']:+.4f}, deltahat(0)={r['hat0']:.4f})")
print('== cusp single prime ==')
for f in sorted(glob.glob(f'{D}/cusp_p*.json')):
    for r in json.load(open(f)):
        print(f"{r['name']:5s} p={r['p']} k={r['k']} f_aitken={r['f_aitken']:.9f} law={r['law']:.9f} dev={r['dev']:+.2e} pred={r['pred_alpha']:.9f} devpred={r['dev_pred']:+.2e} incS={r['incS_last']:+.3e}")
print('== cusp23 ==')
if os.path.exists(f'{D}/cusp23.json'):
    rows = json.load(open(f'{D}/cusp23.json'))
    for tag in sorted(set(r['tag'] for r in rows)):
        rr = [r for r in rows if r['tag'] == tag]
        print(f"{tag:12s} units={len(rr)} max|dev log^2-coeff|={max(abs(r['dev']) for r in rr):.2e} mean|dev|={sum(abs(r['dev']) for r in rr)/len(rr):.2e} max|dev naive|={max(abs(r['dev_naive']) for r in rr):.2e} mean|dev naive|={sum(abs(r['dev_naive']) for r in rr)/len(rr):.2e}")
print('== pencil ==')
for f in sorted(glob.glob(f'{D}/pencil_*.json')):
    print(f)
    for r in json.load(open(f)):
        print('  ', json.dumps({k: (round(v, 7) if isinstance(v, float) else v) for k, v in r.items()}))
