# Test 1b: zeros of averaged brackets in the strip by cell winding numbers on the grid, refined by Newton (flint).
import numpy as np, flint, json, math
from hlib import *
import sys
mode = sys.argv[1]
gA, gB, gC = np.load('gridA.npz'), np.load('gridB.npz'), np.load('gridC.npz')
Ds = [int(d) for d in gA['Ds']]
if mode == 'fine':      # 0.5 <= Re s <= 1.0, cells 0.025 x 0.05
    sig = np.concatenate([gA['sig'], gB['sig']]); ts = gA['ts']; Lv = np.concatenate([gA['L'], gB['L']], axis=1)
else:                   # 0.5 <= Re s <= 3.0, t-step 0.1
    sig = np.concatenate([gA['sig'], gB['sig'], gC['sig']]); ts = gC['ts']
    Lv = np.concatenate([gA['L'][:, :, ::2], gB['L'][:, :, ::2], gC['L']], axis=1)
MIN = json.load(open('t2_ratio.json'))
S = sig[:, None] + 1j * ts[None, :]
hD = {D: class_number(D) for D in Ds}

def weights(name, X):
    w = {}
    for D in Ds:
        if -D > X: continue
        if name == 'trace': w[D] = 1.0                       # sum_Q (2/w_Q) E(tau_Q,s): u = 1
        elif name == 'classsum': w[D] = wD(D) / 2.0           # sum_Q E(tau_Q,s): u = w/2
        elif name == 'cesaro': w[D] = 1.0 + D / (X + 1.0)
        elif name == 'perclass': w[D] = 1.0 / hD[D]           # average over the class group (Duke measure)
        elif name == 'plain': w[D] = 1.0                      # sum_D L(s,chi_D), no (sqrt|D|/2)^s factor
        elif name == 'minimiser':                             # NB-ratio minimiser of the span |D|<=X (T=100 Gram)
            r = [r for r in MIN['results']['100'] if r.get('X') == X and r.get('cut') == 1e-11][0]
            idx = [d for d in MIN['Ds'] if -d <= X]
            return dict(zip(idx, r['c']))
        elif name == 'deg0':                                  # trace, with c_{-3} fixed so that B(1) = 0
            w[D] = 1.0
    if name == 'deg0':
        tot = sum(math.sqrt(-D) / 2 * 2 * math.pi * hD[D] / (wD(D) * math.sqrt(-D)) for D in w if D != -3)
        w[-3] = -tot / (math.sqrt(3) / 2 * 2 * math.pi / (6 * math.sqrt(3)))
    return w

def grid_val(name, w):
    B = np.zeros(S.shape, dtype=complex)
    for k, D in enumerate(Ds):
        if D in w:
            B += w[D] * (Lv[k] if name == 'plain' else (math.sqrt(-D) / 2) ** S * Lv[k])
    return B

def fl_val(name, w, s):
    tot = flint.acb(0)
    for D, c in w.items():
        f = chi(D).l(s)
        if name != 'plain': f = f * (flint.acb(math.sqrt(-D) / 2) ** s)
        tot += c * f
    return tot

def cells(B):
    ph = np.angle(B)
    def d(a, b):
        x = b - a
        return (x + np.pi) % (2 * np.pi) - np.pi
    e1 = d(ph[:-1, :-1], ph[1:, :-1]); e2 = d(ph[1:, :-1], ph[1:, 1:]); e3 = d(ph[1:, 1:], ph[:-1, 1:]); e4 = d(ph[:-1, 1:], ph[:-1, :-1])
    W = np.rint((e1 + e2 + e3 + e4) / (2 * np.pi)).astype(int)
    mx = np.maximum.reduce([abs(e1), abs(e2), abs(e3), abs(e4)])
    return W, mx

def newton(name, w, s0):
    s = flint.acb(s0.real, s0.imag); h = 1e-7
    for it in range(60):
        f = fl_val(name, w, s); fp = (fl_val(name, w, s + h) - fl_val(name, w, s - h)) / (2 * h)
        ds = f / fp
        s = flint.acb(complex(s) - complex(ds))
        if abs(complex(ds)) < 1e-12: break
    return complex(s), abs(complex(fl_val(name, w, s)))

out = {}
for name in ['trace', 'classsum', 'perclass', 'cesaro', 'deg0', 'minimiser', 'plain']:
    for X in ([60, 100, 200] if name == 'minimiser' else [50, 100, 200]):
        w = weights(name, X); B = grid_val(name, w); W, mx = cells(B)
        zs = []
        for i, j in zip(*np.nonzero(W)):
            s0 = complex((sig[i] + sig[i + 1]) / 2, (ts[j] + ts[j + 1]) / 2)
            z, res = newton(name, w, s0)
            inside = sig[i] - 1e-9 <= z.real <= sig[i + 1] + 1e-9 and ts[j] - 1e-9 <= z.imag <= ts[j + 1] + 1e-9
            zs.append(dict(cell=[float(sig[i]), float(ts[j])], wind=int(W[i, j]), root=[z.real, z.imag], resid=res, in_cell=bool(inside)))
        for z in zs:
            if z['cell'][0] < 1.0 - 1e-9: print('      root %.8f + %.8f i  resid %.1e  in_cell %s' % (z['root'][0], z['root'][1], z['resid'], z['in_cell']))
        nin = sum(1 for z in zs if z['cell'][0] < 1.0 - 1e-9)
        nline = None
        # sign changes / minima on Re s = 1/2 are not counted by cells; report min |B| on the line
        out[f'{name}_X{X}'] = dict(n_D=len(w), zeros_strip_half_to_1=nin, zeros_1_to_3=len(zs) - nin,
                                   max_edge_phase=float(mx.max()), frac_edges_gt_2=float((mx > 2).mean()), zeros=zs)
        print(name, X, 'n_D', len(w), 'zeros 1/2<Re<1:', nin, ' 1<Re<3:', len(zs) - nin, ' maxedge', round(float(mx.max()), 3),
              'not-in-cell', sum(1 for z in zs if not z['in_cell']), flush=True)
json.dump(out, open(f't1_zeros_{mode}.json', 'w'), indent=1)
