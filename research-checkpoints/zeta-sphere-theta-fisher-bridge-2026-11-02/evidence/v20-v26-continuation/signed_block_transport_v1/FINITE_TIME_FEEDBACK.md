# Exact finite-time joint signed feedback across spatial blocks

Status: new algebra awaiting independent review; separate from frozen transport/flux core.

At endpoints lambda0,lambda1 use the SAME monomial coordinates for the degree-n parity feature space. Let global signed Grams be H0,H1, with invertible old blocks A0,A1 and old-to-new columns b0,b1. Let c1=-A1^-1 b1, e1=(c1,1), and r0=A0 c1+b0. Then the initial residual coefficient difference is
 d=c0-c1=-A0^-1 r0.
No auxiliary positive metric substitutes for A0. For each spatial block I let G_I0,G_I1 be its actual signed local Grams, A_I0 its old block, and r_I0=(G_I0 e1)_old. The exact regional Schur energy difference is
 Delta s_I=e1^T(G_I1-G_I0)e1
           +2 r0^T A0^-1 r_I0
           -r0^T A0^-1 A_I0 A0^-1 r0.
Proof: insert e0=e1+(d,0) in s_I0=e0^T G_I0 e0 and expand. This is an exact JOINT signed expression. Neither A_I0 nor its contribution is assumed PSD.

Upon summing all blocks (including the infinite tail), sum r_I0=r0 and sum A_I0=A0. Therefore the feedback terms telescope to the usual single positive global penalty when A0>0:
 sum Delta s_I=e1^T(H1-H0)e1+r0^T A0^-1 r0,
 s0=s1-e1^T(H1-H0)e1-r0^T A0^-1 r0.
Equivalently s0=e1^T H0 e1-r0^T A0^-1 r0. This is the exact endpoint Schur update, not a norm bound on two independently estimated forcing vectors.

Applying positive part ONLY AFTER assembling each complete Delta s_I gives the endpoint transport block budget. Splitting the two local feedback terms, replacing local A_I0 by absolute values, or paying separate matrix norms loses actual cancellation. Endpoint global positivity alone does not control each local term.

For k intermediate endpoints, the same expression holds on each adjacent pair using its actual initial inverse; coarsening time adds the signed Delta s_I before positive-part extraction, so the paid budget cannot increase. Every inverse/terminal factor remains explicit.

This identity is reusable in joint signed-feedback recursions: it tells exactly which local drift and regression-feedback terms must be coupled BEFORE estimating. It does not itself give a degree-uniform bound for their sum of positive block means.
