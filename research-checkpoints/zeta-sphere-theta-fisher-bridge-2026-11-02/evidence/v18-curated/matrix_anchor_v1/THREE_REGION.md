# Actual theta three-region factorization with a negative feature edge

Status: interval check, independent own-moment replay, and analytic review passed. Same normalized a=0 odd-degree19 matrix; no degree increase or all-order claim.

Use the three spatial regions [0,1/16], [1/16,1], [1,infinity), and the complete lower9-by-9 anchor A. Their actual feature Gram has positive edges

a=G_01 in(.9997131366,.9997141095),
b=G_12 in(2.465943,2.465947),

and a genuinely negative edge G_02=−w with

w in(.0004491646,.0004492135).

The exact triangle Laplacian is PSD precisely when the negative edge is no larger than the positive two-edge path conductance: w(1/a+1/b)<=1. The interval certificate proves the much stronger bound

w(1/a+1/b)<.00064.

Grounding the third vertex gives positive LDL lower pivots>.9992639232 and>2.4654923860. The actual regional projected-diagonal budgets are all positive:

rho_0>.0003311146,
rho_1>.3491529866,
rho_2>.1813963337.

Therefore the reviewed matrix-anchor theorem constructs three PSD auxiliary blocks, with zero-sum corrections recovering the actual complete matrix. Both signs of feature correlation are genuinely present; no assertion that the original spatial pieces are PSD is used.

The grouping was selected by an exploratory search and then validated independently with the complete-theta regional moment intervals. The search itself is not evidence and need not be included in the theorem packet.

## A usable localization sufficient bound
For a general three-region grouping, whiten the features to u_0,v,u_2, with norms a_0,V,a_2. If the two boundary-to-middle correlations satisfy

u_0·v>=a_0 V c_0>0,
u_2·v>=a_2 V c_2>0,

then any negative boundary-to-boundary edge has w<=a_0a_2. Hence its effective-resistance budget is bounded by

w(1/G_01+1/G_12) <= a_2/(V c_0)+a_0/(V c_2).

Thus a middle feature carrying most of the normalized cross-column mass can dominate an adverse boundary correlation. This is a concrete conditional theta-localization lemma. The separate regional residual inequalities rho_i>=0 remain essential; localization of the feature graph alone does not prove them or the full kernel sign. No uniform growing-degree control of those residuals has been established.
