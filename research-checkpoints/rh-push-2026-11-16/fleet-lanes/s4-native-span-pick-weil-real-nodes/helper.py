"""helper: cooperates on one value set through the per-node cache (lib2.values, RH_SHARED). usage: helper.py code family n bits"""
import sys, os
from multiprocessing import Pool
import lib2
if __name__ == '__main__':
    os.environ['RH_SHARED'] = '1'; os.environ['RH_REVERSE'] = '1'
    with Pool(int(os.environ.get('RH_WORKERS', '2'))) as pool:
        lib2.values(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), pool)
    print('DONE helper')
