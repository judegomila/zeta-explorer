import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from twin2 import addtw, movetw, first_fail
cases = [(float(c.split(':')[0]), float(c.split(':')[1])) for c in sys.argv[4].split(',')]
for g,d in cases:
    print(sys.argv[5] if len(sys.argv)>5 else "add","g=%.6g d=%g  N*=%s"%(g,d,first_fail(addtw(g,d),sys.argv[1],sys.argv[2],int(sys.argv[3].split('-')[0]),int(sys.argv[3].split('-')[1]))), flush=True)
