import sys, time
from flint import acb, arb, ctx
import flib
ctx.prec = 200
# 1. evenness and reality
for nm, o in flib.OBJ.items():
    z = acb('0.3', '7.7')
    a = o.taylor(z, 3); b = o.taylor(-z, 3)
    print(nm, 'even:', float(abs(a[0] - b[0]).mid() / abs(a[0]).mid()), 'odd F\':', float(abs(a[1] + b[1]).mid() / abs(a[1]).mid()),
          'Im F(it)/|F|:', float(abs(o.taylor(acb(0, 9.1), 1)[0].imag).mid() / abs(o.taylor(acb(0, 9.1), 1)[0]).mid()))
# 2. kernel transform against closed form (known answer)
for nm in ['ZETA', 'CHI4', 'DH', 'EA', 'TNR']:
    eta = '0.05' if nm != 'TNR' else None
    if nm == 'TNR':
        import math
        eta_f = 2 * math.log(3) / 44; K = flib.Kernel(nm, arb(3).log() * 2 / 44, 50, tnr=(3, '2.2'))
    elif nm == 'EA': K = flib.Kernel(nm, arb('0.05'), 50, ea='0.25')
    else: K = flib.Kernel(nm, arb('0.05'), 50)
    for z in [acb('0.25', '0'), acb('0.1', '14.5'), acb(0, 30)]:
        v = K.F(z); w = flib.OBJ[nm].taylor(z, 1)[0]
        r = v / w
        print(nm, 'kernel/closed at', complex(z), complex(r))
# 3. heat object at tau=0 against xi, and off-line zero of tau=-0.5 from the battery table
H0 = flib.HeatObj('0', arb('0.02'), 80)
z = acb('0.2', '40.3'); print('heat tau=0 / xi', complex(H0.taylor(z, 1)[0] / flib.OBJ['ZETA'].taylor(z, 1)[0]),
      complex(H0.taylor(z, 2)[1] / flib.OBJ['ZETA'].taylor(z, 2)[1]), complex(H0.taylor(z, 3)[2] / flib.OBJ['ZETA'].taylor(z, 3)[2]))
ctx.prec = 400
H = flib.HeatObj('-0.5', arb('0.02'), 100)
z = acb('0.24295650648697380586214604183827', '111.69422767246391911622741040108')
f = H.taylor(z, 2); print('heat -0.5 at table zero: |F/F\'| =', float(abs(f[0] / f[1]).mid()))
ctx.prec = 200
z = acb('0.30851718245663738555335196060684', '85.699348485377592171929267708942')
f = flib.OBJ['DH'].taylor(z, 2); print('DH at table zero: |F/F\'| =', float(abs(f[0] / f[1]).mid()))
