from lp_pm import *
print("box dependence (r = 6, H0 comp): k = E (Lemma 1 + zero-free 7/8, pointwise) and k = D (family GRH)")
for bx in (F(1), F(3,2), F(2), F(3), F(4), F(8), F(16)):
    for K in ("E", "D"):
        show(f"G=src geo=src k={K} box {bx}", G="src", K=K, geo="src", box=bx)
        show(f"G=src geo=free k={K} box {bx}", G="src", K=K, geo="free", box=bx)
