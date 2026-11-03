# Prefix-only finite checks of the dyadic eta-cost tail

Independently reviewed and replayed PASS. No new core integration or pivot reserve is used.

The accepted odd1 and corrected even2 arithmetic diagnostics supply coefficient-based Tail_K(64) bounds. The new eta-cost tail formula at M=5,J=64 differs from that bound by exactly
 5pi(log2)²(1+log_2 J)/(1+log²J/4).
The owned160-bit interval checker check_dyadic_cost_tail.py reads only the previously certified arithmetic-tail upper field and evaluates this factor. It does not use either successful pivot's lower bound.

The resulting actual-residual cost enclosures are
 odd1: E_5-6e-18 <= E <= E_5,
 even2: E_5 <= E <= E_5+3e-12.
Here E_5 contains the actual norm and first five translation correlations. The signs follow the new parity theorem because the relevant degree-only cutoff is64. The tighter computed absolute errors are below5.257e-18 and2.426e-12 respectively.

These bounds do not evaluate E_5 or prove a new comparison with the paired filtered surplus. They rigorously isolate that comparison to a finite set of actual correlations for the verified test rungs. No extrapolation to all degree or inherited base-residual correlation bound is made.
