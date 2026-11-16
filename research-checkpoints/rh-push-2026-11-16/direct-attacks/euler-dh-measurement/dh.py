import mpmath as mp
mp.mp.dps = 40
I = mp.mpc(0,1)
chi  = [0, 1, I, -I, -1]          # chi mod 5, chi(2)=i
chib = [mp.conj(c) for c in chi]
def kap():   # recomputed at the working precision (an import-time constant breaks the FE at ~10^-dps0)
    return (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def f(s, d=0):
    k = kap()
    return ((1-I*k)/2)*mp.dirichlet(s,chi,d) + ((1+I*k)/2)*mp.dirichlet(s,chib,d)
def Lam(s):
    return (5/mp.pi)**(s/2)*mp.gamma((s+1)/2)*f(s)
if __name__=="__main__":
    for s in [mp.mpc(0.3,2.0), mp.mpc(0.8,10)]:
        print("FE check", mp.nstr(Lam(s)/Lam(1-s),15))
    print("off-line DH zero", mp.findroot(lambda s: f(s), mp.mpc(0.808517,85.699348)))
