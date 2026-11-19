import sys, json, math
import numpy as np
def load(out):
    L = open(out).read().split('\n')
    h = L[0].split(); info = {h[i]: int(h[i+1]) for i in range(0, len(h), 2)}
    Na2 = np.array(L[1].split()[1:], float); NA02 = np.array(L[2].split()[1:], float)
    res = []
    for line in L[3:]:
        t = line.split()
        if not t: continue
        d = {'I': complex(float(t[3]), float(t[4])), 'RP2': float(t[6]), 'XB': complex(float(t[8]), float(t[9]))}
        Is = []; NB = []
        k = 10
        for s in range(4):
            Is.append(complex(float(t[k+1]), float(t[k+2]))); NB.append(float(t[k+4])); k += 5
        d['Is'] = Is; d['NB2'] = np.array(NB); res.append(d)
    return info, Na2, NA02, res
if __name__ == '__main__':
    for Zs in sys.argv[1:]:
        info, Na2, NA02, res = load(f'data/out_{Zs}.txt'); side = json.load(open(f'data/in_{Zs}.bin.side.json'))
        Z = side['Z']; cS = side['cS']; Q = 12 * Z
        print(f"Z={Z} rows={info['rows']} Na2={Na2.sum():.4g} Q*NA02/(Q/Y)={Q*NA02.sum()/(Q/side['Y']):.4g}")
        for w, d in enumerate(res):
            f = complex(*side['f'][w]) * cS; P = complex(*side['P'][w])
            cs = sum(math.sqrt(Na2[s] * d['NB2'][s]) for s in range(4))
            print(f"  {side['weights'][w]:5s} I={d['I'].real:+.5f}{d['I'].imag:+.5f}i  cS f={f.real:+.5f}{f.imag:+.5f}i P={P.real:+.5f}{P.imag:+.5f}i  |I|/CS={abs(d['I'])/cs:.4f} CS={cs:.4f} RP={math.sqrt(d['RP2']):.4f} NB2/Z={d['NB2'].sum()/Z:.4f} M={side['mertens'][w]:+.3f}")
