import mpmath as mp
I = mp.mpc(0,1)
def Lchi(s):
    return mp.power(5,-s)*(mp.hurwitz(s,mp.mpf(1)/5)+I*mp.hurwitz(s,mp.mpf(2)/5)-I*mp.hurwitz(s,mp.mpf(3)/5)-mp.hurwitz(s,mp.mpf(4)/5))
