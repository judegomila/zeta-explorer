# Actual parity jet spaces and the continuous-Gram sampling obstruction

This supplements the exact Fourier model in GRADED_RESIDUE.md. It does not concern the sign of the integrated bridge.

Let h_n be the real scaled Hermite functions for the Fourier convention exp(-2pi i t xi), so Fourier h_n=(-i)^n h_n. All have polynomial times exp(-pi t^2) form. For f_j=H_dil^j f_0 from the graded model, ordinary t-parity is even and Fourier parity is (-1)^j. Also f_j(0)=0 and its polynomial degree is exactly 2j+4.

It follows by dimension and the distinct leading degrees that

 span{f_0,f_2,...,f_(2m)}
 = {f in span(h_0,h_4,...,h_(4m+4)): f(0)=0},

 span{f_1,f_3,...,f_(2m+1)}
 = {f in span(h_2,h_6,...,h_(4m+6)): f(0)=0}.

The condition f(0)=0 is one nontrivial linear constraint because every listed even-index Hermite function has nonzero value at zero. Thus these are the ACTUAL differential-parity jet spaces, not enlarged arbitrary polynomial classes.

Consider already the even-jet space at h=0. Its full-theta sample functional is

    L(f)=sum_(n>=1) f(n)=(1/2)sum_(n in Z) f(n),

where f(0)=0. There is no constant C independent of degree such that |L(f)|<=C||f||_(L2(R)) throughout this union of actual even-jet spaces.

Here is a distribution proof that avoids any numerical conditioning claim. Hermite expansions converge in the Schwartz topology. By subtracting a fixed Fourier-positive even Gaussian-polynomial function with value 1 at zero, their partial sums can be made to vanish at zero without losing that convergence. Therefore the above union is Schwartz-dense in the even, Fourier-positive Schwartz functions with f(0)=0.

If L were bounded in continuous L2 on that union, it would have an L2 representative on its L2 closure. Project that representative onto the even Fourier-positive subspace, obtaining g in L2. By Schwartz density, the tempered distribution (1/2)Delta_Z-g would annihilate all Fourier-positive even Schwartz functions vanishing at zero, where Delta_Z=sum_(n in Z)delta_n is the Dirac comb. Both distributions can be restricted to the Fourier-positive even subspace. A linear functional vanishing on the kernel of evaluation at zero is a scalar multiple of that evaluation, so within this subspace it follows that

    (1/2)Delta_Z-g = c P_+ delta_0,
    P_+ delta_0=(delta_0+1)/2.

This is an equality of even Fourier-positive tempered distributions (test arbitrary Schwartz functions after applying the corresponding projection). It is impossible: the left side has point masses at every nonzero integer, whereas an L2 function together with a multiple of delta_0 and a constant cannot cancel those point masses. Thus the hypothesized C does not exist.

This establishes, in an actual fixed parity sector, that the positive continuous Fourier/Hermite Gram cannot control lattice evaluation by a degree-uniform scalar constant. It does NOT prove unboundedness of a suitably weighted integral over h, and does NOT give a negative bridge test. A proposed continuous-unitary-to-complete-bridge factorization must therefore retain the h-integration and its signed commutator/cross-orbit structure rather than inserting a uniform pointwise sampling bound.
