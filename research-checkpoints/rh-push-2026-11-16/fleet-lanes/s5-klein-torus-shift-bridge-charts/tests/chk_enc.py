import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from flint import acb, arb, ctx
import objs
ctx.prec = 4064
z = (acb('0.3', '7.1')).exp() / 3
e = objs.enc(z)
ctx.prec = 4000
d = objs.dec(e)
ctx.prec = 4200
print('roundtrip rel err', (abs(d - z) / abs(z)).str(5), 'mantissa bits', e[0].bit_length(), 'exp', e[1])
print(type(z.real.mid().man_exp()[0]))
x = arb(e[0]); print('arb(int) exact?', (x - arb(str(e[0]))).str(5))
