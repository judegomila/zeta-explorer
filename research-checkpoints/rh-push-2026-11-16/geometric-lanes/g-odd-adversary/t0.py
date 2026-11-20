from lib import *
ctx.prec=200
print(jet_xi(arb(0)+arb("1e-30")))
print(jet_xi(arb("14.134725141734693790457251983562")))
print(jet_dh(arb(1)))
import flint
# dh off-line zero check: Lambda at s=0.808517+85.699348i -> small
