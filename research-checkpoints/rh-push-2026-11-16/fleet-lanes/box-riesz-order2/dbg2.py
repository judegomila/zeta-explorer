import flint, numpy as np, math, hsweep, hsearch
from flint import fmpz_mat
print('flint', flint.__version__)
A = fmpz_mat([[1000, 0, 0], [0, 1000, 0], [333, 777, 5]])
R = A.lll(); print(type(R), R.tolist() if hasattr(R, 'tolist') else R)
seed, back = hsweep.seed_for(2, 400, 'liou'); print(seed[0])
print(list(hsearch.candidates(2.0, 400, seed, [0.03], [0.0], sig_back=0.0))[:1])
