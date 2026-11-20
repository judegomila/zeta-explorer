import json, mpmath, os
from multiprocessing import Pool
mpmath.mp.dps = 30
def z(n):
    mpmath.mp.dps = 30
    return mpmath.nstr(mpmath.zetazero(n).imag, 28)
if __name__ == '__main__':
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as p:
        out = p.map(z, range(1, 650))
    assert float(out[-1]) < 1000
    json.dump(out, open('zeros.json', 'w'))
    print('zeros', len(out), out[0], out[-1])
