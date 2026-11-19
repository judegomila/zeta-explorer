import item4_ST_lib as L
from flint import acb, arb, ctx
F5=L.Fam(5,[2,3])
ctx.prec=300
z=acb(arb('0.5102208213939666302655'),arb('77.2289925269322087901733'))
print("w0 at lane value:",F5.w0(z).str(10)," N:",F5.N(z).str(10))
ok=L.certify(F5,z,"q=5 pair")
# second, independent zero for q=5 (not the lane's first): search by float Newton from a coarse grid near other L-zeros
F13o=L.Fam(13,L.fam(13,1))
ctx.prec=128
t=0.5
first=None
while t<1.5:
    sv,sw=F13o.Sv_Sw(arb(t))
    if sw<0 and first is None: first=(t,sw.str(8))
    t=round(t+0.002,6)
print("q=13 six odd, fine grid 0.5..1.5 step 0.002: first certified S_w<0:",first)
print("LemmaS q=5 certificate:",ok)
