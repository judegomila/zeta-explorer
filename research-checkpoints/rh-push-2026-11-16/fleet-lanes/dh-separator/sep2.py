# Q1 at the DH zero with beta>7/8 (flint, 260 bits, central-difference derivative, MEASURED)
import os, importlib.util
d=os.path.dirname(os.path.abspath(__file__))
spec=importlib.util.spec_from_file_location("dhf", os.path.join(d,"dhf.py")); dhf=importlib.util.module_from_spec(spec); spec.loader.exec_module(dhf)
from flint import acb, arb, ctx
ctx.prec=260
h=acb(arb(10)**(-25))
def L_dh(z):
    s=z+acb(0.5); fp=(dhf.f(s+h)-dhf.f(s-h))/(2*h)
    return (arb(5)/arb.pi()).log()/2 + ((s+1)/2).digamma()/2 + fp/dhf.f(s)
def L_z(z):
    s=z+acb(0.5); zp=((s+h).zeta()-(s-h).zeta())/(2*h)
    return 1/s+1/(s-1)-arb.pi().log()/2+(s/2).digamma()/2+zp/s.zeta()
g=arb("2442.530292468486031456"); dl=arb("0.3977501549770109638493")
print("centred DH zero w1 = 0.39775015497701 + 2442.53029246848603 i   (beta = 0.89775 > 7/8 = 0.875 > 0.874887)")
print("%8s %16s %16s"%("x","Q1_DH","Q1_zeta"))
for x in ["0.375","0.38","0.39","0.395","0.3975","0.40","0.45","0.5"]:
    z=acb(arb(x),g); a=L_dh(z); b=L_z(z)
    print("%8s %16s %16s"%(x, (a.real/arb(x)).str(8,radius=False), (b.real/arb(x)).str(8,radius=False)))
print("height profile at x=0.375, lens half-width sqrt(d^2-x^2)=", (dl*dl-arb("0.375")**2).sqrt().str(6,radius=False))
for dt in ["-0.2","-0.14","-0.12","-0.05","0","0.05","0.12","0.14","0.2"]:
    z=acb(arb("0.375"),g+arb(dt)); print("  dt=%6s  Q1_DH=%s"%(dt,(L_dh(z).real/arb("0.375")).str(8,radius=False)))
