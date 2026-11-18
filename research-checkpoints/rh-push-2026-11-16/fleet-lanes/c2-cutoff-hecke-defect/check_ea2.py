import sys; sys.argv=['x','--dps','60','--kernel','ea2','--a','0.2']
exec(open('defect_gram.py').read().split("primes = [p for p")[0])
k1=make_kernel('ea')
for x in ['0.4','1.3']: print(x, kap(arb(x)).str(35), k1(arb(x)).str(12))
