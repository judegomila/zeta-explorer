# A positive regional old metric despite an indefinite local odd block

Independent analytic and64000-cell numerical replay PASS. This tests a genuinely regional replacement for the local old-block assumption. It does not certify the next target pivot.

## 1. Locate the failure of the local approach

Use the same local moments gj extracted from
 exp(2 sum_(l>=1)ell^(2l)(u) r^(2l)/(2l)!),
 with gj=(-1)^j4^-j times its2jth derivative. For the odd old basis t,t³,t⁵, the local block is
 A(u)=[[g1,g2,g3],[g2,g3,g4],[g3,g4,g5]].
The owned full-theta interval test encloses its LDL pivots for every u in[0,10^-8]:
 first >9.363451,
 second >3336.547,
 third <-1456173.
Thus the block is genuinely indefinite on an interval. The vanishing weight u² at the single point0 does not repair its negative direction on positive u. This agrees with the previously audited H5 pointwise-core obstruction. No degree7 target is needed to establish this failure.

This is the relevant old-block obstruction when continuing the *odd* family to degree7: the prior degree3 old block is positive, whereas the needed degree5 old block cannot be used as a pointwise positive metric. We do not claim a new all-degree classification or a unique transition location. The initial direct interval attempt on[0,10^-4] was too wide to resolve the sign; it was narrowed to obtain a rigorous neighborhood, not interpreted as a negative/positive proof.

## 2. Regional averaging repairs this old metric

Define, using w=u²psi² and evenness,
 A_C=integral_(|u|<=1/2) w(u)A(u)du,
 A_T=integral_(|u|>=1/2) w(u)A(u)du.
The same original density is integrated without removing any negative part. The owned64000-cell full-theta checker gives conservative LDL pivot lower bounds:

A_C: 0.363077, 272.701, 560066.
A_T: 0.00588537, 11.8557, 66443.

Both regional old matrices are therefore positive definite, despite local indefiniteness in the central region. These are LDL pivots in the stated raw basis, not smallest eigenvalues. The true global old block is exactly A_C+A_T, so its inverse is retained rather than replaced by an auxiliary parent norm.

## 3. Exact next-family identity, with the unpaid terms explicit

For the next odd family p=t7+z2 t5+z1 t3+z0 t, let each region have known old matrix A_i, target-column b_i=(M4_i,M5_i,M6_i)^T and target entry c_i=M7_i. Define
 z_i=-A_i^-1 b_i,
 s_i=c_i-b_i^T A_i^-1 b_i,
 zbar=-(A_C+A_T)^-1(b_C+b_T).
Then the actual global Schur remainder is exactly
 S=s_C+s_T+(z_C-zbar)^T A_C(z_C-zbar)
                  +(z_T-zbar)^T A_T(z_T-zbar)
  =s_C+s_T+(z_C-z_T)^T (A_C^-1+A_T^-1)^-1(z_C-z_T). (1)
The parallel-sum identity follows by completing the global quadratic form, or solving for zbar; no commutation of matrices is assumed. The final term is nonnegative because the *regional* old matrices have now been certified positive. Unlike the failed pointwise argument, this does not assume local A(u)>=0.

Crucially s_C and s_T remain signed and unpaid. The present checker computes only moments M1..M5. It does not compute target-specific M6,M7, use a degree7 reserve, or claim S>0. Thus(1) supplies a rigorously available regional metric for the next comparison, not a proof of that comparison.

## 4. Full-theta certificate and tails

`check_regional_old_block.py` uses160-bit Arb,64000 closed interval rectangles on[0,2], with the split at1/2 exactly on a cell boundary. It extracts log derivatives through10 and local moments throughg5. Source psi=f1(1+r), r=sum_(n>=2)A_n exp(-(n²-1)z), is the same complete-theta series as before.

The derivative proof extends with
 (1/2)(1-3/(2pi))^-11<1024,
 |D^j A_n|<=1024 n4 2^j j!, j<=10.
Leibniz gives C=2048*10!*4^10 and
 |D^j r_n|<=C n24 z10 exp(-(n²-1)z).
Since(10/9)^24 exp(-19pi)<1/2, the omitted n>=9 derivative tail is
 2C*9^24*z10 exp(-80z),                             (2)
added to all Taylor derivatives before taking log(1+r).

For z>=100 the improved2 n4 bound applies throughj10, yielding
 epsilon=8*10!*4^10*2^24*z10 exp(-3z)<1e-10.
Consequently |ell^(j)|<2^(j+2)j!z through10 and |gj|<=(2j)!(9z)^j throughj5, by the same coefficient majorant already reviewed. For the full spatial tail beyond|u|=2, Z=pi exp4, the moment error is bounded by
 (256/sqrt(pi))(2j)!9^j Z^(9/2+j)exp(-2Z).           (3)
All errors are retained symmetrically in the tail-region matrix. The largest bound, forM5, is less than5.4e-115.

The regional matrices therefore include all orbit indices and the entire spatial half-line. No unproved high-derivative orbit truncation is used.

## 5. What this changes, and what it does not

A failure of local old-block positivity does not force abandonment of the integrated square strategy: a concrete two-region positive old metric survives for this actual theta prefix. The compensation term in(1) is legitimate in that metric. But further regions/degrees cannot be assumed positive from this success, and the signed regional target remainders must still be evaluated or bounded together with the actual inverse feedback. A single whole-line region would reduce to the original unresolved Schur expression; the present nontrivial two-region result avoids that tautology only at the level of the verified old metric.
