import mpmath as mp, json, sys
mp.mp.dps = 20
N = int(sys.argv[1])
z = [float(mp.zetazero(n).imag) for n in range(1, N + 1)]
json.dump(z, open(sys.argv[2], 'w'))
print(N, z[-1])
